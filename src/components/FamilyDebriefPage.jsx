import { classifyAllParks, classifyDining } from "../lib/tripStats.js";

const BADGE_CLASS = {
  squad_lock: "badge-squad-lock",
  small_squad: "badge-small-squad",
  split_mission: "badge-split-mission",
  individual_mission: "badge-individual",
};
const BADGE_LABEL = {
  squad_lock: "Squad Lock",
  small_squad: "Small Squad",
  split_mission: "Split Mission",
  individual_mission: "Individual Mission",
};

function ItemRow({ item }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{item.name}</div>
      <div>
        {BADGE_CLASS[item.pattern] && (
          <span className={`classification-badge ${BADGE_CLASS[item.pattern]}`}>{BADGE_LABEL[item.pattern]}</span>
        )}
        {item.mustDoAnchor && <span className="classification-badge badge-must-do">⭐ Must-Do Anchor</span>}
        {item.confidence !== "complete" && (
          <span className="classification-badge badge-gathering">
            {item.reviewed}/6 reviewed{item.confidence === "likely" ? " · Likely" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

export function FamilyDebriefPage({ votesByItem }) {
  const parkResults = classifyAllParks(votesByItem);
  const diningResults = classifyDining(votesByItem);

  const squadLocks = [];
  const mustDoMissions = [];
  const splitMissions = [];
  parkResults.forEach(({ items }) => {
    items.forEach((item) => {
      if (item.pattern === "squad_lock") squadLocks.push(item);
      if (item.mustDoAnchor) mustDoMissions.push(item);
      if (item.pattern === "split_mission") splitMissions.push(item);
    });
  });

  const diningFavorites = diningResults.filter((d) => d.pattern === "squad_lock" || d.pattern === "small_squad");
  const hhnPark = parkResults.find((p) => p.park.isHHN);
  const hhnPriorities = hhnPark ? hhnPark.items.filter((i) => i.mustDoAnchor || i.pattern === "squad_lock") : [];

  return (
    <div className="page">
      <div className="section-title">🎉 Mission Debrief</div>
      <p style={{ fontSize: 13, color: "#6b6455" }}>
        This isn't a scoreboard — a small group loving something isn't a loss, it's a great split-mission
        opportunity.
      </p>

      {squadLocks.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>🔒 Squad Locks</div>
          {squadLocks.map((i) => (
            <ItemRow key={i.id} item={i} />
          ))}
        </div>
      )}

      {mustDoMissions.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>⭐ Must-Do Missions</div>
          {mustDoMissions.map((i) => (
            <ItemRow key={i.id} item={i} />
          ))}
        </div>
      )}

      {splitMissions.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>🧭 Split Missions</div>
          {splitMissions.map((i) => (
            <ItemRow key={i.id} item={i} />
          ))}
        </div>
      )}

      {diningFavorites.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>🍽️ Dining Favorites</div>
          {diningFavorites.map((i) => (
            <ItemRow key={i.id} item={i} />
          ))}
        </div>
      )}

      {hhnPriorities.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, marginBottom: 8 }}>
            👻 HHN Priorities
          </div>
          {hhnPriorities.map((i) => (
            <ItemRow key={i.id} item={i} />
          ))}
        </div>
      )}
    </div>
  );
}
