---
node_class: claim
claim_id: CLM-26
claim_label: Executive Narrative Phrase Set
claim_type: narrative-support
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation
19 active concepts in concepts.json each have a predicate evaluated against live gauge + topology data by resolver.js. Matched concepts are mapped to phrase templates in phrases.json (Version 1.2). The phrase templates contain placeholders (e.g., {component_count}, {coverage_percent}) that are interpolated with actual values. Each rendered phrase is traceable to its concept_id, phrase_id, and audience_scope via data-* DOM attributes in overview.js. Three executive sections: "Under Control" (CONCEPT-01/02/03/07/12/13/14/15/17), "Concentration" (CONCEPT-08/09/10/11/16), "Outside Visibility" (CONCEPT-04/05/06/18/19).

## Authoritative Value
19 active concepts → rendered phrase set across three executive sections:
- "Under Control": CONCEPT-01, CONCEPT-02, CONCEPT-03, CONCEPT-07, CONCEPT-12, CONCEPT-13, CONCEPT-14, CONCEPT-15, CONCEPT-17
- "Concentration": CONCEPT-08, CONCEPT-09, CONCEPT-10, CONCEPT-11, CONCEPT-16
- "Outside Visibility": CONCEPT-04, CONCEPT-05, CONCEPT-06, CONCEPT-18, CONCEPT-19

## Source Fields
- `concepts.json` → predicates (19 active concepts)
- `resolver.js` → predicate evaluation against live gauge + topology data
- `phrases.json` (Version 1.2) → phrase templates with placeholders

## Upstream Artifacts
- `concepts.json`
- `resolver.js`
- `phrases.json`
- `overview.js`
- [[CLM-25 Executive Three-Axis Verdict]]

## Transformation Chain
- concepts.json predicates → resolver.js → matched concept IDs → phrases.json template lookup → placeholder interpolation → rendered phrases → overview.js DOM (data-* attributes for traceability)

## Entity Links
- Stage of origin: Derived from S1/S2/S4

## Exposure
- ZONE: ZONE-2
- LENS admissible: YES
- Reason: ZONE-2 phrase output only; predicate logic and concept_ids are ZONE-1/3

## Traceability
- Status: FULL
- Caveats: None

## Surfaces
- overview.js: three executive sections (Under Control, Concentration, Outside Visibility)
- ExecHeader
- Each phrase traceable to concept_id, phrase_id, and audience_scope via data-* DOM attributes
