# Governance Freeze Summary

**Stream:** PI.PSEE-PIOS.GOVERNED-DPSIG-BASELINE.FREEZE.01 — Task 3  
**Date:** 2026-05-08  
**Mode:** CERTIFICATION_MODE

---

## Freeze Declaration

The DPSIG platform state at commit `092e251` (tag `governed-dpsig-baseline-v1`) is declared the new authoritative baseline.

**All future integrations must start from this baseline.**

The previous generic pipeline baseline (`93098cb`, tag `productized-pios-lens-baseline-93098cb`) remains valid only for pre-DPSIG forensic comparison. It is NOT the active baseline for any new stream.

---

## Frozen Baseline Lineage

| Item | Value |
|---|---|
| New baseline commit | 092e251 |
| New baseline tag | governed-dpsig-baseline-v1 |
| Previous baseline commit | 93098cb |
| Previous baseline tag | productized-pios-lens-baseline-93098cb |
| Commit delta | 36 commits |

---

## What Is Frozen

### Pipeline Execution Manifest

`docs/governance/pipeline_execution_manifest.json` — FROZEN — AUTHORITATIVE.

The lane model (A/B/C/D), execution modes, forbidden patterns, and implementation freeze rules are locked at this baseline. No future stream may mutate the manifest without an explicit manifest amendment contract.

### DPSIG Extension Methodology

The DPSIG Class 4 runtime is frozen as:

- Script: `scripts/pios/dpsig/derive_relational_signals.py` (SCRIPT_VERSION=1.0)
- Input: `clients/<client>/psee/runs/<run>/structure/40.4/canonical_topology.json`
- Output: `artifacts/dpsig/<client>/<run>/dpsig_signal_set.json`
- Signals: DPSIG-031 (CPI), DPSIG-032 (CFA)
- Thresholds: CPI_HIGH=5.0, CPI_ELEVATED=2.0, CFA_DOMINANT=0.60, CFA_ASYMMETRIC=0.35
- **Thresholds are LOCKED.** Any change requires SCRIPT_VERSION increment + new stream contract.

No future stream may modify the DPSIG Class 4 derivation formula, thresholds, or output schema without explicit authority.

### Readiness Gate Principle

The executive readiness gate (`_classify_dpsig_readiness_state`) is frozen:

- 5 states: EXECUTIVE_READY, EXECUTIVE_READY_WITH_QUALIFIER, DIAGNOSTIC_ONLY, SUPPRESSED_FROM_EXECUTIVE, BLOCKED_PENDING_DOMAIN_GROUNDING
- Container sets (`_DPSIG_DIAGNOSTIC_ONLY_CONTAINERS`, `_DPSIG_SUPPRESSED_CONTAINERS`) are LOCKED
- Rule logic (C-01, C-02, C-04) is LOCKED
- Gate is client-agnostic — no client-specific branching permitted

### Executive Cognitive Projection Model

The stabilization design is frozen as the pre-Path-B reference:

- Aliasing rules: ALI-01..ALI-07 (see projection_aliasing_taxonomy.json)
- Qualifier taxonomy: Q-00..Q-04
- Terminology normalization table: 17 terms
- Three-layer projection stack (structural truth / semantic projection / executive cognition)
- Implementation NOT yet authorized — design only at this baseline

### FastAPI Diagnostic-Only Behavior

FastAPI `run_02_oss_fastapi_pipeline` behavior is frozen:

- `readiness_state = DIAGNOSTIC_ONLY` — by evidence (CLU-17/src is ungrounded filesystem container)
- `executive_rendering_allowed = False`
- `severity_band = CRITICAL` (preserved in data layer)
- `headline_label = STRUCTURAL DIAGNOSTIC`
- This state remains correct until domain grounding is established for FastAPI

### BlueEdge Executive-Ready Behavior

BlueEdge `run_blueedge_productized_01_fixed` behavior is frozen:

- `readiness_state = EXECUTIVE_READY` — by evidence (backend_modules, 13/13 grounded domains)
- `executive_rendering_allowed = True`
- `severity_band = ELEVATED`
- `CPI = 2.1176, CFA = 0.1714`
- Salience = 0.0871 (below apex threshold — standard position)

---

## Future Integration Methodology

Any stream from this baseline must:

1. Cite `governed-dpsig-baseline-v1` (commit 092e251) as its baseline
2. Load and comply with `docs/governance/pipeline_execution_manifest.json`
3. Not modify DPSIG Class 4 thresholds without explicit authority
4. Not modify the readiness gate container sets without explicit authority
5. Not introduce client-specific logic in the DPSIG or readiness gate code
6. Produce TAXONOMY-01 replay-stable artifacts
7. Preserve FastAPI DIAGNOSTIC_ONLY state unless a domain grounding contract is issued
8. Preserve BlueEdge EXECUTIVE_READY state unless topology changes invalidate it

---

## What Remains Deferred

| Item | State |
|---|---|
| Cognitive projection implementation (Layer 3 rendering) | DESIGN ONLY — implementation not authorized |
| Path B: PI.AGENTIC-SEMANTIC-ORCHESTRATION.01 | NOT YET STARTED |
| DPSIG Class 1/2/3/5/6/7/8 | Deferred — Class 4 only at this baseline |
| Domain grounding for FastAPI | Deferred — no grounding contract issued |
| BlueEdge domain grounding expansion | Partial (5/17 domains grounded) — deferred |
| Dual-client productized E2E validation | Partial — individual validations complete |

---

## Forbidden Without New Governance Amendment

- Modifying DPSIG Class 4 thresholds
- Adding client-specific logic to readiness gate or renderer
- Suppressing DPSIG evidence from engineering data layer
- Bypassing the readiness gate for any client
- Committing generated HTML reports as governed artifacts
- Treating the previous baseline (93098cb) as current for new streams
- Issuing Path B work before PI.AGENTIC-SEMANTIC-ORCHESTRATION.01 is contracted
