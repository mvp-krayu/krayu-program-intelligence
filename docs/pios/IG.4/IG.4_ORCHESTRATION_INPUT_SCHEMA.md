# IG.4 — Orchestration Input Schema

**Stream:** IG.4
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. FORMAT

Key=value file (one field per line). Comments begin with `#`. Empty lines ignored. All paths must be absolute.

---

## 2. SCHEMA

```
# IG.4 Orchestration Input Schema v1.0
# Required for all orchestration_launcher.sh invocations

# Run identity
run_id=<string>                   # e.g. run_06_orchestrated_ingestion
baseline_anchor=<git_tag>         # e.g. pios-core-v0.4-final
branch=<branch_name>              # must be work/ig-foundation

# Externalized source binding (source.binding = EXTERNAL — no hardcoded paths)
source_path=<absolute_path>       # evidence snapshot root
output_root=<absolute_path>       # target run namespace (must not exist)
reference_run=<absolute_path>     # reference run for zero-delta comparison

# Bootstrap delegation
bootstrap_launcher=<absolute_path>  # path to scripts/pios/ig3/bootstrap_launcher.sh

# Source mode
source.kind=LOCAL_SNAPSHOT        # LOCAL_SNAPSHOT | GITHUB
source.binding=EXTERNAL           # must be EXTERNAL

# Adapter modes (inherited from IG.2/IG.3)
github.mode=ENABLED               # ENABLED | DISABLED
jira.mode=CAPSULE                 # CAPSULE only

# Execution modes
run.mode=ORCHESTRATED_INGESTION   # ORCHESTRATED_INGESTION
execution.mode=CREATE_ONLY        # CREATE_ONLY
```

---

## 3. VALIDATION RULES

| Field | Validation |
|---|---|
| `run_id` | Non-empty; matches target directory basename |
| `baseline_anchor` | Resolves via `git rev-parse` |
| `branch` | Must equal `work/ig-foundation` |
| `source_path` | Accessible directory |
| `output_root` | Must NOT exist (CREATE_ONLY) |
| `reference_run` | Must exist |
| `bootstrap_launcher` | Must exist and be executable |
| `source.binding` | Must be `EXTERNAL` |
| `jira.mode` | Must be `CAPSULE` |
| `run.mode` | Must be `ORCHESTRATED_INGESTION` |
| `execution.mode` | Must be `CREATE_ONLY` |

---

## 4. IG.4 RUN_06 INSTANCE

```
run_id=run_06_orchestrated_ingestion
baseline_anchor=pios-core-v0.4-final
branch=work/ig-foundation
source_path=/Users/khorrix/Projects/blueedge-program-intelligence/source-v3.23
output_root=/Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_06_orchestrated_ingestion
reference_run=/Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_05_bootstrap_pipeline
bootstrap_launcher=/Users/khorrix/Projects/k-pi-core/scripts/pios/ig3/bootstrap_launcher.sh
source.kind=LOCAL_SNAPSHOT
source.binding=EXTERNAL
github.mode=ENABLED
jira.mode=CAPSULE
run.mode=ORCHESTRATED_INGESTION
execution.mode=CREATE_ONLY
```
