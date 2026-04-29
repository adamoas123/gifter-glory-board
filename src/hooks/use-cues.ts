import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "gt_cues_muted";

type CueType = "approach" | "takeover" | "swap";

let _ctx: AudioContext | null = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
  return _ctx;
};

/**
 * Play a short tonal blip. Pleasant, subtle — not a notification ding.
 */
const blip = (ctx: AudioContext, freq: number, duration = 0.18, type: OscillatorType = "sine", gain = 0.06) => {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
};

const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(pattern); } catch {}
  }
};

export function useCues() {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    }
  }, [muted]);

  // Unlock audio on first user gesture (browser autoplay policy)
  useEffect(() => {
    const unlock = () => { getCtx(); };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const play = useCallback((type: CueType) => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    switch (type) {
      case "approach": {
        // Two soft rising sine blips — "tension"
        blip(ctx, 660, 0.12, "sine", 0.05);
        setTimeout(() => blip(ctx, 880, 0.14, "sine", 0.05), 90);
        vibrate(20);
        break;
      }
      case "takeover": {
        // Triumphant triad — "victory"
        blip(ctx, 523, 0.16, "triangle", 0.07); // C5
        setTimeout(() => blip(ctx, 659, 0.16, "triangle", 0.07), 90); // E5
        setTimeout(() => blip(ctx, 784, 0.28, "triangle", 0.08), 180); // G5
        vibrate([30, 40, 60]);
        break;
      }
      case "swap": {
        // Quick neutral tick
        blip(ctx, 440, 0.08, "sine", 0.04);
        vibrate(12);
        break;
      }
    }
  }, []);

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMuted, play };
}
