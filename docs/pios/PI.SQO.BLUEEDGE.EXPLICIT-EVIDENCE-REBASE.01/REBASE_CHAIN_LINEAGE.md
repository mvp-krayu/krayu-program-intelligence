# Rebase Chain Lineage

**Stream:** PI.SQO.BLUEEDGE.EXPLICIT-EVIDENCE-REBASE.01
**Type:** Lineage Record

---

## 1. Purpose

This document records the lineage of the evidence rebase chain, documenting the relationship between the previous non-authoritative chain and the rebased upstream-bound chain.

## 2. Previous Chain (PRE_REBASE_NON_AUTHORITATIVE)

The previous extraction and admissibility chain was produced by:

| Stream | Status | Output |
|--------|--------|--------|
| PI.SQO.BLUEEDGE.EVIDENCE-INGESTION-CORRIDOR.01 | COMPLETE | Evidence ingestion from Tier-1/Tier-2 files |
| PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01 | COMPLETE | 45 semantic candidates |
| PI.SQO.BLUEEDGE.DYNAMIC-CEU.ADMISSIBILITY-EVALUATION.01 | COMPLETE | 22 admissible, 9 quarantined, 14 rejected |

These outputs remain in the repository for lineage traceability but are marked PRE_REBASE_NON_AUTHORITATIVE. They are superseded by the rebased chain.

## 3. Rebased Chain (UPSTREAM_EVIDENCE_BOUND)

The rebased chain is produced by:

| Step | Description |
|------|------------|
| Evidence source pointer | evidence_sources.yaml defines canonical evidence set |
| Evidence ingestion | 3 HTML files ingested with SHA-256 hash verification |
| Candidate extraction | Deterministic extraction from DOM structures |
| Inline admissibility | Structural compatibility + confidence classification |
| Manifest output | evidence_manifest.json written to artifacts directory |

## 4. Key Differences

| Aspect | Previous Chain | Rebased Chain |
|--------|---------------|---------------|
| Evidence source | Tier-1/Tier-2 files (discovery-based) | 3 operator-provided HTML files |
| Source class | Mixed/uncontrolled | EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE |
| Hash verification | Post-hoc | At ingestion |
| Source pointer | None | evidence_sources.yaml |
| Candidate types | DOMAIN_GROUNDING_STATUS, FOCUS_DOMAIN_DESIGNATION, GAUGE types, etc. | ARCHITECTURE_SECTION, ARCHITECTURE_LAYER, PMO_SECTION, etc. |
| Domain mapping | Same DOMAIN_KEYWORD_MAP | Same DOMAIN_KEYWORD_MAP (different match rate due to different terminology) |

## 5. Non-Mutation Guarantees

The rebase does NOT modify:
- Previous chain outputs (they remain in place)
- Domain grounding states
- S-state, Q-class, or qualification gates
- LENS projections
- Authority assertions

The rebase ONLY:
- Adds new evidence files
- Adds evidence_sources.yaml pointer
- Adds rebased extraction/admissibility outputs
- Adds evidence_manifest.json
- Adds cockpit corridor for visibility
