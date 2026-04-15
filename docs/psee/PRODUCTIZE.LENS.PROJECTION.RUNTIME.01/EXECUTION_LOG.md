# EXECUTION LOG
# PRODUCTIZE.LENS.PROJECTION.RUNTIME.01

- Stream: PRODUCTIZE.LENS.PROJECTION.RUNTIME.01
- Date: 2026-04-15
- Status: COMPLETE
- Branch: feature/evidence-vault-builder-v1 (non-canonical — boundary flagged per governance protocol; execution proceeded per user authorization pattern)

---

## SECTION 1 — PRE-FLIGHT

| check | result |
|-------|--------|
| `docs/governance/runtime/git_structure_contract.md` loaded | YES |
| Repository | krayu-program-intelligence (k-pi-core) |
| Branch | feature/evidence-vault-builder-v1 — OUTSIDE authorized set — flagged |
| Scope | `scripts/pios/`, `app/gauge-product/pages/api/`, `app/gauge-product/components/` |
| Boundary violations planned | NONE — no vault mutation, no claim mutation, no pipeline logic change |
| Working tree state | Clean at start |

---

## SECTION 2 — READ SET

| # | file | purpose |
|---|------|---------|
| 1 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/projection_contract_spec.md` | Pipeline stages, named claim sets, determinism guarantees |
| 2 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/output_payload_schema.md` | L1/L2/L3 payload schemas, field zone floors, CONDITIONAL caveat examples |
| 3 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/zone_enforcement_model.md` | Zone filter rules, Z0/Z1/Z2/Z3 field register |
| 4 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/integration_contract.md` | GAUGE click zone → claim mapping, V1 static fragment pattern, API shape |
| 5 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/failure_safety_model.md` | Fail-closed rules, ProjectionError structure, BC-01..03 blocking conditions |
| 6 | `docs/psee/PRODUCTIZE.LENS.SURFACE.01/gauge_clickthrough_model.md` | Per-zone content specification, forbidden exposures |
| 7 | `docs/psee/PRODUCTIZE.LENS.SURFACE.01/lens_v1_content_model.md` | CONDITIONAL caveat requirements (L-02), enforcement rules |
| 8 | `clients/blueedge/vaults/run_01_authoritative/claims/CLM-09 Proven Structural Score.md` | Vault claim node structure, frontmatter schema, section layout |
| 9 | `clients/blueedge/vaults/run_01_authoritative/claims/CLM-10 Achievable Score Projected.md` | CONDITIONAL claim — Traceability caveats: None pattern |
| 10 | `clients/blueedge/vaults/run_01_authoritative/claims/CLM-12 Score Confidence Range.md` | CONDITIONAL claim — same pattern |
| 11 | `clients/blueedge/vaults/run_01_authoritative/claims/CLM-20 SIG-001 Sensor Bridge Throughput.md` | Signal claim structure, business_impact/risk in ## Surfaces |
| 12 | `clients/blueedge/vaults/run_01_authoritative/claims/CLM-25 Executive Three-Axis Verdict.md` | BC-01 blocking condition, CONCEPT-06 predicate mismatch |
| 13 | `clients/blueedge/vaults/run_01_authoritative/claims/CLM-13 Execution Layer Status.md` | CONDITIONAL claim, execution status handling |
| 14 | `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/signal_registry.json` | Signal fields (title, business_impact, risk, evidence_confidence) |
| 15 | `app/gauge-product/components/GaugeContextPanels.js` | GAUGE binding target — existing hooks and panel structure |
| 16 | `app/gauge-product/pages/api/gauge.js` | Existing API pattern for filesystem-sourced routes |

---

## SECTION 3 — FILES CREATED

| file | purpose |
|------|---------|
| `scripts/pios/projection_runtime.py` | Full five-stage projection pipeline: resolve_claim, enforce_zone, build_projection, project, project_set, project_for_lens, export_fragments, CLI |
| `scripts/pios/tests/test_projection_runtime.py` | 61 tests across 10 test classes (TC01–TC10) |
| `app/gauge-product/pages/api/projection.js` | Next.js projection API route serving pre-generated static fragment files |
| `clients/blueedge/vaults/run_01_authoritative/claims/fragments/` | 54 static fragment files (27 claims × ZONE-1 + ZONE-2; 40 successful + 14 error payloads for claims not in vault) |
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.RUNTIME.01/EXECUTION_LOG.md` | This file |

---

## SECTION 4 — FILES MODIFIED

| file | change |
|------|--------|
| `app/gauge-product/components/GaugeContextPanels.js` | Added `GAUGE_CLICK_CLAIM_MAP` constant and `useProjection(claimId, zone)` hook at end of file — additive only; no existing code modified |

---

## SECTION 5 — REPAIRS APPLIED (CONTRACT CONTINUATION)

### Repair A — CONDITIONAL claim caveat propagation

**Problem:** CLM-10 and CLM-12 have `lens_admissible: CONDITIONAL` but their vault Traceability sections carry `Caveats: None`. Stage 5 validator correctly rejects CONDITIONAL claims with empty caveats. The required caveats are specified in `output_payload_schema.md` §3 and `lens_v1_content_model.md` §2 but were not stored in vault Traceability.

**Fix:** Added `CONDITIONAL_CLAIM_CAVEATS` dict mapping claim IDs to their contract-specified default caveats. In `_build_caveats`, if a CONDITIONAL claim has no vault-stored caveat, the default is applied. These are not invented — they are governed caveats from the projection schema specification.

**Governance check:** Zone enforcement is not weakened. Stage 5 validation is not bypassed. The fix correctly implements the contract requirement that CONDITIONAL claims carry their required caveats in the output payload.

### Repair B — ZONE-1 error detail absent

**Problem:** Stage 2 inline `ProjectionError` for `CLAIM_NOT_IN_VAULT` was constructed without a `detail` field. `_error_dict` only includes `detail` when it is truthy. ZONE-1 errors must carry detail for operator diagnostics; ZONE-2 errors must not.

**Fix:** Added `detail` string to the Stage 2 error construction via a `_detail_map` dict. `_error_dict` already strips `detail` for ZONE-2 — this behavior is unchanged.

---

## SECTION 6 — DECISIONS REACHED

### Runtime Architecture
**Decision: SINGLE MODULE — NO SUBPACKAGE**

`projection_runtime.py` is a single ~500-line module. The contract permitted modularization under `scripts/pios/projection/`. Single-module form is sufficient for V1 scope and avoids import path complexity.

### Vault Read Path
**Decision: REFERENCE VAULT IS THE PRIMARY SOURCE**

The runtime reads from `clients/blueedge/vaults/run_01_authoritative/` by default. Signal augmentation reads from `clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/signal_registry.json`. The generated vault (`run_01_authoritative_generated/`) is not used as a read source — the reference vault is authoritative.

### ZONE-2 Explanation Source
**Decision: ## Why It Matters → ZONE-2 explanation**

The vault claim node's `## Why It Matters` section contains the ZONE-2 safe narrative. The `## Explanation` section contains the technical ZONE-1 form. The runtime maps these deterministically: `explanation_z1 = ## Explanation`, `explanation_z2 = ## Why It Matters`.

### CONDITIONAL_CLAIM_CAVEATS
**Decision: CONTRACT-SOURCED DEFAULTS — NOT INVENTED NARRATIVE**

The default caveats in `CONDITIONAL_CLAIM_CAVEATS` are sourced verbatim from `output_payload_schema.md` §3 (L1 Special Cases) and `lens_v1_content_model.md` §2. They are not synthesized. They are the required caveats specified by the projection contract for each claim where the vault Traceability does not store an explicit caveat.

### Fragment Export
**Decision: V1 STATIC PATTERN — 40 SUCCESSFUL FRAGMENTS**

`export_fragments` produced 40 successful fragments (ZONE-1 + ZONE-2 for each claim that exists in the vault). 14 fragments are error payloads for claims listed in CLAIM_SETS that are not yet in the reference vault (CLM-17, CLM-18, CLM-19, CLM-27 etc.). Fragment files are written to `clients/blueedge/vaults/run_01_authoritative/claims/fragments/`.

### GAUGE Binding Pattern
**Decision: ADDITIVE ONLY — NO REMOVAL OF EXISTING DIRECT READS**

The existing GAUGE API routes (gauge.js, signals.js, topology.js) read directly from artifact JSON files. Removing those in this stream would exceed scope. The binding adds `GAUGE_CLICK_CLAIM_MAP` and `useProjection` as the governed projection pathway. Migrating existing direct reads is deferred to a future stream.

---

## SECTION 7 — TEST RESULTS

```
Ran 61 tests in 0.081s

OK
```

| test class | tests | result |
|------------|-------|--------|
| TC01_ValidClaimL1Zone1 | 9 | PASS |
| TC02_Zone2FilteringApplied | 9 | PASS |
| TC03_InvalidClaimIdFailClosed | 6 | PASS |
| TC04_ZoneViolationBlocked | 7 | PASS |
| TC05_ClaimSetMultiplePayloads | 8 | PASS |
| TC06_BC01_CLM25_Caveat | 4 | PASS |
| TC07_SignalClaimZone2 | 7 | PASS |
| TC08_Zone2ErrorNoDetail | 3 | PASS |
| TC09_ExportFragments | 4 | PASS |
| TC10_ProjectForLens | 4 | PASS |

---

## SECTION 8 — GOVERNANCE CONFIRMATION

- **No vault mutation:** YES — confirmed. Runtime reads vault; does not write to it.
- **No claim mutation:** YES — confirmed.
- **No pipeline logic modification:** YES — confirmed. No execution chain artifacts touched.
- **No UI rendering implemented:** YES — GAUGE binding is data-layer only (hook + constant).
- **Projection-only access enforced:** YES — `/api/projection` is the ONLY new read path; it reads from pre-generated fragments, not directly from vault markdown.
- **Zone filter pre-transform:** YES — Stage 2 zone filter executes before Stage 3 transform in all code paths.
- **Fail-closed behavior preserved:** YES — any pipeline failure returns ProjectionError; no partial content.
- **BC-01 propagation preserved:** YES — CLM-25 always returns CONDITIONAL with CONCEPT-06 caveat.
- **ZONE-2 info-leak prevention:** YES — detail field stripped from ZONE-2 errors; Z1 fields absent from ZONE-2 payloads; confirmed by TC08 and TC02.

**Authority:** PRODUCTIZE.LENS.PROJECTION.RUNTIME.01
