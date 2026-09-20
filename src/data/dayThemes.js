/**
 * Phase 5 — per-day page-background theming for the Mission Rail pages
 * (Monday-Friday). Each value is a plain, layered CSS `background` string
 * (radial-gradient "glow" layers over a linear-gradient base) — no images,
 * no copyrighted art, same technique missionDays.js already uses for the
 * Five Days hub cards.
 *
 * These are DELIBERATELY separate from missionDays.js's `background` field:
 * that one is tuned for a short ~150px hub card with a bottom text scrim,
 * while these are tuned to look right stretched across an entire page's
 * natural content height (which the browser does automatically — the
 * gradient is painted once across the element's full box, so scrolling the
 * page reveals different vertical slices of it). That's what gives each day
 * a "progressive" feel with zero JavaScript: no scroll listeners, no
 * parallax, no scroll-jacking — just a tall gradient painted behind normal
 * document flow.
 *
 * Nothing here touches rail content, structure, times, or any approved
 * copy — MissionDayPage applies this purely as a backdrop behind the
 * existing page.
 */
export const DAY_PAGE_BACKGROUNDS = {
  // BATUU — deep navy, a scattering of distant stars, and a warm desert-
  // amber/rust wash gathering around the middle of the page (roughly where
  // Batuu Operations and Oga's Cantina sit), fading back to deep night by
  // Evening Operations. Reinforces the tint progression already built into
  // mondayMission.js's own rail nodes rather than fighting it.
  monday:
    "radial-gradient(circle at 18% 5%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 0.5%), " +
    "radial-gradient(circle at 64% 3%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(circle at 42% 11%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(circle at 82% 16%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(circle at 10% 24%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(circle at 90% 34%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(ellipse 900px 520px at 50% 46%, rgba(224,163,77,0.14) 0%, rgba(224,163,77,0) 60%), " +
    "linear-gradient(180deg, #0c1220 0%, #14100b 32%, #1d130b 48%, #170f09 62%, #0d0a08 80%, #05070f 100%)",

  // ADVENTURE BEYOND THE GATES — cool stone/mist at Hogsmeade, warming
  // through a jungle green for the Jurassic/Marvel stretch, a dusk pivot at
  // Islands Mission Ends, and a warm CityWalk neon glow at the close.
  tuesday:
    "radial-gradient(ellipse 760px 460px at 18% 4%, rgba(140,164,196,0.16) 0%, rgba(140,164,196,0) 55%), " +
    "radial-gradient(ellipse 820px 520px at 82% 42%, rgba(63,158,122,0.16) 0%, rgba(63,158,122,0) 55%), " +
    "radial-gradient(ellipse 700px 420px at 20% 80%, rgba(224,112,79,0.14) 0%, rgba(224,112,79,0) 55%), " +
    "linear-gradient(180deg, #121b2a 0%, #101f1f 28%, #0e2117 50%, #17231a 70%, #241c14 100%)",

  // ENTER THE PORTALS — the most luminous/cosmic page: soft starfield up
  // top, then a few large, softly-glowing portal-like arcs at different
  // heights standing in for the park's different lands, all kept in one
  // coherent deep-blue/violet family rather than a hue per land.
  wednesday:
    "radial-gradient(circle at 24% 4%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(circle at 68% 6%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(circle at 46% 12%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 0.4%), " +
    "radial-gradient(ellipse 620px 620px at 50% 18%, rgba(180,140,255,0.22) 0%, rgba(120,90,220,0.08) 42%, rgba(20,10,50,0) 65%), " +
    "radial-gradient(ellipse 540px 540px at 15% 52%, rgba(120,170,255,0.15) 0%, rgba(90,120,220,0) 60%), " +
    "radial-gradient(ellipse 540px 540px at 85% 80%, rgba(200,150,255,0.15) 0%, rgba(140,90,220,0) 60%), " +
    "linear-gradient(180deg, #1a1236 0%, #1f1140 32%, #180b30 60%, #0e0620 82%, #07040f 100%)",

  // DOUBLE FEATURE — the most important transformation: brighter, warmer
  // daytime energy up top, deepening through Diagon Alley's gold and Ava's
  // Birthday's warm coral, cooling into HHN's deep crimson and near-black by
  // the close. A gradual, single top-to-bottom gradient (no hard cut) that
  // reinforces thursdayMission.js's own already-progressive node tints.
  thursday:
    "radial-gradient(ellipse 900px 380px at 50% 3%, rgba(255,178,110,0.16) 0%, rgba(255,178,110,0) 55%), " +
    "radial-gradient(ellipse 760px 480px at 72% 52%, rgba(122,31,31,0.16) 0%, rgba(122,31,31,0) 60%), " +
    "radial-gradient(ellipse 820px 460px at 28% 88%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 55%), " +
    "linear-gradient(180deg, #4a3018 0%, #6b3a22 10%, #5c2a1c 24%, #4a1e18 38%, #3a1414 52%, #260d13 68%, #150710 84%, #05070a 100%)",

  // EXTRACTION — calmest of the five: a hazy dawn glow near the top easing
  // into the same muted travel palette Friday's rail already uses, warming
  // only gently toward the bottom.
  friday:
    "radial-gradient(ellipse 760px 380px at 28% 4%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 55%), " +
    "radial-gradient(ellipse 680px 420px at 78% 72%, rgba(224,171,132,0.12) 0%, rgba(224,171,132,0) 55%), " +
    "linear-gradient(180deg, #141a26 0%, #1f2432 18%, #333042 38%, #5c4c50 58%, #97715f 78%, #c99873 92%, #e0ab84 100%)",
};

export function getDayPageBackground(dayId) {
  return DAY_PAGE_BACKGROUNDS[dayId] || null;
}
