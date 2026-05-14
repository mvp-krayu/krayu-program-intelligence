# Governance Trace — 41.x Interpretation Exposure
## PI.41X.INTERPRETATION-EXPOSURE.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.INTERPRETATION-EXPOSURE.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Sources Inspected

### Artifacts read

| Artifact | Key fields consumed |
|---|---|
| `docs/pios/41.x/interpretation_binding.json` | binding_version, total_bindings, bindings[].binding_id, bindings[].source_type, bindings[].source_ref, bindings[].interpretation_ref, bindings[].attached_interpretation, bindings[].trace |
| `docs/pios/41.x/interpretation_registry.json` | registry_version, entries[].id (for INT-XXX resolution check) |
| `docs/pios/41.x/interpretation_binding_schema.json` | binding_schema (to understand source structure for exposure schema design) |

### Binding inventory as exposure input

| BIND-NNN | source_type | zone_id | zone_class | signal_id | condition_id | INT-XXX |
|---|---|---|---|---|---|---|
| BIND-001 | zone | PZ-001 | COMPOUND_ZONE | — | — | INT-007 |
| BIND-002 | zone | PZ-002 | COMPOUND_ZONE | — | — | INT-007 |
| BIND-003 | zone | PZ-003 | COMPOUND_ZONE | — | — | INT-007 |
| BIND-004 | zone (embedded) | PZ-001 | COUPLING_ZONE | — | — | INT-001 |
| BIND-005 | zone (embedded) | PZ-001 | PROPAGATION_ZONE | — | — | INT-002 |
| BIND-006 | zone (embedded) | PZ-001 | RESPONSIBILITY_ZONE | — | — | INT-003 |
| BIND-007 | zone (embedded) | PZ-002 | COUPLING_ZONE | — | — | INT-001 |
| BIND-008 | zone (embedded) | PZ-002 | PROPAGATION_ZONE | — | — | INT-002 |
| BIND-009 | zone (embedded) | PZ-002 | RESPONSIBILITY_ZONE | — | — | INT-003 |
| BIND-010 | zone (embedded) | PZ-003 | COUPLING_ZONE | — | — | INT-001 |
| BIND-011 | zone (embedded) | PZ-003 | PROPAGATION_ZONE | — | — | INT-002 |
| BIND-012 | zone (embedded) | PZ-003 | RESPONSIBILITY_ZONE | — | — | INT-003 |
| BIND-013 | signal | — | — | PSIG-001 | — | INT-008 |
| BIND-014 | signal | — | — | PSIG-002 | — | INT-009 |
| BIND-015 | signal | — | — | PSIG-004 | — | INT-011 |
| BIND-016 | signal | — | — | PSIG-006 | — | INT-013 |
| BIND-017 | condition | — | — | PSIG-001 | COND-PSIG-001-01 | INT-014 |
| BIND-018 | condition | — | — | PSIG-002 | COND-PSIG-002-01 | INT-015 |
| BIND-019 | condition | — | — | PSIG-004 | COND-PSIG-004-01 | INT-017 |
| BIND-020 | condition | — | — | PSIG-006 | COND-PSIG-006-01 | INT-019 |

---

## Phase B — Exposure Design Decisions

### Generation method

`interpretation_exposure.json` was generated programmatically via a deterministic Python script that:
1. Loaded `interpretation_binding.json`
2. For each BIND-NNN entry, created a corresponding EXP-NNN entry with:
   - `render_payload` copied verbatim from `attached_interpretation` (programmatic copy, no transcription)
   - `source_ref`, `interpretation_ref`, `source_type` propagated from the binding
   - Identical `render_targets` structure applied uniformly to all 20 items
   - `trace` populated from `interpretation_ref.registry_entry_id`, `binding_id`, and fixed paths
   - All six `constraints` set to false
3. Verified verbatim copy correctness programmatically for all 20 items (0 mismatches)

### EXP/BIND correspondence

EXP-001 through EXP-020 correspond 1:1 to BIND-001 through BIND-020. The correspondence is positional and declared in `exposure_id` (EXP-NNN = BIND-NNN position). This ensures full traceability from EXP-NNN → BIND-NNN → INT-XXX.

### render_targets design

All 20 items share identical `render_targets` structure. Differentiation between surfaces is declared by `permitted_fields` per target, not by item-level flags:

| Surface | Permitted fields |
|---|---|
| workspace_why | behavioral_meaning, source_ref, interpretation_ref |
| workspace_evidence | registry_path, binding_path, evidence_status |
| workspace_trace | registry_entry_id, binding_id, source_ref |
| lens_report | business_expression |
| future_ui | behavioral_meaning, system_expression, business_expression, registry_entry_id, binding_id, source_ref, evidence_status |

### exposure_mode

`exposure_mode: render_only` — no computation, no aggregation, no inference at exposure time.

### Language rule enforcement

| Rule | Status |
|---|---|
| render_payload is verbatim from binding | CONFIRMED — programmatic copy, 20/20 items verified |
| No new language introduced at exposure time | CONFIRMED — no text written outside of programmatic copy |
| No forbidden terms in render_payload | PASS — verified in validation phase |
| inference_prohibition: ACTIVE | CONFIRMED |

---

## Phase C — Validation

| Check | Result |
|---|---|
| JSON valid — interpretation_exposure_schema.json | PASS |
| JSON valid — interpretation_exposure.json | PASS |
| total_exposure_items = 20 | PASS |
| Every EXP item references an existing BIND-NNN | PASS (EXP-001..020 → BIND-001..020, all present in binding file) |
| Every interpretation_ref resolves to INT-XXX in registry | PASS (INT-001/002/003/007/008/009/011/013/014/015/017/019 — all confirmed in registry) |
| render_payload verbatim copy from binding — all 20 items | PASS (programmatic copy, zero transcription errors) |
| "should" absent from all render_payload fields | PASS |
| "recommend" absent from all render_payload fields | PASS |
| "critical" absent from all render_payload fields | PASS |
| "urgent" absent from all render_payload fields | PASS |
| "high risk" absent from all render_payload fields | PASS |
| "will cause" absent from all render_payload fields | PASS |
| All 6 constraints false in all 20 items | PASS |
| exposure_mode = render_only | PASS |
| inference_prohibition = ACTIVE | PASS |
| CREATE ONLY — no existing files modified | PASS |
| interpretation_binding.json unmodified | PASS |
| interpretation_registry.json unmodified | PASS |
| pressure_zone_projection.json unmodified | PASS |
| signal_projection.json unmodified | PASS |
| workspace.js unmodified | PASS |
| tier2_query_engine.py unmodified | PASS |
| **Total checks: 22** | **PASS: 22 / FAIL: 0** |

---

## Files Created

| File | Description |
|---|---|
| `docs/pios/41.x/interpretation_exposure_schema.json` | Schema defining EXP-NNN item structure: render_payload, render_targets, trace, constraints, plus prohibited_transformations and render_target_permission_summary |
| `docs/pios/41.x/interpretation_exposure.json` | 20 exposure items (EXP-001..020) packaging BIND-001..020 for downstream surface consumption |
| `docs/pios/41.x/interpretation_exposure_governance.md` | Governance document: purpose, binding vs exposure distinction, render-only rule, surface permissions, prohibited transformations, Evidence First compliance, future integration rules |
| `docs/programs/second-client-kill-plan-01/decisions/step41x_interpretation_exposure.md` | This governance trace |

---

## Files NOT Modified

- `docs/pios/41.x/interpretation_registry.json` — unchanged
- `docs/pios/41.x/interpretation_binding.json` — unchanged
- `docs/pios/41.x/interpretation_registry_schema.json` — unchanged
- `docs/pios/41.x/interpretation_binding_schema.json` — unchanged
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/pressure_zone_projection.json` — unchanged
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/signal_projection.json` — unchanged
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/projection_manifest.json` — unchanged
- `scripts/pios/tier2_query_engine.py` — unchanged
- `app/gauge-product/pages/tier2/workspace.js` — unchanged

---

## Exposure Coverage Summary

| Coverage dimension | Count |
|---|---|
| Total exposure items | 20 |
| Zone class items (primary) | 3 (EXP-001..003) |
| Zone class items (embedded pair rules) | 9 (EXP-004..012) |
| Signal items | 4 (EXP-013..016) |
| Condition items | 4 (EXP-017..020) |
| Registry entries referenced | 12 (INT-001/002/003/007/008/009/011/013/014/015/017/019) |
| Registry entries not referenced (inactive in this run) | 8 (INT-004/005/006/010/012/016/018/020) |
| Surfaces declared in render_targets | 5 (workspace_why, workspace_evidence, workspace_trace, lens_report, future_ui) |

---

## Remaining Blockers

1. **Workspace wiring not yet performed** — `tier2_query_engine.py` and `workspace.js` do not yet consume `interpretation_exposure.json`. A separate integration contract is required to wire EXP-NNN items into WHY/EVIDENCE/TRACE panel rendering.

2. **LENS report generator not yet wired** — `lens_report_generator.py` does not yet consume `business_expression` from EXP-NNN items. A separate report integration contract is required.

3. **PSIG names provisional** — All `render_payload` content derives from `PROVISIONAL_CKR_CANDIDATE` signal authority. Signal names remain provisional until formal CKR admission.

4. **Focus domain not selected** — No 75.x focus-domain contract authorized. Exposure layer does not select or imply a focus domain.

5. **Composite exposure not defined** — INT-020 is a placeholder; EXP items for composite interpretation require a future binding and registry contract to define aggregation logic.

---

## Governance Confirmation

- 75.x artifacts not modified
- 41.x projection artifacts not modified
- interpretation_registry.json not modified
- interpretation_binding.json not modified
- workspace.js not modified
- tier2_query_engine.py not modified
- No interpretation created, inferred, or synthesized
- render_payload copied verbatim from binding attached_interpretation (programmatic, zero transcription)
- No recommendations
- No severity
- No prioritization
- No focus domain selection
- No ranking
- inference_prohibition: ACTIVE
- exposure_mode: render_only
- Stream: PI.41X.INTERPRETATION-EXPOSURE.01
