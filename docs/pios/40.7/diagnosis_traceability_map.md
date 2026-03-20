# Diagnosis Traceability Map
run_id: run_01_blueedge
stream: Stream 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
contract: PIOS-40.7-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.6-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Traceability Rule

Every governed diagnosis must trace to:
1. A governed condition from 40.6 (via condition_output_set.md)
2. The 40.6 artifact in which that condition is defined
3. The governed signal(s) from which the condition was derived (via 40.6 condition traceability chain)
4. The DIM- dimensions the signal maps to
5. A temporal reference (inherited from condition, inherited from signal)

No diagnosis is valid without complete traceability. No traceability entry may reference 40.5, 40.4, 40.3, or 40.2 artifacts directly — only 40.6 condition artifacts are in scope for this stream's input boundary.

---

## Full Traceability Table

| Diagnosis | Source Condition | 40.6 Artifact | Via Signal | DIM Basis | Entity Ref | Temporal | State |
|-----------|-----------------|---------------|-----------|-----------|-----------|---------|-------|
| DIAG-001 | COND-001 | condition_output_set.md | SIG-001 | DIM-PR-001 | CE-001/BM-061 | TMP-004 | blocked |
| DIAG-002 | COND-002 | condition_output_set.md | SIG-002 | DIM-CP-001, DIM-CP-002 | CE-001/BM-061+INF-002 | TMP-004 | blocked |
| DIAG-003 | COND-003 | condition_output_set.md | SIG-003 | DIM-CP-003 | CE-001/BM-061+INF-002 | TMP-004 | blocked |
| DIAG-004 | COND-004 | condition_output_set.md | SIG-004 | DIM-ET-001 | CE-001/BM-063 | TMP-004 | blocked |
| DIAG-005 | COND-005 | condition_output_set.md | SIG-005 | DIM-CS-001 | CE-001/BM-062 | TMP-010 | blocked |
| DIAG-006 | COND-006 | condition_output_set.md | SIG-006 | DIM-PC-001, DIM-PC-002 | SA-001 | TMP-009 | **computed** |
| DIAG-007 | COND-007 | condition_output_set.md | SIG-007 | DIM-DE-007 | CE-001/BM-005 | TMP-003+TMP-010 | blocked |
| DIAG-008 | COND-008 | condition_output_set.md | SIG-008 | DIM-DE-004, DIM-DE-005, DIM-DE-006 | CE-001/BM-057+BM-043 | TMP-010 | blocked |

**8/8 diagnoses fully traced**

---

## DIAG-006 Full Lineage Chain (Computed)

DIAG-006 → COND-006 (complete, condition_output_set.md) → SIG-006 (complete, signal_output_set.md via 40.6 chain) → DIM-PC-001 (poll_interval_seconds: 30) + DIM-PC-002 (batch_records_per_poll: 10) → telemetry_dimension_catalog.md (via 40.6 traceability) → CEU-10 :: hasi_bridge.py DEFAULT_CONFIG

**Value derivation chain:**
- DIM-PC-002 / DIM-PC-001 = 10 records / 30 seconds = 0.333 rec/sec
- Static configuration constants; no runtime dependency
- Inherited temporal: TMP-009 (30s config-defined)

---

## DIAG-001..005, DIAG-007..008 Lineage Chains (Blocked)

| Diagnosis | Lineage Chain (to blocked boundary) |
|-----------|-------------------------------------|
| DIAG-001 | DIAG-001 → COND-001 (blocked) → SIG-001 (pending) → DIM-PR-001 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-002 | DIAG-002 → COND-002 (blocked) → SIG-002 (pending) → DIM-CP-001, DIM-CP-002 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-003 | DIAG-003 → COND-003 (blocked) → SIG-003 (pending) → DIM-CP-003 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-004 | DIAG-004 → COND-004 (blocked) → SIG-004 (pending) → DIM-ET-001 → INF-003 Prometheus [NOT AVAILABLE] |
| DIAG-005 | DIAG-005 → COND-005 (blocked) → SIG-005 (pending) → DIM-CS-001 → WebSocket fleet:* rooms [NOT AVAILABLE] |
| DIAG-007 | DIAG-007 → COND-007 (blocked) → SIG-007 (pending) → DIM-DE-007 → alert events TMP-003/TMP-010 [NOT AVAILABLE] |
| DIAG-008 | DIAG-008 → COND-008 (blocked) → SIG-008 (pending) → DIM-DE-004..006 → session events TMP-010 [NOT AVAILABLE] |

---

## 40.6 Artifact Coverage

| 40.6 Artifact | Conditions Providing Diagnosis Inputs | Diagnoses Fed |
|---------------|--------------------------------------|--------------|
| condition_output_set.md | COND-001..008 (all) | DIAG-001..008 (all) |
| condition_traceability_map.md | All condition-to-signal chains | All diagnoses (upstream authority chain) |
| condition_validation_log.md | Coverage states for all conditions | All diagnoses (coverage propagation) |
| execution_manifest.md | Upstream blocking declarations | DIAG-001..005, DIAG-007..008 (blocking inheritance) |

---

## Traceability Completeness Declaration

| Diagnosis | Condition Traced | 40.6 Artifact Cited | Signal Chain Traced | Temporal Reference | Complete |
|-----------|-----------------|---------------------|--------------------|--------------------|---------|
| DIAG-001 | yes (COND-001) | yes | yes (SIG-001) | yes (TMP-004) | yes |
| DIAG-002 | yes (COND-002) | yes | yes (SIG-002) | yes (TMP-004) | yes |
| DIAG-003 | yes (COND-003) | yes | yes (SIG-003) | yes (TMP-004) | yes |
| DIAG-004 | yes (COND-004) | yes | yes (SIG-004) | yes (TMP-004) | yes |
| DIAG-005 | yes (COND-005) | yes | yes (SIG-005) | yes (TMP-010) | yes |
| DIAG-006 | yes (COND-006) | yes | yes (SIG-006, full chain) | yes (TMP-009) | yes |
| DIAG-007 | yes (COND-007) | yes | yes (SIG-007) | yes (TMP-003+TMP-010) | yes |
| DIAG-008 | yes (COND-008) | yes | yes (SIG-008) | yes (TMP-010) | yes |

**Total diagnoses traced: 8 / 8**
**Diagnoses with missing traceability: 0**
