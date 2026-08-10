import { PARKS } from "../data/parks.js";
import { YOUTUBE_CHANNELS } from "../data/resources.js";

export function ResourcesPage({ onAdvance }) {
  const officialLinks = PARKS.filter((p) => p.learnMoreUrl);

  return (
    <div className="page">
      <div className="section-title">🔗 Mission Resources</div>

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>
          Official Park & Event Pages
        </div>
        {officialLinks.map((p) => (
          <a
            key={p.id}
            href={p.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: p.accent, marginBottom: 8, textDecoration: "none" }}
          >
            {p.learnMoreLabel || p.park} ↗
          </a>
        ))}
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>
          YouTube Walkthrough Channels
        </div>
        {YOUTUBE_CHANNELS.map((c) => (
          <a
            key={c.url}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginBottom: 10, textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.name} ↗</div>
            <div style={{ fontSize: 12, color: "#6b6455" }}>{c.note}</div>
          </a>
        ))}
      </div>

      {onAdvance && (
        <button className="advance-btn" style={{ background: "#7a2b2b" }} onClick={onAdvance}>
          Review Mission Objectives →
        </button>
      )}
    </div>
  );
}
