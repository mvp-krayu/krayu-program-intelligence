# Krayu — Program Intelligence

Evidence-first system for program diagnosis, structural risk, and execution visibility.

---

## ExecLens Demo — Quick Start

**Prerequisites:** Node ≥ 18, Python 3.9+

```bash
# 1. Clone
git clone <repo-url>
cd krayu-program-intelligence

# 2. Install
cd app/execlens-demo
npm install

# 3. Configure Obsidian (optional — enables deep links)
cp .env.example .env.local
# Edit .env.local: set NEXT_PUBLIC_OBSIDIAN_VAULT_NAME=pie_vault

# 4. Run
npm run dev

# 5. Open
open http://localhost:3000
```

Click **"Start ExecLens Demo"** on the landing page to begin the guided 3-minute walkthrough.

→ Full setup: [DEMO_SETUP.md](DEMO_SETUP.md)
→ Demo script: [DEMO_RUNBOOK.md](DEMO_RUNBOOK.md)
→ What this is: [DEMO_CONTEXT.md](DEMO_CONTEXT.md)

---

## What This Repository Contains

| Area | Description |
|------|-------------|
| `docs/` | Program Intelligence discipline, framework, governance |
| `docs/pios/41.2/pie_vault/` | BlueEdge PIE vault — canonical architecture artifacts |
| `docs/pios/41.4/` | Signal registry and evidence mapping index |
| `docs/pios/41.5/` | Query definitions and response templates |
| `scripts/pios/42.x/` | ExecLens execution layers (42.1–42.8) |
| `app/execlens-demo/` | ExecLens browser demo surface (Next.js) |
| `docs/pios/contracts/` | PiOS execution contract records |

---

## Architecture

```
Browser (Next.js)
  └── /api/execlens
        ├── scripts/pios/42.4/execlens_adapter.py       (query execution)
        ├── scripts/pios/42.6/execlens_overview_adapter.py (landing metrics)
        └── scripts/pios/42.7/execlens_topology_adapter.py (topology panel)
              └── scripts/pios/42.2/render_executive_narrative.py
                    └── scripts/pios/42.1/run_execlens_query.py
                          └── docs/pios/41.x/  (locked canonical artifacts)
```

All data flows deterministically from locked 41.x artifacts.
No inference. No synthetic data. No external services.

---

## Program Intelligence Discipline

Program Intelligence translates observable program execution evidence into execution
signals that reveal the real delivery state of complex programs.

This repository contains the intellectual foundation of the discipline:

- Program Intelligence framework and body of knowledge
- Signal Science execution signal model
- Governance and operating model
- ExecLens demonstration system (run_01_blueedge)
