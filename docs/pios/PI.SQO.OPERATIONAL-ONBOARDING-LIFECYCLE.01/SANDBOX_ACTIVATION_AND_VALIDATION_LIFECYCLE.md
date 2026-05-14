# Sandbox Activation and Validation Lifecycle

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the governed lifecycle for sandbox activation, replay
validation, and rollback validation — the execution stages that
produce governed qualification state changes.

---

## 2. Sandbox Activation Lifecycle (Stage 6)

### 2.1 Pre-Activation Verification

Before any overlay activation:

```
CHECK 1: Sandbox exists and is ACTIVE
CHECK 2: Baseline hashes verified (4 artifacts byte-identical)
CHECK 3: Governance zone ≤ PRESSURE
CHECK 4: Governance approval record exists for target packages
CHECK 5: Overload detection returns NORMAL or ELEVATED (not OVERLOADED)
CHECK 6: Zero structural entropy indicators triggered
```

If ANY check fails → HALT activation, report failure.

### 2.2 Activation Execution (Per Package)

Each package proceeds through the 8-phase activation lifecycle:

```
Phase 0: STAGED         Package registered in sandbox
Phase 1: VALIDATED       9/9 structural checks (hash, provenance, entry format)
Phase 2: AUTHORIZED      5/5 semantic class authorization checks
Phase 3: ELIGIBLE        6/6 eligibility checks (limits, dependencies, conflicts)
Phase 4: ACTIVATED       Governance authorization confirmed
Phase 5: RE-EVALUATED    Composite state recomputed with overlay contributions
Phase 6: VISIBLE         Qualification state disclosed with attribution
Phase 7: OBSERVABLE      Observability records updated
```

### 2.3 Sequential Activation Protocol

For multiple packages in a batch:

```
FOR EACH package IN batch (ordered by package_id):
  Execute Phases 0–7
  IF any phase fails:
    Package remains at last successful phase
    IF batch is atomic (batch activation):
      ROLLBACK all packages in batch
    ELSE (sequential):
      Continue with remaining packages
  Trigger re-evaluation after activation
  Take replay snapshot
  Generate audit events
```

### 2.4 Activation Gate (G-ACTIVATE)

| Check | Requirement |
|-------|------------|
| All 6 pre-activation checks pass | YES |
| Phase 1 validation complete | 9/9 checks PASS |
| Phase 2 authorization complete | 5/5 checks PASS |
| Phase 3 eligibility complete | 6/6 checks PASS |
| Phase 4 governance authorization | APPROVED |
| Post-activation replay snapshot | TAKEN |
| Post-activation audit events | RECORDED |

---

## 3. Replay Validation Lifecycle (Stage 7)

### 3.1 Replay Validation Process

After every activation (and periodically during monitoring):

```
STEP 1: Collect 6 Replay Inputs
  I-1: Substrate version (hash-verified)
  I-2: Qualification baseline (hash-verified)
  I-3: Current overlay package set (all ACTIVATED packages)
  I-4: Current activation profile (package_id order)
  I-5: Evaluation framework version
  I-6: Sandbox manifest

STEP 2: Input Integrity Verification
  FOR EACH input:
    Compute sha256(input_content)
    Verify hash matches recorded value
  IF mismatch: HALT with REPLAY_INPUT_INTEGRITY_FAILURE

STEP 3: Deterministic Reconstruction
  composite = deepClone(certified_baseline)
  FOR EACH package IN activated_packages (ordered by package_id):
    FOR EACH entry IN package.entries (ordered by entry_id):
      Apply entry to composite
  Compute composite metrics (backed_count, grounding_ratio, S-state, Q-class)

STEP 4: Hash Comparison
  replay_hash = sha256(JSON.stringify(composite, sorted_keys))
  IF stored snapshot exists:
    Compare replay_hash to snapshot.composite_hash
    Result: MATCH or DIVERGENCE

STEP 5: Snapshot Emission
  Store replay snapshot with:
    - 6 input hashes
    - Composite hash
    - Composite summary
    - Verification result
    - Cross-snapshot references (for revocation states)
```

### 3.2 Replay Validation Gate (G-REPLAY)

| Check | Requirement |
|-------|------------|
| All 6 inputs hash-verified | YES |
| Reconstruction deterministic | Same inputs → same composite |
| Verification result | MATCH (not DIVERGENCE) |
| Snapshot stored | Replay snapshot persisted in sandbox |
| Cross-snapshot references | Valid for revocation states |

### 3.3 Replay Failure Response

| Failure | Severity | Response |
|---------|----------|----------|
| Input integrity failure | CRITICAL | Identify changed input, freeze sandbox |
| Divergence (composite mismatch) | CRITICAL | Preserve both states, freeze, escalate to G-4 |
| Snapshot storage failure | HIGH | Retry, if persistent → escalate |

---

## 4. Rollback Validation Lifecycle (Stage 8)

### 4.1 Rollback Validation Process

After each activation batch and before promotion:

```
STEP 1: Independent Removability Verification
  FOR EACH active overlay:
    Compute projected state if this overlay is revoked
    Verify projected state matches prior-to-activation snapshot
    Record: T_revoked = T_prior_to_activation

STEP 2: Round-Trip Verification
  Compute projected state if ALL overlays are revoked
  Verify projected state matches certified baseline (T0)
  Record: T_full_revocation = T0

STEP 3: Cascade Safety Verification
  FOR EACH overlay with dependents:
    Compute cascade impact (all packages in dependency chain)
    Verify cascade size ≤ 3 packages
    Verify cascade produces deterministic result

STEP 4: Rollback Point Integrity
  Verify all rollback points are intact (hashes match)
  Verify rollback point chain is complete (no gaps)
```

### 4.2 Rollback Validation Gate (G-ROLLBACK)

| Check | Requirement |
|-------|------------|
| Independent removability | Each overlay removable without cascade (or cascade ≤ 3) |
| Round-trip proof | Full revocation returns to certified baseline |
| Cascade safety | No cascade exceeds 3 packages |
| Rollback points intact | All rollback point hashes verified |
| Rollback point chain complete | No gaps in rollback point sequence |

### 4.3 Rollback Failure Response

| Failure | Severity | Response |
|---------|----------|----------|
| Independent removability failure | HIGH | Investigate dependency, may require package restructuring |
| Round-trip failure | CRITICAL | Structural entropy — escalate to G-4 |
| Cascade exceeds limit | HIGH | Governance escalation, dependency restructuring |
| Rollback point corruption | CRITICAL | Freeze sandbox, recover from last valid point |

---

## 5. Qualification Assessment (Stage 9)

### 5.1 Assessment Process

After successful replay and rollback validation:

```
STEP 1: Composite State Evaluation
  Current S-state: computed from composite
  Current Q-class: computed from composite
  Current backed_count: certified + overlay
  Current grounding_ratio: backed / total

STEP 2: Attribution Breakdown
  FOR EACH backed domain:
    Source: PIPELINE_CERTIFIED or OVERLAY_VERIFIED
    If OVERLAY: which package, which entry, which confidence basis

STEP 3: Progression Status
  Gap to S3: 17 - backed_count
  Iterations remaining: estimated from gap and package capacity
  Governance zone: current zone status

STEP 4: Debt Assessment
  Remaining domain gaps
  Evidence availability for remaining domains
  Package capacity remaining (10 - active_count)
```

### 5.2 Assessment Gate (G-QUALIFY)

| Check | Requirement |
|-------|------------|
| Attribution complete | Every backed domain attributed to source |
| Disclosure met | Certified vs overlay breakdown explicit |
| Consistency verified | Assessment matches replay-verified composite |
| Progression status computed | Gap, iterations, zone all assessed |

---

## 6. Lifecycle Integration

### 6.1 Stage Dependencies

```
Stage 5 (Approval) → Stage 6 (Activation) → Stage 7 (Replay)
                                            → Stage 8 (Rollback)
                                            → Stage 9 (Assessment)
```

Stages 7, 8, and 9 execute sequentially after Stage 6.
All three must PASS before the iteration is considered complete.

### 6.2 Iteration Completion Criteria

An iteration is COMPLETE when:
1. All approved packages activated (Stage 6 PASS)
2. Replay verification MATCH for all states (Stage 7 PASS)
3. Rollback validation PASS for all overlays (Stage 8 PASS)
4. Qualification assessment produced (Stage 9 PASS)

If any stage fails, the iteration is INCOMPLETE and recovery
procedures apply (Stage 14).

---

## 7. Governance

- Sandbox activation follows the 8-phase lifecycle per package
- Replay validation is mandatory after every activation
- Rollback validation is mandatory after every activation batch
- Replay divergence is a CRITICAL event requiring immediate freeze
- Round-trip failure (T_revoked ≠ T0) indicates structural entropy
- Qualification assessment must be consistent with replay-verified composite
- All stages produce audit events for governance trail
