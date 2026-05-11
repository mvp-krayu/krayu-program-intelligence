# Certification Rejection and Quarantine

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the rejection and quarantine model for certification failures —
specifying what happens when replay certification, rollback certification,
or combined certification fails, and how failed overlays are managed,
investigated, and potentially re-certified.

---

## 2. Certification Rejection Types

### 2.1 Eight Certification Rejection Types

| # | Type | Trigger | Severity |
|---|------|---------|----------|
| CRJ-01 | Replay hash divergence | Reconstructed hash differs from current | CRITICAL |
| CRJ-02 | Replay non-determinism | Double-replay produces different hashes | CRITICAL |
| CRJ-03 | Replay lineage break | One or more lineage chains incomplete | HIGH |
| CRJ-04 | Rollback hard dependency | Overlay has inbound hard dependencies | HIGH |
| CRJ-05 | Rollback state divergence | Simulated rollback state differs from expected | CRITICAL |
| CRJ-06 | Rollback non-determinism | Double-rollback produces different hashes | CRITICAL |
| CRJ-07 | Cascade safety exceeded | Cascade depth > 3 or size > 5 | HIGH |
| CRJ-08 | Ambiguity blocking | CRITICAL ambiguity in certification inputs | CRITICAL |

### 2.2 Rejection Decision Matrix

| Rejection | Replay Decision | Rollback Decision | Combined Decision |
|-----------|----------------|-------------------|-------------------|
| CRJ-01 | REPLAY_DENIED | N/A | PROMOTION_BLOCKED |
| CRJ-02 | REPLAY_DENIED | N/A | PROMOTION_BLOCKED |
| CRJ-03 | REPLAY_PARTIAL | N/A | PROMOTION_BLOCKED (for affected overlays) |
| CRJ-04 | N/A | ROLLBACK_DENIED | PROMOTION_BLOCKED |
| CRJ-05 | N/A | ROLLBACK_DENIED | PROMOTION_BLOCKED |
| CRJ-06 | N/A | ROLLBACK_DENIED | PROMOTION_BLOCKED |
| CRJ-07 | N/A | ROLLBACK_CONDITIONAL | PROMOTION_RESTRICTED |
| CRJ-08 | REPLAY_FAILED | ROLLBACK_DENIED | PROMOTION_BLOCKED |

---

## 3. Certification Quarantine Model

### 3.1 Quarantine Entry Conditions

| # | Condition | Quarantine Type |
|---|-----------|----------------|
| CQ-01 | CRITICAL rejection (CRJ-01, CRJ-02, CRJ-05, CRJ-06, CRJ-08) | IMMEDIATE_QUARANTINE |
| CQ-02 | Repeated HIGH rejection (same overlay, ≥ 2 attempts) | INVESTIGATION_QUARANTINE |
| CQ-03 | Post-promotion divergence detected | AUTHORITY_QUARANTINE |
| CQ-04 | Cross-overlay contamination suspected | BATCH_QUARANTINE |

### 3.2 Quarantine States

```
ACTIVE
  │  Overlay in normal certification lifecycle
  ▼
CERTIFICATION_QUARANTINED
  │  Overlay blocked from certification attempts
  │  Investigation required before re-attempt
  ▼
INVESTIGATION_IN_PROGRESS
  │  Root cause analysis underway
  ▼
One of:
  ├→ QUARANTINE_RESOLVED
  │    Root cause identified and fixed
  │    Overlay may re-enter certification
  │
  ├→ QUARANTINE_CONFIRMED
  │    Overlay is fundamentally flawed
  │    Must be REVOKED or SUPERSEDED
  │
  └→ QUARANTINE_EXPIRED
       Investigation timeout exceeded
       Escalation to next governance level
```

### 3.3 Quarantine Scope

| Quarantine Type | Scope | Affected Overlays |
|----------------|-------|-------------------|
| IMMEDIATE_QUARANTINE | Single overlay | Only the failing overlay |
| INVESTIGATION_QUARANTINE | Single overlay | Only the failing overlay |
| AUTHORITY_QUARANTINE | Single overlay + dependents | Failing overlay + soft dependents |
| BATCH_QUARANTINE | Batch group | All overlays activated in same batch |

---

## 4. Investigation Protocol

### 4.1 Investigation Process

```
STEP 1: Record quarantine entry
  quarantine_record = {
    quarantine_id: "CQUA-<client>-<run_id>-<seq>",
    overlay_id: "<package_id>",
    quarantine_type: "<type>",
    entry_condition: "CQ-XX",
    rejection_type: "CRJ-XX",
    timestamp: now(),
    status: "INVESTIGATION_IN_PROGRESS"
  }

STEP 2: Classify investigation scope
  IF rejection IN [CRJ-01, CRJ-05]:
    → State divergence investigation
    → Run divergence root cause analysis (RC-01 through RC-07)
  IF rejection IN [CRJ-02, CRJ-06]:
    → Non-determinism investigation
    → Run triple-execution verification
    → Inspect reconstruction primitives
  IF rejection IN [CRJ-03]:
    → Lineage investigation
    → Trace broken chains
    → Identify missing lineage records
  IF rejection IN [CRJ-04]:
    → Dependency investigation
    → Map complete dependency graph
    → Identify hard dependency source
  IF rejection IN [CRJ-08]:
    → Input investigation
    → Verify all 6 replay inputs retrievable
    → Resolve ambiguities

STEP 3: Execute investigation
  investigation_log = []
  FOR each investigation step:
    EXECUTE step
    RECORD finding
    investigation_log.push(finding)

STEP 4: Determine resolution
  IF root cause identified AND fixable:
    → QUARANTINE_RESOLVED
    → Record fix
    → Overlay may re-enter certification
  IF root cause identified AND NOT fixable:
    → QUARANTINE_CONFIRMED
    → Overlay must be REVOKED or SUPERSEDED
  IF root cause NOT identified within timeout:
    → QUARANTINE_EXPIRED
    → Escalate

STEP 5: Record investigation outcome
  investigation_record = {
    investigation_id: "CINV-<client>-<run_id>-<seq>",
    quarantine_ref: quarantine_record.quarantine_id,
    root_cause: "RC-XX" | null,
    findings: investigation_log,
    resolution: "RESOLVED | CONFIRMED | EXPIRED",
    recommended_action: "<action>"
  }
```

### 4.2 Investigation Timeouts

| Quarantine Type | Timeout | Extension | Maximum |
|----------------|---------|-----------|---------|
| IMMEDIATE_QUARANTINE | 7 days | 1 extension of 7 days | 14 days |
| INVESTIGATION_QUARANTINE | 14 days | 1 extension of 7 days | 21 days |
| AUTHORITY_QUARANTINE | 3 days | No extension | 3 days |
| BATCH_QUARANTINE | 7 days | 1 extension of 7 days | 14 days |

---

## 5. Re-Certification Workflow

### 5.1 Re-Certification Prerequisites

| # | Prerequisite | Description |
|---|-------------|-------------|
| RC-01 | Quarantine resolved | QUARANTINE_RESOLVED status |
| RC-02 | Root cause documented | Investigation record complete |
| RC-03 | Fix verified | Root cause fix has been applied and verified |
| RC-04 | No new ambiguity | Inputs are complete and unambiguous |
| RC-05 | Operator authorization | Operator approves re-certification attempt |

### 5.2 Re-Certification Process

```
STEP 1: Verify prerequisites
  FOR each prerequisite RC-01 through RC-05:
    CHECK condition
    IF any fails:
      → RE-CERTIFICATION BLOCKED
      → Record blocking prerequisite

STEP 2: Re-execute certification pipeline
  IF original rejection was replay:
    → Re-execute full 6-phase replay certification
  IF original rejection was rollback:
    → Re-execute full 5-phase rollback certification
  IF original rejection was combined:
    → Re-execute both

STEP 3: Compare with previous attempt
  IF re-certification succeeds:
    → Record re-certification success
    → Link to original rejection and investigation
    → Overlay proceeds to promotion eligibility
  IF re-certification fails with SAME rejection type:
    → QUARANTINE_CONFIRMED (pattern detected)
    → Overlay must be REVOKED or SUPERSEDED
  IF re-certification fails with DIFFERENT rejection type:
    → New IMMEDIATE_QUARANTINE
    → New investigation required
```

### 5.3 Re-Certification Limits

| Limit | Value | On Exceed |
|-------|-------|-----------|
| Maximum re-certification attempts | 3 | Overlay must be REVOKED or SUPERSEDED |
| Minimum time between attempts | 24 hours | Enforced by certification pipeline |
| Maximum total certification time | 30 days | QUARANTINE_EXPIRED if exceeded |

---

## 6. Post-Promotion Failure Handling

### 6.1 Post-Promotion Divergence

```
IF divergence detected after authority promotion:
  STEP 1: AUTHORITY_QUARANTINE (immediate)
  STEP 2: Freeze overlay's authority contributions
  STEP 3: Recompute authority metrics without overlay
  STEP 4: Investigate divergence source
  STEP 5: Resolution:
    IF divergence was transient (e.g., timing issue):
      → Re-certify, re-promote
    IF divergence reveals fundamental flaw:
      → Revoke authority promotion
      → Revoke overlay (supersession/revocation workflow)
      → Recompute authority state
```

### 6.2 Post-Promotion Impact Assessment

| Impact | Action |
|--------|--------|
| No S-state change | Re-certify and re-promote |
| S-state regression (to certified state) | Accept regression, re-certify |
| S-state regression (to uncertified state) | CRITICAL — full investigation |
| Publication already occurred | CRITICAL — publication retraction assessment |
| No publication | Standard re-certification path |

---

## 7. Rejection and Quarantine Records

### 7.1 Rejection Record

```json
{
  "certification_rejection": {
    "rejection_id": "CREJ-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "rejection_type": "CRJ-XX",
    "severity": "CRITICAL | HIGH",
    "overlay_id": "<package_id>",
    "certification_type": "REPLAY | ROLLBACK | COMBINED",
    "certification_ref": "RCERT-<ref> | RBCERT-<ref> | CERT-<ref>",
    "details": "<specific failure description>",
    "quarantine_triggered": true,
    "quarantine_ref": "CQUA-<ref>"
  }
}
```

### 7.2 Quarantine Record

```json
{
  "certification_quarantine": {
    "quarantine_id": "CQUA-<client>-<run_id>-<seq>",
    "overlay_id": "<package_id>",
    "quarantine_type": "IMMEDIATE | INVESTIGATION | AUTHORITY | BATCH",
    "entry_condition": "CQ-XX",
    "entry_timestamp": "<ISO-8601>",
    "timeout": "<ISO-8601>",
    "status": "INVESTIGATION_IN_PROGRESS | RESOLVED | CONFIRMED | EXPIRED",
    "investigation_ref": "CINV-<ref>",
    "resolution_timestamp": "<ISO-8601>",
    "re_certification_attempts": 0,
    "scope": ["<affected overlay ids>"]
  }
}
```

---

## 8. Governance

- 8 certification rejection types cover all replay and rollback failure modes
- 4 quarantine entry conditions with defined scope
- Quarantine states: CERTIFICATION_QUARANTINED → INVESTIGATION → RESOLVED/CONFIRMED/EXPIRED
- Investigation protocol with root cause analysis and timeouts (3–21 days by type)
- Re-certification limited to 3 attempts with 24-hour minimum interval
- Post-promotion failure triggers AUTHORITY_QUARANTINE (immediate, 3-day timeout)
- All rejections, quarantines, and investigations produce persistent auditable records
- QUARANTINE_CONFIRMED overlays must be REVOKED or SUPERSEDED
- No re-certification without resolved quarantine and documented root cause
- Rejection and quarantine model is client-agnostic
