import { useEffect, useRef, useState } from "react";
import { StarfieldCrawl } from "./StarfieldCrawl.jsx";

const DISSOLVE_MS = 500;
const OPENING_HOLD_MS = 1500;
const CRAWL_DURATION_S = 46;
const CLOSING_HOLD_MS = 900;
const EXIT_FADE_MS = 700;

const CRAWL_LINES = [
  "It has been three and a half years since the infamous Rebel coastal assault on battlefield Florida.",
  "Time has tested the survivors. Yet six remain — older, wiser, and forged by experience.",
  "They call themselves F.O.R.C.E.",
  "Family Of Rebels Creating Experiences.",
  "Now, a new objective looms on the horizon: Central Florida — birthplace of Florida Man, home to mythical lands, towering coasters, dark magic, and creatures perhaps best left untold.",
  "F.O.R.C.E. will rendezvous at MCO and establish basecamp at Dockside before launching their first strike against the fortress known as Hollywood Studios — where legends are made, empires rise, and lightsabers are sold to anyone brave enough to spend the credits.",
  "Downloaded and opened, the archives must be. Know what awaits them, they do not. Hidden, the path forward lies. Choose, they must.",
];

const crawlTextStyle = {
  fontFamily: "'Oswald', sans-serif",
  color: "#f5cc4d",
  textAlign: "center",
  margin: "0 0 22px",
};

function CtaButton({ onClick, pulse }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "16px 24px",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(16px, 3vw, 24px)",
        lineHeight: 1.6,
        color: "#f5cc4d",
        textShadow: "0 0 10px rgba(245,204,77,0.85), 0 0 24px rgba(245,204,77,0.5)",
        letterSpacing: "0.02em",
        animation: pulse ? "ctaPulse 2.4s ease-in-out infinite, ctaFadeIn 900ms ease forwards" : "ctaFadeIn 900ms ease forwards",
      }}
    >
      PLAN THE MISSION, THEY MUST.
      <br />
      RUN THE MISSION, THEY WILL.
    </button>
  );
}

/**
 * Owns the entire post-PIN cinematic sequence end to end. Exposes exactly
 * two events outward:
 *   onProceedToBriefing() — fired the instant the CTA is clicked, so the
 *     parent can activate the briefing content immediately underneath.
 *   onExitComplete() — fired only once this component's own exit-fade CSS
 *     transition has genuinely finished (via onTransitionEnd, not a guessed
 *     timeout), so the parent knows it's safe to unmount this overlay.
 * All internal stage timing (dissolve, holds, crawl duration, CTA fade-in)
 * is private to this component.
 */
export function CinematicIntro({ onProceedToBriefing, onExitComplete }) {
  const [stage, setStage] = useState("dissolve");
  const [reduced, setReduced] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (reduced) {
      timersRef.current.push(setTimeout(() => setStage("cta"), 400));
      return () => timersRef.current.forEach(clearTimeout);
    }

    timersRef.current.push(setTimeout(() => setStage("hold-open"), DISSOLVE_MS));
    timersRef.current.push(setTimeout(() => setStage("crawl"), DISSOLVE_MS + OPENING_HOLD_MS));
    timersRef.current.push(
      setTimeout(() => setStage("hold-close"), DISSOLVE_MS + OPENING_HOLD_MS + CRAWL_DURATION_S * 1000)
    );
    timersRef.current.push(
      setTimeout(
        () => setStage("cta"),
        DISSOLVE_MS + OPENING_HOLD_MS + CRAWL_DURATION_S * 1000 + CLOSING_HOLD_MS
      )
    );

    return () => timersRef.current.forEach(clearTimeout);
  }, [reduced]);

  const handleCtaClick = () => {
    if (stage === "exiting") return; // re-entrancy guard against double-click
    setStage("exiting");
    onProceedToBriefing();
  };

  const starsOnly = stage === "dissolve" || stage === "hold-open";
  const showCta = stage === "cta" || stage === "exiting";

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={(e) => {
        if (stage === "exiting" && e.propertyName === "opacity") {
          onExitComplete();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "#000",
        opacity: stage === "exiting" ? 0 : 1,
        transition: stage === "exiting" ? `opacity ${EXIT_FADE_MS}ms ease` : "opacity 500ms ease",
        pointerEvents: stage === "exiting" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes ctaFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes ctaPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
      `}</style>

      {reduced ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#3ddc84",
              fontFamily: "'Oswald', sans-serif",
              fontSize: 12,
              letterSpacing: "0.15em",
              marginBottom: 16,
            }}
          >
            F.O.R.C.E. MISSION BRIEFING
          </div>
          <div style={{ maxWidth: 560, marginBottom: 24 }}>
            {CRAWL_LINES.map((line, i) => (
              <p key={i} style={{ ...crawlTextStyle, fontSize: 14, fontWeight: 600 }}>
                {line}
              </p>
            ))}
          </div>
          {showCta && <CtaButton onClick={handleCtaClick} pulse={false} />}
        </div>
      ) : (
        <>
          <StarfieldCrawl
            fullscreen
            starsOnly={starsOnly}
            durationSeconds={CRAWL_DURATION_S}
            columnWidthVw={65}
            fontWeight={600}
            letterSpacingEm={-0.01}
          >
            <div style={{ ...crawlTextStyle, fontSize: 15, letterSpacing: "0.15em", marginBottom: 6 }}>EPISODE II</div>
            <div style={{ ...crawlTextStyle, fontSize: 24, marginBottom: 30 }}>FLORIDA STRIKES BACK</div>
            {CRAWL_LINES.map((line, i) => (
              <p key={i} style={{ ...crawlTextStyle, fontSize: 15 }}>
                {line}
              </p>
            ))}
          </StarfieldCrawl>

          {showCta && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              <CtaButton onClick={handleCtaClick} pulse />
            </div>
          )}
        </>
      )}
    </div>
  );
}
