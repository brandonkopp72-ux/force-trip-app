/**
 * Mission Intel — the hype/media page's content config. Kept out of
 * MissionIntelPage.jsx so real preview links can be dropped in later
 * without touching the component.
 *
 * previewUrl / spoilerUrl are CONFIG PLACEHOLDERS (null), not invented
 * links — MissionIntelPage renders a clearly-disabled "coming soon" state
 * for any item missing one instead of guessing a URL. Fill these in with
 * official Disney/Universal preview or walkthrough links when available.
 *
 * type: "park" for the four daytime park cards, "event" for the
 * after-hours HHN card — lets the page give the event card a distinct
 * badge/treatment without a special case per card.
 *
 * hasSpoilerSection + spoiler* fields are optional and only present on
 * HHN today, but the shape supports any future item adding one (e.g. a
 * future haunted-house-specific card).
 */
export const MISSION_INTEL_ITEMS = [
  {
    id: "galaxys-edge",
    title: "GALAXY'S EDGE",
    subtitle: "Monday — Hollywood Studios",
    description: "Star Wars-themed land inside Hollywood Studios — Rise of the Resistance and Millennium Falcon: Smugglers Run.",
    previewUrl: null,
    type: "park",
    accent: "#ffb84d",
    mediaGradient:
      "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 1.4%), " +
      "radial-gradient(circle at 70% 55%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 1.2%), " +
      "linear-gradient(160deg, #3a2a12 0%, #1a1006 60%, #050302 100%)",
  },
  {
    id: "islands-of-adventure",
    title: "ISLANDS OF ADVENTURE",
    subtitle: "Tuesday",
    description: "Marvel, Jurassic Park, and The Wizarding World of Harry Potter — Hogsmeade, all in one park.",
    previewUrl: null,
    type: "park",
    accent: "#e0b25c",
    mediaGradient: "radial-gradient(circle at 30% 110%, rgba(224,178,92,0.3) 0%, rgba(224,178,92,0) 45%), linear-gradient(160deg, #1c3326 0%, #0e2117 55%, #060f0b 100%)",
  },
  {
    id: "epic-universe",
    title: "EPIC UNIVERSE",
    subtitle: "Wednesday",
    description: "Universal's newest park — four immersive worlds, one day.",
    previewUrl: null,
    type: "park",
    accent: "#b39dff",
    mediaGradient: "radial-gradient(circle at 50% 45%, rgba(180,140,255,0.5) 0%, rgba(120,90,220,0.2) 20%, rgba(20,10,50,0) 45%), linear-gradient(160deg, #241640 0%, #150c30 55%, #07040f 100%)",
  },
  {
    id: "universal-studios-florida",
    title: "UNIVERSAL STUDIOS FLORIDA",
    subtitle: "Thursday",
    description: "Movie- and TV-inspired rides and lands — also Ava's birthday day.",
    previewUrl: null,
    type: "park",
    accent: "#6fe0d6",
    mediaGradient: "radial-gradient(circle at 65% 30%, rgba(111,224,214,0.25) 0%, rgba(111,224,214,0) 40%), linear-gradient(160deg, #123a42 0%, #0a1f26 55%, #050e12 100%)",
  },
  {
    id: "halloween-horror-nights",
    title: "HALLOWEEN HORROR NIGHTS",
    subtitle: "Thursday Night",
    description: "After-hours haunted houses and scare zones take over Universal Studios once the sun goes down.",
    previewUrl: null,
    type: "event",
    accent: "#ff6b57",
    mediaGradient: "radial-gradient(circle at 50% 70%, rgba(255,107,87,0.22) 0%, rgba(255,107,87,0) 45%), linear-gradient(160deg, #3a0f14 0%, #1a060a 55%, #060203 100%)",
    hasSpoilerSection: true,
    spoilerLabel: "⚠ SPOILER INTEL",
    spoilerHeading: "HOUSE WALKTHROUGHS",
    spoilerDescription: "View only if you want to know what's waiting inside.",
    spoilerUrl: null,
  },
];
