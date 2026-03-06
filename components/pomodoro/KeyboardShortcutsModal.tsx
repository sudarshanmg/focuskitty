"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/tooltip";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { action: "Play / Pause", keys: ["Space"] },
  { action: "Reset timer", keys: ["R"] },
  { action: "Next session", keys: ["N"] },
  { action: "Zen mode", keys: ["Z"] },
  { action: "Focus mode", keys: ["1"] },
  { action: "Short Break", keys: ["2"] },
  { action: "Long Break", keys: ["3"] },
];

export function KeyboardShortcutsModal({ open, onClose }: Props) {
  const theme =
    typeof document !== "undefined"
      ? (document.documentElement.getAttribute("data-theme") ?? undefined)
      : undefined;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        data-theme={theme}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: open
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.95)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition:
            "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
          zIndex: 61,
          width: "clamp(280px, 90vw, 360px)",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          boxShadow: "var(--shadow-lg)",
          padding: "1.5rem",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Keyboard Shortcuts
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X size={13} />
          </Button>
        </div>

        {/* Shortcut rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {SHORTCUTS.map(({ action, keys }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.55rem 0.6rem",
                borderRadius: 10,
                background: i % 2 === 0 ? "var(--bg-elevated)" : "transparent",
              }}
            >
              <span
                style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}
              >
                {action}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          Shortcuts are disabled while settings is open
        </p>
      </div>
    </>
  );
}
