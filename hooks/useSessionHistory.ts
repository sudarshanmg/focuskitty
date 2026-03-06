"use client";

import { useState, useCallback, useEffect } from "react";
import type { SessionRecord, DayStat, ModeId } from "@/types/focuskitty";
import { LIMITS } from "@/config/app.config";

const STORAGE_KEY = "fk_sessions_v1";

function toDateStr(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch {
    return [];
  }
}

function save(records: SessionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export function useSessionHistory(isPlusMember: boolean) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setSessions(load());
  }, []);

  const recordSession = useCallback(
    (mode: ModeId, durationSec: number) => {
      if (mode !== "focus") return; // only track focus sessions

      const record: SessionRecord = {
        id: newId(),
        completedAt: Date.now(),
        durationSec,
        mode,
      };

      setSessions((prev) => {
        const limit = isPlusMember
          ? LIMITS.session_history_plus
          : LIMITS.session_history_free;
        const next = [record, ...prev].slice(
          0,
          limit === Infinity ? undefined : limit,
        );
        save(next);
        return next;
      });
    },
    [isPlusMember],
  );

  /* ── Derived stats ── */

  // Total focus time today (seconds)
  const todayStr = toDateStr(Date.now());
  const todayFocusSec = sessions
    .filter((s) => s.mode === "focus" && toDateStr(s.completedAt) === todayStr)
    .reduce((acc, s) => acc + s.durationSec, 0);

  const todaySessions = sessions.filter(
    (s) => s.mode === "focus" && toDateStr(s.completedAt) === todayStr,
  ).length;

  // Last 7 days stats
  const last7Days: DayStat[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = toDateStr(d.getTime());
    const daySessions = sessions.filter(
      (s) => s.mode === "focus" && toDateStr(s.completedAt) === date,
    );
    return {
      date,
      focusSec: daySessions.reduce((acc, s) => acc + s.durationSec, 0),
      sessions: daySessions.length,
    };
  });

  // Weekly total
  const weekFocusSec = last7Days.reduce((acc, d) => acc + d.focusSec, 0);
  const weekSessions = last7Days.reduce((acc, d) => acc + d.sessions, 0);

  // All-time total
  const totalFocusSec = sessions
    .filter((s) => s.mode === "focus")
    .reduce((acc, s) => acc + s.durationSec, 0);

  // Best day in last 7
  const bestDay = last7Days.reduce(
    (best, d) => (d.focusSec > best.focusSec ? d : best),
    { date: "", focusSec: 0, sessions: 0 },
  );

  return {
    sessions,
    recordSession,
    // daily
    todayFocusSec,
    todaySessions,
    // weekly
    last7Days,
    weekFocusSec,
    weekSessions,
    // all time
    totalFocusSec,
    // best
    bestDay,
  };
}

/* ── Formatting helpers (exported for use in UI) ── */
export function fmtFocusTime(seconds: number): string {
  if (seconds === 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function fmtDayLabel(dateStr: string): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date(dateStr + "T12:00:00"); // noon to avoid timezone issues
  return days[d.getDay()];
}
