# Unified Demo Route Map — 42.28

Stream: 42.28 — Unified Live Runtime Surface Certification
Date: 2026-03-25

---

## Unified Surface Status: PARTIAL

Active live runtime covers 51.3 steps 1–6 and 8–9.
Steps 7–9 persona/ENL: composition layer only (DemoController: 7 steps, no PersonaPanel).
ENL routes wired but adapters absent — return 400.

---

## 9-Step Route Map

### Step 1 — Entry

| Field | Value |
|---|---|
| Route | none |
| Adapter | none |
| Visible outcome | Verbal framing — "evidence-first, no inference" |
| Governed source | docs/pios/51.3/DEMO_CONTEXT.md |
| Live today | YES |

---

### Step 2 — Query Selection

| Field | Value |
|---|---|
| Route | `GET /api/execlens?list=true` |
| Adapter | ADAPTER_42_4 (--list) |
| Visible outcome | List of 10 governed queries; GQ-003 selected |
| Governed source | 41.5 query_signal_map.json → 42.4 → 42.1 |
| Live today | YES — 200 PASS |

---

### Step 3 — Structural Overview

| Field | Value |
|---|---|
| Route | `GET /api/execlens?overview=true` |
| Adapter | ADAPTER_42_6 |
| Visible outcome | 4 gauge metrics: dependency_load, structural_density, coordination_pressure, visibility_deficit |
| Governed source | SIG-002/003/004/005 via 41.4 signal registry → 42.6 → 42.1 |
| Live today | YES — 200 PASS |

---

### Step 4 — Topology Rendering

| Field | Value |
|---|---|
| Route | `GET /api/execlens?topology=true` |
| Adapter | ADAPTER_42_7 |
| Visible outcome | Full hierarchy: 4 domains, 5 capabilities, 9 components; C_30_Domain_Event_Bus renders RED |
| Governed source | 41.x query templates → co-occurrence hierarchy; 44.2 projection_attachment.json (emphasis) |
| Live today | YES — 200 PASS |
| Emphasis active | C_30_Domain_Event_Bus — emphasis:high → topo-emphasis-red |

---

### Step 5 — Highlight Focus

| Field | Value |
|---|---|
| Route | `GET /api/execlens?topology=true&highlight=GQ-003` |
| Adapter | ADAPTER_42_7 (--query GQ-003) |
| Visible outcome | Topology with highlighted=true on GQ-003 entities; blue/yellow/teal classes active |
| Governed source | Drill-down section of GQ-003 template → highlight_entities set → per-entity highlighted flag |
| Live today | YES — 200 PASS |

---

### Step 6 — Emphasis Activation

| Field | Value |
|---|---|
| Route | (topology already loaded — no additional call) |
| Adapter | ADAPTER_42_7 (emphasis field already in response) |
| Visible outcome | C_30_Domain_Event_Bus shows red border/background (topo-emphasis-red) |
| Governed source | docs/pios/44.2/projection_attachment.json → C_30_Domain_Event_Bus emphasis:high → 42.27 rendering |
| Live today | YES — confirmed in live baseline snapshot |

**Coexistence verified:**
- Topology structure: ACTIVE ✓
- Query highlight (GQ-003): ACTIVE ✓
- Red-node emphasis (C_30_Domain_Event_Bus): ACTIVE ✓
- All three visible simultaneously in same `?topology=true&highlight=GQ-003` response ✓

---

### Step 7 — Persona Selection

| Field | Value |
|---|---|
| Route | none (presentation layer) |
| Adapter | none |
| Visible outcome | Presenter announces persona (Exec/CTO/Analyst) — verbal only |
| Governed source | docs/pios/51.3/demo_sequence.md — ENL substrate persona definitions |
| Live today | YES (presentation layer) |
| ENL runtime | NOT AVAILABLE — ADAPTER_42_16 absent; `?persona=` returns 400 |

---

### Step 8 — ENL Lens Application

| Field | Value |
|---|---|
| Route | `GET /api/execlens?query=GQ-003` (standard query — same as Step 2 result) |
| Adapter | ADAPTER_42_4 |
| Visible outcome | Query response, signals, evidence loaded; presenter applies persona framing verbally |
| Governed source | 41.4 signal registry + response templates → 42.4; framing from demonstration_exec_intelligence.md |
| Live today | YES (query live; ENL routing composition-only) |
| ENL runtime | NOT AVAILABLE — ADAPTER_42_15 absent; `?enl=` returns 400 |

---

### Step 9 — Executive Narrative

| Field | Value |
|---|---|
| Route | (query response already loaded from Step 8) |
| Adapter | ADAPTER_42_4 (data already present) |
| Visible outcome | Signals panel + Evidence panel + Navigation panel; presenter delivers narrative |
| Governed source | demonstration_exec_intelligence.md (Program Situation → Evidence Basis → Intelligence Interpretation → Executive Implications) |
| Live today | YES |

---

## Coexistence Matrix

| Capability | Implementation | Live |
|---|---|---|
| Topology structure | 42.7 adapter → DomainBlock/CapabilityGroup/EntityChip | YES |
| Query highlight | 42.7 --query arg → highlighted flags → topo-*-highlighted CSS | YES |
| Red-node emphasis | 44.2 projection → 42.7 emphasis field → topo-emphasis-red CSS | YES |
| ENL/persona (live routing) | 42.15/42.16 adapters | **NOT AVAILABLE** |
| ENL/persona (composition) | Presenter framing over query response | YES |

**Conclusion:** Topology + highlight + red-node emphasis coexist in a single `?topology=true&highlight=GQ-003` response. ENL/persona coexistence is composition-layer only — live routing requires 42.15/42.16 activation (separate 42.x stream).

---

## Unified Surface Assessment

**PARTIAL** — not COMPLETE.

What is live and unified:
- Single GQ-003 flow from query selection through emphasis activation (Steps 1–6): FULLY OPERATIONAL
- Executive narrative (Steps 8–9): FULLY OPERATIONAL via existing query response

What is not live:
- DemoController still on 7-step (42.9) sequence — not updated to 9-step
- PersonaPanel component: absent
- ENL routing: adapters absent (42.13/42.15/42.16)
- Live persona-scoped response: requires 42.x wiring stream

Required for COMPLETE unified surface:
1. 42.x stream: activate ADAPTER_42_15 (enl) and ADAPTER_42_16 (persona)
2. 42.x stream: extend DemoController to 9-step sequence (42.8 update)
3. 42.x stream: implement PersonaPanel component
