# EX.1A — Live Binding Remediation Map

**Stream:** EX.1A — Live Runtime Binding Remediation
**Artifact type:** LIVE BINDING REMEDIATION MAP
**Date:** 2026-04-03
**Authority:** EX.1A

---

## 1. PURPOSE

This document maps the minimum conformant live binding remediation implemented in EX.1A:
the exact components created, the data flow they establish, and the defects they address.

---

## 2. REMEDIATION COMPONENTS

### Component C-01 — pios_live_adapter.py

**File:** `scripts/pios/EX.1A/pios_live_adapter.py`
**Type:** GC-002 — new engine path addition
**CE.11 classification:** GC-002

**What it does:**
1. Generates a timestamped run_id (`EX1A_live_<YYYYMMDD_HHMMSS>`) unless overridden by `--run-id`
2. Invokes `pios/core/v0.1/engine/compute_signals.py <run_id>` via subprocess
3. Reads `runs/pios/40.5/<run_id>/signal_output.json`
4. Validates all signal states ∈ CE.4 vocabulary {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING}
5. Invokes `pios/core/v0.1/engine/activate_conditions.py <run_id> <signal_out_path>` via subprocess
6. Reads `runs/pios/40.6/<run_id>/condition_output.json`
7. Validates all condition_coverage_state values ∈ CE.2 tier vocabulary
8. Validates all diagnosis_activation_state values ∈ CE.2 diagnosis vocabulary
9. Emits structured JSON to stdout:
   - `run_id`, `telemetry_source`
   - `signals` (CE.4 states + output + traceability + partiality_reasons)
   - `ce5_consumption_records` (CE.5 C-001/C-002/C-003, PBE-1/PBE-2)
   - `ce5_traceability_records` (CE.5 T-001/T-002)
   - `conditions` (CE.2 DEC-009 tier, governing_signal, activation_state)
   - `diagnoses` (CE.2 DEC-014 activation state, condition_ref)
10. Exits 0 on success, 1 on any engine failure or vocabulary violation

**What it does NOT do:**
- Does not synthesize data (R3 compliant)
- Does not modify any engine output (no interposition — RB-002 compliant)
- Does not bypass CE.4/CE.5/CE.2 vocabulary validation
- Does not read static L3 artifacts for governed state values

---

### Component C-02 — ?pios_live=true route

**File:** `app/execlens-demo/pages/api/execlens.js` (modified — minimal addition)
**Type:** GC-002 — new binding surface
**CE.11 classification:** GC-002

**What was added:**
```javascript
// EX.1A — live PiOS engine binding adapter
const ADAPTER_EX1A = path.join(REPO_ROOT, 'scripts', 'pios', 'EX.1A', 'pios_live_adapter.py')
```
and in the handler:
```javascript
if (pios_live === 'true') {
  return runScript(ADAPTER_EX1A, [], res)
}
```

**Route contract:**
- `GET /api/execlens?pios_live=true`
- Returns: JSON governed output from live engine invocation
- No arguments passed to adapter (run_id is timestamped internally)
- Uses existing `runScript` handler (fail-closed, JSON-only output)

**What was NOT modified:**
- No existing routes changed
- No existing adapter constants changed
- No existing handler logic changed
- `runScript` function unchanged

---

## 3. DATA FLOW ESTABLISHED

```
GET /api/execlens?pios_live=true
    ↓
pages/api/execlens.js
    ↓  execFile('python3', [ADAPTER_EX1A])
scripts/pios/EX.1A/pios_live_adapter.py
    ↓  subprocess.run(['python3', ENGINE_COMPUTE, run_id])
pios/core/v0.1/engine/compute_signals.py
    ↓  writes
runs/pios/40.5/<run_id>/signal_output.json  [CE.4 signals]
    ↓  subprocess.run(['python3', ENGINE_ACTIVATE, run_id, signal_out_path])
pios/core/v0.1/engine/activate_conditions.py
    ↓  writes
runs/pios/40.6/<run_id>/condition_output.json  [CE.5/CE.2 outputs]
    ↓  reads + validates vocabulary
pios_live_adapter.py  ← validates CE.4, CE.5, CE.2 vocabulary in-flight
    ↓  JSON stdout
pages/api/execlens.js  ← JSON.parse(stdout) → res.status(200).json(data)
    ↓
HTTP response: governed JSON
```

---

## 4. DEFECTS ADDRESSED

| Defect | Class | EX.1A Status |
|---|---|---|
| BD-001 (BIND-001): Engine never invoked | CRITICAL | REMEDIATED — engine invoked per request |
| BD-003 (BIND-003): CE.5 records absent | CRITICAL | REMEDIATED — consumption + traceability records in response |
| BD-004 (BIND-006): Propagation states absent | CRITICAL | REMEDIATED — condition_coverage_state + diagnosis_activation_state in response |
| BD-002 (BIND-002): non-CE.4 signal_state in 42.22 | HIGH | NOT IN SCOPE — GC-003 + EX.3 |
| BD-005 (BIND-007): Missing adapters 42.13/42.15/42.16 | CRITICAL | NOT IN SCOPE — EX.3 ×3 |
| BD-006 (BIND-008): Verification absent | HIGH | PARTIALLY ADDRESSED (EX.1 verifier) |

---

## 5. BOUNDARY CONSTRAINTS (PER EX.1A CONTRACT)

**EX.1A DOES NOT:**
- Integrate live states into 42.4/42.6/42.7/42.23 existing adapters (EX.3 scope)
- Replace or modify existing query, overview, or topology surfaces
- Implement any adapter requiring a GC-001 governance contract (42.13, 42.15, 42.16)
- Change the 41.x static artifact reading behavior of any existing adapter

**EX.1A scope is strictly additive:** one new adapter script + one new API route handler.
Existing surfaces are unmodified.
