---
title: Known Gaps
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
gap_count: 5
---

## Documented Semantic Gaps and Caveats

These are not data errors. They are known constraints that must accompany any LENS surface of the affected claims.

---

### GAP-01 — CONCEPT-06 Semantic Gap

**Severity:** HIGH — production LENS risk

**Description:**
The CONCEPT-06 predicate in `app/gauge-product/lib/business-ontology/concepts.json` reads:
```
"predicate": "score.components.completion_points == 0 AND state.execution_status == 'PHASE_1_ACTIVE'"
```

Stream 10 schema uses `execution_status = 'NOT_EVALUATED'` instead of `'PHASE_1_ACTIVE'`.

**Impact:**
The ExecutiveDecisionBlock EXECUTION verdict in `overview.js` will not correctly identify the execution-pending state on `run_authoritative_recomputed_01`. May render as VERIFIED instead of UNKNOWN.

**Affected claims:** CLM-25 (Executive Three-Axis Verdict — EXECUTION axis)

**Resolution required:** Update CONCEPT-06 predicate to include `NOT_EVALUATED` as a matching status before LENS can safely surface the EXECUTION verdict against any Stream-10-schema run.

**Status:** OPEN — not yet fixed

---

### GAP-02 — DIM-04 Minimum Observable State

**Severity:** MEDIUM — caveat required for LENS surface

**Description:**
`gauge_state.json` contains an explicit caveat for DIM-04:
> "us_records not available in declared input artifacts; DIM-04 reflects minimum observable state"

`total_count = 0` does not mean there are zero unknown elements in the platform. It means none are observable in the current evidence set.

**Contrast:** The binding envelope for client `1de0d815` contains `unknown_space_count = 3`, confirming that unknown-space records exist at the client binding layer.

**Affected claims:** CLM-06 (Unknown-Space Count)

**LENS requirement:** Any ZONE-2 surface of this claim MUST include: "No structural unknowns observable in current evidence. Runtime behavior assessment pending."

**Status:** DOCUMENTED — caveat must accompany claim

---

### GAP-03 — SIG-005 WEAK Confidence

**Severity:** LOW — caveat required for LENS surface

**Description:**
SIG-005 (Coordination Pressure) has `evidence_confidence = WEAK`. The signal is derived from static component analysis only — the execution layer has not been evaluated. The confidence rationale explicitly notes this.

**Affected claims:** CLM-24 (SIG-005: Coordination Pressure)

**LENS requirement:** May not be presented as a confirmed finding. Required phrase: "One signal has partial evidence — the static coordination structure suggests elevated sharing, but runtime validation is not yet complete."

**Status:** DOCUMENTED — caveat must accompany claim

---

### GAP-04 — Dual Topology Model Scope Difference

**Severity:** LOW — scope clarification required

**Description:**
`canonical_topology.json` (17 domains, 42 capabilities, 89 components, 0 overlaps) and `binding_envelope.json` (45 nodes, 2 overlaps, 3 USP records) appear to contradict each other on overlap counts. They are NOT contradictory — they are different scopes:

- Canonical = pure platform topology across all clients
- Binding envelope = client-specific subset with client relationship model applied

**Affected claims:** CLM-17 (Cross-Domain Overlaps)

**LENS requirement:** If envelope overlaps are surfaced in ZONE-2, must explain what OVL-01/OVL-02 represent in the client relationship model.

**Status:** DOCUMENTED — scope distinction must be preserved

---

### GAP-05 — Schema Version Coexistence

**Severity:** LOW — not a data error; platform evolution detail

**Description:**
Two runs coexist in the BlueEdge client path with different schemas:
- `run_01_authoritative`: Legacy schema — `execution_status = 'PHASE_1_ACTIVE'`, no `score.projected` field, `confidence.status = 'COMPUTED'`
- `run_authoritative_recomputed_01`: Stream 10 schema — `execution_status = 'NOT_EVALUATED'`, `score.projected = 100`, `confidence.status = 'SPLIT_EXECUTION_NOT_EVALUATED'`

This is a platform evolution artifact. The recomputed run is authoritative for Stream 10.

**Affected claims:** All claims — schema determines which fields are present

**LENS requirement:** Always reference the recomputed run as the authoritative source. The legacy run's `PHASE_1_ACTIVE` status is not meaningful for new LENS surfaces.

**Status:** DOCUMENTED — V3 normalization target

---

## Summary

| gap | description | severity | status |
|-----|-------------|----------|--------|
| GAP-01 | CONCEPT-06 EXECUTION verdict will not trigger on NOT_EVALUATED runs | HIGH | OPEN |
| GAP-02 | DIM-04 total_count=0 is minimum observable state, not proven zero | MEDIUM | DOCUMENTED |
| GAP-03 | SIG-005 WEAK confidence — static component only | LOW | DOCUMENTED |
| GAP-04 | Dual topology model scope difference (canonical vs binding envelope) | LOW | DOCUMENTED |
| GAP-05 | Schema version coexistence (PHASE_1_ACTIVE vs NOT_EVALUATED) | LOW | DOCUMENTED |
