# PRE Zone B Narrative Projection — Architectural Finding

## PI.PRE-ZONE-B-NARRATIVE-PROJECTION.01

Stream: CONTINUATION | Classification: G2 | Branch: feature/runtime-demo

---

## Critical Discovery

The product flow assessment (PI.SOFTWARE-INTELLIGENCE.PRODUCTIZATION.01) registered 3 ELEVATED issues:

| ID | Issue | Assumed Rendering Path |
|----|-------|----------------------|
| B-01 | Surface names are technical in BOARDROOM | `SoftwareIntelligenceBoardroomSummary` |
| B-03 | `operational_summary` is DENSE-grade in BOARDROOM | `SoftwareIntelligenceBoardroomSummary` |
| BA-01 | Same `operational_summary` in BALANCED as DENSE | `SoftwareIntelligenceBalancedNarrative` |

**Finding: Both components are dead code.** They are imported in `IntelligenceField.jsx` (line 8) but never rendered anywhere in the JSX tree.

---

## Actual Rendering Architecture

### DENSE / OPERATOR — SW-Intel Surface Cards

```
deriveProjection(fullReport)
  → SoftwareIntelligenceDenseView     (line 10022, IntelligenceField.jsx)
  → SoftwareIntelligenceOperatorView  (line 10002, IntelligenceField.jsx)
```

These render all 12 surfaces as cards, sorted by severity. This is the path the product flow assessment correctly analyzed.

### BOARDROOM — Consequence Posture Synthesis

```
ConsequenceCompiler.forBoardroom(consequenceResult, synthesisResult, fullReport)
  → consequencePosture
  → BoardroomDecisionSurface          (line 9335, IntelligenceField.jsx)
```

BOARDROOM does NOT show individual SW-Intel surface cards. It shows:
- Executive synthesis with consequence posture
- Cognition slices (e.g., "Systemic Operational Fragility")
- Cognition spine with domain concentration
- Confidence boundary
- All text is ALREADY audience-calibrated by the ConsequenceCompiler

### BALANCED — Briefing Zone Synthesis

```
ConsequenceCompiler.forBalanced(...)
  → balancedProjection
  → composeBalancedBriefing(balancedProjection, synthesisResult, fullReport)
  → balancedBriefing
  → BalancedConsequenceField           (line 6091, IntelligenceField.jsx)
  → ExecutiveInterpretation            (line 5224, IntelligenceField.jsx)
```

BALANCED does NOT show individual SW-Intel surface cards. It shows:
- Assessment narrative
- Operational orientation (key-value pairs)
- "Why this matters" explanation
- Behavioral class groups from ontology
- All text is ALREADY audience-calibrated by the balanced briefing composer

---

## Issue Register Correction

| ID | Original Assessment | Corrected Assessment |
|----|-------------------|---------------------|
| B-01 | Surface names are technical in BOARDROOM | **NOT APPLICABLE** — BOARDROOM doesn't show surface names; it shows consequence posture labels which are already executive-calibrated |
| B-03 | `operational_summary` is DENSE-grade in BOARDROOM | **NOT APPLICABLE** — BOARDROOM doesn't render `operational_summary`; it renders consequence synthesis which is already executive-calibrated |
| BA-01 | Same `operational_summary` in BALANCED as DENSE | **NOT APPLICABLE** — BALANCED doesn't render `operational_summary`; it renders briefing zone narrative which is already CTO-calibrated |
| B-02 | No narrative connecting top 3 surfaces in BOARDROOM | **PARTIALLY ADDRESSED** — BOARDROOM's consequence posture already synthesizes cross-surface causality ("Multiple independent conditions reinforce..."). The gap is cross-SURFACE narrative (surface A reinforces surface B), not cross-CONDITION narrative. |
| BA-02 | No causal narrative between surfaces in BALANCED | **PARTIALLY ADDRESSED** — BALANCED's briefing already includes causal assessment. The gap is the same: surface-level causality, not condition-level. |

---

## What Was Built

### PRE Zone A Projection Functions (adapter)

Added to `SoftwareIntelligenceProjectionAdapter.js`:

1. **`projectForBoardroom(projection)`** — Transforms the 12-surface projection for executive consumption:
   - `BOARDROOM_NAMES` — executive-friendly surface name map (e.g., "Delivery Fragility" → "Delivery Risk")
   - `deriveBoardroomSummary(surface)` — per-surface executive summary from constituents
   - `synthesizeBoardroomNarrative(surfaces)` — cross-surface causal narrative based on shared affected domains
   - Returns: `{ surfaces, narrative, suppressed_count, total_count }`

2. **`projectForBalanced(projection)`** — Transforms the 12-surface projection for CTO consumption:
   - `deriveBalancedExplanation(surface)` — per-surface CTO-calibrated explanation from constituents
   - `synthesizeBalancedNarrative(surfaces)` — cross-surface causal chain based on surface relationships
   - Returns: `{ surfaces, causal_narrative }`

### Component Updates (dead code — no runtime impact)

- `SoftwareIntelligenceBoardroomSummary` now calls `projectForBoardroom()` to render executive-calibrated names, summaries, and cross-surface narrative
- `SoftwareIntelligenceBalancedNarrative` now calls `projectForBalanced()` to render CTO-calibrated explanations and causal narrative
- CSS added for `.sw-intel-boardroom-narrative` and `.sw-intel-balanced-causal-narrative`

### Zero Regression Risk

The updated components (`SoftwareIntelligenceBoardroomSummary`, `SoftwareIntelligenceBalancedNarrative`) are imported but never rendered. All changes are additive. DENSE, OPERATOR, BOARDROOM, and BALANCED verified working via Playwright.

---

## Architectural Significance

### The ConsequenceCompiler IS Proto-PRE Zone B

The ConsequenceCompiler's persona functions (`forBoardroom()`, `forBalanced()`, `forOperator()`, `forInvestigation()`) are already doing what the EIR implementation roadmap describes as PRE Zone B — audience-specific cognitive projection. They take structural evidence and produce audience-calibrated narrative.

The "missing Zone B" is less missing than the issue register suggested. What's missing is:

1. **Formalization** — The ConsequenceCompiler does Zone B work but isn't architecturally recognized as PRE Zone B
2. **Consumer-genericity** — The persona functions are hardcoded to LENS consumers; they're not consumer-parameterized through ProjectionConfig
3. **Surface-level narrative** — The consequence posture synthesizes cross-CONDITION causality but doesn't synthesize cross-SURFACE causality (e.g., "Delivery Fragility and Structural Fragility converge in 3 domains")

### The Adapter Functions ARE Consumer-Generic PRE Zone A

The `projectForBoardroom()` and `projectForBalanced()` functions I added operate on the standard `projection` object (12 surfaces from PICP). They're consumer-generic — any consumer that receives a PICP projection can call them. This is the correct architectural pattern for:

- EIR (Reference Consumer #1) consuming SW-Intel surface projections
- THORR Co-Pilot consuming SW-Intel surface projections
- Any marketplace consumer needing audience-calibrated surface text

### Dead Component Status

`SoftwareIntelligenceBoardroomSummary` and `SoftwareIntelligenceBalancedNarrative` are ready to render if wired in, but the existing BOARDROOM/BALANCED paths (through ConsequenceCompiler) are richer and more deeply integrated. The dead components would be appropriate for a SIMPLER consumer that wants just the surface cards with audience calibration — not the full consequence posture synthesis.

---

## Value of This Stream

1. **Corrected the product flow assessment** — 3 ELEVATED issues were based on examining dead code, not the live rendering path. This prevents wasted implementation effort.

2. **Identified the ConsequenceCompiler as proto-PRE Zone B** — This is the key architectural recognition for the EIR implementation roadmap.

3. **Built consumer-generic PRE Zone A primitives** — `projectForBoardroom()` and `projectForBalanced()` are ready for THORR/EIR consumption.

4. **Defined the actual remaining gap** — Cross-surface narrative (surface A → surface B causality) is the real missing capability, not audience calibration of individual surfaces.
