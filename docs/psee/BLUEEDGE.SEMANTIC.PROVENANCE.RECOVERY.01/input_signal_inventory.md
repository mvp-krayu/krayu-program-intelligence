# Input Signal Inventory
# BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01 — Deliverable 3

## Identity

- Contract: BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Overview

This artifact inventories every distinct input signal that fed into grouping decisions across the 4-stage semantic construction process. Signals are categorized by type and their role in each grouping decision is identified.

---

## Signal Catalogue

### SIGNAL-01 — app.module.ts Session Comments

| field | value |
|-------|-------|
| signal_id | SIGNAL-01 |
| signal_type | SOURCE_CODE_CATEGORICAL_LABEL |
| source | `app.module.ts` (NestJS root module) — external to repo; was in source-v3.23/ workspace |
| signal_form | Developer-authored session comment strings embedded in source file alongside module imports |
| examples_recovered | "Core domains (7 modules, 66 endpoints)"; "Session 23: Multi-Tenant SaaS"; "Session 24: Integration Layer" |
| where_used | (1) Stage 3: primary basis for capability grouping decisions (functional purpose identification); (2) Stage 4: primary categorical basis for domain assignment (session comment → domain name) |
| evidence_in_repo | semantic_elevation_report.md per-domain coherence table: 6 of 17 domains have explicit session comment citations; semantic_elevation_report.md line 138 |
| confidence | HIGH |
| availability | NOT IN REPO — source file was external (CEU-08, source-v3.23/) |

---

### SIGNAL-02 — app.module.ts Module Import Line Numbers

| field | value |
|-------|-------|
| signal_id | SIGNAL-02 |
| signal_type | SOURCE_CODE_STRUCTURAL_POSITION |
| source | `app.module.ts` (NestJS root module) |
| signal_form | Line number of each `@Module()` import declaration in the NestJS root module |
| examples_recovered | "app.module.ts line 20" (AuthModule = COMP-02); "app.module.ts line 23" (VehiclesModule = COMP-03) |
| where_used | Stage 3: PRIMARY evidence anchor per COMP-NN; defines COMP-NN as the exact NestJS module at that import position |
| evidence_in_repo | semantic_traceability_map.md: `original_evidence_ref: app.module.ts line NN` for every COMP-NN that is a NestJS module |
| confidence | HIGH |
| availability | NOT IN REPO — line refs are documented but source file absent |

---

### SIGNAL-03 — Module Directory Structure Confirmation

| field | value |
|-------|-------|
| signal_id | SIGNAL-03 |
| signal_type | SOURCE_CODE_DIRECTORY_EVIDENCE |
| source | `modules/{name}/` directories in the source snapshot |
| signal_form | Directory existence confirming module implementation boundaries |
| examples_recovered | "modules/auth/ confirmed" (COMP-02 AuthModule); "modules/vehicles/ confirmed" (COMP-03 VehiclesModule); "modules/alerts/ confirmed" (COMP-07) |
| where_used | Stage 3: secondary evidence to confirm BM-NNN → COMP-NN assignment; strengthens DIRECT_EVIDENCE classification |
| evidence_in_repo | semantic_traceability_map.md: `original_evidence_ref: app.module.ts line NN; modules/{name}/ confirmed` per selected COMPs |
| confidence | HIGH |
| availability | NOT IN REPO — directory structure was in source-v3.23/ workspace |

---

### SIGNAL-04 — BlueEdge Unified Architecture Document (HTML)

| field | value |
|-------|-------|
| signal_id | SIGNAL-04 |
| signal_type | ARCHITECTURE_DOCUMENTATION |
| source | BlueEdge_Unified_Architecture_v3_23_0.html |
| signal_form | HTML architecture documentation including layer diagram, component descriptions, version history |
| where_used | Stage 1: PRIMARY basis for 7-layer architecture taxonomy; capability_domain_taxonomy.md CAP-01..26 derived from architecture |
| evidence_in_repo | blueedge_evidence_matrix.md: "architecture_source_reconciliation_v3_23.md — multiple architecture artifacts converge on 7-layer model — Confidence: HIGH" |
| confidence | HIGH |
| availability | NOT IN k-pi-core — was in BlueEdge workspace input bundle |

---

### SIGNAL-05 — PMO Dashboard (HTML)

| field | value |
|-------|-------|
| signal_id | SIGNAL-05 |
| signal_type | OPERATIONAL_DASHBOARD |
| source | Blue_Edge_PMO_Dashboard.html |
| signal_form | Operational dashboard showing feature counts, team structure, delivery units |
| where_used | Stage 1: secondary basis for capability domain identification; delivery unit inferences; feature count data (227 common platform features, 92 tanker features, 110 bus, 130 taxi) |
| evidence_in_repo | reverse_engineering_mapping_table_prepopulated.md: "Blue_Edge_PMO_Dashboard.html" cited as evidence source for multiple capability domain entries |
| confidence | MEDIUM (dashboard evidence treated as lower-confidence than architecture) |
| availability | NOT IN k-pi-core — was in BlueEdge workspace input bundle |

---

### SIGNAL-06 — Competitive Dashboard (HTML)

| field | value |
|-------|-------|
| signal_id | SIGNAL-06 |
| signal_type | COMPETITIVE_INTELLIGENCE |
| source | BlueEdge_Competitive_Dashboard_Feb2026.html |
| signal_form | Competitive feature and capability dashboard |
| where_used | Stage 1: tertiary signal for capability identification (AI/ML capabilities, security features, blockchain) |
| evidence_in_repo | reverse_engineering_mapping_table_prepopulated.md: "BlueEdge_Competitive_Dashboard_Feb2026.html" cited for edge AI, HASI, blockchain entries |
| confidence | MEDIUM |
| availability | NOT IN k-pi-core — was in BlueEdge workspace input bundle |

---

### SIGNAL-07 — Source Snapshot Filesystem Structure (v3.23)

| field | value |
|-------|-------|
| signal_id | SIGNAL-07 |
| signal_type | SOURCE_FILESYSTEM_EVIDENCE |
| source | `source-v3.23/extracted/platform/blueedge-platform` |
| signal_form | Directory tree of extracted platform source code |
| where_used | Stage 1: PRIMARY basis for component_inventory_v3_23.md (7 top-level boundaries); Stage 2: basis for entity enumeration; Stage 3: inferred basis for COMP-NN line anchoring |
| evidence_in_repo | component_inventory_v3_23.md: "This artifact is based on the source snapshot boundary, not on verified Git repository metadata" |
| confidence | HIGH (for what existed in snapshot) |
| availability | NOT IN k-pi-core — was at source-v3.23/; referenced as CEU-08 in structural evidence |

---

### SIGNAL-08 — Stage 1 Capability Domain Taxonomy (v2)

| field | value |
|-------|-------|
| signal_id | SIGNAL-08 |
| signal_type | DERIVED_TAXONOMY |
| source | capability_domain_taxonomy_v2.md (in BlueEdge snapshot) |
| signal_form | 18-CAP taxonomy aligned to confirmed 7-layer architecture |
| where_used | Stage 1 → 2 transition: provided architectural layer context for entity classification; informed which entities belong to which architecture layer |
| evidence_in_repo | system_capability_map_v2.md and capability_domain_map.md both reference capability_domain_taxonomy_v2.md as input |
| confidence | HIGH |
| availability | FOUND in snapshot — docs/reverse_engineering/capability_domain_taxonomy_v2.md |

---

### SIGNAL-09 — Stage 1 Capability Domain Map

| field | value |
|-------|-------|
| signal_id | SIGNAL-09 |
| signal_type | RECONCILED_DOMAIN_MAP |
| source | capability_domain_map.md (in BlueEdge snapshot) |
| signal_form | 16-domain map reconciling backend modules, frontend features, component inventory, and taxonomy v2 |
| where_used | Stage 1 → Stage 4 transition: provided the semantic domain vocabulary that was later refined into 17 DOMAIN-NN; key domain names carry through (Fleet Operations, Safety, Asset Management, etc.) |
| evidence_in_repo | 41.1 domain names are semantically aligned with capability_domain_map.md entries; no direct citation in 41.1 headers |
| confidence | MEDIUM (conceptual lineage clear; no direct citation) |
| availability | FOUND in snapshot — docs/reverse_engineering/capability_domain_map.md |

---

### SIGNAL-10 — Stage 2 Entity Catalog (run_02_blueedge, 40.3)

| field | value |
|-------|-------|
| signal_id | SIGNAL-10 |
| signal_type | STRUCTURAL_ENTITY_CATALOG |
| source | docs/pios/40.3/entity_catalog.md |
| signal_form | BM-001..064 entity records (NestJS modules), CE-*, SA-*, INF-* entities |
| where_used | Stage 3: direct input to COMP-NN re-enumeration (BM-NNN → COMP-NN translation) |
| evidence_in_repo | FOUND — docs/pios/40.3/entity_catalog.md; cited in semantic_traceability_map.md generated_from header |
| confidence | HIGH |
| availability | FOUND in k-pi-core |

---

### SIGNAL-11 — Stage 2 Program Execution Graph (40.3, N-NN notation)

| field | value |
|-------|-------|
| signal_id | SIGNAL-11 |
| signal_type | STRUCTURAL_EXECUTION_GRAPH |
| source | docs/pios/40.3/program_execution_graph.md |
| signal_form | EP-01..N execution paths using N-NN node identifiers (40.x entity scheme) |
| where_used | Stage 3: basis for execution_paths.md (the COMP-NN notation equivalent); EP-NN identifiers preserved |
| evidence_in_repo | FOUND — docs/pios/40.3/program_execution_graph.md; semantic_input_inventory.md documents linkage |
| confidence | HIGH |
| availability | FOUND in k-pi-core |

---

### SIGNAL-12 — Stage 2 Structural Traceability Map (40.3)

| field | value |
|-------|-------|
| signal_id | SIGNAL-12 |
| signal_type | STRUCTURAL_EVIDENCE_RECORD |
| source | docs/pios/40.3/structural_traceability_map.md |
| signal_form | Per-entity structural claims with CEU-ID evidence (FULLY_EVIDENCED / PARTIALLY_EVIDENCED / WEAKLY_GROUNDED) |
| where_used | Stage 4: basis for WEAKLY_GROUNDED classification in semantic_traceability_map.md; entities with weak structural evidence carry weak status into 41.1 |
| evidence_in_repo | FOUND — docs/pios/40.3/structural_traceability_map.md; cited in semantic_traceability_map.md generated_from header |
| confidence | HIGH |
| availability | FOUND in k-pi-core |

---

### SIGNAL-13 — Intent Inference Map (IIM-02..IIM-09+)

| field | value |
|-------|-------|
| signal_id | SIGNAL-13 |
| signal_type | INTENT_DECLARATION |
| source | intent_inference_map.md (run_03 derivation bundle) |
| signal_form | Named IIM-NN entries each formalizing a platform design intent inferred from source evidence |
| where_used | Stage 3 → 4: validation signal for capability naming and domain grouping; IIM-NN cited per domain in semantic_elevation_report.md to confirm semantic intent |
| evidence_in_repo | NOT FOUND — content survives as inline citations only; 8+ IIM entries recoverable from 41.1 artifact inline citations |
| confidence | HIGH for entries that are cited; UNKNOWN for entries not cited |
| availability | NOT IN REPO — intent_inference_map.md absent from both snapshot and k-pi-core |

---

## Signal Role Summary

| signal_id | signal_name | primary_grouping_role | stage_used | availability |
|-----------|------------|----------------------|------------|--------------|
| SIGNAL-01 | Session comments | Domain categorical labels | Stage 3 + Stage 4 | NOT IN REPO |
| SIGNAL-02 | Module import line numbers | Component identity anchor | Stage 3 | NOT IN REPO |
| SIGNAL-03 | Module directory confirmation | Component evidence strengthening | Stage 3 | NOT IN REPO |
| SIGNAL-04 | Architecture document (HTML) | 7-layer taxonomy basis | Stage 1 | NOT IN REPO |
| SIGNAL-05 | PMO Dashboard | Domain feature evidence | Stage 1 | NOT IN REPO |
| SIGNAL-06 | Competitive Dashboard | Capability identification | Stage 1 | NOT IN REPO |
| SIGNAL-07 | Source filesystem v3.23 | Component enumeration basis | Stage 1–3 | NOT IN REPO |
| SIGNAL-08 | Capability taxonomy v2 | Architectural context | Stage 1–2 | FOUND in snapshot |
| SIGNAL-09 | Capability domain map | Domain vocabulary precursor | Stage 1 → Stage 4 | FOUND in snapshot |
| SIGNAL-10 | Entity catalog (40.3) | COMP-NN enumeration input | Stage 3 | FOUND in k-pi-core |
| SIGNAL-11 | PEG (40.3) | Execution path translation input | Stage 3 | FOUND in k-pi-core |
| SIGNAL-12 | Structural traceability map (40.3) | WEAKLY_GROUNDED classification | Stage 4 | FOUND in k-pi-core |
| SIGNAL-13 | Intent inference map | Domain validation | Stage 3–4 | NOT IN REPO |

---

## Signal Availability Summary

| status | count | signals |
|--------|-------|---------|
| FOUND in snapshot | 2 | SIGNAL-08, SIGNAL-09 |
| FOUND in k-pi-core | 3 | SIGNAL-10, SIGNAL-11, SIGNAL-12 |
| NOT IN REPO (either) | 8 | SIGNAL-01, SIGNAL-02, SIGNAL-03, SIGNAL-04, SIGNAL-05, SIGNAL-06, SIGNAL-07, SIGNAL-13 |
| **TOTAL** | **13** | |

---

## Critical Signal Observation

**SIGNAL-01 (Session Comments) and SIGNAL-13 (Intent Inference Map) together constitute the primary domain grouping signals.**

SIGNAL-01 provided the categorical vocabulary (session comment labels in source code). SIGNAL-13 validated that categorical vocabulary against inferred platform intent. Without either, the domain naming and grouping rationale is partially recoverable from inline citations but the source artifacts are permanently absent.

The session comment signal (SIGNAL-01) is particularly significant because it explains a non-obvious property of the semantic model: the 17 domains of 41.1 are not arbitrary — they directly reflect developer-authored categorical labels embedded in the production source code at the time of reverse engineering. This is the primary mechanism by which developer intent entered the semantic construction process.
