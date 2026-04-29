interface Props {
  name: string;
}

export const TakeoverBanner = ({ name }: Props) => {
  return (
    <div className="fixed left-1/2 top-4 sm:top-8 z-40 -translate-x-1/2 w-[95vw] max-w-4xl px-2 animate-throne-drop">
      {/* Outer aura */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-80 animate-aura-pulse">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-throne" />
      </div>

      {/* Light rays */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
        <div className="absolute left-1/2 top-1/2 h-[300%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-rays opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, hsl(var(--gold) / 0.6) 10deg, transparent 30deg, transparent 60deg, hsl(var(--primary) / 0.5) 80deg, transparent 100deg, transparent 180deg, hsl(var(--gold) / 0.6) 200deg, transparent 230deg, transparent 300deg, hsl(var(--primary) / 0.5) 320deg, transparent 350deg)",
          }}
        />
      </div>

      {/* Main banner */}
      <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-gold/80 bg-gradient-throne p-[2px] glow-gold">
        {/* Animated shimmer border */}
        <div className="absolute inset-0 rounded-[1.75rem] opacity-70 animate-border-spin"
          style={{
            background:
              "conic-gradient(from 0deg, hsl(var(--gold)), hsl(var(--primary)), hsl(var(--gold-glow)), hsl(var(--primary-glow)), hsl(var(--gold)))",
          }}
        />

        <div className="relative rounded-[1.6rem] bg-gradient-throne px-4 py-4 sm:px-10 sm:py-6 overflow-hidden">
          {/* Diagonal sheen sweep */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-sheen"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, hsl(0 0% 100% / 0.45) 50%, transparent 70%)",
            }}
          />

          {/* Sparkle dots */}
          <div className="pointer-events-none absolute inset-0">
            {[
              { l: "10%", t: "20%", d: "0s" },
              { l: "85%", t: "15%", d: "0.3s" },
              { l: "20%", t: "75%", d: "0.6s" },
              { l: "75%", t: "70%", d: "0.9s" },
              { l: "50%", t: "10%", d: "0.4s" },
              { l: "92%", t: "55%", d: "0.7s" },
              { l: "5%", t: "55%", d: "1.1s" },
            ].map((s, i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-background/90 animate-sparkle"
                style={{ left: s.l, top: s.t, animationDelay: s.d }}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center gap-3 sm:gap-6">
            <span className="text-4xl sm:text-6xl drop-shadow-[0_4px_12px_hsl(var(--background)/0.5)] animate-crown-bounce">
              👑
            </span>
            <div className="text-center min-w-0">
              <div className="font-display text-[10px] sm:text-sm tracking-[0.4em] text-background/90 mb-1 animate-fade-in">
                ✦ NEW LEADER ✦
              </div>
              <div className="font-display text-2xl sm:text-6xl leading-none text-background break-words drop-shadow-[0_2px_8px_hsl(var(--background)/0.4)] animate-name-pop">
                {name}
              </div>
              <div className="font-display text-lg sm:text-3xl leading-tight text-background/95 mt-1 tracking-wider">
                TAKES THE THRONE!
              </div>
            </div>
            <span className="text-4xl sm:text-6xl drop-shadow-[0_4px_12px_hsl(var(--background)/0.5)] animate-crown-bounce" style={{ animationDelay: "0.15s" }}>
              👑
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
