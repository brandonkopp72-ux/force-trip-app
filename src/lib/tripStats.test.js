import { describe, it, expect } from "vitest";
import { buildParkReadiness } from "./tripStats.js";
import { getAllVotableRideItems } from "../data/parks.js";
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
    // Brandon reviewed all but one item — should NOT count as complete.
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
    const votesByItem = buildFullVotes(ids, ["Brandon"]); // only Brandon voted, on everything
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
