# Semantic Evidence Package Model

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Definition

A Semantic Evidence Package (SEP) is a governed, versioned, provenance-bound
container of external semantic evidence that may be applied as an additive
overlay to an existing qualified substrate WITHOUT mutating the deterministic
structural truth produced by PATH A or the semantic projection layer of PATH B.

A SEP is NOT:
- a replacement for the structural pipeline
- a mutation of existing artifacts
- an AI inference product
- a shortcut past semantic processing

A SEP IS:
- an externalized, replay-safe evidence container
- independently removable without substrate corruption
- provenance-bound to a specific source authority
- governance-scoped to authorized semantic classes
- additive-only relative to the certified substrate

---

## 2. Package Structure

```
semantic_evidence_package.v1.json
{
  "schema_version": "1.0",
  "package_id": "SEP-<client>-<run_id>-<seq>",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "created": "<ISO-8601>",
  "package_version": "<integer, monotonic>",
  "status": "STAGED | ACTIVATED | REVOKED",

  "provenance": {
    "source_authority": "<who provided this evidence>",
    "source_type": "ADR | DOCUMENTATION | CAPABILITY_MODEL | OWNERSHIP_MAP | OPERATIONAL_RUNBOOK | DELIVERY_NARRATIVE | ARCHITECTURE_RECORD | OTHER",
    "source_hash": "sha256:<hex of original source material>",
    "ingestion_stream": "<stream ID that produced this package>",
    "ingestion_commit": "<git commit hash>",
    "ingestion_timestamp": "<ISO-8601>"
  },

  "semantic_class_authorizations": [
    {
      "class": "STRUCTURAL | TECHNICAL | PRODUCT | OPERATIONAL | BUSINESS | DOMAIN | GOVERNANCE",
      "authorized": true | false,
      "justification": "<why this class is authorized or denied>"
    }
  ],

  "evidence_entries": [
    {
      "entry_id": "SEP-ENTRY-<seq>",
      "semantic_class": "<class from authorization list>",
      "target_domain": "DOM-<XX> | null (global)",
      "claim_type": "LABEL_ASSIGNMENT | LINEAGE_UPGRADE | CONTINUITY_MAPPING | CAPABILITY_BINDING | EDGE_ENRICHMENT | DOMAIN_TYPING",
      "claim": {
        "field": "<target field path>",
        "proposed_value": "<proposed semantic enrichment>",
        "evidence_basis": "<reference to source material>"
      },
      "confidence_basis": "DIRECT_CITATION | STRONG_INFERENCE | CONTEXTUAL_DERIVATION",
      "replay_safe": true
    }
  ],

  "overlay_metadata": {
    "entry_count": "<integer>",
    "affected_domains": ["DOM-XX", ...],
    "affected_dimensions": ["D1", "D2", ...],
    "estimated_impact": {
      "grounding_delta": "<integer — expected change in backed_count>",
      "continuity_delta": "<float — expected change in continuity coverage>",
      "debt_resolution_count": "<integer — debt items potentially resolved>"
    }
  },

  "governance": {
    "substrate_mutation": false,
    "path_a_mutation": false,
    "path_b_mutation": false,
    "additive_only": true,
    "independently_removable": true,
    "replay_safe": true,
    "provenance_bound": true
  }
}
```

---

## 3. Package Lifecycle

```
CREATION → STAGED → ACTIVATED → [REVOKED]
                                    ↓
                              [SUPERSEDED by newer version]
```

### 3.1 CREATION

A SEP is produced by a governed ingestion stream operating on external
source material. The stream must:
- identify the source authority
- hash the source material
- classify evidence entries by semantic class
- obtain semantic class authorization
- produce the package artifact

### 3.2 STAGED

A newly created SEP enters STAGED status. In this state:
- the package is persisted to the artifact store
- the package has NOT been applied to any qualification evaluation
- the package can be inspected, audited, and rejected
- no substrate state changes

### 3.3 ACTIVATED

An ACTIVATED SEP has been applied as an overlay to the qualification
evaluation pipeline. In this state:
- Dynamic CEU entries from the package contribute to semantic evaluation
- qualification re-evaluation may be triggered
- the overlay is independently removable
- the package version is locked

### 3.4 REVOKED

A REVOKED SEP has been withdrawn. In this state:
- all overlay contributions are removed
- qualification state reverts to pre-overlay evaluation
- the package artifact remains for audit trail
- revocation is recorded with timestamp and reason

---

## 4. Persistence

```
artifacts/sqo/<client>/<run_id>/semantic_evidence_packages/
├── SEP-<client>-<run_id>-001.v1.json
├── SEP-<client>-<run_id>-001.v2.json
├── SEP-<client>-<run_id>-002.v1.json
└── package_registry.json
```

### Package Registry

```json
{
  "client": "<client_id>",
  "run_id": "<run_id>",
  "packages": [
    {
      "package_id": "SEP-<client>-<run_id>-<seq>",
      "current_version": 2,
      "status": "ACTIVATED | STAGED | REVOKED",
      "created": "<ISO-8601>",
      "last_modified": "<ISO-8601>"
    }
  ],
  "total_active": "<integer>",
  "total_revoked": "<integer>"
}
```

---

## 5. Claim Types

| Claim Type | Description | Substrate Impact |
|------------|-------------|-----------------|
| LABEL_ASSIGNMENT | Assigns a business label to a structural domain | Enriches domain naming; contributes to crosswalk coverage |
| LINEAGE_UPGRADE | Upgrades a domain's lineage status based on external evidence | Increases grounding ratio; may change backed_count |
| CONTINUITY_MAPPING | Adds a structural-to-business vocabulary mapping | Extends crosswalk; contributes to semantic continuity |
| CAPABILITY_BINDING | Binds a structural group to a business capability | Enriches domain typing; contributes to D5 maturity |
| EDGE_ENRICHMENT | Enriches an edge with semantic typing beyond CONTAINS/IMPORTS | Contributes to structural topology depth |
| DOMAIN_TYPING | Assigns or refines a domain's semantic type | Contributes to domain classification quality |

---

## 6. Mandatory Constraints

1. A SEP MUST have provenance linking every claim to source material.
2. A SEP MUST NOT modify any artifact in the PATH A artifact chain.
3. A SEP MUST NOT modify any artifact in the PATH B projection chain.
4. A SEP MUST be independently removable without corrupting the substrate.
5. A SEP MUST be replay-safe: same inputs produce same outputs.
6. A SEP MUST declare which semantic classes it is authorized to enrich.
7. A SEP MUST NOT enrich unauthorized semantic classes.
8. A SEP MUST be versioned monotonically.
9. A SEP removal MUST restore the prior qualification state exactly.
10. A SEP MUST NOT become indistinguishable from certified substrate.
