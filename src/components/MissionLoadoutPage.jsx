import { LOADOUT_CARDS } from "../data/loadout.js";
import { useReducedMotion } from "../hooks/useReducedMotion.js";

const cardBaseStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(143,179,255,0.16)",
  borderRadius: 14,
  // Phase 5 polish: slightly more generous, consistent padding on all
  // sides (was 18/18/20 with no explicit left) for a calmer, more even
  // card interior at every width.
  padding: "20px 20px 22px",
};

// +5px over the previous 13px — stronger hierarchy without the icon and
// heading reading as a headline. Both card variants share it so the whole
// grid stays typographically consistent.
const headingStyle = {
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: "0.08em",
  color: "#dbe9ff",
};

// The icon sits inline with the heading, vertically centered, with a tight,
// intentional gap — they read as one unit rather than an icon-on-its-own-
// line above a separate heading.
const iconHeadingRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "nowrap",
};

const iconStyle = {
  fontSize: 20,
  lineHeight: 1,
  flexShrink: 0,
};

function LoadoutCard({ card, index, reduced }) {
  const entranceStyle = reduced
    ? {}
    : { animation: "forceCardEnter 480ms ease-out both", animationDelay: `${Math.min(index * 40, 320)}ms` };

  if (card.variant === "feature") {
    return (
      <div
        className="force-v2-card"
        style={{
          ...cardBaseStyle,
          ...entranceStyle,
          border: "1px solid rgba(255,209,102,0.35)",
          background: "linear-gradient(160deg, rgba(255,209,102,0.08), rgba(16,24,44,0.4))",
        }}
      >
        <div style={iconHeadingRowStyle}>
          <span style={iconStyle}>{card.icon}</span>
          <span style={headingStyle}>{card.heading}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.03em", color: "#ffd166", margin: "6px 0 12px" }}>
          {card.headline}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {card.chips.map((c) => (
            <div key={c} style={{ fontSize: 13, background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "6px 10px" }}>
              {c}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13.5, color: "#c9d3e8", marginBottom: 8, lineHeight: 1.4 }}>{card.supportingText}</div>
        {card.suggestion && (
          <div style={{ fontSize: 12.5, color: "#8fb3ff", marginBottom: 12, lineHeight: 1.4 }}>{card.suggestion}</div>
        )}
        <div style={{ fontSize: 12, letterSpacing: "0.06em", color: "#ffd166", fontWeight: 700 }}>{card.closingLine}</div>
      </div>
    );
  }

  return (
    <div className="force-v2-card" style={{ ...cardBaseStyle, ...entranceStyle }}>
      <div style={iconHeadingRowStyle}>
        <span style={iconStyle}>{card.icon}</span>
        <span style={headingStyle}>{card.heading}</span>
      </div>
      <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
        {card.points.map((p, i) => (
          <li key={i} style={{ fontSize: 13.5, color: "#c9d3e8", lineHeight: 1.4, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "#8fb3ff" }}>›</span>
            {p}
          </li>
        ))}
      </ul>
      {card.note && <div style={{ marginTop: 12, fontSize: 12, fontStyle: "italic", color: "#7c88a6" }}>{card.note}</div>}
    </div>
  );
}

/**
 * Reference-only intel cards for pre-trip prep. No checkboxes, no
 * per-user state, no save buttons — see src/data/loadout.js for content.
 * `repeat(auto-fit, minmax(260px, 1fr))` gives a clean multi-column grid
 * on tablet/desktop and a single column on phone with no media query.
 */
export function MissionLoadoutPage() {
  const reduced = useReducedMotion();

  return (
    <div style={{ padding: "18px 0 12px" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 5vw, 30px)",
            letterSpacing: "0.04em",
          }}
        >
          MISSION LOADOUT
        </div>
        <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#8fb3ff", marginTop: 6 }}>PREPARE FOR DEPLOYMENT</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(272px, 1fr))", gap: 16, alignItems: "start" }}>
        {LOADOUT_CARDS.map((card, i) => (
          <LoadoutCard key={card.id} card={card} index={i} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}
