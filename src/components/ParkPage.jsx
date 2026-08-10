import { PreferenceCard } from "./PreferenceCard.jsx";
import { SingleChoiceGroup } from "./SingleChoiceGroup.jsx";
import { ProgressIndicator } from "./ProgressIndicator.jsx";
import { RIDE_LABELS, HHN_LABELS } from "../data/uiLabels.js";

export function ParkPage({ park, votesByItem, myName, onSetLevel, onChooseSingle, onAdvance, advanceLabel }) {
  const labelSet = park.isHHN ? HHN_LABELS : RIDE_LABELS;

  const votableItems = [];
  park.lands.forEach((land) => (land.items || []).forEach((i) => i.votable && votableItems.push(i)));
  const reviewedCount = votableItems.filter((i) => myName && votesByItem[i.id]?.[myName]).length;

  return (
    <div className="page">
      {park.missionLog && <div style={{ fontStyle: "italic", fontSize: 12.5, color: "#6b6455", marginBottom: 8 }}>"{park.missionLog}"</div>}
      <div
        className="card"
        style={{ borderColor: park.accent, background: park.accentSoft, color: park.accent, fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
      >
        {park.park}
      </div>

      {park.arrivalNote && <div className="info-note">🚗 {park.arrivalNote}</div>}
      {park.specialNote && <div className="info-note">🌙 {park.specialNote}</div>}
      {park.learnMoreUrl && (
        <a
          href={park.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", fontSize: 11.5, fontWeight: 600, color: park.accent, border: `1px solid ${park.accent}`, borderRadius: 8, padding: "5px 10px", textDecoration: "none", marginBottom: 10 }}
        >
          {park.learnMoreLabel || "Learn more"} ↗
        </a>
      )}

      {votableItems.length > 0 && <ProgressIndicator reviewedCount={reviewedCount} totalCount={votableItems.length} />}

      {park.lands.map((land) => (
        <div key={land.name}>
          <div className="land-header">{land.name}</div>

          {land.singleChoiceGroups?.map((group) => (
            <SingleChoiceGroup key={group.id} group={group} votesByItem={votesByItem} myName={myName} onChoose={onChooseSingle} />
          ))}

          {(land.items || []).map((item) =>
            item.votable ? (
              <PreferenceCard
                key={item.id}
                item={item}
                votersMap={votesByItem[item.id]}
                myLevel={myName ? votesByItem[item.id]?.[myName] : null}
                labelSet={labelSet}
                onSetLevel={onSetLevel}
              />
            ) : (
              <div key={item.id} className="info-note" style={{ background: "#ece9e4", color: "#6b6455" }}>
                ℹ️ <strong>{item.name}</strong> — {item.tag}
              </div>
            )
          )}
        </div>
      ))}

      {onAdvance && (
        <button className="advance-btn" style={{ background: park.accent }} onClick={onAdvance}>
          {advanceLabel || "Advance Mission →"}
        </button>
      )}
    </div>
  );
}
