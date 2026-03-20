# Condition Traceability Map
run_id: run_01_blueedge
stream: Stream 40.6 — PiOS Condition and Diagnosis Activation Layer
contract: PIOS-40.6-RUN01-CONTRACT-v1
upstream_contract: PIOS-40.5-RUN01-CONTRACT-v1
date: 2026-03-19

---

## Traceability Rule

Every governed condition must trace to:
1. A CVAR_ condition input variable
2. One governed 40.5 signal as explicit input
3. The DIM- dimensions the signal maps to
4. The 40.5 artifact in which the signal output is recorded
5. An entity reference (BM-/CE-/SA- codes from 40.3 entity_catalog.md via 40.5 signal artifacts)
6. A temporal reference (inherited from governing signal)

No condition is valid without complete traceability. No traceability entry may reference 40.2, 40.3, or 40.4 artifacts directly — only 40.5 signal artifacts are in scope.

---

## Full Traceability Table

| Condition | CVAR Input | Governing Signal | DIM Dimensions | 40.5 Source Artifact | Entity Ref | Temporal |
|-----------|-----------|-----------------|----------------|---------------------|-----------|---------|
| COND-001 Backend Service Memory State | CVAR_MEM_001 | SIG-001 | DIM-PR-001 | signal_output_set.md | CE-001/BM-061 | TMP-004 |
| COND-002 Cache Efficiency State | CVAR_CACHE_001 | SIG-002 | DIM-CP-001, DIM-CP-002 | signal_output_set.md | CE-001/BM-061+INF-002 | TMP-004 |
| COND-003 Cache Availability State | CVAR_CACHE_002 | SIG-003 | DIM-CP-003 | signal_output_set.md | CE-001/BM-061+INF-002 | TMP-004 |
| COND-004 Event Pipeline Activity State | CVAR_EVT_001 | SIG-004 | DIM-ET-001 | signal_output_set.md | CE-001/BM-063 | TMP-004 |
| COND-005 Fleet Connection Activity State | CVAR_WS_001 | SIG-005 | DIM-CS-001 | signal_output_set.md | CE-001/BM-062 | TMP-010 |
| COND-006 Sensor Integration Configuration State | CVAR_HASI_001 | SIG-006 | DIM-PC-001, DIM-PC-002 | signal_output_set.md | SA-001 | TMP-009 |
| COND-007 Alert Activity State | CVAR_ALT_001 | SIG-007 | DIM-DE-007 | signal_output_set.md | CE-001/BM-005 | TMP-003+TMP-010 |
| COND-008 Driver Session Activity State | CVAR_DS_001 | SIG-008 | DIM-DE-004, DIM-DE-005, DIM-DE-006 | signal_output_set.md | CE-001/BM-057+BM-043 | TMP-010 |

**8/8 conditions fully traced**

---

## CVAR-to-Signal Mappings

| CVAR Variable | Governing Signal | Signal State | Condition |
|---------------|-----------------|-------------|-----------|
| CVAR_MEM_001 | SIG-001 | pending | COND-001 |
| CVAR_CACHE_001 | SIG-002 | pending | COND-002 |
| CVAR_CACHE_002 | SIG-003 | pending | COND-003 |
| CVAR_EVT_001 | SIG-004 | pending | COND-004 |
| CVAR_WS_001 | SIG-005 | pending | COND-005 |
| CVAR_HASI_001 | SIG-006 | **complete** | COND-006 |
| CVAR_ALT_001 | SIG-007 | pending | COND-007 |
| CVAR_DS_001 | SIG-008 | pending | COND-008 |

**Total CVAR-to-signal mappings: 8**

---

## Signal-to-DIM Coverage

| Signal | DIM Dimensions | Used In |
|--------|---------------|---------|
| SIG-001 | DIM-PR-001 | COND-001 |
| SIG-002 | DIM-CP-001, DIM-CP-002 | COND-002 |
| SIG-003 | DIM-CP-003 | COND-003 |
| SIG-004 | DIM-ET-001 | COND-004 |
| SIG-005 | DIM-CS-001 | COND-005 |
| SIG-006 | DIM-PC-001, DIM-PC-002 | COND-006 |
| SIG-007 | DIM-DE-007 | COND-007 |
| SIG-008 | DIM-DE-004, DIM-DE-005, DIM-DE-006 | COND-008 |

---

## Entity Reference Coverage

| Entity | Conditions |
|--------|-----------|
| CE-001/BM-061 | COND-001 |
| CE-001/BM-061+INF-002 | COND-002, COND-003 |
| CE-001/BM-063 | COND-004 |
| CE-001/BM-062 | COND-005 |
| SA-001 | COND-006 |
| CE-001/BM-005 | COND-007 |
| CE-001/BM-057+BM-043 | COND-008 |

---

## 40.5 Artifact Coverage

| 40.5 Artifact | Signals Providing Condition Inputs | Conditions Fed |
|---------------|-----------------------------------|---------------|
| signal_output_set.md | SIG-001..008 | COND-001..008 (all) |
| signal_traceability_map.md | Signal-to-DIM chains | All conditions (upstream authority chain) |
| signal_validation_log.md | Signal coverage states | All conditions (coverage propagation) |
| execution_manifest.md | Upstream blocking declarations | COND-001..005, COND-007..008 (blocking inheritance) |

---

## Traceability Completeness Declaration

| Condition | CVAR Traced | Signal Traced | DIM Cited | 40.5 Artifact Cited | Entity Ref | Temporal | Complete |
|-----------|------------|--------------|-----------|---------------------|-----------|---------|---------|
| COND-001 | yes | yes (SIG-001) | yes (DIM-PR-001) | yes | yes (CE-001/BM-061) | yes | yes |
| COND-002 | yes | yes (SIG-002) | yes (DIM-CP-001..002) | yes | yes (CE-001/BM-061+INF-002) | yes | yes |
| COND-003 | yes | yes (SIG-003) | yes (DIM-CP-003) | yes | yes (CE-001/BM-061+INF-002) | yes | yes |
| COND-004 | yes | yes (SIG-004) | yes (DIM-ET-001) | yes | yes (CE-001/BM-063) | yes | yes |
| COND-005 | yes | yes (SIG-005) | yes (DIM-CS-001) | yes | yes (CE-001/BM-062) | yes | yes |
| COND-006 | yes | yes (SIG-006) | yes (DIM-PC-001..002) | yes | yes (SA-001) | yes | yes |
| COND-007 | yes | yes (SIG-007) | yes (DIM-DE-007) | yes | yes (CE-001/BM-005) | yes | yes |
| COND-008 | yes | yes (SIG-008) | yes (DIM-DE-004..006) | yes | yes (CE-001/BM-057+BM-043) | yes | yes |

**Total conditions traced: 8 / 8**
**Conditions with missing traceability: 0**
