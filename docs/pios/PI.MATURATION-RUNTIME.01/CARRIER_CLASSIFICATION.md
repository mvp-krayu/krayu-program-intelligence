# Carrier Classification — Ordinal / Snapshot-State / Native-Temporal

**Artifact:** PI.MATURATION-RUNTIME.01 / CARRIER_CLASSIFICATION
**Status:** DISCOVERY — three-class classification; resolves the confidence open question; corrects an over-collapse
**Date:** 2026-06-12
**Answers:** which PI carriers are ordinal, which are snapshot-state, which are native-temporal?

---

## 0. Correction to the Binary

An earlier draft of this classification used two classes (ordinal vs "stateful") and concluded that the only irreducibly-temporal carriers are reality carriers read by diffing comparable observations. **That over-collapsed Temporal Cognition.** It abstracted away a third class: evidence that arrives with time semantics already embedded.

A commit history, a deployment log, an incident stream, a telemetry feed — these are temporal *before* any Answer Object is compared. Churn rate, PR aging, deployment cadence, rollback rate, incident recurrence are reality-motion signals, not maturation positions and not snapshot diffs. They are a class of their own, and they matter enormously: they create authoritative Temporal Cognition **without requiring a second static specimen run.**

The classification therefore has three classes, not two.

---

## 1. The Three Classes (and their tests)

### Class A — Ordinal (maturation)
**Test:** ordered space + monotone gated traversal. Reaching position N implies N−1 was passed. Position encodes its own history; readable at a single observation. Maturity = position.
**Time relationship:** *not temporal* — ordinal. Occurs in time but maturity ≠ f(time). The maturation runtime (SQO / S–E–P).

### Class B — Snapshot-State (constructed-temporal)
**Test:** value may take any point in its domain at any observation, independent of history. No intrinsic order. **No embedded time axis.** Direction is invisible from one observation — change must be *inferred by diffing comparable observations.*
**Time relationship:** *temporal only by construction* — you must assemble a comparable observation series and diff. This is the class the proof gate governs (needs settled trust + comparable series).

### Class C — Native-Temporal (intrinsically-temporal)
**Test:** the evidence arrives with **time semantics already embedded** — events with timestamps, rates, durations, frequencies, cadences. The time axis is *in the data*, not constructed by comparing observations.
**Time relationship:** *temporal at the source* — no second specimen run required. The stream **is** the series.

The crucial difference between B and C: a snapshot-state carrier requires PI to *construct* a temporal series (two analysis runs, diffed). A native-temporal carrier *is* a temporal series on arrival. B needs the proof-gate machinery; C clears it by construction.

---

## 2. Classification of PI Carriers

### Class A — Ordinal (maturation; position readable now)

| Carrier | Ordered space |
|---|---|
| Qualification (S0→S1→S2→S3) | SQO state graph |
| Projection Authority (P0→P4) | derived ladder |
| Evidence lineage mode (STRUCTURAL_ENRICHMENT→RUNTIME→SIGNAL_DRIVEN) | Doctrine B order |
| Visibility completeness (VLC 0/6→6/6) | layer count |
| Domain backing (SEMANTIC_ONLY→STRUCTURALLY_BACKED) | backing ladder |
| Governance transition count | monotone counter |
| Proof completion (0/N→N/N) | completion ratio |
| Ontology size (promoted AO count) | accumulation |
| Recurrence (OBSERVED_ONCE→…→PROMOTION_CANDIDATE) | recurrence ladder |
| AO qualification facet | S/E/P projected onto the AO |

### Class B — Snapshot-State (reality read at a point; change needs a constructed diff)

| Carrier | Why snapshot-state |
|---|---|
| Measurements (concentration, cohesion, dependency density, coordination load) | continuous reality quantities; no embedded time |
| Signals (PSIG/ISIG/DPSIG/RSIG) | present-state readings |
| Condition presence | reflects current reality |
| Condition severity (NOMINAL→CRITICAL) | stateful value on an ordered scale |
| Consequence themes / domain narratives | synthesized current reality |
| Domain concentration / centers | current structure |
| Cross-domain cognition / posture | current synthesized state |
| AO state (divergence yes/no) | current verdict value |
| AO topology (domains spanned) | current structure |
| **Runtime connectivity graphs (event/mqtt/ws/DI)** | **structural snapshot of runtime wiring — NOT an event stream** |

Note the last row: the current runtime graphs are *structural extractions* ("53 events → 4 handlers" as wiring), not timestamped event streams. They are snapshot-state. The moment PI ingests actual runtime *telemetry* (events firing over time), that becomes Class C.

### Class C — Native-Temporal (reality-motion; time embedded; not yet in the substrate)

**Currently EMPTY in PI's static specimens.** Populated the moment PI ingests evidence that carries its own time axis:

| Future carrier | Native temporal quantity |
|---|---|
| Commit history | commit frequency, churn rate |
| Pull requests | PR aging, review latency, merge cadence |
| Deployments | deployment cadence, rollback rate |
| Incidents | incident recurrence, MTTR, interval |
| Runtime telemetry | event frequency, throughput over time |
| Alerts | alert bursts, alert rate |
| Dependencies | dependency churn |
| Ownership | ownership churn |

These are not maturation states (S0/S1/S2) and not AO(t0) vs AO(t1) snapshots. They are derivatives of reality over time, arriving temporal.

---

## 3. Two-Facet Process Carriers (unchanged)

Process carriers split into an ordinal progress facet and a snapshot-state outcome facet:

| Carrier | Ordinal (progress) | Snapshot-state (outcome) |
|---|---|---|
| Investigation lifecycle | proof completion | RESOLVED vs INCONCLUSIVE |
| Proposition review | review completion | ACCEPTED / REJECTED / ARBITRATED |
| Replay certification | resolution progress | PASS / FAIL |
| Candidate promotion | recurrence climb | PROMOTED / not |

Progress matures (A); outcome is a verdict (B).

---

## 4. Confidence Splits (resolved)

"Confidence" is two carriers in different classes:

| Sense | Tracks | Class |
|---|---|---|
| Evidential confidence — does the finding hold? | evidence strength; rises and falls | B (snapshot-state) |
| Institutional confidence — is this governed? | S/E/P maturation position | A (ordinal) |

Different classes, different proof requirements. Any Confidence verdict must declare which sense.

---

## 5. Synthesis — Two Sides, Three Classes

```
KNOWLEDGE EVOLUTION
  └── Class A  Ordinal / maturation        position readable now      (SQO / S-E-P) — exists today

REALITY EVOLUTION
  ├── Class B  Snapshot-state              change by constructed diff  (proof gate applies) — exists today, blocked
  └── Class C  Native-temporal             change embedded in evidence (no second run)      — empty today, future ingestion
```

The ordinal/knowledge side is one runtime PI already owns. The reality side has **two evidence modes**: snapshot-state (construct a series and diff — the blocked T1 path) and native-temporal (the series arrives built-in — the open path).

This corrects the over-collapse: Temporal Cognition does **not** reduce to "maturation-position reads + reality-diff." It has three sources, and the third — native-temporal ingestion — is the one that produces authoritative reality-evolution cognition *without* the comparable-static-run substrate the proof gate demands.

---

## 6. The Strategic Consequence — Native-Temporal Clears the Proof Gate by Construction

The proof gate (PI.TEMPORAL-PROOF-GATE.01) blocked **Class B** System Trajectories: snapshot-state reality needs a comparable series PI does not possess, under settled trust it cannot yet hold constant.

**Class C does not have this problem.** A commit history is, by construction:

- **C1 Subject identity** — same repository ✓
- **C2 Lineage continuity** — commits *are* a lineage; parent-child is intrinsic to VCS ✓
- **C4 Measurement-model stability** — one VCS, one extraction instrument across the whole stream ✓

The comparable observation series and the lineage are *inherent in the evidence*. Native-temporal carriers land in the proof gate's valid cell (changed specimen + stable measurement) automatically, because the specimen changes commit-to-commit while the instrument (git/telemetry collector) holds constant.

**Therefore:** GitHub ingestion, runtime telemetry, and incident streams would give PI authoritative reality-evolution Temporal Cognition **without a second static specimen run.** The blocked T1 path (diff two analysis runs) is not the only route to reality-evolution cognition — and it is the *harder* one. Native-temporal ingestion is the cleaner route, currently unbuilt only because the substrate carries no Class C evidence yet.

---

## 7. The Expanded Map of Temporal Cognition

| Source | Class | Needs comparable static runs? | Status |
|---|---|---|---|
| Maturation-position read | A (ordinal) | No — position is structural | Live (SQO) |
| Snapshot diff | B (snapshot-state) | YES — and settled trust | Blocked (no substrate) |
| Native-temporal ingestion | C (native-temporal) | No — series is intrinsic | Unbuilt (no Class C evidence yet) |

Three distinct routes. Only one (B) is blocked. A is live. C is open the moment evidence with embedded time is ingested.

---

## 8. Discipline & Open

- Three-class distinction rests on the **structure of the evidence**, not one observation: ordered-and-gated (A), point-valued-unordered (B), time-embedded (C). Strong.
- **Open:** when runtime telemetry is ingested, does it create new Class C carriers, or convert existing Class B runtime graphs into Class C? Likely both — the wiring stays B (structure), the event stream is C (motion).
- **Open:** are native-temporal carriers their own Answer Objects (a churn-rate finding), or inputs that feed existing Answer Objects with a temporal dimension? Probably both — some are findings, some are evidence.
- **Open:** does Class C dissolve the need for snapshot diffing entirely, or do B and C answer different questions (B: "did the structural posture change?"; C: "how fast is reality moving?")? Likely different questions — B is structural change, C is motion/rate.
