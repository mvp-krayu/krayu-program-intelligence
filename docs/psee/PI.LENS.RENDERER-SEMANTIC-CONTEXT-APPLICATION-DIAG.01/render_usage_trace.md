# Render Usage Trace
## PI.LENS.RENDERER-SEMANTIC-CONTEXT-APPLICATION-DIAG.01

**Generated:** 2026-05-01

---

## Zone/Domain Label Render Sites

### SITE 1 — Tier1 Narrative focus-block zone name

**Function:** `_build_tier1_narrative_brief()`, line 3850
**Render site:** line 3912 — `{esc(zid)} — {esc(zname)}`
**Also at:** line 3919 — `{esc(zid)} ({esc(zname)}) is a ...`

**`zname` resolution (lines 3897–3899):**
```python
_z_sem_ctx  = _resolve_dom_to_semantic_context(_z_anchor_id)   # model-only
_z_sem_label = _z_sem_ctx.get("business_label") if _z_sem_ctx.get("domain_id") else None
zname  = _z_sem_label or _z_anchor_name                        # falls back to raw anchor_name
```

**When crosswalk loaded, topology model absent:**
- `_resolve_dom_to_semantic_context("DOM-04")` returns `{"domain_id": "", ...}`
- `_z_sem_label` = None
- `zname` = `_z_anchor_name` = `"backend_app_root"` (from pz_proj)
- Crosswalk not reached

**Canonical value:** `"Platform Infrastructure and Data"`
**Generated value:** `"backend_app_root"`
**Gap:** crosswalk not consulted as fallback; `_resolve_domain_display_label()` not called

---

### SITE 2 — Tier1 Evidence focus domain display

**Function:** `_build_tier1_evidence_brief()`, line 3155
**Render site:** line 3205 — `_focus_tag = f"Pressure Zone — {_pz_display} PRIMARY"`

**`_pz_display` resolution (lines 3200–3204):**
```python
_pz_sem_ctx   = _resolve_dom_to_semantic_context(_pz_anchor_id)   # model-only
_pz_sem_label = _pz_sem_ctx.get("business_label") if _pz_sem_ctx.get("domain_id") else None
_pz_display   = _pz_sem_label or primary_zone.get("anchor_name", _pz_anchor_id)  # raw fallback
```

**When crosswalk loaded, topology model absent:**
- `_pz_display` = `"backend_app_root"` (from projection anchor_name)
- Crosswalk not reached

**Gap:** same pattern as SITE 1

---

### SITE 3 — Decision Surface pressure zone label

**Function:** `_build_decision_surface()`, line 6516
**Render site:** line 6760 — `{esc(_pz0_zone_id)} — {esc(_pz0_label)}`

**`_pz0_label` resolution (lines 6744–6746):**
```python
_pz0_sem_ctx  = _resolve_dom_to_semantic_context(_pz0_anchor)     # model-only
_pz0_label    = (_pz0_sem_ctx.get("business_label") if _pz0_sem_ctx.get("domain_id")
                 else _pz0.get("anchor_name", _pz0_anchor))        # raw fallback
```

**When crosswalk loaded, topology model absent:**
- `_pz0_label` = `"backend_app_root"` (from projection anchor_name)
- Crosswalk not reached

**Gap:** same pattern

---

### SITE 4 — Tier2 Zone domain_name (CORRECTLY uses crosswalk)

**Function:** `_derive_tier2_zones_from_projection()`, line 4807
**Render output:** populates `zone["domain_name"]` at line 4847

**Resolution (lines 4841–4843):**
```python
_z_sem_ctx  = _resolve_dom_to_semantic_context(anchor_id)            # model-only
_z_sem_label = _z_sem_ctx.get("business_label") if ... else None
_z_display_name = _z_sem_label or _resolve_domain_display_label(     # ← CROSSWALK AWARE
    anchor_id, domain.get("domain_name", anchor_name))
```

**When crosswalk loaded, topology model absent:**
- `_z_sem_label` = None
- Falls through to `_resolve_domain_display_label("DOM-04", "backend_app_root")`
- `_resolve_domain_display_label()` checks crosswalk → returns `"Platform Infrastructure and Data"` ✓

**This site is correctly implemented.**

---

## Count Card Render Sites

### SITE 5 — Tier1 Evidence count cards

**Function:** `_build_tier1_evidence_brief()`, line 3249–3304

**Routing:**
```python
_sem_ctx = _build_semantic_report_context()
if _sem_ctx["fallback_available"]:              # requires _SEMANTIC_TOPOLOGY_MODEL
    # "Semantic Domains" / "Structurally Backed" / "Semantic-Only" cards
else:
    # "Domains" / "Capabilities" / "Components" / "Total Nodes" cards (line 3299–3309)
```

**When topology model absent:**
- `fallback_available=False` → goes to else branch
- Renders structural topology counts (13 domains, 0 capabilities, 35 components, 35 total nodes)
- Crosswalk cannot change this — count cards require `_SEMANTIC_TOPOLOGY_MODEL`

---

## Conclusion Domain Anchor

**Function:** `_build_tier1_narrative_brief()`, line 4204–4206

```python
_conc_dom_anchor = (
    pz_proj.get("zone_projection", [{}])[0].get("anchor_id", "")
    if pz_proj and pz_proj.get("zone_projection") else ""
)
```

Renders the raw `anchor_id` (e.g., "DOM-04") in conclusion text.
Canonical shows "(DOM-04)". Generated shows "()" because `run_be_orchestrated_fixup_01/41.x/.../pressure_zone_projection.json` has no zone_projection entries — this is a data source issue (wrong run's pz_proj), not a crosswalk issue.

---

## SVG Topology Path

**Function:** `_render_topology_section()` / `_build_tier1_evidence_brief()`, line 3185–3190

```python
if _SEMANTIC_TOPOLOGY_MODEL is not None and _SEMANTIC_TOPOLOGY_LAYOUT is not None:
    svg_html = _render_semantic_topology_svg()         # semantic SVG
elif use_psig:
    svg_html = _build_tier1_topology_svg_generic(...)  # generic structural SVG
else:
    svg_html = _build_tier1_topology_svg(...)          # hardcoded 17-domain SVG (domain_count check)
```

Crosswalk does not influence SVG path selection. Only topology model/layout control which SVG fires.
