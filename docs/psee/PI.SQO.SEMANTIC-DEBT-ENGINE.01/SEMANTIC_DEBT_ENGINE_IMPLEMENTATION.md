# Semantic Debt Engine Implementation

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Overview

The Semantic Debt Engine operationalizes Phase 3 of the SQO Roadmap: semantic debt inventory, continuity gap assessment, debt prioritization, remediation linkage, and certification. It extends SQO from qualification state detection to qualification diagnosis.

## 2. Architecture

### Module structure

| Module | Purpose |
|--------|---------|
| `SemanticDebtEngine.js` | Core 7-category debt detection, inventory building, artifact emission |
| `DebtPriorityEngine.js` | Deterministic priority scoring: `severity_weight × impact_multiplier × dependency_modifier` |
| `ContinuityAssessmentEngine.js` | Coverage metrics (entity, label fidelity, lineage strength), gap identification |
| `RemediationPathResolver.js` | R1–R4 pathway mapping, expected impact computation |
| `DebtReplayVerifier.js` | 3-check replay verification for debt artifacts |

### Dependency graph

```
DebtPriorityEngine (standalone)
RemediationPathResolver (standalone)
ContinuityAssessmentEngine → SemanticArtifactLoader, manifests, QualificationStateArtifact
SemanticDebtEngine → all above + QualificationStateEngine
DebtReplayVerifier → SemanticDebtEngine, QualificationStateArtifact
```

No circular dependencies. No client-name branching.

## 3. Detection algorithm

### 7 debt categories

| # | Category | Severity | Blocks S-state | Detection method |
|---|----------|----------|----------------|------------------|
| 1 | Missing Artifact | CRITICAL | S2 | REQUIRED_ARTIFACT_KEYS not present on disk |
| 2 | Grounding Gap | HIGH | S3 | Domain lineage_status ≠ EXACT and ≠ STRONG |
| 3 | Continuity Gap | MEDIUM | none | Crosswalk entities < topology nodes; entities without business labels |
| 4 | Label | MEDIUM | none | Domain name matches structural ID pattern AND (semantic_level = STRUCTURAL_LABELS_ONLY OR inference_prohibition = true) |
| 5 | Validation | HIGH | none | decision_validation absent or checks failing |
| 6 | Reproducibility | MEDIUM-HIGH | none | reproducibility_verdict absent or ≠ FULL_REPRODUCIBILITY |
| 7 | Rendering Metadata | MEDIUM | none | rendering_metadata absent or missing integrity hash |

### Missing artifact detection

Uses independent artifact loading (not the sequential loader) to accurately identify which required artifacts are truly absent from disk. This avoids false positives from the sequential loader's early-exit behavior.

### Grounding gap detection

Iterates all domains in the semantic_topology_model. Any domain with lineage_status other than EXACT or STRONG produces one grounding gap debt item. The structural ID pattern `(CLU|DOM|DOMAIN)-\d+` is used to classify names.

### Continuity gap detection

When crosswalk is absent: produces one debt item with `has_upstream_dependency: true`. When crosswalk is present: produces items for entity coverage gaps (entities < topology nodes) and label fidelity gaps (entities without business labels).

## 4. Priority model

```
priority_score = severity_weight × impact_multiplier × dependency_modifier

severity_weight:   CRITICAL=4, HIGH=3, MEDIUM-HIGH=2, MEDIUM=1
impact_multiplier: blocks S-state=2.0, maturity only=1.0
dependency_modifier: no upstream=1.0, has upstream=0.5
```

Sorting: descending by priority_score. Rank assigned 1..N.

## 5. Remediation pathways

| Pathway | Name | Resolves |
|---------|------|----------|
| R1 | Source Material Enrichment | Label, Grounding Gap, Continuity Gap |
| R2 | Semantic Pipeline Re-Run | Missing Artifact, Validation, Reproducibility |
| R3 | Rendering Metadata Emission | Rendering Metadata |
| R4 | Structural Grounding Extension | Grounding Gap (S2→S3) |

## 6. Governance

- No client-name branching in any SQO debt module
- All detection is manifest-driven and deterministic
- Writes exclusively to `artifacts/sqo/<client>/<run_id>/`
- No Lane A, Lane D, PATH B, Q-class, or runtime mutations
- Fail-closed on unregistered client/run
