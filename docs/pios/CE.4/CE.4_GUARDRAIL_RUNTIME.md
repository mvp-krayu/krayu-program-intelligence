# CE.4 — Guardrail Runtime

**Stream:** CE.4 — Enforcement & Runtime Guard System
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.4_ENFORCEMENT_MODEL.md, CE.3_INTERFACE_CONTRACTS.md

---

## 1. Guard Types

| Guard Type | Behavior | When Used |
|---|---|---|
| HARD STOP | Execution blocked immediately; no output produced or passed | Input contract mismatch, run_id missing, hash mismatch, pre-computed signal in handoff |
| SOFT FAIL | Layer produces PARTIAL output; flags failure in output; downstream receives PARTIAL state | Missing observation with declared null, NF UNDEFINED, PES UNDEFINED |
| WARNING | Execution continues; flag logged; no blocking | Untracked paths in git state, non-critical metadata missing, DVT-14 WARN (harness mode) |

No other guard types exist. Every enforcement outcome must be exactly one of these three.

---

## 2. Guard Execution Hooks

Guards are attached at defined execution hooks. Each hook is a deterministic check point that fires before or after a specific layer transition.

| Hook ID | Trigger Point | Guard Type Possible | Checks Fired |
|---|---|---|---|
| GH-01 | Before 40.5 executes | HARD STOP | IV1-01..IV1-08 (I1 validation); BV-08; FF-01 |
| GH-02 | 40.5 → 40.6 handoff | HARD STOP, SOFT FAIL | NF range check; ESI mode validity; run_id presence; PARTIAL propagation |
| GH-03 | 40.6 → 40.7 handoff | HARD STOP, SOFT FAIL | Condition activation record present; PARTIAL flags from 40.5 preserved |
| GH-04 | 40.7 → 40.8 handoff | HARD STOP, SOFT FAIL | Diagnosis structure present; evidence lineage fields populated; no prose fields |
| GH-05 | 40.8 → 40.9 handoff | HARD STOP, SOFT FAIL | Delivery package present; manifest complete; PARTIAL flags intact |
| GH-06 | 40.9 → 40.10 handoff | HARD STOP, SOFT FAIL | Feedback registration record present; gap log complete |
| GH-07 | 40.10 → 40.11 handoff | HARD STOP, SOFT FAIL | Orchestration directives present; rule references declared |
| GH-08 | After 40.11 (post-Core) | HARD STOP | IV2-01..IV2-08 (I2 validation); run_id consistency; traceability chain |
| GH-09 | Before 41.x begins | HARD STOP | Loop closure assertion COMPLETE or PARTIAL; all Core artifacts present |
| GH-10 | Before 42.x renders | HARD STOP | IV3-01..IV3-08 (I3 validation); L5 payload schema; PARTIAL flags present |

---

## 3. Blocking vs Non-Blocking Behavior

| Condition | Blocking | Non-Blocking |
|---|---|---|
| Input contract hash mismatch | YES — GH-01 HARD STOP | — |
| run_id missing | YES — GH-01 HARD STOP | — |
| Pre-computed signal in handoff | YES — GH-01 HARD STOP | — |
| NF value UNDEFINED (input missing) | NO — SOFT FAIL; propagate | — |
| ESI PARTIAL mode (CG-01 active) | NO — SOFT FAIL; document | — |
| PARTIAL flag stripped by downstream | YES — GH-08 or GH-10 HARD STOP | — |
| Loop closure FAIL | YES — GH-09 HARD STOP | — |
| Untracked git paths present | NO | WARNING only |
| DRIFT-001 detected in production path | YES — GH-01 HARD STOP | — |
| Signal value out of range | YES — GH-02 HARD STOP | — |
| Reverse flow detected | YES — applicable hook HARD STOP | — |

---

## 4. Fail-Closed Behavior

The enforcement system defaults to BLOCK in all ambiguous cases.

Ambiguous cases include:
- Guard check produces indeterminate result (e.g., file not found, unexpected format)
- Guard check cannot be completed due to missing prerequisite data
- Enforcement script itself errors

In all ambiguous cases:
- Execution is blocked
- The blocking event and reason are logged
- No output is passed to the next layer

The enforcement system does NOT:
- Assume a check passed if the check could not run
- Attempt to infer correctness from partial evidence
- Allow execution to continue with unresolved guard state

---

## 5. No Silent Violations

Every guard activation must produce a logged, structured enforcement record containing:

| Field | Content |
|---|---|
| hook_id | Which hook fired (GH-01..GH-10) |
| guard_type | HARD STOP / SOFT FAIL / WARNING |
| violation_id | CE.3 BV/FF/VD ID or CE.4 GH check ID |
| layer | Which Core layer or boundary was involved |
| field | Which artifact field or artifact triggered the guard |
| outcome | BLOCKED / PARTIAL / FLAGGED |
| timestamp | UTC timestamp of enforcement event |

Silent violations — where a guard fires but produces no record — are forbidden.
