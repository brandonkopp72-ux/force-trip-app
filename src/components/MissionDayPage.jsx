import { getParkHours } from "../data/parkHours.js";
import { RailBlock, HardNodeContent } from "./RailBlocks.jsx";
import { MissionRail } from "./MissionRail.jsx";

/**
 * Generic Mission Day orchestrator — Monday is the first day wired to it,
 * but nothing here is Monday-specific. It takes one day's config (the same
 * shape as mondayMission.js's MONDAY_MISSION) and:
 *   1. renders the header (mission number / title / date)
 *   2. renders the compact Operating Intel strip (park + hours + the day's
 *      one locked event, if any)
 *   3. maps `mission.rail` into MissionRail's node shape, building each
 *      node's `content` via RailBlock (flexible nodes' blocks) or
 *      HardNodeContent (a hard node's fixed fields) — MissionRail itself
 *      never sees mission-specific data, only the resulting JSX.
 *
 * Tuesday-Friday reuse this component unchanged in Phase 4 — they just
 * pass their own day config.
 */
export function MissionDayPage({ mission, votesByItem, onBack }) {
  const hours = getParkHours(mission.parkId);
  const { operatingIntel } = mission;

  const railNodes = mission.rail.map((node) => ({
    id: node.id,
    kind: node.kind,
    heading: node.heading,
    tint: node.tint,
    time: node.time,
    content:
      node.kind === "hard" ? (
        <HardNodeContent node={node} />
      ) : (
        node.blocks.map((block, i) => <RailBlock key={i} block={block} votesByItem={votesByItem} />)
      ),
  }));

  return (
    <div style={{ padding: "18px 0 12px" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#8fb3ff",
          fontSize: 11.5,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: "0.04em",
          cursor: "pointer",
          padding: 4,
          marginBottom: 22,
          display: "block",
        }}
      >
        ← FIVE DAYS
      </button>

      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 11.5,
            letterSpacing: "0.18em",
            color: mission.accent,
            marginBottom: 6,
          }}
        >
          {mission.missionNumber}
        </div>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(24px, 5.5vw, 34px)",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {mission.title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{mission.date}</div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 36,
        }}
      >
        <IntelChip label="PARK" value={operatingIntel.parkLabel} />
        {hours && (
          <IntelChip
            label="HOURS"
            value={`${hours.open} – ${hours.close}${hours.confirmed ? "" : " (est.)"}`}
          />
        )}
        {operatingIntel.targetArrival && <IntelChip label="TARGET ARRIVAL" value={operatingIntel.targetArrival} />}
        {operatingIntel.lockedEvent && (
          <IntelChip label={operatingIntel.lockedEvent.label} value={operatingIntel.lockedEvent.time} accent={mission.accent} />
        )}
      </div>

      <MissionRail nodes={railNodes} />
    </div>
  );
}

function IntelChip({ label, value, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingRight: 14 }}>
      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", color: "#7c88a6" }}>
        {label}
      </span>
      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13.5, fontWeight: 700, color: accent || "#dbe9ff" }}>{value}</span>
    </div>
  );
}
