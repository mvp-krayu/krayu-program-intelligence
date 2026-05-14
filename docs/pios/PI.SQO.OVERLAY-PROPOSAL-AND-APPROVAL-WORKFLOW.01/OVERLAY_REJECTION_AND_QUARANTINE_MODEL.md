# Overlay Rejection and Quarantine Model

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how overlay proposals are rejected, quarantined, escalated,
and recovered — ensuring rejected overlays cannot influence
qualification evolution and quarantined overlays have structured
recovery paths.

---

## 2. Rejection Model

### 2.1 Rejection Triggers

| Trigger | Review Stage | Severity |
|---------|-------------|----------|
| Governance gate failure | Stage A | STANDARD — fixable |
| Zone projection exceeds PRESSURE | Stage A | STANDARD — wait or reduce scope |
| Fail-closed condition active | Stage A | HIGH — resolve FC condition first |
| Qualification impact invalid | Stage B | STANDARD — revise impact assessment |
| Domain oversaturated | Stage B | STANDARD — change target domains |
| Confidence insufficient | Stage B | STANDARD — obtain stronger evidence |
| Replay safety check fails | Stage C | MEDIUM — investigate non-determinism |
| Rollback safety check fails | Stage C | MEDIUM — restructure packages |
| Operator denies | Stage D | STANDARD — operator decision |
| Escalation level blocks | Stage D | HIGH — resolve escalation condition |

### 2.2 Rejection Types

| Type | Definition | Recovery Path |
|------|-----------|---------------|
| GATE_REJECTION | Governance gate evaluation fails | Address gate condition, re-submit |
| ZONE_REJECTION | Governance zone blocks proposal | Wait for zone recovery or reduce scope |
| SAFETY_REJECTION | Replay or rollback safety fails | Restructure packages, fix non-determinism |
| QUALIFICATION_REJECTION | Impact assessment invalid or insufficient | Revise evidence, re-assess impact |
| OPERATOR_REJECTION | Operator denies authorization | Modify proposal per operator feedback |
| ESCALATION_REJECTION | Escalation level prevents authorization | Wait for de-escalation |

### 2.3 Rejection Record

```json
{
  "rejection_record": {
    "proposal_id": "PROP-blueedge-CLU-04-003",
    "rejection_type": "ZONE_REJECTION",
    "review_stage": "A",
    "timestamp": "<ISO-8601>",
    "reason": "Zone projection: SAFE → RISK (8 overlays projected)",
    "gate_id": "G-ZONE-PROPOSAL",
    "recovery_path": "Reduce proposal to ≤ 2 packages to project SAFE → PRESSURE",
    "rejection_is_terminal": false
  }
}
```

### 2.4 Rejection Rules

| Rule | Description |
|------|------------|
| Rejected proposals are IMMUTABLE | Cannot be modified after rejection |
| Rejection reason is MANDATORY | No silent rejection allowed |
| Recovery path is MANDATORY | Must state how to address rejection |
| Rejected proposals remain in registry | Audit trail preserved |
| Rejected overlays have ZERO qualification impact | No influence on any metric |
| Re-submission creates NEW proposal | Modified version gets new proposal_id |

---

## 3. Quarantine Model

### 3.1 Quarantine vs Rejection

| Property | Quarantine | Rejection |
|----------|-----------|-----------|
| State | SUSPENDED (investigation pending) | REJECTED (decision made) |
| Recovery possible | YES — investigation may resolve | YES — new proposal |
| Qualification impact | ZERO (suspended) | ZERO (rejected) |
| Audit trail | Quarantine event + investigation | Rejection event + reason |
| Operator action needed | Investigation and resolution | Address rejection and re-submit |

### 3.2 Overlay Quarantine Triggers

| Trigger | Severity | Scope |
|---------|----------|-------|
| Evidence trust violation post-approval | HIGH | Single package or entire proposal |
| Source material integrity failure | HIGH | All packages from affected source |
| Lineage chain break detected | HIGH | Affected entries in proposal |
| Replay divergence during verification | CRITICAL | Entire proposal + sandbox freeze |
| Source conflict with existing overlay | MEDIUM | Conflicting entries only |
| Operator trust concern reported | MEDIUM | Operator-specified scope |

### 3.3 Quarantine States

```
ACTIVE proposal/overlay
    │
    ▼ (quarantine trigger detected)
QUARANTINED
    │
    ├─→ INVESTIGATION (active investigation underway)
    │       │
    │       ├─→ RESOLVED (condition fixed → resume)
    │       │       │
    │       │       └─→ back to pre-quarantine state
    │       │
    │       └─→ CONFIRMED (violation confirmed → reject or revoke)
    │               │
    │               ├─→ REJECTED (proposal rejected)
    │               │
    │               └─→ REVOKED (if overlay was activated)
    │
    └─→ EXPIRED (investigation timeout → forced decision)
```

### 3.4 Quarantine Investigation Protocol

```
ON overlay quarantine:

  STEP 1: Scope determination
    - Which packages are affected?
    - Which entries are affected?
    - Is the proposal affected or a specific overlay?
    - If overlay is ACTIVATED: what is the qualification impact?

  STEP 2: Investigation
    - Examine quarantine trigger in detail
    - Verify whether trust violation is confirmed
    - Determine if violation can be remediated
    - Record investigation findings

  STEP 3: Resolution decision
    IF violation is false positive:
      → RESOLVE quarantine
      → Restore overlay/proposal to prior state
      → Record resolution rationale
    IF violation is confirmed but remediable:
      → Remediate (re-verify source, re-establish lineage)
      → Re-assess trust level
      → RESOLVE if trust restored
    IF violation is confirmed and non-remediable:
      → CONFIRM violation
      → REJECT proposal OR REVOKE overlay
      → Record permanent rejection reason

  STEP 4: Post-quarantine audit
    - Record full investigation timeline
    - Record resolution decision and rationale
    - Update governance observability
```

### 3.5 Quarantine Impact on Active Overlays

| Overlay State | Quarantine Impact | Qualification Impact |
|---------------|------------------|---------------------|
| STAGED (not yet activated) | Package suspended, cannot activate | ZERO — no qualification change |
| ACTIVATED (in sandbox) | Overlay SUSPENDED, contributions paused | backed_count may decrease temporarily |
| CERTIFIED | Certification SUSPENDED pending investigation | Published authority remains until revocation |

### 3.6 Quarantine Timeouts

| Quarantine Type | Investigation Window | Escalation After |
|----------------|---------------------|-----------------|
| Evidence trust violation | 30 days | G-1 → G-2 escalation |
| Source integrity failure | 14 days | G-2 escalation if unresolved |
| Lineage chain break | 14 days | G-2 escalation if unresolved |
| Replay divergence | 7 days | G-4 immediate (already critical) |
| Source conflict | No fixed deadline | Operator decision required |

---

## 4. Escalation From Rejection/Quarantine

### 4.1 Escalation Triggers

| From State | Escalation Trigger | To Level |
|-----------|-------------------|----------|
| REJECTED (GATE) | 3rd consecutive rejection for same condition | G-0 → G-1 |
| REJECTED (SAFETY) | Replay safety failure | G-0 → G-1 |
| QUARANTINED | Trust violation in ACTIVATED overlay | G-1 → G-2 |
| QUARANTINED | Replay divergence | Any → G-4 |
| QUARANTINED | Investigation timeout exceeded | Current → Current+1 |

### 4.2 Escalation Impact on Proposals

| Level | Impact on New Proposals | Impact on Existing Proposals |
|-------|------------------------|----------------------------|
| G-0 | Standard operations | Standard review |
| G-1 | Enhanced review required | Enhanced review for pending |
| G-2 | New proposals BLOCKED | Existing proposals DEFERRED |
| G-3 | All proposals BLOCKED | All proposals DEFERRED |
| G-4 | Pipeline FROZEN | All proposals FROZEN |

---

## 5. Re-Entry After Rejection

### 5.1 Re-Entry Process

```
AFTER proposal rejection:

  STEP 1: Operator addresses rejection reason
    - Fix gate condition
    - Restructure packages
    - Obtain stronger evidence
    - Wait for zone recovery

  STEP 2: Create NEW proposal
    - New proposal_id (not modification of rejected one)
    - May reference rejected proposal_id for context
    - Must pass all gates from Phase 1

  STEP 3: Submit for review
    - Full review pipeline (Stages A–D)
    - No shortcuts from prior review
    - Rejection history visible in registry
```

### 5.2 Re-Entry After Quarantine Resolution

```
AFTER quarantine resolution (RESOLVED):

  IF proposal was SUBMITTED (not yet approved):
    - Proposal returns to UNDER_REVIEW state
    - Re-enters review at Stage A (governance review)
    - Previous review results are invalidated (must re-review)

  IF overlay was ACTIVATED:
    - Overlay returns to ACTIVATED state
    - Qualification contributions resume
    - Replay verification re-executed to confirm state consistency
```

---

## 6. Governance

- 6 rejection types cover all review stage failure scenarios
- Rejected proposals have ZERO qualification impact and are immutable
- Quarantine separates investigation from decision (SUSPENDED vs REJECTED)
- Quarantine investigation protocol ensures structured resolution
- Quarantine timeouts prevent indefinite suspension
- Escalation from rejection/quarantine follows defined trigger rules
- Re-entry after rejection requires new proposal (no modification of rejected)
- Re-entry after quarantine resolution re-enters review pipeline
- Every rejection and quarantine event is fully auditable
