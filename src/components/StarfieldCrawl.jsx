import { useEffect, useMemo, useState } from "react";

const STAR_COUNT = 80;

/**
 * Contained OR full-screen Star-Wars-style crawl.
 *
 * FULLSCREEN geometry (redesigned):
 *   The PLANE is sized to exactly match the viewport (no more
 *   percentage-of-percentage math relative to an already-percentage-sized
 *   container — that compounding was the root cause of both the "13 seconds
 *   of dead travel" and "flat, non-receding text" bugs in earlier passes).
 *   The tilt pivot sits at the BOTTOM of the plane (near the viewer), so
 *   text entering at the bottom starts at full size with ~zero Z-depth, and
 *   only recedes/shrinks as it travels upward away from that pivot — the
 *   standard, intuitive crawl setup.
 *
 * CONTAINED geometry is left exactly as previously tuned/verified working,
 * untouched by this redesign.
 *
 * Do NOT animate scale() on the whole crawl. Real perspective makes text
 * naturally shrink and converge as it travels farther from the pivot.
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
  const travelExtraPx = fullscreen ? 500 : 620;

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
            92% { opacity: 1; }
            100% {
              transform: translate3d(0, calc(-100% - ${travelExtraPx}px), 0);
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
      ) : starsOnly ? null : fullscreen ? (
        <>
          {/* CAMERA: fills the viewport exactly. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: "70vh",
              perspectiveOrigin: "50% 15%",
              overflow: "hidden",
            }}
          >
            {/* PLANE: sized to match the viewport exactly (no compounded
                percentages). Pivot at the BOTTOM — near the viewer — so
                content starts full-size and recedes as it moves away. */}
            <div
              style={{
                position: "absolute",
                left: `${(100 - columnWidthVw) / 2}%`,
                width: `${columnWidthVw}%`,
                top: 0,
                height: "100%",
                transformOrigin: "50% 100%",
                transform: "rotateX(-25deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* TRACK: starts right at the pivot (bottom edge) so it enters
                  the visible frame almost immediately after mounting. */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
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

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.9) 5%, rgba(0,0,0,0.4) 11%, rgba(0,0,0,0) 20%)",
            }}
          />
        </>
      ) : (
        <>
          {/* CONTAINED mode — untouched, exactly as previously tuned/verified. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: 340,
              perspectiveOrigin: "50% 18%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${(100 - columnWidthVw) / 2}%`,
                width: `${columnWidthVw}%`,
                top: "28%",
                height: "180%",
                transformOrigin: "50% 0%",
                transform: "rotateX(32deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "46%",
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

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.92) 4%, rgba(0,0,0,0.48) 10%, rgba(0,0,0,0) 20%)",
            }}
          />
        </>
      )}
    </div>
  );
}
