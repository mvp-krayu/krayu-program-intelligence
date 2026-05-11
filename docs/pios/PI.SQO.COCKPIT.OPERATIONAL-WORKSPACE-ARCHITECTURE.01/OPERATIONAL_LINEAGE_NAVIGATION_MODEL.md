# Operational Lineage Navigation Model

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKSPACE-ARCHITECTURE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate lineage within the cockpit —
tracing evidence lineage, overlay lineage, replay lineage,
rollback lineage, qualification lineage, certification lineage,
and publication lineage, all of which must remain reconstructable.

---

## 2. Seven Lineage Navigation Types

### 2.1 Lineage Type Definitions

| # | Type | Description | Layers Traversed |
|---|------|-------------|-----------------|
| LN-01 | Evidence lineage | Source → intake → package entry | L0 → L1 → L2 |
| LN-02 | Overlay lineage | Package → proposal → activation | L2 → L3 |
| LN-03 | Replay lineage | Inputs → reconstruction → comparison | L3 → L5 |
| LN-04 | Rollback lineage | Dependencies → removability → restoration | L3 → L5 |
| LN-05 | Qualification lineage | Entries → metrics → S-state | L3 → L4 |
| LN-06 | Certification lineage | Replay cert + rollback cert → combined cert | L5 |
| LN-07 | Publication lineage | Certification → promotion → publication | L5 → published |

### 2.2 Lineage Navigation Directions

```
Three audit directions:

  Forward (source → outcome):
    L0 → L1 → L2 → L3 → L4 → L5 → published
    "Where did this evidence end up?"

  Backward (outcome → source):
    published → L5 → L4 → L3 → L2 → L1 → L0
    "Where did this authority come from?"

  Attribution (metric → contributors):
    L4 metric → L3 entries → L2 packages → L1 sources
    "What contributed to this qualification?"
```

---

## 3. Lineage Navigation Workspace

### 3.1 Lineage Navigation View

```
┌──────────────────────────────────────────────────────┐
│ LINEAGE NAVIGATION                                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ NAVIGATION MODE: [Forward] [Backward] [Attribution]  │
│                                                       │
│ CURRENT FOCUS: SEP-multi-001 (Overlay)               │
│                                                       │
│ LINEAGE CHAIN                                         │
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                   │ │
│ │ L0: External Sources                              │ │
│ │   ├─ DOC-capability-matrix (TRUSTED)             │ │
│ │   ├─ ADR-003-architecture (TRUSTED)              │ │
│ │   └─ OPS-deployment-log (PROVISIONAL)            │ │
│ │        │                                          │ │
│ │ L1: Intake Registration                           │ │
│ │   ├─ EV-BE-001-001 (registered 2026-05-10)      │ │
│ │   ├─ EV-BE-001-002 (registered 2026-05-10)      │ │
│ │   └─ EV-BE-001-003 (registered 2026-05-10)      │ │
│ │        │                                          │ │
│ │ L2: Package Entry                                 │ │
│ │   └─ SEP-multi-001 (5 entries, STAGED→ACTIVATED) │ │
│ │        │                                          │ │
│ │ L3: Overlay Activation                            │ │
│ │   └─ Activated 2026-05-10 (application order: 1) │ │
│ │        │                                          │ │
│ │ L4: Qualification Influence                       │ │
│ │   └─ grounding_ratio: +12.2%                     │ │
│ │        │                                          │ │
│ │ L5: Certification                                 │ │
│ │   ├─ RCERT-BE-001-015 (REPLAY_CERTIFIED)        │ │
│ │   ├─ RBCERT-BE-001-010 (ROLLBACK_CERTIFIED)     │ │
│ │   └─ CERT-BE-001-007 (PROMOTION_ELIGIBLE)       │ │
│ │        │                                          │ │
│ │ Authority: AUTHORITY_PROMOTED                     │ │
│ │                                                   │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ [Each node is clickable → navigates to domain detail] │
└──────────────────────────────────────────────────────┘
```

---

## 4. Attribution Navigation

### 4.1 Metric-to-Source Attribution

```
┌──────────────────────────────────────────────────────┐
│ ATTRIBUTION: grounding_ratio = 85.1%                 │
├──────────────────────────────────────────────────────┤
│                                                       │
│ CONTRIBUTORS                                          │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Baseline contribution: 55.0% (45/67 fields)      │ │
│ │   Source: PIPELINE_CERTIFIED baseline             │ │
│ │                                                   │ │
│ │ SEP-multi-001 contribution: +12.2%               │ │
│ │   Entries: 5 (grounding class)                   │ │
│ │   Sources: DOC-cap-matrix, ADR-003               │ │
│ │   Status: AUTHORITY_PROMOTED                      │ │
│ │                                                   │ │
│ │ SEP-multi-002 contribution: +11.9%               │ │
│ │   Entries: 8 (continuity class)                  │ │
│ │   Sources: OPS-deploy-log, NAR-narrative         │ │
│ │   Status: REPLAY_CERTIFIED (promotion pending)   │ │
│ │                                                   │ │
│ │ SEP-multi-003 contribution: +6.0%                │ │
│ │   Entries: 4 (semantic class)                    │ │
│ │   Sources: DOC-requirements                      │ │
│ │   Status: ACTIVATED (certification pending)      │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ AUTHORITY vs PROVISIONAL                              │
│ Authority-backed grounding: 67.2% (baseline + SEP-001)│
│ Provisional grounding: +17.9% (SEP-002 + SEP-003)   │
│ Total composite grounding: 85.1%                      │
└──────────────────────────────────────────────────────┘
```

---

## 5. Cross-Domain Lineage Links

### 5.1 Lineage Link Model

```
Every lineage node has links to its governing domain:

  L0 node → Evidence Domain (WD-02) — source detail
  L1 node → Evidence Domain (WD-02) — intake record
  L2 node → Evidence Domain (WD-02) — package detail
  L3 node → Overlay Domain (WD-03) — activation detail
          → Sandbox Domain (WD-09) — contribution detail
  L4 node → Certification Domain (WD-06) — qualification detail
  L5 node → Certification Domain (WD-06) — certification detail
          → Publication Domain (WD-07) — promotion detail

Clicking any lineage node navigates to the corresponding domain
workspace with context preserved.
```

### 5.2 Lineage Integrity Indicators

```
Each lineage chain displays integrity status:

  ✓ COMPLETE — all links verified, hashes match
  ⚠ PARTIAL — some links verified, others pending
  ✗ BROKEN — hash mismatch or missing link detected

Integrity is computed from lineage_hash at each level:
  chain_integrity = verify(L0.hash → L1.hash → ... → L5.hash)

Broken chains are highlighted with:
  - Specific break point identified
  - Link to investigation (if open)
  - Impact on certification status
```

---

## 6. Lineage Search and Filter

### 6.1 Search Capabilities

| # | Search Type | Description |
|---|------------|-------------|
| LS-01 | By overlay | Show lineage chain for specific overlay |
| LS-02 | By source | Show all lineage chains originating from source |
| LS-03 | By domain+field | Show contributions affecting specific domain+field |
| LS-04 | By certification | Show lineage chain for specific certification record |
| LS-05 | By trust level | Filter lineage by evidence trust level |
| LS-06 | By authority status | Filter lineage by promotion status |

### 6.2 Filter Capabilities

```
Lineage navigation supports filtering by:

  Layer filter: show only specific layers (e.g., L0 + L5)
  Status filter: show only CERTIFIED or PROVISIONAL chains
  Time filter: show lineage for specific time period
  Overlay filter: show lineage for specific overlay(s)
  Domain filter: show lineage affecting specific domains
```

---

## 7. Lineage Reconstructability Guarantee

### 7.1 Reconstructability Requirements

```
Every lineage chain in the cockpit is reconstructable:

  1. Forward traversal:
     Given L0 source → can reconstruct L5 certification decision
     By replaying the full pipeline with same inputs

  2. Backward traversal:
     Given L5 certification → can trace to L0 source
     By following hash references at each level

  3. Attribution traversal:
     Given L4 metric → can identify all L0 sources
     By following contribution records

  4. Consistency:
     All three traversals produce consistent results
     Any inconsistency indicates lineage integrity failure
```

### 7.2 Reconstructability Verification

```
The cockpit can verify lineage reconstructability on demand:

  VERIFY FORWARD:
    Start at L0, replay pipeline, compare L5 hashes
    PASS: forward reconstruction matches recorded state
    FAIL: forward reconstruction diverges → investigation

  VERIFY BACKWARD:
    Start at L5, follow references, verify L0 sources exist
    PASS: all sources exist and hashes match
    FAIL: source missing or hash mismatch → investigation

  VERIFY ATTRIBUTION:
    Start at L4 metric, trace contributors, verify sums
    PASS: contributions sum to metric value
    FAIL: attribution gap → investigation
```

---

## 8. Governance

- 7 lineage navigation types cover full L0→L5 pipeline
- 3 navigation directions: forward, backward, attribution
- Cross-domain lineage links navigate to governing domain workspaces
- Lineage integrity indicators show COMPLETE/PARTIAL/BROKEN per chain
- 6 search and filter capabilities for targeted lineage exploration
- Reconstructability guarantee: any lineage chain can be independently verified
- Forward, backward, and attribution traversals produce consistent results
- Lineage navigation remains reconstructable regardless of cockpit state
- Lineage navigation model is client-agnostic
