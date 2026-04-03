# EX.3 — Static to Live Replacement Map

**Stream:** EX.3 — Runtime Integration & System Bridge (Default Path Binding)
**Artifact type:** STATIC TO LIVE REPLACEMENT MAP
**Date:** 2026-04-03
**Authority:** EX.3

---

## 1. PURPOSE

This document specifies exactly which static reads were replaced by live engine outputs,
which were preserved as correct L3 reads, and which remain as IB-001 defects for
subsequent streams.

---

## 2. REPLACEMENTS APPLIED

### REP-001 — Metric value: dependency_load

**Adapter:** `scripts/pios/42.6/execlens_overview_adapter.py`
**Before (static):** Regex extraction from L3 SIG-003 statement text:
`r"computed at (0\.\d+)"` → `0.682` (from `docs/pios/41.4/signal_registry.json`)
**After (live):** `pios_bridge.get_live_metric_value(live_data, "SIG-003")`
→ engine SIG-002 `output.dependency_load_ratio` = `0.682`
**Source authority:** CE.4 certified engine, engine run committed to `runs/pios/40.5/<run_id>/`
**IB class:** IB-001 (static truth-source) → CLOSED

---

### REP-002 — Metric value: structural_density

**Adapter:** `scripts/pios/42.6/execlens_overview_adapter.py`
**Before (static):** Regex extraction from L3 SIG-004 statement:
`r"edge-to-node density \((\d+\.\d+)\)"` → `1.273`
**After (live):** engine SIG-004 `output.total_edge_density` = `1.273`
**IB class:** IB-001 → CLOSED

---

### REP-003 — Metric value: coordination_pressure

**Adapter:** `scripts/pios/42.6/execlens_overview_adapter.py`
**Before (static):** Regex extraction from L3 SIG-005 statement:
`r"static component of (0\.\d+)"` → `0.875`
**After (live):** engine SIG-001 `output.static_structural_ratio` = `0.875`
**IB class:** IB-001 → CLOSED

---

### REP-004 — CE.4 emission states in query response

**Adapter:** `scripts/pios/42.4/execlens_adapter.py`
**Before (static):** Not present — CE.4 states entirely absent from query response (IB-002)
**After (live):** `pios_bridge.get_l3_signal_pios_context(live_data, sig_id).pios_emission_state`
→ CE.4 state added to each signal entry in query response
**IB class:** IB-002 (adapter not bound to live path) → CLOSED; IB-004 (CE.5 missing) → CLOSED

---

### REP-005 — CE.2 condition/diagnosis states in topology response

**Adapter:** `scripts/pios/42.7/execlens_topology_adapter.py`
**Before (static):** CE.2 states entirely absent from topology response (IB-005)
**After (live):** `pios_bridge.get_pios_condition_summary(live_data)`
→ `pios_summary` block with all 8 condition tiers and 8 diagnosis states
**IB class:** IB-005 (CE.2 propagation missing in runtime) → CLOSED

---

## 3. PRESERVED (NOT REPLACED — ARCHITECTURALLY CORRECT)

| Read | Source | Adapter | Reason |
|---|---|---|---|
| Query text, intent_type, semantic_tags | 41.5/query_signal_map.json | 42.4/42.7 | L3 semantic content — no engine equivalent |
| Signal title, statement, domain, capability, components | 41.4/signal_registry.json | 42.4/42.6 | L3 semantic content — no engine equivalent |
| Evidence data | 41.4/evidence_mapping_index.json | 42.4 | L3 semantic content — no engine equivalent |
| Response templates | 41.5/query_response_templates.md | 42.4/42.7 | L3 semantic content — no engine equivalent |
| Navigation links / pie_vault | 41.2/pie_vault/ | 42.4/42.7 | L3 structural navigation — no engine equivalent |
| visibility_deficit value (7) | 41.4 SIG-002 title | 42.6 | L3 semantic content — dimensionality count |

These reads are **not** static truth-source dependencies (IB-001). They are correct L3 reads per the reference_boundary_contract: L3 semantic layer reads from L2 static outputs. Replacing them would require redesigning the L3 layer — out of EX.3 scope.

---

## 4. REMAINING STATIC TRUTH-SOURCE DEFECTS

| Defect | Adapter | Source | Owner |
|---|---|---|---|
| IB-001: signal_state "computed" in WOW | 42.23 | 42.22/sample_runtime_output.json | GC-003 + EX.3 WOW |
| IB-003: mapping layer absent for 42.4/42.6 query-level CE.4 augmentation | 42.4/42.6 | N/A | CLOSED by EX.3 (L3_TO_ENGINE mapping in pios_bridge) |
| IB-006: missing adapters 42.13/42.15/42.16 | N/A | N/A | EX.3 ×3 + GC-001 |

---

## 5. DUAL TRUTH SYSTEM CHECK

**IB-007 (dual truth system detected): NOT TRIGGERED**

After EX.3:
- Metric values: single source — live engine. Static extraction is fallback only, declared explicitly via `value_source: "static_extraction"`.
- CE.4/CE.5/CE.2 states: single source — live engine.
- L3 semantic content: single source — 41.x static files.

There is no case where both sources provide a value for the same field simultaneously. The `value_source` field in 42.6 output makes the active source explicit and auditable.
