# ENL-003-CONTRACT-v1
## Traversal / Query Layer · run_01_blueedge

---

## Contract Metadata

| Field       | Value                              |
|-------------|-----------------------------------|
| Contract ID | ENL-003-CONTRACT-v1                |
| Stream      | ENL-003 — Traversal / Query Layer  |
| Run         | run_01_blueedge                    |
| Date        | 2026-03-21                         |
| Status      | PASS                               |

---

## Execution Summary

ENL-003-CONTRACT-v1 executed in full. Three required deliverables created.
All 59 tests passed. No deviations.

The contract formalises and implements the deterministic traversal and
query layer for ENL. All query functions are read-only, fail-fast on
violations, and produce deterministic output. The engine enforces all
ENL-002 layer transition rules at runtime and is compatible with the
Lens integration boundary defined in ENL-002A.

---

## Files Created

| File | Description |
|------|-------------|
| `docs/pios/enl/ENL-003_traversal_query_model.md` | Full model document covering query types A.1–A.5, traversal semantics, determinism rules, failure handling, output contract, and performance constraints. |
| `scripts/pios/enl/enl_query_engine_v1.py` | Python implementation: `load_graph`, `validate_graph`, `get_node`, `get_upstream_chain`, `get_downstream_nodes`, `get_query_subgraph`. |
| `scripts/pios/enl/test_enl_query_engine.py` | 59-test suite covering all query functions, all failure modes, determinism, and graph immutability. |

---

## Validation Results

```
Result: 59/59 checks passed
STATUS: PASS
```

Test coverage:
- `load_graph`: valid file, missing file, invalid JSON
- `validate_graph`: valid graph + 10 violation cases (missing field,
  invalid node_type, invalid status, forbidden transition, duplicate
  node_id, empty derived_from on non-EVID, non-empty on EVID,
  unresolvable reference, cross-run node, no EVID node)
- `get_node`: valid lookup, missing node
- `get_upstream_chain`: from INTEL (full chain), from SIG-41, from EVID,
  invalid start, forbidden transition raises immediately, incomplete
  chain (unresolvable reference), layer ordering, terminates_in_evid
- `get_downstream_nodes`: from EVID, from SIG-40, from INTEL (empty),
  missing source node, sorted result
- `get_query_subgraph`: full 4-node expansion from GQ-003, no-match
  returns empty, sorted result, query_id echoed, node fields unchanged
- Determinism: repeated calls to chain and subgraph return identical results
- Graph immutability: GRAPH dict unchanged after all query operations

---

## Implementation Notes

**Query scoping in get_query_subgraph**

Phase 1 (seed resolution) finds nodes whose `source_ref` contains the
`query_id` as a substring. For the minimal graph example, only the INTEL
node's `source_ref` references "GQ-003" directly. Phase 2 (upstream
expansion) then traverses the full derived_from chain from each seed,
collecting all reachable nodes. This produces the complete 4-node subgraph.
All filtering is executed within the engine (ENL). The caller receives the
complete result.

**Traversal ordering**

Nodes in `get_upstream_chain` are sorted by layer position (INTEL=0,
SIG-41=1, SIG-40=2, EVID=3) then by node_id within each layer. This
produces a stable, predictable ordering regardless of graph input order.

**Fail-fast on transition violations**

`ENLTransitionError` is raised immediately upon detection of a forbidden
layer transition, both in `validate_graph` (schema-level) and during
live traversal in `get_upstream_chain` (runtime enforcement). No partial
result is returned on a transition violation.

---

## Contract Deviations

None.

---

## Definition of Done — Verified

| Criterion | Status |
|-----------|--------|
| Traversal / query model fully documented | ✓ |
| All query types defined (A.1–A.5) | ✓ |
| Traversal semantics: strict, layer-by-layer, no inference | ✓ |
| Determinism formally specified and verified by tests | ✓ |
| Failure handling: all cases explicit and non-silent | ✓ |
| Output contract complete | ✓ |
| Engine implementation: pure Python, no external dependencies | ✓ |
| All 59 tests pass | ✓ |
| Compatible with Lens boundary (ENL-002A) | ✓ |
| Stream ready for ENL-004+ | ✓ |

---

## Final Status

**PASS**

ENL-003-CONTRACT-v1 complete.
59/59 tests · 0 deviations · target repository krayu-program-intelligence.
