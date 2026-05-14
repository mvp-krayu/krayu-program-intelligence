# Overlay State Machine

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document formalizes the overlay state machine — the deterministic
state transition model that governs every Semantic Evidence Package from
creation to terminal state. The state machine is the authoritative
reference for what transitions are legal, what triggers them, and what
side effects they produce.

---

## 2. States

| State | Code | Description |
|-------|------|-------------|
| STAGED | S | Package persisted, not yet contributing to evaluation |
| VALIDATING | V | Undergoing Phases 1–3 checks (transient) |
| ACTIVATION_PENDING | P | Passed checks, awaiting governance authorization (transient) |
| ACTIVATED | A | Contributing to composite qualification evaluation |
| REVOKED | R | Withdrawn; contributions removed from evaluation |
| SUPERSEDED | U | Replaced by newer version of same package |

### Transient States

VALIDATING and ACTIVATION_PENDING are transient states that exist during
the activation process. A package should not remain in a transient state
beyond the activation transaction. If the process fails, the package
returns to STAGED.

---

## 3. Transitions

```
                 ┌──────────────────────────────┐
                 │                              │
                 │         ┌─────────┐          │
     create ────→│  STAGED │ ←──────────────────┤ (validation/auth fail)
                 │         └────┬────┘          │
                 │              │ activation     │
                 │              │ requested      │
                 │              ▼                │
                 │       ┌────────────┐         │
                 │       │ VALIDATING │─── fail ─┘
                 │       └─────┬──────┘
                 │             │ pass
                 │             ▼
                 │   ┌──────────────────┐
                 │   │ACTIVATION_PENDING│─── denied ──→ STAGED
                 │   └────────┬─────────┘
                 │            │ authorized
                 │            ▼
                 │      ┌───────────┐
                 │      │ ACTIVATED │
                 │      └──┬────┬───┘
                 │         │    │
                 │  revoke │    │ new version
                 │         ▼    ▼
                 │   ┌─────────┐ ┌────────────┐
                 │   │ REVOKED │ │ SUPERSEDED │
                 │   └────┬────┘ └──────┬─────┘
                 │        │             │
                 │  reactivate     rollback
                 │        │             │
                 │        └──────┬──────┘
                 │               │ (requires governance auth)
                 │               ▼
                 │         ┌───────────┐
                 └────────→│ ACTIVATED │ (re-enters via Phase 1)
                           └───────────┘
```

---

## 4. Transition Definitions

### T-01: STAGED → VALIDATING

**Trigger:** Activation request received.
**Guard:** Package exists in registry with status STAGED.
**Action:** Begin Phase 1–3 validation checks.
**Side effects:** Validation start logged.

### T-02: VALIDATING → STAGED (fail)

**Trigger:** Any validation check (V-01 through V-09) or authorization check
(A-01 through A-05) or eligibility check (E-01 through E-06) fails.
**Guard:** Failure condition detected.
**Action:** Package returns to STAGED status.
**Side effects:** Failure reason logged with specific check ID. Package may
be corrected via new version.

### T-03: VALIDATING → ACTIVATION_PENDING (pass)

**Trigger:** All Phase 1–3 checks pass.
**Guard:** All validation, authorization, and eligibility checks PASSED.
**Action:** Package enters ACTIVATION_PENDING status.
**Side effects:** Readiness for governance authorization logged.

### T-04: ACTIVATION_PENDING → STAGED (denied)

**Trigger:** Governance authorization denied.
**Guard:** Authorization source issues denial.
**Action:** Package returns to STAGED status.
**Side effects:** Denial reason logged. Package can be re-submitted.

### T-05: ACTIVATION_PENDING → ACTIVATED (authorized)

**Trigger:** Governance authorization issued.
**Guard:** Valid authorization source with matching scope.
**Action:**
1. Package status transitions to ACTIVATED
2. Package version is locked
3. SEP_ACTIVATED trigger event emitted
4. Qualification re-evaluation scheduled
**Side effects:** Activation event logged with authorization source.

### T-06: ACTIVATED → REVOKED (revoke)

**Trigger:** Explicit revocation command with reason.
**Guard:**
- No dependent packages block revocation
- OR dependency override authorized by governance
**Action:**
1. Package status transitions to REVOKED
2. Composite state recomputed without this package
3. SEP_REVOKED trigger event emitted
4. Qualification re-evaluation scheduled
**Side effects:** Revocation event logged with timestamp, reason, authority.

### T-07: ACTIVATED → SUPERSEDED (new version)

**Trigger:** New version of the same package passes Phase 1–4 and is ACTIVATED.
**Guard:** New version has strictly higher version number.
**Action:**
1. Current version status transitions to SUPERSEDED
2. New version becomes ACTIVATED
3. SEP_VERSION_UPGRADE trigger event emitted
4. Qualification re-evaluation scheduled
**Side effects:** Supersession event logged. Both versions retained.

### T-08: REVOKED → ACTIVATED (reactivation)

**Trigger:** Governance authorization for reactivation.
**Guard:** Governance review approves reactivation.
**Action:** Package re-enters activation process at Phase 1 (full
re-validation required; state may have changed since revocation).
**Side effects:** Reactivation event logged.

### T-09: SUPERSEDED → ACTIVATED (rollback)

**Trigger:** Governance authorization for version rollback.
**Guard:**
- Target version was previously ACTIVATED or STAGED
- Current version can be superseded
- Governance review approves rollback
**Action:**
1. Current version transitions to SUPERSEDED
2. Target version re-enters activation via Phase 1
3. SEP_VERSION_UPGRADE trigger event emitted
**Side effects:** Rollback event logged.

---

## 5. State Machine Rules

### R-01: Single Active Version

At most ONE version of a given package_id may be ACTIVATED at any time.
If version N is ACTIVATED and version N+1 passes activation, version N
transitions to SUPERSEDED atomically.

### R-02: Transient State Timeout

If a package remains in VALIDATING or ACTIVATION_PENDING beyond the
activation transaction boundary, it automatically returns to STAGED.
No package may be stuck in a transient state.

### R-03: Terminal State Retention

REVOKED and SUPERSEDED packages are never physically deleted. They
remain in the artifact store and package registry for audit, rollback,
and provenance chain integrity.

### R-04: No Direct State Jumps

All transitions must follow the defined paths. There is no direct
path from STAGED to REVOKED, or from SUPERSEDED to REVOKED, etc.
Every activation must pass through the full validation pipeline.

### R-05: Idempotent Transitions

Requesting a transition that has already occurred (e.g., revoking
an already-REVOKED package) is a no-op, not an error. The result
is the current state.

### R-06: Governance Authority Required for Backward Transitions

Transitions T-08 (REVOKED → ACTIVATED) and T-09 (SUPERSEDED → ACTIVATED)
require explicit governance authorization because they re-enable
previously withdrawn or replaced overlay contributions.

---

## 6. State Machine Auditability

Every state transition produces an audit record:

```json
{
  "transition_id": "<uuid>",
  "package_id": "<package>",
  "package_version": "<version>",
  "from_state": "<state>",
  "to_state": "<state>",
  "trigger": "<trigger description>",
  "authorization_source": "<source, if applicable>",
  "timestamp": "<ISO-8601>",
  "reason": "<human-readable reason>",
  "check_results": {
    "validation": "PASSED | FAILED | N/A",
    "authorization": "AUTHORIZED | DENIED | N/A",
    "eligibility": "ELIGIBLE | REJECTED | ESCALATED | N/A"
  }
}
```

The audit trail enables:
- Full reconstruction of any package's state history
- Verification that every transition was governance-authorized
- Attribution of activation decisions to specific authority sources
- Replay of the state machine from initial STAGED to current state
