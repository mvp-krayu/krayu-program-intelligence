# Answer Object Ontology

**Artifact:** PI.INVESTIGATION-PROJECTION.01 / ANSWER_OBJECT_ONTOLOGY
**Status:** ONTOLOGY DEFINED — no implementation
**Date:** 2026-06-10
**Derived from:** ANSWER_OBJECT_DISCOVERY_CATALOG.md (4 findings, 26 questions, 18 objects)

---

## Ontology Scope

10 reusable answer objects. For each: canonical schema, required evidence, generating question classes.

Objects 1–6 are proven reusable (appear across 2+ findings).
Objects 7–10 are structurally generalizable (appear once but the generating condition is common).

---

## AO-001: Falsification Statement

The inverse condition that would eliminate a finding.

### Schema

```json
{
  "ao_type": "FALSIFICATION_STATEMENT",
  "finding_id": "string",
  "statement": "string — the structural condition that would eliminate this finding",
  "measurable": "boolean — can current evidence measure whether this condition holds?",
  "evidence_for": "string[] — evidence suggesting the inverse condition is emerging",
  "evidence_against": "string[] — evidence confirming the finding still holds",
  "verdict": "HOLDS | WEAKENING | INCONCLUSIVE"
}
```

### Required Evidence

- The finding itself (any condition or surface with a defined falsification path)
- `FALSIFICATION_PATHS[surface_id]` from CognitiveContinuations — the inverse condition text
- Current conditions and signals — to assess whether any evidence supports the inverse

### Generating Question Classes

- CHALLENGE continuations: "What would disprove this?"
- CHALLENGE continuations: "What evidence would show this risk is overstated?"
- Any question of the form: "Is this still true?"

### Universality

Every finding has a falsification path. This object is universal across all findings, all specimens.

---

## AO-002: Compounding Verdict

Whether two findings share structural substrate and amplify each other.

### Schema

```json
{
  "ao_type": "COMPOUNDING_VERDICT",
  "finding_a": "string — surface or condition ID",
  "finding_b": "string — surface or condition ID",
  "compounds": "boolean",
  "bridge_domains": "string[] — domains that appear in BOTH findings",
  "bridge_evidence": [
    {
      "domain": "string",
      "role_in_a": "string — what role this domain plays in finding A",
      "role_in_b": "string — what role this domain plays in finding B"
    }
  ],
  "severity_a": "string",
  "severity_b": "string",
  "compound_severity": "string — severity if both findings are active on shared domains",
  "mechanism": "string — HOW they compound (shared load, cascading failure, mutual amplification)"
}
```

### Required Evidence

- Two findings (conditions or surfaces) with `affected_domains[]`
- Domain intersection: `finding_a.affected_domains ∩ finding_b.affected_domains`
- Condition details for both findings to derive role descriptions
- `SURFACE_ADJACENCY` graph from CognitiveContinuations — which surfaces are adjacent

### Generating Question Classes

- ADJACENT continuations: "Does this compound with [surface]?"
- ADJACENT continuations: "Does the divergence compound with runtime blindness?"
- Any question of the form: "Are these related?"

### Universality

Any two findings with overlapping domains can produce this. The adjacency graph already encodes which pairs are worth testing. Generalizes across specimens.

---

## AO-003: Failure Impact Map

What operational capabilities cease when a structural node fails.

### Schema

```json
{
  "ao_type": "FAILURE_IMPACT_MAP",
  "trigger": "string — what fails (broker, handler, domain, node)",
  "trigger_type": "SPOF | HANDLER | DOMAIN | COORDINATION_POINT",
  "capabilities_lost": [
    {
      "capability": "string — operational function that stops",
      "domain": "string — domain that loses this capability",
      "evidence_class": "string — what evidence proves this dependency",
      "consumer_impact": "string — what downstream consumer is affected"
    }
  ],
  "domains_affected": "string[]",
  "has_fallback": "boolean",
  "fallback_path": "string | null",
  "severity_if_triggered": "string"
}
```

### Required Evidence

- A node with concentrated dependencies (identified by conditions: SPOF, DEPENDENCY_CHOKE_POINT, EXECUTION_CONSTRICTION, BROKER_DEPENDENCY, RUNTIME_DEPENDENCY_CHOKE_POINT)
- Downstream dependency information from: `runtime_connectivity_edges`, `event_flow_graph.handlers[]`, `mqtt_topic_graph.topic_channels[]`, `websocket_flow_graph`
- Domain-to-capability mapping (derived from domain narratives and topology)

### Generating Question Classes

- DESCENT continuations targeting infrastructure nodes: "What breaks if [X] fails?"
- IMPLICATION continuations: "Which operational decisions become unreliable?"
- Compound convergence questions: "What is the failure posture if this domain degrades?"

### Universality

Any specimen with concentrated dependencies produces this. The trigger type varies (SPOF in MQTT, handler in events, domain in structural convergence) but the schema is invariant.

---

## AO-004: Blast Radius

Quantified scope of impact from a trigger event.

### Schema

```json
{
  "ao_type": "BLAST_RADIUS",
  "trigger": "string",
  "domains_affected": "number",
  "domains_affected_list": "string[]",
  "channels_or_paths_lost": "number",
  "agents_or_nodes_disconnected": "number",
  "downstream_consumers_affected": "number",
  "severity_if_triggered": "string",
  "scope": "REGIONAL | SYSTEMIC"
}
```

### Required Evidence

- A trigger node (from conditions: any SPOF, choke point, or convergence target)
- Topology: `domain_concentration[]` for domain-level blast
- Runtime graphs: `mqtt_topic_graph.topic_channels[]`, `event_flow_graph`, `system_connectivity_graph.edges[]` for path-level blast
- The ability to count: domains touched, paths severed, consumers affected

### Generating Question Classes

- DESCENT/IMPLICATION: "What is the blast radius if [X] fails?"
- ADJACENT: "How far does this propagate?"
- Any question about scope or containment

### Universality

Subset of Failure Impact Map (AO-003). Appears independently when the question is about SCOPE (how far?) rather than CAPABILITY (what stops?). Every concentrated node has a measurable blast radius.

### Relationship to AO-003

AO-004 is the quantitative dimension of AO-003. AO-003 says WHAT stops. AO-004 says HOW FAR it reaches. They can be composed or projected independently.

---

## AO-005: Propagation Chain

Multi-stage pipeline showing how pressure amplifies through processing stages.

### Schema

```json
{
  "ao_type": "PROPAGATION_CHAIN",
  "origin": "string — where pressure originates",
  "stages": [
    {
      "stage_name": "string — event production | handler processing | websocket emission | frontend consumption",
      "nodes": "string[] — components at this stage",
      "input_count": "number — items entering this stage",
      "output_count": "number — items leaving this stage",
      "concentration_ratio": "number — output/input or input/node",
      "bottleneck": "boolean"
    }
  ],
  "total_stages": "number",
  "total_amplification": "number — end-to-end amplification ratio",
  "bottleneck_stage": "string — the stage with highest concentration",
  "failure_cascade_direction": "string — which direction failure propagates"
}
```

### Required Evidence

- Runtime flow graphs: `event_flow_graph` (events → handlers), `websocket_flow_graph` (emissions → hooks), `mqtt_topic_graph` (publishers → topics → subscribers)
- The ability to chain stages: events → handlers → WebSocket → frontend hooks
- Count at each stage for ratio computation

### Generating Question Classes

- DESCENT: "Show the propagation chain from [origin]"
- DESCENT: "What is the handler-to-consumer chain?"
- ADJACENT: "Does event concentration compound with the WebSocket funnel?"
- Any question about HOW pressure flows through stages

### Universality

Appears wherever runtime evidence shows multi-stage data flow. The stages change per specimen architecture (events/handlers/WebSocket is BlueEdge-specific) but the chain shape is universal: `source → processing → emission → consumption` with concentration ratios at each stage.

---

## AO-006: Temporal Unavailability

The honest answer: this question cannot be answered with current evidence.

### Schema

```json
{
  "ao_type": "TEMPORAL_UNAVAILABILITY",
  "question": "string — the question that was asked",
  "answerable": false,
  "reason": "string — why it cannot be answered",
  "missing_evidence": "string — what evidence class would be needed",
  "would_require": "string — what the operator would need to do to make it answerable",
  "partial_answer": "string | null — what CAN be said from current evidence"
}
```

### Required Evidence

- The absence of temporal/longitudinal data
- Current evidence is point-in-time — no comparison across runs
- The question asks about trend, acceleration, stability, or change over time

### Generating Question Classes

- Any question containing: "getting worse", "accelerating", "stable", "trending", "over time", "compared to last"
- IMPLICATION with temporal framing: "Is the concentration growing?"
- CHALLENGE with temporal framing: "Is this condition improving?"

### Universality

Universal. Every specimen is currently a point-in-time snapshot. Any temporal question produces this object. When multi-run comparison exists, this object transitions to a **Temporal Trend** object (not yet defined — will emerge when the evidence exists).

---

## AO-007: Convergence Inventory

All conditions touching one domain, grouped by evidence family.

### Schema

```json
{
  "ao_type": "CONVERGENCE_INVENTORY",
  "domain": "string",
  "total_conditions": "number",
  "peak_severity": "string",
  "evidence_families": "number — count of distinct evidence origins",
  "conditions_by_family": {
    "STRUCTURAL": [
      {
        "condition_id": "string",
        "condition_type": "string",
        "severity": "string",
        "evidence_trace": "string — what structural measurement produced this"
      }
    ],
    "RUNTIME": [],
    "COMPOUND": []
  },
  "convergence_assessment": "string — INDEPENDENT | CORRELATED | ECHO"
}
```

### Required Evidence

- `conditions[]` from SignalSynthesisEngine with `affected_domains`
- `domain_concentration[]` from crossDomainCognition
- Condition `evidence_mode` to classify by family (STRUCTURAL_ENRICHMENT_DERIVED vs RUNTIME_EVIDENCE vs COMPOUND)

### Generating Question Classes

- CLARIFY on compound convergence domains: "Which conditions converge on this domain?"
- DESCENT: "Show the condition chain that produces this posture"
- Any question about WHY a domain has high severity

### Universality

Appears for any domain where `condition_count > 2`. In genesis specimen, 5 domains qualify. Any specimen with compound conditions produces this. The grouped-by-family structure is what makes this a cognition object rather than a flat list.

---

## AO-008: Evidence Family Partition

Whether structural evidence and runtime evidence agree, contradict, or reveal hidden patterns.

### Schema

```json
{
  "ao_type": "EVIDENCE_FAMILY_PARTITION",
  "finding_id": "string",
  "structural_conditions": [
    { "condition_id": "string", "severity": "string", "claim": "string — what it asserts" }
  ],
  "runtime_conditions": [
    { "condition_id": "string", "severity": "string", "claim": "string — what it asserts" }
  ],
  "compound_conditions": [
    { "condition_id": "string", "severity": "string" }
  ],
  "structural_count": "number",
  "runtime_count": "number",
  "agreement": "CONFIRMS | CONTRADICTS | REVEALS_HIDDEN | INSUFFICIENT",
  "agreement_evidence": "string — what specifically confirms/contradicts",
  "structural_severity": "string — peak structural",
  "runtime_severity": "string — peak runtime"
}
```

### Required Evidence

- Conditions with `evidence_mode` classification (STRUCTURAL_ENRICHMENT_DERIVED, RUNTIME_EVIDENCE, SIGNAL_DRIVEN)
- At least one structural AND one runtime condition touching the same domain or finding
- The claims of each condition (what they assert about the system)

### Generating Question Classes

- DESCENT: "Which conditions are structurally derived vs runtime-observed?"
- CHALLENGE: "Does runtime evidence confirm or contradict the structural finding?"
- CLARIFY: "Are these multiple independent problems or one problem seen from multiple angles?"

### Universality

Appears whenever a specimen has both structural and runtime evidence (P2+ projection authority). The `agreement` field is the cognitive object — it answers whether the two evidence families are seeing the same thing. This is a meta-cognitive object: evidence about evidence.

---

## AO-009: Independence Assessment

Whether co-located conditions are independently caused or correlated through a shared root.

### Schema

```json
{
  "ao_type": "INDEPENDENCE_ASSESSMENT",
  "domain": "string",
  "conditions_assessed": "string[] — condition IDs",
  "independent_roots": "number — count of truly independent causal chains",
  "condition_clusters": [
    {
      "root_cause": "string — the structural property that generates this cluster",
      "derived_conditions": "string[] — conditions produced by this root",
      "evidence_chain": "string — how the root produces the conditions"
    }
  ],
  "assessment": "INDEPENDENT | PARTIALLY_CORRELATED | MEASUREMENT_ECHO",
  "implication": "string — what the assessment means for severity interpretation"
}
```

### Required Evidence

- Multiple conditions touching the same domain
- Condition `trace` objects (from continuations) showing derivation path
- Structural enrichment data to identify shared roots (e.g., high centrality → coupling → fragility chain)
- The ability to reason about causal chains between conditions

### Generating Question Classes

- CLARIFY on compound convergence: "Are these conditions independent or caused by the same root?"
- CHALLENGE: "Is this really 9 problems or 3 problems measured 3 ways?"
- Any question about whether severity is real compounding or measurement echo

### Universality

Appears wherever `condition_count > 3` for a domain. Determines whether the headline severity (9 conditions, CRITICAL) represents genuine multi-vector risk or an echo of one underlying structural property. Critical for executive interpretation — "9 conditions" means something very different if they're 9 independent problems vs 3 clusters of correlated measurements.

---

## AO-010: Load-Bearing Condition

Counterfactual: which single condition, if removed, would most reduce overall severity.

### Schema

```json
{
  "ao_type": "LOAD_BEARING_CONDITION",
  "domain": "string",
  "load_bearing_condition": {
    "condition_id": "string",
    "condition_type": "string",
    "severity": "string"
  },
  "removal_impact": {
    "severity_before": "string",
    "severity_after": "string — estimated severity with this condition removed",
    "conditions_that_depend": "string[] — conditions that would weaken or disappear",
    "conditions_that_persist": "string[] — conditions unaffected by removal"
  },
  "reasoning": "string — why this condition is load-bearing",
  "actionability": "string — what operational action would address this condition"
}
```

### Required Evidence

- Multiple conditions on a domain (from Convergence Inventory, AO-007)
- Independence Assessment (AO-009) to understand causal clusters
- The ability to reason about which condition is a root vs derived
- Condition severity and the cascade rules (if root weakens, do derived conditions weaken?)

### Generating Question Classes

- CHALLENGE: "Which single change would most reduce the risk?"
- IMPLICATION: "What is the highest-leverage intervention?"
- Any question about prioritization or remediation sequencing

### Universality

Appears for any compound finding. The operator always wants to know: "If I can only fix one thing, what should it be?" This requires both Convergence Inventory (AO-007) and Independence Assessment (AO-009) as inputs — it is a derived answer object.

---

## Ontology Relationships

```
AO-001 Falsification Statement      ← standalone, universal
AO-002 Compounding Verdict          ← requires two findings
AO-006 Temporal Unavailability      ← standalone, universal (absence class)

AO-003 Failure Impact Map           ← requires concentrated node
  └── AO-004 Blast Radius           ← quantitative dimension of AO-003

AO-005 Propagation Chain            ← requires multi-stage flow

AO-007 Convergence Inventory        ← requires multi-condition domain
  └── AO-008 Evidence Family Partition  ← requires mixed evidence families
  └── AO-009 Independence Assessment   ← requires multiple conditions
      └── AO-010 Load-Bearing Condition ← requires AO-007 + AO-009
```

Three independent trees:
1. **Universal** (AO-001, AO-002, AO-006) — always producible
2. **Impact** (AO-003 → AO-004, AO-005) — requires concentrated node or flow
3. **Convergence** (AO-007 → AO-008, AO-009 → AO-010) — requires multi-condition domain

---

## Evidence Requirements Summary

| AO | Minimum Evidence | Additional for Full Resolution |
|----|-----------------|-------------------------------|
| 001 | Any finding + falsification path | Current conditions for verdict |
| 002 | Two findings with affected_domains | Domain role descriptions |
| 003 | Concentrated node + downstream deps | Runtime graphs for capability mapping |
| 004 | Concentrated node + topology | Runtime graphs for path counting |
| 005 | Runtime flow graphs (event/mqtt/ws) | Frontend consumer mapping |
| 006 | Absence of temporal data | None — the absence IS the evidence |
| 007 | conditions[] + domain_concentration | evidence_mode per condition |
| 008 | Mixed structural + runtime conditions | Condition claim descriptions |
| 009 | Multiple conditions on one domain + traces | Structural enrichment for root detection |
| 010 | AO-007 + AO-009 | Cascade reasoning |

---

## Question Class → Answer Object Mapping

| Question Class | Primary AO | Secondary AO |
|---------------|-----------|--------------|
| CHALLENGE (falsification) | AO-001 | — |
| CHALLENGE (convergence test) | AO-002 | AO-001 |
| ADJACENT (surface correlation) | AO-002 | AO-004 |
| DESCENT (runtime evidence) | AO-005 | AO-003 |
| DESCENT (condition chain) | AO-007 | AO-008 |
| IMPLICATION (decisions affected) | AO-003 | AO-004 |
| IMPLICATION (temporal) | AO-006 | — |
| CLARIFY (mechanism) | AO-007 | AO-009 |
| CLARIFY (convergence) | AO-009 | AO-010 |
| ASCENT (board projection) | AO-004 | AO-001 |
