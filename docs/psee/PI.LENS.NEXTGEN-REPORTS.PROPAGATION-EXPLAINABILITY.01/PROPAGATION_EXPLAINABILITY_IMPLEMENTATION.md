# PROPAGATION EXPLAINABILITY — Implementation Record
## PI.LENS.NEXTGEN-REPORTS.PROPAGATION-EXPLAINABILITY.01

### Implementation Overview

CREATE_ONLY. LIMITED_IMPLEMENTATION. Propagation rendering explains committed structural propagation — it does not compute structural propagation. LENS is a rendering shell. All topology and propagation data is sealed in the report_object at GEIOS generation time.

### Propagation Explainability Philosophy

Propagation explainability surfaces make committed structural propagation visible to executive and advisory audiences. The rendering layer:
- Passes propagation paths through as ordered domain alias sequences (VIS-PROP-02: ALI-04 aliases only, no raw cluster keys)
- Maps propagation roles to governance-derived display labels (VIS-PROP-01)
- Maps pressure tiers to governance-derived tokens with no numerical values (VIS-PRESS-01)
- Applies qualifier overlays to communiciate grounding scope impact on propagation interpretation
- Renders blocked and diagnostic states explicitly — never silent (VIS-BLOCK-01/02, VIS-DIAG-01)

### Components Implemented

| Component | File | Type |
|---|---|---|
| PropagationSemanticMapper | PropagationSemanticMapper.js | Pure CJS |
| PropagationDensityController | PropagationDensityController.js | Pure CJS |
| PropagationExplainabilitySurface | PropagationExplainabilitySurface.jsx | React (client) |
| PropagationSummaryBlock | PropagationSummaryBlock.jsx | React (client) |
| PropagationChainBlock | PropagationChainBlock.jsx | React (client) |
| PropagationQualifierOverlay | PropagationQualifierOverlay.jsx | React (client) |
| PropagationSeverityIndicator | PropagationSeverityIndicator.jsx | React (client) |
| PropagationEvidenceLinkage | PropagationEvidenceLinkage.jsx | React (client) |

### Propagation Rendering Architecture

```
PropagationExplainabilitySurface
  ├── mapPropagationState()         — surface mode (FULL/QUALIFIED/DIAGNOSTIC/BLOCKED)
  ├── resolvePropagationDensityLayout()  — section visibility
  ├── PropagationQualifierOverlay   — Q-00..Q-04 overlay / Q-04 absence notice
  ├── [diagnostic_notice]           — explicit when DIAGNOSTIC_ONLY
  ├── PropagationSummaryBlock       — normalized propagation narrative
  ├── PropagationChainBlock         — ordered path arrays with severity
  │     └── PropagationSeverityIndicator  — per-chain pressure tier display
  └── PropagationEvidenceLinkage    — domain-role-evidence triples
```

### Propagation Role Mapping (VIS-PROP-01)

| PropagationRole | display_label | indicator |
|---|---|---|
| ORIGIN | Origin of Pressure | source-indicator |
| RECEIVER | Pressure Receiver | receiver-indicator |
| PASS_THROUGH | Pressure Pass-through | flow-indicator |
| ISOLATED | Independent Domain | neutral-indicator |

Raw enum values (ORIGIN, RECEIVER, PASS_THROUGH, ISOLATED) never appear in any display surface.

### Pressure Tier Mapping (VIS-PRESS-01)

| PressureTier | display_label | token |
|---|---|---|
| HIGH | High execution pressure | token-pressure-high |
| ELEVATED | Elevated pressure | token-pressure-elevated |
| MODERATE | Moderate pressure | token-pressure-moderate |
| LOW | Stable / low pressure | token-pressure-low |

Numerical values are forbidden in all pressure indicators.

### Evidence-Linked Propagation Rendering

PropagationEvidenceLinkage renders evidence_links[] as domain-role-summary triples. Missing evidence (empty array) is rendered explicitly with a labeled notice — never silent.

### Qualifier-Aware Propagation Rendering

PROPAGATION_QUALIFIER_MAP maps Q-00..Q-04:
- Q-00: no overlay rendered
- Q-01: amber overlay — grounded domain scope notice
- Q-02: blue overlay — structural topology scope notice
- Q-03: grey overlay — advisory confirmation notice
- Q-04: no overlay, but absence_notice mandatory ("Signal intelligence withheld from this view.")

### Blocked / Diagnostic Propagation Rendering

- BLOCKED: blocked_notice = "Readiness classification unavailable". All chains and evidence hidden. role="alert" aria-live="assertive".
- DIAGNOSTIC_ONLY: diagnostic_notice rendered at surface top. Chains and evidence remain visible. role="status" aria-live="polite".

Neither state is ever silent.

### Propagation Density Orchestration

| Density Class | Summary | Chains | Evidence | Max Chains | Collapsed |
|---|---|---|---|---|---|
| EXECUTIVE_DENSE | true | true | true | 3 | false |
| EXECUTIVE_BALANCED | true | true | false | 2 | true |
| INVESTIGATION_DENSE | true | true | true | 3 | false |

evidence_references_preserved is always true regardless of density class.

### Deterministic Rendering Guarantees

- All mapper functions are pure: same input → same output
- No stochastic behavior, no live API calls, no AI generation
- scanPropagationText() is test-only — never called at render time

### Topology Immutability Guarantees

- No topology traversal at render time
- No propagation chain reordering by renderer
- No inferred propagation links
- No schema mutation
- report_object and propagationProps never mutated

### Integration Points

- Upstream: NarrativeAdapter → propagationProps shape
- Visual semantics authority: visual_semantics_registry.json (VIS-PROP-01/02, VIS-PRESS-01/02)
- Evidence rules authority: evidence_panel_rules_registry.json (EXP-TRACE-01, EXP-QUAL-01/02)
- Density: shared EXECUTIVE_DENSE / EXECUTIVE_BALANCED / INVESTIGATION_DENSE taxonomy

### Phase-2 Explainability Boundaries

No topology visualization (Phase 3+). No animated flow (VIS-PROP-02). No conversational investigation. No prompt input. No AI explainability generation. Topology visualization placeholder in Phase 2 per phase_2_restrictions in visual_semantics_registry.json.
