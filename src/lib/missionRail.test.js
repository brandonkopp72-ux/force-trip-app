import { describe, it, expect } from "vitest";
import { getVotableItemById, getAllVotableRideItems } from "../data/parks.js";
import { getParkHours, formatEveningWindow } from "../data/parkHours.js";
import { MONDAY_MISSION } from "../data/mondayMission.js";
import { FLIGHT_ITINERARIES } from "../data/flights.js";

describe("getVotableItemById", () => {
  it("resolves a real votable id to its full PARKS item", () => {
    const realId = getAllVotableRideItems()[0].id;
    const item = getVotableItemById(realId);
    expect(item).not.toBeNull();
    expect(item.id).toBe(realId);
    expect(item.name).toBeTruthy();
  });

  it("returns null for an unknown id", () => {
    expect(getVotableItemById("not-a-real-id")).toBeNull();
  });

  it("does not resolve informational-only (non-votable) items", () => {
    // hs-droiddepot is a singleChoiceGroups option, not a votable ride item —
    // Monday's config deliberately does not reference it as an attractionRef.
    expect(getVotableItemById("hs-droiddepot")).toBeNull();
  });
});

describe("getParkHours", () => {
  it("returns hours for a known park id", () => {
    const hours = getParkHours("hs");
    expect(hours).not.toBeNull();
    expect(hours.open).toBeTruthy();
    expect(hours.close).toBeTruthy();
  });

  it("returns null for an unknown park id", () => {
    expect(getParkHours("not-a-real-park")).toBeNull();
  });
});

describe("formatEveningWindow", () => {
  it("drops the repeated meridiem when start and close share one", () => {
    expect(formatEveningWindow("5:00 PM", "9:00 PM")).toBe("5:00–9:00 PM");
  });

  it("keeps both meridiems when start and close differ", () => {
    expect(formatEveningWindow("11:00 AM", "1:00 PM")).toBe("11:00 AM–1:00 PM");
  });

  it("falls back to just the start time when close is unknown", () => {
    expect(formatEveningWindow("5:00 PM", null)).toBe("5:00 PM");
    expect(formatEveningWindow("5:00 PM", undefined)).toBe("5:00 PM");
  });
});

// Every id Monday's Mission Rail references must resolve against real V1
// data — this is what "no fabricated attractions/flights" actually proves,
// rather than just eyeballing the config.
describe("MONDAY_MISSION data integrity", () => {
  function collectAttractionRefItemIds(mission) {
    const ids = [];
    mission.rail.forEach((node) => {
      (node.blocks || []).forEach((block) => {
        if (block.type === "attractionRefs") ids.push(...block.itemIds);
      });
    });
    return ids;
  }

  function collectFlightIds(mission) {
    const ids = [];
    mission.rail.forEach((node) => {
      (node.blocks || []).forEach((block) => {
        if (block.type === "flightPair") ids.push(...block.flightIds);
      });
    });
    return ids;
  }

  it("resolves every attractionRefs itemId against real PARKS data", () => {
    const ids = collectAttractionRefItemIds(MONDAY_MISSION);
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach((id) => {
      expect(getVotableItemById(id), `expected "${id}" to resolve to a real votable item`).not.toBeNull();
    });
  });

  it("resolves every flightPair flightId against real FLIGHT_ITINERARIES data", () => {
    const ids = collectFlightIds(MONDAY_MISSION);
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach((id) => {
      const found = FLIGHT_ITINERARIES.find((f) => f.id === id);
      expect(found, `expected "${id}" to resolve to a real flight itinerary`).toBeTruthy();
    });
  });

  it("has exactly one hard node (Oga's) with the fixed hard-node fields, no blocks array", () => {
    const hardNodes = MONDAY_MISSION.rail.filter((n) => n.kind === "hard");
    expect(hardNodes).toHaveLength(1);
    const [ogas] = hardNodes;
    expect(ogas.time).toBeTruthy();
    expect(ogas.blocks).toBeUndefined();
  });

  it("every flexible node has a non-empty blocks array", () => {
    MONDAY_MISSION.rail
      .filter((n) => n.kind === "flexible")
      .forEach((node) => {
        expect(Array.isArray(node.blocks), `node "${node.id}" should have a blocks array`).toBe(true);
        expect(node.blocks.length).toBeGreaterThan(0);
      });
  });

  it("carries exactly the six requested primary time anchors, in order", () => {
    const expected = [
      ["depart-for-airport", "2:45 AM"],
      ["deployment", "5:00 AM"],
      ["rendezvous", "8:45 AM"],
      ["batuu-ops", "12:30 PM"],
      ["ogas", "4:20 PM"],
      ["evening-ops", "5:00 PM"], // literal start; displayed time becomes a range at render time
    ];
    expect(MONDAY_MISSION.rail.map((n) => n.id)).toEqual(expected.map(([id]) => id));
    expected.forEach(([id, time]) => {
      const node = MONDAY_MISSION.rail.find((n) => n.id === id);
      expect(node.time, `expected node "${id}" to carry time "${time}"`).toBe(time);
    });
  });

  it("has no standalone endpoint/park-close node — Evening Operations covers close via its own range", () => {
    expect(MONDAY_MISSION.rail.some((n) => n.kind === "endpoint")).toBe(false);
    const eveningOps = MONDAY_MISSION.rail.find((n) => n.id === "evening-ops");
    expect(eveningOps.rangeEndFromParkHours).toBe(true);
    expect(eveningOps).toBe(MONDAY_MISSION.rail[MONDAY_MISSION.rail.length - 1]); // still the day's final node
  });

  it("no longer has a standalone basecamp node — its content folds into Rendezvous", () => {
    expect(MONDAY_MISSION.rail.some((n) => n.id === "basecamp")).toBe(false);
    const rendezvous = MONDAY_MISSION.rail.find((n) => n.id === "rendezvous");
    const hasBasecampHighlight = rendezvous.blocks.some(
      (b) => b.type === "highlight" && b.label === "BASECAMP" && b.value === "Universal Endless Summer — Dockside"
    );
    expect(hasBasecampHighlight).toBe(true);
  });

  it("does not add any intermediate attraction/ride times beyond the known anchors", () => {
    // No block anywhere in Monday's config should carry a `time`/`when`-style
    // field on individual attractions — Rise, Smugglers Run, Tower of Terror,
    // etc. stay unscheduled opportunities inside their mission windows.
    MONDAY_MISSION.rail.forEach((node) => {
      (node.blocks || []).forEach((block) => {
        if (block.type === "attractionRefs") {
          expect(block).not.toHaveProperty("time");
          expect(block).not.toHaveProperty("times");
        }
      });
    });
  });
});
