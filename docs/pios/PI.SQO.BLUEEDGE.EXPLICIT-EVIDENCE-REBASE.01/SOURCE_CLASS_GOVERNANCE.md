# Source Class Governance

**Stream:** PI.SQO.BLUEEDGE.EXPLICIT-EVIDENCE-REBASE.01
**Type:** Reusable Doctrine — Source Class Rules

---

## 1. Purpose

This document defines the source class governance rules for evidence ingestion during rebase operations. Source classes determine which evidence files may enter the extraction pipeline.

## 2. Allowed Source Class

### EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE

Evidence files that are:
- Provided directly by the operator (not discovered or generated)
- Upstream of the extraction pipeline (not derived from downstream outputs)
- Explicitly listed in evidence_sources.yaml
- Hash-verifiable at ingestion time

## 3. Disallowed Source Classes

### DOWNSTREAM_PROJECTION
Evidence derived from downstream processing outputs (e.g., LENS projections, cockpit summaries). These create circular dependency chains.

### SELF_RECURSIVE_EVIDENCE
Evidence that references itself or its own outputs as authority. Creates non-terminating validation loops.

### UNCONTROLLED_DISCOVERY
Evidence discovered through automated scanning without explicit operator listing. Source provenance cannot be verified.

### MOCK_OR_SEEDED_FIXTURE
Synthetic data, test fixtures, or seeded evidence. Not suitable for production evaluation.

## 4. Source Class Validation

At ingestion time, the pipeline:

1. Reads evidence_sources.yaml for the allowed source class
2. Checks each file against the allowed file list
3. Applies DISALLOWED_PATTERNS regex to reject tier-1/tier-2/LENS/gauge files
4. Computes SHA-256 hash for each accepted file
5. Records ingestion status in the ingestion log

## 5. Governance Flags

| Flag | Value | Meaning |
|------|-------|---------|
| operator_provided | true | Every ingested file was explicitly provided by operator |
| source_bound | true | The manifest is bound to specific source files |
| all_operator_provided | true | 100% of evidence items passed operator-provided check |

## 6. Rejection Patterns

The following filename patterns are rejected regardless of source class:

- `lens_tier1` / `lens_tier2` — LENS tier outputs
- `tier1_evidence` / `tier2_evidence` — tier evidence files
- `tier1_diagnostic` / `tier2_diagnostic` — tier diagnostic files
- `gauge_artifact` / `gauge_claim` — GAUGE outputs
- `lens_output` — LENS output files
- `cockpit_summary` — cockpit summary outputs
