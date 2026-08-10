export function ProgressIndicator({ reviewedCount, totalCount }) {
  const pct = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;
  const complete = totalCount > 0 && reviewedCount >= totalCount;

  return (
    <div>
      <div className="progress-line">
        <span>
          {reviewedCount} of {totalCount} reviewed
        </span>
        <span>{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {complete && <div className="mission-complete">MISSION COMPLETE ✓</div>}
    </div>
  );
}
