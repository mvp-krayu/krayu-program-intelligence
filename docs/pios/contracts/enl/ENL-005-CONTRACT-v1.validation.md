# ENL-005-CONTRACT-v1.validation
## Validation Evidence Record — Persona Projection Rules

---

## Validation Metadata

| Field       | Value                              |
|-------------|-----------------------------------|
| Contract ID | ENL-005-CONTRACT-v1                |
| Stream      | ENL-005 — Persona Projection Rules |
| Run         | run_01_blueedge                    |
| Date        | 2026-03-21                         |
| Validator   | `scripts/pios/enl/test_lens_persona.py` |
| Result      | 89/89 PASS                         |

---

## Test Suite Result

```
scripts/pios/enl/test_lens_persona.py
============================================================
Result: 89/89 checks passed
STATUS: PASS
```

---

## Acceptance Criteria — Evidence Mapping

Each acceptance criterion from ENL-005-CONTRACT-v1 is mapped to the
tests that directly demonstrate its satisfaction.

---

### Criterion 1
**Projected views preserve original view structure and data**

| Test | Description |
|------|-------------|
| P-10 | Original status field preserved in upstream view |
| P-11 | Original terminates_in_evid preserved |
| P-12 | Chain list reference identical to original |
| P-13 | entry_node reference identical to original |
| P-40 | Query view status preserved |
| P-41 | Query view query_id preserved |
| P-42 | Query view subgraph reference identical |
| P-43 | Query view seed_nodes reference identical |
| P-44 | Query view count field preserved |
| P-48 | Node view node reference identical |
| P-49 | Node view upstream_available preserved |
| P-50 | Node view downstream_available preserved |
| P-51 | Node view status preserved |

---

### Criterion 2
**ENL node dicts unchanged — deep equality before and after**

| Test | Description |
|------|-------------|
| P-14 | Original upstream view unchanged (deep equality) |
| P-15 | Original query view unchanged (deep equality) |
| P-16 | Original node view unchanged (deep equality) |
| P-17 | Original full graph view unchanged (deep equality) |
| P-18 (×9) | Every node dict in chain, subgraph, and node view equals its original |
| P-19 (×4) | No extra keys injected into any chain node dict |
| P-66 | ENL graph dict unchanged after all projection calls |

---

### Criterion 3
**Node count identical before and after projection**

| Test | Description |
|------|-------------|
| P-20 | chain count unchanged for upstream view |
| P-21 | subgraph count unchanged for query view |
| P-22 | count field unchanged for query view |
| P-23 | seed_nodes count unchanged for query view |

---

### Criterion 4
**Collapsed nodes still present in chain / subgraph**

| Test | Description |
|------|-------------|
| P-24 | SIG-40 and EVID node types still present in chain after visibility projection |
| P-25 (×4) | visible: false for collapsed types; visible: true for non-collapsed |
| P-35 | SIG41 node with confidence_flag "low" still present in chain |

---

### Criterion 5
**All persona effects are display-only; no ENL data altered**

| Test | Description |
|------|-------------|
| P-18 (×9) | Node field values identical to originals in ENL graph |
| P-19 (×4) | No extra fields injected into ENL node dicts |
| P-26 | Label prefix applied in display label, not in node title |
| P-27 | Original node title unchanged in ENL node dict after label projection |
| P-31 | confidence_flag "low" set in node_display, not in ENL status field |
| P-66 | Graph dict unchanged throughout |

---

### Criterion 6
**Label mapping correctness**

| Test | Description |
|------|-------------|
| P-26 | INTEL label = "Finding: <original title>" |
| P-27 | Original node title unchanged in ENL dict |
| P-28 | SIG-41 label = "Signal: <original title>" |
| P-29 (×4) | Absent label_map → display label equals original title |

---

### Criterion 7
**Confidence flags applied without filtering**

| Test | Description |
|------|-------------|
| P-31 | SIG41-SIG003-001 (score 0.6, threshold 0.7) → confidence_flag: "low" |
| P-32 | INTEL-GQ003-001 (score 0.95, threshold 0.7) → confidence_flag: "normal" |
| P-33 | SIG40 (no score) → confidence_flag: "normal" |
| P-34 | EVID (no score) → confidence_flag: "normal" |
| P-35 | Node with confidence_flag "low" still present in chain |
| P-36 (×4) | No threshold configured → all confidence_flag: "normal" |

---

### Criterion 8
**Deterministic output**

| Test | Description |
|------|-------------|
| P-58 | project_upstream_view: identical result on repeated call |
| P-59 | project_query_view: identical result on repeated call |
| P-60 | project_node_view: identical result on repeated call |

---

### Criterion 9
**No hidden filtering or mutation**

| Test | Description |
|------|-------------|
| P-02 | Empty persona_config → original view returned unchanged |
| P-03 | Empty persona_id → original view returned unchanged |
| P-04 | Returns new dict (not same object as original) |
| P-14–P-17 | Original views deep-equal before and after |
| P-24 | Collapsed nodes not removed |
| P-35 | Low-confidence nodes not removed |

---

### Criterion 10
**Invalid persona_config raises LensPersonaError before projection**

| Test | Description |
|------|-------------|
| P-61 | Non-dict config raises LensPersonaError |
| P-62 | Empty persona_id raises LensPersonaError |
| P-63 | Invalid visibility_rules value raises LensPersonaError |
| P-64 | confidence_threshold > 1.0 raises LensPersonaError |
| P-65 | node_confidence score > 1.0 raises LensPersonaError |

---

### Criterion 11
**apply_persona dispatches correctly by view type**

| Test | Description |
|------|-------------|
| P-52 | Dispatches upstream view to project_upstream_view |
| P-53 | Dispatches query view to project_query_view |
| P-54 | Dispatches node view to project_node_view |
| P-55 | Dispatches full graph view |
| P-56 | apply_persona output matches project_upstream_view output |
| P-57 | apply_persona output matches project_query_view output |

---

### Criterion 12
**ENL-002A Section F compliance**

| ENL-002A F Permitted | Evidence |
|---------------------|----------|
| Layer emphasis | P-30 (×4): highlight correctly set by layer_emphasis |
| Label relabelling | P-26, P-28: prefix applied to display label; P-27: ENL title unchanged |
| Confidence thresholding (display filter) | P-31–P-35: flags applied; nodes retained |

| ENL-002A F Forbidden | Evidence |
|---------------------|----------|
| No node_type/node_id/run_id/status/source_ref/derived_from/created_at altered | P-18 (×9), P-19 (×4) |
| No navigation shortcuts | lens_persona_v1.py makes no engine or binding calls |
| No synthetic EVID termination | terminates_in_evid sourced from binding layer; persona cannot set it |
| No synthesised intelligence | node_confidence is the only external input; used for display flag only |

---

## File Existence Verification

All required artifacts confirmed present at close:

| File | Exists |
|------|--------|
| `scripts/pios/enl/lens_persona_v1.py` | ✓ |
| `scripts/pios/enl/test_lens_persona.py` | ✓ |
| `docs/pios/enl/ENL-005_persona_model.md` | ✓ |
| `docs/pios/enl/ENL-005_persona_projection_rules.md` | ✓ |
| `docs/pios/contracts/enl/ENL-005-CONTRACT-v1.md` | ✓ |
| `docs/pios/contracts/enl/ENL-005-CONTRACT-v1.validation.md` | ✓ |
| `docs/pios/contracts/enl/ENL-005-CONTRACT-v1.close.md` | ✓ |

---

## Validation Conclusion

All 12 acceptance criteria satisfied. All 89 tests pass.
No criterion is partially met or deferred.

**ENL-005-CONTRACT-v1 validation: PASS**
