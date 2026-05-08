# Baseline Content Inventory

**Stream:** PI.PSEE-PIOS.GOVERNED-DPSIG-BASELINE.FREEZE.01 — Task 2  
**Date:** 2026-05-08  
**Baseline commit:** 092e251 (governed-dpsig-baseline-v1)  
**Mode:** CERTIFICATION_MODE

---

## Classification Legend

| Code | Meaning |
|---|---|
| COMMITTED_REQUIRED | In git at HEAD; required for baseline validity |
| RUNTIME_LOCAL_EXPECTED | Not committed; present on disk; reproducible on demand |
| GITIGNORED_EXPECTED | Covered by .gitignore; must NOT be committed |
| DO_NOT_COMMIT | Excluded from commit by governance rule |
| MISSING | Absent — would be a gap if required |
| NEEDS_REVIEW | Present but requires classification confirmation |

---

## Layer 0 — Structural Truth (Sovereign)

| Artifact | Classification | Location |
|---|---|---|
| BlueEdge canonical_topology.json (vault) | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/canonical_topology.json` |
| BlueEdge binding_envelope.json | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/binding_envelope.json` |
| BlueEdge vault_manifest.json | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/vault_manifest.json` |
| BlueEdge signal_registry.json | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault/signal_registry.json` |
| FastAPI canonical_topology.json (semantic) | COMMITTED_REQUIRED | `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/semantic/topology/canonical_topology.json` |

---

## Layer 1 — Semantic / Domain Projection

| Artifact | Classification | Location |
|---|---|---|
| BlueEdge semantic_topology_model.json | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_model.json` |
| BlueEdge semantic_topology_layout.json | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_layout.json` |
| BlueEdge semantic_bundle_manifest.json | COMMITTED_REQUIRED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/semantic_bundle_manifest.json` |
| BlueEdge structure adapter (canonical_topology.json) | GITIGNORED_EXPECTED | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/structure/40.4/canonical_topology.json` |
| FastAPI semantic_topology_model.json | COMMITTED_REQUIRED | `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/semantic/topology/semantic_topology_model.json` |
| FastAPI semantic_topology_layout.json | COMMITTED_REQUIRED | `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/semantic/topology/semantic_topology_layout.json` |
| FastAPI semantic_bundle_manifest.json | COMMITTED_REQUIRED | `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/semantic/semantic_bundle_manifest.json` |

---

## Layer 2 — DPSIG Relational Intelligence

| Artifact | Classification | Location |
|---|---|---|
| derive_relational_signals.py (SCRIPT_VERSION=1.0) | COMMITTED_REQUIRED | `scripts/pios/dpsig/derive_relational_signals.py` |
| FastAPI dpsig_signal_set.json | COMMITTED_REQUIRED | `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/dpsig_signal_set.json` |
| BlueEdge dpsig_signal_set.json | COMMITTED_REQUIRED | `artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json` |
| FastAPI executive_readiness_validation.json | COMMITTED_REQUIRED | `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/executive_readiness_validation.json` |
| FastAPI severity_alignment_validation.json | COMMITTED_REQUIRED | `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/severity_alignment_validation.json` |
| FastAPI projection_replay_diff.json | COMMITTED_REQUIRED | `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/projection_replay_diff.json` |
| FastAPI replay_diff.json | COMMITTED_REQUIRED | `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/replay_diff.json` |

---

## Layer 3 — Projection Weighting + Executive Readiness Gate

| Artifact | Classification | Location |
|---|---|---|
| lens_report_generator.py (gate + renderer) | COMMITTED_REQUIRED | `scripts/pios/lens_report_generator.py` |

---

## Layer 4 — E2E Validation Artifacts

| Artifact | Classification | Location |
|---|---|---|
| FastAPI e2e_validation.json (27/27 PASS) | COMMITTED_REQUIRED | `artifacts/e2e/fastapi/run_02_oss_fastapi_pipeline/e2e_validation.json` |
| BlueEdge dpsig_blueedge_projection_validation.json (25/25 PASS) | COMMITTED_REQUIRED | `artifacts/e2e/blueedge/run_blueedge_productized_01_fixed/dpsig_blueedge_projection_validation.json` |

---

## Governance Artifacts

| Artifact | Classification | Location |
|---|---|---|
| pipeline_execution_manifest.json | COMMITTED_REQUIRED | `docs/governance/pipeline_execution_manifest.json` |
| git_structure_contract.md | COMMITTED_REQUIRED | `docs/governance/runtime/git_structure_contract.md` |
| reference_boundary_contract.md | COMMITTED_REQUIRED | `docs/governance/runtime/reference_boundary_contract.md` |
| governance_master_capsule.md | COMMITTED_REQUIRED | `docs/governance/governance_master_capsule.md` |
| signal_namespace_alias_registry.json | COMMITTED_REQUIRED | `docs/governance/signal_namespace_alias_registry.json` |

---

## Cognitive Projection Design (Design-Only, Pre-Path-B)

| Artifact | Classification | Location |
|---|---|---|
| EXECUTIVE_COGNITIVE_PROJECTION_STABILIZATION.md | COMMITTED_REQUIRED | `docs/psee/PI.PSEE-PIOS.EXECUTIVE-COGNITIVE-PROJECTION.STABILIZATION.01/EXECUTIVE_COGNITIVE_PROJECTION_STABILIZATION.md` |
| projection_aliasing_taxonomy.json | COMMITTED_REQUIRED | `docs/psee/PI.PSEE-PIOS.EXECUTIVE-COGNITIVE-PROJECTION.STABILIZATION.01/projection_aliasing_taxonomy.json` |

---

## Stream Documentation

| Artifact | Classification | Location |
|---|---|---|
| FASTAPI_E2E_RERUN_VALIDATION.md | COMMITTED_REQUIRED | `docs/psee/PI.LENS.END-TO-END-RERUN.FASTAPI.01/FASTAPI_E2E_RERUN_VALIDATION.md` |
| DPSIG_BLUEEDGE_PROJECTION_VALIDATION.md | COMMITTED_REQUIRED | `docs/psee/PI.PSEE-PIOS.DPSIG-BLUEEDGE-PROJECTION.VALIDATION.01/DPSIG_BLUEEDGE_PROJECTION_VALIDATION.md` |

---

## Gitignored Runtime Artifacts (Present on Disk)

| Artifact | Classification | Status |
|---|---|---|
| FastAPI reports/ (9 HTML + JSON) | GITIGNORED_EXPECTED | Reproducible via `lens_generate.sh` |
| BlueEdge reports/ (28 HTML + JSON) | GITIGNORED_EXPECTED | Reproducible via `lens_generate.sh` |
| BlueEdge structure/40.4/canonical_topology.json | GITIGNORED_EXPECTED | Format adapter — reproducible from vault data |

All three paths are under `clients/*/psee/runs/` which is gitignored. None may be committed.

---

## Summary

| Classification | Count |
|---|---|
| COMMITTED_REQUIRED | 25 |
| GITIGNORED_EXPECTED | 3 (on disk) |
| MISSING | 0 |
| NEEDS_REVIEW | 0 |

**All 25 COMMITTED_REQUIRED artifacts are present and committed at HEAD (092e251).**  
**No gaps. No missing artifacts. No review flags.**
