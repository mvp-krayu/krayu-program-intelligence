# Diagnosis Output Set
run_id: run_01_blueedge
stream: Stream 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
contract: PIOS-40.7-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.6-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Output Rule

This document records the diagnosis output for each governed diagnosis dimension. Where all required condition inputs are complete, the diagnosis is computed deterministically by applying Stream 75.2 — Program Diagnosis Model. Where inputs are blocked, the diagnosis dimension is declared blocked with explicit reason. No diagnosis value is fabricated, inferred, or estimated. No recommendation, prognosis, or remediation content is produced.

---

## DIAG-001 — Backend Service Memory Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-001 |
| Source Condition | COND-001 (Backend Service Memory State) |
| Entity Ref | CE-001 / BM-061 |
| Temporal Reference | TMP-004 (10s Prometheus scrape) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Backend process heap usage | COND-001 blocked — SIG-001 requires live Prometheus scrape (INF-003 → TMP-004); BlueEdge backend not running in static analysis context |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Backend service memory program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-002 — Cache Efficiency Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-002 |
| Source Condition | COND-002 (Cache Efficiency State) |
| Entity Ref | CE-001 / BM-061 + INF-002 |
| Temporal Reference | TMP-004 (10s Prometheus scrape) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Cache hit efficiency ratio | COND-002 blocked — SIG-002 requires live Prometheus scrape (INF-003 → TMP-004) |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Cache efficiency program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-003 — Cache Availability Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-003 |
| Source Condition | COND-003 (Cache Availability State) |
| Entity Ref | CE-001 / BM-061 + INF-002 |
| Temporal Reference | TMP-004 (10s Prometheus scrape) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Cache connectivity state | COND-003 blocked — SIG-003 requires live Prometheus scrape (INF-003 → TMP-004) |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Cache availability program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-004 — Event Pipeline Activity Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-004 |
| Source Condition | COND-004 (Event Pipeline Activity State) |
| Entity Ref | CE-001 / BM-063 |
| Temporal Reference | TMP-004 (10s Prometheus scrape) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Domain event emission count | COND-004 blocked — SIG-004 requires live Prometheus scrape (INF-003 → TMP-004) |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Event pipeline activity program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-005 — Fleet Connection Activity Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-005 |
| Source Condition | COND-005 (Fleet Connection Activity State) |
| Entity Ref | CE-001 / BM-062 |
| Temporal Reference | TMP-010 (event-driven) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Fleet active connection count | COND-005 blocked — SIG-005 requires active WebSocket clients (fleet:* rooms → TMP-010); no active connections in static analysis context |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Fleet connection activity program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-006 — Sensor Integration Configuration Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-006 |
| Source Condition | COND-006 (Sensor Integration Configuration State) |
| Entity Ref | SA-001 |
| Temporal Reference | TMP-009 (30s config-defined) — inherited |
| Coverage State | **computed** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Diagnosis Inputs Applied (per Stream 75.2):**

| Dimension | Source | Value |
|-----------|--------|-------|
| Activation state | COND-006 | configured |
| Batch throughput rate | COND-006 (via SIG-006) | 0.333 rec/sec |
| Batch size (DIM-PC-002) | COND-006 (via SIG-006 → DIM-PC-002) | 10 records |
| Poll interval (DIM-PC-001) | COND-006 (via SIG-006 → DIM-PC-001) | 30 seconds |

**Diagnosis Output (per Stream 75.2):**

| Diagnosis Field | Result |
|----------------|--------|
| Configuration classification | SENSOR_BRIDGE_CONFIGURED — SA-001 hasi_bridge.py is configured for sensor data ingestion |
| Throughput capacity | 0.333 records/second (10 records per 30-second polling cycle); static constant declared in CEU-10 :: hasi_bridge.py DEFAULT_CONFIG |
| Batch interval profile | Fixed 30-second poll cycle; 10-record batch capacity per cycle; deterministic throughput ceiling |
| Configuration nature | Static configuration declaration — not a runtime performance measurement |
| Runtime performance state | UNAVAILABLE — actual ingestion throughput requires live sensor bridge execution |
| Confidence | HIGH — derived from complete static configuration constants |

**Diagnosis state: COMPUTED**

---

## DIAG-007 — Alert Activity Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-007 |
| Source Condition | COND-007 (Alert Activity State) |
| Entity Ref | CE-001 / BM-005 |
| Temporal Reference | TMP-003 (15–30s) + TMP-010 (event-driven) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Vehicle alert severity state | COND-007 blocked — SIG-007 requires alert broadcast (TMP-003) or domain event stream (TMP-010); no alert events active |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Alert activity program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## DIAG-008 — Driver Session Activity Diagnosis

| Field | Value |
|-------|-------|
| Diagnosis ID | DIAG-008 |
| Source Condition | COND-008 (Driver Session Activity State) |
| Entity Ref | CE-001 / BM-057 + BM-043 |
| Temporal Reference | TMP-010 (event-driven) — inherited |
| Coverage State | **blocked** |
| Governing Model | Stream 75.2 — Program Diagnosis Model |

**Blocked Input:**

| Dimension | Blocking Reason |
|-----------|----------------|
| Driver session performance composite | COND-008 blocked — SIG-008 requires driver session lifecycle events (driver.session.closed, driver.session.dwvs.computed → TMP-010) |

**Diagnosis Output:** BLOCKED — no diagnosis produced. Driver session activity program state is unknown. No fabrication. No inference. No approximation.

**Diagnosis state: BLOCKED**

---

## Diagnosis Output Summary

| Diagnosis ID | Source Condition | Entity | Temporal | State | Output |
|-------------|-----------------|--------|---------|-------|--------|
| DIAG-001 | COND-001 | CE-001/BM-061 | TMP-004 | blocked | — |
| DIAG-002 | COND-002 | CE-001/BM-061+INF-002 | TMP-004 | blocked | — |
| DIAG-003 | COND-003 | CE-001/BM-061+INF-002 | TMP-004 | blocked | — |
| DIAG-004 | COND-004 | CE-001/BM-063 | TMP-004 | blocked | — |
| DIAG-005 | COND-005 | CE-001/BM-062 | TMP-010 | blocked | — |
| DIAG-006 | COND-006 | SA-001 | TMP-009 | **computed** | SENSOR_BRIDGE_CONFIGURED; 0.333 rec/sec |
| DIAG-007 | COND-007 | CE-001/BM-005 | TMP-003+TMP-010 | blocked | — |
| DIAG-008 | COND-008 | CE-001/BM-057+BM-043 | TMP-010 | blocked | — |

**Computed: 1 | Blocked: 7 | Partial: 0**
**All outputs: no recommendation, no prognosis, no remediation content attached**
