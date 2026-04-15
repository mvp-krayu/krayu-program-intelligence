---
node_class: entity
entity_id: ENT-structural-units
entity_family: Structural Units (CEUs)
count: 30
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Definition
Structural Units are the 30 admitted artifacts from the BlueEdge source bundle that passed admissibility scoring in the IG pipeline. Each unit is a classified, hashed file or artifact accepted into the evidence boundary.

## Source Origin
Materialized by `pios ig integrate-structural-layers` → `admissibility_log.json`. Provenance: `docs/pios/IG.RUNTIME/run_01/`. 27 from layer artifacts (L40_2:4 + L40_3:6 + L40_4:17) + 3 root artifacts = 30 total.

## Role in Claims
- [[CLM-01 Structural Coverage Completeness]] — coverage_percent=100.0 (30/30)
- [[CLM-02 Structural Unit Count]] — count=30 admitted / 30 required
- [[CLM-03 Structural Reconstruction Pass-Fail]] — all 30 units reconstruct successfully
- [[CLM-09 Proven Structural Score]] — coverage_points derived from this count

## Exposure Classification
- ZONE-1: count + admissibility status (operator detail)
- ZONE-2: count only — "30 core structural elements"
- ZONE-0/3: individual file names (technical artifact names — not client-safe)

## Explanation
Individual CEU file names are operator/audit only. They are code or artifact filenames (e.g., `hasi_bridge.py`) meaningful to engineers but potentially confusing without full context for executives. The count (30) and completeness status (all admitted) are the client-safe surface.
