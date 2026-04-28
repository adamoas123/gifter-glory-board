import { useEffect, useRef, useState } from "react";
import { Gifter, getRank } from "@/lib/gifters";

interface Props {
  gifter: Gifter;
  rank: number;
  leaderGifts: number;
  aboveGifts: number | null;
  flash?: boolean;
}

const RANK_STYLES: Record<number, string> = {
  1: "border-gold bg-gradient-to-r from-gold/30 via-gold/10 to-transparent animate-pulse-glow",
  2: "border-silver/60 bg-silver/5",
  3: "border-bronze/60 bg-bronze/5",
};

export const LeaderRow = ({ gifter, rank, leaderGifts, aboveGifts, flash }: Props) => {
  const rankInfo = getRank(gifter.gifts);
  const isFirst = rank === 1;
  const gapToAbove = aboveGifts !== null ? aboveGifts - gifter.gifts + 1 : 0;
  const gapToFirst = leaderGifts - gifter.gifts;

  return (
    <div
      className={`relative flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border-2 px-2.5 py-2 sm:px-4 sm:py-3 transition-all duration-500 ${
        RANK_STYLES[rank] ?? "border-border bg-card/60"
      } ${flash ? "animate-rank-flash" : ""}`}
    >
      {/* Rank number */}
      <div
        className={`flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg sm:rounded-xl font-display text-xl sm:text-3xl ${
          isFirst
            ? "bg-gradient-gold text-gold-foreground"
            : rank === 2
            ? "bg-silver/20 text-silver"
            : rank === 3
            ? "bg-bronze/20 text-bronze"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isFirst ? "👑" : `#${rank}`}
      </div>

      {/* Name + badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap">
          <h3
            className={`font-display text-xl sm:text-3xl leading-none truncate ${
              isFirst ? "text-gold text-glow-gold" : "text-foreground"
            }`}
          >
            {gifter.name}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-1.5 py-0 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${rankInfo.bgClass} ${rankInfo.colorClass}`}
          >
            <span>{rankInfo.emoji}</span>
            <span className="hidden sm:inline">{rankInfo.label}</span>
          </span>
        </div>
        <GapText
          isFirst={isFirst}
          rank={rank}
          gapToAbove={gapToAbove}
          gapToFirst={gapToFirst}
        />
      </div>

      {/* Gift count */}
      <div className="text-right shrink-0">
        <div
          className={`font-display text-2xl sm:text-4xl leading-none ${
            isFirst ? "text-gold text-glow-gold" : "text-foreground"
          }`}
        >
          {gifter.gifts}
        </div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">gifts</div>
      </div>
    </div>
  );
};

/**
 * Gap text that abbreviates based on available width.
 * Tiers (widest → narrowest):
 *   T3: "Only 3 gifts behind #1 · 12 from #1"
 *   T2: "3 behind #1 · 12 from #1"
 *   T1: "-3 to #1"
 *   T0: "-3"
 */
interface GapTextProps {
  isFirst: boolean;
  rank: number;
  gapToAbove: number;
  gapToFirst: number;
}

const GapText = ({ isFirst, rank, gapToAbove, gapToFirst }: GapTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      // breakpoints tuned for typical leaderboard row widths
      if (w < 90) setTier(0);
      else if (w < 160) setTier(1);
      else if (w < 280) setTier(2);
      else setTier(3);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const content = (() => {
    if (isFirst) {
      return <span className="text-gold/90 font-semibold">👑 Ruling the throne</span>;
    }
    if (gapToAbove <= 0) return null;

    const giftWord = gapToAbove === 1 ? "gift" : "gifts";
    const showFromFirst = rank > 2;

    switch (tier) {
      case 0:
        return <span className="font-bold text-primary">-{gapToAbove}</span>;
      case 1:
        return (
          <>
            <span className="font-bold text-primary">-{gapToAbove}</span>
            <span> to #{rank - 1}</span>
          </>
        );
      case 2:
        return (
          <>
            <span className="font-bold text-primary">{gapToAbove}</span>
            <span> behind #{rank - 1}</span>
            {showFromFirst && (
              <>
                {" "}· <span className="text-gold/80">{gapToFirst} from #1</span>
              </>
            )}
          </>
        );
      default:
        return (
          <>
            Only <span className="font-bold text-primary">{gapToAbove}</span> {giftWord} behind #{rank - 1}
            {showFromFirst && (
              <>
                {" "}· <span className="text-gold/80">{gapToFirst} from #1</span>
              </>
            )}
          </>
        );
    }
  })();

  return (
    <div
      ref={ref}
      className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-tight truncate"
    >
      {content}
    </div>
  );
};
