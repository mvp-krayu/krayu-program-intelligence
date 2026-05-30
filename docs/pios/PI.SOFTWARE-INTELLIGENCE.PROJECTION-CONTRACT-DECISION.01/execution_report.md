# PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-DECISION.01 — Execution Report

## Stream Metadata

| Field | Value |
|-------|-------|
| Stream ID | PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-DECISION.01 |
| Classification | G1 (architecture-mutating — locks projection authority model) |
| Branch | `feature/runtime-demo` |
| Baseline | `e231d68` |
| §5.5 | YES — ProjectionDispositionVerifier is new reusable primitive |
| Depends on | PI.SOFTWARE-INTELLIGENCE.PROJECTION-CONTRACT-UNIFICATION.01 |
| Consumes | CONDITION_VOCABULARY, COGNITION_SLICE_VOCABULARY, mapCondition, SECTION_4_RULES, CONDITION_NODES, DYNAMICS_GLYPH_TYPE, SURFACE_CONDITION_MAP, CONDITION_INTERVENTIONS |

## Pre-Flight

| Check | Status |
|-------|--------|
| Branch authorized | YES — feature/runtime-demo owns app/execlens-demo |
| Canonical state loaded | YES — PIOS_CURRENT_CANONICAL_STATE.md in context |
| Terminology loaded | YES — TERMINOLOGY_LOCK.md in context |
| Dependencies complete | YES — Unification assessment (d7b5272) committed |

## Mission

Lock whether SW-INTEL projection is condition-first, consequence-first, or dual-layer, and define validation rules so future slices cannot become visible in one persona but silently missing in another.

## Findings: Registry Audit

### Current State (9 condition types across 8 registries)

| Registry | File | Key Count | Authoritative For |
|----------|------|-----------|--------------------|
| CONDITION_VOCABULARY | SignalSynthesisEngine.js:4 | 9 | Condition existence — all paths |
| CONDITION_INTERVENTIONS | SignalSynthesisEngine.js:91 | 9 | Operator guided actions (DENSE/INVESTIGATION) |
| COGNITION_SLICE_VOCABULARY | ConsequenceCompiler.js:562 | 8 (6 dynamic, 2 non-dynamic) | BOARDROOM persona gating |
| mapCondition switch | ConsequenceCompiler.js:280 | 8 cases + default | Consequence derivation — gates BALANCED |
| SECTION_4_RULES | InvestigationVerifier.js:7 | 8 | §4 verification — gates INVESTIGATION |
| CONDITION_NODES | CognitionOntology.js:14 | 8 | Ontology graph — all personas |
| DYNAMICS_GLYPH_TYPE | IntelligenceField.jsx:138 | 6 | Visual glyph assignment (DENSE dynamics) |
| SURFACE_CONDITION_MAP | ProjectionAdapter.js:18 | 7 surfaces | OPERATOR surface projection + DRIVES labels |

### Key Observations

1. **CONDITION_VOCABULARY uses 9 keys** because GOVERNANCE_COVERAGE_GAP and GOVERNANCE_COVERAGE_COMPLETE are separate vocabulary entries that share `internal: 'GOVERNANCE_COVERAGE_STATUS'`. All downstream registries use the internal type (8 keys).

2. **DYNAMICS_GLYPH_TYPE has 6 keys** — COMPOUND_CONVERGENCE and GOVERNANCE_COVERAGE_STATUS are intentionally absent. COMPOUND_CONVERGENCE renders as a compound overlay (not a single glyph). GOVERNANCE_COVERAGE_STATUS renders as coverage indicators (not a dynamics glyph).

3. **SURFACE_CONDITION_MAP has 7 surfaces** — these are OPERATOR-facing projection surfaces. Surface count ≠ condition count because surfaces aggregate conditions (e.g., DELIVERY_FRAGILITY maps to both DPC and CC).

4. **rawSurfaces array is hardcoded** — 6 derive functions, no deriveStructuralFragility. STRUCTURAL_FRAGILITY surface exists in SURFACE_CONDITION_MAP but has no derivation function. Path C (OPERATOR projection) is partially broken.

## Decision: Dual-Layer Projection Model (Option C)

### Rationale

The codebase already implements a dual-layer model. This is not a design choice — it is a recognition of architectural reality:

**Layer 1: Condition-First (structural detail)**
- DENSE persona consumes conditions directly via `synthesize()` → `SynthesizedConditionSection`
- OPERATOR persona consumes projection surfaces via `deriveProjection()` → `rawSurfaces`
- INVESTIGATION persona consumes conditions via `investigate()` → verification chain
- These paths need the full 17-field condition object for structural precision

**Layer 2: Consequence-First (posture/narrative)**
- BOARDROOM persona consumes consequences via `forBoardroom()` → `cognition_slices`
- BALANCED persona consumes consequences via `forBalanced()` → `primary_story` + `reinforcement_flow`
- These paths need behavioral consequence posture for executive projection

### What This Locks

1. **Conditions are first-class for DENSE, OPERATOR, INVESTIGATION.** New condition types MUST have entries in: CONDITION_VOCABULARY, CONDITION_INTERVENTIONS, DYNAMICS_GLYPH_TYPE (unless architecturally exempt), SURFACE_CONDITION_MAP.

2. **Consequences are first-class for BOARDROOM, BALANCED.** New condition types MUST have entries in: COGNITION_SLICE_VOCABULARY, mapCondition switch. Consequence mapping determines what executives see.

3. **Verification spans both layers.** New condition types MUST have entries in: SECTION_4_RULES, CONDITION_NODES. Verification validates the condition→consequence derivation chain across both layers.

4. **No condition type may exist in CONDITION_VOCABULARY without complete disposition across all registries.** This is the Projection Disposition Contract — enforced by a verifier.

### Path C Remediation (deferred)

rawSurfaces in deriveProjection() is hardcoded and does not include STRUCTURAL_FRAGILITY. This is a known gap. Remediation options:
- Add deriveStructuralFragility() to rawSurfaces (incremental)
- Refactor rawSurfaces to be data-driven from SURFACE_CONDITION_MAP (systematic)

This decision stream does not implement the fix — it registers the gap and adds a SURFACE_DERIVATION_GAP disposition for future resolution.

## Projection Disposition Contract

Every condition type in CONDITION_VOCABULARY (using internal type) MUST declare its disposition in each registry. Dispositions are:

| Disposition | Meaning |
|-------------|---------|
| REQUIRED | Must have an entry — absence is a verification failure |
| EXEMPT | Architecturally excluded — absence is intentional and documented |
| DEFERRED | Known gap — tracked for future resolution |

### Canonical Disposition Table

| Internal Type | VOCAB | INTERV | SLICE | MAP_COND | §4_RULES | COND_NODES | GLYPH | SURFACE |
|---------------|-------|--------|-------|----------|----------|------------|-------|---------|
| DELIVERY_PRESSURE_CONCENTRATION | REQ | REQ | REQ | REQ | REQ | REQ | REQ | REQ |
| DEPENDENCY_CHOKE_POINT | REQ | REQ | REQ | REQ | REQ | REQ | REQ | REQ |
| PROPAGATION_ASYMMETRY | REQ | REQ | REQ | REQ | REQ | REQ | REQ | REQ |
| STRUCTURAL_MASS_CONCENTRATION | REQ | REQ | REQ | REQ | REQ | REQ | REQ | REQ |
| CROSS_DOMAIN_COUPLING_PRESSURE | REQ | REQ | REQ | REQ | REQ | REQ | REQ | REQ |
| GOVERNANCE_COVERAGE_STATUS | REQ | REQ | REQ | REQ | REQ | REQ | EXEMPT | REQ |
| COMPOUND_CONVERGENCE | REQ | REQ | REQ | REQ | REQ | REQ | EXEMPT | REQ |
| EXECUTION_FRAGILITY | REQ | REQ | REQ | REQ | REQ | REQ | REQ | REQ |

**EXEMPT justifications:**
- GOVERNANCE_COVERAGE_STATUS × GLYPH: Renders as coverage indicators (anchored/unanchored markers), not as a dynamics glyph actor
- COMPOUND_CONVERGENCE × GLYPH: Renders as compound overlay (composites multiple primitives), not as a single dynamics glyph

### Verification Implementation

A `verifyProjectionDisposition()` function is added to InvestigationVerifier.js. It:
1. Reads all keys from CONDITION_VOCABULARY (using internal type, deduplicated)
2. Checks each key against all 7 downstream registries
3. Consults the disposition table for EXEMPT entries
4. Reports PASS/FAIL per condition type per registry
5. Aggregates into an overall disposition verification result

This runs as step_0 (pre-check) in the investigation pipeline — before any evidence-specific verification. A condition type missing from any REQUIRED registry is a hard FAIL.

## Architecture Mutation Delta

### New Concepts
- **Projection Disposition Contract** — the rule that every condition type must have verified entries in all required registries
- **Disposition vocabulary** — REQUIRED, EXEMPT, DEFERRED
- **Dual-Layer Projection Model** — conditions for structural personas, consequences for executive personas

### Status Changes
- PROJECTION_CONTRACT_UNIFICATION assessment → DECIDED (was ASSESSMENT)
- Path C (OPERATOR projection) → GAP_REGISTERED (rawSurfaces hardcoded, STRUCTURAL_FRAGILITY missing derivation)

### Terminology
- No new locked terms — uses existing vocabulary from TERMINOLOGY_LOCK.md
- "Projection Disposition" is internal implementation concept, not a locked architectural term
