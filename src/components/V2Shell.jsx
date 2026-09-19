import { MissionCountdown } from "./MissionCountdown.jsx";

/**
 * Phase 1 V2 shell only. This intentionally hosts just:
 *   - the persistent, always-visible countdown (docked right below the
 *     original V1 header, which App.jsx renders above this component)
 *   - a single placeholder destination (Mission Loadout)
 *   - the way back to Final Approach
 *
 * Real Mission Loadout content, Mission Intel, the Five Days/One Mission
 * hub, the Mission Rail, and any Monday-Friday day content are explicitly
 * OUT of scope for this phase — this only proves out the shell, the
 * countdown, and the return path. Later phases will replace the single
 * placeholder block below with real internal V2 navigation; nothing here
 * is meant to be load-bearing beyond that.
 */
export function V2Shell({ onReturnToFinalApproach }) {
  return (
    <div
      style={{
        minHeight: "70vh",
        background: "radial-gradient(ellipse at 50% 0%, #10182c 0%, #05070f 55%, #000 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px 60px",
      }}
    >
      <MissionCountdown style={{ color: "#dbe9ff", fontSize: 16, marginBottom: 8 }} />

      <button
        onClick={onReturnToFinalApproach}
        style={{
          background: "none",
          border: "none",
          color: "#8fb3ff",
          fontSize: 11.5,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: "0.04em",
          cursor: "pointer",
          padding: 4,
        }}
      >
        ← FINAL APPROACH
      </button>

      <div style={{ marginTop: "16vh", textAlign: "center", maxWidth: 420 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "#8fb3ff",
            marginBottom: 10,
          }}
        >
          MISSION LOADOUT
        </div>
        <div style={{ color: "#a9b4cc", fontSize: 14 }}>
          Gear, logistics, and reference intel are staging here for a future briefing.
        </div>
      </div>
    </div>
  );
}
