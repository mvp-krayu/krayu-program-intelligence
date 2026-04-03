# EX.2 — Run Metadata Exposure

**Stream:** EX.2 — Debug / Trace Interface
**Artifact type:** RUN METADATA EXPOSURE
**Date:** 2026-04-04
**Authority:** EX.2

---

## 1. PURPOSE

This document specifies which run metadata fields are exposed by EX.2, their
sources, and the relationship between the live engine invocation and the run
archives read by the debug surface.

---

## 2. RUN IDENTITY FIELDS

| Field | Source | Description |
|---|---|---|
| `debug_run_id` | `pios_bridge.get_live_pios_data()["run_id"]` | Unique ID for this engine invocation |
| `telemetry_source` | `pios_bridge.get_live_pios_data()["telemetry_source"]` | `STATIC_BASELINE` or `LIVE_TELEMETRY` |
| `signal_output_path` | Derived: `runs/pios/40.5/<run_id>/signal_output.json` | Relative path to CE.4 archive |
| `condition_output_path` | Derived: `runs/pios/40.6/<run_id>/condition_output.json` | Relative path to CE.5/CE.2 archive |

---

## 3. RUN ARCHIVE LOCATION SCHEME

Run archives are written by the engine during invocation. EX.2 reads them after
the engine completes. The location scheme is:

```
runs/
  pios/
    40.5/
      <run_id>/
        signal_output.json     ← CE.4 signal emission output (stream 40.5)
    40.6/
      <run_id>/
        condition_output.json  ← CE.5 consumption + CE.2 condition/diagnosis output (stream 40.6)
```

**EX.2 verifies archive existence before reading.** If either file is absent, the
adapter exits with a diagnostic error (no synthetic fallback).

---

## 4. RUN ID FORMAT

Run IDs observed in production and verification runs follow this pattern:

```
EX3_live_YYYYMMDD_HHMMSS
EX1_baseline_YYYYMMDD
EX1A_verification_YYYYMMDD
```

The format is governed by the engine invocation scripts, not by EX.2.

---

## 5. ENGINE INVOCATION RELATIONSHIP

EX.2 invokes the live engine via `pios_bridge.get_live_pios_data()`, which:
1. Generates a fresh `run_id`
2. Invokes `compute_signals.py <run_id>` → writes `runs/pios/40.5/<run_id>/signal_output.json`
3. Invokes `activate_conditions.py <run_id> <signal_path>` → writes `runs/pios/40.6/<run_id>/condition_output.json`
4. Returns `{"run_id": ..., "telemetry_source": ..., "signals": ..., ...}`

EX.2 then reads the run archives that the engine wrote (steps 2–3) to produce
the full debug payload. The `run_id` field is the join key.

**This means:** every `?debug=true` request creates a new run archive. This is
the expected behavior — the debug surface always reflects a fresh engine
invocation, not a cached state.

---

## 6. ARCHIVE STALENESS POLICY

EX.2 does NOT cache run archives. Each request invokes the engine fresh. The
`debug_run_id` field identifies which run is being surfaced. Consumers of the
debug endpoint should not assume consecutive requests return the same `run_id`.

---

## 7. RB-007 NOTE

Per EX.3 bypass_elimination_report.md (BYP-R-005), `validation_result.json` is
NOT produced per invocation via the bridge. EX.2 does not attempt to expose a
validation result file. This is a known open gap (IB-006 partial), not an EX.2
defect. The CE.4/CE.5/CE.2 vocabulary is validated by `pios_bridge` at invocation
time, but no persisted validation artifact is written.
