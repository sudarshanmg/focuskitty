"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { ThemePicker } from "@/components/pomodoro/ThemePicker";
import { ViewModePicker } from "@/components/pomodoro/ViewModePicker";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

export function TopBar() {
  const { openPaywall, openSettings } = usePomodoroContext();

  return (
    <>
      <div
        className="flex items-center justify-between"
        style={{
          padding:
            "clamp(0.75rem, 2.5vw, 1.25rem) clamp(0.75rem, 3vw, 1.25rem)",
          gap: 6,
        }}
      >
        <span
          className="font-semibold tracking-tighter flex-shrink-0"
          style={{
            fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
            color: "var(--text-primary)",
          }}
        >
          focuskitty.
        </span>

        <div
          className="flex items-center"
          style={{ gap: "clamp(4px, 1.5vw, 8px)" }}
        >
          <ViewModePicker />

          <Tooltip content="Settings">
            <Button
              variant="secondary"
              size="icon"
              onClick={openSettings}
              aria-label="Settings"
              className="h-8 w-8"
            >
              <Settings size={13} />
            </Button>
          </Tooltip>

          <ThemePicker />

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 font-semibold border border-[var(--accent-ring)] flex-shrink-0"
            style={{
              fontSize: "clamp(0.65rem, 2vw, 0.75rem)",
              padding: "0.3rem clamp(0.4rem, 1.5vw, 0.75rem)",
              height: "auto",
            }}
            onClick={openPaywall}
          >
            <span style={{ fontSize: 8 }}>✦</span>
            Plus
          </Button>
        </div>
      </div>
      <Separator />
    </>
  );
}
