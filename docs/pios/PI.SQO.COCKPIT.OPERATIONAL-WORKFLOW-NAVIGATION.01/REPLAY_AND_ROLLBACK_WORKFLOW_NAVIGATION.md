# Replay and Rollback Workflow Navigation

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate replay certification and rollback
certification workflows inside the SQO Cockpit — including pipeline
phase traversal, divergence investigation, ambiguity resolution,
and combined certification progression.

---

## 2. Replay Certification Navigation (WN-04)

### 2.1 Replay Pipeline Navigation

```
REPLAY CERTIFICATION PIPELINE (WC-04)

  Phase 1         Phase 2         Phase 3
  Input Inventory  Input Integrity  Reconstruction
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │ ✓ Complete │─▶│ ✓ Complete │─▶│ ● Active   │
  │ 8 inputs   │  │ 8/8 valid  │  │ rebuilding │
  │ identified │  │ hash match │  │ step 3/5   │
  └────────────┘  └────────────┘  └────────────┘
       │               │               │
  Phase 4         Phase 5         Phase 6
  Output Compare   Lineage Verif.  Certification
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │ ○ Pending  │─▶│ ○ Pending  │─▶│ ○ Pending  │
  │            │  │            │  │            │
  └────────────┘  └────────────┘  └────────────┘

  Overlay: SEP-multi-002  │  Session: SBX-{client}-{run}
  [◀ Overlay Chain] [Phase Detail ▶] [View Replay Events]
```

### 2.2 Replay Phase Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ REPLAY PHASE 3: Deterministic Reconstruction          │
│ Overlay: SEP-multi-002  │  Status: ACTIVE             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ RECONSTRUCTION STEPS                                  │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Step                      │ Status   │ Primitive │ │
│ │───────────────────────────│──────────│───────────│ │
│ │ RP-01 Baseline load       │ ✓ Done   │ Load      │ │
│ │ RP-02 Overlay application │ ✓ Done   │ Apply     │ │
│ │ RP-03 Conflict resolution │ ● Active │ Resolve   │ │
│ │ RP-04 Metric computation  │ ○ Next   │ Compute   │ │
│ │ RP-05 State hashing       │ ○ Next   │ Hash      │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ RECONSTRUCTION INPUTS                                 │
│   Baseline: BL-{client}-{run}-001 (hash: a3f2…)     │
│   Overlay: SEP-multi-002 (3 entries)                 │
│   Resolution rules: 2 conflict rules applied         │
│                                                       │
│ DETERMINISM INVARIANTS                                │
│   DI-01 through DI-08: 6/8 verified (2 pending)     │
│   [View Invariant Detail]                             │
│                                                       │
│ GATE: G-RECONSTRUCTION                                │
│   Type: Automatic (GT-01)                             │
│   Status: EVALUATING                                  │
│   Criteria: Reconstruction hash matches original      │
│                                                       │
│ NAVIGATION                                            │
│   [← Phase 2: Integrity] [Phase 4: Comparison →]    │
│   [View Inputs] [View Reconstruction Audit Trail]    │
│   [View Lineage: L3→L5]                              │
└──────────────────────────────────────────────────────┘
```

### 2.3 Divergence Investigation Navigation

```
┌──────────────────────────────────────────────────────┐
│ DIVERGENCE INVESTIGATION                              │
│ Overlay: SEP-multi-002  │  Type: DIV-02 (Field)      │
├──────────────────────────────────────────────────────┤
│                                                       │
│ DIVERGENCE DETAIL                                     │
│   Detection phase: Phase 4 (Output Comparison)        │
│   Severity: MODERATE                                  │
│   Field: grounding_score                              │
│   Expected: 85.1%  │  Actual: 85.3%                 │
│   Delta: 0.2%                                        │
│                                                       │
│ ROOT CAUSE INVESTIGATION                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Step                   │ Status    │ Finding     │ │
│ │────────────────────────│───────────│─────────────│ │
│ │ 1. Capture divergence  │ ✓ Done    │ Recorded    │ │
│ │ 2. Classify root cause │ ✓ Done    │ RC-01       │ │
│ │ 3. Trace to source     │ ● Active  │ In progress │ │
│ │ 4. Assess impact       │ ○ Pending │             │ │
│ │ 5. Determine action    │ ○ Pending │             │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ROOT CAUSE: RC-01 (Baseline Drift)                    │
│   Baseline updated between original and replay        │
│   [View Baseline Diff] [View Timeline]               │
│                                                       │
│ NAVIGATION                                            │
│   [← Replay Pipeline] [→ Certification Decision]    │
│   [View Full Divergence Report]                       │
│   [View Root Cause Categories (RC-01 through RC-07)] │
└──────────────────────────────────────────────────────┘
```

---

## 3. Rollback Certification Navigation (WN-05)

### 3.1 Rollback Pipeline Navigation

```
ROLLBACK CERTIFICATION PIPELINE (WC-05)

  Phase 1           Phase 2           Phase 3
  Dependency Inv.    Removability      State Restoration
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ ✓ Complete   │─▶│ ● Active     │─▶│ ○ Pending    │
  │ 2 deps found │  │ 5/7 checks   │  │              │
  │ 0 cascades   │  │ IR-01–IR-05✓ │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘
       │                  │                  │
  Phase 4           Phase 5
  Cascade Safety     Certification
  ┌──────────────┐  ┌──────────────┐
  │ ○ Pending    │─▶│ ○ Pending    │
  │              │  │              │
  └──────────────┘  └──────────────┘

  Overlay: SEP-multi-002  │  Session: SBX-{client}-{run}
  [◀ Overlay Chain] [Phase Detail ▶] [View Rollback Events]
```

### 3.2 Rollback Phase Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ ROLLBACK PHASE 2: Independent Removability            │
│ Overlay: SEP-multi-002  │  Status: ACTIVE             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ REMOVABILITY CHECKS                                   │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Check                       │ Status   │ Result  │ │
│ │─────────────────────────────│──────────│─────────│ │
│ │ IR-01 No dependent overlays │ ✓ PASS   │ 0 deps  │ │
│ │ IR-02 No shared state       │ ✓ PASS   │ Isolated│ │
│ │ IR-03 No cascade triggers   │ ✓ PASS   │ None    │ │
│ │ IR-04 Metrics recomputable  │ ✓ PASS   │ All 12  │ │
│ │ IR-05 State hash restorable │ ✓ PASS   │ Hash OK │ │
│ │ IR-06 No authority impact   │ ● CHECK  │ Checking│ │
│ │ IR-07 Zone stability safe   │ ○ PEND   │         │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ DEPENDENCY MAP                                        │
│   SEP-multi-002 depends on: (none)                   │
│   Depends on SEP-multi-002: SEP-multi-003            │
│   Cascade depth: 1 (within limit of 3)              │
│   Cascade size: 1 (within limit of 5)               │
│                                                       │
│ GATE: G-REMOVABILITY                                  │
│   Type: Automatic (GT-01)                             │
│   Status: EVALUATING (5/7 checks complete)            │
│                                                       │
│ NAVIGATION                                            │
│   [← Phase 1: Dependencies] [Phase 3: Restoration →]│
│   [View Dependency Map] [View Cascade Analysis]      │
│   [→ Replay Certification (same overlay)]            │
└──────────────────────────────────────────────────────┘
```

### 3.3 Ambiguity Investigation Navigation

```
┌──────────────────────────────────────────────────────┐
│ AMBIGUITY INVESTIGATION                               │
│ Overlay: SEP-multi-002  │  Type: AMB-01 (Incomplete) │
├──────────────────────────────────────────────────────┤
│                                                       │
│ AMBIGUITY DETAIL                                      │
│   Detection phase: Phase 1 (Dependency Inventory)     │
│   Severity: MODERATE                                  │
│   Missing: 1 input source hash not in inventory       │
│                                                       │
│ RESOLUTION                                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Action                 │ Status    │ Outcome     │ │
│ │────────────────────────│───────────│─────────────│ │
│ │ Identify missing input │ ✓ Done    │ EV-003      │ │
│ │ Locate source          │ ✓ Done    │ Found       │ │
│ │ Verify hash            │ ● Active  │ Checking    │ │
│ │ Update inventory       │ ○ Pending │             │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ NAVIGATION                                            │
│   [← Rollback Pipeline] [→ Certification Decision]  │
│   [View Ambiguity Types (AMB-01 through AMB-05)]     │
│   [View Resolution History]                           │
└──────────────────────────────────────────────────────┘
```

---

## 4. Combined Certification Navigation

### 4.1 Combined Certification Status

```
┌──────────────────────────────────────────────────────┐
│ COMBINED CERTIFICATION STATUS                         │
│ Session: SBX-{client}-{run}                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PER-OVERLAY CERTIFICATION MATRIX                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay       │ Replay    │ Rollback  │ Combined │ │
│ │───────────────│───────────│───────────│──────────│ │
│ │ SEP-multi-001 │ ✓ CERT    │ ✓ CERT    │ ✓ CERT   │ │
│ │ SEP-multi-002 │ ● Phase 3 │ ● Phase 2 │ ○ PEND   │ │
│ │ SEP-multi-003 │ ○ NOT STR │ ○ NOT STR │ ○ PEND   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ SESSION CERTIFICATION SUMMARY                         │
│   Certified: 1/3 overlays                            │
│   In progress: 1/3 overlays                          │
│   Not started: 1/3 overlays                          │
│   Combined gate: BLOCKED (pending SEP-002, SEP-003)  │
│                                                       │
│ NAVIGATION                                            │
│   [Click overlay for replay/rollback detail]          │
│   [→ Authority Promotion (if eligible)]              │
│   [→ Divergence Investigations]                       │
│   [→ Ambiguity Investigations]                        │
└──────────────────────────────────────────────────────┘
```

### 4.2 Replay-Rollback Cross-Navigation

| From | To | Context Preserved |
|------|----|-------------------|
| Replay pipeline | Rollback pipeline (same overlay) | Overlay ID, certification status, inputs |
| Rollback pipeline | Replay pipeline (same overlay) | Overlay ID, certification status, dependencies |
| Replay divergence | Root cause investigation | Divergence type, severity, source |
| Rollback ambiguity | Ambiguity resolution | Ambiguity type, missing inputs |
| Combined certification | Authority promotion | Overlay ID, combined cert evidence |
| Combined certification | Quarantine | Failure reason, overlay, investigation |

---

## 5. Governance

- Replay certification: 6-phase pipeline navigation with per-step tracking
- Rollback certification: 5-phase pipeline with removability checks
- Divergence investigation: 5-step investigation with root cause navigation
- Ambiguity investigation: resolution workflow with source verification
- Combined certification matrix: per-overlay status across replay + rollback
- Cross-navigation: replay ↔ rollback with full overlay context preservation
- Navigation does not trigger or modify certification state
