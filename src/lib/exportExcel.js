import * as XLSX from "xlsx";
import { PARKS } from "../data/parks.js";
import { FAMILY } from "../data/family.js";
import { DINING_SITDOWN, DINING_QUICK, DINING_DESSERT } from "../data/dining.js";
import { LEVELS } from "../data/classificationConfig.js";
import { plainLabelFor } from "../data/uiLabels.js";

// ---------------------------------------------------------------------------
// Live dining catalog
// ---------------------------------------------------------------------------
//
// Category and Top-Dinner-Pick eligibility are derived directly from which
// exported array each item lives in (DINING_SITDOWN / DINING_QUICK /
// DINING_DESSERT), rather than assumed field names on the item objects
// themselves. That keeps this export tied to the app's real, current dining
// roster — reading it live, never hardcoding item counts — while staying
// robust to exactly what shape each item object happens to carry.
function tagCategory(items, category, topPickEligible) {
  return items.map((item) => ({ ...item, category, topPickEligible }));
}

// Order matches the Rations page: Sit-Down -> Quick Service -> Dessert/Snack.
const ALL_DINING = [
  ...tagCategory(DINING_SITDOWN, "Sit-Down", true),
  ...tagCategory(DINING_QUICK, "Quick Service", false),
  ...tagCategory(DINING_DESSERT, "Dessert/Snack", false),
];

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// Consensus scoring formula, per the locked brief:
// Must Do = +2, Interested = +1, Not for Me = -1, Blank = 0
const CONSENSUS_SCORE = {
  [LEVELS.MUST_DO]: 2,
  [LEVELS.INTERESTED]: 1,
  [LEVELS.NOT_FOR_ME]: -1,
};

// Theoretical min/max score for a 6-person family, used to normalize the
// text-based "consensus bar" visual to a fixed, comparable scale.
const FAMILY_SIZE = FAMILY.length;
const MAX_POSSIBLE_SCORE = CONSENSUS_SCORE[LEVELS.MUST_DO] * FAMILY_SIZE; // 12
const MIN_POSSIBLE_SCORE = CONSENSUS_SCORE[LEVELS.NOT_FOR_ME] * FAMILY_SIZE; // -6

const AVA_BIRTHDAY_DINNER_LINE =
  "🔒 Ava's Birthday Dinner — Thursday, Oct. 22 — LOCKED";

const BAR_WIDTH = 12;

// Builds a fixed-width Unicode block bar so relative support is visible at a
// glance directly in the spreadsheet cell, without relying on native Excel
// chart objects (see notes in the accompanying report on why those aren't
// used here).
function consensusBar(score) {
  const clamped = Math.max(MIN_POSSIBLE_SCORE, Math.min(MAX_POSSIBLE_SCORE, score));
  const ratio = (clamped - MIN_POSSIBLE_SCORE) / (MAX_POSSIBLE_SCORE - MIN_POSSIBLE_SCORE);
  const filled = Math.round(ratio * BAR_WIDTH);
  return "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
}

function countBar(count, maxCount) {
  if (maxCount <= 0) return "░".repeat(BAR_WIDTH);
  const ratio = count / maxCount;
  const filled = Math.round(ratio * BAR_WIDTH);
  return "█".repeat(filled) + "░".repeat(BAR_WIDTH - filled);
}

function voteLabel(votesByItem, itemId, person) {
  const value = votesByItem?.[itemId]?.[person];
  return plainLabelFor(value); // "" for blank/unreviewed
}

function sheetFromRows(rows) {
  return XLSX.utils.aoa_to_sheet(rows);
}

// ---------------------------------------------------------------------------
// Attractions sheet (existing feature — reconstructed here to match the
// documented behavior of the live export; not intentionally changed by this
// pass beyond what's needed to keep it working alongside the new sheets)
// ---------------------------------------------------------------------------

function buildAttractionsSheet(votesByItem) {
  const header = ["Park", "Land", "Attraction", ...FAMILY];
  const rows = [header];

  PARKS.filter((park) => !park.isDeparture)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach((park) => {
      park.lands.forEach((land) => {
        (land.items || [])
          .filter((item) => item.votable)
          .forEach((item) => {
            rows.push([
              park.name,
              land.name,
              item.name,
              ...FAMILY.map((person) => voteLabel(votesByItem, item.id, person)),
            ]);
          });
      });
    });

  return sheetFromRows(rows);
}

// ---------------------------------------------------------------------------
// Rations - Votes sheet (new)
// ---------------------------------------------------------------------------

function buildRationsVotesSheet(votesByItem, topPicks) {
  const header = ["Category", "Dining Option", ...FAMILY, "Top Dinner Pick Count"];
  const rows = [header];

  ALL_DINING.forEach((item) => {
    const topPickCount = item.topPickEligible ? countTopPicks(topPicks, item.id) : "N/A";
    rows.push([
      item.category,
      item.name,
      ...FAMILY.map((person) => voteLabel(votesByItem, item.id, person)),
      topPickCount,
    ]);
  });

  rows.push([]);
  rows.push([AVA_BIRTHDAY_DINNER_LINE]);
  rows.push([
    "Not a vote — the restaurant for Ava's Birthday Dinner may still be informed by the results above, but this event is not ranked or required as a completion item.",
  ]);

  return sheetFromRows(rows);
}

function countTopPicks(topPicks, itemId) {
  if (!topPicks) return 0;
  return Object.values(topPicks).filter((pickedId) => pickedId === itemId).length;
}

// ---------------------------------------------------------------------------
// Rations - Rankings sheet (new)
// ---------------------------------------------------------------------------

export function computeDiningRanking(votesByItem, topPicks) {
  const scored = ALL_DINING.map((item) => {
    let mustDo = 0;
    let interested = 0;
    let notForMe = 0;
    let blank = 0;

    FAMILY.forEach((person) => {
      const value = votesByItem?.[item.id]?.[person];
      if (value === LEVELS.MUST_DO) mustDo += 1;
      else if (value === LEVELS.INTERESTED) interested += 1;
      else if (value === LEVELS.NOT_FOR_ME) notForMe += 1;
      else blank += 1;
    });

    const totalResponses = mustDo + interested + notForMe;
    const positiveCount = mustDo + interested;
    const positivePercentage = totalResponses > 0 ? positiveCount / totalResponses : 0;
    const topPickCount = item.topPickEligible ? countTopPicks(topPicks, item.id) : 0;
    const consensusScore =
      mustDo * CONSENSUS_SCORE[LEVELS.MUST_DO] +
      interested * CONSENSUS_SCORE[LEVELS.INTERESTED] +
      notForMe * CONSENSUS_SCORE[LEVELS.NOT_FOR_ME];

    return {
      item,
      mustDo,
      interested,
      notForMe,
      blank,
      totalResponses,
      positiveCount,
      positivePercentage,
      topPickCount,
      consensusScore,
    };
  });

  scored.sort((a, b) => {
    if (b.consensusScore !== a.consensusScore) return b.consensusScore - a.consensusScore;
    if (b.topPickCount !== a.topPickCount) return b.topPickCount - a.topPickCount;
    if (b.mustDo !== a.mustDo) return b.mustDo - a.mustDo;
    return b.positivePercentage - a.positivePercentage;
  });

  scored.forEach((row, index) => {
    row.rank = index + 1;
  });

  return scored;
}

function buildRationsRankingsSheet(votesByItem, topPicks) {
  const ranking = computeDiningRanking(votesByItem, topPicks);

  const rows = [];

  // --- "At a glance" summary block so top consensus items are immediately
  // obvious without scanning/sorting the full table. This is the practical
  // stand-in for a native Excel chart (see report: the free xlsx library
  // this project uses cannot write real chart objects).
  rows.push(["RATIONS — AT A GLANCE"]);
  rows.push(["Top consensus picks (by score):"]);
  ranking.slice(0, 5).forEach((row) => {
    rows.push([
      `#${row.rank} ${row.item.name}`,
      consensusBar(row.consensusScore),
      `score ${row.consensusScore}`,
      `${row.mustDo} Must Do, ${row.interested} Interested, ${row.notForMe} Not for Me`,
    ]);
  });

  rows.push([]);

  const sitDownEligible = ranking.filter((row) => row.item.topPickEligible);
  const maxTopPicks = sitDownEligible.reduce((max, row) => Math.max(max, row.topPickCount), 0);
  const topPickLeaders = sitDownEligible
    .slice()
    .sort((a, b) => b.topPickCount - a.topPickCount)
    .filter((row) => row.topPickCount > 0)
    .slice(0, 5);

  rows.push(["TOP DINNER PICK — AT A GLANCE (sit-down restaurants only)"]);
  if (topPickLeaders.length === 0) {
    rows.push(["No Top Dinner Picks selected yet."]);
  } else {
    topPickLeaders.forEach((row) => {
      rows.push([row.item.name, countBar(row.topPickCount, maxTopPicks), `${row.topPickCount} pick(s)`]);
    });
  }

  rows.push([]);
  rows.push([]);

  // --- Full ranking table with every underlying vote count preserved, per
  // the explicit instruction not to let the score hide the raw counts.
  rows.push([
    "Rank",
    "Category",
    "Dining Option",
    "Must Do",
    "Interested",
    "Not for Me",
    "Blank / Not Reviewed",
    "Total Responses",
    "Positive Count",
    "Positive %",
    "Top Dinner Picks",
    "Consensus Score",
    "Consensus",
  ]);

  ranking.forEach((row) => {
    rows.push([
      row.rank,
      row.item.category,
      row.item.name,
      row.mustDo,
      row.interested,
      row.notForMe,
      row.blank,
      row.totalResponses,
      row.positiveCount,
      row.totalResponses > 0 ? `${Math.round(row.positivePercentage * 100)}%` : "—",
      row.item.topPickEligible ? row.topPickCount : "N/A",
      row.consensusScore,
      consensusBar(row.consensusScore),
    ]);
  });

  rows.push([]);
  rows.push([AVA_BIRTHDAY_DINNER_LINE]);
  rows.push([
    "Not included above — this is a fixed family decision, not a ranked or required vote.",
  ]);

  return sheetFromRows(rows);
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function exportTripToExcel(votesByItem, topPicks) {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildAttractionsSheet(votesByItem), "Attractions");
  XLSX.utils.book_append_sheet(wb, buildRationsVotesSheet(votesByItem, topPicks), "Rations - Votes");
  XLSX.utils.book_append_sheet(
    wb,
    buildRationsRankingsSheet(votesByItem, topPicks),
    "Rations - Rankings"
  );

  XLSX.writeFile(wb, "FORCE-Trip-Export.xlsx");
}

// Exported for testing / potential reuse.
export { buildAttractionsSheet, buildRationsVotesSheet, buildRationsRankingsSheet };
