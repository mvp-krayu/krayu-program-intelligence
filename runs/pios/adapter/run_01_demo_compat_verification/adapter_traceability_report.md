# Adapter Traceability Report

**run_id:** run_01_demo_compat_verification
**date:** 2026-04-01
**adapter:** pios/core/v0.1/adapters/demo_compat/map_core_to_demo.py

---

## Traceability Chain

Full derivation chain from raw static telemetry to demo-compatible signal output:

```
40.4 static structural telemetry
  → 40.5 compute_signals.py (Core signal computation)
    → 40.6 activate_conditions.py (Condition activation + Diagnosis)
      → 40.7 synthesize_intelligence.py (Intelligence synthesis)
        → adapters/demo_compat/map_core_to_demo.py (Demo compatibility mapping)
          → demo_compat_output.json (5 demo-compatible signal entries)
```

---

## Per-Signal Derivation

### SIG-001 — Sensor Bridge Throughput Ceiling

| Layer | Identifier | State | Value |
|---|---|---|---|
| 40.4 | DIM-PC-001 (polling cycle) / DIM-PC-002 (records per cycle) | static | 30s / 10 records |
| 40.5 | SIG-006 (Execution Stability, CKR-011) | BLOCKED | live pipeline events unavailable |
| 40.6 | COND-006 | blocked | SIG-006 blocked input |
| 40.6 | DIAG-006 | blocked | COND-006 blocked |
| 40.7 | INTEL-006 (Execution Instability) | blocked | DIAG-006 blocked |
| adapter | Demo SIG-001 | synthesis_state=blocked | core_intel_id=INTEL-006 (COND-006 cross-ref) |
| 41.4 | SIG-001 registry | title/statement/domain/evidence | verbatim carry (A7, A8) |

### SIG-002 — Platform Runtime State

| Layer | Identifier | State | Value |
|---|---|---|---|
| 40.5 | SIG-001..005, SIG-007..008 | PARTIAL / BLOCKED | runtime telemetry unavailable |
| 40.6 | COND-001..005, COND-007..008 | blocked | signal inputs blocked/partial |
| 40.6 | DIAG-001..005, DIAG-007..008 | blocked | conditions blocked/partial |
| 40.7 | INTEL-005 (blocked), INTEL-006 (blocked) | blocked | — |
| adapter | Demo SIG-002 | synthesis_state=synthesized | aggregate A9: blocked INTELs exist → unknown space declared |
| 41.4 | SIG-002 registry | title/statement/domain/evidence | verbatim carry (A7, A8) |

### SIG-003 — Dependency Load

| Layer | Identifier | State | Value |
|---|---|---|---|
| 40.4 | ST-007 (22 nodes), ST-012..015 (15 edges) | static | 15/22 |
| 40.5 | SIG-002 (Dependency Load, CKR-007) | COMPLETE | ratio=0.682, edge_count=15 |
| 40.6 | COND-001 (Dependency Load Elevation) | complete | signal input available |
| 40.6 | DIAG-001 | active | COND-001 complete |
| 40.7 | INTEL-001 (Dependency Load Elevation) | synthesized | components: {dependency_load_ratio: 0.682, dependency_edge_count: 15} |
| adapter | Demo SIG-003 | synthesis_state=synthesized, relevance=HIGH | core_intel_id=INTEL-001 (COND-001 cross-ref) |
| 41.4 | SIG-003 registry | title/statement/domain/evidence | verbatim carry (A7, A8) |

### SIG-004 — Structural Volatility

| Layer | Identifier | State | Value |
|---|---|---|---|
| 40.4 | ST-006..011 (structural telemetry) | static | nodes=22, edges=28, modules=10, zones=8, module_edges=12 |
| 40.5 | SIG-004 (Structural Volatility, CKR-009) | COMPLETE | edge/node=1.273, containment=0.545, responsibility=0.364, module=0.455 |
| 40.6 | COND-002 (Structural Volatility State) | complete | signal input available |
| 40.6 | DIAG-002 | active | COND-002 complete |
| 40.7 | INTEL-002 (Structural Volatility State) | synthesized | components: {total_edge_density: 1.273, containment_density: 0.545, responsibility_density: 0.364, module_density: 0.455} |
| adapter | Demo SIG-004 | synthesis_state=synthesized, relevance=HIGH | core_intel_id=INTEL-002 (COND-002 cross-ref) |
| 41.4 | SIG-004 registry | title/statement/domain/evidence | verbatim carry (A7, A8) |

### SIG-005 — Coordination Pressure

| Layer | Identifier | State | Value |
|---|---|---|---|
| 40.4 | ST-012=7, ST-016=8 (structural); AT-005, AT-007 (event-based, unavailable) | static+blocked | 7/8=0.875 static only |
| 40.5 | SIG-001 (Coordination Pressure, CKR-006) | PARTIAL | static_ratio=0.875; runtime UNDEFINED |
| 40.6 | COND-003 (Coordination Pressure Active) | partial | SIG-001 partial input |
| 40.6 | DIAG-003 | partial | COND-003 partial |
| 40.7 | INTEL-003 (Coordination Pressure Active) | partial | static component 0.875; runtime UNDEFINED |
| adapter | Demo SIG-005 | synthesis_state=partial, relevance=MEDIUM | core_intel_id=INTEL-003 (COND-003 cross-ref) |
| 41.4 | SIG-005 registry | title/statement/domain/evidence | verbatim carry (A7, A8) |

---

## DEMO_TO_CORE_INTEL Mapping Derivation Basis

| Demo Signal | COND Ref in source_refs | Core INTEL (originating_condition match) | Derivation Confirmed |
|---|---|---|---|
| SIG-001 | COND-006 | INTEL-006 (originating_condition: COND-006) | YES |
| SIG-002 | aggregate | None (A9 logic) | YES |
| SIG-003 | COND-001 | INTEL-001 (originating_condition: COND-001) | YES |
| SIG-004 | COND-002 | INTEL-002 (originating_condition: COND-002) | YES |
| SIG-005 | COND-003 | INTEL-003 (originating_condition: COND-003) | YES |

---

## Computational Invariance

Key values preserved across full chain:

| Value | 40.4 Source | 40.5 Signal | 40.7 INTEL | Demo Adapter | Invariant |
|---|---|---|---|---|---|
| Dependency Load ratio | 15/22 = 0.682 | SIG-002: 0.682 | INTEL-001: 0.682 | SIG-003 statement: 0.682 | YES |
| Dependency edge count | 15 | SIG-002: 15 | INTEL-001: 15 | SIG-003 statement: 15 | YES |
| Total edge density | 28/22 = 1.273 | SIG-004: 1.273 | INTEL-002: 1.273 | SIG-004 statement: 1.273 | YES |
| Containment density | 0.545 | SIG-004: 0.545 | INTEL-002: 0.545 | SIG-004 statement: 0.545 | YES |
| Responsibility density | 0.364 | SIG-004: 0.364 | INTEL-002: 0.364 | SIG-004 statement: 0.364 | YES |
| Module density | 0.455 | SIG-004: 0.455 | INTEL-002: 0.455 | SIG-004 statement: 0.455 | YES |
| Coordination structural ratio | 7/8 = 0.875 | SIG-001: 0.875 | INTEL-003: 0.875 | SIG-005 statement: 0.875 | YES |

**Invariance verdict: INVARIANT — all values preserved through adapter**

---

## Namespace Conflict Traceability

| Field | Namespace | Value | Path |
|---|---|---|---|
| SIG-001.evidence.source_object_id | 41.4 evidence namespace | INTEL-001 | demo-facing (display) |
| SIG-001.core_intel_id | Core engine v0.1 namespace | INTEL-006 | adapter traceability (not demo-facing) |
| Conflict contained | — | YES | separate fields, no leakage |
