# PSEE.2 — Heuristic Guard Specification

**Stream:** PSEE.2
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/heuristic_admissibility_matrix.md (read-only input)

---

## Heuristic Guard Scope

This document specifies the exact runtime enforcement of the heuristic admissibility matrix. The `HeuristicGuard` module intercepts all heuristic references during PSEE execution and applies classification-specific enforcement. BLOCKED heuristics must not influence any decision. ADMISSIBLE_REFERENCE heuristics may inform operator prompts only. PSEE.X candidate patterns must not enter engine logic.

---

## Heuristic Classification Table (Runtime Reference)

| H-ID | Name | Classification | Runtime Treatment |
|---|---|---|---|
| H-01 | Architecture-first decomposition | BLOCKED | Reject at input boundary; STOP if detected in decision path |
| H-02 | Iterative narrative assessment | BLOCKED | Reject at input boundary; STOP if any narrative artifact produced |
| H-03 | Capability-domain taxonomy as classification anchor | BLOCKED | Reject at input boundary; STOP if capability-domain grouping attempted |
| H-04 | Component inventory by repository | ADMISSIBLE_REFERENCE | Permitted for operator prompt only; must not override boundary doc domain list |
| H-05 | Module-level enumeration | ADMISSIBLE_REFERENCE | Permitted as pattern detection signal hint; overridden by CT-04 observed result |
| H-06 | Cross-component coordination hotspot detection | ADMISSIBLE_REFERENCE | Permitted as candidate overlap pair suggestion for R-NRM-02; cannot determine parity |
| H-07 | Visual graph modeling of program execution | BLOCKED | Reject at input boundary; STOP if visual artifact produced |
| H-08 | Architecture-source reconciliation | ADMISSIBLE_REFERENCE | Permitted for Phase 0 structural sanity check only; cannot override DP-0-04 |
| H-09 | Evidence index with named evidence IDs | ADMISSIBLE_REFERENCE | Permitted for priority tier inference when no boundary tier defined; FX-05 supersedes |
| H-10 | Reverse engineering mapping table | ADMISSIBLE_REFERENCE | Permitted for Phase A contributor identification prompts; single-pass only |
| H-11 | Source snapshot intake record | ADMISSIBLE_REFERENCE | Permitted for boundary document construction when absent (SV-01); cannot replace formal doc |
| H-12 | Lessons-learned capture (multi-part) | UNKNOWN-SPACE | Neither admit nor block; if applied, create US record noting heuristic applicability unknown |

---

## BLOCKED Heuristic Enforcement Rules

The following rules apply to H-01, H-02, H-03, and H-07. Any violation triggers STOP-HEURISTIC.

---

### H-01 Enforcement (Architecture-first decomposition)

```
blocked_input_patterns:
  - Domain formation inputs organized by capability, function, or architectural responsibility
    (rather than source directory path)
  - Domain names that are functional labels (e.g., "authentication", "payments", "API gateway")
    when used as primary_evidence_origin_paths substitutes

enforcement_point: Phase3Handler, R-GRP-01 domain formation input validation
enforcement_rule:
  IF domain_formation_input.type == CAPABILITY_ORGANIZATION:
    STOP: "DOMAIN_INPUT_REJECTED: capability organization not permitted (FB-04; H-01 BLOCKED)"

detection:
  Input to R-GRP-01 domain formation must contain directory paths, not capability labels.
  HeuristicGuard.check_domain_input() validates that each domain identifier is a filesystem path
  or a path-derived label, not a functional descriptor.
```

---

### H-02 Enforcement (Iterative narrative assessment)

```
blocked_output_patterns:
  - Any artifact with type "preliminary assessment"
  - Any artifact with interpretive narrative of corpus capabilities
  - Any assessment-type content in output artifacts O-01..O-07

enforcement_point: Output artifact writer (all phases)
enforcement_rule:
  IF any output artifact contains fields: ["assessment", "preliminary_findings", "capability_description"]:
    STOP: "ASSESSMENT_ARTIFACT_DETECTED: narrative output not permitted (FB-05; H-02 BLOCKED)"

detection:
  HeuristicGuard.check_output_artifact(artifact) scans artifact field names for prohibited assessment fields.
  Structural enumeration fields (CEU description, path enumeration) are permitted.
  Interpretive fields are not.
```

---

### H-03 Enforcement (Capability-domain taxonomy as classification anchor)

```
blocked_input_patterns:
  - Classification records where evidence_class is a capability label
    (e.g., "user_management", "order_processing") rather than an evidence type
    (e.g., "code", "configuration", "documentation")

enforcement_point: Phase5Handler, ClassificationRecord writer
enforcement_rule:
  IF ClassificationRecord.evidence_class NOT IN accepted_evidence_classes:
    STOP: "INVALID_EVIDENCE_CLASS: capability label used as intake classifier (FB-04; H-03 BLOCKED)"

detection:
  accepted_evidence_classes is loaded from evidence_boundary.accepted_evidence_classes.
  Values must be evidence types, not functional categories. If the boundary doc contains
  capability labels in accepted_evidence_classes, the operator is prompted to correct before Phase 5.
```

---

### H-07 Enforcement (Visual graph modeling)

```
blocked_output_patterns:
  - Any artifact with graph_data, visualization, or diagram fields
  - Any write operation to image or graph file formats (*.png, *.svg, *.dot, etc.)

enforcement_point: Any output write operation
enforcement_rule:
  IF output_artifact.type IN ["graph", "visualization", "diagram"] OR
  IF output_file_path matches extension pattern [".png", ".svg", ".dot", ".graphml"]:
    STOP: "VISUAL_ARTIFACT_DETECTED: visual output not permitted (H-07 BLOCKED)"
```

---

## ADMISSIBLE_REFERENCE Enforcement Rules

ADMISSIBLE_REFERENCE heuristics (H-04..H-06, H-08..H-11) may be used by the engine for operator prompt generation and as decision support. They must not populate canonical fields.

### Universal Constraints for All ADMISSIBLE_REFERENCE Heuristics

```
constraint_1: Cannot override FIXED decisions (FX-01..10)
  IF heuristic_result conflicts with a FIXED decision output:
    Discard heuristic_result; use FIXED result; log: "HEURISTIC_OVERRIDDEN_BY_FIXED [h_id, fx_id]"

constraint_2: Cannot produce canonical record fields
  Heuristics may not be the sole basis for populating:
    ceu_index, ovl_records, us_records, classification_map, filter_table
  If a canonical field would be populated solely from a heuristic:
    Create escalation or US record instead; do not populate the field

constraint_3: Cannot resolve unknown-space positions
  IF a heuristic "suggests" that a US record can be resolved:
    Ignore suggestion; US record stands; log: "HEURISTIC_RESOLUTION_REJECTED [h_id, us_id]"

constraint_4: Must be flagged in execution logs
  IF a heuristic informed a decision (even in advisory capacity):
    DPResult.heuristic_flags += h_id
    Escalation log entry notes heuristic role if applicable
```

### Per-Heuristic Usage Gates

| H-ID | Permitted usage gate | Forbidden usage |
|---|---|---|
| H-04 | Phase 0: suggest candidate domain list when no boundary doc exists | Override formal domain list from boundary doc |
| H-05 | Phase 3: flag domain for pattern detection check (CT-04) | Substitute for CT-04 observed result |
| H-06 | Phase 4: suggest CEU pairs to check for structural similarity (R-NRM-02) | Determine file_level_parity or canonical preference |
| H-08 | Phase 0: structural sanity check for DP-0-04 | Override version metadata identity confirmation |
| H-09 | Phase 4 (CEU naming): priority tier hint when no boundary tier defined | Override FX-05 tier sequencing |
| H-10 | Phase 4/5: contributor identification prompts | Substitute for single-pass transformation_mapping; must not iterate |
| H-11 | Phase 0 (SV-01 fallback): boundary document construction basis | Replace formally governed boundary document |

---

## UNKNOWN-SPACE Heuristic (H-12) Enforcement

```
H-12 (Lessons-learned capture):
  classification: UNKNOWN-SPACE
  treatment: Neither admit nor block

  IF H-12 is referenced by a DP handler:
    1. Flag in DPResult.heuristic_flags: "H-12 (UNKNOWN-SPACE)"
    2. Create US record:
         condition_type = "US-CONDITION-03"
         description = "H-12 (lessons-learned) applicability to this corpus is unknown.
                        Lesson <description> may or may not apply. Not applied."
    3. Do not apply the lesson to any canonical field
    4. Continue execution
```

---

## PSEE.X Candidate Pattern Exclusion

PSEE.X candidate patterns (CP-01..09) are not heuristics in the H-xx registry sense, but they are subject to equivalent exclusion enforcement.

```
excluded_pattern_ids: [CP-01, CP-02, CP-03, CP-04, CP-05, CP-06, CP-07, CP-08, CP-09]

enforcement_rule:
  CP_EXCLUSION_LIST is loaded at engine initialization.
  
  IF any DPResult.condition_value OR DPResult.heuristic_flags contains a CP-xx ID:
    STOP: "NON_CANONICAL_AUTHORITY_IN_DECISION_PATH [cp_id=<CP-xx>, dp=<DP-xx>]"

  IF any TransitionRegistry entry references a CP-xx ID as an action:
    STOP at engine initialization: "PSEE_X_PATTERN_IN_TRANSITION_REGISTRY"

  FUTURE_REVIEW patterns (CP-01,02,04,06,07,08):
    Not loaded into DPHandlerRegistry or TransitionRegistry.
    If referenced in implementation notes: must be labeled
    "NON-CANONICAL IMPLEMENTATION SUGGESTION — NOT A RULE"

  REFERENCE_ONLY patterns (CP-03, CP-05, CP-09):
    May appear in operator guidance documentation only.
    Must not appear in engine code paths.
```

---

## HeuristicGuard Module Interface

```
HeuristicGuard {
  blocked_ids:    Set = {H-01, H-02, H-03, H-07}
  admissible_ids: Set = {H-04, H-05, H-06, H-08, H-09, H-10, H-11}
  unknown_ids:    Set = {H-12}
  excluded_cp:    Set = {CP-01..CP-09}

  method: check_dp_result(DPResult) → void
    for h_id in DPResult.heuristic_flags:
      if h_id in blocked_ids:
        raise STOP_HEURISTIC(h_id, DPResult.dp_id)
      if h_id in excluded_cp:
        raise STOP_HEURISTIC(h_id, DPResult.dp_id)
      if h_id in unknown_ids:
        create_us_record(US-CONDITION-03, h_id)
      if h_id in admissible_ids:
        validate_safe_usage_constraint(h_id, DPResult)   // per per-heuristic gate table
        // does NOT stop execution; only logs warning if constraint violated

  method: check_domain_input(domain_formation_input) → void
    if domain_formation_input contains capability_organization indicators:
      raise STOP_BLOCKED_HEURISTIC(H-01)

  method: check_output_artifact(artifact) → void
    if artifact contains assessment fields: raise STOP_BLOCKED_HEURISTIC(H-02)
    if artifact.type in visual_types: raise STOP_BLOCKED_HEURISTIC(H-07)
    if artifact contains capability_class fields: raise STOP_BLOCKED_HEURISTIC(H-03)

  method: validate_safe_usage_constraint(h_id, DPResult) → void
    constraint = ADMISSIBLE_SAFE_USAGE_MAP[h_id]
    if constraint.violated(DPResult):
      log warning: "ADMISSIBLE_HEURISTIC_CONSTRAINT_VIOLATED [h_id, dp_id, constraint]"
      // Warning only; does not STOP (admissible reference violations are operator guidance gaps)
}
```

---

#### STATUS

| Check | Result |
|---|---|
| All 12 heuristics (H-01..H-12) have enforcement rules | CONFIRMED |
| BLOCKED heuristics (H-01..03, H-07) have STOP triggers | CONFIRMED |
| ADMISSIBLE_REFERENCE constraints defined per heuristic | CONFIRMED |
| H-12 UNKNOWN-SPACE treatment defined | CONFIRMED |
| PSEE.X CP-xx exclusion enforcement defined | CONFIRMED |
| HeuristicGuard module interface specified | CONFIRMED |
| No canonical mutation | CONFIRMED |

**HEURISTIC GUARD SPEC: COMPLETE**
