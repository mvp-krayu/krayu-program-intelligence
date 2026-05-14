# Implementation Sequence

**Stream:** PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01  
**Document type:** IMPLEMENTATION SEQUENCE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  

---

## 1. Sequencing Principles

Implementation follows strict dependency order. Each step has a defined objective, affected files, dependencies, validation requirements, fail conditions, and rollback boundary.

**General rules:**
- No step begins until all its dependencies pass validation
- Each step is a standalone implementation unit — testable in isolation
- Existing files (`app/execlens-demo/components/`, `scripts/`) are never modified
- All new files go into `app/execlens-demo/components/nextgen/`, `app/execlens-demo/adapters/`, `app/execlens-demo/validators/`, `app/execlens-demo/tokens/`
- Each step ends with a validation check; failure triggers rollback to step boundary

---

## 2. Implementation Steps

---

### STEP 1 — Frontend Input Validation Layer

**Objective:** Implement `ReportObjectValidator` that validates report_object against schema, verifies evidence_object_hash presence, checks governance_verdict, and produces `ValidationResult`.

**Files likely affected:**
- `app/execlens-demo/validators/ReportObjectValidator.js` (CREATE)
- `app/execlens-demo/validators/index.js` (CREATE)

**Dependencies:** None — this is the first implementation step.

**Validation requirements:**
- `ReportObjectValidator(report_object)` returns `{ valid, blocked, diagnostic, reason }`
- Hash absent → `{ valid: false, blocked: true, reason: 'HASH_FAILURE' }`
- `governance_verdict = 'FAIL'` → `{ valid: false, blocked: true, reason: 'GOVERNANCE_FAIL' }`
- normalization_version mismatch → `{ valid: true, diagnostic: true }`
- Valid report_object → `{ valid: true, blocked: false, diagnostic: false }`
- Unit tests pass for all four cases

**Fail conditions:**
- Validator passes a report_object with missing hash
- Validator allows rendering from `governance_verdict = FAIL`
- Validator calls any external AI service

**Rollback boundary:** Delete `app/execlens-demo/validators/`

---

### STEP 2 — Rendering Adapter Layer

**Objective:** Implement all 14 rendering adapters as pure functions. Each adapter transforms one report_object section into component-ready display objects.

**Files likely affected:**
- `app/execlens-demo/adapters/ReportObjectValidator.js` (note: SurfaceModeResolver)
- `app/execlens-demo/adapters/SurfaceModeResolver.js` (CREATE)
- `app/execlens-demo/adapters/ReadinessBadgeAdapter.js` (CREATE)
- `app/execlens-demo/adapters/QualifierChipAdapter.js` (CREATE)
- `app/execlens-demo/adapters/NarrativeAdapter.js` (CREATE)
- `app/execlens-demo/adapters/EvidencePanelAdapter.js` (CREATE)
- `app/execlens-demo/adapters/EvidenceDrawerAdapter.js` (CREATE)
- `app/execlens-demo/adapters/SignalCardAdapter.js` (CREATE)
- `app/execlens-demo/adapters/TracePanelAdapter.js` (CREATE)
- `app/execlens-demo/adapters/ExplainabilityBundleAdapter.js` (CREATE)
- `app/execlens-demo/adapters/TopologySummaryAdapter.js` (CREATE)
- `app/execlens-demo/adapters/BlockedStateAdapter.js` (CREATE)
- `app/execlens-demo/adapters/DiagnosticStateAdapter.js` (CREATE)
- `app/execlens-demo/adapters/AuditLineageAdapter.js` (CREATE)
- `app/execlens-demo/adapters/index.js` (CREATE)

**Dependencies:** STEP 1 (validator must be stable before adapter pipeline)

**Validation requirements:**
- Each adapter is a pure function: given same input → same output
- No adapter contains `fetch`, `XMLHttpRequest`, or AI SDK imports
- Adapter outputs contain no raw GEIOS identifiers (cpi_score, cfa_score, Q-00..Q-04 raw, EXECUTIVE_READY raw, domain IDs)
- ReadinessBadgeAdapter maps all 5 ReadinessState values correctly
- QualifierChipAdapter: `renders = false` for Q-00; `renders = true` for Q-01..03; absence_notice for Q-04
- AuditLineageAdapter: hash abbreviated for Advisory; full for Audit; not included for Executive
- Unit tests for each adapter (given sample report_object → expected display object)

**Fail conditions:**
- Any adapter imports or calls an AI/RAG service
- Any adapter passes raw signal keys in output
- Any adapter passes raw ReadinessState enum in output
- Any adapter passes raw qualifier_class enum in output
- QualifierChipAdapter sets `renders = false` for Q-01..03

**Rollback boundary:** Delete `app/execlens-demo/adapters/`

---

### STEP 3 — Core Report Container

**Objective:** Implement `ReportContainer` — the root component that wires validator → adapters → layout regions.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/ReportContainer.jsx` (CREATE)
- `app/execlens-demo/pages/report/[report_id].js` (CREATE — new NextGen report route)

**Dependencies:** STEP 1 (validator), STEP 2 (adapters)

**Validation requirements:**
- `ReportContainer` accepts `{ report_object, audience_tier }` props
- Routes correctly: BlockedState for hash/governance failures; DiagnosticState for diagnostic; normal tree for valid
- Does not render any intelligence content when validation fails
- Existing routes (existing PoC pages) not affected
- Non-regression: existing `app/execlens-demo/pages/index.js` still renders

**Fail conditions:**
- `ReportContainer` renders intelligence content from a blocked report_object
- `ReportContainer` modifies `audience_tier` after initialization
- New route conflicts with existing pages

**Rollback boundary:** Delete new report route file; delete `ReportContainer.jsx`

---

### STEP 4 — Executive Header and Readiness Badge

**Objective:** Implement `ExecutiveHeader`, `ReadinessBadge`. Connect to `ReadinessBadgeAdapter` output.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/ExecutiveHeader.jsx` (CREATE)
- `app/execlens-demo/components/nextgen/ReadinessBadge.jsx` (CREATE)
- `app/execlens-demo/tokens/readiness.tokens.js` (CREATE — readiness token definitions)

**Dependencies:** STEP 3 (ReportContainer must be in place for composition)

**Validation requirements:**
- `ReadinessBadge` renders ALI-03 label; not raw ReadinessState enum
- Badge uses correct design token per VIS-READY-01 mapping
- Badge is the first element in ExecutiveHeader
- Badge renders correctly for all 5 ReadinessState values
- Token override is not possible from component props

**Fail conditions:**
- Raw `EXECUTIVE_READY` or similar enum text visible in rendered output
- Badge token hard-coded as hex color
- Badge missing for any ReadinessState value

**Rollback boundary:** Delete `ExecutiveHeader.jsx`, `ReadinessBadge.jsx`, `readiness.tokens.js`

---

### STEP 5 — Qualifier Chip System

**Objective:** Implement `QualifierChip`. Connect to `QualifierChipAdapter` output.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/QualifierChip.jsx` (CREATE)
- `app/execlens-demo/tokens/qualifier.tokens.js` (CREATE — qualifier chip token definitions)

**Dependencies:** STEP 4 (ExecutiveHeader must exist for chip placement)

**Validation requirements:**
- Chip renders for Q-01, Q-02, Q-03
- Chip does not render for Q-00 (no visible chip element)
- Absence notice section renders for Q-04
- Chip label matches vocabulary contract (not "Q-01", "Q-02" etc.)
- Chip token matches VIS-QUAL-01 mapping (amber/blue/grey)
- Tooltip renders pre-rendered text on hover/focus
- Chip visible on all viewport sizes (responsive: may reflow but not disappear)

**Fail conditions:**
- Raw Q-xx enum text appears in chip label
- Chip hidden for Q-01/02/03 on narrow viewport
- Q-04 renders without absence notice
- Chip tooltip contains AI-generated text

**Rollback boundary:** Delete `QualifierChip.jsx`, `qualifier.tokens.js`

---

### STEP 6 — Narrative and Intelligence Summary

**Objective:** Implement `IntelligenceSummary`, `NarrativeBlock`. Connect to `NarrativeAdapter` output.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/IntelligenceSummary.jsx` (CREATE)
- `app/execlens-demo/components/nextgen/NarrativeBlock.jsx` (CREATE)

**Dependencies:** STEP 3 (ReportContainer for region placement)

**Validation requirements:**
- Full executive summary text renders; not truncated
- WHY primary statement renders
- No raw GEIOS identifiers visible in narrative text
- No predictive language visible
- No AI assistant phrasing visible
- Vocabulary contract enforced (verify against forbidden_vocabulary categories A-H)
- Cannot be collapsed by user

**Fail conditions:**
- Executive summary truncated without expand affordance
- Raw signal key (cpi_score, cfa_score) visible in narrative
- GEIOS internal term (L1..L9, DPSIG, etc.) visible in narrative

**Rollback boundary:** Delete `IntelligenceSummary.jsx`, `NarrativeBlock.jsx`

---

### STEP 7 — Evidence Panel and Evidence Drawer

**Objective:** Implement `EvidencePanel`, `EvidenceDrawer`. Connect to `EvidencePanelAdapter` and `EvidenceDrawerAdapter` outputs.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/EvidencePanel.jsx` (CREATE)
- `app/execlens-demo/components/nextgen/EvidenceDrawer.jsx` (CREATE)

**Dependencies:** STEP 10 (ProgressiveDisclosureController for expand/collapse state) — implement EvidenceDrawer with static expand state first; wire controller in STEP 10.

**Validation requirements:**
- Drawers ordered: ORIGIN → RECEIVER → PASS_THROUGH → ISOLATED
- Grounding chip visible in collapsed drawer header
- Domain alias rendered (not raw domain ID)
- Propagation role label rendered (not raw ORIGIN/RECEIVER/etc. enum)
- Drawer expands to reveal signal cards + evidence summary
- No data fetch at expand time
- Suppressed domains (Q-04) render absence notice; no expand affordance

**Fail conditions:**
- Raw domain IDs visible in any drawer
- Raw PropagationRole enum (ORIGIN, RECEIVER) visible
- Data fetch triggered at drawer expand
- Evidence content different before and after collapse/re-expand

**Rollback boundary:** Delete `EvidencePanel.jsx`, `EvidenceDrawer.jsx`

---

### STEP 8 — Signal Card System

**Objective:** Implement `SignalCard`. Connect to `SignalCardAdapter` output.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/SignalCard.jsx` (CREATE)
- `app/execlens-demo/tokens/pressure.tokens.js` (CREATE — pressure tier token definitions)

**Dependencies:** STEP 7 (EvidenceDrawer must exist for card placement)

**Validation requirements:**
- Signal label uses ALI-01/02 normalized text; not `cpi_score`, `cfa_score`, `CPI`, `CFA`
- Pressure label uses NORM-PROP-01 tier label; no numerical values
- Pressure color indicator uses pressure token; not hard-coded hex
- Qualifier chip present on signal card when qualifier active for that signal
- Evidence text renders; no forbidden vocabulary categories A-H visible

**Fail conditions:**
- Raw signal key visible in any signal card
- Numerical signal value visible in any signal card
- Threshold value visible in any signal card
- Trend arrow without committed comparative evidence

**Rollback boundary:** Delete `SignalCard.jsx`, `pressure.tokens.js`

---

### STEP 9 — Trace Panel and Audit Lineage

**Objective:** Implement `TracePanel`, `AuditLineage`. Connect to `TracePanelAdapter` and `AuditLineageAdapter` outputs.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/TracePanel.jsx` (CREATE)
- `app/execlens-demo/components/nextgen/AuditLineage.jsx` (CREATE)

**Dependencies:** STEP 3 (ReportContainer for region placement), STEP 10 (ProgressiveDisclosureController for expand state)

**Validation requirements:**
- Propagation path renders ALI-04 aliases; no raw cluster keys
- Derivation reference abbreviated (8 chars + "...") for Advisory; not shown for Executive
- TRACE panel collapsed by default for Executive audience
- LINEAGE panel not shown for Executive audience
- Hash values rendered with monospace typography
- No hash decode or interpretation text

**Fail conditions:**
- Raw cluster keys visible in propagation path
- Full hash value visible for Advisory tier
- Any hash "decoded" with explanatory text

**Rollback boundary:** Delete `TracePanel.jsx`, `AuditLineage.jsx`

---

### STEP 10 — Progressive Disclosure Controller

**Objective:** Implement `ProgressiveDisclosureController`. Wire expand/collapse state to ExplainabilityBundle, EvidenceDrawer, TracePanel, AuditLineage.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/ProgressiveDisclosureController.jsx` (CREATE)

**Dependencies:** STEP 7, STEP 9 (components must exist to receive state)

**Validation requirements:**
- Controller initializes from density class defaults per `panel_default_states` in `executive_rendering_system.json`
- Toggle expand/collapse changes display state; content is identical before and after
- BLOCKED panels do not respond to expand interactions
- No data fetch triggered by any expand interaction
- Display state is ephemeral (no localStorage/sessionStorage in Phase 2)
- Session state does not influence panel content

**Fail conditions:**
- Content differs before and after collapse/re-expand
- Data fetch triggered by expand
- BLOCKED panel reveals content on expand
- Display state written to session storage in Phase 2

**Rollback boundary:** Delete `ProgressiveDisclosureController.jsx`; restore static expand state in STEP 7/9 components

---

### STEP 11 — Topology Summary Placeholder

**Objective:** Implement `TopologySummary` Phase 2 placeholder. Renders REGION_TOPOLOGY as a deferred region with Phase 3+ notice.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/TopologySummary.jsx` (CREATE)

**Dependencies:** STEP 3 (ReportContainer)

**Validation requirements:**
- Renders placeholder; no topology visualization in Phase 2
- Placeholder clearly indicates Phase 3+ activation
- No raw topology data rendered
- No edit affordances

**Fail conditions:**
- Raw canonical_topology.json data rendered
- Raw cluster keys or domain IDs visible

**Rollback boundary:** Delete `TopologySummary.jsx`

---

### STEP 12 — Blocked and Diagnostic States

**Objective:** Implement `BlockedState`, `DiagnosticState`. Wire to `BlockedStateAdapter` and `DiagnosticStateAdapter` outputs.

**Files likely affected:**
- `app/execlens-demo/components/nextgen/BlockedState.jsx` (CREATE)
- `app/execlens-demo/components/nextgen/DiagnosticState.jsx` (CREATE)

**Dependencies:** STEP 3 (ReportContainer routing)

**Validation requirements:**
- BlockedState: renders explicit blocked headline; no intelligence content; audit access available for Advisory+
- DiagnosticState: renders explicit banner with "advisory" keyword; does not replace intelligence content
- Q-04 absence notice: "Signal intelligence withheld from this view." renders as first-class element
- No silent fail; no blank placeholder
- Blocked token used for BlockedState; diagnostic token for DiagnosticState

**Fail conditions:**
- BlockedState renders any intelligence content from failed report_object
- DiagnosticState hides intelligence content
- Blocked or diagnostic state renders silently (blank region)

**Rollback boundary:** Delete `BlockedState.jsx`, `DiagnosticState.jsx`

---

### STEP 13 — HTML Compatibility Bridge

**Objective:** Verify the existing HTML report path remains operational. No modification of existing files.

**Files likely affected:** NONE (read-only verification step)

**Dependencies:** STEPS 3–12 (new NextGen route must exist before checking non-regression)

**Validation requirements:**
- `app/execlens-demo/pages/index.js` renders correctly (existing PoC demo)
- Existing PoC components (`ExecutivePanel.js`, `EvidencePanel.js`, etc.) render correctly
- No import conflicts between new nextgen components and existing PoC components
- No CSS conflicts (design tokens do not override existing PoC styles)
- `scripts/pios/lens_report_generator.py` execution produces HTML artifact (unchanged behavior)

**Fail conditions:**
- Any existing PoC page fails to render after NextGen additions
- Any existing PoC component import is broken
- `lens_report_generator.py` produces different HTML output

**Rollback boundary:** Any new file that caused the regression is deleted or isolated

---

### STEP 14 — Phase 2 Validation Suite

**Objective:** Implement the automated validation suite for all Gate-1 criteria.

**Files likely affected:**
- `app/execlens-demo/validators/nextgen/` (CREATE — validation tests)

**Dependencies:** STEPS 1–13 complete

**Validation requirements:**
- Unit tests for all 14 adapters (pass)
- Component render tests for all 16 component families (pass)
- Blocked routing tests: hash failure, governance fail (pass)
- Diagnostic routing tests: normalization mismatch (pass)
- Vocabulary contract tests: no forbidden terms in rendered output (pass)
- Qualifier tests: Q-00..Q-04 all render correctly (pass)
- Audience tier tests: Executive/Advisory/Audit visibility correct (pass)
- Non-regression tests: existing PoC route renders (pass)

**Fail conditions:**
- Any adapter test fails
- Any component renders forbidden vocabulary
- Any component renders raw GEIOS identifier
- Non-regression tests fail

**Rollback boundary:** Fix specific failing test; do not advance to STEP 15

---

### STEP 15 — Gate-1 Readiness Assessment

**Objective:** Complete Gate-1 readiness assessment. Verify all Phase 2 Gate-1 criteria pass.

**Files likely affected:**
- `docs/psee/PI.LENS.NEXTGEN-REPORTS.PHASE-2-GATE-1.01/` (CREATE — separate stream)

**Dependencies:** STEP 14 validation suite passes

**Gate-1 criteria (all must pass):**

| Criterion | Verification |
|-----------|-------------|
| Report object loads and validates | ReportObjectValidator returns valid |
| Bridge validation passes | evidence_object_hash verified |
| Readiness badge renders correctly | ALI-03 label; correct token; qualifier chip |
| Qualifier rendering correct | Q-00..Q-04 per VIS-QUAL-01; Q-04 absence notice |
| Executive summary renders | Full text; vocabulary contract enforced |
| WHY section renders | Pre-rendered content; qualifier notice |
| Evidence drawers function | All domains; drawer expands; signal cards render |
| Signal cards render correctly | ALI-01/02 labels; pressure label; qualifier chip |
| BLOCKED state renders explicitly | Headline present; no intelligence content |
| DIAGNOSTIC state renders explicitly | Banner with "advisory"; content still visible |
| Q-04 suppression renders | Absence notice; not silently absent |
| No raw GEIOS identifiers | Vocabulary contract end-to-end |
| No AI call in render path | No AI service endpoint called |
| Non-regression passed | Existing HTML report path operational |
| Evidence immutability | No report_object field modified |

**Fail conditions:**
- Any Gate-1 criterion fails
- New implementation causes regression in existing path

**Rollback boundary:** Return to STEP 14; identify and fix failing criterion; re-run Gate-1

---

## 3. Dependency Graph Summary

```
STEP 1 (Validator)
  └── STEP 2 (Adapters)
        └── STEP 3 (ReportContainer)
              ├── STEP 4 (ExecutiveHeader + ReadinessBadge)
              │     └── STEP 5 (QualifierChip)
              ├── STEP 6 (IntelligenceSummary + NarrativeBlock)
              ├── STEP 7 (EvidencePanel + EvidenceDrawer)
              │     └── STEP 8 (SignalCard)
              ├── STEP 9 (TracePanel + AuditLineage)
              ├── STEP 10 (ProgressiveDisclosureController) [wires STEPS 7,9]
              ├── STEP 11 (TopologySummary placeholder)
              └── STEP 12 (BlockedState + DiagnosticState)
                    └── STEP 13 (HTML Compatibility Non-Regression)
                          └── STEP 14 (Phase 2 Validation Suite)
                                └── STEP 15 (Gate-1 Readiness Assessment)
```

---

*Stream PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01 — Implementation Sequence — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
