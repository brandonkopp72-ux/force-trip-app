import { describe, it, expect } from "vitest";
import { getVotableItemById } from "../data/parks.js";
import { getParkHours, formatEveningWindow } from "../data/parkHours.js";
import { rankItemsByPositiveVotes, getDiningConsensusRanking, buildFridayReadiness } from "./tripStats.js";
import { FLIGHT_ITINERARIES } from "../data/flights.js";
import { TUESDAY_MISSION } from "../data/tuesdayMission.js";
import { WEDNESDAY_MISSION } from "../data/wednesdayMission.js";
import { THURSDAY_MISSION, AVA_BIRTHDAY, buildAvaBirthdayNode } from "../data/thursdayMission.js";
import { FRIDAY_MISSION } from "../data/fridayMission.js";

const ALL_PHASE4_MISSIONS = [TUESDAY_MISSION, WEDNESDAY_MISSION, THURSDAY_MISSION, FRIDAY_MISSION];

function collectItemIds(mission, blockTypes) {
  const ids = [];
  mission.rail.forEach((node) => {
    (node.blocks || []).forEach((block) => {
      if (blockTypes.includes(block.type)) ids.push(...block.itemIds);
    });
  });
  return ids;
}

function collectFlightBlocks(mission) {
  const blocks = [];
  mission.rail.forEach((node) => {
    (node.blocks || []).forEach((block) => {
      if (block.type === "flightPair") blocks.push(block);
    });
  });
  return blocks;
}

describe("Phase 4 (Tuesday-Friday) data integrity", () => {
  ALL_PHASE4_MISSIONS.forEach((mission) => {
    describe(`${mission.id} mission`, () => {
      it("resolves every attractionRefs/rankedAttractionRefs itemId against real PARKS data", () => {
        const ids = collectItemIds(mission, ["attractionRefs", "rankedAttractionRefs"]);
        ids.forEach((id) => {
          expect(getVotableItemById(id), `expected "${id}" (mission "${mission.id}") to resolve to a real votable item`).not.toBeNull();
        });
      });

      it("resolves every flightPair flightId against real FLIGHT_ITINERARIES data", () => {
        collectFlightBlocks(mission).forEach((block) => {
          block.flightIds.forEach((id) => {
            const found = FLIGHT_ITINERARIES.find((f) => f.id === id);
            expect(found, `expected "${id}" (mission "${mission.id}") to resolve to a real flight itinerary`).toBeTruthy();
            if (block.leg === "return") {
              expect(found.returnFlight, `expected flight "${id}" to carry real return-leg data`).toBeTruthy();
            }
          });
        });
      });

      it("every flexible node has a non-empty blocks array; every hard node has a time and no blocks", () => {
        mission.rail.forEach((node) => {
          if (node.kind === "hard") {
            expect(node.time, `hard node "${node.id}" should carry a time`).toBeTruthy();
            expect(node.blocks).toBeUndefined();
          } else {
            expect(Array.isArray(node.blocks), `node "${node.id}" should have a blocks array`).toBe(true);
            expect(node.blocks.length).toBeGreaterThan(0);
          }
        });
      });

      it("has no duplicate rail node ids", () => {
        const ids = mission.rail.map((n) => n.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it("resolves against a real, known parkId", () => {
        // "friday" is the existing departure-day PARKS entry, not a
        // parkHours.js entry — getParkHours legitimately returns null there.
        if (mission.parkId !== "friday") {
          expect(getParkHours(mission.parkId), `expected parkHours entry for "${mission.parkId}"`).not.toBeNull();
        }
      });
    });
  });

  it("Thursday's secondary Operating Intel points at a real HHN parkHours entry", () => {
    const secondary = THURSDAY_MISSION.secondaryOperatingIntel;
    expect(secondary).toBeTruthy();
    const hhnHours = getParkHours(secondary.parkId);
    expect(hhnHours).not.toBeNull();
    expect(hhnHours.earlyAccess).toBeTruthy();
  });
});

describe("rankItemsByPositiveVotes", () => {
  it("sorts ids by positive vote count, highest first", () => {
    const votesByItem = {
      a: { Brandon: "must_do", Melissa: "must_do" }, // 2
      b: { Brandon: "must_do" }, // 1
      c: {}, // 0
    };
    expect(rankItemsByPositiveVotes(["c", "b", "a"], votesByItem)).toEqual(["a", "b", "c"]);
  });

  it("keeps original relative order for ties (stable sort)", () => {
    const votesByItem = {}; // every id has 0 positive votes
    expect(rankItemsByPositiveVotes(["x", "y", "z"], votesByItem)).toEqual(["x", "y", "z"]);
  });
});

describe("Phase 4 helper reuse (no reimplemented logic)", () => {
  it("getDiningConsensusRanking behaves on an empty votesByItem, same helper Tuesday/Wednesday call", () => {
    const ranked = getDiningConsensusRanking({}, {});
    expect(ranked.length).toBeGreaterThan(0);
    ranked.forEach((row) => expect(row.rank).toBeGreaterThan(0));
  });

  it("buildFridayReadiness reads existing Friday choice data without requiring any writes", () => {
    const readiness = buildFridayReadiness({});
    expect(readiness.decidedCount).toBe(0);
    expect(Object.keys(readiness.optionLabelById).length).toBeGreaterThan(0);
  });
});

describe("Ava's Birthday conditional node", () => {
  it("defaults to a non-pulsing flexible node while unbooked", () => {
    expect(AVA_BIRTHDAY.restaurant).toBeNull();
    expect(AVA_BIRTHDAY.time).toBeNull();
    const node = buildAvaBirthdayNode();
    expect(node.kind).toBe("flexible");
    expect(node.blocks.length).toBeGreaterThan(0);
  });

  it("renders as a locked hard node once restaurant and time are both populated", () => {
    const node = buildAvaBirthdayNode({ restaurant: "Toothsome Chocolate Emporium", time: "7:00 PM" });
    expect(node.kind).toBe("hard");
    expect(node.time).toBe("7:00 PM");
    expect(node.blocks).toBeUndefined();
    expect(node.note).toContain("Toothsome Chocolate Emporium");
  });

  it("stays flexible if only one of restaurant/time is set", () => {
    expect(buildAvaBirthdayNode({ restaurant: "Somewhere", time: null }).kind).toBe("flexible");
    expect(buildAvaBirthdayNode({ restaurant: null, time: "7:00 PM" }).kind).toBe("flexible");
  });
});

describe("formatEveningWindow with a non-clock close value (HHN's 'Past Midnight')", () => {
  it("joins start and close as written when close has no meridiem to dedupe", () => {
    expect(formatEveningWindow("6:30 PM", "Past Midnight")).toBe("6:30 PM–Past Midnight");
  });
});
