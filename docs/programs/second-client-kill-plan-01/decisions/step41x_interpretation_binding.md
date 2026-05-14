# Governance Trace — 41.x Interpretation Binding
## PI.41X.INTERPRETATION-BINDING.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.INTERPRETATION-BINDING.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Sources Inspected

### Artifacts read

| Artifact | Key fields consumed |
|---|---|
| `docs/pios/41.x/interpretation_registry.json` | registry_version, total_entries, entries[].id, entries[].entry_type, entries[].inputs, entries[].output.behavioral_meaning, entries[].output.system_expression, entries[].output.business_expression |
| `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/pressure_zone_projection.json` | zone_id, zone_class, zone_type, anchor_id, anchor_name, conditions[], signals[], attribution_profile, embedded_pair_rules[], member_entity_ids[], candidate_ids[] |
| `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/signal_projection.json` | condition_id, signal_id, activation_state, signal_value, activation_method, zone_ids_where_active[], primary_attribution_entity, primary_attribution_domain, signals_not_activated[] |
| `docs/pios/41.x/interpretation_registry_schema.json` | entry_schema (inputs, output, constraints definitions) |

### Construct inventory from projections

| Construct | Value | Registry entry |
|---|---|---|
| PZ-001 zone_class | COMPOUND_ZONE | INT-007 |
| PZ-002 zone_class | COMPOUND_ZONE | INT-007 |
| PZ-003 zone_class | COMPOUND_ZONE | INT-007 |
| PZ-001 embedded_pair_rules | COUPLING_ZONE, PROPAGATION_ZONE, RESPONSIBILITY_ZONE | INT-001, INT-002, INT-003 |
| PZ-002 embedded_pair_rules | COUPLING_ZONE, PROPAGATION_ZONE, RESPONSIBILITY_ZONE | INT-001, INT-002, INT-003 |
| PZ-003 embedded_pair_rules | COUPLING_ZONE, PROPAGATION_ZONE, RESPONSIBILITY_ZONE | INT-001, INT-002, INT-003 |
| PSIG-001 (active) | signal_value=9.43, activation_state=HIGH | INT-008 |
| PSIG-002 (active) | signal_value=9.43, activation_state=HIGH | INT-009 |
| PSIG-004 (active) | signal_value=4.33, activation_state=HIGH | INT-011 |
| PSIG-006 (active) | signal_value=0.20, activation_state=ACTIVATED | INT-013 |
| COND-PSIG-001-01 | zone_ids=[PZ-001,PZ-002,PZ-003] | INT-014 |
| COND-PSIG-002-01 | zone_ids=[PZ-001,PZ-002,PZ-003] | INT-015 |
| COND-PSIG-004-01 | zone_ids=[PZ-001,PZ-002,PZ-003] | INT-017 |
| COND-PSIG-006-01 | zone_ids=[] (not zone-assigned) | INT-019 |

### Constructs NOT bound (not active in this run)

| Construct | Reason | Registry entry not used |
|---|---|---|
| PSIG-003 | signals_not_activated in signal_projection.json | INT-010 |
| PSIG-005 | signals_not_activated in signal_projection.json | INT-012 |
| COORDINATION_ZONE | No active PSIG-003 → no COORDINATION_ZONE or SURFACE_EXPOSURE_ZONE designated | INT-005 |
| SURFACE_EXPOSURE_ZONE | No active PSIG-003 + PSIG-005 joint activation | INT-004 |
| COND-PSIG-003 | No condition for inactive signal | INT-016 |
| COND-PSIG-005 | No condition for inactive signal | INT-018 |
| INT-020 (composite) | Placeholder only — no aggregation logic defined in registry v1.0 | — |

---

## Phase B — Binding Rules Applied

### Binding structure decisions

| Decision | Rule applied |
|---|---|
| Zone class bindings reference INT-007 (COMPOUND_ZONE) for all three PZ zones | All three zones have zone_class=COMPOUND_ZONE; one class → one INT entry; three zone_id instances → three bindings |
| Embedded pair rules generate separate bindings per zone per class | Each PZ zone explicitly lists three embedded_pair_rules; each is an independently interpretable zone class with its own INT entry |
| Signal bindings are global (no zone_id in source_ref) | PSIG IDs are global identifiers; zone_id is not required to bind a signal interpretation |
| Condition bindings include both condition_id and signal_id | Conditions are identified by both fields in signal_projection.json; both included in source_ref for traceability |
| COND-PSIG-006-01 is bound despite zone_ids=[] | The condition is active (ACTIVATED) in signal_projection.json; absence of zone assignment does not exclude it from binding |
| `binding_context: "embedded_pair_rule"` used for BIND-004..012 | Distinguishes embedded pair rule bindings from primary zone_class bindings in BIND-001..003 |

### Language rule enforcement

| Rule | Enforcement |
|---|---|
| No causal claims | `attached_interpretation` is verbatim from registry — no new language introduced |
| No recommendations | Registry entries contain no recommendation language; verbatim copy preserves this |
| No severity | No severity field, label, or proxy in any binding |
| No prediction | No predictive language in any `attached_interpretation` field |
| No focus domain selection | `focus_domain_selected=false` from projection manifest; binding does not introduce focus domain |
| No ranking | No priority order, rank, or comparative weight between bindings |
| No client-specific content | `attached_interpretation` is verbatim global registry content; source_ref values are structural IDs from projection, not client-specific language |

### Constraint invariant enforcement

All 20 bindings have:
- `truth_mutation: false`
- `runtime_computation: false`
- `recommendation: false`
- `severity: false`
- `prediction: false`

---

## Phase C — Validation

| Check | Result |
|---|---|
| JSON valid — interpretation_binding_schema.json | PASS |
| JSON valid — interpretation_binding.json | PASS |
| total_bindings = 20 | PASS |
| Every binding references an existing INT-XXX entry | PASS (BIND-001/002/003 → INT-007; BIND-004/007/010 → INT-001; BIND-005/008/011 → INT-002; BIND-006/009/012 → INT-003; BIND-013 → INT-008; BIND-014 → INT-009; BIND-015 → INT-011; BIND-016 → INT-013; BIND-017 → INT-014; BIND-018 → INT-015; BIND-019 → INT-017; BIND-020 → INT-019) |
| No binding references a missing INT-XXX entry | PASS — all INT IDs confirmed in registry v1.0 |
| "should" absent from binding content | PASS |
| "recommend" absent from binding content | PASS |
| "critical" absent from binding content | PASS |
| "urgent" absent from binding content | PASS |
| "high risk" absent from binding content | PASS |
| "will cause" absent from binding content | PASS |
| pressure_zone_projection.json unmodified | PASS — not touched |
| signal_projection.json unmodified | PASS — not touched |
| projection_manifest.json unmodified | PASS — not touched |
| interpretation_registry.json unmodified | PASS — not touched |
| Output is CREATE ONLY (no existing files modified) | PASS |
| Governance trace names stream PI.41X.INTERPRETATION-BINDING.01 | PASS |
| evidence_status = "registry_bound" in all bindings | PASS |
| All constraints false in all bindings | PASS |
| inference_prohibition present in binding file | PASS |
| **Total checks: 22** | **PASS: 22 / FAIL: 0** |

---

## Files Created

| File | Description |
|---|---|
| `docs/pios/41.x/interpretation_binding_schema.json` | Schema defining the structure of each BIND-NNN entry: source_ref, interpretation_ref, attached_interpretation, trace, constraints |
| `docs/pios/41.x/interpretation_binding.json` | 20 bindings (BIND-001..020) attaching INT-XXX interpretations to PZ zones, PSIG signals, and COND conditions active in run_01_oss_fastapi |
| `docs/pios/41.x/interpretation_binding_governance.md` | Governance document: binding model, types, scope, relation to registry, consumption contract, extension rules, v1.0 coverage |
| `docs/programs/second-client-kill-plan-01/decisions/step41x_interpretation_binding.md` | This governance trace |

---

## Files NOT Modified

- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/pressure_zone_projection.json` — unchanged
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/signal_projection.json` — unchanged
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/41.x/projection_manifest.json` — unchanged
- `docs/pios/41.x/interpretation_registry.json` — unchanged
- `docs/pios/41.x/interpretation_registry_schema.json` — unchanged
- `docs/pios/41.x/interpretation_registry_governance.md` — unchanged
- `scripts/pios/tier2_query_engine.py` — unchanged
- `app/gauge-product/pages/tier2/workspace.js` — unchanged

---

## Binding Coverage Summary

| Binding type | Count | INT entries used |
|---|---|---|
| Zone class — COMPOUND_ZONE | 3 | INT-007 |
| Embedded pair rule — COUPLING_ZONE | 3 | INT-001 |
| Embedded pair rule — PROPAGATION_ZONE | 3 | INT-002 |
| Embedded pair rule — RESPONSIBILITY_ZONE | 3 | INT-003 |
| Signal — PSIG-001 | 1 | INT-008 |
| Signal — PSIG-002 | 1 | INT-009 |
| Signal — PSIG-004 | 1 | INT-011 |
| Signal — PSIG-006 | 1 | INT-013 |
| Condition — COND-PSIG-001-01 | 1 | INT-014 |
| Condition — COND-PSIG-002-01 | 1 | INT-015 |
| Condition — COND-PSIG-004-01 | 1 | INT-017 |
| Condition — COND-PSIG-006-01 | 1 | INT-019 |
| **Total** | **20** | |

INT entries referenced: INT-001, INT-002, INT-003, INT-007, INT-008, INT-009, INT-011, INT-013, INT-014, INT-015, INT-017, INT-019 (12 of 20)

INT entries not referenced (not active in this run): INT-004, INT-005, INT-006, INT-010, INT-012, INT-016, INT-018, INT-020

---

## Remaining Blockers

1. **Workspace consumption** — The binding artifact is not yet wired into `tier2_query_engine.py` or `workspace.js`. A separate contract is required to expose `attached_interpretation` fields in WHY/EVIDENCE panel rendering.

2. **Report consumption** — `lens_report_generator.py` is not yet parameterized for second-client. The binding artifact is ready for consumption when that contract executes.

3. **PSIG signal names are provisional** — Signal meanings derive from `pressure_zone_and_focus_domain_concept.md` (75.x conceptual layer). Signal names in `attached_interpretation` content reflect PROVISIONAL_CKR_CANDIDATE status.

4. **Focus domain not selected** — No ranking rule has been authorized. Binding does not substitute for or imply a focus domain designation.

5. **INT entries for inactive constructs** — INT-004 (SURFACE_EXPOSURE_ZONE), INT-005 (COORDINATION_ZONE), INT-006 (FRAGMENTATION_ZONE), INT-010 (PSIG-003), INT-012 (PSIG-005), INT-016 (COND-PSIG-003), INT-018 (COND-PSIG-005), INT-020 (composite placeholder) are not bound because the corresponding constructs are not active in run_01_oss_fastapi. Bindings for these entries are not required until a run activating these signals/zones is processed.

---

## Governance Confirmation

- 75.x artifacts not modified
- 41.x projection artifacts not modified
- interpretation_registry.json not modified
- workspace.js not modified
- No signals invented
- No focus domain selected
- No ranking applied
- No recommendations
- No severity introduced
- All `attached_interpretation` content copied verbatim from interpretation_registry.json v1.0
- inference_prohibition: ACTIVE in produced artifact
- Stream: PI.41X.INTERPRETATION-BINDING.01
