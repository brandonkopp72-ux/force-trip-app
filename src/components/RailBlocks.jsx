import { FLIGHT_ITINERARIES } from "../data/flights.js";
import { getVotableItemById } from "../data/parks.js";
import { rankItemsByPositiveVotes, getDiningConsensusRanking, buildFridayReadiness, getFridayDecisionHeading } from "../lib/tripStats.js";
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

// `leg` picks which half of the itinerary to render — "outbound" (the
// default, Monday's Deployment) or "return" (Friday's Extraction). Both legs
// already exist in full on every FLIGHT_ITINERARIES entry (see flights.js),
// so this never invents a time — it just points at the other real leg.
function FlightCard({ flight, leg = "outbound" }) {
  if (!flight) return null;
  const legData = leg === "return" ? flight.returnFlight : flight.outbound;
  if (!legData) return null;
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
      <div style={{ fontSize: 12.5, color: "#a9b4cc", marginBottom: 8 }}>{legData.flight}</div>
      {/* Time-led: each leg's clock time is the first thing read, with the
          airport/direction as supporting detail beside it — same left-time
          treatment MissionRail uses for the rail itself. */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 10, rowGap: 5, alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, color: "#ffd9ad", whiteSpace: "nowrap" }}>
          {legData.from.time}
        </span>
        <span style={{ fontSize: 12.5, color: "#dbe9ff" }}>
          <span style={{ fontWeight: 700, color: "#fff" }}>{legData.from.code}</span> · Depart
        </span>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, color: "#ffd9ad", whiteSpace: "nowrap" }}>
          {legData.to.time}
        </span>
        <span style={{ fontSize: 12.5, color: "#dbe9ff" }}>
          <span style={{ fontWeight: 700, color: "#fff" }}>{legData.to.code}</span> · Arrive
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
        <FlightCard key={f.id} flight={f} leg={block.leg} />
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

/**
 * Same rendering as AttractionRefsBlock (primary grid or compact list), but
 * the itemIds are re-sorted by live positive-vote count, highest first,
 * before handing off. This is how a "current major interest" grouping
 * (Tuesday's Adventure Operations, Thursday's Universal Studios Operations,
 * Thursday's HHN priorities) stays truthful as votes change, rather than
 * baking in today's standings as a fixed order.
 */
function RankedAttractionRefsBlock({ block, votesByItem }) {
  const rankedIds = rankItemsByPositiveVotes(block.itemIds, votesByItem);
  return <AttractionRefsBlock block={{ ...block, itemIds: rankedIds }} votesByItem={votesByItem} />;
}

/**
 * The dynamic dining-consensus surface Tuesday/Wednesday use for their
 * evening dinner sections — reuses getDiningConsensusRanking (the exact
 * scoring/tie-break already established for the Rations Excel export)
 * rather than showing a fixed restaurant. Deliberately simple: name, short
 * descriptor, and a small consensus-rank badge — no visible formula, no
 * vote counts broken out, since the daily pages are meant to be skimmed,
 * not audited. `limit` caps how many rows show (default 3).
 */
function DiningConsensusBlock({ block, votesByItem, topPicks }) {
  const ranked = getDiningConsensusRanking(votesByItem, topPicks).slice(0, block.limit || 3);
  return (
    <div>
      {block.heading && <div style={{ ...labelText, marginBottom: 8 }}>{block.heading}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ranked.map((row) => (
          <div
            key={row.item.id}
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
            <span style={{ fontSize: 13.5, color: "#dbe9ff" }}>
              {row.item.name}
              <span style={{ color: "#7c88a6", fontWeight: 400 }}> — {row.item.note}</span>
            </span>
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 11.5,
                color: "#0a0e1a",
                background: "#8fb3ff",
                borderRadius: 999,
                padding: "3px 9px",
                flexShrink: 0,
              }}
            >
              #{row.rank}
            </span>
          </div>
        ))}
      </div>
      {block.note && <div style={{ fontSize: 12, fontStyle: "italic", color: "#7c88a6", marginTop: 10 }}>{block.note}</div>}
    </div>
  );
}

/**
 * External-links-only section for HHN's Spoiler Intel — clearly separated
 * from the event-preview content around it. No embeds, ever: just a heading,
 * an optional warning line, and a list of outbound links. Where a spoiler
 * source isn't something this app can know in advance (a specific creator's
 * walkthrough video), `href` is a plain, generically-constructed search
 * link for that house's name rather than a fabricated specific URL — real,
 * always-resolves, and easy for Brandon to swap for a curated link later.
 */
// Phase 5 polish: a visually cordoned-off "warning zone" (tinted background +
// dashed border, matching the same treatment MissionIntelPage.jsx uses for
// its own spoiler section) so this reads unmistakably as a different kind
// of link — spoilers, not a promotional preview — rather than blending into
// the rest of the day's content blocks.
function LinkListBlock({ block }) {
  return (
    <div
      style={{
        background: "rgba(255,107,87,0.06)",
        border: "1px dashed rgba(255,107,87,0.35)",
        borderRadius: 12,
        padding: "14px 14px 12px",
      }}
    >
      {block.heading && <div style={{ ...labelText, marginBottom: 6, color: "#ff8a7a" }}>{block.heading}</div>}
      {block.warning && <div style={{ fontSize: 12.5, fontStyle: "italic", color: "#d8b98f", marginBottom: 10, lineHeight: 1.5 }}>{block.warning}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {block.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: "#8fb3ff",
              textDecoration: "none",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "9px 12px",
            }}
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Read-only view of Friday's existing Final Morning decision (the
 * singleChoiceGroup already in parks.js's departure-day entry, decided
 * through V1's normal single-choice voting) — no new voting surface, just
 * live per-option counts via the same buildFridayReadiness helper V1's
 * readiness tracking already uses.
 *
 * Phase 6: the heading reads "CURRENT PLAN" only once the squad has
 * actually finished deciding (`readiness.squadDecided` — every one of the
 * six has explicitly chosen an option), and "CURRENT LEADER" otherwise —
 * see getFridayDecisionHeading in lib/tripStats.js (pulled out to its own
 * pure, unit-tested function). Deliberately NOT based on vote count/which
 * option is ahead — a leading option with only 2 of 6 people weighed in is
 * still just a leader, not a finalized plan, however far ahead it is.
 * `block.heading` (the mission file's own config) is used only as the
 * "decided" label, so a day config could someday rename it without
 * touching this logic.
 */
function FridayDecisionBlock({ block, votesByItem }) {
  const readiness = buildFridayReadiness(votesByItem);
  const heading = getFridayDecisionHeading(readiness, block.heading);
  const counts = {};
  Object.values(readiness.choiceByPerson).forEach((id) => {
    if (id) counts[id] = (counts[id] || 0) + 1;
  });
  const options = Object.entries(readiness.optionLabelById);

  return (
    <div>
      {heading && <div style={{ ...labelText, marginBottom: 8 }}>{heading}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map(([id, name]) => (
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
            <span style={{ fontSize: 13.5, color: "#dbe9ff" }}>{name}</span>
            {/* Friday's single-choice options store "chosen", not the
                must_do/interested levels VoteBadge's live count expects, so
                this counts directly from readiness.choiceByPerson above
                rather than reusing VoteBadge here. */}
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
                color: "#dbe9ff",
                background: "rgba(143,179,255,0.14)",
                border: "1px solid rgba(143,179,255,0.3)",
                borderRadius: 999,
                padding: "3px 9px",
              }}
            >
              {counts[id] || 0}/6
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontStyle: "italic", color: "#7c88a6", marginTop: 10 }}>
        {readiness.decidedCount}/6 have weighed in{readiness.squadDecided ? " — everyone's decided." : "."}
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
 * The content for an "entertainment" rail node (a nighttime show/fireworks/
 * projection/live-entertainment slot built via buildEntertainmentNode — see
 * data/nighttimeEntertainment.js). Deliberately simple and NOT styled like
 * HardNodeContent's locked-amber reservation card: attending a show isn't a
 * commitment the way a dinner reservation is, so this stays a quieter card
 * with just the entertainment type and an optional link, in the node's own
 * tint rather than a fixed locked color.
 */
export function EntertainmentNodeContent({ node }) {
  const tint = node.tint || "#d9c9ff";
  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${tint}14, rgba(16,24,44,0.4))`,
        border: `1px solid ${tint}4d`,
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      {node.entertainmentType && (
        <div style={{ ...labelText, color: tint, marginBottom: node.additionalTimes || node.url ? 8 : 0 }}>
          {node.entertainmentType.replace(/([A-Z])/g, " $1").toUpperCase().trim()}
        </div>
      )}
      {/* Phase 6: a show with more than one nightly performance lists the
          rest here — the rail's own time label above only anchors on the
          earliest one, chronologically, never a guessed "best" pick. */}
      {node.additionalTimes && node.additionalTimes.length > 0 && (
        <div style={{ fontSize: 12, color: "#a9b4cc", marginBottom: node.url ? 8 : 0 }}>
          Also at: {node.additionalTimes.join(" · ")}
        </div>
      )}
      {node.url && (
        <a href={node.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: "#8fb3ff", textDecoration: "none" }}>
          More info ↗
        </a>
      )}
    </div>
  );
}

/**
 * Resolves one Mission Rail content block to JSX. The original eight block
 * types (see mondayMission.js) came from Monday alone; Phase 4 added three
 * more — "rankedAttractionRefs" (live vote-sorted attraction list),
 * "diningConsensus" (live dining ranking, needs `topPicks`), "linkList"
 * (external links only, for HHN's Spoiler Intel), and "fridayDecision"
 * (read-only view of Friday's existing single-choice vote) — each addressing
 * one specific Tuesday-Friday need rather than generalizing the schema
 * further than the real content requires.
 */
export function RailBlock({ block, votesByItem, topPicks }) {
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
    case "rankedAttractionRefs":
      return <RankedAttractionRefsBlock block={block} votesByItem={votesByItem} />;
    case "opportunityList":
      return <OpportunityListBlock block={block} />;
    case "featureCard":
      return <FeatureCardBlock block={block} />;
    case "foodList":
      return <FoodListBlock block={block} />;
    case "diningConsensus":
      return <DiningConsensusBlock block={block} votesByItem={votesByItem} topPicks={topPicks} />;
    case "linkList":
      return <LinkListBlock block={block} />;
    case "fridayDecision":
      return <FridayDecisionBlock block={block} votesByItem={votesByItem} />;
    default:
      return null;
  }
}
