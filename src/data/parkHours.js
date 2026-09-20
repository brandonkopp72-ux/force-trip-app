// Park operating hours, keyed by PARKS id. Disney/Universal don't publish
// exact hours this far out, so `confirmed: false` entries are clearly-marked
// PLACEHOLDER values, not a real schedule — the Operating Intel strip shows
// them with an "estimated" note rather than presenting them as fact.
//
// Update the `open`/`close` values and flip `confirmed: true` once the real
// Oct 2026 hours are published — nothing else needs to change.
export const PARK_HOURS = {
  hs: {
    open: "9:00 AM",
    close: "9:00 PM",
    confirmed: false,
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
  if (meridiemOf(startTime) === meridiemOf(closeTime)) {
    return `${withoutMeridiem(startTime)}–${closeTime}`;
  }
  return `${startTime}–${closeTime}`;
}
