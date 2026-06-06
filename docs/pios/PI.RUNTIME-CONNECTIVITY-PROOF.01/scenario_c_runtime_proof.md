# Scenario C Runtime Proof — BlueEdge

Stream: PI.RUNTIME-CONNECTIVITY-PROOF.01
Specimen: blueedge / run_blueedge_genesis_e2e_03
Date: 2026-06-05
Origin: THORR confidence challenge during Transformation Leader / Chief Architect interrogation

---

## Hypothesis

THORR identified that the 13 "dark" domains (semantic-only, no static import backing) might be dark for one of four reasons:

- **A:** Not ingested
- **B:** Ingested but not mapped
- **C:** Connected through runtime mechanisms invisible to static import analysis
- **D:** Topology is ahead of implementation

## Finding

**Scenario C: CONFIRMED.**

All 13 domains exist in the codebase. All 13 have runtime connectivity through mechanisms the static import graph cannot observe.

## Evidence

### MQTT (edge → cloud)

- **2 Python agents** run on SVG 2.0 edge hardware (sensor-collector, hasi-bridge)
- **6 MQTT topic channels** declared in config (`blueedge/sensors/*`, `blueedge/telemetry/*`, `blueedge/hasi/*`, `blueedge/commands/*`, `blueedge/ota/*`)
- Protocol: MQTTv5, QoS 1, mTLS authentication
- Broker: `mqtt.blueedge.network:8883` / AWS IoT Core
- These agents are NOT in Docker Compose — they run on separate hardware. They are structurally invisible to any import graph of the cloud application.

### NestJS EventEmitter (internal domain events)

- **53 distinct event types** defined in `FleetEvents` constant
- **1 centralized emitter** (`FleetEventEmitter`) with wildcard pattern matching
- **4 event handlers** consuming events: WebSocketBroadcast, CacheInvalidation, AuditLog, Notification
- Event types span 13 domain groups (vehicle, telemetry, driver, trip, alert, safety, maintenance, fuel, tanker, coldchain, EV/V2G, OTA, geofence, compliance, diagnostics, finance, system)

### WebSocket / Socket.IO (backend → frontend real-time)

- **1 WebSocket gateway** (`FleetGateway`) with 7 subscribe message types
- **12+ real-time event streams** emitted to frontend
- **6 frontend React hooks** consuming socket events (`useFleetPositions`, `useVehicleTelemetry`, `useAlertStream`, `useActivityFeed`, `useSocketEvent`, `useVehicleCommand`)
- **11+ frontend pages** directly consuming real-time data

### API Boundary (REST controllers)

- **63 NestJS controllers** with `@Controller` decorators across all domains
- Domains that have no event emission still have full REST APIs
- DOMAIN-06 (AI/ML) and DOMAIN-13 (External Integration) are connected exclusively through REST

### NestJS Dependency Injection

- **DOMAIN-11** (Event-Driven Architecture) is `@Global()` — `FleetEventEmitter` is injectable in every module without explicit import
- **DOMAIN-09** (Access Control) applies auth guards globally — every controller depends on it at runtime
- Cross-module coordination occurs through the DI container, not through import statements

## Root cause

**Static import visibility was treated as structural coverage.**

The 40.3s code graph correctly measured file-level import relationships. But in a system where:
- Edge devices communicate through MQTT
- Domain events flow through EventEmitter2 with wildcard matching
- Real-time data streams through Socket.IO rooms
- Security is enforced through global DI guards
- 63 modules coordinate through a DI container

...static imports represent one visibility layer in a five-layer system.

## Corrected interpretation

| Before | After |
|---|---|
| 13 domains are structurally dark | 13 domains lack static-import evidence |
| Coverage gap (Q-03) | Visibility-layer gap |
| The system is partially measured | The system is fully connected — one layer is fully measured |
| 4/17 structural coverage | 4/17 static + 17/17 runtime |

## Scenario C status: CONFIRMED

The missing domains are not absent. They are connected through evidence types not elevated into structural analysis.
