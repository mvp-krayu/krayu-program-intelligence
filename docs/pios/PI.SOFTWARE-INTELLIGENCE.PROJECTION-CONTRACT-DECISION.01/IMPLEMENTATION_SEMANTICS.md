# IMPLEMENTATION_SEMANTICS.md — Projection Contract Decision

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| verifyProjectionDisposition | InvestigationVerifier.js | Validates that every condition type has entries in all REQUIRED registries per the Projection Disposition Contract | REUSABLE — called by IntelligenceField.jsx, available for CI/test harness |
| PROJECTION_DISPOSITION_TABLE | InvestigationVerifier.js | Static table declaring REQUIRED/EXEMPT/DEFERRED status per condition type per registry | REUSABLE — single source of truth for projection coverage |
| DISPOSITION | InvestigationVerifier.js | Enum: REQUIRED, EXEMPT, DEFERRED | REUSABLE |
| GLYPH_EXEMPT_REASONS | InvestigationVerifier.js | Architectural justifications for EXEMPT dispositions | REUSABLE — consumed by verifier for reporting |
| COGNITION_SLICE_VOCABULARY (export) | ConsequenceCompiler.js | Exported vocabulary for cross-module verification | REUSABLE — was internal, now available for verification |
| MAP_CONDITION_KEYS (export) | ConsequenceCompiler.js | Static Set of mapCondition switch case keys | REUSABLE — mirrors the switch statement for verification without runtime invocation |
| DispositionProof | IntelligenceField.jsx | React component rendering disposition verification results | INTERNAL — persona-specific rendering |

## 2. Input Contracts

verifyProjectionDisposition expects a registries object:

```
{
  conditionVocabulary:       Object — keys are CONDITION_VOCABULARY entry keys, values have .internal field
  conditionInterventions:    Object — keys are internal condition types
  cognitionSliceVocabulary:  Object — keys are internal condition types
  mapConditionKeys:          Set    — internal condition types handled by mapCondition
  section4Rules:             Object — keys are internal condition types
  conditionNodes:            Object — keys are internal condition types
  dynamicsGlyphType:         Object — keys are internal condition types
  surfaceConditionMap:       Object — keys are surface IDs, values are arrays of condition types
}
```

## 3. Output Contracts

verifyProjectionDisposition returns:

```
{
  step: 0,
  name: 'PROJECTION_DISPOSITION',
  verdict: 'PASS' | 'FAIL',
  results: [{ condition_type, verdict, reason, missing, exempt }],
  failures: [results where verdict === 'FAIL'],
  condition_count: N,
}
```

## 4. Calibration Assumptions

- Internal condition types are extracted from CONDITION_VOCABULARY values' `.internal` field (deduplicated — GOVERNANCE_COVERAGE_GAP and GOVERNANCE_COVERAGE_COMPLETE share `GOVERNANCE_COVERAGE_STATUS`)
- SURFACE_CONDITION_MAP verification checks that the condition type appears in ANY surface's array (not that it has its own surface)
- EXEMPT entries must have justifications in GLYPH_EXEMPT_REASONS

## 5. Extension Points

When adding a new condition type:
1. Add entry to CONDITION_VOCABULARY (SignalSynthesisEngine.js)
2. Add row to PROJECTION_DISPOSITION_TABLE (InvestigationVerifier.js) — declare REQUIRED/EXEMPT for each registry
3. Populate all REQUIRED registries
4. If EXEMPT, add justification to GLYPH_EXEMPT_REASONS
5. Run investigation to verify disposition — step_0 catches missing entries

## 6. Module Responsibility Map

| File | Responsibility |
|------|---------------|
| InvestigationVerifier.js | Owns disposition contract definition + verification logic |
| ConsequenceCompiler.js | Owns consequence-layer registries (COGNITION_SLICE_VOCABULARY, mapCondition) |
| SignalSynthesisEngine.js | Owns condition-layer registries (CONDITION_VOCABULARY, CONDITION_INTERVENTIONS) |
| CognitionOntology.js | Owns ontology registry (CONDITION_NODES) |
| IntelligenceField.jsx | Owns runtime integration and visual rendering of disposition results |
| SoftwareIntelligenceProjectionAdapter.js | Owns surface registry (SURFACE_CONDITION_MAP) |
