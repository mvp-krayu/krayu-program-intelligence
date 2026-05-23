# PATH B Governance Lifecycle Contract

## Scope

Defines the 5-gate governance lifecycle for PATH B specimens (external archive, no live code analysis). Each gate specifies its input/output contract, materializer, operator decision boundary, and blocked semantics.

## Current Status

| Layer | Status |
|---|---|
| PATH A (code graph → structural derivation) | OPERATIONALIZED |
| PATH B (archive → evidence extraction) | GATEFUL BUT NOT FULLY ORCHESTRATED |
| FUSION (generic binding envelope) | GENERIC BINDING OPERATIONAL |
| PROJECTION (LENS consumption) | OPERATIONALLY PASSES — LENS CONSUMPTION VALIDATION PENDING |
| GOVERNANCE ADVANCEMENT | BLOCKED AT FIRST PATH B OPERATOR GATE |

## Gate Sequence

```
PIPELINE GENESIS (S0)
    │
    ▼
┌─────────────────────────────────────┐
│ GATE 1: CEU Reconciliation          │ ← OPERATOR GATE
│   candidates → review → CONFIRMED   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ GATE 2: SPE Proposition Derivation  │ ← DETERMINISTIC
│   reconciliation → propositions     │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ GATE 3: Proposition Review          │ ← OPERATOR GATE
│   propositions → accept/reject      │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ GATE 4: Revalidation                │ ← DETERMINISTIC
│   reviewed corpus → N-check replay  │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ GATE 5: Promotion                   │ ← OPERATOR GATE
│   revalidation PASS → S0→S1 / S1→S2│
└─────────────────────────────────────┘
```

---

## Gate 1: CEU Reconciliation

**Purpose:** Operator reviews structurally-derived CEU candidates and issues dispositions (CONFIRM / REJECT / MERGE).

### Input Artifacts

| Artifact | Path | Producer |
|---|---|---|
| candidate_registry.json | `ceu/candidate_registry.json` | `ceu_candidate_derivation.py` |
| evidence_anchors.json | `ceu/evidence_anchors.json` | `ceu_evidence_intake.py` |
| reconciliation_state.json | `ceu/reconciliation_state.json` | `ceu_reconciliation_seeder.py` |

### Materializer Chain (Deterministic)

```
ceu_candidate_derivation.py  →  candidate_registry.json
ceu_evidence_intake.py       →  evidence_anchors.json
ceu_reconciliation_seeder.py →  reconciliation_state.json (INITIALIZED)
```

All three are deterministic and registered in the pipeline materialization registry.

### Operator Decision (Non-Automatable)

| Action | Meaning |
|---|---|
| CONFIRM | Candidate accepted as valid CEU — proceeds to semantic derivation |
| REJECT | Candidate structurally invalid — excluded from semantic derivation |
| MERGE | Candidate merged into another — combined for derivation |

**Authority boundary:** L3 ceiling. AI cannot self-authorize candidate acceptance.

### CLI Action Mechanism

```
python3 scripts/pios/ceu_reconciliation_action.py \
    --client blueedge \
    --run-id run_blueedge_genesis_e2e_03 \
    --action confirm --target CEU-BACKEND \
    --operator operator:khorrix \
    --rationale "Backend domain structurally grounded — 372 files, import-dominant authority"
```

Actions: `confirm`, `reject`, `merge`, `complete` (finalizes reconciliation after all candidates resolved).

### Output Artifacts

| Artifact | Status Values |
|---|---|
| reconciliation_state.json | INITIALIZED → IN_REVIEW → COMPLETE |
| reconciliation_event_log.jsonl | Append-only operator action log |

### Chronicle Event

`governance_gate_reached`: gate=CEU_RECONCILIATION, status=OPERATOR_REQUIRED
`governance_action`: gate=CEU_RECONCILIATION, action=CONFIRM/REJECT/MERGE, target=CEU-*
`governance_gate_passed`: gate=CEU_RECONCILIATION, status=COMPLETE

### Blocked Semantics

SPE (Gate 2) checks `reconciliation_state.reconciliation_status == "COMPLETE"`. If not COMPLETE → `INPUT_GATE_BLOCKED: reconciliation not complete`.

---

## Gate 2: SPE Proposition Derivation

**Purpose:** Deterministic derivation of semantic propositions from confirmed CEU candidates, structural evidence, and code graph analysis.

### Input Artifacts

| Artifact | Path | Gate Requirement |
|---|---|---|
| reconciliation_state.json | `ceu/reconciliation_state.json` | `reconciliation_status == COMPLETE` |
| evidence_anchors.json | `ceu/evidence_anchors.json` | Must exist |
| candidate_registry.json | `ceu/candidate_registry.json` | Must exist |
| derivation_lineage.json | `ceu/derivation_lineage.json` | Must exist |
| structural_centrality.json | `structure/40.3c/structural_centrality.json` | Must exist |
| code_graph.json | `structure/40.3s/code_graph.json` | Must exist |
| canonical_topology.json | `structure/40.4/canonical_topology.json` | Must exist |
| spine_objects.json | `spine/spine_objects.json` | Must exist (may be empty seed) |

### Materializer (Deterministic)

```
python3 scripts/pios/semantic_proposition_engine.py \
    --client blueedge --run run_blueedge_genesis_e2e_03
```

No operator decision. Same inputs → same propositions.

### Output Artifacts

| Artifact | Path |
|---|---|
| spe_derivation_report.json | `semantic/spe/spe_derivation_report.json` |
| semantic_propositions.json | `semantic/spe/semantic_propositions.json` |
| review_queue.json | `semantic/spe/review_queue.json` |
| spine_objects.json | `spine/spine_objects.json` (updated with propositions) |

### Status Values

| Status | Meaning |
|---|---|
| NOT_RUN | SPE not yet executed |
| COMPLETE | Propositions derived, review queue emitted |
| INPUT_GATE_BLOCKED | Reconciliation not COMPLETE |
| DERIVATION_ERROR | SPE execution failed |

### Chronicle Event

`governance_gate_passed`: gate=SPE_DERIVATION, propositions_count=N, review_items=M

### Blocked Semantics

If reconciliation not COMPLETE → SPE refuses to run. Pipeline Phase 3c already enforces this gate.

---

## Gate 3: Proposition Review

**Purpose:** Operator reviews derived propositions and issues dispositions (ACCEPT / CONTEST / REJECT / ARBITRATE).

### Input Artifacts

| Artifact | Path | Gate Requirement |
|---|---|---|
| semantic_propositions.json | `semantic/spe/semantic_propositions.json` | Must exist |
| review_queue.json | `semantic/spe/review_queue.json` | Must exist |

### Operator Decision (Non-Automatable)

| Action | Meaning |
|---|---|
| ACCEPT | Proposition confirmed — proceeds to revalidation corpus |
| CONTEST | Proposition disputed — requires additional evidence or modification |
| REJECT | Proposition structurally invalid — excluded from corpus |
| ARBITRATE | Contested proposition resolved by higher authority |

**Authority boundary:** L3 ceiling. AI proposes, operator disposes.

### CLI Action Mechanism

```
python3 scripts/pios/proposition_review_action.py \
    --client blueedge \
    --run-id run_blueedge_genesis_e2e_03 \
    --action accept --target SP-blueedge-0001 \
    --operator operator:khorrix \
    --rationale "Domain-level proposition structurally grounded"

# Batch action for non-flagged propositions:
python3 scripts/pios/proposition_review_action.py \
    --client blueedge \
    --run-id run_blueedge_genesis_e2e_03 \
    --action accept-unflagged \
    --operator operator:khorrix
```

### Output Artifacts

| Artifact | Path |
|---|---|
| proposition_review_state.json | `semantic/spe/proposition_review_state.json` |
| proposition_review_event_log.jsonl | `semantic/spe/proposition_review_event_log.jsonl` |

### Status Values

| Status | Meaning |
|---|---|
| NOT_STARTED | No review actions taken |
| IN_REVIEW | Some propositions reviewed, not all resolved |
| COMPLETE | All propositions have dispositions |

### Chronicle Event

`governance_gate_reached`: gate=PROPOSITION_REVIEW, total=N, flagged=M
`governance_action`: gate=PROPOSITION_REVIEW, action=ACCEPT/REJECT/CONTEST, target=SP-*
`governance_gate_passed`: gate=PROPOSITION_REVIEW, accepted=A, rejected=R, contested=C

### Blocked Semantics

Revalidation (Gate 4) checks `proposition_review_state.status == "COMPLETE"`. If not COMPLETE → `INPUT_GATE_BLOCKED: proposition review not complete`.

---

## Gate 4: Revalidation

**Purpose:** Deterministic multi-phase validation of the reviewed corpus. Proves structural integrity, confidence realism, governance cleanliness, and SQO consistency.

### Input Artifacts

| Artifact | Path | Gate Requirement |
|---|---|---|
| proposition_review_state.json | `semantic/spe/proposition_review_state.json` | `status == COMPLETE` |
| semantic_propositions.json | `semantic/spe/semantic_propositions.json` | With review dispositions |
| spine_objects.json | `spine/spine_objects.json` | Updated after review |
| vault/* | `vault/*` | Vault readiness PASS |
| promotion_state.json | `sqo/promotion_state.json` | Must exist |

### Materializer (Deterministic)

```
python3 scripts/pios/revalidation_engine.py \
    --client blueedge --run-id run_blueedge_genesis_e2e_03
```

No operator decision. Same corpus → same validation result.

### Output Artifacts

| Artifact | Path |
|---|---|
| revalidation_result.json | `sqo/revalidation_result.json` |
| revalidation_event_log.jsonl | `sqo/revalidation_event_log.jsonl` |

### Status Values

| Status | Meaning |
|---|---|
| NOT_RUN | Revalidation not yet executed |
| PASS | All checks pass — eligible for promotion |
| PARTIAL | Some checks pass, threshold not met |
| FAIL | Critical checks failed — promotion blocked |
| INPUT_GATE_BLOCKED | Proposition review not COMPLETE |

### Chronicle Event

`governance_gate_passed`: gate=REVALIDATION, total_checks=N, passed=P, failed=F
or
`governance_gate_blocked`: gate=REVALIDATION, reason=FAIL, failed_checks=[...]

### Blocked Semantics

Promotion (Gate 5) checks `revalidation_result.status == "PASS"`. If not PASS → `INPUT_GATE_BLOCKED: revalidation not passed`.

---

## Gate 5: Promotion

**Purpose:** Operator authorizes S-level advancement based on revalidation evidence.

### Input Artifacts

| Artifact | Path | Gate Requirement |
|---|---|---|
| revalidation_result.json | `sqo/revalidation_result.json` | `status == PASS` |
| promotion_state.json | `sqo/promotion_state.json` | Must exist |
| proposition_review_state.json | `semantic/spe/proposition_review_state.json` | `status == COMPLETE` |

### Operator Decision (Non-Automatable)

| Action | Meaning |
|---|---|
| ADVANCE | S-level incremented (S0→S1, S1→S2) |
| HOLD | Revalidation passed but advancement deferred (business decision) |
| BLOCK | Advancement blocked despite revalidation (governance override) |

**Authority boundary:** L5 required for S2 advancement. L3 for S1.

### CLI Action Mechanism

```
python3 scripts/pios/promotion_action.py \
    --client blueedge \
    --run-id run_blueedge_genesis_e2e_03 \
    --action advance --target S1 \
    --operator operator:khorrix \
    --rationale "Revalidation PASS, governance lifecycle exercised"
```

### Output Artifacts

| Artifact | Path |
|---|---|
| promotion_state.json | `sqo/promotion_state.json` (updated) |
| promotion_event_log.jsonl | `sqo/promotion_event_log.jsonl` (appended) |

### Status Values

| Status | Meaning |
|---|---|
| S0 | Structural substrate materialized |
| S1 | Governance lifecycle exercised, semantic corpus validated |
| S2 | Full governed lifecycle complete, cross-specimen convergence eligible |

### Chronicle Event

`governance_gate_passed`: gate=PROMOTION, from=S0, to=S1
`qualification_transition`: from=S0, to=S1, authority=operator:khorrix

### Blocked Semantics

S2 requires revalidation PASS + operator L5 authority. S1 requires revalidation PASS + operator L3 authority.

---

## Materialization Registry Extension

The pipeline materialization registry should be extended to cover gates 1–2 (deterministic materializers). Gates 3–5 involve operator decisions and cannot be auto-materialized.

| Gate | Materializer | Auto-Materializable |
|---|---|---|
| Gate 1 (pre-seed) | `ceu_candidate_derivation.py` + `ceu_evidence_intake.py` + `ceu_reconciliation_seeder.py` | YES |
| Gate 1 (review) | `ceu_reconciliation_action.py` | NO — operator |
| Gate 2 | `semantic_proposition_engine.py` | YES (after Gate 1 COMPLETE) |
| Gate 3 | `proposition_review_action.py` | NO — operator |
| Gate 4 | `revalidation_engine.py` | YES (after Gate 3 COMPLETE) |
| Gate 5 | `promotion_action.py` | NO — operator |

---

## BlueEdge Genesis Run State

**Run:** `run_blueedge_genesis_e2e_03`

| Gate | Status | Detail |
|---|---|---|
| Gate 1 | INITIALIZED | 2 candidates (EVIDENCE_ATTACHED), 0 reviewed |
| Gate 2 | NOT_RUN | Blocked on Gate 1 |
| Gate 3 | NOT_RUN | Blocked on Gate 2 |
| Gate 4 | NOT_RUN | Blocked on Gate 3 |
| Gate 5 | S0 | PIPELINE_GENESIS, no lifecycle exercised |

**Next action:** Operator reviews CEU candidates via `ceu_reconciliation_action.py`.
