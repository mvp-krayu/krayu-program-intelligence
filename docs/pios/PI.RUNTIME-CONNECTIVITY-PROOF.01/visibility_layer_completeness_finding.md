# Visibility Layer Completeness — PI Architectural Finding

Stream: PI.RUNTIME-CONNECTIVITY-PROOF.01
Date: 2026-06-05
Classification: PI-LEVEL ARCHITECTURAL FINDING (not BlueEdge-specific)

---

## Finding

Program Intelligence currently treats static import visibility as structural coverage. This is architecturally incomplete.

Modern software systems operate across multiple connectivity layers:

| Layer | Mechanism | PI Current Status |
|---|---|---|
| STATIC_IMPORT | file-level import/require/from | MEASURED (40.3s) |
| EVENT_FLOW | EventEmitter, pub/sub, domain events | NOT MEASURED |
| MQTT_TOPIC_FLOW | MQTT publish/subscribe, IoT messaging | NOT MEASURED |
| WEBSOCKET_FLOW | WebSocket/Socket.IO rooms and channels | NOT MEASURED |
| API_BOUNDARY | REST controllers, route-to-module mapping | NOT MEASURED |
| DI_MODULE_GRAPH | Framework DI containers (NestJS, Spring, etc.) | NOT MEASURED |
| RUNTIME_WIRING | Docker Compose, K8s, Terraform, service mesh | NOT MEASURED |

Any system that uses event-driven architecture, IoT connectivity, real-time streaming, or framework dependency injection will exhibit connectivity that the static import graph cannot observe.

## Evidence from BlueEdge

- 17 declared domains
- 4 visible through static imports
- 13 classified as "dark"
- **0 actually absent** — all 13 are connected through event flows, MQTT, WebSocket, API boundaries, or DI injection

The "coverage gap" was a visibility-layer gap. The system was fully connected. PI was measuring one layer.

## Architectural implication

Before interpreting any structural verdict, the Run Integrity Layer must:

1. **Classify which visibility layers were measured** for this specimen
2. **Classify which visibility layers the specimen architecture requires** (event-driven? IoT? microservice? monolith?)
3. **State the verdict scope** — "this verdict reflects CODE CONNECTIVITY, not SYSTEM CONNECTIVITY" or "this verdict reflects SYSTEM CONNECTIVITY across N layers"
4. **Flag the visibility gap** — if the architecture requires layers that were not measured, the verdict must carry a visibility-layer completeness qualifier

## Proposed Run Integrity check

```
VISIBILITY_LAYER_COMPLETENESS

Input:
  - specimen architecture type (monolith, event-driven, IoT, microservice, etc.)
  - measured visibility layers (from enrichment pipeline)

Output:
  - layers_measured: [STATIC_IMPORT]
  - layers_required: [STATIC_IMPORT, EVENT_FLOW, MQTT_TOPIC_FLOW, WEBSOCKET_FLOW, API_BOUNDARY, DI_MODULE_GRAPH]
  - completeness: 1/6
  - verdict_scope: CODE_CONNECTIVITY (not SYSTEM_CONNECTIVITY)
  - qualifier_modifier: VISIBILITY_INCOMPLETE
```

This check does not change Q-class. Q-class measures reconciliation quality within the measured layer. This check measures whether the measured layer is sufficient for the architecture.

## Generality assessment

This finding is NOT BlueEdge-specific. It applies to:

| Architecture Type | Expected Unmeasured Layers |
|---|---|
| NestJS / Spring Boot | EVENT_FLOW, DI_MODULE_GRAPH, API_BOUNDARY |
| IoT / Edge | MQTT_TOPIC_FLOW, RUNTIME_WIRING |
| Microservices | API_BOUNDARY, RUNTIME_WIRING, EVENT_FLOW |
| Django monolith | DI_MODULE_GRAPH (signals, middleware, Celery tasks) |
| React SPA + API | API_BOUNDARY, WEBSOCKET_FLOW |

Every non-trivial system will have connectivity that the static import graph cannot see. The question is how much of the system's operational behavior depends on those invisible layers.

## Recommended next step

**Option B: Keep as BlueEdge-specific forensic proof first, then generalize.**

Rationale:
- The forensic evidence is complete for BlueEdge
- The architectural finding is stated
- Automated extraction capability is a separate engineering stream
- Integrating into the Run Integrity Layer permanently requires: (a) framework-specific extractors, (b) a unified graph merge strategy, (c) updates to the signal synthesis pipeline to consume runtime edges
- Premature automation before the second specimen validates the pattern risks over-engineering for one architecture

The proof is complete. The next step is to validate whether the same visibility-layer gap appears in a second specimen (NetBox — Django), confirming the pattern is universal. Then build the extraction capability.
