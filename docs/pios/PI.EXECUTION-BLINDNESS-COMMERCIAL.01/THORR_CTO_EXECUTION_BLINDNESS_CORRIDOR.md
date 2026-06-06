# THORR CTO Execution Blindness Corridor

Stream: PI.EXECUTION-BLINDNESS-COMMERCIAL.01
Date: 2026-06-06
Classification: Productization artifact

---

## 1. Purpose

This is the first productized THORR interrogation corridor. It defines the question sequence, evidence classes, surprise moments, and commercial reactions for a CTO/VP Engineering audience exploring Execution Blindness through THORR.

The corridor is designed for a live demo or advisory session where the operator (Krayu advisor) guides a CTO through a discovery sequence that reveals what their existing tools cannot see.

---

## 2. Persona

**Chief Architect / CTO / VP Engineering**

Decision horizon: Structural design, architectural integrity, transformation planning.
Projection altitude: Full evidence depth. File-level detail. Graph mechanics and derivation traceability expected.
Access tier: Operator.

This persona believes they understand their system. They have code reviews, architecture diagrams, dependency scanners, and monitoring dashboards. They can articulate the structure. They cannot articulate what they cannot see.

---

## 3. Buyer Relevance

This corridor is designed for the moment when a CTO says one of:

- "We're planning a major refactoring / migration"
- "We want to understand our operational risk before committing investment"
- "We just had an incident we didn't predict"
- "Our architecture review says we're fine but something feels wrong"
- "The board asked about resilience and I need an independent view"

The corridor does NOT serve: code quality review, performance optimization, security assessment, or process improvement. Those are different products.

---

## 4. Core Thesis

**"The system has two architectures. Only one of them has been managed."**

The static architecture — visible in imports, dependency diagrams, ADRs — has been shaped by deliberate decisions. The runtime architecture — event buses, message brokers, WebSocket gateways, external infrastructure — emerged through operational evolution. It carries the load. It governs execution. It is invisible to every code-centric review process the team has been running.

The corridor progressively reveals this divergence.

Supporting thesis:

**"The architecture being managed and the architecture carrying operational load are not the same architecture."**

---

## 5. Discovery Sequence

The corridor follows a three-phase cognitive journey:

### Phase 1 — Establish Confidence (2-3 questions)

The CTO asks about what they know. THORR confirms their understanding with structural evidence. The CTO feels validated.

Purpose: Build trust that THORR understands their system. Confirm the visible picture is accurate.

### Phase 2 — Introduce Divergence (2-3 questions)

The CTO asks about operational gravity, center of mass, or propagation risk. THORR reveals that the operational answer differs from the structural answer. The CTO experiences surprise.

Purpose: The divergence between what they know and what the evidence shows creates the commercial moment.

### Phase 3 — Reveal Blindness (2-3 questions)

The CTO asks about hidden risks, failure paths, or what would surprise them most. THORR names specific components, specific failure modes, and specific blast radii that the CTO genuinely did not know about.

Purpose: The CTO says "I did not know this." That is the buying moment.

---

## 6. Question Set

### Phase 1 — Confidence

| # | Question | Expected THORR Behavior |
|---|---|---|
| 1 | "What is the structural center of gravity of this system?" | Names Platform Infrastructure and Data. DTO index (111 imports). PZ-001 compound zone. Coupling pressure z-score 5.66. The CTO nods — this matches their mental model. |
| 2 | "Where are the fragility hotspots?" | Names frontend files (hooks, App.tsx, socket). The CTO recognizes these. Static analysis confirms what they suspect. |

### Phase 2 — Divergence

| # | Question | Expected THORR Behavior |
|---|---|---|
| 3 | "Where does the actual operational gravity of my program reside?" | THORR triggers OPERATIONAL_GRAVITY context bundle. AF-001 structures the answer. Names fleet-event-emitter.service.ts, fleet.gateway.ts, MQTT broker. Static gravity ≠ operational gravity. The CTO's expression changes. |
| 4 | "Show me the operational center of gravity and compare it to the architectural center of gravity." | THORR produces the divergence table: static CoG (Platform Infrastructure, 18 consequences) vs runtime CoG (Event-Driven Architecture, 8 domains). Completely different locations. Different failure modes. |

### Phase 3 — Blindness

| # | Question | Expected THORR Behavior |
|---|---|---|
| 5 | "Which component would you shut down first to stop the largest amount of business activity?" | fleet-event-emitter.service.ts. 53 events, 4 handlers, 8 domains. Not in any static dependency ranking. The CTO did not know this file was the operational spine. |
| 6 | "What would surprise the CTO most about this system?" | "The system has two architectures. Only one of them has been managed." Three surprises: 13 "dark" domains were actually connected, the most critical dependency is not in the codebase, the architecture being managed is not the architecture carrying load. |
| 7 | "Which failure path is least likely to appear on a risk register?" | cache-invalidation.handler.ts — silent failure, stale data, no error signal. Plus edge agent silent stop. Wrong answers are categorically harder to detect than errors. |

---

## 7. Expected Evidence Classes

Each phase draws from different evidence layers:

| Phase | Primary Evidence | THORR Context |
|---|---|---|
| Phase 1 | STATIC_IMPORT (code graph, import hubs, pressure zones) | Standard structural topology |
| Phase 2 | EVENT_FLOW + WEBSOCKET_FLOW + MQTT_TOPIC_FLOW (runtime coordination) | OPERATIONAL_GRAVITY focused context bundle, AF-001 |
| Phase 3 | All 6 layers combined (SYSTEM_CONNECTIVITY) | Full runtime topology with business capability framing |

The evidence progression IS the discovery mechanism. Static first, runtime second, synthesis third.

---

## 8. BlueEdge Proof Examples

### Phase 2 proof — Gravity Divergence

```
STATIC GRAVITY                    RUNTIME GRAVITY
Platform Infrastructure           Fleet Core Operations
  111 imports (DTO index)           53 events (event emitter)
  PZ-001 compound zone              12 WebSocket streams
  5.66 z-score coupling             13.3:1 handler ratio
  18 consequences                    7 consequences, 8 domains
```

These are different places. Different failure modes. Different risk profiles.

### Phase 3 proof — Hidden Load-Bearers

| Component | Static Visibility | Operational Consequence |
|---|---|---|
| fleet-event-emitter.service.ts | Not in any hub ranking | ALL domain coordination (8 domains) |
| mqtt.blueedge.network:8883 | Not in the codebase | ALL edge-to-cloud telemetry |
| cache-invalidation.handler.ts | 24 subscriptions, no user surface | System-wide silent data drift |
| sensor_collector.py | Python script on edge hardware | 4 downstream domains |

Every entry in this table is invisible to static code analysis.

---

## 9. Surprise Moments

The corridor is designed to produce three specific surprise moments:

### Surprise 1 — "That's not where I thought the gravity was"

Trigger: Question 3 or 4 (operational gravity).
Evidence: AF-001 divergence map.
CTO reaction: "I would have said Platform Infrastructure. You're telling me it's Event-Driven Architecture?"

### Surprise 2 — "That dependency is not in our codebase"

Trigger: Question 5 (MQTT broker).
Evidence: AF-003.
CTO reaction: "We know we have an MQTT broker. We didn't know it was the single highest-impact dependency in the system."

### Surprise 3 — "That failure mode would produce wrong answers, not errors"

Trigger: Question 7 (cache invalidation handler).
Evidence: Runtime consequence analysis.
CTO reaction: "We would not detect that. We would diagnose it as a data quality issue."

---

## 10. Buyer Reaction Test

After the corridor, the CTO should:

| Reaction | Meaning | Commercial Signal |
|---|---|---|
| "I need to share this with the team" | The discovery is real and actionable | Strong — expand to SA-DD |
| "Can you do this on our other systems?" | Repeatability recognized | Very strong — portfolio opportunity |
| "How often does this change?" | Wants continuous monitoring | Conversion signal → SC |
| "We already knew about the broker" | Partial — but did they know the blast radius? | Moderate — drill into concentration ratios |
| "This is just architecture review" | Did not experience surprise | Weak — corridor failed or system is call-graph-dominant |

The corridor succeeds when the CTO says something they could not have said before the session. If they can only repeat what they already knew, the corridor did not produce a discovery.

---

## 11. Commercial Value

The corridor demonstrates the value of the Execution Blindness Discovery offer:

| What the CTO had before | What the CTO has after |
|---|---|
| Code structure analysis | Operational structure analysis |
| Visible dependency map | Visible + invisible dependency map |
| Static risk register | Static + runtime risk register |
| Architectural center of mass | Architectural + operational center of mass |
| "We think we understand our system" | "We now know what we didn't know" |

The commercial sentence after the corridor:

**"We discovered that our operational center of gravity is in a different place than our code suggests. Three failure modes were invisible to every tool we use."**

That sentence justifies the Execution Blindness Discovery engagement.

---

## 12. Demo Usage

### Live demo (30 minutes)

Use BlueEdge specimen. Follow the 7-question sequence. The advisor types each question into THORR while the CTO watches the response generate in real time.

Key moments to pause:
- After Question 3: "Notice that THORR named components that do not appear in any static analysis ranking."
- After Question 5: "This file — fleet-event-emitter.service.ts — is not a hub. It is not a gateway. But it coordinates 8 domains."
- After Question 7: "This failure produces wrong answers, not errors. Your monitoring would not detect it."

### Recorded demo (5 minutes)

Show only the divergence table (Question 4) and the surprise response (Question 6). The two sentences that anchor the demo:

"The system has two architectures. Only one of them has been managed."

"The architecture being managed and the architecture carrying operational load are not the same architecture."

---

## 13. Final Recommendation

This corridor is ready for live demo and advisory use today. It requires:

- BlueEdge specimen loaded in THORR
- Chief Architect persona selected
- OPERATIONAL_GRAVITY context bundle active (verified — live UI passes)
- Advisor who understands the 3-phase discovery sequence

The corridor does NOT require:
- New cognition
- New extraction
- New architecture
- New rendering

It uses existing THORR capabilities to produce the commercial moment that justifies the Execution Blindness Discovery engagement.

**The corridor is the sales tool. The EIR is the deliverable. The conversion is natural.**
