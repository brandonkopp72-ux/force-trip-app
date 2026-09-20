// Park operating hours, keyed by PARKS id.
//
// Phase 6 update (researched Sept 20, 2026, ~1 month before the trip):
// Disney and Universal now both publish operating calendars roughly 60 days
// out, so real Oct 2026 hours ARE available for every day of this trip —
// this is no longer the "too far out to know" situation Phase 3/4 assumed.
// Values below were cross-checked against each park's own posted-hours
// calendar (mirrored by thrill-data.com, which explicitly labels this data
// "posted hours," not a prediction) on the research date above.
// `confirmed: true` means "matches the park's own currently-posted
// calendar" — not "guaranteed never to change." Parks occasionally revise
// hours in the weeks before a visit (special events, weather, capacity),
// so it's still worth a final glance in the My Disney Experience / Universal
// Orlando app the week of the trip. `confirmed: false` entries (there
// shouldn't be any left below, but the field stays supported) render with
// an "(est.)" suffix rather than being presented as fact — see
// OperatingIntelStrip in MissionDayPage.jsx.
//
// ioa and usf are visited on BOTH Tuesday and Thursday, with genuinely
// different hours each day (confirmed by the research above) — so unlike
// hs/epic/hhn (visited once), those two entries are keyed by day id rather
// than being one flat object. getParkHours(parkId, dayId) below handles
// both shapes; pass the day id (mission.id) for ioa/usf, and it's simply
// ignored for the once-only parks.
//
// `epa` (Universal's Early Park Admission): earlier phases assumed the
// family's value-tier hotel (Universal's Endless Summer Resort — Dockside
// Inn & Suites) didn't qualify. That assumption was WRONG and is corrected
// here — Universal extended EPA to all on-site hotels, including Endless
// Summer Resort (confirmed via Universal Orlando's own hotel-benefits
// framing, cross-checked against Orlando Informer and Undercover Tourist).
// What's genuinely date-dependent is which PARK gets EPA on a given day —
// the posted calendar shows a specific early-entry time for Islands of
// Adventure on both Oct 20 and Oct 22, and explicitly shows NONE for
// Universal Studios Florida on either of those two dates. So ioa gets a
// real `epa` time below; usf's `epa` is left `null` — a confirmed absence
// for those two dates, not an unknown.
//
// Disney's "Early Theme Park Entry" is a different, Disney-only perk that
// requires staying at a DISNEY resort hotel — the family's confirmed
// lodging is a Universal property, so this genuinely doesn't apply, not
// just "unconfirmed." `earlyEntry: null` on hs reflects that directly.
//
// `earlyAccess` on the `hhn` entry is Halloween Horror Nights' own "Stay &
// Scream" early-access perk (a different thing from daytime EPA). Its
// 2:00 PM start and the 6:30 PM event start both check out against current
// (2026) HHN reporting. HHN doesn't publish an exact nightly close time
// this far out — "Past Midnight" is the real language Universal itself
// uses, not an invented specific hour — so `close` stays that phrase.
export const PARK_HOURS = {
  hs: {
    open: "9:00 AM",
    close: "9:00 PM",
    confirmed: true,
    // Not eligible, not merely unconfirmed — see comment above.
    earlyEntry: null,
  },
  ioa: {
    tuesday: {
      open: "9:00 AM",
      close: "8:00 PM",
      confirmed: true,
      epa: "8:00 AM",
    },
    thursday: {
      open: "9:00 AM",
      close: "6:00 PM",
      confirmed: true,
      epa: "8:00 AM",
    },
  },
  epic: {
    open: "10:00 AM",
    close: "8:00 PM",
    confirmed: true,
    epa: "9:00 AM",
  },
  usf: {
    tuesday: {
      open: "10:00 AM",
      close: "7:00 PM",
      confirmed: true,
      epa: null,
    },
    thursday: {
      // Daytime hours only — regular guest hours end mid-afternoon so the
      // park can turn over for Halloween Horror Nights that same night (see
      // the `hhn` entry below, and usf's own specialNote in parks.js).
      open: "9:00 AM",
      close: "5:00 PM",
      confirmed: true,
      epa: null,
    },
  },
  hhn: {
    open: "6:30 PM",
    close: "Past Midnight",
    earlyAccess: "2:00 PM",
    confirmed: true,
  },
};

/**
 * Looks up a park's operating hours. `dayId` (a mission id like "tuesday" or
 * "thursday") is required for parks visited on more than one day with
 * different hours (ioa, usf) and ignored for parks with one flat entry
 * (hs, epic, hhn) — so existing single-argument callers for those parks are
 * unaffected. Returns null for an unknown park, or for a day-keyed park
 * when no dayId (or an unrecognized one) is given.
 */
export function getParkHours(parkId, dayId) {
  const entry = PARK_HOURS[parkId];
  if (!entry) return null;
  if (entry.open || entry.close) return entry; // flat, single-visit shape
  return (dayId && entry[dayId]) || null;
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
