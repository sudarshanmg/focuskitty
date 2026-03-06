export type ThemeId = "chalk" | "midnight" | "sage" | "rose" | "obsidian";
export type ModeId = "focus" | "short" | "long";

export interface Theme {
  id: ThemeId;
  label: string;
  swatch: string;
}

export interface Mode {
  id: ModeId;
  label: string;
  seconds: number;
  locked: boolean;
}

export interface Settings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsPerCycle: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsPerCycle: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

/* ── Session history ── */
export interface SessionRecord {
  id: string; // uuid
  completedAt: number; // unix ms
  durationSec: number; // actual seconds focused
  mode: ModeId;
}

export interface DayStat {
  date: string; // "YYYY-MM-DD"
  focusSec: number;
  sessions: number;
}
