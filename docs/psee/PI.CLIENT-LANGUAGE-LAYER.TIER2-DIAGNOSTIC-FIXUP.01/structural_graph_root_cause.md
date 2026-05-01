# Structural Graph Root Cause Analysis — BLOCK_A

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01  
**Date:** 2026-04-30

---

## Problem

Section 01C (Structural Evidence Topology) rendered:
> "STRUCTURAL GRAPH UNAVAILABLE — graph_state.json not found for this run. Export positions via export_graph_state.mjs before generating this report."

---

## Root Cause

**The generator and the export script were using different output paths.**

### Export script behavior

`scripts/pios/export_graph_state.mjs` writes `graph_state.json` to one of two paths depending on whether `--output` is passed:

```
--output <path>   → writes to the specified path
(no --output)     → writes to: clients/<client>/reports/tier2/graph_state.json  (legacy default)
```

### Generator invocation (before fix)

```python
subprocess.run(["node", str(export_script),
                "--client", _ACTIVE_CLIENT,
                "--run-id", _ACTIVE_VAULT_RUN_ID], check=True)  # no --output flag
```

The `--output` flag was NOT passed. The export script therefore wrote to the **legacy default path**:
```
clients/blueedge/reports/tier2/graph_state.json
```

### Generator read path

```python
graph_state_path = output_dir / "graph_state.json"
```

For the REFINEMENT run with `--output-dir clients/blueedge/psee/runs/run_blueedge_productized_01_tier2_refined/reports/tier2`, the generator expected:
```
clients/blueedge/psee/runs/run_blueedge_productized_01_tier2_refined/reports/tier2/graph_state.json
```

### Result

- Export wrote to: `clients/blueedge/reports/tier2/graph_state.json`
- Generator looked for: `clients/blueedge/psee/runs/.../tier2/graph_state.json`
- File not found → `graph_state = None` → fallback notice rendered

### Misleading log line

The generator printed:
```
[LENS REPORT] Generated: .../run_blueedge_productized_01_tier2_refined/reports/tier2/graph_state.json
```

This was printed BEFORE the path existence check — the print statement on success of the subprocess, not success of the file write. The actual file did not exist at that path.

---

## Fix

Pass `--output <graph_state_path>` to the export script invocation:

```python
subprocess.run(["node", str(export_script),
                "--client", _ACTIVE_CLIENT,
                "--run-id", _ACTIVE_VAULT_RUN_ID,
                "--output", str(graph_state_path)], check=True)
```

`graph_state_path = output_dir / "graph_state.json"` — so the export script now writes directly to the correct TARGET_RUN path.

---

## Generic Applicability

This fix is generic. For any client or run:
- `output_dir` = whatever `--output-dir` is passed (or the default `TIER2_REPORTS_DIR`)
- `graph_state_path = output_dir / "graph_state.json"`
- Export script is told to write there via `--output`

No hardcoded client or run paths. The default path (`clients/<client>/reports/tier2/`) is no longer written to unless `output_dir` happens to equal that path.

---

## Verification

- REFINEMENT run: graph_state wrote to legacy path, generator found nothing → fallback notice
- FIXUP run: graph_state wrote to `run_blueedge_productized_01_tier2_fixup/reports/tier2/graph_state.json` → graph renders
