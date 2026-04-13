# Canonical 41.x Inventory
# GAUGE.41X.CANONICAL.CONSUMPTION.FORENSICS.01 — Deliverable 1

## Identity

- Contract: GAUGE.41X.CANONICAL.CONSUMPTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Scope

Full artifact inventory of the 41.x semantic canonicalization chain as it exists in the repository on 2026-04-13.

---

## 41.1 — Semantic Canonicalization Layer

**Directory:** `docs/pios/41.1/`

| artifact_id | file | type | description |
|-------------|------|------|-------------|
| PIOS-41.1-OUTPUT-01 | semantic_domain_model.md | MD | 17 domains with component_anchors, relationship_anchors, execution_path_anchors |
| PIOS-41.1-OUTPUT-02 | capability_map.md | MD | 42 capabilities with component_members and execution contributions |
| PIOS-41.1-OUTPUT-03 | semantic_traceability_map.md | MD | 89-component traceability registry (COMP-ID, capability, domain, traceability_basis, evidence_ref) |
| PIOS-41.1-OUTPUT-05 | pie_render_manifest.md | MD | 148-node render inventory table; rendering rules RR-01–RR-07; execution path overlays EP-01–EP-08 |
| PIOS-41.1-OUTPUT-07 | executive_readability_map.md | MD | Plain-language descriptions of all 17 domains |
| (supporting) | semantic_elevation_report.md | MD | Elevation analysis artifact |
| (supporting) | semantic_feedback_directives.md | MD | Feedback directives artifact |

**Node counts declared:** 17 domains, 42 capabilities, 89 components = 148 total  
**Format:** ALL MD — no JSON artifacts in 41.1  
**Status:** MATERIALIZED — all files present

---

## 41.2 — PIE Vault Materialization

**Directory:** `docs/pios/41.2/`

| artifact_id | file | type | description |
|-------------|------|------|-------------|
| PIOS-41.2-PIE-INDEX | pie_index.md | MD | Domain navigation table with capability/component counts; 148 total nodes |
| PIOS-41.2-NODE-INVENTORY | pie_node_inventory.md | MD | Complete 148-node inventory table with vault file paths — **MD format, not JSON** |
| PIOS-41.2-VALIDATION-REPORT | pie_render_validation_report.md | MD | 17/17 domains PASS, 42/42 capabilities PASS, 89/89 components PASS; 7 WEAKLY GROUNDED flags |
| PIOS-41.2-PIE-DEMO | pie_demo_walkthrough.md | MD | Guided navigation demo — consumed vault MD files only |
| (supporting) | pie_vault/00_Map/Program_Intelligence_Explorer.md | MD | Root navigator |
| (vault — domains) | pie_vault/01_Domains/D_01_*.md … D_17_*.md | MD ×17 | One MD file per domain (domain_id, description, capabilities table, components table, execution paths, traceability reference, navigation) |
| (vault — capabilities) | pie_vault/02_Capabilities/C_01_*.md … C_42_*.md | MD ×42 | One MD file per capability |
| (vault — components) | pie_vault/03_Components/CMP_01_*.md … CMP_89_*.md | MD ×89 | One MD file per component (component_id, tier, capability, domain, description, relationships, traceability) |
| (vault — supporting) | pie_vault/04_Traceability/, pie_vault/05_Insights/, pie_vault/99_Config/ | MD | Supporting vault sections |

**Total vault files:** 148 node files + supporting  
**Format:** ALL MD — no JSON artifacts in 41.2  
**Status:** FULLY MATERIALIZED — 148/148 nodes rendered and validated

---

## 41.3 — Semantic Consolidation

**Directory:** `docs/pios/41.3/`

| artifact_id | file | type | description |
|-------------|------|------|-------------|
| PIOS-41.3 | semantic_consolidation_report.md | MD | Normalization pass: T3 added 42 capability→domain nav links, T4 added 89 component→capability links, T6 standardized 148 navigation entries |

**Format:** MD only  
**Status:** MATERIALIZED — normalization complete; no new data artifacts produced

---

## 41.4 — Signal Registry Layer

**Directory:** `docs/pios/41.4/`

| artifact_id | file | type | description |
|-------------|------|------|-------------|
| PIOS-41.4-RUN01-SIGNAL-REGISTRY | signal_registry.json | JSON | 5 signals — each with domain_id, capability_id, component_ids[], source_refs[], evidence_confidence, business_impact, risk; structure: `{registry_id, contract_id, total_signals: 5, signals: [...]}` |
| PIOS-41.4-EVIDENCE-INDEX | evidence_mapping_index.json | JSON | Signal-to-source artifact evidence mapping |
| (supporting) | executive_signal_report.md | MD | Plain-language signal summary |

**Format:** 2 JSON + 1 MD  
**Status:** MATERIALIZED — signal layer is the first machine-readable JSON layer in the 41.x chain

---

## 41.5 — Query Layer

**Directory:** `docs/pios/41.5/`

| artifact_id | file | type | description |
|-------------|------|------|-------------|
| PIOS-41.5-QUERY-SIGNAL-MAP | query_signal_map.json | JSON | 10 queries mapped to 5 signals; structure: `{total_queries: 10, signal_pool_size: 5, queries: [...], signal_coverage: {}}` |
| (supporting) | golden_query_catalog.md | MD | Human-readable query catalog |
| (supporting) | interactive_query_examples.md | MD | Query examples |
| (supporting) | query_response_templates.md | MD | Response rendering templates (read at runtime by 42.1 adapter) |

**Format:** 1 JSON + 3 MD  
**Status:** MATERIALIZED — query map is machine-readable; templates read by 42.1 adapter at runtime

---

## Summary

| layer | directory | json_artifacts | md_artifacts | total_nodes_declared |
|-------|-----------|----------------|--------------|----------------------|
| 41.1 | docs/pios/41.1/ | 0 | 7 | 17D + 42C + 89Comp = 148 (MD) |
| 41.2 | docs/pios/41.2/ | 0 | 148 + 5 = 153 | 148 vault files |
| 41.3 | docs/pios/41.3/ | 0 | 1 | — |
| 41.4 | docs/pios/41.4/ | 2 | 1 | 5 signals |
| 41.5 | docs/pios/41.5/ | 1 | 3 | 10 queries |

**Total JSON artifacts:** 3 (signal_registry.json, evidence_mapping_index.json, query_signal_map.json)  
**Total MD artifacts:** ~165  
**JSON topology representation of 148 nodes:** ABSENT — does not exist in 41.x chain  
