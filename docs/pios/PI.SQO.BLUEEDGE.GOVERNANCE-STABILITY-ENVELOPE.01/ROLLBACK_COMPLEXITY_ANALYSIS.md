# Rollback Complexity Analysis

**Stream:** PI.SQO.BLUEEDGE.GOVERNANCE-STABILITY-ENVELOPE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** W5 — Advanced Governance

---

## 1. Purpose

Characterize how rollback determinism, operator comprehension, and
cascade safety degrade under increasing orchestration pressure —
deeper rollback chains, dependency-driven cascades, and complex
revocation ordering.

---

## 2. Rollback Architecture (From Upstream)

From SANDBOX_ROLLBACK_AND_RECOVERY_MODEL:

| Capability | Mechanism |
|-----------|-----------|
| Single-package rollback | Revert individual package, recompute composite |
| Cascade rollback | Revoke dependents in reverse dependency order |
| Full sandbox reset | Revoke ALL overlays, restore certified baseline |
| Version rollback | Supersede current version, re-activate prior |

Rollback points created at:
- RP-INIT (sandbox creation)
- RP-PRE-ACTIVATE-<pkg> (before each activation)
- RP-POST-ACTIVATE-<pkg> (after each activation)
- RP-PRE-REVOKE-<pkg> (before each revocation)
- RP-PERIODIC (configurable intervals)

---

## 3. Rollback Chain Depth Scaling

### 3.1 Sequential Reverse-Order Revocation

From the multi-overlay proof (3 overlays):

```
T3 → T4: Revoke SEP-003 (backed 7→6)  T4 = T2 ✓
T4 → T5: Revoke SEP-002 (backed 6→5)  T5 = T1 ✓
T5 → T6: Revoke SEP-001 (backed 5→4)  T6 = T0 ✓
```

| Overlays | Revocation Steps | Rollback Points | Round-Trip Checks |
|----------|-----------------|----------------|-------------------|
| 1 | 1 | 3 (init + pre + post) | 1 (T0=T2) |
| 3 | 3 | 7 | 3 (proven) |
| 5 | 5 | 11 | 5 |
| 7 | 7 | 15 | 7 |
| 10 | 10 | 21 | 10 |

### 3.2 Rollback Point Storage

| Overlays | Rollback Points | Content (per point) | Assessment |
|----------|----------------|--------------------|----|
| 3 | 7 | registry hash + composite hash + audit hash + package list | SAFE |
| 5 | 11 | Same structure | SAFE |
| 7 | 15 | Same structure | PRESSURE |
| 10 | 21 | Same structure | PRESSURE |

Storage is linear and structurally bounded. NOT a pressure concern.

---

## 4. Rollback Complexity Dimensions

### 4.1 Rollback Ordering Complexity

**Without dependencies (current model):**
Rollback order is deterministic by package_id (reverse activation order).
Operator always knows which package to revoke next.

**With dependencies:**
Rollback order is constrained by dependency topology:
- Cannot revoke A if B depends on A (must revoke B first)
- Dependency graph determines valid revocation sequences

| Dependency Depth | Valid Revocation Orderings | Operator Clarity |
|-----------------|--------------------------|-----------------|
| 0 | 1 (reverse package_id) | Obvious |
| 1 | 1 (reverse topological) | Clear with dependency display |
| 2 | 1–3 (depends on graph shape) | Requires dependency visualization |
| 3+ | Multiple valid orderings | Ambiguous without tooling |

### 4.2 Cascade Rollback Complexity

When revoking package A triggers cascade revocation of dependents:

| Cascade Size | Packages Revoked | Composite Recomputations | Assessment |
|-------------|-----------------|------------------------|------------|
| 1 (no cascade) | 1 | 1 | SAFE |
| 2 (A + 1 dependent) | 2 | 2 | SAFE |
| 3 (A + 2 dependents) | 3 | 3 | PRESSURE |
| 4+ (A + 3+ dependents) | 4+ | 4+ | RISK |

**Key constraint:** Each cascade revocation requires its own
replay verification. A cascade of size 4 requires 4 sequential
replay verifications — the operator sees 4 intermediate states
between the decision to revoke and the final stable state.

### 4.3 Selective Revocation Complexity

Revoking a specific package from the middle of the activation
sequence:

```
Active: [SEP-001, SEP-002, SEP-003, SEP-004, SEP-005]
Revoke: SEP-003

Result: Composite = baseline + SEP-001 + SEP-002 + SEP-004 + SEP-005
        (gap handling: SEP-003 skipped, order preserved)
```

| Active Count | Selective Revocation Complexity | Assessment |
|-------------|-------------------------------|------------|
| 3 | Trivial — 2 remaining packages | SAFE |
| 5 | Simple — 4 remaining packages | SAFE |
| 7 | Moderate — 6 remaining packages | PRESSURE |
| 10 | Complex — 9 remaining packages to recompute | RISK |

---

## 5. Rollback Determinism Under Pressure

### 5.1 Determinism Guarantee

Rollback determinism is **structurally guaranteed** by:
1. Package application order is fixed (package_id sequence)
2. Gap handling preserves remaining order (no resequencing)
3. Composite recomputation is a pure function
4. Replay verification confirms determinism

**Rollback determinism never degrades** regardless of overlay count.
This is the strongest guarantee in the governance stability envelope.

### 5.2 What CAN Degrade

| Property | Degradation Mechanism | Threshold |
|----------|----------------------|-----------|
| Operator comprehension | Too many rollback steps to mentally model | > 7 steps |
| Cascade predictability | Dependency graph too deep to trace | Depth > 2 |
| Intermediate state count | Too many states between decision and result | > 3 intermediates |
| Replay verification latency | More packages to recompute per verification | > 7 packages |

---

## 6. Rollback Danger Scenarios

### 6.1 S-State Regression Risk

If overlays pushed qualification from S2 to S3 (17/17 backed),
rolling back ANY overlay drops below 17/17, causing S3 → S2 regression.

| Scenario | Risk | Governance Impact |
|----------|------|------------------|
| Revoke 1 overlay at S3 | S3 → S2 regression | Operator must understand S-state will regress |
| Selective revoke at S2 | No S-state change | Low governance impact |
| Full reset at S3 | S3 → S2 regression | Major governance decision |
| Full reset at S2 | S2 remains S2 | Clean recovery |

**Recommendation:** S-state regression risk should be displayed
in every revocation preview when S-state is overlay-dependent.

### 6.2 Dependency Cascade Danger

```
Scenario: A → B → C (depth 2 dependency chain)
Action:   Revoke A
Cascade:  Must first revoke C, then B, then A

Danger:   Operator wanted to revoke A but:
          - C had significant qualification contribution
          - Operator didn't realize C depended (transitively) on A
          - Cascade removes more qualification than expected
```

**Mitigation:** Cascade impact preview MUST show all transitively
affected packages and their cumulative qualification impact.

### 6.3 Ambiguous Rollback Order

```
Scenario: 5 overlays, no dependencies, operator wants to reach T2

Possible paths:
  Path 1: Revoke 5, then 4, then 3 (3 steps to T2)
  Path 2: Revoke 3, then 4, then 5 (3 steps to T2)
  Path 3: Revoke 5, then 3, then 4 (3 steps to T2)

All paths produce the same final state (T2) because overlays
are independent. But intermediate states differ.
```

**Key finding:** With independent overlays, any revocation order
produces the same final state. The rollback order affects only
the intermediate states, not the destination. This is a governance
STRENGTH — it means rollback ordering is not a source of ambiguity
for the final result.

---

## 7. Rollback Pressure Thresholds

| Dimension | SAFE | PRESSURE | RISK |
|-----------|------|----------|------|
| Sequential rollback steps | ≤ 5 | 6–7 | > 7 |
| Cascade size (packages per cascade) | 1–2 | 3 | > 3 |
| Dependency depth | 0–1 | 2 | > 2 |
| Intermediate states per revocation | 1 | 2 | > 2 |
| S-state regression risk | None | Known, previewed | Unpreviewable |
| Rollback points to navigate | ≤ 11 | 12–15 | > 15 |

---

## 8. Rollback Recoverability

### 8.1 Always-Recoverable Properties

| Property | Guarantee |
|----------|----------|
| Return to certified baseline | ALWAYS possible via full sandbox reset |
| Return to any prior activation state | ALWAYS possible via rollback point |
| Replay verification of rolled-back state | ALWAYS available |
| Audit trail preservation | ALWAYS maintained (append-only) |

### 8.2 Recovery Cost Under Pressure

| Overlays | Full Reset Cost | Selective Revoke Cost | Assessment |
|----------|----------------|----------------------|------------|
| 3 | 3 revocations + 1 recomputation | 1 revocation + 1 recomputation | Low |
| 5 | 5 revocations + 1 recomputation | 1 + cascade (if deps) | Moderate |
| 7 | 7 revocations + 1 recomputation | 1–3 + cascade | Significant |
| 10 | 10 revocations + 1 recomputation | 1–4 + cascade | High |

---

## 9. Governance

- Rollback determinism is structurally guaranteed and never degrades
- Rollback CLARITY degrades at > 7 sequential steps
- Cascade rollback becomes dangerous at depth > 2 (too many packages affected)
- S-state regression risk must always be previewed before revocation
- Independent overlays guarantee that rollback order does not affect final state
- Full sandbox reset is ALWAYS available as the ultimate recovery mechanism
