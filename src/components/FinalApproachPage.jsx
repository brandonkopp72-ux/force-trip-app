/**
 * The accepted-user landing page. Two intentional paths only:
 *   FINAL MISSION BRIEF -> the new V2 experience (lightspeed transition first)
 *   MISSION ARCHIVES     -> the original, untouched V1 planning experience
 *
 * Deliberately its own self-contained visual treatment (no dependency on
 * global.css's V1 classes) so it reads as a distinct "final approach"
 * moment rather than another V1 page — while staying in the same overall
 * dark/accent-glow language already established by CinematicIntro and
 * MissionTransition.
 */
export function FinalApproachPage({ onFinalMissionBrief, onMissionArchives }) {
  return (
    <div
      style={{
        flex: 1,
        background: "radial-gradient(ellipse at 50% 20%, #10182c 0%, #05070f 60%, #000 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 12,
          letterSpacing: "0.2em",
          color: "#8fb3ff",
          marginBottom: 10,
        }}
      >
        F.O.R.C.E.
      </div>
      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(24px, 5vw, 38px)",
          letterSpacing: "0.04em",
          marginBottom: 12,
          textShadow: "0 0 22px rgba(143,179,255,0.5)",
        }}
      >
        FINAL APPROACH
      </div>
      <div style={{ color: "#a9b4cc", fontSize: 14, maxWidth: 420, marginBottom: 40 }}>
        The mission is accepted. Final preparations begin now.
      </div>

      <button
        onClick={onFinalMissionBrief}
        style={{
          width: "100%",
          maxWidth: 320,
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "0.04em",
          color: "#0a0e1a",
          background: "#8fb3ff",
          border: "none",
          borderRadius: 10,
          padding: "16px 0",
          marginBottom: 14,
          cursor: "pointer",
          boxShadow: "0 0 22px rgba(143,179,255,0.35)",
        }}
      >
        FINAL MISSION BRIEF
      </button>

      <button
        onClick={onMissionArchives}
        style={{
          width: "100%",
          maxWidth: 320,
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.04em",
          color: "#c9d3e8",
          background: "transparent",
          border: "1.5px solid #3a4566",
          borderRadius: 10,
          padding: "14px 0",
          cursor: "pointer",
        }}
      >
        MISSION ARCHIVES
      </button>
    </div>
  );
}
