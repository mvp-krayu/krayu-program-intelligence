# Canonical 41.x Artifact Matrix
# GAUGE.41X.CANONICAL.CONSUMPTION.FORENSICS.01 — Deliverable 2

## Identity

- Contract: GAUGE.41X.CANONICAL.CONSUMPTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Classification Definitions

| class | definition |
|-------|-----------|
| HUMAN_READABLE_ONLY | MD/prose artifact — no machine-parseable structure suitable for API consumption |
| MACHINE_CONSUMABLE | JSON artifact — parseable by API layer without any adapter transformation |
| ADAPTER_REQUIRED | Artifact can be consumed but requires an adapter extraction pass before API delivery |
| NOT_SUITABLE | Artifact structure is not suitable for GAUGE consumption regardless of transformation |

---

## Artifact Matrix

| artifact | path | format | class | consumable_by_gauge | notes |
|----------|------|--------|-------|---------------------|-------|
| semantic_domain_model.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | MD prose with component/relationship anchors |
| capability_map.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | MD prose capability definitions |
| semantic_traceability_map.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | MD registry table — no machine-parseable schema |
| pie_render_manifest.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | Render rules and 148-node table in MD format |
| executive_readability_map.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | Narrative descriptions |
| semantic_elevation_report.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | Supporting analysis |
| semantic_feedback_directives.md | docs/pios/41.1/ | MD | HUMAN_READABLE_ONLY | NO | Directive artifact |
| pie_index.md | docs/pios/41.2/ | MD | HUMAN_READABLE_ONLY | NO | Navigation index in MD |
| pie_node_inventory.md | docs/pios/41.2/ | MD | ADAPTER_REQUIRED | CONDITIONAL | 148-node table in MD format; could be parsed with regex adapter — no schema |
| pie_render_validation_report.md | docs/pios/41.2/ | MD | HUMAN_READABLE_ONLY | NO | Validation report |
| pie_demo_walkthrough.md | docs/pios/41.2/ | MD | HUMAN_READABLE_ONLY | NO | Demo navigation script |
| D_01_*.md … D_17_*.md (vault domains) | docs/pios/41.2/pie_vault/01_Domains/ | MD ×17 | ADAPTER_REQUIRED | CONDITIONAL | Structured MD per domain; no JSON schema — requires per-file parse |
| C_01_*.md … C_42_*.md (vault capabilities) | docs/pios/41.2/pie_vault/02_Capabilities/ | MD ×42 | ADAPTER_REQUIRED | CONDITIONAL | Structured MD per capability |
| CMP_01_*.md … CMP_89_*.md (vault components) | docs/pios/41.2/pie_vault/03_Components/ | MD ×89 | ADAPTER_REQUIRED | CONDITIONAL | Structured MD per component |
| semantic_consolidation_report.md | docs/pios/41.3/ | MD | HUMAN_READABLE_ONLY | NO | Normalization report |
| **signal_registry.json** | docs/pios/41.4/ | **JSON** | **MACHINE_CONSUMABLE** | **YES** | 5 signals — each has domain_id, capability_id, component_ids[], evidence_confidence, business_impact |
| **evidence_mapping_index.json** | docs/pios/41.4/ | **JSON** | **MACHINE_CONSUMABLE** | **YES** | Signal-to-evidence artifact mapping |
| executive_signal_report.md | docs/pios/41.4/ | MD | HUMAN_READABLE_ONLY | NO | Narrative signal summary |
| **query_signal_map.json** | docs/pios/41.5/ | **JSON** | **MACHINE_CONSUMABLE** | **YES** | 10 queries → 5 signals; machine-parseable |
| golden_query_catalog.md | docs/pios/41.5/ | MD | HUMAN_READABLE_ONLY | NO | Human catalog |
| interactive_query_examples.md | docs/pios/41.5/ | MD | HUMAN_READABLE_ONLY | NO | Human examples |
| query_response_templates.md | docs/pios/41.5/ | MD | ADAPTER_REQUIRED | CONDITIONAL | Used by 42.1 at runtime via direct file read — not JSON |

---

## Machine-Consumable Summary (GAUGE-eligible)

| file | layer | structure | entry_count | gauge_surface |
|------|-------|-----------|-------------|---------------|
| signal_registry.json | 41.4 | `{signals: [{signal_id, domain_id, capability_id, component_ids[], ...}]}` | 5 signals | NO SURFACE DEFINED |
| evidence_mapping_index.json | 41.4 | signal → evidence_refs mapping | 5 entries | NO SURFACE DEFINED |
| query_signal_map.json | 41.5 | `{queries: [{query_id, signal_ids[]}]}` | 10 queries | NO SURFACE DEFINED |

---

## ADAPTER_REQUIRED Artifacts — Adapter Status in Repository

The 42.x chain already implements adapters that consume 41.x artifacts via the `42.1 → 42.2 → 42.7` chain:

| adapter | path | 41.x artifacts consumed | output |
|---------|------|------------------------|--------|
| run_execlens_query.py (42.1) | scripts/pios/42.1/ | 41.5/query_signal_map.json, 41.4/signal_registry.json, 41.4/evidence_mapping_index.json, 41.2/pie_vault/ | JSON to stdout |
| execlens_topology_adapter.py (42.7) | scripts/pios/42.7/ | via 42.2 → 42.1 chain; resolves vault paths to 41.2/pie_vault/ | JSON topology to stdout |
| execlens_overview_adapter.py (42.6) | scripts/pios/42.6/ | via 42.x chain | JSON overview to stdout |

These adapters exist for the ExecLens DEMO (app/execlens-demo). **None are wired to the GAUGE product (app/gauge-product).**

---

## Critical Absence Finding

| finding | detail |
|---------|--------|
| NO_JSON_TOPOLOGY | No JSON representation of the 148-node (domain/capability/component) topology exists anywhere in the 41.x chain. The 148-node inventory exists ONLY as `pie_node_inventory.md` (MD table format). |
| NO_GAUGE_CONSUMPTION | Zero 41.x artifacts are currently consumed by any GAUGE API route (api/gauge.js, api/topology.js) or GAUGE library. |
| ADAPTER_EXISTS_NOT_WIRED | The 42.x adapter chain CAN traverse 41.x artifacts but is not accessible from the GAUGE product. |
