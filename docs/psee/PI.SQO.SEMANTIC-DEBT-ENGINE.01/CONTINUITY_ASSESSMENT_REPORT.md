# Continuity Assessment Report

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. BlueEdge continuity assessment

| Metric | Value |
|--------|-------|
| Overall status | PARTIAL |
| Crosswalk present | YES |
| Entity count | 13 |
| Topology node count | 35 |
| Domain count | 17 |
| Coverage ratio | 0.371 (13/35) |
| Label fidelity ratio | 0.692 (9/13 with business labels) |
| Lineage strength | 0.235 (4/17 grounded) |
| Entities with business label | 9 |
| Entities without business label | 4 |
| Domains grounded (EXACT/STRONG) | 4 |
| Domains ungrounded | 13 |

### Gaps identified

| Gap type | Description | Severity | Remediation |
|----------|-------------|----------|-------------|
| entity_coverage | 22 topology nodes without crosswalk mapping | MEDIUM | R1 |
| label_fidelity | 4 entities without business labels (69% fidelity) | MEDIUM | R1 |
| lineage | 13 domains without structural grounding (24% lineage) | HIGH | R4 |

---

## 2. FastAPI continuity assessment

| Metric | Value |
|--------|-------|
| Overall status | NO_ASSESSMENT |
| Crosswalk present | NO |
| Entity count | 0 |
| Topology node count | 123 |
| Domain count | 9 |
| Coverage ratio | 0 |
| Label fidelity ratio | 0 |
| Lineage strength | 0 |
| Domains grounded | 0 |
| Domains ungrounded | 0 |

### Gaps identified

| Gap type | Description | Severity | Remediation |
|----------|-------------|----------|-------------|
| crosswalk_absent | Crosswalk absent — no continuity assessment possible | CRITICAL | R2 |

FastAPI cannot be assessed for continuity because the semantic_continuity_crosswalk artifact is absent. This is a CRITICAL gap that must be resolved via R2 (Semantic Pipeline Re-Run) before any continuity metrics can be computed.

---

## 3. Comparison

| Dimension | BlueEdge | FastAPI |
|-----------|----------|--------|
| Crosswalk | Present (13 entities) | Absent |
| Entity coverage | 37.1% | N/A |
| Label fidelity | 69.2% | N/A |
| Lineage strength | 23.5% | 0% |
| Assessment | PARTIAL | NO_ASSESSMENT |
| Primary remediation | R1/R4 (enrichment + grounding) | R2 (pipeline re-run) |
