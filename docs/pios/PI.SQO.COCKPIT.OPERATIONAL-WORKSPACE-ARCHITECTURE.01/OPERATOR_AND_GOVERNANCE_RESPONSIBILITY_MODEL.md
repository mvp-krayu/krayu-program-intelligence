# Operator and Governance Responsibility Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define which cockpit actions require operator authorization,
governance authorization, certification authorization, or
escalation authorization — ensuring no hidden operational
authority within the cockpit workspace.

---

## 2. Cockpit Authority Domains

### 2.1 Five Cockpit Authority Domains

| # | Domain | Scope | Primary Authority |
|---|--------|-------|-------------------|
| CA-01 | OPERATOR | Workflow initiation, review, investigation | Operator |
| CA-02 | GOVERNANCE | Gate definitions, zone constraints, escalation rules | Governance |
| CA-03 | CERTIFICATION | Replay/rollback pipeline, certification decisions | Certification authority |
| CA-04 | PROMOTION | Authority promotion, publication | Operator + Governance |
| CA-05 | RECOVERY | Rollback execution, sandbox freeze/resume | Operator + Governance |

---

## 3. Action Authorization Matrix

### 3.1 Cockpit Actions by Domain

| # | Action | Workspace Domain | Authorization | Automated? |
|---|--------|-----------------|--------------|-----------|
| 1 | View domain state | Any (WD-01–10) | Operator | N/A (read) |
| 2 | Navigate lineage | Any | Operator | N/A (read) |
| 3 | Initiate evidence intake | WD-02 | Operator | NO |
| 4 | Review trust assessment | WD-02 | Operator | NO |
| 5 | Initiate packaging | WD-02 | Operator | NO |
| 6 | Initiate overlay proposal | WD-03 | Operator | NO |
| 7 | Submit proposal | WD-03 | Operator | NO |
| 8 | Approve governance review | WD-03 | Governance | NO |
| 9 | Approve qualification review | WD-03 | Operator | NO |
| 10 | Authorize overlay activation | WD-03 | Operator + Governance | NO |
| 11 | Initiate replay certification | WD-04 | Operator | NO |
| 12 | Initiate rollback certification | WD-05 | Operator | NO |
| 13 | Review PARTIAL/CONDITIONAL certification | WD-06 | Operator | NO |
| 14 | Authorize authority promotion | WD-07 | Operator + Governance | NO |
| 15 | Authorize publication | WD-07 | Operator + Governance + Cert | NO |
| 16 | Retract publication | WD-07 | Operator + Governance | NO |
| 17 | Acknowledge escalation | WD-08 | Operator | NO |
| 18 | Initiate recovery | WD-10 | Operator + Governance | NO |
| 19 | Execute rollback | WD-10 | Operator + Governance | NO |
| 20 | Freeze sandbox | WD-09 | Automated (G-4) or Operator | PARTIAL |
| 21 | Resume sandbox | WD-09 | Operator + Governance | NO |
| 22 | Resolve quarantine | WD-02/03 | Operator + Investigation | NO |
| 23 | Authorize re-certification | WD-06 | Operator | NO |

### 3.2 Authorization Level Definitions

```
OPERATOR: single operator authorization
  - Sufficient for workflow initiation and review
  - Sufficient for investigation and re-certification

GOVERNANCE: governance authority review
  - Required for gate definitions and zone rule changes
  - Required alongside operator for activation and promotion

OPERATOR + GOVERNANCE: dual authorization
  - Required for authority-changing operations
  - Both must independently authorize

OPERATOR + GOVERNANCE + CERTIFICATION: triple authorization
  - Required for publication (maximum authority change)
  - All three domains must independently authorize

AUTOMATED: system-triggered
  - Sandbox freeze on G-4 escalation (no operator needed)
  - Gate evaluation (deterministic, no judgment)
```

---

## 4. Operator Cannot

### 4.1 Nine Operator Prohibitions in Cockpit

| # | Prohibition | Reason |
|---|------------|--------|
| OP-01 | Override automated gate failures | Gates are deterministic — operator cannot substitute judgment |
| OP-02 | Promote without certification evidence | Certification is prerequisite — no bypass |
| OP-03 | Publish without authority promotion | Authority is prerequisite — no bypass |
| OP-04 | Bypass quarantine without investigation | Investigation is mandatory for quarantine resolution |
| OP-05 | Modify certification evidence | Evidence is write-once, immutable |
| OP-06 | Modify governance zone thresholds | Zone thresholds are governance authority |
| OP-07 | Suppress divergence or ambiguity findings | Findings are system-produced, immutable |
| OP-08 | Execute cross-namespace operations | Sandbox isolation is enforced |
| OP-09 | Modify lineage records | Lineage is append-only, immutable |

---

## 5. Governance Cannot

### 5.1 Six Governance Prohibitions in Cockpit

| # | Prohibition | Reason |
|---|------------|--------|
| GA-01 | Execute certification pipeline | Certification is automated with operator oversight |
| GA-02 | Make individual promotion decisions | Promotion requires operator authorization |
| GA-03 | Override operator investigation findings | Investigation findings are operator authority |
| GA-04 | Modify certification thresholds during active certification | Stability during certification |
| GA-05 | Modify zone thresholds during active escalation | Stability during escalation |
| GA-06 | Access sandbox namespace directly | Sandbox access is through operator workspace |

---

## 6. Cockpit Action Audit Model

### 6.1 Audit Record Per Action

```json
{
  "cockpit_action": {
    "action_id": "ACT-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "action_type": "<from action matrix>",
    "workspace_domain": "WD-XX",
    "operator_id": "<operator>",
    "authorization_level": "OPERATOR | GOVERNANCE | DUAL | TRIPLE",
    "authorizers": ["<operator_id>", "<governance_id>"],
    "prerequisites_verified": true,
    "zone_at_action": "SAFE",
    "outcome": "EXECUTED | BLOCKED | DEFERRED",
    "target_artifact": "<what was affected>",
    "lineage_impact": "<lineage record created>"
  }
}
```

### 6.2 Audit Trail Completeness

```
Every cockpit action produces:
  1. Action record (who, what, when, outcome)
  2. Authorization record (who authorized, at what level)
  3. Prerequisite record (what was verified before execution)
  4. Lineage record (what lineage was created or modified)

No cockpit action executes without all 4 records.
Hidden cockpit actions are architecturally impossible
because the action surface only renders authorized actions.
```

---

## 7. Action Surface Rendering Rules

### 7.1 Conditional Action Visibility

```
The cockpit action surface renders ONLY:

  1. Actions the current operator is authorized to perform
  2. Actions the current governance zone permits
  3. Actions whose prerequisites are met (or approaching met)

Actions not available are:
  - HIDDEN if operator lacks authorization
  - DISABLED with reason if zone blocks
  - DISABLED with reason if prerequisites unmet

This prevents:
  - Operators seeing actions they cannot take
  - Confusion about what is operationally possible
  - Attempts to execute blocked operations
```

### 7.2 Action State Indicators

| Indicator | Meaning |
|-----------|---------|
| AVAILABLE | Action can be executed now |
| DISABLED (zone) | Zone constraint prevents execution |
| DISABLED (prerequisite) | Prerequisite not yet met |
| DISABLED (authorization) | Higher authorization needed |
| IN_PROGRESS | Action is executing |
| COMPLETE | Action completed (shown briefly) |

---

## 8. Governance

- 5 cockpit authority domains: OPERATOR, GOVERNANCE, CERTIFICATION, PROMOTION, RECOVERY
- 23 cockpit actions with defined authorization levels
- Authorization levels: operator, governance, dual, triple, automated
- 9 operator prohibitions, 6 governance prohibitions
- Every cockpit action produces 4 audit records (action, authorization, prerequisite, lineage)
- Action surface renders only authorized, zone-permitted, prerequisite-met actions
- Hidden cockpit actions are architecturally impossible
- No hidden operational authority
- Responsibility model is client-agnostic
