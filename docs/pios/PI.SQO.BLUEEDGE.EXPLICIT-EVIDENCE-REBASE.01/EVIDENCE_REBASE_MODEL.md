# Evidence Rebase Model

**Stream:** PI.SQO.BLUEEDGE.EXPLICIT-EVIDENCE-REBASE.01
**Type:** Reusable Doctrine — Evidence Rebase Governance

---

## 1. Purpose

This document defines the evidence rebase model for rebasing the entire evidence → extraction → admissibility chain onto explicitly operator-provided upstream HTML files. The rebase replaces non-explicit evidence sources with a governed, hash-verified, deterministic evidence set.

## 2. Evidence Source Pointer

The evidence_sources.yaml file serves as the canonical evidence source pointer:

| Field | Value |
|-------|-------|
| client | blueedge |
| run_id | run_blueedge_productized_01_fixed |
| evidence_set_id | blueedge_explicit_html_rebase_01 |
| evidence_root | clients/blueedge/sqo/evidence/blueedge_explicit_html_rebase_01 |
| allowed_source_class | EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE |

### 2.1 Disallowed Source Classes

- DOWNSTREAM_PROJECTION — outputs derived from downstream processing
- SELF_RECURSIVE_EVIDENCE — evidence that references itself as authority
- UNCONTROLLED_DISCOVERY — evidence discovered without governance control
- MOCK_OR_SEEDED_FIXTURE — synthetic or seeded test data

## 3. Evidence Files

| File | Source Type | Purpose |
|------|-----------|---------|
| Blue_Edge_PMO_Dashboard.html | HTML_PMO_DASHBOARD | Program management metrics and section structure |
| BlueEdge_Competitive_Dashboard_Feb2026.html | HTML_COMPETITIVE_DASHBOARD | Competitive analysis dimensions and feature categories |
| BlueEdge_Unified_Architecture_v3_23_0.html | HTML_ARCHITECTURE_SPECIFICATION | Architecture sections, layers, and module structure |

## 4. Extraction Methods

| Candidate Type | Extraction Method | Structural Compatibility |
|---------------|-------------------|------------------------|
| ARCHITECTURE_SECTION | SECTION_TITLE_EXTRACTION (`.st2` elements) | HIGH |
| ARCHITECTURE_LAYER | ARCHITECTURE_LAYER_EXTRACTION (`.lt` elements) | HIGH |
| ARCHITECTURE_MODULE | MODULE_NAME_EXTRACTION (`.mn` elements) | MODERATE |
| PMO_SECTION | SECTION_TITLE_EXTRACTION (`.section-title` elements) | LOW |
| PMO_METRIC | TABLE_LABEL_EXTRACTION (`.kpi-label` elements) | LOW |
| COMPETITIVE_DIMENSION | HEADING_EXTRACTION (`.card-t` elements) | LOW |
| COMPETITIVE_FEATURE_CATEGORY | TABLE_LABEL_EXTRACTION (`td.cat` elements) | MODERATE |
| DOCUMENT_TITLE | HEADING_EXTRACTION (`<title>` element) | MODERATE |

## 5. Domain Mapping

Candidates are mapped to domains via the DOMAIN_KEYWORD_MAP — a static keyword-to-domain lookup table. Candidates whose extracted labels do not match any keyword are assigned UNMAPPED_CANDIDATE status and are rejected during inline admissibility evaluation.

## 6. Inline Admissibility

The rebase pipeline includes inline admissibility evaluation:

- HIGH structural + STRONG confidence → ADMISSIBLE
- HIGH structural + MODERATE confidence → QUARANTINED
- MODERATE/LOW structural → QUARANTINED
- UNMAPPED_CANDIDATE → REJECTED
- All evaluations carry authority_state = NON_AUTHORITATIVE_ADMISSIBILITY_RESULT

## 7. Status Marking

| Status | Value | Meaning |
|--------|-------|---------|
| source_status | UPSTREAM_EVIDENCE_BOUND | Current chain is bound to operator-provided upstream evidence |
| previous_chain_status | PRE_REBASE_NON_AUTHORITATIVE | Previous chain outputs are superseded, retained for lineage |

## 8. Manifest Output

The pipeline writes an evidence_manifest.json to `artifacts/sqo/blueedge/evidence_rebase_01/` containing:

- evidence_set_id
- evidence_items (with hashes, sizes, types)
- all_operator_provided flag
- source_bound flag
