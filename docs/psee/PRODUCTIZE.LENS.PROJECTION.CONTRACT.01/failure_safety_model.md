# Failure and Safety Model
# PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
- Date: 2026-04-15

---

## SECTION 1 — GOVERNING PRINCIPLE

**Projection fails closed.**

On any failure condition — validation error, missing evidence, zone violation, inadmissible request — the projection pipeline returns a `ProjectionError` and no content. It does not return partial payloads, best-effort narratives, fallback values, or degraded outputs.

This principle is non-negotiable. A surface that renders uncaveated, zone-violating, or partially evidenced content is more dangerous than a surface that renders nothing.

```
Failure → ProjectionError
         → no content
         → no partial payload
         → no fallback narrative
         → no silent suppression
```

---

## SECTION 2 — PROJECTENTERROR STRUCTURE

All failure outputs share a common error envelope:

```
ProjectionError {
  error_type:       string     [REQUIRED]  // category — see Section 3
  reason:           string     [REQUIRED]  // machine-readable reason code
  claim_id?:        string                 // present if failure is claim-specific
  claim_set_id?:    string                 // present if failure is set-specific
  stage:            string     [REQUIRED]  // which pipeline stage failed
  detail?:          string                 // human-readable description (operator-facing only)
  zone:             string     [REQUIRED]  // zone of the failed request
  depth:            string     [REQUIRED]  // depth of the failed request
  generated_at:     timestamp  [REQUIRED]
}
```

**The `detail` field must not contain vault content, raw artifact values, or stripped fields.** An error payload is still subject to zone exposure rules — a ZONE-2 error must not include ZONE-1 content in its detail.

---

## SECTION 3 — FAILURE CATEGORIES AND REASON CODES

### Category: INPUT_VALIDATION_FAILURE (Stage 1)

| reason code | condition | action |
|------------|-----------|--------|
| `UNKNOWN_CLAIM_ID` | claim_id not found in claim registry (CLM-01..CLM-27) | Fail Stage 1 |
| `UNKNOWN_CLAIM_SET_ID` | claim_set_id not found in named claim sets | Fail Stage 1 |
| `INVALID_ZONE` | zone not in [ZONE-1, ZONE-2, ZONE-3] | Fail Stage 1 |
| `INVALID_DEPTH` | depth not in [L1, L2, L3] | Fail Stage 1 |
| `INVALID_PERSONA` | persona not in [shared, cto, ceo] | Fail Stage 1 |
| `ZONE_INSUFFICIENT_FOR_L3` | depth=L3 requested at ZONE-1 or ZONE-2 | Fail Stage 1 |
| `MISSING_REQUIRED_PARAMETER` | claim_id or claim_set_id absent | Fail Stage 1 |
| `AMBIGUOUS_INPUT` | both claim_id and claim_set_id present | Fail Stage 1 |

---

### Category: ZONE_FILTER_FAILURE (Stage 2)

| reason code | condition | action |
|------------|-----------|--------|
| `CLAIM_NOT_IN_VAULT` | claim_id is registered but no vault node exists for this run | Fail Stage 2 |
| `VAULT_NODE_UNREADABLE` | vault node for claim_id exists but cannot be parsed | Fail Stage 2 |
| `RUN_NOT_FOUND` | run_id does not correspond to any known run in the vault | Fail Stage 2 |
| `CLIENT_NOT_FOUND` | client_id not found in the vault | Fail Stage 2 |

---

### Category: PROJECTION_TRANSFORM_FAILURE (Stage 3)

| reason code | condition | action |
|------------|-----------|--------|
| `EVIDENCE_CHAIN_INCOMPLETE` | Required vault fields for the requested depth are absent | Fail Stage 3 |
| `DEPTH_NOT_AVAILABLE` | Vault node does not carry L2 or L3 content (trace_available=false) | Fail Stage 3 with trace_available context in error |
| `BLOCKED_CLAIM` | Claim is marked evidence_class=BLOCKED at this zone/depth | Return ProjectionError with evidence_class=BLOCKED |
| `ADMISSIBILITY_VIOLATION` | Claim fails LENS admissibility check (L-01 through L-08) at requested zone | Fail Stage 3 |

**BLOCKED is not a silent failure.** It is a declared result. A BLOCKED projection is returned as a `ProjectionError` with `reason: "BLOCKED_CLAIM"` and `evidence_class: "BLOCKED"`. The consumer knows a projection was attempted and blocked — it does not silently receive nothing.

---

### Category: PERSONA_FAILURE (Stage 4)

| reason code | condition | action |
|------------|-----------|--------|
| `PERSONA_CAVEAT_CONFLICT` | Persona modifier would require removing a required caveat | Fail Stage 4 — caveat takes precedence |
| `PERSONA_ZONE_ESCALATION` | Persona modifier would access stripped Z1 fields | Fail Stage 4 — zone filter is absolute |

---

### Category: OUTPUT_VALIDATION_FAILURE (Stage 5)

| reason code | condition | action |
|------------|-----------|--------|
| `ZONE_FILTER_VIOLATION` | Z1+ field detected in ZONE-2 output after transform | Fail Stage 5, report field_name |
| `REQUIRED_CAVEAT_MISSING` | A required caveat for a CONDITIONAL/PARTIAL claim is absent | Fail Stage 5 |
| `CLAIM_TRACE_MISSING` | Output claim_id cannot be traced to a vault node | Fail Stage 5 |
| `PAYLOAD_MALFORMED` | Output payload does not conform to schema | Fail Stage 5 |

---

## SECTION 4 — HANDLING RULES BY FAILURE CATEGORY

### Stage 1 Failures (Input)

Stage 1 failures are detected before any vault access. They are cheap and must be fast.

- No vault read is performed for Stage 1 failures
- Error response includes the invalid parameter and its value (in detail, operator-facing)
- No claim content in the error response

**Example:**
```json
{
  "error_type": "INPUT_VALIDATION_FAILURE",
  "reason": "ZONE_INSUFFICIENT_FOR_L3",
  "stage": "STAGE_1",
  "zone": "ZONE-2",
  "depth": "L3",
  "detail": "L3 audit depth requires ZONE-3 access. Requested zone: ZONE-2.",
  "generated_at": "2026-04-15T00:00:00Z"
}
```

---

### Stage 2 Failures (Zone Filter)

Stage 2 failures occur during vault access. The vault node may be absent, unreadable, or the run/client may not exist.

- No partial content is returned — if the ZFR cannot be constructed, the pipeline stops
- `CLAIM_NOT_IN_VAULT` must not expose that the claim exists in other runs (no cross-run information leakage)
- `RUN_NOT_FOUND` must not enumerate which run IDs exist

**Example:**
```json
{
  "error_type": "ZONE_FILTER_FAILURE",
  "reason": "CLAIM_NOT_IN_VAULT",
  "claim_id": "CLM-09",
  "stage": "STAGE_2",
  "zone": "ZONE-1",
  "depth": "L1",
  "generated_at": "2026-04-15T00:00:00Z"
}
```

---

### Stage 3 Failures (Projection Transform)

Stage 3 failures occur when the ZFR exists but cannot produce a valid output payload at the requested depth.

**BLOCKED claims** are a special case. A claim is BLOCKED if:
- Its `evidence_class` is `BLOCKED` in the vault (cannot be projected at the requested zone/depth)
- A prerequisite claim is BLOCKED (if the claim chain requires it)

BLOCKED is returned as a defined error — not a silent empty response. The consumer must handle BLOCKED explicitly and may render "Not available at this access level" or equivalent without fabricating a reason.

**DEPTH_NOT_AVAILABLE** occurs when L2 or L3 is requested but the vault node does not carry that depth content (`trace_available=false` on the claim). The error must indicate that L1 is available.

```json
{
  "error_type": "PROJECTION_TRANSFORM_FAILURE",
  "reason": "DEPTH_NOT_AVAILABLE",
  "claim_id": "CLM-09",
  "stage": "STAGE_3",
  "zone": "ZONE-1",
  "depth": "L2",
  "detail": "L2 evidence payload not available. L1 is available.",
  "generated_at": "2026-04-15T00:00:00Z"
}
```

---

### Stage 5 Failures (Output Validation)

Stage 5 failures indicate a pipeline implementation defect — a field that should have been stripped in Stage 2 passed through to the output.

These failures must be logged for diagnostic purposes (operator-visible only). They must not return the offending field value.

```json
{
  "error_type": "OUTPUT_VALIDATION_FAILURE",
  "reason": "ZONE_FILTER_VIOLATION",
  "stage": "STAGE_5",
  "zone": "ZONE-2",
  "depth": "L1",
  "detail": "Field 'source_field' (zone_floor=Z1) detected in ZONE-2 payload.",
  "generated_at": "2026-04-15T00:00:00Z"
}
```

The detail field in Stage 5 errors names the offending field for operator diagnostics but does not include its value.

---

## SECTION 5 — CLAIM SET FAILURE PROPAGATION

When a `ClaimSetProjectionRequest` is processed, each claim is projected independently. Failures in individual claims propagate to the set result.

**Propagation rules:**

| scenario | behavior |
|----------|---------|
| All items succeed | Return `ClaimSetPayload` with all items |
| One item BLOCKED | Include BLOCKED item as `ProjectionError` in items array; set_evidence_class = BLOCKED |
| One item fails hard (Stage 1-5) | Fail the entire ClaimSetPayload; return `ClaimSetError` |
| Multiple items BLOCKED | Same as single BLOCKED — all errors in items array; set_evidence_class = BLOCKED |

**ClaimSetError** is returned when a hard failure occurs (not a BLOCKED evidence class):

```
ClaimSetError {
  error_type:       string     [REQUIRED]  // "CLAIM_SET_FAILURE"
  claim_set_id:     string     [REQUIRED]
  failed_claim_id:  string                 // which claim caused the failure
  reason:           string     [REQUIRED]  // propagated from item error
  stage:            string     [REQUIRED]
  zone:             string     [REQUIRED]
  depth:            string     [REQUIRED]
  generated_at:     timestamp  [REQUIRED]
}
```

A ClaimSetError does not include the successfully projected items. If any item fails hard, the entire set fails. This is consistent with guarantee G5 (failed projections produce no content).

**Rationale:** Returning a partial set creates ambiguity about which claims are present. A consumer that processes a partial ClaimSetPayload without awareness of missing items may render an incomplete view as a complete one.

---

## SECTION 6 — CAVEAT FAILURE MODEL

Caveats are a safety mechanism, not optional metadata. A claim that requires a caveat under LENS admissibility rules (L-01..L-08) cannot be surfaced without that caveat. If the caveat cannot be attached, the claim is inadmissible at that zone.

**Caveat enforcement rules:**

| condition | result |
|-----------|--------|
| Claim has `evidence_class: CONDITIONAL` but no caveat text in vault | FAIL Stage 3 (`EVIDENCE_CHAIN_INCOMPLETE`) |
| Claim has `evidence_class: PARTIAL` but no caveat text in vault | FAIL Stage 3 (`EVIDENCE_CHAIN_INCOMPLETE`) |
| Persona modifier removes a required caveat | FAIL Stage 4 (`PERSONA_CAVEAT_CONFLICT`) |
| Output payload has empty `caveats: []` for a CONDITIONAL claim | FAIL Stage 5 (`REQUIRED_CAVEAT_MISSING`) |
| Required caveat present but deferred to footnote outside payload | FAIL Stage 5 — caveat must be in the `caveats` array of the output payload |

**VERIFIED claims with empty caveats are valid.** The `caveats: []` field is always present in the output — never omitted — but it is legitimately empty for VERIFIED claims with no known gaps.

---

## SECTION 7 — INFORMATION LEAK PREVENTION

Error responses must not leak:
- Vault content (values, field paths, artifact names)
- Run metadata beyond what was in the request
- Client information beyond what was in the request
- Internal identifiers (CLM codes, ART codes, TRN codes) in ZONE-2 error responses
- Existence of claims not in the requested scope

**Zone-appropriate error responses:**

| zone | error detail level |
|------|--------------------|
| ZONE-1 | Full technical detail: stage, field names, reason codes, detail string |
| ZONE-2 | Minimal: error_type, reason code (no field names, no internal IDs), generated_at |
| ZONE-3 | Full technical detail (same as ZONE-1 + audit context if available) |

**Example of ZONE-2 appropriate error:**
```json
{
  "error_type": "INPUT_VALIDATION_FAILURE",
  "reason": "ZONE_INSUFFICIENT_FOR_L3",
  "stage": "STAGE_1",
  "zone": "ZONE-2",
  "depth": "L3",
  "generated_at": "2026-04-15T00:00:00Z"
}
```

No `detail` field in ZONE-2 error — detail is operator-facing only.

---

## SECTION 8 — RENDERING SURFACE OBLIGATIONS

The projection pipeline's failure model creates obligations for the consuming surface (GAUGE / LENS).

| surface behavior | compliant | non-compliant |
|-----------------|-----------|---------------|
| Render "Not available" for BLOCKED | YES | Render last-known value |
| Render error state for ClaimSetError | YES | Render partial set |
| Display caveat if evidence_class=CONDITIONAL | YES | Suppress caveat |
| Show nothing if ProjectionError is returned | YES | Show fallback narrative |
| Log Stage 5 failures for operator review | YES | Suppress Stage 5 failures silently |
| Allow user to retry after Stage 1 failure | YES (with corrected input) | Auto-retry with same input |

A rendering surface that falls back to synthetic data, cached previous values, or invented narrative when a ProjectionError is received is non-compliant with this contract, regardless of the user experience justification.

---

## SECTION 9 — BLOCKING CONDITION REGISTRY

Known blocking conditions at contract creation time:

| condition_id | description | blocking what | resolution | status |
|-------------|-------------|--------------|-----------|--------|
| BC-01 | CONCEPT-06 predicate uses `PHASE_1_ACTIVE`; will not match `NOT_EVALUATED` | CLM-25 EXECUTION verdict (may render VERIFIED incorrectly) | Update predicate in `app/gauge-product/lib/business-ontology/concepts.json` | OPEN |
| BC-02 | `business_impact` and `risk` not rendered in SignalAvailability panel | Signal ZONE-2 click-through value gap (values exist; not displayed) | Add rendering in existing SignalAvailability panel | OPEN |
| BC-03 | Vault builder has no `--zone-filter` flag | Cannot produce Quartz-safe client input without manual filtering | Extend vault builder with zone-filter option | OPEN |

**BC-01 is a projection-level blocking condition.** Until resolved, the EXECUTION projection from CLM-25 must be treated as CONDITIONAL with caveat: "Execution verdict requires predicate correction before automatic derivation is possible. It is manually confirmed as UNKNOWN based on execution_status = NOT_EVALUATED."

The projection pipeline must not suppress this condition. If the predicate fix has not been applied and CLM-25 is projected, the output must include this caveat regardless of what the concept resolver returns.

**Authority:** PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
