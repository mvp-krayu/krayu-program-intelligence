# Operational Rollback and Revocation Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.OPERATIONALIZATION-BASELINE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization

---

## 1. Purpose

This document defines the operational reversibility guarantees for
BlueEdge Dynamic CEU activation — how overlays are revoked, rolled back,
and how qualification state is restored to prior states.

---

## 2. Reversibility Principle

**Every BlueEdge overlay activation is fully reversible.**

Removing an overlay restores the qualification state to EXACTLY what it
would be if the overlay had never been activated. This is the independent
removability guarantee applied to the BlueEdge operational context.

---

## 3. Revocation Scenarios

### 3.1 Single Package Revocation

**Scenario:** One overlay package revoked while others remain active.

```
Before:  SEP-001 (ACTIVATED) + SEP-002 (ACTIVATED) + SEP-003 (ACTIVATED)
         backed = 4 + 3 + 4 + 3 = 14/17

Revoke:  SEP-002

After:   SEP-001 (ACTIVATED) + SEP-003 (ACTIVATED)
         backed = 4 + 3 + 3 = 10/17
         (SEP-002's 4 lineage upgrades removed from composite)
```

**Verification:** Composite state without SEP-002 equals composite state
that would exist if SEP-002 had never been activated.

### 3.2 Cascade Revocation (Dependency)

**Scenario:** Package B depends on Package A. Revoking A requires revoking B.

```
Before:  SEP-001 (ACTIVATED) + SEP-002 (depends on SEP-001, ACTIVATED)
Revoke:  SEP-001

Step 1:  Check dependencies → SEP-002 depends on SEP-001
Step 2:  Standard revocation BLOCKED
Step 3:  Options:
         a) Revoke SEP-002 first, then SEP-001
         b) Emergency revocation cascades both
         c) Update SEP-002 to remove dependency (new version)
```

### 3.3 Full Overlay Reset

**Scenario:** All overlays revoked. Return to certified baseline.

```
Before:  SEP-001 + SEP-002 + SEP-003 (all ACTIVATED)
         S3, Q-01, backed=17/17

Reset:   ALL REVOKED

After:   No active overlays
         S2, Q-02, backed=4/17
         (exactly the certified baseline state)
```

### 3.4 Version Rollback

**Scenario:** Package v2 introduced errors; roll back to v1.

```
Before:  SEP-001.v2 (ACTIVATED, 5 entries)
Rollback: SEP-001.v2 → SEP-001.v1 (3 entries)

Step 1:  SEP-001.v2 transitions to SUPERSEDED
Step 2:  SEP-001.v1 re-enters activation at Phase 1
Step 3:  If v1 passes all checks: ACTIVATED
Step 4:  Re-evaluation with v1's entries (not v2's)
```

---

## 4. State Restoration Guarantees

### 4.1 Qualification State After Revocation

| Metric | How Restored |
|--------|-------------|
| backed_count | Recomputed from substrate + remaining active overlays |
| Q-class | Formula reapplied to new composite backed_count |
| S-state | Gate check against new composite state |
| Debt items | Overlay-resolved items revert to unresolved |
| Progression readiness | Recomputed from new blocking debt count |
| Maturity scores | Recomputed without revoked overlay contributions |

### 4.2 S-State Regression After Revocation

| Revocation Impact | S-State Result |
|-------------------|----------------|
| Revoke minor overlay (backed still ≥ S2 minimum) | S2 maintained |
| Revoke critical overlay (backed drops below S2 gates) | S2 → S1 |
| Full overlay reset | S2 (certified baseline) |
| Revoke overlay after S3 achieved (backed < 17/17) | S3 → S2 |

### 4.3 Revocation Does NOT Affect

| Element | Why Unaffected |
|---------|---------------|
| Certified substrate | Never modified by overlays |
| DPSIG signals | Lane D sovereign, never touched |
| Decision validation | Pipeline-certified, not overlay-dependent |
| Reproducibility verdict | Pipeline guarantee, independent of overlays |
| Q-class formula | Governance-locked, applied to whatever composite state exists |
| Package artifacts | REVOKED but never deleted (retention policy) |

---

## 5. Operational Revocation Process

### 5.1 Standard Revocation (BlueEdge)

```
1. IDENTIFY package to revoke and reason
2. CHECK for dependent packages in BlueEdge scope
   → If dependents: BLOCK (resolve first)
   → If none: PROCEED
3. MARK package REVOKED in registry
4. RECOMPUTE composite state:
   Load substrate (unchanged)
   Load remaining active overlays (minus revoked)
   Apply in package_id order
   Compute composite metrics
5. EMIT SEP_REVOKED trigger
6. EXECUTE re-evaluation
7. VERIFY composite state integrity
8. LOG revocation event
```

### 5.2 Emergency Revocation (BlueEdge)

**Trigger:** Overlay producing incorrect BlueEdge qualification state.

```
1. MARK package REVOKED with EMERGENCY flag
2. CASCADE to dependent packages (if any)
3. RECOMPUTE composite state without revoked package(s)
4. EMIT SEP_REVOKED trigger(s)
5. EXECUTE re-evaluation
6. FLAG for governance post-review
7. LOG with elevated audit severity
```

### 5.3 Full Reset (BlueEdge)

**Trigger:** Systemic issue requiring return to certified baseline.

```
1. MARK ALL ACTIVATED packages as REVOKED
2. Composite state = certified substrate alone
3. S-state = S2 (certified baseline)
4. Q-class = Q-02 (certified baseline)
5. backed_count = 4/17 (certified baseline)
6. All overlay-resolved debt items revert
7. LOG full reset event
```

---

## 6. Revocation Artifact (BlueEdge)

```json
{
  "revocation_id": "<uuid>",
  "client": "blueedge",
  "run_id": "run_blueedge_productized_01_fixed",
  "package_id": "SEP-blueedge-...-001",
  "revocation_type": "STANDARD | EMERGENCY | FULL_RESET",
  "reason": "<reason>",
  "authority": "<who authorized>",
  "timestamp": "<ISO-8601>",
  "state_impact": {
    "prior": { "s_state": "S2", "backed_count": 8, "q_class": "Q-02" },
    "after": { "s_state": "S2", "backed_count": 4, "q_class": "Q-02" }
  },
  "governance": {
    "substrate_mutation": false,
    "replay_chain_preserved": true,
    "baseline_restored": true
  }
}
```

---

## 7. Operational Reversibility Guarantees

| Guarantee | Enforcement |
|-----------|-------------|
| Any single overlay is independently removable | Dependency check + composite recomputation |
| Full overlay reset restores certified baseline | Immutable substrate + no-deletion retention |
| Revocation is logged and auditable | Revocation artifact + audit trail |
| Revocation does not corrupt replay chain | Package retained for historical replay |
| S-state regression is automatic and correct | Gate check against post-revocation composite |
| No data loss from revocation | Packages retained with REVOKED status |
