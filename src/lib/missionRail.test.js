import { describe, it, expect } from "vitest";
import { getVotableItemById, getAllVotableRideItems } from "../data/parks.js";
import { getParkHours } from "../data/parkHours.js";
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
});
