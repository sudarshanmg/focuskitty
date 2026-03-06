"use client";

import {
  BarChart2,
  Flame,
  Music,
  ClipboardList,
  Calendar,
  FileText,
  Download,
  Zap,
  Star,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/components/pomodoro/PomodoroContext";
import { PLUS_COPY, PRICING } from "@/config/app.config";

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart2,
  Flame,
  Music,
  ClipboardList,
  Calendar,
  FileText,
  Download,
  Zap,
};

export function PaywallModal() {
  const { showPaywall, closePaywall } = usePomodoroContext();

  return (
    <Dialog open={showPaywall} onOpenChange={(open) => !open && closePaywall()}>
      <DialogContent>
        {/* Header icon */}
        <div
          className="mx-auto mb-1 flex items-center justify-center rounded-full"
          style={{
            width: 48,
            height: 48,
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          <Star size={22} strokeWidth={1.5} />
        </div>

        <DialogHeader>
          <DialogTitle>Unlock {PLUS_COPY.badge}</DialogTitle>
          <DialogDescription>{PLUS_COPY.tagline}</DialogDescription>
        </DialogHeader>

        {/* Feature list */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "1.25rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          {PLUS_COPY.features.map((f: { icon: string; label: string }) => {
            const Icon = ICON_MAP[f.icon] ?? Zap;
            return (
              <li
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={13} strokeWidth={2} />
                </span>
                {f.label}
              </li>
            );
          })}
        </ul>

        {/* Price */}
        <div
          style={{
            textAlign: "center",
            padding: "0.75rem 1rem",
            background: "var(--accent-soft)",
            borderRadius: 12,
            marginBottom: "1rem",
            border: "1px solid var(--accent-ring)",
          }}
        >
          <span
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            {PRICING.monthly.display_usd}
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginLeft: 4,
            }}
          >
            {PRICING.monthly.period}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            className="w-full font-semibold"
            style={{
              background: "var(--accent)",
              color: "var(--btn-text)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onClick={closePaywall}
          >
            {PLUS_COPY.cta_primary}
          </Button>
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={closePaywall}
          >
            {PLUS_COPY.cta_cancel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
