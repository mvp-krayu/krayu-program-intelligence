# SEMANTIC.SIGNAL.MODEL.DEFINITION.01 — Execution Log

## Identity

- Contract: SEMANTIC.SIGNAL.MODEL.DEFINITION.01
- Date: 2026-04-13
- Executor: Claude Code (claude-sonnet-4-6)
- Branch: work/psee-runtime (confirmed)
- Repository: git@github.com:mvp-krayu/krayu-program-intelligence.git
- Mode: STRICT SPECIFICATION — NO CODE CHANGES

---

## Pre-flight

| check | result |
|-------|--------|
| git_structure_contract.md loaded | PASS |
| reference_boundary_contract.md enforced | PASS |
| branch confirmed | work/psee-runtime |
| repository confirmed | k-pi-core (krayu-program-intelligence) |
| no code changes authorized | CONFIRMED |
| output directory | docs/psee/SEMANTIC.SIGNAL.MODEL.DEFINITION.01/ |
| output directory created | PASS |
| 40.x context loaded | PASS — 40.3 entity catalog, PEG, structural_traceability_map referenced |
| 41.x context loaded | PASS — 41.1 semantic layer artifacts and BLUEEDGE forensics deliverables used for alignment |
| BlueEdge-specific artifact dependency check | PASS — no BlueEdge-only signals introduced |

---

## Phase 1 — Signal Type Definition

**Objective:** Define the minimal, sufficient set of portable signal types S1–S5.

| step | action | result |
|------|--------|--------|
| 1.1 | Define S1 (STRUCTURAL) signal | Module declarations, filesystem topology, import positions; sources enumerated for 6 framework types |
| 1.2 | Define S2 (NAMING) signal | Identifier tokenization, CamelCase/snake_case splitting, STOPWORD_SET defined, route path parsing |
| 1.3 | Define S3 (DEPENDENCY) signal | Directed dependency graph, coupling_score formula, hub detection, cluster detection |
| 1.4 | Define S4 (EXECUTION) signal | PEG co-execution matrix, T_coexec and T_strong_coexec thresholds, absence handling |
| 1.5 | Define S5 (DERIVED_INTENT) signal | Constrained LLM-assisted classification; input signal requirements; reasoning trace requirement; override_permitted = false |
| 1.6 | Define signal hierarchy | S1 > S4 > S3 > S2 > S5 (by weight) |
| 1.7 | Verify portability | All signals derivable from any repository; no BlueEdge-specific source required |

**Phase 1 status:** COMPLETE

---

## Phase 2 — Signal Derivation Rules

**Objective:** Define how each signal is derived from raw repository evidence.

| step | action | result |
|------|--------|--------|
| 2.1 | Define DR-S1 extraction method | 4-step: root inventory → boundary detection → hierarchy construction → co-location grouping |
| 2.2 | Define DR-S2 extraction method | 5-step: identifier collection → tokenization → route parsing → frequency map → cross-component overlap |
| 2.3 | Define DR-S3 extraction method | 5-step: edge extraction → graph construction → metric computation → cluster detection → hub classification |
| 2.4 | Define DR-S4 extraction method | 5-step: PEG ingestion → entity ID resolution → co-execution matrix → scoring → path-level domain detection; PEG absence handling defined |
| 2.5 | Define DR-S5 derivation method | 5-step: signal assembly → intent inference (4 rules) → domain candidate assignment → confidence scoring → reasoning trace; prohibited inputs defined |
| 2.6 | Define derivation order constraints | S1 first; S2/S3 parallel; S4 parallel (needs PEG); S5 last |
| 2.7 | Define failure modes | Per-signal failure modes defined; DEGRADED/ISOLATED/ABSENT states specified |

**Phase 2 status:** COMPLETE

---

## Phase 3 — Grouping Logic Formalization

**Objective:** Formalize semantic grouping logic as a repeatable method.

| step | action | result |
|------|--------|--------|
| 3.1 | Define GLC-1 (Structural Co-location) | S1 required; parent boundary equality; weight HIGH |
| 3.2 | Define GLC-2 (Naming Cohesion) | S2 required; shared_keywords ≥ T_keyword; weight MEDIUM; platform-generic keyword exclusion |
| 3.3 | Define GLC-3 (Dependency Coupling) | S3 required; coupling_score ≥ T_coupling OR cluster membership; hub component handling defined |
| 3.4 | Define GLC-4 (Execution Co-participation) | S4 required; coexec_score ≥ T_coexec; weight HIGH; absent when no PEG |
| 3.5 | Define GLC-5 (Intent Alignment) | S5 + one of GLC-1..4; cannot override S1–S4 evidence; weight MEDIUM |
| 3.6 | Define COMP→CAP decision flow | 7-step sequential decision procedure |
| 3.7 | Define signal sufficiency matrix (COMP→CAP) | DIRECT_EVIDENCE / DERIVED / INFERRED / WEAKLY_GROUNDED / UNASSIGNABLE |
| 3.8 | Define outlier handling | ISOLATED, CROSS_DOMAIN, HUB, WEAKLY_EVIDENCED, ORPHAN |
| 3.9 | Define GLD-1 (Execution Domain Cohesion) | S4 required; shared paths ≥ T_coexec_cap; weight HIGH |
| 3.10 | Define GLD-2 (Dependency Topology) | S3 required; cap_coupling_score ≥ T_cap_coupling; weight MEDIUM |
| 3.11 | Define GLD-3 (Naming Convergence) | S2 required; shared vocabulary ≥ T_domain_keyword (≥3); weight MEDIUM |
| 3.12 | Define GLD-4 (Intent Grouping) | S5 + one of GLD-1..3; weight MEDIUM under constraint |
| 3.13 | Define CAP→DOMAIN decision flow | 7-step sequential decision procedure |
| 3.14 | Define domain construction rules | DCR-1 through DCR-7 |
| 3.15 | Define signal sufficiency matrix (CAP→DOMAIN) | DIRECT_EVIDENCE / DERIVED / INFERRED / WEAKLY_GROUNDED / UNASSIGNABLE |
| 3.16 | Define boundary conditions | CROSS_DOMAIN, ORPHAN, OVER_CLUSTERING, UNDER_CLUSTERING, INFRASTRUCTURE_ISOLATION |
| 3.17 | Define capability naming rules | 4 naming rules; vocabulary source constrained to S1–S5 |

**Phase 3 status:** COMPLETE

---

## Phase 4 — Evidence Contract

**Objective:** Ensure all semantic assignments remain in TRUTH layer.

| step | action | result |
|------|--------|--------|
| 4.1 | Define EC-1 COMP→CAP evidence record structure | 7 sections; all signal blocks required; s5_flag enforced |
| 4.2 | Define EC-2 CAP→DOMAIN evidence record structure | DCR compliance table embedded; component aggregation from EC-1 |
| 4.3 | Define minimum thresholds (COMP→CAP) | TH-C1 through TH-C5 |
| 4.4 | Define minimum thresholds (CAP→DOMAIN) | TH-D1 through TH-D6 |
| 4.5 | Define rejection conditions (COMP→CAP) | RC-C1 through RC-C6 |
| 4.6 | Define rejection conditions (CAP→DOMAIN) | RC-D1 through RC-D6 |
| 4.7 | Define evidence trace format | EC-C and EC-D reference notation; traceability chain from source_file to domain_id |
| 4.8 | Define evidence level mapping | DIRECT_EVIDENCE / DERIVED / INFERRED / WEAKLY_GROUNDED / REJECTED mapped to 41.x traceability_basis |
| 4.9 | Define traceability chain requirements | 5-link chain; any broken link = REJECTED |

**Phase 4 status:** COMPLETE

---

## Phase 5 — Validation Rules

**Objective:** Define rules ensuring semantic completeness and correctness.

| step | action | result |
|------|--------|--------|
| 5.1 | Define V-COMP validations (5 rules) | COMP-1: 100% coverage; COMP-2: no orphan caps; COMP-3: no orphan domains; COMP-4: all classified; COMP-5: capability coverage |
| 5.2 | Define V-STRUCT validations (5 rules) | No cap overlap; no domain overlap; valid domain types; cross-domain annotations; consistent counts |
| 5.3 | Define V-EVID validations (5 rules) | Source file traceability; S5 reasoning trace; S5 external knowledge check; minimum signal count; evidence level consistency |
| 5.4 | Define V-SIG validations (5 rules) | WEAKLY_GROUNDED flagging; S5-primary flag; S4 availability declaration; keyword conflict resolution; hub handling |
| 5.5 | Define V-LAYER validations (4 rules) | 40.x alignment; PEG notation resolution; 41.x field compatibility; recovery script compatibility |
| 5.6 | Define severity levels | BLOCKER (11 rules) / WARNING (13 rules) |
| 5.7 | Define incomplete evidence handling | Protocol for 6 incomplete evidence conditions |
| 5.8 | Write final verdict | Model completeness / portability / traceability / governing conclusion |

**Phase 5 status:** COMPLETE

---

## Files Written

| file | status |
|------|--------|
| semantic_signal_types_spec.md | WRITTEN |
| signal_derivation_rules.md | WRITTEN |
| semantic_grouping_logic.md | WRITTEN |
| evidence_contract_spec.md | WRITTEN |
| semantic_validation_rules.md | WRITTEN |
| SEMANTIC.SIGNAL.MODEL.DEFINITION.01_EXECUTION_LOG.md | WRITTEN (this file) |

---

## Files Modified

NONE — Mode: STRICT SPECIFICATION

---

## Pre-closure Checks

| check | status |
|-------|--------|
| C1 — semantic_signal_types_spec.md exists | PASS |
| C2 — signal_derivation_rules.md exists | PASS |
| C3 — semantic_grouping_logic.md exists | PASS |
| C4 — evidence_contract_spec.md exists | PASS |
| C5 — semantic_validation_rules.md exists | PASS |
| C6 — execution log exists | PASS (this file) |
| C7 — all signal types defined (S1–S5) | PASS — S1 through S5 fully specified in semantic_signal_types_spec.md |
| C8 — derivation rules complete | PASS — DR-S1 through DR-S5 with input, method, output, failure modes |
| C9 — grouping logic formalized | PASS — GLC-1..5 (COMP→CAP) and GLD-1..4 (CAP→DOM); decision flows; DCR-1..7; boundary conditions |
| C10 — evidence contract complete | PASS — EC-1, EC-2 schemas; TH-C1..5 and TH-D1..6 thresholds; RC-C1..6 and RC-D1..6 rejection conditions |
| C11 — validation rules complete | PASS — 24 validation rules (V-COMP, V-STRUCT, V-EVID, V-SIG, V-LAYER); final verdict in semantic_validation_rules.md |
| C12 — no code changes made | PASS |
| C13 — no BlueEdge-only dependencies introduced | PASS — all signals defined from observable repository data; session comments replaced by S2+S5 pathway; IIM replaced by governed S5 derivation |

---

## Mandatory Questions — Answers

**Q1 — Are all signals derivable from observable repository data?**
YES. S1 reads module declarations and filesystem structure present in any repository. S2 reads identifier strings. S3 reads import/dependency declarations. S4 reads PEG output (from 40.x) — absent when 40.x not run, declared. S5 is derived from S1–S4 only. No signal requires external sources.

**Q2 — Is S5 strictly constrained by S1–S4?**
YES. S5 requires `input_signals_used` citing S1–S4. `override_permitted = false` is hardcoded. S5 alone triggers WEAKLY_GROUNDED or REJECTED status. GLC-5 and GLD-4 both require at least one S1–S4 rule to also be satisfied. V-EVID-3 rejects S5 signals that reference external knowledge.

**Q3 — Can grouping decisions be reproduced deterministically?**
YES for S1–S4: all extraction methods are deterministic parsing and graph operations. S5 is reproducible if: (1) the same LLM with the same parameters is used, OR (2) the `reasoning_trace` is preserved and used as the canonical record regardless of LLM re-inference.

**Q4 — Is every semantic assignment traceable?**
YES. Every EC-1 and EC-2 record has a source file traceability chain enforced by V-EVID-1 (BLOCKER). The full chain: source_file → component_id → signal_evidence → rules_satisfied → capability_id → domain_id is defined as the mandatory traceability chain.

**Q5 — Is the model portable across repositories?**
YES. S1–S4 signals are defined for 6+ framework types (NestJS, Spring, Django, Go, Rust, generic). S5 is constrained to observable facts. No BlueEdge artifact is referenced in any specification. The model replaces the non-portable session-comment signal (SIGNAL-01 in BlueEdge) with the S2+S5 pathway, and the missing IIM artifact (SIGNAL-13) with governed S5 derivation with explicit reasoning traces.

---

## Governing Conclusion

**PORTABLE_TRUTH_MODEL_DEFINED**

The Semantic Signal Model (S1–S5, GLC-1..5, GLD-1..4, EC-1/EC-2, V-COMP/V-STRUCT/V-EVID/V-SIG/V-LAYER) provides a complete, evidence-constrained, auditable specification for reproducible semantic construction on any software repository. All BlueEdge-specific non-portable signals have been replaced with portable, derivable equivalents. The model is compatible with the existing 40.x structural layer and 41.x semantic artifact formats.
