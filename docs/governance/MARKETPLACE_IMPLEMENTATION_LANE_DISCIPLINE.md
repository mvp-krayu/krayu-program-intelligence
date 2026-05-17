# Marketplace Implementation Lane Discipline

Status: **LOCKED — AUTHORITATIVE**

Stream: PI.IMPLEMENTATION-LANE.MARKETPLACE-EXECUTION-DISCIPLINE.01

Classification: G1 — Architecture-Mutating Governance

Date: 2026-05-17

---

## Purpose

This document establishes strict implementation lane discipline for all marketplace commercialization development. It protects the canonical execution chain — both PATH A (structural grounding / substrate derivation) and PATH B (semantic reconstruction / governed projection consumption) — while enabling aggressive marketplace experimentation in isolated implementation lanes.

This document is binding. It supersedes ad-hoc branch decisions, informal experimentation, and convenience-driven architecture shortcuts.

The canonical execution chain — PATH A substrate derivation and PATH B governed projection — MUST remain reproducible, deterministic, frozen, and certifiable throughout all marketplace commercialization work. Neither path can be mutated independently without governance review.

---

## 1. Implementation Lane Definitions

### 1A. Canonical Execution Lane

**Definition:** The frozen, certifiable, reproducible, authority-grade execution chain. This lane encompasses both canonical paths:

- **PATH A — Structural Grounding:** The substrate derivation chain that proves semantic claims have structural backing. Source intake → ingestion (40.x) → core derivation (41.x) → condition/pressure activation (75.x) → vault construction. This is the computational substrate — it produces governed structural intelligence from evidence.

- **PATH B — Semantic Reconstruction:** The governed projection/consumption chain that produces operationally useful intelligence from PATH A truth. Projection runtime (`projection_runtime.py`) → persona engine (BOARDROOM/DENSE/INVESTIGATION) → Evidence Record Export → SQO qualification overlay. This is the commercial surface — the thing the demo shows, the thing the Structural Execution Visibility Report IS.

Both paths are frozen. Neither can be mutated independently without governance review. Commercialization operationalizes PATH B output but never mutates either path.

**Protected scope — PATH A (Structural Grounding / Substrate Derivation):**

| Component | Authority | Location |
|-----------|-----------|----------|
| PATH A orchestrator | `run_client_pipeline.py` — 9 phases | `scripts/pios/` |
| Source intake boundary | SHA-256 validation, evidence_sources.yaml | `source_intake.py` |
| Topology derivation | Domain reconstruction, binding envelope | `scripts/pios/40.x`, `43.x` |
| Signal projection runtime | 41.x `compute_signal_projection.py` | `scripts/pios/41.x` |
| Condition/pressure activation | 75.x condition correlation, pressure candidates/zones | `scripts/pios/75.x` |
| Vault construction | 9 canonical artifacts including signal_registry.json | Pipeline Phase 8 |
| Q-class logic | Q02_GOVERNANCE_AMENDMENT.md — LOCKED | `docs/governance/` |

**Protected scope — PATH B (Semantic Reconstruction / Governed Projection):**

| Component | Authority | Location |
|-----------|-----------|----------|
| Projection runtime | `projection_runtime.py` — vault consumption | LENS runtime |
| BOARDROOM core semantics | Executive cognitive projection | LENS persona engine |
| DENSE core semantics | Operational cognitive projection | LENS persona engine |
| INVESTIGATION core semantics | Analytical cognitive projection | LENS persona engine |
| Evidence Record authority | Evidence Record Export | LENS projection |
| S-state logic | SQO state machine (S0-S3) | `app/` SQO runtime |
| Qualification semantics | S-state (S0-S3), Q-class (Q-01..Q-04) rendering | SQO runtime |
| Decision posture computation | PROCEED / INVESTIGATE / ESCALATE | LENS projection |

**Rules — Canonical Execution Lane:**

1. No direct marketplace experimentation in canonical execution paths (PATH A or PATH B)
2. No temporary hacks, feature flags, or speculative logic in PATH A derivation
3. No ontology experimentation in derivation or qualification logic
4. No temporal prediction logic in STATIC intelligence computation
5. No branch bypassing — canonical changes follow full governance protocol
6. No "quick fixes" that alter deterministic output for commercial convenience
7. No buyer-language substitution in canonical internal terminology
8. No connector-specific assumptions in evidence governance
9. No marketplace module logic in L2-L4 derivation (PATH A)
10. No computation introduced in PATH B projection paths — projection consumes, never derives
11. No alteration of persona engine core semantics for marketplace convenience
12. No modification of Evidence Record governance boundary generation

**Violation response:** Any mutation to canonical execution lane components — PATH A or PATH B — without a formal G1 governance stream is a contract breach. STOP. Report violation. Do not proceed.

---

### 1B. Marketplace Experimentation Lane

**Definition:** The volatile, projection-focused, buyer-facing, operationalization-oriented lane. This lane enables aggressive commercial experimentation without substrate risk. All work in this lane is projection-layer — it consumes governed structural intelligence but never redefines it.

**Allowed scope:**

| Category | Examples | Layer |
|----------|---------|-------|
| PMO projection templates | PMO-vocabulary rendering of structural intelligence | L6 projection |
| Engineering projection templates | Engineering-vocabulary rendering | L6 projection |
| Structural Domain Mapping Reference | CLU/DOM → Jira/GitHub mapping artifact | L6 projection |
| Onboarding flows | Advisory engagement workflows, pilot journey | Operations |
| Advisory tooling | Evidence curation aids, quality checklists | Operations |
| L0 connector prototypes | Jira adapter, GitHub adapter (evidence intake only) | L0 pre-system |
| Vocabulary overlays | Buyer-facing term translation (PMO, Engineering) | L6 projection |
| Evidence Panel prototypes | L6b projection surfaces (Jira panel, GitHub Projects) | L6 projection |
| Commercial packaging | Engagement templates, pricing artifacts | Operations |
| Demo choreography support | Demo data preparation, visual polish, persona switching | L6/L7 |
| Topology visual polish | SVG rendering improvements, full-screen mode | L6 UI |
| BOARDROOM artifact packaging | Evidence Record Export formatting | L6 projection |

**Rules — Marketplace Experimentation Lane:**

1. Cannot mutate canonical derivation semantics (L2-L4)
2. Cannot alter qualification truth (S-state, Q-class computation)
3. Cannot bypass evidence-first doctrine
4. Cannot modify deterministic posture computation (PROCEED/INVESTIGATE/ESCALATE)
5. Projection-only authority — consumes governed output, never produces it
6. L0 connectors produce evidence artifacts only — no intelligence computation
7. Vocabulary overlays are rendering-layer — they translate terms, never redefine them
8. Commercial artifacts reference canonical capability only — no aspirational claims
9. Demo data must be real (anonymized if needed) — no synthetic data
10. All experimentation must be reversible without canonical impact

**Boundary enforcement:** If marketplace experimentation discovers a need to modify canonical execution (e.g., a new derivation rule, a qualification logic change, a signal computation extension), that modification MUST be extracted into a separate G1 governance stream targeting the Canonical Execution Lane or Substrate Evolution Lane. The marketplace branch MUST NOT contain the modification.

---

### 1C. Substrate Evolution Lane

**Definition:** The deep architecture mutation lane for future signal evolution, runtime semantic extension, and cross-plane capability development. This lane handles work that is fundamentally architecture-mutating — it changes what the substrate can compute, not how it is projected.

**Scope:**

| Construct | Current Maturity | Lane Authority |
|-----------|-----------------|----------------|
| EXSIG | SPECIFIED_NOT_IMPLEMENTED | Substrate Evolution |
| TIMSIG | FUTURE_DECLARED | Substrate Evolution |
| RISKSIG | FUTURE_DECLARED | Substrate Evolution |
| FLOWSIG | FUTURE_DECLARED | Substrate Evolution |
| ORGSIG | FUTURE_DECLARED | Substrate Evolution |
| Dual-plane reconciliation | INTERPRETIVE_LINEAGE | Substrate Evolution |
| Cross-plane ESI/RAG evolution | INTERPRETIVE_LINEAGE | Substrate Evolution |
| Temporal qualification | INTERPRETIVE_LINEAGE | Substrate Evolution |
| Structural Fidelity computation | INTERPRETIVE_LINEAGE | Substrate Evolution |
| PES-ESI-01..05 activation | SPECIFIED_NOT_IMPLEMENTED | Substrate Evolution |
| S3 Authority Ready implementation | SPECIFIED_NOT_IMPLEMENTED | Substrate Evolution |

**Rules — Substrate Evolution Lane:**

1. Every substrate evolution item requires its own isolated G1 governance stream
2. Independent validation lifecycle — no shared validators with canonical lane
3. Never merged directly into canonical execution lane — requires formal promotion
4. Full vault protocol required (bootstrap → preflight → execution → post-flight → enforcement)
5. Mandatory maturity classification at every stage
6. No commercialization assumptions driving substrate evolution timing
7. No "fast-track" merge for commercial urgency — governance timeline is governance timeline
8. Substrate evolution branches are long-lived — they do not follow sprint cadence
9. Cross-lane dependencies must be declared in the stream contract
10. Promotion to canonical requires: independent validation PASS, vault propagation COMPLETE, regression verification PASS, maturity classification upgrade documented

**Promotion protocol (Substrate Evolution → Canonical):**

```
Substrate Evolution Branch
  → Independent validation lifecycle complete
  → All validators PASS
  → Maturity classification: CANONICAL_RUNTIME_ACTIVE
  → Vault propagation: COMPLETE
  → Regression verification: PASS against current canonical
  → Formal promotion stream (G1)
  → Reconciliation review
  → Merge to canonical execution lane
  → Post-merge regression verification
```

No shortcut exists for this sequence.

---

## 2. Branch Strategy

### 2.1 Main Branch Freeze

`main` remains frozen and certifiable. The following are PROHIBITED on `main`:

- Direct marketplace experimentation commits
- Direct substrate evolution commits
- Experimental feature branches merged without reconciliation
- Convenience commits to avoid branch discipline
- "Quick fix" commits that bypass governance

**Exceptions (unchanged from git_structure_contract.md):**
- Governance root files (CLAUDE.md, SKILLS.md)
- Brain authority nodes on `brain/*` branches
- Strategic direction streams (PI.STRATEGIC-*) — governance artifacts only, no code

### 2.2 Branch Taxonomy

| Pattern | Lane | Purpose | Merge Target |
|---------|------|---------|-------------|
| `feature/marketplace-pmo-*` | Marketplace | Signäl/PMO projection, packaging, advisory | Reconciliation → main |
| `feature/marketplace-eng-*` | Marketplace | Signäl/Engineering projection, packaging | Reconciliation → main |
| `feature/l0-adapter-jira-*` | Marketplace | Jira Ledger Selector adapter | Reconciliation → main |
| `feature/l0-adapter-github-*` | Marketplace | GitHub Ledger Selector adapter | Reconciliation → main |
| `feature/projection-*` | Marketplace | L6 projection overlays, vocabulary, formatting | Reconciliation → main |
| `feature/demo-*` | Marketplace | Demo readiness, visual polish, choreography | Reconciliation → main |
| `feature/advisory-*` | Marketplace | Advisory tooling, curation aids | Reconciliation → main |
| `feature/substrate-evolution-*` | Substrate Evolution | General substrate mutation | Promotion → main |
| `feature/exsig-*` | Substrate Evolution | EXSIG implementation | Promotion → main |
| `feature/timsig-*` | Substrate Evolution | TIMSIG implementation | Promotion → main |
| `feature/cross-plane-*` | Substrate Evolution | Cross-plane reconciliation | Promotion → main |
| `feature/pios-core` | Canonical | Core derivation (existing) | Standard → main |
| `feature/activation` | Canonical | Activation (existing) | Standard → main |
| `feature/runtime-demo` | Canonical | Runtime/demo (existing) | Standard → main |
| `feature/governance` | Canonical | Governance docs (existing) | Standard → main |

### 2.3 Branch Naming Rules

1. Branch name MUST include lane prefix from the taxonomy above
2. Branch name MUST be descriptive enough to identify scope without reading commits
3. No generic names (`feature/fix`, `feature/update`, `feature/wip`)
4. Substrate evolution branches MUST include the signal family or construct name
5. Marketplace branches MUST include the module or capability name

### 2.4 Merge Governance

**Marketplace → main:** Reconciliation merge (§6)
- Mandatory reconciliation review before merge
- Must verify no canonical contamination
- Must verify projection-only authority maintained
- Must verify no new derivation logic introduced

**Substrate Evolution → main:** Promotion merge (§1C promotion protocol)
- Full governance lifecycle complete
- Independent validation PASS
- Vault propagation COMPLETE
- Regression verification against current canonical PASS
- Formal promotion stream (G1)

**Canonical branches → main:** Standard merge (existing git_structure_contract.md rules)
- Existing branch-domain ownership enforced
- No cross-domain mutation

**PROHIBITED merges:**
- Marketplace → Canonical (bypassing main)
- Substrate Evolution → Marketplace (capability leaking before promotion)
- Any branch → main without reconciliation/promotion review
- Force push to main under any circumstance

---

## 3. Canonical Protection Rules — Forbidden Contamination Patterns

The following contamination patterns are explicitly forbidden. Each represents a specific vector where commercialization work can corrupt canonical execution integrity.

### CP-1: Projection Logic Leaking into Derivation

**Pattern:** A marketplace projection template introduces conditional logic that changes how structural intelligence is derived, not just how it is rendered.

**Example:** A PMO vocabulary overlay adds a "governance maturity score" that averages Q-class values across domains. This is a new derivation — it computes something the canonical pipeline does not compute. It belongs in derivation (L3), not projection (L6).

**Rule:** Projection RENDERS. Derivation COMPUTES. If a marketplace change introduces computation that does not exist in the canonical pipeline, it is derivation leaking into projection. Extract it to a G1 substrate or canonical stream.

### CP-2: PMO Semantics Leaking into Substrate

**Pattern:** PMO-specific concepts (PI Planning, SAFe ceremonies, sprint velocity, RAG status) enter canonical terminology or data models.

**Example:** A Jira adapter maps "Sprint Velocity" to a canonical signal field. Now the canonical signal model has a PMO-specific concept embedded in it. Future modules (Engineering, Product) inherit PMO semantics they don't need.

**Rule:** PMO semantics are projection-layer vocabulary overlays. They NEVER enter canonical data models, signal definitions, or derivation logic. The canonical model uses structural terms (domain, propagation, pressure, qualification). PMO terms are L6 rendering aliases.

### CP-3: GitHub-Specific Assumptions Entering Canonical Runtime

**Pattern:** GitHub adapter logic introduces assumptions about evidence structure that become embedded in canonical processing.

**Example:** The GitHub adapter assumes all evidence comes as JSON from API responses. The canonical pipeline's `source_intake.py` is modified to expect JSON instead of HTML/archive evidence. Now advisory-curated evidence (HTML) breaks intake.

**Rule:** L0 adapters produce conforming evidence artifacts that match existing `source_intake.py` contracts. The canonical pipeline is evidence-source-agnostic. Adapter-specific logic stays in L0.

### CP-4: Temporary Marketplace Shortcuts Entering Canonical Paths

**Pattern:** A marketplace demo needs a feature that doesn't exist. A developer adds a "temporary" hack to PATH A (substrate derivation) or PATH B (governed projection) to make the demo work. The hack persists.

**Example (PATH A):** The demo needs to show propagation weight as a percentage. No percentage computation exists in 75.x. A developer adds percentage normalization to `pressure_zone_state.json`. Now canonical output includes a non-governed computation.

**Example (PATH B):** The demo needs a PMO-specific summary view. A developer adds conditional rendering logic to the persona engine that checks for a "pmo_mode" flag. Now canonical projection contains marketplace-specific branching.

**Rule:** If a marketplace need requires PATH A or PATH B modification, it is a canonical or substrate evolution change. It gets its own G1 stream. No "temporary" modifications to canonical paths. Temporary in canonical becomes permanent by inertia.

### CP-5: Speculative Temporal Semantics Entering STATIC Intelligence

**Pattern:** Marketplace positioning claims temporal prediction capability. A developer adds "posture drift detection" logic to qualify the claim.

**Example:** Run-over-run comparison logic is added to SQO to detect S-state changes over time. This is TEMPORAL intelligence — it requires EXSIG and TIMSIG (both FUTURE_DECLARED/SPECIFIED_NOT_IMPLEMENTED). Adding it to canonical SQO contaminates STATIC qualification with ungovnerned temporal computation.

**Rule:** STATIC and TEMPORAL are separate capability classes. STATIC is CANONICAL_RUNTIME_ACTIVE. TEMPORAL requires substrate evolution (EXSIG, TIMSIG). No temporal computation enters canonical paths until the substrate evolution governance stream completes and promotes the capability.

### CP-6: Buyer-Language Replacing Canonical Terminology Internally

**Pattern:** PMO or Engineering buyer vocabulary replaces canonical terms in code, data models, or governance documents.

**Example:** A developer renames `qualification_state` to `governance_maturity` in the SQO data model because PMO buyers understand "governance maturity" better. Now the canonical model uses a buyer-facing term that doesn't map to other verticals.

**Rule:** Canonical terminology is locked (TERMINOLOGY_LOCK.md). Buyer-facing vocabulary is a projection-layer rendering concern. Internal code, data models, and governance documents use canonical terms. Vocabulary overlays translate at L6. The canonical term is the source of truth.

### CP-7: Connector Assumptions Mutating Evidence Doctrine

**Pattern:** A Jira or GitHub connector introduces evidence handling assumptions that weaken evidence-first governance.

**Example:** The Jira adapter auto-accepts all extracted data without qualification gate assessment. Evidence quality is assumed rather than verified. Q-class is not computed for connector-derived evidence. The system presents Jira-derived intelligence at the same confidence level as advisory-curated evidence.

**Rule:** All evidence sources are subject to evidence-first doctrine. Connector-derived evidence MUST pass through a qualification gate (L0). Q-class MUST be computed and disclosed. Evidence source class MUST be tracked. No evidence source receives implicit trust.

### CP-8: Marketplace Module Logic in Core Derivation (L2-L4)

**Pattern:** A marketplace module needs a specific derivation that only applies to its vertical. The derivation is added to PiOS Core.

**Example:** Signäl/PMO needs a "PI Planning Coverage Score." A developer adds this computation to the 40.x derivation pipeline. Now PiOS Core contains a PMO-specific derivation that is meaningless for Signäl/Engineering.

**Rule:** PiOS Core derives structural intelligence that is universal. Vertical-specific computations are marketplace-module-level concerns, handled in projection (L6) or as marketplace-specific post-processing. Core derivation serves the substrate, not any single module.

---

## 4. Layer Protection Matrix

| Layer | Protected Components | Marketplace Experimentation Allowed | Forbidden |
|-------|---------------------|-------------------------------------|-----------|
| **L0** | `source_intake.py` contract, `evidence_sources.yaml` schema, SHA-256 boundary validation | New Ledger Selector adapter modes (Jira, GitHub, ADO) — must produce conforming evidence artifacts | Modifying intake contract, weakening validation, bypassing SHA-256, adding source-specific logic to intake |
| **L1** | 40.2-40.4 ingestion pipeline | None | Any modification — ingestion is canonical |
| **L2** | Evidence navigation, 40.x structural verification | None | Any modification — navigation is canonical |
| **L3** | Derivation: CEU grounding, signal computation (41.x), condition/pressure (75.x), ESI/RAG (40.16) | None | Any modification — derivation is canonical. New derivations require Substrate Evolution lane |
| **L4** | Semantic shaping, binding envelope construction | None | Any modification — shaping is canonical |
| **L5** | 43.x/44.x activation, signal-to-structure binding | None | Any modification — activation is canonical |
| **L6** | LENS core projection runtime (`projection_runtime.py`), persona engine, zone architecture | Vocabulary overlays, new projection templates, formatting improvements, new artifact types (Structural Domain Mapping Reference), visual polish, Evidence Panel prototypes (L6b) | Modifying core projection semantics, altering persona computation logic, changing zone data flow |
| **SQO** | State machine (S0-S3), qualification engines, reconciliation loop, semantic debt index | Cockpit UI improvements (G2), visualization refinements | Modifying S-state transition logic, altering qualification computation, changing reconciliation semantics |
| **REPORTS** | Evidence Record Export core logic, governance boundary generation | Formatting improvements, new report sections (PMO-vocabulary), BOARDROOM packaging refinements | Altering evidence chain traceability, weakening governance boundary statements, removing Q-class disclosure |
| **SIGNALS** | 41.x signal projection, signal_registry.json schema, 75.x condition/pressure computation | None | Any modification — signal computation is canonical |
| **QUALIFICATION** | Q-class (Q-01..Q-04) logic, Q02_GOVERNANCE_AMENDMENT.md | None — Q-class is LOCKED | Any modification. Q-class governance is locked and non-negotiable |
| **PROJECTION** | Core projection data flow (vault → LENS) | New projection surfaces, vocabulary overlays, buyer-facing rendering templates, aggregation views | Modifying what data enters projection, altering governed data before rendering, introducing computation in projection paths |

---

## 5. Implementation Entry Sequence

Commercialization implementation follows a strict phase sequence. Each phase has defined entry criteria and lane classification.

### Phase 0 — Demo Readiness

**Lane:** Marketplace Experimentation
**Branch pattern:** `feature/demo-*`
**Entry criteria:** Strategy stream approved (PI.STRATEGIC-DIRECTION.MARKETPLACE-COMMERCIALIZATION-STRATEGY.01)

| Item | Lane | Layer | Governance |
|------|------|-------|-----------|
| Topology visual polish (full-screen, pan/zoom, node rendering) | Marketplace | L6 UI | G2 |
| BOARDROOM artifact packaging (5-page report format) | Marketplace | L6 projection | G2 |
| Demo data preparation (anonymized BlueEdge) | Marketplace | L7 | G3 |
| Persona switching fluidity | Marketplace | L6 UI | G2 |
| Investigation lattice polish | Marketplace | L6 UI | G2 |

**Exit criteria:** 20-minute demo choreography executable with production-grade quality.

### Phase 1A — Signäl/PMO Commercial Entry

**Lane:** Marketplace Experimentation
**Branch pattern:** `feature/marketplace-pmo-*`, `feature/projection-*`, `feature/advisory-*`
**Entry criteria:** Phase 0 complete
**Parallel with:** Phase 1B (from week 6)

| Item | Lane | Layer | Governance |
|------|------|-------|-----------|
| Structural Domain Mapping Reference artifact | Marketplace | L6 projection | G1 (new artifact) |
| PMO-vocabulary projection templates | Marketplace | L6 projection | G2 |
| Aggregated structural coverage view | Marketplace | L6 projection | G2 |
| Advisory evidence curation toolkit | Marketplace | Operations | G3 |
| Pilot delivery template | Marketplace | Operations | G3 |

**Exit criteria:** Complete Signäl/PMO pilot delivery capability.

### Phase 1B — Signäl/Engineering Substrate Entry

**Lane:** Marketplace Experimentation (L0 adapter) + Marketplace Experimentation (projection)
**Branch pattern:** `feature/l0-adapter-github-*`, `feature/marketplace-eng-*`, `feature/projection-*`
**Entry criteria:** Phase 0 complete
**Parallel with:** Phase 1A

| Item | Lane | Layer | Governance |
|------|------|-------|-----------|
| GitHub Ledger Selector adapter | Marketplace | L0 | G1 (new adapter) |
| GitHub → structural domain mapping | Marketplace | L0 | G1 (new mapping) |
| GitHub evidence qualification gate | Marketplace | L0 | G1 (new gate) |
| Engineering-vocabulary projection templates | Marketplace | L6 projection | G2 |
| Repo topology visualization | Marketplace | L6 UI | G2 |
| Contributor concentration analysis | Marketplace | L0/L6 | G1 (new derivation from GitHub evidence) |

**L0 boundary enforcement:** GitHub adapter work is strictly L0 — it produces conforming evidence artifacts for `source_intake.py`. It does NOT modify L1-L4 computation. The existing canonical pipeline processes GitHub-derived evidence identically to advisory-curated evidence.

**Exit criteria:** Complete Signäl/Engineering pilot delivery capability via GitHub evidence.

### Phase 2 — Cross-Plane Structural Coherence

**Lane:** Substrate Evolution (primarily) + Marketplace Experimentation (projection)
**Branch pattern:** `feature/substrate-evolution-*`, `feature/exsig-*`, `feature/timsig-*`, `feature/cross-plane-*`
**Entry criteria:** Phase 1A AND Phase 1B complete. Both evidence planes operational. Formal governance review.

| Item | Lane | Layer | Governance |
|------|------|-------|-----------|
| Jira Ledger Selector adapter | Marketplace | L0 | G1 |
| Jira Evidence Qualification Gate | Marketplace | L0 | G1 |
| EXSIG implementation | **Substrate Evolution** | L3 | G1 (formal governance stream) |
| TIMSIG implementation | **Substrate Evolution** | L3 | G1 (formal governance stream) |
| Dual-plane evidence reconciliation | **Substrate Evolution** | L3-L4 | G1 (formal governance stream) |
| Cross-plane ESI/RAG extension | **Substrate Evolution** | L3 | G1 (formal governance stream) |
| Jira Evidence Panel (L6b) | Marketplace | L6 | G1 |
| Portfolio-level topology | Marketplace | L6 | G2 |
| Bidirectional sync | **Substrate Evolution** | L0/L6b | G1 (formal governance stream) |

**Gate:** Phase 2 substrate evolution items CANNOT begin without formal governance review confirming:
1. Phase 1A and 1B are operational and validated
2. Canonical execution chain integrity is certified (PATH A derivation + PATH B projection)
3. The substrate evolution stream contract is formally issued
4. Independent validation lifecycle is defined
5. Promotion criteria are specified

---

## 6. Merge Reconciliation Contract

Before ANY marketplace experimentation branch merges toward `main`, the following reconciliation checks are MANDATORY.

### 6.1 Pre-Merge Reconciliation Checklist

| # | Check | Verification Method | PASS Criteria |
|---|-------|-------------------|---------------|
| RC-1 | **Maturity validation** | Review all constructs introduced or modified. Classify each by maturity level. | No construct overclaims maturity. IMPLEMENTED_ISOLATED not claimed as CANONICAL_RUNTIME_ACTIVE. |
| RC-2 | **STATIC vs TEMPORAL verification** | Grep for temporal computation, run-over-run comparison, drift detection, prediction logic. | Zero temporal computation in marketplace branches. STATIC capability only. |
| RC-3 | **Evidence doctrine verification** | Review all evidence handling paths. Verify SHA-256 validation, Q-class computation, source class tracking. | No evidence path bypasses governance. All sources qualified. |
| RC-4 | **Qualification integrity verification** | Review SQO state machine, Q-class logic, S-state transitions. Verify no modification. | Zero changes to qualification computation. |
| RC-5 | **Topology integrity verification** | Review topology derivation, propagation computation, pressure zone logic. Verify no modification. | Zero changes to structural derivation. |
| RC-6 | **PATH A runtime impact assessment** | Run canonical PATH A end-to-end with existing test evidence. Compare vault output to baseline. | Identical vault output. No derivation regression. |
| RC-6b | **PATH B projection integrity assessment** | Verify LENS projection runtime, persona engine, Evidence Record Export, and SQO overlay produce identical output from same vault input. | Identical projection output. No PATH B regression. |
| RC-7 | **Projection contamination assessment** | Review all L6 changes. Verify projection consumes but never modifies governed data. Verify no marketplace-specific branching in persona engine or Evidence Record generation. | No computation introduced in projection paths. No governed data altered before rendering. No conditional marketplace logic in PATH B. |
| RC-8 | **Terminology compliance** | Grep for buyer-language in canonical code paths, data models, governance documents. | Zero buyer-language in canonical terminology. Buyer terms restricted to L6 vocabulary overlays. |
| RC-9 | **Untracked file audit** | Run `git status` for untracked files. Verify no governance artifacts, evidence files, or canonical outputs are untracked. | All produced files either tracked or explicitly excluded. |
| RC-10 | **Cross-lane contamination check** | Verify no substrate evolution work in marketplace branches. Verify no marketplace work in canonical branches. | Lane boundaries maintained. |

### 6.2 Reconciliation Authority

Reconciliation review requires:
- The developer who produced the branch
- An independent reviewer (or Claude executing reconciliation checklist in a separate stream)
- Written reconciliation result logged in the merge stream's `execution_report.md`

### 6.3 Failed Reconciliation

If ANY check FAILS:
1. STOP — do not merge
2. Identify the contamination vector
3. Extract contaminating logic to the correct lane
4. Re-run reconciliation
5. Document the contamination incident in the stream's `execution_report.md`

No exception process exists for reconciliation failure. The fix is always extraction, never exception.

---

## 7. Architectural Warning

> **The primary risk is not code instability.
> The primary risk is epistemological contamination:
> commercial interpretation mutating structural truth semantics before governance stabilizes them.**

This warning encodes the deepest architectural risk in marketplace commercialization. Code bugs are fixable. Test failures are detectable. But when commercial interpretation — buyer-facing vocabulary, marketplace positioning, temporal prediction claims, PMO-specific semantics — leaks into the substrate and becomes part of structural truth, the damage is:

1. **Silent** — no test catches "governance maturity" replacing "qualification state" in a data model
2. **Compounding** — each subsequent module builds on the contaminated term
3. **Irreversible at scale** — once buyer-facing terms are in production data, migration is prohibitive
4. **Category-destroying** — if PMO semantics contaminate the substrate, Program Intelligence collapses into "advanced PMO intelligence"

The lane discipline defined in this document exists specifically to prevent this risk. The lanes are not organizational convenience — they are epistemological protection boundaries.

---

## Appendix A: Quick Reference — Lane Decision Tree

```
Is the change modifying how structural intelligence is COMPUTED?
  ├── YES → Is it extending existing canonical computation?
  │         ├── YES → Canonical Execution Lane (G1 stream)
  │         └── NO → Is it a new signal family or cross-plane capability?
  │                   ├── YES → Substrate Evolution Lane (G1 stream, isolated)
  │                   └── NO → Canonical Execution Lane (G1 stream)
  │
  └── NO → Is the change modifying how structural intelligence is PROJECTED?
            ├── YES → Is it modifying core projection semantics (persona engine, zone data flow)?
            │         ├── YES → Canonical Execution Lane (G1 stream)
            │         └── NO → Marketplace Experimentation Lane (G2/G3)
            │
            └── NO → Is the change operational tooling, packaging, or advisory?
                      └── YES → Marketplace Experimentation Lane (G3)
```

## Appendix B: Quick Reference — Contamination Detection Patterns

| Pattern to grep | Contamination type | Lane violation |
|----------------|-------------------|---------------|
| `velocity`, `sprint_velocity`, `story_points` in L2-L4 code | PMO semantics in substrate | CP-2 |
| `predict`, `forecast`, `drift`, `trend` in canonical paths | Temporal in STATIC | CP-5 |
| `governance_maturity`, `health_score` in data models | Buyer-language in canonical | CP-6 |
| New computation in `app/` projection code (not consuming vault) | Projection computing | CP-1 |
| `json.loads` in `source_intake.py` (source-specific) | Connector assumption in intake | CP-3, CP-7 |
| Direct import of marketplace module in canonical pipeline | Cross-lane contamination | CP-8 |
| `TODO`, `HACK`, `TEMPORARY` in canonical paths | Shortcut persistence | CP-4 |
