---
title: Value Creation Path
node_type: navigation
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Value Creation Path — BlueEdge Fleet Management Platform Assessment

How raw structural evidence becomes a scored, signal-enriched, executive-readable assessment.

---

## Stage 1 — Evidence Intake

**What happens:** The source bundle is processed by the IG pipeline. Each artifact is classified, hashed, and scored for admissibility.

**What it proves:**
- 30 structural units admitted, 0 excluded
- Complete intake — all source data received

**Key artifact:** [[ART-07 admissibility_log.json]]
**Key claims:** [[CLM-02 Structural Unit Count]], [[CLM-07 Source Data Intake Complete]]

---

## Stage 2 — Coverage and Reconstruction

**What happens:** Admitted units are checked for completeness (coverage) and structural coherence (reconstruction across four axes).

**What it proves:**
- Coverage: 30/30 = 100.0% — all required elements are present
- Reconstruction: four axes all PASS — the model is internally consistent and coherent

**Key artifacts:** [[ART-02 coverage_state.json]], [[ART-03 reconstruction_state.json]]
**Key claims:** [[CLM-01 Structural Coverage Completeness]], [[CLM-03 Structural Reconstruction Pass-Fail]], [[CLM-04 Four-Axis Reconstruction Detail]]

---

## Stage 3 — Topology Emission

**What happens:** The normalized structural output is translated into a navigable platform topology.

**What it proves:**
- 17 functional domains identified
- 42 capability surfaces mapped
- 89 structural components at leaf level
- 148 nodes total — 0 cross-domain overlaps in canonical model

**Key artifact:** [[ART-04 canonical_topology.json]]
**Key claims:** [[CLM-14 Structural Domain Count]], [[CLM-15 Structural Capability Count]], [[CLM-16 Structural Component Count]]

---

## Stage 4 — Signal Emission

**What happens:** Structural evidence is traversed through a four-layer evidence chain to produce intelligence signals.

**What it produces:**
- 5 governed intelligence signals
- Distribution: STRONG:2, MODERATE:2, WEAK:1

**Key artifact:** [[ART-05 signal_registry.json]]
**Key claims:** [[CLM-18 Governed Signal Count]], [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]

---

## Stage 5 — Score Computation

**What happens:** Coverage points, reconstruction points, and completion points are summed to produce canonical and projected scores.

**What it proves:**
- Canonical score 60 = 0 + 35 + 25 = 60
- Projected score 100 = canonical 60 + COMPLETION_WEIGHT 40 (achievable when execution runs)

**Key transformation:** [[TRN-03 Score Computation]]
**Key artifact:** [[ART-01 gauge_state.json]]
**Key claims:** [[CLM-09 Proven Structural Score]], [[CLM-10 Achievable Score Projected]], [[CLM-12 Score Confidence Range]]

---

## Stage 6 — GAUGE Rendering

**What happens:** The execution chain's terminal artifact (`gauge_state.json`) is read by GAUGE's API layer. GAUGE does not recompute — it renders.

**What becomes visible:**
- Proven Score: 60 / Achievable: 100 (StatusBand, ScoreGauge)
- Executive verdict: STRUCTURE=STRONG / COMPLEXITY=LOW / EXECUTION=UNKNOWN
- 5 signals in SignalAvailability
- Full 148-node topology in explorer

**Key claim:** [[CLM-25 Executive Three-Axis Verdict]]
**Full lineage:** [[BlueEdge Fleet Management Platform — Evidence Path]]

---

## The Chain in One View

```
Source bundle
  → Stage 1: 30 units admitted         → ART-07
  → Stage 2: 100% coverage, 4×PASS  → ART-02 + ART-03
  → Stage 3: 17/42/89 topology         → ART-04
  → Stage 4: 5 signals                   → ART-05
  → Stage 5: score 60/100              → ART-01
  → Stage 6: GAUGE renders
              60 proven / 100 achievable
              STRUCTURE=STRONG / COMPLEXITY=LOW / EXECUTION=UNKNOWN
```
