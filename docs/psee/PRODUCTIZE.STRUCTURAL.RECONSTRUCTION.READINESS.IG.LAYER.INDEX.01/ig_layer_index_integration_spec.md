# IG Layer Index Integration Specification
# PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01

- Version: 1.0
- Stream: PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01
- Authority: STRUCTURAL.TRUTH.AUTHORITY.01 / PRODUCTIZE.IG.FROM.INTAKE.01
- Branch: feature/ig-layer-index-integration
- Date: 2026-04-14

---

## SECTION 1 — PRINCIPLES

This stream makes existing structural truth **visible** to the reconstruction pipeline.
It does NOT create structural artifacts. It does NOT recompute structural truth.

The single responsibility of this stream is:

> Register L40_2, L40_3, and L40_4 as named layers in
> `ig/normalized_intake_structure/layer_index.json`
> so that structural outputs produced by the STRUCTURAL.TRUTH.40.x streams
> become discoverable through the IG layer index.

Governing principles:

1. **Additive only** — no upstream artifact is modified; only `layer_index.json` is updated
2. **Declarative** — layer entries are deterministic declarations of structural artifact locations and provenance
3. **Evidence-first** — all provenance references point to existing, authoritative determinism hashes
4. **No semantic leakage** — no domain, capability, scoring, or functional fields in any layer entry
5. **Fail-closed** — any missing precondition, identity mismatch, or already-integrated state causes exit 1
6. **IG as discoverability only** — IG does not own structural truth; it exposes it

---

## SECTION 2 — CURRENT STATE (L_ROOT ONLY)

Before this stream, `ig/normalized_intake_structure/layer_index.json` contains exactly one layer:

```json
{
  "layers": [
    {
      "layer_id": "L_ROOT",
      "role": "source",
      "source_path": "<source_path>",
      "artifact_count": <int>,
      "artifacts": [...]
    }
  ]
}
```

This is the state produced by `pios ig materialize`. It satisfies the IG runtime bridge contract
for intake-level discoverability but exposes no structural processing layers.

Declared downstream effect: `compute_reconstruction.sh` requires `L40_2`, `L40_3`, `L40_4` in
layer_index.json. Their absence causes `reconstruction_state.state=FAIL, score=0`. This is the
blocker this stream resolves on the structural-discoverability side.

---

## SECTION 3 — TARGET LAYER MODEL

After integration, layer_index.json contains exactly 4 layers in canonical order:

| Position | layer_id | source    | role                        |
|----------|----------|-----------|-----------------------------|
| 0        | L_ROOT   | (existing)| source intake files (L_ROOT) |
| 1        | L40_2    | STRUCTURAL| structural unit extraction   |
| 2        | L40_3    | STRUCTURAL| structural relationship map  |
| 3        | L40_4    | STRUCTURAL| normalized structural topology |

L_ROOT is preserved exactly — no field is added, removed, or modified in the existing entry.

---

## SECTION 4 — LAYER REGISTRATION RULES

### 4.1 Layer Entry Fields (structural layers only)

Each of L40_2, L40_3, L40_4 is registered with exactly:

| Field | Value | Notes |
|-------|-------|-------|
| `layer_id` | `"L40_2"` / `"L40_3"` / `"L40_4"` | Identity |
| `source` | `"STRUCTURAL"` | Discriminates from L_ROOT |
| `path` | `"clients/<tenant>/psee/runs/<run_id>/<layer>"` | Relative from repo root |
| `artifact_root` | `"40_2"` / `"40_3"` / `"40_4"` | Short reference to artifact directory |
| `layer_index` | `1` / `2` / `3` | Canonical ordering index |
| `provenance.source_artifact` | `"<layer>/structural_*_log.json"` | Log file holding determinism hash |
| `provenance.determinism_hash` | `<sha256>` | Verbatim from authoritative log artifact |

No other fields. No structural content. No node/edge/file bodies.

### 4.2 Provenance Source Mapping

| Layer | Provenance source artifact | Field read |
|-------|---------------------------|------------|
| L40_2 | `40_2/structural_extraction_log.json` | `determinism_hash` |
| L40_3 | `40_3/structural_relationship_log.json` | `determinism_hash` |
| L40_4 | `40_4/structural_topology_log.json` | `determinism_hash` |

Hashes are read verbatim — no recomputation.

### 4.3 Top-Level Integration Marker

`layer_index.json` receives one new top-level string field:

```json
"structural_layer_integration_stream": "PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01"
```

This is the only non-layer addition. It is static text — no timestamp, no runtime data.

---

## SECTION 5 — COMMAND CONTRACT

### Command

```
pios ig integrate-structural-layers --tenant <tenant> --run-id <run_id> [--debug]
```

### Preconditions (all fail-closed, exit 1 on failure)

1. `ig/normalized_intake_structure/` directory exists
2. `ig/normalized_intake_structure/layer_index.json` exists
3. `layer_index.json` contains `run_id`, `intake_id`, `layers` fields
4. `layer_index.json.run_id` matches the `--run-id` argument
5. `40_2/` directory exists
6. `40_3/` directory exists
7. `40_4/` directory exists
8. `40_2/structural_extraction_log.json` exists with `determinism_hash` and `intake_id`
9. `40_3/structural_relationship_log.json` exists with `determinism_hash` and `intake_id`
10. `40_4/structural_topology_log.json` exists with `determinism_hash` and `intake_id`
11. All structural log `intake_id` values match `layer_index.json.intake_id`
12. None of `L40_2`, `L40_3`, `L40_4` are already present in `layers[]`

### Operation

1. Read layer_index.json
2. Validate preconditions 1–12
3. Read determinism hashes from 3 log artifacts
4. Build 3 structural layer entries
5. Append to `layers[]` (L_ROOT preserved at position 0)
6. Add `structural_layer_integration_stream` field
7. Write updated layer_index.json

### Idempotency model

**FAIL-CLOSED on second run.** If any of L40_2, L40_3, L40_4 are already present in `layers[]`:

```
exit 1: STRUCTURAL_LAYERS_ALREADY_REGISTERED
```

This is a CREATE_ONLY operation. The output of a fresh run is fully deterministic.

---

## SECTION 6 — LAYER INDEX STRUCTURE

### Before integration

```json
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
  "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
  "run_id": "<run_id>",
  "intake_id": "<intake_id>",
  "source_run": "<intake_id>",
  "materialized_at": "<ISO8601>",
  "layers": [
    { "layer_id": "L_ROOT", "role": "source", ... }
  ]
}
```

### After integration

```json
{
  "schema_version": "1.0",
  "stream": "PRODUCTIZE.IG.FROM.INTAKE.01",
  "artifact_class": "RUNTIME_COMPATIBILITY_PROJECTION",
  "run_id": "<run_id>",
  "intake_id": "<intake_id>",
  "source_run": "<intake_id>",
  "materialized_at": "<ISO8601>",
  "layers": [
    { "layer_id": "L_ROOT", "role": "source", ... },
    {
      "layer_id": "L40_2",
      "source": "STRUCTURAL",
      "path": "clients/<tenant>/psee/runs/<run_id>/40_2",
      "artifact_root": "40_2",
      "layer_index": 1,
      "provenance": {
        "source_artifact": "40_2/structural_extraction_log.json",
        "determinism_hash": "<sha256>"
      }
    },
    {
      "layer_id": "L40_3",
      "source": "STRUCTURAL",
      "path": "clients/<tenant>/psee/runs/<run_id>/40_3",
      "artifact_root": "40_3",
      "layer_index": 2,
      "provenance": {
        "source_artifact": "40_3/structural_relationship_log.json",
        "determinism_hash": "<sha256>"
      }
    },
    {
      "layer_id": "L40_4",
      "source": "STRUCTURAL",
      "path": "clients/<tenant>/psee/runs/<run_id>/40_4",
      "artifact_root": "40_4",
      "layer_index": 3,
      "provenance": {
        "source_artifact": "40_4/structural_topology_log.json",
        "determinism_hash": "<sha256>"
      }
    }
  ],
  "structural_layer_integration_stream": "PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01"
}
```

---

## SECTION 7 — DETERMINISM CONTRACT

The output of this command is fully deterministic:

- **No timestamp written at integration time** — `materialized_at` is inherited from the existing
  layer_index.json and is not modified
- **Layer entries are derived from static artifact content** — determinism hashes are verbatim
  from log artifacts whose content is fixed
- **Layer ordering is canonical** — L_ROOT first (preserved), then L40_2/L40_3/L40_4 in lexicographic
  layer_index order
- **integration_stream field is a static constant string** — no runtime variation
- **Second run fails closed** — STRUCTURAL_LAYERS_ALREADY_REGISTERED, no partial state

Result: given the same `40_2/`, `40_3/`, `40_4/` and `layer_index.json` inputs, the updated
`layer_index.json` is byte-identical on every compliant first execution.

---

## SECTION 8 — HANDOVER TO RECONSTRUCTION

This stream removes the structural-side discoverability blocker:

| Before | After |
|--------|-------|
| `L40_2` absent from layer_index | `L40_2` present with provenance |
| `L40_3` absent from layer_index | `L40_3` present with provenance |
| `L40_4` absent from layer_index | `L40_4` present with provenance |
| Structural layers invisible to pipeline | Structural layers discoverable |

This stream does NOT:
- modify `compute_reconstruction.sh` logic
- guarantee reconstruction success on its own
- resolve any blocker other than structural layer absence

Any remaining reconstruction failure after this integration is downstream of structural
discoverability — owned by the reconstruction pipeline, not this stream.

---

## SECTION 9 — FAILURE CONDITIONS

| Condition | Error | Exit |
|-----------|-------|------|
| `ig/normalized_intake_structure/` missing | directory not found | 1 |
| `layer_index.json` missing | file not found | 1 |
| `layer_index.json` malformed (missing run_id/intake_id/layers) | malformed | 1 |
| `layer_index.json.run_id` != `--run-id` argument | identity mismatch | 1 |
| `40_2/` directory missing | directory not found | 1 |
| `40_3/` directory missing | directory not found | 1 |
| `40_4/` directory missing | directory not found | 1 |
| `structural_extraction_log.json` missing or no `determinism_hash` | provenance unavailable | 1 |
| `structural_relationship_log.json` missing or no `determinism_hash` | provenance unavailable | 1 |
| `structural_topology_log.json` missing or no `determinism_hash` | provenance unavailable | 1 |
| Any structural log `intake_id` != `layer_index.json.intake_id` | identity inconsistency | 1 |
| L40_2, L40_3, or L40_4 already in `layers[]` | STRUCTURAL_LAYERS_ALREADY_REGISTERED | 1 |

---

## SECTION 10 — END-TO-END FLOW

```
pios intake create
    → clients/<tenant>/psee/intake/<intake_id>/

pios ig materialize
    → clients/<tenant>/psee/runs/<run_id>/ig/
    → ig/normalized_intake_structure/layer_index.json  [L_ROOT only]

pios structural extract
    → clients/<tenant>/psee/runs/<run_id>/40_2/

pios structural relate
    → clients/<tenant>/psee/runs/<run_id>/40_3/

pios structural normalize
    → clients/<tenant>/psee/runs/<run_id>/40_4/

pios ig integrate-structural-layers       ← THIS STREAM
    → modifies layer_index.json [L_ROOT + L40_2 + L40_3 + L40_4]
    → reconstruction discoverability blocker REMOVED

pios emit reconstruction (downstream, separate stream)
    → reads layer_index.json
    → L40_2/L40_3/L40_4 now discoverable
    → structural absence no longer the blocker
```

Authority: PRODUCTIZE.STRUCTURAL.RECONSTRUCTION.READINESS.IG.LAYER.INDEX.01
