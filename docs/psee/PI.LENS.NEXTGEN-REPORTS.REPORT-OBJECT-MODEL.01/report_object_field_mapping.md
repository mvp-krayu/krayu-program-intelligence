# Report Object Field Mapping

**Stream:** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01  
**Document type:** FIELD MAPPING — SOURCE TO REPORT OBJECT  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  

**Purpose:** Define the authoritative mapping from GEIOS source artifacts to report_object fields, specifying GEIOS ownership, LENS visibility, executive-facing labels, and immutability constraints.

---

## Mapping Principles

| Principle | Rule |
|-----------|------|
| TAXONOMY-01 raw fields | Never executive-visible |
| derivation_hash | Audit/reference only; never displayed |
| evidence_object_hash | Verification only; never displayed |
| readiness_state | Rendered as ALI-03 executive badge label |
| qualifier_class | Rendered as Q-xx chip/label; never suppressed |
| domain names | ALI-04 applied before any rendering |
| signal keys (CPI/CFA) | ALI-01/02 applied; raw keys never in executive surface |
| GEIOS layer names | Never in executive surface |
| Governance rule IDs | Never in executive surface |
| Agent/orchestration IDs | Never in any surface |

---

## 1. Identity Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Visibility | Required | Immutable | Exec-Visible | Advisory | Audit | Notes |
|---------------------|----------------|-------------|-----------------|----------|-----------|-------------|----------|-------|-------|
| `report_id` | Pipeline run record | L3 derivation output | Reference only (in header metadata) | YES | YES | As reference label | YES | YES | Displayed in report header as metadata |
| `baseline_ref` | governance_baselines.json | L9 governance | As text label | YES | YES | YES | YES | YES | e.g. "governed-dpsig-baseline-v1" |
| `stream_ref` | Pipeline execution manifest | L9 governance | No (internal) | YES | YES | NO | As reference | YES | Internal identifier; audit only |
| `generated_at` | Pipeline execution timestamp | L3 execution | YES | YES | YES | YES | YES | YES | Displayed in report header |

---

## 2. Integrity Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Visibility | Required | Immutable | Exec-Visible | Advisory | Audit | Notes |
|---------------------|----------------|-------------|-----------------|----------|-----------|-------------|----------|-------|-------|
| `evidence_object_hash` | Evidence injection pipeline (L5) | L5 evidence injection | NO — verification only | YES | YES | NO | As abbreviated reference | Full | Never displayed in any executive view; verified by BridgeValidator |
| `derivation_hash` | TAXONOMY-01 derivation record (L2/L3) | L2/L3 derivation | NO — audit only | YES | YES | NO | NO | As reference ID | Available in LINEAGE panel as identifier string only |

---

## 3. Governance Outcome Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Immutable | Exec-Visible | Advisory | Audit | Notes |
|---------------------|----------------|-------------|----------------|----------|-----------|-------------|----------|-------|-------|
| `governance_verdict` | Governance enforcement layer output | L9 governance | Drives BLOCKED state | YES | YES | As status (PASS renders content; FAIL renders BLOCKED) | YES | YES | FAIL verdict renders BLOCKED module explicitly |
| `readiness_state` | DPSIG readiness gate classifier | L8 executive rendering | Drives readiness badge | YES | YES | As ALI-03 executive label | YES | YES | Raw enum never shown; ALI-03 applied |
| `qualifier_class` | Cognitive normalization pipeline | L6 normalization | Drives qualifier chip | YES | YES | As Q-xx taxonomy label (Q-00 = no chip) | YES | YES | Q-04 triggers absence notice |

### 3.1 ReadinessState → Executive Surface Mapping

| Raw enum value | ALI-03 Executive Label | Color Token | Qualifier Chip |
|----------------|----------------------|-------------|----------------|
| `EXECUTIVE_READY` | "Executive Ready" | `--evidence-confirmed` | None |
| `EXECUTIVE_READY_WITH_QUALIFIER` | "Executive Ready — Qualified" | `--evidence-qualified` | Q-01 or Q-02 chip |
| `DIAGNOSTIC_ONLY` | "Under Structural Review" | `--evidence-diagnostic` | Q-03 chip |
| `SUPPRESSED_FROM_EXECUTIVE` | "Not Available" | `--evidence-diagnostic` | Q-04 absence notice |
| `BLOCKED_PENDING_DOMAIN_GROUNDING` | "Pending Grounding" | `--evidence-diagnostic` | Grounding scope notice |

### 3.2 QualifierClass → Executive Surface Mapping

| Raw enum value | Executive Label | Chip Style | Tooltip Source |
|----------------|----------------|------------|---------------|
| `Q-00` | "Full Evidence" | No chip | N/A |
| `Q-01` | "Partial Grounding" | Amber chip | Q-taxonomy QP-01 definition |
| `Q-02` | "Structural View" | Blue chip | Q-taxonomy QP-02 definition |
| `Q-03` | "Under Review" | Grey chip | Q-taxonomy QP-03 definition |
| `Q-04` | "Withheld" | Absence notice | Q-taxonomy QP-04 definition |

---

## 4. Topology Scope Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Immutable | Exec-Visible | Notes |
|---------------------|----------------|-------------|----------------|----------|-----------|-------------|-------|
| `topology_scope.domain_count` | canonical_topology.json | L1 topology | Scope indicator | YES | YES | YES | Count only; no topology structure exposed |
| `topology_scope.cluster_count` | canonical_topology.json | L1 topology | Scope indicator | YES | YES | YES | Count only |
| `topology_scope.grounded_domain_count` | Grounding certification artifacts | L3/L4 | Grounding label | YES | YES | YES | Used to compute grounding_label |
| `topology_scope.grounding_label` | Derived from grounded/total at generation | L6 normalization | Scope indicator chip | YES | YES | YES | e.g. "Full Coverage" or "5 of 12 Domains" |

---

## 5. Narrative Fields

All narrative fields have ALI-01..07 applied at GEIOS generation time (L6 cognitive normalization). LENS renders as-is.

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Immutable | Exec-Visible | Advisory | Audit | Notes |
|---------------------|----------------|-------------|----------------|----------|-----------|-------------|----------|-------|-------|
| `narrative_block.executive_summary` | LLM narrative output → cognitive normalization | L7/L6 | Primary narrative | YES | YES | YES | YES | YES | No raw technical labels; ALI applied |
| `narrative_block.why_section` | Evidence injection + LLM synthesis → normalization | L5/L7/L6 | WHY section | YES | YES | YES | YES | YES | Causal chain; evidence-sourced |
| `narrative_block.structural_summary` | Signal derivation + normalization | L3/L6 | Structural summary | YES | YES | YES | YES | YES | Ranked by pressure |

---

## 6. Evidence Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Immutable | Exec-Visible | Advisory | Audit | Notes |
|---------------------|----------------|-------------|----------------|----------|-----------|-------------|----------|-------|-------|
| `evidence_blocks[].domain_alias` | Domain configuration + ALI-04 | L4/L6 | Domain header | YES | YES | YES | YES | YES | Raw domain ID never visible |
| `evidence_blocks[].grounding_status` | Grounding certification | L3/L4 | Qualifier chip per domain | YES | YES | As Q-xx label | YES | YES | Q-xx never upgraded |
| `evidence_blocks[].grounding_label` | Derived from grounding_status | L6 | Scope note | YES | YES | YES | YES | YES | |
| `evidence_blocks[].evidence_description` | Evidence injection → normalization | L5/L6 | Evidence description | YES | YES | YES | YES | YES | |
| `evidence_blocks[].propagation_role` | Topology analysis | L3 | Propagation role label | YES | YES | YES | YES | YES | ORIGIN/RECEIVER/PASS_THROUGH/ISOLATED |

---

## 7. Signal Card Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Immutable | Exec-Visible | Notes |
|---------------------|----------------|-------------|----------------|----------|-----------|-------------|-------|
| `signal_cards[].signal_label` | ALI-01 (CPI) or ALI-02 (CFA) | L6 normalization | Signal card label | YES | YES | YES | Raw keys (cpi_score, cfa_score) NEVER visible |
| `signal_cards[].pressure_label` | Normalized from pressure_tier | L6 normalization | Pressure description | YES | YES | YES | e.g. "Elevated Cluster Pressure" |
| `signal_cards[].pressure_tier` | DPSIG derivation threshold buckets | L3/L6 | Pressure tier indicator | YES | YES | YES | HIGH/ELEVATED/MODERATE/LOW (not raw numerical values) |
| `signal_cards[].qualifier_label` | Q-taxonomy + signal grounding status | L6 | Qualifier chip on card | YES | YES | As Q-xx label (empty for Q-00) | Never null; empty string for Q-00 |
| `signal_cards[].evidence_text` | Evidence injection → normalization | L5/L6 | Signal evidence text | YES | YES | YES | Normalized; no raw field names |

### 7.1 Explicitly Forbidden Signal Card Values

These values must never appear in any `signal_label` field:

| Forbidden Value | Replacement (ALI rule) |
|-----------------|------------------------|
| `cpi_score` | ALI-01: "Cluster Pressure Level" or configured alias |
| `cfa_score` | ALI-02: "Fan Distribution Asymmetry" or configured alias |
| `signal_value` | Never shown in executive surface |
| `activation_state` | Never shown in executive surface |
| `signal_stable_key` | Never shown in executive surface |
| Any numerical threshold value | Never shown in executive surface |

---

## 8. Trace Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Immutable | Exec-Visible | Advisory | Audit | Notes |
|---------------------|----------------|-------------|----------------|----------|-----------|-------------|----------|-------|-------|
| `trace_block.propagation_path` | Topology analysis + ALI aliases | L3/L6 | Propagation path (collapsed by default) | YES | YES | NO (collapsed) | YES (expanded) | YES | Array of ALI-aliased names; no raw keys |
| `trace_block.propagation_summary` | Narrative synthesis + normalization | L7/L6 | Propagation summary | YES | YES | NO (collapsed) | YES | YES | |
| `trace_block.derivation_lineage_ref` | Pipeline execution record | L9 | Reference label (not decoded) | YES | YES | NO | As reference | Full | Stream reference for audit |
| `trace_block.baseline_ref` | governance_baselines.json | L9 | Reference label | YES | YES | NO | YES | YES | |

---

## 9. Explainability Bundle Fields

| report_object Field | Source Artifact | GEIOS Layer | Default Audience | Phase | Notes |
|---------------------|----------------|-------------|-----------------|-------|-------|
| `explainability_bundle.why_panel` | Evidence injection + normalization | L5/L6/L7 | EXECUTIVE | 2 (static) | Pre-rendered at generation |
| `explainability_bundle.evidence_panel` | Evidence blocks + normalization | L5/L6 | EXECUTIVE | 2 (static) | Pre-rendered at generation |
| `explainability_bundle.trace_panel` | Trace block + lineage | L3/L9 | ADVISORY | 2 (static) | Collapsed in executive view |
| `explainability_bundle.qualifiers_panel` | Q-taxonomy + active qualifiers | L6 | EXECUTIVE | 2 (static) | Shows only if Q-01..Q-04 active |
| `explainability_bundle.lineage_panel` | trace_linkage + stream refs | L9 | ADVISORY | 2 (static) | Available on request |
| `explainability_bundle.confidence_panel` | Grounding scope + evidence completeness | L3/L4/L6 | EXECUTIVE | 2 (static) | Scope communication |
| `explainability_bundle.readiness_state_panel` | Readiness gate classification | L8 | EXECUTIVE | 2 (static) | Full classification detail |

---

## 10. Rendering Metadata Fields

| report_object Field | Source Artifact | GEIOS Layer | LENS Rendering | Required | Notes |
|---------------------|----------------|-------------|----------------|----------|-------|
| `rendering_metadata.normalization_version` | Cognitive normalization config | L6 | Provenance tracking | YES | Absence triggers DIAGNOSTIC notice |
| `rendering_metadata.ali_rules_applied` | ALI-01..07 application log | L6 | Provenance tracking | YES | Absence triggers DIAGNOSTIC notice |
| `rendering_metadata.qualifier_rules_applied` | Q-taxonomy application log | L6 | Provenance tracking | YES | |
| `rendering_metadata.surface_mode` | Resolved from readiness_state | L8 | Drives rendering mode | YES | |
| `rendering_metadata.explainability_panels_rendered` | Generation-time panel list | L8 | Audit reference | YES | |
| `rendering_metadata.topology_scope_verified` | Verification at generation | L1/L9 | Audit flag | YES | |
| `rendering_metadata.evidence_hash_verified` | BridgeValidator result | Bridge | Audit flag | YES | |
| `rendering_metadata.rendered_at` | LENS renderer timestamp | LENS | Audit | YES | Set by LENS renderer |
| `rendering_metadata.lens_version` | LENS system version | LENS | Audit | YES | |

---

## 11. Interaction Registry Fields

| report_object Field | Source | Phase Active | Exec-Visible | Notes |
|---------------------|--------|-------------|-------------|-------|
| `interaction_registry.interactions[].interaction_id` | Generation-time registration | ALL | NO | Stable identifier; internal |
| `interaction_registry.interactions[].interaction_type` | Phase gate model | Phase-dependent | NO | Controls what UI action is enabled |
| `interaction_registry.interactions[].target_module_id` | Module registry reference | ALL | NO | Internal wiring |
| `interaction_registry.interactions[].phase_required` | Maturity gate model | ALL | NO | Phase gate for activation |
| `interaction_registry.interactions[].active` | Phase 2: EXPAND_COLLAPSE only | Phase 2 | NO (behavior) | Governs UI activation |
| `interaction_registry.interactions[].governance_gate` | Maturity gate identifier | ALL | NO | Internal governance reference |

---

## 12. Module Registry Fields

| report_object Field | Source | Phase Active | Exec-Visible | Notes |
|---------------------|--------|-------------|-------------|-------|
| `module_registry.entries[].module_id` | Generation-time deterministic ID | ALL | NO | Stable; workspace-indexable |
| `module_registry.entries[].module_type` | ModuleType enum | Phase-dependent | NO | Controls workspace composition |
| `module_registry.entries[].report_id` | Parent reference | ALL | NO | Cross-reference |
| `module_registry.entries[].evidence_ref` | evidence_object_hash reference | ALL | NO | Links module to evidence |
| `module_registry.entries[].active` | Phase gate model | Phase 2: 4 modules active | NO | Phase 2 active: EXECUTIVE_SUMMARY, DOMAIN_EVIDENCE, PROPAGATION, EXPLAINABILITY |
| `module_registry.entries[].phase_gate` | Maturity gate model | ALL | NO | Phase 2: 2; future phases: 3–6 |
| `module_registry.entries[].registered_at` | Generation timestamp | ALL | NO | Audit |

---

## 13. Trace Linkage Fields

| report_object Field | LENS Visibility | Audience | Notes |
|---------------------|-----------------|----------|-------|
| `trace_linkage.evidence_object_hash` | NO primary surface | AUDIT only | Full hash; never in executive surface |
| `trace_linkage.derivation_hash` | NO primary surface | AUDIT only | Reference ID in LINEAGE panel only |
| `trace_linkage.baseline_anchor` | NO primary surface | ADVISORY/AUDIT | Available in LINEAGE panel |
| `trace_linkage.stream_anchor` | NO primary surface | ADVISORY/AUDIT | Available in LINEAGE panel |
| `trace_linkage.run_id` | NO primary surface | AUDIT | Replay anchor for Phase 5+ continuity |

---

## Visibility Summary

### Always Executive-Visible
- `readiness_badge.state_label` (ALI-03 label)
- `narrative_block` (all three sections; normalized)
- `evidence_blocks[].domain_alias` (ALI-04)
- `evidence_blocks[].signal_cards[].signal_label` (ALI-01/02)
- `evidence_blocks[].signal_cards[].pressure_tier` (as normalized label)
- `qualifier_class` (as Q-xx chip; never Q-00)
- `topology_scope.domain_count` / `cluster_count` (as scope indicator)
- `generated_at` (in header metadata)
- `baseline_ref` (in header metadata)

### Never Executive-Visible (Internal/Audit Only)
- `evidence_object_hash` (verification only)
- `derivation_hash` (audit only)
- `stream_ref` (audit only)
- `trace_linkage` fields (audit/LINEAGE panel)
- Raw `readiness_state` enum key
- Raw `qualifier_class` enum key (rendered as label)
- Any TAXONOMY-01 raw field names
- Any GEIOS layer names or rule IDs
- Any agent or orchestration identifiers

---

*Stream PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 — Field Mapping — COMPLETE*  
*Issued: 2026-05-08*
