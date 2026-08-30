import * as XLSX from "xlsx";
import { PARKS } from "../data/parks.js";
import { DINING_SITDOWN, DINING_QUICK, DINING_DESSERT } from "../data/dining.js";
import { FAMILY } from "../data/family.js";
import { LEVELS } from "../data/classificationConfig.js";

const LEVEL_LABELS = {
  [LEVELS.MUST_DO]: "Must Do",
  [LEVELS.INTERESTED]: "Interested",
  [LEVELS.NOT_FOR_ME]: "Not for Me",
};

function labelFor(votesByItem, itemId, name) {
  const raw = votesByItem[itemId]?.[name];
  return LEVEL_LABELS[raw] || "";
}

// Sorted by park (in the app's existing trip-day order), then by land, then
// by attraction order within that land — matches how they already appear
// on each Zone tab. The Friday/Departure day is skipped since it has no
// votable attractions, only planning single-choice groups.
function buildAttractionRows(votesByItem) {
  const rows = [];
  PARKS.forEach((park) => {
    if (park.isDeparture) return;
    park.lands.forEach((land) => {
      (land.items || []).forEach((item) => {
        if (!item.votable) return;
        const row = { Park: park.park, Land: land.name, Attraction: item.name };
        FAMILY.forEach((name) => {
          row[name] = labelFor(votesByItem, item.id, name);
        });
        rows.push(row);
      });
    });
  });
  return rows;
}

// Sit-down, then quick meal, then dessert/snack — the same category order
// already used on the Rations tab.
function buildDiningRows(votesByItem) {
  const sections = [
    { label: "Sit-Down Dinner", items: DINING_SITDOWN },
    { label: "Quick Meal", items: DINING_QUICK },
    { label: "Dessert / Snack", items: DINING_DESSERT },
  ];
  const rows = [];
  sections.forEach((section) => {
    section.items.forEach((item) => {
      const row = { Category: section.label, Restaurant: item.name, Notes: item.note };
      FAMILY.forEach((name) => {
        row[name] = labelFor(votesByItem, item.id, name);
      });
      rows.push(row);
    });
  });
  return rows;
}

/**
 * Generates and downloads a real .xlsx workbook from whatever votesByItem
 * is currently loaded in the browser. This app has no server-side reporting
 * of its own — the live, already-synced Supabase data sitting in memory at
 * the moment of the click IS the source of truth for the export.
 */
export function exportTripToExcel(votesByItem) {
  const wb = XLSX.utils.book_new();

  const attractionsSheet = XLSX.utils.json_to_sheet(buildAttractionRows(votesByItem));
  attractionsSheet["!cols"] = [
    { wch: 24 }, // Park
    { wch: 26 }, // Land
    { wch: 36 }, // Attraction
    ...FAMILY.map(() => ({ wch: 12 })),
  ];
  XLSX.utils.book_append_sheet(wb, attractionsSheet, "Attractions");

  const diningSheet = XLSX.utils.json_to_sheet(buildDiningRows(votesByItem));
  diningSheet["!cols"] = [
    { wch: 16 }, // Category
    { wch: 32 }, // Restaurant
    { wch: 42 }, // Notes
    ...FAMILY.map(() => ({ wch: 12 })),
  ];
  XLSX.utils.book_append_sheet(wb, diningSheet, "Restaurants");

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `FORCE-Trip-Export-${today}.xlsx`);
}
