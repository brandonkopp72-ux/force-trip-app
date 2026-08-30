// Same three underlying levels everywhere, different words/icons per domain
// so "Must Do" for a ride reads naturally as "Can't Miss" for an HHN house.
import { LEVELS } from "./classificationConfig.js";

export const RIDE_LABELS = {
  [LEVELS.MUST_DO]: { icon: "❤️", label: "Must Do" },
  [LEVELS.INTERESTED]: { icon: "👍", label: "I'd Do It" },
  [LEVELS.NOT_FOR_ME]: { icon: "🚫", label: "Not For Me" },
};

export const DINING_LABELS = {
  [LEVELS.MUST_DO]: { icon: "❤️", label: "Yes" },
  [LEVELS.INTERESTED]: { icon: "👍", label: "Fine With It" },
  [LEVELS.NOT_FOR_ME]: { icon: "🚫", label: "No Thanks" },
};

export const HHN_LABELS = {
  [LEVELS.MUST_DO]: { icon: "❤️", label: "Can't Miss" },
  [LEVELS.INTERESTED]: { icon: "👍", label: "Want to See" },
  [LEVELS.NOT_FOR_ME]: { icon: "🚫", label: "Skip Me" },
};

// Note: dining intentionally maps its "Yes" (highest enthusiasm) onto the
// MUST_DO database value even though there's no dining "Must Do" concept —
// this keeps one unified schema/enum rather than a separate dining enum,
// while the UI only ever shows dining-appropriate wording.
