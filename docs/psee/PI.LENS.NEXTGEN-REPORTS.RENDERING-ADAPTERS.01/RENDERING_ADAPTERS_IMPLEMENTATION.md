# Rendering Adapters — Implementation Record

**Stream:** PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01  
**Document type:** IMPLEMENTATION RECORD  
**Status:** COMPLETE  
**Date:** 2026-05-09  
**Branch:** work/lens-v2-productization  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream validation:** PI.LENS.NEXTGEN-REPORTS.FRONTEND-INPUT-VALIDATION.01 (2aa40e7)  
**Upstream planning:** PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01 (939e75a)

---

## 1. Implementation Overview

Stream PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01 implements all 14 governed rendering adapters for the LENS NextGen frontend.

Adapters are the sole transformation layer between the validated report_object and the component tree. They transform structure for rendering — they do not transform meaning.

**Adapter layer location:** `app/execlens-demo/adapters/`

---

## 2. Adapter Architecture

```
validated report_object
    │
    ▼
STAGE 1: validateReportObjectPipeline()   ← trust boundary enforcement
    │
    ├─ BLOCKED → BlockedStateAdapter only
    ├─ DIAGNOSTIC_ONLY → DiagnosticStateAdapter + ReadinessBadge + AuditLineage
    └─ EXECUTIVE_READY / WITH_QUALIFIER → full adapter chain:
         │
         ├─ SurfaceModeResolver     ← readiness_state + governance_verdict → surface mode
         ├─ ReadinessBadgeAdapter   ← VIS-READY-01 token mapping
         ├─ QualifierChipAdapter    ← VIS-QUAL-01 chip mapping
         ├─ NarrativeAdapter        ← pass-through, null-safety
         ├─ EvidencePanelAdapter    ← evidence_blocks ordering + drawer delegation
         │   └─ EvidenceDrawerAdapter ← one block → drawer props
         │       └─ SignalCardAdapter ← VIS-PRESS-01 pressure token mapping
         ├─ TracePanelAdapter       ← audience-tier hash visibility
         ├─ ExplainabilityBundleAdapter ← all 7 panels + audience tier
         ├─ TopologySummaryAdapter  ← Phase 2 placeholder
         └─ AuditLineageAdapter     ← audience-tier lineage visibility
```

### 2.1 Adapter Inventory

| Adapter | File | Input → Output |
|---------|------|---------------|
| AdapterErrorTaxonomy | `AdapterErrorTaxonomy.js` | Constants — 14 error IDs, forbidden key lists |
| SurfaceModeResolver | `SurfaceModeResolver.js` | readiness_state + verdict → surface mode; audience → density class |
| ReadinessBadgeAdapter | `ReadinessBadgeAdapter.js` | reportObject → badge_token + executive_label (VIS-READY-01) |
| QualifierChipAdapter | `QualifierChipAdapter.js` | qualifier_class → chip props (VIS-QUAL-01) |
| NarrativeAdapter | `NarrativeAdapter.js` | narrative_block → display props (pass-through) |
| EvidencePanelAdapter | `EvidencePanelAdapter.js` | evidence_blocks[] → ordered domain list |
| EvidenceDrawerAdapter | `EvidenceDrawerAdapter.js` | one evidence_block → drawer props |
| SignalCardAdapter | `SignalCardAdapter.js` | one signal_card → card props (VIS-PRESS-01) |
| TracePanelAdapter | `TracePanelAdapter.js` | trace_block + audience → trace props |
| ExplainabilityBundleAdapter | `ExplainabilityBundleAdapter.js` | bundle + audience → 7 panel display objects |
| TopologySummaryAdapter | `TopologySummaryAdapter.js` | topology_scope → placeholder (Phase 2) |
| BlockedStateAdapter | `BlockedStateAdapter.js` | validation reason → blocked display |
| DiagnosticStateAdapter | `DiagnosticStateAdapter.js` | diagnostic reasons → diagnostic banner |
| AuditLineageAdapter | `AuditLineageAdapter.js` | trace_linkage + audience → lineage props |
| Pipeline | `index.js` | orchestrates all adapters; validation-first trust boundary |

---

## 3. Adapter Lifecycle

1. `adaptReport(reportObject, audienceTier, phase)` is called by the ReportContainer (downstream)
2. Validation runs first via `validateReportObjectPipeline()` — trust boundary
3. If BLOCKED: only `BlockedStateAdapter` runs; all intelligence props = null
4. If DIAGNOSTIC_ONLY: `DiagnosticStateAdapter` + `ReadinessBadgeAdapter` + `AuditLineageAdapter`; no narrative/evidence
5. If EXECUTIVE_READY or EXECUTIVE_READY_WITH_QUALIFIER: full adapter chain in sequence
6. All adapter errors are collected in `adapterErrors[]` — never silently discarded
7. `diagnosticState` is populated if diagnostic reasons exist even on executive-ready reports (degraded metadata)

---

## 4. Trust Boundary

The adapter layer depends on the completed validation layer. Raw unvalidated report_objects never reach individual adapters without validation having run first. The pipeline enforces this via `validateReportObjectPipeline()` as Step 1.

Individual adapters accept `reportObject` assuming it has been through the pipeline. Direct adapter calls (e.g., for testing) skip the pipeline but are explicit.

---

## 5. Validation Dependency

| Validation Outcome | Adapter Routing |
|-------------------|-----------------|
| `renderState === 'BLOCKED'` | BlockedStateAdapter only |
| `renderState === 'DIAGNOSTIC_ONLY'` | DiagnosticStateAdapter + partial adapters |
| `renderState === 'EXECUTIVE_READY'` | Full adapter chain |
| `renderState === 'EXECUTIVE_READY_WITH_QUALIFIER'` | Full adapter chain |

---

## 6. Input/Output Contracts

### ReadinessBadgeAdapter
- Input: `readiness_state` + `header_block.readiness_badge`
- Output: `{ readiness_label, badge_token, governance_status_label, qualifier_label, tooltip_text }`
- Token source: VIS-READY-01 mapping table
- Forbidden: raw `readiness_state` enum in output label

### QualifierChipAdapter
- Input: `qualifier_class`, `tooltip_text`
- Output: `{ renders, chip_label, chip_token, tooltip_text, absence_notice }`
- Token source: VIS-QUAL-01 mapping table
- Q-00: `renders=false`; Q-01..03: `renders=true`; Q-04: `absence_notice` mandatory

### SignalCardAdapter
- Input: one `signal_card` object
- Output: `{ signal_label, pressure_tier, pressure_label, pressure_token, qualifier_label, evidence_text }`
- Token source: VIS-PRESS-01 mapping table
- Forbidden: raw CPI/CFA keys in `signal_label`; numerical pressure values in output

### TracePanelAdapter
- Input: `trace_block`, `trace_linkage`, `audience_tier`
- Output: `{ propagation_path, propagation_summary, baseline_ref_label, derivation_ref_abbreviated? }`
- EXECUTIVE: no hash; ADVISORY/AUDIT: 8-char abbreviated hash + "..."; hash never decoded

### AuditLineageAdapter
- Input: `trace_linkage`, `rendering_metadata`, `audience_tier`
- Output: `{ baseline_anchor_label, evidence_hash_display?, stream_anchor_display?, run_id? }`
- EXECUTIVE: `visible_for_tier=false`, all fields null
- ADVISORY: abbreviated hash, no run_id
- AUDIT: abbreviated hash + run_id

---

## 7. Deterministic Guarantees

All adapters are pure functions:
- Same input → same output on every invocation
- No random state, no Date.now(), no external reads
- No async operations
- No side effects on input (no mutation)
- Verified by NO MUTATION and DETERMINISTIC tests

---

## 8. Blocked/Diagnostic Routing

### Blocked state
`BlockedStateAdapter` produces explicit visible display. `blocked_headline` is always set. No intelligence content is provided. `audit_access_available` is set for ADVISORY/AUDIT tiers.

### Diagnostic state
`DiagnosticStateAdapter` produces `diagnostic_banner_text` and `advisory_notice`. Diagnostic state never promotes to executive-ready. `affected_panel_ids` carries the list of degraded panels.

Both states are explicit — never silent, never fallback to partial intelligence rendering.

---

## 9. Audit Visibility Model

| Field | EXECUTIVE | ADVISORY | AUDIT |
|-------|-----------|----------|-------|
| evidence_hash_display | hidden | 8-char abbreviated | 8-char abbreviated |
| derivation_ref_abbreviated | hidden | 8-char abbreviated | 8-char abbreviated |
| run_id | hidden | hidden | visible |
| LINEAGE panel | not visible | visible | visible |
| stream_anchor_display | hidden | visible | visible |

Hash values are never decoded, explained, or fully exposed at any tier.

---

## 10. Governance Preservation

| Rule | Enforcement |
|------|------------|
| No raw readiness enum in badge text | READINESS_BADGE_MAP.executive_label used exclusively |
| No raw qualifier enum in chip label | QUALIFIER_CHIP_MAP.chip_label used exclusively |
| Q-01..Q-03 chip never suppressed | `renders: true` enforced; tested |
| Q-04 absence notice mandatory | QualifierChipAdapter.absence_notice; ExplainabilityValidator |
| No CPI/CFA raw keys in signal output | FORBIDDEN_RAW_SIGNAL_KEYS scan in SignalCardAdapter |
| Numerical pressure values forbidden | PRESSURE_TIER_MAP produces display_label only |
| No GEIOS internals in adapter output | FORBIDDEN_GEIOS_IDENTIFIERS defined in taxonomy |
| No topology mutation | TopologySummaryAdapter: read_only=true always |
| No narrative generation | NarrativeAdapter is pass-through only |
| No evidence generation | EvidenceDrawerAdapter accepts only pre-rendered evidence |

---

## 11. Downstream Component Readiness

The following downstream component contracts are now unblocked:

| Contract | Evidence |
|----------|----------|
| PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01 | adaptReport() pipeline ready for ReportContainer consumption |
| PI.LENS.NEXTGEN-REPORTS.READINESS-BADGE-SYSTEM.01 | ReadinessBadgeAdapter output contract defined |
| PI.LENS.NEXTGEN-REPORTS.EXECUTIVE-NARRATIVE-RENDERING.01 | NarrativeAdapter output contract defined |
| PI.LENS.NEXTGEN-REPORTS.PROPAGATION-EXPLAINABILITY.01 | ExplainabilityBundleAdapter + TracePanelAdapter output contracts defined |
| PI.LENS.NEXTGEN-REPORTS.PHASE-2-GATE-1.01 | Full adapter chain operational; gates measurable |

---

*Stream PI.LENS.NEXTGEN-REPORTS.RENDERING-ADAPTERS.01 — IMPLEMENTATION RECORD*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-09*
