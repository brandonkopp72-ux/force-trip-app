import { buildEntertainmentNode } from "./nighttimeEntertainment.js";

/**
 * Tuesday's Mission Rail content — Islands of Adventure. Follows the exact
 * shape mondayMission.js established (see its doc comment for the full node/
 * block contract), plus the Phase 4 rail-rhythm additions every full park
 * day now carries: a PARK ENTRY anchor, a midday LUNCH / REFUEL anchor, an
 * afternoon phase, a PARK CLOSE anchor (an "endpoint" node, so its close
 * time — read from parkHours.js — shows directly on the rail, not just in
 * Operating Intel), and then the evening phase.
 */

// Hogwarts Always — a real Universal nighttime projection show, but one
// that doesn't run every night. Stays empty (renders nothing) until a
// confirmed October 20, 2026 performance is actually on the calendar.
//
// Phase 6 research (Sept 20, 2026): as of this check, Universal has not
// published a day-by-day calendar for Hogwarts Always at all — and a
// separate, newer show ("Dark Arts at Hogwarts Castle") is running select
// nights in this same window without a published schedule either. Which
// show (if either) plays October 20, and at what time, is genuinely
// unknown right now — not just "not yet checked." Leave this empty until
// one of them actually publishes a dated showtime; don't guess which show
// it'll be.
export const TUESDAY_NIGHTTIME_ENTERTAINMENT = [
  // { title: "HOGWARTS ALWAYS", time: "8:00 PM", type: "projection", status: "confirmed", url: "" },
];

const hogwartsAlwaysNode = buildEntertainmentNode(TUESDAY_NIGHTTIME_ENTERTAINMENT[0], {
  id: "hogwarts-always",
  tint: "#8a6fd1",
});

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

  // Phase 5 correction pass: the family has Park-to-Park admission, so both
  // Islands of Adventure and Universal Studios Florida are technically in
  // play today — but Tuesday stays primarily an Islands page (see the rail
  // below: only ioa-* attractions). This is compact trip intel, not a
  // second park's worth of attraction cards. `flowNote` and `secondaryParkId`
  // are what differ from Thursday's own parkToParkIntel — everything else
  // renders through the exact same ParkToParkIntelStrip in
  // MissionDayPage.jsx ("same information architecture" both days).
  parkToParkIntel: {
    enabled: true,
    primaryPark: "Islands of Adventure",
    // Phase 6: lets ParkToParkIntelStrip show USF's real hours for today
    // (from parkHours.js) next to the crossing intel — useful for deciding
    // whether a crossing is worth it.
    secondaryParkId: "usf",
    trainObjective: true,
    flowNote:
      "Start in Islands / Hogsmeade. If it fits the day, cross to Universal Studios via Hogwarts Express — USF can become an optional side excursion, with a return to Islands or on into CityWalk depending on energy and hours.",
  },

  rail: [
    {
      kind: "flexible",
      id: "hogsmeade-ops",
      heading: "HOGSMEADE OPERATIONS",
      // Cool stone/mist blue-gray — Phase 5 day-theming polish (tint only;
      // no structure/content/time change).
      tint: "#7d92ad",
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
      id: "lunch-refuel",
      heading: "LUNCH / REFUEL",
      tint: "#c9a24d",
      time: "12:00 PM",
      blocks: [
        {
          type: "text",
          text: "Not a reservation — a broad midday break. Eat somewhat before or after noon depending on waits, hunger, energy, and where the squad happens to be.",
        },
      ],
    },
    {
      kind: "flexible",
      id: "adventure-ops",
      heading: "ADVENTURE OPERATIONS",
      // Jungle green with an energetic edge, covering both the Marvel/action
      // major objectives and the Jurassic-area secondary content this node
      // holds — Phase 5 day-theming polish (tint only).
      tint: "#3f9e7a",
      // Phase 5 correction pass: a broad, approximate afternoon anchor (the
      // "~" marks it as non-appointment) so the left rail carries a little
      // more temporal context without turning the day into a schedule.
      time: "~2:00 PM",
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
    hogwartsAlwaysNode,
    {
      kind: "endpoint",
      id: "islands-close",
      heading: "ISLANDS MISSION ENDS",
      tint: "#5a6a9a",
      timeFromParkHours: true,
      blocks: [{ type: "text", text: "Islands of Adventure mission complete for today — head for CityWalk." }],
    },
    {
      kind: "flexible",
      id: "citywalk-evening",
      heading: "CITYWALK EVENING",
      // Warm evening/neon energy — Phase 5 day-theming polish (tint only).
      tint: "#e0704f",
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
  ].filter(Boolean),
};
