// ---------------------------------------------------------------------------
// Pure, side-effect-free classification functions. No React, no Supabase —
// this file takes plain preference data in and returns plain labels out, so
// it can be unit tested directly and reused by both the family-facing
// Mission Debrief and the analytical Planner View.
// ---------------------------------------------------------------------------

import {
  TOTAL_FAMILY_SIZE,
  MIN_REVIEWS_FOR_PROVISIONAL,
  MIN_REVIEWS_FOR_NO_INTEREST,
  SQUAD_LOCK_MIN_POSITIVE,
  SQUAD_LOCK_MAX_NEGATIVE,
  SMALL_SQUAD_MIN_POSITIVE,
  SMALL_SQUAD_MAX_POSITIVE,
  SPLIT_MISSION_MIN_NEGATIVE,
  INDIVIDUAL_MISSION_POSITIVE,
  MIN_CO_REVIEWED_FOR_MATCH,
  OVERLAP_WEIGHT_BOTH_MUST_DO,
  OVERLAP_WEIGHT_MUST_DO_PLUS_INTERESTED,
  OVERLAP_WEIGHT_BOTH_INTERESTED,
  OVERLAP_WEIGHT_ANY_NOT_FOR_ME,
  MATCH_LABEL_THRESHOLDS,
  LEVELS,
  isPositive,
  isNegative,
} from "../data/classificationConfig.js";

/**
 * Tallies raw counts from a map of { personName: level }.
 * Missing/undefined entries count as unreviewed (blank).
 */
export function tallyVotes(votersMap, familySize = TOTAL_FAMILY_SIZE) {
  const levels = Object.values(votersMap || {});
  const mustDo = levels.filter((l) => l === LEVELS.MUST_DO).length;
  const interested = levels.filter((l) => l === LEVELS.INTERESTED).length;
  const notForMe = levels.filter((l) => l === LEVELS.NOT_FOR_ME).length;
  const positive = mustDo + interested;
  const negative = notForMe;
  const reviewed = positive + negative;
  const unreviewed = Math.max(0, familySize - reviewed);
  return { mustDo, interested, notForMe, positive, negative, reviewed, unreviewed };
}

/**
 * Completion confidence: "gathering_intel" | "likely" | "complete"
 */
export function getCompletionConfidence(reviewedCount, familySize = TOTAL_FAMILY_SIZE) {
  if (reviewedCount >= familySize) return "complete";
  if (reviewedCount >= MIN_REVIEWS_FOR_PROVISIONAL) return "likely";
  return "gathering_intel";
}

/**
 * Participation pattern — mutually exclusive category describing WHO wants it.
 * Returns one of:
 *   "squad_lock" | "small_squad" | "split_mission" | "individual_mission" |
 *   "no_current_interest" | "insufficient_data"
 */
export function getParticipationPattern(positive, negative, reviewedCount, familySize = TOTAL_FAMILY_SIZE) {
  if (positive >= SQUAD_LOCK_MIN_POSITIVE && negative <= SQUAD_LOCK_MAX_NEGATIVE) {
    return "squad_lock";
  }
  if (positive === INDIVIDUAL_MISSION_POSITIVE) {
    return "individual_mission";
  }
  if (positive >= SMALL_SQUAD_MIN_POSITIVE && positive <= SMALL_SQUAD_MAX_POSITIVE) {
    return negative >= SPLIT_MISSION_MIN_NEGATIVE ? "split_mission" : "small_squad";
  }
  if (positive === 0) {
    return reviewedCount >= MIN_REVIEWS_FOR_NO_INTEREST ? "no_current_interest" : "insufficient_data";
  }
  // Safety net for any combination not covered above (shouldn't occur with a
  // 6-person family, but keeps the function total rather than undefined).
  return "insufficient_data";
}

/**
 * Must-Do Anchor is a MODIFIER, not a category — can co-exist with any pattern.
 */
export function hasMustDoAnchor(mustDoCount) {
  return mustDoCount >= 1;
}

/**
 * Full classification for one item, combining all three dimensions.
 */
export function classifyItem(votersMap, familySize = TOTAL_FAMILY_SIZE) {
  const counts = tallyVotes(votersMap, familySize);
  const confidence = getCompletionConfidence(counts.reviewed, familySize);
  const pattern = getParticipationPattern(counts.positive, counts.negative, counts.reviewed, familySize);
  const mustDoAnchor = hasMustDoAnchor(counts.mustDo);
  return { ...counts, confidence, pattern, mustDoAnchor };
}

// ---------------------------------------------------------------------------
// Natural Squad overlap
// ---------------------------------------------------------------------------

/**
 * Overlap weight for a single item, given both people's levels on it.
 * Returns null if either person hasn't reviewed it (item doesn't count).
 */
export function computeItemOverlapWeight(levelA, levelB) {
  if (!levelA || !levelB) return null; // not co-reviewed
  if (isNegative(levelA) || isNegative(levelB)) return OVERLAP_WEIGHT_ANY_NOT_FOR_ME;
  if (levelA === LEVELS.MUST_DO && levelB === LEVELS.MUST_DO) return OVERLAP_WEIGHT_BOTH_MUST_DO;
  if (
    (levelA === LEVELS.MUST_DO && levelB === LEVELS.INTERESTED) ||
    (levelA === LEVELS.INTERESTED && levelB === LEVELS.MUST_DO)
  ) {
    return OVERLAP_WEIGHT_MUST_DO_PLUS_INTERESTED;
  }
  if (levelA === LEVELS.INTERESTED && levelB === LEVELS.INTERESTED) return OVERLAP_WEIGHT_BOTH_INTERESTED;
  return OVERLAP_WEIGHT_ANY_NOT_FOR_ME;
}

/**
 * Computes overlap between two people across a list of items.
 * `votesByItem` = { itemId: { personName: level } }
 * `itemIds` = which items to consider (e.g. all ride items across the trip)
 *
 * Returns { coReviewedCount, averageScore, label }
 * label is null (shown as "Gathering Intel") until MIN_CO_REVIEWED_FOR_MATCH is met.
 */
export function computeNaturalSquadOverlap(personA, personB, votesByItem, itemIds) {
  let sum = 0;
  let coReviewedCount = 0;

  itemIds.forEach((itemId) => {
    const votersMap = votesByItem[itemId] || {};
    const weight = computeItemOverlapWeight(votersMap[personA], votersMap[personB]);
    if (weight !== null) {
      sum += weight;
      coReviewedCount += 1;
    }
  });

  if (coReviewedCount < MIN_CO_REVIEWED_FOR_MATCH) {
    return { coReviewedCount, averageScore: null, label: null };
  }

  const averageScore = sum / coReviewedCount;
  const match = MATCH_LABEL_THRESHOLDS.find((t) => averageScore >= t.min);
  return { coReviewedCount, averageScore, label: match ? match.label : "Different Missions" };
}
