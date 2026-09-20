import { useEffect } from "react";
import { getParkHours, formatEveningWindow } from "../data/parkHours.js";
import { getParkNameById } from "../data/parks.js";
import { getDayPageBackground } from "../data/dayThemes.js";
import { useReducedMotion } from "../hooks/useReducedMotion.js";
import { RailBlock, HardNodeContent, EntertainmentNodeContent } from "./RailBlocks.jsx";
import { MissionRail } from "./MissionRail.jsx";
import { DayNavDock } from "./DayNavDock.jsx";

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
 *
 * Phase 5 additions (visual/navigation polish only — no rail structure,
 * times, or content changed):
 *   - a per-day page background (dayThemes.js), applied behind this whole
 *     page and stretching naturally to its full content height so it reads
 *     as "progressive" while scrolling with zero JS/scroll-jacking.
 *   - a sticky bottom day-navigation dock (DayNavDock.jsx). `onNavigateDay`
 *     is FiveDaysPage's existing `activeDayId` setter passed straight
 *     through — this component creates no navigation state of its own.
 *   - since switching days reuses this same component instance (only the
 *     `mission` prop changes, no remount), an effect resets scroll to the
 *     top of the new day's rail on every `mission.id` change, per the
 *     spec's "do not preserve the previous day's scroll position."
 */
export function MissionDayPage({ mission, votesByItem, topPicks, onBack, onNavigateDay }) {
  // ioa/usf carry different hours on different visit days (Tuesday vs.
  // Thursday), so getParkHours needs the day id too — see parkHours.js.
  // It's simply ignored for parks with one flat entry (hs/epic/hhn).
  const hours = getParkHours(mission.parkId, mission.id);
  const { operatingIntel } = mission;
  const secondary = mission.secondaryOperatingIntel;
  const secondaryHours = secondary ? getParkHours(secondary.parkId, mission.id) : null;
  const reduced = useReducedMotion();
  const pageBackground = getDayPageBackground(mission.id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [mission.id]);

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
    <div
      style={{
        // Bottom padding is boosted (vs. the 12px every other V2 screen
        // uses) so the sticky DayNavDock never covers the last rail node —
        // plus room for phones with a home-indicator safe area.
        padding: "18px 0 calc(96px + env(safe-area-inset-bottom, 0px))",
        background: pageBackground || undefined,
        borderRadius: pageBackground ? 16 : undefined,
        position: "relative",
      }}
    >
      {!reduced && (
        <style>{`
          @keyframes forceDayPageEnter {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}
      {/* Keying on mission.id restarts this fade-in each time the day
          changes via the nav dock, even though MissionDayPage itself is
          never remounted (only its `mission` prop changes). */}
      <div key={mission.id} style={!reduced ? { animation: "forceDayPageEnter 360ms ease-out both" } : undefined}>
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
        {mission.parkToParkIntel?.enabled && (
          <ParkToParkIntelStrip
            intel={mission.parkToParkIntel}
            accent={mission.accent}
            secondaryHours={
              mission.parkToParkIntel.secondaryParkId
                ? getParkHours(mission.parkToParkIntel.secondaryParkId, mission.id)
                : null
            }
          />
        )}
      </div>

      <MissionRail nodes={railNodes} />
      </div>

      {onNavigateDay && (
        <DayNavDock currentDayId={mission.id} onNavigateDay={onNavigateDay} onFiveDays={onBack} />
      )}
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

const intelLabelStyle = {
  fontFamily: "'Oswald', sans-serif",
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: "#8fb3ff",
};

/**
 * Compact Park-to-Park Intel strip — Phase 5 correction pass. Tuesday and
 * Thursday both have Park-to-Park admission (Islands of Adventure + Universal
 * Studios Florida in play the same day), and the family specifically wants
 * to ride Hogwarts Express during the trip. This is intentionally NOT
 * another large content card: one compact box, same information
 * architecture on both days (the station diagram and Train Objective line
 * never change), with only `primaryPark` and `flowNote` varying per day via
 * `mission.parkToParkIntel` — see tuesdayMission.js/thursdayMission.js.
 *
 * This does not add any attraction cards for the "other" park — crossing
 * over is communicated as flexible trip intel, not attraction-card clutter,
 * per the spec ("expand options without making the page twice as dense").
 * No completion tracking, no checkbox for whether the train got ridden.
 *
 * Phase 6 addition: `secondaryHours` (resolved by MissionDayPage via
 * `mission.parkToParkIntel.secondaryParkId`) surfaces the OTHER park's
 * hours today, since that's genuinely useful if you're deciding whether a
 * crossing is worth it — without standing up a whole second
 * OperatingIntelStrip section (this stays the one compact box). Renders
 * nothing extra if the secondary park's hours aren't resolved for this day.
 */
function ParkToParkIntelStrip({ intel, accent, secondaryHours }) {
  return (
    <div
      style={{
        marginTop: 10,
        background: "rgba(143,179,255,0.05)",
        border: "1px solid rgba(143,179,255,0.18)",
        borderRadius: 12,
        padding: "12px 16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <span style={intelLabelStyle}>PARK-TO-PARK INTEL</span>
        <span style={{ fontSize: 10.5, letterSpacing: "0.08em", color: "#7c88a6" }}>
          TODAY'S BASE: <span style={{ color: accent, fontWeight: 700 }}>{intel.primaryPark?.toUpperCase()}</span>
        </span>
      </div>

      <div style={{ fontSize: 12.5, color: "#c9d3e8", lineHeight: 1.5, marginBottom: 12 }}>
        Both Universal Studios Florida and Islands of Adventure are in play today — Park-to-Park admission required.
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
        <StationChip station="HOGSMEADE STATION" parkLabel="Islands of Adventure" />
        <span aria-hidden="true" style={{ color: "#8fb3ff", fontSize: 16, lineHeight: 1 }}>↕</span>
        <StationChip station="KING'S CROSS STATION" parkLabel="Universal Studios Florida" />
      </div>

      {secondaryHours && (
        <div style={{ fontSize: 12, color: "#a9b4cc", marginBottom: intel.trainObjective || intel.flowNote ? 10 : 0 }}>
          {getParkNameById(intel.secondaryParkId)} today, if you cross over:{" "}
          <span style={{ color: "#dbe9ff", fontWeight: 700 }}>
            {secondaryHours.open} – {secondaryHours.close}
            {secondaryHours.confirmed ? "" : " (est.)"}
          </span>
        </div>
      )}

      {intel.trainObjective && (
        <div style={{ marginBottom: intel.flowNote ? 10 : 0 }}>
          <div style={{ ...intelLabelStyle, marginBottom: 3 }}>TRAIN OBJECTIVE</div>
          <div style={{ fontSize: 12.5, color: "#dbe9ff", lineHeight: 1.5 }}>
            Work a Hogwarts Express crossing into the day when it fits naturally.
          </div>
        </div>
      )}

      {intel.flowNote && <div style={{ fontSize: 12, fontStyle: "italic", color: "#a9b4cc", lineHeight: 1.5 }}>{intel.flowNote}</div>}
    </div>
  );
}

function StationChip({ station, parkLabel }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "6px 10px",
      }}
    >
      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#dbe9ff" }}>
        {station}
      </span>
      <span style={{ fontSize: 11, color: "#7c88a6" }}>{parkLabel}</span>
    </div>
  );
}
