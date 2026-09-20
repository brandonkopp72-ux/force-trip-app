import { getParkHours, formatEveningWindow } from "../data/parkHours.js";
import { RailBlock, HardNodeContent, EntertainmentNodeContent } from "./RailBlocks.jsx";
import { MissionRail } from "./MissionRail.jsx";

/**
 * Generic Mission Day orchestrator — Monday is the first day wired to it,
 * but nothing here is Monday-specific. It takes one day's config (the same
 * shape as mondayMission.js's MONDAY_MISSION) and:
 *   1. renders the header (mission number / title / date)
 *   2. renders the compact Operating Intel strip (park + hours + the day's
 *      one locked event, if any) — and, if the config sets
 *      `secondaryOperatingIntel`, a second strip beneath it for a day with
 *      two operating contexts (Thursday's Universal Studios daytime, then
 *      Halloween Horror Nights that evening). Monday never sets that field,
 *      so its render path — and output — is unchanged from Phase 3.
 *   3. maps `mission.rail` into MissionRail's node shape, building each
 *      node's `content`:
 *        - "hard" and "entertainment" nodes get their fixed-shape renderer
 *          (HardNodeContent / EntertainmentNodeContent) plus, if the node
 *          ALSO carries a `blocks` array, those blocks rendered underneath
 *          it (e.g. Friday's departure nodes are "hard" nodes that attach a
 *          flightPair block for the actual flight card — Oga's Cantina on
 *          Monday has no `blocks` at all, so nothing extra renders there,
 *          unchanged from Phase 3).
 *        - every other kind ("flexible"/"endpoint") renders its `blocks`
 *          array the same way Phase 3 always did.
 *      MissionRail itself never sees mission-specific data, only the
 *      resulting JSX.
 *
 *      Time resolution for a node (in order checked):
 *        - `timeFromParkHours: "open"` / `"close"` (or `true`, meaning
 *          close) → substituted from parkHours.js for `mission.parkId`.
 *        - `timeFromSecondaryParkHours: "open"` / `"close"` (or `true`) →
 *          same, but from `mission.secondaryOperatingIntel.parkId` instead
 *          (Thursday's HHN-anchored nodes use this to read HHN's own hours
 *          rather than USF's).
 *        - `rangeEndFromParkHours: true` → keeps the node's own literal
 *          start time and appends the (primary) park's close time as a
 *          range (e.g. "5:00–9:00 PM").
 *        - otherwise, the node's own literal `time`.
 *      Monday never sets any of the newer flags, so its output is
 *      unaffected either way — the real open/close time only ever needs
 *      updating in parkHours.js, never here or in a mission file.
 *
 * Tuesday-Friday reuse this component with their own day configs. `topPicks`
 * is additive (Phase 4) — it's only read by the "diningConsensus" block type
 * Tuesday/Wednesday use, via RailBlock; Monday's blocks never reference it.
 */
export function MissionDayPage({ mission, votesByItem, topPicks, onBack }) {
  const hours = getParkHours(mission.parkId);
  const { operatingIntel } = mission;
  const secondary = mission.secondaryOperatingIntel;
  const secondaryHours = secondary ? getParkHours(secondary.parkId) : null;

  const railNodes = mission.rail.map((node) => {
    let time = node.time;
    if (node.timeFromParkHours === "open") time = hours?.open;
    else if (node.timeFromParkHours) time = hours?.close;
    else if (node.timeFromSecondaryParkHours === "open") time = secondaryHours?.open;
    else if (node.timeFromSecondaryParkHours) time = secondaryHours?.close;
    else if (node.rangeEndFromParkHours && hours?.close) time = formatEveningWindow(node.time, hours.close);

    const extraBlocks = (node.blocks || []).map((block, i) => (
      <RailBlock key={i} block={block} votesByItem={votesByItem} topPicks={topPicks} />
    ));

    let content;
    if (node.kind === "hard") {
      content = [<HardNodeContent key="fixed" node={node} />, ...extraBlocks];
    } else if (node.kind === "entertainment") {
      content = [<EntertainmentNodeContent key="fixed" node={node} />, ...extraBlocks];
    } else {
      content = extraBlocks;
    }

    return {
      id: node.id,
      kind: node.kind,
      heading: node.heading,
      tint: node.tint,
      time,
      content,
    };
  });

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

      <div style={{ marginBottom: 36 }}>
        <OperatingIntelStrip
          parkLabel={operatingIntel.parkLabel}
          hours={hours}
          targetArrival={operatingIntel.targetArrival}
          lockedEvent={operatingIntel.lockedEvent}
          accent={mission.accent}
          bottomGap={secondary ? 10 : 0}
        />
        {secondary && (
          <OperatingIntelStrip
            parkLabel={secondary.parkLabel}
            hours={secondaryHours}
            targetArrival={secondary.targetArrival}
            lockedEvent={secondary.lockedEvent}
            accent={secondary.accent || mission.accent}
            earlyAccessLabel={secondary.earlyAccessLabel}
            bottomGap={0}
          />
        )}
      </div>

      <MissionRail nodes={railNodes} />
    </div>
  );
}

/**
 * One Operating Intel strip. Extracted from the single always-one-of-these
 * layout Monday shipped with, so Thursday can render a second one beneath it
 * for Halloween Horror Nights without duplicating the container styling.
 * The EARLY ADMISSION / SCREAM EARLY ACCESS chips are additive: they only
 * render when the resolved `hours` object actually carries `epa` or
 * `earlyAccess` (see parkHours.js) — Monday's `hs` entry has neither, so
 * its strip's chip set is unchanged from Phase 3.
 */
function OperatingIntelStrip({ parkLabel, hours, targetArrival, lockedEvent, accent, earlyAccessLabel, bottomGap }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: bottomGap,
      }}
    >
      <IntelChip label="PARK" value={parkLabel} />
      {hours?.epa && <IntelChip label="EARLY ADMISSION" value={hours.epa} />}
      {hours && <IntelChip label="HOURS" value={`${hours.open} – ${hours.close}${hours.confirmed ? "" : " (est.)"}`} />}
      {hours?.earlyAccess && <IntelChip label={earlyAccessLabel || "EARLY ACCESS"} value={hours.earlyAccess} />}
      {targetArrival && <IntelChip label="TARGET ARRIVAL" value={targetArrival} />}
      {lockedEvent && <IntelChip label={lockedEvent.label} value={lockedEvent.time} accent={accent} />}
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
