import { useState } from "react";
import { HeroBanner } from "./HeroBanner.jsx";
import { PreferenceCard } from "./PreferenceCard.jsx";
import { DINING_SITDOWN, DINING_QUICK, DINING_DESSERT } from "../data/dining.js";
import { DINING_LABELS } from "../data/uiLabels.js";
import { LEVELS } from "../data/classificationConfig.js";

const SECTIONS = [
  { id: "sitdown", label: "Sit-Down Dinner", items: DINING_SITDOWN },
  { id: "quick", label: "Quick Meal", items: DINING_QUICK },
  { id: "dessert", label: "Dessert / Snack", items: DINING_DESSERT },
];

export function RationsPage({ votesByItem, myName, onSetLevel, topPicks, onSetTopPick }) {
  const [open, setOpen] = useState("sitdown");
  const myTopPick = myName ? topPicks[myName] : null;

  return (
    <div className="page">
      <HeroBanner accent="#7a2b2b" title="Rations" subtitle="Vote on dining, no matter which night it lands on" />

      <div className="card" style={{ background: "#f3ecd8", borderColor: "#d8c088" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
          🎂 Ava's Birthday Dinner
        </div>
        <div style={{ fontSize: 12.5, color: "#5c4a2a" }}>
          Not a vote — Ava gets the final call on where her birthday dinner happens, no matter what the rest of the
          family prefers.
        </div>
      </div>

      <div className="card" style={{ background: "#f3ecd8", borderColor: "#d8c088" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
          👻 Horror Nights Meal Strategy
        </div>
        <div style={{ fontSize: 12.5, color: "#5c4a2a" }}>
          A planning decision, not a restaurant — vote it on the Halloween Horror Nights zone tab.
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.id} style={{ marginBottom: 12 }}>
          <button
            onClick={() => setOpen(open === section.id ? null : section.id)}
            style={{ display: "flex", justifyContent: "space-between", width: "100%", background: "none", border: "none", padding: "6px 0", cursor: "pointer" }}
          >
            <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14 }}>{section.label}</span>
            <span>{open === section.id ? "▲" : "▼"}</span>
          </button>
          {open === section.id &&
            section.items.map((d) => {
              const myLevel = myName ? votesByItem[d.id]?.[myName] : null;
              const canTopPick = section.id === "sitdown" && myLevel === LEVELS.MUST_DO;
              const isTopPick = myTopPick === d.id;
              return (
                <div key={d.id}>
                  <PreferenceCard
                    item={d}
                    votersMap={votesByItem[d.id]}
                    myLevel={myLevel}
                    labelSet={DINING_LABELS}
                    onSetLevel={onSetLevel}
                  />
                  {canTopPick && (
                    <button
                      onClick={() => onSetTopPick(d.id)}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: isTopPick ? "#fff" : "#8a6d1f",
                        background: isTopPick ? "#8a6d1f" : "#f3ecd8",
                        border: "1px solid #8a6d1f",
                        borderRadius: 8,
                        padding: "4px 10px",
                        marginTop: -4,
                        marginBottom: 8,
                        cursor: "pointer",
                      }}
                    >
                      {isTopPick ? "🏆 Your Top Pick" : "Make this your Top Dinner Pick"}
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
