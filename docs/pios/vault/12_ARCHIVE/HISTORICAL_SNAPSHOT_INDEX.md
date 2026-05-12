# Historical Snapshot Index

> **Known snapshots of the governance corpus and their assessment status.**

---

## Assessed Snapshots

### Snapshot: April 2026 Governance Corpus

| Property | Value |
|---|---|
| Approximate date | 2026-04-01 |
| Location | ~/Projects/k-pi-governance/docs/governance |
| File count | 94 markdown files |
| PiOS streams | 48 directories (40.x–51.x + B.1) |
| Assessment stream | PI.PIOS.GOVERNANCE-SNAPSHOT-TRAVERSAL-AND-CANONICAL-RECONCILIATION.01 |
| Assessment date | 2026-05-12 |
| Assessment output | docs/pios/bootstrap/snapshot_assessment/ (7 documents) |
| Verdict | REQUIRES_RECONCILIATION |

**Key findings:**
- L0-L8 canonical layer model present (PROVISIONAL status)
- No PATH A/B, SQO, HYDRATED, Q-class, multi-client terminology
- ExecLens as primary runtime with 4-path, 3-persona model
- PIE vault (17 domains, 42 capabilities, 89 components)
- DRIFT-001 as only registered drift case
- 3 PROMOTE, 5 REWRITE, 10 HISTORICAL, 7 DEPRECATE classifications

See `docs/pios/bootstrap/snapshot_assessment/` for full assessment.

## Certified Baselines

| Baseline Branch | Frozen Content | Date |
|---|---|---|
| baseline/demo-execlens-v1-final | Final ExecLens demo state | ~2026-04-02 |
| baseline/governance-v1-final | Final v1 governance | ~2026-04-02 |
| baseline/lens-vnext | LENS next baseline | ~2026-05-08 |
| baseline/pios-core-v0.4-final | PiOS Core v0.4 | ~2026-03-29 |

## Cross-References

- [[SUPERSEDED_CONCEPTS]] — concepts no longer active
- [[DEAD_ASSUMPTIONS]] — assumptions that were invalidated
- [[FAILED_ARCHITECTURAL_PATHS]] — paths that didn't work
