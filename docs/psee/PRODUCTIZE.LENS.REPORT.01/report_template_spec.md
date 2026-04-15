# Report Template Specification
# PRODUCTIZE.LENS.REPORT.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.REPORT.01
- Date: 2026-04-15
- Authority: PRODUCTIZE.LENS.REPORT.01 (parent: PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01)

---

## SECTION 1 — PURPOSE

This specification defines the mandatory structure, content rules, and language transformation
requirements for the LENS Executive Report — a formal, decision-grade artifact produced from
governed ZONE-2 projections.

The report is not a summary. It is:
- structured
- commercial-grade
- executive-readable
- evidence-backed
- PDF-ready

---

## SECTION 2 — DATA SOURCE CONTRACT

### 2.1 — Exclusive Source

All report content is derived from ZONE-2 projection payloads only.

Primary data path: `GET /api/projection?claim_id=<id>&zone=ZONE-2&depth=L1`
Fallback path: pre-generated fragment files at
`clients/blueedge/vaults/run_01_authoritative/claims/fragments/<id>-ZONE-2-L1.json`

The fallback is permitted only when the API server is not reachable. The fallback reads
projection output files, not vault source files.

### 2.2 — Required Claims

| claim_id | label | evidence_class (V1) |
|----------|-------|---------------------|
| CLM-25 | Executive Three-Axis Verdict | CONDITIONAL |
| CLM-09 | Proven Structural Score | VERIFIED |
| CLM-20 | Signal: Sensor Bridge Throughput | VERIFIED |
| CLM-12 | Score Confidence Range | CONDITIONAL |
| CLM-10 | Achievable Score Projected | CONDITIONAL |

If any claim is unavailable, returns non-ZONE-2, or carries `error_type`, the generator
MUST fail closed and report which claim could not be consumed.

### 2.3 — Payload Validation

Before report generation:
1. All payloads must have `zone == "ZONE-2"`
2. No payload may have `error_type` present
3. All payloads must be from the required claim list

---

## SECTION 3 — CAVEAT NORMALIZATION

Caveats collected from ZONE-2 payloads may contain internal identifiers
(e.g. `SIG-XXX`, `COND-XXX`, `CONCEPT-XX`, `BC-XX`) that must not appear
in the report body.

### 3.1 — Normalization Hierarchy

1. **Exact-match transforms**: Known caveats with internal IDs are replaced with
   pre-authored executive equivalents (see `_CAVEAT_TRANSFORMS` in generator).

2. **Pattern cleanup**: Residual internal identifiers are neutralized via regex substitution
   (see `_ID_PATTERNS` in generator).

### 3.2 — Known Caveat Transforms (V1)

| source caveat | normalized form |
|--------------|-----------------|
| CLM-25: BC-01 predicate mismatch (verbose) | "Execution readiness verdict requires a configuration correction before it can be automatically derived. Execution status is confirmed as pending assessment." |
| CLM-25: BC-01 predicate mismatch (concise) | "Execution readiness verdict is manually confirmed as pending assessment. This condition will resolve upon a targeted configuration update." |
| CLM-20: chain notation | "Runtime throughput is not measured; the capacity ceiling reflects static configuration only and requires live validation to confirm operational performance." |

### 3.3 — Pattern Rules

| pattern | replacement |
|---------|------------|
| `SIG-\d+` | `[signal reference]` |
| `COND-\d+` | `[condition reference]` |
| `DIAG-\d+` | `[diagnostic reference]` |
| `INTEL-\d+` | `[intelligence reference]` |
| `CONCEPT-\d+` | `[predicate condition]` |
| `BC-\d+` | `[blocking condition]` |
| `PHASE_\w+` | `[phase condition]` |
| `NOT_EVALUATED` | `pending assessment` |

---

## SECTION 4 — LABEL NORMALIZATION

Claim labels that begin with an internal ID prefix (`SIG-XXX`, `COND-XXX`, etc.)
must have the prefix stripped before display in any report section.

Pattern: `^(SIG|COND|DIAG|INTEL|ART|TRN)-\d+\s*` → remove

Example: `"SIG-001 Sensor Bridge Throughput"` → `"Sensor Bridge Throughput"`

---

## SECTION 5 — MANDATORY REPORT SECTIONS

The report MUST contain all of the following sections in order:

| # | section | content source |
|---|---------|---------------|
| 1 | Cover / Header | run_id, generated_at from anchor payload; static zone statement |
| 2 | Executive Summary | synthesis of CLM-25, CLM-09, CLM-10, CLM-12, CLM-20 (3–5 sentences) |
| 3 | Current State Assessment | CLM-09 (structural), CLM-25 (execution), CLM-12 (confidence) |
| 4 | Key Findings | one card per claim — CLM-25, CLM-09, CLM-20, CLM-12, CLM-10 |
| 5 | Risks and Conditions | normalized caveats from all payloads |
| 6 | Decision Guidance | 3–5 action points from caveats + evidence_class |
| 7 | Observability Advantage | static + grounded; premium access note |
| 8 | Controlled Appendix | evidence composition, claim registry, run metadata |

---

## SECTION 6 — LANGUAGE TRANSFORMATION RULES

### 6.1 — MUST

- Convert technical language into executive language
- Write for CEO / CTO / buyer / sponsor readability
- Emphasize decision relevance and truth observability
- Make the report feel premium and commercially credible
- Ground every statement in a named claim or payload field

### 6.2 — MUST NOT

- Use lazy filler prose
- Use "why it matters" as a section label
- Expose raw internal category codes as headings (STRUCTURE, COMPLEXITY, EXECUTION)
- Restate raw payload text verbatim without editorial transformation
- Invent data, metrics, claims, or conclusions
- Include chain notation (`A → B → C`)
- Include internal ID prefixes (SIG-XXX, COND-XXX, DIAG-XXX, INTEL-XXX)
- Include code-style field names (`source_field`, `transformation_summary`, etc.)
- Include raw vault paths or artifact file references

---

## SECTION 7 — REPORT BODY VALIDATION

Before writing output, the generator MUST validate:

1. No forbidden substrings in rendered HTML text body:
   - `SIG-`
   - `COND-`
   - `DIAG-`
   - `INTEL-`

2. No forbidden payload fields in any rendered text:
   - `source_field`, `transformation_summary`, `artifact_path`, `artifact_id`
   - `signal_id`, `full_trace`, `known_gaps`, `blocking_conditions`

3. All mandatory sections present

4. All required claims referenced (CLM-25, CLM-09, CLM-20, CLM-12, CLM-10)

If any validation check fails, the generator MUST exit non-zero with a clear error message.
It MUST NOT write a partial or non-compliant report.

---

## SECTION 8 — OUTPUT SPECIFICATION

### 8.1 — Format

Clean standalone HTML with:
- All CSS inlined in `<style>` block — no external stylesheet dependencies
- No CDN-loaded assets
- No JavaScript
- Printable layout (`@media print` rules included)
- Professional light-theme typography (suitable for executive document delivery)

### 8.2 — Default Output Path

`/tmp/lens_report.html`

Configurable via `--output` CLI argument.

### 8.3 — PDF Generation

Optional. Attempt PDF if `weasyprint` is available.
Generator MUST NOT fail if PDF tooling is unavailable.

---

## SECTION 9 — CLI CONTRACT

```
python3 scripts/pios/lens_report_generator.py [--output PATH]
```

Exit codes:
- `0` — COMPLETE: report written, all validations passed
- `1` — FAIL: any validation error, missing claim, or non-ZONE-2 payload

---

## SECTION 10 — GOVERNANCE CONFIRMATION

- **No vault access:** fragment files read are projection outputs, not vault source files
- **No claim mutation:** payloads consumed read-only
- **No hallucination:** all statements grounded in named payload fields
- **No ZONE-1 fields:** only ZONE-2 allowed fields accessed
- **Fail-closed:** generator exits non-zero on any violation before writing output

**Authority:** PRODUCTIZE.LENS.REPORT.01
