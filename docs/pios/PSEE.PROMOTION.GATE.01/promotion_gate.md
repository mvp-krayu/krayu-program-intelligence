# PSEE.PROMOTION.GATE.01 — CANONICAL DEFINITION

## 1. PROMOTION ADMISSIBILITY RULES

Promotion from ≤40.4 → ≥40.5 is ALLOWED IF AND ONLY IF:

1. PSEE RESULT = PASS

2. ALL REQUIRED UPSTREAM ARTIFACTS ARE PRESENT IN HEAD:
   - normalized_file_inventory.json
   - ceu_registry.json
   - domain_structure.json
   - overlap_registry.json
   - unknown_space_registry.json
   - html_influence_map.json
   - structural_topology.json
   - psee_runtime_handoff_contract.md
   - psee_consumption_profile.md

3. PROVENANCE COMPLETENESS = COMPLETE:
   - source_origin
   - structural_topology_source
   - documented_taxonomy_source

4. DUAL-LENS COMPLIANCE = COMPLIANT

5. BOUNDARY COMPLIANCE = COMPLIANT

6. OVERLAP PRESERVATION = PRESERVED:
   - resolution_status = UNRESOLVED
   - must_remain_unresolved = true

7. UNKNOWN-SPACE PRESERVATION = PRESERVED:
   - resolution_status = PERMANENTLY_UNRESOLVED
   - inference_applied = false

## 2. PROMOTION PAYLOAD SCHEMA

promotion_payload:

  ceu_registry:
    - ceu_id
    - intake_status
    - source_origin
    - structural_topology_source
    - documented_taxonomy_source

  domain_structure:
    - domain_id
    - ceu_members
    - source_origin
    - structural_topology_source
    - documented_taxonomy_source

  structural_topology:
    - domain_id
    - ceus
    - source_origin
    - structural_topology_source
    - documented_taxonomy_source

  html_influence_map:
    - html_influence
    - html_source_ceus

  overlap_registry:
    - overlap_id
    - file_level_parity
    - resolution_status
    - must_remain_unresolved

  unknown_space_registry:
    - usp_id
    - resolution_status
    - inference_applied

No additional fields permitted.
No transformation permitted.

## 3. MANDATORY EXCLUSIONS

The following MUST NOT cross the boundary:

- ANY interpretation
- ANY resolution
- ANY derived structure
- ANY non-traceable field
- ANY 41.x / 42.x / 51.x references

## 4. UNKNOWN-SPACE BEHAVIOR AT BOUNDARY

Unknown-space MUST:

- cross unchanged
- retain resolution_status = PERMANENTLY_UNRESOLVED
- retain inference_applied = false

Unknown-space MUST NOT:

- be resolved
- be interpreted
- be classified
- be removed

## 5. OVERLAP BEHAVIOR AT BOUNDARY

Overlap MUST:

- cross unchanged
- retain resolution_status = UNRESOLVED
- retain must_remain_unresolved = true

Overlap MUST NOT:

- be resolved
- be merged
- be eliminated

## 6. RE-VALIDATION TRIGGERS

Re-validation of PSEE is REQUIRED if ANY of the following occur:

- any required artifact changes
- any provenance changes
- any structural changes
- any overlap changes
- any unknown-space changes
- any schema changes

Upon trigger:

Promotion becomes INVALID.
PSEE must be re-executed.

## 7. FAILURE-TO-PROMOTE CONDITIONS

Promotion is BLOCKED if ANY of the following occur:

- PSEE result ≠ PASS
- missing required artifact
- incomplete provenance
- field non-compliance
- overlap violation
- unknown-space violation
- semantic contamination
- cross-layer contamination
- payload deviation

## FINAL RULE

Promotion is STRUCTURAL ADMISSION ONLY.

It does NOT validate:
- correctness
- meaning
- capability
- runtime behavior
