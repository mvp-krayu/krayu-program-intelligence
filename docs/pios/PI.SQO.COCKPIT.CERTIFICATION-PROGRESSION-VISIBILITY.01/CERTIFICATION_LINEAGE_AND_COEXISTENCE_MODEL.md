# Certification Lineage and Coexistence Model

**Stream:** PI.SQO.COCKPIT.CERTIFICATION-PROGRESSION-VISIBILITY.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators trace certification lineage and how multiple
certification trajectories coexist — including certification lineage,
replay lineage, rollback lineage, escalation lineage, publication
lineage, authority lineage, degradation lineage, and the rules
governing multi-trajectory coherence.

---

## 2. Certification Lineage Visibility (CV-11)

### 2.1 Seven Certification Lineage Types

| # | Lineage Type | What Is Traced | Hash Verification |
|---|-------------|---------------|-------------------|
| CL-01 | Certification lineage | Certification state transitions with evidence | Per-transition hash |
| CL-02 | Replay lineage | Replay input → reconstruction → comparison → decision | Per-phase hash chain |
| CL-03 | Rollback lineage | Dependency → removability → state restore → cascade → decision | Per-phase hash chain |
| CL-04 | Escalation lineage | Escalation triggers → G-level transitions → responses | Per-event hash |
| CL-05 | Publication lineage | Authority promotion → publication eligibility → publication | Per-gate hash chain |
| CL-06 | Authority lineage | Certification → combined cert → promotion → authority state | Per-transition hash |
| CL-07 | Degradation lineage | Degradation signals → impact → recovery → resolution | Per-signal hash |

### 2.2 Certification Lineage Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ CERTIFICATION LINEAGE                                                │
│ Overlay: SEP-multi-001                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ CERTIFICATION CHAIN (CL-01)                                         │
│                                                                      │
│  PROVISIONAL → R-REV → RB-REV → C-REV → A-ELG → P-AUTH            │
│  05-08        05-09    05-09    05-09    05-09    05-10              │
│  hash:a1b2   hash:c3d4 hash:e5f6 hash:g7h8 hash:i9j0 hash:k1l2   │
│                                                                      │
│  Chain integrity: ✓ VERIFIED (all hashes valid)                     │
│  Chain length: 5 transitions                                        │
│  Chain direction: FORWARD (no regressions)                          │
│                                                                      │
│ REPLAY LINEAGE (CL-02)                                              │
│  Input → Integrity → Reconstruct → Compare → Lineage → Decision   │
│  Ph1      Ph2         Ph3           Ph4       Ph5        Ph6        │
│  ✓        ✓           ✓             ✓ MATCH   ✓ 6/6     ✓ CERT    │
│  Chain hash: b4e7…                                                  │
│                                                                      │
│ ROLLBACK LINEAGE (CL-03)                                            │
│  Dependency → Removability → State Rest. → Cascade → Decision      │
│  Ph1          Ph2            Ph3           Ph4       Ph5            │
│  ✓ 3 deps    ✓ 7/7          ✓ MATCH       ✓ SAFE   ✓ CERT        │
│  Chain hash: 9a1c…                                                  │
│                                                                      │
│ AUTHORITY LINEAGE (CL-06)                                           │
│  Combined Cert → Promotion Eligible → Promoted → Authority State   │
│  CERT-BE-001-009  2026-05-09         2026-05-10   12 fields added  │
│  Chain hash: k1l2…                                                  │
│                                                                      │
│ PUBLICATION LINEAGE (CL-05)                                         │
│  Authority → Pub Assessment → Eligibility → (not yet published)    │
│  PROMOTED    2026-05-10       ELIGIBLE         PENDING              │
│  Chain hash: m3n4…                                                  │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Full Chain] [Verify Chain Hashes]                           │
│   [Navigate by Lineage Type] [→ Evidence (CE-01 through CE-06)]    │
│   [→ Reconstruction Audit Trail]                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Lineage Reconstruction

```
CERTIFICATION RECONSTRUCTION GUARANTEE

  From any point in the certification chain, the full state is
  reconstructable from:

  1. Overlay activation record (L3)
  2. Replay certification evidence (CE-01)
  3. Rollback certification evidence (CE-02)
  4. Reconstruction audit trail (CE-03)
  5. Combined certification evidence (CE-06)
  6. Authority promotion record
  7. Publication eligibility assessment

  Reconstruction hash = sha256(components 1-7)

  Reconstruction verification:
    COMPUTE hash from components
    COMPARE against stored certification chain hash
    IF match → chain integrity VERIFIED
    IF mismatch → LINEAGE_BREAK detected → CD-02 degradation
```

---

## 3. Certification Coexistence Visibility (CV-12)

### 3.1 Coexistence Model

```
CERTIFICATION COEXISTENCE RULES

  Rule 1: Independent overlay certification
    Each overlay has its own independent certification lifecycle
    SEP-001 certification does not depend on SEP-002 certification
    Exception: overlay dependencies affect rollback certification

  Rule 2: Shared authority state
    All promoted overlays contribute to shared authority state
    Authority state hash includes all promoted overlay contributions

  Rule 3: Single composite qualification
    Composite qualification is computed from all promoted overlays
    Individual overlay certification affects composite qualification

  Rule 4: Session-scoped certification
    Certification state is scoped to session (SBX-{client}-{run})
    Cross-session certification state is isolated

  Rule 5: Supersession certification inheritance
    When session supersedes predecessor:
      - Predecessor certification state is read-only (archived)
      - Successor inherits promoted authority from predecessor
      - Successor certification starts fresh for new overlays
      - Inherited authority does not require re-certification
```

### 3.2 Coexistence Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ CERTIFICATION COEXISTENCE                                            │
│ Session: SBX-{client}-{run}                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ ACTIVE CERTIFICATION TRAJECTORIES                                   │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Overlay       │ State      │ Pipeline Stage │ Independent     │ │
│ │───────────────│────────────│────────────────│─────────────────│ │
│ │ SEP-multi-001 │ PUB_AUTH   │ Complete       │ ✓ No deps       │ │
│ │ SEP-multi-002 │ R-REV      │ Replay Ph3     │ ✓ No deps       │ │
│ │ SEP-multi-003 │ PROVISIONAL│ Not started    │ ✓ No deps       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ CROSS-OVERLAY DEPENDENCIES                                          │
│   D-01 domain overlaps: SEP-001 ↔ SEP-002 (2 fields)              │
│   D-02 conflict deps: SEP-001 won 1 conflict vs SEP-002           │
│   D-03 qualification deps: all contribute to composite             │
│   Impact: SEP-002 rollback may affect SEP-001 conflict resolutions │
│                                                                      │
│ COEXISTENCE HEALTH                                                  │
│   Independent certifications: 3/3                                   │
│   Cross-dependency risk: LOW (soft deps only)                       │
│   Cascade risk: LOW (depth 1, size 0)                               │
│   Conflicts: 0 (all coexistence rules satisfied)                    │
│                                                                      │
│ SESSION COEXISTENCE                                                  │
│   Active session: SBX-BE-001-003 (current)                         │
│   Predecessor: SBX-BE-001-002 (SUPERSEDED, read-only)              │
│   Inherited authority: baseline (S1)                                │
│   Cross-session isolation: ✓ VERIFIED                               │
│                                                                      │
│ NAVIGATION                                                           │
│   [View Dependency Graph] [View Coexistence Rules]                  │
│   [View Session History] [→ Cross-Session Comparison]               │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Certification Branching and Supersession

```
CERTIFICATION BRANCHING

  Concurrent certification trajectories:

  SEP-001: ════════════════════════════► PUB_AUTH (complete)
  SEP-002: ─────────────●──────────────► R-REV (in progress)
  SEP-003: ─────────────────────●──────► PROVISIONAL (not started)

  All three trajectories are independent.
  Combined certification requires ALL to reach CERTIFIED.
  Publication requires ALL to reach AUTHORITY_PROMOTED.

CERTIFICATION SUPERSESSION

  When overlay is superseded:
    SEP-001-v1: ═══════► PUB_AUTH ──── SUPERSEDED by SEP-001-v2
    SEP-001-v2: ────────────────────── starts PROVISIONAL
    SEP-001-v1 certification evidence: preserved (read-only)
    SEP-001-v2 authority: inherits nothing (must re-certify)
```

---

## 4. Certification Archive Visibility

### 4.1 Archive Access

```
CERTIFICATION ARCHIVE

  Completed certification records:
  ┌─────────────────────────────────────────────────────────────────┐
  │ Record                  │ Overlay       │ Decision  │ Date      │
  │─────────────────────────│───────────────│───────────│───────────│
  │ RCERT-BE-001-017        │ SEP-multi-001 │ CERTIFIED │ 05-09     │
  │ RBCERT-BE-001-012       │ SEP-multi-001 │ CERTIFIED │ 05-09     │
  │ CERT-BE-001-009         │ SEP-multi-001 │ ELIGIBLE  │ 05-09     │
  │ PROM-BE-001-001         │ SEP-multi-001 │ PROMOTED  │ 05-10     │
  └─────────────────────────────────────────────────────────────────┘

  All archived records:
    - Hash-verified (tamper-evident)
    - Write-once (immutable)
    - Retained indefinitely
    - Linked by certification chain hashes
```

---

## 5. Governance

- 7 certification lineage types (CL-01 through CL-07) with hash-verified chains
- Certification chain per overlay: state transitions with per-transition hash
- Replay, rollback, authority, publication lineage individually traceable
- Certification reconstruction from 7 components with hash verification
- 5 coexistence rules: independent certification, shared authority, single qualification, session-scoped, supersession inheritance
- Per-overlay trajectory independence visible with cross-dependency analysis
- Certification branching: concurrent independent trajectories
- Certification supersession: predecessor preserved read-only, successor starts fresh
- Archive access: all certification records hash-verified, write-once, retained indefinitely
- Lineage and coexistence visibility is read-only — observation does not alter state
