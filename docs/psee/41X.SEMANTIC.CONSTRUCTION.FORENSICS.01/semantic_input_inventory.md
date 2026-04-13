# Semantic Input Inventory
# 41X.SEMANTIC.CONSTRUCTION.FORENSICS.01 — Deliverable 1

## Identity

- Contract: 41X.SEMANTIC.CONSTRUCTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Declared Input Artifacts (from 41.1 `generated_from` headers)

The following artifacts are explicitly declared in `generated_from` fields across 41.1 outputs:

| artifact | declared_in | repository_status |
|----------|------------|-------------------|
| component_model.md | semantic_domain_model.md, capability_map.md, semantic_traceability_map.md, semantic_elevation_report.md | NOT FOUND |
| relationship_map.md | semantic_domain_model.md, capability_map.md, semantic_elevation_report.md, pie_render_manifest.md | NOT FOUND |
| execution_paths.md | semantic_domain_model.md, capability_map.md, semantic_elevation_report.md | NOT FOUND |
| intent_inference_map.md | semantic_domain_model.md | NOT FOUND |
| program_execution_graph.md | semantic_domain_model.md | FOUND — docs/pios/40.3/program_execution_graph.md |
| structural_traceability_map.md | semantic_traceability_map.md | FOUND — docs/pios/40.3/structural_traceability_map.md |

Search method: `find` on full repository for each artifact name. Only two were found.

---

## Declared Input Artifacts — Detail

### component_model.md — NOT FOUND

**Referenced in:**
- `docs/pios/41.1/semantic_domain_model.md` line 7
- `docs/pios/41.1/capability_map.md` line 7
- `docs/pios/41.1/semantic_traceability_map.md` line 7
- `docs/pios/41.1/semantic_elevation_report.md` lines 7, 14

**Evidence of content from secondary references:**
- "These counts are taken directly from the derivation bundle artifacts (component_model.md, ...): Components = 89" — `semantic_elevation_report.md` line 14
- "Every component in component_model appears in semantic_traceability_map — PASS — 89/89" — `semantic_elevation_report.md` line 180
- `semantic_traceability_map.md` provides `original_evidence_ref: app.module.ts line NN` for each component — these are the component_model.md entries resolved to source code

**Inferred structure:** 89 component entries, each with name and line reference to `app.module.ts` or other source files. Component identification derived from NestJS module imports in `app.module.ts`.

**Repository status:** NOT PRESENT. The `semantic_traceability_map.md` is the best surviving proxy — it documents all 89 components with their source evidence.

---

### relationship_map.md — NOT FOUND

**Referenced in:**
- `docs/pios/41.1/semantic_domain_model.md` (relationship_anchors R-NNN)
- `docs/pios/41.1/capability_map.md` (primary_relationships R-NNN)
- `docs/pios/41.1/pie_render_manifest.md` line 202

**Evidence of content from secondary references:**
- "Relationships: 41 records (composite R-013 covers 63 module→auth edges)" — `semantic_elevation_report.md` line 19
- R-001 through R-041 are cited across `semantic_domain_model.md` and `capability_map.md` in relationship_anchors sections
- `pie_render_manifest.md` line 202: "All links are derived from relationship_map.md entries, elevated to the semantic level"
- R-013 is explicitly noted: "composite R-013 covers 63 module→auth edges" — the relationship of 63 modules to AuthModule via JWT guard
- `semantic_feedback_directives.md` directly references `relationship_map.md` for future enrichment

**Inferred structure:** 41 relationship records, R-001 through R-041, each with subject/predicate/object triples. R-013 is composite (covers 63 auth guard edges).

**Repository status:** NOT PRESENT. Relationship data survives only as inline entries in `semantic_domain_model.md` and `capability_map.md`.

---

### execution_paths.md — NOT FOUND

**Referenced in:**
- `docs/pios/41.1/semantic_domain_model.md` (execution_path_anchors EP-NN)
- `docs/pios/41.1/capability_map.md` (execution_contribution EP-NN)

**Evidence of content:**
- "Execution paths: 8" — `semantic_elevation_report.md` line 20
- EP-01 through EP-08 referenced throughout 41.1 artifacts
- `semantic_feedback_directives.md` references EP-01b as undocumented — implying EP-01 through EP-08 are defined
- `docs/pios/40.3/program_execution_graph.md` contains EP-01 through EP-N but uses 40.x entity IDs (N-01, BM-NNN) not 41.1 component IDs

**Inferred structure:** 8 execution paths (EP-01 to EP-08), each tracing a request or event through the system using 41.1 component notation.

**Repository status:** NOT PRESENT as standalone file. The EP-NN references in 41.1 artifacts survive. The `docs/pios/40.3/program_execution_graph.md` is a related but structurally different artifact (different entity ID scheme).

---

### intent_inference_map.md — NOT FOUND

**Referenced in:**
- `docs/pios/41.1/semantic_domain_model.md` (direct: `generated_from`, and IIM-02 in DOMAIN-01 description)

**Evidence of IIM entries from secondary references (semantic_elevation_report.md and capability_map.md):**
- IIM-02: edge data collection intent — high-volume, low-latency, resilient collection
- IIM-03a: non-optional JWT enforcement (global auth guard)
- IIM-03b: 11 components form minimum viable platform
- IIM-04: AI/ML modules confirmed as core commercial differentiators
- IIM-05: deliberate decoupling design (event-driven architecture)
- IIM-06: SaaS commercial packaging intent
- IIM-07: enterprise integration intent
- IIM-09: engineering maturity / observability intent

**Inferred structure:** Named inference entries (IIM-NN) each containing intent statement, supporting evidence, and relationship to platform design. At minimum IIM-02 through IIM-09 exist.

**Repository status:** NOT PRESENT. IIM entries survive only as inline citations in 41.1 descriptions.

---

## Found Input Artifacts

### program_execution_graph.md — FOUND

| attribute | value |
|-----------|-------|
| path | docs/pios/40.3/program_execution_graph.md |
| stream | Stream 40.3 — PiOS Reverse Engineering |
| run_id | run_02_blueedge |
| date | 2026-03-19 |
| structure | PEG Node Registry (N-01 to N-17), Execution Paths EP-01 to EP-N, using 40.x entity IDs (CE-*, BM-*, SA-*, INF-*) |
| entity_ids | N-01 (CE-002), N-02 (FE-001), N-05 (CE-001), N-16 (SA-001), N-17 (SA-002) etc. |

**Relevance:** The 40.3 PEG uses the same EP-01 through EP-N execution path notation as 41.1. EP-01 in 40.3 corresponds to EP-01 in 41.1 (Sensor Telemetry Ingest Path). The 41.1 `execution_paths.md` (not found) is the 41.x-notation equivalent of this artifact — same paths expressed using COMP-NN identifiers.

**Linkage to 41.1 entities:**
- N-17 (SA-002 = Sensor Collector) → COMP-73 (sensor_collector.py)
- N-16 (SA-001 = HASI Bridge) → COMP-74 (hasi_bridge.py)
- N-11 (INF-001 = PostgreSQL) → COMP-79 (PostgreSQL 15)
- N-14 (INF-004 = MQTT Broker) → COMP-83 (MQTT Broker EMQX)

---

### structural_traceability_map.md — FOUND

| attribute | value |
|-----------|-------|
| path | docs/pios/40.3/structural_traceability_map.md |
| stream | Stream 40.3 |
| run_id | run_02_blueedge |
| date | 2026-03-19 |
| structure | Per-entity structural claims with CEU-ID evidence notation |
| entities | CE-001, CE-002, SA-001, SA-002, INF-001 through INF-004 etc. |

**Relevance:** Documents structural evidence for each entity. Feeds the WEAKLY_GROUNDED classification in 41.1. The 41.1 `semantic_traceability_map.md` `generated_from` header cites this file.

---

## Related 40.x Artifacts (Not Declared but Structurally Relevant)

| artifact | path | relevance |
|----------|------|-----------|
| entity_catalog.md | docs/pios/40.3/entity_catalog.md | Entity inventory (CE-*, BM-*, SA-*, INF-*) — structural precursor to component_model.md |
| dependency_map.md | docs/pios/40.3/dependency_map.md | Dependency relationships — structural precursor to relationship_map.md |
| interface_map.md | docs/pios/40.3/interface_map.md | Interface definitions |

**Note on entity_catalog.md:** Uses different entity ID scheme (BM-001 through BM-064 for NestJS modules) vs. 41.1 COMP-NN. The `component_model.md` was likely a re-enumeration or translation of the 40.3 entity catalog using 41.1 COMP-NN identifiers, with `app.module.ts` line numbers as the direct evidence anchor.

---

## Direct Source Evidence Cited in 41.1

The `semantic_traceability_map.md` directly cites:

| evidence_type | path_cited | example_usage |
|---------------|-----------|---------------|
| NestJS root module | app.module.ts line NN | "original_evidence_ref: app.module.ts line 23" (VehiclesModule = COMP-03) |
| Analysis log | source-v3.23/analysis/00_extraction_log.md | COMP-01 (monorepo) |
| Module directory confirmation | modules/{name}/ directory confirmed | COMP-02 (AuthModule), COMP-07 (AlertsModule) |

The `source-v3.23/` path is an external analysis workspace — NOT present in the repository.

---

## Summary Table

| artifact | found | run_id | entity_scheme | 41.1_linkage |
|----------|-------|--------|---------------|--------------|
| component_model.md | NO | run_03_blueedge_derivation_validation (inferred) | COMP-NN | PRIMARY — all 89 components |
| relationship_map.md | NO | run_03 | R-NNN | PRIMARY — 41 relationships |
| execution_paths.md | NO | run_03 | EP-NN (COMP-NN notation) | SUPPORTING — 8 paths |
| intent_inference_map.md | NO | unknown | IIM-NN | SUPPORTING — domain naming |
| program_execution_graph.md (40.3) | YES | run_02_blueedge | N-NN (CE/BM/SA/INF) | RELATED — same EP-NN paths, different entity IDs |
| structural_traceability_map.md (40.3) | YES | run_02_blueedge | CE-*, BM-* etc. | RELATED — structural evidence basis |
| entity_catalog.md (40.3) | YES | run_02_blueedge | CE-*, BM-*, SA-*, INF-* | RELATED — entity precursor to COMP-NN |
