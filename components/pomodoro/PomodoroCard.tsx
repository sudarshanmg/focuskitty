"use client";

import { TopBar }       from "@/components/pomodoro/TopBar";
import { ModeTabs }     from "@/components/pomodoro/ModeTabs";
import { TimerRing }    from "@/components/pomodoro/TimerRing";
import { TimerControls }from "@/components/pomodoro/TimerControls";

export function PomodoroCard() {
  return (
    <div
      className="card w-full animate-fade-in"
      style={{ maxWidth: "clamp(300px, 38vw, 460px)", padding: 0, overflow: "hidden" }}
    >
      <TopBar />
      <ModeTabs />
      <TimerRing />
      <TimerControls />
    </div>
  );
}