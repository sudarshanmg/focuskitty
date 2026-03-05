# 🍅 Pomo — Minimal Pomodoro Timer

A beautiful, minimalist Pomodoro timer built with **Next.js 16 + TypeScript + Tailwind CSS**.  
Apple-inspired UI · 5 color themes · Paywall-ready architecture for Plus features.

---

## ✦ Features (POC)

| Feature | Free | Plus (paywall) |
| --- | --- | --- |
| Focus timer (25 min) | ✅ | ✅ |
| Short break (5 min) | ✅ | ✅ |
| Long break (15 min) | ✅ | ✅ |
| 5 color themes | ✅ | ✅ |
| Session dots tracker | ✅ | ✅ |
| Custom durations | 🔒 | ✅ |
| Stats & history | 🔒 | ✅ |
| Ambient sounds | 🔒 | ✅ |

---

## 🚀 Setup

### 1. Clone / copy this folder

```bash
# If from a zip, just enter the folder:
cd pomodoro-app
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

---

## 🎨 Themes

Switch themes via the ☀ icon in the top-right corner.

| Theme | Vibe |
| --- | --- |
| **Chalk** | Warm off-white, terracotta accent |
| **Midnight** | Deep navy-black, periwinkle accent |
| **Sage** | Soft muted green, forest accent |
| **Rose** | Soft blush pink, rose accent |
| **Obsidian** | True black, greyscale accent |

---

## 📁 Project Structure

```text
pomodoro-app/
├── app/
│   ├── globals.css          # Theme tokens, button/card primitives
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Entry page
├── components/
│   └── PomodoroApp.tsx      # Full app component
├── lib/
│   └── utils.ts             # cn() helper
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 💳 Monetization (next steps)

The paywall modal is already wired up. To convert it to real payments:

1. Add [Stripe](https://stripe.com) or [Lemon Squeezy](https://lemonsqueezy.com)
2. Create a `/api/checkout` route in `app/api/`
3. Replace the `onClick` in `PaywallModal` with a checkout redirect
4. Gate locked features behind a `isPro` flag from your auth provider (e.g. Clerk, NextAuth)

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + CSS custom properties for theming
- **DM Sans + DM Mono** (Google Fonts)
- No UI library dependencies — custom Apple-style components

---

## 📦 Dependencies

```json
{
  "next": "14.2.5",
  "react": "^18",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "lucide-react": "^0.416.0",
  "tailwind-merge": "^2.4.0",
  "tailwindcss-animate": "^1.0.7"
}
```
