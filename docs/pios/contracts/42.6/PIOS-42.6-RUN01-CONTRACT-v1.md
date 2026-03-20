# PIOS-42.6-RUN01-CONTRACT-v1
## ExecLens Landing-Page Executive Gauge Strip

**Run:** run_01_blueedge
**Layer:** 42.6 — Overview metrics / landing gauge strip
**Status:** PASS — all 20 validation checks passed

---

## Deliverables

| Deliverable | Path |
|-------------|------|
| Overview adapter | `scripts/pios/42.6/execlens_overview_adapter.py` |
| UI component | `app/execlens-demo/components/LandingGaugeStrip.js` |
| API route update | `app/execlens-demo/pages/api/execlens.js` |
| CSS styles | `app/execlens-demo/styles/globals.css` (`.lg-*` classes) |
| Validator | `scripts/pios/42.6/validate_overview_adapter.py` |

---

## Objectives Delivered

| Objective | Delivered |
|-----------|-----------|
| O1 Landing gauge strip | 4-card structural overview rendered above QuerySelector before query selection |
| O2 Governed extraction | All values extracted from signal registry via explicit deterministic rules — no synthesis |
| O3 Controlled failure | Extraction failure → null, not default; API failure → controlled error state |
| O4 Traceability | Each metric declares signal_id, source_field, extraction_rule — fully inspectable |

---

## Metrics Extracted (current run_01_blueedge values)

| Metric | Signal | Extraction Rule | Value | Fill | Scale | Confidence |
|--------|--------|----------------|-------|------|-------|------------|
| Dependency Load | SIG-003 | `r"computed at (0\.\d+)"` → statement | 0.682 | 68.2% | 0–1 | MODERATE |
| Structural Density | SIG-004 | `r"edge-to-node density \((\d+\.\d+)\)"` → statement | 1.273 | 63.6% | 0–2 (unity=1.0) | MODERATE |
| Coordination Pressure | SIG-005 | `r"static component of (0\.\d+)"` → statement | 0.875 | 87.5% | 0–1 | WEAK |
| Visibility Deficit | SIG-002 | `"Seven" in title → 7` (word map) → title | 7 | 100% | all 7/7 unknown | STRONG |

### Structural Density threshold marker
- Scale: 0–2 (unity threshold at 1.0)
- Threshold marker: 50% fill position (1.0 / 2.0 × 100)
- Value 1.273 exceeds unity → `EXCEEDS UNITY` badge rendered

---

## Extraction Architecture

```
LandingGaugeStrip.js
  └── /api/execlens?overview=true
        └── execlens_overview_adapter.py  [42.6]
              └── render_executive_narrative [42.2]
                    └── query_41_traversal  [42.1]
                          └── signal_registry.json  [41.x — read-only]
```

Rules:
- R1: All data via 42.2 → 42.1 module chain (no direct 41.x file access)
- R2: No synthetic values; extraction failure → null, not default
- R3: Deterministic extraction rules only (regex + word map)
- R4: Read-only; no file writes
- R5: JSON to stdout only

---

## Governing Rules Applied

| Rule | Application |
|------|-------------|
| G7 (explicit, inspectable) | Each metric's `extraction_rule` field is a human-readable description of the regex/word-map applied |
| Evidence-first | All values present in signal statements as of locked 41.x artifacts |
| Fail-closed | signal_not_found → null; extraction_failed → null; no defaults injected |

---

## Validation Summary

```
PIOS-42.6-RUN01-CONTRACT-v1 — Overview Adapter Validation
============================================================
AC-01  adapter exists at scripts/pios/42.6/execlens_overview_adapter.py
AC-02  LandingGaugeStrip.js exists
AC-03  API route dispatches ?overview=true
AC-04  API route references ADAPTER_42_6 (scripts/pios/42.6)
AC-05  index.js imports LandingGaugeStrip
AC-06  LandingGaugeStrip rendered before QuerySelector in JSX
AC-07  adapter runs cleanly
AC-08  metrics array has 4 entries
AC-09  all target signal IDs present: ['SIG-002', 'SIG-003', 'SIG-004', 'SIG-005']
AC-10  all metrics have declared extraction rules and valid status
R-01   dependency_load extraction pattern present
R-02   structural_density extraction pattern present
R-03   coordination_pressure extraction pattern present
R-04   visibility_deficit word-map (_WORD_TO_INT) present in adapter
R-05   extraction failure correctly returns null (not default)
R-06   structural_density threshold=1.0, threshold_fill_pct=50.0 declared
R-07   contract_id=PIOS-42.6-RUN01-CONTRACT-v1
R-08   .lg-strip and .lg-gauge-track present in globals.css
R-09   LandingGaugeStrip fetches correct endpoint
R-10   data access via 42.2 → 42.1 (no direct 41.x access)

Result: 20/20 checks passed
STATUS: PASS
```

---

## Boundary Declarations

- **Reads:** signal_registry.json via 42.1 module (through 42.2 import)
- **Writes:** none — read-only layer
- **New files:** adapter (42.6), component (LandingGaugeStrip.js), validator
- **Modified files:** `pages/api/execlens.js` (added ADAPTER_42_6 path + overview dispatch), `pages/index.js` (added LandingGaugeStrip between hero and QuerySelector), `styles/globals.css` (appended `.lg-*` styles)
- **Upstream layers:** 42.1, 42.2 — untouched
- **Canonical docs:** untouched
