# Current Cockpit Freeze — V1 Architecture Snapshot

> **Authority:** This document freezes the current SQO Cockpit (V1) as historical substrate. It classifies all surfaces as REUSE, FORENSIC-ONLY, or DEPRECATED.

---

## V1 Architecture Summary

**Identity:** SQO Cockpit V1 — artifact-driven 15-section cockpit
**Freeze commit:** 643f5cf (feature/PI.SQO.RUNTIME-QUALIFICATION-PROJECTION-CORRECTION.01)
**Section count:** 15 (overview + 14 section routes)
**Component count:** 60 cockpit components (51 general + 6 authority + 3 projection)
**Shell:** SQOWorkspaceShell — flat routing between overview and section panels
**Navigation:** SQONavigation — flat sidebar with 15 items, availability indicators

---

## Shell / Routing / Navigation — REPLACED

These components define the V1 cognitive architecture. They are NOT reused in V2:

| Component | Reason for Replacement |
|---|---|
| **SQOWorkspaceShell** | Flat overview/section routing with no workflow awareness |
| **SQONavigation** | 15-item flat sidebar with no tier hierarchy |
| **SQOWorkspacePanel** | Section-name dispatch with no workflow context |
| **SQOCockpitRouteResolver** | Flat section/route/label mapping without tier structure |
| **SQOWorkspaceDataResolver** | Assembles per-page data without workflow computation |

These remain in the codebase as V1 reference. They are not deleted, modified, or extended.

---

## Components — Classification

### REUSE — Valid rendering components that project into V2 tier structure

| Component | V2 Location | Notes |
|---|---|---|
| **SemanticDebtPanel** | Tier 2: Semantic Debt | Renders debt data correctly |
| **ProgressionReadinessPanel** | Tier 2: Progression | Gate validation display |
| **ReconciliationCorrespondencePanel** | Tier 2: Reconciliation | PATH A/B correspondence |
| **EvidenceReplayPanel** | Tier 2: Evidence & Replay | Evidence chain verification |
| **SemanticQualificationIntakePanel** | Tier 2: Semantic Intake | Layer B intake summary |
| **OperatorAuthorityWorkflowPanel** | Tier 1: Authority | Authority workflow orchestrator |
| **AuthorityPostureBanner** | Tier 1: Authority | Posture display within authority |
| **ReviewQueueActionPanel** | Tier 1: Authority | Review obligation action surface |
| **PromotionControlPanel** | Tier 1: Authority | Promotion/insufficiency controls |
| **QualificationBlockerActionList** | Tier 1: Authority + Overview | Blocker display |
| **PromotionEventTimeline** | Tier 1: Authority | Event lineage display |
| **QualificationPostureSummary** | Tier 1: Overview (partial) | Posture rendering (enhanced in V2) |
| **SectionUnavailableNotice** | All tiers | Fail-closed rendering |
| **SQODegradedState** | Error states | Degradation display |
| **SemanticCandidateExtractionPanel** | Tier 3: Forensic (BlueEdge) | Layer A extraction table |
| **DynamicCEUAdmissibilityPanel** | Tier 3: CEU Admissibility | CEU evaluation display |
| **EvidenceIngestionCorridorPanel** | Tier 3: Evidence Ingestion | Ingestion pipeline state |
| **BlueEdgeRuntimeCorridorPanel** | Tier 3: Runtime Corridor | Corridor management |
| **ExplicitEvidenceRebasePanel** | Tier 3: Evidence Rebase | Rebase extraction display |
| **ContinuityAssessmentPanel** | Tier 3: Continuity | Crosswalk coverage |
| **MaturityProfilePanel** | Tier 3: Maturity Profile | Dimension maturity scores |
| **ReconciliationLoopWorkflowPanel** | Tier 3: Reconciliation Loop | Loop lifecycle display |
| **HandoffReadinessPanel** | Tier 3: PATH B Handoff | PATH B activation boundary |

### REUSE — Cognitive layout components (S2+ overview path)

| Component | V2 Location | Notes |
|---|---|---|
| **SQOCognitiveLayoutShell** | S2+ overview rendering | Zone-based layout for journey data |
| **QualificationHeroRegion** | S2+ overview | S-state hero display |
| **QualificationStateRibbon** | S2+ overview | State ribbon |
| **BlockerDominanceLayer** | S2+ overview + V2 blocker display | Blocker emphasis |
| **OperationalWorkflowSpine** | S2+ overview | Workflow visualization |
| **WorkflowStageCluster** | S2+ overview | Stage cluster display |
| **ProgressionRail** | S2+ overview + V2 progression path | Progression visualization |
| **DeferredDebtCollapseZone** | S2+ overview | Deferred debt collapse |
| **OperationalAttentionLayout** | S2+ overview | Attention hierarchy |

### FORENSIC-ONLY — Valid but relegated to Tier 3

| Component | Notes |
|---|---|
| **SemanticCandidateRegistryTable** | Raw candidate table — forensic inspection only |
| **AdmissibilityRegistryTable** | Raw admissibility table — forensic inspection only |
| **CandidateEvidenceLineageSummary** | Evidence lineage detail — forensic |
| **CandidateAuthorityBoundaryNotice** | Authority boundary notice — forensic |
| **CandidateCompatibilitySummary** | Compatibility detail — forensic |
| **CandidateQuarantineSummary** | Quarantine detail — forensic |
| **CorridorLineageTraceSummary** | Corridor lineage — forensic |
| **CorridorOverlayChainSummary** | Overlay chain — forensic |
| **CorridorGovernanceZoneSummary** | Governance zone — forensic |
| **CorridorAuthorityBoundarySummary** | Authority boundary — forensic |
| **CorridorCertificationSummary** | Certification — forensic |
| **CorridorReplayRollbackSummary** | Replay/rollback — forensic |
| **CorridorSandboxSessionSummary** | Sandbox session — forensic |
| **EvidenceRegistryTable** | Evidence registry — forensic |
| **EvidenceProvenanceSummary** | Provenance — forensic |
| **EvidenceAuthorityBoundaryNotice** | Authority boundary — forensic |

### NOT REUSED — V1-specific shells and routing

| Component | Reason |
|---|---|
| **SQONavigation** | Flat 15-item sidebar — replaced by tiered WorkflowNavigationRail |
| **SQOWorkspaceShell** | Section-switching shell — replaced by OperationalCockpitShell |
| **SQOWorkspacePanel** | Section-name renderer dispatch — replaced by tier-aware routing |
| **SemanticMaturationStrip** | Unstyled strip — absorbed into overview posture display |
| **QualificationOverviewPanel** | Unused legacy component |
| **QualificationJourneyBanner** | Absorbed into posture display |

---

## Server Resolvers — Classification

### REUSE

| Module | V2 Role |
|---|---|
| **SQORuntimeResolver** | Capability detection — consumed by resolveOperatorWorkflow |
| **QualificationPostureResolver** | Posture computation — consumed by resolveOperatorWorkflow |
| **ClientScopedSectionResolver** | Client-scoped section data dispatch |
| **SemanticQualificationIntakeResolver** | Layer B intake data |
| **SQOCockpitStateResolver** | S-state detection |
| **PromotionStateLoader** | Promotion state IO |
| **SQOAuthorityValidator** | Authority validation (RBAC enforcement) |
| **SQOActionEngine** | Action orchestration |
| **PromotionEventWriter** | Event lineage IO |
| **All 18 SQO engines** | Qualification computation |
| **All BlueEdge loaders** | BlueEdge data loading |
| **All view model builders** | View model transformation |

### REPLACED

| Module | V2 Replacement |
|---|---|
| **SQOWorkspaceDataResolver** | resolveOperatorWorkflow (workflow-first data assembly) |
| **SQOCockpitRouteResolver** | New tier-aware routing resolver |

### EXTENDED

| Module | Extension |
|---|---|
| **OperatorWorkflowResolver** | Extended from authority-only to full workflow resolution |

---

## V1 Freeze Rules

1. **No further extension** of V1 shell, navigation, or routing
2. **No modification** of V1 components unless fixing a bug
3. **V1 remains accessible** at existing routes until V2 is operational
4. **V1 components** are imported by V2 as rendering content — not as architectural authority
5. **V1 resolvers** are consumed by V2's workflow resolver — not replaced unnecessarily
