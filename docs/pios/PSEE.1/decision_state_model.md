# PSEE.1 — Decision State Model

**Stream:** PSEE.1
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document defines the state machine governing PSEE execution. Each state represents a stable execution position. Transitions are guarded by decision points from the decision_points_catalog.md. Terminal states (COMPLETE, STOPPED, ESCALATED) are explicitly enumerated with their entry conditions. This model is the structural backbone for PSEE.2 implementation.

**Value:** A named state machine converts the 26 decision points into an implementable control flow. PSEE.2 executes against this model, not against narrative procedure descriptions.

---

#### METHODOLOGY LAYER

1. Define all execution states.
2. Define all transitions between states, with their guard conditions (citing DP-xx identifiers).
3. Define entry/exit conditions for terminal states.
4. Define the context object (data carried across state transitions).
5. Define state invariants — what must be true while in each state.

---

#### TECHNICAL LAYER

---

### State Definitions

| State ID | Name | Description |
|---|---|---|
| S-00 | UNBOUND | Initial state. No corpus, no boundary, no phase B target confirmed. |
| S-01 | BOUND | Source corpus root, evidence boundary, and phase B target all confirmed present. Identity match confirmed. |
| S-02 | NORMALIZING | Path normalization in progress (R-NRM-01). |
| S-03 | NORMALIZED | All paths classified and collapsed or preserved. Canonical paths established. |
| S-04 | FILTERING | Intake status assignment in progress (R-FLT-01/02/03). |
| S-05 | FILTERED | All files assigned intake status. Exclusion compliance record populated. |
| S-06 | GROUPING | Domain formation in progress (R-GRP-01/02/03). |
| S-07 | GROUPED | All primary evidence paths assigned to exactly one domain. Sub-grouping and platform separation complete. |
| S-08 | ABSTRACTING | CEU formation and overlap detection in progress (R-ABS-01/02, R-NRM-02/03). |
| S-09 | ABSTRACTED | All CEUs formed. OVL and US records declared. CEU sub-units assigned. |
| S-10 | CLASSIFYING | Evidence classification and validation check production in progress (Phase 5). |
| S-11 | CLASSIFIED | ECM and IVL artifacts populated. Coverage gate computed. |
| S-12 | SIMULATING | Reconstruction simulation in progress (Phase 6). |
| S-13 | COMPLETE | All phases passed. All artifacts produced. Coverage ≥ 90%. Reconstruction EQUIVALENT or PARTIAL. |
| S-T1 | STOPPED | Terminal failure. Stream halted. Operator resolution required. |
| S-T2 | ESCALATED | Execution suspended at a specific decision point. Operator input required to resume. |
| S-T3 | PARTIAL | Coverage < 90% or reconstruction PARTIAL. Stream proceeds with documented flags; outputs are advisory only until gaps resolved. |

---

### Transitions

```
S-00 → S-01
  Guard:     DP-0-01 PASS AND DP-0-02 PASS AND DP-0-03 PASS AND DP-0-04 PASS
  On fail:   S-00 → S-T1 (SOURCE_RESOLUTION_FAIL)
  On DP-0-02 false + operator creates boundary:  S-00 → S-00 (loop: retry after creation)

S-01 → S-02
  Guard:     S-01 entry (automatic)
  Action:    Scan all paths for repeated segment patterns (DP-1-01)

S-02 → S-03
  Guard:     All duplications classified (DP-1-02) AND all classified as
             PACKAGING_BOUNDARY or EXTRACTION_ARTIFACT (DP-1-03)
  On ARCHITECTURAL_STRUCTURE: S-02 → S-T2 (ESCALATED: document and preserve both paths;
                              operator must confirm dual-path before S-02 → S-03)
  On UNCLASSIFIABLE:          S-02 → S-T2 (ESCALATED: halt dependent path;
                              operator must classify before S-02 → S-03 for that path)
  Note:      Both ESCALATED branches can resume to S-03 after operator resolution.
             Multiple paths may be processed in parallel; path-level escalation does not
             block other paths.

S-03 → S-04
  Guard:     S-03 entry (automatic, filtering applied to all canonical paths)
  Pre-check: DP-2-01 (exclusion list present)
  On DP-2-01 false:  S-03 → S-T2 (ESCALATED: GRAY-ZONE; request scope statement)

S-04 → S-05
  Guard:     All files processed through DP-2-02 → DP-2-03 → DP-2-04 filter cascade
  Output:    Each file has exactly one intake_status assigned

S-05 → S-06
  Guard:     S-05 entry (automatic)
  Action:    Group ACCEPTED and ACCEPTED-SUPPORT-ONLY files into domains (R-GRP-01)

S-06 → S-07
  Guard:     DP-3-01 PASS (all primary_evidence_origin_paths assigned to exactly one domain)
  On DP-3-01 false:  S-06 → S-T2 (ESCALATED: unclaimed path; operator investigation required)
  Sub-actions within S-06 (do not block S-06→S-07):
    DP-3-02: if domain > 50 files → apply sub-grouping (R-GRP-02)
    DP-3-03: if repeated patterns detected → apply pattern rows (R-ABS-02)
    DP-3-04: if platform domain present → apply R-GRP-03 separation
    DP-3-05: if domain files span multiple classes → record union

S-07 → S-08
  Guard:     S-07 entry (automatic)
  Action:    Create CEU for each domain; detect overlaps; declare unknown-space

S-08 → S-09
  Guard:     All domains have CEU records AND all structurally-similar CEU pairs have
             OVL records AND all unresolved positions have US records (DP-4-03)
  Sub-actions within S-08 (mandatory before exit):
    DP-4-01: domains with ≥3 sub-groups get CEUSubUnit records
    DP-4-02: overlapping CEU pairs get OVL records (with known or unknown parity)
    DP-4-03: all unresolved positions get US records (R-NRM-03 — no exceptions)

S-09 → S-10
  Guard:     S-09 entry (automatic)
  Action:    Assign evidence_class / evidence_subclass / priority for each CEU and sub-unit

S-10 → S-11
  Guard:     All ClassificationRecord entries populated with valid priority enum value (DP-S-02)
  On unlisted file type (DP-5-01 false-path):
    If content role unambiguous → assign by content role; continue
    If content role ambiguous → S-10 → S-T2 (ESCALATED: operator classification required)
  On DP-5-02:
    Coverage ≥ 90% → S-11 (proceed to simulation)
    Coverage < 90% → S-T3 (PARTIAL: flag unmapped units; proceed with PARTIAL flag)

S-11 → S-12
  Guard:     S-11 entry (automatic for ≥90% coverage) or PARTIAL flag set

S-12 → S-13
  Guard:     DP-6-01 all artifacts = EQUIVALENT or PARTIAL
  On DP-6-01 DIVERGENT:
    Iteration 1: S-12 → S-02 (re-enter from normalization; investigate unmapped units)
    Iteration 2: S-12 → S-T2 (ESCALATED: second divergence requires operator rule refinement)

S-T3 → S-13
  Guard:     Operator acknowledges PARTIAL coverage; flags documented
  Note:      S-T3 is not a hard terminal; it is a soft advisory state. Outputs are
             produced and flagged as PARTIAL rather than withheld.
```

---

### Context Object (State-Carried Data)

The following data structure is carried across all states and populated progressively:

```
PSEEContext {
  corpus_root:              string            (bound at S-01)
  evidence_boundary:        object            (bound at S-01)
  phase_b_target:           string[]          (bound at S-01; list of required Phase B artifacts)
  system_identity:          object            (confirmed at S-01)
  normalization_records:    PathNormalizationRecord[]  (populated in S-02)
  canonical_paths:          string[]          (produced in S-03)
  filter_table:             {path: intake_status}[]    (produced in S-05)
  evidence_domains:         EvidenceDomain[]  (produced in S-07)
  ceu_index:                CanonicalEvidenceUnit[]    (produced in S-09)
  ovl_records:              OverlapDeclaration[]       (produced in S-09)
  us_records:               UnknownSpace[]             (produced in S-09)
  classification_map:       ClassificationRecord[]     (produced in S-11)
  validation_checks:        ValidationCheck[]          (produced in S-11)
  coverage_percent:         float             (computed in S-11)
  reconstruction_result:    {artifact: structural_match}[]  (produced in S-13)
  flags:                    string[]          (escalation and partial flags)
  escalation_log:           {dp_id: string, reason: string, state: string}[]
}
```

---

### State Invariants

| State | Invariant |
|---|---|
| S-01+ | corpus_root is accessible and unchanged for the duration of the stream |
| S-03+ | All path references use canonical_paths only; pre-normalization paths are forbidden |
| S-05+ | Every file has exactly one intake_status; no file has status PENDING |
| S-09+ | Every CEU has canonical_id, canonical_path, evidence_class, intake_status |
| S-09+ | No unresolved overlap exists without an OVL record |
| S-09+ | No inferrable unknown position exists without a US record (R-NRM-03 invariant) |
| S-T1 | No output artifacts are promoted from a STOPPED stream |
| S-T2 | Execution is suspended; no new entities are created until the escalation is resolved |

---

### State Model Diagram

```
S-00 (UNBOUND)
  │
  ├─ [DP-0-01..04 FAIL] ──────────────────────────► S-T1 (STOPPED)
  │
  ▼
S-01 (BOUND)
  │
  ▼
S-02 (NORMALIZING)
  │
  ├─ [ARCHITECTURAL_STRUCTURE / UNCLASSIFIABLE] ──► S-T2 (ESCALATED) ─► (resume) ──► S-03
  │
  ▼
S-03 (NORMALIZED)
  │
  ├─ [DP-2-01 false: no exclusion list] ──────────► S-T2 (ESCALATED) ─► (scope stmt) ► S-04
  │
  ▼
S-04 (FILTERING)
  │
  ▼
S-05 (FILTERED)
  │
  ▼
S-06 (GROUPING)
  │
  ├─ [DP-3-01 false: unclaimed path] ─────────────► S-T2 (ESCALATED) ─► (resolve) ──► S-07
  │
  ▼
S-07 (GROUPED)
  │
  ▼
S-08 (ABSTRACTING)
  │
  ▼
S-09 (ABSTRACTED)
  │
  ▼
S-10 (CLASSIFYING)
  │
  ├─ [DP-5-01: ambiguous file type] ──────────────► S-T2 (ESCALATED) ─► (classify) ──► S-11
  │
  ├─ [DP-5-02: coverage < 90%] ───────────────────► S-T3 (PARTIAL) ─────────────────► S-12
  │
  ▼
S-11 (CLASSIFIED)
  │
  ▼
S-12 (SIMULATING)
  │
  ├─ [DP-6-01 DIVERGENT, iter 1] ─────────────────► S-02 (re-enter)
  ├─ [DP-6-01 DIVERGENT, iter 2] ─────────────────► S-T2 (ESCALATED)
  │
  ▼
S-13 (COMPLETE)
```

---

#### EVIDENCE LAYER

| State / transition | Source |
|---|---|
| S-00 → S-01 guards | psee_v0_execution_spec.md Phase 0 checks P0-01..04 |
| S-02 escalation paths | psee_v0_execution_spec.md Phase 1 decision points |
| S-03 exclusion-list guard | psee_v0_execution_spec.md Phase 2 decision point §3 |
| S-06 completion guard | psee_v0_execution_spec.md Phase 3 completion gate |
| S-08 US record invariant | R-NRM-03; psee_v0_execution_spec.md Phase 4 Step 4.3 |
| S-10 coverage gate | psee_v0_execution_spec.md Phase 5 coverage gate; psee_v0_schema.json coverage_thresholds |
| S-12 re-run / escalate | psee_v0_execution_spec.md Phase 6 stop condition |
| Context object fields | psee_v0_schema.json entity_definitions |

---

#### LIMITATIONS & BOUNDARIES

- The context object is defined structurally, not as an implementation schema. PSEE.2 must select a serialization format; JSON (consistent with psee_v0_schema.json) is the natural choice.
- S-T2 (ESCALATED) is a suspension, not a termination. The model permits resumption from any escalation point after operator resolution. The specific resumption state is noted per escalation branch.
- S-T3 (PARTIAL) allows continuation with outputs flagged as advisory. The operator decides whether PARTIAL outputs are admissible for downstream use.

---

#### STATUS

| Check | Result |
|---|---|
| All states defined | 17 states (S-00 through S-T3) |
| All transitions guarded by DP-xx references | CONFIRMED |
| Terminal states and resumption paths defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**DECISION STATE MODEL: COMPLETE**
