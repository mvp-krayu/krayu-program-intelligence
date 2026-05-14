# Evidence Intake Workflow

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical governed workflow by which external evidence
enters SQO operational governance — from initial source identification
through governed registration — ensuring no unclassified, unbounded,
or unverifiable evidence enters the semantic qualification system.

---

## 2. Intake Workflow Overview

### 2.1 Seven-Phase Intake Pipeline

```
Phase 1: Source Discovery
    │   Identify candidate evidence sources
    ▼
Phase 2: Source Classification
    │   Classify source by type and authority
    ▼
Phase 3: Trust Assessment
    │   Assign trust level (TRUSTED / PROVISIONAL / QUARANTINED / PROHIBITED)
    ▼
Phase 4: Evidence Extraction
    │   Extract domain-relevant evidence from source
    ▼
Phase 5: Normalization
    │   Normalize extracted evidence into canonical form
    ▼
Phase 6: Provenance Binding
    │   Bind provenance chain (source → extraction → claim)
    ▼
Phase 7: Intake Registration
    │   Register evidence in governed intake inventory
    ▼
[Output: Registered evidence — ready for packaging]
```

### 2.2 Intake Boundary Rule

Evidence crosses the SQO governance boundary at Phase 7 (Intake
Registration). Before Phase 7, evidence is EXTERNAL. After Phase 7,
evidence is GOVERNED and subject to all SQO governance rules.

No evidence may influence qualification state without completing
all 7 intake phases.

---

## 3. Phase 1: Source Discovery

### 3.1 Discovery Process

```
STEP 1: Identify progression target
  - Determine which domains require evidence for S-state progression
  - Reference current gap analysis (backed_count vs target)
  - Identify domain clusters where evidence may exist

STEP 2: Identify candidate sources
  - Enumerate available external documentation
  - Enumerate available architecture records
  - Enumerate available operational artifacts
  - Enumerate available capability models

STEP 3: Record source candidates
  - For each candidate source:
    - Source location (path, URL, reference)
    - Source format (document, codebase, API spec, etc.)
    - Source owner (who created or maintains this source)
    - Estimated relevance to target domains
    - Estimated source freshness (last updated)
```

### 3.2 Discovery Output

```json
{
  "discovery_inventory": {
    "target_domains": ["DOM-04", "DOM-07", "DOM-09"],
    "progression_target": "S2 → S3",
    "candidate_sources": [
      {
        "source_ref": "SRC-001",
        "location": "<path or reference>",
        "format": "ADR",
        "owner": "<source authority>",
        "relevance": "HIGH — directly describes target domain architecture",
        "freshness": "<last updated date>"
      }
    ],
    "discovered_at": "<ISO-8601>",
    "discovered_by": "<operator identity>"
  }
}
```

---

## 4. Phase 2: Source Classification

### 4.1 Classification Process

```
STEP 1: Determine source type
  - Map source to one of the canonical source types:
    ADR | DOCUMENTATION | CAPABILITY_MODEL | OWNERSHIP_MAP |
    OPERATIONAL_RUNBOOK | DELIVERY_NARRATIVE | ARCHITECTURE_RECORD |
    API_SPECIFICATION | INFRASTRUCTURE_CONFIGURATION | OTHER

STEP 2: Determine default semantic class authorizations
  - Apply source-to-class mapping from SEMANTIC_CLASS_AUTHORIZATION_MODEL
  - Record which semantic classes this source type is authorized to contribute

STEP 3: Determine evidence density
  - Estimate number of evidence claims extractable from source
  - Estimate domains addressable from source
  - Estimate confidence level achievable (DIRECT_CITATION vs inference)

STEP 4: Record classification
  - Persist source classification to intake inventory
  - Generate SOURCE_CLASSIFIED intake event
```

### 4.2 Classification Gate (G-SOURCE-CLASS)

| Check | Requirement |
|-------|------------|
| Source type identified | Source maps to a canonical source type |
| Source type is not OTHER without justification | OTHER requires explicit operator justification |
| Default class authorizations recorded | At least one semantic class authorized |
| Source owner identified | Named source authority exists |
| Source format processable | Evidence can be extracted from this format |

---

## 5. Phase 3: Trust Assessment

See: EVIDENCE_TRUST_AND_QUARANTINE_MODEL.md for full trust model.

### 5.1 Trust Assessment Summary

```
STEP 1: Evaluate trust criteria
  - Source authority verifiable?
  - Source material integrity verifiable (hashable)?
  - Source freshness acceptable?
  - Source format deterministically processable?
  - Source does not self-reference (no circular authority)?

STEP 2: Assign trust level
  - TRUSTED:      All criteria met, source authority verified
  - PROVISIONAL:  Criteria mostly met, source authority declared but unverified
  - QUARANTINED:  One or more criteria failed, requires investigation
  - PROHIBITED:   Source fails structural trust requirements (fail closed)

STEP 3: Record trust assessment
  - Persist trust level to intake inventory
  - Generate TRUST_ASSESSED intake event
  - If QUARANTINED or PROHIBITED: generate escalation event
```

### 5.2 Trust Gate (G-TRUST)

| Check | Requirement |
|-------|------------|
| Trust level assigned | TRUSTED or PROVISIONAL (QUARANTINED/PROHIBITED fail closed) |
| Trust criteria recorded | All 5 criteria evaluated and results persisted |
| Quarantine reason recorded | If QUARANTINED, explicit reason with remediation path |
| Prohibited reason recorded | If PROHIBITED, explicit reason (no remediation — terminal) |

---

## 6. Phase 4: Evidence Extraction

### 6.1 Extraction Process

```
STEP 1: Map source content to target domains
  - Identify passages, sections, or fields relevant to target domains
  - Record structural correspondence between source and domain topology

STEP 2: Extract individual evidence claims
  - For each relevant passage:
    - Identify claim type (LABEL_ASSIGNMENT, LINEAGE_UPGRADE, etc.)
    - Identify target domain (DOM-NN)
    - Identify confidence basis (DIRECT_CITATION, STRONG_INFERENCE, CONTEXTUAL_DERIVATION)
    - Record exact evidence basis (specific passage or field reference)

STEP 3: Validate extraction
  - Verify each claim has explicit evidence basis (not inferred)
  - Verify each claim targets a valid domain in the topology model
  - Verify no interpretation beyond source content
  - Verify confidence basis is justified

STEP 4: Record extraction
  - Persist extracted claims to intake inventory
  - Generate EVIDENCE_EXTRACTED intake event
```

### 6.2 Extraction Rules

| Rule | Description |
|------|------------|
| No interpretation | Evidence must be structural, not inferred or summarized |
| No fabrication | Claims must derive from actual source content |
| One claim per extraction | Each extraction produces exactly one evidence claim |
| Explicit basis | Every claim must cite specific source passage or field |
| Single semantic class | Each claim targets exactly one semantic class |
| Authorized class only | Claim must reference a class authorized for this source type |

### 6.3 Extraction Gate (G-EXTRACT)

| Check | Requirement |
|-------|------------|
| All claims have evidence basis | No baseless claims |
| All claims target valid domains | Domains exist in topology model |
| All claims reference authorized class | Semantic class is authorized for source type |
| No interpretation detected | Claims are structural, not inferred |
| No duplicate claims | Same claim not already registered from another source |

---

## 7. Phase 5: Normalization

### 7.1 Normalization Process

```
STEP 1: Normalize claim format
  - Ensure claim conforms to SEP entry schema:
    entry_id, semantic_class, target_domain, claim_type,
    claim (field, proposed_value, evidence_basis),
    confidence_basis, replay_safe

STEP 2: Normalize provenance format
  - Ensure provenance conforms to SEP provenance schema:
    source_authority, source_type, source_hash,
    ingestion_stream, ingestion_commit, ingestion_timestamp

STEP 3: Compute source hash
  - hash = sha256(raw_bytes_of_source_material)
  - Hash computed BEFORE any processing or extraction
  - Hash recorded in provenance chain

STEP 4: Validate normalization
  - Schema validation against SEP entry model
  - Provenance completeness check
  - Hash integrity verification
```

### 7.2 Normalization Gate (G-NORMALIZE)

| Check | Requirement |
|-------|------------|
| Entry schema valid | All required fields present, correctly typed |
| Provenance schema valid | All provenance fields present and non-empty |
| Source hash computed | sha256 hash of raw source material recorded |
| Hash pre-processing | Hash was computed before extraction (provenance chain) |
| replay_safe = true | All entries attested as replay-safe |

---

## 8. Phase 6: Provenance Binding

### 8.1 Provenance Binding Process

```
STEP 1: Bind source-to-entry provenance
  - Link each normalized entry to its source document
  - Record: source_ref → extraction_ref → entry_id

STEP 2: Verify provenance chain completeness
  - Forward verification: source → entry (all entries traceable to source)
  - Backward verification: entry → source (all entries have source)

STEP 3: Verify no orphaned entries
  - No entry exists without a source reference
  - No source exists without at least one entry (or explicitly marked as no-yield)

STEP 4: Seal provenance binding
  - Compute provenance chain hash
  - Record binding in intake inventory
  - Generate PROVENANCE_BOUND intake event
```

### 8.2 Provenance Gate (G-PROVENANCE)

| Check | Requirement |
|-------|------------|
| Forward provenance complete | Every source has traceable entries |
| Backward provenance complete | Every entry has traceable source |
| No orphaned entries | No entry without source binding |
| Provenance chain hash computed | Chain integrity verifiable |
| No self-referential authority | Source authority is not the processing system |

---

## 9. Phase 7: Intake Registration

### 9.1 Registration Process

```
STEP 1: Final intake validation
  - All 6 prior phases complete
  - All gates passed
  - Trust level is TRUSTED or PROVISIONAL

STEP 2: Register in intake inventory
  - Assign intake registration ID
  - Record all provenance-bound entries
  - Record source classification and trust assessment
  - Record timestamp and operator identity

STEP 3: Mark evidence as GOVERNED
  - Evidence crosses the SQO governance boundary
  - Evidence is now subject to all governance gates
  - Evidence is now available for packaging workflow

STEP 4: Generate registration event
  - EVIDENCE_REGISTERED audit event
  - Intake inventory updated
  - Evidence available for packaging workflow
```

### 9.2 Registration Gate (G-REGISTER)

| Check | Requirement |
|-------|------------|
| All prior gates passed | G-SOURCE-CLASS, G-TRUST, G-EXTRACT, G-NORMALIZE, G-PROVENANCE |
| Trust level valid | TRUSTED or PROVISIONAL (not QUARANTINED or PROHIBITED) |
| Provenance complete | Full chain from source to entries |
| No duplicate registration | Evidence not already registered |
| Operator identity recorded | Who authorized this registration |

---

## 10. Intake Audit Trail

Every intake phase produces an audit event:

```json
{
  "intake_audit": {
    "event_type": "EVIDENCE_INTAKE",
    "phase": 3,
    "phase_name": "Trust Assessment",
    "source_ref": "SRC-001",
    "result": "PROVISIONAL",
    "gate_result": "PASS",
    "timestamp": "<ISO-8601>",
    "operator": "<operator identity>",
    "details": {
      "trust_criteria_met": 4,
      "trust_criteria_failed": 1,
      "failed_criterion": "source_authority_unverified",
      "trust_level": "PROVISIONAL"
    }
  }
}
```

---

## 11. Governance

- 7-phase intake pipeline ensures no ungoverned evidence enters SQO
- 6 intake-specific gates (G-SOURCE-CLASS through G-REGISTER) plus 5 cross-cutting gates
- Evidence crosses governance boundary only at Phase 7 (Registration)
- Trust assessment classifies evidence as TRUSTED, PROVISIONAL, QUARANTINED, or PROHIBITED
- QUARANTINED and PROHIBITED evidence fail closed — cannot be registered
- Every intake phase produces an auditable event
- No interpretation, fabrication, or inference permitted during extraction
- Source material is hash-verified before processing
- Full provenance chain from source to entry is mandatory
