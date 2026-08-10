import { FAMILY } from "../data/family.js";
import { PARKS, getAllVotableRideItems } from "../data/parks.js";
import { ALL_DINING } from "../data/dining.js";
import { classifyItem, computeNaturalSquadOverlap } from "./classification.js";
import { LEVELS } from "../data/classificationConfig.js";

/**
 * Classifies every votable ride item across every park, grouped by park.
 * Returns: [{ park, items: [{ ...item, ...classification }] }]
 */
export function classifyAllParks(votesByItem) {
  return PARKS.filter((p) => !p.isDeparture).map((park) => {
    const items = [];
    park.lands.forEach((land) => {
      (land.items || []).forEach((item) => {
        if (!item.votable) return;
        const votersMap = votesByItem[item.id] || {};
        items.push({ ...item, landName: land.name, ...classifyItem(votersMap, FAMILY.length) });
      });
    });
    return { park, items };
  });
}

/** Classifies the dining list the same way, for a Dining Favorites section. */
export function classifyDining(votesByItem) {
  return ALL_DINING.map((d) => {
    const votersMap = votesByItem[d.id] || {};
    return { ...d, ...classifyItem(votersMap, FAMILY.length) };
  });
}

/** One person's overall Mission Profile across the whole trip. */
export function buildPersonalProfile(person, votesByItem) {
  const rideItems = getAllVotableRideItems();
  let mustDo = 0;
  let interested = 0;
  let notForMe = 0;
  let thrill = 0;
  let hhnHouses = 0;
  const byParkMustDo = {};

  rideItems.forEach((item) => {
    const level = votesByItem[item.id]?.[person];
    if (!level) return;
    if (level === LEVELS.MUST_DO) {
      mustDo++;
      byParkMustDo[item.parkName] = (byParkMustDo[item.parkName] || 0) + 1;
    } else if (level === LEVELS.INTERESTED) {
      interested++;
    } else if (level === LEVELS.NOT_FOR_ME) {
      notForMe++;
    }
    if (/thrill|coaster/i.test(item.tag || "")) thrill++;
    if (item.parkId === "hhn" && item.landName === "Haunted Houses" && level !== LEVELS.NOT_FOR_ME) hhnHouses++;
  });

  let diningYes = 0;
  let diningFine = 0;
  let diningNo = 0;
  ALL_DINING.forEach((d) => {
    const level = votesByItem[d.id]?.[person];
    if (level === LEVELS.MUST_DO) diningYes++;
    else if (level === LEVELS.INTERESTED) diningFine++;
    else if (level === LEVELS.NOT_FOR_ME) diningNo++;
  });

  const topPark = Object.entries(byParkMustDo).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const priorityMissions = rideItems
    .filter((item) => votesByItem[item.id]?.[person] === LEVELS.MUST_DO)
    .map((item) => item.name);

  return {
    mustDo,
    interested,
    notForMe,
    thrill,
    hhnHouses,
    topPark,
    priorityMissions,
    dining: { yes: diningYes, fine: diningFine, no: diningNo },
  };
}

/** Pairwise Natural Squad overlap for one person against everyone else. */
export function buildSquadOverlaps(person, votesByItem) {
  const rideItems = getAllVotableRideItems();
  const itemIds = rideItems.map((i) => i.id);
  return FAMILY.filter((n) => n !== person)
    .map((other) => ({ person: other, ...computeNaturalSquadOverlap(person, other, votesByItem, itemIds) }))
    .filter((r) => r.label) // only show pairs with enough shared data for a real label
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
}

/** Who hasn't finished reviewing each park yet — used by Planner View's completion status. */
export function buildCompletionStatus(votesByItem) {
  const rideItems = getAllVotableRideItems();
  const byPark = {};
  rideItems.forEach((item) => {
    if (!byPark[item.parkId]) byPark[item.parkId] = { parkName: item.parkName, total: 0, reviewedByPerson: {} };
    byPark[item.parkId].total += 1;
    FAMILY.forEach((name) => {
      if (!byPark[item.parkId].reviewedByPerson[name]) byPark[item.parkId].reviewedByPerson[name] = 0;
      if (votesByItem[item.id]?.[name]) byPark[item.parkId].reviewedByPerson[name] += 1;
    });
  });
  return byPark;
}
