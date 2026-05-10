# Executive Projection Gating

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines the gating doctrine that governs when semantic projections are permitted to reach the executive surface. Gating is the system's primary false-positive containment mechanism — it prevents premature, ungoverned, or insufficiently grounded projections from informing executive decisions.

Gating operates at the intersection of Q-class resolution, S-state classification, and SQO qualification. It is deterministic, fail-closed, and governance-disclosed.

---

## 2. Gating layers

The system enforces gating at three complementary layers:

### Layer G1: Artifact Gate (Technical)

**Mechanism:** GenericSemanticArtifactLoader checks required artifacts.

**Behavior:**
- All 6 required artifacts present → PASS
- Any required artifact missing → FAIL (REQUIRED_ARTIFACT_MISSING)

**Fail-closed:** Missing artifact → `loadResult.ok = false` → resolver returns `binding_status: 'REJECTED'`.

**Governance:** This gate is part of Lane A/PATH B existing behavior. SQO does not modify it. SQO reports on it.

---

### Layer G2: Qualification Gate (Semantic)

**Mechanism:** Q-class resolution per Q02_GOVERNANCE_AMENDMENT.md §4.

**Behavior:**
- Q-01 → PASS (no qualification required)
- Q-02 → CONDITIONAL_PASS (projection permitted with qualifier chip)
- Q-03 → CONDITIONAL_PASS (projection permitted with executive caution)
- Q-04 → FAIL (evidence unavailable)

**Fail-closed:** Q-04 → no executive projection. Explicit absence notice rendered.

**Governance:** Q-class is a deterministic pure function. No manual override. No client-specific branching.

---

### Layer G3: Readiness Gate (Executive)

**Mechanism:** `executive_rendering_allowed` assertion per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §8.

**Behavior:**
- `executive_rendering_allowed = true` → executive rendering permitted
- `executive_rendering_allowed = false` → executive rendering blocked (default for new signal classes)

**Fail-closed:** Default is false for any new intelligence extension until gating is proven.

**Governance:** False-positive containment containers (C-01, C-02, C-04) apply. Gate must be client-agnostic.

---

## 3. Gate interaction model

```
                         ┌─────────────┐
Artifacts on disk ──────→│ G1: Artifact │──FAIL──→ REJECTED (424/502)
                         │     Gate     │
                         └──────┬──────┘
                                │ PASS
                                ▼
                         ┌─────────────┐
Resolver inputs ────────→│ G2: Qualif.  │──FAIL──→ WITHHELD (Q-04)
                         │     Gate     │
                         └──────┬──────┘
                                │ PASS / CONDITIONAL_PASS
                                ▼
                         ┌─────────────┐
Extension state ────────→│ G3: Readiness│──FAIL──→ Extension blocked
                         │     Gate     │          (existing surface unaffected)
                         └──────┬──────┘
                                │ PASS
                                ▼
                         Executive Surface
                         (with applicable disclosures)
```

**Gate ordering is strict.** G1 must pass before G2 is evaluated. G2 must pass or conditionally pass before G3 is evaluated. No gate may be bypassed.

**Gate independence:** Each gate evaluates independently. G1 PASS does not imply G2 PASS. G2 PASS does not imply G3 PASS.

---

## 4. Gating rules

### Rule GR-01: No synthetic bypass

No gate may be bypassed by synthetic data, mock artifacts, or placeholder evidence. Gates evaluate real artifact state only.

### Rule GR-02: No client-specific gating

The same gating logic applies to all clients. No `if (client === 'blueedge')` branching in gate logic.

### Rule GR-03: No silent failure

Every gate failure must produce an explicit, structured, machine-readable rejection with:
- Gate identifier (G1/G2/G3)
- Failure reason
- Specific evidence that triggered the failure
- Recovery guidance

### Rule GR-04: No progressive relaxation

Gates do not "warm up" or "learn." A gate that fails today fails tomorrow given the same evidence. Gates are stateless functions.

### Rule GR-05: No manual override

No administrative interface, environment variable, or configuration flag may override a gate. Gate results are determined by evidence alone.

### Rule GR-06: No hidden gating

No gate may operate silently. Every gate evaluation must be auditable — either through the resolver's response payload or through SQO qualification artifacts.

---

## 5. Downgrade handling

### 5.1 Gate state changes

Gate state can change when underlying evidence changes:

| Evidence change | G1 impact | G2 impact | G3 impact |
|----------------|-----------|-----------|-----------|
| Required artifact removed | FAIL | N/A (G1 blocks) | N/A |
| Domain grounding regresses | No change | Q-class may change (Q-01→Q-02) | No change |
| Crosswalk invalidated | May cause artifact absence | Q-class may change (Q-02→Q-03) | No change |
| Evidence becomes unavailable | Depends on artifact | Q-04 | No change |
| Extension lifecycle incomplete | No change | No change | FAIL for that extension |

### 5.2 Downgrade detection

SQO detects gating downgrades by comparing current gate state against prior recorded gate state:

```
current_gate_state = evaluateGates(current_artifacts)
prior_gate_state = readPriorGateState(qualification_history)

if current_gate_state < prior_gate_state:
  emit downgrade event
  record in qualification_history
  trigger degradation alert (RUNTIME_QUALIFICATION_UX.md Area 15)
```

### 5.3 Downgrade response

| Downgrade type | Response | Executive impact |
|----------------|----------|------------------|
| G1 PASS → G1 FAIL | Immediate projection withdrawal | Surface transitions to LIVE_BINDING_FAILED |
| G2 Q-01 → G2 Q-02 | Qualifier chip appears | Advisory confirmation now required |
| G2 Q-02 → G2 Q-03 | Qualifier chip changes | Executive caution now required |
| G2 Q-02/Q-03 → G2 Q-04 | Projection withdrawn | Explicit absence notice |
| G3 PASS → G3 FAIL | Extension surface removed | Base surface unaffected |

### 5.4 Downgrade governance

- Downgrades are immediate. No grace period. No delayed enforcement.
- Downgrades are disclosed. The executive must see that a downgrade occurred.
- Downgrades are recorded. Qualification history captures every downgrade event.
- Downgrades are reversible. Restoring the evidence restores the gate state.
- No downgrade suppression. Hiding a downgrade is a governance violation.

---

## 6. SQO contribution to gating

SQO does not create new gates. SQO enriches the gating context:

### 6.1 Pre-gate advisory

Before gate evaluation, SQO provides:
- Current S-state assessment
- Semantic debt inventory (what gaps might cause gate failure)
- Maturity score (operational context for the gate result)
- Enrichment recommendations (what would change the gate outcome)

### 6.2 Post-gate disclosure

After gate evaluation, SQO provides:
- Gate result explanation (why the gate passed or failed)
- Specific evidence that determined the result
- Recovery pathway (for failed gates)
- Progression pathway (for conditional passes — how to achieve unconditional pass)

### 6.3 Gate monitoring

SQO continuously monitors gate-relevant evidence:
- Artifact presence (G1 readiness)
- Grounding ratio changes (G2 readiness)
- Crosswalk validity (G2 readiness)
- Extension lifecycle completion (G3 readiness)

Monitoring results are recorded in SQO qualification artifacts for historical tracking.

---

## 7. Relationship to existing gating

### Resolver fail-closed (preserved)

The GenericSemanticPayloadResolver's fail-closed behavior is unchanged:
- `loadResult.ok = false` → `binding_status: 'REJECTED'`
- No modification to resolver logic by SQO

### Q-class resolution (preserved)

The Q-class resolution rule (Q02_GOVERNANCE_AMENDMENT.md §4) is unchanged:
- Pure function of (backed_count, total_count, semantic_continuity_status, evidence_availability)
- No modification to Q-class logic by SQO

### Readiness gate (preserved)

The `executive_rendering_allowed` gate (GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §8) is unchanged:
- Default false for new signal classes
- No modification to readiness gate logic by SQO

SQO provides operational context around these existing gates. It does not modify, override, or replace them.

---

## 8. Governance

1. Gating is fail-closed. Default state is DENIED until evidence proves authorization.
2. Gating is deterministic. Same evidence → same gate result. No stochastic gating.
3. Gating is client-agnostic. No client-specific branching in gate logic.
4. All gate failures produce explicit, structured rejections. No silent denial.
5. No gate may be manually overridden. Evidence alone determines gate state.
6. Downgrades are immediate, disclosed, and recorded. No suppression.
7. SQO advises on gating context. SQO does not create, modify, or bypass gates.
8. New gates require explicit gate amendment contracts per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §8.
