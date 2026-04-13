# GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.01 — Post-Alignment Expectation

## What GAUGE reads after realignment

| data domain | reads from | via | run_id in response |
|-------------|------------|-----|--------------------|
| Score, coverage, reconstruction, execution_status | `gauge_state.json` | `/api/gauge` | `run_01_authoritative` |
| Topology nodes, edges, overlaps, signals | `binding_envelope.json` | `/api/topology` | `run_335c0575a080` (ACTION-05 required) |
| Executive decision layer | Derived in memory from both API responses | BOML resolver | N/A (derived) |
| Score decomposition display | Derived in memory from gaugeData | JSX expressions | Inherits from gaugeData.run_id |

No artifact is changed. Both API routes continue reading exactly what they read today. The change is entirely in how the UI consumes the API responses.

---

## How run_id is enforced

After realignment:

| surface | run_id source | displayed value |
|---------|--------------|-----------------|
| index.js header `Run:` | `gaugeData.run_id` from `/api/gauge` | `run_01_authoritative` |
| index.js raw state table `run_id` row | `gaugeData.run_id` from `/api/gauge` | `run_01_authoritative` |
| overview.js header sub | `gaugeData?.run_id` from `/api/gauge` | `run_01_authoritative` |
| Topology run context | `topoData.run_id` from `/api/topology` (post ACTION-05) | `run_335c0575a080` |

No hardcoded run_id strings remain. Both run identities are traceable to their authoritative artifacts.

---

## How score and topology remain consistent

The layered model does not require score and topology to share a run_id. Consistency is maintained by the declared derivation relationship:

- Chain B (`run_335c0575a080`) explicitly derives from Chain A (`run_01_authoritative`)
- This relationship is declared in `raw_input.json.__source_run_id`
- After realignment, the UI surfaces both run_ids — the derivation relationship is visible rather than hidden

Score and topology are consistent because:
1. Both APIs read the correct static committed artifacts
2. Both artifacts are internally consistent (verified in GAUGE.CONVERGENCE.RECONCILIATION.01)
3. No UI override can introduce inconsistency once hardcoding is removed

---

## State of each active UI surface after realignment

### index.js (Detailed Gauge page)

| panel | before | after |
|-------|--------|-------|
| Top bar — run identity | Hardcoded `run_01` | API: `gaugeData.run_id` = `run_01_authoritative` |
| Top bar — score grid | 3 hardcoded cells | API: canonical, projection, confidence from gaugeData |
| Left column — score decomposition | 3 hardcoded comp-blocks | API: dimensions + reconstruction from gaugeData |
| Left column — component detail | Hardcoded narrative values | API: same fields, text strings may remain (they describe absence, not values) |
| Right column — RuntimeIntelligence | API ✓ | Unchanged |
| Right column — StructuralMetrics | API ✓ | Unchanged |
| Right column — TopologySummaryPanel | API ✓ | Unchanged |
| Raw state disclosure table | Hardcoded (wrong run_id) | API: all fields from gaugeData |

### overview.js (Executive Overview page)

| element | before | after |
|---------|--------|-------|
| Header sub run identity | Hardcoded `run_01` | API: `gaugeData?.run_id` = `run_01_authoritative` |
| ExecutiveDecisionBlock | API-derived ✓ | Unchanged |
| ScoreGauge visual | API ✓ | Unchanged |
| StructuralGraph visual | API ✓ | Unchanged |
| StatusBand metrics | API ✓ | Unchanged |
| ExecHeader phrases | API → BOML ✓ | Unchanged |
| MeaningSection blocks | API → BOML ✓ | Unchanged |

---

## What does NOT change

- Artifact paths in /api/gauge and /api/topology — unchanged
- Artifact content — unchanged
- API response shape — unchanged (except topology gains `run_id` field via ACTION-05)
- BOML resolver and renderer logic — unchanged
- Business ontology config (concepts.json, phrases.json) — unchanged
- Topology page — not addressed in this analysis (separate surface)
- Score values, topology structure, all displayed data — unchanged (same artifacts, same values)

---

## Failure modes eliminated

| failure mode | eliminated by |
|-------------|---------------|
| Score display drifts from artifact after re-run | ACTION-01, ACTION-02 |
| Wrong run_id displayed (run_01 vs run_01_authoritative) | ACTION-01, ACTION-03, ACTION-04 |
| Topology run_id invisible to UI | ACTION-05 |
| Cross-run contamination impossible to detect | ACTION-05 (both run_ids now surfaced) |

---

## Remaining limitations (not addressed by realignment)

| limitation | reason not addressed |
|------------|---------------------|
| No runtime regeneration — artifacts remain static | Out of scope — no pipeline execution allowed |
| raw_input.json git status unverified | No git trace needed for UI realignment |
| Client path aliasing (blueedge vs UUID) unverified | No runtime cross-check mechanism exists; not introduced by this contract |
| Topology derivation relationship not displayed in UI | Requires new UI element — out of scope for minimal realignment |
