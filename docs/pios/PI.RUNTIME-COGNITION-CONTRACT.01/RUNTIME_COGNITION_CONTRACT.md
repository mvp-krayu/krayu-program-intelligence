# Runtime Cognition Contract

Stream: PI.RUNTIME-COGNITION-CONTRACT.01
Date: 2026-06-06
Classification: Constitutional analysis (no implementation)

---

## 1. Why Runtime Connectivity May Be Too Low-Level

Runtime Connectivity describes HOW evidence is acquired: grep for MQTT topics, parse EventEmitter decorators, read Terraform resources. It is an extraction concept.

The BlueEdge breakthrough was not "we found MQTT topics." It was "we discovered the organization is operationally blind." The MQTT topics were evidence. The blindness was cognition.

If Runtime Connectivity is the primary concept, PI needs an adapter for every technology — MQTT adapter, Django signals adapter, Kafka adapter, SAP adapter, Salesforce adapter, Datadog adapter. The adapter list grows linearly with technology count. Each adapter has its own extraction logic, its own patterns, its own maintenance burden. The concept never stabilizes.

If the primary concept is something higher — the cognition that emerges FROM runtime evidence regardless of source — then the adapter list still grows, but the cognition contract does not. The contract defines what PI can conclude. The adapters define what PI can read. Those are different concerns at different rates of change.

---

## 2. Runtime Connectivity vs Runtime Cognition

| | Runtime Connectivity | Runtime Cognition |
|---|---|---|
| Answers | "What runtime evidence can we extract?" | "What can PI conclude about operational reality?" |
| Changes when | New technology family appears | Never (concepts are invariant) |
| Organizes | Extraction patterns | Structural conclusions |
| Example | "MQTT topic graph extracted" | "External runtime dependency detected — boundary blindness" |
| Stability | Low — grows with technology count | High — grows only with new cognition discovery |

Runtime Connectivity is the evidence layer. Runtime Cognition is the meaning layer.

PI's existing architecture already makes this distinction:

```
Evidence (40.x) → Signals (SSE) → Conditions → Consequences → Cognition → Projection
```

Runtime Connectivity is evidence. It belongs at the 40.x layer. What was missing was the cognition stage — the step where runtime evidence becomes structural conclusions about operational reality. That stage is what AF-001 through AF-005 represent. They are not connectivity findings. They are cognition objects.

---

## 3. Candidate Runtime Cognition Primitives

These are the structural conclusions PI can derive from runtime evidence, regardless of technology:

### RUNTIME_DEPENDENCY

An operational dependency exists between components that is not expressed through code import relationships.

**Evidence required:** Any runtime evidence showing component A depends on component B through a channel not visible in the import graph (event, message, WebSocket, API call, DI injection, queue, external service).

**Technology invariant:** YES. Every technology has runtime dependencies invisible to imports.

### RUNTIME_COORDINATION

Operational behavior is coordinated through a runtime mechanism (event bus, message broker, task queue, signal dispatcher) rather than through direct call chains.

**Evidence required:** Evidence of a coordination layer with multiple producers and consumers connected through an intermediary.

**Technology invariant:** YES. The pattern exists in NestJS events, Django signals, Celery tasks, Go channels, Kafka topics, AMQP exchanges, gRPC streams.

### RUNTIME_CONCENTRATION

Runtime coordination load concentrates through a narrow surface — few handlers, few brokers, few gateways serving many producers or consumers.

**Evidence required:** Measurable fanout ratio: event/message types per handler/consumer, or producer count per broker/queue.

**Technology invariant:** YES. Concentration ratio is a pure numeric property independent of technology.

### RUNTIME_BOUNDARY_EXTENSION

The operational system extends beyond the codebase to infrastructure, edge devices, external services, or managed platforms that are not represented in the code dependency graph.

**Evidence required:** Evidence of a dependency crossing the codebase boundary — external broker endpoint, edge agent, managed database, external API, cloud service.

**Technology invariant:** YES. The concept of "outside the codebase" applies to every system.

### RUNTIME_SILENCE

A runtime dependency can fail in a way that produces absence of signal rather than an error. The application continues operating without awareness that a critical input has stopped.

**Evidence required:** Evidence that a dependency's failure mode is non-observable from inside the application boundary — no error path, no health check, no fallback, no timeout that surfaces the failure.

**Technology invariant:** YES. Silent failure is a property of the dependency relationship, not the technology.

### RUNTIME_GRAVITY

The operational center of mass — where runtime coordination load concentrates — is measurable and may differ from the code center of mass.

**Evidence required:** Multiple runtime conditions (RUNTIME_DEPENDENCY, RUNTIME_COORDINATION, RUNTIME_CONCENTRATION) converging on specific domains/components, comparable to static gravity measurement.

**Technology invariant:** YES. Gravity is a structural property computed from condition convergence.

---

## 4. Runtime Evidence Taxonomy

Evidence is what PI reads. Cognition is what PI concludes. Evidence feeds cognition through the existing signal → condition → consequence chain.

| Evidence Category | What PI Reads | Examples |
|---|---|---|
| ASYNC_COORDINATION | Event/signal/message emission and handling bindings | NestJS EventEmitter, Django signals, Go channels, Celery tasks |
| MESSAGE_TOPOLOGY | Broker/queue/exchange structure, topic routing, publisher/subscriber bindings | MQTT, Kafka, RabbitMQ, SQS, Google Pub/Sub |
| REALTIME_CHANNELS | Persistent connection channel definitions and routing | WebSocket, Socket.IO, gRPC streams, SSE |
| SERVICE_INTERFACE | API endpoint declarations and inter-service call paths | REST controllers, gRPC proto, GraphQL schema |
| FRAMEWORK_WIRING | DI container, module registration, provider binding | NestJS modules, Spring beans, Django INSTALLED_APPS |
| TASK_PROCESSING | Background job definitions, queue routing, worker binding | Celery, Sidekiq, Bull, Dramatiq |
| DEPLOYMENT_TOPOLOGY | Service-to-service relationships from infrastructure declarations | Terraform, Kubernetes, docker-compose |
| EXTERNAL_DEPENDENCY | References to infrastructure outside the codebase | Broker URLs, database endpoints, API keys, service URLs |

This is a finite taxonomy. New technologies produce evidence in these categories — they do not create new categories. Kafka produces MESSAGE_TOPOLOGY evidence. Celery produces TASK_PROCESSING evidence. SAP landscape exports produce DEPLOYMENT_TOPOLOGY + EXTERNAL_DEPENDENCY evidence. None require a new evidence category.

---

## 5. Runtime Blindness Taxonomy

Blindness classes are cognition conclusions derived from combinations of runtime cognition primitives:

| Blindness Class | Required Primitives | What It Means |
|---|---|---|
| BOUNDARY | RUNTIME_BOUNDARY_EXTENSION | The organization cannot see a critical dependency because it exists outside the software they analyze |
| SILENCE | RUNTIME_SILENCE + RUNTIME_DEPENDENCY | The organization cannot detect a failure because it produces no observable signal inside the application |
| COUPLING | RUNTIME_CONCENTRATION + RUNTIME_COORDINATION | The organization underestimates blast radius because runtime coordination couples more components than import analysis shows |
| GRAVITY_DIVERGENCE | RUNTIME_GRAVITY ≠ STATIC_GRAVITY | The organization targets the wrong region because static analysis points to a different center of mass than runtime analysis |

These four classes are exhaustive for the current evidence. They are technology-invariant. They may expand if new structural properties are discovered — but expansion requires evidence of a genuinely new blindness type, not a new technology.

---

## 6. Minimal Runtime Cognition Contract

For PI to claim Runtime Cognition on a specimen, the following minimum must be met:

### Minimum Evidence

At least ONE evidence category beyond CODE_DEPENDENCY (STATIC_IMPORT) must be measured with MODERATE or higher extraction confidence.

### Minimum Cognition

At least ONE runtime cognition primitive must be derivable from the evidence:
- RUNTIME_DEPENDENCY (requires any runtime evidence showing non-import coupling)
- RUNTIME_COORDINATION (requires ASYNC_COORDINATION or MESSAGE_TOPOLOGY or TASK_PROCESSING)
- RUNTIME_BOUNDARY_EXTENSION (requires EXTERNAL_DEPENDENCY or DEPLOYMENT_TOPOLOGY)

### Minimum Blindness Claim

NO blindness class may be claimed without:
1. The required primitives being evidenced (not inferred)
2. The divergence test passing (for GRAVITY_DIVERGENCE)
3. The silence test passing (for SILENCE — evidence that failure produces no internal signal)

### Verdict Scope

| Evidence Count | Verdict Scope |
|---|---|
| 1 layer (STATIC_IMPORT only) | CODE_CONNECTIVITY |
| 2-3 layers | PARTIAL_CONNECTIVITY |
| 4+ layers | SYSTEM_CONNECTIVITY |

EXECUTION_BLINDNESS narrative mode requires SYSTEM_CONNECTIVITY. Partial connectivity may surface individual runtime findings but does not support the blindness narrative.

---

## 7. Evidence Sufficiency Rules

| Claim | Required Evidence | Sufficient Evidence | Insufficient Evidence |
|---|---|---|---|
| "Runtime dependency exists" | One non-import coupling measured | Event handler, message subscription, API call, DI injection | Configuration comment, documentation reference, team knowledge |
| "Boundary extends beyond codebase" | One external dependency measured | Broker URL, external API endpoint, edge device reference, IaC resource | "The team says there's an external service" |
| "Silent failure possible" | Dependency + no observable error path | Dependency with no health check, no timeout, no error handler | Theoretical failure mode without measured dependency |
| "Gravity diverges" | Static gravity AND runtime gravity measured | Both gravity computations produce different top-N domain lists | Only one side measured; divergence assumed |
| "Execution blindness" | All four activation criteria met | SYSTEM_CONNECTIVITY + ≥2 runtime conditions + divergence + ≥1 blindness class | Partial evidence with narrative assumption |

---

## 8. Technology Independence Assessment

| Question | Answer |
|---|---|
| Do cognition primitives change per technology? | NO |
| Do evidence categories change per technology? | NO — new technologies map to existing categories |
| Do blindness classes change per technology? | NO |
| Does the divergence test change per technology? | NO |
| Does the EIR narrative spine change per technology? | NO |
| Does the activation contract change per technology? | NO |
| What changes per technology? | ONLY: which patterns to grep, which files to scan, which decorators/configs to parse |

The cognition contract is fully technology-independent. The extraction layer is fully technology-dependent. These are separated by the evidence taxonomy — extraction produces evidence objects in the taxonomy, cognition consumes them without knowing the source technology.

---

## 9. Adapter Necessity Assessment

### Do adapters need to exist?

YES — something must read NestJS decorators differently from Django signals differently from Terraform resources. The extraction logic is inherently technology-specific.

### Are adapters the primary architectural concept?

NO. Adapters are evidence acquisition mechanisms. They sit below the cognition contract. They are implementation details of the 40.x evidence layer, not architectural concepts of the cognition layer.

### What is the correct architectural hierarchy?

```
Runtime Cognition Contract (constitutional — invariant)
  ├── Cognition Primitives (RUNTIME_DEPENDENCY, RUNTIME_COORDINATION, etc.)
  ├── Blindness Taxonomy (BOUNDARY, SILENCE, COUPLING, GRAVITY_DIVERGENCE)
  ├── Activation Contract (SYSTEM_CONNECTIVITY + divergence + blindness class)
  └── Evidence Taxonomy (ASYNC_COORDINATION, MESSAGE_TOPOLOGY, etc.)
        └── Technology Adapters (extraction mechanisms — implementation layer)
              ├── nestjs-adapter (EventEmitter, @WebSocketGateway, @Module)
              ├── django-adapter (signals, urls, Celery, INSTALLED_APPS)
              ├── terraform-adapter (resources, modules, providers)
              └── ... (grows with technology count)
```

Adapters are LEAF NODES. The cognition contract is the ROOT. Adding a new adapter does not change the contract. It only provides new evidence that the contract already knows how to consume.

### The SAP/Salesforce/Datadog test

A SAP landscape export produces:
- EXTERNAL_DEPENDENCY evidence (which systems SAP connects to)
- DEPLOYMENT_TOPOLOGY evidence (which modules are deployed where)

These map to existing evidence categories. The cognition contract derives RUNTIME_BOUNDARY_EXTENSION and potentially BOUNDARY blindness from them. No new cognition primitive is needed. No new blindness class is needed. The SAP "adapter" is a parser that produces evidence objects — nothing more.

The same applies to Salesforce topology, Datadog traces, Kafka cluster metadata, AWS architecture inventory. Each produces evidence in existing categories. The cognition contract consumes them identically.

---

## 10. Constitutional Recommendation

**Runtime Cognition is the primary architectural concept. Adapters are evidence acquisition mechanisms.**

This is Option B from the mission brief — and it survives constitutional analysis because:

1. **Stability test:** The cognition contract does not change when a new technology appears. Only the adapter layer changes. This means the contract is at the right abstraction level.

2. **Completeness test:** The six cognition primitives and four blindness classes are sufficient to describe every runtime finding from BlueEdge (AF-001 through AF-005). No finding requires a concept outside the taxonomy.

3. **Portability test:** The primitives map to every technology family audited (NestJS, Django, Go, Terraform, Kubernetes) without technology-specific modification. The evidence taxonomy absorbs new sources without expanding.

4. **Precedent test:** PI already separates evidence (40.x) from cognition (PICR/PICP). Runtime Cognition follows the same separation. It is constitutionally consistent.

5. **Commercial test:** "Program Intelligence detects Execution Blindness" is a technology-invariant statement. "Program Intelligence has a NestJS adapter" is not. The commercial value lives at the cognition level, not the adapter level.

### What this means operationally

- **CLAUDE.md:** Runtime Cognition primitives and blindness taxonomy should be constitutional (not the adapter list)
- **Extraction:** Adapters are 40.x pipeline components, not architectural primitives
- **EIR:** The narrative spine references cognition primitives and blindness classes, never adapter names or technology-specific extraction patterns
- **THORR:** Answer contracts reference evidence classes and cognition primitives, not extraction mechanisms
- **New technology onboarding:** Write an adapter that produces evidence in the taxonomy → cognition contract handles the rest automatically
