import { buildEntertainmentNode } from "./nighttimeEntertainment.js";

/**
 * Wednesday's Mission Rail content — Epic Universe. Same shape as
 * mondayMission.js, plus the same Phase 4 rail-rhythm additions Tuesday
 * carries: PARK ENTRY, midday LUNCH / REFUEL, an afternoon phase, an
 * optional nighttime-entertainment slot, a PARK CLOSE endpoint anchor, then
 * an intentionally open dinner phase.
 */

// Phase 6 research (Sept 20, 2026): Universal does now run a nightly Epic
// Universe show, "Universal Celestial Goodnight" (usually ~30 min after
// close). But as of this check, its pyrotechnics went down for a technical
// issue around Sept 14, 2026 with no repair timeline given — so whether it
// (or its fireworks specifically) will be running by Oct 21 is genuinely
// unknown, not just unannounced. Per the spec ("do not create a generic
// fireworks entry" for an unconfirmed show), this stays empty rather than
// guessing it'll be back. If Universal confirms it's running again before
// the trip, add it here with its real showtime and it appears on the rail
// automatically — no other code change needed.
export const WEDNESDAY_NIGHTTIME_ENTERTAINMENT = [
  // { title: "UNIVERSAL CELESTIAL GOODNIGHT", time: "", type: "show", status: "confirmed", url: "" },
];

const epicNighttimeNode = buildEntertainmentNode(WEDNESDAY_NIGHTTIME_ENTERTAINMENT[0], {
  id: "epic-nighttime-show",
  tint: "#8a6fd1",
});

export const WEDNESDAY_MISSION = {
  id: "wednesday",
  missionNumber: "MISSION 03",
  title: "ENTER THE PORTALS",
  date: "Wednesday, October 21, 2026",
  parkId: "epic",
  accent: "#b39dff",

  operatingIntel: {
    parkLabel: "EPIC UNIVERSE",
  },

  rail: [
    {
      kind: "flexible",
      id: "snw-transport",
      heading: "SUPER NINTENDO WORLD",
      // Cosmic blue, keeping this land inside the same deep-blue/violet
      // family as the rest of Wednesday's "most luminous/cosmic" page
      // rather than an unrelated red — Phase 5 day-theming polish (tint
      // only; no structure/content/time change).
      tint: "#5fa8d9",
      timeFromParkHours: "open",
      blocks: [
        {
          // Phase 6 research (Sept 20, 2026): Dockside guests reach Epic
          // Universe by shuttle bus — that's the standard/confirmed method
          // for on-site hotels without direct walking access (only Helios
          // Grand and Stella Nova connect on foot; there's no water taxi to
          // Epic the way CityWalk-adjacent hotels get one). No specific
          // shuttle departure time or frequency is published, so none is
          // given here.
          type: "text",
          label: "GETTING THERE",
          text: "Epic Universe has its own dedicated entrance, separate from the Universal Studios / Islands of Adventure / CityWalk complex. From Dockside, that means the Epic Universe shuttle bus (not the CityWalk water taxi/walking path) — plan for extra transit time, especially first thing in the morning. Exact shuttle departure time isn't published; build in a buffer.",
        },
        {
          type: "attractionRefs",
          heading: "PRIMARY OBJECTIVES",
          variant: "primary",
          itemIds: ["epic-mariokart", "epic-minecart"],
        },
        {
          type: "attractionRefs",
          variant: "list",
          intro: "Also in Super Nintendo World:",
          itemIds: ["epic-yoshi"],
        },
      ],
    },
    {
      kind: "flexible",
      id: "lunch-refuel",
      heading: "LUNCH / REFUEL",
      tint: "#8a6fd1",
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
      id: "portal-operations",
      heading: "PORTAL OPERATIONS",
      tint: "#8a6fd1",
      // Phase 5 correction pass: a broad, approximate afternoon anchor (the
      // "~" marks it as non-appointment) so the left rail carries a little
      // more temporal context without turning the day into a schedule.
      time: "~2:00 PM",
      blocks: [
        {
          type: "text",
          text: "The rest of the park — Celestial Park, the Wizarding World's Ministry of Magic, Dark Universe, and Isle of Berk. Work through these in whatever order the day's crowds and energy favor.",
        },
        {
          type: "attractionRefs",
          heading: "CELESTIAL PARK",
          variant: "primary",
          itemIds: ["epic-stardust"],
        },
        {
          type: "attractionRefs",
          variant: "list",
          intro: "Best after dark:",
          itemIds: ["epic-carousel"],
        },
        {
          type: "attractionRefs",
          heading: "THE WIZARDING WORLD — MINISTRY OF MAGIC",
          variant: "primary",
          itemIds: ["epic-ministry"],
        },
        {
          type: "text",
          label: "INTERACTIVE WAND MISSION CONTINUES",
          text: "The same interactive wand from Hogsmeade (or bought fresh here) keeps working at marked spell locations throughout the Ministry of Magic.",
        },
        {
          type: "attractionRefs",
          heading: "DARK UNIVERSE",
          variant: "list",
          itemIds: ["epic-monstersunchained", "epic-werewolf"],
        },
        {
          type: "attractionRefs",
          heading: "ISLE OF BERK",
          variant: "primary",
          itemIds: ["epic-wingliders"],
        },
        {
          type: "opportunityList",
          variant: "secondary",
          heading: "ALSO WORTH A LOOK",
          items: ["Dragon Racer's Rally", "Fyre Drill", "Astronomica splash pad"],
          note: "Lower-priority opportunities — work them in if there's time.",
        },
      ],
    },
    epicNighttimeNode,
    {
      kind: "endpoint",
      id: "epic-close",
      heading: "EPIC UNIVERSE CLOSE",
      tint: "#4a3a6a",
      timeFromParkHours: true,
      blocks: [{ type: "text", text: "Epic Universe mission complete for today." }],
    },
    {
      kind: "flexible",
      id: "dinner-options",
      heading: "DINNER OPTIONS",
      tint: "#4a3a6a",
      blocks: [
        {
          type: "text",
          text: "Dinner tonight is intentionally open — no lock, no dinner captain, no new vote. Choose based on energy, location, and how the day feels.",
        },
        {
          type: "diningConsensus",
          heading: "CURRENT STRONGEST DINNER OPTIONS",
          note: "Based on the squad's existing restaurant ratings — a starting point, not an assignment.",
        },
      ],
    },
  ].filter(Boolean),
};
