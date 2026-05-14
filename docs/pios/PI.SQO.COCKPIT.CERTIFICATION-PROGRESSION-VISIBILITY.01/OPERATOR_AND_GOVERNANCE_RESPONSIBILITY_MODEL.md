# Operator and Governance Responsibility Model

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define which certification operations expose operator actions,
governance actions, and certification actions — including visibility
actions, operator actions, governance actions, zone-conditional
visibility, operator responsibilities and prohibitions, governance
responsibilities and prohibitions, and audit requirements.

---

## 2. Certification Visibility Actions

### 2.1 Sixteen Read-Only Visibility Actions

| # | Action | Description | Authorization |
|---|--------|-------------|---------------|
| CA-01 | View certification state | Current state per overlay | Operator |
| CA-02 | View certification history | Historical state transitions | Operator |
| CA-03 | View replay pipeline | Replay certification phases and progress | Operator |
| CA-04 | View rollback pipeline | Rollback certification phases and progress | Operator |
| CA-05 | View combined certification | Combined decision and evidence | Operator |
| CA-06 | View authority eligibility | Promotion prerequisites and gate status | Operator |
| CA-07 | View publication eligibility | Publication prerequisites and readiness | Operator |
| CA-08 | View certification lineage | Hash-verified certification chains | Operator |
| CA-09 | View certification degradation | Degradation signals and trend | Operator |
| CA-10 | View certification escalation | Escalation triggers and active escalations | Operator |
| CA-11 | View qualification trust | S-state progression through certification | Operator |
| CA-12 | View authority boundary | Boundary integrity and anti-leakage | Operator |
| CA-13 | View LENS boundary | Publication boundary and LENS content rules | Operator |
| CA-14 | View certification coexistence | Multi-trajectory status and dependencies | Operator |
| CA-15 | View certification archive | Completed certification records | Operator |
| CA-16 | View certification health | Aggregate health indicator and trend | Operator |

---

## 3. Operator Actions

### 3.1 Seven Operator Actions

| # | Action | Description | Authorization | Zone Constraint |
|---|--------|-------------|---------------|----------------|
| OC-01 | Initiate certification | Start replay certification for an overlay | Operator | SAFE, PRESSURE |
| OC-02 | Authorize promotion | Authorize authority promotion for eligible overlay | Operator | SAFE, PRESSURE |
| OC-03 | Authorize publication | Authorize publication of eligible authority state | Operator + Governance | SAFE |
| OC-04 | Approve re-certification | Authorize re-certification after quarantine resolution | Operator | SAFE, PRESSURE |
| OC-05 | Acknowledge escalation | Acknowledge certification escalation alert | Operator | Any zone |
| OC-06 | Request investigation | Request investigation into certification degradation | Operator | Any zone |
| OC-07 | Authorize retraction | Authorize publication retraction | Operator + Governance | Any zone |

### 3.2 Zone-Conditional Action Visibility

| Action | SAFE | PRESSURE | RISK | PROHIBITED |
|--------|------|----------|------|-----------|
| OC-01 Initiate certification | AVAILABLE | AVAILABLE | BLOCKED | HIDDEN |
| OC-02 Authorize promotion | AVAILABLE | AVAILABLE (w/approval) | BLOCKED | HIDDEN |
| OC-03 Authorize publication | AVAILABLE | BLOCKED | BLOCKED | HIDDEN |
| OC-04 Approve re-certification | AVAILABLE | AVAILABLE | BLOCKED | HIDDEN |
| OC-05 Acknowledge escalation | AVAILABLE | AVAILABLE | AVAILABLE | AVAILABLE |
| OC-06 Request investigation | AVAILABLE | AVAILABLE | AVAILABLE | AVAILABLE |
| OC-07 Authorize retraction | AVAILABLE | AVAILABLE | AVAILABLE | AVAILABLE |

---

## 4. Governance Actions

### 4.1 Five Governance Actions

| # | Action | Description | Authorization | Zone Constraint |
|---|--------|-------------|---------------|----------------|
| GC-01 | Override certification freeze | Override zone-driven certification freeze | Governance | RISK only |
| GC-02 | Force quarantine resolution | Resolve quarantine without standard investigation | Governance | Any zone |
| GC-03 | Force authority revocation | Revoke authority promotion without standard process | Governance | Any zone |
| GC-04 | Override publication block | Override publication eligibility blocker | Governance | SAFE, PRESSURE |
| GC-05 | Force escalation resolution | Resolve certification escalation | Governance | Any zone |

---

## 5. Operator Responsibilities and Prohibitions

### 5.1 Seven Operator Responsibilities

| # | Responsibility |
|---|---------------|
| OR-01 | Monitor certification pipeline progress for all overlays |
| OR-02 | Review and authorize authority promotions when all prerequisites are met |
| OR-03 | Review and authorize publication when all gates pass |
| OR-04 | Acknowledge certification escalation alerts within defined SLA |
| OR-05 | Review quarantine investigation outcomes before approving re-certification |
| OR-06 | Monitor authority boundary integrity and anti-leakage compliance |
| OR-07 | Report certification anomalies through request investigation action |

### 5.2 Seven Operator Prohibitions

| # | Prohibition |
|---|------------|
| OP-01 | May NOT bypass certification pipeline (no skip-to-promote) |
| OP-02 | May NOT promote without combined certification evidence |
| OP-03 | May NOT publish without meeting all 6 publication prerequisites |
| OP-04 | May NOT initiate certification when zone blocks it |
| OP-05 | May NOT modify certification evidence (write-once, immutable) |
| OP-06 | May NOT suppress certification degradation signals |
| OP-07 | May NOT cross authority boundaries (no provisional as authority) |

---

## 6. Governance Responsibilities and Prohibitions

### 6.1 Five Governance Responsibilities

| # | Responsibility |
|---|---------------|
| GR-01 | Ensure certification pipeline operates within zone constraints |
| GR-02 | Resolve certification escalations when operator resolution is insufficient |
| GR-03 | Authorize publication in conjunction with operator authorization |
| GR-04 | Maintain certification health above IMPAIRED level |
| GR-05 | Ensure authority boundary integrity across sessions |

### 6.2 Five Governance Prohibitions

| # | Prohibition |
|---|------------|
| GP-01 | May NOT override certification evidence integrity |
| GP-02 | May NOT delete certification records |
| GP-03 | May NOT bypass anti-leakage rules |
| GP-04 | May NOT force publication when zone prohibits it |
| GP-05 | May NOT suppress non-determinism alerts (always G-4) |

---

## 7. Audit Trail

### 7.1 Four-Record Audit per Certification Action

```
For every operator or governance action on certification:

  Record 1: Action record
    {action_id, action_type, actor, timestamp, target_overlay}

  Record 2: State-before record
    {state_before_id, certification_state, authority_state, zone, S_state}

  Record 3: State-after record
    {state_after_id, certification_state, authority_state, zone, S_state}

  Record 4: Evidence record
    {evidence_id, certification_evidence_refs, gate_status, chain_hash}

All four records are:
  - Write-once (immutable)
  - Hash-linked (tamper-evident)
  - Retained indefinitely
  - Searchable by action, actor, overlay, time
```

---

## 8. Governance

- 16 read-only certification visibility actions (CA-01 through CA-16)
- 7 operator actions (OC-01 through OC-07) with zone-conditional visibility
- 5 governance actions (GC-01 through GC-05) for override scenarios
- Zone-conditional: SAFE shows all actions; PROHIBITED shows only OC-05, OC-06, OC-07
- 7 operator responsibilities and 7 operator prohibitions
- 5 governance responsibilities and 5 governance prohibitions
- 4-record audit trail per certification action (action, state-before, state-after, evidence)
- All audit records are write-once, hash-linked, and retained indefinitely
- No hidden certification authority — all actions visible and auditable
