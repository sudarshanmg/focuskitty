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
import type { ThemeId, ModeId, Mode } from "@/types/pomodoro";
import {
  MODES,
  SESSIONS_PER_CYCLE,
  fmtTime,
} from "@/lib/constants"

/* ── Shape ── */
interface PomodoroContextValue {
  /* theme */
  theme:    ThemeId;
  setTheme: (t: ThemeId) => void;

  /* mode */
  mode:        ModeId;
  currentMode: Mode;
  changeMode:  (m: Mode) => void;

  /* timer */
  running:     boolean;
  secondsLeft: number;
  pct:         number;
  toggle:      () => void;
  reset:       () => void;
  skip:        () => void;

  /* sessions */
  sessionsDone: number;

  /* paywall */
  showPaywall:    boolean;
  openPaywall:    () => void;
  closePaywall:   () => void;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

export function usePomodoroContext() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoroContext must be used inside PomodoroProvider");
  return ctx;
}

/* ── Provider ── */
export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState]       = useState<ThemeId>("chalk");
  const [mode, setMode]              = useState<ModeId>("focus");
  const [running, setRunning]        = useState(false);
  const [secondsLeft, setSecondsLeft]= useState(MODES[0].seconds);
  const [sessionsDone, setSessionsDone] = useState(0);
  const [showPaywall, setShowPaywall]= useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentMode = MODES.find((m) => m.id === mode)!;

  /* Apply theme attribute to <html> */
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
        setSecondsLeft((s: any) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (mode === "focus") {
              setSessionsDone((d) => (d + 1) % (SESSIONS_PER_CYCLE + 1));
            }
            return 0;
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
  }, [running, mode]);

  /* Browser tab title */
  useEffect(() => {
    document.title = running
      ? `${fmtTime(secondsLeft)} — Pomo`
      : "Pomo — Focus Timer";
  }, [secondsLeft, running]);

  const changeMode = useCallback((m: Mode) => {
    if (m.locked) { setShowPaywall(true); return; }
    setMode(m.id);
    setRunning(false);
    setSecondsLeft(m.seconds);
  }, []);

  const toggle = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(currentMode.seconds);
  }, [currentMode.seconds]);

  const skip = useCallback(() => {
    setRunning(false);
    if (mode === "focus") setSessionsDone((d) => (d + 1) % (SESSIONS_PER_CYCLE + 1));
    setSecondsLeft(currentMode.seconds);
  }, [mode, currentMode.seconds]);

  const pct = Math.round(
    ((currentMode.seconds - secondsLeft) / currentMode.seconds) * 100
  );

  return (
    <PomodoroContext.Provider value={{
      theme, setTheme,
      mode, currentMode, changeMode,
      running, secondsLeft, pct, toggle, reset, skip,
      sessionsDone,
      showPaywall,
      openPaywall:  () => setShowPaywall(true),
      closePaywall: () => setShowPaywall(false),
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}