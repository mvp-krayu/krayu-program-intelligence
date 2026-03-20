# Intelligence Traceability Map
run_id: run_01_blueedge
stream: Stream 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
contract: PIOS-40.7-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.6-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Traceability Rule

Every intelligence claim must trace to:
1. A governed diagnosis output from this stream
2. The condition from which that diagnosis was derived (40.6 condition artifact)
3. The signal from which that condition was derived (40.6 chain)
4. The DIM- dimensions the signal maps to
5. A temporal reference (inherited from diagnosis, inherited from condition, inherited from signal)

Full lineage from intelligence claim to originating 40.6 condition must be preserved end-to-end. No claim may exist without a complete traceability chain. No intelligence artifact may reference 40.5, 40.4, 40.3, or 40.2 artifacts directly — only 40.6 condition artifacts are in scope for this stream's input boundary.

---

## Full Traceability Table

| Intelligence | Source Diagnosis | 40.6 Artifact | Via Condition | Via Signal | DIM Basis | Entity Ref | Temporal | State |
|-------------|-----------------|---------------|--------------|-----------|-----------|-----------|---------|-------|
| INTEL-001 | DIAG-006 | condition_output_set.md | COND-006 | SIG-006 | DIM-PC-001, DIM-PC-002 | SA-001 | TMP-009 | **computed** |
| INTEL-002 | DIAG-001 | condition_output_set.md | COND-001 | SIG-001 | DIM-PR-001 | CE-001/BM-061 | TMP-004 | blocked |
| INTEL-002 | DIAG-002 | condition_output_set.md | COND-002 | SIG-002 | DIM-CP-001, DIM-CP-002 | CE-001/BM-061+INF-002 | TMP-004 | blocked |
| INTEL-002 | DIAG-003 | condition_output_set.md | COND-003 | SIG-003 | DIM-CP-003 | CE-001/BM-061+INF-002 | TMP-004 | blocked |
| INTEL-002 | DIAG-004 | condition_output_set.md | COND-004 | SIG-004 | DIM-ET-001 | CE-001/BM-063 | TMP-004 | blocked |
| INTEL-002 | DIAG-005 | condition_output_set.md | COND-005 | SIG-005 | DIM-CS-001 | CE-001/BM-062 | TMP-010 | blocked |
| INTEL-002 | DIAG-007 | condition_output_set.md | COND-007 | SIG-007 | DIM-DE-007 | CE-001/BM-005 | TMP-003+TMP-010 | blocked |
| INTEL-002 | DIAG-008 | condition_output_set.md | COND-008 | SIG-008 | DIM-DE-004, DIM-DE-005, DIM-DE-006 | CE-001/BM-057+BM-043 | TMP-010 | blocked |

**2/2 intelligence items fully traced**

---

## INTEL-001 Full Lineage Chain (Computed)

INTEL-001 → DIAG-006 (computed, diagnosis_output_set.md) → COND-006 (complete, condition_output_set.md) → SIG-006 (complete, signal_output_set.md via 40.6 chain) → DIM-PC-001 (poll_interval_seconds: 30) + DIM-PC-002 (batch_records_per_poll: 10) → telemetry_dimension_catalog.md (via 40.6 traceability) → CEU-10 :: hasi_bridge.py DEFAULT_CONFIG

**Claim derivation chain:**
- INTEL-001 activation state claim → DIAG-006 (activation state: configured) → COND-006 → CVAR_HASI_001 → SIG-006 → DIM-PC-001/DIM-PC-002 → CEU-10 :: hasi_bridge.py DEFAULT_CONFIG
- INTEL-001 throughput capacity claim → 0.333 rec/sec = DIM-PC-002 / DIM-PC-001 = 10 records / 30 seconds → static constants
- INTEL-001 polling profile claim → DIM-PC-001 = 30s fixed interval; DIM-PC-002 = 10 records per batch; no runtime variability
- INTEL-001 runtime unknown claim → DIAG-006 runtime_performance_state: UNAVAILABLE → SA-001 not executing in static analysis context

**Coverage state:** computed — full lineage verified

---

## INTEL-002 Full Lineage Chains (Blocked)

| Source Diagnosis | Lineage Chain (to blocked boundary) |
|-----------------|--------------------------------------|
| DIAG-001 | INTEL-002 → DIAG-001 (blocked) → COND-001 (blocked) → SIG-001 (pending) → DIM-PR-001 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-002 | INTEL-002 → DIAG-002 (blocked) → COND-002 (blocked) → SIG-002 (pending) → DIM-CP-001, DIM-CP-002 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-003 | INTEL-002 → DIAG-003 (blocked) → COND-003 (blocked) → SIG-003 (pending) → DIM-CP-003 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-004 | INTEL-002 → DIAG-004 (blocked) → COND-004 (blocked) → SIG-004 (pending) → DIM-ET-001 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-005 | INTEL-002 → DIAG-005 (blocked) → COND-005 (blocked) → SIG-005 (pending) → DIM-CS-001 → WebSocket fleet:* rooms [NOT AVAILABLE] |
| DIAG-007 | INTEL-002 → DIAG-007 (blocked) → COND-007 (blocked) → SIG-007 (pending) → DIM-DE-007 → alert events TMP-003/TMP-010 [NOT AVAILABLE] |
| DIAG-008 | INTEL-002 → DIAG-008 (blocked) → COND-008 (blocked) → SIG-008 (pending) → DIM-DE-004..006 → session events TMP-010 [NOT AVAILABLE] |

**Coverage state:** blocked — all 7 source diagnoses blocked; unknown space fully traced to blocking boundary

---

## End-to-End Lineage Summary

| Intelligence | Diagnosis | Condition | Signal(s) | DIM- Basis | Telemetry Source |
|-------------|-----------|-----------|---------|-----------|-----------------|
| INTEL-001 | DIAG-006 | COND-006 | SIG-006 | DIM-PC-001, DIM-PC-002 | CEU-10 :: hasi_bridge.py DEFAULT_CONFIG (static) |
| INTEL-002 | DIAG-001..005, DIAG-007..008 | COND-001..005, COND-007..008 | SIG-001..005, SIG-007..008 [all pending] | DIM-PR-001, DIM-CP-001..003, DIM-ET-001, DIM-CS-001, DIM-DE-004..007 | INF-003 Prometheus, WebSocket fleet:* rooms, alert event stream, session event stream [ALL NOT AVAILABLE] |

**Legend:** [pending] = signal requires runtime telemetry not available in static analysis context

**Total intelligence items traced to diagnosis: 2 / 2**
**End-to-end lineage preserved: yes — intelligence → diagnosis → condition → signal → DIM- → telemetry source**
**Unsupported claims: 0**
