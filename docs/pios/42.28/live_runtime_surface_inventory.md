# Live Runtime Surface Inventory — 42.28

Stream: 42.28 — Unified Live Runtime Surface Certification
Date: 2026-03-25
Branch: feature/42-28-runtime-certification
Source: app/execlens-demo/pages/api/execlens.js

---

## Active Routes

| Route | Param | Handler | Adapter | Status |
|---|---|---|---|---|
| `?overview=true` | overview | runScript | ADAPTER_42_6 | ACTIVE — 200 PASS |
| `?topology=true` | topology | runScript | ADAPTER_42_7 | ACTIVE — 200 PASS |
| `?topology=true&highlight=GQ-XXX` | topology + highlight | runScript | ADAPTER_42_7 | ACTIVE — 200 PASS |
| `?list=true` | list | runScript | ADAPTER_42_4 --list | ACTIVE — 200 PASS |
| `?query=GQ-XXX` | query | runScript | ADAPTER_42_4 GQ-XXX | ACTIVE — 200 PASS |

---

## Adapter Mapping

| Constant | Script Path | Present | Used in dispatch |
|---|---|---|---|
| ADAPTER_42_4 | scripts/pios/42.4/execlens_adapter.py | YES | YES (query + list) |
| ADAPTER_42_6 | scripts/pios/42.6/execlens_overview_adapter.py | YES | YES (overview) |
| ADAPTER_42_7 | scripts/pios/42.7/execlens_topology_adapter.py | YES | YES (topology) |
| ADAPTER_42_23 | scripts/pios/42.23/execlens_wowchain_adapter.py | YES | NO — constant declared, no dispatch branch |
| ADAPTER_42_13 | scripts/pios/42.13/demo_activate.py | **ABSENT** | YES — ?status route dispatches to absent script |
| ADAPTER_42_15 | scripts/pios/42.15/enl_console_adapter.py | **ABSENT** | YES — ?enl route dispatches to absent script |
| ADAPTER_42_16 | scripts/pios/42.16/persona_view_map.py | **ABSENT** | YES — ?persona route dispatches to absent script |

---

## Demo Usage (51.3 Unified Flow)

| 51.3 Step | Route Used | Live Today |
|---|---|---|
| 1 — Entry | none | YES (verbal) |
| 2 — Query Selection | `?list=true` | YES |
| 3 — Structural Overview | `?overview=true` | YES |
| 4 — Topology Rendering | `?topology=true` | YES |
| 5 — Highlight Focus | `?topology=true&highlight=GQ-003` | YES |
| 6 — Emphasis Activation | (topology response carries emphasis:high) | YES |
| 7 — Persona Selection | none (presentation layer) | YES (no runtime) |
| 8 — ENL Lens | `?query=GQ-003` / composition | YES (query live; ENL composition only) |
| 9 — Executive Narrative | (query response loaded) | YES |

---

## Declared But Unused / Non-Functional Routes

| Route | Reason | Live Status |
|---|---|---|
| `?status=true` | ADAPTER_42_13 script absent — execFile fails → 400 | 400 BAD REQUEST |
| `?enl=GQ-XXX` | ADAPTER_42_15 script absent — execFile fails → 400 | 400 BAD REQUEST |
| `?persona=P&query=GQ-XXX` | ADAPTER_42_16 script absent — execFile fails → 400 | 400 BAD REQUEST |

These routes are wired in execlens.js (input validation, sanitization, dispatch logic present)
but return 400 because the underlying adapter scripts are not present in this branch.
Routes are not used in the 51.3 unified live demo sequence.

---

## DemoController State

File: app/execlens-demo/components/DemoController.js
Contract: PIOS-42.8-RUN01-CONTRACT-v1
Steps: 7 (System, Structure, Query, Signals, Evidence, Navigate, Complete)

The DemoController does not yet implement the 51.3 9-step sequence.
It does not include persona selection, ENL lens, or emphasis activation as discrete steps.
PersonaPanel component: ABSENT from app/execlens-demo/components/

The 51.3 runbook operates as a presenter script over the existing DemoController.
Runtime choreography alignment to 9-step sequence is a future 42.x wiring dependency.

---

## ADAPTER_42_23 Deviation (on record from 42.26)

ADAPTER_42_23 constant is declared in execlens.js but has no active dispatch branch.
The topology route dispatches to ADAPTER_42_7 (correct per 42.24/42.25 parity restoration).
This deviation was documented in 42.26 CLOSURE.md as non-mutating scope.
Status: unchanged — still on record, not corrected.
