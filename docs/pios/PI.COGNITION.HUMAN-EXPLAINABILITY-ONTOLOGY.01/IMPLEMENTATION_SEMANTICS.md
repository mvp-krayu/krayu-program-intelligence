# Implementation Semantics — PI.COGNITION.HUMAN-EXPLAINABILITY-ONTOLOGY.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| CONDITION_NODES | CognitionOntology.js | 7 condition type cognition nodes | REUSABLE — consumed by proof components, available for all persona surfaces |
| CONSEQUENCE_NODES | CognitionOntology.js | 8 consequence type cognition nodes | REUSABLE |
| COMBINATION_NODES | CognitionOntology.js | 3 combination pattern cognition nodes | REUSABLE |
| RULE_NODES | CognitionOntology.js | 2 rule reference cognition nodes (§4, §5.2) | REUSABLE |
| ALL_NODES | CognitionOntology.js | Unified index of all 20 nodes | REUSABLE |
| resolveNode | CognitionOntology.js | Two-layer resolver: `{ ontology, runtime }` | REUSABLE — primary API for consuming ontology |
| resolveConnections | CognitionOntology.js | Graph edge resolver with human_name resolution | REUSABLE — primary API for graph traversal |
| CognitionNodeExplanation | IntelligenceField.jsx | Rendering component for node explanation + graph refs | INTERNAL — proof-component consumption |

## 2. Input Contracts

### resolveNode(labelId, runtimeContext)
- `labelId`: string — any key from CONDITION_NODES, CONSEQUENCE_NODES, COMBINATION_NODES, or RULE_NODES
- `runtimeContext`: optional `{ consequenceResult, synthesisResult, verificationState }` — when provided, computes runtime layer
- Returns: `{ ontology: CognitionNode, runtime: RuntimeState | null }` or `null` if labelId not found

### resolveConnections(labelId)
- `labelId`: string — any node id
- Returns: `{ upstream: ResolvedRef[], downstream: ResolvedRef[] }` or `null`
- Each ResolvedRef: `{ ref, role, human_name, type }`

## 3. Output Contracts

### Cognition Node Shape (Ontology Layer)
```
{
  id: string,
  type: 'condition' | 'consequence' | 'combination' | 'rule',
  human_name: string,
  what_it_means: string,
  why_it_matters: string,
  operational_implication: string,
  how_detected: string,
  what_to_look_for: string,
  upstream: CognitionRef[],
  downstream: CognitionRef[],
  visible_in: string[],
  verification_scope: string[],
  related_rules: string[],
  runtime: null
}
```

### Cognition Reference Shape
```
{ ref: string, role: 'defining' | 'conditional' | 'contributor' | 'escalation' | 'governance' }
```

### Runtime Layer Shape (when populated)
```
{
  activated: boolean,
  domain: string | null,
  evidence_count: number,
  signal_count: number,
  verification_verdict: string | null,
  replay_verdict: string | null,
  projection_count: number
}
```

## 4. Calibration Assumptions

- Graph connections are derived from SECTION_4_RULES and SECTION_5_2_PATTERNS — if those tables change, the ontology connections must be updated manually
- SYSTEMIC_OP_FRAG has empty upstream/downstream because its contributor pattern is open (any 3+ consequences from 3+ conditions)
- Runtime layer computation is established in signature but deferred — currently returns null without runtimeContext

## 5. Extension Points

- **Runtime computation**: `resolveNode()` accepts runtimeContext and has runtime computation code; future streams can enhance the runtime layer without changing the ontology
- **New cognition nodes**: Adding nodes requires entries in the appropriate map + updating ALL_NODES index
- **Graph corridor**: `resolveConnections()` provides the API for future graph traversal UI
- **Persona-specific projection**: `visible_in` field enables future filtering of explanations by active persona

## 6. Module Responsibility Map

| File | Responsibility |
|------|---------------|
| CognitionOntology.js | Ontology data + resolution functions — owns all 20 cognition nodes and their graph connections |
| IntelligenceField.jsx | Rendering — owns CognitionNodeExplanation component and proof component integration |
| lens-v2-flagship.js | Styling — owns .vp-explanation, .vp-graph-ref CSS |
| ConsequenceCompiler.js | READ ONLY — source of CONSEQUENCE_VOCABULARY (existing three-layer labels) |
| InvestigationVerifier.js | READ ONLY — source of SECTION_4_RULES, SECTION_5_2_PATTERNS (graph connection sources) |
