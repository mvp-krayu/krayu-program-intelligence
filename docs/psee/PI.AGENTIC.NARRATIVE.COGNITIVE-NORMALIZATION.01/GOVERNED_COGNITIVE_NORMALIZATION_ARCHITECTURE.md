# Governed Cognitive Normalization Architecture

**Stream:** PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.01  
**Document type:** COGNITIVE NORMALIZATION ARCHITECTURE — AUTHORITATIVE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Mode:** GOVERNANCE_MODE  
**Parent foundation:** PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01  
**Prerequisites:** PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.01, PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01

---

## 1. Executive Summary

This document defines the governed cognitive normalization architecture — the deterministic post-processing layer that transforms machine-native structural intelligence output into executive-readable form while preserving full structural fidelity.

The governing principle:

> **Cognitive normalization changes presentation, NOT truth.**

Cognitive normalization is the final deterministic stage before an executive encounters structural intelligence. It applies terminology substitution, grounding-gated aliasing, confidence-aware language projection, and qualifier framing. None of these operations change the underlying signal values, topology facts, or readiness classifications. They change only how those truths are expressed.

This is also where the boundary between two replay types is most clearly drawn:
- **Structural deterministic replay** (Layers 1–2): bit-identical signal values, derivation hashes — TAXONOMY-01 fields
- **Presentation deterministic replay** (this layer): same normalization rules + same evidence → deterministically identical normalized output

Both types are governed. Both are reproducible. Neither is probabilistic.

This document establishes:
- The eight-stage cognitive normalization pipeline
- The canonical terminology normalization dictionary and versioning model
- The grounding-aware language projection system (EXACT → NONE lineage)
- The aliasing governance model (ALI-01..07)
- The complete qualifier taxonomy (Q-00..Q-04)
- The executive readability model with structural fidelity rules
- The cognitive replay model (presentation determinism)
- Ten permanent cognitive safety boundaries
- The implementation architecture blueprint

**Governance verdict:** PASS — GOVERNED_COGNITIVE_NORMALIZATION_VIABLE

---

## 2. Governance Inheritance Baseline

### 2.1 Governance Load Confirmation

```
GOVERNANCE LOAD VERIFIED:
- GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md: LOADED
- pipeline_execution_manifest.json: LOADED
- AGENTIC_SEMANTIC_ORCHESTRATION_FOUNDATION.md: LOADED
- GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md: LOADED — terminology normalization V1 in §6
- GOVERNED_PROMPT_ORCHESTRATION_ARCHITECTURE.md: LOADED — normalization at Stage 7 of prompt pipeline
- GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md: LOADED — pre-LLM normalization defined in §7
- Active baseline: governed-dpsig-baseline-v1 (092e251) — CONFIRMED
```

### 2.2 Cognitive Normalization in the Full Pipeline

Cognitive normalization operates at two points in the narrative generation pipeline:

**Pre-LLM normalization** (Evidence Injection Stage 6 — `GOVERNED_EVIDENCE_INJECTION_ARCHITECTURE.md` §7):
Applied to display fields within the evidence object before prompt injection. Produces `display.*` fields alongside raw `DIRECT_FIELD` values. The LLM receives the normalized display form for presentation while raw values are available for citation.

**Post-LLM normalization** (Narrative Generation Stage 7 — this stream):
Applied to raw LLM output after narrative synthesis. Catches any residual machine-native terminology in the LLM output, applies qualifier banners, validates evidence citations, and produces the final executive-rendered form.

This stream governs both, with emphasis on Stage 7 (post-LLM normalization), which is where the most governance sensitivity exists.

### 2.3 Inherited Locked Artifacts

The normalization rules defined in `projection_aliasing_taxonomy.json` (committed at governed-dpsig-baseline-v1) are the authoritative source for:
- 17-term terminology normalization table
- ALI-01..07 aliasing rules
- Q-00..Q-04 qualifier taxonomy
- Surface classification (KEEP_RAW / EXECUTIVE_ALIASABLE / ENGINEERING_ONLY / etc.)

These are LOCKED. Changes to normalization rules require a cognitive projection amendment stream.

---

## 3. Cognitive Normalization Pipeline

### 3.1 Eight-Stage Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  INPUT: Raw LLM output + sealed evidence object + lineage record    │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 1 — RAW LLM OUTPUT INGESTION                                 │
│  Receive raw narrative text from LLM Invoker                        │
│  Extract: all numeric values cited in output                        │
│  Extract: all structural identifiers cited in output                │
│  Extract: all domain/cluster names used in output                   │
│  Record: output_hash (SHA-256 of raw output)                        │
│  DETERMINISTIC                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 2 — TERMINOLOGY NORMALIZATION                                │
│  Scan output for machine-native terms in normalization dictionary   │
│  Apply substitutions per active_normalization_rules                 │
│  Mode gate: executive/qualified modes only; suppress for diagnostic │
│  Record: terms_substituted[]                                        │
│  DETERMINISTIC — lookup table application                           │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 3 — GROUNDING VALIDATION                                     │
│  Extract all domain/cluster attributions made in the output         │
│  For each attribution, verify language authority ≤ evidence object  │
│  Flag any attribution that exceeds its grounding lineage level      │
│  If violations: NORMALIZATION_GOVERNANCE_VIOLATION → review/reject  │
│  DETERMINISTIC — rule-based comparison against evidence object      │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 4 — QUALIFIER DETERMINATION                                  │
│  Read readiness_state from sealed evidence object                   │
│  Map to Q-XX qualifier per qualifier taxonomy                       │
│  Determine banner text (null for Q-00)                              │
│  DETERMINISTIC — state-to-qualifier mapping is a lookup             │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 5 — ALIASING APPLICATION                                     │
│  Scan output for raw structural identifiers (CLU-XX, DOM-XX, etc.)  │
│  Apply ALI-01..07 rules to any residual raw identifiers             │
│  Mode gate: DIAGNOSTIC_ONLY suppresses aliasing (ALI-06)            │
│  Record: aliases_applied[]                                          │
│  DETERMINISTIC — aliasing rules are conditionals on evidence fields │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 6 — CONFIDENCE-AWARE RENDERING                               │
│  Validate: PARTIAL-lineage attributions carry required hedging      │
│  Validate: STRONG-lineage attributions carry qualified language     │
│  Validate: NONE-lineage domains are not attributed                  │
│  Apply: per-domain confidence qualifiers where missing              │
│  DETERMINISTIC — confidence rules derive from evidence object       │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 7 — EXECUTIVE READABILITY PROJECTION                         │
│  Prepend qualifier banner (if Q-XX ≠ Q-00)                          │
│  Format citation block (evidence sources used)                      │
│  Apply surface-specific formatting (LENS report / API / etc.)       │
│  Validate: citation block is complete                               │
│  DETERMINISTIC — formatting rules are committed                     │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE 8 — REPLAY CAPTURE                                           │
│  Compute normalized_output_hash (SHA-256 of final output)           │
│  Record: normalization lineage (stages applied, rules used)         │
│  Record: grounding violations (if any — should be empty for PASS)   │
│  Store: cognitive normalization lineage record                      │
│  DETERMINISTIC                                                      │
└─────────────────────────────────────────────────────────────────────┘
        ↓
  [Normalized executive output + normalization lineage record]
```

### 3.2 Authority Transition Boundaries

**Structural truth boundary** (before normalization):
Signal values (`signal_value = 2.1176`), activation states (`CLUSTER_PRESSURE_ELEVATED`), topology facts (`node_count = 6`), and readiness classifications (`EXECUTIVE_READY`) are structural truth. Normalization never touches these values.

**Normalization begins** at Stage 2: the machine-native label `CLUSTER_PRESSURE_ELEVATED` becomes the executive-native display term `Elevated Structural Concentration`. The underlying value `2.1176` is unchanged.

**What normalization changes:** presentation labels, display terms, qualifier banners, aliased identifier forms  
**What normalization never changes:** signal_value, activation_state, node_count, readiness_state, derivation_hash, lineage confidence values

### 3.3 Fail States

| Condition | Stage | Response |
|---|---|---|
| Raw output contains invented numeric value not in evidence object | Stage 1 | `CITATION_INTEGRITY_FAILURE` — output rejected |
| Attribution exceeds grounding lineage | Stage 3 | `NORMALIZATION_GOVERNANCE_VIOLATION` — output flagged for review |
| Required qualifier banner absent from DIAGNOSTIC_ONLY output | Stage 7 | `QUALIFIER_MISSING` — banner appended; governance violation logged |
| Citation block absent from final output | Stage 7 | `CITATION_BLOCK_MISSING` — block appended from evidence lineage |

---

## 4. Terminology Normalization Governance

### 4.1 Canonical Normalization Dictionary

The authoritative normalization dictionary is committed at `docs/psee/PI.PSEE-PIOS.EXECUTIVE-COGNITIVE-PROJECTION.STABILIZATION.01/projection_aliasing_taxonomy.json` under `terminology_normalization`.

**Current 17-term dictionary (governed-dpsig-baseline-v1):**

| Raw Term (machine-native) | Normalized Form (executive-native) | Active In | Layer |
|---|---|---|---|
| CLUSTER_PRESSURE_HIGH | High Structural Concentration | executive, qualified | L3 prose only |
| CLUSTER_PRESSURE_ELEVATED | Elevated Structural Concentration | executive, qualified | L3 prose only |
| CLUSTER_PRESSURE_NOMINAL | Normal Distribution | executive, qualified | L3 prose only |
| DOMINANT_CLUSTER | Dominant Structural Mass | executive, qualified | L3 prose only |
| CLUSTER_BALANCED | Balanced Distribution | executive, qualified | L3 prose only |
| CLUSTER_ASYMMETRIC | Asymmetric Distribution | executive, qualified | L3 prose only |
| cluster fan asymmetry | structural mass distribution asymmetry | executive, qualified | L3 prose only |
| Cluster Pressure Index | Structural Concentration Index | executive, qualified | L3 prose only |
| Cluster Fan Asymmetry | Structural Distribution Ratio | executive, qualified | L3 prose only |
| COMPOUND_ZONE | Compound Pressure Zone | executive, qualified | L3 prose only |
| COUPLING_ZONE | Coupling Pressure Zone | executive, qualified | L3 prose only |
| PROPAGATION_ZONE | Propagation Risk Zone | executive, qualified | L3 prose only |
| RESPONSIBILITY_ZONE | Concentration of Responsibility | executive, qualified | L3 prose only |
| NULL_TOPOLOGY | No Cluster Concentration Detected | executive, qualified | L3 prose only |
| FILESYSTEM_CONTAINER_DOMINANCE | Ungrounded Container Concentration | all modes | L2 diagnostic notice |
| EXECUTIVE_READY_WITH_QUALIFIER | Qualified Executive View | all modes | L2 qualifier banner |
| BLOCKED_PENDING_DOMAIN_GROUNDING | Domain Verification Required | all modes | L2 qualifier banner |

### 4.2 Normalization Application Rules

1. **Mode gate:** Normalization applies in executive and qualified modes. In DIAGNOSTIC_ONLY and STRUCTURAL_LABELS_ONLY modes, raw technical terms are appropriate for the audience — normalization is suppressed.

2. **Raw values preserved:** The raw term is always preserved in the data layer. Normalization produces a display-layer substitution. Raw values appear in citation blocks and data exports; normalized terms appear in prose.

3. **Direction is one-way:** Machine-native → executive-native. The inverse (executive → machine) is not a normalization function.

4. **KEEP_RAW surface class:** Fields classified as `KEEP_RAW` in the surface classification table (`projection_aliasing_taxonomy.json`) are never normalized — even in executive mode:
   - `PZ-001` and other pressure zone IDs
   - `readiness_state=*` values
   - `executive_rendering=*` values
   - `EXACT/STRONG/PARTIAL/NONE` markers (in data layer)
   - Derivation hashes
   - `signal_stable_key`
   - Source artifact hashes

### 4.3 Terminology Versioning

The normalization dictionary is versioned with `projection_aliasing_taxonomy.json`. Changes to the dictionary are a normalization version event:

| Change Type | Version Impact | Replay Impact |
|---|---|---|
| Adding a new term | Minor increment (new term, no existing terms changed) | Replay-compatible (new substitution, existing unchanged) |
| Changing an existing term's normalized form | Major increment | Replay equivalence breaks for affected terms |
| Removing a term | Major increment | Replay equivalence breaks |
| Changing a term's active-in mode | Major increment | Replay equivalence breaks |

### 4.4 Controlled Vocabulary Model

The executive vocabulary is controlled — only terms present in the normalization dictionary are permitted as substitutions. No ad-hoc executive terminology may be introduced outside the dictionary.

New executive terms require:
1. A cognitive projection amendment stream
2. Addition to `projection_aliasing_taxonomy.json` under `terminology_normalization`
3. A taxonomy version increment
4. Re-certification of any affected narrative templates (prompt templates that use the term)

### 4.5 Normalization Inheritance

Normalization does not cascade transitively. If `COMPOUND_ZONE` is normalized to `Compound Pressure Zone`, this normalization does not extend to descriptions of compound zones derived by inference. Each term in the dictionary is normalized independently.

---

## 5. Grounding-Aware Language Projection

### 5.1 The Four Lineage Classes and Language Authority

Language authority is the maximum attribution strength that may be used when referencing a domain or cluster. It is derived directly from the grounding lineage classification in `semantic_topology_model.json`.

#### EXACT Lineage (confidence ≥ 0.90)

**Allowed attribution language:**
- "The Edge Data Acquisition domain shows elevated structural concentration."
- "Edge Data Acquisition (DOMAIN-01) has 4 nodes contributing to the primary cluster."
- Direct declarative statements about domain function and structure

**Allowed confidence language:**
- "is", "shows", "has", "contains" — certainty language is appropriate
- No hedging required

**Prohibited:**
- Over-attribution beyond what the signal evidence supports (even EXACT lineage does not permit inventing organizational claims not in the evidence)

**Executive rendering:** Full aliasing permitted; no qualifier required for the domain entry itself.

#### STRONG Lineage (confidence 0.70–0.89)

**Allowed attribution language:**
- "The Platform Infrastructure and Data domain (DOMAIN-10) likely shows..."
- "Platform Infrastructure and Data appears to contribute..."
- "Signals from Platform Infrastructure and Data suggest..."

**Allowed confidence language:**
- "likely", "appears to", "suggests", "indicates" — hedged but directional
- Single qualifier word required; not required to be prominent

**Prohibited:**
- Certainty language: "is", "shows", "definitively has"
- Unqualified declarative statements about domain function

**Executive rendering:** Aliasing permitted with soft qualifier in prose.

#### PARTIAL Lineage (confidence 0.50–0.69)

**Allowed attribution language:**
- "The Event-Driven Architecture domain (DOMAIN-11 †) may be associated with..."
- "Based on partial grounding, this area potentially reflects..."
- Every attribution must include the explicit caveat "validate with engineering"

**Allowed confidence language:**
- "may", "potentially", "could suggest", "warrants investigation"
- Explicit engineering validation note required — it must be visible

**Prohibited:**
- Any language implying confirmation of domain identity
- Any language exceeding "may" certainty

**Executive rendering:** Aliasing permitted with explicit qualifier marker (†) and validation note.

#### NONE Lineage (confidence < 0.50)

**Allowed attribution language:**
- "Cluster DOMAIN-05" or "the DOMAIN-05 cluster"
- Structural facts only: node_count, cluster_id, relationship to other clusters
- No business attribution of any kind

**Allowed confidence language:**
- No confidence language because there is nothing to be confident about — structural labels only

**Prohibited:**
- Any business name for the domain
- Any inference about what the domain "probably" is
- Any language that implies organizational context
- Attribution by proximity to a known domain

**Executive rendering:** Structural identifier only; alias suppressed.

### 5.2 Confidence Projection Matrix

| Lineage | Business Name | Certainty Language | Hedged Language | Must Include | Max Attribution Level |
|---|---|---|---|---|---|
| EXACT | YES (alias) | YES | N/A | Citation | "The [name] domain shows..." |
| STRONG | YES (alias) | NO | YES — "likely/appears to" | Soft qualifier + citation | "The [name] domain likely shows..." |
| PARTIAL | YES (alias with †) | NO | YES — "may/potentially" | "validate with engineering" + citation | "[name] (DOMAIN-XX †, validate with engineering) may..." |
| NONE | NO | NO | NO | Raw ID only | "DOMAIN-05" (structural label) |

### 5.3 Semantic Containment Rules

**SC-01:** Language authority is non-transitive. An EXACT-lineage domain's high confidence does not extend to adjacent NONE-lineage domains through narrative proximity.

**SC-02:** Language authority is per-domain, not per-cluster. A cluster containing both EXACT and NONE-lineage domains applies per-domain language authority to each — the EXACT domain can be named; the NONE domain cannot.

**SC-03:** Language authority is mode-gated. In DIAGNOSTIC_ONLY mode, even EXACT-lineage domains use structural labels (no business names). Language authority is an executive-mode concept.

**SC-04:** Confidence cannot be laundered. A domain that was NONE lineage in one run cannot be attributed as EXACT in a narrative because a different run grounded it, unless the current run's `semantic_topology_model.json` carries the updated grounding.

**SC-05:** The grounding confidence value in the evidence object is authoritative. The LLM's assessment of confidence is not. If the LLM's narrative expresses more confidence than the evidence object permits, that is a grounding validation failure (Stage 3).

---

## 6. Aliasing Governance

### 6.1 Aliasing Architecture

Aliasing transforms raw structural identifiers into human-readable names where governance permits. The aliasing system operates on two dimensions: entity type (cluster, domain) and mode (executive, diagnostic, structural).

All aliasing rules derive from `projection_aliasing_taxonomy.json` `aliasing_rules` and `cluster_aliases`/`domain_aliases` sections. These are LOCKED at governed-dpsig-baseline-v1.

### 6.2 ALI-01..07 — Governing Rules

| Rule | Condition | Action |
|---|---|---|
| ALI-01 | Cluster has business label AND readiness IN [EXECUTIVE_READY, EXECUTIVE_READY_WITH_QUALIFIER] | Render as `{alias} ({raw_id})` |
| ALI-02 | Domain lineage=EXACT AND readiness IN [EXECUTIVE_READY, EXECUTIVE_READY_WITH_QUALIFIER] | Render as `{business_label} ({dom_id})` — no qualifier |
| ALI-03 | Domain lineage=STRONG AND readiness IN [EXECUTIVE_READY, EXECUTIVE_READY_WITH_QUALIFIER] | Render as `{business_label} ({dom_id})` — soft qualifier in prose |
| ALI-04 | Domain lineage=PARTIAL AND readiness IN [EXECUTIVE_READY, EXECUTIVE_READY_WITH_QUALIFIER] | Render as `{business_label} ({dom_id}) †` — explicit validation note |
| ALI-05 | Domain lineage=NONE | Render structural label only — no business attribution regardless of readiness |
| ALI-06 | Readiness IN [DIAGNOSTIC_ONLY, SUPPRESSED_FROM_EXECUTIVE, BLOCKED_PENDING_DOMAIN_GROUNDING] | Render raw identifier only — no aliasing |
| ALI-07 | inference_prohibition=True | Aliasing BLOCKED regardless of all other conditions |

### 6.3 Alias Eligibility Matrix

| Entity | Executive Mode | Qualified Mode | Diagnostic Mode | Structural Mode | Inference Prohibited |
|---|---|---|---|---|---|
| Cluster with alias (EXECUTIVE_READY) | ALI-01 applies | ALI-01 applies | ALI-06 — raw ID | ALI-06 — raw ID | ALI-07 — blocked |
| Domain EXACT lineage | ALI-02 applies | ALI-02 applies | ALI-06 | ALI-06 | ALI-07 |
| Domain STRONG lineage | ALI-03 applies | ALI-03 applies | ALI-06 | ALI-06 | ALI-07 |
| Domain PARTIAL lineage | ALI-04 applies | ALI-04 applies | ALI-06 | ALI-06 | ALI-07 |
| Domain NONE lineage | ALI-05 — no alias | ALI-05 — no alias | ALI-06 | ALI-06 | ALI-07 |
| FastAPI client (any domain) | ALI-07 — blocked | ALI-07 — blocked | ALI-07 | ALI-07 | ALI-07 |

### 6.4 Alias Suppression Rules

Aliasing is suppressed (mode → raw identifier) in:
1. DIAGNOSTIC_ONLY mode (ALI-06)
2. SUPPRESSED_FROM_EXECUTIVE mode (ALI-06)
3. BLOCKED_PENDING_DOMAIN_GROUNDING mode (ALI-06)
4. inference_prohibition=True (ALI-07 — absolute suppression)
5. NONE-lineage domains regardless of mode (ALI-05)

Aliasing suppression rules cascade: if ANY suppression condition is true, aliasing is suppressed. There is no override path.

### 6.5 Raw Identifier Preservation

Aliasing produces a display form, not a replacement. The raw identifier is always preserved:

- Display form: `Operational Intelligence (DOM-09)` — shown in prose
- Raw form: `DOM-09` — preserved in citation block, data export, all TAXONOMY-01 fields
- The display form is for human reading. The raw form is for machine processing and audit.

A narrative that cites `Operational Intelligence` without `(DOM-09)` is a presentation violation — the raw identifier must be visible alongside the alias.

### 6.6 Alias Replayability

Aliasing is deterministic: same `projection_aliasing_taxonomy.json` + same readiness_state + same grounding lineage → same aliases applied. Aliasing replay is guaranteed as long as:
- The aliasing taxonomy version is unchanged
- The readiness state is unchanged
- The grounding lineage is unchanged

An aliasing taxonomy version increment creates a replay equivalence break for affected aliases.

---

## 7. Qualifier Taxonomy

### 7.1 Complete Q-00..Q-04 Specification

#### Q-00 — EXECUTIVE_READY

| Property | Value |
|---|---|
| Trigger | `readiness_state = EXECUTIVE_READY` |
| Banner | None — clean executive output |
| Language authority | Full executive attribution permitted |
| Aliasing | ALI-01..04 active as applicable |
| Semantic containment | Grounding lineage enforced per domain |
| Executive rendering | Permitted — full confidence in structural findings |
| Disclosure | No additional disclosure required |
| Rendering behavior | Standard executive output; no qualifying framing |

#### Q-01 — EXECUTIVE_READY_WITH_QUALIFIER

| Property | Value |
|---|---|
| Trigger | `readiness_state = EXECUTIVE_READY_WITH_QUALIFIER` |
| Banner | "Partial domain grounding — validate with engineering" |
| Language authority | Qualified attribution; no absolute claims |
| Aliasing | ALI-01..04 active; PARTIAL-lineage domains carry explicit qualifier |
| Semantic containment | Grounding lineage enforced; PARTIAL-lineage domains require validation note |
| Executive rendering | Permitted with qualifier banner |
| Disclosure | Engineering validation required for PARTIAL-lineage domains |
| Rendering behavior | Banner prepended; PARTIAL domains marked with † and validation note |

#### Q-02 — DIAGNOSTIC_ONLY

| Property | Value |
|---|---|
| Trigger | `readiness_state = DIAGNOSTIC_ONLY` |
| Banner | "Structural Diagnostic Mode — engineering use only" |
| Language authority | No executive attribution; structural labels only |
| Aliasing | ALI-06 — all aliases suppressed; raw identifiers only |
| Semantic containment | No business attribution permitted in any domain |
| Executive rendering | NOT permitted — engineering audience only |
| Disclosure | Audience restriction disclosed at top of output |
| Rendering behavior | Banner required as first line; no normalization of terminology |

Note: applies to FastAPI `run_02_oss_fastapi_pipeline` at governed baseline. CLU-17/src triggers DIAGNOSTIC_ONLY by container name rule.

#### Q-03 — SUPPRESSED_FROM_EXECUTIVE

| Property | Value |
|---|---|
| Trigger | `readiness_state = SUPPRESSED_FROM_EXECUTIVE` |
| Banner | "Suppressed from executive view" |
| Language authority | None — raw identifiers only |
| Aliasing | ALI-06 — all suppressed |
| Semantic containment | Absolute — no interpretation |
| Executive rendering | NOT permitted |
| Disclosure | Suppression reason noted if available |
| Rendering behavior | Banner required; minimal output; no prose interpretation |

#### Q-04 — BLOCKED_PENDING_DOMAIN_GROUNDING

| Property | Value |
|---|---|
| Trigger | `readiness_state = BLOCKED_PENDING_DOMAIN_GROUNDING` |
| Banner | "Domain verification required before executive projection" |
| Language authority | None — pending grounding |
| Aliasing | ALI-06 — all suppressed |
| Semantic containment | Absolute — no interpretation until grounding complete |
| Executive rendering | NOT permitted |
| Disclosure | Must explicitly state: "Domain grounding must be completed before executive analysis is available" |
| Rendering behavior | Banner required; grounding gap stated; no analytical prose |

### 7.2 Qualifier Rendering Matrix

| Q-XX | Banner Required | Aliasing | Normalization | Executive Prose | Structural Facts |
|---|---|---|---|---|---|
| Q-00 | NO | ACTIVE | ACTIVE | PERMITTED | PERMITTED |
| Q-01 | YES — "Partial domain grounding..." | ACTIVE (with PARTIAL markers) | ACTIVE | PERMITTED (qualified) | PERMITTED |
| Q-02 | YES — "Structural Diagnostic Mode..." | SUPPRESSED | SUPPRESSED | PROHIBITED | PERMITTED |
| Q-03 | YES — "Suppressed from executive view" | SUPPRESSED | SUPPRESSED | PROHIBITED | MINIMAL |
| Q-04 | YES — "Domain verification required..." | SUPPRESSED | SUPPRESSED | PROHIBITED | MINIMAL |

### 7.3 Qualifier Integration

**With readiness gate:** Qualifier is derived from readiness_state. There is no path for a user, API caller, or LLM to select a qualifier independently of the gate output.

**With grounding lineage:** Q-01 is triggered when the client has some grounded domains and some ungrounded. The qualifier banner acknowledges this mixed state. Q-04 is triggered when blocking-level grounding gaps prevent any executive projection.

**With narrative generation:** The qualifier Q-XX is injected into the evidence object at evidence assembly time. The prompt template receives the qualifier as a pre-determined value — the LLM does not choose it.

**With executive surfaces:** Qualifier banners are rendered at the top of every LENS output section for Q-01..Q-04 states. They cannot be hidden by the rendering layer.

### 7.4 Executive Containment via Qualifiers

The qualifier system is the primary executive containment mechanism at the presentation layer. It ensures:
- An executive receiving Q-02 output knows it is engineering-only before reading it
- An executive receiving Q-01 output knows grounding validation is needed before acting
- No executive surface can render Q-02/Q-03/Q-04 output without its associated banner
- Qualifier banners cannot be suppressed by product configuration

---

## 8. Executive Readability Model

### 8.1 Readability vs. Semantic Reinterpretation

**Readability:** Changing the presentation form of a structural fact without changing its meaning.
- `CLUSTER_PRESSURE_ELEVATED` → `Elevated Structural Concentration` (same concept, executive language)
- `DOM-09` → `Operational Intelligence (DOM-09)` (same entity, human-readable name)
- `CPI = 2.1176` → "The Structural Concentration Index for Operational Intelligence is 2.1176" (same value, narrative context)

**Semantic reinterpretation:** Changing the meaning or implications of a structural fact.
- `CLUSTER_PRESSURE_ELEVATED` → "This cluster is at critical organizational risk" (meaning escalation — PROHIBITED)
- `DOM-09` → "The core engineering team" (organizational inference — PROHIBITED unless grounded)
- `CPI = 2.1176` → "CPI is dangerously high" (value reframing beyond evidence — PROHIBITED)

The readability model only permits the former. The latter is a cognitive safety violation.

### 8.2 Readability Transformation Model

| Structural Element | Raw Form | Executive-Readable Form | Rule |
|---|---|---|---|
| Cluster identifier | `DOM-09` | `Operational Intelligence (DOM-09)` | ALI-01 + alias from taxonomy |
| Signal activation | `CLUSTER_PRESSURE_ELEVATED` | `Elevated Structural Concentration` | Terminology normalization |
| CPI value | `2.1176` | `Structural Concentration Index: 2.1176 (Elevated)` | Value + normalized label |
| CFA value | `0.1714` | `Structural Distribution Ratio: 0.1714 (Balanced Distribution)` | Value + normalized label |
| Readiness state | `EXECUTIVE_READY` | (implied by Q-00 — no banner needed) | Qualifier mapping |
| Readiness state | `DIAGNOSTIC_ONLY` | Q-02 banner + "Structural Diagnostic Mode" | Qualifier mapping |
| Zone type | `COMPOUND_ZONE` | `Compound Pressure Zone` | Terminology normalization |
| Domain EXACT | `DOMAIN-01` | `Edge Data Acquisition (DOMAIN-01)` | ALI-02 |
| Domain NONE | `DOMAIN-05` | `DOMAIN-05` | ALI-05 — no alias |
| Severity band | `ELEVATED` | `ELEVATED` | KEEP_RAW — severity bands are already executive-safe |

### 8.3 Readability by Structural Area

**Cluster readability:**
Raw cluster IDs become human-readable through ALI-01. The alias is always paired with the raw ID. Node counts are stated verbatim. CPI/CFA values are displayed with their normalized label.

**Propagation readability:**
Escalation paths are described using the normalized zone types (COMPOUND_ZONE → Compound Pressure Zone, etc.). Edge directions from binding_envelope.json are described with directional prose ("connects to", "propagates toward") that follows the actual edge direction in the data — not inferred.

**Pressure readability:**
Signal activation states are normalized per the dictionary. Numeric values are always stated. The narrative frames what the value means in terms of the normalized label, not in terms of organizational risk beyond what the grounding supports.

**Governance readability:**
Readiness states are not normalized (KEEP_RAW for data layer) but are framed for executive audiences via qualifier banners and mode-specific prose. "DIAGNOSTIC_ONLY" in the data becomes "Structural Diagnostic Mode — engineering use only" in the banner.

**Remediation readability:**
Remediation suggestions are framed as structural observations and possibilities:
- Permitted: "The concentration of [N] nodes in [cluster] with [CPI=X] suggests that distributing responsibility across additional clusters may reduce structural concentration."
- Prohibited: "The team responsible for [cluster] is overloaded and needs more headcount."

### 8.4 Fidelity Preservation Rules

| Fidelity Rule | Content |
|---|---|
| FP-01 Numeric fidelity | Signal values are never rounded, scaled, or transformed. `CPI = 2.1176` is always stated as `2.1176`. |
| FP-02 Activation fidelity | Activation states are never escalated. ELEVATED does not become CRITICAL through readability framing. |
| FP-03 Identity fidelity | Raw identifiers always appear alongside aliases. An alias never stands alone without its raw ID in the same rendering. |
| FP-04 Lineage fidelity | The grounding confidence value is never misrepresented. STRONG (0.78) cannot be presented as if it were EXACT. |
| FP-05 Topology fidelity | Node counts and cluster memberships are stated verbatim from canonical_topology.json. |
| FP-06 Readiness fidelity | The readiness state is presented accurately. A DIAGNOSTIC_ONLY client is never framed as if it were executive-ready. |
| FP-07 Citation fidelity | Every quantitative claim in executive output includes its source citation in the citation block. |

---

## 9. Replay-Safe Cognitive Projection

### 9.1 Two Distinct Replay Types

This is the critical distinction for this stream:

**Type 1 — Structural Deterministic Replay (L1–L2, TAXONOMY-01):**
- Input: committed topology artifacts
- Process: deterministic scripts (derive_relational_signals.py)
- Output: bit-identical `signal_value`, `derivation_hash`, `activation_state`
- Guarantee: ANY replay produces IDENTICAL output
- LLM: NONE

**Type 2 — Presentation Deterministic Replay (this stream — L5):**
- Input: committed normalization rules (projection_aliasing_taxonomy.json) + sealed evidence object
- Process: normalization pipeline (Stages 1–8)
- Output: deterministically identical normalized display forms, qualifier banners, aliases
- Guarantee: same rules + same evidence → IDENTICAL normalized output (even across independent runs)
- LLM: POST-LLM normalization only; pre-LLM normalization is fully deterministic

**Type 3 — Narrative Evidence-Bound Replay (L4):**
- Input: sealed evidence object + committed prompt template
- Process: LLM reasoning
- Output: evidence-equivalent narrative (same citations; prose varies)
- Guarantee: same evidence + same template → equivalent interpretation scope (not bit-identical prose)
- LLM: BOUNDED

Types 1 and 2 are bit-identical. Type 3 is evidence-identical.

### 9.2 Cognitive Replay Model

The full cognitive normalization output (Types 1 + 2 + 3) is replay-equivalent when:

| Requirement | Verification |
|---|---|
| Same signal values (Type 1) | TAXONOMY-01 replay diff: `overall_verdict: IDENTICAL` |
| Same normalization rules (Type 2) | Same `projection_aliasing_taxonomy.json` version + same mode + same grounding lineage |
| Same normalized display forms (Type 2) | Byte comparison of normalized terms, aliases, qualifier banners |
| Same evidence citations (Type 3) | Citation extraction + set comparison |
| Same attribution constraints (Type 3) | Per-domain language authority comparison |

### 9.3 Normalization Lineage Schema

```json
{
  "normalization_lineage_version": "1.0",
  "normalization_lineage_id": "<uuid>",
  "evidence_lineage_id": "<uuid>",
  "prompt_lineage_id": "<uuid>",
  "raw_output_hash": "sha256:<hash>",
  "normalized_output_hash": "sha256:<hash>",
  "terminology_substitutions": [
    { "raw": "CLUSTER_PRESSURE_ELEVATED", "normalized": "Elevated Structural Concentration", "position": 142 }
  ],
  "aliases_applied": [
    { "raw_id": "DOM-09", "alias": "Operational Intelligence", "rule": "ALI-01", "display": "Operational Intelligence (DOM-09)" }
  ],
  "qualifier_applied": "Q-00",
  "banner_applied": null,
  "grounding_violations_detected": [],
  "stages_completed": [1, 2, 3, 4, 5, 6, 7, 8],
  "normalization_rules_version": "projection_aliasing_taxonomy_v1",
  "mode": "executive",
  "normalization_timestamp": "<ISO-8601>"
}
```

### 9.4 Presentation Replay Taxonomy

| Element | Replay Type | Identity Guarantee |
|---|---|---|
| Signal values | Structural (Type 1) | Bit-identical |
| Normalized terminology labels | Presentation (Type 2) | Bit-identical (same rules → same substitutions) |
| Applied aliases | Presentation (Type 2) | Bit-identical (same taxonomy + same mode) |
| Qualifier banners | Presentation (Type 2) | Bit-identical (same readiness state → same Q-XX → same banner text) |
| Citation blocks | Presentation (Type 2) | Bit-identical (same evidence sources → same citations) |
| Narrative prose | Evidence-bound (Type 3) | Evidence-identical (citations match; prose varies) |

---

## 10. Cognitive Safety Boundaries

### 10.1 Permanent Cognitive Safety Rules

**C-SAF-01 — No Executive Overconfidence**  
Cognitive normalization may not introduce certainty language beyond the grounding lineage of the underlying domain. Even EXACT-lineage domains cannot be presented as "definitively" representing a business function beyond what the structural evidence states.

**C-SAF-02 — No Normalization-Driven Reinterpretation**  
Terminology normalization substitutes labels. It does not change meaning. `CLUSTER_PRESSURE_ELEVATED` becomes `Elevated Structural Concentration` — it does not become `Critical organizational risk` or `Engineering team overload`. Any normalized term that escalates the semantic meaning of the raw term is a cognitive safety violation.

**C-SAF-03 — No Semantic Authority Escalation via Aliasing**  
Applying an alias does not grant organizational authority. `DOM-09` → `Operational Intelligence (DOM-09)` is a display change. It does not authorize narrative claims about the organizational structure of the Operational Intelligence area beyond what the grounded evidence supports.

**C-SAF-04 — No Alias Drift**  
Aliases are immutable within a taxonomy version. An alias cannot evolve gradually through narrative use. If `DOM-09` is aliased as `Operational Intelligence`, every use of that alias must be `Operational Intelligence (DOM-09)` — not variants like "the operational layer" or "operational systems." Drift is a governance violation.

**C-SAF-05 — No Qualifier Suppression**  
Qualifier banners for Q-01..Q-04 may not be suppressed, hidden, or reduced in prominence. The banner must be the first visible element for any Q-01..Q-04 output. No product configuration, API parameter, or user preference may suppress it.

**C-SAF-06 — No Hidden Business Inference Through Normalization**  
Normalization operates on declared terms in the dictionary. It may not introduce business context not present in the evidence. A normalization rule that produces `Operational Intelligence — owns fleet data pipelines` would be injecting business inference. Normalized terms are label substitutions only.

**C-SAF-07 — No Presentation-Layer Hallucination**  
The normalization pipeline does not generate new content. Stage 2 (terminology normalization) substitutes terms. Stage 5 (aliasing) replaces identifiers. No stage adds facts not present in the raw LLM output or evidence object. A normalization that inserts a sentence, adds a claim, or introduces a domain reference not in the raw output is a presentation-layer hallucination.

**C-SAF-08 — No Confidence Laundering**  
Confidence laundering is the use of normalization to obscure a domain's low grounding confidence. It is prohibited in all forms:
- PARTIAL-lineage domain presented without † qualifier
- STRONG-lineage domain presented as if EXACT ("The [name] domain is..." instead of "The [name] domain likely...")
- NONE-lineage domain presented with any business name
- A mixed-lineage cluster presented as if all its domains were EXACT

**C-SAF-09 — No Structural Meaning Mutation**  
`ELEVATED` severity is `ELEVATED`. Normalization cannot render it as `HIGH` or `CRITICAL`. The normalized display form of a severity band is the band itself — severity bands are classified as `ALREADY_EXECUTIVE` in the surface classification and do not require normalization.

**C-SAF-10 — No Presentation Override of Structural Truth**  
If the normalization pipeline produces an output that contradicts a structural fact in the evidence object (a normalized term that implies a lower severity than the actual signal value, an alias that implies a different organizational boundary than the topology supports), that output must be rejected. Presentation serves structural truth; it does not override it.

### 10.2 Prohibited Rendering Patterns

| Pattern | Rule Violated |
|---|---|
| "The [name] domain definitively owns..." (STRONG lineage) | C-SAF-01, C-SAF-03 |
| `CLUSTER_PRESSURE_ELEVATED` → "organizational crisis" | C-SAF-02 |
| Alias without raw identifier in same rendering | C-SAF-04 |
| Q-02 output rendered without banner | C-SAF-05 |
| Normalization adds "responsible for X pipeline" | C-SAF-06 |
| Normalization adds a sentence not in raw output | C-SAF-07 |
| PARTIAL domain shown without † marker | C-SAF-08 |
| `ELEVATED` rendered as `HIGH` | C-SAF-09 |
| Normalized CPI presented lower than actual value | C-SAF-10 |

### 10.3 Governance Enforcement Controls

| Control | Mechanism |
|---|---|
| Attribution ceiling enforcement | Stage 3 grounding validation extracts all attribution claims and verifies against evidence object |
| Alias suppression enforcement | Mode check at Stage 5 before any aliasing is applied; ALI-07 checked first |
| Qualifier banner enforcement | Stage 7 checks: if readiness ≠ EXECUTIVE_READY → banner required; abort if missing |
| Normalization scope enforcement | Dictionary lookup only; no free-form substitution; terms not in dictionary are passed through unchanged |
| Fidelity validation | Stage 1 extracts all numeric values; Stage 3 verifies all are present in evidence object |
| Replay identity enforcement | Stages 8 records normalization lineage; replay verification compares normalized_output_hash |

---

## 11. Implementation Architecture

### 11.1 Component Responsibility Map

| Component | Responsibility | Type | Script Path |
|---|---|---|---|
| Terminology Registry | Loads and versions the normalization dictionary; validates terms | DETERMINISTIC | `scripts/pios/agentic/terminology_registry.py` |
| Normalization Engine | Applies terminology substitutions to LLM output; mode-gated | DETERMINISTIC | `scripts/pios/agentic/normalization_engine.py` |
| Grounding Validator | Extracts attributions from LLM output; checks against evidence object attribution map | DETERMINISTIC | `scripts/pios/agentic/grounding_validator.py` |
| Qualifier Renderer | Derives Q-XX from readiness state; prepends banner to output | DETERMINISTIC | `scripts/pios/agentic/qualifier_renderer.py` |
| Aliasing Engine | Applies ALI-01..07 rules to residual raw identifiers in output | DETERMINISTIC | `scripts/pios/agentic/aliasing_engine.py` |
| Confidence Language Enforcer | Validates that PARTIAL domains carry hedging language; NONE domains are not attributed | DETERMINISTIC | `scripts/pios/agentic/confidence_enforcer.py` |
| Citation Block Builder | Constructs the citation block from evidence lineage record | DETERMINISTIC | `scripts/pios/agentic/citation_builder.py` |
| Normalization Lineage Recorder | Creates and stores normalization lineage record | DETERMINISTIC | `scripts/pios/agentic/normalization_lineage.py` |
| Normalization Validator | End-to-end validation: fidelity, aliasing, qualifier, citation completeness | DETERMINISTIC | `scripts/pios/agentic/normalization_validator.py` |

All 9 components are deterministic. The normalization pipeline introduces no probabilistic behavior.

### 11.2 Implementation Blueprint

```
Cognitive Normalization Pipeline
─────────────────────────────────
[INPUT: raw LLM output + sealed evidence object + prompt lineage record]

Terminology Registry
  → load active normalization dictionary (from projection_aliasing_taxonomy.json)
  → validate dictionary version matches evidence object's taxonomy version
    ↓
Normalization Engine
  → scan raw output for dictionary terms
  → apply substitutions (mode-gated: executive/qualified only)
  → record: terms_substituted[]
    ↓
Grounding Validator
  → extract all domain/cluster attributions from normalized output
  → verify each attribution ≤ evidence object language_authority for that domain
  → flag violations → NORMALIZATION_GOVERNANCE_VIOLATION if any
    ↓
Qualifier Renderer
  → read readiness_state from evidence object
  → derive Q-XX entry
  → determine banner text
    ↓
Aliasing Engine
  → scan output for raw identifiers (CLU-XX, DOM-XX pattern)
  → apply ALI-01..07 rules (mode-gated)
  → record: aliases_applied[]
    ↓
Confidence Language Enforcer
  → check PARTIAL-lineage attributions carry hedging language
  → check STRONG-lineage attributions carry qualified language
  → check NONE-lineage domains not attributed
    ↓
Citation Block Builder
  → build citation block from evidence lineage record
  → append to output
    ↓
Qualifier Renderer (banner)
  → if Q-XX ≠ Q-00: prepend banner as first line
    ↓
Normalization Validator
  → final validation: all fidelity rules FP-01..07
  → all cognitive safety rules C-SAF-01..10
    ↓
Normalization Lineage Recorder
  → create normalization lineage record
  → compute normalized_output_hash
  → store to artifacts/normalization-lineage/
    ↓
[OUTPUT: normalized executive output + normalization lineage record]
```

### 11.3 Deterministic Component Classification

All components in the cognitive normalization architecture are deterministic and governance-bound. There are no interpretive components in this layer.

| Component | Type | Input | Output |
|---|---|---|---|
| Terminology Registry | DETERMINISTIC | Dictionary file | Lookup table |
| Normalization Engine | DETERMINISTIC | LLM output + dictionary | Substituted text |
| Grounding Validator | DETERMINISTIC | Output attributions + evidence attribution map | Pass/fail per domain |
| Qualifier Renderer | DETERMINISTIC | readiness_state | Q-XX entry + banner |
| Aliasing Engine | DETERMINISTIC | Raw identifiers + aliasing rules | Aliased display forms |
| Confidence Language Enforcer | DETERMINISTIC | Attribution claims + lineage levels | Validation results |
| Citation Block Builder | DETERMINISTIC | Evidence lineage record | Formatted citation block |
| Normalization Validator | DETERMINISTIC | Normalized output + rules | Pass/fail + violations |
| Normalization Lineage Recorder | DETERMINISTIC | Pipeline outputs | Lineage record |

---

## 12. Governance Verdict

### 12.1 Verdict Matrix

| Dimension | Verdict | Basis |
|---|---|---|
| Executive readability viability | PASS | Transformation model defined; readability ≠ reinterpretation; fidelity rules FP-01..07 |
| Replay safety | PASS | Presentation deterministic replay (Type 2) defined; normalization lineage schema; same rules + same evidence → identical normalized output |
| Governance integrity | PASS | C-SAF-01..10; normalization pipeline is entirely rule-based; no free-form substitution |
| Semantic containment | PASS | SC-01..05 containment rules; grounding validator at Stage 3; confidence enforcer at Stage 6 |
| Enterprise credibility | PASS | Every alias paired with raw ID; qualifier banners required; citation blocks mandatory; normalization is auditable |
| Topology fidelity preservation | PASS | FP-01..07 fidelity rules; numeric values never transformed; activation states never escalated |
| Executive usability | PASS | Machine-native → executive-native translation; EXACT/STRONG/PARTIAL graduated language; qualifier framing for incomplete grounding |

### 12.2 Critical Required Conclusion Confirmed

> **Executive readability enhances structural intelligence. It does NOT reinterpret structural truth.**

This is enforced by the architecture:
- The normalization pipeline operates on committed, rule-based dictionaries — not on LLM judgment
- Every normalization substitution can be traced to a specific rule in `projection_aliasing_taxonomy.json`
- The grounding validator prevents any attribution from exceeding its evidence authority
- Qualifier banners cannot be suppressed — executives always see the governance state
- Fidelity rules FP-01..07 ensure numeric values, identities, and states are never misrepresented
- All 9 normalization components are deterministic — there is no probabilistic step in this layer

### 12.3 Path Forward

**GOVERNED_COGNITIVE_NORMALIZATION_VIABLE — PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.* authorized.**

Immediate handoff: **PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.01**

The executive rendering stream defines the final presentation layer: how normalized output is assembled into LENS report sections, API response formats, and copilot surface outputs. It builds on the normalized output produced by this stream and delivers it to the executive-facing surface.

---

## 13. Validation

| Check | Result | Evidence |
|---|---|---|
| Structural truth preserved | PASS | Normalization changes presentation only; FP-01..07 fidelity rules; C-SAF-09/10 |
| Terminology governance explicit | PASS | 17-term dictionary; versioning model (major/minor); controlled vocabulary; immutability rules |
| Grounding-aware projection explicit | PASS | Four lineage classes fully defined; confidence projection matrix; SC-01..05 containment rules |
| Aliasing governance explicit | PASS | ALI-01..07 full specification; eligibility matrix; suppression rules; raw ID preservation |
| Qualifier taxonomy explicit | PASS | Q-00..Q-04 full specification; rendering matrix; integration with gate/grounding/narrative |
| Replay model explicit | PASS | Three replay types distinguished; presentation deterministic replay (Type 2) defined; normalization lineage schema |
| Executive readability bounded | PASS | Readability vs. reinterpretation distinction; transformation model; prohibited rendering patterns |
| Semantic containment preserved | PASS | C-SAF-01..10; grounding validator at Stage 3; confidence enforcer at Stage 6; qualifier containment |
| Governance inheritance explicit | PASS | projection_aliasing_taxonomy.json locked; governance load confirmed; all locked truths inherited |
| Implementation architecture defined | PASS | 9-component blueprint; all deterministic; pipeline flow; normalization lineage schema |

**10/10 PASS — GOVERNED_COGNITIVE_NORMALIZATION_VIABLE**

---

*End of document.*  
*Stream: PI.AGENTIC.NARRATIVE.COGNITIVE-NORMALIZATION.01*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Handoff: PI.AGENTIC.NARRATIVE.EXECUTIVE-RENDERING.01*
