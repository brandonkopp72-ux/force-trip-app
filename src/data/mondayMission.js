import { buildEntertainmentNode } from "./nighttimeEntertainment.js";

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
 *     (a standalone close-of-day node — Monday's Evening Operations ALSO
 *     shows its own "5:00–<close> PM" range via rangeEndFromParkHours, and
 *     Monday additionally carries its own separate Park Close endpoint
 *     after it, per the Phase 5 correction pass — see the bottom of
 *     MONDAY_MISSION.rail below)
 *
 * `time` (optional on "flexible"; required on "hard") is a known, meaningful
 * time MissionRail shows in its left-side time column, aligned with that
 * node's marker. Every time in that column renders at the SAME size/weight/
 * line-height regardless of node kind — only its color differs, by
 * convention: a plain clock time reads bright/neutral, an approximate one
 * (write the "~" into the string itself) reads softer, and a "hard" node's
 * locked time reads in the accent amber. The type of event is communicated
 * by the MARKER (small dot vs. large pulsing vs. ring), not by resizing the
 * time text. Monday intentionally keeps every primary anchor a firm value
 * (no "~") now that the day is broken into six broad phases rather than a
 * dense sequence of small steps — leave `time` unset on any node that isn't
 * one of those six primary phases, rather than inventing one to fill a row.
 *
 * `timeFromParkHours: true` on an "endpoint" node tells MissionDayPage to
 * substitute that day's actual close time from parkHours.js at render time.
 * `rangeEndFromParkHours: true` on a "flexible" node instead combines its own
 * literal `time` (a fixed start) with that same close time into one range
 * string via formatEveningWindow() — this is how Evening Operations shows
 * "5:00–9:00 PM" without hard-coding the close hour here. Either way,
 * publishing the real Oct 2026 hours later only means editing parkHours.js,
 * never this file or any JSX.
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

// The ONE piece of Monday allowed to change in Phase 4 (per the superseding
// Phase 4 spec's nighttime-entertainment exception): a real, confirmed
// Fantasmic! showtime, once Disney publishes one for October 19, 2026. Until
// then this stays empty and buildEntertainmentNode() below refuses to
// produce a node at all — Monday's rail stays exactly the same seven nodes
// it already had (six original phases, plus Phase 5's Park Close endpoint).
// If Fantasmic performs more than once that night, list every confirmed
// time in one entry's `times` array (see nighttimeEntertainment.js) rather
// than guessing which show to target — the rail anchors on the earliest and
// lists the rest underneath.
//
// Phase 6 research (Sept 20, 2026): no October 19-specific Fantasmic!
// showtime is published yet — Disney's own Fantasmic page still only shows
// generic, "subject to change" times and points to the day-specific
// Entertainment Schedule. Worth knowing: Fantasmic has recently run mainly
// Friday/Saturday nights rather than nightly, so it's genuinely unclear
// whether it'll even run on our Monday — that's exactly why this stays
// empty rather than assuming an 8:00 PM slot.
export const MONDAY_NIGHTTIME_ENTERTAINMENT = [
  // { title: "FANTASMIC!", times: ["8:00 PM"], type: "show", status: "confirmed", url: "" },
];

const fantasmicNode = buildEntertainmentNode(MONDAY_NIGHTTIME_ENTERTAINMENT[0], {
  id: "fantasmic",
  tint: "#5a6a9a",
});

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
    // Matches the Batuu Operations rail anchor below — kept in sync with it
    // rather than the old, now-superseded ~11:30 AM basecamp estimate.
    targetArrival: "12:30 PM",
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
      time: "5:00 AM",
      blocks: [{ type: "flightPair", flightIds: ["main-squad", "justin"] }],
    },
    {
      kind: "flexible",
      id: "rendezvous",
      heading: "ORLANDO RENDEZVOUS",
      tint: "#7fa7d9",
      time: "8:45 AM",
      // Establishing basecamp (Universal Endless Summer — Dockside) folds in
      // here rather than getting its own primary rail anchor: it's the same
      // MCO → Dockside arc as the flow below, just continued through to
      // "bags dropped, ready for Hollywood Studios." The old standalone
      // "~11:30 AM target insertion" estimate is dropped since Batuu
      // Operations' own 12:30 PM anchor now covers that.
      blocks: [
        { type: "highlight", label: "PRIMARY OBJECTIVE", value: "MCO Baggage Claim" },
        {
          type: "text",
          text: "If the main group arrives early enough and Justin's arrival gate is practical, the early group may meet him there. Otherwise baggage claim is the default rendezvous.",
        },
        { type: "flowSteps", steps: ["Collect luggage", "Ground transportation", "Dockside"] },
        { type: "highlight", label: "BASECAMP", value: "Universal Endless Summer — Dockside" },
        {
          type: "opportunityList",
          items: ["Drop luggage", "Regroup", "Freshen up if needed", "Transportation to Hollywood Studios"],
        },
      ],
    },
    {
      kind: "flexible",
      id: "batuu-ops",
      heading: "BATUU OPERATIONS",
      tint: "#c98a4b",
      time: "12:30 PM",
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
      // Displayed as "5:00–<park close> PM" (see rangeEndFromParkHours in
      // MissionDayPage.jsx) — this single anchor covers Oga's through
      // closing rather than a separate end-of-day node.
      rangeEndFromParkHours: true,
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
    // Only appears once a real showtime is confirmed above — see
    // MONDAY_NIGHTTIME_ENTERTAINMENT. Filtered out entirely by default, so
    // the six-node rail above is exactly what Phase 3 shipped.
    fantasmicNode,
    // Phase 5 correction pass: a separate, normal endpoint marker for the
    // day's actual close, requested in addition to (not instead of) Evening
    // Operations' own "5:00–<close> PM" range display above. Reads the same
    // real close time from parkHours.js — never a separate hardcoded value.
    {
      kind: "endpoint",
      id: "park-close",
      heading: "PARK CLOSE",
      tint: "#5a6a9a",
      timeFromParkHours: true,
      blocks: [{ type: "text", text: "Hollywood Studios mission complete for today." }],
    },
  ].filter(Boolean),
};
