# ZONE-2 Safe Payload Profile
# PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01
- Date: 2026-04-15
- Authority: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01 (parent)

---

## SECTION 1 — DEFINITION

ZONE-2 is not a filtered view of ZONE-1.

**ZONE-2 is a contractually bounded payload class.**

A ZONE-2 payload:
- contains only what a non-technical executive audience can receive safely
- cannot expose internal system structure, reasoning chains, or intelligence
- cannot allow reconstruction of the dependency graph, signal-to-claim logic, or computation chain
- is the IP boundary, the data leakage boundary, and the LENS surface guarantee

Every ZONE-2 payload is validated against this profile before it is returned. Any field not in the allowed set is a violation. Any forbidden field is a violation. Any internal ID substring in a string value is a violation.

**This profile is enforced by `_validate_zone2_payload()` in `projection_runtime.py` and is regression-tested in `TC11_Zone2PayloadSafety`.**

---

## SECTION 2 — ALLOWED FIELDS (MANDATORY SET)

These are the ONLY fields permitted in a ZONE-2 L1 output payload. A field not in this set is a violation regardless of its value.

| field | type | constraint |
|-------|------|-----------|
| `projection_id` | string | Format: PROJ-{claim_id}-ZONE-2-{depth}-{hash} |
| `claim_id` | string | Internal reference — present as envelope metadata only |
| `zone` | string | Must equal `"ZONE-2"` |
| `depth` | string | `"L1"` only in V1 |
| `evidence_class` | string | Bounded vocabulary only — see §4 |
| `persona` | string | `"shared"` \| `"cto"` \| `"ceo"` |
| `run_id` | string | Run basis reference — no path or internal ID structure |
| `generated_at` | string | ISO 8601 timestamp |
| `trace_available` | boolean | `true` \| `false` only |
| `caveats` | array | Human-readable strings only — no structural references |
| `claim_label` | string | Plain English label — no CLM-XX annotation |
| `value` | object | See §2.1 |
| `explanation` | string | Client-safe narrative — no internal IDs |
| `signal` | object | Present only for signal claims — see §2.2 |
| `trace_depth_available` | array | `["L2", "L3"]` only — no detail |

**Total: 15 fields.** A ZONE-2 L1 payload with more than 15 top-level keys is non-compliant.

### 2.1 — `value` Subblock

| subfield | type | constraint |
|---------|------|-----------|
| `narrative` | string | Required — plain English |
| `unit` | string | Optional — e.g., "out of 100", "%" |

**`value.raw` is forbidden from ZONE-2.** Raw numeric/boolean values are Z1-only.

### 2.2 — `signal` Subblock

Present only for claims CLM-20..CLM-24. Absent for all other claim types.

| subfield | type | constraint |
|---------|------|-----------|
| `title` | string | Signal title — client-safe |
| `business_impact` | string | Verbatim from signal_registry.json |
| `risk` | string | Verbatim from signal_registry.json |
| `evidence_confidence` | string | `"STRONG"` \| `"MODERATE"` \| `"WEAK"` |

**`signal.signal_id` is forbidden.** Signal IDs (SIG-XXX) are Z1-only internal references.

---

## SECTION 3 — FORBIDDEN FIELDS (ABSOLUTE)

These fields must never appear in a ZONE-2 payload under any condition. Their presence is a payload violation regardless of their value.

### 3.1 — Named Forbidden Fields

| forbidden field | category | risk |
|----------------|----------|------|
| `source_field` | Artifact path reference | Exposes vault field paths (Z1) |
| `transformation_summary` | Computation detail | Exposes derivation formula (Z1) |
| `stage_of_origin` | PSEE stage reference | Exposes internal pipeline stage codes (Z1) |
| `artifact_id` | Internal reference | Exposes ART-XX codes (Z1) |
| `artifact_name` | Technical filename | Exposes JSON artifact names (Z1) |
| `artifact_path` | Filesystem path | Exposes repo-relative paths (Z1) |
| `producing_step` | PSEE stage reference | Exposes internal stage labels (Z1) |
| `signal_id` | Internal reference | Exposes SIG-XXX codes (Z1), at any level |
| `full_trace` | Full audit chain | Exposes complete derivation (Z3) |
| `known_gaps` | Audit data | Exposes gap analysis (Z3) |
| `blocking_conditions` | Audit data | Exposes blocking condition details (Z3) |
| `traceability_status` | Audit data | Exposes traceability status codes (Z3) |
| `audit_confirmed` | Audit data | Exposes audit confirmation state (Z3) |
| `value.raw` | Raw value | Exposes numeric/boolean raw values (Z1) |

### 3.2 — Forbidden Key Patterns

Any payload key containing these substrings is forbidden regardless of actual field name:

| pattern | reason |
|---------|--------|
| `_path` | May expose filesystem or artifact path references |
| `_file` | May expose filename or file reference |
| `_graph` | May expose graph topology structure |

### 3.3 — Forbidden String Content

The following substrings must not appear in the `explanation` field of a ZONE-2 payload. Their presence indicates internal ID leakage from the PSEE intelligence layer.

| forbidden substring | represents |
|--------------------|-----------|
| `SIG-` | Signal registry IDs (SIG-001..SIG-005) |
| `COND-` | Condition evidence IDs |
| `DIAG-` | Diagnostic evidence IDs |
| `INTEL-` | Intelligence layer IDs |

These substrings are Z1-only provenance markers. Their presence in a ZONE-2 explanation field means the "Why It Matters" narrative section of the vault claim contains unstripped internal references.

---

## SECTION 4 — CONDITIONALLY ALLOWED

### 4.1 — `evidence_class` Bounded Vocabulary

`evidence_class` is allowed in ZONE-2 output but its value is bounded:

| allowed value | meaning |
|--------------|---------|
| `VERIFIED` | Claim is fully traced to a locked artifact |
| `CONDITIONAL` | Claim is admissible but requires a caveat |
| `PARTIAL` | Evidence chain is present but one or more steps are incomplete |
| `BLOCKED` | Claim cannot be projected at the requested zone/depth |

Any other string value in `evidence_class` is a violation.

### 4.2 — `caveats` Content Constraint

`caveats` is a string array. Each entry must be human-readable plain language. Caveats may not contain:
- Internal ID references (SIG-XXX, ART-XXX, TRN-XXX, CONCEPT-XX, DIM-XX)
- JSON field path notation (`field.subfield`)
- Python or code syntax

**Exception:** BC-01 caveat text contains "CONCEPT-06" and "NOT_EVALUATED" — these are permitted within the governed BC-01 caveat string because they are the customer-facing identification of a known production risk, not internal routing references.

### 4.3 — `trace_depth_available` Constraint

Allowed value: `["L2", "L3"]` only. No other entries permitted. This communicates that deeper projections are available without exposing any detail about what they contain.

---

## SECTION 5 — STRUCTURAL PROHIBITIONS

A ZONE-2 payload must not allow reconstruction of:

1. **The full dependency graph** — no upstream/downstream artifact linkages
2. **Signal-to-claim mapping logic** — no signal_id, no source_refs, no trace_links
3. **Internal reasoning chain** — no transformation chains, no predicate evaluations
4. **Dimension derivation** — no DIM-XX values, no axis results, no component scores
5. **Execution state machine** — no raw state codes, no terminal state labels

The test for this is structural: if a technically capable consumer received the payload and attempted to reverse-engineer the PSEE computation model, they should find no entry points.

---

## SECTION 6 — ENFORCEMENT ARCHITECTURE

```
project() call
    │
    ├── Stage 1: Input Validation
    ├── Stage 2: Zone Filter (primary enforcement — strips Z1 fields)
    ├── Stage 3: Projection Transform
    ├── Stage 4: Persona Modifier
    ├── Stage 5: Output Validation (checks required caveats, zone filter result)
    │
    └── _validate_zone2_payload()   ← THIS PROFILE'S ENFORCEMENT POINT
            │
            ├── no-op if zone != ZONE-2
            │
            └── if zone == ZONE-2:
                    ├── check 1: named forbidden fields absent
                    ├── check 2: no forbidden key patterns
                    ├── check 3: top-level keys ⊆ allowed set
                    ├── check 4: signal subblock keys ⊆ allowed set; signal_id absent
                    ├── check 5: value.raw absent
                    └── check 6: explanation free of forbidden content substrings
                            │
                            ├── PASS → return None (payload proceeds)
                            └── FAIL → return ProjectionError {
                                          reason: "ERROR_ZONE2_PROFILE_VIOLATION"
                                        }
                                        (no payload returned)
```

Zone filter in Stage 2 is the primary enforcement mechanism. `_validate_zone2_payload()` is defense-in-depth — it catches any field that survived Stage 2 incorrectly, and it catches content-level leakage (forbidden substrings) that structural checks cannot detect.

---

## SECTION 7 — REGRESSION CONTRACT

The following test class in `scripts/pios/tests/test_projection_runtime.py` must pass at all times to confirm this profile is enforced:

**`TC11_Zone2PayloadSafety`** (5 tests):
- `test_no_forbidden_fields_present`
- `test_allowed_fields_only`
- `test_signal_block_sanitized`
- `test_no_structural_leakage_strings`
- `test_profile_violation_fails`

Any modification to `projection_runtime.py` that causes any of these tests to fail is a regression against this profile.

---

## SECTION 8 — NON-NEGOTIABLE RULES

**Rule Z2-01:** A ZONE-2 payload that contains any field from §3.1 must not be returned. The pipeline must fail closed with `ERROR_ZONE2_PROFILE_VIOLATION`.

**Rule Z2-02:** A ZONE-2 payload that contains a top-level key not in the §2 allowed set must not be returned. Unknown fields are forbidden.

**Rule Z2-03:** A ZONE-2 signal subblock that contains `signal_id` or any key outside §2.2 must not be returned.

**Rule Z2-04:** A ZONE-2 payload whose `explanation` field contains any of the §3.3 forbidden substrings must not be returned.

**Rule Z2-05:** `value.raw` must never appear in a ZONE-2 payload.

**Rule Z2-06:** Zone is determined by the serving context, not by the payload consumer. A consumer cannot upgrade their zone by modifying request parameters.

**Authority:** PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01
