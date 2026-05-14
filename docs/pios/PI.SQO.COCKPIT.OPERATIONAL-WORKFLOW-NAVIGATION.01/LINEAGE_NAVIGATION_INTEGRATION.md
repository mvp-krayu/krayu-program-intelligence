# Lineage Navigation Integration

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how workflow navigation integrates with lineage navigation —
ensuring operators can traverse from any workflow state to its
evidence chain, overlay chain, replay chain, rollback chain,
qualification chain, certification chain, and publication chain
without losing operational context.

---

## 2. Seven Lineage Types in Workflow Navigation

### 2.1 Lineage Type Integration

| # | Lineage Type | Workflow Domains | Entry Point | Navigation Direction |
|---|-------------|-----------------|-------------|---------------------|
| LN-01 | Evidence lineage | WN-02 (Evidence) | Source → intake → package | Forward: L0→L1→L2 |
| LN-02 | Overlay lineage | WN-03 (Overlay) | Package → proposal → activation | Forward: L2→L3 |
| LN-03 | Replay lineage | WN-04 (Replay) | Inputs → reconstruction → comparison | Forward: L3→L5 |
| LN-04 | Rollback lineage | WN-05 (Rollback) | Dependencies → removability → restoration | Forward: L3→L5 |
| LN-05 | Qualification lineage | WN-01 (Lifecycle) | Entries → metrics → S-state | Forward: L3→L4 |
| LN-06 | Certification lineage | WN-06 (Certification) | Replay cert + rollback cert → combined | Within L5 |
| LN-07 | Publication lineage | WN-07 (Publication) | Certification → promotion → publication | Forward: L5→published |

### 2.2 Lineage Navigation Directions

```
Three navigation directions from any workflow state:

  FORWARD (source → outcome):
    "Where does this evidence end up?"
    L0 → L1 → L2 → L3 → L4 → L5 → published

  BACKWARD (outcome → source):
    "Where did this authority come from?"
    published → L5 → L4 → L3 → L2 → L1 → L0

  ATTRIBUTION (metric → contributors):
    "What contributed to this qualification?"
    L4 metric → L3 entries → L2 packages → L1 sources
```

---

## 3. Workflow-to-Lineage Entry Points

### 3.1 Entry Points per Workflow Domain

| Workflow Domain | Lineage Entry | What It Shows |
|----------------|--------------|---------------|
| WN-02 Evidence | LN-01 at L0/L1/L2 | Source provenance, intake chain, package composition |
| WN-03 Overlay | LN-02 at L2/L3 | Package → proposal → approval → activation chain |
| WN-04 Replay | LN-03 at L3/L5 | Input inventory, reconstruction chain, certification |
| WN-05 Rollback | LN-04 at L3/L5 | Dependency chain, removability chain, restoration |
| WN-06 Certification | LN-06 at L5 | Replay cert + rollback cert → combined cert chain |
| WN-07 Publication | LN-07 at L5/pub | Certification → promotion → publication chain |
| WN-09 Sandbox | LN-01 through LN-07 | Session-scoped lineage across all types |

### 3.2 Lineage Entry Navigation

```
┌──────────────────────────────────────────────────────┐
│ LINEAGE NAVIGATION                                    │
│ Entry from: WN-04 Replay Certification                │
│ Overlay: SEP-multi-002  │  Direction: BACKWARD        │
├──────────────────────────────────────────────────────┤
│                                                       │
│ LINEAGE CHAIN (backward from certification)           │
│                                                       │
│ L5: Certification                                     │
│   └─ REPLAY_CERTIFIED (CE-01, hash: b4e7…)          │
│        │                                              │
│ L3: Reconstruction                                    │
│   └─ SEP-multi-002 (3 entries, hash: d1f9…)          │
│        │  │  │                                        │
│ L2: Package                                           │
│   └─ SEP-multi-002 (ACTIVATED)                       │
│        │  │  │                                        │
│ L1: Intake                                            │
│   ├─ EV-BE-001-004 (registered 2026-05-09)           │
│   ├─ EV-BE-001-005 (registered 2026-05-09)           │
│   └─ EV-BE-001-006 (registered 2026-05-10)           │
│        │  │  │                                        │
│ L0: Sources                                           │
│   ├─ DOC-api-reference (TRUSTED)                     │
│   ├─ ADR-007-security (TRUSTED)                      │
│   └─ OPS-monitoring-spec (PROVISIONAL)               │
│                                                       │
│ LINEAGE INTEGRITY: ● VERIFIED                        │
│ Chain hash: sha256(L0+L1+L2+L3+L5) = valid          │
│                                                       │
│ NAVIGATION                                            │
│   [Switch Direction: Forward | Backward | Attribution]│
│   [Click any node for detail]                         │
│   [→ Return to Replay Workflow]                      │
│   [→ View Full Lineage Chain]                        │
└──────────────────────────────────────────────────────┘
```

---

## 4. Attribution Navigation

### 4.1 Metric Attribution Navigation

```
┌──────────────────────────────────────────────────────┐
│ ATTRIBUTION NAVIGATION                                │
│ Target: grounding_score = 85.1%                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ATTRIBUTION CHAIN                                     │
│                                                       │
│ L4: Metric                                            │
│   grounding_score: 85.1%                             │
│   ├── contributed by:                                 │
│   │                                                   │
│ L3: Overlay Entries                                    │
│   ├── SEP-multi-001 entry 3 (+12.4%)                 │
│   ├── SEP-multi-001 entry 1 (+10.2%)                 │
│   ├── SEP-multi-002 entry 2 (+8.7%)                  │
│   ├── SEP-multi-001 entry 5 (+7.1%)                  │
│   └── (3 more entries with smaller contributions)    │
│        │                                              │
│ L2: Packages                                          │
│   ├── SEP-multi-001 (5 entries, 42.3% contribution)  │
│   └── SEP-multi-002 (3 entries, 31.8% contribution)  │
│        │                                              │
│ L1: Sources                                           │
│   ├── DOC-capability-matrix (28.1%)                  │
│   ├── ADR-003-architecture (19.4%)                   │
│   └── (4 more sources)                               │
│                                                       │
│ NAVIGATION                                            │
│   [Click contributor for source detail]               │
│   [View All Metrics] [View Entry Detail]             │
│   [→ Return to Qualification View]                   │
└──────────────────────────────────────────────────────┘
```

---

## 5. Session-Scoped Lineage Navigation

### 5.1 Session Lineage Scope

```
Within a session, lineage navigation is namespace-isolated:

  Session: SBX-{client}-{run}
  Namespace: SBX-{client}-{run}

  Only lineage within this namespace is navigable:
    ├── Evidence from this session's sources
    ├── Overlays in this session's chain
    ├── Replay/rollback for this session's overlays
    ├── Certification for this session's overlays
    └── Publication for this session's promoted overlays

  Cross-session lineage: NOT NAVIGABLE (namespace isolation)
  Predecessor lineage: READ-ONLY (for archived/superseded sessions)
```

### 5.2 Session Lineage Integrity Navigation

```
┌──────────────────────────────────────────────────────┐
│ SESSION LINEAGE INTEGRITY                             │
│ Session: SBX-{client}-{run}                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ LINEAGE HASH VERIFICATION                             │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Component             │ Status    │ Hash         │ │
│ │───────────────────────│───────────│──────────────│ │
│ │ Baseline hash         │ ✓ VALID   │ a3f2…       │ │
│ │ Overlay chain hash    │ ✓ VALID   │ d1f9…       │ │
│ │ Certification hash    │ ✓ VALID   │ 7c3a…       │ │
│ │ Authority state hash  │ ✓ VALID   │ e5b1…       │ │
│ │ Predecessor hash      │ ✓ VALID   │ 8f2d…       │ │
│ │ Session lineage hash  │ ✓ VALID   │ c4a7…       │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ INTEGRITY STATUS: ● ALL VERIFIED                     │
│ Last verified: 2026-05-11 12:34:01                   │
│                                                       │
│ NAVIGATION                                            │
│   [View Hash Computation Detail]                      │
│   [→ Session Overview] [→ Overlay Chain]             │
└──────────────────────────────────────────────────────┘
```

---

## 6. Lineage Search and Filter

### 6.1 Lineage Search Capabilities

| # | Capability | Description |
|---|-----------|-------------|
| LS-01 | Source search | Find lineage by source document name |
| LS-02 | Entry search | Find lineage by package entry ID |
| LS-03 | Overlay search | Find lineage by overlay ID |
| LS-04 | Metric search | Find lineage by metric name or value |
| LS-05 | Certification search | Find lineage by certification status |
| LS-06 | Hash search | Find lineage by hash value |

### 6.2 Lineage Filter Model

```
LINEAGE FILTERS

  Layer filter:    [L0] [L1] [L2] [L3] [L4] [L5] [All]
  Status filter:   [Active] [Certified] [Promoted] [All]
  Integrity filter:[Valid] [Broken] [All]
  Direction:       [Forward] [Backward] [Attribution]
  Time range:      [24h] [7d] [30d] [All]

  Filters apply to lineage navigation view.
  Active filters shown in breadcrumb.
```

---

## 7. Governance

- 7 lineage types integrated into workflow navigation (LN-01 through LN-07)
- 3 navigation directions (forward, backward, attribution) from any workflow state
- Workflow-to-lineage entry points per domain with context preservation
- Attribution navigation traces metrics to contributing sources
- Session-scoped lineage respects namespace isolation
- Session lineage integrity verification via hash chain
- 6 search capabilities and multi-dimensional filtering
- Lineage navigation is read-only — does not mutate lineage state
- Lineage traversal remains reconstructable
