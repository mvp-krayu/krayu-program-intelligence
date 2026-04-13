# Grouping Decision Inventory
# BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01 — Deliverable 2

## Identity

- Contract: BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Overview

This inventory documents the specific grouping decisions recovered across the BlueEdge workspace artifacts and the 41.1 semantic layer, tracing each decision to its evidence basis and origin stage.

---

## Decision Set A — Architecture Layer Taxonomy (Stage 1)

**Decision A-1: 7-Layer Architecture**

| field | value |
|-------|-------|
| decision | Adopt a 7-layer architecture model (L1 Physical/Sensor through L7 Intelligence) as the canonical layer framework |
| evidence | architecture_source_reconciliation_v3_23.md (multiple architecture artifacts converge on 7-layer model per blueedge_evidence_matrix.md) |
| artifact | capability_domain_taxonomy_v2.md — "Normalize capability domains according to the confirmed 7-layer architecture" |
| stage | Stage 1 (BlueEdge workspace) |
| reversals | None — 7-layer model persisted throughout |
| method | ARCHITECTURE_RECONCILIATION (multiple evidence sources converge) |

**Decision A-2: 26-CAP → 18-CAP Reduction**

| field | value |
|-------|-------|
| decision | Reduce initial 26-capability taxonomy to 18 capabilities aligned with confirmed 7 layers |
| evidence | capability_domain_taxonomy_v2.md: "Reconciled with architecture artifact and source snapshot"; capability_domain_taxonomy.md (original 26 CAPs) |
| artifact | capability_domain_taxonomy_v2.md |
| stage | Stage 1 (BlueEdge workspace) |
| method | RULE_BASED (layer-alignment constraint) |
| note | The 26 → 18 → 16 → eventually 42 trajectory represents successive refinements, each adding source code evidence |

**Decision A-3: Component Inventory → 7 Top-Level Boundaries**

| field | value |
|-------|-------|
| decision | Identify 7 top-level component boundaries from source snapshot: backend, frontend, svg-agents, monitoring, load-tests, .github workflows, docker-compose |
| evidence | component_inventory_v3_23.md: "based on the source snapshot boundary, not on verified Git repository metadata" |
| artifact | component_inventory_v3_23.md |
| stage | Stage 1 (BlueEdge workspace) |
| method | DIRECT_OBSERVATION (source filesystem enumeration) |

**Decision A-4: svg-agents as First-Class Boundary**

| field | value |
|-------|-------|
| decision | Treat svg-agents as "a first-class reverse engineering boundary, not as a minor support folder" |
| evidence | component_inventory_v3_23.md: "edge device runtime, sensor-side collection, SVG gateway operational agents" |
| stage | Stage 1 (BlueEdge workspace) |
| method | HEURISTIC (interpretive decision about boundary significance) |
| downstream_impact | Directly feeds COMP-73 (sensor_collector.py) and COMP-74 (hasi_bridge.py) in 41.1 |

**Decision A-5: Capability Domain Map (16 Domains from Backend+Frontend Reconciliation)**

| field | value |
|-------|-------|
| decision | Group capability domains by reconciling backend module domains, frontend feature domains, frontend capability surface, and component inventory |
| domains_identified | Fleet Operations, Fleet Vertical Domains, Safety & Compliance, Asset Management, Energy & Electrification, Driver Operations, Intelligence & Analytics, Emerging Intelligence Domains, Platform Integration, Customer & Commercial Services, Platform Administration, Edge Device Runtime, Monitoring & Observability, Load Validation, Delivery Automation, Runtime Orchestration (16 total) |
| evidence | capability_domain_map.md: "This artifact does not infer missing domains beyond what is evidenced by the input artifacts" |
| artifact | capability_domain_map.md |
| stage | Stage 1 (BlueEdge workspace) |
| method | HYBRID (DECLARATIVE + RULE_BASED): domains named from evidence; rule — must be backed by both backend module AND frontend page evidence OR component inventory evidence |
| note | This grouping uses OPERATIONAL domain names (e.g., "Fleet Operations", "Safety & Compliance"), not layer names. This is the conceptual precursor to the 41.1 17-domain model. |

---

## Decision Set B — Program Execution Graph (Stage 1, Step 4)

**Decision B-1: 5-Domain Program Execution Structure**

| field | value |
|-------|-------|
| decision | Reconstruct the BlueEdge platform as 5 execution domains: Experience & Feature Exposure, Capability Services, Core Platform Services, Integration & Ecosystem Surface, Platform Operations & Runtime Enablement |
| evidence | blueedge_program_execution_graph.md; reconstructed_program_structure.md — "derived through four analytical moves: Capability Clustering, Domain Boundary Detection, Dependency Extraction, Program Topology Reconstruction" |
| artifact | program_execution_graph.md, blueedge_program_execution_graph.md, reconstructed_program_structure.md |
| stage | Stage 1, Step 4 (Program Reconstruction) |
| method | ANALYTICAL (4 analytical moves applied to repository + architecture signals) |
| note | This is a PROGRAM governance structure, not the same as the 17 semantic domains of 41.1. These 5 domains represent coordination areas at the program level. |

**Decision B-2: Dependency Edge Definition**

| field | value |
|-------|-------|
| decision | Define 4 dependency edges: Experience→Capability, Capability→Core Platform, Capability→Integration, All→Runtime |
| evidence | program_execution_graph.md Dependency View |
| stage | Stage 1 |
| method | ARCHITECTURAL_INFERENCE from capability relationships |

---

## Decision Set C — Entity-Level Grouping (Stage 2, run_02_blueedge)

**Decision C-1: BM-NNN Entity Scheme**

| field | value |
|-------|-------|
| decision | Assign BM-001 through BM-064 identifiers to NestJS modules enumerated from app.module.ts |
| evidence | docs/pios/40.3/entity_catalog.md: BM-001..BM-064 for NestJS modules; entity_catalog uses run_02_blueedge |
| artifact | docs/pios/40.3/entity_catalog.md |
| stage | Stage 2 (run_02_blueedge) |
| method | DECLARATIVE (sequential enumeration from app.module.ts import order) |

**Decision C-2: Four Entity Type Scheme (CE/BM/SA/INF)**

| field | value |
|-------|-------|
| decision | Classify entities into 4 types: CE (core entities), BM (backend modules), SA (software agents), INF (infrastructure) |
| evidence | entity_catalog.md: CE-001..003, BM-001..064, SA-001/002, INF-001..004 |
| stage | Stage 2 (run_02_blueedge) |
| method | RULE_BASED (classification rules by component type) |

---

## Decision Set D — Component-to-Capability Grouping (Stage 3, run_03 — INFERRED from surviving evidence)

**Decision D-1: BM-NNN → COMP-NN Re-enumeration**

| field | value |
|-------|-------|
| decision | Re-enumerate BM-NNN entities as COMP-NN, anchoring each to an `app.module.ts` line number |
| evidence | semantic_traceability_map.md: "original_evidence_ref: app.module.ts line NN" per COMP-NN; e.g., COMP-03 (VehiclesModule) = app.module.ts line 23 |
| stage | Stage 3 (run_03 — inferred) |
| method | DECLARATIVE (sequential re-enumeration with direct source evidence anchor) |
| artifact_status | component_model.md NOT FOUND; evidence survives in semantic_traceability_map.md |

**Decision D-2: Functional Purpose Grouping → 42 Capabilities**

| field | value |
|-------|-------|
| decision | Group 89 COMP-NN into 42 CAP-NN by shared functional purpose |
| grouping_basis | (1) Source code module placement (app.module.ts import position); (2) app.module.ts session comment group membership; (3) module directory structure (modules/{name}/ confirmed) |
| evidence | capability_map.md component_members per CAP; semantic_traceability_map.md traceability_basis per COMP; semantic_elevation_report.md line 138: "capability names derived from evidence in component_model.md session comments, intent_inference_map.md, or explicit source code patterns" |
| rules_applied | (1) min 1 component per capability; (2) capability names derived strictly from evidence; (3) each capability belongs to exactly one domain or annotated cross-domain |
| exception | SC-01: COMP-25 (OtaModule) cross-domain conflict — annotated cross-domain rather than assigned to single capability |
| stage | Stage 3 (run_03 — inferred) |
| method | HYBRID (DECLARATIVE + RULE_BASED; HEURISTIC for SC-01) |
| artifact_status | component_model.md NOT FOUND; assignments recovered in build_semantic_layer.py COMPONENTS dict + capability_map.md |

**Decision D-3: Intent Inference Map Construction**

| field | value |
|-------|-------|
| decision | Create IIM-02..IIM-09+ entries formalizing intent behind platform design decisions |
| iim_entries_recovered | IIM-02: edge data collection intent (high-volume, low-latency); IIM-03a: non-optional JWT enforcement; IIM-03b: 11 components form minimum viable platform; IIM-04: AI/ML as core commercial differentiators; IIM-05: deliberate decoupling (event-driven); IIM-06: SaaS commercial packaging; IIM-07: enterprise integration; IIM-09: engineering maturity/observability |
| evidence_source | app.module.ts session comments (primary); architecture documentation (secondary) |
| artifact_status | intent_inference_map.md NOT FOUND; IIM content survives as inline citations in 41.1 |
| stage | Stage 3 (run_03 — inferred) |
| method | HEURISTIC (developer-authored session comments interpreted as intent declarations) |

---

## Decision Set E — Capability-to-Domain Grouping (Stage 4, 41.1)

**Decision E-1: 17 Semantic Domains**

| field | value |
|-------|-------|
| decision | Group 42 CAP-NN into 17 DOMAIN-NN by semantic purpose |
| grouping_basis | (1) app.module.ts session comment labels as categorical signals; (2) IIM-NN validation of domain intent; (3) Platform operational semantics |
| domain_construction_rules | (1) min 2 components per domain; (2) no domain overlap without cross-domain annotation; (3) domain names from component_model.md session comments and IIM; (4) domain types: FUNCTIONAL/OPERATIONAL/INFRASTRUCTURE/INTEGRATION/CROSS-CUTTING; (5) WEAKLY_GROUNDED where structural evidence is weak |
| session_comment_evidence | "DOMAIN-03: app.module.ts 'Core domains (7 modules, 66 endpoints)'"; "DOMAIN-12: Session 23: Multi-Tenant SaaS"; "DOMAIN-13: Session 24: Integration Layer"; "DOMAIN-16: R-036/R-037 confirm observability coupling" |
| iim_validation | DOMAIN-01 → IIM-02; DOMAIN-06 → IIM-04; DOMAIN-09 → IIM-03a; DOMAIN-12 → IIM-06; DOMAIN-13 → IIM-07; DOMAIN-16 → IIM-09 |
| stage | Stage 4 (41.1) |
| method | HYBRID (DECLARATIVE + RULE_BASED + HEURISTIC) |
| artifact_status | semantic_domain_model.md FOUND; assignments recovered in build_semantic_layer.py CAPABILITIES dict |

**Decision E-2: 17 vs. 16 Capability Domains**

| field | value |
|-------|-------|
| decision | Arrive at 17 semantic domains (not the 16 of Stage 1 capability_domain_map.md) |
| documentation | PARTIALLY DOCUMENTED — domain count emerged from evidence application of construction rules; no explicit decision log for count |
| note | Stage 1 had 16 domains in capability_domain_map.md; Stage 4 has 17 DOMAIN-NN; the additional domain likely resulted from finer evidence-based splitting during Stage 3/4 |
| stage | Stage 4 (41.1) |

---

## Summary Table

| decision_id | level | stage | method | artifact_status |
|-------------|-------|-------|--------|----------------|
| A-1 | Architecture layers | Stage 1 | ARCHITECTURE_RECONCILIATION | FOUND in snapshot |
| A-2 | CAP reduction 26→18 | Stage 1 | RULE_BASED | FOUND in snapshot |
| A-3 | 7 component boundaries | Stage 1 | DIRECT_OBSERVATION | FOUND in snapshot |
| A-4 | svg-agents classification | Stage 1 | HEURISTIC | FOUND in snapshot |
| A-5 | 16 capability domains | Stage 1 | HYBRID | FOUND in snapshot |
| B-1 | 5-domain PEG | Stage 1 Step 4 | ANALYTICAL | FOUND in snapshot |
| B-2 | Dependency edges | Stage 1 Step 4 | ARCHITECTURAL_INFERENCE | FOUND in snapshot |
| C-1 | BM-NNN enumeration | Stage 2 | DECLARATIVE | FOUND in k-pi-core 40.3 |
| C-2 | CE/BM/SA/INF scheme | Stage 2 | RULE_BASED | FOUND in k-pi-core 40.3 |
| D-1 | COMP-NN re-enumeration | Stage 3 | DECLARATIVE | INFERRED — source absent |
| D-2 | 89 COMP → 42 CAP | Stage 3 | HYBRID | INFERRED — source absent |
| D-3 | IIM construction | Stage 3 | HEURISTIC | INFERRED — source absent |
| E-1 | 42 CAP → 17 DOMAIN | Stage 4 | HYBRID | FOUND in k-pi-core 41.1 |
| E-2 | 17 vs 16 domain count | Stage 4 | PARTIALLY_DOCUMENTED | FOUND in k-pi-core 41.1 |
