# THORR Capability Expansion — What AF-001 Unlocks

Stream: PI.THORR-CAPABILITY-EXPANSION.01
Date: 2026-06-06
Classification: G2 (architecture-consuming)
Status: COMPLETE

---

## Context

Before runtime connectivity (pre-2026-06-04), THORR could only answer from static import graph evidence. 13 of 17 domains were invisible. Structural gravity was the only gravity.

After runtime connectivity + AF-001 (post-2026-06-06), THORR has:
- 6 evidence layers (SYSTEM_CONNECTIVITY scope)
- 17/17 domains with evidence
- 5 architectural findings (AF-001 through AF-005)
- Runtime-derived structural conditions
- Focused OPERATIONAL_GRAVITY context bundle

This assessment enumerates what is newly possible per persona.

---

## Chief Architect

### Previously impossible
- "Where does the OPERATIONAL gravity of my program reside?" — could only answer with static import graph
- "Do my code dependencies and runtime coordination point to the same place?" — no runtime evidence existed
- "What is invisible to static code analysis?" — could not enumerate because only static evidence existed
- "Is my MQTT broker a single point of failure?" — MQTT topology not in evidence

### Newly possible
- **Operational gravity divergence**: AF-001 directly answers whether code center of mass and operational center of mass coincide
- **Runtime choke point identification**: `fleet.gateway.ts` as WebSocket choke point, event bus concentration ratio
- **Edge-cloud dependency mapping**: MQTT broker topology, edge agent hardware boundaries
- **Multi-layer structural assessment**: combine static and runtime evidence for architectural conclusions

### Required cognition objects
- AF-001 (Structural vs Operational Gravity Divergence)
- AF-003 (MQTT Broker SPOF)
- Runtime Dependency Choke Point condition
- Focused OPERATIONAL_GRAVITY context bundle

### Example answer shape
"Static gravity concentrates at Platform Infrastructure. Runtime gravity concentrates at Fleet Core Operations and Event-Driven Architecture. These do not coincide — AF-001 [CRITICAL]. The WebSocket gateway routes all real-time data through a single component. The MQTT broker is a single point of failure for all edge telemetry."

---

## Transformation Leader

### Previously impossible
- "What transformation risk is invisible to static code analysis?" — could identify the question but not answer it
- "If I refactor the backend DTO layer, does that address the operational risk?" — could not distinguish static from operational risk
- "What happens if the event bus fails?" — event topology not in evidence

### Newly possible
- **Hidden risk identification**: runtime risks invisible to code analysis (event concentration, MQTT SPOF, async propagation asymmetry)
- **Refactoring scope validation**: confirm whether static refactoring targets the right center of mass for operational resilience
- **Coordination backbone risk**: event bus handler concentration (13.3:1 ratio), WebSocket gateway SPOF

### Required cognition objects
- AF-001 (divergence implies static-only transformation planning is insufficient)
- AF-004 (event backbone concentration)
- RUNTIME_ONLY context bundle with pure runtime themes

### Example answer shape
"Three runtime risks are invisible to static code analysis: event handler concentration (53 events across 4 handlers), MQTT broker SPOF, and WebSocket gateway choke point. Refactoring the DTO layer addresses code coupling but does not reduce runtime coordination risk."

---

## Program Director

### Previously impossible
- "How complete is our structural coverage?" — could only report 4/17 domains backed
- "Are there program-level architectural risks that span multiple domains?" — cross-domain runtime risks invisible

### Newly possible
- **True coverage reporting**: 17/17 domains with evidence across 6 layers, not 4/17 static-only
- **Cross-domain operational risk**: event bus affects 8 domains simultaneously, MQTT broker affects 4 domains
- **Evidence layer gap reporting**: which specimens have runtime evidence, which don't

### Required cognition objects
- AF-002 (Runtime Visibility Corrected Domain Coverage)
- VLC (Visibility-Layer Completeness)
- Domain evidence coverage per cluster

### Example answer shape
"Domain coverage is 100% when measured across all 6 visibility layers. The previous 13 'dark domains' were a measurement gap, not a coverage gap. The assessment scope is SYSTEM_CONNECTIVITY, not CODE_CONNECTIVITY."

---

## Board Member

### Previously impossible
- "Is our structural assessment actually complete?" — answer was qualified by 13 unmeasured domains
- "Are there infrastructure-level single points of failure?" — not measurable from imports

### Newly possible
- **Qualified posture with full coverage**: posture assessment now covers all 17 domains, not just 4
- **Infrastructure SPOF at board level**: MQTT broker single point of failure as executive risk
- **Assessment completeness as governance signal**: 6/6 layers measured vs previous 1/6

### Required cognition objects
- EXECUTIVE_POSTURE answer contract
- VLC (completeness percentage, layer count)
- AF-003 (MQTT SPOF — board-level infrastructure risk)

### Example answer shape
"The structural posture is Systemic Operational Fragility [CRITICAL] across 17 domains with 100% evidence coverage. A single MQTT broker carries all edge-to-cloud telemetry — this is the highest-impact single point of failure and was invisible to previous static-only assessments."

---

## Operator

### Previously impossible
- "Show me only the runtime-derived risks" — no runtime risks existed
- "What does the event flow look like?" — event topology not available
- "Show the MQTT topic graph" — not in evidence

### Newly possible
- **Runtime-only risk isolation**: RUNTIME_ONLY question type with filtered themes and slices
- **Runtime component-level detail**: handler names, file paths, subscription counts, topic patterns, broker endpoints
- **Operational topology browsing**: event flow, MQTT topology, WebSocket streams, DI module graph

### Required cognition objects
- RUNTIME_ONLY context bundle
- formatRuntimeTopology output
- Runtime dependency hubs section

### Example answer shape
"5 runtime-derived conditions: Runtime Dependency Choke Point [HIGH] → Fleet Core Operations, Broker Dependency [ELEVATED] → Edge Data Acquisition, Event Concentration [ELEVATED] → Fleet Core Operations, Async Propagation Asymmetry [ELEVATED] → Real-Time Streaming, Topic Fanout [MODERATE] → Telemetry Transport."

---

## Founder / GOD

### Previously impossible
- "Is PI seeing the whole system or just the code?" — answer was "just the code"
- "Can PI tell me about infrastructure dependencies?" — no
- "Does our structural assessment extend to edge devices?" — no

### Newly possible
- **System-level PI intelligence**: PI now sees code + events + messaging + WebSocket + API + DI — not just imports
- **Edge-to-cloud visibility**: MQTT topology extends the assessment to hardware on vehicles
- **Assessment maturity demonstration**: 6 evidence layers, SYSTEM_CONNECTIVITY scope, 100% completeness
- **Divergence as PI insight**: "the code and the system have different centers of gravity" — a PI-native discovery that no other tool produces

### Required cognition objects
- Full verdict with all AF findings
- VLC with architecture profile
- OPERATIONAL_GRAVITY context bundle for gravity questions

### Example answer shape
"PI now sees 6 evidence layers, not just the import graph. The system's operational center of mass is different from its code center of mass — that's a structural finding, not an opinion. The assessment extends to edge devices running on vehicle hardware through MQTT topology."

---

## Summary Matrix

| Persona | Pre-Runtime Questions | Post-Runtime Questions | Net New |
|---|---|---|---|
| Chief Architect | Static gravity, file-level depth | + Operational gravity, divergence, runtime choke points | 4 |
| Transformation Leader | Static risk, refactoring scope | + Hidden risk, coordination backbone, scope validation | 3 |
| Program Director | Partial coverage, static cross-domain | + Full coverage, runtime cross-domain, layer gaps | 3 |
| Board Member | Qualified posture, static SPOF | + Full-coverage posture, infrastructure SPOF, completeness | 3 |
| Operator | Static signals, conditions | + Runtime-only isolation, component-level topology | 3 |
| Founder / GOD | "Just the code" | + System-level intelligence, edge-to-cloud, divergence | 4 |
