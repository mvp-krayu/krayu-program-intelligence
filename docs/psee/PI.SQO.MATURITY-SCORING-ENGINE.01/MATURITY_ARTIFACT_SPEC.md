# Maturity Artifact Specification

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Overview

The Maturity Scoring Engine emits 7 governed JSON artifacts per client. All artifacts conform to schema version 1.0, carry SHA256 output hash provenance, and are deterministically reproducible from their inputs.

---

## 2. Artifact Inventory

| # | Artifact Filename                         | Emitting Module                   | Purpose                                           |
|---|-------------------------------------------|-----------------------------------|---------------------------------------------------|
| 1 | semantic_maturity_profile.v1.json         | MaturityScoringEngine.js          | Overall maturity score, band, and dimension summary |
| 2 | semantic_gravity_assessment.v1.json       | SemanticGravityEngine.js          | Gravity score, band, and contributing dimensions   |
| 3 | qualification_stability.v1.json           | QualificationStabilityEngine.js   | Stability score, band, and contributing dimensions |
| 4 | progression_readiness.v1.json             | ProgressionReadinessEngine.js     | Readiness score, target S-state, blocking debts    |
| 5 | maturity_replay_verification.v1.json      | MaturityReplayVerifier.js         | 3-check replay verification results               |
| 6 | maturity_certification.v1.json            | MaturityScoringEngine.js          | Certification status and validation summary        |
| 7 | maturity_dimension_breakdown.v1.json      | MaturityScoringEngine.js          | Per-dimension scores, bands, and input traces      |

---

## 3. Artifact Schemas

### 3.1 semantic_maturity_profile.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "semantic_maturity_profile",
  "client_id": "<string>",
  "s_state": "<S0|S1|S2|S3>",
  "overall_maturity": {
    "score": "<float 0.0-1.0>",
    "band": "<LOW|PARTIAL|STABLE|STRONG>"
  },
  "dimensions": {
    "D1": { "score": "<float>", "band": "<string>" },
    "D2": { "score": "<float>", "band": "<string>" },
    "D3": { "score": "<float>", "band": "<string>" },
    "D4": { "score": "<float>", "band": "<string>" },
    "D5": { "score": "<float>", "band": "<string>" },
    "D6": { "score": "<float>", "band": "<string>" },
    "D7": { "score": "<float>", "band": "<string>" },
    "D8": { "score": "<float>", "band": "<string>" }
  },
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

### 3.2 semantic_gravity_assessment.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "semantic_gravity_assessment",
  "client_id": "<string>",
  "gravity": {
    "score": "<float 0.0-1.0>",
    "band": "<FRAGMENTED|EMERGING|STABILIZING|GRAVITATIONAL>"
  },
  "contributing_dimensions": {
    "D1": "<float>",
    "D2": "<float>",
    "D3": "<float>",
    "D5": "<float>",
    "D7": "<float>"
  },
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

### 3.3 qualification_stability.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "qualification_stability",
  "client_id": "<string>",
  "stability": {
    "score": "<float 0.0-1.0>",
    "band": "<UNSTABLE|CONDITIONAL|STABLE|RESILIENT>"
  },
  "contributing_dimensions": {
    "D1": "<float>",
    "D3": "<float>",
    "D4": "<float>",
    "D5": "<float>"
  },
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

### 3.4 progression_readiness.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "progression_readiness",
  "client_id": "<string>",
  "current_state": "<S0|S1|S2|S3>",
  "target_state": "<S1|S2|S3|S4>",
  "readiness": {
    "score": "<float 0.0-1.0>",
    "blocking_debt_count": "<integer>",
    "total_debt_items": "<integer>"
  },
  "blocking_debts": [
    {
      "category": "<string>",
      "count": "<integer>"
    }
  ],
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

### 3.5 maturity_replay_verification.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "maturity_replay_verification",
  "client_id": "<string>",
  "checks": {
    "input_integrity": {
      "status": "<PASS|FAIL>",
      "input_hash": "<SHA256>"
    },
    "deterministic_recomputation": {
      "status": "<PASS|FAIL>",
      "recomputed_dimensions": {
        "D1": "<float>", "D2": "<float>", "D3": "<float>", "D4": "<float>",
        "D5": "<float>", "D6": "<float>", "D7": "<float>", "D8": "<float>"
      }
    },
    "output_hash": {
      "status": "<PASS|FAIL>",
      "artifact_hashes": {
        "semantic_maturity_profile": "<SHA256>",
        "semantic_gravity_assessment": "<SHA256>",
        "qualification_stability": "<SHA256>",
        "progression_readiness": "<SHA256>",
        "maturity_certification": "<SHA256>",
        "maturity_dimension_breakdown": "<SHA256>"
      }
    }
  },
  "overall_status": "<PASS|FAIL>",
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

### 3.6 maturity_certification.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "maturity_certification",
  "client_id": "<string>",
  "s_state": "<S0|S1|S2|S3>",
  "certification_status": "<CERTIFIED|NOT_CERTIFIED>",
  "overall_maturity": {
    "score": "<float>",
    "band": "<string>"
  },
  "gravity": {
    "score": "<float>",
    "band": "<string>"
  },
  "stability": {
    "score": "<float>",
    "band": "<string>"
  },
  "progression_readiness": {
    "score": "<float>",
    "target_state": "<string>"
  },
  "replay_verification": "<PASS|FAIL>",
  "boundary_validation": "<PASS|FAIL>",
  "certification_criteria": {
    "all_dimensions_computed": "<boolean>",
    "gravity_derived": "<boolean>",
    "stability_derived": "<boolean>",
    "progression_computed": "<boolean>",
    "replay_passed": "<boolean>",
    "artifacts_emitted": "<boolean>",
    "hash_provenance_recorded": "<boolean>",
    "no_upstream_mutation": "<boolean>",
    "deterministic_confirmed": "<boolean>"
  },
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

### 3.7 maturity_dimension_breakdown.v1.json

```json
{
  "schema_version": "1.0",
  "artifact_type": "maturity_dimension_breakdown",
  "client_id": "<string>",
  "s_state": "<S0|S1|S2|S3>",
  "dimensions": [
    {
      "id": "D1",
      "name": "STRUCTURAL_CONTINUITY",
      "score": "<float>",
      "band": "<string>",
      "formula": "avg(coverage_ratio, label_fidelity_ratio)",
      "inputs": {
        "coverage_ratio": "<float>",
        "label_fidelity_ratio": "<float>"
      }
    }
  ],
  "overall_maturity": {
    "score": "<float>",
    "band": "<string>"
  },
  "output_hash": "<SHA256>",
  "timestamp": "<ISO8601>"
}
```

---

## 4. Schema Version

All artifacts use schema version **1.0**.

Schema versioning rules:
- Minor updates (new optional fields) increment the minor version
- Breaking changes (removed fields, type changes) require a new major version
- Schema version is embedded in both the filename (`.v1.`) and the artifact body (`schema_version`)

---

## 5. SHA256 Output Hash Provenance

Every artifact includes an `output_hash` field containing the SHA256 hash of the artifact's content (excluding the `output_hash` field itself). This enables:

1. **Tamper detection** — any modification to the artifact invalidates the hash
2. **Replay verification** — the MaturityReplayVerifier compares recomputed hashes against recorded hashes
3. **Chain of custody** — downstream consumers can verify artifact integrity before consumption

Hash computation order:
1. Serialize the artifact to JSON (excluding `output_hash`)
2. Compute SHA256 of the serialized content
3. Insert the hash into the `output_hash` field
4. Write the final artifact

---

## 6. Artifact Emission Rules

1. All 7 artifacts MUST be emitted per client for certification to be valid
2. Partial emission invalidates the certification
3. Artifacts are written to governed output paths only
4. Artifacts are immutable after emission (verified by replay)
5. Each artifact is self-contained (no cross-artifact references required for interpretation)

---

## 7. Governance Compliance

- All artifact schemas are defined in this specification
- No schema deviation is permitted without version increment
- All artifacts carry provenance metadata (hash, timestamp, schema version)
- Artifact emission does not mutate any upstream artifact
