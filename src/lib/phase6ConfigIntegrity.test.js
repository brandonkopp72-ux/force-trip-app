import { describe, it, expect } from "vitest";
import { getParkHours } from "../data/parkHours.js";
import { buildEntertainmentNode, buildEntertainmentNodes } from "../data/nighttimeEntertainment.js";
import { getFridayDecisionHeading, buildFridayReadiness } from "./tripStats.js";
import { MONDAY_MISSION } from "../data/mondayMission.js";
import { TUESDAY_MISSION } from "../data/tuesdayMission.js";
import { WEDNESDAY_MISSION } from "../data/wednesdayMission.js";
import { THURSDAY_MISSION, AVA_BIRTHDAY, buildAvaBirthdayNode } from "../data/thursdayMission.js";
import { FRIDAY_MISSION } from "../data/fridayMission.js";

const ALL_MISSIONS = [MONDAY_MISSION, TUESDAY_MISSION, WEDNESDAY_MISSION, THURSDAY_MISSION, FRIDAY_MISSION];

// ---------------------------------------------------------------------------
// Phase 6 spec's explicit testing checklist, one describe block per item.
// ---------------------------------------------------------------------------

describe("Null park hours don't crash", () => {
  it("returns null (not a throw) for an unknown park id", () => {
    expect(() => getParkHours("not-a-real-park")).not.toThrow();
    expect(getParkHours("not-a-real-park")).toBeNull();
  });

  it("returns null (not a throw) for a day-keyed park with no day id given", () => {
    // ioa/usf carry per-day hours (Phase 6) — calling without a dayId used
    // to silently resolve nothing before that change too, but now it's an
    // explicit, deliberate branch worth locking down.
    expect(() => getParkHours("ioa")).not.toThrow();
    expect(getParkHours("ioa")).toBeNull();
    expect(() => getParkHours("usf")).not.toThrow();
    expect(getParkHours("usf")).toBeNull();
  });

  it("returns null (not a throw) for a day-keyed park with an unrecognized day id", () => {
    expect(() => getParkHours("ioa", "someday")).not.toThrow();
    expect(getParkHours("ioa", "someday")).toBeNull();
  });

  it("flat, single-visit parks (hs/epic/hhn) resolve the same with or without a day id", () => {
    ["hs", "epic", "hhn"].forEach((parkId) => {
      expect(getParkHours(parkId)).toEqual(getParkHours(parkId, "monday"));
      expect(getParkHours(parkId)).not.toBeNull();
    });
  });
});

describe("Null entertainment doesn't render fake nodes", () => {
  it("buildEntertainmentNode returns null for missing/tentative/notScheduled/confirmed-but-timeless entries", () => {
    expect(buildEntertainmentNode(undefined, { id: "x", tint: "#fff" })).toBeNull();
    expect(buildEntertainmentNode({ title: "X", status: "tentative", time: "8:00 PM" }, { id: "x", tint: "#fff" })).toBeNull();
    expect(buildEntertainmentNode({ title: "X", status: "notScheduled", time: "8:00 PM" }, { id: "x", tint: "#fff" })).toBeNull();
    expect(buildEntertainmentNode({ title: "X", status: "confirmed" }, { id: "x", tint: "#fff" })).toBeNull();
    expect(buildEntertainmentNode({ title: "X", status: "confirmed", times: [] }, { id: "x", tint: "#fff" })).toBeNull();
  });

  it("buildEntertainmentNodes (plural) skips unconfirmed/timeless entries and returns an empty array when nothing qualifies", () => {
    expect(buildEntertainmentNodes([], { idPrefix: "x", tint: "#fff" })).toEqual([]);
    expect(buildEntertainmentNodes(undefined, { idPrefix: "x", tint: "#fff" })).toEqual([]);
    const mixed = buildEntertainmentNodes(
      [
        { title: "NOT READY", status: "tentative", time: "8:00 PM" },
        { title: "REAL SHOW", status: "confirmed", time: "9:00 PM" },
      ],
      { idPrefix: "x", tint: "#fff" }
    );
    expect(mixed).toHaveLength(1);
    expect(mixed[0].heading).toBe("REAL SHOW");
  });
});

describe("Multiple entertainment showtimes work", () => {
  it("a single-time entry produces a node with no additionalTimes", () => {
    const node = buildEntertainmentNode({ title: "X", status: "confirmed", time: "8:00 PM" }, { id: "x", tint: "#fff" });
    expect(node.time).toBe("8:00 PM");
    expect(node.additionalTimes).toBeUndefined();
  });

  it("a multi-time entry anchors on the earliest time and lists the rest as additionalTimes, in order given", () => {
    const node = buildEntertainmentNode(
      { title: "X", status: "confirmed", times: ["8:00 PM", "9:30 PM", "11:00 PM"] },
      { id: "x", tint: "#fff" }
    );
    expect(node.time).toBe("8:00 PM");
    expect(node.additionalTimes).toEqual(["9:30 PM", "11:00 PM"]);
  });

  it("never sets a preferredTime unless the config entry explicitly supplies one (never guessed)", () => {
    const node = buildEntertainmentNode(
      { title: "X", status: "confirmed", times: ["8:00 PM", "9:30 PM"] },
      { id: "x", tint: "#fff" }
    );
    expect(node.preferredTime).toBeUndefined();
  });

  it("Thursday's two real HHN entertainment nodes are both present with their full published showtime lists", () => {
    const nodes = THURSDAY_MISSION.rail.filter((n) => n.kind === "entertainment");
    expect(nodes).toHaveLength(2);
    nodes.forEach((n) => {
      expect(n.time).toBeTruthy();
      expect(Array.isArray(n.additionalTimes)).toBe(true);
      expect(n.additionalTimes.length).toBeGreaterThan(0);
    });
  });
});

describe("Ava's Birthday null state works", () => {
  it("defaults to pending/unbooked with a non-pulsing flexible node", () => {
    expect(AVA_BIRTHDAY.restaurant).toBeNull();
    expect(AVA_BIRTHDAY.time).toBeNull();
    expect(AVA_BIRTHDAY.reservationStatus).toBe("pending");
    const node = buildAvaBirthdayNode();
    expect(node.kind).toBe("flexible");
    expect(node.time).toBeUndefined();
  });
});

describe("Ava's Birthday confirmed state works", () => {
  it("renders as a locked hard-time node once restaurant and time are both supplied", () => {
    const node = buildAvaBirthdayNode({ restaurant: "Toothsome Chocolate Emporium", time: "7:00 PM", reservationStatus: "confirmed" });
    expect(node.kind).toBe("hard");
    expect(node.time).toBe("7:00 PM");
    expect(node.note).toContain("Toothsome Chocolate Emporium");
  });
});

describe("Park-to-Park intel remains correct", () => {
  it("Tuesday and Thursday both resolve real secondary-park hours through their parkToParkIntel.secondaryParkId", () => {
    const tueSecondary = getParkHours(TUESDAY_MISSION.parkToParkIntel.secondaryParkId, TUESDAY_MISSION.id);
    expect(tueSecondary).not.toBeNull();
    expect(tueSecondary.open).toBeTruthy();

    const thuSecondary = getParkHours(THURSDAY_MISSION.parkToParkIntel.secondaryParkId, THURSDAY_MISSION.id);
    expect(thuSecondary).not.toBeNull();
    expect(thuSecondary.open).toBeTruthy();
  });

  it("Monday, Wednesday, and Friday have no parkToParkIntel at all (not Park-to-Park days)", () => {
    expect(MONDAY_MISSION.parkToParkIntel).toBeUndefined();
    expect(WEDNESDAY_MISSION.parkToParkIntel).toBeUndefined();
    expect(FRIDAY_MISSION.parkToParkIntel).toBeUndefined();
  });
});

describe("Hogwarts Express note (Train Objective) remains visible", () => {
  it("Tuesday and Thursday's parkToParkIntel both carry trainObjective: true, with no invented hard time", () => {
    [TUESDAY_MISSION, THURSDAY_MISSION].forEach((mission) => {
      expect(mission.parkToParkIntel.trainObjective).toBe(true);
      expect(mission.parkToParkIntel.flowNote).not.toMatch(/\d{1,2}:\d{2}\s*(am|pm)/i);
    });
  });
});

describe("Friday's CURRENT LEADER / CURRENT PLAN logic is correct", () => {
  it("shows CURRENT LEADER when nobody at all has decided", () => {
    const readiness = buildFridayReadiness({});
    expect(readiness.squadDecided).toBe(false);
    expect(getFridayDecisionHeading(readiness, "CURRENT PLAN")).toBe("CURRENT LEADER");
  });

  it("shows CURRENT LEADER when some, but not all six, have decided — never inferred from vote count alone", () => {
    const fridayOptionIds = Object.keys(buildFridayReadiness({}).optionLabelById);
    const leadingOptionId = fridayOptionIds[0];
    // 5 of 6 pile onto the same leading option — still not squadDecided.
    const votesByItem = {
      [leadingOptionId]: { Brandon: "chosen", Melissa: "chosen", Ava: "chosen", Marissa: "chosen", Justin: "chosen" },
    };
    const readiness = buildFridayReadiness(votesByItem);
    expect(readiness.decidedCount).toBe(5);
    expect(readiness.squadDecided).toBe(false);
    expect(getFridayDecisionHeading(readiness, "CURRENT PLAN")).toBe("CURRENT LEADER");
  });

  it("shows CURRENT PLAN (the mission's own configured heading) only once all six have explicitly chosen", () => {
    const fridayOptionIds = Object.keys(buildFridayReadiness({}).optionLabelById);
    const optionId = fridayOptionIds[0];
    const votesByItem = {
      [optionId]: { Brandon: "chosen", Melissa: "chosen", Ava: "chosen", Marissa: "chosen", Justin: "chosen", Levi: "chosen" },
    };
    const readiness = buildFridayReadiness(votesByItem);
    expect(readiness.squadDecided).toBe(true);
    expect(getFridayDecisionHeading(readiness, "CURRENT PLAN")).toBe("CURRENT PLAN");
  });

  it("falls back to the literal string CURRENT PLAN if the mission config ever omits a heading", () => {
    const votesByItem = {};
    const fullyDecided = { squadDecided: true };
    expect(getFridayDecisionHeading(fullyDecided, undefined)).toBe("CURRENT PLAN");
    expect(getFridayDecisionHeading(fullyDecided, "")).toBe("CURRENT PLAN");
  });
});

describe("No duplicate rail times within a single day", () => {
  // Checks literal `time` values as authored in config (before any
  // parkHours.js render-time substitution) — this is what would catch a
  // real copy-paste mistake (two different nodes accidentally given the
  // same literal time), which resolved/dynamic times can't meaningfully be
  // checked for here since they aren't known until render.
  ALL_MISSIONS.forEach((mission) => {
    it(`${mission.id}: no two rail nodes share the same literal time`, () => {
      const literalTimes = mission.rail.filter((n) => typeof n.time === "string" && n.time.length > 0).map((n) => n.time);
      expect(new Set(literalTimes).size).toBe(literalTimes.length);
    });
  });
});

describe("No undefined labels appear", () => {
  ALL_MISSIONS.forEach((mission) => {
    it(`${mission.id}: every rail node has a real, non-empty heading`, () => {
      mission.rail.forEach((node) => {
        expect(typeof node.heading, `node "${node.id}" should have a string heading`).toBe("string");
        expect(node.heading.length).toBeGreaterThan(0);
      });
    });
  });

  it("every confirmed HHN entertainment entry has a real title and type (never falls back to \"undefined\")", () => {
    THURSDAY_MISSION.rail
      .filter((n) => n.kind === "entertainment")
      .forEach((n) => {
        expect(n.heading).toBeTruthy();
        expect(n.entertainmentType).toBeTruthy();
      });
  });

  it("every mission's parkToParkIntel (where present) has a real primaryPark and secondaryParkId", () => {
    [TUESDAY_MISSION, THURSDAY_MISSION].forEach((mission) => {
      expect(mission.parkToParkIntel.primaryPark).toBeTruthy();
      expect(mission.parkToParkIntel.secondaryParkId).toBeTruthy();
    });
  });
});
