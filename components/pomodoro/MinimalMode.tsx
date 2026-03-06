"use client";

import { useEffect, useState } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { fmtTime } from "@/lib/constants";

export function MinimalMode() {
  const {
    viewMode,
    setViewMode,
    running,
    secondsLeft,
    currentMode,
    sessionsDone,
    sessionsPerCycle,
    toggle,
    skip,
    reset,
    theme,
  } = usePomodoroContext();

  const [visible, setVisible] = useState(false);
  const [displayTime, setDisplayTime] = useState(fmtTime(secondsLeft));
  const [displayMode, setDisplayMode] = useState(currentMode.label);
  const [flash, setFlash] = useState(true);

  const isMinimal = viewMode === "minimal";

  useEffect(() => {
    if (isMinimal) setTimeout(() => setVisible(true), 20);
    else setVisible(false);
  }, [isMinimal]);

  /* Tick — flash colon every second */
  useEffect(() => {
    setDisplayTime(fmtTime(secondsLeft));
    if (running) setFlash((f) => !f);
  }, [secondsLeft, running]);

  /* Mode label crossfade */
  useEffect(() => {
    const t = setTimeout(() => setDisplayMode(currentMode.label), 200);
    return () => clearTimeout(t);
  }, [currentMode.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Esc exits */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewMode("default");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setViewMode]);

  // Progress bar width
  const barPct = (secondsLeft / currentMode.seconds) * 100;

  if (!isMinimal) return null;

  // Split time for flashing colon
  const [mins, secs] = displayTime.split(":");

  return (
    <div
      data-theme={theme}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Exit */}
      <button
        onClick={() => setViewMode("default")}
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          fontFamily: "inherit",
        }}
      >
        ✕
      </button>

      {/* Mode label */}
      <p
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "1.5rem",
        }}
      >
        {displayMode}
      </p>

      {/* Giant time — no ring */}
      <div
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "clamp(4rem, 18vw, 12rem)",
          fontWeight: 200,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "var(--text-primary)",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>{mins}</span>
        <span
          style={{
            opacity: flash || !running ? 1 : 0.2,
            transition: "opacity 0.15s ease",
            margin: "0 0.02em",
            color: "var(--accent)",
          }}
        >
          :
        </span>
        <span>{secs}</span>
      </div>

      {/* Thin progress bar */}
      <div
        style={{
          width: "clamp(200px, 40vw, 480px)",
          height: 2,
          background: "var(--progress-track)",
          borderRadius: 999,
          marginTop: "2.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barPct}%`,
            background: "var(--accent)",
            borderRadius: 999,
            transition: "width 1s linear",
          }}
        />
      </div>

      {/* Session dots */}
      <div style={{ display: "flex", gap: 8, marginTop: "1.25rem" }}>
        {Array.from({ length: sessionsPerCycle }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background:
                i < sessionsDone ? "var(--accent)" : "var(--progress-track)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          marginTop: "2.5rem",
        }}
      >
        <button
          onClick={reset}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: 8,
            borderRadius: "50%",
            display: "flex",
          }}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={toggle}
          style={{
            background: "var(--accent)",
            color: "var(--btn-text, #fff)",
            border: "none",
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {running ? (
            <Pause size={20} fill="currentColor" strokeWidth={0} />
          ) : (
            <Play
              size={20}
              fill="currentColor"
              strokeWidth={0}
              style={{ marginLeft: 2 }}
            />
          )}
        </button>
        <button
          onClick={skip}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: 8,
            borderRadius: "50%",
            display: "flex",
          }}
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
