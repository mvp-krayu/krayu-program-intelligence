# EIR Narrative Mode Activation Contract

Stream: PI.EIR-EXECUTION-BLINDNESS.01
Date: 2026-06-06
Status: LOCKED

---

## Purpose

This contract defines the constitutional switch between EIR's two narrative modes. The switch is evidence-driven, not configuration-driven. The specimen's evidence determines which story EIR tells.

---

## The Two Modes

### MODE A: Structural Intelligence (default)

**Spine:** "Here is the system and here are its issues."

**Activation:** Any specimen without sufficient runtime connectivity evidence.

**Chapters:** Current 9-chapter structure (Executive Brief → Program Overview → Structural Topology → PI Findings → SW-Intel Assessment → Risk Landscape → Operational Ceiling → Detection Boundary → Verdict).

### MODE B: Execution Blindness

**Spine:** "Here is where the organization is blind."

**Activation:** Specimen with sufficient runtime connectivity evidence to prove execution blindness exists.

**Chapters:** 8-chapter Execution Blindness structure (Executive Brief → What the Organization Believes → What Actually Governs Execution → What Cannot Currently Be Seen → Software Intelligence → Why Traditional Analysis Missed It → Executive Consequences → Verdict).

---

## Activation Criteria

MODE B activates when ALL of the following are true:

### 1. Verdict Scope

```
visibility_layer_completeness.verdict_scope === 'SYSTEM_CONNECTIVITY'
```

This means at least 4 of 6 evidence layers are measured. The assessment has moved beyond code-only analysis.

### 2. Runtime Condition Count

```
runtime_conditions.length >= 2
```

Where runtime conditions are any of: EVENT_CONCENTRATION, RUNTIME_DEPENDENCY_CHOKE_POINT, BROKER_DEPENDENCY, TOPIC_FANOUT_PRESSURE, ASYNC_PROPAGATION_ASYMMETRY, EDGE_CLOUD_PROPAGATION_RISK, RUNTIME_OBSERVABILITY_GAP.

At least 2 runtime conditions must be present. A single runtime condition is insufficient to claim organizational blindness — it could be an isolated finding, not a pattern.

### 3. Architectural Findings Present

```
architectural_findings.length >= 1
AND
architectural_findings.some(f => f.id === 'AF-001' || f.significance === 'CRITICAL')
```

At least one architectural finding must exist, and at least one must be either AF-001 (gravity divergence) or CRITICAL significance. Execution Blindness without a high-significance cross-evidence finding is not narratively warranted.

### 4. Divergence Evidence

```
runtime_gravity_loci ∩ static_gravity_loci !== complete_overlap
```

There must be at least one domain that appears in runtime gravity but not in static gravity (or vice versa). If static and operational gravity perfectly coincide, there is no blindness — the organization's existing analysis was correct.

---

## Activation Decision Table

| Criterion | Met? | Result |
|---|---|---|
| SYSTEM_CONNECTIVITY | NO | → MODE A |
| SYSTEM_CONNECTIVITY | YES, but < 2 runtime conditions | → MODE A |
| SYSTEM_CONNECTIVITY + >= 2 runtime conditions | YES, but no AF or no CRITICAL | → MODE A |
| SYSTEM_CONNECTIVITY + >= 2 runtime conditions + AF with CRITICAL | YES, but no divergence | → MODE A |
| All four criteria met | YES | → MODE B |

The switch is conservative. MODE B only activates when the evidence is strong enough to support the narrative "the organization is blind." A weak or partial runtime signal does not justify that claim.

---

## Implementation Location

The activation check belongs in `projectFromConsequences()` in ConsequenceNativeEIR.js, before the chapter list is assembled:

```
const narrativeMode = determineNarrativeMode(boardroom, consequenceResult, vlc, architecturalFindings)
// narrativeMode === 'STRUCTURAL_INTELLIGENCE' or 'EXECUTION_BLINDNESS'
```

The chapter list is then selected based on `narrativeMode`.

---

## What This Contract Does NOT Define

- Chapter content (separate implementation stream)
- Chapter rendering (HTML/PDF — separate)
- SW-Intel's internal structure (unchanged by this contract)
- THORR context assembly (already has OPERATIONAL_GRAVITY routing — independent)
- LENS projection (already has Execution Blindness modal — independent)

---

## Relationship to Other Consumers

| Consumer | Activation | Independent? |
|---|---|---|
| THORR | OPERATIONAL_GRAVITY question type | YES — independent routing |
| LENS | Execution Blindness / Gravity Divergence surfaces | YES — independent overlay |
| EIR | This contract | YES — narrative mode switch |

Each consumer has its own activation mechanism. They share the same cognition objects (AF-001, runtime conditions, VLC) but activate independently. A THORR answer can cite execution blindness even if EIR is in MODE A (because the user asked a specific question). EIR mode is determined by evidence breadth, not user intent.

---

## Anti-Patterns

1. **Do not hardcode MODE B for specific clients.** The mode is evidence-driven. If BlueEdge loses runtime evidence in a future run, it reverts to MODE A.

2. **Do not activate MODE B for PARTIAL_CONNECTIVITY.** Partial runtime evidence (1-3 layers) is insufficient. The blindness narrative requires comprehensive runtime coverage to be credible.

3. **Do not mix chapter structures.** EIR is MODE A or MODE B, not a hybrid. Mixing structural chapters with blindness chapters produces an incoherent narrative.

4. **Do not claim blindness without divergence.** If runtime analysis confirms the same gravity loci as static analysis, the organization was NOT blind — its existing tools were correct. That is a validation finding, not a blindness finding.
