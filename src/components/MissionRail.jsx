import { useReducedMotion } from "../hooks/useReducedMotion.js";

/**
 * The reusable visual scaffold for a Mission Day page: a continuous
 * vertical rail down the left side, with one marker + content row per
 * node. This component knows nothing about Monday, Batuu, flights, or
 * votes — it only knows two node kinds ("flexible" / "hard") and renders
 * whatever `content` JSX each node hands it. That's what lets Tuesday-
 * Friday reuse this exact component in Phase 4 with their own nodes.
 *
 * Each node: { id, kind: "flexible" | "hard", heading, tint, content }
 * - kind "flexible" → small, non-pulsing marker.
 * - kind "hard"     → larger marker with a slow, subtle glow pulse.
 * - tint            → a small accent color: colors that node's marker,
 *                      the rail segment below it, and a very soft
 *                      background wash behind its heading — this is what
 *                      lets the page "subtly evolve while scrolling"
 *                      (cool → warm → warmest at the hard node → night)
 *                      without any single page-spanning effect.
 *
 * Layout: rail-left / content-right at every width, including mobile —
 * there's no separate horizontal-timeline variant. The rail gutter is a
 * fixed, small width so content always keeps most of the screen.
 */
const RAIL_GUTTER = 30;
const DEFAULT_TINT = "#8fb3ff";

function RailMarker({ kind, tint, reduced }) {
  const color = tint || DEFAULT_TINT;

  if (kind === "hard") {
    return (
      <span style={{ position: "relative", width: 16, height: 16, flexShrink: 0, marginTop: 2 }}>
        {!reduced && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -9,
              borderRadius: "50%",
              background: color,
              animation: "missionRailPulse 3.8s ease-in-out infinite",
            }}
          />
        )}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 0 3px rgba(5,7,15,0.9), 0 0 16px ${color}`,
          }}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        border: "2px solid rgba(5,7,15,0.9)",
        boxShadow: `0 0 0 1px ${color}80`,
        flexShrink: 0,
        marginTop: 4,
      }}
    />
  );
}

function RailNodeRow({ node, nextTint, reduced, isLast }) {
  const tint = node.tint || DEFAULT_TINT;
  const lineTint = nextTint || tint;

  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <div style={{ width: RAIL_GUTTER, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <RailMarker kind={node.kind} tint={tint} reduced={reduced} />
        {!isLast && (
          <span
            aria-hidden="true"
            style={{
              flex: 1,
              width: 2,
              minHeight: 24,
              marginTop: 6,
              background: `linear-gradient(to bottom, ${tint}99, ${lineTint}66)`,
              borderRadius: 1,
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingLeft: 16, paddingBottom: isLast ? 4 : 40 }}>
        <div
          style={{
            position: "relative",
            background: `radial-gradient(ellipse 420px 160px at 0% 0%, ${tint}17 0%, transparent 70%)`,
            borderRadius: 12,
            padding: "2px 4px 4px",
            marginLeft: -4,
          }}
        >
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: node.kind === "hard" ? 15 : 13,
              letterSpacing: "0.14em",
              color: node.kind === "hard" ? "#ffd9ad" : tint,
              marginBottom: 12,
            }}
          >
            {node.heading}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{node.content}</div>
        </div>
      </div>
    </div>
  );
}

export function MissionRail({ nodes }) {
  const reduced = useReducedMotion();

  return (
    <div style={{ width: "100%" }}>
      <style>{`
        @keyframes missionRailPulse {
          0%, 100% { opacity: 0.28; transform: scale(0.85); }
          50% { opacity: 0.05; transform: scale(1.55); }
        }
      `}</style>
      {nodes.map((node, i) => (
        <RailNodeRow
          key={node.id}
          node={node}
          nextTint={nodes[i + 1]?.tint}
          reduced={reduced}
          isLast={i === nodes.length - 1}
        />
      ))}
    </div>
  );
}
