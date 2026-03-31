# Execution Blindness Examples — Narrative Expansion

Stream: I.6 — Hardening Batch 03 (PROVISIONAL PROMOTION — SET B)
Phase: Canonical Gap Closure — Derivative Narrative
Entity: execution_blindness_examples
Narrative Depth: standard (level 2)
Authority: nodes/execution_blindness_examples.md | execution_blindness.md | execution_stability_index.md | risk_acceleration_gradient.md
Date: 2026-03-31

---

## Execution Blindness Examples

### Definition

Structured representation of the structural patterns through which execution blindness manifests in program environments. Not case studies or anecdotal scenarios — pattern types derived from the canonical execution_blindness condition and its relationships with ESI, RAG, and the five ESI dimensions.

### What It Is

A pattern illustration layer for the execution blindness entity. Each pattern type represents a named configuration of ESI and RAG conditions in which operational activity metrics remain stable or acceptable while the program's structural health is deteriorating. The patterns are derived from the logical and mathematical properties of the ESI and RAG constructs — they are not independently sourced or empirically inductive.

Three canonical execution blindness pattern types are defined:

**Pattern Type 1 — Activity-Stability Divergence:**
The fundamental execution blindness pattern. Operational activity metrics (commit volume, ticket closure, deployment frequency, sprint velocity) remain within normal ranges across consecutive measurement windows. ESI composite score is simultaneously declining. The two conditions are consistent — they are measuring different properties of the same program. Activity metrics describe what teams are doing; ESI describes the structural health of what that activity is producing. Divergence between the two is the defining signature of execution blindness.

This pattern type is detectable as: stable or improving activity metrics concurrent with ESI decline of any magnitude across the same measurement window sequence.

**Pattern Type 2 — RAG Lead-Time Pattern:**
The leading-indicator execution blindness configuration. RAG enters positive acceleration territory before ESI composite decline is severe enough to register as a governance concern. The program's activity metrics remain normal. ESI may still be in the Emerging Instability band (70–84) or the Compounding Stress band (55–69). RAG is simultaneously in sustained positive acceleration.

This pattern type is structurally significant because it precedes Pattern Type 1 — it represents the condition in which structural deterioration is underway but not yet fully reflected in ESI composite. The RAG acceleration indicates risk accumulation is compounding; ESI decline follows as the accumulated risk degrades the structural health dimensions.

The lead-time property of this pattern: because RAG registers acceleration before ESI composite reflects the downstream consequence, monitoring for Pattern Type 2 provides an additional detection window ahead of Pattern Type 1. The magnitude of this lead time is bounded by the RAG-to-ESI propagation rate, which depends on program structure and the specific dimension(s) under stress.

**Pattern Type 3 — Dimension-Composite Divergence:**
A variation of Pattern Type 1 that operates at the dimension level. One or more individual ESI dimensions are deteriorating while the ESI composite score remains in an acceptable band. The composite score obscures the dimension-level stress because the remaining stable dimensions maintain the composite average.

Structural significance: dimension-level deterioration that precedes composite ESI decline is the earliest detectable execution blindness signal in the Program Intelligence model. A program with an ESI composite of 72 (Emerging Instability) may have Schedule Stability at 48 (Critical Exposure level) and Cost Stability at 35 (Critical Exposure) while Delivery Predictability and Flow Compression remain stable — producing a composite score that does not reflect the severity of the stress in the deteriorating dimensions.

This pattern type requires dimension-level monitoring rather than composite-only monitoring. Detection is through individual dimension trajectories, not composite trajectory.

### What It Is Not

- Not a set of anecdotal case records. The pattern types are derived from the logical properties of the ESI and RAG constructs — they are structural pattern definitions, not documented incident histories. They describe what execution blindness looks like when mapped through the Program Intelligence model, not what specific programs did.
- Not a failure prediction framework. The three pattern types identify structural conditions that constitute execution blindness. They do not predict failure outcomes, timelines, or severity. The patterns are observable; the outcomes depend on whether structural intervention occurs.
- Not a substitute for ESI and RAG computation. The pattern types are interpretations of ESI and RAG output sequences. They require actual ESI and RAG values to be applicable. The patterns are not heuristics that can be applied without computed construct outputs.
- Not an exhaustive classification. The three pattern types cover the primary structural configurations of execution blindness. Other configurations may exist in specific program environments; these three represent the canonical pattern class for the derivative entity.

### Role in Program Intelligence

Execution blindness examples serve as the concrete referential layer for the execution blindness entity. Where execution blindness defines the condition abstractly ("appears operationally normal while structural instability signals are already emerging"), this entity provides the structural pattern vocabulary through which that condition is recognizable in practice.

The position in the model:

```
Execution Blindness (condition definition)
    ↓ illustrated by
Execution Blindness Examples (pattern types)
    ↓ detected through
Early Warning Signals (detection layer)
    ↓ measured by
ESI + RAG (analytical constructs)
```

Without the pattern illustration layer, execution blindness is a defined condition with no reference for how it presents structurally. The pattern types close that gap by naming the structural configurations through which the condition manifests.

### Relationship to Execution Blindness (Parent Construct)

The parent construct defines execution blindness as a structural condition. This entity derives the pattern types entirely from that definition — it does not extend, modify, or reinterpret the parent construct.

The mapping of parent construct to derived patterns:

- Parent: "appears operationally normal" → Pattern Type 1 and 3: activity metrics or composite ESI remain acceptable while structural deterioration proceeds
- Parent: "structural instability signals are already emerging" → the ESI decline and RAG acceleration states that Pattern Types 1, 2, and 3 identify as co-present with the operational normality condition
- Parent: "across program dimensions" → Pattern Type 3's dimension-level analysis, which makes explicit that the "across dimensions" claim requires dimension-level monitoring

All three pattern types are direct structural derivations from the execution_blindness canonical definition. No pattern type introduces a condition outside the scope of the parent construct.

### Example Pattern Types (Derived, Not Anecdotal)

**Pattern Type 1 — Activity-Stability Divergence**

Observable properties:
- Activity metrics: stable or improving across N consecutive windows
- ESI composite: declining across the same N consecutive windows
- RAG state: may be neutral, negative, or positive (Pattern Type 1 does not require concurrent RAG acceleration)

Structural interpretation: the program is producing activity while its structural delivery capacity is degrading. The activity production and the capacity degradation are not contradictory — they describe different system properties. The divergence indicates that activity volume is being maintained through structural cost (compressing margins, absorbing future delivery capacity, deferring structural debt).

Detection requirement: minimum two consecutive ESI values showing decline concurrent with stable or improving activity metrics.

**Pattern Type 2 — RAG Lead-Time**

Observable properties:
- RAG: in positive acceleration territory across 2+ consecutive windows
- ESI composite: at or above Compounding Stress band (55+) — structural deterioration not yet severe at composite level
- Activity metrics: stable or normal

Structural interpretation: risk is accumulating net-new at an increasing rate while the program's composite structural health has not yet reflected the downstream consequence. The lead-time property is structural: RAG captures the rate of risk change; ESI captures the accumulated structural consequence of that change. The time between RAG acceleration onset and ESI decline onset is the intervention window — the period during which structural response can be applied before the ESI consequence registers.

Detection requirement: minimum two consecutive positive RAG values while ESI remains above 55; activity metrics stable.

**Pattern Type 3 — Dimension-Composite Divergence**

Observable properties:
- One or more ESI dimensions: declining or in deterioration pattern across consecutive windows
- ESI composite: stable or declining slowly — acceptable band maintained by stable remaining dimensions
- Activity metrics: stable or normal

Structural interpretation: the composite ESI score is masking dimension-level structural stress. Programs under this pattern type are structurally more fragile than the composite score indicates — the stable dimensions are sustaining the composite average while the deteriorating dimensions compound. When the deteriorating dimensions cross into critical levels, the composite will fall sharply because the masking effect of the stable dimensions reaches its limit.

Detection requirement: at least one ESI dimension in sustained decline pattern (2+ windows) while ESI composite remains in acceptable range.

### Structural Impact on Signals

Each pattern type has a defined structural impact on the underlying signals:

**Pattern Type 1:** Structural Pressure signal is rising (indicating delivery architecture is operating under increasing load) while activity counts remain stable. The divergence between Structural Pressure and activity level is the signal-layer signature of Pattern Type 1.

**Pattern Type 2:** Risk Propagation signal is showing cross-boundary spread onset while Structural Pressure and Delivery Divergence signals remain below immediate concern thresholds. RAG's acceleration is driven by the Risk Propagation signal's cross-boundary component increasing faster than it is resolving.

**Pattern Type 3:** One or more of the individual signals feeding the deteriorating ESI dimensions is in decline. The Delivery Divergence signal may be rising in the delivery predictability dimension while the Structural Pressure signal in the schedule stability dimension remains stable — producing a mixed signal state that the composite ESI smooths but does not resolve.

In all three pattern types, the signal-layer condition is structurally consistent with the pattern description. The signals are not in conflict with the activity metrics — they are measuring a different dimension of the same program state.

### Claim Boundary

Claims of this entity are bounded to:

- The three canonical pattern types as structural derivations from the execution_blindness definition and the ESI/RAG analytical constructs
- The observable properties of each pattern type as detectable configurations of ESI values, RAG values, and activity metric states
- The lead-time property of Pattern Type 2 as a structural observation, not a guaranteed advance notice period

Claims must not:

- Assert that any specific pattern type will result in program failure — patterns describe structural conditions; outcomes depend on governance response
- Claim that the three pattern types are exhaustive of all possible execution blindness configurations — they are canonical patterns for the Phase 1 derivative entity, not a complete taxonomy
- Introduce signal states or telemetry conditions outside the ESI and RAG canonical construct definitions
- Position pattern types as predictive models — they are observational pattern definitions applied to computed construct outputs

### Canonical Source

Authority container status: established. The execution_blindness_examples entity is a Phase 1 Category A Routed Derivative Entity per nodes/execution_blindness_examples.md. The three pattern types are derived directly from the execution_blindness canonical narrative, the ESI narrative, and the RAG narrative.

Sources:
- nodes/execution_blindness_examples.md — entity classification, relationships, boundaries
- docs/governance/derivatives/narratives/execution_blindness.md — parent construct definition; canonical condition description
- docs/governance/derivatives/narratives/execution_stability_index.md — ESI construct; five dimensions; state measurement
- docs/governance/derivatives/narratives/risk_acceleration_gradient.md — RAG construct; dynamics measurement; acceleration detection
- docs/governance/derivatives/narratives/signal_infrastructure.md — signal categories; Structural Pressure, Delivery Divergence, Risk Propagation
- Authority codes: CKR-001 | CKR-014 | CKR-015 | CAT-00
