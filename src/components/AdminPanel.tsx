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
  const [gifts, setGifts] = useState("");
  const [mins, setMins] = useState("10");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), parseInt(gifts) || 0);
    setName("");
    setGifts("");
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
    <aside className="fixed right-0 top-0 z-30 h-full w-[360px] max-w-[90vw] animate-slide-in-right overflow-y-auto border-l-2 border-primary/30 bg-card/95 backdrop-blur-xl p-5 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-3xl text-primary text-glow-pink">CONTROL DECK</h2>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X />
        </Button>
      </div>

      {/* Shoutout */}
      <Button
        onClick={onShoutout}
        disabled={gifters.length === 0}
        className="mb-3 h-14 w-full bg-gradient-primary font-display text-2xl text-primary-foreground glow-pink hover:scale-[1.02] transition-transform"
      >
        <Megaphone className="mr-2" /> SHOUTOUT #1
      </Button>

      {/* Timer */}
      <div className="mb-5 rounded-xl border border-border bg-background/40 p-4">
        <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Timer className="h-4 w-4" /> Session timer (minutes)
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            value={mins}
            onChange={(e) => setMins(e.target.value)}
            className="bg-background"
          />
          <Button
            onClick={() => onSetTimer(parseInt(mins) || 10)}
            className="bg-gold text-gold-foreground hover:bg-gold-glow"
          >
            Start
          </Button>
        </div>
      </div>

      {/* Add gifter */}
      <form onSubmit={handleAdd} className="mb-5 rounded-xl border border-border bg-background/40 p-4 space-y-2">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Add gifter</div>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background"
        />
        <Input
          type="number"
          placeholder="Gifts"
          value={gifts}
          onChange={(e) => setGifts(e.target.value)}
          className="bg-background"
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary-glow">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </form>

      {/* Gifter list */}
      <div className="mb-5 space-y-2">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Gifters ({gifters.length})</div>
        {gifters.length === 0 && (
          <div className="text-sm text-muted-foreground italic">No gifters yet</div>
        )}
        {gifters
          .slice()
          .sort((a, b) => b.gifts - a.gifts)
          .map((g) => (
            <div key={g.id} className="flex items-center gap-2 rounded-lg border border-border bg-background/60 p-2">
              <div className="flex-1 min-w-0">
                <div className="truncate font-semibold">{g.name}</div>
                <div className="text-xs text-muted-foreground">{g.gifts} gifts</div>
              </div>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => onAdjust(g.id, -1)}>
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 bg-primary hover:bg-primary-glow"
                onClick={() => onAdjust(g.id, 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => onRemove(g.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
      </div>

      <Button
        variant="outline"
        onClick={onReset}
        className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reset board
      </Button>
    </aside>
  );
};
