# Execution Report — PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01

## Stream Identity

- **Stream ID:** PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01
- **Classification:** G1 — Architecture-Mutating
- **Branch:** feature/PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01
- **Contract:** PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01

## Pre-Flight

1. Contract loaded: docs/governance/runtime/git_structure_contract.md — YES
2. Current repository: krayu-program-intelligence (k-pi-core) — YES
3. Current branch: feature/PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01 — YES
4. Allowed scope: scripts/pios/ (L1 Ingestion), docs/pios/ (stream closure) — YES
5. Boundary violation planned: NO

### Architecture Memory Preflight

- Canonical state loaded: YES (PIOS_CURRENT_CANONICAL_STATE.md, 2026-05-20)
- Terminology loaded: YES (TERMINOLOGY_LOCK.md, 2026-05-20)
- Branch authorized: YES (feature branch from main, targets L1 Ingestion scope)
- Concept-specific pages loaded: N/A

**Staleness check:**
- Canonical state: current (2026-05-20)
- Terminology: current (2026-05-20)
- Last vault commit: 54085b1 (2026-05-20)

**Compatibility check:**
- Planned terms: "Code-Graph Artifact (40.3s)", "Code-Graph Structural Enrichment" — no collision with locked terms
- Planned concepts: 40.3s artifact class — additive, no conflict with existing 40.3/40.3r
- Planned boundaries: no cross-layer boundary changes

**Preflight result: PASS**

## Problem Statement

The structural pipeline currently produces 0 IMPORTS edges for Flask (and likely all src-layout Python projects). `structural_scanner.py` uses a regex (`IMPORT_RE`) that strips leading dots from relative imports and resolves `module.path` → `module/path.py` at the repo root — but Flask's source lives at `src/flask/`, so relative imports never resolve.

**Live evidence:** Flask has 272 CONTAINS edges and 0 IMPORTS edges in 40.3. Yet Python `ast` finds 167 relative imports across 24 source files — rich intra-package dependency data invisible to the current pipeline.

## Mission

Build a bounded Tier-2 prototype of the code-graph structural enrichment layer. Produce a real 40.3s artifact for Flask, define the artifact contract, assess the indexer landscape, and provide an implementation recommendation.

**Strategic constraint (user-directed):** 40.3s must be a generic code-graph artifact class, not SCIP-specific. SCIP is one possible enricher, not the canonical authority.

## Execution Summary

### Phase 1: Prototype Implementation

Created `scripts/pios/code_graph_feasibility.py` — a standalone ast-based code-graph structural enrichment prototype.

**What `ast` extracts:**

| Relationship | Source | Resolution |
|---|---|---|
| IMPORTS | `ast.ImportFrom` (relative, level > 0) | Package-relative path arithmetic → target file |
| IMPORTS | `ast.ImportFrom` (absolute, level == 0) | Match against known project files (with src-layout) |
| IMPORTS | `ast.Import` | Match against known project files |
| DEFINES_CLASS | `ast.ClassDef` | File → class name |
| DEFINES_FUNCTION | `ast.FunctionDef` / `ast.AsyncFunctionDef` | File → function name (module-level only) |
| INHERITS_UNRESOLVED | `ast.ClassDef.bases` | Symbolic base class name (NOT resolved across files) |

**Key design: relative import resolution.**
`resolve_relative_import()` uses the importing file's directory + `level` (number of dots) to walk up the package hierarchy and resolve the target module. This is why ast succeeds where regex fails — regex strips dots and discards package context.

### Phase 2: Artifact Contract

Defined the 40.3s artifact schema in `code_graph.json`:

- **Indexer-neutral:** `indexer` block declares which tool produced the graph and what it supports
- **Evidence-first:** Every relationship carries `evidence.line` and `evidence.statement`
- **Path-based primary keys:** `source_path`/`target_path` are canonical; `source_node_id`/`target_node_id` are cross-references to 40.2
- **Self-validating:** `validation` block with integrity checks
- **Extensible:** New relationship types and indexers plug into the same schema

### Phase 3: Flask Prototype Results

```
Source root:     src/flask
Python files:    24
Total relationships: 270

  DEFINES_CLASS            53
  DEFINES_FUNCTION         81
  IMPORTS                  95
  INHERITS_UNRESOLVED      41

Validation:
  no_self_references           PASS
  all_relation_types_supported PASS
  all_source_paths_in_files    PASS
  all_target_paths_in_files    PASS
  has_evidence                 PASS

Cross-reference with 40.2:
  inventory_loaded:  True
  inventory_nodes:   287
  matched_targets:   95
  unmatched_paths:   0
```

**IMPORTS improvement:** 0 → 95 (from zero resolved import edges to 95 — Flask's complete intra-package dependency graph)

### Phase 4: Structural Centrality Observations

**In-degree analysis (most-imported files):**

| In-degree | File | Interpretation |
|---|---|---|
| 12 | src/flask/globals.py | Architectural spine — application context provider |
| 9 | src/flask/helpers.py | Core utility module |
| 9 | src/flask/wrappers.py | Request/Response wrappers — interface boundary |
| 8 | src/flask/__init__.py | Package entry point — re-export hub |
| 7 | src/flask/sansio/app.py | Protocol-independent app base — architectural foundation |
| 6 | src/flask/app.py | Main Flask application class |
| 5 | src/flask/ctx.py | Context management — request/app contexts |
| 5 | src/flask/signals.py | Event signaling infrastructure |
| 5 | src/flask/sansio/scaffold.py | Blueprint/scaffold base |
| 4 | src/flask/templating.py | Template rendering |

**Isolated files (0 inbound IMPORTS):**
- `src/flask/__main__.py` — CLI entry point (expected)
- `src/flask/views.py` — Class-based views (potential underutilization signal)

**Observation:** The in-degree ranking reveals Flask's architectural spine: `globals.py` → `helpers.py` → `wrappers.py` form the most-depended-upon core. This structural centrality data is invisible from CONTAINS edges alone. A future structural centrality metric could use this to weight DOM significance.

## Indexer Landscape Assessment

| Indexer | Viability | Notes |
|---|---|---|
| **Python `ast`** | **VIABLE NOW** | stdlib, 3.9.6 compatible. File-level imports + class defs + function defs + unresolved inheritance. Cannot do cross-file symbol resolution. |
| **scip-python** | **POSSIBLE, NOT YET TESTED** | Requires npm install + Node.js (v20 available), Python 3.10+ (system 3.9.6, needs venv). Rich: definitions, references, inheritance, type hierarchy. Protobuf format. |
| **Jedi** | **BLOCKED** | Requires Python 3.10+ (system 3.9.6). Project-aware references. Would need venv. |
| **Pyright** | **NOT VIABLE** | Type checker, no graph export format. |
| **Rope** | **NOT VIABLE** | Refactoring tool, no structured output. |

**Capability gap between ast and SCIP:**

| Capability | ast | SCIP |
|---|---|---|
| Relative import resolution | YES | YES |
| Absolute import resolution (intra-project) | YES | YES |
| Cross-file symbol resolution | NO | YES |
| REFERENCES (who uses symbol X) | NO | YES |
| IMPLEMENTS (interface realization) | NO | YES |
| INHERITS (resolved, cross-file) | NO | YES |
| Type hierarchy | NO | YES |
| Dependencies: None | YES | NO (npm, venv) |

**Assessment:** `ast` is sufficient for Tier-2 structural enrichment — resolved import graphs, class/function definitions, and symbolic inheritance. SCIP would add cross-file symbol resolution (which file's `App` does `Flask` actually inherit from?) but at significant infrastructure cost. Recommended as optional Tier-3 enricher if/when Python 3.10+ is available.

## Feasibility Verdict

**VIABLE.**

ast-based code-graph structural enrichment produces useful resolved IMPORTS edges that the current regex scanner cannot. The 40.3s artifact contract is validated. The prototype is deterministic, indexer-neutral, and evidence-first.

## Implementation Recommendation

1. **Next stream:** `PI.PATHA.CODE-GRAPH-PIPELINE-INTEGRATION.01` — integrate ast-based code-graph as pipeline Phase 3.6, between structural relevance classification (Phase 3.5) and CEU grounding (Phase 4). Produces 40.3s artifact for every pipeline run.

2. **SCIP enrichment:** Separate optional stream. Not prerequisite. If/when Python 3.10+ is available, SCIP could enrich 40.3s with REFERENCES and resolved INHERITS relationships through the same schema — the indexer block would change from `python-ast` to `scip-python`, and additional relationship types would appear.

3. **Structural centrality:** After pipeline integration proves 40.3s reliability across multiple clients, a subsequent stream could implement in-degree-weighted DOM significance or structural centrality metrics. NOT before data trustworthiness is established.

4. **Evidence-Ranked Projection:** Depends on structural centrality being computed from trustworthy code-graph data. At least two streams away: pipeline integration → structural centrality → evidence-ranked projection.

## Verification Log

| Check | Result |
|---|---|
| Flask feasibility run: >0 IMPORTS edges | PASS (95 IMPORTS) |
| All IMPORTS target_path exist in intake | PASS |
| Cross-reference: all node_ids match 40.2 | PASS (95 matched, 0 unmatched) |
| Determinism: two runs produce identical structure | PASS (only generated_at differs) |
| CREATE_ONLY: rejects overwrite | PASS |
| --dry-run: no files written | PASS |
| Schema compliance: output matches 40.3s contract | PASS |
| No pipeline script modified | PASS |
| Next.js build: clean | PASS |
| Indexer neutrality: schema accepts any indexer name | PASS |
