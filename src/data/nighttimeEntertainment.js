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
 * "confirmed" entry that also carries a real `time` ever produces a node —
 * this function returns null for everything else (no entry, tentative,
 * notScheduled, or confirmed-but-no-time). That's the whole mechanism behind
 * "if no event is scheduled/confirmed, render nothing, and never invent a
 * time": the mission file calls this, and either gets a node to splice into
 * its `rail` array or gets null to filter back out — never a guessed node.
 *
 * `type` (show | fireworks | projection | liveEntertainment) is passed
 * through as `entertainmentType` for the small tag EntertainmentNodeContent
 * shows; `url`, if given, becomes an optional "more info" link. Nothing here
 * invents a time, a title, or a type — all of it has to come from the
 * entry itself.
 */
export function buildEntertainmentNode(entry, { id, tint }) {
  if (!entry || entry.status !== "confirmed" || !entry.time) return null;
  return {
    kind: "entertainment",
    id,
    heading: entry.title,
    time: entry.time,
    tint,
    entertainmentType: entry.type,
    url: entry.url,
  };
}
