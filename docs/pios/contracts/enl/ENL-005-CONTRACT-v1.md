# ENL-005-CONTRACT-v1
## Persona Projection Rules · run_01_blueedge

---

## Contract Metadata

| Field       | Value                                  |
|-------------|---------------------------------------|
| Contract ID | ENL-005-CONTRACT-v1                    |
| Stream      | ENL-005 — Persona Projection Rules     |
| Run         | run_01_blueedge                        |
| Date        | 2026-03-21                             |
| Status      | PASS                                   |

---

## Execution Summary

ENL-005-CONTRACT-v1 executed in full. All five required deliverables
created. 89/89 tests passed. No deviations.

The persona projection layer adds display-only metadata to Lens view
structures without mutating ENL node fields, altering graph composition,
or touching traversal paths. ENL-002A Section F compliance is
structurally enforced — projection operates on view copies, ENL node
dicts are never written to, and no nodes are removed under any persona
configuration.

---

## Files Created

| File | Description |
|------|-------------|
| `scripts/pios/enl/lens_persona_v1.py` | Persona projection module: `apply_persona`, `project_upstream_view`, `project_query_view`, `project_node_view`. Includes `_validate_persona_config` and `_project_node_display`. |
| `scripts/pios/enl/test_lens_persona.py` | 89-test suite covering all projection functions, all four view types, all projection rules, immutability, determinism, node count integrity, and invalid config rejection. |
| `docs/pios/enl/ENL-005_persona_model.md` | Persona configuration model: field definitions, types, constraints, invariants, and three reference persona examples. |
| `docs/pios/enl/ENL-005_persona_projection_rules.md` | Projection rules document: rules A–D, view-type coverage, data vs display separation, ENL-002A F compliance, annotated example. |
| `docs/pios/contracts/enl/ENL-005-CONTRACT-v1.md` | This file. |

---

## Validation Results

```
Result: 89/89 checks passed
STATUS: PASS
```

Test coverage:
- `apply_persona`: empty config returns original view unchanged; empty
  persona_id returns view unchanged; dispatches correctly to all 4 view
  types; output matches direct projection function output
- `project_upstream_view`: new dict returned; persona block present;
  node_display covers all chain nodes; all original fields preserved;
  chain and entry_node references unchanged
- `project_query_view`: new dict returned; subgraph/seed_nodes/count/
  query_id/status preserved; all references unchanged
- `project_node_view`: new dict; node reference preserved; availability
  flags preserved; node_display present
- Original view immutability: all 4 view types unchanged after projection
  (deep equality)
- ENL node field integrity: node dicts identical to originals in chain,
  subgraph, and node view; no extra keys injected
- Node count: chain count, subgraph count, seed_nodes count, count field
  all identical before/after projection
- Collapsed nodes (SIG-40, EVID) still present in chain with visible: false
- Label mapping: INTEL and SIG-41 label prefixes applied; original title
  unchanged in node dict; absent label_map uses original title
- Layer emphasis: highlight: true for INTEL; false for all other types
- Confidence flags: SIG41 (0.6 < 0.7) → "low"; INTEL (0.95) → "normal";
  nodes with no score → "normal"; no threshold → all "normal"
- Low confidence_flag node still present in chain
- Determinism: all 3 projection functions verified
- Invalid persona_config: 5 error cases raise LensPersonaError
- ENL graph unchanged after all projection calls

---

## Persona Configuration Fields Delivered

| Field | Effect |
|-------|--------|
| `persona_id` | Required. Identifies the persona in the projection output. |
| `label_map` | Optional. Maps node_type → display prefix. Applied in label field only. |
| `layer_emphasis` | Optional. List of node_types to highlight. Sets highlight: true\|false. |
| `visibility_rules` | Optional. Maps node_type → "collapsed"\|"visible". Sets visible: true\|false. |
| `confidence_threshold` | Optional. Float [0.0–1.0]. Threshold for confidence_flag computation. |
| `node_confidence` | Optional. Map of node_id → float. Confidence scores for specific nodes. |

---

## Projection Rules Delivered

| Rule | Effect | ENL data mutated |
|------|--------|-----------------|
| A — Label projection | display label = prefix + title \| title | No |
| B — Layer emphasis | highlight: true for emphasized types | No |
| C — Visibility | visible: false for collapsed types; node remains in view | No |
| D — Confidence projection | confidence_flag: "low"\|"normal"; flagged nodes retained | No |

---

## Contract Deviations

None.

---

## Definition of Done — Verified

| Criterion | Status |
|-----------|--------|
| Persona projection isolated from ENL engine and binding layer | ✓ |
| Rendering enhancements without data mutation | ✓ |
| ENL-002A persona boundary respected | ✓ |
| Output usable by Lens UI layer | ✓ |
| 89/89 tests pass | ✓ |

---

## Final Status

**PASS**

ENL-005-CONTRACT-v1 complete.
89/89 tests · 0 deviations · target repository krayu-program-intelligence.
