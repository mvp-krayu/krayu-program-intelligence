# IG.3 — Bootstrap Contract

**Stream:** IG.3
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

This contract defines the deterministic bootstrap entrypoint for IG pipeline execution. All pipeline runs from IG.3 onward MUST be invoked through the bootstrap launcher. No direct layer-by-layer execution is permitted without a bootstrap contract binding.

---

## 2. BOOTSTRAP MODES

| Parameter | Allowed Values | Default |
|---|---|---|
| `source.kind` | `LOCAL_SNAPSHOT`, `GITHUB` | `LOCAL_SNAPSHOT` |
| `github.mode` | `ENABLED`, `DISABLED` | `DISABLED` |
| `jira.mode` | `CAPSULE` | `CAPSULE` |
| `run.mode` | `BOOTSTRAP_PIPELINE` | `BOOTSTRAP_PIPELINE` |
| `execution.mode` | `CREATE_ONLY` | `CREATE_ONLY` |

---

## 3. REQUIRED INPUT FIELDS

Every bootstrap invocation MUST supply:

| Field | Type | Description |
|---|---|---|
| `run_id` | string | Unique run identifier (e.g. `run_05_bootstrap_pipeline`) |
| `source_path` | path | Absolute path to evidence snapshot |
| `output_root` | path | Absolute path to target run namespace |
| `baseline_anchor` | string | Git tag for baseline (e.g. `pios-core-v0.4-final`) |
| `branch` | string | Active branch (must match `work/ig-foundation`) |
| `source.kind` | enum | `LOCAL_SNAPSHOT` or `GITHUB` |
| `github.mode` | enum | `ENABLED` or `DISABLED` |
| `jira.mode` | enum | `CAPSULE` only |
| `run.mode` | enum | `BOOTSTRAP_PIPELINE` |
| `execution.mode` | enum | `CREATE_ONLY` |

---

## 4. BINDING RULES

| Rule | Enforcement |
|---|---|
| `output_root` must not exist before launch | FAIL if exists |
| `execution.mode = CREATE_ONLY` — no overwrites | FAIL on any overwrite |
| `baseline_anchor` must be a valid git tag | FAIL if not resolvable |
| `branch` must be `work/ig-foundation` | FAIL if mismatch |
| `source_path` must be accessible | FAIL if missing |
| `jira.mode` is always CAPSULE | No live Jira |

---

## 5. INHERITANCE FROM IG.2

| IG.2 property | IG.3 behaviour |
|---|---|
| GitHub adapter (ENABLED) | Inherited — `github.mode = ENABLED` when `source.kind = GITHUB` |
| Jira capsule schema | Inherited — `jira.mode = CAPSULE` always |
| Zero-delta requirement | Enforced — run_05 must be NONE vs run_04 |
| Adapter metadata provenance-only | Enforced — no adapter fields in 40.x content |

---

## 6. LAUNCHER ENTRYPOINT

All pipeline executions must be invoked via:

```
scripts/pios/ig3/bootstrap_launcher.sh <input_schema_file>
```

Input schema file: JSON or key=value format per `IG.3_BOOTSTRAP_INPUT_SCHEMA.md`.

---

## 7. ZERO-DELTA REQUIREMENT

Bootstrap-launched runs MUST produce zero semantic delta against the reference run.

| Requirement | Rule |
|---|---|
| Entity set | IDENTICAL to run_04_adapter_simulation |
| Topology | IDENTICAL to run_04_adapter_simulation |
| Telemetry | IDENTICAL to run_04_adapter_simulation |
| Permitted differences | Provenance fields only (run_id, contract, regeneration_context) |

If comparison result ≠ NONE → STOP, do not produce verdict.
