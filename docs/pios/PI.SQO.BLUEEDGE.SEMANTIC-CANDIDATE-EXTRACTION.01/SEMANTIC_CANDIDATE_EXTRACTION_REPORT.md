# Semantic Candidate Extraction Report

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01

---

## 1. Extraction Overview

First deterministic semantic candidate extraction from registered BlueEdge evidence material. Extracts non-authoritative candidate semantic signals from 5 registered HTML evidence artifacts. All candidates require Dynamic CEU admissibility evaluation before any state change.

## 2. Evidence Sources

| Evidence ID | Source Type | Source | Candidates Extracted | Hash Verified |
|-------------|-----------|--------|---------------------|---------------|
| EV-BE-001 | HTML_EVIDENCE_BRIEF | lens_tier1_evidence_brief.html | 23 | YES |
| EV-BE-002 | HTML_GAUGE_ARTIFACT | ART-01.html | 1 | YES |
| EV-BE-003 | HTML_DIAGNOSTIC_NARRATIVE | lens_tier2_diagnostic_narrative.html | 15 | YES |
| EV-BE-004 | HTML_GAUGE_CLAIM | CLM-01.html | 3 | YES |
| EV-BE-005 | HTML_GAUGE_CLAIM | CLM-02.html | 3 | YES |

**Total: 45 candidates from 5 evidence sources.**

## 3. Extraction Methods Used

| Method | Description | Candidates |
|--------|-------------|-----------|
| DOMAIN_KEYWORD_MAPPING | Maps domain names from HTML class/content to DOMAIN-XX IDs | 17 |
| HEADING_EXTRACTION | Extracts signal titles and document titles from h2/heading elements | 7 |
| SECTION_TITLE_EXTRACTION | Extracts section titles from structural section headers | 9 |
| TABLE_LABEL_EXTRACTION | Extracts claim labels and metric values from metadata fields | 5 |
| ARCHITECTURE_LAYER_MAPPING | Maps DOMAIN-XX references from diagnostic chip elements | 2 |
| MODULE_CAPABILITY_MAPPING | Maps CAP-XX capability references from diagnostic chips | 5 |

## 4. Candidate Type Distribution

| Type | Count | Description |
|------|-------|-------------|
| DOMAIN_GROUNDING_STATUS | 17 | Domain name + grounding tag from tier1 brief |
| STRUCTURAL_SIGNAL | 5 | Active structural signals from tier1 brief |
| FOCUS_DOMAIN_DESIGNATION | 1 | Focus domain identified in tier1 brief |
| GAUGE_ARTIFACT_TITLE | 1 | GAUGE artifact title/purpose |
| GAUGE_CLAIM_LABEL | 2 | GAUGE claim label from metadata |
| GAUGE_METRIC_VALUE | 2 | Authoritative metric value from claims |
| DIAGNOSTIC_SECTION | 8 | Tier2 diagnostic section titles |
| DIAGNOSTIC_DOMAIN_REFERENCE | 2 | Domain references from tier2 diagnostic chips |
| DIAGNOSTIC_CAPABILITY_REFERENCE | 5 | Capability references from tier2 diagnostic chips |

## 5. Confidence Distribution

| Class | Count | Percentage |
|-------|-------|-----------|
| STRONG | 25 | 55.6% |
| MODERATE | 14 | 31.1% |
| WEAK | 6 | 13.3% |

## 6. Domain Coverage

45 candidates cover 17 unique BlueEdge domains plus 14 unmapped candidates.

**Domains at NONE lineage_status with candidates:**
DOMAIN-02, DOMAIN-03, DOMAIN-04, DOMAIN-05, DOMAIN-06, DOMAIN-07, DOMAIN-08, DOMAIN-09, DOMAIN-10, DOMAIN-12, DOMAIN-13, DOMAIN-15, DOMAIN-17

**Domains at PARTIAL lineage_status with candidates:**
DOMAIN-11

**Unmapped candidates:** 14 (diagnostic section titles and capability references that cannot be deterministically mapped to a single domain)

## 7. Authority Boundary

- All 45 candidates: `NON_AUTHORITATIVE_SEMANTIC_CANDIDATE`
- All 45 candidates: `next_required_gate = DYNAMIC_CEU_ADMISSIBILITY_REQUIRED`
- No grounding mutation
- No overlay generation
- No qualification mutation
- No authority assertion
- No LENS mutation
