# Semantic Construction Sequence
# BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01 — Deliverable 1

## Identity

- Contract: BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES
- Source: /Volumes/KH_CAPSULE/SNAPSHOT_2026_03_14/Projects/blueedge-program-intelligence/docs/reverse_engineering/

---

## Overview

The 41.1 semantic model (17 domains, 42 capabilities, 89 components) emerged across four distinct stages. The BlueEdge reverse engineering workspace (`SNAPSHOT_2026_03_14`) contains the Stage 1 and Stage 2 artifacts. Stage 3 artifacts are absent from both the snapshot and the repository. Stage 4 is the 41.1 output layer in k-pi-core.

---

## Stage 1 — Architecture-Level Analysis (Pre-Run, BlueEdge Workspace)

**Artifacts produced (in snapshot):**

| artifact | path | role |
|----------|------|------|
| reverse_engineering_steps.md | docs/reverse_engineering/ | 4-stage reverse engineering procedure definition |
| reverse_engineering_outputs.md | docs/reverse_engineering/ | Mandatory output set definition |
| reverse_engineering_mapping_table.md | docs/reverse_engineering/ | Template only (no data populated) |
| reverse_engineering_mapping_table_prepopulated.md | docs/reverse_engineering/ | Pre-populated from architecture + dashboard artifacts; 33 entries; repository names all hypothesis |
| reverse_engineering_mapping_table_v2.md | docs/reverse_engineering/ | Simplified 13-entry layer-aligned table (L1–L7) |
| component_inventory_v3_23.md | docs/reverse_engineering/ | Top-level component inventory (backend, frontend, svg-agents, monitoring, load-tests, .github, docker-compose) |
| capability_domain_taxonomy.md | docs/reverse_engineering/ | Original 26-CAP taxonomy (CAP-01..CAP-26), architecture-layer-based |
| capability_domain_taxonomy_v2.md | docs/reverse_engineering/ | Reconciled 18-CAP taxonomy (CAP-01..CAP-18) aligned to confirmed 7-layer architecture (L1–L7) |
| capability_domain_map.md | docs/reverse_engineering/ | Reconciliation of backend modules + frontend features + component inventory + taxonomy v2; 16 capability domains with layer alignment |
| system_component_map.md | docs/reverse_engineering/ | Architectural layer → component mapping (Frontend Application Layer, Backend Service Layer, Platform Component Layer) |
| system_capability_map_v2.md | docs/reverse_engineering/ | 18 capability domains mapped to layers and system components |
| blueedge_evidence_matrix.md | docs/reverse_engineering/ | Traceability backbone; artifact → architectural implication mapping |
| generate_blueedge_assessment_v2.py | docs/reverse_engineering/ | PDF generator (reportlab) producing preliminary assessment — not a semantic construction script |

**Evidence sources for this stage:**

- BlueEdge_Unified_Architecture_v3_23_0.html (architecture artifact)
- Blue_Edge_PMO_Dashboard.html (operational dashboard)
- BlueEdge_Competitive_Dashboard_Feb2026.html (competitive dashboard)
- Source snapshot: `source-v3.23/extracted/platform/blueedge-platform`

**Grouping method at this stage:**

ARCHITECTURE-LAYER-BASED. Capability domains were assigned to 7 architectural layers (L1 Physical/Sensor through L7 Intelligence). The 26-CAP taxonomy and 18-CAP v2 taxonomy both organize by architectural role, not by NestJS module grouping. Example: CAP-02 = "Edge Device Runtime" (L2), CAP-07 = "Backend Services" (L4), CAP-15 = "AI/ML Platform" (L7).

**What was NOT yet done at this stage:**

- No per-module enumeration (no BM-NNN or COMP-NN scheme)
- No capability grouping at functional capability level (42-CAP granularity)
- No intent inference map
- No semantic domains at 17-domain granularity

---

## Stage 2 — Source-Level Structural Analysis (run_02_blueedge)

**Artifacts produced (found in k-pi-core `docs/pios/40.3/`):**

| artifact | path | entity_scheme |
|----------|------|---------------|
| entity_catalog.md | docs/pios/40.3/ | BM-001..BM-064 (NestJS modules), CE-001..003, SA-001/002, INF-001..004 |
| structural_traceability_map.md | docs/pios/40.3/ | Per-entity structural claims with CEU-ID evidence |
| program_execution_graph.md | docs/pios/40.3/ | EP-NN paths using 40.x entity IDs (N-NN → CE-*, BM-*, SA-*, INF-*) |
| dependency_map.md | docs/pios/40.3/ | Component dependency relationships in 40.x entity notation |

**Method at this stage:**

Direct enumeration of the NestJS root module (`app.module.ts`) into BM-NNN entities. Each BM-NNN corresponds to one `@Module()` import in `app.module.ts`. Entity catalog records: CE-001 (monorepo root), CE-002 (NestJS app), CE-003 (frontend app), BM-001..BM-064 (backend modules), SA-001 (sensor_collector.py), SA-002 (hasi_bridge.py), INF-001..INF-004 (PostgreSQL, Redis, TimescaleDB, MQTT).

**Relationship to Stage 1:**

The 40.3 entity catalog translates the Stage 1 architectural-layer taxonomy into per-module entities. The 7-layer architecture knowledge from Stage 1 informed how modules were classified, but the entity scheme shifted from CAP-based architectural domains to BM-NNN numbered entities.

---

## Stage 3 — Derivation Bundle Creation (run_03_blueedge_derivation_validation — ABSENT)

**Expected artifacts (declared in 41.1 `generated_from` headers but NOT FOUND in either snapshot or repository):**

| artifact | declared_content | status |
|----------|-----------------|--------|
| component_model.md | 89 COMP-NN, each with app.module.ts line ref | NOT FOUND in snapshot or k-pi-core |
| relationship_map.md | 41 R-NNN relationships (R-001..R-041) | NOT FOUND |
| execution_paths.md | 8 EP-NN paths in COMP-NN notation | NOT FOUND |
| intent_inference_map.md | IIM-02..IIM-09+ intent declarations | NOT FOUND |

**Inferred method at this stage:**

Based on surviving evidence in 41.1 artifacts:

1. **BM-NNN → COMP-NN re-enumeration**: Entity catalog was re-enumerated with a new COMP-NN scheme. Each COMP-NN received an `app.module.ts line NN` anchor (e.g., VehiclesModule → COMP-03 → app.module.ts line 23). This produced component_model.md.

2. **Intent inference map creation**: app.module.ts session comments (developer-authored categorical labels embedded in the source file) were analyzed to produce intent declarations. Examples: "Session 23: Multi-Tenant SaaS" → IIM-06, "Session 24: Integration Layer" → IIM-07. These IIM entries formalized the intent behind each session comment grouping.

3. **Relationship mapping**: Component-to-component relationships were mapped producing R-NNN triples. R-013 composite covered 63 module→auth edges (every NestJS module has JWT global guard dependency).

4. **Execution path translation**: Stage 2 PEG paths (EP-NN in N-NN notation) were translated into EP-NN in COMP-NN notation for execution_paths.md.

**No contract or execution log found for this stage.** The `run_reference` header "run_03_blueedge_derivation_validation" in all 41.1 outputs is the sole reference.

**Critical stage gap:** This is the stage where the grouping decisions from architecture-level (Stage 1, 7-layer taxonomy) were converted to implementation-level (42-CAP granularity). The mechanism for this conversion is undocumented.

---

## Stage 4 — Semantic Layer Construction (41.1, 2026-03-20)

**Artifacts produced (found in k-pi-core `docs/pios/41.1/`):**

| artifact | content |
|----------|---------|
| semantic_domain_model.md | 17 DOMAIN-NN with component_anchors, capability_anchors, relationship_anchors, execution_path_anchors |
| capability_map.md | 42 CAP-NN with component_members, parent_domain, execution_contribution |
| semantic_traceability_map.md | 89 COMP-NN with assigned_capability, original_evidence_ref (app.module.ts line NN), traceability_basis |
| semantic_elevation_report.md | Per-domain coherence table, IIM citations, session comment evidence, input counts |
| pie_render_manifest.md | 148-node rendering manifest; link table (48 links) |

**Grouping method at this stage:**

1. COMP→CAP: Each COMP-NN assigned to a single CAP-NN by functional purpose. Grouping basis: source code placement (app.module.ts import group), module directory structure, session comments as categorical signals. Rules: min 1 component per capability, capability names derived strictly from evidence.

2. CAP→DOMAIN: Each CAP-NN assigned to a single DOMAIN-NN by semantic purpose. Grouping basis: app.module.ts session comment labels → domain names; IIM-NN entries → validation of domain intent. Rules: min 2 components per domain, no overlap without cross-domain annotation, domain types from closed set (FUNCTIONAL/OPERATIONAL/INFRASTRUCTURE/INTEGRATION/CROSS-CUTTING).

**Ratio summary:** 89 components → 42 capabilities (2.12:1) → 17 domains (5.24:1 comp:domain)

---

## Taxonomy Evolution Summary

| stage | grouping_unit | count | scheme | basis |
|-------|--------------|-------|--------|-------|
| Stage 1 (BlueEdge workspace, initial) | Capability domains | 26 | CAP-01..26 | 7-layer architecture (L1–L7) |
| Stage 1 (BlueEdge workspace, v2) | Capability domains | 18 | CAP-01..18 | Confirmed 7-layer architecture reconciled |
| Stage 1 (capability_domain_map.md) | Capability domains | 16 | Named | Reconciled from backend modules + frontend + components |
| Stage 2 (run_02, 40.x) | Entities | 89 | BM/CE/SA/INF | Direct app.module.ts enumeration |
| Stage 4 (41.1) | Components | 89 | COMP-NN | Re-enumeration with app.module.ts line anchors |
| Stage 4 (41.1) | Capabilities | 42 | CAP-NN | Functional purpose grouping of components |
| Stage 4 (41.1) | Domains | 17 | DOMAIN-NN | Semantic grouping of capabilities |

**Key observation:** The 17 domains of 41.1 are NOT the same as the 7 architectural layers of the BlueEdge taxonomy or the 16/18 capability domain entries of the Stage 1 map. The 41.1 semantic domains represent a finer-grained, evidence-grounded semantic grouping that is orthogonal to the layer-based taxonomy. The Stage 1 work provided architectural understanding; the Stage 4 domains were independently constructed from source code signals.

---

## Sequence Classification

| stage | classification | artifacts_surviving |
|-------|---------------|-------------------|
| Stage 1 (BlueEdge workspace) | FULLY PRESERVED in snapshot | ~55 files; all primary Stage 1 artifacts present |
| Stage 2 (run_02_blueedge) | PRESERVED in k-pi-core | 40.3 artifacts in docs/pios/40.3/ |
| Stage 3 (run_03 derivation bundle) | ABSENT | Neither snapshot nor repository |
| Stage 4 (41.1 semantic layer) | PRESERVED in k-pi-core | docs/pios/41.1/ + build_semantic_layer.py |
