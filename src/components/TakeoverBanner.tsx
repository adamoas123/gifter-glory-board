interface Props {
  name: string;
}

export const TakeoverBanner = ({ name }: Props) => {
  return (
    <div className="fixed left-1/2 top-8 z-40 -translate-x-1/2 animate-slide-down">
      <div className="relative overflow-hidden rounded-2xl border-2 border-gold bg-gradient-throne px-10 py-5 glow-gold animate-shake">
        <div className="flex items-center gap-4">
          <span className="text-5xl">👑</span>
          <div className="text-center">
            <div className="font-display text-sm tracking-[0.3em] text-background/90">NEW LEADER</div>
            <div className="font-display text-5xl leading-none text-background">
              {name} TAKES THE THRONE!
            </div>
          </div>
          <span className="text-5xl">👑</span>
        </div>
      </div>
    </div>
  );
};
