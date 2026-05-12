# Semantic Extraction Grammar

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01
**Type:** Reusable Doctrine — Extraction Mechanics

---

## 1. Purpose

This document defines the deterministic extraction grammar used to decompose registered HTML evidence material into non-authoritative semantic candidates. It is the authoritative reference for what extraction can do, what it cannot do, and how it must behave.

## 2. Allowed Extraction Methods

Six extraction methods are authorized. Each operates on HTML source text using deterministic pattern matching. No method may introduce inference, probabilistic classification, or AI interpretation.

### 2.1 HEADING_EXTRACTION

**What it extracts:** Content from HTML heading elements, `<title>` tags, and elements with heading-class CSS selectors (e.g., `.signal-title`, `.focus-domain-name`).

**Pattern:** Regex matching of element content between opening and closing tags.

**Source span:** References the element type and matched content text.

**Candidate types produced:** STRUCTURAL_SIGNAL, GAUGE_ARTIFACT_TITLE, FOCUS_DOMAIN_DESIGNATION.

**Confidence class determination:** Inherits from the evidence source's own confidence markup (e.g., `.confidence-badge.strong` → STRONG) when available. Defaults to STRONG for titled artifacts.

### 2.2 SECTION_TITLE_EXTRACTION

**What it extracts:** Section titles from structured section headers. Targets elements with section-numbering and title pairs (e.g., `.t2-section-num` + `.t2-section-title`).

**Pattern:** Regex matching adjacent numbered section header and title elements.

**Source span:** References the section number and title text.

**Candidate types produced:** DIAGNOSTIC_SECTION, FOCUS_DOMAIN_DESIGNATION.

**Confidence class determination:** MODERATE for diagnostic sections (structural organization signals). STRONG for explicitly designated focus domains.

### 2.3 TABLE_LABEL_EXTRACTION

**What it extracts:** Labeled metadata fields and structured key-value pairs. Targets metadata blocks (`.mk` + `.mv` pairs), authoritative value declarations (`<h2>Authoritative Value</h2>` + `<p>`), and similar tabular label patterns.

**Pattern:** Regex matching label-value pairs in metadata regions.

**Source span:** References the label key and value content.

**Candidate types produced:** GAUGE_CLAIM_LABEL, GAUGE_METRIC_VALUE.

**Confidence class determination:** STRONG — these are explicit labeled values in structured metadata.

### 2.4 DOMAIN_KEYWORD_MAPPING

**What it extracts:** Domain grounding status by matching domain name text against a known keyword map. Targets `.domain-card` elements containing `.domain-name` and `.domain-tag` children.

**Pattern:** Regex matching domain card structures with class, name, and tag sub-elements.

**Source span:** References the domain card class, domain name text, and grounding tag text.

**Candidate types produced:** DOMAIN_GROUNDING_STATUS.

**Domain resolution:** Uses `DOMAIN_KEYWORD_MAP` (see §3) to resolve domain name text to DOMAIN-XX identifiers.

**Confidence class determination:** STRONG if grounding tag contains "Grounded" (case-insensitive) without "Weak". MODERATE otherwise (including "Weakly Grounded" and "Focus Domain").

### 2.5 ARCHITECTURE_LAYER_MAPPING

**What it extracts:** Explicit domain references from diagnostic chip elements. Targets `<span class="t2-chip">DOMAIN-XX</span>` patterns where the chip text is an exact DOMAIN-XX identifier.

**Pattern:** Regex matching chip elements containing `DOMAIN-\d+` text.

**Source span:** References the chip element and its text content.

**Candidate types produced:** DIAGNOSTIC_DOMAIN_REFERENCE.

**Domain resolution:** Direct — the chip text IS the domain identifier.

**Confidence class determination:** MODERATE — these are structural references, not grounding assertions.

**Deduplication:** Only the first occurrence of each DOMAIN-XX within a single evidence file produces a candidate.

### 2.6 MODULE_CAPABILITY_MAPPING

**What it extracts:** Capability references from diagnostic chip elements. Targets `<span class="t2-chip">CAP-XX</span>` patterns where the chip text is an exact CAP-XX identifier.

**Pattern:** Regex matching chip elements containing `CAP-\d+` text.

**Source span:** References the chip element and its text content.

**Candidate types produced:** DIAGNOSTIC_CAPABILITY_REFERENCE.

**Domain resolution:** UNMAPPED_CANDIDATE — capability IDs cannot be deterministically resolved to a single domain without a capability-to-domain mapping table.

**Confidence class determination:** WEAK — capability references indicate structural presence but provide limited semantic signal without domain context.

**Deduplication:** Only the first occurrence of each CAP-XX within a single evidence file produces a candidate.

## 3. Domain Keyword Map

The domain keyword map is a static, deterministic lookup table mapping human-readable domain names (as they appear in evidence HTML) to DOMAIN-XX identifiers.

```
Edge Data Acquisition                    → DOMAIN-01
Telemetry Transport and Messaging        → DOMAIN-02
Telemetry Transport                      → DOMAIN-02
Fleet Core Operations                    → DOMAIN-03
Fleet Vertical Extensions                → DOMAIN-04
Analytics and Intelligence               → DOMAIN-05
AI/ML Intelligence Layer                 → DOMAIN-06
Sensor and Security Ingestion            → DOMAIN-07
Real-Time Streaming and Gateway          → DOMAIN-08
Access Control and Identity              → DOMAIN-09
Platform Infrastructure and Data         → DOMAIN-10
Platform Infrastructure                  → DOMAIN-10
Event-Driven Architecture               → DOMAIN-11
SaaS Platform Layer                      → DOMAIN-12
External Integration                     → DOMAIN-13
Frontend Application                     → DOMAIN-14
EV and Electrification                   → DOMAIN-15
Operational Engineering                  → DOMAIN-16
Extended Operations and Driver Services  → DOMAIN-17
```

**Matching rule:** First-match wins. The map is iterated in insertion order. If the extracted text contains a keyword as a substring, the corresponding DOMAIN-XX is returned.

**Abbreviated forms:** Some domains have abbreviated keyword entries (e.g., "Platform Infrastructure" → DOMAIN-10, "Telemetry Transport" → DOMAIN-02) to handle evidence that uses shortened domain names.

**No match:** Returns `UNMAPPED_CANDIDATE`.

## 4. Source Span Requirements

Every candidate MUST carry a `source_span_reference` field. This field:

- Identifies the HTML element type or CSS class that was matched
- Quotes the matched text content (truncated to 60 characters for signal titles)
- Uses the format: `element-or-class > child-selector:"matched text"`
- Is sufficient for a human to locate the extraction source in the original HTML

Source spans are not XPath or DOM coordinates. They are human-readable provenance pointers.

## 5. Unmapped Candidate Handling

When a candidate cannot be deterministically mapped to a single domain:

1. `candidate_domain` is set to `UNMAPPED_CANDIDATE`
2. The candidate is NOT discarded, hidden, or suppressed
3. The candidate appears in the cockpit UI in a separate "Unmapped Candidates" section with an explicit UNMAPPED badge
4. The summary reports the unmapped count
5. The view model flags unmapped candidates with `is_unmapped: true`

Reasons a candidate may be unmapped:
- Diagnostic section titles spanning multiple domains
- Capability references without a capability-to-domain mapping
- GAUGE artifacts scoped to multiple candidate domains (evidence registry `candidate_domains.length > 1`)

## 6. Prohibited Extraction Behavior

The following are prohibited in any extraction method:

- **AI interpretation:** No LLM, NLP, or machine learning inference on evidence text
- **Inferred labels:** No labels derived from context that is not explicitly present in the source text
- **Fabricated domain names:** No domain identifiers invented outside the keyword map
- **Probabilistic classification:** No statistical, probabilistic, or fuzzy matching
- **Hidden weighting:** No weight factors, scoring adjustments, or ranking logic applied during extraction
- **Autonomous semantic consolidation:** No merging, deduplication, or grouping of candidates based on semantic similarity
- **Cross-evidence reasoning:** No candidate may be derived from reasoning across multiple evidence files; each candidate is extracted from exactly one source file

## 7. Deterministic Extraction Rule

Extraction MUST be deterministic:
- Same input HTML → same candidates, same order, same fields
- No random, time-dependent, or environment-dependent behavior
- No external API calls during extraction
- Tested by running extraction twice and asserting identical output

## 8. Extension Rules for Future Extraction Methods

To add a new extraction method:

1. Define the method name in the `EXTRACTION_METHODS` constant
2. Implement a pure function taking `(html, evidenceItem)` → candidate array
3. The function must use only regex or string matching on the HTML
4. Register the function in `extractCandidatesFromEvidence` via source_type dispatch
5. Document the method in this grammar with the same structure as §2.1–§2.6
6. Add test coverage confirming determinism, source span presence, and authority state
7. The method must not violate any prohibition in §6

New extraction methods do NOT require a new contract. They require:
- Addition to `EXTRACTION_METHODS`
- Test coverage
- Update to this grammar document
