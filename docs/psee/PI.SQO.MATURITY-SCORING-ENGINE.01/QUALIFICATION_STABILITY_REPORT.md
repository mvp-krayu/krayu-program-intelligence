# Qualification Stability Report

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Definition

Qualification stability measures how resistant a client's current qualification state is to regression. A stable qualification can withstand changes to upstream evidence, debt resolution, or governance events without dropping to a lower S-state. An unstable qualification may regress under even minor perturbations.

Stability is a derived composite metric, not a primary dimension.

---

## 2. Formula

```
stability = avg(D1, D3, D4, D5)
```

Where:
- **D1** — STRUCTURAL_CONTINUITY
- **D3** — LINEAGE_STRENGTH
- **D4** — REPRODUCIBILITY
- **D5** — GOVERNANCE_COMPLETENESS

---

## 3. Included Dimension Rationale

| Dimension | Role in Stability                                                           |
|-----------|-----------------------------------------------------------------------------|
| D1        | Structural continuity anchors the qualification against coverage drift      |
| D3        | Lineage strength prevents orphaned derivations from destabilizing the chain |
| D4        | Reproducibility ensures the qualification can be recomputed from source     |
| D5        | Governance completeness provides institutional safeguards against regression |

---

## 4. Excluded Dimensions

| Dimension | Reason for Exclusion                                                   |
|-----------|------------------------------------------------------------------------|
| D2        | SEMANTIC_GROUNDING — contributes to gravity, not to regression defense |
| D6        | PROJECTION_READINESS — reflects downstream capability, not stability   |
| D7        | SEMANTIC_COHERENCE — captures coherence breadth, not regression anchor |
| D8        | ENRICHMENT_READINESS — reflects future enablement, not current defense |

---

## 5. Classification Thresholds

| Band         | Range       | Interpretation                                                 |
|--------------|-------------|----------------------------------------------------------------|
| UNSTABLE     | 0.00 - 0.24 | Qualification at risk of regression under any change            |
| CONDITIONAL  | 0.25 - 0.49 | Qualification holds under controlled conditions only            |
| STABLE       | 0.50 - 0.74 | Qualification resists regression under normal operating changes |
| RESILIENT    | 0.75 - 1.00 | Qualification resistant to regression under stress conditions   |

---

## 6. Client Results

### 6.1 BlueEdge (S2)

| Dimension | Score | Band   |
|-----------|-------|--------|
| D1        | 0.532 | STABLE |
| D3        | 0.235 | LOW    |
| D4        | 1.000 | STRONG |
| D5        | 1.000 | STRONG |

**Stability Score:** 0.692
**Stability Band:** STABLE

**Assessment:** BlueEdge's qualification is stable. Full reproducibility (D4 = 1.0) and full governance completeness (D5 = 1.0) provide strong anchors. Structural continuity (D1 = 0.532) is moderate but sufficient. The primary vulnerability is lineage strength (D3 = 0.235), which means that while the qualification holds, the evidence chain backing it has shallow roots. Stability is maintained by governance and reproducibility rather than by deep lineage.

### 6.2 FastAPI (S1)

| Dimension | Score | Band   |
|-----------|-------|--------|
| D1        | 0.000 | LOW    |
| D3        | 0.000 | LOW    |
| D4        | 0.000 | LOW    |
| D5        | 0.250 | PARTIAL |

**Stability Score:** 0.063
**Stability Band:** UNSTABLE

**Assessment:** FastAPI's qualification is unstable. No structural continuity, no lineage, and no reproducibility mean that the current S1 state has no regression defense. The only contributing factor is partial governance (D5 = 0.25). The S1 classification is valid but fragile. Any upstream perturbation could invalidate the qualification.

---

## 7. Comparative Summary

| Client   | S-State | Stability Score | Stability Band | Primary Anchor            |
|----------|---------|-----------------|----------------|---------------------------|
| BlueEdge | S2      | 0.692           | STABLE         | Reproducibility + Gov     |
| FastAPI  | S1      | 0.063           | UNSTABLE       | Partial governance only   |

The stability gap (0.629) is the largest gap of any derived metric between the two clients, reflecting the fundamental difference between a client with full reproducibility and governance versus one with neither.

---

## 8. Governance Compliance

- Stability is computed deterministically from dimension scores
- No interpretation or inference is performed
- No client-name branching in computation logic
- Output is replay-safe and hash-verified
