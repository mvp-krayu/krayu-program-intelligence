# Semantic Gravity Model Report

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Definition

Semantic gravity measures how strongly a client's semantic structure holds together. It captures the self-reinforcing coherence of structural, semantic, and governance dimensions. Higher gravity indicates a qualification that resists fragmentation and attracts further grounding.

Gravity is a derived composite metric, not a primary dimension.

---

## 2. Formula

```
gravity = avg(D1, D2, D3, D5, D7)
```

Where:
- **D1** — STRUCTURAL_CONTINUITY
- **D2** — SEMANTIC_GROUNDING
- **D3** — LINEAGE_STRENGTH
- **D5** — GOVERNANCE_COMPLETENESS
- **D7** — SEMANTIC_COHERENCE

---

## 3. Excluded Dimensions

The following dimensions are excluded from the gravity formula:

| Dimension | Reason for Exclusion                                                      |
|-----------|---------------------------------------------------------------------------|
| D4        | REPRODUCIBILITY — measures enablement, not inherent structural weight     |
| D6        | PROJECTION_READINESS — reflects downstream capability, not semantic mass  |
| D8        | ENRICHMENT_READINESS — reflects infrastructure readiness, not coherence   |

---

## 4. Classification Thresholds

| Band           | Range       | Interpretation                                              |
|----------------|-------------|-------------------------------------------------------------|
| FRAGMENTED     | 0.00 - 0.24 | Semantic structure does not hold together; isolated elements |
| EMERGING       | 0.25 - 0.49 | Early coherence visible but not self-reinforcing             |
| STABILIZING    | 0.50 - 0.74 | Structural weight established; resists casual fragmentation  |
| GRAVITATIONAL  | 0.75 - 1.00 | Self-reinforcing semantic coherence; attracts further mass   |

---

## 5. Client Results

### 5.1 BlueEdge (S2)

| Dimension | Score | Band     |
|-----------|-------|----------|
| D1        | 0.532 | STABLE   |
| D2        | 0.235 | LOW      |
| D3        | 0.235 | LOW      |
| D5        | 1.000 | STRONG   |
| D7        | 0.246 | PARTIAL  |

**Gravity Score:** 0.450
**Gravity Band:** EMERGING

**Assessment:** BlueEdge has strong governance completeness (D5 = 1.0) and moderate structural continuity (D1 = 0.532), but semantic grounding (D2) and lineage strength (D3) remain low. The governance infrastructure holds the structure together, but the semantic mass is not yet self-reinforcing. Gravity is emerging but depends heavily on the governance pillar.

### 5.2 FastAPI (S1)

| Dimension | Score | Band     |
|-----------|-------|----------|
| D1        | 0.000 | LOW      |
| D2        | 0.000 | LOW      |
| D3        | 0.000 | LOW      |
| D5        | 0.250 | PARTIAL  |
| D7        | 0.160 | LOW      |

**Gravity Score:** 0.082
**Gravity Band:** FRAGMENTED

**Assessment:** FastAPI has no structural continuity, no semantic grounding, and no lineage strength. Only minimal governance infrastructure (D5 = 0.25) and weak semantic coherence (D7 = 0.16) exist. The semantic structure is completely fragmented. Progression to S2 requires establishing foundational structural coverage and grounding before gravity can emerge.

---

## 6. Comparative Summary

| Client   | S-State | Gravity Score | Gravity Band |
|----------|---------|---------------|--------------|
| BlueEdge | S2      | 0.450         | EMERGING     |
| FastAPI  | S1      | 0.082         | FRAGMENTED   |

The gap between BlueEdge and FastAPI gravity (0.368) is substantial and reflects the difference between a client at S2 with governance infrastructure versus a client at S1 with minimal structural foundation.

---

## 7. Governance Compliance

- Gravity is computed deterministically from dimension scores
- No interpretation or inference is performed
- No client-name branching in computation logic
- Output is replay-safe and hash-verified
