# Operator and Governance Responsibility Model

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define which sandbox session operations require operator
authorization, governance authorization, certification
authorization, or escalation authorization — ensuring no
hidden sandbox authority.

---

## 2. Session Action Authorization Matrix

### 2.1 Twenty-Two Session Actions

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| 1 | Create session | Operator | SAFE, PRESSURE |
| 2 | Activate session | Operator | SAFE, PRESSURE |
| 3 | View session state | Operator | Always |
| 4 | Activate overlay | Operator | SAFE, PRESSURE |
| 5 | View overlay chain | Operator | Always |
| 6 | Initiate replay certification | Operator | SAFE, PRESSURE |
| 7 | Initiate rollback certification | Operator | SAFE, PRESSURE |
| 8 | View certification status | Operator | Always |
| 9 | Review PARTIAL/CONDITIONAL cert | Operator | Always |
| 10 | Authorize authority promotion | Operator + Governance | SAFE, PRESSURE |
| 11 | Execute overlay rollback | Operator + Governance | SAFE, PRESSURE, RISK |
| 12 | Execute overlay revocation | Operator + Governance | Always |
| 13 | Simulate rollback impact | Operator | SAFE, PRESSURE |
| 14 | Freeze session | Operator or Automated | Always |
| 15 | Resume session | Operator + Governance | SAFE, PRESSURE |
| 16 | Archive session | Operator | SAFE, PRESSURE, RISK |
| 17 | Supersede session | Operator + Governance | SAFE, PRESSURE |
| 18 | Navigate lineage | Operator | Always |
| 19 | View zone status | Operator | Always |
| 20 | Acknowledge escalation | Operator | Always |
| 21 | Initiate recovery (R-01/02) | Operator | SAFE, PRESSURE, RISK |
| 22 | Initiate recovery (R-03/04/05) | Operator + Governance | Any (recovery) |

---

## 3. Operator Responsibilities

### 3.1 Operator MUST

| # | Responsibility |
|---|---------------|
| OR-01 | Create sessions only for authorized client+run combinations |
| OR-02 | Activate overlays only through governed proposal workflow |
| OR-03 | Review certification results before promotion decisions |
| OR-04 | Acknowledge all escalations within defined timeframes |
| OR-05 | Lead investigation for session quarantines |
| OR-06 | Assess recovery impact before executing recovery |
| OR-07 | Document session archive decisions |

### 3.2 Operator MUST NOT

| # | Prohibition |
|---|------------|
| OP-01 | Bypass certification pipeline for authority promotion |
| OP-02 | Modify session namespace boundaries |
| OP-03 | Transfer state between sessions |
| OP-04 | Suppress divergence or ambiguity findings |
| OP-05 | Override automated zone constraints |
| OP-06 | Access sessions belonging to other clients |
| OP-07 | Modify certification evidence or lineage records |
| OP-08 | Execute recovery without impact assessment |

---

## 4. Governance Responsibilities

### 4.1 Governance MUST

| # | Responsibility |
|---|---------------|
| GR-01 | Co-authorize all authority promotions |
| GR-02 | Co-authorize session supersession |
| GR-03 | Authorize session resume from FROZEN/ESCALATED |
| GR-04 | Co-authorize major recovery (R-03/04/05) |
| GR-05 | Review escalation responses |

### 4.2 Governance MUST NOT

| # | Prohibition |
|---|------------|
| GA-01 | Create or activate sessions (operator responsibility) |
| GA-02 | Execute certification pipelines directly |
| GA-03 | Override operator investigation findings |
| GA-04 | Modify session state directly |
| GA-05 | Modify zone thresholds during active session operations |

---

## 5. Session Audit Model

### 5.1 Per-Action Audit Record

```json
{
  "session_action_audit": {
    "action_id": "SACT-<session_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "session_ref": "SBX-<client>-<run_id>",
    "action_type": "<from action matrix>",
    "operator_id": "<operator>",
    "authorization_level": "OPERATOR | DUAL | AUTOMATED",
    "authorizers": ["<ids>"],
    "zone_at_action": "SAFE",
    "session_state_before": "<state>",
    "session_state_after": "<state>",
    "outcome": "EXECUTED | BLOCKED | DEFERRED",
    "impact": "<description of state change>"
  }
}
```

### 5.2 Audit Completeness

```
Every session action produces:
  1. Action record (who, what, when, outcome)
  2. Authorization record (who authorized)
  3. State change record (before/after)
  4. Impact record (what changed in session)

No session action executes without all 4 records.
```

---

## 6. Governance

- 22 session actions with defined authorization levels
- 7 operator responsibilities, 8 operator prohibitions
- 5 governance responsibilities, 5 governance prohibitions
- Every action produces 4 audit records
- No hidden sandbox authority
- Responsibility model is client-agnostic
