import { Gifter } from "@/lib/gifters";
import { Confetti } from "./Confetti";

interface Props {
  gifter: Gifter;
}

export const ShoutoutOverlay = ({ gifter }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md">
      <Confetti count={120} />
      <div className="relative animate-shoutout-in text-center px-4 sm:px-8 w-full">
        <div className="mb-2 sm:mb-4 font-display text-lg sm:text-3xl tracking-[0.3em] sm:tracking-[0.4em] text-primary text-glow-pink">
          ★ BIG SHOUTOUT ★
        </div>
        <h1 className="font-display text-[min(20vw,14rem)] leading-none text-gold text-glow-gold animate-flame break-words">
          {gifter.name}
        </h1>
        <div className="mt-2 sm:mt-4 font-display text-2xl sm:text-5xl text-primary text-glow-pink">
          👑 THE MVP 👑
        </div>
        <div className="mt-4 sm:mt-6 inline-block rounded-2xl bg-gradient-throne px-4 py-2 sm:px-8 sm:py-3 font-display text-xl sm:text-3xl text-background">
          {gifter.gifts} GIFTS STRONG
        </div>
      </div>
    </div>
  );
};
