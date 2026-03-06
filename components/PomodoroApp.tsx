"use client";

import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import { PomodoroCard } from "@/components/pomodoro/PomodoroCard";
import { PaywallModal } from "@/components/pomodoro/PaywallModal";
import { SettingsPanel } from "@/components/pomodoro/SettingsPanel";
import { ZenMode } from "@/components/pomodoro/ZenMode";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function PomodoroInner() {
  const { openPaywall } = usePomodoroContext();
  useKeyboardShortcuts();

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-6 gap-3"
      style={{ background: "var(--bg)" }}
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
