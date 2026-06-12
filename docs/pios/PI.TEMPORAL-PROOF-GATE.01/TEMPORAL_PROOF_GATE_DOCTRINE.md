# Temporal Proof-Gate Doctrine

**Artifact:** PI.TEMPORAL-PROOF-GATE.01
**Status:** CONSTITUTIONAL DISCOVERY + PROOF-GATE RESULT — no implementation
**Date:** 2026-06-12
**Depends on:** PI.TEMPORAL-COGNITION.01 (PCD-010), PI.TEMPORAL-COMPARABILITY.01

**Core rule:** Temporal Cognition requires **changed specimen evidence under stable measurement conditions.**

---

## 1. The Proof-Gate Matrix

Two independent variables govern what a comparison between two observations actually measures:

- **Specimen evidence** — the underlying system state (the source being measured)
- **Measurement model** — the evidence envelope, pipeline, and observability used to measure it (P-level, VLC layers, runtime graphs)

|  | Stable measurement model | Changed measurement model |
|---|---|---|
| **Stable specimen** | Determinism / reproducibility test | **Measurement drift analysis** |
| **Changed specimen** | **TEMPORAL COGNITION** ✓ | Mixed / non-authoritative |

Only one cell yields temporal cognition: **changed specimen + stable measurement model.** Everything else measures something other than evolution:

- **Stable + stable** → reproducibility. Confirms the pipeline is deterministic. Valid, but not temporal.
- **Stable + changed** → measurement drift. The deltas reflect the instrument changing, not the system. The "execution center emerged" lie.
- **Changed + changed** → mixed. Real change and instrument change are entangled and cannot be separated without attribution. Non-authoritative for trend.

**A Temporal Verdict may only be computed from the changed-specimen / stable-measurement cell.**

---

## 2. Proof-Gate Result: BlueEdge Pair

The PCD-010 proof proposal — compute TV-001 (Gravity Divergence Trend) from AO-011 across `run_blueedge_genesis_e2e_03` and `run_blueedge_productized_01_fixed` — was submitted to a comparability audit per PI.TEMPORAL-COMPARABILITY.01. This is recorded as a constitutional proof-gate result.

### Audit Evidence

| Indicator | genesis_e2e_03 | productized_01_fixed |
|---|---|---|
| VLC completeness | 100% (6/6 layers measured) | 0% (0/1 measured) |
| Verdict scope | SYSTEM_CONNECTIVITY | CODE_CONNECTIVITY |
| Runtime graphs present | 6 | 0 |
| Architecture profile | nestjs-iot | unknown |
| RSIG runtime signals | present | absent |
| Qualification corridor | FULL_COGNITIVE_GENESIS | POST_GENESIS_SEMANTIC_REPLAY (`qualification_recomputed: false`) |

### C-Condition Verdicts

- **C2 — Lineage Continuity: ACCEPTABLE.** Productized is `POST_GENESIS` — a descendant of the genesis run, drawn from the same source evidence. The lineage relationship holds.
- **C4 — Measurement-Model Stability: HARD FAIL.** Genesis carries full 6-layer runtime evidence (SYSTEM_CONNECTIVITY, P2+). Productized carries zero runtime layers (CODE_CONNECTIVITY, 0% VLC). AO-011's execution center is derived from RSIG runtime signals — present in genesis, absent in productized. The two observations were taken through fundamentally different instruments.

### Classification

The productized run is a **replay** of the genesis source (`qualification_recomputed: false`) under a reduced measurement model. Therefore:

- Specimen evidence: **stable** (same source, replay)
- Measurement model: **changed** (full runtime → code-only)
- Matrix cell: **stable specimen + changed measurement model = MEASUREMENT DRIFT ANALYSIS**

### Determination

**The BlueEdge pair is UNSUITABLE for TV-001.** Any AO-011 delta computed between these runs would represent the execution center becoming visible/invisible as runtime evidence appears/disappears — measurement drift, not specimen evolution. This is Lie 2 (Instrument Drift) from the Comparability Doctrine.

**No "widening / converging / stable / rate / projection" verdict may be computed from these runs.** The doctrine caught the trap before a false trend was synthesized. This is the proof gate working as designed.

---

## 3. First Valid Proof Substrate

A valid temporal proof requires a **purpose-built comparable series** that lands in the changed-specimen / stable-measurement cell. Recommended substrates, in order of preference:

1. **Two real commits of the same specimen** (preferred when available later). Run the *same current productized pipeline* against two genuine source states (e.g., commit A and a later commit B of the same repository). Specimen changes (real code evolution); measurement model held constant (one pipeline, one evidence envelope). This is the gold standard — real evolution under a fixed instrument.

2. **Controlled fixture mutation of BlueEdge** (fastest to construct). Take one BlueEdge source state, run the current pipeline, then apply a *deliberate, minimal mutation* designed only to move AO-011 (e.g., shift one domain's runtime concentration), and run the same pipeline again. Specimen changes by construction; measurement model identical by construction. This isolates temporal mechanics with a known-direction ground truth — ideal for validating that TV-001 reports the mutation correctly.

3. **Another specimen with real historical commits** (e.g., a public repo with meaningful history). Run the current pipeline against an ordered commit series. Real evolution, stable instrument, but a new specimen requires re-establishing trust.

**Constraint binding all three:** every observation in the series must be produced by the *same pipeline version* under the *same evidence envelope*. The moment the measurement model varies across the series, the result reverts to a measurement-drift or mixed cell and is non-authoritative for trend.

---

## 4. Locked Gates

Before any Temporal Verdict computation may proceed:

1. The candidate series must pass the proof-gate matrix → land in **changed specimen + stable measurement model.**
2. The series must pass the C-conditions (PI.TEMPORAL-COMPARABILITY.01) to the comparability level required by the intended verdict claim.
3. Both gates recorded as a constitutional proof-gate result before computation.

**Until a substrate clears both gates, no Temporal Verdict is authoritative.**

Do not build PMO. Do not build Temporal Verdicts. The proof gate is locked.

---

## 5. Discovery Registration Candidate

Extends PCD-010:

- **Proof-Gate Matrix** — specimen × measurement model; only changed-specimen/stable-measurement yields temporal cognition.
- **BlueEdge Proof-Gate Result** — genesis/productized pair classified MEASUREMENT DRIFT (C4 fail); unsuitable for TV-001; recorded constitutional result.
- **First Valid Substrate Specification** — purpose-built comparable series, same pipeline, three ranked options.
