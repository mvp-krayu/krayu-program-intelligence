# Decision Context Builder — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30

## Context Fields and Derivation

All values artifact-derived. No constants embedded.

| Field | Value (BlueEdge run) | Source |
|---|---|---|
| client_name | `_get_client_display_name(publish_safe)` | `_CLIENT_DISPLAY_NAMES[_ACTIVE_CLIENT]` |
| run_id | `_ACTIVE_VAULT_RUN_ID` | runtime config |
| score | 60 | `gauge["score"]["canonical"]` |
| confidence_band | CONDITIONAL | `gauge["score"]["band_label"]` |
| decision_posture | INVESTIGATE | `decision_model["decision"]` |
| evidence_scope | PARTIAL | `decision_model["evidence_completeness"]` |
| structural_evidence_group_count | 13 | `topology["counts"]["domains"]` |
| structural_grounded_count | 13 | `sum(1 for d in domains if d["grounding"] == "GROUNDED")` |
| semantic_domain_count | 17 | `_build_semantic_report_context()["total_semantic_domains"]` |
| semantic_backed_count | 5 | `_build_semantic_report_context()["structurally_backed_domains"]` |
| semantic_only_count | 12 | `_build_semantic_report_context()["semantic_only_domains"]` |
| active_pressure_zone_count | 1 | `len(pz_proj["zone_projection"])` |
| active_zone_id | PZ-001 | `pz_proj["zone_projection"][0]["zone_id"]` |
| active_zone_semantic_label | Platform Infrastructure and Data | `_build_semantic_report_context()["active_zone_semantic_label"]` |
| active_zone_domain_id | DOMAIN-10 | `_build_semantic_report_context()["active_zone_dom_id"]` (from semantic model) |
| active_zone_dom_id | DOM-04 | `_build_semantic_report_context()["active_zone_dom_id"]` |
| active_zone_dom_label | backend_app_root | `_build_semantic_report_context()["active_zone_dom_label"]` (from crosswalk technical_label) |
| active_zone_confidence | from model | `_build_semantic_report_context()["active_zone_confidence"]` |
| active_signals | PSIG-001, PSIG-002, PSIG-004 | `[c for c in active_conditions_in_scope if activation_method == "RUN_RELATIVE_OUTLIER"]` |
| baseline_signals | PSIG-006 | `[c for c in active_conditions_in_scope if activation_method == "THEORETICAL_BASELINE"]` |
| not_activated_signals | PSIG-003, PSIG-005 | `psig_proj["signals_not_activated"]` |
| active_conditions | 3 RUN_RELATIVE_OUTLIER | from signal_projection.json active_conditions_in_scope |
| compound_zone_status | COMPOUND_ZONE | `pz_proj["zone_projection"][0]["zone_class"]` → RC.apply_language() |
| runtime_evidence_status | NOT_EVALUATED | `decision_model["exec_evaluated"]` == False |
| unsupported_metrics | dep_load, edge_to_node, containment_density | `metrics.get("dep_load") == "NOT_IN_SCOPE"` etc. |
| inference_prohibition_status | ACTIVE | constant governance value |

## Derivation Rule

No field may be embedded as a constant. All fields are read from:
- `gauge_state.json` → score, band, posture
- `canonical_topology.json` → structural evidence group counts, grounding
- `signal_projection.json` → active/baseline/not-activated signal separation
- `pressure_zone_projection.json` → zone ID, class, anchor
- `semantic_topology_model.json` → semantic domain counts, zone semantic label
- `semantic_continuity_crosswalk.json` → DOM technical label (az_dom_label)
- `decision_model` computed from above → structural_risk, evidence_completeness

## Artifacts Referenced

Of the required source artifacts listed in the contract:
- `gauge_state.json` — PRESENT, loaded ✓
- `canonical_topology.json` — PRESENT, loaded ✓
- `signal_projection.json` — PRESENT, loaded ✓
- `pressure_zone_projection.json` — PRESENT, loaded ✓
- `semantic_topology_model.json` — PRESENT, loaded ✓
- `semantic_continuity_crosswalk.json` — PRESENT, loaded ✓
- `semantic_dom_binding.json` — NOT independently loaded; DOM binding is derived from semantic_topology_model dom_bindings_summary field
- `evidence_trace.json` — NOT present as separate artifact; evidence tracing is inline in canonical_topology.json domain records
- `vault_manifest.json` — NOT present under standard path; vault structure confirmed correct via package loading
