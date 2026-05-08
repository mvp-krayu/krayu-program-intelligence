# Governed Executive Rendering Architecture

**Stream:** PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.01  
**Document type:** EXECUTIVE RENDERING ARCHITECTURE — AUTHORITATIVE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Mode:** GOVERNANCE_MODE  
**Parent foundation:** PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01  
**Prerequisites:** PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.01, PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01, PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.01

---

## 1. Executive Summary

This document defines the governed executive rendering architecture — the final layer that transforms governed, normalized structural intelligence into executive-facing surfaces, explainability panels, topology-aware narratives, and replay-safe board reporting.

The governing principle:

> **Executive rendering presents structural intelligence. It does NOT reinterpret structural truth.**

Executive rendering is the last mile of a deterministic pipeline that began at Layer 1 (Structural Topology). By the time intelligence reaches executive rendering, it has already passed:
- Evidence retrieval and sealing (Evidence Injection Architecture)
- Prompt governance and template versioning (Prompt Orchestration Architecture)
- LLM narrative synthesis within a bounded evidence envelope
- Cognitive normalization and terminology projection (Cognitive Normalization Architecture)

Executive rendering does not undo any of that governance. Its sole responsibility is safe, explainable, replay-faithful presentation of what the governed pipeline produced.

This document establishes:
- The complete executive rendering pipeline with authority transition boundaries
- Six executive surface modes with permission matrices
- Explainability architecture across four audience types
- Topology-aware narrative architecture with grounding-aware rendering rules
- Executive questioning model with evidence-bound interrogation governance
- Visualization governance with topology fidelity requirements
- Replay-safe executive sessions with interaction lineage
- Executive safety doctrine with permanent prohibited patterns
- Full implementation architecture blueprint

**Governance verdict:** PASS — GOVERNED_EXECUTIVE_RENDERING_VIABLE

---

## 2. Governance Inheritance Baseline

### 2.1 Governance Load Confirmation

```
GOVERNANCE LOAD VERIFIED:
- GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md: LOADED — additive lane doctrine, fail-closed rules
- pipeline_execution_manifest.json: LOADED — manifest authority
- STREAM_GOVERNANCE_LOAD_TEMPLATE.md: LOADED — stream discipline
- governance_baselines.json: LOADED — active baseline confirmed
- CLAUDE_GOVERNANCE_LOAD_RULE.md: LOADED — intelligence layer governance load rule
- AGENTIC_SEMANTIC_ORCHESTRATION_FOUNDATION.md: LOADED — 6-layer stack, LLM boundary
- GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md: LOADED — 9-stage pipeline, narrative modes
- GOVERNED_PROMPT_ORCHESTRATION_ARCHITECTURE.md: LOADED — prompt versioning, lineage
- GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md: LOADED — evidence object schema, fail-closed
- GOVERNED_COGNITIVE_NORMALIZATION_ARCHITECTURE.md: LOADED — normalization pipeline, Q-00..Q-04
- SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md: LOADED — semantic authority closure confirmed
- Active baseline: governed-dpsig-baseline-v1 (092e251) — CONFIRMED
```

### 2.2 Executive Rendering in the Full Stack

Executive rendering operates at **L5 (Cognitive Projection)** and **L6 (Executive Interaction)** of the governed 6-layer AI stack:

```
L1 — Structural Topology           ← IMMUTABLE FOUNDATION
L2 — Signal Derivation             ← IMMUTABLE DERIVATION (TAXONOMY-01)
L3 — Semantic Interpretation       ← CLOSED (SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md)
L4 — Agentic Orchestration         ← EVIDENCE_ADDITIVE propagation only
L5 — Cognitive Projection          ← Normalization complete; rendering begins here
L6 — Executive Interaction         ← THIS STREAM — surface modes, explainability, replay
```

Executive rendering receives from L5 a fully normalized, evidence-sealed, qualifier-applied narrative. It adds:
- Surface mode routing (which mode is this executive context?)
- Explainability panel binding (WHY, EVIDENCE, TRACE, etc.)
- Topology visualization governance
- Questioning adapter (for interrogation surfaces)
- Session lineage and replay capture

**Authority transition boundary:**  
Structural authority ends at L2. Executive presentation begins at L5. Between L2 and L5 is evidence-bound, rule-governed transformation — no new truth is introduced at any stage.

### 2.3 Inherited Locked Contracts

The following are LOCKED and may not be reopened by this stream:

| Contract | Locked artifact |
|----------|----------------|
| Executive Readiness Gate | `_classify_dpsig_readiness_state` — 5 states |
| TAXONOMY-01 replay fields | signal_value, activation_state, signal_stable_key, derivation_hash, derivation_trace |
| Cognitive normalization dictionary | 17-term table + ALI-01..07 + Q-00..Q-04 |
| Evidence object schema | DIRECT_FIELD / DERIVED_DETERMINISTIC / COMPUTED_DISPLAY / REPLAY_ANCHOR |
| Semantic authority | CLOSED — evidence-bound interpretation only |
| Qualifier taxonomy | Q-00 (no banner) through Q-04 (BLOCKED_PENDING_DOMAIN_GROUNDING) |

### 2.4 What Executive Rendering Adds

Executive rendering adds **presentation governance** only:
- Surface mode selection (which executive context applies)
- Explainability surface binding (making evidence visible on demand)
- Topology narrative rendering rules (cluster/propagation/pressure framing)
- Questioning governance (evidence-bound interrogation model)
- Visualization governance (topology fidelity, no distortion)
- Session lineage (replay-safe interaction capture)
- Executive safety enforcement (prohibited pattern detection at render time)

---

## 3. Executive Rendering Pipeline

### 3.1 Pipeline Overview

The complete executive rendering flow, from evidence artifact to executive surface:

```
STAGE 1: EVIDENCE RETRIEVAL
    └─ Load sealed evidence object (committed artifact)
    └─ Validate evidence_object_hash vs REPLAY_ANCHOR
    └─ Confirm readiness_state from evidence object

STAGE 2: READINESS GATE VALIDATION
    └─ Route to surface mode (§4 Executive Surface Modes)
    └─ Block rendering if readiness_state = SUPPRESSED_FROM_EXECUTIVE
    └─ Apply inference_prohibition gate if client mode = INFERENCE_PROHIBITED

STAGE 3: GROUNDING VALIDATION
    └─ Confirm grounding_lineage (EXACT / INFERRED / PARTIAL / UNRESOLVED / NONE)
    └─ Determine aliasing eligibility (ALI-01..07)
    └─ Confirm qualifier inheritance from cognitive normalization output

STAGE 4: QUALIFIER INHERITANCE
    └─ Load Q-00..Q-04 from normalization output
    └─ Apply qualifier banner to all surface sections
    └─ Confirm no qualifier omission for Q-01..Q-04 states

STAGE 5: COGNITIVE NORMALIZATION HANDOFF
    └─ Receive normalized narrative from GOVERNED_COGNITIVE_NORMALIZATION_ARCHITECTURE
    └─ Confirm all machine-native terms replaced (17-term dictionary applied)
    └─ Confirm citation block present with evidence_stable_key references

STAGE 6: NARRATIVE ASSEMBLY
    └─ Assemble rendering sections per surface mode
    └─ Bind explainability panel anchors (WHY, EVIDENCE, TRACE, QUALIFIERS, LINEAGE)
    └─ Apply topology narrative layer (cluster / propagation / pressure framing)

STAGE 7: EXECUTIVE RENDERING
    └─ Render surface mode output per §4 permission matrix
    └─ Apply visualization governance (§8)
    └─ Enforce executive safety boundaries (§10)

STAGE 8: EXPLAINABILITY BINDING
    └─ Attach WHY panel (evidence → conclusion chain)
    └─ Attach EVIDENCE panel (source artifact references)
    └─ Attach TRACE panel (derivation path from L1 → L6)
    └─ Attach QUALIFIERS panel (Q-state explanation)
    └─ Attach LINEAGE panel (commit chain, evidence hashes)
    └─ Attach CONFIDENCE panel (grounding-derived language authority)
    └─ Attach READINESS STATE panel (classification + block reason if applicable)

STAGE 9: REPLAY CAPTURE
    └─ Compute rendering_session_hash
    └─ Record rendering_lineage_record (§9 session lineage schema)
    └─ Store replay anchor: evidence_object_hash + normalization_rule_version + surface_mode
```

### 3.2 Authority Transition Boundaries

```
STRUCTURAL AUTHORITY ZONE (L1–L2):
  Input: raw topology + signal derivation
  Output: TAXONOMY-01 fields — signal_value, derivation_hash, activation_state
  Boundary: derivation_hash seals this zone — no downstream stage may mutate it

EVIDENCE AUTHORITY ZONE (L3–L4, pre-LLM):
  Input: TAXONOMY-01 fields + governance artifacts
  Output: sealed evidence object — all fields typed (DIRECT / DERIVED / COMPUTED / ANCHOR)
  Boundary: evidence_object_hash seals this zone — LLM receives; does not modify

LLM SYNTHESIS ZONE (L4, bounded):
  Input: sealed evidence object + governed prompt template
  Output: raw narrative text — evidence-bound but not bit-identical
  Boundary: LLM boundary — only zone where non-determinism is permitted

NORMALIZATION ZONE (L5):
  Input: raw LLM output + normalization rules
  Output: normalized narrative — presentation-deterministic
  Boundary: normalization_rule_version + evidence_object_hash → presentation replay identity

RENDERING ZONE (L6 — THIS STREAM):
  Input: normalized narrative + surface mode + explainability bindings
  Output: executive surface (BOARD_SUMMARY, EXECUTIVE_READY, etc.)
  Boundary: rendering_session_hash — seals session state for replay
```

**Principle:** Each zone seals its output. Downstream zones consume sealed outputs; they do not re-derive or re-interpret.

### 3.3 Rendering Execution Flow

```
Evidence Object (sealed, committed)
         │
         ▼
Readiness Gate → SUPPRESSED? → BLOCK (render suppression notice only)
         │                           │
    NOT SUPPRESSED            SUPPRESSED_FROM_EXECUTIVE:
         │                    render "Data exists. Readiness gate not met.
         ▼                    Domain grounding required."
Surface Mode Selection
         │
    ┌────┴────────────────────────────────┐
    │                                     │
INFERENCE_PROHIBITED               All other modes
(FastAPI client)                         │
    │                                     ▼
Render structural                  Qualifier Inheritance
data only; no narrative                  │
(STRUCTURAL_ONLY output)                 ▼
                                   Cognitive Normalization Handoff
                                         │
                                         ▼
                                   Narrative Assembly (§6)
                                         │
                                         ▼
                                   Explainability Panel Binding (§5)
                                         │
                                         ▼
                                   Visualization Layer (§8)
                                         │
                                         ▼
                                   Executive Safety Enforcement (§10)
                                         │
                                         ▼
                                   Replay Capture (§9)
                                         │
                                         ▼
                                   Executive Surface Output
```

---

## 4. Executive Surface Modes

### 4.1 Mode Definitions

Six rendering modes govern all executive output. Mode selection is deterministic: derived from `readiness_state` (from Executive Readiness Gate) and `inference_prohibition` flag (from client configuration).

```
MODE SELECTION HIERARCHY:
  IF inference_prohibition = True  → INFERENCE_PROHIBITED (overrides all)
  ELSE IF readiness_state = SUPPRESSED_FROM_EXECUTIVE → STRUCTURAL_ONLY
  ELSE IF readiness_state = BLOCKED_PENDING_DOMAIN_GROUNDING → DIAGNOSTIC_ONLY
  ELSE IF readiness_state = EXECUTIVE_READY_WITH_QUALIFIER → EXECUTIVE_READY_WITH_QUALIFIER
  ELSE IF readiness_state = EXECUTIVE_READY → EXECUTIVE_READY
  ELSE IF surface_context = BOARD → BOARD_SUMMARY (requires EXECUTIVE_READY)
```

### 4.2 Executive Rendering Matrix

#### MODE 1: BOARD_SUMMARY

| Dimension | Specification |
|-----------|--------------|
| Rendering authority | Structural intelligence only — no speculative framing |
| Semantic permissions | Normalized executive terminology (17-term dictionary) |
| Visualization permissions | Summary graphs, readiness indicators, top-N cluster heatmap |
| Narrative permissions | 3–5 sentence executive summary; no technical signal IDs |
| Evidence exposure | COMPUTED_DISPLAY fields only; citation block present but collapsed |
| Qualifier behavior | Q-00 ONLY; any Q-01+ state blocks BOARD_SUMMARY — falls back to EXECUTIVE_READY_WITH_QUALIFIER |
| Prohibited behaviors | Signal IDs in executive copy; confidence percentages; engineering terminology; unresolved grounding |

**Prerequisite:** readiness_state = EXECUTIVE_READY AND grounding_lineage = EXACT for all primary signals.

#### MODE 2: EXECUTIVE_READY

| Dimension | Specification |
|-----------|--------------|
| Rendering authority | Full normalized narrative with aliased identifiers |
| Semantic permissions | Full 17-term normalization; ALI-01..07 aliasing applied |
| Visualization permissions | Cluster topology map, signal value bars, propagation trace, readiness indicators |
| Narrative permissions | Full narrative with topology context; evidence-cited conclusions |
| Evidence exposure | COMPUTED_DISPLAY + DERIVED_DETERMINISTIC; raw DIRECT_FIELD in expandable citation |
| Qualifier behavior | Q-00 — no qualifier banner required |
| Prohibited behaviors | Hallucinated topology, invented domain names, rendering-only escalation, confidence inflation |

#### MODE 3: EXECUTIVE_READY_WITH_QUALIFIER

| Dimension | Specification |
|-----------|--------------|
| Rendering authority | Full narrative with mandatory qualifier banner |
| Semantic permissions | 17-term normalization applied; aliasing gated by grounding_lineage |
| Visualization permissions | Same as EXECUTIVE_READY with qualifier overlay on affected sections |
| Narrative permissions | Full narrative; qualifier banner prepended to all non-EXACT sections |
| Evidence exposure | Same as EXECUTIVE_READY; qualifier reason exposed in QUALIFIERS panel |
| Qualifier behavior | Q-01 / Q-02 / Q-03 banner rendered; exact language per Q-taxonomy |
| Prohibited behaviors | Omitting qualifier banner, rendering Q-01+ as Q-00, hiding partial grounding |

#### MODE 4: DIAGNOSTIC_ONLY

| Dimension | Specification |
|-----------|--------------|
| Rendering authority | Signal values and topology facts only; no executive narrative |
| Semantic permissions | Technical terminology permitted; 17-term normalization NOT applied |
| Visualization permissions | Raw signal value display, topology adjacency; no pressure heatmaps |
| Narrative permissions | Diagnostic annotation only; no executive conclusions |
| Evidence exposure | Full DIRECT_FIELD + DERIVED_DETERMINISTIC; raw derivation context visible |
| Qualifier behavior | Q-04 banner rendered: "BLOCKED: Domain grounding required before executive rendering" |
| Prohibited behaviors | Executive-style conclusions, readiness upgrades, aliased domain names, narrative framing |

**Use case:** Client with BLOCKED_PENDING_DOMAIN_GROUNDING (e.g., unnamed clusters, missing domain canonical names).

#### MODE 5: STRUCTURAL_ONLY

| Dimension | Specification |
|-----------|--------------|
| Rendering authority | Raw topology and signal data only; no interpretation layer |
| Semantic permissions | None — no terminology normalization, no aliasing |
| Visualization permissions | Adjacency matrix, raw cluster memberships; no derived visualizations |
| Narrative permissions | None — render suppression notice with explicit reason |
| Evidence exposure | DIRECT_FIELD only; no derived display |
| Qualifier behavior | Suppression banner: "Executive rendering suppressed — readiness gate not met" |
| Prohibited behaviors | Any narrative element, any interpretation, any qualifier framing suggesting executive context |

**Use case:** readiness_state = SUPPRESSED_FROM_EXECUTIVE.

#### MODE 6: INFERENCE_PROHIBITED

| Dimension | Specification |
|-----------|--------------|
| Rendering authority | Structural data rendering only; all LLM inference blocked at source |
| Semantic permissions | None — inference_prohibition flag propagates through entire rendering chain |
| Visualization permissions | Structural topology display only; no signal-derived visualizations |
| Narrative permissions | None — no narrative section rendered |
| Evidence exposure | Render notice: "Inference prohibited. Structural data available." |
| Qualifier behavior | System notice: "INFERENCE_PROHIBITED — this client configuration disables AI narrative generation" |
| Prohibited behaviors | Any LLM-generated content, any soft inference, cached narrative replay, any aliased output |

**Use case:** FastAPI client (inference_prohibition = True). Enforced at evidence injection stage before LLM invocation.

### 4.3 Executive Safety Containment

Mode boundaries are enforced at render time. The rendering engine enforces mode containment:

```
CONTAINMENT RULES:
- A higher mode may never be substituted for a lower mode (EXECUTIVE_READY may not render as BOARD_SUMMARY if Q-01+ present)
- Mode downgrade is permitted (BOARD_SUMMARY → EXECUTIVE_READY_WITH_QUALIFIER) when qualifier condition detected at render time
- Mode may not be upgraded (DIAGNOSTIC_ONLY → EXECUTIVE_READY) without re-running the executive readiness gate
- Mode must be recorded in rendering_lineage_record for replay verification
```

---

## 5. Explainability Surfaces

### 5.1 Explainability Architecture

Explainability is a first-class rendering concern, not an optional addition. Every executive surface includes bound explainability panels. The panels are non-narrative: they expose the evidence chain, derivation path, qualifier rationale, and lineage in auditable form.

**Core principle:** No executive conclusion is opaque. Every rendered assertion has a resolvable explanation path.

### 5.2 Explainability Layer Definitions

#### LAYER 1: WHY
**Purpose:** Explains why a conclusion was reached.  
**Content:** Evidence → reasoning chain in plain English. References specific signal values and readiness state that drove the conclusion.  
**Audience:** Executive / Board  
**Format:** 2–4 sentence bounded explanation; no speculation.  
**Prohibited:** Invented rationale, confidence assertions beyond grounding evidence, business recommendations.

```
WHY panel structure:
  Conclusion: [executive-normalized conclusion text]
  Evidence basis: [signal name (normalized)] = [display value] [confidence language]
  Readiness state: [state] — [reason if not EXECUTIVE_READY]
  Qualifier: [Q-state description if Q-01+]
```

#### LAYER 2: EVIDENCE
**Purpose:** Surfaces the committed evidence objects that supported this rendering.  
**Content:** evidence_stable_key references, artifact paths, evidence_object_hash, derivation timestamp.  
**Audience:** Executive / Analyst / Governance  
**Format:** Structured reference table; expandable on demand.  
**Prohibited:** Uncommitted evidence references, evidence from prior sessions without replay verification.

```
EVIDENCE panel structure:
  evidence_object_hash: [hash]
  evidence_stable_keys: [list of signal_stable_keys]
  artifact_sources: [paths to committed JSON artifacts]
  grounding_lineage: [EXACT / INFERRED / PARTIAL / UNRESOLVED / NONE]
  grounding_commit: [commit hash of grounding artifact]
```

#### LAYER 3: TRACE
**Purpose:** Shows the derivation path from raw topology to executive surface.  
**Content:** L1 → L2 → L4 → L5 → L6 path with stage identifiers and hash anchors.  
**Audience:** Analyst / Governance  
**Format:** Derivation trace table with hash at each stage boundary.  
**Prohibited:** Gaps in the trace, stages without hash anchors, LLM output treated as derivation truth.

```
TRACE panel structure:
  L1: topology_source = [canonical_topology.json commit]
  L2: signal_derivation = [derivation_hash per signal]
  L4: evidence_object = [evidence_object_hash]
  L5: normalization_output = [normalization_session_id]
  L6: rendering_session = [rendering_session_hash]
```

#### LAYER 4: QUALIFIERS
**Purpose:** Explains why a qualifier banner is present and what it means.  
**Content:** Q-state identifier, trigger condition, language authority limitations, resolution path.  
**Audience:** Executive / Analyst  
**Format:** Plain-English qualifier explanation + resolution criteria.  
**Prohibited:** Omitting qualifier explanation, downplaying qualifier significance, suggesting qualifier is cosmetic.

```
QUALIFIERS panel structure:
  qualifier_state: [Q-00 through Q-04]
  trigger: [exact condition that produced this qualifier]
  language_authority: [what is and is not permitted in this state]
  resolution_path: [what must change for qualifier to be removed]
```

#### LAYER 5: LINEAGE
**Purpose:** Provides the full commit-backed artifact lineage for this rendering.  
**Content:** commit hashes, prompt template version, evidence object hash, normalization rule version.  
**Audience:** Governance / Audit  
**Format:** Structured lineage record (see §9 session lineage schema).  
**Prohibited:** Lineage gaps, version-unresolvable references.

```
LINEAGE panel structure:
  baseline_tag: governed-dpsig-baseline-v1
  baseline_commit: 092e251
  prompt_template_id: [template id + commit hash]
  evidence_object_hash: [hash]
  normalization_rule_version: [version]
  rendering_session_hash: [hash]
```

#### LAYER 6: CONFIDENCE
**Purpose:** Exposes what confidence language was applied and why.  
**Content:** Grounding-derived language authority level, applied language terms, suppressed language terms.  
**Audience:** Executive / Analyst  
**Format:** Confidence language table with grounding basis.  
**Prohibited:** Confidence assertions without grounding basis, numeric confidence percentages without derivation.

```
CONFIDENCE panel structure:
  grounding_lineage: [EXACT / INFERRED / PARTIAL / UNRESOLVED / NONE]
  language_authority: [STRONG / QUALIFIED / HEDGED / SUPPRESSED]
  permitted_language: [list of allowed certainty terms]
  suppressed_language: [list of blocked certainty terms for this grounding level]
```

#### LAYER 7: READINESS STATE
**Purpose:** Explains the readiness classification and its implications.  
**Content:** readiness_state value, classification criteria, client-specific blocking conditions.  
**Audience:** Executive / Analyst / Governance  
**Format:** State explanation with explicit implication for what is and is not rendered.  
**Prohibited:** Hiding readiness state, rendering EXECUTIVE_READY when gate not met, rendering past SUPPRESSED_FROM_EXECUTIVE.

```
READINESS STATE panel structure:
  readiness_state: [5-state classification]
  classification_basis: [which signals and grounding conditions drove this state]
  rendering_implications: [what this state permits and prohibits in rendering]
  client_blocking_conditions: [if any client-specific blocks apply]
```

### 5.3 Explainability by Audience Type

| Audience | Primary panels | Secondary panels | Prohibited panels |
|----------|---------------|-----------------|-------------------|
| Board / C-suite | WHY, QUALIFIERS | READINESS STATE (collapsed) | TRACE, LINEAGE (too technical) |
| Executive / VP | WHY, EVIDENCE, QUALIFIERS, READINESS STATE | CONFIDENCE | TRACE (on demand only) |
| Analyst | All panels | — | None |
| Governance / Audit | LINEAGE, TRACE, EVIDENCE | All others | None |

### 5.4 Evidence Visibility Model

Evidence is always present. Its visibility is governed by surface mode and audience:

```
BOARD_SUMMARY:      Evidence collapsed; citation block present but not expanded by default
EXECUTIVE_READY:    Evidence expandable; citation block expanded on demand
EXECUTIVE_READY_WITH_QUALIFIER: Evidence expandable; qualifier panel always visible
DIAGNOSTIC_ONLY:    Evidence fully exposed; raw DIRECT_FIELD values shown
STRUCTURAL_ONLY:    Evidence not rendered (suppression notice only)
INFERENCE_PROHIBITED: Evidence not rendered (no inference available to explain)
```

**Invariant:** Evidence is never suppressed. It may be collapsed (hidden by default, expandable on interaction) but it is never absent from the rendering surface.

---

## 6. Topology-Aware Executive Narratives

### 6.1 Topology Narrative Architecture

Topology intelligence renders along five narrative dimensions. Each dimension has defined rendering rules and grounding requirements.

#### DIMENSION 1: Cluster Narratives

**What they explain:** The structural composition and health of a specific cluster — which domains it contains, its pressure state, its fan structure.

**Rendering rules:**
- Always reference the aliased cluster name (ALI-01 applied; only if grounding_lineage ≥ INFERRED)
- Always include CPI (Cluster Pressure Index) display value with confidence language
- Never interpret why a cluster has high pressure in business terms — only describe structural state
- Always include domain count and dominant domain pattern

**Grounding requirement:** Cluster must have canonical_topology.json entry. If unnamed, render cluster ID only (no alias).

**Structural explanation:** "Cluster [Alias] contains [N] domains and exhibits Elevated Structural Concentration [CPI = X.XX]. Fan structure is [asymmetric / symmetric]. [N] domains carry above-threshold coupling weight."

**Prohibited:** "This cluster is overloaded because the team is understaffed." (business speculation — not structural explanation)

#### DIMENSION 2: Propagation Narratives

**What they explain:** How structural pressure or risk flows through the topology — which clusters are upstream/downstream of a focal cluster.

**Rendering rules:**
- Always describe propagation in structural terms (coupling weight, dependency direction)
- Never assign business causality to propagation paths
- Always reference propagation direction explicitly (upstream / downstream / bidirectional)
- Use CFA (Cluster Fan Asymmetry) signal to describe fan-driven propagation risk

**Grounding requirement:** Propagation path must be derivable from canonical_topology.json adjacency data.

**Structural explanation:** "Structural pressure in [Cluster A] propagates toward [Cluster B] through [N] coupling paths. Asymmetric fan structure [CFA = X.XX] increases propagation risk in the [inbound / outbound] direction."

**Prohibited:** "This propagation will cause a production incident." (predictive business inference — not structural fact)

#### DIMENSION 3: Pressure Narratives

**What they explain:** The aggregate structural pressure state — which signals are elevated, which are suppressed, and what the readiness classification means.

**Rendering rules:**
- Always lead with readiness_state classification
- Always reference the specific signals (CPI, CFA) using normalized display names
- Never frame pressure as urgency without qualifier (Q-01+ required for hedged urgency)
- Numeric signal values always rendered as COMPUTED_DISPLAY form (e.g., "Elevated" not "0.82")

**Grounding requirement:** Signal must be derived at governed-dpsig-baseline-v1; derivation_hash must be present.

**Structural explanation:** "Structural analysis identifies [N] clusters with Elevated Structural Concentration and [M] clusters with Asymmetric Dependency Flow. Overall structural readiness: [EXECUTIVE_READY / EXECUTIVE_READY_WITH_QUALIFIER]."

**Prohibited:** "The system is about to fail." (rendering-only escalation without signal authority)

#### DIMENSION 4: Governance Narratives

**What they explain:** Why certain data is restricted, what grounding is missing, and what the resolution path is.

**Rendering rules:**
- Always render governance narratives when readiness_state ≠ EXECUTIVE_READY
- Never render governance narratives as system errors — they are information states
- Always describe what is needed to resolve the restriction
- Always reference the Q-state that applies

**Structural explanation:** "Domain grounding is incomplete for [N] clusters [Q-04 qualifier applies]. Executive rendering of affected sections is restricted pending domain canonical name resolution. Structural signal data remains available for diagnostic review."

**Prohibited:** "The system is broken." (misrepresenting governance restrictions as failures)

#### DIMENSION 5: Remediation Framing

**What they explain:** What structural patterns are present that might inform action — NOT prescribing specific technical changes.

**Rendering rules:**
- Always frame remediation as structural observation, not prescription
- Always qualify with confidence language appropriate to grounding_lineage
- Never recommend specific architectural changes (exceeds structural intelligence authority)
- Always reference the specific signals and topology that support the observation

**Structural explanation:** "Clusters with elevated CPI and asymmetric CFA exhibit structural patterns historically associated with coupling risk. Resolution typically involves domain boundary restructuring; however, specific remediation paths are outside the scope of structural analysis."

**Prohibited:** "You should extract this service into a separate microservice." (technical prescription — outside structural intelligence authority)

### 6.2 Narrative Containment Model

```
PERMITTED in topology narratives:
  ✓ Structural state description (what the topology looks like)
  ✓ Signal value presentation (CPI, CFA in normalized form)
  ✓ Propagation path description (structural coupling paths)
  ✓ Readiness classification explanation (why state was classified as it was)
  ✓ Governance restriction explanation (what is blocked and why)
  ✓ Historical comparison when historical evidence is available and committed

PROHIBITED in topology narratives:
  ✗ Business causality attribution ("because the team did X")
  ✗ Predictive failure claims ("this will cause Y")
  ✗ Technical remediation prescription ("you should do Z")
  ✗ Rendering-only escalation (framing as urgent without signal authority)
  ✗ Invented organizational context
  ✗ Confidence inflation (asserting certainty beyond grounding_lineage)
```

### 6.3 Grounding-Aware Rendering Rules

Narrative language adapts to grounding lineage. These rules are deterministic — same grounding → same language class.

| grounding_lineage | Language authority | Example hedge |
|-------------------|--------------------|---------------|
| EXACT | STRONG — no hedge required | "Cluster A exhibits Elevated Structural Concentration." |
| INFERRED | QUALIFIED — mild hedge required | "Analysis indicates Cluster A likely exhibits Elevated Structural Concentration." |
| PARTIAL | HEDGED — explicit partial qualifier | "Available data suggests elevated concentration in Cluster A; complete grounding is pending." |
| UNRESOLVED | SUPPRESSED from executive narrative | Render in QUALIFIERS panel only; not in executive narrative body |
| NONE | BLOCKED — no narrative rendered | Q-04 qualifier applies; structural data only |

---

## 7. Executive Questioning Model

### 7.1 Executive Interrogation Surface

The executive questioning model defines how executives interact with structural intelligence through natural-language questions. All questions are bounded by the same governance that bounds the narrative pipeline.

**Core constraint:** Every executive answer must be derivable from committed evidence artifacts. No answer may introduce new inference beyond what the evidence object permits.

### 7.2 Question Taxonomy

#### TYPE 1: Structural Explanation Questions
"Why is this cluster overloaded?"  
"Why does this cluster have elevated concentration?"

**Answer authority:** CPI signal value + topology composition from canonical_topology.json  
**Grounding requirement:** EXACT or INFERRED lineage  
**Prohibited answer content:** Business causality, team attribution, speculative history

**Governed answer pattern:**  
"[Cluster Alias] exhibits Elevated Structural Concentration [CPI = display_value]. Structural analysis identifies [N] domains with above-threshold coupling weight contributing to this concentration level. The [fan pattern] adds [directional] pressure. [Qualifier if applicable]."

#### TYPE 2: Propagation Explanation Questions
"What propagated this escalation?"  
"Which clusters are affected by this pressure?"  
"Which domains are coupled?"

**Answer authority:** CFA signal + topology adjacency from canonical_topology.json  
**Grounding requirement:** EXACT or INFERRED lineage  
**Prohibited answer content:** Causal chain predictions, incident forecasting

**Governed answer pattern:**  
"Structural propagation analysis identifies [N] coupling paths from [Cluster A] to [Cluster B]. [CFA = display_value] indicates [asymmetric / symmetric] fan pattern. Coupling weight of [display] propagates through [domain list or count] intermediate domains."

#### TYPE 3: Historical Questions
"What changed historically?"  
"Has this pattern appeared before?"

**Answer authority:** Only if historical comparison evidence is committed in the evidence object  
**Grounding requirement:** Historical evidence artifact must have evidence_stable_key  
**Prohibited answer content:** Reconstructed history without committed evidence

**Governed answer pattern:**  
"Historical comparison evidence is [available / not available] for this signal. [If available:] Prior measurement [date] recorded [display_value] vs current [display_value] — [direction] change. [Qualifier if grounding is INFERRED for historical data]."

#### TYPE 4: Evidence Transparency Questions
"What evidence supports this?"  
"How confident is this?"  
"What data was used?"

**Answer authority:** Evidence object fields — evidence_stable_key, grounding_lineage, evidence_object_hash  
**Grounding requirement:** Always answerable (evidence panel is always present)  
**Prohibited answer content:** Fabricated confidence percentages, evidence inflation

**Governed answer pattern:**  
"This conclusion is supported by [N] committed evidence artifacts: [list evidence_stable_keys]. Grounding lineage is [EXACT / INFERRED / PARTIAL]. Evidence object hash: [hash]. [Confidence language per grounding level applies]."

#### TYPE 5: Readiness Gate Questions
"Why is this data restricted?"  
"Why can't I see the full analysis?"  
"What's needed to unlock executive rendering?"

**Answer authority:** readiness_state classification + Q-state + blocking conditions  
**Grounding requirement:** Always answerable (readiness state is always defined)  
**Prohibited answer content:** Hiding the restriction reason, suggesting the system is broken

**Governed answer pattern:**  
"Executive rendering for [scope] is restricted because [readiness_state = X]. [Q-04: Domain grounding is incomplete for [N] clusters.] Resolution requires: [specific reopen conditions]. Until resolved, structural signal data is available for diagnostic review."

#### TYPE 6: Coupling Questions
"Which domains are coupled?"  
"What is the dependency structure?"

**Answer authority:** canonical_topology.json domain adjacency + coupling weights  
**Grounding requirement:** EXACT (topology is a direct structural artifact)  
**Prohibited answer content:** Organizational speculation, team responsibility inference

**Governed answer pattern:**  
"[Cluster Alias] contains [N] domains. Coupling analysis identifies [primary domain] with [display coupling weight] as the highest-weight node. [M] domain pairs exhibit above-threshold bidirectional coupling."

#### TYPE 7: Remediation Questions
"What remediation paths exist?"  
"What should we do about this?"

**Answer authority:** Structural pattern observation only; no prescriptive authority  
**Grounding requirement:** EXACT or INFERRED  
**Prohibited answer content:** Specific architectural prescriptions, team assignments, timeline recommendations

**Governed answer pattern:**  
"Structural analysis identifies [pattern type] patterns in [scope]. These patterns are structurally consistent with [coupling / concentration / fan] risk categories. Specific remediation decisions are outside the scope of structural analysis and require domain expert judgment."

### 7.3 Interrogation Governance Model

```
INTERROGATION CHAIN RULES:
1. Every question is routed through surface mode validation before answering
2. Questions may not bypass readiness gates (a DIAGNOSTIC_ONLY session cannot produce executive answers)
3. All answers must reference evidence_stable_key for any cited fact
4. Follow-up questions inherit the evidence object from the session — no new evidence retrieval mid-session
5. Session history is interrogation context only — not new evidence authority
6. All question-answer pairs are recorded in session lineage (§9)
7. No question may produce an answer that exceeds the narrative mode's semantic permissions
```

### 7.4 Question Containment Rules

```
PERMITTED questions:
  ✓ Any question answerable from the sealed evidence object
  ✓ Any question about readiness, qualification, or grounding state
  ✓ Any question about topology structure (if committed in canonical_topology.json)
  ✓ Any question about historical data (if committed historical evidence exists)

PROHIBITED questions (will return governed refusal):
  ✗ "Will this cause a production outage?" — predictive inference, no structural authority
  ✗ "Which team is responsible?" — organizational inference, not structural data
  ✗ "What is the probability of failure?" — probabilistic inference, not derivable
  ✗ "What is the best architecture?" — prescriptive inference, beyond structural authority
  ✗ Any question requiring evidence outside the sealed evidence object
```

**Governed refusal pattern:**  
"This question requires inference beyond the structural evidence available. Structural analysis is bounded to topology composition, signal values, and derivation-backed observations. [Specific question type] is outside the governed response boundary."

---

## 8. Executive Visualization Governance

### 8.1 Visualization Governance Architecture

All executive visualizations are governed artifacts. They present structural data; they do not create new interpretations.

**Core constraint:** A visualization may not communicate a conclusion that the underlying signal data does not support. Visual emphasis (color, size, position) must correspond exactly to signal values — no artistic inflation.

### 8.2 Visualization Types and Governance

#### VISUALIZATION 1: Cluster Heatmap
**What it shows:** CPI signal values across all clusters, rendered as a heat intensity grid.  
**Allowed abstraction:** Color intensity proportional to normalized CPI value; cluster label uses ALI-01 alias if grounded.  
**Forbidden distortion:** Manual color boost, arbitrary urgency coloring, clusters without CPI values shown as "hot."  
**Topology fidelity:** Cluster count must match canonical_topology.json exactly. No invented clusters.  
**Replay rule:** Heatmap is deterministically reproducible from CPI signal values + normalization rule version.

#### VISUALIZATION 2: Propagation Map
**What it shows:** Structural coupling paths between clusters; edge weight corresponds to coupling weight in canonical_topology.json.  
**Allowed abstraction:** Edge thickness proportional to coupling weight; directional arrows for asymmetric coupling.  
**Forbidden distortion:** Invented edges, edges with weight not in topology data, inferred propagation paths rendered as confirmed.  
**Topology fidelity:** Every rendered edge must have a corresponding coupling weight in the topology artifact.  
**Replay rule:** Propagation map is deterministic from canonical_topology.json adjacency + coupling weights.

#### VISUALIZATION 3: Readiness Indicators
**What it shows:** Per-cluster readiness state as a visual badge or status indicator.  
**Allowed abstraction:** State-to-color mapping (EXECUTIVE_READY = neutral; EXECUTIVE_READY_WITH_QUALIFIER = amber; DIAGNOSTIC_ONLY = restricted; SUPPRESSED = blocked).  
**Forbidden distortion:** Rendering EXECUTIVE_READY_WITH_QUALIFIER as EXECUTIVE_READY without qualifier visible, rendering SUPPRESSED as data-available.  
**Topology fidelity:** Readiness state must match `_classify_dpsig_readiness_state` output.  
**Replay rule:** Readiness indicators are deterministic from readiness gate output.

#### VISUALIZATION 4: Signal Value Bars
**What it shows:** CPI and CFA signal values as horizontal bar charts, per cluster.  
**Allowed abstraction:** Normalized display value on axis; threshold line at severity boundary.  
**Forbidden distortion:** Scaling axis to make values appear larger than they are, omitting threshold line.  
**Topology fidelity:** Bar value must correspond exactly to signal_value from TAXONOMY-01 derivation.  
**Replay rule:** Signal value bars are deterministic from derivation output (TAXONOMY-01 replay-safe fields).

#### VISUALIZATION 5: Topology Overlays
**What it shows:** Domain membership within clusters, rendered as a nested topology diagram.  
**Allowed abstraction:** Domain nodes sized by coupling weight; cluster boundaries from canonical_topology.json.  
**Forbidden distortion:** Inventing domain groupings not in topology, misrepresenting cluster boundaries.  
**Topology fidelity:** Domain membership must match canonical_topology.json exactly.  
**Replay rule:** Topology overlay is deterministic from canonical_topology.json.

#### VISUALIZATION 6: Evidence Panels
**What they show:** Structured references to the evidence artifacts supporting the current rendering.  
**Allowed abstraction:** Collapsed by default; expandable. Evidence stable keys shown as human-readable references.  
**Forbidden distortion:** Fabricating evidence references, hiding evidence conflicts, omitting evidence for cited conclusions.  
**Topology fidelity:** All evidence references must resolve to committed artifacts.  
**Replay rule:** Evidence panels are deterministic from evidence object (evidence_object_hash).

#### VISUALIZATION 7: Qualifier Banners
**What they show:** Q-state classification visually distinguished from unqualified executive content.  
**Allowed abstraction:** Banner color, icon, and text per Q-taxonomy (Q-00 through Q-04).  
**Forbidden distortion:** Rendering Q-01..04 without banner, minimizing banner size to near-invisible, placing banner where users are unlikely to notice.  
**Topology fidelity:** Banner content must match Q-taxonomy definition exactly.  
**Replay rule:** Qualifier banners are deterministic from readiness gate + grounding lineage.

### 8.3 Topology Fidelity Model

Topology fidelity is a non-negotiable rendering constraint. The following invariants must hold for any visualization:

```
TOPOLOGY FIDELITY INVARIANTS:
TF-01: Cluster count in visualization = cluster count in canonical_topology.json
TF-02: Domain count per cluster in visualization = domain count in canonical_topology.json
TF-03: Edge (coupling) count in propagation map = coupling pair count in topology artifact
TF-04: Signal values in visualization = signal_value from TAXONOMY-01 derivation (no rounding beyond display rules)
TF-05: Readiness state in visualization = readiness_state from executive readiness gate (not inferred)
TF-06: Aliases in visualization = ALI-01..07 output (not free-form labeling)
TF-07: Any topology entity without a canonical entry MUST be rendered as unlabeled / ID-only
```

### 8.4 Rendering Integrity Rules

```
ALLOWED visual abstraction:
  ✓ Normalized display values (COMPUTED_DISPLAY field, e.g., "Elevated")
  ✓ Proportional sizing (element size reflects signal magnitude)
  ✓ State-to-color mapping per defined color taxonomy
  ✓ Collapsing detail (showing summary with expandable detail)
  ✓ Threshold line rendering at defined severity boundaries

FORBIDDEN visual distortion:
  ✗ Scale manipulation (inflating visual impact beyond signal value)
  ✗ Urgency coloring without signal basis (e.g., red without elevated signal)
  ✗ Topology invention (rendering entities not in canonical_topology.json)
  ✗ Missing qualifier display (showing executive-mode visualization in non-executive state)
  ✗ Confidence inflation through visual design (large bold "CRITICAL" without signal authority)
  ✗ Suppression of low-CPI clusters to make high-CPI ones appear more severe
```

---

## 9. Replay-Safe Executive Sessions

### 9.1 Replay Model

Executive rendering introduces a new replay type distinct from the three established in GOVERNED_COGNITIVE_NORMALIZATION_ARCHITECTURE.md:

```
REPLAY TYPE 1: Structural deterministic
  Scope: L1–L2 derivation
  Identity: bit-identical signal values, derivation_hash, TAXONOMY-01 fields
  Guarantee: given same topology → identical signal output

REPLAY TYPE 2: Presentation deterministic
  Scope: L5 normalization
  Identity: same normalization rules + same evidence → identical normalized output
  Guarantee: same normalization_rule_version + evidence_object_hash → identical rendering

REPLAY TYPE 3: Narrative evidence-bound
  Scope: L4 LLM synthesis
  Identity: same evidence object → evidence-equivalent prose (not bit-identical)
  Guarantee: same evidence_object_hash → structurally equivalent but textually variable

REPLAY TYPE 4: Session interaction replay (NEW — this stream)
  Scope: L6 executive session
  Identity: same rendering_session_hash → identical surface state (mode, panels, visualizations)
  Guarantee: given same session inputs, surface reproduces identically
  Does NOT guarantee: identical conversational interaction (questions vary)
```

**Note:** Session interaction replay is replay of the *rendering state*, not replay of the conversational flow. The executive's questions are not deterministic; the answers to those questions, given the same evidence object and session state, are evidence-bound and therefore presentation-deterministic.

### 9.2 Session Lineage Schema

Every executive session produces a `rendering_lineage_record`:

```json
{
  "session_id": "[UUID]",
  "rendering_session_hash": "[SHA-256 of session state]",
  "baseline_tag": "governed-dpsig-baseline-v1",
  "baseline_commit": "092e251",
  "surface_mode": "[BOARD_SUMMARY / EXECUTIVE_READY / ...]",
  "evidence_object_hash": "[hash of sealed evidence object]",
  "prompt_template_id": "[template_id]",
  "prompt_template_commit_hash": "[commit hash]",
  "normalization_rule_version": "[version]",
  "normalization_session_id": "[UUID from cognitive normalization output]",
  "readiness_state": "[5-state classification]",
  "qualifier_state": "[Q-00 through Q-04]",
  "grounding_lineage": "[EXACT / INFERRED / PARTIAL / UNRESOLVED / NONE]",
  "model_id": "[LLM model identifier]",
  "rendering_timestamp": "[ISO-8601]",
  "topology_source_commit": "[commit hash of canonical_topology.json]",
  "interaction_log": [
    {
      "interaction_id": "[UUID]",
      "question_type": "[question taxonomy type]",
      "question_hash": "[SHA-256 of question text]",
      "answer_evidence_keys": ["[evidence_stable_key list]"],
      "answer_hash": "[SHA-256 of answer text]",
      "grounding_lineage_at_answer": "[lineage for this specific answer]"
    }
  ]
}
```

### 9.3 Interaction Lineage Schema

Individual question-answer pairs within a session have their own lineage record:

```json
{
  "session_id": "[parent session UUID]",
  "interaction_sequence": "[integer — position in session]",
  "interaction_id": "[UUID]",
  "question_type": "[TYPE 1 through TYPE 7]",
  "evidence_scope": "[which evidence artifacts were consulted]",
  "answer_mode": "[surface mode at time of answer]",
  "answer_evidence_keys": ["[list of evidence_stable_keys cited]"],
  "narrative_replay_type": "[TYPE 2 presentation-deterministic / TYPE 3 narrative evidence-bound]",
  "replay_anchor": {
    "evidence_object_hash": "[hash]",
    "normalization_rule_version": "[version]",
    "surface_mode": "[mode]"
  }
}
```

### 9.4 Structural vs Interaction Replay Distinction

```
STRUCTURAL REPLAY:
  What replays: signal values, derivation hashes, topology facts
  Guarantee: bit-identical output
  Authority: TAXONOMY-01, canonical_topology.json
  Use case: regulatory audit, evidence verification

INTERACTION REPLAY:
  What replays: surface state (mode, panels, visualizations), evidence bindings
  Guarantee: identical rendering state from same inputs
  Does NOT replay: conversational text verbatim (evidence-bound but not bit-identical)
  Authority: rendering_session_hash, evidence_object_hash
  Use case: board session reconstruction, executive decision audit trail
```

**Critical boundary:** Interaction replay proves *what evidence was shown*. It does not prove *what the executive concluded from it*. Decision authority remains with the executive; evidence authority remains with the platform.

### 9.5 Replay Anchor Fields

For replay verification, these fields form the rendering replay identity:

```
rendering_replay_identity = {
  evidence_object_hash,         ← sealed evidence (Type 1+2+3 anchor)
  normalization_rule_version,   ← presentation identity (Type 2 anchor)
  surface_mode,                 ← rendering context
  prompt_template_commit_hash,  ← LLM instruction identity (Type 3 anchor)
  rendering_session_hash        ← Type 4 anchor (this stream)
}
```

---

## 10. Executive Safety Boundaries

### 10.1 Executive Safety Doctrine

Executive rendering is the last governance checkpoint before an executive encounters structural intelligence conclusions. Safety failures at this layer have the highest organizational consequence.

**Permanent doctrine:** The executive rendering engine is a fidelity-preservation layer, not a communication-optimization layer. Its purpose is to faithfully present what the governed pipeline produced — not to make the output more compelling, more urgent, or more actionable than the evidence supports.

### 10.2 Executive Safety Rules

**ES-01 — NO NARRATIVE OVER-CERTAINTY**  
Rendering may not assert higher certainty than the grounding_lineage permits. INFERRED lineage requires hedged language. PARTIAL lineage requires explicit partial qualifier. NONE blocks executive narrative entirely.  
*Violation: Rendering "Cluster A is overloaded" when grounding_lineage = PARTIAL.*

**ES-02 — NO RENDERING-ONLY ESCALATION**  
A signal may not be rendered as more severe than its derivation value indicates. Visual design, typography emphasis, or framing may not create urgency that exceeds signal authority.  
*Violation: Rendering a moderate-CPI cluster in red with "CRITICAL" label.*

**ES-03 — NO EVIDENCE SUPPRESSION**  
All evidence cited in a narrative must be present in the explainability panel. Evidence that contradicts or qualifies a conclusion may not be omitted.  
*Violation: Rendering "elevated concentration detected" while omitting that 3 of 5 clusters have low CPI.*

**ES-04 — NO QUALIFIER OMISSION**  
Any conclusion derived from non-EXACT grounding must carry its appropriate Q-state qualifier. Qualifier banners are mandatory, not optional.  
*Violation: Rendering EXECUTIVE_READY_WITH_QUALIFIER content without Q-01..03 banner.*

**ES-05 — NO TOPOLOGY HALLUCINATION**  
Visualizations and narratives may not reference topology entities absent from canonical_topology.json. No cluster, domain, or coupling path may be invented.  
*Violation: Rendering a propagation path between clusters that have no coupling weight in the topology artifact.*

**ES-06 — NO EXECUTIVE DECEPTION**  
Rendering may not use framing, layout, or language designed to create false impressions. This includes de-emphasizing qualifiers, burying readiness restrictions, or using language that implies stronger evidence than exists.  
*Violation: Rendering qualifier banner in footnote font at bottom of report.*

**ES-07 — NO CONFIDENCE LAUNDERING**  
Confidence may not be inflated through the rendering layer. A DIAGNOSTIC_ONLY signal may not be rendered with EXECUTIVE_READY-grade language because the visualization "looks clean."  
*Violation: Rendering DIAGNOSTIC_ONLY CPI values with no qualifier because the chart colors look professional.*

**ES-08 — NO SEMANTIC REINTERPRETATION THROUGH UI**  
The rendering layer may not introduce new semantic conclusions through layout, grouping, or visual hierarchy that were not present in the governed narrative.  
*Violation: Grouping unrelated clusters under an "At Risk" visual category not derived from signal data.*

**ES-09 — NO HIDDEN REMEDIATION BIAS**  
Remediation framing must be neutral structural observation. The rendering layer may not introduce product, vendor, or architectural bias in how remediation is framed.  
*Violation: "This pattern is typically resolved with [product X]" without structural signal authority.*

**ES-10 — NO READINESS GATE BYPASS**  
Executive rendering may not route around the readiness gate. A client in DIAGNOSTIC_ONLY state may not receive EXECUTIVE_READY-grade rendering regardless of the rendering context or session type.  
*Violation: Rendering a board summary for a DIAGNOSTIC_ONLY client because "the executive needs a summary."*

### 10.3 Prohibited Rendering Patterns

```
PROHIBITED PATTERN 1: Urgency amplification
  Pattern: Using red, bold, "CRITICAL", "ALERT" without signal authority
  Detection: Visual element urgency class exceeds signal severity class
  Enforcement: Rendering engine validates color/label against signal severity table

PROHIBITED PATTERN 2: Qualifier burial
  Pattern: Q-01..04 qualifier present but visually minimized
  Detection: Qualifier element is not primary/prominent in rendering hierarchy
  Enforcement: Qualifier banner must occupy visible position in all non-Q00 surfaces

PROHIBITED PATTERN 3: Evidence omission
  Pattern: Citing a conclusion without linking to its evidence anchor
  Detection: Conclusion text present; corresponding evidence_stable_key absent from citation block
  Enforcement: Evidence validator runs post-render before surface delivery

PROHIBITED PATTERN 4: Mode laundering
  Pattern: Presenting DIAGNOSTIC_ONLY content in EXECUTIVE_READY visual style
  Detection: Surface mode in rendering_lineage_record vs visual template applied
  Enforcement: Template renderer is mode-gated; executive templates unavailable in DIAGNOSTIC_ONLY mode

PROHIBITED PATTERN 5: Topology invention
  Pattern: Visualization includes entities not in canonical_topology.json
  Detection: Entity count in visualization ≠ entity count in topology artifact
  Enforcement: Topology fidelity validator runs before visualization render

PROHIBITED PATTERN 6: Confidence inflation through language
  Pattern: Using "demonstrates," "proves," "confirms" when grounding is INFERRED or PARTIAL
  Detection: Language authority class in output exceeds grounding_lineage authority class
  Enforcement: Normalization validator checks language class against grounding authority
```

### 10.4 Governance Enforcement Controls

| Control | Type | Scope | Enforcement point |
|---------|------|--------|-------------------|
| Readiness gate check | Hard gate | All modes | Pre-render (Stage 2) |
| Mode containment validator | Hard gate | All modes | Pre-render (Stage 2) |
| Topology fidelity validator | Hard gate | Visualizations | Pre-visualization (Stage 7) |
| Evidence completeness validator | Hard gate | All surfaces | Post-render (Stage 8) |
| Qualifier presence validator | Hard gate | Q-01..04 modes | Post-render (Stage 8) |
| Language authority validator | Soft gate | Narrative text | Post-normalization |
| Urgency class validator | Soft gate | Visualizations | Pre-render (Stage 7) |
| Replay capture | Audit hook | All sessions | Post-render (Stage 9) |

---

## 11. Implementation Architecture

### 11.1 Component Overview

```
EXECUTIVE RENDERING SUBSYSTEM
  ├─ Rendering Engine (deterministic)
  ├─ Surface Mode Router (governance-bound)
  ├─ Explainability Panel Engine (deterministic)
  ├─ Topology Narrative Renderer (governance-bound)
  ├─ Executive Session Engine (orchestration)
  ├─ Replay Capture Hooks (audit)
  ├─ Executive Questioning Adapter (governance-bound)
  ├─ Qualifier-Aware Rendering Engine (deterministic)
  └─ Visualization Governance Layer (deterministic)
```

### 11.2 Component Specifications

#### COMPONENT 1: Rendering Engine
**Type:** DETERMINISTIC  
**Inputs:** Normalized narrative (from Cognitive Normalization), surface mode, evidence object  
**Outputs:** Rendered executive surface (HTML/JSON/PDF per target)  
**Governance constraints:** Mode-gated templates; no free-form rendering  
**Determinism guarantee:** Same inputs → identical surface output (Type 2 replay)

#### COMPONENT 2: Surface Mode Router
**Type:** GOVERNANCE_BOUND  
**Inputs:** readiness_state, inference_prohibition flag, session context  
**Outputs:** Surface mode classification (one of six modes)  
**Governance constraints:** Mode selection is deterministic per §4.1 hierarchy; no override  
**Fail-closed behavior:** Unresolvable mode defaults to DIAGNOSTIC_ONLY

#### COMPONENT 3: Explainability Panel Engine
**Type:** DETERMINISTIC  
**Inputs:** Evidence object, normalization output, session state, audience type  
**Outputs:** Seven explainability panels (WHY, EVIDENCE, TRACE, QUALIFIERS, LINEAGE, CONFIDENCE, READINESS STATE)  
**Governance constraints:** Panels populated from evidence object fields only; no free-form population  
**Determinism guarantee:** Same evidence object → identical panel content

#### COMPONENT 4: Topology Narrative Renderer
**Type:** GOVERNANCE_BOUND  
**Inputs:** Normalized narrative sections, canonical_topology.json, signal values, grounding_lineage  
**Outputs:** Topology-structured executive narrative sections  
**Governance constraints:** Narrative dimensions §6.1; containment rules §6.2; grounding-aware rules §6.3  
**Fail-closed behavior:** Ungrounded topology narrative blocked; structural-only fallback

#### COMPONENT 5: Executive Session Engine
**Type:** ORCHESTRATION  
**Inputs:** Session initialization parameters, user context, evidence object  
**Outputs:** Session state object, interaction log  
**Governance constraints:** Session scope bounded to sealed evidence object; no new evidence retrieval mid-session  
**Session lifecycle:** Open → Active (question-answer cycles) → Closed → Replay-captured

#### COMPONENT 6: Replay Capture Hooks
**Type:** AUDIT  
**Inputs:** All rendering stage outputs, session state  
**Outputs:** rendering_lineage_record, interaction_log, replay anchors  
**Governance constraints:** Mandatory at all sessions; cannot be disabled  
**Storage:** Committed to audit log on session close

#### COMPONENT 7: Executive Questioning Adapter
**Type:** GOVERNANCE_BOUND  
**Inputs:** Raw executive question, session state, evidence object  
**Outputs:** Governed answer per question taxonomy (§7.2), or governed refusal  
**Governance constraints:** Question routing per taxonomy; answer bounded to evidence object  
**Fail-closed behavior:** Unanswerable question → governed refusal pattern (§7.4)

#### COMPONENT 8: Qualifier-Aware Rendering Engine
**Type:** DETERMINISTIC  
**Inputs:** Q-state from cognitive normalization output, surface mode, rendering template  
**Outputs:** Qualifier-annotated rendering (banners, modified language, restricted sections)  
**Governance constraints:** Q-taxonomy is locked; no override; banner position is mandatory  
**Determinism guarantee:** Same Q-state → identical qualifier rendering

#### COMPONENT 9: Visualization Governance Layer
**Type:** DETERMINISTIC  
**Inputs:** Signal values, canonical_topology.json, visualization type request, surface mode  
**Outputs:** Governed visualization artifacts (heatmap, propagation map, etc.)  
**Governance constraints:** Topology fidelity invariants TF-01..07; rendering integrity rules §8.4  
**Validation:** Topology fidelity validator runs before any visualization is delivered

### 11.3 Component Ownership Map

| Component | Layer | Governance authority |
|-----------|-------|---------------------|
| Rendering Engine | L6 — Presentation | This stream + Cognitive Normalization |
| Surface Mode Router | L5–L6 boundary | Executive Readiness Gate (L2 authority) |
| Explainability Panel Engine | L6 — Audit | Evidence Injection + this stream |
| Topology Narrative Renderer | L5–L6 — Narrative | Cognitive Normalization + this stream |
| Executive Session Engine | L6 — Orchestration | This stream |
| Replay Capture Hooks | Cross-layer — Audit | TAXONOMY-01 + Evidence Injection + this stream |
| Executive Questioning Adapter | L6 — Interaction | This stream + Evidence Injection |
| Qualifier-Aware Rendering Engine | L5–L6 — Normalization | Cognitive Normalization (Q-taxonomy locked) |
| Visualization Governance Layer | L6 — Presentation | This stream + canonical_topology.json |

### 11.4 Governance Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  EXECUTIVE RENDERING SUBSYSTEM                                    │
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────┐                    │
│  │ Surface Mode    │    │  Readiness Gate  │ ← L2 authority     │
│  │ Router          │◄───│  (locked)        │                    │
│  └────────┬────────┘    └──────────────────┘                    │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐    ┌──────────────────┐                    │
│  │ Rendering       │◄───│  Normalized      │ ← L5 output        │
│  │ Engine          │    │  Narrative       │                    │
│  └────────┬────────┘    └──────────────────┘                    │
│           │                                                       │
│     ┌─────┴──────┬─────────────────────┐                        │
│     ▼            ▼                     ▼                         │
│  ┌──────┐  ┌──────────┐  ┌──────────────────────┐              │
│  │ Viz  │  │ Explain. │  │  Qualifier-Aware     │              │
│  │ Gov. │  │ Panels   │  │  Rendering Engine    │              │
│  └──┬───┘  └────┬─────┘  └──────────┬───────────┘              │
│     │           │                   │                            │
│     └─────┬─────┴───────────────────┘                           │
│           ▼                                                       │
│  ┌─────────────────┐                                            │
│  │ Safety          │  ← ES-01..10 enforcement                   │
│  │ Validators      │                                            │
│  └────────┬────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────┐    ┌──────────────────┐                    │
│  │ Replay Capture  │───►│  Lineage Record  │ → audit log        │
│  └────────┬────────┘    └──────────────────┘                    │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────────────────────────────┐                    │
│  │  EXECUTIVE SURFACE OUTPUT               │                    │
│  │  BOARD_SUMMARY / EXECUTIVE_READY / etc  │                    │
│  └─────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Governance Verdict

### 12.1 Final Evaluation

| Criterion | Assessment | Result |
|-----------|------------|--------|
| Executive usability | 6 surface modes cover full readiness spectrum; explainability panels address all audience types | PASS |
| Replay safety | 4-type replay taxonomy; rendering_session_hash anchors session state; interaction lineage schema defined | PASS |
| Explainability integrity | 7 explicit explainability layers; no opaque conclusions; WHY panel mandatory; evidence never suppressed | PASS |
| Topology fidelity | TF-01..07 invariants; topology fidelity validator enforced pre-render; no invented entities | PASS |
| Governance integrity | Full governance inheritance from baseline; semantic authority not reopened; mode containment enforced | PASS |
| Enterprise credibility | Evidence-bound answers; qualifier taxonomy enforced; no confidence laundering; board-grade suppression of non-EXECUTIVE_READY | PASS |
| Board-level viability | BOARD_SUMMARY mode defined; Q-00 gate enforces executive safety at highest surface; evidence collapsed but present | PASS |
| Future executive copilot readiness | Questioning model defined; session engine specified; interrogation governance model complete; EVIDENCE_ADDITIVE chain preserved | PASS |
| Semantic authority not reopened | SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md constraints honored; no new semantic authority granted by rendering layer | PASS |
| Implementation architecture defined | 9 components; classification table; governance integration diagram; component ownership map | PASS |

**Score: 10/10 PASS**

### 12.2 Critical Conclusion

> **Executive rendering explains structural intelligence. It does NOT replace structural intelligence.**

The rendering layer adds:
- Surface mode routing (which executive context applies)
- Explainability surfaces (making evidence visible and auditable)
- Topology narrative framing (structurally faithful, grounding-aware)
- Visualization governance (topology-faithful, no distortion)
- Session lineage (replay-safe interaction capture)
- Safety enforcement (ES-01..10 at render time)

The rendering layer does NOT add:
- New signal derivations
- New grounding authority
- New semantic classifications
- New evidence facts
- New topology topology data
- New readiness states

Every executive conclusion traceable to a committed evidence artifact. Every committed evidence artifact traceable to a TAXONOMY-01 signal derivation. Every signal derivation traceable to canonical_topology.json.

This is the **end-to-end governance chain**: L1 topology → L2 derivation → L4 evidence → L5 normalization → L6 rendering.

**Verdict: GOVERNED_EXECUTIVE_RENDERING_VIABLE**

### 12.3 Path Forward

**GOVERNED_EXECUTIVE_RENDERING_VIABLE — PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.* authorized.**

Immediate handoff: **PI.AGENTIC.TOPOLOGY-AWARE-RAG.FOUNDATION.01**

The topology-aware RAG stream defines how vector retrieval integrates with the governed evidence pipeline — topology-chunked embeddings, evidence-supplementary retrieval, and governed RAG authority model. It builds on the evidence injection and executive rendering architecture to enable topology-grounded semantic search without compromising evidence-first discipline.

---

## 13. Validation

### 13.1 Validation Results

| Check | Criterion | Result |
|-------|-----------|--------|
| V-01 | Executive rendering bounded to governed pipeline output | PASS |
| V-02 | Explainability surfaces explicit — 7 layers defined | PASS |
| V-03 | Replay model explicit — Type 4 session replay defined | PASS |
| V-04 | Topology fidelity preserved — TF-01..07 invariants enforced | PASS |
| V-05 | Grounding-aware rendering explicit — language authority table per lineage | PASS |
| V-06 | Executive safety explicit — ES-01..10 rules + enforcement controls | PASS |
| V-07 | Questioning governance explicit — 7 question types + containment rules | PASS |
| V-08 | Governance inheritance explicit — baseline load confirmed; locked contracts listed | PASS |
| V-09 | Implementation architecture defined — 9 components with classification | PASS |
| V-10 | Semantic authority NOT reopened — SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md honored | PASS |

**Validation result: 10/10 PASS — GOVERNED_EXECUTIVE_RENDERING_VIABLE**

### 13.2 Fail Conditions Not Triggered

| Fail condition | Status |
|---------------|--------|
| Rendering mutates meaning | NOT TRIGGERED — rendering is presentation-only |
| Readiness gate bypassed | NOT TRIGGERED — Stage 2 hard gate, Mode Router is mandatory |
| Explainability omitted | NOT TRIGGERED — 7 panels defined; evidence never suppressed |
| Replay requirements omitted | NOT TRIGGERED — 4-type taxonomy + session lineage schema |
| Topology hallucination tolerated | NOT TRIGGERED — TF-01..07 enforced; topology fidelity validator mandatory |
| Executive over-certainty allowed | NOT TRIGGERED — grounding-aware language authority table; ES-01 enforced |
| Semantic authority reopened | NOT TRIGGERED — explicitly confirmed closed |
| Governance boundaries ambiguous | NOT TRIGGERED — authority transition boundaries explicitly defined in §3.2 |

### 13.3 Handoff Authorization

**Authorized next stream:** PI.AGENTIC.TOPOLOGY-AWARE-RAG.FOUNDATION.01  
**Authorization basis:** 10/10 PASS — all validation criteria met  
**Baseline:** governed-dpsig-baseline-v1 (092e251) — unchanged, active
