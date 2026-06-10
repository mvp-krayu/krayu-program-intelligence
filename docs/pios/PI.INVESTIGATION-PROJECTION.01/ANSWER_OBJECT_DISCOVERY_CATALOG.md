# Answer Object Discovery Catalog

**Exercise:** Discovery, not implementation
**Specimen:** BlueEdge genesis_e2e_03
**Date:** 2026-06-10
**Method:** For each finding, generate investigation questions, trace evidence, derive the answer object that naturally emerges. Record whether answer objects recur.

---

## Finding 1: AF-001 — Structural vs Operational Gravity Divergence

Platform Infrastructure and Data (structural center) vs Fleet Core Operations (execution center).

### Investigation Questions

| # | Question | Trace | Evidence Source |
|---|----------|-------|-----------------|
| 1 | Why is Fleet Core Operations the execution center rather than Platform Infrastructure and Data? | `execution_concentration[0].domain` | domain_concentration + execution_center |
| 2 | Which runtime paths create pressure? | `signal_interpretations.RSIG[]` | 7 RSIG signals |
| 3 | Does this compound with Execution Blindness? | `SURFACE_ADJACENCY.GRAVITY_DIVERGENCE` | adjacency graph |
| 4 | Which delivery decisions are affected? | `domain_concentration + execution_center.divergence` | consequence_themes filtered by divergence |
| 5 | What would disprove this? | `FALSIFICATION_PATHS.GRAVITY_DIVERGENCE` | "code gravity and operational gravity converged on the same domains" |

### Answer Objects

**Q1 → Divergence Profile**
Two domains. Each with a gravity metric (structural mass vs operational load). The answer is the contrast — not either domain alone. Fields: `{ domainA, domainA_gravity: { files, inbound, outbound, cluster_mass }, domainB, domainB_gravity: { rsig_count, event_load, ws_throughput }, divergence_magnitude }`.

**Q2 → Pressure Corridor Set**
7 raw RSIG signals collapse into 3 corridors:
- Event coordination bottleneck (RSIG-001, 002): Fleet Core Ops + Telemetry — 53 events → 4 handlers
- Broker SPOF (RSIG-003, 006): Edge → MQTT broker → Telemetry — all edge telemetry through one broker
- Gateway funnel (RSIG-005): Real-Time Streaming → Platform — WebSocket fan-out

The object is `corridors[]`, not `signals[]`. Each corridor: `{ label, contributing_signals[], affected_domains[], pressure_metric, failure_implication }`.

**Q3 → Compounding Verdict**
Yes/no + bridge domains. Fleet Core Operations and Telemetry Transport appear in BOTH Gravity Divergence and Execution Blindness. Object: `{ compounds: boolean, bridge_domains[], divergence_severity, blindness_severity, compound_severity }`.

**Q4 → Causal Consequence Filter**
9 themes exist. Only those whose contributing conditions touch the divergence pair are relevant. Object: `{ relevant_themes[], filtered_from_total, causal_link }`. Not all consequences — the ones caused BY this finding.

**Q5 → Falsification Statement**
Pure text: "This would disappear if code gravity and operational gravity converged." Object: `{ statement, measurable: boolean, evidence_for_convergence, evidence_against_convergence }`.

---

## Finding 2: AF-003 — MQTT Broker Single Point of Failure

Single broker `mqtt.blueedge.network:8883` carries all edge-to-cloud telemetry. Broker failure = total telemetry loss.

### Investigation Questions

| # | Question | Trace | Evidence Source |
|---|----------|-------|-----------------|
| 1 | What depends on this broker? | mqtt_topic_graph.broker | 6 topic channels, 2 edge agents, 4 subscriber domains |
| 2 | What breaks if the broker fails? | RSIG-003 + topic_channels[].subscriber_domain | DOMAIN-01, 07 → broker → DOMAIN-02, 10 |
| 3 | Is there redundancy? | mqtt_topic_graph.broker_count | Single broker. No failover. mTLS auth. |
| 4 | Does this compound with other runtime risks? | RSIG-003 × RSIG-001 overlap | Same domains (Telemetry Transport) appear in both |
| 5 | What is the blast radius if it fails? | topic_channels[].subscriber_domain ∪ publisher_domain | 4 domains affected, 6 topic channels dark |
| 6 | What would disprove this? | FALSIFICATION | "redundant broker path existed" or "telemetry had a non-MQTT fallback" |

### Answer Objects

**Q1 → Dependency Fan**
One node (broker) with inbound publishers and outbound subscribers. Object: `{ node, node_type: 'SPOF', publishers[]: { agent, domain, topics[] }, subscribers[]: { domain, topics[] }, total_channels }`. This is a directed dependency graph rooted at a single node.

**Q2 → Failure Impact Map**
What goes dark. Object: `{ trigger: 'broker failure', domains_affected[], capabilities_lost[]: { domain, capability, evidence }, total_topic_channels_lost, has_fallback: false }`. Not "which domains" — which operational CAPABILITIES cease.

**Q3 → Redundancy Verdict**
Binary + evidence. Object: `{ redundant: false, broker_count: 1, failover_path: null, evidence: 'single broker in mqtt_topic_graph, no secondary broker reference in codebase' }`.

**Q4 → Cross-Risk Compounding Verdict**
Same shape as AF-001 Q3. Domain overlap between broker risk and event concentration risk. Object: `{ compounds: boolean, bridge_domains[], risk_a_severity, risk_b_severity, compound_severity }`.

**Q5 → Blast Radius**
Quantified impact scope. Object: `{ trigger, domains_affected: 4, topics_lost: 6, agents_disconnected: 2, downstream_consumers_affected: 4, severity_if_triggered: 'CRITICAL' }`.

**Q6 → Falsification Statement**
Same shape as AF-001 Q5. Object: `{ statement, measurable, evidence_for, evidence_against }`.

---

## Finding 3: AF-004 — Event Coordination Concentration (13.3:1 handler ratio)

53 event types. 4 handlers. Handler failure is systemic, not regional.

### Investigation Questions

| # | Question | Trace | Evidence Source |
|---|----------|-------|-----------------|
| 1 | Which handlers carry the load? | event_flow_graph.handlers[] | 4 handlers: websocket-broadcast (19 events), cache-invalidation (24), audit-log (21), notification (10) |
| 2 | What breaks if a handler fails? | handler → downstream consumers | websocket-broadcast failure = all real-time UI goes dark |
| 3 | Which domains produce the events? | event_type_to_domain_map | DOMAIN-03 (vehicle/trip/alert/safety) dominates |
| 4 | Is the concentration getting worse? | No temporal evidence | Cannot answer — evidence is point-in-time snapshot |
| 5 | Does the event concentration compound with the WebSocket funnel? | RSIG-001 × RSIG-002 | 53 events → 4 handlers → 12 WebSocket emissions → 6 frontend hooks |
| 6 | What would disprove this? | FALSIFICATION | "handlers were domain-scoped (1 handler per domain) instead of cross-cutting" |
| 7 | What is the handler-to-consumer chain? | handlers → ws emissions → frontend hooks | websocket-broadcast → fleet.gateway.ts → useFleetPositions, useVehicleTelemetry, useAlertStream, useActivityFeed, useSocketEvent |

### Answer Objects

**Q1 → Handler Load Profile**
4 handlers with their event counts and responsibilities. Object: `{ handlers[]: { name, file, event_count, event_families[], failure_scope: 'SYSTEMIC'|'REGIONAL' }, total_events, concentration_ratio }`. This is a load distribution view.

**Q2 → Handler Failure Impact Map**
Same shape as AF-003 Q2 (Failure Impact Map). Object: `{ trigger: 'handler failure', handler, capabilities_lost[], downstream_consumers[], has_fallback: false }`. Per handler.

**Q3 → Event Origin Profile**
Which domains produce events and how concentrated production is. Object: `{ producing_domains[]: { domain, event_families[], event_count }, concentration: 'DOMAIN-03 produces 70% of event types' }`. A production concentration view.

**Q4 → Temporal Unavailability**
The question cannot be answered. Object: `{ answerable: false, reason: 'point-in-time snapshot — no temporal evidence', would_require: 'multiple run comparisons' }`. This is a legitimate answer object — "we cannot know this."

**Q5 → Propagation Chain**
The full chain from event production through handlers to consumer. Object: `{ chain[]: { stage, nodes[], concentration_ratio }, stages: ['event production', 'handler processing', 'websocket emission', 'frontend consumption'], bottleneck_stage, total_amplification }`. This is a multi-stage pipeline view.

**Q6 → Falsification Statement**
Same shape. Object: `{ statement, measurable, evidence_for, evidence_against }`.

**Q7 → Handler-Consumer Chain**
Same shape as Q5 Propagation Chain but focused on one handler. The chain from one handler through WebSocket gateway to frontend hooks. Object: `{ handler, emissions[], hooks[], consumer_components[], failure_cascade_path }`.

---

## Finding 4: Compound Structural Convergence (SW-INTEL posture, CRITICAL)

5 domains have CRITICAL compound convergence — multiple independent structural indicators converge on the same domain. Platform Infrastructure and Data has 9 conditions touching it simultaneously.

### Investigation Questions

| # | Question | Trace | Evidence Source |
|---|----------|-------|-----------------|
| 1 | Which conditions converge on this domain? | conditions[].affected_domains contains domain | 9 conditions: delivery pressure, dependency choke, mass concentration, coupling, execution constriction, event concentration, broker dependency, async propagation, compound convergence |
| 2 | Are these conditions independent or caused by the same root? | condition[].evidence_mode + trace | 5 structural + 3 runtime + 1 compound — multiple evidence families |
| 3 | Which is the load-bearing condition? | If you remove ONE condition, does severity drop? | Delivery Pressure Concentration (HIGH) — the structural mass creates the pressure that other conditions compound |
| 4 | Does this domain's convergence affect other domains? | domain_narratives[].propagation_role | Platform Infrastructure and Data is propagation origin for Frontend Application, Fleet Core Operations |
| 5 | Is the convergence accelerating or stable? | No temporal evidence | Cannot answer — point-in-time |
| 6 | Which conditions are structurally derived vs runtime-observed? | condition[].evidence_mode | Structural: DPC, DCK, SMC, CDCP, EC. Runtime: EVENT_CONCENTRATION, BROKER_DEPENDENCY, ASYNC_PROPAGATION |
| 7 | What is the failure posture if this domain degrades? | convergence_count × propagation_role | 9 conditions × propagation origin = cascading degradation |
| 8 | What would reduce the convergence? | inverse of contributing conditions | Decouple coupling (CDCP), distribute mass (SMC), add runtime redundancy (BROKER, ASYNC) |

### Answer Objects

**Q1 → Convergence Inventory**
All conditions touching one domain, grouped by evidence family. Object: `{ domain, conditions[]: { id, type, severity, evidence_family: 'STRUCTURAL'|'RUNTIME'|'COMPOUND' }, total_count, peak_severity, evidence_families_count }`. Not a flat list — grouped by what KIND of evidence produced each condition.

**Q2 → Independence Assessment**
Are the conditions correlated or independent? Object: `{ independent_roots: number, condition_clusters[]: { root_cause, derived_conditions[] }, assessment: 'partially independent — structural mass creates conditions that runtime evidence confirms' }`. This determines whether convergence is real compounding or measurement echo.

**Q3 → Load-Bearing Condition**
Which single condition, if removed, would most reduce severity? Object: `{ load_bearing_condition, removal_impact: 'severity drops from CRITICAL to HIGH', reasoning, dependent_conditions[] }`. A counterfactual — what would change if this one thing improved.

**Q4 → Propagation Reach**
Same shape as AF-003 Q5 (Blast Radius). Object: `{ origin_domain, downstream_domains[], propagation_type: 'structural pressure', cascade_severity }`.

**Q5 → Temporal Unavailability**
Same shape as AF-004 Q4. Object: `{ answerable: false, reason, would_require }`.

**Q6 → Evidence Family Partition**
Conditions split by evidence origin. Object: `{ structural_conditions[], runtime_conditions[], compound_conditions[], structural_count, runtime_count, agreement: 'runtime confirms structural' | 'runtime contradicts structural' | 'runtime reveals hidden' }`. Whether the two evidence families AGREE is the cognitive object.

**Q7 → Degradation Posture**
What happens if this domain degrades. Object: `{ domain, condition_load, propagation_targets[], cascade_scenario, severity_without_propagation, severity_with_propagation }`. The delta between local and systemic impact.

**Q8 → Remediation Leverage**
Which interventions reduce the most conditions? Object: `{ interventions[]: { action, conditions_addressed[], severity_reduction }, highest_leverage, total_conditions_addressable }`. A remediation efficiency ranking.

---

## Recurring Answer Object Catalog

| Answer Object | Occurrences | Findings |
|---------------|-------------|----------|
| **Falsification Statement** | 4 | AF-001 Q5, AF-003 Q6, AF-004 Q6, CC Q8 (partial) |
| **Compounding Verdict** | 3 | AF-001 Q3, AF-003 Q4, AF-004 Q5 |
| **Failure Impact Map** | 3 | AF-003 Q2, AF-004 Q2, CC Q7 |
| **Blast Radius** | 2 | AF-003 Q5, CC Q4 |
| **Propagation Chain** | 2 | AF-004 Q5, AF-004 Q7 |
| **Temporal Unavailability** | 2 | AF-004 Q4, CC Q5 |
| **Convergence Inventory** | 1 | CC Q1 (but would recur for any domain with compound convergence) |
| **Independence Assessment** | 1 | CC Q2 (but applicable wherever multiple conditions share a domain) |
| **Load-Bearing Condition** | 1 | CC Q3 (counterfactual — generalizable) |
| **Evidence Family Partition** | 1 | CC Q6 (but applicable to any finding with mixed evidence) |
| **Divergence Profile** | 1 | AF-001 Q1 (specific to gravity divergence findings) |
| **Pressure Corridor Set** | 1 | AF-001 Q2 (collapsed from raw signals — specific to runtime pressure) |
| **Dependency Fan** | 1 | AF-003 Q1 (specific to SPOF findings) |
| **Redundancy Verdict** | 1 | AF-003 Q3 (binary with evidence) |
| **Handler Load Profile** | 1 | AF-004 Q1 (specific to concentration findings) |
| **Event Origin Profile** | 1 | AF-004 Q3 (specific to event domain mapping) |
| **Causal Consequence Filter** | 1 | AF-001 Q4 (themes filtered by causal origin) |
| **Remediation Leverage** | 1 | CC Q8 (intervention efficiency ranking) |

---

## Discovery: Reusable vs One-Off

### Clearly Reusable (appear across 2+ findings)

1. **Falsification Statement** — `{ statement, measurable, evidence_for, evidence_against }`. Every finding has one. Universal.

2. **Compounding Verdict** — `{ compounds: boolean, bridge_domains[], severity_a, severity_b, compound_severity }`. Any two findings can be tested for compounding. The bridge domains are the cognitive proof.

3. **Failure Impact Map** — `{ trigger, capabilities_lost[], domains_affected[], has_fallback, severity_if_triggered }`. Any node with concentrated dependencies produces this. Not "which domains" — which operational capabilities cease.

4. **Blast Radius** — `{ trigger, domains_affected_count, downstream_scope, severity }`. Quantified impact scope. Subset of Failure Impact Map but appears independently.

5. **Propagation Chain** — `{ chain[]: { stage, nodes[], concentration_ratio }, bottleneck_stage }`. Multi-stage pipeline with amplification at each stage. Appears wherever event/data flow has stages.

6. **Temporal Unavailability** — `{ answerable: false, reason, would_require }`. The honest "we cannot know this" answer. Appears whenever temporal evidence is needed but absent.

### Likely Reusable (appear once but structurally generalizable)

7. **Convergence Inventory** — conditions touching one domain, grouped by evidence family. Would appear for ANY domain with compound convergence. 5 domains have it in this specimen.

8. **Evidence Family Partition** — conditions split by structural/runtime/compound origin. Whether evidence families agree is the cognitive object. Applicable to any finding with mixed evidence.

9. **Independence Assessment** — are co-located conditions correlated or independent? Applicable wherever multiple conditions share a domain.

10. **Load-Bearing Condition** — counterfactual: which single condition, if removed, most reduces severity? Applicable to any compound finding.

### Genuinely One-Off (specimen or finding-specific)

11. **Divergence Profile** — specific to gravity divergence findings (two domains with contrasting gravity types).

12. **Pressure Corridor Set** — specific to runtime pressure findings (raw signals collapsed into corridors).

13. **Dependency Fan** — specific to SPOF findings (single node with publisher/subscriber fan).

14. **Handler Load Profile** — specific to event concentration findings.

---

## Conclusion

**Answer objects recur.** Of 18 distinct objects discovered across 4 findings:
- 6 are clearly reusable (appear in 2+ findings)
- 4 are structurally generalizable (appear once but would recur for other domains/specimens)
- 4 are finding-type-specific (but would recur for the same finding type in other specimens)
- 4 are genuinely specimen-specific

The most universal: **Falsification Statement**, **Compounding Verdict**, **Failure Impact Map**, **Temporal Unavailability**. These appear regardless of finding type.

The most interesting: **Evidence Family Partition** and **Independence Assessment**. These ask whether the evidence AGREES WITH ITSELF — a meta-cognitive object that doesn't exist in any current zone.

These are not zone projections. These are **cognition objects** that synthesize across existing data structures. No existing zone renders a Compounding Verdict or an Evidence Family Partition. They require a synthesis step that doesn't exist yet — but the input data for all of them already exists in the specimen.
