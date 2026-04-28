import { useEffect, useState } from "react";

interface Props {
  endsAt: number | null;
}

export const SessionTimer = ({ endsAt }: Props) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(i);
  }, []);

  const remaining = endsAt ? Math.max(0, endsAt - now) : 0;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const critical = endsAt && remaining > 0 && remaining < 60000;
  const over = endsAt && remaining === 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border-2 px-6 py-3 transition-all ${
        critical
          ? "border-primary bg-primary/10 animate-pulse-pink"
          : over
          ? "border-destructive bg-destructive/10"
          : "border-gold/40 bg-card/60"
      }`}
    >
      <span className="text-2xl">⏱️</span>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Session ends in</div>
        <div
          className={`font-display text-4xl leading-none ${
            critical ? "text-primary text-glow-pink" : over ? "text-destructive" : "text-gold text-glow-gold"
          }`}
        >
          {endsAt ? `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}` : "--:--"}
        </div>
      </div>
    </div>
  );
};
