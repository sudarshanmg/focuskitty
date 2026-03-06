"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  RING_RADIUS,
  RING_CIRCUMFERENCE,
  calcDashOffset,
  fmtTime,
  SESSIONS_PER_CYCLE,
} from "@/lib/constants";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

export function TimerRing() {
  const { running, secondsLeft, currentMode, sessionsDone } =
    usePomodoroContext();

  // Fade the center text when mode changes
  const [visible, setVisible] = useState(true);
  const [displayedMode, setDisplayedMode] = useState(currentMode.label);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayedMode(currentMode.label);
      setVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [currentMode.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dashOffset = calcDashOffset(secondsLeft, currentMode.seconds);
  const currentSession = (sessionsDone % SESSIONS_PER_CYCLE) + 1;

  const ringSize = "clamp(180px, 28vmin, 240px)";

  return (
    <div className="flex flex-col items-center gap-3 px-6 pt-2 pb-6">

      {/* ── Ring ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: ringSize, height: ringSize }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 220 220"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="5"
            className="progress-ring__track"
          />
          {/* Progress fill */}
          <circle
            cx="110"
            cy="110"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="5"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="progress-ring__fill"
          />
        </svg>

        {/* Center text — fades on mode switch */}
        <div
          className="absolute flex flex-col items-center gap-1"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.18s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'Nunito', 'Varela Round', sans-serif",
              fontSize: "clamp(2.4rem, 5.5vmin, 3.4rem)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              color: "var(--text-primary)",
              lineHeight: 1,
              fontOpticalSizing: "auto" as const,
            }}
          >
            {fmtTime(secondsLeft)}
          </span>
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.6rem",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            {displayedMode}
          </span>
        </div>
      </div>

      {/* ── Session dots + label in one row ── */}
      <div className="flex items-center gap-2.5">
        {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "session-dot",
              i < sessionsDone && "done",
              i === sessionsDone && running && "current"
            )}
          />
        ))}
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "0.68rem",
            letterSpacing: "0.02em",
            marginLeft: "0.25rem",
          }}
        >
          {running
            ? `session ${currentSession} of ${SESSIONS_PER_CYCLE}`
            : sessionsDone === 0
            ? "ready to focus"
            : `${sessionsDone} done today`}
        </span>
      </div>
    </div>
  );
}