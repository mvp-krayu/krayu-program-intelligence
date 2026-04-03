# EX.1A — Live Binding Verification Protocol

**Stream:** EX.1A — Live Runtime Binding Remediation
**Artifact type:** LIVE BINDING VERIFICATION PROTOCOL
**Date:** 2026-04-03
**Authority:** EX.1A

---

## 1. PURPOSE

This document defines the protocol for verifying the live binding path established by
EX.1A. It supplements the EX.1 verification protocol with live adapter-specific
verification steps.

---

## 2. EX.1A VERIFICATION ARTIFACT

**Script:** `scripts/pios/EX.1A/pios_live_adapter.py`
**Route:** `GET /api/execlens?pios_live=true`

**Self-verifying capabilities:**
1. Invokes certified engine (compute_signals.py → activate_conditions.py)
2. Validates all signal states ∈ CE.4 vocabulary in-flight (fails on violation)
3. Validates all condition_coverage_state values ∈ CE.2 tier vocabulary in-flight
4. Validates all diagnosis_activation_state values ∈ CE.2 diagnosis vocabulary in-flight
5. Exits 1 on any engine failure or vocabulary violation
6. Returns structured governed JSON on success

---

## 3. VERIFICATION BASELINE RUN

**Run ID:** `EX1A_verification_20260403`
**Date:** 2026-04-03
**Adapter:** `scripts/pios/EX.1A/pios_live_adapter.py --run-id EX1A_verification_20260403`
**Engine:** pios-governance-baseline-v0.4, commit `ed95c81`

**Result:**
- Exit code: 0 (PASS)
- All 8 CE.4 signal states: valid vocabulary ✓
- All 8 CE.5 consumption states: valid vocabulary ✓
- All 8 CE.5 traceability records: present ✓
- All 8 CE.2 condition tiers: valid vocabulary ✓
- All 8 CE.2 diagnosis states: valid vocabulary ✓
- Regression vs EX.1 baseline: PASS ✓

---

## 4. VERIFICATION PROTOCOL FOR FUTURE RUNS

### When to run

Run the live adapter in standalone mode and confirm correct output before:
- Any EX.3 integration that reads from the live adapter output
- Any change to `pios_live_adapter.py`
- Any CE.11 GC-002 change affecting the engine-to-adapter path
- Any claim that the `?pios_live=true` route is providing governed output

### How to run

```bash
cd <repo_root>
python3 scripts/pios/EX.1A/pios_live_adapter.py --run-id <run_id> | python3 -c "
import json, sys
data = json.load(sys.stdin)
signals = data.get('signals', {})
conditions = data.get('conditions', {})
diagnoses = data.get('diagnoses', {})
print(f'run_id: {data[\"run_id\"]}')
print(f'telemetry_source: {data[\"telemetry_source\"]}')
print(f'signals: {len(signals)}, conditions: {len(conditions)}, diagnoses: {len(diagnoses)}')
print(f'ce5_consumption: {len(data.get(\"ce5_consumption_records\", {}))}')
print(f'ce5_traceability: {len(data.get(\"ce5_traceability_records\", {}))}')
for k,v in conditions.items():
    print(f'  {k}: {v[\"condition_coverage_state\"]}')
for k,v in diagnoses.items():
    print(f'  {k}: {v[\"diagnosis_activation_state\"]}')
"
```

### What constitutes a pass

All of the following must hold:
1. Exit code 0 (no engine failure, no vocabulary violation)
2. Exactly 8 signal entries in `signals`
3. All 8 signal states ∈ {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING}
4. Exactly 8 records in `ce5_consumption_records`
5. Exactly 8 records in `ce5_traceability_records`
6. Exactly 8 entries in `conditions` with condition_coverage_state ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE}
7. Exactly 8 entries in `diagnoses` with diagnosis_activation_state ∈ {BLOCKED, ACTIVE, INACTIVE}
8. For static baseline runs: condition tiers and diagnosis states match EX.1 baseline

### Regression anchor

When using static baseline telemetry, condition and diagnosis states must match:

| Object | Expected State |
|---|---|
| COND-001..004, COND-007..008 | STABLE |
| COND-005..006 | BLOCKED |
| DIAG-001..004, DIAG-007..008 | INACTIVE |
| DIAG-005..006 | BLOCKED |

Deviation from these values on a static baseline run = REGRESSION DETECTED.
Open a CE.11 GC-002 stream to diagnose.

### What to do on failure

1. Note the exit code and error field in the JSON output
2. Check stderr for engine error messages
3. If vocabulary violation: the engine produced non-governed output — open CE.11 GC-002
4. If engine invocation failure: check engine script paths and Python environment
5. Halt all EX.3 integration work that depends on this adapter until resolved

---

## 5. LIMITATIONS OF THIS PROTOCOL

This live adapter:
- Does NOT produce a `validation_result.json` per EX.H1 RB-007 (that requires EX.1 verifier integration — G-013, EX.3 scope)
- Does NOT enforce RB-006 at every runtime invocation (the API route calls the adapter on demand, not on every request to other adapters)
- Does NOT validate that the 42.4/42.6/42.7/42.23 existing adapters are using live output (they are not — EX.3 scope)
- Covers STATIC_BASELINE telemetry only; live telemetry runs will produce different outputs (see EX.H1 RB-003 and EX.1 verification_protocol.md)
