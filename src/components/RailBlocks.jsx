import { FLIGHT_ITINERARIES } from "../data/flights.js";
import { getVotableItemById } from "../data/parks.js";
import { VoteBadge } from "./VoteBadge.jsx";

const mutedText = { fontSize: 13.5, color: "#c9d3e8", lineHeight: 1.5 };
const labelText = { fontFamily: "'Oswald', sans-serif", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", color: "#8fb3ff" };

function TextBlock({ block }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {block.label && <div style={{ ...labelText, marginBottom: 4 }}>{block.label}</div>}
      <div style={mutedText}>{block.text}</div>
    </div>
  );
}

function HighlightBlock({ block }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
      <span style={labelText}>{block.label}</span>
      <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, color: "#ffd9ad" }}>{block.value}</span>
    </div>
  );
}

function FlowStepsBlock({ block }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      {block.steps.map((step, i) => (
        <span key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 12.5,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#dbe9ff",
            }}
          >
            {step}
          </span>
          {i < block.steps.length - 1 && <span style={{ color: "#6b7690" }}>→</span>}
        </span>
      ))}
    </div>
  );
}

function FlightCard({ flight }) {
  if (!flight) return null;
  return (
    <div
      style={{
        flex: "1 1 220px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(143,179,255,0.16)",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", color: "#8fb3ff", marginBottom: 8 }}>
        {flight.label}
      </div>
      <div style={{ fontSize: 12.5, color: "#a9b4cc", marginBottom: 8 }}>{flight.outbound.flight}</div>
      {/* Time-led: each leg's clock time is the first thing read, with the
          airport/direction as supporting detail beside it — same left-time
          treatment MissionRail uses for the rail itself. */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 10, rowGap: 5, alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, color: "#ffd9ad", whiteSpace: "nowrap" }}>
          {flight.outbound.from.time}
        </span>
        <span style={{ fontSize: 12.5, color: "#dbe9ff" }}>
          <span style={{ fontWeight: 700, color: "#fff" }}>{flight.outbound.from.code}</span> · Depart
        </span>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, color: "#ffd9ad", whiteSpace: "nowrap" }}>
          {flight.outbound.to.time}
        </span>
        <span style={{ fontSize: 12.5, color: "#dbe9ff" }}>
          <span style={{ fontWeight: 700, color: "#fff" }}>{flight.outbound.to.code}</span> · Arrive
        </span>
      </div>
      <div style={{ fontSize: 11.5, color: "#7c88a6", marginTop: 8 }}>{flight.travelers.length > 1 ? `${flight.travelers.length} travelers` : flight.travelers[0]}</div>
    </div>
  );
}

function FlightPairBlock({ block }) {
  const flights = block.flightIds.map((id) => FLIGHT_ITINERARIES.find((f) => f.id === id)).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {flights.map((f) => (
        <FlightCard key={f.id} flight={f} />
      ))}
    </div>
  );
}

function AttractionRefsBlock({ block, votesByItem }) {
  const items = block.itemIds.map((id) => ({ id, item: getVotableItemById(id) })).filter((x) => x.item);

  if (block.variant === "primary") {
    return (
      <div>
        {block.heading && <div style={{ ...labelText, marginBottom: 10 }}>{block.heading}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {items.map(({ id, item }) => (
            <div
              key={id}
              style={{
                background: "linear-gradient(160deg, rgba(255,209,102,0.08), rgba(16,24,44,0.5))",
                border: "1px solid rgba(255,209,102,0.3)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14.5, color: "#fff" }}>{item.name}</span>
              <VoteBadge itemId={id} votesByItem={votesByItem} size="large" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // variant === "list" — compact rows, still with a live badge, but visually
  // secondary to a "primary" block per Monday's visual-hierarchy priorities.
  return (
    <div>
      {block.intro && <div style={{ ...mutedText, marginBottom: 8, fontStyle: "italic" }}>{block.intro}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map(({ id, item }) => (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "9px 12px",
            }}
          >
            <span style={{ fontSize: 13.5, color: "#dbe9ff" }}>{item.name}</span>
            <VoteBadge itemId={id} votesByItem={votesByItem} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OpportunityListBlock({ block }) {
  const secondary = block.variant === "secondary";
  return (
    <div style={{ opacity: secondary ? 0.85 : 1 }}>
      {block.heading && <div style={{ ...labelText, marginBottom: 8, color: secondary ? "#7c88a6" : "#8fb3ff" }}>{block.heading}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {block.items.map((text) => (
          <span
            key={text}
            style={{
              fontSize: 12.5,
              color: secondary ? "#a9b4cc" : "#dbe9ff",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: "6px 10px",
            }}
          >
            {text}
          </span>
        ))}
      </div>
      {block.note && <div style={{ fontSize: 12, fontStyle: "italic", color: "#7c88a6", marginTop: 10 }}>{block.note}</div>}
    </div>
  );
}

function FeatureCardBlock({ block }) {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, rgba(255,209,102,0.07), rgba(16,24,44,0.4))",
        border: "1px solid rgba(255,209,102,0.3)",
        borderRadius: 12,
        padding: "16px 18px",
      }}
    >
      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", color: "#ffd166" }}>{block.heading}</div>
      <div style={{ fontSize: 12, letterSpacing: "0.06em", color: "#c9a876", marginTop: 2, marginBottom: 10 }}>{block.subheading}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
        {block.items.map((text, i) => (
          <li key={i} style={{ fontSize: 13, color: "#c9d3e8", lineHeight: 1.4, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: "#ffd166" }}>›</span>
            {text}
          </li>
        ))}
      </ul>
      {block.tagline && <div style={{ fontSize: 12, fontStyle: "italic", color: "#e0b25c", marginTop: 10 }}>{block.tagline}</div>}
    </div>
  );
}

function FoodListBlock({ block }) {
  return (
    <div>
      {block.heading && <div style={{ ...labelText, marginBottom: 8 }}>{block.heading}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {block.items.map((f) => (
          <div key={f.name} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13 }}>
            <span style={{ color: "#dbe9ff", fontWeight: 600 }}>{f.name}</span>
            <span style={{ color: "#a9b4cc" }}>{f.desc}</span>
          </div>
        ))}
      </div>
      {block.note && <div style={{ fontSize: 12, fontStyle: "italic", color: "#7c88a6", marginTop: 10 }}>{block.note}</div>}
    </div>
  );
}

/**
 * The content for a "hard" rail node (a locked-time event — Monday has
 * exactly one, Oga's Cantina). Hard nodes don't carry a `blocks` array
 * (their shape is fixed: time/tag/targetArrival/vibeTags/note), so this is
 * a dedicated renderer rather than another RailBlock type — it lives here
 * because it's still generic across days: any day's hard node has this
 * same fixed shape, so Tuesday-Friday's own locked events (if any) reuse
 * this unchanged, same as RailBlock.
 */
export function HardNodeContent({ node }) {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, rgba(224,163,77,0.14), rgba(16,24,44,0.55))",
        border: "1px solid rgba(224,163,77,0.45)",
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 0 24px rgba(224,163,77,0.12)",
      }}
    >
      {/* The reservation time itself now leads via MissionRail's left-side
          time column (aligned with this node's marker), so it isn't
          repeated here — this card leads with the tag instead. */}
      {node.tag && (
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 10.5,
              letterSpacing: "0.14em",
              color: "#0a0e1a",
              background: "#e0a34d",
              borderRadius: 999,
              padding: "4px 10px",
            }}
          >
            {node.tag}
          </span>
        </div>
      )}

      {node.targetArrival && (
        <div style={{ ...labelText, marginBottom: 10 }}>
          TARGET ARRIVAL <span style={{ color: "#dbe9ff", fontWeight: 400, letterSpacing: "normal", textTransform: "none" }}>{node.targetArrival}</span>
        </div>
      )}

      {node.vibeTags && node.vibeTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: node.note ? 12 : 0 }}>
          {node.vibeTags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 12,
                color: "#ffe3bd",
                background: "rgba(224,163,77,0.14)",
                border: "1px solid rgba(224,163,77,0.3)",
                borderRadius: 8,
                padding: "5px 10px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {node.note && <div style={{ fontSize: 12.5, fontStyle: "italic", color: "#d8b98f", lineHeight: 1.5 }}>{node.note}</div>}
    </div>
  );
}

/**
 * Resolves one Mission Rail content block to JSX. The block-type set is
 * intentionally small and fixed (see mondayMission.js) so Tuesday-Friday's
 * own day configs can reuse this exact renderer in Phase 4 with no new
 * component work — a new day just emits the same block shapes with
 * different content.
 */
export function RailBlock({ block, votesByItem }) {
  switch (block.type) {
    case "text":
      return <TextBlock block={block} />;
    case "highlight":
      return <HighlightBlock block={block} />;
    case "flowSteps":
      return <FlowStepsBlock block={block} />;
    case "flightPair":
      return <FlightPairBlock block={block} />;
    case "attractionRefs":
      return <AttractionRefsBlock block={block} votesByItem={votesByItem} />;
    case "opportunityList":
      return <OpportunityListBlock block={block} />;
    case "featureCard":
      return <FeatureCardBlock block={block} />;
    case "foodList":
      return <FoodListBlock block={block} />;
    default:
      return null;
  }
}
