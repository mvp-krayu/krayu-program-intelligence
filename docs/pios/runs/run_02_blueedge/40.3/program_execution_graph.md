# Program Execution Graph
run_id: run_02_blueedge
stream: Stream 40.3 — PiOS Reverse Engineering
contract: PIOS-40.3-RUN02-IG1C-REGEN
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.1C fresh baseline re-ingestion from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation

---

## PEG Overview

The Program Execution Graph (PEG) represents the canonical execution structure of the BlueEdge Fleet Intelligence Platform v3.23.0.

The PEG is organized as execution flow paths. Each path traces a request or event from its origin through the system to its terminal state.

All PEG nodes are traceable to entity_catalog.md entities. All edges are traceable to dependency_map.md or interface_map.md.

---

## PEG Node Registry

| Node ID | Entity Ref | Name |
|---------|-----------|------|
| N-01 | CE-002 | Frontend Application |
| N-02 | FE-001 | API Client Layer |
| N-03 | FE-004 | WebSocket Client |
| N-04 | FE-005 | Auth Context |
| N-05 | CE-001 | Backend API Application |
| N-06 | BM-064 | Auth Module (JWT guard) |
| N-07 | BM-001..BM-060 | Domain Module Layer |
| N-08 | BM-063 | FleetEventsModule (EventEmitter) |
| N-09 | BM-062 | FleetGateway (WebSocket) |
| N-10 | BM-061 | HealthModule |
| N-11 | INF-001 | PostgreSQL |
| N-12 | INF-002 | Redis |
| N-13 | INF-003 | Monitoring (Prometheus + Grafana) |
| N-14 | INF-004 | MQTT Broker |
| N-15 | INF-005 | HASI Security System |
| N-16 | SA-001 | HASI Bridge Agent |
| N-17 | SA-002 | Sensor Collector Agent |

---

## Execution Path 1 — REST API Request (Authenticated CRUD)

Label: EP-01
Description: A frontend user triggers a data operation (e.g., list vehicles, create trip).

```
N-01 (Frontend)
  → N-02 (API Client)
      [HTTP fetch to /api/v1/{resource}]
      [Authorization: Bearer {accessToken}]
  → N-05 (Backend API)
      → N-06 (JWT Guard — validates token, extracts role)
          [PASS: proceed to controller]
          [FAIL: 401 Unauthorized → token refresh via /api/v1/auth/refresh]
      → N-07 (Domain Module Controller → Service)
          → N-11 (PostgreSQL via TypeORM Repository)
              [SELECT / INSERT / UPDATE / DELETE]
          ← returns entity data
      ← returns ApiResponse<T>
  ← N-02 receives JSON response
  → N-01 renders updated UI state
```

Evidence: SD-001 (frontend→backend), BD-001 (JWT guard), BD-006 (TypeORM), CEU-09 api/client.ts

Token refresh sub-path (EP-01a):
```
N-02 (API Client — receives 401)
  → POST /api/v1/auth/refresh {refreshToken}
  ← new accessToken
  → retry original request with new token
```
Evidence: CEU-09 api/client.ts — refreshAccessToken(), doRefresh()

---

## Execution Path 2 — Domain State Change → Event Propagation

Label: EP-02
Description: A domain module mutates state and emits an event; event propagates to cache invalidation, audit, notification, and WebSocket broadcast.

```
N-07 (Domain Module Service — e.g., vehicles.service.ts)
  [state mutation complete: CREATE/UPDATE/DELETE]
  → N-08 (FleetEventEmitter.emit(FleetEvents.VEHICLE_CREATED, payload))
      [EventEmitter2 synchronous/async fan-out]
      ├─→ Handler: audit-log.handler
      │     [writes audit log record to N-11 (PostgreSQL)]
      ├─→ Handler: cache-invalidation.handler
      │     [invalidates relevant key in N-12 (Redis)]
      ├─→ Handler: notification.handler
      │     [dispatches notifications via N-13 (BM-013 NotificationsModule)]
      └─→ Handler: websocket-broadcast.handler
            → N-09 (FleetGateway.emitVehicleUpdate(vehicleId, event, data))
                → socket.io broadcast to subscribed clients
                → N-03 (Frontend WebSocket Client receives event)
                → N-01 (Frontend re-renders real-time component)
```

Evidence: CEU-08 events/types/fleet-events.ts, events/handlers/, gateways/fleet.gateway.ts (emitVehicleUpdate method), BD-003, BD-004, BD-005

---

## Execution Path 3 — Real-Time Fleet Tracking (Push)

Label: EP-03
Description: Frontend subscribes to fleet position stream; backend broadcasts on interval.

```
N-01 (Frontend — loads fleet map page)
  → N-03 (FleetSocket.connect() to /fleet namespace)
      → N-09 (FleetGateway.handleConnection)
          ← connection:ack {clientId, serverTime, vehicles}

N-03 (Frontend sends: subscribe:fleet {fleetType: 'tanker'})
  → N-09 (handleSubscribeFleet — joins room fleet:tanker)
      ← subscribed {room: 'fleet:tanker', vehicles: 3}

[Background broadcast loop — every 2 seconds]
N-09 (positionInterval → generatePosition() for each vehicle)
  → server.to('fleet:tanker').emit('fleet:positions', {positions, timestamp})
  → N-03 (receives fleet:positions)
  → N-01 (map component re-renders vehicle markers)

[Telemetry — every 5 seconds]
N-09 (telemetryInterval → generateTelemetry())
  → server.to('vehicle:{id}').emit('vehicle:telemetry', payload)
  → N-03 (receives vehicle:telemetry)
  → N-01 (vehicle detail panel updates)
```

Evidence: CEU-08 gateways/fleet.gateway.ts — startBroadcasts(), handleSubscribeFleet(), SD-002

---

## Execution Path 4 — Vehicle Command Dispatch

Label: EP-04
Description: Frontend operator issues a command to a vehicle.

```
N-01 (Frontend — operator clicks "send command")
  → N-03 (FleetSocket.emit('vehicle:command', {vehicleId, command, params}))
      → N-09 (FleetGateway.handleVehicleCommand)
          [auth validation: PARTIAL — evidenced as "In production: validate auth, publish to MQTT topic for SVG device"]
          → [PARTIALLY EVIDENCED PATH] → N-14 (MQTT Broker) → SVG device
          ← command:ack {vehicleId, command, status: 'queued', queuedAt}
  ← N-03 receives command:ack
  → N-01 (UI shows queued status)
```

Evidence: CEU-08 gateways/fleet.gateway.ts handleVehicleCommand() — comment in code
Partial_edge: FleetGateway → MQTT Broker path stated in code comment but implementation not evidenced in extracted source (US-11)

---

## Execution Path 5 — HASI Security Data Pipeline

Label: EP-05
Description: SVG 2.0 device-side security event pipeline; HASI bridge pushes security intelligence to cloud.

```
[On SVG 2.0 device — runs as systemd service]
N-16 (SA-001 HASI Bridge — polls every 30 seconds)
  → reads N-15 (HASI SQLite DB — new captures/threats/recommendations)
      [SQLite query on /opt/hasi/data/hasi.db]
  [if new records found — batch up to 10]
  → [PRIMARY PATH] → N-14 (MQTT Broker mqtt.blueedge.network:8883)
      [topic: blueedge/hasi/{device_id}/{event_type}]
      [TLS: mutual TLS with client cert]
      → [PARTIALLY EVIDENCED] → N-05 (Backend API — CE-001)
          → N-07 (BM-060 HASI Module → receives security data)
          → N-11 (PostgreSQL — stores security intelligence)

  → [FALLBACK PATH — when MQTT unavailable]
    → N-05 (Backend API via HTTPS REST)
        [POST https://api.blueedge.network/api/v1/{endpoint}]
        [X-API-Key: BLUEEDGE_API_KEY]
        → N-07 (BM-060 HASI Module)
        → N-11 (PostgreSQL)
```

Evidence: CEU-10 hasi_bridge.py, CEU-08 src/modules/hasi/ (module present), SD-005, SD-006, SD-007
Partial_edge: MQTT → Backend path (US-06 carried forward)

---

## Execution Path 6 — Monitoring Data Collection

Label: EP-06
Description: Prometheus scrapes metrics from backend API and infrastructure exporters.

```
[Every 10 seconds]
N-13 (Prometheus) → scrape N-10 (HealthModule /health/prometheus)
  → N-10 (exports OpenMetrics format)
      [heap, RSS, cache hits/misses, events total, custom gauges]
  ← Prometheus stores time-series metrics

[Every 15 seconds]
N-13 (Prometheus) → scrape node-exporter:9100 (host CPU/memory/disk)
N-13 (Prometheus) → scrape redis-exporter:9121 (INF-002 metrics)
N-13 (Prometheus) → scrape postgres-exporter:9187 (INF-001 metrics)

[Grafana reads Prometheus]
N-13 (Grafana) → queries Prometheus datasource
  → renders fleet-operations.json dashboard
```

Evidence: CEU-10 monitoring/prometheus/prometheus.yml, CEU-08 health/health.controller.ts, SD-008, SD-009

---

## Execution Path 7 — User Authentication Flow

Label: EP-07
Description: Frontend user authenticates; tokens stored; refresh cycle managed.

```
N-01 (Frontend — login page)
  → N-02 (api.post('/auth/login', {email, password}))
      → N-05 (Backend API)
          → N-06 (Auth Module — validate credentials vs N-11 users table)
          → N-06 (generate JWT access_token + refresh_token)
          ← {accessToken, refreshToken}
  → N-04 (AuthContext.setTokens(access, refresh))
      [localStorage: be-token, be-refresh-token]
  → N-02 (api/client.ts: setTokens(access, refresh))
  → N-01 (redirect to dashboard)

[Access token expires]
  → N-02 (receives 401)
  → N-02 (POST /auth/refresh {refreshToken})
      ← new accessToken (or 401 if refresh expired)
  [if refresh also expired]
  → N-04 (AuthContext: clearTokens())
  → N-01 (redirect to login)
```

Evidence: CEU-09 api/client.ts — doRefresh(), setTokens(), clearTokens(), setOnUnauthorized(); CEU-09 contexts/AuthContext.tsx

---

## Execution Path 8 — Offline Mutation Queue

Label: EP-08
Description: Frontend queues mutations when network is unavailable; flushes on reconnect.

```
[Network offline detected]
N-02 (API Client — !navigator.onLine AND method != GET)
  → queueOfflineMutation(endpoint, options)
      [stores to localStorage OFFLINE_QUEUE_KEY]

[Network reconnects / flush triggered]
N-02 (flushOfflineQueue())
  → for each queued mutation:
      → apiRequest(endpoint, options)
          → N-05 (Backend API — normal EP-01 path)
  → removes succeeded items from queue
  → retains failed items < 24h old for retry
  → discards items > 24h old
```

Evidence: CEU-09 api/client.ts — queueOfflineMutation(), flushOfflineQueue(), getOfflineQueue()

---

## PEG Completeness Assessment

| Execution Path | Status | Evidence Depth |
|----------------|--------|---------------|
| EP-01 — REST API Request | COMPLETE | Full path evidenced |
| EP-01a — Token Refresh | COMPLETE | Full path evidenced |
| EP-02 — Event Propagation | COMPLETE | Full path evidenced |
| EP-03 — Real-Time Fleet Tracking | COMPLETE | Full path evidenced |
| EP-04 — Vehicle Command Dispatch | PARTIAL | FleetGateway→MQTT edge not evidenced |
| EP-05 — HASI Security Pipeline | PARTIAL | MQTT→Backend edge not evidenced |
| EP-06 — Monitoring Collection | COMPLETE | Full path evidenced |
| EP-07 — User Authentication | COMPLETE | Full path evidenced |
| EP-08 — Offline Mutation Queue | COMPLETE | Full path evidenced |

Overall PEG: PARTIAL (EP-04 and EP-05 have unresolved edges)

---

## PEG Unknown-Space

- US-11: FleetGateway → MQTT Broker command dispatch path — referenced in gateway code comment but not implemented in extracted source
- US-12: MQTT Broker → Backend API consumer path for HASI security data
- US-13: Sensor Collector (SA-002) execution path — sensor_collector.py content not read at 40.3 depth

---

## Overlap Positions in PEG

OVL-01 impact: N-05, N-07, N-11 entities may be represented in both CE-001 (standalone backend, CEU-08) and CE-003 embedded backend (CEU-10). PEG uses CEU-08 as canonical source for all backend nodes.

OVL-02 impact: N-01, N-02, N-03, N-04 entities may be represented in both CE-002 (standalone frontend, CEU-09) and CE-003 embedded frontend (CEU-10). PEG uses CEU-09 as canonical source for all frontend nodes.

---

## Status

peg_complete: PARTIAL
peg_paths_fully_evidenced: 7/9 (EP-01, EP-01a, EP-02, EP-03, EP-06, EP-07, EP-08)
peg_paths_partial: 2/9 (EP-04, EP-05)
all_nodes_traceable: TRUE
overlap_declared: TRUE
unknown_space_declared: TRUE
evidence_boundary_compliance: CONFIRMED
prohibited_paths_accessed: NONE
