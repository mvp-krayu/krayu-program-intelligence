# tier2_query_engine — Code Brain: Tier-2 Query Engine Implementation Spec

**Authority:** brain/code  
**Stream:** TIER2.RUNTIME.QUERY.ENGINE.01  
**Implementation Status:** PHASE 1 IMPLEMENTED (WHY + EVIDENCE operational)  
**Updated:** 2026-04-23 (BRAIN.RECONCILE.LENS.TIER2.01)  
**Phase 1 scope:** WHY + EVIDENCE modes — complete  
**Deferred:** TRACE mode, workspace UI interaction, traversal engine

---

## Files Created (Phase 1 — implemented)

### 1. `scripts/pios/tier2_data.py`
Shared canonical data access module. Extracted from lens_report_generator.py loaders. Imported by both the generator and the query engine.

```python
# Public API:
def load_topology() -> Dict          # reads canonical_topology.json
def load_signals() -> Dict           # reads signal_registry.json
def load_gauge() -> Dict             # reads gauge_state.json
def derive_zones(topology, signals) -> List[Dict]  # deterministic zone set
def get_zone(zone_id: str, topology, signals) -> Optional[Dict]  # single zone lookup
```

Constants to expose:
```python
CANONICAL_PKG_DIR: Path
FOCUS_DOMAIN: str  # "DOMAIN-10"
RUN_ID: str        # "run_authoritative_recomputed_01"
```

---

### 2. `scripts/pios/tier2_query_engine.py`
Query handler module. Called by the API route via execFile, receives params as CLI args, prints JSON to stdout.

```python
# CLI:
# python3 tier2_query_engine.py --zone ZONE-01 --mode WHY
# python3 tier2_query_engine.py --zone ZONE-01 --mode EVIDENCE
# python3 tier2_query_engine.py --zone ZONE-01 --mode TRACE  → error: MODE_NOT_SUPPORTED

# Public functions:
def handle_why(zone: Dict) -> Dict     # returns result dict for WHY mode
def handle_evidence(zone: Dict) -> Dict  # returns result dict for EVIDENCE mode
def build_response(zone_id, mode, result, zone) -> Dict  # assembles full response envelope
def main() -> None                      # parses args, dispatches, prints JSON
```

**`handle_why(zone)` output structure:**
```json
{
  "zone_type": "pressure_concentration",
  "classification_rationale": [
    {
      "factor": "focus_domain",
      "value": true,
      "source": "domain_id == FOCUS_DOMAIN"
    },
    {
      "factor": "grounding",
      "value": "WEAKLY GROUNDED",
      "source": "domain.grounding"
    },
    {
      "factor": "signal_count",
      "value": 2,
      "source": "signal_registry filtered by domain_id"
    },
    {
      "factor": "highest_confidence",
      "value": "STRONG",
      "source": "signal.evidence_confidence"
    }
  ],
  "structural_scope": {
    "capability_count": 4,
    "capability_ids": ["CAP-26", "CAP-27", "CAP-28", "CAP-29"],
    "source": "domain.capability_ids"
  }
}
```

**`handle_evidence(zone)` output structure:**
```json
{
  "signal_coverage": [
    {
      "signal_id": "SIG-002",
      "evidence_confidence": "STRONG",
      "trace_link_count": 3,
      "trace_links": ["...", "...", "..."]
    }
  ],
  "total_trace_links": 6
}
```

**`build_response()` full envelope (invariants enforced here):**
```python
def build_response(zone_id, mode, result, zone):
    return {
        "status": "ok",
        "zone_id": zone_id,
        "mode": mode,
        "run_id": RUN_ID,
        "inference_prohibition": "ACTIVE",   # always present, always first
        "result": result,
        "evidence_basis": {
            "available": _build_available(zone),
            "missing":   _build_missing(zone),
        },
        "uncertainty": {
            "unresolved": _build_unresolved(zone),
        },
    }
```

**Invariant enforcement in `build_response()`:**
- `inference_prohibition: "ACTIVE"` — hardcoded, not configurable
- `uncertainty.unresolved` — must never be empty for a WEAKLY GROUNDED zone (assert at construction time)
- `evidence_basis.missing` — populated from signal absence + missing trace links
- No field may contain advisory text — use template strings from a constants module, not generated text

---

### 3. `app/gauge-product/pages/api/query.js`
Next.js API route. Thin wrapper — no logic beyond parameter validation and subprocess call.

```javascript
// GET /api/query?zone_id=ZONE-01&mode=WHY
//
// Validates: zone_id present, mode in ['WHY','EVIDENCE'] for Phase 1
// Calls:     python3 scripts/pios/tier2_query_engine.py --zone <id> --mode <mode>
// Returns:   JSON from stdout, or error shape on failure
//
// TRACE returns: {status:'error', reason:'MODE_NOT_SUPPORTED'}

const SUPPORTED_MODES = new Set(['WHY', 'EVIDENCE'])

// Timeout: 15s (engine reads 3 files, no traversal)
```

Parameter validation rules:
- `zone_id` must match `/^ZONE-\d{2}$/`
- `mode` must be in `SUPPORTED_MODES` (TRACE → `MODE_NOT_SUPPORTED`)
- Any extra parameters ignored

---

### 4. `app/gauge-product/pages/tier2/workspace.js`
Minimal workspace page. Zone list + per-zone WHY/EVIDENCE query panel.

```
Page structure:
  <WorkspaceHeader>  — run_id, score, band, coverage status
  <ZoneList>
    <ZoneCard zone={zone} key={zone.zone_id}>
      — zone_id, domain, type/severity/confidence/traceability badges
      — [WHY] [EVIDENCE] buttons
      — <QueryResultPanel> (appears below card on query, null initially)
    </ZoneCard>
  </ZoneList>
```

State per zone card:
```javascript
const [queryState, setQueryState] = useState(null)
// null | 'loading' | { mode, result } | { error }
```

Query fire:
```javascript
async function fireQuery(zoneId, mode) {
  setQueryState('loading')
  const res = await fetch(`/api/query?zone_id=${zoneId}&mode=${mode}`)
  const data = await res.json()
  setQueryState(res.ok && data.status === 'ok'
    ? { mode, result: data }
    : { error: data.reason || 'QUERY_FAILED' })
}
```

**QueryResultPanel rendering rules:**
- Always shows `inference_prohibition: ACTIVE` badge first
- WHY: renders `result.classification_rationale` as a factor table
- EVIDENCE: renders `result.signal_coverage` + `evidence_basis.missing`
- Both: renders `uncertainty.unresolved` list at bottom
- No advisory framing around any field

---

### 5. Entry point addition in `app/gauge-product/pages/lens.js`

Add "Diagnostic Workspace" button to `ReportPanel` after existing buttons:
```jsx
<button
  className="lens-report-action-btn lens-report-workspace"
  onClick={() => window.open('/tier2/workspace')}
>
  Diagnostic Workspace
</button>
```

Add `.lens-report-workspace` style to `gauge.css`:  
Use blue-teal accent distinct from `.lens-report-narrative` — e.g., `color:#4a9b7a` (teal).

---

## Data Flow Diagram

```
User clicks [WHY] on ZONE-01
  → GET /api/query?zone_id=ZONE-01&mode=WHY
    → query.js validates params
    → execFile python3 tier2_query_engine.py --zone ZONE-01 --mode WHY
      → tier2_query_engine.py imports tier2_data.py
        → load_topology() reads canonical_topology.json
        → load_signals() reads signal_registry.json
        → get_zone("ZONE-01") derives zone struct
        → handle_why(zone) builds result
        → build_response() enforces invariants, adds evidence_basis + uncertainty
        → prints JSON to stdout
    → query.js parses stdout → returns 200 JSON
  → QueryResultPanel renders: inference_prohibition badge + rationale table + unresolved list
```

---

## Validation Checklist (after implementation)

- [ ] ZONE-01 WHY: returns classification_rationale with 4 factors, structural_scope with 4 caps
- [ ] ZONE-02 WHY: returns evidence_gap rationale, 0 signals, MODERATE severity
- [ ] ZONE-01 EVIDENCE: returns 2 signals, 6 trace links total
- [ ] ZONE-02 EVIDENCE: returns 0 signals, missing evidence populated
- [ ] All 4 responses: `inference_prohibition: "ACTIVE"` present
- [ ] All 4 responses: `uncertainty.unresolved` non-empty
- [ ] TRACE mode: returns `{status:"error", reason:"MODE_NOT_SUPPORTED"}`
- [ ] Invalid zone_id: returns `{status:"error", reason:"ZONE_NOT_FOUND"}`
- [ ] Missing canonical data: returns `{status:"error", reason:"CANONICAL_DATA_MISSING"}`

---

## What Remains Deferred (Phase 2)

- `scripts/pios/tier2_trace_graph.py` — traversal engine for TRACE mode
- TRACE mode activation in query.js and workspace.js
- Deep linking (`?zone=ZONE-01` URL param routing)
- Zone filtering/sorting UI in workspace
- Workspace sidebar layout (zone list always visible during investigation)
- Publish-safe workspace variant
