---
node_class: claim
claim_id: CLM-15
claim_label: Structural Capability Count
claim_type: count
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
Capabilities are the mid-tier structural nodes representing functional services or surface areas within each domain. They sit between domains (depth=0) and components (depth=2) at depth=1. Each capability is a binding_context for multiple components.

## Authoritative Value
42

## Source Fields
- `canonical_topology.json` → `capabilities[]` (count=42)

## Upstream Artifacts
- [[ART-04 canonical_topology.json]]
- [[CLM-14 Structural Domain Count]]

## Transformation Chain
- pios emit topology → canonical_topology.json → capabilities[] count

## Entity Links
- Stage of origin: S2

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: "42 capability surfaces mapped"

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- TopologySummaryPanel "Surfaces: 42"
