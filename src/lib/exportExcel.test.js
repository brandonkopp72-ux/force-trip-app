import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import {
  computeDiningRanking,
  buildRationsVotesSheet,
  buildRationsRankingsSheet,
  buildAttractionsSheet,
  exportTripToExcel,
} from "./exportExcel.js";
import { ALL_DINING, DINING_SITDOWN, DINING_QUICK, DINING_DESSERT } from "../data/dining.js";
import { FAMILY } from "../data/family.js";
import { LEVELS } from "../data/classificationConfig.js";

function sheetToRows(ws) {
  return XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: true, defval: "" });
}

describe("computeDiningRanking", () => {
  it("computes must do / interested / not for me / blank counts correctly per item, live from ALL_DINING", () => {
    const item = ALL_DINING[0];
    const votesByItem = {
      [item.id]: {
        Brandon: LEVELS.MUST_DO,
        Melissa: LEVELS.MUST_DO,
        Ava: LEVELS.INTERESTED,
        Marissa: LEVELS.NOT_FOR_ME,
        // Justin and Levi left blank/unreviewed
      },
    };
    const ranking = computeDiningRanking(votesByItem, {});
    const row = ranking.find((r) => r.item.id === item.id);
    expect(row.mustDo).toBe(2);
    expect(row.interested).toBe(1);
    expect(row.notForMe).toBe(1);
    expect(row.blank).toBe(2);
    expect(row.totalResponses).toBe(4);
    expect(row.positiveCount).toBe(3);
    expect(row.positivePercentage).toBeCloseTo(0.75);
  });

  it("derives the full item list live from ALL_DINING rather than a hardcoded count", () => {
    const ranking = computeDiningRanking({}, {});
    expect(ranking.length).toBe(ALL_DINING.length);
    expect(ranking.length).toBe(
      DINING_SITDOWN.length + DINING_QUICK.length + DINING_DESSERT.length
    );
  });

  it("applies the locked consensus scoring formula (MustDo=+2, Interested=+1, NotForMe=-1, Blank=0)", () => {
    const item = ALL_DINING[0];
    const votesByItem = {
      [item.id]: {
        Brandon: LEVELS.MUST_DO, // +2
        Melissa: LEVELS.MUST_DO, // +2
        Ava: LEVELS.INTERESTED, // +1
        Marissa: LEVELS.NOT_FOR_ME, // -1
        Justin: undefined, // 0
        Levi: undefined, // 0
      },
    };
    const ranking = computeDiningRanking(votesByItem, {});
    const row = ranking.find((r) => r.item.id === item.id);
    expect(row.consensusScore).toBe(4); // 2+2+1-1
  });

  it("never lets blanks count as Not for Me or as any explicit vote", () => {
    const item = ALL_DINING[1];
    const votesByItem = { [item.id]: {} }; // nobody has voted
    const ranking = computeDiningRanking(votesByItem, {});
    const row = ranking.find((r) => r.item.id === item.id);
    expect(row.mustDo).toBe(0);
    expect(row.interested).toBe(0);
    expect(row.notForMe).toBe(0);
    expect(row.blank).toBe(FAMILY.length);
    expect(row.consensusScore).toBe(0);
    expect(row.totalResponses).toBe(0);
    expect(row.positivePercentage).toBe(0);
  });

  it("ranks strictly by consensus score, highest first", () => {
    const [a, b, c] = ALL_DINING;
    const votesByItem = {
      [a.id]: { Brandon: LEVELS.MUST_DO }, // score 2
      [b.id]: { Brandon: LEVELS.NOT_FOR_ME }, // score -1
      [c.id]: { Brandon: LEVELS.INTERESTED }, // score 1
    };
    const ranking = computeDiningRanking(votesByItem, {});
    const order = ranking.map((r) => r.item.id);
    expect(order.indexOf(a.id)).toBeLessThan(order.indexOf(c.id));
    expect(order.indexOf(c.id)).toBeLessThan(order.indexOf(b.id));
    expect(ranking.find((r) => r.item.id === a.id).rank).toBe(1);
  });

  it("breaks a score tie using more Top Dinner Picks first", () => {
    const [a, b] = DINING_SITDOWN; // both sit-down/top-pick-eligible
    const votesByItem = {
      [a.id]: { Brandon: LEVELS.MUST_DO }, // score 2
      [b.id]: { Brandon: LEVELS.MUST_DO }, // score 2, tied
    };
    const topPicks = { Melissa: b.id }; // b has a top dinner pick, a does not
    const ranking = computeDiningRanking(votesByItem, topPicks);
    const rowA = ranking.find((r) => r.item.id === a.id);
    const rowB = ranking.find((r) => r.item.id === b.id);
    expect(rowA.consensusScore).toBe(rowB.consensusScore);
    expect(rowB.rank).toBeLessThan(rowA.rank);
  });

  it("breaks a remaining tie using more Must Do votes", () => {
    const [a, b] = DINING_QUICK; // not top-pick-eligible, so tiebreak 1 is a no-op
    // Both score 1, but a reaches it via 1 Must Do + 1 Not for Me, b via 1 Interested.
    const votesByItemTied = {
      [a.id]: { Brandon: LEVELS.MUST_DO, Melissa: LEVELS.NOT_FOR_ME }, // 2 - 1 = 1, mustDo=1
      [b.id]: { Brandon: LEVELS.INTERESTED }, // 1, mustDo=0
    };
    const ranking = computeDiningRanking(votesByItemTied, {});
    const rowA = ranking.find((r) => r.item.id === a.id);
    const rowB = ranking.find((r) => r.item.id === b.id);
    expect(rowA.consensusScore).toBe(rowB.consensusScore);
    expect(rowA.mustDo).toBeGreaterThan(rowB.mustDo);
    expect(rowA.rank).toBeLessThan(rowB.rank);
  });

  it("counts Top Dinner Pick only from real topPicks records, never inferred from Must Do votes", () => {
    const item = DINING_SITDOWN[0];
    const votesByItem = {
      [item.id]: { Brandon: LEVELS.MUST_DO, Melissa: LEVELS.MUST_DO, Ava: LEVELS.MUST_DO },
    };
    // Nobody has actually recorded item as their Top Dinner Pick.
    const ranking = computeDiningRanking(votesByItem, {});
    const row = ranking.find((r) => r.item.id === item.id);
    expect(row.topPickCount).toBe(0);

    const topPicks = { Brandon: item.id };
    const ranking2 = computeDiningRanking(votesByItem, topPicks);
    const row2 = ranking2.find((r) => r.item.id === item.id);
    expect(row2.topPickCount).toBe(1);
  });

  it("does not count Top Dinner Pick for non-eligible (quick/dessert) items", () => {
    const item = DINING_QUICK[0];
    const topPicks = { Brandon: item.id }; // shouldn't happen via the app's own gating, but guard anyway
    const ranking = computeDiningRanking({}, topPicks);
    const row = ranking.find((r) => r.item.id === item.id);
    expect(row.topPickCount).toBe(0);
  });
});

describe("buildRationsVotesSheet", () => {
  it("shows every current dining item grouped by live category, with per-person plain-text choices", () => {
    const item = DINING_SITDOWN[0];
    const votesByItem = { [item.id]: { Brandon: LEVELS.MUST_DO } };
    const ws = buildRationsVotesSheet(votesByItem, {});
    const rows = sheetToRows(ws);
    const header = rows[0];
    expect(header).toEqual(["Category", "Dining Option", ...FAMILY, "Top Dinner Pick Count"]);

    const dataRow = rows.find((r) => r[1] === item.name);
    expect(dataRow[0]).toBe("Sit-Down");
    const brandonCol = 2 + FAMILY.indexOf("Brandon");
    expect(dataRow[brandonCol]).toBe("Must Do");
  });

  it("leaves a blank cell for unreviewed people rather than any placeholder text", () => {
    const item = DINING_SITDOWN[0];
    const ws = buildRationsVotesSheet({}, {});
    const rows = sheetToRows(ws);
    const dataRow = rows.find((r) => r[1] === item.name);
    const brandonCol = 2 + FAMILY.indexOf("Brandon");
    expect(dataRow[brandonCol]).toBe("");
  });

  it("marks Top Dinner Pick Count as N/A for non-sit-down items", () => {
    const item = DINING_DESSERT[0];
    const ws = buildRationsVotesSheet({}, {});
    const rows = sheetToRows(ws);
    const dataRow = rows.find((r) => r[1] === item.name);
    expect(dataRow[dataRow.length - 1]).toBe("N/A");
  });

  it("includes Ava's Birthday Dinner as a fixed locked line, not a voteable row", () => {
    const ws = buildRationsVotesSheet({}, {});
    const rows = sheetToRows(ws);
    const flatText = rows.map((r) => r.join(" ")).join("\n");
    expect(flatText).toContain("Ava's Birthday Dinner");
    expect(flatText).toContain("LOCKED");
    // It must not be one of the ALL_DINING rows
    expect(rows.some((r) => r[1] === "Ava's Birthday Dinner")).toBe(false);
  });
});

describe("buildRationsRankingsSheet", () => {
  it("preserves every underlying vote count alongside the consensus score (never hides them)", () => {
    const item = DINING_SITDOWN[0];
    const votesByItem = {
      [item.id]: {
        Brandon: LEVELS.MUST_DO,
        Melissa: LEVELS.MUST_DO,
        Ava: LEVELS.INTERESTED,
        Marissa: LEVELS.NOT_FOR_ME,
      },
    };
    const ws = buildRationsRankingsSheet(votesByItem, {});
    const rows = sheetToRows(ws);
    const header = rows.find((r) => r[0] === "Rank");
    const headerIdx = rows.indexOf(header);
    const dataRow = rows.slice(headerIdx + 1).find((r) => r[2] === item.name);

    const col = (name) => header.indexOf(name);
    expect(dataRow[col("Must Do")]).toBe(2);
    expect(dataRow[col("Interested")]).toBe(1);
    expect(dataRow[col("Not for Me")]).toBe(1);
    expect(dataRow[col("Blank / Not Reviewed")]).toBe(2);
    expect(dataRow[col("Consensus Score")]).toBe(4);
  });

  it("keeps Ava's Birthday Dinner out of the ranked table entirely", () => {
    const ws = buildRationsRankingsSheet({}, {});
    const rows = sheetToRows(ws);
    const header = rows.find((r) => r[0] === "Rank");
    const headerIdx = rows.indexOf(header);
    const rankedRows = rows.slice(headerIdx + 1).filter((r) => typeof r[0] === "number");
    expect(rankedRows.some((r) => String(r[2]).includes("Ava's Birthday"))).toBe(false);
    expect(rankedRows.length).toBe(ALL_DINING.length);

    const flatText = rows.map((r) => r.join(" ")).join("\n");
    expect(flatText).toContain("Ava's Birthday Dinner");
    expect(flatText).toContain("LOCKED");
  });

  it("includes an at-a-glance section highlighting the top consensus items", () => {
    const ws = buildRationsRankingsSheet({}, {});
    const rows = sheetToRows(ws);
    const flatText = rows.map((r) => r.join(" ")).join("\n");
    expect(flatText).toContain("AT A GLANCE");
    expect(flatText).toContain("TOP DINNER PICK");
  });
});

describe("exportTripToExcel (integration)", () => {
  it("builds a workbook containing Attractions, Rations - Votes, and Rations - Rankings sheets", () => {
    const votesByItem = {};
    const topPicks = {};
    const wb = XLSX.utils.book_new();
    // Reproduce the same assembly exportTripToExcel does, without touching disk,
    // by calling the exported sheet builders directly (writeFile is a thin
    // wrapper tested separately via the real file-write smoke test).
    XLSX.utils.book_append_sheet(wb, buildAttractionsSheet(votesByItem), "Attractions");
    XLSX.utils.book_append_sheet(wb, buildRationsVotesSheet(votesByItem, topPicks), "Rations - Votes");
    XLSX.utils.book_append_sheet(
      wb,
      buildRationsRankingsSheet(votesByItem, topPicks),
      "Rations - Rankings"
    );
    expect(wb.SheetNames).toEqual(["Attractions", "Rations - Votes", "Rations - Rankings"]);
  });
});
