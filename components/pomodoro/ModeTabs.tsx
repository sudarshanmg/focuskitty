"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import type { Mode } from "@/types/focuskitty";

interface PillRect {
  left: number;
  width: number;
}

function getRect(
  index: number,
  buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
): PillRect | null {
  const btn = buttonRefs.current[index];
  const container = containerRef.current;
  if (!btn || !container) return null;
  const cr = container.getBoundingClientRect();
  const br = btn.getBoundingClientRect();
  return { left: br.left - cr.left, width: br.width };
}

export function ModeTabs() {
  const { mode, changeMode, modes } = usePomodoroContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement>(null);
  const prevPill = useRef<PillRect>({ left: 0, width: 0 });
  const prevModeRef = useRef<string>(mode);
  const currentModeRef = useRef<string>(mode); // always up to date for ResizeObserver

  const [pill, setPill] = useState<PillRect>({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  // Keep currentModeRef in sync without triggering effects
  currentModeRef.current = mode;

  /* Initial placement — once after mount */
  useEffect(() => {
    const idx = modes.findIndex((m) => m.id === mode);
    const rect = getRect(idx, buttonRefs, containerRef);
    if (!rect) return;
    setPill(rect);
    prevPill.current = rect;
    prevModeRef.current = mode;
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ResizeObserver — snap pill on resize only, never on mode change */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const idx = modes.findIndex((m) => m.id === currentModeRef.current);
      const rect = getRect(idx, buttonRefs, containerRef);
      if (!rect) return;
      // Cancel any in-progress animation and snap
      pillRef.current?.getAnimations().forEach((a) => a.cancel());
      setPill(rect);
      prevPill.current = rect;
    });
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps — intentional, uses ref for current mode

  /* Jelly animation — only when mode actually changes */
  useEffect(() => {
    if (!ready) return;
    if (prevModeRef.current === mode) return;

    const idx = modes.findIndex((m) => m.id === mode);
    const next = getRect(idx, buttonRefs, containerRef);
    if (!next) return;

    const prev = { ...prevPill.current }; // snapshot before any mutation
    const el = pillRef.current;
    if (!el) return;

    // Update refs immediately so concurrent effects don't double-fire
    prevModeRef.current = mode;
    prevPill.current = next;

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

    // Sync React state after animation settles
    const t = setTimeout(() => setPill(next), 420);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, ready]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center mx-3 my-3 rounded-full p-1"
      style={{
        background: "var(--progress-track)",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.15s ease",
      }}
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
          style={{
            background: "transparent",
            boxShadow: "none",
            outline: "none",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
