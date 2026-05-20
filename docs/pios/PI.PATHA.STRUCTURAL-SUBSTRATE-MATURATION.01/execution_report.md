# Execution Report — PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01

## Stream Identity

- **Stream ID:** PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01
- **Classification:** G1 — Architecture-Mutating
- **Branch:** feature/PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01
- **Baseline:** d391513 (main)
- **Contract:** PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01

## Pre-Flight

| Check | Result |
|---|---|
| Branch correct | PASS — feature/PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01 |
| Canonical state loaded | PASS — PIOS_CURRENT_CANONICAL_STATE.md |
| Terminology loaded | PASS — TERMINOLOGY_LOCK.md |
| Branch authorized | PASS — feature branch from main |
| Term collision check | PASS — "Structural Relevance Class" not in TERMINOLOGY_LOCK.md |
| §5.5 assessment | REQUIRED — creates reusable pipeline primitive |

## Execution Summary

### Phase 1: Structural Relevance Classifier

Created `scripts/pios/structural_relevance_classifier.py`:
- 9 SRC classes: CORE_SOURCE, TESTING, CONFIG, DOCUMENTATION, INFRASTRUCTURE, GENERATED, TOOLING, VENDOR, OTHER
- Three-tier significance model: PRIMARY (CORE_SOURCE only), SUPPORT (TESTING, CONFIG), PERIPHERAL (everything else)
- First-match-wins ordered rule list (34 rules)
- Directory nodes classified by dominant child classification
- Produces 40.2r/ (structural_relevance.json + structural_node_inventory_filtered.json) and 40.3r/ (structural_topology_log_filtered.json)

### Phase 2: Topology Filtering

Implemented within structural_relevance_classifier.py — builds 40.3r/structural_topology_log_filtered.json retaining only edges where BOTH source and target are PRIMARY.

### Phase 3: Pipeline Integration

Modified `scripts/pios/run_client_pipeline.py`:
- Added Phase 3.5 between Phase 3 (40.x Structural Verification) and Phase 3b (Semantic Derivation)
- Default ON — always runs
- Graceful degradation: if classifier fails, pipeline continues with unfiltered 40.2/40.3
- Idempotent: skips if 40.2r already exists

### Phase 4: Downstream Consumer Update

Modified `scripts/pios/dom_layer_generator.py`:
- Prefers 40.2r/structural_node_inventory_filtered.json when available
- Falls back to 40.2/structural_node_inventory.json if 40.2r absent
- Logs which inventory mode was resolved
- Filters cluster node_ids to only include nodes present in the resolved inventory

### Verification — Flask Regression

| Metric | Before (unfiltered) | After (filtered) |
|---|---|---|
| Nodes entering DOM layer | 287 | 66 |
| Domains | 8 (CI_INFRA, TOOLING, DOCUMENTATION, ROOT spillover) | 8 (focused: src/flask/ + examples/) |
| False-positive DOMs | CI_INFRA(12), TOOLING(7), DOCUMENTATION(3), ROOT(150) | Eliminated |
| core_source_ratio | N/A | 0.230 (66/287) |
| Determinism | N/A | PASS — byte-identical across runs |
| Next.js build | PASS | PASS |
