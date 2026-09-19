/**
 * Mission Loadout — reference-only content. No per-user state, checkboxes,
 * or completion tracking; this is intelligence, not a task list. Each
 * card renders as a compact "equipment/intel" card in
 * MissionLoadoutPage.jsx.
 *
 * variant: "feature" marks the one card (Return Mission) with a different
 * shape — a headline, icon chips, supporting text, and a closing line —
 * rather than a plain bullet list.
 */
export const LOADOUT_CARDS = [
  {
    id: "flight",
    icon: "✈️",
    heading: "FLIGHT LOADOUT",
    points: [
      "One carry-on + one personal item (personal item fits under the seat)",
      "Southwest carry-on max: 24×16×10\" including wheels and handles",
      "Pack light — checked luggage is still an option if needed",
      "ID, wallet, and travel essentials go in your personal item",
      "TSA liquids rule applies to anything in a carry-on",
    ],
  },
  {
    id: "electronics",
    icon: "🔌",
    heading: "ELECTRONICS",
    points: ["Phone", "Charging cable", "Headphones", "Power bank"],
    note: "Power banks stay in the cabin — never in checked baggage.",
  },
  {
    id: "park",
    icon: "🎒",
    heading: "PARK LOADOUT",
    points: [
      "Small backpack or fanny/waist pack",
      "Water bottle — refillable or disposable",
      "Sunglasses + sunscreen",
      "Compact poncho",
      "Waterproof pouch for electronics (spare socks optional)",
    ],
  },
  {
    id: "field-gear",
    icon: "👟",
    heading: "FIELD GEAR",
    points: [
      "Comfortable, broken-in walking shoes — non-negotiable",
      "Lightweight, comfortable clothing",
      "Plan for significant walking",
      "Something light for cooler indoor areas or evenings",
    ],
  },
  {
    id: "water-ride",
    icon: "💧",
    heading: "WATER RIDE INTEL",
    points: [
      "Compact poncho",
      "Secure footwear — nothing that floats away",
      "Waterproof protection for phone/electronics",
      "Quick-dry clothes or spare socks, if desired",
    ],
  },
  {
    id: "ride-intel",
    icon: "🎢",
    heading: "RIDE INTEL",
    points: [
      "Some rides require loose items to go in a locker",
      "Hulk & VelociCoaster: stricter loose-item checks + metal detectors",
      "A small fanny pack may be easier than a backpack — but can't ride with you everywhere",
    ],
  },
  {
    id: "conditions",
    icon: "☀️",
    heading: "ORLANDO CONDITIONS",
    points: ["Warm days", "Comfortable evenings", "Possible showers", "Lots of sun"],
    note: "Seasonal expectation, not a forecast — the real trip forecast can be checked closer to departure.",
  },
  {
    id: "return-mission",
    variant: "feature",
    icon: "🎁",
    heading: "RETURN MISSION",
    headline: "LEAVE ROOM FOR LOOT.",
    chips: ["⚔ Legacy Lightsaber", "🪄 Interactive Wand", "👕 Park Merch", "🎁 Souvenirs & Collectibles"],
    supportingText: "Don't leave home with every inch of luggage already full.",
    suggestion: "A small fold-flat tote/packable bag can be useful for the return trip.",
    closingLine: "PACK LIGHT → PARK SMART → LEAVE ROOM FOR LOOT",
  },
];
