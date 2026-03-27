# Vapor: The Ephemeral Lens

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"Nothing Lasts. Focus on what matters. Let the rest evaporate."**

Vapor is an intentional, anti-hoarding reader designed for the age of information overload. It turns your "reading graveyard" of bookmarked articles into a living, breathing **Feed** where knowledge has a half-life. 

Pasted URLs are instantly transformed into high-signal, editorial-grade summaries. If you don't engage, they vanish. No archives. No clutter. Just pure focus.

---

## 🌪️ The Philosophy: "Gallery, not Graveyard"

Digital hoarding is a cognitive tax. Vapor solves this through **Enforced Ephemerality**:
- **7-Day Decay**: Every item in your feed has a 7-day lease on life.
- **Visual Decay**: A neon "Decay Bar" provides real-time feedback on how long an item has left.
- **Summary-First**: AI-distilled summaries (Thesis + 5 Bullets) give you the core insights without the 20-minute read.
- **Vaporization**: Read it, digest it, and manually "Vaporize" it to reclaim your mental space.

---

## ✨ Features

- **Editorial UI**: A custom-designed OLED Dark Mode ("Ephemeral Lens") with premium typography and asymmetrical layouts.
- **AI Ingestion Engine**:
  - Uses **Jina Reader API** for pristine markdown extraction (no ads, no tracking).
  - Uses **Ollama (GPT-OSS 120B)** for ruthless summarization into a structured JSON schema.
- **Real-time Sync**: Firebase-powered live updates across devices.
- **Productivity Dashboard**: Track your "Reading Velocity" and retention rates.
- **PWA Ready**: Mobile-optimized with "Add to Home Screen" support.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Auth & Database**: [Firebase](https://firebase.google.com/) (Auth + Firestore)
- **AI Infrastructure**: 
  - [Ollama Cloud](https://ollama.com/) (GPT-OSS 120B)
  - [Jina Reader](https://jina.ai/reader/) (Markdown Ingestion)
- **Typography**: [Geist Sans & Mono](https://vercel.com/font)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Firebase Project
- Ollama API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iamdainwi/vapor.git
   cd vapor
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file with the following variables:
   ```env
   # Firebase Client
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...

   # Firebase Admin (Private)
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'

   # AI APIs
   OLLAMA_API_KEY=...
   OLLAMA_URL=https://ollama.com

   # Security
   CLEANUP_API_SECRET=...
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

---

## 🏗️ Architecture

- `src/app`: Next.js App Router (Layouts, Pages, API Routes)
- `src/components`: React components (UI atoms, Content Cards, Countdown Timers)
- `src/lib`: Core logic (Firebase config, Ollama integration, Ingestion pipeline)
- `src/hooks`: Global state and auth hooks
- `src/app/api/cleanup`: Automated cron-job endpoint for self-destructing expired data.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ⚡️ by the Vapor Labs team.
