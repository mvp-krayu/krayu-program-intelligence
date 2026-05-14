# Entrypoint Definition
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-CLOSURE.01

**Date:** 2026-05-03
**Baseline tag:** lens-e2e-stable-v1

---

## Canonical Entrypoint

```bash
bash scripts/pios/lens_e2e_assemble.sh \
  --client blueedge \
  --source source_01 \
  --run run_blueedge_e2e_execute_01 \
  --mode execute
```

---

## Usage Contexts

| Context | Command |
|---------|---------|
| Demo | above |
| Validation | above |
| Product execution | above |
| Re-run (idempotent) | above — identical command |

All contexts use the identical command. Idempotency ensures re-runs are safe.

---

## Arguments

| Argument | Value | Description |
|----------|-------|-------------|
| --client | blueedge | client identifier |
| --source | source_01 | source identifier |
| --run | run_blueedge_e2e_execute_01 | execution run target |
| --mode | execute | execution mode |

---

## Expected Output

Wrapper prints stage-by-stage status:
```
[STAGE 00] Source Extraction
[STAGE 01] Intake Validation
...
[STAGE 09] Runtime Validation

OVERALL STATUS: COMPLETE
```

Successful completion requires:
- all 10 stages exit 0
- OVERALL STATUS: COMPLETE printed
- 4 HTML reports present in reports/
- vault artifacts present
- Decision Surface contains EPB section
