# Implementation Semantics

**Stream:** PI.SQO.RUNTIME-SEMANTIC-OPERATIONS-CONSOLIDATION.01
**Classification:** G1 (Architecture-Mutating)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `OWNERSHIP_BOUNDARIES` | RuntimeSemanticOperationsSubstrate.js | Declares 7 ownership domains with artifacts, engines, authority | Canonical — governs all SQO |
| `PROPAGATION_CONTRACTS` | RuntimeSemanticOperationsSubstrate.js | Declares 7 data flow contracts between domains | Canonical — governs data flow |
| `ORCHESTRATION_BOUNDARIES` | RuntimeSemanticOperationsSubstrate.js | Declares 8-phase compilation order, replay semantics, mutation rules | Canonical — governs compilation |
| `RUNTIME_STABILIZATION_RULES` | RuntimeSemanticOperationsSubstrate.js | 8 rules governing substrate stability | Canonical — governs extension |
| `assessOperationalHealth` | RuntimeSemanticOperationsSubstrate.js | Per-domain artifact availability assessment | Reusable — any client |
| `assessPropagationIntegrity` | RuntimeSemanticOperationsSubstrate.js | Per-contract input/output satisfaction check | Reusable — any client |
| `compileSemanticOperationsSubstrate` | RuntimeSemanticOperationsSubstrate.js | Master substrate compilation | Reusable — any client |
| `emitSubstrate` | RuntimeSemanticOperationsSubstrate.js | Write substrate artifact | Reusable |
| `projectSemanticOperationsForRuntime` | SemanticOperationsProjection.js | Transform substrate into 8-facet consumer projection | Reusable — any client |

## 2. Ownership Boundaries

### Domain: qualification_core
- **Owner:** SQO
- **Artifacts:** qualification_state, semantic_maturity_profile, semantic_gravity_assessment, qualification_stability, progression_readiness, qualification_history, maturity_dimension_breakdown
- **Mutation authority:** SQO_ENGINES
- **Engines:** QualificationStateEngine, MaturityScoringEngine, SemanticGravityEngine, QualificationStabilityEngine, ProgressionReadinessEngine, QualificationHistory

### Domain: semantic_debt
- **Owner:** SQO
- **Artifacts:** semantic_debt_inventory, semantic_debt_index
- **Mutation authority:** DEBT_ENGINES
- **Engines:** SemanticDebtEngine, DebtPriorityEngine, RemediationPathResolver
- **Compilers:** SemanticDebtIndexCompiler
- **Projections:** SemanticDebtIndexProjection

### Domain: reconciliation
- **Owner:** SQO
- **Artifacts:** reconciliation_correspondence, reconciliation_lifecycle, continuity_assessment
- **Mutation authority:** RECONCILIATION_COMPILERS
- **Projections:** ReconciliationLifecycleProjection

### Domain: temporal_analytics
- **Owner:** SQO
- **Artifacts:** reconciliation_temporal_analytics
- **Mutation authority:** TEMPORAL_COMPILER
- **Compilers:** ReconciliationTemporalAnalyticsCompiler
- **Projections:** TemporalAnalyticsProjection

### Domain: evidence_intake
- **Owner:** SQO
- **Artifacts:** semantic_evidence_intake
- **Mutation authority:** INTAKE_LOOP
- **Compilers:** SemanticEvidenceIntakeLoop
- **Projections:** EvidenceIntakeProjection

### Domain: replay_and_certification
- **Owner:** SQO
- **Artifacts:** maturity_replay_verification, qualification_state_replay_verification, debt_replay_verification, maturity_certification, qualification_state_certification, debt_certification
- **Mutation authority:** VERIFIERS
- **Engines:** ReplayVerifier, MaturityReplayVerifier, DebtReplayVerifier

### Domain: qualification_projection
- **Owner:** SQO
- **Artifacts:** runtime_qualification_projection
- **Mutation authority:** PROJECTION_COMPILER
- **Compilers:** RuntimeQualificationProjectionCompiler
- **Projections:** RuntimeQualificationProjection

## 3. Propagation Contracts

| ID | From | To | Direction | Contract |
|----|------|-----|-----------|----------|
| PROP-01 | qualification_core | semantic_debt | DOWNSTREAM | S-state and maturity inform debt severity and blocking classification |
| PROP-02 | reconciliation | semantic_debt | DOWNSTREAM | Correspondence and enrichment status inform debt index classification |
| PROP-03 | reconciliation | temporal_analytics | DOWNSTREAM | Lifecycle epochs provide temporal basis for trend and effectiveness |
| PROP-04 | semantic_debt | temporal_analytics | DOWNSTREAM | Debt index provides debt reduction metrics and irreducible floor |
| PROP-05 | evidence_intake | qualification_projection | DOWNSTREAM | Intake validity feeds propagation readiness gate assessment |
| PROP-06 | all source domains | qualification_projection | CONVERGENT | All postures aggregate into unified qualification projection |
| PROP-07 | all domains | semantic_operations_substrate | CONVERGENT | All ownership domains converge into unified operational substrate |

## 4. Orchestration Boundaries

### Compilation Order
| Phase | Domain | Description |
|-------|--------|-------------|
| 1 | qualification_core | SQO engines produce qualification state, maturity, gravity, stability, progression |
| 2 | semantic_debt | Debt engine produces inventory; debt index compiler classifies |
| 3 | reconciliation | Correspondence and lifecycle compiled from evidence |
| 4 | temporal_analytics | Temporal analytics compiled from lifecycle epochs and debt index |
| 5 | evidence_intake | Intake loop validates, classifies, determines eligibility |
| 6 | replay_and_certification | Replay verification and certification assessment |
| 7 | qualification_projection | Unified posture aggregation from all prior phases |
| 8 | semantic_operations_substrate | Substrate consolidation from all domains |

### Replay Semantics
- All compilers deterministic: YES
- All projections deterministic: YES
- Timestamp excluded from replay comparison: YES
- Compilation order invariant: YES

### Mutation Rules
- Upstream immutable during downstream execution: YES
- No circular propagation: YES
- Convergent phases are read-only: YES
- Substrate never mutates source artifacts: YES

## 5. Stabilization Rules

1. All SQO operational semantic primitives are governed by OWNERSHIP_BOUNDARIES
2. No new operational semantic primitive may be added without updating OWNERSHIP_BOUNDARIES
3. Propagation contracts are explicit — no implicit data flow between domains
4. Compilation order is fixed — downstream phases cannot influence upstream
5. Substrate is a convergent read-only aggregation — it never mutates source artifacts
6. Consumer surfaces (LENS, Cockpit, Reports) consume substrate or individual artifacts — never both for the same facet
7. All compilers and projections must remain deterministic and replay-safe
8. New ownership domains require G1 stream authorization

## 6. Extension Points

- **OWNERSHIP_BOUNDARIES:** add new domains as SQO capabilities expand (requires G1 stream)
- **PROPAGATION_CONTRACTS:** add new contracts as data flow requirements emerge
- **ORCHESTRATION_BOUNDARIES:** extend compilation phases for new domains
- **RUNTIME_STABILIZATION_RULES:** add rules as governance requirements evolve
- **Multi-client:** parameterized by client/runId, works for any client with SQO artifacts
- **Consumer projection:** `projectSemanticOperationsForRuntime` can be extended with new facets

## 7. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| RuntimeSemanticOperationsSubstrate.js | Substrate: ownership, propagation, orchestration, stabilization, health, integrity, compilation |
| SemanticOperationsProjection.js | Runtime projection: transforms substrate into consumer-safe 8-facet shape |
| RuntimeQualificationProjectionCompiler.js | Qualification projection: posture aggregation, propagation readiness, semantic envelope |
| RuntimeQualificationProjection.js | Qualification runtime projection: 8-facet consumer shape |
| SemanticDebtIndexCompiler.js | Debt index: 4-axis classification, domain postures |
| SemanticDebtIndexProjection.js | Debt index runtime projection |
| ReconciliationTemporalAnalyticsCompiler.js | Temporal analytics: trend, enrichment, debt reduction, degradation |
| TemporalAnalyticsProjection.js | Temporal analytics runtime projection |
| SemanticEvidenceIntakeLoop.js | Evidence intake: register, classify, validate, accept/reject, eligibility |
| EvidenceIntakeProjection.js | Evidence intake runtime projection |
| ReconciliationLifecycleProjection.js | Lifecycle runtime projection |
| SQOCockpitArtifactLoader.js | Artifact registry: loads all 22 artifacts |
| SQOCockpitFormatter.js | Cockpit integration: overview, debt, maturity, progression, evidence, reconciliation, handoff, history |
