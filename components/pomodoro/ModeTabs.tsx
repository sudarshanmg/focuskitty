"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MODES } from "@/lib/constants";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import type { Mode } from "@/types/pomodoro";

/* Pill geometry */
interface PillRect { left: number; width: number; }

export function ModeTabs() {
  const { mode, changeMode } = usePomodoroContext();
  const containerRef  = useRef<HTMLDivElement>(null);
  const buttonRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const pillRef       = useRef<HTMLSpanElement>(null);

  const [pill, setPill]   = useState<PillRect>({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const prevPill          = useRef<PillRect>({ left: 0, width: 0 });

  const measure = useCallback((modeId: string): PillRect | null => {
    const activeIndex = MODES.findIndex((m) => m.id === modeId);
    const btn         = buttonRefs.current[activeIndex];
    const container   = containerRef.current;
    if (!btn || !container) return null;
    const cr = container.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    return { left: br.left - cr.left, width: br.width };
  }, []);

  /* Initial placement — no animation */
  useEffect(() => {
    const rect = measure(mode);
    if (!rect) return;
    setPill(rect);
    prevPill.current = rect;
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* On mode change — jelly slide */
  useEffect(() => {
    if (!ready) return;
    const next = measure(mode);
    if (!next) return;

    const prev    = prevPill.current;
    const el      = pillRef.current;
    if (!el) return;

    const goingRight  = next.left > prev.left;
    const stretchRatio = 1.18; // how much the pill stretches during travel

    /* Cancel any running animation */
    el.getAnimations().forEach((a) => a.cancel());

    /* Keyframes:
       0%   → current position/width (prev)
       40%  → stretched toward target (squash-and-stretch mid-point)
       70%  → at target, slightly overshot width
       85%  → slight width undershoot (snapping back)
       100% → settled at target
    */
    const stretchW = Math.abs(next.left - prev.left) * 0.6 + next.width;

    el.animate(
      [
        // start
        { left: `${prev.left}px`, width: `${prev.width}px`, borderRadius: "980px" },
        // stretch toward target
        {
          left: goingRight
            ? `${prev.left}px`
            : `${next.left}px`,
          width: `${stretchW}px`,
          borderRadius: "980px",
          offset: 0.35,
        },
        // arrive with slight overshoot width
        {
          left: `${next.left}px`,
          width: `${next.width * 1.08}px`,
          borderRadius: "980px",
          offset: 0.65,
        },
        // undershoot
        {
          left: `${next.left}px`,
          width: `${next.width * 0.96}px`,
          borderRadius: "980px",
          offset: 0.82,
        },
        // settle
        { left: `${next.left}px`, width: `${next.width}px`, borderRadius: "980px" },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );

    /* Sync React state at the end so it matches */
    const timeout = setTimeout(() => {
      setPill(next);
      prevPill.current = next;
    }, 420);

    return () => clearTimeout(timeout);
  }, [mode, ready, measure]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center mx-3 my-3 rounded-full p-1"
      style={{ background: "var(--progress-track)" }}
    >
      {/* Jelly pill */}
      {ready && (
        <span
          ref={pillRef}
          aria-hidden
          className="absolute top-1 bottom-1 rounded-full"
          style={{
            left:         pill.left,
            width:        pill.width,
            background:   "var(--tab-pill)",
            boxShadow:    "var(--shadow-sm)",
            pointerEvents:"none",
            zIndex:       0,
            willChange:   "left, width",
          }}
        />
      )}

      {MODES.map((m: Mode, i) => (
        <button
          key={m.id}
          ref={(el) => { buttonRefs.current[i] = el; }}
          onClick={() => changeMode(m)}
          className={cn(
            "relative z-10 flex-1 text-center mode-tab",
            mode === m.id && "active"
          )}
          style={{ background: "transparent", boxShadow: "none" }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}