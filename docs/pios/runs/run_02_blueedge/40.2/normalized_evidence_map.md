# Normalized Evidence Map
run_id: run_02_blueedge
stream: Stream 40.2 — PiOS Evidence Connectors Layer
contract: PIOS-40.2-RUN02-IG1C-REGEN
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1C fresh baseline re-ingestion from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation

---

## Purpose

This map normalizes all ingested evidence into canonical evidence units. Each evidence unit carries:
- a canonical evidence identifier
- an authoritative source path
- an evidence class and priority
- an overlap or unknown-space declaration where applicable

---

## Normalization Principles

1. Each distinct evidence source is assigned a canonical ID.
2. Where overlap exists between standalone and platform-embedded components, the overlap is declared and canonical preference is assigned.
3. Unknown-space is preserved. No missing evidence is inferred or synthesized.
4. Provenance-only paths are included in the map with NOT INGESTED status.

---

## Canonical Evidence Units

### CEU-01 — Architecture Documentation

canonical_id: CEU-01
canonical_path: source-v3.23/BlueEdge_Unified_Architecture_v3_23_0.html
evidence_class: documentation
evidence_subclass: system architecture
intake_status: ACCEPTED
overlap: NONE
unknown_space: NONE declared

---

### CEU-02 — Competitive Dashboard Documentation

canonical_id: CEU-02
canonical_path: source-v3.23/BlueEdge_Competitive_Dashboard_Feb2026.html
evidence_class: documentation
evidence_subclass: competitive intelligence
intake_status: ACCEPTED
overlap: NONE
unknown_space: NONE declared

---

### CEU-03 — PMO Dashboard Documentation

canonical_id: CEU-03
canonical_path: source-v3.23/Blue_Edge_PMO_Dashboard.html
evidence_class: documentation / interface artifact
evidence_subclass: program management dashboard
intake_status: ACCEPTED
overlap: NONE
unknown_space: NONE declared

---

### CEU-04 — Extraction Log

canonical_id: CEU-04
canonical_path: source-v3.23/analysis/00_extraction_log.md
evidence_class: extraction metadata
intake_status: ACCEPTED — support evidence only
authority: extraction context only; not analytical conclusion
overlap: NONE
unknown_space: NONE declared

---

### CEU-05 — Repository Classification

canonical_id: CEU-05
canonical_path: source-v3.23/analysis/01_repository_classification.md
evidence_class: extraction metadata
intake_status: ACCEPTED — support evidence only
authority: extraction context only; not analytical conclusion
overlap: NONE
unknown_space: NONE declared

---

### CEU-06 — Component Inventory (Extraction)

canonical_id: CEU-06
canonical_path: source-v3.23/analysis/02_top_level_component_inventory.md
evidence_class: extraction metadata
intake_status: ACCEPTED — support evidence only
authority: extraction context only; not analytical conclusion
overlap: NONE
unknown_space: NONE declared

---

### CEU-07 — Overlap Validation (Extraction)

canonical_id: CEU-07
canonical_path: source-v3.23/analysis/03_overlap_validation.md
evidence_class: extraction metadata
intake_status: ACCEPTED — support evidence only
authority: extraction context only; not analytical conclusion
overlap: NONE
unknown_space: NONE declared

---

### CEU-08 — Backend Source Tree (Standalone)

canonical_id: CEU-08
canonical_path: source-v3.23/extracted/backend/backend/
evidence_class: code / configuration / structural artifact
scope: 397 files; 63 domain modules; NestJS/TypeScript
intake_status: ACCEPTED
canonical_preference: PRIMARY for isolated module-level code evidence
overlap_id: OVL-01 (with CEU-10 platform embedded backend)
unknown_space: file-level parity with platform backend is UNKNOWN

Sub-units by type:

| Sub-unit ID | Path pattern | Evidence class |
|-------------|-------------|----------------|
| CEU-08-INFRA | backend/{Dockerfile,.env.example,.dockerignore,package.json} | configuration / structural |
| CEU-08-SQL | backend/migrations/*.sql | code (SQL DDL + seed) |
| CEU-08-SRC-ROOT | backend/src/main.ts, src/app.module.ts | code |
| CEU-08-COMMON | backend/src/common/** | code |
| CEU-08-CONFIG | backend/src/config/** | configuration |
| CEU-08-EVENTS | backend/src/events/** | code |
| CEU-08-GATEWAYS | backend/src/gateways/** | code |
| CEU-08-HEALTH | backend/src/health/** | code |
| CEU-08-MIGRATIONS | backend/src/migrations/** | code |
| CEU-08-MODULES | backend/src/modules/** (63 modules) | code |

---

### CEU-09 — Frontend Source Tree (Standalone)

canonical_id: CEU-09
canonical_path: source-v3.23/extracted/frontend/frontend/
evidence_class: code / configuration / structural artifact / interface artifact
scope: 324 files; React/TypeScript/Vite/Tailwind CSS; PWA-enabled
intake_status: ACCEPTED
canonical_preference: PRIMARY for isolated module-level code evidence
overlap_id: OVL-02 (with CEU-11 platform embedded frontend)
unknown_space: file-level parity with platform frontend is UNKNOWN

Sub-units by type:

| Sub-unit ID | Path pattern | Evidence class |
|-------------|-------------|----------------|
| CEU-09-INFRA | frontend/{Dockerfile,nginx.conf,package.json,*.config.*,.env.example} | configuration / structural |
| CEU-09-ENTRY | frontend/{main.tsx,App.tsx,index.html} | code / interface artifact |
| CEU-09-API | frontend/api/** | code |
| CEU-09-COMPONENTS | frontend/components/** | code |
| CEU-09-PAGES | frontend/pages/** | code |
| CEU-09-CONTEXTS | frontend/contexts/** | code |
| CEU-09-HOOKS | frontend/hooks/** | code |
| CEU-09-UTILS | frontend/utils/**, types/**, constants/** | code |
| CEU-09-ROUTER | frontend/router/**, socket/** | code |
| CEU-09-PWA | frontend/pwa/**, public/manifest.json, public/sw.js | code / interface artifact |
| CEU-09-STYLES | frontend/styles/** | interface artifact |
| CEU-09-PUBLIC | frontend/public/icons/** | interface artifact |
| CEU-09-TEST | frontend/test/**, frontend/cypress/** | code |
| CEU-09-STORYBOOK | frontend/stories/**, frontend/.storybook/** | structural artifact |

---

### CEU-10 — Platform Integrated Monorepo

canonical_id: CEU-10
canonical_path: source-v3.23/extracted/platform/blueedge-platform/
evidence_class: code / configuration / structural artifact / documentation
scope: 741 files total
intake_status: ACCEPTED
canonical_preference: PRIMARY for integrated system context, platform-unique artifacts
overlap_note: Contains embedded backend (OVL-01) and embedded frontend (OVL-02)

Sub-units:

| Sub-unit ID | Path | Evidence class | Overlap |
|-------------|------|----------------|---------|
| CEU-10-ROOT | blueedge-platform/{README.md,.env.example} | documentation / configuration | NONE |
| CEU-10-CICD | .github/workflows/{ci.yml,deploy.yml} | configuration | NONE |
| CEU-10-BACKEND | blueedge-platform/backend/ | code / configuration | OVL-01 |
| CEU-10-FRONTEND | blueedge-platform/frontend/ | code / configuration / interface | OVL-02 |
| CEU-10-SVGAGENTS | blueedge-platform/svg-agents/ | code / configuration | NONE — platform-unique |
| CEU-10-MONITORING | blueedge-platform/monitoring/ | configuration | NONE — platform-unique |
| CEU-10-LOADTESTS | blueedge-platform/load-tests/ | code | NONE — platform-unique |

---

### CEU-11 — Raw Backend Archive (Provenance Only)

canonical_id: CEU-11
canonical_path: source-v3.23/raw/blueedge-backend-v3_23_0-COMPLETE.tar
evidence_class: provenance only
intake_status: NOT INGESTED
size: 1.8 MB
purpose: provenance reference; confirms extracted/backend/ source origin

---

### CEU-12 — Raw Frontend Archive (Provenance Only)

canonical_id: CEU-12
canonical_path: source-v3.23/raw/blueedge-frontend-v3_23_0-COMPLETE.tar
evidence_class: provenance only
intake_status: NOT INGESTED
size: 2.4 MB
purpose: provenance reference; confirms extracted/frontend/ source origin

---

### CEU-13 — Raw Platform Archive (Provenance Only)

canonical_id: CEU-13
canonical_path: source-v3.23/raw/blueedge-platform-v3_23_0-COMPLETE.tar
evidence_class: provenance only
intake_status: NOT INGESTED
size: 4.3 MB
purpose: provenance reference; confirms extracted/platform/ source origin

---

## Overlap Declarations

### OVL-01 — Backend Standalone vs Platform Embedded

overlap_id: OVL-01
unit_a: CEU-08 (extracted/backend/backend/)
unit_b: CEU-10-BACKEND (extracted/platform/blueedge-platform/backend/)
observed_similarity: same 63-module NestJS structure, same directory organization
file_level_parity: UNKNOWN — no diff performed
canonical_for_isolated_evidence: CEU-08 (standalone)
canonical_for_integrated_context: CEU-10-BACKEND (platform)
resolution_status: UNRESOLVED — preserved as unknown-space
pipeline_impact: downstream streams (40.4 onward) must select canonical unit per evidence type

---

### OVL-02 — Frontend Standalone vs Platform Embedded

overlap_id: OVL-02
unit_a: CEU-09 (extracted/frontend/frontend/)
unit_b: CEU-10-FRONTEND (extracted/platform/blueedge-platform/frontend/)
observed_similarity: same page/component/API structure; platform may include public/screenshots/ not present in standalone
file_level_parity: UNKNOWN — no diff performed
canonical_for_isolated_evidence: CEU-09 (standalone)
canonical_for_integrated_context: CEU-10-FRONTEND (platform)
resolution_status: UNRESOLVED — preserved as unknown-space
pipeline_impact: downstream streams (40.4 onward) must select canonical unit per evidence type

---

## Unknown-Space Declaration

The following positions are explicitly declared as unknown-space. No inference or synthesis has been applied.

| Unknown-Space ID | Description |
|-----------------|-------------|
| US-01 | File-level parity between CEU-08 and CEU-10-BACKEND is unknown |
| US-02 | File-level parity between CEU-09 and CEU-10-FRONTEND is unknown |
| US-03 | Whether platform backend/frontend contain content not present in standalone versions is unknown |

These unknown-space positions must be preserved. They may not be resolved by inference.

---

## Evidence Priority Hierarchy

For downstream pipeline consumption:

1. Extracted source trees (CEU-08, CEU-09, CEU-10) — HIGHEST priority; primary code/config evidence
2. HTML documentation (CEU-01, CEU-02, CEU-03) — PRIMARY; documentation/interface evidence
3. Extraction analysis (CEU-04 through CEU-07) — SUPPORT ONLY; not primary evidence
4. Raw archives (CEU-11, CEU-12, CEU-13) — PROVENANCE ONLY; not ingested

---

## CEU Summary Table

| CEU ID | Description | Class | Status |
|--------|-------------|-------|--------|
| CEU-01 | Architecture HTML | documentation | ACCEPTED |
| CEU-02 | Competitive Dashboard HTML | documentation | ACCEPTED |
| CEU-03 | PMO Dashboard HTML | documentation / interface | ACCEPTED |
| CEU-04 | Extraction log | extraction metadata | ACCEPTED — support |
| CEU-05 | Repository classification | extraction metadata | ACCEPTED — support |
| CEU-06 | Component inventory (extraction) | extraction metadata | ACCEPTED — support |
| CEU-07 | Overlap validation (extraction) | extraction metadata | ACCEPTED — support |
| CEU-08 | Backend source (standalone) | code / config / structural | ACCEPTED — primary |
| CEU-09 | Frontend source (standalone) | code / config / structural / interface | ACCEPTED — primary |
| CEU-10 | Platform monorepo | code / config / structural / documentation | ACCEPTED — primary |
| CEU-11 | Backend tar archive | provenance | NOT INGESTED |
| CEU-12 | Frontend tar archive | provenance | NOT INGESTED |
| CEU-13 | Platform tar archive | provenance | NOT INGESTED |

Total canonical units: 13
Accepted: 10
Not ingested: 3
Overlap declarations: 2 (OVL-01, OVL-02)
Unknown-space declarations: 3 (US-01, US-02, US-03)

---

## Status

normalization_complete: TRUE
unknown_space_preserved: TRUE
evidence_boundary_compliance: CONFIRMED
