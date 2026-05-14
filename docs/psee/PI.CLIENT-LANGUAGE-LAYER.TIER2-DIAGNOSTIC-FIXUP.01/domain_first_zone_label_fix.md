# Domain-First Zone Label Fix — BLOCK_C

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01  
**Date:** 2026-04-30

---

## Problem

Zone inventory and zone details used the DOM technical label (`backend_app_root`) as the primary display name instead of the semantic domain business label (`Platform Infrastructure and Data`).

**Zone inventory card (wrong):**
```
PZ-001
backend_app_root
DOM backing: DOM-04
```

**Zone detail Section A (wrong):**
```
backend_app_root domain: Multiple structural pressures acting together...
```

---

## Root Cause

In `_derive_tier2_zones_from_projection()`, the zone dict `domain_name` was set via `_resolve_domain_display_label(anchor_id, anchor_name)` where `anchor_id = "DOM-04"` and `anchor_name = "backend_app_root"`.

`_resolve_domain_display_label("DOM-04", "backend_app_root")` falls through to `return technical_label` because:
1. Semantic topology model lookup checks for `domain_id == "DOM-04"` — fails (model has DOMAIN-NN IDs, not DOM-XX)
2. Crosswalk lookup skips DOM-04 because `fallback_used: true`
3. Returns `anchor_name` = "backend_app_root"

`_resolve_dom_to_semantic_context("DOM-04")` (already in the generator) correctly performs the reverse mapping: searches DOMAIN-NN nodes for `dominant_dom_id == "DOM-04"` → finds DOMAIN-10 "Platform Infrastructure and Data".

---

## Fix 1: Zone dict enrichment in `_derive_tier2_zones_from_projection()`

```python
# Resolve semantic domain label: DOM-XX anchor → DOMAIN-NN business label
_z_sem_ctx   = _resolve_dom_to_semantic_context(anchor_id)
_z_sem_label = _z_sem_ctx.get("business_label") if _z_sem_ctx.get("domain_id") else None
_z_display_name = _z_sem_label or _resolve_domain_display_label(anchor_id, domain.get("domain_name", anchor_name))
zones.append({
    ...
    "domain_name":  _z_display_name,   # semantic business label when available
    "anchor_name":  anchor_name,       # technical label for structural backing display
    ...
})
```

Priority: semantic business label > domain display label > technical anchor name.

## Fix 2: Zone inventory card DOM backing line

```python
_zcard_anchor_name = z.get("anchor_name", "")
_zcard_dom_backing = esc(_zcard_dom) + (f" / {esc(_zcard_anchor_name)}" if _zcard_anchor_name else "")
_zcard_dom_line = f'DOM backing: {_zcard_dom_backing}'
```

Result: `DOM backing: DOM-04 / backend_app_root`

## Fix 3: Zone detail Section A primary label

```python
_primary_label = _sem_domain_label if _sem_has_backing else dname
raw_cond = (
    f"{_primary_label} domain: {_zclass_exec_a} — ..."
)
```

`_sem_domain_label` is resolved from `_resolve_dom_to_semantic_context(did)` earlier in the function. Falls back to `dname` (zone's `domain_name`) when no semantic backing.

---

## Result

**Zone inventory card (fixed):**
```
PZ-001
Platform Infrastructure and Data
DOM backing: DOM-04 / backend_app_root
```

**Zone detail Section A (fixed):**
```
Platform Infrastructure and Data domain: Multiple structural pressures acting together...
```

---

## Validation

| Check | Result |
|---|---|
| VF-05: Zone inventory primary label = semantic DOMAIN label | PASS — "Platform Infrastructure and Data" in zone-domain div |
| VF-06: DOM shown as backing only | PASS — "DOM backing: DOM-04 / backend_app_root" |
| VF-07: Zone detail primary text uses semantic label | PASS — "Platform Infrastructure and Data domain:" |
| VF-08: No backend_app_root as primary zone title | PASS — zone-domain contents: ['Platform Infrastructure and Data'] |
