import { buildEntertainmentNodes } from "./nighttimeEntertainment.js";

/**
 * Thursday's Mission Rail content — Universal Studios Florida by day, Ava's
 * Birthday at dinner, then Halloween Horror Nights that night. Same node/
 * block contract as mondayMission.js, but this is the most time-structured
 * day per the Phase 4 spec: USF entry, midday lunch, an afternoon phase, a
 * distinct "day mission ends" close anchor for USF's daytime hours, Ava's
 * Birthday, then a second operating context (HHN) with its OWN start and
 * close anchors, each sourced from HHN's own parkHours.js entry via
 * `timeFromSecondaryParkHours` rather than USF's.
 *
 * Tint intentionally warms from a brighter Universal-daytime blue through
 * Diagon Alley's gold, then cools into HHN's deep red/black — the page
 * "gradually darkens" the same way Monday's tint evolves, purely through
 * each node's own tint plus MissionRail's existing connecting-line gradient.
 * No scroll-driven effects, nothing scroll-jacked.
 */

// Ava's birthday dinner restaurant/time — set both once the reservation is
// actually booked. Deliberately a plain JS constant, not Supabase-backed:
// there's no new voting or shared state here, just a value someone with
// repo access updates once, and the rail node below renders differently
// automatically the moment it's populated. No code change needed elsewhere.
export const AVA_BIRTHDAY = {
  restaurant: null, // e.g. "Toothsome Chocolate Emporium"
  time: null, // e.g. "7:00 PM"
  // Phase 6: tracks the reservation lifecycle explicitly rather than just
  // inferring it from restaurant/time being set — "pending" until someone
  // actually books it, at which point set it to "confirmed" alongside
  // restaurant/time. Not read by buildAvaBirthdayNode below (that still
  // keys off restaurant+time, unchanged), but keeps this config honest
  // about status for anyone editing it, and is available for the UI later
  // without a schema change.
  reservationStatus: "pending",
};

/**
 * Builds Thursday's Ava's Birthday rail node from a config object (defaults
 * to the real AVA_BIRTHDAY above; a test can pass its own to check both
 * states). Unbooked -> a plain "flexible" node, no pulse, just the promise
 * that dinner is happening. Booked -> a "hard" locked-reservation node,
 * reusing the exact same fixed shape/renderer Oga's Cantina uses on Monday
 * (kind, time, tag, note, vibeTags) — no new component work required.
 */
export function buildAvaBirthdayNode(config = AVA_BIRTHDAY) {
  const booked = Boolean(config.restaurant && config.time);

  if (booked) {
    return {
      kind: "hard",
      id: "ava-birthday",
      heading: "AVA'S BIRTHDAY",
      time: config.time,
      tag: "LOCKED",
      note: `Birthday dinner at ${config.restaurant}.`,
      vibeTags: ["Birthday", "Family Dinner"],
      tint: "#ff6b57",
    };
  }

  return {
    kind: "flexible",
    id: "ava-birthday",
    heading: "AVA'S BIRTHDAY",
    tint: "#ff6b57",
    blocks: [
      { type: "highlight", label: "THURSDAY · OCTOBER 22", value: "Birthday dinner — guaranteed, details TBD" },
      {
        type: "text",
        text: "Birthday dinner is guaranteed to happen tonight — the restaurant and time are still being finalized. This card automatically switches to a locked reservation display, matching Oga's Cantina's treatment on Monday, the moment they're booked.",
      },
    ],
  };
}

// HHN's own live-entertainment slots (a specific stage/lagoon show with
// published starting times) are a DIFFERENT thing from the vote-ranked
// house/show list below.
//
// Phase 6 research (Sept 20, 2026): both shows below have published nightly
// showtimes for the HHN 35 season (Aug 28 – Nov 1, 2026, which covers our
// Oct 22 visit), reported without qualification as officially published —
// WDWNT, "Nightmare Fuel and Stranger Things Lagoon Show Times Revealed for
// Halloween Horror Nights 35" (Aug 2026). Each show repeats several times a
// night; every published time is kept (see `times` below and
// buildEntertainmentNodes in nighttimeEntertainment.js) rather than picking
// one — nothing here guesses which performance the family will attend.
export const THURSDAY_HHN_ENTERTAINMENT = [
  {
    title: "NIGHTMARE FUEL: BLOOD NOIR",
    times: ["8:00 PM", "9:30 PM", "11:00 PM", "12:30 AM"],
    type: "stunt",
    status: "confirmed",
    url: "",
  },
  {
    title: "STRANGER THINGS: RETURN TO HAWKINS",
    times: ["9:00 PM", "9:45 PM", "10:30 PM", "11:15 PM", "12:00 AM", "12:45 AM"],
    type: "liveEntertainment",
    status: "confirmed",
    url: "",
  },
];

const hhnEntertainmentNodes = buildEntertainmentNodes(THURSDAY_HHN_ENTERTAINMENT, {
  idPrefix: "hhn-entertainment",
  tint: "#7a1f1f",
});

export const THURSDAY_MISSION = {
  id: "thursday",
  missionNumber: "MISSION 04",
  title: "DOUBLE FEATURE",
  date: "Thursday, October 22, 2026",
  parkId: "usf",
  accent: "#ff6b57",

  operatingIntel: {
    parkLabel: "UNIVERSAL STUDIOS FLORIDA",
  },
  secondaryOperatingIntel: {
    parkLabel: "HALLOWEEN HORROR NIGHTS",
    parkId: "hhn",
    earlyAccessLabel: "SCREAM EARLY ACCESS",
  },

  // Phase 5 correction pass — see tuesdayMission.js's own parkToParkIntel
  // comment for the full rationale. Thursday stays primarily a Universal
  // Studios + Birthday + HHN page (only usf-*/hhn-* attractions below);
  // this is compact trip intel, not a second park's attraction list.
  // Universal Studios remains "today's base" since the day transitions into
  // HHN there tonight, which flowNote calls out explicitly.
  parkToParkIntel: {
    enabled: true,
    primaryPark: "Universal Studios Florida",
    // Phase 6: lets ParkToParkIntelStrip show Islands of Adventure's real
    // hours for today (from parkHours.js) next to the crossing intel.
    secondaryParkId: "ioa",
    trainObjective: true,
    flowNote:
      "Start in Universal Studios. If it fits during the daytime window, cross to Islands of Adventure via Hogwarts Express. Universal Studios remains the day's main operational base for the birthday and HHN portion of the night — no required return time set yet.",
  },

  rail: [
    {
      kind: "flexible",
      id: "usf-operations",
      heading: "UNIVERSAL STUDIOS OPERATIONS",
      tint: "#3f7fd9",
      timeFromParkHours: "open",
      blocks: [
        {
          type: "text",
          text: "Regular park hours end mid-afternoon today so the park can turn over for Halloween Horror Nights tonight. Order below reflects the squad's current votes.",
        },
        {
          type: "rankedAttractionRefs",
          heading: "MAJOR OBJECTIVES",
          variant: "primary",
          itemIds: [
            "usf-transformers",
            "usf-mummy",
            "usf-simpsons",
            "usf-gringotts",
            "usf-minionmayhem",
            "usf-meninblack",
            "usf-et",
          ],
        },
      ],
    },
    {
      kind: "flexible",
      id: "lunch-refuel",
      heading: "LUNCH / REFUEL",
      tint: "#3f7fd9",
      time: "12:00 PM",
      blocks: [
        {
          type: "text",
          text: "Not a reservation — a broad midday break. Eat somewhat before or after noon depending on waits, hunger, energy, and where the squad happens to be.",
        },
      ],
    },
    {
      // Phase 5 correction pass: broadened from "Diagon Alley" to a wider
      // afternoon phase — Diagon Alley is still the anchor content here,
      // but the heading and intro now also cover remaining USF priorities
      // and a possible Park-to-Park crossing (see the Park-to-Park Intel
      // strip near the top of the page for the actual Hogwarts Express
      // objective — this node doesn't repeat that, just acknowledges it).
      kind: "flexible",
      id: "afternoon-operations",
      heading: "AFTERNOON OPERATIONS",
      tint: "#c9a24d",
      time: "~2:00 PM",
      blocks: [
        {
          type: "text",
          text: "No rigid schedule in this broad afternoon window — Diagon Alley, any remaining Universal Studios priorities, and a possible Park-to-Park crossing (see the Park-to-Park Intel above) are all fair game. Explore, shop, and eat as it appeals to you.",
        },
        {
          type: "attractionRefs",
          variant: "list",
          itemIds: ["usf-hogwartsexpress"],
        },
        {
          type: "opportunityList",
          heading: "EXPLORE DIAGON ALLEY",
          items: [
            "Ollivanders (Diagon Alley location)",
            "Interactive wand shopping & spell locations",
            "Butterbeer & treats",
            "Knockturn Alley",
          ],
          note: "Escape from Gringotts is listed above with the day's major objectives.",
        },
      ],
    },
    {
      kind: "endpoint",
      id: "usf-daytime-close",
      heading: "DAY MISSION ENDS",
      tint: "#c9866a",
      timeFromParkHours: true,
      blocks: [{ type: "text", text: "Universal Studios' daytime mission ends here — regroup before Halloween Horror Nights takes over the same park tonight." }],
    },
    buildAvaBirthdayNode(),
    {
      kind: "flexible",
      id: "hhn-start",
      heading: "HALLOWEEN HORROR NIGHTS",
      tint: "#7a1f1f",
      timeFromSecondaryParkHours: "open",
      blocks: [
        {
          type: "text",
          text: "The same park, after dark, transformed for the event. Order below reflects the squad's current HHN votes, not a fixed plan — no route, no house-by-house schedule, no fixed house times.",
        },
        {
          type: "rankedAttractionRefs",
          heading: "TOP PRIORITIES",
          variant: "primary",
          itemIds: [
            "hhn-strangerthings",
            "hhn-invasion",
            "hhn-sinners",
            "hhn-bloodengutz",
            "hhn-strangerthingsshow",
            "hhn-bloodnoir",
          ],
        },
        {
          type: "opportunityList",
          variant: "secondary",
          heading: "ALSO PLAYING",
          items: [
            "Jack & Oddfellow: Chaos & Control",
            "Madlands: Caged Cannibals",
            "Cybergoria",
            "Hellraiser",
            "Evil Dead Burn",
            "Ozzy Osbourne: Prince of Darkness",
          ],
          note: "Plus the scare zones you'll pass through naturally while walking the park.",
        },
        {
          type: "linkList",
          heading: "⚠ SPOILER INTEL — HOUSE WALKTHROUGHS",
          warning:
            "These are full walkthroughs, not a preview — only follow one if you're fine knowing exactly what's inside before you go. External links only; nothing here is embedded.",
          links: [
            { label: "Jack & Oddfellow: Chaos & Control", href: "https://www.google.com/search?q=Jack+%26+Oddfellow+Chaos+%26+Control+HHN+2026+house+walkthrough" },
            { label: "Stranger Things 5", href: "https://www.google.com/search?q=Stranger+Things+5+HHN+2026+house+walkthrough" },
            { label: "Sinners", href: "https://www.google.com/search?q=Sinners+HHN+2026+house+walkthrough" },
            { label: "Invasion: Alien Abduction", href: "https://www.google.com/search?q=Invasion+Alien+Abduction+HHN+2026+house+walkthrough" },
          ],
        },
      ],
    },
    ...hhnEntertainmentNodes,
    {
      kind: "endpoint",
      id: "hhn-close",
      heading: "NIGHT OPERATIONS END",
      tint: "#2a0f0f",
      timeFromSecondaryParkHours: true,
      blocks: [{ type: "text", text: "Halloween Horror Nights wraps up here — back to Dockside." }],
    },
  ].filter(Boolean),
};
