# Topology Origin Trace — WP-15K

stream:    PSEE.RECONCILE.1.WP-15K
mode:      READ-ONLY FORENSIC
client:    1de0d815-0721-58e9-bc8d-ca83e70fa903
surface:   clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/runs/run_335c0575a080/surface/gauge_surface.html
run_id:    run_335c0575a080
run_commit: abacb2bf6deb174c9301d7be64d189cb85066f26 ([WP-14] Remove stale sig_row/node_row helpers)

---

## TASK 1 — SURFACE INSPECTION

### Embedded Topology Data (gauge_surface.html)

Topology is NOT embedded as a JSON blob in `gauge_surface.html`. It is rendered as HTML by `build_product_surface.py` at surface-generation time, then hardcoded as text nodes into the HTML.

Topology appears in the HTML at:
- Line ~803: node rows — `<div class="topo-node">MQTT Broker <span class="nd">Infrastructure</span></div>`
- Line ~822: relationship rows — `<div class="topo-rel">HASI Bridge Agent → MQTT Broker <span class="rt">DEPENDS_ON</span></div>`
- Line ~1461: domain strings — assembled via `" &middot; ".join(g["topology"]["domains"])`

**Source reference in HTML** (visible in surface):
```html
<div style="font-size:11px;color:#333;margin-top:10px;">source: gauge_state.topology</div>
```

Topology data is **inline-rendered static HTML** — not sourced from a live external JSON at render time.

---

## TASK 2 — BUILDER TRACE (build_product_surface.py)

**Entry point**: `scripts/psee/build_product_surface.py`

**Topology data flow within builder**:

| Step | Location | Operation |
|---|---|---|
| PACKAGE_READ | `read_package()` | Reads `clients/<uuid>/runs/<run_id>/package/gauge_state.json` |
| Topology extraction | `exposure_classification()` (line 230–232) | `len(g["topology"]["nodes"])`, `["relationships"]`, `["domains"]` |
| Operator view | `build_operator()` (line 335) | `"topology": g["topology"]` — passes full topology into `operator_view` |
| HTML rendering | HTML f-string block (lines 611–624) | `id_to_label`, `domains_str`, node rows, relationship rows — all from `g["topology"]` |

**Variables used**:
- `g = pkg["gauge"]` — loaded from `gauge_state.json`
- `g["topology"]["domains"]` → `domains_str`
- `g["topology"]["nodes"]` → node HTML rows
- `g["topology"]["relationships"]` → relationship HTML rows

**Upstream input**: `clients/.../runs/run_335c0575a080/package/gauge_state.json`

No topology is constructed or modified in `build_product_surface.py`. It is consumed read-only and rendered.

---

## TASK 3 — RUNTIME TRACE

### run_client_runtime.py

**Call at run time**:
```
python3 scripts/psee/run_client_runtime.py \
    --client 1de0d815-0721-58e9-bc8d-ca83e70fa903 \
    --input clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/input/authoritative_state.json
```
*(confirmed by verification.log: `INPUT_LOAD_START: loading input: clients/.../input/authoritative_state.json`)*

**Topology flow within runtime**:

| Stage | Function | Operation |
|---|---|---|
| INPUT_LOAD | `main()` | `raw_input = json.load(authoritative_state.json)` |
| IG_NORMALIZATION | `ig_normalize()` (lines 434–447) | Topology read verbatim: `topo = raw_input.get("topology", {})` → domains sorted, nodes sorted by id, relationships sorted — no new data added |
| PSEE_RECONSTRUCTION | `psee_reconstruct()` (line 495) | `topo = normalized["topology"]` — topology carried through; structural metrics computed FROM topology but topology itself unchanged |
| GAUGE_ENGINE | `build_core_artifacts()` (lines 824–829) | `gauge_state["topology"] = { "domains", "nodes", "relationships", "highlighted_signal", "placement_semantics" }` — topology embedded in gauge_state.json |

**topology is passed through — NOT constructed — by run_client_runtime.py.**

### build_authoritative_input.py trace

**authoritative_state.json** on disk at run time (`abacb2bf`) was produced by `build_authoritative_input.py` (WP-13B) from `raw_input.json`. In `build_authoritative_input.py`:

| Stage | Operation |
|---|---|
| INPUT_LOAD | Reads `raw_input.json` (or `--raw-input` arg) |
| STRUCTURAL_NORMALIZATION | Validates fields — no topology transformation |
| TOPOLOGY_CONSTRUCTION | `topology_construction()` — reads `raw["domains"]`, `raw["entities"]`, `raw["relationships"]`; builds `norm_nodes` with deterministic IDs (`entity_node_id()`) |
| STATE_ASSEMBLY | `topology` embedded in `authoritative_state.json` |

**topology origin: raw_input.json** — the `entities` array from `raw_input.json` becomes the `nodes` array in `authoritative_state.json`.

### Admissibility gate status at run time

The `AUTHORITATIVE_INPUT_ADMISSIBILITY_CHECK` stage was **NOT present** in `run_client_runtime.py` at commit `abacb2bf`. The check was introduced in WP-15 (commit `fa5b8f6`). Therefore:

- The run at `abacb2bf` did NOT validate `admissibility_metadata`
- The `authoritative_state.json` consumed as input had no enforced provenance
- Intake passed as `AUTHORITATIVE_INTAKE` (from `intake_mode` field in the input) without cryptographic verification

---

## TASK 4 — SOURCE CLASSIFICATION

### Topology Data Snapshot

```json
{
  "domains": ["Application", "Device", "Infrastructure"],
  "nodes": [
    {"id": "N-1FFEB1AE", "label": "MQTT Broker",                  "domain": "Infrastructure"},
    {"id": "N-53CF7041", "label": "Redis",                         "domain": "Infrastructure"},
    {"id": "N-5D57CFB8", "label": "Sensor Collector Agent",        "domain": "Device"},
    {"id": "N-61E8FB24", "label": "Monitoring — Prometheus+Grafana","domain": "Infrastructure"},
    {"id": "N-62339513", "label": "HASI Bridge Agent",             "domain": "Device"},
    {"id": "N-7AAD8D87", "label": "PostgreSQL+TimescaleDB",        "domain": "Infrastructure"},
    {"id": "N-80E533AB", "label": "HASI Security System",          "domain": "Infrastructure"},
    {"id": "N-A707EA33", "label": "Blue Edge Fleet Frontend",       "domain": "Application"},
    {"id": "N-B0506103", "label": "Blue Edge Fleet Management API", "domain": "Application"}
  ],
  "relationships": [
    {"from": "N-61E8FB24", "to": "N-53CF7041", "type": "COORDINATES_WITH"},
    {"from": "N-61E8FB24", "to": "N-7AAD8D87", "type": "COORDINATES_WITH"},
    {"from": "N-61E8FB24", "to": "N-B0506103", "type": "COORDINATES_WITH"},
    {"from": "N-62339513", "to": "N-1FFEB1AE", "type": "DEPENDS_ON"},
    {"from": "N-62339513", "to": "N-80E533AB", "type": "DEPENDS_ON"},
    {"from": "N-62339513", "to": "N-B0506103", "type": "DEPENDS_ON"},
    {"from": "N-A707EA33", "to": "N-B0506103", "type": "DEPENDS_ON"},
    {"from": "N-B0506103", "to": "N-53CF7041", "type": "DEPENDS_ON"},
    {"from": "N-B0506103", "to": "N-7AAD8D87", "type": "DEPENDS_ON"}
  ]
}
```

### Per-Component Classification

| Component | SOURCE_CLASS | Exact File Path | Line Reference |
|---|---|---|---|
| domains: Application, Device, Infrastructure | UNKNOWN | `clients/.../input/raw_input.json` (never committed to git; now empty) | — |
| nodes (9 entities, including MQTT Broker et al.) | UNKNOWN | `clients/.../input/raw_input.json` (never committed; SHA256 at run time: `fc7ed0c25409f3d330413cc711b049b53818f896312b79556f44291e259e1e15`) | — |
| relationships (9 edges, DEPENDS_ON / COORDINATES_WITH) | UNKNOWN | `clients/.../input/raw_input.json` (never committed; now empty) | — |
| node IDs (N-xxxxxxxx) | ADAPTER_DERIVED | `scripts/psee/build_authoritative_input.py` → `entity_node_id()` (lines 83–90) | SHA256-based derivation from entity name + domain |
| topology in authoritative_state.json (at run) | UNKNOWN | `clients/.../input/authoritative_state.json` (untracked; overwritten by WP-15E) | — |
| topology in gauge_state.json (in run package) | ADAPTER_DERIVED | `clients/.../runs/run_335c0575a080/package/gauge_state.json` | ig_normalize() pass-through + entity_node_id() derivation |
| topology in gauge_surface.html | ADAPTER_DERIVED | `clients/.../runs/run_335c0575a080/surface/gauge_surface.html` | Rendered from gauge_state.topology via build_product_surface.py f-string |

**UNKNOWN classification criteria**: The original data source (`raw_input.json`) was never committed to git, has no provenance hash recorded under a governed framework, and no longer exists with its original content. No committed artifact in the repository contains the topology origin data (MQTT Broker, Application/Device/Infrastructure domains).

**Evidence of committed raw_intake conflict**: `clients/.../input/raw_intake/entities.json` at commit `72a4531` (WP-15B) contains `Entity A/B/C/D/E` in `Domain Alpha/Beta/Gamma` — these DO NOT match the topology in `gauge_state.json`. The raw_intake files are a separate, unrelated data set.

---

## TASK 5 — TRANSFORMATION PATH

```
SOURCE                           TRANSFORMATION                           SURFACE
─────────────────────────────────────────────────────────────────────────────────────
raw_input.json                   build_authoritative_input.py             authoritative_state.json
(UNKNOWN origin; untracked;   →  topology_construction():              →  topology: {domains, nodes, rels}
 SHA256: fc7ed0c2...;             entities → nodes (IDs derived           embedded in state
 now empty)                       via entity_node_id / SHA256)

authoritative_state.json         run_client_runtime.py                    gauge_state.json
(untracked at run time;       →  ig_normalize() lines 434-447:         →  gauge_state["topology"]
 no admissibility gate at         topology read verbatim;                  domains, nodes, rels, placement
 commit abacb2bf)                 sorted deterministically

gauge_state.json                 build_product_surface.py                 gauge_surface.html
(run package artifact)        →  read_package() + HTML f-string        →  <div class="topo-node">...
                                  domains_str, node rows, rel rows         <div class="topo-rel">...
                                  lines 611-624                            (static inline HTML)
```

---

## TASK 6 — AUTHORITY ASSESSMENT

### Criteria Check

| Criterion | Status | Notes |
|---|---|---|
| Originates from admissible intake source | FAIL | `raw_input.json` was never governed under admissibility framework; admissibility check did not exist at run time (`abacb2bf`) |
| Traceable | FAIL | `raw_input.json` never committed to git; no provenance record; SHA256 `fc7ed0c2...` recorded in WP-15B source_manifest.json but no committed file matches it |
| Deterministic | INDETERMINATE | Node IDs are deterministically derived from entity names; but entity names themselves are untraceable |
| No transformation that adds structure | PASS | `run_client_runtime.py` and `build_product_surface.py` only normalize and render; they do not add domains, entities, or relationships |

### Final Verdict

**TOPOLOGY_AUTHORITY = NON_AUTHORITATIVE**

Basis:
1. Root source (`raw_input.json`) was never committed and has no governed provenance record
2. The admissibility gate (`AUTHORITATIVE_INPUT_ADMISSIBILITY_CHECK`) did not exist at the time the run was executed — the run bypassed all admissibility enforcement
3. The `raw_input.json` content no longer exists in the repository input layer — it was replaced/emptied
4. The committed `raw_intake/entities.json` (WP-15B) contains different data (Entity A/B/C/D/E) and does NOT match the topology on the surface — it is not the origin
5. The topology depicted on the demo surface (MQTT Broker, Blue Edge Fleet Frontend, HASI Security System, etc.) corresponds to a program structure that was present on disk but never formally governed into the pipeline

---

## PROVENANCE SUMMARY

| Field | Value |
|---|---|
| topology_in_surface | 3 domains, 9 nodes, 9 relationships |
| topology_source | raw_input.json (untracked; SHA256: fc7ed0c25409f3d330413cc711b049b53818f896312b79556f44291e259e1e15) |
| source_committed | NO |
| admissibility_check_at_run | ABSENT (added post-run in WP-15) |
| run_commit | abacb2bf (WP-14) |
| topology_still_recoverable_from_committed_artifacts | NO (only survives in run_335c0575a080 package) |
| TOPOLOGY_AUTHORITY | NON_AUTHORITATIVE |
