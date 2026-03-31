# Derivative Entity Maturity Matrix

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 1 — INVENTORY
Date: 2026-03-31

---

## Maturity Dimensions

| Column | Definition |
|--------|------------|
| entity | Canonical snake_case identifier |
| backing_page | Whether a /pages/*.md file exists |
| publish_status | live / preview-pending-publish / none |
| route_type | standalone_route / anchor_surface / no_route |
| definition_present | Whether the entity has an explicit definition in its backing page |
| relationships_documented | Whether relationships to other entities are stated in the page |
| canonical_url_set | Whether canonical frontmatter is set and correct |
| authority_codes_present | Whether CKR/GOV/CAT authority codes appear |
| maturity_level | COMPLETE / PARTIAL / STUB / NONE |

---

## Maturity Levels — Definition

| Level | Criteria |
|-------|----------|
| COMPLETE | backing_page=yes, publish_status=live, definition_present=yes, relationships_documented=yes, canonical_url_set=yes |
| PARTIAL | backing_page=yes, publish_status=live, one or more criteria missing |
| STUB | backing_page=yes, publish_status=preview-pending-publish OR backing_page=yes with minimal content |
| NONE | no backing_page, no route, no definition — mention only |

---

## Matrix — Category A: Routed Derivative Entities

| entity | backing_page | publish_status | route_type | definition_present | relationships_documented | canonical_url_set | authority_codes_present | maturity_level |
|--------|-------------|----------------|------------|-------------------|------------------------|-------------------|------------------------|----------------|
| execution_stability_index | yes | live | standalone_route | yes | yes | yes | yes (CKR-014, RSR-06, RSP-06, SCI-00) | COMPLETE |
| risk_acceleration_gradient | yes | live | standalone_route | yes | yes | yes | yes (CKR-015, RSR-07, RSP-07, SCI-00) | COMPLETE |
| execution_blindness | yes | live | anchor_surface | yes | yes | yes (anchor URL) | yes (CKR-001, CKR-014, CKR-015, CAT-00) | COMPLETE |
| program_intelligence_gap | yes | live | anchor_surface | yes | yes | yes (anchor URL) | yes (CKR-001, CAT-00, GOV-00) | COMPLETE |
| signal_infrastructure | yes | live | anchor_surface | yes | yes | yes (anchor URL) | yes (CKR-001, CKR-005, CAT-00, GOV-00) | COMPLETE |
| research | yes | live | standalone_route | yes | partial | yes | no | PARTIAL |
| early_warning_signals | yes | preview-pending-publish | standalone_route | yes | yes | yes | no | STUB |
| execution_blindness_examples | yes | preview-pending-publish | standalone_route | yes | yes | yes | no | STUB |
| why_dashboards_fail_programs | yes | preview-pending-publish | standalone_route | yes | yes | yes | no | STUB |

---

## Matrix — Category B: Named Constructs Without Routes

| entity | backing_page | publish_status | route_type | definition_present | relationships_documented | canonical_url_set | authority_codes_present | maturity_level |
|--------|-------------|----------------|------------|-------------------|------------------------|-------------------|------------------------|----------------|
| execlens | no | — | no_route | partial (described in parent pages) | partial | no | no | NONE |
| program_intelligence_advisory | no | — | no_route | no (referenced as service only) | no | no | no | NONE |

---

## Matrix — Category C/D: Sub-Constructs (ESI Dimensions + PiOS Steps)

| entity | backing_page | publish_status | route_type | definition_present | relationships_documented | canonical_url_set | authority_codes_present | maturity_level |
|--------|-------------|----------------|------------|-------------------|------------------------|-------------------|------------------------|----------------|
| schedule_stability | no | — | no_route | partial (in ESI page) | partial | no | no | NONE |
| cost_stability | no | — | no_route | partial (in ESI page) | partial | no | no | NONE |
| delivery_predictability | no | — | no_route | partial (in ESI page) | partial | no | no | NONE |
| flow_compression | no | — | no_route | partial (in ESI page) | partial | no | no | NONE |
| evidence_intake | no | — | no_route | partial (in PiOS page) | partial | no | no | NONE |
| structure_reconstruction | no | — | no_route | partial (in PiOS page) | partial | no | no | NONE |
| signal_computation | no | — | no_route | partial (in PiOS page) | partial | no | no | NONE |
| condition_and_diagnosis | no | — | no_route | partial (in PiOS page) | partial | no | no | NONE |

---

## Maturity Summary

| Maturity Level | Count | Entities |
|----------------|-------|----------|
| COMPLETE | 5 | execution_stability_index, risk_acceleration_gradient, execution_blindness, program_intelligence_gap, signal_infrastructure |
| PARTIAL | 1 | research |
| STUB | 3 | early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs |
| NONE | 10 | execlens, program_intelligence_advisory, schedule_stability, cost_stability, delivery_predictability, flow_compression, evidence_intake, structure_reconstruction, signal_computation, condition_and_diagnosis |
| **Total** | **19** | |

---

## Observations (Structural, No Inference)

1. Five core derivative entities (ESI, RAG, execution_blindness, program_intelligence_gap, signal_infrastructure) have COMPLETE maturity with authority codes, canonical URLs, definitions, and relationships.

2. Three expansion entities (early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs) are STUB — present as published pages but gated at preview-pending-publish.

3. research page is PARTIAL — has backing page and live status but no authority codes and relationships are incomplete (no links to ESI/RAG/PiOS from within the page body).

4. execlens has no standalone definition, no route, no node file — its definition is distributed across four parent pages.

5. The four ESI dimensions and four PiOS steps are sub-constructs with NONE maturity at the node level — defined only within their respective parent entity pages.

6. program_intelligence_advisory has NONE maturity — referenced as a service concept but not canonically defined.
