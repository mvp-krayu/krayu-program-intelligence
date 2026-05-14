# Governance Trace — STEP 14F-A PSIG Vault Authority Repair
## PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
**Branch:** feature/next
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Problem Corrected

**Prior state:** CLM-20..CLM-24 contained BlueEdge SIG-001..SIG-005 placeholder claims with `NOT_AVAILABLE` / `BLOCKED` content. The second client has no SIG-XXX intelligence signals (signal_registry.json: `emission_state: NOT_EVALUATED`, `signals: []`). The vault was structurally valid but semantically incorrect:
- `claim_label` values used BlueEdge signal IDs (SIG-001..SIG-005)
- Claim bodies stated "Signal SIG-XXX not found in signal_registry.json for run run_01_oss_fastapi"
- `vault_export.py:scan_vault()` regex `r'SIG-\d+'` would match these and build a `signal_to_claim` map pointing to hollow claims
- workspace.js `resolveVaultLink("signal", "PSIG-001", vi)` → `vi.signals["PSIG-001"]` → NOT FOUND → "NOT EXPORTED" rendered for all PZ-XXX zone vault signal links

**Root cause:** Vault V3 structure was originally built using BlueEdge signal model (SIG-XXX intelligence signals). The second client's canonical signal authority is PSIG-XXX (75.x/41.x provisional CKR candidates). vault_export.py regex only recognized `SIG-\d+`, not `PSIG-\d+`.

---

## Actions Taken

### 1. CLM-20..CLM-24 — Signal claims rewritten

Five claim files removed and replaced. Filename and content updated to PSIG authority.

| Claim | Old label | New label | New content authority |
|---|---|---|---|
| CLM-20 | SIG-001 Sensor Bridge Throughput | PSIG-001 Inbound Dependency Fan-In Pressure | signal_value=9.43; HIGH; COND-PSIG-001-01 |
| CLM-21 | SIG-002 Platform Runtime State Seven Unknown Dimensions | PSIG-002 Outbound Fan-Out Pressure | signal_value=9.43; HIGH; COND-PSIG-002-01 |
| CLM-22 | SIG-003 Dependency Load 68 Percent | PSIG-004 Structural Surface Pressure | signal_value=4.33; HIGH; COND-PSIG-004-01 |
| CLM-23 | SIG-004 Structural Volatility Edge Density | PSIG-006 Structural Blind-Spot Activation | activation_ratio=0.20; ACTIVATED; COND-PSIG-006-01 |
| CLM-24 | SIG-005 Coordination Pressure Partial | PSIG-003 Inbound Coupling Ratio Not Activated | NOT_ACTIVATED; signals_not_activated |

All new claims have:
- `claim_type: signal` (unchanged — required by scan_vault)
- `claim_label: PSIG-XXX ...` (updated — matches new regex)
- Authoritative values from 75.x/41.x projection artifacts
- Full traceability chains to source contracts

### 2. vault_export.py — Two regex changes

**Line 42 — ID_RE (wiki-link resolution):**
```
Before: r'\b(ART-\d+|CLM-\d+|ENT-[\w-]+|TRN-\d+|SIG-\d+)\b'
After:  r'\b(ART-\d+|CLM-\d+|ENT-[\w-]+|TRN-\d+|(?:PSIG-|SIG-)\d+)\b'
```

**Line 341 — scan_vault() signal scan:**
```
Before: re.search(r'SIG-\d+', meta.get('claim_label', ''))
After:  re.search(r'(?:PSIG-|SIG-)\d+', meta.get('claim_label', ''))
```

Both changes are additive. BlueEdge SIG-XXX labels continue to match.

---

## Evidence Sources Used

| Artifact | Role |
|---|---|
| `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/41.x/signal_projection.json` | PSIG activation states, signal values, zone assignments |
| `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/75.x/condition_correlation_state.json` | Entity-level condition states, attribution roles |
| `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/75.x/pressure_zone_state.json` | Evidence traces per zone per signal |
| `clients/e65d2f0a.../psee/runs/run_01_oss_fastapi/41.x/pressure_zone_projection.json` | Zone→PSIG reference confirmation |

---

## Validation

| Check | Result |
|---|---|
| D.1: CLM-20..24 all have `claim_label: PSIG-XXX` | PASS |
| D.2: No `claim_label: SIG-` in second-client vault claims | PASS |
| D.3: Total claims = 27 (boundary maintained) | PASS |
| D.4: Signal-type claims = 5 | PASS |
| D.5: PSIG signal_to_claim = {PSIG-001→CLM-20, PSIG-002→CLM-21, PSIG-003→CLM-24, PSIG-004→CLM-22, PSIG-006→CLM-23} | PASS |
| D.6: BlueEdge regex compatibility — SIG-001, SIG-005 still match | PASS |
| D.7: CLM-01..CLM-19, CLM-25..CLM-27 stream_id = PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01 (untouched) | PASS |
| **Total checks: 7** | **PASS: 7 / FAIL: 0** |

---

## Files Modified / Created

| File | Action |
|---|---|
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-20 PSIG-001 Inbound Dependency Fan-In Pressure.md` | Created (replaces CLM-20 SIG-001...) |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-21 PSIG-002 Outbound Fan-Out Pressure.md` | Created (replaces CLM-21 SIG-002...) |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-22 PSIG-004 Structural Surface Pressure.md` | Created (replaces CLM-22 SIG-003...) |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-23 PSIG-006 Structural Blind-Spot Activation.md` | Created (replaces CLM-23 SIG-004...) |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-24 PSIG-003 Inbound Coupling Ratio Not Activated.md` | Created (replaces CLM-24 SIG-005...) |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-20 SIG-001 Sensor Bridge Throughput.md` | Deleted |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions.md` | Deleted |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-22 SIG-003 Dependency Load 68 Percent.md` | Deleted |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-23 SIG-004 Structural Volatility Edge Density.md` | Deleted |
| `clients/e65d2f0a.../vaults/run_01_oss_fastapi/claims/CLM-24 SIG-005 Coordination Pressure Partial.md` | Deleted |
| `scripts/pios/vault_export.py` | Modified — ID_RE and scan_vault() regex updated |
| `docs/programs/second-client-kill-plan-01/decisions/step14f_a_psig_vault_authority_repair.md` | Created — this governance trace |

## Files NOT Modified

- CLM-01..CLM-19: unchanged
- CLM-25..CLM-27: unchanged
- All artifacts (ART-01..ART-07): unchanged
- All entities (ENT-*): unchanged
- All transformations (TRN-01..TRN-06): unchanged
- All navigation files: unchanged
- tier2_query_engine.py: unchanged
- workspace.js: unchanged
- lens_report_generator.py: unchanged
- Any BlueEdge client vault files: unchanged

---

## Governance Confirmation

- No interpretation created, inferred, or synthesized
- No 75.x or 41.x artifacts modified
- No BlueEdge artifacts modified
- No vault_index.json created (STEP 14F-B scope)
- vault_export.py changes are additive (backward compatible)
- All PSIG claim content traces to governed 75.x/41.x source artifacts
- Claim count boundary (27) maintained
- Stream: PI.SECOND-CLIENT.STEP14F-A.PSIG-VAULT-AUTHORITY-REPAIR.01
