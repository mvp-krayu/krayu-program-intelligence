# Evidence Source Classification Model

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical classification taxonomy for evidence sources
entering SQO operational governance — ensuring every source is
typed, bounded, and semantically scoped before evidence extraction
begins.

---

## 2. Source Type Taxonomy

### 2.1 Primary Source Types

| Source Type | Code | Description | Typical Format |
|-------------|------|-------------|---------------|
| Architecture Decision Record | ADR | Formal architecture decisions with rationale | Markdown, structured document |
| Component Documentation | DOC | Technical documentation describing components | Markdown, wiki, HTML |
| Capability Model | CAP | Business capability inventories and maps | Structured document, spreadsheet |
| Ownership Map | OWN | Team/ownership assignments to components | Structured document, YAML |
| Operational Runbook | OPS | Runtime operational procedures | Markdown, structured document |
| Delivery Narrative | NAR | Business delivery descriptions, epics, initiatives | Document, presentation |
| Architecture Record | ARC | Formal architecture descriptions, diagrams | Document, diagram + description |
| API Specification | API | OpenAPI, gRPC, protocol definitions | YAML, JSON, protobuf |
| Infrastructure Configuration | INF | Deployment, orchestration, networking config | YAML, HCL, JSON |
| Organizational Vocabulary | VOC | Business glossary, domain naming conventions | Structured document, glossary |
| Incident Material | INC | Post-incident reviews, failure analyses | Document, timeline |
| Issue Tracker Semantics | ISS | Issue labels, project structures, category systems | Structured export |

### 2.2 Source Type Classification Rules

| Rule | Description |
|------|------------|
| Exactly one type | Every source must be classified as exactly one type |
| No UNKNOWN type | Source type must be determined before proceeding |
| Type determines class scope | Source type defines default semantic class authorizations |
| Type is immutable | Once classified, source type does not change for that intake |
| Re-classification requires new intake | If source type was wrong, a new intake is required |

---

## 3. Source-to-Semantic-Class Authorization Matrix

### 3.1 Default Authorization Mapping

| Source Type | STRUCTURAL | TECHNICAL | PRODUCT | OPERATIONAL | BUSINESS | DOMAIN | GOVERNANCE |
|-------------|:----------:|:---------:|:-------:|:-----------:|:--------:|:------:|:----------:|
| ADR         | YES | YES | — | — | — | YES | — |
| DOC         | — | YES | YES | — | — | YES | — |
| CAP         | — | — | YES | — | YES | YES | — |
| OWN         | — | — | — | YES | YES | — | — |
| OPS         | — | — | — | YES | — | YES | — |
| NAR         | — | — | YES | — | YES | — | — |
| ARC         | YES | YES | — | — | — | YES | — |
| API         | — | YES | YES | — | — | — | — |
| INF         | — | YES | — | YES | — | — | — |
| VOC         | — | — | — | — | YES | YES | — |
| INC         | — | — | — | YES | — | — | — |
| ISS         | — | — | YES | YES | — | — | — |

### 3.2 Authorization Override Rules

Default authorizations may be overridden under strict conditions:

| Override Type | Requirement |
|--------------|------------|
| Add class | Explicit operator justification + governance review |
| Remove class | No justification required (restricting is always safe) |
| Add GOVERNANCE class | Governance authority review required |
| Add all classes | PROHIBITED — no blanket authorization |

### 3.3 Override Audit

Every authorization override is recorded:

```json
{
  "authorization_override": {
    "source_ref": "SRC-001",
    "source_type": "ADR",
    "class_added": "OPERATIONAL",
    "justification": "ADR contains explicit operational procedures in section 4",
    "authorized_by": "<operator identity>",
    "timestamp": "<ISO-8601>"
  }
}
```

---

## 4. Source Quality Dimensions

### 4.1 Five Quality Dimensions

| Dimension | Description | Assessment |
|-----------|-------------|-----------|
| Completeness | How thoroughly does the source cover its subject? | COMPLETE / PARTIAL / MINIMAL |
| Specificity | How precisely does the source identify targets? | SPECIFIC / GENERAL / VAGUE |
| Freshness | How recently was the source created or updated? | CURRENT / DATED / STALE |
| Authority | How authoritative is the source's creator? | PRIMARY / SECONDARY / TERTIARY |
| Processability | How deterministically can evidence be extracted? | DETERMINISTIC / SEMI-STRUCTURED / UNSTRUCTURED |

### 4.2 Quality Impact on Evidence

| Quality Profile | Impact on Extraction | Impact on Trust |
|----------------|---------------------|----------------|
| COMPLETE + SPECIFIC + CURRENT | Maximum confidence achievable (DIRECT_CITATION) | TRUSTED likely |
| PARTIAL + GENERAL + CURRENT | Moderate confidence (STRONG_INFERENCE) | PROVISIONAL likely |
| MINIMAL + VAGUE + STALE | Low confidence (CONTEXTUAL_DERIVATION only) | QUARANTINE risk |
| Any + UNSTRUCTURED | Non-deterministic extraction risk | QUARANTINE required |

### 4.3 Minimum Quality Requirements

| Requirement | Threshold |
|------------|-----------|
| Completeness | At least PARTIAL for target domain |
| Specificity | At least GENERAL for domain identification |
| Freshness | Not STALE (>24 months without update) unless no alternative exists |
| Authority | At least SECONDARY (not hearsay) |
| Processability | At least SEMI-STRUCTURED (unstructured requires justification) |

---

## 5. Source Provenance Requirements

### 5.1 Mandatory Provenance Fields

| Field | Description | Required |
|-------|-------------|----------|
| source_authority | Named entity who created or owns the source | MANDATORY |
| source_type | Canonical source type from taxonomy | MANDATORY |
| source_location | Path, URL, or reference to source material | MANDATORY |
| source_format | Document format (markdown, yaml, json, etc.) | MANDATORY |
| source_hash | sha256 of raw source material | MANDATORY (computed at intake) |
| source_created | When the source was originally created | RECOMMENDED |
| source_updated | When the source was last updated | RECOMMENDED |
| source_version | Version identifier if versioned | OPTIONAL |

### 5.2 Provenance Verification

| Check | Requirement |
|-------|------------|
| Authority named | source_authority is not empty and not "unknown" |
| Authority verifiable | Named entity can theoretically confirm they provided material |
| Authority not self | Source authority is not the processing system |
| Location accessible | Source can be retrieved from stated location |
| Hash verifiable | sha256 of retrieved source matches recorded hash |

---

## 6. Multi-Source Evidence Correlation

### 6.1 When Multiple Sources Cover Same Domain

When multiple sources provide evidence for the same domain:

```
IF sources agree (same claim, same target):
  → Record corroboration — increases confidence
  → Only ONE entry needed (cite both sources in evidence_basis)

IF sources partially overlap:
  → Each source produces independent entries for non-overlapping claims
  → Overlapping claims: record corroboration

IF sources conflict:
  → QUARANTINE conflicting claims
  → Escalate to operator for resolution
  → Do not register conflicting claims simultaneously
```

### 6.2 Source Conflict Resolution

| Conflict Type | Resolution | Authority |
|--------------|-----------|-----------|
| Same claim, different value | Operator decides which source is authoritative | OPERATOR |
| Same domain, competing types | Both may coexist if different claim types | GOVERNANCE |
| Same source, contradictory statements | Source is QUARANTINED until contradiction resolved | GOVERNANCE |
| Stale source vs current source | Current source takes precedence | OPERATOR |

---

## 7. FastAPI Onboarding Readiness

### 7.1 Source Types Likely for FastAPI

| Expected Source Type | Example | Class Authorizations |
|---------------------|---------|---------------------|
| ADR | FastAPI architecture decisions | STRUCTURAL, TECHNICAL, DOMAIN |
| DOC | FastAPI component documentation | TECHNICAL, PRODUCT, DOMAIN |
| API | FastAPI OpenAPI specifications | TECHNICAL, PRODUCT |
| ARC | FastAPI architecture records | STRUCTURAL, TECHNICAL, DOMAIN |
| OPS | FastAPI operational procedures | OPERATIONAL, DOMAIN |

### 7.2 Readiness Statement

The source classification model is client-agnostic. The same
taxonomy, authorization matrix, and quality dimensions apply to
FastAPI evidence as to BlueEdge evidence. No FastAPI-specific
modifications are required.

---

## 8. Governance

- 12 canonical source types cover all expected evidence categories
- Source-to-class authorization matrix prevents unauthorized semantic projection
- Authorization overrides require explicit justification and audit trail
- 5 quality dimensions ensure source adequacy assessment
- Multi-source conflict resolution prevents contradictory evidence registration
- Classification model is client-agnostic — ready for FastAPI onboarding
- No source may bypass classification before evidence extraction begins
