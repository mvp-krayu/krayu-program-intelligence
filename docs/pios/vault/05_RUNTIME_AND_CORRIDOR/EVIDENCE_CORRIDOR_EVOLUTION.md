# Evidence Corridor Evolution

> **How evidence enters the system — from ungoverned intake to source-class enforcement.**

---

## What an Evidence Corridor Is

An evidence corridor is a **governed pathway** for bringing external evidence into the system. It enforces:
- Source class validation (only admissible source types)
- Hash verification (integrity checking)
- Format validation (parseable evidence)
- Provenance tracking (where evidence came from)

## Evolution

### Era 1: Direct Intake (40.x, early)

Evidence was loaded directly from file paths. No source class governance. No hash verification. No provenance tracking.

### Era 2: Evidence Registry (42.x)

BlueEdgeEvidenceIngestionLoader introduced:
- Evidence registry production
- Hash verification
- Read-only evidence manifest
- Source classification

### Era 3: Evidence Rebase (2026-05-12)

ExplicitEvidenceRebaseExtractor introduced:
- Source class enforcement (`EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE` only)
- Previous chain status marking (`PRE_REBASE_NON_AUTHORITATIVE`)
- New chain status (`UPSTREAM_EVIDENCE_BOUND`)
- Disallowed pattern detection (rejects Tier-1/Tier-2/LENS/gauge outputs)
- Deterministic extraction (regex pattern matching, keyword domain resolution)

## Current Evidence Flow

```
3 HTML files (operator-provided)
    ↓
evidence_sources.yaml (source configuration)
    ↓
ExplicitEvidenceRebaseExtractor
    ├── Source class validation
    ├── Hash verification
    ├── extractFromArchitecture()
    ├── extractFromPMO()
    └── extractFromCompetitive()
    ↓
Candidate signals (NON_AUTHORITATIVE_SEMANTIC_CANDIDATE)
    ↓
evaluateAdmissibility()
    ↓
ADMISSIBLE / QUARANTINED / REJECTED
```

## Source Class Rules

| Source Class | Status |
|---|---|
| EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE | ADMISSIBLE |
| TIER_1_SIGNAL_OUTPUT | REJECTED |
| TIER_2_DIAGNOSTIC_OUTPUT | REJECTED |
| LENS_RENDERING_OUTPUT | REJECTED |
| GAUGE_DERIVED_OUTPUT | REJECTED |

**Why:** The system must not treat its own outputs as evidence. Circular grounding destroys trustworthiness.

## Git Lineage

| Commit | Date | Event |
|---|---|---|
| d1bad99 | 2026-05-12 | BlueEdge evidence ingestion corridor |
| 2c8a807 | 2026-05-12 | BlueEdge semantic candidate extraction corridor |
| 3ac773c | 2026-05-12 | Explicit evidence rebase corridor |
| 3964c22 | 2026-05-12 | Dynamic CEU admissibility evaluation corridor |
| dc5f9b2 | 2026-05-12 | Child routes rebound to rebase chain |

## Cross-References

- [[CURRENT_RUNTIME_BOUNDARIES]] — where corridors fit in runtime
- [[RUNTIME_CORRIDOR_EVOLUTION]] — runtime corridor (different from evidence corridor)
- [[../04_SQO_AND_QUALIFICATION/ADMISSIBILITY_AND_CORRIDORS]] — admissibility detail
