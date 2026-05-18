# STREAM CONTRACT — PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01

## Status: PENDING EXECUTION

---

## 1. Stream Identity

| Field | Value |
|---|---|
| Stream ID | `PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01` |
| Classification | G1 — Architecture-Mutating |
| Branch | `feature/governance` |
| Artifact root | `docs/pios/PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01/` |
| Scope | Architectural specification ONLY — no implementation code |
| Contract date | 2026-05-18 |
| Contract revision | v3 — SQO-coupled, lifecycle deferred to SQO authority |

---

## 2. Problem Statement

PATH B's semantic topology (17 domains, 42 capabilities, 89 components in `scripts/pios/41.1/build_semantic_layer.py`) is hardcoded as BlueEdge-specific Python literals. For any new client:

- **PATH A generalizes** — swap the CEU registry, run the same structural scanner, get Client C's DOMs
- **PATH B breaks** — the 17 domains are BlueEdge business-purpose classifications encoded as static data, not a derivation algorithm

The downstream impact chain: if `semantic_topology_model.json` does not exist for Client C → crosswalk has no DOMAIN targets → reconciliation has no DOMAIN inputs → grounding ratio is undefined → Q-class is undefined → LENS fullReport has no semantic domains → every zone derive function produces empty or degraded output. The entire LENS projection chain collapses.

The LENS runtime consumption chain is ~85-90% already generalized. The gap is narrow but critical: three BlueEdge-specific data artifacts, one hardcoded DOM reference, and the absence of a semantic derivation process.

### 2.1 Origin of the Static Data (Critical Context)

The 17 domains in `build_semantic_layer.py` were NOT hand-crafted by a human domain expert. They were produced by Claude analyzing 3 HTML evidence files (architecture document, PMO dashboard, competitive analysis) during BlueEdge's first derivation run. The analysis happened in-context — Claude read the documents, identified component inventory from `app.module.ts` session comments and architecture HTML sections, classified components into capabilities and domains based on business-purpose descriptions in the evidence.

Nobody could reproduce that derivation afterward. `build_semantic_layer.py` was created to freeze Claude's output as static Python literals — a snapshot of an unreproducible session, not the intended architecture.

**This means:** The semantic classification was always evidence-driven document comprehension, not irreducible human judgment. The bottleneck is not "a human must classify domains" — it is "the derivation process that produced the classification was never captured as a repeatable, governed pipeline."

### 2.2 Corrected Architecture Direction

The solution is not a manual advisory construction process. It is a **governed semantic derivation compiler** that formalizes what Claude already did for BlueEdge:

```
BlueEdge (what happened):              Client C (what should happen):
3 HTML files                           Client C's business process documents
  → Claude analyzed in-context           → Governed semantic derivation compiler
  → produced 89 COMP → 42 CAP → 17 DOM  → proposes COMP → CAP → DOMAIN classification
  → nobody could reproduce it            → with confidence scoring per classification
  → frozen as static Python literals     → advisory team REVIEWS (not constructs)
                                         → approved output → Client C's CSR
```

### 2.3 SQO Already Identified This Gap

`PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01` defined a 6-stage intake loop and a 7-state client lifecycle. Stage 3 (Semantic Construction) is the identified gap:

> *"This is where the semantic material is created. For BlueEdge, this was done through iterative manual streams. For new clients, this is the AI-assisted reconstruction insertion point."*

SQO identified the bottleneck but did not specify the mechanism. This stream fills that gap.

---

## 3. Scope

### In Scope

1. **Gap Assessment** — per-artifact generalization status for every file in the LENS 7-layer traceback, quantified
2. **Client Semantic Registry (CSR) Specification** — JSON schema, location convention, relationship to build_semantic_layer.py, S0→S1 gate formalization
3. **Semantic Derivation Compiler Specification** — the governed process that fills SQO Stage 3 (takes client business process documents → produces CSR with confidence scoring and review gates)
4. **Crosswalk Auto-Derivation Specification** — algorithm interface for proposing DOM↔DOMAIN mappings (SQO Stage 3→4 bridge)
5. **Marketplace Impact Assessment** — Tier 1A readiness, revised effort model, advisory role as reviewer not constructor
6. **Hardcoding Fix Specifications** — DOM-04, flagshipBinding defaults, compile_blueedge_correspondence parameterization
7. **Vault Propagation** — TERMINOLOGY_LOCK, CROSSWALK_AND_RECONCILIATION, SQO_EVOLUTION, PIOS_CURRENT_CANONICAL_STATE, PATH_B_EMERGENCE

### Out of Scope

- No implementation code
- No changes to existing runtime files
- No new runtime modules
- No universal semantic compiler (scope is bounded to structured business process documentation, not arbitrary text)
- **No standalone onboarding lifecycle definition** — SQO's existing 6-stage intake loop is authoritative
- Implementation deferred to future stream(s)

---

## 4. SQO Coupling

This stream is NOT a parallel onboarding substrate. It fills the undefined mechanism within SQO's existing client onboarding lifecycle — specifically **Stage 3: Semantic Construction**.

### 4.1 SQO's Existing Lifecycle (Authoritative)

`PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01` already specifies:

**6-stage intake loop** (document 04):
```
Stage 1: Evidence Intake → Stage 2: Structural Analysis (PATH A)
→ Stage 3: Semantic Construction (PATH B) → Stage 4: Reconciliation Correspondence
→ Stage 5: SQO Qualification → Stage 6: Runtime Visibility
```

**7-state client lifecycle** (document 06):
```
NOT_ONBOARDED → EVIDENCE_INTAKE → STRUCTURAL_ANALYSIS
→ SEMANTIC_CONSTRUCTION → RECONCILABLE → RECONCILED → PROGRESSIVE
```

**Also specified by SQO:**
- Manifest-based client registration (zero client-specific code)
- Reusability assessment (82% of reconciliation engine immediately reusable)
- Config vs code boundary (client business data = configuration, reconciliation mechanics = code)
- Multi-client runtime architecture (shared engine, per-client artifacts)
- Generalized compilation orchestration (CLI args instead of hardcoded client/run)
- Reconciliation loop (compile → assess → improve → re-compile → approve → advance)

This stream does NOT redefine any of the above. SQO's lifecycle, state model, registration, compilation, and loop architecture are authoritative.

### 4.2 What SQO Left Undefined

SQO Stage 3 says "AI-assisted reconstruction insertion point" but does not specify:

| Gap | What's missing |
|---|---|
| Stage 3 mechanism | What "AI-assisted reconstruction" means mechanically |
| Stage 3 output schema | What JSON structure the semantic construction must produce |
| Stage 3→4 bridge | How the crosswalk is derived once semantic domains exist |
| Evidence quality contract | What input evidence quality is required for semantic derivation |
| Confidence model | What confidence levels govern derivation output |
| S0→S1 gate conditions | Precise artifact requirements for state transition |

This stream answers all six.

### 4.3 SQO Anti-Pattern Correction

SQO document 06 §8 warns against a "Universal semantic compiler — Trying to build one model that generates semantic topology for any codebase automatically." That anti-pattern was written under the assumption that the 17 domains were human-provided semantic material.

The corrected record (§2.1) shows they were Claude-derived from evidence documents. The domain model WAS a compiler output — from an ungoverned, unreproducible session.

The semantic derivation compiler specified in this stream is NOT the universal compiler SQO warned against. The distinction:

| SQO Anti-Pattern | This Stream's Compiler |
|---|---|
| "Any codebase automatically" | Bounded to structured business process documentation |
| No quality gate | Input evidence quality gate — rejects insufficient evidence |
| No confidence model | 3-level confidence (DIRECT_EVIDENCE / DERIVED / INFERRED) |
| No human oversight | Mandatory review gate for low-confidence output |
| Unbounded scope | 75.x governance boundaries (no organizational intent inference) |

### 4.4 Deliverable-to-SQO Mapping

| Deliverable | SQO Integration Point |
|---|---|
| D-1 GAP_ASSESSMENT | Quantifies what SQO's assessment (document 02) described qualitatively |
| D-2 CSR SPECIFICATION | Defines Stage 3 output artifact schema + S0→S1 gate conditions |
| D-3 COMPILER SPECIFICATION | Defines Stage 3 mechanism — the "AI-assisted reconstruction" |
| D-4 CROSSWALK AUTO-DERIVATION | Defines Stage 3→4 bridge (crosswalk from semantic domains) |
| D-5 MARKETPLACE IMPACT | Assesses commercial implications of Stage 3 being compiler-driven |
| D-6 HARDCODING FIXES | Addresses residual parameterization work SQO flagged |

### 4.5 S0→S1 Gate Formalization

The S0→S1 gate in SQO's S-state machine is currently implicit. This stream formalizes it within D-2:

**Gate condition:** A client advances from S0 (NO_QUALIFICATION) to S1 (ONBOARDING_REQUIRED) → S2 (QUALIFIED_WITH_DEBT) when:
- PATH A structural artifacts exist (canonical_topology.json, signal_registry.json) — SQO Stage 2
- Client Semantic Registry exists and has been reviewed — SQO Stage 3
- semantic_topology_model.json generated from CSR — SQO Stage 3 output
- semantic_continuity_crosswalk.json exists (auto-derived + reviewed) — SQO Stage 3→4

Without a reviewed CSR, a client has structural topology but no semantic qualification chain. This IS FastAPI's current state — PATH A artifacts exist, no semantic construction.

---

## 5. Deliverables

### 5.1 Primary Deliverables

| # | Artifact | Description |
|---|---|---|
| D-1 | `GAP_ASSESSMENT.md` | Per-artifact classification (GENERAL / PARAMETERIZABLE / BLUEEDGE_SPECIFIC) for every file in the LENS consumption chain. Quantified generalization ratio. Impact chain for hypothetical Client C. The boundary between what the pipeline already handles and what requires the new substrate. Incorporates and extends SQO's prior art (`PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/02_BLUEEDGE_SPECIFIC_DEPENDENCY_INVENTORY.md`). |
| D-2 | `CLIENT_SEMANTIC_REGISTRY_SPECIFICATION.md` | JSON schema for the CSR (`domains[]`, `capabilities[]`, `components[]`, `metadata{}` including `derivation_source`, `confidence_per_classification`, `reviewer`, `evidence_basis`). Location convention (`clients/{client_id}/semantic/client_semantic_registry.json`). Relationship to build_semantic_layer.py (CSR replaces hardcoded literals; BlueEdge data becomes first CSR instance). CEU analogy (both are per-client config driving derivation) and disanalogy (CEU matches file patterns deterministically; CSR is derived from document comprehension with confidence scoring). S0→S1 gate conditions (CSR as the artifact that enables semantic qualification). SQO Stage 3 output contract. Maturity: SPECIFIED_NOT_IMPLEMENTED. |
| D-3 | `SEMANTIC_DERIVATION_COMPILER_SPECIFICATION.md` | **The core deliverable — SQO Stage 3 mechanism.** Specification for a governed semantic derivation process that takes client business process documents as input and produces a CSR draft as output. Covers: (1) Input contract — accepted document types, minimum evidence quality gate, required content. (2) Extraction — how components/modules/services are identified from documents. (3) Classification — how components are grouped into capabilities and domains. (4) Confidence model — per-classification confidence (DIRECT_EVIDENCE / DERIVED / INFERRED). (5) Output contract — CSR JSON with confidence scores, flagged ambiguities. (6) Review gate — what triggers mandatory human review vs auto-approval. (7) Governance boundaries — 75.x prohibitions. (8) BlueEdge retroactive validation — specification must be tested against the known BlueEdge derivation. (9) Input quality gate — evidence quality → expected output quality → honest rejection when evidence is insufficient. |
| D-4 | `CROSSWALK_AUTO_DERIVATION_SPECIFICATION.md` | **SQO Stage 3→4 bridge.** Algorithm interface for auto-deriving crosswalk entries from PATH A DOMs + PATH B DOMAINs. Confidence scoring per proposed mapping. Human review gate with threshold. Irresolvability detection (DOM-09 pattern generalized). Reconciliation input readiness check. compile_correspondence.js parameterization spec (from SQO document 06 §4). |
| D-5 | `MARKETPLACE_IMPACT_ASSESSMENT.md` | Tier 1A output readiness with semantic derivation compiler. Revised effort model (hours per client, not days/weeks). Advisory role as evidence curator and semantic reviewer (not constructor). STATIC capability claim precision. Phase 0/1A/1B impact. |
| D-6 | `HARDCODING_FIX_SPECIFICATIONS.md` | Three fixes with approach + effort: (1) DOM-04 in GenericSemanticPayloadResolver.js:283 → manifest-declared `passthrough_dom` field [LOW]. (2) flagshipBinding.js:31-32 defaults → environment-configurable [TRIVIAL]. (3) compile_blueedge_correspondence.js → parameterized `compile_correspondence.js --client --run` [MEDIUM, per SQO document 06 §4]. |

### 5.2 Mandatory Stream Artifacts

| # | Artifact |
|---|---|
| M-1 | `execution_report.md` |
| M-2 | `validation_log.json` (24 named checks) |
| M-3 | `file_changes.json` |
| M-4 | `CLOSURE.md` (Sections 1-10, G1 §10 Architecture Memory Propagation) |

---

## 6. Execution Phases

### Phase 0: Pre-Flight (G1 Mandatory)

Load vault (§12.2):
- CLAUDE.md + git_structure_contract.md
- PIOS_CURRENT_CANONICAL_STATE.md
- TERMINOLOGY_LOCK.md
- OPERATIONAL_ONTOLOGY.md, CROSSWALK_AND_RECONCILIATION.md, PATH_B_EMERGENCE.md, SQO_EVOLUTION.md

Load SQO prior art:
- `PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/04_SEMANTIC_EVIDENCE_INTAKE_LOOP.md`
- `PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/06_MULTI_CLIENT_RECONCILIATION_LIFECYCLE.md`

Preflight (§12.3):
- Staleness check
- Term collision check: "Client Semantic Registry" and "Semantic Derivation Compiler" against all locked terms
- Branch authorization
- SQO lifecycle consistency check: confirm this stream's deliverables integrate into SQO's 6-stage model without contradiction
- Initialize architecture mutation log

### Phase 1: GAP_ASSESSMENT.md (D-1)

Read and classify every artifact in the LENS 7-layer traceback. Files to analyze:

| File | Expected classification |
|---|---|
| `scripts/pios/41.1/build_semantic_layer.py` | BLUEEDGE_SPECIFIC |
| `semantic_topology_model.json` (clients/blueedge/...) | BLUEEDGE_SPECIFIC (output of above) |
| `semantic_continuity_crosswalk.json` (clients/blueedge/...) | BLUEEDGE_SPECIFIC (BlueEdge DOM→DOMAIN mapping) |
| `SemanticCrosswalkMapper.js` | GENERAL (takes crosswalk data as input) |
| `ReconciliationCorrespondenceCompiler.js` | GENERAL (5-input, fully parameterized) |
| `SemanticActorHydrator.js` | GENERAL (grounding ratio from any topology) |
| `GenericSemanticPayloadResolver.js` | PARAMETERIZABLE (DOM-04 hardcoded at line 283) |
| `GenericSemanticArtifactLoader.js` | GENERAL (manifest-driven) |
| `flagshipBinding.js` | PARAMETERIZABLE (BlueEdge defaults) |
| `manifests/index.js` | GENERAL (registry pattern, one-line addition per client) |
| All zone components (10) | GENERAL |
| All derive functions (36 GUIDED_QUERY_ANSWERS) | GENERAL |
| SQOCockpitStateResolver.js | GENERAL |
| SQOCockpitArtifactLoader.js | GENERAL (manifest-driven, 31 artifact keys) |
| All 18 SQO engines | GENERAL |

Incorporate and extend SQO's prior art from `PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/02_BLUEEDGE_SPECIFIC_DEPENDENCY_INVENTORY.md`.

### Phase 2: CLIENT_SEMANTIC_REGISTRY_SPECIFICATION.md (D-2)

Produce CSR specification per D-2 requirements. Key additions vs v2 contract:
- Explicitly position CSR as SQO Stage 3 output artifact
- S0→S1 gate formalization: CSR approval is the gate condition
- Reference SQO's existing artifact schema expectations (what GenericSemanticArtifactLoader expects)

### Phase 3: SEMANTIC_DERIVATION_COMPILER_SPECIFICATION.md (D-3)

**The central deliverable.** This formalizes what Claude already did for BlueEdge into a governed, repeatable process that fills SQO Stage 3.

**Inputs to analyze for this phase:**
- BlueEdge's 3 source HTML files (the original evidence that produced the 17 domains)
- `build_semantic_layer.py` lines 39-196 (the frozen output of that analysis)
- The `app.module.ts` session comment structure referenced in the elevation report
- The coherence assessment per domain (documents which domains had DIRECT_EVIDENCE vs INFERRED grouping)

**Specification must address:**

1. **Input evidence contract.** What documents does the compiler accept? Minimum: architecture documentation with component/module/service inventory. Optimal: architecture docs + business process descriptions + component dependency information. The compiler must reject evidence that lacks identifiable component structure.

2. **Component extraction.** How modules/services/components are identified from evidence documents. For BlueEdge: `app.module.ts` session comments naming modules, architecture HTML sections. For Client C: architecture diagrams, API documentation, system design docs.

3. **Capability classification.** How extracted components are grouped into capabilities. Rules from BlueEdge precedent: shared explicit grouping signals, shared operational purpose, single-component capabilities permitted if justified.

4. **Domain classification.** How capabilities are grouped into domains. Confidence hierarchy: document-explicit grouping (highest) → operational adjacency (medium) → structural adjacency (lowest for semantic purposes).

5. **Confidence model.** Per-classification confidence:
   - `DIRECT_EVIDENCE` — document explicitly names this grouping
   - `DERIVED` — grouping follows from document structure
   - `INFERRED` — grouping based on naming patterns, structural adjacency, or operational assumption

6. **Output contract.** CSR JSON with confidence levels, flagged ambiguities, low-confidence items marked for review, derivation_source referencing evidence passages.

7. **Review gate.** Mandatory human review when: (a) any domain has ALL INFERRED classifications; (b) component count per domain exceeds 15; (c) multiple plausible groupings exist; (d) overall DIRECT_EVIDENCE ratio falls below 50%.

8. **Governance boundaries.** 75.x bounded interpretive authority. Extracting component groupings from explicit document statements = allowed. Inferring organizational intent from architecture = prohibited.

9. **BlueEdge retroactive validation.** Given BlueEdge's 3 HTML source files, can the specified process reproduce the 17 domains (or a recognizable equivalent)? Deviations must be explainable.

10. **Input quality gate.** Evidence quality → expected output quality mapping:

| Evidence quality | Compiler output | Expected Q-class |
|---|---|---|
| Architecture docs with explicit component inventory + business-purpose descriptions | High-confidence CSR, majority DIRECT_EVIDENCE | Q-01 or Q-02 |
| Architecture docs with component inventory but no business-purpose descriptions | Medium-confidence CSR, mix of DIRECT_EVIDENCE and DERIVED | Q-02 |
| Minimal documentation, structural information only | Low-confidence CSR, majority INFERRED, extensive review required | Q-03 |
| No component-level documentation | Compiler REJECTS — insufficient evidence | Q-04 |

When evidence is insufficient, the rejection report tells the client what documentation to produce. The rejection is itself a valuable deliverable.

### Phase 4: CROSSWALK_AUTO_DERIVATION_SPECIFICATION.md (D-4)

Produce crosswalk auto-derivation specification per D-4 requirements. Explicitly reference SQO document 06 §4 (generalized compilation orchestration) for the parameterized compile_correspondence.js interface.

### Phase 5: MARKETPLACE_IMPACT_ASSESSMENT.md (D-5)

**Corrected impact model:**

| Dimension | Before (v1 — manual advisory) | After (v3 — SQO-coupled compiler) |
|---|---|---|
| Per-client effort | Days-weeks (manual construction) | Hours (compiler + review) |
| Advisory role | Semantic analyst (constructs CSR) | Evidence curator + semantic reviewer |
| Scaling constraint | Advisory team capacity | Evidence quality from client |
| Tier 1A readiness | Blocked until advisory team scales | Unblocked — compiler-driven |
| Onboarding lifecycle | New parallel process | SQO's existing 6-stage intake loop |
| "Built today" claim | "PATH B requires manual per-client work" | "PATH B requires per-client evidence + governed derivation within SQO" |
| Commercial friction | High (weeks before LENS) | Low (docs → compiler → review → LENS) |

### Phase 6: HARDCODING_FIX_SPECIFICATIONS.md (D-6)

Three fixes with approach + effort:
1. DOM-04 → manifest-declared `passthrough_dom` field (LOW)
2. flagshipBinding.js defaults → environment-configurable (TRIVIAL)
3. compile_blueedge_correspondence.js → parameterized CLI per SQO document 06 §4 (MEDIUM)

### Phase 7: Vault Propagation (G1 obligation)

| Order | Vault File | Mutation |
|---|---|---|
| 1 | `vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md` | Add "Client Semantic Registry" definition. Assess "Semantic Derivation Compiler" for locking. |
| 2 | `vault/03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE.md` | Add section on PATH B generalization via semantic derivation compiler |
| 3 | `vault/03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION.md` | Add cross-reference to crosswalk auto-derivation spec |
| 4 | `vault/04_SQO_AND_QUALIFICATION/SQO_EVOLUTION.md` | Add Stage 3 specification cross-reference. Add S0→S1 gate formalization reference. Note SQO anti-pattern correction (§4.3). |
| 5 | `vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md` | Add Client Onboarding Substrate section (SQO Stage 3 specified) |

### Phase 8: Post-Flight and Closure

Produce M-1 through M-4. CLOSURE.md includes §10 Architecture Memory Propagation with full mutation delta.

---

## 7. Validation Criteria (24 checks)

| # | Check |
|---|---|
| V-01 | GAP_ASSESSMENT.md classifies every LENS traceback artifact |
| V-02 | GAP_ASSESSMENT.md quantifies generalization ratio |
| V-03 | GAP_ASSESSMENT.md documents the impact chain for Client C |
| V-04 | GAP_ASSESSMENT.md incorporates SQO prior art (document 02) |
| V-05 | CSR spec defines JSON schema with confidence_per_classification field |
| V-06 | CSR spec documents CEU analogy AND disanalogy |
| V-07 | CSR spec classifies as SPECIFIED_NOT_IMPLEMENTED |
| V-08 | CSR spec formalizes S0→S1 gate conditions |
| V-09 | Compiler spec defines input evidence contract with minimum quality gate |
| V-10 | Compiler spec defines component extraction process |
| V-11 | Compiler spec defines capability and domain classification rules |
| V-12 | Compiler spec defines 3-level confidence model (DIRECT_EVIDENCE / DERIVED / INFERRED) |
| V-13 | Compiler spec defines output contract (CSR JSON with confidence + flagged ambiguities) |
| V-14 | Compiler spec defines review gate triggers |
| V-15 | Compiler spec addresses 75.x governance boundaries |
| V-16 | Compiler spec includes BlueEdge retroactive validation requirement |
| V-17 | Crosswalk spec defines auto-derivation interface |
| V-18 | Crosswalk spec specifies human review gate |
| V-19 | Crosswalk spec addresses irresolvability detection |
| V-20 | Marketplace assessment reflects compiler-driven effort model |
| V-21 | Hardcoding fix specs cover DOM-04, flagshipBinding, compile_blueedge |
| V-22 | No terminology collision with TERMINOLOGY_LOCK.md |
| V-23 | CLOSURE.md §10 Architecture Memory Propagation complete |
| V-24 | No standalone lifecycle defined — all onboarding maps to SQO's existing 6-stage model |

---

## 8. Key Input Files

| File | Role |
|---|---|
| `scripts/pios/41.1/build_semantic_layer.py` | Source of the gap — lines 39-196 contain BlueEdge-specific Python literals |
| `clients/blueedge/sqo/evidence/` | BlueEdge's original source HTML files — required for retroactive validation |
| `app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js` | DOM-04 hardcoding at line 283 |
| `app/execlens-demo/lib/lens-v2/flagshipBinding.js` | BlueEdge defaults at lines 31-32 |
| `app/execlens-demo/lib/lens-v2/manifests/index.js` | Manifest registry (already parameterized) |
| `app/execlens-demo/lib/lens-v2/SemanticCrosswalkMapper.js` | Already generalized |
| `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js` | Already generalized |
| `app/execlens-demo/lib/lens-v2/SemanticActorHydrator.js` | Already generalized |
| `app/execlens-demo/lib/sqo-cockpit/SQOCockpitStateResolver.js` | SQO state resolver — S0→S1 gate integration point |
| `app/execlens-demo/lib/sqo-cockpit/SQOCockpitArtifactLoader.js` | SQO artifact loader — 31 keys, manifest-driven |
| `docs/pios/PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/02_BLUEEDGE_SPECIFIC_DEPENDENCY_INVENTORY.md` | Prior art — BlueEdge-specific dependency inventory |
| `docs/pios/PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/04_SEMANTIC_EVIDENCE_INTAKE_LOOP.md` | **SQO's authoritative 6-stage intake loop** |
| `docs/pios/PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01/06_MULTI_CLIENT_RECONCILIATION_LIFECYCLE.md` | **SQO's authoritative 7-state client lifecycle** |
| `docs/pios/vault/00_START_HERE/OPERATIONAL_ONTOLOGY.md` | Master operational chain |
| `docs/pios/vault/03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION.md` | Crosswalk detail |
| `docs/pios/vault/03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE.md` | PATH B identity — vault propagation target |
| `docs/pios/vault/04_SQO_AND_QUALIFICATION/SQO_EVOLUTION.md` | SQO state machine |
| `docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md` | Term collision check |
| `clients/blueedge/client.yaml` | Per-client config pattern |
| `scripts/pios/run_client_pipeline.py` | 9-phase orchestrator (already parameterized) |

---

## 9. Dependencies

| Dependency | Status |
|---|---|
| OPERATIONAL_ONTOLOGY.md in vault | EXISTS (2026-05-17) |
| CROSSWALK_AND_RECONCILIATION.md staleness fix | COMPLETE (2026-05-17) |
| PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01 | COMPLETE — authoritative lifecycle |
| Marketplace strategy frozen | FROZEN (2026-05-17) |
| build_semantic_layer.py | EXISTS at `scripts/pios/41.1/` |
| BlueEdge source HTML evidence files | MUST VERIFY existence at execution time |
| SQOCockpitStateResolver.js | EXISTS — S0→S1 gate integration target |

---

## 10. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Compiler specification overpromises — not all clients will have sufficient documentation | HIGH | Input quality gate is a first-class specification concern. Compiler REJECTS insufficient evidence. The rejection report is itself valuable. |
| BlueEdge retroactive validation fails — compiler spec cannot reproduce 17 domains | MEDIUM | Acceptable deviation expected (original was ad-hoc). Spec must define "recognizable equivalent." |
| 75.x governance boundaries ambiguous for document comprehension | MEDIUM | Spec draws clear line: extracting from explicit document statements = allowed. Inferring business strategy from architecture = prohibited. |
| SQO anti-pattern correction misread — compiler interpreted as "universal semantic compiler" | MEDIUM | §4.3 explicitly distinguishes: bounded scope, quality gates, confidence model, review gates, governance boundaries. Not universal. |
| Crosswalk auto-derivation algorithm proves wrong at implementation | MEDIUM | Specify interface (inputs/outputs/confidence) not internal algorithm |
| "Built today" claim correction perceived as strategy contradiction | HIGH | Frame as clarification: PATH A is built; PATH B now has a specified governed derivation process within SQO |
| Scope creep into implementation | LOW | Strict discipline: no code, no runtime changes |
| Evidence quality variance across future clients | HIGH | 4-tier evidence quality classification handles explicitly. Low evidence = honest Q-class, not fabricated intelligence. |

---

## 11. §5.5 Assessment

NOT REQUIRED — this stream produces architectural specification, not reusable code primitives.

---

## 12. Future Implementation Streams (Identified)

This specification stream identifies the following implementation work for future streams:

| Future Stream | Scope | Dependency | SQO Stage |
|---|---|---|---|
| Semantic Derivation Compiler | Build the compiler per D-3 specification. Validate against BlueEdge retroactively. | D-3 | Stage 3 mechanism |
| CSR Infrastructure | Generalize build_semantic_layer.py to read from CSR JSON. Extract BlueEdge data as first CSR instance. | D-2 | Stage 3 artifact schema |
| Crosswalk Auto-Derivation | Build the auto-derivation engine per D-4 specification | D-2 + D-4 | Stage 3→4 bridge |
| Hardcoding Fixes | DOM-04 parameterization, flagshipBinding defaults, compile_correspondence parameterization | D-6 | Infrastructure |
| SQO S0→S1 Gate | Formalize the onboarding gate in SQOCockpitStateResolver with CSR artifact as gate condition | D-2 §S0→S1 | Stage 5 (qualification) |

---

## 13. Revision History

| Version | Date | Change |
|---|---|---|
| v1 | 2026-05-18 | Initial contract — framed Phase 3 as "irreducibly human" advisory construction. Standalone 8-phase onboarding lifecycle. |
| v2 | 2026-05-18 | Corrected architecture — BlueEdge's 17 domains were Claude-derived from evidence documents, not human-crafted. Phase 3 reframed to governed semantic derivation compiler with review gate. New D-3 (SEMANTIC_DERIVATION_COMPILER_SPECIFICATION.md). Advisory role corrected from constructor to reviewer. Effort model revised from days/weeks to hours. |
| v3 | 2026-05-18 | **SQO-coupled.** Dropped standalone onboarding lifecycle (D-5 in v2) — SQO's existing 6-stage intake loop and 7-state client lifecycle are authoritative. Added §4 SQO Coupling with deliverable mapping, S0→S1 gate formalization, and SQO anti-pattern correction. Stream reframed from parallel onboarding substrate to SQO Stage 3 specification. 7 deliverables → 6. 26 validations → 24 (removed lifecycle-specific, added SQO coupling checks). SQO prior art documents added to key inputs and pre-flight. |
