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
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <span
          className="font-semibold tracking-tighter"
          style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}
        >
          focuskitty.
        </span>

        <div className="flex items-center gap-2">
          <ViewModePicker />

          <Tooltip content="Settings">
            <Button
              variant="secondary"
              size="icon"
              onClick={openSettings}
              aria-label="Settings"
            >
              <Settings size={14} />
            </Button>
          </Tooltip>

          <ThemePicker />

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs font-semibold border border-[var(--accent-ring)]"
            onClick={openPaywall}
          >
            <span style={{ fontSize: 9 }}>✦</span>
            Plus
          </Button>
        </div>
      </div>
      <Separator />
    </>
  );
}
