# Governance Snapshot Inventory

**Stream:** PI.PIOS.GOVERNANCE-SNAPSHOT-TRAVERSAL-AND-CANONICAL-RECONCILIATION.01
**Assessment Date:** 2026-05-12
**Snapshot Source:** ~/Projects/k-pi-governance/docs/governance
**Snapshot Approximate Date:** 2026-04-01 (pre-wiring, pre-promotion, pre-enforcement)

---

## 1. Top-Level Document Map

| File | Topic | Date (from content) | Classification |
|---|---|---|---|
| index.md | Governance index — authority hierarchy, canonical architecture pointer, drift register, remediation corpus | 2026-03-28 | OPERATIONAL — active index |
| governance_master_capsule.md | Canonical governance reference — stream architecture (00-60), execution rules, dependency chain | Undated (foundational) | OPERATIONAL — constitution |
| governance_operating_model.md | Stream lifecycle (Activation→Freeze), 6-stage discipline development, program state declaration | Undated (foundational) | OPERATIONAL — process model |

## 2. Architecture Subdirectory

**Location:** architecture/

### 2.1 Core Architecture

| File | Topic | Classification |
|---|---|---|
| program_intelligence_stack.md | Krayu > PiOS > Signal > Lens hierarchy | OPERATIONAL — canonical stack |
| pios_architecture_whitepaper.md | 9 canonical layers L0-L8 | OPERATIONAL — canonical reference |
| pios_whitepaper.md | Narrative whitepaper (commercial positioning) | ADVISORY — pre-commercial |
| pios_technical_appendix.md | Technical detail supplement | ADVISORY — reference |
| pios_investor_narrative.md | Investor-facing narrative | ADVISORY — commercial positioning |
| obsidian_index.md | Obsidian-specific navigation artifact | OPERATIONAL — tooling |

### 2.2 LENS / ExecLens Runtime

| File | Topic | Classification |
|---|---|---|
| lens_runtime_activation.md | LENS activation model (Stream D.3) | OPERATIONAL — runtime definition |
| lens_runtime_activation_validation.md | Activation validation receipt | OPERATIONAL — validation |
| lens_runtime_fail_closed.md | Fail-closed model for LENS | OPERATIONAL — governance |
| lens_runtime_path_enforcement.md | 4 traversal paths enforced | OPERATIONAL — runtime governance |
| lens_runtime_persona_activation.md | 3 personas (Exec, CTO, Analyst) | OPERATIONAL — persona model |
| lens_runtime_state_mapping.md | Signal-to-state mapping for LENS panels | OPERATIONAL — runtime binding |
| lens_runtime_operator_mode.md | Operator mode definition | OPERATIONAL — runtime extension |
| runtime_activation_receipt.md | Activation receipt artifact | OPERATIONAL — validation |
| traversal_runtime_validation.md | Traversal validation receipt | OPERATIONAL — validation |
| execlens_entry_exit_contract.md | Entry/exit governance for ExecLens | OPERATIONAL — boundary contract |
| execlens_navigation_contract.md | Navigation governance | OPERATIONAL — runtime governance |
| execlens_panel_state_model.md | Panel state machine | OPERATIONAL — runtime definition |
| execlens_traversal_binding.md | Traversal binding rules | OPERATIONAL — runtime governance |
| execlens_persona_binding.md | Persona-to-panel binding | OPERATIONAL — runtime definition |
| pios_traversal_contract.md | PiOS traversal contract | OPERATIONAL — governance |
| file_changes.json | Change tracking artifact | OPERATIONAL — audit |

### 2.3 Canonical Layer Model

**Location:** architecture/canonical/

| File | Topic | Classification |
|---|---|---|
| canonical-layer-model.md | PRIMARY — L0-L8 definitions, governing principles, cross-layer rules | OPERATIONAL — canonical architecture |
| canonical-layer-model.validation.md | 11/11 sections pass; 3 open items prevent LOCK-READY | OPERATIONAL — validation |
| canonical-layer-model.classification.md | 10 constructs classified against L0-L8 | OPERATIONAL — classification |
| canonical-layer-model.drift.md | 6 drift items (D1-D6), 4 open | OPERATIONAL — drift record |

**Status:** PROVISIONAL — model defined and in effect; implementation has known deviations under remediation.

### 2.4 Gates

**Location:** architecture/gates/

| File | Topic | Classification |
|---|---|---|
| A.10_control_completeness_gate_report.md | CONTROL-completeness gate framework | OPERATIONAL — gate definition |
| A.11_control_closure_planning.md | Closure planning for control gates | OPERATIONAL — gate planning |
| A.16_control_completeness_final_closure.md | Final closure report | OPERATIONAL — gate closure |

### 2.5 Investor

**Location:** architecture/investor/

| File | Topic | Classification |
|---|---|---|
| (contents) | Investor-facing claim matrix, truth boundary enforcement | ADVISORY — commercial positioning |

## 3. Drift Subdirectory

**Location:** drift/

| File | Topic | Classification |
|---|---|---|
| drift_register.md | Drift case register | OPERATIONAL — governance |
| cases/DRIFT-001.md | SSZ/SSI boundary violation at L3-L4-L6 | OPERATIONAL — resolved drift |

**Key finding:** DRIFT-001 is the only formally registered drift case. SSZ/SSI are classified as provisional, mis-layered constructs at L6 that canonically belong at L3.

## 4. Doctrine Subdirectory

**Location:** doctrine/

| File | Topic | Classification |
|---|---|---|
| (contents) | Problem space definition for Program Intelligence | ADVISORY — foundational intent |

**Assessment:** Defines what Program Intelligence is solving. Not operational governance — aspirational boundary setting.

## 5. Remediation Subdirectory

**Location:** remediation/

| File | Topic | Classification |
|---|---|---|
| canonical-model-closure-validation.md | Stream 00.3 closure validation | OPERATIONAL — remediation |
| domain_a_remediation.md | Domain A (L3) remediation | OPERATIONAL — remediation |
| domain_b_remediation.md | Domain B (L4) remediation | OPERATIONAL — remediation |
| domain_c_remediation.md | Domain C (L5-L7) remediation | OPERATIONAL — remediation |

**Structure:** Three remediation domains (A/B/C) corresponding to L3, L4, and L5-L7 layer violations.

## 6. Category Subdirectory

**Location:** category/

| File | Topic | Classification |
|---|---|---|
| (contents) | ESI/RAG as category primitives | OPERATIONAL — classification |

## 7. Derivatives Subdirectory

**Location:** derivatives/

| Subdirectory | Contents | Classification |
|---|---|---|
| nodes/ | 19 derivative entity definitions | OPERATIONAL — semantic structure |
| narratives/ | Derivative narrative descriptions | ADVISORY — documentation |

**Key detail:** 19 derivative entities with canonical completion rules. These are pre-vault semantic structuring artifacts.

## 8. PiOS Stream Inventory

**Location:** ~/Projects/k-pi-governance/docs/pios/

**Total streams:** 48 directories + baselines + contracts + runs

### 8.1 Stream Distribution

| Range | Count | Character |
|---|---|---|
| 40.x | 11 streams (40.2–40.11, 40.16) | Analytical/evidence — no formal CLOSURE.md in earliest |
| 41.x | 5 streams (41.1–41.5) | Semantic/PIE outputs |
| 42.x | 7 streams (42.21–42.29) | Runtime exposure |
| 43.x | 5 streams (43.1–43.33) | Binding contracts |
| 44.x | 4 streams (44.1–44.4) | Projection/emphasis |
| 51.x | 15 streams + CLOSE | Demo/UI — most heavily iterated, 6 repair streams |
| B.1 | 1 stream | Baseline |

### 8.2 Governance Maturity by Range

- **40.x:** Earliest streams lack formal CLOSURE.md. Analytical artifacts produced without stream discipline formalization.
- **41.x:** Produced semantic outputs (capability map, executive signal report, golden queries). Mixed governance formality.
- **42.x–43.x:** Formal CLOSURE.md records present. Stream discipline operational.
- **44.x:** Formal governance. Projection/emphasis outputs.
- **51.x:** Most heavily iterated range. 18 streams including 6 repair streams (R-suffix). Demonstrates active demo iteration cycle.

## 9. Topic Clusters

| Cluster | Files | Assessment |
|---|---|---|
| Canonical Architecture | canonical-layer-model.*, index.md, pios_architecture_whitepaper.md | Core governance — OPERATIONAL |
| LENS/ExecLens Runtime | 15+ lens/execlens files | Runtime governance — OPERATIONAL |
| Drift/Remediation | drift/, remediation/ | Correction infrastructure — OPERATIONAL |
| Commercial Positioning | whitepaper, investor narrative, handbook references | Pre-commercial — ADVISORY |
| PIE/Semantic Structure | derivatives/, 41.2 (PIE vault) | Semantic structuring — OPERATIONAL |
| Stream Execution | 48 PiOS streams, governance_operating_model.md | Process model — OPERATIONAL |
| Gate Framework | gates/ (A.10, A.11, A.16) | Completeness gates — OPERATIONAL |

## 10. Classification Summary

| Classification | Count | Description |
|---|---|---|
| OPERATIONAL | ~75 files | Active governance, definitions, validation, remediation |
| ADVISORY | ~15 files | Commercial positioning, doctrine, aspirational |
| OBSOLETE | 0 files | None formally obsolete at snapshot date |

**Note:** "OPERATIONAL" at snapshot date does not mean operational now. Many concepts have been superseded by post-April 2026 evolution (PATH A/B, SQO, VAULT terminology, etc.).
