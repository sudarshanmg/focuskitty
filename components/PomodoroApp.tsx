"use client";

import { PomodoroProvider }  from "@/components/pomodoro/PomodoroContext";
import { PomodoroCard }      from "@/components/pomodoro/PomodoroCard";
import { PaywallModal }      from "@/components/pomodoro/PaywallModal";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

/* Inner wrapper so we can read context for the upgrade nudge */
function PomodoroInner() {
  const { openPaywall } = usePomodoroContext();

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-6 gap-3"
      style={{ background: "var(--bg)" }}
    >
      <PomodoroCard />

      {/* Subtle upgrade nudge below card */}
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