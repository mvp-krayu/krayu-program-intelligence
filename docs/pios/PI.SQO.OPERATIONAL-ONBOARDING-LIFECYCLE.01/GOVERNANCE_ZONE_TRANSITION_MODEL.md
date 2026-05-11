# Governance Zone Transition Model

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how governance zones (SAFE, PRESSURE, RISK, PROHIBITED)
integrate into the operational onboarding lifecycle — how zone
transitions affect stage progression, what operations are permitted
in each zone, and how the lifecycle responds to zone changes.

---

## 2. Zone-Stage Interaction Matrix

### 2.1 Stage Permissions by Zone

| Stage | SAFE | PRESSURE | RISK | PROHIBITED |
|-------|------|----------|------|-----------|
| 0. Intake | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 1. Evidence | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 2. Packaging | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 3. Review | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 4. Proposal | PERMITTED | ENHANCED REVIEW | RESTRICTED | BLOCKED |
| 5. Approval | STANDARD | ENHANCED | ESCALATED | BLOCKED |
| 6. Activation | PERMITTED | ENHANCED REVIEW | BLOCKED | BLOCKED |
| 7. Replay | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 8. Rollback | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 9. Assessment | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 10. Promotion | PERMITTED | PERMITTED | RESTRICTED | BLOCKED |
| 11. Certification | PERMITTED | PERMITTED | BLOCKED | BLOCKED |
| 12. Publication | PERMITTED | PERMITTED | BLOCKED | BLOCKED |
| 13. Monitoring | PERMITTED | ENHANCED | CONTINUOUS | CONTINUOUS |
| 14. Recovery | PERMITTED | PERMITTED | PERMITTED | MANDATORY |

### 2.2 Key Restrictions

**RISK zone restrictions:**
- No NEW overlay activations (Stage 6 BLOCKED)
- No certification (Stage 11 BLOCKED)
- No publication (Stage 12 BLOCKED)
- Existing overlay operations (replay, rollback, recovery) still permitted

**PROHIBITED zone restrictions:**
- All forward progression BLOCKED (Stages 4–6, 10–12)
- Only assessment, monitoring, and recovery permitted
- Recovery is MANDATORY (must reduce pressure to exit PROHIBITED)

---

## 3. Zone Transition Detection

### 3.1 Transition Triggers

| Transition | Trigger | Detection Point |
|-----------|---------|----------------|
| SAFE → PRESSURE | 6th overlay, or compound pressure 3+ indicators ELEVATED | Before Stage 4 (Proposal) or Stage 6 (Activation) |
| PRESSURE → RISK | 8th overlay, or overload OVERLOADED, or 4+ observability degraded | Before Stage 6 (Activation) or during Stage 13 (Monitoring) |
| RISK → PROHIBITED | Architectural limit, circular dependency, structural entropy | Before Stage 6 (Activation) or during Stage 13 (Monitoring) |
| PRESSURE → SAFE | Overlay count ≤ 5, all indicators NORMAL | After Stage 14 (Recovery) or Stage 6 (Activation revocation) |
| RISK → PRESSURE | Overlay count ≤ 7, overload ≤ ELEVATED | After Stage 14 (Recovery) |
| PROHIBITED → RISK | Architectural violation resolved, structural entropy cleared | After Stage 14 (Recovery) |

### 3.2 Transition Detection Protocol

```
BEFORE each governance-sensitive stage (4, 5, 6, 10, 11, 12):
  COMPUTE current_zone = evaluateGovernanceZone(sandbox_state)
  IF current_zone > last_known_zone:
    LOG zone transition event
    APPLY new zone restrictions
    IF new zone BLOCKS current stage:
      HALT — fail closed with zone violation
  IF current_zone < last_known_zone:
    LOG zone de-escalation event
    RELAX restrictions to new zone level
```

---

## 4. Zone-Aware Lifecycle Behavior

### 4.1 SAFE Zone Lifecycle

```
Standard operational flow:
  Stages 0–14 proceed normally
  All governance gates at standard level
  Escalation level: G-0 (Standard)
  Monitoring: periodic
  
Progression capacity:
  Up to 5 new overlays per iteration
  Certification and publication permitted
  Standard governance cadence
```

### 4.2 PRESSURE Zone Lifecycle

```
Enhanced operational flow:
  Stages 0–3: proceed normally
  Stage 4: compound pressure check mandatory
  Stage 5: enhanced review with pressure indicators
  Stage 6: enhanced review, reduced batch size (≤3)
  Stages 7–9: proceed normally
  Stage 10: promotion review with pressure context
  Stage 11: certification permitted (if zone stable)
  Stage 12: publication permitted (if certified)
  Stage 13: enhanced monitoring (continuous indicators)
  Stage 14: recovery prepared (pressure reduction plan)

Escalation level: G-1 (Enhanced)
Progression capacity: up to 3 new overlays per iteration
```

### 4.3 RISK Zone Lifecycle

```
Restricted operational flow:
  Stages 0–3: proceed normally (assessment only)
  Stages 4–6: BLOCKED (no new activations)
  Stages 7–8: proceed normally (verification continues)
  Stage 9: assessment produces pressure reduction recommendations
  Stage 10: promotion RESTRICTED (requires explicit governance review)
  Stages 11–12: BLOCKED
  Stage 13: continuous intensive monitoring
  Stage 14: ACTIVE (pressure reduction mandatory)

Escalation level: G-2 (Restricted)
Progression capacity: ZERO new overlays
Primary activity: assessment, monitoring, recovery
```

### 4.4 PROHIBITED Zone Lifecycle

```
Emergency operational flow:
  Stages 0–3: permitted (assessment only)
  Stages 4–12: ALL BLOCKED
  Stage 13: continuous emergency monitoring
  Stage 14: MANDATORY recovery

Escalation level: G-3 or G-4
Progression capacity: ZERO
Primary activity: mandatory recovery to exit PROHIBITED
```

---

## 5. Zone Transition Impact on Active Iterations

### 5.1 Mid-Iteration Zone Change

If the governance zone changes DURING an active iteration:

| Current Stage | Zone Worsened To | Impact |
|--------------|-----------------|--------|
| Stage 1–3 (pre-activation) | PRESSURE | Continue with enhanced review at Stage 4 |
| Stage 1–3 (pre-activation) | RISK | Complete assessment, no activation |
| Stage 4–5 (proposal/approval) | PRESSURE | Reduce batch size, enhanced review |
| Stage 4–5 (proposal/approval) | RISK or above | HALT — fail closed |
| Stage 6 (activation in progress) | PRESSURE | Complete current activation, no further |
| Stage 6 (activation in progress) | RISK or above | HALT — rollback current activation |
| Stage 7–9 (verification) | Any | Complete verification (always permitted) |
| Stage 10–12 (promotion/cert/pub) | RISK or above | HALT — certification blocked |

### 5.2 Zone Recovery During Iteration

If recovery reduces the zone during an iteration:

```
IF zone drops from PRESSURE to SAFE:
  Resume normal iteration cadence
  
IF zone drops from RISK to PRESSURE:
  Resume at Stage 4 (Proposal) with enhanced review
  
IF zone drops from PROHIBITED to RISK:
  Resume at Stage 14 (Recovery) until zone ≤ PRESSURE
```

---

## 6. Zone Transition Audit

Every zone transition produces a lifecycle audit event:

```json
{
  "lifecycle_zone_transition": {
    "from_zone": "SAFE",
    "to_zone": "PRESSURE",
    "trigger": "6th overlay activated",
    "current_stage": 6,
    "current_iteration": 2,
    "impact": "Enhanced review required for future activations",
    "lifecycle_restrictions_applied": [
      "Stage 4: compound pressure check mandatory",
      "Stage 5: enhanced review with pressure indicators",
      "Stage 6: reduced batch size (≤3)"
    ],
    "escalation_level_change": "G-0 → G-1"
  }
}
```

---

## 7. Governance

- Governance zones constrain lifecycle progression at Stages 4–6 and 10–12
- RISK and PROHIBITED zones block new activations and certification
- Zone transitions are detected before governance-sensitive stages
- Mid-iteration zone changes trigger immediate lifecycle adjustment
- Verification stages (7–9) are ALWAYS permitted regardless of zone
- Recovery (Stage 14) is ALWAYS permitted and MANDATORY in PROHIBITED zone
- Zone transition audit events ensure governance visibility
