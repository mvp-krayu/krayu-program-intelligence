# Remediation Plan
## PI.LENS.ORCHESTRATED-BLUEEDGE.BASELINE-DELTA-ANALYSIS.01 — BLOCK_J

**Generated:** 2026-05-01  
**Mode:** FORENSIC / READ_ONLY  
**Classification:** STRUCTURAL_TOPOLOGY_DELTA (primary) + SCHEMA_BRIDGE_BUG (secondary)

---

## 1. Orchestrated Run Status

**Status: REJECTED — NON-CANONICAL**

`run_be_orchestrated_01` is NOT a valid replacement for the baseline. The signal values, primary domain, and pressure zone count are all incorrect relative to the established baseline because the orchestrator computes signals from a synthetic CEU-DOM binding_envelope topology instead of the real 40.3 structural import topology.

This run must NOT be used as:
- A basis for FastAPI integration
- A production-bound canonical run
- A regression baseline

---

## 2. Selector Action

**Action: REVERT selector to prior canonical run**

```
clients/blueedge/lens/selector/selector.json
  current_run: run_blueedge_rerun_01   ← REVERT TO THIS
```

`run_be_orchestrated_01` must be removed from `current_run`. It may remain in `available_runs` with a `status: REJECTED_NON_CANONICAL` label, but must not serve as the active run for any downstream consumer.

The prior canonical baseline (`run_blueedge_rerun_01`) must be restored as `current_run`.

---

## 3. FastAPI Integration Status

**Status: BLOCKED**

FastAPI integration (PI.LENS.END-TO-END-RERUN.FASTAPI.01 or equivalent) is blocked until:
1. The orchestrated signal computation pathway is corrected (see Issue 1 below)
2. A new orchestrated run is produced that achieves signal parity with the baseline
3. The schema bridge bug is patched (see Issue 2 below)
4. The new run passes the delta analysis re-check

---

## 4. Issues Requiring Resolution

### Issue 1 — PRIMARY: Signal Computation Input (STRUCTURAL_TOPOLOGY_DELTA)

**Root cause:** `compute_condition_correlation.py` (invoked by `run_end_to_end.py`) receives `binding_envelope.json` with synthetic CEU-DOM topology (33 nodes, 29 edges, GROUNDS/EXPOSES relations). It computes signal z-scores from this synthetic graph instead of the real structural import graph.

**Correct signal computation basis:**
- Input: `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/` structural topology artifacts (40.3/structural_topology_log.json or equivalent — 35 nodes, 1937 IMPORTS relations)
- Population: per_node_outbound_imports (35 nodes)
- Outlier: NODE-0021 IMPORTS=69

**Required fix in run_client_pipeline.py:**
Phase 5 (`phase_05_build_binding_envelope`) must be redesigned to either:
- (a) Build a binding_envelope that encodes real import counts per node so that compute_condition_correlation.py can compute correct z-scores, OR
- (b) Pre-populate the condition_correlation_state.json from 40.3 data directly (bypassing compute_condition_correlation.py's graph traversal), feeding it as an authoritative input to the subsequent pipeline steps

**Contract authority required:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01

### Issue 2 — SECONDARY: Schema Bridge Bug (SCHEMA_BRIDGE_BUG)

**Root cause:** `phase_08a_vault` in `run_client_pipeline.py` line ~645:
```python
# CURRENT (BUGGY):
active_count = sum(1 for s in vault_signals if s.get('activation_state') in ('HIGH', 'ACTIVATED', 'ACTIVE'))

# CORRECT:
active_count = sum(
    1 for s in vault_signals
    if s.get('activation_state') == 'HIGH'
    or (s.get('activation_state') in ('ACTIVATED', 'ACTIVE') and s.get('activation_method') != 'THEORETICAL_BASELINE')
)
```

**Impact:** `vault/signal_registry.json active_pressure_signals` shows 4 instead of 3. Low severity — does not affect rendered report but is a data quality issue in the vault artifact.

**Contract authority required:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01

---

## 5. Remediation Sequence

```
Step 1: Revert selector.json → current_run: run_blueedge_rerun_01
Step 2: Issue PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01
  Step 2a: Fix Phase 5 signal computation input (Issue 1)
  Step 2b: Fix Phase 8a active_count filter (Issue 2)
Step 3: Re-execute orchestrator → new run (run_be_orchestrated_02 or similar)
Step 4: Re-run delta analysis (or spot-check) to confirm signal parity
Step 5: If parity confirmed → promote new run → unblock FastAPI
```

---

## 6. What This Delta Does NOT Require

- Baseline vault/signal_registry_fastapi_compatible.json does NOT need modification
- CEU grounding does NOT need modification (CEU_MATCH confirmed)
- DOM layer does NOT need modification
- Score (60/CONDITIONAL) does NOT need modification
- Report template does NOT need modification
- lens_report_generator.py does NOT need modification (PSIG-006 renders correctly)

---

## 7. Governance Note

This remediation plan is READ_ONLY output. No file mutations have been made to selectors, vaults, or run artifacts as part of this forensic analysis.

All remediation actions require a new authorized contract (PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01) before execution.
