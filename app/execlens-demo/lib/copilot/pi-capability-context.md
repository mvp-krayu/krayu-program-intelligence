# PI Capability Context — Operational Process Map

When an operator asks about evidence quality, assessment improvement, or which PI process addresses a specific gap — use this map. Do not infer capabilities. If a capability is listed as MISSING or BLOCKED, say so.

## Evidence Derivation Chain

Evidence flows through a deterministic pipeline. Each phase produces artifacts consumed by downstream phases.

```
Source Intake → Structural Scan → Code Graph → Binding Envelope
  → Condition Correlation → Pressure Candidates → Pressure Zones
    → Signal Projection → Signal Registry → LENS Report
```

Key pipeline scripts (all in `scripts/pios/`):
- `run_client_pipeline.py` — 19-phase orchestrator
- `source_intake.py` — TAR_ARCHIVE adapter with provenance
- `structural_scanner.py` — Phase 2 structural inventory
- `ceu_grounding.py` — CEU candidate derivation + evidence reconciliation

## Signal Families

Three signal levels measure different structural properties:

| Family | Level | Script | What It Measures |
|--------|-------|--------|-----------------|
| ISIG | 1 (file-topology) | `isig_derivation.py` | File-level topology intelligence: import patterns, module boundaries, file relationships |
| PSIG/DPSIG | 2 (architectural pressure) | `psig_derivation.py`, `dpsig_derivation.py` | Architectural pressure: coupling pressure, export pressure, cluster fragmentation, isolation pressure |

Signal activation: PSIG uses RUN_RELATIVE_OUTLIER method (z-score > 2.0 threshold). Signals activate when a node's metric exceeds 2 standard deviations from the run mean.

Active signals: PSIG-001 (coupling_pressure), PSIG-002 (export_pressure), PSIG-004 (cluster_fragmentation), PSIG-006 (isolation_pressure).

Condition synthesis: `75x/compute_condition_correlation.py` correlates activated signals into structural conditions. `75x/compute_pressure_candidates.py` identifies pressure candidate nodes. `75x/compute_pressure_zones.py` aggregates into pressure zones.

## Structural Analysis Capabilities

| Capability | Status | What It Produces |
|------------|--------|-----------------|
| File topology (imports/exports) | OPERATIONAL | binding_envelope.json — node graph with fan-in/fan-out |
| Centrality analysis | OPERATIONAL | Top structural spines ranked by centrality |
| Constriction surface | OPERATIONAL | Structural choke points, through-flow, bridge detection |
| Fragility surface | OPERATIONAL | Fragility scores, coupling/cohesion per module |
| Boundary divergence | OPERATIONAL | Divergent and orphaned modules |
| Code graph (classes, functions) | OPERATIONAL | File count, structural edges, class/function inventory |
| Index file role classification (barrel vs facade vs logic-bearing) | GENUINELY MISSING | Requires AST inspection to classify export patterns |
| Node-to-file path resolution for semantic nodes | PARTIALLY EXISTS | binding_envelope has file paths; semantic node IDs need mapping |

## Semantic Derivation Capabilities

Two independent derivation paths produce semantic propositions:

**PATH A — Structural Proposition Derivation** (`spe/derivation_engine.py`)
- 6 deterministic derivers: STRUCTURAL_DOMINANCE, COUPLING_PATTERN, AUTHORITY_TOPOLOGY, TIER_GROUNDING, HERO_MOMENT_GROUNDING, CLUSTER_ARCHITECTURE
- Requires: code graph + centrality + topology + hero moments
- Status: OPERATIONAL

**PATH B — Semantic DNA to Proposition** (`sdc/proposition_bridge.py`)
- 4 derivers: DOMAIN_EVIDENCE_GROUNDING, CAPABILITY_EVIDENCE, VAULT_CLAIM_STRUCTURAL, CROSS_DOMAIN_EVIDENCE
- Produces from HTML evidence files via SDC Evidence Compiler
- Status: OPERATIONAL (proven: 85 propositions on BlueEdge)

**Semantic Topology** (`generate_semantic_topology.py`)
- Produces domain relationship graph from CSR
- Status: OPERATIONAL
- Note: Edge relationships are inferred from co-occurrence and naming patterns — not structurally confirmed by file-level dependency analysis

## SQO Governance Process

SQO (Software Qualification Overlay) governs assessment maturity through 5 gates:

| Gate | Name | Script | What It Does |
|------|------|--------|-------------|
| Gate 1 | CEU Reconciliation | `ceu_reconciliation_action.py` | Operator confirms/rejects/merges structural units |
| Gate 2 | Structural Verification | (pipeline phases) | Deterministic structural checks |
| Gate 3 | Proposition Review | `proposition_review_action.py` | Operator accepts/rejects/contests semantic propositions |
| Gate 4 | Revalidation | `revalidation_engine.py` | 25-check deterministic revalidation |
| Gate 5 | Promotion | `promotion_action.py` | Operator advances S-state (S0→S1→S2→S3) |

S-state progression: S0 (intake) → S1 (structurally grounded) → S2 (semantically governed) → S3 (certified).

Constitutional replay anchor (`constitutional_replay_anchor.py`): 8-dimension semantic adequacy check that blocks advancement when constitutional distance is too high.

## Evidence Quality Improvement Paths

When evidence has gaps or low confidence, these are the governed improvement mechanisms:

| Gap Type | Resolution Process | Status |
|----------|-------------------|--------|
| Structural measurement missing | Add enrichment to pipeline phase | Requires pipeline extension contract |
| File role ambiguity (barrel/facade/logic) | AST inspection enrichment | GENUINELY MISSING — compiler learning item |
| Semantic-only domain (no structural backing) | File-to-domain assignment via structural scanner + CEU grounding | PARTIALLY EXISTS — requires domain-aware structural mapping |
| Inferred relationship unconfirmed | Edge-level dependency analysis from code graph | PARTIALLY EXISTS — code graph has edges but not mapped to semantic topology |
| Signal source ambiguity | Derivation trace in signal_registry.json | OPERATIONAL — check signal derivation_trace field |
| Consequence derivation unclear | Condition correlation trace in condition_correlation_state.json | OPERATIONAL — condition→signal→node traceability |
| Proposition confidence low | PATH A/B re-derivation + enrichment | OPERATIONAL — enrichment_activity_event.json tracks improvements |

## Enrichment and Chronicle

- **PATH B Evidence Enrichment** (`sdc/evidence_enrichment_rc04.py`) — Domain ID correction + confidence recalculation from evidence files
- **Chronicle Builder** (`sdc/chronicle_builder_rc08.py`) — 8-chapter cognitive traversal HTML with Z1-Z5 zoom levels
- **Chronicle Certification** (`sdc/chronicle_certification_rc09.py`) — 62-check certification of governed cognitive replay lifecycle

## Gap Classification Guide

Before claiming a capability exists or is missing, classify:

| Classification | Meaning |
|---------------|---------|
| EXISTS | Fully operational — use as-is |
| EXISTS_NEEDS_PARAMETERIZATION | Logic present, needs CLI args or path generalization |
| EXISTS_NEEDS_ROUTING | Logic present, not connected to pipeline |
| EXISTS_NEEDS_INTEGRATION | Logic present, missing upstream/downstream wiring |
| PARTIALLY_EXISTS | Some logic present, specific extension needed |
| GENUINELY_MISSING | No comparable capability — new work required |

Always use this classification when discussing evidence gaps. Do not say "we could build X" without classifying whether X already exists.
