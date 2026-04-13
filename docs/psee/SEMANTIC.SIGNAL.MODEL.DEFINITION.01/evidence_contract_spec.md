# Evidence Contract Specification
# SEMANTIC.SIGNAL.MODEL.DEFINITION.01 — Deliverable 4

## Identity

- Contract: SEMANTIC.SIGNAL.MODEL.DEFINITION.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT SPECIFICATION — NO CODE CHANGES

---

## Purpose

This document defines the evidence contract that every semantic assignment (component → capability, capability → domain) must satisfy to remain in the TRUTH layer. The contract specifies required fields, trace format, minimum thresholds, and rejection conditions.

**Governing principle:** No semantic assignment exists without a signed evidence record. Evidence records are the mechanism by which grouping decisions become auditable, reversible, and portable.

---

## Evidence Record Structure

### EC-1 — Component → Capability Assignment Record

Every `cap_assign(COMP-NN) = CAP-?` decision must produce the following evidence record:

```yaml
comp_cap_evidence:
  # Identity
  assignment_id: <unique identifier e.g. EC-C-001>
  component_id: <COMP-NN>
  component_name: <canonical name>
  capability_id: <CAP-NN>
  capability_name: <assigned capability name>
  assignment_date: <ISO date>
  
  # Signal Evidence
  signal_evidence:
    s1:
      present: true | false
      source_file: <path>
      line_number: <n or null>
      extraction_type: MODULE_DECLARATION | DIRECTORY_BOUNDARY | IMPORT_POSITION | BUILD_ARTIFACT
      parent_boundary: <directory path>
      rule_satisfied: GLC-1 | null
    s2:
      present: true | false
      identifiers: [<strings>]
      domain_keywords: [<tokens>]
      shared_keywords_with_capability: [<tokens>]
      keyword_overlap_score: <float>
      rule_satisfied: GLC-2 | null
    s3:
      present: true | false
      coupling_score: <float or null>
      cluster_id: <id or null>
      is_hub: true | false
      dependency_edges: [<target_component_id>]
      rule_satisfied: GLC-3 | null
    s4:
      present: true | false
      peg_source: <path or null>
      coexec_score: <int or null>
      shared_paths: [<EP-NN>]
      rule_satisfied: GLC-4 | null
    s5:
      present: true | false  # present only if S5 was needed
      inferred_intent_label: <string or null>
      confidence: HIGH | MEDIUM | LOW | null
      reasoning_trace: <string or null>
      s5_flag: true  # always true if present
      rule_satisfied: GLC-5 | null
  
  # Classification
  rules_satisfied: [<GLC-1, GLC-2, GLC-3, GLC-4, GLC-5>]
  evidence_level: DIRECT_EVIDENCE | DERIVED | INFERRED | WEAKLY_GROUNDED
  grounding: DIRECT_EVIDENCE | DERIVED | INFERRED | WEAKLY_GROUNDED
  confidence: HIGH | MEDIUM | LOW | WEAKLY_GROUNDED
  
  # Flags
  cross_domain: false | true
  cross_domain_secondary: <CAP-NN or null>  # if cross_domain = true
  weakly_grounded_flag: false | true
  s5_primary_flag: false | true  # true if S5 was determining signal
  
  # Rejection Tracking
  rejected: false | true
  rejection_reason: <string or null>
```

**Required fields:** `assignment_id`, `component_id`, `capability_id`, `rules_satisfied`, `evidence_level`, `confidence`. All signal blocks must be present with `present: true | false`.

---

### EC-2 — Capability → Domain Assignment Record

Every `dom_assign(CAP-NN) = DOM-?` decision must produce the following evidence record:

```yaml
cap_dom_evidence:
  # Identity
  assignment_id: <unique identifier e.g. EC-D-001>
  capability_id: <CAP-NN>
  capability_name: <canonical name>
  domain_id: <DOM-NN>
  domain_name: <assigned domain name>
  domain_type: FUNCTIONAL | OPERATIONAL | INFRASTRUCTURE | INTEGRATION | CROSS_CUTTING
  assignment_date: <ISO date>
  
  # Member Component Evidence (aggregated from EC-1 records)
  component_count: <n>
  component_ids: [<COMP-NN>]
  weakly_grounded_component_count: <n>
  
  # Signal Evidence (at capability level)
  signal_evidence:
    s1:
      structural_layer_coverage: <fraction of components with S1 signals>
      common_boundaries: [<directory paths>]
      rule_satisfied: GLD-1_basis | null  # GLD-1 uses S4 primarily; S1 informs domain type
    s2:
      cap_vocabulary: [<domain keyword tokens from all member components>]
      shared_domain_vocabulary_with_group: [<tokens>]
      naming_convergence_score: <float>
      rule_satisfied: GLD-3 | null
    s3:
      cap_coupling_score: <float>
      inter_capability_edges: <count>
      rule_satisfied: GLD-2 | null
    s4:
      present: true | false
      shared_paths_with_domain_group: [<EP-NN>]
      coexec_cap_score: <int or null>
      rule_satisfied: GLD-1 | null
    s5:
      present: true | false
      domain_candidate: FUNCTIONAL | OPERATIONAL | INFRASTRUCTURE | INTEGRATION | CROSS_CUTTING | null
      majority_confidence: HIGH | MEDIUM | LOW | null
      s5_flag: true
      rule_satisfied: GLD-4 | null
  
  # Classification
  rules_satisfied: [<GLD-1, GLD-2, GLD-3, GLD-4>]
  evidence_level: DIRECT_EVIDENCE | DERIVED | INFERRED | WEAKLY_GROUNDED
  confidence: HIGH | MEDIUM | LOW | WEAKLY_GROUNDED
  
  # Domain Construction Rule Compliance
  dcr_compliance:
    DCR-1_min_components: PASS | FAIL | JUSTIFIED  # ≥2 components
    DCR-2_valid_type: PASS | FAIL
    DCR-3_no_overlap: PASS | FAIL | CROSS_DOMAIN_ANNOTATED
    DCR-4_cross_domain: PASS | N/A
    DCR-5_weakly_grounded: PASS | FLAGGED  # FLAGGED if ≥50% weakly grounded
    DCR-6_naming_from_evidence: PASS | FAIL
    DCR-7_infrastructure_isolation: PASS | N/A
  
  # Flags
  cross_domain: false | true
  cross_domain_secondary: <DOM-NN or null>
  weakly_grounded_domain: false | true  # true if DCR-5 applies
  s5_primary_flag: false | true
  
  # Rejection Tracking
  rejected: false | true
  rejection_reason: <string or null>
```

---

## Minimum Evidence Thresholds

### COMP → CAP Thresholds

| threshold | minimum requirement | consequence of failure |
|-----------|-------------------|----------------------|
| TH-C1 | ≥1 S1–S4 rule satisfied | evidence_level = WEAKLY_GROUNDED; confidence = LOW |
| TH-C2 | ≥2 S1–S4 rules satisfied | enables DERIVED evidence level |
| TH-C3 | GLC-1 satisfied + ≥1 other | enables DIRECT_EVIDENCE level |
| TH-C4 | S5 confidence ≥ MEDIUM when S5 used | enables GLC-5 to count; LOW confidence S5 is NOT counted |
| TH-C5 | At least one signal has source_file reference | assignment is traceable; otherwise REJECTED |

### CAP → DOMAIN Thresholds

| threshold | minimum requirement | consequence of failure |
|-----------|-------------------|----------------------|
| TH-D1 | ≥1 GLD-1..GLD-3 rule satisfied | evidence_level = WEAKLY_GROUNDED; confidence = LOW |
| TH-D2 | ≥2 GLD-1..GLD-3 rules satisfied | enables DERIVED evidence level |
| TH-D3 | GLD-1 satisfied + ≥1 other | enables DIRECT_EVIDENCE level |
| TH-D4 | DCR-1 satisfied (≥2 components) | required; single-component domain requires DCR-1 justification recorded |
| TH-D5 | domain_type from closed set | required; invalid type = REJECTED |
| TH-D6 | All DCR checks pass or are justified | required for valid domain |

---

## Rejection Conditions

### COMP → CAP Rejection Conditions

| rejection_code | condition | action |
|---------------|-----------|--------|
| RC-C1 | Zero S1–S4 rules satisfied AND S5 absent | REJECT — component unassignable; record as ORPHAN |
| RC-C2 | Zero S1–S4 rules satisfied AND S5 LOW confidence | REJECT — insufficient evidence; flag for manual review |
| RC-C3 | No `source_file` reference in any signal | REJECT — untraceable; evidence record invalid |
| RC-C4 | S5 reasoning_trace references external knowledge | REJECT S5 signal; re-derive without that input |
| RC-C5 | Component assigned to non-existent capability | REJECT — capability must exist in inventory |
| RC-C6 | Conflicting S1 boundaries with no resolution | FLAG — record conflict; do not silently choose; apply cross-domain annotation or split investigation |

### CAP → DOMAIN Rejection Conditions

| rejection_code | condition | action |
|---------------|-----------|--------|
| RC-D1 | Zero GLD rules satisfied | REJECT — capability unassignable; flag ORPHAN_CAPABILITY |
| RC-D2 | DCR-1 failure with no justification | REJECT — domain does not meet minimum size without evidence |
| RC-D3 | domain_type not in closed set | REJECT — assign to closest valid type and flag TYPE_OVERRIDE |
| RC-D4 | All rules GLD-4 only (no S1–S4 corroboration) | REJECT domain assignment; evidence insufficient |
| RC-D5 | Domain name introduces vocabulary absent from S2 + S5 | REJECT naming — rename using only signal vocabulary |
| RC-D6 | No `component_ids` recorded | REJECT — empty domain is invalid |

---

## Evidence Trace Format

Evidence records must be serializable and referenceable across artifacts. The canonical reference format is:

```
EC-C-{assignment_id}  →  COMP-NN → CAP-NN  [evidence_level, confidence]
EC-D-{assignment_id}  →  CAP-NN → DOM-NN  [evidence_level, confidence]
```

Evidence records must be stored in `semantic_traceability_map.md` (for COMP→CAP) and `capability_map.md` / `semantic_domain_model.md` (for CAP→DOM) per existing 41.x artifact structure.

---

## Evidence Level Summary

| evidence_level | description | minimum_signals | maps to 41.x |
|---------------|-------------|----------------|--------------|
| DIRECT_EVIDENCE | Multiple corroborating S1–S4 signals | GLC-1 + one other | traceability_basis = DIRECT_EVIDENCE |
| DERIVED | Two S1–S4 signals, no structural anchor | GLC-2 + GLC-3 | traceability_basis = DERIVED |
| INFERRED | S5 + one S1–S4 signal | GLC-5 + one other | traceability_basis = INFERRED |
| WEAKLY_GROUNDED | Single signal or S5-only | ≥1 any | traceability_basis = WEAKLY_GROUNDED [flagged] |
| REJECTED | No valid signal combination | 0 valid rules | Component excluded from semantic model |

---

## Traceability Chain Requirements

Every semantic assignment must satisfy the full traceability chain:

```
source_file (S1 basis)
  → component_id (S1 extraction)
    → signal_evidence (S1–S5 signals)
      → rules_satisfied (GLC-N or GLD-N)
        → capability_id (CAP-NN)
          → dom_assign (GLD-N rules)
            → domain_id (DOM-NN)
```

If any link in this chain is broken (no source_file, no rules_satisfied, no capability_id), the assignment is REJECTED until the link is restored.

**Compatibility with 41.x structure:**

| 41.x field | evidence contract field |
|------------|------------------------|
| semantic_traceability_map.md `original_evidence_ref` | s1.source_file + s1.line_number |
| semantic_traceability_map.md `assigned_capability` | capability_id |
| semantic_traceability_map.md `traceability_basis` | evidence_level |
| capability_map.md `component_members` | component_ids |
| semantic_domain_model.md `component_anchors` | component_ids (via capabilities) |
| semantic_elevation_report.md coherence table | rules_satisfied + confidence per domain |

---

## Evidence Contract — Mandatory Questions

**Q4 — Is every semantic assignment traceable?**

YES, if and only if:
1. Every EC-1 record has `source_file` reference in at least one signal
2. Every EC-2 record has `component_ids` list referencing valid EC-1 records
3. `rules_satisfied` is non-empty for every non-REJECTED assignment
4. `reasoning_trace` is present for every S5 signal used
5. Rejection conditions RC-C3 and RC-D6 are enforced

**Q2 — Is S5 strictly constrained by S1–S4?**

YES, because:
1. EC-1 and EC-2 record `s5.s5_flag = true` for all S5-influenced assignments
2. `s5.reasoning_trace` must cite only `input_signals_used` from S1–S4
3. S5 alone triggers RC-C2 rejection (zero S1–S4 rules + LOW S5) or WEAKLY_GROUNDED flag
4. GLC-5 and GLD-4 both require at least one S1–S4 rule to be also satisfied
