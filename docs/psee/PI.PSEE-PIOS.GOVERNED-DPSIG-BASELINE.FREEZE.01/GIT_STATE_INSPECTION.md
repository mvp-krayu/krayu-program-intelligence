# Git State Inspection

**Stream:** PI.PSEE-PIOS.GOVERNED-DPSIG-BASELINE.FREEZE.01 — Task 1  
**Date:** 2026-05-08  
**Mode:** CERTIFICATION_MODE

---

## Current State

| Item | Value |
|---|---|
| Branch | feature/psee-pios-integration-productized |
| HEAD | 092e251 |
| Previous baseline | 93098cb (productized-pios-lens-baseline-93098cb) |
| Working tree | CLEAN — no uncommitted changes |
| Untracked files | NONE |
| Modified tracked files | NONE |

**Branch note:** `feature/psee-pios-integration-productized` is outside the canonical branch set defined in `docs/governance/runtime/git_structure_contract.md`. Per established session pattern, this is flagged and execution proceeds. The baseline tag will anchor the HEAD commit regardless of branch canonicity.

---

## Commit Chain: 93098cb → 092e251 (36 commits)

| Hash | Message |
|---|---|
| 092e251 | [PROJ-STAB] Executive cognitive projection stabilization — design complete |
| da268c2 | [DPSIG-BLUEEDGE] EXECUTIVE_READY — 25/25 PASS — client-agnostic governance confirmed |
| cf388cd | [E2E-FASTAPI] E2E_PASS_WITH_DIAGNOSTIC_ONLY_DPSIG — 27/27 checks PASS |
| 9da0c26 | [DPSIG] Severity taxonomy alignment — CRITICAL headline suppressed for DIAGNOSTIC_ONLY |
| 94747af | [DPSIG] Executive Readiness Gate — gate implementation operational in LENS renderer |
| a192c53 | [DPSIG] Executive Readiness Gate — governance rules for CEO-safe cluster projection |
| 2cc0538 | [LENS] Report Contract Compliance Fix — certification and validation artifacts |
| ae1586c | [LENS] Report Contract Compliance Validation — MIXED_CONTRACT_DRIFT diagnosed |
| 76cfe39 | [LENS] Selector Run Wiring Correction — DPSIG run productized and selectable |
| 196fcd8 | [DPSIG] LENS Executive Validation — Path A deterministic intelligence commercially validated |
| 265f7a1 | [DPSIG] Projection Weighting Implementation — LENS TIER-1 executive salience operational |
| 80da61d | [DPSIG] Projection Integration Governance — structural salience to executive intelligence contract |
| 5b60e83 | [DPSIG] Runtime Certification — Class 4 cluster pressure runtime certified for projection integration |
| ffee7d6 | [DPSIG] Runtime Normalization Implementation — Class 4 cluster pressure runtime operational |
| 7d509a3 | [MANIFEST] Pipeline Execution Perimeter Contract — freeze runtime boundaries for DPSIG family |
| 8bc2841 | [DPSIG] Runtime Normalization Design — production contract for DPSIG signal derivation |
| b7b09c1 | [DPSIG] Deterministic Relational Enrichment — Architecture Definition |
| 27e3848 | [PSEE-CLOSURE] Formal closure of PSEE semantic governance exploration stream family |
| d708d91 | [PSEE-DRI] Deterministic replay instrumentation — MDT-01..MDT-12 implementation |
| … (17 earlier PSEE-PIOS streams) | … |

---

## Existing Tags

The repository carries an extensive tag history. Relevant prior baseline tags:

| Tag | Purpose |
|---|---|
| `productized-pios-lens-baseline-93098cb` | Previous generic pipeline baseline |
| `psee-runtime-baseline-v1` | Early PSEE runtime anchor |
| `lens-e2e-baseline-blueedge` | Pre-DPSIG BlueEdge E2E anchor |
| `lens-e2e-complete-v1` | Pre-DPSIG LENS E2E anchor |
| `lens-e2e-stable-v1` | LENS stability anchor |
| `lens-vnext-baseline` | LENS v-next design anchor |

No tag named `governed-dpsig-baseline-v1` exists — to be created in Task 7.

---

## Gitignored Runtime Artifacts (Present on Disk, Not Committed)

| Path | Files | Status |
|---|---|---|
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/reports/` | 9 HTML + JSON | GITIGNORED_EXPECTED — reproducible via `lens_generate.sh` |
| `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/` | 28 HTML + JSON | GITIGNORED_EXPECTED — reproducible via `lens_generate.sh` |
| `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/structure/40.4/canonical_topology.json` | 1 JSON | GITIGNORED_EXPECTED — format adapter, reproducible from vault data |

All three paths are under `clients/*/psee/runs/` which is covered by `.gitignore`. None require commit. All are reproducible from committed artifacts.

---

## Files That Must NOT Be Committed

- All generated HTML reports (`clients/*/psee/runs/*/reports/`)
- The BlueEdge structure adapter (`structure/40.4/canonical_topology.json`) — runtime-generated, not a governance artifact
- Any `.env` or local configuration files
- `app/*/node_modules/`, `.next/` build artifacts

---

## Committed Governance Artifacts (Sample — Confirmed Present)

All 15 required artifacts from the baseline verification check confirmed `EXISTS` and committed at HEAD. See BASELINE_CONTENT_INVENTORY.md for full list.
