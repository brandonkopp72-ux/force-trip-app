// Park operating hours, keyed by PARKS id. Disney/Universal don't publish
// exact hours this far out, so `confirmed: false` entries are clearly-marked
// PLACEHOLDER values, not a real schedule — the Operating Intel strip shows
// them with an "estimated" note rather than presenting them as fact.
//
// Update the `open`/`close` values and flip `confirmed: true` once the real
// Oct 2026 hours are published — nothing else needs to change.
//
// `epa` (Early Park Admission) is deliberately OMITTED for ioa/epic/usf.
// Universal generally reserves EPA for guests of its "preferred"/premier
// on-site hotels — the family's confirmed hotel, Endless Summer Resort —
// Dockside Inn & Suites, is a value-tier property that typically does NOT
// carry that perk. Rather than guess wrong, no early-admission time is shown
// for those three parks. Add an `epa` field here (same shape as `open`) if
// that turns out to be incorrect or the hotel changes.
//
// `earlyAccess` on the `hhn` entry is a DIFFERENT thing — Halloween Horror
// Nights' own "Scream Early Access" ticket perk, not daytime EPA. Its value
// and the event's 6:30 PM start already match the existing `specialNote` on
// the hhn entry in parks.js (written and approved in an earlier phase), so
// it's marked `confirmed: true` rather than treated as a new guess. HHN
// doesn't publish an exact nightly close time this far out ("past midnight"
// is the real language Universal itself uses), so `close` is left as that
// phrase rather than inventing a specific hour.
export const PARK_HOURS = {
  hs: {
    open: "9:00 AM",
    close: "9:00 PM",
    confirmed: false,
  },
  ioa: {
    open: "9:00 AM",
    close: "6:00 PM",
    confirmed: false,
  },
  epic: {
    open: "9:00 AM",
    close: "7:00 PM",
    confirmed: false,
  },
  usf: {
    // Daytime hours only — regular guest hours end mid-afternoon so the park
    // can turn over for Halloween Horror Nights that same night (see the
    // `hhn` entry below, and usf's own specialNote in parks.js).
    open: "9:00 AM",
    close: "4:00 PM",
    confirmed: false,
  },
  hhn: {
    open: "6:30 PM",
    close: "Past Midnight",
    earlyAccess: "2:00 PM",
    confirmed: true,
  },
};

export function getParkHours(parkId) {
  return PARK_HOURS[parkId] || null;
}

/**
 * Formats a flexible window that runs from a fixed start time to the park's
 * close, e.g. ("5:00 PM", "9:00 PM") -> "5:00–9:00 PM" — the way people
 * actually write a same-period range, dropping the repeated meridiem rather
 * than showing it twice. Falls back to just the start time if close is
 * unknown. Used by Evening Operations-style rail nodes so the display stays
 * correct if the configured close time above ever changes.
 */
export function formatEveningWindow(startTime, closeTime) {
  if (!closeTime) return startTime;
  const meridiemOf = (t) => t.trim().slice(-2).toUpperCase();
  const withoutMeridiem = (t) => t.trim().slice(0, -2).trim();
  // A close value that isn't a plain clock time (e.g. HHN's "Past Midnight")
  // has no meridiem to dedupe against — just join the two as written.
  if (!/[ap]m$/i.test(closeTime.trim())) {
    return `${startTime}–${closeTime}`;
  }
  if (meridiemOf(startTime) === meridiemOf(closeTime)) {
    return `${withoutMeridiem(startTime)}–${closeTime}`;
  }
  return `${startTime}–${closeTime}`;
}
