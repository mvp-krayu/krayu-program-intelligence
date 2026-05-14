# Governed Narrative Intelligence — Foundation

**Stream:** PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01  
**Document type:** ARCHITECTURAL FOUNDATION — AUTHORITATIVE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Mode:** GOVERNANCE_MODE  
**Parent foundation:** PI.AGENTIC-SEMANTIC-ORCHESTRATION.FOUNDATION.01

---

## 1. Executive Summary

This document defines the architecture and governance model for Governed Narrative Intelligence — the first production-safe AI layer on top of the Program Intelligence deterministic structural platform.

The governing principle is indivisible from the broader agentic architecture:

> **Narratives explain structural intelligence. Narratives do NOT generate structural truth.**

Every narrative output is constrained by three inherited authority chains: the deterministic signal foundation (what is true), the readiness gate (whether executive rendering is permitted), and the grounding lineage model (how much confidence language the narrative is permitted to use). None of these constraints can be overridden by narrative generation. They are inputs to it.

This stream establishes:
- The complete narrative generation execution flow
- The evidence injection contract (field-level evidence binding)
- The prompt governance model (committed, versioned, auditable templates)
- Narrative replayability semantics (evidence-identical, not bit-identical)
- Four narrative modes derived from readiness state
- Integration with the cognitive projection design (ALI-01..07, Q-00..Q-04)
- Ten permanent narrative safety rules
- The LENS narrative evolution roadmap
- The implementation stream family and sequencing

**Governance verdict:** PASS — GOVERNED_NARRATIVE_INTELLIGENCE_VIABLE

---

## 2. Governance Inheritance Baseline

### 2.1 Governance Load Confirmation

```
GOVERNANCE LOAD VERIFIED:
- GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md: LOADED
- pipeline_execution_manifest.json: LOADED
- STREAM_GOVERNANCE_LOAD_TEMPLATE.md: LOADED
- governance_baselines.json: LOADED — active baseline: governed-dpsig-baseline-v1 (092e251)
- AGENTIC_SEMANTIC_ORCHESTRATION_FOUNDATION.md: LOADED
- SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md: LOADED
```

### 2.2 Inherited Locked Truths

All locked truths from the governed baseline and the agentic foundation carry forward without exception:

| Truth | Narrative Implication |
|---|---|
| Structural truth is sovereign | No narrative value may contradict a committed signal value |
| Deterministic runtime is authoritative | Narratives cite signal outputs; they do not recompute them |
| Semantics are interpretive | Narrative language authority is bounded by grounding confidence |
| Replay determinism is mandatory | Narrative replay is evidence-identical; prompt templates are committed |
| Evidence First is absolute | No narrative claim without a committed evidence source |
| Readiness gating is authoritative | Narrative mode is determined by the gate; narrative cannot override it |
| Semantic richness only when grounded | NONE-lineage domains receive structural labels in all narrative modes |
| inference_prohibition=True blocks all interpretation | No narrative generated for a client or domain in this state |

### 2.3 Position in the Layer Stack

Narrative generation operates at Layer 4 (Agentic Orchestration) and surfaces at Layer 6 (Executive Interaction). It reads from Layers 1–3 and renders through Layer 5 (Cognitive Projection).

```
L6 Executive Interaction    ← narrative output rendered here
L5 Cognitive Projection     ← aliasing/normalization applied here
L4 Agentic Orchestration    ← narrative generated here (THIS LAYER)
L3 Semantic Interpretation  ← grounding scope determined here
L2 Signal Derivation        ← evidence inputs sourced here
L1 Structural Topology      ← foundational facts sourced here
```

Narrative generation cannot write to L1 or L2. It reads from them. The authority boundary is absolute.

---

## 3. Narrative Generation Architecture

### 3.1 Narrative Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 1 — EVIDENCE RETRIEVAL                                       │
│  Read committed artifacts: dpsig_signal_set.json,                   │
│  canonical_topology.json, semantic_topology_model.json,             │
│  projection_aliasing_taxonomy.json                                  │
│  → Evidence object assembled; all fields tagged with source         │
│  Authority: DETERMINISTIC — no LLM involvement                      │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 2 — READINESS GATE VALIDATION                                │
│  Read readiness_state from _classify_dpsig_readiness_state output   │
│  Check executive_rendering_allowed                                  │
│  → Narrative mode assigned (EXECUTIVE_READY / DIAGNOSTIC_ONLY /     │
│    STRUCTURAL_LABELS_ONLY / INFERENCE_PROHIBITED)                   │
│  Authority: GATE — non-negotiable; if INFERENCE_PROHIBITED, STOP    │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 3 — GROUNDING LINEAGE FILTERING                              │
│  Apply ALI-05, ALI-06, ALI-07 to each domain/cluster in scope       │
│  → Permitted attribution set: which identifiers may use aliases     │
│  → Language authority map: per-domain confidence level              │
│  Authority: GROUNDING-DETERMINISTIC — same semantic_topology_model  │
│             → same permissions                                      │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 4 — PROMPT ASSEMBLY                                          │
│  Select committed prompt template for narrative type + mode         │
│  → Template version logged                                          │
│  Authority: TEMPLATE — no ad-hoc prompt construction in production  │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 5 — EVIDENCE INJECTION                                       │
│  Populate template variables with evidence fields                   │
│  Every variable: {artifact_path}.{field_name} = value               │
│  → Populated prompt with full evidence binding                      │
│  Authority: EVIDENCE — LLM receives only structured, cited inputs   │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 6 — NARRATIVE SYNTHESIS (LLM BOUNDARY)                       │
│  LLM generates natural language from evidence-injected prompt       │
│  → Raw narrative output (not yet normalized)                        │
│  Authority: INTERPRETIVE — LLM explains; it does not decide         │
│  ← DETERMINISTIC AUTHORITY STOPS HERE                               │
│  → NARRATIVE INTERPRETATION BEGINS HERE                             │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 7 — COGNITIVE PROJECTION NORMALIZATION                       │
│  Apply terminology normalization (17-term table)                    │
│  Apply qualifier taxonomy (Q-00..Q-04) banners                      │
│  Apply aliasing rules (ALI-01..07) to any residual raw identifiers  │
│  → Normalized narrative                                             │
│  Authority: RULE-DETERMINISTIC — normalization is non-probabilistic │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 8 — OUTPUT RENDERING                                         │
│  Format for target surface (LENS report section, API response, etc) │
│  Attach qualifier banners per Q-XX taxonomy                         │
│  Attach evidence citations (visible to executive)                   │
│  → Final narrative output                                           │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 9 — REPLAY CAPTURE                                           │
│  Record: evidence_artifact_hashes, readiness_state, template_version│
│  narrative_mode, grounding_constraints_applied, generation_timestamp│
│  → Narrative lineage record committed or logged                     │
│  Authority: AUDIT — replay lineage is a governance artifact         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Authority Transition Boundaries

**Deterministic authority (Stages 1–5):**
Everything before the LLM is deterministic. Evidence retrieval, readiness gate evaluation, grounding filtering, prompt template selection, and evidence injection all produce the same result given the same committed inputs. These stages can be replicated bit-identically.

**LLM interpretation boundary (Stage 6):**
The LLM receives a structured, evidence-injected prompt. It produces natural language. This is the only probabilistic stage. The LLM cannot alter the evidence it receives. It can only explain it.

**Post-processing determinism (Stages 7–9):**
Cognitive projection normalization is rule-based (not probabilistic). Terminology normalization is a lookup table. Aliasing rules are conditionals. Qualifier banners are state-determined. The post-LLM stages are deterministic.

**Governing rule:** The LLM is sandwiched between deterministic stages. Its input is fully governed. Its output is fully normalized. The probabilistic surface is narrow and bounded.

---

## 4. Evidence Injection Model

### 4.1 Mandatory Evidence Sources

Every narrative generation invocation must receive evidence from at minimum these sources:

| Source Artifact | Mandatory Fields | Purpose in Narrative |
|---|---|---|
| `artifacts/dpsig/<client>/<run>/dpsig_signal_set.json` | `signals[*].signal_id`, `signal_value`, `activation_state`, `severity_band`, `signal_stable_key` | Signal citations — what pressure was detected |
| `clients/<client>/psee/runs/<run>/semantic/topology/semantic_topology_model.json` | `domains[*].domain_id`, `lineage`, `confidence`, cluster assignments | Grounding lineage — what language authority applies |
| `clients/<client>/psee/runs/<run>/vault/canonical_topology.json` or structure adapter | `cluster_id`, `name`, `node_count` | Topology facts — cluster sizes and identities |
| `docs/psee/.../projection_aliasing_taxonomy.json` | `cluster_aliases`, `domain_aliases`, `terminology_normalization`, `qualifier_taxonomy` | Rendering rules — which aliases apply |
| Readiness gate output (or equivalent) | `readiness_state`, `executive_rendering_allowed`, `max_cluster_name` | Narrative mode gate — what rendering is permitted |

### 4.2 Field-Level Evidence Binding

Evidence binding means every narrative variable traces to a specific committed artifact, field path, and value. No narrative variable is populated from computed, inferred, or session-local state.

Evidence binding schema per variable:

```json
{
  "variable_name": "primary_cluster_cpi",
  "source_artifact": "artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json",
  "field_path": "signals[0].derivation_trace.cpi",
  "value": 2.1176,
  "artifact_hash": "sha256:...",
  "binding_type": "DIRECT_FIELD"
}
```

Binding types:
- `DIRECT_FIELD` — value read directly from a committed artifact field
- `COMPUTED_DISPLAY` — value derived by a deterministic rule from committed fields (e.g., label lookup from lineage value); rule is committed
- `PROHIBITED` — this variable may not be populated (applies to NONE-lineage identifiers in executive alias slots)

### 4.3 Signal Citation Requirements

Every narrative that references a signal value must cite it in this form:

> "The Structural Concentration Index for [Cluster Name] is [value] ([activation_state]), indicating [normalized_severity_label]."

The narrative must never:
- Report a signal value not present in the committed dpsig_signal_set.json
- Round, modify, or approximate a signal value without explicit citation
- Combine signal values into an aggregate without citing each component
- Use severity language that escalates beyond the committed severity_band

### 4.4 Cluster and Topology Citation Requirements

Every narrative that references a cluster must cite it as:
- By alias if ALI-01 applies (cluster has business label + readiness is EXECUTIVE_READY or EXECUTIVE_READY_WITH_QUALIFIER)
- By raw cluster_id if ALI-06 applies (readiness is DIAGNOSTIC_ONLY or worse)
- By structural label if ALI-05 applies (no alias defined)

Every topology claim (e.g., "this cluster contains N nodes") must cite `canonical_topology.json` → `cluster_id` → `node_count`.

### 4.5 Readiness-State Inheritance

The narrative inherits its rendering mode from the readiness state. This inheritance is not overridable:

```
readiness_state = EXECUTIVE_READY
  → executive_rendering_allowed = true
  → narrative_mode = EXECUTIVE_READY
  → full aliasing + business attribution permitted

readiness_state = EXECUTIVE_READY_WITH_QUALIFIER
  → executive_rendering_allowed = true
  → narrative_mode = EXECUTIVE_READY (qualified)
  → qualifier banner Q-01 appended to output

readiness_state = DIAGNOSTIC_ONLY
  → executive_rendering_allowed = false
  → narrative_mode = DIAGNOSTIC_ONLY
  → structural labels only; no business attribution

readiness_state = SUPPRESSED_FROM_EXECUTIVE
  → executive_rendering_allowed = false
  → narrative_mode = STRUCTURAL_LABELS_ONLY
  → raw identifiers; no inference

readiness_state = BLOCKED_PENDING_DOMAIN_GROUNDING
  → executive_rendering_allowed = false
  → narrative_mode = STRUCTURAL_LABELS_ONLY
  → raw identifiers; grounding gap explicitly stated
```

If `inference_prohibition = True` (as in FastAPI), narrative generation is blocked regardless of readiness_state. No LLM invocation occurs.

### 4.6 Grounding Lineage Inheritance

The narrative inherits its language authority from the per-domain grounding lineage. This produces a per-narrative attribution map:

```json
{
  "DOMAIN-01": { "lineage": "EXACT", "alias": "Edge Data Acquisition", "language_authority": "full attribution" },
  "DOMAIN-10": { "lineage": "STRONG", "alias": "Platform Infrastructure and Data", "language_authority": "qualified attribution" },
  "DOMAIN-11": { "lineage": "PARTIAL", "alias": "Event-Driven Architecture", "language_authority": "soft attribution — validate with engineering" },
  "DOMAIN-02": { "lineage": "NONE", "alias": null, "language_authority": "structural label only" }
}
```

The LLM receives this map as part of the injected evidence. It must use only the language authority level for each domain. Violating this by claiming stronger attribution than the lineage permits is a narrative governance violation.

### 4.7 Evidence Object Schema

The complete evidence object injected into each narrative prompt:

```json
{
  "narrative_evidence_version": "1.0",
  "client_id": "<client_id>",
  "run_id": "<run_id>",
  "evidence_assembled_at": "<ISO-8601 timestamp>",
  "readiness": {
    "readiness_state": "EXECUTIVE_READY",
    "executive_rendering_allowed": true,
    "max_cluster_name": "backend_modules",
    "source_artifact": "artifacts/dpsig/..."
  },
  "signals": [
    {
      "signal_id": "DPSIG-031",
      "signal_value": 2.1176,
      "activation_state": "CLUSTER_PRESSURE_ELEVATED",
      "severity_band": "ELEVATED",
      "signal_stable_key": "...",
      "source_artifact": "artifacts/dpsig/.../dpsig_signal_set.json",
      "field_path": "signals[0]"
    }
  ],
  "topology": [
    {
      "cluster_id": "DOM-09",
      "name": "backend_modules",
      "node_count": 6,
      "alias": "Operational Intelligence",
      "alias_permitted": true,
      "source_artifact": "clients/.../vault/canonical_topology.json"
    }
  ],
  "domain_attribution_map": [
    {
      "domain_id": "DOMAIN-01",
      "alias": "Edge Data Acquisition",
      "lineage": "EXACT",
      "language_authority": "full attribution",
      "alias_permitted": true
    }
  ],
  "narrative_mode": "EXECUTIVE_READY",
  "applicable_qualifier": "Q-00",
  "applicable_aliasing_rules": ["ALI-01", "ALI-02"],
  "terminology_normalization_active": true
}
```

### 4.8 Prohibited Evidence Patterns

| Pattern | Prohibition |
|---|---|
| Injecting a value not present in committed artifacts | FORBIDDEN — evidence binding is direct field only |
| Computing an aggregate from uncommitted intermediate state | FORBIDDEN — aggregation must use committed fields or be declared as COMPUTED_DISPLAY |
| Injecting historical data not from a committed run artifact | FORBIDDEN — no invented baselines |
| Inferring a domain's business identity from adjacent domains | FORBIDDEN — lineage is per-domain; no inheritance by proximity |
| Omitting the grounding constraints from the evidence object | FORBIDDEN — prompt must include language authority map |
| Injecting evidence from non-canonical client paths | FORBIDDEN — UUID-named client directories are non-canonical |

---

## 5. Prompt Governance Model

### 5.1 Prompt Template Architecture

Prompts that drive narrative generation are governed artifacts. They are not ad-hoc text. A governed prompt template has:

1. A unique identifier: `narrative-template-<type>-<mode>-v<major>.<minor>`
2. A committed location in the repository
3. Declared input variables (each bound to evidence fields)
4. Declared output constraints (what the LLM is permitted to assert)
5. A system prompt section (governance rules the LLM must follow)
6. A user prompt section (evidence injection + query)

Template types:
- `cluster-pressure-summary` — summarizes a single cluster's pressure state
- `topology-risk-narrative` — executive risk narrative for full topology
- `escalation-trace` — explains propagation from one domain to another
- `remediation-suggestion` — bounded remediation framing
- `comparative-analysis` — compares two committed run snapshots
- `governance-summary` — summarizes readiness state and constraints

Template modes (per readiness state):
- `-executive` — for EXECUTIVE_READY / EXECUTIVE_READY_WITH_QUALIFIER
- `-diagnostic` — for DIAGNOSTIC_ONLY
- `-structural` — for STRUCTURAL_LABELS_ONLY / BLOCKED_PENDING_DOMAIN_GROUNDING
- (no template for INFERENCE_PROHIBITED — generation is blocked entirely)

Example template identifier: `narrative-template-cluster-pressure-summary-executive-v1.0`

### 5.2 Committed Prompt Repository

All production prompt templates are committed to:

```
docs/psee/PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01/prompts/
  narrative-template-cluster-pressure-summary-executive-v1.0.md
  narrative-template-topology-risk-narrative-executive-v1.0.md
  narrative-template-escalation-trace-executive-v1.0.md
  narrative-template-remediation-suggestion-executive-v1.0.md
  narrative-template-cluster-pressure-summary-diagnostic-v1.0.md
  (etc.)
```

Rules:
1. Production narrative generation must reference a committed template by identifier
2. Template identifiers are immutable — a changed template requires a new version identifier
3. No production narrative generation may use an uncommitted (ad-hoc) prompt
4. Template modification requires a prompt governance stream, not an in-session edit

### 5.3 Prompt Lineage

A prompt lineage record captures:

```json
{
  "lineage_id": "<uuid>",
  "template_id": "narrative-template-cluster-pressure-summary-executive-v1.0",
  "template_commit_hash": "...",
  "evidence_object_hash": "sha256:...",
  "readiness_state": "EXECUTIVE_READY",
  "narrative_mode": "EXECUTIVE_READY",
  "generation_timestamp": "2026-05-08T...",
  "model_id": "claude-sonnet-4-6",
  "output_hash": "sha256:..."
}
```

This record enables: "given this evidence object and this template, who could reproduce this narrative?"

### 5.4 Exploratory vs. Governed Production Prompts

| Characteristic | Exploratory | Governed Production |
|---|---|---|
| Template | Ad-hoc | Committed, versioned |
| Evidence binding | Partial or manual | Mandatory, complete |
| Lineage capture | Not required | Mandatory |
| Replay eligibility | NO | YES (evidence-identical) |
| Output status | Session artifact only | Governed artifact (if captured) |
| Use case | Development, testing, investigation | Executive LENS surface, audit trail |
| Allowed in production | NO | YES |

Exploratory prompts are permitted during development streams. They must not reach the executive surface or be cited as governed outputs.

### 5.5 Prompt Audit Schema

Each production prompt invocation produces an audit record:

```json
{
  "audit_record_version": "1.0",
  "invocation_id": "<uuid>",
  "template_id": "...",
  "template_commit": "...",
  "evidence_sources": [
    { "artifact": "...", "hash": "..." }
  ],
  "narrative_mode": "EXECUTIVE_READY",
  "readiness_state_at_invocation": "EXECUTIVE_READY",
  "aliasing_rules_applied": ["ALI-01", "ALI-02"],
  "qualifier_applied": "Q-00",
  "generation_timestamp": "...",
  "output_length_tokens": 312,
  "governance_compliance": "PASS"
}
```

### 5.6 Forbidden Prompt Mutations

| Mutation | Prohibition |
|---|---|
| Altering evidence values in a prompt at runtime | FORBIDDEN — evidence injection is read-only from committed sources |
| Switching narrative mode to override readiness_state | FORBIDDEN — mode is gate-determined |
| Injecting instructions that expand language authority | FORBIDDEN — system prompt cannot override grounding lineage |
| Chaining prompts that cause cumulative semantic escalation | FORBIDDEN — each prompt in a chain resets to the grounding constraints |
| Including uncommitted session context as evidence | FORBIDDEN — evidence is committed artifacts only |
| Bypassing the system prompt governance section | FORBIDDEN — governance rules must precede every user prompt |

---

## 6. Narrative Replayability

### 6.1 The Core Distinction

Structural replay (L1–L2) is bit-identical: the same inputs to the same deterministic scripts produce the same outputs. This is testable with a hash comparison.

Narrative replay (L4) is evidence-identical: the same evidence object injected into the same prompt template produces narratives with equivalent evidence citations, equivalent attribution scope, and equivalent constraint application — though the exact prose may differ.

**Bit-identity is NOT the standard for narrative replay. Evidence-identity IS.**

### 6.2 Narrative Replay Contract

A narrative replay is valid if and only if:

1. The same evidence object (same artifact hashes) is used
2. The same committed prompt template (same template identifier and commit hash) is used
3. The same readiness state, narrative mode, and grounding constraints are applied
4. The generated narrative cites the same evidence fields
5. The generated narrative respects the same attribution constraints (no domain cited at a higher confidence level than its lineage permits)

A narrative replay is INVALID if:
- Evidence artifact hashes differ from the original invocation
- A different template version is used
- Attribution constraints are not applied consistently
- The narrative cites evidence fields not present in the original evidence object

### 6.3 What Must Replay Identically

| Element | Replay Requirement |
|---|---|
| Evidence artifact hashes | IDENTICAL — same committed artifacts |
| Template identifier + commit hash | IDENTICAL — same committed template |
| Readiness state | IDENTICAL — gate output does not change unless topology changes |
| Narrative mode | IDENTICAL — derived from readiness state |
| Attribution map | IDENTICAL — same grounding lineage → same permissions |
| Terminology normalization table | IDENTICAL — committed, versioned |
| Qualifier taxonomy entry | IDENTICAL — Q-XX is state-determined |

### 6.4 What May Vary

| Element | Variation Permitted |
|---|---|
| Exact prose wording | YES — LLM output is not bit-deterministic |
| Sentence structure | YES — within the evidence constraints |
| Analogy or explanatory framing | YES — interpretation is stylistic |
| Response length | YES — within declared token bounds |

### 6.5 Replay Equivalence Definition

Two narratives are replay-equivalent if:
1. Every quantitative claim in both cites the same source field and value
2. Every attribution claim in both uses at most the same language authority level
3. Both are in the same narrative mode
4. Both apply the same qualifier taxonomy entry
5. No claim in either narrative is absent from the evidence object used to generate it

Replay equivalence is testable by automated evidence citation extraction — not by prose comparison.

### 6.6 Narrative Replay Taxonomy

| Replay Type | Identity Guarantee | Verification Method |
|---|---|---|
| Evidence identity | Same committed artifacts | Artifact hash comparison |
| Template identity | Same committed template | Template ID + commit hash |
| Mode identity | Same readiness state | Gate output comparison |
| Constraint identity | Same attribution map | Grounding lineage comparison |
| Output equivalence | Evidence-identical citations | Citation extraction + comparison |
| Bit-identity (prose) | NOT GUARANTEED | N/A — not required |

---

## 7. Executive Narrative Modes

### 7.1 Mode Matrix

Narrative mode is derived from readiness state. It is not a user-selectable option.

#### Mode 1 — EXECUTIVE_READY

**Trigger:** `readiness_state IN [EXECUTIVE_READY, EXECUTIVE_READY_WITH_QUALIFIER]`

| Dimension | Permitted | Prohibited |
|---|---|---|
| Language authority | Full business attribution for EXACT/STRONG-lineage domains; qualified for PARTIAL | Attribution beyond lineage; invented business names |
| Semantic projection | Aliasing per ALI-01..04 | Aliasing NONE-lineage domains (ALI-05) |
| Aliasing permissions | Cluster aliases where defined; domain aliases where lineage >= PARTIAL | Raw DPSIG identifiers in executive prose (use normalized terminology) |
| Qualifier banners | Q-00 (no banner) for EXECUTIVE_READY; Q-01 banner for EXECUTIVE_READY_WITH_QUALIFIER | Omitting Q-01 banner when readiness = EXECUTIVE_READY_WITH_QUALIFIER |
| Confidence calibration | Certainty language for EXACT; hedged language for STRONG; explicit caveat for PARTIAL | Certainty language for PARTIAL or below |

**System prompt requirement for this mode:**
```
You are generating an executive-level structural intelligence narrative.
All claims must cite the evidence fields provided.
Use business names for domains with alias_permitted=true.
Apply the qualifier level stated in the attribution map for each domain.
Do not invent signal values, topology relationships, or historical comparisons.
Do not use certainty language ("definitely", "certainly", "will") for PARTIAL-lineage domains.
```

#### Mode 2 — DIAGNOSTIC_ONLY

**Trigger:** `readiness_state = DIAGNOSTIC_ONLY`

| Dimension | Permitted | Prohibited |
|---|---|---|
| Language authority | Structural description; engineering-level analysis | All business attribution; no domain business names |
| Semantic projection | None — structural labels only | Any alias application |
| Aliasing permissions | None — raw cluster_id, domain_id | All ALI-01..04 aliases |
| Qualifier banners | Q-02 banner: "Structural Diagnostic Mode — engineering use only" | Omitting Q-02 banner |
| Confidence calibration | Structural confidence only; topology facts only | Confidence language implying business relevance |

**System prompt requirement for this mode:**
```
You are generating a structural diagnostic narrative for engineering review only.
This client has not been cleared for executive rendering.
Use only structural labels (e.g., "CLU-17", "src", "cluster_id").
Do not use business domain names or organizational language.
Do not imply business risk — describe structural topology only.
All claims must cite the evidence fields provided.
```

#### Mode 3 — STRUCTURAL_LABELS_ONLY

**Trigger:** `readiness_state IN [SUPPRESSED_FROM_EXECUTIVE, BLOCKED_PENDING_DOMAIN_GROUNDING]`

| Dimension | Permitted | Prohibited |
|---|---|---|
| Language authority | Raw structural identifiers; topology facts | Business attribution; organizational language; confidence language |
| Semantic projection | None | All aliasing; all normalization |
| Aliasing permissions | None | All |
| Qualifier banners | Q-03 (SUPPRESSED) or Q-04 (BLOCKED_PENDING_DOMAIN_GROUNDING) | Omitting qualifier banner |
| Confidence calibration | No confidence language at all | Any confidence or certainty language |

**System prompt requirement for this mode:**
```
You are generating a minimal structural description.
This client's domain grounding is not yet complete.
Use only raw identifiers. Do not apply any business language.
State that domain grounding must be completed before executive analysis is available.
All claims must cite the evidence fields provided.
```

#### Mode 4 — INFERENCE_PROHIBITED

**Trigger:** `inference_prohibition = True` (regardless of readiness_state)

| Dimension | State |
|---|---|
| LLM invocation | BLOCKED — no narrative generated |
| Output | Error state: "Narrative generation blocked — inference_prohibition=True" |
| Evidence display | Structural facts may be displayed directly (no LLM) |
| Aliasing | None |

This mode applies to FastAPI at the governed baseline. No narrative is generated for any FastAPI cluster or domain under the current governance state.

### 7.2 Safety Containment Summary

The narrative mode matrix is the primary executive safety containment mechanism. It ensures:
- An executive never receives a DIAGNOSTIC_ONLY client's output framed as executive-ready
- An engineer never receives suppressed output without a clear suppression notice
- A FastAPI-equivalent client never receives LLM-generated interpretation

The mode cannot be overridden by user request, product configuration, or prompt instruction. It is derived from the committed readiness gate output.

---

## 8. Cognitive Projection Integration

### 8.1 Cognitive Rendering Pipeline

Cognitive projection normalization occurs at Stage 7 — after the LLM generates its raw output and before final rendering. It is deterministic.

```
Raw LLM Output
    ↓
Terminology Normalization Pass
    (replace raw technical labels with normalized forms per 17-term table)
    ↓
Aliasing Pass
    (replace any residual raw identifiers with aliases per ALI-01..07)
    ↓
Qualifier Banner Injection
    (prepend Q-XX banner if readiness state requires it)
    ↓
Evidence Citation Attachment
    (append or inline evidence source references)
    ↓
Normalized Narrative Output
```

### 8.2 Terminology Normalization Governance

The 17-term normalization table (from `projection_aliasing_taxonomy.json`) applies in all EXECUTIVE_READY and EXECUTIVE_READY_WITH_QUALIFIER narratives. In DIAGNOSTIC_ONLY and STRUCTURAL_LABELS_ONLY modes, normalization is suppressed (raw labels are appropriate for engineering audiences).

| Raw Term | Normalized Form | Application Layer |
|---|---|---|
| CLUSTER_PRESSURE_HIGH | High Structural Concentration | L3 prose only |
| CLUSTER_PRESSURE_ELEVATED | Elevated Structural Concentration | L3 prose only |
| Cluster Pressure Index | Structural Concentration Index | L3 prose only |
| Cluster Fan Asymmetry | Structural Distribution Ratio | L3 prose only |
| COMPOUND_ZONE | Compound Pressure Zone | L3 prose only |
| PROPAGATION_ZONE | Propagation Risk Zone | L3 prose only |
| NULL_TOPOLOGY | No Cluster Concentration Detected | L3 prose only |
| FILESYSTEM_CONTAINER_DOMINANCE | Ungrounded Container Concentration | L2 diagnostic notice |
| EXECUTIVE_READY_WITH_QUALIFIER | Qualified Executive View | L2 qualifier banner |
| BLOCKED_PENDING_DOMAIN_GROUNDING | Domain Verification Required | L2 qualifier banner |

(Full 17-term table in `projection_aliasing_taxonomy.json`)

The normalization pass runs after LLM output — not during it. The LLM may use raw terms internally; the normalization pass converts them before executive display.

### 8.3 Aliasing Rules Applied to Narrative

The ALI rules translate directly into narrative generation constraints:

| Rule | Narrative Implementation |
|---|---|
| ALI-01 | If cluster has alias AND mode = EXECUTIVE_READY: use `{alias} ({raw_id})` in narrative text |
| ALI-02 | If domain lineage = EXACT AND mode = EXECUTIVE_READY: use `{business_label} ({dom_id})` without qualifier |
| ALI-03 | If domain lineage = STRONG AND mode = EXECUTIVE_READY: use `{business_label} ({dom_id})` with soft qualifier ("likely", "appears to") |
| ALI-04 | If domain lineage = PARTIAL AND mode = EXECUTIVE_READY: use `{business_label} ({dom_id}) †` with explicit validation note |
| ALI-05 | If domain lineage = NONE: use structural label only regardless of mode |
| ALI-06 | If mode = DIAGNOSTIC_ONLY or STRUCTURAL_LABELS_ONLY: use raw identifier only for all entities |
| ALI-07 | If inference_prohibition = True: LLM not invoked; no narrative generated |

These rules are injected into the prompt's evidence object and into the system prompt governance section. They are not left to the LLM to infer.

### 8.4 Qualifier Taxonomy in Narrative

Qualifier banners are prepended to narrative output, not embedded within it. They frame the entire narrative for the reader:

| Qualifier | State | Banner Text |
|---|---|---|
| Q-00 | EXECUTIVE_READY | (no banner — clean executive output) |
| Q-01 | EXECUTIVE_READY_WITH_QUALIFIER | "Partial domain grounding — validate with engineering" |
| Q-02 | DIAGNOSTIC_ONLY | "Structural Diagnostic Mode — engineering use only" |
| Q-03 | SUPPRESSED_FROM_EXECUTIVE | "Suppressed from executive view" |
| Q-04 | BLOCKED_PENDING_DOMAIN_GROUNDING | "Domain verification required before executive projection" |

### 8.5 Grounding-Aware Language Rules

The system prompt section governing language authority is the mechanism that prevents the LLM from exceeding its attribution permissions. It is populated from the evidence object's domain_attribution_map.

System prompt section template:
```
GROUNDING-AWARE LANGUAGE RULES (apply to ALL domains in this response):

For each domain listed below, use ONLY the language authority specified:

  DOMAIN-01 (Edge Data Acquisition): FULL ATTRIBUTION — use business name freely
  DOMAIN-10 (Platform Infrastructure and Data): QUALIFIED ATTRIBUTION — use "likely" or "appears to"
  DOMAIN-11 (Event-Driven Architecture †): SOFT ATTRIBUTION — append "(validate with engineering)"
  DOMAIN-02: STRUCTURAL LABEL ONLY — use "DOMAIN-02" only; do not infer business context
  ...

Do not use stronger attribution language than specified.
Do not infer business context for STRUCTURAL LABEL ONLY entries.
```

This section is generated deterministically from the grounding lineage and injected before any user-facing query.

---

## 9. Narrative Safety Boundaries

### 9.1 Permanent Narrative Safety Rules

The following rules are permanent. They apply to every narrative invocation, every template, every mode.

**N-SAF-01 — No Invented Values**
Every numeric claim in a narrative must correspond to a field in the injected evidence object. The LLM may not produce a number that is not present in the evidence object. This includes pressure scores, node counts, confidence values, signal values, and any derived metrics.

**N-SAF-02 — No Invented Topology**
Every structural relationship claim (e.g., "Domain X connects to Domain Y") must be derivable from the binding_envelope.json edges committed to the repository. The LLM may not infer structural connections that are not present in the evidence.

**N-SAF-03 — No Invented History**
Every historical comparison ("pressure has increased since...") must cite a specific committed run artifact as the historical baseline. There is no default historical baseline. If no committed historical artifact is provided, the LLM must state that historical comparison is not available.

**N-SAF-04 — No Pressure Fabrication**
Pressure claims must cite specific DPSIG-031 or DPSIG-032 values. The LLM may not assert that a cluster "is under pressure" without citing the signal value, activation state, and severity band from the committed dpsig_signal_set.json.

**N-SAF-05 — No Implied Certainty Beyond Evidence**
Language authority is bounded by grounding confidence. PARTIAL-lineage domains may not receive certainty language. NONE-lineage domains may not receive attribution language. The LLM must apply hedging proportional to the confidence level in the attribution map.

**N-SAF-06 — No Attribution Beyond Grounding**
The LLM may not reason about a NONE-lineage domain's business function, organizational role, or strategic importance. These require domain grounding. Structural topology facts (node count, cluster_id, fan asymmetry) are permitted for NONE-lineage domains; business interpretation is not.

**N-SAF-07 — No Semantic Drift**
The narrative must not introduce interpretive frames that are not present in the evidence or explicitly enabled by the prompt template. Examples of semantic drift: introducing team accountability language for a structural cluster, implying technical debt without structural evidence, attributing pressure to organizational decisions not reflected in topology.

**N-SAF-08 — No Narrative-Only Escalation**
A narrative may not claim that a finding requires executive action without that finding being reflected in the signal data. The LLM may not escalate a NOMINAL finding to CRITICAL through narrative framing. Signal values are authoritative; narrative framing cannot override them.

**N-SAF-09 — No Hidden Business Inference**
A NONE-lineage domain may not acquire business meaning through proximity to an EXACT-lineage domain in the same narrative. Attribution is per-domain and non-transitive. The LLM may not write "Domain Y, adjacent to Edge Data Acquisition, likely handles..." when Domain Y has NONE lineage.

**N-SAF-10 — No Invented Remediation Causality**
Remediation suggestions must be framed as possibilities based on the structural evidence, not as diagnoses. The LLM may not claim "the pressure is caused by X" without structural evidence of X. It may claim "the concentration of N nodes in this cluster may indicate X, warranting investigation."

### 9.2 Prohibited Narrative Patterns

| Prohibited Pattern | Example | Violation |
|---|---|---|
| Invented metric | "The risk score is 7.3 out of 10" | N-SAF-01 |
| Invented edge | "Domain X feeds Domain Y's processing" | N-SAF-02 |
| Invented history | "This cluster has grown significantly over the past quarter" | N-SAF-03 |
| Uninvited pressure escalation | "This is a critical organizational risk" (for ELEVATED, not CRITICAL finding) | N-SAF-04, N-SAF-08 |
| Confidence inflation | "The Platform Infrastructure domain is definitely responsible" (STRONG lineage) | N-SAF-05 |
| NONE-lineage attribution | "The Analytics domain appears to own the forecasting pipeline" | N-SAF-06 |
| Organizational inference | "The team responsible for this cluster is likely under-resourced" | N-SAF-07 |
| Remediation causality | "You should restructure the backend team to fix this" | N-SAF-10 |
| Proximity attribution | "Domain-05, near Edge Data Acquisition, probably handles..." | N-SAF-09 |
| Implied executive urgency without signal | "This requires immediate executive attention" (for NOMINAL finding) | N-SAF-08 |

### 9.3 Governance Enforcement Controls

| Control | Implementation |
|---|---|
| Evidence binding enforcement | Prompt construction layer injects evidence object; system prompt requires citation |
| Value fabrication prevention | Evidence object schema declares all permitted numeric values; system prompt prohibits others |
| Mode enforcement | Narrative mode is set before LLM invocation; system prompt includes mode-specific constraints |
| Attribution map enforcement | Per-domain language authority injected into system prompt; not left to LLM inference |
| Post-generation audit | Automated extraction of all numeric claims and identifier references; compared against evidence object |
| Replay lineage capture | Prompt lineage record created for every production invocation |
| Template governance | Only committed templates permitted in production; ad-hoc detection via template registry check |

---

## 10. LENS Narrative Evolution

### 10.1 LENS Narrative Roadmap

LENS evolves from static deterministic reports toward interactive explainable executive intelligence across five phases.

**Phase 1 — Explainable Signals (immediate)**

Each signal in the LENS report gains an on-demand explanation:
- User clicks/taps a signal → governed narrative explains the finding
- Narrative cites: signal_value, activation_state, severity_band, node context
- No new evidence required — signals already carry derivation_trace
- Narrative mode: derived from client readiness state
- Template: `narrative-template-cluster-pressure-summary-{mode}-v1.0`
- Replay: evidence-identical from committed dpsig_signal_set.json

Governance gate: executive_rendering_allowed must be true for executive explanation mode.

**Phase 2 — Dynamic Narrative Sections**

LENS reports gain structured narrative sections alongside the deterministic signal panels:
- "Executive Summary" section — generated from full evidence object
- "Cluster Intelligence" section — per-cluster narrative using CPI + CFA + topology
- "Structural Distribution" section — explains CFA finding in normalized terminology
- Sections are generated at report-time, not cached (or cached with evidence hash validation)
- Template: `narrative-template-topology-risk-narrative-executive-v1.0`

Governance gate: same as Phase 1; qualifier banners rendered per Q-XX taxonomy.

**Phase 3 — Topology-Aware Questioning**

LENS gains a structured query interface for executive topology investigation:
- "Why is this cluster flagged?" → `escalation-trace` template
- "What is the structural distribution ratio?" → normalized CFA explanation
- "Which domains have the highest concentration?" → ranked topology summary
- Questions are predefined (templated), not free-form
- Each question answer is evidence-bound and replay-captured

Governance gate: predefined question set only; no free-form executive input in Phase 3.

**Phase 4 — Executive Copilot Interaction**

LENS gains a bounded conversational interface:
- Multi-turn session with evidence-bounded context
- Executive may ask follow-up questions within the session
- Session memory is bounded to committed run evidence (no cross-run inference unless committed snapshots provided)
- Each session produces a prompt lineage record
- Governed prompt: free-form user input, but system prompt constrains LLM scope to evidence object

Governance gate: session context is evidence-bounded; executive rendering requires executive_rendering_allowed = true for the active client.

**Phase 5 — Replay-Safe Narrative Sessions**

LENS gains the ability to capture, version, and replay executive narrative sessions:
- Named sessions: "Architecture Review — 2026-Q2"
- Session artifact includes: evidence hashes, prompt template versions, narrative lineage records
- Session can be replayed with same evidence to produce equivalent narrative
- Session artifact is a governed artifact (committed to docs/ or artifact store)

Governance gate: session replay requires original evidence artifacts to be still committed; deleted runs produce an "evidence artifact not available" state.

### 10.2 Narrative Maturity Model

| Maturity Level | Capability | Governance Requirements |
|---|---|---|
| L0 — Static | Current LENS: deterministic reports, no narrative | Baseline (already achieved) |
| L1 — Explainable | On-demand signal explanations | Prompt governance + evidence injection engine |
| L2 — Narrative | Dynamic narrative report sections | Template registry + cognitive normalization engine |
| L3 — Interactive | Structured topology questioning | Predefined query templates + replay capture |
| L4 — Conversational | Bounded executive copilot | Session governance + evidence-bound context |
| L5 — Persistent | Replay-safe named sessions | Session artifact governance + versioned evidence snapshots |

### 10.3 Executive Interaction Evolution

The executive experience evolves from:

> "Here is your deterministic structural pressure report."

Through:

> "Here is your structural pressure report. Click any signal for an evidence-bound explanation."

To:

> "Your structural intelligence platform — ask me to explain any finding, trace any escalation, or compare this run to a prior state. Every answer is grounded in your committed codebase topology."

At every stage, the deterministic foundation is unchanged. The AI layer adds explanation, not authority.

---

## 11. Implementation Strategy

### 11.1 Stream Dependency Map

```
GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md (THIS DOCUMENT)
    ↓
PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.*
    Creates prompt template registry, template versioning, commit structure
    ↓
PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.*
    Builds evidence assembly engine (reads committed artifacts → evidence object)
    ↓
PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.*
    Implements terminology normalization + aliasing post-processing pass
    ↓
PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.*
    Builds readiness-gated rendering layer (mode assignment + qualifier banners)
    ↓
PI.AGENTIC.NARRATIVE.REPLAY-LINEAGE.*
    Implements lineage capture + replay equivalence verification
    ↓
PI.AGENTIC.NARRATIVE.TOPOLOGY-QUESTIONING.*
    Builds predefined topology query templates + Phase 3 interaction surface
```

### 11.2 Implementation Stream Classification

| Stream Family | Classification | Key Governance Prerequisite |
|---|---|---|
| PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.* | PRODUCTION_SAFE | This foundation document |
| PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.* | PRODUCTION_SAFE | Prompt governance stream complete; evidence object schema locked |
| PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.* | PRODUCTION_SAFE | Evidence injection complete; ALI-01..07 locked (already are) |
| PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.* | PRODUCTION_SAFE | Readiness gate integration confirmed; mode matrix locked (this doc) |
| PI.AGENTIC.NARRATIVE.REPLAY-LINEAGE.* | PRODUCTION_SAFE | Lineage schema locked (this doc); evidence injection complete |
| PI.AGENTIC.NARRATIVE.TOPOLOGY-QUESTIONING.* | PRODUCTION_SAFE | Rendering + normalization complete; predefined query templates committed |
| PI.AGENTIC.NARRATIVE.FREE-FORM-COPILOT.* | EXPERIMENTAL | Requires session governance contract + bounded memory governance |
| PI.AGENTIC.NARRATIVE.PERSISTENT-SESSIONS.* | EXPERIMENTAL | Requires named session artifact governance + versioned run snapshots |
| PI.AGENTIC.NARRATIVE.CROSS-RUN-COMPARISON.* | EXPERIMENTAL | Requires committed historical run artifacts; no invented baselines |

### 11.3 Governance Prerequisite Matrix

| Prerequisite | Required Before |
|---|---|
| This foundation document | All narrative streams |
| Prompt governance stream complete | Evidence injection stream |
| Evidence injection stream complete | Cognitive normalization, rendering streams |
| Mode matrix locked (this doc) | All rendering work |
| Cognitive normalization complete | Executive rendering |
| All four Phase 2 streams complete | Phase 3 (topology questioning) |
| Phase 3 complete | Phase 4 (copilot) — experimental gate |
| Bounded memory governance contract | Persistent sessions — experimental gate |
| Historical run artifacts committed | Cross-run comparison — per-client gate |

### 11.4 Production Readiness Classification

PRODUCTION_SAFE streams may proceed to implementation immediately after their prerequisite streams complete.

EXPERIMENTAL streams require an additional safety contract before moving to implementation. The safety contract must define:
- Session boundary model (where does session context start/end)
- Persistent memory governance (what persists, where, with what lineage)
- Cross-run evidence governance (which historical artifacts are authoritative)

GOVERNANCE_RESTRICTED: none in this stream — no narrative stream is currently governance-restricted beyond the EXPERIMENTAL gate.

---

## 12. Governance Verdict

### 12.1 Verdict Matrix

| Dimension | Verdict | Basis |
|---|---|---|
| Replay safety | PASS | Evidence-identical replay defined; structural/semantic replay types distinguished; lineage schema defined |
| Executive safety | PASS | Four narrative modes; inference_prohibition honored; DIAGNOSTIC_ONLY blocks all aliasing |
| Governance integrity | PASS | All locked truths inherited; semantic governance closure honored; no semantic authority reopened |
| Commercial viability | PASS | Five LENS evolution phases; executive copilot model; replay-safe narratives = enterprise audit trail |
| Enterprise trust impact | PASS | Every narrative claim is auditable; deterministic foundation unchanged; full evidence citation visible |
| Explainability quality | PASS | Evidence binding + cognitive normalization = explanations that are structurally faithful and executive-readable |
| Structural sovereignty preservation | PASS | L1–L2 permanently read-only for narrative layer; signal values never contradicted by narrative |

### 12.2 Critical Required Conclusion Confirmed

> **Narratives explain structural intelligence. Narratives do NOT generate structural truth.**

This is enforced at every stage of the architecture:
- Stage 5 (Evidence Injection): LLM receives only structured, cited inputs
- Stage 6 (Narrative Synthesis): LLM explains evidence; it does not decide it
- Stage 7 (Cognitive Normalization): post-processing is rule-based, not probabilistic
- Safety rules N-SAF-01..10: every form of truth fabrication is permanently prohibited
- Narrative mode matrix: rendering authority is gate-determined, not user-selectable

### 12.3 Path Forward

**GOVERNED_NARRATIVE_INTELLIGENCE_VIABLE — PI.AGENTIC.NARRATIVE-GENERATION.* stream family authorized to proceed.**

Immediate next streams (Phase 2 — production-safe):
1. PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.* — first implementation stream
2. PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.* — second implementation stream
3. PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.*
4. PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.*
5. PI.AGENTIC.NARRATIVE.REPLAY-LINEAGE.*
6. PI.AGENTIC.NARRATIVE.TOPOLOGY-QUESTIONING.*

These six streams produce the complete governed narrative intelligence layer for LENS Phase 1 and Phase 2.

---

## 13. Validation

| Check | Result | Evidence |
|---|---|---|
| Deterministic sovereignty preserved | PASS | L1–L2 read-only for narrative; signal values never contradicted |
| Evidence injection explicit | PASS | Evidence object schema defined; field-level binding model; mandatory sources listed |
| Prompt governance explicit | PASS | Template versioning; committed repo location; audit schema; exploratory vs governed distinction |
| Replay model explicit | PASS | Two replay types; evidence-identical contract; replay equivalence definition; taxonomy |
| Readiness gating preserved | PASS | Mode matrix derived from gate output; inference_prohibition honored (Mode 4) |
| Narrative authority bounded | PASS | Four modes; N-SAF-01..10; prohibited pattern table; attribution map enforcement |
| Semantic confidence calibration enforced | PASS | Per-domain language authority map; ALI-01..07 translated to narrative rules |
| Cognitive projection integrated | PASS | 9-stage pipeline; terminology normalization; qualifier banners; grounding-aware language rules |
| Implementation roadmap defined | PASS | 9 stream families; 5-phase LENS evolution; dependency map; governance prerequisite matrix |
| No semantic authority escalation | PASS | NONE-lineage structural labels only; proximity attribution prohibited (N-SAF-09); mode blocks escalation |

**10/10 PASS — GOVERNED_NARRATIVE_INTELLIGENCE_VIABLE**

---

*End of document.*  
*Stream: PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Handoff: PI.AGENTIC.NARRATIVE-GENERATION.* stream family*
