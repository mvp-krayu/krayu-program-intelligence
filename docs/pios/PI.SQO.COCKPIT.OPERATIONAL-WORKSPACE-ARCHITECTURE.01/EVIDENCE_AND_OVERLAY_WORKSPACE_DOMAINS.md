# Evidence and Overlay Workspace Domains

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the workspace architecture for the evidence domain (WD-02)
and overlay domain (WD-03) — the two domains that govern how
external evidence enters the platform and how semantic overlays
are proposed, reviewed, and approved.

---

## 2. Evidence Domain Workspace (WD-02)

### 2.1 Evidence Domain State View

```
┌──────────────────────────────────────────────────────┐
│ EVIDENCE DOMAIN                        Health: ●      │
├──────────────────────────────────────────────────────┤
│ INTAKE PIPELINE STATUS                                │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│ │ P1 │→│ P2 │→│ P3 │→│ P4 │→│ P5 │→│ P6 │→│ P7 │  │
│ │ ✓  │ │ ✓  │ │ ✓  │ │ ●  │ │ ○  │ │ ○  │ │ ○  │  │
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘  │
│ Discovery  Class   Trust  Extract Norm   Prov  Reg   │
├──────────────────────────────────────────────────────┤
│ EVIDENCE INVENTORY                                    │
│ Sources: 12 registered                                │
│ Trust: 8 TRUSTED, 2 PROVISIONAL, 1 QUARANTINED, 1 PROHIBITED │
│ Packages: 3 STAGED, 2 ACTIVATED, 0 REVOKED           │
├──────────────────────────────────────────────────────┤
│ PACKAGING PIPELINE STATUS                             │
│ STAGED packages awaiting overlay proposal: 3          │
│ Package strategies: 2 SINGLE-DOMAIN, 1 CLUSTER       │
└──────────────────────────────────────────────────────┘
```

### 2.2 Evidence Domain Action Surface

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| EA-01 | Initiate evidence intake | Operator | Always permitted |
| EA-02 | Review trust assessment | Operator | Always permitted |
| EA-03 | Resolve quarantine | Operator + Investigation | Always permitted |
| EA-04 | Initiate packaging | Operator | SAFE, PRESSURE |
| EA-05 | Review package strategy | Operator | SAFE, PRESSURE |
| EA-06 | Approve package registration | Operator | SAFE, PRESSURE |
| EA-07 | Escalate trust issue | Operator | Always permitted |
| EA-08 | View evidence lineage (L0→L2) | Operator | Always permitted |

### 2.3 Evidence Domain Observability

| Metric | Description |
|--------|-------------|
| Intake throughput | Evidence sources processed per period |
| Trust distribution | Count by trust level (TRUSTED, PROVISIONAL, QUARANTINED, PROHIBITED) |
| Package readiness | STAGED packages awaiting overlay proposal |
| Quarantine status | Active quarantines with investigation progress |
| Lineage completeness | Percentage of evidence with complete L0→L2 lineage |

---

## 3. Overlay Domain Workspace (WD-03)

### 3.1 Overlay Domain State View

```
┌──────────────────────────────────────────────────────┐
│ OVERLAY DOMAIN                         Health: ●      │
├──────────────────────────────────────────────────────┤
│ PROPOSAL PIPELINE STATUS                              │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│ │ P1 │→│ P2 │→│ P3 │→│ P4 │→│ P5 │→│ P6 │→│ P7 │→│ P8 ││
│ │Init│ │Sel │ │Cls │ │Imp │ │Rep │ │Rol │ │Zon │ │Sub ││
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘│
├──────────────────────────────────────────────────────┤
│ OVERLAY INVENTORY                                     │
│ Proposals: 2 DRAFT, 1 SUBMITTED, 1 UNDER_REVIEW      │
│ Trust: 1 GOVERNANCE-APPROVED, 2 REPLAY-AUTHORIZED     │
│ ACTIVATED: 3 overlays contributing to composite       │
├──────────────────────────────────────────────────────┤
│ REVIEW PIPELINE                                       │
│ Stage A: Governance Review     — 0 pending            │
│ Stage B: Qualification Review  — 1 pending            │
│ Stage C: Safety Review         — 0 pending            │
│ Stage D: Authorization         — 0 pending            │
├──────────────────────────────────────────────────────┤
│ SENSITIVITY                                           │
│ STANDARD: 2  │ REPLAY-SENSITIVE: 1  │ ROLLBACK-SENSITIVE: 0│
└──────────────────────────────────────────────────────┘
```

### 3.2 Overlay Domain Action Surface

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| OA-01 | Initiate proposal | Operator | SAFE, PRESSURE |
| OA-02 | Select packages for proposal | Operator | SAFE, PRESSURE |
| OA-03 | Classify overlay type | Automated + Operator review | SAFE, PRESSURE |
| OA-04 | Assess impact | Automated + Operator review | SAFE, PRESSURE |
| OA-05 | Review replay safety | Automated | SAFE, PRESSURE |
| OA-06 | Review rollback safety | Automated | SAFE, PRESSURE |
| OA-07 | Submit proposal | Operator | SAFE, PRESSURE |
| OA-08 | Approve proposal (governance review) | Governance | SAFE, PRESSURE |
| OA-09 | Approve proposal (qualification review) | Operator | SAFE, PRESSURE |
| OA-10 | Approve proposal (safety review) | Automated + Operator | SAFE, PRESSURE |
| OA-11 | Authorize activation | Operator + Governance | SAFE, PRESSURE |
| OA-12 | Request revision | Governance | SAFE, PRESSURE |
| OA-13 | Reject proposal | Governance | Always permitted |
| OA-14 | Withdraw proposal | Operator | Always permitted |
| OA-15 | Initiate supersession | Operator | SAFE, PRESSURE |
| OA-16 | Initiate revocation | Operator + Governance | Always permitted |
| OA-17 | View overlay lineage (L2→L3) | Operator | Always permitted |

### 3.3 Overlay Domain Observability

| Metric | Description |
|--------|-------------|
| Proposal throughput | Proposals processed per period |
| Proposal state distribution | Count by proposal state (12 states) |
| Trust state distribution | Count by trust state (7 states) |
| Review pipeline load | Pending reviews per stage |
| Overlay sensitivity profile | Count by sensitivity level |
| Activation rate | Proposals reaching ACTIVATED per period |
| Rejection rate | Proposals rejected per period |
| Revision rate | Revision requests per period |

---

## 4. Evidence-to-Overlay Cross-Domain Flow

### 4.1 Cross-Domain Handoff: Evidence → Overlay

```
Evidence Domain (WD-02)                 Overlay Domain (WD-03)
┌─────────────────────┐               ┌─────────────────────┐
│ STAGED Package      │               │ Proposal Phase 2    │
│ ┌─────────────────┐ │    HANDOFF    │ ┌─────────────────┐ │
│ │ SEP-multi-004   │─│──────────────▶│─│ Package Selected │ │
│ │ Status: STAGED  │ │               │ │ For Proposal     │ │
│ │ Entries: 5      │ │               │ │ Status: DRAFT    │ │
│ │ Trust: TRUSTED  │ │               │ └─────────────────┘ │
│ └─────────────────┘ │               │                     │
└─────────────────────┘               └─────────────────────┘

Handoff prerequisites:
  ✓ Package status = STAGED
  ✓ Package trust = TRUSTED or PROVISIONAL
  ✓ Zone permits overlay proposals
  ✓ Package not already selected for another proposal
```

### 4.2 Cross-Domain Visibility

```
When viewing Evidence Domain:
  - Indicator: "3 STAGED packages available for overlay proposal"
  - Link: navigate to Overlay Domain proposal initiation

When viewing Overlay Domain:
  - Indicator: "Source packages: SEP-multi-001, SEP-multi-002"
  - Link: navigate to Evidence Domain for package details
  - Trust level inherited from evidence trust assessment
```

---

## 5. Overlay-to-Certification Cross-Domain Flow

### 5.1 Cross-Domain Handoff: Overlay → Certification

```
Overlay Domain (WD-03)                  Certification Domain (WD-06)
┌─────────────────────┐               ┌─────────────────────┐
│ AUTHORIZED Overlay  │               │ Certification Queue  │
│ ┌─────────────────┐ │    HANDOFF    │ ┌─────────────────┐ │
│ │ SEP-multi-003   │─│──────────────▶│─│ Cert Pending    │ │
│ │ Status: AUTH    │ │               │ │ Replay: PENDING │ │
│ │ Trust: CERT-AUTH│ │               │ │ Rollback: PEND  │ │
│ │ Sensitivity: STD│ │               │ │ Combined: PEND  │ │
│ └─────────────────┘ │               │ └─────────────────┘ │
└─────────────────────┘               └─────────────────────┘

Handoff prerequisites:
  ✓ Overlay status = AUTHORIZED (Stage D approval)
  ✓ Overlay trust = CERTIFICATION-AUTHORIZED
  ✓ All 4 review stages complete
  ✓ Zone permits certification
```

---

## 6. Domain-Specific Quarantine Workspaces

### 6.1 Evidence Quarantine View

```
┌──────────────────────────────────────────────────────┐
│ EVIDENCE QUARANTINE                                   │
├──────────────────────────────────────────────────────┤
│ Active Quarantines: 1                                 │
│ ┌──────────────────────────────────────────────────┐ │
│ │ EQ-BE-001-003 | Source: DOC-external-audit       │ │
│ │ Trust: QUARANTINED | Criteria Failed: TC-03      │ │
│ │ Investigation: IN_PROGRESS                       │ │
│ │ Timeout: 2026-05-18 (7 days remaining)           │ │
│ │ Actions: [View Investigation] [Resolve] [Extend] │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 6.2 Overlay Quarantine View

```
┌──────────────────────────────────────────────────────┐
│ OVERLAY QUARANTINE                                    │
├──────────────────────────────────────────────────────┤
│ Active Quarantines: 0                                 │
│ Resolved: 2 | Confirmed: 0 | Expired: 0              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ No active overlay quarantines                    │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 7. Governance

- Evidence domain (WD-02) operationalizes 7-phase intake + 6-phase packaging pipelines
- Overlay domain (WD-03) operationalizes 8-phase proposal + 4-stage review pipelines
- 8 evidence actions and 17 overlay actions with defined authorization and zone constraints
- Cross-domain handoffs (evidence → overlay, overlay → certification) are hash-verified and visible
- Cross-domain visibility shows related state when navigating between domains
- Quarantine workspaces provide investigation and resolution surfaces per domain
- Domain observability includes throughput, state distribution, and pipeline load metrics
- No hidden evidence-to-overlay or overlay-to-certification transitions
- Domain architecture is client-agnostic
