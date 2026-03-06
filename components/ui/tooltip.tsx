"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  delay?: number;
}

export function Tooltip({ content, children, delay = 500 }: TooltipProps) {
  const [mounted, setMounted] = useState(false); // in DOM
  const [visible, setVisible] = useState(false); // opacity/transform
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => {
      setMounted(true);
    }, delay);
  };

  const hide = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    // Fade out first, then unmount
    setVisible(false);
    hideTimer.current = setTimeout(() => setMounted(false), 180);
  };

  // Once mounted, measure and fade in
  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => {
      if (!triggerRef.current || !tooltipRef.current) return;
      const tr = triggerRef.current.getBoundingClientRect();
      const tt = tooltipRef.current.getBoundingClientRect();
      setCoords({
        x: tr.left + tr.width / 2 - tt.width / 2,
        y: tr.top - tt.height - 10,
      });
      // Second rAF to trigger transition from initial state
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{ display: "inline-flex" }}
      >
        {children}
      </div>

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              left: coords.x,
              top: coords.y,
              zIndex: 9999,
              pointerEvents: "none",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(4px)",
              transition: "opacity 0.15s ease, transform 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "5px 10px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-primary)" }}>
              {content}
            </span>
          </div>,
          document.body,
        )}
    </>
  );
}

interface KbdProps {
  children: React.ReactNode;
}
export function Kbd({ children }: KbdProps) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 4px",
        borderRadius: 4,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        fontSize: "0.68rem",
        fontFamily: "inherit",
        color: "var(--text-secondary)",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}
