# IG.1B — Input Boundary

**Stream:** IG.1B  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** ACTIVE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document defines the strict input boundary for IG.1 baseline re-ingestion. It specifies what may and may not be used as input during execution, and establishes the evidence-only boundary that prevents contamination of fresh regeneration with prior-run artifacts.

---

## 2. ALLOWED INPUTS

### 2.1 Primary Evidence (Ingestion Inputs)

These paths are the sole authorized ingestion inputs for the re-ingestion run:

| Path | Class | Role |
|---|---|---|
| `~/Projects/blueedge-program-intelligence/source-v3.23/BlueEdge_Unified_Architecture_v3_23_0.html` | documentation | primary evidence |
| `~/Projects/blueedge-program-intelligence/source-v3.23/BlueEdge_Competitive_Dashboard_Feb2026.html` | documentation | primary evidence |
| `~/Projects/blueedge-program-intelligence/source-v3.23/Blue_Edge_PMO_Dashboard.html` | documentation | primary evidence |
| `~/Projects/blueedge-program-intelligence/source-v3.23/analysis/` | extraction metadata | extraction-support evidence only |
| `~/Projects/blueedge-program-intelligence/source-v3.23/extracted/backend/` | code | primary evidence |
| `~/Projects/blueedge-program-intelligence/source-v3.23/extracted/frontend/` | code | primary evidence |
| `~/Projects/blueedge-program-intelligence/source-v3.23/extracted/platform/` | code | primary evidence |

### 2.2 Bootstrap and Governance Inputs

These documents are authorized read inputs during binding and execution:

| Path | Role |
|---|---|
| `docs/pios/IG.1A/IG.1A_BOOTSTRAP_INTERFACE_SPEC.md` | bootstrap authority |
| `docs/pios/IG.1A/IG.1A_RUNTIME_VARIABLE_CONTRACT.md` | variable contract |
| `docs/pios/IG.1A/IG.1A_SOURCE_BINDING_MODEL.md` | source binding model |
| `docs/pios/IG.1A/IG.1A_RUN_MODE_MATRIX.md` | run mode authority |
| `docs/pios/IG.1B/IG.1B_BASELINE_BINDING.md` | binding state |
| `docs/pios/runs/run_02_blueedge/evidence_boundary.md` | evidence boundary reference |

### 2.3 Reference Comparison Inputs (READ-ONLY)

Existing baseline artifacts may be read **for comparison only** after fresh regeneration is complete. They must not be used as inputs to the re-ingestion pipeline itself:

| Path | Role |
|---|---|
| `docs/pios/40.2/` (all files) | comparison reference — READ-ONLY |
| `docs/pios/40.3/` (all files) | comparison reference — READ-ONLY |
| `docs/pios/40.4/` (all files) | comparison reference — READ-ONLY |

---

## 3. FORBIDDEN INPUTS

The following are explicitly forbidden as ingestion inputs:

### 3.1 Generated Artifacts as Inputs

- **40.2 artifacts must NOT be used as input to 40.2 regeneration**
- **40.3 artifacts must NOT be used as input to 40.3 regeneration**
- **40.4 artifacts must NOT be used as input to 40.4 regeneration**
- Prior-run generated files are reference artifacts only, never ingestion source material

### 3.2 Live Adapter Sources

| Forbidden Source | Reason |
|---|---|
| GitHub API (live) | OUT OF SCOPE — IG.1A SOURCE_BINDING_MODEL §3.2 |
| Jira API (live) | OUT OF SCOPE — IG.1A SOURCE_BINDING_MODEL §3.2 |
| Any external REST/GraphQL API | OUT OF SCOPE — no live mode authorization |
| Any authenticated external connection | OUT OF SCOPE |

### 3.3 Excluded Evidence Paths

Per `run_02_blueedge/evidence_boundary.md`, the following are explicitly excluded:

| Path | Reason |
|---|---|
| `~/Projects/blueedge-program-intelligence/docs/reverse_engineering/` | excluded by evidence boundary |
| `~/Projects/blueedge-program-intelligence/docs/program-charter/` | excluded by evidence boundary |
| `~/Projects/blueedge-program-intelligence/docs/execution-telemetry/` | excluded by evidence boundary |
| `~/Projects/blueedge-program-intelligence/docs/signal-layer/` | excluded by evidence boundary |
| `~/Projects/blueedge-program-intelligence/docs/case-study/` | excluded by evidence boundary |
| `~/Projects/blueedge-program-intelligence/weekly/` | excluded by evidence boundary |

### 3.4 Downstream Artifacts

| Forbidden Input | Reason |
|---|---|
| `docs/pios/40.5/` or later | downstream of re-ingestion scope — OUT OF SCOPE |
| `docs/pios/41.x/` | semantic layer — separate domain |
| `docs/pios/42.x/` | runtime layer — separate domain |
| `docs/pios/43.x/` | binding layer — separate domain |
| `docs/pios/44.x/` | projection layer — separate domain |
| `docs/pios/51.x/` | demo layer — separate domain |
| Any `runs/run_01_pios_baseline/` artifact | wrong run context |

### 3.5 Variant Sources

| Forbidden Input | Reason |
|---|---|
| Any variant snapshot path | `SNAPSHOT_VARIANT_ENABLED = false` |
| Any comparative dataset beyond baseline | not authorized under IG.1B |

---

## 4. EVIDENCE-ONLY BOUNDARY RULE

The re-ingestion pipeline operates on **evidence only**. This means:

1. Input to 40.2 = raw source-v3.23 evidence files only
2. Input to 40.3 = 40.2 fresh outputs only (not prior 40.2 baseline)
3. Input to 40.4 = 40.3 fresh outputs only (not prior 40.3 baseline)
4. At no point may existing baseline artifacts (docs/pios/40.2, 40.3, 40.4) be read into the ingestion pipeline as source

The pipeline must be reproducible from evidence alone.

---

## 5. BOUNDARY ENFORCEMENT

At execution time, the executor must confirm:

- [ ] All active input paths are in the allowed list
- [ ] No generated baseline artifacts are fed into the pipeline
- [ ] No live adapter connections are attempted
- [ ] No excluded evidence paths are accessed
- [ ] Provenance-only tarballs are not parsed as ingestion inputs

Any boundary violation → STOP → FAIL CLOSED

---

## 6. GOVERNANCE

- This boundary is owned by IG.1B
- Boundary changes require a new stream contract
- Evidence boundary reference: `docs/pios/runs/run_02_blueedge/evidence_boundary.md`
