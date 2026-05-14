# Overlay Replay and Rollback Review

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the detailed replay safety and rollback safety review
protocols applied to overlay proposals — ensuring every authorized
overlay is deterministically reconstructable and independently
removable.

---

## 2. Replay Safety Review

### 2.1 Six Replay Safety Checks

| # | Check | What Is Verified | Failure Impact |
|---|-------|-----------------|---------------|
| RS-01 | Entry replay attestation | Every entry has replay_safe = true | BLOCK — non-replay-safe entry |
| RS-02 | Application order determinism | Package and entry IDs are monotonic, no ordering ambiguity | BLOCK — non-deterministic ordering |
| RS-03 | Conflict resolution determinism | Later entry wins, higher confidence wins — rules are explicit | BLOCK — ambiguous conflict resolution |
| RS-04 | Source hash verification | Source material hash matches recorded hash | BLOCK — source integrity failure |
| RS-05 | Package hash verification | Package content hash matches registration hash | BLOCK — package integrity failure |
| RS-06 | No interpretation dependency | No entry requires 75.x authorization for extraction | BLOCK — interpretation boundary |

### 2.2 Replay Safety Review Process

```
FOR each package in proposal:

  RS-01: Entry replay attestation
    FOR each entry in package:
      ASSERT entry.replay_safe == true
      IF false → FAIL("Entry {entry_id} is not replay-safe")

  RS-02: Application order determinism
    VERIFY package_id follows monotonic sequence
    VERIFY entry_ids within package follow monotonic sequence
    VERIFY no two packages share the same activation slot
    IF ordering ambiguity → FAIL("Non-deterministic application order")

  RS-03: Conflict resolution determinism
    FOR each entry targeting a domain+field already claimed:
      VERIFY conflict resolution rule is unambiguous:
        - Same package_id sequence → later wins (deterministic)
        - Different confidence → higher wins (deterministic)
        - Same confidence, same sequence → flag as ambiguous
      IF ambiguous → FAIL("Ambiguous conflict: {entry_id} vs {existing_entry_id}")
      IF resolved → RECORD conflict resolution in proposal

  RS-04: Source hash verification
    RETRIEVE source material hash from intake registration
    COMPARE against current source hash
    IF mismatch → FAIL("Source hash mismatch for {source_ref}")

  RS-05: Package hash verification
    COMPUTE current package hash
    COMPARE against registration hash
    IF mismatch → FAIL("Package hash mismatch for {package_id}")

  RS-06: Interpretation check
    FOR each entry:
      VERIFY confidence_basis != requires_interpretation
      VERIFY evidence_basis is structural (not semantic inference)
      IF interpretation detected → FAIL("Entry {entry_id} requires interpretation")
```

### 2.3 Replay Safety Outcome

| Outcome | Condition | Next Step |
|---------|-----------|-----------|
| REPLAY-AUTHORIZED | All 6 checks PASS for all packages | Proceed to rollback review |
| REPLAY-DENIED | Any check FAILS | Proposal blocked — fix and re-submit |
| REPLAY-CONDITIONAL | Checks PASS with recorded conflict resolutions | Proceed with conditions documented |

---

## 3. Rollback Safety Review

### 3.1 Seven Rollback Safety Checks

| # | Check | What Is Verified | Failure Impact |
|---|-------|-----------------|---------------|
| RB-01 | Independent removability | Package can be removed without affecting other overlays | BLOCK — dependent removal |
| RB-02 | No inbound dependencies | No existing overlay depends on proposed overlay's claims | WARN — dependency documented |
| RB-03 | State restoration exactness | Removal produces exact pre-activation state | BLOCK — inexact restoration |
| RB-04 | No irreversible side-effects | Activation does not create permanent state changes | BLOCK — irreversible activation |
| RB-05 | Partial batch rollback | Any subset of batch can be removed independently | WARN — batch coupling |
| RB-06 | Rollback order independence | Final state after full rollback is same regardless of removal order | BLOCK — order-dependent rollback |
| RB-07 | S-state regression safety | If overlay achieves S3 and is revoked, regression is handled | WARN — regression risk |

### 3.2 Rollback Safety Review Process

```
FOR each package in proposal:

  RB-01: Independent removability
    VERIFY package has no outbound claims that other packages reference
    VERIFY package removal does not invalidate another package's entries
    IF dependent → FAIL("Package {package_id} has outbound dependencies")

  RB-02: No inbound dependencies
    FOR each existing ACTIVATED overlay:
      CHECK if any entry references claims from proposed package
      IF dependency found → WARN("Existing overlay {pkg} depends on proposed claims")
      RECORD dependency in proposal risk assessment

  RB-03: State restoration exactness
    SIMULATE: composite_with_overlay → remove_overlay → composite_without
    COMPARE composite_without against current_composite
    IF not equal → FAIL("State restoration not exact for {package_id}")

  RB-04: No irreversible side-effects
    VERIFY activation lifecycle (Phases 0–7) produces only:
      - Overlay contribution records (removable)
      - Audit trail entries (append-only, not rolled back)
      - Qualification re-evaluation (recomputable)
    IF irreversible effect → FAIL("Irreversible side-effect detected")

  RB-05: Partial batch rollback
    FOR each subset of proposed batch:
      VERIFY subset removal produces consistent composite state
      VERIFY remaining batch entries remain valid
    IF partial rollback fails → WARN("Batch coupling detected")

  RB-06: Rollback order independence
    FOR at least 2 permutations of removal order:
      SIMULATE removal in each order
      COMPARE final states
      IF states differ → FAIL("Order-dependent rollback for batch")

  RB-07: S-state regression safety
    IF proposed overlay would achieve S3:
      ASSESS: what happens if overlay is revoked after S3?
      DOCUMENT: S-state regression scenario and impact
      WARN operator of regression risk
```

### 3.3 Rollback Safety Outcome

| Outcome | Condition | Next Step |
|---------|-----------|-----------|
| ROLLBACK-AUTHORIZED | All BLOCK checks PASS, no FAIL conditions | Proceed to operator authorization |
| ROLLBACK-DENIED | Any BLOCK check FAILS | Proposal blocked — restructure packages |
| ROLLBACK-CONDITIONAL | BLOCK checks PASS, but WARN conditions exist | Proceed with conditions documented and operator acceptance |

---

## 4. Sensitivity-Specific Enhanced Review

### 4.1 REPLAY-SENSITIVE Enhanced Review

When overlay is classified as REPLAY-SENSITIVE:

```
ADDITIONAL CHECKS:
  1. Compute full conflict resolution trace
     - Document every conflict with resolution outcome
     - Verify no conflict is silently resolved

  2. Verify ordering dependency
     - Document which overlays must be applied before this one
     - Verify ordering is deterministic from package_ids

  3. Simulate double-replay
     - Compute composite state twice from same inputs
     - Verify H1 == H2 (no non-determinism)

  4. Record enhanced replay attestation
     - Document all ordering constraints
     - Document all conflict resolutions
     - Attach to proposal for review
```

### 4.2 ROLLBACK-SENSITIVE Enhanced Review

When overlay is classified as ROLLBACK-SENSITIVE:

```
ADDITIONAL CHECKS:
  1. Map full dependency chain
     - Which overlays depend on this overlay?
     - What is the cascade depth?

  2. Compute cascade rollback scenario
     - If this overlay is revoked, which others must be revoked?
     - What is the maximum cascade size?

  3. Compute S-state regression scenario
     - If this overlay achieves a qualification threshold:
       - What state does the system revert to?
       - How many iterations of progress are lost?

  4. Compute recovery cost
     - How expensive is it to recover from revocation?
     - Classify as LOW / MODERATE / HIGH / MAXIMUM

  5. Record enhanced rollback attestation
     - Document dependency chain
     - Document cascade scenario
     - Document recovery cost
     - Attach to proposal for review
```

---

## 5. Replay/Rollback Review Interaction with Evidence Trust

### 5.1 Trust Level Impact on Review

| Evidence Trust | Replay Review | Rollback Review |
|---------------|:-------------:|:---------------:|
| TRUSTED | Standard review | Standard review |
| PROVISIONAL | Enhanced review (authority unverified) | Enhanced review (certification implications) |
| QUARANTINED | BLOCKED (cannot review quarantined evidence) | BLOCKED |
| PROHIBITED | BLOCKED (cannot review prohibited evidence) | BLOCKED |

### 5.2 PROVISIONAL Evidence Enhanced Review

```
IF evidence trust = PROVISIONAL:
  ADDITIONAL replay checks:
    - Verify extraction does not depend on authority identity
    - Verify claim would be identical regardless of authority
    - Document authority verification requirement for certification

  ADDITIONAL rollback checks:
    - If authority verification fails later, can overlay be safely revoked?
    - Document trust upgrade path for certification readiness
```

---

## 6. Review Audit Records

### 6.1 Replay Review Record

```json
{
  "replay_review": {
    "proposal_id": "PROP-blueedge-CLU-04-002",
    "timestamp": "<ISO-8601>",
    "outcome": "REPLAY-AUTHORIZED",
    "checks": [
      { "check": "RS-01", "result": "PASS", "entries_verified": 5 },
      { "check": "RS-02", "result": "PASS", "ordering": "monotonic" },
      { "check": "RS-03", "result": "PASS", "conflicts": 0 },
      { "check": "RS-04", "result": "PASS", "hashes_verified": 2 },
      { "check": "RS-05", "result": "PASS", "packages_verified": 2 },
      { "check": "RS-06", "result": "PASS", "interpretation": "none" }
    ],
    "sensitivity": "STANDARD",
    "enhanced_review": false
  }
}
```

### 6.2 Rollback Review Record

```json
{
  "rollback_review": {
    "proposal_id": "PROP-blueedge-CLU-04-002",
    "timestamp": "<ISO-8601>",
    "outcome": "ROLLBACK-AUTHORIZED",
    "checks": [
      { "check": "RB-01", "result": "PASS" },
      { "check": "RB-02", "result": "PASS", "dependencies": 0 },
      { "check": "RB-03", "result": "PASS" },
      { "check": "RB-04", "result": "PASS" },
      { "check": "RB-05", "result": "PASS" },
      { "check": "RB-06", "result": "PASS" },
      { "check": "RB-07", "result": "N/A", "note": "S3 not yet achievable" }
    ],
    "sensitivity": "STANDARD",
    "enhanced_review": false,
    "cascade_risk": "NONE",
    "recovery_cost": "LOW"
  }
}
```

---

## 7. Governance

- 6 replay safety checks ensure deterministic reconstructability
- 7 rollback safety checks ensure independent removability
- REPLAY-SENSITIVE and ROLLBACK-SENSITIVE overlays receive enhanced review
- PROVISIONAL evidence triggers additional trust-aware review
- 3 possible outcomes per review (AUTHORIZED / DENIED / CONDITIONAL)
- CONDITIONAL outcomes require explicit operator acceptance
- Every check is individually auditable
- Review records are immutable and attributed
