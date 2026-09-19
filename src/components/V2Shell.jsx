/**
 * Phase 1 V2 shell only. This intentionally hosts just:
 *   - a single placeholder destination (Mission Loadout)
 *   - the way back to Final Approach
 *
 * The countdown is no longer owned by this component — it's now persistent
 * V2 chrome rendered by App.jsx (V2CountdownBar) directly beneath the app
 * header, so it shows on Final Approach too, not just once you're in here.
 *
 * `flex: 1` (rather than a fixed/viewport-relative minHeight) is what makes
 * this fill exactly the space left under the header + countdown bar, so the
 * dark background reaches the bottom of the viewport even when this
 * placeholder content is short — App.jsx's wrapper is the flex column that
 * makes this possible; see the Final Approach / V2 branches there.
 *
 * Real Mission Loadout content, Mission Intel, the Five Days/One Mission
 * hub, the Mission Rail, and any Monday-Friday day content are explicitly
 * OUT of scope for this phase — this only proves out the shell and the
 * return path. Later phases will replace the single placeholder block
 * below with real internal V2 navigation; nothing here is meant to be
 * load-bearing beyond that.
 */
export function V2Shell({ onReturnToFinalApproach }) {
  return (
    <div
      style={{
        flex: 1,
        background: "radial-gradient(ellipse at 50% 0%, #10182c 0%, #05070f 55%, #000 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 20px 60px",
      }}
    >
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
