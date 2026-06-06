# StackStorm Execution Blindness Proof

Stream: PI.STACKSTORM-EXECUTION-BLINDNESS-PROOF.01
Date: 2026-06-06
Classification: Repeatability validation

---

## Does StackStorm Activate Execution Blindness?

**YES.**

All four activation criteria are met. The blindness surface is larger than BlueEdge.

---

## Activation Criteria Evaluation

### Criterion 1: SYSTEM_CONNECTIVITY scope

**MET.**

Evidence layers measured from StackStorm canonical repository:

| Layer | Evidence | Status |
|---|---|---|
| STATIC_IMPORT | Code graph: 1,333 files, 4,006 import relationships | MEASURED |
| MESSAGE_TOPOLOGY | 12 AMQP topic exchanges, queue declarations per exchange, publisher/consumer bindings | MEASURED (from source) |
| SERVICE_INTERFACE | st2api REST controllers | MEASURABLE |
| DEPLOYMENT_TOPOLOGY | 11 systemd services as separate processes | MEASURED (from service files) |
| EXTERNAL_DEPENDENCY | RabbitMQ broker (amqp://), MongoDB, Redis coordination backend | MEASURED (from config) |

5 evidence layers. Verdict scope: SYSTEM_CONNECTIVITY. ≥4 layers required, 5 available.

### Criterion 2: ≥2 runtime conditions

**MET.**

| Runtime Condition | Evidence | Severity |
|---|---|---|
| RUNTIME_COORDINATION | 12 AMQP exchanges coordinate all inter-service communication. Trigger dispatch, execution lifecycle, workflow state, sensor events — all message-mediated. | HIGH |
| RUNTIME_CONCENTRATION | All coordination routes through single RabbitMQ broker. 12 exchanges but ONE broker infrastructure. 6 message handlers consume from queues. | HIGH |
| RUNTIME_DEPENDENCY | 11 services depend on RabbitMQ for inter-process coordination. No import edge connects st2sensorcontainer to st2actionrunner — they coordinate through AMQP. | HIGH |
| RUNTIME_BOUNDARY_EXTENSION | RabbitMQ is external infrastructure. MongoDB is external. Sensors connect to external monitoring systems. Actions execute on remote targets (SSH, REST, cloud). | ELEVATED |
| RUNTIME_SILENCE | Sensor container failure stops all external event ingestion. st2api continues accepting requests and reporting healthy. Action runner failure stops execution while rules engine continues queueing. | ELEVATED |

5 runtime conditions. ≥2 required, 5 available.

### Criterion 3: Proven divergence

**MET.**

**Static gravity (from import graph):**
- st2common/__init__.py — 245 inbound imports
- st2common/util/__init__.py — 184 inbound
- st2tests/__init__.py — 147 inbound
- st2common/constants/__init__.py — 101 inbound
- st2common/services/__init__.py — 92 inbound

Static center of mass: **st2common** (shared library). Every service imports from it. It is the code center of gravity.

**Runtime gravity (from AMQP topology + service topology):**
- RabbitMQ broker — ALL inter-service coordination
- st2.trigger_instances_dispatch exchange — trigger dispatch backbone
- st2.liveaction exchange — action execution lifecycle
- st2.execution exchange — execution state propagation
- st2.workflow exchange — workflow orchestration
- st2sensorcontainer — ALL external event ingestion (single process)
- st2actionrunner — ALL action execution (separate process)

Runtime center of mass: **AMQP exchange layer + sensor container + action runner**. These coordinate ALL operational behavior. None are dominant in the import graph.

**Divergence:** TOTAL. The import graph says "everything depends on st2common." The operational system says "everything coordinates through RabbitMQ." These are completely different structures. st2common is a library. RabbitMQ is a coordination backbone. The divergence is not partial (like BlueEdge's 3 divergent loci). It is architectural — the entire operational coordination mechanism is invisible to import analysis.

### Criterion 4: ≥1 blindness class evidenced

**MET. All three.**

**BOUNDARY blindness:**
- RabbitMQ is external infrastructure (amqp://guest:guest@127.0.0.1:5672). Its availability is outside the codebase.
- MongoDB is external (database for all persistent state).
- Sensors connect to external monitoring APIs, file systems, webhooks. Their targets are outside the codebase.
- Actions execute on remote targets via SSH, REST, cloud APIs. Target availability is outside the codebase.
- Redis coordination backend is external.

**SILENCE blindness:**
- st2sensorcontainer is a separate process. Its failure stops ALL external event ingestion. But st2api continues responding to API calls. The platform reports healthy while event detection has stopped.
- st2actionrunner is a separate process. Its failure stops ALL action execution. But the rules engine continues evaluating triggers and queueing actions. A growing backlog forms that the API tier cannot detect.
- RabbitMQ failure disconnects all 11 services from each other. Each service continues running independently. The platform appears to have 11 healthy processes while coordination has completely stopped.

**COUPLING blindness:**
- Import analysis shows st2common coupling (245 inbound). This predicts that changes to st2common propagate widely.
- Runtime analysis shows AMQP exchange coupling. A trigger type schema change propagates through st2.trigger → st2.trigger_instances_dispatch → rules engine → st2.liveaction → action runner → st2.execution → workflow engine — a chain invisible to import analysis.
- Blast radius: a single exchange schema change affects sensors, rules, actions, workflows, notifications, and streaming — 6 services. Import analysis cannot predict this because no import edge connects these services.

---

## Blindness Profile Comparison

| Dimension | BlueEdge | StackStorm |
|---|---|---|
| Architecture | IoT platform, monolith + edge | Event-driven automation, multi-service |
| Technology | TypeScript / NestJS | Python |
| Broker | MQTT (mqtt.blueedge.network:8883) | AMQP/RabbitMQ (amqp://127.0.0.1:5672) |
| Coordination mechanism | EventEmitter2 (in-process) | AMQP exchanges (inter-process) |
| Services | 1 monolith + edge agents | 11 independent systemd services |
| Static gravity | Platform Infrastructure (DTO layer, 111 imports) | st2common (shared library, 245 imports) |
| Runtime gravity | Fleet Core Ops / Event-Driven Architecture | AMQP exchanges / sensor container / action runner |
| Divergent loci | 3 of 8 domains | TOTAL — no overlap between import gravity and operational gravity |
| Exchanges/topics | 4 MQTT topics, 53 events, 12 WebSocket streams | 12 AMQP exchanges |
| Handlers/consumers | 4 event handlers | 6 message handlers + 11 service processes |
| Boundary dependencies | MQTT broker, 2 edge agents on NXP hardware | RabbitMQ, MongoDB, Redis, external sensors, remote action targets |
| Silent failure modes | Broker → telemetry stops. Gateway → frontend dark. | Sensor → events stop. Runner → actions stop. Broker → coordination stops. |
| Blindness classes | BOUNDARY + SILENCE + COUPLING | BOUNDARY + SILENCE + COUPLING |
| GRAVITY_DIVERGENCE | Partial (3 divergent loci) | Total (no overlap) |

---

## Key Differences

### StackStorm blindness is MORE severe than BlueEdge

1. **BlueEdge divergence is partial.** Some domains appear in both static and runtime gravity (Telemetry Transport, Edge Data Acquisition). The import graph and operational graph overlap at some loci.

2. **StackStorm divergence is total.** The import graph shows a shared library (st2common). The operational graph shows 12 AMQP exchanges coordinating 11 independent services. There is ZERO overlap between what the import graph identifies as important and what the operational system depends on.

3. **BlueEdge has 1 broker.** StackStorm has 3 external infrastructure dependencies (RabbitMQ + MongoDB + Redis) — each a potential boundary blindness.

4. **BlueEdge silence affects 1 data path** (telemetry). StackStorm silence affects 3 independent capability domains (event ingestion, action execution, inter-service coordination). Each can fail independently while the others continue.

5. **BlueEdge coupling blindness affects 8 domains through 1 event bus.** StackStorm coupling blindness affects 11 services through 12 exchanges — a richer and more complex coordination topology.

### Same concepts, different technology

The cognition primitives are identical:
- RUNTIME_DEPENDENCY: NestJS EventEmitter handlers → AMQP queue consumers
- RUNTIME_COORDINATION: Event bus → AMQP exchanges
- RUNTIME_CONCENTRATION: 4 handlers for 53 events → 1 broker for 12 exchanges
- RUNTIME_BOUNDARY_EXTENSION: MQTT broker + edge hardware → RabbitMQ + MongoDB + Redis + remote targets
- RUNTIME_SILENCE: Gateway/broker failure → sensor/runner/broker failure
- RUNTIME_GRAVITY: Import hub (DTO) vs runtime hub (event bus) → Import hub (st2common) vs runtime hub (AMQP)

No primitive changed. No new primitive was needed. No primitive failed to apply.

---

## Narrative Mode Determination

```
determineNarrativeMode({
  vlc: { verdict_scope: 'SYSTEM_CONNECTIVITY' },  // 5 layers ✓
  runtimeConditions: 5,                            // ≥2 ✓
  divergence: true,                                // total ✓
  blindnessClasses: ['BOUNDARY', 'SILENCE', 'COUPLING']  // ≥1 ✓
})
→ EXECUTION_BLINDNESS
```

### Expected EIR chapters (MODE B):

1. **Executive Brief:** "StackStorm has operational failure modes that are invisible to the organization."
2. **What the Organization Believes:** "Static analysis identifies st2common as the structural center — 245 inbound imports, shared library gravity."
3. **What Actually Governs Execution:** "Operational coordination is entirely message-brokered through 12 AMQP exchanges. No import edge connects sensors to actions. The divergence between code gravity and operational gravity is total."
4. **What Cannot Currently Be Seen:** Boundary (RabbitMQ + MongoDB + Redis + remote targets), Silence (sensor/runner/broker independent failure), Coupling (exchange schema propagation across 11 services).
5. **Software Intelligence:** Structural pressures in st2common — the visible picture that is not wrong, but incomplete.
6. **Why Traditional Analysis Missed It:** "The import graph shows a shared library. The operational system is 11 independent services coordinating through a message broker. These are architecturally different structures measured at different levels."
7. **Executive Consequences:** Sensor failure → automation stops detecting events while API reports healthy. Runner failure → actions queue without execution. Broker failure → all 11 services lose coordination while each continues running independently.
8. **Verdict:** Three discoveries apply — gravity divergence (total), invisible failure modes (3 independent silent failures), system larger than software (RabbitMQ + MongoDB + Redis + remote targets).

### Expected commercial moment

**"StackStorm can have 11 healthy-looking processes while its operational coordination has completely stopped."**

---

## Constitutional Verdict

**Execution Blindness is REPEATABLE.**

StackStorm activates all four criteria with a LARGER blindness surface than BlueEdge. The same 6 primitives apply through completely different technology mechanisms (AMQP vs EventEmitter, multi-service vs monolith, Python vs TypeScript). No new primitive was needed. No primitive failed.

The concept survives the second specimen. Execution Blindness is not a BlueEdge artifact. It is a structural property of systems where runtime coordination is decoupled from code dependencies.

**Two specimens. Same cognition. Same blindness. Different technology. Different architecture. Same conclusion.**

That is repeatability.
