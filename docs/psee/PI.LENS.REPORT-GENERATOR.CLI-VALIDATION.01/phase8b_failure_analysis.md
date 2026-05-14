# Phase 8b Failure Analysis
## PI.LENS.REPORT-GENERATOR.CLI-VALIDATION.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Failure Log (from previous pipeline run)

```
[PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01] FAIL: No vault_index.json found for client 'fastapi' in app vault
  [LEGACY] signal_projection.json → 41.x/signal_projection.json
  [LEGACY] pressure_zone_projection.json → 41.x/pressure_zone_projection.json
```

## Root Cause

**Phase 8b invokes `lens_report_generator.py` without `--deliverable` flag.**

Without `--deliverable`, `main()` generates ALL surfaces:
```python
# main() default path (no deliverable):
generate_tier1_reports(output_dir=t1_dir)    # PASS
generate_tier2_reports(output_dir=t2_dir)    # FAIL ← here
generate_decision_surface(output_dir=ds_dir) # never reached
```

`generate_tier2_reports()` calls `_resolve_vault_index_for_graph()` which looks in:
```
app/gauge-product/public/vault/fastapi/<run_id>/vault_index.json  → NOT FOUND
app/gauge-product/public/vault/fastapi/                            → DIRECTORY DOES NOT EXIST
```

## Why `fastapi/` Directory Does Not Exist

The FastAPI client was published to the app vault using its UUID as the directory key:
```
app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/vault_index.json
```

The generic pipeline uses `fastapi` as the client slug (from `client.yaml`). This slug → UUID
mapping gap means `_resolve_vault_index_for_graph()` cannot find the FastAPI vault in the app.

## Phase 8b Invocation (current)

```python
cmd = [
    sys.executable, str(script),
    "--client", alias,               # "fastapi"
    "--run-id", run_id,              # "run_02_oss_fastapi_pipeline"
    "--package-dir", vault_dir,      # ".../vault"
    "--output-root", output_root,    # ".../lens/runs/run_02_oss_fastapi_pipeline"
]
```

No `--deliverable` → all surfaces generated → Tier-2 fails.

## What Tier-1 and Decision Produce Successfully Before Tier-2 Fails

Phase 8b's logs before failure showed Tier-1 reports DID generate (4 files written to tier1/).
The process exits 1 only when `generate_tier2_reports()` fails. Tier-1 output is preserved.

## Fix Options

### Option A — Minimal (recommended): Add `--deliverable tier1` to Phase 8b

```python
cmd = [
    sys.executable, str(script),
    "--client", alias,
    "--run-id", run_id,
    "--package-dir", vault_dir,
    "--output-root", output_root,
    "--deliverable", "tier1",    # ADD THIS
]
```

Impact: Phase 8b generates Tier-1 reports only. Tier-2 deferred until vault published to app.
This unblocks Phase 8b and Phase 9 for all generic pipeline clients.
BlueEdge is unaffected (BlueEdge has vault_index.json → Tier-2 would pass anyway, but removing it
from Phase 8b is cleaner for multi-client generalization).

### Option B — Publish FastAPI vault to app under slug

Create `app/gauge-product/public/vault/fastapi/<run_id>/vault_index.json` for the generic run.
This is a product-layer publishing step — out of scope for this contract.

### Option C — Use UUID as Phase 8b client for vault resolution only

Pass UUID to report generator. Adds UUID→slug mapping complexity. NOT recommended.

## Recommended Fix Scope

Option A is within Phase 8b's scope (a 1-line orchestrator change — add `--deliverable tier1`).
This aligns with the multi-client generic pipeline model: Tier-2 requires app publishing (product
layer), which is not a pipeline gate.

The fix should be documented as:
- Tier-2 is a product-layer deliverable requiring vault publishing
- Phase 8b default generates Tier-1 (pipeline-native)
- Tier-2 requires a separate vault-publishing contract before it can be generated
