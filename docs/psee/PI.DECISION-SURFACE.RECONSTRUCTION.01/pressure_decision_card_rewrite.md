# Pressure Decision Card Rewrite — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30

## Required Pattern

```
{zone_id} — {semantic_domain_label}
DOM backing: {dom_id} / {dom_label}
Signals: {active_signal_ids}
Zone class: {zone_class}
Confidence: {confidence}
```

## Rendered Output (BlueEdge, PZ-001)

In the pressure section (RC.evidence_pair_block), the synthesis block now renders:

```
PZ-001 — Platform Infrastructure and Data

DOM backing: DOM-04 / Platform Infrastructure and Data
Signals: PSIG-001 · PSIG-002 · PSIG-004
Zone class: Multiple structural pressures acting together (trace: COMPOUND_ZONE)
Confidence: —
```

Note: Confidence shown as "—" because `zone_confidence` is not present in the pressure_zone_projection.json for this run. This is correct artifact-driven behavior — the field is absent, not suppressed.

## Semantic-First Rule Compliance

- Primary display: `Platform Infrastructure and Data` (semantic business label via `_resolve_dom_to_semantic_context(anchor_id)`)
- DOM shown as backing/trace: `DOM-04 / Platform Infrastructure and Data`
- No `backend_app_root` used as zone title
- Zone class via language layer: `RC.apply_language("COMPOUND_ZONE")`

## Derivation

All values from:
- `zone_id`: `pz_proj["zone_projection"][0]["zone_id"]`
- `semantic_domain_label`: `_resolve_dom_to_semantic_context(anchor_id)["business_label"]`
- `dom_id`: `pz_proj["zone_projection"][0]["anchor_id"]`
- `signals`: `pz_proj["zone_projection"][0]["signals"]` = PSIG-001, PSIG-002, PSIG-004 (excludes PSIG-006)
- `zone_class`: `pz_proj["zone_projection"][0]["zone_class"]`
- `confidence`: `pz_proj["zone_projection"][0].get("zone_confidence", "—")`
