import { useEffect, useMemo, useState } from "react";

const STAR_COUNT = 80;
const CRAWL_DURATION_S = 42;

/**
 * Contained Star-Wars-style crawl.
 *
 * The important geometry is:
 *   viewport/camera (perspective)
 *     -> fixed tilted plane (rotateX)
 *       -> text track moving upward on that plane
 *
 * Do NOT animate scale() on the whole crawl. Real perspective makes text
 * naturally shrink and converge as it travels farther up the tilted plane.
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
              transform: translate3d(0, calc(-100% - 620px), 0);
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
      ) : (
        <>
          {/* CAMERA: perspective belongs here, outside the tilted crawl plane. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: 340,
              perspectiveOrigin: "50% 18%",
              overflow: "hidden",
            }}
          >
            {/* PLANE: fixed tilt. The text moves on this plane. */}
            <div
              style={{
                position: "absolute",
                left: "10%",
                width: "80%",
                top: "28%",
                height: "180%",
                transformOrigin: "50% 0%",
                transform: "rotateX(32deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* TRACK: starts below the viewport and travels toward the horizon. */}
              <div
                style={{
                  position: "absolute",
                  top: "46%",
                  left: 0,
                  width: "100%",
                  paddingInline: "3%",
                  boxSizing: "border-box",
                  animation: `crawlTravel ${CRAWL_DURATION_S}s linear forwards`,
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
              background:
                "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.92) 4%, rgba(0,0,0,0.48) 10%, rgba(0,0,0,0) 20%)",
            }}
          />
        </>
      )}
    </div>
  );
}
