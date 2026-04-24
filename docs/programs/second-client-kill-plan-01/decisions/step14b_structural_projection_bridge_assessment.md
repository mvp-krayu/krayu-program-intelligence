# STEP 14B — Structural Projection Bridge Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 14B
**Date:** 2026-04-25
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Bridge assessment complete. All required fields derivable from existing artifacts. No data invention required. Two discrete deliverables identified: vault_index.json creation + subprocess fix. UI re-enable requires separate step.

---

## 4-BRAIN Assessment

### CANONICAL

**Source topology artifact:**
`clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi/package/canonical_topology.json`

- Present: YES
- `emission_run_id`: `run_01_oss_fastapi`
- Counts: 5 domains / 30 capabilities / 10 components / 45 total nodes
- Derivation: from `binding_envelope.json` (BINDING_ENVELOPE_DERIVATION — no 17/42/89 parity guard)

**vault_index.json derivability:**
All required fields for `export_graph_state.mjs` are derivable from existing artifacts. No data invention required. See Derivation Map below.

**Signal state:**
Second client has no signal instrumentation. `signals` field in vault_index.json = `{}`. This is a correct canonical representation — not a defect.

---

### CODE

**Exactly what export_graph_state.mjs reads from vault_index.json (confirmed from source):**

| Field | Line | Used for |
|-------|------|---------|
| `run_id` | 174 | Written into graph_state output |
| `signals` | 103 | Registers SIG-* and CLAIM nodes, ZONE_SIGNAL + SIGNAL_CLAIM links |
| `artifacts` | 112 | Registers ART-* nodes, ZONE_ARTIFACT links |

**Fields NOT read by export_graph_state.mjs:** `client_id`, `export_status`, `exported_at`, `base_url`, `claims`, `entities`, `transformations`, `navigation`, `domain_routing`, `zone_routing`

These fields are consumed by other systems (browser VaultGraph.js, static vault navigation) but are irrelevant to graph_state generation.

---

**Exact subprocess defect (GAP-CODE-01):**

File: `scripts/pios/lens_report_generator.py`
Line: 3728

```python
# CURRENT (broken):
subprocess.run(["node", str(export_script)], check=True)
```

No `--client` or `--run-id` arguments passed. `export_graph_state.mjs` defaults to `_client = "blueedge"` and `_runId = "run_01_authoritative_generated"`. Result: always writes BlueEdge graph_state, regardless of `--client` arg passed to report generator.

**Root cause:** `_configure_runtime()` stores client/run_id as derived path globals (`CANONICAL_PKG_DIR`, `REPORTS_DIR`, etc.) but does NOT store raw `client` and `run_id` strings as module globals. The subprocess call has no access to the configured client/run_id.

---

**Exact code change required:**

**Change 1 — Add module-level defaults (after line 57, before `_default_output_path()`):**

```python
# Configured client identity — set by _configure_runtime()
_CONFIGURED_CLIENT: str = "blueedge"
_CONFIGURED_RUN_ID: str = "run_authoritative_recomputed_01"
```

**Change 2 — Extend global declaration in `_configure_runtime()` at line 86:**

```python
# BEFORE:
global LENS_CLAIMS, API_BASE, FRAGMENTS_DIR, REPORTS_DIR, CANONICAL_PKG_DIR
global TIER1_REPORTS_DIR, TIER2_REPORTS_DIR

# AFTER:
global LENS_CLAIMS, API_BASE, FRAGMENTS_DIR, REPORTS_DIR, CANONICAL_PKG_DIR
global TIER1_REPORTS_DIR, TIER2_REPORTS_DIR, _CONFIGURED_CLIENT, _CONFIGURED_RUN_ID
```

**Change 3 — Store client/run_id after `API_BASE` assignment in `_configure_runtime()` (after line 92):**

```python
_CONFIGURED_CLIENT = client
_CONFIGURED_RUN_ID = run_id
```

**Change 4 — Fix subprocess call at line 3728:**

```python
# BEFORE:
subprocess.run(["node", str(export_script)], check=True)

# AFTER:
subprocess.run([
    "node", str(export_script),
    "--client", _CONFIGURED_CLIENT,
    "--run-id", _CONFIGURED_RUN_ID,
], check=True)
```

Total change: +6 lines. No architectural changes. No new functions. BlueEdge default path preserved (defaults produce same BlueEdge invocation as before).

---

**Exact graph_state output path:**

Default (no `--output-dir` override to report generator):
```
clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/reports/tier2/graph_state.json
```

This path is:
- Covered by `clients/*/reports/` in `.gitignore` — will not be tracked
- Read by Python at line 3734: `graph_state_path = output_dir / "graph_state.json"` where `output_dir = TIER2_REPORTS_DIR` — path is consistent after fix

For isolated testing (safe output without creating reports dir):
```
--output /tmp/second_client_graph_state.json
```

---

### PRODUCT

**Minimum graph_state to re-enable ConnectedSystemView / SystemIntelligenceOverview in LENS report:**

| Node type | Count | Source |
|-----------|-------|--------|
| ZONE (hub) | 1 | Fixed: `ZONE-01` |
| SIGNAL | 0 | No signals for second client |
| CLAIM | 0 | No signal-linked claims |
| ARTIFACT | 7 | ART-01 through ART-07 |
| **Total** | **8** | |

| Link type | Count |
|-----------|-------|
| ZONE_SIGNAL | 0 |
| SIGNAL_CLAIM | 0 |
| ZONE_ARTIFACT | 7 |
| **Total** | **7** |

This is structurally valid and honest. It represents the second-client surface accurately: no signals, 7 artifacts radiating from hub. Much smaller than BlueEdge's 88 nodes/62 links — but correct.

**Can ConnectedSystemView / SystemIntelligenceOverview be re-enabled immediately after graph_state exists?**

**NO — requires separate step.**

Reasons:
1. These components were suppressed with `{null}` in `lens.js` STEP 13C because they contained "client-specific content not available" — potentially hardcoded BlueEdge topology/signal narrative
2. graph_state.json is consumed by the **report generator's tier2 diagnostic narrative** (`_build_tier2_diagnostic_narrative()`) — not directly by the LENS page React components
3. Unsuppressing these components requires inspecting their source, verifying they are parametric (not hardcoded), and confirming second-client payloads are sufficient
4. This inspection is not authorized in this step

**Explicit boundary:** graph_state enables **report generator tier2** output (diagnostic narrative HTML with topology graph). It does NOT automatically unlock the LENS page sections. Those require a separate contract.

---

### PUBLISH

**Confirmed safe:**
- graph_state for second client will show: ZONE-01 hub + 7 ART nodes, no SIG nodes
- This is an accurate structural representation — not a BlueEdge projection
- Report generator tier2 narrative will render second-client counts (5/30/10) from canonical_topology.json
- No signal language will appear (no SIG nodes in graph, no CLM-20 fragment)
- CLM-25 verdict remains gated (GAP_01_RESOLVED = False — unchanged)

**Confirmed forbidden:**
- No signal activation — `signals: {}` in vault_index.json
- No CLM-25 executive verdict activation
- No BlueEdge topology counts in second-client surface

---

## Required vault_index.json Schema

**Full schema (matches BlueEdge structure, all fields populated):**

```json
{
  "client_id": "e65d2f0a-dfa7-4257-9333-fcbb583f0880",
  "run_id": "run_01_oss_fastapi",
  "export_status": "EXPORTED",
  "exported_at": "<ISO timestamp at creation>",
  "base_url": "/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi",
  "signals": {},
  "claims": {
    "CLM-01": "claims/CLM-01.html",
    "CLM-02": "claims/CLM-02.html",
    "CLM-03": "claims/CLM-03.html",
    "CLM-04": "claims/CLM-04.html",
    "CLM-05": "claims/CLM-05.html",
    "CLM-06": "claims/CLM-06.html",
    "CLM-07": "claims/CLM-07.html",
    "CLM-08": "claims/CLM-08.html",
    "CLM-09": "claims/CLM-09.html",
    "CLM-10": "claims/CLM-10.html",
    "CLM-11": "claims/CLM-11.html",
    "CLM-12": "claims/CLM-12.html",
    "CLM-13": "claims/CLM-13.html",
    "CLM-14": "claims/CLM-14.html",
    "CLM-15": "claims/CLM-15.html",
    "CLM-16": "claims/CLM-16.html",
    "CLM-17": "claims/CLM-17.html",
    "CLM-18": "claims/CLM-18.html",
    "CLM-19": "claims/CLM-19.html",
    "CLM-20": "claims/CLM-20.html",
    "CLM-21": "claims/CLM-21.html",
    "CLM-22": "claims/CLM-22.html",
    "CLM-23": "claims/CLM-23.html",
    "CLM-24": "claims/CLM-24.html",
    "CLM-25": "claims/CLM-25.html",
    "CLM-26": "claims/CLM-26.html",
    "CLM-27": "claims/CLM-27.html"
  },
  "artifacts": {
    "ART-01": "artifacts/ART-01.html",
    "ART-02": "artifacts/ART-02.html",
    "ART-03": "artifacts/ART-03.html",
    "ART-04": "artifacts/ART-04.html",
    "ART-05": "artifacts/ART-05.html",
    "ART-06": "artifacts/ART-06.html",
    "ART-07": "artifacts/ART-07.html"
  },
  "entities": {
    "ENT-dimensions": "entities/ENT-dimensions.html",
    "ENT-score-components": "entities/ENT-score-components.html",
    "ENT-signals": "entities/ENT-signals.html",
    "ENT-structural-units": "entities/ENT-structural-units.html",
    "ENT-topology-nodes": "entities/ENT-topology-nodes.html"
  },
  "transformations": {
    "TRN-01": "transformations/TRN-01.html",
    "TRN-02": "transformations/TRN-02.html",
    "TRN-03": "transformations/TRN-03.html",
    "TRN-04": "transformations/TRN-04.html",
    "TRN-05": "transformations/TRN-05.html",
    "TRN-06": "transformations/TRN-06.html"
  },
  "navigation": {
    "NAV-core-artifacts": "navigation/NAV-core-artifacts.html",
    "NAV-top-claims": "navigation/NAV-top-claims.html",
    "NAV-value-creation-path": "navigation/NAV-value-creation-path.html"
  },
  "domain_routing": {
    "rule": "all domain IDs route to topology entity — no per-domain vault nodes",
    "fallback": "entities/ENT-topology-nodes.html"
  },
  "zone_routing": {
    "rule": "zone IDs not individually vaulted — route to topology entity node",
    "fallback": "entities/ENT-topology-nodes.html"
  }
}
```

**Placement:**
```
app/gauge-product/public/vault/e65d2f0a-dfa7-4257-9333-fcbb583f0880/run_01_oss_fastapi/vault_index.json
```

---

## Derivation Map

| vault_index.json field | Derivation source | Value |
|------------------------|-------------------|-------|
| `client_id` | CLI parameter / config | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `run_id` | `canonical_topology.json.emission_run_id` | `run_01_oss_fastapi` |
| `export_status` | Schema constant | `EXPORTED` |
| `exported_at` | Timestamp at creation | ISO 8601 |
| `base_url` | Pattern: `/vault/<client_id>/<run_id>` | `/vault/e65d2f.../<run_id>` |
| `signals` | `signal_registry.json` (no active signals) | `{}` |
| `claims` | Standard CLM-01 through CLM-27 path schema | Same as BlueEdge pattern |
| `artifacts` | Standard ART-01 through ART-07 schema | Same as BlueEdge pattern |
| `entities` | Standard ENT-* schema | Same as BlueEdge pattern |
| `transformations` | Standard TRN-01 through TRN-06 schema | Same as BlueEdge pattern |
| `navigation` | Standard NAV-* schema | Same as BlueEdge pattern |
| `domain_routing` | Schema constant (no per-domain vault nodes) | Same as BlueEdge |
| `zone_routing` | Schema constant (zones not individually vaulted) | Same as BlueEdge |

**No data invented.** All values are derivable from existing artifacts or schema constants.

The only value that could be contested: `signals: {}`. This is derived from `signal_registry.json` for run_01_oss_fastapi which contains no active signals. This is a correct representation — not a suppression or workaround.

---

## Code Changes Required

### Change set (4 edits to `scripts/pios/lens_report_generator.py`)

**Edit 1** — Add module-level defaults (insert after line 57, before line 60):
```python
_CONFIGURED_CLIENT: str = "blueedge"
_CONFIGURED_RUN_ID: str = "run_authoritative_recomputed_01"
```

**Edit 2** — Extend global declaration (line 86, add to second global line):
```python
global TIER1_REPORTS_DIR, TIER2_REPORTS_DIR, _CONFIGURED_CLIENT, _CONFIGURED_RUN_ID
```

**Edit 3** — Store client/run_id in `_configure_runtime()` (insert after line 92, `API_BASE = api_base`):
```python
_CONFIGURED_CLIENT = client
_CONFIGURED_RUN_ID = run_id
```

**Edit 4** — Fix subprocess invocation (replace line 3728):
```python
subprocess.run([
    "node", str(export_script),
    "--client", _CONFIGURED_CLIENT,
    "--run-id", _CONFIGURED_RUN_ID,
], check=True)
```

**Net change:** +6 lines. No functions added. No logic changed. BlueEdge default invocation preserved.

### What does NOT need changing

- `export_graph_state.mjs` — already supports `--client` and `--run-id` (lines 38-41)
- `graph_state_path` read in Python (line 3734) — consistent with TIER2_REPORTS_DIR after fix
- `_configure_runtime()` path logic — already correct for second client

---

## Runtime Commands for STEP 14C

**Prerequisites (both must be done first):**
1. Create vault_index.json at `app/gauge-product/public/vault/e65d2f.../run_01_oss_fastapi/vault_index.json`
2. Apply code changes to `lens_report_generator.py`

**Graph export (isolated test):**
```bash
node scripts/pios/export_graph_state.mjs \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --output /tmp/second_client_graph_state.json
```

**Expected output:**
```
[export_graph_state] wrote 8 nodes, 7 links (<N> ticks) → /tmp/second_client_graph_state.json
```

**Validation:**
```bash
python3 -c "
import json
g = json.load(open('/tmp/second_client_graph_state.json'))
print('run_id:', g['run_id'])
print('nodes:', len(g['nodes']))
print('links:', len(g['links']))
print('node types:', set(n['type'] for n in g['nodes']))
print('SIG nodes:', [n['id'] for n in g['nodes'] if n['type']=='SIGNAL'])
print('ART nodes:', [n['id'] for n in g['nodes'] if n['type']=='ARTIFACT'])
"
```

**Expected:**
- `run_id`: `run_01_oss_fastapi`
- `nodes`: 8 (1 ZONE + 7 ARTIFACT)
- `links`: 7
- `node types`: `{'ZONE', 'ARTIFACT'}` (no SIGNAL, no CLAIM)
- `SIG nodes`: `[]`
- `ART nodes`: `['ART-01', 'ART-02', 'ART-03', 'ART-04', 'ART-05', 'ART-06', 'ART-07']`

---

## Blockers

| Blocker | Type | Resolves in |
|---------|------|-------------|
| vault_index.json does not exist | NOT_IMPLEMENTED | STEP 14C (create file) |
| subprocess missing --client --run-id | DEFECT | STEP 14C (code change) |
| LENS page sections suppressed | NOT_IMPLEMENTED | Separate step (after graph_state verified, section inspection required) |
| GAP-01 / CLM-25 activation | NOT_IMPLEMENTED | Separate step (CONCEPT-06 fix required) |

**No blockers require inventing data or architectural redesign.**

---

## Next Step Recommendation

**STEP 14C — Structural Projection Bridge Implementation**

Authorized scope:
1. Create `app/gauge-product/public/vault/e65d2f.../run_01_oss_fastapi/vault_index.json`
   - Use derivation map above — no invention
   - `signals: {}` — no signal nodes
2. Apply 4 edits to `scripts/pios/lens_report_generator.py`
3. Run `export_graph_state.mjs` isolated to `/tmp/` — verify 8 nodes, 7 links
4. Run `py_compile` on modified `lens_report_generator.py`
5. Commit both artifacts + code change
6. UI section re-enable: separate contract (NOT part of STEP 14C)
