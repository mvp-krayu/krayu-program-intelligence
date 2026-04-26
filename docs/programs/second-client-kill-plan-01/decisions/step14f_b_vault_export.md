# Governance Trace — STEP 14F-B Vault Export
## PI.SECOND-CLIENT.STEP14F-B.VAULT-EXPORT.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14F-B.VAULT-EXPORT.01
**Branch:** work/psee-runtime
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Command Executed

```
python3 scripts/pios/vault_export.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run run_01_oss_fastapi \
  --debug
```

Tool exit: `VALIDATION PASS`

Tool stdout payload:
```json
{
  "status": "EXPORTED",
  "client": "e65d2f0a-dfa7-4257-9333-fcbb583f0880",
  "run": "run_01_oss_fastapi",
  "claims": 27,
  "artifacts": 7,
  "signals": 5,
  "entities": 5,
  "out_dir": "app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi"
}
```

---

## vault_index.json — signals section

```json
{
  "PSIG-001": "CLM-20",
  "PSIG-002": "CLM-21",
  "PSIG-004": "CLM-22",
  "PSIG-006": "CLM-23",
  "PSIG-003": "CLM-24"
}
```

No SIG-001..SIG-005 keys present.

---

## Output Directory

| Path | Contents |
|---|---|
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` | Created |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/index.html` | Created |
| `.../claims/*.html` | 27 files |
| `.../artifacts/*.html` | 7 files |
| `.../entities/*.html` | 5 files |
| `.../transformations/*.html` | 6 files |
| `.../navigation/*.html` | 3 files |
| **Total HTML** | **48 files** |

---

## Validation Results

| Check | Detail | Result |
|---|---|---|
| V1: signals section contains PSIG-XXX keys | {PSIG-001→CLM-20, PSIG-002→CLM-21, PSIG-004→CLM-22, PSIG-006→CLM-23, PSIG-003→CLM-24} | PASS |
| V2: No SIG-001..SIG-005 legacy keys | grep `^SIG-\d+$` on signals keys → 0 matches | PASS |
| V3: Each PSIG resolves to existing CLM HTML | All 5 PSIG→CLM→HTML chains confirmed on disk | PASS |
| V3a: vault_export validate_export() | claims=27 ≥27; artifacts=7 ≥7; signals=5 >0 | PASS |
| V4: BlueEdge regex compatibility | SIG-001..SIG-005 labels still match `(?:PSIG-|SIG-)\d+` | PASS |
| V4b: BlueEdge vault output untouched | No BlueEdge vault JSON files modified after vault_export.py patch | PASS |
| V5: workspace resolveVaultLink dry-check | PSIG-001/002/003/004/006 all resolve to valid URLs; SIG-001 returns None | PASS |
| **Total checks: 7** | | **PASS: 7 / FAIL: 0** |

---

## Workspace Compatibility

`resolveVaultLink("signal", "PSIG-001", vaultIndex)` →
`/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/claims/CLM-20.html`

All PZ-XXX zone vault signal links will resolve. "NOT EXPORTED" state is eliminated for second-client EVIDENCE mode.

---

## Regression Confirmation

- BlueEdge vault directory (`app/gauge-product/public/vault/blueedge/`) — NOT modified
- vault_export.py regex change is additive; SIG-XXX labels in BlueEdge vault claims continue to match
- No BlueEdge vault files have a newer mtime than vault_export.py

---

## Files Produced

| File | Action |
|---|---|
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json` | Created |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/index.html` | Created |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/claims/CLM-01..CLM-27.html` | Created (27 files) |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/artifacts/ART-01..ART-07.html` | Created (7 files) |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/entities/ENT-*.html` | Created (5 files) |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/transformations/TRN-01..TRN-06.html` | Created (6 files) |
| `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/navigation/NAV-*.html` | Created (3 files) |
| `docs/programs/second-client-kill-plan-01/decisions/step14f_b_vault_export.md` | Created — this governance trace |

## Files NOT Modified

- All vault claim source files (CLM-*.md): unchanged
- All 75.x / 41.x artifacts: unchanged
- workspace.js: unchanged
- BlueEdge vault files: unchanged

---

## Governance Confirmation

- No interpretation created, inferred, or synthesized
- No source vault claims modified
- No 75.x or 41.x artifacts modified
- No workspace or graph state modified
- Vault export executed against second-client source only
- Stream: PI.SECOND-CLIENT.STEP14F-B.VAULT-EXPORT.01
