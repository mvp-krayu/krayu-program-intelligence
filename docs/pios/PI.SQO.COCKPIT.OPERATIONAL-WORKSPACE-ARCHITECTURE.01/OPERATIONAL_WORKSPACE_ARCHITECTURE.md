# Operational Workspace Architecture

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the canonical operational workspace architecture that
transforms the SQO Cockpit from a static observability surface
into the governed semantic operational workspace of the platform —
the single environment where all SQO workflows are orchestrated,
monitored, and governed.

---

## 2. Architectural Separation

### 2.1 Cockpit ≠ LENS

| Property | SQO Cockpit | LENS |
|----------|-------------|------|
| Role | Operational semantic governance workspace | Executive authority consumption surface |
| Audience | Operators, governance, certification authority | Executive consumers of certified authority |
| Content | Provisional + certified operational state | Certified authority only |
| Operations | Workflow orchestration, approval, escalation | Read-only consumption |
| State boundary | Sandbox + authority state visible | Authority state only |
| Governance | Full operational governance visibility | Publication-gated visibility |

### 2.2 Mandatory Separation Rule

```
No operational sandbox state directly enters LENS.

Cockpit produces: certified authority state
                        ▼
Publication eligibility gate (G-QUAL-PUBLISH + G-ZONE-PUBLISH)
                        ▼
LENS consumes: published authority only
```

---

## 3. Workspace Domain Model

### 3.1 Ten Operational Domains

| # | Domain | Scope | Upstream Workflow |
|---|--------|-------|-------------------|
| WD-01 | Onboarding | Client lifecycle management | PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01 |
| WD-02 | Evidence | Evidence intake and packaging | PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01 |
| WD-03 | Overlay | Overlay proposal and approval | PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01 |
| WD-04 | Replay | Replay certification | PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01 |
| WD-05 | Rollback | Rollback certification | PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01 |
| WD-06 | Certification | Combined certification state | PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01 |
| WD-07 | Publication | Authority promotion and publication | PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01 |
| WD-08 | Governance | Zone monitoring and escalation | Governance stability envelope |
| WD-09 | Sandbox | Sandbox namespace operations | Sandbox architecture |
| WD-10 | Recoverability | Recovery and rollback operations | Recoverability models |

### 3.2 Domain Separation Rules

```
Rule 1: Each domain has a dedicated workspace region
  - No domain shares visual or operational space with another
  - Domain boundaries are visually explicit

Rule 2: Each domain has defined entry/exit points
  - Operators navigate between domains through governed transitions
  - No hidden domain transitions

Rule 3: Each domain has domain-specific observability
  - Health indicator per domain
  - Event stream per domain
  - State summary per domain

Rule 4: Cross-domain operations are explicit
  - Evidence → Overlay (packaging → proposal)
  - Overlay → Certification (activation → replay/rollback)
  - Certification → Publication (certification → promotion)
  - Cross-domain flows are visually traceable
```

---

## 4. Workspace Architecture Layers

### 4.1 Four Architecture Layers

```
Layer 4: OPERATIONAL CONTEXT
  │  Client context, run context, governance zone
  │  Always visible — anchors all workspace operations
  ▼
Layer 3: DOMAIN WORKSPACES
  │  10 operational domains (§3.1)
  │  Each domain: state view + action surface + observability
  ▼
Layer 2: WORKFLOW ORCHESTRATION
  │  Cross-domain workflow execution
  │  Gate visualization, approval chains, escalation
  ▼
Layer 1: LINEAGE AND AUDIT
  │  Evidence lineage, overlay lineage, certification lineage
  │  Full reconstructability — any state traceable to source
  ▼
[Foundation: Governance doctrine, zone constraints, authority boundaries]
```

### 4.2 Layer Interaction Model

| From Layer | To Layer | Interaction |
|-----------|----------|-------------|
| L4 → L3 | Context → Domains | Context scopes which domains are visible and active |
| L3 → L2 | Domains → Workflows | Domain actions trigger workflow orchestration |
| L2 → L3 | Workflows → Domains | Workflow outcomes update domain state |
| L3 → L1 | Domains → Lineage | Domain state changes produce lineage records |
| L1 → L3 | Lineage → Domains | Lineage navigation enables domain state audit |

---

## 5. Workspace State Model

### 5.1 Workspace State Types

| # | State Type | Description | Visibility |
|---|-----------|-------------|-----------|
| WS-01 | Provisional | Sandbox-computed, not yet certified | Cockpit only |
| WS-02 | Certified | Replay + rollback certified | Cockpit only |
| WS-03 | Authority-promoted | Promoted to governing truth | Cockpit + publication boundary |
| WS-04 | Publication-eligible | Meets all publication prerequisites | Cockpit + publication boundary |
| WS-05 | Published | Published to LENS consumption | Cockpit + LENS |

### 5.2 State Progression Visibility

```
Cockpit shows full progression:
  WS-01 → WS-02 → WS-03 → WS-04 → WS-05

LENS shows only:
  WS-05 (published authority)

State boundaries are visually explicit:
  - Provisional state: marked as PROVISIONAL
  - Certified state: marked as CERTIFIED
  - Authority state: marked as AUTHORITY
  - Published state: marked as PUBLISHED
  - No state displayed without explicit label
```

---

## 6. Workspace Navigation Model

### 6.1 Navigation Structure

```
OPERATIONAL CONTEXT BAR (persistent)
├── Client selector
├── Run selector
├── Governance zone indicator
├── S-state indicator
└── Health summary

DOMAIN NAVIGATION (sidebar)
├── Onboarding (WD-01)
├── Evidence (WD-02)
├── Overlay (WD-03)
├── Replay (WD-04)
├── Rollback (WD-05)
├── Certification (WD-06)
├── Publication (WD-07)
├── Governance (WD-08)
├── Sandbox (WD-09)
└── Recoverability (WD-10)

WORKSPACE REGION (main area)
├── Domain state view (current state of selected domain)
├── Action surface (available operations)
├── Observability panel (events, health, alerts)
└── Lineage panel (navigation to source)
```

### 6.2 Navigation Rules

```
Rule 1: Context persists across domain navigation
  - Client and run context remain stable
  - Domain switching does not reset context

Rule 2: Deep-link support
  - Every workspace state is addressable by URL
  - Lineage navigation produces stable references

Rule 3: Breadcrumb trail
  - Navigation history is visible
  - Operators can trace their path through domains

Rule 4: Cross-domain indicators
  - When viewing a domain, related state in other domains is indicated
  - Example: viewing an overlay shows its certification status from WD-06
```

---

## 7. Workspace Per-Domain Structure

### 7.1 Standard Domain Workspace Layout

Every domain workspace follows a consistent structure:

```
┌──────────────────────────────────────────────────┐
│ DOMAIN HEADER                                     │
│ Domain name | State summary | Health indicator    │
├──────────────────────────────────────────────────┤
│ STATE VIEW                                        │
│ Primary state of the domain                       │
│ Key metrics, counts, progression indicators       │
├──────────────────────────────────────────────────┤
│ ACTION SURFACE                                    │
│ Available operations (governed by authority)       │
│ Approval buttons, escalation triggers, etc.       │
├──────────────────────────────────────────────────┤
│ EVENT STREAM                                      │
│ Recent events in this domain                      │
│ Filtered by domain, ordered by recency            │
├──────────────────────────────────────────────────┤
│ LINEAGE PANEL                                     │
│ Navigate to upstream/downstream lineage           │
│ Cross-domain references                           │
└──────────────────────────────────────────────────┘
```

### 7.2 Domain-Specific Workspace Content

| Domain | State View | Action Surface |
|--------|-----------|---------------|
| WD-01 Onboarding | Lifecycle stage, gate status | Stage transitions, gate approvals |
| WD-02 Evidence | Intake pipeline status, trust levels | Intake operations, trust review |
| WD-03 Overlay | Proposal status, trust states | Proposal review, approval, rejection |
| WD-04 Replay | Certification pipeline status | Certification initiation, review |
| WD-05 Rollback | Certification pipeline status | Certification initiation, review |
| WD-06 Certification | Combined certification state | Combined certification review |
| WD-07 Publication | Promotion status, eligibility | Promotion authorization, publication |
| WD-08 Governance | Zone status, escalation state | Zone monitoring, escalation response |
| WD-09 Sandbox | Namespace status, overlay chains | Sandbox operations, isolation |
| WD-10 Recoverability | Recovery options, rollback state | Recovery initiation, rollback execution |

---

## 8. Workspace Authority Model

### 8.1 Workspace Action Authorization

| Action Category | Authorization Required |
|----------------|----------------------|
| View domain state | Operator (any) |
| View lineage | Operator (any) |
| Initiate workflow | Operator (domain-specific) |
| Approve gate | Operator (approval authority) |
| Escalate | Operator (escalation authority) |
| Promote to authority | Operator + Governance |
| Publish | Operator + Governance + Certification |
| Retract publication | Operator + Governance |

### 8.2 Authorization Enforcement

```
Every cockpit action passes through:

  STEP 1: Verify operator identity
  STEP 2: Verify operator has domain authorization
  STEP 3: Verify governance zone permits action
  STEP 4: Verify workflow prerequisites are met
  STEP 5: Execute action
  STEP 6: Record action in audit trail

No action executes without Steps 1–4 passing.
```

---

## 9. Governance

- SQO Cockpit ≠ LENS: cockpit is operational workspace, LENS is consumption surface
- 10 operational domains with explicit separation and governed transitions
- 4 architecture layers: operational context, domain workspaces, workflow orchestration, lineage/audit
- 5 workspace state types with explicit labels (PROVISIONAL through PUBLISHED)
- Navigation model with persistent context, deep-link support, and cross-domain indicators
- Standard domain workspace layout: state view, action surface, event stream, lineage panel
- Authorization model requires identity + domain + zone + prerequisites before any action
- No provisional sandbox state masquerades as authority
- Workspace architecture is client-agnostic
