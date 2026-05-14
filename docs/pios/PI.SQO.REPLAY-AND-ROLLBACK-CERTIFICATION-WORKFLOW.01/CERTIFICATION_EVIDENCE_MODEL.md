# Certification Evidence Model

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the evidence model that certification produces — the
auditable proof records that replay integrity and rollback integrity
have been verified, forming the evidentiary basis for authority
promotion and publication eligibility decisions.

---

## 2. Certification Evidence Types

### 2.1 Six Certification Evidence Types

| # | Type | Description | Producer |
|---|------|-------------|----------|
| CE-01 | Replay certification record | Proves composite state is deterministically reconstructable | Replay certification pipeline |
| CE-02 | Rollback certification record | Proves overlay can be independently removed | Rollback certification pipeline |
| CE-03 | Reconstruction audit trail | Detailed execution log of reconstruction steps | Reconstruction model |
| CE-04 | Divergence investigation record | Root cause analysis of any detected divergence | Divergence detection |
| CE-05 | Ambiguity resolution record | Resolution of any detected ambiguity | Ambiguity detection |
| CE-06 | Combined certification record | Joint replay+rollback promotion eligibility | Combined gate |

### 2.2 Evidence Lifecycle

```
Phase 1: Evidence Creation
  │  Certification pipeline produces evidence records
  ▼
Phase 2: Evidence Verification
  │  Evidence records are hash-verified and timestamped
  ▼
Phase 3: Evidence Binding
  │  Evidence bound to overlay, run, and lineage chain
  ▼
Phase 4: Evidence Persistence
  │  Evidence stored in certification evidence store
  ▼
Phase 5: Evidence Consumption
  │  Authority promotion and publication gates consume evidence
  ▼
[Retained: Evidence remains for audit indefinitely]
```

---

## 3. Replay Certification Evidence (CE-01)

### 3.1 Mandatory Fields

| Field | Type | Description |
|-------|------|-------------|
| certification_id | string | RCERT-{client}-{run_id}-{seq} |
| timestamp | ISO-8601 | Certification decision time |
| decision | enum | REPLAY_CERTIFIED, REPLAY_PARTIAL, REPLAY_DENIED, REPLAY_FAILED |
| input_hash | sha256 | Hash of all 6 replay inputs |
| reconstructed_hash | sha256 | Hash of reconstructed composite |
| current_hash | sha256 | Hash of current composite |
| match | boolean | Whether reconstructed matches current |
| double_replay | boolean | Whether double-replay was performed |
| double_replay_consistent | boolean | Whether both replays produced same hash |
| lineage_verification | object | Per-type verification status (6 types) |
| certified_overlays | array | List of certified overlay package_ids |
| denied_overlays | array | List of denied overlay package_ids (if PARTIAL) |
| governance_zone | enum | Zone at certification time |
| escalation_level | enum | G-0 through G-4 |

### 3.2 Replay Evidence Integrity

```
Replay evidence hash = sha256(
  certification_id +
  timestamp +
  decision +
  input_hash +
  reconstructed_hash +
  current_hash +
  match +
  double_replay +
  lineage_verification_hash
)

Evidence is tamper-evident:
  - Any modification changes the evidence hash
  - Evidence hash is stored in certification evidence store
  - Evidence hash is referenced by combined certification record
```

---

## 4. Rollback Certification Evidence (CE-02)

### 4.1 Mandatory Fields

| Field | Type | Description |
|-------|------|-------------|
| certification_id | string | RBCERT-{client}-{run_id}-{seq} |
| timestamp | ISO-8601 | Certification decision time |
| decision | enum | ROLLBACK_CERTIFIED, ROLLBACK_CONDITIONAL, ROLLBACK_CERTIFIED_WITH_WARNINGS, ROLLBACK_DENIED |
| overlay_id | string | Target overlay package_id |
| dependency_hash | sha256 | Hash of dependency inventory |
| removability_checks | object | Per-check status (7 checks) |
| state_restoration | object | Expected/simulated hash comparison |
| double_rollback | boolean | Whether double-rollback was performed |
| double_rollback_consistent | boolean | Whether both rollbacks produced same hash |
| cascade_safety | object | Cascade depth, size, impact |
| s_state_regression | object | Pre/post S-state with acceptability |
| governance_zone | enum | Zone at certification time |
| escalation_level | enum | G-0 through G-4 |

### 4.2 Rollback Evidence Integrity

```
Rollback evidence hash = sha256(
  certification_id +
  timestamp +
  decision +
  overlay_id +
  dependency_hash +
  removability_hash +
  state_restoration_hash +
  cascade_safety_hash
)
```

---

## 5. Reconstruction Audit Trail Evidence (CE-03)

### 5.1 Mandatory Fields

| Field | Type | Description |
|-------|------|-------------|
| audit_id | string | RAUD-{client}-{run_id}-{seq} |
| timestamp | ISO-8601 | Reconstruction execution time |
| type | enum | REPLAY, ROLLBACK |
| certification_ref | string | RCERT or RBCERT reference |
| inputs | object | Baseline hash, overlay count, config versions |
| execution | object | Entries applied, skipped, conflicts resolved |
| output | object | Composite hash, determinism verified |
| log_entries | array | Complete step-by-step reconstruction log |
| execution_time_ms | integer | Wall-clock execution time |

### 5.2 Audit Trail Completeness

```
Audit trail MUST contain:
  - Every entry application (APPLY or SKIP with reason)
  - Every conflict resolution (domain, field, winner)
  - Every metric computation result
  - Final hash computation
  - Any errors or warnings encountered

Audit trail MUST NOT contain:
  - Actual domain values (privacy boundary)
  - External system responses
  - Operator identity (separate from audit trail)
```

---

## 6. Investigation Evidence (CE-04, CE-05)

### 6.1 Divergence Investigation Evidence (CE-04)

| Field | Type | Description |
|-------|------|-------------|
| record_id | string | DIVR-{client}-{run_id}-{seq} |
| certification_ref | string | RCERT or RBCERT that triggered investigation |
| divergence_type | enum | DIV-01 through DIV-04 |
| severity | enum | CRITICAL, HIGH |
| root_cause | enum | RC-01 through RC-07 |
| affected_overlays | array | Overlays involved in divergence |
| investigation_steps | array | Steps taken to identify root cause |
| resolution | object | How divergence was resolved (if resolved) |
| status | enum | OPEN, IN_PROGRESS, RESOLVED, UNRESOLVED |

### 6.2 Ambiguity Resolution Evidence (CE-05)

| Field | Type | Description |
|-------|------|-------------|
| record_id | string | AMBR-{client}-{run_id}-{seq} |
| certification_ref | string | RCERT or RBCERT that triggered detection |
| ambiguity_type | enum | AMB-01 through AMB-05 |
| severity | enum | CRITICAL, HIGH, MEDIUM |
| affected_inputs | array | Inputs with ambiguity |
| resolution_steps | array | Steps taken to resolve ambiguity |
| resolution_outcome | enum | RESOLVED, UNRESOLVABLE, ACCEPTED_WITH_WARNING |
| status | enum | OPEN, IN_PROGRESS, RESOLVED |

---

## 7. Combined Certification Evidence (CE-06)

### 7.1 Mandatory Fields

| Field | Type | Description |
|-------|------|-------------|
| certification_id | string | CERT-{client}-{run_id}-{seq} |
| timestamp | ISO-8601 | Combined decision time |
| replay_certification_id | string | RCERT reference |
| rollback_certification_id | string | RBCERT reference |
| replay_decision | enum | Replay certification decision |
| rollback_decision | enum | Rollback certification decision |
| promotion_eligibility | enum | PROMOTION_ELIGIBLE, PROMOTION_RESTRICTED, PROMOTION_BLOCKED |
| overlay_id | string | Target overlay package_id |
| certified_for | array | Capabilities granted by certification |
| restrictions | array | Restrictions on promotion (if RESTRICTED) |
| governance_zone | enum | Zone at combined certification time |
| escalation_level | enum | G-0 through G-4 |

### 7.2 Combined Evidence Integrity

```
Combined evidence hash = sha256(
  certification_id +
  replay_certification_id +
  rollback_certification_id +
  replay_decision +
  rollback_decision +
  promotion_eligibility +
  overlay_id
)

Combined evidence references:
  - Replay certification evidence (by hash)
  - Rollback certification evidence (by hash)
  - Reconstruction audit trails (by hash)
  - Any investigation records (by hash)
```

---

## 8. Evidence Lineage Chain

### 8.1 Certification Evidence in L0–L5 Lineage

```
L0 (External Source)
  │  Evidence source documents
  ▼
L1 (Intake Registration)
  │  Evidence intake records
  ▼
L2 (Package Entry)
  │  SEP package with entries
  ▼
L3 (Overlay Activation)
  │  Activated overlay contributing to composite
  ▼
L4 (Qualification Influence)
  │  Overlay's effect on qualification metrics
  ▼
L5 (Certification / Publication)
  │  CE-01 + CE-02 + CE-06 = certification evidence
  │  Authority promotion eligibility
  ▼
[Authority State: deterministically certified]
```

### 8.2 Certification as L5 Authority

Certification evidence (CE-06) is the L5 lineage record that
completes the authority chain. It proves:

1. The overlay's composite contribution is deterministically reconstructable (replay)
2. The overlay can be independently removed (rollback)
3. Both properties have been verified through hash-based comparison
4. The overlay is eligible for authority promotion

Without L5 certification evidence, no L4 qualification claim
can be promoted to authority.

---

## 9. Evidence Retention and Access

### 9.1 Retention Rules

| Evidence Type | Retention Period | Access Level |
|--------------|-----------------|-------------|
| CE-01 (replay cert) | Indefinite | Governance + Certification |
| CE-02 (rollback cert) | Indefinite | Governance + Certification |
| CE-03 (audit trail) | Indefinite | Certification + Investigation |
| CE-04 (divergence) | Indefinite | Governance + Investigation |
| CE-05 (ambiguity) | Indefinite | Governance + Investigation |
| CE-06 (combined cert) | Indefinite | All authority domains |

### 9.2 Evidence Immutability

```
All certification evidence is WRITE-ONCE:
  - Created at certification decision time
  - Hash-verified at creation
  - Cannot be modified after creation
  - Can be superseded by new certification (new record, old preserved)
  - Deletion is PROHIBITED
```

---

## 10. Governance

- 6 certification evidence types cover full certification lifecycle
- 5-phase evidence lifecycle from creation to consumption
- Replay and rollback evidence contain hash-verified mandatory fields
- Reconstruction audit trails are complete but privacy-bounded
- Investigation evidence tracks divergence and ambiguity resolution
- Combined evidence unifies replay+rollback for promotion decisions
- Certification evidence is L5 in the lineage chain
- All evidence is write-once, hash-verified, and retained indefinitely
- Evidence immutability is enforced — no modification, no deletion
- Evidence model is client-agnostic
