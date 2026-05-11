# Governance Zone Integration

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how governance zones (SAFE, PRESSURE, RISK, PROHIBITED)
integrate into overlay proposal, review, approval, and activation
governance — ensuring unsafe overlay progression fails closed.

---

## 2. Zone-Phase Interaction Matrix

### 2.1 Proposal Phases by Zone

| Proposal Phase | SAFE | PRESSURE | RISK | PROHIBITED |
|---------------|------|----------|------|-----------|
| 1. Proposal Initiation | PERMITTED | PERMITTED | BLOCKED | BLOCKED |
| 2. Package Selection | STANDARD | CONSTRAINED | BLOCKED | BLOCKED |
| 3. Overlay Classification | PERMITTED | PERMITTED | N/A | N/A |
| 4. Impact Assessment | STANDARD | ENHANCED | N/A | N/A |
| 5. Replay Safety | STANDARD | STANDARD | N/A | N/A |
| 6. Rollback Safety | STANDARD | ENHANCED | N/A | N/A |
| 7. Zone Projection | STANDARD | ENHANCED | N/A | N/A |
| 8. Proposal Submission | PERMITTED | PERMITTED | BLOCKED | BLOCKED |

### 2.2 Review Stages by Zone

| Review Stage | SAFE | PRESSURE | RISK | PROHIBITED |
|-------------|------|----------|------|-----------|
| A. Governance Review | STANDARD | ENHANCED | BLOCKED | BLOCKED |
| B. Qualification Review | STANDARD | STANDARD | BLOCKED | BLOCKED |
| C. Replay/Rollback Review | STANDARD | ENHANCED | BLOCKED | BLOCKED |
| D. Operator Authorization | STANDARD | ENHANCED | BLOCKED | BLOCKED |

### 2.3 Post-Approval Operations by Zone

| Operation | SAFE | PRESSURE | RISK | PROHIBITED |
|-----------|------|----------|------|-----------|
| Activation | PERMITTED | PERMITTED (reduced batch) | BLOCKED | BLOCKED |
| Supersession | PERMITTED | PERMITTED | BLOCKED | BLOCKED |
| Revocation | PERMITTED | PERMITTED | PERMITTED | MANDATORY |
| Retirement | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| De-authorization | PERMITTED | PERMITTED | PERMITTED | PERMITTED |

---

## 3. SAFE Zone Overlay Governance

### 3.1 SAFE Zone Operations

```
Proposal:
  - All proposal phases proceed normally
  - Standard impact assessment
  - Up to 5 packages per batch
  - No enhanced review requirements

Review:
  - Standard 4-stage review pipeline
  - Standard gates at each stage
  - Single operator authorization sufficient

Activation:
  - Full 8-phase activation lifecycle
  - Standard monitoring post-activation
  - Standard replay/rollback verification
```

### 3.2 SAFE Zone Constraints

| Constraint | Limit |
|-----------|-------|
| Batch size | ≤ 5 packages per iteration |
| Total packages | ≤ 10 (architectural limit) |
| Total entries | ≤ 200 (architectural limit) |
| Zone projection | Must remain ≤ PRESSURE after activation |

---

## 4. PRESSURE Zone Overlay Governance

### 4.1 PRESSURE Zone Enhanced Requirements

```
Proposal:
  - Proposal initiation requires pressure acknowledgment
  - Package selection constrained to ≤ 3 per batch
  - Impact assessment must include compound pressure analysis
  - Zone projection receives enhanced scrutiny

Review:
  - Governance review includes compound pressure indicators
  - Rollback review includes cascade risk assessment
  - Operator authorization requires pressure acknowledgment
  - Escalation level G-1 applies

Activation:
  - Reduced batch size (≤ 3)
  - Enhanced monitoring immediately after activation
  - Continuous entropy check post-activation
```

### 4.2 PRESSURE Zone Constraints

| Constraint | Limit |
|-----------|-------|
| Batch size | ≤ 3 packages per iteration |
| Compound pressure check | MANDATORY before each proposal |
| Zone projection | Must not project RISK |
| Operator acknowledgment | Pressure awareness required |
| Escalation level | G-1 (Enhanced) |

### 4.3 PRESSURE Zone Additional Checks

```
BEFORE proposal submission in PRESSURE zone:

  CHECK 1: Compound pressure assessment
    - How many pressure dimensions are ELEVATED?
    - Is this proposal increasing or decreasing pressure?
    - What is the pressure reduction path if activation fails?

  CHECK 2: Recovery readiness
    - Can all proposed overlays be revoked if needed?
    - What is the recovery cost if zone transitions to RISK?
    - Is there a pressure reduction plan?

  CHECK 3: Operator pressure briefing
    - Operator has reviewed compound pressure indicators
    - Operator has acknowledged zone-specific risks
    - Operator has confirmed continuation despite pressure
```

---

## 5. RISK Zone Overlay Governance

### 5.1 RISK Zone Restrictions

```
ALL proposal and approval operations BLOCKED:
  - No new proposals may be initiated
  - No new packages may be selected
  - No new proposals may be submitted
  - No new authorizations may be issued

EXISTING operations:
  - Existing AUTHORIZED proposals: DEFERRED (not rejected)
  - Existing ACTIVATED overlays: remain active
  - Revocation: PERMITTED (pressure reduction)
  - Retirement: PERMITTED (pressure reduction)
  - De-authorization: PERMITTED

Focus:
  - Reduce pressure to return to PRESSURE or SAFE zone
  - Revoke overlays if needed to reduce overlay count
  - Investigate zone entry cause
  - Plan recovery actions
```

### 5.2 RISK Zone Recovery Path

```
TO exit RISK zone:
  1. Identify which indicators triggered RISK classification
  2. Execute recovery actions:
     - Revoke overlays to reduce count ≤ 7
     - Resolve dependency chains to depth ≤ 2
     - Resolve entropy indicators
     - Reduce governance overload to ELEVATED
  3. Verify zone transition to PRESSURE
  4. Resume overlay governance at PRESSURE level
```

---

## 6. PROHIBITED Zone Overlay Governance

### 6.1 PROHIBITED Zone Restrictions

```
ALL overlay governance operations BLOCKED except:
  - Revocation: MANDATORY
  - Retirement: PERMITTED
  - De-authorization: PERMITTED

MANDATORY actions:
  - Reduce pressure to exit PROHIBITED
  - Revoke overlays as needed
  - Resolve architectural violations
  - Resolve structural entropy
  - Resolve replay divergence
  - Resolve baseline contamination

Recovery:
  - PROHIBITED → RISK requires mandatory governance action
  - RISK → PRESSURE requires recovery execution
  - PRESSURE → SAFE requires full indicator resolution
```

---

## 7. Mid-Proposal Zone Changes

### 7.1 Zone Worsens During Proposal

| Current Phase | Zone Change | Impact |
|--------------|-------------|--------|
| Phases 1–3 (construction) | → PRESSURE | Add enhanced review requirements |
| Phases 1–3 (construction) | → RISK | HALT proposal — cannot proceed |
| Phases 4–7 (assessment) | → PRESSURE | Complete assessment with enhanced review |
| Phases 4–7 (assessment) | → RISK | HALT proposal — cannot submit |
| Phase 8 (submission) | → PRESSURE | Submit with pressure acknowledgment |
| Phase 8 (submission) | → RISK | HALT submission — cannot submit |
| Review Stage A–C | → PRESSURE | Continue review at enhanced level |
| Review Stage A–C | → RISK | HALT review — proposal DEFERRED |
| Review Stage D | → PRESSURE | Operator must acknowledge pressure |
| Review Stage D | → RISK | HALT authorization — proposal DEFERRED |

### 7.2 Zone Improves During Proposal

```
IF zone improves (e.g., PRESSURE → SAFE):
  - Continue at current phase with SAFE zone rules
  - Enhanced review requirements no longer apply
  - Batch size constraints may be relaxed

IF zone improves from RISK to PRESSURE:
  - DEFERRED proposals may be resumed
  - Resume at Phase 1 (re-initiate with current zone context)
```

---

## 8. Zone Projection Validation

### 8.1 Pre-Proposal Zone Projection

```
BEFORE proposal construction:
  COMPUTE projected zone after all proposed activations:

  projected = evaluateGovernanceZone(
    overlay_count = current_active + proposed_count,
    entry_count = current_entries + proposed_entries,
    coexistence = N(N-1)/2 where N = projected overlays,
    dependency_depth = max(current, proposed),
    ...remaining indicators
  )

  IF projected > PRESSURE:
    BLOCK proposal initiation
    REPORT: "Proposed activation would project zone to {projected}"
    SUGGEST: "Reduce scope to ≤ {max_packages} packages"
```

### 8.2 Zone Projection Update Points

| Update Point | Why |
|-------------|-----|
| Proposal initiation | Verify zone permits proposals |
| Package selection | Verify batch size is zone-appropriate |
| Impact assessment | Compute projected zone after activation |
| Proposal submission | Final zone projection before submission |
| Governance review | Re-evaluate zone at review time |
| Operator authorization | Final zone check before authorization |
| Activation start | Verify zone still permits activation |

---

## 9. Governance

- SAFE zone permits standard overlay governance with full batch capacity
- PRESSURE zone constrains proposals with reduced batch (≤ 3) and enhanced review
- RISK zone blocks all new proposals — focus on pressure reduction
- PROHIBITED zone mandates revocation — all other overlay operations blocked
- Mid-proposal zone changes trigger immediate governance adjustment
- Zone projection is validated at 7 points from initiation through activation
- Zone projection exceeding PRESSURE blocks proposal initiation
- Every zone-related constraint is auditable and attributable
