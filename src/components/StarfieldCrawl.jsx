import { useEffect, useMemo, useState } from "react";

const STAR_COUNT = 80;
const CRAWL_DURATION_S = 42;

/**
 * A contained (not full-screen) starfield with a receding 3D text crawl —
 * built entirely from CSS transforms, no video/canvas/external assets.
 * Plays once automatically; the actual call-to-action button lives outside
 * this component and is never blocked by the animation.
 *
 * Technique note: the tilt (rotateX) is held CONSTANT on the crawling block
 * itself — only its `top` position is animated. Because the tilt never
 * changes, the browser's real 3D perspective math (driven by the ancestor's
 * `perspective`) does the actual shrinking-toward-a-point work correctly.
 * Animating `transform` (including a manual `scale()`) instead of `top`
 * looks like scrolling-while-shrinking rather than genuine convergence
 * toward a vanishing point — that was the earlier bug.
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
          @keyframes crawlRise {
            0% { top: 100%; opacity: 1; }
            88% { opacity: 1; }
            100% { top: -480%; opacity: 0; }
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
        <div style={{ position: "absolute", inset: 0, perspective: "350px", perspectiveOrigin: "50% 50%" }}>
          <div
            style={{
              position: "absolute",
              left: "9%",
              width: "82%",
              transform: "rotateX(25deg)",
              transformOrigin: "50% 100%",
              animation: `crawlRise ${CRAWL_DURATION_S}s linear forwards`,
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
