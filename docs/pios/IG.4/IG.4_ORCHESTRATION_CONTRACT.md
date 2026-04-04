# IG.4 — Ingestion Orchestration Contract

**Stream:** IG.4
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

This contract defines the orchestration layer for the IG ingestion pipeline. The orchestration layer sits above the IG.3 bootstrap entrypoint and provides externalized source binding, making pipeline execution fully parameterizable without modifying any underlying layer.

All pipeline runs from IG.4 onward MUST be invoked through the orchestration launcher. The orchestration launcher MUST delegate to the IG.3 bootstrap launcher. No layer may be bypassed.

---

## 2. LAYER HIERARCHY

```
IG.4 Orchestration Launcher
  └─► IG.3 Bootstrap Launcher
        └─► 40.2 / 40.3 / 40.4 governed execution
```

No direct invocation of the bootstrap launcher is permitted from outside the orchestration layer.

---

## 3. ORCHESTRATION MODES

| Parameter | Allowed Values | Default |
|---|---|---|
| `source.kind` | `LOCAL_SNAPSHOT`, `GITHUB` | `LOCAL_SNAPSHOT` |
| `source.binding` | `EXTERNAL` | `EXTERNAL` |
| `github.mode` | `ENABLED`, `DISABLED` | `DISABLED` |
| `jira.mode` | `CAPSULE` | `CAPSULE` |
| `run.mode` | `ORCHESTRATED_INGESTION` | `ORCHESTRATED_INGESTION` |
| `execution.mode` | `CREATE_ONLY` | `CREATE_ONLY` |

`source.binding = EXTERNAL` is mandatory — no source paths may be hardcoded in the orchestration launcher.

---

## 4. EXTERNALIZED SOURCE BINDING

All source and output paths MUST be supplied via the external input schema. The orchestration launcher MUST NOT contain hardcoded paths. This ensures:

- Same launcher binary works across environments
- Source version is an explicit, auditable input
- Output namespace is always caller-controlled

---

## 5. DELEGATION RULE

The orchestration launcher translates the orchestration input schema into an IG.3 bootstrap input schema and delegates execution to:

```
scripts/pios/ig3/bootstrap_launcher.sh <translated_bootstrap_schema>
```

The translated schema MUST include all fields required by `IG.3_BOOTSTRAP_INPUT_SCHEMA.md`. The orchestration launcher MUST NOT duplicate bootstrap logic.

---

## 6. INVARIANT PRESERVATION

| Invariant | Source | Preserved by |
|---|---|---|
| IG.3 bootstrap invariant | `IG.3_BOOTSTRAP_CONTRACT.md` | delegation — bootstrap is called unchanged |
| IG.2 adapter semantics | `IG.2_ADAPTER_CONTRACT.md` | inherited through bootstrap |
| Zero-delta | IG pipeline | enforced at orchestration comparison step |
| CREATE_ONLY | IG.3 bootstrap | enforced at bootstrap launch |
| Baseline anchors | git tags | enforced at bootstrap launch |

---

## 7. ZERO-DELTA REQUIREMENT

Orchestrated runs MUST produce zero semantic delta against the reference run.

| Requirement | Rule |
|---|---|
| Entity set | IDENTICAL to run_05_bootstrap_pipeline |
| Topology | IDENTICAL to run_05_bootstrap_pipeline |
| Telemetry | IDENTICAL to run_05_bootstrap_pipeline |
| Permitted differences | Provenance fields only (run_id, contract, regeneration_context) |

If comparison result ≠ NONE → FAIL.

---

## 8. MUTATION PROHIBITION

| Item | Rule |
|---|---|
| IG.3 artifacts | MUST NOT be modified |
| IG.2 artifacts | MUST NOT be modified |
| 40.2 / 40.3 / 40.4 baseline | MUST NOT be modified |
| `scripts/pios/ig3/` | MUST NOT be modified |

---

## 9. VALIDATORS

| Validator | Path | Purpose |
|---|---|---|
| Orchestration contract | `scripts/pios/ig4/validate_orchestration_contract.sh` | Confirms orchestration artifacts and delegation chain intact |
| Zero-delta | `scripts/pios/ig4/validate_zero_delta.sh` | Confirms run_06 NONE vs run_05 |
| Git hygiene | `scripts/pios/ig4/validate_git_hygiene.sh` | Confirms no unauthorized operations |
