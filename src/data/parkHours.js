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
