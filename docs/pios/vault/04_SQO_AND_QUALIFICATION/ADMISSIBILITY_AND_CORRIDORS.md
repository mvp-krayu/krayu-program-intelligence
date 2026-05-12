# Admissibility and Corridors

> **How evidence enters the system and gets evaluated for structural compatibility.**

---

## Admissibility Model

Admissibility evaluation determines whether semantic candidates may proceed toward overlay proposal. Each candidate receives one of:

| Status | Meaning |
|---|---|
| ADMISSIBLE | Candidate may proceed to overlay proposal |
| QUARANTINED | Candidate held for further review |
| REJECTED | Candidate excluded from overlay corridor |

## Evidence Source Class Governance

The system enforces **source class governance** — only evidence of recognized classes may be used:

**Admissible:** `EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE`
**Rejected:** Tier-1/Tier-2/LENS/gauge-derived outputs

This prevents the system from treating its own outputs as evidence (circular grounding).

## Extraction → Admissibility Pipeline

```
Operator HTML Evidence
    ↓
ExplicitEvidenceRebaseExtractor
    ├── extractFromArchitecture()
    ├── extractFromPMO()
    └── extractFromCompetitive()
    ↓
Semantic Candidates (NON_AUTHORITATIVE_SEMANTIC_CANDIDATE)
    ↓
evaluateAdmissibility()
    ↓
ADMISSIBLE / QUARANTINED / REJECTED
```

## Extractor Lineage

| Extractor | Status | When |
|---|---|---|
| BlueEdgeSemanticCandidateExtractor | SUPERSEDED (pre-rebase) | Pre-2026-05-12 |
| DynamicCEUAdmissibilityEvaluator | SUPERSEDED (pre-rebase) | Pre-2026-05-12 |
| ExplicitEvidenceRebaseExtractor | CURRENT (post-rebase) | 2026-05-12 onward |

The evidence rebase (PI.SQO.COCKPIT.BLUEEDGE-CHILD-ROUTE-REBASE-BINDING-FIX.01) consolidated extraction and admissibility into the rebase extractor with adapter functions:
- `loadRebasedCandidateData()` — reshapes extraction output for candidate view model
- `loadRebasedAdmissibilityData()` — reshapes for admissibility view model

## Git Lineage

| Commit | Date | Event |
|---|---|---|
| 3964c22 | 2026-05-12 | Dynamic CEU admissibility evaluation corridor |
| 3ac773c | 2026-05-12 | Explicit evidence rebase corridor |
| dc5f9b2 | 2026-05-12 | Child routes rebound to rebase chain |
| 2c8a807 | 2026-05-12 | BlueEdge semantic candidate extraction corridor |
| d1bad99 | 2026-05-12 | BlueEdge evidence ingestion corridor |

## Conflation Point

ExplicitEvidenceRebaseExtractor currently combines three layer responsibilities:
- L1 (Ingestion) — evidence file loading
- L2 (Reconstruction) — candidate extraction
- L7 (Admissibility) — structural compatibility evaluation

The strategic roadmap recommends eventual separation but accepts current coupling for single-client implementation.

## Cross-References

- [[SQO_EVOLUTION]] — qualification context
- [[../05_RUNTIME_AND_CORRIDOR/EVIDENCE_CORRIDOR_EVOLUTION]] — corridor governance
- [[OVERLAY_AND_REPLAY_EVOLUTION]] — what happens after admissibility
