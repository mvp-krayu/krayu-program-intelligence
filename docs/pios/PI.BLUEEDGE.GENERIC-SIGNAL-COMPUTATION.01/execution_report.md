# Execution Report — PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01

## Stream Identity

| Field | Value |
|-------|-------|
| Stream | PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01 |
| Classification | G2 — Architecture-Consuming |
| Branch | feature/PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01 |
| Baseline | f89cd64 (signal derivation spine canonicalization merged) |
| Date | 2026-05-23 |

## Pre-Flight

| Check | Result |
|-------|--------|
| Branch correct | PASS — feature/PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01 |
| Inputs present | PASS — binding_envelope.json at run_blueedge_genesis_e2e_02 |
| Dependencies complete | PASS — PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01 merged (f89cd64) |
| Canonical state loaded | PASS |
| Terminology loaded | PASS |

## Scope

1. Remove SIGNAL_SHORTCUT_RETAINED from pipeline Phase 6+7
2. Run generic PSIG computation on BlueEdge genesis binding envelope
3. Re-derive DPSIG on genesis run's 40.4 topology
4. Rebuild vault (Phase 8a) with new signal artifacts
5. Produce BLUEEDGE_SIGNAL_INTELLIGENCE_DELTA.md certifying intelligence quality

## Execution

### 1. SIGNAL_SHORTCUT_RETAINED Removal

Removed the `fastapi_conformance_path` shortcut block from `phase_06_and_07_e2e()` in `run_client_pipeline.py`. The function now:
- Checks for `binding/binding_envelope.json` existence
- Gracefully skips S1 structural-only specimens without binding
- Runs `run_end_to_end.py` for all specimens with a binding envelope
- No legacy conformance artifact path

### 2. Generic PSIG Computation

`run_end_to_end.py --run-dir clients/blueedge/psee/runs/run_blueedge_genesis_e2e_02`

Input: generic binding envelope (33 nodes: 13 BC + 10 CE + 10 CS, 33 edges: 19 GROUNDS + 10 EXPOSES + 4 IMPORTS_ACROSS)

Results:
- PSIG-001: 4.0, HIGH (CE-04, CE-08 — 4× mean fan_in)
- PSIG-002: 4.0, HIGH (DOM-04, DOM-05, DOM-08, DOM-09 — 4× mean fan_out)
- PSIG-004: 1.0, HIGH in projection via zone attribution (NORMAL at entity level — uniform 1:1 CE:CS)
- PSIG-006: 0.1515, ACTIVATED (6 connected components — genuine isolation)
- 4 pressure candidates (all domain-level)
- 4 pressure zones (all COMPOUND_ZONE)

### 3. DPSIG Re-Derivation

`derive_relational_signals.py --client blueedge --run run_blueedge_genesis_e2e_02`

Input: 40.4/canonical_topology.json (944 nodes, 10 clusters)

Results:
- DPSIG-031 CPI: 3.4532, CLUSTER_PRESSURE_ELEVATED (max cluster "backend" = 541 nodes, mean non-singleton = 156.7)
- DPSIG-032 CFA: 0.5731, CLUSTER_ASYMMETRIC (541/944 = 57% in one cluster)
- Severity band: ELEVATED

### 4. Vault Reconstruction

Phase 8a re-run. signal_registry.json rebuilt with generic signal values. binding_envelope.json copied to vault.

### 5. Intelligence Delta

BLUEEDGE_SIGNAL_INTELLIGENCE_DELTA.md produced with per-signal classification:
- 4 IMPROVED_READ (PSIG-002, pressure zones, DPSIG-031, DPSIG-032)
- 1 DIFFERENT_ABSTRACTION_SAME_READ (PSIG-001)
- 1 NEW_READ (PSIG-006)
- 1 LOST_READ (PSIG-004 → OPEN_GAP: LEVEL_1_SIGNAL_FAMILY_REQUIRED)

**Certification gate: PASS — NET IMPROVEMENT**
