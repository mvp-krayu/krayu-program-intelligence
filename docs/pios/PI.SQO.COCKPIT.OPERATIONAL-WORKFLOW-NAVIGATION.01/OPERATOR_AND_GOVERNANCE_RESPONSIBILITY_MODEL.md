# Operator and Governance Responsibility Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define which navigation operations expose operator actions,
governance actions, certification actions, and escalation actions —
ensuring no hidden workflow authority exists in the navigation model.

---

## 2. Navigation Action Authorization

### 2.1 Navigation Actions (Read-Only)

| # | Action | Authorization | Description |
|---|--------|--------------|-------------|
| NA-01 | View workflow domain | Any authenticated | Navigate to any workflow domain |
| NA-02 | View workflow instance | Any authenticated | View specific workflow detail |
| NA-03 | View gate status | Any authenticated | Inspect gate prerequisites and status |
| NA-04 | View lineage chain | Any authenticated | Navigate lineage in any direction |
| NA-05 | View authority boundary | Any authenticated | Inspect authority state progression |
| NA-06 | View zone status | Any authenticated | View governance zone state |
| NA-07 | View escalation status | Any authenticated | View escalation level and triggers |
| NA-08 | View recovery options | Any authenticated | View available recovery levels |
| NA-09 | View certification matrix | Any authenticated | View per-overlay certification status |
| NA-10 | View event stream | Any authenticated | View filtered workflow events |
| NA-11 | View session lifecycle | Any authenticated | Navigate session state transitions |
| NA-12 | View workflow archive | Any authenticated | Access completed workflow history |

### 2.2 Navigation-Exposed Operator Actions

| # | Exposed Action | Authorization | Navigation Context |
|---|---------------|--------------|-------------------|
| OA-01 | Approve gate (GT-02) | OPERATOR | Gate detail view — approval button visible |
| OA-02 | Initiate replay certification | OPERATOR | Overlay chain view — initiate button visible |
| OA-03 | Initiate rollback certification | OPERATOR | Overlay chain view — initiate button visible |
| OA-04 | Promote to authority | OPERATOR | Certification view — promote button visible |
| OA-05 | Authorize publication | OPERATOR | Publication view — publish button visible |
| OA-06 | Archive session | OPERATOR | Session overview — archive button visible |
| OA-07 | Initiate recovery | OPERATOR | Recovery view — recovery button visible |
| OA-08 | Resolve escalation | OPERATOR | Escalation view — resolve button visible |

### 2.3 Navigation-Exposed Governance Actions

| # | Exposed Action | Authorization | Navigation Context |
|---|---------------|--------------|-------------------|
| GA-01 | Override gate (GT-04) | GOVERNANCE | Gate detail view — override visible at G-3+ |
| GA-02 | Force freeze session | GOVERNANCE | Session overview — freeze visible at G-3+ |
| GA-03 | Revoke session | GOVERNANCE | Session overview — revoke visible at G-4 |
| GA-04 | Override zone constraint | GOVERNANCE | Zone view — override visible with justification |
| GA-05 | Supersede session | DUAL (oper + gov) | Session overview — supersede with dual auth |

---

## 3. Action Visibility Rules

### 3.1 Conditional Action Visibility

| Condition | Visible Actions | Hidden Actions |
|-----------|----------------|----------------|
| Zone: SAFE | All operator actions | None |
| Zone: PRESSURE | OA-01 through OA-08 (with warnings) | None (warnings added) |
| Zone: RISK | OA-01, OA-02, OA-03, OA-07, OA-08 | OA-04, OA-05, OA-06 (frozen) |
| Zone: PROHIBITED | OA-07, OA-08 only | OA-01 through OA-06 (frozen) |
| Escalation: G-0 | All operator actions | None |
| Escalation: G-1 | All operator actions (with alerts) | None (alerts added) |
| Escalation: G-2 | Restricted set (per escalation policy) | Some actions frozen |
| Escalation: G-3+ | Governance actions only | All operator actions frozen |

### 3.2 Action Rendering Rules

```
NAVIGATION ACTION RENDERING

  Visible + Available:
    [Action Button] — standard rendering, clickable

  Visible + Blocked (zone/escalation restriction):
    [Action Button] (BLOCKED: {reason}) — greyed, not clickable
    Tooltip shows: why blocked, what would unblock

  Visible + Pending Prerequisite:
    [Action Button] (PENDING: {prerequisite}) — greyed, not clickable
    Tooltip shows: which prerequisite, current status

  Hidden (no authorization):
    Not rendered — button does not appear

  Action confirmation:
    All operator actions require confirmation dialog
    Governance actions require dual confirmation
```

---

## 4. Operator Navigation Responsibilities

### 4.1 Operator Responsibilities During Navigation

| # | Responsibility |
|---|---------------|
| OR-01 | Navigate to workflow state before taking action (no blind actions) |
| OR-02 | Inspect gate prerequisites before approving gates |
| OR-03 | Review certification evidence before promoting to authority |
| OR-04 | Review publication eligibility before authorizing publication |
| OR-05 | Inspect recovery impact before initiating recovery |
| OR-06 | Check zone state before taking zone-sensitive actions |
| OR-07 | Review escalation context before resolving escalation |

### 4.2 Operator Navigation Prohibitions

| # | Prohibition |
|---|------------|
| OP-01 | Must not take actions without navigating to relevant context |
| OP-02 | Must not approve gates without reviewing prerequisites |
| OP-03 | Must not promote without reviewing combined certification |
| OP-04 | Must not publish without reviewing publication eligibility |
| OP-05 | Must not recover without reviewing impact assessment |
| OP-06 | Must not ignore zone warnings during navigation |
| OP-07 | Must not override escalation without governance authorization |
| OP-08 | Must not navigate to bypass authority boundaries |

---

## 5. Governance Navigation Responsibilities

### 5.1 Governance Responsibilities

| # | Responsibility |
|---|---------------|
| GR-01 | Monitor zone state through zone navigation |
| GR-02 | Monitor escalation triggers through escalation navigation |
| GR-03 | Review operator actions through event stream |
| GR-04 | Verify authority boundary integrity through authority view |
| GR-05 | Verify namespace isolation through session navigation |

### 5.2 Governance Prohibitions

| # | Prohibition |
|---|------------|
| GP-01 | Must not override zone constraints without justification |
| GP-02 | Must not bypass authority boundaries through navigation |
| GP-03 | Must not take operator actions (separation of duties) |
| GP-04 | Must not modify lineage through navigation |
| GP-05 | Must not suppress navigation alerts or warnings |

---

## 6. Audit Trail for Navigation-Initiated Actions

### 6.1 Audit Record Structure

```
Every action initiated from navigation produces 4 audit records:

  Record 1: ACTION_REQUESTED
    - actor, action, timestamp
    - navigation context (domain, instance, view)
    - zone state at request time

  Record 2: AUTHORIZATION_VERIFIED
    - authorization level checked
    - prerequisites verified
    - zone constraints checked

  Record 3: ACTION_EXECUTED
    - execution result
    - state change produced
    - lineage updated

  Record 4: ACTION_CONFIRMED
    - confirmation timestamp
    - post-action state
    - audit hash
```

---

## 7. Governance

- 12 read-only navigation actions (NA-01 through NA-12) — all authenticated
- 8 operator actions exposed through navigation (OA-01 through OA-08)
- 5 governance actions exposed through navigation (GA-01 through GA-05)
- Action visibility conditional on zone state and escalation level
- Action rendering distinguishes available, blocked, pending, and hidden
- 7 operator responsibilities and 8 prohibitions during navigation
- 5 governance responsibilities and 5 prohibitions during navigation
- 4-record audit trail for every action initiated from navigation
- No hidden workflow authority — all actions visible in context
