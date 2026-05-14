# Runtime Mapping Model
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-CLOSURE.01

**Date:** 2026-05-03
**Baseline tag:** lens-e2e-stable-v1

---

## Canonical Mapping

| Role | Run ID | Purpose |
|------|--------|---------|
| vault_run | run_blueedge_e2e_execute_01 | vault artifacts, reports, final output |
| semantic_run | run_blueedge_productized_01_fixed | semantic bundle (LOCKED_REFERENCE_INPUT) |
| report_run | run_blueedge_e2e_execute_01 | HTML report output destination |

---

## Path Bindings (lens_e2e_assemble.sh)

```bash
EXECUTE_RUN_ID="run_blueedge_e2e_execute_01"
SEMANTIC_RUN_ID="run_blueedge_productized_01_fixed"

EXEC_RUN_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$EXECUTE_RUN_ID"
EXEC_SEMANTIC_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$SEMANTIC_RUN_ID/semantic"
EXEC_REPORT_DIR="$EXEC_RUN_DIR/reports"
EXEC_VAULT_FOR_EXEC="$EXEC_RUN_DIR/vault"
```

---

## Rules

1. **Semantic is NEVER copied** — `run_blueedge_productized_01_fixed/semantic/` is read in-place as LOCKED_REFERENCE_INPUT; no write to execute run
2. **Reports are ALWAYS generated into execution run** — `run_blueedge_e2e_execute_01/reports/`
3. **Vault lives in execution run** — `run_blueedge_e2e_execute_01/vault/`
4. **Canonical runs remain untouched** — `run_blueedge_productized_01/`, `run_blueedge_productized_01_fixed/`, `run_be_orchestrated_fixup_01/`, `run_be_orchestrated_01/` are READ-ONLY references

---

## Stage 08 Explicit Invocation

```bash
python3 "$SCRIPTS_DIR/lens_report_generator.py" \
  --client "$CLIENT" \
  --run-id "$EXECUTE_RUN_ID" \
  --package-dir "$EXEC_VAULT_FOR_EXEC" \
  --semantic-bundle-dir "$EXEC_SEMANTIC_DIR" \
  --output-dir "$EXEC_REPORT_DIR"
```

Explicit `--package-dir`, `--semantic-bundle-dir`, and `--output-dir` arguments decouple report generation from co-location assumptions.
