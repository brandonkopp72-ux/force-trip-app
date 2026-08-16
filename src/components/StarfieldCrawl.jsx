import { useEffect, useMemo, useState } from "react";

const STAR_COUNT = 80;
const CRAWL_DURATION_S = 42;

/**
 * A contained (not full-screen) starfield with a receding 3D text crawl —
 * built entirely from CSS transforms, no video/canvas/external assets.
 * Plays once automatically; the actual call-to-action button lives outside
 * this component and is never blocked by the animation.
 *
 * Technique note: the animated element is a FIXED-SIZE wrapper matching the
 * visible box (not the tall, variable-height text block itself). The text
 * sits bottom-anchored inside that wrapper and naturally overflows upward
 * as needed. Because the wrapper's own height never changes, its
 * `transformOrigin` percentage always lands on the same physical point on
 * screen — a genuine, predictable vanishing point — regardless of how long
 * the crawl text ends up being. Earlier attempts animated either the text
 * block's own transform (whose height varies with content) or its `top`
 * position alone (no shrink at all); both produced a flat scroll instead
 * of real convergence.
 */
export function StarfieldCrawl({ children }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div
      style={{
        position: "relative",
        height: reduced ? "auto" : 480,
        overflow: "hidden",
        background: "#000",
        borderRadius: 12,
        marginBottom: 20,
        padding: reduced ? "20px 16px" : 0,
      }}
    >
      {!reduced && (
        <style>{`
          @keyframes starTwinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
          @keyframes crawlConverge {
            0% { transform: translateY(180%) scale(1) rotateX(18deg); opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-42%) scale(0.12) rotateX(18deg); opacity: 0; }
          }
        `}</style>
      )}

      {!reduced &&
        stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#fff",
              animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

      {reduced ? (
        <div style={{ position: "relative" }}>{children}</div>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 30%",
            animation: `crawlConverge ${CRAWL_DURATION_S}s linear forwards`,
          }}
        >
          <div style={{ position: "absolute", bottom: 0, left: "9%", width: "82%" }}>{children}</div>
        </div>
      )}
    </div>
  );
}
