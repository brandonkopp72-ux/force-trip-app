/**
 * Shared builder for a Mission Rail "entertainment" node (Fantasmic!,
 * Hogwarts Always, an Epic Universe nighttime show, an HHN live-entertainment
 * slot) from one entry in a day's own nighttimeEntertainment config array.
 *
 * Every day's mission file defines its own small array, e.g.:
 *
 *   export const TUESDAY_NIGHTTIME_ENTERTAINMENT = [
 *     // { title: "HOGWARTS ALWAYS", time: "8:00 PM", type: "projection", status: "confirmed", url: "" },
 *   ];
 *
 * `status` is one of "confirmed" | "tentative" | "notScheduled". Only a
 * "confirmed" entry that also carries a real time (`time`, or a non-empty
 * `times` array) ever produces a node — this function returns null for
 * everything else (no entry, tentative, notScheduled, or confirmed-but-no-
 * time). That's the whole mechanism behind "if no event is scheduled/
 * confirmed, render nothing, and never invent a time": the mission file
 * calls this, and either gets a node to splice into its `rail` array or
 * gets null to filter back out — never a guessed node.
 *
 * Phase 6: a show that runs more than once a night (e.g. a live stunt show
 * with several nightly performances) can use `times: [...]` instead of a
 * single `time` string — every confirmed performance is preserved, not
 * just the first. The EARLIEST time anchors the node's position on the
 * rail (a chronological fact, not a pick); the rest render underneath as
 * `additionalTimes` — see EntertainmentNodeContent in RailBlocks.jsx. This
 * never guesses which performance the family will attend: if a config
 * entry wants to flag one as the plan, it can add its own `preferredTime`
 * field (not set by anything here) and a future UI can read that — nothing
 * currently invents one.
 *
 * `type` (show | fireworks | projection | liveEntertainment | stunt) is
 * passed through as `entertainmentType` for the small tag
 * EntertainmentNodeContent shows; `url`, if given, becomes an optional
 * "more info" link. Nothing here invents a time, a title, or a type — all
 * of it has to come from the entry itself.
 */
export function buildEntertainmentNode(entry, { id, tint }) {
  if (!entry || entry.status !== "confirmed") return null;
  const times = Array.isArray(entry.times) && entry.times.length > 0 ? entry.times : entry.time ? [entry.time] : [];
  if (times.length === 0) return null;
  return {
    kind: "entertainment",
    id,
    heading: entry.title,
    time: times[0],
    additionalTimes: times.length > 1 ? times.slice(1) : undefined,
    preferredTime: entry.preferredTime,
    tint,
    entertainmentType: entry.type,
    url: entry.url,
  };
}

/**
 * Plural version of buildEntertainmentNode, for a day with more than one
 * distinct confirmed live-entertainment offering (Thursday's HHN currently
 * has two: a stunt show and a lagoon show). Returns one node per confirmed
 * entry (skipping anything unconfirmed/timeless, same rule as above), never
 * a fixed number — an empty input, or an input with nothing confirmed yet,
 * correctly produces an empty array rather than a placeholder node.
 */
export function buildEntertainmentNodes(entries, { idPrefix, tint }) {
  return (entries || [])
    .map((entry, i) => buildEntertainmentNode(entry, { id: `${idPrefix}-${i}`, tint }))
    .filter(Boolean);
}
