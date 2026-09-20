import { useState } from "react";
import { MISSION_DAYS } from "../data/missionDays.js";
import { useReducedMotion } from "../hooks/useReducedMotion.js";
import { MONDAY_MISSION } from "../data/mondayMission.js";
import { TUESDAY_MISSION } from "../data/tuesdayMission.js";
import { WEDNESDAY_MISSION } from "../data/wednesdayMission.js";
import { THURSDAY_MISSION } from "../data/thursdayMission.js";
import { FRIDAY_MISSION } from "../data/fridayMission.js";
import { MissionDayPage } from "./MissionDayPage.jsx";

// All five days now have a real Mission Rail page — Phase 4 filled in the
// four added here. DayDetailPlaceholder below is unreachable in practice now
// (every MISSION_DAYS id has a matching entry) but stays as a safety net for
// any future day added to missionDays.js before its mission config exists.
const MISSION_PAGES = {
  monday: MONDAY_MISSION,
  tuesday: TUESDAY_MISSION,
  wednesday: WEDNESDAY_MISSION,
  thursday: THURSDAY_MISSION,
  friday: FRIDAY_MISSION,
};

// Text always sits at the bottom of a card (justifyContent: flex-end), but
// each day's gradient reaches a different brightness there — Friday's
// calmer, lighter palette in particular. A bottom scrim layered on top of
// day.background (CSS stacks background layers in the order listed, so
// this one paints over it) keeps white text readable regardless of which
// day's gradient sits underneath, without changing any day's colors.
const withScrim = (background) => `linear-gradient(to bottom, rgba(5,7,15,0) 30%, rgba(5,7,15,0.78) 100%), ${background}`;

function DayCard({ day, index, reduced, onSelect }) {
  const entranceStyle = reduced
    ? {}
    : { animation: "forceCardEnter 480ms ease-out both", animationDelay: `${Math.min(index * 60, 320)}ms` };

  return (
    <button
      onClick={() => onSelect(day.id)}
      className="force-v2-card"
      style={{
        ...entranceStyle,
        textAlign: "left",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: withScrim(day.background),
        padding: "22px 20px",
        minHeight: 165,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        color: "#fff",
        font: "inherit",
      }}
    >
      {!reduced && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 80% 15%, ${day.accent}33 0%, transparent 55%)`,
            animation: "forceAmbientPulse 7s ease-in-out infinite",
            animationDelay: `${index * 0.6}s`,
            pointerEvents: "none",
          }}
        />
      )}

      {day.icon && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            fontSize: 22,
            opacity: 0.8,
            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.5))",
          }}
        >
          {day.icon}
        </span>
      )}

      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: day.accent, marginBottom: 8 }}>
          {day.dateLabel}
        </div>
        {day.parkLines.map((line) => (
          <div key={line} style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: "0.02em", lineHeight: 1.25 }}>
            {line}
          </div>
        ))}
        <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "rgba(255,255,255,0.8)", marginTop: 10 }}>
          MISSION: <span style={{ color: day.accent, fontWeight: 700 }}>{day.missionIdentity}</span>
        </div>
      </div>
    </button>
  );
}

function DayDetailPlaceholder({ day, onBack }) {
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
          marginBottom: 30,
          display: "block",
        }}
      >
        ← FIVE DAYS
      </button>

      <div
        style={{
          textAlign: "center",
          borderRadius: 16,
          border: "1px solid rgba(143,179,255,0.16)",
          background: withScrim(day.background),
          padding: "40px 24px",
        }}
      >
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: day.accent, marginBottom: 10 }}>
          {day.dateLabel}
        </div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(20px, 4.5vw, 26px)", marginBottom: 10 }}>
          {day.missionIdentity}
        </div>
        <div style={{ fontSize: 13, letterSpacing: "0.15em", color: "rgba(255,255,255,0.75)", marginBottom: 26 }}>
          MISSION BRIEF COMING ONLINE
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", maxWidth: 360, margin: "0 auto" }}>
          The full day-by-day mission briefing unlocks in a later phase.
        </div>
      </div>
    </div>
  );
}

/**
 * The gateway into the eventual daily Mission Rail pages. Phase 2 stops at
 * a clickable grid of five day cards; clicking one shows a placeholder
 * detail view instead of a real day page. `activeDayId` + this
 * grid/detail toggle IS the navigation shape Phase 3 reuses — it swaps
 * DayDetailPlaceholder for a real MissionDayPage keyed by the same id,
 * rather than being thrown away.
 */
export function FiveDaysPage({ votesByItem, topPicks }) {
  const reduced = useReducedMotion();
  const [activeDayId, setActiveDayId] = useState(null);

  if (activeDayId) {
    const mission = MISSION_PAGES[activeDayId];
    if (mission) {
      return (
        <MissionDayPage
          mission={mission}
          votesByItem={votesByItem}
          topPicks={topPicks}
          onBack={() => setActiveDayId(null)}
          // Phase 5's daily navigation dock reuses this exact activeDayId
          // state to switch days directly — no separate navigation state.
          onNavigateDay={setActiveDayId}
        />
      );
    }
    const day = MISSION_DAYS.find((d) => d.id === activeDayId);
    return <DayDetailPlaceholder day={day} onBack={() => setActiveDayId(null)} />;
  }

  return (
    <div style={{ padding: "18px 0 12px" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 5vw, 30px)",
            letterSpacing: "0.04em",
            lineHeight: 1.15,
          }}
        >
          FIVE DAYS.
          <br />
          ONE MISSION.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {MISSION_DAYS.map((day, i) => (
          <DayCard key={day.id} day={day} index={i} reduced={reduced} onSelect={setActiveDayId} />
        ))}
      </div>
    </div>
  );
}
