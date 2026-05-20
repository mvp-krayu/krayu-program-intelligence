# Implementation Semantics — PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| classify_node | structural_relevance_classifier.py | Classify single path → (SRC, tier, rule) | Reusable |
| classify_all_nodes | structural_relevance_classifier.py | Classify entire 40.2 inventory | Reusable |
| build_filtered_inventory | structural_relevance_classifier.py | Produce PRIMARY-only 40.2r | Reusable |
| build_filtered_topology | structural_relevance_classifier.py | Produce PRIMARY-only 40.3r | Reusable |
| RELEVANCE_RULES | structural_relevance_classifier.py | Ordered rule list (34 rules) | Extensible |
| SRC_TIERS | structural_relevance_classifier.py | SRC → significance tier mapping | Locked |

## 2. Input Contracts

| Artifact | Schema | Consumed Fields |
|---|---|---|
| 40.2/structural_node_inventory.json | structural_scanner output | nodes[].node_id, nodes[].path, nodes[].type, total_nodes |
| 40.3/structural_topology_log.json | structural_scanner output | edges[].source, edges[].target, edges[].edge_type, total_edges |

## 3. Output Contracts

| Artifact | Location | Schema |
|---|---|---|
| structural_relevance.json | structure/40.2r/ | Full classification with per-node SRC, significance tier, matched rule, summary counts, core_source_ratio |
| structural_node_inventory_filtered.json | structure/40.2r/ | Same schema as 40.2 but containing only PRIMARY (CORE_SOURCE) nodes |
| structural_topology_log_filtered.json | structure/40.3r/ | Same schema as 40.3 but containing only edges where BOTH source and target are PRIMARY |

## 4. Calibration Assumptions

| Constant | Value | Status |
|---|---|---|
| RELEVANCE_RULES ordering | First-match-wins, 34 rules | Governed — order is semantic |
| SRC_TIERS mapping | 9 classes → 3 tiers | Locked — CORE_SOURCE is the ONLY PRIMARY class |
| Directory classification | Dominant child SRC | Tuned — could evolve to weighted or depth-aware |

## 5. Extension Points

| Point | Description |
|---|---|
| RELEVANCE_RULES list | Add rules for new languages/frameworks (insert before catch-all) |
| SRC classes | Add new classes (requires SRC_TIERS mapping entry) |
| Significance tiers | Currently fixed at 3 (PRIMARY/SUPPORT/PERIPHERAL) |
| Content-based classification | Future Tier 2 (SCIP) — separate stream, not this module |

## 6. Module Responsibility Map

| File | Owns |
|---|---|
| structural_relevance_classifier.py | SRC classification, filtered inventory generation, filtered topology generation |
| run_client_pipeline.py | Phase 3.5 orchestration, graceful degradation |
| dom_layer_generator.py | 40.2r preference resolution, cluster filtering |
