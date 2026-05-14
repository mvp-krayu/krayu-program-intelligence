# Renderer Capability Analysis
## PI.LENS.REPORT-RENDERER-LINEAGE-CONTEXT-DISCOVERY.01

**Generated:** 2026-05-01
**Script:** scripts/pios/lens_report_generator.py

---

## CAPABILITY A: Semantic Crosswalk Loading — SUPPORTED

### Function Chain

```python
# _configure_runtime() (line 939-940)
if crosswalk_path is not None:
    _load_semantic_crosswalk(crosswalk_path)

# _load_semantic_crosswalk() (line 558-562)
def _load_semantic_crosswalk(path: Path) -> None:
    global _SEMANTIC_CROSSWALK
    if path.exists():
        with open(path) as f:
            _SEMANTIC_CROSSWALK = json.load(f)

# _resolve_domain_display_label() (line 576-594)
def _resolve_domain_display_label(domain_id, technical_label, min_confidence=0.60):
    # Check crosswalk (DOM-XX format)
    if _SEMANTIC_CROSSWALK is not None:
        for entry in _SEMANTIC_CROSSWALK.get("entities", []):
            if entry.get("current_entity_id") == domain_id and not entry.get("fallback_used", True):
                biz = entry.get("business_label")
                if biz and entry.get("confidence_score", 0.0) >= min_confidence:
                    return biz
    return technical_label
```

### CLI Flag

```
--crosswalk-path  (type=Path, default=None)
```

Wired in argparse (line 7149) → passed to `_configure_runtime()` (line 7172) → calls `_load_semantic_crosswalk()`.

### Effect on DOM-04

`_resolve_domain_display_label("DOM-04", "backend_app_root")` with crosswalk loaded:
- Finds entry with `current_entity_id == "DOM-04"`, `fallback_used == false`, `confidence_score == 0.78 >= 0.60`
- Returns `"Platform Infrastructure and Data"` instead of `"backend_app_root"`

### Resolves

- Pressure zone label in tier1_narrative (PZ-001 block)
- DOM anchor text in conclusion ("DOM-04 / backend_app_root" → "DOM-04 / Platform Infrastructure and Data")
- Any other `_resolve_domain_display_label("DOM-04", ...)` call site

---

## CAPABILITY B: Semantic Topology Model Loading — SUPPORTED BUT BLOCKED

### Function Chain

```python
# _configure_runtime() (line 942-943)
if semantic_topology_dir is not None:
    _load_semantic_topology(semantic_topology_dir)

# _load_semantic_topology() (line 565-573)
def _load_semantic_topology(dir_path: Path) -> None:
    global _SEMANTIC_TOPOLOGY_MODEL, _SEMANTIC_TOPOLOGY_LAYOUT
    model_path  = dir_path / "semantic_topology_model.json"
    layout_path = dir_path / "semantic_topology_layout.json"
    if model_path.exists() and layout_path.exists():
        with open(model_path) as f: _SEMANTIC_TOPOLOGY_MODEL = json.load(f)
        with open(layout_path) as f: _SEMANTIC_TOPOLOGY_LAYOUT = json.load(f)
```

### CLI Flag

```
--semantic-topology-dir  (type=Path, default=None)
```

Wired in argparse (line 7153) → passed to `_configure_runtime()` (line 7173) → calls `_load_semantic_topology()`.

### Effect When Loaded

`_build_semantic_report_context()` (line 797) returns populated dict with:
- `total_semantic_domains` = len(model.domains) — the historical domain count (e.g., 17)
- `structurally_backed_domains` = count with EXACT/STRONG/PARTIAL lineage
- `semantic_only_domains` = count with NONE lineage
- `render_verdict` = "PARTIAL_RENDER_READY"

This populates the "17 Semantic Domains / 5 Structurally Backed / 12 Semantic-Only" count cards in tier1_evidence.

`_render_topology_section()` (line 1738-1739) routes to `_render_semantic_topology_svg()` instead of hardcoded 17-domain SVG when model is loaded.

### Blocked Status

Files required:
- `semantic_topology_model.json` — NOT FOUND in repository
- `semantic_topology_layout.json` — NOT FOUND in repository

**Without these files, the 17-domain count cards and semantic SVG cannot be reproduced.**

---

## CAPABILITY C: Hardcoded 17-Domain SVG Path — INDIRECT

`_render_topology_section()` (line 1741):
```python
if domain_count != 17:
    return _compose_topology_fallback(light_mode, topology, domain_count)
# 17-domain reference model — curated SVG rendering (unchanged logic below)
```

When `topology["domains"]` has 17 entries, OR when topology is None (default=17), the curated 17-domain SVG fires. This SVG is hardcoded in the renderer with clusters OPERATIONAL INTELLIGENCE, FLEET OPERATIONS, EMERGING CAPABILITIES, Platform Infrastructure, Platform Services, and gn-01 through gn-17 nodes.

**This path is NOT triggered by `--crosswalk-path` or `--semantic-topology-dir`.**
**It fires when topology==None OR topology has exactly 17 domains.**
With `--package-dir run_blueedge_productized_01/vault`, topology has 13 domains → fallback SVG.
With `--package-dir run_blueedge_productized_01_dom_lineage_validation/vault` → FAIL (canonical_topology.json missing → _fail()).

---

## CAPABILITY D: Projection File Resolution — CORRECTLY HANDLED

`_resolve_41x_path()` (line 2695-2702):
```python
def _resolve_41x_path(filename: str) -> Path:
    grounded = CANONICAL_PKG_DIR.parent / "41.x" / "grounded" / filename
    legacy   = CANONICAL_PKG_DIR.parent / "41.x" / filename
    if grounded.exists():
        return grounded  # grounded/ checked first
    return legacy
```

With `--package-dir run_blueedge_productized_01/vault`:
- `CANONICAL_PKG_DIR.parent` = `run_blueedge_productized_01/`
- `41.x/grounded/signal_projection.json` → EXISTS ✓
- `41.x/grounded/pressure_zone_projection.json` → EXISTS ✓

Projection files resolve correctly for the base productized run.

---

## Summary

| Capability | Supported | Files Present | Resolves Canonical Drift |
|-----------|-----------|---------------|--------------------------|
| Crosswalk (--crosswalk-path) | YES | YES | PARTIAL — PZ-001 label, DOM anchor |
| Semantic topology (--semantic-topology-dir) | YES | NO | BLOCKED — model/layout files absent |
| Hardcoded 17-domain SVG | INDIRECT | N/A | NOT triggered with 13-domain vault |
| Projection file resolution | YES (auto) | YES | N/A — already works |
