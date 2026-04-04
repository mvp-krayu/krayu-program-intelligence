# IG.6 — Ingestion Orchestration Contract

**Stream:** IG.6
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

IG.6 establishes the canonical orchestration entrypoint for governed ingestion pipeline execution. It binds IG.5 source profile resolution to executable pipeline invocation and enforces deterministic run control.

The orchestrator does NOT invoke pipeline layers directly. It validates that the supplied run was produced through the governed resolver chain and that the run is deterministic.

---

## 2. LAYER HIERARCHY (EXTENDED)

```
IG.6  Ingestion Orchestrator       — JSON entrypoint; chain + determinism validation
  └─► IG.5  Source Profile Resolver    — admissibility gate; profile → orchestration schema
        └─► IG.4  Orchestration Launcher  — source binding externalization
              └─► IG.3  Bootstrap Launcher    — CREATE-ONLY run namespace
                    └─► 40.2 / 40.3 / 40.4   — governed computation (READ-ONLY)
```

---

## 3. INPUT FORMAT

JSON file placed in the run namespace: `<run_namespace>/run_<N>_input.json`

| Field | Required | Value |
|---|---|---|
| `stream` | YES | `IG.6` |
| `run_id` | YES | run namespace name |
| `profile.kind` | YES | `LOCAL_SNAPSHOT` \| `GITHUB_REPOSITORY` |
| `profile.admissibility` | YES | `GOVERNED` — any other value → FAIL_SAFE_STOP |
| `profile.resolution` | YES | `DETERMINISTIC` — any other value → FAIL_SAFE_STOP |
| `output_root` | YES | absolute path to run namespace |
| `reference_run` | YES | absolute path to reference run for zero-delta |
| `resolver` | YES | path to `scripts/pios/ig5/source_profile_resolver.sh` |
| `governance` | YES | `IG.5` |
| `run_mode` | YES | `SOURCE_PROFILED_INGESTION` |
| `execution_mode` | YES | `CREATE_ONLY` |

---

## 4. VALIDATION SEQUENCE

| Check | Description | Fail mode |
|---|---|---|
| FAIL-SAFE gate | `profile.admissibility = GOVERNED` and `profile.resolution = DETERMINISTIC` | FAIL_SAFE_STOP (immediate) |
| C1 — Schema | All required fields present with correct values | ORCHESTRATOR_FAIL |
| C2 — Chain | IG.5 → IG.4 → IG.3 launcher scripts present, executable, delegation intact | FAIL_SAFE_STOP |
| C3 — Provenance | Run namespace exists; `adapter_binding.md` has IG.5 source_profile_layer annotation | FAIL_SAFE_STOP |
| C4 — Determinism | Zero-delta check vs reference_run using `validate_zero_delta.sh` | ORCHESTRATOR_FAIL |

---

## 5. FAIL-SAFE RULE

If `profile.admissibility` ≠ GOVERNED, or `profile.resolution` ≠ DETERMINISTIC, or the resolver chain (IG.5 → IG.4 → IG.3) cannot be confirmed:
→ emit `FAIL_SAFE_STOP` with reason and resolution path
→ exit 1
→ no further validation proceeds

---

## 6. CONSTRAINTS

- No direct source access — orchestrator reads run output, not source data
- No pipeline invocation — orchestrator validates, does not run the pipeline
- No IG.2–IG.5 artifact mutation
- Shared validators only: `scripts/governance/validate_zero_delta.sh`, `scripts/governance/validate_contract.sh`
