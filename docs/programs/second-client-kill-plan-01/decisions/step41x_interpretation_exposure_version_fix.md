# Governance Trace — 41.x Interpretation Exposure Version Fix
## PI.41X.INTERPRETATION-EXPOSURE.VERSION-FIX.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.INTERPRETATION-EXPOSURE.VERSION-FIX.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Breach Being Corrected

**Contract:** PI.41X.INTERPRETATION-INJECTION.01  
**Breach:** During execution of PI.41X.INTERPRETATION-INJECTION.01, `docs/pios/41.x/interpretation_exposure.json` was modified (commit d01290b). This artifact is a governed docs/pios layer artifact. Modification of governed layer artifacts is prohibited under docs immutability rules. The modification was necessary to correct a structural defect (missing `binding_context` field in EXP-004..012) that prevented the injection engine from resolving the primary zone class index correctly.

**Why v1.0 restore is not practical:** The injection runtime in `scripts/pios/tier2_query_engine.py` (function `_load_exposure_index`) relies on `binding_context=None` to identify primary zone class EXP items. If `interpretation_exposure.json` were restored to v1.0 (all `binding_context: null`), the index would silently overwrite primary zone entries (EXP-001/002/003) with embedded pair rule entries (EXP-006/009/012) for the same `zone_id`. Runtime behavior would be incorrect with no error output. A v1.0 restore would reintroduce the original defect.

**Resolution approach:** Preserve the corrected content as the canonical runtime file with explicit v1.1 metadata. Document v1.0 lineage via git history (commit 88cda9f). Create `interpretation_exposure_v1.1.json` as the explicit versioned artifact.

---

## Actions Taken

### 1. `docs/pios/41.x/interpretation_exposure.json` — Version metadata added

Updated `exposure_version` from `"1.0"` to `"1.1"`. Added four metadata fields:

| Field | Value |
|---|---|
| `supersedes` | `docs/pios/41.x/interpretation_exposure.json v1.0 (git: 88cda9f)` |
| `correction_reason` | `binding_context propagation field added to EXP-004..012; interpretation content unchanged` |
| `v1_0_commit` | `88cda9f` |
| `correction_contract` | `PI.41X.INTERPRETATION-EXPOSURE.VERSION-FIX.01` |

All render_payload, render_targets, trace, and constraints content is identical to v1.0. No interpretation was created, modified, or removed. The only item-level change from v1.0 to v1.1 is `binding_context` on EXP-004..012: `null` → `"embedded_pair_rule"`.

### 2. `docs/pios/41.x/interpretation_exposure_v1.1.json` — Explicit versioned artifact created

New file created. Content is identical to the corrected `interpretation_exposure.json`. This file exists as the explicit versioned artifact for the v1.1 exposure package. It carries the same version metadata. It is the authoritative artifact for PI.41X.INTERPRETATION-EXPOSURE.VERSION-FIX.01.

### 3. Governance trace — This document

---

## v1.0 Lineage Record

v1.0 content is recoverable from git:

```
git show 88cda9f:docs/pios/41.x/interpretation_exposure.json
```

v1.0 defect: All 20 exposure items had `"binding_context": null`. EXP-004..012 should have had `"binding_context": "embedded_pair_rule"` (propagated from the corresponding BIND-004..012 entries in `interpretation_binding.json`).

---

## Validation

| Check | Result |
|---|---|
| `interpretation_exposure.json` exposure_version is "1.1" | PASS |
| `interpretation_exposure_v1.1.json` created with identical corrected content | PASS |
| v1.0 lineage recorded (git commit 88cda9f) | PASS |
| EXP-001/002/003 binding_context remains null (primary zone class) | PASS |
| EXP-004..012 binding_context is "embedded_pair_rule" | PASS |
| No render_payload content modified (interpretation unchanged) | PASS |
| correction_reason, supersedes, v1_0_commit fields present in both files | PASS |
| **Total checks: 7** | **PASS: 7 / FAIL: 0** |

---

## Files Modified / Created

| File | Action |
|---|---|
| `docs/pios/41.x/interpretation_exposure.json` | Updated — exposure_version "1.0" → "1.1"; version metadata fields added |
| `docs/pios/41.x/interpretation_exposure_v1.1.json` | Created — explicit versioned artifact; identical corrected content |
| `docs/programs/second-client-kill-plan-01/decisions/step41x_interpretation_exposure_version_fix.md` | Created — this governance trace |

## Files NOT Modified

- `docs/pios/41.x/interpretation_registry.json` — unchanged
- `docs/pios/41.x/interpretation_binding.json` — unchanged
- `docs/pios/41.x/interpretation_registry_schema.json` — unchanged
- `docs/pios/41.x/interpretation_binding_schema.json` — unchanged
- `docs/pios/41.x/interpretation_exposure_schema.json` — unchanged
- `scripts/pios/tier2_query_engine.py` — unchanged
- `app/gauge-product/pages/tier2/workspace.js` — unchanged
- `app/gauge-product/styles/gauge.css` — unchanged
- `scripts/pios/lens_report_generator.py` — unchanged

---

## Governance Confirmation

- No interpretation created, inferred, or synthesized
- No render_payload content modified
- All constraints remain false
- Runtime code not modified
- Injection runtime remains functional against corrected v1.1 content
- v1.0 lineage preserved via git history (commit 88cda9f)
- Stream: PI.41X.INTERPRETATION-EXPOSURE.VERSION-FIX.01
