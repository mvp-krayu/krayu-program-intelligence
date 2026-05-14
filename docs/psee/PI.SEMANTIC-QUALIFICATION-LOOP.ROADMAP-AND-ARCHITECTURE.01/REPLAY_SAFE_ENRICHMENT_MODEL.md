# Replay-Safe Enrichment Model

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines how semantic enrichment within the SQO qualification lifecycle maintains replay safety — the guarantee that identical inputs produce identical outputs, that enrichment is additive-only, and that governance-safe overlays never mutate source artifacts.

Replay safety is not optional. It is the foundation of deterministic governance. An enrichment that cannot be replayed is an enrichment that cannot be audited, certified, or trusted.

---

## 2. Core guarantees

### Guarantee R1: Deterministic derivation

Same input artifacts + same enrichment operation + same operation version → identical output.

No stochastic components. No randomized identifiers. No timestamp-dependent derivation logic (timestamps are metadata, not derivation inputs).

### Guarantee R2: Additive-only persistence

New enrichment outputs append to the SQO artifact set. Prior outputs are retained, never overwritten, never deleted.

Version history is monotonically growing. Every enrichment cycle produces a new version. The version chain is the audit trail.

### Guarantee R3: Source immutability

Enrichment never modifies source artifacts. Lane A artifacts, Lane D (DPSIG) artifacts, semantic pipeline artifacts, and existing PATH B payloads are read-only inputs to enrichment operations.

SQO writes exclusively to `artifacts/sqo/<client>/<run_id>/`. No other output path is permitted.

### Guarantee R4: Hash-anchored provenance

Every enrichment output carries the sha256 hashes of its input artifacts. Replay verification: re-hash the inputs and compare against the stored hashes. If the hashes match, the output is replay-valid.

### Guarantee R5: Operation versioning

Each enrichment operation carries a version identifier. The version identifier is part of the derivation — same inputs with different operation versions may produce different outputs. This is expected and correct. The version makes the derivation fully specified.

---

## 3. Enrichment artifact lifecycle

### 3.1 Creation

An enrichment artifact is created by an SQO operation that reads source artifacts and produces a new SQO artifact.

```
Source artifacts (read-only)
    │
    ▼
SQO operation (versioned, deterministic)
    │
    ▼
SQO artifact (new file in artifacts/sqo/<client>/<run_id>/)
    │
    ▼
Provenance record (input hashes, operation version, output hash)
```

### 3.2 Versioning

Each enrichment cycle produces a new version of the artifact:

```
artifacts/sqo/<client>/<run_id>/
├── maturity_score.json                    # current version (symlink or latest)
├── maturity_score.v1.json                 # version 1
├── maturity_score.v2.json                 # version 2 (after enrichment)
└── maturity_score.v3.json                 # version 3 (after further enrichment)
```

Version numbering is monotonically increasing. No version may be skipped. No version may be rewritten.

### 3.3 Retention

All versions are retained indefinitely. Deletion of prior versions is a governance violation.

The rationale: replay verification requires the ability to re-derive any prior version from its inputs. If the version is deleted, the derivation chain is broken.

### 3.4 Supersession

A new version supersedes the prior version for operational purposes (current S-state assessment, current maturity score, current debt inventory). Prior versions remain available for audit and replay verification.

The current version is determined by the highest version number, not by a mutable pointer.

---

## 4. Replay verification protocol

### Step 1: Load the artifact and its provenance record

```json
{
  "artifact": "maturity_score.v2.json",
  "provenance": {
    "input_hashes": {
      "semantic_topology_model": "sha256:abc123...",
      "decision_validation": "sha256:def456...",
      "canonical_topology_40_4": "sha256:ghi789..."
    },
    "operation": "compute_maturity_score",
    "operation_version": "1.0",
    "output_hash": "sha256:jkl012..."
  }
}
```

### Step 2: Verify input integrity

Re-hash each source artifact on disk. Compare against stored input hashes.

| Input artifact | Stored hash | Current hash | Match |
|---------------|-------------|--------------|-------|
| semantic_topology_model | sha256:abc123... | sha256:abc123... | YES |
| decision_validation | sha256:def456... | sha256:def456... | YES |
| canonical_topology_40_4 | sha256:ghi789... | sha256:ghi789... | YES |

If ANY input hash does not match → replay verification FAILS. The source artifacts have changed since the enrichment was produced. The enrichment output may no longer be valid.

### Step 3: Re-execute the operation

Run the same operation (same version) with the same inputs. Compare the output against the stored output.

If the re-execution output matches the stored output → replay verification PASSES. The enrichment is deterministically reproducible.

If the re-execution output does not match → replay verification FAILS. The operation has non-deterministic behavior. This is a governance violation.

### Step 4: Record the verification result

```json
{
  "verification": {
    "artifact": "maturity_score.v2.json",
    "timestamp": "<ISO-8601>",
    "input_integrity": "PASS | FAIL",
    "output_reproducibility": "PASS | FAIL",
    "overall": "PASS | FAIL"
  }
}
```

---

## 5. Governance-safe overlays

### 5.1 Definition

A governance-safe overlay is an enrichment artifact that adds semantic context to existing artifacts without modifying them. The overlay is a separate artifact that references the source artifact by key and hash.

### 5.2 Overlay model

```json
{
  "overlay_type": "semantic_annotation | qualification_metadata | enrichment_context",
  "target_artifact": {
    "key": "semantic_topology_model",
    "hash": "sha256:abc123...",
    "path": "clients/blueedge/.../semantic_topology_model.json"
  },
  "overlay_content": {
    "annotations": [
      {
        "target_field": "domains[2].domain_name",
        "annotation_type": "business_context",
        "annotation_value": "This domain maps to the Payment Processing capability",
        "evidence_source": "ADR-042: Payment Architecture Decision",
        "annotation_version": "1.0"
      }
    ]
  },
  "provenance": {
    "source_hash": "sha256:abc123...",
    "overlay_hash": "sha256:mno345...",
    "operation": "annotate_domains",
    "operation_version": "1.0"
  }
}
```

### 5.3 Overlay rules

**RULE OV-01:** Overlays NEVER modify the target artifact file. The target artifact remains byte-identical before and after overlay creation.

**RULE OV-02:** Overlays are stored in the SQO namespace (`artifacts/sqo/`), not alongside the target artifact.

**RULE OV-03:** Overlays carry the target artifact's hash at the time of overlay creation. If the target artifact changes (new pipeline run), the overlay becomes stale and must be re-evaluated.

**RULE OV-04:** Overlays are additive-only. New overlay versions append; prior versions retained.

**RULE OV-05:** Overlays must not contain AI-generated semantic content. Overlay annotations must reference evidence sources.

**RULE OV-06:** Consumers that render overlay content must disclose the overlay's provenance. The executive must know that an annotation comes from SQO enrichment, not from the source pipeline.

---

## 6. Enrichment and existing replay-safe systems

### TAXONOMY-01 compatibility

SQO enrichment operations NEVER touch TAXONOMY-01 fields:
- `signal_value` — immutable Lane D artifact
- `activation_state` — immutable after derivation
- `signal_stable_key` — deterministic, hash-anchored
- `derivation_hash` — cryptographic derivation trace
- `derivation_trace.*` — full audit chain

TAXONOMY-01 fields are L1/L2 data fields. SQO operates at L4 qualification. No layer leakage.

### DPSIG compatibility

SQO enrichment operations NEVER write to `artifacts/dpsig/`. DPSIG derivation is Lane D sovereign. SQO reads DPSIG outputs for signal contextualization only.

### Rendering metadata compatibility

SQO enrichment does not modify `rendering_metadata.json`. Rendering metadata is a vault artifact with self-hash integrity. SQO reads rendering metadata for qualification assessment only.

### Binding envelope compatibility

SQO enrichment NEVER writes to `binding_envelope.json`. The binding envelope is READ ONLY for all consumers (IRC-05).

---

## 7. Enrichment operation registry

All SQO enrichment operations must be registered:

| Operation | Version | Inputs | Output | Deterministic |
|-----------|---------|--------|--------|---------------|
| compute_maturity_score | 1.0 | manifest, all artifacts | maturity_score.json | YES |
| compute_semantic_debt | 1.0 | manifest, all artifacts | semantic_debt_inventory.json | YES |
| detect_qualification_state | 1.0 | manifest, loadResult | qualification_state.json | YES |
| assess_continuity | 1.0 | crosswalk, topology | continuity_assessment.json | YES |
| generate_recommendations | 1.0 | debt inventory, maturity score | enrichment_recommendations.json | YES |
| produce_governance_disclosure | 1.0 | qualification state, Q-class | governance_disclosure.json | YES |

New operations must be registered before use. Unregistered operations are governance violations.

Each operation must pass a determinism verification test: run twice with identical inputs, compare outputs byte-for-byte.

---

## 8. Governance constraints

1. All SQO enrichment operations must be deterministic. Non-deterministic operations are governance violations.
2. All SQO enrichment outputs are additive-only. No mutation, no deletion, no overwrite.
3. All SQO enrichment outputs carry provenance (input hashes, operation version, output hash).
4. Source artifacts are immutable from SQO's perspective. SQO reads only.
5. TAXONOMY-01 fields are never touched by SQO operations.
6. Overlays never modify target artifacts. Overlays are separate files in the SQO namespace.
7. Replay verification must be possible for every SQO enrichment output.
8. Enrichment operations must be registered before use.
9. No AI-generated content in enrichment outputs. All annotations must reference evidence sources.
10. Version history is immutable. No version rewriting, no version deletion.
