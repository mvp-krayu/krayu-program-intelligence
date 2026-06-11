# THORR Invocation Contract

**Purpose:** Define exactly what each synthesis intent sends to THORR. The bridge between chip state machine and right-panel synthesis.
**Date:** 2026-06-11
**Principle:** Intent is the primary object. Persona is the projection target. The same intent produces the same synthesis — only rendering changes.

---

## Intent Registry

Six synthesis intents. Each can be invoked from multiple personas.

| Intent | What it answers | Required for |
|--------|----------------|-------------|
| `governance_decision` | Which decisions are affected by this finding? | Board, executive, transformation |
| `qualification_review` | How confident should we be in this finding? | Any altitude — qualification is universal |
| `operational_impact` | What operational coordination, delivery, or monitoring changes? | CTO, delivery lead, program office |
| `structural_mechanism` | Why does this structural pattern exist? What causes it? | Architect, staff engineer |
| `compounding_analysis` | Does this finding amplify or compound with others? | Any altitude |
| `evidence_verification` | Is the evidence sufficient? What's missing? | Operator, investigator |

---

## Invocation Shape

Every THORR synthesis call sends one object:

```javascript
{
  // What to synthesize
  intent: 'governance_decision' | 'qualification_review' | 'operational_impact' | 'structural_mechanism' | 'compounding_analysis' | 'evidence_verification',

  // What finding drives the synthesis
  finding: {
    id: 'AF-001',
    surface: 'GRAVITY_DIVERGENCE',
    severity: 'CRITICAL',
    posture_label: 'Systemic Operational Fragility',
  },

  // What answer object structures the synthesis (if resolved)
  answer_object: {
    ao_type: 'DIVERGENCE_PAIR' | null,
    ao_id: 'AO-011' | null,
    instance: { /* AO-specific fields */ } | null,
  },

  // Where the operator is (determines projection, not synthesis)
  persona: 'BOARDROOM' | 'BALANCED' | 'DENSE' | 'OPERATOR',

  // Investigation context (if active)
  investigation: {
    id: 'inv_GRAVITY_DIVERGENCE_1' | null,
    state: 'ACTIVE' | null,
    proven_steps: ['ps_descent_0'] | [],
    active_step_id: 'ps_challenge_2' | null,
  },

  // Evidence available for grounding
  evidence: {
    projection_level: 2,
    qualification_state: 'S2',
    evidence_layers: ['STATIC_IMPORT', 'EVENT_FLOW', 'MQTT_TOPIC_FLOW', 'WEBSOCKET_FLOW'],
    rsig_count: 7,
    condition_count: 21,
    domain_count: 17,
  },
}
```

**The intent determines WHAT to synthesize. The persona determines HOW to render. The evidence determines WHAT to ground on.**

---

## Per-Intent Synthesis Contracts

### `governance_decision`

**Question:** Which governance decisions are affected?

**THORR receives:**
```javascript
{
  intent: 'governance_decision',
  finding: { ... },
  answer_object: { ao_type: 'DIVERGENCE_PAIR', ... },
  persona: 'BOARDROOM',
  ...
}
```

**THORR returns:**
```javascript
{
  synthesis_type: 'governance_decision',
  decisions_affected: [
    {
      decision: 'Platform modernization investment allocation',
      assumption: 'Structural mass predicts operational risk',
      exposure: 'Budget targets structurally heavy region while risk accumulates elsewhere',
      confidence: 'HIGH',
    }
  ],
  summary: 'string — 1-2 sentence executive answer',
  qualification: 'string — evidence confidence assessment',
  next_intents: ['qualification_review', 'operational_impact'],
}
```

**Persona projection:**
- BOARDROOM: decisions as disclosure cards. No technical detail. "You may be investing in the wrong place."
- BALANCED: decisions with operational mechanism. "Investment follows structural gravity but risk follows operational gravity."
- DENSE: decisions with structural evidence traces. Full mechanism + domain references.

### `qualification_review`

**Question:** How confident should we be?

**THORR receives:**
```javascript
{
  intent: 'qualification_review',
  finding: { ... },
  evidence: { projection_level: 2, qualification_state: 'S2', ... },
  ...
}
```

**THORR returns:**
```javascript
{
  synthesis_type: 'qualification_review',
  confidence_level: 'HIGH' | 'MODERATE' | 'LOW' | 'ADVISORY_ONLY',
  evidence_basis: [
    { layer: 'STATIC_IMPORT', status: 'PRESENT', contribution: 'Structural gravity confirmed' },
    { layer: 'EVENT_FLOW', status: 'PRESENT', contribution: 'Event concentration measured' },
    { layer: 'MQTT_TOPIC_FLOW', status: 'PRESENT', contribution: 'Broker dependency confirmed' },
  ],
  gaps: [
    { layer: 'TEMPORAL', status: 'ABSENT', impact: 'Cannot assess trend — point-in-time only' },
  ],
  qualification_state: 'S2',
  governance_weight: 'Governed — replay-certified, structurally confirmed',
  summary: 'string — confidence statement',
  next_intents: ['evidence_verification'],
}
```

**Persona projection:**
- BOARDROOM: "This finding carries governed institutional confidence. S2 qualified, replay-certified."
- BALANCED: "Confidence is HIGH. 4 of 6 evidence layers present. Temporal trend unknown."
- DENSE: Full evidence layer table with per-layer status and contribution.
- OPERATOR: Evidence layer verification checklist with pass/fail per layer.

**Key property:** This is the same synthesis regardless of starting persona. A board member asking "How confident?" gets the same qualification data as an architect — only the rendering changes.

### `operational_impact`

**Question:** What operations are affected?

**THORR receives:**
```javascript
{
  intent: 'operational_impact',
  finding: { ... },
  answer_object: { ao_type: 'DIVERGENCE_PAIR', ... },
  ...
}
```

**THORR returns:**
```javascript
{
  synthesis_type: 'operational_impact',
  impacts: [
    {
      operation: 'Delivery coordination',
      assumption_violated: 'Static dependency analysis reflects runtime coordination load',
      consequence: 'Release decisions based on import graph miss runtime propagation paths',
      severity: 'HIGH',
    },
    {
      operation: 'Incident response',
      assumption_violated: 'Structural hotspots predict operational failures',
      consequence: 'Runbooks target Platform Infrastructure while incidents originate in Fleet Core Operations',
      severity: 'ELEVATED',
    },
    {
      operation: 'Monitoring coverage',
      assumption_violated: 'Static analysis coverage equals runtime observability',
      consequence: 'Runtime pressure paths through event handlers and MQTT broker are unmonitored',
      severity: 'ELEVATED',
    },
  ],
  summary: 'string',
  qualification: 'string',
  next_intents: ['governance_decision', 'structural_mechanism'],
}
```

**Persona projection:**
- BOARDROOM: "3 operational areas affected. Delivery, incident response, and monitoring assumptions may be invalid."
- BALANCED: Full impact table with violated assumptions and consequences. Reinforcement relationships shown.
- DENSE: Impact table with structural evidence traces per violated assumption.

### `structural_mechanism`

**Question:** Why does this structural pattern exist?

**THORR receives:**
```javascript
{
  intent: 'structural_mechanism',
  finding: { ... },
  answer_object: { ao_type: 'DIVERGENCE_PAIR', instance: { domain_a: {...}, domain_b: {...}, divergence: {...} } },
  ...
}
```

**THORR returns:**
```javascript
{
  synthesis_type: 'structural_mechanism',
  mechanism: {
    cause: 'Import graph concentrates structural mass in Platform Infrastructure. Runtime event/WebSocket/MQTT flows concentrate operational load in Fleet Core Operations.',
    structural_evidence: [
      'Platform Infrastructure: 5 conditions, CRITICAL compound convergence',
      'Domain concentration[0] = Platform Infrastructure',
    ],
    runtime_evidence: [
      'Fleet Core Operations: 2 RSIG signals (ELEVATED, HIGH)',
      'Event handler concentration: 53 events → 4 handlers',
      'WebSocket gateway: single fan-out point',
    ],
    divergence_explanation: 'Code was built around Platform Infrastructure (monolith origin). Operations evolved around Fleet Core Operations (event-driven runtime). The architectures diverged but the investment model still follows the code structure.',
  },
  summary: 'string',
  qualification: 'string',
  next_intents: ['compounding_analysis', 'operational_impact'],
}
```

**Persona projection:**
- BOARDROOM: Not projected directly. BOARDROOM gets `governance_decision` instead. (AO-011 is intermediate — BOARDROOM sees the downstream implication, not the mechanism.)
- BALANCED: Mechanism summary + reinforcement dynamics. "Code gravity pulls investment one way. Operational gravity pulls risk the other."
- DENSE: Full mechanism with structural + runtime evidence columns side by side. Evidence Family Partition (AO-008) rendered.
- OPERATOR: Evidence trace per claim. Verification checklist.

### `compounding_analysis`

**Question:** Does this finding compound with others?

**THORR receives:**
```javascript
{
  intent: 'compounding_analysis',
  finding: { ... },
  // Adjacent surfaces from CognitiveContinuations
  adjacent_surfaces: ['EXECUTION_BLINDNESS', 'STRUCTURAL_FRAGILITY', 'OPERATIONAL_TOPOLOGY'],
  ...
}
```

**THORR returns:**
```javascript
{
  synthesis_type: 'compounding_analysis',
  verdicts: [
    {
      surface: 'EXECUTION_BLINDNESS',
      compounds: true,
      bridge_domains: ['Fleet Core Operations', 'Telemetry Transport and Messaging'],
      mechanism: 'Operational gravity concentrates in a region that is also blind to runtime dependencies',
      compound_severity: 'CRITICAL',
    },
    {
      surface: 'STRUCTURAL_FRAGILITY',
      compounds: false,
      bridge_domains: [],
      mechanism: null,
    },
  ],
  summary: 'string',
  qualification: 'string',
  next_intents: ['governance_decision'],
}
```

**Persona projection:**
- All personas: same verdict structure. BOARDROOM shows compound_severity only. BALANCED shows mechanism. DENSE shows bridge domains with topology emphasis.

### `evidence_verification`

**Question:** Is the evidence sufficient? What's missing?

**THORR receives:**
```javascript
{
  intent: 'evidence_verification',
  finding: { ... },
  evidence: { ... },
  ...
}
```

**THORR returns:**
```javascript
{
  synthesis_type: 'evidence_verification',
  verification_steps: [
    { claim: 'Structural center is Platform Infrastructure', evidence: 'domain_concentration[0]', status: 'VERIFIED', confidence: 'HIGH' },
    { claim: 'Execution center is Fleet Core Operations', evidence: 'RSIG signal concentration', status: 'VERIFIED', confidence: 'ELEVATED' },
    { claim: 'Centers are different domains', evidence: 'string comparison', status: 'VERIFIED', confidence: 'HIGH' },
    { claim: 'Divergence is not converging', evidence: 'no temporal data', status: 'UNVERIFIABLE', confidence: 'N/A' },
  ],
  overall_verdict: 'VERIFIED_WITH_GAPS',
  summary: 'string',
  gaps: ['Temporal trend unknown — cannot assess convergence/divergence trajectory'],
  next_intents: ['qualification_review'],
}
```

**Persona projection:**
- OPERATOR: Full verification checklist with per-claim status. This is the native OPERATOR rendering.
- DENSE: Verification summary with confidence levels.
- BALANCED/BOARDROOM: "Evidence verified with one gap: temporal trend unknown."

---

## Intent × Persona × Chip Mapping

| Persona | Chip Label | Intent | Type |
|---------|-----------|--------|------|
| BOARDROOM | "What should we decide?" | `governance_decision` | 1 |
| BOARDROOM | "How confident is this?" | `qualification_review` | 1 |
| BOARDROOM | "What else is affected?" | `compounding_analysis` | 1 |
| BOARDROOM | "Show me the proof" | `evidence_verification` | 2 → OPERATOR |
| BALANCED | "What operations are affected?" | `operational_impact` | 1 |
| BALANCED | "Prove it" | `evidence_verification` | 2 → OPERATOR |
| BALANCED | "Show the evidence" | `structural_mechanism` | 2 → DENSE |
| BALANCED | "Board summary" | — | 3 → BOARDROOM |
| DENSE | "Why does this happen?" | `structural_mechanism` | 1 |
| DENSE | "What does this compound with?" | `compounding_analysis` | 1 |
| DENSE | "Verify the evidence" | `evidence_verification` | 2 → OPERATOR |
| DENSE | "How does the CTO see this?" | — | 3 → BALANCED |

Type 1 chips invoke `handleInlineSynthesis(intent)`.
Type 2 chips invoke `handleModeTransition(targetMode, ...)` with investigation creation.
Type 3 chips invoke `handleProjectionShift(targetMode)`.

---

## The Core Principle

```
SAME INTENT + DIFFERENT PERSONA = SAME SYNTHESIS + DIFFERENT PROJECTION
```

`qualification_review` from BOARDROOM and `qualification_review` from DENSE produce the same THORR synthesis. The right panel renders it differently:
- BOARDROOM: "Governed institutional confidence. S2 qualified."
- DENSE: "4/6 layers present. Per-layer: STATIC_IMPORT ✓, EVENT_FLOW ✓, MQTT ✓, TEMPORAL ✗."

The invocation contract is persona-agnostic. The projection layer is persona-specific.

---

## What `handleInlineSynthesis` Receives

```javascript
function handleInlineSynthesis(intent) {
  const invocation = {
    intent,
    finding: deriveActiveFinding(investigationContext, crossDomainCognition),
    answer_object: deriveActiveAnswerObject(investigationContext, crossDomainCognition),
    persona: densityClass,
    investigation: investigationContext ? {
      id: investigationContext.id,
      state: investigationContext.state,
      proven_steps: investigationContext.proofSteps.filter(s => s.status === 'EXAMINED').map(s => s.id),
      active_step_id: investigationContext.activeStepId,
    } : null,
    evidence: {
      projection_level: projectionAuthority ? projectionAuthority.projectionLevel : 0,
      qualification_state: projectionAuthority ? projectionAuthority.qualificationState : 'S0',
      evidence_layers: (visibilityLayerCompleteness && visibilityLayerCompleteness.layers_present) || [],
      rsig_count: (fullReport.signal_interpretations || []).filter(s => s.signal_family === 'RSIG').length,
      condition_count: (synthesisResult && synthesisResult.conditions) ? synthesisResult.conditions.length : 0,
      domain_count: (fullReport.topology_scope && fullReport.topology_scope.domain_count) || 0,
    },
  }

  // v1: deterministic synthesis (code-based)
  const result = synthesizeByIntent(invocation)

  // v2: THORR API call
  // const result = await callTHORR(invocation)

  setActiveSynthesis(result)
}
```

This is the bridge. The chip state machine calls `handleInlineSynthesis(intent)`. The intent determines the synthesis. The persona determines the rendering. The evidence grounds the response.
