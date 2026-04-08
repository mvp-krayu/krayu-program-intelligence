# PIOS.SIGNAL.EXTRACTION.40_6 — CANONICAL DEFINITION

## 1. ROLE OF 40.6

40.6 is the first lawful signal extraction layer operating on governed consumption state produced by 40.5.

40.6 exists to:
- extract deterministic signal objects from lawfully consumed structural truth
- preserve upstream authority and immutability
- establish governed signal-level units for downstream processing

40.6 does NOT create truth.
40.6 does NOT reinterpret truth.
40.6 does NOT replace truth.

40.6 performs deterministic extraction only.

## 2. SIGNAL EXTRACTION ADMISSIBILITY RULES

Signal extraction is lawful IF AND ONLY IF:

1. Input originates exclusively from lawful 40.5 consumption envelope
2. Input schema remains unchanged
3. Provenance is preserved
4. Extraction is deterministic and rule-bound
5. No semantic fields are introduced
6. No identifier mutation occurs
7. Lineage to 40.5 input is preserved
8. No ≥40.7 behavior is present
9. No cross-layer contamination exists
10. Unresolved states are preserved and not converted into signal truth

Else → FAIL CLOSED

## 3. ELIGIBLE EXTRACTION SOURCES

Signals may be extracted ONLY from:

- ceu_registry
- domain_structure
- structural_topology
- html_influence_map

The following are NOT signal sources and act only as constraints:

- overlap_registry
- unknown_space_registry

No additional sources allowed.

## 4. SIGNAL OBJECT SCHEMA

signal_object_40_6:
  signal_id
  source_ref
  source_type
  structural_ref
  extraction_rule_id
  lineage_ref
  provenance_ref
  constraint_flags:
    - overlap_present
    - unknown_space_present
  emission_status

## 5. UNRESOLVED STATE RULES

Overlap:
- MUST remain UNRESOLVED
- MUST NOT be converted into positive signal truth
- MUST constrain signal validity

Unknown-space:
- MUST remain PERMANENTLY_UNRESOLVED
- MUST NOT be interpreted or removed
- MUST constrain signal validity

## 6. EXTRACTION CONSTRAINTS

Signal extraction MUST:
- be directly traceable to structural inputs
- not introduce inferred meaning
- not aggregate into higher-order constructs
- not derive capabilities or conditions

Signals are atomic extraction units only.

## 7. ALLOWED EMISSIONS

- signal_object_40_6
- signal_extraction_receipt
- lineage_manifest
- constraint_report
- fail_closed_record

NO intelligence outputs allowed.

## 8. FORBIDDEN

- reconstruction
- interpretation
- semantic enrichment
- probabilistic inference
- heuristic inference
- capability derivation
- overlap resolution
- unknown-space resolution
- renaming upstream truth
- aggregation into conditions
- ≥40.7 logic

## 9. TRACEABILITY

All signals MUST reference:
- 40.5 consumption lineage
- upstream structural identifiers
- extraction rule identifier
- constraint state (overlap / unknown-space)

No signal may exist without full lineage.

## 10. FAIL CLOSED

FAIL if:
- input invalid
- schema deviation
- provenance missing
- unresolved state altered
- semantic content detected
- lineage broken
- non-deterministic behavior detected

No partial extraction allowed.

## FINAL RULE

40.6 extracts deterministic signals from lawful consumption state without altering upstream truth.
