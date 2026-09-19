import { useEffect, useMemo, useRef, useState } from "react";
import { playLightspeedWhoosh } from "../lib/audioEngine.js";

const STREAK_COUNT = 46;

/**
 * "Lightspeed" streak transition — Final Approach -> V2. A sibling to
 * MissionTransition, not a third variant of it: MissionTransition is built
 * around a headline-slam moment (a name/subtitle resolving center-screen),
 * while this is a pure motion beat with no text at all, so the two don't
 * share enough structure to fold together.
 *
 * Fixed duration in the 1.5s-2.5s range (default 2000ms per the approved
 * plan). Reuses the exact radiating-line geometry already proven out in
 * MissionTransition's speedLines (translate to center, rotate by a random
 * angle, scale outward from that pivot) — just denser, faster, and white/
 * blue instead of accent-colored, to read as a hyperspace streak rather
 * than an impact burst. Respects prefers-reduced-motion with a much
 * shorter, simpler fade.
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

  const streaks = useMemo(
    () =>
      Array.from({ length: STREAK_COUNT }, () => ({
        angle: Math.random() * 360,
        thickness: Math.random() < 0.25 ? 2 : 1,
        delay: Math.random() * (effectiveDuration * 0.2),
      })),
    // Recompute only if the duration itself changes (it never does at
    // runtime), so the streak field doesn't reshuffle on unrelated re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2500,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes lsLine {
          0%, 8% { transform: translate(-50%, -100%) rotate(var(--ang)) scaleY(0); opacity: 0; }
          22% { opacity: 1; }
          100% { transform: translate(-50%, -100%) rotate(var(--ang)) scaleY(3.2); opacity: 0; }
        }
        @keyframes lsFlash {
          0%, 66% { opacity: 0; }
          86% { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes lsReducedFade {
          0% { opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {reduced ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#0a0e1a",
            animation: `lsReducedFade ${effectiveDuration}ms ease forwards`,
          }}
        />
      ) : (
        <>
          {streaks.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: s.thickness,
                height: 90,
                background: "linear-gradient(#ffffff, transparent)",
                transformOrigin: "50% 0%",
                "--ang": `${s.angle}deg`,
                animation: `lsLine ${effectiveDuration - s.delay}ms cubic-bezier(0.15, 0.6, 0.25, 1) forwards`,
                animationDelay: `${s.delay}ms`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#ffffff",
              animation: `lsFlash ${effectiveDuration}ms ease forwards`,
            }}
          />
        </>
      )}
    </div>
  );
}
