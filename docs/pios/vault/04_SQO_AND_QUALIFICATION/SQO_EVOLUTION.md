# SQO Evolution

> **Semantic Qualification Operations — from nothing to a full qualification runtime in 48 hours.**

---

## What SQO Is

SQO (Semantic Qualification Operations) is the system's **qualification state machine** — it assesses the operational maturity of a client's semantic data across multiple dimensions and tracks progression from unqualified to authority-ready.

## Why SQO Emerged

The system needed a way to:
1. Track how far along a client's semantic data was in the trustworthiness progression
2. Identify what blockers prevented advancement
3. Manage semantic debt (known gaps and deficiencies)
4. Orchestrate the operational workflow for qualification advancement

Nothing in the snapshot era addressed these needs. SQO was a wholly new concept.

## The S-State Machine

| State | Name | Meaning |
|---|---|---|
| S0 | NO_QUALIFICATION | No qualification data available |
| S1 | ONBOARDING_REQUIRED | Client ingested but qualification blocked |
| S2 | QUALIFIED_WITH_DEBT | Operational but with known semantic debt items |
| S3 | AUTHORITY_READY | Full qualification chain complete (NOT YET IMPLEMENTED) |

## SQO Components

| Component | Count | Role |
|---|---|---|
| SQO engines | 18 | Debt, maturity, continuity, progression, gravity, replay, etc. |
| SQO compilers | 4 | Debt index, temporal analytics, evidence intake, qualification projection |
| Operational substrate | 1 | RuntimeSemanticOperationsSubstrate — unified semantic operations |
| Reconciliation loop orchestrator | 1 | ReconciliationLoopOrchestrator — operational lifecycle loop |
| Cockpit sections | 12 | Overview, debt, continuity, maturity, progression, evidence, etc. |
| Runtime projections | 7 | Lifecycle, debt index, temporal, intake, qualification, operations, loop |
| UI components | 51 | Cockpit rendering |
| State resolver | 1 | SQOCockpitStateResolver — deterministic S-state detection |
| Registered artifacts | 23 | Full SQO artifact registry |

## SQO Ownership Domains (as of 2026-05-13)

| Domain | Artifacts | Authority |
|---|---|---|
| qualification_core | 7 | SQO_ENGINES |
| semantic_debt | 2 | DEBT_ENGINES |
| reconciliation | 3 | RECONCILIATION_COMPILERS |
| temporal_analytics | 1 | TEMPORAL_COMPILER |
| evidence_intake | 1 | INTAKE_LOOP |
| replay_and_certification | 6 | VERIFIERS |
| qualification_projection | 1 | PROJECTION_COMPILER |
| reconciliation_loop | 1 | LOOP_ORCHESTRATOR |

## Creation Timeline

SQO emerged entirely on 2026-05-10, with operational extensions on 2026-05-11:

| Commit | Date | Event |
|---|---|---|
| 9fdf308 | 2026-05-10 15:45 | SQO architecture established |
| 096c906 | 2026-05-10 15:45 | Deterministic S-state detection engine |
| de4ccf5 | 2026-05-10 17:34 | Semantic debt engine (7-category detection) |
| ae3d657 | 2026-05-10 18:04 | Maturity scoring engine (8-dimension quantification) |
| 49c3b78 | 2026-05-10 19:00 | SQO Cockpit UX architecture defined |
| 68e0d79 | 2026-05-10 19:29 | SQO Cockpit static artifact reader |
| 41c6e0f | 2026-05-10 19:52 | Server/client boundary leakage fix |
| fa27cdb | 2026-05-10 20:23 | Operational UX orchestration |
| 22c8b1c | 2026-05-10 (later) | FastAPI maturation workflow |
| 53d7f00 | 2026-05-10 (later) | Persistent workspace shell |
| 5c18622 | 2026-05-10 23:07 | Severity semantics normalization |
| 02dffaa | 2026-05-10 23:24 | Visual hierarchy refinement |
| e43e1d2 | 2026-05-11 11:39 | Cockpit UX stabilization |
| dadbe47 → fea0704 | 2026-05-11 | SQO operational workflows (Waves 4-7, O1-O2) |
| ed4e0d1 | 2026-05-11 20:14 | BlueEdge runtime corridor in cockpit |

## What SQO Did NOT Exist As Before

| Current SQO Concept | Snapshot Analogue | Assessment |
|---|---|---|
| S-state machine | None | Wholly new |
| Semantic debt | None | Wholly new |
| Maturity scoring | None | Wholly new |
| Runtime corridor | None | Wholly new |
| Overlay governance | None | Wholly new |
| Qualification cockpit | ExecLens panels (distant) | Different architecture entirely |

## Current Client States

| Client | S-State | Debt Items | LENS State |
|---|---|---|---|
| BlueEdge | S2_QUALIFIED_WITH_DEBT | 15 | HYDRATED (Q-02) |
| FastAPI | S1_ONBOARDING_REQUIRED | N/A | PARTIAL |

## S0→S1 and S1→S2+ Gate Formalization

Onboarding gate definitions are formalized in the Client Onboarding Lifecycle Specification:

- **S0→S1 (Structural Onboarding):** Requires PATH A artifacts only (structural topology, DOMs, CEU grounding). CSR is NOT required. Produces structurally grounded but semantically incomplete LENS projection. FastAPI's current state IS S1.
- **S1→S2+ (Semantic Qualification):** Requires CSR + semantic_topology_model + crosswalk + reconciliation. Produces full semantic depth with Q-class and reconciliation.

**Reference:** `docs/pios/PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01/ONBOARDING_LIFECYCLE_SPECIFICATION.md` — 8-phase lifecycle model with gate formalization (2026-05-18).

## Stage 3: Semantic Construction (Semantic Derivation Compiler)

**Stream:** PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01 (COMPLETE — 2026-05-18)

SQO Stage 3 is now operationally addressable via the Semantic Derivation Compiler — a governed AI-assisted pipeline that transforms structured evidence documents into candidate CSR.

**What Stage 3 adds to SQO:**
- Governed mechanism for producing candidate semantic structures from evidence
- Confidence-scored, evidence-traced, review-gated output
- Authority boundary: L3 ceiling — compiler output alone cannot advance qualification
- Explicit opt-in (`--enable-semantic-derivation`) integrated as Phase 3b in client pipeline

**What Stage 3 does NOT change:**
- S-state machine unchanged (S0/S1/S2/S3 definitions preserved)
- Crosswalk remains the first authority-elevating bridge (Stage 3→4)
- Reconciliation remains Stage 4 (unchanged)
- S2 qualification still requires reviewed CSR + crosswalk + reconciliation

**SQO-coupled progression:**

| Stage | What | Status |
|---|---|---|
| Stage 1: Structural Grounding | PATH A — structural topology and evidence | OPERATIONAL |
| Stage 2: CSR Specification | Client Semantic Registry schema and production chain | OPERATIONAL (2c39a5d) |
| Stage 3: Semantic Construction | Semantic Derivation Compiler — candidate CSR from evidence | OPERATIONAL (this stream) |
| Stage 3→4: Crosswalk | Map semantic elements to structural elements | SPECIFIED_NOT_IMPLEMENTED |
| Stage 4: Reconciliation | Verify structural proof | OPERATIONAL (BlueEdge-specific) |
| Stage 5: Qualification | Advance authority state | OPERATIONAL (S-state machine) |

## Cross-References

- [[HYDRATED_AND_QSTATE_EVOLUTION]] — HYDRATED state and Q-class
- [[ADMISSIBILITY_AND_CORRIDORS]] — admissibility evaluation
- [[SEMANTIC_DEBT_EVOLUTION]] — debt classification
- [[OVERLAY_AND_REPLAY_EVOLUTION]] — overlay/replay governance
- [[../09_GIT_LINEAGE/SQO_LINEAGE]] — full git lineage
