# Semantic Debt Evolution

> **How the system tracks and classifies gaps in semantic qualification.**

---

## What Semantic Debt Is

Semantic debt represents known gaps, deficiencies, or incomplete qualifications in a client's semantic data. It is analogous to technical debt — things that work but are not yet fully qualified.

## Debt Classification

The semantic debt engine uses 7 categories:

| Category | What It Detects |
|---|---|
| Coverage | Domains without semantic reconstruction |
| Grounding | Semantic claims without structural backing |
| Continuity | Gaps in semantic continuity chain |
| Freshness | Evidence that may be stale |
| Completeness | Incomplete extraction from available evidence |
| Reconciliation | Domains with crosswalk gaps |
| Authority | Semantic claims without authority chain |

## How Debt Relates to S-States

| S-State | Debt Relationship |
|---|---|
| S0 | No debt tracking (no qualification data) |
| S1 | Debt assessment blocked (onboarding incomplete) |
| S2 | QUALIFIED_WITH_DEBT — debt tracked and managed |
| S3 | Debt remediated (theoretical — not yet implemented) |

**BlueEdge:** S2 with 15 tracked debt items.

## Maturity Scoring

The maturity scoring engine uses 8 dimensions:

| Dimension | What It Measures |
|---|---|
| Evidence coverage | How much evidence has been ingested |
| Extraction completeness | How many candidates extracted vs potential |
| Domain mapping | How many domains have crosswalk entries |
| Grounding ratio | What fraction of claims are structurally backed |
| Continuity depth | How deep the semantic continuity chain extends |
| Qualification state | Current S-state |
| Debt load | Number and severity of debt items |
| Progression readiness | How close to next S-state transition |

## Git Lineage

| Commit | Date | Event |
|---|---|---|
| de4ccf5 | 2026-05-10 | Semantic debt engine — 7-category detection |
| ae3d657 | 2026-05-10 | Maturity scoring engine — 8-dimension quantification |
| 22c8b1c | 2026-05-10 | FastAPI maturation workflow |
| 5c18622 | 2026-05-10 | Severity semantics normalization |

## Cross-References

- [[SQO_EVOLUTION]] — SQO context
- [[HYDRATED_AND_QSTATE_EVOLUTION]] — how debt relates to trustworthiness
- [[OVERLAY_AND_REPLAY_EVOLUTION]] — overlay governance for debt remediation
