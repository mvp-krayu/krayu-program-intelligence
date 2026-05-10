# Maturity Scoring Engine — Implementation Documentation

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Overview

The Maturity Scoring Engine is a 5-module semantic qualification subsystem that computes 8-dimension maturity scores (D1-D8) for any client that has completed at least S1 state detection. It produces deterministic, replay-safe maturity profiles with full artifact emission.

This engine operates within the Semantic Qualification Orchestrator (SQO) layer and consumes only governed upstream artifacts. It performs no mutation of Lane A, Lane D, PATH B, Q-class resolvers, or runtime pages.

---

## 2. Module Inventory

### 2.1 MaturityScoringEngine.js

**Role:** Core scoring module. Computes all 8 dimensions (D1-D8), derives overall maturity classification, and emits governed artifacts.

**Responsibilities:**
- Accepts a client's state detection output and semantic debt inventory as input
- Computes each dimension score independently using deterministic formulas
- Derives overall maturity as the average of all 8 dimension scores
- Classifies overall maturity: LOW / PARTIAL / STABLE / STRONG
- Emits `semantic_maturity_profile.v1.json` per client
- Emits `maturity_dimension_breakdown.v1.json` per client
- Emits `maturity_certification.v1.json` per client

**Inputs:**
- State detection result (S-state, continuity assessment, coverage data)
- Semantic debt inventory (debt items, blocking counts, categories)
- Governance metadata (replay status, manifest registration, integrity flags)

**Outputs:**
- 3 governed JSON artifacts per client

**Determinism:** Same inputs always produce the same dimension scores and classification.

### 2.2 SemanticGravityEngine.js

**Role:** Computes semantic gravity — a derived metric indicating how strongly a client's semantic structure holds together.

**Responsibilities:**
- Computes gravity score as the average of D1, D2, D3, D5, and D7
- Classifies gravity band: FRAGMENTED / EMERGING / STABILIZING / GRAVITATIONAL
- Emits `semantic_gravity_assessment.v1.json` per client

**Formula:**
```
gravity = avg(D1, D2, D3, D5, D7)
```

**Thresholds:**

| Band           | Range       |
|----------------|-------------|
| FRAGMENTED     | 0.00 - 0.24 |
| EMERGING       | 0.25 - 0.49 |
| STABILIZING    | 0.50 - 0.74 |
| GRAVITATIONAL  | 0.75 - 1.00 |

**Rationale:** Gravity captures the structural, semantic, and governance dimensions that indicate whether a client's qualification has self-reinforcing coherence. D4 (reproducibility), D6 (projection readiness), and D8 (enrichment readiness) are excluded because they represent enablement rather than inherent structural weight.

### 2.3 QualificationStabilityEngine.js

**Role:** Computes qualification stability — a derived metric indicating how resistant a client's current qualification state is to regression.

**Responsibilities:**
- Computes stability score as the average of D1, D3, D4, and D5
- Classifies stability band: UNSTABLE / CONDITIONAL / STABLE / RESILIENT
- Emits `qualification_stability.v1.json` per client

**Formula:**
```
stability = avg(D1, D3, D4, D5)
```

**Thresholds:**

| Band         | Range       |
|--------------|-------------|
| UNSTABLE     | 0.00 - 0.24 |
| CONDITIONAL  | 0.25 - 0.49 |
| STABLE       | 0.50 - 0.74 |
| RESILIENT    | 0.75 - 1.00 |

**Rationale:** Stability captures structural continuity, lineage strength, reproducibility, and governance completeness. These are the dimensions that, when strong, prevent regression during progression. Semantic and projection dimensions are excluded because they reflect readiness rather than stability.

### 2.4 ProgressionReadinessEngine.js

**Role:** Computes progression readiness — a metric indicating how close a client is to advancing to the next S-state.

**Responsibilities:**
- Computes readiness score as 1 minus the ratio of blocking debt items to total debt items
- Identifies the target next S-state
- Catalogs blocking debts by category
- Emits `progression_readiness.v1.json` per client

**Formula:**
```
readiness = 1 - (blocking_debt_count / total_debt_items)
```

**Target S-state mapping:**
- Current S0 -> target S1
- Current S1 -> target S2
- Current S2 -> target S3
- Current S3 -> target S4 (terminal)

**Determinism:** Blocking debt count is derived directly from the semantic debt inventory. No interpretation or ranking is performed.

### 2.5 MaturityReplayVerifier.js

**Role:** Performs 3-check replay verification to confirm that maturity scoring is deterministic and tamper-evident.

**Responsibilities:**
- Check 1: Input integrity — verifies SHA256 hash of all scoring inputs matches expected values
- Check 2: Deterministic recomputation — re-runs the full scoring pipeline and compares intermediate values
- Check 3: Output hash — verifies SHA256 hash of all emitted artifacts matches expected values
- Emits `maturity_replay_verification.v1.json` per client

**3-Check Protocol:**

| Check | Name                        | Description                                                  |
|-------|-----------------------------|--------------------------------------------------------------|
| 1     | Input Integrity             | SHA256 hash of scoring inputs matches recorded input hash    |
| 2     | Deterministic Recomputation | Re-execution produces identical intermediate dimension scores |
| 3     | Output Hash                 | SHA256 hash of emitted artifacts matches recorded output hash |

**Pass criteria:** All 3 checks must PASS for the client's maturity certification to be valid.

---

## 3. Module Dependency Graph

```
MaturityScoringEngine.js
  |
  +-- SemanticGravityEngine.js        (consumes D1, D2, D3, D5, D7)
  +-- QualificationStabilityEngine.js (consumes D1, D3, D4, D5)
  +-- ProgressionReadinessEngine.js   (consumes debt inventory)
  +-- MaturityReplayVerifier.js       (verifies all outputs)
```

MaturityScoringEngine is the root module. The other four modules consume its outputs or operate in parallel on shared inputs. MaturityReplayVerifier runs last, after all other modules have completed.

---

## 4. Artifact Emission

Each client produces 7 governed artifacts:

| # | Artifact                                  | Emitting Module                   |
|---|-------------------------------------------|-----------------------------------|
| 1 | semantic_maturity_profile.v1.json         | MaturityScoringEngine.js          |
| 2 | semantic_gravity_assessment.v1.json       | SemanticGravityEngine.js          |
| 3 | qualification_stability.v1.json           | QualificationStabilityEngine.js   |
| 4 | progression_readiness.v1.json             | ProgressionReadinessEngine.js     |
| 5 | maturity_replay_verification.v1.json      | MaturityReplayVerifier.js         |
| 6 | maturity_certification.v1.json            | MaturityScoringEngine.js          |
| 7 | maturity_dimension_breakdown.v1.json      | MaturityScoringEngine.js          |

All artifacts carry schema version 1.0 and include SHA256 output hash provenance.

---

## 5. Governance Compliance

- No Lane A mutation
- No Lane D mutation
- No PATH B mutation
- No Q-class resolver mutation
- No runtime page mutation
- No client-name branching in logic
- All outputs are deterministic
- All outputs are replay-safe
- All outputs are artifact-first (file-based truth)
