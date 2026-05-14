# Sandbox Rollback and Recovery Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines how overlay activation failures, qualification
conflicts, and governance violations trigger rollback, revocation,
cleanup, and recovery — all without corrupting replay chains or
certified baselines.

---

## 2. Rollback Triggers

### 2.1 Automatic Rollback Triggers

| Trigger | Detection | Action |
|---------|-----------|--------|
| Phase 1 validation failure | Package hash, provenance, or entry checks fail | Package remains STAGED; no state change |
| Phase 2 authorization failure | Unauthorized semantic class detected | Package remains STAGED; no state change |
| Phase 3 eligibility failure | Limit exceeded or dependency unresolved | Package remains STAGED; no state change |
| Phase 4 authorization denied | Governance denies activation | Package remains STAGED; no state change |
| Composite state inconsistency | Hash verification fails after activation | ROLLBACK: revert to pre-activation composite |
| Replay divergence | Replay reconstruction produces different hash | FREEZE sandbox; escalate to governance |

### 2.2 Governance-Initiated Rollback Triggers

| Trigger | Initiated By | Action |
|---------|-------------|--------|
| Standard revocation | Governance decision | Revoke specific package; recompute composite |
| Emergency revocation | Urgent governance action | Immediate revocation with cascade |
| Version rollback | Governance authorization | Supersede current version; reactivate prior |
| Full sandbox reset | Governance escalation | Revoke ALL overlays; return to certified baseline |
| Sandbox suspension | Governance hold | Freeze all operations; retain current state |

---

## 3. Rollback Point Architecture

### 3.1 Automatic Rollback Points

The sandbox creates rollback points at key lifecycle moments:

| Rollback Point | Created When | Contains |
|----------------|-------------|----------|
| RP-INIT | Sandbox creation | Empty sandbox state, baseline references |
| RP-PRE-ACTIVATE-<pkg> | Before each Phase 4 activation | Pre-activation composite + registry |
| RP-POST-ACTIVATE-<pkg> | After successful Phase 5 re-evaluation | Post-activation composite + registry |
| RP-PRE-REVOKE-<pkg> | Before each revocation | Pre-revocation composite + registry |
| RP-PERIODIC | At configurable intervals | Full sandbox state snapshot |

### 3.2 Rollback Point Schema

```json
{
  "rollback_point_id": "<uuid>",
  "type": "INIT | PRE_ACTIVATE | POST_ACTIVATE | PRE_REVOKE | PERIODIC",
  "created_at": "<ISO-8601>",
  "trigger": "<what created this rollback point>",
  "sandbox_state": {
    "namespace_id": "<id>",
    "status": "<sandbox status>",
    "package_registry_hash": "<hash>",
    "composite_state_hash": "<hash>",
    "audit_trail_hash": "<hash of last audit event>",
    "activated_packages": ["<package_id list>"],
    "overlay_summary": {
      "total": N,
      "activated": A,
      "staged": S,
      "revoked": R
    }
  },
  "replay_inputs_hash": "<hash of reconstruction inputs at this point>"
}
```

### 3.3 Rollback Point Retention

- Rollback points are retained for the lifetime of the sandbox
- CLOSED sandbox rollback points are retained for audit
- Rollback points are append-only (no deletion during active sandbox)
- Rollback points are ordered by creation timestamp

---

## 4. Rollback Operations

### 4.1 Single-Package Rollback

**When:** An individual overlay activation fails or is revoked.

```
1. LOAD rollback point RP-PRE-ACTIVATE-<pkg> (or RP-PRE-REVOKE-<pkg>)
2. VERIFY rollback point integrity (hash matches stored)
3. REVERT package status in registry:
   - If activation failed: status remains STAGED
   - If revocation: status transitions to REVOKED
4. RECOMPUTE composite state from (baseline + remaining activated packages)
5. VERIFY new composite matches replay reconstruction
6. CREATE new rollback point (RP-POST-ROLLBACK-<pkg>)
7. LOG rollback event in audit trail
```

### 4.2 Cascade Rollback

**When:** Revoking a package with dependents requires cascading revocation.

```
1. IDENTIFY dependency chain:
   Package A → B depends on A → C depends on B
2. LOAD rollback point RP-PRE-ACTIVATE for earliest package in chain
3. REVOKE in reverse dependency order: C, then B, then A
4. FOR EACH revocation:
   - Mark REVOKED in registry
   - Log revocation with CASCADE flag
5. RECOMPUTE composite state without all revoked packages
6. VERIFY composite matches replay reconstruction
7. CREATE rollback point RP-POST-CASCADE
8. LOG cascade rollback event
```

### 4.3 Full Sandbox Reset

**When:** Systemic issue requires return to certified baseline.

```
1. LOAD rollback point RP-INIT (sandbox creation state)
2. MARK ALL ACTIVATED packages as REVOKED with FULL_RESET flag
3. CLEAR composite state (or recompute to certified-only)
4. VERIFY composite = certified baseline:
   S-state: S2, Q-class: Q-02, backed: 4/17
5. CREATE rollback point RP-FULL-RESET
6. LOG full reset event with elevated audit severity
7. RETAIN all package artifacts and audit trail (no deletion)
```

### 4.4 Version Rollback

**When:** A package version is rolled back to a prior version.

```
1. VERIFY target version exists and was previously ACTIVATED or STAGED
2. MARK current version as SUPERSEDED
3. RE-ENTER target version at Phase 1 (full re-validation)
4. IF target version passes all checks:
   - ACTIVATE target version
   - RECOMPUTE composite with target version entries
5. IF target version fails:
   - Target remains STAGED
   - Composite recomputed without any version of this package
6. LOG version rollback event
```

---

## 5. Recovery Operations

### 5.1 Sandbox Recovery from Corruption

If sandbox state becomes inconsistent (e.g., registry doesn't match
activation state):

```
1. FREEZE sandbox (no new operations)
2. IDENTIFY latest valid rollback point:
   - Walk rollback points in reverse chronological order
   - Verify each rollback point hash integrity
   - Use first rollback point that passes verification
3. RESTORE sandbox state from valid rollback point
4. RECOMPUTE composite state from restored state
5. VERIFY replay determinism from restored state
6. LOG recovery event
7. RESUME sandbox operations (or keep frozen for governance)
```

### 5.2 Sandbox Recovery from Baseline Drift

If certified baseline changes (pipeline re-execution):

```
1. DETECT hash mismatch on next certified artifact read
2. HALT all sandbox operations
3. LOG baseline drift detection
4. OPTIONS:
   a) CLOSE current sandbox, CREATE new sandbox against new baseline
   b) SUSPEND current sandbox pending governance decision
   c) CLOSE current sandbox, MIGRATE eligible packages to new sandbox
5. GOVERNANCE DECISION required — no automatic resolution
```

### 5.3 Cleanup Manifest

The sandbox maintains a cleanup manifest tracking recovery operations:

```json
{
  "cleanup_history": [
    {
      "cleanup_id": "<uuid>",
      "timestamp": "<ISO-8601>",
      "type": "ROLLBACK | RECOVERY | RESET | MIGRATION",
      "trigger": "<what caused cleanup>",
      "rollback_point_used": "<rollback_point_id>",
      "packages_affected": ["<list>"],
      "composite_state_before": "<hash>",
      "composite_state_after": "<hash>",
      "replay_verified": true
    }
  ]
}
```

---

## 6. Replay Chain Preservation

### 6.1 Rollback and Replay Integrity

Every rollback operation preserves the replay chain:

| Property | Guarantee |
|----------|----------|
| Package artifacts | NEVER deleted, even when REVOKED |
| Activation events | RETAINED in audit trail |
| Revocation events | APPENDED to audit trail |
| Rollback points | RETAINED (append-only) |
| Replay snapshots | RETAINED for every significant state change |
| Composite state history | Reconstructable from replay inputs at any rollback point |

### 6.2 Post-Rollback Replay Verification

After every rollback or recovery operation:

```
1. TAKE replay snapshot of new state
2. INDEPENDENTLY reconstruct composite from current inputs
3. VERIFY reconstruction matches new composite
4. IF divergence: HALT and escalate (rollback itself may be corrupted)
```

---

## 7. BlueEdge-Specific Recovery Scenarios

| Scenario | Baseline After Recovery |
|----------|----------------------|
| Single overlay rollback | S2, Q-02, backed = 4 + remaining overlays |
| Cascade rollback (dependency chain) | S2, Q-02, backed = 4 + unaffected overlays |
| S3 achieved then overlay revoked (backed < 17) | S3 → S2 regression, Q-01 → Q-02 |
| Full sandbox reset | S2, Q-02, backed = 4/17 (certified baseline) |
| Sandbox corruption recovery | Restored to latest valid rollback point |
| Baseline drift (new pipeline run) | Sandbox closed; new sandbox against new baseline |

---

## 8. Governance Rules

1. Rollback points are created automatically at lifecycle boundaries.
2. Rollback operations preserve all artifacts (no deletion).
3. Replay verification is mandatory after every rollback.
4. Full sandbox reset requires governance authorization.
5. Baseline drift requires governance decision (no automatic resolution).
6. Recovery operations are logged with full context for audit.
7. No rollback operation may modify certified baseline state.
8. Cascade rollback processes in reverse dependency order.
