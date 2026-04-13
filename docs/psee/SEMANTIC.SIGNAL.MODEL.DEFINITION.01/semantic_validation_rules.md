# Semantic Validation Rules
# SEMANTIC.SIGNAL.MODEL.DEFINITION.01 — Deliverable 5

## Identity

- Contract: SEMANTIC.SIGNAL.MODEL.DEFINITION.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT SPECIFICATION — NO CODE CHANGES

---

## Purpose

This document defines the complete validation ruleset for semantic model completeness, structural correctness, evidence integrity, and inter-layer consistency. Every validation rule has a pass/fail criterion, severity, and handling procedure.

---

## Validation Scope

Validations are organized into five categories:

| category | code prefix | scope |
|----------|-------------|-------|
| Completeness | V-COMP | Every component, capability, domain covered |
| Structural Integrity | V-STRUCT | Correct topology and non-overlap |
| Evidence Integrity | V-EVID | Traceability chain intact |
| Signal Consistency | V-SIG | Signals internally consistent |
| Inter-layer Compatibility | V-LAYER | Compatibility with 40.x and 41.x layers |

---

## Category 1 — Completeness Validations

### V-COMP-1 — 100% Component Coverage

| field | value |
|-------|-------|
| rule | Every component in the S1 component inventory must have a `cap_assign` assignment |
| check | `COUNT(comp_assign records) == COUNT(s1_component_inventory)` |
| pass | All components assigned (including ISOLATED, CROSS_CUTTING, ENGINEERING_SUPPORT) |
| fail | One or more components have no assignment |
| severity | BLOCKER — model is incomplete; must be resolved before output |
| handling | For each unassigned component: apply outlier handling rules; assign ISOLATED capability if no grouping signals found; record RC codes if applicable |

### V-COMP-2 — No Orphan Capabilities

| field | value |
|-------|-------|
| rule | Every capability must contain at least 1 component |
| check | For all CAP-NN: `COUNT(component_members) >= 1` |
| pass | All capabilities have at least 1 component |
| fail | One or more capabilities have empty component_members |
| severity | BLOCKER — empty capability is invalid |
| handling | Remove empty capability from inventory; re-assign any dependent domain references |

### V-COMP-3 — No Orphan Domains

| field | value |
|-------|-------|
| rule | Every domain must satisfy DCR-1 (≥2 components across its capabilities) |
| check | For all DOM-NN: `SUM(component_count for each capability in domain) >= 2` |
| pass | All domains satisfy minimum component count |
| fail | One or more domains have <2 components |
| severity | BLOCKER unless justified — single-component domain requires DCR-1 justification in evidence record |
| handling | If no justification: merge with nearest domain candidate or flag for investigation |

### V-COMP-4 — No Unclassified Components

| field | value |
|-------|-------|
| rule | Every component must have a `traceability_basis` value (DIRECT_EVIDENCE, DERIVED, INFERRED, or WEAKLY_GROUNDED) |
| check | For all COMP-NN: `evidence_level IS NOT NULL` |
| pass | All components have classification |
| fail | Unclassified component detected |
| severity | BLOCKER |
| handling | Assign WEAKLY_GROUNDED if no better classification available; log reason |

### V-COMP-5 — Capability Coverage of All Components

| field | value |
|-------|-------|
| rule | Every component must appear in exactly one capability's `component_members` list (unless cross-domain annotated) |
| check | For all COMP-NN: `COUNT(capabilities where COMP-NN in component_members) == 1` OR `cross_domain == true` |
| pass | All components have exactly one capability assignment (or cross-domain annotation) |
| fail | Duplicate assignment without cross-domain annotation |
| severity | BLOCKER |
| handling | Investigate conflict; apply cross-domain annotation or resolve to single assignment with evidence |

---

## Category 2 — Structural Integrity Validations

### V-STRUCT-1 — No Capability Overlap

| field | value |
|-------|-------|
| rule | No component appears in more than one capability's `component_members` without cross-domain annotation |
| check | V-COMP-5 (same check; listed separately for clarity of scope) |
| severity | BLOCKER |

### V-STRUCT-2 — No Domain Overlap

| field | value |
|-------|-------|
| rule | No capability appears in more than one domain's `capability_anchors` without cross-domain annotation |
| check | For all CAP-NN: `COUNT(domains where CAP-NN in capability_anchors) == 1` OR `cross_domain == true` |
| pass | All capabilities have exactly one domain assignment (or cross-domain annotation) |
| fail | Capability assigned to multiple domains without annotation |
| severity | BLOCKER |
| handling | Investigate; apply DCR-4 cross-domain annotation with evidence |

### V-STRUCT-3 — Valid Domain Types

| field | value |
|-------|-------|
| rule | All domain `domain_type` values must be from the closed set: {FUNCTIONAL, OPERATIONAL, INFRASTRUCTURE, INTEGRATION, CROSS_CUTTING} |
| check | For all DOM-NN: `domain_type ∈ {FUNCTIONAL, OPERATIONAL, INFRASTRUCTURE, INTEGRATION, CROSS_CUTTING}` |
| pass | All domains use valid types |
| fail | Invalid domain type detected |
| severity | BLOCKER |
| handling | Re-classify using S5 domain_candidate; if still ambiguous, apply nearest valid type and flag |

### V-STRUCT-4 — Cross-Domain Annotations Complete

| field | value |
|-------|-------|
| rule | All components and capabilities flagged `cross_domain = true` must have `cross_domain_secondary` populated |
| check | For all records where `cross_domain == true`: `cross_domain_secondary IS NOT NULL` |
| pass | All cross-domain records have secondary assignment |
| fail | Cross-domain flag without secondary domain/capability reference |
| severity | BLOCKER |
| handling | Complete annotation or remove cross-domain flag |

### V-STRUCT-5 — Consistent Component Count

| field | value |
|-------|-------|
| rule | The component count in `semantic_elevation_report` must match the count in the component inventory |
| check | `COUNT(s1_components) == total_component_count in semantic model` |
| pass | Counts match |
| fail | Count mismatch |
| severity | WARNING — may indicate filtering or exclusion without documentation |
| handling | Document excluded components (test-only, generated, scaffolding); record in evidence |

---

## Category 3 — Evidence Integrity Validations

### V-EVID-1 — Source File Traceability

| field | value |
|-------|-------|
| rule | Every COMP→CAP assignment must have at least one signal with a `source_file` reference |
| check | For all EC-C records: `EXISTS(signal where source_file IS NOT NULL)` |
| pass | All assignments are traceable to a source file |
| fail | Assignment with no source file reference |
| severity | BLOCKER — untraceable assignment violates evidence contract |
| handling | Re-investigate component; provide source file reference or REJECT assignment (RC-C3) |

### V-EVID-2 — S5 Reasoning Trace

| field | value |
|-------|-------|
| rule | Every S5 signal used in a grouping decision must have a `reasoning_trace` populated |
| check | For all EC records where `s5.present == true`: `s5.reasoning_trace IS NOT NULL AND s5.reasoning_trace ≠ ""` |
| pass | All S5 signals have reasoning traces |
| fail | S5 signal without reasoning trace |
| severity | BLOCKER — S5 without trace cannot be audited |
| handling | Re-derive S5 signal with explicit reasoning; do not use S5 signal without trace |

### V-EVID-3 — S5 External Knowledge Check

| field | value |
|-------|-------|
| rule | S5 reasoning traces must not reference knowledge absent from S1–S4 signal bundle |
| check | Audit: reasoning_trace references only `input_signals_used` values; no organization names, product names, or external context not extractable from repository |
| pass | All S5 traces cite only observable evidence |
| fail | S5 trace references external knowledge |
| severity | BLOCKER — violation of S5 constraint |
| handling | RC-C4: reject S5 signal; re-derive without prohibited input |

### V-EVID-4 — Minimum Signal Count

| field | value |
|-------|-------|
| rule | Every COMP→CAP assignment must satisfy TH-C1 (≥1 S1–S4 rule satisfied) |
| check | For all EC-C records: `COUNT(rules_satisfied ∩ {GLC-1, GLC-2, GLC-3, GLC-4}) >= 1` OR `evidence_level == WEAKLY_GROUNDED AND reason documented` |
| pass | All assignments have at least one S1–S4 rule satisfied OR are explicitly classified WEAKLY_GROUNDED |
| fail | Assignment with zero S1–S4 rules and not classified WEAKLY_GROUNDED |
| severity | BLOCKER |
| handling | Classify as WEAKLY_GROUNDED with documentation, or REJECT |

### V-EVID-5 — Evidence Level Consistency

| field | value |
|-------|-------|
| rule | The `evidence_level` in each EC record must match the rules satisfied per the signal sufficiency matrices |
| check | For each EC-C: cross-reference `rules_satisfied` with signal sufficiency matrix; verify `evidence_level` is correct |
| pass | All evidence levels consistent with rules |
| fail | evidence_level contradicts rules_satisfied |
| severity | WARNING |
| handling | Correct evidence_level to match rules; re-validate |

---

## Category 4 — Signal Consistency Validations

### V-SIG-1 — WEAKLY_GROUNDED Flagging

| field | value |
|-------|-------|
| rule | All components with `evidence_level == WEAKLY_GROUNDED` must be flagged `weakly_grounded_flag = true` |
| check | For all EC records: `evidence_level == WEAKLY_GROUNDED → weakly_grounded_flag == true` |
| pass | All WEAKLY_GROUNDED components flagged |
| fail | Unflagged WEAKLY_GROUNDED component |
| severity | WARNING |
| handling | Set flag; surface in validation report |

### V-SIG-2 — S5-Primary Flag

| field | value |
|-------|-------|
| rule | All assignments where S5 is the determining signal must be flagged `s5_primary_flag = true` |
| check | For all EC records: `evidence_level == INFERRED AND GLC-5 in rules_satisfied → s5_primary_flag == true` |
| pass | All S5-primary assignments flagged |
| fail | Unflagged S5-primary assignment |
| severity | WARNING |
| handling | Set flag; note in semantic elevation report |

### V-SIG-3 — S4 Availability Declaration

| field | value |
|-------|-------|
| rule | If S4 signals are absent (no PEG available), this must be explicitly declared in the model's metadata |
| check | `IF ALL EC records have s4.present == false: model_metadata.s4_available == false AND s4_absent_reason IS NOT NULL` |
| pass | S4 availability status is declared |
| fail | S4 absent with no declaration |
| severity | WARNING — affects confidence of grouping; must be documented |
| handling | Record S4 absence in model metadata; note impact on grouping confidence |

### V-SIG-4 — Keyword Conflict Resolution

| field | value |
|-------|-------|
| rule | S2 keywords that appear in >50% of all components must be removed from domain vocabulary before grouping |
| check | For each keyword K: `IF COUNT(components with K in domain_keywords) / total_components > 0.5: K ∉ active_domain_vocabulary` |
| pass | No platform-generic keywords used as domain grouping signals |
| fail | Platform-generic keyword used as primary grouping signal |
| severity | WARNING — inflates cohesion scores artificially |
| handling | Remove keyword from domain vocabulary; recompute affected S2 signals |

### V-SIG-5 — Hub Component Handling

| field | value |
|-------|-------|
| rule | Components classified as S3 SHARED_SERVICE hubs must NOT use coupling edges to group other components |
| check | For all components C with `s3.is_hub == true AND s3.hub_type == SHARED_SERVICE`: verify hub's coupling edges are not used as GLC-3 signals for other components |
| pass | Hub coupling excluded from others' grouping evidence |
| fail | Hub component's in-degree used to group non-hub components |
| severity | WARNING — may produce incorrect grouping |
| handling | Re-run S3 metric computation excluding hub in-degree from T_coupling calculations |

---

## Category 5 — Inter-layer Compatibility Validations

### V-LAYER-1 — 40.x Component Inventory Alignment

| field | value |
|-------|-------|
| rule | If a 40.x entity_catalog is available, every entity in the catalog must appear in the S1 component inventory OR be documented as excluded |
| check | For all 40.x entities: `entity_name ∈ s1_component_names OR entity_id ∈ exclusion_log` |
| pass | Full alignment or documented exclusions |
| fail | 40.x entity absent from S1 inventory without documentation |
| severity | WARNING |
| handling | Add to S1 inventory or record as excluded with reason |

### V-LAYER-2 — 40.x PEG Notation Resolution

| field | value |
|-------|-------|
| rule | If S4 signals use a different entity scheme than S1 (e.g., BM-NNN vs COMP-NN), the mapping must be documented |
| check | `IF s4_notation ≠ s1_notation: mapping_table_exists == true` |
| pass | Notation mapping documented |
| fail | Notation gap undocumented |
| severity | WARNING — affects S4 signal reliability |
| handling | Create entity ID mapping table; update S4 signals with `resolution_type = APPROXIMATE` |

### V-LAYER-3 — 41.x Artifact Field Compatibility

| field | value |
|-------|-------|
| rule | Output of grouping logic must produce fields compatible with existing 41.x artifact structure |
| check | Verify: `original_evidence_ref` mappable from EC-1 `s1.source_file + s1.line_number`; `traceability_basis` mappable from `evidence_level`; `assigned_capability` mappable from `capability_id` |
| pass | All 41.x fields producible from model output |
| fail | 41.x required field not producible |
| severity | BLOCKER — output incompatible with target layer |
| handling | Extend evidence record to include missing field; update schema |

### V-LAYER-4 — build_semantic_layer.py Compatibility

| field | value |
|-------|-------|
| rule | The DOMAINS, CAPABILITIES, COMPONENTS dicts in the recovery script must be derivable from the evidence records |
| check | Verify: DOMAINS dict entries ↔ DOM-NN records; CAPABILITIES dict `domain` field ↔ EC-D records; COMPONENTS dict `cap` field ↔ EC-C records |
| pass | Recovery script structure consistent with evidence records |
| fail | Recovery script diverges from evidence records |
| severity | WARNING — may indicate undocumented manual overrides |
| handling | Reconcile; document any divergence as an explicit grouping decision override |

---

## Validation Checklist

| validation_id | name | severity | phase_to_run |
|--------------|------|---------|--------------|
| V-COMP-1 | 100% Component Coverage | BLOCKER | After COMP→CAP complete |
| V-COMP-2 | No Orphan Capabilities | BLOCKER | After COMP→CAP complete |
| V-COMP-3 | No Orphan Domains | BLOCKER | After CAP→DOM complete |
| V-COMP-4 | No Unclassified Components | BLOCKER | After COMP→CAP complete |
| V-COMP-5 | Capability Coverage | BLOCKER | After COMP→CAP complete |
| V-STRUCT-1 | No Capability Overlap | BLOCKER | After COMP→CAP complete |
| V-STRUCT-2 | No Domain Overlap | BLOCKER | After CAP→DOM complete |
| V-STRUCT-3 | Valid Domain Types | BLOCKER | After CAP→DOM complete |
| V-STRUCT-4 | Cross-Domain Annotations | BLOCKER | After CAP→DOM complete |
| V-STRUCT-5 | Consistent Component Count | WARNING | After all grouping complete |
| V-EVID-1 | Source File Traceability | BLOCKER | Continuously during grouping |
| V-EVID-2 | S5 Reasoning Trace | BLOCKER | When S5 used |
| V-EVID-3 | S5 External Knowledge | BLOCKER | When S5 used |
| V-EVID-4 | Minimum Signal Count | BLOCKER | After COMP→CAP complete |
| V-EVID-5 | Evidence Level Consistency | WARNING | After all grouping complete |
| V-SIG-1 | WEAKLY_GROUNDED Flagging | WARNING | After all grouping complete |
| V-SIG-2 | S5-Primary Flag | WARNING | After all grouping complete |
| V-SIG-3 | S4 Availability Declaration | WARNING | Before grouping starts |
| V-SIG-4 | Keyword Conflict Resolution | WARNING | During S2 extraction |
| V-SIG-5 | Hub Component Handling | WARNING | During S3 extraction |
| V-LAYER-1 | 40.x Alignment | WARNING | Before S1 extraction |
| V-LAYER-2 | PEG Notation Resolution | WARNING | During S4 extraction |
| V-LAYER-3 | 41.x Compatibility | BLOCKER | Before output generation |
| V-LAYER-4 | Recovery Script Compatibility | WARNING | After output generation |

---

## Severity Definitions

| severity | description | consequence |
|---------|-------------|-------------|
| BLOCKER | Failure makes the semantic model invalid | Execution MUST halt; issue MUST be resolved before output |
| WARNING | Failure indicates reduced confidence or documentation gap | Execution MAY continue; issue MUST be surfaced in output; confidence degraded |
| INFO | Advisory; no impact on model validity | Record; no action required |

---

## Incomplete Evidence Handling

When incomplete evidence is encountered, apply the following protocol:

| condition | handling |
|-----------|----------|
| Component with no S1–S4 signals, no S5 | ISOLATED: create 1:1 capability; evidence_level = WEAKLY_GROUNDED; confidence = LOW |
| Component with S5 only | WEAKLY_GROUNDED: assign to best candidate per S5; flag; require human review |
| Capability with no domain grouping signals | ISOLATED domain: create 1:1 domain if >1 component; otherwise investigate |
| S4 absent (no PEG) | Proceed on S1–S3 only; declare S4_ABSENT in model metadata; note confidence impact |
| Conflicting S1 boundaries | Record conflict in EC record; apply cross-domain annotation or flag for manual resolution |
| IIM/session comments absent | Use S2 + S3 + S5 pathway; do not reference non-portable signals; results will be at DERIVED or INFERRED level |

---

## Final Verdict

### Model Completeness Assessment

**Criteria for FULL:**
All BLOCKER validations PASS AND
all components assigned AND
all capabilities in a domain AND
no orphan entities

**Criteria for PARTIAL:**
All BLOCKER validations PASS except V-COMP-1 (some ISOLATED components) OR
some WEAKLY_GROUNDED assignments present but documented OR
S4 signals absent but declared

**Criteria for FAIL:**
Any BLOCKER validation FAILS without documented justification

---

### Model Assessment Summary

**1. Model Completeness:** FULL (when all BLOCKER validations pass) | PARTIAL (when WEAKLY_GROUNDED documented) | FAIL (unresolved BLOCKER)

**2. Portability Assessment:** HIGH

Rationale: All signals S1–S4 are derivable from any repository with module declarations, source files, and build dependencies. S5 is constrained to S1–S4 inputs. No BlueEdge-specific artifact is referenced. Session comments (SIGNAL-01 in BLUEEDGE context) are replaced by S2 naming signals + S5 intent derivation. IIM (SIGNAL-13 in BLUEEDGE context) is replaced by governed S5 derivation with explicit reasoning traces. The model is applicable to NestJS, Spring Boot, Django, Go services, or any other framework with extractable module boundaries.

**3. Traceability Guarantee:** YES

Every semantic assignment produces an EC-1 (COMP→CAP) or EC-2 (CAP→DOM) evidence record with source file references, rule satisfaction records, confidence classification, and (if S5 used) an auditable reasoning trace. The traceability chain from source_file → component_id → capability_id → domain_id is enforced by rejection conditions RC-C3 and V-EVID-1.

**4. Governing Conclusion:** PORTABLE_TRUTH_MODEL_DEFINED

Rationale: The model defines a complete, evidence-constrained, signal-based pathway from observable repository artifacts to a governed semantic layer. All grouping decisions are rule-based (GLC-1..5, GLD-1..4). All evidence is traceable to source files. S5 intent derivation is bounded, auditable, and rejectable. No BlueEdge-specific signals are required. The model is compatible with existing 40.x structural layer outputs and 41.x semantic artifact formats. Validation rules ensure structural completeness, evidence integrity, and inter-layer compatibility.
