# Cognitive Normalization Integration

**Stream:** PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01  
**Document type:** NORMALIZATION INTEGRATION ARCHITECTURE — IMPLEMENTATION AUTHORITY  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Branch:** work/lens-v2-productization  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream (schema):** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 (e588150)  
**Upstream (bridge):** PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01 (4e2a9e2)  

---

## 1. Executive Summary

The Cognitive Normalization Integration layer defines how raw GEIOS-derived intelligence outputs are converted into executive-grade language before entering the LENS report_object. It is the translation layer between structural machine-truth and human-readable executive intelligence.

The single governing principle:

> **AI explains structural intelligence. AI does not generate structural truth.**

Normalization changes the language of intelligence. It does not change its meaning, scope, authority, or grounding. Every normalization transformation is:
- deterministic: the same input produces the same output, always
- evidence-preserving: no normalization adds, removes, or reinterprets evidence
- qualifier-preserving: no normalization hides uncertainty or scope limitations
- topology-respecting: no normalization claims more structural depth than the topology supports

This document defines the architecture for cognitive normalization injection — where it happens, what it transforms, what it is forbidden from changing, and how it guarantees executive-grade readability without compromising governed intelligence authority.

---

## 2. Cognitive Normalization Philosophy

### 2.1 What Normalization Is

Cognitive normalization is a **presentation layer transformation**. It operates entirely above the evidence and derivation layers. It is the process of converting technically-correct GEIOS intelligence outputs into language that:
- is readable at executive cognitive standard
- uses consistent, client-configured terminology
- communicates uncertainty clearly without over-hedging
- structures findings in a pattern executives can absorb efficiently

### 2.2 What Normalization Is Not

| Normalization Is Not | Reason |
|---------------------|--------|
| A derivation layer | Normalization never runs signal derivation logic |
| An inference engine | Normalization never generates conclusions |
| A recommendation engine | Normalization never suggests actions |
| A prediction system | Normalization never projects future states |
| A confidence system | Normalization cannot claim more confidence than GEIOS provides |
| An evidence generator | Normalization cannot create evidence that GEIOS did not produce |
| A qualifier override | Normalization cannot suppress or upgrade qualifier state |
| A readiness reclassifier | Normalization cannot change readiness_state classification |
| A topology modifier | Normalization cannot change what the topology contains |

### 2.3 The Normalization Layer Contract

Normalization receives governed artifacts from GEIOS and converts them for the report_object. It sits between evidence production and report rendering:

```
GEIOS SUBSTRATE                    NORMALIZATION LAYER            REPORT OBJECT
──────────────────                ───────────────────────────    ──────────────
Signal derivation (L2/L3)
→ Readiness gate (L8)
→ Evidence injection (L5) ──────→ Receives sealed evidence
→ Cognitive normalization (L6) ─→ Applies ALI-01..07
                                  Applies Q-taxonomy
                                  Applies narrative structure
                                  Applies vocabulary contract  ──→ narrative_block
                                  Produces normalized labels   ──→ evidence_blocks
                                  Preserves qualifiers         ──→ qualifier_class
→ LLM synthesis (L7) ───────────→ Normalizes LLM output       ──→ why_section
→ Executive rendering (L8) ─────→ Verifies normalization       ──→ rendering_metadata
→ COMMIT report_object ─────────────────────────────────────────→ report_object
```

---

## 3. Normalization Architecture

### 3.1 Normalization Injection Points

Normalization is injected at four points in the GEIOS pipeline, all on the GEIOS substrate side before the report_object is committed:

| Injection Point | GEIOS Layer | What Is Normalized |
|----------------|-------------|-------------------|
| Signal label normalization | L6 (post-L3) | CPI/CFA keys → ALI-01/02 labels |
| Readiness label normalization | L6 (post-L8) | readiness_state enum → ALI-03 executive label |
| Domain/topology normalization | L6 (post-L3) | domain IDs, cluster keys → ALI-04/05 aliases |
| Narrative normalization | L6 (post-L7 LLM output) | Raw LLM narrative → executive vocabulary, structure, density |

All normalization is **complete before the report_object is committed**. The LENS rendering layer receives pre-normalized content and renders it as-is. LENS never re-normalizes or supplements normalization.

### 3.2 Normalization Execution Boundaries

| Boundary | Rule |
|----------|------|
| Normalization runs on GEIOS side only | LENS rendering layer never re-runs ALI rules |
| Normalization input | GEIOS derivation outputs + evidence envelope |
| Normalization output | report_object fields (narrative_block, signal labels, qualifier labels, domain aliases) |
| Normalization scope | Presentation fields only — never TAXONOMY-01 raw fields |
| Normalization audit | normalization_version and ali_rules_applied recorded in rendering_metadata |

### 3.3 Normalization Governance Boundaries

Normalization is bounded by evidence. The normalization layer cannot:

- Expand the scope of a finding beyond what evidence supports
- Narrow the scope of a finding to hide evidence
- Generate causal claims not traceable to evidence
- Generate comparative claims without comparative evidence
- Remove qualifier state from any surface

When the normalization layer encounters a gap between what the narrative suggests and what evidence supports, the obligation is:
1. Apply the most accurate qualifier (Q-01 or Q-02 if partial)
2. Include a scope note in the relevant explainability panel
3. Not generate additional narrative to fill the gap

---

## 4. ALI-01..07 Integration Model

The ALI rules (Aliasing Rules 01–07) define the specific term substitutions applied during normalization. Each rule maps a technical source identifier to an executive-facing label.

### 4.1 ALI-01 — Cluster Pressure Index Signal Label

**Source field:** `cpi_score` (TAXONOMY-01) / CPI signal key  
**Target field:** `signal_cards[].signal_label`  
**Output label:** "Cluster Pressure Level" (default) or client-configured alias  
**Application:** Signal card label in evidence blocks and explainability panels  
**Never displays:** "cpi_score", "CPI", numerical threshold values  

**Integration rule:** When constructing a SignalCard for a CPI signal, the `signal_label` field must contain the ALI-01 output label, not the raw CPI key. The mapping is applied at GEIOS L6 before report_object assembly.

### 4.2 ALI-02 — Cluster Fan Asymmetry Signal Label

**Source field:** `cfa_score` (TAXONOMY-01) / CFA signal key  
**Target field:** `signal_cards[].signal_label`  
**Output label:** "Fan Distribution Asymmetry" (default) or client-configured alias  
**Application:** Signal card label in evidence blocks  
**Never displays:** "cfa_score", "CFA", numerical values  

**Integration rule:** Same as ALI-01 but for CFA signals. Both CPI and CFA use the same signal card structure with their respective ALI labels.

### 4.3 ALI-03 — Executive Readiness State Label

**Source field:** `readiness_state` (enum)  
**Target field:** `header_block.readiness_badge.state_label`  
**Mapping:**

| readiness_state | ALI-03 Executive Label |
|-----------------|----------------------|
| EXECUTIVE_READY | "Executive Ready" |
| EXECUTIVE_READY_WITH_QUALIFIER | "Executive Ready — Qualified" |
| DIAGNOSTIC_ONLY | "Under Structural Review" |
| SUPPRESSED_FROM_EXECUTIVE | "Not Available" |
| BLOCKED_PENDING_DOMAIN_GROUNDING | "Pending Grounding" |

**Never displays:** The raw enum key (e.g. "DIAGNOSTIC_ONLY") in any executive surface.

**Integration rule:** The `state_label` in ReadinessBadgeObject must always contain the ALI-03 output, not the raw readiness_state enum value.

### 4.4 ALI-04 — Domain Name Alias

**Source field:** `domain_id` (internal topology identifier)  
**Target field:** `evidence_blocks[].domain_alias`  
**Output label:** Client-configured human-readable domain name  
**Application:** All evidence blocks, topology display, propagation path  
**Never displays:** Raw domain ID, internal topology key, any technical path or system identifier  

**Integration rule:** Domain names are configured per client in the client topology configuration. ALI-04 applies the client-configured domain alias during GEIOS L6 normalization. All references to a domain in narrative text, evidence descriptions, and propagation paths use the alias.

### 4.5 ALI-05 — Cluster Name Alias

**Source field:** `cluster_key` (internal topology identifier)  
**Target field:** Propagation path entries, evidence narrative references  
**Output label:** Client-configured human-readable cluster name  
**Application:** Propagation path arrays; narrative references to specific clusters  
**Never displays:** Raw cluster key or technical cluster identifier  

**Integration rule:** Same pattern as ALI-04 but applied to cluster-level references. When the narrative or propagation path references a specific cluster, the ALI-05 alias is substituted.

### 4.6 ALI-06 — Diagnostic State Label

**Source field:** `DIAGNOSTIC_ONLY` state (subset of ALI-03 domain)  
**Target field:** Qualifier chip label; QUALIFIERS panel content; CONFIDENCE panel content  
**Output label:** "Under Structural Review"  
**Application:** All occurrences of the diagnostic state reference outside the readiness badge context  
**Never displays:** "DIAGNOSTIC_ONLY" as a client-visible string  

**Integration rule:** ALI-06 is a context-specific extension of ALI-03 for cases where the diagnostic state is referenced in body text rather than only in the readiness badge.

### 4.7 ALI-07 — Suppressed Signal Handling

**Source field:** `SUPPRESSED_FROM_EXECUTIVE` state; Q-04 qualifier signals  
**Target field:** Section absence notice text  
**Output behavior:** Section renders an explicit absence notice, not a label for the suppressed state  
**Notice text:** "Signal intelligence withheld from this view"  
**Never displays:** "SUPPRESSED_FROM_EXECUTIVE" as a label; never renders suppressed content silently  

**Integration rule:** When ALI-07 applies, the normalization layer produces an absence notice string rather than a signal label. The absence notice is rendered in place of the signal content. Q-04 signals are not rendered at all — their absence is the notice.

---

## 5. Qualifier Rendering Integration

### 5.1 Qualifier Rendering Model

Qualifiers communicate evidence scope accurately and professionally. The qualifier rendering model integrates with the report_object at three surfaces:

1. **Readiness badge** — qualifier_label on ReadinessBadgeObject
2. **Signal cards** — qualifier_label per SignalCard
3. **Explainability panels** — QUALIFIERS panel; CONFIDENCE panel

### 5.2 Q-00 — Fully Grounded

**Rendering:** No qualifier chip; clean readiness badge surface  
**Scope note:** None required  
**Signal card behavior:** No qualifier indicator on signal cards  
**Normalization obligation:** Do not introduce uncertainty language in Q-00 state; full evidence surface  

### 5.3 Q-01 — Partially Grounded

**Rendering:** Amber qualifier chip on readiness badge and affected signal cards  
**Chip label:** "Partial Grounding"  
**Tooltip text (generated at normalization time):** "Analysis based on [n] of [total] grounded domains. Findings reflect confirmed structural topology within the analyzed scope."  
**Scope note injected into narrative:** Brief scope acknowledgment at end of executive_summary (not at the beginning; conclusion still first)  
**QUALIFIERS panel content:** Full explanation of partial coverage; which domains are grounded; what the implications are  
**Normalization rule:** The scope note must not be apologetic. It communicates fact: the analysis covers confirmed scope. The intelligence within that scope is valid.  

### 5.4 Q-02 — Structurally Grounded

**Rendering:** Blue scope chip on readiness badge and relevant modules  
**Chip label:** "Structural View"  
**Tooltip text:** "Structural topology confirmed. Semantic depth reflects available domain grounding."  
**Scope note injected into narrative:** None in executive_summary; present in CONFIDENCE panel  
**Normalization rule:** Q-02 applies when topology is structurally confirmed but semantic enrichment is partial (e.g., STRUCTURAL_LABELS_ONLY path). The intelligence is structurally sound but less semantically rich.  

### 5.5 Q-03 — Diagnostic Qualified

**Rendering:** Grey "Under Review" indicator on readiness badge  
**Chip label:** "Under Structural Review"  
**Tooltip text:** "This analysis is under structural review. Advisory confirmation recommended before executive action."  
**Narrative adjustment:** executive_summary and why_section framed as diagnostic findings; structural_summary still rendered  
**Normalization rule:** Diagnostic intelligence is still intelligence. The normalization layer presents diagnostic findings as diagnostic — not as inferior or broken. The frame is: "this is what we see under current structural review conditions."  

### 5.6 Q-04 — Suppressed

**Rendering:** Section absence notice only; no signal content  
**Notice text:** "Signal intelligence withheld from this view" (ALI-07 output)  
**Normalization rule:** No normalization is applied to Q-04 signals — they are not rendered. The absence notice is the only output. This is never silent.  

### 5.7 Qualifier Immutability Under Normalization

Normalization cannot change `qualifier_class`. Normalization receives `qualifier_class` from the governance verdict and applies corresponding rendering rules. Normalization may:
- Apply tooltip text from the Q-taxonomy
- Apply scope notes based on qualifier class
- Apply chip color tokens based on qualifier class

Normalization may never:
- Set `qualifier_class` to a different value
- Suppress a qualifier chip because the narrative reads as confident
- Remove a scope note because the evidence density seems high
- Upgrade Q-01 to Q-00 because most domains are grounded

---

## 6. Executive Vocabulary Contract

### 6.1 Approved Signal Vocabulary

All signal-related terminology in the executive surface must use normalized terms:

| Technical Source | Executive Surface Label |
|-----------------|------------------------|
| cpi_score | "Cluster Pressure Level" |
| cfa_score | "Fan Distribution Asymmetry" |
| High CPI/CFA | "Elevated pressure" / "High concentration" |
| Low CPI/CFA | "Stable pressure" / "Balanced distribution" |
| activation_state = ACTIVE | "Active signal" |
| activation_state = INACTIVE | (not rendered in executive surface) |

### 6.2 Approved Readiness Vocabulary

| Technical State | Executive Label |
|----------------|----------------|
| EXECUTIVE_READY | "Executive Ready" |
| EXECUTIVE_READY_WITH_QUALIFIER | "Executive Ready — Qualified" |
| DIAGNOSTIC_ONLY | "Under Structural Review" |
| SUPPRESSED_FROM_EXECUTIVE | "Not Available" |
| BLOCKED_PENDING_DOMAIN_GROUNDING | "Pending Grounding" |

### 6.3 Approved Structural Vocabulary

| Technical Concept | Executive Vocabulary |
|------------------|---------------------|
| Cluster pressure propagation | "Execution pressure flows through [alias]" |
| High CPI cluster | "[Alias] shows concentrated execution load" |
| Asymmetric fan pattern | "[Alias] shows uneven distribution across downstream clusters" |
| Topology path | "Pressure path: [A] → [B] → [C]" (using aliases) |
| Domain analysis | "[Domain alias] structural analysis" |
| Grounding status | "Full Coverage" / "Partial Coverage" / "Structural View" |

### 6.4 Approved Propagation Vocabulary

| Propagation Concept | Approved Phrasing |
|--------------------|------------------|
| Pressure origin | "Execution pressure originates in [domain alias]" |
| Pressure receiver | "[Domain alias] receives pressure from [source alias]" |
| Pass-through node | "[Domain alias] channels pressure from [source] to [target]" |
| Isolated domain | "[Domain alias] shows independent pressure patterns" |
| Structural bottleneck | "[Domain alias] shows structural concentration" |
| Cascade risk | "[Domain alias] structural pattern creates downstream concentration" |

### 6.5 Approved Explainability Vocabulary

| Concept | Approved Panel Label |
|---------|---------------------|
| Why this state | "Why This Readiness State" |
| Evidence source | "Structural Evidence" |
| Derivation trace | "Analysis Trace" |
| Active qualifiers | "Evidence Scope" |
| Lineage reference | "Analysis Provenance" |
| Grounding depth | "Coverage Confidence" |
| Readiness detail | "Readiness Classification Detail" |

### 6.6 Forbidden Vocabulary

The following vocabulary categories are permanently forbidden from the executive surface:

**Category A — GEIOS Internal Terms:**
- "TAXONOMY-01", "signal_value", "activation_state", "signal_stable_key", "derivation_hash"
- "CPI", "CFA" (as raw acronyms in executive text)
- "Lane A", "Lane B", "DPSIG", "EXSIG", "ORGSIG"
- Any governance rule ID (AS-01, N-SAF-01, etc.)
- "L1", "L2", "L3"... (layer references)
- "evidence_object_hash"
- "GEIOS", "GEIOS substrate"

**Category B — AI/LLM Terms:**
- "AI", "artificial intelligence", "machine learning", "LLM", "large language model"
- "prompt", "prompt engineering", "token", "embedding", "vector"
- "RAG", "retrieval", "retrieval-augmented generation"
- "hallucination", "confabulation"
- "model", "inference engine"
- "agent", "orchestration", "multi-agent"
- "copilot" (before Phase 5; reserved term)

**Category C — Predictive Language:**
- "will", "will result in", "will cause" (predictive form)
- "predicts", "forecasts", "projects" (in structural context)
- "is likely to", "is expected to"
- "should lead to", "should result in"
- "anticipated", "projected outcome"

**Category D — Recommendation Language:**
- "should", "must", "ought to" (as directives to executive)
- "we recommend", "action item"
- "immediate action required", "urgent"
- "fix", "resolve", "address" (as directives from report)
- "you should", "the team should"

**Category E — Speculative/Probabilistic Language:**
- "possibly", "perhaps", "maybe", "might be"
- "could indicate", "may suggest" (ungrounded inference)
- "our analysis suggests" (personalizing inference)
- Confidence percentages without grounding proof

**Category F — Apologetic/Emotional Language:**
- "unfortunately", "regrettably", "sadly"
- "we're unable to provide", "we're sorry to report"
- "we believe", "we feel", "we think"
- "good news", "bad news"

**Category G — Consumer AI Phrasing:**
- "I", "I think", "I believe", "I found"
- "Let me explain", "Sure!", "Certainly!"
- Conversational filler phrases
- Emoji or decorative punctuation

---

## 7. Narrative Structure Rules

### 7.1 Inverted Pyramid Structure

Executive narrative follows the inverted pyramid: most important finding first, supporting evidence following, detail last.

```
EXECUTIVE_SUMMARY STRUCTURE:
┌─────────────────────────────────────────────────┐
│ LAYER 1: Readiness conclusion (1 sentence)      │
│ LAYER 2: Primary structural finding (1-2 sent.) │
│ LAYER 3: Supporting evidence summary (1-2 sent.)│
│ LAYER 4: Qualifier scope (if Q-01/02, 1 sent.)  │
└─────────────────────────────────────────────────┘

WHY_SECTION STRUCTURE:
┌─────────────────────────────────────────────────┐
│ LAYER 1: Primary cause statement (1 sentence)   │
│ LAYER 2: Contributing signal description        │
│ LAYER 3: Propagation context (if relevant)      │
│ LAYER 4: Qualifier scope (if applicable)        │
└─────────────────────────────────────────────────┘
```

### 7.2 Executive-First Phrasing

Findings are stated in terms of their executive significance, not in terms of their technical mechanism:

| Technical | Executive |
|-----------|-----------|
| "CPI exceeds the 0.7 threshold in Cluster X" | "[Domain alias] shows elevated execution pressure" |
| "CFA asymmetry coefficient is 0.83" | "[Domain alias] shows uneven distribution across downstream clusters" |
| "The derivation trace shows L2 contribution from cluster key abc123" | "[Domain alias] concentration drives [Domain alias B] pressure" |

### 7.3 Structural-First Explanation

Structural explanations describe what the topology shows before explaining what it means:

Structure: "[Domain A alias] shows concentrated pressure in [cluster alias]."
Meaning: "This pattern indicates structural bottleneck rather than capacity issue."

This order prevents the executive from receiving an interpretation before understanding the structural basis.

### 7.4 Sentence Length and Readability

- Maximum 25 words per sentence in executive_summary and why_section
- Sentences are complete (subject + verb + object)
- No nested clauses in primary finding sentences
- Technical compound terms are expanded (no acronyms in executive surface)

### 7.5 Finding Density Rules

- executive_summary: maximum 3 primary findings; additional findings in structural_summary
- signal cards: maximum 5 signal cards visible by default; additional cards in expanded evidence drawer
- propagation path: maximum 5 nodes displayed by default; full path in trace block

These density rules do not discard evidence — they establish default visibility. All evidence is accessible via progressive disclosure.

---

## 8. Explainability Normalization

### 8.1 WHY Panel Normalization

The WHY panel answers: "Why does this readiness state exist?"

Normalization obligations for WHY panel content:
- Lead with the primary causal statement (ALI-normalized)
- Contributing signals listed with ALI-01/02 labels
- Propagation context uses ALI-04/05 aliases
- Qualifier scope noted at end if Q-01/02 active
- No predictive language ("this will cause...")
- No recommendation language ("this requires...")
- No technical field names

Normalization structure for WHY panel:
```
Primary cause: "[Domain alias] shows [pressure indicator] due to [contributing signal alias]."
Contributing signals: "[Signal label]: [Evidence text (normalized)]"
Propagation: "This [propagation verb] [downstream domain alias]." (if applicable)
Scope qualifier: "[Scope note]." (if Q-01/02 active)
```

### 8.2 EVIDENCE Panel Normalization

The EVIDENCE panel renders per-domain evidence blocks at explainability depth:

Normalization obligations:
- domain_alias applied to all domain headers
- signal_label uses ALI-01/02 outputs
- evidence_text is normalized narrative (no raw field names)
- grounding_label uses Q-taxonomy-derived scope language
- propagation_role rendered as: "Origin of Pressure" / "Pressure Receiver" / "Pass-through" / "Independent"

### 8.3 TRACE Panel Normalization

The TRACE panel provides audit-grade derivation trace. Audience: ADVISORY.

Normalization obligations:
- propagation_path entries use ALI-04/05 aliases
- derivation_lineage_ref rendered as a reference label, not decoded
- No TAXONOMY-01 raw field values
- No governance rule identifiers
- No numerical derivation values (thresholds, scores, hashes)

### 8.4 QUALIFIERS Panel Normalization

The QUALIFIERS panel lists all active qualifier labels and scope notes:

- Each active qualifier rendered with its Q-taxonomy label and scope description
- Q-00 state: panel shows "Full Evidence Coverage — no scope qualifications"
- Q-01: "Partial Domain Coverage — [n] of [total] domains grounded"
- Q-02: "Structural Topology Confirmed — semantic enrichment reflects available grounding"
- Q-03: "Under Structural Review — advisory confirmation recommended before executive action"
- Q-04: "Signals withheld from executive view"

### 8.5 CONFIDENCE Panel Normalization

The CONFIDENCE panel communicates grounding depth and evidence completeness:

- grounded_domain_count vs domain_count rendered as scope coverage statement
- Q-taxonomy label for current qualifier
- Implication for intelligence scope: what can be concluded vs what requires deeper grounding
- No confidence percentages without corresponding grounding proof

### 8.6 LINEAGE Panel Normalization

The LINEAGE panel provides provenance for advisory/audit. Limited normalization applies:

- baseline_anchor rendered as readable baseline label
- stream_anchor rendered as reference identifier (not decoded)
- run_id rendered as reference identifier
- evidence_object_hash: abbreviated for ADVISORY (first 8 chars + "..."); full for AUDIT
- derivation_hash: not shown for ADVISORY; reference ID for AUDIT

---

## 9. Propagation and Pressure Normalization

### 9.1 Pressure Level Normalization

CPI/CFA numerical values are never exposed in the executive surface. The normalization layer converts signal derivation outputs to pressure tier labels:

| Derivation Bucket | PressureTier | Executive Phrase |
|------------------|--------------|-----------------|
| Above upper threshold | HIGH | "High execution pressure" / "Elevated concentration" |
| Above moderate threshold | ELEVATED | "Elevated pressure" / "Above baseline concentration" |
| Within normal range | MODERATE | "Moderate pressure" / "Normal distribution pattern" |
| Below normal range | LOW | "Low pressure" / "Stable distribution" |

The specific threshold values that define each bucket are GEIOS-internal. The normalization layer receives the `pressure_tier` enum from the derivation output — it does not re-compute buckets.

### 9.2 Propagation Direction Language

Propagation language describes structural pressure flow using spatial and directional metaphors:

| Direction | Approved Phrasing |
|-----------|------------------|
| Source of pressure | "originates in", "is concentrated in", "emanates from" |
| Flow through | "flows through", "passes through", "channels through" |
| Destination | "reaches", "affects", "places load on" |
| Bidirectional | "creates mutual pressure between [A] and [B]" |
| Isolated | "shows independent pressure pattern", "is structurally isolated" |

### 9.3 Propagation Scope Rules

Propagation descriptions must be bounded by evidence:
- Only describe propagation paths that appear in the committed trace evidence
- Do not extend propagation beyond what topology analysis confirmed
- If propagation path is partial (Q-01), scope note applies to propagation description

### 9.4 Structural Pattern Normalization

Technical structural patterns are rendered in business-intelligible language:

| Technical Pattern | Executive Phrase |
|------------------|-----------------|
| High CPI + asymmetric CFA | "Structural bottleneck — concentrated load with uneven downstream distribution" |
| High CPI + symmetric CFA | "Uniform high pressure across distribution — capacity constraint pattern" |
| Low CPI + asymmetric CFA | "Structural imbalance without overall pressure elevation" |
| Propagating CPI chain | "Cascading pressure from [origin alias] through [path]" |
| Isolated high CPI cluster | "Localized pressure concentration in [cluster alias]" |

---

## 10. Forbidden Language and Behaviors

### 10.1 Forbidden Narrative Behaviors

These behaviors are forbidden regardless of the underlying structural finding:

| Forbidden Behavior | Why Forbidden | Normalization Control |
|------------------|---------------|-----------------------|
| Generating recommendations | Report is intelligence, not prescription | NORM-FORBID-02 |
| Predicting future states | No predictive authority in governed structural derivation | NORM-FORBID-01 |
| Expressing urgency | Urgency is advisory judgment, not structural fact | NORM-FORBID-02 |
| Personalized AI phrasing | Chatbot UX forbidden before Phase 5 | NORM-FORBID-04 |
| Confidence claims without grounding | Violates qualifier preservation | NORM-FORBID-03 |
| Apologetic framing | Uncertainty is scope; scope is factual | NORM-FORBID-04 |
| Structural comparison without evidence | No benchmarking claims without comparative evidence | NORM-FORBID-03 |
| Implying resolution availability | Advisory determines remediation, not the report | NORM-FORBID-02 |

### 10.2 Forbidden Intelligence Generation

Normalization cannot generate:
- Causal claims not traceable to committed evidence artifacts
- Performance comparisons not supported by comparative topology data
- Trend statements without a committed historical evidence baseline
- Organizational conclusions (who owns what, who caused what)
- Financial impact statements
- Risk ratings not derived from GEIOS risk signal families

### 10.3 Normalization Containment Principle

When the normalization layer cannot produce a clean normalized output for a given field — because:
- the source value maps to no ALI rule
- the evidence scope is too narrow to support a narrative
- the qualifier restricts what can be said

The normalization layer must:
1. Apply the most conservative valid normalization
2. Flag the field with DIAGNOSTIC treatment
3. Not invent alternative content to fill the gap

The report_object must reflect reality. Normalization that fills gaps is worse than normalization that acknowledges them.

---

## 11. Deterministic Normalization Guarantees

### 11.1 Determinism Requirements

Normalization is deterministic by contract:

| Requirement | Rule |
|-------------|------|
| Same input → same output | NORM-DET-01: ALI rule + source value → always the same executive label |
| No session state influence | NORM-DET-02: normalization is stateless; report context does not affect ALI output |
| No time-variance | Normalization output does not change based on when it runs |
| No client-state dependence | Client configuration (ALI-04/05 aliases) is fixed at analysis time |
| Version stability | normalization_version in rendering_metadata ensures output is traceable |

### 11.2 Normalization Versioning

The normalization dictionary (17-term dictionary + ALI-01..07 + Q-00..Q-04) is versioned. The version is recorded in `rendering_metadata.normalization_version`.

Rules:
- The normalization version is set at report_object generation time
- If the normalization dictionary is updated, a new version is assigned
- Existing reports retain their original normalization_version
- LENS renders the normalization outputs from the committed report_object — it does not re-run normalization
- A normalization version mismatch between report_object.rendering_metadata.normalization_version and the current active normalization dictionary triggers a DIAGNOSTIC notice (NORM-DIAG-02)

### 11.3 Determinism Verification

Every report_object includes `rendering_metadata.ali_rules_applied` — the list of ALI rules that were applied during normalization. This list enables:
- Verification that correct rules were applied for the given client configuration
- Replay verification: re-running normalization with same inputs + same ALI version produces same report_object
- Audit: any anomaly in executive surface labels traces to specific ALI rule application

---

## 12. Failure and Diagnostic Handling

### 12.1 Normalization Failure Classification

| Failure Type | Trigger | Treatment |
|--------------|---------|-----------|
| ALI rule miss | Source value has no ALI mapping | DIAGNOSTIC notice; technical label suppressed (blank, not raw label) |
| Normalization version mismatch | rendering_metadata.normalization_version outdated | DIAGNOSTIC notice on narrative block |
| Empty narrative block | LLM synthesis produced empty output | BLOCKED state; no silent fallback |
| Vocabulary violation detected | Forbidden term found in generated text | BLOCKED state; governance violation |
| Qualifier injection failure | qualifier_class present but Q-taxonomy lookup fails | BLOCKED state; ROM-VAL-07 |

### 12.2 Diagnostic Notice Rendering

When DIAGNOSTIC treatment applies:
- A banner appears on the affected module section: "Section under advisory review — contact your analysis team"
- The QUALIFIERS panel includes a diagnostic notice entry
- The report is not blocked (unless a BLOCKED condition is also triggered)
- Evidence panels and readiness badge continue to render

### 12.3 Blocked State Trigger from Normalization

Normalization triggers BLOCKED (not DIAGNOSTIC) when:
- The narrative_block is empty after normalization
- A vocabulary violation is detected in the generated narrative (forbidden term present)
- The normalization pipeline fails to produce any output for a required field

BLOCKED triggered by normalization failure produces the same behavior as BLOCKED from governance_verdict FAIL: explicit BLOCKED state visible, no intelligence content rendered, no silent fallback.

---

## 13. Governance Preservation

### 13.1 Evidence Authority Preserved

Normalization never touches evidence artifacts. The evidence_object_hash is set before normalization runs. Normalization applies ALI labels to the display fields of evidence blocks — it does not modify the evidence content or the hash.

**Rule:** `evidence_object_hash` value is immutable through the normalization pipeline. If normalization changes `evidence_object_hash`, execution is invalid.

### 13.2 Qualifier Integrity Preserved

Normalization applies qualifier rendering rules but never modifies `qualifier_class`. The qualifier class is set by the GEIOS readiness gate and is immutable through all downstream stages including normalization.

**Rule:** Normalization may add tooltip_text, chip color token, and scope notes based on qualifier_class. It may not change qualifier_class.

### 13.3 Topology Fidelity Preserved

Normalization applies ALI-04/05 aliases to domain and cluster names. It does not change what domains or clusters are present in the topology, what their relationships are, or what signals they carry.

**Rule:** ALI-04/05 are pure label substitutions. The structural topology is unchanged by normalization.

### 13.4 Readiness State Authority Preserved

Normalization applies ALI-03 to produce the readiness badge state_label. It does not change readiness_state. The DPSIG readiness gate classification is the only authority over readiness state.

**Rule:** ALI-03 is a read-only label mapping. The readiness_state enum value is unchanged.

### 13.5 Rendering Immutability from Normalization Point

Once the report_object is committed with normalization applied:
- The LENS rendering layer does not re-run normalization
- The LENS rendering layer renders the pre-normalized content as-is
- No rendering-time normalization supplements or modifies the committed normalized content

**Rule (NORM-DET-01):** LENS is a rendering layer, not a normalization layer.

---

## 14. Future Compatibility

### 14.1 Phase 3+ Compatibility

The normalization integration defined here is forward-compatible with Phase 3+ workspace features:
- Explainability sidebar (Phase 3): renders from pre-normalized explainability_bundle
- Interactive evidence drawers (Phase 3): content is pre-normalized; no re-normalization at interaction time
- Investigation answers (Phase 4): investigation answers go through the same normalization pipeline
- Copilot responses (Phase 5): copilot output must pass through normalization before reaching executive surface

### 14.2 New ALI Rule Extension

Future ALI rules (ALI-08+) may be added by:
- Issuing a cognitive stabilization stream (as per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md Stage 6)
- Incrementing normalization_version
- Registering the new rule in the normalization_rules_registry.json

No new ALI rule is active until formally registered. The normalization_version must change when new rules are added.

### 14.3 New Signal Family Normalization

When future GEIOS signal families (EXSIG, ORGSIG, FLOWSIG, RISKSIG, TIMSIG, RUNSIG, OPSIG) are activated (Phase 6), each new signal type requires:
- A corresponding ALI rule (extending ALI-08+)
- A signal_vocabulary entry in executive_vocabulary_contract.json
- A normalization registry entry

No new signal family may render in the executive surface without a corresponding ALI rule and vocabulary registration.

---

## 15. Validation

See `COGNITIVE_NORMALIZATION_VALIDATION.md` for the complete validation record.

**Summary:** All normalization injection points defined. ALI-01..07 fully integrated. Q-00..Q-04 rendering semantics complete. Executive vocabulary contract defined. Forbidden vocabulary catalog complete. Deterministic normalization guaranteed. Qualifier preservation rules established. No AI interaction surfaces introduced. No GEIOS internals exposed.

**Verdict:** COGNITIVE_NORMALIZATION_INTEGRATION_VIABLE

---

*Stream PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01 — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
