# IG.7 — Ingestion Payload Specification

**Stream:** IG.7
**Parent:** IG.6
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

IG.7 defines the normalized payload schema emitted by the ingestion batch layer.
The payload manifest (`payload_manifest.json`) is the stable, downstream-consumable
representation of a governed ingestion run. It indexes all 40.2/40.3/40.4 layer
artifacts with full provenance.

---

## 2. PAYLOAD SCHEMA

Schema version: `1.0`
Output file: `<run_namespace>/payload_manifest.json`

| Field | Type | Description |
|---|---|---|
| `payload_schema_version` | string | Schema version (currently `1.0`) |
| `stream` | string | Always `IG.7` |
| `run_id` | string | Run namespace name |
| `governance` | string | Orchestration gate (`IG.6`) |
| `date` | string | Run date (YYYY-MM-DD) |
| `source.kind` | string | `LOCAL_SNAPSHOT` \| `GITHUB_REPOSITORY` |
| `source.admissibility` | string | `GOVERNED` |
| `source.resolution` | string | `DETERMINISTIC` |
| `baseline_anchor` | string | Git tag anchoring the run |
| `layers.L40_2.path` | string | Absolute path to 40.2 layer directory |
| `layers.L40_2.artifact_count` | integer | File count in 40.2 |
| `layers.L40_2.artifacts` | string[] | Sorted filenames in 40.2 |
| `layers.L40_3.*` | — | Same structure as L40_2 |
| `layers.L40_4.*` | — | Same structure as L40_2 |
| `provenance.orchestration_gate` | string | `IG.6` |
| `provenance.admissibility` | string | `GOVERNED` |
| `provenance.determinism` | string | `VERIFIED` |
| `provenance.source_profile_layer` | string | `IG.5` |

---

## 3. INVARIANTS

- `source.admissibility` MUST be `GOVERNED` — any other value blocks normalization
- `source.resolution` MUST be `DETERMINISTIC`
- All three layers (L40_2, L40_3, L40_4) MUST be present
- Artifact lists are sorted — output is deterministic across repeated runs
- Normalizer is a READ-ONLY consumer of run namespace artifacts

---

## 4. FAIL-SAFE CONDITIONS

Normalization halts with FAIL_SAFE_STOP if:
- `adapter_binding.md` is absent (no governed provenance)
- `source_profile_layer: IG.5` annotation is missing
- Any of the three layer directories is absent
- Batch runner called without passing through IG.6 orchestrator

---

## 5. LAYER HIERARCHY

```
IG.7  Ingestion Batch Runner / Payload Normalizer  — payload_manifest.json
  └─► IG.6  Ingestion Orchestrator                 — chain + determinism gate
        └─► IG.5  Source Profile Resolver           — admissibility gate
              └─► IG.4  Orchestration Launcher
                    └─► IG.3  Bootstrap Launcher
                          └─► 40.2 / 40.3 / 40.4   — governed computation (READ-ONLY)
```
