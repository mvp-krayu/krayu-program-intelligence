# GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.01 — Run Context Model

## Question

Does run_335c0575a080 fully encapsulate run_01_authoritative?
OR must both be referenced explicitly?
OR is current separation required but misused?

---

## Evidence

### Chain A completeness

| data domain | present in run_01_authoritative | artifact |
|-------------|--------------------------------|----------|
| Score | YES | gauge_state.json.score |
| Coverage | YES | gauge_state.json.dimensions.DIM-01 + coverage_state.json |
| Reconstruction | YES | gauge_state.json.dimensions.DIM-02 + reconstruction_state.json |
| Execution status | YES | gauge_state.json.state.execution_status |
| Domains (catalog) | YES (intake_result.json, 5 domains) | intake_result.json |
| Topology structure | NO | — |
| Node graph | NO | — |
| Overlap edges | NO | — |

### Chain B completeness

| data domain | present in run_335c0575a080 | artifact |
|-------------|----------------------------|----------|
| Score | NO | — |
| Coverage | NO (carried in raw_input.__coverage_percent but not served by topology API) | — |
| Reconstruction | NO | — |
| Topology structure | YES | binding_envelope.json |
| Node graph | YES | binding_envelope.json (45 nodes, 62 edges) |
| Overlap edges | YES | binding_envelope.json (2 OVERLAP_STRUCTURAL) |
| Unknown space | YES | binding_envelope.json.constraint_flags |
| Domains (catalog) | YES | binding_envelope.json (5 binding_context nodes) |

### Cross-reference

Chain B's source intake (`raw_input.json`) carries Chain A's score and reconstruction values (`__coverage_percent=100.0`, `__reconstruction_state=PASS`) — but these fields are NOT served through `/api/topology`. They exist only in the source intake artifact, not in the binding_envelope.json or its render model.

---

## Model Determination

**run_context_model:**

```
type: LAYERED

explanation: >
  run_335c0575a080 does NOT encapsulate run_01_authoritative.
  run_335c0575a080 derives from run_01_authoritative (via raw_input.__source_run_id)
  and specializes it into the topology domain.
  The scoring data from run_01_authoritative is NOT present in run_335c0575a080's
  served artifacts (binding_envelope.json has no score fields).
  Therefore both must be referenced explicitly — one for score, one for structure.

  The two runs are not interchangeable or redundant:
    - run_01_authoritative = scoring authority
    - run_335c0575a080     = topology authority, derived from scoring authority

  The current separation (two API routes, two artifacts) is REQUIRED.
  It is not a mistake. It is the correct design for layered authority.

risks:
  RISK-01 — DISPLAY INCOHERENCE:
    /api/gauge surfaces run_id = run_01_authoritative.
    /api/topology does NOT surface run_id (buildRenderModel omits envelope.metadata.run_id).
    index.js hardcodes run_id = run_01 (truncated and incorrect).
    Result: user sees inconsistent or wrong run identity.

  RISK-02 — LINEAGE OPACITY:
    The derived relationship (Chain B ← Chain A) is declared in raw_input.json
    but is not surfaced anywhere in the runtime response.
    No UI element communicates that the topology was derived from run_01_authoritative.
    Result: score and topology appear as unrelated separate artifacts.

  RISK-03 — HARDCODE DRIFT:
    index.js left column is hardcoded to current artifact values.
    If gauge_state.json is regenerated (even with same run_id), hardcoded values
    will no longer match API values. No mechanism detects or prevents this.

  RISK-04 — WRONG RUN ID DISPLAY:
    index.js displays "run_01" (not "run_01_authoritative").
    overview.js displays "run_01" in header sub.
    These are incorrect — the actual run_id is "run_01_authoritative".
    This misrepresents the artifact's identity.
```

---

## Summary

The layered model is correct and intentional. The current separation is NOT a design flaw — it is the appropriate structure for two-layer authority. The violations are entirely in the UI consumption layer, where hardcoding and run_id omissions create display incoherence that does not reflect the actual artifact state.
