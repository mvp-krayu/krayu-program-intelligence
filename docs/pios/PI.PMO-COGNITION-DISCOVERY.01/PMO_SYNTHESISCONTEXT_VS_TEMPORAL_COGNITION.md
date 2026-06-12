# Position Paper: PMO SynthesisContext vs Temporal Cognition

**Artifact:** PI.PMO-COGNITION-DISCOVERY.01
**Status:** POSITION PAPER — no implementation
**Date:** 2026-06-12
**Question:** Before building PMO SynthesisContext, determine whether we are about to build on top of a missing foundation.

**Position:** This is a **Temporal Cognition problem**, not a PMO Context problem. Temporal is a platform-level **evidence dimension** — orthogonal to answer objects, analogous to how persona is a projection dimension. It must be established as a platform capability before PMO implementation, or temporal logic will fragment across every future module and LENS's own latent temporal questions will remain permanently unanswerable.

---

## 1. Evidence Decomposition

For each candidate object, decompose into evidence atoms and classify each as STATIC (resolvable from one specimen state) or TEMPORAL (requires two or more observations across time).

### COMMITMENT_REACHABILITY — "Will we hit the milestone?"

| Evidence atom | Class | Available in PI today? |
|---|---|---|
| Target (date / scope / objective) | STATIC | No — PI has no concept of a declared commitment |
| Current completion state | STATIC | Partial — PI measures present structure, not progress-against-plan |
| Remaining work | STATIC | No — PI has no backlog/work concept |
| **Velocity (work ÷ time)** | **TEMPORAL** | **No — requires ≥2 observations** |
| **Trend (is velocity itself changing)** | **TEMPORAL (2nd order)** | **No** |
| Time remaining (target − now) | STATIC | Derivable if target exists |

**The core computation is `remaining_work ÷ velocity vs time_remaining`. Velocity is the engine, and velocity cannot be measured at a single point.** It is the rate of change of completion across time. Reachability is a projection, and a projection requires a rate.

- **Can it exist without temporal?** Only as a degenerate form: "N units remaining, target date D." That is an inventory plus a deadline — not reachability. The actual question, *will we*, is unanswerable.
- **Graceful degradation?** PARTIAL. The static facts (a gap exists, here is its magnitude) survive as an EXPOSURE_SURFACE. The projection collapses to AO-006 Temporal Unavailability. So the object splits: static exposure answerable, reachability projection not.

### CAPACITY_SATURATION — "Are we overloaded?"

| Evidence atom | Class | Available in PI today? |
|---|---|---|
| Committed load | STATIC | No — but a snapshot quantity, structurally simple |
| Declared capacity (team size × nominal) | STATIC | No — a declared baseline |
| **Empirical capacity (historical throughput)** | **TEMPORAL** | **No** |
| Saturation = load ÷ capacity | STATIC ratio | Computable once load + capacity exist |

**Capacity Saturation is dual-mode.** With *declared* capacity it is a ratio of two static snapshots — fully answerable from one state. With *empirical* capacity (what the unit actually delivers per period) it requires throughput history, which is temporal.

- **Can it exist without temporal?** YES — with declared capacity. "Load 120, capacity 100, 1.2× saturated."
- **Graceful degradation?** YES, and importantly *not* into Temporal Unavailability. It degrades into a **lower-confidence static answer**: saturation computed against declared rather than empirical capacity. The answer still exists; only its confidence drops. This is the one object that is genuinely a context problem, not a temporal one.

### TRAJECTORY — "Are we getting better or worse?"

| Evidence atom | Class | Available in PI today? |
|---|---|---|
| **Prior state** | **TEMPORAL** | **No — requires a past observation** |
| Current state | STATIC | Yes |
| **Rate of change** | **TEMPORAL** | **No** |
| **Direction** | **TEMPORAL** | **No** |
| **Inflection (2nd order)** | **TEMPORAL** | **No** |

**Trajectory is purely temporal.** "Better or worse" is meaningless without a referent prior state. There is no static version of the question.

- **Can it exist without temporal?** NO. Not even degenerately. "Current state X" answers a different question (posture), not trajectory.
- **Graceful degradation?** FULL collapse to AO-006 Temporal Unavailability. The honest answer is "cannot know — single observation."

---

## 2. The Three Objects Are Not the Same Class

| Object | Without temporal | Degradation |
|---|---|---|
| CAPACITY_SATURATION | Exists (declared capacity) | Lower-confidence static answer — a **context problem** |
| COMMITMENT_REACHABILITY | Splits — static exposure survives, projection dies | **Hybrid** — partial AO-006 |
| TRAJECTORY | Does not exist at all | **Full AO-006** — a **temporal problem** |

This gradient is the finding. One object is a context problem. One is a temporal problem. One is hybrid. **You cannot resolve all three with "another context builder," and you cannot resolve all three with "add temporal evidence." The three objects expose that temporal is a separate axis from context.**

---

## 3. Temporal Is a Dimension, Not an Object

The decisive observation: Trajectory is not a new *shape*. It is any posture, finding, or measurement **projected across a time axis**. Commitment Reachability is an Exposure Surface computed **across time**. Neither introduces a new structural shape — they introduce a new **observation axis**.

This mirrors a primitive we already built:

| Dimension | What it varies | Answer object |
|---|---|---|
| **Persona** (proven) | How the answer renders (BOARDROOM vs OPERATOR) | unchanged |
| **Temporal** (missing) | Whether the answer has a time axis (snapshot vs trend) | unchanged |

Persona is a projection dimension — same answer object, different altitude. Temporal is an evidence dimension — same answer object, observed across runs. **Both are orthogonal to the answer object itself.** We already proved the runtime supports an orthogonal dimension (persona). Temporal is the second orthogonal dimension, and it is missing.

This means temporal is not "PMO evidence." It is a platform axis. Building it inside a PMO context builder would be the same category error as building persona projection inside a single consumer.

---

## 4. LENS Already Has Latent Temporal Blindness

Temporal is not a future PMO requirement that LENS happens not to need. **LENS already cannot answer its own temporal questions:**

- "Is Execution Blindness getting worse?" — temporal, unanswerable today
- "Is the gravity divergence converging or widening?" — temporal, unanswerable today
- "Is structural debt accumulating?" — temporal, unanswerable today

We hit this directly in the falsification synthesizer. AO-011's falsification statement is *"this finding would disappear if code gravity and operational gravity converged."* We answer it by checking whether the centers differ **now**. We cannot say whether they are **trending toward** convergence. The falsification verdict is structurally incomplete — it reports a static check where the honest answer requires a trend.

LENS masks this because it is structure-first and present-tense. PMO cannot mask it because PMO is temporal-native. **PMO does not create the temporal gap. PMO makes an existing platform gap unavoidable.**

---

## 5. Verdict: A or B

**B — Temporal Cognition Problem.**

With one qualification: Capacity Saturation is genuinely a context problem and could be built today against declared capacity. But Commitment Reachability and Trajectory — the two most-asked PMO questions ("will we hit it?", "are we getting better?") — are temporal at their core. Shipping PMO without temporal cognition means shipping a PMO module that cannot answer the two questions PMO exists to answer.

---

## 6. Implications

### Architectural
- Temporal must be a **platform capability**: a Temporal Cognition layer that observes any answer object across an ordered run series and synthesizes direction, rate, and projection.
- It belongs **below** both LENS and PMO, beside the existing single-point synthesis path.
- The substrate partially exists: multiple runs of the same specimen already exist (`run_blueedge_genesis_e2e_03`, `run_blueedge_productized_01_fixed`). Temporal cognition is, at its foundation, **diffing the same answer object across an ordered run series.** We have never compared runs across time — but the data shape to do so is present.

### Evidence
- A new evidence primitive: the **run series** — an ordered sequence of specimen states with comparable answer objects.
- Temporal answer synthesis = `answerObject(t0) Δ answerObject(t1) → { direction, rate, projection }`.
- Graceful degradation is the governing rule: with a single observation, every temporal synthesis returns AO-006 Temporal Unavailability with an explicit "single observation — N more needed" message. This is already proven (AO-006 exists).

### Ontology
- Temporal is **not** ~3 new answer objects. It is a **modifier** applied to existing objects across the time axis:
  - TRAJECTORY = `Posture × temporal`
  - COMMITMENT_REACHABILITY = `Exposure Surface × temporal × target`
  - "Is divergence converging?" = `AO-011 × temporal`
- This collapses the PMO ontology gap. The new PMO objects are not net-new shapes; they are existing shapes plus a temporal axis plus (for reachability) a declared target. The ontology surface to build is therefore **smaller** than the PMO discovery suggested — but it sits on a platform capability that does not yet exist.
- Only CAPACITY_SATURATION is a genuinely new static shape requiring a PMO context builder. The rest are temporal projections of shapes we already have.

### Should Temporal Cognition be a platform capability before PMO?
**Yes.** Building PMO SynthesisContext first would:
1. Hardcode temporal logic inside PMO that LENS also needs — fragmenting a platform axis across consumers (the exact governance breach pattern: capability built locally that should be shared).
2. Leave LENS's own temporal questions permanently unanswerable.
3. Force PMO to ship without answering "will we hit it?" and "are we getting better?" — the two questions PMO exists for.

Establishing Temporal Cognition first means PMO becomes mostly `existing answer objects × temporal axis × declared targets` — a thin ontology on a solid foundation, rather than a thick context builder over a missing one.

---

## 7. Recommendation

Do not build PMO SynthesisContext next.

Build **Temporal Cognition as a platform capability** next:
1. Define the run-series evidence primitive (ordered comparable observations).
2. Define temporal synthesis: answer object Δ across observations → direction/rate/projection.
3. Prove it on LENS first — answer "is the gravity divergence converging?" by comparing AO-011 across two existing BlueEdge runs. This validates temporal cognition on the specimen we already trust, before PMO.
4. Confirm graceful degradation to AO-006 on single-observation inputs.

Then PMO becomes a small ontology (Capacity Saturation as the one new static shape, plus declared-target handling) on a temporal foundation that LENS also consumes.

**We were about to build on a missing foundation. The foundation is Temporal Cognition. It is not PMO-specific — it is the second orthogonal dimension of the cognition runtime, and LENS needs it too.**
