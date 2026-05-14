# Semantic Capability Label Fix — BLOCK_D

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01  
**Date:** 2026-04-30

---

## Problem

Zone detail (PSIG path) showed `scope_label` = "NO SEMANTIC CAPABILITY MAPPING AVAILABLE" when `cap_count == 0`. For PSIG-path zones derived from `pressure_zone_projection.json`, `capability_ids` is always empty — the projection does not carry capability data. This made every PSIG-path zone appear as if it had no semantic coverage, even when a semantic domain label was available.

---

## Root Cause

```python
scope_label = f"{cap_count} capability node{'s' if cap_count != 1 else ''}" if cap_count else "NO SEMANTIC CAPABILITY MAPPING AVAILABLE"
```

`caps = domain.get("capability_ids", [])` → `[]` for all PSIG-path zones because the zone dict's `domain` field does not carry capability data from the projection source.

---

## Fix Applied

In `_build_t2_psig_zone_block()`, replaced the single-line ternary with a three-way conditional:

```python
if cap_count:
    scope_label = f"{cap_count} capability node{'s' if cap_count != 1 else ''}"
elif _sem_has_backing:
    scope_label = f"Semantic domain: {esc(_sem_domain_label)} ({_sem_lineage} · {_sem_conf_str})"
else:
    scope_label = "NO SEMANTIC DOMAIN BACKING AVAILABLE"
```

Logic:
1. Capability nodes available → show capability count (existing behavior, preserves compatibility)
2. Semantic domain backing available → show semantic domain label with lineage/confidence
3. No backing of either kind → "NO SEMANTIC DOMAIN BACKING AVAILABLE" (not "CAPABILITY" — avoids capability terminology when capability data is not the authoritative source)

---

## Result for PZ-001

`scope_label` = `"Semantic domain: Platform Infrastructure and Data (STRONG · 0.78)"`

This is artifact-driven (from `_resolve_dom_to_semantic_context()` using semantic topology model globals) and accurate.

---

## Applicability

- Zones with capability data: unchanged — capability count shown
- PSIG zones with semantic backing: semantic domain label + lineage
- Zones with neither: explicit "NO SEMANTIC DOMAIN BACKING AVAILABLE"

---

## Validation

| Check | Result |
|---|---|
| VF-09: NO SEMANTIC CAPABILITY MAPPING AVAILABLE removed where semantic label exists | PASS — text absent; "Semantic domain: Platform Infrastructure and Data (STRONG · 0.78)" present |
