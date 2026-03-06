"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward } from "lucide-react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import {
  fmtTime,
  RING_RADIUS,
  RING_CIRCUMFERENCE,
  calcDashOffset,
} from "@/lib/constants";

type Edge = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const SNAP_PADDING = 16;

export function CompactMode() {
  const {
    viewMode,
    setViewMode,
    running,
    secondsLeft,
    currentMode,
    toggle,
    skip,
    theme,
  } = usePomodoroContext();

  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({
    x: SNAP_PADDING,
    y: SNAP_PADDING,
  });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{
    mx: number;
    my: number;
    px: number;
    py: number;
  } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const isCompact = viewMode === "compact";

  /* Fade in */
  useEffect(() => {
    if (isCompact) {
      // Snap to bottom-right on enter
      const W = window.innerWidth,
        H = window.innerHeight;
      const ww = 220,
        wh = 64;
      setPos({ x: W - ww - SNAP_PADDING, y: H - wh - SNAP_PADDING });
      setTimeout(() => setVisible(true), 20);
    } else {
      setVisible(false);
    }
  }, [isCompact]);

  /* Re-snap to nearest corner on window resize */
  useEffect(() => {
    if (!isCompact) return;
    const onResize = () => {
      if (!widgetRef.current) return;
      const { width: ww, height: wh } =
        widgetRef.current.getBoundingClientRect();
      const W = window.innerWidth,
        H = window.innerHeight;
      // Determine which corner the widget is currently closest to
      const cx = pos.x + ww / 2;
      const cy = pos.y + wh / 2;
      const snapToLeft = cx < W / 2;
      const snapToTop = cy < H / 2;
      setPos({
        x: snapToLeft ? SNAP_PADDING : W - ww - SNAP_PADDING,
        y: snapToTop ? SNAP_PADDING : H - wh - SNAP_PADDING,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isCompact, pos]);

  /* Drag */
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      setPos({
        x: dragStart.current.px + (e.clientX - dragStart.current.mx),
        y: dragStart.current.py + (e.clientY - dragStart.current.my),
      });
    };
    const onUp = () => {
      setDragging(false);
      // Snap to nearest corner
      if (!widgetRef.current) return;
      const { width: ww, height: wh } =
        widgetRef.current.getBoundingClientRect();
      const W = window.innerWidth,
        H = window.innerHeight;
      const cx = pos.x + ww / 2,
        cy = pos.y + wh / 2;
      const edge: Edge =
        cx < W / 2
          ? cy < H / 2
            ? "top-left"
            : "bottom-left"
          : cy < H / 2
            ? "top-right"
            : "bottom-right";
      const snapped = {
        "top-left": { x: SNAP_PADDING, y: SNAP_PADDING },
        "top-right": { x: W - ww - SNAP_PADDING, y: SNAP_PADDING },
        "bottom-left": { x: SNAP_PADDING, y: H - wh - SNAP_PADDING },
        "bottom-right": { x: W - ww - SNAP_PADDING, y: H - wh - SNAP_PADDING },
      }[edge];
      setPos(snapped);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, pos]);

  /* Esc exits */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewMode("default");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setViewMode]);

  const MINI_R = 24;
  const MINI_C = 2 * Math.PI * MINI_R;
  const pct = secondsLeft / currentMode.seconds;
  const offset = MINI_C * (1 - pct); // filled from start

  if (!isCompact) return null;

  return (
    <div
      ref={widgetRef}
      data-theme={theme}
      onMouseDown={onMouseDown}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 200,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition: dragging
          ? "none"
          : "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), left 0.35s cubic-bezier(0.22,1,0.36,1), top 0.35s cubic-bezier(0.22,1,0.36,1)",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        width: 220,
      }}
    >
      {/* Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "10px 14px 10px 10px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Mini arc ring */}
        <div
          style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 60 60"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="30"
              cy="30"
              r={MINI_R}
              fill="none"
              strokeWidth="4"
              className="progress-ring__track"
            />
            <circle
              cx="30"
              cy="30"
              r={MINI_R}
              fill="none"
              strokeWidth="4"
              strokeDasharray={MINI_C}
              strokeDashoffset={offset}
              className="progress-ring__fill"
              strokeLinecap="round"
            />
          </svg>
          {/* Running indicator dot */}
          {running && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  animation: "pulse-ring 1.4s ease-out infinite",
                }}
              />
            </div>
          )}
        </div>

        {/* Time + mode */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 300,
              color: "var(--text-primary)",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            {fmtTime(secondsLeft)}
          </div>
          <div
            style={{
              fontSize: "0.58rem",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {currentMode.label}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={toggle}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "var(--btn-text, #fff)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {running ? (
              <Pause size={10} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play
                size={10}
                fill="currentColor"
                strokeWidth={0}
                style={{ marginLeft: 1 }}
              />
            )}
          </button>
          <button
            onClick={() => setViewMode("default")}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "0.6rem",
              fontFamily: "inherit",
            }}
            title="Expand"
          >
            ↗
          </button>
        </div>
      </div>
    </div>
  );
}
