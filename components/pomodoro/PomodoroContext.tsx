"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { ThemeId, ModeId, Mode, Settings } from "@/types/focuskitty";
import { DEFAULT_SETTINGS } from "@/types/focuskitty";
import { fmtTime } from "@/lib/constants";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { canAccess } from "@/config/app.config";

function buildModes(s: Settings): Mode[] {
  return [
    {
      id: "focus",
      label: "Focus",
      seconds: s.focusMinutes * 60,
      locked: false,
    },
    {
      id: "short",
      label: "Short Break",
      seconds: s.shortBreakMinutes * 60,
      locked: false,
    },
    {
      id: "long",
      label: "Long Break",
      seconds: s.longBreakMinutes * 60,
      locked: false,
    },
  ];
}

interface PomodoroContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;

  modes: Mode[];
  mode: ModeId;
  currentMode: Mode;
  changeMode: (m: Mode) => void;

  running: boolean;
  secondsLeft: number;
  pct: number;
  toggle: () => void;
  reset: () => void;
  skip: () => void;

  sessionsDone: number;
  sessionsPerCycle: number;

  showPaywall: boolean;
  openPaywall: () => void;
  closePaywall: () => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  showSettings: boolean;
  openSettings: () => void;
  closeSettings: () => void;

  showShortcuts: boolean;
  openShortcuts: () => void;
  closeShortcuts: () => void;

  viewMode: "default" | "zen" | "compact" | "analog" | "minimal";
  setViewMode: (
    m: "default" | "zen" | "compact" | "analog" | "minimal",
  ) => void;

  isPlusMember: boolean;
  setIsPlusMember: (v: boolean) => void;

  showStats: boolean;
  openStats: () => void;
  closeStats: () => void;
  statsData: ReturnType<typeof useSessionHistory>;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function usePomodoroContext() {
  const ctx = useContext(PomodoroContext);
  if (!ctx)
    throw new Error("usePomodoroContext must be used inside PomodoroProvider");
  return ctx;
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("chalk");
  const [mode, setMode] = useState<ModeId>("focus");
  const [running, setRunning] = useState(false);
  const [sessionsDone, setSessionsDone] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState<
    "default" | "zen" | "compact" | "analog" | "minimal"
  >("default");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isPlusMember, setIsPlusMember] = useState(true);

  const statsData = useSessionHistory(isPlusMember);

  const modes = buildModes(settings);
  const currentMode = modes.find((m) => m.id === mode)!;

  const [secondsLeft, setSecondsLeft] = useState(currentMode.seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep stable ref to statsData.recordSession to avoid effect re-runs
  const recordSessionRef = useRef(statsData.recordSession);
  useEffect(() => {
    recordSessionRef.current = statsData.recordSession;
  }, [statsData.recordSession]);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/chime_1.mp3");
    audioRef.current.preload = "auto";
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Timer tick */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);

            if (settings.soundEnabled && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }

            // Record completed focus session
            if (mode === "focus") {
              recordSessionRef.current("focus", currentMode.seconds);
            }

            const isBreak = mode !== "focus";
            let nextModeId: ModeId;

            if (mode === "focus") {
              const nextDone = (sessionsDone + 1) % settings.sessionsPerCycle;
              const isLongBreak = nextDone === 0;
              nextModeId = isLongBreak ? "long" : "short";
              setSessionsDone((d) => (d + 1) % settings.sessionsPerCycle);
            } else {
              nextModeId = "focus";
            }

            const nextSeconds = buildModes(settings).find(
              (m) => m.id === nextModeId,
            )!.seconds;

            if (!isBreak && settings.autoStartBreaks) {
              setMode(nextModeId);
              setSecondsLeft(nextSeconds);
              setTimeout(() => setRunning(true), 800);
            } else if (isBreak && settings.autoStartFocus) {
              setMode(nextModeId);
              setSecondsLeft(nextSeconds);
              setTimeout(() => setRunning(true), 800);
            } else {
              setMode(nextModeId);
              setSecondsLeft(nextSeconds);
            }

            return nextSeconds;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, sessionsDone, settings, currentMode.seconds]);

  useEffect(() => {
    document.title = running
      ? `${fmtTime(secondsLeft)} — FocusKitty`
      : "FocusKitty — Focus Timer";
  }, [secondsLeft, running]);

  const changeMode = useCallback(
    (m: Mode) => {
      setMode(m.id);
      setRunning(false);
      setSecondsLeft(
        buildModes(settings).find((fm) => fm.id === m.id)!.seconds,
      );
    },
    [settings],
  );

  const toggle = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(currentMode.seconds);
  }, [currentMode.seconds]);

  const skip = useCallback(() => {
    setRunning(false);
    if (mode === "focus")
      setSessionsDone((d) => (d + 1) % settings.sessionsPerCycle);
    setSecondsLeft(currentMode.seconds);
  }, [mode, currentMode.seconds, settings.sessionsPerCycle]);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        const prevSeconds = buildModes(prev).find(
          (m) => m.id === mode,
        )!.seconds;
        const nextSeconds = buildModes(next).find(
          (m) => m.id === mode,
        )!.seconds;
        if (prevSeconds !== nextSeconds) {
          setRunning(false);
          setSecondsLeft(nextSeconds);
        }
        return next;
      });
    },
    [mode],
  );

  const pct = Math.round(
    ((currentMode.seconds - secondsLeft) / currentMode.seconds) * 100,
  );

  const openStats = useCallback(() => {
    if (canAccess("stats_daily", isPlusMember)) {
      setShowStats(true);
    } else {
      setShowPaywall(true);
    }
  }, [isPlusMember]);

  return (
    <PomodoroContext.Provider
      value={{
        theme,
        setTheme,
        modes,
        mode,
        currentMode: { ...currentMode },
        changeMode,
        running,
        secondsLeft,
        pct,
        toggle,
        reset,
        skip,
        sessionsDone,
        sessionsPerCycle: settings.sessionsPerCycle,
        showPaywall,
        openPaywall: () => setShowPaywall(true),
        closePaywall: () => setShowPaywall(false),
        settings,
        updateSettings,
        showSettings,
        openSettings: () => setShowSettings(true),
        closeSettings: () => setShowSettings(false),
        showShortcuts,
        openShortcuts: () => setShowShortcuts(true),
        closeShortcuts: () => setShowShortcuts(false),
        viewMode,
        setViewMode,
        isPlusMember,
        setIsPlusMember,
        showStats,
        openStats,
        closeStats: () => setShowStats(false),
        statsData,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}
