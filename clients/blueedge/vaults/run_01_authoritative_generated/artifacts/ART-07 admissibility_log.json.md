---
node_class: artifact
artifact_id: ART-07
artifact_name: admissibility_log.json
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Purpose
IG pipeline admissibility decisions. Records which artifacts were admitted or excluded and why.

## Status for This Run

Admissibility log not found in run package. Unit count (30) sourced from gauge_state.json DIM-01.

## Key Fields
- `entries`: per-artifact decisions (ADMITTED / EXCLUDED)
- `summary.admitted`: 30
- `summary.excluded`: N/A

## Claims Grounded
[[CLM-02 Structural Unit Count]] [[CLM-07 Source Data Intake Complete]]
