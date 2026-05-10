# Priority Model Report

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Priority formula

```
priority_score = severity_weight × impact_multiplier × dependency_modifier
```

### Severity weights

| Severity | Weight |
|----------|--------|
| CRITICAL | 4 |
| HIGH | 3 |
| MEDIUM-HIGH | 2 |
| MEDIUM | 1 |

### Impact multiplier

| Impact | Multiplier |
|--------|------------|
| Blocks S-state progression | 2.0 |
| Affects maturity only | 1.0 |

### Dependency modifier

| Dependency | Modifier |
|------------|----------|
| No upstream dependencies | 1.0 |
| Has upstream dependencies | 0.5 |

---

## 2. Priority score by category

| Category | Severity | Blocks | Upstream | Score |
|----------|----------|--------|----------|-------|
| Missing Artifact | CRITICAL (4) | S2 (2.0) | No (1.0) | **8.0** |
| Grounding Gap | HIGH (3) | S3 (2.0) | No (1.0) | **6.0** |
| Validation | HIGH (3) | none (1.0) | No (1.0) | **3.0** |
| Reproducibility | MEDIUM-HIGH (2) | none (1.0) | No (1.0) | **2.0** |
| Label | MEDIUM (1) | none (1.0) | No (1.0) | **1.0** |
| Continuity Gap | MEDIUM (1) | none (1.0) | Varies | **1.0 or 0.5** |
| Rendering Metadata | MEDIUM (1) | none (1.0) | Varies | **1.0 or 0.5** |

---

## 3. BlueEdge priority ordering

| Rank | ID | Category | Score |
|------|----|----------|-------|
| 1–13 | DEBT-GROUNDING_GAP-01..13 | grounding_gap | 6.0 |
| 14–15 | DEBT-CONTINUITY_GAP-01..02 | continuity_gap | 1.0 |

All 13 grounding gap items share the highest priority. The 2 continuity gap items are lower priority since they don't block S-state.

---

## 4. FastAPI priority ordering

| Rank | ID | Category | Score |
|------|----|----------|-------|
| 1–3 | DEBT-MISSING_ARTIFACT-01..03 | missing_artifact | 8.0 |
| 4–12 | DEBT-GROUNDING_GAP-01..09 | grounding_gap | 6.0 |
| 13 | DEBT-VALIDATION-01 | validation | 3.0 |
| 14 | DEBT-REPRODUCIBILITY-01 | reproducibility | 2.0 |
| 15–23 | DEBT-LABEL-01..09 | label | 1.0 |
| 24 | DEBT-CONTINUITY_GAP-01 | continuity_gap | 0.5 |
| 25 | DEBT-RENDERING_METADATA-01 | rendering_metadata | 0.5 |

The 3 missing artifacts are highest priority because they are CRITICAL and block S2. Rendering metadata and continuity gap (crosswalk absent) are lowest because they have upstream dependencies.

---

## 5. Governance

The priority model is fully deterministic. Same debt inventory produces the same priority ordering. No stochastic behavior. No manual overrides. No ad-hoc prioritization.
