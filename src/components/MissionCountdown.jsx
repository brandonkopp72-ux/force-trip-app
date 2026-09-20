import { useEffect, useState } from "react";

// Fixed UTC instant: October 19, 2026, 5:00 AM America/Chicago (CDT, UTC-5).
// Using the "Z" suffix means every device computes the exact same target
// regardless of its own local timezone or clock settings.
const TARGET_MS = Date.parse("2026-10-19T10:00:00Z");

function pad(n) {
  return String(n).padStart(2, "0");
}

function computeParts(nowMs) {
  const diff = Math.max(0, TARGET_MS - nowMs);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

/**
 * Persistent, V2-only countdown to mission launch. Deliberately shows ONLY
 * DD:HH:MM:SS with no visible labels anywhere — the bare format is the
 * whole design. Ticks live once a second; once the target passes, the math
 * naturally clamps at 00:00:00:00 and simply stays there — no "Live
 * Mission" mode, no separate frozen-state branch to get out of sync.
 *
 * `style` is passed straight onto the wrapping element so callers can place
 * and size it without this component knowing anything about its context —
 * it's meant to be small and unobtrusive wherever it's docked in V2.
 */
export function MissionCountdown({ style }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = computeParts(now);
  const label = `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // A plural-aware spoken form for the aria-label ("1 day" vs "2 days") —
  // read on demand by a screen reader (e.g. focusing/browsing to this
  // element), not pushed via aria-live: the spec is explicit that the
  // countdown needs a useful label but must NOT re-announce on every tick.
  const unit = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const spokenLabel = `${unit(days, "day")}, ${unit(hours, "hour")}, ${unit(minutes, "minute")}, ${unit(
    seconds,
    "second"
  )} until mission launch`;

  return (
    <div style={style} role="timer" aria-label={spokenLabel}>
      <style>{`
        @keyframes forceCountdownPulse {
          0% { opacity: 0.82; }
          20% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
      {/* key={label} restarts the pulse animation exactly on each real tick,
          rather than looping on its own independent clock. The digits
          themselves are hidden from assistive tech (the parent's
          role="timer" + aria-label above already gives a real, readable
          value) so a screen reader doesn't also read the raw DD:HH:MM:SS
          string right alongside it. */}
      <span
        key={label}
        aria-hidden="true"
        style={{
          display: "inline-block",
          fontFamily: "'Oswald', sans-serif",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.06em",
          animation: "forceCountdownPulse 1s ease-out",
        }}
      >
        {label}
      </span>
    </div>
  );
}
