import { describe, it, expect } from "vitest";
import {
  tallyVotes,
  getCompletionConfidence,
  getParticipationPattern,
  hasMustDoAnchor,
  classifyItem,
  computeItemOverlapWeight,
  computeNaturalSquadOverlap,
} from "./classification.js";
import { LEVELS } from "../data/classificationConfig.js";

const { MUST_DO, INTERESTED, NOT_FOR_ME } = LEVELS;

describe("getParticipationPattern", () => {
  it("Squad Lock: 5 positive / 1 negative", () => {
    expect(getParticipationPattern(5, 1, 6)).toBe("squad_lock");
  });

  it("Squad Lock: 6 positive", () => {
    expect(getParticipationPattern(6, 0, 6)).toBe("squad_lock");
  });

  it("Split Mission: 3 positive / 3 negative", () => {
    expect(getParticipationPattern(3, 3, 6)).toBe("split_mission");
  });

  it("Small Squad: 3 positive / 0 negative", () => {
    expect(getParticipationPattern(3, 0, 3)).toBe("small_squad");
  });

  it("Small Squad: 3 positive / 1 negative (fewer than 2 negative)", () => {
    expect(getParticipationPattern(3, 1, 4)).toBe("small_squad");
  });

  it("Individual Mission: 1 positive", () => {
    expect(getParticipationPattern(1, 3, 4)).toBe("individual_mission");
  });

  it("No Current Interest: 0 positive with enough reviews", () => {
    expect(getParticipationPattern(0, 4, 4)).toBe("no_current_interest");
  });

  it("Insufficient data: 0 positive with too few reviews", () => {
    expect(getParticipationPattern(0, 3, 3)).toBe("insufficient_data");
  });
});

describe("hasMustDoAnchor (modifier, independent of pattern)", () => {
  it("flags true with at least 1 Must Do regardless of overall pattern", () => {
    expect(hasMustDoAnchor(1)).toBe(true);
    expect(hasMustDoAnchor(3)).toBe(true);
  });

  it("flags false with zero Must Dos even if there's plenty of interest", () => {
    expect(hasMustDoAnchor(0)).toBe(false);
  });

  it("classifyItem: Squad Lock + Must-Do Anchor coexist (Hagrid's-style example)", () => {
    const votersMap = {
      Brandon: MUST_DO,
      Levi: MUST_DO,
      Melissa: INTERESTED,
      Ava: INTERESTED,
      Justin: INTERESTED,
      Marissa: INTERESTED,
    };
    const result = classifyItem(votersMap, 6);
    expect(result.pattern).toBe("squad_lock");
    expect(result.mustDoAnchor).toBe(true);
    expect(result.confidence).toBe("complete");
  });

  it("classifyItem: Split Mission + Must-Do Anchor coexist (VelociCoaster-style example)", () => {
    const votersMap = {
      Brandon: MUST_DO,
      Justin: MUST_DO,
      Levi: INTERESTED,
      Melissa: NOT_FOR_ME,
      Ava: NOT_FOR_ME,
      Marissa: NOT_FOR_ME,
    };
    const result = classifyItem(votersMap, 6);
    expect(result.pattern).toBe("split_mission");
    expect(result.mustDoAnchor).toBe(true);
  });

  it("classifyItem: Individual Mission + Must-Do Anchor (Beauty and the Beast-style example)", () => {
    const votersMap = { Melissa: MUST_DO };
    const result = classifyItem(votersMap, 6);
    expect(result.pattern).toBe("individual_mission");
    expect(result.mustDoAnchor).toBe(true);
    expect(result.confidence).toBe("gathering_intel"); // only 1/6 reviewed
  });
});

describe("getCompletionConfidence", () => {
  it("Gathering Intel: only 3 of 6 reviewed", () => {
    expect(getCompletionConfidence(3, 6)).toBe("gathering_intel");
  });

  it("Likely: 5 of 6 reviewed", () => {
    expect(getCompletionConfidence(5, 6)).toBe("likely");
  });

  it("Likely: 4 of 6 reviewed (boundary)", () => {
    expect(getCompletionConfidence(4, 6)).toBe("likely");
  });

  it("Complete: 6 of 6 reviewed", () => {
    expect(getCompletionConfidence(6, 6)).toBe("complete");
  });
});

describe("tallyVotes", () => {
  it("counts each level correctly and derives positive/negative/reviewed/unreviewed", () => {
    const votersMap = {
      Brandon: MUST_DO,
      Levi: MUST_DO,
      Melissa: INTERESTED,
      Ava: NOT_FOR_ME,
    };
    const result = tallyVotes(votersMap, 6);
    expect(result.mustDo).toBe(2);
    expect(result.interested).toBe(1);
    expect(result.notForMe).toBe(1);
    expect(result.positive).toBe(3);
    expect(result.negative).toBe(1);
    expect(result.reviewed).toBe(4);
    expect(result.unreviewed).toBe(2);
  });
});

describe("computeItemOverlapWeight", () => {
  it("both Must Do = strongest weight (3)", () => {
    expect(computeItemOverlapWeight(MUST_DO, MUST_DO)).toBe(3);
  });

  it("Must Do + Interested = strong weight (2)", () => {
    expect(computeItemOverlapWeight(MUST_DO, INTERESTED)).toBe(2);
    expect(computeItemOverlapWeight(INTERESTED, MUST_DO)).toBe(2);
  });

  it("both Interested = positive weight (1)", () => {
    expect(computeItemOverlapWeight(INTERESTED, INTERESTED)).toBe(1);
  });

  it("either Not For Me = zero credit, even if the other is Must Do", () => {
    expect(computeItemOverlapWeight(NOT_FOR_ME, MUST_DO)).toBe(0);
    expect(computeItemOverlapWeight(MUST_DO, NOT_FOR_ME)).toBe(0);
  });

  it("mutual Not For Me = zero credit, not treated as compatibility", () => {
    expect(computeItemOverlapWeight(NOT_FOR_ME, NOT_FOR_ME)).toBe(0);
  });

  it("returns null (not co-reviewed) if either person hasn't voted", () => {
    expect(computeItemOverlapWeight(MUST_DO, undefined)).toBeNull();
    expect(computeItemOverlapWeight(undefined, undefined)).toBeNull();
  });
});

describe("computeNaturalSquadOverlap", () => {
  it("Insufficient data: fewer than the minimum co-reviewed items", () => {
    const votesByItem = {
      a: { Brandon: MUST_DO, Levi: MUST_DO },
      b: { Brandon: INTERESTED, Levi: INTERESTED },
    };
    const result = computeNaturalSquadOverlap("Brandon", "Levi", votesByItem, ["a", "b"]);
    expect(result.coReviewedCount).toBe(2);
    expect(result.label).toBeNull(); // below MIN_CO_REVIEWED_FOR_MATCH (8)
  });

  it("Strong Match: high overlap across enough co-reviewed items", () => {
    const itemIds = Array.from({ length: 10 }, (_, i) => `item${i}`);
    const votesByItem = {};
    itemIds.forEach((id) => {
      votesByItem[id] = { Brandon: MUST_DO, Levi: MUST_DO };
    });
    const result = computeNaturalSquadOverlap("Brandon", "Levi", votesByItem, itemIds);
    expect(result.coReviewedCount).toBe(10);
    expect(result.label).toBe("Strong Match");
  });

  it("Different Missions: consistent disagreement across enough items", () => {
    const itemIds = Array.from({ length: 10 }, (_, i) => `item${i}`);
    const votesByItem = {};
    itemIds.forEach((id) => {
      votesByItem[id] = { Brandon: MUST_DO, Levi: NOT_FOR_ME };
    });
    const result = computeNaturalSquadOverlap("Brandon", "Levi", votesByItem, itemIds);
    expect(result.coReviewedCount).toBe(10);
    expect(result.averageScore).toBe(0);
    expect(result.label).toBe("Different Missions");
  });

  it("does not let volume alone inflate a match — only co-reviewed items count", () => {
    // Brandon reviewed 20 items, Levi only reviewed 2 of the same ones.
    // Overlap should be based on the 2 shared items, not diluted/inflated by the other 18.
    const itemIds = Array.from({ length: 20 }, (_, i) => `item${i}`);
    const votesByItem = {};
    itemIds.forEach((id, i) => {
      votesByItem[id] = { Brandon: MUST_DO };
      if (i < 2) votesByItem[id].Levi = MUST_DO;
    });
    const result = computeNaturalSquadOverlap("Brandon", "Levi", votesByItem, itemIds);
    expect(result.coReviewedCount).toBe(2);
    expect(result.label).toBeNull(); // correctly insufficient, not falsely "Strong Match"
  });
});
