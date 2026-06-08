<div align="center">

<br/>

### The execution layer for AI workflows.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express_4.x-404040?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=flat-square&logo=react&logoColor=white)](https://reactflow.dev/)
[![SQLite](https://img.shields.io/badge/SQLite_3.x-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![OpenAI SDK](https://img.shields.io/badge/OpenAI_SDK_v4-412991?style=flat-square&logo=openai&logoColor=white)](https://platform.openai.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-22d3ee?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-MVP-34d399?style=flat-square)](#)

<br/>

**Orqestra OS** is a visual workflow builder where AI is a first-class primitive — not bolted on as an afterthought.<br/>
Connect triggers, AI steps, API calls, and conditional logic on a canvas. Every execution is fully traced. Every node is debuggable. Zero boilerplate.

<br/>

[**→ Live Demo**](https://orquestra-os.vercel.app/) &nbsp;·&nbsp; [**→ Join the Waitlist**](https://orquestra-os.vercel.app/#waitlist) &nbsp;·&nbsp; [**→ Report a Bug**](https://github.com/ThatKJ/orquestra-os/issues)

<br/>

</div>

---

## Why Orqestra OS

| The tool you're using | What breaks |
|---|---|
| **n8n / Zapier** | AI is bolted on as an afterthought. Every step is an island — no shared context, no prompt chaining, no reasoning across nodes. |
| **LangChain / LangGraph** | Powerful, but the floor is Python + abstractions. Non-developers can't use it. Developers spend more time on boilerplate than logic. |
| **Custom backends** | You rebuild retry logic, context passing, execution history, and API adapters from scratch on every project. |

**Orqestra fills the gap** — visual enough for a PM, powerful enough for a developer, debuggable enough for production.

---

## What it does

- **AI-native canvas.** Drag nodes. Draw connections. Configure prompts. Hit run. AI is not a plugin — it's a native primitive with built-in context resolution, model selection, and prompt templating.
- **Full execution observability.** Per-step input, output, duration, status, and retry count. You always know exactly what happened and why — no guessing from raw logs.
- **`{{prev.output}}` context passing.** Every node can reference the previous node's output. Context flows through your pipeline automatically. No manual wiring.
- **Real-time SSE streaming.** Watch each node light up as it executes. No polling. The execution panel updates live as steps complete.
- **1× auto-retry.** Failed steps retry once automatically. The retry attempt, duration, and original error are all persisted in the trace.
- **Zero setup.** Clone, add your API key, run two commands. No Docker. No Postgres. No cloud accounts required.

---

## Quickstart

### Prerequisites

- Node.js 20+
- npm 9+
- OpenAI API key — [get one here](https://platform.openai.com/api-keys)

### 1. Clone

```bash
git clone https://github.com/ThatKJ/orquestra-os.git
cd orquestra-os
```

### 2. Configure environment

```bash
cp .env.example backend/.env
```

`backend/.env`:

```env
OPENAI_API_KEY=sk-...
PORT=3001
DB_PATH=./data/workflows.db
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Start backend

```bash
cd backend && npm run dev
```

```
→ Express running on http://localhost:3001
→ SQLite initialized at ./data/workflows.db
→ Tables ready
```

### 5. Start frontend

```bash
cd frontend && npm run dev
```

```
→ Next.js running on http://localhost:3000
```

### 6. Build something

Navigate to `http://localhost:3000`. Three prebuilt example workflows are ready to run immediately.

---

## Node types

Orqestra OS ships with **5 node types**. Intentionally scoped — the goal is a clean, debuggable core.

| Node | Color | Role | Config |
|---|---|---|---|
| **Trigger** | 🟢 Green | Entry point. Manual run button. `initialInput` becomes the first `{{prev.output}}`. | `initialInput: string` |
| **AI Step** | 🟣 Indigo | Calls OpenAI. Prompt supports `{{prev.output}}` interpolation anywhere in the string. | `prompt`, `model` (gpt-4o / gpt-4o-mini), `temperature` |
| **API Call** | 🟡 Amber | Generic HTTP request. Body supports `{{prev.output}}` template syntax. | `url`, `method` (GET/POST/PUT), `headers`, `body` |
| **Condition** | 🔴 Red | If/else branch. Routes to `true` or `false` downstream path based on field evaluation. | `field`, `operator` (contains/equals/gt/lt), `value` |
| **Output** | ⚫ Gray | Terminal node. Captures final result. Every workflow must end here. | `label: string` |

---

## Context passing

Context flows between nodes via `{{prev.output}}`. The resolver lives in `engine/context.ts` and handles type coercion, multi-branch path resolution, and nested dot-path access on structured outputs.

**In an AI Step prompt:**

```
Summarize the following feedback in 3 bullet points:

{{prev.output}}
```

**In an API Call body:**

```json
{
  "text": "{{prev.output}}",
  "source": "orquestra-pipeline"
}
```

**In a Condition node:**

```
field:    prev.output
operator: contains
value:    negative
```

---

## Execution trace

Every run is stored in SQLite and streamed live via SSE. The execution panel shows a timestamped log of every step as it happens:

```
10:00:00.012  [trigger]    received input "Analyze this customer feedback..."          12ms  ✓
10:00:00.015  [ai]         prompt resolved · calling gpt-4o-mini · temp=0.3
10:00:01.240  [ai]         done · "sentiment: negative, actions: [...]"             1,225ms  ✓
10:00:01.243  [condition]  prev.output contains "negative" → branch: true               1ms  ✓
10:00:01.245  [api]        POST https://hooks.slack.com/... → 200 OK                  614ms  ✓
10:00:01.860  [output]     done                                                          0ms  ✓
```

**SSE event stream from `/api/workflows/:id/run`:**

```
event: step_start
data: {"nodeId":"n2","nodeType":"ai","label":"Summarize","startedAt":"..."}

event: step_complete
data: {"nodeId":"n2","status":"success","durationMs":1225,"output":{"value":"..."}}

event: step_retry
data: {"nodeId":"n4","attempt":1,"error":"Network timeout","retryAt":"..."}

event: workflow_complete
data: {"executionId":"ex_xyz789","status":"success","totalMs":1840}
```

---

## Workflow JSON schema

Workflows serialize to plain JSON. The frontend serializes via `serialize.ts`. The backend deserializes in `executor.ts`. No deviation in v1.

```json
{
  "id": "wf_abc123",
  "name": "Summarize and Notify",
  "createdAt": "2026-06-07T10:00:00Z",
  "nodes": [
    {
      "id": "n1",
      "type": "trigger",
      "label": "Start",
      "config": { "initialInput": "Analyze this customer feedback..." }
    },
    {
      "id": "n2",
      "type": "ai",
      "label": "Summarize",
      "config": {
        "model": "gpt-4o-mini",
        "prompt": "Summarize the following in 3 bullet points:\n{{prev.output}}",
        "temperature": 0.3
      }
    },
    {
      "id": "n3",
      "type": "condition",
      "label": "Is Negative?",
      "config": {
        "field": "prev.output",
        "operator": "contains",
        "value": "negative"
      }
    },
    {
      "id": "n4",
      "type": "api",
      "label": "Alert Slack",
      "config": {
        "url": "https://hooks.slack.com/...",
        "method": "POST",
        "body": "{\"text\": \"{{prev.output}}\"}"
      }
    },
    {
      "id": "n5",
      "type": "output",
      "label": "Done",
      "config": {}
    }
  ],
  "edges": [
    { "from": "n1", "to": "n2" },
    { "from": "n2", "to": "n3" },
    { "from": "n3", "to": "n4", "branch": "true" },
    { "from": "n3", "to": "n5", "branch": "false" },
    { "from": "n4", "to": "n5" }
  ]
}
```

---

## API reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/workflows` | List all workflows with metadata |
| `POST` | `/api/workflows` | Create a new workflow. Returns `{ id }` |
| `GET` | `/api/workflows/:id` | Fetch workflow with full node + edge definition |
| `POST` | `/api/workflows/:id` | Save / overwrite workflow (full JSON body) |
| `DELETE` | `/api/workflows/:id` | Delete workflow and all associated execution logs |
| `POST` | `/api/workflows/:id/run` | Execute workflow. Returns `execution_id` + SSE stream |
| `GET` | `/api/executions/:id` | Fetch full execution log with per-step I/O |
| `GET` | `/api/workflows/:id/executions` | List all past executions for a workflow |

---

## Architecture

```
orquestra-os/
│
├── backend/
│   └── src/
│       ├── index.ts                    # Express entry + middleware
│       ├── db/
│       │   ├── schema.ts               # SQLite table definitions
│       │   └── queries.ts              # All DB read/write operations
│       ├── engine/
│       │   ├── executor.ts             # executeWorkflow() · executeStep()
│       │   ├── context.ts              # {{prev.output}} resolver
│       │   └── logger.ts               # Execution log writer
│       ├── tools/
│       │   ├── callOpenAI.ts           # OpenAI SDK v4 adapter
│       │   ├── callAPI.ts              # Axios HTTP adapter
│       │   └── index.ts                # Tool registry (MCP-ready interface)
│       └── routes/
│           ├── workflows.ts            # CRUD routes
│           └── executions.ts           # Run + log routes
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx                # Workflow list
        │   └── builder/[id]/page.tsx   # Canvas builder
        ├── components/
        │   ├── nodes/
        │   │   ├── TriggerNode.tsx
        │   │   ├── AINode.tsx
        │   │   ├── APINode.tsx
        │   │   ├── ConditionNode.tsx
        │   │   └── OutputNode.tsx
        │   ├── workflow/
        │   │   ├── Canvas.tsx          # React Flow wrapper
        │   │   ├── Toolbar.tsx         # Add node buttons
        │   │   └── RunButton.tsx
        │   └── logs/
        │       └── ExecutionPanel.tsx  # SSE log consumer
        ├── lib/
        │   ├── api.ts                  # Typed fetch wrappers
        │   └── serialize.ts            # React Flow → workflow JSON
        └── store/
            └── workflowStore.ts        # Zustand state
```

---

## Stack

**Frontend**

| Package | Why |
|---|---|
| Next.js 14 (App Router) | File-based routing, zero config |
| React Flow | Canvas rendering only — no business logic lives here |
| Tailwind CSS | Utility-first, fast iteration |
| TypeScript 5 | Type safety across the full stack |
| Zustand | Workflow state — no Redux ceremony at this scale |

**Backend**

| Package | Why |
|---|---|
| Express.js 4 | Larger ecosystem, easier to debug than Fastify |
| TypeScript 5 | Same types shared with frontend |
| better-sqlite3 | Zero setup, file-based, synchronous API — right for MVP |
| OpenAI SDK v4 | Official SDK, streaming-ready for v2 |
| Axios | HTTP adapter for API call nodes |

**Communication** — REST + Server-Sent Events. No WebSockets, no polling. SSE is 20 lines of code and solves real-time log streaming cleanly.

**Storage** — SQLite for MVP. Schema is intentionally portable — migration to Postgres requires no logic changes, only a driver swap.

---

## Example workflows

Three production-ready workflows ship with the repo and are available on first launch.

**01 — Summarize + Slack Notify**

Summarize any text with AI, detect urgency with a condition branch, POST to Slack if flagged.

```
Trigger → AI: Summarize → Condition: Is urgent? ──true──→ API: POST Slack → Output
                                                  └─false─→ Output
```

**02 — Customer Feedback Analyzer**

Classify sentiment, extract action items with a second AI pass, push results to Notion.

```
Trigger → AI: Classify sentiment → AI: Extract action items → API: POST Notion → Output
```

**03 — Content Pipeline**

Generate a blog outline, then pass that outline as context into a second AI node to write the intro.

```
Trigger → AI: Generate outline → AI: Write intro from {{prev.output}} → Output
```

---

## Environment variables

```env
# ── Backend (.env) ─────────────────────────────────
OPENAI_API_KEY=sk-...         # Required.
PORT=3001
DB_PATH=./data/workflows.db

# ── Frontend (.env.local) ──────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:3001
```

A `.env.example` is included in the repo root.

---

## Scope

**In v1**

- Visual canvas with 5 node types
- `{{prev.output}}` context passing across all node types
- Sequential + conditional execution (true/false branches)
- Per-step execution trace — input, output, duration, status, retry count
- 1× auto-retry on step failure
- SSE real-time log streaming
- SQLite persistence — workflows survive page reload
- 3 prebuilt example workflows ready to fork and run
- Local-only — no auth, no accounts, no cloud required

**Not in v1** *(intentional)*

- Cron / webhook triggers
- User authentication + multi-tenancy
- Parallel execution branches
- Sub-workflows
- Other LLM providers (Anthropic, Gemini, etc.)
- Streaming LLM token responses
- MCP server integration
- Cloud / hosted deployment
- Versioned workflow history
- Team collaboration

---

## Contributing

This is an early-stage MVP. The codebase is intentionally small — one Express server, one Next.js app, one SQLite file.

Before opening a PR: check [open issues](https://github.com/ThatKJ/orquestra-os/issues) to avoid duplicate work. For new features, open an issue first — the v1 scope boundary is deliberate.

```bash
git checkout -b fix/your-thing       # or feat/your-thing
git commit -m "fix: what and why"
git push origin fix/your-thing
# open a PR
```

Commit convention: `fix:` · `feat:` · `refactor:` · `docs:` · `chore:`

---

## License

MIT — do whatever you want with it.

---

<div align="center">

Built in public · June 2026

[orquestra-os.vercel.app](https://orquestra-os.vercel.app) &nbsp;·&nbsp; [Waitlist](https://orquestra-os.vercel.app/#waitlist) &nbsp;·&nbsp; [Issues](https://github.com/ThatKJ/orquestra-os/issues)

</div>