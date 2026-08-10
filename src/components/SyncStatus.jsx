export function SyncStatus({ syncStatus, lastSyncedAt, realtimeConnected }) {
  let label = "";
  if (syncStatus === "saving") label = "Saving…";
  else if (syncStatus === "error") label = "⚠ Sync problem";
  else if (lastSyncedAt) {
    label = `✓ Synced ${lastSyncedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }

  if (!label) return null;

  return (
    <div className="sync-status" title={realtimeConnected ? "Live updates connected" : "Live updates reconnecting…"}>
      {label}
      {!realtimeConnected && syncStatus !== "error" && " · reconnecting"}
    </div>
  );
}
