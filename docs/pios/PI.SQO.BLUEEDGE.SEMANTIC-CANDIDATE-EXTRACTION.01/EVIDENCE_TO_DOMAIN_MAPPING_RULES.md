# Evidence-to-Domain Mapping Rules

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01
**Type:** Reusable Doctrine — Mapping Mechanics

---

## 1. Purpose

This document defines how semantic candidates are mapped from evidence material to BlueEdge domains. It governs when mapping succeeds, when it must fail visible, and how mapping avoids semantic fabrication.

## 2. Mapping Resolution Methods

Three resolution paths exist, applied in the following priority order:

### 2.1 Domain Keyword Map (Primary)

Used by: DOMAIN_KEYWORD_MAPPING and HEADING_EXTRACTION methods.

The extractor maintains a static keyword map (`DOMAIN_KEYWORD_MAP`) that maps human-readable domain names to DOMAIN-XX identifiers. When extracted text contains a keyword as a substring, the first matching entry resolves the domain.

**Resolution is deterministic:** the map is iterated in insertion order, and first-match wins.

**Abbreviated forms are supported:** "Platform Infrastructure" resolves to DOMAIN-10 even when the full name "Platform Infrastructure and Data" is not present.

### 2.2 Direct Chip Text (Secondary)

Used by: ARCHITECTURE_LAYER_MAPPING method.

When the evidence HTML contains explicit DOMAIN-XX identifiers in chip elements (e.g., `<span class="t2-chip">DOMAIN-10</span>`), the chip text IS the domain identifier. No keyword mapping is needed.

### 2.3 Evidence Registry Scope (Tertiary)

Used by: HEADING_EXTRACTION and TABLE_LABEL_EXTRACTION for GAUGE artifacts and claims.

When a GAUGE artifact or claim has exactly one entry in its `candidate_domains` array in the evidence registry, that domain is used. When it has multiple entries, the candidate is marked UNMAPPED_CANDIDATE.

## 3. How NONE Domains Are Targeted

Domains at `lineage_status = NONE` in the semantic debt inventory have no existing lineage evidence. Semantic candidates target these domains through the same mapping resolution as any other domain — the extractor does not distinguish NONE from other states.

Current NONE domains with candidates:
- DOMAIN-02, DOMAIN-03, DOMAIN-04, DOMAIN-05, DOMAIN-06, DOMAIN-07, DOMAIN-08, DOMAIN-09, DOMAIN-10, DOMAIN-12, DOMAIN-13, DOMAIN-15, DOMAIN-17

The candidates targeting NONE domains are signals that evidence material references those domains. They are NOT evidence that the domain has grounding. They are candidate signals that may later enter Dynamic CEU admissibility evaluation to determine whether they can contribute to lineage improvement.

## 4. How PARTIAL Domains Are Targeted

Domains at `lineage_status = PARTIAL` have some existing lineage evidence but insufficient for full grounding. Candidates target PARTIAL domains through the same mapping resolution.

Current PARTIAL domain with candidates:
- DOMAIN-11 (Event-Driven Architecture) — 2 candidates

Candidates targeting PARTIAL domains are additional signals that may supplement existing partial lineage. They do not automatically improve grounding status.

## 5. When Mapping Must Fail Visible

Mapping MUST produce `UNMAPPED_CANDIDATE` when:

1. **No keyword match:** The extracted text does not contain any keyword from DOMAIN_KEYWORD_MAP
2. **Multi-domain scope:** A GAUGE artifact has `candidate_domains.length > 1` in the evidence registry, making single-domain resolution ambiguous
3. **Capability references:** CAP-XX identifiers cannot be resolved to a single domain without a capability-to-domain mapping table (which does not exist in this corridor)
4. **Cross-domain sections:** Diagnostic section titles that span organizational boundaries rather than addressing a single domain

Unmapped candidates MUST:
- Appear in the cockpit UI in a dedicated "Unmapped Candidates" section
- Display an explicit UNMAPPED badge
- Be counted in the summary as `unmapped_candidates`
- Be flagged with `is_unmapped: true` in the view model
- NOT be hidden, suppressed, silently discarded, or forced into an incorrect domain

## 6. How Mapping Avoids Semantic Fabrication

The mapping system is constrained to avoid fabricating domain relationships:

### 6.1 No Inference

The keyword map is static. No inference, context analysis, or semantic reasoning is used to resolve domains. If the text does not contain a keyword, the candidate is unmapped.

### 6.2 No Force-Mapping

When a candidate cannot be resolved, it is marked UNMAPPED_CANDIDATE. The system never guesses, approximates, or picks the "closest" domain.

### 6.3 No Cross-Evidence Mapping

A candidate's domain is resolved from the candidate's own evidence file and source span. No information from other evidence files is used to inform domain resolution.

### 6.4 No Domain Creation

The keyword map only maps to existing BlueEdge domains (DOMAIN-01 through DOMAIN-17). No new domains can be created by the extractor.

### 6.5 No Hierarchical Resolution

The keyword map is flat. There is no parent/child domain hierarchy that could produce cascading or inherited mappings.

## 7. How This Prepares Dynamic CEU Admissibility

Semantic candidates with domain mappings provide the input signals for future Dynamic CEU admissibility evaluation:

```
Candidate (mapped to DOMAIN-XX)
  → Dynamic CEU evaluates:
    - Does this candidate provide evidence relevant to DOMAIN-XX?
    - Does the evidence type meet admissibility criteria?
    - Is the confidence class sufficient?
    - Does the candidate conflict with existing domain state?
  → Output: CEU_ADMISSIBLE_CANDIDATE or CEU_REJECTED_CANDIDATE
```

Unmapped candidates may still enter CEU if a future capability-to-domain mapping is established, or may be manually mapped through governance review.

The mapping rules in this document define the **input preparation** for CEU. They do NOT define CEU evaluation criteria, scoring, or acceptance thresholds — those are governed by a future contract.

## 8. Mapping Stability

The domain keyword map is client-specific. For BlueEdge, the map covers 17 domains with 19 keyword entries (including 2 abbreviated forms).

The map MUST be updated if:
- A new BlueEdge domain is added
- A domain is renamed
- Evidence artifacts begin using new terminology for existing domains

The map MUST NOT be updated to force-resolve currently unmapped candidates without genuine textual evidence.
