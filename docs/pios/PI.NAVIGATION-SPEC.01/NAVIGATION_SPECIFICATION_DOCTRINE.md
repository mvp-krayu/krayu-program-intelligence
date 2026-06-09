# Navigation Specification Doctrine

**Artifact:** PI.NAVIGATION-SPEC.01
**Status:** DOCTRINE DEFINED — no implementation
**Date:** 2026-06-09
**Authority:** Derived from Cognitive Continuations operational evidence + Visual Spec consumption proof

---

## 1 -- Core Doctrine

**Finding --> cognition navigation objects --> explorable cognition surface.**

A Navigation Spec is a governed action that moves the operator through the cognition graph. Not a follow-up question. Not a text suggestion. A structured navigation contract that LENS can execute as a direct cognition action — highlight a surface, open a zone, switch a panel, invoke a visual — without round-tripping through THORR.

---

## 2 -- Discovery Lineage

Navigation Specs are the third member of a trilogy discovered in sequence:

| Spec | Discovery | What it produces | Consumer |
|------|-----------|-----------------|----------|
| Narrative | PI.COGNITIVE-CONTINUATIONS.01 | Governed text answers | THORR, LENS panels |
| Visual | PI.THORR-VISUAL-SPEC.01 | Governed diagrams | LENS visual zones |
| Navigation | PI.NAVIGATION-SPEC.01 | Governed cognition actions | LENS interaction layer |

Each spec type emerged from the same cognition pipeline. Each is deterministically derivable. Each is specimen-aware. Together they transform LENS from a report surface into an explorable cognition system.

---

## 3 -- The Existing Foundation

Navigation Specs do not require new primitives. The foundation already exists inside Cognitive Continuations.

Every continuation already carries:

```
{
  type: 'implication',              // traversal direction
  question: '...',                  // text (current consumer)
  trace: {                          // resolvable cognition path
    object: 'domain_concentration',
    field: 'divergence',
    value: true
  },
  reason: '...',                    // triggering condition
  targetSurface: 'EXECUTION_BLINDNESS',  // WHERE it navigates
  targetEvidence: 'RSIG',               // WHAT evidence it reaches
  authorityRequired: 2,                  // gate
  weight: 3,                            // persona-calibrated priority
  typeKey: 'implication'                 // traversal type
}
```

The `trace`, `targetSurface`, `targetEvidence`, and `authorityRequired` fields ARE the navigation contract. They specify where to go, what to show, and what authority is needed. Today they are consumed as text prompts fed back to THORR. Tomorrow they can be consumed as direct LENS navigation actions.

The promotion is: continuation --> navigation spec. Not construction of a new system.

---

## 4 -- Navigation Action Types

Derived from the six continuation traversal types, mapped to LENS actions:

| Continuation Type | Navigation Action | LENS Behavior |
|-------------------|------------------|---------------|
| CLARIFY | Focus | Highlight the referenced cognition object, expand its detail |
| IMPLICATION | Navigate Forward | Open the downstream consequence surface or zone |
| CHALLENGE | Verify | Switch to OPERATOR verification mode for the finding |
| DESCENT | Dive | Open the evidence chain, show supporting signals/conditions |
| ADJACENT | Compare | Navigate to an adjacent cognition surface, show relationship |
| ASCENT | Elevate | Navigate to the executive projection of this finding |

Two additional action types emerge from Visual Spec integration:

| Action Type | Navigation Action | LENS Behavior |
|-------------|------------------|---------------|
| VISUALIZE | Render Visual | Open the relevant visual spec for this finding |
| PERSONA | Switch Lens | Navigate to a different persona's projection of the same finding |

---

## 5 -- Navigation Spec Contract Shape

```json
{
  "id": "string -- derived from continuation trace",
  "action": "string -- focus | navigate | verify | dive | compare | elevate | visualize | persona",
  "label": "string -- operator-facing action label",
  "source": {
    "surface": "string -- current cognition surface",
    "finding": "string -- current finding or theme"
  },
  "target": {
    "surface": "string | null -- target cognition surface",
    "evidence": "string | null -- target evidence type",
    "visual": "string | null -- target visual spec id",
    "persona": "string | null -- target persona mode",
    "zone": "string | null -- target LENS zone"
  },
  "authority_required": "number -- minimum P-level",
  "trace": "object -- cognition object path (from continuation)",
  "reason": "string -- why this navigation is relevant",
  "altitude": "string -- persona altitude that generated this"
}
```

---

## 6 -- Consumption Model

### 6.1 Current State (Text Consumption)

```
THORR Answer
    |
    v
Cognitive Continuations (deriveContinuations)
    |
    v
ConversationPanel renders as text buttons
    |
    v
Click --> new THORR question --> full round-trip
```

### 6.2 Target State (Navigation Consumption)

```
THORR Answer  /  LENS Finding
    |
    v
Cognitive Continuations (deriveContinuations)
    |
    v
Navigation Spec Resolver (promote continuations to actions)
    |
    v
LENS renders as cognition actions
    |
    v
Click --> direct LENS navigation (no THORR round-trip)
         - highlight surface
         - open zone
         - switch panel
         - invoke visual spec
         - switch persona
```

The key difference: text consumption requires THORR to answer every navigation. Navigation consumption allows LENS to act on the cognition graph directly when the target is already known.

THORR round-trips remain necessary for open-ended inquiry. Navigation actions handle structured traversal.

### 6.3 Hybrid Model

Both consumption modes coexist:

- **Structured navigation** (target known): LENS acts directly. No THORR round-trip.
- **Open inquiry** (target unknown): THORR answers. Continuations regenerate.

The continuation's `targetSurface` and `targetEvidence` determine which mode applies. If both are null, the continuation is open inquiry. If either is populated, the continuation is structured navigation.

---

## 7 -- Persona-Specific Navigation Paths

Navigation Specs inherit persona calibration from Cognitive Continuations. The same finding generates different navigation paths per altitude:

**Board of Directors (executive):**
- What should leadership conclude? --> ASCENT/ELEVATE
- Which governance decisions are affected? --> IMPLICATION/NAVIGATE
- What evidence supports this? --> Show Structural Context (collapsed)

**CTO (technical):**
- Which operational decisions become harder? --> IMPLICATION/NAVIGATE
- Show the evidence chain --> DESCENT/DIVE
- Does this contribute to Execution Blindness? --> ADJACENT/COMPARE

**Chief Architect (structural):**
- Show the condition chain --> DESCENT/DIVE
- What makes this dominant? --> CLARIFY/FOCUS
- Visualize the architecture --> VISUALIZE

**Transformation Leader (strategic):**
- Which investments are mis-targeted? --> IMPLICATION/NAVIGATE
- Would addressing this unblock transformation? --> CHALLENGE/VERIFY
- What does the board see? --> ASCENT/ELEVATE

These paths are already produced by the altitude-aware continuation engine. Navigation Specs make them executable.

---

## 8 -- What LENS Becomes

Without Navigation Specs, LENS is:

```
Report --> Read --> Switch persona manually --> Read again
```

With Navigation Specs, LENS becomes:

```
Finding --> Navigate to implication --> Compare with adjacent surface
    --> Dive into evidence --> Elevate to board view --> Visualize
```

The operator traverses the cognition graph through the product surface. Each action is governed, traceable, and persona-calibrated. The system guides exploration. The operator drives depth.

---

## 9 -- Relation to Sibling Primitives

### 9.1 Cognitive Continuations (PI.COGNITIVE-CONTINUATIONS.01)

Navigation Specs are a PROMOTION of Cognitive Continuations, not a replacement. Continuations remain the derivation engine. Navigation Specs are the consumption contract. The same `deriveContinuations()` call produces both text suggestions (for THORR) and navigation actions (for LENS).

### 9.2 Visual Specs (PI.THORR-VISUAL-SPEC.01)

Navigation Specs can target visual specs. A VISUALIZE action opens a governed visual. This connects the three spec types into a single traversable system:

```
Finding (Narrative)
    --> Navigate to visual (Navigation)
    --> Render diagram (Visual)
    --> Navigate from diagram to evidence (Navigation)
```

### 9.3 Projection Constitution (PI.PROJECTION.CONSTITUTION.01)

Navigation Specs respect persona boundaries. A BOARDROOM navigation path does not offer DESCENT actions (weight = 0). An OPERATOR path does not offer ASCENT. The Projection Constitution governs what navigation is available per persona.

---

## 10 -- What Is Explicitly Out of Scope

- LENS navigation consumer implementation
- Navigation rendering components
- Route/URL integration
- Animation or transition design
- Navigation history or breadcrumb tracking
- Cross-specimen navigation
- Navigation analytics or telemetry

These are implementation concerns for future streams.

---

## 11 -- Implementation Signal

The implementation signal is: when the existing Cognitive Continuations text buttons in ConversationPanel feel limiting — when the operator wants to click "Does this contribute to Execution Blindness?" and land on the Execution Blindness surface directly instead of waiting for THORR to answer the question as text.

That moment is when Navigation Specs graduate from doctrine to implementation.
