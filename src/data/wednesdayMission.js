/**
 * Wednesday's Mission Rail content — Epic Universe. Same shape as
 * mondayMission.js. Three broad phases: Super Nintendo World (plus
 * transportation intel, since getting to Epic Universe is its own small
 * logistics question) at open, the rest of the park at midday, then an
 * intentionally-open evening with no locked dinner plan.
 */
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
      tint: "#d94f4f",
      timeFromParkHours: "open",
      blocks: [
        {
          type: "text",
          label: "GETTING THERE",
          text: "Epic Universe has its own dedicated entrance, separate from the Universal Studios / Islands of Adventure / CityWalk complex — plan for extra transit time (shuttle or rideshare) getting there, especially first thing in the morning. Exact departure time from Dockside isn't set yet.",
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
      id: "daytime-operations",
      heading: "CELESTIAL & WIZARDING OPERATIONS",
      tint: "#8a6fd1",
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
    {
      kind: "flexible",
      id: "evening-open-dinner",
      heading: "EVENING OPERATIONS",
      tint: "#4a3a6a",
      timeFromParkHours: true,
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
  ],
};
