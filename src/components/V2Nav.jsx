const SCREENS = [
  { id: "loadout", label: "LOADOUT" },
  { id: "intel", label: "INTEL" },
  { id: "fiveDays", label: "FIVE DAYS" },
];

/**
 * Compact V2 navigation — a small return-to-Final-Approach link plus a
 * horizontally-scrollable pill row for the three (soon more, in Phase 3)
 * V2 screens. Deliberately not a desktop-style navbar: same compact
 * treatment at every width, mobile-first, with `overflowX: auto` as
 * headroom for the daily mission pages Phase 3 will add to this same row
 * rather than a layout that has to be redone when that happens.
 */
export function V2Nav({ active, onSelect, onReturnToFinalApproach }) {
  return (
    <div style={{ padding: "14px 16px 4px", display: "flex", flexDirection: "column", gap: 10 }}>
      <button
        onClick={onReturnToFinalApproach}
        style={{
          alignSelf: "flex-start",
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

      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 2,
        }}
      >
        {SCREENS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{
                flex: "0 0 auto",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                letterSpacing: "0.05em",
                padding: "9px 16px",
                borderRadius: 999,
                border: isActive ? "1px solid #8fb3ff" : "1px solid rgba(143,179,255,0.25)",
                background: isActive ? "rgba(143,179,255,0.16)" : "transparent",
                color: isActive ? "#dbe9ff" : "#a9b4cc",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
