# BALANCED Composition Architecture Reconciliation

## Stream
PI.BALANCED.GOVERNED-NARRATIVE-COMPOSITION.01 — Phase 1 Reconciliation Check

## Classification
CRITICAL — Reconciliation required before Phase 2 wiring.

---

## 1. Reconciliation Verdict

**PARALLEL COGNITION PATH DETECTED.**

NarrativePrimitives.js as initially implemented reads raw `fullReport` and independently derives operational meaning. This duplicates the governed derivation pipeline:

```
Signal Families → SignalSynthesisEngine → ConsequenceCompiler → forBalanced()
```

Six of eight primitives re-derive what the consequence pipeline already produces. This is the forbidden pattern: two semantic compilers producing parallel cognition from the same evidence.

---

## 2. Existing Cognition Pipeline (CANONICAL)

```
L1  Signal Families (PSIG, DPSIG, ISIG)
     │
     ▼
L2  SignalSynthesisEngine.synthesize()
     │  Produces: 7 condition types (DPC, DCkP, PA, SMC, CDCP, GCS, CC)
     │  Each condition carries: severity, shared_topology_targets, 
     │  governance_boundary, topology_overlay
     │
     ▼
L3  ConsequenceCompiler.compile()
     │  Produces: consequence objects (10 atomic types, 3 combination patterns)
     │  Each carries: severity, confidence, scope, primary_locus,
     │  operational_implication, source_conditions, derivation_trace
     │
     ▼
L4  ConsequenceCompiler.forBalanced()
     │  Produces: persona-projected consequence briefing
     │  - posture_label, posture_severity, posture_scope
     │  - primary_story (title, operational_implication, source_conditions)
     │  - reinforcement_flow (relationship_verb, relationship_sentence)
     │  - combined_synthesis
     │  - confidence_sentence
     │
     ▼
L5  BALANCED Composition Layer (NEW — THIS STREAM)
     │  Governs: vocabulary, sequencing, pacing, transitions, anti-patterns
     │  DOES NOT: derive, compile, synthesize, interpret
     │
     ▼
L6  IntelligenceField.jsx → Rendering
```

---

## 3. What Already Exists — Concept Ownership

| Concept | Owner | Status |
|---------|-------|--------|
| Signal derivation | SignalSynthesisEngine | OPERATIONAL |
| Condition synthesis | SignalSynthesisEngine.synthesize() | OPERATIONAL |
| Consequence derivation | ConsequenceCompiler.compile() | OPERATIONAL |
| Consequence deduplication | ConsequenceCompiler (deduplicateConsequences) | OPERATIONAL |
| Combination detection | ConsequenceCompiler (detectCombinations, §5) | OPERATIONAL |
| Severity escalation | ConsequenceCompiler (SEVERITY_ESCALATION, §6) | OPERATIONAL |
| Consequence vocabulary | CONSEQUENCE_VOCABULARY (10 types) | LOCKED |
| Cognition slice vocabulary | COGNITION_SLICE_VOCABULARY (5 types) | LOCKED |
| BOARDROOM projection | forBoardroom() | OPERATIONAL |
| BALANCED projection | forBalanced() | OPERATIONAL |
| INVESTIGATION projection | forInvestigation() | OPERATIONAL |
| Posture label derivation | derivePostureLabel() | OPERATIONAL |
| Relationship verb derivation | deriveRelationshipVerb() | OPERATIONAL |
| Relationship sentence compilation | compileRelationshipSentence() | OPERATIONAL |
| Confidence sentence derivation | deriveBalancedConfidenceSentence() | OPERATIONAL |
| Combined synthesis derivation | deriveBalancedSynthesis() | OPERATIONAL |

---

## 4. What NarrativePrimitives.js Duplicates (VIOLATIONS)

| Primitive | Duplicates | Correct Source |
|-----------|-----------|----------------|
| `composePostureHeadline` | Posture label derivation | `forBalanced().posture_label` |
| `composePostureDynamics` | Combined synthesis | `forBalanced().combined_synthesis` |
| `composePressureThemes` | Condition grouping | `synthesisResult.conditions` (already grouped by type) |
| `composePressureConvergence` | Combination detection | `consequenceResult.combination_consequences` |
| `composeEpicenterPortrait` | Primary story + locus | `forBalanced().primary_story` + `primary_locus` |
| `composeEpicenterMeaning` | Operational implication | `forBalanced().primary_story.operational_implication` |

---

## 5. What NarrativePrimitives.js Legitimately Adds (NON-VIOLATIONS)

| Primitive | Why Legitimate |
|-----------|---------------|
| `composeTrustCalibration` | Topology projection from grounding ratio — not derived by consequence pipeline |
| `composeEpicenterFacts` | Supplementary topology facts (node counts, domain counts) — structural data, not cognition |
| Vocabulary governance | FORBIDDEN_PATTERNS, ALLOWED_VOCABULARY — governance, not derivation |
| Zone transition rules | ZONE_TRANSITIONS, ZONE_DEFINITIONS — composition doctrine, not cognition |
| Anti-patterns | AP-01 through AP-07 — governance enforcement |
| Audience contract | AUDIENCE_CONTRACT — projection calibration |

---

## 6. Correct Architecture

### What the BALANCED Composition Layer MUST Be

```
GOVERNED COMPOSITION = 
  vocabulary governance
  + zone sequencing
  + narrative pacing
  + transition logic
  + anti-pattern enforcement
  + supplementary topology projection (trust calibration, fact grid)

GOVERNED COMPOSITION ≠
  semantic derivation
  + consequence computation  
  + posture assessment
  + convergence detection
  + operational meaning inference
```

### Input Contract (CORRECTED)

The composition layer receives THREE inputs:

1. **`forBalanced()` output** — the canonical BALANCED consequence projection
   - posture_label, posture_severity, posture_scope, primary_locus
   - primary_story, reinforcement_flow, combined_synthesis
   - confidence_sentence, overall_confidence

2. **`synthesisResult`** — conditions for signal-level detail (Zone 2 disclosure)
   - conditions[].condition_type, severity, supporting_signal_ids

3. **`fullReport`** — supplementary topology data ONLY
   - topology_summary (grounding ratio, domain counts) → Zone 4 trust bar
   - dpsig_signal_summary.normalization_basis → Zone 3 fact grid
   - signal_interpretations → Zone 2 collapsed signal list (display only)

### What Composition Does With Each Input

| Input | Composition Does | Composition Does NOT |
|-------|-----------------|---------------------|
| `forBalanced()` | Sequences into zones, applies vocabulary governance, paces narrative | Re-derive posture, re-assess severity, re-detect combinations |
| `synthesisResult` | Renders signal list in collapsed disclosure (display) | Re-group signals, re-derive themes, re-assess convergence |
| `fullReport` | Extracts topology facts for fact grid, grounding ratio for trust bar | Derive operational meaning, assess pressure, infer consequences |

---

## 7. Anti-Parallel-Path Governance Rule

### RULE: ONE COGNITION SUBSTRATE

There must be exactly one canonical cognition substrate:

```
Signal → Condition → Consequence → Persona Projection
```

Different personas may:
- **compress** (BOARDROOM)
- **sequence** (BALANCED)
- **expand** (DENSE)
- **prove** (INVESTIGATION)

Different personas MUST NOT:
- fork semantic truth
- derive parallel operational meaning
- maintain independent severity assessments
- independently detect convergence or combinations

### ENFORCEMENT

Any module that:
- reads raw signal_interpretations to derive operational meaning → VIOLATION
- independently computes posture from signal severity → VIOLATION
- groups signals into operational themes outside SignalSynthesisEngine → VIOLATION
- detects convergence/combination outside ConsequenceCompiler → VIOLATION

is creating a parallel cognition path and must be corrected.

---

## 8. Runtime Lineage Diagram

```
PSIG-001,002,004,006    ISIG-001,002    DPSIG-031,032
       │                     │                 │
       └──────── L1 ─────────┘─────────────────┘
                 │
                 ▼
    SignalSynthesisEngine.synthesize()
                 │
                 ├── DELIVERY_PRESSURE_CONCENTRATION
                 ├── DEPENDENCY_CHOKE_POINT
                 ├── PROPAGATION_ASYMMETRY
                 ├── STRUCTURAL_MASS_CONCENTRATION
                 ├── CROSS_DOMAIN_COUPLING_PRESSURE
                 ├── GOVERNANCE_COVERAGE_STATUS
                 └── COMPOUND_CONVERGENCE
                 │
                 ▼           L2
    ConsequenceCompiler.compile()
                 │
                 ├── Atomic: COORD_FRAG, DEP_AMP, DEL_EXP, OP_BOTTLENECK,
                 │           RESIL_DEF, GOV_GAP, PROP_EXP, STAB_RISK
                 ├── Combinations: AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL,
                 │                 SYSTEMIC_OP_FRAG
                 └── Deduplication, Escalation
                 │
                 ▼           L3
    Persona Projection Layer
                 │
    ┌────────────┼─────────────────┬──────────────┐
    ▼            ▼                 ▼              ▼
  forBoardroom  forBalanced     forDense*    forInvestigation
  (compress)    (sequence)     (expand)      (prove)
                 │
                 ▼           L4
    BALANCED Composition Layer [THIS STREAM]
    (vocabulary + sequencing + pacing + transitions)
                 │
    ┌────────────┼────────┬────────┬──────┐
    ▼            ▼        ▼        ▼      ▼
  Zone 1       Zone 2   Zone 3   Zone 4  Zone 5
  Posture     Pressure  Epicenter Trust   Descent
  (from       (from     (from    (from   (static)
  posture_    reinf.    primary  topo
  label)      flow)     story)   summary)
```

*forDense not yet implemented

---

## 9. Corrective Action Required

### NarrativePrimitives.js — REWRITE

**Before (WRONG — parallel cognition):**
```
composePostureHeadline(fullReport)  → reads signals, derives headline
composePressureThemes(fullReport)   → reads signals, groups into themes
```

**After (CORRECT — composition of existing cognition):**
```
composeZone1(balancedProjection)    → sequences posture_label + combined_synthesis
composeZone2(balancedProjection, synthesisResult) → sequences reinforcement_flow
composeZone3(balancedProjection, fullReport)      → sequences primary_story + facts
composeZone4(fullReport)           → trust calibration (topology projection, legitimate)
```

### ZoneComposer.js — REWRITE

**Before (WRONG):**
```
composeBriefing(fullReport)  → calls parallel primitives
```

**After (CORRECT):**
```
composeBriefing(balancedProjection, synthesisResult, fullReport) → sequences existing projections
```

### OperationalVocabulary.js — KEEP
Vocabulary governance is legitimate. Not cognition.

### CompositionContract.js — KEEP
Zone definitions, transitions, anti-patterns are legitimate. Not cognition.

---

## 10. Ownership Matrix

| Concern | Owner | Layer |
|---------|-------|-------|
| Signal derivation | SignalSynthesisEngine | L1 |
| Condition synthesis | SignalSynthesisEngine | L1 |
| Consequence derivation | ConsequenceCompiler | L2 |
| Consequence vocabulary | CONSEQUENCE_VOCABULARY | L2 |
| Combination detection | ConsequenceCompiler | L2 |
| Severity escalation | ConsequenceCompiler | L2 |
| Persona consequence projection | forBoardroom/forBalanced/forInvestigation | L3 |
| Posture label derivation | derivePostureLabel (in ConsequenceCompiler) | L3 |
| Relationship verb derivation | deriveRelationshipVerb (in ConsequenceCompiler) | L3 |
| Operational vocabulary governance | OperationalVocabulary.js | L4 |
| Zone sequencing | ZoneComposer.js | L4 |
| Narrative pacing | CompositionContract.js | L4 |
| Transition logic | CompositionContract.js | L4 |
| Anti-pattern enforcement | CompositionContract.js | L4 |
| Trust calibration (topology) | NarrativePrimitives.js | L4 |
| Supplementary fact grid | NarrativePrimitives.js | L4 |
| Rendering | IntelligenceField.jsx | L5 |

---

## 11. Canonical Statement

**BALANCED composition does not create new intelligence; it governs projection and operational sequencing of existing cognition.**

The composition layer receives consequence objects that are already derived, deduplicated, combined, and persona-projected by the canonical cognition pipeline. It adds:
- Governed vocabulary enforcement
- 5-zone sequencing with cognitive bridges
- Visual pacing doctrine
- Anti-pattern detection
- Supplementary topology facts (not cognition)
- Trust calibration framing (topology projection, not consequence derivation)

It does NOT add:
- Semantic derivation
- Consequence computation
- Posture assessment
- Convergence detection
- Operational meaning inference

---

## 12. Relationship to SW-Intel

SW-Intel is the Domain Cognition Module. It owns:
- SignalSynthesisEngine (condition synthesis)
- ConsequenceCompiler (consequence derivation)
- CONSEQUENCE_VOCABULARY (locked)

BALANCED Composition Layer is a PROJECTION consumer of SW-Intel output. It does not:
- Duplicate SW-Intel logic
- Create alternative consequence types
- Override SW-Intel severity or confidence assessments
- Compute convergence independently

When SW-Intel is OFF, BALANCED operates on PI-Core data only (BALANCED_INTERPRETIVE_NARRATIVES).
When SW-Intel is ON, BALANCED composes from forBalanced() output.

This is the ONE rendering path doctrine: PI-Core owns zones, SW-Intel enriches inline.

---

## 13. Relationship to BOARDROOM

BOARDROOM uses `forBoardroom()` — a different persona projection of the SAME consequence objects.

BOARDROOM compresses. BALANCED sequences.

Both consume the same `compile()` output. Neither re-derives. The consequence substrate is shared. The persona projection is different.

The BALANCED Composition Layer must NEVER:
- Derive posture differently from BOARDROOM
- Assess severity differently from BOARDROOM  
- Detect combinations differently from BOARDROOM

All three consume ConsequenceCompiler output. If they disagree, the substrate is broken — not the projection.
