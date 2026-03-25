# Regression Control Contract — 42.28

Stream: 42.28 — Unified Live Runtime Surface Certification
Date: 2026-03-25

---

## A. Required Stable Behaviors

### A1 — Topology Renders

- `?topology=true` returns 200 with `topology[]` array
- topology[] contains ≥ 1 domain
- Each domain contains `capabilities[]`
- `domain_count`, `capability_count`, `component_count` present and > 0
- `contract_id` = `PIOS-42.7-RUN01-CONTRACT-v2`

### A2 — Query Highlight Works

- `?topology=true&highlight=GQ-003` returns 200
- Response carries `highlight_query_id: "GQ-003"`
- At least one entity in topology carries `highlighted: true`
- Highlight classes (topo-domain-highlighted, topo-cap-highlighted, topo-chip-highlighted) defined in globals.css

### A3 — Red Node Visible for GQ-003

- Topology response carries at least one entity with `emphasis: "high"`
- That entity is traceable to `C_30_Domain_Event_Bus` (node_id)
- docs/pios/44.2/projection_attachment.json contains `C_30_Domain_Event_Bus` with `"emphasis": "high"`
- `.topo-emphasis-red` CSS class defined in globals.css
- TopologyPanel.js applies `topo-emphasis-red` when `entity.emphasis === 'high'`

### A4 — Core Query Routes Return 200

- `?query=GQ-003` → 200, JSON with `query_id`, `signals`, `evidence`
- `?list=true` → 200, JSON with `queries[]`
- `?overview=true` → 200, JSON with gauge metrics fields

### A5 — Obsidian Links (if vault configured)

- Topology entities with `resolved: true` carry non-null `vault_path`
- Vault path format: `DD_Domains/D_NN_*` or `02_Capabilities/C_NN_*`
- buildObsidianLink() constructs `obsidian://` URI from VAULT_NAME + vault_path

### A6 — ENL/Persona Routes (scope boundary)

- `?status=true`, `?enl=GQ-XXX`, `?persona=P&query=GQ-XXX` return 400 in current baseline
- These routes MUST NOT silently return 200 with fabricated data
- Regression: if any ENL route begins returning 200 without genuine adapter backing — FAIL

---

## B. No-Regression Checks

| Check | Method | Pass Condition |
|---|---|---|
| topology_200 | GET ?topology=true | status 200, topology[] present |
| topology_highlight_200 | GET ?topology=true&highlight=GQ-003 | status 200, highlight_query_id=GQ-003 |
| red_node_present | topology response | C_30_Domain_Event_Bus emphasis:high |
| emphasis_field_on_all_nodes | topology response | all domain/cap/cmp nodes carry emphasis field |
| emphasis_values_valid | topology response | all emphasis in {high, medium, low, none} |
| overview_200 | GET ?overview=true | status 200, metric fields present |
| query_200 | GET ?query=GQ-003 | status 200, query_id present |
| list_200 | GET ?list=true | status 200, queries[] present |
| topology_structure_stable | topology response | domain_count=4, capability_count=5, component_count=9 |
| projection_file_emphasis | docs/pios/44.2/projection_attachment.json | C_30_Domain_Event_Bus emphasis:high |
| enl_routes_400 | GET ?enl=GQ-003, ?persona=EXEC&query=GQ-003 | status 400 (adapters absent — not fabricated 200) |

---

## C. Failure Conditions

| Condition | Severity | Impact |
|---|---|---|
| Any active route regresses to non-200 | CRITICAL | Unified demo broken |
| Red-node emphasis:high disappears from topology response | CRITICAL | Step 6 of 51.3 broken |
| topology[] loses domain/capability/component structure | CRITICAL | Steps 4–5 broken |
| emphasis field absent from topology nodes | HIGH | 42.27 rendering layer blind |
| projection_attachment.json C_30_Domain_Event_Bus emphasis changed to non-high | HIGH | Red node disappears |
| ENL route begins returning fabricated 200 | HIGH | Governance violation — synthetic data |
| highlight_query_id missing from ?topology=true&highlight=GQ-003 | HIGH | Step 5 broken |
| ADAPTER_42_7 contract_id changes | MEDIUM | Traceability break |
| DemoController step count changes without governance record | MEDIUM | Demo choreography drift |

---

## D. Regression Validator

Run: `python3 scripts/pios/42.28/validate_unified_runtime_surface.py`

Covers all checks in Section B.
Writes: docs/pios/42.28/validation_log.json

Rerun after any change to:
- app/execlens-demo/pages/api/execlens.js
- scripts/pios/42.7/execlens_topology_adapter.py
- docs/pios/44.2/projection_attachment.json
- app/execlens-demo/components/TopologyPanel.js
- app/execlens-demo/styles/globals.css

---

## E. Scope Boundary

In scope for regression:
- Routes: query, list, overview, topology, topology+highlight
- Red-node emphasis on C_30_Domain_Event_Bus
- Topology structure stability

Out of scope (adapters absent — cannot regress what doesn't work):
- ENL routes (42.13/42.15/42.16 adapters absent)
- DemoController 9-step choreography (not yet implemented)
- PersonaPanel (not yet implemented)
