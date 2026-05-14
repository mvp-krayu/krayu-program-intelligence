# Pre-Fix State Snapshot

**Stream:** PI.PSEE-PIOS.LENS-REPORT-CONTRACT-COMPLIANCE.FIX.01  
**Captured:** 2026-05-07  

---

## Branch

`feature/psee-pios-integration-productized`

## Git Status

Clean — no uncommitted changes at fix start.

## FastAPI Selector State

```json
{
  "client": "fastapi",
  "current_run": "run_02_oss_fastapi_pipeline",
  "updated_at": "2026-05-07T00:00:00+00:00",
  "output_root": "clients/fastapi/lens",
  "navigation_base": "/api/report-file"
}
```

## BlueEdge Selector State

```json
{
  "client": "blueedge",
  "current_run": "run_be_orchestrated_fixup_01",
  "run_status": {
    "run_be_orchestrated_fixup_01": "CANONICAL_ORCHESTRATED",
    "run_blueedge_rerun_01": "CANONICAL_BASELINE_REFERENCE",
    "run_be_orchestrated_01": "REJECTED_NON_CANONICAL"
  }
}
```

## FastAPI run_02_oss_fastapi_pipeline Report Tree (Pre-Fix)

All files placed by PI.PSEE-PIOS.LENS-SELECTOR-RUN-WIRING.VALIDATION.01 (wiring correction).
Tier-1 evidence_brief and narrative_brief were also regenerated once by manual test run of `lens_generate.sh` (confirmed DPSIG-enhanced, exit 1 at vault_index check).

```
reports/
  graph_state.json            (DOM-XX format, from run_fastapi_raw_e2e_01 baseline copy)
  lens_decision_surface.html  (baseline from run_fastapi_raw_e2e_01)
  lens_tier1_evidence_brief.html   (DPSIG-enhanced, 44605 bytes)
  lens_tier1_narrative_brief.html  (DPSIG-enhanced, 34052 bytes)
  lens_tier2_diagnostic_narrative.html  (baseline from run_fastapi_raw_e2e_01)
  publish/
    lens_decision_surface_pub.html
    lens_tier1_evidence_brief_pub.html   (DPSIG-enhanced)
    lens_tier1_narrative_brief_pub.html  (DPSIG-enhanced)
    lens_tier2_diagnostic_narrative_pub.html
```

## FastAPI Semantic State (Pre-Fix)

`clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/semantic/` — PRESENT (copied from run_fastapi_raw_e2e_01, cross-topology noted)

## BlueEdge Report Tree (Pre-Fix — Working Reference)

```
reports/
  graph_state.json
  lens_decision_surface.html
  lens_tier1_evidence_brief.html
  lens_tier1_narrative_brief.html
  lens_tier2_diagnostic_narrative.html
  publish/ (4 pub reports)
```

## Known Gap at Fix Start

`app/gauge-product/public/vault/fastapi/` — **ABSENT**

BlueEdge has `app/gauge-product/public/vault/blueedge/run_01_authoritative_generated/vault_index.json`.
FastAPI has NO app vault deployment.

`_resolve_vault_index_for_graph()` in `lens_report_generator.py` (line 4799) looks for:
```
app/gauge-product/public/vault/<client>/<run_id>/vault_index.json
```
→ returns `None` for FastAPI → `_fail()` at line 6745 → `sys.exit(1)` → `lens_generate.sh` exits 1 → `generate-report.js` returns 500.

Tier-1 reports ARE generated before the failure. Failure occurs during tier-2 generation setup.
