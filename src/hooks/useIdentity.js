import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";

const STORAGE_KEY = "force_identity_v1"; // { person, pin } — see security note below

/**
 * Manages "who is using this device" for FORCE.
 *
 * SECURITY NOTE (intentional, per product decision): the PIN is remembered in
 * this browser's localStorage after the first successful login so people
 * aren't retyping it on every vote. That means anyone with access to this
 * physical device/browser could inspect localStorage and read the PIN. This
 * is explicitly acceptable per the stated threat model — the PIN exists to
 * stop accidental/casual edits between family members, not to resist someone
 * digging through your browser storage. Every write is still validated
 * server-side (see set_preference RPC) so this is never the ONLY thing
 * standing between a stranger and the data — Supabase RLS blocks direct
 * writes regardless of what's in localStorage.
 *
 * missionAccepted follows the SAME cross-device reasoning as votes/preferences:
 * it's read from family_members_public (safe to expose) and written only
 * through mark_mission_accepted, a PIN-validated RPC — never a direct write.
 */
export function useIdentity() {
  const [person, setPerson] = useState(null);
  const [pin, setPin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [missionAccepted, setMissionAccepted] = useState(false);

  const fetchMissionAccepted = useCallback(async (name) => {
    try {
      const { data, error } = await supabase
        .from("family_members_public")
        .select("mission_accepted")
        .eq("name", name)
        .maybeSingle();
      if (!error && data) return !!data.mission_accepted;
    } catch (e) {
      // Non-fatal — worst case, this login is treated as first-time.
    }
    return false;
  }, []);

  // On mount, re-validate any remembered identity against the server —
  // catches the case where Brandon changed someone's PIN since last visit.
  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setChecking(false);
          return;
        }
        const saved = JSON.parse(raw);
        const { data, error } = await supabase.rpc("verify_pin", {
          p_person: saved.person,
          p_pin: saved.pin,
        });
        if (!error && data === true) {
          setPerson(saved.person);
          setPin(saved.pin);
          setMissionAccepted(await fetchMissionAccepted(saved.person));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
      setChecking(false);
    })();
  }, [fetchMissionAccepted]);

  const login = useCallback(
    async (name, enteredPin) => {
      setLoginError("");
      const { data, error } = await supabase.rpc("verify_pin", { p_person: name, p_pin: enteredPin });
      if (error) {
        setLoginError("Couldn't reach the server. Check your connection and try again.");
        return false;
      }
      if (data !== true) {
        setLoginError("That PIN doesn't match. Try again, or ask Brandon.");
        return false;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ person: name, pin: enteredPin }));
      setPerson(name);
      setPin(enteredPin);
      setMissionAccepted(await fetchMissionAccepted(name));
      return true;
    },
    [fetchMissionAccepted]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPerson(null);
    setPin(null);
    setMissionAccepted(false);
  }, []);

  // Called only once Accept Mission has been clicked AND the Mission
  // Accepted transition has genuinely finished — never earlier.
  const markMissionAccepted = useCallback(async () => {
    if (!person || !pin) return;
    setMissionAccepted(true); // optimistic — a failed background write shouldn't relock navigation
    try {
      await supabase.rpc("mark_mission_accepted", { p_person: person, p_pin: pin });
    } catch (e) {
      // Non-fatal for this session; will simply re-show onboarding next login
      // if the write never landed, which is the safe failure direction.
    }
  }, [person, pin]);

  return { person, pin, checking, loginError, login, logout, missionAccepted, markMissionAccepted };
}
