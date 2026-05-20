# Implementation Semantics — PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| `discover_source_root` | code_graph_feasibility.py | Find primary Python package within intake | REUSABLE — any Python repo |
| `find_python_files` | code_graph_feasibility.py | Enumerate Python source files under source root | REUSABLE |
| `resolve_relative_import` | code_graph_feasibility.py | Convert relative import (level + module) to target path | REUSABLE — core resolution primitive |
| `resolve_absolute_import` | code_graph_feasibility.py | Match absolute import against known project files | REUSABLE |
| `extract_relationships` | code_graph_feasibility.py | Extract all code-graph relationships from one .py file | REUSABLE |
| `cross_reference_inventory` | code_graph_feasibility.py | Populate node_ids by matching paths against 40.2 | REUSABLE |
| `validate_graph` | code_graph_feasibility.py | Self-integrity checks on code-graph | REUSABLE |
| `compute_in_degree` | code_graph_feasibility.py | In-degree analysis for structural centrality | REUSABLE |
| `build_artifact` | code_graph_feasibility.py | Assemble 40.3s JSON artifact | REUSABLE |

## 2. Input Contracts

### Intake Source

- **Path:** `clients/<client>/psee/runs/<run>/intake/canonical_repo/`
- **Content:** Extracted repository source code
- **Consumed fields:** Python files (`.py` extension), `__init__.py` presence for package detection

### 40.2 Node Inventory (Optional)

- **Path:** `clients/<client>/psee/runs/<run>/structure/40.2/structural_node_inventory.json`
- **Consumed fields:** `nodes[].path`, `nodes[].node_id`
- **If absent:** Cross-referencing skipped, source_node_id/target_node_id remain null

### Source Manifest

- **Path:** `clients/<client>/sources/source_01/source_manifest.json`
- **Consumed fields:** Not directly consumed; presence validates run_dir structure

## 3. Output Contracts

### 40.3s Code Graph Artifact

- **Path:** `clients/<client>/psee/runs/<run>/structure/40.3s/code_graph.json`
- **Schema:**

```json
{
  "contract_id": "string",
  "artifact_class": "40.3s",
  "client_id": "string",
  "run_id": "string",
  "generated_at": "ISO8601",
  "indexer": {
    "name": "string",
    "version": "string",
    "capabilities": ["string"]
  },
  "source_root": "string",
  "file_count": "integer",
  "relationship_summary": {
    "<RELATION_TYPE>": "integer",
    "total": "integer"
  },
  "relationships": [
    {
      "source_path": "string",
      "target_path": "string | null",
      "source_node_id": "string | null",
      "target_node_id": "string | null",
      "relation_type": "string",
      "symbol": "string (optional, for DEFINES_*/INHERITS_*)",
      "evidence": {
        "line": "integer",
        "statement": "string"
      }
    }
  ],
  "validation": {
    "no_self_references": "boolean",
    "all_relation_types_supported": "boolean",
    "all_source_paths_in_files": "boolean",
    "all_target_paths_in_files": "boolean",
    "has_evidence": "boolean"
  },
  "cross_reference": {
    "inventory_loaded": "boolean",
    "inventory_nodes": "integer",
    "matched_targets": "integer",
    "unmatched_paths": ["string"]
  }
}
```

### Relationship Types

| Type | Authority Level | Description |
|---|---|---|
| IMPORTS | STRUCTURAL — resolved file-to-file dependency | Source file imports from target file |
| DEFINES_CLASS | STRUCTURAL — class definition evidence | Source file defines named class |
| DEFINES_FUNCTION | STRUCTURAL — function definition evidence | Source file defines module-level function |
| INHERITS_UNRESOLVED | SYMBOLIC — unresolved inheritance evidence | Class declares base class by name (NOT cross-file resolved) |

## 4. Calibration Assumptions

| Parameter | Value | Governed vs Tuned |
|---|---|---|
| Source root heuristic | Deepest `__init__.py` directory, excluding tests | TUNED — may need adjustment for non-standard layouts |
| Module-level functions only | Functions at module scope, not methods | GOVERNED — methods are class-internal, not structural relationships |
| Import deduplication | One IMPORTS edge per unique (source, target) pair | GOVERNED — prevents edge inflation from multiple `from X import a, b, c` |
| Statement truncation | First 3 names in import statement | TUNED — cosmetic, for evidence readability |

## 5. Extension Points

### Adding a New Indexer

The 40.3s schema is indexer-neutral. A new indexer:

1. Sets `indexer.name` to its identifier (e.g., `"scip-python"`, `"jedi"`)
2. Sets `indexer.version` to its version
3. Declares `indexer.capabilities` — the relationship types it can produce
4. Produces relationships with the same schema
5. May introduce new `relation_type` values (e.g., `"REFERENCES"`, `"IMPLEMENTS"`, `"INHERITS"` for resolved inheritance)

Consumers filter by `indexer.capabilities` or by `relation_type` to handle varying enrichment depth.

### Adding a New Relationship Type

1. Add to `SUPPORTED_RELATION_TYPES` in the producing script
2. Update `indexer.capabilities`
3. Relationships follow the same schema — `source_path`, `target_path`, `relation_type`, `evidence`

### Pipeline Integration (Future Stream)

When integrated into `run_client_pipeline.py`:
- Insert as Phase 3.6 (after Phase 3.5 structural relevance classification)
- Consumes intake source + 40.2 inventory
- Produces `structure/40.3s/code_graph.json`
- Downstream consumers (DOM, pressure) may optionally read 40.3s for structural centrality weighting

## 6. Module Responsibility Map

| File | Owns | Does NOT Own |
|---|---|---|
| code_graph_feasibility.py | ast-based relationship extraction, import resolution, 40.3s artifact assembly, self-validation | Pipeline orchestration, DOM derivation, pressure computation, SCIP indexing |
| structural_scanner.py | 40.2 node inventory, 40.3 topology (CONTAINS + regex IMPORTS) | Code-graph structural enrichment (40.3s) |
| structural_relevance_classifier.py | 40.2r/40.3r filtered views, SRC classification | Code-graph extraction |
| run_client_pipeline.py | Pipeline phase orchestration | Individual phase implementation |
