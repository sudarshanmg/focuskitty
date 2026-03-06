/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              FocusKitty — App Configuration              ║
 * ║                                                          ║
 * ║  Single source of truth for:                             ║
 * ║  • Pricing & subscription tiers                          ║
 * ║  • Feature flags (free vs premium)                       ║
 * ║  • Payment provider settings                             ║
 * ║  • App-wide constants                                    ║
 * ╚══════════════════════════════════════════════════════════╝
 */

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────

export const PRICING = {
  /** Monthly subscription price in USD */
  monthly: {
    usd: 4.0,
    inr: 349, // ₹ shown to Indian users
    display_usd: "$4",
    display_inr: "₹349",
    period: "/ month",
  },

  /** Annual subscription (optional — enable when ready) */
  annual: {
    usd: 36.0, // $3/mo billed annually
    inr: 2999,
    display_usd: "$36",
    display_inr: "₹2,999",
    period: "/ year",
    savings_pct: 25, // shown as "Save 25%" badge
    enabled: false, // flip to true to show annual option
  },

  /** Currency detection — add more as needed */
  currency_by_locale: {
    IN: "INR",
    default: "USD",
  },
} as const;

// ─────────────────────────────────────────────
// PAYMENT PROVIDERS
// ─────────────────────────────────────────────

export const PAYMENT = {
  stripe: {
    enabled: true,
    /** Set in .env as NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY */
    publishable_key_env: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    /** Monthly price ID from your Stripe dashboard */
    price_id_monthly: "price_REPLACE_ME",
    price_id_annual: "price_REPLACE_ME",
    webhook_secret_env: "STRIPE_WEBHOOK_SECRET",
  },

  razorpay: {
    enabled: true, // flip to false to hide for non-Indian users
    key_id_env: "NEXT_PUBLIC_RAZORPAY_KEY_ID",
    webhook_secret_env: "RAZORPAY_WEBHOOK_SECRET",
    /** Razorpay plan IDs */
    plan_id_monthly: "plan_REPLACE_ME",
    plan_id_annual: "plan_REPLACE_ME",
  },
} as const;

// ─────────────────────────────────────────────
// FEATURE FLAGS
// ─────────────────────────────────────────────
//
// true  = available to everyone (free)
// false = locked behind Plus
//
// Changing a value here automatically locks/unlocks
// the feature everywhere in the app.

export const FEATURES = {
  // ── Always free ──────────────────────────────
  view_modes: { free: true }, // all 5 view modes
  themes: { free: true }, // all 5 themes
  custom_durations: { free: true }, // focus/break duration settings
  keyboard_shortcuts: { free: true }, // keyboard shortcuts
  session_chimes: { free: true }, // end-of-session chime
  auto_start: { free: true }, // auto-start next session

  // ── Premium features ─────────────────────────
  // Set free: true to unlock for everyone during beta/testing
  stats_daily: { free: false }, // daily focus stats
  stats_weekly: { free: false }, // weekly focus stats
  streaks: { free: false }, // focus streaks & milestones
  ambient_sounds: { free: false }, // background soundscapes
  session_history: { free: false }, // unlimited session log
  calendar_sync: { free: false }, // Google Calendar integration
  session_notes: { free: false }, // notes after each session
  export_data: { free: false }, // download CSV of history
} as const;

export type FeatureKey = keyof typeof FEATURES;

/** Returns true if the feature is accessible for the given plan */
export function canAccess(feature: FeatureKey, isPlusMember: boolean): boolean {
  return FEATURES[feature].free || isPlusMember;
}

// ─────────────────────────────────────────────
// LIMITS
// ─────────────────────────────────────────────

export const LIMITS = {
  /** Free users: how many sessions of history to store */
  session_history_free: 7, // last 7 sessions only
  session_history_plus: Infinity,

  /** Free users: how many days of stats to show */
  stats_days_free: 0, // no stats
  stats_days_plus: 365,

  /** Ambient sound tracks available per tier */
  ambient_tracks_free: 0,
  ambient_tracks_plus: Infinity, // all tracks
} as const;

// ─────────────────────────────────────────────
// PLUS PLAN MARKETING COPY
// ─────────────────────────────────────────────
// Edit these to update the paywall modal and pricing
// page without touching component code.

export const PLUS_COPY = {
  badge: "FocusKitty Plus",
  tagline: "Stats, soundscapes, streaks & more.",
  cta_primary: "Get FocusKitty Plus →",
  cta_cancel: "Maybe later",

  features: [
    { label: "Daily & weekly focus stats", icon: "BarChart2" },
    { label: "Focus streaks & milestones", icon: "Flame" },
    { label: "Ambient soundscapes", icon: "Music" },
    { label: "Unlimited session history", icon: "ClipboardList" },
    { label: "Google Calendar sync", icon: "Calendar" },
    { label: "Session notes", icon: "FileText" },
    { label: "Export data as CSV", icon: "Download" },
    { label: "Priority support", icon: "Zap" },
  ],
} as const;

// ─────────────────────────────────────────────
// APP METADATA
// ─────────────────────────────────────────────

export const APP_META = {
  name: "FocusKitty",
  tagline: "Your focus, finally.",
  description:
    "A beautifully minimal Pomodoro timer. Five view modes, five themes, zero distractions.",
  url: "https://focuskitty.vercel.app",
  support_email: "hello@focuskitty.app", // update when ready
} as const;
