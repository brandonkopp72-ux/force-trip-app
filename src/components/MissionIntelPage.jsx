import { MISSION_INTEL_ITEMS } from "../data/missionIntel.js";
import { useReducedMotion } from "../hooks/useReducedMotion.js";

const TYPE_BADGE = {
  park: "PARK PREVIEW",
  event: "AFTER-HOURS EVENT",
};

function PreviewLink({ url, label }) {
  if (!url) {
    return (
      <div
        style={{
          display: "inline-block",
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.05em",
          color: "#6b7690",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(143,179,255,0.14)",
          borderRadius: 8,
          padding: "10px 14px",
        }}
      >
        PREVIEW LINK COMING SOON
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.05em",
        color: "#0a0e1a",
        background: "#8fb3ff",
        borderRadius: 8,
        padding: "10px 14px",
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}

function IntelCard({ item, index, reduced }) {
  const entranceStyle = reduced
    ? {}
    : { animation: "forceCardEnter 480ms ease-out both", animationDelay: `${Math.min(index * 50, 320)}ms` };

  return (
    <div
      className="force-v2-card"
      style={{
        ...entranceStyle,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(143,179,255,0.16)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          background: item.mediaGradient,
          padding: "26px 18px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: item.accent,
            marginBottom: 8,
          }}
        >
          {TYPE_BADGE[item.type] || "PREVIEW"}
        </div>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(18px, 3.6vw, 22px)",
            letterSpacing: "0.02em",
            color: "#fff",
            textShadow: "0 0 18px rgba(0,0,0,0.5)",
          }}
        >
          {item.title}
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{item.subtitle}</div>
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ fontSize: 13.5, color: "#c9d3e8", lineHeight: 1.45, marginBottom: 14 }}>{item.description}</div>
        <PreviewLink url={item.previewUrl} label="WATCH MISSION PREVIEW" />

        {item.hasSpoilerSection && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px dashed rgba(255,107,87,0.3)",
            }}
          >
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#ff8f7d",
                marginBottom: 6,
              }}
            >
              {item.spoilerLabel}
            </div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 13, fontWeight: 700, color: "#e8b0a6", marginBottom: 4 }}>
              {item.spoilerHeading}
            </div>
            <div style={{ fontSize: 12.5, color: "#a9b4cc", marginBottom: 12 }}>{item.spoilerDescription}</div>
            {item.spoilerUrl ? (
              <a
                href={item.spoilerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: 11.5,
                  letterSpacing: "0.05em",
                  color: "#ff6b57",
                  background: "transparent",
                  border: "1.5px solid rgba(255,107,87,0.5)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  textDecoration: "none",
                }}
              >
                VIEW WALKTHROUGH (SPOILERS)
              </a>
            ) : (
              <div style={{ fontSize: 11.5, fontStyle: "italic", color: "#6b7690" }}>Walkthrough link not yet set.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The hype/media page — mostly-visual "mission dossier" cards, one per
 * park/event. Content lives in src/data/missionIntel.js; previewUrl /
 * spoilerUrl are config placeholders (see that file) rendered as a
 * visibly-disabled "coming soon" state rather than a guessed link.
 */
export function MissionIntelPage() {
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
          MISSION INTEL
        </div>
        <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#8fb3ff", marginTop: 6 }}>KNOW THE BATTLEFIELD</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {MISSION_INTEL_ITEMS.map((item, i) => (
          <IntelCard key={item.id} item={item} index={i} reduced={reduced} />
        ))}
      </div>
    </div>
  );
}
