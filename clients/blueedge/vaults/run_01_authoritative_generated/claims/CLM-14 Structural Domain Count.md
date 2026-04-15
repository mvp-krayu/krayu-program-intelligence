---
node_class: claim
claim_id: CLM-14
claim_label: Structural Domain Count
claim_type: metric
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

The canonical topology contains 17 functional domains. Domains are the highest-level structural groupings in the platform topology. Domain names are business-meaningful labels; component-level names are ZONE-0/3 only.

## Authoritative Value

17

## Source Fields

- `canonical_topology.json` → `counts.domains`

## Upstream Artifacts

- [[ART-04 canonical_topology.json]]

## Transformation Chain

- S2 topology emission

## Exposure

- ZONE: ZONE-2
- LENS admissible: YES
- Reason: Safe — topology summary

## Traceability

- Status: FULL
- Caveats: None

## Surfaces

- TopologyExplorer domain list
