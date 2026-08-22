import { HeroBanner } from "./HeroBanner.jsx";
import { buildPersonalProfile, buildSquadOverlaps } from "../lib/tripStats.js";

export function MissionProfilePage({ myName, votesByItem, onReplayMissionOpening, replayDisabled, muted, onToggleMuted }) {
  if (!myName) return null;
  const profile = buildPersonalProfile(myName, votesByItem);
  const overlaps = buildSquadOverlaps(myName, votesByItem);

  return (
    <div className="page">
      <HeroBanner accent="#1f4e79" title={`${myName.toUpperCase()}'S MISSION PROFILE`} subtitle="Your personal stats and squad matches" />

      <div className="card">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: 14 }}>
          <span>⭐ {profile.mustDo} Must Do{profile.mustDo !== 1 ? "s" : ""}</span>
          <span>❤️ {profile.interested} I'd Do It{profile.interested !== 1 ? "s" : ""}</span>
          <span>🚫 {profile.notForMe} Not For Me</span>
          {profile.thrill > 0 && <span>🎢 {profile.thrill} Thrill</span>}
          {profile.hhnHouses > 0 && <span>👻 {profile.hhnHouses} HHN houses</span>}
        </div>
        {profile.topPark && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: "#6b6455" }}>
            Your park with the most Must-Dos: <strong>{profile.topPark}</strong>
          </div>
        )}
      </div>

      {profile.priorityMissions.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            Your Priority Missions
          </div>
          {profile.priorityMissions.map((name) => (
            <div key={name} style={{ fontSize: 13.5, marginBottom: 3 }}>
              ⭐ {name}
            </div>
          ))}
        </div>
      )}

      {overlaps.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            Your Best Squad Matches
          </div>
          {overlaps.map((o) => (
            <div key={o.person} style={{ fontSize: 13.5, marginBottom: 3 }}>
              {o.person} — {o.label}
            </div>
          ))}
        </div>
      )}
      {overlaps.length === 0 && (
        <div className="card" style={{ color: "#8a8272", fontSize: 12.5, fontStyle: "italic" }}>
          Gathering Intel — squad matches need more shared reviews from at least one other person before we can call
          it.
        </div>
      )}

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Dining</div>
        <div style={{ fontSize: 13.5 }}>
          {profile.dining.yes} Yes · {profile.dining.fine} Fine With It · {profile.dining.no} No Thanks
        </div>
      </div>

      {(onReplayMissionOpening || onToggleMuted) && (
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {onReplayMissionOpening && (
            <button
              onClick={onReplayMissionOpening}
              disabled={replayDisabled}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#1f4e79",
                background: "none",
                border: "1px solid #c7d3de",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: replayDisabled ? "not-allowed" : "pointer",
                opacity: replayDisabled ? 0.5 : 1,
              }}
            >
              🎬 Replay Mission Opening
            </button>
          )}
          {onToggleMuted && (
            <button
              onClick={onToggleMuted}
              style={{
                fontSize: 11.5,
                color: "#8a8272",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              {muted ? "🔇 Cinematic audio: off" : "🔊 Cinematic audio: on"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
