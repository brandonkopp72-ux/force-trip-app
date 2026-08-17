import { useEffect, useMemo, useState } from "react";

const STAR_COUNT = 80;

/**
 * Contained OR full-screen Star-Wars-style crawl.
 *
 * The important geometry is:
 *   viewport/camera (perspective)
 *     -> fixed tilted plane (rotateX)
 *       -> text track moving upward on that plane
 *
 * Do NOT animate scale() on the whole crawl. Real perspective makes text
 * naturally shrink and converge as it travels farther up the tilted plane.
 *
 * `fullscreen` swaps the outer container from a contained 480px box to a
 * `100dvh` (with `100vh` fallback) full-viewport surface, and recalculates
 * the camera/plane/track geometry for that larger, differently-proportioned
 * space. These full-screen numbers are a first-pass estimate, not yet
 * verified against a real recording the way the contained version was —
 * flagged clearly in the accompanying report.
 */
export function StarfieldCrawl({
  children,
  fullscreen = false,
  starsOnly = false,
  durationSeconds = 42,
  columnWidthVw = 80,
  fontWeight = 700,
  letterSpacingEm = 0,
}) {
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

  const outerHeight = fullscreen ? undefined : reduced ? "auto" : 480;

  return (
    <div
      style={{
        position: fullscreen ? "fixed" : "relative",
        top: fullscreen ? 0 : undefined,
        left: fullscreen ? 0 : undefined,
        width: fullscreen ? "100%" : undefined,
        height: fullscreen ? (reduced ? "auto" : "100vh") : outerHeight,
        minHeight: fullscreen && !reduced ? "100dvh" : undefined,
        overflow: "hidden",
        background: "#000",
        borderRadius: fullscreen ? 0 : 12,
        marginBottom: fullscreen ? 0 : 20,
        padding: reduced ? "20px 16px" : 0,
      }}
    >
      {!reduced && (
        <style>{`
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 1; }
          }

          @keyframes crawlTravel {
            0% {
              transform: translate3d(0, 0, 0);
              opacity: 1;
            }
            84% { opacity: 1; }
            100% {
              transform: translate3d(0, calc(-100% - ${fullscreen ? 900 : 620}px), 0);
              opacity: 0;
            }
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
      ) : starsOnly ? null : (
        <>
          {/* CAMERA: perspective belongs here, outside the tilted crawl plane. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: fullscreen ? 700 : 340,
              perspectiveOrigin: fullscreen ? "50% 22%" : "50% 18%",
              overflow: "hidden",
            }}
          >
            {/* PLANE: fixed tilt. The text moves on this plane. */}
            <div
              style={{
                position: "absolute",
                left: `${(100 - columnWidthVw) / 2}%`,
                width: `${columnWidthVw}%`,
                top: fullscreen ? "24%" : "28%",
                height: fullscreen ? "220%" : "180%",
                transformOrigin: "50% 0%",
                transform: `rotateX(${fullscreen ? 34 : 32}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* TRACK: starts below the viewport and travels toward the horizon. */}
              <div
                style={{
                  position: "absolute",
                  top: fullscreen ? "40%" : "46%",
                  left: 0,
                  width: "100%",
                  paddingInline: "3%",
                  boxSizing: "border-box",
                  fontWeight,
                  letterSpacing: `${letterSpacingEm}em`,
                  animation: `crawlTravel ${durationSeconds}s linear forwards`,
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                }}
              >
                {children}
              </div>
            </div>
          </div>

          {/* Soft horizon fade: makes the crawl disappear into the vanishing zone. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: fullscreen
                ? "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.94) 6%, rgba(0,0,0,0.55) 14%, rgba(0,0,0,0) 26%)"
                : "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.92) 4%, rgba(0,0,0,0.48) 10%, rgba(0,0,0,0) 20%)",
            }}
          />
        </>
      )}
    </div>
  );
}
