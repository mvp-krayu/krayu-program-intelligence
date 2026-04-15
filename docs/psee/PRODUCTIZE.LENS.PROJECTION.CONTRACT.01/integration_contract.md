# GAUGE + LENS Integration Contract
# PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
- Date: 2026-04-15

---

## SECTION 1 — INTEGRATION SCOPE

This contract defines how projection requests are triggered from GAUGE click events and LENS assembly requests. It governs the mapping between UI surface events and projection inputs, the zone and persona assignment rules per surface, and the shape of future API endpoints.

This contract does NOT define UI components, rendering logic, or GAUGE implementation details. Those are governed by PRODUCTIZE.LENS.SURFACE.01 and future GAUGE implementation streams.

---

## SECTION 2 — ZONE ASSIGNMENT BY SURFACE

Zone is determined by the serving context. It is not a client-side parameter. A client session cannot upgrade its zone.

| surface | zone assigned | authority |
|---------|--------------|-----------|
| GAUGE operator session | ZONE-1 | Server session token / operator auth |
| GAUGE client session | ZONE-2 | Server session token / client auth |
| LENS executive view | ZONE-2 | Server-enforced — no session toggle |
| LENS CTO view | ZONE-2 + cto persona | Server-enforced persona |
| LENS audit view | ZONE-3 | Explicit audit session — separate access path |
| Quartz (operator vault) | ZONE-1 | Pre-filtered vault — not runtime projection |
| Quartz (client vault) | ZONE-2 | Pre-filtered vault — requires vault builder --zone-filter ZONE-2 |

**Zone is set before any projection request is constructed.** The consumer code constructs the `ProjectionRequest` with the zone already resolved from the session context. The projection engine receives zone as an input — it does not determine it.

---

## SECTION 3 — GAUGE CLICK ZONE → PROJECTION MAPPING

Each GAUGE click zone maps to a named claim set. The claim set, zone, and depth are the complete projection input. Persona defaults to `shared` unless the session carries a persona assignment.

### 3.1 Score Zone Click (StatusBand / ScoreGauge)

```
Trigger: Click on score display (StatusBand or ScoreGauge component)

ProjectionRequest:
  claim_set_id: "SCORE_ZONE"
  zone: <session_zone>       // ZONE-1 or ZONE-2
  depth: "L1"
  persona: <session_persona> // default "shared"

Resolves to:
  CLM-09 / L1 — Proven Score
  CLM-10 / L1 — Achievable Score
  CLM-12 / L1 — Score Confidence Range
  CLM-11 / L1 — Score Band

Output type: ClaimSetPayload (4 items)
```

**ZONE-1 output:** Score derivation formula, source field paths, raw numeric values, transformation chain.
**ZONE-2 output:** "Proven: 60/100. Achievable: 100/100 when runtime assessment runs." Caveats for CLM-10 and CLM-11 are required.

---

### 3.2 Signal Zone Click (SignalAvailability — per row)

Each signal row is independently clickable. The click on a signal row produces a single-item projection for that signal's claim.

```
Trigger: Click on signal row N (1-indexed)

Signal row → claim mapping:
  Row 1 → CLM-20 (SIG-001 Sensor Bridge Throughput)
  Row 2 → CLM-21 (SIG-002 Platform Runtime State)
  Row 3 → CLM-22 (SIG-003 Dependency Load)
  Row 4 → CLM-23 (SIG-004 Structural Volatility)
  Row 5 → CLM-24 (SIG-005 Coordination Pressure)

ProjectionRequest:
  claim_id: <mapped_claim_id>
  zone: <session_zone>
  depth: "L1"
  persona: <session_persona>

Output type: OutputPayload (single item)
```

Alternatively, a SIGNAL_ZONE_N claim set may be used:

```
ProjectionRequest:
  claim_set_id: "SIGNAL_ZONE_1" | "SIGNAL_ZONE_2" | ... | "SIGNAL_ZONE_5"
  zone: <session_zone>
  depth: "L1"
  persona: <session_persona>
```

**ZONE-2 output:** title + business_impact + risk + confidence_label. No signal.statement, no confidence_rationale, no signal_id.
**SIG-005 (CLM-24) requires caveat at all zones:** "Partial evidence — static component confirmed; runtime component pending."

---

### 3.3 Verdict Zone Click (ExecutiveDecisionBlock)

```
Trigger: Click on verdict display (ExecutiveDecisionBlock)

ProjectionRequest:
  claim_set_id: "VERDICT_ZONE"
  zone: <session_zone>
  depth: "L1"
  persona: <session_persona>

Resolves to:
  CLM-25 / L1 — Executive Verdict
  CLM-13 / L1 — Execution Status
  CLM-03 / L1 — Reconstruction Verdict

Output type: ClaimSetPayload (3 items)
```

**ZONE-2 output:** "Structure: All structural evidence is complete and verified. Complexity: No structural overlaps found. Execution: Runtime assessment is pending — this is expected, not a problem."

**CONCEPT-06 blocking condition:** Until `concepts.json` predicate for CONCEPT-06 is updated to include `NOT_EVALUATED`, the EXECUTION verdict must render as "UNKNOWN — pending assessment" regardless of what the projection resolves from the vault. This is governed by LENS Rule L-04 and is a pre-deployment blocking condition.

---

### 3.4 Topology Zone Click (StructuralMetrics counts)

```
Trigger: Click on topology metrics (17/42/89 count display)

ProjectionRequest:
  claim_set_id: "TOPOLOGY_ZONE"
  zone: <session_zone>
  depth: "L1"
  persona: <session_persona>

Resolves to:
  CLM-27 / L1 — Node Inventory
  CLM-14 / L1 — Domain Count
  CLM-15 / L1 — Capability Count
  CLM-16 / L1 — Component Count

Output type: ClaimSetPayload (4 items)
```

**ZONE-2 output:** "17 functional areas. 42 capability surfaces. 89 components mapped." Domain names list (business labels only). No component-level names (ZONE-0).

---

### 3.5 Coverage / Execution Zone Click (RuntimeIntelligence panel)

```
Trigger: Click on coverage or execution state display

ProjectionRequest:
  claim_set_id: "COVERAGE_ZONE"
  zone: <session_zone>
  depth: "L1"
  persona: <session_persona>

Resolves to:
  CLM-01 / L1 — Coverage Completeness
  CLM-13 / L1 — Execution Status

Output type: ClaimSetPayload (2 items)
```

**ZONE-2 output:** "All structural evidence is present and admitted. Runtime execution assessment has not run." Required caveat: "Not a deficiency — assessment is incomplete until execution runs."

---

## SECTION 4 — LENS ASSEMBLY REQUESTS

LENS assembly requests produce multi-claim payloads for rendering entire surface sections. These use named claim sets defined in the projection contract spec.

### 4.1 LENS Executive Overview Assembly

```
ClaimSetProjectionRequest:
  claim_set_id: "LENS_EXECUTIVE_OVERVIEW"
  zone: "ZONE-2"
  depth: "L1"
  persona: "shared" | "cto" | "ceo"

Resolves to (in order):
  CLM-09, CLM-10, CLM-25, CLM-21, CLM-20, CLM-22, CLM-23, CLM-24,
  CLM-18, CLM-19, CLM-12, CLM-11, CLM-01, CLM-13

Output type: ClaimSetPayload (14 items)
set_evidence_class: minimum evidence class across all items
```

The LENS executive overview is assembled from this payload. The rendering surface maps ClaimSetPayload items to blocks 1–7 as defined in `lens_v1_content_model.md` §4.

Block-to-claim mapping:

| block | claims used |
|-------|------------|
| Block 1 — Identity | run_id metadata (not a claim projection) |
| Block 2 — Score | CLM-09, CLM-10, CLM-12, CLM-11 |
| Block 3 — Three-Axis Verdict | CLM-25, CLM-13 |
| Block 4 — Key Finding | CLM-21 |
| Block 5 — Signal Indicators | CLM-20, CLM-21, CLM-22, CLM-23, CLM-24 |
| Block 6 — Structural Footprint | CLM-01, CLM-14, CLM-15, CLM-16 |
| Block 7 — What Comes Next | CLM-10, CLM-13 (narrative synthesis from projections) |

Block 7 narrative synthesis is the only block where projection output fields are combined. It is not a new claim — it restates CLM-10 (achievable score) and CLM-13 (execution pending) in sequence. No new assertions may be introduced.

---

### 4.2 LENS Block Requests

For rendering individual LENS blocks without the full overview:

```
LENS_SCORE_BLOCK:
  claim_set_id: "LENS_SCORE_BLOCK"
  zone: "ZONE-2"
  depth: "L1"
  → CLM-09, CLM-10, CLM-12, CLM-11

LENS_VERDICT_BLOCK:
  claim_set_id: "LENS_VERDICT_BLOCK"
  zone: "ZONE-2"
  depth: "L1"
  → CLM-25, CLM-13

LENS_SIGNAL_BLOCK:
  claim_set_id: "LENS_SIGNAL_BLOCK"
  zone: "ZONE-2"
  depth: "L1"
  → CLM-20, CLM-21, CLM-22, CLM-23, CLM-24

LENS_STRUCTURAL_BLOCK:
  claim_set_id: "LENS_STRUCTURAL_BLOCK"
  zone: "ZONE-2"
  depth: "L1"
  → CLM-01, CLM-14, CLM-15, CLM-16, CLM-17
```

Each block request is independent. Blocks may be cached individually if caching is implemented (by run_id × claim_set_id × zone × depth).

---

## SECTION 5 — V1 IMPLEMENTATION PATTERN (STATIC FRAGMENTS)

In the v1 implementation, projection is not backed by a live API. It is backed by pre-generated claim fragment files produced by the vault builder.

**Mechanism:**

1. Vault builder generates one ZONE-1 fragment file and one ZONE-2 fragment file per claim
2. Fragment files are stored at a served path (static file serving or embedded asset)
3. GAUGE click handler fetches the appropriate fragment file based on session zone
4. Fragment file content is rendered in the click-through drawer

**Fragment file naming convention:**

```
claims/fragments/CLM-{id}-ZONE-1-L1.json
claims/fragments/CLM-{id}-ZONE-2-L1.json
```

**Fragment file structure:** Matches the `L1ExplanationPayload` schema from `output_payload_schema.md`.

**Zone enforcement in static pattern:** Zone is enforced at generation time (vault builder produces two separate files) and at serve time (session zone determines which file is fetched). The client never receives the ZONE-1 fragment in a ZONE-2 session.

**Limitation of static pattern:** Static fragments do not support per-request `run_id` selection or multi-client deployments. These require the V2 API-backed pattern.

---

## SECTION 6 — V2 API ENDPOINT SHAPE (CONCEPTUAL)

The V2 projection endpoint is deferred but its shape is defined here to ensure architectural continuity. V2 is appropriate when multiple clients are onboarded or when shareable per-claim URLs are required.

### 6.1 Single Claim Projection

```
POST /api/v1/project

Request body:
{
  "claim_id": "CLM-09",
  "zone": "ZONE-2",
  "depth": "L1",
  "persona": "shared",
  "client_id": "blueedge",
  "run_id": "run_authoritative_recomputed_01"
}

Response:
  200 OK → L1ExplanationPayload
  400 Bad Request → ProjectionError { reason: "INVALID_INPUT", detail: "..." }
  403 Forbidden → ProjectionError { reason: "ZONE_INSUFFICIENT", detail: "..." }
  404 Not Found → ProjectionError { reason: "CLAIM_NOT_FOUND", claim_id: "..." }
  422 Unprocessable → ProjectionError { reason: "ZONE_FILTER_VIOLATION", field: "..." }
```

### 6.2 Claim Set Projection

```
POST /api/v1/project/set

Request body:
{
  "claim_set_id": "SCORE_ZONE",
  "zone": "ZONE-2",
  "depth": "L1",
  "persona": "shared",
  "client_id": "blueedge",
  "run_id": "run_authoritative_recomputed_01"
}

Response:
  200 OK → ClaimSetPayload
  400/403/404/422 → ProjectionError (same as above)
```

### 6.3 API Constraints

- Zone is sent by the caller but MUST be validated against the caller's session scope. A caller whose session is ZONE-2 cannot request ZONE-1 output by sending `"zone": "ZONE-1"`.
- `client_id` and `run_id` are required for multi-client deployments. In single-client mode they may be resolved from session context.
- The API returns no content on failure. Error payloads contain only `reason` and optionally `detail` — never partial claim content.
- Response must be cacheable by `(claim_id, zone, depth, persona, client_id, run_id)`. Same inputs → same response.

---

## SECTION 7 — FORBIDDEN INTEGRATION PATTERNS

| forbidden pattern | why |
|------------------|-----|
| Client-side zone toggle | Zone must be server-determined; client cannot upgrade its zone |
| Fetching both zones and selecting client-side | ZONE-1 content must never reach a ZONE-2 session |
| Constructing projection from partial field reads | Projection unit is claim_id, not field path |
| Caching across run_ids | run_id is a cache key component — different runs must produce separate responses |
| Rendering beyond what the projection returns | LENS may not add narrative not present in the projection output |
| Using ClaimSetPayload.set_evidence_class as the only caveat | Individual item caveats must still be rendered |
| Suppressing caveats when set_evidence_class is VERIFIED | Item-level CONDITIONAL caveats remain even if the set grades as VERIFIED |
| Aggregating claim values into new metrics at render time | Aggregation belongs to the execution chain, not the projection surface |

**Authority:** PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
