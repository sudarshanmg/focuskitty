"use client";

import { useEffect } from "react";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { PomodoroCard } from "@/components/pomodoro/PomodoroCard";
import { PaywallModal } from "@/components/pomodoro/PaywallModal";
import { SettingsPanel } from "@/components/pomodoro/SettingsPanel";
import { ZenMode } from "@/components/pomodoro/ZenMode";
import { CompactMode } from "@/components/pomodoro/CompactMode";
import { AnalogMode } from "@/components/pomodoro/AnalogMode";
import { MinimalMode } from "@/components/pomodoro/MinimalMode";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function PomodoroInner() {
  const { openPaywall } = usePomodoroContext();
  useKeyboardShortcuts();

  // Blur any element focused by Next.js router on navigation
  useEffect(() => {
    const el = document.activeElement as HTMLElement | null;
    el?.blur();
  }, []);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-6 gap-3"
      style={{ background: "var(--bg)" }}
      // Absorb Next.js router focus so buttons don't get it
      tabIndex={-1}
      onFocus={(e) => e.currentTarget.blur()}
    >
      <PomodoroCard />

      <button
        className="animate-fade-in text-center"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontFamily: "inherit",
          fontSize: "0.72rem",
          letterSpacing: "0.01em",
          animationDelay: "0.25s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
        onClick={openPaywall}
      >
        unlock stats, sounds &amp; more{" "}
        <span style={{ color: "var(--accent)" }}>→</span>
      </button>

      <PaywallModal />
      <SettingsPanel />
      <ZenMode />
      <CompactMode />
      <AnalogMode />
      <MinimalMode />
    </div>
  );
}

export default function PomodoroApp() {
  return (
    <PomodoroProvider>
      <PomodoroInner />
    </PomodoroProvider>
  );
}
