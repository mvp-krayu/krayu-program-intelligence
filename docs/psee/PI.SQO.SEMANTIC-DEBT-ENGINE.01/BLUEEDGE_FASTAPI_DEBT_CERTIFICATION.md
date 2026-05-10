# BlueEdge / FastAPI Debt Certification

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Certification cases

### CASE 1 — BlueEdge debt profile (S2, Q-02)

| Category | Expected | Actual | Pass |
|----------|----------|--------|------|
| Missing Artifact | 0 | 0 | YES |
| Grounding Gap | >0 | 13 | YES |
| Continuity Gap | >0 | 2 | YES |
| Label | 0 | 0 | YES |
| Validation | 0 | 0 | YES |
| Reproducibility | 0 | 0 | YES |
| Rendering Metadata | 0 | 0 | YES |
| Total debt items | 15 | 15 | YES |
| S-state | S2 | S2 | YES |
| Deterministic | YES | YES | YES |
| Replay verification | PASS | PASS | YES |

**Verdict:** PASS

BlueEdge debt profile: 13 grounding gap items (12 NONE + 1 PARTIAL lineage), 2 continuity gap items (22 unmapped nodes, 4 entities without business labels). No critical debt. S2→S3 requires resolving grounding gap debt.

---

### CASE 2 — FastAPI debt profile (S1, effectively Q-04)

| Category | Expected | Actual | Pass |
|----------|----------|--------|------|
| Missing Artifact | >0 | 3 | YES |
| Grounding Gap | >0 | 9 | YES |
| Continuity Gap | >0 (critical) | 1 (crosswalk absent) | YES |
| Label | >0 | 9 | YES |
| Validation | >0 | 1 | YES |
| Reproducibility | >0 | 1 | YES |
| Rendering Metadata | >0 | 1 | YES |
| Total debt items | 25 | 25 | YES |
| S-state | S1 | S1 | YES |
| Deterministic | YES | YES | YES |
| Replay verification | PASS | PASS | YES |

**Verdict:** PASS

FastAPI debt profile: 3 missing artifacts (decision_validation, reproducibility_verdict, semantic_continuity_crosswalk), 9 grounding gaps (all domains NONE), 9 label debts (all structural IDs with inference_prohibition), 1 continuity gap (crosswalk absent), 1 validation (DV absent), 1 reproducibility (RV absent), 1 rendering metadata (absent with upstream dependency). S1→S2 requires resolving missing artifact debt first.

---

### CASE 3 — Determinism

| Property | Expected | Actual | Pass |
|----------|----------|--------|------|
| BlueEdge two-run match | YES | YES | YES |
| FastAPI two-run match | YES | YES | YES |
| Identical debt item IDs | YES | YES | YES |
| Identical priority scores | YES | YES | YES |
| Identical summaries | YES | YES | YES |

**Verdict:** PASS

---

### CASE 4 — Governance boundary

| Property | Expected | Actual | Pass |
|----------|----------|--------|------|
| No Lane A mutation | YES | YES | YES |
| No Lane D mutation | YES | YES | YES |
| No PATH B mutation | YES | YES | YES |
| No Q-class resolver mutation | YES | YES | YES |
| No runtime page mutation | YES | YES | YES |
| No client-name branching | YES | YES | YES |
| Fail-closed on unknown client | YES | YES | YES |

**Verdict:** PASS

---

## 2. Overall certification

**SQO_SEMANTIC_DEBT_ENGINE_CERTIFIED**

All 4 certification cases pass. BlueEdge resolves to 15 debt items (0 critical, 13 high grounding gaps). FastAPI resolves to 25 debt items (3 critical missing artifacts). Priority ordering is deterministic. Replay verification passes for both clients. No governance boundary violations.
