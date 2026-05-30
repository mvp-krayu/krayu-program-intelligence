# Assessment — PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-UNIFICATION.01

## Stream Identity

| Field | Value |
|-------|-------|
| Stream ID | PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-UNIFICATION.01 |
| Classification | G2 (architecture-consuming — assessment only) |
| Branch | `feature/runtime-demo` |
| Type | ASSESSMENT — no implementation |
| Trigger | Execution Fragility slice exposed split projection authority |

---

## 1. What SW-INTEL objects exist after synthesis?

`SignalSynthesisEngine.synthesize(fullReport)` returns:

```
{
  conditions: Condition[],    // all (primitives + composites)
  active: Condition[],        // severity !== 'NOMINAL'
  suppressed: Condition[],    // severity === 'NOMINAL'
  primitives: Condition[],
  composites: Condition[],    // COMPOUND_CONVERGENCE only
  primary: Condition | null,  // highest-severity
  summary: { total_signals, total_conditions, active_count, ... }
}
```

Each Condition carries the standard 17-field shape: `condition_type`, `severity`, `governance_boundary`, `topology_overlay`, `guided_interventions`, `shared_topology_targets`, `evidence_mode`, `derivation_trace`, etc.

**9 condition types** exist after synthesis (8 primitive + 1 composite):

| # | Type | Class |
|---|------|-------|
| 1 | DELIVERY_PRESSURE_CONCENTRATION | Primitive |
| 2 | DEPENDENCY_CHOKE_POINT | Primitive |
| 3 | PROPAGATION_ASYMMETRY | Primitive |
| 4 | STRUCTURAL_MASS_CONCENTRATION | Primitive |
| 5 | CROSS_DOMAIN_COUPLING_PRESSURE | Primitive |
| 6 | EXECUTION_FRAGILITY | Primitive |
| 7 | GOVERNANCE_COVERAGE_COMPLETE | Primitive |
| 8 | GOVERNANCE_COVERAGE_GAP | Primitive |
| 9 | COMPOUND_CONVERGENCE | Composite |

Additionally, `synthesizeTeaser()` produces a lightweight preview when SW-INTEL module is OFF:
```
{ active_count, total_count, top_conditions: [{title, severity}], overflow }
```

---

## 2. What SW-INTEL objects exist after consequence compilation?

`ConsequenceCompiler.compile(synthesisResult, fullReport)` returns:

```
{
  consequences: Consequence[],         // top-level (deduplicated, combined)
  atomic_consequences: Consequence[],  // all atomics before combination
  combination_consequences: string[],  // IDs of combination consequences
  consequence_count, systemic_count, primary_consequence,
  compilation_trace: { input_condition_count, conditions_producing_consequences, ... }
}
```

**11 consequence types** (8 atomic + 3 combination):

| # | Type | Kind |
|---|------|------|
| 1 | COORD_FRAG | Atomic |
| 2 | DEP_AMP | Atomic |
| 3 | DEL_EXP | Atomic |
| 4 | OP_BOTTLENECK | Atomic |
| 5 | RESIL_DEF | Atomic |
| 6 | GOV_GAP | Atomic |
| 7 | PROP_EXP | Atomic |
| 8 | STAB_RISK | Atomic |
| 9 | AMPLIFIED_DEP_FRAG | Combination |
| 10 | STRUCT_GRAVITY_WELL | Combination |
| 11 | SYSTEMIC_OP_FRAG | Combination |

After `compile()`, four persona-specific projectors exist:

| Function | Status | Consumer |
|----------|--------|----------|
| `forBoardroom()` | ACTIVE — called in IntelligenceField | BOARDROOM |
| `forBalanced()` | ACTIVE — called in IntelligenceField | BALANCED (via ZoneComposer) |
| `forOperator()` | DEAD — exported but never imported/called | None |
| `forInvestigation()` | ACTIVE — called for verification protocol | INVESTIGATION |

---

## 3. What object does BOARDROOM consume today?

**`consequencePosture`** — produced by `forBoardroom(consequenceResult, synthesisResult, fullReport)`.

Shape:
```
{
  posture_label, posture_severity, posture_scope,
  primary_locus, consequence_count, systemic_count,
  overall_confidence, overall_confidence_label,
  cognition_slices: [{
    executive_name,        // from COGNITION_SLICE_VOCABULARY
    condition_type,
    domain,
    operational_meaning,   // localized sentence
    severity, confidence, confidence_label,
    evidence_refs, source_signal_ids,
  }],
  combined_synthesis,      // narrative sentence
}
```

**Key mechanism:** `forBoardroom()` iterates `synthesisResult.conditions`, filters by `COGNITION_SLICE_VOCABULARY[type].is_dynamic === true`, and produces `cognition_slices`. This is how EXECUTION_FRAGILITY enters the BOARDROOM dynamics graph — through the `is_dynamic` gate on the vocabulary entry.

**Rendering path:**
```
forBoardroom() → consequencePosture.cognition_slices
  → BoardroomDecisionSurface (line 8478)
    → ConvergenceWeb (circular dynamics graph)
    → slice cards (executive_name, domain, severity)
    → combined_synthesis narrative
```

BOARDROOM also receives `swIntelProjection` but uses it only for the `SoftwareIntelligenceBoardroomSummary` component — a secondary view, not the primary dynamics graph.

---

## 4. What object do BALANCED / DENSE / OPERATOR consume today?

### BALANCED

**`balancedBriefing`** — produced by:
```
forBalanced(consequenceResult, synthesisResult, fullReport)
  → balancedProjection
    → composeBriefing(balancedProjection, synthesisResult, fullReport)
      → balancedBriefing (5-zone governed narrative)
```

Shape: `{ valid, zones: { z1, z2, z3, z4, z5 }, metadata }` — a consequence-derived narrative structure with primary_story + reinforcement_flow + posture synthesis.

**`SoftwareIntelligenceBalancedNarrative`** (which would consume `swIntelProjection.surfaces`) is imported but **never rendered**. Dead code.

### DENSE

**`swIntelProjection`** — produced by `SoftwareIntelligenceProjectionAdapter.deriveProjection(fullReport)`.

Consumes `swIntelProjection.surfaces` (6 hardcoded surfaces) + `activeConditions` (from `synthesisResult.active`) cross-linked into surface cards via `SURFACE_CONDITION_MAP`.

### OPERATOR

**`swIntelProjection`** — same object as DENSE.

Consumes `swIntelProjection.surfaces` (6 hardcoded surfaces) + `verificationState` (from InvestigationVerifier). Does **NOT** receive `activeConditions` — no condition cross-linking.

`forOperator()` exists in ConsequenceCompiler but is **never called**.

---

## 5. Why are these different?

**Three projection pathways evolved independently:**

| Path | Source | Consumed by | Driven by |
|------|--------|-------------|-----------|
| A | `forBoardroom()` → `cognition_slices` | BOARDROOM | Conditions → is_dynamic vocabulary gate |
| B | `forBalanced()` → `composeBriefing()` → `balancedBriefing` | BALANCED | Consequences → narrative sequencing |
| C | `deriveProjection()` → `swIntelProjection.surfaces` | DENSE, OPERATOR | Hardcoded surface derivation functions |

**Path A** (BOARDROOM) was built to project SW-INTEL as operational posture — cognition slices are condition-level summaries projected into the dynamics graph.

**Path B** (BALANCED) was built to project SW-INTEL as a narrative corridor — consequences become a primary story with reinforcement flow.

**Path C** (DENSE/OPERATOR) was built before the condition engine existed — the 6 surfaces are pre-condition abstractions that compress raw report data into cognition surfaces. They are not condition-driven.

The split happened because Path C predates the condition/consequence pipeline. When conditions were introduced, BOARDROOM and BALANCED got new projection functions that consume conditions/consequences. DENSE and OPERATOR were never migrated — they still consume the older surface abstractions.

---

## 6. Which path is canonical?

**Path A is closest to canonical** because it is:
- Condition-driven (conditions ARE the slice)
- Consequence-aware (consequences flow from conditions)
- Extensible (adding `is_dynamic: true` to vocabulary is sufficient for BOARDROOM)
- Evidence-bound (each slice carries `evidence_refs` and `source_signal_ids`)

**Path B is valid but persona-specific** — `forBalanced()` produces a narrative structure (primary_story + reinforcement_flow) that is genuinely different from a slice list. The narrative sequencing adds value. But its input is still conditions/consequences.

**Path C is the problem.** It is:
- Not condition-driven (surfaces are derived from raw report, not from conditions)
- Not extensible (hardcoded 6-function array)
- Not consequence-aware (no consequence compilation in this path)
- The source of all dead metadata (`SURFACE_CONDITION_MAP` entries, `visible_in` declarations)

---

## 7. Should forBoardroom() remain a persona projection function or delegate to a shared SW-INTEL slice projection contract?

**`forBoardroom()` should delegate to a shared canonical slice projection**, then compress the output for the BOARDROOM rendering.

The `cognition_slices` array it produces IS the canonical projection shape — but it's currently embedded inside a BOARDROOM-specific function. Extract it.

**Proposed canonical contract:**

```
SW-INTEL Canonical Slice Projection
  Input:  synthesisResult.conditions + consequenceResult
  Output: SliceProjection[]
  
  Each SliceProjection: {
    condition_type,
    executive_name,        // from COGNITION_SLICE_VOCABULARY
    domain,
    operational_meaning,
    severity,
    confidence,
    evidence_refs,
    source_signal_ids,
    consequence_disposition: {
      defining: [...],     // consequence types this condition defines
      conditional: [...],  // consequence types conditionally produced
    },
    projection_disposition: 'PROJECTED' | 'SUPPRESSED' | 'UNSUPPORTED',
  }
```

Then:
- `forBoardroom()` compresses SliceProjection[] into cognition_slices + posture
- `forBalanced()` sequences SliceProjection[] into narrative corridor
- DENSE receives SliceProjection[] with full evidence
- OPERATOR receives SliceProjection[] with verification hooks

---

## 8. Should SoftwareIntelligenceProjectionAdapter consume cognition_slices instead of hardcoded rawSurfaces?

**Yes.** The 6 hardcoded surfaces in `deriveProjection()` should be replaced by consumption of the canonical slice projection. The current surfaces are:

| Current Surface | Maps to Condition(s) |
|-----------------|---------------------|
| Delivery Fragility | DELIVERY_PRESSURE_CONCENTRATION, COMPOUND_CONVERGENCE |
| Coordination Saturation | DEPENDENCY_CHOKE_POINT, CROSS_DOMAIN_COUPLING_PRESSURE |
| Integration Exposure | CROSS_DOMAIN_COUPLING_PRESSURE |
| Operational Topology Posture | STRUCTURAL_MASS_CONCENTRATION |
| Qualification Exposure | GOVERNANCE_COVERAGE_GAP, GOVERNANCE_COVERAGE_COMPLETE |
| Propagation Risk | PROPAGATION_ASYMMETRY |

This is exactly `SURFACE_CONDITION_MAP` — but the map is declarative metadata that nothing reads. The surfaces should be derived FROM conditions, not independently derived and then cross-referenced.

**The migration path:**

1. Produce the canonical SliceProjection[] from conditions
2. Replace `rawSurfaces` with SliceProjection[]-derived surfaces
3. Retain surface grouping as a projection concern (multiple conditions CAN compose into one surface)
4. Delete `SURFACE_CONDITION_MAP` — the mapping becomes the derivation itself, not external metadata

---

## 9. How do we prevent visible_in declarations from lying?

**Current state:** `visible_in` on CognitionOntology nodes is pure metadata. No rendering code reads it. No validation checks it.

**Two options:**

**Option A — Make visible_in enforceable:**
Add a validation guard in the canonical projection contract: for each active condition, check that every persona listed in `visible_in` has a corresponding SliceProjection with `projection_disposition: 'PROJECTED'`. If a persona is listed but no projection exists, emit `projection_disposition: 'UNSUPPORTED'` and log a validation warning.

**Option B — Delete visible_in:**
Remove it from the ontology. The projection contract itself determines visibility. A condition is visible in a persona if and only if the canonical projection produces a slice for it. No declaration needed.

**Recommendation: Option B.** `visible_in` is aspirational metadata that creates a governance surface without governance enforcement. The projection contract is the truth. If a condition has a vocabulary entry with `is_dynamic: true` and the canonical projection produces it, it's visible. If not, it's not. No declaration gap possible.

---

## 10. What validation guard ensures every active slice has a declared projection disposition?

**Currently: none.**

**Required guard:**

After canonical projection is produced, a post-flight check should verify:

```
For each condition in synthesisResult.active:
  IF COGNITION_SLICE_VOCABULARY[type].is_dynamic === true:
    ASSERT canonical projection contains a SliceProjection for this type
    ASSERT projection_disposition is PROJECTED or SUPPRESSED (not missing)
  
  IF projection_disposition === 'UNSUPPORTED':
    LOG WARNING: "Condition {type} is active but has no projection path"
    
  IF projection_disposition === 'SUPPRESSED':
    ASSERT suppression_reason is present
```

This guard should run in the same layer as `InvestigationVerifier` — call it **Projection Disposition Verification**. It would catch exactly the gap that EXECUTION_FRAGILITY exposed: a condition that is active, compiled, verified, and ontology-modeled but silently missing from persona projection surfaces.

---

## Dead Code and Dead Metadata Inventory

| Item | Location | Status |
|------|----------|--------|
| `SURFACE_CONDITION_MAP` | SoftwareIntelligenceProjectionAdapter.js:18-26 | DEAD — declarative map that nothing reads for derivation |
| `visible_in` on all CONDITION_NODES | CognitionOntology.js | DEAD — no rendering or validation code reads this field |
| `STRUCTURAL_FRAGILITY: ['EXECUTION_FRAGILITY']` | SoftwareIntelligenceProjectionAdapter.js:25 | DEAD — no `deriveStructuralFragility()` function exists |
| `SoftwareIntelligenceBalancedNarrative` | SoftwareIntelligenceField.jsx:457 | DEAD — imported but never rendered, superseded by `balancedBriefing` pipeline |
| `forOperator()` | ConsequenceCompiler.js | DEAD — exported but never imported or called by any component |
| `FRAGILITY_HOTSPOT: '#ff6b6b'` | StructuralTopologyZone.jsx | PARTIALLY DEAD — available but requires active surface selection to trigger overlay, which requires a surface that doesn't exist in DENSE/OPERATOR |

---

## Hardcoded Projection Arrays That Block Extensibility

**Primary blocker:**

`SoftwareIntelligenceProjectionAdapter.js` lines 701-708:
```js
const rawSurfaces = [
  deriveDeliveryFragility(fullReport),
  deriveCoordinationSaturation(fullReport),
  deriveIntegrationExposure(fullReport),
  deriveOperationalTopologyPosture(fullReport),
  deriveQualificationExposure(fullReport),
  derivePropagationRisk(fullReport),
].filter(Boolean)
```

Every new slice requires: a new ~60-line derivation function + addition to this array. The function derives from raw `fullReport` data, not from conditions — duplicating logic that the condition engine already performs.

**Secondary blocker:**

`COGNITION_SLICE_VOCABULARY` in ConsequenceCompiler.js gates BOARDROOM entry via `is_dynamic: true`. This is extensible (add a vocabulary entry = enter BOARDROOM). But it only feeds BOARDROOM. BALANCED consumes consequences, not slices. DENSE/OPERATOR consume surfaces, not slices.

---

## Architectural Recommendation

**Target state:** One canonical slice projection contract consumed by all four personas.

```
synthesize()
  → conditions
    → compile()
      → consequences
        → projectSlices()          ← NEW: canonical slice projection
          → forBoardroom()         compresses into posture + dynamics graph
          → forBalanced()          sequences into narrative corridor
          → forDense()             full evidence cards
          → forOperator()          operational cards + verification hooks
```

**What `projectSlices()` replaces:**
- The `cognition_slices` loop currently inside `forBoardroom()` (extract it)
- The `rawSurfaces` array currently in `deriveProjection()` (delete it)
- The `SURFACE_CONDITION_MAP` (derivation replaces declaration)
- The `visible_in` field (projection disposition replaces aspiration)

**What it preserves:**
- `forBoardroom()` still produces posture-level compression for the cockpit
- `forBalanced()` still sequences into narrative zones
- The projection adapter still produces qualification decomposition (that's independent)
- Each persona still renders differently — the canonical contract unifies the INPUT, not the OUTPUT

---

## Projection Disposition Vocabulary (Target)

| Disposition | Meaning |
|-------------|---------|
| PROJECTED | Condition has an active projection path in this persona |
| SUPPRESSED | Condition intentionally hidden (with reason) |
| UNSUPPORTED | Condition implemented but not yet projected — validation warning |
| INVALID | Condition declared visible but no projection path — validation fail |

---

## Scope of Implementation Stream

If approved, the implementation stream (PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-UNIFICATION.02) would:

1. Extract `projectSlices()` from `forBoardroom()`'s cognition_slices loop
2. Make `forBoardroom()` consume `projectSlices()` output
3. Make `forBalanced()` consume `projectSlices()` output (replacing its internal condition iteration)
4. Replace `rawSurfaces` in `deriveProjection()` with `projectSlices()` output
5. Wire `forOperator()` into OPERATOR rendering (currently dead)
6. Delete dead code: `SoftwareIntelligenceBalancedNarrative`, `SURFACE_CONDITION_MAP`, `visible_in`
7. Add projection disposition verification guard
8. Verify all 9 condition types have disposition in all 4 personas

**Estimated scope:** 6-8 files, ~200 lines changed, ~150 lines deleted (dead code removal).

**Risk:** BALANCED's `composeBriefing()` (ZoneComposer) currently receives `forBalanced()` output which has a specific shape (primary_story + reinforcement_flow). The canonical projection must either preserve this shape or the ZoneComposer must be adapted. This is the highest-risk integration point.
