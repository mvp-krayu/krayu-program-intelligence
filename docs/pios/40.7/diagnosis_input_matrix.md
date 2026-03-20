# Diagnosis Input Matrix
run_id: run_01_blueedge
stream: Stream 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
contract: PIOS-40.7-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.6-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Input Rule

Diagnosis in Stream 40.7 is derived exclusively from governed 40.6 condition outputs. No signal artifact is directly accessed. No telemetry artifact is directly referenced. Every diagnosis maps to one governed condition. Condition coverage states propagate to diagnosis coverage states without modification.

---

## Input Boundary Declaration

Primary 40.6 input artifacts consumed (read-only):

| Artifact | Path | Status |
|---------|------|--------|
| condition_output_set.md | docs/pios/40.6/ | Locked |
| condition_traceability_map.md | docs/pios/40.6/ | Locked |
| condition_validation_log.md | docs/pios/40.6/ | Locked |
| execution_manifest.md | docs/pios/40.6/ | Locked |

---

## Upstream State Summary

**40.6 final_status: PARTIAL**

| Category | Count | Condition IDs |
|----------|-------|---------------|
| Complete | 1 | COND-006 |
| Blocked (signal pending runtime) | 7 | COND-001, COND-002, COND-003, COND-004, COND-005, COND-007, COND-008 |
| Partial | 0 | — |

---

## Diagnosis Model Inputs

### DIAG-001 — Backend Service Memory Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Backend process heap usage | COND-001 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-001 blocked — SIG-001 pending live Prometheus scrape (INF-003 → CE-001 TMP-004); BlueEdge backend not running in static analysis context
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

### DIAG-002 — Cache Efficiency Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Cache hit efficiency ratio | COND-002 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-002 blocked — SIG-002 pending live Prometheus scrape (INF-003 → CE-001 TMP-004)
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

### DIAG-003 — Cache Availability Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Cache connectivity state | COND-003 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-003 blocked — SIG-003 pending live Prometheus scrape (INF-003 → CE-001 TMP-004)
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

### DIAG-004 — Event Pipeline Activity Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Domain event emission count | COND-004 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-004 blocked — SIG-004 pending live Prometheus scrape (INF-003 → CE-001 TMP-004)
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

### DIAG-005 — Fleet Connection Activity Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Fleet active connection count | COND-005 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-005 blocked — SIG-005 pending active WebSocket clients (fleet:* rooms → TMP-010)
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

### DIAG-006 — Sensor Integration Configuration Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Sensor bridge batch throughput rate | COND-006 | **complete** | **0.333 rec/sec** |
| Batch size (DIM-PC-002) | COND-006 (via SIG-006) | **complete** | **10 records** |
| Poll interval (DIM-PC-001) | COND-006 (via SIG-006) | **complete** | **30 seconds** |
| Activation state | COND-006 | **complete** | **configured** |

**Diagnosis input coverage state: complete**
**Governing model:** Stream 75.2 — Program Diagnosis Model
**Entity ref:** SA-001
**Temporal ref:** TMP-009 (30s config-defined)

---

### DIAG-007 — Alert Activity Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Vehicle alert severity state | COND-007 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-007 blocked — SIG-007 pending alert broadcast (TMP-003) or domain event stream (TMP-010)
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

### DIAG-008 — Driver Session Activity Diagnosis

| Input Dimension | Condition | Coverage State | Value |
|----------------|-----------|----------------|-------|
| Driver session performance composite | COND-008 | blocked | — |

**Diagnosis input coverage state: blocked**
**Blocking reason:** COND-008 blocked — SIG-008 pending driver session lifecycle events (TMP-010)
**Governing model:** Stream 75.2 — Program Diagnosis Model

---

## Coverage State Summary

| Diagnosis ID | Source Condition | Condition State | Diagnosis Input State |
|-------------|-----------------|----------------|----------------------|
| DIAG-001 | COND-001 | blocked | blocked |
| DIAG-002 | COND-002 | blocked | blocked |
| DIAG-003 | COND-003 | blocked | blocked |
| DIAG-004 | COND-004 | blocked | blocked |
| DIAG-005 | COND-005 | blocked | blocked |
| DIAG-006 | COND-006 | **complete** | **complete** |
| DIAG-007 | COND-007 | blocked | blocked |
| DIAG-008 | COND-008 | blocked | blocked |

| Category | Count | Diagnosis IDs |
|----------|-------|---------------|
| Complete | 1 | DIAG-006 |
| Blocked | 7 | DIAG-001, DIAG-002, DIAG-003, DIAG-004, DIAG-005, DIAG-007, DIAG-008 |
| Partial | 0 | — |

---

## Blocked and Unknown Condition Space

| Blocked Dimension | Source Condition | Blocking Source | Diagnosis Outcome |
|------------------|-----------------|----------------|-------------------|
| Backend service memory | COND-001 → SIG-001 | INF-003 Prometheus scrape (TMP-004) not available | DIAG-001 blocked |
| Cache efficiency | COND-002 → SIG-002 | INF-003 Prometheus scrape (TMP-004) not available | DIAG-002 blocked |
| Cache availability | COND-003 → SIG-003 | INF-003 Prometheus scrape (TMP-004) not available | DIAG-003 blocked |
| Event pipeline activity | COND-004 → SIG-004 | INF-003 Prometheus scrape (TMP-004) not available | DIAG-004 blocked |
| Fleet connection activity | COND-005 → SIG-005 | Active WebSocket clients (fleet:* rooms) not available | DIAG-005 blocked |
| Alert activity | COND-007 → SIG-007 | Alert event flow (TMP-003/TMP-010) not active | DIAG-007 blocked |
| Driver session activity | COND-008 → SIG-008 | Driver session lifecycle events (TMP-010) not active | DIAG-008 blocked |

These 7 dimensions represent explicitly unknown program state spaces for the running BlueEdge platform. They are not absent by design; they are unavailable due to runtime telemetry gaps. They must not be inferred, approximated, or omitted from downstream intelligence artifacts.
