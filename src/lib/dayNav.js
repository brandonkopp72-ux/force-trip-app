import { MISSION_DAYS } from "../data/missionDays.js";

const DAY_ORDER = MISSION_DAYS.map((d) => d.id);

/**
 * Short rail-dock label for a day, derived from its existing `dateLabel`
 * ("MON 19" -> "MON") rather than a second hardcoded list of day
 * abbreviations living in a different file. Returns null for an unknown id.
 */
export function getShortDayLabel(dayId) {
  const day = MISSION_DAYS.find((d) => d.id === dayId);
  if (!day) return null;
  return day.dateLabel.split(" ")[0];
}

/**
 * The previous/next day id in the Mission Days sequence (Monday -> Friday),
 * or null at either end (Monday has no prevId, Friday has no nextId) — this
 * is what makes Monday's dock show only [FIVE DAYS] [TUE →] and Friday's
 * show only [← THU] [FIVE DAYS], per the Phase 5 spec.
 *
 * Pure and side-effect-free so the daily navigation dock's day-order logic
 * is unit-testable without rendering anything. The dock itself
 * (DayNavDock.jsx) only reads from this — the actual navigation is
 * performed by FiveDaysPage's existing `activeDayId` state, passed down as
 * `onNavigateDay`, so no new navigation state is introduced anywhere.
 */
export function getAdjacentDayIds(dayId) {
  const index = DAY_ORDER.indexOf(dayId);
  if (index === -1) return { prevId: null, nextId: null };
  return {
    prevId: index > 0 ? DAY_ORDER[index - 1] : null,
    nextId: index < DAY_ORDER.length - 1 ? DAY_ORDER[index + 1] : null,
  };
}
