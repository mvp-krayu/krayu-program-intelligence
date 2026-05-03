# DOM Layer Path Contract
## PI.LENS.REAL-E2E-PIPELINE.BLOCKER-08-CLOSURE.01

**Date:** 2026-05-03
**Client:** blueedge
**Source:** source_01
**Run:** run_blueedge_e2e_execute_01

---

## Blocker Origin

`dom_layer_generator.py::update_manifest()` called `fail_closed()` when
`source_manifest.json` already contained a `dom_layer_path` field pointing to a
legacy/reference path from the FastAPI conformance pipeline:

```
existing: docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json
expected: clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/dom/dom_layer.json
```

This caused Stage 05 to exit 1 and cascade all downstream stages to NOT_ATTEMPTED.

---

## Resolution

`update_manifest()` changed from fail_closed to log-and-skip on conflict:

| Condition | Old Behavior | New Behavior |
|-----------|-------------|--------------|
| `dom_layer_path` absent | Write field | Write field (unchanged) |
| `dom_layer_path` == run-path | Skip (already correct) | Skip (unchanged) |
| `dom_layer_path` != run-path | FAIL-CLOSED | Log [LEGACY], return without modifying |

The run-specific DOM layer artifact is still written to the run path. The manifest
field is not updated — it retains the legacy reference path. The run proceeds using
its own `run_dir/dom/dom_layer.json`.

---

## Contract Authority

- Rule: Manifest update adds `dom_layer_path` only if field is absent
- Rule: If field exists with conflicting value → treat as legacy reference metadata → skip manifest update → do not fail run-specific execution
- Reference: PI.LENS.REAL-E2E-PIPELINE.BLOCKER-08-CLOSURE.01
