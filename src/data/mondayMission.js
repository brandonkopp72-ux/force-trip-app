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
 * A rail node is either:
 *   { kind: "flexible", id, heading, tint, blocks: [...] }  — small marker, no pulse
 *   { kind: "hard", id, heading, time, tag, targetArrival, note, vibeTags, tint } — large pulsing marker
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
  ],
};
