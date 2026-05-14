# Workflow Coexistence and Context Preservation

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how multiple concurrent workflows coexist coherently in the
navigation model, how operational context is preserved across navigation
transitions, and how workflow branching, supersession, recovery, and
archival remain navigable without ambiguity.

---

## 2. Workflow Coexistence Navigation

### 2.1 Concurrent Workflow View

```
┌──────────────────────────────────────────────────────┐
│ ACTIVE WORKFLOWS                                      │
│ Client: {client}  │  Run: {run}  │  Session: active  │
├──────────────────────────────────────────────────────┤
│                                                       │
│ CONCURRENT WORKFLOWS (4 active)                       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ #  │ Chain    │ Domain  │ Instance    │ State    │ │
│ │────│──────────│─────────│─────────────│──────────│ │
│ │ 1  │ WC-01    │ WN-03   │ Stage 4     │ ACTIVE   │ │
│ │ 2  │ WC-04    │ WN-04   │ SEP-002 rep │ ACTIVE   │ │
│ │ 3  │ WC-05    │ WN-05   │ SEP-002 roll│ ACTIVE   │ │
│ │ 4  │ WC-06    │ WN-06   │ SEP-001 prom│ COMPLETE │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ QUEUED WORKFLOWS (1 queued)                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ #  │ Chain    │ Domain  │ Instance    │ Blocked  │ │
│ │────│──────────│─────────│─────────────│──────────│ │
│ │ 1  │ WC-04    │ WN-04   │ SEP-003 rep │ waiting  │ │
│ │    │          │         │             │ on activ.│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ COMPLETED WORKFLOWS (12 completed)                    │
│   [View Completed Workflow History]                   │
│                                                       │
│ NAVIGATION                                            │
│   [Click workflow for detail]                         │
│   [Filter: Active | Queued | Complete | All]         │
│   [Sort: Chain | Domain | Age | Status]              │
└──────────────────────────────────────────────────────┘
```

### 2.2 Workflow Coexistence Rules

| # | Rule | Description | Navigation Impact |
|---|------|-------------|-------------------|
| CX-01 | One active session per client+run | Only one ACTIVE session navigable | Session list shows ACTIVE vs terminal |
| CX-02 | Concurrent replay + rollback | Same overlay can have replay and rollback running | Both visible in certification domain |
| CX-03 | Sequential overlay activation | Overlays activate in monotonic order | Chain shows activation sequence |
| CX-04 | Independent certification | Each overlay certifies independently | Per-overlay certification status |
| CX-05 | Promotion requires combined cert | Cannot promote without both replay and rollback cert | Promotion gate shows dependencies |
| CX-06 | Publication requires promotion | Cannot publish without authority promotion | Publication gate shows prerequisites |
| CX-07 | Zone affects all workflows | Zone change impacts all active workflows | Zone navigation shows affected workflows |

### 2.3 Workflow Dependency Navigation

```
WORKFLOW DEPENDENCIES

  WC-02 Evidence ──▶ WC-03 Overlay ──┬──▶ WC-04 Replay ──┐
                                      │                     │
                                      └──▶ WC-05 Rollback ─┤
                                                            │
                                      ┌─────────────────────┘
                                      ▼
                                    WC-06 Promotion ──▶ WC-07 Publication

  WC-08 Governance ──▶ affects all (zone constraints)
  WC-09 Escalation ──▶ may freeze any workflow

  [Click any dependency arrow for handoff detail]
  [Dotted lines = blocked dependencies]
```

---

## 3. Context Preservation Model

### 3.1 Context Preservation Rules

| # | Rule | Description |
|---|------|-------------|
| CP-01 | Client context persists | Client ID preserved across all navigation |
| CP-02 | Run context persists | Run ID preserved across all navigation |
| CP-03 | Session context persists | Session ID preserved during session-scoped navigation |
| CP-04 | Workflow context on domain change | Source workflow state preserved when navigating to related domain |
| CP-05 | Lineage context on direction change | Current lineage node preserved when switching direction |
| CP-06 | Zone context on workflow change | Current zone state visible during all workflow navigation |
| CP-07 | Authority context on navigation | Authority boundary visible during all workflow navigation |
| CP-08 | Scroll position preserved | Scroll position preserved when returning to previous view |

### 3.2 Context Bar

```
PERSISTENT CONTEXT BAR (visible on all navigation views)

┌──────────────────────────────────────────────────────┐
│ {client} │ Run {run} │ Session: {id} │ Zone: {zone} │
│ S-State: {s} │ Workflows: {n} active │ Health: ●    │
├──────────────────────────────────────────────────────┤
│ BREADCRUMB: Workflow > {domain} > {instance} > {view}│
└──────────────────────────────────────────────────────┘

Context bar provides:
  - Persistent operational context (client, run, session, zone)
  - Current S-state and workflow count
  - Breadcrumb navigation trail
  - [Back] navigation preserving context stack
```

### 3.3 Navigation Context Stack

```
Context stack preserves navigation history:

  STACK (most recent on top):
  ┌──────────────────────────────────────────────────┐
  │ 4. WN-04 Replay > SEP-002 > Phase 3 > Lineage   │ ← current
  │ 3. WN-04 Replay > SEP-002 > Phase 3              │
  │ 2. WN-03 Overlay > SEP-002 > Activation Chain    │
  │ 1. WN-01 Lifecycle > Stage 4                     │
  └──────────────────────────────────────────────────┘

  [Back] pops the stack and restores previous view.
  Stack depth limit: 20 entries.
  Stack persists within session.
```

---

## 4. Workflow Branching Navigation

### 4.1 Workflow Branch Points

```
When a workflow branches (e.g., overlay → replay + rollback):

  WN-03 Overlay
  SEP-002 ACTIVATED
       │
       ├──────────▶ WN-04 Replay (SEP-002)
       │             Phase 3/6
       │
       └──────────▶ WN-05 Rollback (SEP-002)
                     Phase 2/5

  Branch point navigation:
    - Shows both branches from the branch point
    - Each branch is independently navigable
    - Context preserves which branch you came from
    - [← Return to Branch Point] available from either branch
```

### 4.2 Workflow Supersession Navigation

```
When a workflow is superseded:

  Old Session: SBX-{client}-{run}-v0 (SUPERSEDED)
       │
       └──▶ New Session: SBX-{client}-{run} (ACTIVE)
            Inherited: SEP-001 (authority-promoted only)
            Abandoned: provisional state from v0

  Supersession navigation:
    - Old session: read-only, all workflows frozen
    - New session: active, shows inherited state
    - [Compare Sessions] shows side-by-side
    - Inherited workflows carry forward; abandoned workflows archived
```

---

## 5. Workflow Archive Navigation

### 5.1 Archive Access

```
┌──────────────────────────────────────────────────────┐
│ WORKFLOW ARCHIVE                                      │
│ Session: SBX-{client}-{run}                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ COMPLETED WORKFLOWS (12)                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Chain    │ Instance        │ Completed  │ Result │ │
│ │──────────│─────────────────│────────────│────────│ │
│ │ WC-02    │ SEP-001 intake  │ 2026-05-08 │ ✓ OK   │ │
│ │ WC-02    │ SEP-002 intake  │ 2026-05-09 │ ✓ OK   │ │
│ │ WC-03    │ SEP-001 propose │ 2026-05-08 │ ✓ OK   │ │
│ │ WC-03    │ SEP-002 propose │ 2026-05-09 │ ✓ OK   │ │
│ │ WC-04    │ SEP-001 replay  │ 2026-05-09 │ ✓ CERT │ │
│ │ WC-05    │ SEP-001 rollback│ 2026-05-09 │ ✓ CERT │ │
│ │ WC-06    │ SEP-001 promote │ 2026-05-10 │ ✓ PROM │ │
│ │ ...      │                 │            │        │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAVIGATION                                            │
│   [Click any for read-only detail]                    │
│   [Filter: Chain | Domain | Date | Result]           │
│   [→ View Active Workflows]                          │
└──────────────────────────────────────────────────────┘
```

---

## 6. Governance

- Workflow coexistence: 7 rules (CX-01 through CX-07) enforced in navigation
- Concurrent workflow view: active, queued, and completed with filtering
- Workflow dependency graph navigable with handoff detail
- Context preservation: 8 rules (CP-01 through CP-08) ensuring no context loss
- Persistent context bar: client, run, session, zone, S-state, breadcrumb
- Navigation context stack: 20-entry depth with back navigation
- Workflow branching: independent branches navigable with return-to-branch
- Workflow supersession: old session read-only, new session shows inheritance
- Workflow archive: completed workflows remain navigable (read-only)
- Navigation does not create, modify, or terminate workflows
