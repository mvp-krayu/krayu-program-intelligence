# Operator and Governance Responsibility Model

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define which lifecycle actions are operator-controlled,
governance-controlled, certification-controlled, and
sandbox-controlled — ensuring no hidden orchestration authority
exists in the system.

---

## 2. Authority Domains

### 2.1 Four Authority Domains

| Domain | Owner | Scope |
|--------|-------|-------|
| OPERATOR | Human operator (or authorized automation) | Evidence intake, packaging, proposal, approval, publication authorization |
| GOVERNANCE | Governance framework (rules, gates, zones) | Gate evaluation, zone classification, fail-closed enforcement, escalation |
| CERTIFICATION | Certification authority (governance + replay + rollback proof) | Promotion eligibility, certification decision, authority lineage |
| SANDBOX | Sandbox execution engine (deterministic computation) | Activation lifecycle, replay reconstruction, rollback execution, composite computation |

### 2.2 Authority Principle

**No domain may exercise authority belonging to another domain.**

- Operators do not compute composite state (sandbox authority)
- Governance does not approve activations (operator authority)
- Sandbox does not issue certification (certification authority)
- Certification does not modify sandbox state (sandbox authority)

---

## 3. Per-Stage Responsibility Assignment

| Stage | Primary Authority | Actions |
|-------|------------------|---------|
| 0. Intake | OPERATOR | Identify environment, provide pipeline artifacts |
| | SANDBOX | Verify hashes, create baseline references |
| | GOVERNANCE | Evaluate G-INTAKE gate |
| 1. Evidence | OPERATOR | Locate, validate, and register evidence sources |
| | GOVERNANCE | Evaluate G-EVIDENCE gate (provenance check) |
| 2. Packaging | OPERATOR | Construct SEP packages with entries |
| | SANDBOX | Validate package structure, compute hash |
| | GOVERNANCE | Evaluate G-PACKAGE gate |
| 3. Review | OPERATOR | Assess qualification state, define progression target |
| | GOVERNANCE | Evaluate G-REVIEW gate (achievability check) |
| 4. Proposal | OPERATOR | Select overlay batch, produce impact projections |
| | GOVERNANCE | Evaluate G-PROPOSAL gate (zone projection check) |
| 5. Approval | OPERATOR | Review proposal, authorize activation |
| | GOVERNANCE | Evaluate G-APPROVAL gate, enforce escalation level |
| 6. Activation | SANDBOX | Execute 8-phase lifecycle (Phases 0–7) |
| | GOVERNANCE | Evaluate G-ACTIVATE gate at each phase |
| 7. Replay | SANDBOX | Execute replay reconstruction, hash comparison |
| | GOVERNANCE | Evaluate G-REPLAY gate (MATCH required) |
| 8. Rollback | SANDBOX | Execute rollback verification, round-trip proof |
| | GOVERNANCE | Evaluate G-ROLLBACK gate |
| 9. Assessment | SANDBOX | Compute qualification metrics with attribution |
| | GOVERNANCE | Evaluate G-QUALIFY gate |
| 10. Promotion | CERTIFICATION | Assess promotion eligibility per overlay |
| | GOVERNANCE | Evaluate G-PROMOTE gate |
| 11. Certification | CERTIFICATION | Issue certification decision |
| | GOVERNANCE | Evaluate G-CERTIFY gate |
| 12. Publication | OPERATOR | Authorize publication to downstream consumers |
| | CERTIFICATION | Verify certification is current |
| | GOVERNANCE | Evaluate G-PUBLISH gate |
| 13. Monitoring | GOVERNANCE | Continuous gate evaluation (zone, entropy, overload) |
| | SANDBOX | Health indicator computation |
| 14. Recovery | OPERATOR | Initiate recovery action (selective revoke, reset) |
| | SANDBOX | Execute recovery (rollback, recomputation) |
| | GOVERNANCE | Evaluate G-RECOVER gate, verify post-recovery state |

---

## 4. Decision Authority Matrix

### 4.1 Who Decides What

| Decision | Authority | Cannot Be Made By |
|----------|-----------|------------------|
| Which evidence to use | OPERATOR | Governance, sandbox, certification |
| Which domains to target | OPERATOR | Governance, sandbox, certification |
| Which packages to activate | OPERATOR (subject to governance) | Sandbox, certification |
| Whether activation is safe | GOVERNANCE (gates + zones) | Operator, sandbox, certification |
| How composite state is computed | SANDBOX (deterministic) | Operator, governance, certification |
| Whether replay MATCH | SANDBOX (hash comparison) | Operator, governance, certification |
| Whether overlay is promotion-eligible | CERTIFICATION (7-check protocol) | Operator, sandbox |
| Whether to issue certification | CERTIFICATION (governance-gated) | Operator, sandbox |
| Whether to publish authority | OPERATOR (post-certification) | Sandbox, governance (governance gates, not decides) |
| Whether to revoke overlay | OPERATOR | Sandbox, certification (though governance may mandate) |
| When to escalate | GOVERNANCE (zone + indicator rules) | Operator (operator may request, governance decides) |

### 4.2 Operator Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Bypass governance gates | Gates are mandatory, not advisory |
| Override fail-closed conditions | Fail-closed is architecturally enforced |
| Modify certified baseline | Baseline is immutable from sandbox perspective |
| Suppress mandatory disclosure | Disclosure is governance-mandated |
| Publish without certification | Publication gate enforces certification |
| Compute qualification state manually | Sandbox is the sole computation authority |

### 4.3 Governance Cannot

| Prohibited Action | Why |
|-------------------|-----|
| Select evidence or targets | Operator domain expertise required |
| Construct overlay packages | Operator domain expertise required |
| Approve its own recommendations | Governance evaluates, operator decides |
| Execute sandbox operations | Sandbox is sole execution authority |
| Issue certification unilaterally | Certification requires replay/rollback proof from sandbox |

---

## 5. Automation Boundaries

### 5.1 What Can Be Automated

| Action | Automation Feasibility |
|--------|----------------------|
| Gate evaluation | FULLY AUTOMATABLE — deterministic rule evaluation |
| Zone classification | FULLY AUTOMATABLE — indicator-based computation |
| Replay verification | FULLY AUTOMATABLE — hash comparison |
| Rollback verification | FULLY AUTOMATABLE — deterministic reconstruction |
| Entropy detection | FULLY AUTOMATABLE — indicator monitoring |
| Overload detection | FULLY AUTOMATABLE — threshold evaluation |
| Composite computation | FULLY AUTOMATABLE — pure function |
| Audit event generation | FULLY AUTOMATABLE — event-driven |
| Disclosure assembly | FULLY AUTOMATABLE — template-driven |

### 5.2 What Requires Human Authority

| Action | Why Human Required |
|--------|-------------------|
| Evidence selection | Domain expertise, judgment |
| Progression target setting | Strategic decision |
| Overlay batch selection | Operational judgment |
| Activation approval | Accountability, impact awareness |
| Certification decision | Governance accountability |
| Publication authorization | Downstream impact responsibility |
| Recovery decision (which action) | Judgment on optimal recovery path |

### 5.3 Automation with Human Oversight

| Action | Automation Level |
|--------|-----------------|
| Evidence packaging | Semi-automated (human provides evidence, system validates structure) |
| Impact projection | Automated computation, human review |
| Coexistence assessment | Automated analysis, human review before activation |
| Promotion eligibility | Automated check, human certification decision |

---

## 6. Authority Conflict Resolution

### 6.1 Conflict Precedence

When authorities conflict:

```
1. GOVERNANCE (fail-closed) overrides all other authorities
   → If governance says STOP, everything stops

2. SANDBOX (deterministic) overrides interpretation
   → If sandbox says DIVERGENCE, that is authoritative

3. CERTIFICATION requires both SANDBOX proof and GOVERNANCE gates
   → Certification cannot proceed without both

4. OPERATOR initiates and decides, within governance constraints
   → Operator authority is bounded by governance gates
```

### 6.2 Deadlock Prevention

If operator wants to proceed but governance blocks:

```
STEP 1: Governance displays blocking condition
STEP 2: Operator has three options:
  a) Resolve blocking condition (e.g., revoke overlays to reduce zone)
  b) Request governance exception (recorded, requires explicit authorization)
  c) Accept blockage and wait for conditions to change
STEP 3: No option allows bypassing governance without explicit record
```

---

## 7. Governance

- 4 authority domains with clear separation
- No domain exercises another domain's authority
- Operator decisions are bounded by governance gates
- Governance evaluates but does not decide operational choices
- Sandbox is sole computation authority (deterministic, not overridable)
- Certification requires proof from sandbox and authorization from governance
- Gate evaluation, zone classification, and verification are fully automatable
- Evidence selection, approval, and certification require human authority
- Authority conflicts resolve by governance-first precedence
