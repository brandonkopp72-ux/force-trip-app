/**
 * Five Days / One Mission — day card content + visual identity config.
 * Every background is a plain CSS gradient (no images, no copyrighted art,
 * no scraped park photography) so each day reads as a distinct mood while
 * staying inside the same dark V2 language.
 *
 * Phase 2 intentionally stops at this config + the clickable card grid —
 * no MissionDayPage exists yet. `id` is the key Phase 3 will route on when
 * it attaches real day pages (see FiveDaysPage.jsx's activeDayId state).
 */
export const MISSION_DAYS = [
  {
    id: "monday",
    dateLabel: "MON 19",
    parkLines: ["HOLLYWOOD STUDIOS", "GALAXY'S EDGE"],
    missionIdentity: "INFILTRATE BATUU",
    accent: "#ffb84d",
    // space / desert / stars / industrial amber
    background:
      "radial-gradient(circle at 22% 24%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 1.2%), " +
      "radial-gradient(circle at 68% 16%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 1%), " +
      "radial-gradient(circle at 46% 38%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 1%), " +
      "radial-gradient(circle at 84% 58%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 1%), " +
      "radial-gradient(circle at 12% 68%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 1%), " +
      "linear-gradient(160deg, #2b1d10 0%, #170f08 55%, #070402 100%)",
  },
  {
    id: "tuesday",
    dateLabel: "TUE 20",
    parkLines: ["ISLANDS OF ADVENTURE"],
    missionIdentity: "ADVENTURE BEYOND THE GATES",
    accent: "#e0b25c",
    // wizarding / jungle / adventure atmosphere
    background:
      "radial-gradient(circle at 30% 115%, rgba(224,178,92,0.28) 0%, rgba(224,178,92,0) 45%), " +
      "linear-gradient(160deg, #1c3326 0%, #0e2117 55%, #060f0b 100%)",
  },
  {
    id: "wednesday",
    dateLabel: "WED 21",
    parkLines: ["EPIC UNIVERSE"],
    missionIdentity: "ENTER THE PORTALS",
    accent: "#b39dff",
    // cosmic / portal / futuristic
    background:
      "radial-gradient(circle at 50% 42%, rgba(180,140,255,0.5) 0%, rgba(120,90,220,0.22) 18%, rgba(20,10,50,0) 42%), " +
      "linear-gradient(160deg, #241640 0%, #150c30 55%, #07040f 100%)",
  },
  {
    id: "thursday",
    dateLabel: "THU 22",
    parkLines: ["UNIVERSAL STUDIOS", "AVA'S BIRTHDAY", "HALLOWEEN HORROR NIGHTS"],
    missionIdentity: "DOUBLE FEATURE",
    accent: "#ff6b57",
    // theme-park energy transitioning toward darker horror tones
    background: "linear-gradient(180deg, #3a1414 0%, #260d13 40%, #140609 70%, #0a0508 100%)",
  },
  {
    id: "friday",
    dateLabel: "FRI 23",
    parkLines: ["FINAL MORNING", "EXTRACTION"],
    missionIdentity: "EXTRACTION",
    accent: "#e8b98f",
    // calmer travel / sunrise / extraction — deliberately less saturated than the other four
    background: "linear-gradient(160deg, #232838 0%, #3a3542 35%, #6e5a5a 62%, #b98a70 82%, #e0ab84 100%)",
  },
];
