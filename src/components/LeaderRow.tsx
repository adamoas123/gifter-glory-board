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
      className={`relative flex items-center gap-5 rounded-2xl border-2 p-5 transition-all duration-500 ${
        RANK_STYLES[rank] ?? "border-border bg-card/60"
      } ${flash ? "animate-rank-flash" : ""}`}
    >
      {/* Rank number */}
      <div
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl font-display text-5xl ${
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
        <div className="flex items-center gap-3 flex-wrap">
          <h3
            className={`font-display text-4xl leading-none truncate ${
              isFirst ? "text-gold text-glow-gold" : "text-foreground"
            }`}
          >
            {gifter.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${rankInfo.bgClass} ${rankInfo.colorClass}`}
          >
            <span>{rankInfo.emoji}</span>
            {rankInfo.label}
          </span>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {isFirst ? (
            <span className="text-gold/90 font-semibold">👑 Ruling the throne</span>
          ) : gapToAbove > 0 ? (
            <>
              Only <span className="font-bold text-primary">{gapToAbove}</span> gift{gapToAbove === 1 ? "" : "s"} behind #
              {rank - 1}
              {rank > 2 && (
                <>
                  {" "}· <span className="text-gold/80">{gapToFirst} from #1</span>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Gift count */}
      <div className="text-right shrink-0">
        <div
          className={`font-display text-6xl leading-none ${
            isFirst ? "text-gold text-glow-gold" : "text-foreground"
          }`}
        >
          {gifter.gifts}
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">gifts</div>
      </div>
    </div>
  );
};
