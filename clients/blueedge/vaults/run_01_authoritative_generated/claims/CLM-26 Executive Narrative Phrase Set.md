---
node_class: claim
claim_id: CLM-26
claim_label: Executive Narrative Phrase Set
claim_type: set
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Business ontology phrases are GAUGE-rendered outputs. The GAUGE concept resolver evaluates predicate logic against live assessment data (gauge_state.json + canonical_topology.json) and resolves active concepts into business-language phrases. The phrase output is ZONE-2 safe; predicate logic and concept_ids are ZONE-1/3 only.

## Authoritative Value

Resolved phrase outputs from 19 active business concepts (GAUGE runtime)

## Source Fields

- `concepts.json` → predicate evaluation
- `phrases.json` → resolved phrase output
- `resolver.js` → concept resolution engine

## Upstream Artifacts

- [[ART-01 gauge_state.json]]
- [[ART-04 canonical_topology.json]]

## Transformation Chain

- concepts.json predicates → resolver.js evaluation → phrases.json phrase output (GAUGE render)

## Exposure

- ZONE: ZONE-1 (concept resolution detail) / ZONE-2 (phrase output only)
- LENS admissible: YES (phrase output only)
- Reason: Predicate logic and concept_ids are operator language

## Traceability

- Status: CONDITIONAL
- Caveats: Phrase output is GAUGE-rendered; not stored in execution chain artifacts

## Surfaces

- All GAUGE panels (phrases rendered by concept resolver)
