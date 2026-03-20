# Condition Input Matrix
run_id: run_01_blueedge
stream: Stream 40.6 — PiOS Condition and Diagnosis Activation Layer
contract: PIOS-40.6-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.5-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Input Boundary Declaration

Primary 40.5 input artifacts consumed (read-only):

| Artifact | Path | Status |
|---------|------|--------|
| signal_output_set.md | docs/pios/40.5/ | Locked |
| signal_validation_log.md | docs/pios/40.5/ | Locked |
| signal_traceability_map.md | docs/pios/40.5/ | Locked |
| execution_manifest.md | docs/pios/40.5/ | Locked |

---

## Condition Input Variables (CVAR_)

Each CVAR_ variable maps a governing 40.5 signal to a condition input slot. Signal state is inherited directly from 40.5 signal_output_set.md — no modification.

### CVAR_MEM — Backend Memory Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_MEM_001 | SIG-001 Backend Process Heap Usage | DIM-PR-001 | CE-001/BM-061 | TMP-004 (10s) | pending |

### CVAR_CACHE — Cache State Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_CACHE_001 | SIG-002 Cache Hit Efficiency | DIM-CP-001, DIM-CP-002 | CE-001/BM-061+INF-002 | TMP-004 (10s) | pending |
| CVAR_CACHE_002 | SIG-003 Cache Connectivity State | DIM-CP-003 | CE-001/BM-061+INF-002 | TMP-004 (10s) | pending |

### CVAR_EVT — Event Pipeline Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_EVT_001 | SIG-004 Domain Event Emission Count | DIM-ET-001 | CE-001/BM-063 | TMP-004 (10s) | pending |

### CVAR_WS — Fleet Connection Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_WS_001 | SIG-005 Fleet Active Connection Count | DIM-CS-001 | CE-001/BM-062 | TMP-010 (event-driven) | pending |

### CVAR_HASI — Sensor Integration Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_HASI_001 | SIG-006 Sensor Bridge Batch Throughput Rate | DIM-PC-001, DIM-PC-002 | SA-001 | TMP-009 (30s) | **complete** |

### CVAR_ALT — Alert State Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_ALT_001 | SIG-007 Vehicle Alert Severity State | DIM-DE-007 | CE-001/BM-005 | TMP-003+TMP-010 | pending |

### CVAR_DS — Driver Session Signals

| Variable | Signal | DIM Basis | Entity | Temporal | Signal State |
|----------|--------|-----------|--------|----------|-------------|
| CVAR_DS_001 | SIG-008 Driver Session Performance | DIM-DE-004, DIM-DE-005, DIM-DE-006 | CE-001/BM-057+BM-043 | TMP-010 (event-driven) | pending |

---

## CVAR Summary

| Variable | Signal | Signal State | Governing Condition |
|----------|--------|-------------|---------------------|
| CVAR_MEM_001 | SIG-001 | pending | COND-001 |
| CVAR_CACHE_001 | SIG-002 | pending | COND-002 |
| CVAR_CACHE_002 | SIG-003 | pending | COND-003 |
| CVAR_EVT_001 | SIG-004 | pending | COND-004 |
| CVAR_WS_001 | SIG-005 | pending | COND-005 |
| CVAR_HASI_001 | SIG-006 | **complete** | COND-006 |
| CVAR_ALT_001 | SIG-007 | pending | COND-007 |
| CVAR_DS_001 | SIG-008 | pending | COND-008 |

**Total CVAR_ variables: 8**
**Active (signal complete): 1 (CVAR_HASI_001)**
**Blocked (signal pending runtime telemetry): 7**

---

## Coverage Propagation Rule

Signal coverage states propagate to condition coverage states without modification:
- pending signal → blocked condition
- complete signal → complete condition
- No condition coverage state may be elevated above its governing signal state.

---

## Status

condition_input_matrix_complete: TRUE
