# PIOS-42.9-RUN01-CONTRACT-v1
## ExecLens Packaging & Demo Distribution Layer

**Run:** run_01_blueedge
**Layer:** 42.9 — Distribution packaging (documentation only)
**Status:** PASS — all 19 validation checks passed

---

## Deliverables

| Deliverable | Path | Purpose |
|-------------|------|---------|
| Root README | `README.md` | Quick start (≤5 steps), architecture overview |
| Environment contract | `app/execlens-demo/.env.example` | Clear env config, no secrets required |
| Technical setup guide | `DEMO_SETUP.md` | Node/Python requirements, install, run, Obsidian validation |
| Demo runbook | `DEMO_RUNBOOK.md` | 3-minute stakeholder script with exact click points |
| Context document | `DEMO_CONTEXT.md` | What ExecLens is / is not, evidence-first guarantee |
| Package validator | `scripts/pios/42.9/validate_demo_package.py` | 19/19 PASS |
| Contract record | `docs/pios/contracts/42.9/PIOS-42.9-RUN01-CONTRACT-v1.md` | This file |

---

## Quick Start (from README.md)

```bash
git clone <repo-url> && cd krayu-program-intelligence
cd app/execlens-demo
npm install
cp .env.example .env.local          # set NEXT_PUBLIC_OBSIDIAN_VAULT_NAME=pie_vault
npm run dev
# → http://localhost:3000
```

Click **"Start ExecLens Demo"** → guided 3-minute walkthrough.

---

## Demo Runbook Summary

| Step | Focus | Auto-action |
|------|-------|-------------|
| 1 System | Overview gauge strip | scroll + spotlight |
| 2 Structure | Topology panel | scroll + spotlight |
| 3 Query | Query selector | scroll + spotlight + auto-select GQ-003 |
| 4 Signals | Signal grid | scroll + spotlight |
| 5 Evidence | Evidence chains | scroll + spotlight |
| 6 Navigate | Navigation panel | scroll + spotlight |
| 7 Complete | Full page | scroll to top |

Total: ~3 minutes. Keyboard: `→` / `Enter` = next, `Escape` = exit.

---

## Portability Guarantees

| Requirement | Implementation |
|-------------|---------------|
| No external services | All data from local 41.x artifacts via Python adapters |
| No secrets required | Only optional vault name in .env.local |
| No network at runtime | Next.js API calls localhost Python only |
| Reproducible | Same input → same output (deterministic) |
| Self-documenting | DEMO_CONTEXT explains every claim |

---

## Full Stream Validation Chain (post 42.9)

| Stream | Validator | Result |
|--------|-----------|--------|
| 42.4 | validate_demo_surface.py | 20/20 PASS |
| 42.5 | validate_demo_refinement.py | 18/18 PASS |
| 42.6 | validate_overview_adapter.py | 20/20 PASS |
| 42.7 | validate_topology_panel.py | 22/22 PASS |
| 42.8 | validate_demo_choreography.py | 21/21 PASS |
| 42.9 | validate_demo_package.py | 19/19 PASS |

**Total: 120/120 checks passed across the complete 42.x stream chain.**

---

## Handover

**Stream A** — Case Study (BlueEdge narrative)
**Stream B** — Commercial Packaging (Starter Package / Offer)

ExecLens run_01_blueedge is complete, governed, validated, and distribution-ready.
