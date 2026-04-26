# Governance Trace — STEP 14G-B Graph State Generation
## PI.SECOND-CLIENT.STEP14G-B.GRAPH-STATE-GENERATION.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14G-B.GRAPH-STATE-GENERATION.01
**Branch:** feature/next
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Patch Applied — lens_report_generator.py (3 sites)

### Site 1 — Module-level globals (after line 58 `TIER1_REPORTS_DIR`)

```python
_ACTIVE_CLIENT       = "blueedge"
_ACTIVE_VAULT_RUN_ID = "run_01_authoritative_generated"
```

### Site 2 — `_configure_runtime()` global declarations (after existing global block)

```python
global _ACTIVE_CLIENT, _ACTIVE_VAULT_RUN_ID

_ACTIVE_CLIENT = client
if client != "blueedge":
    _ACTIVE_VAULT_RUN_ID = run_id
```

BlueEdge guard: when `client == "blueedge"`, `_ACTIVE_VAULT_RUN_ID` retains module-level default
(`run_01_authoritative_generated`) — preserving BlueEdge vault path compatibility, since BlueEdge
package run_id (`run_authoritative_recomputed_01`) diverges from its vault run_id.

### Site 3 — `generate_tier2_reports()` subprocess call (line 3865)

```python
subprocess.run(["node", str(export_script),
                "--client", _ACTIVE_CLIENT,
                "--run-id", _ACTIVE_VAULT_RUN_ID], check=True)
```

---

## Graph State Generated

```
node scripts/pios/export_graph_state.mjs \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi
```

Output: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier2/graph_state.json`

```
[export_graph_state] wrote 18 nodes, 17 links (458 ticks)
```

---

## Validation Results

| Check | Detail | Result |
|---|---|---|
| V1: node count = 18 | got 18 | PASS |
| V2: link count = 17 | got 17 | PASS |
| V3: no legacy SIG-XXX node.id (`^SIG-\d+$` boundary regex) | found: [] | PASS |
| V4: ZONE-01 hub present | structural hub constant | PASS |
| V5: 5 PSIG signal nodes | PSIG-001, PSIG-002, PSIG-003, PSIG-004, PSIG-006 | PASS |
| V6: CLM nodes = CLM-20..CLM-24 | exact set confirmed | PASS |
| V7: 7 ART artifact nodes | ART-01..ART-07 | PASS |
| V8: run_id = run_01_oss_fastapi | top-level field in graph_state.json | PASS |
| **Total checks: 8** | | **PASS: 8 / FAIL: 0** |

V3 note: validation uses `^SIG-\d+$` regex against each `node.id` value — not substring/plain-text
search. This prevents false positives where `"SIG-001"` would match within `"PSIG-001"`. ZONE-01
is the structural hub constant (`export_graph_state.mjs` line 84), not a legacy BlueEdge identifier.

---

## Determinism Verification

Run 1 SHA-256: `510fec4ba04a4de5a7429db38fa8ecb5b458c097d3691886e88606ff785c62fd`
Run 2 SHA-256: `510fec4ba04a4de5a7429db38fa8ecb5b458c097d3691886e88606ff785c62fd`

Result: **MATCH — deterministic**

---

## Files Modified / Created

| File | Action |
|---|---|
| `scripts/pios/lens_report_generator.py` | Modified — 3 patch sites (module globals, `_configure_runtime()`, subprocess call) |
| `clients/e65d2f0a.../reports/tier2/graph_state.json` | Created — 18 nodes, 17 links, 458 ticks (gitignored; force-added) |
| `docs/programs/second-client-kill-plan-01/decisions/step14g_b_graph_state_generation.md` | Created — this governance trace |

## Files NOT Modified

- `scripts/pios/export_graph_state.mjs`: unchanged
- `scripts/pios/vault_export.py`: unchanged
- `app/gauge-product/public/vault/e65d2f0a.../run_01_oss_fastapi/vault_index.json`: unchanged
- All BlueEdge client files: unchanged

---

## Regression Confirmation

- BlueEdge subprocess behavior: `_ACTIVE_CLIENT = "blueedge"` (module default) → `_ACTIVE_VAULT_RUN_ID`
  remains `"run_01_authoritative_generated"` (module default) — BlueEdge guard preserves vault path
- `_configure_runtime()` called with `client="blueedge"` → `_ACTIVE_VAULT_RUN_ID` not overwritten
- No BlueEdge vault or report files modified

---

## Governance Confirmation

- No interpretation created, inferred, or synthesized
- No 75.x or 41.x artifacts modified
- No vault claims or vault_index.json modified
- Patch confined to `lens_report_generator.py` subprocess call and supporting globals
- Graph content derived solely from `vault_index.json` via `export_graph_state.mjs`
- Stream: PI.SECOND-CLIENT.STEP14G-B.GRAPH-STATE-GENERATION.01
