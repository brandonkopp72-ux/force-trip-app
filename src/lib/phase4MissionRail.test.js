import { describe, it, expect } from "vitest";
import { getVotableItemById } from "../data/parks.js";
import { getParkHours, formatEveningWindow } from "../data/parkHours.js";
import { rankItemsByPositiveVotes, getDiningConsensusRanking, buildFridayReadiness } from "./tripStats.js";
import { FLIGHT_ITINERARIES } from "../data/flights.js";
import { buildEntertainmentNode } from "../data/nighttimeEntertainment.js";
import { MONDAY_MISSION, MONDAY_NIGHTTIME_ENTERTAINMENT } from "../data/mondayMission.js";
import { TUESDAY_MISSION, TUESDAY_NIGHTTIME_ENTERTAINMENT } from "../data/tuesdayMission.js";
import { WEDNESDAY_MISSION, WEDNESDAY_NIGHTTIME_ENTERTAINMENT } from "../data/wednesdayMission.js";
import { THURSDAY_MISSION, THURSDAY_HHN_ENTERTAINMENT, AVA_BIRTHDAY, buildAvaBirthdayNode } from "../data/thursdayMission.js";
import { FRIDAY_MISSION } from "../data/fridayMission.js";

const ALL_PHASE4_MISSIONS = [TUESDAY_MISSION, WEDNESDAY_MISSION, THURSDAY_MISSION, FRIDAY_MISSION];
const FULL_PARK_DAYS = [TUESDAY_MISSION, WEDNESDAY_MISSION, THURSDAY_MISSION]; // Friday isn't a full park day

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

      it("every flexible/endpoint node has a blocks array; every hard node has a time", () => {
        mission.rail.forEach((node) => {
          if (node.kind === "hard") {
            expect(node.time, `hard node "${node.id}" should carry a time`).toBeTruthy();
            // Hard nodes MAY carry an additional blocks array now (e.g.
            // Friday's departure nodes attach a flightPair) — just make sure
            // it's a real array when present, not asserting it's absent.
            if (node.blocks !== undefined) {
              expect(Array.isArray(node.blocks)).toBe(true);
            }
          } else if (node.kind === "entertainment") {
            // Entertainment nodes render fine with no blocks at all.
            if (node.blocks !== undefined) {
              expect(Array.isArray(node.blocks)).toBe(true);
            }
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

  FULL_PARK_DAYS.forEach((mission) => {
    describe(`${mission.id} full-park-day rail rhythm`, () => {
      it("has a midday LUNCH / REFUEL anchor at 12:00 PM, not a reservation", () => {
        const lunch = mission.rail.find((n) => n.id === "lunch-refuel");
        expect(lunch, `expected a lunch-refuel node on "${mission.id}"`).toBeTruthy();
        expect(lunch.time).toBe("12:00 PM");
        expect(lunch.kind).toBe("flexible"); // never a pulsing/locked node
      });

      it("has at least one endpoint (PARK CLOSE-style) anchor sourced from parkHours.js", () => {
        const endpoints = mission.rail.filter((n) => n.kind === "endpoint");
        expect(endpoints.length, `expected an endpoint node on "${mission.id}"`).toBeGreaterThan(0);
        endpoints.forEach((node) => {
          const usesPrimary = node.timeFromParkHours === true || node.timeFromParkHours === "close";
          const usesSecondary = node.timeFromSecondaryParkHours === true || node.timeFromSecondaryParkHours === "close";
          expect(usesPrimary || usesSecondary, `endpoint "${node.id}" should read its time from config, not a literal string`).toBe(true);
        });
      });
    });
  });

  it("Thursday's HHN-anchored nodes read time from HHN's OWN parkHours entry, not USF's", () => {
    const secondary = THURSDAY_MISSION.secondaryOperatingIntel;
    expect(secondary).toBeTruthy();
    expect(secondary.parkId).toBe("hhn");

    const hhnStart = THURSDAY_MISSION.rail.find((n) => n.id === "hhn-start");
    expect(hhnStart.timeFromSecondaryParkHours).toBe("open");

    const hhnClose = THURSDAY_MISSION.rail.find((n) => n.id === "hhn-close");
    expect(hhnClose.kind).toBe("endpoint");
    expect(hhnClose.timeFromSecondaryParkHours).toBe(true);

    const hhnHours = getParkHours(secondary.parkId);
    expect(hhnHours.open).toBeTruthy();
    expect(hhnHours.close).toBeTruthy();
  });

  it("Thursday's Ava's Birthday node sits after the USF daytime-close endpoint and before HHN start", () => {
    const ids = THURSDAY_MISSION.rail.map((n) => n.id);
    const closeIdx = ids.indexOf("usf-daytime-close");
    const birthdayIdx = ids.indexOf("ava-birthday");
    const hhnIdx = ids.indexOf("hhn-start");
    expect(closeIdx).toBeGreaterThanOrEqual(0);
    expect(birthdayIdx).toBeGreaterThan(closeIdx);
    expect(hhnIdx).toBeGreaterThan(birthdayIdx);
  });

  it("Friday's two departure flights are separate hard nodes in chronological (boarding) order", () => {
    const justin = FRIDAY_MISSION.rail.find((n) => n.id === "justin-departs");
    const mainSquad = FRIDAY_MISSION.rail.find((n) => n.id === "main-squad-departs");
    expect(justin.kind).toBe("hard");
    expect(mainSquad.kind).toBe("hard");
    expect(justin.time).toBe("5:25 PM");
    expect(mainSquad.time).toBe("6:30 PM");
    expect(FRIDAY_MISSION.rail.indexOf(justin)).toBeLessThan(FRIDAY_MISSION.rail.indexOf(mainSquad));
    expect(justin.blocks[0]).toEqual({ type: "flightPair", flightIds: ["justin"], leg: "return" });
    expect(mainSquad.blocks[0]).toEqual({ type: "flightPair", flightIds: ["main-squad"], leg: "return" });
  });
});

describe("buildEntertainmentNode", () => {
  it("returns null when there is no entry at all", () => {
    expect(buildEntertainmentNode(undefined, { id: "x", tint: "#fff" })).toBeNull();
  });

  it("returns null for a tentative or notScheduled entry, even with a time", () => {
    expect(buildEntertainmentNode({ title: "X", time: "8:00 PM", status: "tentative" }, { id: "x", tint: "#fff" })).toBeNull();
    expect(buildEntertainmentNode({ title: "X", time: "8:00 PM", status: "notScheduled" }, { id: "x", tint: "#fff" })).toBeNull();
  });

  it("returns null for a confirmed entry with no time (never invents one)", () => {
    expect(buildEntertainmentNode({ title: "X", status: "confirmed" }, { id: "x", tint: "#fff" })).toBeNull();
  });

  it("builds a real entertainment node for a confirmed entry with a time", () => {
    const node = buildEntertainmentNode(
      { title: "FANTASMIC!", time: "8:00 PM", type: "show", status: "confirmed", url: "https://example.com" },
      { id: "fantasmic", tint: "#5a6a9a" }
    );
    expect(node).toEqual({
      kind: "entertainment",
      id: "fantasmic",
      heading: "FANTASMIC!",
      time: "8:00 PM",
      tint: "#5a6a9a",
      entertainmentType: "show",
      url: "https://example.com",
    });
  });
});

describe("Nighttime entertainment stays off by default", () => {
  it("Monday, Tuesday, Wednesday, and Thursday's HHN config all start with nothing confirmed", () => {
    [MONDAY_NIGHTTIME_ENTERTAINMENT, TUESDAY_NIGHTTIME_ENTERTAINMENT, WEDNESDAY_NIGHTTIME_ENTERTAINMENT, THURSDAY_HHN_ENTERTAINMENT].forEach(
      (entries) => {
        expect(entries.every((e) => e.status !== "confirmed")).toBe(true);
      }
    );
  });

  it("no mission's rail currently contains an entertainment node (nothing is confirmed yet)", () => {
    [MONDAY_MISSION, ...ALL_PHASE4_MISSIONS].forEach((mission) => {
      expect(mission.rail.some((n) => n.kind === "entertainment")).toBe(false);
    });
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

describe("Monday stays unchanged by default (nighttime-entertainment exception is additive-only)", () => {
  it("still carries exactly its original six rail nodes when Fantasmic isn't confirmed", () => {
    expect(MONDAY_MISSION.rail.map((n) => n.id)).toEqual([
      "depart-for-airport",
      "deployment",
      "rendezvous",
      "batuu-ops",
      "ogas",
      "evening-ops",
    ]);
  });
});
