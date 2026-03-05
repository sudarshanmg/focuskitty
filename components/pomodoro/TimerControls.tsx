"use client";

import { RotateCcw, Play, Pause, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

export function TimerControls() {
  const { running, secondsLeft, currentMode, toggle, reset, skip } =
    usePomodoroContext();

  const isAtStart = secondsLeft === currentMode.seconds;

  return (
    <>
      <Separator />
      <div className="flex items-center justify-center gap-3 px-6 py-5">

        {/* Reset */}
        <Button
          variant="secondary"
          size="icon"
          onClick={reset}
          aria-label="Reset timer"
        >
          <RotateCcw size={14} />
        </Button>

        {/* Primary CTA — accent bg, contrast-aware text */}
        <Button
          onClick={toggle}
          className="min-w-[136px] gap-2 font-medium"
          style={{
            background: "var(--accent)",
            color: "var(--btn-text, #ffffff)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
            fontSize: "0.92rem",
            padding: "0.72rem 2rem",
            height: "auto",
          }}
        >
          {running ? (
            <>
              <Pause size={13} fill="currentColor" strokeWidth={0} />
              Pause
            </>
          ) : (
            <>
              <Play size={12} fill="currentColor" strokeWidth={0} />
              {isAtStart ? "Start" : "Resume"}
            </>
          )}
        </Button>

        {/* Skip */}
        <Button
          variant="secondary"
          size="icon"
          onClick={skip}
          aria-label="Skip session"
        >
          <SkipForward size={14} />
        </Button>

      </div>
    </>
  );
}