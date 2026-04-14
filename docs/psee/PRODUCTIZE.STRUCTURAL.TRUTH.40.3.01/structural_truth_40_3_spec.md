# Structural Truth 40.3 Specification
# PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01

- Date: 2026-04-14
- Stream: PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01
- Branch: feature/structural-truth-40-3
- Execution engine: Claude Code (claude-sonnet-4-6)
- Authority: STRUCTURAL.TRUTH.AUTHORITY.01 (locked)

---

## SECTION 1 — PRINCIPLES

### 1.1 Core Principle

We are not inventing relationships. We are deriving structural relationships from governed evidence.

L40.3 derives all structurally grounded relationships between Canonical Evidence Units (CEUs) established by L40.2. Every edge must be traceable to a specific evidence field in the 40.2 artifact set. No claim is made without evidence.

No semantic interpretation. No domain assignment. No capability inference. No scoring. No hidden graph storytelling.

### 1.2 Upstream Dependency

L40.3 depends on:
- `pios structural extract` (PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01) — L40.2 structural unit inventory

L40.3 may not begin until `clients/<tenant>/psee/runs/<run_id>/40_2/` exists with both primary input artifacts present.

### 1.3 Scope Boundary

This stream covers **40.3 only** — structural relationship derivation (productized form: structural edge extraction).

It does not cover:
- 40.2 (structural unit extraction)
- 40.4 (telemetry surface definition)
- Any modification of IG layer_index.json
- Any modification of S2–S4 or GA logic

### 1.4 Declared Constraint (Inherited)

The reconstruction constraint from upstream streams remains:
- `reconstruction_state.state = FAIL`
- Score = 0
- Root cause: `compute_reconstruction.sh` requires `L40_2`, `L40_3`, `L40_4` layers in IG `layer_index.json`
- This stream produces `40_3/` governance artifacts but does NOT modify the IG `layer_index.json`

---

## SECTION 2 — INPUT CONTRACT

### 2.1 Source Directory

All inputs are read from:
```
clients/<tenant>/psee/runs/<run_id>/40_2/
```

### 2.2 Authoritative Consumed Files

| file | class | justification |
|------|-------|---------------|
| `structural_unit_inventory.json` | primary | CEU definitions with directory, file_types_present, unit_hash — source for DIRECTORY_CONTAINS, DIRECTORY_SIBLING, STRUCTURAL_TYPE_AFFINITY edges; provides deterministic timestamp via extracted_at |
| `file_structural_map.json` | primary | per-file sha256 + unit_id — sole evidence source for CONTENT_DUPLICATE edges |

`structural_extraction_log.json` is not consumed — timestamp is inherited from `structural_unit_inventory.json.extracted_at`.

### 2.3 ig/ Artifacts: NOT Consumed

All 4 edge types are derivable from 40_2 outputs alone. ig/ artifacts are explicitly excluded from L40.3 consumption. Confirmed: no ig/ file is read by `cmd_structural_relate`.

### 2.4 Source of Truth When Fields Overlap

| field | authoritative source |
|-------|---------------------|
| Deterministic timestamp | `structural_unit_inventory.json.extracted_at` (traces to `intake_record.created_at`) |
| CEU identity | `structural_unit_inventory.json.units[].unit_id` |
| Directory paths | `structural_unit_inventory.json.units[].directory` |
| File types per unit | `structural_unit_inventory.json.units[].file_types_present` |
| SHA-256 per file | `file_structural_map.json.entries[].sha256` |
| File-to-unit mapping | `file_structural_map.json.entries[].unit_id` |

### 2.5 directory="(root)" Sentinel

`structural_unit_inventory.json` stores root-level CEUs as `"directory": "(root)"`. This is a display sentinel; the actual normalized path is `""` (empty string). L40.3 uses the helper `_norm_ceu_dir()` which converts `"(root)"` → `""` for all path computations. The original `"(root)"` value is preserved in evidence fields for readability.

### 2.6 Forbidden Inputs

- Any file outside `clients/<tenant>/psee/runs/<run_id>/40_2/`
- ig/ artifacts
- Raw source files
- Any prior 40_3/ output
- Any semantic, capability, or domain artifact

---

## SECTION 3 — STRUCTURAL RELATIONSHIP COMMAND CONTRACT

### 3.1 Command

```
pios structural relate --tenant <tenant> --run-id <run_id> [--debug]
```

### 3.2 Arguments

| argument | required | description |
|----------|----------|-------------|
| `--tenant` | yes | Tenant/client identifier matching the run directory |
| `--run-id` | yes | Run identifier — must have an existing `40_2/` directory |
| `--debug` | no | Enable debug logging |

### 3.3 Preconditions (Fail-Closed)

| condition | enforcement |
|-----------|-------------|
| `clients/<tenant>/psee/runs/<run_id>/40_2/` must exist | FAIL_CLOSED (exit 1) |
| `structural_unit_inventory.json` present in 40_2/ | FAIL_CLOSED (exit 1) |
| `structural_unit_inventory.json` has `units`, `intake_id`, `extracted_at` fields | FAIL_CLOSED (exit 1) |
| Each unit in `units[]` has `unit_id`, `directory`, `file_types_present` | FAIL_CLOSED (exit 1) |
| `file_structural_map.json` present in 40_2/ | FAIL_CLOSED (exit 1) |
| `file_structural_map.json` has `entries` field | FAIL_CLOSED (exit 1) |
| `clients/<tenant>/psee/runs/<run_id>/40_3/` must NOT exist | FAIL_CLOSED (no-overwrite guard) |

### 3.4 Zero-Edge Case

If no relationships of any type can be derived (e.g., single-unit source with no cross-unit structure), the command succeeds. All output artifacts are written with `edge_count: 0` and empty `edges[]` lists. This is valid structural truth — not a failure.

---

## SECTION 4 — DERIVATION RULES

### 4.1 Edge Type Definitions and Evidence Basis

#### DIRECTORY_CONTAINS

**Condition**: CEU-Y's immediate parent directory equals CEU-X's normalized directory.

```
parent_of(Y) = os.path.dirname(norm_ceu_dir(Y.directory))
edge exists iff: parent_of(Y) == norm_ceu_dir(X.directory)
```

**Rules**:
- Root CEU (normalized dir = `""`) may be a parent
- Root CEU has no parent → excluded from child-side computation
- Only DIRECT parent-child (one level) — no transitive edges
- At most one DIRECTORY_CONTAINS edge per child (each directory has exactly one immediate parent)
- If a CEU's parent directory does not correspond to any CEU, no edge is emitted (no implicit synthetic parent units)

**Direction**: DIRECTED (from_unit = parent, to_unit = child)

**Evidence source**: `structural_unit_inventory.json` — `directory` field of each unit

#### DIRECTORY_SIBLING

**Condition**: Two non-root CEUs have the same immediate parent directory.

```
parent_of(X) = os.path.dirname(norm_ceu_dir(X.directory))
parent_of(Y) = os.path.dirname(norm_ceu_dir(Y.directory))
edge exists iff: parent_of(X) == parent_of(Y) and X.unit_id != Y.unit_id
and norm_ceu_dir(X.directory) != "" and norm_ceu_dir(Y.directory) != ""
```

**Rules**:
- Root CEU (`norm_ceu_dir = ""`) is excluded — it has no parent, therefore no siblings by this rule
- Undirected: normalized by unit_id lex order (`lower unit_id = from_unit_id`)
- One edge per pair, regardless of how many common-parent paths exist

**Direction**: NORMALIZED_UNDIRECTED

**Evidence source**: `structural_unit_inventory.json` — `directory` field of each unit

#### STRUCTURAL_TYPE_AFFINITY

**Condition**: Two CEUs share at least one file type in their `file_types_present` arrays.

```
shared_types = sorted(set(X.file_types_present) ∩ set(Y.file_types_present))
edge exists iff: len(shared_types) > 0
```

**Rules**:
- Applies to all pairs of CEUs (including root CEU)
- `shared_types` field records the exact intersection (sorted, deduplicated)
- Structural observation only: "these units contain files of the same structural type." No functional relationship is inferred.
- Undirected: normalized by unit_id lex order

**Direction**: NORMALIZED_UNDIRECTED

**Evidence source**: `structural_unit_inventory.json` — `file_types_present` array of each unit

#### CONTENT_DUPLICATE

**Condition**: At least one file in CEU-X and at least one file in CEU-Y share the same SHA-256 hash.

```
sha_to_unit_files = {sha: {unit_id: [paths]}} for all entries in file_structural_map
edge exists iff: for some sha, len(sha_to_unit_files[sha]) >= 2 distinct unit_ids
```

**Rules**:
- One edge per unit pair, even if multiple sha256 matches exist — all matching pairs recorded in `evidence.duplicate_file_pairs`
- For each sha256 per unit pair, records the lex-first matching file path from each unit
- Structural observation only: "these units contain hash-identical files." No semantic relationship inferred.
- Undirected: normalized by unit_id lex order

**Direction**: NORMALIZED_UNDIRECTED

**Evidence source**: `file_structural_map.json` — `sha256` and `unit_id` fields

### 4.2 Edge ID Assignment

1. Collect all edges across all 4 types
2. Sort by `(edge_type, from_unit_id, to_unit_id)` lexicographically
3. Assign `EDGE-001`, `EDGE-002`, ... sequentially

Same edge set → same sort order → same IDs. Deterministic.

### 4.3 Deduplication

One edge per `(edge_type, from_unit_id, to_unit_id)` triple. Each derivation function produces at most one edge per pair per type. No post-hoc deduplication required — rules are mutually exclusive per triple.

### 4.4 Evidence Normalization for Cross-Unit File Pairs

For CONTENT_DUPLICATE, when a sha256 appears in multiple files within the same unit, the **lex-first** file path is selected as the representative for that unit. This ensures determinism when the same hash has multiple file instances in one unit.

### 4.5 Exclusion Logging

Structural scenarios that produce zero edges are not exclusions — they are valid results. Explicit exclusions (in `structural_relationship_log.json.exclusions[]`) are reserved for:
- CEU fields that prevent derivation (missing `unit_id`, `directory`, or `file_types_present`)
- File map entries with empty `sha256` or `unit_id` (skipped from CONTENT_DUPLICATE computation)

If no such problems occur, `exclusions[]` is empty.

---

## SECTION 5 — OUTPUT STRUCTURE

All outputs written to: `clients/<tenant>/psee/runs/<run_id>/40_3/`

### 5.1 structural_relationship_inventory.json

**Purpose**: Summary of all structural units and their relationship participation counts, plus per-edge-type counts.

**Required fields**:

| field | type | description |
|-------|------|-------------|
| `schema_version` | string | "1.0" |
| `stream` | string | "PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01" |
| `artifact_class` | string | "STRUCTURAL_TRUTH_40_3" |
| `artifact_id` | string | "structural_relationship_inventory" |
| `tenant` | string | tenant identifier |
| `run_id` | string | run identifier |
| `intake_id` | string | from structural_unit_inventory.json |
| `derived_at` | string | from structural_unit_inventory.json.extracted_at |
| `source_40_2_dir` | string | relative path to 40_2 input dir |
| `unit_count` | integer | total CEU count |
| `edge_count` | integer | total edge count |
| `edge_type_counts` | object | count per edge type (all 4 types always present, 0 if none) |
| `unit_summaries` | array | per-unit: unit_id, directory, edges_as_source, edges_as_target, total_edges |

### 5.2 structural_edge_map.json

**Purpose**: Complete list of all structural edges with evidence.

**Required fields** (top-level):

| field | type | description |
|-------|------|-------------|
| `schema_version` | string | "1.0" |
| `stream` | string | "PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01" |
| `artifact_class` | string | "STRUCTURAL_TRUTH_40_3" |
| `artifact_id` | string | "structural_edge_map" |
| `tenant` | string | |
| `run_id` | string | |
| `intake_id` | string | |
| `derived_at` | string | |
| `edge_count` | integer | |
| `edges` | array | all edges in sort order |

**Per edge required fields**:

| field | type | description |
|-------|------|-------------|
| `edge_id` | string | EDGE-NNN |
| `edge_type` | string | one of the 4 defined types |
| `from_unit_id` | string | source CEU |
| `to_unit_id` | string | target CEU |
| `direction` | string | "DIRECTED" or "NORMALIZED_UNDIRECTED" |
| `evidence` | object | type-specific evidence fields |

**Evidence fields by edge type**:

| edge_type | evidence fields |
|-----------|----------------|
| DIRECTORY_CONTAINS | source, basis, parent_directory, child_directory |
| DIRECTORY_SIBLING | source, basis, shared_parent_directory, unit_a_directory, unit_b_directory |
| STRUCTURAL_TYPE_AFFINITY | source, basis, shared_types, note |
| CONTENT_DUPLICATE | source, basis, duplicate_file_pairs, note |

### 5.3 structural_relationship_log.json

**Purpose**: Auditable log of derivation rules, input contract, edge type definitions, exclusions, and determinism proof.

**Required fields**:

| field | description |
|-------|-------------|
| standard header fields | schema_version, stream, artifact_class, artifact_id, tenant, run_id, intake_id, derived_at |
| `input_artifacts` | primary (2 files), support (empty), ig_artifacts_consumed (false), justification |
| `edge_types` | definition block for each of the 4 types |
| `derivation_rules` | edge_id_assignment, undirected_normalization, deduplication, timestamp, determinism_hash formula |
| `summary` | units, edges_total, edges_by_type |
| `exclusions` | list of excluded items with reason |
| `ambiguities` | list of logged ambiguities (empty if none) |
| `determinism_hash` | SHA256 proof value |

---

## SECTION 6 — DETERMINISM CONTRACT

### 6.1 Guaranteed Determinism

Given identical L40.2 input artifacts (`structural_unit_inventory.json`, `file_structural_map.json`):

- All 3 L40.3 output artifacts are identical across runs
- `determinism_hash` is identical across runs
- Edge IDs are identical across runs
- Edge ordering is identical across runs

### 6.2 Determinism Sources

| output field | determinism basis |
|-------------|------------------|
| `derived_at` | `structural_unit_inventory.json.extracted_at` (frozen at intake creation) |
| Edge ordering | Lexicographic sort of (edge_type, from_unit_id, to_unit_id) — content-addressed |
| Edge IDs | Sequential from stable sort — content-addressed |
| Unit summaries | Sorted by unit_id |
| `shared_types` | Sorted intersection of file_types_present sets |
| `duplicate_file_pairs` | Sorted by sha256 |
| `determinism_hash` | SHA256 of sorted `<edge_type>:<from>:<to>` pairs |

### 6.3 Determinism Hash Formula

```
determinism_hash = SHA256(
    "\n".join(
        f"{e['edge_type']}:{e['from_unit_id']}:{e['to_unit_id']}"
        for e in edges_sorted_by_type_from_to
    ).encode("utf-8")
)
```

If `edges` is empty: `determinism_hash = SHA256("".encode()) = e3b0c44...`

### 6.4 Determinism Verification (Two-Run Test)

Verified: same intake → same L40.2 → same L40.3 determinism_hash across two independent runs:
- `run_st40_validation_01`: `ee3f5b03501eb4f9651898b2bb357a6aef5c7347a2cd7d8f3c939b3ca698a338`
- `run_st40_validation_02`: `ee3f5b03501eb4f9651898b2bb357a6aef5c7347a2cd7d8f3c939b3ca698a338`

---

## SECTION 7 — HANDOVER CONTRACT

### 7.1 What L40.3 Guarantees

- Every CEU established in L40.2 is represented in `unit_summaries` (even if it has 0 edges)
- Every edge is backed by explicit, named evidence fields traceable to L40.2 artifacts
- All `DIRECTORY_CONTAINS` edges are direct parent-child (one structural level)
- All `DIRECTORY_SIBLING` edges connect CEUs at the same directory level under the same parent
- All `STRUCTURAL_TYPE_AFFINITY` edges are backed by named shared file types in `shared_types`
- All `CONTENT_DUPLICATE` edges are backed by named sha256 values and file pairs
- Output is reproducible from the same L40.2 inputs

### 7.2 What L40.3 Does NOT Claim

- No entity identity — CEUs are structural groupings, not semantic entities
- No functional relationships — STRUCTURAL_TYPE_AFFINITY and CONTENT_DUPLICATE edges do not imply functional dependency or design relationship
- No dependency direction for NORMALIZED_UNDIRECTED edges — direction assignment is lexicographic by unit_id only, not structural significance
- No knowledge of what files contain (content analysis is out of scope)
- No coverage of 40.4 telemetry dimensions
- No modification of IG layer_index.json — reconstruction constraint remains

### 7.3 What a Future L40.4 May Rely On

- `structural_edge_map.json.edges[]` — all edges with type, from/to unit_id, evidence
- `structural_relationship_inventory.json.unit_summaries[]` — per-CEU edge participation counts
- `structural_relationship_log.json.determinism_hash` — derivation proof
- The set of CEU identifiers from L40.2 `structural_unit_inventory.json` (via L40.3's `unit_summaries`)

### 7.4 What a Future L40.4 Must NOT Assume

- L40.4 must NOT interpret `STRUCTURAL_TYPE_AFFINITY` as functional dependency
- L40.4 must NOT interpret `CONTENT_DUPLICATE` as intentional code sharing or logical coupling
- L40.4 must NOT assume edge direction for `NORMALIZED_UNDIRECTED` edges implies structural significance
- L40.4 must NOT assume entity graph completeness — L40.3 derives only what 40.2 evidence supports
- L40.4 must NOT treat CEU unit_id as stable across different run_ids — IDs are per-run, not global

### 7.5 Additive Status

L40.3 derivation is additive:
- Does not modify `40_2/` artifacts
- Does not modify `ig/` artifacts
- Does not modify `package/` artifacts
- Does not affect any existing CLI command behavior

---

## SECTION 8 — CLI SURFACE

### 8.1 Command

```
pios structural relate --tenant <tenant> --run-id <run_id> [--debug]
```

### 8.2 Registration

Registered as the `relate` subcommand under the `structural` top-level command group.

```
pios structural extract   # L40.2
pios structural relate    # L40.3 (this stream)
```

### 8.3 Debug Output

When `--debug` is passed, logs to stderr:
- Resolved `40_2` dir
- `intake_id`, `extracted_at`, unit count from structural_unit_inventory.json
- File map entry count from file_structural_map.json
- Resolved `40_3` output dir
- Per-edge-type count: DIRECTORY_CONTAINS, DIRECTORY_SIBLING, STRUCTURAL_TYPE_AFFINITY, CONTENT_DUPLICATE
- Total edge count
- `determinism_hash`
- Each artifact write confirmation

---

## SECTION 9 — END-TO-END FLOW

Full productized flow from source to L40.3:

```
# Step 1: Governed intake
pios intake create --source-path <path> --tenant <tenant> --intake-id <intake_id>

# Step 2: IG materialization
pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id>

# Step 3: L40.2 structural extraction
pios structural extract --tenant <tenant> --run-id <run_id>
# Output: clients/<tenant>/psee/runs/<run_id>/40_2/

# Step 4: L40.3 structural relationship derivation  [THIS STREAM]
pios structural relate --tenant <tenant> --run-id <run_id>
# Output: clients/<tenant>/psee/runs/<run_id>/40_3/
#   structural_relationship_inventory.json
#   structural_edge_map.json
#   structural_relationship_log.json
```

### 9.1 Output Path Relationships

```
clients/<tenant>/psee/runs/<run_id>/
├── ig/                             ← pios ig materialize
├── 40_2/                           ← pios structural extract
│   ├── structural_unit_inventory.json
│   ├── file_structural_map.json
│   └── structural_extraction_log.json
├── 40_3/                           ← pios structural relate  [THIS STREAM]
│   ├── structural_relationship_inventory.json
│   ├── structural_edge_map.json
│   └── structural_relationship_log.json
└── package/                        ← pios bootstrap, emit, compute
```

### 9.2 Continuing Pipeline

L40.3 runs independently of the S0–S4 PSEE/GAUGE pipeline. After L40.3:
- S0–S4 pipeline (`pios ledger create`, `pios bootstrap`, etc.) proceeds with IG inputs unchanged
- Future 40.4 (`pios structural surface`) would read from 40_3/ to derive telemetry dimensions
- Reconstruction constraint remains until a layer-enriched IG path defines L40_2/L40_3/L40_4 in layer_index.json
