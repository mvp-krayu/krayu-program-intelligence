# Structural Truth 40.4 Specification
# PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01

- Version: 1.0
- Stream: PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01
- Authority: STRUCTURAL.TRUTH.AUTHORITY.01
- Branch: feature/structural-truth-40-4
- Date: 2026-04-14

---

## 1. PURPOSE

L40.4 consumes all governed outputs from L40.2 (structural unit inventory, file map, extraction log)
and L40.3 (structural edge map, relationship inventory, relationship log), cross-validates them for
consistency, and produces a canonical, deduplicated, normalized structural topology.

L40.4 is the terminal layer of the STRUCTURAL.TRUTH stream. Its output is a complete, self-contained
structural graph: nodes derived from CEUs, edges derived from structural relationships, adjacency
computed as a secondary index, and node-edge statistics.

L40.4 does NOT:
- read from ig/ artifacts
- modify any upstream artifact (40_2/, 40_3/, ig/)
- infer semantic meaning, domain classification, or capability
- resolve the reconstruction constraint (explicitly declared BLOCKED)

---

## 2. INPUT CONTRACT

All 6 inputs are required. Any missing artifact or failed cross-validation causes exit 1.

### From 40_2/

| Artifact | Required Fields |
|----------|----------------|
| `structural_unit_inventory.json` | `units[].unit_id`, `units[].directory`, `units[].file_count`, `units[].file_types_present`, `units[].dominant_file_type`, `units[].unit_hash`, `extracted_at`, `intake_id`, `unit_count` |
| `file_structural_map.json` | `entries[].unit_id`, `entries[].path` |
| `structural_extraction_log.json` | `extracted_at`, `determinism_hash` (stored as `det_hash_40_2` in provenance) |

### From 40_3/

| Artifact | Required Fields |
|----------|----------------|
| `structural_edge_map.json` | `edges[].edge_id`, `edges[].edge_type`, `edges[].from_unit_id`, `edges[].to_unit_id`, `edges[].direction`, `edges[].evidence`, `edge_count` |
| `structural_relationship_inventory.json` | `unit_count`, `edge_count` |
| `structural_relationship_log.json` | `determinism_hash` (stored as `det_hash_40_3` in provenance) |

---

## 3. CROSS-VALIDATION CONTRACT

All cross-validation checks are fail-closed (exit 1 on failure).

| Check | Condition |
|-------|-----------|
| unit_count_cross_reference | `sui.unit_count == sri.unit_count` |
| edge_count_cross_reference | `sri.edge_count == sem.edge_count` |
| edge_list_length_check | `sem.edge_count == len(sem.edges)` |
| file_count_per_unit_check | per-unit file count in `sui.units[].file_count` == count of `fsm.entries` with that `unit_id` |
| timestamp_cross_reference | `sui.extracted_at == sel.extracted_at` |
| endpoint_validation | all `sem.edges[].from_unit_id` and `to_unit_id` exist in the node set |

---

## 4. NORMALIZATION RULES

| Rule | Definition |
|------|------------|
| Node identity | `node_id = unit_id` — identity preserved from 40.2 |
| Node ordering | Lexicographic by `unit_id` |
| Node fields | Structural facts only: `node_id`, `directory`, `file_count`, `file_types_present`, `dominant_file_type`, `unit_hash` |
| Edge source | ALL edges from `structural_edge_map.json` — no inferred edges |
| Edge mapping | `from_unit_id → from_node_id`; `to_unit_id → to_node_id` |
| Edge deduplication | Collapse on `(edge_type, from_node_id, to_node_id)` triple; count `duplicates_collapsed` |
| Edge direction | Preserved exactly from 40.3: `DIRECTED` or `NORMALIZED_UNDIRECTED` — no reversal |
| Edge ordering | Lexicographic by `(edge_type, from_node_id, to_node_id)` |
| Isolated nodes | Included — nodes with zero incident edges are valid structural truth |
| Adjacency | Secondary: per-node sorted list of incident edge_ids (derivable from edge list alone) |
| Timestamp | Inherited from `structural_unit_inventory.json.extracted_at` |

---

## 5. OUTPUT CONTRACT

Three artifacts written to `clients/<tenant>/psee/runs/<run_id>/40_4/`.
No-overwrite guard: exit 1 if `40_4/` already exists.

### 5.1 normalized_structural_topology.json

```
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01",
  "artifact_class": "STRUCTURAL_TRUTH_40_4",
  "artifact_id": "normalized_structural_topology",
  "tenant": <str>,
  "run_id": <str>,
  "intake_id": <str>,
  "normalized_at": <ISO8601>,          // inherited from extracted_at
  "source_40_2_dir": <rel_path>,
  "source_40_3_dir": <rel_path>,
  "node_count": <int>,
  "edge_count": <int>,
  "nodes": [                           // sorted by node_id
    {
      "node_id": <str>,
      "directory": <str>,              // "(root)" for root-level CEUs
      "file_count": <int>,
      "file_types_present": [<str>],   // sorted
      "dominant_file_type": <str>,
      "unit_hash": <sha256>,
      "source_40_2_evidence": { "unit_id": <str>, "artifact": "structural_unit_inventory.json" }
    }
  ],
  "edges": [                           // sorted by (edge_type, from_node_id, to_node_id)
    {
      "edge_id": <str>,
      "edge_type": <str>,              // DIRECTORY_CONTAINS | DIRECTORY_SIBLING |
                                       // STRUCTURAL_TYPE_AFFINITY | CONTENT_DUPLICATE
      "from_node_id": <str>,
      "to_node_id": <str>,
      "direction": <str>,              // DIRECTED | NORMALIZED_UNDIRECTED
      "source_40_3_evidence": { "edge_id": <str>, "artifact": "structural_edge_map.json" }
    }
  ],
  "adjacency": {
    "derivation": <str>,               // canonical reproducibility statement
    "entries": { <node_id>: [<edge_id>] }  // sorted edge_ids per node
  }
}
```

### 5.2 structural_node_inventory.json

```
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01",
  "artifact_class": "STRUCTURAL_TRUTH_40_4",
  "artifact_id": "structural_node_inventory",
  "tenant": <str>,
  "run_id": <str>,
  "intake_id": <str>,
  "normalized_at": <ISO8601>,
  "node_count": <int>,
  "isolated_node_count": <int>,
  "nodes": [
    {
      "node_id": <str>,
      "directory": <str>,
      "file_count": <int>,
      "dominant_file_type": <str>,
      "unit_hash": <sha256>,
      "outgoing_edges": <int>,         // DIRECTED edges where this is from_node_id
      "incoming_edges": <int>,         // DIRECTED edges where this is to_node_id
      "undirected_edges": <int>,       // NORMALIZED_UNDIRECTED edges incident to this node
      "total_incident_edges": <int>,   // outgoing + incoming + undirected
      "is_isolated": <bool>
    }
  ]
}
```

### 5.3 structural_topology_log.json

```
{
  "schema_version": "1.0",
  ...
  "input_artifacts": { "from_40_2": [...], "from_40_3": [...], "ig_artifacts_consumed": false },
  "normalization_rules": { ... },       // 11 named rules (see section 4)
  "validation_results": { ... },        // 6 named checks with PASS/FAIL
  "summary": { "nodes", "edges", "isolated_nodes", "duplicates_collapsed" },
  "provenance": { "det_hash_40_2": <sha256>, "det_hash_40_3": <sha256> },
  "exclusions": [],
  "determinism_hash": <sha256>,
  "reconstruction_readiness": {
    "status": "BLOCKED",
    "reason": <str>,
    "deferred_boundary": "IG_LAYER_INDEX_INTEGRATION",
    "this_stream_does_not_solve": true
  }
}
```

---

## 6. DETERMINISM CONTRACT

```
node_lines = sorted("<node_id>:<unit_hash>" for each node)
edge_lines = sorted("<edge_id>:<edge_type>:<from_node_id>:<to_node_id>" for each edge)
det_payload = "\n".join(node_lines + edge_lines)
determinism_hash = SHA256(det_payload.encode("utf-8")).hexdigest()
```

- `normalized_at` inherited from `structural_unit_inventory.json.extracted_at` (no wall-clock calls)
- All lists lexicographically sorted at write time
- Same 40_2/ + 40_3/ inputs always produce identical determinism_hash

---

## 7. RECONSTRUCTION READINESS DECLARATION

```
reconstruction_readiness.status = BLOCKED
deferred_boundary = IG_LAYER_INDEX_INTEGRATION
this_stream_does_not_solve = true
```

L40.4 writes governed structural topology artifacts to `40_4/`. It does NOT modify
`ig/normalized_intake_structure/layer_index.json`. The `compute_reconstruction.sh` validator
requires `L40_2`, `L40_3`, `L40_4` entries in layer_index.json. Those entries remain absent.
Reconstruction constraint is inherited from upstream and persists as: `state=FAIL, score=0`.

A separate explicit stream (`IG_LAYER_INDEX_INTEGRATION`) is required to register the 40.x layers
in the IG layer index.

---

## 8. FAIL-CLOSED CONDITIONS

| Condition | Exit |
|-----------|------|
| `40_2/` directory not found | 1 |
| `40_3/` directory not found | 1 |
| Any of 6 required input artifacts missing | 1 |
| Required field missing in any input artifact | 1 |
| unit_count cross-reference mismatch | 1 |
| edge_count cross-reference mismatch | 1 |
| edge list length mismatch | 1 |
| file_count per unit mismatch | 1 |
| timestamp cross-reference mismatch | 1 |
| edge endpoint references non-existent unit_id | 1 |
| `40_4/` output directory already exists (no-overwrite) | 1 |

---

## 9. HANDOVER CONTRACT

L40.4 is the terminal structural truth layer. No further 40.x processing is defined.

Downstream consumers of `40_4/` artifacts:
- May use `normalized_structural_topology.json` for graph operations (topology traversal, visualization)
- May use `structural_node_inventory.json` for per-node statistics
- May use `structural_topology_log.json` for provenance validation and determinism verification
- MUST NOT treat `40_4/` artifacts as proof of reconstruction capability (explicitly BLOCKED)
- MUST NOT modify upstream 40_2/, 40_3/, or ig/ artifacts based on 40_4/ outputs

The IG_LAYER_INDEX_INTEGRATION deferred boundary must be resolved by an explicitly authorized
stream before reconstruction_state can transition from FAIL.

Authority: PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01 / STRUCTURAL.TRUTH.AUTHORITY.01
