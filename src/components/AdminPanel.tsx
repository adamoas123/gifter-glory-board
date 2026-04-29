import { useState } from "react";
import { Gifter } from "@/lib/gifters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Megaphone, Timer, RotateCcw, X, Menu, Trash2 } from "lucide-react";

interface Props {
  gifters: Gifter[];
  onAdd: (name: string, gifts: number) => void;
  onAdjust: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onShoutout: () => void;
  onSetTimer: (minutes: number) => void;
  onReset: () => void;
}

export const AdminPanel = ({ gifters, onAdd, onAdjust, onRemove, onShoutout, onSetTimer, onReset }: Props) => {
  const [open, setOpen] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : true);
  const [name, setName] = useState("");
  const [coins, setCoins] = useState("");
  const [mins, setMins] = useState("10");
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), parseInt(coins) || 0);
    setName("");
    setCoins("");
  };

  const PRESETS = [1, 5, 10, 50, 100, 500];

  const sendCustom = (id: string) => {
    const v = parseInt(customAmounts[id] || "0");
    if (!v) return;
    onAdjust(id, v);
    setCustomAmounts((s) => ({ ...s, [id]: "" }));
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed right-4 top-4 z-30 h-12 w-12 rounded-xl bg-primary glow-pink"
        aria-label="Open admin panel"
      >
        <Menu />
      </Button>
    );
  }

  return (
    <aside className="fixed right-0 top-0 z-30 flex h-full w-[340px] max-w-[92vw] flex-col animate-slide-in-right border-l-2 border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-3 py-2 border-b border-border/60">
        <h2 className="font-display text-xl text-primary text-glow-pink leading-none">CONTROL DECK</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 px-3 py-2 shrink-0">
        {/* Shoutout */}
        <Button
          onClick={onShoutout}
          disabled={gifters.length === 0}
          className="h-10 w-full bg-gradient-primary font-display text-lg text-primary-foreground glow-pink hover:scale-[1.02] transition-transform"
        >
          <Megaphone className="mr-1.5 h-4 w-4" /> SHOUTOUT #1
        </Button>

        {/* Timer — inline */}
        <div className="flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Input
            type="number"
            min={1}
            value={mins}
            onChange={(e) => setMins(e.target.value)}
            placeholder="Min"
            className="h-8 bg-background text-sm"
          />
          <Button
            onClick={() => onSetTimer(parseInt(mins) || 10)}
            className="h-8 px-3 text-xs bg-gold text-gold-foreground hover:bg-gold-glow"
          >
            Start
          </Button>
        </div>

        {/* Add gifter — inline */}
        <form onSubmit={handleAdd} className="flex items-center gap-1.5">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 bg-background text-sm flex-1"
          />
          <Input
            type="number"
            placeholder="Coins"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className="h-8 bg-background text-sm w-20"
          />
          <Button type="submit" size="icon" className="h-8 w-8 shrink-0 bg-primary hover:bg-primary-glow">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground pt-1">
          <span>Gifters ({gifters.length})</span>
        </div>
      </div>

      {/* Gifter list — scroll only this region if needed */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 space-y-1.5">
        {gifters.length === 0 && (
          <div className="text-xs text-muted-foreground italic">No gifters yet</div>
        )}
        {gifters
          .slice()
          .sort((a, b) => b.gifts - a.gifts)
          .map((g) => (
            <div key={g.id} className="flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1.5">
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold leading-tight">{g.name}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{g.gifts} gifts</div>
              </div>
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onAdjust(g.id, -1)}>
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                className="h-7 w-7 bg-primary hover:bg-primary-glow"
                onClick={() => onAdjust(g.id, 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => onRemove(g.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
      </div>

      {/* Reset — pinned */}
      <div className="shrink-0 px-3 py-2 border-t border-border/60">
        <Button
          variant="outline"
          onClick={onReset}
          size="sm"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset board
        </Button>
      </div>
    </aside>
  );
};
