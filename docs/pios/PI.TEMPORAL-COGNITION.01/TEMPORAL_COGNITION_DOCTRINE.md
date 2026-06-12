# Temporal Cognition Doctrine

**Artifact:** PI.TEMPORAL-COGNITION.01
**Status:** CONSTITUTIONAL DISCOVERY — no implementation
**Date:** 2026-06-12
**Supersedes:** the "temporal is purely an evidence dimension" framing in PI.PMO-COGNITION-DISCOVERY.01 / PMO_SYNTHESISCONTEXT_VS_TEMPORAL_COGNITION.md §3

**Constitutional position:** Temporal Cognition is not the next consumer. It is the next **axis**. It is a third cognition layer beneath LENS, Guide, THORR, and any future PMO module. It is validated on software specimens, not PMO data.

---

## 1. The Correction

The position paper concluded temporal was a single thing: an evidence dimension, orthogonal to answer objects, analogous to persona. That was correct but **one layer too low**. It saw the dimension and missed what the dimension produces.

The precise model has three layers:

```
EVIDENCE LAYER     Comparable Observation Series      (temporal evidence dimension)
       ↓
OBJECT LAYER       Observation(t) → Answer Object     (existing — AO-001..AO-020)
       ↓
SYNTHESIS LAYER    AO(t0) Δ AO(t1) … → Temporal Verdict  (NEW first-class artifact)
```

Temporal **begins** as an evidence dimension. But once a comparable series exists, `AnswerObject Δ AnswerObject across observations` synthesizes a **new cognition artifact that did not exist before**: a Temporal Verdict. This is not the answer object observed twice. It is derived cognition about the answer object's evolution.

**Persona varies how an answer renders. Temporal generates a new answer.** That is the difference. Persona is purely a projection dimension. Temporal is an evidence dimension that, at sufficient series depth, becomes a synthesis source.

---

## 2. Temporal Verdict — A New Artifact Class

Answer Objects describe what is true now. Temporal Verdicts describe how truth is evolving. They are a distinct class.

```
AO-011  Gravity Divergence        (structural authority ≠ operational authority)   — Answer Object
TV-001  Gravity Divergence Trend  (widening | stable | converging | oscillating | indeterminate)  — Temporal Verdict
```

TV-001 is derived from AO-011 across a series. It is not AO-011. It is a different question — *how is this evolving* rather than *what is this*.

### Temporal Verdict shape

```
TEMPORAL_VERDICT {
  derived_from: <answer_object_id>          // e.g. AO-011
  subject: <what is being tracked>
  series: [observation_t0, observation_t1, ...]
  verdict: WIDENING | STABLE | CONVERGING | OSCILLATING | INDETERMINATE
  direction: <sign of change>
  rate: <magnitude of change per observation>
  projection: <where it heads, if series depth permits>
  temporal_qualification: TQ-0 | TQ-1 | TQ-2 | TQ-3 | TQ-4
  confidence: <bounded by temporal_qualification>
}
```

Every Answer Object has a potential Temporal Verdict. AO-003 → TV-003 (Execution Blindness Trend). AO-004 → TV-004 (Blast Radius Trend). The verdict class is general — any measurable answer object can evolve.

---

## 3. The Primitive: Comparable Observation Series

The temporal primitive is **not** "run series." It is **Comparable Observation Series**. Comparability is the binding constraint; the container is implementation.

| Series | Comparable? | Valid temporal input? |
|---|---|---|
| BlueEdge, StackStorm, NetBox | No — different specimens | NO |
| BlueEdge run 1, run 2, run 3 | Yes — same specimen | YES |
| BlueEdge checkpoint 3 … checkpoint 9 | Yes — same lineage | YES |

The rule: two observations are comparable iff they are observations of the **same subject** under the **same measurement model**. Cross-specimen comparison is not temporal cognition — it is benchmarking, a different operation.

```
Temporal Cognition Primitive = Comparable Observation Series
                             → Answer Object Evolution
                             → Temporal Verdict
```

---

## 4. Temporal Qualification Ladder (TQ-0 … TQ-4)

AO-006 Temporal Unavailability was the seed. It is now the bottom of a five-rung ladder. Every Temporal Verdict carries a TQ state that bounds what it may claim.

| State | Condition | What is knowable | Maps to |
|---|---|---|---|
| **TQ-0** | No observation | Nothing | — |
| **TQ-1** | Single observation | Current posture only. Trend impossible. | AO-006 (this IS Temporal Unavailability) |
| **TQ-2** | Dual observation | Direction available. Rate weak. Projection weak. | — |
| **TQ-3** | Series observation | Direction available. Rate available. Projection qualified. | — |
| **TQ-4** | Stable series | Projection confidence sufficient — **predictive cognition begins.** | — |

TQ-1 is AO-006 restated. A Temporal Verdict at TQ-1 must return "single observation — N more needed," exactly as AO-006 does today. This makes the existing graceful-degradation primitive the floor of the temporal ladder. Nothing new is needed for the failure case — it is already built.

Predictive cognition (forecasting, "where is it heading with confidence") is gated at TQ-4. Below TQ-4, projection is offered only as qualified or weak. This prevents the system from forecasting on two data points.

---

## 5. The Three-Layer Cognition Model

Program Intelligence has crossed three phases. They are not features — they are cognition layers.

```
Program Intelligence
├── Structural Cognition     What is true       (topology, dependency, posture, exposure, authority)
├── Investigation Cognition  Why it is true     (Answer Objects, Guide, Investigation, THORR synthesis)
└── Temporal Cognition       How truth evolves  (Comparable Observation Series → Answer Object Evolution → Temporal Verdict)
```

Consumer/runtime mapping:

| Layer | Runtime role |
|---|---|
| Structural | What is true |
| Investigation | Why it is true |
| Temporal | How truth is evolving |
| LENS | Projection surface |
| Guide | Navigation runtime |
| THORR | Synthesis runtime |
| **Temporal** | **Evidence-evolution runtime — beneath all of the above** |

Temporal is not a PMO module, not a THORR module, not a LENS feature. It is a runtime beneath them. LENS consumes it. PMO consumes it. THORR synthesizes over it.

---

## 6. Why This Is Provable Without PMO

The strongest signal in the entire investigation: every PMO question that looked difficult transformed into a temporal question.

| Looked like a PMO question | Is actually |
|---|---|
| What is the commitment posture? | Is the commitment posture improving? |
| What is the execution exposure? | Is execution exposure growing? |
| What is the authority divergence? | Is the authority divergence converging? |

The pattern is too consistent to be coincidence. The hard PMO questions are temporal questions wearing PMO clothing. Which means **PMO is unnecessary to validate temporal cognition.** The capability must appear in software specimens first — and the specimens already exist:

- BlueEdge runs (multiple)
- BlueEdge checkpoints
- BlueEdge chronicles
- BlueEdge evolution history

### AO-011 as the first proof specimen

AO-011 already behaves like a measurable field:

```
Structural Authority ≠ Operational Authority    (the gap is a quantity)
```

The temporal question is not *what is AO-011* — it is *how is AO-011 evolving*:

```
AO-011(t0)  →  AO-011(t1)  →  AO-011(t2)
            Δ              Δ
                  TV-001 Gravity Divergence Trend
                  verdict ∈ { widening, stable, converging, oscillating, indeterminate }
```

No PMO. No Jira. No velocity. No delivery metrics. Just the same answer object measured across a comparable series of BlueEdge runs. This is the cleanest possible proof of temporal cognition because it reuses an answer object we already trust, on a specimen we already trust, with a substrate (multiple runs) that already exists.

---

## 7. What Changes in the PMO Conclusion

The PMO ontology gap shrinks further than the position paper said:

- **TRAJECTORY** is not a PMO object. It is the **generic Temporal Verdict** applied to any posture. It belongs to Temporal Cognition, not PMO.
- **COMMITMENT_REACHABILITY** = Exposure Surface answer object + Temporal Verdict (projection) + a declared target. Two of three parts are platform primitives.
- **CAPACITY_SATURATION** remains the one genuinely new static PMO shape (declared-capacity mode), needing a PMO context builder.

So PMO, after Temporal Cognition exists, is: one new static answer object (Capacity Saturation) + declared-target handling + consumption of platform Temporal Verdicts. A thin ontology on a platform foundation — exactly what the position paper predicted, now with the foundation named precisely.

---

## 8. Discovery Registration Candidates

For the Constitutional Discovery Registry:

1. **Temporal Verdict** — new first-class cognition artifact class, derived from Answer Objects across a comparable series. Distinct from Answer Objects.
2. **Comparable Observation Series** — the temporal evidence primitive; comparability (same subject, same measurement model) is the binding constraint.
3. **Temporal Qualification Ladder (TQ-0..TQ-4)** — extends AO-006 into a five-rung confidence ladder; TQ-4 gates predictive cognition.
4. **Three-Layer Cognition Model** — Structural / Investigation / Temporal as cognition layers, with Temporal as a runtime beneath LENS/Guide/THORR.

---

## 9. Recommendation

Build Temporal Cognition as a platform capability next. Sequence:

1. Define the Comparable Observation Series primitive (ordered observations of one subject under one measurement model).
2. Define Answer Object Evolution: `AO(t0) Δ AO(t1) → delta`.
3. Define Temporal Verdict synthesis: series of deltas → { verdict, direction, rate, projection, TQ }.
4. Prove on LENS: compute TV-001 from AO-011 across two existing BlueEdge runs. Confirm it answers "is the gravity divergence converging?"
5. Confirm TQ-1 degradation returns AO-006 cleanly on single-observation input.

Then — and only then — PMO becomes a thin ontology on a proven temporal foundation.

**Program Intelligence is not discovering a new consumer. It is discovering a new dimension of cognition itself: how truth evolves.**
