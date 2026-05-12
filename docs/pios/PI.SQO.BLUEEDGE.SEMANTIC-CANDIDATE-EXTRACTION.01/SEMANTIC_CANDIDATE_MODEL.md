# Semantic Candidate Model

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01
**Type:** Reusable Doctrine — Data Model

---

## 1. Purpose

This document defines the authoritative schema and behavioral rules for semantic candidates — the non-authoritative signal primitives extracted from registered evidence material.

## 2. Candidate Schema

Every semantic candidate MUST contain these 13 fields:

```
candidate_id             string   Unique identifier (e.g., SC-T1-DOM-01)
evidence_id              string   Source evidence item ID (e.g., EV-BE-001)
source_path              string   Relative path to source evidence file
source_hash              string   SHA-256 hash of source file (64 hex chars)
extracted_label          string   Human-readable extracted text
candidate_type           string   Classification of what was extracted
candidate_domain         string   Target domain ID or UNMAPPED_CANDIDATE
source_span_reference    string   Provenance pointer into source HTML
extraction_method        string   Which grammar method produced this candidate
confidence_class         string   STRONG | MODERATE | WEAK
conflict_status          string   NONE (default; future: CONFLICT_DETECTED)
authority_state          string   NON_AUTHORITATIVE_SEMANTIC_CANDIDATE
next_required_gate       string   DYNAMIC_CEU_ADMISSIBILITY_REQUIRED
```

No field may be omitted. No additional fields are required at this stage.

## 3. Authority State

### 3.1 Default State

All candidates carry:

```
authority_state: NON_AUTHORITATIVE_SEMANTIC_CANDIDATE
```

This is the correct, intended, permanent state for extracted candidates within this corridor. It is NOT a provisional or degraded state.

### 3.2 State Transitions

Candidates do NOT transition authority state within extraction. The extraction corridor produces candidates at `NON_AUTHORITATIVE_SEMANTIC_CANDIDATE` and leaves them there.

Future authority transitions (outside this corridor's scope):

```
NON_AUTHORITATIVE_SEMANTIC_CANDIDATE
  → [Dynamic CEU admissibility evaluation]
  → CEU_ADMISSIBLE_CANDIDATE | CEU_REJECTED_CANDIDATE
  → [overlay proposal + approval]
  → OVERLAY_PROPOSED_CANDIDATE
  → [qualification delta]
  → QUALIFICATION_DELTA_APPLIED
```

This corridor does NOT implement any of these transitions.

### 3.3 Authority Boundary Rule

A candidate MUST NOT be treated as:
- Semantic authority
- Grounding evidence
- Overlay input (without admissibility gate)
- Qualification delta
- LENS-consumable projection
- Certified truth

## 4. Required Next Gate

All candidates carry:

```
next_required_gate: DYNAMIC_CEU_ADMISSIBILITY_REQUIRED
```

This gate cannot be bypassed. No candidate may proceed to overlay proposal, qualification delta, or any downstream pipeline without first passing Dynamic CEU admissibility evaluation.

The gate is:
- Set at extraction time
- Immutable within the extraction corridor
- Rendered explicitly in the cockpit UI
- Verified by tests

## 5. Confidence Class

Three confidence classes are defined:

### STRONG

Assigned when the extraction source provides high structural certainty:
- Domain name with "Grounded" tag (not "Weakly")
- Explicit metadata labels and values
- Document titles
- Focus domain designations
- GAUGE claim labels with full traceability

### MODERATE

Assigned when the extraction source provides structural presence but limited certainty:
- Domain name with "Weakly Grounded" or "Focus Domain" tag
- Diagnostic section titles
- Domain references in diagnostic chips
- Confidence badge marked "Moderate" in source

### WEAK

Assigned when the extraction source provides minimal signal:
- Capability references without domain context
- Confidence badge marked "Weak" in source

Confidence class does NOT determine authority. All confidence classes carry the same `NON_AUTHORITATIVE_SEMANTIC_CANDIDATE` authority state.

## 6. Conflict Status

Default: `NONE`

Conflict detection is not implemented in this corridor. The field exists as a schema placeholder for future corridors where candidates from different evidence sources may assert contradictory signals about the same domain.

Future conflict types (not yet implemented):
- `CONFLICT_DETECTED` — two candidates assert incompatible domain states
- `CONFLICT_RESOLVED` — conflict adjudicated through governance

## 7. Source Hash Linkage

Each candidate carries the `source_hash` of its evidence file — the SHA-256 hash registered in the evidence registry and re-verified at extraction time.

Verification chain:
1. Evidence registry records `evidence_hash` for each evidence item
2. Extractor reads the source file and computes SHA-256
3. Computed hash is compared to registered hash
4. Match is recorded in the extraction log (`hash_verified: true/false`)
5. Each candidate carries the registered hash as `source_hash`

If the hash does not match, the evidence item is still extracted (the hash mismatch is logged), but the extraction log records `hash_verified: false`.

## 8. Evidence Lineage Linkage

Each candidate is linked to exactly one evidence item through `evidence_id`.

Lineage chain:
```
Evidence Registry (EVREG-blueedge-run01-001)
  └── Evidence Item (e.g., EV-BE-001)
        └── Candidate (e.g., SC-T1-DOM-01)
```

A candidate CANNOT:
- Reference multiple evidence items
- Exist without an evidence_id
- Be derived from cross-evidence reasoning

## 9. Domain Targeting Behavior

### Mapped Candidates

When a candidate can be deterministically resolved to a single domain, `candidate_domain` is set to the DOMAIN-XX identifier.

Resolution methods:
- Domain keyword map (DOMAIN_KEYWORD_MAPPING method)
- Direct chip text (ARCHITECTURE_LAYER_MAPPING method)
- Evidence registry `candidate_domains` when length = 1

### Unmapped Candidates

When a candidate cannot be deterministically resolved, `candidate_domain` is set to `UNMAPPED_CANDIDATE`.

Unmapped candidates are:
- Explicitly visible in the cockpit UI
- Counted separately in the summary
- Flagged with `is_unmapped: true` in the view model
- Not discarded, hidden, or forced into a domain

## 10. Candidate Type Taxonomy

| Type | Source | Description |
|------|--------|-------------|
| DOMAIN_GROUNDING_STATUS | Tier 1 Brief | Domain name + grounding tag |
| STRUCTURAL_SIGNAL | Tier 1 Brief | Active structural signal title |
| FOCUS_DOMAIN_DESIGNATION | Tier 1 Brief | Designated focus domain |
| GAUGE_ARTIFACT_TITLE | GAUGE Artifact/Claim | Document title/purpose |
| GAUGE_CLAIM_LABEL | GAUGE Claim | Claim label from metadata |
| GAUGE_METRIC_VALUE | GAUGE Claim | Authoritative metric value |
| DIAGNOSTIC_SECTION | Tier 2 Diagnostic | Section number + title |
| DIAGNOSTIC_DOMAIN_REFERENCE | Tier 2 Diagnostic | Domain ID from chip |
| DIAGNOSTIC_CAPABILITY_REFERENCE | Tier 2 Diagnostic | Capability ID from chip |

## 11. Candidate ID Format

```
SC-{source}-{type}-{sequence}
```

Examples:
- `SC-T1-DOM-01` — Tier 1, domain, first
- `SC-T1-SIG-01` — Tier 1, signal, first
- `SC-T1-FOCUS-01` — Tier 1, focus domain
- `SC-GA-002` — GAUGE artifact, evidence item 002
- `SC-GA-004-VAL` — GAUGE artifact value, evidence item 004
- `SC-CLM-004` — GAUGE claim, evidence item 004
- `SC-T2-SEC-01` — Tier 2, section, first
- `SC-T2-DREF-10` — Tier 2, domain reference, DOMAIN-10
- `SC-T2-CAP-26` — Tier 2, capability, CAP-26
