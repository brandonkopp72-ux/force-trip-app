/**
 * Friday's Mission Rail content — Extraction. Same node/block contract as
 * mondayMission.js. `parkId: "friday"` matches the existing departure-day
 * entry in parks.js (id: "friday", isDeparture: true) — it has no entry in
 * parkHours.js, so MissionDayPage's HOURS chip simply doesn't render for
 * this day, which is correct: a departure day has no park hours to show.
 *
 * Justin's and the Main Squad's flights depart MCO at different times
 * (5:25 PM and 6:30 PM), so — per the spec's example format — they get
 * their own separate rail anchors rather than being folded into one
 * "Extraction" node the way Monday's two arrival flights share one
 * "Deployment" anchor. Both are "hard" nodes: genuine, can't-move
 * commitments, same category the node-types spec calls out ("flights when
 * appropriate"). Each carries a `blocks` array with a single flightPair
 * block — new Phase 4 infrastructure (MissionDayPage.jsx) lets a "hard"
 * node attach blocks like this without disturbing Oga's Cantina, which has
 * none.
 *
 * No Mission Complete page — Friday ends at the Main Squad's departure,
 * same as every other day ends at its own final rail node.
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
      id: "lunch-refuel",
      heading: "LUNCH / REFUEL",
      tint: "#b8a288",
      time: "12:00 PM",
      blocks: [
        {
          type: "text",
          text: "Grab something at Dockside or on the way, depending on which final-morning plan the squad lands on — no reservation, no plan required.",
        },
      ],
    },
    {
      kind: "flexible",
      id: "return-to-dockside",
      heading: "RETURN TO DOCKSIDE",
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
      id: "depart-for-mco",
      heading: "DEPART FOR MCO",
      tint: "#8a7a72",
      blocks: [
        {
          type: "text",
          text: "Leave Dockside with enough buffer for Orlando traffic, rideshare/rental drop-off, and TSA — an exact departure time isn't set yet. Build it backward from Justin's 5:25 PM boarding and the Main Squad's 6:30 PM boarding below.",
        },
      ],
    },
    {
      kind: "hard",
      id: "justin-departs",
      heading: "JUSTIN DEPARTS MCO",
      time: "5:25 PM",
      tag: "BOARDING",
      tint: "#e0ab84",
      blocks: [{ type: "flightPair", flightIds: ["justin"], leg: "return" }],
    },
    {
      kind: "hard",
      id: "main-squad-departs",
      heading: "MAIN SQUAD DEPARTS MCO",
      time: "6:30 PM",
      tag: "BOARDING",
      tint: "#e8b98f",
      blocks: [{ type: "flightPair", flightIds: ["main-squad"], leg: "return" }],
    },
  ],
};
