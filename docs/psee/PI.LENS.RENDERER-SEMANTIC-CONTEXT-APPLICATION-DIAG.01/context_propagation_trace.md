# Context Propagation Trace
## PI.LENS.RENDERER-SEMANTIC-CONTEXT-APPLICATION-DIAG.01

**Generated:** 2026-05-01

---

## Global State After `_configure_runtime()` with `--crosswalk-path` (files exist)

| Global | State |
|--------|-------|
| `_SEMANTIC_CROSSWALK` | POPULATED — dict with `entities` list, 13 DOM-XX entries |
| `_SEMANTIC_TOPOLOGY_MODEL` | None — semantic topology files absent |
| `_SEMANTIC_TOPOLOGY_LAYOUT` | None — semantic topology files absent |

---

## Propagation Path: Crosswalk → Render Functions

The crosswalk is a module-level global. It does NOT need to be passed as a parameter — all functions can access it directly via `_SEMANTIC_CROSSWALK`.

Functions that CHECK `_SEMANTIC_CROSSWALK`:

| Function | Line | Check |
|----------|------|-------|
| `_resolve_domain_display_label()` | 588–593 | Checks crosswalk as secondary fallback (primary: topology model) |
| `_build_semantic_report_context()` | 843–846 | Checks crosswalk for `az_dom_label` — but only inside model-loaded code path |

Functions that do NOT check `_SEMANTIC_CROSSWALK` but SHOULD:

| Function | Line | Fallback Used Instead |
|----------|------|-----------------------|
| `_resolve_dom_to_semantic_context()` | 882 | None — only checks `_SEMANTIC_TOPOLOGY_MODEL`; returns empty when absent |

---

## `_build_semantic_report_context()` Propagation

Called at:
- Line 3249: `_sem_ctx = _build_semantic_report_context()` — in `_build_tier1_evidence_brief()`
- Line 5807: `_sem_ctx_t2 = _build_semantic_report_context()` — in tier2 build function
- Line 6516+: in `_build_decision_surface()`

When `_SEMANTIC_TOPOLOGY_MODEL is None`:
- Returns `_empty` dict with `fallback_available=False`
- All count fields = 0
- All label fields = None
- Crosswalk is NOT consulted (crosswalk block at line 843–846 is inside `if _SEMANTIC_TOPOLOGY_MODEL is not None:` path)

**The crosswalk CANNOT populate `_build_semantic_report_context()` when topology model is absent.**

---

## Zone Label Propagation Chain

### Tier1 Narrative — `_build_tier1_narrative_brief()` (line 3850)

```
pz_proj → zone_projection[i] → anchor_id / anchor_name
                                       ↓
            _resolve_dom_to_semantic_context(anchor_id)  [line 3897]
                                       ↓
            Returns empty (model absent) → _z_sem_label = None
                                       ↓
            zname = _z_sem_label or _z_anchor_name        [line 3899]
                                       ↓
            _z_anchor_name = "backend_app_root"  ← BREAKPOINT
```

`_resolve_domain_display_label()` is NOT called at this site.
`_SEMANTIC_CROSSWALK` is NOT consulted.

### Tier1 Evidence — `_build_tier1_evidence_brief()` (line 3155)

```
pz_proj → primary_zone → anchor_id / anchor_name
                                  ↓
    _resolve_dom_to_semantic_context(anchor_id)  [line 3200]
                                  ↓
    Returns empty → _pz_sem_label = None
                                  ↓
    _pz_display = _pz_sem_label or primary_zone.get("anchor_name")  [line 3204]
                                  ↓
    _pz_display = "backend_app_root"  ← BREAKPOINT
```

### Decision Surface — `_build_decision_surface()` (line 6516)

```
pz_proj → zone_projection[0] → anchor_id / anchor_name
                                         ↓
              _resolve_dom_to_semantic_context(anchor_id)  [line 6744]
                                         ↓
              Returns empty → business_label absent
                                         ↓
              _pz0_label = anchor_name from pz_proj  [line 6745–6746]
                                         ↓
              _pz0_label = "backend_app_root"  ← BREAKPOINT
```

### Tier2 Zones — `_derive_tier2_zones_from_projection()` (line 4807) — CORRECT PATH

```
pz_proj → anchor_id / anchor_name
                   ↓
_resolve_dom_to_semantic_context(anchor_id)  [line 4841]
                   ↓
Returns empty → _z_sem_label = None
                   ↓
_z_display_name = _z_sem_label or _resolve_domain_display_label(anchor_id, ...)  [line 4843]
                   ↓
_resolve_domain_display_label("DOM-04", "backend_app_root")
                   ↓
Checks crosswalk → "Platform Infrastructure and Data"  ← CORRECT
```

**The tier2 zone builder IS crosswalk-aware at line 4843. The other three render sites are not.**
