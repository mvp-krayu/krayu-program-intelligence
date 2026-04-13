# GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.01 — Realignment Actions

## Constraints

- No new files
- No artifact regeneration
- No pipeline execution
- No structural rewrite
- Each action must be atomic, reversible, evidence-based

---

## ACTION-01 — Remove hardcoded score header block in index.js

**Target:** `pages/index.js` — `top-bar` block (L199–L228)

**Violation addressed:** V1

**Current state (hardcoded):**
```jsx
<div className="header-run">Run: run_01</div>
<div className="header-phase">Execution Phase: PHASE_1_ACTIVE</div>
...
<div className="sc-value">60</div>
<div className="sc-band">CONDITIONAL</div>
...
<div className="sc-value">100</div>
...
<div className="sc-value" style={{ fontSize: '22px', paddingTop: '4px' }}>[60 – 100]</div>
```

**Target state (API-read):**
```jsx
<div className="header-run">Run: {gaugeData?.run_id ?? '—'}</div>
<div className="header-phase">Execution Phase: {gaugeData?.execution_status ?? '—'}</div>
...
<div className="sc-value">{gaugeData?.score?.canonical ?? '—'}</div>
<div className="sc-band">{gaugeData?.score?.band_label ?? '—'}</div>
...
<div className="sc-value">{gaugeData?.projection?.value ?? '—'}</div>
...
<div className="sc-value" style={{ fontSize: '22px', paddingTop: '4px' }}>
  [{gaugeData?.confidence?.lower ?? '—'} – {gaugeData?.confidence?.upper ?? '—'}]
</div>
```

**Requires:** `gaugeData` prop or hook access in the component that renders the top-bar.

**Evidence basis:** `/api/gauge` returns `run_id`, `execution_status`, `score.canonical`, `score.band_label`, `projection.value`, `confidence.lower`, `confidence.upper` — all fields are present in the current API response shape (confirmed from api/gauge.js:46–57).

**Reversibility:** Fully reversible — replacing JSX expressions with literals is a one-line change per field.

---

## ACTION-02 — Remove hardcoded score decomposition blocks in index.js

**Target:** `pages/index.js` — `comp-block` section (L238–L274)

**Violation addressed:** V1

**Current state (hardcoded):**
```jsx
<div className="panel-label">Score Decomposition (60 = 0 + 35 + 25)</div>
<div className="comp-pts" style={{ color: '#8b949e' }}>0 / 40 pts</div>
<div className="comp-status">NOT EVALUATED — execution layer not performed</div>
<div className="comp-pts" style={{ color: '#3fb950' }}>35 / 35 pts</div>
<div className="comp-status" style={{ color: '#3fb950' }}>COMPUTED — 100% structural coverage (30/30 units)</div>
<div className="comp-pts" style={{ color: '#3fb950' }}>25 / 25 pts</div>
<div className="comp-status" style={{ color: '#3fb950' }}>PASS — 4-axis structural validation (30/30 units)</div>
```

**Target state (API-read):**

Coverage:
- `gaugeData?.dimensions?.['DIM-01']?.coverage_percent` → coverage percent
- `gaugeData?.dimensions?.['DIM-01']?.admissible_units` → unit count
- `gaugeData?.dimensions?.['DIM-01']?.state_label ?? gaugeData?.dimensions?.['DIM-01']?.state` → COMPUTED/FULL

Reconstruction:
- `gaugeData?.dimensions?.['DIM-02']?.state` → PASS/FAIL
- `gaugeData?.reconstruction?.validated_units` → unit count
- `Object.keys(gaugeData?.reconstruction?.axis_results ?? {}).length` → axis count

Completion:
- `gaugeData?.dimensions?.['DIM-03']?.state` → NOT EVALUATED / state
- `gaugeData?.dimensions?.['DIM-03']?.value ?? 0` → contribution points

**Note on score derivation label:** `Score Decomposition (60 = 0 + 35 + 25)` can be derived as:
`Score Decomposition (${canonical} = ${completionPts} + ${coveragePts} + ${reconstructionPts})`
All point values are in `gauge_state.json.dimensions.*`.

**Evidence basis:** All fields confirmed present in gauge_state.json (from GAUGE.EXECUTABLE.PROVENANCE.RUN.01 trace). `/api/gauge` returns full `dimensions` object, `reconstruction` object.

**Reversibility:** Fully reversible.

---

## ACTION-03 — Remove hardcoded raw state disclosure table in index.js

**Target:** `pages/index.js` — raw state `<details>` block (~L408–L450)

**Violation addressed:** V1, V4 (wrong run_id)

**Current state (hardcoded, including wrong run_id):**
```jsx
<tr><td>run_id</td><td>run_01</td></tr>
<tr><td>execution_status</td><td>PHASE_1_ACTIVE</td></tr>
<tr><td>canonical_score</td><td>60</td></tr>
...
```

**Target state:** Replace each literal value with its API field:

| row | current value | API field |
|-----|--------------|-----------|
| run_id | `run_01` | `gaugeData?.run_id` |
| execution_status | `PHASE_1_ACTIVE` | `gaugeData?.execution_status` |
| canonical_score | `60` | `gaugeData?.score?.canonical` |
| band_label | `CONDITIONAL` | `gaugeData?.score?.band_label` |
| derivation | `0 + 35 + 25 = 60` | derived from dimensions |
| confidence_lower | `60` | `gaugeData?.confidence?.lower` |
| confidence_upper | `100` | `gaugeData?.confidence?.upper` |

**Note:** `psee_engine_invoked`, `execution_mode`, `score.stream` — these fields are NOT in the current API response shape. They may need to be either added to the `/api/gauge` response (no new files required — api/gauge.js can read from existing `engine_state.json`) or this table row should display `gaugeData?.source` as provenance instead.

**Evidence basis:** `engine_state.json` exists in the package dir at `clients/blueedge/psee/runs/run_01_authoritative/package/engine_state.json` — readable by api/gauge.js without any new file or structural change.

**Reversibility:** Fully reversible.

---

## ACTION-04 — Fix hardcoded run_id in overview.js header

**Target:** `pages/overview.js` L374

**Violation addressed:** V5 (hardcoded wrong run_id)

**Current state:**
```jsx
<div className="ov-header-sub">run_01 · gauge-v2-product · PSEE.BLUEEDGE.GAUGE.HANDOFF.01</div>
```

**Target state:**
```jsx
<div className="ov-header-sub">{gaugeData?.run_id ?? 'run_01'} · gauge-v2-product · PSEE.BLUEEDGE.GAUGE.HANDOFF.01</div>
```

`gaugeData` is already available in `OverviewPage` (declared L344: `const { data: gaugeData, ... } = useGaugeData()`). No new hook or prop needed.

**Evidence basis:** `/api/gauge` returns `run_id: "run_01_authoritative"`. Current display `run_01` is truncated and incorrect. `gaugeData` is in scope at the render location.

**Reversibility:** Single expression substitution, fully reversible.

---

## ACTION-05 — Surface run_id in /api/topology response

**Target:** `app/gauge-product/lib/envelope_adapter.js` — `buildRenderModel` return object (L290–L309)

**Violation addressed:** V4 (run_id not surfaced in topology API)

**Current state:** `buildRenderModel` return does not include `run_id`. The value exists at `envelope.metadata.run_id = "run_335c0575a080"` but is not passed through.

**Target state:** Add one field to the return object:
```javascript
return {
  envelope:               true,
  run_id:                 envelope.metadata?.run_id || null,   // ADD THIS
  contract_id:            CONTRACT_ID,
  ...
}
```

**Evidence basis:** `envelope.metadata.run_id` confirmed present at value `"run_335c0575a080"` (verified 2026-04-13 via python3 inspection). `buildRenderModel` has direct access to `envelope` at the return statement.

**Reversibility:** Removing the single added field restores original behavior. No downstream code currently reads `topoData.run_id` (it does not exist today), so adding it is additive only.

**Post-add behavior:** `/api/topology` response includes `run_id: "run_335c0575a080"`. UI can display it alongside `gaugeData.run_id` for lineage display without hardcoding.

---

## Actions Not Required

| action considered | reason excluded |
|------------------|-----------------|
| Change /api/gauge artifact path | Path is correct — `run_01_authoritative` is the canonical score source |
| Change /api/topology artifact path | Path is correct — `run_335c0575a080` is the canonical topology source |
| Create merged endpoint | No combined artifact exists; creating one would be new pipeline (prohibited) |
| Modify upstream JSON artifacts | No regeneration allowed |
| Add .env file for path overrides | No env override is needed — paths are correct |

---

## Action Priority

| action | violation | impact | effort |
|--------|-----------|--------|--------|
| ACTION-04 | V5 — wrong run_id in overview.js | Fixes incorrect run identity display | 1 line |
| ACTION-05 | V4 — topology run_id not surfaced | Enables lineage display; unblocks further UI work | 1 line |
| ACTION-01 | V1 — score header hardcoded | Removes most visible hardcoding | ~15 expressions |
| ACTION-02 | V1 — decomposition hardcoded | Removes remaining score hardcoding | ~10 expressions |
| ACTION-03 | V1, V4 — raw state table hardcoded + wrong run_id | Removes last hardcoded block | ~10 table rows |
