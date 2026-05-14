# SQO Cockpit Formatter Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Module

`app/execlens-demo/lib/sqo-cockpit/SQOCockpitFormatter.js`

## Purpose

Transforms raw SQO artifact data into display-ready structures for cockpit sections. Deterministic — same input always produces same output. No AI interpretation, no probabilistic language.

## Formatters

| Formatter | Section | Key Output |
|-----------|---------|------------|
| formatOverview | Overview | S-state, maturity, gravity, stability, progression, debt summary |
| formatDebtSection | Debt | Sorted items, grouped by category and severity, remediation pathways |
| formatContinuitySection | Continuity | Coverage/fidelity/lineage ratios, continuity gaps |
| formatMaturitySection | Maturity | 8 dimensions, gravity composite, stability composite |
| formatProgressionSection | Progression | Current/target S-state, readiness score, blocking debts by pathway |
| formatEvidenceReplaySection | Evidence | 3 replay verifications, 3 certifications, per-check results |
| formatHandoffSection | Handoff | Ready/blocked status, blocking conditions, package summary |
| formatHistorySection | History | S-state transitions, enrichment events |

## Classification Labels

- S-State: S0 Structural Only, S1 Structural Labels Only, S2 Partial Grounding with Continuity, S3 Full Semantic Grounding
- Maturity: LOW/PARTIAL/STABLE/STRONG
- Gravity: FRAGMENTED/EMERGING/STABILIZING/GRAVITATIONAL
- Stability: UNSTABLE/CONDITIONAL/STABLE/RESILIENT

## Governance

- No AI-generated text
- No probabilistic language
- All display values traceable to artifact field paths
- Null returned for missing artifact data (fail-visible)
