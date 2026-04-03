# EX.3 — Runtime Conformity Enforcement

**Stream:** EX.3 — Runtime Integration & System Bridge (Default Path Binding)
**Artifact type:** RUNTIME CONFORMITY ENFORCEMENT
**Date:** 2026-04-03
**Authority:** EX.3

---

## 1. PURPOSE

This document records how CE.4/CE.5/CE.2 conformity is enforced in the runtime after
EX.3 integration, and where enforcement gaps remain.

---

## 2. ENFORCEMENT MECHANISMS

### ENF-001 — In-flight vocabulary validation (pios_bridge)

`pios_bridge.get_live_pios_data()` validates:
- All signal states ∈ CE.4 vocabulary `{COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING}`
- Returns `None` on any vocabulary violation — adapters receive null pios_* fields

This is the primary vocabulary enforcement point for all three routes (R-01, R-03, R-04).

**Gap:** ENF-001 does not validate CE.5 consumption states in-bridge (they are passed through from the engine, which is certified compliant). CE.5 vocabulary violation would be an engine regression — handled by EX.1 verifier per RB-009..RB-012.

---

### ENF-002 — Fail-closed on bridge failure

If `get_live_pios_data()` returns `None` (engine failure or vocabulary violation):
- 42.4: all `pios_*` fields set to null in every signal entry
- 42.6: `pios_*` fields null; metric values fall back to static extraction (explicit `value_source: "static_extraction"`)
- 42.7: `pios_summary` fields null with explicit null run_id

This satisfies R3 (no synthetic data) and R4 (fail closed). The response is still returned
(the L3 semantic content is unaffected). The null pios_* fields signal to any consumer that
live engine data is unavailable.

**No silent fallback to static governance states — all pios_* fields are explicitly null.**

---

### ENF-003 — L3-to-engine signal mapping (L3_TO_ENGINE)

The mapping from L3 signal_registry IDs to engine signal/condition/diagnosis IDs is
derived from the authoritative `source_refs` field in `docs/pios/41.4/signal_registry.json`
and is hardcoded in `pios_bridge.py:L3_TO_ENGINE`.

This mapping is the bridge between the L3 semantic layer and the L2 engine layer. It
enforces that CE.4/CE.5/CE.2 states are always sourced from the correct governing engine
objects — not from any L3 approximation.

---

### ENF-004 — Worst-case tier resolution

When an L3 signal maps to multiple governing conditions or diagnoses (e.g., L3 SIG-002
maps to 7 conditions), `get_l3_signal_pios_context()` returns the worst-case tier:
- `TIER_ORDER = ["BLOCKED", "DEGRADED", "AT_RISK", "STABLE"]` — lowest index = highest severity
- `DIAG_ORDER = ["BLOCKED", "ACTIVE", "INACTIVE"]` — lowest index = highest severity

This prevents underreporting of governance risk — if ANY governing condition is BLOCKED,
the L3 signal shows BLOCKED tier.

---

### ENF-005 — value_source field (42.6)

The `value_source` field in 42.6 metric records is explicit and auditable:
- `"live_engine"` — value comes from certified engine output
- `"static_extraction"` — value comes from static L3 signal statement text (fallback or no live field)
- `"none"` — value is null

This prevents IB-007 (dual truth system): the active source is always declared.

---

## 3. ENFORCEMENT GAPS (REMAINING AFTER EX.3)

### EG-001 — RB-006 not enforced at runtime

EX.H1 RB-006 requires programmatic compliance validation (via EX.1 verifier) before any
compliance claim. The pios_bridge invokes the engine and validates vocabulary (ENF-001)
but does not invoke `scripts/pios/EX.1/runtime_binding_verifier.py` to produce a
`validation_result.json`. This is G-013 from the EX.1A adapter_gap_register.

**Owner:** EX.3 follow-on (integration of EX.1 verifier into the API invocation path)

---

### EG-002 — No enforcement in WOW chain (42.23/42.22)

The 42.22 WOW source uses `signal_state: "computed"` — outside CE.4 vocabulary.
42.23 passes it through without validation. This is BD-002 / G-006.

**Owner:** GC-003 (data fix) + EX.3 WOW substream

---

### EG-003 — No per-invocation run archive in API path

Each call to the query/overview/topology routes invokes the engine (via pios_bridge)
and creates run archives in `runs/pios/40.5/<run_id>/` and `runs/pios/40.6/<run_id>/`.
These are timestamped and accumulate over time. No explicit lifecycle management.

**Owner:** EX.2 (Debug/Trace Interface) — run archive inspection surface

---

## 4. CONFORMITY STATE

| Contract | Before EX.3 | After EX.3 |
|---|---|---|
| CE.4 emission states in query surface | ABSENT | PRESENT |
| CE.4 emission states in overview surface | ABSENT | PRESENT |
| CE.4 emission states in topology surface | ABSENT | PRESENT (summary) |
| CE.5 consumption states in query surface | ABSENT | PRESENT |
| CE.5 consumption states in overview surface | ABSENT | PRESENT |
| CE.2 condition tiers in query surface | ABSENT | PRESENT |
| CE.2 condition tiers in overview surface | ABSENT | PRESENT |
| CE.2 condition tiers in topology surface | ABSENT | PRESENT (summary) |
| CE.2 diagnosis states in topology surface | ABSENT | PRESENT (summary) |
| Metric values from certified engine | ABSENT | PRESENT (3/4 metrics) |
| No dual truth system | VIOLATED | ENFORCED (value_source field) |
