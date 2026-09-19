import { useState, useRef, useEffect } from "react";
import { useIdentity } from "./hooks/useIdentity.js";
import { useVotes } from "./hooks/useVotes.js";
import { useAudioPreference } from "./hooks/useAudioPreference.js";
import { unlockAudio } from "./lib/audioEngine.js";
import { IdentityGate } from "./components/IdentityGate.jsx";
import { MissionTransition } from "./components/MissionTransition.jsx";
import { CinematicIntro } from "./components/CinematicIntro.jsx";
import { ParkPage } from "./components/ParkPage.jsx";
import { RationsPage } from "./components/RationsPage.jsx";
import { ResourcesPage } from "./components/ResourcesPage.jsx";
import { MissionProfilePage } from "./components/MissionProfilePage.jsx";
import { FamilyDebriefPage } from "./components/FamilyDebriefPage.jsx";
import { PlannerView } from "./components/PlannerView.jsx";
import { IdentityHeader } from "./components/IdentityHeader.jsx";
import { FinalApproachPage } from "./components/FinalApproachPage.jsx";
import { LightspeedTransition } from "./components/LightspeedTransition.jsx";
import { V2Shell } from "./components/V2Shell.jsx";
import { V2CountdownBar } from "./components/V2CountdownBar.jsx";
import { generateStarfield, STARFIELD_COUNT } from "./lib/starfield.js";
import { PARKS } from "./data/parks.js";

const ZONE_PARKS = PARKS.filter((p) => !p.isDeparture);
const DEPARTURE = PARKS.find((p) => p.isDeparture);

// Fixed accent colors for the non-park tabs, matching the original F.O.R.C.E. palette.
// "intro" removed — CinematicIntro now owns that role pre-briefing, not a revisitable tab.
const STATIC_TAB_ACCENTS = {
  resources: { accent: "#2f5d42", accentSoft: "#e7efe6" },
  rations: { accent: "#7a2b2b", accentSoft: "#f2e6e6" },
  profile: { accent: "#1f4e79", accentSoft: "#e5edf5" },
  debrief: { accent: "#8a6d1f", accentSoft: "#f3ecd8" },
  planner: { accent: "#4a1414", accentSoft: "#f0e2e2" },
};

export default function App() {
  const { person, pin, checking, loginError, login, logout, missionAccepted, markMissionAccepted } = useIdentity();
  const votes = useVotes(person, pin);
  const { muted, toggleMuted } = useAudioPreference(person);
  const [tab, setTab] = useState("resources");

  // Coarse experience state — App owns ONLY where the user is in the overall
  // flow. CinematicIntro owns all of its own internal animation timing.
  //   "login"        -> IdentityGate
  //   "cinematic"    -> CinematicIntro overlay (briefing content already mounted underneath)
  //   "briefing"     -> Resources tab active, all other navigation locked
  //   "planning"     -> the original V1 experience: normal, unrestricted tab
  //                     navigation. Reached ONLY via Mission Archives now —
  //                     see the routing effect below.
  //   "finalApproach" -> the V2-era accepted-user landing page (V2 Phase 1).
  //                      Offers FINAL MISSION BRIEF (-> "lightspeed") and
  //                      MISSION ARCHIVES (-> "planning", replay overlay).
  //   "lightspeed"    -> one-shot streak transition, then -> "v2".
  //   "v2"            -> the new V2 shell (countdown + placeholder destination).
  const [experiencePhase, setExperiencePhase] = useState("login");
  const [cinematicMounted, setCinematicMounted] = useState(false);
  const [replayMode, setReplayMode] = useState(false);
  const [activeTransition, setActiveTransition] = useState(null);

  // One shared star array for the whole session, generated once (lazy
  // initializer). Both FinalApproachPage's idle starfield and
  // LightspeedTransition's streaks render from THIS SAME array — same
  // anchor positions, thickness, and brightness — so clicking FINAL
  // MISSION BRIEF reads as those exact stars accelerating rather than an
  // unrelated starfield popping in. See src/lib/starfield.js.
  const [starfieldStars] = useState(() => generateStarfield(STARFIELD_COUNT));

  const tabRefs = useRef({});
  const tabRowRef = useRef(null);

  // Login resolves exactly as before, but now branches on whether this
  // person has already completed onboarding (persisted server-side).
  // Returning members skip straight to the normal planning app; first-timers
  // (or anyone whose acceptance never successfully recorded) get the full
  // cinematic sequence, same as always.
  const handleLogin = async (name, enteredPin) => {
    unlockAudio(); // tied directly to this click/submit gesture, before any await
    const ok = await login(name, enteredPin);
    if (ok) {
      // missionAccepted reflects the value fetched during this same login
      // call — safe to read synchronously right after `login` resolves.
    }
    return ok;
  };

  // missionAccepted can only become known truthfully once login has
  // actually resolved, so branch the phase transition here rather than
  // inside handleLogin's own return timing.
  //
  // person is set BEFORE the mission_accepted fetch resolves (both in the
  // localStorage auto-login effect and in login() itself), so there's a
  // real intermediate render where person is truthy but missionAccepted
  // hasn't come back from the server yet. Without the `!== null` check,
  // that render would read the not-yet-loaded value as "not accepted" and
  // route every login — including a returning, already-accepted person —
  // into the first-time cinematic. Once there, this effect's own
  // experiencePhase === "login" guard means it can never self-correct when
  // the real value arrives a moment later. Waiting for missionAccepted to
  // actually be known (useIdentity now starts it at null, not false)
  // closes that window.
  //
  // Accepted users land on Final Approach (V2 Phase 1) rather than going
  // straight into V1's tab navigation — the intentional path back into V1
  // is Mission Archives, reached FROM Final Approach.
  useEffect(() => {
    if (person && missionAccepted !== null && experiencePhase === "login") {
      if (missionAccepted) {
        setExperiencePhase("finalApproach");
      } else {
        setExperiencePhase("cinematic");
        setCinematicMounted(true);
      }
    }
  }, [person, missionAccepted, experiencePhase]);

  // Force the tab to Resources the moment briefing begins, and keep it there
  // for as long as briefing is active (see TabButton onClick guards below).
  useEffect(() => {
    if (experiencePhase === "briefing") {
      setTab("resources");
    }
  }, [experiencePhase]);

  // Called by CinematicIntro the instant its CTA is clicked — onboarding
  // mode only (replay mode passes no onCtaClick at all, see render below).
  // Starts the restored Intel Acquired (dataBarrage) transition immediately
  // — it renders underneath CinematicIntro's own fading overlay (lower
  // z-index), so the two blend into each other rather than showing a blank
  // frame between them.
  const handleCtaClick = () => {
    if (activeTransition) return; // re-entrancy guard, defense-in-depth alongside CinematicIntro's own guard
    setActiveTransition({
      variant: "dataBarrage",
      primary: "INTEL ACQUIRED",
      secondary: "MISSION RESOURCES ONLINE",
      verifiedText: "DOWNLINK INITIATED",
      accent: "#e8963a",
      duration: 3400,
      onCompletePhase: "briefing",
    });
  };

  // Called by CinematicIntro only once its own exit-fade transition has
  // genuinely finished — safe to unmount the overlay now. In onboarding
  // mode, Intel Acquired (started at CTA click, above) continues running
  // independently. In replay mode, nothing else was started, so this simply
  // ends the replay and returns the person to whatever they were already
  // looking at underneath.
  const handleCinematicExitComplete = () => {
    setCinematicMounted(false);
    setReplayMode(false);
  };

  // The former ResourcesPage terminal action ("Review Mission Objectives →")
  // becomes Accept Mission — this is now the ONLY way past the briefing.
  // markAcceptance:true tags this specific transition so the onComplete
  // handler below knows to persist mission-acceptance exactly here — not
  // for the Intel Acquired transition, which shares the same component.
  // onCompletePhase is explicit here (rather than relying on the default
  // fallback below) so a first-time acceptance lands on Final Approach,
  // same as every returning login does.
  const handleAcceptMission = () => {
    if (activeTransition) return; // re-entrancy guard
    setActiveTransition({
      primary: "MISSION ACCEPTED",
      secondary: "FORCE TRAVEL COMMAND",
      accent: "#3ddc84",
      duration: 3600,
      nextTab: ZONE_PARKS[0].id,
      markAcceptance: true,
      onCompletePhase: "finalApproach",
    });
  };

  // Replay Mission Opening (Profile page). Deliberately does NOT touch
  // experiencePhase, tab, or navigation locking at all — the cinematic is
  // just an overlay on top of whatever's already showing underneath, and
  // nothing about voting/navigation state is affected by mounting it.
  const handleReplayMissionOpening = () => {
    if (cinematicMounted) return;
    unlockAudio(); // this click is its own user gesture
    setReplayMode(true);
    setCinematicMounted(true);
  };

  // Mission Archives (Final Approach -> V1). Per the approved plan this
  // should feel like RETURNING to the original experience, not opening a
  // generic tab page — so it enters the V1 shell ("planning") AND
  // automatically invokes the existing replay overlay, reusing
  // handleReplayMissionOpening verbatim. It deliberately does nothing else:
  // no markMissionAccepted call, no activeTransition, no tab reset (tab is
  // only ever force-reset when entering "briefing", which this never does)
  // — so votes, mission-acceptance, and navigation locking are all
  // untouched, and whatever tab the person left V1 on is still there once
  // the replay closes.
  const handleEnterMissionArchives = () => {
    setExperiencePhase("planning");
    handleReplayMissionOpening();
  };

  // Final Approach -> lightspeed -> v2. Just a phase change; the
  // LightspeedTransition component itself owns the one-shot visual/audio
  // and calls back into setExperiencePhase("v2") on completion (see render).
  const handleEnterV2 = () => {
    setExperiencePhase("lightspeed");
  };

  // The small return-to-Final-Approach affordance, reachable from both
  // V1/Mission Archives (the header link below) and V2 (V2Shell). Just a
  // phase change — doesn't touch tab, votes, or mission-acceptance.
  const handleReturnToFinalApproach = () => {
    setExperiencePhase("finalApproach");
  };

  // Keep the active tab scrolled to the center of the tab bar whenever it changes.
  useEffect(() => {
    const node = tabRefs.current[tab];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [tab]);

  if (checking) {
    return <div style={{ padding: 40, textAlign: "center", color: "#8a8272" }}>Loading…</div>;
  }

  if (!person) {
    return <IdentityGate onLogin={handleLogin} loginError={loginError} />;
  }

  const initials = person.slice(0, 2).toUpperCase();

  // The original V1 top header (with LOG OUT) stays persistent across
  // Final Approach and V2 too — same IdentityHeader component the V1 shell
  // below uses, not a lookalike copy. V2CountdownBar docks directly beneath
  // it on BOTH screens (Final Approach and V2 itself), as persistent V2
  // chrome rather than something V2Shell owns on its own.
  //
  // Both wrappers are flex columns with paddingBottom overridden to 0 (the
  // app-shell class normally adds 40px) so the header, countdown bar, and
  // page content are three stacked flex items filling the full viewport
  // height between them — the page content uses flex:1 so its themed
  // background reaches the bottom of the viewport even when the content
  // itself is short, rather than leaving cream page background exposed
  // beneath a shorter dark block. This is a layout fix scoped to these two
  // V2-era wrappers only; V1's own .app-shell usage further below is
  // untouched.
  //
  // The lightspeed transition is the one exception to all of this: it's a
  // ~2s full-bleed streak effect with nothing to log out of or count down
  // mid-flight, so it renders with no header/countdown at all.
  if (experiencePhase === "finalApproach") {
    return (
      <div className="app-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: 0 }}>
        <IdentityHeader
          person={person}
          initials={initials}
          onLogout={logout}
          syncStatus={votes.syncStatus}
          lastSyncedAt={votes.lastSyncedAt}
          realtimeConnected={votes.realtimeConnected}
        />
        <V2CountdownBar />
        <FinalApproachPage
          stars={starfieldStars}
          onFinalMissionBrief={handleEnterV2}
          onMissionArchives={handleEnterMissionArchives}
        />
      </div>
    );
  }

  if (experiencePhase === "lightspeed") {
    return <LightspeedTransition stars={starfieldStars} onComplete={() => setExperiencePhase("v2")} />;
  }

  if (experiencePhase === "v2") {
    return (
      <div className="app-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: 0 }}>
        <IdentityHeader
          person={person}
          initials={initials}
          onLogout={logout}
          syncStatus={votes.syncStatus}
          lastSyncedAt={votes.lastSyncedAt}
          realtimeConnected={votes.realtimeConnected}
        />
        <V2CountdownBar />
        <V2Shell onReturnToFinalApproach={handleReturnToFinalApproach} votesByItem={votes.votesByItem} />
      </div>
    );
  }

  const currentPark = PARKS.find((p) => p.id === tab);

  // Navigation is locked to Resources for the whole briefing phase — the
  // only way through is Accept Mission at the bottom of that page.
  const navigationLocked = experiencePhase === "briefing";
  const guardedSetTab = (id) => {
    if (navigationLocked) return;
    setTab(id);
  };

  return (
    <div className="app-shell">
      {/* Same IdentityHeader component now used above Final Approach and V2 —
          showReturnLink only applies in Mission Archives (the only way
          "planning" is reached now); it's a quiet text link, not another
          row of nav buttons in this header. */}
      <IdentityHeader
        person={person}
        initials={initials}
        onLogout={logout}
        showReturnLink={experiencePhase === "planning"}
        onReturnToFinalApproach={handleReturnToFinalApproach}
        syncStatus={votes.syncStatus}
        lastSyncedAt={votes.lastSyncedAt}
        realtimeConnected={votes.realtimeConnected}
      />

      <div className="tab-row" ref={tabRowRef} style={{ opacity: navigationLocked ? 0.6 : 1 }}>
        <TabButton
          tabRefs={tabRefs}
          id="resources"
          active={tab === "resources"}
          onClick={() => guardedSetTab("resources")}
          sub="🔗"
          label="Resources"
          accent={STATIC_TAB_ACCENTS.resources.accent}
          accentSoft={STATIC_TAB_ACCENTS.resources.accentSoft}
        />
        {ZONE_PARKS.map((p, i) => (
          <TabButton
            key={p.id}
            tabRefs={tabRefs}
            id={p.id}
            active={tab === p.id}
            onClick={() => guardedSetTab(p.id)}
            disabled={navigationLocked}
            sub={`ZONE ${String(i + 1).padStart(2, "0")}`}
            label={p.park}
            accent={p.accent}
            accentSoft={p.accentSoft}
          />
        ))}
        <TabButton
          tabRefs={tabRefs}
          id="rations"
          active={tab === "rations"}
          onClick={() => guardedSetTab("rations")}
          disabled={navigationLocked}
          sub="🍽"
          label="Rations"
          accent={STATIC_TAB_ACCENTS.rations.accent}
          accentSoft={STATIC_TAB_ACCENTS.rations.accentSoft}
        />
        {DEPARTURE && (
          <TabButton
            tabRefs={tabRefs}
            id={DEPARTURE.id}
            active={tab === DEPARTURE.id}
            onClick={() => guardedSetTab(DEPARTURE.id)}
            disabled={navigationLocked}
            sub="DEPARTURE"
            label={DEPARTURE.park}
            accent={DEPARTURE.accent}
            accentSoft={DEPARTURE.accentSoft}
          />
        )}
        <TabButton
          tabRefs={tabRefs}
          id="profile"
          active={tab === "profile"}
          onClick={() => guardedSetTab("profile")}
          disabled={navigationLocked}
          sub="👤"
          label="My Profile"
          accent={STATIC_TAB_ACCENTS.profile.accent}
          accentSoft={STATIC_TAB_ACCENTS.profile.accentSoft}
        />
        <TabButton
          tabRefs={tabRefs}
          id="debrief"
          active={tab === "debrief"}
          onClick={() => guardedSetTab("debrief")}
          disabled={navigationLocked}
          sub="🎉"
          label="Debrief"
          accent={STATIC_TAB_ACCENTS.debrief.accent}
          accentSoft={STATIC_TAB_ACCENTS.debrief.accentSoft}
        />
        <TabButton
          tabRefs={tabRefs}
          id="planner"
          active={tab === "planner"}
          onClick={() => guardedSetTab("planner")}
          disabled={navigationLocked}
          sub="📊"
          label="Planner"
          accent={STATIC_TAB_ACCENTS.planner.accent}
          accentSoft={STATIC_TAB_ACCENTS.planner.accentSoft}
        />
      </div>

      {tab === "resources" && <ResourcesPage onAdvance={handleAcceptMission} advanceLabel="Accept Mission" />}

      {currentPark && !navigationLocked && (
        <ParkPage
          park={currentPark}
          votesByItem={votes.votesByItem}
          myName={person}
          onSetLevel={votes.setPreference}
          onChooseSingle={votes.setSingleChoice}
          onAdvance={() => {
            const idx = PARKS.findIndex((p) => p.id === currentPark.id);
            const next = PARKS[idx + 1];
            setTab(next ? next.id : "debrief");
          }}
          advanceLabel={currentPark.id === DEPARTURE?.id ? "See the Mission Debrief →" : undefined}
        />
      )}

      {tab === "rations" && !navigationLocked && (
        <RationsPage
          votesByItem={votes.votesByItem}
          myName={person}
          onSetLevel={votes.setPreference}
          topPicks={votes.topPicks}
          onSetTopPick={votes.setTopDinnerPick}
        />
      )}

      {tab === "profile" && !navigationLocked && (
        <MissionProfilePage
          myName={person}
          votesByItem={votes.votesByItem}
          onReplayMissionOpening={handleReplayMissionOpening}
          replayDisabled={cinematicMounted}
          muted={muted}
          onToggleMuted={toggleMuted}
        />
      )}
      {tab === "debrief" && !navigationLocked && <FamilyDebriefPage votesByItem={votes.votesByItem} />}
      {tab === "planner" && !navigationLocked && <PlannerView votesByItem={votes.votesByItem} topPicks={votes.topPicks} />}

      {activeTransition && (
        <MissionTransition
          {...activeTransition}
          onComplete={() => {
            const next = activeTransition.nextTab;
            const nextPhase = activeTransition.onCompletePhase || "finalApproach";
            if (activeTransition.markAcceptance) markMissionAccepted();
            setActiveTransition(null);
            setExperiencePhase(nextPhase);
            if (next) setTab(next);
          }}
        />
      )}

      {cinematicMounted && (
        <CinematicIntro
          mode={replayMode ? "replay" : "onboarding"}
          onCtaClick={replayMode ? undefined : handleCtaClick}
          onExitComplete={handleCinematicExitComplete}
          muted={muted}
          onToggleMuted={toggleMuted}
        />
      )}
    </div>
  );
}

function TabButton({ tabRefs, id, active, onClick, disabled, sub, label, accent, accentSoft }) {
  return (
    <button
      ref={(node) => {
        if (node) tabRefs.current[id] = node;
      }}
      className={`tab ${active ? "active" : ""}`}
      onClick={onClick}
      aria-disabled={disabled || undefined}
      style={{
        borderColor: active ? accent : "transparent",
        background: active ? accentSoft : "transparent",
        color: active ? accent : "#7a7263",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div className="tab-sub">{sub}</div>
      <div className="tab-label">{label}</div>
    </button>
  );
}
