# IG Materialization Specification
# PRODUCTIZE.IG.FROM.INTAKE.01

- Date: 2026-04-14
- Stream: PRODUCTIZE.IG.FROM.INTAKE.01
- Branch: feature/ig-from-intake
- Execution engine: Claude Code (claude-sonnet-4-6)

---

## SECTION 1 — PURPOSE

Bridge a governed intake bundle (produced by `pios intake create`) into the IG-compatible runtime input structure consumed by the S1 scripts `compute_coverage.sh` and `compute_reconstruction.sh`.

The intake layer (PRODUCTIZE.RAW.SOURCE.INTAKE.01) produces a governed hash bundle. The S1 runtime scripts read a specific set of 6 files from an IG runtime directory. This stream resolves the gap by defining a deterministic, auditable materialization step that produces both:

1. **Governance artifacts** — primary lineage + admission declarations
2. **Runtime compatibility artifacts** — exact files consumed by compute_coverage.sh and compute_reconstruction.sh, populated from intake bundle contents

### Declared Constraint

`pios emit reconstruction` will produce `reconstruction_state.state=FAIL` for sources materialized through this path. `compute_reconstruction.sh` hardcodes `required_layers = {"L40_2", "L40_3", "L40_4"}` in its Python inline script. L_ROOT intake sources do not contain these layer IDs. Both S1 scripts exit 0 — this is correct behavior. Gauge score = 0 for new intake sources until a layer-enriched IG materialization path is defined.

---

## SECTION 2 — COMMAND SURFACE

```
pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id> [--debug]
```

### Arguments

| argument | required | description |
|----------|----------|-------------|
| `--tenant` | yes | Tenant/client identifier matching the intake bundle |
| `--intake-id` | yes | Intake identifier — must match an existing intake bundle |
| `--run-id` | yes | Unique run identifier for the materialized IG output |
| `--debug` | no | Enable debug logging |

### Preconditions

| condition | enforcement |
|-----------|-------------|
| `clients/<tenant>/psee/intake/<intake_id>/` must exist | FAIL_CLOSED (exit 1) |
| `intake_record.json` present in intake dir | FAIL_CLOSED (exit 1) |
| `file_hash_manifest.json` present in intake dir | FAIL_CLOSED (exit 1) |
| `clients/<tenant>/psee/runs/<run_id>/ig/` must NOT exist | FAIL_CLOSED (no-overwrite guard) |

---

## SECTION 3 — INPUT ARTIFACTS

All inputs read from `clients/<tenant>/psee/intake/<intake_id>/`:

| artifact | required | used for |
|----------|----------|---------|
| `intake_record.json` | yes | source identity, timestamps, file_count, aggregate_hash, source_type, git_enriched |
| `file_hash_manifest.json` | yes | per-file paths + SHA-256 hashes for structural derivation |
| `git_metadata.json` | no (GIT_DIRECTORY only) | git enrichment for raw_input.json + source_profile.json |

### Determinism Rule

All materialized artifact timestamps are set to `intake_record.json.created_at`. Same intake → same timestamps → deterministic output.

---

## SECTION 4 — OUTPUT ARTIFACTS

All outputs written to `clients/<tenant>/psee/runs/<run_id>/ig/`.

### Class A: Governance Artifacts (primary)

| artifact | description |
|----------|-------------|
| `raw_input.json` | Source identity declaration: source_path, source_type, git_enriched, aggregate_hash, file_count. Includes git_metadata block for GIT_DIRECTORY sources. |
| `structure_map.json` | Lexicographically-sorted file listing with SHA-256 hashes; layer_id=L_ROOT; admission_status=ADMITTED for all OK entries |
| `ingestion_log.json` | Per-file admission decisions; all OK files ADMITTED; governance_authority=PRODUCTIZE.IG.FROM.INTAKE.01 |

### Class B: Runtime Compatibility Artifacts (derived)

| artifact | consumer | critical field |
|----------|----------|----------------|
| `evidence_boundary.json` | compute_coverage.sh | `admitted_input_class.source_run = intake_id` |
| `admissibility_log.json` | compute_coverage.sh | `source_run = intake_id`; `entries[].artifact = normalized_relative_path`; `summary.total = file_count` |
| `source_manifest.json` | compute_coverage.sh | `root_artifacts.artifacts = [all normalized paths]`; `layers.L_ROOT.artifact_count = file_count`; `total_admitted_artifacts = file_count` |
| `normalized_intake_structure/layer_index.json` | compute_coverage.sh, compute_reconstruction.sh | `layers[0].layer_id = "L_ROOT"`; `artifacts[].name = normalized_relative_path`; `admission_status = "ADMITTED"` |
| `normalized_intake_structure/provenance_chain.json` | compute_reconstruction.sh | `IG.6.failures = 0`; `IG.7.failures = 0`; all 8 invariants confirmed |
| `normalized_intake_structure/source_profile.json` | compute_reconstruction.sh | `profile_governance.verdict = "PASS"` |

---

## SECTION 5 — DERIVATION RULES

### Cross-reference invariant (compute_coverage.sh FAIL_SAFE_STOP)

Every `entries[].artifact` in `admissibility_log.json` MUST appear in either:
- `normalized_intake_structure/layer_index.json` `.layers[].artifacts[].name`
- OR `source_manifest.json` `.root_artifacts.artifacts[]`

This invariant is maintained deterministically: all three artifacts are derived from the same `ok_files_sorted` list, using the same `e["path"]` value as the artifact name in all three.

### admissibility_log.json layer field

`entries[].layer = "ROOT"` (string, not `"L_ROOT"`). Matches the admissibility_log schema from the IG runtime reference (ROOT not L_ROOT).

### Layer naming

`layer_index.json` uses `layer_id = "L_ROOT"`. `admissibility_log.json` `entries[].layer = "ROOT"`. Both are correct — they match the reference IG.RUNTIME/run_01 schema conventions for their respective files.

### provenance_chain.json checks field

`IG.6.checks = len(ok_files)`, `IG.7.checks = len(ok_files)`. These are the number of files processed, not fixed counts.

---

## SECTION 6 — GOVERNED RUN LINEAGE

The IG materialization step does not itself create a PSEE governed run. It creates the IG input structure that feeds an existing `pios ledger create` + S0→S4 pipeline. The `run_id` passed to `ig materialize` is the same `run_id` that will be used in the subsequent `pios ledger create` invocation.

### Handover sequence

```
pios intake create --source-path <path> --tenant <tenant> --intake-id <intake_id>
pios ig materialize --tenant <tenant> --intake-id <intake_id> --run-id <run_id>
pios ledger create --run-id <run_id> --client <tenant> --source-version <intake_id>
pios bootstrap --run-dir clients/<tenant>/psee/runs/<run_id>
pios emit coverage --run-dir ... --ig-dir clients/<tenant>/psee/runs/<run_id>/ig
pios emit reconstruction --run-dir ... --ig-dir clients/<tenant>/psee/runs/<run_id>/ig
pios emit topology --run-dir ... --run-id <run_id>
pios emit signals --run-dir ...
pios declare coherence --run-dir ...
pios compute gauge --run-dir ...
pios validate freshness --run-dir ...
```

---

## SECTION 7 — FAILURE BEHAVIOR

| condition | behavior |
|-----------|----------|
| intake directory not found | FAIL_CLOSED — exit 1 |
| intake_record.json missing | FAIL_CLOSED — exit 1 |
| intake_record.json missing required field | FAIL_CLOSED — exit 1 |
| file_hash_manifest.json missing | FAIL_CLOSED — exit 1 |
| output directory already exists | FAIL_CLOSED — exit 1 (no-overwrite) |

---

## SECTION 8 — GOVERNANCE CONFIRMATION

- No S5/S6 artifacts produced or modified
- No GAUGE UI or product code modified
- No authority contracts modified
- No prior run artifacts mutated
- All writes confined to: `clients/<tenant>/psee/runs/<run_id>/ig/`
- Reads confined to: `clients/<tenant>/psee/intake/<intake_id>/`
- No external API calls
- No remote git queries

---

## SECTION 9 — SUCCESS CONDITION

Success: `pios ig materialize` exits 0 and produces:

- `clients/<tenant>/psee/runs/<run_id>/ig/raw_input.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/structure_map.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/ingestion_log.json`
- `clients/<tenant>/psee/runs/<run_id>/ig/evidence_boundary.json` — `admitted_input_class.source_run = <intake_id>`
- `clients/<tenant>/psee/runs/<run_id>/ig/admissibility_log.json` — `source_run = <intake_id>`; all files ADMITTED; cross-reference invariant holds
- `clients/<tenant>/psee/runs/<run_id>/ig/source_manifest.json` — `total_admitted_artifacts = file_count`
- `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/layer_index.json` — single L_ROOT layer; all files ADMITTED
- `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/provenance_chain.json` — IG.6.failures=0; IG.7.failures=0; 8 invariants
- `clients/<tenant>/psee/runs/<run_id>/ig/normalized_intake_structure/source_profile.json` — `profile_governance.verdict = "PASS"`

`pios emit coverage` and `pios emit reconstruction` consume the output without modification.
`reconstruction_state.state = FAIL` (expected per declared constraint). Both S1 scripts exit 0.
