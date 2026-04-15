---
node_class: client-lineage
client_id: blueedge
client_name: BlueEdge Fleet Management Platform
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Why This Page Matters

This is the backbone of the BlueEdge assessment. Every claim in the vault traces back through this chain. The intake produced 30 structural units; those units drove the coverage and reconstruction results; the normalized topology became the canonical platform map; the signal registry was derived from the structural evidence chain; the gauge_state.json is the terminal product that GAUGE renders. If you want to verify any claim, follow its artifact link back to the producing stage in this chain.

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


## Key Outcomes

The commercially significant outputs this chain produced:

| outcome | value | claim |
|---------|-------|-------|
| Proven score | 60/100 | [[CLM-09 Proven Structural Score]] |
| Achievable score | 100/100 | [[CLM-10 Achievable Score Projected]] |
| Signal count | 5 (STRONG:2 / MODERATE:2 / WEAK:1) | [[CLM-18 Governed Signal Count]] |
| Executive verdict | STRUCTURE=STRONG / COMPLEXITY=LOW / EXECUTION=UNKNOWN | [[CLM-25 Executive Three-Axis Verdict]] |
| Unknown dimensions | 7 operational dimensions unresolvable from structure | [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] |

## Follow the Chain

A curated path through the most important nodes:

1. Start here: [[BlueEdge — Evidence Path]] (this note)
2. Terminal artifact: [[ART-01 gauge_state.json]]
3. Score derivation: [[TRN-03 Score Computation]]
4. Proven score: [[CLM-09 Proven Structural Score]]
5. Signal intelligence: [[ART-05 signal_registry.json]]
6. Most significant signal: [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]]

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
[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]] [[CLM-03 Structural Reconstruction Pass-Fail]] [[CLM-04 Four-Axis Reconstruction Detail]] [[CLM-05 Escalation Clearance]] [[CLM-06 Runtime Unknown-Space Count]] [[CLM-07 Source Data Intake Complete]] [[CLM-08 Structural Patterns Conform]] [[CLM-09 Proven Structural Score]] [[CLM-10 Achievable Score Projected]] [[CLM-11 Score Band Classification]] [[CLM-12 Score Confidence Range]] [[CLM-13 Execution Layer Status]] [[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-17 Cross-Domain Structural Overlaps]] [[CLM-18 Governed Signal Count]] [[CLM-19 Signal Evidence Quality Distribution]] [[CLM-20 SIG-001 Sensor Bridge Throughput]] [[CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions]] [[CLM-22 SIG-003 Dependency Load 68 Percent]] [[CLM-23 SIG-004 Structural Volatility Edge Density]] [[CLM-24 SIG-005 Coordination Pressure Partial]] [[CLM-25 Executive Three-Axis Verdict]] [[CLM-26 Executive Narrative Phrase Set]] [[CLM-27 Full Node Inventory 148 Nodes]]

## Blocked Mappings
- `run_07_source_profiled_ingestion/` — NOT PRESENT (lineage constraint — client delivery artifact not committed)
- L40.2/L40.3/L40.4 structural dirs for recomputed run — NOT PRESENT (lineage constraint)
