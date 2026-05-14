# Governed Evidence Injection Architecture

**Stream:** PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01  
**Document type:** EVIDENCE INJECTION ARCHITECTURE — AUTHORITATIVE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Mode:** GOVERNANCE_MODE  
**Parent foundation:** PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01  
**Prerequisite:** PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.01

---

## 1. Executive Summary

This document defines the governed evidence injection architecture — the system that assembles deterministic structural intelligence from committed artifacts, transforms it into prompt-safe evidence objects, and preserves full lineage for replay verification.

The governing principle:

> **Evidence is authoritative. Prompts consume evidence. LLMs interpret evidence. LLMs NEVER generate evidence.**

The evidence injection architecture is the critical boundary between the deterministic platform (Layers 1–2) and the interpretive AI layer (Layer 4). Everything on the input side is deterministic, committed, and replay-safe. The LLM receives a fully-assembled, governance-filtered evidence object — not free access to the structural artifact store.

This document establishes:
- The nine-stage evidence injection pipeline
- The canonical evidence object schema with field classification
- Topology-aware retrieval for clusters, domains, signals, and propagation paths
- Evidence lineage capture that integrates with TAXONOMY-01 replay instrumentation
- Evidence normalization (deterministic, not interpretive)
- Readiness-gated evidence filtering (per readiness mode)
- Governed RAG integration boundaries for future vector retrieval
- Ten permanent evidence safety rules
- The implementation architecture blueprint

**Governance verdict:** PASS — GOVERNED_EVIDENCE_INJECTION_VIABLE

---

## 2. Governance Inheritance Baseline

### 2.1 Governance Load Confirmation

```
GOVERNANCE LOAD VERIFIED:
- GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md: LOADED
- pipeline_execution_manifest.json: LOADED — allowed_reads surface is the evidence source boundary
- AGENTIC_SEMANTIC_ORCHESTRATION_FOUNDATION.md: LOADED
- GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md: LOADED — evidence object schema V1 defined in §4
- GOVERNED_PROMPT_ORCHESTRATION_ARCHITECTURE.md: LOADED — prompt-safe injection contract defined
- Active baseline: governed-dpsig-baseline-v1 (092e251) — CONFIRMED
```

### 2.2 Evidence Source Authority

The `pipeline_execution_manifest.json` `allowed_reads` surface defines which artifacts are authoritative inputs to the evidence injection engine. This is the evidence source boundary:

| Tier | Artifacts | Use in Evidence Object |
|---|---|---|
| Tier 1 — Runtime Inputs | `canonical_topology.json`, `binding_envelope.json`, `structural_topology_log.json`, `grounding_state_v3.json` | Topology evidence, propagation paths |
| Tier 2 — Governance Inputs | `DPSIG_RUNTIME_NORMALIZATION.md`, `LANE_GOVERNANCE_LOCK.md`, `pipeline_execution_manifest.json` | Evidence boundary validation |
| Tier 3 — Validation Fixtures | DPSIG artifacts, E2E validation artifacts | Signal evidence, readiness evidence |
| Narrative evidence (new tier) | `semantic_topology_model.json`, `projection_aliasing_taxonomy.json`, readiness gate output | Grounding lineage, aliasing permissions |

No artifact outside these tiers may be injected as evidence in a production context.

---

## 3. Evidence Injection Pipeline

### 3.1 Nine-Stage Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 1 — ARTIFACT DISCOVERY                                       │
│  Enumerate committed artifacts for client_id + run_id               │
│  Verify all required tier-1/tier-2 artifacts exist at HEAD          │
│  Record artifact commit hashes for lineage                          │
│  DETERMINISTIC — fail closed if required artifact absent            │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 2 — GOVERNANCE FILTERING                                     │
│  Load pipeline_execution_manifest.json allowed_reads                │
│  Check explicitly_forbidden_reads — exclude any forbidden paths     │
│  Exclude non-canonical client directories (UUID-named)              │
│  DETERMINISTIC — filtering rules are committed                      │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 3 — READINESS VALIDATION                                     │
│  Load readiness gate output for client/run                          │
│  Determine narrative mode (EXECUTIVE_READY / DIAGNOSTIC_ONLY / etc) │
│  If inference_prohibition=True → STOP; return INFERENCE_PROHIBITED  │
│  DETERMINISTIC — gate output is committed artifact                  │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 4 — GROUNDING VALIDATION                                     │
│  Load semantic_topology_model.json for client/run                   │
│  Build domain attribution map: per-domain lineage + language auth   │
│  Load projection_aliasing_taxonomy.json — applicable rules per mode │
│  DETERMINISTIC — grounding is from committed semantic model         │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 5 — TOPOLOGY ASSEMBLY                                        │
│  Load canonical_topology.json → cluster list with node counts       │
│  Load dpsig_signal_set.json → signals with values and traces        │
│  Load binding_envelope.json (if propagation path requested)         │
│  Apply mode filter: DIAGNOSTIC_ONLY suppresses alias fields         │
│  DETERMINISTIC — all inputs are committed artifacts                 │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 6 — EVIDENCE NORMALIZATION                                   │
│  Apply terminology normalization table to display fields            │
│  Compute language authority strings from lineage levels             │
│  Compute qualifier state from readiness_state                       │
│  Apply aliasing rules to produce alias_display fields               │
│  DETERMINISTIC — normalization is lookup-table based                │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 7 — EVIDENCE OBJECT CONSTRUCTION                             │
│  Assemble canonical evidence object from all prior stage outputs    │
│  Validate: all required fields populated                            │
│  Validate: no forbidden fields present                              │
│  Validate: all artifact_hash values recorded                        │
│  Compute: evidence_object_hash (SHA-256 of serialized object)       │
│  DETERMINISTIC — same inputs → same evidence object                 │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 8 — PROMPT-SAFE INJECTION                                    │
│  Serialize evidence object fields into prompt template placeholders │
│  Apply mode-specific evidence filtering (Section 8)                 │
│  Validate: all template placeholders are populated                  │
│  Validate: no placeholder is populated from non-committed source    │
│  DETERMINISTIC — injection is mechanical substitution               │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 9 — REPLAY CAPTURE                                           │
│  Record evidence_object_hash in lineage record                      │
│  Record per-artifact hashes + commit hashes                         │
│  Record narrative_mode, readiness_state, grounding constraints      │
│  Store evidence lineage record to artifacts/evidence-lineage/       │
│  DETERMINISTIC — lineage is computed from deterministic outputs     │
└─────────────────────────────────────────────────────────────────────┘
        ↓
  [Evidence object + lineage record delivered to prompt assembler]
        ↓
  INTERPRETIVE ORCHESTRATION BEGINS HERE
  (LLM receives assembled, evidence-injected prompt)
```

### 3.2 Authority Transition Map

| Stage | Authority Type | Reversible | LLM Involvement |
|---|---|---|---|
| 1 Artifact Discovery | DETERMINISTIC | YES — re-run produces same result | NONE |
| 2 Governance Filtering | DETERMINISTIC | YES | NONE |
| 3 Readiness Validation | DETERMINISTIC | YES | NONE |
| 4 Grounding Validation | DETERMINISTIC | YES | NONE |
| 5 Topology Assembly | DETERMINISTIC | YES | NONE |
| 6 Evidence Normalization | DETERMINISTIC | YES | NONE |
| 7 Evidence Object Construction | DETERMINISTIC | YES | NONE |
| 8 Prompt-Safe Injection | DETERMINISTIC | YES | NONE |
| 9 Replay Capture | DETERMINISTIC | YES | NONE |
| **LLM invocation** | **INTERPRETIVE** | **NO (prose non-deterministic)** | **BOUNDED** |

Deterministic authority ends at Stage 9. All nine evidence stages are bit-reproducible from the same committed artifacts. The LLM never touches Stages 1–9. It receives only the output of Stage 8.

### 3.3 Fail-Closed Rules

The pipeline fails closed (no partial evidence object produced) on:

| Failure Condition | Response |
|---|---|
| Required artifact missing | `EVIDENCE_ARTIFACT_MISSING` — no evidence object produced |
| inference_prohibition=True detected | `INFERENCE_PROHIBITED` — pipeline halts at Stage 3 |
| Artifact hash mismatch (file modified since last replay) | `EVIDENCE_INTEGRITY_FAILURE` — lineage cannot be anchored |
| Required field missing from assembled object | `EVIDENCE_INCOMPLETE` — no injection |
| Forbidden artifact path requested | `GOVERNANCE_VIOLATION` — no evidence object produced |
| Client ID is non-canonical (UUID-named) | `NON_CANONICAL_CLIENT` — blocked |

---

## 4. Evidence Object Architecture

### 4.1 Canonical Evidence Object Schema

```json
{
  "evidence_schema_version": "1.0",
  "evidence_object_hash": "sha256:<hash-of-this-object-excluding-this-field>",
  "assembled_at": "<ISO-8601>",
  "client_id": "<client_id>",
  "run_id": "<run_id>",

  "provenance": {
    "baseline": "governed-dpsig-baseline-v1",
    "baseline_commit": "092e251",
    "assembly_pipeline_version": "1.0",
    "artifact_commit_hashes": {
      "dpsig_signal_set": "<git-sha>",
      "canonical_topology": "<git-sha>",
      "semantic_topology_model": "<git-sha>",
      "projection_aliasing_taxonomy": "<git-sha>",
      "readiness_gate_output": "<git-sha>"
    }
  },

  "readiness": {
    "readiness_state": "EXECUTIVE_READY",
    "executive_rendering_allowed": true,
    "max_cluster_name": "backend_modules",
    "source_artifact": "artifacts/dpsig/<client>/<run>/dpsig_signal_set.json",
    "source_field": "executive_readiness.readiness_state",
    "source_artifact_hash": "sha256:<hash>"
  },

  "narrative_mode": "executive",
  "qualifier": {
    "qualifier_id": "Q-00",
    "banner": null,
    "language_authority": "Full executive attribution permitted"
  },

  "signals": [
    {
      "signal_id": "DPSIG-031",
      "signal_value": 2.1176,
      "activation_state": "CLUSTER_PRESSURE_ELEVATED",
      "severity_band": "ELEVATED",
      "signal_stable_key": "<key>",
      "derivation_hash": "<hash>",
      "source_artifact": "artifacts/dpsig/<client>/<run>/dpsig_signal_set.json",
      "source_field": "signals[0]",
      "source_artifact_hash": "sha256:<hash>",
      "display": {
        "activation_state_normalized": "Elevated Structural Concentration",
        "severity_band_display": "ELEVATED"
      }
    }
  ],

  "topology": {
    "clusters": [
      {
        "cluster_id": "DOM-09",
        "name": "backend_modules",
        "node_count": 6,
        "source_artifact": "clients/<client>/psee/runs/<run>/vault/canonical_topology.json",
        "source_field": "clusters[8]",
        "source_artifact_hash": "sha256:<hash>",
        "aliasing": {
          "alias": "Operational Intelligence",
          "alias_permitted": true,
          "aliasing_rule": "ALI-01",
          "display": "Operational Intelligence (DOM-09)"
        }
      }
    ],
    "propagation_paths": null
  },

  "grounding": {
    "model_version": "1.0",
    "source_artifact": "clients/<client>/psee/runs/<run>/semantic/topology/semantic_topology_model.json",
    "source_artifact_hash": "sha256:<hash>",
    "inference_prohibition": false,
    "domain_attribution_map": [
      {
        "domain_id": "DOMAIN-01",
        "alias": "Edge Data Acquisition",
        "lineage": "EXACT",
        "confidence": 0.95,
        "language_authority": "FULL ATTRIBUTION",
        "alias_permitted": true,
        "aliasing_rule": "ALI-02",
        "qualifier": "none",
        "display": "Edge Data Acquisition (DOMAIN-01)"
      },
      {
        "domain_id": "DOMAIN-02",
        "alias": "Telemetry Transport and Messaging",
        "lineage": "NONE",
        "confidence": 0.0,
        "language_authority": "STRUCTURAL LABEL ONLY",
        "alias_permitted": false,
        "aliasing_rule": "ALI-05",
        "qualifier": "structural label only",
        "display": "DOMAIN-02"
      }
    ]
  },

  "applicable_aliasing_rules": ["ALI-01", "ALI-02", "ALI-03"],
  "active_normalization_rules": [
    { "raw": "CLUSTER_PRESSURE_ELEVATED", "normalized": "Elevated Structural Concentration" },
    { "raw": "Cluster Pressure Index", "normalized": "Structural Concentration Index" }
  ],

  "replay_metadata": {
    "replay_major_version": 1,
    "evidence_stable_key": "sha256:<hash-of-source-artifact-hashes>",
    "replay_instructions": "Re-assemble with same committed artifacts at recorded git SHAs"
  }
}
```

### 4.2 Field Classification Matrix

| Field | Classification | Mutability | LLM May Read | LLM May Modify |
|---|---|---|---|---|
| `evidence_object_hash` | REPLAY_ANCHOR | Computed at assembly | READ | NEVER |
| `client_id`, `run_id` | IDENTITY | From request params | READ | NEVER |
| `provenance.*` | DETERMINISTIC | Computed from artifacts | READ | NEVER |
| `readiness.*` | DIRECT_FIELD | From committed gate output | READ | NEVER |
| `narrative_mode` | DERIVED_DETERMINISTIC | From readiness_state | READ | NEVER |
| `qualifier.*` | DERIVED_DETERMINISTIC | From qualifier taxonomy | READ | NEVER |
| `signals[*].signal_value` | DIRECT_FIELD | From dpsig_signal_set.json | READ | NEVER |
| `signals[*].activation_state` | DIRECT_FIELD | From dpsig_signal_set.json | READ | NEVER |
| `signals[*].display.*` | COMPUTED_DISPLAY | Normalization lookup | READ | NEVER |
| `topology.clusters[*].node_count` | DIRECT_FIELD | From canonical_topology.json | READ | NEVER |
| `topology.clusters[*].aliasing.*` | COMPUTED_DISPLAY | Aliasing rule application | READ | NEVER |
| `grounding.domain_attribution_map[*].lineage` | DIRECT_FIELD | From semantic_topology_model.json | READ | NEVER |
| `grounding.domain_attribution_map[*].language_authority` | COMPUTED_DISPLAY | From lineage level | READ | NEVER |
| `topology.propagation_paths` | CONDITIONAL | From binding_envelope.json | READ | NEVER |
| `replay_metadata.*` | REPLAY_ANCHOR | Computed at assembly | READ | NEVER |

**Classification types:**
- `DIRECT_FIELD` — read verbatim from a committed artifact field
- `DERIVED_DETERMINISTIC` — computed by a deterministic rule from one or more DIRECT_FIELDs; rule is committed
- `COMPUTED_DISPLAY` — formatted for human/LLM readability by a deterministic rule from DIRECT_FIELDs
- `REPLAY_ANCHOR` — computed to anchor replay identity; hash-based

### 4.3 Required vs. Optional vs. Forbidden Fields

**Required in every evidence object:**
- `evidence_schema_version`, `evidence_object_hash`, `assembled_at`
- `client_id`, `run_id`
- `provenance` (all fields)
- `readiness` (all fields)
- `narrative_mode`, `qualifier`
- `signals` (at least one entry for any signal-bearing narrative)
- `topology.clusters` (at least one entry)
- `grounding.domain_attribution_map`
- `replay_metadata`

**Optional (included when narrative type requires):**
- `topology.propagation_paths` — for escalation-trace narratives only
- Historical run comparison fields — for comparative-analysis narratives only (requires committed snapshots)

**Forbidden in evidence object:**
- Session variables, in-memory state, or user-supplied values
- Inferred topology relationships not present in binding_envelope.json
- Business context invented for NONE-lineage domains
- Any field derived from a non-committed, non-canonical source
- LLM-generated values of any kind
- Values from UUID-named client directories

---

## 5. Topology-Aware Retrieval

### 5.1 Retrieval Architecture

Topology-aware retrieval is the ability to assemble evidence scoped to specific topology elements — a cluster, a domain, an escalation path — rather than assembling the full topology every time.

All retrieval operates on committed, indexed artifacts. There is no free-form semantic search in this architecture. Retrieval is topology-scoped, governed, and lineage-captured.

```
Retrieval Request
  { type: "cluster", cluster_id: "DOM-09", scope: "signals_and_grounding" }
    ↓
Topology Retrieval Engine
  1. Resolve cluster_id → canonical_topology.json entry
  2. Extract: node_count, node_ids, cluster alias if applicable
  3. Resolve signals for this cluster from dpsig_signal_set.json
  4. Resolve domain membership from semantic_topology_model.json
  5. Apply readiness filter (Section 8 evidence exposure matrix)
    ↓
Scoped Evidence Object
  (contains only cluster-scoped evidence, not full topology)
    ↓
Prompt assembler receives scoped evidence
```

### 5.2 Retrieval Scope Definitions

| Scope | Contents | Required Artifacts |
|---|---|---|
| `cluster_summary` | Cluster identity, node_count, CPI/CFA values, readiness state, alias | canonical_topology.json, dpsig_signal_set.json, semantic_topology_model.json |
| `full_topology` | All clusters, all signals, full domain attribution map | All tier-1 narrative artifacts |
| `domain_detail` | Single domain: lineage, confidence, alias, language authority | semantic_topology_model.json, projection_aliasing_taxonomy.json |
| `propagation_path` | Source cluster → target cluster edge path | binding_envelope.json edges |
| `escalation_trace` | Signal activation chain from source cluster through binding edges | binding_envelope.json + dpsig_signal_set.json |
| `historical_comparison` | Two committed run snapshots side-by-side | Both run artifacts at committed state |
| `governance_summary` | Readiness state, qualifier, inference_prohibition, grounding coverage | readiness output, semantic_topology_model.json |

### 5.3 Topology Scoping Rules

1. A retrieval request must declare its scope type (from table above)
2. The scope type determines which artifacts are read — no scope may read beyond its declared artifact set
3. Scoped retrieval produces a scoped evidence object (smaller than the full evidence object)
4. Scoped evidence objects carry the same lineage requirements as full evidence objects
5. No retrieval scope may cross client boundaries (client_id is fixed per retrieval)

### 5.4 Lineage Filtering

Every retrieval result must trace to its source artifact. Lineage filtering ensures:
- Cluster evidence cites `canonical_topology.json` at a specific cluster index
- Signal evidence cites `dpsig_signal_set.json` at a specific signal entry
- Domain evidence cites `semantic_topology_model.json` at a specific domain entry
- Propagation paths cite `binding_envelope.json` at specific edge entries

No retrieval result may omit source citation. Retrieval without lineage is a governance violation.

### 5.5 Grounding Filtering

Retrieval results are grounding-filtered based on the narrative mode:
- EXECUTIVE_READY: return full domain attribution map with aliases where permitted
- DIAGNOSTIC_ONLY: return domain_ids only, no aliases, no language authority attribution
- STRUCTURAL_LABELS_ONLY: return structural identifiers only
- INFERENCE_PROHIBITED: return error state; no retrieval

Grounding filtering is applied at Stage 4 of the pipeline and re-applied at Stage 8 for mode-specific output.

### 5.6 Retrieval Provenance

A retrieval provenance record captures the specific retrieval operation:

```json
{
  "retrieval_id": "<uuid>",
  "retrieval_type": "cluster_summary",
  "scope": "signals_and_grounding",
  "target": { "cluster_id": "DOM-09" },
  "client_id": "blueedge",
  "run_id": "run_blueedge_productized_01_fixed",
  "artifacts_read": [
    { "artifact": "clients/blueedge/psee/runs/.../vault/canonical_topology.json", "hash": "sha256:<hash>" },
    { "artifact": "artifacts/dpsig/blueedge/.../dpsig_signal_set.json", "hash": "sha256:<hash>" }
  ],
  "grounding_filter_applied": "EXECUTIVE_READY",
  "retrieved_at": "<ISO-8601>",
  "result_hash": "sha256:<hash>"
}
```

### 5.7 Retrieval Governance Controls

| Prohibited Retrieval Pattern | Enforcement |
|---|---|
| Unconstrained semantic search over all artifacts | Retrieval engine only accepts scoped requests with declared types |
| Topology invention (retrieving relationships not in binding_envelope.json) | Propagation paths require explicit binding_envelope.json edge citations |
| Unbounded context expansion (retrieving all artifacts for all clients) | Scope type limits artifact reads; client_id is locked per request |
| Retrieval bypass around readiness gates | Grounding filter applied at retrieval time, not just at prompt assembly |
| Cross-client evidence contamination | client_id is a required, non-overridable retrieval parameter |

---

## 6. Evidence Lineage Governance

### 6.1 Evidence Lineage Architecture

Evidence lineage begins before the evidence object is assembled and continues through to the prompt lineage record. The chain is:

```
Committed artifact (canonical_topology.json at <git-sha>)
    → Artifact hash (sha256:<hash>) — captured at Stage 1
    → Field read (clusters[8].node_count = 6) — captured at Stage 5
    → Evidence object field (topology.clusters[8].node_count = 6) — captured at Stage 7
    → Prompt placeholder injection ({topology_block}) — captured at Stage 8
    → Evidence object hash (sha256:<evidence-object-hash>) — captured at Stage 9
    → Prompt lineage record (evidence_object_hash) — captured post-assembly
    → Output lineage record (output_hash + evidence_object_hash) — captured post-LLM
```

Every step in this chain is auditable. An auditor can follow any value in a narrative output back to the specific committed artifact field that sourced it.

### 6.2 Evidence Lineage Capture Schema

```json
{
  "evidence_lineage_version": "1.0",
  "evidence_lineage_id": "<uuid>",
  "client_id": "<client_id>",
  "run_id": "<run_id>",
  "assembly_timestamp": "<ISO-8601>",
  "evidence_object_hash": "sha256:<hash>",
  "evidence_stable_key": "sha256:<hash-of-artifact-hashes>",

  "artifact_reads": [
    {
      "artifact_path": "artifacts/dpsig/blueedge/.../dpsig_signal_set.json",
      "artifact_hash": "sha256:<hash>",
      "artifact_git_sha": "<git-sha>",
      "fields_read": ["signals[0].signal_value", "signals[0].activation_state", "signals[1].signal_value"]
    }
  ],

  "field_bindings": [
    {
      "evidence_field": "signals[0].signal_value",
      "source_artifact": "artifacts/dpsig/blueedge/.../dpsig_signal_set.json",
      "source_field": "signals[0].signal_value",
      "binding_type": "DIRECT_FIELD",
      "value": 2.1176
    }
  ],

  "normalization_applied": ["CLUSTER_PRESSURE_ELEVATED → Elevated Structural Concentration"],
  "grounding_filter_applied": "EXECUTIVE_READY",
  "aliasing_rules_applied": ["ALI-01", "ALI-02"],
  "qualifier_applied": "Q-00",
  "replay_major_version": 1
}
```

### 6.3 Storage Path

```
artifacts/evidence-lineage/<client_id>/<run_id>/<evidence_lineage_id>.json
```

Evidence lineage records are local audit artifacts (not committed by default). They become committed governed artifacts when a narrative session is promoted to a named, versioned governed output.

### 6.4 Integration with Deterministic Replay Instrumentation

The evidence lineage model integrates with TAXONOMY-01 replay instrumentation from `DETERMINISTIC_REPLAY_INSTRUMENTATION.md`:

| TAXONOMY-01 Field | Evidence Lineage Equivalent | Purpose |
|---|---|---|
| `signal_stable_key` | `evidence_stable_key` | Stable identity anchor |
| `derivation_hash` | `evidence_object_hash` | Unique derivation fingerprint |
| `derivation_trace.*` | `artifact_reads` + `field_bindings` | Full audit chain |
| `activation_state` | `readiness.readiness_state` | Current state identity |

The evidence layer extends the TAXONOMY-01 model upward: just as a signal carries its derivation_hash, an evidence object carries its evidence_object_hash. A prompt lineage record carries both.

### 6.5 Orchestration and Prompt Lineage Integration

When an evidence object feeds a prompt invocation, the lineage chain extends:

```
evidence_lineage_id → evidence_object_hash
    ↓
prompt_lineage record: { evidence_object_hash: "...", template_id: "...", ... }
    ↓
output_lineage record: { prompt_lineage_id: "...", output_hash: "...", ... }
```

A full audit of a narrative output traces: output → prompt → evidence → artifact fields → committed git SHA.

---

## 7. Evidence Normalization

### 7.1 Normalization Pipeline

Evidence normalization transforms raw field values into display-safe forms before prompt injection. Normalization is entirely deterministic — it uses committed lookup tables and rule sets.

```
Raw Field Value (from committed artifact)
    ↓
Stage 1: Terminology Normalization
    Apply 17-term normalization table (from projection_aliasing_taxonomy.json)
    Raw: CLUSTER_PRESSURE_ELEVATED → Normalized: Elevated Structural Concentration
    Applies to: display fields in executive/qualified modes only
    ↓
Stage 2: Identifier Normalization
    Apply aliasing rules (ALI-01..07) to produce display forms
    Raw: DOM-09 + alias "Operational Intelligence" → Display: "Operational Intelligence (DOM-09)"
    Applies to: cluster.aliasing.display, domain attribution map display
    ↓
Stage 3: Semantic Confidence Normalization
    Map lineage level → language authority string
    EXACT → "FULL ATTRIBUTION" | STRONG → "QUALIFIED ATTRIBUTION" | PARTIAL → "SOFT ATTRIBUTION" | NONE → "STRUCTURAL LABEL ONLY"
    ↓
Stage 4: Qualifier Normalization
    Map readiness_state → Q-XX entry → banner text
    Applies to: qualifier.banner in evidence object
    ↓
Stage 5: Executive Rendering Normalization
    Apply mode-specific rendering rules:
    - executive mode: normalized terms, aliased identifiers, qualifier banners
    - diagnostic mode: suppress all normalization (raw technical values appropriate)
    - structural mode: suppress all aliasing; raw identifiers only
```

### 7.2 Normalization Governance Rules

| Rule | Enforcement |
|---|---|
| Normalization only applies to display fields | Raw field values are preserved alongside normalized display fields |
| Normalized display fields are never cited as authoritative values | The `signal_value`, `activation_state`, `lineage` fields are raw; only `display.*` fields carry normalized forms |
| Normalization is mode-gated | DIAGNOSTIC_ONLY mode suppresses terminology normalization and aliasing |
| Normalization does not change data layer values | `signal_value = 2.1176` is always shown as-is; only the label "CLUSTER_PRESSURE_ELEVATED" gets normalized |
| Normalization table is versioned with the aliasing taxonomy | Changes to normalization require taxonomy version increment |

### 7.3 Normalization Classification Matrix

| Normalization Type | Input | Output | Deterministic | LLM-Applied |
|---|---|---|---|---|
| Terminology normalization | Raw technical label | Human-readable term | YES | NO — pre-LLM |
| Identifier aliasing | Raw cluster/domain ID | Alias + raw ID display | YES | NO — pre-LLM |
| Confidence normalization | Lineage level (EXACT/STRONG/PARTIAL/NONE) | Language authority string | YES | NO — pre-LLM |
| Qualifier normalization | Readiness state | Q-XX banner text | YES | NO — pre-LLM |
| Executive rendering normalization | Mode + field set | Display-safe evidence object | YES | NO — pre-LLM |
| Interpretive enrichment | LLM reasoning | Natural language narrative | NO | YES — post-evidence |

**The normalization pipeline is entirely pre-LLM and entirely deterministic.** The LLM receives normalized evidence — it does not perform normalization. This preserves the deterministic authority of the normalization rules.

---

## 8. Readiness-Gated Evidence Filtering

### 8.1 Evidence Exposure Matrix

Evidence filtering determines which fields of the assembled evidence object are exposed to the prompt for each narrative mode.

| Evidence Field | EXECUTIVE_READY | EXECUTIVE_READY_WITH_QUALIFIER | DIAGNOSTIC_ONLY | STRUCTURAL_LABELS_ONLY | INFERENCE_PROHIBITED |
|---|---|---|---|---|---|
| `signals[*].signal_value` | EXPOSED | EXPOSED | EXPOSED | EXPOSED | BLOCKED |
| `signals[*].activation_state` (raw) | EXPOSED | EXPOSED | EXPOSED | EXPOSED | BLOCKED |
| `signals[*].display.activation_state_normalized` | EXPOSED | EXPOSED | SUPPRESSED | SUPPRESSED | BLOCKED |
| `topology.clusters[*].name` | EXPOSED | EXPOSED | EXPOSED | EXPOSED | BLOCKED |
| `topology.clusters[*].aliasing.alias` | EXPOSED (if ALI-01 applies) | EXPOSED (if ALI-01 applies) | SUPPRESSED | SUPPRESSED | BLOCKED |
| `grounding.domain_attribution_map[*].alias` | EXPOSED (if alias_permitted) | EXPOSED (if alias_permitted) | SUPPRESSED | SUPPRESSED | BLOCKED |
| `grounding.domain_attribution_map[*].language_authority` | EXPOSED | EXPOSED | OVERRIDDEN → STRUCTURAL LABEL ONLY | OVERRIDDEN → STRUCTURAL LABEL ONLY | BLOCKED |
| `qualifier.banner` | SUPPRESSED (Q-00, no banner) | EXPOSED (Q-01 banner) | EXPOSED (Q-02 banner) | EXPOSED (Q-03/Q-04 banner) | N/A |
| `active_normalization_rules` | EXPOSED | EXPOSED | SUPPRESSED | SUPPRESSED | BLOCKED |
| `topology.propagation_paths` | EXPOSED (if assembled) | EXPOSED (if assembled) | EXPOSED | SUPPRESSED | BLOCKED |
| `readiness.readiness_state` | EXPOSED | EXPOSED | EXPOSED | EXPOSED | BLOCKED |

### 8.2 Readiness Filtering Rules

**EXECUTIVE_READY filtering:**
- Expose all fields
- Apply aliasing where alias_permitted=true
- Apply terminology normalization
- Qualifier = Q-00 (no banner)

**EXECUTIVE_READY_WITH_QUALIFIER filtering:**
- Same as EXECUTIVE_READY
- Add Q-01 banner to evidence object qualifier field
- Inject PARTIAL-lineage caveat strings into domain_attribution_map entries

**DIAGNOSTIC_ONLY filtering:**
- Suppress all aliasing fields (alias, display fields using aliases)
- Override all language_authority fields to STRUCTURAL LABEL ONLY
- Suppress normalization rules
- Retain raw signal values, cluster names, domain IDs
- Add Q-02 banner
- Override domain_attribution_map: all entries → `language_authority: "STRUCTURAL LABEL ONLY"`, `alias_permitted: false`

**STRUCTURAL_LABELS_ONLY filtering:**
- Suppress all aliasing, normalization, and propagation_path fields
- Retain only raw identifiers: cluster_id, domain_id, signal_id, signal_value
- Add Q-03 or Q-04 banner
- Domain attribution map entries: `display: "<domain_id>"`, all other attribution fields suppressed

**INFERENCE_PROHIBITED filtering:**
- Pipeline halts at Stage 3 — no evidence object produced
- Return error state: `{ "status": "INFERENCE_PROHIBITED", "client_id": "...", "inference_prohibition": true }`

### 8.3 Semantic Containment Boundaries

Evidence filtering is the primary semantic containment mechanism at the evidence layer. It enforces containment before the LLM is ever invoked:

- A DIAGNOSTIC_ONLY client's evidence object contains no aliases → LLM cannot attribute business names (they are not present)
- A NONE-lineage domain's evidence object entry has `alias_permitted: false` and `display: "DOMAIN-05"` → LLM only ever sees the raw identifier
- inference_prohibition halts the pipeline entirely → LLM never receives any evidence for that client

This is defense-in-depth: the prompt template governance section also enforces these rules, but the evidence filtering layer ensures the LLM never receives attributable data it is not authorized to use.

---

## 9. Vector / RAG Integration Boundaries

### 9.1 Architecture Position

Vector retrieval (RAG) is a future capability planned for `PI.AGENTIC.NARRATIVE.TOPOLOGY-AWARE-RAG.*`. At the governed-dpsig-baseline-v1 state, all retrieval is from committed JSON artifacts. This section defines the governance model for when vector retrieval is added.

**Governing rule:** JSON artifacts remain the primary source of truth. Vector retrieval is secondary, non-authoritative, and lineage-bound. A vector retrieval result cannot override a JSON artifact value.

### 9.2 Governed RAG Architecture

```
Query
    ↓
Stage A: JSON Evidence Assembly (this pipeline, Stages 1–9)
    Produces: authoritative evidence object from committed artifacts
    ↓
Stage B: Vector Retrieval (future — supplementary only)
    Retrieves: relevant text chunks from indexed committed artifacts
    → Chunks carry provenance: source_artifact + chunk_id + artifact_hash
    → Retrieval result carries: query, vector_index_version, chunk_provenance[]
    ↓
Stage C: RAG Evidence Merge
    Merges: vector retrieval results into supplementary evidence context
    Rule: vector results may ONLY add explanatory context
    Rule: vector results may NOT override JSON field values
    Rule: vector results that contradict JSON artifact values are discarded
    ↓
Enriched evidence object (JSON authoritative + vector supplementary)
    → LLM receives both; JSON values are marked AUTHORITATIVE
```

### 9.3 Vector Governance Model

| Governance Dimension | Rule |
|---|---|
| Vector index source | Only committed artifacts may be indexed (no uncommitted state, no external sources) |
| Chunk provenance | Every chunk carries: source_artifact_path, chunk_id, artifact_hash, chunk_start_offset |
| Index versioning | Vector index version is recorded in lineage; index changes trigger replay equivalence break |
| Retrieval replayability | Same query + same vector index version → same retrieved chunks (index is versioned, not live) |
| Authority level | SUPPLEMENTARY — vector results never override JSON field values |
| Topology-aware chunking | Chunks follow topology boundaries: one chunk per cluster summary, one chunk per domain entry |
| Cross-client isolation | Vector index is per-client; no cross-client retrieval |
| Grounding filter | Vector retrieval results are grounding-filtered identically to JSON evidence |

### 9.4 Topology-Aware Chunking

When committed artifacts are indexed for vector retrieval, chunking follows topology boundaries:

```
canonical_topology.json → one chunk per cluster entry
semantic_topology_model.json → one chunk per domain entry
dpsig_signal_set.json → one chunk per signal entry
binding_envelope.json → one chunk per pressure zone
```

This ensures that retrieved chunks are topologically coherent — a chunk about `DOM-09` contains the complete evidence for that cluster, not a cross-cluster fragment. Topology-aware chunking prevents evidence fragmentation and attribution bleed between domains.

### 9.5 Retrieval Replay Model

Vector retrieval replay requires:
1. Same query text (captured in retrieval lineage)
2. Same vector index version (index is versioned, commits anchored)
3. Same top-k setting and similarity threshold
4. Produced same chunk set (chunk provenance comparison)

A vector index change creates a replay equivalence break for all subsequent retrievals — equivalent to a major version increment for affected narrative templates.

---

## 10. Evidence Safety Boundaries

### 10.1 Permanent Evidence Safety Rules

**E-SAF-01 — No Hidden Retrieval Augmentation**  
Every artifact read during evidence assembly must be declared in the evidence lineage record. No artifact may be silently included in the evidence object without its path and hash being recorded. Hidden reads are governance violations.

**E-SAF-02 — No Evidence Fabrication**  
The evidence assembly engine may not generate any value that is not traceable to a committed artifact field. There is no interpolation, estimation, or default-value substitution for missing evidence. Missing evidence → evidence assembly fails closed.

**E-SAF-03 — No Uncited Semantic Injection**  
No business context, organizational interpretation, or semantic enrichment may be injected into the evidence object. The evidence object contains structural facts and grounding-gated aliases. It does not contain organizational opinions, risk assessments, or analytical conclusions.

**E-SAF-04 — No Invented Historical Baselines**  
Historical comparison evidence must cite two specific committed run artifacts. There is no default "baseline" that the system assumes. If no historical artifact is provided, the `historical_comparison` field is null and the narrative template for comparative analysis must state "no historical baseline available."

**E-SAF-05 — No Retrieval Drift**  
Retrieval scope is declared at invocation time and does not expand during assembly. A retrieval scoped to `cluster_summary` for `DOM-09` reads only the artifact fields relevant to that cluster. It does not traverse to adjacent clusters unless explicitly requested as a new retrieval.

**E-SAF-06 — No Topology Hallucination**  
Propagation paths must be derived from `binding_envelope.json` edges. No inferred connections are permitted. If `binding_envelope.json` does not contain an edge between cluster A and cluster B, no propagation path between them may be included in the evidence object.

**E-SAF-07 — No Lineage Loss**  
Every field in the evidence object that derives from a committed artifact must carry source traceability: `source_artifact`, `source_field`, `source_artifact_hash`. A field without lineage is not a valid evidence field.

**E-SAF-08 — No Silent Evidence Substitution**  
When an evidence assembly detects that an artifact has changed since the last lineage record (artifact hash differs), it must flag this as an evidence state change — not silently use the new value. The calling system decides whether to proceed with new evidence or abort to preserve replay equivalence.

**E-SAF-09 — No Cross-Client Evidence Contamination**  
Evidence objects are strictly per-client and per-run. Evidence assembled for `blueedge/run_A` may never be combined with evidence from `fastapi/run_B`. Each retrieval and assembly is isolated by `(client_id, run_id)`.

**E-SAF-10 — No Evidence Authority Delegation**  
The LLM may not be instructed to "find additional evidence" or "supplement the evidence with your knowledge." The evidence object is complete at injection. The LLM interprets what it receives; it does not retrieve, augment, or expand the evidence base.

### 10.2 Prohibited Evidence Patterns

| Pattern | Rule Violated |
|---|---|
| Assembling evidence from session variables | E-SAF-01, E-SAF-02 |
| Inverting topology (claiming A connects to B when binding_envelope shows B connects to A) | E-SAF-06 |
| Using a previous run's signal values for the current run | E-SAF-04, E-SAF-09 |
| Injecting a vendor description of a framework as domain evidence | E-SAF-03 |
| Assuming a historical pressure increase without committed snapshots | E-SAF-04 |
| Retrieving the full artifact store when only cluster_summary was requested | E-SAF-05 |
| Allowing the LLM to look up documentation to fill missing evidence | E-SAF-10 |
| Silently updating an evidence field after artifact hash change | E-SAF-08 |
| Mixing evidence from FastAPI and BlueEdge runs in one object | E-SAF-09 |
| Including a derivation_trace field from a different signal version | E-SAF-07 |

### 10.3 Governance Enforcement Controls

| Control | Mechanism |
|---|---|
| Artifact path validation | Stage 2 governance filter checks allowed_reads and explicitly_forbidden_reads |
| Hash recording | Stage 1 records artifact hashes; Stage 7 validates all required hashes present |
| Inference prohibition check | Stage 3 halts pipeline; no evidence object produced |
| Lineage completeness check | Stage 7 validates every field has source_artifact + source_field |
| Cross-client isolation | client_id is locked at pipeline invocation; no override path |
| Scope enforcement | Retrieval engine validates scope type against allowed artifact set |
| LLM isolation | Evidence object is serialized and sealed before LLM invocation; no post-assembly modification |

---

## 11. Implementation Architecture

### 11.1 Component Responsibility Map

| Component | Responsibility | Type | Script Path |
|---|---|---|---|
| Artifact Discovery Agent | Enumerate and hash-validate all required artifacts for client/run | DETERMINISTIC | `scripts/pios/agentic/artifact_discovery.py` |
| Governance Filter | Apply allowed_reads and forbidden_reads from pipeline manifest | DETERMINISTIC | `scripts/pios/agentic/governance_filter.py` |
| Readiness Resolver | Load and parse readiness gate output; determine narrative mode | DETERMINISTIC | `scripts/pios/agentic/readiness_resolver.py` |
| Grounding Loader | Load semantic_topology_model.json; build domain attribution map | DETERMINISTIC | `scripts/pios/agentic/grounding_loader.py` |
| Topology Assembler | Load canonical_topology.json; assemble cluster list with aliasing | DETERMINISTIC | `scripts/pios/agentic/topology_assembler.py` |
| Evidence Normalizer | Apply terminology normalization, aliasing, qualifier mapping | DETERMINISTIC | `scripts/pios/agentic/evidence_normalizer.py` |
| Evidence Object Builder | Assemble canonical evidence object; compute evidence_object_hash | DETERMINISTIC | `scripts/pios/agentic/evidence_builder.py` |
| Evidence Validator | Validate required fields, forbidden fields, lineage completeness | DETERMINISTIC | `scripts/pios/agentic/evidence_validator.py` |
| Lineage Recorder | Create and store evidence lineage record | DETERMINISTIC | `scripts/pios/agentic/lineage_recorder.py` |
| Topology Query Engine | Scoped retrieval by cluster/domain/signal/path | DETERMINISTIC | `scripts/pios/agentic/topology_query.py` |
| Evidence Linter | Static validation of evidence objects pre-injection | DETERMINISTIC | `scripts/pios/agentic/evidence_linter.py` |

### 11.2 Implementation Blueprint

```
Evidence Assembly Pipeline
──────────────────────────
[INPUT: client_id, run_id, scope_type, historical_run_id (optional)]

Artifact Discovery Agent
  → hash-validate all required artifacts
  → fail closed on missing required artifacts
    ↓
Governance Filter
  → remove forbidden paths
  → validate allowed_reads compliance
    ↓
Readiness Resolver
  → load readiness_state
  → determine narrative_mode
  → STOP if inference_prohibition=True
    ↓
Grounding Loader
  → load semantic_topology_model.json
  → build domain_attribution_map
    ↓
Topology Assembler
  → load canonical_topology.json
  → load dpsig_signal_set.json
  → load binding_envelope.json (if scope includes propagation_paths)
  → apply mode filter to aliasing fields
    ↓
Evidence Normalizer
  → apply terminology normalization (executive mode only)
  → apply identifier aliasing
  → compute language authority strings
  → compute qualifier state
    ↓
Evidence Object Builder
  → assemble canonical evidence object
  → compute evidence_object_hash
    ↓
Evidence Validator
  → validate required fields
  → validate no forbidden fields
  → validate lineage completeness
    ↓
Lineage Recorder
  → store evidence_lineage record
    ↓
[OUTPUT: canonical evidence object + evidence_lineage_id]
    ↓
→ Delivered to Prompt Assembler (PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.01)
```

### 11.3 Evidence Linting Model

The evidence linter validates assembled evidence objects before they are delivered to the prompt assembler. It checks:

| Lint Rule | Check |
|---|---|
| EL-01: Schema version present | `evidence_schema_version` field is populated |
| EL-02: Evidence object hash present | `evidence_object_hash` is a valid SHA-256 |
| EL-03: All required signals have source citations | `signals[*].source_artifact` and `source_field` populated |
| EL-04: All domain attribution entries have language authority | `domain_attribution_map[*].language_authority` populated |
| EL-05: Aliasing consistent with mode | Mode=diagnostic: no `alias` fields exposed |
| EL-06: Qualifier consistent with readiness state | Q-00 only for EXECUTIVE_READY; Q-02 required for DIAGNOSTIC_ONLY |
| EL-07: No session-local fields | All fields derive from artifact paths (no in-memory-only values) |
| EL-08: Artifact hashes present | `provenance.artifact_commit_hashes` fully populated |
| EL-09: No cross-client contamination | All artifact paths reference the same `client_id` |
| EL-10: Replay metadata present | `replay_metadata.evidence_stable_key` populated |

### 11.4 Deterministic vs. Interpretive Component Classification

All 11 components in the evidence injection architecture are deterministic. The interpretive boundary begins after the evidence object is delivered to the prompt assembler and the LLM is invoked:

```
DETERMINISTIC ZONE: Artifact Discovery → Evidence Validator → Lineage Recorder
                    ↓
BOUNDARY: Evidence object serialized and sealed
                    ↓
INTERPRETIVE ZONE: Prompt Assembler → LLM Invoker → Cognitive Normalizer
```

---

## 12. Governance Verdict

### 12.1 Verdict Matrix

| Dimension | Verdict | Basis |
|---|---|---|
| Replay safety | PASS | evidence_stable_key + per-artifact hashes; evidence_object_hash; replay diff model defined |
| Evidence authority preservation | PASS | JSON artifacts remain primary; LLM receives sealed evidence; all 11 assembly components are deterministic |
| Retrieval governance | PASS | Scoped retrieval with declared types; lineage filter; topology-aware chunking; E-SAF-01..10 |
| Enterprise safety | PASS | Fail-closed on INFERENCE_PROHIBITED; cross-client isolation; lineage completeness validation |
| Topology-aware retrieval viability | PASS | Six scope types defined; propagation path retrieval from binding_envelope.json; topology-aware chunking |
| Future RAG readiness | PASS | Governed RAG architecture defined; vector secondary/non-authoritative; chunk provenance model |
| Orchestration compatibility | PASS | Evidence object sealed before LLM; chain model receives scoped evidence objects; EVIDENCE_ADDITIVE |
| Semantic containment integrity | PASS | Readiness-gated filtering; DIAGNOSTIC_ONLY suppresses all aliases; inference_prohibition halts pipeline |

### 12.2 Critical Required Conclusion Confirmed

> **Retrieval systems retrieve evidence. They do NOT generate truth.**

This is enforced by architecture, not convention:
- All 11 assembly components read from committed artifacts; none writes new facts
- The evidence object schema classifies every field as DIRECT_FIELD, DERIVED_DETERMINISTIC, or COMPUTED_DISPLAY — no field type is GENERATED
- The evidence object is sealed (evidence_object_hash computed) before delivery to any interpretive system
- The LLM receives the sealed object as read-only input; it has no write path back to the evidence layer
- Vector retrieval (future) is classified SUPPLEMENTARY — it cannot override JSON values

### 12.3 Path Forward

**GOVERNED_EVIDENCE_INJECTION_VIABLE — PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.* authorized.**

Immediate handoff: **PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.01**

The cognitive normalization stream defines the post-LLM normalization pass (Stage 7 of the narrative pipeline): applying the terminology normalization table, aliasing rules, and qualifier banners to LLM output. This is the final deterministic processing stage before executive rendering.

---

## 13. Validation

| Check | Result | Evidence |
|---|---|---|
| Evidence remains authoritative | PASS | JSON artifacts primary; LLM receives sealed evidence object; all assembly components deterministic |
| Retrieval replayability explicit | PASS | evidence_stable_key; per-artifact hashes; replay diff schema; vector index versioning |
| Lineage capture explicit | PASS | Evidence lineage schema; field binding records; integration with TAXONOMY-01 |
| Topology-aware retrieval bounded | PASS | Six declared scope types; allowed_reads enforcement; E-SAF-05/06/07 |
| Readiness gating preserved | PASS | Stage 3 halt on INFERENCE_PROHIBITED; evidence exposure matrix per mode |
| Vector governance explicit | PASS | Governed RAG architecture; chunk provenance; topology-aware chunking; SUPPLEMENTARY authority |
| Semantic containment preserved | PASS | Grounding filter at Stage 4; mode-based aliasing suppression; E-SAF-03/06/09 |
| Governance inheritance explicit | PASS | allowed_reads from pipeline manifest enforced at Stage 2; all locked truths carried |
| No hidden retrieval paths possible | PASS | All reads declared in lineage; governance filter blocks explicitly_forbidden_reads; linter EL-07 |
| Implementation architecture defined | PASS | 11-component blueprint; evidence linter with 10 lint rules; deterministic/interpretive boundary explicit |

**10/10 PASS — GOVERNED_EVIDENCE_INJECTION_VIABLE**

---

*End of document.*  
*Stream: PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Handoff: PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.01*
