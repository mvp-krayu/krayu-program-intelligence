# Runtime Cognition Adapter Strategy

Stream: PI.RUNTIME-COGNITION-ADAPTER-STRATEGY.01
Date: 2026-06-06
Classification: Advisory / architectural planning (no implementation)

---

## Section 1: Current Specimen Position

| Dimension | BlueEdge | StackStorm |
|---|---|---|
| Static evidence | COMPLETE — code graph, 680 files, 2,139 edges | COMPLETE — code graph, 1,333 files, 4,006 edges |
| Runtime evidence | COMPLETE — 6 JSON artifacts extracted | NONE — source patterns observed, no artifacts produced |
| Domain maturity | HIGH — 17 named domains, 5 clusters, business labels | LOW — 57 unnamed clusters, no domain labels |
| THORR readiness | LIVE — all corridors validated, OPERATIONAL_GRAVITY bundle active | NOT READY — would produce CODE_CONNECTIVITY only |
| LENS readiness | LIVE — Execution Blindness + Gravity Divergence modals render | NOT READY — no runtime data to project |
| EIR readiness | LIVE — 8-chapter EXECUTION_BLINDNESS mode, 8.8/10 | NOT READY — would produce MODE A (structural) only |
| Execution Blindness | ACTIVE — all 4 activation criteria met | PREDICTED — primitives observed in source, pipeline not run |
| Risk of cut-over | NONE if protected | N/A — nothing to cut over to yet |

**BlueEdge = commercial reference specimen.** Must remain safe, default, restorable at all times. It is the specimen used for customer demos and advisory sessions.

**StackStorm = repeatability proof specimen.** Its purpose is to prove the framework produces discoveries on a second technology family. It does not need to be demo-ready. It needs to be pipeline-proven.

---

## Section 2: What StackStorm Actually Tests

### What StackStorm tests that BlueEdge does NOT:

| Test | Why BlueEdge Cannot Test This |
|---|---|
| Python runtime extraction | BlueEdge is TypeScript/NestJS |
| AMQP/RabbitMQ topology (not MQTT) | BlueEdge uses MQTT — different broker protocol, different topology shape |
| Multi-service process architecture | BlueEdge is a monolith with edge agents. StackStorm is 11 independent services. |
| Shared-library-dominant static gravity | BlueEdge's static gravity is in a DTO/guard layer. StackStorm's is in a shared library (st2common). Different gravity shape. |
| TOTAL gravity divergence | BlueEdge divergence is partial (3/8 loci). StackStorm divergence is predicted to be total (zero overlap). |
| Non-decorator runtime coordination | NestJS uses decorators (@WebSocketGateway, @Injectable). StackStorm uses kombu Exchange/Queue objects. Different extraction pattern. |
| Sensor/trigger/action runtime model | BlueEdge has no equivalent — this is a StackStorm-specific coordination pattern that maps to ASYNC_COORDINATION but through a different mechanism. |
| Open-source specimen | BlueEdge is a private codebase. StackStorm is public. Proves PI works on publicly available code. |

### Is StackStorm a good repeatability specimen?

**YES — it is the best available specimen for this purpose.** Reasons:

1. Maximum technology distance from BlueEdge (Python vs TypeScript, AMQP vs MQTT, multi-service vs monolith)
2. Maximum predicted divergence (total, not partial)
3. Maximum predicted blindness surface (3 blindness classes, larger than BlueEdge)
4. Explicitly declared runtime coordination (kombu Exchange/Queue objects are highly extractable)
5. Proves the cognition contract is technology-invariant, not NestJS-specific

---

## Section 3: The Adapter Question

### How many adapters are we likely to need?

The answer depends on which abstraction layer we're counting at.

### Layer 1: Static Language Extractors

These already exist. The 40.3s code graph pipeline handles Python (NetBox, StackStorm, FastAPI) and TypeScript (BlueEdge). Adding a new language requires a new static extractor. This is NOT a runtime cognition concern — it is a 40.x pipeline concern.

**Count: one per language family. Currently 2 (Python, TypeScript). Not relevant to this strategy.**

### Layer 2: Runtime Evidence Extractors

These produce the JSON artifacts that runtime cognition consumes. They are the actual "adapters" in question.

The critical distinction: **runtime extractors are NOT one-per-technology. They are one-per-evidence-pattern.**

BlueEdge's event_flow_graph.json extracts EventEmitter2 decorators. StackStorm's equivalent extracts kombu Exchange/Queue declarations. Both produce EVENT_FLOW/MESSAGE_TOPOLOGY evidence. The extractor is different. The output schema is the same.

**Count: one per (evidence_class × extraction_pattern) combination. Not one per technology.**

### Layer 3: Domain Labeling / Semantic Registry

This is the maturation layer — assigning business labels, cluster names, and domain semantics. BlueEdge has 17 named domains. StackStorm has 57 unnamed clusters.

This layer is NOT technology-specific. It is specimen-specific. Every specimen needs domain labeling. The labeling process may be partly automated (from package/module names) or partly manual (business context).

**Count: one process, applied per specimen. Not an adapter.**

### Layer 4: Evidence Normalization

This is already defined by the Runtime Cognition Contract. All evidence enters through 8 canonical categories. The normalization is the contract itself — extractors produce evidence objects that conform to the schema. No additional adapter needed.

**Count: zero. The contract IS the normalization layer.**

### Layer 5: Consumer Projection

THORR, LENS, EIR consume cognition objects, not raw evidence. They are evidence-class-agnostic by design. No adapter needed per technology — the consumers project whatever cognition the pipeline produces.

**Count: zero. Consumers are technology-invariant.**

### Actual adapter count needed

For StackStorm specifically: **3-5 evidence extractors** (AMQP exchange topology, service topology from systemd, sensor/trigger/action flow, external dependency config, optionally API boundary). Each produces a JSON artifact in the canonical schema.

For the general strategy: **one extractor per evidence pattern, organized by evidence class.** The evidence class inventory (Section 4) determines the total extractor count across all technology families.

---

## Section 4: Evidence Class First Model

| Evidence Class | What It Captures | BlueEdge | StackStorm | Extractor Type |
|---|---|---|---|---|
| STATIC_IMPORT_GRAPH | Code dependency topology | ✓ (40.3s) | ✓ (40.3s) | Language-specific AST parser. Already exists. |
| EVENT_FLOW | Event emission, subscription, handler binding | ✓ (EventEmitter2 decorators) | ✓ (kombu Exchange publish/subscribe) | Pattern-specific grep. Different patterns per framework, same output schema. |
| MESSAGE_BROKER_TOPOLOGY | Broker/exchange/queue structure, publisher/subscriber binding | ✓ (MQTT topics) | ✓ (AMQP exchanges, 12 declared) | Config + code grep. Different protocols (MQTT vs AMQP), same structural concept. |
| WEBSOCKET_FLOW | Persistent connection channels, stream routing | ✓ (Socket.IO gateway) | △ (st2stream service — SSE, not WebSocket) | Framework-specific. May not exist in all specimens. |
| API_BOUNDARY | HTTP/gRPC endpoint inventory | ✓ (NestJS controllers) | ✓ (st2api REST endpoints) | Framework-specific decorator/route grep. |
| DI_MODULE_GRAPH | Dependency injection, module registration | ✓ (NestJS @Module/@Injectable) | ✗ (no DI framework — Python manual wiring) | Framework-specific. Not applicable to all technologies. |
| SERVICE_TOPOLOGY | Independent process/service declarations | △ (monolith + edge agents) | ✓ (11 systemd services) | Deployment manifest parsing (systemd, docker-compose, k8s). Pattern-specific. |
| SENSOR_TRIGGER_ACTION_FLOW | External event → rule → action chain | ✗ (not applicable) | ✓ (StackStorm-specific) | Framework-specific. StackStorm has this; most systems don't. |
| JOB_QUEUE_FLOW | Background task definitions, queue routing | ✗ (not present in BlueEdge) | ✗ (StackStorm uses AMQP, not job queues) | Framework-specific (Celery, Sidekiq, Bull). Future evidence class. |
| EXTERNAL_ENDPOINT_FLOW | References to external services in config | ✓ (MQTT broker URL) | ✓ (RabbitMQ URL, MongoDB, Redis) | Config grep. Technology-invariant pattern. |

### Technology-specific vs pattern-specific:

| Characteristic | Technology-Specific | Pattern-Specific |
|---|---|---|
| EventEmitter2 decorators | YES (NestJS) | — |
| kombu Exchange declarations | YES (Python/kombu) | — |
| Event emission + subscription binding | — | YES (any event-driven system) |
| MQTT topic configuration | YES (MQTT protocol) | — |
| AMQP exchange declarations | YES (AMQP protocol) | — |
| Message broker topology | — | YES (any message-brokered system) |
| systemd service files | YES (Linux systemd) | — |
| Process independence topology | — | YES (any multi-service system) |

**Conclusion:** Evidence CLASSES are pattern-specific (technology-invariant). Evidence EXTRACTORS are technology-specific (different grep patterns per framework). The architecture should separate the class definition (invariant) from the extractor implementation (per-framework).

---

## Section 5: BlueEdge vs StackStorm Adapter Delta

| BlueEdge Evidence | StackStorm Equivalent | Equivalent? | New Evidence Class? | Extraction Difficulty | Cognition Value |
|---|---|---|---|---|---|
| event_flow_graph.json (EventEmitter2) | AMQP exchange topology (kombu Exchange/publish) | PARTIAL — different mechanism, same concept | NO — maps to EVENT_FLOW + MESSAGE_BROKER_TOPOLOGY | MODERATE — exchanges are explicitly declared but pub/sub binding requires tracing through transport modules | HIGH — this is the operational backbone |
| mqtt_topic_graph.json | RabbitMQ exchange/queue/routing topology | PARTIAL — AMQP is richer than MQTT (exchanges, routing keys, queue bindings) | NO — maps to MESSAGE_BROKER_TOPOLOGY | LOW — exchanges and queues are explicitly declared with kombu | HIGH — the broker IS the coordination mechanism |
| websocket_flow_graph.json | st2stream SSE service (if present) | WEAK — StackStorm uses SSE for streaming, not WebSocket | NO — maps to same REALTIME_CHANNELS class | LOW — if st2stream exists as a service, its output can be characterized | MODERATE — streaming is present but less central than in BlueEdge |
| di_module_graph.json | No DI framework equivalent | NO EQUIVALENT — Python StackStorm does not use DI containers | NO — DI_MODULE_GRAPH does not apply | N/A | LOW — StackStorm wiring is explicit import, not injection |
| api_boundary_graph.json | st2api REST endpoint inventory | YES — both are REST API surfaces | NO — same API_BOUNDARY class | LOW — REST route declarations are grep-extractable | MODERATE |
| system_connectivity_graph.json | Service topology from systemd + AMQP exchange mapping | PARTIAL — BlueEdge's connectivity graph is cross-layer composite. StackStorm equivalent requires combining service topology + exchange topology | NO — composite evidence, same concept | MODERATE — requires combining two sources | HIGH — the composite IS the system connectivity |

### New evidence that StackStorm has and BlueEdge does not:

| Evidence | Why New | Maps to Evidence Class |
|---|---|---|
| 11 systemd service declarations | BlueEdge is a monolith. StackStorm has explicit multi-service process independence. | SERVICE_TOPOLOGY (new for PI, not new as a concept) |
| Sensor → Trigger → Rule → Action chain | StackStorm-specific automation flow. No BlueEdge equivalent. | SENSOR_TRIGGER_ACTION_FLOW (new evidence class, but structurally maps to ASYNC_COORDINATION) |
| 3 external infrastructure dependencies (RabbitMQ + MongoDB + Redis) | BlueEdge has 1 (MQTT broker). StackStorm has 3. | EXTERNAL_ENDPOINT_FLOW (same class, more instances) |

**New evidence class required?** NO. SENSOR_TRIGGER_ACTION_FLOW is a StackStorm-specific instance of ASYNC_COORDINATION. The trigger→rule→action chain is an event coordination pattern with different vocabulary. The cognition primitive (RUNTIME_COORDINATION) applies without modification. The extractor is new. The evidence class is not.

---

## Section 6: Runtime Cognition Portability

| Primitive | Survives BlueEdge→StackStorm? | Requires New Extraction? | Requires New Semantics? | Generalizable? | BlueEdge-Specific Bias Risk? |
|---|---|---|---|---|---|
| RUNTIME_DEPENDENCY | YES — AMQP creates non-import coupling between 11 services | YES — kombu patterns, not NestJS decorators | NO — same concept | PROVEN | NONE |
| RUNTIME_COORDINATION | YES — 12 AMQP exchanges coordinate all inter-service behavior | YES — Exchange/Queue declarations, not EventEmitter | NO — same concept | PROVEN | LOW — BlueEdge's in-process events and StackStorm's inter-process messages are the same primitive at different scales |
| RUNTIME_CONCENTRATION | YES — all coordination routes through single RabbitMQ broker | YES — broker config, not MQTT topic counts | NO — same ratio concept (exchanges per broker, events per handler) | PROVEN | LOW — concentration ratio is a numeric property, not technology-specific |
| RUNTIME_BOUNDARY_EXTENSION | YES — RabbitMQ + MongoDB + Redis are external. Sensors connect to external systems. Actions execute on remote targets. | YES — config grep for connection URLs | NO — same concept (outside codebase) | PROVEN | NONE |
| RUNTIME_SILENCE | YES — sensor container failure stops event ingestion silently. Action runner failure stops execution silently. Broker failure disconnects all services silently. | PARTIAL — requires reasoning about failure modes from service topology, not direct measurement | PARTIAL — multi-service independence creates different silence patterns than monolith + edge | LIKELY | MODERATE — BlueEdge's silence is monolith-with-broker. StackStorm's silence is multi-service-with-broker. Same concept, different failure geometry. |
| RUNTIME_GRAVITY | YES — st2common (import) vs AMQP (operational) is total divergence | YES — requires computing runtime gravity from exchange/service topology | NO — same divergence computation | LIKELY | LOW — gravity divergence is a comparison, not a measurement specific to one technology |

**Classification:**

| Primitive | Status |
|---|---|
| RUNTIME_DEPENDENCY | PROVEN |
| RUNTIME_COORDINATION | PROVEN |
| RUNTIME_CONCENTRATION | PROVEN |
| RUNTIME_BOUNDARY_EXTENSION | PROVEN |
| RUNTIME_SILENCE | LIKELY (reasoning confirmed, pipeline measurement not yet done) |
| RUNTIME_GRAVITY | LIKELY (divergence predicted as total, not yet computed) |

Same classification as cross-specimen validation. No change. No new BlueEdge-specific bias discovered.

---

## Section 7: Adapter Minimum Viable Set

### MUST HAVE (required for `determineNarrativeMode() → EXECUTION_BLINDNESS`)

| Artifact | Content | Extraction Method | Estimated Effort |
|---|---|---|---|
| amqp_exchange_graph.json | 12 exchanges, publisher services, consumer services, routing keys | Grep `Exchange("st2.` declarations + publish/subscribe call sites in transport modules | 2-3 hours |
| service_topology.json | 11 services from systemd declarations, which services publish to which exchanges, which consume from which queues | Parse systemd .service files + map transport module to service ownership | 2-3 hours |
| external_dependency_graph.json | RabbitMQ endpoint (from config), MongoDB endpoint, Redis endpoint | Grep config.py for connection URLs + conf/*.conf for service URLs | 1 hour |
| system_connectivity_graph.json | Composite: service → exchange → service edges | Combine amqp_exchange_graph + service_topology | 1 hour |

### SHOULD HAVE (improves quality but not required for activation)

| Artifact | Content | Why Should Have |
|---|---|---|
| sensor_trigger_action_flow.json | Sensor types, trigger definitions, rule patterns, action types | Maps to ASYNC_COORDINATION. Enriches the coordination topology. Produces stronger AF-004 equivalent. |
| Semantic domain registry | Named domains from service/package structure (st2api, st2reactor, st2actions, etc.) | Without domain labels, THORR/LENS answers use package names instead of business labels. Functional but not polished. |

### CAN DEFER

| Item | Why Defer |
|---|---|
| API boundary graph | st2api REST endpoints add completeness but do not change blindness classification |
| Visibility layer completeness persistence | Can compute at runtime, doesn't need pre-persistence |
| Full domain labeling with business context | StackStorm is a proof specimen, not a customer specimen. Package names suffice. |

### Total minimum extraction effort: ~8-10 hours (1 focused session)

---

## Section 8: Cut-Over / Parallelization Strategy

### Rules

1. BlueEdge remains the default specimen for THORR, LENS, and EIR
2. BlueEdge must be restorable instantly — no configuration change should affect it
3. StackStorm runs in parallel, never replacing BlueEdge
4. No global specimen pointer — specimen selection must be URL-parameterized

### Branch strategy

- All StackStorm runtime extraction work on `feature/stackstorm-runtime` branch
- Branch derived from current main (post `runtime-connectivity-baseline` tag)
- BlueEdge evidence untouched on this branch — only StackStorm artifacts added

### Run naming

- StackStorm run: `run_github_st2_20260520_131000` (already exists for static evidence)
- Runtime evidence goes to: `clients/stackstorm/psee/runs/run_github_st2_20260520_131000/structure/runtime_connectivity/`
- Same directory structure as BlueEdge runtime evidence

### Specimen selection

THORR and LENS already support `client` and `runId` URL parameters:
- BlueEdge: `/lens/blueedge/run_blueedge_genesis_e2e_03`
- StackStorm: `/lens/stackstorm/run_github_st2_20260520_131000`
- `/copilot/blueedge/run_blueedge_genesis_e2e_03`
- `/copilot/stackstorm/run_github_st2_20260520_131000`

No global switch needed. URL determines specimen. BlueEdge URLs remain unchanged.

### Return to BlueEdge

Instant — navigate to BlueEdge URL. No configuration change. No restart. No branch switch for the running dev server.

### Deployment safety

If `feature/stackstorm-runtime` introduces a bug that affects BlueEdge rendering:
- Revert to `runtime-connectivity-baseline` tag
- Or checkout main (which has BlueEdge working)
- StackStorm work is isolated to the feature branch

---

## Section 9: Risks and False Confidence

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| StackStorm reasoning was source-observed, not pipeline-proven | HIGH (this is a fact, not a risk) | HIGH — if pipeline produces different results than reasoning, the repeatability claim weakens | Run the pipeline. Do not claim repeatability until `determineNarrativeMode()` returns `EXECUTION_BLINDNESS` from pipeline-processed evidence. |
| BlueEdge extractors shaped the cognition model | MODERATE — evidence categories were defined from BlueEdge artifacts | MODERATE — StackStorm may need an evidence category not in the current taxonomy | SENSOR_TRIGGER_ACTION_FLOW is the test case. If it maps to ASYNC_COORDINATION without forcing, the model is unbiased. If it requires a new category, the model was shaped by BlueEdge. |
| AMQP does not map cleanly to MQTT/event-flow concepts | LOW — AMQP is structurally richer than MQTT (exchanges, routing keys, queue bindings). The mapping is superset, not translation. | LOW — the cognition primitives (DEPENDENCY, COORDINATION, CONCENTRATION) are computed from topology, not protocol | Verify that concentration ratio, boundary extension, and divergence computations produce valid results on AMQP topology. |
| Domain labels weaker on StackStorm | HIGH — 57 unnamed clusters vs BlueEdge's 17 named domains | MODERATE — THORR answers use domain names. Without labels, answers use package names (st2reactor, st2actions). Functional but less polished. | Use package/service names as domain labels. Not ideal for commercial demo. Acceptable for repeatability proof. |
| LENS requires named domains for meaningful projection | HIGH — topology nodes need display names | MODERATE — Execution Blindness modal works from blindness classifications, not domain names. Gravity Divergence modal needs domain labels for the two-column visual. | Package names as fallback. The proof is in the blindness activation, not the label quality. |
| THORR answers technically but not commercially without semantic labels | MODERATE | MODERATE — THORR can name file paths and exchange names. It cannot say "Fleet Core Operations" because StackStorm doesn't have that domain label. | Acceptable for repeatability proof. Not acceptable for customer demo. StackStorm is not a demo specimen. |
| Execution Blindness activation may be too permissive on StackStorm | LOW — StackStorm's divergence is predicted as TOTAL, not marginal | LOW — if anything, StackStorm will activate MORE strongly than BlueEdge | Verify activation criteria after pipeline processing. If activation is too easy, the activation contract may need tightening. |

---

## Section 10: Final Recommendation

### 1. Should we attempt StackStorm runtime cognition next?

**YES.** It is the single highest-value validation step available. It proves technology transfer, framework repeatability, and adapter strategy in one exercise. The alternative — going directly to a customer specimen — carries higher risk with less structural learning.

### 2. Should we wire THORR/LENS immediately or only after evidence synthesis passes?

**After evidence synthesis passes.** Sequence: extract evidence → run pipeline (qualifyDomainBacking → synthesize → compile → deriveArchitecturalFindings) → verify `determineNarrativeMode()` returns `EXECUTION_BLINDNESS` → THEN wire THORR/LENS. Do not wire consumers to unverified evidence.

### 3. What is the minimum adapter strategy?

**4 evidence artifacts** (AMQP exchange graph, service topology, external dependencies, system connectivity composite). ~8-10 hours of forensic grep work. One focused session. No framework needed — the same manual extraction approach that produced BlueEdge's artifacts.

### 4. Is this a one-off StackStorm adapter or the start of the canonical runtime adapter architecture?

**Both.** The StackStorm extraction will be manual (forensic grep), same as BlueEdge. But the PATTERNS discovered during extraction — how to extract AMQP topology, how to extract service topology from systemd, how to map multi-service coordination — become the templates for future Python/AMQP adapters. The one-off produces the canonical patterns.

### 5. What must remain frozen to protect BlueEdge?

- `clients/blueedge/` directory — untouched
- `run_blueedge_genesis_e2e_03` evidence artifacts — untouched
- Default THORR/LENS URLs — unchanged
- PIContextAssembler.js, ConsequenceNativeEIR.js, SignalSynthesisEngine.js — functional changes only if they are backward-compatible with BlueEdge evidence
- `runtime-connectivity-baseline` tag — the recovery point

### Final Verdict: **LIMITED GO**

GO for StackStorm runtime evidence extraction on a feature branch.
GO for pipeline verification (synthesize → compile → narrative mode).
HOLD on THORR/LENS wiring until pipeline verification passes.
FROZEN: BlueEdge specimen, default URLs, tagged recovery point.

The exercise proves repeatability and produces the first non-NestJS adapter patterns. It does not disrupt BlueEdge. It does not require architectural changes. It requires ~1 session of extraction work followed by pipeline verification.
