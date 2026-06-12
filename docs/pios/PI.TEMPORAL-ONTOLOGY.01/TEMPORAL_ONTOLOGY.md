# Temporal Ontology — The Universe of Temporal Carriers

**Artifact:** PI.TEMPORAL-ONTOLOGY.01
**Status:** ENUMERATION — no atom selected
**Date:** 2026-06-12
**Depends on:** PI.TEMPORAL-COGNITION.01 (PCD-010), PI.TEMPORAL-COMPARABILITY.01, PI.TEMPORAL-PROOF-GATE.01

**Mandate:** Enumerate every entity in Program Intelligence that can evolve through time. Do not assume the temporal atom is an Answer Object. Do not assume there is only one. Determine the full universe of temporal carriers before selecting a candidate.

---

## 1. The Rejected Assumption

PCD-010 and the proof-gate work implicitly treated the temporal atom as the **whole Answer Object** (AO-011 → TV-001). This enumeration rejects that as unexamined. The finding ahead: **there is no single temporal atom because there is no single clock.** PI contains multiple entities that evolve, each on a different clock, each with different proof requirements. The universe must be mapped before one carrier is chosen.

---

## 2. Enumeration by Pipeline Layer

Walk the cognition pipeline `EVIDENCE → MEASUREMENT → SIGNAL → CONDITION → CONSEQUENCE → COGNITION → AUTHORITY → PROJECTION` plus the governance, investigation, and meta layers. For each entity: can it evolve, and what kind of change is it?

### L0 — Evidence
| Carrier | Evolves how |
|---|---|
| Specimen source (the code itself) | New commits — the measured system changes |
| `evidence_blocks` | More/different raw evidence ingested |
| `signal_interpretations` (PSIG/ISIG/DPSIG/RSIG) | Signals appear/disappear/change severity as evidence changes |
| `runtime_connectivity` graphs (event/mqtt/ws/DI/system) | Present or absent depending on runtime ingestion |
| `visibility_layer_completeness` (VLC) | Observability grows — 0/6 → 6/6 layers measured |
| `domain_backing_registry` | Domains move SEMANTIC_ONLY → STRUCTURALLY_BACKED |

### L1 — Measurement (PCD-005)
| Carrier | Evolves how |
|---|---|
| Measurements (concentration, cohesion, dependency density, coordination load) | The constitutional substrate quantities shift as the specimen or evidence changes |

### L2 — Signal / Condition
| Carrier | Evolves how |
|---|---|
| Conditions (18 types) | Activate / deactivate |
| Condition severity | NOMINAL → MODERATE → HIGH → CRITICAL |
| Condition `evidence_mode` | A condition's evidence lineage strengthens (STRUCTURAL_ENRICHMENT_DERIVED → RUNTIME_EVIDENCE) |
| Suppressed conditions (PCD-003) | A condition becomes projectable as authority rises |

### L3 — Consequence / Cognition
| Carrier | Evolves how |
|---|---|
| Consequence themes | Appear, change severity, change membership |
| Domain narratives | Domain risk labels change |
| Domain concentration | Which domain is concentration center can shift |
| Execution center / structural center | The centers can move; divergence can widen/converge |
| Cross-domain cognition (CDC) | The whole synthesized field shifts |
| Posture / posture_label | The headline synthesized state changes |

### L4 — Answer Objects (this session)
| Carrier | Evolves how |
|---|---|
| Answer Object **state** | The verdict value (divergence yes/no; finding holds or not) |
| Answer Object **confidence** | How strongly it holds — can move while state is fixed |
| Answer Object **qualification** | Its evidence basis / governance weight (AQ-001) |
| Answer Object **topology** | Which domains/edges it spans — can shift while state holds |

### L5 — Authority (PCD-002)
| Carrier | Evolves how |
|---|---|
| Qualification State (S-axis: S0–S3) | Promotion through governance |
| Evidence Capability (E-axis: E-STRUCTURAL → E-GOVERNED) | Grows as evidence classes are added |
| Projection Authority (P-axis: P0–P4) | Rises as S gates E grants P |
| Projection violations | Appear/resolve as authority changes |

### L6 — Governance / SQO
| Carrier | Evolves how |
|---|---|
| Promotion state (S-level transitions) | S0→S1→S2→S3 over the governance lifecycle |
| Proposition review state | Propositions move through review dispositions |
| Reconciliation state (CEU) | Candidates reconciled over time |
| Replay certification status | PENDING → PASS / FAIL |
| Governance lifecycle | Transition count grows |

### L7 — Investigation (PCD-009)
| Carrier | Evolves how |
|---|---|
| Investigation lifecycle state | OPENED → ACTIVE → CONVERGING → RESOLVED / INCONCLUSIVE |
| Proof steps | UNEXAMINED → EXAMINED |
| Proof completion ratio | Rises as steps are examined |

### L8 — Meta (the cognition system observing itself)
| Carrier | Evolves how |
|---|---|
| Answer Object ontology (the canonical set) | GROWS — AO-011 was promoted; the vocabulary of what PI can see expands |
| Answer Object candidates | PROPOSED → REVIEWED → PROMOTED |
| Recurrence states | OBSERVED_ONCE → RECURRING → CROSS_SPECIMEN → PROMOTION_CANDIDATE |
| Learning events | Accumulate |
| Cognition pipeline itself (compiler, vocabulary) | Improves between versions |

---

## 3. The Carriers Run on Different Clocks

The enumeration collapses into **seven temporal regimes**, each a distinct clock. This is the central finding: the atom fragments by clock.

| Clock | What advances it | Carriers on this clock |
|---|---|---|
| **System time** | New specimen commits | Specimen source, measurements, signals, condition state, AO state, centers, posture |
| **Evidence time** | Observability accumulates (same specimen) | VLC, runtime graphs, domain backing, evidence capability (E-axis), condition evidence_mode |
| **Governance time** | Qualification matures (same specimen) | S-level, P-level, promotion state, replay certification, suppressed-condition release, AO qualification |
| **Cognition time** | Interpretation improves (pipeline version) | Compiler outputs, condition vocabulary, consequence themes derivation, AO confidence |
| **Ontology time** | The cognition vocabulary grows | Answer Object ontology, candidate promotion, recurrence states |
| **Operator time** | An investigation progresses (a session) | Investigation lifecycle, proof steps, proof ratio |
| **Memory time** | Learning accumulates across runs | Learning events, candidate registry, cross-specimen recurrence |

These are not the same clock. System time advances only on a commit. Governance time can advance with the specimen frozen. Operator time advances within a single session and resets. Ontology time advances across the entire program's history. **A "trajectory" means something different on each clock.**

---

## 4. The Carriers Have Different Proof Requirements

The proof-gate matrix (PI.TEMPORAL-PROOF-GATE.01) was written assuming the tracked quantity is **state**. For state, only `changed specimen + stable measurement` is valid. But the matrix's interpretation **depends on which carrier is tracked**:

| Carrier tracked | "Stable specimen + changed measurement" means | Provable without a 2nd commit? |
|---|---|---|
| **State** (AO state, condition state, posture) | MEASUREMENT DRIFT — corrupt. The BlueEdge failure. | No |
| **Evidence capability** (VLC, E-axis) | The legitimate trajectory of observability itself | **Yes** |
| **Qualification** (S-level, P-level, AO qualification) | The legitimate trajectory of trust/governance | **Yes** |
| **Investigation progress** (proof steps) | Operator-time trajectory, specimen irrelevant | **Yes** |
| **Ontology growth** (promotions) | Program-history trajectory, single specimen irrelevant | **Yes** |

**This is the refinement the enumeration forces:** the proof-gate matrix is correct *for state trajectories only*. For evidence, qualification, operator, and ontology carriers, "stable specimen + changing measurement/governance/session/vocabulary" is not drift — it IS the signal. The BlueEdge pair failed because we tried to read a STATE trajectory across a measurement change. If we had been reading a QUALIFICATION or EVIDENCE-CAPABILITY trajectory, the same two runs (genesis full-runtime → productized code-only) would describe a legitimate trajectory of observability *contraction*.

So the question "do we need a second specimen commit" has no single answer. It depends entirely on which carrier the temporal atom turns out to be.

---

## 5. Three Classes of Temporal Carrier

The universe sorts into three classes by what their trajectory describes:

**Class T1 — System Trajectories (how the system evolves).**
State, measurements, conditions, centers, posture, AO state. Describe real change in the measured system. **Require System time — a changed specimen under a stable measurement model.** This is the class the proof gate governs. No qualified substrate yet exists.

**Class T2 — Trust Trajectories (how our knowledge of the system evolves).**
Evidence capability, qualification, S/E/P axes, AO qualification, AO confidence, suppressed-condition release. Describe the maturation of observability and governance over a (possibly stable) specimen. **Provable under a stable specimen** — they are precisely the trajectory of the measurement model and governance, which the proof gate treats as "drift" only when mistaken for a system trajectory. On their own clock, they are authoritative.

**Class T3 — Process Trajectories (how the cognition activity evolves).**
Investigation lifecycle, proof steps, ontology growth, candidate promotion, learning accumulation. Describe the progress of investigation and the growth of the cognition vocabulary. **Specimen-independent** — they run on operator time and program-history time. Already observable today (the investigation lifecycle we built literally tracks a T3 trajectory: proof completion over a session).

---

## 6. What This Does Not Yet Decide

This is enumeration, not selection. It does not choose the temporal atom. It establishes:

1. There are **at least seven clocks** and **three trajectory classes**, not one atom.
2. The proof-gate matrix governs **only Class T1**. T2 and T3 have different (looser) proof requirements.
3. **Class T3 is already live** — the investigation Guide tracks proof-completion trajectory now, with no substrate problem. PI already does one form of temporal cognition.
4. **Class T2 is provable without a second commit** — qualification and evidence-capability trajectories evolve under a stable specimen.
5. **Class T1 remains blocked** — it needs the purpose-built comparable series the proof gate specified.

The selection question for the next step becomes: *which class do we prove first?* The enumeration suggests T1 (the one we assumed) is the **hardest and most blocked**, while T2 and T3 are tractable now. We assumed the atom was the most expensive one.

---

## 7. Open Selection Question (next step, not this artifact)

Given three classes:
- T1 System Trajectories — blocked on substrate
- T2 Trust Trajectories — provable under stable specimen
- T3 Process Trajectories — already live

Which carrier is the canonical temporal atom — or is there one atom per class? Does PI need three temporal runtimes (system / trust / process), or one runtime parameterized by clock? That is the selection investigation. This artifact only proves the universe is plural.
