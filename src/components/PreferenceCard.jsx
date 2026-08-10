import { useState } from "react";
import { LEVELS } from "../data/classificationConfig.js";

const ORDER = [LEVELS.MUST_DO, LEVELS.INTERESTED, LEVELS.NOT_FOR_ME];

function StatChip({ icon, text }) {
  if (!text) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11.5,
        color: "#6b6455",
        background: "#f3f0e7",
        borderRadius: 8,
        padding: "3px 8px",
        marginRight: 6,
        marginTop: 6,
      }}
    >
      {icon} {text}
    </span>
  );
}

export function PreferenceCard({ item, votersMap, myLevel, labelSet, onSetLevel }) {
  const [expanded, setExpanded] = useState(false);
  const voterEntries = Object.entries(votersMap || {});
  const hasLearnMore = item.summary || item.stats;

  return (
    <div className="pref-card" style={{ flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <span className="pref-card-name">{item.name}</span>
          {item.tag && <div className="pref-card-tag">{item.tag}</div>}
        </div>
        <div className="pref-controls">
          {ORDER.map((level) => {
            const isSelected = myLevel === level;
            return (
              <button
                key={level}
                className={`pref-btn ${level} ${isSelected ? "selected" : ""}`}
                aria-label={`${labelSet[level].label}${isSelected ? " (selected)" : ""}`}
                onClick={() => onSetLevel(item.id, isSelected ? null : level)}
              >
                {labelSet[level].icon}
              </button>
            );
          })}
        </div>
      </div>

      {voterEntries.length > 0 && (
        <div className="voter-chip-row">
          {voterEntries.map(([name, level]) => (
            <span key={name} className="voter-chip">
              {labelSet[level]?.icon || ""} {name.slice(0, 3)}
            </span>
          ))}
        </div>
      )}

      {hasLearnMore && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              padding: 0,
              marginTop: 8,
              fontSize: 11.5,
              color: "#1f4e79",
              cursor: "pointer",
            }}
          >
            ℹ️ Learn more {expanded ? "▴" : "▾"}
          </button>

          {expanded && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #e6e0d0" }}>
              {item.summary && (
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#4a4536", margin: "0 0 6px" }}>{item.summary}</p>
              )}
              {item.stats && (
                <div>
                  <StatChip icon="📏" text={item.stats.height} />
                  {item.stats.indoor !== undefined && (
                    <StatChip icon={item.stats.indoor ? "🏠" : "☀️"} text={item.stats.indoor ? "Indoor" : "Outdoor"} />
                  )}
                  {item.stats.expressPass !== undefined && (
                    <StatChip icon="🎫" text={item.stats.expressPass ? "Express Pass eligible" : "No Express Pass"} />
                  )}
                  {item.stats.locker !== undefined && item.stats.locker && (
                    <StatChip icon="🎒" text="Locker required" />
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
