# Operational Workflow Navigation Architecture

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the canonical operational workflow navigation architecture —
how operators traverse governed semantic workflows inside the SQO
Cockpit without losing lineage clarity, authority boundaries, or
operational observability.

---

## 2. Architectural Separation

### 2.1 Workflow Navigation ≠ Authority Mutation

```
Workflow navigation IS:
  operational state traversal visibility

Workflow navigation IS NOT:
  authority mutation
  autonomous reasoning
  semantic interpretation

LENS remains:
  authority consumption only

Navigation may expose authority state
but may NOT mutate authority implicitly.
```

---

## 3. Workflow Navigation Architecture

### 3.1 Ten Navigable Workflow Domains

| # | Domain | Workflow Chain | Primary States | Gates |
|---|--------|---------------|---------------|-------|
| WN-01 | Onboarding | WC-01 | 15 stages (Stage 0–14), S-state progression | G-REGISTRATION through G-PUBLICATION |
| WN-02 | Evidence | WC-02 | Intake pipeline (7 phases), packaging (4 steps) | G-SOURCE-CLASS through G-REGISTER |
| WN-03 | Overlay | WC-03 | Proposal (8 phases), approval (4 stages) | G-SELECT-OVERLAY through G-SUBMIT |
| WN-04 | Replay | WC-04 | 6-phase certification pipeline | G-INPUT-INVENTORY through G-LINEAGE-CERT |
| WN-05 | Rollback | WC-05 | 5-phase certification pipeline | G-DEPENDENCY-INVENTORY through G-CASCADE-SAFETY |
| WN-06 | Certification | WC-04 + WC-05 + WC-06 | Combined status, promotion eligibility | G-COMBINED-CERT → G-OPERATOR-PROMOTE |
| WN-07 | Publication | WC-07 | Authority → eligibility → published | G-AUTHORITY-COMPLETE through G-PIPELINE-CERT |
| WN-08 | Governance | Zone doctrine | SAFE/PRESSURE/RISK/PROHIBITED | Zone transition gates |
| WN-09 | Sandbox | Session lifecycle | 10 session states (SS-01 through SS-10) | Session activation and certification gates |
| WN-10 | Escalation | Escalation doctrine | G-0 through G-4 escalation levels | Escalation trigger and resolution gates |

### 3.2 Navigation Architecture Layers

```
LAYER 1: WORKFLOW SELECTION
  │  Select active workflow domain (WN-01 through WN-10)
  │  Shows: active workflows, state summary, health per domain
  ▼
LAYER 2: WORKFLOW INSTANCE
  │  Select specific workflow instance within domain
  │  Shows: current phase, gate status, timeline
  ▼
LAYER 3: WORKFLOW DETAIL
  │  Full state of selected workflow instance
  │  Shows: phase detail, gate prerequisites, actions, events
  ▼
LAYER 4: WORKFLOW DRILL-DOWN
  │  Specific phase, gate, or artifact detail
  │  Shows: phase inputs/outputs, gate criteria, lineage links
  ▼
LAYER 5: CROSS-DOMAIN NAVIGATION
  │  Follow workflow handoffs to adjacent domains
  │  Shows: upstream/downstream domain links with context preservation
```

### 3.3 Workflow Navigation Dashboard

```
┌──────────────────────────────────────────────────────┐
│ SQO COCKPIT — WORKFLOW NAVIGATION                     │
│ Client: {client}  │  Run: {run}  │  Zone: {zone}     │
├──────────────────────────────────────────────────────┤
│ WORKFLOW DOMAINS                                      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│ │Onboard │ │Evidence│ │Overlay │ │Replay  │         │
│ │ Stage 4│ │ 3 actv │ │ 2 actv │ │ 1 actv │         │
│ │   ●    │ │   ●    │ │   ●    │ │   ●    │         │
│ └────────┘ └────────┘ └────────┘ └────────┘         │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│ │Rollback│ │Certif. │ │Publish │ │Govern. │         │
│ │ 1 actv │ │ 1 pend │ │ 0 pend │ │ SAFE   │         │
│ │   ●    │ │   ◐    │ │   ○    │ │   ●    │         │
│ └────────┘ └────────┘ └────────┘ └────────┘         │
│ ┌────────┐ ┌────────┐                                │
│ │Sandbox │ │Escalat.│                                │
│ │ 1 ACTV │ │ G-0    │                                │
│ │   ●    │ │   ●    │                                │
│ └────────┘ └────────┘                                │
│                                                       │
│ ● = healthy  ◐ = attention  ○ = idle  ◉ = critical  │
├──────────────────────────────────────────────────────┤
│ ACTIVE WORKFLOWS                                      │
│ WC-01 Onboarding   │ Stage 4/14  │ Gate: G-PROPOSE   │
│ WC-04 Replay Cert  │ Phase 3/6   │ Gate: G-RECON     │
│ WC-05 Rollback Cert│ Phase 2/5   │ Gate: G-REMOVABLE │
│ WC-06 Promotion    │ Pending     │ Gate: G-COMBINED   │
├──────────────────────────────────────────────────────┤
│ RECENT TRANSITIONS                                    │
│ [12:34] Overlay → Replay Cert (SEP-003 activated)    │
│ [12:30] Evidence → Overlay (SEP-003 packaged)        │
│ [12:25] Rollback Cert phase 2 → phase 3 (SEP-002)   │
└──────────────────────────────────────────────────────┘
```

---

## 4. Workflow Navigation Model

### 4.1 Navigation Primitives

| # | Primitive | Description |
|---|-----------|-------------|
| NP-01 | Domain selection | Navigate to a workflow domain (WN-01 through WN-10) |
| NP-02 | Instance selection | Select a specific workflow instance within a domain |
| NP-03 | Phase traversal | Navigate forward/backward through workflow phases |
| NP-04 | Gate inspection | Inspect gate prerequisites, status, and blocking conditions |
| NP-05 | Cross-domain follow | Follow workflow handoff to next domain with context |
| NP-06 | Lineage link | Navigate from workflow state to lineage chain |
| NP-07 | Event focus | Navigate to event stream filtered by workflow |
| NP-08 | Authority check | Inspect authority boundary for current workflow state |

### 4.2 Navigation State Machine

```
IDLE
  │  domain selection (NP-01)
  ▼
DOMAIN_VIEW
  │  instance selection (NP-02)
  ▼
INSTANCE_VIEW
  │  phase traversal (NP-03)
  ├──────────────────────────▶ PHASE_DETAIL
  │  gate inspection (NP-04)
  ├──────────────────────────▶ GATE_DETAIL
  │  cross-domain follow (NP-05)
  ├──────────────────────────▶ DOMAIN_VIEW (target domain)
  │  lineage link (NP-06)
  ├──────────────────────────▶ LINEAGE_VIEW
  │  event focus (NP-07)
  ├──────────────────────────▶ EVENT_VIEW
  │  authority check (NP-08)
  └──────────────────────────▶ AUTHORITY_VIEW

All views share context bar:
  Client | Run | Session | Zone | S-State
```

---

## 5. Workflow Chain Navigation

### 5.1 Chain-Level Navigation

```
Full onboarding chain (WC-01):

  WN-01         WN-02         WN-03         WN-04/05       WN-06         WN-07
  Onboarding    Evidence      Overlay       Replay/Roll.    Certification Publication
  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    ┌─────────┐  ┌─────────┐
  │ Stage 4 │─▶│ Intake  │─▶│ Propose │─▶│ Certify │───▶│ Promote │─▶│ Publish │
  │ of 14   │  │ 3 actv  │  │ 2 actv  │  │ 1 pend  │    │ pending │  │ ---     │
  └─────────┘  └─────────┘  └─────────┘  └─────────┘    └─────────┘  └─────────┘
       │              │             │             │              │            │
       G-REG         G-INTAKE     G-PROPOSE    G-CERTIFY     G-PROMOTE   G-PUBLISH

  ◀── Past ──────── Current ──────── Future ──▶

  Navigation: click any domain to focus; [<] [>] to traverse chain
```

### 5.2 Cross-Domain Handoff Navigation

| Source Domain | Target Domain | Handoff Trigger | Context Preserved |
|--------------|---------------|-----------------|-------------------|
| WN-02 (Evidence) | WN-03 (Overlay) | Package staged → proposal | Package ID, evidence sources, trust levels |
| WN-03 (Overlay) | WN-04 (Replay) | Overlay activated → replay | Overlay ID, activation chain, baseline |
| WN-03 (Overlay) | WN-05 (Rollback) | Overlay activated → rollback | Overlay ID, dependencies, cascade scope |
| WN-04 + WN-05 | WN-06 (Certification) | Both certified → combined | Replay cert, rollback cert, overlay ID |
| WN-06 (Certification) | WN-07 (Publication) | Authority promoted → publish | Authority evidence, promotion record |
| WN-08 (Governance) | WN-10 (Escalation) | Zone threshold → escalation | Zone state, trigger metrics, escalation level |
| WN-09 (Sandbox) | WN-04/05 (Replay/Rollback) | Session validation → cert | Session ID, overlay chain, namespace |

---

## 6. Deep-Link Model

### 6.1 Workflow Navigation Deep-Links

```
Every workflow navigation state is addressable:

  /cockpit/{client}/{run}/workflow
  /cockpit/{client}/{run}/workflow/{domain}
  /cockpit/{client}/{run}/workflow/{domain}/{instance_id}
  /cockpit/{client}/{run}/workflow/{domain}/{instance_id}/phase/{phase}
  /cockpit/{client}/{run}/workflow/{domain}/{instance_id}/gate/{gate_id}
  /cockpit/{client}/{run}/workflow/{domain}/{instance_id}/lineage
  /cockpit/{client}/{run}/workflow/{domain}/{instance_id}/events

Deep-links enable:
  - Direct navigation from external references
  - Shareable workflow state references
  - Audit trail references to specific workflow states
  - Cross-domain handoff as navigable link
```

---

## 7. Governance

- 10 navigable workflow domains aligned with operational workspace domains
- 5 navigation layers (selection → instance → detail → drill-down → cross-domain)
- 8 navigation primitives (domain, instance, phase, gate, cross-domain, lineage, event, authority)
- Workflow navigation ≠ authority mutation — navigation is read-only traversal
- All workflow states addressable via deep-link model
- Cross-domain handoffs preserve operational context
- Navigation architecture is client-agnostic
