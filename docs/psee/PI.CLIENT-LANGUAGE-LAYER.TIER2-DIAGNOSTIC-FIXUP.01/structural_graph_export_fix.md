# Structural Graph Export Fix — BLOCK_B

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01  
**Date:** 2026-04-30

---

## Fix Applied

In `generate_tier2_reports()`, added `--output` flag to the `export_graph_state.mjs` subprocess call:

```python
graph_state_path = output_dir / "graph_state.json"
export_script = REPO_ROOT / "scripts" / "pios" / "export_graph_state.mjs"
try:
    subprocess.run(["node", str(export_script),
                    "--client", _ACTIVE_CLIENT,
                    "--run-id", _ACTIVE_VAULT_RUN_ID,
                    "--output", str(graph_state_path)], check=True)
```

`graph_state_path` is computed from `output_dir`, which is set from `--output-dir` CLI arg or the default `TIER2_REPORTS_DIR`. The export script receives the resolved absolute path and writes there.

---

## Result for FIXUP run

Export script log:
```
[export_graph_state] wrote 18 nodes, 17 links (458 ticks) →
  .../run_blueedge_productized_01_tier2_fixup/reports/tier2/graph_state.json
```

Generator read at same path → `graph_state` loaded successfully → visual graph renders in section 01C.

---

## Validation

| Check | Result |
|---|---|
| VF-02: graph_state.json in TARGET_RUN | PASS — file exists at reports/tier2/graph_state.json |
| VF-03: Visual graph renders | PASS — "STRUCTURAL GRAPH UNAVAILABLE" absent from report |
| VF-04: No "graph_state.json not found" fallback | PASS |
