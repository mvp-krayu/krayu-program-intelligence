# Projection Authorization Doctrine

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines the formal doctrine governing when semantic projection to the executive surface is authorized, under what conditions, and with what disclosures. Projection authorization is the decision point where structural and semantic evidence becomes visible to executives — the highest-consequence rendering decision in the system.

Projection authorization is governance, not UX. A surface that renders without governance authorization is an ungoverned projection — regardless of visual quality.

---

## 2. Authorization model

### 2.1 Authorization tiers

| Tier | S-state | Q-class | Authorization | Executive surface |
|------|---------|---------|---------------|-------------------|
| NOT_AUTHORIZED | S0 | N/A | Denied | Report-pack only. No executive intelligence surface. |
| NOT_AUTHORIZED | S1 | Q-04 | Denied | LIVE_BINDING_FAILED. Structured rejection with missing artifact enumeration. |
| AUTHORIZED_WITH_QUALIFICATION | S2 | Q-02 | Conditional | Full executive surface with Q-02 qualifier chip. Advisory confirmation mandatory. |
| AUTHORIZED_WITH_QUALIFICATION | S2 | Q-03 | Conditional | Full executive surface with Q-03 qualifier chip. Executive caution mandatory. |
| FULLY_AUTHORIZED | S3 | Q-01 | Unconditional | Full executive surface. No qualifier chip. Readiness badge sufficient. |
| FULLY_AUTHORIZED_EXTENDED | S4+ | Q-01 | Unconditional + extended | Extended executive surface with multi-signal-class layers. Per-layer disclosure. |

### 2.2 Authorization rules

**RULE PA-01:** Projection is denied by default. Authorization requires explicit evidence satisfaction.

**RULE PA-02:** Authorization is determined by a pure function of (S-state, Q-class, artifact evidence). No manual override. No client-specific branching.

**RULE PA-03:** Authorization tier cannot exceed what the evidence supports. A client with missing required artifacts cannot be authorized — regardless of structural completeness.

**RULE PA-04:** Authorization is replay-safe. Same evidence → same authorization tier. No session-dependent authorization.

**RULE PA-05:** Authorization decisions are governance-disclosed. The executive must know why projection was authorized at a given tier, not just that it was authorized.

---

## 3. Boardroom authorization thresholds

### 3.1 Definition

Boardroom authorization is the specific threshold at which the executive surface is deemed suitable for executive decision-making. It is stricter than technical projection authorization because it carries organizational accountability.

### 3.2 Thresholds

| Threshold | Criterion | Satisfied by |
|-----------|-----------|--------------|
| Evidence completeness | All 6 required artifacts present | S2+ |
| Semantic continuity | Crosswalk validated | S2+ with Q-02 or Q-01 |
| Decision validation | All validation functions PASS | S2+ |
| Reproducibility | FULL_REPRODUCIBILITY verdict | S2+ |
| Grounding sufficiency | At least partial structural grounding (backed_count > 0) | S2 with Q-02 or S3 with Q-01 |
| Rendering integrity | rendering_metadata present with ENFORCED integrity protection | S2+ with rendering_metadata |
| Disclosure compliance | Q-class chip rendered per Q02_GOVERNANCE_AMENDMENT.md | Always (when Q-class < Q-01) |

### 3.3 Boardroom authorization states

**BOARDROOM_READY:** All thresholds satisfied. Q-01 or Q-02 with full disclosure compliance. Executive projection suitable for decision-making.

**BOARDROOM_QUALIFIED:** Most thresholds satisfied. Q-02 with advisory confirmation required. Executive projection suitable for review but requires explicit advisory confirmation before executive commitment.

**BOARDROOM_NOT_READY:** One or more thresholds unsatisfied. Executive projection not suitable for decision-making. Technical review only.

**BOARDROOM_DENIED:** Required artifacts absent. No executive projection. Report-pack only.

---

## 4. Authorization decision flow

```
Input: manifest, loadResult, qualificationState

Step 1: Artifact check
  if loadResult.error == 'REQUIRED_ARTIFACT_MISSING':
    → NOT_AUTHORIZED (missing artifacts)
    → disclosure: enumerate missing artifacts

Step 2: Q-class resolution
  qClass = resolveQualifierClass(payload)
  if qClass == 'Q-04':
    → NOT_AUTHORIZED (evidence unavailable)
    → disclosure: "Withheld · evidence unavailable"

Step 3: S-state check
  sState = detectQualificationState(manifest, loadResult)
  if sState == 'S0':
    → NOT_AUTHORIZED (structural only)
    → disclosure: "Report-pack only — no semantic intelligence claimed"

Step 4: Conditional authorization
  if qClass == 'Q-03':
    → AUTHORIZED_WITH_QUALIFICATION
    → disclosure: "QUALIFIER Q-03 · Semantic Continuity Only"
    → executive caution mandatory

  if qClass == 'Q-02':
    → AUTHORIZED_WITH_QUALIFICATION
    → disclosure: "QUALIFIER Q-02 · Partial Grounding · Structural Continuity"
    → advisory confirmation mandatory

Step 5: Full authorization
  if qClass == 'Q-01':
    → FULLY_AUTHORIZED
    → disclosure: none required (readiness badge sufficient)

Output: authorization_tier, disclosure_obligations, runtime_restrictions
```

This flow is deterministic and replay-safe. It derives entirely from existing resolver and Q-class behavior — no new computation.

---

## 5. Disclosure obligations per tier

### NOT_AUTHORIZED (S0)

No disclosure required. S0 does not claim semantic intelligence. Report-pack surfaces carry no governance qualifier.

### NOT_AUTHORIZED (S1)

| Obligation | Content |
|------------|---------|
| Missing artifact notice | List of specific missing required artifact keys |
| HTTP status | 424 (REQUIRED_ARTIFACT_MISSING) for API, 502 for page |
| Binding status | REJECTED with reason |
| Recovery guidance | "Required semantic artifacts missing. Enrich source material and re-run semantic pipeline." |

### AUTHORIZED_WITH_QUALIFICATION (Q-02)

| Obligation | Content |
|------------|---------|
| Qualifier chip | "QUALIFIER Q-02 · Partial Grounding · Structural Continuity" |
| Executive note | "Semantic continuity is validated but advisory confirmation is required for executive commitment on partially grounded domains." |
| Unresolved gaps | Enumeration of ungrounded domains |
| Advisory confirmation | Mandatory before executive commitment |
| Forbidden language | No "probabilistic", "AI confidence", "estimated likelihood" |

### AUTHORIZED_WITH_QUALIFICATION (Q-03)

| Obligation | Content |
|------------|---------|
| Qualifier chip | "QUALIFIER Q-03 · Semantic Continuity Only" |
| Executive note | "There is no structural backing. Only semantic continuity supports the projection. Executive caution required." |
| Structural absence notice | Explicit statement that grounded/total = 0 |
| Forbidden language | Same as Q-02 |

### FULLY_AUTHORIZED (Q-01)

| Obligation | Content |
|------------|---------|
| Readiness badge | Sufficient alone |
| No qualifier chip | Q-01 does not require additional disclosure |

---

## 6. Downgrade handling

### 6.1 Downgrade definition

A projection authorization downgrade occurs when a client's authorization tier drops:
- FULLY_AUTHORIZED → AUTHORIZED_WITH_QUALIFICATION
- AUTHORIZED_WITH_QUALIFICATION → NOT_AUTHORIZED
- Any tier → any lower tier

### 6.2 Downgrade causes

| Cause | Detection | Impact |
|-------|-----------|--------|
| Artifact removal | Required artifact no longer present on disk | S2→S1 or S1→S0 |
| Artifact invalidation | Artifact present but fails schema validation | S2→S1 |
| Grounding regression | backed_count drops | S3→S2 (Q-01→Q-02) |
| Continuity regression | Crosswalk invalidated | S2→S1 |
| Evidence unavailability | evidence_availability changes | Q-02/Q-03→Q-04 |

### 6.3 Downgrade protocol

1. **Detection:** State detection algorithm runs and produces a lower S-state than the prior recorded state.
2. **Recording:** Downgrade event is recorded in qualification_history.json with timestamp, prior state, new state, and cause.
3. **Disclosure:** Degradation alert rendered on the executive surface (see RUNTIME_QUALIFICATION_UX.md Area 15).
4. **Rendering update:** Surface immediately renders with the new authorization tier's manifestation.
5. **No masking:** The prior authorization tier must NEVER be maintained after evidence no longer supports it.

### 6.4 Downgrade governance

- Downgrades are governance events. They are audited, disclosed, and recorded.
- No downgrade may be suppressed to avoid executive concern.
- No downgrade may be delayed to "wait for recovery."
- The executive must know within the current rendering cycle that a downgrade has occurred.

---

## 7. SQO role in projection authorization

SQO is an UPSTREAM ADVISOR to projection authorization. SQO does not make projection authorization decisions — PATH B does.

### SQO advisory outputs

| Output | Purpose | Consumed by |
|--------|---------|-------------|
| Qualification state assessment | Current S-state | PATH B projection authorization |
| Maturity score | Operational visibility into progression | PATH B disclosure rendering |
| Semantic debt inventory | Gap enumeration | PATH B gap disclosure |
| Enrichment recommendations | Improvement guidance | PATH B guidance rendering |
| Governance disclosure | What the executive must know | PATH B disclosure obligations |

### SQO boundaries

SQO MAY:
- Advise that a client is at S1 and missing artifacts
- Advise that a client's grounding ratio has regressed
- Recommend enrichment actions to improve authorization tier
- Produce governance disclosures for PATH B to render

SQO MUST NOT:
- Directly deny projection
- Directly authorize projection
- Override Q-class resolution
- Create new gating rules without governance stream
- Modify PATH B rendering logic

---

## 8. Relationship to existing authorization mechanisms

### Q-class resolution (existing)

The Q-class resolution rule (Q02_GOVERNANCE_AMENDMENT.md §4) remains the primary projection authorization mechanism. SQO does not replace or override Q-class resolution. SQO provides operational context (S-state, maturity, debt) that enriches the authorization decision.

### Resolver fail-closed (existing)

The GenericSemanticPayloadResolver fail-closed behavior (REQUIRED_ARTIFACT_MISSING → REJECTED) remains the primary technical authorization mechanism. SQO does not modify resolver behavior. SQO explains why the resolver rejected and what would resolve the rejection.

### Readiness gating (existing)

The readiness gate (`executive_rendering_allowed`) per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §8 remains the primary executive rendering gate. SQO does not modify gating behavior. SQO reports on gating state and contributes to gating context.

---

## 9. Governance

1. Projection authorization is a deterministic function of evidence state. No manual override.
2. Authorization decisions are replay-safe. Same evidence → same decision.
3. All authorization decisions are governance-disclosed. No silent authorization or denial.
4. Downgrade handling is mandatory. No suppression of authorization regression.
5. SQO advises — PATH B decides. No SQO override of projection authorization.
6. Client-specific authorization branching is forbidden. The same rules apply to all substrates.
7. New authorization rules require explicit governance stream. This document does not create new gates — it formalizes the doctrine governing existing mechanisms.
