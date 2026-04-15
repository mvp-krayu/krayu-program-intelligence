---
title: BlueEdge Fleet Management Platform — Evidence Path
node_type: lineage
client: blueedge
run_id: run_authoritative_recomputed_01
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# BlueEdge Fleet Management Platform — Evidence Path

## Why This Page Matters

This page traces the complete path from raw source artifacts to GAUGE product surface. Every claim in this vault exists because of this chain. Understanding the chain means understanding which claims are proven, which are derived, and which are pending.

## Key Outcomes at a Glance

| stage | output | grounded claims |
|-------|--------|----------------|
| Evidence Intake | 30/30 units admitted | CLM-02, CLM-07 |
| Coverage | 100% | CLM-01 |
| Reconstruction | PASS (4 axes) | CLM-03, CLM-04 |
| Topology | 17/42/89 (148 nodes) | CLM-14–16, CLM-27 |
| Signals | 5 signals (STRONG:2, MODERATE:2, WEAK:1) | CLM-18–24 |
| Score | 60/100 | CLM-09, CLM-10 |
| Executive Verdict | STRUCTURE · STRONG / COMPLEXITY · LOW / EXECUTION · UNKNOWN | CLM-25 |

---

## S0 — Evidence Intake

**What:** Source bundle received, classified, and admitted by the IG pipeline.

**Artifacts produced:**
- `admissibility_log.json` → [[ART-07 admissibility_log.json]]

**Result:** 30 units admitted, 0 excluded

---

## S1 — Coverage and Reconstruction

**What:** Admitted units measured for completeness and structural coherence.

**Artifacts produced:**
- `coverage_state.json` → [[ART-02 coverage_state.json]]
- `reconstruction_state.json` → [[ART-03 reconstruction_state.json]]

**Result:** Coverage 100% / Reconstruction PASS

---

## S2 — Topology Emission

**What:** Semantic layer translated into navigable platform topology.

**Artifacts produced:**
- `canonical_topology.json` → [[ART-04 canonical_topology.json]]

**Result:** 17 domains / 42 capabilities / 89 components

---

## S3 — Signal Emission

**What:** Four-layer evidence chain traversed to produce intelligence signals.

**Artifacts produced:**
- `signal_registry.json` → [[ART-05 signal_registry.json]]

**Result:** 5 signals — STRONG:2, MODERATE:2, WEAK:1

**Most significant finding:** [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]

---

## S4 — Score Computation and GAUGE State

**What:** Score computed from coverage, reconstruction, and execution state. Terminal artifact produced.

**Artifacts produced:**
- `gauge_state.json` → [[ART-01 gauge_state.json]]

**Result:** canonical=60 / projected=100 / execution=NOT_EVALUATED

---

## Product Surface — GAUGE Rendering

**What:** GAUGE reads `gauge_state.json` via GAUGE_PACKAGE_DIR binding. Does not recompute. Renders.

**Product outputs:**
- StatusBand: 60 proven / 100 achievable
- ExecutiveDecisionBlock: STRUCTURE · STRONG / COMPLEXITY · LOW / EXECUTION · UNKNOWN
- SignalAvailability: 5 signals
- TopologyExplorer: 148 nodes

---

## Follow the Chain

```
Source bundle
  ↓ S0: IG admissibility
  ↓ S1: coverage + reconstruction
  ↓ S2: topology emission
  ↓ S3: signal emission
  ↓ S4: score computation → gauge_state.json
  ↓ GAUGE: render (does not recompute)
  ↓ LENS: explain (does not recompute)
```

Every claim in this vault follows this chain. No claim exists without a traceable step in this sequence.
