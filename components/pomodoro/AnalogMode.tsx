"use client";

import { useEffect, useState } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { fmtTime } from "@/lib/constants";

/* Tick marks around the clock face */
function Ticks({ count = 60 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const isMajor = i % 5 === 0;
        const len = isMajor ? 10 : 5;
        const rad = (angle * Math.PI) / 180;
        const cx = 110,
          cy = 110,
          r = 96;
        const x1 = cx + (r - len) * Math.sin(rad);
        const y1 = cy - (r - len) * Math.cos(rad);
        const x2 = cx + r * Math.sin(rad);
        const y2 = cy - r * Math.cos(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--progress-track)"
            strokeWidth={isMajor ? 1.5 : 0.8}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

export function AnalogMode() {
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
  const [displayMode, setDisplayMode] = useState(currentMode.label);
  const [fadeMode, setFadeMode] = useState(true);

  const isAnalog = viewMode === "analog";

  useEffect(() => {
    if (isAnalog) setTimeout(() => setVisible(true), 20);
    else setVisible(false);
  }, [isAnalog]);

  /* Mode label crossfade */
  useEffect(() => {
    setFadeMode(false);
    const t = setTimeout(() => {
      setDisplayMode(currentMode.label);
      setFadeMode(true);
    }, 200);
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

  if (!isAnalog) return null;

  /* Pie sweep — progress as elapsed, not remaining */
  const elapsed = currentMode.seconds - secondsLeft;
  const pct = elapsed / currentMode.seconds;
  const angle = pct * 360;
  const rad = ((angle - 90) * Math.PI) / 180;
  const cx = 110,
    cy = 110,
    R = 80;
  const large = angle > 180 ? 1 : 0;
  const ex = cx + R * Math.cos(rad);
  const ey = cy + R * Math.sin(rad);
  const piePath =
    angle >= 359.9
      ? `M${cx},${cy} m-${R},0 a${R},${R} 0 1,1 ${R * 2},0 a${R},${R} 0 1,1 -${R * 2},0`
      : `M${cx},${cy} L${cx},${cy - R} A${R},${R} 0 ${large},1 ${ex},${ey} Z`;

  /* Clock hand for seconds */
  const secAngle = (((currentMode.seconds - secondsLeft) % 60) / 60) * 360;
  const secRad = ((secAngle - 90) * Math.PI) / 180;
  const handLen = 68;
  const hx = cx + handLen * Math.cos(secRad);
  const hy = cy + handLen * Math.sin(secRad);

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
          fontSize: "0.65rem",
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

      {/* Clock face */}
      <div
        style={{
          position: "relative",
          width: "min(56vw, 56vh)",
          height: "min(56vw, 56vh)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 220 220">
          {/* Outer ring */}
          <circle
            cx="110"
            cy="110"
            r="104"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />

          {/* Tick marks */}
          <Ticks count={60} />

          {/* Pie fill — elapsed time */}
          <path d={piePath} fill="var(--accent-soft)" />

          {/* Accent arc outline */}
          {angle > 0 && angle < 359.9 && (
            <path
              d={`M${cx},${cy - R} A${R},${R} 0 ${large},1 ${ex},${ey}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
          {angle >= 359.9 && (
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            />
          )}

          {/* Clock face inner */}
          <circle cx="110" cy="110" r="70" fill="var(--bg-card)" />

          {/* Second hand */}
          <line
            x1={cx}
            y1={cy}
            x2={hx}
            y2={hy}
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ transition: "all 1s linear" }}
          />

          {/* Center dot */}
          <circle cx="110" cy="110" r="3.5" fill="var(--accent)" />
        </svg>

        {/* Time inside face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            paddingTop: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "clamp(1.6rem, 4vmin, 2.4rem)",
              fontWeight: 300,
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            {fmtTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Session dots */}
      <div style={{ display: "flex", gap: 8, marginTop: "1.75rem" }}>
        {Array.from({ length: sessionsPerCycle }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
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
        <button onClick={reset} style={iconBtnStyle}>
          <RotateCcw size={16} />
        </button>
        <button
          onClick={toggle}
          style={{
            ...playBtnStyle,
            background: "var(--accent)",
            color: "var(--btn-text, #fff)",
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
        <button onClick={skip} style={iconBtnStyle}>
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--text-muted)",
  cursor: "pointer",
  padding: 8,
  borderRadius: "50%",
  display: "flex",
};
const playBtnStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "50%",
  width: 56,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};
