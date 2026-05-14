# Governance Trace — 41.x Workspace Query Modes
## PI.41X.WORKSPACE-QUERY-MODES.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-QUERY-MODES.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Pre-flight

**Prior state:** `tier2_query_engine.py` returned `NOT_SUPPORTED / PROJECTION_ZONE_QUERY_NOT_SUPPORTED` for any `--projection` flag zone query (WHY/EVIDENCE/TRACE). `query.js` rejected PZ-NNN zone IDs (regex `^ZONE-\d{2}$` only).

**Data available in 41.x for query modes:**
- `pressure_zone_projection.json`: zone_class, zone_type, anchor_id, anchor_name, attribution_profile, embedded_pair_rules, member_entity_ids, candidate_ids, conditions[], signals[]
- `signal_projection.json`: per-condition records with signal_id, signal_authority, activation_state, signal_value, activation_method, zone_ids_where_active, attribution scopes

**No canonical_topology, signal_registry, or gauge_state required for projection zone queries.**

---

## Phase B — tier2_query_engine.py Implementation

### New functions

**`get_projection_zone_data(zone_id, client_id, run_id)`**
- Loads both 41.x artifacts, finds the named zone record
- Returns `(zone_record, sig_by_cond, combo_sig)` — `zone_record` is None if zone_id absent
- Raises `FileNotFoundError` if 41.x artifacts missing (fail-closed)

**`handle_projection_why(zone, sig_by_cond)`**
- Returns classification rationale: zone_class_trigger, attribution_profile, embedded_pair_rules, per-condition records
- Source: `41.x/pressure_zone_projection.json` + `41.x/signal_projection.json`

**`handle_projection_evidence(zone, sig_by_cond, combo_sig)`**
- Returns PSIG condition coverage: condition_id, signal_id, signal_authority, activation_state, signal_value, activation_method, attribution_role
- Source: `41.x/signal_projection.json`

**`handle_projection_trace(zone, sig_by_cond)`**
- Returns PZ→PSIG→condition_id paths; one path per condition in the zone
- No traversal outside projection data

**`build_projection_query_response(zone_id, mode, result, run_id)`**
- Wraps result with `inference_prohibition: ACTIVE`, `evidence_basis.canonical_topology_used: false`, `evidence_basis.signal_registry_used: false`

### `main()` change

Replaced `NOT_SUPPORTED` block with full routing:
- validates `--zone` and `--mode` present
- calls `get_projection_zone_data()`
- routes to `handle_projection_why` / `handle_projection_evidence` / `handle_projection_trace`
- all errors fail-closed with `sys.exit(1)`

---

## Phase C — API Wiring

### `query.js` changes

1. Converted to `async` with `promisify(execFile)` — eliminates "API resolved without sending a response" warning
2. Added `VALID_PROJECTION_ZONE = /^PZ-\d{3}$/` alongside existing `VALID_ZONE = /^ZONE-\d{2}$/`
3. Accepts `client` and `runId` query params
4. For PZ-NNN zones: requires `client` + `runId`; builds `--projection --client --run-id` args
5. For ZONE-NN zones: unchanged BlueEdge args

### `workspace.js` changes

`fireQuery` now detects PZ-XXX zones and adds projection params:
```javascript
const isPzZone = zone.zone_id?.startsWith('PZ-')
const queryUrl = (isPzZone && USE_SECOND_CLIENT)
  ? `/api/query?zone_id=${zone.zone_id}&mode=${mode}&client=${_SC_CLIENT_ID}&runId=${_SC_RUN_ID}`
  : `/api/query?zone_id=${zone.zone_id}&mode=${mode}`
```

BlueEdge zone queries unchanged (`ZONE-01` etc. → no projection params).

---

## Phase D — Validation

All 9 combinations (3 zones × 3 modes) validated:

| Zone / Mode | status | inference_prohibition | PSIG present | BlueEdge strings |
|---|---|---|---|---|
| PZ-001/WHY | ok | ACTIVE | True | False |
| PZ-001/EVIDENCE | ok | ACTIVE | True | False |
| PZ-001/TRACE | ok | ACTIVE | True | False |
| PZ-002/WHY | ok | ACTIVE | True | False |
| PZ-002/EVIDENCE | ok | ACTIVE | True | False |
| PZ-002/TRACE | ok | ACTIVE | True | False |
| PZ-003/WHY | ok | ACTIVE | True | False |
| PZ-003/EVIDENCE | ok | ACTIVE | True | False |
| PZ-003/TRACE | ok | ACTIVE | True | False |

No DOMAIN-XX leakage in any response. No fleet/driver/vehicle/blueedge strings. All responses contain PSIG-XXX provisional signal IDs only.

### BlueEdge regression

`ZONE-01/WHY`: `status=ok`, `run_id=run_authoritative_recomputed_01`, `inference_prohibition=ACTIVE` — unchanged.

### Sample WHY output (PZ-001)

```json
{
  "status": "ok", "zone_id": "PZ-001", "mode": "WHY",
  "inference_prohibition": "ACTIVE",
  "evidence_basis": { "source": "41.x projection only", "canonical_topology_used": false, "signal_registry_used": false },
  "result": {
    "zone_class": "COMPOUND_ZONE",
    "anchor": { "anchor_id": "DOM-03", "anchor_name": "backend_isolated" },
    "attribution_profile": "secondary",
    "condition_count": 3,
    "classification_rationale": [
      { "factor": "zone_class_trigger", "value": "COMPOUND_ZONE", "contribution": "condition_count >= 3 — three structural conditions co-present" },
      { "factor": "attribution_profile", "value": "secondary", ... },
      { "factor": "embedded_pair_rules", "value": ["COUPLING_ZONE", "PROPAGATION_ZONE", "RESPONSIBILITY_ZONE"], ... },
      { "factor": "condition_COND-PSIG-001-01", "value": { "signal_id": "PSIG-001", "activation_state": "HIGH", "signal_value": 9.43 }, ... },
      ...
    ]
  }
}
```

---

## No-Fallback Proof

- `--projection` flag → `tier2_data.configure()` never called → no BlueEdge package touched
- `get_projection_zone_data()` reads only `41.x/` artifacts
- `evidence_basis.canonical_topology_used: false` and `signal_registry_used: false` in every response
- Missing 41.x → `FileNotFoundError` → `NOT_AVAILABLE / 41X_ARTIFACT_MISSING` (exit 1)
- Missing zone_id in projection → `ZONE_NOT_FOUND` (exit 1)

---

## Remaining Blockers

1. **WhyResult / EvidenceResult / TraceResult UI rendering** — workspace.js renders query results via `WhyResult`, `EvidenceResult`, `TraceResult` components (lines ~480-482). These expect BlueEdge-specific response shapes (`classification_rationale`, `signal_coverage`, `paths`). Projection responses use the same top-level keys — visual rendering may need minor cosmetic guards for missing BlueEdge-only sub-fields.
2. **Report generation** — `lens_report_generator.py` still not parameterized for second client; separate contract required.

---

## Governance Confirmation

- 75.x artifacts not modified
- 41.x artifacts not modified
- Report generator not modified
- Vault / graph not modified
- No interpretation logic introduced
- No signals invented
- No BlueEdge fallback in projection query path
- Files modified: `scripts/pios/tier2_query_engine.py`, `app/gauge-product/pages/api/query.js`, `app/gauge-product/pages/tier2/workspace.js`
