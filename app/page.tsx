"use client";

import "./landing.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PRICING, PLUS_COPY } from "@/config/app.config";
import {
  Timer,
  Palette,
  Keyboard,
  Bell,
  SlidersHorizontal,
  Smartphone,
  Brain,
  TrendingUp,
  Zap,
  Sparkles,
  Target,
  Coffee,
  Leaf,
  BarChart2,
  Flame,
  Music,
  ClipboardList,
  Calendar,
  FileText,
  Download,
  type LucideIcon,
} from "lucide-react";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`fade-section ${inView ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── SVG Mode Previews ── */
function PreviewDefault() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect
        x="4"
        y="3"
        width="40"
        height="30"
        rx="4"
        fill="var(--bg-elevated)"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <rect
        x="4"
        y="3"
        width="40"
        height="7"
        rx="4"
        fill="var(--progress-track)"
        opacity="0.5"
      />
      <circle
        cx="24"
        cy="22"
        r="8"
        stroke="var(--progress-track)"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="24"
        cy="22"
        r="8"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="25 25"
        strokeLinecap="round"
        strokeDashoffset="8"
      />
      <rect
        x="19"
        y="20"
        width="10"
        height="2.5"
        rx="1"
        fill="var(--text-muted)"
        opacity="0.5"
      />
    </svg>
  );
}
function PreviewZen() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect width="48" height="36" rx="3" fill="var(--bg)" />
      <circle
        cx="24"
        cy="17"
        r="11"
        stroke="var(--progress-track)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="24"
        cy="17"
        r="11"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="35 35"
        strokeLinecap="round"
        strokeDashoffset="10"
      />
      <rect
        x="18"
        y="15"
        width="12"
        height="3"
        rx="1"
        fill="var(--text-primary)"
        opacity="0.4"
      />
      {/* 3 session dots — middle one is current/accent */}
      <circle cx="20" cy="31" r="1.2" fill="var(--progress-track)" />
      <circle cx="24" cy="31" r="1.2" fill="var(--accent)" />
      <circle cx="28" cy="31" r="1.2" fill="var(--progress-track)" />
    </svg>
  );
}
function PreviewCompact() {
  // pill: x=6..42, cy=24.5 — ring left, label center, play button right with padding
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect width="48" height="36" rx="3" fill="var(--bg)" opacity="0.3" />
      {/* floating pill */}
      <rect
        x="6"
        y="18"
        width="36"
        height="13"
        rx="6.5"
        fill="var(--bg-card)"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      {/* mini progress ring */}
      <circle
        cx="16"
        cy="24.5"
        r="4"
        stroke="var(--progress-track)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="16"
        cy="24.5"
        r="4"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="12 13"
        strokeLinecap="round"
        strokeDashoffset="4"
      />
      {/* time label */}
      <rect
        x="22"
        y="22"
        width="9"
        height="2.5"
        rx="1"
        fill="var(--text-primary)"
        opacity="0.45"
      />
      <rect
        x="22"
        y="26"
        width="6"
        height="1.5"
        rx="0.75"
        fill="var(--text-muted)"
        opacity="0.3"
      />
      {/* play button — inset from right edge */}
      <circle cx="37" cy="24.5" r="3.5" fill="var(--accent)" />
      <polygon
        points="36.1,23.1 36.1,25.9 39,24.5"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}
function PreviewAnalog() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect width="48" height="36" rx="3" fill="var(--bg)" />
      <circle
        cx="24"
        cy="18"
        r="13"
        fill="none"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <path
        d="M24,18 L24,5 A13,13 0 0,1 35.26,24.5 Z"
        fill="var(--accent-soft)"
      />
      <path
        d="M24,5 A13,13 0 0,1 35.26,24.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="18" r="8" fill="var(--bg-card)" />
      <line
        x1="24"
        y1="18"
        x2="29"
        y2="11"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="18" r="1.5" fill="var(--accent)" />
    </svg>
  );
}
function PreviewMinimal() {
  return (
    <svg viewBox="0 0 48 36" fill="none" width="100%" height="100%">
      <rect width="48" height="36" rx="3" fill="var(--bg)" />
      <rect
        x="11"
        y="12"
        width="10"
        height="6"
        rx="1.5"
        fill="var(--text-primary)"
        opacity="0.35"
      />
      <rect
        x="23"
        y="12"
        width="2"
        height="6"
        rx="1"
        fill="var(--accent)"
        opacity="0.6"
      />
      <rect
        x="27"
        y="12"
        width="10"
        height="6"
        rx="1.5"
        fill="var(--text-primary)"
        opacity="0.35"
      />
      <rect
        x="10"
        y="25"
        width="28"
        height="1.5"
        rx="1"
        fill="var(--progress-track)"
      />
      <rect x="10" y="25" width="16" height="1.5" rx="1" fill="var(--accent)" />
    </svg>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 20,
        padding: "1.5rem",
        transition:
          "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          marginBottom: "0.75rem",
          background: "var(--accent-soft)",
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={17} strokeWidth={1.75} />
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.9rem",
          color: "var(--text-primary)",
          marginBottom: "0.35rem",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </div>
    </div>
  );
}

type PricingFeature = string | { icon: LucideIcon; label: string };

function PricingCard({
  plan,
  price,
  period,
  features,
  cta,
  ctaHref,
  accent = false,
}: {
  plan: string;
  price: string;
  period: string;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
  accent?: boolean;
}) {
  return (
    <div className={`pricing-card ${accent ? "pricing-card--accent" : ""}`}>
      {accent && (
        <div
          style={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--accent)",
            color: "var(--btn-text)",
            borderRadius: 999,
            padding: "3px 14px",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent ? "var(--accent)" : "var(--text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          {plan}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            {price}
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {period}
          </span>
        </div>
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {features.map((f, i) => {
          const isRich = typeof f === "object";
          const Icon = isRich ? f.icon : null;
          const label = isRich ? f.label : f;
          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
              }}
            >
              {Icon ? (
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={11} strokeWidth={2} />
                </span>
              ) : (
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
              )}
              {label}
            </li>
          );
        })}
      </ul>
      <a href={ctaHref} style={{ textDecoration: "none" }}>
        <button
          className={`pricing-btn ${accent ? "pricing-btn--accent" : ""}`}
        >
          {cta}
        </button>
      </a>
    </div>
  );
}

const VIEW_MODES = [
  {
    label: "Default",
    desc: "Clean card with ring progress and session dots",
    preview: <PreviewDefault />,
  },
  {
    label: "Zen",
    desc: "Distraction-free overlay — just the timer and controls",
    preview: <PreviewZen />,
  },
  {
    label: "Compact",
    desc: "Draggable floating pill — stays visible while you work",
    preview: <PreviewCompact />,
  },
  {
    label: "Analog",
    desc: "Clock face with pie sweep and tick marks",
    preview: <PreviewAnalog />,
  },
  {
    label: "Minimal",
    desc: "Pure typography — giant countdown, nothing else",
    preview: <PreviewMinimal />,
  },
];

const FEATURES = [
  {
    icon: Timer,
    title: "5 View Modes",
    desc: "Default, Zen, Compact, Analog, Minimal — switch instantly or use keyboard shortcuts.",
  },
  {
    icon: Palette,
    title: "5 Themes",
    desc: "Chalk, Midnight, Sage, Rose, Obsidian — crafted to reduce visual fatigue.",
  },
  {
    icon: Keyboard,
    title: "Keyboard First",
    desc: "Every action has a shortcut. Space to play, R to reset, N to skip, 1–5 for views.",
  },
  {
    icon: Bell,
    title: "Session Chimes",
    desc: "A soft chime signals every session end. Toggle on or off anytime.",
  },
  {
    icon: SlidersHorizontal,
    title: "Fully Customisable",
    desc: "Set your own focus and break durations. Configure auto-start and session cycles.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    desc: "Responsive across desktop, tablet, and mobile. Feels native on every screen.",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMode, setActiveMode] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className={`nav ${mounted && scrolled ? "nav--scrolled" : ""}`}>
        <span className="nav__logo">focuskitty.</span>
        <div className="nav__links">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              className="nav__link"
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
            >
              {item}
            </a>
          ))}
        </div>
        <a href="/app" className="btn-accent nav__cta">
          Open App →
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__badge">
          <Sparkles size={11} /> Minimal Pomodoro Timer
        </div>
        <h1 className="hero__h1">
          Your focus,
          <br />
          <span className="accent">finally.</span>
        </h1>
        <p className="hero__sub">
          A beautifully minimal timer built around the Pomodoro Technique. Five
          view modes, five themes, zero distractions.
        </p>
        <div className="hero__ctas">
          <a href="/app" className="btn-accent btn-lg">
            Start focusing — it&apos;s free
          </a>
          <a href="#how-it-works" className="btn-ghost btn-lg">
            How it works ↓
          </a>
        </div>

        {/* App mockup */}
        <div className="mockup-wrap">
          <div className="mockup">
            <div className="mockup__bar">
              <span className="mockup__logo">focuskitty.</span>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background:
                        i === 2 ? "var(--accent-soft)" : "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mockup__tabs">
              {["Focus", "Short Break", "Long Break"].map((t, i) => (
                <div
                  key={t}
                  className={`mockup__tab ${i === 0 ? "mockup__tab--active" : ""}`}
                >
                  {t}
                </div>
              ))}
            </div>
            <div className="mockup__ring-wrap">
              <div className="mockup__ring">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 220 220"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    strokeWidth="5"
                    stroke="var(--progress-track)"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    strokeWidth="5"
                    stroke="var(--accent)"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * 0.35}`}
                  />
                </svg>
                <div className="mockup__time">
                  <span>16:15</span>
                  <span className="mockup__mode-label">focus</span>
                </div>
              </div>
              <div className="mockup__dots">
                {[true, true, false, false].map((d, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: d ? "var(--accent)" : "var(--progress-track)",
                    }}
                  />
                ))}
                <span className="mockup__session-txt">session 3 of 4</span>
              </div>
              <div className="mockup__controls">
                {[
                  ["↺", false],
                  ["⏸ Pause", true],
                  ["⏭", false],
                ].map(([label, primary], i) => (
                  <div
                    key={i}
                    className={primary ? "mockup__play" : "mockup__icon-btn"}
                  >
                    {label as string}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="hero__footnote">
            No sign-up required. Open the app and start.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="lp-section">
        <Section>
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">The Technique</p>
              <h2 className="section-h2">How Pomodoro works</h2>
            </div>
            <div className="two-col">
              <div className="two-col__text">
                <p className="body-text">
                  The Pomodoro Technique was developed by Francesco Cirillo in
                  the late 1980s. The idea is simple — work in focused sprints,
                  separated by short rests.
                </p>
                <p className="body-text">
                  Our brains aren&apos;t built for hours of sustained focus.
                  Breaking work into 25-minute chunks with deliberate breaks
                  reduces mental fatigue and keeps you sharp all day.
                </p>
                <div className="benefit-list">
                  {(
                    [
                      [Brain, "Reduces decision fatigue"],
                      [TrendingUp, "Builds deep focus habit"],
                      [Zap, "Prevents burnout"],
                    ] as [LucideIcon, string][]
                  ).map(([Icon, text]) => (
                    <div key={text} className="benefit-item">
                      <span
                        style={{
                          color: "var(--accent)",
                          display: "flex",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={15} strokeWidth={1.75} />
                      </span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="two-col__diagram">
                <p className="diagram-label">One full cycle</p>
                <div className="cycle-diagram">
                  {(
                    [
                      {
                        label: "Focus",
                        duration: "25 min",
                        Icon: Target,
                        accent: true,
                      },
                      {
                        label: "Short Break",
                        duration: "5 min",
                        Icon: Coffee,
                        accent: false,
                      },
                      {
                        label: "Focus",
                        duration: "25 min",
                        Icon: Target,
                        accent: true,
                      },
                      {
                        label: "Short Break",
                        duration: "5 min",
                        Icon: Coffee,
                        accent: false,
                      },
                      {
                        label: "Long Break",
                        duration: "15 min",
                        Icon: Leaf,
                        accent: false,
                      },
                    ] as {
                      label: string;
                      duration: string;
                      Icon: LucideIcon;
                      accent: boolean;
                    }[]
                  ).map((s, i, arr) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        className={`cycle-step ${s.accent ? "cycle-step--accent" : ""}`}
                      >
                        <span
                          style={{
                            color: s.accent
                              ? "var(--accent)"
                              : "var(--text-muted)",
                            display: "flex",
                          }}
                        >
                          <s.Icon size={16} strokeWidth={1.5} />
                        </span>
                        <span
                          className={`cycle-step__label ${s.accent ? "cycle-step__label--accent" : ""}`}
                        >
                          {s.label}
                        </span>
                        <span className="cycle-step__dur">{s.duration}</span>
                      </div>
                      {i < arr.length - 1 && <div className="cycle-arrow" />}
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginLeft: 4,
                    }}
                  >
                    <div className="cycle-arrow" />
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      repeat
                    </span>
                  </div>
                </div>
                <p className="diagram-footnote">
                  After 4 focus sessions, take a longer 15-min break to fully
                  recharge.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ── Features ── */}
      <section id="features" className="lp-section lp-section--alt">
        <Section>
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">What you get</p>
              <h2 className="section-h2">Built for focus</h2>
            </div>
            <div className="features-grid">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── View modes ── */}
      <section className="lp-section">
        <Section>
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Five ways to focus</p>
              <h2 className="section-h2">Your timer, your way</h2>
            </div>
            <div className="mode-tabs">
              {VIEW_MODES.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => setActiveMode(i)}
                  className={`mode-tab ${activeMode === i ? "mode-tab--active" : ""}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="mode-preview">
              <div className="mode-preview__thumb">
                {VIEW_MODES[activeMode].preview}
              </div>
              <div className="mode-preview__info">
                <div className="mode-preview__name">
                  {VIEW_MODES[activeMode].label}
                </div>
                <div className="mode-preview__desc">
                  {VIEW_MODES[activeMode].desc}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="lp-section lp-section--alt">
        <Section>
          <div className="container container--narrow">
            <div className="section-header">
              <p className="section-eyebrow">Simple pricing</p>
              <h2 className="section-h2">Start free, upgrade when ready</h2>
              <p className="section-sub">
                No credit card required for free tier.
              </p>
            </div>
            <div className="pricing-grid">
              <PricingCard
                plan="Free"
                price="$0"
                period="forever"
                features={[
                  "All 5 view modes",
                  "All 5 themes",
                  "Custom timer durations",
                  "Keyboard shortcuts",
                  "Session chimes",
                  "Auto-start sessions",
                ]}
                cta="Start for free"
                ctaHref="/app"
              />
              <PricingCard
                plan={PLUS_COPY.badge}
                price={PRICING.monthly.display_usd}
                period={PRICING.monthly.period}
                accent
                features={[
                  { icon: BarChart2, label: "Daily & weekly focus stats" },
                  { icon: Flame, label: "Focus streaks & milestones" },
                  { icon: Music, label: "Ambient soundscapes" },
                  { icon: ClipboardList, label: "Unlimited session history" },
                  { icon: Calendar, label: "Google Calendar sync" },
                  { icon: FileText, label: "Session notes" },
                  { icon: Download, label: "Export data as CSV" },
                  { icon: Zap, label: "Priority support" },
                ]}
                cta={PLUS_COPY.cta_primary}
                ctaHref="/app"
              />
            </div>
          </div>
        </Section>
      </section>

      {/* ── Final CTA ── */}
      <section className="lp-section">
        <Section>
          <div className="container" style={{ textAlign: "center" }}>
            <h2 className="section-h2">Ready to focus?</h2>
            <p
              className="body-text"
              style={{ maxWidth: 480, margin: "0 auto 2rem" }}
            >
              No account needed. Open the app and start your first session in
              seconds.
            </p>
            <Link href="/app" className="btn-accent btn-lg">
              Open FocusKitty — free →
            </Link>
          </div>
        </Section>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <span className="nav__logo">focuskitty.</span>
        <p className="footer__copy" suppressHydrationWarning>
          © {new Date().getFullYear()} FocusKitty. Made for focused humans.
        </p>
        <div className="footer__links">
          {[
            ["Privacy", "#"],
            ["Terms", "#"],
            ["Open App", "/app"],
          ].map(([l, h]) => (
            <a key={l} href={h} className="footer__link">
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
