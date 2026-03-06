"use client";

import { useEffect } from "react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

export function useKeyboardShortcuts() {
  const {
    toggle,
    reset,
    skip,
    changeMode,
    modes,
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

      // Escape exits zen
      if (e.key === "Escape" && viewMode === "zen") {
        setViewMode("default");
        return;
      }

      // In zen mode, only allow playback controls + exit
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
        case "z":
        case "Z":
          setViewMode(viewMode === "zen" ? "default" : "zen");
          break;
        case "1":
          if (viewMode !== "zen") changeMode(modes[0]);
          break;
        case "2":
          if (viewMode !== "zen") changeMode(modes[1]);
          break;
        case "3":
          if (viewMode !== "zen") changeMode(modes[2]);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    toggle,
    reset,
    skip,
    changeMode,
    modes,
    showSettings,
    showPaywall,
    viewMode,
    setViewMode,
  ]);
}
