# Operational Session Navigation Model

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define how operators navigate within and between sandbox sessions
in the cockpit workspace — including session selection, session
detail navigation, cross-session comparison, and session lineage
navigation.

---

## 2. Session Navigation Structure

### 2.1 Navigation Hierarchy

```
CLIENT SELECTOR
  │  Select client context
  ▼
RUN SELECTOR
  │  Select run context within client
  ▼
SESSION LIST
  │  View all sessions for client+run (ACTIVE, ARCHIVED, SUPERSEDED)
  ▼
SESSION DETAIL
  │  Full session workspace (overlay chain, certification, authority)
  ▼
SESSION DRILL-DOWN
  │  Specific overlay, certification, or lineage detail
  ▼
[Domain workspace navigation (WD-01 through WD-10)]
```

### 2.2 Session List View

```
┌──────────────────────────────────────────────────────┐
│ SESSIONS: BlueEdge / Run 001                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ● SBX-BlueEdge-001 (ACTIVE)                         │
│   Created: 2026-05-10  │  S-State: S2  │  Zone: SAFE│
│   Overlays: 3  │  Certified: 1  │  Promoted: 1      │
│   [Open Session]                                      │
│                                                       │
│ ○ SBX-BlueEdge-001-v0 (SUPERSEDED)                  │
│   Created: 2026-05-08  │  Final S-State: S1          │
│   Superseded: 2026-05-10  │  Reason: re-baseline     │
│   [View Archive]                                      │
│                                                       │
│ ○ SBX-BlueEdge-001-pilot (ARCHIVED)                 │
│   Created: 2026-05-05  │  Final S-State: S1          │
│   Archived: 2026-05-07  │  Reason: pilot complete    │
│   [View Archive]                                      │
│                                                       │
│ ● = ACTIVE  ○ = Terminal (read-only)                  │
└──────────────────────────────────────────────────────┘
```

---

## 3. Session Detail Navigation

### 3.1 Session Detail Panels

```
SESSION DETAIL: SBX-BlueEdge-001
├── OVERVIEW         (session summary, health, S-state)
├── OVERLAY CHAIN    (activation chain, contributions, conflicts)
├── CERTIFICATION    (replay/rollback/combined status per overlay)
├── AUTHORITY        (authority boundary, promotion status)
├── LINEAGE          (session-scoped lineage navigation)
├── ZONE & ESCALATION (zone status, escalation state)
├── RECOVERY         (recovery options, impact assessment)
└── EVENTS           (session event stream)
```

### 3.2 Navigation Between Panels

```
All panels share the session context bar:

┌──────────────────────────────────────────────────────┐
│ SBX-BlueEdge-001 │ ACTIVE │ S2 │ SAFE │ Health: ●   │
├──────────────────────────────────────────────────────┤
│ [Overview] [Chain] [Cert] [Auth] [Lineage] [Zone]   │
│ [Recovery] [Events]                                   │
├──────────────────────────────────────────────────────┤
│ (selected panel content here)                         │
└──────────────────────────────────────────────────────┘

Panel switching preserves:
  - Session context (client, run, session)
  - Scroll position within panel
  - Selected overlay (if applicable)
```

---

## 4. Cross-Session Navigation

### 4.1 Session Comparison

```
When a session has predecessors (superseded sessions):

┌──────────────────────────────────────────────────────┐
│ SESSION COMPARISON                                    │
│ Current: SBX-BlueEdge-001 vs. Predecessor: v0       │
├──────────────────────────────────────────────────────┤
│ Property          │ Current      │ Predecessor       │
│───────────────────│──────────────│───────────────────│
│ Status            │ ACTIVE       │ SUPERSEDED        │
│ S-State           │ S2           │ S1                │
│ Overlays          │ 3            │ 1                 │
│ Certified         │ 1            │ 1                 │
│ Promoted          │ 1            │ 1                 │
│ Grounding         │ 85.1%        │ 67.2%            │
│ Authority fields  │ 50/67        │ 50/67            │
│ Baseline          │ Same         │ Same              │
│ Inherited         │ SEP-001      │ —                 │
└──────────────────────────────────────────────────────┘
```

### 4.2 Session History Navigation

```
Session lineage (for superseded sessions):

  SBX-BlueEdge-001-pilot (ARCHIVED)
    │  pilot complete, insights captured
    ▼
  SBX-BlueEdge-001-v0 (SUPERSEDED)
    │  re-baseline needed, SEP-001 inherited
    ▼
  SBX-BlueEdge-001 (ACTIVE) ◀── current
    │  
    ▼
  [future sessions if superseded]

Each predecessor is navigable and read-only.
```

---

## 5. Session-to-Domain Navigation

### 5.1 Session-Domain Links

| Session Panel | Domain Navigation |
|--------------|-------------------|
| Overlay Chain | → WD-03 (Overlay Domain) for proposal details |
| Certification | → WD-04/05/06 (Replay/Rollback/Certification) for pipeline details |
| Authority | → WD-07 (Publication) for promotion/publication details |
| Zone & Escalation | → WD-08 (Governance) for zone monitoring |
| Recovery | → WD-10 (Recoverability) for recovery options |
| Lineage | → WD-02 (Evidence) for evidence source details |

### 5.2 Return Navigation

```
When navigating from session to domain workspace:
  - Breadcrumb: Session > Domain > Detail
  - [Back to Session] returns to session detail at same panel
  - Session context persists in domain workspace
```

---

## 6. Session Lineage Navigation

### 6.1 Session-Scoped Lineage

```
Within a session, lineage navigation covers:

  Evidence lineage (L0→L2)
    │  Per overlay: which evidence sources contributed
    ▼
  Overlay lineage (L2→L3)
    │  Per overlay: proposal → approval → activation
    ▼
  Certification lineage (L3→L5)
    │  Per overlay: replay cert → rollback cert → combined cert
    ▼
  Authority lineage (L5→promotion)
    │  Per overlay: promotion evidence → authority state
    ▼
  Session lineage (session→session)
    │  Predecessor/successor chain
    │  Inherited state tracking
```

### 6.2 Session Lineage Integrity

```
Session lineage hash = sha256(
  session_id +
  baseline_hash +
  overlay_chain_hash +
  certification_state_hash +
  authority_state_hash +
  predecessor_session_hash (if exists)
)

Lineage integrity verified:
  - On session state change
  - On lineage navigation request
  - On periodic integrity check
```

---

## 7. Deep-Link Model

### 7.1 Session Deep-Link Structure

```
Every session state is addressable:

  /cockpit/{client}/{run}/session/{session_id}
  /cockpit/{client}/{run}/session/{session_id}/chain
  /cockpit/{client}/{run}/session/{session_id}/chain/{overlay_id}
  /cockpit/{client}/{run}/session/{session_id}/cert/{overlay_id}
  /cockpit/{client}/{run}/session/{session_id}/lineage/{lineage_type}
  /cockpit/{client}/{run}/session/{session_id}/events

Deep-links enable:
  - Direct navigation from external references
  - Shareable session state references
  - Audit trail references to specific session states
```

---

## 8. Governance

- Navigation hierarchy: client → run → session → panel → detail
- Session list shows all sessions (ACTIVE and terminal) for client+run
- 8 session detail panels with shared context bar
- Cross-session comparison for superseded sessions
- Session-to-domain navigation with breadcrumb return
- Session-scoped lineage navigation across all 5 lineage types
- Session lineage integrity verified through hash chain
- Deep-link model makes every session state addressable
- Session navigation model is client-agnostic
