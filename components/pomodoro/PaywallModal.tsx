"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

const PLUS_FEATURES = [
  "Daily & weekly focus stats",
  "Ambient soundscapes",
  "Unlimited session history",
  "Focus streaks & milestones",
  "Calendar integration",
  "Priority support",
];

export function PaywallModal() {
  const { showPaywall, closePaywall } = usePomodoroContext();

  return (
    <Dialog open={showPaywall} onOpenChange={(open) => !open && closePaywall()}>
      <DialogContent>
        {/* Crown icon */}
        <div
          className="mx-auto mb-1 flex items-center justify-center rounded-full"
          style={{
            width: 52,
            height: 52,
            background: "var(--accent-soft)",
            fontSize: 24,
          }}
        >
          👑
        </div>

        <DialogHeader>
          <DialogTitle>Unlock Plus</DialogTitle>
          <DialogDescription>
            Stats, soundscapes, streaks &amp; more.
          </DialogDescription>
        </DialogHeader>

        {/* Feature list */}
        <ul className="space-y-2.5 my-5">
          {PLUS_FEATURES.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="flex-shrink-0 rounded-full flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          <Button
            className="w-full font-semibold"
            style={{
              background: "var(--accent)",
              color: "var(--btn-text)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            onClick={closePaywall}
          >
            Get FocusKitty Plus →
          </Button>
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={closePaywall}
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
