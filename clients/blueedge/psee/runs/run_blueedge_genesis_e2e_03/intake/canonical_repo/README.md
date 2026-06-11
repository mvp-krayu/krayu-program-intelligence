# Blue Edge Fleet Management Platform

**Enterprise fleet management for oil & gas tankers, bus transit, and taxi operations**  
Dubai, UAE · Blue Edge Network LLC

---

## Quick Start

```bash
# Clone and start
git clone https://github.com/blueedge/fleet-management.git
cd fleet-management
cp .env.example .env
docker compose up -d

# Access
# Frontend:  http://localhost:5173
# API:       http://localhost:3000/api/v1
# Swagger:   http://localhost:3000/api/docs
# Grafana:   http://localhost:3001 (admin/blueedge2026)
```

**Default login:** `admin@blueedge.ae` / `admin123`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  React 18 + TypeScript + Vite (56 pages, PWA)               │
│  Tailwind CSS Dark Theme · Leaflet.js Maps · Chart.js       │
├─────────────────────────────────────────────────────────────┤
│  NestJS Backend (57 modules, 558 endpoints)                  │
│  TypeORM + PostgreSQL/TimescaleDB · Redis · Socket.IO        │
├─────────────────────────────────────────────────────────────┤
│  Docker · nginx · Prometheus + Grafana · GitHub Actions      │
└─────────────────────────────────────────────────────────────┘
```

| Layer     | Stack                                              | LOC     |
|-----------|----------------------------------------------------|---------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS           | 29,595  |
| Backend   | NestJS, TypeORM, PostgreSQL, Redis, Socket.IO      | 22,502  |
| Testing   | Vitest (25), Cypress E2E (6), Jest (62)            | 8,140   |
| Infra     | Docker, CI/CD, Prometheus, Grafana, k6             | 1,423   |
| **Total** |                                                    | **61,660** |

---

## Platform Features

### Fleet Types
- **Oil & Gas Tankers** — HAZMAT tracking, delivery management, JAFZA operations
- **Bus Transit** — Route management, passenger metrics, schedule optimization
- **Taxi Operations** — Surge pricing, real-time dispatch, fare management

### Core Modules (57)
Vehicles · Drivers · Trips · Alerts · Maintenance · Fuel · Fleets · Operations · Tanker · Bus · Taxi · Safety · Compliance · Permits · Cross-Border · Fatigue Risk · Devices · Diagnostics · OTA · Fleet Lifecycle · Parts Marketplace · EV · V2G · Electrification · Depot Charging · Charging Stations · Cold Chain · L-Stop Transit · Analytics · Reports · Executive · Anomaly Detection · Predictive Maintenance · Driver Scoring · Geofence Automation · Blockchain · Agentic AI · Road Intelligence · Digital Twin · Aftersales OEM · Data Monetization · Users · Notifications · Finance · Driver Incentives · Driver Mobile · Customer Portal · White Label · Multi-Tenant · Billing · Onboarding · Integration Hub · Messaging · Surge Pricing · Audit Log · Preferences · Errors

### Infrastructure
- **Auth:** JWT + refresh tokens, 5 RBAC roles (Admin/Manager/Dispatcher/Driver/Viewer)
- **Real-time:** WebSocket with Socket.IO, 73 domain events
- **Caching:** Redis with fallback to in-memory, automatic invalidation
- **i18n:** English + Arabic (180+ keys) with RTL support
- **Theme:** Dark/Light/System with localStorage persistence
- **PWA:** Service worker, offline support, push notifications, installable
- **Monitoring:** Prometheus metrics, Grafana dashboards, error tracking

---

## Development

```bash
# Backend
cd backend && npm install
npm run start:dev          # http://localhost:3000

# Frontend
cd frontend && npm install
npm run dev                # http://localhost:5173

# Testing
npm run test               # Vitest unit tests
npm run test:e2e           # Cypress E2E
npm run test:coverage      # Coverage report

# Storybook
npm run storybook          # http://localhost:6006

# Bundle analysis
npm run analyze            # Build + chunk report
```

---

## Deployment

### Docker (Recommended)
```bash
docker compose up -d                              # Full stack
docker compose -f docker-compose.monitoring.yml up -d  # + Monitoring
```

### CI/CD Pipeline
- **CI** (`.github/workflows/ci.yml`): Lint → Type-check → Unit tests → E2E → Build → Docker → Security scan (7 jobs)
- **CD** (`.github/workflows/deploy.yml`): Build → Push to GHCR → Deploy staging → Smoke tests → Deploy production

### Production Checklist
- [ ] Set all `.env` variables (DB, Redis, JWT secret, CORS origins)
- [ ] Configure domain in nginx.conf
- [ ] Enable HTTPS (certbot or cloud LB)
- [ ] Set `GF_SECURITY_ADMIN_PASSWORD` for Grafana
- [ ] Configure backup for PostgreSQL
- [ ] Set up alerting rules in Prometheus
- [ ] Generate PWA icons at all sizes (already included)
- [ ] Run load test: `bash load-tests/run.sh smoke`

---

## API Overview

| Category      | Endpoints | Example                              |
|---------------|-----------|--------------------------------------|
| Vehicles      | 12        | `GET /api/v1/vehicles`               |
| Drivers       | 10        | `GET /api/v1/drivers/:id`            |
| Trips         | 14        | `POST /api/v1/trips`                 |
| Tanker Ops    | 18        | `GET /api/v1/tanker/dashboard`       |
| Safety        | 8         | `GET /api/v1/safety/dashboard`       |
| Analytics     | 15        | `GET /api/v1/analytics/trends`       |
| Auth          | 5         | `POST /api/v1/auth/login`            |
| Health        | 6         | `GET /health/prometheus`             |
| **Total**     | **558**   |                                      |

Full Swagger docs: `http://localhost:3000/api/docs`

---

## Testing

| Layer         | Tool    | Files | Cases | LOC   |
|---------------|---------|-------|-------|-------|
| Unit (FE)     | Vitest  | 25    | 100+  | 3,161 |
| E2E (FE)      | Cypress | 6     | 99    | 613   |
| Unit (BE)     | Jest    | 62    | 470+  | 4,366 |
| Load          | k6      | 3     | 7     | 491   |
| **Total**     |         | **96**| **670+** | **8,631** |

---

## Load Testing

```bash
bash load-tests/run.sh smoke     # 5 VUs, 2 min
bash load-tests/run.sh load      # 50→100 VUs, 14 min
bash load-tests/run.sh stress    # 100→400 VUs, 22 min
bash load-tests/run.sh spike     # 10→500 VUs, 3 min
```

---

## Monitoring

| Tool       | URL                          | Purpose                    |
|------------|------------------------------|----------------------------|
| Prometheus | http://localhost:9090         | Metrics collection         |
| Grafana    | http://localhost:3001         | Dashboards & alerting      |
| Health     | http://localhost:3000/health  | Liveness probe             |
| Readiness  | http://localhost:3000/health/ready | Dependency checks      |
| Metrics    | http://localhost:3000/health/prometheus | Scrape target     |

---

## Project Structure

```
├── frontend/               # React 18 + TypeScript + Vite
│   ├── pages/              # 56 page components (7 categories)
│   ├── components/         # 66 reusable components
│   ├── api/                # 57 typed API clients
│   ├── hooks/              # 7 custom hooks
│   ├── contexts/           # 7 React contexts
│   ├── stories/            # 25 Storybook stories
│   ├── test/               # 25 Vitest test files
│   ├── cypress/            # 6 E2E specs + support
│   ├── router/             # Lazy-loaded routes (code splitting)
│   └── public/             # PWA manifest, service worker, icons
├── backend/                # NestJS + TypeORM
│   ├── src/modules/        # 57 domain modules
│   ├── src/health/         # Health + Prometheus + Monitoring
│   ├── src/events/         # Event-driven architecture
│   ├── src/common/         # Cache, logging, throttle, auth
│   └── migrations/         # SQL init + seed (Dubai data)
├── monitoring/             # Prometheus + Grafana config
├── load-tests/             # k6 API + WebSocket load tests
├── .github/workflows/      # CI + CD pipelines
└── docker-compose.yml      # Full stack orchestration
```

---

## License

Proprietary — Blue Edge Network LLC © 2026

## v3.19.0 — SVG Device Provisioning Expansion (Session 32)

### Expanded Pages (213 → 522-550 lines each)
- **DevicesPage.tsx** (522 lines): 6 tabs, 24 mock devices, 8-step provisioning workflow, device detail modal (5 sub-tabs: Overview, Telemetry, Certificates, J1939 Protocols, History)
- **OtaPage.tsx** (524 lines): 6 tabs, OTA campaigns, firmware packages, config templates with approval chains, J1939/CAN FD live parameters (24 PGN/SPNs), OBD-II fallback
- **DiagnosticsPage.tsx** (550 lines): 6 tabs, blockchain records (5 smart contracts), device wallets (EDGE tokens/NFTs), ownership transfers with escrow, PKI certificate hierarchy, DTC diagnostics with freeze frames

### Updated Metrics
- Frontend pages LOC: 15,189 → 16,146 (+957)
- Frontend total LOC: 29,595 → 31,397 (+1,802)
- Combined platform LOC: ~63,462
