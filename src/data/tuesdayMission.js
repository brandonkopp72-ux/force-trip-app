/**
 * Tuesday's Mission Rail content — Islands of Adventure. Follows the exact
 * shape mondayMission.js established (see its doc comment for the full node/
 * block contract); this file only adds day-specific content, no new
 * mechanics. Three broad phases, same as the "suggested rail structure" in
 * the Phase 4 brief: Hogsmeade first (before crowds build), the rest of the
 * park at midday, then CityWalk in the evening.
 */
export const TUESDAY_MISSION = {
  id: "tuesday",
  missionNumber: "MISSION 02",
  title: "ADVENTURE BEYOND THE GATES",
  date: "Tuesday, October 20, 2026",
  parkId: "ioa",
  accent: "#e0b25c",

  operatingIntel: {
    parkLabel: "ISLANDS OF ADVENTURE",
  },

  rail: [
    {
      kind: "flexible",
      id: "hogsmeade-ops",
      heading: "HOGSMEADE OPERATIONS",
      tint: "#8a9e6a",
      timeFromParkHours: "open",
      blocks: [
        {
          type: "text",
          text: "Hogsmeade first, before the rest of the park catches up to it — Hagrid's and Forbidden Journey draw the longest waits of the day.",
        },
        {
          type: "attractionRefs",
          heading: "PRIMARY OBJECTIVES",
          variant: "primary",
          itemIds: ["ioa-hagrids", "ioa-forbiddenjourney"],
        },
        {
          type: "attractionRefs",
          variant: "list",
          intro: "Also in Hogsmeade:",
          itemIds: ["ioa-hippogriff"],
        },
        {
          type: "featureCard",
          heading: "OLLIVANDERS",
          subheading: "WAND SHOP EXPERIENCE",
          items: [
            "A small-group interactive ceremony inside the wand shop — one guest is 'chosen' by a wand",
            "Afterward: browse and shop character wands and interactive wands",
          ],
          tagline: "No promises on who gets picked for the ceremony — that part's up to the wand.",
        },
        {
          type: "text",
          label: "INTERACTIVE WAND INTEL",
          text: "An interactive wand — bought here, or later at the Ministry of Magic or Diagon Alley — works at marked spell locations across all three Wizarding World zones. Buy it once, keep using it the rest of the trip.",
        },
      ],
    },
    {
      kind: "flexible",
      id: "adventure-ops",
      heading: "ADVENTURE OPERATIONS",
      tint: "#c9a24d",
      blocks: [
        {
          type: "text",
          text: "The rest of the park — big-ticket thrills first, then whatever's still calling to you. Order below reflects the squad's current votes, not a fixed plan.",
        },
        {
          type: "rankedAttractionRefs",
          heading: "MAJOR OBJECTIVES",
          variant: "primary",
          itemIds: ["ioa-spiderman", "ioa-kong", "ioa-hulk", "ioa-velocicoaster", "ioa-doomfearfall"],
        },
        {
          type: "opportunityList",
          variant: "secondary",
          heading: "ALSO WORTH A LOOK",
          items: [
            "Jurassic Park — Camp Jurassic (explore)",
            "Pteranodon Flyers (kids only)",
            "Toon Lagoon water rides — Bilge-Rat Barges, Ripsaw Falls",
            "Seuss Landing",
          ],
          note: "Lower-priority opportunities — work them in if there's time and appetite, not on a schedule.",
        },
      ],
    },
    {
      kind: "flexible",
      id: "citywalk-evening",
      heading: "EVENING + CITYWALK",
      tint: "#5a4a7a",
      timeFromParkHours: true,
      blocks: [
        {
          type: "diningConsensus",
          heading: "TONIGHT'S STRONGEST DINNER PICKS",
          note: "Based on the squad's current ratings — updates automatically as votes change. Not a reservation, not a lock.",
        },
        {
          type: "featureCard",
          heading: "PAT O'BRIEN'S",
          subheading: "BONUS NIGHT MISSION",
          items: ["Cajun/Creole food", "Hurricanes & other drinks", "Piano Lounge — dueling pianos"],
          tagline: "IF THE SQUAD STILL HAS FUEL...",
        },
        {
          type: "text",
          text: "Pat O'Brien's is entirely optional and not a locked plan — no promised piano start time, just an option if everyone's still up for it.",
        },
      ],
    },
  ],
};
