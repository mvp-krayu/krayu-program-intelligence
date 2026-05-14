# STEP 5 — Graph Export Path Parameterization

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 5
**Date:** 2026-04-24
**Branch:** feature/second-client-kill-plan-01
**Baseline commit:** 19f6052

---

## Scope

File modified:

- `scripts/pios/export_graph_state.mjs`

Not modified:
- `app/gauge-product/` — per contract strict rule
- `scripts/pios/tier2_data.py` — not in scope
- `scripts/pios/tier2_query_engine.py` — not in scope

---

## Changes Applied

### 1 — Header docstring updated

Output path reference changed from:
```
clients/blueedge/reports/tier2/graph_state.json
```
to:
```
clients/<client>/reports/tier2/graph_state.json
```

### 2 — Usage comment updated

From:
```
 * Usage: node scripts/pios/export_graph_state.mjs
```
To:
```
 * Usage:
 *   node scripts/pios/export_graph_state.mjs
 *   node scripts/pios/export_graph_state.mjs --client <id> --run-id <run_id>
 *   node scripts/pios/export_graph_state.mjs --client <id> --run-id <run_id> --output <path>
```

### 3 — CLI arg parsing block added

Inserted before `VAULT_INDEX_PATH` declaration. Manual `process.argv.slice(2)` loop — no new dependencies:

```js
const argv = process.argv.slice(2);
let _client         = "blueedge";
let _runId          = "run_01_authoritative_generated";
let _outputOverride = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--client" && argv[i + 1]) _client         = argv[i + 1];
  if (argv[i] === "--run-id" && argv[i + 1]) _runId          = argv[i + 1];
  if (argv[i] === "--output" && argv[i + 1]) _outputOverride = argv[i + 1];
}
```

BlueEdge defaults preserved — invocation with no args behaves identically to pre-change.

### 4 — VAULT_INDEX_PATH parameterized

Before:
```js
const VAULT_INDEX_PATH = join(
  REPO_ROOT, "app", "gauge-product", "public", "vault",
  "blueedge", "run_01_authoritative_generated", "vault_index.json"
);
```

After:
```js
const VAULT_INDEX_PATH = join(
  REPO_ROOT, "app", "gauge-product", "public", "vault",
  _client, _runId, "vault_index.json"
);
```

### 5 — OUTPUT_PATH parameterized with optional override

Before:
```js
const OUTPUT_PATH = join(
  REPO_ROOT, "clients", "blueedge", "reports", "tier2", "graph_state.json"
);
```

After:
```js
const OUTPUT_PATH = _outputOverride
  ? resolve(_outputOverride)
  : join(REPO_ROOT, "clients", _client, "reports", "tier2", "graph_state.json");
```

`resolve()` was already imported at line 18; no new imports required.

---

## What Was NOT Changed

### Graph shaping logic — UNCHANGED

- `registerNode()` / `registerLink()` functions — unchanged
- Node/link construction loop over `vaultIndex.signals` and `vaultIndex.artifacts` — unchanged
- `graphState` assembly — unchanged
- `vaultIndex.run_id` read-back in output (`run_id: vaultIndex.run_id`) — unchanged

### HUB_ID — UNCHANGED

`const HUB_ID = "ZONE-01"` — untouched, confirmed at line 84 post-edit.

### Visual constants — UNCHANGED

`NODE_R`, `NODE_COL`, `LINK_COL`, `LINK_W`, `CHARGE_STR`, `LINK_DIST`, `ALPHA_DECAY`, `VEL_DECAY`, `CANVAS_WIDTH`, `CANVAS_HEIGHT` — all untouched.

### Simulation logic — UNCHANGED

`forceSimulation`, tick loop, centroid offset computation — all untouched.

---

## Assumptions Removed

1. `VAULT_INDEX_PATH` hardcoded to `app/gauge-product/public/vault/blueedge/run_01_authoritative_generated/vault_index.json`
2. `OUTPUT_PATH` hardcoded to `clients/blueedge/reports/tier2/graph_state.json`
3. Script invocable only for BlueEdge (no client/run-id args existed)

---

## Validation Results

| Check | Result |
|-------|--------|
| `git diff --name-only` → only `export_graph_state.mjs` | PASS |
| `grep "clients/blueedge"` → empty | PASS |
| `grep "run_01_authoritative_generated"` → line 36 only (default variable value) | PASS |
| `grep "process.argv"` → line 34 | PASS |
| `grep "HUB_ID"` → lines 84, 101, 105, 114 (unchanged) | PASS |
| `git status --short` → `M scripts/pios/export_graph_state.mjs` only | PASS |

---

## STEP 5 Status

**COMPLETE**
