import { PreferenceCard } from "./PreferenceCard.jsx";
import { SingleChoiceGroup } from "./SingleChoiceGroup.jsx";
import { ProgressIndicator } from "./ProgressIndicator.jsx";
import { HeroBanner } from "./HeroBanner.jsx";
import { RIDE_LABELS, HHN_LABELS } from "../data/uiLabels.js";
import { buildParkReadiness } from "../lib/tripStats.js";
import { FAMILY } from "../data/family.js";

export function ParkPage({ park, votesByItem, myName, onSetLevel, onChooseSingle, onAdvance, advanceLabel }) {
  const labelSet = park.isHHN ? HHN_LABELS : RIDE_LABELS;

  const votableItems = [];
  park.lands.forEach((land) => (land.items || []).forEach((i) => i.votable && votableItems.push(i)));
  const reviewedCount = votableItems.filter((i) => myName && votesByItem[i.id]?.[myName]).length;

  const readiness = buildParkReadiness(votesByItem).find((r) => r.parkId === park.id);

  return (
    <div className="page">
      <HeroBanner
        accent={park.accent}
        title={park.park}
        subtitle={park.missionLog}
        glowColor={park.isHHN ? "#b5292f" : undefined}
        pulse={!!park.isHHN}
      />

      {park.arrivalNote && <div className="info-note">🚗 {park.arrivalNote}</div>}
      {park.specialNote && <div className="info-note">🌙 {park.specialNote}</div>}
      {park.learnMoreUrl && (
        <a
          href={park.learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontSize: 11.5,
            fontWeight: 600,
            color: park.accent,
            border: `1px solid ${park.accent}`,
            borderRadius: 8,
            padding: "5px 10px",
            textDecoration: "none",
            marginBottom: 10,
          }}
        >
          {park.learnMoreLabel || "Learn more"} ↗
        </a>
      )}

      {votableItems.length > 0 && <ProgressIndicator reviewedCount={reviewedCount} totalCount={votableItems.length} />}

      {readiness && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "6px 10px",
            fontSize: 11.5,
            color: "#6b6455",
            margin: "2px 0 14px",
          }}
        >
          <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: park.accent }}>
            SQUAD STATUS — {readiness.completeCount} OF {FAMILY.length} COMPLETE
          </span>
          {FAMILY.map((name) => (
            <span key={name}>
              {name} {readiness.completeByPerson[name] ? "✓" : "○"}
            </span>
          ))}
        </div>
      )}

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
