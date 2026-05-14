# Context Loading Analysis
## PI.LENS.RENDERER-SEMANTIC-CONTEXT-APPLICATION-DIAG.01

**Generated:** 2026-05-01

---

## `_load_semantic_crosswalk()` — lines 558–562

```python
def _load_semantic_crosswalk(path: Path) -> None:
    global _SEMANTIC_CROSSWALK
    if path.exists():
        with open(path) as f:
            _SEMANTIC_CROSSWALK = json.load(f)
```

**Behavior:** If file exists, reads JSON into `_SEMANTIC_CROSSWALK` global. If file missing, silently does nothing (no error).

**Loaded structure:** The crosswalk JSON has an `"entities"` list. Each entry has:
- `current_entity_id` (DOM-XX format)
- `business_label` (string or null)
- `confidence_score` (float)
- `fallback_used` (bool)

**For DOM-04:** entry present with `business_label="Platform Infrastructure and Data"`, `confidence_score=0.78`, `fallback_used=false`.

**Load status with `--crosswalk-path` pointing to existing file:** `_SEMANTIC_CROSSWALK` IS populated. ✓

---

## `_load_semantic_topology()` — lines 565–573

```python
def _load_semantic_topology(dir_path: Path) -> None:
    global _SEMANTIC_TOPOLOGY_MODEL, _SEMANTIC_TOPOLOGY_LAYOUT
    model_path  = dir_path / "semantic_topology_model.json"
    layout_path = dir_path / "semantic_topology_layout.json"
    if model_path.exists() and layout_path.exists():
        with open(model_path) as f:
            _SEMANTIC_TOPOLOGY_MODEL = json.load(f)
        with open(layout_path) as f:
            _SEMANTIC_TOPOLOGY_LAYOUT = json.load(f)
```

**Behavior:** Requires BOTH files to exist; if either is missing, silently does nothing.

**Load status:** Both files absent from repository. `_SEMANTIC_TOPOLOGY_MODEL` and `_SEMANTIC_TOPOLOGY_LAYOUT` remain None. ✗

---

## `_resolve_domain_display_label()` — lines 576–594

```python
def _resolve_domain_display_label(domain_id, technical_label, min_confidence=0.60):
    # Check semantic topology model first (DOMAIN-NN format)
    if _SEMANTIC_TOPOLOGY_MODEL is not None:
        for d in _SEMANTIC_TOPOLOGY_MODEL.get("domains", []):
            if d.get("domain_id") == domain_id:
                bl = d.get("business_label")
                ls = d.get("lineage_status", "NONE")
                if bl and ls in ("EXACT", "STRONG", "PARTIAL"):
                    return bl
    # Check crosswalk (DOM-XX format)
    if _SEMANTIC_CROSSWALK is not None:
        for entry in _SEMANTIC_CROSSWALK.get("entities", []):
            if entry.get("current_entity_id") == domain_id and not entry.get("fallback_used", True):
                biz = entry.get("business_label")
                if biz and entry.get("confidence_score", 0.0) >= min_confidence:
                    return biz
    return technical_label
```

**Behavior:** Checks topology model first (DOMAIN-NN), then crosswalk (DOM-XX). Returns business label if found, else technical_label.

**For DOM-04 with crosswalk loaded, topology model absent:** Returns `"Platform Infrastructure and Data"`. ✓

**This function IS crosswalk-aware.** However, it is NOT called at the primary zone-label render sites.

---

## `_resolve_dom_to_semantic_context()` — lines 875–891

```python
def _resolve_dom_to_semantic_context(dom_id: str) -> Dict:
    if _SEMANTIC_TOPOLOGY_MODEL is not None:
        for d in _SEMANTIC_TOPOLOGY_MODEL.get("domains", []):
            if d.get("dominant_dom_id") == dom_id:
                return {"domain_id": ..., "business_label": ..., ...}
    return {"domain_id": "", "business_label": "", "lineage_status": "NONE", "confidence": 0.0}
```

**Behavior:** Checks ONLY `_SEMANTIC_TOPOLOGY_MODEL`. Does NOT check `_SEMANTIC_CROSSWALK`. When model is None, always returns empty fields.

**This function is NOT crosswalk-aware.** It is the primary resolution function used at zone-label render sites.

---

## `_build_semantic_report_context()` — lines 797–870

Returns `_empty` with all-zero counts when `_SEMANTIC_TOPOLOGY_MODEL is None` (line 821–822).
The crosswalk is checked at line 843–846 (for `az_dom_label`) but ONLY inside the model-loaded code path (lines 824–867 execute only when model is not None).

**Result when model absent:** `fallback_available=False`, `total_semantic_domains=0`, `structurally_backed_domains=0`.

The 17-domain count cards require this to return `fallback_available=True`, which requires `_SEMANTIC_TOPOLOGY_MODEL` — crosswalk cannot substitute.
