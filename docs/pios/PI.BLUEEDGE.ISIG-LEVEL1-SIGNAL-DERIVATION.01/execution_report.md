# Execution Report — PI.BLUEEDGE.ISIG-LEVEL1-SIGNAL-DERIVATION.01

**Stream:** PI.BLUEEDGE.ISIG-LEVEL1-SIGNAL-DERIVATION.01
**Classification:** G2 — Architecture-Consuming
**Date:** 2026-05-23
**Branch:** feature/PI.BLUEEDGE.ISIG-LEVEL1-SIGNAL-DERIVATION.01
**Baseline:** main (post PI.BLUEEDGE.CHRONICLE-SIGNAL-INTEGRATION.01 merge)

---

## Pre-Flight

- Branch: feature/PI.BLUEEDGE.ISIG-LEVEL1-SIGNAL-DERIVATION.01 ✓
- Canonical state loaded: YES ✓
- Terminology loaded: YES ✓
- Branch authorized: YES (feature/ prefix, stream-scoped) ✓
- Architecture memory preflight: PASS

---

## Execution Summary

### Objective

Implement ISIG (Import Structure Intelligence Signals) as the first Level 1 signal family. Close the PSIG-004 LOST_READ gap by computing file-level import hub pressure and fan asymmetry directly from the 40.3s code graph.

### Source Authority

- `docs/pios/vault/05_RUNTIME_AND_CORRIDOR/LEVEL_1_VS_LEVEL_2_SIGNAL_DOCTRINE.md` — ISIG justified as structural necessity
- `docs/pios/vault/05_RUNTIME_AND_CORRIDOR/SIGNAL_FAMILY_TAXONOMY.md` — ISIG LEVEL_1_SIGNAL_FAMILY_REQUIRED
- `scripts/pios/dpsig/derive_relational_signals.py` — pattern reference (DPSIG derivation)
- `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_02/structure/40.3s/code_graph.json` — input artifact

### Actions Performed

1. **Created `scripts/pios/isig/derive_import_signals.py`** — ISIG derivation script following DPSIG pattern:
   - Input: 40.3s/code_graph.json (IMPORTS relationships only)
   - Output: artifacts/isig/<client>/<run>/isig_signal_set.json
   - Client-agnostic, code-graph-native
   - Two signals implemented: ISIG-001 (Import Hub Pressure), ISIG-002 (Import Fan Asymmetry)
   - Full derivation trace, explainability templates, replay taxonomy, provenance chain
   - Guard conditions for zero imports, zero files
   - Deterministic hashing for stable keys
   - Top-10 attribution lists for both in-degree and out-degree

2. **Executed on BlueEdge** (run_blueedge_genesis_e2e_02):
   - ISIG-001: 35.304 — HUB_PRESSURE_HIGH (common/dto/index.ts: 111 inbound, mean 3.14)
   - ISIG-002: 22.2638 — FAN_ASYMMETRY_HIGH (App.tsx: 70 outbound, mean 3.14)
   - 680 files, 2,138 IMPORTS, 479 with in-degree, 465 with out-degree

3. **Cross-validated on NetBox** (run_github_netbox_20260520_134600):
   - ISIG-001: 51.1345 — HUB_PRESSURE_HIGH
   - ISIG-002: 8.9485 — FAN_ASYMMETRY_HIGH
   - 1,155 files, 3,614 IMPORTS

### ISIG Signal Definitions

| Signal | Formula | Threshold | What It Measures |
|--------|---------|-----------|-----------------|
| ISIG-001 | max(import_in_degree) / mean(import_in_degree) | ≥5.0 HIGH, ≥2.0 ELEVATED | File-level import hub concentration — structural single-point-of-failure |
| ISIG-002 | max(import_out_degree) / mean(import_out_degree) | ≥5.0 HIGH, ≥2.0 ELEVATED | File-level coupling concentration — integration bottleneck detection |

### LOST_READ Resolution

PSIG-004 LOST_READ (file-level hub concentration invisible at Level 2) is now resolved:
- Level 2 (PSIG-004): 1.0 NORMAL — binding normalizes surface distribution (1:1 CE:CS)
- Level 1 (ISIG-001): 35.304 HIGH — common/dto/index.ts imported by 111 files (35x mean)
- The intelligence that was invisible at Level 2 is now visible as a named Level 1 signal

### Deferred

- ISIG-003 (Import Chain Depth): requires transitive graph traversal. Not implemented in this stream.
- LENS/BOARDROOM ISIG projection: requires integration into Phase 8a vault construction. Future stream.
- Pipeline integration: ISIG runs standalone (like DPSIG). Not yet wired into run_client_pipeline.py.

---

## Governance Compliance

- No existing artifact mutation: ✓
- No Lane A impact: ✓ (additive parallel derivation)
- No signal_registry.json impact: ✓ (ISIG writes to isig_signal_set.json only)
- No PSIG/DPSIG impact: ✓
- Client-agnostic: ✓ (proven on both BlueEdge and NetBox)
- Deterministic: ✓ (same input → same output, replay taxonomy enforced)
