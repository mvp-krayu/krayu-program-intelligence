# Enrichment Participation Advisory — Implementation

Stream: PI.PSEE-PIOS.ENRICHMENT-PARTICIPATION-ADVISORY.IMPLEMENTATION.01  
Status: COMPLETE  
Generated: 2026-05-06  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Modifies binding/binding_envelope.json: NO  
  Modifies binding/psee_binding_envelope.json: NO  
  Creates new script in psee_handoff/: YES — additive  
  Advances Lane D target: YES — advisory observability operational

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.ENRICHED-CONDITION-PARTICIPATION.DESIGN.01/ENRICHED_CONDITION_PARTICIPATION.md`
- `docs/psee/PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01/PSEE_CONDITION_ACTIVATION_GATE.md`
- `docs/psee/PI.PSEE-PIOS.PSEE-GATE-EVALUATOR.IMPLEMENTATION.01/PSEE_GATE_EVALUATOR_IMPLEMENTATION.md`
- `docs/governance/psee_enrichment_schema.json`
- `docs/governance/signal_namespace_alias_registry.json`
- `artifacts/psee_gate/fastapi/run_02_oss_fastapi_pipeline/gate_evaluation.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/psee_binding_envelope.json`

---

## 1. Advisories Are Observational Only — Mandatory Statement

**Advisories are observational only.**

The participation advisory evaluator has **zero activation authority**. It reads PSEE enrichment artifacts and gate evaluation records; it emits advisory records describing what enrichment participation conditions exist, what is missing, and what would be needed for higher participation modes. It does NOT:

- Alter thresholds — `THRESHOLD = 2.0` in 75.x is unchanged
- Alter projections — no 41.x artifact is read or written
- Authorize enriched PSIG derivation — no PSIG signal values are computed or emitted
- Trigger any pipeline phase
- Enable enriched condition participation
- Change any 75.x or 41.x script behavior
- Modify `binding_envelope.json` or `psee_binding_envelope.json`

Advisories exist **solely for participation observability**. An advisory emitted by this evaluator means: "this enrichment condition exists and is visible." It does not mean: "this condition has caused any activation change."

**Advisory ≠ activation authority. 75.x retains final activation ownership.**

---

## 2. What This Implementation Does

This implementation creates:

1. **`scripts/pios/psee_handoff/evaluate_enrichment_participation.py`** — Passive advisory evaluator (stdlib only). Reads gate_evaluation.json and psee_binding_envelope.json; evaluates four advisory types (ADV-01..ADV-04); emits participation_advisory.json.

2. **`artifacts/psee_advisory/<client>/<run_id>/participation_advisory.json`** — Local-only output artifact. Not committed. Records participation mode, activation state, advisory type/state/reason, enrichment inputs present/missing, degradation state, and zero-impact guarantee.

3. **This document** — Implementation governance record.

No existing script, artifact, or signal computation was modified.

---

## 3. Advisory Types Implemented

Four advisory types are implemented per the ENRICHED_CONDITION_PARTICIPATION design:

### ADV-01: suppression_advisory

**Trigger conditions:**
- `selector_context.suppression_flags` is non-empty (explicit suppression candidates listed)
- `psee_context.grounding_ratio` < 0.7 (below advisory threshold — high-signal candidates may have insufficient grounding)

**For run_02_oss_fastapi_pipeline:** NOT emitted — suppression_flags=[], grounding_ratio=0.9 (above 0.7)

### ADV-02: escalation_advisory

**Trigger conditions:**
- `ceu_topology.cluster_count` > 10 AND `structural_overlap.edge_count` > 0 (cross-cluster coupling present in high-density topology)

**For run_02_oss_fastapi_pipeline:** NOT emitted — cluster_count=19 (>10 ✓) but structural_overlap.edge_count=0 (placeholder; OVERLAP_STRUCTURAL derivation not yet implemented)

### ADV-03: confidence_downgrade

**Trigger conditions:**
- HARD_DOWNGRADE: `grounding_ratio` < 0.5 — PSEE enrichment quality below nominal
- CONTEXT_INCOMPLETE: `evidence_state.evidence_confidence` is null — partial confidence context

**For run_02_oss_fastapi_pipeline:** EMITTED — ADV-001 (CONTEXT_INCOMPLETE) — grounding_ratio=0.9 (nominal; NOT hard downgrade), evidence_confidence=null

### ADV-04: evidence_insufficiency

**Trigger conditions:**
- `evidence_state.evidence_confidence` is null (required for MODE-03+)
- `structural_overlap.edge_count` = 0 placeholder when cluster_count > 10 (prevents MODE-04 structural trigger)
- `selector_context.selector_confidence` is null (required for MODE-05)

**For run_02_oss_fastapi_pipeline:** EMITTED — ADV-002 (PENDING_DERIVATION) — all three conditions met

Each advisory contains:
- `advisory_id` (e.g., ADV-001)
- `advisory_type` (suppression_advisory / escalation_advisory / confidence_downgrade / evidence_insufficiency)
- `advisory_state` (ACTIVE / CONTEXT_INCOMPLETE / HARD_DOWNGRADE / PENDING_DERIVATION)
- `advisory_reason` (full text reason)
- `enrichment_inputs_used` (array of field paths — satisfies OBS-02)
- `emitted_at` (ISO timestamp)
- `note` (governance clarification)

---

## 4. Verified Execution — Productized Baseline Run

**Run:** `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline`  
**Output:** `artifacts/psee_advisory/fastapi/run_02_oss_fastapi_pipeline/participation_advisory.json`

### Key Output Fields

| Field | Value |
|-------|-------|
| advisory_mode | ADVISORY_ONLY_MODE |
| participation_mode | OBSERVATIONAL_ONLY |
| activation_state | ENRICHMENT_READY |
| bp_01_status | NOT_RESOLVED |
| bp_02_status | RESOLVED |
| activation_authorized | false |
| enriched_participation | NOT_ACTIVE |
| degradation_state | CONTEXT_INCOMPLETE |
| advisory_count | 2 |
| runtime_impact | NONE |

### Advisories Emitted

| ID | Type | State | Enrichment Input |
|----|------|-------|----------------|
| ADV-001 | confidence_downgrade | CONTEXT_INCOMPLETE | evidence_state.evidence_confidence (null) |
| ADV-002 | evidence_insufficiency | PENDING_DERIVATION | evidence_state.evidence_confidence, structural_overlap.edge_count, selector_context.selector_confidence |

### Enrichment Inputs Present/Missing

**Present:** psee_context, psee_context.grounding_ratio, ceu_topology, structural_overlap, selector_context, evidence_state

**Missing (null/uncomputed):** selector_context.selector_confidence, evidence_state.evidence_confidence

### Observability Status

All five OBS requirements confirmed operational:

| OBS | Requirement | Status |
|-----|------------|--------|
| OBS-01 | Participation reason log | PASS — advisory_reason present in all advisories |
| OBS-02 | Enrichment source trace | PASS — enrichment_inputs_used present in all advisories |
| OBS-03 | Degradation logged | PASS — degradation_state=CONTEXT_INCOMPLETE; obs_03_degradation_logged=true |
| OBS-04 | Activation state visible | PASS — activation_state present in all output records |
| OBS-05 | Advisory artifact written | PASS — participation_advisory.json produced |

---

## 5. Participation Mode — OBSERVATIONAL_ONLY

This implementation operates exclusively in **OBSERVATIONAL_ONLY** mode. This is the correct mode for the current run state:

- `activation_authorized = false` — no governance authorization issued
- `bp_01_resolved = false` — BP-01 not resolved
- Sidecar absent — G-09 FAIL

OBSERVATIONAL_ONLY means:
- Read PSEE artifacts: YES
- Emit advisory records: YES (for observability purposes only)
- Influence 75.x activation: NO
- Emit CONTEXTUAL_WEIGHTING records: NO (this implementation)
- Emit SUPPRESSION_ADVISORY or ESCALATION_ADVISORY with enforcement: NO — never

The `enriched_participation: NOT_ACTIVE` field in the output artifact explicitly records that enriched participation has not occurred.

---

## 6. ADVISORY_ONLY_MODE Logging

The `advisory_mode: "ADVISORY_ONLY_MODE"` field is present in every output artifact produced by this evaluator. This explicitly declares that:

- All advisories emitted are observational only
- No advisory has activation authority
- The evaluator has not triggered any enriched participation
- The evaluator has not modified any runtime artifact

This field satisfies the ADVISORY_ONLY_MODE logging requirement (Task 4).

---

## 7. Zero Runtime Impact — Proof

| Action | Status |
|--------|--------|
| Modify `binding/binding_envelope.json` | NOT DONE |
| Modify `binding/psee_binding_envelope.json` | NOT DONE — read only |
| Modify `artifacts/psee_gate/.../gate_evaluation.json` | NOT DONE — read only |
| Modify `compute_condition_correlation.py` | NOT DONE |
| Modify `compute_pressure_candidates.py` | NOT DONE |
| Modify `compute_pressure_zones.py` | NOT DONE |
| Modify `compute_signal_projection.py` | NOT DONE |
| Modify `run_client_pipeline.py` | NOT DONE |
| Modify any 75.x script | NOT DONE |
| Modify any 41.x script | NOT DONE |
| Modify any report generation | NOT DONE |
| Modify `signal_registry.json` | NOT DONE |
| Execute any pipeline phase | NOT DONE |
| Recompute any signal | NOT DONE |
| Alter `THRESHOLD = 2.0` | NOT DONE — threshold is locked in 75.x |
| Trigger enriched condition activation | NOT DONE — zero authority |

`git diff --name-only` at completion: empty (no tracked runtime files modified)

`zero_impact_guarantee` block in output artifact: all eight fields `false`

---

## 8. Script Design

**Path:** `scripts/pios/psee_handoff/evaluate_enrichment_participation.py`

**Dependencies:** stdlib only (`sys`, `json`, `datetime`, `pathlib`). No `psee_json` dependency.

**Input:** `--run-dir <path>` pointing to a PSEE run directory

**Sources read (all optional):**
- `artifacts/psee_gate/<client>/<run_id>/gate_evaluation.json` (gate evaluation — recommended prerequisite)
- `binding/psee_binding_envelope.json` (enrichment context)

**Output:** `artifacts/psee_advisory/<client>/<run_id>/participation_advisory.json`

**Key constants:**
```python
GROUNDING_ADVISORY_THRESHOLD = 0.7   # ADV-01: suppression advisory threshold
GROUNDING_HARD_THRESHOLD = 0.5       # ADV-03: hard downgrade threshold
CLUSTER_ESCALATION_THRESHOLD = 10    # ADV-02: escalation candidate threshold
PARTICIPATION_MODE = "OBSERVATIONAL_ONLY"
ADVISORY_MODE = "ADVISORY_ONLY_MODE"
```

**Authority fields in output:**
```json
"advisory_mode": "ADVISORY_ONLY_MODE",
"evaluator_authority": "OBSERVATIONAL_ONLY",
"runtime_impact": "NONE",
"enriched_participation": "NOT_ACTIVE"
```

---

## 9. What This Implementation Does NOT Do

- Does NOT authorize enriched PSIG derivation
- Does NOT enable CONTEXTUAL_WEIGHTING, SUPPRESSION_ADVISORY, ESCALATION_ADVISORY, or ENRICHED_PARTICIPATION modes
- Does NOT alter `THRESHOLD = 2.0` or any 75.x formula constant
- Does NOT read condition_correlation_state.json (75.x output) — this evaluator is upstream of 75.x outputs
- Does NOT write to any 41.x input or output
- Does NOT modify gate_evaluation.json
- Does NOT change `activation_state` — it reports what gate_evaluation.json already recorded
- Does NOT emit advisories that produce automatic effects if unread — advisories are records, not triggers

---

## 10. Relationship to Gate Evaluator

The participation advisory evaluator is a companion to the gate evaluator. Their roles are distinct:

| Evaluator | Input | Output | Determines |
|-----------|-------|--------|-----------|
| evaluate_psee_gate.py | PSEE source artifacts | gate_evaluation.json | activation_state (ENRICHMENT_BLOCKED / ENRICHMENT_READY / ENRICHMENT_ACTIVE) |
| evaluate_enrichment_participation.py | gate_evaluation.json + psee_binding_envelope.json | participation_advisory.json | advisory conditions, enrichment input completeness, degradation state |

The participation advisory evaluator READS gate_evaluation.json as an input. It does not regenerate gate results. It augments the gate output with advisory-level detail about enrichment input completeness and conditions that would need to change for higher participation modes.

---

## 11. Safe Next Step

**Contract:** PI.PSEE-PIOS.ENRICHED-PSIG-DERIVATION-PRECONDITIONS.REVIEW.01

**Why:** Advisory observability is now operational (all 5 OBS requirements satisfied). The next step is a formal preconditions review — specifically, confirming which of the 6 preconditions (PRE-01..PRE-06 from ENRICHED_CONDITION_PARTICIPATION.md) are met, which are not, and what governance actions are required before any enriched PSIG derivation can proceed.

**Current precondition state:**
- PRE-01 (BP-01 resolved): NOT MET — psig_computation.json not issued
- PRE-02 (BP-02 resolved): MET — cluster_count=19 for run_02
- PRE-03 (participation stability): NOT MET — advisory observability just established; stability validation pending
- PRE-04 (observability operational): PARTIALLY MET — all 5 OBS requirements satisfied for one run; multi-run validation pending
- PRE-05 (degradation validated): NOT MET — adversarial testing not yet performed
- PRE-06 (explicit governance authorization): NOT MET — activation_authorized=false

No enriched PSIG derivation is authorized until all 6 preconditions are met.

---

## 12. Validation

PASS criteria:

- [x] Script created: `scripts/pios/psee_handoff/evaluate_enrichment_participation.py` — new file, no existing script modified
- [x] All four advisory types implemented (ADV-01..ADV-04) with required fields
- [x] Each advisory contains: advisory_id, advisory_type, advisory_state, advisory_reason, enrichment_inputs_used[], emitted_at
- [x] advisory_mode = ADVISORY_ONLY_MODE — confirmed in output
- [x] participation_mode = OBSERVATIONAL_ONLY — confirmed in output
- [x] activation_state = ENRICHMENT_READY — confirmed in output (from gate_evaluation.json)
- [x] enriched_participation = NOT_ACTIVE — confirmed in output
- [x] runtime_impact = NONE — confirmed in output
- [x] advisory_count = 2 — ADV-001 (confidence_downgrade, CONTEXT_INCOMPLETE) + ADV-002 (evidence_insufficiency, PENDING_DERIVATION)
- [x] enrichment_inputs_present lists 6 confirmed inputs
- [x] enrichment_inputs_missing lists 2 null/uncomputed fields
- [x] degradation_state = CONTEXT_INCOMPLETE — confirmed in output
- [x] OBS-01 satisfied — advisory_reason present in all advisories
- [x] OBS-02 satisfied — enrichment_inputs_used present in all advisories
- [x] OBS-03 satisfied — degradation logged (obs_03_degradation_logged=true)
- [x] OBS-04 satisfied — activation_state visible
- [x] OBS-05 satisfied — advisory artifact written
- [x] zero_impact_guarantee: all 8 fields false — confirmed
- [x] git diff --name-only empty — zero tracked runtime files modified
- [x] 75.x scripts unmodified
- [x] 41.x scripts unmodified
- [x] binding_envelope.json unmodified
- [x] psee_binding_envelope.json unmodified
- [x] Advisories do not alter activation behavior — confirmed (no 75.x coupling)
- [x] Advisories do not modify thresholds — confirmed (THRESHOLD=2.0 untouched)
- [x] Advisories do not affect 41.x projection — confirmed (no 41.x reads or writes)
- [x] Advisories do not implicitly activate enrichment — confirmed (enriched_participation=NOT_ACTIVE)

FAIL conditions check:

- Advisories alter activation behavior? NO — evaluator has no 75.x coupling
- Advisories modify thresholds? NO — THRESHOLD=2.0 locked in 75.x; evaluator never reads it
- Advisories affect 41.x projection? NO — evaluator does not read or write 41.x artifacts
- Advisories implicitly activate enrichment? NO — enriched_participation=NOT_ACTIVE; advisory_mode=ADVISORY_ONLY_MODE
- runtime_impact ≠ NONE? NO — runtime_impact=NONE confirmed

Status: PASS
