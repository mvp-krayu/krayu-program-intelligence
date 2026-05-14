# Schema Compat Summary
## PI.LENS.RENDERER.PRESSURE-ZONE-SCHEMA-COMPAT.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime

---

## Problem

`lens_report_generator.py` read `pz_proj.get("zone_projection", [])` at 11 locations.

FastAPI conformance artifacts (used by E2E execution run) store pressure zones under `zones` key.
Native pipeline artifacts store them under `zone_projection` key.

Result: `zone_count = 0` → EPB section (`Where pressure exists`) suppressed.

---

## Fix Applied

All 11 occurrences of `pz_proj.get("zone_projection", [...])` replaced with compat pattern:

```python
# Before
pz_proj.get("zone_projection", [])

# After
pz_proj.get("zone_projection") or pz_proj.get("zones") or []
```

Two-line `[{}]` form:
```python
# Before
pz_proj.get("zone_projection", [{}])[0].get("anchor_id", "")
if pz_proj and pz_proj.get("zone_projection") else ""

# After
(pz_proj.get("zone_projection") or pz_proj.get("zones") or [{}])[0].get("anchor_id", "")
if pz_proj and (pz_proj.get("zone_projection") or pz_proj.get("zones")) else ""
```

Semantics: `zone_projection` takes precedence (existing behavior preserved); falls back to `zones` if absent.

---

## Lines Modified

| Line | Context |
|------|---------|
| 184 | RC.collapse_patterns — zone_list |
| 2952 | zones_by_anchor build loop |
| 3215 | primary zone lookup (attribution_profile filter) |
| 3556 | Tier-1 Evidence Brief pressure zone block |
| 3913 | Tier-1 Narrative Brief pressure zone block |
| 4227–4228 | Concentrated domain anchor (section 06) |
| 4838 | _build_tier2_psig_zone_block — zone_projection local |
| 6673 | _build_decision_surface — zone_count (critical gate) |
| 6690 | _build_decision_surface — _pz_first_f |
| 6759 | _build_decision_surface — EPB _pz_list_s |

---

## Result

Decision Surface after fix:
- `Where pressure exists` section: PRESENT ✓
- `Structural Pressure Signals`: PRESENT ✓
- `INVESTIGATE` posture: PRESENT ✓
- Score 60: PRESENT ✓
- File size: 15,076 bytes (was 11,917; reference productized: 15,193) ✓

Behavior for `zone_projection`-schema runs: UNCHANGED (existing key takes precedence via `or` short-circuit).
