# IMPLEMENTATION_SEMANTICS.md — Structural Boundary Divergence Slice

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| boundary_divergence (enrichment) | GenericSemanticPayloadResolver.js | Cross-boundary import ratio analysis per module with orphaned module detection | REUSABLE — consumed by ruleStructuralBoundaryDivergence |
| ruleStructuralBoundaryDivergence | SignalSynthesisEngine.js | Derives STRUCTURAL_BOUNDARY_DIVERGENCE conditions from boundary_divergence per domain | REUSABLE — standard rule engine function |
| mapSBD | ConsequenceCompiler.js | Maps STRUCTURAL_BOUNDARY_DIVERGENCE to GOV_GAP (defining), COORD_FRAG (conditional), PROP_EXP (conditional) | REUSABLE — standard consequence mapping |

## 2. Input Contracts

**boundary_divergence** expects:
- `codeGraphData.data.relationships` — array of `{ source_path, target_path, relation_type }` with `relation_type === 'IMPORTS'`
- Module membership derived from path prefix: `path.split('/').slice(0, 2).join('/')`

**ruleStructuralBoundaryDivergence** expects:
- `structuralEnrichment.boundary_divergence` — output of Phase 1
- `registry` — semantic domain registry for domain resolution
- `pressureZoneState` — for file-to-domain resolution

## 3. Output Contracts

**boundary_divergence** produces:
- `divergent_modules[]` — modules with high cross-boundary import ratios
- `orphaned_modules[]` — modules with files but no import edges
- `system_divergence_index` — ratio of divergent modules to total modules
- `thresholds` — scoring parameters
- `divergent_count`, `orphaned_count`, `module_count`
- `divergence_source` — derivation provenance

**ruleStructuralBoundaryDivergence** produces:
- Standard 17-field condition objects with `condition_type: 'STRUCTURAL_BOUNDARY_DIVERGENCE'`
- `_has_orphaned_modules` flag consumed by consequence mapping context
- `divergence_evidence` object with per-module metrics

## 4. Calibration Assumptions

- `min_edges: 3` — minimum total edges for a module to be considered for divergence scoring
- Divergence threshold: `max(p75, median * 2)` — median-relative to adapt to per-specimen edge distributions
- Cross-boundary ratio: `(out_cross + in_cross) / (out_total + in_total)` — proportion of edges crossing module boundary
- Divergence score: `cross_boundary_ratio * total_edges` — high cross-boundary + high edge count
- Severity: p90 → HIGH, median*3 → ELEVATED, else MODERATE

## 5. Extension Points

- Module membership function (first 2 path segments) can be parameterized for different directory conventions
- Minimum edge threshold (3) can be raised for larger codebases with many small modules
- Orphaned module detection can be extended with additional reasons beyond "no import edges"
- Consequence mapping: PROP_EXP conditional at HIGH can be loosened to ELEVATED if boundary divergence proves to be a stronger propagation signal

## 6. Module Responsibility Map

| File | Responsibility |
|------|---------------|
| GenericSemanticPayloadResolver.js | Owns boundary divergence data derivation |
| SignalSynthesisEngine.js | Owns condition vocabulary, interventions, rule function |
| ConsequenceCompiler.js | Owns consequence mapping and cognition slice projection |
| CognitionOntology.js | Owns ontology graph node and upstream/downstream refs |
| InvestigationVerifier.js | Owns §4 verification rules and disposition entry |
| IntelligenceField.jsx | Owns dynamics glyph assignment |
| StructuralTopologyZone.jsx | Owns overlay color |
| SoftwareIntelligenceProjectionAdapter.js | Owns surface-to-condition mapping |
