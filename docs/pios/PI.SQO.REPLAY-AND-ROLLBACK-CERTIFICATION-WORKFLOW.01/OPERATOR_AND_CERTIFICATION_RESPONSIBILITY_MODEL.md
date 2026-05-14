# Operator and Certification Responsibility Model

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the authority domains, decision boundaries, and responsibility
assignment for certification operations — specifying what is automated,
what requires operator judgment, and what governance authority controls.

---

## 2. Authority Domains

### 2.1 Four Certification Authority Domains

| # | Domain | Scope | Authority |
|---|--------|-------|-----------|
| CA-01 | CERTIFICATION | Replay and rollback pipeline execution | Automated with operator override |
| CA-02 | PROMOTION | Authority promotion decisions | Operator with governance review |
| CA-03 | PUBLICATION | Publication eligibility decisions | Operator with governance approval |
| CA-04 | INVESTIGATION | Divergence and quarantine investigation | Operator-led |

### 2.2 Authority Domain Interactions

```
CA-01 (CERTIFICATION) produces evidence for:
  → CA-02 (PROMOTION) uses certification evidence for promotion decisions
  → CA-04 (INVESTIGATION) uses certification failures for investigation

CA-02 (PROMOTION) produces authority for:
  → CA-03 (PUBLICATION) uses promoted authority for publication decisions

CA-04 (INVESTIGATION) feeds back to:
  → CA-01 (CERTIFICATION) via re-certification workflow
  → CA-02 (PROMOTION) via promotion revocation
```

---

## 3. Per-Phase Authority Assignment

### 3.1 Replay Certification Authority

| Phase | Authority Domain | Decision Type |
|-------|-----------------|--------------|
| Phase 1: Input Inventory | CA-01 | Automated |
| Phase 2: Input Integrity | CA-01 | Automated |
| Phase 3: Reconstruction | CA-01 | Automated |
| Phase 4: Output Comparison | CA-01 | Automated |
| Phase 5: Lineage Verification | CA-01 | Automated |
| Phase 6: Certification Decision | CA-01 + Operator | Automated with operator review for PARTIAL/DENIED |

### 3.2 Rollback Certification Authority

| Phase | Authority Domain | Decision Type |
|-------|-----------------|--------------|
| Phase 1: Dependency Inventory | CA-01 | Automated |
| Phase 2: Removability Verification | CA-01 | Automated |
| Phase 3: State Restoration | CA-01 | Automated |
| Phase 4: Cascade Safety | CA-01 | Automated with cascade review |
| Phase 5: Certification Decision | CA-01 + Operator | Automated with operator review for CONDITIONAL/DENIED |

### 3.3 Authority Promotion Authority

| Operation | Authority Domain | Decision Type |
|-----------|-----------------|--------------|
| Prerequisite verification | CA-02 | Automated |
| Promotion impact projection | CA-02 | Automated |
| Promotion execution | CA-02 + Operator | Operator authorization required |
| Promotion verification | CA-02 | Automated |
| Promotion revocation | CA-02 + Operator | Operator authorization required |

### 3.4 Publication Eligibility Authority

| Operation | Authority Domain | Decision Type |
|-----------|-----------------|--------------|
| Eligibility prerequisite check | CA-03 | Automated |
| Qualification threshold verification | CA-03 | Automated |
| Publication decision | CA-03 + Operator | Operator authorization required |
| Publication retraction | CA-03 + Operator | Operator authorization required |

---

## 4. Decision Authority Matrix

### 4.1 Fourteen Certification Decisions

| # | Decision | Authority | Can Automate? |
|---|----------|-----------|--------------|
| 1 | Issue REPLAY_CERTIFIED | CA-01 | YES — all gates pass |
| 2 | Issue REPLAY_PARTIAL | CA-01 + Operator | NO — operator reviews partial |
| 3 | Issue REPLAY_DENIED | CA-01 | YES — gate failure |
| 4 | Issue REPLAY_FAILED | CA-01 | YES — reconstruction failure |
| 5 | Issue ROLLBACK_CERTIFIED | CA-01 | YES — all checks pass |
| 6 | Issue ROLLBACK_CONDITIONAL | CA-01 + Operator | NO — operator reviews cascade |
| 7 | Issue ROLLBACK_CERTIFIED_WITH_WARNINGS | CA-01 | YES — soft deps only |
| 8 | Issue ROLLBACK_DENIED | CA-01 | YES — hard check failure |
| 9 | Promote to authority | CA-02 + Operator | NO — operator must authorize |
| 10 | Revoke authority promotion | CA-02 + Operator | NO — operator must authorize |
| 11 | Grant publication eligibility | CA-03 + Operator | NO — operator must authorize |
| 12 | Retract publication eligibility | CA-03 + Operator | NO — operator must authorize |
| 13 | Enter quarantine | CA-01 | YES — triggered by rejection |
| 14 | Resolve quarantine | CA-04 + Operator | NO — investigation required |

---

## 5. Operator Responsibilities

### 5.1 Operator MUST

| # | Responsibility |
|---|---------------|
| OR-01 | Review REPLAY_PARTIAL decisions before accepting |
| OR-02 | Review ROLLBACK_CONDITIONAL decisions before accepting |
| OR-03 | Authorize every authority promotion |
| OR-04 | Authorize every publication eligibility grant |
| OR-05 | Lead investigation for quarantined overlays |
| OR-06 | Authorize re-certification attempts |
| OR-07 | Review zone projection before promotion |

### 5.2 Operator MUST NOT

| # | Prohibition |
|---|------------|
| OP-01 | Override automated certification gates |
| OP-02 | Promote without certification evidence |
| OP-03 | Publish without authority promotion |
| OP-04 | Bypass quarantine without investigation |
| OP-05 | Modify certification evidence |
| OP-06 | Issue certification outside governed pipeline |
| OP-07 | Suppress divergence or ambiguity findings |

### 5.3 Governance Authority MUST NOT

| # | Prohibition |
|---|------------|
| GA-01 | Execute certification pipeline (CA-01 responsibility) |
| GA-02 | Make promotion decisions (CA-02 + Operator responsibility) |
| GA-03 | Override operator investigation findings |
| GA-04 | Modify certification thresholds during active certification |
| GA-05 | Redefine certification gates without versioned configuration change |

---

## 6. Automation Boundaries

### 6.1 Fully Automatable Operations (12)

| # | Operation | Automation |
|---|-----------|-----------|
| 1 | Input inventory enumeration | Pipeline automation |
| 2 | Input integrity hash verification | Pipeline automation |
| 3 | Deterministic reconstruction | Pipeline automation |
| 4 | Output hash comparison | Pipeline automation |
| 5 | Double-replay/rollback verification | Pipeline automation |
| 6 | Lineage chain verification | Pipeline automation |
| 7 | Dependency inventory mapping | Pipeline automation |
| 8 | Removability check execution | Pipeline automation |
| 9 | Simulated rollback computation | Pipeline automation |
| 10 | Cascade depth/size computation | Pipeline automation |
| 11 | Zone projection computation | Pipeline automation |
| 12 | Quarantine entry on CRITICAL rejection | Pipeline automation |

### 6.2 Human-Required Operations (8)

| # | Operation | Reason |
|---|-----------|--------|
| 1 | Authority promotion authorization | Irreversible authority change |
| 2 | Publication eligibility grant | External visibility boundary |
| 3 | Quarantine resolution | Judgment-dependent investigation |
| 4 | Re-certification authorization | Requires root cause understanding |
| 5 | PARTIAL certification acceptance | Requires scope judgment |
| 6 | CONDITIONAL certification acceptance | Requires cascade risk judgment |
| 7 | Authority promotion revocation | Impact assessment required |
| 8 | Publication retraction | External impact assessment |

### 6.3 Semi-Automated Operations (4)

| # | Operation | Automated Part | Human Part |
|---|-----------|---------------|-----------|
| 1 | Divergence investigation | Root cause classification | Root cause resolution |
| 2 | Cascade safety assessment | Depth/size computation | Cascade risk acceptance |
| 3 | Zone transition handling | Freeze/resume automation | Zone recovery strategy |
| 4 | Re-certification execution | Pipeline execution | Authorization and review |

---

## 7. Conflict Resolution

### 7.1 Authority Conflict Resolution

```
IF operator and governance disagree:
  → Governance authority prevails for:
    - Gate definitions
    - Threshold values
    - Zone constraints
  → Operator authority prevails for:
    - Investigation findings
    - Timing of promotion
    - Publication readiness assessment

IF automated and operator disagree:
  → Operator can DEFER but NOT OVERRIDE automated gate failures
  → Operator can ACCEPT automated PASS results without review
  → Operator can ESCALATE automated results for governance review

IF certification and promotion disagree:
  → Certification is prerequisite — promotion cannot override
  → Promotion can be DEFERRED even if certification passes
  → Promotion cannot be ISSUED if certification fails
```

---

## 8. Governance

- 4 authority domains: CERTIFICATION, PROMOTION, PUBLICATION, INVESTIGATION
- Per-phase and per-operation authority assignment
- 14 certification decisions with defined automation boundaries
- 7 operator responsibilities, 7 operator prohibitions, 5 governance prohibitions
- 12 fully automatable, 8 human-required, 4 semi-automated operations
- Governance prevails on gate definitions; operator prevails on investigation findings
- Certification is prerequisite — promotion cannot override certification
- All authority actions produce auditable records
- Responsibility model is client-agnostic
