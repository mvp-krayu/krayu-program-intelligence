# Progression Readiness Report

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Definition

Progression readiness measures how close a client is to advancing from its current S-state to the next S-state. It is computed from the semantic debt inventory by measuring the proportion of non-blocking debt items.

Progression readiness is not a prediction. It is a deterministic measure of how much blocking debt remains between the client and its next qualification state.

---

## 2. Formula

```
readiness = 1 - (blocking_debt_count / total_debt_items)
```

Where:
- `blocking_debt_count` — the number of semantic debt items classified as blocking for the next S-state
- `total_debt_items` — the total number of semantic debt items in the client's inventory

**Edge case:** If `total_debt_items` is 0, readiness = 1.0 (no debt means no blocking debt).

---

## 3. Target S-State Mapping

| Current State | Target State |
|---------------|-------------|
| S0            | S1          |
| S1            | S2          |
| S2            | S3          |
| S3            | S4 (terminal) |

---

## 4. Client Results

### 4.1 BlueEdge (S2)

**Current S-state:** S2
**Target S-state:** S3

| Metric              | Value |
|---------------------|-------|
| Total debt items    | 15    |
| Blocking debt count | 13    |
| Non-blocking count  | 2     |
| Readiness score     | 0.133 |

**Blocking Debt Breakdown:**

| Category       | Count | Description                                         |
|----------------|-------|-----------------------------------------------------|
| grounding_gap  | 13    | Domains lacking semantic grounding anchors           |

**Assessment:** BlueEdge has very low readiness for S3 progression. 13 of 15 debt items are blocking, all in the grounding_gap category. This aligns with the low D2 (SEMANTIC_GROUNDING = 0.235) and D3 (LINEAGE_STRENGTH = 0.235) scores. S3 requires deep semantic grounding across all domains, and BlueEdge has significant work remaining.

The 2 non-blocking items are non-structural debts that do not gate S3 qualification.

### 4.2 FastAPI (S1)

**Current S-state:** S1
**Target S-state:** S2

| Metric              | Value |
|---------------------|-------|
| Total debt items    | 25    |
| Blocking debt count | 12    |
| Non-blocking count  | 13    |
| Readiness score     | 0.520 |

**Blocking Debt Breakdown:**

| Category         | Count | Description                                       |
|------------------|-------|---------------------------------------------------|
| missing_artifact | 3     | Required structural artifacts not yet produced     |
| grounding_gap    | 9     | Domains lacking semantic grounding anchors         |

**Assessment:** FastAPI has moderate readiness for S2 progression. 12 of 25 debt items are blocking, split between 3 missing artifacts and 9 grounding gaps. The 3 missing artifacts are structural prerequisites that must be resolved first (structural coverage, continuity assessment, reproducibility proof). The 9 grounding gaps require semantic grounding resolution.

The 13 non-blocking items include advisory debts, enrichment prerequisites, and non-gating documentation debts.

---

## 5. Comparative Summary

| Client   | Current | Target | Blocking | Total | Readiness | Primary Blockers              |
|----------|---------|--------|----------|-------|-----------|-------------------------------|
| BlueEdge | S2      | S3     | 13       | 15    | 0.133     | grounding_gap (13)            |
| FastAPI  | S1      | S2     | 12       | 25    | 0.520     | missing_artifact (3), grounding_gap (9) |

Notable: FastAPI has higher readiness (0.52) than BlueEdge (0.133) despite lower maturity. This is because:
1. FastAPI has a larger total debt inventory (25 vs 15), with many items being non-blocking
2. BlueEdge's debt is heavily concentrated in blocking grounding gaps
3. S2-to-S3 progression has stricter grounding requirements than S1-to-S2

---

## 6. Blocking Debt Categories

| Category         | Definition                                                              |
|------------------|-------------------------------------------------------------------------|
| grounding_gap    | A domain lacks a semantic grounding anchor; blocks semantic qualification |
| missing_artifact | A required structural artifact has not been produced; blocks structural qualification |

---

## 7. Governance Compliance

- Readiness is computed deterministically from the semantic debt inventory
- No interpretation, ranking, or prioritization is performed
- Blocking classification comes from the debt inventory, not from the readiness engine
- No client-name branching in computation logic
- Output is replay-safe and hash-verified
