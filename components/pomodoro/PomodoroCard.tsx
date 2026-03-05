"use client";

import { TopBar }       from "@/components/pomodoro/TopBar";
import { ModeTabs }     from "@/components/pomodoro/ModeTabs";
import { TimerRing }    from "@/components/pomodoro/TimerRing";
import { TimerControls }from "@/components/pomodoro/TimerControls";

export function PomodoroCard() {
  return (
    <div
      className="card w-full animate-fade-in"
      style={{ maxWidth: 380, padding: 0, overflow: "hidden" }}
    >
      <TopBar />
      <ModeTabs />
      <TimerRing />
      <TimerControls />
    </div>
  );
}