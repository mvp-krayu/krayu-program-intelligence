# Replay and Rollback Certification Visibility

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how replay certification and rollback certification become
operationally visible inside the cockpit — including pipeline
progress, hash integrity, determinism verification, dependency
inventory, removability status, cascade safety, and combined
certification decisions.

---

## 2. Replay Certification Visibility (CV-03)

### 2.1 Replay Certification Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ REPLAY CERTIFICATION VISIBILITY                                      │
│ Session: SBX-{client}-{run}  │  Health: ◐ ATTENTION                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ PIPELINE OVERVIEW                                                    │
│   Total overlays: 3  │  Certified: 1  │  In Progress: 1  │  Pend: 1│
│   Success rate: 100% (1/1 complete)                                 │
│   Avg certification time: 6.5h                                      │
│                                                                      │
│ ACTIVE REPLAY PIPELINE: SEP-multi-002                               │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Phase                  │ Status    │ Duration │ Hash/Result     │ │
│ │────────────────────────│───────────│──────────│─────────────────│ │
│ │ Ph1: Input Inventory   │ ✓ PASSED  │ 0h 30m   │ input_hash: a7b│ │
│ │ Ph2: Input Integrity   │ ✓ PASSED  │ 0h 30m   │ 6/6 verified   │ │
│ │ Ph3: Reconstruction    │ ● ACTIVE  │ 2h 00m   │ 85% complete   │ │
│ │ Ph4: Output Comparison │ ○ PENDING │ —        │ —              │ │
│ │ Ph5: Lineage Verify    │ ○ PENDING │ —        │ —              │ │
│ │ Ph6: Cert Decision     │ ○ PENDING │ —        │ —              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ INPUT INVENTORY (Phase 1)                                            │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Input              │ Status    │ Hash                           │ │
│ │────────────────────│───────────│────────────────────────────────│ │
│ │ I-01 Baseline      │ ✓ Verified│ c4e1…                         │ │
│ │ I-02 Overlay set   │ ✓ Verified│ 2 overlays enumerated         │ │
│ │ I-03 App order     │ ✓ Verified│ monotonic confirmed           │ │
│ │ I-04 Conflict res  │ ✓ Verified│ 3 conflicts recorded          │ │
│ │ I-05 Qual params   │ ✓ Verified│ v1.2                          │ │
│ │ I-06 Gov config    │ ✓ Verified│ v1.0                          │ │
│ │ Input inventory hash│ ✓ Computed│ a7b2…c4e1                    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ RECONSTRUCTION PROGRESS (Phase 3)                                    │
│   Entries applied: 42/50  │  Skipped: 0  │  Conflicts: 3/3         │
│   Determinism: VERIFIED (so far)                                    │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Phase Detail] [View Input Hashes]                           │
│   [View Reconstruction Log] [→ Rollback Pipeline]                   │
│   [→ Combined Certification] [→ Lineage]                            │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Replay Hash Integrity Visibility

```
┌─────────────────────────────────────────────────────────────────────┐
│ REPLAY HASH INTEGRITY                                                │
│ Overlay: SEP-multi-001 (REPLAY_CERTIFIED)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ HASH COMPARISON                                                      │
│   Input hash:          a7b2…c4e1                                    │
│   Reconstructed hash:  f3d1…8a2b                                    │
│   Current state hash:  f3d1…8a2b                                    │
│   Match: ✓ IDENTICAL                                                │
│                                                                      │
│ DOUBLE-REPLAY VERIFICATION                                           │
│   Replay 1 hash: f3d1…8a2b                                         │
│   Replay 2 hash: f3d1…8a2b                                         │
│   Consistent: ✓ DETERMINISTIC                                       │
│                                                                      │
│ LINEAGE VERIFICATION (6 types)                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Lineage Type           │ Status     │ Chains Verified          │ │
│ │────────────────────────│────────────│──────────────────────────│ │
│ │ Substrate lineage      │ ✓ VERIFIED │ 1 chain                  │ │
│ │ Overlay lineage        │ ✓ VERIFIED │ 1 chain                  │ │
│ │ Orchestration lineage  │ ✓ VERIFIED │ 1 chain                  │ │
│ │ Qualification lineage  │ ✓ VERIFIED │ 4 metrics traced         │ │
│ │ Evidence lineage       │ ✓ VERIFIED │ 12 entries traced        │ │
│ │ Authority lineage      │ ✓ VERIFIED │ 1 chain (this cert)      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ CERTIFICATION EVIDENCE: RCERT-BE-001-017                            │
│   Decision: REPLAY_CERTIFIED                                        │
│   Timestamp: 2026-05-09 14:30                                       │
│   Evidence hash: b4e7…                                              │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Evidence Record] [View Audit Trail (CE-03)]                 │
│   [→ Rollback Certification] [→ Combined]                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Rollback Certification Visibility (CV-04)

### 3.1 Rollback Certification Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ ROLLBACK CERTIFICATION VISIBILITY                                    │
│ Session: SBX-{client}-{run}  │  Health: ◐ ATTENTION                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ PIPELINE OVERVIEW                                                    │
│   Total overlays: 3  │  Certified: 1  │  In Progress: 1  │  Pend: 1│
│   Success rate: 100% (1/1 complete)                                 │
│                                                                      │
│ ACTIVE ROLLBACK PIPELINE: SEP-multi-002                             │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Phase                  │ Status    │ Duration │ Result           │ │
│ │────────────────────────│───────────│──────────│──────────────────│ │
│ │ Ph1: Dependency Inv.   │ ✓ PASSED  │ 0h 20m   │ 3 deps found    │ │
│ │ Ph2: Removability      │ ● ACTIVE  │ 1h 10m   │ 5/7 checked     │ │
│ │ Ph3: State Restoration │ ○ PENDING │ —        │ —               │ │
│ │ Ph4: Cascade Safety    │ ○ PENDING │ —        │ —               │ │
│ │ Ph5: Cert Decision     │ ○ PENDING │ —        │ —               │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ DEPENDENCY INVENTORY (Phase 1)                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Dependency Type        │ Count │ Risk Level                     │ │
│ │────────────────────────│───────│────────────────────────────────│ │
│ │ D-01 Domain overlap    │ 2     │ LOW (soft)                     │ │
│ │ D-02 Conflict res dep  │ 1     │ LOW (reversible)               │ │
│ │ D-03 Qualification dep │ 2     │ MEDIUM (metrics affected)      │ │
│ │ D-04 Lineage dep       │ 0     │ NONE                           │ │
│ │ D-05 Supersession dep  │ 0     │ NONE                           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ REMOVABILITY CHECK PROGRESS (Phase 2)                                │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Check                  │ Status    │ Detail                     │ │
│ │────────────────────────│───────────│────────────────────────────│ │
│ │ IR-01 No hard deps     │ ✓ PASS    │ soft deps only             │ │
│ │ IR-02 Conflict revers. │ ✓ PASS    │ 1/1 reversible             │ │
│ │ IR-03 Quals recompute  │ ✓ PASS    │ all metrics recomputable   │ │
│ │ IR-04 Lineage intact   │ ✓ PASS    │ no chains broken           │ │
│ │ IR-05 Supersession ok  │ ✓ PASS    │ no supersession deps       │ │
│ │ IR-06 No side effects  │ ● CHECK   │ scanning governance log    │ │
│ │ IR-07 Batch compatible │ ○ PENDING │ —                          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Dependency Graph] [View Removability Detail]                │
│   [→ Replay Certification] [→ Cascade Analysis]                    │
│   [→ Combined Certification]                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Rollback Cascade Visibility

```
┌─────────────────────────────────────────────────────────────────────┐
│ CASCADE SAFETY ANALYSIS                                              │
│ Overlay: SEP-multi-001 (ROLLBACK_CERTIFIED)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ CASCADE METRICS                                                      │
│   Cascade depth: 1 (limit: 3)                                      │
│   Cascade size: 0 (limit: 5)                                       │
│   Qualification impact: WITHIN_ZONE                                 │
│   Governance impact: SAFE → SAFE                                    │
│                                                                      │
│ DIRECT CASCADE                                                       │
│   No overlays require cascade rollback                              │
│                                                                      │
│ S-STATE REGRESSION ASSESSMENT                                        │
│   Current S-state: S2                                               │
│   Post-rollback S-state: S1                                         │
│   Regression: S2 → S1 (acceptable — S1 previously certified)       │
│                                                                      │
│ DOUBLE-ROLLBACK VERIFICATION                                         │
│   Rollback 1 hash: d8f2…                                           │
│   Rollback 2 hash: d8f2…                                           │
│   Consistent: ✓ DETERMINISTIC                                       │
│                                                                      │
│ STATE RESTORATION                                                    │
│   Expected hash: d8f2…                                              │
│   Simulated hash: d8f2…                                             │
│   Match: ✓ VERIFIED                                                 │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Cascade Graph] [View S-State Regression Detail]             │
│   [→ Replay Certification] [→ Combined Certification]              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Combined Certification Visibility

### 4.1 Combined Certification Decision View

```
┌─────────────────────────────────────────────────────────────────────┐
│ COMBINED CERTIFICATION                                               │
│ Overlay: SEP-multi-001                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ CERTIFICATION EVIDENCE CHAIN                                        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Evidence             │ ID                  │ Decision           │ │
│ │──────────────────────│─────────────────────│────────────────────│ │
│ │ CE-01 Replay cert    │ RCERT-BE-001-017    │ REPLAY_CERTIFIED   │ │
│ │ CE-02 Rollback cert  │ RBCERT-BE-001-012   │ ROLLBACK_CERTIFIED │ │
│ │ CE-03 Audit trail    │ RAUD-BE-001-009     │ COMPLETE           │ │
│ │ CE-06 Combined cert  │ CERT-BE-001-009     │ PROMOTION_ELIGIBLE │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ COMBINED DECISION: PROMOTION_ELIGIBLE                               │
│   Replay: REPLAY_CERTIFIED  │  Rollback: ROLLBACK_CERTIFIED        │
│   Certified for: AUTHORITY_PROMOTION, PUBLICATION_ELIGIBILITY       │
│   Restrictions: none                                                │
│                                                                      │
│ ZONE AT CERTIFICATION                                               │
│   Zone: SAFE  │  Escalation: G-0                                    │
│   Zone projection post-promotion: SAFE (no degradation)             │
│                                                                      │
│ HASH CHAIN                                                           │
│   Replay evidence hash:   b4e7…                                    │
│   Rollback evidence hash: 9a1c…                                    │
│   Combined evidence hash: 7c3a…                                    │
│   Chain integrity: ✓ VERIFIED                                       │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Replay Detail] [View Rollback Detail]                       │
│   [View Evidence Hashes] [View Audit Trail]                         │
│   [→ Authority Promotion] [→ Lineage (L5)]                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Divergence and Non-Determinism Visibility

### 5.1 Divergence Monitor

```
DIVERGENCE VISIBILITY

  Active divergences: 0
  Resolved divergences (30d): 0
  Non-determinism events: 0

  IF DIVERGENCE DETECTED:
  ┌─────────────────────────────────────────────────────┐
  │ DIVERGENCE ALERT                                     │
  │ Type: CRJ-01 (replay hash divergence)               │
  │ Severity: CRITICAL                                   │
  │ Overlay: SEP-multi-XXX                               │
  │ Expected hash: xxxx…                                │
  │ Actual hash: yyyy…                                  │
  │ Delta: {fields that differ}                         │
  │ Impact: QUARANTINE_TRIGGERED                        │
  │ Action: Investigation required                       │
  │ [View Divergence Detail] [View Investigation]       │
  └─────────────────────────────────────────────────────┘
```

---

## 6. Governance

- Replay certification: 6-phase pipeline visible per overlay with hash verification at every phase
- Input inventory: 6 replay inputs visible with hash status
- Double-replay verification visible with determinism confirmation
- 6 lineage types verified with per-type status
- Rollback certification: 5-phase pipeline visible per overlay
- 5 dependency types with risk level
- 7 removability checks with per-check status
- Cascade safety: depth, size, qualification impact, governance impact
- Combined certification: evidence chain with hash integrity
- Divergence and non-determinism monitoring visible
- Visibility does not mutate certification state
