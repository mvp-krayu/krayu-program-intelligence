# Phase 8b Redefinition Decision
## PI.LENS.PHASE8B-REDEFINITION.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Decision

Phase 8b is redefined from a report-generation phase to a vault readiness validation phase.

**Before:**
```
Phase 8b — Lens Reports
  → invokes lens_report_generator.py
  → depends on app/gauge-product/public/vault/<client>/
  → fails if vault_index.json absent (Tier-2 path)
  → produces HTML reports in clients/<client>/lens/
```

**After:**
```
Phase 8b — Vault Readiness Validation
  → validates pipeline outputs are complete and coherent
  → no dependency on app vault
  → no dependency on Node.js / export_graph_state.mjs
  → no report files generated
  → produces vault/vault_readiness.json
```

---

## Architectural Rationale

The pipeline is a data/evidence layer. It produces:
- structural artifacts (intake, 40.x)
- CEU grounding (ceu/)
- DOM layer (dom/)
- binding envelope (binding/)
- integration validation (integration/)
- vault artifacts (vault/)

Report generation is a representation layer:
- consumes pipeline outputs
- produces HTML surfaces for human consumption
- requires app-layer dependencies (vault_index.json, Node.js graph layout)
- is appropriately invoked explicitly via CLI or LENS UI, not inside the pipeline

Mixing representation-layer concerns into the pipeline:
1. Creates an app-vault dependency in a pipeline gate
2. Fails the pipeline when the representation layer is not ready
3. Produces outputs that are not required for downstream pipeline validity

---

## Boundary Rule (Locked)

```
PIPELINE  ──────────────────────────────────────►  vault_readiness.json
                                                        │
                                                        ▼
REPRESENTATION  ──  lens_report_generator.py  ──►  HTML reports
                    (explicit invocation only)
```

---

## Vault Readiness Checks (VR-01 through VR-09)

| Check | Artifact | Test |
|-------|----------|------|
| VR-01 | intake/intake_manifest.json | exists + valid JSON |
| VR-02 | structure/40.2/structural_node_inventory.json | exists + valid JSON |
| VR-03 | structure/40.3/structural_topology_log.json | exists + valid JSON |
| VR-04 | structure/40.4/canonical_topology.json | exists + valid JSON |
| VR-05 | ceu/grounding_state_v3.json | exists + valid JSON |
| VR-06 | dom/dom_layer.json | exists + valid JSON |
| VR-07 | binding/binding_envelope.json | exists + valid JSON |
| VR-08 | integration/integration_validation.json | exists + valid JSON |
| VR-09 | integration/integration_validation.json | validation_status = "PASS" |

Overall status: READY if all 9 PASS, FAIL otherwise.

---

## Implementation

Function: `phase_08b_vault_readiness(client_cfg, run_dir, run_id)` in `run_client_pipeline.py`

Rules:
- CREATE_ONLY (fails if vault_readiness.json already exists)
- No fallback
- No scanning outside run root
- No app vault dependency
- Deterministic: same inputs → same output
