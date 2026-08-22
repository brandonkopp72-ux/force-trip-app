import { useState, useEffect, useCallback } from "react";
import * as audioEngine from "../lib/audioEngine.js";

const keyFor = (person) => `force_audio_muted:${person}`;

/**
 * Per-person mute preference. Deliberately localStorage-backed rather than
 * Supabase — unlike mission-acceptance (which gates real navigation and
 * should follow a person across devices), audio preference is a low-stakes
 * device-level cosmetic setting. Keying it by person name (not a single
 * global flag) still respects that multiple family members may share a
 * device — the whole reason the mission-acceptance flag went to Supabase
 * instead of localStorage.
 */
export function useAudioPreference(person) {
  const [muted, setMutedState] = useState(true); // safe default before we know

  useEffect(() => {
    if (!person) return;
    let initial = false; // default: sound on, per the feature's intent
    try {
      const stored = localStorage.getItem(keyFor(person));
      if (stored !== null) initial = stored === "true";
    } catch (e) {
      // localStorage unavailable — fall back to sound-on default, non-fatal
    }
    setMutedState(initial);
    audioEngine.setMuted(initial);
  }, [person]);

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      if (person) {
        try {
          localStorage.setItem(keyFor(person), String(next));
        } catch (e) {
          // non-fatal — preference just won't persist this session
        }
      }
      return next;
    });
  }, [person]);

  return { muted, toggleMuted };
}
