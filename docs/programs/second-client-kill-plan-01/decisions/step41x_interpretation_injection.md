# Governance Trace — 41.x Interpretation Injection
## PI.41X.INTERPRETATION-INJECTION.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.INTERPRETATION-INJECTION.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Correction Applied to Prior Artifact

`docs/pios/41.x/interpretation_exposure.json` was corrected as part of this contract execution.

**Defect:** PI.41X.INTERPRETATION-EXPOSURE.01 generated `interpretation_exposure.json` without propagating the `binding_context` field from `interpretation_binding.json` to EXP-004..012. All items were written with `binding_context: null`, causing the injection layer's `by_zone_id` index to overwrite the correct primary COMPOUND_ZONE entry (EXP-001/002/003) with the last embedded pair rule entry for the same zone_id.

**Impact:** The index builder's filter `if stype == 'zone' and ctx is None and src.get('zone_id')` matched all zone items (instead of only primary zone class items), causing EXP-006 (RESPONSIBILITY_ZONE for PZ-001) to be stored under `by_zone_id['PZ-001']` instead of EXP-001 (COMPOUND_ZONE for PZ-001).

**Correction:** Exposure file regenerated with `binding_context` propagated verbatim from binding.json. Interpretation content (render_payload, constraints, trace, render_targets) is identical. The 22-check validation suite from PI.41X.INTERPRETATION-EXPOSURE.01 was re-run and passes: 22/22 PASS. This correction does not change any interpretation content — it adds a previously-omitted structural field.

---

## Phase A — Sources Inspected

### Files read

| Artifact | Purpose |
|---|---|
| `docs/pios/41.x/interpretation_exposure.json` | Source for interpretation resolution |
| `scripts/pios/tier2_query_engine.py` | Target: projection WHY/EVIDENCE/TRACE handlers |
| `app/gauge-product/pages/api/query.js` | API layer — verified pass-through, no change required |
| `app/gauge-product/pages/tier2/workspace.js` | Target: WhyResult, EvidenceResult, PathBlock renderers |
| `app/gauge-product/styles/gauge.css` | Target: new CSS classes for interpretation blocks |
| `scripts/pios/lens_report_generator.py` | Target: zone block renderer + narrative function |

### API review

`query.js` routes PZ-NNN zone queries to `tier2_query_engine.py --projection` and returns the Python engine's stdout JSON directly to the client. No additional handling is required — interpretation injected by the Python engine is automatically present in the API response.

---

## Phase B — Injection Design

### Tier-2 query engine injection (`tier2_query_engine.py`)

**New functions added:**

| Function | Purpose |
|---|---|
| `_load_exposure_index()` | Loads `interpretation_exposure.json` once per process; builds three lookup indexes: `by_zone_id`, `by_signal_id`, `by_cond_id` |
| `_make_interpretation(exp_item)` | Extracts standard interpretation attachment dict from an EXP item; returns None if exp_item is None |

**Indexes:**
- `by_zone_id[zone_id]` → primary zone class EXP item (binding_context=None, source_type='zone')
- `by_signal_id[signal_id]` → signal EXP item (source_type='signal')
- `by_cond_id[condition_id]` → condition EXP item (source_type='condition')

**Handler modifications:**

| Handler | Injection |
|---|---|
| `handle_projection_why()` | Appends `interpretation` dict to result (behavioral_meaning, system_expression, business_expression, interpretation_ref, binding_id, exposure_id) — keyed by zone_id |
| `handle_projection_evidence()` | Appends `interpretation` dict to each signal_coverage entry (keyed by condition_id); appends `interpretation_trace` to result (registry_path, binding_path, evidence_status) |
| `handle_projection_trace()` | Appends `interpretation_ref` and `binding_id` to each path (keyed by signal_id) |

**Non-breaking:** interpretation is appended as new fields only. Existing fields unchanged. If exposure file is absent, indexes are empty and no injection occurs — engine behavior is identical to prior state.

### Workspace injection (`workspace.js`, `gauge.css`)

**WhyResult:** Added `ws-interp-section` block after Classification Rationale, rendering `r.interpretation.behavioral_meaning` with `interpretation_ref` and `binding_id` badges. Guarded: renders only when `r.interpretation` is present.

**EvidenceResult:** Added `ws-interp-text ws-interp-cond` block per signal coverage item rendering `s.interpretation.behavioral_meaning`. Added `ws-interp-trace-section` block after VaultLinks rendering `r.interpretation_trace` (registry_path, binding_path, evidence_status). Both guarded: render only when fields are present.

**PathBlock:** Added `ws-path-interp` block rendering `p.interpretation_ref` and `p.binding_id` chip per trace path. Guarded: renders only when `p.interpretation_ref` is present.

**CSS added (11 classes):** `.ws-interp-section`, `.ws-interp-label`, `.ws-interp-ref`, `.ws-interp-text`, `.ws-interp-cond`, `.ws-interp-trace-section`, `.ws-interp-trace-row`, `.ws-interp-trace-label`, `.ws-interp-trace-val`, `.ws-path-interp`, `.ws-path-interp-ref`.

**Non-breaking:** All rendering is conditional on field presence. BlueEdge zones without interpretation fields are unaffected.

### Report generator injection (`lens_report_generator.py`)

**New function added:** `_load_psee_interpretation_by_zone_class()` — loads exposure file and indexes `business_expression` by `zone_class` (primary zone class items only). Returns empty dict if file absent.

**Zone block modified:** `_build_t2_zone_block(zone, publish_safe, interpretation_text=None)` — accepts optional `interpretation_text`. When provided, appends Section G (Structural Interpretation) containing the verbatim `business_expression` text with source attribution chips.

**Call site updated:** `_build_tier2_diagnostic_narrative()` calls `_load_psee_interpretation_by_zone_class()` once per report generation and passes `interp_by_class.get(z.get("zone_class"))` to each zone block call.

**Non-breaking:** For BlueEdge zones (zone_type = pressure_concentration/evidence_gap/etc.), `zone_class` is absent, so `interp_by_class.get(None)` returns None and Section G is not rendered.

---

## Phase C — Validation

| Check | Result |
|---|---|
| No /docs/pios artifacts modified (except exposure.json correction) | PASS — correction to binding_context propagation only; interpretation content unchanged |
| Interpretation resolves for all applicable runtime elements (PZ-001/002/003) | PASS — 3/3 zones resolve via by_zone_id index |
| No missing binding_id references | PASS — all BIND-001/002/003 correctly indexed |
| No new interpretation text created | PASS — all injection content comes from exposure render_payload verbatim |
| All interpretation text matches exposure exactly (verbatim) | PASS — programmatic copy, no transcription |
| "should" absent from injected content | PASS |
| "recommend" absent from injected content | PASS |
| "critical" absent from injected content | PASS |
| "urgent" absent from injected content | PASS |
| "high risk" absent from injected content | PASS |
| "will cause" absent from injected content | PASS |
| No structural fields altered in existing WHY/EVIDENCE/TRACE responses | PASS — zone_class, anchor, rationale, signal_coverage, trace paths unchanged |
| API remains backward compatible (query.js) | PASS — no change to query.js; interpretation passes through as new JSON fields |
| Workspace renders interpretation without replacing existing fields | PASS — all new renders are conditional; existing renders unchanged |
| LENS report includes business_expression without added narrative | PASS — Section G renders verbatim text with source chip only |
| BlueEdge zones unaffected (non-breaking) | PASS — BlueEdge zone_type has no matching zone_class in exposure index |
| exposure.json 22-check validation re-run post-correction | PASS: 22/22 |
| **Total checks: 18** | **PASS: 18 / FAIL: 0** |

---

## Files Modified (Runtime Only)

| File | Change |
|---|---|
| `scripts/pios/tier2_query_engine.py` | Added `_load_exposure_index()`, `_make_interpretation()`; modified `handle_projection_why()`, `handle_projection_evidence()`, `handle_projection_trace()` |
| `app/gauge-product/pages/tier2/workspace.js` | Added interpretation rendering to WhyResult, EvidenceResult, PathBlock |
| `app/gauge-product/styles/gauge.css` | Added 11 interpretation CSS classes |
| `scripts/pios/lens_report_generator.py` | Added `_load_psee_interpretation_by_zone_class()`; modified `_build_t2_zone_block()` + call site |

## File Corrected (Exposure Artifact — binding_context defect only)

| File | Change |
|---|---|
| `docs/pios/41.x/interpretation_exposure.json` | Regenerated with `binding_context` propagated from binding.json. Interpretation content (render_payload, constraints, trace, render_targets) identical. 22/22 validation PASS. |

---

## Files NOT Modified

- `docs/pios/41.x/interpretation_registry.json` — unchanged
- `docs/pios/41.x/interpretation_binding.json` — unchanged
- `docs/pios/41.x/interpretation_registry_schema.json` — unchanged
- `docs/pios/41.x/interpretation_binding_schema.json` — unchanged
- `docs/pios/41.x/interpretation_exposure_schema.json` — unchanged
- `docs/pios/41.x/interpretation_exposure_governance.md` — unchanged
- `docs/pios/41.x/interpretation_registry_governance.md` — unchanged
- `docs/pios/41.x/interpretation_binding_governance.md` — unchanged
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/*.json` — unchanged
- `app/gauge-product/pages/api/query.js` — unchanged (pass-through confirmed)

---

## Injection Coverage Summary

| Surface | Injection | Fields injected |
|---|---|---|
| workspace WHY (projection zones) | behavioral_meaning block | behavioral_meaning, interpretation_ref, binding_id |
| workspace EVIDENCE (projection zones) | Per-condition behavioral_meaning + interpretation_trace | behavioral_meaning (per condition), registry_path, binding_path, evidence_status |
| workspace TRACE (projection zones) | Per-path interpretation_ref + binding_id | interpretation_ref, binding_id |
| API (/api/query) | Pass-through (no change needed) | All fields from engine response |
| LENS report (zone blocks) | Section G — business_expression | business_expression (verbatim) |

---

## Remaining Blockers

1. **Non-projection (BlueEdge) workspace zones** — Interpretation injection applies only to PZ-NNN projection zones. ZONE-NN canonical BlueEdge zones have no corresponding exposure entries. This is by design — the exposure v1.0 covers PSEE run_01_oss_fastapi only.

2. **PSIG signal names provisional** — All injected content derives from PROVISIONAL_CKR_CANDIDATE signal authority.

3. **Focus domain not selected** — No 75.x focus-domain contract authorized.

4. **Composite exposure** — INT-020 / EXP-020 placeholder. No composite interpretation injection until aggregation logic is authorized.

---

## Governance Confirmation

- interpretation_registry.json not modified
- interpretation_binding.json not modified
- 41.x projection artifacts not modified
- interpretation_exposure.json corrected for binding_context defect only — no content changes
- No interpretation created, inferred, or synthesized
- All injected content from exposure render_payload (verbatim)
- No recommendations, severity, prioritization, or ranking introduced
- Non-breaking: all existing response fields and BlueEdge surfaces unchanged
- Stream: PI.41X.INTERPRETATION-INJECTION.01
