# Evidence Classification Map
run_id: run_04_adapter_simulation
stream: Stream 40.2 — PiOS Evidence Connectors Layer
contract: PIOS-40.2-RUN02-IG2-ADAPTER
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.2 adapter simulation run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; GitHub adapter ENABLED (mvp-krayu/krayu-program-intelligence); Jira adapter CAPSULE

---

## Classification Basis

Accepted evidence classes (per evidence_boundary.md):
- documentation
- code
- configuration
- structural artifacts
- interface artifacts
- extraction metadata

Classification applies to all ingested evidence domains. Provenance-only paths are classified but not ingested.

---

## Classification Table

### HTML Documentation

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| BlueEdge_Unified_Architecture_v3_23_0.html | HTML docs | documentation | system architecture documentation | PRIMARY |
| BlueEdge_Competitive_Dashboard_Feb2026.html | HTML docs | documentation | competitive intelligence documentation | PRIMARY |
| Blue_Edge_PMO_Dashboard.html | HTML docs | documentation / interface artifact | program management dashboard | PRIMARY |

---

### Extraction Analysis

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| analysis/00_extraction_log.md | analysis | extraction metadata | extraction operation log | SUPPORT ONLY |
| analysis/01_repository_classification.md | analysis | extraction metadata | extraction classification | SUPPORT ONLY |
| analysis/02_top_level_component_inventory.md | analysis | extraction metadata | extraction inventory | SUPPORT ONLY |
| analysis/03_overlap_validation.md | analysis | extraction metadata | extraction overlap notes | SUPPORT ONLY |

Note: These are accepted only as extraction-support evidence. They are not analytical conclusions and do not carry primary evidence authority.

---

### Extracted Backend — Infrastructure

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| backend/Dockerfile | backend infra | configuration / structural artifact | container build definition | PRIMARY |
| backend/.dockerignore | backend infra | configuration | container exclusion list | PRIMARY |
| backend/.env.example | backend infra | configuration | environment variable template | PRIMARY |
| backend/package.json | backend infra | structural artifact | dependency manifest | PRIMARY |
| backend/migrations/init.sql | backend infra | code | SQL DDL schema | PRIMARY |
| backend/migrations/seeds/seed.sql | backend infra | code | SQL seed data | PRIMARY |
| backend/migrations/seeds/seed-driver-sessions.sql | backend infra | code | SQL seed data | PRIMARY |

---

### Extracted Backend — Source Code

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| src/main.ts | backend src | code | application entry point | PRIMARY |
| src/app.module.ts | backend src | code | root NestJS module | PRIMARY |
| src/common/** | backend src | code | shared utilities, guards, interceptors, middleware | PRIMARY |
| src/config/** | backend src | configuration | runtime configuration (TypeScript) | PRIMARY |
| src/database/seed.ts | backend src | code | database seed runner | PRIMARY |
| src/events/** | backend src | code | event emitter, handlers | PRIMARY |
| src/gateways/** | backend src | code | WebSocket gateways | PRIMARY |
| src/health/** | backend src | code | health check controllers, Prometheus service | PRIMARY |
| src/migrations/*.ts | backend src | code | TypeORM migration files | PRIMARY |
| src/modules/{name}/{name}.controller.ts | backend modules | code | REST API controller | PRIMARY |
| src/modules/{name}/{name}.module.ts | backend modules | code | NestJS module definition | PRIMARY |
| src/modules/{name}/{name}.service.ts | backend modules | code | business logic service | PRIMARY |
| src/modules/{name}/{name}.spec.ts | backend modules | code | unit test | PRIMARY |
| src/modules/{name}/entities/*.entity.ts | backend modules | code | TypeORM entity | PRIMARY |

---

### Extracted Frontend — Infrastructure

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| frontend/Dockerfile | frontend infra | configuration / structural artifact | container build definition | PRIMARY |
| frontend/.dockerignore | frontend infra | configuration | container exclusion list | PRIMARY |
| frontend/.env.example | frontend infra | configuration | environment variable template | PRIMARY |
| frontend/package.json | frontend infra | structural artifact | dependency manifest | PRIMARY |
| frontend/nginx.conf | frontend infra | configuration | web server configuration | PRIMARY |
| frontend/tsconfig.json | frontend infra | configuration | TypeScript compiler config | PRIMARY |
| frontend/vite.config.ts | frontend infra | configuration | Vite bundler configuration | PRIMARY |
| frontend/vitest.config.ts | frontend infra | configuration | Vitest test runner config | PRIMARY |
| frontend/cypress.config.ts | frontend infra | configuration | Cypress e2e config | PRIMARY |
| frontend/postcss.config.js | frontend infra | configuration | PostCSS config | PRIMARY |
| frontend/tailwind.config.ts | frontend infra | configuration | Tailwind CSS config | PRIMARY |
| frontend/.eslintrc.cjs | frontend infra | configuration | ESLint config | PRIMARY |
| frontend/index.html | frontend infra | interface artifact | HTML shell | PRIMARY |
| frontend/main.tsx | frontend infra | code | application entry point | PRIMARY |
| frontend/App.tsx | frontend infra | code | root React component | PRIMARY |

---

### Extracted Frontend — Source Code

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| api/*.ts | frontend src | code | REST API client functions (TypeScript) | PRIMARY |
| components/charts/*.tsx | frontend src | code | chart UI components (React/TSX) | PRIMARY |
| components/data/*.tsx | frontend src | code | data display components (React/TSX) | PRIMARY |
| components/layout/*.tsx | frontend src | code | layout components (React/TSX) | PRIMARY |
| components/map/*.tsx | frontend src | code | map components (React/TSX) | PRIMARY |
| components/realtime/*.tsx | frontend src | code | real-time data components (React/TSX) | PRIMARY |
| components/ui/*.tsx | frontend src | code | general UI primitives (React/TSX) | PRIMARY |
| constants/*.ts | frontend src | code | application constants | PRIMARY |
| contexts/*.tsx | frontend src | code | React context providers | PRIMARY |
| hooks/*.ts | frontend src | code | React custom hooks | PRIMARY |
| pages/**/*.tsx | frontend src | code | page-level React components | PRIMARY |
| pwa/register.ts | frontend src | code | PWA service worker registration | PRIMARY |
| router/LazyRoutes.tsx | frontend src | code | lazy-loaded route definitions | PRIMARY |
| socket/*.ts | frontend src | code | WebSocket client | PRIMARY |
| utils/*.ts | frontend src | code | utility functions | PRIMARY |
| types/*.ts | frontend src | code | TypeScript type definitions | PRIMARY |
| test/**/*.ts | frontend src | code | unit and integration tests | PRIMARY |
| cypress/e2e/*.cy.ts | frontend src | code | end-to-end tests | PRIMARY |
| stories/*.stories.tsx | frontend src | structural artifact | Storybook component stories | PRIMARY |
| styles/*.css | frontend src | interface artifact | CSS stylesheets (theme, mobile, RTL) | PRIMARY |
| public/ | frontend src | interface artifact | static assets (icons, manifest, sw.js) | PRIMARY |

---

### Platform-Unique Artifacts

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| README.md | platform root | documentation | system overview documentation | PRIMARY |
| .env.example | platform root | configuration | integrated system env template | PRIMARY |
| .github/workflows/ci.yml | platform infra | configuration | CI/CD pipeline definition | PRIMARY |
| .github/workflows/deploy.yml | platform infra | configuration | deployment pipeline definition | PRIMARY |
| svg-agents/config/blueedge.yaml | platform agents | configuration | SVG agent system config | PRIMARY |
| svg-agents/config/sensors.yaml | platform agents | configuration | sensor configuration | PRIMARY |
| svg-agents/hasi-bridge/hasi_bridge.py | platform agents | code | HASI protocol bridge (Python) | PRIMARY |
| svg-agents/sensor-collector/sensor_collector.py | platform agents | code | sensor data collector (Python) | PRIMARY |
| svg-agents/install.sh | platform agents | code | agent installation script | PRIMARY |
| svg-agents/systemd/blueedge-hasi-bridge.service | platform agents | configuration | systemd service unit | PRIMARY |
| svg-agents/systemd/blueedge-sensor-collector.service | platform agents | configuration | systemd service unit | PRIMARY |
| monitoring/grafana/dashboards/fleet-operations.json | platform monitoring | configuration | Grafana dashboard definition | PRIMARY |
| monitoring/grafana/provisioning/dashboards/default.yml | platform monitoring | configuration | Grafana dashboard provisioning | PRIMARY |
| monitoring/grafana/provisioning/datasources/prometheus.yml | platform monitoring | configuration | Grafana datasource config | PRIMARY |
| monitoring/prometheus/prometheus.yml | platform monitoring | configuration | Prometheus scrape configuration | PRIMARY |
| load-tests/api-load.js | platform load | code | k6 API load test | PRIMARY |
| load-tests/ws-load.js | platform load | code | k6 WebSocket load test | PRIMARY |
| load-tests/run.sh | platform load | code | load test runner script | PRIMARY |

---

### Platform Embedded Components (Overlap Zone)

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| platform/backend/ | platform embedded | code / configuration / structural | integrated backend component — see Domain 3 | OVERLAP-NOTED |
| platform/frontend/ | platform embedded | code / configuration / structural / interface | integrated frontend component — see Domain 4 | OVERLAP-NOTED |

Overlap classification: NOTED — NOT RESOLVED
Canonical preference: Domain 3 (extracted/backend) for isolated module-level evidence; Domain 5 (extracted/platform) for integrated system context
Unknown-space: file-level parity between standalone and embedded components is UNKNOWN

---

### Raw Provenance Archives

| Evidence Unit | Domain | Class | Subclass | Priority |
|---------------|--------|-------|----------|----------|
| raw/blueedge-backend-v3_23_0-COMPLETE.tar | raw | provenance only | tar archive | NOT INGESTED |
| raw/blueedge-frontend-v3_23_0-COMPLETE.tar | raw | provenance only | tar archive | NOT INGESTED |
| raw/blueedge-platform-v3_23_0-COMPLETE.tar | raw | provenance only | tar archive | NOT INGESTED |

---

## Classification Summary

| Evidence Class | Count (domains/units) | Notes |
|---------------|----------------------|-------|
| documentation | 3 HTML + README.md = 4 units | |
| code | Backend src, Frontend src, Platform agents, Platform load-tests, SQL migrations | ~1,200+ files |
| configuration | Backend infra, Frontend infra, Platform infra, svg-agents config, monitoring config | ~50+ files |
| structural artifacts | package.json files, Dockerfiles, Storybook | ~10 files |
| interface artifacts | CSS stylesheets, public/ assets, index.html | ~20 files |
| extraction metadata | analysis/ (4 files) | support-only |
| provenance only | raw/ (3 archives) | not ingested |

---

## Status

classification_complete: TRUE
evidence_boundary_compliance: CONFIRMED
prohibited_paths_classified: NONE
