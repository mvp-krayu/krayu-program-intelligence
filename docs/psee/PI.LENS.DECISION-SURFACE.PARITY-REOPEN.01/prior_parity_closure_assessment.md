# Prior Parity Closure Assessment
## PI.LENS.DECISION-SURFACE.PARITY-REOPEN.01

**Date:** 2026-05-02

---

## Assessment: PARTIALLY_INVALID_DECISION_ONLY

---

## What the Prior Closure Claimed

PI.LENS.REPORT-RENDERER.PARITY-CLOSURE.01 declared:
> "BlueEdge report renderer parity is closed."
> Decision Surface: NORMALIZED_PARITY (volatile run-id metadata only)

This was based on the DRIFT-REMEDIATION.01 validation which used:
```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_blueedge_productized_01/vault \
  --semantic-bundle-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/ \
  --output-dir /tmp/blueedge_report_drift_remediation_01
```

In this invocation, `--package-dir` is the DIRECT path `run_blueedge_productized_01/vault`. Therefore:
- `CANONICAL_PKG_DIR.parent = run_blueedge_productized_01`
- `41.x/grounded/` exists there
- `pz_proj` and `psig_proj` loaded successfully
- EPB block rendered
- Decision Surface parity: NORMALIZED_PARITY (run-id volatile only)

---

## What Changed

PI.LENS.GENERATE.WRAPPER.01 (subsequent stream) created:
- Symlink: `run_blueedge_productized_01_fixed/vault → ../run_blueedge_productized_01/vault`
- Wrapper script using `VAULT_DIR=clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/vault`

The wrapper-invoked generation passes the symlink path as `--package-dir`. This routes `CANONICAL_PKG_DIR.parent` through `run_blueedge_productized_01_fixed` instead of `run_blueedge_productized_01`, making 41.x data unreachable.

---

## Closure Validity Assessment

| Claim | Valid? |
|-------|--------|
| TIER1_NARRATIVE byte parity | STILL_VALID — Tier1 path unaffected by 41.x lookup |
| TIER1_EVIDENCE byte parity | STILL_VALID — Tier1/Tier2 path unaffected |
| TIER2_DIAGNOSTIC byte parity | STILL_VALID — Tier2 path unaffected |
| DECISION_SURFACE normalized parity | INVALID for wrapper invocation |

The prior parity closure was valid for the specific invocation used in DRIFT-REMEDIATION.01 (direct vault path). It is NOT valid for the wrapper invocation (symlink vault path).

---

## Scope of Invalidity

- Tier1 / Tier2 reports: UNAFFECTED (41.x projection data is not used in their rendering paths)
- Decision Surface: FAIL under wrapper invocation

Prior closure status: **PARTIALLY_INVALID_DECISION_ONLY**

---

## Root Cause of Invalidation

The PARITY-CLOSURE.01 closed parity against a specific invocation command. PI.LENS.GENERATE.WRAPPER.01 introduced a new invocation path (via symlink vault) that was not validated against canonical parity. The wrapper validation confirmed report generation but did not confirm canonical parity of the decision surface.
