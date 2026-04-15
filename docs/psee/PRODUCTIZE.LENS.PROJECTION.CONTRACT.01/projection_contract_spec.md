# Projection Contract Specification
# PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
- Date: 2026-04-15
- Authority: PRODUCTIZE.LENS.SURFACE.01 (parent)

---

## SECTION 1 — FORMAL DEFINITION OF PROJECTION

**Projection is NOT rendering.**

Rendering takes data and produces display output. It may or may not be evidence-bound. It has no formal relationship with governance.

**Projection is a deterministic transformation of a claim into a zone-admissible, evidence-bound representation.**

Formally:

```
Projection(claim_id, zone, depth, persona?) → OutputPayload
```

Where:
- `claim_id` — the atomic unit of evidence being projected
- `zone` — the exposure zone governing which fields are admissible
- `depth` — the level of explanation requested (L1 | L2 | L3)
- `persona?` — optional modifier applied AFTER zone filter (never before)
- `OutputPayload` — a structured, schema-validated, evidence-referenced result

**This contract defines the rules governing all four inputs and the constraints on the output.**

---

## SECTION 2 — PROJECTION PIPELINE

The projection pipeline has five mandatory stages. No stage may be reordered. Stage 3 may not be reached without Stages 1 and 2 completing successfully.

```
Stage 1: INPUT VALIDATION
  ├── claim_id or claim_set_id is known
  ├── zone is a recognized value (ZONE-1 | ZONE-2 | ZONE-3)
  ├── depth is a recognized value (L1 | L2 | L3)
  └── if FAIL → return ProjectionError (see failure_safety_model.md)

Stage 2: ZONE FILTER (pre-transform — mandatory)
  ├── retrieve claim record from vault index
  ├── for each field in claim record:
  │     if field.zone_floor > requested_zone → STRIP
  │     else → RETAIN
  └── result: zone-filtered claim record (ZFR)

Stage 3: PROJECTION TRANSFORM
  ├── apply depth template to ZFR
  │     L1 → Explanation payload (value + narrative + caveat)
  │     L2 → Evidence payload (artifact reference + co-grounded claims)
  │     L3 → Audit payload (full trace + known gaps)
  └── result: raw output payload

Stage 4: PERSONA MODIFIER (optional)
  ├── if no persona → pass through unchanged
  ├── if persona provided:
  │     apply vocabulary adjustments within zone (e.g., axis names verbatim for CTO)
  │     persona MUST NOT access fields stripped in Stage 2
  │     persona MUST NOT add content not in ZFR
  │     persona MUST NOT remove required caveats
  └── result: persona-adjusted output payload

Stage 5: OUTPUT VALIDATION
  ├── verify no ZONE-1+ fields present in ZONE-2 output
  ├── verify all required caveats present (per admissibility rules)
  ├── verify claim_id traces to a vault node
  └── if FAIL → return ProjectionError (never return partial payload)
```

---

## SECTION 3 — THE PROJECTION UNIT

### 3.1 Atomic Unit: `claim_id`

The minimal projection unit is a single `claim_id` from the claim registry (CLM-01..CLM-27).

```
ProjectionRequest {
  claim_id:   string            // "CLM-09" — required
  zone:       ZoneIdentifier    // "ZONE-1" | "ZONE-2" | "ZONE-3" — required
  depth:      DepthLevel        // "L1" | "L2" | "L3" — required
  persona?:   PersonaIdentifier // "cto" | "ceo" | "shared" — optional, default "shared"
  client_id?: string            // required for multi-client deployments
  run_id?:    string            // required for multi-run deployments
}
```

### 3.2 Compound Unit: `claim_set_id`

For GAUGE click zones that trigger multi-claim projections, a named claim set is the input unit.

```
ClaimSetProjectionRequest {
  claim_set_id: ClaimSetIdentifier  // see Section 4
  zone:         ZoneIdentifier
  depth:        DepthLevel
  persona?:     PersonaIdentifier
  client_id?:   string
  run_id?:      string
}
```

A `ClaimSetProjectionRequest` resolves to an ordered list of `ProjectionRequest` objects. Each is projected independently. The output is a `ClaimSetPayload` — an ordered collection of `OutputPayload` objects.

### 3.3 What Is NOT a Valid Projection Unit

| invalid input | why |
|--------------|-----|
| Raw field value (e.g., `score.canonical`) | Not a claim — bypasses claim-level governance |
| Artifact ID alone (e.g., `ART-01`) | Not a claim — produces artifact node without claim traceability |
| Free-form query string | Not deterministic — violates determinism guarantee |
| Natural language question | Not a projection input — requires interpretation, which is out of scope |
| Audience persona alone | Zone must precede persona — persona is not a zone |

---

## SECTION 4 — NAMED CLAIM SETS

Named claim sets map GAUGE click zones and LENS assembly requests to ordered claim sequences. They are static definitions, not computed at projection time.

| claim_set_id | claims included | primary surface | description |
|-------------|----------------|----------------|-------------|
| `SCORE_ZONE` | CLM-09, CLM-10, CLM-12, CLM-11 | GAUGE StatusBand / ScoreGauge | Proven + achievable score with confidence range |
| `SIGNAL_ZONE_1` | CLM-20 | GAUGE SignalAvailability row 1 | SIG-001 Sensor Bridge Throughput |
| `SIGNAL_ZONE_2` | CLM-21 | GAUGE SignalAvailability row 2 | SIG-002 Platform Runtime State |
| `SIGNAL_ZONE_3` | CLM-22 | GAUGE SignalAvailability row 3 | SIG-003 Dependency Load |
| `SIGNAL_ZONE_4` | CLM-23 | GAUGE SignalAvailability row 4 | SIG-004 Structural Volatility |
| `SIGNAL_ZONE_5` | CLM-24 | GAUGE SignalAvailability row 5 | SIG-005 Coordination Pressure |
| `VERDICT_ZONE` | CLM-25, CLM-13, CLM-03 | GAUGE ExecutiveDecisionBlock | Three-axis verdict with supporting structural context |
| `TOPOLOGY_ZONE` | CLM-27, CLM-14, CLM-15, CLM-16 | GAUGE StructuralMetrics | Full node inventory with domain/capability/component breakdown |
| `COVERAGE_ZONE` | CLM-01, CLM-13 | GAUGE RuntimeIntelligence | Coverage completeness and execution status |
| `LENS_EXECUTIVE_OVERVIEW` | CLM-09, CLM-10, CLM-25, CLM-21, CLM-20, CLM-22, CLM-23, CLM-24, CLM-18, CLM-19, CLM-12, CLM-11, CLM-01, CLM-13 | LENS executive overview | Full ZONE-2 executive surface |
| `LENS_SCORE_BLOCK` | CLM-09, CLM-10, CLM-12, CLM-11 | LENS Block 2 | Score + range + band |
| `LENS_VERDICT_BLOCK` | CLM-25, CLM-13 | LENS Block 3 | Three-axis verdict with execution status |
| `LENS_SIGNAL_BLOCK` | CLM-20, CLM-21, CLM-22, CLM-23, CLM-24 | LENS Block 5 | All five signal narratives |
| `LENS_STRUCTURAL_BLOCK` | CLM-01, CLM-14, CLM-15, CLM-16, CLM-17 | LENS Block 6 | Structural footprint |

---

## SECTION 5 — DETERMINISTIC GUARANTEES

Projection is deterministic by contract:

**G1 — Same inputs → same outputs.**
Given identical `(claim_id, zone, depth, persona, client_id, run_id)`, the projection MUST produce identical output. This requires that:
- Zone filter rules are static (not computed at runtime from preferences)
- Depth templates are fixed (not audience-configurable at runtime)
- Vault content does not change between projection calls for the same run

**G2 — Zone filter is stateless.**
The zone filter applies the same rules to every field in every projection. It does not adapt based on request history, user session state, or business context.

**G3 — Persona modifiers are bounded.**
Persona modifiers are limited to pre-defined vocabulary substitutions and ordering adjustments within the zone-filtered record. They cannot introduce new values or remove governance constraints.

**G4 — Output payload is self-contained.**
An `OutputPayload` carries its own `claim_id`, `zone`, `depth`, and `evidence_class`. A consumer of the payload does not need to re-query the vault to verify the claim's evidentiary basis at the stated level.

**G5 — Failed projections produce no content.**
If the projection pipeline fails at any stage, the output is a `ProjectionError` — not a partial payload, not a best-effort result, not a fallback narrative.

---

## SECTION 6 — CONCEPTUAL EXAMPLES

These examples use illustrative shapes. They are not implementation code.

### Example A: GAUGE operator clicks the score display (L1, ZONE-1)

**Input:**
```
ProjectionRequest {
  claim_set_id: "SCORE_ZONE",
  zone: "ZONE-1",
  depth: "L1",
  persona: "shared"
}
```

**Resolves to three sequential ProjectionRequests:**
- CLM-09 / ZONE-1 / L1
- CLM-10 / ZONE-1 / L1
- CLM-12 / ZONE-1 / L1

**Stage 2 (zone filter) retains** for CLM-09:
- claim_label, value (raw: `score.canonical=60`), explanation paragraph, source_field (`gauge_state.json → score.canonical`), transformation_summary, caveats

**Stage 3 (L1 transform) produces:**
- Explanation: technical derivation paragraph from vault node
- Value: `60` (raw)
- Source field: `gauge_state.json → score.canonical`
- Transformation: `coverage_points(35) + reconstruction_points(25) + completion_points(0) = 60`
- Caveats: none for CLM-09 at ZONE-1

---

### Example B: LENS assembles executive score block (L1, ZONE-2)

**Input:**
```
ClaimSetProjectionRequest {
  claim_set_id: "LENS_SCORE_BLOCK",
  zone: "ZONE-2",
  depth: "L1",
  persona: "shared"
}
```

**Stage 2 (zone filter) STRIPS** for CLM-09:
- source_field (JSON path — ZONE-1 only)
- transformation_summary (formula — ZONE-1 only)

**Stage 2 (zone filter) RETAINS** for CLM-09:
- claim_label (without CLM-ID code), value (narrative), narrative explanation, caveats

**Stage 3 (L1 transform) produces:**
- Value: "Proven: 60/100"
- Narrative: "The maximum provable from structural analysis alone."
- Caveat: "Requires runtime execution assessment to achieve ceiling."

---

### Example C: Audit request for CLM-25 (L3, ZONE-3)

**Input:**
```
ProjectionRequest {
  claim_id: "CLM-25",
  zone: "ZONE-3",
  depth: "L3"
}
```

**Stage 2 retains all fields** (ZONE-3 has no restrictions)

**Stage 3 (L3 transform) produces:**
- Full trace: concept predicate evaluations, concept_ids, phrase resolution detail
- Known gaps: CONCEPT-06 predicate mismatch (`PHASE_1_ACTIVE` vs `NOT_EVALUATED`)
- Blocking conditions: EXECUTION verdict may render incorrectly until fix applied
- Artifact paths: `app/gauge-product/lib/business-ontology/concepts.json`
- Audit confirmed: true (with known gap flagged)

---

## SECTION 7 — WHAT PROJECTION IS NOT PERMITTED TO DO

| forbidden action | reason |
|-----------------|--------|
| Synthesize a narrative not traceable to a vault node | Violates evidence-first principle |
| Aggregate claim values into a new metric | Computation belongs to execution chain, not projection |
| Select which claims to project based on audience preference | Claim selection is governed by claim_set definitions, not by persona |
| Omit a required caveat because it is "commercially inconvenient" | Violates LENS admissibility Rule L-02 |
| Return a partial payload on zone violation | Must fail closed (see failure_safety_model.md) |
| Surface ZONE-1 content in ZONE-2 output "for context" | Zone filter is absolute |
| Use persona to access stripped fields | Persona operates on ZFR only |

**Authority:** PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
