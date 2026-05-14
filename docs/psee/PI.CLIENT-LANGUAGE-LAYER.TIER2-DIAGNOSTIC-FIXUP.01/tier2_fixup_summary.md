# Tier-2 Fixup Summary — BLOCK_H

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01  
**Date:** 2026-04-30

---

## Verdict: TIER2_FIXUP_COMPLETE

12/12 validation checks PASS. 0 FAIL. 0 PARTIAL.

---

## Why the graph was unavailable

`export_graph_state.mjs` was invoked without an `--output` flag. It wrote `graph_state.json` to the legacy default path (`clients/blueedge/reports/tier2/`). The generator looked for `graph_state.json` in the active `output_dir` — a different path when using `--output-dir`. File not found → fallback notice rendered.

## Whether the graph now renders

Yes. The export script now receives `--output <graph_state_path>` where `graph_state_path = output_dir / "graph_state.json"`. The file is written directly to the run's `reports/tier2/` directory. Section 01C renders the visual structural graph (18 nodes, 17 links).

## Whether DOMAIN-first zone labeling is restored

Yes. Zone inventory and zone detail now use the semantic domain business label as the primary display:

| Surface | Before | After |
|---|---|---|
| Zone card primary label | `backend_app_root` | `Platform Infrastructure and Data` |
| Zone card structural backing | `DOM backing: DOM-04` | `DOM backing: DOM-04 / backend_app_root` |
| Zone detail Section A | `backend_app_root domain: ...` | `Platform Infrastructure and Data domain: ...` |
| Zone detail scope label | `NO SEMANTIC CAPABILITY MAPPING AVAILABLE` | `Semantic domain: Platform Infrastructure and Data (STRONG · 0.78)` |

## Whether DOM is correctly shown only as backing

Yes. DOM-04 appears only in:
- "DOM backing: DOM-04 / backend_app_root" (zone inventory card)
- "Structural backing: DOM-04 / backend_app_root" (zone detail semantic context block)

It does not appear as a primary label or zone title.

## Whether remaining Tier-2 issues exist

None identified from this validation pass. All 12 contract checks PASS.

## Whether fixes are generic for future clients

Yes.
- Graph export fix is parameterized by `output_dir` — works for any client/run
- Zone label resolution uses `_resolve_dom_to_semantic_context()` which queries the loaded semantic topology model — no hardcoded labels
- `anchor_name` from the projection is used only as structural backing trace — not as primary display
- `scope_label` logic is conditional on data availability — degrades gracefully when neither capability nor semantic backing exists

---

## Report Location

```
clients/blueedge/psee/runs/run_blueedge_productized_01_tier2_fixup/reports/tier2/
  graph_state.json                                 (5 KB — 18 nodes, 17 links)
  lens_tier2_diagnostic_narrative.html             (68 KB, 775 lines)
  publish/lens_tier2_diagnostic_narrative_pub.html
```

---

## Validation Summary

| Check | Status |
|---|---|
| VF-01 Graph root cause documented | PASS |
| VF-02 graph_state.json in TARGET_RUN | PASS |
| VF-03 Structural graph renders visually | PASS |
| VF-04 No "graph_state.json not found" fallback | PASS |
| VF-05 Zone inventory primary = semantic label | PASS |
| VF-06 DOM shown as backing only | PASS |
| VF-07 Zone detail uses semantic label | PASS |
| VF-08 No backend_app_root as primary title | PASS |
| VF-09 Misleading capability msg removed | PASS |
| VF-10 No hardcoded client labels | PASS |
| VF-11 No vault/signal/binding mutation | PASS |
| VF-12 CREATE_ONLY output | PASS |
