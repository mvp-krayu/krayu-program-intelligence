# GAUGE.CONVERGENCE.RECONCILIATION.01 — Structural Equivalence Matrix

## Purpose

This matrix compares structural entities in Chain A and Chain B at the level of domains, entities (CEUs), and relationships.

---

## Domain Equivalence

| Chain A (intake_result.json domains) | Chain B (binding_envelope.json binding_context nodes) | Match |
|--------------------------------------|------------------------------------------------------|-------|
| documentation_root | DOM-01 documentation_root | EXACT |
| extraction_analysis | DOM-02 extraction_analysis | EXACT |
| backend_isolated | DOM-03 backend_isolated | EXACT |
| frontend_isolated | DOM-04 frontend_isolated | EXACT |
| platform_monorepo | DOM-05 platform_monorepo | EXACT |

**Domain equivalence: 5/5 EXACT MATCH**

---

## Entity (CEU) Equivalence

| Chain A entity | Chain A source | Chain B node | Chain B source | Match |
|---------------|----------------|-------------|----------------|-------|
| CEU-01 | gauge_state.json (admissible_units coverage) | NODE-001 / CEU-01 | binding_envelope.json component_entity | LABEL MATCH |
| CEU-02 | same | NODE-002 / CEU-02 | same | LABEL MATCH |
| CEU-03 | same | NODE-003 / CEU-03 | same | LABEL MATCH |
| CEU-04 | same | NODE-004 / CEU-04 | same | LABEL MATCH |
| CEU-05 | same | NODE-005 / CEU-05 | same | LABEL MATCH |
| CEU-06 | same | NODE-006 / CEU-06 | same | LABEL MATCH |
| CEU-07 | same | NODE-007 / CEU-07 | same | LABEL MATCH |
| CEU-08 | same | NODE-008 / CEU-08 | same | LABEL MATCH |
| CEU-09 | same | NODE-009 / CEU-09 | same | LABEL MATCH |
| CEU-10 | same | NODE-010 / CEU-10 | same | LABEL MATCH |

**CEU count: Chain A DIM-01 admissible_units=30 (10 CEUs × 3 structural layers). Chain B: 10 component_entity nodes. Entity identity: 10/10 LABEL MATCH.**

Note: Chain A expresses CEU coverage in units (30 = 10 entities × 3 layers). Chain B expresses them as nodes (10 component_entity). These are the same 10 entities at different representation granularities.

---

## Relationship Equivalence

| Chain A source | Chain A relationship | Chain B source | Chain B relationship | Match |
|---------------|---------------------|----------------|---------------------|-------|
| raw_input.json (declared) | OVERLAP_STRUCTURAL: CEU-08 → CEU-10 | binding_envelope.json | OVL-01: DOM-03 ↔ DOM-05-C (component CEU-08/CEU-10) | STRUCTURAL MATCH |
| raw_input.json (declared) | OVERLAP_STRUCTURAL: CEU-09 → CEU-10 | binding_envelope.json | OVL-02: DOM-04 ↔ DOM-05-D (component CEU-09/CEU-10) | STRUCTURAL MATCH |

**Relationship equivalence: 2/2 OVERLAP_STRUCTURAL — both declared in raw_input.json and materialized in binding_envelope.json.**

---

## Divergence Points

| dimension | Chain A value | Chain B value | classification |
|-----------|--------------|--------------|----------------|
| Unknown space count | DIM-04.total_count = 0 | constraint_flags.unknown_space_count = 3 | BOUNDARY_LAYER_DIFFERENCE — not a contradiction |
| Run ID | run_01_authoritative | run_335c0575a080 | EXPECTED_DIVERGENCE — different execution units |
| Generation date | 2026-04-06 | 2026-04-10 | EXPECTED_DIVERGENCE — Chain B post-dates Chain A |
| Client path | clients/blueedge/ | clients/1de0d815.../ | ALIASING_UNKNOWN — no runtime alias verified |

### Unknown Space Explanation

The DIM-04 / unknown_space divergence is explained by boundary scope:

- **DIM-04.total_count=0**: Gauge runtime boundary. This measures gauge-recognized unknown entities within the scoring scope. At PHASE_1_ACTIVE, this scope is defined by the 30 admitted units.
- **constraint_flags.unknown_space_count=3 (USP-01/02/03)**: Topology boundary. These are structural positions in the binding topology that could not be classified into any domain surface. They exist outside the 10-CEU component boundary, in the unmapped topology space.

These measure different things. The divergence is a SCOPE_DIFFERENCE, not a data conflict.

---

## CEU Registry Note

`docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/ceu_registry.json`:
- run_id: `run_02_blueedge` (neither chain's active run)
- 13 total CEUs: CEU-01–CEU-10 (10 governance entries) + CEU-11/CEU-12/CEU-13 (3 provenance-only)
- CEU-11/12/13 do not appear in binding_envelope.json component_entity nodes
- CEU-01–CEU-10 match both chains

The 3 provenance-only CEUs (CEU-11/12/13) exist in the governance registry but have no corresponding nodes in the active topology and no corresponding units in the gauge scoring scope.

---

## Equivalence Summary

| dimension | result |
|-----------|--------|
| Domain count | EQUIVALENT (5/5) |
| Domain labels | EQUIVALENT (exact label match) |
| CEU count | EQUIVALENT (10 entities, different representation units) |
| CEU identity | EQUIVALENT (label match all 10) |
| Overlap relationships | EQUIVALENT (2/2 match in structure and entity refs) |
| Unknown space | SCOPE_DIFFERENCE (not a contradiction) |
| Run IDs | EXPECTED_DIVERGENCE (intentional separate executions) |
| Client path identity | UNVERIFIED (alias relationship not determinable from evidence) |
