# IG.3 — Bootstrap Input Schema

**Stream:** IG.3
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. FORMAT

Bootstrap inputs are supplied as a key=value file (one field per line). Comments begin with `#`. Empty lines are ignored.

---

## 2. SCHEMA

```
# IG Bootstrap Input Schema v1.0
# Required for all bootstrap_launcher.sh invocations

# Run identity
run_id=<string>                   # e.g. run_05_bootstrap_pipeline
baseline_anchor=<git_tag>         # e.g. pios-core-v0.4-final
branch=<branch_name>              # must be work/ig-foundation

# Paths
source_path=<absolute_path>       # e.g. /Users/khorrix/Projects/blueedge-program-intelligence/source-v3.23
output_root=<absolute_path>       # e.g. /Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_05_bootstrap_pipeline
reference_run=<absolute_path>     # e.g. /Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_04_adapter_simulation

# Source mode
source.kind=LOCAL_SNAPSHOT        # LOCAL_SNAPSHOT | GITHUB

# Adapter modes
github.mode=ENABLED               # ENABLED | DISABLED
jira.mode=CAPSULE                 # CAPSULE only

# Execution modes
run.mode=BOOTSTRAP_PIPELINE       # BOOTSTRAP_PIPELINE
execution.mode=CREATE_ONLY        # CREATE_ONLY
```

---

## 3. VALIDATION RULES

| Field | Validation |
|---|---|
| `run_id` | Non-empty; must match target directory basename |
| `baseline_anchor` | Must resolve via `git rev-parse <anchor>` |
| `branch` | Must equal `work/ig-foundation` |
| `source_path` | Must be accessible directory |
| `output_root` | Must NOT exist (CREATE_ONLY) |
| `reference_run` | Must exist (comparison target) |
| `source.kind` | Must be `LOCAL_SNAPSHOT` or `GITHUB` |
| `github.mode` | Must be `ENABLED` or `DISABLED` |
| `jira.mode` | Must be `CAPSULE` |
| `run.mode` | Must be `BOOTSTRAP_PIPELINE` |
| `execution.mode` | Must be `CREATE_ONLY` |

---

## 4. IG.3 RUN_05 INSTANCE

The canonical input schema for run_05:

```
run_id=run_05_bootstrap_pipeline
baseline_anchor=pios-core-v0.4-final
branch=work/ig-foundation
source_path=/Users/khorrix/Projects/blueedge-program-intelligence/source-v3.23
output_root=/Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_05_bootstrap_pipeline
reference_run=/Users/khorrix/Projects/k-pi-core/docs/pios/runs/run_04_adapter_simulation
source.kind=LOCAL_SNAPSHOT
github.mode=ENABLED
jira.mode=CAPSULE
run.mode=BOOTSTRAP_PIPELINE
execution.mode=CREATE_ONLY
```
