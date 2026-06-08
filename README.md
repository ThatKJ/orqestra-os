<div align="center">

```
 ██████╗ ██████╗  ██████╗ ██╗   ██╗███████╗███████╗████████╗██████╗  █████╗
██╔═══██╗██╔══██╗██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
██║   ██║██████╔╝██║   ██║██║   ██║█████╗  ███████╗   ██║   ██████╔╝███████║
██║   ██║██╔══██╗██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   ██╔══██╗██╔══██║
╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝███████╗███████║   ██║   ██║  ██║██║  ██║
 ╚═════╝ ╚═╝  ╚═╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
```

### The execution layer for AI workflows.

**Build · Run · Trace · Debug**

[![License: MIT](https://img.shields.io/badge/License-MIT-22d3ee.svg?style=flat-square)](LICENSE)
[![Node 20+](https://img.shields.io/badge/Node-20+-22d3ee.svg?style=flat-square)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-818cf8.svg?style=flat-square)](https://www.typescriptlang.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-white.svg?style=flat-square)](https://nextjs.org)
[![Status: MVP](https://img.shields.io/badge/Status-MVP-34d399.svg?style=flat-square)](#)

</div>

---

## What is this

Orquestra OS is a visual workflow builder where **AI is a first-class primitive**, not bolted on.

You connect triggers, AI steps, API calls, and conditional logic on a canvas. Hit Run. Every node lights up in real-time. Every execution is fully traced — input, output, duration, and status for every step.

No Python boilerplate. No duct-taping n8n with GPT. No raw log spelunking when something breaks.

```
Trigger → AI Step → Condition → API Call → Output
           ↓                  ↓ true
      {{prev.output}}    POST to Slack
```

---

## The problem it solves

| Tool | What breaks |
|------|------------|
| **n8n / Zapier** | AI is bolted on. Every step is an island. No shared context, no prompt chaining. |
| **LangChain / LangGraph** | The floor is Python + abstractions. Non-developers can't touch it. |
| **Custom backends** | You rebuild retry logic, context passing, and execution history from scratch. Every. Time. |

Orquestra fills the gap: visual enough for a PM, powerful enough for a developer, debuggable enough for production.

---

## Demo

> *3 example workflows ship with the repo. Clone, set your API key, run.*

### Workflow 1 — Summarize + Slack Notify
```
Trigger → AI: Summarize → Condition: Is it urgent? → API: POST to Slack → Output
```

### Workflow 2 — Customer Feedback Analyzer
```
Trigger → AI: Classify sentiment → AI: Extract action items → API: Save to Notion → Output
```

### Workflow 3 — Content Pipeline
```
Trigger → AI: Generate blog outline → AI: Write intro from outline → Output
```

---

## Quickstart

### Prerequisites

- Node 20+
- An OpenAI API key

### 1. Clone

```bash
git clone https://github.com/your-username/orquestra-os.git
cd orquestra-os
```

### 2. Configure environment

```bash
# Backend
cp .env.example backend/.env
```

```env
# backend/.env
OPENAI_API_KEY=sk-...
PORT=3001
DB_PATH=./data/workflows.db
```

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Start the backend

```bash
cd backend
npm run dev
# → Express running on http://localhost:3001
# → SQLite database initialized at ./data/workflows.db
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
# → Next.js running on http://localhost:3000
```

### 6. Open the builder

Navigate to `http://localhost:3000`. You'll see the workflow list with 3 prebuilt examples ready to run.

---

## How it works

### The canvas

Open any workflow in the builder. You'll see a dot-grid canvas with draggable nodes and connectors.

- **Sidebar** — drag any of the 5 node types onto the canvas
- **Node config** — click any node to edit its properties
- **Connect nodes** — drag from one node's output port to the next node's input port
- **Run** — hit the Run button. Watch each node activate in sequence.

### Context passing

Every node's output is accessible to every downstream node via `{{prev.output}}`.

```
AI Step prompt:
"Summarize the following in 3 bullet points:\n{{prev.output}}"

API Call body:
{"text": "{{prev.output}}"}
```

The context resolver handles object-to-string coercion, multi-branch paths, and nested dot-path access automatically.

### Execution trace

Every run is stored in SQLite and streamed live via SSE. The execution panel shows:

```
10:00:00.012  [trigger]    received input "Analyze this customer feedback..."       12ms    ✓
10:00:00.015  [ai_step]    prompt resolved · calling gpt-4o-mini · temp=0.3
10:00:01.240  [ai_step]    complete · "sentiment: negative, actions: [...]"      1,225ms   ✓
10:00:01.243  [condition]  sentiment equals "negative" → branch: true               1ms    ✓
10:00:01.245  [api_call]   POST https://hooks.slack.com/...                        614ms   ✓
10:00:01.860  [output]     done                                                      0ms    ✓
```

Failed steps auto-retry once. The retry attempt and original error are both logged.

---

## Node reference

### 🟢 Trigger
Entry point. Manual run button for MVP. Accepts an initial input payload that flows into the first downstream node.

| Field | Type | Description |
|-------|------|-------------|
| `initialInput` | `string` | The value passed to `{{prev.output}}` for the first step |

---

### 🟣 AI Step
Calls OpenAI. The prompt supports `{{prev.output}}` templating. Output becomes the context for the next node.

| Field | Type | Description |
|-------|------|-------------|
| `prompt` | `string` | Prompt template. Use `{{prev.output}}` to reference previous step. |
| `model` | `gpt-4o` \| `gpt-4o-mini` | Model to use. Default: `gpt-4o-mini` |
| `temperature` | `number` | 0–2. Default: `0.7` |

---

### 🟡 API Call
Generic HTTP request. Body can reference previous outputs via template syntax. Handles 200 vs 4xx branching automatically.

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | Endpoint URL |
| `method` | `GET` \| `POST` \| `PUT` | HTTP method |
| `headers` | `object` | Key-value headers |
| `body` | `string` | JSON template. Supports `{{prev.output}}` |

---

### 🔴 Condition
If/else branch on previous output. Routes execution to the `true` or `false` downstream path.

| Field | Type | Description |
|-------|------|-------------|
| `field` | `string` | Dot-path to evaluate (e.g. `prev.output`) |
| `operator` | `contains` \| `equals` \| `gt` \| `lt` | Comparison operator |
| `value` | `string` | Value to compare against |

---

### ⚫ Output
Terminal node. Captures the final result and displays it in the execution panel. Every workflow must end here.

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display label for this output |

---

## Workflow JSON schema

Workflows are stored and transmitted as plain JSON. The frontend serializes the canvas to this format. The backend deserializes it to execute.

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
|--------|-------|-------------|
| `GET` | `/api/workflows` | List all workflows |
| `POST` | `/api/workflows` | Create workflow, returns `id` |
| `GET` | `/api/workflows/:id` | Fetch workflow with full node/edge definition |
| `POST` | `/api/workflows/:id` | Save / overwrite workflow |
| `DELETE` | `/api/workflows/:id` | Delete workflow and all execution history |
| `POST` | `/api/workflows/:id/run` | Execute workflow. Returns `execution_id` + SSE stream |
| `GET` | `/api/executions/:id` | Fetch full execution log with per-step I/O |
| `GET` | `/api/workflows/:id/executions` | List all past executions for a workflow |

The `/run` endpoint streams step events via SSE:

```
event: step_start
data: {"nodeId":"n2","nodeType":"ai","label":"Summarize"}

event: step_complete
data: {"nodeId":"n2","status":"success","durationMs":1225,"output":{"value":"..."}}

event: step_retry
data: {"nodeId":"n4","attempt":1,"error":"Network timeout"}

event: workflow_complete
data: {"executionId":"ex_xyz789","status":"success","totalMs":1840}
```

---

## Project structure

```
orquestra-os/
├── backend/
│   └── src/
│       ├── index.ts                  # Express app entry
│       ├── db/
│       │   ├── schema.ts             # SQLite table definitions
│       │   └── queries.ts            # All DB read/write operations
│       ├── engine/
│       │   ├── executor.ts           # executeWorkflow(), executeStep()
│       │   ├── context.ts            # {{prev.output}} resolver
│       │   └── logger.ts             # Execution log writer
│       ├── tools/
│       │   ├── callOpenAI.ts         # AI step adapter
│       │   ├── callAPI.ts            # HTTP step adapter
│       │   └── index.ts              # Tool registry
│       └── routes/
│           ├── workflows.ts          # CRUD routes
│           └── executions.ts         # Run + log routes
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Workflow list
│       │   └── builder/[id]/page.tsx # Canvas builder
│       ├── components/
│       │   ├── nodes/                # TriggerNode, AINode, APINode, ConditionNode, OutputNode
│       │   ├── workflow/             # Canvas, Toolbar, RunButton
│       │   └── logs/                 # ExecutionPanel
│       ├── lib/
│       │   ├── api.ts                # Fetch wrappers
│       │   └── serialize.ts          # React Flow → workflow JSON
│       └── store/
│           └── workflowStore.ts      # Zustand state
│
├── .env.example
└── README.md
```

---

## Stack

**Frontend**

| Package | Version | Why |
|---------|---------|-----|
| Next.js | 14 | App Router, file-based routing |
| React Flow | latest | Canvas rendering only — no business logic |
| Tailwind CSS | 3.x | Styling |
| TypeScript | 5.x | Type safety throughout |
| Zustand | 4.x | Workflow state — no Redux ceremony |

**Backend**

| Package | Version | Why |
|---------|---------|-----|
| Express.js | 4.x | HTTP server — large ecosystem, easy to debug |
| TypeScript | 5.x | Type safety throughout |
| better-sqlite3 | latest | SQLite — zero setup, file-based, no Postgres for MVP |
| OpenAI SDK | v4 | AI step calls |
| Axios | latest | API call nodes |

**Communication** — REST + SSE for live execution events. No WebSockets, no polling.

**Storage** — SQLite for MVP. Schema is designed to migrate to Postgres without breaking changes.

---

## What's in v1 / what's not

### ✅ In v1

- Visual canvas — React Flow with 5 node types
- `{{prev.output}}` context passing between all node types
- Sequential + conditional execution (true/false branches)
- Per-step execution trace: input, output, duration, status
- 1× auto-retry on failure
- SSE real-time log streaming
- SQLite persistence — workflows survive page reload
- 3 prebuilt example workflows
- Local-only — no auth, no cloud, no accounts

### ❌ Not in v1

- Cron / webhook triggers
- Parallel execution branches
- Sub-workflows
- Other LLM providers (Anthropic, Gemini)
- Streaming LLM responses
- MCP server integration
- Cloud deployment
- Auth / multi-tenancy
- Versioned workflow history
- Team collaboration

---

## Contributing

This is an early-stage MVP. The codebase is intentionally simple — one Express server, one Next.js app, one SQLite file.

If you find a bug or want to add something:

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-thing`
3. Make your change
4. Open a PR with a clear description of what and why

Before adding a feature, open an issue first. The v1 scope boundary is intentional — the goal is a clean, debuggable core before adding surface area.

---

## License

MIT — do whatever you want with it.

---

<div align="center">

Built in public · June 2026

[Website](https://orquestra.so) · [Join the waitlist](https://orquestra.so/#waitlist) · [Open an issue](https://github.com/your-username/orquestra-os/issues)

</div>