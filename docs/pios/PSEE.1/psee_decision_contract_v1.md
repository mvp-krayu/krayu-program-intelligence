# PSEE.1 — PSEE Decision Contract v1

**Stream:** PSEE.1
**Family:** PSEE
**Contract version:** 1.0
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document is the canonical operator-facing decision contract for PSEE execution. It defines what an operator must provide, what PSEE will produce, what conditions force STOP or ESCALATE, and what guarantees PSEE makes about its outputs. PSEE.2 implements this contract; operators invoke against it.

**Value:** A decision contract is distinct from a rule catalog and an execution spec. The rule catalog defines what rules exist. The execution spec defines how to run them. The decision contract defines the interface: inputs → guarantees → outputs → exceptions. PSEE.2 must satisfy this contract; any PSEE.2 implementation that does not is non-compliant.

---

#### METHODOLOGY LAYER

This contract is structured as:
1. Pre-conditions (what the operator must provide)
2. Execution guarantees (what PSEE unconditionally produces or does)
3. Output contract (what artifacts PSEE produces on successful execution)
4. Exception contract (what PSEE does when inputs are incomplete or execution fails)
5. Post-conditions (what the operator may rely on after PSEE completes)
6. Invariants (what never changes across any PSEE execution)

---

#### TECHNICAL LAYER

---

### Section 1 — Pre-Conditions (Operator Obligations)

The operator MUST provide the following before PSEE execution begins. Failure to provide any mandatory item results in STOP-01 (SOURCE_RESOLUTION_FAIL).

| Pre-condition | Mandatory | Specification |
|---|---|---|
| **PC-01** Source corpus root | YES | Accessible directory containing all Phase A evidence files |
| **PC-02** Evidence boundary document | YES (or create) | Document declaring at minimum: primary_evidence_origin_paths, provenance_only_paths, explicitly_excluded_paths (may be empty list), accepted_evidence_classes |
| **PC-03** Phase B target declaration | YES | List of artifact names and their required sections (equivalent to 40.2 in BlueEdge instantiation) |
| **PC-04** System identity reference | YES | Version or identifier confirming Phase A corpus and Phase B target refer to the same system |
| **PC-05** Operator contact for escalations | YES | A defined resolution path for ESCALATE conditions (human operator or automated review gate) |

If PC-02 is absent, operator may create the boundary document before re-submitting. H-11 (source snapshot intake record) is an ADMISSIBLE_REFERENCE for constructing PC-02. See source_variance_handling.md SV-01.

---

### Section 2 — Execution Guarantees (PSEE Unconditional Behaviors)

PSEE guarantees the following behaviors in every execution, regardless of corpus structure:

| Guarantee | Specification |
|---|---|
| **G-01** No inference from absence | PSEE will never produce a canonical record based on absence of evidence. All records are traceable to observed Phase A facts. |
| **G-02** Unknown-space preservation | Every position where information is absent but theoretically inferrable MUST receive a US record. US records are never omitted, resolved by inference, or resolved by heuristic confidence. |
| **G-03** Exclusion compliance | No file in explicitly_excluded_paths will be accessed, read, or classified. Compliance is recorded per file. |
| **G-04** Canonical path usage | After Phase 1, all records use canonical paths only (inner path after packaging boundary collapse). Pre-normalization paths do not appear in Phase B output. |
| **G-05** Intake status completeness | Every file in the corpus has exactly one intake_status assigned. No file is left without a status assignment. |
| **G-06** CEU identifier stability | CEU-NN identifiers are assigned in priority-tier order (FX-05) and are stable across all output artifacts. The same CEU is referenced by the same ID in ESI, NEM, ECM, and IVL. |
| **G-07** OVL record for every detected overlap | Every structurally similar CEU pair observed receives an OVL record. No overlap is silently merged or silently ignored. |
| **G-08** Coverage reporting | PSEE reports coverage percentage in Phase 5. If coverage < 90%, a PARTIAL flag is emitted with specific unmapped units identified. |
| **G-09** Reconstruction comparison | Phase 6 compares the simulated output against each declared Phase B artifact. The comparison result (EQUIVALENT / PARTIAL / DIVERGENT) is recorded per artifact. |
| **G-10** Execution log completeness | Every STOP and ESCALATE condition produces a structured log entry in PSEEContext.escalation_log. No exception is silent. |

---

### Section 3 — Output Contract (Artifacts Produced on COMPLETE)

On reaching state S-13 (COMPLETE), PSEE produces:

| Output | Description | Schema authority |
|---|---|---|
| **O-01** evidence_surface_inventory | EvidenceDomain records with SubTable and FileRow entities | psee_v0_schema.json output_artifacts.evidence_surface_inventory |
| **O-02** normalized_evidence_map | CEU, CEUSubUnit, OVL, US records with priority hierarchy and summary | psee_v0_schema.json output_artifacts.normalized_evidence_map |
| **O-03** evidence_classification_map | ClassificationRecord per file/pattern with basis table | psee_v0_schema.json output_artifacts.evidence_classification_map |
| **O-04** intake_validation_log | 8 ValidationCheck records (or equivalent for non-PiOS targets) covering: existence, mapping, exclusion-compliance, type-compliance, assumption-compliance, completeness, inference-guard | psee_v0_schema.json output_artifacts.intake_validation_log |
| **O-05** context_validation | Phase A ↔ Phase B identity confirmation (system name, version, corpus root) | psee_v0_execution_spec.md Phase 0 output |
| **O-06** source_normalization_log | PathNormalizationRecord for each detected duplication | psee_v0_execution_spec.md Phase 1 output |
| **O-07** reconstruction_validation_report | Comparison result per Phase B artifact; rule-to-output traceability table | psee_v0_execution_spec.md Phase 6 output |
| **O-08** PSEEContext (execution state) | Complete execution context including coverage, flags, escalation_log | decision_state_model.md context object |

PARTIAL outputs (S-T3):
- Same artifact set as COMPLETE
- All artifacts carry flag: "PSEE_STATUS: PARTIAL — coverage = N%; unmapped units: [...]"
- Downstream consumers must check for PARTIAL flag before relying on completeness assertions

STOPPED outputs (S-T1):
- PSEEContext is written with escalation_log only
- No O-01 through O-07 artifacts are produced
- Operator receives STOP condition details only

---

### Section 4 — Exception Contract (Behavior on Non-COMPLETE Outcomes)

| Condition | Trigger | PSEE behavior | Operator requirement |
|---|---|---|---|
| SOURCE_RESOLUTION_FAIL | DP-0-01..04 | STOP-01: write escalation_log; produce no Phase B artifacts | Correct pre-condition; restart |
| UNCLASSIFIABLE_DUPLICATION | DP-1-05 | ESC-02: suspend Phase 1 for affected path; log escalation; await resolution | Provide classification; resume |
| ARCHITECTURAL_STRUCTURE_PATH | DP-1-04 | ESC-01: suspend Phase 1 for affected path; log escalation; continue other paths | Confirm dual-path; resume |
| GRAY_ZONE_SCOPE | DP-2-01 | ESC-03: suspend Phase 2; log escalation; await scope declaration | Provide exclusion declaration; resume |
| UNCLAIMED_PATH | DP-3-01 | ESC-04: suspend Phase 3 at gate; log escalation; await operator decision | Assign or remove path; resume |
| AMBIGUOUS_FILE_TYPE | DP-5-01 | ESC-05: suspend Phase 5 classification; log escalation; await type assignment | Provide evidence_class; resume |
| COVERAGE_BELOW_THRESHOLD | DP-5-02 | S-T3: flag unmapped units; produce PARTIAL artifacts; continue | Acknowledge PARTIAL; decide on downstream use |
| RECONSTRUCTION_DIVERGENT (1st) | DP-6-01 iter 1 | ESC-06: re-enter from S-02; log divergent units | Investigate divergence |
| RECONSTRUCTION_DIVERGENT (2nd) | DP-6-01 iter 2 | STOP-02: terminate stream; log reason | Rule catalog extension required before restart |

---

### Section 5 — Post-Conditions (Operator Guarantees After COMPLETE)

On COMPLETE (S-13), the operator may rely on:

| Post-condition | Guarantee | Basis |
|---|---|---|
| **PC-01** All evidence paths accounted for | Every path in primary_evidence_origin_paths has a domain record in O-01 | DP-3-01 completion gate |
| **PC-02** All exclusions verified | Every path in explicitly_excluded_paths has a NOT ACCESSED record in O-04 Check 4 | G-03; R-FLT-03 |
| **PC-03** Overlap pairs declared | Every structurally similar CEU pair has an OVL record | G-07 |
| **PC-04** Unknown positions preserved | Every unresolvable position has a US record; no US position was inferred away | G-02; R-NRM-03 |
| **PC-05** CEU identifiers stable | CEU-NN identifiers are consistent across all output artifacts | G-06 |
| **PC-06** Coverage ≥ 90% | If S-13, coverage threshold was met. If PARTIAL, coverage is explicitly declared. | G-08 |
| **PC-07** No baseline mutation | Phase A source corpus files are unchanged; no write operations targeted Phase A files | G-01 (by extension); PSEE.0 execution model |
| **PC-08** Reconstruction passed or flagged | O-07 declares EQUIVALENT or PARTIAL (not DIVERGENT) for all Phase B artifacts | DP-6-01 |

---

### Section 6 — Invariants (Constant Across All PSEE Executions)

These properties hold regardless of corpus structure, archive count, framework choice, or operator-specific configuration:

| Invariant | Statement |
|---|---|
| **INV-01** Evidence-first | No output record exists without an observed Phase A source. |
| **INV-02** Unknown-space supremacy | Absence of evidence → US record. Never → inference. |
| **INV-03** Canonical path usage | All post-normalization references use inner canonical paths. |
| **INV-04** Single intake_status per file | No file has more than one intake_status. |
| **INV-05** Stable CEU identifiers | CEU-NN does not change between phases. |
| **INV-06** No heuristic substitution for evidence | ADMISSIBLE_REFERENCE heuristics may inform; they do not fill canonical records. |
| **INV-07** Exception logging | Every STOP and ESCALATE is logged. No silent failures. |
| **INV-08** Baseline immutability | Phase A files are never written to during PSEE execution. |
| **INV-09** Coverage reported | Coverage percent is always computed and reported; never omitted. |
| **INV-10** No capability-domain intake | Intake organization is by evidence provenance, not system capability. |

---

### Section 7 — Contract Version and Extension Policy

```
contract_version: 1.0
canonical_source: PSEE.1/psee_decision_contract_v1.md
rule_source:      PSEE.0/rule_catalog_v0.md (v0)
schema_source:    PSEE.0/psee_v0_schema.json (v0.1.0)

Extension policy:
  - Minor extension (new SV or ESC condition): PSEE.1R stream (repair)
  - Rule catalog extension (new R-xx rule): new PSEE.0R or PSEE base stream
  - Schema extension: new psee_v1_schema.json; must not break v0 entity fields
  - Contract version increment: requires explicit PSEE stream or PSEE.1R

Non-extension:
  - Adding BlueEdge-specific behavior to this contract is a contract violation
  - Modifying PSEE.0 rules via this contract is a contract violation
  - Overriding INV-01 through INV-10 requires a new base PSEE stream

Downstream:
  PSEE.2 must implement this contract in full.
  Any PSEE.2 behavior not covered by this contract requires either:
  (a) a pre-existing rule in rule_catalog_v0.md that covers it, or
  (b) an escalation to the operator (ESCALATE)
  (c) a contract extension via PSEE.1R
```

---

#### EVIDENCE LAYER

| Contract element | Source |
|---|---|
| Pre-conditions | psee_v0_execution_spec.md Phase 0; source_variance_handling.md SV-01 |
| Guarantees G-01..G-10 | rule_catalog_v0.md (R-NRM-03 → G-01/02); psee_v0_execution_spec.md (phases 1–6) |
| Output contract O-01..O-08 | psee_v0_schema.json output_artifacts; psee_v0_execution_spec.md entity population sequence |
| Exception contract | escalation_and_fallback_spec.md STOP/ESCALATE conditions |
| Post-conditions | decision_points_catalog.md DP-3-01, DP-6-01; G-xx guarantees |
| Invariants INV-01..10 | determinism_boundary.md FX/CT/FB; doctrine_genealogy.md TRANSITION A/B/C |

---

#### LIMITATIONS & BOUNDARIES

- This contract is for the PSEE engine at the Phase A → 40.2 equivalent intake layer. It does not govern PSEE behavior at 40.3 or 40.4 equivalent layers.
- The 8 ValidationCheck structure (O-04) is derived from the BlueEdge 40.2 instantiation. Non-PiOS targets may require a different check set; the check types (existence, mapping, exclusion-compliance, type-compliance, assumption-compliance, completeness, inference-guard) are generalizable; the specific check content is engagement-specific.
- INV-10 (no capability-domain intake) applies only to the intake layer. 40.3 equivalent structural reconstruction and 41.x equivalent semantic layers may legitimately use capability-domain organization. PSEE.1 governs 40.2 equivalent only.

---

#### STATUS

| Check | Result |
|---|---|
| Pre-conditions defined | 5 (PC-01..05) |
| Execution guarantees defined | 10 (G-01..G-10) |
| Output contract defined | 8 artifacts (O-01..O-08) |
| Exception contract complete | 9 conditions |
| Post-conditions defined | 8 (PC-01..08) |
| Invariants defined | 10 (INV-01..10) |
| No canonical mutation | CONFIRMED |

**PSEE DECISION CONTRACT v1: COMPLETE**
