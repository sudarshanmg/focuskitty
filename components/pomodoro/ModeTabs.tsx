"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import type { Mode } from "@/types/focuskitty";

interface PillRect {
  left: number;
  width: number;
}

export function ModeTabs() {
  const { mode, changeMode, modes } = usePomodoroContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement>(null);

  const [pill, setPill] = useState<PillRect>({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const prevPill = useRef<PillRect>({ left: 0, width: 0 });

  // Stable mode id list — only changes when mode labels/ids change, not on every tick
  const modeIds = modes.map((m) => m.id).join(",");

  const measure = useCallback(
    (modeId: string): PillRect | null => {
      const activeIndex = buttonRefs.current.findIndex(
        (_, i) => modes[i]?.id === modeId,
      );
      const btn = buttonRefs.current[activeIndex];
      const container = containerRef.current;
      if (!btn || !container) return null;
      const cr = container.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      return { left: br.left - cr.left, width: br.width };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [modeIds],
  ); // stable — only recalculates if tab count/ids change

  /* Initial placement — no animation */
  useEffect(() => {
    const rect = measure(mode);
    if (!rect) return;
    setPill(rect);
    prevPill.current = rect;
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Resize observer — reposition pill without animation when container resizes */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const rect = measure(mode);
      if (!rect) return;
      // Cancel any running animation and snap to new position
      pillRef.current?.getAnimations().forEach((a) => a.cancel());
      setPill(rect);
      prevPill.current = rect;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [mode, measure]);

  /* On mode change — jelly slide */
  useEffect(() => {
    if (!ready) return;
    const next = measure(mode);
    if (!next) return;

    const prev = prevPill.current;
    const el = pillRef.current;
    if (!el) return;

    // Skip animation if position hasn't changed (e.g. resize already snapped)
    if (prev.left === next.left && prev.width === next.width) return;

    const goingRight = next.left > prev.left;
    const stretchW = Math.abs(next.left - prev.left) * 0.6 + next.width;

    el.getAnimations().forEach((a) => a.cancel());

    el.animate(
      [
        {
          left: `${prev.left}px`,
          width: `${prev.width}px`,
          borderRadius: "980px",
        },
        {
          left: goingRight ? `${prev.left}px` : `${next.left}px`,
          width: `${stretchW}px`,
          borderRadius: "980px",
          offset: 0.35,
        },
        {
          left: `${next.left}px`,
          width: `${next.width * 1.08}px`,
          borderRadius: "980px",
          offset: 0.65,
        },
        {
          left: `${next.left}px`,
          width: `${next.width * 0.96}px`,
          borderRadius: "980px",
          offset: 0.82,
        },
        {
          left: `${next.left}px`,
          width: `${next.width}px`,
          borderRadius: "980px",
        },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );

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
      {ready && (
        <span
          ref={pillRef}
          aria-hidden
          className="absolute top-1 bottom-1 rounded-full"
          style={{
            left: pill.left,
            width: pill.width,
            background: "var(--tab-pill)",
            boxShadow: "var(--shadow-sm)",
            pointerEvents: "none",
            zIndex: 0,
            willChange: "left, width",
          }}
        />
      )}

      {modes.map((m: Mode, i) => (
        <button
          key={m.id}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          onClick={() => changeMode(m)}
          className={cn(
            "relative z-10 flex-1 text-center mode-tab",
            mode === m.id && "active",
          )}
          style={{ background: "transparent", boxShadow: "none" }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
