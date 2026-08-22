import { HeroBanner } from "./HeroBanner.jsx";
import { classifyAllParks, buildCompletionStatus, buildParkReadiness } from "../lib/tripStats.js";
import { computeNaturalSquadOverlap } from "../lib/classification.js";
import { getAllVotableRideItems } from "../data/parks.js";
import { FAMILY } from "../data/family.js";

function GroupSection({ title, items, renderDetail }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 12.5, marginBottom: 6 }}>{title}</div>
      {items.map((item) => (
        <div key={item.id} style={{ fontSize: 13, marginBottom: 6, paddingLeft: 4, borderLeft: "3px solid #e6e0d0" }}>
          <strong>{item.name}</strong>
          {renderDetail && renderDetail(item)}
        </div>
      ))}
    </div>
  );
}

export function PlannerView({ votesByItem }) {
  const parkResults = classifyAllParks(votesByItem);
  const completion = buildCompletionStatus(votesByItem);
  const readiness = buildParkReadiness(votesByItem);
  const rideItems = getAllVotableRideItems();
  const rideItemIds = rideItems.map((i) => i.id);

  const pairs = [];
  for (let i = 0; i < FAMILY.length; i++) {
    for (let j = i + 1; j < FAMILY.length; j++) {
      const result = computeNaturalSquadOverlap(FAMILY[i], FAMILY[j], votesByItem, rideItemIds);
      if (result.label) pairs.push({ a: FAMILY[i], b: FAMILY[j], ...result });
    }
  }
  pairs.sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="page">
      <HeroBanner accent="#4a1414" title="Planner View" subtitle="Interprets preferences, doesn't build a schedule" />

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 10 }}>Mission Readiness</div>
        {readiness.map((r) => {
          const remaining = FAMILY.filter((name) => !r.completeByPerson[name]);
          return (
            <div key={r.parkId} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #ece9e4" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: 13.5 }}>{r.parkName}</strong>
                <span style={{ fontSize: 12.5, color: "#6b6455" }}>
                  {r.completeCount} / {FAMILY.length}
                </span>
              </div>
              {r.squadComplete ? (
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#2f5d42", marginTop: 2 }}>SQUAD COMPLETE ✓</div>
              ) : (
                <div style={{ fontSize: 11.5, color: "#8a8272", marginTop: 2 }}>
                  Still needed: {remaining.join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>Completion Status</div>
        {Object.values(completion).map((p) => (
          <div key={p.parkName} style={{ fontSize: 12.5, marginBottom: 6 }}>
            <strong>{p.parkName}</strong>:{" "}
            {FAMILY.map((name) => `${name} ${p.reviewedByPerson[name]}/${p.total}`).join(" · ")}
          </div>
        ))}
      </div>

      {parkResults.map(({ park, items }) => {
        const squadLocks = items.filter((i) => i.pattern === "squad_lock");
        const mustDoAnchors = items.filter((i) => i.mustDoAnchor);
        const smallSquads = items.filter((i) => i.pattern === "small_squad");
        const splitMissions = items.filter((i) => i.pattern === "split_mission");
        const individual = items.filter((i) => i.pattern === "individual_mission");
        const noInterest = items.filter((i) => i.pattern === "no_current_interest");
        const unreviewed = items.filter((i) => i.confidence === "gathering_intel");

        return (
          <div key={park.id} className="card">
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: park.accent, marginBottom: 10 }}>
              {park.park}
            </div>
            <GroupSection
              title="Squad Locks"
              items={squadLocks}
              renderDetail={(i) => ` — ${i.mustDo + i.interested}/6 interested${i.mustDo > 0 ? ` · ${i.mustDo} Must Do` : ""}`}
            />
            <GroupSection
              title="Must-Do Anchors"
              items={mustDoAnchors}
              renderDetail={(i) => ` — ${Object.entries(votesByItem[i.id] || {}).filter(([, l]) => l === "must_do").map(([n]) => n).join(", ")}`}
            />
            <GroupSection title="Small Squad Opportunities" items={smallSquads} />
            <GroupSection
              title="Split Missions — plan a split, don't drop it"
              items={splitMissions}
              renderDetail={(i) => {
                const votersMap = votesByItem[i.id] || {};
                const going = Object.entries(votersMap).filter(([, l]) => l !== "not_for_me").map(([n]) => n);
                const skipping = Object.entries(votersMap).filter(([, l]) => l === "not_for_me").map(([n]) => n);
                return ` — Going: ${going.join(", ") || "—"} · Skipping: ${skipping.join(", ") || "—"}`;
              }}
            />
            <GroupSection title="Individual Missions" items={individual} />
            {noInterest.length > 0 && (
              <GroupSection title="No Current Interest" items={noInterest} />
            )}
            {unreviewed.length > 0 && (
              <div style={{ fontSize: 11.5, color: "#8a8272", fontStyle: "italic", marginTop: 6 }}>
                Still gathering intel on: {unreviewed.map((i) => i.name).join(", ")}
              </div>
            )}
          </div>
        );
      })}

      <div className="card">
        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>Natural Squad Pairings</div>
        {pairs.length === 0 && (
          <div style={{ fontSize: 12.5, color: "#8a8272", fontStyle: "italic" }}>
            Gathering Intel — no pair has enough mutually-reviewed attractions yet.
          </div>
        )}
        {pairs.map((p) => (
          <div key={`${p.a}-${p.b}`} style={{ fontSize: 13, marginBottom: 4 }}>
            {p.a} + {p.b} — {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}
