# Sandbox Session Architecture

**Stream:** PI.SQO.COCKPIT.SANDBOX-SESSION-MANAGEMENT.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O2 — Cockpit Operationalization

---

## 1. Purpose

Define the canonical sandbox session architecture that transforms
sandbox operational states into governable cockpit session entities —
isolated, reconstructable, observable, and authority-bounded
semantic operational workspaces.

---

## 2. Architectural Separation

### 2.1 Sandbox Session ≠ Certified Authority

| Property | Sandbox Session | Certified Authority |
|----------|----------------|-------------------|
| Role | Isolated operational semantic workspace | Governing truth |
| Content | Provisional overlay computations | Replay+rollback certified state |
| Mutability | Mutable within governance constraints | Immutable once promoted |
| Visibility | Cockpit operational workspace only | Cockpit + publication boundary |
| Lifecycle | Created, active, archived | Promoted, published |
| LENS access | NEVER — sandbox state does not enter LENS | Published authority only |

### 2.2 Mandatory Separation Rule

```
Sandbox session state → certification pipeline → authority promotion → publication → LENS

No shortcut exists. No sandbox state directly becomes authority.
Every boundary crossing requires explicit gate passage.
```

---

## 3. Session Entity Model

### 3.1 Session Definition

```json
{
  "sandbox_session": {
    "session_id": "SBX-<client>-<run_id>",
    "client_id": "<client>",
    "run_id": "<run_id>",
    "created_at": "<ISO-8601>",
    "status": "INITIALIZED | ACTIVE | FROZEN | ARCHIVED | SUPERSEDED",
    "baseline": {
      "hash": "<sha256>",
      "certification": "PIPELINE_CERTIFIED",
      "loaded_at": "<ISO-8601>"
    },
    "overlay_chain": {
      "activated_count": 0,
      "activation_order": [],
      "composite_hash": "<sha256>"
    },
    "qualification": {
      "s_state": "S1",
      "grounding_ratio": 0.0,
      "q_class": "Q-BASELINE",
      "backed_count": 0,
      "total_fields": 0
    },
    "governance": {
      "zone": "SAFE",
      "escalation_level": "G-0",
      "frozen_reason": null
    },
    "certification_state": {
      "replay_certified": [],
      "rollback_certified": [],
      "promotion_eligible": [],
      "authority_promoted": []
    },
    "lineage": {
      "session_lineage_hash": "<sha256>",
      "lineage_complete": true
    },
    "namespace": {
      "isolated": true,
      "coexistence_group": null,
      "contamination_checks": "CLEAN"
    }
  }
}
```

### 3.2 Session Identity Rules

| Rule | Description |
|------|-------------|
| Unique ID | Every session has globally unique session_id |
| Client-scoped | Sessions belong to exactly one client |
| Run-scoped | Sessions belong to exactly one run within a client |
| Singleton per run | At most one ACTIVE session per client+run |
| Immutable ID | session_id never changes after creation |

---

## 4. Session Architecture Layers

### 4.1 Five Session Architecture Layers

```
Layer 5: SESSION CONTEXT
  │  Client, run, session identity, governance zone
  │  Persistent across all session operations
  ▼
Layer 4: OVERLAY CHAIN
  │  Activated overlays, application order, conflicts
  │  The operational evolution trace within the session
  ▼
Layer 3: CERTIFICATION STATE
  │  Replay/rollback certification per overlay
  │  Combined certification, promotion eligibility
  ▼
Layer 2: LINEAGE AND AUDIT
  │  Evidence lineage, overlay lineage, certification lineage
  │  Reconstructability proof for all session state
  ▼
Layer 1: NAMESPACE ISOLATION
  │  Cross-session boundary enforcement
  │  Contamination prevention, coexistence rules
  ▼
[Foundation: Governance doctrine, zone constraints, authority boundaries]
```

### 4.2 Layer Interaction Rules

```
Layer 5 governs: which operations are permitted (zone, escalation)
Layer 4 produces: operational state that Layer 3 certifies
Layer 3 produces: certification evidence that Layer 2 records
Layer 2 enables: reconstructability verification across all layers
Layer 1 enforces: isolation between concurrent sessions

No layer may bypass a lower layer.
No layer may modify a higher layer's context without governance.
```

---

## 5. Session Operational Capabilities

### 5.1 Eight Session Capabilities

| # | Capability | Description | Authorization |
|---|-----------|-------------|--------------|
| SC-01 | Overlay activation | Apply overlay to session composite | Operator |
| SC-02 | Replay verification | Verify deterministic reconstructability | Operator |
| SC-03 | Rollback verification | Verify independent removability | Operator |
| SC-04 | Certification review | Review combined certification state | Operator |
| SC-05 | Authority promotion | Promote certified overlay to authority | Operator + Governance |
| SC-06 | Qualification monitoring | Track S-state and metric progression | Automated |
| SC-07 | Recovery operations | Rollback overlays, restore baseline | Operator + Governance |
| SC-08 | Session management | Freeze, resume, archive, supersede | Operator + Governance |

### 5.2 Capability-Zone Matrix

| Capability | SAFE | PRESSURE | RISK | PROHIBITED |
|-----------|------|----------|------|-----------|
| SC-01 Overlay activation | ✓ | ≤3 batch | ✗ | ✗ |
| SC-02 Replay verification | ✓ | ✓ | Restricted | ✗ |
| SC-03 Rollback verification | ✓ | ✓ | Restricted | ✗ |
| SC-04 Certification review | ✓ | ✓ | ✓ | ✗ |
| SC-05 Authority promotion | ✓ | ✓ | ✗ | ✗ |
| SC-06 Qualification monitoring | ✓ | ✓ | ✓ | ✓ (read-only) |
| SC-07 Recovery operations | ✓ | ✓ | ✓ | ✓ (rollback only) |
| SC-08 Session management | ✓ | ✓ | Freeze only | Freeze only |

---

## 6. Session Workspace View

### 6.1 Session Dashboard

```
┌──────────────────────────────────────────────────────┐
│ SANDBOX SESSION: SBX-BlueEdge-001          Zone: SAFE│
│ Status: ACTIVE  │  S-State: S2  │  Health: ●         │
├──────────────────────────────────────────────────────┤
│ SESSION SUMMARY                                       │
│ Baseline: a7b2..c4e1 (PIPELINE_CERTIFIED)            │
│ Overlays: 3 activated  │  Composite: f3d1..8a2b      │
│ Certified: 1/3  │  Promoted: 1/3  │  Published: 0/3  │
├──────────────────────────────────────────────────────┤
│ OVERLAY CHAIN                                         │
│ ┌──────┬──────────────┬──────────┬──────────────────┐│
│ │ Ord  │ Overlay       │ Type     │ Status           ││
│ │──────│──────────────│──────────│──────────────────││
│ │ 1    │ SEP-multi-001│ OT-GND   │ AUTH_PROMOTED    ││
│ │ 2    │ SEP-multi-002│ OT-CNT   │ REPLAY_CERTIFIED ││
│ │ 3    │ SEP-multi-003│ OT-SEM   │ ACTIVATED        ││
│ └──────┴──────────────┴──────────┴──────────────────┘│
├──────────────────────────────────────────────────────┤
│ QUALIFICATION                                         │
│ Grounding: 85.1%  │  Backed: 57/67  │  Q: AUTH-CAND  │
│ Authority-backed: 50/67  │  Provisional: 7/67        │
├──────────────────────────────────────────────────────┤
│ ACTIONS                                               │
│ [Activate Overlay] [Initiate Certification]          │
│ [View Lineage] [Recovery Options]                    │
└──────────────────────────────────────────────────────┘
```

---

## 7. Session Integrity Guarantees

### 7.1 Six Session Integrity Properties

| # | Property | Guarantee | Enforcement |
|---|----------|-----------|-------------|
| SI-01 | Deterministic reconstruction | Session state reproducible from inputs | Hash-verified inputs, monotonic ordering |
| SI-02 | Overlay isolation | Each overlay independently certifiable | Per-overlay certification pipeline |
| SI-03 | Rollback safety | Each overlay independently removable | Per-overlay rollback certification |
| SI-04 | Namespace isolation | No cross-session contamination | Namespace enforcement layer |
| SI-05 | Authority boundary | Provisional state never leaks to authority | 4 authority boundaries from workspace architecture |
| SI-06 | Lineage completeness | Every state traceable to source | L0→L5 lineage chain per overlay |

---

## 8. Governance

- Sandbox sessions are isolated governed semantic operational workspaces
- Sessions are NOT authority — explicit boundary separates sandbox from certified state
- 5 architecture layers: context, overlay chain, certification state, lineage, namespace
- 8 session capabilities with zone-specific authorization
- 6 session integrity properties enforced at architecture level
- Session identity: unique, client-scoped, run-scoped, singleton per active run
- No sandbox state directly enters LENS
- Session architecture is client-agnostic
