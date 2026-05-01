# Baseline Delta Summary
## PI.LENS.ORCHESTRATED-BLUEEDGE.BASELINE-DELTA-ANALYSIS.01 — BLOCK_L

**Generated:** 2026-05-01  
**Mode:** FORENSIC / READ_ONLY  
**Final Verdict:** STRUCTURAL_TOPOLOGY_DELTA

---

## Contract Question Answers

### Q1. Are the signal values the same between baseline and orchestrated run?

**No.** All four active signals differ in value:

| Signal | Baseline | Orchestrated | Match |
|--------|----------|--------------|-------|
| PSIG-001 | 5.663 | 4.55 | NO |
| PSIG-002 | 3.2098 | 4.55 | NO |
| PSIG-004 | 2.1822 | 1.0 | NO |
| PSIG-006 | 0 | 0.1515 | NO |

All four signals have the same activation status (HIGH/ACTIVATED) in both runs, but the numeric values differ because they are computed on different input graphs.

---

### Q2. Did PSIG-006 change from telemetry to an active pressure signal?

**In the vault artifact: yes (incorrectly). In the report: no (correctly).**

- Baseline vault: `active_pressure_signals=3`, `telemetry_signals=1` (PSIG-006 in telemetry). CORRECT.
- Orchestrated vault: `active_pressure_signals=4` (PSIG-006 counted as pressure signal). INCORRECT — schema bridge bug.
- Both reports display PSIG-006 as "BASELINE — theoretical baseline condition (not activated)". CORRECT.

PSIG-006 was not moved from the baseline into the active pressure signal set — it has always been THEORETICAL_BASELINE/ACTIVATED. The schema bridge bug in Phase 8a caused it to be miscounted in the vault. The report generator independently handles this correctly.

---

### Q3. What caused the signal value differences?

**Primary cause: STRUCTURAL_TOPOLOGY_DELTA.**

The baseline computed signals from the real 40.3 structural import graph (35 nodes, 1937 IMPORTS relations, outlier NODE-0021 with IMPORTS=69). The orchestrated run computes signals from a synthetic CEU-DOM binding_envelope (33 nodes, 29 GROUNDS/EXPOSES edges, outlier CE-04 with fan_in=4). These are different graphs with different edge semantics and different populations. The z-score computation produces different values from different inputs.

---

### Q4. Did the Phase 8a schema bridge introduce a bug?

**Yes.** The bridge bug is confirmed as a secondary finding.

```python
# CURRENT (BUGGY) — line ~645 in run_client_pipeline.py:
active_count = sum(1 for s in vault_signals if s.get('activation_state') in ('HIGH', 'ACTIVATED', 'ACTIVE'))

# CORRECT:
active_count = sum(
    1 for s in vault_signals
    if s.get('activation_state') == 'HIGH'
    or (s.get('activation_state') in ('ACTIVATED', 'ACTIVE') and s.get('activation_method') != 'THEORETICAL_BASELINE')
)
```

The bridge does not read the `activation_method` field and therefore incorrectly includes THEORETICAL_BASELINE signals in the active pressure count. This bug exists independently of the topology delta.

---

### Q5. Are the pressure zones equivalent?

**No.** Baseline has 1 pressure zone (PZ-001, DOM-04 anchor, backend_app_root). Orchestrated has 4 pressure zones (PZ-001 DOM-04, PZ-002 DOM-05, PZ-003 DOM-08, PZ-004 DOM-09). All 4 orchestrated zones share the same condition set (PSIG-001 · PSIG-002 · PSIG-004) and class (COMPOUND_ZONE), but the zone anchor domain shifts from DOM-04 to DOM-05 (backend_common) as the primary.

Zone count difference is a direct consequence of the structural topology delta — the binding_envelope creates 4 domain-level pressure candidates where the real topology produces 1.

---

### Q6. Is the score/decision the same?

**Yes.** Both reports display `60 — CONDITIONAL — INVESTIGATE`. The score is anchored to CEU grounding evidence, which is identical in both runs (10/10 CEUs, grounding_ratio=1.0). Score is not driven by signal values.

---

### Q7. Should the orchestrated run be promoted as canonical?

**No. The orchestrated run is REJECTED as non-canonical.**

The signal computation pathway is fundamentally incorrect for establishing production-equivalent output. Before any orchestrated run can be considered canonical:
1. Signal computation must use the real structural import topology (not binding_envelope)
2. The schema bridge bug must be patched
3. A new run must be produced and validated against the baseline

**Selector action required:** Revert `current_run` to `run_blueedge_rerun_01`.  
**FastAPI integration:** BLOCKED pending FIXUP.

---

## Summary

The orchestrated run (`run_be_orchestrated_01`) is structurally sound as a pipeline execution but computes signals from the wrong input graph. The delta is explained, classified, and fully documented across 14 artifacts. No signal anomaly is unexplained. The next authorized step is PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01.
