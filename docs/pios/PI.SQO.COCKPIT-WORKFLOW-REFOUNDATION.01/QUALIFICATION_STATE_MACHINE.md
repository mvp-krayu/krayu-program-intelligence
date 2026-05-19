# Qualification State Machine

> **Authority:** This document formalizes the S-state machine, posture overlay, transitions, prerequisites, and terminal states.

---

## S-State Machine

Four canonical qualification states. These are LOCKED in TERMINOLOGY_LOCK.md and do not change.

| State | Name | Meaning |
|---|---|---|
| **S0** | NO_QUALIFICATION | Client unregistered. No structural or semantic data. |
| **S1** | ONBOARDING_REQUIRED | Structural onboarding may be present. Semantic qualification not yet achieved. |
| **S2** | QUALIFIED_WITH_DEBT | Qualified. Semantic reconstruction complete. May carry semantic debt. |
| **S3** | AUTHORITY_READY | Full qualification. Authority-ready. (Not yet implemented.) |

S-states are stored in `promotion_state.json` as `s_level`. They are deterministic from qualification data — not assigned by judgment.

---

## Posture Overlay

Posture states provide operational granularity WITHIN S-states. They are not S-states themselves — they are computed projections of operational condition.

### Posture States Within S1

S1 is the broadest state. Most of the operator's qualification journey occurs within S1. Posture states differentiate the operator's position within S1:

```
S1 (ONBOARDING_REQUIRED)
  ├── STRUCTURAL_ONLY             — topology available, no semantic authority
  ├── SEMANTIC_INTAKE             — candidate CSR available, review not started
  ├── QUALIFICATION_PENDING       — review obligations exist, unresolved
  ├── CROSSWALK_ACTIVE            — intake complete, crosswalk construction needed
  ├── RECONCILIATION_ACTIVE       — reconciliation in progress
  ├── INSUFFICIENT_EVIDENCE       — temporary insufficiency acknowledged
  └── PERMANENTLY_UNQUALIFIABLE   — permanent insufficiency, terminal
```

### Posture States Within S2

```
S2 (QUALIFIED_WITH_DEBT)
  └── QUALIFIED                   — qualified, may carry debt
```

### Posture States Within S3

```
S3 (AUTHORITY_READY)
  └── QUALIFIED                   — authority-ready qualification
```

### Posture States Within S0

```
S0 (NO_QUALIFICATION)
  └── STRUCTURAL_ONLY             — no data available
```

---

## State Transitions

### S0 → S1

**Trigger:** Structural onboarding (PATH A pipeline execution)
**Prerequisites:**
- Client registered in manifest system
- Structural topology generated (`canonical_topology.json`)
- Promotion state initialized

**Authority:** Automated (pipeline execution). No operator action required.

### S1 → S2

**Trigger:** Promotion request approved
**Prerequisites:**
- All qualification blockers resolved (total_blockers = 0)
- All review obligations resolved or explicitly handled
- Crosswalk constructed (if semantic authority exists)
- Reconciliation complete (if crosswalk exists)
- Promotion request submitted by authorized actor
- Promotion approved by promotion_authority

**Authority:** Operator-initiated, promotion_authority-approved. Non-automatable.

### S2 → S3

**Trigger:** Authority readiness determination
**Prerequisites:**
- All semantic debt resolved or permanently deferred
- Full structural grounding achieved
- Authority ceiling at L5

**Authority:** Not yet implemented. Future stream.

---

## Blocker Taxonomy

Blockers prevent S-state transitions. They are grouped by lane:

| Lane | Description | Resolution Path |
|---|---|---|
| **evidence** | Missing or insufficient evidence for qualification | Ingest additional evidence, strengthen existing evidence |
| **crosswalk** | Crosswalk not constructed, incomplete, or rejected | Create crosswalk mapping, accept crosswalk (domain_authority) |
| **reconciliation** | PATH A/B reconciliation incomplete or failed | Complete reconciliation, accept reconciliation (domain_authority) |
| **semantic_authority** | Semantic review incomplete or contested | Complete review obligations (reviewer) |
| **governance** | Governance prerequisites not met | Address governance gaps, escalate if needed |
| **grounding** | Structural grounding insufficient for target state | Strengthen evidence backing, additional PATH A data |
| **replay** | Replay verification failed | Investigate replay failure, re-run verification |

Each blocker carries:
- Lane classification
- Human-readable description
- Whether it blocks S-state transition
- Resolution action (if available)
- Authority required for resolution

---

## Insufficiency States

Insufficiency is a governed operational determination, not an error:

### Temporary Insufficiency

- Evidence doesn't support advancement NOW
- Determination may be revisited with new evidence
- Requires `insufficiency_acknowledge` action with justification
- Posture: `INSUFFICIENT_EVIDENCE`
- Blockers and obligations PRESERVED (not deleted)
- S-level remains S1

### Permanent Insufficiency

- Evidence definitively doesn't support further qualification
- Terminal governance posture — no further progression possible
- Requires `insufficiency_acknowledge` action with `permanent: true` and justification
- Posture: `PERMANENTLY_UNQUALIFIABLE`
- Blockers and obligations PRESERVED as evidence of insufficiency
- S-level remains S1 permanently

Both states are first-class governance outcomes. Systems at S1 with permanent insufficiency are correctly governed — they are not broken or incomplete.

---

## Progression Path

The qualification journey as a linear sequence of steps. Each step has a status computed from posture and capabilities:

| Step | Status Conditions |
|---|---|
| **Structural Onboarding** | `complete` if structural_topology; `future` if not |
| **Semantic Derivation** | `complete` if semantic_candidates; `future` if not |
| **Semantic Review** | `complete` if no unresolved obligations; `current` if obligations exist; `future` if no semantic intake |
| **Crosswalk Construction** | `complete` if crosswalk exists; `current` if crosswalk blocker active; `future` if no intake |
| **Reconciliation** | `complete` if reconciliation data exists; `current` if reconciliation active; `future` if no crosswalk |
| **Qualification Promotion** | `complete` if S2+; `current` if all prerequisites met; `blocked` if blockers remain; `future` otherwise |

Terminal posture (PERMANENTLY_UNQUALIFIABLE) renders all future/blocked steps as `terminal`.

---

## Authority Progression

The authority model within the state machine:

```
L1 (structural)    → PATH A structural evidence
L2 (semantic)      → Semantic reconstruction from evidence
L3 (candidate)     → Candidate CSR from Semantic Derivation Compiler
L4 (reviewed)      → Operator-reviewed semantic authority
L5 (governed)      → Full governed qualification authority
```

Authority ceiling is stored in `promotion_state.json` as `authority_ceiling`. It advances through governed actions, never automatically.

---

## State Machine Invariants

1. **S-states are monotonically non-decreasing** — once S2, never back to S1 (insufficiency is within S1, not a regression from S2)
2. **Posture is computed, never stored** — derived from operational data at render time
3. **Transitions require human authority** — non-automatable boundaries enforced
4. **Blockers must reach zero for transition** — no "override" mechanism
5. **Event lineage is append-only** — all transitions recorded in promotion_event_log.jsonl
6. **Insufficiency preserves state** — blockers and obligations are not deleted

---

## Cockpit Rendering from State Machine

The state machine drives cockpit rendering through `resolveOperatorWorkflow`:

```
S-state + posture + blockers + obligations + capabilities + role
  ↓
resolveOperatorWorkflow
  ↓
Cockpit rendering decisions:
  - Posture badge color and label
  - Primary guidance headline
  - Blocker summary content
  - Available action list
  - Progression path step statuses
  - Tier 2 surface visibility
  - Role-aware action availability
```

The cockpit is a deterministic projection of the state machine. Same state → same rendering. No hidden logic.
