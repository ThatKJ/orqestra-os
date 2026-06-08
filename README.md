<div align="center">

# 🎼 Orquestra OS

### The execution layer for AI workflows.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-404040?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-latest-FF0072?style=for-the-badge&logo=react&logoColor=white)](https://reactflow.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-SDK_v4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22d3ee?style=for-the-badge)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-MVP-34d399?style=for-the-badge)](#)

<br/>

**Orquestra OS** is a visual workflow builder where AI is a first-class primitive — not bolted on.  
Connect triggers, AI steps, API calls, and conditional logic on a canvas.  
Every execution is fully traced. Every node is debuggable. Zero boilerplate.

[**→ Live Demo**](https://orquestra-os.vercel.app/) · [**→ Join the Waitlist**](https://orquestra-os.vercel.app/#waitlist) · [**→ Report a Bug**](https://github.com/ThatKJ/orquestra-os/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [System Architecture](#-system-architecture)
- [Quickstart](#-quickstart)
- [Node Reference](#-node-reference)
- [Context Passing](#-context-passing)
- [Execution Trace](#-execution-trace)
- [API Reference](#-api-reference)
- [Workflow JSON Schema](#-workflow-json-schema)
- [Project Structure](#-project-structure)
- [Example Workflows](#-example-workflows)
- [Stack Decisions](#-stack-decisions)
- [Environment Variables](#-environment-variables)
- [What's in v1 / What's Not](#-whats-in-v1--whats-not)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

Orquestra OS is the execution layer for AI workflows. You build pipelines visually — drag nodes, draw connections, configure steps — then hit Run. The system executes each step in sequence, passes context between nodes automatically, streams logs in real-time via SSE, and stores a full trace of every run.

**Three things that make it different:**

- **AI is a first-class primitive.** Not a plugin, not an integration — every AI step is a native node with built-in context resolution, model selection, and prompt templating.
- **Every execution is fully observable.** Per-step input, output, duration, status, and retry count. You always know exactly what happened and why.
- **Zero setup.** Clone, set your API key, run two commands. No Docker, no Postgres, no cloud accounts.

---

## 🧩 The Problem

| Tool | What breaks |
|------|-------------|
| **n8n / Zapier** | AI is bolted on as an afterthought. Every step is an island — no shared context, no prompt chaining, no reasoning across nodes. |
| **LangChain / LangGraph** | Powerful, but the floor is Python + abstractions. Non-developers can't touch it. Even developers spend more time on boilerplate than logic. |
| **Custom backends** | You rebuild retry logic, context passing, execution history, and API adapters from scratch on every project. |

Orquestra fills the gap: visual enough for a PM, powerful enough for a developer, debuggable enough for production.

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph FE["🖥️ Frontend — Next.js 14 (App Router)"]
        CANVAS[Canvas.tsx\nReact Flow Wrapper]
        NODES[Custom Nodes\nTrigger · AI · API · Condition · Output]
        TOOLBAR[Toolbar.tsx\nAdd Node Buttons]
        RUN[RunButton.tsx\nTriggers Execution]
        PANEL[ExecutionPanel.tsx\nSSE Log Consumer]
        STORE[workflowStore.ts\nZustand State]
        SERIAL[serialize.ts\nReact Flow → Workflow JSON]
    end

    subgraph BE["⚙️ Backend — Express + Node 20"]
        ROUTES_WF[routes/workflows.ts\nCRUD Endpoints]
        ROUTES_EX[routes/executions.ts\nRun + Log Endpoints]
        EXEC[engine/executor.ts\nexecuteWorkflow · executeStep]
        CTX[engine/context.ts\n{{prev.output}} Resolver]
        LOG[engine/logger.ts\nExecution Log Writer]
        SSE[SSE Stream\nReal-time Step Events]
    end

    subgraph TOOLS["🔧 Tool Adapters"]
        OPENAI[tools/callOpenAI.ts\nOpenAI SDK v4]
        CALLAPI[tools/callAPI.ts\nAxios HTTP Adapter]
    end

    subgraph DB["💾 Storage — better-sqlite3"]
        WF_TABLE[workflows\nid · name · json · createdAt]
        EX_TABLE[executions\nid · workflowId · steps · status]
    end

    subgraph AI["🤖 OpenAI"]
        GPT4O[gpt-4o]
        GPT4OMINI[gpt-4o-mini]
    end

    CANVAS --> NODES
    NODES --> STORE
    TOOLBAR --> STORE
    STORE --> SERIAL
    RUN -->|POST /api/workflows/:id/run| ROUTES_EX
    SERIAL -->|POST /api/workflows/:id| ROUTES_WF
    ROUTES_WF --> DB
    ROUTES_EX --> EXEC
    EXEC --> CTX
    CTX --> OPENAI
    CTX --> CALLAPI
    EXEC --> LOG
    LOG --> EX_TABLE
    EXEC --> SSE
    SSE -->|EventSource| PANEL
    OPENAI --> AI
```

---

## 🚀 Quickstart

### Prerequisites

- **Node.js 20+**
- **npm 9+**
- **OpenAI API key** — [get one here](https://platform.openai.com/api-keys)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/orquestra-os.git
cd orquestra-os
```

### 2. Configure environment variables

```bash
cp .env.example backend/.env
```

Edit `backend/.env`:

```env
OPENAI_API_KEY=sk-...
PORT=3001
DB_PATH=./data/workflows.db
```

Create `frontend/.env.local`:

```env
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
```

```
→ Express running on http://localhost:3001
→ SQLite database initialized at ./data/workflows.db
→ Workflows table ready
→ Executions table ready
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

```
→ Next.js running on http://localhost:3000
→ Connected to backend at http://localhost:3001
```

### 6. Open the builder

Navigate to `http://localhost:3000`. Three prebuilt example workflows are ready to run.

---

## 🔷 Node Reference

Orquestra OS ships with **5 node types**. No more in v1 — the goal is a clean, debuggable core.

### 🟢 Trigger
Entry point of every workflow. Manual run button for MVP. The `initialInput` value becomes the first `{{prev.output}}` in the pipeline.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `initialInput` | `string` | ✓ | The payload passed downstream as the first context value |

---

### 🟣 AI Step
Calls OpenAI with a templated prompt. Supports `{{prev.output}}` anywhere in the prompt string. The model's response becomes the output for the next node.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | `string` | ✓ | Prompt template. Supports `{{prev.output}}` interpolation |
| `model` | `gpt-4o` \| `gpt-4o-mini` | ✓ | Model to use. Default: `gpt-4o-mini` |
| `temperature` | `number` (0–2) | — | Sampling temperature. Default: `0.7` |

---

### 🟡 API Call
Generic HTTP request node. The body field supports `{{prev.output}}` template syntax. Handles 2xx success and 4xx/5xx failure branches automatically.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | `string` | ✓ | Full endpoint URL |
| `method` | `GET` \| `POST` \| `PUT` | ✓ | HTTP method |
| `headers` | `object` | — | Key-value header pairs |
| `body` | `string` | — | JSON body template. Supports `{{prev.output}}` |

---

### 🔴 Condition
If/else branch node. Evaluates a field on the previous output and routes execution to the `true` or `false` downstream path.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field` | `string` | ✓ | Dot-path to evaluate (e.g. `prev.output`) |
| `operator` | `contains` \| `equals` \| `gt` \| `lt` | ✓ | Comparison operator |
| `value` | `string` | ✓ | Value to compare against |

---

### ⚫ Output
Terminal node. Every workflow must end here. Captures the final result and displays it in the execution panel.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | ✓ | Display label for this output in the execution panel |

---

## 🔗 Context Passing

Context flows between nodes via the `{{prev.output}}` template syntax. The context resolver handles this in `engine/context.ts`.

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

**In a Condition field:**
```
field:    prev.output
operator: contains
value:    negative
```

The resolver automatically coerces object outputs to strings, handles multi-branch path resolution, and supports nested dot-path access on structured outputs.

---

## 📊 Execution Trace

Every run is stored in SQLite and streamed live to the frontend via SSE. The execution panel shows a real-time log of every step:

```
10:00:00.012  [trigger]    received input "Analyze this customer feedback..."        12ms  ✓
10:00:00.015  [ai_step]    prompt resolved · calling gpt-4o-mini · temp=0.3
10:00:01.240  [ai_step]    complete · "sentiment: negative, actions: [...]"       1,225ms  ✓
10:00:01.243  [condition]  prev.output contains "negative" → branch: true             1ms  ✓
10:00:01.245  [api_call]   POST https://hooks.slack.com/... → 200 OK               614ms  ✓
10:00:01.860  [output]     done                                                        0ms  ✓
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

Failed steps auto-retry once. The retry attempt and original error are both persisted in the execution log.

---

## 🌐 API Reference

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/workflows` | List all workflows with metadata |
| `POST` | `/api/workflows` | Create a new workflow. Returns `{ id }` |
| `GET` | `/api/workflows/:id` | Fetch workflow with full node + edge definition |
| `POST` | `/api/workflows/:id` | Save / overwrite workflow (full JSON body) |
| `DELETE` | `/api/workflows/:id` | Delete workflow and all associated execution logs |
| `POST` | `/api/workflows/:id/run` | Execute workflow. Returns `execution_id` + SSE stream |
| `GET` | `/api/executions/:id` | Fetch full execution log with per-step I/O |
| `GET` | `/api/workflows/:id/executions` | List all past executions for a workflow |

---

## 📐 Workflow JSON Schema

Workflows are stored and transmitted as plain JSON. The frontend serializes the React Flow canvas to this format via `serialize.ts`. The backend execution engine deserializes it in `executor.ts`. No deviation from this schema in v1.

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

## 📂 Project Structure

```
orquestra-os/
│
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Express app entry + middleware
│   │   ├── db/
│   │   │   ├── schema.ts               # SQLite table definitions
│   │   │   └── queries.ts              # All DB read / write operations
│   │   ├── engine/
│   │   │   ├── executor.ts             # executeWorkflow() · executeStep()
│   │   │   ├── context.ts              # {{prev.output}} resolver
│   │   │   └── logger.ts               # Execution log writer
│   │   ├── tools/
│   │   │   ├── callOpenAI.ts           # OpenAI SDK v4 adapter
│   │   │   ├── callAPI.ts              # Axios HTTP adapter
│   │   │   └── index.ts                # Tool registry (MCP-ready interface)
│   │   └── routes/
│   │       ├── workflows.ts            # CRUD routes
│   │       └── executions.ts           # Run + log routes
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Workflow list
│   │   │   ├── builder/[id]/
│   │   │   │   └── page.tsx            # Canvas builder
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── nodes/
│   │   │   │   ├── TriggerNode.tsx     # 🟢 Trigger node
│   │   │   │   ├── AINode.tsx          # 🟣 AI step node
│   │   │   │   ├── APINode.tsx         # 🟡 API call node
│   │   │   │   ├── ConditionNode.tsx   # 🔴 Condition node
│   │   │   │   └── OutputNode.tsx      # ⚫ Output node
│   │   │   ├── workflow/
│   │   │   │   ├── Canvas.tsx          # React Flow wrapper
│   │   │   │   ├── Toolbar.tsx         # Add node buttons
│   │   │   │   └── RunButton.tsx       # Trigger execution
│   │   │   └── logs/
│   │   │       └── ExecutionPanel.tsx  # SSE log consumer + display
│   │   ├── lib/
│   │   │   ├── api.ts                  # Typed fetch wrappers
│   │   │   └── serialize.ts            # React Flow → workflow JSON
│   │   └── store/
│   │       └── workflowStore.ts        # Zustand workflow state
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example
├── LICENSE
└── README.md
```

---

## 🧪 Example Workflows

Three production workflows ship with the repo. Open them from the workflow list on first launch.

### 01 — Summarize + Slack Notify
Summarize any text with AI, detect urgency via a condition branch, and POST to Slack if flagged.

```
Trigger → AI: Summarize (gpt-4o-mini) → Condition: Is urgent? ──true──→ API: POST to Slack → Output
                                                                └─false─→ Output
```

### 02 — Customer Feedback Analyzer
Classify sentiment, extract action items with a second AI pass, then push structured results to Notion.

```
Trigger → AI: Classify sentiment → AI: Extract action items → API: POST to Notion → Output
```

### 03 — Content Pipeline
Generate a blog outline with one AI node, then pass that outline as context into a second AI node to write the intro.

```
Trigger → AI: Generate outline → AI: Write intro from {{prev.output}} → Output
```

---

## ⚙️ Stack Decisions

**Frontend**

| Package | Version | Why |
|---------|---------|-----|
| [Next.js](https://nextjs.org/) | 14 (App Router) | File-based routing, React Server Components, zero config |
| [React Flow](https://reactflow.dev/) | latest | Canvas rendering only — no business logic lives here |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Utility-first, fast iteration |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety across the full stack |
| [Zustand](https://zustand-demo.pmnd.rs/) | 4.x | Workflow state — no Redux ceremony needed at this scale |

**Backend**

| Package | Version | Why |
|---------|---------|-----|
| [Express.js](https://expressjs.com/) | 4.x | Larger ecosystem, easier to debug than Fastify |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Same types shared with frontend |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | latest | Zero setup, file-based, synchronous API — perfect for MVP |
| [OpenAI SDK](https://github.com/openai/openai-node) | v4 | Official SDK, streaming-ready for v2 |
| [Axios](https://axios-http.com/) | latest | HTTP adapter for API call nodes |

**Communication** — REST + Server-Sent Events (SSE) for live execution streaming. No WebSockets, no polling. SSE is 20 lines of code and solves the real-time log problem cleanly.

**Storage** — SQLite for MVP. Schema is intentionally portable — migration to Postgres requires no logic changes, only driver swap.

---

## 🔑 Environment Variables

```env
# ─── Backend (.env) ──────────────────────────────────────────
OPENAI_API_KEY=sk-...          # Required. Your OpenAI API key.
PORT=3001                      # Port for the Express server.
DB_PATH=./data/workflows.db    # Path to the SQLite database file.

# ─── Frontend (.env.local) ───────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:3001   # Backend URL for client-side fetch.
```

A `.env.example` file is included in the repo root. Copy it to `backend/.env` and fill in your values.

---

## ✅ What's in v1 / What's Not

### In v1

- Visual canvas — React Flow with 5 node types
- `{{prev.output}}` context passing across all node types
- Sequential + conditional execution (true/false branches)
- Per-step execution trace — input, output, duration, status, retry count
- 1× auto-retry on step failure
- SSE real-time log streaming
- SQLite persistence — workflows survive page reload
- 3 prebuilt example workflows ready to fork and run
- Local-only — no auth, no accounts, no cloud required

### Not in v1

- Cron / webhook triggers
- User authentication + multi-tenancy
- Parallel execution branches
- Sub-workflows / nested pipelines
- Other LLM providers (Anthropic, Google Gemini, etc.)
- Streaming LLM token responses
- MCP server integration
- Cloud / hosted deployment
- Versioned workflow history
- Team collaboration

These are intentional exclusions. The v1 goal is a clean, debuggable core — not a feature surface.

---

## 🤝 Contributing

This is an early-stage MVP. The codebase is intentionally simple — one Express server, one Next.js app, one SQLite file.

**Before opening a PR:**

1. Check [open issues](https://github.com/ThatKJ/orquestra-os/issues) to avoid duplicating work
2. For new features, open an issue first — the v1 scope boundary is intentional
3. For bug fixes, a PR with a clear description is enough

**Workflow:**

```bash
git checkout -b fix/your-thing   # or feat/your-thing
# make your change
git commit -m "fix: clear description of what and why"
git push origin fix/your-thing
# open a PR
```

**Commit convention** — `fix:` · `feat:` · `refactor:` · `docs:` · `chore:`

---

## 📄 License

MIT — do whatever you want with it. Attribution appreciated but not required.

---

<div align="center">

Built in public · June 2026

[Website](https://orquestra-os.vercel.app) · [Waitlist](https://orquestra-os.vercel.app/#waitlist) · [Issues](https://github.com/ThatKJ/orquestra-os/issues)

</div>