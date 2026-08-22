import { useEffect, useRef, useState } from "react";
import { StarfieldCrawl } from "./StarfieldCrawl.jsx";

const DISSOLVE_MS = 600;
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
];

// Each of these four closing statements renders as its own standalone,
// non-wrapping line — a dramatic beat rather than a wrapped paragraph.
const FINAL_LINES = [
  "Downloaded and opened, the archives must be.",
  "Know what awaits them, they do not.",
  "The path forward lies hidden.",
  "Choose, they must.",
];

// fontStyle explicitly forced to "normal" — belt and suspenders against any
// inherited italic from elsewhere in the page, even though none was found
// declared anywhere in this component or StarfieldCrawl.jsx.
const crawlTextStyle = {
  fontFamily: "'Oswald', sans-serif",
  fontStyle: "normal",
  color: "#f5cc4d",
  textAlign: "center",
  margin: "0 0 22px",
};

// Same look as the rest of the crawl, but forced onto a single line each,
// with a modest responsive font-size as the fallback if a line would
// otherwise be forced to wrap on a narrow viewport — never break the
// sentence itself.
const finalLineStyle = {
  ...crawlTextStyle,
  whiteSpace: "nowrap",
  fontSize: "clamp(12px, 2.6vw, 15px)",
  margin: "0 0 26px",
};

function CtaButton({ onClick, pulse }) {
  return (
    <button
      onClick={onClick}
      className="force-cta-btn"
      style={{
        background: "rgba(10, 14, 26, 0.35)",
        border: "2px solid #f5cc4d",
        borderRadius: 10,
        cursor: "pointer",
        padding: "22px 36px",
        boxShadow: "0 0 18px 2px rgba(245,204,77,0.5), inset 0 0 14px rgba(245,204,77,0.22)",
        fontFamily: "'Oswald', sans-serif",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "clamp(15px, 2.6vw, 22px)",
        lineHeight: 1.6,
        color: "#f5cc4d",
        textShadow: "0 0 6px rgba(245,204,77,0.9)",
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
 * Owns the entire post-PIN cinematic sequence through the CTA click.
 * Exposes:
 *   onCtaClick() — fired the instant the CTA is clicked. The parent is
 *     responsible for starting the Intel Acquired (MissionTransition
 *     dataBarrage) sequence at this point.
 *   onExitComplete() — fired only once this component's own exit-fade CSS
 *     transition has genuinely finished, so the parent knows it's safe to
 *     unmount this overlay (Intel Acquired continues underneath/after,
 *     independent of this component's own lifetime).
 */
export function CinematicIntro({ onCtaClick, onExitComplete }) {
  const [stage, setStage] = useState("dissolve");
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Entrance cross-dissolve: double-rAF so the initial opacity:0 paints
  // before the transition to opacity:1 begins, guaranteeing the fade is
  // actually visible rather than skipped by same-frame batching.
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setEntered(true));
      timersRef.current.push(raf2);
    });
    timersRef.current.push(raf1);
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
    onCtaClick();
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
        opacity: stage === "exiting" ? 0 : entered ? 1 : 0,
        transition: stage === "exiting" ? `opacity ${EXIT_FADE_MS}ms ease` : `opacity ${DISSOLVE_MS}ms ease`,
        pointerEvents: stage === "exiting" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes ctaFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes ctaPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .force-cta-btn:hover {
          box-shadow: 0 0 26px 4px rgba(245,204,77,0.75), inset 0 0 18px rgba(245,204,77,0.32);
        }
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
            {FINAL_LINES.map((line, i) => (
              <p key={i} style={{ ...finalLineStyle, fontSize: "clamp(11px, 3.4vw, 14px)", fontWeight: 600 }}>
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
            columnWidthVw={58}
            fontWeight={500}
            letterSpacingEm={-0.01}
          >
            <div style={{ ...crawlTextStyle, fontSize: 15, letterSpacing: "0.15em", marginBottom: 6 }}>EPISODE II</div>
            <div style={{ ...crawlTextStyle, fontSize: 22, fontWeight: 600, marginBottom: 30 }}>FLORIDA STRIKES BACK</div>
            {CRAWL_LINES.map((line, i) => (
              <p key={i} style={{ ...crawlTextStyle, fontSize: 15 }}>
                {line}
              </p>
            ))}
            {FINAL_LINES.map((line, i) => (
              <p key={i} style={finalLineStyle}>
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
