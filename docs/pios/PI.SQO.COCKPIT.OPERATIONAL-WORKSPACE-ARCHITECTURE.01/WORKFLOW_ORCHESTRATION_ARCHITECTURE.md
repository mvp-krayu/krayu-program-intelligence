# Workflow Orchestration Architecture

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how the SQO Cockpit orchestrates cross-domain workflows —
making lifecycle transitions, approval gates, certification gates,
escalation gates, and publication gates operationally visible
and governable.

---

## 2. Workflow Orchestration Model

### 2.1 Seven Orchestrated Workflow Chains

| # | Chain | Domains Traversed | Gates |
|---|-------|-------------------|-------|
| WC-01 | Onboarding lifecycle | WD-01 → WD-02 → WD-03 → WD-04/05 → WD-06 → WD-07 | G-REGISTRATION through G-PUBLICATION |
| WC-02 | Evidence intake | WD-02 | G-SOURCE-CLASS → G-TRUST → G-EXTRACT → G-NORMALIZE → G-PROVENANCE → G-REGISTER |
| WC-03 | Overlay proposal | WD-02 → WD-03 | G-SELECT-OVERLAY → G-CLASSIFY → G-IMPACT → G-REPLAY → G-ROLLBACK → G-ZONE-SUBMIT → G-SUBMIT |
| WC-04 | Replay certification | WD-03 → WD-04 → WD-06 | G-INPUT-INVENTORY → G-INPUT-INTEGRITY → G-RECONSTRUCTION → G-COMPARISON → G-LINEAGE-CERT |
| WC-05 | Rollback certification | WD-03 → WD-05 → WD-06 | G-DEPENDENCY-INVENTORY → G-REMOVABILITY → G-STATE-RESTORATION → G-CASCADE-SAFETY |
| WC-06 | Authority promotion | WD-06 → WD-07 | G-REPLAY-CERT → G-ROLLBACK-CERT → G-COMBINED-CERT → G-OPERATOR-PROMOTE |
| WC-07 | Publication | WD-07 | G-AUTHORITY-COMPLETE → G-QUAL-PUBLISH → G-ZONE-PUBLISH → G-PIPELINE-CERT |

### 2.2 Workflow Chain Visualization

```
WC-01: Full Onboarding Lifecycle Chain

  REGISTRATION        EVIDENCE          OVERLAY           CERTIFICATION      PUBLICATION
  ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐
  │ WD-01   │──G──▶│ WD-02   │──G──▶│ WD-03   │──G──▶│ WD-04/05│──G──▶│ WD-07   │
  │Onboard  │       │Evidence │       │Overlay  │       │Cert     │       │Publish  │
  └─────────┘       └─────────┘       └─────────┘       └─────────┘       └─────────┘
       │                 │                 │                 │                 │
       G-REG            G-INTAKE          G-PROPOSE         G-CERTIFY        G-PUBLISH
```

---

## 3. Gate Orchestration Model

### 3.1 Gate Types

| # | Type | Description | Cockpit Behavior |
|---|------|-------------|-----------------|
| GT-01 | Automatic gate | Evaluates deterministically from state | Cockpit shows pass/fail in real-time |
| GT-02 | Approval gate | Requires operator authorization | Cockpit shows pending approval with action surface |
| GT-03 | Certification gate | Requires certification pipeline completion | Cockpit shows certification progress |
| GT-04 | Escalation gate | Triggered by governance condition | Cockpit shows escalation with required response |
| GT-05 | Zone gate | Evaluates against current governance zone | Cockpit shows zone constraint with current zone |

### 3.2 Gate Visualization in Cockpit

```
┌──────────────────────────────────────────────────────┐
│ GATE: G-REPLAY-CERT                                   │
│ Type: CERTIFICATION (GT-03)                           │
│ Status: PENDING                                       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Prerequisites:                                    │ │
│ │ ✓ Overlay ACTIVATED                              │ │
│ │ ✓ Input inventory complete                       │ │
│ │ ✓ Input integrity verified                       │ │
│ │ ○ Reconstruction complete                        │ │
│ │ ○ Output comparison                              │ │
│ │ ○ Lineage verification                           │ │
│ └──────────────────────────────────────────────────┘ │
│ Current Phase: 3/6 (Deterministic Reconstruction)     │
│ Zone: SAFE                                            │
│ Estimated Completion: Phase 4 pending                 │
└──────────────────────────────────────────────────────┘
```

### 3.3 Gate Transition Rules

```
Gate transitions are atomic and auditable:

  PENDING → EVALUATING
    Trigger: all prerequisites met
    Cockpit: shows evaluation in progress

  EVALUATING → PASSED
    Trigger: all gate conditions satisfied
    Cockpit: shows green pass indicator
    Audit: gate pass record created

  EVALUATING → FAILED
    Trigger: any gate condition fails
    Cockpit: shows red fail indicator with specific failure
    Audit: gate fail record created

  EVALUATING → BLOCKED
    Trigger: zone constraint prevents evaluation
    Cockpit: shows zone blocker with zone indicator
    Audit: gate blocked record created

  FAILED → EVALUATING
    Trigger: failure condition resolved (re-attempt)
    Cockpit: shows re-evaluation in progress
    Audit: re-evaluation record created

No gate transition is hidden.
Every transition produces a cockpit event and audit record.
```

---

## 4. Workflow State Machine

### 4.1 Workflow Instance Model

```
Each workflow chain instance has:

  workflow_instance = {
    instance_id: "WF-<chain>-<client>-<run_id>-<seq>",
    chain: "WC-XX",
    current_domain: "WD-XX",
    current_gate: "G-XXX",
    status: "ACTIVE | PAUSED | BLOCKED | COMPLETE | FAILED",
    started_at: "<ISO-8601>",
    gates_passed: [list of passed gates],
    gates_pending: [list of pending gates],
    gates_failed: [list of failed gates with reasons],
    zone_at_start: "SAFE",
    zone_current: "SAFE",
    operator_actions_pending: [list of required operator actions]
  }
```

### 4.2 Workflow Status Transitions

```
ACTIVE → PAUSED
  Trigger: zone transition (SAFE/PRESSURE → RISK)
  Cockpit: shows paused indicator with zone reason

ACTIVE → BLOCKED
  Trigger: gate failure or zone PROHIBITED
  Cockpit: shows blocker with specific gate/zone

ACTIVE → COMPLETE
  Trigger: all gates in chain passed
  Cockpit: shows completion with full gate history

ACTIVE → FAILED
  Trigger: unrecoverable gate failure
  Cockpit: shows failure with root cause

PAUSED → ACTIVE
  Trigger: zone recovery (RISK → SAFE/PRESSURE)
  Cockpit: shows resumption from pause point

BLOCKED → ACTIVE
  Trigger: blocker resolved
  Cockpit: shows resolution and resumption
```

---

## 5. Cross-Domain Workflow Handoff

### 5.1 Handoff Model

```
When a workflow transitions between domains:

  STEP 1: Complete all gates in current domain
  STEP 2: Package domain output as handoff payload
    handoff = {
      from_domain: "WD-XX",
      to_domain: "WD-YY",
      payload_hash: sha256(domain_output),
      gate_history: [gates passed in current domain],
      timestamp: now()
    }
  STEP 3: Verify receiving domain is ready
  STEP 4: Execute handoff
  STEP 5: Record handoff in workflow instance

Cockpit shows:
  - Handoff in progress (between domains)
  - Handoff complete (arrived at new domain)
  - Handoff failed (receiving domain not ready)
```

### 5.2 Handoff Visualization

```
Evidence Domain                    Overlay Domain
┌─────────────────┐              ┌─────────────────┐
│ ✓ G-SOURCE-CLASS│              │ ○ G-SELECT      │
│ ✓ G-TRUST       │              │ ○ G-CLASSIFY    │
│ ✓ G-EXTRACT     │──HANDOFF──▶│ ○ G-IMPACT      │
│ ✓ G-NORMALIZE   │              │ ○ G-REPLAY      │
│ ✓ G-PROVENANCE  │              │ ○ G-ROLLBACK    │
│ ✓ G-REGISTER    │              │ ○ G-SUBMIT      │
└─────────────────┘              └─────────────────┘
   COMPLETE                         RECEIVING
```

---

## 6. Workflow Concurrency Model

### 6.1 Concurrency Rules

| Scenario | Rule | Cockpit Behavior |
|----------|------|-----------------|
| Multiple workflows, same client | Sequential within chain, parallel across chains | Shows all active workflows with chain labels |
| Multiple workflows, different clients | Fully parallel | Each client context isolates its workflows |
| Same-chain overlap | Blocked — one instance per chain per client at a time | Shows blocking reason |
| Cross-chain dependency | Dependent chain waits for prerequisite chain | Shows dependency indicator |

### 6.2 Workflow Queue

```
When zone constraints reduce capacity:

  Active workflows: continue (unless zone blocks)
  Queued workflows: ordered by priority
    Priority 1: Re-certification workflows
    Priority 2: Certification workflows
    Priority 3: Overlay proposal workflows
    Priority 4: Evidence intake workflows

  Cockpit shows:
    - Active workflow count
    - Queued workflow count
    - Queue position per workflow
    - Estimated wait (based on zone and capacity)
```

---

## 7. Workflow Observability

### 7.1 Workflow Events

| # | Event | Trigger |
|---|-------|---------|
| WE-01 | WORKFLOW_STARTED | New workflow instance created |
| WE-02 | GATE_EVALUATING | Gate evaluation started |
| WE-03 | GATE_PASSED | Gate evaluation succeeded |
| WE-04 | GATE_FAILED | Gate evaluation failed |
| WE-05 | GATE_BLOCKED | Gate blocked by zone |
| WE-06 | DOMAIN_HANDOFF | Workflow transitioned between domains |
| WE-07 | WORKFLOW_PAUSED | Workflow paused by zone transition |
| WE-08 | WORKFLOW_RESUMED | Workflow resumed after zone recovery |
| WE-09 | WORKFLOW_COMPLETE | All gates passed, workflow complete |
| WE-10 | WORKFLOW_FAILED | Workflow failed, unrecoverable |
| WE-11 | OPERATOR_ACTION_REQUIRED | Workflow waiting for operator action |
| WE-12 | OPERATOR_ACTION_RECEIVED | Operator provided required action |

### 7.2 Workflow Dashboard

```
┌──────────────────────────────────────────────────────┐
│ WORKFLOW ORCHESTRATION                                │
├──────────────────────────────────────────────────────┤
│ Active: 3  │  Queued: 1  │  Complete: 12  │  Failed: 0│
├──────────────────────────────────────────────────────┤
│ WC-01 Onboarding    │ WD-03 Overlay │ G-IMPACT    ○ │
│ WC-04 Replay Cert   │ WD-04 Replay  │ G-RECON     ● │
│ WC-06 Auth Promote  │ WD-07 Publish │ G-PROMOTE   ▲ │
│ WC-02 Evidence [Q]  │ Queued #1     │ Zone: PRESS   │
└──────────────────────────────────────────────────────┘
  ○ = pending  ● = in progress  ▲ = operator action required
```

---

## 8. Governance

- 7 orchestrated workflow chains cover full onboarding-to-publication lifecycle
- 5 gate types (automatic, approval, certification, escalation, zone) with defined cockpit behavior
- Gate transitions are atomic, auditable, and never hidden
- Cross-domain handoffs are hash-verified and visible
- Workflow state machine: ACTIVE, PAUSED, BLOCKED, COMPLETE, FAILED
- Concurrency rules prevent same-chain overlap within a client
- Workflow queue with priority ordering in constrained zones
- 12 workflow events capture every orchestration state change
- No hidden workflow transitions
- Workflow orchestration is client-agnostic
