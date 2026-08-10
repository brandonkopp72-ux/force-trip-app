import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase.js";

/**
 * Loads every family member's preferences, keeps them live via Supabase
 * Realtime, and exposes a single write path (setPreference) that goes
 * through the PIN-validating RPC — this component never writes to the
 * preferences table directly.
 */
export function useVotes(person, pin) {
  // votesByItem = { itemId: { personName: "must_do" | "interested" | "not_for_me" } }
  const [votesByItem, setVotesByItem] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | saving | synced | error
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const memberNamesRef = useRef({}); // family_member_id -> name, needed to translate realtime rows

  // Initial load: pull family_members (id+name only — never pin_hash, RLS blocks that
  // column-level anyway) and all current preferences, then build the nested map.
  const loadAll = useCallback(async () => {
    const { data: members, error: memberErr } = await supabase.from("family_members_public").select("id, name");
    if (memberErr) {
      setSyncStatus("error");
      return;
    }
    const nameById = {};
    members.forEach((m) => (nameById[m.id] = m.name));
    memberNamesRef.current = nameById;

    const { data: prefs, error: prefErr } = await supabase
      .from("preferences")
      .select("family_member_id, item_id, preference");
    if (prefErr) {
      setSyncStatus("error");
      return;
    }

    const map = {};
    prefs.forEach((row) => {
      const name = nameById[row.family_member_id];
      if (!name) return;
      if (!map[row.item_id]) map[row.item_id] = {};
      map[row.item_id][name] = row.preference;
    });
    setVotesByItem(map);
    setLoaded(true);
    setLastSyncedAt(new Date());
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Realtime subscription — applies INSERT/UPDATE/DELETE to local state directly
  // rather than refetching everything, so updates feel instant.
  useEffect(() => {
    const channel = supabase
      .channel("preferences-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "preferences" }, (payload) => {
        const nameById = memberNamesRef.current;
        setVotesByItem((prev) => {
          const next = { ...prev };
          if (payload.eventType === "DELETE") {
            const row = payload.old;
            const name = nameById[row.family_member_id];
            if (name && next[row.item_id]) {
              const itemMap = { ...next[row.item_id] };
              delete itemMap[name];
              next[row.item_id] = itemMap;
            }
          } else {
            const row = payload.new;
            const name = nameById[row.family_member_id];
            if (name) {
              next[row.item_id] = { ...(next[row.item_id] || {}), [name]: row.preference };
            }
          }
          return next;
        });
        setLastSyncedAt(new Date());
      })
      .subscribe((status) => {
        setRealtimeConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /**
   * Sets (or clears, if level is null) the CURRENT user's preference for one item.
   * Optimistically updates local state, then confirms via the PIN-validating RPC.
   * Rolls back on failure and reports an honest error.
   */
  const setPreference = useCallback(
    async (itemId, level) => {
      if (!person || !pin) return { ok: false, message: "Not signed in." };

      const previousLevel = votesByItem[itemId]?.[person] ?? null;
      setSyncStatus("saving");
      setVotesByItem((prev) => {
        const next = { ...prev };
        const itemMap = { ...(next[itemId] || {}) };
        if (level) itemMap[person] = level;
        else delete itemMap[person];
        next[itemId] = itemMap;
        return next;
      });

      const { error } = await supabase.rpc("set_preference", {
        p_person: person,
        p_pin: pin,
        p_item_id: itemId,
        p_preference: level,
      });

      if (error) {
        // Roll back the optimistic update — don't leave the UI showing something
        // that isn't actually saved.
        setVotesByItem((prev) => {
          const next = { ...prev };
          const itemMap = { ...(next[itemId] || {}) };
          if (previousLevel) itemMap[person] = previousLevel;
          else delete itemMap[person];
          next[itemId] = itemMap;
          return next;
        });
        setSyncStatus("error");
        return { ok: false, message: "Couldn't save this selection. Tap to retry." };
      }

      setSyncStatus("synced");
      setLastSyncedAt(new Date());
      return { ok: true };
    },
    [person, pin, votesByItem]
  );

  /**
   * Mutually-exclusive picks (Droid Depot vs Savi's, HHN meal strategy, Friday
   * plan) — stored as preference="chosen" on exactly one item within a group.
   * Uses a dedicated RPC so the "clear the group's other options" logic lives
   * in one place server-side rather than being reconstructed on the client.
   */
  const setSingleChoice = useCallback(
    async (groupItemIds, chosenItemId) => {
      if (!person || !pin) return { ok: false, message: "Not signed in." };

      const alreadyChosen = votesByItem[chosenItemId]?.[person] === "chosen";
      const newChosenId = alreadyChosen ? null : chosenItemId;

      setSyncStatus("saving");
      setVotesByItem((prev) => {
        const next = { ...prev };
        groupItemIds.forEach((id) => {
          const itemMap = { ...(next[id] || {}) };
          delete itemMap[person];
          next[id] = itemMap;
        });
        if (newChosenId) {
          next[newChosenId] = { ...(next[newChosenId] || {}), [person]: "chosen" };
        }
        return next;
      });

      const { error } = await supabase.rpc("set_single_choice", {
        p_person: person,
        p_pin: pin,
        p_group_item_ids: groupItemIds,
        p_chosen_item_id: newChosenId,
      });

      if (error) {
        setSyncStatus("error");
        loadAll(); // simplest correct rollback for a multi-row change: refetch truth
        return { ok: false, message: "Couldn't save this choice. Tap to retry." };
      }
      setSyncStatus("synced");
      setLastSyncedAt(new Date());
      return { ok: true };
    },
    [person, pin, votesByItem, loadAll]
  );

  /**
   * Top Dinner Pick — at most one per person, and only for a restaurant they
   * already rated "Yes" (stored as must_do). The RPC enforces that rule
   * server-side so it can't be bypassed by calling it directly.
   */
  const [topPicks, setTopPicks] = useState({}); // { personName: itemId }

  const loadTopPicks = useCallback(async () => {
    const { data, error } = await supabase.from("dinner_top_picks").select("family_member_id, item_id");
    if (error) return;
    const nameById = memberNamesRef.current;
    const map = {};
    data.forEach((row) => {
      const name = nameById[row.family_member_id];
      if (name) map[name] = row.item_id;
    });
    setTopPicks(map);
  }, []);

  useEffect(() => {
    if (loaded) loadTopPicks();
  }, [loaded, loadTopPicks]);

  const setTopDinnerPick = useCallback(
    async (itemId) => {
      if (!person || !pin) return { ok: false, message: "Not signed in." };
      const { error } = await supabase.rpc("set_top_dinner_pick", {
        p_person: person,
        p_pin: pin,
        p_item_id: itemId,
      });
      if (error) {
        return { ok: false, message: error.message?.includes("must rate") 
          ? "You can only top-pick a restaurant you've rated \"Yes\"."
          : "Couldn't save your top pick. Tap to retry." };
      }
      setTopPicks((prev) => ({ ...prev, [person]: itemId }));
      return { ok: true };
    },
    [person, pin]
  );

  return {
    votesByItem,
    loaded,
    syncStatus,
    lastSyncedAt,
    realtimeConnected,
    setPreference,
    setSingleChoice,
    topPicks,
    setTopDinnerPick,
    reload: loadAll,
  };
}
