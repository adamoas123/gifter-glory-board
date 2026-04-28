export type Gifter = {
  id: string;
  name: string;
  gifts: number;
};

export type Rank = {
  label: string;
  emoji: string;
  min: number;
  colorClass: string;
  bgClass: string;
};

export const RANKS: Rank[] = [
  { label: "Diamond", emoji: "💎", min: 61, colorClass: "text-diamond", bgClass: "bg-diamond/20 border-diamond/50" },
  { label: "Gold", emoji: "🥇", min: 31, colorClass: "text-gold", bgClass: "bg-gold/20 border-gold/50" },
  { label: "Silver", emoji: "🥈", min: 11, colorClass: "text-silver", bgClass: "bg-silver/20 border-silver/50" },
  { label: "Bronze", emoji: "🥉", min: 1, colorClass: "text-bronze", bgClass: "bg-bronze/20 border-bronze/50" },
];

export function getRank(gifts: number): Rank {
  return RANKS.find((r) => gifts >= r.min) ?? RANKS[RANKS.length - 1];
}
