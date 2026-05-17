# Node Participation Policy

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01

### Policy Statement

All nodes from the 40.2 structural node inventory participate in A.5 domain assignment. There is no manual node curation or selection. Domain derivation operates on the full node set.

### Participation Model

| Property | Value |
|----------|-------|
| Input node source | 40.2 `structural_node_inventory.json` |
| Node types included | All (`file` and `directory`) |
| Selection criteria | None — all nodes participate |
| Manual curation | PROHIBITED |
| Node filtering | PROHIBITED |
| Coverage target | 100% of 40.2 nodes assigned to exactly one domain |

### Comparison to Reference Artifact

The reference artifact (`dom_path_domain_layer.json`, commit 64ff900) operated on 35 curated nodes from `ceu_node_map.json`. The generic pipeline operates on all nodes (945 for BlueEdge).

| Metric | Reference (curated) | Generic pipeline |
|--------|-------------------|-----------------|
| Input nodes | 35 | 945 |
| Domains | 13 | 48 |
| Coverage | 100% (35/35) | 100% (945/945) |

The domain count difference is expected: more nodes expose more structural boundaries. The grouping pattern is consistent — reference domains (backend_common, backend_config, backend_events, backend_health, backend_modules) appear as equivalent domains in the generic output (backend_src_common, backend_src_config, backend_src_events, backend_src_health, backend_src_modules).

### Validation Rule

`dom_layer.json` MUST satisfy: `total_nodes == sum(d.node_count for d in domains) == len(node_to_domain_map)`. Any unassigned node is a PARTIAL validation status.

### Governed Selector Logic

Manual node curation is forbidden unless declared as governed selector logic through a formal governance stream. The generic pipeline does not implement any node selection — all nodes from 40.2 are domain-assigned.
