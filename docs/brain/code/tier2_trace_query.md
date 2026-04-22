# Brain Node — Code
# Tier-2 Evidence Interrogation Layer — Trace Graph and Query Engine

**Authority:** TIER2.TRACE.QUERY.CONTRACT.01
**Brain:** CODE
**Status:** NOT IMPLEMENTED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.TRACE.QUERY.CONTRACT.01.md

---

## IMPLEMENTATION STATUS

**NOT IMPLEMENTED**

No trace graph builder, query engine, or query API exists at the time of this definition.

---

## REQUIRED IMPLEMENTATION UNITS

### 1. Trace graph builder

```
File:     scripts/pios/tier2_trace_graph.py  (new)
Purpose:  Construct in-memory trace graph from canonical data sources.
Inputs:
  canonical_topology.json   → DOMAIN, CAPABILITY, COMPONENT nodes + DEPENDENCY edges
  signal_registry.json      → SIGNAL, ARTIFACT nodes + SIGNAL_EMISSION, EVIDENCE_LINK edges
  gauge_state.json          → GAUGE singleton node
Output:   In-memory graph object (not persisted)
Rules:
  - Deterministic: same inputs → same graph
  - Stateless: graph not cached between queries
  - No invented nodes or edges
```

### 2. Traversal engine

```
File:     scripts/pios/tier2_trace_graph.py  (within same module)
Purpose:  Execute WHY / TRACE / EVIDENCE traversal per query model.
Inputs:   query_type, query_params, graph object
Output:   Structured response object per Response Model
Rules:
  - depth_limit enforced (max 5)
  - Inferred segments declared with inferred_declaration
  - uncertainty_declaration present in all responses
  - BOUNDED_RESPONSE_FAILURE returned on non-conforming result
```

### 3. Query API endpoint

```
File:     app/gauge-product/pages/api/query.js  (new)
Method:   GET
Routes:
  /api/query?type=WHY&zone_id={zone_id}
  /api/query?type=WHY&zone_id={zone_id}&condition_id={condition_id}
  /api/query?type=TRACE&entry_node={node_id}&direction={dir}&depth={n}
  /api/query?type=EVIDENCE&zone_id={zone_id}&scope={FULL|BOUNDED}
Output:   JSON per Response Model
Rules:
  - zone_id must exist in Tier-2 Diagnostic Narrative zone inventory
  - Entry node must be valid canonical node ID
  - Stack traces not exposed
  - All four response fields required: structural_explanation,
    trace_paths, evidence_references, uncertainty_declaration
```

### 4. Zone entry precondition validator

```
File:     app/gauge-product/pages/api/query.js  (within handler)
Purpose:  Validate zone_id exists in the most recently generated Tier-2 Diagnostic Narrative.
Fail:     Return 400 { status: "error", reason: "ZONE_NOT_IN_NARRATIVE" }
```

### 5. Response renderer (optional, for UI)

```
File:     app/gauge-product/components/lens/Tier2QueryPanel.js  (new)
Purpose:  Render structured query response as HTML panel.
Rules:
  - Inferred path segments visually distinguished
  - inference_prohibition: ACTIVE visible in uncertainty block
  - No free-form text; all content from response object fields
```

---

## BLOCKING DEPENDENCIES

| Dependency | Status |
|---|---|
| `canonical_topology.json` | EXISTS ✓ |
| `signal_registry.json` | EXISTS ✓ |
| `gauge_state.json` | EXISTS ✓ |
| Tier-2 Diagnostic Narrative structure | DEFINED ✓ |
| Trace graph model | DEFINED ✓ |
| `/api/report-file` serving infrastructure | IMPLEMENTED ✓ |
| `/api/query` endpoint | NOT IMPLEMENTED |
| Trace graph builder | NOT IMPLEMENTED |
| Query engine | NOT IMPLEMENTED |

---

## VALIDATION REQUIREMENTS

Implementation stream MUST validate:
- Same canonical inputs produce identical query results (determinism check)
- BOUNDED_RESPONSE_FAILURE returned on conformance failure (not a partial response)
- All four response fields present in every response
- `inference_prohibition: ACTIVE` present in every `uncertainty_declaration`
- `depth_limit` enforced — no traversal beyond declared limit
- No advisory language in `structural_explanation` field
- Zone entry precondition enforced — invalid zone_id returns 400
