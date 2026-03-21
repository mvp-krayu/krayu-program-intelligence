# ENL-002-CONTRACT-v1
## Evidence Graph Schema · run_01_blueedge

---

## Contract Metadata

| Field         | Value                          |
|---------------|-------------------------------|
| Contract ID   | ENL-002-CONTRACT-v1            |
| Stream        | ENL-002 — Evidence Graph Schema |
| Run           | run_01_blueedge                |
| Date          | 2026-03-21                     |
| Status        | PASS                           |

---

## Execution Summary

ENL-002-CONTRACT-v1 was executed in full. All seven required deliverables
were created and both validation scripts passed with zero failures.

The contract formalizes the ENL graph schema — machine-readable node
definitions, layer transition rules, a minimal valid example, and the
validators that enforce them. This is the schema implementation layer
for ENL-001.

---

## Files Created

### Schema Artifacts

| File | Description |
|------|-------------|
| `docs/pios/enl/schema/enl_node_schema_v1.json` | Canonical field definitions for all ENL node types. 8 required fields, 4 node types, 5 status values, layer mapping. |
| `docs/pios/enl/schema/enl_graph_rules_v1.json` | Allowed and forbidden layer transitions, terminal node policy, empty derived_from policy, run-awareness constraints, 11 fail conditions. |

### Documentation

| File | Description |
|------|-------------|
| `docs/pios/enl/ENL-002_evidence_graph_schema.md` | Main schema standard document. Node types, required fields, transition rules, constraints, governance rules, alignment with ENL-001 principles. |

### Examples

| File | Description |
|------|-------------|
| `docs/pios/enl/examples/ENL-002_minimal_graph_example.json` | Minimal valid ENL graph. Full 4-layer chain: INTEL→SIG-41→SIG-40→EVID. All nodes share run_01_blueedge. |
| `docs/pios/enl/examples/ENL-002_minimal_graph_example.md` | Human-readable explanation of the minimal example. Node descriptions, derivation resolution, run-awareness, validation summary. |

### Validators

| File | Description |
|------|-------------|
| `scripts/enl/validate_enl_schema.py` | 33-check validator for schema file structure and cross-file consistency. |
| `scripts/enl/validate_enl_example.py` | 73-check validator for minimal example against v1 rules. |

### Contract Record

| File | Description |
|------|-------------|
| `docs/pios/contracts/enl/ENL-002-CONTRACT-v1.md` | This file. |

---

## Validation Results

### validate_enl_schema.py

```
Result: 33/33 checks passed
STATUS: PASS
```

Checks covered:
- Schema file presence (both JSON files, ENL-001, ENL-002)
- Node schema: schema_id, version, contract_ref, node_types, required_fields
- Node schema: derived_from constraints, status_values, layer mapping, v1_constraints
- Graph rules: schema_id, contract_ref, allowed_transitions
- Graph rules: forbidden_transitions (cross-layer + same-layer), terminal policy
- Graph rules: empty derived_from policy, run_awareness, fail_conditions, scope boundaries
- Cross-file: node_types match transition keys; both files share same contract_ref

### validate_enl_example.py

```
Result: 73/73 checks passed
STATUS: PASS
```

Checks covered:
- JSON load, graph-level fields (graph_id, run_id, nodes)
- Exactly 4 nodes, no duplicate node_ids
- All 8 required fields present on all 4 nodes, all non-empty
- Canonical node_type and valid status on all nodes
- run_id consistency: all nodes match graph run_id
- EVID has empty derived_from; all non-EVID have non-empty derived_from
- All derived_from references resolve to existing nodes
- All layer transitions are permitted (INTEL→SIG-41→SIG-40→EVID)
- run_id consistency across all linked node pairs
- All 4 layer types present in graph
- Graph terminates in EVID
- Full 4-layer chain traversable end-to-end
- source_ref non-empty on all nodes

---

## Contract Deviations

None.

All deliverables were created as specified. Validation passed without modification.

The ENL-001 filename contains a typo (`ENL-001_evidence_nagigation_system.md`
— "nagigation" instead of "navigation"). This is pre-existing in the repository.
The schema files reference it correctly by its actual filename. No correction
was made within this contract's scope.

---

## Definition of Done — Verified

| Criterion | Status |
|-----------|--------|
| ENL-002 schema standard documented | ✓ |
| Machine-readable schema artifacts created | ✓ |
| Minimal example created and validated | ✓ |
| Validation scripts created and runnable | ✓ |
| All deliverables aligned with ENL-001 | ✓ |
| Stream ready for next execution stage | ✓ |

---

## Final Status

**PASS**

ENL-002-CONTRACT-v1 complete.
33/33 schema checks · 73/73 example checks · 0 deviations.
