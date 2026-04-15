---
node_class: artifact
artifact_id: ART-06
artifact_name: binding_envelope.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
Client-specific binding model for the envelope topology surface. Richer than canonical_topology.json — includes node-level signal binding, cross-domain overlaps with evidence IDs, and unknown-space records. Used by envelope_adapter.js / execlens-demo path.

## Producing Step
Derived from L1_AUTHORITATIVE_STRUCTURE via binding derivation. source_stratum=BINDING_MODEL.

## Consuming Steps
`envelope_adapter.js` → binding envelope render model → execlens-demo UI surface

## Structure Summary (run_335c0575a080, client 1de0d815)
nodes: 45, edges: 62, signals: 5 (bound to specific node_ids), overlap_count: 2 (OVL-01: DOM-03↔DOM-05-C; OVL-02: DOM-04↔DOM-05-D), unknown_space_count: 3 (USP-01/02/03 — backend/frontend parity unknown).

## Claims Grounded
[[CLM-06 Runtime Unknown-Space Count]] — 3 USP records (contrast with canonical DIM-04=0)
[[CLM-17 Cross-Domain Structural Overlaps]] — 2 overlaps (contrast with canonical=0)

## Note
This is a different scope from canonical_topology.json. Not contradictory — answers different questions about the same platform.

## Authoritative Path
`clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json`
