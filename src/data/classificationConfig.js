// ---------------------------------------------------------------------------
// FORCE Classification Engine — all thresholds live here, in one place, so
// they can be tuned later without hunting through components.
// Assumes a 6-person family. If family size ever changes, revisit the
// hardcoded thresholds below (documented inline).
// ---------------------------------------------------------------------------

export const TOTAL_FAMILY_SIZE = 6;

// --- Completion Confidence thresholds -------------------------------------
// Fewer than this many reviews -> "gathering_intel" (no definitive pattern yet)
export const MIN_REVIEWS_FOR_PROVISIONAL = 4;
// At or above total family size -> "complete"

// --- Participation Pattern thresholds --------------------------------------
export const SQUAD_LOCK_MIN_POSITIVE = 5;
export const SQUAD_LOCK_MAX_NEGATIVE = 1;
export const SMALL_SQUAD_MIN_POSITIVE = 2;
export const SMALL_SQUAD_MAX_POSITIVE = 4;
export const SPLIT_MISSION_MIN_NEGATIVE = 2;
export const INDIVIDUAL_MISSION_POSITIVE = 1;
// "No Current Interest" only gets surfaced once at least this many people have
// weighed in — otherwise an early 🚫 or two looks like consensus prematurely.
export const MIN_REVIEWS_FOR_NO_INTEREST = MIN_REVIEWS_FOR_PROVISIONAL;

// --- Natural Squad overlap thresholds ---------------------------------------
// Minimum number of ITEMS BOTH PEOPLE HAVE REVIEWED before we'll assign a
// match label at all. Below this, two people just haven't given us enough
// shared data points yet — showing a label would be noise dressed as signal.
export const MIN_CO_REVIEWED_FOR_MATCH = 8;

// Per-item overlap weights (see computeItemOverlapWeight below for logic)
export const OVERLAP_WEIGHT_BOTH_MUST_DO = 3;
export const OVERLAP_WEIGHT_MUST_DO_PLUS_INTERESTED = 2;
export const OVERLAP_WEIGHT_BOTH_INTERESTED = 1;
export const OVERLAP_WEIGHT_ANY_NOT_FOR_ME = 0;

// Average-score cutoffs (average is weight-sum / co-reviewed-count, so it
// ranges 0–3) mapped to qualitative labels — never shown as a raw number.
export const MATCH_LABEL_THRESHOLDS = [
  { min: 2.2, label: "Strong Match" },
  { min: 1.4, label: "Good Match" },
  { min: 0.6, label: "Mixed Interests" },
  { min: -Infinity, label: "Different Missions" },
];

// --- Raw preference levels stored in the database ---------------------------
// One unified 3-level model reused across rides, dining, and HHN — the UI
// swaps in domain-specific icons/labels (see uiLabels.js) but the underlying
// data and math are identical everywhere.
export const LEVELS = {
  MUST_DO: "must_do",
  INTERESTED: "interested",
  NOT_FOR_ME: "not_for_me",
};

export function isPositive(level) {
  return level === LEVELS.MUST_DO || level === LEVELS.INTERESTED;
}

export function isNegative(level) {
  return level === LEVELS.NOT_FOR_ME;
}
