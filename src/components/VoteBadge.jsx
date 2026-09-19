import { getPositiveVoteCount } from "../lib/tripStats.js";
import { TOTAL_FAMILY_SIZE } from "../data/classificationConfig.js";

/**
 * The "X/6" badge Mission Rail shows next to an attraction reference.
 * Recomputes from the live votesByItem every render via the same
 * getPositiveVoteCount helper V1's dining consensus already uses — no
 * separate counting logic, no cached/stale numbers. Positive = Must Do or
 * Interested; Not for Me and blank/unreviewed both do not count, and the
 * denominator is always the full family size, not the number who've voted.
 */
export function VoteBadge({ itemId, votesByItem, size = "normal" }) {
  const count = getPositiveVoteCount(itemId, votesByItem);
  const big = size === "large";
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 700,
        fontSize: big ? 15 : 12.5,
        letterSpacing: "0.03em",
        color: big ? "#0a0e1a" : "#dbe9ff",
        background: big ? "#8fb3ff" : "rgba(143,179,255,0.14)",
        border: big ? "none" : "1px solid rgba(143,179,255,0.3)",
        borderRadius: 999,
        padding: big ? "5px 12px" : "3px 9px",
      }}
    >
      {count}/{TOTAL_FAMILY_SIZE}
    </span>
  );
}
