# Rendering Adapter Plan

**Stream:** PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01  
**Document type:** RENDERING ADAPTER PLAN  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  

---

## 1. Adapter Principle

> Adapters transform structure. Adapters do not transform meaning.

Adapters are the sole transformation layer between the committed report_object and the component tree. They exist to:

1. **Select** only the fields each component needs
2. **Filter** fields by audience tier
3. **Rename** fields to component-facing prop names
4. **Apply null safety** for absent optional fields
5. **Enforce vocabulary** by stripping any raw identifier that slipped through

Adapters do not:
- compute readiness state from signals
- compute qualifier from evidence
- apply ALI aliasing (already applied at generation)
- generate text
- call external services
- decode hash values

**Implementation location:** `app/execlens-demo/adapters/`  
**Pattern:** Pure functions — `(report_object, audience_tier) → display_object`  
**No side effects.** No async operations. No AI calls.

---

## 2. Adapter Catalog

### 2.1 ReportObjectValidator

**Purpose:** Pre-render gate. Validates the report_object before any adapter runs.

| Property | Definition |
|----------|-----------|
| Input | `report_object` (raw JSON) |
| Output | `ValidationResult { valid: bool, blocked: bool, diagnostic: bool, reason: string | null }` |
| File | `app/execlens-demo/validators/ReportObjectValidator.js` |

**Allowed transformations:**
- Parse report_object against report_object.schema.json
- Verify `evidence_object_hash` is present and non-empty
- Check `governance_verdict` value
- Check `rendering_metadata.normalization_version` against expected version
- Derive `blocked` flag and `diagnostic` flag from checks

**Forbidden transformations:**
- Modifying any report_object field
- Supplementing missing fields with defaults
- Continuing past a hash failure

**Failure behavior:**
- Hash absent or mismatch → `{ valid: false, blocked: true, reason: 'HASH_FAILURE' }`
- `governance_verdict = FAIL` → `{ valid: false, blocked: true, reason: 'GOVERNANCE_FAIL' }`
- normalization_version mismatch → `{ valid: true, blocked: false, diagnostic: true }`
- Schema validation fail → `{ valid: false, blocked: true, reason: 'SCHEMA_FAIL' }`

**Downstream consumers:** ReportContainer (routing decision)

**Governance constraints:** EXP-BLOCK-02; ROM-VAL-03; ROM-VAL-05

---

### 2.2 SurfaceModeResolver

**Purpose:** Resolves audience tier to density class and panel default states.

| Property | Definition |
|----------|-----------|
| Input | `audience_tier: 'EXECUTIVE' | 'ADVISORY' | 'AUDIT'` |
| Output | `SurfaceModeDisplay { density_class, panel_defaults: map<panel_id, state> }` |
| File | `app/execlens-demo/adapters/SurfaceModeResolver.js` |

**Allowed transformations:**
- Map audience_tier → density_class per `executive_rendering_system.json`
- Map density_class → default panel states per `panel_default_states` registry

**Forbidden transformations:**
- Elevating audience tier
- Customizing panel defaults outside the registry

**Failure behavior:**
- Unknown audience_tier → default to EXECUTIVE_DENSE

**Downstream consumers:** ReportContainer, ProgressiveDisclosureController

---

### 2.3 ReadinessBadgeAdapter

**Purpose:** Transforms report_object readiness fields into ReadinessBadge display props.

| Property | Definition |
|----------|-----------|
| Input | `report_object.readiness_state`, `report_object.header_block.readiness_badge` |
| Output | `ReadinessBadgeDisplay { readiness_label, badge_token, governance_status_label }` |
| File | `app/execlens-demo/adapters/ReadinessBadgeAdapter.js` |

**Allowed transformations:**
- Map `readiness_state` enum → `readiness_label` per `VIS-READY-01` mapping table
- Map `readiness_state` enum → `badge_token` per `VIS-READY-01` mapping table
- Extract `state_label` from `header_block.readiness_badge` (already normalized)
- Produce `governance_status_label` as executive-visible status indicator

**Forbidden transformations:**
- Passing raw `readiness_state` enum to component
- Computing a different readiness label than the ALI-03 mapping table
- Applying any numerical modifier to badge display

**Failure behavior:**
- `readiness_state` absent → route to BlockedState

**Downstream consumers:** ReadinessBadge

**Governance constraints:** VIS-READY-01; VIS-READY-02; NORM-ALI-03

---

### 2.4 QualifierChipAdapter

**Purpose:** Transforms qualifier fields into QualifierChip display props including chip style, tooltip, and Q-04 absence notice.

| Property | Definition |
|----------|-----------|
| Input | `report_object.qualifier_class`, `report_object.header_block.readiness_badge.qualifier_label`, `report_object.header_block.readiness_badge.tooltip_text` |
| Output | `QualifierChipDisplay { chip_label, chip_token, tooltip_text, absence_notice, renders }` |
| File | `app/execlens-demo/adapters/QualifierChipAdapter.js` |

**Allowed transformations:**
- Map `qualifier_class` → `chip_label` per `VIS-QUAL-01` mapping table
- Map `qualifier_class` → `chip_token` per `VIS-QUAL-01` mapping table
- Set `renders = false` for Q-00; `renders = true` for Q-01..Q-03
- Set `absence_notice` for Q-04
- Extract pre-rendered `tooltip_text` from `readiness_badge.tooltip_text`

**Forbidden transformations:**
- Passing raw `qualifier_class` enum to component
- Generating tooltip text at adapter time
- Setting `renders = false` for Q-01..Q-03 for any reason

**Failure behavior:**
- `qualifier_class` absent → route to DiagnosticState

**Downstream consumers:** QualifierChip

**Governance constraints:** VIS-QUAL-01; VIS-QUAL-02; EXP-QUAL-01..03

---

### 2.5 NarrativeAdapter

**Purpose:** Transforms narrative_block into display-ready narrative props. Verifies vocabulary contract compliance (no raw identifiers in output).

| Property | Definition |
|----------|-----------|
| Input | `report_object.narrative_block`, `report_object.qualifier_class` |
| Output | `NarrativeDisplay { executive_summary, why_primary_statement, structural_summary, qualifier_notice }` |
| File | `app/execlens-demo/adapters/NarrativeAdapter.js` |

**Allowed transformations:**
- Extract `executive_summary` from `narrative_block.executive_summary`
- Extract `why_section` primary statement for WHY panel
- Extract `structural_summary`
- Derive `qualifier_notice` from `qualifier_class` per Q-taxonomy (pre-rendered text from explainability_bundle.why_panel qualifier notice)

**Forbidden transformations:**
- Generating new narrative text
- Supplementing missing sections with AI-generated text
- Applying vocabulary normalization (already applied at generation)
- Truncating narrative content

**Failure behavior:**
- Any narrative field absent → route affected panel to DiagnosticState (NORM-DIAG-01)

**Downstream consumers:** IntelligenceSummary, NarrativeBlock

**Governance constraints:** EXP-WHY-01; EXP-WHY-02; NORM-NARR-01..04

---

### 2.6 EvidencePanelAdapter

**Purpose:** Transforms evidence_blocks[] into EvidencePanel display props. Applies audience tier filtering. Enforces domain ordering.

| Property | Definition |
|----------|-----------|
| Input | `report_object.evidence_blocks[]`, `audience_tier` |
| Output | `EvidencePanelDisplay { domains: EvidenceDrawerDisplay[], domain_count, grounding_summary }` |
| File | `app/execlens-demo/adapters/EvidencePanelAdapter.js` |

**Allowed transformations:**
- Order domains by propagation_role: ORIGIN → RECEIVER → PASS_THROUGH → ISOLATED
- Map each evidence_block → `EvidenceDrawerDisplay` (delegates to EvidenceDrawerAdapter)
- Count domains; identify top contributing domain (ORIGIN first)
- Filter fields by audience tier

**Forbidden transformations:**
- Reordering domains by computed pressure
- Hiding domains from the adapter output
- Computing grounding percentage

**Failure behavior:**
- `evidence_blocks` absent or empty → route to BlockedState (ROM-VAL-10)

**Downstream consumers:** EvidencePanel, IntelligenceSummary (domain summary)

**Governance constraints:** EXP-EVID-01; EXP-EVID-03

---

### 2.7 EvidenceDrawerAdapter

**Purpose:** Transforms one evidence_block into EvidenceDrawer display props. Enforces ALI-04 domain alias; strips raw domain IDs.

| Property | Definition |
|----------|-----------|
| Input | `evidence_block` (one entry from `evidence_blocks[]`), `audience_tier` |
| Output | `EvidenceDrawerDisplay { domain_alias, grounding_scope, grounding_label, propagation_role_label, signal_cards, evidence_summary, is_suppressed }` |
| File | `app/execlens-demo/adapters/EvidenceDrawerAdapter.js` |

**Allowed transformations:**
- Extract `domain_alias` from `evidence_block.domain_alias` (already ALI-04 aliased)
- Map `grounding_status` → `grounding_scope` + `grounding_label` per GroundingScope mapping
- Map `propagation_role` → `propagation_role_label` per VIS-PROP-01 mapping
- Set `is_suppressed` for Q-04 scoped domains
- Delegate signal_cards to SignalCardAdapter

**Forbidden transformations:**
- Using raw domain IDs in output
- Computing grounding from signal data
- Generating evidence text

**Failure behavior:**
- `domain_alias` absent → fallback label "Domain [n]" per NORM-DIAG-01
- `propagation_role` absent → "Independent Domain" per NORM-PROP-01 fallback

**Downstream consumers:** EvidenceDrawer

**Governance constraints:** EXP-EVID-01; NORM-ALI-04; VIS-PROP-01

---

### 2.8 SignalCardAdapter

**Purpose:** Transforms one signal_card entry into SignalCard display props. Enforces ALI-01/02 labels; strips raw signal keys.

| Property | Definition |
|----------|-----------|
| Input | `signal_card` (one entry from `evidence_block.signal_cards[]`) |
| Output | `SignalCardDisplay { signal_label, pressure_tier, pressure_label, pressure_token, qualifier_label, evidence_text }` |
| File | `app/execlens-demo/adapters/SignalCardAdapter.js` |

**Allowed transformations:**
- Extract `signal_label` (already ALI-01/02 normalized)
- Extract `pressure_tier`; map → `pressure_label` per NORM-PROP-01; map → `pressure_token` per VIS-PRESS-01
- Extract `qualifier_label` (already Q-taxonomy normalized; empty string for Q-00)
- Extract `evidence_text` (already vocabulary-contract applied)

**Forbidden transformations:**
- Passing raw signal keys (`cpi_score`, `cfa_score`, `CPI`, `CFA`) to component
- Computing pressure tier from numerical signal values
- Generating evidence text

**Failure behavior:**
- `signal_label` absent → blank label + NORM-DIAG-01 diagnostic
- `pressure_tier` absent → route signal card to DiagnosticState

**Downstream consumers:** SignalCard

**Governance constraints:** VIS-PRESS-01; VIS-PRESS-02; NORM-ALI-01; NORM-ALI-02

---

### 2.9 TracePanelAdapter

**Purpose:** Transforms trace_block and trace_linkage into TracePanel display props. Applies audience tier hash visibility rules.

| Property | Definition |
|----------|-----------|
| Input | `report_object.trace_block`, `report_object.trace_linkage`, `audience_tier` |
| Output | `TracePanelDisplay { propagation_path, propagation_summary, baseline_ref_label, stream_ref_label?, derivation_ref_abbreviated? }` |
| File | `app/execlens-demo/adapters/TracePanelAdapter.js` |

**Allowed transformations:**
- Extract `propagation_path` (ALI-04 aliases already applied)
- Extract `propagation_summary` (normalized)
- Extract readable `baseline_ref` label
- For Advisory+: abbreviate `derivation_hash` to first 8 chars + "..."
- Apply audience tier: Executive → no hash; Advisory → abbreviated; Audit → abbreviated (hash never fully decoded)

**Forbidden transformations:**
- Decoding or explaining hash values
- Including full hash in Advisory tier output
- Using raw cluster keys in propagation path

**Failure behavior:**
- `propagation_path` absent → DIAGNOSTIC

**Downstream consumers:** TracePanel

**Governance constraints:** EXP-TRACE-01; EXP-TRACE-02; EXP-TRACE-03

---

### 2.10 ExplainabilityBundleAdapter

**Purpose:** Transforms report_object.explainability_bundle into all 7 panel display objects. Applies blocked/diagnostic states per panel. Applies audience tier.

| Property | Definition |
|----------|-----------|
| Input | `report_object.explainability_bundle`, `validation_result`, `audience_tier` |
| Output | `ExplainabilityBundleDisplay { why, evidence, trace, qualifiers, lineage, confidence, readiness_state }` (7 named panel display objects) |
| File | `app/execlens-demo/adapters/ExplainabilityBundleAdapter.js` |

**Allowed transformations:**
- Extract each panel from bundle by panel_id
- Apply audience tier visibility per EXP-AUD-01
- Set panel_state = BLOCKED for panels affected by validation failure
- Set panel_state = DIAGNOSTIC for panels affected by normalization version mismatch
- Pass qualifier_object to QUALIFIERS panel; preserve absence_notice for Q-04

**Forbidden transformations:**
- Generating new panel content
- Supplementing absent panels with improvised content
- Suppressing qualifier panel when qualifier active

**Failure behavior:**
- Any required panel absent → panel → BLOCKED
- Optional panel absent → panel → DIAGNOSTIC

**Downstream consumers:** ExplainabilityBundle

**Governance constraints:** EXP-BLOCK-01; EXP-BLOCK-02; EXP-QUAL-01; EXP-FORBID-01

---

### 2.11 TopologySummaryAdapter

**Purpose:** Transforms topology_scope into TopologySummary display props. Phase 2: outputs placeholder. Phase 3+: outputs read-only topology display object.

| Property | Definition |
|----------|-----------|
| Input | `report_object.topology_scope`, `phase` |
| Output | `TopologySummaryDisplay { phase_2_placeholder: true }` (Phase 2) OR `TopologyDisplay { domains, edges }` (Phase 3+) |
| File | `app/execlens-demo/adapters/TopologySummaryAdapter.js` |

**Allowed transformations:**
- Phase 2: return placeholder flag
- Phase 3+: extract domain list (ALI-04 aliases only); extract propagation edges (aliases only)

**Forbidden transformations:**
- Including raw cluster keys or domain IDs
- Including numerical topology metrics
- Providing edit affordances in output

**Failure behavior:** Phase 2: placeholder renders; Phase 3+: missing topology → DIAGNOSTIC

**Downstream consumers:** TopologySummary

**Governance constraints:** VIS-TOPO-01; VIS-TOPO-02; EXP-PROG-01

---

### 2.12 BlockedStateAdapter

**Purpose:** Transforms validation failure into BlockedState display props. Always explicit; never silent.

| Property | Definition |
|----------|-----------|
| Input | `validation_result.reason`, `audience_tier` |
| Output | `BlockedStateDisplay { blocked_headline, blocked_reason, audit_access_available }` |
| File | `app/execlens-demo/adapters/BlockedStateAdapter.js` |

**Allowed transformations:**
- Map `reason` → user-visible headline ("Readiness classification unavailable")
- Set `audit_access_available = true` if `audience_tier >= ADVISORY`

**Forbidden transformations:**
- Providing fallback intelligence content
- Estimating a readiness state from partial data
- Providing a "retry" payload

**Failure behavior:** If BlockedStateAdapter itself fails, render a minimal static blocked notice.

**Downstream consumers:** BlockedState

**Governance constraints:** VIS-BLOCK-01; VIS-BLOCK-02; EXP-BLOCK-01

---

### 2.13 DiagnosticStateAdapter

**Purpose:** Transforms diagnostic conditions into DiagnosticState display props.

| Property | Definition |
|----------|-----------|
| Input | `validation_result.diagnostic_reason`, `affected_panel_ids` |
| Output | `DiagnosticStateDisplay { diagnostic_banner_text, affected_panel_ids, advisory_notice }` |
| File | `app/execlens-demo/adapters/DiagnosticStateAdapter.js` |

**Allowed transformations:**
- Produce executive-visible diagnostic banner text
- List affected panel IDs for border indicator application
- Include mandatory advisory notice text

**Forbidden transformations:**
- Revealing GEIOS-internal diagnostic codes
- Suppressing the diagnostic notice

**Failure behavior:** If DiagnosticStateAdapter fails, render a generic diagnostic banner.

**Downstream consumers:** DiagnosticState

**Governance constraints:** VIS-DIAG-01; EXP-DIAG-01; EXP-DIAG-02

---

### 2.14 AuditLineageAdapter

**Purpose:** Transforms trace_linkage and rendering_metadata into AuditLineage display props. Applies audience tier hash visibility rules.

| Property | Definition |
|----------|-----------|
| Input | `report_object.trace_linkage`, `report_object.rendering_metadata`, `audience_tier` |
| Output | `AuditLineageDisplay { baseline_anchor_label, evidence_hash_display, stream_anchor_display, run_id?, generated_at }` |
| File | `app/execlens-demo/adapters/AuditLineageAdapter.js` |

**Allowed transformations:**
- Extract `baseline_anchor` as readable label
- For Advisory: abbreviate `evidence_object_hash` (8 chars + "...")
- For Audit: pass full `evidence_object_hash`
- For Advisory: stream_anchor as reference label; Audit: full value
- For Audit only: include `run_id`
- Extract `generated_at` from `rendering_metadata`

**Forbidden transformations:**
- Decoding or explaining hash values at any tier
- Including full hash for Advisory tier
- Including lineage in Executive tier output

**Failure behavior:** Missing lineage fields → DIAGNOSTIC per EXP-LINEAGE-02

**Downstream consumers:** AuditLineage

**Governance constraints:** VIS-AUDIT-01; VIS-AUDIT-02; EXP-LINEAGE-01; EXP-LINEAGE-02

---

## 3. Adapter Layer Governance Summary

| Rule | Requirement |
|------|-------------|
| All adapters are pure functions | No side effects; no async; no AI calls |
| Adapters receive report_object; components receive adapter output | No component has direct report_object access |
| Adapters enforce vocabulary contract | No raw GEIOS identifiers in any adapter output |
| Adapters enforce audience tier | Higher-tier fields never reach lower-tier adapter output |
| Adapters do not generate content | Only structural transformation; no text generation |
| Adapters do not apply ALI rules | ALI already applied at generation; adapters select and reshape |
| Adapter failures route to BlockedState or DiagnosticState | Never silent; never fallback intelligence |

---

*Stream PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01 — Rendering Adapter Plan — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
