# Evidence Qualification Applicability Model

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how evidence qualifies for operational use — which evidence
classes influence which qualification dimensions, how evidence
applicability is assessed before packaging, and how evidence
contributions are attributed after activation.

---

## 2. Qualification Influence Matrix

### 2.1 Semantic Class → Qualification Dimension

| Semantic Class | backed_count | grounding_ratio | continuity | domain_typing | debt_resolution |
|---------------|:----------:|:---------------:|:----------:|:-------------:|:---------------:|
| STRUCTURAL | YES | YES | — | — | YES |
| TECHNICAL | YES | YES | — | YES | YES |
| PRODUCT | — | — | YES | YES | YES |
| OPERATIONAL | — | — | — | YES | — |
| BUSINESS | — | — | YES | — | YES |
| DOMAIN | YES | YES | — | YES | YES |
| GOVERNANCE | — | — | — | — | — |

### 2.2 Key Definitions

| Dimension | Description | How Evidence Contributes |
|-----------|-------------|------------------------|
| backed_count | Number of domains with BACKED lineage status | Evidence providing LINEAGE_UPGRADE to a domain |
| grounding_ratio | Proportion of domains with structural grounding | Evidence increasing domain coverage |
| continuity | Crosswalk coverage between structural and business vocabulary | Evidence providing CONTINUITY_MAPPING |
| domain_typing | Quality and depth of domain semantic classification | Evidence providing DOMAIN_TYPING or CAPABILITY_BINDING |
| debt_resolution | Resolution of identified semantic debt items | Evidence resolving specific debt entries |

---

## 3. Applicability Assessment

### 3.1 Pre-Packaging Applicability Check

Before evidence enters packaging, its qualification applicability
must be assessed:

```
FOR each evidence entry:

  STEP 1: Determine claim type
    LABEL_ASSIGNMENT     → domain_typing, possibly backed_count
    LINEAGE_UPGRADE      → backed_count, grounding_ratio
    CONTINUITY_MAPPING   → continuity
    CAPABILITY_BINDING   → domain_typing
    EDGE_ENRICHMENT      → structural topology (no direct qualification impact)
    DOMAIN_TYPING        → domain_typing

  STEP 2: Verify class-dimension authorization
    - Entry's semantic_class must authorize the claimed dimension
    - E.g., OPERATIONAL class entry cannot claim backed_count impact
    - If unauthorized dimension claimed → REJECTED

  STEP 3: Assess target domain eligibility
    - Target domain exists in topology model
    - Target domain is not already at maximum coverage for claimed dimension
    - Target domain is not in conflict with existing overlay claims

  STEP 4: Estimate qualification delta
    - Compute expected change to qualification metrics
    - Record in overlay_metadata.estimated_impact
```

### 3.2 Applicability Gate (G-APPLICABILITY)

| Check | Requirement |
|-------|------------|
| Claim type valid | Claim type exists in authorized set |
| Class-dimension authorized | Semantic class permits claimed qualification dimension |
| Domain eligible | Target domain can receive this type of enrichment |
| No domain saturation | Domain is not already FULL for this claim type |
| Impact estimated | Expected qualification delta recorded |

---

## 4. Claim Type Applicability Rules

### 4.1 LINEAGE_UPGRADE

| Property | Requirement |
|----------|------------|
| Effect | Upgrades domain lineage status (NONE → PARTIAL or PARTIAL → BACKED) |
| Qualification impact | backed_count +1, grounding_ratio increase |
| Eligible classes | STRUCTURAL, TECHNICAL, DOMAIN |
| Minimum confidence | STRONG_INFERENCE (DIRECT_CITATION preferred) |
| Domain requirement | Domain lineage is currently NONE or PARTIAL |
| Prohibition | Cannot upgrade already-BACKED domain |

### 4.2 LABEL_ASSIGNMENT

| Property | Requirement |
|----------|------------|
| Effect | Assigns or refines a business label to a structural domain |
| Qualification impact | domain_typing improvement, crosswalk extension |
| Eligible classes | TECHNICAL, PRODUCT, BUSINESS, DOMAIN |
| Minimum confidence | STRONG_INFERENCE |
| Domain requirement | Domain does not already have a label from higher-confidence source |
| Prohibition | Cannot overwrite PIPELINE_CERTIFIED label |

### 4.3 CONTINUITY_MAPPING

| Property | Requirement |
|----------|------------|
| Effect | Maps structural vocabulary to business vocabulary |
| Qualification impact | continuity improvement |
| Eligible classes | PRODUCT, BUSINESS |
| Minimum confidence | STRONG_INFERENCE |
| Domain requirement | Mapping target exists in both structural and business vocabularies |
| Prohibition | Cannot create circular mappings |

### 4.4 CAPABILITY_BINDING

| Property | Requirement |
|----------|------------|
| Effect | Binds a structural group to a business capability |
| Qualification impact | domain_typing improvement |
| Eligible classes | PRODUCT, DOMAIN |
| Minimum confidence | STRONG_INFERENCE |
| Domain requirement | Capability target exists in business vocabulary |
| Prohibition | Cannot bind to capabilities outside client's domain model |

### 4.5 EDGE_ENRICHMENT

| Property | Requirement |
|----------|------------|
| Effect | Enriches structural edge with semantic typing |
| Qualification impact | Indirect — structural topology depth |
| Eligible classes | STRUCTURAL, TECHNICAL |
| Minimum confidence | DIRECT_CITATION (structural claims require high confidence) |
| Domain requirement | Edge exists in topology model |
| Prohibition | Cannot create new edges (only enrich existing) |

### 4.6 DOMAIN_TYPING

| Property | Requirement |
|----------|------------|
| Effect | Assigns or refines domain semantic type |
| Qualification impact | domain_typing improvement |
| Eligible classes | TECHNICAL, PRODUCT, OPERATIONAL, DOMAIN |
| Minimum confidence | STRONG_INFERENCE |
| Domain requirement | Domain exists in topology model |
| Prohibition | Cannot change domain type assigned by PIPELINE_CERTIFIED source |

---

## 5. S-State Progression Applicability

### 5.1 Evidence Required per S-State Transition

| Transition | Evidence Requirement | Minimum Confidence |
|-----------|---------------------|-------------------|
| S0 → S1 | Pipeline-produced structural evidence | N/A (pipeline-certified) |
| S1 → S2 | Pipeline-produced qualification evidence | N/A (pipeline-certified) |
| S2 → S3 | Overlay-driven evidence for remaining unbacked domains | STRONG_INFERENCE minimum |
| S3 → S4 | Full-domain coverage with PIPELINE_CERTIFIED authority | N/A (requires pipeline re-execution) |

### 5.2 S2 → S3 Applicability Rules

The primary evidence workflow supports S2 → S3 progression:

```
S2 → S3 requires: all domains BACKED (varies by client)

Evidence applicability for S2 → S3:
  - Only LINEAGE_UPGRADE claims can increase backed_count
  - Only STRUCTURAL, TECHNICAL, DOMAIN classes can produce LINEAGE_UPGRADE
  - Minimum confidence: STRONG_INFERENCE
  - Target: domains with lineage = NONE or PARTIAL

Supporting evidence types:
  - LABEL_ASSIGNMENT contributes to domain_typing (required for Q-class)
  - CONTINUITY_MAPPING contributes to crosswalk coverage
  - CAPABILITY_BINDING contributes to domain classification quality
```

### 5.3 Progression Impact Estimation

```json
{
  "progression_impact": {
    "current_state": "S2, Q-02, 7/17 backed",
    "proposed_package": "SEP-blueedge-CLU-04-004",
    "estimated_impact": {
      "backed_count": "7 → 10 (+3)",
      "grounding_ratio": "0.412 → 0.588 (+0.176)",
      "debt_items_resolved": 3,
      "S3_progress": "10/17 (59%)",
      "estimated_iterations_to_S3": 2
    }
  }
}
```

---

## 6. Post-Activation Attribution

### 6.1 Attribution Model

After overlay activation, every qualification metric change is
attributed to specific evidence entries:

```json
{
  "qualification_attribution": {
    "metric": "backed_count",
    "before": 7,
    "after": 10,
    "delta": 3,
    "contributors": [
      {
        "package_id": "SEP-blueedge-CLU-04-004",
        "entry_id": "SEP-ENTRY-001",
        "claim_type": "LINEAGE_UPGRADE",
        "target_domain": "DOM-04",
        "contribution": "backed_count +1",
        "source_ref": "SRC-004",
        "confidence": "STRONG_INFERENCE"
      },
      {
        "package_id": "SEP-blueedge-CLU-04-004",
        "entry_id": "SEP-ENTRY-002",
        "claim_type": "LINEAGE_UPGRADE",
        "target_domain": "DOM-07",
        "contribution": "backed_count +1",
        "source_ref": "SRC-004",
        "confidence": "DIRECT_CITATION"
      },
      {
        "package_id": "SEP-blueedge-CLU-04-005",
        "entry_id": "SEP-ENTRY-001",
        "claim_type": "LINEAGE_UPGRADE",
        "target_domain": "DOM-09",
        "contribution": "backed_count +1",
        "source_ref": "SRC-005",
        "confidence": "STRONG_INFERENCE"
      }
    ]
  }
}
```

### 6.2 Attribution Rules

| Rule | Description |
|------|------------|
| Every delta attributed | No qualification change without explicit attribution |
| Per-entry attribution | Attribution is per evidence entry, not per package |
| Source traceable | Attribution traces through lineage to external source |
| Confidence recorded | Attribution records the confidence basis of contributing evidence |
| Revocation attribution | If overlay revoked, negative delta attributed to same entries |

---

## 7. Evidence Applicability for Future FastAPI Onboarding

### 7.1 Client-Agnostic Design

The applicability model is client-agnostic:

| Property | Client Independence |
|----------|-------------------|
| Claim types | Same 6 types for any client |
| Semantic classes | Same 7 classes for any client |
| Qualification dimensions | Same dimensions for any client |
| Confidence requirements | Same minimum thresholds for any client |
| Domain count | Varies by client (BlueEdge: 17, FastAPI: TBD) |

### 7.2 FastAPI-Specific Considerations

| Consideration | Note |
|--------------|------|
| FastAPI is heavily API-documented | API source type will likely produce TECHNICAL + PRODUCT classes |
| FastAPI has extensive component docs | DOC source type will dominate |
| FastAPI domain count TBD | S3 threshold depends on topology output |
| No FastAPI intake occurs in this contract | Architecture only |

---

## 8. Governance

- Qualification influence matrix maps semantic classes to qualification dimensions
- 6 claim types with explicit applicability rules and minimum confidence requirements
- Class-dimension authorization prevents unauthorized qualification influence
- S-state progression applicability defines evidence requirements per transition
- Post-activation attribution traces every metric change to specific entries
- Attribution model is client-agnostic — ready for FastAPI onboarding
- GOVERNANCE class evidence has no direct qualification impact (audit-only)
- No evidence may influence qualification without passing applicability gate
