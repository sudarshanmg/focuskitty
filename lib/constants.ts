import type { Theme, Mode } from "@/types/pomodoro";

export const THEMES: Theme[] = [
  { id: "chalk",    label: "Chalk",    swatch: "#e8d5c4" },
  { id: "midnight", label: "Midnight", swatch: "#0d0f14" },
  { id: "sage",     label: "Sage",     swatch: "#c8d8c8" },
  { id: "rose",     label: "Rose",     swatch: "#f2c4cc" },
  { id: "obsidian", label: "Obsidian", swatch: "#2a2a2a" },
];

export const MODES: Mode[] = [
  { id: "focus", label: "Focus",       seconds: 25 * 60, locked: false },
  { id: "short", label: "Short Break", seconds:  5 * 60, locked: false },
  { id: "long",  label: "Long Break",  seconds: 15 * 60, locked: false  },
];

export const SESSIONS_PER_CYCLE = 4;

export const RING_RADIUS       = 88;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function calcDashOffset(remaining: number, total: number): number {
  return RING_CIRCUMFERENCE * (remaining / total);
}

export function fmtTime(s: number): string {
  const m  = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}