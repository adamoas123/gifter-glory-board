import { useEffect, useRef, useState } from "react";
import { Gifter } from "@/lib/gifters";

export type Momentum = {
  delta: number; // gifts gained in last window
  streak: number; // consecutive recent gains
  trend: "up" | "down" | "flat";
  lastChangeAt: number;
};

const WINDOW_MS = 15_000;

export function useMomentum(gifters: Gifter[]): Record<string, Momentum> {
  const prevRef = useRef<Record<string, number>>({});
  const historyRef = useRef<Record<string, { t: number; gifts: number }[]>>({});
  const streakRef = useRef<Record<string, number>>({});
  const [momentum, setMomentum] = useState<Record<string, Momentum>>({});

  useEffect(() => {
    const now = Date.now();
    const next: Record<string, Momentum> = {};

    for (const g of gifters) {
      const prev = prevRef.current[g.id];
      const hist = (historyRef.current[g.id] ||= []);
      hist.push({ t: now, gifts: g.gifts });
      // prune
      while (hist.length && now - hist[0].t > WINDOW_MS) hist.shift();

      let streak = streakRef.current[g.id] ?? 0;
      let trend: Momentum["trend"] = "flat";
      if (prev !== undefined) {
        if (g.gifts > prev) {
          streak += 1;
          trend = "up";
        } else if (g.gifts < prev) {
          streak = 0;
          trend = "down";
        }
      }
      streakRef.current[g.id] = streak;

      const baseline = hist[0]?.gifts ?? g.gifts;
      const delta = g.gifts - baseline;

      next[g.id] = {
        delta,
        streak,
        trend,
        lastChangeAt: prev !== undefined && prev !== g.gifts ? now : momentum[g.id]?.lastChangeAt ?? 0,
      };
      prevRef.current[g.id] = g.gifts;
    }
    setMomentum(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gifters]);

  return momentum;
}
