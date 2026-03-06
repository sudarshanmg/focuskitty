"use client";

import { X, TrendingUp, Clock, Flame, Calendar } from "lucide-react";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { fmtFocusTime, fmtDayLabel } from "@/hooks/useSessionHistory";
import type { DayStat } from "@/types/focuskitty";

/* ── Bar chart ── */
function WeekChart({ days }: { days: DayStat[] }) {
  const max = Math.max(...days.map((d) => d.focusSec), 1);

  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}
    >
      {days.map((d) => {
        const pct = d.focusSec / max;
        const isToday = d.date === new Date().toISOString().slice(0, 10);
        const isEmpty = d.focusSec === 0;

        return (
          <div
            key={d.date}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              height: "100%",
            }}
          >
            {/* bar */}
            <div
              style={{
                flex: 1,
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <div
                title={`${fmtDayLabel(d.date)}: ${fmtFocusTime(d.focusSec)}`}
                style={{
                  width: "100%",
                  height: isEmpty ? 3 : `${Math.max(pct * 100, 8)}%`,
                  borderRadius: 4,
                  background: isToday
                    ? "var(--accent)"
                    : isEmpty
                      ? "var(--progress-track)"
                      : "var(--accent-soft)",
                  border: isToday
                    ? "none"
                    : isEmpty
                      ? "none"
                      : "1px solid var(--accent-ring)",
                  transition: "height 0.4s ease",
                }}
              />
            </div>
            {/* label */}
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: isToday ? 700 : 400,
                color: isToday ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {fmtDayLabel(d.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Stat tile ── */
function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "var(--accent)",
        }}
      >
        <Icon size={13} strokeWidth={2} />
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── Main panel ── */
export function StatsPanel() {
  const { showStats, closeStats, statsData } = usePomodoroContext();
  const {
    todayFocusSec,
    todaySessions,
    weekFocusSec,
    weekSessions,
    totalFocusSec,
    last7Days,
    bestDay,
  } = statsData;

  if (!showStats) return null;

  const hasData = totalFocusSec > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeStats}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
          animation: "fade-in 0.2s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: "clamp(300px, 90vw, 420px)",
          maxHeight: "85vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          boxShadow: "var(--shadow-lg)",
          animation: "scale-in 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.25rem 0",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "var(--accent-soft)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={15} strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                }}
              >
                Focus Stats
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                Last 7 days
              </div>
            </div>
          </div>
          <button
            onClick={closeStats}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          style={{
            padding: "0 1.25rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Empty state */}
          {!hasData ? (
            <div
              style={{
                textAlign: "center",
                padding: "2.5rem 1rem",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.75rem",
                  opacity: 0.4,
                }}
              >
                <TrendingUp
                  size={36}
                  strokeWidth={1}
                  style={{ margin: "0 auto" }}
                />
              </div>
              No focus sessions yet.
              <br />
              Complete your first session to see stats.
            </div>
          ) : (
            <>
              {/* Bar chart */}
              <div
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    This week
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {fmtFocusTime(weekFocusSec)}
                  </span>
                </div>
                <WeekChart days={last7Days} />
              </div>

              {/* Stat tiles */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <StatTile
                  icon={Clock}
                  label="Today"
                  value={fmtFocusTime(todayFocusSec)}
                  sub={`${todaySessions} session${todaySessions !== 1 ? "s" : ""}`}
                />
                <StatTile
                  icon={Calendar}
                  label="This week"
                  value={fmtFocusTime(weekFocusSec)}
                  sub={`${weekSessions} sessions`}
                />
                <StatTile
                  icon={Flame}
                  label="Best day"
                  value={fmtFocusTime(bestDay.focusSec)}
                  sub={bestDay.date ? fmtDayLabel(bestDay.date) : "—"}
                />
                <StatTile
                  icon={TrendingUp}
                  label="All time"
                  value={fmtFocusTime(totalFocusSec)}
                  sub={`${statsData.sessions.filter((s) => s.mode === "focus").length} total`}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
