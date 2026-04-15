# EXECUTION LOG
# PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

- Stream: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
- Date: 2026-04-15
- Status: COMPLETE
- Branch: feature/evidence-vault-builder-v1 (non-canonical — boundary flagged per governance protocol; execution proceeded per user authorization pattern)

---

## SECTION 1 — PRE-FLIGHT

| check | result |
|-------|--------|
| `docs/governance/runtime/git_structure_contract.md` loaded | YES |
| Repository | krayu-program-intelligence (k-pi-core) |
| Branch | feature/evidence-vault-builder-v1 — OUTSIDE authorized set for this stream — flagged |
| Scope | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/` (design docs only) |
| Boundary violations planned | NONE — design only; no runtime, evidence, or claim mutation |
| Working tree state | Clean at start |

---

## SECTION 2 — READ SET

All files inspected before drafting began.

| # | file | purpose |
|---|------|---------|
| 1 | `docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/gauge_lens_exposure_governance.md` | Zone definitions, ZONE-0..3, claim exposure matrix, field zone floor classifications, signal exposure policy |
| 2 | `docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/evidence_vault_v2_architecture.md` | Node class definitions, 4-layer exposure model, architectural formula |
| 3 | `docs/psee/PRODUCTIZE.LENS.SURFACE.01/lens_v1_content_model.md` | Allowed/prohibited content, 8 enforcement rules (L-01..L-08), executive overview schema |
| 4 | `docs/psee/PRODUCTIZE.LENS.SURFACE.01/gauge_clickthrough_model.md` | Five click zones, three-level depth ladder, per-zone content specification, forbidden exposures |
| 5 | `docs/psee/PRODUCTIZE.LENS.SURFACE.01/EXECUTION_LOG.md` | Decisions reached, blocking conditions, governance confirmation from prior stream |
| 6 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/output_payload_schema.md` | (self — written during this stream) |
| 7 | `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/projection_contract_spec.md` | (self — written during this stream) |

---

## SECTION 3 — FILES CREATED

| file | purpose |
|------|---------|
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/projection_contract_spec.md` | Formal projection definition, 5-stage pipeline, projection units (atomic + compound), 15 named claim sets, 5 deterministic guarantees, 3 conceptual examples, forbidden actions |
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/output_payload_schema.md` | Common payload envelope, L1/L2/L3 payload schemas, zone-split field documentation, ZONE-1/ZONE-2 examples, ClaimSetPayload schema, field zone floor table (40+ entries) |
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/zone_enforcement_model.md` | Zone system definition (ZONE-0..3), Z0/Z1/Z2/Z3 floor register (all field categories), enforcement rule, ZONE-2 strict subset prohibition table, Stage 2/5 dual enforcement diagram, persona modifier zone interaction, cross-zone request handling |
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/integration_contract.md` | Zone assignment by surface, GAUGE click zone → projection mapping (all 5 zones), LENS assembly requests (executive overview + 4 blocks), V1 static fragment implementation pattern, V2 API endpoint shape, forbidden integration patterns |
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/failure_safety_model.md` | Fail-closed principle, ProjectionError structure, failure categories and reason codes (Stage 1..5), claim set failure propagation, caveat failure model, information leak prevention, rendering surface obligations, blocking condition registry (BC-01..BC-03) |
| `docs/psee/PRODUCTIZE.LENS.PROJECTION.CONTRACT.01/EXECUTION_LOG.md` | This file |

---

## SECTION 4 — DECISIONS REACHED

### Projection Definition
**Decision: PROJECTION IS A DETERMINISTIC TRANSFORMATION, NOT RENDERING**

Formal definition established: `Projection(claim_id, zone, depth, persona?) → OutputPayload`. Rendering and projection are architecturally separated. Projection is evidence-bound, deterministic, and zone-governed. Rendering is a downstream consumer of projection outputs.

### Pipeline Stage Ordering
**Decision: ZONE FILTER PRECEDES PERSONA MODIFIER (MANDATORY)**

Stage 2 (Zone Filter) produces the zone-filtered claim record (ZFR). Stage 4 (Persona Modifier) operates on ZFR only. Persona cannot access fields stripped by zone filter. This prevents any persona from bypassing governance boundaries.

### L3 Zone Restriction
**Decision: L3 DEPTH REQUIRES ZONE-3 — FAIL AT STAGE 1 OTHERWISE**

An L3 request at ZONE-1 or ZONE-2 returns `ProjectionError { reason: "ZONE_INSUFFICIENT_FOR_L3" }`. L3 audit payloads contain full traceability, known gaps, and blocking conditions — content that is ZONE-3 only. This is enforced in Stage 1, not Stage 5.

### ClaimSetPayload Evidence Class
**Decision: MINIMUM EVIDENCE CLASS (WEAKEST LINK) GOVERNS THE SET**

`set_evidence_class` is the minimum evidence class across all items in the ClaimSetPayload. If any item is CONDITIONAL, the set is CONDITIONAL. If any item is BLOCKED, the set is BLOCKED. This ensures that a set cannot present a VERIFIED signal when one of its constituents is partial.

### Claim Set Failure Propagation
**Decision: HARD FAILURE IN ONE ITEM FAILS THE ENTIRE CLAIM SET**

A BLOCKED item is surfaced as a `ProjectionError` within the set (set continues). A hard failure (Stage 1-5 error) in any item returns a `ClaimSetError` for the entire set. No partial set is returned. Rationale: partial sets may be rendered as complete sets by a consumer that does not detect the missing items.

### BLOCKED Is Not Silent
**Decision: BLOCKED IS A DECLARED RESULT, NOT A SILENT EMPTY RESPONSE**

BLOCKED claims return `ProjectionError { reason: "BLOCKED_CLAIM", evidence_class: "BLOCKED" }`. The consumer receives a structured error that confirms the projection was attempted and blocked at the requested zone/depth — not a null or empty result.

### V1 vs V2 Architecture
**Decision: V1 = STATIC FRAGMENTS; V2 = API-BACKED PROJECTION**

V1 implementation uses pre-generated ZONE-1/ZONE-2 fragment files per claim. Zone enforcement is at generation time (builder) and serve time (session zone determines which file). V2 deferred to when multiple clients are onboarded or shareable per-claim URLs are required.

### Zone Assignment Authority
**Decision: ZONE IS SERVER-DETERMINED; CLIENT CANNOT UPGRADE**

Zone is a property of the serving session, not the request parameters. A ZONE-2 session cannot request ZONE-1 output by sending `"zone": "ZONE-1"`. The API validates zone against session scope and rejects zone upgrades.

### BC-01 Blocking Condition Propagation
**Decision: CONCEPT-06 GAP MUST PROPAGATE TO PROJECTION LAYER**

The CONCEPT-06 predicate mismatch (documented in PRODUCTIZE.LENS.SURFACE.01) is registered as BC-01 in the projection failure model. Until resolved, CLM-25 EXECUTION projections must carry a mandatory caveat. The projection pipeline must not suppress this condition regardless of what the concept resolver returns.

---

## SECTION 5 — BLOCKING CONDITIONS IDENTIFIED

| condition_id | description | blocking what | resolution | status |
|-------------|-------------|--------------|-----------|--------|
| BC-01 | CONCEPT-06 predicate uses `PHASE_1_ACTIVE`; will not match `NOT_EVALUATED` | CLM-25 EXECUTION verdict accuracy | Update predicate in `app/gauge-product/lib/business-ontology/concepts.json` | OPEN |
| BC-02 | `business_impact` and `risk` not rendered in SignalAvailability | Signal ZONE-2 click-through value gap | Add rendering to SignalAvailability panel | OPEN |
| BC-03 | Vault builder has no `--zone-filter` flag | Quartz client-safe vault production | Extend vault builder | OPEN |

All three blocking conditions are inherited from PRODUCTIZE.LENS.SURFACE.01. BC-01 has projection-layer implications and is now registered in the failure safety model.

---

## SECTION 6 — UNRESOLVED ITEMS

| item | status | notes |
|------|--------|-------|
| Authentication model | UNRESOLVED | How does the serving layer determine ZONE-1 vs ZONE-2 vs ZONE-3 session? This stream defines zone as server-determined but does not specify the auth mechanism. |
| Fragment file serving path | DEFERRED to V1 implementation stream | Static fragment pattern is defined; the exact serve path is an implementation decision. |
| Cache invalidation strategy | DEFERRED to V2 | V1 static fragments do not require cache invalidation. V2 API-backed pattern will need cache-bust on vault update. |
| Persona validation at API layer | DEFERRED to V2 | V1 personas are session-context properties; V2 needs explicit persona grant model. |

---

## SECTION 7 — GOVERNANCE CONFIRMATION

- **No runtime artifact modified:** YES — confirmed
- **No evidence artifact modified:** YES — confirmed
- **No vault content mutated:** YES — confirmed
- **No claims invented or modified:** YES — confirmed
- **No GAUGE code changed:** YES — design docs only
- **Zone separation preserved in all recommendations:** YES — confirmed
- **All recommendations grounded in inspected artifacts:** YES — confirmed
- **No implementation work performed:** YES — design docs only
- **BC-01 propagated to projection layer (not resolved):** YES — fix remains out of scope; flagged as blocking condition

**Authority:** PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
