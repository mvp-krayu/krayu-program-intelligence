# Schema Bridge Fix
## PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 — BLOCK_C

**Generated:** 2026-05-01  
**File patched:** `scripts/pios/run_client_pipeline.py`  
**Function:** `phase_08a_vault`

---

## Bug Fixed

```python
# BEFORE (BUGGY) — line ~651 in original:
active_count = sum(
    1 for s in vault_signals if s.get("activation_state") in ("HIGH", "ACTIVATED", "ACTIVE")
)

# AFTER (CORRECT):
active_count = sum(
    1 for s in vault_signals
    if s.get("activation_state") == "HIGH"
    or (s.get("activation_state") in ("ACTIVATED", "ACTIVE")
        and s.get("activation_method") != "THEORETICAL_BASELINE")
)
```

## Why This Was Wrong

`active_conditions_in_scope[]` in signal_projection.json contains ALL activated signals, including THEORETICAL_BASELINE conditions. PSIG-006 has `activation_state=ACTIVATED` and `activation_method=THEORETICAL_BASELINE`. THEORETICAL_BASELINE signals are structural telemetry markers — not pressure candidates.

The schema bridge must preserve the three-class signal model:

| Class | Derivation | Example |
|-------|-----------|---------|
| `active pressure signal` | activation_state=HIGH OR (activation_state=ACTIVATED/ACTIVE AND activation_method≠THEORETICAL_BASELINE) | PSIG-001, PSIG-002, PSIG-004 |
| `baseline signal` | activation_state=ACTIVATED AND activation_method=THEORETICAL_BASELINE | PSIG-006 |
| `not activated signal` | signals_not_activated[] field | PSIG-003, PSIG-005 |

## Fix Applied In Both Code Paths

The fix is applied in both code paths in `phase_08a_vault`:
1. **Conformance path** (when `fastapi_conformance_path` is set): active_count computed from conformance registry signals using the corrected filter
2. **Synthetic path** (when no conformance path): active_count computed from 41.x/signal_projection.json using the corrected filter

## Validation

After fix: `active_pressure_signals = 3` (PSIG-001 + PSIG-002 + PSIG-004)  
After fix: PSIG-006 counted as `telemetry_signals = 1` (THEORETICAL_BASELINE)  
No PSIG IDs hardcoded — logic is signal-class-based, not ID-based  
No client-specific branch logic — applies to all signals in all clients
