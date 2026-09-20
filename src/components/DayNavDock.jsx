import { MISSION_DAYS } from "../data/missionDays.js";
import { getAdjacentDayIds, getShortDayLabel } from "../lib/dayNav.js";

function accentFor(dayId) {
  const day = MISSION_DAYS.find((d) => d.id === dayId);
  return day ? day.accent : "#8fb3ff";
}

function DockButton({ accent, onClick, children, justify }) {
  return (
    <button
      className="force-dock-btn"
      onClick={onClick}
      style={{
        justifySelf: justify,
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 700,
        fontSize: 12.5,
        letterSpacing: "0.06em",
        color: accent,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${accent}55`,
        borderRadius: 999,
        padding: "10px 16px",
        minHeight: 40,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

/**
 * Sticky bottom navigation dock for daily Mission Rail pages only — Phase 5.
 * Lets the squad move directly between days without scrolling back to the
 * top or returning to Five Days first. Fixed to the viewport bottom (not
 * the page content), with safe-area padding for phones with a home
 * indicator.
 *
 * Deliberately reuses FiveDaysPage's existing `activeDayId` state rather
 * than creating any navigation state of its own: `onNavigateDay` is that
 * state's own setter, passed straight through by MissionDayPage, and
 * `onFiveDays` is the exact same `onBack` callback MissionDayPage's own
 * "← FIVE DAYS" link already uses.
 *
 * Always a 3-column grid (prev / FIVE DAYS / next) so the center action
 * stays visually centered on every day, including Monday (no prev button)
 * and Friday (no next button) — matching the spec's exact layouts:
 *   MONDAY:    [FIVE DAYS] [TUE →]
 *   TUE-THU:   [← prev]    [FIVE DAYS] [next →]
 *   FRIDAY:    [← THU]     [FIVE DAYS]
 */
export function DayNavDock({ currentDayId, onNavigateDay, onFiveDays }) {
  const { prevId, nextId } = getAdjacentDayIds(currentDayId);

  return (
    <div
      data-testid="day-nav-dock"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        display: "flex",
        justifyContent: "center",
        background: "rgba(6,9,18,0.86)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.09)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <style>{`
        .force-dock-btn {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }
        @media (hover: hover) {
          .force-dock-btn:hover {
            background: rgba(255,255,255,0.1) !important;
          }
        }
        .force-dock-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 600,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          {prevId && (
            <DockButton justify="start" accent={accentFor(prevId)} onClick={() => onNavigateDay(prevId)}>
              ← {getShortDayLabel(prevId)}
            </DockButton>
          )}
        </div>

        <DockButton justify="center" accent="#dbe9ff" onClick={onFiveDays}>
          FIVE DAYS
        </DockButton>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {nextId && (
            <DockButton justify="end" accent={accentFor(nextId)} onClick={() => onNavigateDay(nextId)}>
              {getShortDayLabel(nextId)} →
            </DockButton>
          )}
        </div>
      </div>
    </div>
  );
}
