# Decision Surface Fixup Summary — PI.DECISION-SURFACE.RECONSTRUCTION.FIXUP.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.FIXUP.01  
**Date:** 2026-04-30  
**Verdict:** DECISION_FIXUP_COMPLETE

---

## What Was Fixed

Eight targeted corrections applied to `_build_decision_surface()` and `RC.evidence_pair_block()`:

| Fix | Item | Before | After |
|---|---|---|---|
| FIX-01 | Run ID | `run_01_authoritative_generated` (hardcoded via BlueEdge guard) | `run_blueedge_productized_01_fixed` (context-derived from --run-id) |
| FIX-02 | Confidence | `—` (zone_confidence field absent) | `0.78 — STRONG` (from semantic_topology_model.json DOMAIN-10 / DOM-04) |
| FIX-03 | DOM backing | `DOM-04 / Platform Infrastructure and Data` (wrong — semantic label) | `DOM-04 / backend_app_root` (correct — technical anchor_name) |
| FIX-04 | Not-activated | `2 structural signals not activated` (count only) | `Not-activated signals: PSIG-003 · PSIG-005` (IDs from signal_projection.json) |
| FIX-05 | STRUCTURE badge | `STRUCTURE: STABLE` | `STRUCTURE: STABLE within structural evidence scope` |
| FIX-06 | RISK badge | `RISK: MODERATE` | `RISK: MODERATE — driven by evidence incompleteness and concentrated structural pressure` |
| FIX-07 | Duplicate paragraph | Structural coverage paragraph appeared in both hero rationale and confirmed block | Removed from confirmed block; hero rationale is the single summary |
| FIX-08 | Signal convergence | `All active pressure signals share the same affected domain scope.` | `All active signals converge on the same structural domain (DOM-04), indicating concentrated structural pressure within a single semantic domain.` |

---

## Root Causes Addressed

**FIX-01**: `_configure_runtime()` had a `if client != "blueedge"` guard that silently prevented `_ACTIVE_VAULT_RUN_ID` from being updated for the BlueEdge client — making the run ID update effectively dead code for the primary client.

**FIX-02**: `pressure_zone_projection.json` has no `zone_confidence` field. The fallback `"—"` was correct behavior, but the correct confidence is in `semantic_topology_model.json` via `_resolve_dom_to_semantic_context()`, which already returns `confidence` and `lineage_status`.

**FIX-03**: `_pz0_dom_bk` was built from `_pz0_sem_ctx.get("business_label")` — the semantic domain label — not the DOM technical label. The DOM backing line should show the structural artifact's `anchor_name` field.

**FIX-08**: `RC.evidence_pair_block()` had a static hardcoded support text. Added optional `support_text` parameter; default preserves existing behavior for all non-DS callers.

---

## Was Decision Output Overwritten In Place?

**Yes.** Both files were overwritten in the existing `run_blueedge_productized_01_decision_reconstructed/` directory. No new run directory was created.

---

## Is the Generator Client-Agnostic?

**Yes — confirmed.**

- Run ID: derived from `--run-id` CLI argument (caller provides context)
- Confidence: derived from `_resolve_dom_to_semantic_context()` → semantic_topology_model
- DOM backing: derived from `pressure_zone_projection.json` `anchor_name` field
- Not-activated IDs: derived from `signal_projection.json` `signals_not_activated` field
- Signal convergence DOM: derived from `_ds_az_dom_id` (already artifact-driven)
- Structure/risk qualifications: condition-driven (weak_ct, exec_eval, zone_count)

No BlueEdge-specific strings remain in the new rendering logic.

---

## Remaining Warnings

**None for the Decision Surface.**

W-02 (non-PSIG legacy path hardcodes at ~lines 3175 and ~3204) remains deferred — explicitly out of scope for this contract, does not affect the PSIG production path or the Decision Surface.

---

## Is Final Report Family Validation Ready to Proceed?

**Yes.** All four reports are now consistent, semantically correct, and presentation-clean:

| Report | Status |
|---|---|
| Tier-1 Evidence Brief | ACCEPTED — all corrections applied (PI.CROSS-REPORT-FIXUP.01) |
| Tier-1 Narrative Brief | ACCEPTED — all corrections applied |
| Tier-2 Diagnostic Narrative | ACCEPTED — PSIG-006 section 04B added |
| Decision Surface | FIXUP_COMPLETE — all 8 presentation issues resolved |

Recommended next step: **PI.CLIENT-LANGUAGE-LAYER.FINAL-REPORT-FAMILY-VALIDATION.01**
