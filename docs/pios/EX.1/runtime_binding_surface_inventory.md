# EX.1 — Runtime Binding Surface Inventory

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** BINDING SURFACE INVENTORY
**Date:** 2026-04-03
**Authority:** EX.1

---

## 1. RUNTIME ENTRY POINTS

### 1.1 Primary Entry Point

**File:** `app/execlens-demo/pages/api/execlens.js`
**Protocol:** HTTP GET
**Consumed by:** Next.js page `pages/index.js`

Query parameters and their routing:

| Parameter | Route | Adapter | Adapter Exists |
|---|---|---|---|
| `?query=GQ-NNN` | Single query execution | `scripts/pios/42.4/execlens_adapter.py` | YES |
| `?list=true` | Query list | `scripts/pios/42.4/execlens_adapter.py` | YES |
| `?overview=true` | Overview metrics | `scripts/pios/42.6/execlens_overview_adapter.py` | YES |
| `?topology=true` | Structural topology | `scripts/pios/42.7/execlens_topology_adapter.py` | YES |
| `?status=true` | Semantic path status | `scripts/pios/42.13/demo_activate.py` | **MISSING** |
| `?enl=GQ-NNN` | ENL chain reveal | `scripts/pios/42.15/enl_console_adapter.py` | **MISSING** |
| `?persona=X&query=GQ-NNN` | Persona projection | `scripts/pios/42.16/persona_view_map.py` | **MISSING** |

### 1.2 Secondary Entry Point

**File:** `app/execlens-demo/components/LandingGaugeStrip.js` (inferred)
**Calls:** `/api/execlens?overview=true` at mount

**File:** `app/execlens-demo/components/TopologyPanel.js` (inferred)
**Calls:** `/api/execlens?topology=true[&highlight=GQ-NNN]` at mount

---

## 2. ADAPTER CHAIN INVENTORY

### 2.1 42.4 — Main Query Adapter (PRESENT)

**File:** `scripts/pios/42.4/execlens_adapter.py`
**Contract:** PIOS-42.4-RUN01-CONTRACT-v2
**Chain:** 42.4 → 42.2 → 42.1 → 41.x artifacts

**Reads from:**
- `docs/pios/41.5/query_signal_map.json` (via 42.1)
- `docs/pios/41.4/signal_registry.json` (via 42.1)
- `docs/pios/41.4/evidence_mapping_index.json` (via 42.1)
- `docs/pios/41.5/query_response_templates.md` (via 42.1)
- `docs/pios/41.2/pie_vault/` (navigation binding via 42.1)

**Does NOT read from:**
- `pios/core/v0.1/engine/compute_signals.py` (not invoked)
- `pios/core/v0.1/engine/activate_conditions.py` (not invoked)
- `runs/pios/40.5/ce10_validation/signal_output.json` (not accessed)
- `runs/pios/40.6/ce10_validation/condition_output.json` (not accessed)

### 2.2 42.6 — Overview Metrics Adapter (PRESENT)

**File:** `scripts/pios/42.6/execlens_overview_adapter.py`
**Contract:** PIOS-42.6-RUN01-CONTRACT-v1
**Chain:** 42.6 → 42.2 → 42.1 → 41.4/signal_registry.json

**Extracts (regex from signal statement text):**
- `dependency_load` from SIG-003 statement (r"computed at (0\.\d+)")
- `structural_density` from SIG-004 statement (r"edge-to-node density \((\d+\.\d+)\)")
- `coordination_pressure` from SIG-005 statement (r"static component of (0\.\d+)")
- `visibility_deficit` from SIG-002 title (word-to-int map)

### 2.3 42.7 — Topology Adapter (PRESENT)

**File:** `scripts/pios/42.7/execlens_topology_adapter.py`
**Contract:** PIOS-42.7-RUN01-CONTRACT-v2
**Chain:** 42.7 → 42.2 → 42.1 → 41.5/templates + 41.2/pie_vault

**Also reads:** `docs/pios/44.2/projection_attachment.json` (emphasis values)

### 2.4 42.23 — WOW Chain Adapter (PRESENT)

**File:** `scripts/pios/42.23/execlens_wowchain_adapter.py`
**Contract:** PIOS-42.23-RUN01-CONTRACT-v1
**Reads from:** `docs/pios/42.22/sample_runtime_output.json` (static artifact)

**NOTE:** `signal_state` in 42.22 source uses value `"computed"` — outside CE.4 vocabulary.

### 2.5 42.13 — Demo Activate (MISSING)

**File:** `scripts/pios/42.13/demo_activate.py` — **DOES NOT EXIST**
**Referenced by:** API route `?status=true` path
**Effect:** Any `?status=true` request fails with 400 or process execution error

### 2.6 42.15 — ENL Console Adapter (MISSING)

**File:** `scripts/pios/42.15/enl_console_adapter.py` — **DOES NOT EXIST**
**Referenced by:** API route `?enl=GQ-NNN` path
**Effect:** Any `?enl=` request fails

### 2.7 42.16 — Persona View Map (MISSING)

**File:** `scripts/pios/42.16/persona_view_map.py` — **DOES NOT EXIST**
**Referenced by:** API route `?persona=` path
**Effect:** Any `?persona=` request fails

---

## 3. DATA STRUCTURE INVENTORY — WHAT CROSSES THE BOUNDARY

### 3.1 Signal record (42.4 → frontend)

Fields passed to SignalGaugeCard:
```
signal_id, relevance, title, evidence_confidence, domain_id, domain_name,
capability_id, capability_name, component_ids, component_names,
statement, business_impact, risk, evidence (object or null), evidence_warning
```

**CE.4 emission state:** ABSENT
**CE.5 consumption_state:** ABSENT
**CE.5 consumption record:** ABSENT
**CE.4 partiality_reasons:** ABSENT
**CE.4 blocking_class:** ABSENT

### 3.2 Overview metric record (42.6 → LandingGaugeStrip)

```
id, label, signal_id, value, unit, fill_pct, fill_scale,
confidence (from evidence_confidence), context, extraction_status
```

**CE.4 emission state:** ABSENT
**CE.2 condition tier:** ABSENT

### 3.3 WOW chain record (42.23 → TopologyPanel)

```
node_id, node_label, signal_id, signal_state, emphasis,
emphasis_render_token, attachment_id, projection_reference, binding_id
```

**signal_state:** PRESENT — value is "computed" (non-CE.4 vocabulary)

### 3.4 CE.10 engine output (NOT read by runtime)

`runs/pios/40.5/ce10_validation/signal_output.json`:
- 8 signals with `state` ∈ {PARTIAL, COMPLETE, BLOCKED}
- `partiality_reasons`, `traceability`, `output`

`runs/pios/40.6/ce10_validation/condition_output.json`:
- 8 conditions with `condition_coverage_state` ∈ {STABLE, BLOCKED}
- 8 diagnoses with `diagnosis_activation_state` ∈ {INACTIVE, BLOCKED}
- `ce5_consumption_records`: 8 records
- `ce5_traceability_records`: 8 records

**These files are untracked and not read by any runtime adapter.**

---

## 4. COMPONENT BINDING MAP

| Frontend Component | API Call | Adapter | Source Artifacts |
|---|---|---|---|
| `index.js` (query data) | `?query=GQ-NNN` | 42.4 | 41.4, 41.5 |
| `QuerySelector` | `?list=true` | 42.4 | 41.5/query_signal_map.json |
| `LandingGaugeStrip` | `?overview=true` | 42.6 | 41.4/signal_registry.json |
| `TopologyPanel` | `?topology=true` | 42.7 | 41.5/templates, 41.2/vault |
| `SignalGaugeCard` | (data from query) | 42.4 | 41.4/signal_registry.json |
| `EvidencePanel` | (data from query) | 42.4 | 41.4/evidence_mapping_index.json |
| `TemplateRenderer` | (data from query) | 42.4 | 41.5/query_response_templates.md |
| Demo status | `?status=true` | **42.13 MISSING** | — |
| ENL reveal | `?enl=` | **42.15 MISSING** | — |
| Persona view | `?persona=` | **42.16 MISSING** | — |

---

## 5. PIOS CORE ENGINE STATUS IN RUNTIME

| Engine Component | File Path | Invoked by Runtime |
|---|---|---|
| Emission layer | `pios/core/v0.1/engine/compute_signals.py` | **NO** |
| Consumption + propagation | `pios/core/v0.1/engine/activate_conditions.py` | **NO** |
| CE.10 validation signal output | `runs/pios/40.5/ce10_validation/signal_output.json` | **NO** |
| CE.10 validation condition output | `runs/pios/40.6/ce10_validation/condition_output.json` | **NO** |

The PiOS v0.4 certified engine is not in the runtime execution path.
