# AMOps Propagation Debt Manifest

**Artifact:** PI.AMOPS-PROPAGATION-DEBT-AUDIT.01 / PROPAGATION_DEBT_MANIFEST
**Status:** AUDIT — no canonical-state rewrite performed; this is the debt inventory requested before scoping propagation
**Date:** 2026-06-12
**Trigger:** Forensic lineage trace of cognition findings revealed the vault carries no record of the finding persistence boundary — recovered by code archaeology, proving §16.4 closure propagation was skipped across multiple G1 streams.

## Baseline

- Last canonical-state update: `95c143c` 2026-06-05 ("Consumer Authority Consolidation (G1)").
- Commits since: **286**.
- Vault-touching commits since: **1** — `e8a98d7` 2026-06-07, propagated 4 constitutional sub-pages (`PIOS_PROJECTION_AUTHORITY_MODEL`, `PIOS_PROJECTION_VIOLATION_DOCTRINE`, `PIOS_TOPOLOGY_FIRST_DOCTRINE`). NOT cognition concepts; canonical state file untouched.

## Debt inventory

| Concept | Source commit(s) | Registry | Canonical state | Implemented | Defect |
|---|---|---|---|---|---|
| Artifact Qualification AQ-001 | b3d94d5 | PCD-008 VALIDATED | absent | yes | propagation |
| Investigation primitive | d1ed4fb, 174ac1f | PCD-009 "not yet implemented" | absent | YES (`InvestigationRuntime.js`) | propagation + REGISTRY CONTRADICTS CODE |
| Navigation / Chip State Machine (3 types, 6 intents) | 1595bd2, 671904d, b20bf2c, 8295b31, 51be6f2 | none | partial | yes | propagation |
| Answer Objects (AO-001..011, ontology, runtime-learning, steering contract) | 3e44823, c8931ed, f9e9191, 4dec4a3, 1c2eccd, 445cb2f | none | absent (0) | yes | propagation |
| Investigation Synthesis Panel (THORR-in-rail) | 33eeba3 | none | absent | yes | propagation |
| Cognitive Anchor hierarchy | db34cb6 | none | absent (0) | yes | propagation |
| SynthesisContext contract | e3f8328 | none | absent (0) | yes | propagation |
| THORR invocation contract (gated premium) | 51be6f2 | none | absent | doctrine | propagation |
| Temporal Cognition (3rd axis) | 635ad15 + 8 temporal docs | PCD-010 DISCOVERED | absent (0) | no (LOCKED, substrate-blocked) | canonical should record axis + lock |
| Maturation Runtime (= SQO is the maturation runtime) | 23cde64 | NONE | absent (0) | n/a (doctrine) | not in registry |
| Carrier classification (ordinal/snapshot-state/native-temporal) | b2ae66f | NONE | absent | no | not in registry |
| Finding persistence boundary (execution blindness/gravity divergence/runtime consequences/domain cognition are runtime-only, non-persisted, non-replayable) | c2575bb, 2e2f07d (pre-session) | none | partial (SignalSynthesisEngine named; boundary absent) | yes | propagation — most important architectural fact missing |

## Two defect classes

1. **Propagation debt** — implemented runtime cognition architecture committed with no canonical-state update. The vault has no record of Investigation Runtime, Answer Objects, Chip State Machine, Cognitive Anchor, SynthesisContext, Synthesis Panel, or the finding persistence boundary.

2. **Registry inconsistency** — PCD-009 Investigation says "DISCOVERED — not yet implemented" while `InvestigationRuntime.js` exists and runs (registry contradicts code). Maturation Runtime and Carrier Classification are LOCKED doctrine outputs absent from the registry entirely.

## Scope options (for operator decision — none executed)

- **A. Full propagation** — update canonical state + terminology lock with all propagation-debt rows + fix registry PCD-009 status + add Maturation/Carrier entries. One G1 propagation pass.
- **B. Correctness-first** — fix only the registry contradiction (PCD-009) and the finding persistence boundary now; defer the rest.
- **C. Split** — runtime-architecture propagation (Investigation/AO/Chip/Anchor/SynthesisContext) as one pass; temporal/maturation doctrine as a second.

## Root-cause note

This debt accrued because streams ran EXECUTION + commit but skipped POST-FLIGHT (§16.1 AMOps lifecycle). The fix is not only to propagate the backlog but to not detach commit from propagation going forward — propagation is part of closure, not a later batch.
