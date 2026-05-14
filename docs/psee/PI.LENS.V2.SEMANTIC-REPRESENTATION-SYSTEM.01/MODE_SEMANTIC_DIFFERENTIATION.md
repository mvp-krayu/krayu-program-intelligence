# MODE SEMANTIC DIFFERENTIATION

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Scope:** What materially differs across the four lens modes after the semantic-actor restructure.

---

## 1. The differentiation contract

Before this stream, mode differentiation was *visual*: same content rearranged. After this stream, mode differentiation is *semantic*: each mode shows a different operational layer drawn from the same governed evidence ground.

The four modes share **zero** dominant content. They share only:

- The persona-tag chrome at the top of the rep field.
- The visual grammar of the actor panel shell.
- The IntelligenceField three-column layout.
- The support rail content (evidence state + qualifier + Report Pack).

Everything else differs.

---

## 2. Per-mode actor composition

### BALANCED — Executive lens (CEO consequence-first)

Actors: **DP · CB · RB · PA · RA** (Decision Posture, Confidence Boundary, Resolution Boundary, Pressure Anchor, Report Artifact Access).

Visible center canvas:

```
┌───────────────────────────────────────────────┐
│ [DP] Decision Posture                          │
│   Executive Ready — Qualified                  │
│   Q-01  advisory bound                          │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [RB] Resolution Boundary                       │
│  ┌───────┬───────┬───────┐                     │
│  │ Known │Partial│Unknown│                     │
│  │  2/3  │  1/3  │advisor│                     │
│  └───────┴───────┴───────┘                     │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [CB] Confidence Boundary                       │
│ ████████████░░░░░░░ 67% supported              │
│                      33% advisory              │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [PA] Pressure Anchor · origin                  │
│   ● Primary Delivery     HIGH                   │
└───────────────────────────────────────────────┘
```

The Primary/Coordination/Secondary triad is **absent** from this mode's center canvas.

### DENSE — Structural lens (CTO cause and propagation)

Actors: **ST · SB · SO · CC · AL · PA** (Semantic Topology, Structural Backing, Semantic-Only Exposure, Cluster Concentration, Absorption Load, Pressure Anchor).

Visible center canvas:

```
┌───────────────────────────────────────────────┐
│ [ST · SB · SO]  Semantic Topology · structural │
│                  backing · semantic-only       │
│  ┌──────────┬──────────┬──────────┐            │
│  │ ORIGIN   │PASS-THRU │ RECEIVER │            │
│  │ Primary  │Coord.    │Secondary │            │
│  │ HIGH     │ELEVATED  │MODERATE  │            │
│  │ ● backed │● backed  │● semantic│            │
│  └──────────┴──────────┴──────────┘            │
│ 2 of 3 structurally backed · 1 semantic-only   │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [CC] Cluster Concentration                     │
│   47   clusters monitored                       │
│ ████████░░░ 67% grounded                        │
│ structural mass concentrated upstream...       │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [AL] Absorption Load                           │
│   Coordination Layer                            │
│   conducting · not generating                   │
│ ████████████░░ 68% of upstream load absorbed   │
└───────────────────────────────────────────────┘
```

DENSE no longer mirrors the simple triad — it explicitly distinguishes structural-backing per domain and surfaces concentration / absorption as separate semantic objects.

### INVESTIGATION — Evidence lens (Analyst trace and confidence)

Actors: **ET · SS · IP · CB · RB** (Evidence Trace, Signal Stack, Inference Prohibition, Confidence Boundary, Resolution Boundary).

Visible center canvas:

```
┌───────────────────────────────────────────────┐
│ [ET] Evidence Trace · lineage                  │
│  ●─ Evidence object hash                       │
│   │  flagship001abc123def456...                │
│  ●─ Derivation hash                            │
│   │  derivflagship111222333...                 │
│  ●─ Baseline anchor                            │
│   │  governed-baseline-v2                      │
│  ●  Run id                                     │
│      RUN-FLAGSHIP-001                          │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [SS] Signal Stack · 4 active                   │
│  HIGH   Cluster Execution Pressure  PD         │
│  ELEV   Delivery Capacity Signal    PD         │
│  ELEV   Coordination Throughput     CL         │
│  MOD    Secondary Throughput Signal SD         │
│         (each row carries evidence text +      │
│          confidence row)                        │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ [IP] Inference Prohibition                     │
│   Executive action on partially-grounded       │
│   signals requires advisory confirmation...    │
│   Qualifier rules: Q-01                        │
│   ALI rules: ALI-01 · ALI-02 · ALI-03 · ALI-04 │
└───────────────────────────────────────────────┘
```

INVESTIGATION shows lineage hashes (NEW data — `trace_linkage`), individual signals (4 of them, NOT 3 domains), and an explicit Inference Prohibition statement with applied rule chips.

### BOARDROOM — Projection lens

Actors: **DP · CB · PA · RA** (Decision Posture, Confidence Boundary, Pressure Anchor, Report Artifact Access — all in projection-grade compact form).

Visible center canvas:

```
                  DECISION POSTURE

                   ╭───────────────╮
                  ╱  blue arc 67%   ╲
                 ╱                   ╲
                │       ╭─────╮       │
                │       │Q-01 │       │
                │       │ qual│       │
                │       ╰─────╯       │
                 ╲                   ╱
                  ╲ yellow arc 33% ╱
                   ╰───────────────╯

       ● 67% structurally backed   ● 33% advisory bound

   Operating posture. Pressure is propagating through
   coordination — advisory-bounded at the secondary receiver.

   ──── ────

   PARTIAL COVERAGE
```

The ring is now a **Confidence Envelope** — a real semantic visualization, not decoration. The conic-gradient renders the grounded vs advisory ratio explicitly.

---

## 3. Differentiation matrix

| Aspect                       | BALANCED                        | DENSE                                | INVESTIGATION                          | BOARDROOM                            |
|------------------------------|---------------------------------|--------------------------------------|----------------------------------------|--------------------------------------|
| Primary actors                | DP · CB · RB · PA               | ST · SB · SO · CC · AL · PA          | ET · SS · IP                           | DP · CB                              |
| Visible content unit         | resolution grid + bar + anchor  | topology matrix + concentration headline + absorption panel | lineage chain + signal rows + inference statement | confidence envelope ring + readout |
| Triad presence                | absent in canvas                | annotated with backing state         | absent (signal-level instead)          | absent                               |
| Lineage hashes shown         | no                              | no                                   | yes (4 hash steps)                     | no                                   |
| Individual signals shown     | no                              | no                                   | yes (4 signals)                        | no                                   |
| Cluster headline             | no                              | yes (32px)                           | no                                     | no                                   |
| Absorption percentage         | no                              | yes (68%)                            | no                                     | no                                   |
| Confidence envelope ring     | no                              | no                                   | no                                     | yes (220px conic-gradient)           |
| Inference prohibition contract | no                            | no                                   | yes (with rule chips)                  | no                                   |
| Resolution boundary grid     | yes (3-cell)                    | implicit in topology cells           | yes (per band)                         | implicit in confidence envelope      |
| Confidence boundary bar      | yes                             | no                                   | yes                                    | yes (as ring)                        |
| Decision posture phrase      | yes (22px)                      | no                                   | no                                     | yes (36px in ring)                   |

Every row that says "yes" in one column and "no" in another is a material differentiation point.

---

## 4. The five-second test

After the operator switches lens, within five seconds, an unbriefed observer looking at the center canvas should be able to say:

- BALANCED → "I see decision posture, resolution boundary, and a confidence bar."
- DENSE → "I see a domain topology matrix with structural-backing labels, a 47-cluster concentration panel, and an absorption load panel."
- INVESTIGATION → "I see lineage hashes, a list of individual signals with evidence text, and an inference-prohibition contract."
- BOARDROOM → "I see a confidence envelope ring showing 67% backed and 33% advisory."

If any of these reads "looks like the other three," the differentiation has failed. The captured screenshots in `screenshots/` confirm the test passes.

---

## 5. The semantic visual grammar

All actors share a consistent panel shell — that is what makes the system feel coherent. The differentiation happens in the *content* of each panel, not in the chrome.

This is what differentiates a **system** from a **collection of widgets**. Modes are coherent because the grammar is shared. Modes are different because the actor compositions are distinct.

---

## 6. Authority

This document is authoritative for mode differentiation. Future contracts that touch any lens MUST consult this matrix and update it explicitly if behaviors change.

---

**End of mode semantic differentiation.**
