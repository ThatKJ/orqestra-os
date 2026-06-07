<div align="center">
  <br/>
  <h1>Orquestra OS</h1>
  <p><strong>The execution layer for AI workflows.</strong></p>
  <p>Visual builder · Full execution trace · No boilerplate</p>
  <br/>
  <p>
    <a href="#features">Features</a> ·
    <a href="#stack">Stack</a> ·
    <a href="#getting-started">Getting Started</a>
  </p>
  <br/>
</div>

---

Orquestra OS is a visual workflow builder where AI is a first-class primitive — not bolted on. Connect triggers, AI steps, API calls, and conditional logic on a canvas. Every execution is fully traced: input, output, duration, and status for every node. No Python boilerplate. No duct-taping n8n with GPT. Just build the workflow, hit Run, and watch it execute.

## Features

- **Visual canvas** — 5 node types (Trigger, AI Step, API Call, Condition, Output). Drag, connect, configure.
- **Native context passing** — Every step's output is accessible to the next with `{{prev.output}}`. No glue code.
- **Execution trace** — Per-step logs with input, output, duration, status, and retry count.
- **SSE streaming** — Real-time execution log. Every node lights up as it runs.
- **Prebuilt workflows** — 3 production workflows ready to fork.
- **Local-first** — No auth, no cloud, no setup beyond cloning the repo.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Email | Nodemailer + Gmail SMTP |
| Validation | Zod |
| Analytics | Plausible (optional) |

## Getting Started

```
npm install
npm run dev
```

Open `http://localhost:3000` and join the waitlist.

---

Built by [ThatKJ](https://github.com/ThatKJ).
