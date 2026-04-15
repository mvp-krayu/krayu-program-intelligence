---
node_class: entity
entity_id: ENT-structural-units
entity_label: Structural Units
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Entity: Structural Units

## Definition

Structural units (CEUs) are the fundamental evidence atoms of the PSEE system. Each unit is an artifact admitted by the IG pipeline and used as input to coverage and reconstruction computation.

## Count

30 admitted / 30 required

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | Count (30) + admissibility status |
| ZONE-2 | Count only ("30 core structural elements") |
| ZONE-3 | Full list with individual unit names |

Individual unit file names are technical artifacts not meaningful to executives.

## Source Artifact

[[ART-07 admissibility_log.json]]

## Related Claims

[[CLM-01 Structural Coverage Completeness]] [[CLM-02 Structural Unit Count]] [[CLM-07 Source Data Intake Complete]]
