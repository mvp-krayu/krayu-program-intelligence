# IG.1B — Baseline Binding

**Stream:** IG.1B  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document formally binds IG.1 baseline re-ingestion execution to its governing bootstrap variables. All fields are explicit. No field is inferred.

---

## 2. BOOTSTRAP VARIABLE BINDING

| Field | Resolved Value |
|---|---|
| `WORKSPACE_ROOT` | `~/Projects` |
| `REPO_ROOT` | `~/Projects/k-pi-core` |
| `BASELINE_ANCHOR` | `pios-core-v0.4-final` |
| `SOURCE_MODE` | `SNAPSHOT` |
| `SNAPSHOT_BASELINE_PATH` | `~/Projects/blueedge-program-intelligence/source-v3.23/` |
| `SNAPSHOT_VARIANT_ENABLED` | `false` |
| `RUN_MODE` | `BASELINE_REINGESTION` |
| `EVIDENCE_ROOT` | `~/Projects/k-pi-core/docs/evidence/IG.1/` |
| `OUTPUT_ROOT` | `~/Projects/k-pi-core/docs/pios/IG.1B/` |

---

## 3. BASELINE ANCHOR REFERENCE

- **Tag:** `pios-core-v0.4-final`
- **Status:** READ-ONLY — reference only, no write target
- **Purpose:** lineage traceability anchor for this re-ingestion run
- **Verification:** tag must exist in repository before execution proceeds

---

## 4. WORKING BRANCH

- **Branch:** `work/ig-foundation`
- **Status:** ACTIVE
- **Rule:** all IG.1B artifacts must be committed to this branch only
- **Forbidden:** direct commits to `main`, any baseline anchor tag, or any protected branch

---

## 5. SNAPSHOT IDENTITY

| Property | Value |
|---|---|
| Snapshot label | `blueedge-source-v3.23` |
| Snapshot version | `v3.23.0` |
| Root path | `~/Projects/blueedge-program-intelligence/source-v3.23/` |
| Run ID | `run_02_blueedge` |
| Run type | `controlled_reuse` |
| Status at binding | `not_started` |

**Primary evidence paths within snapshot:**

| Path | Class |
|---|---|
| `source-v3.23/BlueEdge_Unified_Architecture_v3_23_0.html` | documentation |
| `source-v3.23/BlueEdge_Competitive_Dashboard_Feb2026.html` | documentation |
| `source-v3.23/Blue_Edge_PMO_Dashboard.html` | documentation |
| `source-v3.23/analysis/` | extraction metadata |
| `source-v3.23/extracted/backend/` | code (397 files) |
| `source-v3.23/extracted/frontend/` | code (324 files) |
| `source-v3.23/extracted/platform/` | code (741 files) |

**Provenance-only paths (accessible for traceability, not as ingestion inputs):**

| Path | Status |
|---|---|
| `source-v3.23/raw/blueedge-backend-v3_23_0-COMPLETE.tar` | PROVENANCE ONLY |
| `source-v3.23/raw/blueedge-frontend-v3_23_0-COMPLETE.tar` | PROVENANCE ONLY |
| `source-v3.23/raw/blueedge-platform-v3_23_0-COMPLETE.tar` | PROVENANCE ONLY |

---

## 6. RUN MODE

- **RUN_MODE:** `BASELINE_REINGESTION`
- **Definition:** Re-execute the full ingestion pipeline (40.2 → 40.3 → 40.4) against the bound snapshot, producing fresh artifacts for comparison against the existing baseline artifacts
- **Variant:** DISABLED (`SNAPSHOT_VARIANT_ENABLED = false`)
- **Live sources:** PROHIBITED

---

## 7. VARIANT STATE

- **SNAPSHOT_VARIANT_ENABLED:** `false`
- **SNAPSHOT_VARIANT_PATH:** `null`
- Variant comparison is explicitly disabled for this binding
- No variant snapshot is bound or authorized under IG.1B

---

## 8. ANCHOR PROTECTION CONFIRMATION

The following anchors are confirmed READ-ONLY under this binding:

| Anchor | Status |
|---|---|
| `pios-core-v0.4-final` | READ-ONLY |
| `demo-execlens-v1-final` | READ-ONLY |
| `governance-v1-final` | READ-ONLY |

No execution output from IG.1B may target, rebase on, or modify any of these anchors.

---

## 9. GOVERNANCE

- This binding is owned by IG.1B
- Changes to any binding field require a new stream contract
- Variant enablement requires a separate authorized contract
