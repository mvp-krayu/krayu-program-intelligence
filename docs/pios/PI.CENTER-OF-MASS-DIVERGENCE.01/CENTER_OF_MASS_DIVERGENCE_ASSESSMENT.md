# Center-of-Mass Divergence Assessment

Stream: PI.CENTER-OF-MASS-DIVERGENCE.01
Date: 2026-06-06
Classification: G2 (architecture-consuming)
Status: COMPLETE

---

## 1. Hypothesis

Structural gravity (code center of mass derived from static import graph) and operational gravity (runtime center of mass derived from event flow, messaging, and coordination topology) can diverge.

This hypothesis emerged from AF-001 on BlueEdge. This assessment determines whether it generalizes.

---

## 2. Evidence Classification

Every claim in this assessment is classified:

- **OBSERVED** — derived from measured evidence in the PI pipeline
- **HYPOTHESIS** — testable claim that requires evidence to confirm or refute
- **NOT TESTED** — no evidence exists; no prediction made

---

## 3. Specimen Evidence

### 3.1 BlueEdge

**Classification: OBSERVED**

**Evidence available:**
- Static import graph: 100% complete (40.3s code_graph)
- Runtime connectivity: 6 evidence layers (EVENT_FLOW, MQTT_TOPIC_FLOW, WEBSOCKET_FLOW, API_BOUNDARY, DI_MODULE_GRAPH, STATIC_IMPORT)
- Semantic domains: 17 domains across 5 clusters
- AF-001: Structural vs Operational Gravity Divergence [CRITICAL]

**Structural gravity (OBSERVED):**
- Primary locus: Platform Infrastructure and Data
- Primary node: `backend/src/common/dto/index.ts` — 111 inbound, 2 outbound
- Supporting hubs: `roles.guard.ts` (63 inbound), `jwt-auth.guard.ts` (62 inbound)

**Operational gravity (OBSERVED):**
- Fleet Core Operations — Runtime Dependency Choke Point [HIGH]
- Event-Driven Architecture — 53 events, 4 handlers, 13.3:1 concentration
- Real-Time Streaming — `fleet.gateway.ts`, 12 WebSocket streams
- Edge Data Acquisition — MQTT single broker, edge-to-cloud dependency

**Divergence (OBSERVED):**
- Static loci: Platform Infrastructure and Data, Frontend Application
- Runtime loci: Fleet Core Operations, Real-Time Streaming, Event-Driven Architecture
- Overlap: Telemetry Transport and Messaging, Edge Data Acquisition (partial)
- Divergent loci: 3

### 3.2 NetBox

**Classification: NOT TESTED**

**Evidence available:**
- Static import graph: code_graph.json (1,155 files, 3,614 import edges)
- Runtime connectivity: NONE
- Semantic domains: NOT POPULATED

**Structural gravity (OBSERVED from import graph):**
- `netbox/dcim/models/__init__.py` — 160 inbound imports
- `netbox/core/models/__init__.py` — 114 inbound
- `netbox/extras/models/__init__.py` — 95 inbound

**Operational gravity:** NO EVIDENCE. Cannot be measured without runtime connectivity extraction.

**Divergence:** CANNOT BE ASSESSED. Only one gravity axis is measured.

**What would be needed to test:**
1. Django signals extraction (signal definitions, handlers, connection points)
2. Webhook dispatch topology
3. Redis queue topology (task producers, consumers, routing)
4. Plugin registration graph

### 3.3 StackStorm

**Classification: NOT TESTED**

**Evidence available:**
- Static import graph: code_graph.json (1,333 files, 4,006 import edges)
- Runtime connectivity: NONE
- Semantic domains: NOT POPULATED

**Structural gravity (OBSERVED from import graph):**
- `st2common/st2common/__init__.py` — 245 inbound imports
- `st2common/st2common/util/__init__.py` — 184 inbound
- `st2tests/st2tests/__init__.py` — 147 inbound

**Operational gravity:** NO EVIDENCE. Cannot be measured without runtime connectivity extraction.

**Divergence:** CANNOT BE ASSESSED. Only one gravity axis is measured.

**What would be needed to test:**
1. AMQP exchange/queue topology
2. Sensor→trigger→rule→action flow graph
3. Inter-service message flow
4. Process boundary graph

---

## 4. Divergence Matrix

| Specimen | Static Gravity | Operational Gravity | Divergence Status |
|---|---|---|---|
| BlueEdge | OBSERVED | OBSERVED | OBSERVED — 3 divergent loci |
| NetBox | OBSERVED | NO EVIDENCE | NOT TESTED |
| StackStorm | OBSERVED | NO EVIDENCE | NOT TESTED |

---

## 5. What Would Falsify the Hypothesis

The hypothesis would be falsified if:

1. A specimen with runtime connectivity evidence shows structural and operational gravity at the SAME loci (coincidence, not divergence)
2. Multiple specimens with runtime evidence show coincidence — proving BlueEdge is specimen-specific

The hypothesis would be strengthened if:

1. NetBox or StackStorm, after runtime extraction, shows divergent gravity loci
2. A call-graph-dominant specimen (e.g., Flask) shows coincident gravity loci — proving divergence is architecture-dependent, not universal

---

## 6. Preliminary Assessment

**What is proven:**
- BlueEdge exhibits center-of-mass divergence (AF-001, CRITICAL)
- The divergence is measurable: 3 divergent loci out of 8 impacted domains
- The divergence is structurally caused: runtime coordination (events, MQTT, WebSocket) does not create import edges

**What is hypothesis:**
- Whether divergence generalizes beyond BlueEdge
- Whether architecture profile predicts divergence
- Whether call-graph-dominant systems exhibit coincidence

**What is unknown:**
- Operational gravity for any specimen other than BlueEdge
- Whether a quantitative divergence metric generalizes
- Whether divergence severity correlates with architecture complexity

---

## 7. Recommendation

1. **Do NOT create a PI law, ontology object, or category.** One specimen is insufficient.
2. **Next evidence step:** Extract runtime connectivity for NetBox (Django signals + Redis queues). This is the nearest testable specimen.
3. **After NetBox evidence exists:** Re-run this assessment with two data points. Two confirming specimens still do not make a law — but two specimens allow comparison.
4. **Counterexample test:** If runtime extraction is performed on a synchronous call-graph-dominant specimen and gravity coincides, the phenomenon is architecture-conditional. If it also diverges, the hypothesis broadens.
5. **Evidence threshold for doctrine:** Minimum 3 specimens with runtime evidence showing divergence + 1 specimen showing coincidence before any classification as a structural property of PI.
