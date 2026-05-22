# Implementation Semantics — RC-01: Chronicle Vault + Baseline

## 1. Primitive Inventory

| Primitive | Module | Purpose | Reuse Status |
|-----------|--------|---------|--------------|
| Chronicle Vault Structure | `clients/{client}/chronicle/` | Per-client chronicle directory tree | REUSABLE — any client can instantiate |
| CHRONICLE_MANIFEST.json | `clients/{client}/chronicle/CHRONICLE_MANIFEST.json` | Master index: stream registry, checkpoint index, chapter index | REUSABLE — contract-driven |
| Checkpoint Contract | `clients/{client}/chronicle/checkpoints/checkpoint_NN_*.json` | Frozen governance boundary state capture | REUSABLE — any governance boundary |
| Proof Object Contract | `clients/{client}/chronicle/*/` | Governance-adjacent aggregation artifact | REUSABLE — any proof aggregation |
| Spine Object Accumulator | `clients/{client}/chronicle/spine/spine_objects.json` | Accumulated spine objects across checkpoints | REUSABLE — extends existing spine model |
| Spine Index | `clients/{client}/chronicle/spine/spine_index.json` | Cross-reference by type, checkpoint, timestamp | REUSABLE — standard indexing |

## 2. Input Contracts

### Checkpoint Contract — Input Shape

A checkpoint requires:

```json
{
  "checkpoint_id": "string — unique identifier (checkpoint_NN_name)",
  "checkpoint_index": "integer — sequential ordering",
  "semantic_phase": "string — one of: EMERGENCE, FORMATION, TENSION, STRENGTHENING, STABILIZATION, QUALIFICATION, CONVERGENCE, PROJECTION",
  "chronicle_chapter": "integer — chapter reference",
  "timestamp": "ISO 8601 UTC",
  "stream_ref": "string — producing stream ID",
  "description": "string — what this checkpoint captures",
  "status": "string — FROZEN | PENDING"
}
```

Additional fields are checkpoint-type-specific (client_identity, sqo_state, semantic_ontology, evidence_sources, vault_claims, psee_history, etc.).

### Proof Object Contract — Input Shape

```json
{
  "proof_id": "string — UUID",
  "proof_type": "string — MILESTONE | GOVERNANCE | SEMANTIC_TRANSITION | STRENGTHENING | CERTIFICATION",
  "checkpoint_ref": "string — checkpoint_id",
  "spine_object_refs": ["array of spine_id strings"],
  "evidence_refs": ["array of evidence_object_id strings"],
  "summary": "object — type-specific fields",
  "timestamp": "ISO 8601 UTC",
  "hash": "string — SHA-256 of canonical JSON"
}
```

### CHRONICLE_MANIFEST.json — Input Shape

```json
{
  "schema_version": "1.0",
  "chronicle_id": "string",
  "client": "string",
  "canonical_run": "string — PSEE run ID",
  "chronicle_type": "GOVERNED_COGNITIVE_REPLAY",
  "status": "IN_PROGRESS | COMPLETE | CERTIFIED",
  "streams": "object — keyed by RC-NN, each with name, classification, status, checkpoint(s)",
  "checkpoint_index": "object — keyed by checkpoint_id, each with semantic_phase, description, stream, status",
  "chapters": "array — ordered chapter definitions with title, semantic_phase, checkpoint_ref(s)"
}
```

## 3. Output Contracts

| Output | Location | Shape | Consumed By |
|--------|----------|-------|-------------|
| Checkpoint JSON | `chronicle/checkpoints/checkpoint_NN_*.json` | See §2 Checkpoint Contract | RC-02..RC-09 (pre-flight verification), RC-08 (narrative compilation), RC-09 (certification) |
| Spine Objects JSON | `chronicle/spine/spine_objects.json` | Array of spine objects per canonical model | RC-02..RC-09 (accumulation), RC-08 (narrative proof-linking), RC-09 (certification) |
| Spine Index | `chronicle/spine/spine_index.json` | Cross-reference by type/checkpoint/timestamp | RC-08 (chapter-to-proof traversal) |
| CHRONICLE_MANIFEST.json | `chronicle/CHRONICLE_MANIFEST.json` | See §2 CHRONICLE_MANIFEST | All RC streams (pre-flight), RC-09 (final certification) |

## 4. Calibration Assumptions

| Assumption | Value | Governed/Tuned |
|------------|-------|----------------|
| Checkpoint count | 11 (00-10) | GOVERNED — matches semantic rhythm |
| Chapter count | 8 | GOVERNED — matches cognitive traversal design |
| Semantic phases | 8 (EMERGENCE through PROJECTION) | GOVERNED — reflects cognitive lifecycle |
| Zoom levels | 5 (Z1-Z5) | GOVERNED — cognitive depth model |
| Max descent paths per chapter | 3-4 | TUNED — anti-over-documentation discipline |
| Max chronicle vault files | ~60 | TUNED — navigability constraint |

## 5. Extension Points

| Extension | Parameterization | Notes |
|-----------|-----------------|-------|
| Client ID | `client` field in manifest | Any client can instantiate chronicle vault |
| Canonical run | `canonical_run` field | Any PSEE run can serve as chronicle subject |
| Checkpoint contract | Additional fields per checkpoint type | Schema is extensible within checkpoint_id/semantic_phase/status core |
| Proof object types | `proof_type` enum | New proof types can be added per stream needs |
| Spine class registry | Follows canonical spine model | New spine classes require governance stream |
| Chapter definitions | `chapters` array in manifest | Chapter count and titles are chronicle-specific |

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| `chronicle/CHRONICLE_MANIFEST.json` | Master index — status, stream registry, checkpoint index, chapter mapping |
| `chronicle/checkpoints/` | Frozen state snapshots at governance boundaries |
| `chronicle/spine/` | Accumulated spine objects and cross-reference index |
| `chronicle/propositions/` | Proposition lifecycle (candidate → reviewed → final) |
| `chronicle/evidence/` | Evidence manifests and enrichment logs |
| `chronicle/governance/` | Governance proof capsules, review summaries, debt evolution |
| `chronicle/convergence/` | Cross-specimen convergence observations |
| `chronicle/narrative/` | Narrative chapter objects and proof capsules |
| `chronicle/media/` | Screenshot captures at checkpoint boundaries |
| `chronicle/certification/` | Final certification artifact and replay corridor |
