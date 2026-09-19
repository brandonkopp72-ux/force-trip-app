import { useEffect, useMemo, useRef, useState } from "react";
import { playLightspeedWhoosh } from "../lib/audioEngine.js";

const STAR_COUNT = 130;
// Absolute time budget for the peak bloom, independent of total duration —
// a short punctuation mark at arrival, not a scene of its own.
const FLASH_MS = 120;

// The dark backdrop V2Shell uses. Reused verbatim (not just visually
// matched) so unmounting this component and mounting V2Shell produces no
// perceptible color jump — the fix for the "dead black frame" complaint is
// mostly just: never show flat black in the first place.
const V2_BACKGROUND = "radial-gradient(ellipse at 50% 0%, #10182c 0%, #05070f 55%, #000 100%)";

/**
 * "Lightspeed" streak transition — Final Approach -> V2. A sibling to
 * MissionTransition, not a third variant of it: MissionTransition is built
 * around a headline-slam moment (a name/subtitle resolving center-screen),
 * while this is a pure motion beat with no text at all, so the two don't
 * share enough structure to fold together.
 *
 * Each star gets its OWN small generated keyframe block (angle, starting
 * radius, final length, timing all independently randomized) rather than
 * every streak sharing one animation anchored dead-center — that shared-
 * spoke approach is what read as a radial explosion instead of travel
 * through a starfield. A star's anchor radius is sampled via sqrt(random)
 * (area-uniform, not radius-uniform) across nearly the full viewport, so
 * at rest the field is genuinely scattered edge-to-edge rather than
 * clustered within a few vmax of center — that clustering, not the streak
 * timing, was what made an earlier pass still read as a hub with spokes
 * even after the per-star randomization was added. Each star then grows
 * outward from its own already-offset anchor via scaleY along that same
 * ray — a fixed-origin comet tail growing outward, which is what actually
 * reads as "flying past" rather than "radiating from." Streak length,
 * speed, and brightness all scale up with a star's distance from the
 * vanishing point, matching real optical flow (things dead ahead barely
 * seem to move; things toward the periphery streak past longest and
 * fastest) — this is also what sells "increasing forward motion" rather
 * than every streak simply growing in place at the same rate.
 *
 * Fixed duration in the 1.5s-2.5s range (default 2000ms). Respects
 * prefers-reduced-motion with a much shorter, simpler fade.
 */
export function LightspeedTransition({ duration = 2000, onComplete }) {
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    playLightspeedWhoosh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveDuration = reduced ? 500 : duration;

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (onComplete) onComplete();
    }, effectiveDuration);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveDuration]);

  const stars = useMemo(() => {
    // vmax — comfortably past every screen edge on any aspect ratio, so
    // the far end of the range still reaches (and rockets past) the
    // corners rather than stopping short of them.
    const maxRadius = 62;

    return Array.from({ length: STAR_COUNT }, () => {
      // Angle in the screen-space convention (0deg = east, clockwise,
      // matching cos/sin with a Y-down axis) so the anchor offset and the
      // rotated streak direction agree — CSS rotate(0) points "down"
      // (south = 90deg in this convention), so the transform needs
      // angle-90 to line the streak up with its own anchor ray.
      const angle = Math.random() * 360;
      const angleRad = (angle * Math.PI) / 180;
      const rotateDeg = angle - 90;

      // sqrt(random) samples radius uniformly by AREA (a plain uniform
      // radius would bias density toward the center, since an annulus's
      // area grows with r) — this is what makes the field genuinely fill
      // the viewport at rest instead of clustering near the middle.
      const startRadius = Math.sqrt(Math.random()) * maxRadius;
      const distFactor = startRadius / maxRadius; // 0 at the vanishing point, 1 at/past the edge

      const anchorLeftVmax = Math.cos(angleRad) * startRadius;
      const anchorTopVmax = Math.sin(angleRad) * startRadius;

      // Final streak length (vmax, since the base box height is 1vmax and
      // this becomes its scaleY). Scales with distance from the vanishing
      // point — farther-out stars travel farther — with random spread on
      // top so streaks at similar distances still vary.
      const finalScale = 5 + distFactor * 60 + Math.random() * 20;
      const midScale = finalScale * (0.26 + Math.random() * 0.12);

      const thickness = Math.random() < 0.12 ? 2 : 1; // a few slightly thicker "hero" streaks
      const peakOpacity = 0.4 + distFactor * 0.4 + Math.random() * 0.2;

      // Individual timeline: farther-out stars also complete their travel
      // faster (shorter localDuration), reinforcing the same "streaking
      // past" sensation rather than just "growing longer." A random delay
      // means some streaks are already whipping past while others are
      // just starting.
      const localDuration = effectiveDuration * (0.8 - distFactor * 0.35 + Math.random() * 0.15);
      const delay = Math.random() * Math.max(0, effectiveDuration - localDuration);

      return {
        rotateDeg,
        anchorLeftVmax,
        anchorTopVmax,
        finalScale,
        midScale,
        thickness,
        peakOpacity,
        localDuration,
        delay,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveDuration]);

  // Bloom keyframe percentages, computed from an absolute ms budget so the
  // flash stays ~120ms of screen time regardless of total duration.
  const flashRiseStartPct = Math.max(0, 100 - ((FLASH_MS * 1.8) / effectiveDuration) * 100);
  const flashPeakPct = Math.max(0, 100 - ((FLASH_MS * 0.85) / effectiveDuration) * 100);
  const flashFallEndPct = Math.max(0, 100 - ((FLASH_MS * 0.1) / effectiveDuration) * 100);

  const starKeyframes = stars
    .map(
      (s, i) => `
      @keyframes lsStar${i} {
        0% { opacity: 0; transform: rotate(${s.rotateDeg.toFixed(1)}deg) scaleY(0.3); }
        16% { opacity: ${(s.peakOpacity * 0.55).toFixed(2)}; transform: rotate(${s.rotateDeg.toFixed(1)}deg) scaleY(0.6); }
        70% { opacity: ${s.peakOpacity.toFixed(2)}; transform: rotate(${s.rotateDeg.toFixed(1)}deg) scaleY(${s.midScale.toFixed(1)}); }
        100% { opacity: ${s.peakOpacity.toFixed(2)}; transform: rotate(${s.rotateDeg.toFixed(1)}deg) scaleY(${s.finalScale.toFixed(1)}); }
      }
    `
    )
    .join("\n");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2500,
        background: V2_BACKGROUND,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes lsFlash {
          0%, ${flashRiseStartPct}% { opacity: 0; }
          ${flashPeakPct}% { opacity: 0.8; }
          ${flashFallEndPct}%, 100% { opacity: 0; }
        }
        @keyframes lsReducedFade {
          0% { opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        ${reduced ? "" : starKeyframes}
      `}</style>

      {reduced ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: V2_BACKGROUND,
            animation: `lsReducedFade ${effectiveDuration}ms ease forwards`,
          }}
        />
      ) : (
        <>
          {stars.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${s.anchorLeftVmax.toFixed(2)}vmax)`,
                top: `calc(50% + ${s.anchorTopVmax.toFixed(2)}vmax)`,
                width: s.thickness,
                height: "1vmax",
                background: "linear-gradient(#eaf3ff, transparent)",
                boxShadow: s.thickness > 1 ? "0 0 5px rgba(234,243,255,0.65)" : "none",
                transformOrigin: "50% 0%",
                animation: `lsStar${i} ${s.localDuration}ms cubic-bezier(0.3, 0.05, 0.2, 1) ${s.delay}ms forwards`,
              }}
            />
          ))}
          {/* Cool blue-white bloom, concentrated near the vanishing point
              rather than a flat full-screen wash — punctuates arrival
              instead of becoming its own scene. An explicit vmax radius
              (rather than percentage stops, which default to sizing off
              the farthest corner) is what actually keeps this contained;
              percentage-only stops were what made the earlier version
              wash most of the screen regardless of how low the stop
              percentages were set. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle 32vmax at 50% 42%, #eaf3ff 0%, rgba(219,233,255,0.5) 28%, transparent 75%)",
              animation: `lsFlash ${effectiveDuration}ms ease forwards`,
            }}
          />
        </>
      )}
    </div>
  );
}
