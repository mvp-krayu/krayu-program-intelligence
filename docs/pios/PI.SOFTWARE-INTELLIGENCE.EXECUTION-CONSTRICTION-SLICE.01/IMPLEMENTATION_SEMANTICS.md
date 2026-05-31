# IMPLEMENTATION_SEMANTICS.md — Execution Constriction Slice

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| constriction_surface (enrichment) | GenericSemanticPayloadResolver.js | Tarjan articulation point detection + through-flow scoring on import graph | REUSABLE — consumed by ruleExecutionConstriction |
| ruleExecutionConstriction | SignalSynthesisEngine.js | Derives EXECUTION_CONSTRICTION conditions from constriction_surface per domain | REUSABLE — standard rule engine function |
| mapEC | ConsequenceCompiler.js | Maps EXECUTION_CONSTRICTION to OP_BOTTLENECK (defining), COORD_FRAG (conditional), DEP_AMP (conditional) | REUSABLE — standard consequence mapping |

## 2. Input Contracts

**constriction_surface** expects:
- `codeGraphData.data.relationships` — array of `{ source_path, target_path, relation_type }` with `relation_type === 'IMPORTS'`
- Fallback: `centralityData.data.centrality_ranking` — array of `{ path, import_in_degree, import_out_degree, structural_role }`

**ruleExecutionConstriction** expects:
- `structuralEnrichment.constriction_surface` — output of Phase 1
- `registry` — semantic domain registry for domain resolution
- `pressureZoneState` — for file-to-domain resolution

## 3. Output Contracts

**constriction_surface** produces:
- `constriction_hotspots[]` — scored constriction points with bridge status
- `thresholds` — scoring parameters
- `bridge_count`, `articulation_point_count` — structural connectivity metrics
- `constriction_source` — derivation provenance

**ruleExecutionConstriction** produces:
- Standard 17-field condition objects with `condition_type: 'EXECUTION_CONSTRICTION'`
- `_has_bridge_constriction` flag consumed by mapEC for DEP_AMP conditional
- `constriction_evidence` object with per-file metrics

## 4. Calibration Assumptions

- `through_flow_min: 2` — minimum bidirectional edge count for a node to be considered a path conduit
- `bridge_multiplier: 3` — articulation points score 3x because graph disconnection has categorical impact
- Threshold: `max(p75, median * 2)` OR `is_bridge` — bridge nodes always qualify regardless of score
- Severity: p90 → HIGH, median*3 → ELEVATED, else MODERATE

## 5. Extension Points

- Bridge multiplier (3x) can be tuned if real operational data suggests different weighting
- Through-flow minimum (2) can be raised if graphs produce too many low-significance constrictions
- Surface mapping (COORDINATION_SATURATION) can be split into a separate THROUGHPUT_CONSTRICTION surface if needed

## 6. Module Responsibility Map

| File | Responsibility |
|------|---------------|
| GenericSemanticPayloadResolver.js | Owns constriction surface data derivation |
| SignalSynthesisEngine.js | Owns condition vocabulary, interventions, rule function |
| ConsequenceCompiler.js | Owns consequence mapping and cognition slice projection |
| CognitionOntology.js | Owns ontology graph node and upstream/downstream refs |
| InvestigationVerifier.js | Owns §4 verification rules and disposition entry |
| IntelligenceField.jsx | Owns dynamics glyph assignment |
| StructuralTopologyZone.jsx | Owns overlay color |
| SoftwareIntelligenceProjectionAdapter.js | Owns surface-to-condition mapping |
