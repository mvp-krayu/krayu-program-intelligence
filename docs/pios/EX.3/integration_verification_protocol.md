# EX.3 — Integration Verification Protocol

**Stream:** EX.3 — Runtime Integration & System Bridge (Default Path Binding)
**Artifact type:** INTEGRATION VERIFICATION PROTOCOL
**Date:** 2026-04-03
**Authority:** EX.3

---

## 1. PURPOSE

This document defines the verification protocol for the EX.3 runtime integration.
It supplements the EX.1 verification protocol with integration-specific checks.

---

## 2. INTEGRATION VERIFICATION ARTIFACT

**Script:** Inline deterministic checks (below), executable via standard Python.
**Coverage:** All 3 default runtime routes (query, overview, topology).
**Basis:** EX.1 baseline (COND-001..008 tiers, DIAG-001..008 states).

---

## 3. BASELINE VERIFICATION RUN

**Date:** 2026-04-03
**Engine commit:** `ed95c81` (PiOS v0.4 EXECUTABLE-PROVEN)
**Telemetry:** STATIC_BASELINE

### Query route (all 10 queries)

| Query | Signals | CE.4 present | CE.5 present | CE.2 present | Result |
|---|---|---|---|---|---|
| GQ-001 | SIG-002 | YES (null — aggregate) | YES (null) | YES (BLOCKED) | PASS |
| GQ-002 | 2 signals | YES | YES | YES | PASS |
| GQ-003 | SIG-003, SIG-004 | COMPLETE, COMPLETE | AVAILABLE, AVAILABLE | STABLE, STABLE | PASS |
| GQ-004 | 1 signal | YES | YES | YES | PASS |
| GQ-005 | SIG-003, SIG-005 | COMPLETE, PARTIAL | AVAILABLE, PARTIAL | STABLE, STABLE | PASS |
| GQ-006 | 1 signal | YES | YES | YES | PASS |
| GQ-007 | 2 signals | YES | YES | YES | PASS |
| GQ-008 | 1 signal | YES | YES | YES | PASS |
| GQ-009 | 2 signals | YES | YES | YES | PASS |
| GQ-010 | 2 signals | YES | YES | YES | PASS |

All 10 queries: PASS.

### Overview route

| Metric | value_source | CE4 state | CE2 tier | Result |
|---|---|---|---|---|
| dependency_load | live_engine | COMPLETE | STABLE | PASS |
| structural_density | live_engine | COMPLETE | STABLE | PASS |
| coordination_pressure | live_engine | PARTIAL | STABLE | PASS |
| visibility_deficit | static_extraction | null (aggregate) | BLOCKED | PASS |

### Topology route

| Check | Result |
|---|---|
| pios_summary present | PASS |
| run_id non-null | PASS |
| 8 condition tiers present | PASS |
| 8 diagnosis states present | PASS |
| blocked_condition_count = 2 | PASS |
| blocked_diagnosis_count = 2 | PASS |
| Existing topology fields preserved | PASS |

**Overall verification verdict: PASS**

---

## 4. PROTOCOL FOR FUTURE VERIFICATION RUNS

### When to run

Run before:
- Any claim that the default runtime routes use live PiOS outputs
- Any GC-002 change to pios_bridge.py or any 42.x adapter
- Any GC-003 change to L3_TO_ENGINE or L3_METRIC_LIVE_FIELDS mappings
- Any EX.2 integration that depends on runtime route outputs

### How to run

```bash
cd <repo_root>

# Query route
python3 scripts/pios/42.4/execlens_adapter.py GQ-003 | python3 -c "
import json,sys; d=json.load(sys.stdin)
for s in d['signals']:
    assert s.get('pios_run_id'), f'{s[\"signal_id\"]}: pios_run_id absent'
    assert s.get('pios_condition_tier') in ['BLOCKED','DEGRADED','AT_RISK','STABLE'], f'{s[\"signal_id\"]}: invalid tier'
print('Query route: PASS')
"

# Overview route
python3 scripts/pios/42.6/execlens_overview_adapter.py | python3 -c "
import json,sys; d=json.load(sys.stdin)
live = [m for m in d['metrics'] if m['value_source']=='live_engine']
assert len(live) >= 3, f'Expected >=3 live_engine metrics, got {len(live)}'
print('Overview route: PASS')
"

# Topology route
python3 scripts/pios/42.7/execlens_topology_adapter.py | python3 -c "
import json,sys; d=json.load(sys.stdin)
ps=d['pios_summary']
assert ps['run_id'], 'pios_summary.run_id absent'
assert len(ps['condition_tiers'])==8, 'Expected 8 conditions'
assert len(ps['diagnosis_states'])==8, 'Expected 8 diagnoses'
print('Topology route: PASS')
"
```

### What constitutes a pass

All of the following must hold:
1. Every signal in every query response has `pios_run_id`, `pios_condition_tier`, `pios_diagnosis_state` (non-null)
2. CE.4 emission state is valid when non-null (i.e., for signals with direct engine mapping)
3. 42.6: `dependency_load`, `structural_density`, `coordination_pressure` all have `value_source: "live_engine"`
4. 42.7: `pios_summary.run_id` non-null, 8 condition tiers present, 8 diagnosis states present
5. For static baseline: condition tiers and diagnosis states match EX.1 certified baseline

### Regression anchor

Expected static baseline states (from EX.1 certified baseline):

| Condition | Expected tier |
|---|---|
| COND-001..004, 007..008 | STABLE |
| COND-005..006 | BLOCKED |

| Diagnosis | Expected state |
|---|---|
| DIAG-001..004, 007..008 | INACTIVE |
| DIAG-005..006 | BLOCKED |

Expected live metric values (static baseline):
- `dependency_load`: 0.682 (engine SIG-002)
- `structural_density`: 1.273 (engine SIG-004)
- `coordination_pressure`: 0.875 (engine SIG-001)

Deviation from these values on a static baseline run = REGRESSION DETECTED.

### What to do on failure

1. Identify which route failed (query/overview/topology)
2. Check pios_bridge.get_live_pios_data() in isolation:
   `python3 scripts/pios/EX.1A/pios_live_adapter.py | python3 -m json.tool`
3. If bridge fails: engine issue — open CE.11 GC-002
4. If bridge passes but route fails: mapping issue — check L3_TO_ENGINE or L3_METRIC_LIVE_FIELDS
5. Do not claim runtime conformity until PASS achieved

---

## 5. LIMITATIONS

- This protocol covers only the default runtime routes (query/overview/topology)
- Missing adapter routes (?status, ?enl, ?persona) are not verified here — they remain 400
- WOW chain (42.23/42.22) vocabulary conformity is not verified here — see BD-002 / G-006
- RB-007 (validation_result.json per invocation) is not produced by the bridge — see EG-001
