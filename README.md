# VAPOR // NOTHING LASTS

Vapor is an anti-hoarding "read-it-later" application designed to combat digital clutter. Unlike traditional bookmarking tools that allow content to accumulate indefinitely, Vapor enforces consumption through a strict 7-day self-destruct mechanic.

The interface is built with a **brutalist-minimal** aesthetic—raw, utilitarian, and high-contrast—reflecting the ephemeral nature of the content it contains.

---

## Key Features

- **7-Day Longevity**: Every saved item is permanently deleted exactly 7 days after ingestion.
- **AI-Powered Summarization**: Uses Ollama Cloud (GPT-OSS 120B) to generate a concise thesis and 5 key bullet points for every article.
- **Clean Extraction**: Leverages the Jina Reader API to strip ads, trackers, and clutter, leaving only the core content.
- **Real-time Feed**: A live-updating vertical feed with pulsing urgency indicators for items set to expire within 24 hours.
- **Profile Management**: Track your "digital hygiene" with stats on items saved, items expired, and account longevity.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Server Components)
- **Styling**: Tailwind CSS v4 (Custom Brutalist Theme)
- **UI Components**: shadcn/ui (Radix Mira style)
- **Authentication**: Firebase Auth (Google OAuth & Email/Password)
- **Database**: Firebase Firestore (NoSQL)
- **Processing**: 
  - **Scraper**: Jina Reader API (Markdown extraction)
  - **LLM**: Ollama Cloud API (via official JavaScript library)
- **Icons**: Lucide React / Hugeicons

---

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Firebase Project (Auth + Firestore enabled)
- Ollama Cloud Account & API Key
- [Jina Reader API](https://jina.ai/reader/) access (Public or Private)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/iamdainwi/vapor.git
    cd vapor
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` file based on the provided template:
    ```bash
    cp .env.local.example .env.local
    ```
    Fill in your Firebase credentials, Ollama API key, and a cleanup secret.

4.  **Run the Development Server**:
    ```bash
    pnpm dev
    ```
    Navigate to `http://localhost:3000` to begin.

---

## Configuration

### Firebase Setup
1.  Enable **Google Auth** and **Email/Password** in the Firebase Console.
2.  Create a **Firestore** database.
3.  Add a **Composite Index** on the `content_items` collection:
    - `userId`: Ascending
    - `createdAt`: Descending
4.  Generate a **Service Account JSON** and base64-encode it for the `FIREBASE_SERVICE_ACCOUNT_KEY` variable.

### Deletion Engine
To automate item self-destruction, schedule a `POST` request to `/api/cleanup` every hour.
- **Header**: `Authorization: Bearer <CLEANUP_API_SECRET>`
- **Endpoint**: `/api/cleanup`

---

## Architecture

Vapor follows a highly modular structure optimized for performance and maintainability:

- **`/src/app`**: Next.js App Router structure, including authenticated route groups `(app)`.
- **`/src/components`**: Atomic UI components and feature-specific blocks (Feed, Ingest, Profile).
- **`/src/lib`**: Core logic including scraper integration, LLM pipelines, and Firebase SDK wrappers.
- **`/src/api`**: Serverless functions for ingestion, manual deletion, and background cleanup.

---

## Design Philosophy

**"The Digital Forensic"**
Vapor rejects the softness of modern web design. There are no gradients, no rounded corners, and no shadows. It uses:
- **Zero Border Radius**: Sharp 90-degree corners on every element.
- **High Contrast**: Pure black (`#0e0e0e`) and raw white (`#e5e2e1`).
- **Urgency Red**: Pulse animations and harsh reds (`#ff2222`) for expiring content.
- **Typography**: Space Grotesk and JetBrains Mono for a terminal-like readability.

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

Copyright © 2026 iamdainwi. Built for the era of information overload.
