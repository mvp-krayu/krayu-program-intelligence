# Runtime Cognition Validation Matrix

Stream: PI.RUNTIME-COGNITION-VALIDATION-MATRIX.01
Date: 2026-06-06
Classification: Validation contract (no extraction, no implementation)

---

## Section 1: Validation Matrix

### RUNTIME_DEPENDENCY

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — event handlers depend on event emitter; frontend depends on WebSocket gateway; cloud depends on MQTT broker. None expressed through import edges. |
| StackStorm Prediction | 11 services depend on RabbitMQ for inter-process coordination. No import edge connects st2sensorcontainer to st2actionrunner. Coordination is message-mediated. |
| Required Evidence | At least one service pair where operational dependency exists through AMQP but no import relationship exists between the two services. |
| Validation Method | Extract AMQP exchange topology. Identify which services publish to and consume from each exchange. Compare against import graph. If services are AMQP-coupled but import-uncoupled, primitive is confirmed. |
| Pass Criteria | ≥2 service pairs with AMQP coupling and zero import coupling. |
| Fail Criteria | Every AMQP-coupled pair also has import coupling. This would mean runtime and static dependencies coincide — no invisible dependency exists. |
| Consequence If Fails | RUNTIME_DEPENDENCY is not technology-invariant. It may require in-process event systems (NestJS) rather than inter-process messaging (AMQP) to produce non-import coupling. The primitive would need to be qualified. |

### RUNTIME_COORDINATION

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — fleet-event-emitter.service.ts coordinates 53 event types across 4 handlers, mediating 8 domains through an intermediary. |
| StackStorm Prediction | 12 AMQP exchanges mediate all inter-service communication. Trigger dispatch, execution lifecycle, workflow state, sensor events — all message-mediated through intermediary exchanges. |
| Required Evidence | ≥2 AMQP exchanges with identified publishers and consumers. The exchange must act as an intermediary — publishers and consumers do not call each other directly. |
| Validation Method | Extract exchange declarations from `st2common/st2common/transport/`. Map each exchange to its publisher(s) and consumer(s). Verify the publishers and consumers do not import each other directly. |
| Pass Criteria | ≥2 exchanges functioning as coordination intermediaries with identified producer services and consumer services. |
| Fail Criteria | Exchanges exist but are not operationally load-bearing — they are used only for logging, monitoring, or optional features. Core coordination flows through direct calls. |
| Consequence If Fails | RUNTIME_COORDINATION requires re-scoping. It may only apply to systems where coordination is EXCLUSIVELY message-mediated, not partially. BlueEdge's in-process events may be a special case. |

### RUNTIME_CONCENTRATION

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — 13.3:1 event-to-handler ratio. Single WebSocket gateway for all real-time data. Single MQTT broker for all field telemetry. |
| StackStorm Prediction | All 12 exchanges route through a single RabbitMQ broker. All inter-service coordination concentrates through one messaging infrastructure. |
| Required Evidence | A measurable concentration ratio: exchanges per broker, services per broker, or message types per consumer. |
| Validation Method | Count: (a) AMQP exchanges, (b) broker endpoints, (c) services that depend on the broker. Compute concentration ratio. |
| Pass Criteria | Single broker serves ≥5 services AND ≥5 exchanges. Concentration ratio ≥5:1 on at least one axis. |
| Fail Criteria | Multiple independent brokers, each serving a small number of services. Coordination is distributed, not concentrated. |
| Consequence If Fails | RUNTIME_CONCENTRATION may be an artifact of single-broker architectures. Systems with distributed messaging (Kafka partitions, multiple RabbitMQ clusters) may not exhibit concentration. The primitive would need a distributed-coordination variant. |

### RUNTIME_BOUNDARY_EXTENSION

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — MQTT broker (mqtt.blueedge.network:8883) is external. Edge agents on NXP hardware are external. Both outside codebase. |
| StackStorm Prediction | RabbitMQ is external infrastructure (amqp://127.0.0.1:5672 from config). MongoDB is external. Redis coordination backend is external. Sensors connect to external monitoring systems. Actions execute on remote targets. |
| Required Evidence | ≥1 external infrastructure endpoint declared in configuration that the system depends on for core operational function. |
| Validation Method | Grep config files (st2.conf, config.py) for connection URLs. Verify the endpoints are not part of the codebase. Verify the system depends on them for core function (not optional features). |
| Pass Criteria | ≥2 external infrastructure dependencies that are operationally load-bearing. |
| Fail Criteria | All infrastructure is self-contained within the codebase or all external dependencies are optional/non-critical. |
| Consequence If Fails | RUNTIME_BOUNDARY_EXTENSION may be trivial — every system has a database. If the external dependencies are only standard infrastructure (database, cache) without operational coordination significance, the boundary extension is not meaningful for blindness classification. The primitive would need to distinguish "standard infrastructure" from "coordination-critical infrastructure." |

### RUNTIME_SILENCE

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — MQTT broker failure produces silence (no error signal). WebSocket gateway failure produces partial silence (backend healthy, operators dark). Cache invalidation handler failure produces silent data drift. |
| StackStorm Prediction | Sensor container failure stops all event ingestion while st2api continues responding. Action runner failure stops execution while rules engine continues queueing. RabbitMQ failure disconnects all services while each continues running independently. |
| Required Evidence | ≥1 service pair where service A's failure is not observable from service B — despite service B depending on service A's output. |
| Validation Method | Map service topology. Identify which services are consumers of which producers. For each producer-consumer pair, determine: does the consumer have a mechanism to detect producer failure? If the producer fails silently (stops publishing), does the consumer receive an error or simply receive nothing? |
| Pass Criteria | ≥1 service pair where producer failure produces silence at the consumer, not error. Specifically: sensor container failure is not observable from st2api. |
| Fail Criteria | Every service failure is observable from dependent services — through health checks, heartbeats, or error propagation. No silent failure mode exists. |
| Consequence If Fails | RUNTIME_SILENCE may require specific architectural properties (shared-nothing services with no health check coupling) rather than being a general property of multi-service systems. The primitive remains valid but its activation criteria would need tightening. |

### RUNTIME_GRAVITY (Divergence)

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — AF-001, CRITICAL. Static gravity at Platform Infrastructure (111 imports). Runtime gravity at Fleet Core Operations / Event-Driven Architecture. 3 divergent loci. |
| StackStorm Prediction | TOTAL divergence. Static gravity at st2common (245 imports — shared library). Runtime gravity at AMQP exchange layer + sensor container + action runner. Zero overlap predicted. |
| Required Evidence | Static gravity measured (from existing code graph — already available). Runtime gravity measured (from extracted AMQP topology + service topology). Divergence computed. |
| Validation Method | Compute static gravity: top-N domains/packages by inbound import count. Compute runtime gravity: top-N domains/services by exchange participation + coordination load. Compare. Count divergent loci. |
| Pass Criteria | ≥1 divergent locus — a domain/service that appears in runtime gravity but not in static gravity (or vice versa). |
| Fail Criteria | Static gravity and runtime gravity identify the same top-N domains/services. The import-heavy packages are also the AMQP-heavy services. No divergence exists. |
| Consequence If Fails | GRAVITY_DIVERGENCE may not apply to StackStorm's architecture. If st2common is both the import hub AND the AMQP coordination hub, the organization's existing understanding is correct — they are NOT blind. This would mean divergence is architecture-dependent, not universal. The primitive survives but its applicability narrows. |

### EXECUTION_BLINDNESS (Synthesis)

| Dimension | Value |
|---|---|
| BlueEdge Status | PROVEN — all 4 activation criteria met. 3 blindness classes active. Narrative mode: EXECUTION_BLINDNESS. |
| StackStorm Prediction | All 4 criteria predicted to be met. 3 blindness classes predicted. |
| Required Evidence | Pipeline-processed evidence producing: SYSTEM_CONNECTIVITY scope, ≥2 runtime conditions, proven divergence, ≥1 blindness class. |
| Validation Method | Run `determineNarrativeMode()` with StackStorm evidence. The function returns EXECUTION_BLINDNESS or STRUCTURAL_INTELLIGENCE. |
| Pass Criteria | `determineNarrativeMode()` returns `{ mode: 'EXECUTION_BLINDNESS' }` |
| Fail Criteria | `determineNarrativeMode()` returns `{ mode: 'STRUCTURAL_INTELLIGENCE' }` with a specific reason (insufficient conditions, no divergence, or no blindness class). |
| Consequence If Fails | The entire repeatability claim fails. Execution Blindness reverts from "repeatable framework" to "BlueEdge-specific discovery." The category claim cannot be made until a second specimen passes activation. |

---

## Section 2: Falsification Tests

### Risk 1: BlueEdge-specific cognition

**Could Runtime Gravity be an artifact of BlueEdge?**

BlueEdge has a specific architecture: NestJS monolith with in-process event coordination plus external edge agents. The divergence between DTO-layer import gravity and event-bus operational gravity may be a property of THIS architecture, not a general structural property.

- Likelihood: LOW. StackStorm has a completely different architecture (shared library + AMQP multi-service) and the divergence is predicted to be even larger.
- Impact: HIGH if true — gravity divergence becomes a specimen feature, not a PI capability.
- Mitigation: StackStorm validation. If divergence is total on StackStorm (zero overlap), it is clearly not a BlueEdge artifact.
- Validation: Compute both gravity axes on StackStorm. If they diverge, falsified. If they coincide, confirmed.

### Risk 2: NestJS bias

**Could EventEmitter2 have shaped the ontology?**

The EVENT_FLOW evidence class was defined from NestJS EventEmitter2 patterns. The concentration ratio (events per handler) was computed from NestJS handler decorators. The coordination concept was instantiated through in-process event subscription.

- Likelihood: MODERATE. The vocabulary (event, handler, subscription) is NestJS-native. AMQP uses different vocabulary (exchange, queue, consumer, routing key).
- Impact: MODERATE — the ontology may need vocabulary normalization, not structural change.
- Mitigation: Map NestJS concepts to AMQP equivalents. If the mapping is 1:1 (EventEmitter → Exchange, handler → consumer, subscription → queue binding), the ontology is unbiased. If the mapping requires forcing, the ontology has NestJS bias.
- Validation: During extraction, document every concept mapping. Flag any mapping that requires interpretation rather than direct translation.

### Risk 3: MQTT bias

**Could Runtime Boundary Extension be easier on MQTT than AMQP?**

BlueEdge's MQTT broker is a remote network endpoint (mqtt.blueedge.network:8883). StackStorm's RabbitMQ default config is localhost (amqp://127.0.0.1:5672). A localhost broker is technically outside the codebase but perceptually inside the infrastructure.

- Likelihood: MODERATE. A localhost endpoint feels less "boundary-extending" than a remote endpoint.
- Impact: LOW — the boundary extension is structural (broker is not a code artifact) regardless of whether it runs on localhost or a remote host. In production, StackStorm's broker is deployed separately.
- Mitigation: Use production configuration references (st2.package.conf), not development defaults. The structural dependency exists regardless of deployment location.
- Validation: Verify that the config files show production broker configuration, not just development defaults.

### Risk 4: Domain-label bias

**Could Execution Blindness require semantic business labels to become meaningful?**

BlueEdge has 17 named domains ("Fleet Core Operations," "Edge Data Acquisition"). The EIR narrative says "Fleet Core Operations carries operational gravity." StackStorm has 57 unnamed clusters. The narrative would say "st2reactor carries operational gravity" — technically correct, commercially weaker.

- Likelihood: HIGH. Domain labels dramatically affect narrative quality.
- Impact: MODERATE for validation (the primitive works without labels). HIGH for commercial demo (the narrative is weak without labels).
- Mitigation: Use service names as domain labels (st2api, st2reactor, st2actions, st2sensorcontainer). These are meaningful within StackStorm's domain. They are not "business labels" but they are comprehensible.
- Validation: This risk does not invalidate the cognition. It limits the commercial quality of the StackStorm demo. Accept this limitation — StackStorm is a proof specimen, not a demo specimen.

### Risk 5: Specimen maturity bias

**Could StackStorm fail because the specimen is immature?**

BlueEdge went through genesis_e2e_03 — full pipeline processing, domain naming, semantic backing qualification. StackStorm has a single static run with unnamed clusters. If StackStorm fails validation, is the failure in the cognition or in the specimen preparation?

- Likelihood: MODERATE. Specimen immaturity could mask valid cognition or amplify false cognition.
- Impact: HIGH — an ambiguous failure would be worse than a clean failure.
- Mitigation: Before declaring failure, verify that the specimen has minimum required maturity: (a) static code graph exists (YES), (b) runtime evidence artifacts exist (the extraction step), (c) domain/service identification is sufficient for gravity computation (service names from systemd). If these minimums are met and validation still fails, the failure is in the cognition, not the specimen.
- Validation: Define specimen maturity prerequisites BEFORE extraction. Do not start extraction until prerequisites are confirmed.

---

## Section 3: Adapter Architecture Validation

### Challenging the model: "Evidence classes are invariant. Extractors are technology-specific."

**Is EVENT_FLOW truly technology-invariant?**

EVENT_FLOW captures event emission and handler binding. In NestJS: decorators + EventEmitter2. In StackStorm: kombu Exchange + publish calls + queue consumers.

The structural concept is invariant: "producer emits, intermediary routes, consumer handles." The extraction pattern is completely different. The output schema can be identical: `{ event_type, producer, consumer, intermediary }`.

Verdict: **INVARIANT as a class. VARIANT in extraction.**

**Is MESSAGE_BROKER_TOPOLOGY truly technology-invariant?**

MQTT has topics, publishers, subscribers, QoS levels. AMQP has exchanges, queues, bindings, routing keys. These are structurally different protocols.

But the cognition question is the same: "how many coordination paths route through how many broker endpoints?" The topology shape differs. The concentration measurement is identical.

Verdict: **INVARIANT as a cognition input. VARIANT in topology shape.** The evidence schema may need protocol-aware fields (exchange type, routing key for AMQP; topic pattern, QoS for MQTT) but the cognition primitives consume only: endpoint count, coordination path count, concentration ratio.

**Is SERVICE_TOPOLOGY universal?**

BlueEdge: monolith (1 service) + edge agents (systemd). StackStorm: 11 systemd services. Django: typically 1 process + Celery workers. Go: variable.

Service topology is not universal — monoliths don't have it. But the ABSENCE of service topology is itself informative: a monolith has concentration-by-design (everything in one process).

Verdict: **UNIVERSAL as a question ("how many independent processes?"). NOT UNIVERSAL as evidence (monoliths produce 1-entry topology).** The evidence class exists but may have trivial output for monolithic systems.

**Is SENSOR_TRIGGER_ACTION_FLOW a subtype of ASYNC_COORDINATION?**

StackStorm's sensor→trigger→rule→action chain is a specific automation pattern. The structural properties are: external event ingestion (sensor), pattern matching (rule), and execution dispatch (action). These map to: event source, routing logic, event consumer.

Verdict: **YES — it is a subtype.** The vocabulary differs but the structural pattern is identical to "event producer → routing intermediary → event consumer." No new evidence class needed. The extraction is StackStorm-specific. The cognition is generic.

### Evidence Class Classification

| Class | Universal | Specimen-Specific | Notes |
|---|---|---|---|
| STATIC_IMPORT_GRAPH | UNIVERSAL | — | Every language has imports |
| EVENT_FLOW | UNIVERSAL for event-driven systems | — | Not present in call-graph-dominant systems |
| MESSAGE_BROKER_TOPOLOGY | UNIVERSAL for message-brokered systems | — | Not present in direct-call systems |
| SERVICE_TOPOLOGY | UNIVERSAL as question | Trivial for monoliths | 1-entry result for monoliths is still valid data |
| EXTERNAL_ENDPOINT_FLOW | UNIVERSAL | — | Every system has external dependencies |
| API_BOUNDARY | UNIVERSAL for services with APIs | — | Not present in CLI tools, libraries |
| DI_MODULE_GRAPH | FRAMEWORK-SPECIFIC | NestJS, Spring, Angular | Not present in Python, Go |
| WEBSOCKET_FLOW | PATTERN-SPECIFIC | — | Only present in real-time systems |
| SENSOR_TRIGGER_ACTION_FLOW | SUBTYPE of EVENT_FLOW | StackStorm-specific vocabulary | Maps to generic async coordination |

**Candidate future subdivisions:**
- JOB_QUEUE_FLOW (Celery, Sidekiq, Bull) — subtype of ASYNC_COORDINATION with durable queue semantics
- DATABASE_DEPENDENCY_FLOW (ORM relationships) — different from EXTERNAL_ENDPOINT_FLOW because it captures data model coupling, not just endpoint dependency
- MIDDLEWARE_CHAIN (Django, Express) — request processing pipeline, potentially relevant for propagation analysis

None of these are needed for StackStorm validation. They are noted for future reference.

---

## Section 4: What Success Actually Looks Like

### Ranked success criteria

**1. (ESSENTIAL) `determineNarrativeMode()` returns EXECUTION_BLINDNESS**

This is the single gate. If the pipeline processes StackStorm runtime evidence and the activation function returns EXECUTION_BLINDNESS, the framework is specimen-independent. Everything else is enrichment.

**2. (HIGH) Runtime Gravity Divergence is measurable and total**

If static gravity (st2common) and runtime gravity (AMQP exchanges) produce completely non-overlapping top-N lists, the divergence is total — stronger than BlueEdge's partial divergence. This would prove the primitive at maximum strength.

**3. (MODERATE) THORR answers meaningful questions**

If THORR can answer "Where does operational gravity reside?" on StackStorm and names AMQP exchanges rather than st2common, the projection surface transfers. Meaningful requires structurally correct answers, not commercially polished answers. Service names (st2reactor, st2actionrunner) are acceptable in place of business labels.

**4. (MODERATE) LENS renders meaningful projections**

If the Execution Blindness modal populates with StackStorm blindness classes and the Gravity Divergence modal shows st2common vs AMQP exchanges, the visual projection transfers.

**5. (LOWER) The cognition contract survives complete specimen transfer**

If no primitive required modification, no evidence class required addition, and no blindness class required redefinition — the contract is specimen-independent. This is the constitutional validation.

### What would constitute successful validation of Program Intelligence itself?

"StackStorm activates Execution Blindness through the same pipeline, same cognition primitives, same activation contract, and same consumer projection as BlueEdge — with different technology, different architecture, and different evidence extractors."

That statement, if true, proves PI is a structural measurement system, not a NestJS analysis tool.

### What outcome would force revisiting the cognition model?

"`determineNarrativeMode()` returns STRUCTURAL_INTELLIGENCE because StackStorm's static and runtime gravity coincide."

If st2common is both the import hub AND the AMQP coordination hub — meaning the organization's existing understanding of StackStorm is correct — then divergence does not exist for this specimen. The cognition model is not wrong, but its applicability is narrower than claimed. Execution Blindness would be architecture-dependent rather than technology-dependent. That distinction matters for category claims.

---

## Section 5: Recommendation

### Is StackStorm still the highest-value next validation?

**YES.** No other available specimen provides the combination of: maximum technology distance from BlueEdge, maximum predicted divergence, explicitly declared runtime coordination (extractable), and multi-service architecture that maximizes the probability of all primitives activating.

### What single result would increase confidence most?

`determineNarrativeMode({ ... StackStorm evidence ... })` returning `EXECUTION_BLINDNESS` with `divergent_domain_count > 0` and `blindness_classes: ['BOUNDARY', 'SILENCE', 'COUPLING']`.

That single function call, returning that single result, would prove: the activation contract works on non-BlueEdge evidence, the primitives are technology-invariant, and the blindness taxonomy is architecture-dependent (not specimen-dependent).

### What single result would damage confidence most?

Gravity divergence = 0. Static gravity and runtime gravity identify the same services as central. This would mean StackStorm's architecture is transparent to import analysis — the import graph correctly reflects the operational coordination structure. If true, the organization is NOT blind. The cognition model would remain valid but the category claim (Execution Blindness as a repeatable phenomenon) would be weakened to "architecture-conditional, not universal."

### Formal acceptance gate before THORR/LENS wiring

`determineNarrativeMode()` must return `EXECUTION_BLINDNESS` from pipeline-processed StackStorm evidence. No other gate. If this passes, wire THORR and LENS. If this fails, investigate why before wiring anything.

### The statement that allows "specimen-independent"

**"Execution Blindness activated on StackStorm (Python/AMQP/multi-service) using the same cognition primitives, same activation contract, and same `determineNarrativeMode()` function that activated on BlueEdge (TypeScript/NestJS/monolith+edge) — with no modification to the cognition contract and no new evidence class required."**

If that statement is true after pipeline verification, Execution Blindness is specimen-independent.
