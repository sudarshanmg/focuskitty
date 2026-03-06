"use client";

import { useEffect } from "react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

const VIEW_MODES = ["default", "zen", "compact", "analog", "minimal"] as const;

export function useKeyboardShortcuts() {
  const {
    toggle,
    reset,
    skip,
    showSettings,
    showPaywall,
    viewMode,
    setViewMode,
  } = usePomodoroContext();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (showSettings || showPaywall) return;

      // Escape exits any non-default view
      if (e.key === "Escape" && viewMode !== "default") {
        setViewMode("default");
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "r":
        case "R":
          reset();
          break;
        case "n":
        case "N":
          skip();
          break;
        // View mode shortcuts: 1-5
        case "1":
          setViewMode("default");
          break;
        case "2":
          setViewMode("zen");
          break;
        case "3":
          setViewMode("compact");
          break;
        case "4":
          setViewMode("analog");
          break;
        case "5":
          setViewMode("minimal");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, reset, skip, showSettings, showPaywall, viewMode, setViewMode]);
}
