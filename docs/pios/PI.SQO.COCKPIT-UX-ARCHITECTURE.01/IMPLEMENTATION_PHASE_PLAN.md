# Implementation Phase Plan

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Phase 1: Cockpit Static Artifact Reader

**Objective:** Build the foundational cockpit that reads and displays SQO artifacts for any registered client/run.

**UI scope:**
- Client/run selector from manifest registry
- Overview section with S-state, maturity, gravity, stability, debt summary, progression
- All 10 cockpit states implemented (NO_CLIENT_SELECTED through HANDOFF_BLOCKED)
- Proper empty/degraded state rendering for all sections

**Artifact scope:**
- `qualification_state.v1.json`
- `semantic_maturity_profile.v1.json`
- `semantic_gravity_assessment.v1.json`
- `qualification_stability.v1.json`
- `progression_readiness.v1.json`
- `semantic_debt_inventory.v1.json` (summary only)

**Governance risk:** LOW — read-only artifact consumption, no computation, no state mutation.

**Success condition:** Cockpit loads and displays correct data for both BlueEdge (S2) and FastAPI (S1). Empty states render correctly for missing artifacts. No direct LENS integration.

---

## Phase 2: FastAPI Maturation Workflow

**Objective:** Implement the guided S1→S2 maturation workflow using FastAPI as the reference case.

**UI scope:**
- S1_ONBOARDING_REQUIRED state fully rendered
- Missing artifact enumeration with severity and blocking status
- Source material requirements panel
- Re-run preparation checklist builder
- Expected outcomes display
- Validation gates checklist

**Artifact scope:**
- `semantic_debt_inventory.v1.json` (full debt item display)
- `continuity_assessment.v1.json` (gaps and metrics)
- `progression_readiness.v1.json` (blocking debts, required pathways)

**Governance risk:** LOW — displays existing artifact data in guided workflow format. No new computation.

**Success condition:** An onboarding operator can load FastAPI, see the complete S1→S2 pathway with specific blockers, required source material, and preparation checklist. No AI-generated guidance.

---

## Phase 3: Debt/Remediation Navigation

**Objective:** Full semantic debt exploration with remediation pathway planning.

**UI scope:**
- Debt section: grouped by category, filterable, sortable by priority
- Per-item drill-down: evidence, remediation, impact
- Remediation section: pathway descriptions (R1-R4), affected debt items per pathway
- Source material requirements per pathway
- Impact preview per pathway (which dimensions improve)

**Artifact scope:**
- `semantic_debt_inventory.v1.json` (full depth)
- `continuity_assessment.v1.json` (continuity gaps)

**Governance risk:** LOW — displays existing debt data. Priority from documented model. Remediation from documented pathways.

**Success condition:** Operator can navigate debt by category, understand priority ordering, and plan remediation by pathway. No fabricated remediation actions.

---

## Phase 4: Evidence/Replay Certification Viewer

**Objective:** Evidence chain traceability and replay certification visibility.

**UI scope:**
- Evidence section: trace from qualification score to source artifact field
- Provenance display: input hashes, source commits
- Replay section: per-artifact verification results (3 checks each)
- Certification section: certification cases and verdicts
- Failed check prominence

**Artifact scope:**
- `*_replay_verification.v1.json` (all replay artifacts)
- `*_certification.v1.json` (all certification artifacts)
- `maturity_dimension_breakdown.v1.json` (formula inputs for evidence chains)
- Provenance fields across all SQO artifacts

**Governance risk:** LOW — displays verification and certification results. No re-execution in UI.

**Success condition:** Governance reviewer can verify replay status and trace evidence chains for any qualification score. Failed checks are prominently visible.

---

## Phase 5: PATH B Handoff Package Builder

**Objective:** Implement the handoff readiness assessment and package assembly.

**UI scope:**
- Handoff section: readiness status (READY/BLOCKED)
- Blocking conditions display
- Package contents preview
- Minimum criteria checklist
- Package export action
- Audit trail summary

**Artifact scope:**
- All SQO artifacts (for package assembly)
- All certification and replay artifacts (for readiness assessment)

**Governance risk:** MEDIUM — introduces a new action (package export). Must ensure package is advisory only and does not emit into LENS. PATH B acceptance is external to the cockpit.

**Success condition:** Operator can assess handoff readiness, see blocking conditions, and export a handoff package for PATH B review. No direct LENS emission.

---

## Phase 6: Source Material Intake Planner

**Objective:** Track source material requirements and intake status.

**UI scope:**
- Source material requirements derived from debt remediation fields
- Per-requirement tracking: IDENTIFIED → REQUESTED → RECEIVED → PROCESSED
- Material type guidance (ADRs, capability models, glossaries, ownership docs)
- Linked debt items per requirement
- Expected impact per material type

**Artifact scope:**
- `semantic_debt_inventory.v1.json` (source_material_needed fields)
- Cockpit-level tracking artifacts (additive-only)

**Governance risk:** LOW-MEDIUM — introduces cockpit-level tracking artifacts. Must ensure these are advisory only and do not affect SQO engine computation.

**Success condition:** Client implementation architect can see exactly what source material is needed, why, and track provision status. No auto-generated material.

---

## Phase 7: Governed Re-Run Preparation

**Objective:** Coordinate semantic pipeline re-run preparation with governance checks.

**UI scope:**
- Re-run preparation checklist
- Source material verification (all required material received?)
- Pipeline execution manifest review
- Pre-run governance checks
- Expected output artifacts
- Post-run validation plan

**Artifact scope:**
- All cockpit data (for preparation context)
- Pipeline execution manifest (for compliance reference)
- Cockpit-level checklist artifacts (additive-only)

**Governance risk:** MEDIUM — coordinates re-run preparation but does NOT trigger re-runs. Re-run execution remains external to the cockpit. Must ensure cockpit does not modify pipeline configuration.

**Success condition:** Onboarding operator can prepare a complete re-run plan with all prerequisites verified. Re-run trigger remains external (not a cockpit action).

---

## Phase Dependencies

```
Phase 1 (foundation)
  ├── Phase 2 (FastAPI workflow) — requires Phase 1
  ├── Phase 3 (debt navigation) — requires Phase 1
  └── Phase 4 (evidence/replay) — requires Phase 1
Phase 5 (handoff) — requires Phase 1 + Phase 4
Phase 6 (source material) — requires Phase 3
Phase 7 (re-run prep) — requires Phase 3 + Phase 6
```

Phases 2, 3, 4 can be implemented in parallel after Phase 1.
Phases 5, 6, 7 have sequential dependencies.
