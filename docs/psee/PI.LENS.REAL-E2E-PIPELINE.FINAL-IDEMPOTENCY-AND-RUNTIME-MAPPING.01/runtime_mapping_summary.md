# Runtime Mapping Summary
## PI.LENS.REAL-E2E-PIPELINE.FINAL-IDEMPOTENCY-AND-RUNTIME-MAPPING.01

**Date:** 2026-05-03

---

## Mapping Established

| Role | Run ID | Path |
|------|--------|------|
| vault_run | run_blueedge_e2e_execute_01 | clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/vault |
| semantic_run | run_blueedge_productized_01_fixed | clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic |
| report_run | run_blueedge_e2e_execute_01 | clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/reports |

---

## Stage 07 — Semantic Locked Reference

- Semantic bundle sourced from `run_blueedge_productized_01_fixed/semantic/`
- `semantic_bundle_manifest.json` confirmed present
- Read-only; never copied into execution run
- Status: READY_LOCKED_REFERENCE

---

## Stage 08 — Explicit Mapping Call

`lens_report_generator.py` called with explicit arguments:
```
--client blueedge
--run-id run_blueedge_e2e_execute_01
--package-dir clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/vault
--semantic-bundle-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic
--output-dir clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/reports
```

Reports generated:
- `reports/lens_tier1_evidence_brief.html`
- `reports/lens_tier1_narrative_brief.html`
- `reports/lens_tier2_diagnostic_narrative.html`
- `reports/lens_decision_surface.html`
- `reports/graph_state.json`
- `reports/publish/` (publish variants)

Canonical reports NOT touched.

---

## Stage 09 — Mapping-Aware Validation

Checks vault from execution run, semantic from locked reference run, and 4 HTML reports.
Does NOT require semantic co-located inside execution run.

Result: VALIDATED

---

## Canonical Runs NOT Modified

- `clients/blueedge/psee/runs/run_blueedge_productized_01/` — NOT modified
- `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/` — NOT modified (semantic read-only)
- `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/` — NOT modified
