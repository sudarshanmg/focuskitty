"use client";

import { Expand, Blend } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { ThemePicker } from "@/components/pomodoro/ThemePicker";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

export function TopBar() {
  const { openPaywall, openSettings, viewMode, setViewMode } =
    usePomodoroContext();

  const enterZen = () => setViewMode("zen");

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
          {/* Zen mode */}
          <Tooltip content="Zen mode">
            <Button
              variant="secondary"
              size="icon"
              onClick={enterZen}
              aria-label="Enter zen mode"
            >
              <Expand size={14} />
            </Button>
          </Tooltip>

          {/* Settings */}
          <Tooltip content="Settings">
            <Button
              variant="secondary"
              size="icon"
              onClick={openSettings}
              aria-label="Settings"
            >
              <Blend size={14} />
            </Button>
          </Tooltip>

          {/* Theme picker */}
          <ThemePicker />

          {/* Plus */}
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
