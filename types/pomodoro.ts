export type ThemeId = "chalk" | "midnight" | "sage" | "rose" | "obsidian";
export type ModeId  = "focus" | "short" | "long";

export interface Theme {
  id:     ThemeId;
  label:  string;
  swatch: string;
}

export interface Mode {
  id:      ModeId;
  label:   string;
  seconds: number;
  locked:  boolean;
}