import { MissionCountdown } from "./MissionCountdown.jsx";

/**
 * Persistent V2 chrome — sits directly beneath the app header on Final
 * Approach AND every V2 screen, not just once you're past Final Approach
 * into V2 content. A dedicated component so App.jsx renders it once, in
 * one place, for both phases, instead of duplicating markup (previously
 * this lived inside V2Shell only, which was the bug: Final Approach had
 * no countdown at all).
 *
 * Deliberately its own dark bar (not just bigger text) so it reads as an
 * intentional status instrument — a fixed console readout — rather than
 * incidental page content, while staying a single compact row.
 */
export function V2CountdownBar() {
  return (
    <div
      style={{
        background: "#0a0e1a",
        borderBottom: "1px solid rgba(143,179,255,0.25)",
        padding: "10px 16px",
        textAlign: "center",
      }}
    >
      <MissionCountdown
        style={{
          color: "#dbe9ff",
          fontSize: 22,
          fontWeight: 600,
          textShadow: "0 0 14px rgba(143,179,255,0.35)",
        }}
      />
    </div>
  );
}
