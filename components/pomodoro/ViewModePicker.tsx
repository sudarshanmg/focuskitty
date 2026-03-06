"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";

type ViewModeId = "default" | "zen" | "compact" | "analog" | "minimal";

interface ViewModeOption {
  id: ViewModeId;
  label: string;
  shortcut: string;
  description: string;
  preview: React.ReactNode;
}

/* ── Tiny SVG previews for each mode ── */
function PreviewDefault() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      {/* Card */}
      <rect
        x="4"
        y="3"
        width="40"
        height="30"
        rx="4"
        fill="var(--bg-elevated)"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      {/* Top bar */}
      <rect
        x="4"
        y="3"
        width="40"
        height="7"
        rx="4"
        fill="var(--progress-track)"
        opacity="0.5"
      />
      {/* Ring */}
      <circle
        cx="24"
        cy="22"
        r="8"
        stroke="var(--progress-track)"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="24"
        cy="22"
        r="8"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="25 25"
        strokeLinecap="round"
        strokeDashoffset="8"
      />
      {/* Time text hint */}
      <rect
        x="19"
        y="20"
        width="10"
        height="2.5"
        rx="1"
        fill="var(--text-muted)"
        opacity="0.5"
      />
    </svg>
  );
}

function PreviewZen() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      {/* Full bg */}
      <rect x="0" y="0" width="48" height="36" rx="3" fill="var(--bg)" />
      {/* Large ring */}
      <circle
        cx="24"
        cy="18"
        r="11"
        stroke="var(--progress-track)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="24"
        cy="18"
        r="11"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="35 35"
        strokeLinecap="round"
        strokeDashoffset="10"
      />
      {/* Time */}
      <rect
        x="18"
        y="16"
        width="12"
        height="3"
        rx="1"
        fill="var(--text-primary)"
        opacity="0.4"
      />
      {/* Dots */}
      <circle cx="20" cy="31" r="1.2" fill="var(--accent)" />
      <circle cx="24" cy="31" r="1.2" fill="var(--progress-track)" />
      <circle cx="28" cy="31" r="1.2" fill="var(--progress-track)" />
    </svg>
  );
}

function PreviewCompact() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      {/* Bg */}
      <rect
        x="0"
        y="0"
        width="48"
        height="36"
        rx="3"
        fill="var(--bg)"
        opacity="0.3"
      />
      {/* Pill in corner */}
      <rect
        x="8"
        y="18"
        width="32"
        height="13"
        rx="6.5"
        fill="var(--bg-card)"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      {/* Mini ring */}
      <circle
        cx="18"
        cy="24.5"
        r="4"
        stroke="var(--progress-track)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="18"
        cy="24.5"
        r="4"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="12 13"
        strokeLinecap="round"
        strokeDashoffset="4"
      />
      {/* Time */}
      <rect
        x="24"
        y="22.5"
        width="8"
        height="2"
        rx="1"
        fill="var(--text-primary)"
        opacity="0.5"
      />
      <rect
        x="24"
        y="26"
        width="5"
        height="1.5"
        rx="0.75"
        fill="var(--text-muted)"
        opacity="0.4"
      />
      {/* Play btn */}
      <circle cx="36" cy="24.5" r="3.5" fill="var(--accent)" />
      <polygon
        points="35.2,23.2 35.2,25.8 38,24.5"
        fill="var(--btn-text, white)"
        opacity="0.9"
      />
    </svg>
  );
}

function PreviewAnalog() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect x="0" y="0" width="48" height="36" rx="3" fill="var(--bg)" />
      {/* Clock outer */}
      <circle
        cx="24"
        cy="18"
        r="13"
        fill="none"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      {/* Pie fill */}
      <path
        d="M24,18 L24,5 A13,13 0 0,1 35.26,24.5 Z"
        fill="var(--accent-soft)"
      />
      {/* Arc */}
      <path
        d="M24,5 A13,13 0 0,1 35.26,24.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Inner face */}
      <circle cx="24" cy="18" r="8" fill="var(--bg-card)" />
      {/* Hand */}
      <line
        x1="24"
        y1="18"
        x2="29"
        y2="11"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Center */}
      <circle cx="24" cy="18" r="1.5" fill="var(--accent)" />
    </svg>
  );
}

function PreviewMinimal() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect x="0" y="0" width="48" height="36" rx="3" fill="var(--bg)" />
      {/* Big time */}
      <rect
        x="7"
        y="10"
        width="34"
        height="10"
        rx="2"
        fill="var(--text-primary)"
        opacity="0.15"
      />
      <rect
        x="11"
        y="12"
        width="10"
        height="6"
        rx="1.5"
        fill="var(--text-primary)"
        opacity="0.35"
      />
      <rect
        x="23"
        y="12"
        width="2"
        height="6"
        rx="1"
        fill="var(--accent)"
        opacity="0.6"
      />
      <rect
        x="27"
        y="12"
        width="10"
        height="6"
        rx="1.5"
        fill="var(--text-primary)"
        opacity="0.35"
      />
      {/* Progress bar */}
      <rect
        x="10"
        y="25"
        width="28"
        height="1.5"
        rx="1"
        fill="var(--progress-track)"
      />
      <rect x="10" y="25" width="16" height="1.5" rx="1" fill="var(--accent)" />
    </svg>
  );
}

const VIEW_MODES: ViewModeOption[] = [
  {
    id: "default",
    label: "Default",
    shortcut: "1",
    description: "Card with ring",
    preview: <PreviewDefault />,
  },
  {
    id: "zen",
    label: "Zen",
    shortcut: "2",
    description: "Distraction-free",
    preview: <PreviewZen />,
  },
  {
    id: "compact",
    label: "Compact",
    shortcut: "3",
    description: "Floating pill",
    preview: <PreviewCompact />,
  },
  {
    id: "analog",
    label: "Analog",
    shortcut: "4",
    description: "Clock face",
    preview: <PreviewAnalog />,
  },
  {
    id: "minimal",
    label: "Minimal",
    shortcut: "5",
    description: "Typography only",
    preview: <PreviewMinimal />,
  },
];

export function ViewModePicker() {
  const { viewMode, setViewMode } = usePomodoroContext();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (id: ViewModeId) => {
    setViewMode(id);
    // Auto-close after 3s
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 2000);
  };

  // Clean up on unmount
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o && closeTimer.current) clearTimeout(closeTimer.current);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Choose view mode">
          <LayoutTemplate size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-52" style={{ padding: "0.6rem" }}>
        {/* Header */}
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            padding: "0.2rem 0.4rem 0.5rem",
          }}
        >
          View mode
        </p>

        <div className="flex flex-col gap-0.5">
          {VIEW_MODES.map((m) => {
            const isActive = viewMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-2 py-2 w-full text-left border-none font-[inherit]",
                  "transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "bg-[var(--accent-soft)]"
                    : "bg-transparent hover:bg-[var(--progress-track)]",
                )}
              >
                {/* Preview thumbnail */}
                <div
                  style={{
                    width: 44,
                    height: 33,
                    flexShrink: 0,
                    borderRadius: 6,
                    border: isActive
                      ? "1.5px solid var(--accent)"
                      : "1px solid var(--border)",
                    overflow: "hidden",
                    background: "var(--bg)",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  {m.preview}
                </div>

                {/* Label + description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--accent)" : "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {m.description}
                  </div>
                </div>

                {/* Shortcut badge */}
                <Kbd>{m.shortcut}</Kbd>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
