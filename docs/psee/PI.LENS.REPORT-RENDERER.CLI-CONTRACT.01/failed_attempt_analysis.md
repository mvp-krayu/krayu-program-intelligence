# Failed Attempt Analysis
## PI.LENS.REPORT-RENDERER.CLI-CONTRACT.01

**Generated:** 2026-05-01
**Reference Contract:** PI.LENS.BLUEEDGE-REPORT-PARITY-ENFORCEMENT.01

---

## Failed Command

```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_be_orchestrated_fixup_01 \
  --output-dir /tmp/blueedge_parity_check
```

**Exit Code:** 1

**Error Message:**
```
[PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01] FAIL: Canonical package directory not found:
/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/package
```

---

## Root Cause Analysis

### Cause 1: Missing `--package-dir` Flag

Without `--package-dir`, `_configure_runtime()` sets:
```python
CANONICAL_PKG_DIR = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "package"
```

For `--run-id run_be_orchestrated_fixup_01`, this resolves to:
```
clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/package
```

This path does **not exist**. The vault for this run is at:
```
clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/
```

### Cause 2: Incorrect `--run-id` for HTML Identity

`--run-id run_be_orchestrated_fixup_01` sets `_ACTIVE_VAULT_RUN_ID = "run_be_orchestrated_fixup_01"`, which would be embedded in HTML nav links. The canonical reports were produced with `run_blueedge_productized_01_fixed` as the active run ID.

For parity reproduction, `--run-id run_blueedge_productized_01_fixed` is required.

---

## Fix Applied in Canonical Command

Both causes corrected:
```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault \
  --output-dir /tmp/blueedge_report_renderer_cli_contract
```

Changes:
1. Added `--package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault` → resolves CANONICAL_PKG_DIR to the existing vault directory
2. Changed `--run-id` to `run_blueedge_productized_01_fixed` → embeds correct run identity in HTML nav links

---

## Confirmation: `load_all_payloads()` Not Invoked

`load_all_payloads()` (line 6946) is inside `_main_legacy()` only.
The tier1/tier2/decision generation paths do NOT call it.
No API server required. No FRAGMENTS_DIR required.
