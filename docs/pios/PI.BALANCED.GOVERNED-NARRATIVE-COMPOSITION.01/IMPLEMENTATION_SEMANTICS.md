# Implementation Semantics

## Stream
PI.BALANCED.GOVERNED-NARRATIVE-COMPOSITION.01

---

## 1. Primitive Inventory

| Name | Module | Purpose | Input Source | Reuse Status |
|------|--------|---------|-------------|-------------|
| `projectPosture` | NarrativePrimitives.js | Z1 posture headline + dynamics from consequence posture | `forBalanced()` | REUSABLE |
| `projectReinforcementFlow` | NarrativePrimitives.js | Z2 reinforcement entries + convergence from derived relationships | `forBalanced()` | REUSABLE |
| `projectPrimaryStory` | NarrativePrimitives.js | Z3 primary consequence story from derived primary_story | `forBalanced()` | REUSABLE |
| `composeEpicenterFacts` | NarrativePrimitives.js | Z3 topology fact grid (structural data, not cognition) | `fullReport` (topology) | REUSABLE |
| `composeTrustCalibration` | NarrativePrimitives.js | Z4 trust statement from grounding ratio | `fullReport` (topology) | REUSABLE |
| `composeBriefing` | ZoneComposer.js | Full 5-zone briefing from three governed inputs | `forBalanced()` + `synthesisResult` + `fullReport` | REUSABLE |
| `validateBriefing` | ZoneComposer.js | Runtime briefing validation with cognition source check | — | REUSABLE |
| `validateSentence` | OperationalVocabulary.js | Forbidden pattern check on single sentence | — | REUSABLE |
| `validateComposition` | OperationalVocabulary.js | Forbidden pattern check on composition tree | — | REUSABLE |
| `ZONE_DEFINITIONS` | CompositionContract.js | Zone metadata registry | — | REFERENCE |
| `ZONE_TRANSITIONS` | CompositionContract.js | Zone-to-zone cognitive bridges | — | REFERENCE |
| `ANTI_PATTERNS` | CompositionContract.js | 7 anti-pattern definitions | — | REFERENCE |
| `AUDIENCE_CONTRACT` | CompositionContract.js | Target audience specification | — | REFERENCE |
| `COMPOSITION_RULES` | CompositionContract.js | Governed MAY/MAY_NOT rules (reconciliation-corrected) | — | REFERENCE |
| `POSTURE_HEADLINES` | OperationalVocabulary.js | 4 deterministic headline templates | — | REFERENCE |
| `CONVERGENCE_TEMPLATES` | OperationalVocabulary.js | 3 convergence composition templates | — | REFERENCE |
| `TRUST_TEMPLATES` | OperationalVocabulary.js | 3 trust calibration templates | — | REFERENCE |
| `FORBIDDEN_PATTERNS` | OperationalVocabulary.js | Regex patterns for drift detection | — | REFERENCE |

---

## 2. Input Contracts

### Primary Input: `balancedProjection` (from `ConsequenceCompiler.forBalanced()`)

| Field | Type | Consumed By |
|-------|------|------------|
| `posture_label` | string | Z1 `projectPosture` |
| `posture_severity` | string (CRITICAL/HIGH/ELEVATED/NOMINAL) | Z1 headline selection |
| `posture_scope` | string (SYSTEMIC/REGIONAL/LOCAL) | Z1 scope chip |
| `combined_synthesis` | string | Z1 dynamics narrative |
| `primary_locus` | string | Z1, Z2, Z3 anchor reference |
| `consequence_count` | number | Z1 metadata |
| `systemic_count` | number | Z1 metadata |
| `overall_confidence` | string | Z4 reference |
| `overall_confidence_label` | string | Z4 reference |
| `primary_story` | object | Z3 `projectPrimaryStory` |
| `primary_story.consequence_type_id` | string | Z3 evidence chain |
| `primary_story.title` | string | Z3 title display |
| `primary_story.operational_implication` | string | Z3 narrative text |
| `primary_story.severity` | string | Z3 metadata |
| `primary_story.confidence_label` | string | Z3 metadata |
| `primary_story.scope` | string | Z3 metadata |
| `primary_story.locus` | string | Z3 anchor name |
| `primary_story.source_conditions` | array | Z3 condition list |
| `primary_story.is_combination` | boolean | Z3 combination rendering |
| `primary_story.combination_explanation` | string | Z3 combination text |
| `reinforcement_flow` | array | Z2 `projectReinforcementFlow` |
| `reinforcement_flow[].consequence_type_id` | string | Z2 entry ID |
| `reinforcement_flow[].title` | string | Z2 entry title |
| `reinforcement_flow[].relationship_verb` | string | Z2 verb display, convergence detection |
| `reinforcement_flow[].relationship_sentence` | string | Z2 entry sentence |
| `reinforcement_flow[].operational_implication` | string | Z2 entry detail |
| `reinforcement_flow[].severity` | string | Z2 entry metadata |
| `reinforcement_flow[].confidence_label` | string | Z2 entry metadata |
| `confidence_sentence` | string | Future: Z4 enrichment |

### Secondary Input: `synthesisResult` (from `SignalSynthesisEngine.synthesize()`)

| Field | Type | Consumed By |
|-------|------|------------|
| `conditions` | array | Z2 collapsed condition disclosure (display only) |
| `conditions[].condition_type` | string | Z2 condition label |
| `conditions[].severity` | string | Z2 condition severity |
| `conditions[].display_title` | string | Z2 condition display |

### Tertiary Input: `fullReport` (topology data ONLY)

| Field | Type | Consumed By |
|-------|------|------------|
| `dpsig_signal_summary.normalization_basis` | object | Z3 facts (node counts, cluster ID) |
| `signal_interpretations` | array | Z3 facts (activation counts — display data) |
| `topology_summary` | object | Z3 facts + Z4 trust bar (grounding ratio) |
| `qualifier_summary` | object | Z1 advisory chip, Z4 trust |
| `readiness_badge` | object | Z1 badge chip |

### What fullReport Is NOT Used For

| Forbidden Use | Why |
|---------------|-----|
| Deriving posture | Owned by `ConsequenceCompiler.forBalanced().posture_label` |
| Grouping signals into themes | Owned by `SignalSynthesisEngine.synthesize().conditions` |
| Detecting convergence | Owned by `ConsequenceCompiler` combination detection |
| Deriving operational meaning | Owned by `ConsequenceCompiler` consequence derivation |
| Assessing severity | Owned by `ConsequenceCompiler` severity escalation |

---

## 3. Output Contracts

### `composeBriefing(balancedProjection, synthesisResult, fullReport)` → BriefingOutput

```
{
  valid: boolean,
  zones: {
    z1: {
      zone: ZoneDefinition,
      headline: string,
      dynamics: string,
      posture_label: string,
      posture_severity: string,
      posture_scope: string,
      consequence_count: number,
      chips: [{label, tone}],
      primitives: [PrimitiveOutput],
    },
    z2: {
      zone: ZoneDefinition,
      entries: [{consequence_type_id, title, relationship_verb, relationship_sentence, operational_implication, severity, confidence_label}],
      convergence: string | null,
      entry_count: number,
      condition_count: number,
      condition_count_label: string,
      conditions_for_disclosure: [{condition_type, severity, display_title}],
      primitives: [PrimitiveOutput],
    },
    z3: {
      zone: ZoneDefinition,
      anchorName: string,
      subtitle: string,
      title: string,
      text: string,
      is_combination: boolean,
      combination_explanation: string | null,
      source_conditions: [{condition_type, display_title}],
      facts: [{key, value, tone?}],
      flow: {origin, target},
      primitives: [PrimitiveOutput],
    },
    z4: {
      zone: ZoneDefinition,
      statement: string,
      confirmed: number,
      total: number,
      semanticOnly: number,
      groundingRatio: number,
      bar: {confirmedPercent, confirmedLabel, advisoryLabel},
      primitives: [PrimitiveOutput],
    },
    z5: {
      zone: ZoneDefinition,
      paths: [{target, label, description}],
      primitives: [],
    },
  },
  metadata: {
    primitive_count: number,
    evidence_chain_count: number,
    validation: ValidationResult,
    zone_definitions: string[],
    transitions: number,
    cognition_source: 'ConsequenceCompiler.forBalanced()',
  },
}
```

### PrimitiveOutput shape

```
{
  text: string,
  evidenceChain: [{source, field, value}],
  primitive_id: string,
  zone: string,
  authority: 'DETERMINISTIC',
}
```

---

## 4. Calibration Assumptions

| Parameter | Current Value | Governance |
|-----------|---------------|------------|
| Headline severity mapping | CRITICAL→EXPOSED, HIGH→CONCENTRATED, ELEVATED→ELEVATED, else→NOMINAL | GOVERNED — maps from forBalanced().posture_severity |
| Convergence detection | convergent verbs (amplifies/reinforces/concentrates) in reinforcement_flow | GOVERNED — reads ConsequenceCompiler relationship verbs |
| Trust template selection | grounding_ratio = 0 / >0 / ≥1.0 | GOVERNED — deterministic from topology data |
| Pressure chip threshold | posture_severity CRITICAL or HIGH | GOVERNED — from forBalanced() |

---

## 5. Extension Points

| Extension | Where | How |
|-----------|-------|-----|
| New headline variant | OperationalVocabulary.js `POSTURE_HEADLINES` | Add severity→headline mapping |
| SW-Intel enrichment wiring | ZoneComposer.js zone functions | Thread forBalanced() output to rendering components |
| New anti-pattern | CompositionContract.js `ANTI_PATTERNS` | Add AP-NN entry |
| Vocabulary expansion | OperationalVocabulary.js verb/noun arrays | Add governed words |
| New zone | CompositionContract.js `ZONE_DEFINITIONS` + ZoneComposer.js | Full zone definition + composer function |
| Confidence enrichment | composeTrustCalibration | Consume forBalanced().confidence_sentence alongside topology |

---

## 6. Module Responsibility Map

| File | Owns | Does NOT Own |
|------|------|-------------|
| `OperationalVocabulary.js` | Allowed/forbidden language, severity vocabulary, template fragments, sentence validation | Posture derivation, convergence detection |
| `NarrativePrimitives.js` | 5 projection orchestration primitives, evidence chain construction, primitive registry | Meaning derivation, severity assessment, theme grouping |
| `CompositionContract.js` | Zone definitions, transition rules, anti-patterns, audience contract, visual pacing, composition rules | Consequence computation, combination detection |
| `ZoneComposer.js` | Zone-level projection composition, full briefing assembly, briefing validation | Cognition derivation of any kind |
| `index.js` | Barrel export | — |

---

## 7. Reconciliation Record

This implementation was corrected after `BALANCED_COMPOSITION_ARCHITECTURE_RECONCILIATION.md` identified that Phase 1 primitives created a parallel cognition path alongside `ConsequenceCompiler.forBalanced()`.

**Corrective action applied:**
- 6 derivation primitives removed (composePostureHeadline, composePostureDynamics, composePressureThemes, composePressureConvergence, composeEpicenterPortrait, composeEpicenterMeaning)
- 3 projection orchestration primitives added (projectPosture, projectReinforcementFlow, projectPrimaryStory)
- 2 topology projection primitives retained (composeEpicenterFacts, composeTrustCalibration)
- composeBriefing input contract changed from `(fullReport)` to `(balancedProjection, synthesisResult, fullReport)`
- COMPOSITION_RULES updated to explicitly forbid parallel cognition derivation
- Evidence chains corrected to reference forBalanced() output, not raw signal_interpretations

**Root cause:** AMOps Phase 4 (Concept-Specific Load) was not executed during preflight. ConsequenceCompiler.forBalanced() was not loaded and cross-referenced before creating primitives, resulting in accidental meaning re-derivation.
