# Recoverability and Escalation Model

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how lifecycle failures rollback, revoke, recover, quarantine,
and escalate WITHOUT corrupting qualification authority.

---

## 2. Failure Categories

### 2.1 Stage Failure Types

| Category | Examples | Severity |
|----------|----------|----------|
| Evidence failure | Source unavailable, provenance invalid, quality insufficient | LOW — no state change |
| Packaging failure | Entry format invalid, class unauthorized, hash mismatch | LOW — no state change |
| Proposal failure | Zone projection exceeds limit, coexistence conflict | LOW — no state change |
| Approval failure | Operator denies, escalation mismatch | LOW — no state change |
| Activation failure | Phase 1–4 lifecycle check fails | MEDIUM — package remains STAGED |
| Replay failure | Hash divergence, input integrity failure | CRITICAL — sandbox freeze |
| Rollback failure | Round-trip mismatch, cascade exceeds limit | HIGH — governance escalation |
| Certification failure | Governance zone too high, replay incomplete | MEDIUM — certification deferred |
| Publication failure | Disclosure incomplete, certification revoked | MEDIUM — publication blocked |
| Monitoring failure | Entropy detected, overload triggered | HIGH — operational intervention |

### 2.2 Key Insight: No State Change Before Stage 6

Stages 0–5 produce no qualification state changes. Failures in
these stages are LOW severity because they can be retried without
recovery operations. Stage 6+ failures require recovery because
sandbox state has been modified.

---

## 3. Recovery Mechanisms by Stage

### 3.1 Pre-Activation Recovery (Stages 0–5)

| Failure | Recovery | Impact |
|---------|---------|--------|
| Evidence failure | Find alternative evidence, retry Stage 1 | None — no state change |
| Packaging failure | Fix package, retry Stage 2 | None — no state change |
| Proposal failure | Modify proposal, retry Stage 4 | None — no state change |
| Approval denial | Modify proposal, re-submit Stage 5 | None — no state change |

### 3.2 Activation Recovery (Stage 6)

| Failure | Recovery | Impact |
|---------|---------|--------|
| Phase 1 failure (validation) | Fix package, re-submit | Package remains STAGED |
| Phase 2 failure (authorization) | Fix class, re-submit | Package remains STAGED |
| Phase 3 failure (eligibility) | Resolve conflict/limit, re-submit | Package remains STAGED |
| Phase 4 failure (governance) | Address governance concern, re-authorize | Package remains STAGED |
| Post-activation inconsistency | Rollback to RP-PRE-ACTIVATE | Composite reverts |

### 3.3 Verification Recovery (Stages 7–8)

| Failure | Recovery | Impact |
|---------|---------|--------|
| Replay divergence | FREEZE sandbox → investigate → recover from last MATCH | Potential iteration loss |
| Input integrity failure | Identify changed input → remediate → re-verify | Depends on which input |
| Rollback failure | Investigate → may require package restructuring | Potential iteration loss |
| Round-trip failure | Structural entropy → mandatory full reset | Full iteration loss |

### 3.4 Post-Verification Recovery (Stages 9–12)

| Failure | Recovery | Impact |
|---------|---------|--------|
| Assessment inconsistency | Re-compute from replay-verified state | None — recomputation |
| Promotion denied | Address eligibility gaps, re-submit | Certification delayed |
| Certification denied | Address governance conditions, re-submit | Publication delayed |
| Publication failure | Fix disclosure, re-submit | Downstream notification delayed |

### 3.5 Monitoring Recovery (Stage 13)

| Failure | Recovery | Impact |
|---------|---------|--------|
| Zone escalation | Apply zone-appropriate restrictions | Progression may halt |
| Entropy detection | Investigate → selective revocation or reset | Depends on entropy type |
| Overload detection | Reduce pressure (revoke overlays) | Qualification may regress |
| Baseline drift | Close sandbox, create new sandbox | Full restart |

---

## 4. Escalation Model

### 4.1 Escalation Levels in Lifecycle Context

| Level | Lifecycle Impact | Who Is Notified |
|-------|-----------------|-----------------|
| G-0 Standard | Normal progression | Operator (routine) |
| G-1 Enhanced | Compound pressure checks added | Operator (enhanced awareness) |
| G-2 Restricted | New activations blocked | Operator + governance review |
| G-3 Blocked | All forward progression blocked | Governance review board |
| G-4 Emergency | Immediate protective action | Governance emergency response |

### 4.2 Escalation Triggers by Stage

| Stage | G-0 → G-1 | G-1 → G-2 | G-2 → G-3 | G-3 → G-4 |
|-------|-----------|-----------|-----------|-----------|
| 4 | Proposal enters PRESSURE zone | Proposal enters RISK zone | — | — |
| 5 | First dependency declared | Dependency depth 2 | — | — |
| 6 | 6th overlay activated | 8th overlay activated | 10th overlay (limit) | — |
| 7 | — | — | — | Replay divergence |
| 8 | — | Cascade > 3 packages | Round-trip failure | — |
| 13 | Zone → PRESSURE | Zone → RISK | Zone → PROHIBITED | Baseline contamination |

### 4.3 De-Escalation Through Recovery

| Current Level | De-escalation Action | New Level |
|-------------- |---------------------|-----------|
| G-4 | Emergency resolved, root cause identified | G-3 |
| G-3 | PROHIBITED condition resolved (overlays reduced) | G-2 |
| G-2 | RISK condition resolved (zone ≤ PRESSURE) | G-1 |
| G-1 | PRESSURE condition resolved (zone = SAFE) | G-0 |

---

## 5. Quarantine Model

### 5.1 When Quarantine Applies

Quarantine isolates a specific overlay or sandbox operation without
affecting the entire lifecycle:

| Quarantine Target | Trigger | Effect |
|-------------------|---------|--------|
| Single package | Package-specific replay divergence | Package SUSPENDED, not revoked |
| Package group | Dependency chain issue | All packages in chain SUSPENDED |
| Sandbox | Systemic issue (audit chain break) | Sandbox FROZEN |
| Lifecycle iteration | Iteration-level failure | Current iteration paused |

### 5.2 Quarantine vs Revocation

| Property | Quarantine | Revocation |
|----------|-----------|------------|
| Overlay state | SUSPENDED (can be resumed) | REVOKED (terminal) |
| Composite impact | Overlay contributions paused | Overlay contributions removed |
| Audit trail | Quarantine event recorded | Revocation event recorded |
| Recovery path | Investigation + resume OR revoke | New package if needed |
| Qualification impact | Temporarily reduced (backed_count drops) | Permanently reduced (until new overlay) |

---

## 6. Lifecycle Failure Response Protocol

### 6.1 Failure Detection

```
ON failure_event:
  1. CLASSIFY failure (category, severity, stage)
  2. LOG failure in audit trail with full context
  3. DETERMINE appropriate response:
     - LOW severity (Stages 0–5): log and allow retry
     - MEDIUM severity (Stage 6): rollback to pre-activation
     - HIGH severity (Stages 8, 13): governance escalation
     - CRITICAL severity (Stage 7): immediate freeze
```

### 6.2 Failure Response Decision Tree

```
failure_detected:
  │
  ├── Is this a structural failure (E-01 through E-05)?
  │   YES → G-4 emergency → mandatory full reset
  │
  ├── Is this a replay failure?
  │   YES → Freeze sandbox → investigate → recover from last MATCH
  │
  ├── Is this an activation failure?
  │   YES → Package remains STAGED → fix and retry
  │
  ├── Is this a governance zone issue?
  │   YES → Apply zone restrictions → recovery if PROHIBITED
  │
  └── Is this a pre-activation failure (Stages 0–5)?
      YES → Log → retry at failed stage
```

---

## 7. Recovery Guarantees

### 7.1 Always-Recoverable Properties

| Property | Guarantee |
|----------|----------|
| Certified baseline | ALWAYS restorable (hash-verified, immutable) |
| Any prior lifecycle state | ALWAYS restorable (rollback points retained) |
| Audit trail | ALWAYS preserved (append-only) |
| Replay chain | ALWAYS preserved (snapshots retained) |
| Lifecycle instance | ALWAYS trackable (lifecycle_instance.json) |

### 7.2 Recovery Cost by Scenario

| Scenario | Recovery Cost | Lifecycle Impact |
|----------|-------------|------------------|
| Stage 0–5 failure | ZERO (retry) | No iteration loss |
| Single overlay activation failure | LOW (package stays STAGED) | Minor delay |
| Single overlay replay failure | MODERATE (rollback + investigate) | Partial iteration loss |
| Full iteration replay failure | HIGH (iteration rollback) | Full iteration loss |
| Structural entropy | MAXIMUM (full reset) | All iteration progress lost |
| Baseline drift | MAXIMUM (new sandbox) | Fresh lifecycle start |

---

## 8. Governance

- Failures before Stage 6 have ZERO state impact and are freely retryable
- Stage 6+ failures require recovery operations proportional to severity
- Escalation levels map directly to lifecycle stage restrictions
- Quarantine suspends without revoking — allows investigation before decision
- Recovery to certified baseline is ALWAYS possible
- Structural failures require mandatory full reset (no shortcuts)
- Every failure and recovery action is audit-logged
- Lifecycle instance state is always recoverable from audit trail
