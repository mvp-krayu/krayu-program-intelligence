# Structural Truth 40.2 Specification
# PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01

- Date: 2026-04-14
- Stream: PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01
- Branch: feature/structural-truth-40-2
- Execution engine: Claude Code (claude-sonnet-4-6)
- Authority: STRUCTURAL.TRUTH.AUTHORITY.01 (locked)

---

## SECTION 1 — PRINCIPLES

### 1.1 Core Principle

We are not inventing structure. We are extracting structural truth from governed evidence.

L40.2 classifies every admitted file from the governed IG runtime package into a typed structural unit inventory. Classification is deterministic, evidence-only, and structural-only.

No semantic labels. No domain assignment. No capability inference. No entity graph. No scoring logic.

### 1.2 Upstream Dependency

L40.2 depends on:
- `pios intake create` (PRODUCTIZE.RAW.SOURCE.INTAKE.01) — governed hash bundle
- `pios ig materialize` (PRODUCTIZE.IG.FROM.INTAKE.01) — IG runtime package

L40.2 may not begin until a valid IG runtime package exists at `clients/<tenant>/psee/runs/<run_id>/ig/`.

### 1.3 Scope Boundary

This stream covers **40.2 only** — Evidence Classification (productized form: structural unit extraction).

It does not cover:
- 40.3 (structural entity graph)
- 40.4 (telemetry surface definition)
- Any modification of IG layer_index.json
- Any modification of S2–S4 or GA logic

### 1.4 Declared Constraint (Inherited)

The declared reconstruction constraint from PRODUCTIZE.IG.FROM.INTAKE.01 remains:
- `pios emit reconstruction` produces `reconstruction_state.state = FAIL`
- Root cause: `compute_reconstruction.sh` requires `L40_2`, `L40_3`, `L40_4` layers in IG `layer_index.json`
- L40.2 produces `40_2/` governance artifacts but does NOT modify the IG `layer_index.json`
- This constraint is not resolved by this stream
- Score = 0 for intake-sourced runs until a layer-enriched IG path is defined

---

## SECTION 2 — INPUT CONTRACT

### 2.1 Source Directory

All inputs are read from:
```
clients/<tenant>/psee/runs/<run_id>/ig/
```

This directory is the governed IG runtime package produced by `pios ig materialize`.

### 2.2 Authoritative Consumed Files

| file | class | justification |
|------|-------|---------------|
| `raw_input.json` | primary | Source identity declaration; provides `intake_id`, `materialized_at` (deterministic timestamp), `source_type` |
| `structure_map.json` | primary | Per-file sha256 and size_bytes — required for unit hash computation and structural identity |
| `ingestion_log.json` | primary | Admission decision per file — authoritative gate for which files enter structural extraction |
| `admissibility_log.json` | support | `source_path`, `layer`, `governance_authority` per file — enriches file_structural_map.json entries; not required for extraction logic |

### 2.3 Optional Support Files

`admissibility_log.json` is read if present. If absent, extraction proceeds with empty `source_path` and `layer` fields in file_structural_map.json. No fail-closed.

No other IG files are consumed.

### 2.4 Source of Truth When Fields Overlap

| field | authoritative source |
|-------|---------------------|
| Deterministic timestamp | `raw_input.json.materialized_at` (which traces to `intake_record.created_at`) |
| File path (normalized) | `ingestion_log.json.entries[].path` |
| SHA-256 hash per file | `structure_map.json.entries[].sha256` |
| Size bytes per file | `structure_map.json.entries[].size_bytes` |
| Admission decision | `ingestion_log.json.entries[].decision` |
| Source path | `admissibility_log.json.entries[].source_path` (support only) |

### 2.5 Forbidden Inputs

- Any file outside `clients/<tenant>/psee/runs/<run_id>/ig/`
- Raw source files from the original source_path
- Any prior 40_2/ output from a previous run
- Any semantic, capability, or domain artifact
- Any external data source

---

## SECTION 3 — STRUCTURAL EXTRACTION COMMAND CONTRACT

### 3.1 Command

```
pios structural extract --tenant <tenant> --run-id <run_id> [--debug]
```

### 3.2 Arguments

| argument | required | description |
|----------|----------|-------------|
| `--tenant` | yes | Tenant/client identifier matching the run directory |
| `--run-id` | yes | Run identifier — must have an existing `ig/` directory |
| `--debug` | no | Enable debug logging |

### 3.3 Preconditions (Fail-Closed)

| condition | enforcement |
|-----------|-------------|
| `clients/<tenant>/psee/runs/<run_id>/ig/` must exist | FAIL_CLOSED (exit 1) |
| `raw_input.json` present in ig/ | FAIL_CLOSED (exit 1) |
| `raw_input.json.intake_id` present | FAIL_CLOSED (exit 1) |
| `raw_input.json.materialized_at` present | FAIL_CLOSED (exit 1) |
| `raw_input.json.source_type` present | FAIL_CLOSED (exit 1) |
| `structure_map.json` present in ig/ | FAIL_CLOSED (exit 1) |
| `structure_map.json.entries` present | FAIL_CLOSED (exit 1) |
| `ingestion_log.json` present in ig/ | FAIL_CLOSED (exit 1) |
| `ingestion_log.json.entries` present | FAIL_CLOSED (exit 1) |
| `clients/<tenant>/psee/runs/<run_id>/40_2/` must NOT exist | FAIL_CLOSED (no-overwrite guard) |

### 3.4 Non-Fail Conditions (Logged as Exclusions)

| condition | handling |
|-----------|----------|
| `UNKNOWN_FILE_TYPE` (unrecognized extension/basename) | File included in extraction; type classified as UNKNOWN_FILE_TYPE; logged in extraction_log |
| `DECISION_NOT_ADMITTED` | File excluded from structural map; reason logged in exclusions[] |
| `NOT_IN_STRUCTURE_MAP` | Admitted file absent from structure_map.json; excluded; reason logged |
| `admissibility_log.json` absent | Extraction proceeds; source_path/layer fields empty |

---

## SECTION 4 — DERIVATION RULES

### 4.1 Candidate Discovery

All files from `ingestion_log.json.entries[]` with `decision == "ADMITTED"` are candidate structural files.

Files with `decision != "ADMITTED"` are excluded and logged in `structural_extraction_log.json.exclusions`.

### 4.2 Hash Cross-Reference

For each admitted file path, the corresponding sha256 and size_bytes are looked up from `structure_map.json.entries[]` by matching `path` field.

If a path is ADMITTED in ingestion_log but absent from structure_map, it is excluded with reason `NOT_IN_STRUCTURE_MAP` (logged).

### 4.3 File Type Classification (Structural Identity Only)

Classification is purely structural — based on file extension and basename. No content inspection. No semantic inference.

**Step 1 — basename lookup (case-insensitive)**:
Check `os.path.basename(path).lower()` against `_BASENAME_TO_FILE_TYPE`. Exact matches override extension lookup.
Examples: `makefile` → `BUILD_SCRIPT`, `dockerfile` → `CONTAINER_DEF`, `readme` → `TEXT_FILE`

**Step 2 — extension lookup (case-insensitive)**:
Check `os.path.splitext(basename)[1].lower()` against `_EXT_TO_FILE_TYPE`.
Examples: `.py` → `PYTHON_SOURCE`, `.json` → `JSON_CONFIG`, `.md` → `MARKDOWN_DOC`

**Step 3 — default**:
If neither match: `UNKNOWN_FILE_TYPE`. File is not excluded; type is recorded as-is.

Classification tables `_EXT_TO_FILE_TYPE` and `_BASENAME_TO_FILE_TYPE` are locked in this stream. No repo-specific exceptions.

### 4.4 CEU Grouping (Structural Unit Assignment)

Files are grouped by their immediate parent directory path (normalized with `/`).

- Root-level files (no subdirectory): `directory = ""` (empty string)
- Files in subdirectory: `directory = "path/to/dir"` (normalized relative path)
- No recursive grouping — grouping is by immediate parent only

### 4.5 CEU ID Assignment

1. Collect all unique directories from admitted files
2. Sort lexicographically — empty string `""` (root) sorts first
3. Assign `CEU-001`, `CEU-002`, ... sequentially in that order

Same admitted file set → same directory set → same sort → same CEU IDs. Deterministic.

### 4.6 Unit Hash Computation

For each CEU:
```
unit_hash = SHA256(
    "\n".join(
        f"{entry.path}:{entry.sha256}"
        for entry in sorted(files_in_unit, key=lambda x: x.path)
    )
)
```

All files in the unit are sorted by path before hashing. Deterministic.

### 4.7 Dominant File Type

The most frequently occurring file_type among files in the unit.
Ties are broken lexicographically (first in alphabetical order wins).

### 4.8 File Ordering

All output lists are in lexicographic path order. No filesystem-order dependence.

### 4.9 Exclusion Logging

Every excluded file is logged in `structural_extraction_log.json.exclusions[]` with:
- `path`: the file path (or `(empty)` for empty-path entries)
- `reason`: machine-readable exclusion code
- `governance`: human-readable rule statement

### 4.10 Ambiguity Handling

| ambiguity type | resolution |
|----------------|-----------|
| File with unknown extension | Classified as `UNKNOWN_FILE_TYPE`; included in extraction; logged in extraction_log (not in exclusions — file is admitted) |
| File in root with no directory | `directory = ""`; assigned to first CEU (CEU-001) after lex sort |
| Two files with identical path | Cannot occur: ingestion_log paths are normalized; if encountered, FAIL_CLOSED |

No silent guessing. No invented exceptions.

### 4.11 Determinism Hash

```
determinism_hash = SHA256(
    "\n".join(
        f"{entry.path}:{entry.sha256}"
        for entry in sorted(admitted_files, key=lambda x: x.path)
    )
)
```

This is identical to the aggregate_hash formula in intake, computed independently over the admitted file set. Matches the upstream aggregate_hash if all intake files are admitted.

---

## SECTION 5 — OUTPUT STRUCTURE

All outputs written to: `clients/<tenant>/psee/runs/<run_id>/40_2/`

### 5.1 structural_unit_inventory.json

**Purpose**: Canonical inventory of all Structural Units (CEUs) derived from the admitted file set.

**Schema**:
```json
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01",
  "artifact_class": "STRUCTURAL_TRUTH_40_2",
  "artifact_id": "structural_unit_inventory",
  "tenant": "<tenant>",
  "run_id": "<run_id>",
  "intake_id": "<intake_id from raw_input.json>",
  "source_type": "<source_type from raw_input.json>",
  "extracted_at": "<materialized_at from raw_input.json>",
  "ig_dir": "clients/<tenant>/psee/runs/<run_id>/ig",
  "unit_count": N,
  "total_admitted_files": N,
  "units": [
    {
      "unit_id": "CEU-001",
      "directory": "(root) | <path>",
      "file_count": N,
      "file_types_present": ["<sorted file types>"],
      "dominant_file_type": "<most frequent type>",
      "unit_hash": "<sha256>",
      "evidence_ref": {
        "ig_dir": "clients/<tenant>/psee/runs/<run_id>/ig",
        "source_artifact": "structure_map.json + ingestion_log.json",
        "intake_id": "<intake_id>"
      }
    }
  ]
}
```

### 5.2 file_structural_map.json

**Purpose**: Per-file mapping from admitted file path to structural unit + file type classification.

**Schema**:
```json
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01",
  "artifact_class": "STRUCTURAL_TRUTH_40_2",
  "artifact_id": "file_structural_map",
  "tenant": "<tenant>",
  "run_id": "<run_id>",
  "intake_id": "<intake_id>",
  "extracted_at": "<materialized_at>",
  "file_count": N,
  "entries": [
    {
      "path": "<normalized relative path>",
      "sha256": "<sha256 from structure_map.json>",
      "size_bytes": N,
      "file_type": "<type from classification>",
      "unit_id": "CEU-NNN",
      "admission_status": "ADMITTED",
      "source_path": "<source_path from admissibility_log.json or ''>",
      "layer": "<layer from admissibility_log.json or ''>",
      "governance_authority": "<governance_authority from admissibility_log.json or ''>"
    }
  ]
}
```

Entries are in lexicographic path order.

### 5.3 structural_extraction_log.json

**Purpose**: Auditable log of extraction decisions, rules applied, exclusions, and determinism proof.

**Schema**:
```json
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01",
  "artifact_class": "STRUCTURAL_TRUTH_40_2",
  "artifact_id": "structural_extraction_log",
  "tenant": "<tenant>",
  "run_id": "<run_id>",
  "intake_id": "<intake_id>",
  "extracted_at": "<materialized_at>",
  "input_artifacts": {
    "primary": ["ig/raw_input.json", "ig/structure_map.json", "ig/ingestion_log.json"],
    "support": ["ig/admissibility_log.json"]
  },
  "derivation_rules": {
    "ceu_grouping": "DIRECTORY — ...",
    "ceu_id_assignment": "SEQUENTIAL — ...",
    "ceu_hash": "SHA256(...)",
    "file_type_classification": "STRUCTURAL_IDENTITY — ...",
    "dominant_file_type": "MOST_FREQUENT — ...",
    "file_ordering": "LEXICOGRAPHIC by path",
    "timestamp": "INHERITED from raw_input.json.materialized_at",
    "determinism_hash": "SHA256(...)"
  },
  "summary": {
    "admitted_files": N,
    "structural_units": N,
    "excluded_files": N,
    "unknown_file_types": N
  },
  "exclusions": [
    {
      "path": "<path>",
      "reason": "<EXCLUSION_CODE>",
      "governance": "<rule statement>"
    }
  ],
  "ambiguities": [],
  "determinism_hash": "<sha256>"
}
```

---

## SECTION 6 — DETERMINISM CONTRACT

### 6.1 Guaranteed Determinism

Given identical IG runtime package content (`raw_input.json`, `structure_map.json`, `ingestion_log.json`):

- `structural_unit_inventory.json` is identical across runs
- `file_structural_map.json` is identical across runs
- `structural_extraction_log.json` is identical across runs (including `determinism_hash`)
- CEU IDs are identical across runs (same directory set → same sort → same assignment)
- Unit hashes are identical across runs

### 6.2 Determinism Sources

| output field | determinism basis |
|-------------|------------------|
| `extracted_at` | `raw_input.json.materialized_at` (frozen at intake creation time) |
| CEU IDs | Lexicographic sort of directory paths — filesystem-independent |
| CEU hash | SHA-256 of sorted `<path>:<sha256>` pairs — content-addressed |
| `determinism_hash` | SHA-256 of all admitted `<path>:<sha256>` pairs — content-addressed |
| File ordering | Lexicographic — no filesystem walk order dependence |
| File type | Table lookup — no heuristics, no environment dependence |

### 6.3 Determinism Verification

The `determinism_hash` in `structural_extraction_log.json` can be independently verified:

```python
import hashlib, json
with open("ig/structure_map.json") as f:
    sm = json.load(f)
with open("ig/ingestion_log.json") as f:
    il = json.load(f)
admitted_paths = {e["path"] for e in il["entries"] if e["decision"] == "ADMITTED"}
sm_lookup = {e["path"]: e["sha256"] for e in sm["entries"]}
pairs = sorted(f"{p}:{sm_lookup[p]}" for p in admitted_paths if p in sm_lookup)
expected_hash = hashlib.sha256("\n".join(pairs).encode()).hexdigest()
```

---

## SECTION 7 — HANDOVER CONTRACT

### 7.1 What L40.2 Guarantees

- Every admitted file from the IG runtime package has a CEU assignment
- Every CEU has a deterministic hash traceable to IG input hashes
- Every file has a structural file type classification (or UNKNOWN_FILE_TYPE if unclassified)
- All exclusions are explicitly logged with governed reasons
- Output is reproducible from the same IG inputs

### 7.2 What L40.2 Does NOT Guarantee

- Entity graph (that is 40.3's responsibility)
- Dependency relationships between files or units (40.3)
- Telemetry dimensions (40.4)
- Semantic grouping or domain assignment (Stage 3, 41.x)
- Layer enrichment of IG `layer_index.json` — NOT performed by this stream
- Resolution of the declared reconstruction constraint (score = 0 remains until layer-enriched IG path is defined)

### 7.3 What L40.3/L40.4 May Rely On

- `structural_unit_inventory.json.units[].unit_id` — stable CEU identifiers for entity anchoring
- `file_structural_map.json.entries` — file-to-CEU mapping with sha256 for evidence tracing
- `structural_unit_inventory.json.units[].unit_hash` — deterministic CEU content hash
- `structural_extraction_log.json.determinism_hash` — extraction-level determinism proof

### 7.4 What Later Stages Must NOT Assume

- L40.3 must NOT assume a CEU is an "entity" — CEU is a structural grouping, not a semantic entity
- L40.3 must NOT re-use CEU IDs as entity IDs without explicit mapping
- L40.4 must NOT assume a CEU maps to a telemetry surface — that derivation requires 40.3 entity catalog
- No stage may modify `40_2/` artifacts once extraction is complete

### 7.5 Additive Status

L40.2 extraction is additive. It:
- Does not modify `ig/` artifacts
- Does not modify any S1/S2/S3/S4 runtime artifacts
- Does not modify `package/` artifacts
- Does not affect `pios emit coverage`, `pios emit reconstruction`, `pios compute gauge`, or `pios validate freshness`

The S2–S4 pipeline and GA logic are unchanged.

---

## SECTION 8 — CLI SURFACE

### 8.1 Command

```
pios structural extract --tenant <tenant> --run-id <run_id> [--debug]
```

### 8.2 Registration

Registered under the `structural` top-level command group in `scripts/pios/pios.py`.

```
pios structural extract
pios structural --help
pios structural extract --help
```

### 8.3 Debug Output

When `--debug` is passed, logs to stderr:
- Resolved `ig_dir`
- `raw_input.json` fields: `intake_id`, `materialized_at`, `source_type`
- `structure_map` entry count
- `ingestion_log` entry count
- `admissibility_log` entry count (if present)
- `admitted_files` count and `excluded_files` count
- `unknown_file_types` count
- Discovered directories and their CEU assignments
- `determinism_hash`
- Resolved `output_dir`
- Each artifact write confirmation

---

## SECTION 9 — END-TO-END FLOW

Full productized flow from source to L40.2:

```
# Step 1: Create governed intake bundle from local source
pios intake create \
  --source-path <path> \
  --tenant <tenant> \
  --intake-id <intake_id>
# Output: clients/<tenant>/psee/intake/<intake_id>/

# Step 2: Materialize IG runtime package from intake bundle
pios ig materialize \
  --tenant <tenant> \
  --intake-id <intake_id> \
  --run-id <run_id>
# Output: clients/<tenant>/psee/runs/<run_id>/ig/

# Step 3: Extract L40.2 structural truth from IG package
pios structural extract \
  --tenant <tenant> \
  --run-id <run_id>
# Output: clients/<tenant>/psee/runs/<run_id>/40_2/
#   structural_unit_inventory.json
#   file_structural_map.json
#   structural_extraction_log.json
```

### 9.1 Continuing the Pipeline

After L40.2 extraction, the existing S0–S4 pipeline can proceed independently:

```
pios ledger create --run-id <run_id> --client <tenant> --source-version <intake_id>
pios bootstrap --run-dir clients/<tenant>/psee/runs/<run_id>
pios emit coverage --run-dir ... --ig-dir clients/<tenant>/psee/runs/<run_id>/ig
pios emit reconstruction --run-dir ... --ig-dir clients/<tenant>/psee/runs/<run_id>/ig
# NOTE: reconstruction_state.state = FAIL (declared constraint) until layer-enriched IG path
pios emit topology --run-dir ... --run-id <run_id>
pios emit signals --run-dir ...
pios declare coherence --run-dir ...
pios compute gauge --run-dir ...
pios validate freshness --run-dir ...
```

### 9.2 Output Path Relationships

```
clients/<tenant>/psee/
├── intake/<intake_id>/           ← pios intake create
│   ├── intake_record.json
│   ├── file_hash_manifest.json
│   ├── source_manifest.json
│   └── git_metadata.json (if GIT_DIRECTORY)
└── runs/<run_id>/
    ├── ig/                       ← pios ig materialize
    │   ├── raw_input.json
    │   ├── structure_map.json
    │   ├── ingestion_log.json
    │   ├── evidence_boundary.json
    │   ├── admissibility_log.json
    │   ├── source_manifest.json
    │   └── normalized_intake_structure/
    │       ├── layer_index.json
    │       ├── provenance_chain.json
    │       └── source_profile.json
    ├── 40_2/                     ← pios structural extract  [THIS STREAM]
    │   ├── structural_unit_inventory.json
    │   ├── file_structural_map.json
    │   └── structural_extraction_log.json
    ├── intake_record.json        ← pios ledger create
    ├── coherence_record.json     ← pios declare coherence
    └── package/                  ← pios bootstrap, emit, compute
        ├── engine_state.json
        ├── gauge_inputs.json
        ├── coverage_state.json
        ├── reconstruction_state.json
        ├── canonical_topology.json
        ├── signal_registry.json
        └── gauge_state.json
```
