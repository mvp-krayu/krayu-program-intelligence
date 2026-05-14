# Decision Summary Rewrite — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30

## Structural Evidence Statement

**Required pattern:**  
"Structural evidence is complete within the current evidence scope: {structural_grounded_count} of {structural_evidence_group_count} structural evidence groups are grounded. Semantic domain coverage is partial: {semantic_backed_count} of {semantic_domain_count} semantic domains have structural backing; {semantic_only_count} remain semantic-only."

**Rendered output (BlueEdge):**  
"Structural evidence is complete within the current evidence scope: 13 of 13 structural evidence groups are grounded. Semantic domain coverage is partial: 5 of 17 semantic domains have structural backing; 12 remain semantic-only."

**Source:**
- 13/13 grounded: `sum(1 for d in domains if d["grounding"] == "GROUNDED")` / `counts["domains"]`
- 5/17/12: `_build_semantic_report_context()` → total_semantic_domains, structurally_backed_domains, semantic_only_domains

## Pressure Statement

**Required pattern:**  
"The active pressure pattern is centered on {active_zone_semantic_label}, backed by {active_zone_dom_id} / {active_zone_dom_label}. It is expressed as {compound_zone_status} with {active_signal_count} active structural signals."

**Rendered output (BlueEdge):**  
"The active pressure pattern is centered on Platform Infrastructure and Data, backed by DOM-04 / backend_app_root. Expressed as Multiple structural pressures acting together with 3 active structural signals."

**Source:**
- `Platform Infrastructure and Data`: semantic label from `_build_semantic_report_context()["active_zone_semantic_label"]`
- `DOM-04`: `_build_semantic_report_context()["active_zone_dom_id"]`
- `backend_app_root`: `_build_semantic_report_context()["active_zone_dom_label"]` (crosswalk technical_label)
- `Multiple structural pressures acting together`: `RC.apply_language("COMPOUND_ZONE")`
- `3 active structural signals`: `len(_ds_active_struct_sigs)` (RUN_RELATIVE_OUTLIER only, excludes PSIG-006)

## Active Signal Statement

**Rendered:** "Active structural signals: PSIG-001 · PSIG-002 · PSIG-004."  
**Source:** signal IDs from `[c["signal_id"] for c in active_conditions_in_scope if activation_method == "RUN_RELATIVE_OUTLIER"]`

## Baseline Signal Statement

**Rendered:** "Baseline signal: PSIG-006 — theoretical baseline condition, not an activated pressure signal."  
**Source:** signal IDs from `[c["signal_id"] for c in active_conditions_in_scope if activation_method == "THEORETICAL_BASELINE"]`

## Zone Summary

**Rendered:** "1 pressure zone identified: PZ-001 — Platform Infrastructure and Data."  
**Source:** `pz_proj["zone_projection"][0]["zone_id"]` + semantic label

## Score / Band / Posture

**Rendered in hero block:** 60 — CONDITIONAL — INVESTIGATE  
**Source:** `gauge["score"]["canonical"]`, `gauge["score"]["band_label"]`, `decision_model["decision"]`
