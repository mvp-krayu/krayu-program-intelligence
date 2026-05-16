# Implementation Semantics — PI.LENS.V2.PHASE5B3.PI-RUNTIME-LAYER.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| STRUCTURAL_ESCALATION_CONDITIONS | IntelligenceField.jsx | Per-mode structural condition evaluator | Reusable — extend for new modes |
| EXPANSION_TYPE_LABELS | IntelligenceField.jsx | User-facing labels for expansion types | Reusable — extend for new types |
| INTERROGATION_EXPANSION_REGISTRY | IntelligenceField.jsx | Per-mode expansion generator functions | Reusable — extend for new modes |
| piRuntimeActive | IntelligenceField.jsx | Boolean — structural escalation engaged | Internal state |
| activeExpansionIndex | IntelligenceField.jsx | Index of focused expansion in current list | Internal state |
| interrogationTrail | IntelligenceField.jsx | Set of explored expansion indices (session) | Internal state |
| escalationAvailable | IntelligenceField.jsx | Computed — structural conditions met for current mode | Derived value |
| escalationContext | IntelligenceField.jsx | Computed — mode + zone triggering availability | Derived value |
| expansions | IntelligenceField.jsx | Computed — expansion list from registry for current mode | Derived value |

## 2. Input Contracts

### STRUCTURAL_ESCALATION_CONDITIONS
- **Input:** `fullReport` object, optional `activeZoneKey` string
- **Consumed fields:** `readiness_summary.posture`, `signal_interpretations[].severity`, `topology_summary.structurally_backed_count`, `topology_summary.semantic_domain_count`, `evidence_blocks[].structural_backing`
- **Output:** `boolean`

### INTERROGATION_EXPANSION_REGISTRY generators
- **Input:** `fullReport` object, optional `activeZoneKey` string
- **Consumed fields:** `readiness_summary.*`, `topology_summary.*`, `signal_interpretations[]`, `evidence_blocks[]`, `propagation_summary.*`, `semantic_domain_registry[]`, `semantic_topology_edges[]`, `qualifier_summary.*`
- **Output:** `Array<{ question: string, derive: Function, tone: string, depth: string, boundary: string, expansionType: string }>`

### Expansion derive functions
- **Input:** `fullReport` object
- **Output:** `{ summary: string, evidence: Array<{label, value, severity}>, structuralContext: string|null }`
- **Contract:** Same as GUIDED_QUERY_ANSWERS derive functions

## 3. Output Contracts

### escalationAvailable
- `boolean` — true when structural conditions met for current mode
- Recomputed on: fullReport change, mode change, zone change

### expansions array entries
- `question` — user-facing structural question (no PI/AI/assistant language)
- `derive(fullReport)` — deterministic derivation function
- `tone` — from TONE_PALETTE (operational, forensic, executive, architectural, quiet, alarming, reflective, containment)
- `depth` — 'standard' | 'deep' (never 'micro' for PI expansions)
- `boundary` — governance boundary statement
- `expansionType` — 'structural_expansion' | 'continuity_probe' | 'traversal' | 'resolution' | 'escalation'

## 4. Calibration Assumptions

| Parameter | Value | Governed vs Tuned |
|-----------|-------|-------------------|
| BOARDROOM critical signal threshold | ≥2 | Tuned — operator may adjust |
| BALANCED advisory ratio threshold | >0.3 | Tuned — operator may adjust |
| BALANCED signal threshold | ≥2 | Tuned — operator may adjust |
| DENSE zone requirement | zone-focused + asymmetry | Governed — architectural |
| INVESTIGATION semantic-only threshold | ≥1 | Governed — evidence-driven |
| Expansions per mode | 4 | Tuned — operator may extend |

## 5. Extension Points

- **New modes:** Add entry to `STRUCTURAL_ESCALATION_CONDITIONS` and `INTERROGATION_EXPANSION_REGISTRY` with same function signature
- **New expansion types:** Add to `EXPANSION_TYPE_LABELS`, use in expansion `expansionType` field
- **New tone registers:** Extend `TONE_PALETTE` (already supports 8)
- **Threshold tuning:** Modify condition functions in `STRUCTURAL_ESCALATION_CONDITIONS`
- **Expansion count:** Add/remove entries from registry generator return arrays

## 6. Module Responsibility Map

| File | Concern |
|------|---------|
| IntelligenceField.jsx | All PI Runtime state, conditions, registry, rendering orchestration |
| LensDisclosureShell.jsx | PI authority tier disclosure in governance envelope |
| lens-v2-flagship.js | PI surface CSS |
| 75x_interpretation_authorization_contract.md | PI authorization governance |
