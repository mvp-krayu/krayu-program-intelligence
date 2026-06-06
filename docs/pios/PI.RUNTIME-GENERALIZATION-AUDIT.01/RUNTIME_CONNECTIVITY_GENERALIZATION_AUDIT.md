# Runtime Connectivity Generalization Audit

Stream: PI.RUNTIME-GENERALIZATION-AUDIT.01
Date: 2026-06-06
Classification: Generalization audit (no implementation)

---

## 1. Current BlueEdge Runtime Evidence

The runtime connectivity capability was proven through 6 evidence artifacts:

| Artifact | Technology | Evidence Type |
|---|---|---|
| event_flow_graph.json | NestJS EventEmitter2 | 53 event types, 17 emitters, 4 handlers |
| mqtt_topic_graph.json | MQTT v5 (AWS IoT) | Single broker, 4 topic channels, 2 edge agents |
| websocket_flow_graph.json | Socket.IO (@WebSocketGateway) | 12 streams, 6 channels, 16 consumers |
| api_boundary_graph.json | NestJS REST controllers | API endpoint inventory |
| di_module_graph.json | NestJS @Module/@Injectable | 2 global modules, 5 providers |
| system_connectivity_graph.json | Composite | Cross-layer connectivity edges |

Extraction method: FORENSIC_GREP — manual regex-based extraction from canonical repository source files.

---

## 2. What Is Specimen-Specific

These items are BlueEdge-specific and MUST NOT be generalized:

| Item | Why Specimen-Specific |
|---|---|
| mqtt.blueedge.network:8883 | Specific broker endpoint |
| NXP i.MX 95 / systemd services | Specific edge hardware |
| FleetGateway / FleetEventEmitter | Specific component names |
| 53 event types / 4 handlers | Specific counts |
| sensor-collector.py / hasi-bridge.py | Specific edge agent files |
| Fleet Core Operations / Edge Data Acquisition | Specific semantic domains |
| 13.3:1 event concentration ratio | Specific measurement |

These are evidence values. They support the BlueEdge proof case. They are not architectural primitives.

---

## 3. What Is Generalizable

These concepts survive specimen change:

| Concept | Why Generalizable |
|---|---|
| External runtime dependency | Any system can depend on infrastructure outside the codebase (broker, database, external API, cloud service) |
| Async coordination backbone | Any event-driven system has a coordination layer invisible to import analysis |
| Runtime fanout concentration | The ratio of event/message types to handler/consumer count is measurable in any async system |
| Silent failure mode | Any dependency that fails without producing an internal error signal creates silence blindness |
| Boundary expansion | Any system with external infrastructure, edge devices, or managed services has a boundary larger than the codebase |
| Static/runtime gravity divergence | Any system where runtime coordination uses different paths than code imports can exhibit divergence |
| Operational dependency chain | Business capability → runtime component → evidence is a universal framing |

These are structural properties, not technology features. They are detectable through different extraction mechanisms but the concepts are invariant.

---

## 4. Runtime Evidence Classes

The 6 BlueEdge evidence layers map to general evidence classes:

| BlueEdge Layer | General Evidence Class | Description | Technology-Invariant? |
|---|---|---|---|
| STATIC_IMPORT | Code Dependency Graph | Import/require/include relationships | YES — every language has imports |
| EVENT_FLOW | Async Event Coordination | Event emission, subscription, handler binding | YES — pattern exists in all event-driven systems |
| MQTT_TOPIC_FLOW | Message Broker Topology | Topic/queue/exchange structure, publisher/subscriber binding | YES — any message-brokered system |
| WEBSOCKET_FLOW | Real-Time Channel Topology | Persistent connection channels, pub/sub rooms, stream routing | YES — any real-time system |
| API_BOUNDARY | Service Interface Graph | HTTP/gRPC/GraphQL endpoint inventory and routing | YES — any service with external API |
| DI_MODULE_GRAPH | Framework Wiring Graph | Dependency injection, module registration, provider binding | PARTIALLY — framework-specific pattern |

**Additional general evidence classes not yet extracted:**

| Evidence Class | Description | Applicable When |
|---|---|---|
| TASK_QUEUE_FLOW | Background job/task routing (Celery, Sidekiq, Bull, RQ) | System uses async task processing |
| DATABASE_RELATIONSHIP | ORM model relationships, foreign keys, migration topology | System has relational data model |
| CONFIG_DRIVEN_INTEGRATION | External service endpoints declared in config/env | System integrates with external services |
| DEPLOYMENT_TOPOLOGY | Service-to-service relationships from k8s/docker-compose/IaC | Infrastructure-as-code exists |
| MIDDLEWARE_CHAIN | Request processing pipeline (Django middleware, Express middleware) | Framework has middleware pattern |

---

## 5. Technology Family Matrix

### A. TypeScript / Node / NestJS

| Evidence Class | Extractable? | Extraction Method | Blindness Classes Supported |
|---|---|---|---|
| Code Dependency Graph | YES — proven | AST / import analysis | — |
| Async Event Coordination | YES — proven | EventEmitter2 decorator/handler grep | Coupling, Silence |
| Message Broker Topology | YES — proven | MQTT client config grep | Boundary, Silence |
| Real-Time Channel Topology | YES — proven | @WebSocketGateway decorator grep | Silence |
| Service Interface Graph | YES — proven | @Controller/@Get/@Post grep | — |
| Framework Wiring Graph | YES — proven | @Module/@Injectable grep | — |
| Task Queue Flow | YES — not yet extracted | Bull/BullMQ queue definition grep | Coupling |

**Generalization risk: LOW.** This is the proven technology family.

### B. Python / Django

| Evidence Class | Extractable? | Extraction Method | Blindness Classes Supported |
|---|---|---|---|
| Code Dependency Graph | YES — proven (NetBox) | AST / import analysis | — |
| Async Event Coordination | YES — not extracted | Django signals (Signal.connect, @receiver decorators) | Coupling, Silence |
| Message Broker Topology | CONDITIONAL | If Celery/RQ broker configured — broker URL in settings.py | Boundary, Silence |
| Real-Time Channel Topology | CONDITIONAL | Django Channels (consumers.py, routing.py) — only if present | Silence |
| Service Interface Graph | YES — not extracted | urls.py → views.py mapping | — |
| Framework Wiring Graph | YES — not extracted | settings.INSTALLED_APPS, middleware ordering | — |
| Task Queue Flow | YES — not extracted | Celery @task decorators, task routing config | Coupling, Silence |
| Database Relationship | YES — not extracted | Django ORM model ForeignKey/ManyToMany declarations | — |
| Middleware Chain | YES — not extracted | settings.MIDDLEWARE ordering | — |

**Generalization risk: LOW.** Django has rich declarative patterns (signals, INSTALLED_APPS, urls.py, Celery tasks) that are grep-extractable. The extraction patterns differ from NestJS but the evidence classes map directly.

**Key difference from NestJS:** Django signals are the async coordination equivalent of NestJS EventEmitter2. Celery tasks are the async job equivalent. The patterns are different but the structural properties (coordination concentration, fanout ratio, handler surface) are identical.

### C. Python Generic (Flask, FastAPI, CLI tools)

| Evidence Class | Extractable? | Extraction Method | Blindness Classes Supported |
|---|---|---|---|
| Code Dependency Graph | YES | AST / import analysis | — |
| Async Event Coordination | CONDITIONAL | Framework-specific (blinker signals in Flask, FastAPI events) | Coupling |
| Message Broker Topology | CONDITIONAL | If broker client exists (pika, redis, kafka-python) | Boundary, Silence |
| Service Interface Graph | YES | Route decorator grep (@app.route, @router.get) | — |
| Task Queue Flow | CONDITIONAL | If Celery/RQ/Dramatiq present | Coupling, Silence |
| Config-Driven Integration | YES | Environment variable / config file grep for service URLs | Boundary |

**Generalization risk: MODERATE.** Generic Python lacks the declarative richness of Django. Event coordination may be ad-hoc (custom pub/sub, direct function calls) rather than framework-mediated. Extraction reliability depends on how conventionally the codebase is structured.

### D. Go

| Evidence Class | Extractable? | Extraction Method | Blindness Classes Supported |
|---|---|---|---|
| Code Dependency Graph | YES | Go module / package import analysis | — |
| Async Event Coordination | CONDITIONAL | Channel usage patterns, goroutine spawning | Coupling |
| Message Broker Topology | CONDITIONAL | AMQP/Kafka/NATS client initialization grep | Boundary, Silence |
| Service Interface Graph | YES | HTTP handler registration (http.HandleFunc, gin.Router, chi.Router) | — |
| gRPC Service Graph | CONDITIONAL | .proto file analysis + server registration | — |
| Config-Driven Integration | YES | Environment variable / config struct grep for service URLs | Boundary |

**Generalization risk: MODERATE.** Go's explicit concurrency (goroutines, channels) is structurally different from event emitters. Channel-based coordination is harder to extract because it's implicit in code flow rather than declared through decorators. Message broker integration follows the same patterns as other languages.

**Key difference:** Go does not have DI frameworks in the NestJS sense. Wiring is typically explicit (manual constructor injection or init functions). This makes the Framework Wiring evidence class less applicable but makes the actual wiring more visible in import analysis.

### E. Terraform / IaC

| Evidence Class | Extractable? | Extraction Method | Blindness Classes Supported |
|---|---|---|---|
| Deployment Topology | YES | Resource/module/provider analysis | Boundary |
| Message Broker Topology | YES | aws_sqs_queue, aws_sns_topic, google_pubsub_topic resources | Boundary, Silence |
| Database Relationship | YES | aws_db_instance, google_sql_database references | Boundary |
| Network Boundary | YES | VPC, subnet, security group, firewall rule analysis | Boundary |
| External Service Dependency | YES | Provider configurations, data source references | Boundary |
| IAM Binding | YES | Policy attachments, role bindings — who can access what | — |

**Generalization risk: LOW for boundary evidence.** IaC is declarative by nature — every resource, dependency, and network boundary is explicitly stated. This is the strongest source for BOUNDARY BLINDNESS evidence. It cannot provide event coordination or runtime fanout evidence (those are application-level).

**Key insight:** IaC + application code analysis together would provide the most complete boundary expansion picture. IaC tells you what infrastructure exists. Application code tells you how it's used. Neither alone is sufficient.

### F. Kubernetes / Runtime Deployment

| Evidence Class | Extractable? | Extraction Method | Blindness Classes Supported |
|---|---|---|---|
| Service Topology | YES | Service/Ingress/NetworkPolicy manifests | Boundary |
| Deployment Dependency | YES | ConfigMap/Secret references, environment variable injection | Boundary |
| Sidecar Topology | YES | Multi-container pod specifications | Coupling |
| Health/Readiness Probes | YES | Probe definitions — what the system monitors itself for | Silence (gaps in monitoring) |
| Namespace Boundary | YES | Namespace isolation, RBAC bindings | — |
| External Dependency | YES | ExternalName services, external endpoints | Boundary |

**Generalization risk: LOW.** Kubernetes manifests are highly structured and grep-extractable. The deployment topology complements application-level evidence — it shows which services exist as separate processes and how they communicate.

**Key insight for Silence Blindness:** Kubernetes probe definitions explicitly declare what the system monitors. The ABSENCE of probes for critical runtime dependencies (broker, event bus) is evidence of silence blindness — the system does not check for failures it cannot survive.

---

## 6. Execution Blindness Portability

| Blindness Class | BlueEdge Proof | Generalizable? | Condition for Portability |
|---|---|---|---|
| Boundary Blindness | MQTT broker outside codebase | YES | System has any external runtime dependency (broker, managed service, edge device, external API) |
| Silence Blindness | Broker/gateway failure produces no error | YES | System has any dependency where failure manifests as absence of data, not error signal |
| Coupling Blindness | Event bus blast radius exceeds import prediction | YES | System has async coordination where runtime fanout differs from import topology |

**Portability assessment: ALL THREE CLASSES ARE GENERAL.**

They are not NestJS features. They are not MQTT features. They are structural properties of systems with runtime coordination decoupled from import dependencies.

The evidence extraction differs per technology family. The blindness concepts do not.

---

## 7. Unsafe Claims / Guardrails

| Unsafe Claim | Why Unsafe | Guardrail |
|---|---|---|
| "All systems have execution blindness" | Synchronous call-graph-dominant systems may not | Only claim blindness when evidence proves divergence |
| "Runtime connectivity replaces static analysis" | Static analysis remains valid and necessary | Runtime EXTENDS static, never replaces |
| "Grep-based extraction is production-grade" | Forensic grep has false positive/negative risk | Qualify extraction method; AST-based is more reliable |
| "IaC analysis proves runtime behavior" | IaC declares intent, not actual runtime state | IaC evidence is deployment topology, not operational topology |
| "Framework wiring = runtime coordination" | DI registration ≠ runtime message flow | Distinguish compile-time wiring from runtime coordination |
| "All async patterns are extractable" | Ad-hoc pub/sub, dynamic dispatch, reflection-based routing may not be | State extraction confidence per evidence class |
| "Kubernetes manifests prove connectivity" | Manifests declare desired state, not actual state | Qualify as deployment topology, not operational topology |

---

## 8. Recommended General Runtime Contract

### Classification

**Runtime Connectivity is a general Program Intelligence capability (Option C) with technology-specific evidence adapters.**

It is NOT:
- A. BlueEdge-specific (the concepts generalize)
- B. TypeScript/NestJS-specific (the evidence classes map to every technology family audited)

It IS:
- C. A general capability where the structural concepts (divergence, blindness, boundary expansion) are technology-invariant, but the extraction mechanisms are technology-specific

### General Runtime Contract

```
RUNTIME EVIDENCE = {
  evidence_class: one of [CODE_DEPENDENCY, ASYNC_EVENT, MESSAGE_BROKER, REALTIME_CHANNEL, 
                          SERVICE_INTERFACE, FRAMEWORK_WIRING, TASK_QUEUE, DATABASE_RELATIONSHIP,
                          CONFIG_INTEGRATION, DEPLOYMENT_TOPOLOGY, MIDDLEWARE_CHAIN],
  extraction_method: one of [AST_ANALYSIS, DECORATOR_GREP, CONFIG_GREP, MANIFEST_PARSE, FORENSIC_GREP],
  extraction_confidence: one of [HIGH, MODERATE, LOW],
  technology_family: string,
  specimen_specific: boolean,
}

BLINDNESS_CLASS = {
  class_type: one of [BOUNDARY, SILENCE, COUPLING],
  requires_evidence: [list of evidence_class],
  technology_invariant: true,
}

DIVERGENCE_TEST = {
  static_gravity_loci: derived from CODE_DEPENDENCY,
  runtime_gravity_loci: derived from ASYNC_EVENT + MESSAGE_BROKER + REALTIME_CHANNEL + TASK_QUEUE,
  divergence: static_loci ∩ runtime_loci !== complete_overlap,
}
```

### Technology Adapter Model

Each technology family requires an adapter that:
1. Maps framework-specific patterns to general evidence classes
2. States extraction confidence per evidence class
3. Declares which blindness classes can be supported
4. Declares what cannot be inferred

The adapter does NOT change:
- The blindness taxonomy
- The divergence test
- The EIR narrative spine
- The activation contract

The adapter ONLY changes:
- What patterns to grep/parse
- What files to scan
- What confidence to assign

### Extraction Confidence Tiers

| Tier | Definition | Example |
|---|---|---|
| HIGH | Declarative, framework-enforced, AST-parseable | NestJS decorators, Django signals, Terraform resources, k8s manifests |
| MODERATE | Conventional but not enforced — depends on codebase discipline | Flask route decorators, Go HTTP handlers, config file service URLs |
| LOW | Ad-hoc, reflection-based, or dynamic — may miss patterns | Custom pub/sub, dynamic dispatch, monkey-patched handlers |

### Priority Order for Next Technology Family

| Technology | Strategic Value | Extraction Feasibility | Recommended Next |
|---|---|---|---|
| Python / Django | HIGH — large market, declarative patterns | HIGH — signals, urls, Celery, INSTALLED_APPS | **1st** |
| Terraform / IaC | HIGH — boundary evidence, unique capability | HIGH — fully declarative | **2nd** |
| Go | MODERATE — growing market | MODERATE — less declarative than Django | 3rd |
| Kubernetes | MODERATE — complements IaC | HIGH — structured manifests | 4th (combine with Terraform) |
| Python generic | MODERATE | MODERATE — ad-hoc patterns | 5th |
