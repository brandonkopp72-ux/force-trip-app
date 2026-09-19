import { describe, it, expect } from "vitest";
import {
  buildParkReadiness,
  buildFridayReadiness,
  buildRationsReadiness,
  getPositiveVoteCount,
  getDiningConsensusRanking,
} from "./tripStats.js";
import { getAllVotableRideItems, PARKS } from "../data/parks.js";
import { ALL_DINING, DINING_SITDOWN } from "../data/dining.js";
import { FAMILY } from "../data/family.js";
import { LEVELS } from "../data/classificationConfig.js";

// Real votable items from the actual park data — using genuine IDs rather
// than fabricated ones so this test reflects the real completion rules
// (including the Friday/Departure special case, which has no votable
// items at all and must not appear in the readiness output).
const rideItems = getAllVotableRideItems();
const firstPark = rideItems[0].parkId;
const itemsForFirstPark = rideItems.filter((i) => i.parkId === firstPark);

function buildFullVotes(itemIds, names) {
  const votesByItem = {};
  itemIds.forEach((id) => {
    votesByItem[id] = {};
    names.forEach((name) => {
      votesByItem[id][name] = LEVELS.INTERESTED;
    });
  });
  return votesByItem;
}

describe("buildParkReadiness", () => {
  it("marks nobody complete when there are no votes at all", () => {
    const readiness = buildParkReadiness({});
    const park = readiness.find((r) => r.parkId === firstPark);
    expect(park.completeCount).toBe(0);
    expect(park.squadComplete).toBe(false);
    FAMILY.forEach((name) => expect(park.completeByPerson[name]).toBe(false));
  });

  it("marks a person complete only once every votable item in that park is reviewed", () => {
    const ids = itemsForFirstPark.map((i) => i.id);
    const partialVotes = {};
    ids.slice(0, ids.length - 1).forEach((id) => {
      partialVotes[id] = { Brandon: LEVELS.MUST_DO };
    });
    const readiness = buildParkReadiness(partialVotes);
    const park = readiness.find((r) => r.parkId === firstPark);
    expect(park.completeByPerson.Brandon).toBe(false);
  });

  it("marks the whole squad complete only when all six have reviewed every item", () => {
    const ids = itemsForFirstPark.map((i) => i.id);
    const votesByItem = buildFullVotes(ids, FAMILY);
    const readiness = buildParkReadiness(votesByItem);
    const park = readiness.find((r) => r.parkId === firstPark);
    expect(park.completeCount).toBe(FAMILY.length);
    expect(park.squadComplete).toBe(true);
    FAMILY.forEach((name) => expect(park.completeByPerson[name]).toBe(true));
  });

  it("does not let one person's incomplete review block another person's completion", () => {
    const ids = itemsForFirstPark.map((i) => i.id);
    const votesByItem = buildFullVotes(ids, ["Brandon"]);
    const readiness = buildParkReadiness(votesByItem);
    const park = readiness.find((r) => r.parkId === firstPark);
    expect(park.completeByPerson.Brandon).toBe(true);
    expect(park.completeByPerson.Melissa).toBe(false);
    expect(park.completeCount).toBe(1);
  });

  it("excludes the Friday/Departure day, which has no votable ride items", () => {
    const readiness = buildParkReadiness({});
    const departureEntry = readiness.find((r) => r.parkName === "Friday Morning — Departure");
    expect(departureEntry).toBeUndefined();
  });
});

describe("buildFridayReadiness", () => {
  const fridayPark = PARKS.find((p) => p.isDeparture);
  const optionIds = fridayPark.lands[0].singleChoiceGroups[0].options.map((o) => o.id);

  it("treats no selection as not decided", () => {
    const readiness = buildFridayReadiness({});
    expect(readiness.decidedCount).toBe(0);
    expect(readiness.squadDecided).toBe(false);
    FAMILY.forEach((name) => expect(readiness.decidedByPerson[name]).toBe(false));
  });

  it("treats one valid selection as decided for that person", () => {
    const votesByItem = { [optionIds[0]]: { Brandon: "chosen" } };
    const readiness = buildFridayReadiness(votesByItem);
    expect(readiness.decidedByPerson.Brandon).toBe(true);
    expect(readiness.choiceByPerson.Brandon).toBe(optionIds[0]);
  });

  it("does not let one person's decision make another person decided", () => {
    const votesByItem = { [optionIds[0]]: { Brandon: "chosen" } };
    const readiness = buildFridayReadiness(votesByItem);
    expect(readiness.decidedByPerson.Brandon).toBe(true);
    expect(readiness.decidedByPerson.Melissa).toBe(false);
    expect(readiness.decidedCount).toBe(1);
  });

  it("marks the full squad decided only when all six have chosen an option", () => {
    const votesByItem = {};
    optionIds.forEach((id) => (votesByItem[id] = {}));
    FAMILY.forEach((name, i) => {
      votesByItem[optionIds[i % optionIds.length]][name] = "chosen";
    });
    const readiness = buildFridayReadiness(votesByItem);
    expect(readiness.decidedCount).toBe(FAMILY.length);
    expect(readiness.squadDecided).toBe(true);
  });
});

describe("buildRationsReadiness", () => {
  it("treats a missing dining preference as incomplete", () => {
    const votesByItem = {};
    ALL_DINING.slice(0, ALL_DINING.length - 1).forEach((d) => {
      votesByItem[d.id] = { Brandon: LEVELS.INTERESTED };
    });
    const readiness = buildRationsReadiness(votesByItem);
    expect(readiness.reviewedByPerson.Brandon).toBe(false);
  });

  it("treats every current dining item reviewed as complete", () => {
    const votesByItem = {};
    ALL_DINING.forEach((d) => {
      votesByItem[d.id] = { Brandon: LEVELS.NOT_FOR_ME };
    });
    const readiness = buildRationsReadiness(votesByItem);
    expect(readiness.reviewedByPerson.Brandon).toBe(true);
    expect(readiness.total).toBe(ALL_DINING.length);
  });

  it("does not require a Top Dinner Pick to count as reviewed", () => {
    // Every item rated, but no top-dinner-pick data involved at all —
    // buildRationsReadiness never reads dinner_top_picks, only preferences.
    const votesByItem = {};
    ALL_DINING.forEach((d) => {
      votesByItem[d.id] = { Melissa: LEVELS.INTERESTED };
    });
    const readiness = buildRationsReadiness(votesByItem);
    expect(readiness.reviewedByPerson.Melissa).toBe(true);
  });

  it("does not let one person's completion affect another person's status", () => {
    const votesByItem = {};
    ALL_DINING.forEach((d) => {
      votesByItem[d.id] = { Brandon: LEVELS.MUST_DO };
    });
    const readiness = buildRationsReadiness(votesByItem);
    expect(readiness.reviewedByPerson.Brandon).toBe(true);
    expect(readiness.reviewedByPerson.Ava).toBe(false);
    expect(readiness.reviewedCount).toBe(1);
  });

  it("derives its total from the live ALL_DINING list rather than a hardcoded count", () => {
    const readiness = buildRationsReadiness({});
    expect(readiness.total).toBe(ALL_DINING.length);
    expect(readiness.total).not.toBe(0);
  });
});

// ---------------------------------------------------------------------------
// V2 Phase 1 additive helpers
// ---------------------------------------------------------------------------

describe("getPositiveVoteCount", () => {
  const itemId = rideItems[0].id;

  it("returns 0 when nobody has voted on the item", () => {
    expect(getPositiveVoteCount(itemId, {})).toBe(0);
  });

  it("returns 0 for an item id that isn't in votesByItem at all", () => {
    expect(getPositiveVoteCount("not-a-real-item", { [itemId]: { Brandon: LEVELS.MUST_DO } })).toBe(0);
  });

  it("counts both Must Do and Interested as positive", () => {
    const votesByItem = {
      [itemId]: { Brandon: LEVELS.MUST_DO, Melissa: LEVELS.INTERESTED, Ava: LEVELS.NOT_FOR_ME },
    };
    expect(getPositiveVoteCount(itemId, votesByItem)).toBe(2);
  });

  it("does not count Not for Me or an unreviewed (missing) vote", () => {
    const votesByItem = {
      [itemId]: { Brandon: LEVELS.NOT_FOR_ME, Melissa: LEVELS.MUST_DO },
      // Ava, Marissa, Justin, Levi never voted at all
    };
    expect(getPositiveVoteCount(itemId, votesByItem)).toBe(1);
  });

  it("recomputes live from whatever votesByItem is passed, never caching a stale count", () => {
    const before = { [itemId]: { Brandon: LEVELS.MUST_DO } };
    const after = { [itemId]: { Brandon: LEVELS.MUST_DO, Melissa: LEVELS.MUST_DO, Ava: LEVELS.MUST_DO } };
    expect(getPositiveVoteCount(itemId, before)).toBe(1);
    expect(getPositiveVoteCount(itemId, after)).toBe(3);
  });
});

describe("getDiningConsensusRanking", () => {
  it("defaults to sit-down (Top-Dinner-Pick-eligible) restaurants only, matching the live DINING_SITDOWN list", () => {
    const ranking = getDiningConsensusRanking({}, {});
    expect(ranking.length).toBe(DINING_SITDOWN.length);
    ranking.forEach((row) => expect(row.item.topPickEligible).toBe(true));
  });

  it("includes every dining item when onlyTopPickEligible is false", () => {
    const ranking = getDiningConsensusRanking({}, {}, { onlyTopPickEligible: false });
    expect(ranking.length).toBe(ALL_DINING.length);
  });

  it("applies the same consensus formula as the Excel export: Must Do=+2, Interested=+1, Not for Me=-1, blank=0", () => {
    const itemId = DINING_SITDOWN[0].id;
    const votesByItem = {
      [itemId]: {
        Brandon: LEVELS.MUST_DO, // +2
        Melissa: LEVELS.MUST_DO, // +2
        Ava: LEVELS.INTERESTED, // +1
        Marissa: LEVELS.NOT_FOR_ME, // -1
        // Justin, Levi blank -> 0 each
      },
    };
    const ranking = getDiningConsensusRanking(votesByItem, {});
    const row = ranking.find((r) => r.item.id === itemId);
    expect(row.mustDo).toBe(2);
    expect(row.interested).toBe(1);
    expect(row.notForMe).toBe(1);
    expect(row.consensusScore).toBe(4); // 2*2 + 1*1 + 1*-1
  });

  it("breaks ties by Top Dinner Pick count first", () => {
    const [itemA, itemB] = DINING_SITDOWN;
    const votesByItem = {
      [itemA.id]: { Brandon: LEVELS.MUST_DO, Melissa: LEVELS.MUST_DO },
      [itemB.id]: { Brandon: LEVELS.MUST_DO, Melissa: LEVELS.MUST_DO },
    };
    // Identical consensus scores, but itemB has a Top Dinner Pick and itemA doesn't.
    const topPicks = { Brandon: itemB.id };
    const ranking = getDiningConsensusRanking(votesByItem, topPicks);
    const rowA = ranking.find((r) => r.item.id === itemA.id);
    const rowB = ranking.find((r) => r.item.id === itemB.id);
    expect(rowA.consensusScore).toBe(rowB.consensusScore);
    expect(rowB.rank).toBeLessThan(rowA.rank);
  });

  it("falls back to Must Do count, then positive %, once score and Top Dinner Picks are tied", () => {
    const [itemA, itemB] = DINING_SITDOWN;
    const votesByItem = {
      // Same consensus score (2), but itemB gets there via a Must Do while
      // itemA gets there via two Interested votes.
      [itemA.id]: { Brandon: LEVELS.INTERESTED, Melissa: LEVELS.INTERESTED },
      [itemB.id]: { Brandon: LEVELS.MUST_DO },
    };
    const ranking = getDiningConsensusRanking(votesByItem, {});
    const rowA = ranking.find((r) => r.item.id === itemA.id);
    const rowB = ranking.find((r) => r.item.id === itemB.id);
    expect(rowA.consensusScore).toBe(rowB.consensusScore);
    expect(rowB.mustDo).toBeGreaterThan(rowA.mustDo);
    expect(rowB.rank).toBeLessThan(rowA.rank);
  });

  it("assigns a dense rank 1..N over the full returned set", () => {
    const ranking = getDiningConsensusRanking({}, {});
    const ranks = ranking.map((r) => r.rank).sort((a, b) => a - b);
    expect(ranks).toEqual(Array.from({ length: ranking.length }, (_, i) => i + 1));
  });

  it("never lets a non-sit-down item earn Top Dinner Pick credit even if data is malformed", () => {
    const quickItem = ALL_DINING.find((d) => !d.topPickEligible);
    const ranking = getDiningConsensusRanking({}, { Brandon: quickItem.id }, { onlyTopPickEligible: false });
    const row = ranking.find((r) => r.item.id === quickItem.id);
    expect(row.topPickCount).toBe(0);
  });
});
