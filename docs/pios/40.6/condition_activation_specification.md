# Condition Activation Specification
run_id: run_01_blueedge
stream: Stream 40.6 — PiOS Condition and Diagnosis Activation Layer
contract: PIOS-40.6-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.5-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Governing Authority

Condition activation logic is governed by Stream 75.1 — Program Condition Model (M-07). This stream activates condition coverage states using signal state propagation rules only; threshold evaluation is Stream 75.1's exclusive authority and is not performed here.

---

## Coverage State Propagation Rules

| Signal State | Condition Coverage State |
|-------------|--------------------------|
| complete | complete |
| pending (runtime) | blocked |
| blocked (contract violation) | blocked |

No partial conditions exist in this run. All 7 pending signals have zero runtime values available in the static analysis context — each pending condition is fully blocked, not partially computable.

---

## COND-001 — Backend Service Memory State

| Field | Value |
|-------|-------|
| condition_id | COND-001 |
| name | Backend Service Memory State |
| entity_ref | CE-001 / BM-061 |
| governing_signal | SIG-001 Backend Process Heap Usage |
| cvar_input | CVAR_MEM_001 |
| temporal_ref | TMP-004 (10s Prometheus scrape) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-001 requires live Prometheus scrape (INF-003 → CE-001 TMP-004); BlueEdge backend not running in static analysis context |
| activation_state | — |

---

## COND-002 — Cache Efficiency State

| Field | Value |
|-------|-------|
| condition_id | COND-002 |
| name | Cache Efficiency State |
| entity_ref | CE-001 / BM-061 + INF-002 |
| governing_signal | SIG-002 Cache Hit Efficiency |
| cvar_input | CVAR_CACHE_001 |
| temporal_ref | TMP-004 (10s Prometheus scrape) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-002 requires live Prometheus scrape (INF-003); BlueEdge backend not running in static analysis context |
| activation_state | — |

---

## COND-003 — Cache Availability State

| Field | Value |
|-------|-------|
| condition_id | COND-003 |
| name | Cache Availability State |
| entity_ref | CE-001 / BM-061 + INF-002 |
| governing_signal | SIG-003 Cache Connectivity State |
| cvar_input | CVAR_CACHE_002 |
| temporal_ref | TMP-004 (10s Prometheus scrape) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-003 requires live Prometheus scrape (INF-003); BlueEdge backend not running in static analysis context |
| activation_state | — |

---

## COND-004 — Event Pipeline Activity State

| Field | Value |
|-------|-------|
| condition_id | COND-004 |
| name | Event Pipeline Activity State |
| entity_ref | CE-001 / BM-063 |
| governing_signal | SIG-004 Domain Event Emission Count |
| cvar_input | CVAR_EVT_001 |
| temporal_ref | TMP-004 (10s Prometheus scrape) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-004 requires live Prometheus scrape (INF-003); BlueEdge backend not running in static analysis context |
| activation_state | — |

---

## COND-005 — Fleet Connection Activity State

| Field | Value |
|-------|-------|
| condition_id | COND-005 |
| name | Fleet Connection Activity State |
| entity_ref | CE-001 / BM-062 |
| governing_signal | SIG-005 Fleet Active Connection Count |
| cvar_input | CVAR_WS_001 |
| temporal_ref | TMP-010 (event-driven) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-005 requires active WebSocket clients (fleet:* rooms); no active fleet connections in static analysis context |
| activation_state | — |

---

## COND-006 — Sensor Integration Configuration State

| Field | Value |
|-------|-------|
| condition_id | COND-006 |
| name | Sensor Integration Configuration State |
| entity_ref | SA-001 |
| governing_signal | SIG-006 Sensor Bridge Batch Throughput Rate |
| cvar_input | CVAR_HASI_001 |
| temporal_ref | TMP-009 (30s config-defined) |
| signal_state | **complete** |
| condition_coverage_state | **complete** |
| blocking_reason | none |
| activation_state | **configured** |
| computed_value | 0.333 rec/sec |
| value_basis | DIM-PC-002 / DIM-PC-001 = 10 records / 30 seconds; static configuration constants in CEU-10 :: hasi_bridge.py DEFAULT_CONFIG |
| activation_note | Throughput capacity declared at 0.333 rec/sec. Condition state: configured. No threshold evaluation performed — Stream 75.1 authority. |

---

## COND-007 — Alert Activity State

| Field | Value |
|-------|-------|
| condition_id | COND-007 |
| name | Alert Activity State |
| entity_ref | CE-001 / BM-005 |
| governing_signal | SIG-007 Vehicle Alert Severity State |
| cvar_input | CVAR_ALT_001 |
| temporal_ref | TMP-003 (15–30s broadcast) + TMP-010 (event-driven) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-007 requires alert broadcast (TMP-003) or domain event stream (TMP-010); no alert events active in static analysis context |
| activation_state | — |

---

## COND-008 — Driver Session Activity State

| Field | Value |
|-------|-------|
| condition_id | COND-008 |
| name | Driver Session Activity State |
| entity_ref | CE-001 / BM-057 + BM-043 |
| governing_signal | SIG-008 Driver Session Performance |
| cvar_input | CVAR_DS_001 |
| temporal_ref | TMP-010 (event-driven) |
| signal_state | pending |
| condition_coverage_state | **blocked** |
| blocking_reason | SIG-008 requires driver session lifecycle events (driver.session.closed, driver.session.dwvs.computed); no driver session events active in static analysis context |
| activation_state | — |

---

## Coverage Summary

| Category | Count | Condition IDs |
|----------|-------|---------------|
| Complete | 1 | COND-006 |
| Blocked (signal pending runtime) | 7 | COND-001, COND-002, COND-003, COND-004, COND-005, COND-007, COND-008 |
| Partial | 0 | — |

---

## Governance Note

Condition activation states represent observational coverage state only. No threshold evaluation, diagnosis, or causal attribution is performed in this stream. Threshold authority belongs to Stream 75.1 — Program Condition Model. State–Diagnosis Separation (GC-07) enforced throughout.
