"use client";

import { useState, useEffect, useCallback } from "react";
import { Maximize2, Minimize2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemePicker } from "@/components/pomodoro/ThemePicker";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

export function TopBar() {
  const { openPaywall, openSettings } = usePomodoroContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

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
          {/* Fullscreen */}
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>

          {/* Settings */}
          <Button
            variant="secondary"
            size="icon"
            onClick={openSettings}
            aria-label="Settings"
          >
            <Settings size={14} />
          </Button>

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
