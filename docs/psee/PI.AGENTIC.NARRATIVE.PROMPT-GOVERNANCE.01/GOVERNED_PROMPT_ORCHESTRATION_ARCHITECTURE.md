# Governed Prompt Orchestration Architecture

**Stream:** PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.01  
**Document type:** PROMPT GOVERNANCE ARCHITECTURE — AUTHORITATIVE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Mode:** GOVERNANCE_MODE  
**Parent foundation:** PI.AGENTIC.NARRATIVE-GENERATION.FOUNDATION.01

---

## 1. Executive Summary

This document defines the governance architecture for all prompts used in narrative generation, topology-aware questioning, executive copilot interaction, and governed orchestration across the Program Intelligence agentic layer.

The governing principle:

> **Prompts are governed executable intelligence artifacts, NOT hidden AI session state.**

A prompt that drives an executive narrative, explains a signal, or answers an organizational topology question is as much a governed artifact as the structural signal it interprets. It carries a version, a commit hash, a defined evidence binding contract, and a lineage record. It can be replayed. It can be audited. It cannot mutate itself at runtime.

This document establishes:
- The canonical prompt registry directory structure and naming convention
- The prompt template schema with mandatory sections
- The semantic versioning and replay compatibility model
- The prompt lineage capture schema
- System prompt governance (immutable vs. parameterized sections)
- The five prompt execution modes aligned with narrative readiness states
- The bounded orchestration chain model
- The prompt replay contract (prompt identity + evidence identity + equivalence definition)
- The implementation architecture blueprint

**Governance verdict:** PASS — GOVERNED_PROMPT_ORCHESTRATION_VIABLE

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
- GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md: LOADED
```

### 2.2 Position Relative to Parent Streams

This stream implements the prompt governance layer defined abstractly in:
- `AGENTIC_SEMANTIC_ORCHESTRATION_FOUNDATION.md` §9.3 (Prompt Accountability Structure)
- `GOVERNED_NARRATIVE_INTELLIGENCE_FOUNDATION.md` §5 (Prompt Governance Model)

Those documents declared: "All production prompt templates are committed to the repository with a version identifier." This stream defines exactly where, how, and under what governance rules.

### 2.3 Inherited Constraints

All locked truths from the governed baseline carry forward. Prompt-specific inherited constraints:

| Constraint | Prompt Implication |
|---|---|
| Evidence First is absolute | Prompts must inject committed evidence; no evidence-free production prompts |
| Readiness gating is authoritative | Prompt execution mode is derived from gate output; not user-selectable |
| Replay determinism is mandatory | Prompts are versioned and committed; same template + same evidence → equivalent output |
| Semantic richness only when grounded | Grounding rules section is mandatory in every production prompt |
| inference_prohibition=True blocks all interpretation | Mode INFERENCE_PROHIBITED blocks LLM invocation entirely; no prompt executes |
| No semantic authority escalation | System prompt governance section cannot expand attribution beyond grounding lineage |

---

## 3. Prompt Registry Architecture

### 3.1 Canonical Directory Structure

```
docs/prompts/
├── registry/
│   └── prompt_registry_manifest.json          ← machine-readable index of all templates
├── templates/
│   ├── cluster-summary/
│   │   ├── cluster-summary-executive-v1.0.md
│   │   ├── cluster-summary-diagnostic-v1.0.md
│   │   └── cluster-summary-structural-v1.0.md
│   ├── topology-narrative/
│   │   ├── topology-narrative-executive-v1.0.md
│   │   └── topology-narrative-diagnostic-v1.0.md
│   ├── escalation-trace/
│   │   ├── escalation-trace-executive-v1.0.md
│   │   └── escalation-trace-structural-v1.0.md
│   ├── remediation-suggestion/
│   │   └── remediation-suggestion-executive-v1.0.md
│   ├── governance-summary/
│   │   └── governance-summary-executive-v1.0.md
│   ├── executive-questioning/
│   │   └── executive-questioning-executive-v1.0.md
│   └── comparative-analysis/
│       └── comparative-analysis-executive-v1.0.md
├── chains/
│   └── chain-topology-investigation-v1.0.json  ← orchestration chain definitions
└── deprecated/
    └── (deprecated templates — never deleted; referenced by lineage records)
```

### 3.2 Canonical Naming Specification

Template identifier format:

```
{category}-{mode}-v{major}.{minor}
```

Components:

| Component | Values | Notes |
|---|---|---|
| `{category}` | `cluster-summary`, `topology-narrative`, `escalation-trace`, `remediation-suggestion`, `governance-summary`, `executive-questioning`, `comparative-analysis` | Fixed vocabulary; new categories require registry amendment |
| `{mode}` | `executive`, `diagnostic`, `structural` | `inference-prohibited` has no template — mode blocks LLM invocation |
| `{major}` | Integer ≥ 1 | Increments on governance-breaking changes (replay equivalence breaks) |
| `{minor}` | Integer ≥ 0 | Increments on phrasing/structure changes that preserve governance constraints (replay equivalent) |

Example identifiers:
- `cluster-summary-executive-v1.0`
- `topology-narrative-diagnostic-v1.0`
- `escalation-trace-executive-v2.1` (major version 2 = governance constraints changed from v1.x)

File path:
```
docs/prompts/templates/{category}/{category}-{mode}-v{major}.{minor}.md
```

### 3.3 Template Manifest Structure

`docs/prompts/registry/prompt_registry_manifest.json` — machine-readable index:

```json
{
  "manifest_version": "1.0",
  "baseline": "governed-dpsig-baseline-v1",
  "updated": "2026-05-08",
  "templates": [
    {
      "template_id": "cluster-summary-executive-v1.0",
      "category": "cluster-summary",
      "mode": "executive",
      "version": "1.0",
      "status": "ACTIVE",
      "file_path": "docs/prompts/templates/cluster-summary/cluster-summary-executive-v1.0.md",
      "replay_compatible_with": ["cluster-summary-executive-v1.0"],
      "supersedes": null,
      "governance_baseline": "governed-dpsig-baseline-v1",
      "evidence_sources_required": [
        "artifacts/dpsig/<client>/<run>/dpsig_signal_set.json",
        "clients/<client>/psee/runs/<run>/semantic/topology/semantic_topology_model.json",
        "docs/psee/.../projection_aliasing_taxonomy.json"
      ],
      "readiness_states_permitted": ["EXECUTIVE_READY", "EXECUTIVE_READY_WITH_QUALIFIER"]
    }
  ],
  "chains": [
    {
      "chain_id": "chain-topology-investigation-v1.0",
      "steps": [
        "cluster-summary-executive-v1.0",
        "escalation-trace-executive-v1.0"
      ],
      "context_propagation": "EVIDENCE_ADDITIVE",
      "max_steps": 2
    }
  ],
  "deprecated": []
}
```

### 3.4 Template Classification Model

Templates are classified by four dimensions:

| Dimension | Values |
|---|---|
| Category | cluster-summary / topology-narrative / escalation-trace / remediation-suggestion / governance-summary / executive-questioning / comparative-analysis |
| Mode | executive / diagnostic / structural |
| Scope | single-cluster / full-topology / cross-cluster / cross-run |
| Chain eligibility | STANDALONE / CHAIN_HEAD / CHAIN_STEP / CHAIN_TERMINAL |

Chain eligibility controls how templates may participate in orchestration chains (Section 9).

---

## 4. Prompt Template Schema

### 4.1 Canonical Prompt Template Schema

Every production prompt template follows this exact section structure. Sections are delimited by `###` markers for programmatic parsing.

```markdown
### TEMPLATE METADATA
template_id: {category}-{mode}-v{major}.{minor}
category: {category}
mode: {mode}
version: {major}.{minor}
status: ACTIVE | DEPRECATED
governance_baseline: governed-dpsig-baseline-v1
readiness_states_permitted: [EXECUTIVE_READY, ...]
scope: single-cluster | full-topology | cross-cluster | cross-run
chain_eligibility: STANDALONE | CHAIN_HEAD | CHAIN_STEP | CHAIN_TERMINAL
evidence_sources_required:
  - {artifact_pattern_1}
  - {artifact_pattern_2}
replay_major_version: {major}
created: {ISO-8601}
### END TEMPLATE METADATA

### SYSTEM: IMMUTABLE GOVERNANCE CONSTRAINTS
[IMMUTABLE — do not modify without major version increment]

You are an AI model generating a governed structural intelligence narrative.

MANDATORY RULES — ALL RULES APPLY IN EVERY RESPONSE:
1. Every numeric value you include must appear in the EVIDENCE INJECTION section below.
   You may not invent, approximate, or infer a number not present in the evidence.
2. Every structural claim (node counts, cluster relationships, edge connections) must
   cite a specific field from the injected evidence. No topology may be invented.
3. You are NOT classifying risk. You are explaining deterministically derived signals.
   Signal values are authoritative. Your interpretation supplements them; it does not override them.
4. You may not suggest that a signal classification is wrong or should be different.
5. You may not produce a response longer than {MAX_TOKENS} tokens.
6. Every response must end with the citation block defined in OUTPUT CONSTRAINTS.
### END SYSTEM: IMMUTABLE GOVERNANCE CONSTRAINTS

### SYSTEM: GROUNDING RULES
[PARAMETERIZED — populated from evidence object at runtime]

DOMAIN ATTRIBUTION MAP — apply exactly as specified:
{domain_attribution_map}

LANGUAGE AUTHORITY RULES:
- FULL ATTRIBUTION: use business name freely
- QUALIFIED ATTRIBUTION: use "likely", "appears to", or "suggests"
- SOFT ATTRIBUTION: append "(validate with engineering)"
- STRUCTURAL LABEL ONLY: use raw identifier only (e.g., DOMAIN-05); no business interpretation

ALIASING RULES IN EFFECT:
{applicable_aliasing_rules}

TERMINOLOGY NORMALIZATION:
The following substitutions apply to all output:
{active_normalization_rules}
### END SYSTEM: GROUNDING RULES

### SYSTEM: RENDERING RULES
[ENVIRONMENT-DERIVED — determined by narrative mode]

NARRATIVE MODE: {narrative_mode}
QUALIFIER BANNER: {qualifier_banner}
CLIENT: {client_id} | RUN: {run_id}
READINESS STATE: {readiness_state}

{mode_specific_rendering_instructions}
### END SYSTEM: RENDERING RULES

### EVIDENCE INJECTION
[All variables must be bound to committed artifact fields before invocation]

READINESS:
  state: {readiness_state}
  executive_rendering_allowed: {executive_rendering_allowed}
  max_cluster_name: {max_cluster_name}
  source: {readiness_source_artifact}

SIGNALS:
{signals_block}

TOPOLOGY:
{topology_block}

APPLICABLE QUALIFIER: {qualifier_id}
### END EVIDENCE INJECTION

### USER PROMPT
{user_prompt_text}
### END USER PROMPT

### OUTPUT CONSTRAINTS
FORMAT: {output_format}
MAX TOKENS: {max_tokens}
REQUIRED CITATION BLOCK: true
CITATION FORMAT:
  Evidence sources used: {evidence_source_list}
  Readiness state: {readiness_state}
  Template: {template_id}
  Narrative mode: {narrative_mode}
PROHIBITED PATTERNS:
  - invented numeric values
  - NONE-lineage business attribution
  - certainty language for PARTIAL-lineage domains
  - unqualified historical claims
### END OUTPUT CONSTRAINTS
```

### 4.2 Prompt Metadata Model

The `TEMPLATE METADATA` section is machine-readable. A prompt loader parses it to:
- Validate the correct mode for the current readiness state
- Verify all required evidence sources are available before invocation
- Record the template_id and version in the lineage record

### 4.3 Evidence Binding Placeholders

All `{variable}` placeholders in the evidence injection section follow this convention:

| Placeholder | Source Field | Binding Type |
|---|---|---|
| `{readiness_state}` | gate output → `readiness_state` | DIRECT_FIELD |
| `{executive_rendering_allowed}` | gate output → `executive_rendering_allowed` | DIRECT_FIELD |
| `{signals_block}` | `dpsig_signal_set.json` → formatted block | COMPUTED_DISPLAY |
| `{topology_block}` | `canonical_topology.json` → formatted block | COMPUTED_DISPLAY |
| `{domain_attribution_map}` | `semantic_topology_model.json` + aliasing taxonomy | COMPUTED_DISPLAY |
| `{applicable_aliasing_rules}` | `projection_aliasing_taxonomy.json` filtered by mode | COMPUTED_DISPLAY |
| `{active_normalization_rules}` | normalization table filtered by mode | COMPUTED_DISPLAY |
| `{qualifier_banner}` | qualifier taxonomy → Q-XX entry | COMPUTED_DISPLAY |
| `{narrative_mode}` | derived from readiness_state | COMPUTED_DISPLAY |

`DIRECT_FIELD`: value is read verbatim from a committed artifact field.  
`COMPUTED_DISPLAY`: value is formatted from committed artifact fields by a deterministic rule; the rule is committed.

No placeholder may be populated from session state, user input, or uncommitted computation.

### 4.4 Deterministic vs. Interpretive Instructions

| Template Section | Type | Mutability |
|---|---|---|
| TEMPLATE METADATA | Deterministic | IMMUTABLE within version |
| SYSTEM: IMMUTABLE GOVERNANCE CONSTRAINTS | Deterministic | IMMUTABLE — major version required to change |
| SYSTEM: GROUNDING RULES | Deterministic (parameterized) | Parameters injected at runtime; rules are immutable |
| SYSTEM: RENDERING RULES | Deterministic (environment-derived) | Mode is gate-determined; rendering rules are locked per mode |
| EVIDENCE INJECTION | Deterministic | All values from committed artifacts |
| USER PROMPT | Interpretive | The natural language query the LLM responds to |
| OUTPUT CONSTRAINTS | Deterministic | IMMUTABLE within version |

The LLM has interpretive freedom only within the USER PROMPT section, bounded by all deterministic sections above it.

---

## 5. Prompt Versioning Governance

### 5.1 Semantic Versioning Model

Prompts use two-component semantic versioning: `v{major}.{minor}`

**Major version increment (replay equivalence breaks):**
- Any change to the IMMUTABLE GOVERNANCE CONSTRAINTS section
- Any change to the OUTPUT CONSTRAINTS section
- Any change to the evidence binding model (new required sources, removed sources)
- Any change to mode permission (adding or removing a permitted readiness state)
- Any change that expands or contracts language authority

A major version increment means: a narrative generated by v1.x and a narrative generated by v2.x are NOT replay-equivalent, even with the same evidence. Both must be tracked independently.

**Minor version increment (replay equivalence preserved):**
- Rephrasing of the USER PROMPT section without changing scope
- Adding examples or clarifying instructions in the USER PROMPT
- Adjusting MAX_TOKENS within a range that does not truncate required citations
- Adding new PROHIBITED PATTERNS that are already implied by existing constraints
- Cosmetic formatting changes

A minor version increment means: narratives generated by any v1.x are replay-equivalent to narratives generated by any other v1.x with the same evidence.

### 5.2 Immutable Prompt Identifiers

Once a template identifier is created (e.g., `cluster-summary-executive-v1.0`), it is permanent. The file at that identifier is never overwritten. If changes are needed, a new version is created (`cluster-summary-executive-v1.1` or `cluster-summary-executive-v2.0`).

This rule ensures: lineage records that reference a template_id remain valid indefinitely. An auditor can always retrieve the exact template used for any historical invocation.

### 5.3 Prompt Deprecation Rules

A template is deprecated when a newer version supersedes it:

1. Set `status: DEPRECATED` in the template metadata
2. Set `supersedes: {new_template_id}` in the registry manifest
3. The deprecated template file is moved to `docs/prompts/deprecated/`
4. The deprecated template is never deleted — lineage records may reference it
5. New production invocations may not use a deprecated template
6. Replay of historical lineage records using a deprecated template is permitted (replay, not new production use)

### 5.4 Backward Compatibility

Minor versions are backward-compatible. A system that loads `cluster-summary-executive-v1.0` may be upgraded to `cluster-summary-executive-v1.3` without breaking replay equivalence for the same evidence.

Major versions are NOT backward-compatible. A system upgraded from v1.x to v2.x must migrate existing lineage records to note the version discontinuity. Narratives generated under v1.x and v2.x are not cross-comparable.

### 5.5 When Replay Equivalence Breaks

Replay equivalence breaks when:

1. **Major version increment**: governance constraints changed
2. **Evidence artifact change**: the committed artifact that provided the evidence has been modified
3. **Grounding model change**: semantic_topology_model.json for the client has been updated (lineage changes)
4. **Aliasing taxonomy change**: projection_aliasing_taxonomy.json has been updated
5. **Readiness state change**: client topology change triggers different gate output

Replay equivalence is preserved when:
- Only minor version increments since last invocation
- Evidence artifacts are bit-identical to original invocation
- Grounding model is unchanged
- Readiness state is unchanged

---

## 6. Prompt Lineage Capture

### 6.1 Lineage Record Schema

Every production prompt invocation produces a lineage record. The schema is:

```json
{
  "lineage_schema_version": "1.0",
  "lineage_id": "<uuid-v4>",
  "invocation_type": "production | replay",
  "template_id": "cluster-summary-executive-v1.0",
  "template_file_path": "docs/prompts/templates/cluster-summary/cluster-summary-executive-v1.0.md",
  "template_commit_hash": "<git-sha>",
  "evidence_object_hash": "sha256:<hash>",
  "evidence_sources": [
    {
      "artifact_path": "artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json",
      "artifact_commit_hash": "<git-sha>",
      "artifact_hash": "sha256:<hash>"
    }
  ],
  "readiness_state": "EXECUTIVE_READY",
  "narrative_mode": "executive",
  "qualifier_applied": "Q-00",
  "aliasing_rules_applied": ["ALI-01", "ALI-02", "ALI-03"],
  "grounding_constraints": {
    "DOMAIN-01": "FULL ATTRIBUTION",
    "DOMAIN-10": "QUALIFIED ATTRIBUTION",
    "DOMAIN-11": "SOFT ATTRIBUTION",
    "DOMAIN-02": "STRUCTURAL LABEL ONLY"
  },
  "model_id": "claude-sonnet-4-6",
  "model_version": "<version-string>",
  "chain_id": null,
  "chain_step": null,
  "generation_timestamp": "2026-05-08T...",
  "output_hash": "sha256:<hash>",
  "output_token_count": 312,
  "governance_compliance_check": "PASS",
  "replay_major_version": 1,
  "client_id": "blueedge",
  "run_id": "run_blueedge_productized_01_fixed"
}
```

### 6.2 Lineage Storage

Lineage records are stored at:

```
artifacts/narrative-lineage/<client_id>/<run_id>/<lineage_id>.json
```

Lineage records for orchestration chains:

```
artifacts/narrative-lineage/<client_id>/<run_id>/chains/<chain_id>/<chain_id>-lineage.json
```

Lineage records are NOT committed to git by default (they are session-local audit artifacts). They become committed governance artifacts when explicitly promoted — typically when a named session or narrative report is captured as a governed output.

### 6.3 Integration with Replay Instrumentation

The lineage model integrates with the deterministic replay instrumentation established in `PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.DESIGN.01`:

- `output_hash` in the lineage record plays the same role as `derivation_hash` in TAXONOMY-01 — it provides a stable identity key for the output
- `evidence_object_hash` provides the same function as `signal_stable_key` — it anchors the lineage to a specific evidence state
- A replay is verified by: re-invoking with the same template + evidence object → compare citation sets (not prose)

The replay diff artifact for narrative invocations:

```json
{
  "replay_diff_version": "1.0",
  "original_lineage_id": "<uuid>",
  "replay_lineage_id": "<uuid>",
  "template_identity": "IDENTICAL | DIFFERENT",
  "evidence_identity": "IDENTICAL | DIFFERENT",
  "readiness_state_identity": "IDENTICAL | DIFFERENT",
  "grounding_constraint_identity": "IDENTICAL | DIFFERENT",
  "citation_set_diff": [],
  "attribution_constraint_violations": [],
  "overall_verdict": "EQUIVALENT | NON_EQUIVALENT | CANNOT_VERIFY"
}
```

`EQUIVALENT` requires: template identical, evidence identical, readiness identical, grounding identical, no new citations, no attribution violations.

### 6.4 Orchestration Lineage Map

For chain invocations, the lineage captures the full chain:

```json
{
  "chain_lineage_id": "<uuid>",
  "chain_id": "chain-topology-investigation-v1.0",
  "chain_version": "1.0",
  "steps": [
    {
      "step": 1,
      "template_id": "cluster-summary-executive-v1.0",
      "lineage_id": "<uuid-step-1>",
      "context_passed_to_next": "EVIDENCE_ADDITIVE"
    },
    {
      "step": 2,
      "template_id": "escalation-trace-executive-v1.0",
      "lineage_id": "<uuid-step-2>",
      "context_passed_to_next": null
    }
  ],
  "total_steps": 2,
  "chain_completed": true,
  "chain_governance_compliance": "PASS"
}
```

---

## 7. System Prompt Governance

### 7.1 System Prompt Section Architecture

The system prompt is composed of three section types with different mutability levels:

```
┌────────────────────────────────────────────────────────┐
│  SECTION TYPE 1: IMMUTABLE GOVERNANCE CONSTRAINTS      │
│  Same in every invocation of every version.            │
│  Cannot be modified without a major version bump.      │
│  Contains: evidence fabrication prohibition, signal    │
│  authority rules, output constraints, citation rules.  │
├────────────────────────────────────────────────────────┤
│  SECTION TYPE 2: PARAMETERIZED GROUNDING RULES         │
│  Content is injected from the evidence object.         │
│  The rule structure is immutable.                      │
│  The values (domain names, lineage levels) vary per    │
│  client and run.                                       │
│  Contains: domain attribution map, aliasing rules,     │
│  terminology normalization active set.                 │
├────────────────────────────────────────────────────────┤
│  SECTION TYPE 3: ENVIRONMENT-DERIVED RENDERING RULES   │
│  Content is derived from readiness state + mode.       │
│  The rule structure is immutable (mode matrix).        │
│  The active mode varies per client/run.                │
│  Contains: narrative mode, qualifier banner,           │
│  mode-specific language authority instructions.        │
└────────────────────────────────────────────────────────┘
```

### 7.2 Immutable Governance Sections

These statements appear verbatim in every production prompt. They define the absolute floor of governance. No runtime parameter may weaken them.

**Evidence fabrication prohibition (immutable):**
```
You may not produce any numeric value that is not present in the EVIDENCE INJECTION section.
If a value is not in the evidence, you must state "evidence not available" rather than estimate.
```

**Signal authority rule (immutable):**
```
Signal values are derived by deterministic scripts and are authoritative.
You are explaining what the signals say. You are not classifying risk independently.
Do not suggest that a signal value is incorrect, should be different, or should be re-evaluated.
```

**Attribution ceiling rule (immutable):**
```
You may not use stronger confidence language than the language authority level specified
for each domain in the GROUNDING RULES section. Exceeding this ceiling is a governance violation.
```

**Citation requirement (immutable):**
```
Every response must conclude with a citation block listing all evidence sources used.
Do not omit the citation block. Do not modify its format.
```

**Readiness containment rule (immutable):**
```
If the NARRATIVE MODE is DIAGNOSTIC_ONLY or STRUCTURAL_LABELS_ONLY, you must not use
business domain names, organizational attribution, or executive framing.
Structural identifiers only. Do not attempt to infer business context from structural labels.
```

### 7.3 Parameterized Sections

The grounding rules section is structured but values are injected:

```
DOMAIN ATTRIBUTION MAP:
{foreach domain in evidence.domain_attribution_map}
  {domain.domain_id} ({domain.alias if alias_permitted else 'structural label'}):
    Language authority: {domain.language_authority}
    Alias permitted: {domain.alias_permitted}
{endforeach}
```

The structure (foreach loop logic) is immutable. The values (domain IDs, aliases, language authority levels) are injected from the evidence object and derived deterministically from `semantic_topology_model.json`.

### 7.4 Environment-Derived Sections

Mode-specific rendering instructions are locked per mode:

**executive mode rendering instructions (immutable for this mode):**
```
Use the aliases specified in the GROUNDING RULES for all eligible domains.
Apply terminology normalization as specified.
Address the executive audience. Avoid technical signal derivation details in prose.
Use the normalized term "Structural Concentration Index" instead of "Cluster Pressure Index."
```

**diagnostic mode rendering instructions (immutable for this mode):**
```
Use only structural labels. No aliases. No business attribution.
Technical signal values and derivation details are appropriate for this audience.
Begin the response with: "STRUCTURAL DIAGNOSTIC MODE — Engineering audience only."
```

### 7.5 Forbidden System Prompt Mutations

| Mutation | Prohibition |
|---|---|
| Adding instructions that expand language authority beyond grounding lineage | FORBIDDEN — requires major version bump |
| Adding instructions that reduce or remove citation requirements | FORBIDDEN — requires major version bump |
| Injecting user-supplied text into the immutable governance section | FORBIDDEN — injection is evidence-only |
| Using a different template for a readiness state than permitted | FORBIDDEN — mode matrix is locked |
| Omitting the grounding rules section | FORBIDDEN — evidence binding is mandatory |
| Injecting session history as evidence | FORBIDDEN — evidence is committed artifacts only |
| Adding a "trust the user's description of the data" instruction | FORBIDDEN — violates evidence-first principle |

---

## 8. Prompt Execution Modes

### 8.1 Prompt Execution Matrix

| Mode | Trigger | LLM Invoked | Template Set | Language Authority | Aliasing | Required Banner |
|---|---|---|---|---|---|---|
| EXECUTIVE_READY | `readiness_state = EXECUTIVE_READY` | YES | `-executive-*` | Full/qualified/soft per domain | ALI-01..04 active | None (Q-00) |
| EXECUTIVE_READY_WITH_QUALIFIER | `readiness_state = EXECUTIVE_READY_WITH_QUALIFIER` | YES | `-executive-*` | Same as above with qualifier | ALI-01..04 active | Q-01 banner prepended |
| DIAGNOSTIC_ONLY | `readiness_state = DIAGNOSTIC_ONLY` | YES | `-diagnostic-*` | Structural only; no aliases | ALI-06 — raw identifiers | Q-02 banner prepended |
| STRUCTURAL_LABELS_ONLY | `readiness_state IN [SUPPRESSED_FROM_EXECUTIVE, BLOCKED_PENDING_DOMAIN_GROUNDING]` | YES | `-structural-*` | Raw identifiers only; no inference | ALI-06 — raw identifiers | Q-03 or Q-04 banner |
| INFERENCE_PROHIBITED | `inference_prohibition = True` | NO | N/A | N/A | N/A | Error state returned |

### 8.2 Mode Inheritance Rules

Mode is not inherited from user preference or API parameter. It is derived:

```
determine_prompt_mode(client_id, run_id):
  1. Load readiness_state from gate output artifact
  2. Load inference_prohibition from semantic_topology_model.json
  3. IF inference_prohibition = True → INFERENCE_PROHIBITED (no template loaded)
  4. ELSE map readiness_state → mode per table above
  5. Return mode
```

This derivation is deterministic. The same client + run → same mode, given unchanged artifacts.

### 8.3 Semantic Containment Map

| Mode | Can use business names | Can infer organizational context | Can use normalized terminology | Can use executive framing |
|---|---|---|---|---|
| EXECUTIVE_READY | YES (gated by lineage) | NO — only what grounding permits | YES | YES |
| EXECUTIVE_READY_WITH_QUALIFIER | YES (gated by lineage) | NO | YES | YES (qualified) |
| DIAGNOSTIC_ONLY | NO | NO | NO (raw technical labels) | NO |
| STRUCTURAL_LABELS_ONLY | NO | NO | NO | NO |
| INFERENCE_PROHIBITED | N/A — no LLM | N/A | N/A | N/A |

### 8.4 Mode-Specific Evidence Filtering

In DIAGNOSTIC_ONLY mode, the evidence object is filtered:
- `domain_attribution_map` entries are all overridden to STRUCTURAL_LABEL_ONLY regardless of actual lineage
- `applicable_aliasing_rules` is reduced to `[ALI-06]`
- `active_normalization_rules` is cleared (no normalization in diagnostic mode)

This prevents the LLM from accidentally using business names that appear in the evidence object but are not appropriate for the mode.

---

## 9. Orchestration Prompt Chains

### 9.1 Chain Architecture

A prompt chain is a defined sequence of prompt template invocations where later steps may receive context from earlier steps. Chains are defined in `docs/prompts/chains/`.

Chain definition schema:

```json
{
  "chain_id": "chain-topology-investigation-v1.0",
  "chain_version": "1.0",
  "chain_type": "SEQUENTIAL",
  "steps": [
    {
      "step": 1,
      "template_id": "cluster-summary-executive-v1.0",
      "step_name": "cluster_summary",
      "context_output": ["primary_cluster_summary"],
      "context_passed_to_next": "EVIDENCE_ADDITIVE"
    },
    {
      "step": 2,
      "template_id": "escalation-trace-executive-v1.0",
      "step_name": "escalation_trace",
      "context_input": ["primary_cluster_summary"],
      "context_passed_to_next": null
    }
  ],
  "max_steps": 2,
  "context_propagation_model": "EVIDENCE_ADDITIVE",
  "forbidden_propagation": ["SEMANTIC_ESCALATION", "ATTRIBUTION_EXPANSION", "READINESS_OVERRIDE"],
  "chain_replay_model": "ALL_STEPS_MUST_REPLAY_EQUIVALENT"
}
```

### 9.2 Context Propagation Model

Context propagation between chain steps is strictly bounded. The only permitted propagation model is `EVIDENCE_ADDITIVE`:

**EVIDENCE_ADDITIVE:** The next step receives the same evidence object as the first step, plus the first step's cited evidence references (which fields were cited). The next step's LLM context does not include the previous step's prose output — only its evidence citations.

This prevents semantic escalation: the second step cannot build on the first step's interpretive framing. It can only build on the same structural evidence that the first step cited.

Forbidden propagation models:

| Model | Why Forbidden |
|---|---|
| `FULL_CONTEXT` (passing LLM output as context to next step) | Enables semantic drift and cumulative attribution escalation |
| `SEMANTIC_ESCALATION` (explicitly expanding attribution in next step) | Violates grounding lineage constraints |
| `ATTRIBUTION_EXPANSION` (using step 1 output to bootstrap step 2 business framing) | Violates attribution ceiling |
| `READINESS_OVERRIDE` (step 1 EXECUTIVE_READY output used to justify step 2 executive framing for different client) | Violates readiness gate authority |

### 9.3 Expected Chain Definitions

| Chain ID | Steps | Use Case |
|---|---|---|
| chain-topology-investigation-v1.0 | cluster-summary → escalation-trace | "Which cluster is at risk and how does pressure propagate?" |
| chain-executive-brief-v1.0 | topology-narrative → governance-summary | "Generate an executive brief with governance context" |
| chain-question-remediation-v1.0 | executive-questioning → remediation-suggestion | "Executive asks question; response includes remediation framing" |
| chain-comparative-governance-v1.0 | comparative-analysis → governance-summary | "Compare runs and summarize governance implications" |

### 9.4 Bounded Chaining Rules

| Rule | Enforcement |
|---|---|
| Maximum chain depth: 3 steps | Chain definition must declare `max_steps ≤ 3` |
| No circular chains | Chain definition validator checks for step cycles |
| No self-referential steps (template referencing its own output) | Validator checks step template_ids are unique per chain |
| Context passed between steps is evidence-only, not prose | `context_propagation_model` must be `EVIDENCE_ADDITIVE` |
| All steps in a chain must use the same narrative mode | Chain definition must assert `mode_consistency: REQUIRED` |
| Chains cannot span clients | All steps must reference the same `{client_id}` and `{run_id}` |
| Chain output is a single governed artifact | The chain lineage record covers all steps |

### 9.5 Chain Replay Model

A chain is replay-equivalent if every step in the chain is individually replay-equivalent. A chain replay failure at step N does not invalidate steps 1..(N-1) — each step has independent lineage.

Chain replay diff:

```json
{
  "chain_replay_diff_version": "1.0",
  "chain_id": "chain-topology-investigation-v1.0",
  "steps": [
    { "step": 1, "verdict": "EQUIVALENT" },
    { "step": 2, "verdict": "NON_EQUIVALENT", "reason": "evidence_artifact_changed" }
  ],
  "chain_overall_verdict": "PARTIALLY_EQUIVALENT",
  "failed_steps": [2]
}
```

---

## 10. Prompt Replayability

### 10.1 Replay Identity Components

A prompt invocation has four identity components, each independently verifiable:

| Component | Identity Anchor | Verification |
|---|---|---|
| Prompt identity | `template_id` + `template_commit_hash` | Git hash of template file |
| Evidence identity | `evidence_object_hash` | SHA-256 of serialized evidence object |
| Orchestration identity | `chain_id` + `chain_version` + step sequence | Chain definition hash |
| Narrative equivalence | Citation set comparison | Extract citations from both outputs; compare |

Full replay equivalence requires all four components to match.

### 10.2 Replay Verification Methodology

```
replay_verify(original_lineage_id, replay_lineage_id):
  1. Load both lineage records
  2. Compare template_id + template_commit_hash → IDENTICAL or DIFFERENT
  3. Compare evidence_object_hash → IDENTICAL or DIFFERENT
  4. IF any DIFFERENT → check if difference is replay-breaking
     - Major version difference → REPLAY_EQUIVALENCE_BROKEN
     - Evidence artifact changed → REPLAY_EQUIVALENCE_BROKEN
  5. Extract citation sets from both outputs
     - Parse output for all numeric values + source citations
     - Parse output for all domain/cluster identifiers + attribution level used
  6. Compare citation sets → EQUIVALENT (same citations) or DIVERGENT
  7. Check attribution ceiling compliance in both outputs
  8. Return replay_diff artifact (Section 6.3 schema)
```

### 10.3 Replay Diff Classification

| Verdict | Meaning |
|---|---|
| `EQUIVALENT` | Same template, same evidence, same citations, same attribution constraints |
| `NON_EQUIVALENT` | Template or evidence changed; citations differ; attribution violated |
| `PARTIALLY_EQUIVALENT` | Chain with some equivalent and some non-equivalent steps |
| `CANNOT_VERIFY` | Original template or evidence artifact not retrievable (deprecated/deleted) |

Note: `CANNOT_VERIFY` is not the same as `NON_EQUIVALENT`. It means the replay baseline is not available — a governance gap, not a contradiction.

### 10.4 Narrative Replay Taxonomy

| Type | What it Verifies | Tool |
|---|---|---|
| Template identity | Was the same committed template used? | Git hash comparison |
| Evidence identity | Was the same committed evidence used? | SHA-256 comparison |
| Mode identity | Was the same readiness state in effect? | Lineage record comparison |
| Citation equivalence | Did both outputs cite the same fields? | Citation extraction + set comparison |
| Attribution compliance | Did both outputs respect language authority limits? | Constraint checker |
| Prose equivalence | Are the exact words identical? | NOT REQUIRED — prose is probabilistic |

---

## 11. Implementation Architecture

### 11.1 Component Responsibility Map

| Component | Responsibility | Type | Location |
|---|---|---|---|
| Prompt Registry | Stores and indexes all template files | Deterministic | `docs/prompts/registry/` |
| Template Loader | Reads template by ID + version; validates metadata | Deterministic | `scripts/pios/agentic/prompt_loader.py` |
| Evidence Assembly Engine | Reads committed artifacts → populates evidence object | Deterministic | `scripts/pios/agentic/evidence_assembler.py` (future) |
| Mode Resolver | Reads readiness state → determines prompt mode | Deterministic | `scripts/pios/agentic/mode_resolver.py` |
| Prompt Assembler | Injects evidence object into template placeholders | Deterministic | `scripts/pios/agentic/prompt_assembler.py` |
| Prompt Validator | Pre-flight checks: evidence completeness, template validity, mode match | Deterministic | `scripts/pios/agentic/prompt_validator.py` |
| LLM Invoker | Sends assembled prompt to LLM; records output | Interpretive | `scripts/pios/agentic/llm_invoker.py` |
| Cognitive Normalizer | Post-processes LLM output: terminology normalization, aliasing, qualifier banners | Deterministic | `scripts/pios/agentic/cognitive_normalizer.py` |
| Lineage Recorder | Creates and stores lineage record for each invocation | Deterministic | `scripts/pios/agentic/lineage_recorder.py` |
| Replay Verifier | Compares two lineage records; produces replay_diff | Deterministic | `scripts/pios/agentic/replay_verifier.py` |
| Prompt Linter | Static analysis of template files for governance compliance | Deterministic | `scripts/pios/agentic/prompt_linter.py` |

### 11.2 Implementation Blueprint

```
Prompt Execution Pipeline
─────────────────────────
[INPUT: client_id, run_id, narrative_type, user_query]
    ↓
Mode Resolver
  (reads readiness_state → mode)
  (checks inference_prohibition → block if true)
    ↓
Template Loader
  (loads template by: {narrative_type}-{mode}-v{latest_active})
  (validates: mode matches, evidence sources available)
    ↓
Evidence Assembly Engine
  (reads committed artifacts)
  (builds evidence object with field-level bindings)
  (computes evidence_object_hash)
    ↓
Prompt Validator
  (checks: all placeholders populated)
  (checks: no evidence from non-committed sources)
  (checks: template status = ACTIVE)
    ↓
Prompt Assembler
  (injects evidence object into template placeholders)
  (produces fully-assembled prompt: system + user sections)
    ↓
LLM Invoker
  (sends assembled prompt to LLM)
  (records: model_id, token count, output_hash)
    ↓
Cognitive Normalizer
  (applies terminology normalization table)
  (verifies citations present)
  (prepends qualifier banner if Q-XX ≠ Q-00)
    ↓
Lineage Recorder
  (creates lineage record with all identity components)
  (stores to artifacts/narrative-lineage/)
    ↓
[OUTPUT: normalized narrative + lineage record]
```

### 11.3 Prompt Linting Model

The prompt linter validates template files before they are promoted to ACTIVE status. It checks:

| Lint Rule | Check |
|---|---|
| L-01: Section completeness | All required sections present and in correct order |
| L-02: Metadata completeness | All metadata fields populated |
| L-03: Evidence binding | All `{variable}` placeholders declared in metadata |
| L-04: Mode consistency | Template mode matches permitted readiness states in metadata |
| L-05: Immutable section integrity | IMMUTABLE sections contain all required governance statements |
| L-06: Output constraints present | OUTPUT CONSTRAINTS section includes citation block requirement |
| L-07: No hardcoded client values | Template must not contain literal client IDs or run IDs |
| L-08: Version format | Version string matches `v{integer}.{integer}` pattern |
| L-09: No fabrication enablers | System prompt does not contain phrases like "estimate", "assume", "you can infer" |
| L-10: Replay compatibility declared | `replay_major_version` field populated in metadata |

Linting is run as part of the prompt governance CI check (if CI is configured) and as a pre-promotion manual step.

### 11.4 Governance Integration Model

```
Template Promotion Workflow:
  1. Author creates new template in draft directory
  2. Prompt Linter validates (all L-01..10 checks PASS)
  3. Template moved to docs/prompts/templates/{category}/
  4. prompt_registry_manifest.json updated with new entry
  5. Changes committed (template + manifest update = one commit)
  6. Template is now ACTIVE — available for production use

Template Deprecation Workflow:
  1. Newer version created (step 1–5 above)
  2. Old template: status changed to DEPRECATED in manifest
  3. Old template file moved to docs/prompts/deprecated/
  4. Manifest updated with supersedes pointer
  5. Changes committed
```

---

## 12. Governance Verdict

### 12.1 Verdict Matrix

| Dimension | Verdict | Basis |
|---|---|---|
| Replay safety | PASS | Prompt identity + evidence identity + citation equivalence model; replay diff schema defined |
| Governance integrity | PASS | Immutable governance sections; no runtime prompt mutation; mode locked to gate output |
| Prompt auditability | PASS | Lineage record captures all identity components; lineage stored per invocation |
| Enterprise safety | PASS | INFERENCE_PROHIBITED blocks LLM entirely; mode matrix enforces readiness containment |
| Orchestration containment | PASS | EVIDENCE_ADDITIVE only; max depth 3; no circular chains; no context prose propagation |
| Semantic containment | PASS | Attribution ceiling enforced by grounding rules section; DIAGNOSTIC_ONLY evidence filtered |
| Implementation feasibility | PASS | 11 bounded components; clear deterministic vs interpretive separation; linting model defined |

### 12.2 Critical Required Conclusion Confirmed

> **Prompts become governed executable intelligence artifacts, NOT hidden AI session state.**

This is enforced structurally:
- Every production prompt references a committed template by `template_id + commit_hash`
- Every production invocation produces a lineage record
- No production prompt may be assembled without an evidence object from committed artifacts
- No template section may be mutated at runtime
- The prompt registry manifest is a committed governance artifact — additions require commits

### 12.3 Path Forward

**GOVERNED_PROMPT_ORCHESTRATION_VIABLE — PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.* authorized.**

Immediate handoff: **PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01**

The evidence injection engine (component `evidence_assembler.py`) is the next prerequisite — it reads committed artifacts and builds the evidence object that the prompt assembler injects. Without it, the prompt assembly pipeline cannot run.

---

## 13. Validation

| Check | Result | Evidence |
|---|---|---|
| Prompts become governed artifacts | PASS | Registry + versioning + lineage record + commit requirement; ad-hoc production prompts forbidden |
| Replay model explicit | PASS | 4-component replay identity; replay diff schema; EQUIVALENT/NON_EQUIVALENT/PARTIALLY_EQUIVALENT taxonomy |
| Prompt lineage explicit | PASS | Full JSON lineage schema; storage path defined; chain lineage model |
| Orchestration bounded | PASS | EVIDENCE_ADDITIVE only; max depth 3; no circular; context prose propagation forbidden |
| Semantic containment preserved | PASS | Evidence filtering in DIAGNOSTIC_ONLY; attribution ceiling in grounding rules section; forbidden mutation table |
| Readiness gating preserved | PASS | Mode derived from gate output; INFERENCE_PROHIBITED blocks LLM; mode not user-selectable |
| Governance inheritance explicit | PASS | Section 2 governance load; locked truths table; immutable governance section carries forward |
| No hidden prompt mutation possible | PASS | Immutable sections require major version bump; runtime injection is evidence-only; linting enforces |
| Implementation architecture defined | PASS | 11-component blueprint; prompt execution pipeline; linting model; promotion/deprecation workflow |

**9/9 PASS — GOVERNED_PROMPT_ORCHESTRATION_VIABLE**

---

*End of document.*  
*Stream: PI.AGENTIC.NARRATIVE.PROMPT-GOVERNANCE.01*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Handoff: PI.AGENTIC.NARRATIVE.EVIDENCE-INJECTION.01*
