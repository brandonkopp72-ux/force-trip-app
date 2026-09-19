import { useState } from "react";
import { V2Nav } from "./V2Nav.jsx";
import { MissionLoadoutPage } from "./MissionLoadoutPage.jsx";
import { MissionIntelPage } from "./MissionIntelPage.jsx";
import { FiveDaysPage } from "./FiveDaysPage.jsx";

/**
 * The V2 shell — Phase 2. Owns which of the three real V2 screens
 * (Mission Loadout / Mission Intel / Five Days) is showing, via a plain
 * internal `screen` state; V2Nav renders the switcher and the return-to-
 * Final-Approach link. Always re-enters on "loadout" — there's no
 * cross-visit persistence requirement, and Mission Loadout is the natural
 * landing spot right after the lightspeed transition.
 *
 * `flex: 1` (rather than a fixed/viewport-relative minHeight) is what
 * makes this fill exactly the space left under the header + countdown
 * bar; App.jsx's wrapper is the flex column that makes this possible —
 * see the Final Approach / V2 branches there. Content can now be taller
 * than the viewport (real cards, not a short placeholder), which is fine:
 * the page scrolls normally, nothing here clips it.
 *
 * The three screens share one small set of card-animation primitives
 * (entrance fade/translate, gentle hover, a slow ambient glow pulse on
 * Five Days' cards) injected ONCE here rather than duplicated per screen.
 * All of it is skipped/neutralized under prefers-reduced-motion — each
 * screen only applies the `animation` inline style when its own
 * useReducedMotion() hook says motion is allowed, and the hover rule is a
 * static, non-animated transform so it's unaffected either way.
 *
 * The Mission Rail, day pages (Monday-Friday), attraction vote cards, and
 * hard-time rail nodes are explicitly OUT of scope for this phase — Five
 * Days links out to a placeholder, not real day content. See
 * FiveDaysPage.jsx.
 */
export function V2Shell({ onReturnToFinalApproach, votesByItem }) {
  const [screen, setScreen] = useState("loadout");

  return (
    <div
      style={{
        flex: 1,
        background: "radial-gradient(ellipse at 50% 0%, #10182c 0%, #05070f 55%, #000 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes forceCardEnter {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes forceAmbientPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .force-v2-card {
          transition: transform 0.18s ease, border-color 0.18s ease;
        }
        @media (hover: hover) {
          .force-v2-card:hover {
            transform: translateY(-2px);
            border-color: rgba(143, 179, 255, 0.4);
          }
        }
      `}</style>

      <V2Nav active={screen} onSelect={setScreen} onReturnToFinalApproach={onReturnToFinalApproach} />

      <div style={{ flex: 1, width: "100%", maxWidth: 960, margin: "0 auto", padding: "0 16px 48px", boxSizing: "border-box" }}>
        {screen === "loadout" && <MissionLoadoutPage />}
        {screen === "intel" && <MissionIntelPage />}
        {screen === "fiveDays" && <FiveDaysPage votesByItem={votesByItem} />}
      </div>
    </div>
  );
}
