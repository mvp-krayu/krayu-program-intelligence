# Session Lifecycle and Namespace Model

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the session lifecycle states and namespace isolation model —
how sessions transition between states, how namespaces enforce
isolation, and how sessions remain reconstructable, replay-bound,
rollback-bound, lineage-bound, and coexistence-safe.

---

## 2. Session Lifecycle States

### 2.1 Ten Session States

| # | State | Description | Entry Condition |
|---|-------|-------------|----------------|
| SS-01 | INITIALIZED | Session created, baseline loaded, no overlays | Session creation with valid client+run |
| SS-02 | ACTIVE | Operational — overlays being activated and certified | First overlay activation or operator activation |
| SS-03 | REPLAY_VALIDATING | Replay certification in progress for one or more overlays | Replay certification initiated |
| SS-04 | ROLLBACK_VALIDATING | Rollback certification in progress | Rollback certification initiated |
| SS-05 | CERTIFICATION_REVIEW | Combined certification under operator review | Combined certification ready |
| SS-06 | QUARANTINED | Session frozen due to certification failure or divergence | CRITICAL certification failure or divergence |
| SS-07 | ESCALATED | Session under governance escalation | G-3+ escalation triggered |
| SS-08 | REVOKED | Session permanently invalidated | Unrecoverable failure or governance decision |
| SS-09 | ARCHIVED | Session complete — read-only for audit | All overlays certified and promoted, or operator archive |
| SS-10 | SUPERSEDED | Session replaced by successor session | New session created for same client+run |

### 2.2 Session State Transition Diagram

```
                    ┌──────────────┐
                    │  INITIALIZED │
                    │    SS-01     │
                    └──────┬───────┘
                           │ overlay activation
                           ▼
                    ┌──────────────┐
              ┌────▶│    ACTIVE    │◀────────────────────┐
              │     │    SS-02     │                      │
              │     └──┬───┬───┬──┘                      │
              │        │   │   │                          │
              │  replay│   │   │rollback                  │
              │        ▼   │   ▼                          │
              │  ┌────────┐│┌────────────┐               │
              │  │REPLAY  │││ROLLBACK    │               │
              │  │VALID.  │││VALID.      │               │
              │  │ SS-03  │││ SS-04      │               │
              │  └───┬────┘│└────┬───────┘               │
              │      │     │     │                        │
              │      └──┬──┘     │ combined ready         │
              │         │  ┌─────┘                        │
              │         ▼  ▼                              │
              │  ┌──────────────┐                         │
              │  │CERTIFICATION │                         │
              │  │REVIEW SS-05  │                         │
              │  └──────┬───────┘                         │
              │         │                                 │
              │    pass │         fail                    │
              │         ▼           │                     │
              │  ┌──────────┐  ┌───▼──────┐              │
              │  │  ACTIVE  │  │QUARANTIN. │              │
              │  │  (cont.) │  │  SS-06    │              │
              │  └──────────┘  └───┬───────┘              │
              │                    │                      │
              │              resolve│   escalate          │
              └────────────────────┘      │               │
                                          ▼               │
                                   ┌──────────┐          │
                                   │ESCALATED │──resolve──┘
                                   │  SS-07   │
                                   └────┬─────┘
                                        │ unrecoverable
                                        ▼
                                 ┌──────────┐
                                 │ REVOKED  │
                                 │  SS-08   │
                                 └──────────┘

  ACTIVE/CERT_REVIEW ──complete──▶ ARCHIVED (SS-09)
  ANY ──supersede──▶ SUPERSEDED (SS-10)
```

### 2.3 State Transition Rules

| Transition | From | To | Trigger | Authorization |
|-----------|------|----|---------|--------------|
| Create | — | INITIALIZED | Session creation | Operator |
| Activate | INITIALIZED | ACTIVE | First overlay or operator | Operator |
| Begin replay | ACTIVE | REPLAY_VALIDATING | Replay certification started | Operator |
| Begin rollback | ACTIVE | ROLLBACK_VALIDATING | Rollback certification started | Operator |
| Return to active | REPLAY/ROLLBACK_VALIDATING | ACTIVE | Certification phase complete | Automated |
| Begin review | ACTIVE | CERTIFICATION_REVIEW | Combined certification ready | Automated |
| Pass review | CERTIFICATION_REVIEW | ACTIVE | Operator accepts certification | Operator |
| Quarantine | ANY (active) | QUARANTINED | CRITICAL failure | Automated |
| Resolve quarantine | QUARANTINED | ACTIVE | Investigation resolved | Operator |
| Escalate | QUARANTINED | ESCALATED | G-3+ escalation | Operator/Automated |
| Resolve escalation | ESCALATED | ACTIVE | Escalation resolved | Operator + Governance |
| Revoke | ESCALATED/QUARANTINED | REVOKED | Unrecoverable failure | Operator + Governance |
| Archive | ACTIVE/CERT_REVIEW | ARCHIVED | Session complete or operator | Operator |
| Supersede | ANY (except REVOKED) | SUPERSEDED | New session for same run | Operator |

---

## 3. Session Namespace Model

### 3.1 Namespace Structure

```json
{
  "session_namespace": {
    "namespace_id": "NS-<client>-<run_id>",
    "session_ref": "SBX-<client>-<run_id>",
    "isolation_boundary": {
      "client_isolated": true,
      "run_isolated": true,
      "overlay_chain_isolated": true,
      "composite_state_isolated": true,
      "certification_state_isolated": true,
      "lineage_isolated": true
    },
    "contamination_status": "CLEAN | SUSPECT | CONTAMINATED",
    "last_integrity_check": "<ISO-8601>",
    "coexistence_group": "<group_id or null>"
  }
}
```

### 3.2 Seven Namespace Isolation Rules

| # | Rule | Enforcement | Violation Action |
|---|------|-------------|-----------------|
| NI-01 | Client isolation | Session state accessible only to owning client | Access control at namespace boundary |
| NI-02 | Run isolation | Session state accessible only within owning run | Access control at namespace boundary |
| NI-03 | Overlay chain isolation | Overlay activations scoped to session only | Activation writes to session namespace only |
| NI-04 | Composite state isolation | Composite state belongs to session only | State reads/writes scoped to namespace |
| NI-05 | Certification state isolation | Certification records scoped to session | Certification references session_id |
| NI-06 | Lineage isolation | Lineage chains scoped to session | Lineage records reference namespace_id |
| NI-07 | Governance state isolation | Zone and escalation scoped to session context | Zone computation uses session metrics |

### 3.3 Contamination Detection

```
FUNCTION detectContamination(session):

  // Check 1: Cross-session overlay references
  FOR each overlay in session.overlay_chain:
    IF overlay references entries from another session:
      → CONTAMINATION: cross-session overlay reference

  // Check 2: Cross-session lineage references
  FOR each lineage_record in session.lineage:
    IF lineage_record references another session's namespace:
      → CONTAMINATION: cross-session lineage reference

  // Check 3: Composite state integrity
  reconstructed = replayReconstruct(session.baseline, session.overlays)
  IF reconstructed.hash != session.composite_hash:
    → SUSPECT: composite state may be contaminated

  // Check 4: Certification state integrity
  FOR each cert in session.certification_state:
    IF cert.session_ref != session.session_id:
      → CONTAMINATION: cross-session certification

  IF no violations found:
    RETURN "CLEAN"
  IF suspect only:
    RETURN "SUSPECT" (investigation needed)
  IF contamination found:
    RETURN "CONTAMINATED" (quarantine required)
```

---

## 4. Namespace Binding Model

### 4.1 Five Namespace Bindings

| # | Binding | Description | Verification |
|---|---------|-------------|-------------|
| NB-01 | Replay-bound | Session replay inputs are namespace-scoped | Input inventory references session namespace |
| NB-02 | Rollback-bound | Session rollback dependencies are namespace-scoped | Dependency inventory references session namespace |
| NB-03 | Lineage-bound | Session lineage chains are namespace-scoped | Lineage records reference namespace_id |
| NB-04 | Certification-bound | Session certifications are namespace-scoped | Certification records reference session_id |
| NB-05 | Coexistence-bound | Session coexistence group is explicit | Coexistence group_id recorded |

### 4.2 Binding Verification Process

```
FUNCTION verifyNamespaceBindings(session):

  FOR each binding NB-01 through NB-05:
    VERIFY binding references are namespace-internal
    IF external reference found:
      → BINDING VIOLATION: {binding_type}
      → Session status → QUARANTINED
      → Investigation required

  IF all bindings verified:
    → NAMESPACE_VERIFIED
    → Record verification timestamp
```

---

## 5. Session Persistence Model

### 5.1 Session State Persistence

```
Session state is persisted at:

  1. Every state transition
     - Full session snapshot
     - Transition record (from, to, trigger, timestamp)

  2. Every overlay activation
     - Updated overlay chain
     - Updated composite hash
     - Updated qualification metrics

  3. Every certification event
     - Updated certification state
     - Certification evidence references

  4. Every governance event
     - Updated zone state
     - Updated escalation state

  5. Periodic checkpoints
     - Full session snapshot every 5 minutes during ACTIVE state
```

### 5.2 Session Recovery Points

```
Recovery points are created at:

  RP-01: Session creation (baseline state)
  RP-02: Each overlay activation (pre-activation state)
  RP-03: Each certification completion (post-certification state)
  RP-04: Each governance zone transition (pre-transition state)
  RP-05: Each escalation event (pre-escalation state)

Recovery points enable:
  - Rollback to any prior activation state
  - Restoration to any prior certification state
  - Investigation of governance transitions
```

---

## 6. Session Termination Model

### 6.1 Four Termination Paths

| Path | Trigger | Final State | Data Retention |
|------|---------|------------|----------------|
| Completion | All overlays certified and promoted | ARCHIVED | Indefinite (full audit) |
| Operator archive | Operator decision to close session | ARCHIVED | Indefinite (full audit) |
| Revocation | Unrecoverable failure | REVOKED | Indefinite (full audit + failure record) |
| Supersession | New session for same client+run | SUPERSEDED | Indefinite (full audit + successor ref) |

### 6.2 Termination Process

```
FOR any termination:

  STEP 1: Verify no in-progress operations
    IF active certifications: wait or cancel
    IF active workflows: wait or cancel

  STEP 2: Create terminal snapshot
    final_snapshot = fullSessionSnapshot(session)
    final_hash = sha256(final_snapshot)

  STEP 3: Record termination
    termination_record = {
      session_id: session.session_id,
      termination_type: "COMPLETION | ARCHIVE | REVOCATION | SUPERSESSION",
      final_hash: final_hash,
      timestamp: now(),
      successor: successor_session_id (if SUPERSESSION)
    }

  STEP 4: Set terminal state
    session.status = ARCHIVED | REVOKED | SUPERSEDED

  STEP 5: Make session read-only
    All write operations return DENIED
    Read and lineage navigation remain available
```

---

## 7. Governance

- 10 session lifecycle states from INITIALIZED to SUPERSEDED
- State transitions are explicit, authorized, and auditable
- 7 namespace isolation rules prevent cross-session contamination
- Contamination detection identifies cross-session references
- 5 namespace bindings ensure replay, rollback, lineage, certification, and coexistence are scoped
- Session state persisted at every transition, activation, certification, and governance event
- Recovery points at creation, activation, certification, zone transition, and escalation
- 4 termination paths (completion, archive, revocation, supersession) with indefinite retention
- Terminated sessions remain readable for audit
- Session lifecycle is client-agnostic
