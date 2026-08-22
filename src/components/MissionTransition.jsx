import { useEffect, useRef, useState } from "react";
import { playIntelCue, playMissionAcceptedCue } from "../lib/audioEngine.js";

const INTEL_WORDS = ["FLIGHTS", "LODGING", "TICKETS", "PARK INTEL", "MAPS", "CONDITIONS"];

/**
 * A short, full-screen "impact frame" transition — anime/comic-style energy
 * build + headline slam, translated into FORCE's own visual language (no
 * copyrighted characters, logos, or fonts referenced or reproduced).
 *
 * variant="default" — the original PIN → Mission Accepted sequence.
 * variant="dataBarrage" — adds a phase-2 flash of intel category words and
 * small green ONLINE corner tags, for the Intro → Resources moment.
 *
 * Reusable for future navigation moments — just pass different
 * primary/secondary/accent/duration/variant values.
 *
 * Respects prefers-reduced-motion with a much shorter, simpler fallback.
 */
export function MissionTransition({
  primary = "MISSION ACCEPTED",
  secondary = "FORCE TRAVEL COMMAND",
  verifiedText = "IDENTITY VERIFIED",
  accent = "#3ddc84",
  duration = 1800,
  variant = "default",
  onComplete,
}) {
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  // Original synthesized cue, once per mount — dataBarrage (Intel Acquired)
  // gets the digital sweep, the default variant (Mission Accepted) gets the
  // resolving chime. No-op if muted or Web Audio is unavailable.
  useEffect(() => {
    if (variant === "dataBarrage") playIntelCue();
    else playMissionAcceptedCue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveDuration = reduced ? 700 : duration;

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (onComplete) onComplete();
    }, effectiveDuration);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveDuration]);

  const speedLines = Array.from({ length: 12 });
  const isBarrage = variant === "dataBarrage";

  // Six even slots inside the 14%-36% "phase 2" window, each gets its own
  // small keyframe block so timing stays exact (no animation-delay stacking).
  const panelKeyframes = INTEL_WORDS.map((_, i) => {
    const slotStart = 14 + i * 3.6;
    const in1 = (slotStart + 1).toFixed(1);
    const hold = (slotStart + 2.5).toFixed(1);
    const out = (slotStart + 3.5).toFixed(1);
    const dir = i % 2 === 0 ? -1 : 1;
    return `
      @keyframes mtPanel${i} {
        0%, ${slotStart}% { opacity: 0; transform: translateX(${dir * 50}px) rotate(${dir * 6}deg); }
        ${in1}% { opacity: 1; transform: translateX(0) rotate(0deg); }
        ${hold}% { opacity: 1; }
        ${out}%, 100% { opacity: 0; }
      }
    `;
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "#0a0e1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        animation: `mtFadeOutOverlay ${effectiveDuration}ms ease forwards`,
      }}
    >
      <style>{`
        @keyframes mtFadeOutOverlay {
          0%, 88% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes mtScan {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          22% { transform: translateX(100%); opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes mtGlow {
          0%, 14% { transform: scale(0); opacity: 0; }
          36% { transform: scale(1); opacity: 0.9; }
          69% { transform: scale(1.15); opacity: 0.7; }
          100% { transform: scale(0.2); opacity: 0; }
        }
        @keyframes mtLine {
          0%, 14% { transform: translate(-50%, -100%) rotate(var(--ang)) scaleY(0); opacity: 0; }
          36% { transform: translate(-50%, -100%) rotate(var(--ang)) scaleY(1); opacity: 0.9; }
          69% { transform: translate(-50%, -100%) rotate(var(--ang)) scaleY(1.3); opacity: 0.4; }
          100% { transform: translate(-50%, -100%) rotate(var(--ang)) scaleY(1.8); opacity: 0; }
        }
        @keyframes mtHeadline {
          0%, 36% { transform: scale(1.5); opacity: 0; }
          45% { transform: scale(0.95); opacity: 1; }
          52% { transform: scale(1.05); opacity: 1; }
          60% { transform: scale(1); opacity: 1; }
          88% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes mtSub {
          0%, 45% { opacity: 0; transform: translateY(6px); }
          58% { opacity: 1; transform: translateY(0); }
          88% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes mtFlash {
          0%, 41% { opacity: 0; }
          45% { opacity: 0.85; }
          52% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes mtVerified {
          0% { opacity: 0; }
          6% { opacity: 1; }
          16% { opacity: 1; }
          24% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes mtRadar {
          0%, 14% { opacity: 0; transform: rotate(0deg); }
          20% { opacity: 0.35; }
          69% { opacity: 0.3; transform: rotate(140deg); }
          80%, 100% { opacity: 0; }
        }
        @keyframes mtOnline {
          0%, 58% { opacity: 0; }
          66% { opacity: 1; }
          88% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes mtReducedFade {
          0% { opacity: 0; }
          20% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }
        ${isBarrage ? panelKeyframes.join("\n") : ""}
      `}</style>

      {reduced ? (
        <div style={{ textAlign: "center", animation: `mtReducedFade ${effectiveDuration}ms ease forwards` }}>
          <div
            style={{
              color: accent,
              fontFamily: "'Oswald', sans-serif",
              fontSize: 12,
              letterSpacing: "0.15em",
              marginBottom: 8,
            }}
          >
            {verifiedText}
          </div>
          <div style={{ color: "#fff", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 26 }}>
            {primary}
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "38%",
              fontFamily: "'Oswald', sans-serif",
              fontSize: 12,
              letterSpacing: "0.15em",
              color: accent,
              animation: `mtVerified ${effectiveDuration}ms ease forwards`,
            }}
          >
            {verifiedText}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
              animation: `mtScan ${effectiveDuration}ms linear forwards`,
            }}
          />

          {isBarrage && (
            <div
              style={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                border: `1px dashed ${accent}77`,
                animation: `mtRadar ${effectiveDuration}ms linear forwards`,
              }}
            />
          )}

          <div
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}aa 0%, ${accent}22 45%, transparent 70%)`,
              animation: `mtGlow ${effectiveDuration}ms ease forwards`,
            }}
          />

          {speedLines.map((_, i) => {
            const angle = (360 / speedLines.length) * i;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 3,
                  height: 90,
                  background: `linear-gradient(${accent}, transparent)`,
                  transformOrigin: "50% 0%",
                  "--ang": `${angle}deg`,
                  animation: `mtLine ${effectiveDuration}ms ease-out forwards`,
                  animationDelay: `${i * 12}ms`,
                }}
              />
            );
          })}

          {isBarrage &&
            INTEL_WORDS.map((word, i) => {
              const positions = [
                { top: "22%", left: "20%" },
                { top: "18%", left: "62%" },
                { top: "50%", left: "10%" },
                { top: "48%", left: "72%" },
                { top: "76%", left: "24%" },
                { top: "74%", left: "58%" },
              ];
              return (
                <div
                  key={word}
                  style={{
                    position: "absolute",
                    ...positions[i],
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    color: "#fff",
                    background: `${accent}cc`,
                    padding: "4px 10px",
                    borderRadius: 3,
                    animation: `mtPanel${i} ${effectiveDuration}ms linear forwards`,
                  }}
                >
                  {word}
                </div>
              );
            })}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#ffffff",
              animation: `mtFlash ${effectiveDuration}ms ease forwards`,
            }}
          />

          {isBarrage && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#3ddc84",
                  animation: `mtOnline ${effectiveDuration}ms ease forwards`,
                }}
              >
                ● ONLINE
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 18,
                  right: 18,
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#3ddc84",
                  animation: `mtOnline ${effectiveDuration}ms ease forwards`,
                }}
              >
                ● ONLINE
              </div>
            </>
          )}

          <div style={{ position: "relative", textAlign: "center", padding: "0 20px" }}>
            <div
              style={{
                color: "#fff",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: "0.03em",
                textShadow: `0 0 24px ${accent}, 0 0 48px ${accent}88`,
                animation: `mtHeadline ${effectiveDuration}ms ease forwards`,
              }}
            >
              {primary}
            </div>
            <div
              style={{
                marginTop: 8,
                color: accent,
                fontFamily: "'Oswald', sans-serif",
                fontSize: 12,
                letterSpacing: "0.15em",
                animation: `mtSub ${effectiveDuration}ms ease forwards`,
              }}
            >
              {secondary}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
