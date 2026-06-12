# Trust Trajectory Doctrine

**Artifact:** PI.TRUST-TRAJECTORY.01
**Status:** DISCOVERY — no implementation
**Date:** 2026-06-12
**Depends on:** PI.TEMPORAL-ONTOLOGY.01 (Class T2), PI.TEMPORAL-PROOF-GATE.01, PI.TEMPORAL-COMPARABILITY.01

**Mission:** Determine whether qualification, authority, confidence, and evidence capability form a coherent temporal runtime. Can PI answer *"How has our understanding of this specimen evolved?"* without requiring specimen evolution?

**Answer: Yes. It is already present, in a single existing run, and it is demonstrable now.**

---

## 1. The Substrate Already Exists — Inside One Run

The proof gate (PI.TEMPORAL-PROOF-GATE.01) blocked T1 System Trajectories because no comparable specimen series exists. But a **Trust Trajectory needs no second specimen.** It is observable inside `run_blueedge_genesis_e2e_03` alone, because the governance lifecycle recorded a comparable series of trust states over a stable specimen.

### The recorded series (verbatim from `sqo/promotion_state.json`)

| Observation | Qualification | Authority | Constitutional anchor | Timestamp |
|---|---|---|---|---|
| t0 | **S0** | — | BLOCKED (2 CRITICAL fails: proposition_count 2/75, class_diversity 1/6) | initial |
| t1 | **S1** | L3 | ELEVATED (not blocked); 85 propositions, 81 accepted | 11:16:31 |
| t2 | **S2** | L5 | 8/8 PASS (CONSTITUTIONAL_DISTANCE_ACCEPTABLE); 32 enrichment events | 11:35:41 |

This is a three-point comparable observation series. The **specimen source never changed** — same genesis run, same code. What changed is **trust**: qualification advanced S0→S1→S2, authority L3→L5, the constitutional anchor moved BLOCKED → ELEVATED → fully PASS.

PI can already answer "how has our understanding of this specimen evolved?" — *understanding matured from structural-substrate-only with a blocked anchor, through a governed lifecycle, to a constitutionally-anchored S2, in 19 minutes of governance exercise, with zero change to the system being measured.*

---

## 2. Comparability — Why This Is Authoritative, Not Drift

Apply the C-conditions (PI.TEMPORAL-COMPARABILITY.01):

- **C1 Subject identity:** trivially holds — same run, same specimen. ✓
- **C2 Lineage continuity:** explicit. `promotion_lineage.transitions` records S0→S1→S2 as parent-child. Not a fork. ✓
- **C4 Measurement-model stability:** here is the critical reframing. For a **System** trajectory, a changing measurement model is drift (the BlueEdge pair failure). For a **Trust** trajectory, the measurement/governance model **is the tracked quantity.** Its change is not drift — it is the signal. Tracking qualification means tracking exactly the thing the proof gate calls "the measurement model." ✓ *by definition of what is tracked.*

This confirms PI.TEMPORAL-ONTOLOGY.01 §4: the proof-gate matrix governs only T1. For T2, "stable specimen + changing governance" is the legitimate, authoritative trajectory.

---

## 3. Do the Four Carriers Form a Coherent Runtime?

The four T2 carriers — qualification (S), authority (L), confidence (anchor/propositions), evidence capability (E) — were tested against the recorded series.

| Carrier | Moved in the series? | Evidence |
|---|---|---|
| Qualification (S-level) | YES — S0→S1→S2 | explicit transitions |
| Authority (L-level) | YES — L3→L5 | transition `authority_level` |
| Confidence (anchor, proposition acceptance, revalidation) | YES — anchor BLOCKED→ELEVATED→8/8 PASS; 81/85 accepted; revalidation 25/25 | transition rationales |
| Evidence capability (E-axis) | INDETERMINATE from this artifact | promotion_state records governance, not the E-axis directly; requires cross-checking VLC/evidence over the lifecycle |

The first three advanced **coupled but not identically** — qualification moved one step (S1→S2) while authority jumped two (L3→L5), and confidence advanced on its own scale (BLOCKED→PASS). They rise together but on distinct scales.

**Finding:** they form **one coherent Trust clock with multiple facets**, not four independent sub-clocks. Qualification advancement carries authority and confidence with it; they are facets of a single maturation, not separate trajectories. Evidence capability (E) is the one facet not confirmable from the governance record alone and must be checked against the evidence layer — it may run slightly ahead of governance (evidence is acquired, then governance ratifies it).

A **Trust Verdict** vocabulary follows naturally, analogous to the System verdict (widening/converging):

```
TRUST_VERDICT ∈ { MATURING, STABLE, SETTLED, DEGRADING, REGRESSED }
```

The genesis series reads **MATURING** (monotonic S0→S1→S2 advance), now **SETTLED** at S2.

---

## 4. The Deeper Finding — Siblings or Maturity Layers?

PI.TEMPORAL-ONTOLOGY.01 left open whether System / Trust / Process are siblings or a hierarchy. The Trust Trajectory evidence resolves it: **they are maturity layers, and the ordering is Process → Trust → System.**

```
Process (T3)   the activity of knowing       always available; needs only activity
   │ produces
   ▼
Trust (T2)     the maturation of knowing      provable once a process has run
   │ must settle before
   ▼
System (T1)    change in the known            readable only under settled trust
```

The dependency mechanism, made precise:

- **T3 Process** requires nothing but cognition activity. The investigation Guide already tracks it (OPENED→RESOLVED). Always available.
- **T2 Trust** is the *residue* of process. A governance lifecycle (a process) **produces** the qualification trajectory. You cannot mature trust without a process having executed. T2 sits on T3.
- **T1 System** requires settled trust. You cannot authoritatively detect change in the *known* until trust is *stable* — otherwise you cannot separate system change from trust change. **This is exactly why the BlueEdge pair failed:** the two runs differed in trust/measurement (full-runtime vs code-only), so trust was not held constant, so system change was unreadable.

**The proof gate's requirement "stable measurement model" is, constitutionally, "settled trust."** T1 is blocked not merely because we lack a second specimen — it is blocked because we cannot yet hold trust constant across the runs we have. T1 becomes readable only when T2 has reached a steady state on a given measurement model.

This is the constitutional reframing: **System Cognition sits on top of settled Trust Cognition, which sits on top of Process Cognition.** Three maturity layers of how-things-evolve, not three siblings.

---

## 5. The Three-Layer Cognition Model, Completed

PCD-010's three cognition axes (Structural / Investigation / Temporal) now gain a temporal interior. Temporal itself has three maturity layers:

| Cognition axis | Question | Temporal layer | Availability |
|---|---|---|---|
| Structural | What is true? | — | present |
| Investigation | Why is it true? | — | present |
| Temporal · Process | How is cognition advancing? | T3 | **live today** (Guide) |
| Temporal · Trust | How certain are we becoming? | T2 | **provable today** (genesis S0→S1→S2) |
| Temporal · System | How is reality changing? | T1 | blocked (needs settled-trust comparable series) |

The remarkable result the mission anticipated:

```
Structural Cognition     What is true?
Investigation Cognition  Why is it true?
Trust Cognition          How certain are we becoming?   ← demonstrable now, no second commit
```

---

## 6. What Is Now Demonstrable Without Building

From `run_blueedge_genesis_e2e_03` alone, with no PMO, no Jira, no second commit, no new specimen, PI can produce a **Trust Verdict**:

> "Understanding of BlueEdge matured from S0 (structural substrate only, constitutional anchor blocked on 2 critical fails) through S1 (governed lifecycle exercised, anchor elevated, 85 propositions adjudicated) to S2 (constitutional anchor fully passed, 32 enrichment events). Trust trajectory: MATURING → SETTLED. Authority rose L3 → L5. The system being measured did not change; our certainty about it did."

That is authoritative temporal cognition, today, on existing artifacts.

---

## 7. Open Questions (next, not this artifact)

1. Does evidence capability (E-axis) lead or lag governance (S-level) — is evidence acquired then ratified, or ratified then acquired? Requires cross-checking VLC/evidence over the lifecycle.
2. Is the Trust clock monotonic by construction (can trust REGRESS — S2→S1 — and does the system record it)? Degradation/regression verdicts need a regression example.
3. Is there a single Trust Verdict, or one per facet (qualification verdict, confidence verdict) that compose?
4. Selection: is Process→Trust→System one runtime parameterized by layer, or three runtimes with a dependency contract?

This artifact establishes: **Trust Trajectory is the first temporal capability PI can demonstrate authoritatively today, and the three temporal classes are maturity layers (Process→Trust→System), not siblings.** No build. No new specimen.
