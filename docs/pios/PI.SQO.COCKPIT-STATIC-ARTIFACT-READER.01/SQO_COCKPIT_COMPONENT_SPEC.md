# SQO Cockpit React Component Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Component Directory

`app/execlens-demo/components/sqo-cockpit/`

## Components (9)

### SQONavigation.jsx
Navigation sidebar for the cockpit. Displays all 7 sections with active section highlighting. Shows degradation status per section (degraded/unavailable indicators). Governance footer.

### SQODegradedState.jsx
Explicit degradation display. Renders specific messages for each degradation state. Never shows empty content — always provides an explanation and governance notice.

### QualificationOverviewPanel.jsx
Overview section panel. Displays S-state, maturity score, semantic gravity, qualification stability, progression readiness, and debt summary. Each metric renders independently with explicit empty state.

### SemanticDebtPanel.jsx
Debt section panel. Displays debt items grouped by category and severity. Per-item: ID, severity, description, blocking status, remediation pathway, evidence linkage.

### ContinuityAssessmentPanel.jsx
Continuity section panel. Displays overall status, coverage/fidelity/lineage metrics with visual bars, structural counts, and continuity gaps.

### MaturityProfilePanel.jsx
Maturity section panel. Displays overall score, all 8 dimension scores with classification bars, semantic gravity composite (D1,D2,D3,D5,D7), and qualification stability composite (D1,D3,D4,D5).

### ProgressionReadinessPanel.jsx
Progression section panel. Displays current→target S-state transition, readiness percentage, blocking debt count, missing artifacts, and blocking debts grouped by remediation pathway.

### EvidenceReplayPanel.jsx
Evidence & replay section panel. Displays 3 replay verifications and 3 certifications with per-check pass/fail indicators. Summary verdict for replays and certifications.

### HandoffReadinessPanel.jsx
PATH B handoff section panel. Displays READY/BLOCKED status, blocking conditions, package summary, and governance notice (cockpit prepares, PATH B decides, no direct LENS emission).

## Governance Rules

- All components accept pre-formatted data from server-side formatters
- No client-side artifact loading
- No client-side computation
- Explicit empty/absent states for all missing data
- No AI interpretation or probabilistic language
- No chatbot or conversational interface patterns
