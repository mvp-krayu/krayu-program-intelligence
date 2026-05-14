# Difference Log
## PI.LENS.BLUEEDGE-REPORT-PARITY-ENFORCEMENT.01

**Generated:** 2026-05-01
**Status:** FAIL-CLOSED — generator failure, no comparison possible

---

## Step 2 Failure — Generator Exit Code 1

**Command executed (exactly as specified):**

```
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_be_orchestrated_fixup_01 \
  --output-dir /tmp/blueedge_parity_check
```

**Error output:**

```
[PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01] FAIL: Canonical package directory not found:
/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/package
```

---

## Root Cause

The generator script resolves vault artifacts from a `package/` directory when `--package-dir` is not specified. This directory does not exist under `run_be_orchestrated_fixup_01/`:

```
clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/
├── 41.x/
├── 75.x/
├── binding/
└── vault/         ← vault is here, but 'package/' is absent
```

The prior validated command (from `PI.LENS.REPORT-GENERATOR.CLI-VALIDATION.01`) used:
```
--package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault
```

The contract's command omits this required flag. Without it, the script fails before generating any reports.

---

## Parity Comparison

**Not performed.** No generated reports exist. The comparison between canonical and generated metrics cannot be executed under the contract's NO RE-RUN / NO PATCH / NO WORKAROUND constraints.

---

## Required Action (Not Executed — Per FAIL-CLOSED)

To make this contract executable, the Step 2 command must include:

```
--package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault
```

This requires a contract amendment — not a workaround.
