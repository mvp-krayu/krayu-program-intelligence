# Normalization Field Mapping

**Stream:** PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01  
**Document type:** NORMALIZATION FIELD MAPPING  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream schema:** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 (e588150)  

---

## Mapping Conventions

| Column | Meaning |
|--------|---------|
| Normalization Required | YES = ALI rule applied; PASS-THROUGH = no ALI; PROHIBITED = must not be normalized |
| Normalization Rule Set | Which NORM-* rules govern this field |
| Timing | at_generation (applied on GEIOS side) / at_render (forbidden) |
| Immutable After | Whether field value is locked after normalization |
| Fallback | What renders if normalization fails |
| Diagnostic | What diagnostic notice renders if applicable |
| Forbidden Render States | What must never appear in this field |

---

## 1. Readiness Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Exec-Visible | Advisory | Audit | Timing | Immutable After | Fallback | Diagnostic | Forbidden States |
|---------------------|-------------|----------------------|----------|-------------|----------|-------|--------|----------------|---------|-----------|-----------------|
| `readiness_state` | L8 readiness gate | YES — ALI-03 mapping | NORM-ALI-03 | As executive label only | As label | As enum + label | at_generation | YES | BLOCKED if no mapping | N/A | Raw enum values in executive surface |
| `header_block.readiness_badge.state_label` | L8 → ALI-03 | PASS-THROUGH (already normalized) | NORM-ALI-03 | YES — primary visual | YES | YES | at_render (render pre-normalized value) | YES | BLOCKED module | DIAGNOSTIC if empty | Raw enum text; blank value |
| `header_block.readiness_badge.qualifier_label` | L6 Q-taxonomy | YES — Q-taxonomy label | NORM-Q-01..04 | YES (Q-01..04); empty for Q-00 | YES | YES | at_generation | YES | NORM-DIAG-01 if Q miss | Notice if blank with active qualifier | Suppressed chip when Q-01..04 active |
| `header_block.readiness_badge.color_token` | Design system | YES — token mapping from readiness_state | NORM-ALI-03 | As CSS token | N/A | N/A | at_render | NO (derived at render) | Default token | N/A | Raw hex color; missing token |
| `header_block.readiness_badge.tooltip_text` | Q-taxonomy | YES — Q-taxonomy tooltip template | NORM-Q-01..04 | On hover/tap (Q-01..04 only) | YES | YES | at_generation | YES | Empty if Q-00 | N/A | Custom tooltip overriding Q-taxonomy |

---

## 2. Qualifier Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Exec-Visible | Advisory | Audit | Timing | Immutable After | Fallback | Diagnostic | Forbidden States |
|---------------------|-------------|----------------------|----------|-------------|----------|-------|--------|----------------|---------|-----------|-----------------|
| `qualifier_class` | L6 normalization | PROHIBITED — must not be modified | NORM-Q-01..04 | As Q-taxonomy label (never raw) | As label | As label + enum | at_generation (set by GEIOS; never changed) | YES — immutable | BLOCKED if absent | N/A | Raw Q-xx enum in executive surface; suppressed chip; upgraded qualifier |
| `evidence_blocks[].grounding_status` | L3/L4 grounding | YES — Q label applied | NORM-Q-01..04 | As grounding_label | YES | YES | at_generation | YES | BLOCKED if absent | N/A | Raw Q-xx enum; suppressed state |
| `evidence_blocks[].grounding_label` | L6 → Q-taxonomy | PASS-THROUGH (already normalized) | NORM-Q-01..04 | YES | YES | YES | at_render | YES | NORM-DIAG-01 if empty | DIAGNOSTIC if blank | "Q-01", "Q-02" raw values |
| `signal_cards[].qualifier_label` | L6 Q-taxonomy | YES — Q label per signal | NORM-Q-01..04 | YES (Q-01..04); empty string for Q-00 | YES | YES | at_generation | YES | Empty string (Q-00) | NORM-DIAG-01 if Q miss | Null value; suppressed chip when Q-01..04; raw enum |

---

## 3. Narrative Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Exec-Visible | Advisory | Audit | Timing | Immutable After | Fallback | Diagnostic | Forbidden States |
|---------------------|-------------|----------------------|----------|-------------|----------|-------|--------|----------------|---------|-----------|-----------------|
| `narrative_block.executive_summary` | L7 LLM → L6 normalization | YES — full vocabulary contract | NORM-NARR-01..04; NORM-FORBID-01..04; NORM-DENSITY-01 | YES | YES | YES | at_generation | YES | BLOCKED if empty | NORM-DIAG-02 if version mismatch | Predictive language; recommendation; chatbot phrasing; raw technical labels; GEIOS internal terms |
| `narrative_block.why_section` | L5/L7/L6 evidence+LLM+normalization | YES — full vocabulary contract + structure rules | NORM-NARR-01..04; NORM-PROP-01..03; NORM-FORBID-01..04 | YES | YES | YES | at_generation | YES | BLOCKED if empty | NORM-DIAG-02 if version mismatch | Same as executive_summary; additionally: cause claims without evidence trace |
| `narrative_block.structural_summary` | L3/L6 signal + normalization | YES — vocabulary + density | NORM-NARR-02; NORM-NARR-03; NORM-DENSITY-01; NORM-FORBID-01..04 | YES | YES | YES | at_generation | YES | BLOCKED if empty | NORM-DIAG-01 if normalization miss | Same forbidden states as executive_summary |

---

## 4. Signal Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Exec-Visible | Advisory | Audit | Timing | Immutable After | Fallback | Diagnostic | Forbidden States |
|---------------------|-------------|----------------------|----------|-------------|----------|-------|--------|----------------|---------|-----------|-----------------|
| `signal_cards[].signal_label` | L2/L3 → L6 ALI | YES — ALI-01 (CPI) or ALI-02 (CFA) | NORM-ALI-01; NORM-ALI-02 | YES | YES | YES | at_generation | YES | NORM-DIAG-01 — blank label + diagnostic | NORM-DIAG-01 | "cpi_score"; "cfa_score"; "CPI"; "CFA"; numerical values; raw signal keys |
| `signal_cards[].pressure_label` | L3 → L6 normalization | YES — pressure tier to human label | NORM-PROP-01; NORM-PROP-02 | YES | YES | YES | at_generation | YES | NORM-DIAG-01 | NORM-DIAG-01 if no tier mapping | Numerical values; threshold values; raw tier enum |
| `signal_cards[].pressure_tier` | L3 derivation output | PASS-THROUGH — enum value | NORM-DENSITY-02 | As pressure_label (not raw enum) | As label | As label + enum | at_generation | YES | BLOCKED if absent | N/A | Raw tier enum in executive surface |
| `signal_cards[].evidence_text` | L5/L6 evidence + normalization | YES — vocabulary contract | NORM-NARR-02; NORM-FORBID-01..04 | YES | YES | YES | at_generation | YES | BLOCKED if empty | NORM-DIAG-01 | Technical field names; GEIOS internals; predictive language |

---

## 5. Evidence Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Exec-Visible | Advisory | Audit | Timing | Immutable After | Fallback | Diagnostic | Forbidden States |
|---------------------|-------------|----------------------|----------|-------------|----------|-------|--------|----------------|---------|-----------|-----------------|
| `evidence_blocks[].domain_alias` | L1/L3 topology → L6 ALI-04 | YES — ALI-04 client alias | NORM-ALI-04 | YES | YES | YES | at_generation | YES | NORM-DIAG-01 — "Domain [n]" fallback label | NORM-DIAG-01 if no alias mapping | Raw domain ID; internal topology key |
| `evidence_blocks[].evidence_description` | L5/L6 evidence + normalization | YES — vocabulary contract | NORM-NARR-02; NORM-NARR-03; NORM-FORBID-01..04 | YES | YES | YES | at_generation | YES | BLOCKED if empty | NORM-DIAG-01 | Forbidden vocabulary categories A-H |
| `evidence_blocks[].propagation_role` | L3 topology analysis | YES — role to display label | NORM-PROP-01 | As role label (executive vocabulary contract) | YES | YES | at_generation | YES | "Independent Domain" fallback | N/A | Raw enum "ORIGIN", "RECEIVER", etc. |
| `evidence_object_hash` | L5 evidence injection | PROHIBITED — must not be normalized | N/A | NO — never displayed | NO — reference only | Full value | N/A | YES — immutable | N/A | N/A | Any display in executive or advisory surface |

---

## 6. Propagation Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Exec-Visible | Advisory | Audit | Timing | Immutable After | Fallback | Diagnostic | Forbidden States |
|---------------------|-------------|----------------------|----------|-------------|----------|-------|--------|----------------|---------|-----------|-----------------|
| `trace_block.propagation_path` | L3/L6 topology → ALI | YES — ALI-04/05 aliases | NORM-ALI-04; NORM-ALI-05; NORM-PROP-01 | NO by default (collapsed) | YES (expanded) | YES | at_generation | YES | Empty array + DIAGNOSTIC | NORM-DIAG-01 | Raw cluster keys; raw domain IDs |
| `trace_block.propagation_summary` | L7/L6 narrative + normalization | YES — vocabulary contract | NORM-PROP-01..03; NORM-NARR-02; NORM-FORBID-01..04 | NO by default (collapsed) | YES | YES | at_generation | YES | DIAGNOSTIC if empty | NORM-DIAG-01 | Predictive language; numerical values; forbidden vocabulary |
| `trace_block.derivation_lineage_ref` | L9 pipeline record | PASS-THROUGH — rendered as reference label | NORM-TRACE-01 | NO | As reference label | Full value | at_render (label formatting) | YES | N/A | NORM-DIAG-01 if absent | Decoded interpretation of reference value |
| `trace_block.baseline_ref` | L9 governance | PASS-THROUGH | NORM-TRACE-01 | NO | As label | YES | at_render | YES | N/A | N/A | Decoded or modified baseline ref |

---

## 7. Explainability Fields

| report_object Field | Source Layer | Normalization Required | Rule Set | Default Audience | Timing | Immutable After | Diagnostic |
|---------------------|-------------|----------------------|----------|-----------------|--------|----------------|-----------|
| `explainability_bundle.why_panel` | L5/L6/L7 | YES at generation; PASS-THROUGH at render | NORM-NARR-01..04; NORM-PROP-01..03; NORM-FORBID-01..04 | EXECUTIVE | at_generation | YES | BLOCKED if absent |
| `explainability_bundle.evidence_panel` | L5/L6 | YES at generation | NORM-ALI-04; NORM-Q-01..04; NORM-NARR-02 | EXECUTIVE | at_generation | YES | BLOCKED if absent |
| `explainability_bundle.trace_panel` | L3/L9 | PASS-THROUGH + trace label rules | NORM-TRACE-01; NORM-TRACE-02; NORM-ALI-04; NORM-ALI-05 | ADVISORY | at_generation | YES | DIAGNOSTIC if trace refs absent |
| `explainability_bundle.qualifiers_panel` | L6 Q-taxonomy | YES — Q-taxonomy text | NORM-Q-01..04 | EXECUTIVE (if Q-01..04 active) | at_generation | YES | DIAGNOSTIC if Q-04 not acknowledged |
| `explainability_bundle.lineage_panel` | L9 provenance | PASS-THROUGH + reference formatting | NORM-TRACE-01; NORM-TRACE-02 | ADVISORY | at_generation | YES | DIAGNOSTIC if lineage refs absent |
| `explainability_bundle.confidence_panel` | L3/L4/L6 grounding | YES — grounding vocabulary | NORM-Q-01..04; NORM-DENSITY-01 | EXECUTIVE | at_generation | YES | DIAGNOSTIC if grounding data absent |
| `explainability_bundle.readiness_state_panel` | L8/L6 | YES — ALI-03 + Q labels | NORM-ALI-03; NORM-Q-01..04 | EXECUTIVE | at_generation | YES | BLOCKED if absent |

---

## 8. Topology Display Fields (Phase 3+)

These fields are inactive in Phase 2. Normalization rules defined here for forward compatibility.

| report_object Field | Normalization Required | Rule Set | Phase | Notes |
|---------------------|----------------------|----------|-------|-------|
| Topology domain labels | YES — ALI-04 | NORM-ALI-04 | Phase 3+ | Read-only display only; ALI-04 applied |
| Topology cluster labels | YES — ALI-05 | NORM-ALI-05 | Phase 3+ | Read-only display only; ALI-05 applied |
| Topology edge direction | PASS-THROUGH | NORM-PROP-01 | Phase 3+ | Directional display; no modification |
| Topology pressure indicators | YES — pressure tier to visual token | NORM-PROP-02 | Phase 3+ | PressureTier → color token only; no numerical values |

---

## 9. Lineage Fields (Audit Tier)

| report_object Field | Exec-Visible | Advisory-Visible | Audit-Visible | Normalization | Notes |
|---------------------|-------------|-----------------|---------------|--------------|-------|
| `trace_linkage.evidence_object_hash` | NO | Abbreviated (8 chars + "...") | Full value | NORM-TRACE-01 | Never decoded in any client surface |
| `trace_linkage.derivation_hash` | NO | NO | Reference ID only | NORM-TRACE-02 | Reference label only; not decoded |
| `trace_linkage.baseline_anchor` | NO | YES | YES | PASS-THROUGH | Readable baseline label |
| `trace_linkage.stream_anchor` | NO | Reference label | Full value | NORM-TRACE-01 | Stream reference |
| `trace_linkage.run_id` | NO | NO | YES | NORM-TRACE-01 | Pipeline run identifier; replay anchor |

---

## 10. Audit Fields

| report_object Field | Exec-Visible | Advisory | Audit | Normalization | Notes |
|---------------------|-------------|----------|-------|--------------|-------|
| `derivation_hash` | NO | NO | Reference ID | NORM-TRACE-02 | Never displayed in executive or advisory |
| `stream_ref` | NO | Reference | Full value | NORM-TRACE-01 | Internal identifier |
| `rendering_metadata` | NO | NO | YES | PASS-THROUGH | Full rendering provenance for audit |
| `rendering_metadata.normalization_version` | NO | Reference | YES | PASS-THROUGH | Enables replay verification |
| `rendering_metadata.ali_rules_applied` | NO | NO | YES | PASS-THROUGH | Audit trail of which ALI rules ran |

---

## Normalization Timing Summary

| Timing | Fields | Rule |
|--------|--------|------|
| `at_generation` (GEIOS side, before report_object commit) | All ALI-normalized fields; all narrative text; all qualifier labels | Normalization applied once; result committed; immutable |
| `at_render` (LENS side, display only) | color_token (mapped from pre-normalized qualifier); expand/collapse states | No content normalization — display state only |
| `PROHIBITED` | evidence_object_hash; derivation_hash; readiness_state; qualifier_class | These fields must not be normalized — they carry governance authority values |

---

## Normalization Authority Boundary

```
GEIOS SIDE (normalization authority):
  L6 Cognitive Normalization runs ALI-01..07
  L6 applies Q-taxonomy labels
  L7 LLM output passes through vocabulary contract check
  L8 assembles pre-normalized report_object
  report_object committed → evidence_object_hash sealed
                         ↓
BRIDGE (sealed; immutable from this point)
                         ↓
LENS SIDE (rendering only; no normalization authority):
  Renders pre-normalized content from report_object
  Applies design tokens (color, typography) to pre-normalized labels
  Activates EXPAND_COLLAPSE interactions (display state only)
  Verifies evidence_object_hash
  Does NOT re-run ALI rules
  Does NOT supplement narrative
  Does NOT generate content
```

---

*Stream PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01 — Field Mapping — COMPLETE*  
*Issued: 2026-05-08*
