# Canonical Run Validation Contract
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_I

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. What Makes a Run Canonical

A run is canonical if and only if ALL of the following conditions are met:

| Condition | Requirement |
|-----------|-------------|
| All 9 phases pass | exit_code=0 for all phases in the orchestrator |
| Signal values match parity reference | z_scores within ±0.001 of reference values (or exact match) |
| active_pressure_signals correct | Matches reference count (no THEORETICAL_BASELINE signals counted) |
| PSIG-006 classification correct | BASELINE / THEORETICAL_BASELINE / value=0 |
| Pressure zone structure correct | zone_id, anchor_dom, zone_class match reference |
| GAUGE score correct | score, verdict, action match reference |
| All vault artifacts present | 9 artifacts under vault/ |
| All report surfaces generated | 4 HTML pairs + graph_state.json |
| selector.json updated | current_run points to this run |
| No manual HTML patches | All report content derived from vault |

---

## 2. BlueEdge Canonical Parity Reference

**Established by:** `run_be_orchestrated_fixup_01`  
**Anchored at:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 (parity_validation.json — 14/14 PASS)  
**Upstream authority:** PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01

### 2.1 Signal Parity Reference

| Signal | z_score | activation_state | active? |
|--------|---------|-----------------|---------|
| PSIG-001 | 5.663 | HIGH | YES |
| PSIG-002 | 3.2098 | HIGH | YES |
| PSIG-004 | 2.1822 | HIGH | YES |
| PSIG-006 | 0 | BASELINE / THEORETICAL_BASELINE | NO |

### 2.2 Count Parity Reference

| Field | Value |
|-------|-------|
| `total_signals` | 4 |
| `active_pressure_signals` | 3 |
| `telemetry_signals` | 1 |

### 2.3 Zone Parity Reference

| Field | Value |
|-------|-------|
| `zone_count` | 1 |
| `zone_id` | PZ-001 |
| `anchor_dom` | DOM-04 |
| `zone_class` | COMPOUND_ZONE |

### 2.4 GAUGE Parity Reference

| Field | Value |
|-------|-------|
| `score` | 60 |
| `verdict` | CONDITIONAL |
| `action` | INVESTIGATE |

---

## 3. Parity Validation Procedure

For any new BlueEdge orchestrated run, perform the following checks:

| Check | Field | Expected | Tolerance |
|-------|-------|----------|-----------|
| P-01 | PSIG-001 z_score | 5.663 | exact |
| P-02 | PSIG-001 activation_state | HIGH | exact |
| P-03 | PSIG-002 z_score | 3.2098 | exact |
| P-04 | PSIG-002 activation_state | HIGH | exact |
| P-05 | PSIG-004 z_score | 2.1822 | exact |
| P-06 | PSIG-004 activation_state | HIGH | exact |
| P-07 | PSIG-006 z_score | 0 | exact |
| P-08 | PSIG-006 activation_method | THEORETICAL_BASELINE | exact |
| P-09 | active_pressure_signals | 3 | exact |
| P-10 | zone_id | PZ-001 | exact |
| P-11 | anchor_dom | DOM-04 | exact |
| P-12 | zone_class | COMPOUND_ZONE | exact |
| P-13 | GAUGE score | 60 | exact |
| P-14 | GAUGE verdict | CONDITIONAL | exact |

All 14 checks must PASS for a run to be classified as `CANONICAL_ORCHESTRATED`.

---

## 4. Run Classification Decision Tree

```
New run produced by orchestrator?
  → Phase 9/9 PASS?
      NO  → run_status = REJECTED_NON_CANONICAL; selector NOT updated
      YES → Parity validation (14 checks)?
              FAIL → run_status = REJECTED_NON_CANONICAL; selector NOT updated; revert required
              PASS → run_status = CANONICAL_ORCHESTRATED; selector updated
```

---

## 5. Non-Canonical Run Handling Protocol

When a run is rejected:

1. **Immediately** revert selector.json `current_run` to last known-good run
2. Record the rejection in a `selector_revert_result.json` artifact
3. Classify the rejected run as `REJECTED_NON_CANONICAL` in `run_status`
4. Do NOT delete rejected run artifacts (preserved for forensic analysis)
5. Issue a fixup contract (format: PI.LENS.*-FIXUP.*) to diagnose and remediate
6. Re-run only after root cause is identified and fixed
7. Prove parity before updating selector

**Authority:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 execution model

---

## 6. Canonical Run History — BlueEdge

| Run ID | Classification | Status | Contract Authority |
|--------|----------------|--------|--------------------|
| run_blueedge_productized_01 | CANONICAL_BASELINE_REFERENCE | NOT IN SELECTOR | PI.BLUEEDGE.FASTAPI-CONFORMANCE.* |
| run_blueedge_rerun_01 | CANONICAL_BASELINE_REFERENCE | In selector (preserved) | Prior rerun contract |
| run_blueedge_integrated_01 | CANONICAL_BASELINE_REFERENCE | NOT IN SELECTOR (client 6a6fcdbc) | Integration contract |
| run_be_orchestrated_01 | REJECTED_NON_CANONICAL | REJECTED — not current_run | PI.LENS.ORCHESTRATED-BLUEEDGE.BASELINE-DELTA-ANALYSIS.01 |
| run_be_orchestrated_fixup_01 | CANONICAL_ORCHESTRATED | **CURRENT** | PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 |

---

## 7. Validation Contract for Multi-Client Runs

For any client (not BlueEdge-specific):

1. Establish a canonical baseline run for that client using the appropriate conformance contracts
2. Record parity reference values in a client-specific validation document
3. Configure `fastapi_conformance_path` in `source_manifest.json` if signal computation is `STAGE_NOT_AUTOMATED`
4. Run the orchestrator
5. Validate against client-specific parity reference
6. Only after parity → classify as `CANONICAL_ORCHESTRATED` and update selector

The BlueEdge parity procedure above is the template. Client-specific checks replace BlueEdge-specific values.
