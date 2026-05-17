# Semantic Participation Reconstruction Policy

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01
## Lane: A.5 — Grounding-aware semantic participation

### Policy Statement

Path A.5 semantic participation domains are derived from structural path-prefix evidence. The reconstruction method is deterministic: same 40.2 node inventory + same 40.4 canonical topology → same domain assignment.

### Method: `a5_path_prefix_reconstruction` (v2.0)

1. **Input:** 40.4 `canonical_topology.json` (clusters) + 40.2 `structural_node_inventory.json` (node paths)
2. **Wrapper awareness:** Read `wrapper_normalization` from 40.4. If a wrapper prefix was detected, strip it from effective paths before grouping.
3. **Pass 1 — Cluster subdivision:** For each cluster with >= `MIN_SUBDIVISION_NODES` (3) nodes, group nodes by next path component relative to cluster root.
4. **Pass 2 — Intermediate expansion:** If any Pass 1 sub-group contains > `INTERMEDIATE_RATIO` (0.75) of the cluster's total nodes AND has >= `MIN_SUBDIVISION_NODES` nodes, subdivide that sub-group one more level by its next path component.
5. **Root files:** Nodes at the cluster or sub-group root level (no further subdirectory) are assigned to a `<prefix>_root` domain.
6. **Label derivation:** Domain labels are derived from path segments via `normalize_label()`: strip leading dots, replace non-alphanumeric with underscore, lowercase. Deterministic.
7. **Output:** `dom_layer.json` with `dom_groups[]` containing `dom_id`, `dom_label`, `included_nodes`, `derivation_rule`, `path_patterns`.

### Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MIN_SUBDIVISION_NODES` | 3 | Minimum nodes in a cluster to attempt subdivision |
| `INTERMEDIATE_RATIO` | 0.75 | Threshold for identifying intermediate aggregation directories |

### Lane Isolation

- A.5 reads Lane A artifacts (40.2, 40.4) as inputs — READ-ONLY
- A.5 output (`dom/dom_layer.json`) is consumed by Phase 5 (binding envelope) and Phase 8a (vault construction)
- A.5 does NOT mutate any 40.x artifact
- Lane A `structural_scanner.py` output is unchanged regardless of A.5 method

### Replay-Safe Guarantee

- `generation_rules.method` in dom_layer.json declares the reconstruction method
- `generation_rules.version` tracks method version (currently `2.0`)
- Same source archive → same 40.2/40.4 → same dom_layer.json (excluding `generated_at` timestamp)
- Verified: two independent runs produce bit-identical domain assignment
