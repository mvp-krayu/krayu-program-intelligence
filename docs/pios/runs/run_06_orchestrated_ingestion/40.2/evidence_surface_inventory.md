# Evidence Surface Inventory
run_id: run_06_orchestrated_ingestion
stream: Stream 40.2 — PiOS Evidence Connectors Layer
contract: PIOS-40.2-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Boundary Reference

evidence_boundary: docs/pios/runs/run_06_orchestrated_ingestion/evidence_boundary.md
evidence_origin_root: ~/Projects/blueedge-program-intelligence/source-v3.23/

---

## Evidence Domain 1 — HTML Documentation

Path: source-v3.23/ (root level)
Evidence class: documentation / interface artifact
Intake status: ACCEPTED

| File | Description |
|------|-------------|
| BlueEdge_Unified_Architecture_v3_23_0.html | System architecture documentation export |
| BlueEdge_Competitive_Dashboard_Feb2026.html | Competitive intelligence dashboard export |
| Blue_Edge_PMO_Dashboard.html | Program management office dashboard export |

File count: 3

---

## Evidence Domain 2 — Extraction Analysis

Path: source-v3.23/analysis/
Evidence class: extraction metadata
Intake status: ACCEPTED AS EXTRACTION-SUPPORT EVIDENCE ONLY
Restriction: Accepted only as extraction-support evidence per evidence_boundary.md. Not treated as analytical conclusions. Content may inform extraction context but does not constitute primary evidence.

| File | Description |
|------|-------------|
| 00_extraction_log.md | Log of extraction operations performed on raw archives |
| 01_repository_classification.md | Classification of extracted repository components |
| 02_top_level_component_inventory.md | Top-level component inventory from extraction |
| 03_overlap_validation.md | Validation of overlap between extracted components |

File count: 4

---

## Evidence Domain 3 — Extracted Backend Source

Path: source-v3.23/extracted/backend/backend/
Evidence class: code / configuration / structural artifact
Intake status: ACCEPTED
Priority: canonical isolated-component code evidence

### Infrastructure Artifacts

| File | Type |
|------|------|
| Dockerfile | configuration / structural |
| .dockerignore | configuration |
| .env.example | configuration |
| package.json | structural artifact |
| migrations/init.sql | code (SQL DDL) |
| migrations/seeds/seed-driver-sessions.sql | code (SQL seed) |
| migrations/seeds/seed.sql | code (SQL seed) |

### Source Root

| File | Type |
|------|------|
| src/main.ts | code (application entry) |
| src/app.module.ts | code (root module) |

### Source Subsystems

| Subsystem | Path | File type |
|-----------|------|-----------|
| common/cache | src/common/cache/ | code (TypeScript) |
| common/dto | src/common/dto/ | code (TypeScript) |
| common/guards | src/common/guards/ | code (TypeScript) |
| common/logging | src/common/logging/ | code (TypeScript) |
| common/throttle | src/common/throttle/ | code (TypeScript) |
| common/versioning | src/common/versioning/ | code (TypeScript) |
| common root | src/common/ | code (TypeScript) |
| config | src/config/ | configuration (TypeScript) |
| database | src/database/ | code (TypeScript) |
| events | src/events/ | code (TypeScript) |
| gateways | src/gateways/ | code (TypeScript) |
| health | src/health/ | code (TypeScript) |
| migrations (TypeORM) | src/migrations/ | code (TypeScript) |

### Domain Modules (63 total)

| Module | Domain category |
|--------|----------------|
| aftersales | asset lifecycle |
| agentic-ai | intelligence |
| alerts | operations |
| analytics | intelligence |
| anomaly-detection | intelligence |
| api-marketplace | platform |
| auth | platform |
| billing | platform |
| blockchain | intelligence |
| bus | fleet |
| charging-stations | energy |
| coldchain | energy |
| compliance | safety |
| cross-border | safety |
| customer-portal | people |
| data-monetization | intelligence |
| depot-charging | energy |
| devices | assets |
| diagnostics | assets |
| digital-twin | intelligence |
| driver-incentives | people |
| driver-mobile | people |
| driver-scoring | intelligence |
| driver-sessions | fleet |
| drivers | fleet |
| electrification | energy |
| erp-connectors | platform |
| errors | platform |
| ev | energy |
| executive | intelligence |
| fatigue-risk | safety |
| finance | people |
| fleet-lifecycle | assets |
| fleets | fleet |
| fuel | assets |
| geofence-automation | intelligence |
| hasi | platform |
| insurance | safety |
| integration-hub | platform |
| integration-notifications | platform |
| maintenance | assets |
| messaging | platform |
| multi-tenant | platform |
| notifications | platform |
| onboarding | platform |
| operations | fleet |
| ota | assets |
| parts-marketplace | assets |
| permits | safety |
| predictive-maintenance | assets |
| reports | intelligence |
| road-intelligence | intelligence |
| safety | safety |
| sensors | platform |
| surge-pricing | fleet |
| tanker | fleet |
| taxi | fleet |
| trips | fleet |
| users | platform |
| v2g | energy |
| vehicle-lifecycle | assets |
| vehicles | fleet |
| white-label | platform |

Technology: NestJS / TypeScript
Each module follows pattern: controller, module, service, spec, entities/

Total file count: 397

---

## Evidence Domain 4 — Extracted Frontend Source

Path: source-v3.23/extracted/frontend/frontend/
Evidence class: code / configuration / structural artifact / interface artifact
Intake status: ACCEPTED
Priority: canonical isolated-component code evidence

### Infrastructure Artifacts

| File | Type |
|------|------|
| Dockerfile | configuration / structural |
| .dockerignore | configuration |
| .env.example | configuration |
| package.json | structural artifact |
| nginx.conf | configuration |
| tsconfig.json | configuration |
| vite.config.ts | configuration |
| vitest.config.ts | configuration |
| cypress.config.ts | configuration |
| postcss.config.js | configuration |
| tailwind.config.ts | configuration |
| .eslintrc.cjs | configuration |
| index.html | interface artifact |
| main.tsx | code (application entry) |
| App.tsx | code (root component) |

### Source Subsystems

| Subsystem | Path | Approx files | File type |
|-----------|------|-------------|-----------|
| API clients | api/ | ~70 | code (TypeScript) |
| components/charts | components/charts/ | 7 | code (TSX) |
| components/data | components/data/ | 6 | code (TSX) |
| components/layout | components/layout/ | 10 | code (TSX) |
| components/map | components/map/ | 2 | code (TSX) |
| components/realtime | components/realtime/ | 4 | code (TSX) |
| components/ui | components/ui/ | ~35 | code (TSX) |
| constants | constants/ | 4 | code (TypeScript) |
| contexts | contexts/ | 7 | code (TSX) |
| hooks | hooks/ | 7 | code (TypeScript) |
| pages/assets | pages/assets/ | 7 | code (TSX) |
| pages/energy | pages/energy/ | 7 | code (TSX) |
| pages/fleet | pages/fleet/ | 11 | code (TSX) |
| pages/intelligence | pages/intelligence/ | 12 | code (TSX) |
| pages/people | pages/people/ | 10 | code (TSX) |
| pages/platform | pages/platform/ | 4 | code (TSX) |
| pages/safety | pages/safety/ | 7 | code (TSX) |
| src/pages | src/pages/ | 2 | code (TSX) |
| public | public/ | ~12 (icons + assets) | interface artifact |
| pwa | pwa/ | 1 | code (TypeScript) |
| router | router/ | 1 | code (TSX) |
| socket | socket/ | 2 | code (TypeScript/TSX) |
| stories | stories/ | ~25 | structural artifact (Storybook) |
| styles | styles/ | 6 | interface artifact (CSS) |
| test | test/ | ~20 | code (TypeScript/TSX) |
| cypress/e2e | cypress/e2e/ | 8 | code (TypeScript) |
| types | types/ | 2 | code (TypeScript) |
| utils | utils/ | 2 | code (TypeScript) |

Technology: React / TypeScript / Vite / Tailwind CSS
PWA: yes (manifest.json, sw.js, pwa/register.ts)
Testing: Vitest (unit) + Cypress (e2e) + Storybook (component)

Total file count: 324

---

## Evidence Domain 5 — Extracted Platform Source

Path: source-v3.23/extracted/platform/blueedge-platform/
Evidence class: code / configuration / structural artifact / documentation
Intake status: ACCEPTED
Priority: canonical integrated-system evidence (includes platform-unique artifacts)

### Platform Root Artifacts

| File | Type |
|------|------|
| README.md | documentation |
| .env.example | configuration |
| .github/workflows/ci.yml | configuration (CI/CD YAML) |
| .github/workflows/deploy.yml | configuration (CI/CD YAML) |

### Platform Backend (embedded)

Path: backend/
Structure: same 63-module NestJS structure as extracted/backend/
See Domain 3 for module map.
Overlap status: see normalized_evidence_map.md — OVERLAP-NOTED

### Platform Frontend (embedded)

Path: frontend/
Structure: same page/component structure as extracted/frontend/ with additional public/screenshots/
See Domain 4 for subsystem map.
Overlap status: see normalized_evidence_map.md — OVERLAP-NOTED

### Platform-Unique Artifacts

#### svg-agents (7 files)

| File | Type |
|------|------|
| svg-agents/config/blueedge.yaml | configuration (YAML) |
| svg-agents/config/sensors.yaml | configuration (YAML) |
| svg-agents/hasi-bridge/hasi_bridge.py | code (Python) |
| svg-agents/sensor-collector/sensor_collector.py | code (Python) |
| svg-agents/install.sh | code (shell script) |
| svg-agents/systemd/blueedge-hasi-bridge.service | configuration (systemd unit) |
| svg-agents/systemd/blueedge-sensor-collector.service | configuration (systemd unit) |

#### monitoring (4 files)

| File | Type |
|------|------|
| monitoring/grafana/dashboards/fleet-operations.json | configuration (Grafana dashboard) |
| monitoring/grafana/provisioning/dashboards/default.yml | configuration (YAML) |
| monitoring/grafana/provisioning/datasources/prometheus.yml | configuration (YAML) |
| monitoring/prometheus/prometheus.yml | configuration (YAML) |

#### load-tests (3 files)

| File | Type |
|------|------|
| load-tests/api-load.js | code (k6 JavaScript) |
| load-tests/ws-load.js | code (k6 JavaScript) |
| load-tests/run.sh | code (shell script) |

Total file count: 741 (includes embedded backend and frontend mirrors)
Platform-unique file count (excluding backend/frontend mirrors): approximately 18

---

## Evidence Domain 6 — Raw Provenance Archives

Path: source-v3.23/raw/
Evidence class: provenance reference only
Intake status: EXISTENCE CONFIRMED — NOT INGESTED
Basis: Raw tar archives are provenance-only per evidence_boundary.md. They were not ingested as direct evidence.

| File | Size | Existence |
|------|------|-----------|
| blueedge-backend-v3_23_0-COMPLETE.tar | 1.8 MB | CONFIRMED |
| blueedge-frontend-v3_23_0-COMPLETE.tar | 2.4 MB | CONFIRMED |
| blueedge-platform-v3_23_0-COMPLETE.tar | 4.3 MB | CONFIRMED |

---

## Evidence Surface Summary

| Domain | Evidence Class | File Count | Intake Status |
|--------|---------------|------------|---------------|
| HTML Documentation | documentation / interface artifact | 3 | ACCEPTED |
| Extraction Analysis | extraction metadata | 4 | ACCEPTED — support only |
| Extracted Backend | code / configuration / structural | 397 | ACCEPTED |
| Extracted Frontend | code / configuration / structural / interface | 324 | ACCEPTED |
| Extracted Platform | code / configuration / structural / documentation | 741 | ACCEPTED |
| Raw Archives | provenance only | 3 | EXISTENCE CONFIRMED — NOT INGESTED |
| **Total ingested** | | **1,469** | |
| **Total provenance-only** | | **3** | |

---

## Overlap Observation

overlap_status: NOTED — NOT RESOLVED AT INVENTORY LEVEL
overlap_positions:
- extracted/backend/backend/ ↔ extracted/platform/blueedge-platform/backend/: same 63-module NestJS structure observed
- extracted/frontend/frontend/ ↔ extracted/platform/blueedge-platform/frontend/: same page/component structure observed

overlap_resolution_position: normalized_evidence_map.md
unknown_space_preserved: TRUE

Note: Whether the embedded platform components contain file-level differences relative to the standalone extracted components is UNKNOWN. No file-level diff was performed. This unknown-space is preserved and not inferred.

---

## Prohibited Path Compliance

Paths confirmed NOT accessed:
- docs/reverse_engineering/ — EXCLUDED
- docs/program-charter/ — EXCLUDED
- docs/execution-telemetry/ — EXCLUDED
- docs/signal-layer/ — EXCLUDED
- docs/case-study/ — EXCLUDED
- weekly/ — EXCLUDED

prohibited_access: NONE

---

## Status

inventory_complete: TRUE
evidence_boundary_compliance: CONFIRMED
