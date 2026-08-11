import { useState, useRef, useEffect } from "react";
import { useIdentity } from "./hooks/useIdentity.js";
import { useVotes } from "./hooks/useVotes.js";
import { IdentityGate } from "./components/IdentityGate.jsx";
import { MissionTransition } from "./components/MissionTransition.jsx";
import { IntroPage } from "./components/IntroPage.jsx";
import { ParkPage } from "./components/ParkPage.jsx";
import { RationsPage } from "./components/RationsPage.jsx";
import { ResourcesPage } from "./components/ResourcesPage.jsx";
import { MissionProfilePage } from "./components/MissionProfilePage.jsx";
import { FamilyDebriefPage } from "./components/FamilyDebriefPage.jsx";
import { PlannerView } from "./components/PlannerView.jsx";
import { SyncStatus } from "./components/SyncStatus.jsx";
import { PARKS } from "./data/parks.js";

const ZONE_PARKS = PARKS.filter((p) => !p.isDeparture);
const DEPARTURE = PARKS.find((p) => p.isDeparture);

// Fixed accent colors for the non-park tabs, matching the original F.O.R.C.E. palette.
const STATIC_TAB_ACCENTS = {
  intro: { accent: "#5b3a86", accentSoft: "#eee7f5" },
  resources: { accent: "#2f5d42", accentSoft: "#e7efe6" },
  rations: { accent: "#7a2b2b", accentSoft: "#f2e6e6" },
  profile: { accent: "#1f4e79", accentSoft: "#e5edf5" },
  debrief: { accent: "#8a6d1f", accentSoft: "#f3ecd8" },
  planner: { accent: "#4a1414", accentSoft: "#f0e2e2" },
};

export default function App() {
  const { person, pin, checking, loginError, login, logout } = useIdentity();
  const votes = useVotes(person, pin);
  const [tab, setTab] = useState("intro");
  const [activeTransition, setActiveTransition] = useState(null);
  const tabRefs = useRef({});
  const tabRowRef = useRef(null);

  // Login always resolves exactly as before — the transition is layered on
  // AFTER a successful PIN check, never used to fake or delay authentication.
  const handleLogin = async (name, enteredPin) => {
    const ok = await login(name, enteredPin);
    if (ok) {
      setActiveTransition({
        primary: "MISSION ACCEPTED",
        secondary: "FORCE TRAVEL COMMAND",
        accent: "#3ddc84",
        duration: 1800,
      });
    }
    return ok;
  };

  // Intro → Resources: a distinct amber "intel downlink" event, not a
  // recolor of the login transition. nextTab fires once the animation
  // completes, so the tab switch happens on the far side of the transmission.
  const handleIntelDownlink = () => {
    setActiveTransition({
      variant: "dataBarrage",
      primary: "INTEL ACQUIRED",
      secondary: "MISSION RESOURCES ONLINE",
      verifiedText: "DOWNLINK INITIATED",
      accent: "#e8963a",
      duration: 1700,
      nextTab: "resources",
    });
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
  const currentPark = PARKS.find((p) => p.id === tab);

  return (
    <div className="app-shell">
      <div className="header">
        <div>
          <div className="eyebrow">F.O.R.C.E. — Family Of Rebels Creating Experiences</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div className="identity-badge">
            <span className="avatar">{initials}</span>
            {person}
            <button className="switch-link" onClick={logout} style={{ marginLeft: 6 }}>
              Not {person}?
            </button>
          </div>
          <SyncStatus syncStatus={votes.syncStatus} lastSyncedAt={votes.lastSyncedAt} realtimeConnected={votes.realtimeConnected} />
        </div>
      </div>

      <div className="tab-row" ref={tabRowRef}>
        <TabButton
          tabRefs={tabRefs}
          id="intro"
          active={tab === "intro"}
          onClick={() => setTab("intro")}
          sub="✦"
          label="Intro"
          accent={STATIC_TAB_ACCENTS.intro.accent}
          accentSoft={STATIC_TAB_ACCENTS.intro.accentSoft}
        />
        <TabButton
          tabRefs={tabRefs}
          id="resources"
          active={tab === "resources"}
          onClick={() => setTab("resources")}
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
            onClick={() => setTab(p.id)}
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
          onClick={() => setTab("rations")}
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
            onClick={() => setTab(DEPARTURE.id)}
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
          onClick={() => setTab("profile")}
          sub="👤"
          label="My Profile"
          accent={STATIC_TAB_ACCENTS.profile.accent}
          accentSoft={STATIC_TAB_ACCENTS.profile.accentSoft}
        />
        <TabButton
          tabRefs={tabRefs}
          id="debrief"
          active={tab === "debrief"}
          onClick={() => setTab("debrief")}
          sub="🎉"
          label="Debrief"
          accent={STATIC_TAB_ACCENTS.debrief.accent}
          accentSoft={STATIC_TAB_ACCENTS.debrief.accentSoft}
        />
        <TabButton
          tabRefs={tabRefs}
          id="planner"
          active={tab === "planner"}
          onClick={() => setTab("planner")}
          sub="📊"
          label="Planner"
          accent={STATIC_TAB_ACCENTS.planner.accent}
          accentSoft={STATIC_TAB_ACCENTS.planner.accentSoft}
        />
      </div>

      {tab === "intro" && <IntroPage onAccept={handleIntelDownlink} />}
      {tab === "resources" && <ResourcesPage onAdvance={() => setTab(ZONE_PARKS[0].id)} />}

      {currentPark && (
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

      {tab === "rations" && (
        <RationsPage
          votesByItem={votes.votesByItem}
          myName={person}
          onSetLevel={votes.setPreference}
          topPicks={votes.topPicks}
          onSetTopPick={votes.setTopDinnerPick}
        />
      )}

      {tab === "profile" && <MissionProfilePage myName={person} votesByItem={votes.votesByItem} />}
      {tab === "debrief" && <FamilyDebriefPage votesByItem={votes.votesByItem} />}
      {tab === "planner" && <PlannerView votesByItem={votes.votesByItem} />}

      {activeTransition && (
        <MissionTransition
          {...activeTransition}
          onComplete={() => {
            const next = activeTransition.nextTab;
            setActiveTransition(null);
            if (next) setTab(next);
          }}
        />
      )}
    </div>
  );
}

function TabButton({ tabRefs, id, active, onClick, sub, label, accent, accentSoft }) {
  return (
    <button
      ref={(node) => {
        if (node) tabRefs.current[id] = node;
      }}
      className={`tab ${active ? "active" : ""}`}
      onClick={onClick}
      style={{
        borderColor: active ? accent : "transparent",
        background: active ? accentSoft : "transparent",
        color: active ? accent : "#7a7263",
      }}
    >
      <div className="tab-sub">{sub}</div>
      <div className="tab-label">{label}</div>
    </button>
  );
}
