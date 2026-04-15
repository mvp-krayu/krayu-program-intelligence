---
title: Contracts
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Index of governing contracts that define system behavior for the GAUGE operational chain. All entries link by path only.

## Classification

canonical-doc

## Contract Index

| contract | path | governs |
|----------|------|---------|
| GAUGE State Computation Contract | `docs/psee/GAUGE.STATE.COMPUTATION.CONTRACT.01/gauge_state_computation_contract.md` | S4 gauge computation; score model; GC gate conditions |
| S3/S4 Run Coherence Contract | `docs/psee/S3.S4.RUN.COHERENCE.CONTRACT.01/s3_s4_run_coherence_contract.md` | Coherence declaration; CA gate conditions |
| GAUGE Baseline Lock Contract | `docs/psee/GAUGE.BASELINE.LOCK.01/gauge_baseline_lock_contract.md` | Locked baseline identity; tag product-gauge-authoritative-v1 |
| IG Handoff Authority | `docs/psee/IG.HANDOFF.AUTHORITY.01/ig_handoff_authority.md` | IG materialization authority |
| Structural Truth Authority | `docs/psee/STRUCTURAL.TRUTH.AUTHORITY.01/structural_truth_authority.md` | L40.2–L40.4 structural chain authority |
| Git Structure Contract | `docs/governance/runtime/git_structure_contract.md` | Repository domain and branch governance |

## Linked Protocols

See [[Protocols]] for execution protocol index.

## Determinism / Constraint Notes

Contracts are canonical-doc class. They define behavior — they do not record execution. Use execution logs for evidence of what was done.
