# Capability Registry

Operational inventory of existing materializers, derivers, and gate tools. Loaded during cognitive rehydration (CLAUDE.md §12.4) to prevent redundant script creation.

## SQO Execution Model

| Artifact | Path | Purpose |
|----------|------|---------|
| SQO Execution Graph (JSON) | `docs/pios/sqo_execution_graph.json` | Machine-loadable governance stage sequence, state vocabulary, allowed transitions, artifact requirements. MUST be loaded before any SQO work after context compaction. |
| SQO Execution Graph (MD) | `docs/pios/SQO_EXECUTION_GRAPH.md` | Human-readable reference. |

SQO is an executable governance graph, not a conversation memory. After reboot/compaction, reload — do not rediscover.

## Semantic Derivation

| Capability | Implementation | Status | Path | Notes |
|------------|---------------|--------|------|-------|
| PATH A Structural Proposition Derivation | `scripts/pios/spe/derivation_engine.py` | OPERATIONAL | PATH A | 6 deterministic derivers. Produces STRUCTURAL_DOMINANCE, COUPLING_PATTERN, AUTHORITY_TOPOLOGY, TIER_GROUNDING, HERO_MOMENT_GROUNDING, CLUSTER_ARCHITECTURE. Requires code graph + centrality + topology + hero moments. |
| PATH A SPE Orchestrator | `scripts/pios/semantic_proposition_engine.py` | OPERATIONAL | PATH A | Entry point. Calls derivation_engine, confidence_engine, review_queue_emitter, learning_emitter, output_emitter. |
| PATH B Semantic DNA to Proposition Materializer | `scripts/pios/sdc/proposition_bridge.py` | OPERATIONAL | PATH B | 4 derivers: DOMAIN_EVIDENCE_GROUNDING, CAPABILITY_EVIDENCE, VAULT_CLAIM_STRUCTURAL, CROSS_DOMAIN_EVIDENCE. Parameterized: --client, --run-id, --sdc-run. Output: semantic/spe/semantic_propositions.json. Proven: 85 propositions on BlueEdge run_blueedge_genesis_e2e_03. |
| SDC Evidence Compiler | `scripts/pios/sdc/` (multiple) | OPERATIONAL | PATH B | Produces candidate_csr.json, derivation_report.json, review_queue.json from HTML evidence files. Proven on BlueEdge (3 HTML files, 19 domains, 24 capabilities, 207 components). |
| Semantic Topology Generator | `scripts/pios/generate_semantic_topology.py` | OPERATIONAL | Generic | Produces semantic_topology_model.json from CSR. |
| SPE Confidence Engine | `scripts/pios/spe/confidence_engine.py` | OPERATIONAL | Generic | Scores propositions by tier, evidence strength, reconciliation state. |
| SPE Review Queue Emitter | `scripts/pios/spe/review_queue_emitter.py` | OPERATIONAL | Generic | Flags propositions requiring operator review. |
| SPE Inferred Proposer | `scripts/pios/spe/inferred_proposer.py` | OPERATIONAL (gated) | Generic | Claude-assisted INFERRED tier. Requires --enable-semantic-derivation flag. Not used in NetBox S2 run. |

## Pipeline Orchestration

| Capability | Implementation | Status | Notes |
|------------|---------------|--------|-------|
| Pipeline Orchestrator | `scripts/pios/run_client_pipeline.py` | OPERATIONAL | 19-phase pipeline with materialization registry. |
| Source Intake Materializer | `scripts/pios/source_intake.py` | OPERATIONAL | TAR_ARCHIVE adapter. Generic framework with provenance. |
| Structural Scanner | `scripts/pios/structural_scanner.py` | OPERATIONAL | Phase 2 structural inventory. |
| CEU Grounding | `scripts/pios/ceu_grounding.py` | OPERATIONAL | CEU candidate derivation + evidence intake + reconciliation seeding. |

## SQO Governance Gates

| Capability | Implementation | Status | Notes |
|------------|---------------|--------|-------|
| CEU Reconciliation (Gate 1) | `scripts/pios/ceu_reconciliation_action.py` | OPERATIONAL | Operator CLI: confirm/reject/merge/complete. |
| Proposition Review (Gate 3) | `scripts/pios/proposition_review_action.py` | OPERATIONAL | Operator CLI: accept/reject/contest/arbitrate/accept-unflagged/complete. |
| Revalidation Engine (Gate 4) | `scripts/pios/revalidation_engine.py` | OPERATIONAL | 25-check deterministic revalidation. |
| Promotion Action (Gate 5) | `scripts/pios/promotion_action.py` | OPERATIONAL | Operator CLI: advance/hold/block. Integrated with constitutional replay anchor. |
| Constitutional Replay Anchor | `scripts/pios/constitutional_replay_anchor.py` | OPERATIONAL | 8-dimension semantic adequacy check. Blocks advancement when constitutional distance too high. Needs PATH B class awareness update. |

## Enrichment

| Capability | Implementation | Status | Path | Notes |
|------------|---------------|--------|------|-------|
| PATH B Evidence Enrichment | `scripts/pios/sdc/evidence_enrichment_rc04.py` | OPERATIONAL | PATH B | Domain ID mismatch correction + confidence recalculation from HTML evidence. Parameterized: --client, --run-id, --sdc-run, --blockers-run. Emits enrichment_activity_event.json. Proven: 32 enrichment events on BlueEdge run_blueedge_genesis_e2e_03. |
| Enrichment Participation Advisory | `scripts/pios/psee_handoff/evaluate_enrichment_participation.py` | OPERATIONAL | Generic | Observational only — evaluates enrichment participation. Does not perform enrichment. |

## Chronicle

| Capability | Implementation | Status | Path | Notes |
|------------|---------------|--------|------|-------|
| RC-08 Chronicle Builder | `scripts/pios/sdc/chronicle_builder_rc08.py` | OPERATIONAL | Generic | 8-chapter cognitive traversal HTML with Z1-Z5 zoom levels. Parameterized: --client, --run-id. Reads from PSEE run artifacts (semantic/spe, sqo, convergence). All narrative derived from actual data. Proven: 57KB HTML on BlueEdge run_blueedge_genesis_e2e_03. |
| RC-09 Chronicle Certification | `scripts/pios/sdc/chronicle_certification_rc09.py` | OPERATIONAL | Generic | 10-phase/62-check deterministic certification of governed cognitive replay lifecycle. Parameterized: --client, --run-id. Verifies: artifact existence, governance lifecycle, proposition consistency, revalidation, anchor, enrichment, convergence, chronicle, promotion, cross-artifact consistency. Proven: 62/62 PASS on BlueEdge run_blueedge_genesis_e2e_03. |

## Signal Derivation

| Capability | Implementation | Status | Notes |
|------------|---------------|--------|-------|
| PSIG (Level 2) | `scripts/pios/psig_derivation.py` | OPERATIONAL | Architectural pressure signals. |
| ISIG (Level 1) | `scripts/pios/isig_derivation.py` | OPERATIONAL | File-topology intelligence signals. |
| DPSIG | `scripts/pios/dpsig_derivation.py` | OPERATIONAL | Topology pressure signals. |

---

## Gap Classification Guide

Before proposing new work, classify:

| Classification | Meaning | Action |
|---------------|---------|--------|
| EXISTS | Fully operational | Use as-is |
| EXISTS_NEEDS_PARAMETERIZATION | Logic present, hardcoded paths | Add CLI args, generalize paths |
| EXISTS_NEEDS_ROUTING | Logic present, not wired to pipeline | Add pipeline/gate integration |
| EXISTS_NEEDS_INTEGRATION | Logic present, missing upstream/downstream | Wire to adjacent systems |
| PARTIALLY_EXISTS | Some logic, needs extension | Extend existing, don't create new |
| GENUINELY_MISSING | No comparable capability | Create new (with justification) |
