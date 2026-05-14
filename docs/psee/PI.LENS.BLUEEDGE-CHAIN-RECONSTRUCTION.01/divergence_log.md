# Divergence Log
## PI.LENS.BLUEEDGE-CHAIN-RECONSTRUCTION.01

**Generated:** 2026-05-01
**Status:** BLOCKERS DOCUMENTED — no metric divergence

---

## Classification

| Type | Count |
|------|-------|
| BLOCKERS (cannot reconstruct) | 4 |
| Metric divergences (value mismatches) | 0 |
| Schema mismatches | 1 (documented — not a blocker) |

---

## BLOCKER-01 — canonical_repo absent

**Classification:** STRUCTURAL GAP  
**Severity:** CRITICAL  
**Stage blocked:** Phase 2 (Intake Verification)

The BlueEdge source archive was never extracted to `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo`. This path is registered in `source_manifest.json["extracted_path"]` and is the required input for Phase 2.

**Archive:** Present at external path (`/Users/khorrix/Projects/blueedge-clean-run/source-raw/raw/blueedge-platform-v3_23_0-COMPLETE.tar`, SHA256 verified)  
**Extraction:** Never committed to k-pi-core  
**Resolution:** Re-execute `PI.BLUEEDGE.CLEAN-INTAKE.01` — extract archive to `extracted_path`

---

## BLOCKER-02 — structure_path artifacts absent (40.2/40.3)

**Classification:** STRUCTURAL GAP  
**Severity:** CRITICAL  
**Stage blocked:** Phase 3 (40.x Structural Verification)

The `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/structure/` directory does not exist. Required artifacts:
- `40.2/structural_node_inventory.json`
- `40.3/structural_topology_log.json`

These require the 40.x structural scanner to be run against canonical_repo (BLOCKER-01).

**Resolution:** BLOCKER-01 first, then re-execute `PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01`

---

## BLOCKER-03 — dom_layer_path absent

**Classification:** STRUCTURAL GAP  
**Severity:** CRITICAL  
**Stage blocked:** Phase 5 (generic binding path), Phase 8a (vault construction)

`docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json` does not exist. The full docs/psee directory for `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` is absent.

This file is the 13-domain PATH_EVIDENCE_ONLY layer used to:
1. Build binding_envelope.json (generic path in Phase 5)
2. Build canonical_topology.json in Phase 8a vault construction

The canonical_topology.json value in the reconstruction run is a COPY from the baseline vault — its upstream derivation path (dom_path_domain_layer.json) cannot be independently verified.

**Resolution:** Re-execute `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01`

---

## BLOCKER-04 — fastapi_conformance_path absent

**Classification:** STRUCTURAL GAP  
**Severity:** CRITICAL  
**Stage blocked:** Phase 5 (primary binding path), Phase 6+7 (signal/zone artifacts)

`docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/` does not exist. This directory is registered in `source_manifest.json["fastapi_conformance_path"]` and is the primary source for:
- `binding_envelope_fastapi_compatible.json` (Phase 5)
- `signal_projection_fastapi_compatible.json` (Phase 6+7)
- `condition_correlation_state_fastapi_compatible.json` (Phase 6+7)
- `pressure_zone_state_fastapi_compatible.json` (Phase 6+7)

Without this, signal values cannot be regenerated — they are STAGE_NOT_AUTOMATED.

**Resolution:** Re-execute `PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`

---

## Schema Mismatch (documented, not a blocker)

**Artifact:** `run_be_chain_reconstruction_01/structure/40.4/canonical_topology.json`

The copied canonical_topology.json uses the FastAPI `domains[]` schema (adapted from dom_path_domain_layer.json PATH_EVIDENCE_ONLY). The native 40.4 output uses a `cluster_topology` schema. This is an existing architectural decision documented in the vault artifact's `schema_adaptation_note` field.

Phase 3 of the pipeline checks this file for existence only (does not validate schema). This schema mismatch is pre-existing and documented.

**No action required** — this is consistent with the baseline.

---

## VR-09 Mismatch (pipeline hypothetical — Phase 8b not reached)

**Artifact:** `run_be_chain_reconstruction_01/integration/integration_validation.json`

The pipeline's VR-09 check (Phase 8b) looks for `validation_status` field. The UUID run's integration_validation.json uses `summary.status = "PASS"`, not `validation_status`. If Phase 8b were reached, VR-09 would FAIL.

This is a known pre-existing schema gap between the UUID run's integration artifact and the VR-09 check field name. Phase 8b was not reached in this pipeline run, so this is HYPOTHETICAL only.

---

## Metric Divergences

**NONE** — all 11 metric checks PASS when validated against static copies and baseline vault.

No value mutations were introduced. All copies are exact (zero transformation).
