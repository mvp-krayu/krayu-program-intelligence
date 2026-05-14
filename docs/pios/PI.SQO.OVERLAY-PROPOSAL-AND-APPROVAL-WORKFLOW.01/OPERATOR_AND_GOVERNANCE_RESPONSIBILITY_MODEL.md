# Operator and Governance Responsibility Model

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define which overlay proposal and approval operations require
operator authority, governance authority, or certification authority —
ensuring no hidden semantic authority exists in the overlay
governance workflow.

---

## 2. Authority Domains for Overlay Governance

### 2.1 Four Authority Domains

| Domain | Owner | Overlay Governance Scope |
|--------|-------|------------------------|
| OPERATOR | Human operator | Proposal initiation, package selection, authorization, revocation request, de-authorization |
| GOVERNANCE | Governance framework | Gate evaluation, zone enforcement, replay/rollback review, fail-closed rules |
| CERTIFICATION | Certification authority | Promotion eligibility, certification readiness, publication authorization |
| SANDBOX | Sandbox engine | Activation execution, replay verification, rollback verification, composite computation |

### 2.2 Authority Principle

**No domain exercises another domain's authority within overlay
governance.** Operator decides WHAT to propose. Governance decides
WHETHER it is safe. Sandbox executes HOW. Certification validates
WHETHER result meets authority standards.

---

## 3. Per-Phase Authority Assignment

### 3.1 Proposal Pipeline Authority

| Phase | Primary Authority | Actions |
|-------|------------------|---------|
| 1. Initiation | OPERATOR | Declare intent, set target, provide rationale |
| | GOVERNANCE | Evaluate G-INITIATE gate (zone, escalation) |
| 2. Package Selection | OPERATOR | Select STAGED packages for proposal |
| | GOVERNANCE | Evaluate G-SELECT-OVERLAY gate (limits, trust) |
| 3. Classification | GOVERNANCE | Classify overlay type, sensitivity, certification impact |
| 4. Impact Assessment | GOVERNANCE | Compute qualification, governance, coexistence impact |
| | OPERATOR | Review and confirm impact projections |
| 5. Replay Safety | GOVERNANCE | Evaluate replay safety checks (RS-01–RS-06) |
| 6. Rollback Safety | GOVERNANCE | Evaluate rollback safety checks (RB-01–RB-07) |
| 7. Zone Projection | GOVERNANCE | Compute and evaluate projected zone |
| 8. Submission | OPERATOR | Submit proposal for review |
| | GOVERNANCE | Evaluate G-SUBMIT gate |

### 3.2 Review Pipeline Authority

| Stage | Primary Authority | Actions |
|-------|------------------|---------|
| A. Governance Review | GOVERNANCE | Gate evaluation, cross-cutting gates, fail-closed check |
| B. Qualification Review | GOVERNANCE | Impact verification, applicability confirmation |
| C. Replay/Rollback Review | GOVERNANCE | Safety verification, sensitivity review |
| D. Authorization | OPERATOR | Final authorization decision (AUTHORIZE/DENY/DEFER) |

### 3.3 Post-Approval Authority

| Operation | Primary Authority | Actions |
|-----------|------------------|---------|
| Activation | SANDBOX | Execute 8-phase activation lifecycle |
| | GOVERNANCE | Evaluate G-ACTIVATE gate at each phase |
| Supersession | OPERATOR | Initiate version upgrade proposal |
| | GOVERNANCE | Validate supersession (all gates) |
| Revocation | OPERATOR | Request revocation with impact acknowledgment |
| | GOVERNANCE | Mandate revocation (zone/trust/replay violation) |
| | SANDBOX | Execute revocation and recompute composite |
| Retirement | OPERATOR | Identify retirement candidates |
| | GOVERNANCE | Verify retirement safety |
| | SANDBOX | Execute retirement and verify state unchanged |
| De-authorization | OPERATOR | Withdraw authorization before activation |

---

## 4. Decision Authority Matrix

### 4.1 Who Decides What

| Decision | Authority | Cannot Be Made By |
|----------|-----------|------------------|
| Which packages to propose | OPERATOR | Governance, sandbox, certification |
| Which domains to target | OPERATOR | Governance, sandbox, certification |
| Strategic progression target | OPERATOR | Governance, sandbox, certification |
| Whether proposal is safe | GOVERNANCE (gates) | Operator, sandbox, certification |
| Whether overlay is replay-safe | GOVERNANCE (checks) | Operator, sandbox, certification |
| Whether overlay is rollback-safe | GOVERNANCE (checks) | Operator, sandbox, certification |
| Whether to authorize activation | OPERATOR (bounded by governance) | Sandbox, certification |
| How composite state is computed | SANDBOX (deterministic) | Operator, governance, certification |
| Whether replay MATCH | SANDBOX (hash comparison) | Operator, governance, certification |
| Whether overlay is certification-eligible | CERTIFICATION (7-check) | Operator, sandbox |
| Whether to revoke overlay | OPERATOR or GOVERNANCE (mandate) | Sandbox |
| Whether to supersede overlay | OPERATOR | Governance (governance reviews) |

### 4.2 Operator Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Bypass governance gates | Gates are mandatory, not advisory |
| Override fail-closed | Architecturally enforced |
| Skip replay/rollback review | Safety checks are mandatory |
| Activate without authorization | Full pipeline required |
| Certify own proposals | Certification is independent authority |
| Suppress rejection reasons | All rejections must state reason |
| Propose in RISK/PROHIBITED zone | Zone restrictions are mandatory |

### 4.3 Governance Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Select packages for proposal | Operator domain expertise |
| Determine progression strategy | Operator strategic judgment |
| Authorize activation | Operator accountability |
| Execute sandbox operations | Sandbox sole execution authority |
| Issue certification | Certification requires sandbox proof |
| Override operator rejection (DENY) | Operator has final authorization authority |

---

## 5. Automation Boundaries

### 5.1 Fully Automatable

| Operation | Why Automatable |
|-----------|----------------|
| Gate evaluation (all gates) | Deterministic rule evaluation |
| Overlay classification | Deterministic type/sensitivity/impact computation |
| Impact assessment computation | Deterministic delta calculation |
| Replay safety checks (RS-01–RS-06) | Deterministic verification |
| Rollback safety checks (RB-01–RB-07) | Deterministic verification |
| Zone projection | Deterministic indicator computation |
| Coexistence assessment | Deterministic pairwise check |
| Conflict resolution | Deterministic rules (later wins, higher confidence wins) |
| Cascade dependency mapping | Deterministic graph traversal |
| Audit event generation | Event-driven |

### 5.2 Human Required

| Operation | Why Human Required |
|-----------|-------------------|
| Proposal initiation | Strategic judgment on progression target |
| Package selection | Operational judgment on batch composition |
| Impact review confirmation | Accountability for impact understanding |
| Authorization decision | Accountability for activation consequence |
| Revocation decision (operator-initiated) | Judgment on optimal action |
| Supersession strategy | Judgment on version upgrade value |
| Quarantine investigation | Investigation requires contextual judgment |
| Escalation review (at G-2+) | Governance board judgment |

### 5.3 Semi-Automated (Human Oversight)

| Operation | Automation | Human Oversight |
|-----------|-----------|----------------|
| Impact estimation | Computed automatically | Human verifies reasonableness |
| Risk assessment | Computed from indicators | Human reviews risk characterization |
| Zone transition warning | Detected automatically | Human decides whether to proceed |
| Cascade impact assessment | Computed automatically | Human reviews cascade scope |
| Recovery cost estimation | Computed from revocation model | Human reviews recovery plan |

---

## 6. Authority Conflict Resolution

### 6.1 Conflict Precedence

```
1. GOVERNANCE (fail-closed) overrides all
   → If governance says STOP, everything stops

2. SANDBOX (deterministic) overrides interpretation
   → If sandbox says DIVERGENCE, that is authoritative

3. CERTIFICATION requires SANDBOX proof + GOVERNANCE gates
   → Certification cannot proceed without both

4. OPERATOR initiates and decides, within governance constraints
   → Operator authority is bounded by governance gates
```

### 6.2 Deadlock Prevention

```
IF operator wants to propose but governance blocks:
  OPTION A: Reduce proposal scope to satisfy governance
  OPTION B: Execute recovery to improve governance zone
  OPTION C: Request governance exception (recorded, requires explicit authorization)
  OPTION D: Accept blockage and wait for conditions to change

NO option allows bypassing governance without explicit audit record.
```

---

## 7. Governance

- 4 authority domains with clear separation in overlay governance
- Per-phase authority assignment ensures every action is attributed
- Operator decides WHAT, governance validates WHETHER, sandbox executes HOW
- 12 decision types with explicit authority assignment
- 7 prohibited operator actions, 6 prohibited governance actions
- Automation boundary: 10 fully automatable, 8 human-required, 5 semi-automated
- Authority conflicts resolve by governance-first precedence
- Deadlock prevention provides 4 options without governance bypass
- No hidden semantic authority in overlay governance workflow
