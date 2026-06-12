# Temporal Comparability Doctrine

**Artifact:** PI.TEMPORAL-COMPARABILITY.01
**Status:** CONSTITUTIONAL DISCOVERY — no implementation
**Date:** 2026-06-12
**Depends on:** PI.TEMPORAL-COGNITION.01 (PCD-010), PCD-008 (AQ-001 Artifact Qualification)

**Mandate:** Without comparability there is no temporal cognition. Without temporal cognition there is no trajectory. Without trajectory there is no prediction. This doctrine determines what makes two observations *constitutionally* comparable.

---

## 1. Definitions

**Observation O(t):** the complete set of Answer Objects derivable from a specimen state at time `t`. Not a metric. A full cognition state — every posture, finding, exposure, and divergence the system can synthesize at that moment.

**Comparison:** `O(t0) Δ O(t1)` — the diff between two observations of (purportedly) the same subject, producing the deltas that feed Temporal Verdicts.

**Comparability:** the constitutional precondition under which `O(t0) Δ O(t1)` is *not a lie*.

---

## 2. The Governing Question

A temporal delta is only cognition if it is true. So the doctrine is built around one discriminating question:

> **When is a temporal delta a lie?**

If TV-001 reports "the gravity divergence is widening," when is that verdict false even though the numbers changed? Each distinct way the verdict can lie defines exactly one comparability condition. Enumerate the lies; the conditions follow.

---

## 3. The Seven Lies (and the Condition Each Forbids)

### Lie 1 — Subject Substitution
**The delta:** "Divergence widened."
**The lie:** O(t0) was BlueEdge, O(t1) was StackStorm. The comparison measured the difference between two systems, not the evolution of one.
**Condition — SUBJECT IDENTITY:** both observations must be of the same subject (same specimen / program / entity).
**Constitutional status:** HARD FLOOR. Violation is a category error, not a degradation. Fail closed. Cross-subject comparison is **benchmarking**, a different operation that must never be labeled temporal.

### Lie 2 — Instrument Drift
**The delta:** "Execution center emerged; divergence widened."
**The lie:** At t0 the specimen was measured with static evidence only (P1). At t1 runtime evidence was present (P2). The execution center didn't *emerge* — it was always there, newly *visible*. The change is in the instrument, not the system.
**Condition — MEASUREMENT-MODEL STABILITY:** both observations must share the same evidence capability (P-level, VLC layers present), OR the delta must explicitly attribute the portion caused by capability change versus real change.
**Constitutional status:** CAPS the verdict. This is the temporal face of AQ-001 — observability change masquerading as system change is the single most dangerous temporal lie.

### Lie 3 — Ontology Drift
**The delta:** "Domain concentration increased."
**The lie:** At t0 the specimen had 15 domains; at t1 a domain was split into two during refactor, yielding 17. Concentration "increased" because the boundaries were re-cut, not because mass moved.
**Condition — ONTOLOGY STABILITY:** both observations must share the same domain/condition vocabulary, OR carry an explicit reconciliation mapping (which t1 domain corresponds to which t0 domain).
**Constitutional status:** CAPS magnitude claims. Direction may survive with reconciliation; raw magnitude does not without it.

### Lie 4 — Normalization Drift
**The delta:** "5 conditions — unchanged."
**The lie:** At t0, 5 of 18 condition types were active. At t1, 5 of 25 (vocabulary expanded). Same numerator, different denominator. "Unchanged" is false — relative load fell.
**Condition — NORMALIZATION-BASIS IDENTITY:** any magnitude or ratio claim requires the same denominator/basis at both observations, or explicit re-basing.
**Constitutional status:** CAPS ratio and magnitude claims. Existence claims unaffected.

### Lie 5 — Lineage Break
**The delta:** "The system evolved toward convergence."
**The lie:** O(t1) was measured from a divergent branch that is not a descendant of O(t0). The two observations are not on the same evolutionary line — they are siblings, not parent-child. "Evolved" implies continuity that does not exist.
**Condition — LINEAGE CONTINUITY:** O(t1) must be a descendant of O(t0) on the same lineage (baseline → successor), not a fork.
**Constitutional status:** CAPS the "evolution" framing. Without lineage, the comparison is a difference between two states, not a trajectory.

### Lie 6 — Qualification Mismatch
**The delta:** "Posture improved from S1 to S2."
**The lie:** The t0 measurement was advisory (S1, ungoverned, possibly wrong). The t1 measurement was governed (S2, replay-certified). Comparing a number you didn't trust to one you do. Part of the "improvement" is the qualification upgrade, not real change.
**Condition — QUALIFICATION COMPARABILITY:** both observations should carry comparable qualification, OR the verdict must disclose that the prior observation was below governance threshold and the delta partly reflects qualification maturation.
**Constitutional status:** CAPS confidence. A delta spanning a qualification boundary cannot claim the change is purely systemic.

### Lie 7 — Cadence Mismatch
**The delta:** "Divergence widening at 0.3 per period."
**The lie:** t0→t1 spanned one sprint; t1→t2 spanned six months. The rate is computed across incomparable intervals; the "per period" is meaningless.
**Condition — CADENCE CONSISTENCY:** rate and projection require comparable intervals between observations. Direction does not.
**Constitutional status:** CAPS rate and projection. Direction (widening vs converging) survives cadence mismatch; rate does not.

---

## 4. Comparability Is Graded, Not Binary

Each lie corrupts a *different* part of the verdict. Therefore comparability is not a single gate — it is a ladder, and each rung unlocks a class of verdict claim. This is the exact AQ-001 pattern: validity is claim-dependent.

| Comparability Level | Condition satisfied | Verdict claim unlocked |
|---|---|---|
| **C0 — None** | Subject identity fails | Nothing. Fail closed. Not temporal. |
| **C1 — Identity** | Same subject | "Does the finding still exist?" (existence) |
| **C2 — Lineage** | + descendant continuity | "Is this evolution?" (trajectory framing legitimate) |
| **C3 — Ontology** | + stable/reconciled vocabulary | "Did the structure change?" (direction) |
| **C4 — Measurement** | + stable/attributed measurement model | "Is the change real, not observational?" (real direction) |
| **C5 — Normalization + Cadence** | + same basis, comparable intervals | "How much, how fast?" (magnitude, rate, projection) |

A Temporal Verdict may only claim what its comparability level permits. A C3 series can say "widening." Only a C5 series can say "widening at rate R, projected to reach X." Below C4, "widening" must be disclosed as possibly observational.

---

## 5. Two-Axis Gating of Temporal Verdicts

Temporal Verdicts are gated on **two independent axes**:

```
              TQ axis (depth — how many observations)
              TQ-0 → TQ-1 → TQ-2 → TQ-3 → TQ-4

  C axis      C0
  (validity)  C1
              C2
  comparability  C3
              C4
              C5
```

- **TQ (depth)** answers: do we have enough observations to see a trend?
- **C (validity)** answers: are the observations we have actually comparable?

A verdict's authority is `min(TQ-capability, C-capability)`. Two observations (TQ-2) that span an instrument change (C-capped at C3) yield at most a direction claim, never a rate — even though TQ-2 alone might suggest a weak rate is available. **Comparability can veto what depth would otherwise permit.**

This is the constitutional safeguard against the most seductive temporal error: having two data points and computing a trend line through an instrument change.

---

## 6. Relationship to AQ-001

AQ-001 (PCD-008): artifact validity is *question-dependent* — the same artifact is qualified for one question, unqualified for another.

Temporal Comparability is the temporal analog: comparison validity is *verdict-dependent* — the same pair of observations is comparable for one verdict claim (direction) and incomparable for another (rate).

| | AQ-001 | Temporal Comparability |
|---|---|---|
| Qualifies | a single artifact against a question | a pair of observations against a verdict claim |
| Axis | evidence layers × question class | comparability conditions × verdict claim class |
| Failure | unqualified artifact | uncomparable observations |
| Discipline | warn/gate before consuming | cap/disclose before asserting trend |

They are the same governance instinct applied to two different operations: AQ-001 to *reading* an artifact, Comparability to *differencing* two observations.

---

## 7. The Constitutional Contract

Two observations are **constitutionally comparable** when:

1. **Subject identity holds** (hard floor — else fail closed, it is benchmarking).
2. Every further condition (lineage, ontology, measurement model, normalization, cadence) is either **satisfied** or **explicitly reconciled/attributed**.
3. The resulting Temporal Verdict claims **only** what the satisfied comparability level (C1–C5) permits.
4. Any comparability cap is **disclosed** in the verdict, never silently absorbed.

Comparability is not a boolean the runtime checks once. It is a qualification the runtime computes per verdict claim, and it travels with the verdict exactly as TQ does.

---

## 8. Immediate Consequence for the AO-011 Proof

PCD-010 proposed proving temporal cognition by computing TV-001 from AO-011 across two existing BlueEdge runs: `run_blueedge_genesis_e2e_03` and `run_blueedge_productized_01_fixed`.

This doctrine forbids assuming those runs are comparable. Before any TV-001 is computed, the pair must be tested:

- **C1 Subject:** both BlueEdge — likely passes.
- **C2 Lineage:** is `productized_01_fixed` a descendant of `genesis_e2e_03`, or a parallel productization? **Must verify.** If parallel, the comparison is sibling-difference, not trajectory.
- **C4 Measurement model:** a *genesis E2E* run and a *productized* run may carry different evidence envelopes. If their P-levels or VLC layers differ, any divergence delta is partly instrument drift. **Must verify.**

If the two runs fail C2 or C4, that is not a failure of the proof — it is the doctrine working. It would mean the first true temporal proof requires a **purpose-built comparable series** (the same specimen re-run under the same measurement model at two points), not two convenient existing runs. Discovering that *before* building TV-001 is the entire point of establishing comparability first.

---

## 9. Discovery Registration Candidate

For the Constitutional Discovery Registry (extends PCD-010):

- **Temporal Comparability Contract** — subject identity (hard floor) + six reconcilable conditions.
- **The Seven Lies** — enumerated failure modes of temporal delta, each forbidding one condition.
- **Comparability Ladder (C0–C5)** — graded; each level unlocks a verdict claim class.
- **Two-Axis Gating** — verdict authority = min(TQ depth, C validity). Comparability can veto depth.
- **AQ-001 analogy** — comparability is verdict-dependent validity, the temporal twin of artifact qualification.

---

## 10. Conclusion

Comparability is the floor beneath the entire temporal stack. It is not "same subject, same measurement model" as a one-line rule — it is a graded contract with a hard floor (subject identity) and five reconcilable conditions, each guarding against a specific way a temporal delta can lie.

The deepest finding: **comparability gates verdict claims independently of observation depth.** You can have enough observations and still be forbidden from claiming a trend, because the observations crossed an instrument change, an ontology re-cut, or a lineage fork. Depth tells you whether you *could* see a trend. Comparability tells you whether the trend you see is *real*.

Without this floor, every Temporal Verdict is a potential lie wearing the authority of a measurement.
