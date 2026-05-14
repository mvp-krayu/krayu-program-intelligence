# Certification and Publication Navigation

**Stream:** PI.SQO.COCKPIT.OPERATIONAL-WORKFLOW-NAVIGATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate certification progression, authority
promotion, and publication workflows inside the SQO Cockpit —
including authority state traversal, promotion gate inspection,
publication eligibility, and the boundary to LENS consumption.

---

## 2. Certification Workflow Navigation (WN-06)

### 2.1 Certification Progression Navigation

```
CERTIFICATION PROGRESSION NAVIGATION

  Combined Cert          Authority Promotion     Publication Elig.
  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │ Per-overlay:      │  │ Per-overlay:      │  │ Per-overlay:      │
  │ SEP-001: ✓ CERT  │─▶│ SEP-001: ✓ PROM  │─▶│ SEP-001: ● ELIG  │
  │ SEP-002: ● PROG  │  │ SEP-002: ○ PEND  │  │ SEP-002: ○ PEND  │
  │ SEP-003: ○ PEND  │  │ SEP-003: ○ PEND  │  │ SEP-003: ○ PEND  │
  └──────────────────┘  └──────────────────┘  └──────────────────┘
       │                      │                      │
       G-COMBINED-CERT       G-OPERATOR-PROMOTE     G-QUAL-PUBLISH
                                                      G-ZONE-PUBLISH
                                                      G-PIPELINE-CERT
```

### 2.2 Certification Detail Navigation

```
┌──────────────────────────────────────────────────────┐
│ CERTIFICATION DETAIL: SEP-multi-001                   │
│ Status: COMBINED_CERTIFIED  │  Promoted: YES          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ CERTIFICATION EVIDENCE                                │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Evidence Type        │ Status   │ Hash           │ │
│ │──────────────────────│──────────│────────────────│ │
│ │ CE-01 Replay cert    │ ✓ VALID  │ b4e7…         │ │
│ │ CE-02 Rollback cert  │ ✓ VALID  │ 9a1c…         │ │
│ │ CE-03 Audit trail    │ ✓ VALID  │ f2d8…         │ │
│ │ CE-06 Combined cert  │ ✓ VALID  │ 7c3a…         │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ CERTIFICATION TIMELINE                                │
│   Replay started:   2026-05-09 08:00                 │
│   Replay certified: 2026-05-09 14:30                 │
│   Rollback started: 2026-05-09 14:35                 │
│   Rollback certified: 2026-05-09 18:00               │
│   Combined certified: 2026-05-09 18:00               │
│   Authority promoted: 2026-05-10 09:00               │
│                                                       │
│ NAVIGATION                                            │
│   [View Replay Pipeline] [View Rollback Pipeline]    │
│   [View Evidence Detail] [View Lineage: L5]          │
│   [→ Authority Promotion] [→ Publication]            │
└──────────────────────────────────────────────────────┘
```

---

## 3. Authority Progression Navigation (WN-06 → WN-07)

### 3.1 Authority State Navigation

```
┌──────────────────────────────────────────────────────┐
│ AUTHORITY PROGRESSION                                 │
│ Session: SBX-{client}-{run}                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ AUTHORITY BOUNDARY VISUALIZATION                      │
│                                                       │
│ PROVISIONAL    ║ CERTIFIED     ║ AUTHORITY            │
│ (Sandbox)      ║ (Verified)    ║ (Governing)          │
│ ──────────────────────────────────────────────────    │
│ SEP-003: ████  ║               ║                      │
│ SEP-002: ██████║████           ║                      │
│ SEP-001: ██████║██████████████ ║████████████████      │
│ ──────────────────────────────────────────────────    │
│                ║               ║                      │
│                ║ G-COMBINED    ║ G-PROMOTE             │
│                ║ CERT          ║                      │
│                                                       │
│ PER-OVERLAY AUTHORITY STATE                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Overlay       │ Authority State   │ Gate Status  │ │
│ │───────────────│───────────────────│──────────────│ │
│ │ SEP-multi-001 │ AUTHORITY_PROMOTED│ ✓ All passed │ │
│ │ SEP-multi-002 │ PROVISIONAL       │ ○ Cert pend  │ │
│ │ SEP-multi-003 │ PROVISIONAL       │ ○ Not started│ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ ANTI-LEAKAGE STATUS                                   │
│   AL-01 through AL-06: ● ALL ENFORCED                │
│   [View Anti-Leakage Detail]                          │
│                                                       │
│ NAVIGATION                                            │
│   [Click overlay for authority detail]                │
│   [→ Certification (for pending overlays)]           │
│   [→ Publication (for promoted overlays)]            │
│   [→ Session Authority Boundary]                     │
└──────────────────────────────────────────────────────┘
```

### 3.2 Promotion Gate Navigation

```
┌──────────────────────────────────────────────────────┐
│ PROMOTION GATE: G-OPERATOR-PROMOTE                    │
│ Overlay: SEP-multi-001  │  Type: Approval (GT-02)     │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PROMOTION PREREQUISITES (AP-01 through AP-08)         │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Prerequisite                    │ Status          │ │
│ │─────────────────────────────────│─────────────────│ │
│ │ AP-01 Overlay ACTIVATED         │ ✓ MET           │ │
│ │ AP-02 Replay CERTIFIED          │ ✓ MET           │ │
│ │ AP-03 Rollback CERTIFIED        │ ✓ MET           │ │
│ │ AP-04 Combined CERTIFIED        │ ✓ MET           │ │
│ │ AP-05 No active divergence      │ ✓ MET           │ │
│ │ AP-06 No active ambiguity       │ ✓ MET           │ │
│ │ AP-07 Zone permits promotion    │ ✓ MET (SAFE)    │ │
│ │ AP-08 Operator authorization    │ ✓ MET           │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PROMOTION RECORD                                      │
│   Promoted by: operator@krayu                        │
│   Promoted at: 2026-05-10 09:00                      │
│   Zone at promotion: SAFE                            │
│   Evidence hash: 7c3a…                               │
│                                                       │
│ NAVIGATION                                            │
│   [← Combined Certification] [→ Publication]         │
│   [View Promotion Evidence] [View Lineage]           │
└──────────────────────────────────────────────────────┘
```

---

## 4. Publication Workflow Navigation (WN-07)

### 4.1 Publication Eligibility Navigation

```
┌──────────────────────────────────────────────────────┐
│ PUBLICATION ELIGIBILITY                               │
│ Overlay: SEP-multi-001                               │
├──────────────────────────────────────────────────────┤
│                                                       │
│ PUBLICATION PREREQUISITES (PE-01 through PE-06)       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Prerequisite                    │ Status          │ │
│ │─────────────────────────────────│─────────────────│ │
│ │ PE-01 Authority PROMOTED        │ ✓ MET           │ │
│ │ PE-02 S-state sufficient        │ ✓ MET (S1+)     │ │
│ │ PE-03 All entries qualified     │ ● CHECKING      │ │
│ │ PE-04 Zone permits publication  │ ✓ MET (SAFE)    │ │
│ │ PE-05 No quarantine active      │ ✓ MET           │ │
│ │ PE-06 Pipeline certification    │ ○ PENDING       │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PUBLICATION GATES                                     │
│   G-AUTHORITY-COMPLETE: ✓ PASSED                     │
│   G-QUAL-PUBLISH: ● EVALUATING                      │
│   G-ZONE-PUBLISH: ✓ PASSED                          │
│   G-PIPELINE-CERT: ○ PENDING                        │
│                                                       │
│ PUBLICATION BOUNDARY                                  │
│   ───────────────────────────────────────────────    │
│   AUTHORITY         ║ LENS-CONSUMABLE                │
│   SEP-001 promoted  ║ (not yet published)            │
│   ───────────────────────────────────────────────    │
│   Gate: G-PUBLISH (requires operator authorization)  │
│                                                       │
│ NAVIGATION                                            │
│   [← Authority Promotion] [→ LENS Boundary]         │
│   [View Publication Record] [View Eligibility Detail]│
└──────────────────────────────────────────────────────┘
```

### 4.2 LENS Consumption Boundary Navigation

```
┌──────────────────────────────────────────────────────┐
│ LENS CONSUMPTION BOUNDARY                             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ WHAT LENS RECEIVES                                    │
│ ┌──────────────────────────────────────────────────┐ │
│ │ - Published authority state only                  │ │
│ │ - Certified qualification metrics                 │ │
│ │ - Authority-promoted overlay contributions        │ │
│ │ - Publication evidence record                     │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ WHAT LENS DOES NOT RECEIVE                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ - Provisional sandbox state                       │ │
│ │ - Uncertified overlay state                       │ │
│ │ - Replay/rollback pipeline intermediate state     │ │
│ │ - Divergence investigation details                │ │
│ │ - Ambiguity resolution details                    │ │
│ │ - Operator identity or authorization details      │ │
│ └──────────────────────────────────────────────────┘ │
│                                                       │
│ PUBLISHED TO LENS                                     │
│   (none published yet — SEP-001 eligible)            │
│                                                       │
│ NAVIGATION                                            │
│   [← Publication Eligibility]                        │
│   [View Published Records]                            │
│   This is the terminal navigation boundary.           │
│   LENS is consumption-only — no cockpit traversal.   │
└──────────────────────────────────────────────────────┘
```

---

## 5. Authority Progression Timeline

### 5.1 Per-Overlay Authority Timeline

```
AUTHORITY PROGRESSION TIMELINE: SEP-multi-001

  Activated    Replay Cert  Rollback Cert  Combined    Promoted    Published
  2026-05-08   2026-05-09   2026-05-09     2026-05-09  2026-05-10  (pending)
  ──●──────────●────────────●──────────────●───────────●───────────○──────▶
     PROVISIONAL             CERT_READY     CERTIFIED   AUTHORITY   PUB_ELIG

  [Click any milestone to navigate to that workflow state]
```

---

## 6. Governance

- Certification progression: per-overlay tracking across replay, rollback, combined
- Authority state: 5 states navigable with anti-leakage enforcement
- Promotion gates: 8 prerequisites (AP-01 through AP-08) navigable
- Publication eligibility: 6 prerequisites (PE-01 through PE-06) navigable
- LENS boundary: terminal navigation boundary — LENS is consumption-only
- Authority progression timeline per overlay
- Navigation does not mutate certification, authority, or publication state
