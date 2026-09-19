/**
 * Shared star-position data for the V2 "Final Approach -> lightspeed"
 * starfield. Both the idle Final Approach starfield
 * (FinalApproachStarfield) and the accelerating LightspeedTransition
 * streaks are built from THIS SAME array — same anchor positions,
 * thickness, and brightness — so clicking FINAL MISSION BRIEF reads as
 * "these stars accelerate" rather than one starfield disappearing and an
 * unrelated one appearing. App.jsx generates one array per session (via a
 * useState lazy initializer) and passes it down to both components.
 *
 * sqrt(random) samples radius uniformly by AREA (not by radius) across
 * nearly the full viewport, so stars fill the screen edge-to-edge instead
 * of clustering near center — this is the same distribution already
 * approved for the lightspeed streaks; reusing it here is what keeps the
 * two in sync rather than being two independently-tuned effects that
 * happen to look similar.
 *
 * This module is intentionally separate from StarfieldCrawl.jsx (the V1
 * cinematic intro's starfield) — different look, different lifecycle,
 * different keyframe names — so neither can destabilize the other.
 */
export const STARFIELD_COUNT = 130;
export const STARFIELD_MAX_RADIUS_VMAX = 62;

export function generateStarfield(count = STARFIELD_COUNT) {
  return Array.from({ length: count }, () => {
    // Angle in the screen-space convention (0deg = east, clockwise,
    // matching cos/sin with a Y-down axis) so the anchor offset and a
    // rotated streak direction agree — CSS rotate(0) points "down" (south
    // = 90deg in this convention), so consumers rotate by angle-90 to line
    // a vertical element up with its own anchor ray.
    const angle = Math.random() * 360;
    const angleRad = (angle * Math.PI) / 180;
    const rotateDeg = angle - 90;

    const startRadius = Math.sqrt(Math.random()) * STARFIELD_MAX_RADIUS_VMAX;
    const distFactor = startRadius / STARFIELD_MAX_RADIUS_VMAX; // 0 at the vanishing point, 1 at/past the edge

    return {
      rotateDeg,
      anchorLeftVmax: Math.cos(angleRad) * startRadius,
      anchorTopVmax: Math.sin(angleRad) * startRadius,
      distFactor,
      thickness: Math.random() < 0.12 ? 2 : 1, // a few slightly thicker "hero" stars
      peakOpacity: 0.4 + distFactor * 0.4 + Math.random() * 0.2,
      // Idle-twinkle-only fields (LightspeedTransition ignores these): a
      // negative animation-delay is used for these so each star starts
      // already mid-cycle, staggered, instead of every star twinkling in
      // sync from the moment Final Approach mounts.
      twinkleDuration: 2600 + Math.random() * 2600,
      twinkleDelay: Math.random() * 4000,
      driftX: +(Math.random() * 2.4 - 1.2).toFixed(2),
      driftY: +(Math.random() * 2.4 - 1.2).toFixed(2),
    };
  });
}
