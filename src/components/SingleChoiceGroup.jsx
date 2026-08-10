export function SingleChoiceGroup({ group, votesByItem, myName, onChoose }) {
  const optionIds = group.options.map((o) => o.id);

  return (
    <div className="card">
      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 13 }}>{group.label}</div>
      {group.note && <div style={{ fontSize: 11.5, color: "#8a8272", fontStyle: "italic", margin: "3px 0 8px" }}>{group.note}</div>}
      {group.options.map((opt) => {
        const votersMap = votesByItem[opt.id] || {};
        const iChose = myName && votersMap[myName] === "chosen";
        const voterNames = Object.keys(votersMap);
        return (
          <button
            key={opt.id}
            onClick={() => onChoose(optionIds, opt.id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              textAlign: "left",
              border: `1.5px solid ${iChose ? "#5b3a86" : "#e6e0d0"}`,
              background: iChose ? "#eee7f5" : "#fff",
              borderRadius: 10,
              padding: "10px 12px",
              marginBottom: 6,
              cursor: "pointer",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{opt.name}</div>
              {opt.price && <div style={{ fontSize: 11, color: "#8a8272" }}>{opt.price}</div>}
              {voterNames.length > 0 && (
                <div className="voter-chip-row">
                  {voterNames.map((n) => (
                    <span key={n} className="voter-chip">
                      ✓ {n.slice(0, 3)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span
              style={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                border: `2px solid ${iChose ? "#5b3a86" : "#c9c2ac"}`,
                background: iChose ? "#5b3a86" : "transparent",
                flexShrink: 0,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
