---
node_class: client-lineage
client_id: blueedge
client_name: BlueEdge Fleet Management Platform
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Evidence Path

The complete lineage from intake source to product surface for the BlueEdge assessment.

```
INTAKE SOURCE
  → [NOT PRESENT — run_07_source_profiled_ingestion/ absent — lineage constraint]

IG PIPELINE
  → pios ig materialize → pios ig integrate-structural-layers
  → Basis: docs/pios/IG.RUNTIME/run_01/ (30 units admitted, 0 excluded)
  → Artifact: admissibility_log.json → [[ART-07 admissibility_log.json]]

STRUCTURAL EXTRACTION (L40.2)
  → docs/pios/40_2/ structural extractions
  → [NOT PRESENT for recomputed run — lineage constraint; IG.RUNTIME/run_01 is authoritative floor]

STRUCTURAL RELATION (L40.3)
  → docs/pios/40_3/ structural relations
  → [NOT PRESENT for recomputed run — lineage constraint]

STRUCTURAL NORMALIZATION (L40.4)
  → docs/pios/40_4/ normalized structural output
  → [NOT PRESENT for recomputed run — lineage constraint]

S1 — COVERAGE + RECONSTRUCTION
  → pios emit coverage → [[ART-02 coverage_state.json]] (coverage_percent=100.0)
  → pios emit reconstruction → [[ART-03 reconstruction_state.json]] (PASS, 4×PASS axes)

S2 — TOPOLOGY EMISSION
  → pios emit topology → [[ART-04 canonical_topology.json]] (17/42/89 = 148 nodes)

S3 — SIGNAL EMISSION
  → pios emit signals → [[ART-05 signal_registry.json]] (5 signals, STRONG:2/MODERATE:2/WEAK:1)

S4 — GAUGE COMPUTATION
  → pios compute gauge → pios declare coherence → pios validate freshness
  → [[ART-01 gauge_state.json]] (canonical=60, projected=100)

GAUGE PRODUCT SURFACE
  → /api/gauge → index.js (RuntimeIntelligence, StructuralMetrics, SignalSet panels)
  → /api/topology → topology.js (TopologyAddon, TopologySummaryPanel)
  → /api/signals → index.js SignalAvailability
  → overview.js (ExecutiveDecisionBlock, StatusBand, ScoreGauge, MeaningSection)
```

## Assessment State

| property | value |
|----------|-------|
| Client name | BlueEdge Fleet Management Platform |
| Authoritative run | run_authoritative_recomputed_01 |
| IG basis | docs/pios/IG.RUNTIME/run_01/ (30 units) |
| Upstream source | NOT PRESENT (run_07_source_profiled_ingestion/) |
| Canonical score | 60 |
| Projected score | 100 |
| Execution status | NOT_EVALUATED |
| Signals | 5 (SIG-001..005) |
| Canonical overlaps | 0 |
| Binding envelope overlaps | 2 (OVL-01, OVL-02) |
| Unknown-space records (envelope) | 3 (USP-01/02/03) |

## Claims in Evidence Path
[[CLM-01]] [[CLM-02]] [[CLM-03]] [[CLM-04]] [[CLM-05]] [[CLM-06]] [[CLM-07]] [[CLM-08]] [[CLM-09]] [[CLM-10]] [[CLM-11]] [[CLM-12]] [[CLM-13]] [[CLM-14]] [[CLM-15]] [[CLM-16]] [[CLM-17]] [[CLM-18]] [[CLM-19]] [[CLM-20]] [[CLM-21]] [[CLM-22]] [[CLM-23]] [[CLM-24]] [[CLM-25]] [[CLM-26]] [[CLM-27]]

## Blocked Mappings
- `run_07_source_profiled_ingestion/` — NOT PRESENT (lineage constraint — client delivery artifact not committed)
- L40.2/L40.3/L40.4 structural dirs for recomputed run — NOT PRESENT (lineage constraint)
