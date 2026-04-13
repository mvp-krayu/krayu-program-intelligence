# GAUGE.CONVERGENCE.RECONCILIATION.01 — Metric Alignment Analysis

## Purpose

Assess whether numeric metrics in Chain A (gauge scoring) and Chain B (topology) are mutually consistent, contradictory, or measuring separate things.

---

## Metric Cross-Reference Table

| metric | Chain A value | Chain A source | Chain B value | Chain B source | alignment |
|--------|--------------|----------------|--------------|----------------|-----------|
| Domain count | 5 (verified, intake_result.json) | intake_result.json: "consumed_scope: all, 5 domains" | 5 binding_context nodes | binding_envelope.json node count | ALIGNED |
| Entity count | 10 CEUs (DIM-01 coverage: 30 units / 3 layers) | gauge_state.json DIM-01.admissible_units=30 | 10 component_entity nodes | binding_envelope.json | ALIGNED |
| Coverage percent | 100.0 | gauge_state.json DIM-01.coverage_percent | Not in scope (topology does not score coverage) | — | NOT COMPARABLE |
| Reconstruction state | PASS | gauge_state.json DIM-02.state | Not in scope | — | NOT COMPARABLE |
| Validated units | 30 | reconstruction_state.json.validated_units | Not in scope | — | NOT COMPARABLE |
| Overlap / conflict count | 0 (DIM-04.total_count) | gauge_state.json.dimensions.DIM-04 | 2 OVERLAP_STRUCTURAL edges | binding_envelope.json constraint_flags.overlap_count | SCOPE_DIFFERENCE (see below) |
| Unknown space count | Not in gauge scope | — | 3 (USP-01/02/03) | binding_envelope.json.constraint_flags.unknown_space_count | NOT COMPARABLE |
| Signal count | Not in gauge scope | — | 5 | binding_envelope.json.summary.signals_count | NOT COMPARABLE |
| Edge count | Not in gauge scope | — | 62 (60 CONTAINS + 2 OVERLAP) | binding_envelope.json | NOT COMPARABLE |
| Score (canonical) | 60 | gauge_state.json.score.canonical | Not in scope (topology produces no score) | — | NOT COMPARABLE |
| Projection | 100 | gauge_state.json.projection.value | Not in scope | — | NOT COMPARABLE |
| Confidence band | [60–100] | gauge_state.json.confidence | Not in scope | — | NOT COMPARABLE |

---

## DIM-04 vs constraint_flags.overlap_count: Full Analysis

This is the only pair where both chains have numeric values that might appear to conflict.

| measurement | value | scope |
|-------------|-------|-------|
| Chain A: DIM-04.total_count | 0 | Gauge runtime scope: entities that appeared in the intake but could not be admitted into a scoring dimension. Measured against the 30-unit admitted scope. |
| Chain B: constraint_flags.overlap_count | 2 | Topology scope: structural positions that appear in multiple domain surfaces simultaneously. These are not "unknown" — they are known entities appearing in two domains. |

**These measure fundamentally different things:**

- DIM-04 = **score boundary failures** (entities rejected from gauge scoring)
- constraint_flags.overlap_count = **structural overlap facts** (entities appearing in two domain surfaces)

An overlap entity is one that has been admitted and classified — it is included in the 30 admitted units. An entity contributing to DIM-04 would be one that could not be classified at all.

**Conclusion: DIM-04=0 and overlap_count=2 are not contradictory.** Both can be true simultaneously. The 2 overlapping entities (CEU-08/CEU-10 via DOM-03/DOM-05, and CEU-09/CEU-10 via DOM-04/DOM-05) are admitted in Chain A's coverage (30/30 = 100%) and flagged as structural overlaps in Chain B's topology.

---

## Coverage Metric Lineage

Chain A's coverage metric (DIM-01.coverage_percent=100.0) is declared to originate from:
- coverage_state.json stream: `PSEE-RUNTIME.5A`
- raw_input.json declares: `__coverage_percent: 100.0` and `__reconstruction_state: PASS`

Chain B's raw_input.json carrying Chain A's metrics means Chain B's producer explicitly verified Chain A's coverage before generating the topology. The coverage value did not independently generate — it was inherited from Chain A via the declared `__source_run_id` link.

---

## Metric Independence vs Derivation

| metric cluster | chain A produces | chain B produces | relationship |
|---------------|-----------------|-----------------|--------------|
| Score, coverage, reconstruction | YES | NO | Chain A is sole authority |
| Topology structure, overlaps, unknown space | NO | YES | Chain B is sole authority |
| Domain catalog, entity catalog | Both (same values) | Both (same values) | Parallel derivation from common source (raw_input.json → Chain A run → Chain B intake) |
| Relationship structure | Declared in raw_input | Materialized in binding_envelope | Chain B materializes what raw_input declared |

---

## Alignment Summary

| check | result |
|-------|--------|
| Metrics that are comparable are aligned | PASS — domain count (5), entity count (10) match |
| No contradictory numeric values found | PASS — DIM-04=0 and overlap_count=2 are scope-distinct |
| Chain A coverage does not contradict Chain B topology | PASS — coverage measures different boundary than overlap |
| Chain B metrics do not undermine Chain A scoring | PASS — topology produces no score; both chains are authoritative in their own scope |
