"use client";

import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { THEMES } from "@/lib/constants";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import type { ThemeId } from "@/types/pomodoro";

export function ThemePicker() {
  const { theme, setTheme } = usePomodoroContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Choose theme">
          <Sun size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40">
        <div className="flex flex-col gap-0.5">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-2.5 py-2 w-full text-left",
                  "transition-colors duration-150 cursor-pointer border-none font-[inherit]",
                  isActive
                    ? "bg-[var(--accent-soft)]"
                    : "bg-transparent hover:bg-[var(--progress-track)]"
                )}
              >
                {/* Swatch dot */}
                <span
                  className="flex-shrink-0 rounded-full"
                  style={{
                    width: 13,
                    height: 13,
                    background: t.swatch,
                    border: "1.5px solid var(--border)",
                    boxShadow: isActive ? "0 0 0 2px var(--accent)" : "none",
                    transition: "box-shadow 0.15s ease",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: isActive ? "var(--accent)" : "var(--text-primary)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}