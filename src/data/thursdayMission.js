/**
 * Thursday's Mission Rail content — Universal Studios Florida by day, Ava's
 * Birthday at dinner, then Halloween Horror Nights that night. Same node/
 * block contract as mondayMission.js. The one truly new piece of machinery
 * here is the Ava's Birthday node builder below — everything else (dual
 * Operating Intel via `secondaryOperatingIntel`, the new block types) is
 * Phase 4 infrastructure built in MissionDayPage.jsx / RailBlocks.jsx and
 * just consumed here.
 *
 * Tint intentionally warms from a brighter Universal-daytime blue/orange
 * through Diagon Alley's gold, then cools into HHN's deep red/black — the
 * page "gradually darkens" the same way Monday's tint evolves, purely
 * through each node's own tint plus MissionRail's existing connecting-line
 * gradient. No scroll-driven effects, nothing scroll-jacked.
 */

// Ava's birthday dinner restaurant/time — set both once the reservation is
// actually booked. Deliberately a plain JS constant, not Supabase-backed:
// there's no new voting or shared state here, just a value someone with
// repo access updates once, and the rail node below renders differently
// automatically the moment it's populated. No code change needed elsewhere.
export const AVA_BIRTHDAY = {
  restaurant: null, // e.g. "Toothsome Chocolate Emporium"
  time: null, // e.g. "7:00 PM"
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
      { type: "highlight", label: "THURSDAY", value: "October 22" },
      {
        type: "text",
        text: "Birthday dinner is guaranteed to happen tonight — the restaurant and time are still being finalized. This card automatically switches to a locked reservation display, matching Oga's Cantina's treatment on Monday, the moment they're booked.",
      },
    ],
  };
}

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
          text: "Regular park hours end mid-afternoon today so the park can turn over for Halloween Horror Nights tonight — see the second Operating Intel strip above. Order below reflects the squad's current votes.",
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
      id: "diagon-alley",
      heading: "DIAGON ALLEY",
      tint: "#c9a24d",
      blocks: [
        {
          type: "text",
          text: "No rigid schedule here — explore, shop, and eat as it appeals to you.",
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
    buildAvaBirthdayNode(),
    {
      kind: "flexible",
      id: "hhn-priorities",
      heading: "HALLOWEEN HORROR NIGHTS",
      tint: "#4a1414",
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
  ],
};
