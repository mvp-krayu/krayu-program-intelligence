# Debt Inventory Artifact Specification

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Artifact: semantic_debt_inventory.v1.json

### Schema

```json
{
  "schema_version": "1.0",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "s_state": "S0 | S1 | S2 | S3",
  "total_debt_items": "<integer>",
  "debt_items": [
    {
      "id": "DEBT-<CATEGORY>-<SEQ>",
      "category": "<category>",
      "severity": "CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM",
      "description": "<specific gap description>",
      "evidence": {
        "artifact_key": "<key>",
        "field_path": "<path>",
        "current_value": "<current>",
        "required_value": "<required>"
      },
      "blocks_s_state": "S2 | S3 | none",
      "has_upstream_dependency": "<boolean>",
      "remediation": {
        "action": "<description>",
        "source_material_needed": "<description>",
        "enrichment_pathway": "R1 | R2 | R3 | R4",
        "expected_impact": {
          "maturity_dimensions": ["D1", ...],
          "s_state_progression": "S1_TO_S2 | S2_TO_S3 | none"
        }
      },
      "priority_score": "<float>",
      "priority": "<integer rank>"
    }
  ],
  "summary": {
    "critical_count": "<integer>",
    "high_count": "<integer>",
    "medium_high_count": "<integer>",
    "medium_count": "<integer>",
    "s_state_blocking_count": "<integer>"
  },
  "governance": {
    "fail_closed": true,
    "client_agnostic": true,
    "no_semantic_fabrication": true,
    "no_source_mutation": true,
    "sqo_advisory_only": true
  },
  "provenance": {
    "source_commit": "<hash>",
    "input_hashes": { "<artifact_key>": "present | absent", ... },
    "operation": "detect_semantic_debt",
    "operation_version": "1.0",
    "output_hash": "sha256:<hex>"
  }
}
```

### Persistence

Written to: `artifacts/sqo/<client>/<run_id>/semantic_debt_inventory.v1.json`

Additive-only. No prior artifacts overwritten.

---

## 2. Artifact: continuity_assessment.v1.json

### Schema

```json
{
  "schema_version": "1.0",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "overall_status": "FULL | PARTIAL | NO_ASSESSMENT",
  "coverage_ratio": "<float 0..1>",
  "label_fidelity_ratio": "<float 0..1>",
  "lineage_strength": "<float 0..1>",
  "metrics": {
    "entity_count": "<integer>",
    "topology_node_count": "<integer>",
    "domain_count": "<integer>",
    "entities_with_business_label": "<integer>",
    "entities_without_business_label": "<integer>",
    "domains_grounded": "<integer>",
    "domains_ungrounded": "<integer>"
  },
  "gaps": [...],
  "governance": { ... },
  "provenance": { ... }
}
```

### Persistence

Written to: `artifacts/sqo/<client>/<run_id>/continuity_assessment.v1.json`

---

## 3. Artifact: debt_replay_verification.v1.json

Same 3-check structure as qualification_state_replay_verification.v1.json: input_integrity, deterministic_recomputation, output_hash.

---

## 4. Artifact: debt_certification.v1.json

Contains certification cases: debt_detection_complete, deterministic_recomputation, replay_verification, governance_boundary. Overall verdict: CERTIFIED or NOT_CERTIFIED.
