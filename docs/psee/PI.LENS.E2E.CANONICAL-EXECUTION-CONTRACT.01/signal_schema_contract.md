# Signal Schema Contract
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_F

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. Three-Class Signal Model

All signals in the PSEE pipeline are classified into exactly one of three classes:

| Class | Count Field | Classification Criteria |
|-------|-------------|------------------------|
| **Active Pressure Signal** | `active_pressure_signals` | `activation_state == "HIGH"` OR (`activation_state in ["ACTIVATED", "ACTIVE"]` AND `activation_method != "THEORETICAL_BASELINE"`) |
| **Telemetry / Baseline Signal** | `telemetry_signals` | Any signal not meeting active criteria — including THEORETICAL_BASELINE signals |
| **Not Activated** | `signals_not_activated[]` | Signals present in the registry but without activation — listed separately |

**Invariant:** `active_pressure_signals + telemetry_signals == total_signals`

---

## 2. Schema Bridge Fix — active_count Formula

**Fixed formula (post PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 BLOCK_C):**

```python
active_count = sum(
    1 for s in vault_signals
    if s.get("activation_state") == "HIGH"
    or (
        s.get("activation_state") in ("ACTIVATED", "ACTIVE")
        and s.get("activation_method") != "THEORETICAL_BASELINE"
    )
)
```

**Pre-fix (buggy) formula:**
```python
# Incorrectly included THEORETICAL_BASELINE signals in active count
active_count = sum(
    1 for s in vault_signals
    if s.get("activation_state") in ("HIGH", "ACTIVATED", "ACTIVE")
)
```

**Effect of bug:** PSIG-006 (THEORETICAL_BASELINE/ACTIVATED) was counted as an active pressure signal → `active_pressure_signals=4` instead of correct 3.

**Fix applies to:** Both conformance path and synthetic path in `phase_08a_vault()`.

---

## 3. signal_registry.json Schema

```json
{
  "contract_id": "<contract_id>",
  "run_id": "<run_id>",
  "generated_date": "<YYYY-MM-DD>",
  "client_uuid": "<uuid>",
  "total_signals": <int>,
  "active_pressure_signals": <int>,
  "telemetry_signals": <int>,
  "signals": [
    {
      "signal_id": "PSIG-XXX",
      "label": "<human-readable label>",
      "activation_state": "HIGH | ACTIVATED | ACTIVE | BASELINE | NOT_ACTIVATED",
      "activation_method": "<method | THEORETICAL_BASELINE>",
      "z_score": <float | null>,
      "primary_entity": "<entity>",
      "population_type": "<type>",
      "source_traceability": "<source>"
    }
  ],
  "signals_not_activated": [...]
}
```

---

## 4. PSIG-006 Invariant (GUARDRAIL)

**PSIG-006 MUST always be classified as a BASELINE / THEORETICAL_BASELINE signal.**

| Property | Required Value |
|----------|----------------|
| `activation_state` | `"BASELINE"` |
| `activation_method` | `"THEORETICAL_BASELINE"` |
| `z_score` | `0` |
| Counted in `active_pressure_signals` | **NO** |
| Counted in `telemetry_signals` | YES |

**Violation condition:** If PSIG-006 appears in `active_pressure_signals` count or is listed without `activation_method == "THEORETICAL_BASELINE"`, the run is non-canonical and must be rejected.

**Root cause of prior violation:** `run_be_orchestrated_01` had `active_pressure_signals=4` due to the schema bridge bug. This run was rejected (REJECTED_NON_CANONICAL). Corrected in `run_be_orchestrated_fixup_01`.

---

## 5. Canonical BlueEdge Signal Values (Anchor Reference)

These are the canonical values as of `run_be_orchestrated_fixup_01`. Any future BlueEdge run must reproduce these values exactly or fail parity.

| Signal | z_score | activation_state | Classification |
|--------|---------|-----------------|----------------|
| PSIG-001 | 5.663 | HIGH | Active pressure signal |
| PSIG-002 | 3.2098 | HIGH | Active pressure signal |
| PSIG-004 | 2.1822 | HIGH | Active pressure signal |
| PSIG-006 | 0 | BASELINE / THEORETICAL_BASELINE | Telemetry / baseline |

**Summary counts:**
- `total_signals`: 4
- `active_pressure_signals`: 3
- `telemetry_signals`: 1

**Pressure zone:**
- `zone_id`: PZ-001
- `anchor_dom`: DOM-04
- `zone_class`: COMPOUND_ZONE
- `zone_count`: 1

**GAUGE score:**
- `score`: 60
- `verdict`: CONDITIONAL
- `action`: INVESTIGATE

**Authority:** PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01  
**Parity proof:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 BLOCK_F (14/14 PASS)

---

## 6. Signal Schema Compatibility Rules

1. `signal_registry.json` produced by the conformance path preserves all fields from `signal_registry_fastapi_compatible.json` including `label`, `population_type`, `primary_entity`, and `source_traceability`.
2. `signal_registry.json` produced by the synthetic path derives fields from `signal_projection.json` — field completeness depends on the synthetic path implementation.
3. `active_count` formula (schema bridge fix) must be applied in **both** paths.
4. Any change to the three-class model or active_count formula requires a new fixup contract with parity validation.

---

## 7. signals_not_activated Format

```json
"signals_not_activated": [
  {
    "signal_id": "PSIG-XXX",
    "reason": "<reason for non-activation>"
  }
]
```

This list is populated from `signal_projection.json`'s `signals_not_activated` field on the conformance path, or from the synthetic signal projection on the synthetic path.
