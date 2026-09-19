import { SyncStatus } from "./SyncStatus.jsx";

/**
 * The persistent top identity header — eyebrow (+ an optional small "Final
 * Approach" return link) on the left, identity badge + LOG OUT + sync
 * status on the right.
 *
 * This was originally inline in App.jsx's V1 return block only. It's
 * extracted here, unchanged, so the exact same header — not a visual
 * copy — can also sit above Final Approach and the V2 shell, per Brandon's
 * request to keep the original top header (with LOG OUT) persistent
 * everywhere, with the V2 countdown docked directly beneath it.
 */
export function IdentityHeader({
  person,
  initials,
  onLogout,
  showReturnLink = false,
  onReturnToFinalApproach,
  syncStatus,
  lastSyncedAt,
  realtimeConnected,
}) {
  return (
    <div className="header">
      <div>
        <div className="eyebrow">F.O.R.C.E. — Family Of Rebels Creating Experiences</div>
        {showReturnLink && (
          <button className="switch-link" onClick={onReturnToFinalApproach} style={{ marginTop: 4 }}>
            ← Final Approach
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        <div className="identity-badge">
          <span className="avatar">{initials}</span>
          {person}
          <button className="switch-link" onClick={onLogout} style={{ marginLeft: 6 }}>
            LOG OUT
          </button>
        </div>
        <SyncStatus syncStatus={syncStatus} lastSyncedAt={lastSyncedAt} realtimeConnected={realtimeConnected} />
      </div>
    </div>
  );
}
