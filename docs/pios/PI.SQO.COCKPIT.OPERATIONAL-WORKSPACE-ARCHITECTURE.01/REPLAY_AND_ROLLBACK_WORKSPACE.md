# Replay and Rollback Workspace

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the workspace architecture for the replay domain (WD-04),
rollback domain (WD-05), and certification domain (WD-06) —
the three domains that govern how replay integrity, rollback
integrity, and combined certification are operationally managed.

---

## 2. Replay Domain Workspace (WD-04)

### 2.1 Replay Domain State View

```
┌──────────────────────────────────────────────────────┐
│ REPLAY CERTIFICATION DOMAIN                Health: ●  │
├──────────────────────────────────────────────────────┤
│ PIPELINE STATUS                                       │
│ Active Certifications: 1                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ RCERT-BE-001-017 │ SEP-multi-003                 │ │
│ │ Phase: 3/6 (Deterministic Reconstruction)        │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │ │
│ │ │ ✓  │→│ ✓  │→│ ●  │→│ ○  │→│ ○  │→│ ○  │     │ │
│ │ │Inv │ │Int │ │Rec │ │Cmp │ │Lin │ │Dec │     │ │
│ │ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │ │
│ │ Double-Replay: Required (CERTIFICATION-IMPACTING)│ │
│ └──────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ CERTIFICATION HISTORY                                 │
│ CERTIFIED: 15  │  PARTIAL: 2  │  DENIED: 2  │  FAILED: 1│
│ Success Rate: 75% (last 20)                           │
├──────────────────────────────────────────────────────┤
│ DIVERGENCE STATUS                                     │
│ Active Investigations: 0                              │
│ Resolved: 2  │  Open: 0                               │
└──────────────────────────────────────────────────────┘
```

### 2.2 Replay Domain Action Surface

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| RA-01 | Initiate replay certification | Operator | SAFE, PRESSURE |
| RA-02 | View input inventory | Operator | Always |
| RA-03 | View input integrity verification | Operator | Always |
| RA-04 | View reconstruction progress | Operator | Always |
| RA-05 | View output comparison | Operator | Always |
| RA-06 | View lineage verification | Operator | Always |
| RA-07 | Review PARTIAL certification | Operator | Always |
| RA-08 | Investigate divergence | Operator | Always |
| RA-09 | View reconstruction audit trail | Operator | Always |

---

## 3. Rollback Domain Workspace (WD-05)

### 3.1 Rollback Domain State View

```
┌──────────────────────────────────────────────────────┐
│ ROLLBACK CERTIFICATION DOMAIN              Health: ●  │
├──────────────────────────────────────────────────────┤
│ PIPELINE STATUS                                       │
│ Active Certifications: 0                              │
│ Queued: 1 (SEP-multi-003 — awaiting replay cert)     │
├──────────────────────────────────────────────────────┤
│ CERTIFICATION HISTORY                                 │
│ CERTIFIED: 14  │  CONDITIONAL: 1  │  WITH_WARNINGS: 2│
│ DENIED: 1  │  Success Rate: 83% (last 18)             │
├──────────────────────────────────────────────────────┤
│ REMOVABILITY SUMMARY (per ACTIVATED overlay)          │
│ ┌──────────────────────────────────────────────────┐ │
│ │ SEP-multi-001 │ 7/7 passed │ Cascade: 0         │ │
│ │ SEP-multi-002 │ 7/7 passed │ Cascade: depth 1   │ │
│ │ SEP-multi-003 │ not assessed│ Certification pend │ │
│ └──────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ CASCADE SAFETY SUMMARY                                │
│ Max Depth: 1/3  │  Max Size: 1/5  │  Status: SAFE    │
└──────────────────────────────────────────────────────┘
```

### 3.2 Rollback Domain Action Surface

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| RB-01 | Initiate rollback certification | Operator | SAFE, PRESSURE |
| RB-02 | View dependency inventory | Operator | Always |
| RB-03 | View removability check results | Operator | Always |
| RB-04 | View state restoration verification | Operator | Always |
| RB-05 | View cascade safety assessment | Operator | Always |
| RB-06 | Review CONDITIONAL certification | Operator | Always |
| RB-07 | Accept rollback warnings | Operator | Always |
| RB-08 | Initiate actual rollback operation | Operator + Governance | SAFE, PRESSURE |
| RB-09 | View rollback impact projection | Operator | Always |

---

## 4. Certification Domain Workspace (WD-06)

### 4.1 Certification Domain State View

```
┌──────────────────────────────────────────────────────┐
│ COMBINED CERTIFICATION DOMAIN              Health: ●  │
├──────────────────────────────────────────────────────┤
│ CERTIFICATION STATUS (per overlay)                    │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay         │ Replay      │ Rollback    │ Comb│ │
│ │─────────────────│─────────────│─────────────│─────│ │
│ │ SEP-multi-001   │ CERTIFIED   │ CERTIFIED   │ ELIG│ │
│ │ SEP-multi-002   │ CERTIFIED   │ PENDING     │ PEND│ │
│ │ SEP-multi-003   │ PENDING     │ PENDING     │ PEND│ │
│ └──────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│ PROMOTION ELIGIBILITY                                 │
│ ELIGIBLE: 1 (SEP-multi-001)                          │
│ RESTRICTED: 0                                         │
│ BLOCKED: 0                                            │
│ PENDING: 2 (SEP-multi-002, SEP-multi-003)            │
├──────────────────────────────────────────────────────┤
│ QUARANTINE STATUS                                     │
│ Active: 0  │  Investigating: 0  │  Resolved: 3       │
└──────────────────────────────────────────────────────┘
```

### 4.2 Certification Domain Action Surface

| # | Action | Authorization | Zone Constraint |
|---|--------|--------------|----------------|
| CD-01 | View combined certification status | Operator | Always |
| CD-02 | View certification evidence chain | Operator | Always |
| CD-03 | Review promotion eligibility | Operator | Always |
| CD-04 | Navigate to replay certification detail | Operator | Always |
| CD-05 | Navigate to rollback certification detail | Operator | Always |
| CD-06 | View quarantine status and history | Operator | Always |
| CD-07 | Initiate re-certification | Operator | SAFE, PRESSURE |
| CD-08 | Authorize re-certification attempt | Operator | SAFE, PRESSURE |

---

## 5. Cross-Domain Certification Flow

### 5.1 Certification Flow Visualization

```
Overlay Domain (WD-03)
  │  AUTHORIZED overlay
  ▼
Replay Domain (WD-04)           Rollback Domain (WD-05)
  │  6-phase pipeline              │  5-phase pipeline
  │  REPLAY_CERTIFIED              │  ROLLBACK_CERTIFIED
  ▼                                ▼
Certification Domain (WD-06)
  │  Combined certification
  │  PROMOTION_ELIGIBLE
  ▼
Publication Domain (WD-07)
  │  Authority promotion
  │  AUTHORITY_PROMOTED
  ▼
[Publication eligibility]

Cross-domain indicators:
  - Overlay domain shows certification status per overlay
  - Replay domain shows overlay source details
  - Rollback domain shows overlay dependency context
  - Certification domain shows combined view
  - Publication domain shows promotion readiness
```

### 5.2 Certification-State Workspace

```
┌──────────────────────────────────────────────────────┐
│ CERTIFICATION STATE MATRIX                            │
├──────────────────────────────────────────────────────┤
│                                                       │
│         Evidence  Overlay  Replay  Rollback  Combined │
│ SEP-001  TRUSTED   AUTH    CERT    CERT      ELIG    │
│ SEP-002  TRUSTED   AUTH    CERT    PEND      PEND    │
│ SEP-003  PROVIS    AUTH    PEND    PEND      PEND    │
│                                                       │
│ Legend: CERT=CERTIFIED  ELIG=ELIGIBLE  PEND=PENDING   │
│         AUTH=AUTHORIZED  PROVIS=PROVISIONAL            │
│                                                       │
│ [Each cell is navigable to its domain detail view]    │
└──────────────────────────────────────────────────────┘
```

---

## 6. Divergence Investigation Workspace

### 6.1 Investigation View

```
┌──────────────────────────────────────────────────────┐
│ DIVERGENCE INVESTIGATION                              │
├──────────────────────────────────────────────────────┤
│ Investigation: CINV-BE-001-004                        │
│ Overlay: SEP-multi-002                                │
│ Type: REPLAY_DIVERGENCE (DIV-02: field divergence)   │
│ Root Cause: RC-04 (resolution divergence)             │
│ Status: RESOLVED                                      │
│                                                       │
│ Findings:                                             │
│ - Conflict resolution for domain:ownership.field:type │
│   produced different winner after config v1.1 update  │
│ - Resolution: reverted to config v1.0 for this run   │
│                                                       │
│ Re-certification: RCERT-BE-001-016 (CERTIFIED)       │
└──────────────────────────────────────────────────────┘
```

---

## 7. Governance

- Replay domain (WD-04) operationalizes 6-phase replay certification pipeline
- Rollback domain (WD-05) operationalizes 5-phase rollback certification pipeline
- Certification domain (WD-06) provides combined certification state matrix
- Cross-domain flow: overlay → replay + rollback → combined → publication
- Certification-state workspace shows full matrix across all domains
- Divergence investigation workspace supports structured root cause analysis
- 9 replay actions, 9 rollback actions, 8 certification actions with defined authorization
- Cascade safety summary aggregated across all overlays
- No hidden certification transitions
- Replay/rollback/certification workspace is client-agnostic
