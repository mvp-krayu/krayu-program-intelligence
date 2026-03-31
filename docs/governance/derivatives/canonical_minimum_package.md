# Canonical Minimum Package

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 4 — Canonical Integration / Completion / Readiness
Authority: canonical_completion_rules | Phase 1 inventory | Phase 2 graph map | Phase 3 node files
Date: 2026-03-31

---

## Purpose

Defines the minimum canonical package required for each class of derivative entity to be considered structurally complete within the I.4 graph.

Not a quality standard. A completion floor.

---

## Entity Classes (from Phase 1 inventory)

| Class | Phase 1 Category | Examples |
|-------|-----------------|---------|
| routed_live | A — live backing page | execution_stability_index, research |
| routed_stub | A — preview-pending-publish | early_warning_signals, execution_blindness_examples |
| named_construct | B — no route, no page | execlens, program_intelligence_advisory |
| dimension_sub_construct | C — ESI dimension | schedule_stability, cost_stability |
| step_sub_construct | D — PiOS step | evidence_intake, signal_computation |

---

## Minimum Package — Class: routed_live

Applies to: execution_stability_index, risk_acceleration_gradient, execution_blindness, program_intelligence_gap, signal_infrastructure, research

### Required elements

| Element | Requirement | Check |
|---------|-------------|-------|
| node_file_exists | Yes — complete Phase 3 node file at governance/derivatives/nodes/ | Mandatory |
| graph_position_exists | Yes — primary parent + depth defined in Phase 2 graph map | Mandatory |
| relationship_set_exists | Yes — inbound and outbound from Phase 2 dependency map | Mandatory |
| canonical_source_binding_status | Assigned (bound / partial / missing) against governance/architecture/ docs | Mandatory |
| boundary_clarity_exists | Yes — explicit boundary statements in node file (§Boundaries + §Exclusions) | Mandatory |
| readiness_status_exists | Yes — assigned in public_surface_readiness_matrix | Mandatory |
| backing_page_live | Yes — pages/*.md with publish_status: live | Required for routed_live |
| canonical_url_set | Yes — frontmatter canonical field present | Required for routed_live |
| authority_codes_present | Yes (CKR/GOV/CAT codes) | Required for COMPLETE maturity; gap flagged for PARTIAL |

### Minimum package is complete when all Mandatory elements are present.

---

## Minimum Package — Class: routed_stub

Applies to: early_warning_signals, execution_blindness_examples, why_dashboards_fail_programs

### Required elements

| Element | Requirement | Check |
|---------|-------------|-------|
| node_file_exists | Yes — complete Phase 3 node file | Mandatory |
| graph_position_exists | Yes — primary parent + depth defined | Mandatory |
| relationship_set_exists | Yes — inbound and outbound from Phase 2 dependency map | Mandatory |
| canonical_source_binding_status | Assigned (bound / partial / missing) | Mandatory |
| boundary_clarity_exists | Yes | Mandatory |
| readiness_status_exists | Yes | Mandatory |
| backing_page_live | No — preview-pending-publish | Gap — not met |
| canonical_url_set | Yes (canonical field present, URL exists) | Present |
| authority_codes_present | No | Gap — not met |

### Minimum package is complete when all Mandatory elements are present.
### Publishability is blocked until backing_page_live gap is resolved.

---

## Minimum Package — Class: named_construct

Applies to: execlens, program_intelligence_advisory

### Required elements

| Element | Requirement | Check |
|---------|-------------|-------|
| node_file_exists | Yes — complete Phase 3 node file | Mandatory |
| graph_position_exists | Yes — primary parent + depth defined | Mandatory |
| relationship_set_exists | Yes — from Phase 2 dependency map | Mandatory |
| canonical_source_binding_status | Assigned (bound / partial / missing) | Mandatory |
| boundary_clarity_exists | Yes | Mandatory |
| readiness_status_exists | Yes | Mandatory |
| backing_page_live | Not applicable — no route exists | N/A |
| canonical_url_set | Not applicable | N/A |
| authority_codes_present | Not applicable — no backing page | N/A |

### Minimum package is complete when all Mandatory elements are present.
### Publication requires a backing page — not part of minimum package for this class.

---

## Minimum Package — Class: dimension_sub_construct

Applies to: schedule_stability, cost_stability, delivery_predictability, flow_compression

### Required elements

| Element | Requirement | Check |
|---------|-------------|-------|
| node_file_exists | Yes — complete Phase 3 node file | Mandatory |
| graph_position_exists | Yes — under execution_stability_index at depth 2 | Mandatory |
| relationship_set_exists | Yes — at minimum: execution_stability_index →[D] | Mandatory |
| canonical_source_binding_status | Assigned | Mandatory |
| boundary_clarity_exists | Yes — must state parent entity ownership | Mandatory |
| readiness_status_exists | Yes | Mandatory |
| backing_page_live | Not applicable — no standalone route | N/A |
| canonical_url_set | Not applicable | N/A |
| standalone_canonical_document | Not required — sub-construct definition belongs in parent entity's canonical document | N/A |

### Minimum package is complete when all Mandatory elements are present.
### These entities do not require their own canonical authority documents.
### Their canonical home is within the execution_stability_index authority container.

---

## Minimum Package — Class: step_sub_construct

Applies to: evidence_intake, structure_reconstruction, signal_computation, condition_and_diagnosis

### Required elements

| Element | Requirement | Check |
|---------|-------------|-------|
| node_file_exists | Yes — complete Phase 3 node file | Mandatory |
| graph_position_exists | Yes — under pios at depth 1 | Mandatory |
| relationship_set_exists | Yes — at minimum: pios →[P] | Mandatory |
| canonical_source_binding_status | Assigned | Mandatory |
| boundary_clarity_exists | Yes — must state parent entity ownership and step ordering | Mandatory |
| readiness_status_exists | Yes | Mandatory |
| backing_page_live | Not applicable — no standalone route | N/A |
| canonical_url_set | Not applicable | N/A |
| standalone_canonical_document | Not required — step definition belongs in pios authority container | N/A |

### Minimum package is complete when all Mandatory elements are present.
### These entities do not require their own canonical authority documents.
### Their canonical home is within the pios authority container set.

---

## Minimum Package Completion — Current State Summary

| Entity | Class | node_file | graph_position | relationship_set | binding_status | boundary_clarity | readiness_status | package_complete |
|--------|-------|-----------|---------------|-----------------|----------------|-----------------|-----------------|-----------------|
| execution_stability_index | routed_live | yes | yes | yes | partial | yes | yes | yes |
| risk_acceleration_gradient | routed_live | yes | yes | yes | partial | yes | yes | yes |
| execution_blindness | routed_live | yes | yes | yes | partial | yes | yes | yes |
| program_intelligence_gap | routed_live | yes | yes | yes | partial | yes | yes | yes |
| signal_infrastructure | routed_live | yes | yes | yes | partial | yes | yes | yes |
| research | routed_live | yes | yes | yes | missing | yes | yes | yes |
| early_warning_signals | routed_stub | yes | yes | yes | missing | yes | yes | yes (mandatory only) |
| execution_blindness_examples | routed_stub | yes | yes | yes | missing | yes | yes | yes (mandatory only) |
| why_dashboards_fail_programs | routed_stub | yes | yes | yes | missing | yes | yes | yes (mandatory only) |
| execlens | named_construct | yes | yes | yes | bound | yes | yes | yes |
| program_intelligence_advisory | named_construct | yes | yes | yes | partial | yes | yes | yes |
| schedule_stability | dimension_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| cost_stability | dimension_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| delivery_predictability | dimension_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| flow_compression | dimension_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| evidence_intake | step_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| structure_reconstruction | step_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| signal_computation | step_sub_construct | yes | yes | yes | partial | yes | yes | yes |
| condition_and_diagnosis | step_sub_construct | yes | yes | yes | partial | yes | yes | yes |

All 19 entities meet the mandatory minimum package requirements for their respective class.
