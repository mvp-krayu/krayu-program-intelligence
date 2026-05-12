# Current Canonical Gap Map

**Stream:** PI.PIOS.GOVERNANCE-SNAPSHOT-TRAVERSAL-AND-CANONICAL-RECONCILIATION.01
**Assessment Date:** 2026-05-12

---

## 1. Current Truths Missing From Snapshot

These are concepts and structures that exist in the current system but have no representation in the April 2026 governance snapshot.

### 1.1 Architectural Concepts

| Current Truth | Layer | Impact of Absence |
|---|---|---|
| PATH A / PATH B distinction | System-wide | No structural/semantic path separation in snapshot governance |
| SQO qualification model (S0-S3) | L6 | No qualification state machine concept |
| HYDRATED state definition | L3-L4 | No graduated trustworthiness model |
| State progression (NONE → LENS) | System-wide | Binary compliance only — no intermediate states |
| Q-class governance (Q-01 through Q-04) | L3-L4 | No disclosure-based rendering model |
| Evidence rebase architecture | L1-L2 | No source class governance, no extraction corridor |
| Multi-client architecture | L5-L6 | Single-substrate assumption |
| Semantic debt classification | L6 | No debt tracking or maturity scoring |
| Overlay/replay/rollback governance | L6 | No corridor model |
| Authority promotion protocol | L8 | No CERTIFIED → AUTHORITY gate concept |
| Governance tiering (G1/G2/G3) | L8 | All operations governed equally |

### 1.2 Execution Infrastructure

| Current Truth | Location | Impact of Absence |
|---|---|---|
| CLAUDE.md execution constitution | Root | No AI execution governance |
| SKILLS.md callable execution library | Root | No reusable execution patterns |
| PI stream model (PI.*.*.01) | docs/pios/ | Stream naming evolved from numeric (40.x) |
| 4-Brain governance (Canonical/Product/Publish/Code) | brain/* branches | No brain separation concept |
| git_structure_contract.md | docs/governance/runtime/ | Snapshot has layer model but no branch-domain enforcement contract |
| work/* branch pattern | Repository | Snapshot uses feature/* branches only |
| reference_boundary_contract.md | docs/governance/runtime/ | No cross-layer boundary contract |

### 1.3 Runtime Components

| Current Truth | Location | Impact of Absence |
|---|---|---|
| LENS v2 flagship surface | app/execlens-demo/flagship-experience/ | ExecLens panel model only |
| SQO Cockpit (12 sections, 51 components, 18 engines) | app/execlens-demo/lib/sqo-cockpit/ | No qualification runtime |
| SemanticActorHydrator (15-actor model) | app/execlens-demo/lib/ | PIE vault exists but not operationalized as hydrator |
| SemanticCrosswalkMapper (DOM-XX → business labels) | app/execlens-demo/lib/ | PIE vault domains exist but no crosswalk translation |
| GenericSemanticPayloadResolver | app/execlens-demo/lib/ | No manifest-driven client deployment |
| ExplicitEvidenceRebaseExtractor | app/execlens-demo/lib/ | No extraction corridor |
| SQOCockpitStateResolver | app/execlens-demo/lib/ | No S-state resolution |

## 2. Snapshot Truths Missing From Current System

These are concepts and structures that exist in the snapshot but have no direct representation in the current system.

### 2.1 Active / Potentially Valuable

| Snapshot Truth | Snapshot Location | Assessment |
|---|---|---|
| 4-path traversal model (Primary, Technical Deepening, Drift Explanation, Product Bridge) | architecture/pios_traversal_contract.md | VALUABLE — traversal diversity could re-emerge in mature LENS v2 |
| 3-persona model (Exec, CTO, Analyst) | architecture/execlens_persona_binding.md | VALUABLE — persona-gated rendering is a natural LENS v2 extension |
| Operator mode | architecture/lens_runtime_operator_mode.md | VALUABLE — operator tooling distinct from executive surface |
| CONTROL-completeness gate framework | architecture/gates/ | VALUABLE — gate pattern could inform SQO S-state gate definitions |
| 6-stage discipline development lifecycle | governance_operating_model.md | VALUABLE — maturity model for stream governance evolution |
| Formal drift register | drift/drift_register.md | VALUABLE — pattern should be revived for current system |

### 2.2 Historical / No Longer Applicable

| Snapshot Truth | Snapshot Location | Assessment |
|---|---|---|
| ExecLens panel state machine | architecture/execlens_panel_state_model.md | HISTORICAL — panel model superseded by LENS v2 / SQO |
| ExecLens entry/exit contract | architecture/execlens_entry_exit_contract.md | HISTORICAL — entry/exit model superseded |
| ExecLens navigation contract | architecture/execlens_navigation_contract.md | HISTORICAL — navigation model superseded |
| Numeric stream naming (40.x, 51.x) | docs/pios/ | HISTORICAL — PI.*.*.01 naming in use |
| Domain A/B/C remediation structure | remediation/ | HISTORICAL — remediation domains not extended |
| SSZ/SSI as named constructs | drift/cases/DRIFT-001.md | HISTORICAL — constructs not present in current system |

### 2.3 Aspirational / Never Operationalized

| Snapshot Truth | Snapshot Location | Assessment |
|---|---|---|
| Commercialization stream (30) | governance_master_capsule.md | ASPIRATIONAL — never executed |
| Case Studies stream (60) | governance_master_capsule.md | ASPIRATIONAL — never executed |
| Investor claim matrix | architecture/investor/ | ASPIRATIONAL — pre-commercial positioning |
| Handbook integration model | governance_master_capsule.md | ASPIRATIONAL — handbook never formalized |

## 3. Concepts Requiring Reconciliation

These exist in both snapshot and current system but with significant divergence.

| Concept | Snapshot Form | Current Form | Reconciliation Action |
|---|---|---|---|
| L0-L8 layer model | canonical-layer-model.md (PROVISIONAL, 8+1 layers) | git_structure_contract.md (LOCKED, operational) | RECONCILE — snapshot model is ancestor; current contract is authority. Determine which snapshot layer definitions add value beyond current contract |
| Fail-closed principle | lens_runtime_fail_closed.md (ExecLens-specific) | System-wide fail-closed governance (CLAUDE.md, SQO, LENS v2) | RECONCILE — principle preserved but scope expanded. Snapshot document is narrower than current practice |
| Stream lifecycle | governance_operating_model.md (Activation → Freeze) | PI stream model with CLOSURE.md, execution_report.md | RECONCILE — lifecycle concept preserved, implementation formalized differently |
| PIE vault domains → DOM model | 41.2 PIE vault (17 domains, 42 caps, 89 components) | SemanticCrosswalkMapper DOM-01 through DOM-17 | RECONCILE — lineage traceable but mapping not formally documented |
| Evidence-first principle | canonical-layer-model.md governing principle 2.1 | CLAUDE.md Section 3.1 + SQO source class governance | RECONCILE — principle unchanged, enforcement substantially extended |
| Authority hierarchy | index.md (Canonical → Remediation → Runtime) | CLAUDE.md (CONTRACT → CLAUDE.md → validators) | RECONCILE — hierarchy concept preserved, application context changed |

## 4. Concepts Requiring Historical Preservation (Kill for Promotion, Preserve for Lineage)

| Concept | Reason to Kill for Promotion | Reason to Preserve |
|---|---|---|
| ExecLens panel state machine | Superseded by LENS v2 section model | Documents architectural evolution of runtime surface |
| ExecLens 4-path traversal | Superseded by LENS v2 / SQO split | Documents original information architecture intent |
| Domain A/B/C remediation | Remediation infrastructure not extended | Documents first correction pattern |
| SSZ/SSI construct definitions | Constructs not present in current system | Documents first drift case and its resolution |
| Numeric stream naming | Replaced by PI.*.*.01 | Documents stream evolution from numbered to named |

## 5. Gap Severity Assessment

| Severity | Count | Description |
|---|---|---|
| CRITICAL GAP (current → snapshot) | 3 | SQO model, HYDRATED state, multi-client architecture — these have no snapshot ancestor and represent the system's most significant evolution |
| SIGNIFICANT GAP (current → snapshot) | 5 | Q-class, evidence rebase, corridors, 4-Brain, CLAUDE.md — important operational infrastructure with no snapshot precursor |
| MODERATE GAP (snapshot → current) | 3 | Persona model, operator mode, CONTROL gates — snapshot material with potential current value |
| LOW GAP (snapshot → current) | 6 | ExecLens-specific governance — superseded but lineage-valuable |
| RECONCILIATION NEEDED | 6 | Concepts in both systems requiring formal mapping |
