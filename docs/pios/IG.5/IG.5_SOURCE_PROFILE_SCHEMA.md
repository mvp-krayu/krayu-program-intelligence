# IG.5 — Source Profile Schema

**Stream:** IG.5
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. FORMAT

Key=value file. Comments with `#`. All paths absolute.

---

## 2. SCHEMA

```
# IG.5 Source Profile Schema v1.0

# Run identity
run_id=<string>                      # e.g. run_07_source_profiled_ingestion
baseline_anchor=<git_tag>            # e.g. pios-core-v0.4-final
branch=<branch_name>                 # must be work/ig-foundation

# Source profile
profile.kind=LOCAL_SNAPSHOT          # LOCAL_SNAPSHOT | GITHUB_REPOSITORY
profile.admissibility=GOVERNED       # must be GOVERNED
profile.resolution=DETERMINISTIC     # must be DETERMINISTIC

# Externalized source binding
source_path=<absolute_path>          # evidence snapshot root
output_root=<absolute_path>          # target run namespace (must not exist)
reference_run=<absolute_path>        # reference run for zero-delta comparison

# Delegation chain
orchestration_launcher=<absolute_path>  # scripts/pios/ig4/orchestration_launcher.sh

# Adapter modes
github.mode=ENABLED                  # ENABLED | DISABLED
jira.mode=CAPSULE                    # CAPSULE only

# Execution modes
run.mode=SOURCE_PROFILED_INGESTION   # SOURCE_PROFILED_INGESTION
execution.mode=CREATE_ONLY           # CREATE_ONLY
```

---

## 3. VALIDATION RULES

| Field | Validation |
|---|---|
| `profile.kind` | `LOCAL_SNAPSHOT` or `GITHUB_REPOSITORY` |
| `profile.admissibility` | Must be `GOVERNED` |
| `profile.resolution` | Must be `DETERMINISTIC` |
| `source_path` | Accessible directory |
| `output_root` | Must NOT exist |
| `reference_run` | Must exist |
| `orchestration_launcher` | Must exist and be executable |
| `run.mode` | Must be `SOURCE_PROFILED_INGESTION` |
| `execution.mode` | Must be `CREATE_ONLY` |

---

## 4. IG.5 RUN_07 INSTANCE

```
run_id=run_07_source_profiled_ingestion
baseline_anchor=pios-core-v0.4-final
branch=work/ig-foundation
profile.kind=LOCAL_SNAPSHOT
profile.admissibility=GOVERNED
profile.resolution=DETERMINISTIC
source_path=/Users/khorrix/Projects/blueedge-program-intelligence/source-v3.23
output_root=/Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_07_source_profiled_ingestion
reference_run=/Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_06_orchestrated_ingestion
orchestration_launcher=/Users/khorrix/Projects/k-pi-core/scripts/pios/ig4/orchestration_launcher.sh
github.mode=ENABLED
jira.mode=CAPSULE
run.mode=SOURCE_PROFILED_INGESTION
execution.mode=CREATE_ONLY
```
