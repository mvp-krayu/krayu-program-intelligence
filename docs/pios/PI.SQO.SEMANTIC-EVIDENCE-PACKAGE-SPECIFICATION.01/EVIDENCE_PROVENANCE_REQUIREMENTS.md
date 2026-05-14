# Evidence Provenance Requirements

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Provenance Principle

Every semantic claim in a Dynamic CEU overlay must be traceable to a
specific piece of external evidence from a specific source authority.
Provenance is not metadata — it is the authority chain that makes
a semantic claim verifiable.

Without provenance, a semantic claim is fabrication.

---

## 2. Provenance Chain Structure

```
SOURCE MATERIAL (external document, codebase artifact, ADR, etc.)
    │
    │  source_hash: sha256 of original material
    │  source_authority: who provided it
    │  source_type: classification of material type
    │
    ▼
INGESTION STREAM (governed execution that processes source material)
    │
    │  ingestion_stream: stream ID
    │  ingestion_commit: git commit hash
    │  ingestion_timestamp: ISO-8601
    │
    ▼
EVIDENCE ENTRY (individual semantic claim within a SEP)
    │
    │  entry_id: unique identifier
    │  evidence_basis: specific reference within source material
    │  confidence_basis: DIRECT_CITATION | STRONG_INFERENCE | CONTEXTUAL_DERIVATION
    │
    ▼
OVERLAY APPLICATION (claim applied to composite semantic state)
    │
    │  overlay_contribution record in composite state
    │  package_id + entry_id for attribution
    │
    ▼
QUALIFICATION IMPACT (effect on Q-class, S-state, debt resolution)
    │
    │  re-evaluation artifact with overlay attribution
```

---

## 3. Source Authority Requirements

The `source_authority` field identifies who provided the evidence:

| Authority Type | Description | Example |
|---------------|-------------|---------|
| CLIENT_TEAM | The client's own engineering/product team | "FastAPI core maintainers" |
| CLIENT_DOCUMENTATION | Client's existing documentation artifacts | "FastAPI repository documentation" |
| ARCHITECTURE_REVIEW | Formal architecture review output | "Architecture review board — 2026-Q1" |
| OPERATIONAL_TEAM | Client's operations/SRE team | "FastAPI deployment team" |
| GOVERNANCE_AUTHORITY | Krayu governance review | "PI governance review — Stream 75.x" |

Rules:
1. Source authority MUST be a named entity (no anonymous sources).
2. Source authority MUST be verifiable (the named entity can confirm
   they provided the material).
3. Source authority MUST NOT be the processing system itself (the
   system cannot be its own evidence authority).

---

## 4. Source Material Hashing

The source material is hashed at ingestion time to ensure:
- integrity: the material has not been tampered with
- replay safety: re-processing the same material produces the same hash
- auditability: the exact source can be identified

```
source_hash = sha256(raw_bytes_of_source_material)
```

Rules:
1. The hash MUST be computed before any processing or extraction.
2. The hash MUST be included in every SEP that derives from this source.
3. If the source material is updated, a new ingestion run is required
   (producing a new SEP version with a new source_hash).
4. The raw source material SHOULD be retained in a governed location
   for audit purposes.

---

## 5. Evidence Basis Requirements

Each evidence entry must declare its relationship to the source material:

### 5.1 DIRECT_CITATION

The claim is a direct extraction from the source material with
minimal transformation.

Requirements:
- The specific passage, section, or field in the source must be identifiable
- The claim value must be directly derivable from the cited passage
- No inference beyond what the source explicitly states

Example: An ADR states "Module X implements the payment processing
capability." The evidence entry assigns DOMAIN-05 the business label
"Payment Processing" with DIRECT_CITATION to the ADR section.

### 5.2 STRONG_INFERENCE

The claim is a well-supported inference from multiple source evidence
points that, taken together, strongly indicate the semantic claim.

Requirements:
- Multiple source passages must support the inference
- The inference must be logically valid (not speculative)
- The supporting passages must be cited

Example: Three ADRs together describe Module X as handling payments,
billing, and invoicing. The evidence entry assigns DOMAIN-05 the type
FUNCTIONAL with STRONG_INFERENCE based on the three ADRs collectively.

### 5.3 CONTEXTUAL_DERIVATION

The claim is derived from the broader context of the source material
with reasonable but less direct support.

Requirements:
- The contextual basis must be described
- The derivation logic must be stated
- The claim is marked with lower overlay confidence

Example: A delivery narrative mentions "the team responsible for the
core API layer" without naming specific modules. The evidence entry
assigns DOMAIN-03 a preliminary business label with CONTEXTUAL_DERIVATION.

---

## 6. Provenance Verification

At package activation time, the following provenance checks are executed:

| Check | Requirement | Failure |
|-------|-------------|---------|
| Source hash present | `provenance.source_hash` is non-empty | REJECTED |
| Source authority named | `provenance.source_authority` is non-empty | REJECTED |
| Source type declared | `provenance.source_type` is valid enum value | REJECTED |
| Ingestion stream recorded | `provenance.ingestion_stream` is non-empty | REJECTED |
| Ingestion commit recorded | `provenance.ingestion_commit` is valid hash | REJECTED |
| Every entry has basis | All entries have `evidence_basis` non-empty | REJECTED |
| Every entry has confidence | All entries have valid `confidence_basis` | REJECTED |
| No self-referential authority | source_authority is not the processing system | REJECTED |

If any check fails, the package MUST NOT be activated.

---

## 7. Provenance and Governance Audit

The provenance chain enables governance audit:

1. **Forward audit:** Given a source document, trace all evidence entries
   derived from it, and all qualification impacts of those entries.

2. **Backward audit:** Given a qualification state change (e.g., S1 → S2),
   trace the overlay contributions that caused it, the evidence entries
   that contributed, and the source documents they derive from.

3. **Attribution audit:** For any semantic claim in the composite state,
   determine whether it comes from certified substrate (Static CEU) or
   overlay contribution (Dynamic CEU), and if overlay, which package,
   entry, and source document.

All three audit directions must be satisfiable from the persisted
artifact chain without requiring external state.
