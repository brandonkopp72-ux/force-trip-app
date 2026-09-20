import { describe, it, expect } from "vitest";
import { getAdjacentDayIds, getShortDayLabel } from "./dayNav.js";
import { MISSION_DAYS } from "../data/missionDays.js";

describe("getAdjacentDayIds", () => {
  it("Monday has no previous day and Tuesday as next", () => {
    expect(getAdjacentDayIds("monday")).toEqual({ prevId: null, nextId: "tuesday" });
  });

  it("Tuesday has Monday as previous and Wednesday as next", () => {
    expect(getAdjacentDayIds("tuesday")).toEqual({ prevId: "monday", nextId: "wednesday" });
  });

  it("Wednesday has Tuesday as previous and Thursday as next", () => {
    expect(getAdjacentDayIds("wednesday")).toEqual({ prevId: "tuesday", nextId: "thursday" });
  });

  it("Thursday has Wednesday as previous and Friday as next", () => {
    expect(getAdjacentDayIds("thursday")).toEqual({ prevId: "wednesday", nextId: "friday" });
  });

  it("Friday has Thursday as previous and no next day", () => {
    expect(getAdjacentDayIds("friday")).toEqual({ prevId: "thursday", nextId: null });
  });

  it("an unknown day id resolves to no adjacent days at all", () => {
    expect(getAdjacentDayIds("someday")).toEqual({ prevId: null, nextId: null });
  });

  it("derives its sequence from MISSION_DAYS rather than a separate hardcoded list", () => {
    // If missionDays.js ever reorders or adds a day, this test (and the dock)
    // should follow automatically rather than silently going stale.
    for (let i = 0; i < MISSION_DAYS.length; i++) {
      const { prevId, nextId } = getAdjacentDayIds(MISSION_DAYS[i].id);
      expect(prevId).toBe(i > 0 ? MISSION_DAYS[i - 1].id : null);
      expect(nextId).toBe(i < MISSION_DAYS.length - 1 ? MISSION_DAYS[i + 1].id : null);
    }
  });
});

describe("getShortDayLabel", () => {
  it("derives the short label from each day's existing dateLabel", () => {
    expect(getShortDayLabel("monday")).toBe("MON");
    expect(getShortDayLabel("tuesday")).toBe("TUE");
    expect(getShortDayLabel("wednesday")).toBe("WED");
    expect(getShortDayLabel("thursday")).toBe("THU");
    expect(getShortDayLabel("friday")).toBe("FRI");
  });

  it("returns null for an unknown day id rather than throwing or guessing", () => {
    expect(getShortDayLabel("someday")).toBeNull();
  });
});
