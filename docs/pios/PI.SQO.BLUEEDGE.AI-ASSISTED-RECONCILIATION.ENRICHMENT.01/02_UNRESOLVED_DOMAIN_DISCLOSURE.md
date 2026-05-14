# Unresolved Domain Disclosure

**Stream:** PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01

---

## 1. Summary

After AI-assisted semantic enrichment, **4 of 17 domains remain at L1 (UNMAPPED)**. These domains were explicitly evaluated for enrichment and deliberately left unmapped because no genuine structural evidence exists.

---

## 2. Unresolved Domains

### DOMAIN-02 — Telemetry Transport and Messaging

**Type:** INFRASTRUCTURE | **Cluster:** CLU-04 (Platform Infrastructure)

**Why unmapped:** Telemetry transport is a conceptual layer — the mechanism by which sensor data moves from edge devices to the backend. This function is distributed across:
- DOM-13 (svg_agents) — the edge side (sensor_collector.py, hasi_bridge.py)
- DOM-07 (backend_events) — the backend side (event bus)

But neither DOM is a "transport" DOM. Transport is an emergent property of the communication between edge and backend, not a structural component with its own directory.

**What would resolve this:** A dedicated messaging/queue service (MQTT broker, Kafka, RabbitMQ) visible as a distinct structural component in the codebase topology.

---

### DOMAIN-08 — Real-Time Streaming and Gateway

**Type:** OPERATIONAL | **Cluster:** CLU-04 (Platform Infrastructure)

**Why unmapped:** No streaming infrastructure (WebSocket server, SSE endpoints, API gateway) is visible as a distinct structural DOM. The backend app root (DOM-04) serves as the HTTP gateway, but it is already claimed by DOMAIN-10 (Platform Infrastructure and Data).

Real-time streaming may exist within backend modules but is not structurally isolated — it is embedded in the monolithic application.

**What would resolve this:** A dedicated WebSocket server, API gateway service, or streaming microservice visible as a distinct structural component.

---

### DOMAIN-13 — External Integration

**Type:** INTEGRATION | **Cluster:** CLU-05 (Platform Services)

**Why unmapped:** External integration (third-party APIs, connectors, adapters) has no dedicated structural DOM. Integration code is likely embedded within individual backend modules that call external services, but these are not aggregated into a single "integration" structural component.

**What would resolve this:** A dedicated integration module or adapter layer visible as a distinct directory with external service connectors.

---

### DOMAIN-15 — EV and Electrification

**Type:** FUNCTIONAL | **Cluster:** CLU-03 (Emerging Capabilities)

**Why unmapped:** This is a business vertical domain — a market-specific capability (electric vehicle features, charging management, battery telemetry). No evidence of EV-specific code exists in any DOM evidence_refs. The domain may represent a planned capability that has not yet been implemented in the codebase, or its functionality may be embedded within general fleet modules without EV-specific structural markers.

**What would resolve this:** EV-specific modules, charging API integrations, or battery management code visible in the structural topology.

---

## 3. Classification of Unresolved Domains

| Category | Domains | Count |
|----------|---------|-------|
| **Conceptual infrastructure** — domain describes a cross-cutting concern without structural home | DOMAIN-02, DOMAIN-08 | 2 |
| **Distributed concern** — domain's code exists but is spread across multiple DOMs | DOMAIN-13 | 1 |
| **Business vertical** — domain represents a market capability not yet structurally distinct | DOMAIN-15 | 1 |

---

## 4. Why These Were Not Force-Enriched

Each of these domains was evaluated for potential DOM assignment. The decision to leave them unmapped is deliberate:

- **No fabrication policy:** Assigning a DOM where no structural evidence exists would fabricate a correspondence. The compiler would honestly show L2/L3, but the underlying claim would be false.
- **Governance honesty:** An unmapped domain with an explicit reason is more valuable than a weakly mapped domain with a fabricated justification.
- **Future resolution path:** When structural evidence becomes available (new PATH A analysis, codebase evolution), these domains can be enriched without reclassifying previously fabricated correspondences.

---

## 5. Impact on Overall Assessment

The 4 unmapped domains represent:
- 23.5% of total domains (4/17)
- Business concepts that exist in BlueEdge's domain model but lack structural grounding
- NOT failures of the enrichment process — they are honest admissions of structural absence

The remaining 76.5% of domains (13/17) now have structural correspondence at L2 or above, up from 29.4% (5/17) before enrichment.
