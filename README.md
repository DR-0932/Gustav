# Orin

Gustav is a Lovable-style AI app builder,you
describe an app in plain language, and an agent scaffolds and builds it live inside an isolated cloud
sandbox, streaming its progress to your browser and serving the running app back in an iframe.


## How it works

```
browser (apps/web) ──prompt──▶ Elysia server (apps/api) ── live session per project (SSE, replayable)
     ▲                              │
     │                              ▼
 event feed +                 Agent loop ──▶ LLMProvider ──▶ OpenAI-compatible (DeepSeek, Gemini)
 <iframe> preview                  │                     └─▶ Claude (Messages API)
     │                              ▼
     └───── preview URL ◀── E2B sandbox ── round boundary ──▶ git bundle ──▶ Redis queue ──▶ R2
                                                         └──▶ context rows ──▶ Postgres
```



## Layout

| Path | What it is |
|---|---|
| `apps/api` | Agent orchestration + the Elysia SSE server. The heart of the project. |
| `packages/*` | Shared `ui`, `eslint-config`, and `typescript-config`. |

## Getting started

Prerequisites: [Bun](https://bun.sh), an [E2B](https://e2b.dev) account + API key, and a
[DeepSeek](https://platform.deepseek.com) API key.

```sh
bun install
```

Set the API keys (Bun auto-loads `.env` from each app's own directory):

```sh
# apps/api/.env
DEEPSEEK_API_KEY=...
E2B_API_KEY=...

# apps/orin-react-workspace/.env
E2B_API_KEY=...
```

Build the sandbox template once (produces the image the agent boots from):

```sh
cd apps/orin-react-workspace && bun run e2b:build:dev
```

### Run it

From the CLI (one-shot build, logs to stdout):

```sh
cd apps/api && bun src/agent/run.ts
```

With a live preview (keeps the sandbox alive and prints a browser URL):

```sh
cd apps/api && bun src/agent/preview.ts
```

In the browser (two terminals):

```sh
cd apps/api && bun src/server.ts   # agent SSE server → http://localhost:4000
cd apps/web && bun run dev         # UI → http://localhost:5173
```

Then open http://localhost:5173, enter a prompt, and watch it build.

## Stack

Bun + Turborepo · Vite + React · Elysia (SSE) · E2B (sandboxes) · PostgreSQL + Drizzle · Redis ·
Cloudflare R2 · OpenAI-compatible and Claude APIs · Kubernetes (GKE)
