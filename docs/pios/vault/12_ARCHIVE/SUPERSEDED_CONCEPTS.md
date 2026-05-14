# Superseded Concepts

> **Architectural concepts that were replaced by successors. Preserved for lineage.**

---

## Superseded Concept Registry

| Concept | Era | Superseded By | When | Why |
|---|---|---|---|---|
| ExecLens panel model | S2 (2026-03-21) | LENS v2 + SQO Cockpit | 2026-05-09 | Panel-based model too brittle; split into semantic surface + qualification engine |
| 4-path traversal | S2 (2026-03-26) | Single LENS v2 surface + SQO sections | 2026-05-09 | Multiple paths created navigation complexity without proportional value |
| 3-persona gate | S2 (2026-03-26) | Q-class disclosure rendering | 2026-05-10 | Q-class provides more nuanced visibility control than persona gates |
| Guided demo choreography | S2 (51.x) | SQO Cockpit independent sections | 2026-05-10 | Sequential panel locking was fragile (6/18 streams were repairs) |
| Panel state machine | S2 (51.x) | SQO S-state machine | 2026-05-10 | S-states are deterministic from data, not panel interaction |
| Binary compliance | S1 (00.2) | Graduated trustworthiness (HYDRATED → LENS) | 2026-05-10 | Binary pass/fail couldn't express partial confidence |
| Domain A/B/C remediation | S1 (governance) | PI stream contracts | ~2026-05 | Stream-scoped contracts are more granular than domain remediation |
| governance_master_capsule.md | S1 (foundational) | CLAUDE.md v2.4 | ~2026-05 | Constitution model more comprehensive than capsule |
| governance_operating_model.md | S1 (foundational) | PI stream model | ~2026-05 | Contract-driven execution replaces lifecycle-driven |
| Numeric stream naming | S1-S2 | PI.*.*.01 naming | ~2026-05 | Named streams are more descriptive and less collision-prone |
| PSEE namespace | S3 | DPSIG namespace | 2026-05-06 | PSIG→DPSIG migration formalized |
| BlueEdgeSemanticCandidateExtractor | S4 | ExplicitEvidenceRebaseExtractor | 2026-05-12 | Evidence rebase unified extraction and admissibility |
| DynamicCEUAdmissibilityEvaluator | S4 | ExplicitEvidenceRebaseExtractor | 2026-05-12 | Same rebase unification |

## Supersession Rules

1. Superseded concepts are NEVER deleted from the vault — they move to this archive
2. Lineage chains from superseded → successor must be traceable
3. Superseded concepts retain their original documentation in [[../02_EXECLENS_LINEAGE/]] etc.
4. If a superseded concept is reactivated, it moves back to its original section with updated status

## Cross-References

- [[DEAD_ASSUMPTIONS]] — assumptions behind superseded concepts
- [[FAILED_ARCHITECTURAL_PATHS]] — paths that led to supersession
- [[HISTORICAL_SNAPSHOT_INDEX]] — snapshots preserving superseded state
