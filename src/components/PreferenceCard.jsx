import { LEVELS } from "../data/classificationConfig.js";

const ORDER = [LEVELS.MUST_DO, LEVELS.INTERESTED, LEVELS.NOT_FOR_ME];

export function PreferenceCard({ item, votersMap, myLevel, labelSet, onSetLevel }) {
  const voterEntries = Object.entries(votersMap || {});

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
    </div>
  );
}
