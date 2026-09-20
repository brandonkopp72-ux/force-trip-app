/**
 * Monday's Mission Rail content. This is the template Tuesday-Friday will
 * follow in Phase 4, so the shape here matters more than it would for a
 * one-off page — see the block-type comment below before adding to it.
 *
 * A day's config has three parts:
 *   - top-level identity (missionNumber, title, date, parkId, accent)
 *   - operatingIntel — the compact day-summary strip
 *   - rail — an ordered list of nodes that attach to the Mission Rail.
 *
 * A rail node is one of:
 *   { kind: "flexible", id, heading, tint, blocks: [...], time? }  — small marker, no pulse
 *   { kind: "hard", id, heading, time, tag, targetArrival, note, vibeTags, tint } — large pulsing marker
 *   { kind: "endpoint", id, heading, tint, blocks: [...], timeFromParkHours: true } — ring marker, day's close
 *
 * `time` (optional on "flexible"; required on "hard") is a known, meaningful
 * time MissionRail shows in its left-side time column, aligned with that
 * node's marker. Every time in that column renders at the SAME size/weight/
 * line-height regardless of node kind — only its color differs, by
 * convention: a plain clock time reads bright/neutral, an approximate one
 * (write the "~" into the string itself, e.g. "~11:30 AM") reads softer, and
 * a "hard" node's locked time reads in the accent amber. The type of event
 * is communicated by the MARKER (small dot vs. large pulsing vs. ring), not
 * by resizing the time text. Leave `time` unset on a flexible node with no
 * real time anchor (Rendezvous, Batuu Operations) rather than inventing one
 * just to fill the column.
 *
 * `timeFromParkHours: true` on an "endpoint" node tells MissionDayPage to
 * substitute that day's actual close time from parkHours.js at render time,
 * instead of a literal `time` string here — so publishing the real Oct 2026
 * hours later only means editing parkHours.js, never this file or any JSX.
 *
 * `blocks` is a small, fixed set of content-block types (see RailBlocks.jsx
 * for the renderer) rather than raw JSX, specifically so Tuesday-Friday can
 * reuse the exact same renderer: "text", "highlight", "flowSteps",
 * "flightPair", "attractionRefs", "opportunityList", "featureCard",
 * "foodList". This is deliberately NOT a generic schema for arbitrary future
 * content — it's exactly the handful of shapes Monday's real content needs,
 * which is also what every other day needs (flights only appear once, on
 * Monday and Friday).
 *
 * attractionRefs blocks reference PARKS ids (see parks.js) and resolve their
 * vote counts live via getPositiveVoteCount — nothing here hard-codes a
 * count. `flightPair` similarly references FLIGHT_ITINERARIES ids from
 * flights.js rather than repeating flight numbers/times here.
 *
 * `tint` is a small color used for that node's marker + a very subtle local
 * accent — this is what makes the page "subtly evolve while scrolling"
 * (cooler near Deployment, warmer through Batuu, strongest at Oga's, deep
 * night by Evening Operations) without a single page-spanning background
 * effect or any scroll-jacking.
 */
export const MONDAY_MISSION = {
  id: "monday",
  missionNumber: "MISSION 01",
  title: "INFILTRATE BATUU",
  date: "Monday, October 19, 2026",
  parkId: "hs",
  accent: "#c98a4b",

  operatingIntel: {
    parkLabel: "HOLLYWOOD STUDIOS",
    lockedEvent: { label: "OGA'S CANTINA", time: "4:20 PM" },
    targetArrival: "~11:30 AM",
  },

  rail: [
    {
      kind: "flexible",
      id: "depart-for-airport",
      heading: "DEPART FOR AIRPORT",
      tint: "#7fa7d9",
      time: "2:45 AM",
      blocks: [
        { type: "highlight", label: "MAIN SQUAD", value: "Depart Yorkville for MDW" },
        {
          type: "text",
          text: "Planned departure time for the 5:00 AM Southwest flight out of Chicago Midway. Justin's leg departs separately from Austin, so this one only applies to the Main Squad.",
        },
      ],
    },
    {
      kind: "flexible",
      id: "deployment",
      heading: "DEPLOYMENT",
      tint: "#7fa7d9",
      blocks: [{ type: "flightPair", flightIds: ["main-squad", "justin"] }],
    },
    {
      kind: "flexible",
      id: "rendezvous",
      heading: "ORLANDO RENDEZVOUS",
      tint: "#7fa7d9",
      blocks: [
        { type: "highlight", label: "PRIMARY OBJECTIVE", value: "MCO Baggage Claim" },
        {
          type: "text",
          text: "If the main group arrives early enough and Justin's arrival gate is practical, the early group may meet him there. Otherwise baggage claim is the default rendezvous.",
        },
        { type: "flowSteps", steps: ["Collect luggage", "Ground transportation", "Dockside"] },
      ],
    },
    {
      kind: "flexible",
      id: "basecamp",
      heading: "ESTABLISH BASECAMP",
      tint: "#9a9a7f",
      // Same value as the "TARGET INSERTION" highlight below, surfaced at
      // the node level too so MissionRail can show it in the left time
      // column — this is a display-layer duplication of one existing
      // value, not a new time.
      time: "~11:30 AM",
      blocks: [
        { type: "highlight", label: "LOCATION", value: "Universal Endless Summer — Dockside" },
        {
          type: "opportunityList",
          items: ["Drop luggage", "Regroup", "Freshen up if needed", "Transportation to Hollywood Studios"],
        },
        { type: "highlight", label: "TARGET INSERTION", value: "~11:30 AM" },
      ],
    },
    {
      kind: "flexible",
      id: "batuu-ops",
      heading: "BATUU OPERATIONS",
      tint: "#c98a4b",
      blocks: [
        { type: "text", label: "WINDOW", text: "Arrival → Oga's" },
        {
          type: "text",
          text: "These are the primary experiences and opportunities the squad identified. Do them in whatever order makes sense based on hunger, wait times, energy, and availability.",
        },
        {
          type: "attractionRefs",
          heading: "PRIMARY OBJECTIVES",
          variant: "primary",
          itemIds: ["hs-rise", "hs-falcon"],
        },
        {
          type: "opportunityList",
          heading: "EXPLORE BATUU",
          items: ["Black Spire Outpost", "Marketplace", "Atmosphere", "Characters & roaming entertainment", "Photos", "Shops"],
          note: "Not scheduled — wander as you go.",
        },
        {
          type: "featureCard",
          heading: "LEGACY ARMORY",
          subheading: "DOK-ONDAR'S DEN OF ANTIQUITIES",
          items: [
            "Legacy character lightsabers — Darth Vader, Luke, Ahsoka, and others depending on inventory",
            "Kyber crystals",
            "Lightsaber accessories",
            "Collectibles & artifacts",
          ],
          tagline: "Find the saber worthy of the mission.",
        },
        {
          type: "opportunityList",
          variant: "secondary",
          heading: "SOUVENIR OPPORTUNITIES",
          items: ["Droid Depot", "Creature Stall", "Resistance Supply", "First Order Cargo", "Toydarian Toymaker"],
          note: "Droid Depot is an optional souvenir/discovery stop, not a squad objective — nobody specifically voted for it.",
        },
        {
          type: "foodList",
          heading: "RATIONS — BATUU",
          items: [
            { name: "Docking Bay 7", desc: "Best substantial meal option" },
            { name: "Ronto Roasters", desc: "Quick food — Ronto Wrap" },
            { name: "Milk Stand", desc: "Blue Milk / Green Milk" },
          ],
          note: "Eat when it makes sense — no scheduled lunch, no reservation.",
        },
      ],
    },
    {
      kind: "hard",
      id: "ogas",
      heading: "OGA'S CANTINA",
      time: "4:20 PM",
      tag: "LOCKED",
      targetArrival: "~4:05 PM",
      vibeTags: ["Drinks", "Atmosphere", "Batuu Experience"],
      note: "Avoid entering a long attraction queue immediately before the reservation.",
      tint: "#e0a34d",
    },
    {
      kind: "flexible",
      id: "evening-ops",
      heading: "EVENING OPERATIONS",
      tint: "#5a6a9a",
      time: "5:00 PM",
      blocks: [
        { type: "text", label: "WINDOW", text: "After Oga's → Park Close" },
        {
          type: "attractionRefs",
          variant: "list",
          intro: "Opportunities, not a ride order:",
          itemIds: ["hs-tot", "hs-startours", "hs-villains", "hs-indianajones", "hs-slinky"],
        },
        {
          type: "opportunityList",
          heading: "NIGHT OPTIONS",
          items: [
            "Galaxy's Edge after dark",
            "Re-ride favorites",
            "Quick bites or dinner when hungry",
            "Shopping",
            "Photos",
            "Fantasmic! (if desired)",
            "Simply wander and enjoy the park",
          ],
        },
      ],
    },
    {
      kind: "endpoint",
      id: "park-close",
      heading: "END OF PARK MISSION",
      tint: "#3f4d73",
      timeFromParkHours: true,
      blocks: [
        {
          type: "text",
          text: "Hollywood Studios operations conclude for the day — head back to basecamp whenever the squad is ready to call it.",
        },
      ],
    },
  ],
};
