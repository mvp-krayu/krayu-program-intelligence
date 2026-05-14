# Governance Trace — 41.x Pressure Zone Projection
## PI.41X.PRESSURE-ZONE.PROJECTION.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.PRESSURE-ZONE.PROJECTION.01  
**Layer:** 41.x — Projection Package  
**Source Layer:** 75.x — Pressure Zone Designation  
**Run:** run_01_oss_fastapi  
**Client:** e65d2f0a-dfa7-4257-9333-fcbb583f0880  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## 1. Boundary Contract Compliance

This contract crosses from L2 (PiOS Core — 75.x) to L3 (Semantic/Delivery layer — 41.x).

**reference_boundary_contract.md:** LOADED  
**Layer transition:** L2 → L3 — permitted; L3 may reformat/aggregate; MUST NOT alter computed values or create new signals.  
**Compliance:** CONFIRMED — projection is read-only derivation from 75.x state; no values altered; no new signal IDs introduced.

**4_BRAIN_ALIGNMENT:** Not triggered — this contract produces no Product definition, no commercial artifact, no Publish-layer output, and makes no cross-layer claims from evidence to Product/Publish. Internal evidence-to-semantic-layer transformation only.

---

## 2. Branch Governance

**Branch:** work/psee-runtime  
**Authorized branches per git_structure_contract.md:** main, feature/pios-core, feature/activation, feature/runtime-demo, feature/governance  
**Status:** VIOLATION FLAGGED — work/psee-runtime is not in the authorized branch set  
**Resolution:** Per established execution pattern (memory: feedback_branch_violation.md), flag violation and proceed. Contract-specified branch used as given.

---

## 3. Phase A — Pre-flight Cross-Reference Validation

**Input artifacts validated:**
- `75.x/condition_correlation_state.json` — JSON VALID ✓
- `75.x/pressure_candidate_state.json` — JSON VALID ✓
- `75.x/pressure_zone_state.json` — JSON VALID ✓
- `75.x/75x_runtime_manifest.json` — JSON VALID ✓

**Cross-reference chain (conditions → candidates → zones):**

| Condition ID | Signal | Candidate IDs | Zone IDs | Chain Status |
|---|---|---|---|---|
| COND-PSIG-001-01 | PSIG-001 | PC-001, PC-002, PC-003, PC-004, PC-005, PC-006 | PZ-001, PZ-002, PZ-003 | INTACT |
| COND-PSIG-002-01 | PSIG-002 | PC-004, PC-005, PC-006 | PZ-001, PZ-002, PZ-003 | INTACT |
| COND-PSIG-004-01 | PSIG-004 | PC-001, PC-002, PC-003, PC-004, PC-005, PC-006 | PZ-001, PZ-002, PZ-003 | INTACT |
| COND-PSIG-006-01 | PSIG-006 | none (not a candidate) | none | INTACT |

**Manifest cross-check:**
- zone_ids in manifest: ["PZ-001", "PZ-002", "PZ-003"] — matches pressure_zone_state.json ✓
- total_candidates in manifest: 6 — matches pressure_candidate_state.json ✓
- active_conditions_in_scope: 4 conditions — matches condition_correlation_state.json ✓

**Phase A result: PASS**

---

## 4. Phase B — 41.x Projection Package

**Output path:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/`

| File | Description | Source | Validation |
|---|---|---|---|
| `pressure_zone_projection.json` | Flat-schema normalized projection of 3 COMPOUND_ZONEs | pressure_zone_state.json | JSON VALID |
| `signal_projection.json` | 41.x-normalized condition/signal view; 4 active conditions; PSIG-XXX authority | condition_correlation_state.json | JSON VALID |
| `projection_manifest.json` | Package manifest with reinjection analysis | 75x_runtime_manifest.json | JSON VALID |

**Governance rules applied:**
- No conditions recomputed
- No signals recomputed
- No new SIG-XXX IDs introduced (all PSIG-XXX provisional)
- No ranking applied
- No focus domain selected
- No interpretation applied
- 75.x state not modified

---

## 5. Phase C — Reinjection Forensics

### WHERE: Identified Consumption Paths

**Zone artifact consumption:**
- `app/gauge-product/pages/api/zones.js:25` → executes `scripts/pios/tier2_query_engine.py --list-zones` (contract: TIER2.RUNTIME.QUERY.ENGINE.01)
- This is the nearest consumer for zone data; `pressure_zone_projection.json` is not yet wired to this path

**Signal artifact consumption:**
- `app/gauge-product/pages/api/signals.js:18,35` → reads `docs/pios/41.4/signal_registry.json` (contract: GAUGE.RUNTIME.SIGNAL.VISIBILITY.01)
- `scripts/pios/42.6/execlens_overview_adapter.py:53-63` → imports 42.2 → 42.1 → signal_registry.json
- `scripts/pios/lens_report_generator.py:1839` → reads `clients/<id>/psee/runs/<run_id>/package/signal_registry.json`
- `signal_projection.json` is a parallel run-specific artifact; does not replace global `docs/pios/41.4/signal_registry.json`

**Projection fragment consumption:**
- `app/gauge-product/pages/api/projection.js:32,92` → reads from `PROJECTION_FRAGMENTS_DIR` (contract: PRODUCTIZE.LENS.PROJECTION.RUNTIME.01)
- `scripts/pios/projection_runtime.py:333-347` → searches for signal_registry.json in `clients/<id>/psee/runs/run_authoritative_recomputed_01/package/`

### REINJECTION POINT

| Artifact | Reinjection Point | Entry File | Requires |
|---|---|---|---|
| `pressure_zone_projection.json` | `zones.js:25` → `tier2_query_engine.py --list-zones` | `app/gauge-product/pages/api/zones.js` | tier2_query_engine.py extension to read from clients/.../41.x/ |
| `signal_projection.json` | `signals.js:35` (parallel, not replacement) | `app/gauge-product/pages/api/signals.js` | New route or run-specific signal endpoint |
| Both | `lens_report_generator.py:1831-1847` | `report.js:73` | CANONICAL_PKG_DIR extension to include 41.x artifacts |

### WHEN

- Zone data: consumed at GET /api/zones request time
- Signal data: consumed at GET /api/signals and /api/execlens?overview=true request time
- Report data: consumed at GET /api/report (lens_report_generator.py execution time)
- Injection must precede report generation; package/ directory population is the established injection pattern

### HOW

- Existing pattern: `clients/<id>/psee/runs/<run_id>/package/` is the canonical injection point for runtime consumption artifacts (gauge_state.json, signal_registry.json, canonical_topology.json, coverage_state.json, reconstruction_state.json)
- 41.x artifacts (run-specific) should be placed in `clients/<id>/psee/runs/<run_id>/package/` OR referenced via the 41.x run-relative path — a new routing contract is required to make this choice
- Validation rule in `scripts/pios/42.3/validate_delivery_layer.py` (AC-04) and `scripts/pios/42.6/validate_overview_adapter.py` (R-10) prohibit direct 41.x file access in 42.x layers — consumption must go through an adapter

### SAFE TO PROCEED

**SAFE TO PROCEED: YES**

- The 41.x projection package is correctly written and governance-compliant
- No existing consumers are broken (no existing code reads `pressure_zone_projection.json` by name)
- The reinjection path (tier2_query_engine.py) requires a separate extension contract — NOT in scope of this contract
- The package is agentic AI read-only consumption ready now; runtime API wiring is deferred

### BLOCKERS

None that block this contract. Downstream wiring requires:
1. A new contract to extend `tier2_query_engine.py` to read from `41.x/pressure_zone_projection.json`
2. A new contract to expose `signal_projection.json` via `/api/signals` (run-scoped endpoint)

---

## 6. Validation Summary

| Check | Result |
|---|---|
| reference_boundary_contract.md loaded | PASS |
| L2→L3 layer transition permitted | PASS |
| Phase A cross-reference validation | PASS |
| All 4 source JSON files valid | PASS |
| All 3 output JSON files valid | PASS |
| No new signals introduced | PASS |
| No values recomputed | PASS |
| No ranking applied | PASS |
| No focus domain selected | PASS |
| Reinjection forensics based on actual code paths | PASS |
| Branch violation flagged | FLAGGED (work/psee-runtime) |

---

## 7. Governance Confirmation

- No docs/pios/ files modified
- No code files modified
- No 75.x state files modified
- No conditions recomputed
- No signals recomputed
- No upstream artifacts modified
- All outputs derived from 75.x runtime state (condition_correlation_state.json, pressure_zone_state.json)
- All reinjection findings reference actual code paths (no guessing)
