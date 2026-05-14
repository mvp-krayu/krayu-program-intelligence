# SQO Cockpit Artifact Loader Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Module

`app/execlens-demo/lib/sqo-cockpit/SQOCockpitArtifactLoader.js`

## Purpose

Loads all 15 SQO artifact types from the governed artifact path for a given client/run pair. Provides section-specific loading for partial page renders. Read-only — never mutates artifacts.

## Artifact Keys (15)

1. `qualification_state` — S-state detection result
2. `semantic_maturity_profile` — 8-dimension maturity scoring
3. `semantic_gravity_assessment` — Composite gravity metric
4. `qualification_stability` — Composite stability metric
5. `progression_readiness` — S-state progression assessment
6. `semantic_debt_inventory` — Full debt item inventory
7. `maturity_certification` — Maturity certification result
8. `maturity_dimension_breakdown` — Per-dimension formula inputs
9. `continuity_assessment` — Semantic continuity gaps and metrics
10. `qualification_history` — S-state transition history
11. `qualification_state_certification` — Qualification state certification
12. `qualification_state_replay_verification` — Qualification state replay
13. `debt_certification` — Debt inventory certification
14. `debt_replay_verification` — Debt inventory replay
15. `maturity_replay_verification` — Maturity scoring replay

## Critical Artifacts

`qualification_state` and `semantic_maturity_profile` are classified as critical. Missing critical artifacts trigger CRITICAL_DEGRADATION.

## Section-Artifact Mapping

| Section | Artifacts |
|---------|-----------|
| overview | qualification_state, semantic_maturity_profile, semantic_gravity_assessment, qualification_stability, progression_readiness, semantic_debt_inventory |
| debt | semantic_debt_inventory, continuity_assessment, progression_readiness |
| continuity | continuity_assessment |
| maturity | semantic_maturity_profile, maturity_dimension_breakdown, semantic_gravity_assessment, qualification_stability |
| progression | progression_readiness, semantic_debt_inventory, qualification_state |
| evidence | All replay and certification artifacts, maturity_dimension_breakdown |
| handoff | qualification_state, semantic_maturity_profile, semantic_gravity_assessment, qualification_stability, progression_readiness, maturity_certification, qualification_state_certification, maturity_replay_verification, qualification_state_replay_verification |

## Governance

- Read-only consumption via `SemanticArtifactLoader.loadJSON`
- Client/run validated against manifest registry
- Path traversal protection inherited from `SemanticArtifactLoader`
- No artifact mutation
