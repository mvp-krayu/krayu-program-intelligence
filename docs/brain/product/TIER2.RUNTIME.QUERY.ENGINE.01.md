# TIER2.RUNTIME.QUERY.ENGINE.01 — Minimum Viable Live Query Engine

**Stream:** TIER2.RUNTIME.QUERY.ENGINE.01  
**Authority:** brain/product  
**Status:** DEFINITION — NOT IMPLEMENTED  
**Depends on:** TIER2.WORKSPACE.MODEL.01 (17658b5), TIER2.TRACE.QUERY.CONTRACT.01, TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01

---

## Product Statement

This stream defines the first governed live interrogation slice for Tier-2. It is not the full workspace. It is the minimum runtime surface that converts Tier-2 from static HTML into a live, evidence-bounded query surface.

The first slice supports: WHY and EVIDENCE modes only.  
TRACE is explicitly deferred — it requires a traversal engine not present in the current baseline.

---

## A. QUERY API — Minimum Contract

**Endpoint:** `GET /api/query`

**Request parameters:**

| Parameter | Required | Values | Notes |
|---|---|---|---|
| `zone_id` | yes | `ZONE-01`, `ZONE-02`, ... | All modes require zone scoping |
| `mode` | yes | `WHY`, `EVIDENCE` | `TRACE` deferred to Phase 2 |
| `scope` | no | `FULL` (default) | EVIDENCE mode only |

**Request shape examples:**
```
GET /api/query?zone_id=ZONE-01&mode=WHY
GET /api/query?zone_id=ZONE-01&mode=EVIDENCE
GET /api/query?zone_id=ZONE-01&mode=EVIDENCE&scope=FULL
```

**Response shape (all modes):**
```json
{
  "status": "ok",
  "zone_id": "ZONE-01",
  "mode": "WHY",
  "run_id": "run_authoritative_recomputed_01",
  "inference_prohibition": "ACTIVE",
  "result": { ... mode-specific content ... },
  "evidence_basis": {
    "available": [ ... artifact references ... ],
    "missing":   [ ... missing evidence items ... ]
  },
  "uncertainty": {
    "unresolved": [ ... unresolved elements with reason ... ]
  }
}
```

**Error shape:**
```json
{
  "status": "error",
  "reason": "ZONE_NOT_FOUND | MODE_NOT_SUPPORTED | CANONICAL_DATA_MISSING | INVALID_PARAMS"
}
```

**Constraints:**
- `zone_id` must match a zone derivable from current canonical inputs — not a free parameter
- `mode=TRACE` returns `{"status":"error","reason":"MODE_NOT_SUPPORTED"}` in Phase 1
- Zone-scoped only — no cross-zone traversal
- No request body — GET only
- `inference_prohibition: "ACTIVE"` is always present in every success response

---

## B. QUERY TYPES — First Supported Subset

### Phase 1 (this stream)

**WHY — implement**
- Input: zone_id
- What it answers: why this zone was classified as zone_type — the structural derivation rationale
- Data sources: canonical_topology.json + signal_registry.json only
- No traversal required

**EVIDENCE — implement**
- Input: zone_id + scope (default FULL)
- What it answers: what evidence exists, what trace links are available, what is missing
- Data sources: signal_registry.json trace_links field for domain's signals
- No traversal required

### Phase 2 (deferred)

**TRACE — defer**
- Requires: tier2_trace_graph.py traversal engine (not yet built)
- Reason for deferral: the topology `edges` field contains only edge type labels, not actual adjacency data. Path construction requires inference from signal domain associations + capability containment — this is non-trivial traversal logic that cannot be done from a single field read.
- Deferred scope: traversal engine build, path resolution, INFERRED path declaration logic

---

## C. EVIDENCE ENFORCEMENT

Every `/api/query` response must enforce the following. This is not optional behavior — it is a structural invariant of the query engine.

**1. `inference_prohibition: "ACTIVE"` — mandatory top-level field**
- Present in every success response
- Not conditional on mode or result content

**2. Evidence support declaration — mandatory per claim**
- Every claim in `result` must reference its source field in the canonical data
- WHY result claims must cite which canonical attribute triggered each part of the rationale
- EVIDENCE result items must cite which signal's `trace_links` field they originate from

**3. Inferred path declaration — mandatory when present**
- Any path or structural relationship not directly supported by artifact evidence must be labeled `"type": "INFERRED"`
- INFERRED items must include a `"declaration"` field: one sentence stating what evidence would be required to confirm
- An INFERRED item may not be rendered as a confirmed structural fact

**4. Uncertainty declaration — mandatory**
- `uncertainty.unresolved` must be populated for every zone response
- For zones with no signals: the entire structural state of the domain is listed as unresolved
- For zones with partial signal coverage: specific unresolvable dimensions are listed
- An empty `uncertainty.unresolved` array is only valid if evidence is fully GROUNDED with STRONG confidence across all signals — which is not the case for either current zone

**5. Missing evidence — mandatory**
- `evidence_basis.missing` must be populated if any evidence gap exists
- Missing evidence is stated as structural fact: what is absent and what it prevents from being resolved
- Missing evidence declarations must not include advisory content about how to obtain the evidence

---

## D. RUNTIME DEPENDENCIES

### New components required (Phase 1):

| Component | Type | Purpose |
|---|---|---|
| `scripts/pios/tier2_query_engine.py` | Python module | WHY + EVIDENCE query handlers |
| `app/gauge-product/pages/api/query.js` | Next.js API route | HTTP wrapper for query engine |
| `app/gauge-product/pages/tier2/workspace.js` | Next.js page | Minimal workspace entry: zone list + query result panel |

### Existing artifacts reusable without change:

| Artifact | Reuse |
|---|---|
| `load_canonical_topology()` in lens_report_generator.py | Extract or duplicate loaders in query engine |
| `load_signal_registry()` in lens_report_generator.py | Same |
| `load_gauge_state()` in lens_report_generator.py | Same |
| `_derive_tier2_zones()` in lens_report_generator.py | Extract or call from query engine |
| `canonical_topology.json` | WHY and EVIDENCE data source |
| `signal_registry.json` | WHY and EVIDENCE data source |
| `gauge_state.json` | Context lock in response |

**Implementation choice for loaders:** Extract shared data-loading functions into `scripts/pios/tier2_data.py` (canonical data access module), imported by both generator and query engine. This avoids duplication without coupling.

### Deferred (not required for Phase 1):

| Component | Deferred to |
|---|---|
| `scripts/pios/tier2_trace_graph.py` | Phase 2 (TRACE mode) |
| Deep linking (`?zone=ZONE-01`) | Phase 2 |
| Workspace sidebar layout | Phase 2 |
| Zone filtering/sorting UI | Phase 2 |

---

## E. UI ENTRY — First Clickable Interaction

**Phase 1 surface:** a minimal `/tier2/workspace` page.

**What it shows on load:**
- Context lock (run ID, score, band, coverage status)
- Zone list — same zone set derived at report generation time, rendered as selectable cards
- Each zone card shows: zone_id, domain name, zone_type badge, severity badge, traceability badge

**First clickable interaction:**
- Each zone card has two action buttons: `WHY` and `EVIDENCE`
- Clicking either button fires `GET /api/query?zone_id=<id>&mode=<mode>`
- Result renders inline below the zone card — not a modal, not a new page
- Only one result panel open at a time per zone

**Result panel structure:**
- Mode label (WHY or EVIDENCE)
- inference_prohibition: ACTIVE badge (always first)
- Result content (structured, not free text)
- Uncertainty declaration (unresolved list)
- Missing evidence (if any)
- Clear/close button

**Tab model:** Not in Phase 1. Tabs (WHY / TRACE / EVIDENCE) are Phase 2, when TRACE becomes available. Phase 1 uses two buttons; TRACE button absent.

**Entry point from existing UI:**
- Add a "Diagnostic Workspace" link or button to the existing `ReportPanel` alongside the existing "Executive Report" and "Diagnostic" buttons
- This link navigates to `/tier2/workspace`
- The existing "Diagnostic" button (static HTML) remains — workspace is additive

---

## F. HARD BOUNDARIES — Phase 1 Exclusions

The following must not appear in the Phase 1 query engine or workspace:

| Excluded | Reason |
|---|---|
| TRACE mode | Traversal engine not built |
| Free-form text input | Not a query interface — parameterized modes only |
| Advisory output ("you should...") | inference_prohibition: ACTIVE |
| Root cause claims | Not derivable from evidence model |
| Cross-zone path traversal | Zone-scoped only |
| Global topology visualization | Zone-scoped only |
| Deep linking (`?zone=` URL param) | Phase 2 |
| Workspace sidebar layout | Phase 2 |
| Zone filtering/sorting | Phase 2 |
| Publish-safe variant of workspace | Phase 2 (static HTML publish variant already exists) |
| Session state / persistence | No workspace state stored server-side |
| LLM-generated text of any kind | All output constructed from canonical data only |

---

## Recommended First Implementation Sequence

1. **Extract data loaders** — create `scripts/pios/tier2_data.py` with `load_topology()`, `load_signals()`, `load_gauge()`, `derive_zones()` — shared by generator and query engine
2. **Build query engine** — `scripts/pios/tier2_query_engine.py` with `handle_why(zone)` and `handle_evidence(zone)` functions; enforce all evidence/uncertainty invariants
3. **Build API route** — `app/gauge-product/pages/api/query.js` — validates params, calls Python engine via execFile, returns response
4. **Build workspace page** — `app/gauge-product/pages/tier2/workspace.js` — derives zone set on load (calls generator or reads canonical data), renders zone cards with WHY + EVIDENCE buttons, wires to `/api/query`, renders result panels
5. **Wire entry point** — add "Diagnostic Workspace" button to existing `ReportPanel` in `lens.js`
6. **Validate** — run through ZONE-01 WHY, ZONE-01 EVIDENCE, ZONE-02 WHY, ZONE-02 EVIDENCE; confirm inference_prohibition present in all responses; confirm TRACE returns MODE_NOT_SUPPORTED

---

## Governance

- Authority: brain/product  
- Code status: NOT IMPLEMENTED (see brain/code/tier2_query_engine.md)  
- Canonical constraints: brain/canonical/tier2_query_engine.md  
- Publish variant: brain/publish/tier2_query_engine.md  
- inference_prohibition: ACTIVE
