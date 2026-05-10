# Dimension Breakdown Report

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Overview

This report provides a detailed breakdown of all 8 maturity dimensions (D1-D8) for both certified clients: BlueEdge (S2) and FastAPI (S1). Each dimension is presented with its computed score, classification band, and commentary on its significance within the client's maturity profile.

---

## 2. BlueEdge (S2) — Dimension Breakdown

| Dimension | Name                    | Score | Band     |
|-----------|-------------------------|-------|----------|
| D1        | STRUCTURAL_CONTINUITY   | 0.532 | STABLE   |
| D2        | SEMANTIC_GROUNDING      | 0.235 | LOW      |
| D3        | LINEAGE_STRENGTH        | 0.235 | LOW      |
| D4        | REPRODUCIBILITY         | 1.000 | STRONG   |
| D5        | GOVERNANCE_COMPLETENESS | 1.000 | STRONG   |
| D6        | PROJECTION_READINESS    | 0.750 | STRONG   |
| D7        | SEMANTIC_COHERENCE      | 0.246 | PARTIAL  |
| D8        | ENRICHMENT_READINESS    | 1.000 | STRONG   |

### D1 — STRUCTURAL_CONTINUITY (0.532 STABLE)

BlueEdge has moderate structural continuity. Coverage ratio and label fidelity are both above 0.5, indicating that the majority of domains have structural coverage and labels align with canonical definitions. This is the foundation that supports the S2 classification. The score is not yet STRONG because some domains have incomplete coverage or drifted labels.

### D2 — SEMANTIC_GROUNDING (0.235 LOW)

Semantic grounding is low. Only a small proportion of BlueEdge's domains have resolved semantic grounding anchors. This is the primary bottleneck for S3 progression. Despite strong governance and reproducibility, the evidence base lacks deep semantic connection to domain truth. The 13 blocking grounding_gap debts directly correspond to this dimension's weakness.

### D3 — LINEAGE_STRENGTH (0.235 LOW)

Lineage strength is low. The evidence chains from source through derivation are shallow. While the structural layer exists (D1 is STABLE), the lineage connecting structural elements to their derivation origins is weak. This means the evidence base is structurally present but not deeply traceable.

### D4 — REPRODUCIBILITY (1.000 STRONG)

BlueEdge has full reproducibility. The evidence chain can be fully reconstructed from source inputs. This is a critical strength: it means that the S2 classification is not dependent on cached or transient state. The qualification can be independently verified at any time.

### D5 — GOVERNANCE_COMPLETENESS (1.000 STRONG)

All four governance components are present: remediation map, Q-class classification, integrity enforcement, and replay pass. BlueEdge has complete governance infrastructure. This is the strongest pillar of BlueEdge's maturity profile and the primary contributor to qualification stability.

### D6 — PROJECTION_READINESS (0.750 STRONG)

As an S2 client, BlueEdge receives a projection readiness score of 0.75. This indicates that the client's evidence is ready for most downstream projection use cases. Full projection readiness (1.0) requires S3 qualification.

### D7 — SEMANTIC_COHERENCE (0.246 PARTIAL)

Semantic coherence is at the PARTIAL threshold. This composite of coverage, lineage, and inverse debt pressure is dragged down by weak lineage (D3) and high debt pressure from the 13 blocking grounding gaps. Coherence will improve as grounding gaps are resolved, reducing debt pressure and strengthening lineage.

### D8 — ENRICHMENT_READINESS (1.000 STRONG)

All enrichment prerequisites are met: replay passes, manifest is registered, and remediation actions are resolvable. BlueEdge is fully ready for semantic enrichment operations. This is a forward-looking strength that will accelerate S3 progression once grounding gaps are addressed.

---

## 3. FastAPI (S1) — Dimension Breakdown

| Dimension | Name                    | Score | Band     |
|-----------|-------------------------|-------|----------|
| D1        | STRUCTURAL_CONTINUITY   | 0.000 | LOW      |
| D2        | SEMANTIC_GROUNDING      | 0.000 | LOW      |
| D3        | LINEAGE_STRENGTH        | 0.000 | LOW      |
| D4        | REPRODUCIBILITY         | 0.000 | LOW      |
| D5        | GOVERNANCE_COMPLETENESS | 0.250 | PARTIAL  |
| D6        | PROJECTION_READINESS    | 0.250 | PARTIAL  |
| D7        | SEMANTIC_COHERENCE      | 0.160 | LOW      |
| D8        | ENRICHMENT_READINESS    | 1.000 | STRONG   |

### D1 — STRUCTURAL_CONTINUITY (0.000 LOW)

FastAPI has no structural continuity. Coverage ratio and label fidelity are both 0.0, meaning no domains have structural coverage and no labels have been verified against canonical definitions. This is the fundamental gap: without structural continuity, no higher-level maturity dimensions can score meaningfully.

### D2 — SEMANTIC_GROUNDING (0.000 LOW)

No semantic grounding exists. Zero domains have resolved semantic grounding anchors. This is expected for an S1 client that has not yet established structural foundations. Grounding requires structural coverage as a prerequisite.

### D3 — LINEAGE_STRENGTH (0.000 LOW)

No evidence lineage exists. Without structural coverage (D1 = 0.0), there is nothing to trace lineage through. Lineage strength requires at least partial structural coverage to measure.

### D4 — REPRODUCIBILITY (0.000 LOW)

FastAPI's evidence chain is not reproducible. No reproducibility proof has been established. This is the most critical gap for S2 progression after structural artifacts: without reproducibility, the qualification cannot be independently verified.

### D5 — GOVERNANCE_COMPLETENESS (0.250 PARTIAL)

Only 1 of 4 governance components is present. FastAPI has partial governance infrastructure, which is the minimum expected at S1. The missing components (remediation map, integrity enforcement, replay pass) must be established alongside structural coverage for S2 progression.

### D6 — PROJECTION_READINESS (0.250 PARTIAL)

As an S1 client, FastAPI receives a projection readiness score of 0.25. This indicates minimal downstream projection capability. S2 qualification would raise this to 0.75.

### D7 — SEMANTIC_COHERENCE (0.160 LOW)

Semantic coherence is low. With zero coverage, zero lineage, and significant debt pressure (12 blocking items out of 25), the coherence score reflects the fragmented state of the evidence base. The non-zero value (0.160) comes from the inverse debt pressure component: 13 of 25 debts are non-blocking, providing a small positive contribution.

### D8 — ENRICHMENT_READINESS (1.000 STRONG)

Despite low maturity across all other dimensions, FastAPI scores STRONG on enrichment readiness. All three prerequisites are met: replay infrastructure is available (even though the client has not yet produced replay-verifiable artifacts), manifest registration is in place, and remediation actions are resolvable. This indicates that the infrastructure for enrichment exists even though the client's evidence base is not yet mature enough to benefit from it.

---

## 4. Comparative Dimension Analysis

| Dimension | Name                    | BlueEdge | FastAPI | Gap   |
|-----------|-------------------------|----------|---------|-------|
| D1        | STRUCTURAL_CONTINUITY   | 0.532    | 0.000   | 0.532 |
| D2        | SEMANTIC_GROUNDING      | 0.235    | 0.000   | 0.235 |
| D3        | LINEAGE_STRENGTH        | 0.235    | 0.000   | 0.235 |
| D4        | REPRODUCIBILITY         | 1.000    | 0.000   | 1.000 |
| D5        | GOVERNANCE_COMPLETENESS | 1.000    | 0.250   | 0.750 |
| D6        | PROJECTION_READINESS    | 0.750    | 0.250   | 0.500 |
| D7        | SEMANTIC_COHERENCE      | 0.246    | 0.160   | 0.086 |
| D8        | ENRICHMENT_READINESS    | 1.000    | 1.000   | 0.000 |

### Key Observations

1. **Largest gap: D4 REPRODUCIBILITY (1.0).** BlueEdge has full reproducibility; FastAPI has none. This is the single largest dimension gap between the two clients.

2. **Second largest gap: D5 GOVERNANCE_COMPLETENESS (0.75).** BlueEdge has complete governance; FastAPI has only partial. This gap will narrow as FastAPI establishes remediation, integrity, and replay infrastructure.

3. **Zero gap: D8 ENRICHMENT_READINESS (0.0).** Both clients score identically on enrichment readiness. The infrastructure is available regardless of maturity level.

4. **Smallest non-zero gap: D7 SEMANTIC_COHERENCE (0.086).** Both clients have low semantic coherence. BlueEdge's slight advantage comes from non-zero coverage and lineage, but both are dragged down by debt pressure.

5. **D1-D3 cluster:** BlueEdge has partial structural, grounding, and lineage scores while FastAPI has zero across all three. These are the foundational dimensions that must be established before higher-level maturity can emerge.

---

## 5. Governance Compliance

- All dimension scores are computed deterministically from governed inputs
- No interpretation beyond the stated formulas is performed
- Commentary describes observable relationships between dimensions and scores
- No ranking or prioritization is implied
- All scores are replay-verified
