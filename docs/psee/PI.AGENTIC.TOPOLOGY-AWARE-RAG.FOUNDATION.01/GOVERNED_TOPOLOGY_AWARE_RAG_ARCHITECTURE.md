# Governed Topology-Aware RAG Architecture

**Stream:** PI.AGENTIC.TOPOLOGY-AWARE-RAG.FOUNDATION.01  
**Document type:** TOPOLOGY-AWARE RAG ARCHITECTURE — AUTHORITATIVE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Mode:** GOVERNANCE_MODE  
**Parent foundations:** PI.AGENTIC-SEMANTIC-ORCHESTRATION.FOUNDATION.01, PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01  
**Prerequisites:** All narrative family streams (PROMPT-GOVERNANCE.01, EVIDENCE-INJECTION.01, COGNITIVE-NORMALIZATION.01, EXECUTIVE-RENDERING.01)

---

## 1. Executive Summary

This document defines the governed topology-aware RAG (Retrieval-Augmented Generation) architecture — the system that enables semantic retrieval of structural intelligence artifacts while preserving the canonical authority of the JSON artifact store, maintaining topology fidelity, and ensuring every retrieval act is traceable, replay-safe, and governance-bounded.

The governing principle:

> **Vector systems retrieve evidence. They do NOT become truth authorities.**

RAG is a supplementary retrieval mechanism. It accelerates discovery of relevant topology artifacts, historical patterns, and governance context. It does not replace the canonical JSON artifact store as the ground truth for structural intelligence. Every fact used in executive output must be traceable to a committed artifact — a vector similarity score is not evidence authority.

This is the **governed RAG model** first referenced in `GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md §9`: vector retrieval is SUPPLEMENTARY and non-authoritative; JSON artifacts remain primary. This stream formalizes that model into a complete, implementation-ready architecture.

This document establishes:
- The complete topology-aware RAG pipeline with canonical authority preservation
- Topology-aware chunking architecture that respects structural boundaries
- Vector governance model with embedding lineage and replay safety
- Retrieval containment rules aligned with the `allowed_reads` manifest
- Replay-safe retrieval with determinism classification
- Governance-safe orchestration memory model
- Topology-aware interrogation architecture
- Multi-agent governance with authority separation
- Full implementation architecture blueprint

**Governance verdict:** PASS — GOVERNED_TOPOLOGY_AWARE_RAG_VIABLE

---

## 2. Governance Inheritance Baseline

### 2.1 Governance Load Confirmation

```
GOVERNANCE LOAD VERIFIED:
- GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md: LOADED — additive lane doctrine, fail-closed rules
- pipeline_execution_manifest.json: LOADED — allowed_reads defines canonical artifact boundary
- STREAM_GOVERNANCE_LOAD_TEMPLATE.md: LOADED — stream discipline
- governance_baselines.json: LOADED — active baseline confirmed
- CLAUDE_GOVERNANCE_LOAD_RULE.md: LOADED — intelligence layer governance load rule
- AGENTIC_SEMANTIC_ORCHESTRATION_FOUNDATION.md: LOADED — 6-layer stack, LLM boundary
- GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md: LOADED — governed RAG model §9 (supplementary)
- GOVERNED_PROMPT_ORCHESTRATION_ARCHITECTURE.md: LOADED — prompt versioning, lineage
- GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md: LOADED — retrieval scope types §6; RAG boundary §9
- GOVERNED_COGNITIVE_NORMALIZATION_ARCHITECTURE.md: LOADED — normalization rules (not re-derived by RAG)
- GOVERNED_EXECUTIVE_RENDERING_ARCHITECTURE.md: LOADED — rendering pipeline (RAG feeds evidence injection)
- SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md: LOADED — semantic authority CLOSED
- Active baseline: governed-dpsig-baseline-v1 (092e251) — CONFIRMED
```

### 2.2 RAG Position in the Full Stack

```
L1 — Structural Topology           ← IMMUTABLE — canonical_topology.json
L2 — Signal Derivation             ← IMMUTABLE — TAXONOMY-01 derivation
L3 — Semantic Interpretation       ← CLOSED (semantic activation blocked)
L4 — Agentic Orchestration         ← RAG OPERATES HERE — retrieval feeds evidence assembly
L5 — Cognitive Projection          ← Normalization (not re-derived by RAG)
L6 — Executive Interaction         ← Rendering (receives governed evidence only)
```

RAG operates as a **retrieval sub-layer within L4** (Agentic Orchestration). It supplements the artifact discovery stage of evidence injection (GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md Stage 1). RAG does not replace Stage 1 — it extends it.

**RAG authority model:**

```
PRIMARY (canonical):     JSON artifact store → DIRECT_FIELD evidence
SUPPLEMENTARY (RAG):     Vector retrieval → artifact discovery → JSON validation → DIRECT_FIELD evidence
PROHIBITED:              Vector similarity score → evidence fact (no intermediary JSON validation)
```

### 2.3 Inherited Locked Contracts

| Contract | Locked artifact |
|----------|----------------|
| Allowed reads surface | `pipeline_execution_manifest.json` `allowed_reads` — RAG may only retrieve within this surface |
| Evidence object schema | DIRECT_FIELD / DERIVED_DETERMINISTIC / COMPUTED_DISPLAY / REPLAY_ANCHOR — RAG output must conform |
| TAXONOMY-01 replay fields | Immutable after derivation — RAG cannot produce or modify these |
| Semantic authority | CLOSED — RAG semantic recall does not reopen semantic authority |
| Executive Readiness Gate | Mandatory — RAG cannot supply evidence that bypasses readiness classification |
| Client isolation | Per-client artifact scoping — RAG must enforce client boundary at retrieval time |

### 2.4 Governed RAG Inheritance from Evidence Injection

GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md §9 established these constraints that this stream inherits:

```
INHERITED RAG RULES:
R-1: Vector retrieval is SUPPLEMENTARY — JSON artifacts are primary
R-2: Every fact in the evidence object must resolve to a committed artifact (evidence_stable_key)
R-3: Vector retrieval may NOT inject raw embedding matches directly into evidence objects
R-4: Topology-aware chunking follows cluster/domain boundaries (not arbitrary token splits)
R-5: RAG retrieval is scoped to the active client's artifact boundary
R-6: Retrieval lineage must be captured in the evidence object retrieval metadata
```

This stream formalizes R-1 through R-6 into complete architecture.

---

## 3. Topology-Aware RAG Architecture

### 3.1 Architecture Overview

```
TOPOLOGY-AWARE RAG PIPELINE

STAGE 1: ARTIFACT DISCOVERY
    └─ Enumerate artifacts in allowed_reads surface (pipeline_execution_manifest.json)
    └─ Classify artifacts by chunk type taxonomy (§4.2)
    └─ Register artifact commit hashes for lineage tracking

STAGE 2: TOPOLOGY-AWARE CHUNKING
    └─ Chunk artifacts along topology boundaries (cluster, domain, signal, propagation)
    └─ Assign chunk_id (stable, topology-anchored)
    └─ Assign chunk_lineage (artifact path, commit hash, section identifier)
    └─ Version chunks when source artifact changes

STAGE 3: EMBEDDING GENERATION
    └─ Generate embeddings per chunk
    └─ Attach embedding_metadata (model_id, generation_timestamp, source_chunk_id)
    └─ Store embedding → chunk mapping in vector governance registry
    └─ Tag embeddings as DERIVATIVE of source artifact (not authoritative)

STAGE 4: VECTOR INDEXING
    └─ Index embeddings in topology-partitioned vector store
    └─ Partition by: client_id, signal_family, topology_scope
    └─ Record index_manifest with version and chunk coverage

STAGE 5: TOPOLOGY-AWARE RETRIEVAL
    └─ Accept retrieval query with topology context (cluster scope, signal family, etc.)
    └─ Route query to correct topology partition
    └─ Retrieve top-K candidate chunks with similarity scores
    └─ Apply topology relevance re-ranking (topology adjacency boosts relevance)

STAGE 6: READINESS FILTERING
    └─ Filter retrieved candidates against readiness gate
    └─ Suppress SUPPRESSED_FROM_EXECUTIVE artifacts from executive queries
    └─ Apply client-scoped access control (§6 retrieval boundaries)
    └─ Confirm evidence_stable_key for each candidate

STAGE 7: EVIDENCE LINEAGE INJECTION
    └─ For each retrieved artifact: verify against canonical JSON store
    └─ Replace embedding match with canonical DIRECT_FIELD evidence
    └─ Inject retrieval_lineage_record into evidence object metadata
    └─ Confirm evidence_stable_key traceable to committed artifact

STAGE 8: ORCHESTRATION ASSEMBLY
    └─ Assemble retrieved evidence into evidence scope for Stage 1 of Evidence Injection pipeline
    └─ Apply EVIDENCE_ADDITIVE propagation (no prose-passing, no evidence mutation)
    └─ Hand off to GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md Stage 2+

STAGE 9: REPLAY CAPTURE
    └─ Record retrieval_session_record (§5 replay schema)
    └─ Capture: query_hash, retrieved_chunk_ids, similarity_scores, canonical_resolution_map
    └─ Store retrieval lineage for audit
```

### 3.2 Canonical Authority Preservation Map

Every stage of the RAG pipeline has an explicit canonical authority rule:

| Stage | RAG role | Canonical authority |
|-------|----------|---------------------|
| Artifact Discovery | Enumerate what is available | `pipeline_execution_manifest.json` `allowed_reads` |
| Chunking | Structure for retrieval | Source artifact commit hash |
| Embedding Generation | Semantic representation | Source chunk (embedding is derivative) |
| Vector Indexing | Retrieval acceleration | Index is derivative; not authoritative |
| Retrieval | Candidate identification | Candidate is a pointer; not a fact |
| Readiness Filtering | Access control enforcement | Readiness gate (L2 authority) |
| Evidence Lineage Injection | **Authority resolution** | Canonical JSON artifact resolved here |
| Orchestration Assembly | Evidence assembly | GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md |
| Replay Capture | Audit trail | Committed artifact hashes |

**Critical boundary:** RAG candidates become evidence only after **canonical resolution** at Stage 7. Before that, they are retrieval candidates — not evidence. A vector similarity score of 0.99 does not make a chunk a fact.

### 3.3 Retrieval Execution Flow

```
Query (executive question / orchestration request)
         │
         ▼
Topology Context Extraction
(cluster scope? signal family? historical? governance?)
         │
         ▼
Partition Routing → client_id × topology_scope × signal_family
         │
         ▼
Vector Retrieval → top-K candidate chunks
         │
         ▼
Topology Relevance Re-ranking
(adjacent clusters boosted; isolated cluster demoted)
         │
         ▼
Readiness Filter → suppressed artifacts removed
         │
         ▼
Canonical Resolution → chunk → artifact_path → committed JSON
         │
    ┌────┴────────────┐
    │                 │
RESOLVED          NOT RESOLVED
    │                 │
Evidence fact     Retrieval gap
added to scope    logged; not injected
                  (fail-closed behavior)
         │
         ▼
Retrieval Lineage Record
         │
         ▼
Handoff to Evidence Injection Stage 2
```

---

## 4. Topology-Aware Chunking

### 4.1 Chunking Architecture

Chunking is the most topology-sensitive operation in the RAG pipeline. Semantic fragmentation of topology artifacts destroys the structural relationships that give the data meaning. A domain split from its cluster loses its topology context. A signal split from its derivation lineage loses its governance anchor.

**Core constraint:** Chunks must preserve the **minimum structural unit** of the topology. The minimum structural unit is defined per artifact type.

### 4.2 Chunk Taxonomy

#### CHUNK TYPE 1: Cluster Summary Chunk
**Source:** canonical_topology.json, DPSIG derivation output  
**Minimum structural unit:** One complete cluster entry (cluster_id + all member domains + all derived signals)  
**Chunk boundary rule:** Never split a cluster across chunks. Cluster membership must be complete within a single chunk.  
**Topology preservation:** cluster_id, domain_count, CPI signal, CFA signal, readiness_state — all present in chunk  
**Replay identity:** cluster_id + baseline_tag + derivation_hash  
**Semantic content:** Structural state of a specific cluster — suitable for "what is Cluster X's state?" queries

#### CHUNK TYPE 2: Domain Detail Chunk
**Source:** canonical_topology.json domain entries  
**Minimum structural unit:** One domain entry (domain_id + parent cluster + coupling weights)  
**Chunk boundary rule:** Never split a domain from its parent cluster reference. Always preserve cluster_id in domain chunk.  
**Topology preservation:** domain_id, parent_cluster_id, coupling_weight, grounding_state  
**Replay identity:** domain_id + baseline_tag + topology_source_commit  
**Semantic content:** Individual domain topology — suitable for "which cluster contains domain X?" queries

#### CHUNK TYPE 3: Signal Derivation Chunk
**Source:** DPSIG derivation output, signal manifest  
**Minimum structural unit:** One signal per cluster (signal_name + signal_value + derivation_hash + activation_state)  
**Chunk boundary rule:** Never split signal value from derivation_hash. TAXONOMY-01 replay fields must be co-resident in chunk.  
**Topology preservation:** signal_stable_key, signal_value, derivation_hash, derivation_trace  
**Replay identity:** signal_stable_key + derivation_hash  
**Semantic content:** Signal state per cluster — suitable for "what is the CPI for Cluster X?" queries

#### CHUNK TYPE 4: Propagation Trace Chunk
**Source:** canonical_topology.json adjacency + coupling weights  
**Minimum structural unit:** One propagation path (source cluster → target cluster + all intermediate edges)  
**Chunk boundary rule:** Never truncate a propagation path mid-trace. Preserve directionality.  
**Topology preservation:** source_cluster_id, target_cluster_id, edge_weights, coupling_pairs  
**Replay identity:** path_hash (hash of ordered cluster sequence)  
**Semantic content:** Structural coupling paths — suitable for "what propagates from Cluster X?" queries

#### CHUNK TYPE 5: Governance Lineage Chunk
**Source:** LANE_GOVERNANCE_LOCK.md, pipeline_execution_manifest.json, CLOSURE.md artifacts  
**Minimum structural unit:** One governance artifact section (lane lock, manifest entry, or stream closure)  
**Chunk boundary rule:** Never split a governance rule from its stream authority reference  
**Topology preservation:** stream_id, governance_rule_type, authority_source  
**Replay identity:** artifact_path + commit_hash + section_identifier  
**Semantic content:** Governance context — suitable for "why is this lane locked?" or "what governs X?" queries

#### CHUNK TYPE 6: Narrative Artifact Chunk
**Source:** Committed narrative outputs (LENS reports, executive summaries)  
**Minimum structural unit:** One narrative section (executive summary, cluster narrative, qualifier block)  
**Chunk boundary rule:** Never split a narrative section from its evidence_object_hash reference  
**Topology preservation:** evidence_object_hash, surface_mode, normalization_rule_version  
**Replay identity:** narrative_session_hash + evidence_object_hash  
**Semantic content:** Prior narrative outputs — suitable for historical comparison and session continuity

#### CHUNK TYPE 7: Replay Artifact Chunk
**Source:** rendering_lineage_record, retrieval_session_record  
**Minimum structural unit:** One complete lineage record  
**Chunk boundary rule:** Never split a lineage record. Replay anchors must be co-resident with their hash fields.  
**Topology preservation:** All replay anchor fields (evidence_object_hash, prompt_template_commit_hash, normalization_rule_version)  
**Replay identity:** rendering_session_hash  
**Semantic content:** Session history — suitable for "what did the executive see in the last session?" queries

### 4.3 Chunk Identity Model

Every chunk has a stable, deterministic identity:

```json
{
  "chunk_id": "[topology-anchored stable key]",
  "chunk_type": "[CLUSTER_SUMMARY / DOMAIN_DETAIL / SIGNAL_DERIVATION / PROPAGATION_TRACE / GOVERNANCE_LINEAGE / NARRATIVE_ARTIFACT / REPLAY_ARTIFACT]",
  "source_artifact_path": "[path to source JSON or MD artifact]",
  "source_artifact_commit_hash": "[commit hash at time of chunking]",
  "section_identifier": "[cluster_id / domain_id / signal_stable_key / path_hash / etc.]",
  "topology_scope": {
    "client_id": "[client identifier]",
    "cluster_ids": ["[list of cluster_ids present in chunk]"],
    "signal_families": ["[DPSIG / EXSIG / etc.]"]
  },
  "chunk_version": "[semantic version — increments when source artifact changes]",
  "chunk_lineage": {
    "baseline_tag": "governed-dpsig-baseline-v1",
    "baseline_commit": "092e251",
    "chunked_at": "[ISO-8601 timestamp]",
    "chunked_from_commit": "[source artifact commit hash]"
  },
  "replay_identity": "[deterministic key for this chunk across versions]"
}
```

### 4.4 Chunk Lineage Model

Chunk lineage preserves the chain from retrieval result back to canonical source:

```
CHUNK LINEAGE CHAIN:
  query → chunk_id → source_artifact_path → committed JSON → evidence_stable_key
                  ↑
          chunk_version confirms which version of the artifact was indexed
          chunk_lineage.chunked_from_commit confirms exact artifact state at index time
```

**Staleness detection:** When `source_artifact_commit_hash` in chunk_id diverges from current HEAD commit for that artifact, the chunk is STALE and must be re-indexed before use in evidence assembly.

```
STALE CHUNK BEHAVIOR:
- Retrieval still returns STALE chunks (for discovery)
- STALE chunks are flagged in retrieval results
- STALE chunks may NOT be used in evidence assembly without re-indexing
- Fail-closed: evidence assembly rejects STALE chunks; falls back to direct artifact read
```

### 4.5 Prohibited Chunking Behaviors

```
PROHIBITED:
  ✗ Token-boundary chunking (splitting at N tokens regardless of topology)
  ✗ Cluster fragmentation (domains in separate chunks from their parent cluster)
  ✗ Signal-derivation split (signal_value in different chunk from derivation_hash)
  ✗ Lineage truncation (replay anchor fields absent from chunk)
  ✗ Cross-client chunks (artifacts from different clients co-resident in one chunk)
  ✗ Cross-version chunks (artifacts from different baseline versions mixed in one chunk)
```

---

## 5. Vector Governance Model

### 5.1 Vector Governance Architecture

Embeddings are **derivative artifacts**. They encode semantic proximity for retrieval acceleration. They are not authoritative representations of structural facts. The vector governance model enforces this constraint at every level.

**Governance principle:** An embedding is a pointer to a chunk. A chunk is a pointer to a canonical artifact. The canonical artifact is the truth.

### 5.2 Embedding Lineage Schema

Every embedding record must carry full lineage:

```json
{
  "embedding_id": "[UUID]",
  "source_chunk_id": "[chunk_id from §4.3]",
  "source_chunk_version": "[version at embedding generation time]",
  "source_artifact_commit_hash": "[commit hash of source artifact]",
  "embedding_model_id": "[model identifier + version]",
  "embedding_generation_timestamp": "[ISO-8601]",
  "embedding_governance_metadata": {
    "artifact_type": "[CLUSTER_SUMMARY / DOMAIN_DETAIL / etc.]",
    "topology_scope": {
      "client_id": "[client_id]",
      "cluster_ids": ["[list]"],
      "signal_families": ["[list]"]
    },
    "authority_class": "DERIVATIVE",
    "canonical_resolution_required": true,
    "baseline_tag": "governed-dpsig-baseline-v1"
  },
  "embedding_status": "[CURRENT / STALE / DEPRECATED]",
  "embedding_vector": "[vector representation — not shown in lineage record]"
}
```

### 5.3 Embedding Versioning

Embeddings are versioned at three levels:

**Level 1: Model version** — when the embedding model changes, all embeddings are deprecated and must be regenerated. Retrieval using old-model embeddings against new-model vectors is prohibited.

**Level 2: Source artifact version** — when the source chunk's `source_artifact_commit_hash` changes, the embedding is STALE. STALE embeddings may be retrieved but not used in evidence assembly.

**Level 3: Baseline version** — when the governance baseline changes (new `baseline_tag`), all embeddings from the prior baseline are tagged DEPRECATED. Deprecated embeddings may be retained for historical retrieval only.

```
EMBEDDING VERSION GOVERNANCE:
  CURRENT:    source_artifact_commit_hash matches HEAD; model_id matches active model
  STALE:      source_artifact_commit_hash does NOT match HEAD; model_id matches
  DEPRECATED: baseline_tag does not match active baseline
  INVALID:    model_id mismatch; must not be used for retrieval
```

### 5.4 Retrieval Governance Model

Vector retrieval operates under these governance rules:

```
RETRIEVAL GOVERNANCE RULES:
VG-01: Retrieval results are candidates, not facts
VG-02: Every candidate must resolve to a canonical artifact before use in evidence
VG-03: Retrieval scope is bounded to client_id (no cross-client retrieval)
VG-04: Retrieval scope is bounded to active baseline (deprecated embeddings excluded by default)
VG-05: Retrieval may not bypass readiness gates
VG-06: Similarity scores are ranking signals only; not confidence evidence
VG-07: Retrieval lineage must be captured for every retrieval call
VG-08: STALE candidates must be flagged before evidence assembly considers them
VG-09: Retrieval fallback is direct artifact read (not "no evidence available")
VG-10: Embedding models are versioned; cross-model retrieval is prohibited
```

### 5.5 Retrieval Traceability

Every retrieval invocation produces a `retrieval_call_record`:

```json
{
  "retrieval_call_id": "[UUID]",
  "query_hash": "[SHA-256 of query text + topology context]",
  "retrieval_timestamp": "[ISO-8601]",
  "client_id": "[client boundary]",
  "topology_scope": {
    "cluster_ids": ["[scope]"],
    "signal_families": ["[scope]"]
  },
  "embedding_model_id": "[model identifier]",
  "index_version": "[index manifest version]",
  "top_k_requested": "[N]",
  "candidates_returned": [
    {
      "chunk_id": "[chunk_id]",
      "chunk_version": "[version]",
      "similarity_score": "[float]",
      "embedding_status": "[CURRENT / STALE / DEPRECATED]",
      "canonical_resolution_status": "[RESOLVED / UNRESOLVED / STALE_FLAGGED]",
      "canonical_artifact_path": "[path if resolved]",
      "evidence_stable_key": "[key if resolved]"
    }
  ],
  "baseline_tag": "governed-dpsig-baseline-v1",
  "governance_filter_applied": "[readiness filter + client boundary]"
}
```

### 5.6 Replay-Safe Embeddings

Embeddings are not bit-identical replay artifacts (the embedding model may produce slightly different vectors across runs). However, **retrieval outcomes are presentation-deterministic** when the source artifacts are unchanged:

```
EMBEDDING REPLAY GUARANTEE:
  Given: same source artifact commit state + same embedding model version + same index version
  Result: functionally equivalent retrieval ranking
  Guarantee class: PRESENTATION_DETERMINISTIC (not bit-identical)
  
  This is analogous to Type 2 (Presentation Deterministic) replay in the narrative pipeline.
  Same inputs → same retrieval ranking → same evidence candidates → same evidence assembly.
```

---

## 6. Retrieval Boundaries

### 6.1 Retrieval Containment Architecture

Retrieval boundaries enforce governance isolation at every dimension. No retrieval operation may cross these boundaries without explicit governance authorization.

### 6.2 Retrieval Policy Matrix

| Boundary dimension | Enforcement rule | Fail-closed behavior |
|-------------------|-----------------|---------------------|
| Client isolation | Retrieval is scoped to `client_id` partition; cross-client queries blocked | Return empty result; log violation |
| Allowed reads surface | Only artifacts in `pipeline_execution_manifest.json` `allowed_reads` are indexed | Non-manifest artifacts not indexed |
| Readiness gate | SUPPRESSED_FROM_EXECUTIVE artifacts removed from executive queries | Suppression notice returned |
| Signal family scope | Queries scoped to signal family (DPSIG, future EXSIG, etc.) | Out-of-family candidates demoted |
| Semantic exposure | DIAGNOSTIC_ONLY retrieval returns DIRECT_FIELD evidence only; no narrative retrieval | Narrative chunks excluded from DIAGNOSTIC_ONLY queries |
| Baseline boundary | Active baseline only; deprecated artifacts excluded by default | Deprecated candidates flagged; require explicit historical scope |
| Inference prohibition | INFERENCE_PROHIBITED clients: retrieval returns structural artifacts only; embedding search blocked | Structural-only direct read |

### 6.3 Allowed Reads Manifest Integration

The `pipeline_execution_manifest.json` `allowed_reads` surface is the authoritative index scope:

```
INDEXABLE ARTIFACT TIERS (from pipeline_execution_manifest.json):
  Tier 1 — Runtime Inputs (INDEXED — highest priority):
    canonical_topology.json → CLUSTER_SUMMARY + DOMAIN_DETAIL + PROPAGATION_TRACE chunks
    binding_envelope.json → GOVERNANCE_LINEAGE chunks
    structural_topology_log.json → SIGNAL_DERIVATION chunks
    grounding_state_v3.json → GOVERNANCE_LINEAGE chunks

  Tier 2 — Governance Inputs (INDEXED — medium priority):
    DPSIG_RUNTIME_NORMALIZATION.md → GOVERNANCE_LINEAGE chunks
    LANE_GOVERNANCE_LOCK.md → GOVERNANCE_LINEAGE chunks
    pipeline_execution_manifest.json → GOVERNANCE_LINEAGE chunks

  Tier 3 — Signal Derivation Outputs (INDEXED — evidence priority):
    dpsig_signals.json → SIGNAL_DERIVATION chunks
    projection_aliasing_taxonomy.json → GOVERNANCE_LINEAGE chunks
    executive_readiness_state.json → CLUSTER_SUMMARY chunks (readiness state)
    e2e_validation.json → GOVERNANCE_LINEAGE chunks

  NOT INDEXED (outside allowed_reads):
    Raw runtime logs (ephemeral)
    Uncommitted working state
    External data sources
    Cross-client artifacts
```

### 6.4 Governance Enforcement Model

Retrieval enforcement operates at four gates:

```
GATE 1 — INDEX GATE (at index build time):
  Enforce: only allowed_reads artifacts are indexed
  Enforce: client_id partition is mandatory for all chunks
  Enforce: STALE chunks from prior baseline are tagged at build time

GATE 2 — QUERY GATE (at query time):
  Enforce: client_id scoping (query partition must match requesting client)
  Enforce: inference_prohibition flag (block embedding search for prohibited clients)
  Enforce: baseline scope (active vs historical query intent)

GATE 3 — RETRIEVAL FILTER GATE (post-retrieval, pre-canonicalization):
  Enforce: readiness filter (SUPPRESSED artifacts removed)
  Enforce: STALE flagging (STALE candidates flagged before canonicalization)
  Enforce: deprecated embedding removal (DEPRECATED embeddings excluded)

GATE 4 — CANONICALIZATION GATE (pre-evidence-assembly):
  Enforce: every candidate resolves to committed artifact
  Enforce: evidence_stable_key must be assigned (no anonymous evidence)
  Enforce: chunk lineage hash must match canonical artifact state
```

### 6.5 Prohibited Retrieval Patterns

```
STRICTLY PROHIBITED:
  ✗ Cross-client retrieval (client A accessing client B topology artifacts)
  ✗ Readiness bypass (SUPPRESSED_FROM_EXECUTIVE artifacts served to executive queries)
  ✗ Semantic escalation (retrieval result used as fact without canonical resolution)
  ✗ Unconstrained retrieval (queries without client_id, signal_family, or topology scope)
  ✗ Direct embedding injection (embedding vector used as evidence field value)
  ✗ Historical retrieval presented as current state without versioning context
  ✗ Deprecated artifact retrieval without explicit historical scope flag
  ✗ STALE chunk use in evidence assembly without re-indexing
```

---

## 7. Replay-Safe Retrieval

### 7.1 Retrieval Replay Architecture

Retrieval replay is distinct from structural replay (TAXONOMY-01) and presentation replay (normalization rules). It operates at the retrieval and evidence assembly boundary.

### 7.2 Retrieval Determinism Classes

```
CLASS 1: STRUCTURAL DETERMINISTIC (TAXONOMY-01)
  Scope: L1–L2 derivation artifacts
  Guarantee: bit-identical (same topology → same signal values)
  RAG relevance: RAG retrieves these artifacts; it does not reproduce them

CLASS 2: PRESENTATION DETERMINISTIC (Normalization)
  Scope: L5 normalization output
  Guarantee: same normalization rules + same evidence → identical output
  RAG relevance: RAG may retrieve prior normalized outputs for historical comparison

CLASS 3: NARRATIVE EVIDENCE-BOUND (LLM synthesis)
  Scope: L4 narrative output
  Guarantee: same evidence → evidence-equivalent prose (not bit-identical)
  RAG relevance: RAG may retrieve prior narratives; they are not evidence authorities

CLASS 4: RETRIEVAL PRESENTATION DETERMINISTIC (NEW — this stream)
  Scope: RAG retrieval rankings
  Guarantee: same source artifact state + same embedding model → functionally equivalent ranking
  Identity: query_hash + index_version + embedding_model_id + client_id + baseline_tag
  Not bit-identical (embedding similarity is floating-point); functionally equivalent ranking
```

### 7.3 Retrieval Equivalence Model

Two retrieval operations are **replay-equivalent** if:

```
RETRIEVAL REPLAY EQUIVALENCE:
  retrieval_A ≡ retrieval_B if:
    A.query_hash == B.query_hash
    AND A.index_version == B.index_version
    AND A.embedding_model_id == B.embedding_model_id
    AND A.client_id == B.client_id
    AND A.baseline_tag == B.baseline_tag
    AND all A.candidates[i].canonical_resolution_status == RESOLVED
    AND all B.candidates[i].canonical_resolution_status == RESOLVED
    AND A.candidates resolved artifacts match B.candidates resolved artifacts
```

**Note:** Floating-point similarity scores may vary within tolerance; resolved canonical artifacts must match exactly.

### 7.4 Retrieval Lineage Schema

Every retrieval operation produces a `retrieval_session_record` for audit:

```json
{
  "retrieval_session_id": "[UUID]",
  "retrieval_session_hash": "[SHA-256 of retrieval_call_records in session]",
  "session_timestamp": "[ISO-8601]",
  "client_id": "[client boundary]",
  "baseline_tag": "governed-dpsig-baseline-v1",
  "baseline_commit": "092e251",
  "embedding_model_id": "[model identifier + version]",
  "index_manifest_version": "[version]",
  "retrieval_calls": ["[list of retrieval_call_ids]"],
  "canonical_resolution_map": {
    "[chunk_id]": {
      "resolved_to": "[artifact_path]",
      "evidence_stable_key": "[key]",
      "resolution_status": "[RESOLVED / UNRESOLVED]"
    }
  },
  "evidence_objects_assembled": ["[evidence_object_hash list]"],
  "replay_anchor": {
    "query_hash_set": ["[hashes of all queries in session]"],
    "index_version": "[version]",
    "embedding_model_id": "[model identifier]"
  }
}
```

### 7.5 Retrieval Replay Diffing

When comparing two retrieval sessions (for audit or debugging), the diff operates on canonical resolutions, not similarity scores:

```
RETRIEVAL REPLAY DIFF:
  Compare: canonical_resolution_map[chunk_id].evidence_stable_key
  SAME: retrieval sessions are equivalent (evidence was identical)
  DIFFERENT: retrieve diff record showing which evidence_stable_keys changed
  
  Diff is NOT performed on similarity scores (not deterministic)
  Diff IS performed on canonically resolved evidence artifacts (deterministic)
```

---

## 8. Orchestration Memory Governance

### 8.1 Orchestration Memory Architecture

Orchestration memory enables continuity across multi-step executive interactions, topology investigations, and governed reasoning chains. It is bounded memory — not persistent semantic accumulation.

**Core constraint:** Memory stores retrieval lineage and session context. It does NOT store inferred conclusions or semantic authority. An agent that "remembers" a prior reasoning step does not gain authority from that memory — it can only reference the evidence behind that step.

### 8.2 Memory Domains

#### DOMAIN 1: Executive Session Memory
**Scope:** Active executive session (GOVERNED_EXECUTIVE_RENDERING_ARCHITECTURE.md §9)  
**Content:** Session state, surface mode, evidence object hash, prior question-answer lineage  
**Retention:** Session lifetime only; cleared on session close + replay capture  
**Authority:** Session context only; no new evidence authority from prior answers  
**Prohibited:** Storing executive conclusions as facts for subsequent retrieval

#### DOMAIN 2: Topology Investigation Memory
**Scope:** Active topology investigation (multi-step cluster/domain exploration)  
**Content:** Investigation scope (which clusters/domains), retrieval lineage, evidence keys visited  
**Retention:** Investigation lifetime; persisted as investigation_lineage_record  
**Authority:** Retrieval scope only; EVIDENCE_ADDITIVE propagation  
**Prohibited:** Topology assertions not supported by canonical artifacts

#### DOMAIN 3: Remediation Exploration Memory
**Scope:** Structural pattern exploration for remediation framing  
**Content:** Structural observations visited, grounding lineage of each observation  
**Retention:** Exploration session lifetime  
**Authority:** Structural observation only; no prescriptive authority  
**Prohibited:** Prescriptive remediation accumulation beyond structural pattern observation

#### DOMAIN 4: Governance Trace Memory
**Scope:** Governance verification chain (readiness state, qualifier resolution, lane authority)  
**Content:** Governance check sequence, resolved states, blocking conditions  
**Retention:** Stream lifetime; committed to governance_trace_record  
**Authority:** Governance artifact authority (committed governance docs)  
**Prohibited:** Governance state mutation through memory accumulation

#### DOMAIN 5: Narrative Continuity Memory
**Scope:** Multi-section narrative assembly (§6 Topology-Aware Executive Narratives)  
**Content:** Narrative sections generated, evidence keys cited per section, qualifier states per section  
**Retention:** Narrative session lifetime  
**Authority:** Evidence object authority (all sections bounded to same evidence object hash)  
**Prohibited:** Cross-session narrative accumulation without evidence object refresh

#### DOMAIN 6: Replay-Safe Conversation Memory
**Scope:** Conversational LENS session continuity (future Phase 4/5)  
**Content:** Conversation turn lineage, evidence references per turn, retrieval calls per turn  
**Retention:** Conversation session lifetime; full lineage committed on close  
**Authority:** Evidence authority per turn (each turn bounded to its retrieval scope)  
**Prohibited:** Cross-conversation memory without explicit session continuation with lineage verification

### 8.3 Memory Governance Model

```
MEMORY GOVERNANCE RULES:
MG-01: Memory stores LINEAGE, not conclusions (evidence keys, not inferred facts)
MG-02: Memory window is bounded by session/investigation lifetime (no unbounded accumulation)
MG-03: Memory content is evidence-anchored (every memory entry has an evidence_stable_key or retrieval_call_id)
MG-04: Memory does not accumulate semantic authority (a remembered retrieval does not elevate to canonical fact)
MG-05: Memory is EVIDENCE_ADDITIVE only (no evidence mutation through memory)
MG-06: Memory replay requires same evidence objects (changed evidence invalidates prior memory assertions)
MG-07: Memory is committed at session close as a lineage record (not retained as hot state indefinitely)
MG-08: Cross-domain memory is prohibited (Executive Session Memory cannot reference Governance Trace Memory's conclusions)
```

### 8.4 Memory Invalidation

Memory is invalidated when:

```
INVALIDATION CONDITIONS:
  - Source evidence artifact changes (new derivation run → new evidence_stable_key)
  - Readiness state changes (memory from prior readiness state is not valid in new state)
  - Session closes (session memory is committed as lineage, then cleared)
  - Baseline version changes (memory from prior baseline is DEPRECATED)
  - Client scope changes (session cannot span client boundaries)
```

### 8.5 Persistence Containment Rules

```
PERMITTED persistence:
  ✓ Session lineage records (committed artifacts — replay-safe)
  ✓ Retrieval session records (committed artifacts — audit trail)
  ✓ Investigation lineage records (committed artifacts)
  ✓ Governance trace records (committed artifacts)

PROHIBITED persistence:
  ✗ Hot semantic memory (accumulated inferred facts not anchored to committed artifacts)
  ✗ Cross-session context without explicit continuation protocol (evidence re-validation required)
  ✗ Memory-owned facts (conclusions persisted as facts without evidence_stable_key)
  ✗ Unbounded conversation history (grows without evidence re-anchoring)
```

---

## 9. Topology-Aware Interrogation

### 9.1 Interrogation Architecture

Topology-aware interrogation extends the Executive Questioning Model (GOVERNED_EXECUTIVE_RENDERING_ARCHITECTURE.md §7) with RAG-powered evidence discovery. The governance model is identical; RAG adds the ability to find relevant evidence across the artifact store rather than requiring explicit evidence object pre-assembly.

**Core constraint:** RAG interrogation is evidence-discovery, not reasoning. The interrogation reasoning is still bounded by the evidence objects retrieved — not by the RAG similarity ranking.

### 9.2 Evidence-Bound Questioning Architecture

```
INTERROGATION PIPELINE:
  Question (executive / analyst)
         │
         ▼
  Question Classification (TYPE 1–7 per EXEC-RENDER §7.2)
         │
         ▼
  Topology Context Extraction
  (question → cluster scope + signal family + temporal scope)
         │
         ▼
  RAG Retrieval (§3 pipeline)
  (topology-aware retrieval → candidate artifacts)
         │
         ▼
  Canonical Resolution (STAGE 7 of RAG pipeline)
  (candidates → committed evidence artifacts)
         │
         ▼
  Evidence Object Assembly (GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE)
  (evidence artifacts → sealed evidence object)
         │
         ▼
  Governed Answer Generation (bounded by evidence object)
  (question TYPE → governed answer pattern)
         │
         ▼
  Answer with Evidence Explainability Panel
  (answer + evidence_stable_keys + retrieval_call_id)
```

### 9.3 Topology-Aware Reasoning Model

RAG enables **topology graph traversal** for answering complex structural questions:

**Reasoning pattern — Propagation question:**
"Why did this escalate?"
1. Retrieve: signal derivation chunks for focal cluster (CPI, CFA signal values)
2. Retrieve: propagation trace chunks showing coupling paths
3. Retrieve: upstream cluster signal chunks
4. Resolve: all chunks to canonical artifacts
5. Assemble: evidence object with propagation path evidence
6. Answer: bounded structural explanation — "Pressure in Cluster A propagates through [N] coupling paths to Cluster B [evidence: coupling_weights from canonical_topology.json]"

**Reasoning pattern — Historical comparison:**
"Has this pattern appeared before?"
1. Retrieve: replay artifact chunks for prior sessions with same cluster scope
2. Retrieve: signal derivation chunks from prior baseline (DEPRECATED tag — explicit historical scope)
3. Resolve: prior chunks to committed historical artifacts
4. Assemble: evidence object with current + historical signal values
5. Answer: "Prior measurement [date] recorded CPI = [historical_value] vs current CPI = [current_value] [evidence: prior_session_hash, current_derivation_hash]"

**Reasoning pattern — Topology coupling:**
"Which domains are coupled?"
1. Retrieve: domain detail chunks for cluster scope
2. Retrieve: propagation trace chunks showing domain coupling weights
3. Resolve: all chunks to canonical_topology.json
4. Assemble: evidence object with domain membership and coupling data
5. Answer: "Cluster X contains [N] domains. [Domain A, Domain B] exhibit above-threshold bidirectional coupling [evidence: coupling_weight from canonical_topology.json]"

### 9.4 Retrieval-Bounded Reasoning

All reasoning in topology-aware interrogation is bounded by what retrieval returns. Reasoning gaps are explicit:

```
RETRIEVAL GAP HANDLING:
  If canonical resolution fails for a candidate:
    → Do not answer the sub-question relying on that fact
    → Render: "Evidence for [specific fact] is not available in the indexed artifact store. 
               Direct artifact review may be required."
  
  If no candidates retrieved:
    → Render: "No topology artifacts matching this query scope were found. 
               The question may be outside the indexed evidence boundary."
  
  If all candidates are STALE:
    → Render: "Retrieved evidence is from an earlier artifact state. 
               Re-indexing is required for current-state answers."
```

### 9.5 Prohibited Interrogation Behaviors

```
PROHIBITED:
  ✗ Speculative topology reasoning ("This pattern probably means...")
  ✗ Evidence-free conclusions ("Based on general knowledge...")
  ✗ Semantic-only diagnosis (similarity score as evidence)
  ✗ Cross-client evidence mixing
  ✗ Reasoning beyond the sealed evidence object
  ✗ Suggesting architectural solutions not derivable from structural patterns
```

---

## 10. Multi-Agent Governance

### 10.1 Multi-Agent Architecture

Future multi-agent systems on this platform decompose complex topology investigations into parallel or sequential agent tasks. Governance ensures that agent decomposition does not create ungoverned reasoning paths.

**Core constraint:** Agent decomposition distributes retrieval and evidence assembly. It does not distribute authority. No agent becomes an authority by virtue of its role.

### 10.2 Agent Authority Separation Model

| Agent type | Authority | Prohibited authority |
|-----------|-----------|---------------------|
| Orchestration Agent | Coordinates retrieval scope and evidence assembly; no inference authority | Producing evidence facts; claiming topology truth |
| Retrieval Agent | Retrieves and canonically resolves artifact candidates; no reasoning authority | Drawing conclusions from retrieval results |
| Narrative Agent | Generates evidence-bound narrative given a sealed evidence object; no retrieval authority | Retrieving new evidence mid-generation; modifying evidence object |
| Diagnostic Agent | Analyzes structural patterns from committed signal values; no prescriptive authority | Issuing remediation prescriptions; claiming business causality |
| Remediation Agent | Frames structural patterns as structural observations; no architectural authority | Specifying architectural solutions; assigning organizational responsibility |

### 10.3 Authority Separation Rules

```
AUTHORITY SEPARATION RULES:
AS-01: No agent may produce a DIRECT_FIELD evidence value — only canonical artifacts produce these
AS-02: No agent may modify the evidence object once sealed — only the evidence injection pipeline seals evidence objects
AS-03: Retrieval agents pass candidates to orchestration; they do not assert that candidates are facts
AS-04: Narrative agents receive sealed evidence objects; they do not retrieve additional evidence mid-generation
AS-05: All inter-agent communication is EVIDENCE_ADDITIVE — evidence keys and lineage records, not prose
AS-06: No agent retains authority from a prior task beyond that task's session lineage
AS-07: Multi-agent orchestration lineage must be committed before any agent output is used in executive rendering
```

### 10.4 Retrieval Scopes for Agent Types

```
ORCHESTRATION AGENT:
  Retrieval scope: Full allowed_reads surface within client_id
  Authority: Scope definition only; not evidence production

RETRIEVAL AGENT:
  Retrieval scope: Assigned by orchestration agent per investigation scope
  Authority: Canonical resolution; evidence_stable_key assignment

NARRATIVE AGENT:
  Retrieval scope: NONE (receives pre-assembled evidence object only)
  Authority: Evidence-bound narrative synthesis within prompt template

DIAGNOSTIC AGENT:
  Retrieval scope: Signal derivation + topology chunks only
  Authority: Structural pattern observation from committed signal values

REMEDIATION AGENT:
  Retrieval scope: Historical patterns + structural similarity chunks
  Authority: Structural pattern framing; no prescriptive authority
```

### 10.5 Orchestration Lineage Rules

```
ORCHESTRATION LINEAGE:
OL-01: Every multi-agent task must produce an orchestration_lineage_record
OL-02: The orchestration_lineage_record must reference all agent_task_ids in the chain
OL-03: Evidence objects produced by multi-agent chains must include all contributing retrieval_call_ids
OL-04: Final evidence object hash must be verifiable against all contributing artifact hashes
OL-05: Orchestration chains are EVIDENCE_ADDITIVE — each step adds evidence scope, never removes it
OL-06: Orchestration lineage is committed before executive surface delivery
```

### 10.6 Replay-Safe Coordination

Multi-agent coordination replay requires:

```
COORDINATION REPLAY IDENTITY:
  orchestration_session_hash = hash(all agent_task_ids + all evidence_stable_keys + baseline_tag)
  
  Given: same orchestration_session_hash + same baseline_tag
  Result: functionally equivalent agent coordination (same evidence assembled)
  
  REPLAY CLASS: PRESENTATION_DETERMINISTIC (same as Type 2/4)
  — Agent task order may vary; evidence assembled must be equivalent
```

---

## 11. Implementation Architecture

### 11.1 Component Overview

```
TOPOLOGY-AWARE RAG SUBSYSTEM
  ├─ Chunking Engine (deterministic)
  ├─ Embedding Pipeline (probabilistic — model-deterministic)
  ├─ Vector Governance Registry (governance-bound)
  ├─ Retrieval Orchestrator (governance-bound)
  ├─ Replay Capture Hooks (audit / replay-critical)
  ├─ Retrieval Audit Engine (deterministic)
  ├─ Orchestration Memory Engine (governance-bound)
  └─ Governance Enforcement Adapters (deterministic)
```

### 11.2 Component Specifications

#### COMPONENT 1: Chunking Engine
**Type:** DETERMINISTIC  
**Inputs:** Canonical artifacts from allowed_reads surface  
**Outputs:** Chunk records per §4.3 chunk identity model  
**Governance constraints:** Chunk taxonomy §4.2; prohibited chunking behaviors §4.5  
**Determinism guarantee:** Same artifact commit state → identical chunk set

#### COMPONENT 2: Embedding Pipeline
**Type:** PROBABILISTIC (model-deterministic within tolerance)  
**Inputs:** Chunk records from Chunking Engine  
**Outputs:** Embedding records per §5.2 embedding lineage schema  
**Governance constraints:** Embedding versioning §5.3; authority_class = DERIVATIVE mandatory  
**Determinism note:** Same model version + same chunk content → functionally equivalent embedding

#### COMPONENT 3: Vector Governance Registry
**Type:** GOVERNANCE_BOUND  
**Inputs:** Embedding records + chunk records  
**Outputs:** Indexed vector store partitioned by client_id × signal_family × baseline_tag  
**Governance constraints:** Retrieval policy matrix §6.2; partition enforcement mandatory  
**Fail-closed:** Cross-partition retrieval returns empty; violation logged

#### COMPONENT 4: Retrieval Orchestrator
**Type:** GOVERNANCE_BOUND  
**Inputs:** Retrieval query + topology context + client_id + baseline scope  
**Outputs:** retrieval_call_record with canonically resolved candidates  
**Governance constraints:** Four retrieval gates §6.4; prohibited retrieval patterns §6.5  
**Fail-closed:** Unresolvable candidates excluded; retrieval gap logged

#### COMPONENT 5: Replay Capture Hooks
**Type:** AUDIT / REPLAY-CRITICAL  
**Inputs:** All retrieval pipeline stage outputs  
**Outputs:** retrieval_session_record per §7.4 lineage schema  
**Governance constraints:** Mandatory at all retrieval sessions; cannot be disabled  
**Storage:** Committed to audit log on session close

#### COMPONENT 6: Retrieval Audit Engine
**Type:** DETERMINISTIC  
**Inputs:** retrieval_session_records  
**Outputs:** Retrieval diff records, replay equivalence verification, staleness reports  
**Governance constraints:** Diff operates on canonical resolutions (not similarity scores) per §7.5  
**Use case:** Audit trail review, replay verification, staleness detection

#### COMPONENT 7: Orchestration Memory Engine
**Type:** GOVERNANCE_BOUND  
**Inputs:** Session state, retrieval lineage, evidence object references  
**Outputs:** Bounded memory windows per §8.2 memory domains  
**Governance constraints:** Memory governance rules MG-01..08; invalidation conditions §8.4  
**Fail-closed:** Memory overflow → session commit + fresh session; no unbounded accumulation

#### COMPONENT 8: Governance Enforcement Adapters
**Type:** DETERMINISTIC  
**Inputs:** Retrieval requests, index queries, memory operations  
**Outputs:** Governance-validated operations; violation records  
**Governance constraints:** All four gates §6.4 implemented as adapters  
**Integration:** Adapters wrap Retrieval Orchestrator and Vector Governance Registry; not bypass-able

### 11.3 Component Classification Table

| Component | Deterministic | Probabilistic | Governance-bound | Replay-critical |
|-----------|:---:|:---:|:---:|:---:|
| Chunking Engine | ✓ | | | ✓ |
| Embedding Pipeline | | ✓ | | ✓ |
| Vector Governance Registry | | | ✓ | |
| Retrieval Orchestrator | | | ✓ | ✓ |
| Replay Capture Hooks | ✓ | | | ✓ |
| Retrieval Audit Engine | ✓ | | | |
| Orchestration Memory Engine | | | ✓ | |
| Governance Enforcement Adapters | ✓ | | ✓ | |

### 11.4 Governance Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPOLOGY-AWARE RAG SUBSYSTEM                                         │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  GOVERNANCE ENFORCEMENT ADAPTERS                              │   │
│  │  (pipeline_execution_manifest.json + readiness gate)          │   │
│  └────────────────────────┬─────────────────────────────────────┘   │
│                           │                                           │
│         ┌─────────────────┴─────────────────┐                       │
│         ▼                                   ▼                         │
│  ┌─────────────┐                  ┌──────────────────┐              │
│  │  Chunking   │                  │  Retrieval       │              │
│  │  Engine     │                  │  Orchestrator    │              │
│  └──────┬──────┘                  └────────┬─────────┘              │
│         │                                  │                          │
│         ▼                                  ▼                          │
│  ┌─────────────┐                  ┌──────────────────┐              │
│  │  Embedding  │                  │  Vector          │              │
│  │  Pipeline   │──────────────────►  Governance      │              │
│  └─────────────┘                  │  Registry        │              │
│                                   └────────┬─────────┘              │
│                                            │                          │
│                                            ▼                          │
│                                   ┌──────────────────┐              │
│                                   │  Replay Capture  │              │
│                                   │  Hooks           │              │
│                                   └────────┬─────────┘              │
│                                            │                          │
│         ┌──────────────────────────────────┤                         │
│         ▼                                  ▼                          │
│  ┌─────────────┐                  ┌──────────────────┐              │
│  │ Orch Memory │                  │  Retrieval Audit │              │
│  │  Engine     │                  │  Engine          │              │
│  └─────────────┘                  └──────────────────┘              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HANDOFF TO GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE          │   │
│  │  (canonically resolved evidence → evidence object assembly)   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.5 Component Ownership Map

| Component | Layer | Governance authority |
|-----------|-------|---------------------|
| Chunking Engine | L4 — Evidence preparation | This stream + pipeline_execution_manifest.json |
| Embedding Pipeline | L4 — Semantic representation | This stream (derivative; not authoritative) |
| Vector Governance Registry | L4 — Retrieval acceleration | This stream + client isolation boundary |
| Retrieval Orchestrator | L4 — Evidence discovery | This stream + Evidence Injection Architecture |
| Replay Capture Hooks | Cross-layer — Audit | This stream + TAXONOMY-01 lineage |
| Retrieval Audit Engine | Cross-layer — Governance | This stream |
| Orchestration Memory Engine | L4 — Session continuity | This stream |
| Governance Enforcement Adapters | Cross-layer — Enforcement | pipeline_execution_manifest.json (primary) |

---

## 12. Governance Verdict

### 12.1 Final Evaluation

| Criterion | Assessment | Result |
|-----------|------------|--------|
| Enterprise viability | 9-stage retrieval pipeline; topology-partitioned indexing; client isolation; full audit trail | PASS |
| Replay safety | Type 4 retrieval presentation-deterministic; retrieval_session_record schema; equivalence model defined | PASS |
| Governance integrity | Canonical authority preserved at every stage; four enforcement gates; fail-closed at all boundaries | PASS |
| Topology fidelity | 7 chunk types respect minimum structural units; cross-cluster fragmentation prohibited; propagation path integrity enforced | PASS |
| Retrieval containment | 7-dimension policy matrix; allowed_reads manifest integration; readiness gate enforcement; client isolation | PASS |
| Orchestration safety | EVIDENCE_ADDITIVE propagation; 6 bounded memory domains; MG-01..08 rules; prohibited persistence patterns | PASS |
| Executive AI readiness | Topology-aware interrogation; 7-question-type taxonomy; retrieval gap handling; evidence-bound reasoning | PASS |
| Long-term scalability | Signal-family partitioned indexing; multi-baseline support; stale chunk detection; multi-agent governance | PASS |
| JSON canonical authority preserved | Canonical resolution gate mandatory before evidence assembly; embedding authority explicitly DERIVATIVE | PASS |
| Semantic authority not reopened | SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md honored; RAG semantic recall does not reopen semantic authority | PASS |

**Score: 10/10 PASS**

### 12.2 Critical Conclusion

> **Retrieval systems retrieve governed evidence. They do NOT become semantic authorities.**

The governed RAG architecture adds retrieval intelligence to the platform without compromising the evidence-first discipline that governs it:

**What RAG adds:**
- Accelerated discovery of relevant topology artifacts across the full artifact store
- Topology-aware retrieval that respects structural boundaries
- Historical pattern retrieval for comparative analysis
- Orchestration memory for multi-step topology investigations
- Multi-agent coordination with full lineage

**What RAG does NOT add:**
- New evidence facts (all facts resolve to canonical committed artifacts)
- New semantic authority (SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md unchanged)
- New readiness classifications (all states derive from the executive readiness gate)
- New topology entities (topology fidelity enforced at all stages)
- Unreproducible state (retrieval session records provide full audit trail)

The chain is maintained: **L1 topology → L2 derivation → L4 evidence (RAG-assisted discovery) → L4 evidence injection → L5 normalization → L6 rendering.**

**Verdict: GOVERNED_TOPOLOGY_AWARE_RAG_VIABLE**

### 12.3 Path Forward

**GOVERNED_TOPOLOGY_AWARE_RAG_VIABLE — PI.AGENTIC.TOPOLOGY-AWARE-RAG.* authorized.**

Immediate handoff: **PI.AGENTIC.REPLAY-SAFE-MEMORY.FOUNDATION.01**

The replay-safe memory stream defines the persistent memory substrate for long-lived executive intelligence: how conversational sessions, topology investigations, and governance traces are durably preserved in replay-safe form. It builds on the orchestration memory governance defined in this stream (§8) and the session lineage schema defined in the executive rendering architecture (§9), formalizing the complete persistent memory model for the governed executive intelligence platform.

---

## 13. Validation

### 13.1 Validation Results

| Check | Criterion | Result |
|-------|-----------|--------|
| V-01 | JSON canonical authority preserved — canonical resolution gate mandatory | PASS |
| V-02 | Vector governance explicit — embedding lineage schema; DERIVATIVE authority class | PASS |
| V-03 | Retrieval lineage explicit — retrieval_session_record schema; retrieval_call_record schema | PASS |
| V-04 | Replay-safe retrieval explicit — Type 4 classification; equivalence model; replay identity fields | PASS |
| V-05 | Orchestration memory bounded — 6 domains; MG-01..08; invalidation conditions; persistence containment | PASS |
| V-06 | Topology-aware retrieval bounded — 7 chunk types; topology boundary rules; prohibited fragmentation | PASS |
| V-07 | Governance inheritance explicit — baseline load confirmed; locked contracts listed; allowed_reads integration | PASS |
| V-08 | Multi-agent governance explicit — authority separation model; AS-01..07; orchestration lineage rules | PASS |
| V-09 | Implementation architecture defined — 8 components; classification table; governance integration diagram | PASS |
| V-10 | Semantic authority NOT reopened — SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md constraints honored | PASS |

**Validation result: 10/10 PASS — GOVERNED_TOPOLOGY_AWARE_RAG_VIABLE**

### 13.2 Fail Conditions Not Triggered

| Fail condition | Status |
|---------------|--------|
| Vectors become authoritative | NOT TRIGGERED — canonical resolution gate enforced; authority_class = DERIVATIVE mandatory |
| Retrieval bypasses governance | NOT TRIGGERED — four enforcement gates; STALE/DEPRECATED handling defined |
| Replay requirements omitted | NOT TRIGGERED — Type 4 replay; retrieval_session_record; equivalence model |
| Orchestration memory uncontrolled | NOT TRIGGERED — 6 bounded domains; MG-01..08; invalidation conditions |
| Topology hallucination tolerated | NOT TRIGGERED — chunk types enforce minimum structural units; fragmentation prohibited |
| Semantic authority reopened | NOT TRIGGERED — explicitly confirmed CLOSED |
| Cross-client contamination possible | NOT TRIGGERED — client_id partition mandatory; cross-client retrieval blocked at Gate 1 and Gate 2 |
| Governance boundaries ambiguous | NOT TRIGGERED — authority preservation map defined per stage; four enforcement gates explicit |

### 13.3 Handoff Authorization

**Authorized next stream:** PI.AGENTIC.REPLAY-SAFE-MEMORY.FOUNDATION.01  
**Authorization basis:** 10/10 PASS — all validation criteria met  
**Baseline:** governed-dpsig-baseline-v1 (092e251) — unchanged, active
