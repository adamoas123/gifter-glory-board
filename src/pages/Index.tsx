import { useEffect, useMemo, useRef, useState } from "react";
import { Gifter } from "@/lib/gifters";
import { LeaderRow } from "@/components/LeaderRow";
import { SessionTimer } from "@/components/SessionTimer";
import { ShoutoutOverlay } from "@/components/ShoutoutOverlay";
import { TakeoverBanner } from "@/components/TakeoverBanner";
import { AdminPanel } from "@/components/AdminPanel";

const SEED: Gifter[] = [
  { id: "1", name: "NEONKING", gifts: 87 },
  { id: "2", name: "LUNA_FX", gifts: 64 },
  { id: "3", name: "VIBECHECK", gifts: 42 },
  { id: "4", name: "ZAYYY", gifts: 19 },
  { id: "5", name: "PIXELPUNK", gifts: 8 },
];

const Index = () => {
  const [gifters, setGifters] = useState<Gifter[]>(SEED);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [shoutout, setShoutout] = useState<Gifter | null>(null);
  const [takeover, setTakeover] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  const prevLeaderRef = useRef<string | null>(null);

  const sorted = useMemo(() => [...gifters].sort((a, b) => b.gifts - a.gifts), [gifters]);
  const top5 = sorted.slice(0, 5);

  // Detect leader takeover
  useEffect(() => {
    const leader = sorted[0];
    if (!leader) {
      prevLeaderRef.current = null;
      return;
    }
    if (prevLeaderRef.current && prevLeaderRef.current !== leader.id) {
      setTakeover(leader.name);
      setFlashId(leader.id);
      const t = setTimeout(() => setTakeover(null), 3500);
      const t2 = setTimeout(() => setFlashId(null), 1800);
      prevLeaderRef.current = leader.id;
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
    prevLeaderRef.current = leader.id;
  }, [sorted]);

  const addGifter = (name: string, gifts: number) => {
    setGifters((g) => [...g, { id: crypto.randomUUID(), name, gifts }]);
  };
  const adjust = (id: string, delta: number) => {
    setGifters((g) => g.map((x) => (x.id === id ? { ...x, gifts: Math.max(0, x.gifts + delta) } : x)));
  };
  const remove = (id: string) => setGifters((g) => g.filter((x) => x.id !== id));

  const triggerShoutout = () => {
    const leader = sorted[0];
    if (!leader) return;
    setShoutout(leader);
    setTimeout(() => setShoutout(null), 5000);
  };

  const setTimer = (minutes: number) => setEndsAt(Date.now() + minutes * 60_000);

  const reset = () => {
    setGifters([]);
    setEndsAt(null);
    setShoutout(null);
    setTakeover(null);
    prevLeaderRef.current = null;
  };

  return (
    <div className="min-h-screen px-6 py-6 md:px-10 md:py-8 pr-6 md:pr-[380px]">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gold/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.5em] text-primary text-glow-pink">LIVE · ON AIR</div>
          <h1 className="font-display text-6xl md:text-7xl leading-none">
            <span className="text-foreground">GIFT</span>
            <span className="text-gold text-glow-gold"> THRONE </span>
            <span className="text-primary text-glow-pink">🔥</span>
          </h1>
          <p className="mt-1 text-muted-foreground">Climb the ranks. Claim the crown. Get the shoutout.</p>
        </div>
        <SessionTimer endsAt={endsAt} />
      </header>

      {/* Leaderboard */}
      <section className="space-y-4">
        {top5.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
            <div className="font-display text-4xl text-muted-foreground">NO GIFTERS YET</div>
            <p className="mt-2 text-muted-foreground">Add your first legend from the control deck →</p>
          </div>
        ) : (
          top5.map((g, i) => (
            <LeaderRow
              key={g.id}
              gifter={g}
              rank={i + 1}
              leaderGifts={top5[0].gifts}
              aboveGifts={i === 0 ? null : top5[i - 1].gifts}
              flash={flashId === g.id}
            />
          ))
        )}
      </section>

      {/* Footer hype strip */}
      <footer className="mt-10 overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-primary/10 p-6 text-center">
        <div className="font-display text-2xl md:text-4xl text-foreground">
          🎁 SEND A GIFT · CLIMB THE BOARD · 🥉 → 🥈 → 🥇 → 💎
        </div>
      </footer>

      {/* Overlays */}
      {takeover && <TakeoverBanner name={takeover} />}
      {shoutout && <ShoutoutOverlay gifter={shoutout} />}

      {/* Admin */}
      <AdminPanel
        gifters={gifters}
        onAdd={addGifter}
        onAdjust={adjust}
        onRemove={remove}
        onShoutout={triggerShoutout}
        onSetTimer={setTimer}
        onReset={reset}
      />
    </div>
  );
};

export default Index;
