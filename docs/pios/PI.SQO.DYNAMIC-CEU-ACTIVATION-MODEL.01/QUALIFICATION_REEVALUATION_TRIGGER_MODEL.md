# Qualification Re-evaluation Trigger Model

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines the trigger model for qualification re-evaluation
in the context of Dynamic CEU activation. Re-evaluation is the mechanism
by which overlay contributions become reflected in qualification state
WITHOUT rerunning the structural pipeline.

---

## 2. Trigger Events

### 2.1 Primary Triggers

| Event | Code | Description |
|-------|------|-------------|
| SEP Activated | SEP_ACTIVATED | A Semantic Evidence Package transitions to ACTIVATED status |
| SEP Revoked | SEP_REVOKED | An ACTIVATED package is revoked |
| SEP Version Upgrade | SEP_VERSION_UPGRADE | An ACTIVATED package is superseded by newer version |
| Overlay Conflict Resolved | OVERLAY_CONFLICT_RESOLVED | A previously escalated conflict is resolved |

### 2.2 Non-Triggers

The following events do NOT trigger qualification re-evaluation:

| Event | Why Not |
|-------|---------|
| Package registration (STAGED) | No overlay contribution active |
| Validation failure | No state change |
| Authorization denial | No state change |
| Cockpit display change | Display is output, not input |
| Governance document update | Governance changes require explicit re-evaluation stream |
| Substrate pipeline re-execution | Produces new certified substrate; triggers full evaluation, not re-evaluation |

---

## 3. Trigger-to-Re-evaluation Flow

### 3.1 SEP_ACTIVATED Trigger

```
SEP transitions to ACTIVATED
    │
    ├── Trigger event emitted
    │     trigger_type: SEP_ACTIVATED
    │     trigger_package_id: <newly activated package>
    │     timestamp: <ISO-8601>
    │
    ├── Re-evaluation input assembly
    │     certified_substrate: LOAD from artifact store
    │     active_overlay_set: ALL ACTIVATED packages (including new one)
    │     prior_qualification_state: LOAD from latest evaluation
    │
    ├── Re-evaluation execution (8-step process)
    │     1. Load certified substrate
    │     2. Load active overlay set
    │     3. Compute composite semantic state
    │     4. Resolve Q-class from composite
    │     5. Re-evaluate semantic debt inventory
    │     6. Recompute progression readiness
    │     7. Emit re-evaluation artifact
    │     8. Update SQO cockpit state
    │
    └── Re-evaluation output
          composite_state: <new qualification state>
          changes: <what changed from prior state>
          overlay_attribution: <which packages contributed>
```

### 3.2 SEP_REVOKED Trigger

```
SEP transitions to REVOKED
    │
    ├── Trigger event emitted
    │     trigger_type: SEP_REVOKED
    │     trigger_package_id: <revoked package>
    │     revocation_reason: <reason>
    │
    ├── Re-evaluation input assembly
    │     certified_substrate: LOAD from artifact store
    │     active_overlay_set: ALL ACTIVATED packages (EXCLUDING revoked one)
    │     prior_qualification_state: LOAD from latest evaluation
    │
    ├── Re-evaluation execution (8-step process)
    │     Same process; overlay set excludes revoked package
    │
    └── Re-evaluation output
          composite_state: <revised qualification state>
          changes: <what reverted from prior state>
          overlay_attribution: <remaining contributing packages>
```

### 3.3 SEP_VERSION_UPGRADE Trigger

```
SEP version N+1 activates, version N superseded
    │
    ├── Trigger event emitted
    │     trigger_type: SEP_VERSION_UPGRADE
    │     trigger_package_id: <upgraded package>
    │     prior_version: N
    │     new_version: N+1
    │
    ├── Re-evaluation input assembly
    │     certified_substrate: LOAD from artifact store
    │     active_overlay_set: ALL ACTIVATED packages (with new version)
    │     prior_qualification_state: LOAD from latest evaluation
    │
    ├── Re-evaluation execution (8-step process)
    │     Same process; overlay set includes new version, excludes old
    │
    └── Re-evaluation output
          composite_state: <updated qualification state>
          changes: <what changed due to version upgrade>
          overlay_attribution: <updated attribution>
```

### 3.4 OVERLAY_CONFLICT_RESOLVED Trigger

```
Escalated conflict resolved by governance review
    │
    ├── Trigger event emitted
    │     trigger_type: OVERLAY_CONFLICT_RESOLVED
    │     conflict_id: <conflict identifier>
    │     resolution: <winning entry, losing entry, or both suspended>
    │
    ├── Re-evaluation input assembly
    │     certified_substrate: LOAD from artifact store
    │     active_overlay_set: ALL ACTIVATED packages (with resolution applied)
    │     prior_qualification_state: LOAD from latest evaluation
    │
    ├── Re-evaluation execution (8-step process)
    │     Same process; conflict resolution affects overlay application
    │
    └── Re-evaluation output
          composite_state: <post-resolution qualification state>
          changes: <what changed due to conflict resolution>
```

---

## 4. Re-evaluation Constraints

### 4.1 No Structural Pipeline Re-execution

Re-evaluation operates ONLY on:
- Certified substrate (already computed, immutable)
- Active overlay set (already validated and activated)

Re-evaluation NEVER triggers:
- Structural reconstruction
- DPSIG re-execution
- PATH A pipeline re-execution
- Evidence ingestion

### 4.2 Formula Immutability

The Q-class resolution formula is governance-locked:
```
Q-class = f(composite_backed_count, total_count,
            composite_continuity_status, evidence_availability)
```

Re-evaluation applies the SAME formula to the new composite state.
The formula itself is NEVER modified by overlay activation.

### 4.3 Idempotency

Running the same re-evaluation twice with the same inputs MUST
produce the same output. Re-evaluation is a pure function:

```
re_evaluation_output = f(certified_substrate, active_overlay_set, Q_class_formula)
```

No external state, no randomness, no inference.

### 4.4 Trigger Ordering

When multiple triggers occur in rapid succession (e.g., two packages
activated sequentially), re-evaluations are serialized:

1. Each trigger produces one re-evaluation
2. Re-evaluations execute in trigger order
3. Each re-evaluation's output becomes the "prior state" for the next
4. No concurrent re-evaluations for the same (client, run_id)

This serialization preserves determinism.

---

## 5. Re-evaluation Scope

### 5.1 What Re-evaluation Computes

| Metric | Recomputed | Source |
|--------|-----------|--------|
| composite_backed_count | YES | Static + overlay lineage upgrades |
| composite_continuity_coverage | YES | Certified crosswalk + overlay crosswalk extensions |
| Q-class | YES | Formula applied to composite metrics |
| S-state | YES | Gate check against composite state |
| blocking_debt_count | YES | Debt items checked against composite state |
| progression_readiness | YES | Formula: 1 - (blocking_count / total_debt) |
| maturity_dimension_scores | YES | Overlay enrichments applied to dimension scoring |
| overlay_attribution | YES | Which packages contribute to which metrics |

### 5.2 What Re-evaluation Preserves (Immutable)

| Element | Why Immutable |
|---------|--------------|
| Certified topology | Pipeline-derived structural truth |
| DPSIG signals | Lane D sovereign |
| Decision validation results | Pipeline-executed checks |
| Reproducibility verdict | Pipeline guarantee |
| Certified crosswalk entries | Cannot be modified by overlay |
| Q-class formula | Governance-locked |
| S-state gate definitions | Locked by qualification governance |

---

## 6. Re-evaluation Artifact

Every re-evaluation produces a persisted artifact:

**Path:** `artifacts/sqo/<client>/<run_id>/re-evaluations/`
**Filename:** `re-evaluation-<timestamp>.v1.json`

**Schema:** (per QUALIFICATION_REEVALUATION_MODEL §7)

The artifact includes:
- Trigger event details
- Prior state snapshot
- Composite state snapshot
- Changes list with attribution
- Overlay attribution summary
- Governance assertions (no substrate mutation, no formula modification)

---

## 7. Re-evaluation and S-State Transitions

### 7.1 S-State Advancement from Re-evaluation

If re-evaluation produces a composite state that satisfies gates for
a higher S-state, the S-state MAY advance:

| Transition | Re-evaluation Can Trigger | Conditions |
|-----------|--------------------------|------------|
| S0 → S1 | NO | S1 requires pipeline registration (cannot be overlay-provided) |
| S1 → S2 | YES | If overlay lineage upgrades + crosswalk extensions satisfy S2 gates |
| S2 → S3 | YES | If overlay lineage upgrades achieve full domain backing |

### 7.2 S-State Regression from Re-evaluation

If re-evaluation (after revocation) produces a composite state that
no longer satisfies gates for the current S-state:

| Scenario | Re-evaluation Result |
|----------|---------------------|
| Revocation removes lineage upgrades needed for S2 | S-state MAY regress from S2 to S1 |
| Revocation removes all overlay contributions | S-state reverts to Static CEU evaluation |

S-state regression from revocation is a natural consequence of the
independently-removable guarantee. The system does not "remember" a
prior S-state achieved with now-revoked evidence.

---

## 8. Trigger Governance Rules

1. Every trigger event MUST be logged with timestamp and trigger details.
2. Every re-evaluation MUST produce an artifact (no silent re-evaluations).
3. Re-evaluation MUST NOT proceed if certified substrate is corrupted.
4. Re-evaluation MUST include full overlay attribution.
5. S-state transitions from re-evaluation MUST meet ALL gate requirements.
6. Re-evaluation is NOT a pipeline re-execution — it operates on existing
   certified substrate plus overlay set.
