interface Props {
  name: string;
}

export const TakeoverBanner = ({ name }: Props) => {
  return (
    <div className="fixed left-1/2 top-4 sm:top-8 z-40 -translate-x-1/2 animate-slide-down w-[95vw] max-w-3xl px-2">
      <div className="relative overflow-hidden rounded-2xl border-2 border-gold bg-gradient-throne px-4 py-3 sm:px-10 sm:py-5 glow-gold animate-shake">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <span className="text-3xl sm:text-5xl">👑</span>
          <div className="text-center min-w-0">
            <div className="font-display text-[10px] sm:text-sm tracking-[0.3em] text-background/90">NEW LEADER</div>
            <div className="font-display text-2xl sm:text-5xl leading-none text-background break-words">
              {name} TAKES THE THRONE!
            </div>
          </div>
          <span className="text-3xl sm:text-5xl">👑</span>
        </div>
      </div>
    </div>
  );
};
