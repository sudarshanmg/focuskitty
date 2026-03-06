"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Play, Pause, SkipForward } from "lucide-react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import {
  fmtTime,
  RING_RADIUS,
  RING_CIRCUMFERENCE,
  calcDashOffset,
} from "@/lib/constants";

export function ZenMode() {
  const {
    viewMode,
    setViewMode,
    running,
    secondsLeft,
    currentMode,
    pct,
    sessionsDone,
    sessionsPerCycle,
    toggle,
    skip,
    reset,
    theme,
  } = usePomodoroContext();

  const [visible, setVisible] = useState(false);
  const [idle, setIdle] = useState(false);
  const [displayMode, setDisplayMode] = useState(currentMode.label);
  const [fadeMode, setFadeMode] = useState(true);

  const isZen = viewMode === "zen";

  /* Esc exits zen — handled by useKeyboardShortcuts globally */
  /* Fade in/out */
  useEffect(() => {
    if (isZen) setTimeout(() => setVisible(true), 20);
    else setVisible(false);
  }, [isZen]);
  useEffect(() => {
    setFadeMode(false);
    const t = setTimeout(() => {
      setDisplayMode(currentMode.label);
      setFadeMode(true);
    }, 200);
    return () => clearTimeout(t);
  }, [currentMode.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Idle — hide controls after 3s of no movement */
  useEffect(() => {
    if (!isZen) return;
    let timer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 3000);
    };
    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
    };
  }, [isZen]);

  /* Esc exits zen */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewMode("default");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setViewMode]);

  const exit = useCallback(() => setViewMode("default"), [setViewMode]);

  const dashOffset = calcDashOffset(secondsLeft, currentMode.seconds);
  const ringSize = "min(45vw, 45vh)";
  const fontSize = "clamp(2.8rem, 8vw, 6rem)";

  if (!isZen) return null;

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
        cursor: idle ? "none" : "default",
      }}
    >
      {/* Exit button — fades with idle */}
      <button
        onClick={exit}
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--text-secondary)",
          opacity: idle ? 0 : 1,
          transition: "opacity 0.4s ease",
          zIndex: 101,
        }}
        aria-label="Exit zen mode"
      >
        <X size={16} />
      </button>

      {/* Mode label */}
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "2rem",
          opacity: fadeMode ? 1 : 0,
          transform: fadeMode ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {displayMode}
      </p>

      {/* Ring + timer */}
      <div
        style={{
          position: "relative",
          width: ringSize,
          height: ringSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 220 220"
          style={{
            transform: "rotate(-90deg)",
            position: "absolute",
            inset: 0,
          }}
        >
          <circle
            cx="110"
            cy="110"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="3"
            className="progress-ring__track"
          />
          <circle
            cx="110"
            cy="110"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="3"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="progress-ring__fill"
          />
        </svg>

        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize,
            fontWeight: 200,
            letterSpacing: "0.02em",
            color: "var(--text-primary)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {fmtTime(secondsLeft)}
        </span>
      </div>

      {/* Session dots */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: "2rem",
          alignItems: "center",
        }}
      >
        {Array.from({ length: sessionsPerCycle }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === sessionsDone && running ? 10 : 7,
              height: i === sessionsDone && running ? 10 : 7,
              borderRadius: "50%",
              background:
                i < sessionsDone ? "var(--accent)" : "var(--progress-track)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Controls — fade with idle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          marginTop: "3rem",
          opacity: idle ? 0 : 1,
          transform: idle ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Reset */}
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
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
          aria-label="Reset"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={toggle}
          style={{
            background: "var(--accent)",
            color: "var(--btn-text, #fff)",
            border: "none",
            borderRadius: "50%",
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label={running ? "Pause" : "Play"}
        >
          {running ? (
            <Pause size={22} fill="currentColor" strokeWidth={0} />
          ) : (
            <Play
              size={22}
              fill="currentColor"
              strokeWidth={0}
              style={{ marginLeft: 2 }}
            />
          )}
        </button>

        {/* Skip */}
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
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
          aria-label="Skip"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Subtle hint */}
      <p
        style={{
          position: "fixed",
          bottom: "1.5rem",
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          letterSpacing: "0.06em",
          opacity: idle ? 0 : 0.6,
          transition: "opacity 0.4s ease",
          userSelect: "none",
        }}
      >
        press ESC to exit
      </p>
    </div>
  );
}
