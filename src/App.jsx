import { useState } from "react";
import { useIdentity } from "./hooks/useIdentity.js";
import { useVotes } from "./hooks/useVotes.js";
import { IdentityGate } from "./components/IdentityGate.jsx";
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

export default function App() {
  const { person, pin, checking, loginError, login, logout } = useIdentity();
  const votes = useVotes(person, pin);
  const [tab, setTab] = useState("resources");

  if (checking) {
    return <div style={{ padding: 40, textAlign: "center", color: "#8a8272" }}>Loading…</div>;
  }

  if (!person) {
    return <IdentityGate onLogin={login} loginError={loginError} />;
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

      <div className="tab-row">
        <TabButton active={tab === "resources"} onClick={() => setTab("resources")} sub="✦" label="Resources" />
        {ZONE_PARKS.map((p, i) => (
          <TabButton key={p.id} active={tab === p.id} onClick={() => setTab(p.id)} sub={`ZONE ${String(i + 1).padStart(2, "0")}`} label={p.park} />
        ))}
        <TabButton active={tab === "rations"} onClick={() => setTab("rations")} sub="🍽" label="Rations" />
        {DEPARTURE && <TabButton active={tab === DEPARTURE.id} onClick={() => setTab(DEPARTURE.id)} sub="DEPARTURE" label={DEPARTURE.park} />}
        <TabButton active={tab === "profile"} onClick={() => setTab("profile")} sub="👤" label="My Profile" />
        <TabButton active={tab === "debrief"} onClick={() => setTab("debrief")} sub="🎉" label="Debrief" />
        <TabButton active={tab === "planner"} onClick={() => setTab("planner")} sub="📊" label="Planner" />
      </div>

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
    </div>
  );
}

function TabButton({ active, onClick, sub, label }) {
  return (
    <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>
      <div className="tab-sub">{sub}</div>
      <div className="tab-label">{label}</div>
    </button>
  );
}
