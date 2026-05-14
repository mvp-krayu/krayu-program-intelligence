# Governance Promotion Plan

**Stream:** PI.PIOS.GOVERNANCE-SNAPSHOT-TRAVERSAL-AND-CANONICAL-RECONCILIATION.01
**Assessment Date:** 2026-05-12

---

## 1. Promotion Categories

Each snapshot artifact is classified into one of five categories:

| Category | Definition |
|---|---|
| PROMOTE | Artifact can be promoted into the current governance corpus with adaptation |
| REWRITE | Artifact's concept is valuable but implementation needs rewriting for current context |
| HISTORICAL | Artifact should be preserved as lineage documentation, not promoted |
| DEPRECATE | Artifact is superseded and should be explicitly marked as historical |
| MISSING | New artifact needed — concept exists in current system but has no snapshot ancestor |

---

## 2. Promotion Inventory

### 2.1 PROMOTE (with adaptation)

| Artifact | Snapshot Location | Promotion Target | Adaptation Required |
|---|---|---|---|
| Evidence-first governing principle | canonical-layer-model.md §2.1 | Reference in git_structure_contract.md or CLAUDE.md preamble | Minimal — principle is universal. Add cross-reference to snapshot origin for lineage. |
| Fail-closed runtime model | lens_runtime_fail_closed.md | Validate against current fail-closed implementation in CLAUDE.md §3.3 | Scope expansion — snapshot is ExecLens-specific, current is system-wide. Verify no gaps. |
| Drift register pattern | drift/drift_register.md + DRIFT-001 | Revive as governance pattern for current system | Format adaptation — current system lacks a formal drift register. Pattern is valuable for tracking architectural violations. |

### 2.2 REWRITE (concept valuable, implementation outdated)

| Artifact | Snapshot Location | Rewrite Target | Rewrite Scope |
|---|---|---|---|
| L0-L8 canonical layer model | canonical-layer-model.md | Reconcile with git_structure_contract.md | The snapshot's L0-L8 definitions are more detailed than the current contract's layer descriptions. A rewrite could enrich git_structure_contract.md Section 4 (OWNERSHIP RULES) with governing principles from the snapshot. |
| PIE vault → DOM lineage mapping | 41.2/pie_vault/ | Formal lineage document mapping PIE vault domains to current DOM-01—DOM-17 | New document tracing 17 PIE domains → 15 LENS v2 actors and DOM crosswalk entries. Explains what was preserved, what merged, what was added. |
| Stream lifecycle model | governance_operating_model.md | Governance appendix documenting lifecycle evolution | Rewrite to show: snapshot lifecycle (Activation→Freeze) → current PI model (Contract→Pre-flight→Execute→Closure→Return). |
| Authority hierarchy | index.md | Governance lineage note | Rewrite to show: snapshot hierarchy (Canonical→Remediation→Runtime) → current (CONTRACT→CLAUDE.md→validators). |
| Gate framework pattern | gates/A.10, A.11, A.16 | Inform SQO S-state gate definitions | Rewrite CONTROL-completeness gate concept into SQO context — the pattern of named gates with pass/fail criteria is directly applicable to S-state transitions. |

### 2.3 HISTORICAL (preserve for lineage)

| Artifact | Snapshot Location | Preservation Reason |
|---|---|---|
| ExecLens panel state machine | execlens_panel_state_model.md | Documents the original runtime surface architecture |
| ExecLens entry/exit contract | execlens_entry_exit_contract.md | Documents original runtime boundary governance |
| ExecLens navigation contract | execlens_navigation_contract.md | Documents original navigation model |
| ExecLens traversal binding | execlens_traversal_binding.md | Documents 4-path traversal architecture |
| ExecLens persona binding | execlens_persona_binding.md | Documents 3-persona model (potential reactivation) |
| Remediation domains A/B/C | remediation/ | Documents first correction infrastructure |
| DRIFT-001 case file | drift/cases/DRIFT-001.md | Documents first formal governance violation |
| canonical-layer-model.validation.md | architecture/canonical/ | Documents PROVISIONAL → LOCK-READY gap |
| canonical-layer-model.classification.md | architecture/canonical/ | Documents construct classification decisions |
| canonical-layer-model.drift.md | architecture/canonical/ | Documents 6 historical drift items |

### 2.4 DEPRECATE (explicitly mark as superseded)

| Artifact | Snapshot Location | Superseded By |
|---|---|---|
| governance_master_capsule.md (as operational authority) | Root governance | CLAUDE.md execution constitution |
| governance_operating_model.md (as operational authority) | Root governance | PI stream model + CLOSURE.md format |
| Numeric stream naming (40.x, 51.x) | docs/pios/ | PI.*.*.01 naming convention |
| Domain A/B/C remediation model | remediation/ | PI stream-scoped execution contracts |
| ExecLens as primary runtime | architecture/ | LENS v2 + SQO Cockpit |
| 6-stream architecture (00-60) | governance_master_capsule.md | Current stream boundary model (40.x-75.x per CLAUDE.md §9) |
| pios_traversal_contract.md (as binding) | architecture/ | LENS v2 rendering model |

### 2.5 MISSING (new artifacts needed — no snapshot ancestor)

| Required Artifact | Current System Source | Priority |
|---|---|---|
| SQO governance definition | SQOCockpitStateResolver + 18 engines | HIGH — SQO is the system's most significant post-snapshot addition |
| HYDRATED state governance lock | Strategic roadmap Phase 1.1 | HIGH — named in roadmap as single most important near-term action |
| Q-class governance amendment record | Q02_GOVERNANCE_AMENDMENT.md (exists in current system) | DONE — already exists |
| State progression model (NONE → LENS) | Strategic roadmap | MEDIUM — defined in roadmap, not yet formalized in governance |
| Multi-client architecture governance | GenericSemanticPayloadResolver + manifest model | MEDIUM — operational but not governed |
| Evidence source class governance | evidence_sources.yaml + source_class enforcement | MEDIUM — operational but not governed |
| 4-Brain governance model | brain/* branches | MEDIUM — in CLAUDE.md §15 but no standalone governance document |
| Governance tiering (G1/G2/G3) | Strategic roadmap recommendation | LOW — recommended but not yet implemented |

---

## 3. Wiring to CLAUDE.md / SKILLS.md

### 3.1 CLAUDE.md Wiring Opportunities

| Opportunity | Current CLAUDE.md Location | Snapshot Source | Action |
|---|---|---|---|
| Evidence-first principle cross-reference | §3.1 | canonical-layer-model.md §2.1 | ADD — cross-reference to establish lineage |
| Layer model lineage | §9 (stream boundaries) | canonical-layer-model.md | ADD — note that L0-L8 layer model originates from Stream 00.2 |
| Drift register reference | Not present | drift/drift_register.md | ADD — establish drift register as a governance pattern in CLAUDE.md or SKILLS.md |

### 3.2 SKILLS.md Wiring Opportunities

| Opportunity | Snapshot Source | Action |
|---|---|---|
| DRIFT_REGISTRATION skill | drift_register.md pattern | CREATE — skill for registering new drift cases when layer violations are detected |
| GOVERNANCE_LINEAGE_CHECK skill | canonical-layer-model.md | CREATE — skill for validating that a proposed change respects L0-L8 lineage |

---

## 4. Promotion Sequencing

### Phase A — Immediate (no code changes)

1. Revive drift register pattern — create a current drift_register.md that references DRIFT-001 as historical and establishes the registration pattern for future violations
2. Mark snapshot governance artifacts as HISTORICAL in a lineage index
3. Add cross-references in git_structure_contract.md preamble to canonical-layer-model.md as L0-L8 lineage source

### Phase B — Near-term (aligned with Strategic Roadmap Phase 1)

4. Produce PIE vault → DOM model lineage mapping
5. Produce stream lifecycle evolution document (snapshot → current)
6. Evaluate gate framework pattern for SQO S-state gate definitions
7. Create HYDRATED state governance lock document

### Phase C — Conditional (if concepts reactivate)

8. Persona model reactivation documentation (if persona-gated rendering implemented)
9. Multi-path traversal documentation (if LENS v2 adds navigation diversity)
10. Operator mode documentation (if operator tooling surface created)

---

## 5. What Must NOT Be Promoted

| Artifact / Concept | Reason |
|---|---|
| governance_master_capsule.md as operational authority | CLAUDE.md is the operational constitution — two competing authorities creates confusion |
| governance_operating_model.md as operational process | PI stream model is the operational process — the snapshot lifecycle is historical |
| ExecLens-specific runtime governance | Runtime surface has changed. Promoting ExecLens governance creates false authority over LENS v2 / SQO |
| Commercial positioning artifacts | These are brain/product and brain/publish territory, not governance |
| Remediation domain model | The PI stream contract model has replaced formal remediation domains |
| "vault" as Obsidian navigation | Current "vault" means structural evidence backing — promoting snapshot "vault" creates semantic collision |
