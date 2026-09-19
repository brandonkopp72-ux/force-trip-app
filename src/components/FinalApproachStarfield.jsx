/**
 * Idle starfield behind Final Approach's content. Renders the SAME star
 * anchors (position/thickness/brightness — see src/lib/starfield.js) that
 * LightspeedTransition later accelerates, as the same thin vertical
 * gradient-bar element at a small resting scale, gently twinkling and
 * drifting. Because both components read from one shared array generated
 * once in App.jsx, when FINAL MISSION BRIEF swaps this component out for
 * LightspeedTransition, the streaks pick up from visually the same dots
 * rather than an unrelated field popping in.
 *
 * Deliberately understated — a low opacity ceiling and slow, staggered
 * per-star timing — so it reads as ambient background texture behind the
 * title/buttons/countdown, not a competing decorative layer. This is
 * purely a background layer: no card, panel, or frame.
 */
export function FinalApproachStarfield({ stars }) {
  const perStarRules = stars
    .map(
      (s, i) => `
    .force-fa-star-${i} {
      --rot: ${s.rotateDeg.toFixed(1)}deg;
      --dim: ${(s.peakOpacity * 0.22).toFixed(2)};
      --bright: ${(s.peakOpacity * 0.55).toFixed(2)};
      --driftX: ${s.driftX}px;
      --driftY: ${s.driftY}px;
      left: calc(50% + ${s.anchorLeftVmax.toFixed(2)}vmax);
      top: calc(50% + ${s.anchorTopVmax.toFixed(2)}vmax);
      width: ${s.thickness}px;
      animation-duration: ${s.twinkleDuration.toFixed(0)}ms;
      animation-delay: -${s.twinkleDelay.toFixed(0)}ms;
    }
  `
    )
    .join("\n");

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes forceStarTwinkle {
          0%, 100% { opacity: var(--dim); transform: rotate(var(--rot)) translate(0, 0) scaleY(0.4); }
          50% { opacity: var(--bright); transform: rotate(var(--rot)) translate(var(--driftX), var(--driftY)) scaleY(0.55); }
        }
        .force-fa-star {
          position: absolute;
          height: 1vmax;
          background: linear-gradient(#eaf3ff, transparent);
          transform-origin: 50% 0%;
          animation-name: forceStarTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        ${perStarRules}
      `}</style>
      {stars.map((_, i) => (
        <div key={i} className={`force-fa-star force-fa-star-${i}`} />
      ))}
    </div>
  );
}
