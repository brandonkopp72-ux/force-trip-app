/**
 * Friday's Mission Rail content — Extraction. Same node/block contract as
 * mondayMission.js. `parkId: "friday"` matches the existing departure-day
 * entry in parks.js (id: "friday", isDeparture: true) — it has no entry in
 * parkHours.js, so MissionDayPage's HOURS chip simply doesn't render for
 * this day, which is correct: a departure day has no park hours to show.
 *
 * No Mission Complete page — Friday ends at Extraction, same as every other
 * day ends at its own final rail node.
 */
export const FRIDAY_MISSION = {
  id: "friday",
  missionNumber: "MISSION 05",
  title: "EXTRACTION",
  date: "Friday, October 23, 2026",
  parkId: "friday",
  accent: "#e8b98f",

  operatingIntel: {
    parkLabel: "FINAL MORNING — DEPARTURE",
  },

  rail: [
    {
      kind: "flexible",
      id: "final-morning",
      heading: "FINAL MORNING",
      tint: "#c9a882",
      blocks: [
        {
          type: "text",
          text: "We have the Park Hopper, so both parks are on the table if we move fast. No new voting here — this reads the squad's existing plan below.",
        },
        {
          type: "fridayDecision",
          heading: "CURRENT PLAN",
        },
      ],
    },
    {
      kind: "flexible",
      id: "return-to-basecamp",
      heading: "RETURN TO BASECAMP",
      tint: "#a99a8a",
      blocks: [
        {
          type: "opportunityList",
          items: ["Return to Dockside if needed", "Retrieve bags", "Regroup", "Prepare for airport"],
        },
      ],
    },
    {
      kind: "flexible",
      id: "transport-to-mco",
      heading: "TRANSPORTATION TO MCO",
      tint: "#8a7a72",
      blocks: [
        {
          type: "text",
          text: "Leave Dockside with enough buffer for Orlando traffic, rideshare/rental drop-off, and TSA — an exact departure time isn't set yet. Build it backward from Justin's 5:25 PM boarding and the Main Squad's 6:30 PM boarding.",
        },
      ],
    },
    {
      kind: "flexible",
      id: "extraction",
      heading: "EXTRACTION",
      tint: "#e0ab84",
      time: "5:25 PM",
      blocks: [{ type: "flightPair", flightIds: ["main-squad", "justin"], leg: "return" }],
    },
  ],
};
