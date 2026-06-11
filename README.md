<div align="center">
  <img src="public/orqestra-lockup-horizontal.svg" alt="Orqestra OS" width="360" />
  <br /><br />
  <h1 style="border: none; margin: 0; font-size: 1.5rem;">The Operating System for AI Workflows</h1>
  <p style="font-size: 1.1rem; color: #666;">
    Connect models. Connect APIs. Connect agents.<br />
    Build and run AI workflows visually — from one unified platform.
  </p>
  <br />
  <a href="https://github.com/ThatKJ/orqestra-os/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-6366F1.svg" alt="MIT License" />
  </a>
  <img src="https://img.shields.io/badge/Status-Early%20Development-6366F1" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20TypeScript-0A0A0A" alt="Stack" />
</div>

---

## Overview

Orqestra OS is a unified orchestration layer for AI-powered workflows. It eliminates the fragmentation of modern AI development by providing a single platform to connect models, APIs, agents, and automations — all through a visual workflow builder.

Instead of juggling six different tools to complete one workflow, Orqestra OS gives you one place to design, execute, and monitor everything.

---

## The Problem

Modern AI development is fragmented. A typical workflow requires context-switching across disconnected tools:

```
Idea       →  ChatGPT
Code       →  Cursor
Research   →  Claude
Images     →  Midjourney
Automation →  n8n
Deploy     →  Vercel
```

Each tool operates in isolation. Nothing shares context. Nothing works together. The result: founders spend more time moving information between tools than actually building.

**Orqestra OS is the unified layer that connects it all.**

---

## Features

| Feature | Description |
|---------|------------|
| **Visual Workflow Builder** | Drag-and-drop canvas powered by React Flow — build workflows without writing orchestration code |
| **AI Model Integration** | Connect OpenAI, Claude, Gemini, and more within a single workflow |
| **External System Connectivity** | REST APIs, webhooks, databases — plug into anything |
| **MCP Server Support** | Connect to the growing MCP ecosystem |
| **Reliable Execution** | Sequential execution engine with context propagation, retry logic, and error handling |
| **Full Observability** | Execution logs, timeline tracing, run history, and error diagnostics |
| **Conditional Logic** | Branch, switch, and route workflows based on output values |
| **Local-First Development** | SQLite-backed storage for fast iteration without infrastructure |

---

## Architecture

```
┌─────────────────────────────────────┐
│           Frontend (Next.js)         │
│  Workflow Builder · Logs · History   │
└────────────────┬────────────────────┘
                 │  REST + SSE
┌────────────────▼────────────────────┐
│          Backend (Express)           │
│   Execution Engine · Node Handlers   │
│   Context Management · Streaming     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│           SQLite Database            │
│   workflows · executions · steps     │
└─────────────────────────────────────┘
```

### Design Principles

- **Execution engine is never coupled to the UI** — workflows run the same way regardless of how they were built
- **Serialization layer is the boundary** — clean separation between visual representation and execution logic
- **Simple beats clever** — SQLite over microservices, REST over event buses, SSE over WebSockets
- **Observability is mandatory** — every execution answers what happened, why, and where it failed
- **Working software ships before perfect architecture**

---

## Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js + TypeScript |
| Styling | Tailwind CSS |
| Canvas | React Flow |
| State Management | Zustand |

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + Express + TypeScript |
| Database | SQLite (PostgreSQL planned) |
| Real-time | Server-Sent Events |
| API | REST |

---

## Node Types

| Node | Purpose |
|------|---------|
| `OpenAI` | GPT-4o, GPT-4 Turbo, and other OpenAI models |
| `Claude` | Claude 3.5 Sonnet, Haiku, Opus |
| `Gemini` | Gemini Pro, Flash |
| `API` | Any REST endpoint |
| `Webhook` | Inbound webhook triggers |
| `Database` | Read/write to connected databases |
| `Condition` | Branch logic based on output values |
| `Switch` | Multi-path routing |
| `MCP` | Connect any MCP server |
| `Output` | Render final workflow results |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ThatKJ/orqestra-os.git
cd orqestra-os

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

```env
# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Database
DATABASE_URL=./orqestra.db

# Application
PORT=3001
```

---

## Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Workflow Builder | 🔨 In Progress |
| 2 | Execution Engine | ⬜ Planned |
| 3 | AI Model Connectivity | ⬜ Planned |
| 4 | External Tool Connectivity | ⬜ Planned |
| 5 | Conditional Logic Layer | ⬜ Planned |
| 6 | Observability & Monitoring | ⬜ Planned |
| 7 | Workflow History & Versioning | ⬜ Planned |
| 8 | MCP Ecosystem Integration | ⬜ Planned |
| 9 | Agent Runtime | ⬜ Planned |
| 10 | Public Beta | ⬜ Planned |

---

## Contributing

We welcome contributions from the community. Orqestra OS is in early development, and your input helps shape its direction.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>
    Built by founders, for founders.
  </p>
  <p>
    <a href="https://github.com/ThatKJ/orqestra-os">GitHub</a> ·
    <a href="https://instagram.com/orqestraos">Instagram</a> ·
    <a href="https://orqestra.ai">Website</a>
  </p>
</div>
