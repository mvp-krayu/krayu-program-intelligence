# Replay-Safe Regeneration Validation

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01

### Replay-Safe Requirements (per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md)

1. TAXONOMY-01 fields immutable
2. Deterministic re-derivation
3. Bit-identical reruns

### Test Protocol

Two independent runs from the same source archive (BlueEdge v3.23.0):
- Run 1: `run_blueedge_a5_validation_01`
- Run 2: `run_blueedge_a5_validation_02`

Each run executed from clean state: fresh extraction → source_intake → structural_scanner → ceu_grounding → dom_layer_generator.

### Results

#### 40.4 Canonical Topology (Path A)

| Property | Run 1 | Run 2 | Match |
|----------|-------|-------|-------|
| cluster_count | 11 | 11 | YES |
| wrapper_detected | true | true | YES |
| wrapper_prefix | blueedge-platform | blueedge-platform | YES |
| Cluster names | identical | identical | YES |
| Cluster node_ids | identical | identical | YES |
| Full JSON (excluding generated_at, run_id, client_id, source_id) | identical | identical | **BIT-IDENTICAL** |

#### dom_layer.json (Path A.5)

| Property | Run 1 | Run 2 | Match |
|----------|-------|-------|-------|
| domain_count | 48 | 48 | YES |
| total_nodes | 945 | 945 | YES |
| Domain labels | identical | identical | YES |
| Domain node assignments | identical | identical | YES |
| node_to_domain_map | identical | identical | YES |
| generation_rules | identical | identical | YES |
| Full JSON (excluding generated_at, run_id, client) | identical | identical | **BIT-IDENTICAL** |

### TAXONOMY-01 Field Immutability

The dom_layer.json output preserves the orchestrator-required fields:
- `dom_id`: deterministic (DOM-NN, sorted alphabetically by label)
- `dom_label`: deterministic (derived from path segments via normalize_label)
- `included_nodes`: deterministic (sorted node_id lists)
- `derivation_rule`: deterministic (path_prefix string)
- `path_patterns`: deterministic (sorted pattern lists)

These fields do not change between runs.

### Verdict

**REPLAY-SAFE: CONFIRMED.** Two independent runs produce bit-identical domain topology.
