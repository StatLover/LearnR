"use client";

import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { useGame, useOutline } from "./outline-context";
import { fireConfetti } from "./confetti";
import { HexBadge } from "./hex-badge";
import { Hexy } from "@/components/brand/mascot";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { badges, newlyEarnedBadges } from "@/lib/game/badges";
import { progress, useProgress } from "@/lib/store/progress";

/**
 * Watches progress and celebrates: a floating "+XP" pill whenever XP is
 * earned, a level-up dialog with confetti, and badge announcements.
 */
export function CelebrationLayer() {
  const game = useGame();
  const outline = useOutline();
  const state = useProgress();
  const last = useRef<{ xp: number; level: number } | null>(null);
  const [gain, setGain] = useState<{ id: number; amount: number } | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  useEffect(() => {
    if (!state.updatedAt) return;
    const prev = last.current;
    last.current = { xp: game.xp, level: game.level.level };
    if (!prev) return; // first render after load: nothing to celebrate
    if (game.xp > prev.xp) {
      const id = Date.now();
      setGain({ id, amount: game.xp - prev.xp });
      setTimeout(() => setGain((g) => (g?.id === id ? null : g)), 2300);
    }
    if (game.level.level > prev.level) {
      setLevelUp(game.level.level);
      setTimeout(() => fireConfetti({ y: 0.3, count: 160 }), 150);
    }
  }, [game.xp, game.level.level, state.updatedAt]);

  useEffect(() => {
    if (!state.updatedAt) return;
    const earned = newlyEarnedBadges(state, outline);
    if (!earned.length) return;
    progress.grantAchievements(earned);
    for (const id of earned) {
      const b = badges.find((x) => x.id === id);
      if (b) toast(`Badge unlocked: ${b.title}`, { description: b.description, tone: "success", duration: 5000 });
    }
  }, [state, outline]);

  return (
    <>
      <div aria-live="polite" className="pointer-events-none fixed right-4 top-20 z-[80] sm:right-8">
        {gain && (
          <div key={gain.id} className="animate-xp-rise flex items-center gap-1.5 rounded-full bg-sun px-4 py-2 font-display text-lg font-semibold text-[#3b2600] shadow-[0_4px_0_var(--sun-shadow)]">
            <Zap className="size-5 fill-current" /> +{gain.amount} XP
          </div>
        )}
      </div>
      <Dialog open={levelUp !== null} onOpenChange={(o) => !o && setLevelUp(null)}>
        <DialogContent title={`Level ${levelUp}!`} hideTitle className="max-w-sm text-center">
          <div className="flex flex-col items-center">
            <Hexy mood="celebrate" size={130} animate />
            <p className="mt-2 font-display text-sm font-semibold uppercase tracking-widest text-primary">Level up!</p>
            <p className="font-display text-5xl font-bold">{levelUp}</p>
            <p className="mt-1 font-display text-xl font-semibold">{game.level.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">Amazing progress – you now have {game.xp.toLocaleString()} XP. Keep going!</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <HexBadge icon="trophy" color="sun" size={36} /> Next level at {game.level.next.toLocaleString()} XP
            </div>
            <Button className="mt-5 w-full" size="lg" onClick={() => setLevelUp(null)}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
