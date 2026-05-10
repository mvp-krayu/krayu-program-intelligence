# Operational Attention Model

## Zone Hierarchy

| Zone | ID | Prominence | Content |
|------|----|-----------|---------|
| 1 | current_state | hero | Qualification state, S-state, posture |
| 2 | blockers | dominant | Critical blockers, blockage reason |
| 3 | operator_action | primary | Remediation workflow, source materials, rerun checklist |
| 4 | progression | standard | S1→S2 pathway, validation gates |
| 5 | deferred_debt | subordinate | S3 expansion, enrichment backlog |
| 6 | forensic_detail | collapsed | Full debt, evidence, continuity, maturity internals |

## Resolution Logic

- `resolveAttentionHierarchy(journey)` produces ordered zones with emphasis levels
- Primary focus: blockers if present, else workflow, else state
- Cognitive load: focused (≤2 active), moderate (≤4), high (>4)
- Zone emphasis: always, escalated, active, standard, subordinate, dimmed, collapsed

## Determinism

Same journey input always produces identical attention hierarchy.
No randomization. No AI inference.
