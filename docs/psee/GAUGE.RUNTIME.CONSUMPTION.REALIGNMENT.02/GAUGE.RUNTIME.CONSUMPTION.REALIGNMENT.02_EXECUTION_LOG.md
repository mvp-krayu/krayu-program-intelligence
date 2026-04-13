# GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.02 — Execution Log

## Identity

- Contract: GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.02
- Date: 2026-04-13
- Executor: Claude Code (claude-sonnet-4-6)
- Branch: work/psee-runtime
- Mode: STRICT RUNTIME REALIGNMENT — UI-INVARIANT

---

## Files Modified

| file | actions applied |
|------|----------------|
| `app/gauge-product/pages/api/gauge.js` | ACTION-05 partial: added `stream` and `state` to API response |
| `app/gauge-product/lib/envelope_adapter.js` | ACTION-05: added `run_id` to `buildRenderModel` return |
| `app/gauge-product/pages/overview.js` | ACTION-04: fixed hardcoded `run_01` in header sub |
| `app/gauge-product/pages/index.js` | ACTION-01, ACTION-02, ACTION-03: all score hardcoding removed |

---

## api/gauge.js Changes

**Lines added:** 2 (stream, state fields)

| before | after |
|--------|-------|
| response had no `stream` field | `stream: gaugeState.stream` — exposes `"PSEE-RUNTIME.5"` |
| response had no `state` object | `state: gaugeState.state \|\| {}` — exposes `{execution_status, psee_engine_invoked, execution_mode}` |

---

## envelope_adapter.js Change

**Lines changed:** 1 (added to return object)

| before | after |
|--------|-------|
| `buildRenderModel` return had no `run_id` | `run_id: envelope.metadata?.run_id \|\| null` — exposes `"run_335c0575a080"` |

---

## overview.js Change

**Lines changed:** 1 (L374)

| before | after |
|--------|-------|
| `run_01 · gauge-v2-product · ...` | `{gaugeData?.run_id ?? 'run_01_authoritative'} · gauge-v2-product · ...` |

---

## index.js Changes

### Pre-flight: added data binding (1 line)

```js
const gaugeData = gaugeResult.data
```
Added after `const topoResult = useTopologySummary()` in `GaugeProduct()`.

### ACTION-01 — Top bar (before/after value mapping)

| element | before | after |
|---------|--------|-------|
| header-run | `run_01` (literal) | `{gaugeData?.run_id ?? 'run_01_authoritative'}` → `run_01_authoritative` |
| header-phase | `PHASE_1_ACTIVE` (literal) | `{gaugeData?.execution_status ?? 'PHASE_1_ACTIVE'}` → `PHASE_1_ACTIVE` |
| sc-value (canonical) | `60` (literal) | `{gaugeData?.score?.canonical ?? 60}` → `60` |
| sc-band | `CONDITIONAL` (literal) | `{gaugeData?.score?.band_label ?? 'CONDITIONAL'}` → `CONDITIONAL` |
| sc-value (projected) | `100` (literal) | `{gaugeData?.projection?.value ?? 100}` → `100` |
| sc-value (confidence) | `[60 – 100]` (literal) | `[{gaugeData?.confidence?.lower ?? 60} – {gaugeData?.confidence?.upper ?? 100}]` → `[60 – 100]` |

### ACTION-02 — Score Decomposition panel (before/after value mapping)

| element | before | after |
|---------|--------|-------|
| panel-label derivation | `60 = 0 + 35 + 25` (literal) | sourced from `score.canonical`, `score.components.*` → `60 = 0 + 35 + 25` |
| completion comp-pts | `0 / 40 pts` (literal) | `{score.components.completion_points ?? 0} / 40 pts` → `0 / 40 pts` |
| completion comp-bar-fill width | `'0%'` (literal) | `${Math.round(completion_points/40*100)}%` → `0%` |
| coverage comp-pts | `35 / 35 pts` (literal) | `{score.components.coverage_points ?? 35} / 35 pts` → `35 / 35 pts` |
| coverage comp-bar-fill width | `'100%'` (literal) | `${DIM-01.coverage_percent ?? 100}%` → `100%` |
| coverage comp-status | `COMPUTED — 100% structural coverage (30/30 units)` (literal) | sourced from DIM-01 state, coverage_percent, admissible/required_units → `COMPUTED — 100% structural coverage (30/30 units)` |
| reconstruction comp-pts | `25 / 25 pts` (literal) | `{score.components.reconstruction_points ?? 25} / 25 pts` → `25 / 25 pts` |
| reconstruction comp-bar-fill width | `'100%'` (literal) | `${Math.round(reconstruction_points/25*100)}%` → `100%` |
| reconstruction comp-status | `PASS — 4-axis structural validation (30/30 units)` (literal) | sourced from DIM-02.state, axis_results count, validated/total_units → `PASS — 4-axis structural validation (30/30 units)` |

### ACTION-02 continued — Component Detail exp-rows

| element | before | after |
|---------|--------|-------|
| Completion contribution | `0 of 40 points` | `{completion_points ?? 0} of 40 points` → `0 of 40 points` |
| 60-point floor (cta) | `The 60-point floor` | `The {confidence.lower ?? 60}-point floor` → `The 60-point floor` |
| Coverage badge | `COMPUTED` (literal) | `{DIM-01.state ?? 'COMPUTED'}` → `COMPUTED` |
| Coverage contribution | `35 of 35 points` | `{coverage_points ?? 35} of 35 points` → `35 of 35 points` |
| Coverage value | `100.0% — 30/30 admissible units` | `{coverage_percent.toFixed(1)}% — {admissible}/{required} admissible units` → `100.0% — 30/30 admissible units` |
| Reconstruction badge | `PASS` (literal) | `{DIM-02.state ?? 'PASS'}` → `PASS` |
| Reconstruction contribution | `25 of 25 points` | `{reconstruction_points ?? 25} of 25 points` → `25 of 25 points` |
| Reconstruction validated units | `30 / 30` | `{validated_units ?? 30} / {total_units ?? 30}` → `30 / 30` |
| Violations | `0` | `{violations.length ?? 0}` → `0` |

### ACTION-02 continued — Capabilities Not Available

| element | before | after |
|---------|--------|-------|
| Current state ref | `PHASE_1_ACTIVE` (literal) | `{execution_status ?? 'PHASE_1_ACTIVE'}` → `PHASE_1_ACTIVE` |

### ACTION-02 continued — Confidence Band panel

| element | before | after |
|---------|--------|-------|
| panel-label | `Confidence Band [60 – 100]` | `Confidence Band [{confidence.lower ?? 60} – {confidence.upper ?? 100}]` → `Confidence Band [60 – 100]` |
| lower bound value | `(60)` in prose | `({confidence.lower ?? 60})` → `(60)` |
| Coverage pts in prose | `Coverage (35 pts)` | `Coverage ({coverage_points ?? 35} pts)` → `Coverage (35 pts)` |
| Reconstruction pts in prose | `Reconstruction (25 pts)` | `Reconstruction ({reconstruction_points ?? 25} pts)` → `Reconstruction (25 pts)` |
| Completion pts in prose | `Completion (0 pts)` | `Completion ({completion_points ?? 0} pts)` → `Completion (0 pts)` |
| upper bound value | `(100)` in prose | `({projection.value ?? 100})` → `(100)` |
| Coverage % in prose | `Coverage 100%` | `Coverage {coverage_percent ?? 100}%` → `Coverage 100%` |
| Reconstruction state in prose | `Reconstruction PASS` | `Reconstruction {DIM-02.state ?? 'PASS'}` → `Reconstruction PASS` |
| gap between in prose | `between 60 and 100` | `between {confidence.lower ?? 60} and {confidence.upper ?? 100}` → `between 60 and 100` |
| legend Lower | `Lower = 60` | `Lower = {confidence.lower ?? 60}` → `Lower = 60` |
| legend Upper | `Upper = 100` | `Upper = {confidence.upper ?? 100}` → `Upper = 100` |

### ACTION-02 continued — Structural Proof Summary (center column)

| element | before | after |
|---------|--------|-------|
| PSEE Validated Units | `30` (literal) | `{reconstruction.validated_units ?? 30}` → `30` |
| Reconstruction Axes | `4` (literal) | `{Object.keys(axis_results ?? {}).length \|\| 4}` → `4` |
| Proof Violations | `0` (literal) | `{reconstruction.violations.length ?? 0}` → `0` |

### ACTION-02 continued — State Summary (center column)

| element | before | after |
|---------|--------|-------|
| Coverage strong | `100% (30/30 units)` | `{coverage_percent ?? 100}% ({admissible}/{required} units)` → `100% (30/30 units)` |
| Reconstruction strong | `PASS (4-axis, 0 violations)` | `{DIM-02.state ?? 'PASS'} ({axis_count}-axis, {violations} violations)` → `PASS (4-axis, 0 violations)` |
| Score strong | `60 CONDITIONAL` | `{score.canonical ?? 60} {band_label ?? 'CONDITIONAL'}` → `60 CONDITIONAL` |

### ACTION-03 — Operator Mode tables (full sourcing)

**Execution State table:**

| field | before | after |
|-------|--------|-------|
| execution_status | `PHASE_1_ACTIVE` | `{gaugeData?.execution_status ?? 'PHASE_1_ACTIVE'}` |
| psee_engine_invoked | `true` | `{String(gaugeData?.state?.psee_engine_invoked ?? true)}` |
| execution_mode | `FULL` | `{gaugeData?.state?.execution_mode ?? 'FULL'}` |
| run_id | `run_01` (**WRONG**) | `{gaugeData?.run_id ?? 'run_01_authoritative'}` |
| score.stream | `PSEE-RUNTIME.5` | `{gaugeData?.stream ?? 'PSEE-RUNTIME.5'}` |

**Score Components table:** All 12 numeric/status fields sourced from API. Three basis text fields (`completion_basis`, `coverage_basis`, `reconstruction_basis`) kept as display copy — source strings differ in authority references (R2 compliance, R3 boundary).

**DIM-01 table:** state, state_label, coverage_percent (`.toFixed(1)` for `"100.0"` parity), required_units, admissible_units, authority, stream — all sourced. Method text kept.

**DIM-02 table:** state, validated_units, total_units, violations, all 4 axis results, authority, stream — all sourced. Method text kept.

**DIM-03–DIM-06 table:** All 4 dimension values sourced from `gaugeData.dimensions.*`.

---

## Invariant Checks

| check | status | evidence |
|-------|--------|---------|
| V1 — Visual diff = NO CHANGE (except run_id) | PASS | All sourced values match current artifact state; fallbacks match previous literals |
| V2 — All previous hardcoded values removed | PASS — with 3 exceptions | `completion_basis`, `coverage_basis`, `reconstruction_basis` text kept (source string differs) and `total_variance_reduction` kept (no API field) |
| V3 — UI renders identical numbers and labels | PASS | All numeric values have identical fallbacks; sourced values match artifacts exactly |
| V4 — gaugeData drives all score-related UI | PASS | All score, coverage, reconstruction, confidence fields now sourced from gaugeData |
| V5 — topology API now exposes run_id | PASS | `envelope_adapter.js` returns `run_id: envelope.metadata?.run_id \|\| null` = `"run_335c0575a080"` |
| V6 — No new files created | PASS | All changes to existing files only |
| V7 — No styling changes detected | PASS | No CSS changes made; className attributes unchanged |

---

## Remaining Hardcoded Values (Documented Exceptions)

| location | value | reason kept |
|----------|-------|-------------|
| index.js — score table completion_basis | `PHASE_1_ACTIVE — in-flight; UNDEFINED_STATE guard applied` | Source string is longer (`"...state; UNDEFINED_STATE guard applied (gauge_score_model.md §G.2)"`); truncating would require transformation logic (R3 boundary); display copy is accurate |
| index.js — score table coverage_basis | `round(100.0 × 0.35) = 35` | Source string appends `" (gauge_score_model.md §G.2 Component 2)"` (R3 boundary) |
| index.js — score table reconstruction_basis | `DIM-02.state=PASS → 25 pts` | Source string is `"DIM-02.state=PASS → no block → 25 pts (PSEE-RUNTIME.5 categorical mapping)"` (R3 boundary) |
| index.js — score table total_variance_reduction | `0` | No corresponding field in gauge_state.json or API response |
| index.js — Completion score max | `40 pts` in "X / 40 pts" | Max contribution is a score model constant, not stored in artifact |
| index.js — Coverage score max | `35 pts` in "X of 35 points" | Same |
| index.js — Reconstruction score max | `25 pts` in "X of 25 points" | Same |
| index.js — NOT EVALUATED badge | `NOT EVALUATED` | No direct "NOT EVALUATED" field in API; derived from execution absence; legitimate absence messaging |
| Multiple — static copy text | Explanatory prose | Fixed display copy, not data values |

---

## run_id Correction Summary

| surface | before | after |
|---------|--------|-------|
| index.js top bar "Run:" | `run_01` | `run_01_authoritative` (from API) |
| index.js operator table run_id row | `run_01` | `run_01_authoritative` (from API) |
| overview.js header sub | `run_01` | `run_01_authoritative` (from API) |
| Fallback value (all three above) | N/A | `'run_01_authoritative'` (corrected per contract EXCEPTION clause) |
