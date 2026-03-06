"use client";

import { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { KeyboardShortcutsModal } from "@/components/pomodoro/KeyboardShortcutsModal";

/* ── Small primitives ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.65rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        margin: "1.25rem 0 0.5rem",
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)" }} />;
}

interface MinuteInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

function MinuteInput({
  label,
  value,
  onChange,
  min = 1,
  max = 120,
}: MinuteInputProps) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        {[-1, 1].map((delta) => (
          <button
            key={delta}
            onClick={() =>
              onChange(Math.min(max, Math.max(min, value + delta)))
            }
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.15s ease",
            }}
          >
            {delta === -1 ? "−" : "+"}
          </button>
        ))}
        {/* value shown between buttons — reorder visually */}
      </div>
    </div>
  );
}

function MinuteRow({
  label,
  value,
  onChange,
  min = 1,
  max = 120,
}: MinuteInputProps) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.min(max, Math.max(min, value - 1)))}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          −
        </button>
        <span
          style={{
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            minWidth: "2.8rem",
            textAlign: "center",
          }}
        >
          {value}
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              marginLeft: 2,
            }}
          >
            m
          </span>
        </span>
        <button
          onClick={() => onChange(Math.min(max, Math.max(min, value + 1)))}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChecked: (v: boolean) => void;
}
function ToggleRow({ label, description, checked, onChecked }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex flex-col gap-0.5 pr-4">
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--text-primary)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            lineHeight: 1.4,
          }}
        >
          {description}
        </span>
      </div>
      <Switch checked={checked} onCheckedChange={onChecked} />
    </div>
  );
}

function GroupBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        borderRadius: 14,
        padding: "0 0.75rem",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Main panel ── */
export function SettingsPanel() {
  const {
    showSettings,
    closeSettings,
    settings,
    updateSettings,
    showShortcuts,
    openShortcuts,
    closeShortcuts,
  } = usePomodoroContext();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
    };
    if (showSettings) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showSettings, closeSettings]);

  /* Trap scroll */
  useEffect(() => {
    document.body.style.overflow = showSettings ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSettings]);

  const theme =
    typeof document !== "undefined"
      ? (document.documentElement.getAttribute("data-theme") ?? undefined)
      : undefined;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeSettings}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          opacity: showSettings ? 1 : 0,
          pointerEvents: showSettings ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        data-theme={theme}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 300,
          zIndex: 50,
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          transform: showSettings ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)",
          overflowY: "auto",
          padding: "1.5rem",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Settings
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={closeSettings}
          >
            <X size={13} />
          </Button>
        </div>
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginBottom: "0.25rem",
          }}
        >
          Customise your focus sessions
        </p>

        {/* Timer durations */}
        <SectionLabel>Timer durations</SectionLabel>
        <GroupBox>
          <MinuteRow
            label="Focus"
            value={settings.focusMinutes}
            onChange={(v) => updateSettings({ focusMinutes: v })}
            min={1}
            max={90}
          />
          <Divider />
          <MinuteRow
            label="Short Break"
            value={settings.shortBreakMinutes}
            onChange={(v) => updateSettings({ shortBreakMinutes: v })}
            min={1}
            max={30}
          />
          <Divider />
          <MinuteRow
            label="Long Break"
            value={settings.longBreakMinutes}
            onChange={(v) => updateSettings({ longBreakMinutes: v })}
            min={1}
            max={60}
          />
        </GroupBox>

        {/* Session cycle */}
        <SectionLabel>Session cycle</SectionLabel>
        <GroupBox>
          <MinuteRow
            label="Sessions before long break"
            value={settings.sessionsPerCycle}
            onChange={(v) => updateSettings({ sessionsPerCycle: v })}
            min={1}
            max={8}
          />
        </GroupBox>

        {/* Behaviour */}
        <SectionLabel>Behaviour</SectionLabel>
        <GroupBox>
          <ToggleRow
            label="Auto-start breaks"
            description="Break timer starts automatically when focus ends"
            checked={settings.autoStartBreaks}
            onChecked={(v) => updateSettings({ autoStartBreaks: v })}
          />
          <Divider />
          <ToggleRow
            label="Auto-start focus"
            description="Focus timer starts when break ends"
            checked={settings.autoStartFocus}
            onChecked={(v) => updateSettings({ autoStartFocus: v })}
          />
          <Divider />
          <ToggleRow
            label="Sound on session end"
            description="Play a soft chime when a session completes"
            checked={settings.soundEnabled}
            onChecked={(v) => updateSettings({ soundEnabled: v })}
          />
        </GroupBox>

        {/* Keyboard Shortcuts */}
        <SectionLabel>General</SectionLabel>
        <GroupBox>
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <Keyboard size={14} style={{ color: "var(--text-muted)" }} />
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                Keyboard Shortcuts
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={openShortcuts}
              style={{ fontSize: "0.72rem", height: 28, padding: "0 10px" }}
            >
              View
            </Button>
          </div>
        </GroupBox>
      </div>

      <KeyboardShortcutsModal open={showShortcuts} onClose={closeShortcuts} />
    </>
  );
}
