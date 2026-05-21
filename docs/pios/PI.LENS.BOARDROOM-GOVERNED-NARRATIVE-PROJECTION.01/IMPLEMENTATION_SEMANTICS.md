# IMPLEMENTATION_SEMANTICS — PI.LENS.BOARDROOM-GOVERNED-NARRATIVE-PROJECTION.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `composeGoverningNarrative` | GoverningNarrativeComposer.js | Main entry: orchestrates narrative anchor derivation, composition input assembly, provider execution | REUSABLE — any client with spine_objects |
| `deriveNarrativeAnchors` | GoverningNarrativeComposer.js | Converts hero moments + structural enrichment into sorted narrative anchors | REUSABLE — exported |
| `deterministicBoundedProvider` | GoverningNarrativeComposer.js | Bootstrap composition provider: deterministic editorial prose from structural evidence | REUSABLE — exported, replaceable by future L4 provider |
| `NarrativeEnvelope` | IntelligenceField.jsx | React component: renders governed narrative with S-state header, prose body, provenance footer | INTERNAL — BOARDROOM S1 rendering |
| `NarrativeProofSubstrate` | IntelligenceField.jsx | React component: expandable evidence panel per narrative paragraph | INTERNAL — consumed by NarrativeEnvelope |
| `BoardroomStructuralPosture` | IntelligenceField.jsx | React component: fallback when governed_narrative unavailable | INTERNAL — consumed by BoardroomDecisionSurface |

## 2. Input Contracts

### composeGoverningNarrative

| Parameter | Type | Source |
|-----------|------|--------|
| `spineData` | `{ objects: { hero_moments[], evidence_objects[] } }` | spine/spine_objects.json via GenericSemanticArtifactLoader |
| `structuralEnrichment` | `{ available, code_graph?, centrality?, dual_authority? }` | deriveStructuralEnrichment() in GenericSemanticPayloadResolver |
| `canonicalTopology` | `{ clusters[], counts? }` | canonical_topology_40_4 artifact |
| `qualificationLevel` | `string` ('S1', 'S2', etc.) | manifest.qualification_level |
| `manifest` | `{ client, labels? }` | Client/run manifest |

### deterministicBoundedProvider

| Parameter | Type | Description |
|-----------|------|-------------|
| `compositionInput.narrative_anchors` | `NarrativeAnchor[]` | Sorted anchors from deriveNarrativeAnchors |
| `compositionInput.structural_context` | `object` | Cluster count, node count, edge counts, dual_authority, top_spines, role_summary |
| `compositionInput.qualification_context` | `object` | specimen_id, s_state, gate_status, ceu_state |
| `compositionInput.composition_governance` | `object` | contract ('75.x'), prohibitions (13) |

## 3. Output Contracts

### composeGoverningNarrative → governed_narrative

```
{
  available: boolean,
  paragraphs: [
    {
      arc_position: 'OPENING' | 'REVELATION' | 'DEPTH' | 'AUTHORITY' | 'QUALIFICATION',
      text: string,
      anchors: [{ anchor_id, source: { hero_moment_id, surprise_class }, evidence_object_ids[], structural_basis }],
      governance: { authority: 'STRUCTURAL_NARRATIVE', contract: '75.x' }
    }
  ],
  composition_provenance: {
    method: 'DETERMINISTIC_BOUNDED',
    governance_contract: '75.x',
    prohibitions_enforced: 13,
    replay_tier: 'EXACT',
    anchors_consumed: number,
    evidence_objects_referenced: number,
    composition_version: string,
    composition_timestamp: string
  },
  structural_summary: { cluster_count, node_count, import_edges, inheritance_edges, file_count, dual_authority, top_spines, role_summary },
  qualification_context: { specimen_id, specimen_display, s_state, gate_status, ceu_state },
  proof_graph: {
    hero_moments: object[],
    evidence_objects: object[],
    narrative_anchors: NarrativeAnchor[]
  }
}
```

## 4. Calibration Assumptions

| Constant | Value | Status |
|----------|-------|--------|
| `COMPOSITION_VERSION` | '1.0' | GOVERNED — increment on composition logic changes |
| `GOVERNANCE_CONTRACT` | '75.x' | GOVERNED — tracks 75.x prohibition framework |
| `PROHIBITIONS_ENFORCED` | 13 | GOVERNED — must match actual prohibition count |
| `SURPRISE_CLASS_PRIORITY` | CENTRALITY=0, TOPOLOGY=1, COUPLING=2, EMERGENCE=3 | TUNED — controls narrative arc ordering |
| Cluster scale threshold | 10 clusters → 'large-scale' vs 'mid-scale' | TUNED — prose phrasing only |

## 5. Extension Points

1. **Composition provider replacement**: `deterministicBoundedProvider` can be replaced by any function satisfying `(compositionInput) → { paragraphs, composition_provenance }`. Future L4 provider would set `method: 'GOVERNED_L4_SYNTHESIS'` and `replay_tier: 'STRUCTURAL'`.

2. **Multi-client**: `composeGoverningNarrative` is client-agnostic. Any manifest with a `spine_objects` optional artifact path will produce governed narrative. Composition quality depends on hero moment availability.

3. **Additional arc positions**: The paragraph arc can be extended (e.g., 'EMERGENCE' position) by adding logic to `deterministicBoundedProvider`. No architectural change required.

4. **NarrativeAnchor derivation**: Additional anchor sources (beyond hero_moments and dual_authority) can be added to `deriveNarrativeAnchors` without changing the composition interface.

## 6. Module Responsibility Map

| File | Responsibility |
|------|---------------|
| `GoverningNarrativeComposer.js` | Composition contract, anchor derivation, deterministic provider — GEIOS-LENS bridge boundary |
| `GenericSemanticPayloadResolver.js` | Invokes composition, produces `governed_narrative` field in fullReport |
| `GenericSemanticArtifactLoader.js` | Loads spine_objects via manifest optional artifacts (no changes — existing generic loader) |
| `IntelligenceField.jsx` | Renders narrative envelope in BOARDROOM S1; preserves cockpit in BOARDROOM S2+ |
| `lens-v2-flagship.js` | Narrative envelope CSS (editorial typography, proof substrate, provenance) |
| `netbox manifest` | Declares spine_objects artifact path |
