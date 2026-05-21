# Implementation Semantics — PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

## 1. Primitive Inventory

| # | Name | Module | Purpose | Reuse Status |
|---|------|--------|---------|--------------|
| 1 | SPEInputBundle | spe/input_loader.py | Typed bundle of PATH A inputs with readiness validation | REUSABLE — any structural consumer can load this bundle |
| 2 | SemanticProposition | spe/proposition_schema.py | Canonical semantic_proposition spine schema with SPE extensions | REUSABLE — schema for all semantic propositions |
| 3 | LineageEvent | spe/proposition_schema.py | Derivation lineage event with semantic_type and learning_context | REUSABLE — lineage tracking for any derivation |
| 4 | DerivationResult | spe/proposition_schema.py | Container for derivation output (propositions, lineage, learning, hashes) | REUSABLE |
| 5 | derive_all() | spe/derivation_engine.py | Orchestrates 6 deterministic class derivers | EXTENSIBLE — new derivers can be added to the list |
| 6 | score_propositions() | spe/confidence_engine.py | Multi-factor confidence scoring | REUSABLE — pattern applicable to any proposition source |
| 7 | emit_learning_events() | spe/learning_emitter.py | PROPOSED learning event generation | REUSABLE — pattern for any derivation that may produce friction |
| 8 | emit_review_queue() | spe/review_queue_emitter.py | Proposition review queue with trigger taxonomy | REUSABLE — review pattern for any operator-reviewed output |
| 9 | emit_outputs() | spe/output_emitter.py | Run directory output writer | REUSABLE — writes to standard artifact paths |
| 10 | propose_inferred() | spe/inferred_proposer.py | AI-gated cross-cutting pattern identification | REUSABLE — LLM bridge for any evidence-constrained inference |

## 2. Input Contracts

### SPEInputBundle (input_loader.py)

Required artifacts (from run directory):

| Artifact | Path | Consumed Fields |
|----------|------|-----------------|
| reconciliation_state.json | ceu/ | candidates (state, tier, domain, evidence_count, reconciliation_finding, last_action), reconciliation_status |
| evidence_anchors.json | ceu/ | domain_summary, total_anchors |
| candidate_registry.json | ceu/ | candidates[].structural_metrics, authority_pattern, top_spine, role_distribution |
| derivation_lineage.json | ceu/ | events, event_types |
| structural_centrality.json | structure/40.3c/ | centrality_ranking[].path, node_id, import_in_degree, structural_role, centrality_rank |
| code_graph.json | structure/40.3s/ | relationships[].source_path, target_path, relation_type |
| canonical_topology.json | structure/40.4/ | clusters[].cluster_id, node_ids, node_count |
| spine_objects.json | spine/ | objects.hero_moments, objects.evidence_objects, objects.replay_corridors, specimen_id, run_id |

Optional: `governance/learning_events.jsonl` — accumulated learning events.

Readiness gates: reconciliation_status=COMPLETE, centrality_ranking non-empty, code_graph relationships non-empty.

## 3. Output Contracts

| Output | Path | Contents |
|--------|------|----------|
| spine_objects.json | spine/ | objects.semantic_propositions[] appended, summary updated |
| proposition_derivation_lineage.json | semantic/spe/ | Full lineage: input_hash, derivation_hash, events with semantic_type + learning_context |
| proposition_review_queue.json | semantic/spe/ | Review items with triggers (LOW_CONFIDENCE, INFERRED_TIER, CONFLICTING_ELEMENT, COVERAGE_GAP) |
| spe_derivation_report.json | semantic/spe/ | Summary: proposition_count, confidence_report, class_summary, learning_influence_summary |
| learning_events.jsonl | governance/ | Appended PROPOSED learning events |

## 4. Calibration Assumptions

| Parameter | Value | Governed? | Notes |
|-----------|-------|-----------|-------|
| Coupling threshold | 20 bidirectional imports | Tunable | Below this, coupling too weak for proposition |
| Dominance ratio threshold | 1.5x median | Tunable | Below this, no dominance claim |
| Dual authority threshold | 1.5x import-inheritance ratio | Tunable | Triggers AUTHORITY_TOPOLOGY proposition |
| Confidence tier base | DIRECT=0.70, DERIVED=0.50, INFERRED=0.35 | Tunable | Starting confidence before boosts |
| Reconciliation boost | ALIGNED=+0.10, CONTESTED=-0.10 | Tunable | |
| Low confidence learning trigger | <0.45 | Tunable | Below this, emits PROPOSED learning event |
| Review queue confidence trigger | <0.50 | Tunable | Below this, enters review queue |
| Minimum cluster nodes | 3 | Fixed | Below this, cluster skipped |

## 5. Extension Points

1. **New derivation class:** Add a `derive_X()` function to `derivation_engine.py` and append to `derivers` list in `derive_all()`.
2. **New confidence factor:** Add a `_X_boost()` function to `confidence_engine.py` and call it in `score_propositions()`.
3. **New learning trigger:** Add detection logic to `learning_emitter.py`'s `emit_learning_events()`.
4. **New review trigger:** Add trigger logic to `review_queue_emitter.py`'s `emit_review_queue()`.
5. **INFERRED tier expansion:** Modify prompt template in `inferred_proposer.py`.
6. **New input artifact:** Add to `REQUIRED_ARTIFACTS` or `OPTIONAL_ARTIFACTS` in `input_loader.py`, add property to `SPEInputBundle`.

## 6. Module Responsibility Map

| Module | Responsibility | Imports From |
|--------|---------------|--------------|
| input_loader.py | Load, validate, hash inputs | (stdlib only) |
| proposition_schema.py | Schema definitions, validation | (stdlib only) |
| derivation_engine.py | All deterministic derivation | input_loader, proposition_schema |
| confidence_engine.py | Multi-factor scoring | proposition_schema |
| learning_emitter.py | PROPOSED event generation | proposition_schema |
| review_queue_emitter.py | Review queue assembly | proposition_schema |
| output_emitter.py | File output to run directory | proposition_schema |
| inferred_proposer.py | AI-gated INFERRED tier | proposition_schema, sdc.llm_adapter |
| semantic_proposition_engine.py | Orchestration | All SPE modules |
| run_client_pipeline.py (Phase 3c) | Pipeline integration | (subprocess to orchestrator) |
