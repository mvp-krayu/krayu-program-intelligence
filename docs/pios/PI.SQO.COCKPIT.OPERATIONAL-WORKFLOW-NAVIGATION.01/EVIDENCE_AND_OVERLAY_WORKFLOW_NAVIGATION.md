# Evidence and Overlay Workflow Navigation

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate evidence intake workflows and overlay
proposal/approval workflows inside the SQO Cockpit — including
pipeline phases, gate transitions, packaging state, and activation
chain progression.

---

## 2. Evidence Workflow Navigation (WN-02)

### 2.1 Evidence Intake Pipeline Navigation

```
EVIDENCE INTAKE PIPELINE NAVIGATION

  Phase 1       Phase 2       Phase 3       Phase 4
  Source Class.  Trust Eval.   Extraction    Normalization
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ ✓ Done   │─▶│ ✓ Done   │─▶│ ● Active │─▶│ ○ Next   │
  │ 6 sources│  │ 4 TRUSTED│  │ extracting│  │ pending  │
  │ classified│  │ 2 PROV.  │  │ 3/6 done │  │          │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
       │              │              │              │
  Phase 5       Phase 6       Phase 7
  Provenance    Validation    Registration
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ ○ Future │─▶│ ○ Future │─▶│ ○ Future │
  │          │  │          │  │          │
  └──────────┘  └──────────┘  └──────────┘

  [◀ Source List] [Phase Detail ▶] [View Pipeline Events]
```

### 2.2 Evidence Phase Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ EVIDENCE PHASE: Extraction (Phase 3)                  │
│ Status: ACTIVE  │  Progress: 3/6 sources              │
├──────────────────────────────────────────────────────┤
│                                                       │
│ SOURCES IN PHASE                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Source                │ Status      │ Trust       │ │
│ │──────────────────────│─────────────│─────────────│ │
│ │ DOC-capability-matrix│ ✓ Extracted │ TRUSTED     │ │
│ │ ADR-003-architecture │ ✓ Extracted │ TRUSTED     │ │
│ │ OPS-deployment-log   │ ✓ Extracted │ PROVISIONAL │ │
│ │ DOC-api-reference    │ ● Extracting│ TRUSTED     │ │
│ │ ADR-007-security     │ ○ Queued    │ TRUSTED     │ │
│ │ EXT-vendor-spec      │ ○ Queued    │ PROVISIONAL │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ GATE: G-EXTRACT                                       │
│   Type: Automatic (GT-01)                             │
│   Status: EVALUATING (3/6 sources complete)           │
│   Criteria: All sources extracted without error       │
│                                                       │
│ NAVIGATION                                            │
│   [← Phase 2: Trust] [Phase 4: Normalize →]          │
│   [View Source Detail] [View Lineage: L0→L1]         │
│   [→ Overlay Domain (if packaged)]                   │
└──────────────────────────────────────────────────────┘
```

### 2.3 Evidence Packaging Navigation

```
┌──────────────────────────────────────────────────────┐
│ EVIDENCE PACKAGING                                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PACKAGES                                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Package           │ Entries │ Status    │ Trust   │ │
│ │───────────────────│─────────│───────────│─────────│ │
│ │ SEP-multi-001     │ 5       │ ACTIVATED │ CERT    │ │
│ │ SEP-multi-002     │ 3       │ ACTIVATED │ CERT    │ │
│ │ SEP-multi-003     │ 4       │ STAGED    │ PROV    │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PACKAGING STEPS (for SEP-multi-003)                   │
│   Step 1: Evidence selection    │ ✓ Complete          │
│   Step 2: Entry classification  │ ✓ Complete          │
│   Step 3: Conflict detection    │ ● In progress       │
│   Step 4: Package sealing       │ ○ Pending           │
│                                                       │
│ NAVIGATION                                            │
│   [View Package Entries] [View Evidence Sources]     │
│   [→ Overlay Proposal (if staged)]                   │
│   [View Lineage: L1→L2]                              │
└──────────────────────────────────────────────────────┘
```

---

## 3. Overlay Workflow Navigation (WN-03)

### 3.1 Overlay Proposal Pipeline Navigation

```
OVERLAY PROPOSAL PIPELINE NAVIGATION

  Phase 1        Phase 2        Phase 3        Phase 4
  Select Overlay Classify       Impact Assess. Replay Proj.
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ ✓ Done   │─▶│ ✓ Done   │─▶│ ● Active │─▶│ ○ Next   │
  │ OVL-003  │  │ MULTI    │  │ assessing│  │ pending  │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
       │              │              │              │
  Phase 5        Phase 6        Phase 7        Phase 8
  Rollback Proj. Zone Proj.     Review         Approval
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ ○ Future │─▶│ ○ Future │─▶│ ○ Future │─▶│ ○ Future │
  │          │  │          │  │          │  │          │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘

  [◀ Package Source] [Phase Detail ▶] [View Proposal Events]
```

### 3.2 Overlay Proposal Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ OVERLAY PROPOSAL: OVL-{client}-{run}-003             │
│ Phase: Impact Assessment (3/8)  │  Status: ACTIVE     │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PROPOSAL SUMMARY                                      │
│   Package: SEP-multi-003 (4 entries)                 │
│   Classification: MULTI (multi-evidence overlay)     │
│   Overlay type: Qualification extension              │
│                                                       │
│ IMPACT ASSESSMENT                                     │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Dimension           │ Assessment   │ Risk        │ │
│ │─────────────────────│──────────────│─────────────│ │
│ │ Replay impact       │ MODERATE     │ 2 inputs    │ │
│ │ Rollback impact     │ LOW          │ 0 dependents│ │
│ │ Certification impact│ MODERATE     │ Phase 3/6   │ │
│ │ Zone impact         │ NONE         │ stays SAFE  │ │
│ │ Coexistence impact  │ LOW          │ no conflicts│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ GATE: G-IMPACT                                        │
│   Type: Approval (GT-02)                              │
│   Status: PENDING — requires operator review          │
│   [View Full Impact Report]                           │
│                                                       │
│ NAVIGATION                                            │
│   [← Phase 2: Classify] [Phase 4: Replay Proj. →]   │
│   [View Package Source: SEP-multi-003]               │
│   [→ Approval Review] [View Lineage: L2→L3]         │
└──────────────────────────────────────────────────────┘
```

### 3.3 Overlay Activation Chain Navigation

```
┌──────────────────────────────────────────────────────┐
│ OVERLAY ACTIVATION CHAIN                              │
│ Session: SBX-{client}-{run}  │  Chain length: 3      │
├──────────────────────────────────────────────────────┤
│                                                       │
│ CHAIN (ordered by activation — monotonic)             │
│                                                       │
│   #1  SEP-multi-001 ─────────────────────── PROMOTED │
│       │  Activated: 2026-05-08  │  Cert: COMBINED    │
│       │  Entries: 5  │  Auth: AUTHORITY_PROMOTED      │
│       ▼                                               │
│   #2  SEP-multi-002 ─────────────────── CERTIFYING   │
│       │  Activated: 2026-05-10  │  Cert: REPLAY_DONE │
│       │  Entries: 3  │  Auth: PROVISIONAL             │
│       ▼                                               │
│   #3  SEP-multi-003 ──────────────────── PROPOSING   │
│       │  Proposed: 2026-05-11  │  Cert: NOT STARTED  │
│       │  Entries: 4  │  Auth: PROVISIONAL             │
│                                                       │
│ CHAIN INTEGRITY: ● VERIFIED (hash-chain valid)       │
│                                                       │
│ NAVIGATION                                            │
│   [Click overlay for detail]                          │
│   [→ Certification Status] [→ Authority Boundary]    │
│   [View Chain History] [View Coexistence]            │
└──────────────────────────────────────────────────────┘
```

---

## 4. Evidence-to-Overlay Cross-Navigation

### 4.1 Cross-Navigation Flow

```
Evidence Domain (WN-02)        Overlay Domain (WN-03)
┌─────────────────────┐       ┌─────────────────────┐
│ Source → Intake →   │──────▶│ Proposal → Approval │
│ Package → Stage     │  SEP  │ → Activation        │
└─────────────────────┘       └─────────────────────┘
     │                              │
     │ Lineage: L0→L1→L2           │ Lineage: L2→L3
     ▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐
│ Evidence Lineage    │◀─────▶│ Overlay Lineage      │
│ Navigation          │       │ Navigation           │
└─────────────────────┘       └─────────────────────┘

Context preserved across navigation:
  - Package ID (links evidence to overlay)
  - Trust level (evidence trust → overlay trust)
  - Source list (evidence sources → overlay inputs)
  - Entry count (package entries → overlay entries)
```

---

## 5. Governance

- Evidence intake: 7-phase pipeline navigation with per-source tracking
- Evidence packaging: 4-step packaging with package-level navigation
- Overlay proposal: 8-phase pipeline navigation with impact assessment
- Overlay activation chain: monotonic ordering with hash-verified integrity
- Cross-domain navigation: evidence → overlay with full context preservation
- All gates navigable with prerequisite detail and blocking conditions
- Navigation does not mutate evidence or overlay state
