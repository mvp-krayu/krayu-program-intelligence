# Condition Output Set
run_id: run_01_blueedge
stream: Stream 40.6 — PiOS Condition and Diagnosis Activation Layer
contract: PIOS-40.6-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.5-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Complete Conditions

### COND-006 — Sensor Integration Configuration State

| Field | Value |
|-------|-------|
| condition_id | COND-006 |
| entity | SA-001 |
| governing_signal | SIG-006 Sensor Bridge Batch Throughput Rate |
| signal_value | 0.333 rec/sec |
| temporal_ref | TMP-009 (30s config-defined) |
| activation_state | **configured** |
| coverage_state | **complete** |

**Value basis:** SIG-006 = DIM-PC-002 / DIM-PC-001 = 10 records / 30 seconds = 0.333 records/second. Static configuration constants declared in CEU-10 :: hasi_bridge.py DEFAULT_CONFIG. Condition activation state: configured. No threshold evaluation — Stream 75.1 authority.

---

## Blocked Conditions

| Condition | Entity | Governing Signal | Signal State | Blocking Input | Temporal |
|-----------|--------|-----------------|-------------|----------------|----------|
| COND-001 Backend Service Memory State | CE-001/BM-061 | SIG-001 | pending | Live Prometheus scrape (INF-003 → TMP-004) | TMP-004 (10s) |
| COND-002 Cache Efficiency State | CE-001/BM-061+INF-002 | SIG-002 | pending | Live Prometheus scrape (INF-003 → TMP-004) | TMP-004 (10s) |
| COND-003 Cache Availability State | CE-001/BM-061+INF-002 | SIG-003 | pending | Live Prometheus scrape (INF-003 → TMP-004) | TMP-004 (10s) |
| COND-004 Event Pipeline Activity State | CE-001/BM-063 | SIG-004 | pending | Live Prometheus scrape (INF-003 → TMP-004) | TMP-004 (10s) |
| COND-005 Fleet Connection Activity State | CE-001/BM-062 | SIG-005 | pending | Active WebSocket clients (fleet:* rooms → TMP-010) | TMP-010 (event-driven) |
| COND-007 Alert Activity State | CE-001/BM-005 | SIG-007 | pending | Alert broadcast or domain event stream (TMP-003/TMP-010) | TMP-003+TMP-010 |
| COND-008 Driver Session Activity State | CE-001/BM-057+BM-043 | SIG-008 | pending | Driver session lifecycle events (TMP-010) | TMP-010 (event-driven) |

---

## Coverage Summary

| Category | Count | IDs |
|----------|-------|-----|
| Complete | 1 | COND-006 |
| Blocked (signal pending runtime) | 7 | COND-001, COND-002, COND-003, COND-004, COND-005, COND-007, COND-008 |
| Partial | 0 | — |

---

## Governance Lock

| Principle | Application |
|-----------|------------|
| Evidence-First (GC-06) | Missing runtime signal values propagate as BLOCKED — no fabricated activation states |
| State–Diagnosis Separation (GC-07) | Conditions are observational coverage states only — no threshold evaluation, no diagnosis |
| No fabrication | Blocked conditions carry no fabricated or approximated values |
| No inference | No heuristic substitution for missing runtime signal telemetry |
| Threshold authority | Stream 75.1 — Program Condition Model; threshold definition not performed in this stream |

---

## Status

condition_output_complete: TRUE
condition_completeness: PARTIAL
