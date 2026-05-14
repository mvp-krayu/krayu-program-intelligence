# Strategic Roadmap — SQO / PATH-B / Semantic-Grounding Ecosystem

**Stream:** PI.SQO.STRATEGIC-ROADMAP-AND-LAYER-RECONCILIATION.01
**Status:** STRATEGIC ARTIFACT — NON-EXECUTABLE
**Date:** 2026-05-12

---

## 1. Strategic Problem Statement

The system currently possesses significant semantic reconstruction capability, structural grounding infrastructure, and a maturing SQO governance runtime. But the boundaries between these capabilities are partially conflated, creating three risks:

**Risk A — Over-hardening.** Governance friction increases faster than operational value. Corridors, admissibility gates, and replay requirements accumulate without a clear picture of which ones deliver incremental trustworthiness vs. which ones slow execution velocity to zero.

**Risk B — Semantic destruction.** The system's strongest existing asset — rich, internally-coherent semantic reconstruction from ExecLens-era artifacts — gets treated as "ungrounded" and hidden behind governance walls, when in practice it is the most operationally useful output the system produces today.

**Risk C — Architectural blur.** "Semantic extraction," "crosswalk reconciliation," "structural grounding," "admissibility," and "qualification" are used in overlapping ways. The result is duplicate extraction logic, unclear state transitions, and confusion about what each layer actually guarantees.

The strategic objective is to separate these concerns cleanly, formalize what already exists as a legitimate intermediate state (HYDRATED), and establish a progression path that preserves semantic richness while incrementally increasing structural trustworthiness.

---

## 2. Existing Capability Inventory

### 2.1 Semantic Reconstruction (ExecLens Heritage)

**What exists:** The LENS v2 flagship surface renders a 15-actor semantic domain model hydrated from BlueEdge productized substrate. Each actor carries:
- business labels via SemanticCrosswalkMapper
- Q-class governance classification (Q-01 through Q-04)
- DPSIG signal stack projection
- grounding ratio computation
- semantic continuity validation

**Key modules:** SemanticActorHydrator, SemanticCrosswalkMapper, QClassResolver, DPSIGSignalMapper, BlueEdgePayloadResolver → GenericSemanticPayloadResolver

**Current state:** OPERATIONAL. The LENS v2 flagship page renders correctly for blueedge/run_blueedge_productized_01_fixed. Q-02 governance amendment locked. Backward compatibility preserved.

**Semantic richness level:** HIGH. The system produces domain-level business intelligence with signal-backed severity assessment, qualification-aware rendering, and executive-register language. This is the most commercially valuable output the system produces today.

### 2.2 Structural Grounding (PATH A / Vault)

**What exists:** Vault-backed structural claims, topology reports, CLU/DOM/CAP module registries. The grounding infrastructure is designed to provide structural backing for semantic claims.

**Current state:** PARTIAL. The grounding ratio computation exists and feeds Q-class resolution. Domains are classified as structurally-grounded or semantic-only. But the grounding pipeline is not yet fully automated — vault anchors exist for some domains, not all.

**Key gap:** Grounding is binary per-domain (grounded or not). There is no graduated grounding model that recognizes partial evidence or operator-verified structural correspondence.

### 2.3 SQO Governance Runtime

**What exists:** A comprehensive qualification state machine (S0→S3), overlay/replay/rollback governance, semantic debt classification, maturity scoring, progression readiness assessment, qualification journey resolution, and operational attention orchestration.

**Key modules:** SQOCockpitStateResolver (S-states), QualificationVisualStateResolver (severity classification), SQO overlay stack (18 engines), OperationalAttentionResolver, WorkflowDominanceResolver, CognitiveGroupingResolver, DeferredVisibilityResolver

**Route structure:** 12 cockpit sections (overview, debt, continuity, maturity, progression, evidence, handoff, corridor, evidence-ingestion, semantic-candidates, ceu-admissibility, evidence-rebase)

**Current state:** OPERATIONAL for BlueEdge (S2_QUALIFIED_WITH_DEBT) and FastAPI (S1_ONBOARDING_REQUIRED). Full replay verification, degradation handling, and fail-closed diagnostics.

### 2.4 Semantic Extraction Corridor

**What exists:** The evidence rebase extractor ingests 3 operator-provided HTML files (architecture specification, PMO dashboard, competitive dashboard), extracts semantic candidate signals via deterministic pattern matching, and evaluates Dynamic CEU admissibility. Source class governance enforces EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE only.

**Key modules:** ExplicitEvidenceRebaseExtractor.server.js (extraction + admissibility), adapter functions (loadRebasedCandidateData, loadRebasedAdmissibilityData)

**Current state:** OPERATIONAL. 3 evidence files → candidate extraction → admissibility evaluation → UPSTREAM_EVIDENCE_BOUND status. Previous chain marked PRE_REBASE_NON_AUTHORITATIVE.

### 2.5 Evidence Ingestion

**What exists:** BlueEdgeEvidenceIngestionLoader loads evidence registry artifacts, verifies hashes, and produces a read-only evidence manifest. EvidenceIngestionCorridorPanel renders the evidence set with provenance tracking.

**Current state:** OPERATIONAL but coupled to the pre-rebase artifact chain for some routes.

---

## 3. The HYDRATED State — Formal Definition

### 3.1 What HYDRATED Means

HYDRATED is the state where semantic reconstruction has achieved high internal coherence and operational usefulness, but without complete structural grounding proof for every semantic claim.

This is NOT a degraded state. It is a legitimate, productive state that recognizes:
- Semantic continuity from multiple corroborating sources has value
- Operational usefulness does not require structural proof
- Executive intelligence can be delivered honestly with qualification disclosure
- Progressive grounding can proceed without blocking semantic utility

### 3.2 HYDRATED Already Exists

The system already operates in HYDRATED state without naming it:

| Existing Artifact | HYDRATED Character |
|---|---|
| LENS v2 flagship 15-actor model | Semantically rich, Q-02 qualified (partial grounding) |
| Tier-1 semantic domain coverage | Full semantic reconstruction without structural proof |
| ExecLens-era topology reports | High-coherence semantic synthesis from structural observation |
| Crosswalk entity mappings | Semantic-to-business translation without vault anchoring |
| SQO S2 qualification state | "Qualified with debt" — operational but not fully grounded |

### 3.3 HYDRATED Governance Properties

| Property | Value |
|---|---|
| Admissible inputs | Operator-provided evidence, ingested evidence registries, semantic continuity validation, topology observations, crosswalk mappings |
| Governance limitations | Non-authoritative. No publication eligibility. No authority promotion without grounding gate. Q-02 or Q-03 maximum qualifier class |
| Allowed runtime visibility | Full executive surface rendering with mandatory qualification disclosure |
| Non-authoritative semantics | All semantic claims carry NON_AUTHORITATIVE_SEMANTIC_CANDIDATE or equivalent state |
| Mutation rules | Read-only projection. No grounding mutation. No authority assertion |

### 3.4 Transition Criteria

| Transition | Gate |
|---|---|
| HYDRATED → RECONCILED | Crosswalk reconciliation complete: semantic domains mapped to structural registries with correspondence evidence |
| RECONCILED → PARTIAL | At least one structural grounding anchor verified per semantic domain cluster |
| PARTIAL → STRONG | Majority of semantic domains structurally grounded with vault-backed evidence |
| STRONG → EXACT | All semantic domains structurally grounded; replay verification passed |
| EXACT → CERTIFIED | Governance certification issued; audit trail complete |
| CERTIFIED → AUTHORITY | Authority promotion gate passed; publication eligibility granted |

---

## 4. Crosswalk Reconciliation Strategy

### 4.1 Current State

The SemanticCrosswalkMapper translates DOM-XX technical labels to business labels using semantic_continuity_crosswalk.json. This is a unidirectional mapping (technical → business display). It does not currently bind semantic claims to structural evidence.

### 4.2 Required Evolution

Crosswalk reconciliation is the bridge between HYDRATED and RECONCILED. It requires:

**Step 1 — Registry Correspondence.** Map semantic domain clusters (DOM-01 through DOM-17) to structural registries (CLU modules, CAP capabilities, vault claims). This produces a correspondence table, not a proof.

**Step 2 — Evidence Binding.** For each correspondence, identify the strongest available evidence:
- Vault anchor exists → structural binding (toward PARTIAL/STRONG)
- Topology report confirms → observational binding (toward RECONCILED)
- Operator HTML evidence → upstream evidence binding (current HYDRATED)
- No evidence → explicitly UNMAPPED

**Step 3 — Graduated Confidence.** Replace binary grounding (grounded/not) with a graduated model:
- STRUCTURALLY_GROUNDED — vault-backed
- OBSERVATIONALLY_CORROBORATED — topology/crosswalk confirmed
- SEMANTICALLY_COHERENT — multiple semantic sources agree
- UPSTREAM_EVIDENCE_BOUND — operator evidence only
- UNMAPPED — no binding

### 4.3 Role of Existing Components

| Component | Role in Reconciliation |
|---|---|
| CLU / DOM registries | Structural target for semantic-to-structural binding |
| CAP capability registry | Capability-level structural anchoring |
| Vault anchors | Definitive structural proof (STRONG/EXACT grade) |
| Upstream HTML evidence | Operator-provided semantic source (HYDRATED grade) |
| Topology reports | Observational corroboration (RECONCILED grade) |
| Crosswalk mapper | Semantic label translation (display layer, not proof) |

---

## 5. Semantic Compiler Roadmap

### 5.1 What "Semantic Compiler" Actually Means

The term has been used loosely. Clarification:

**Semantic Compiler v0 (EXISTS NOW):**
The deterministic extraction pipeline in ExplicitEvidenceRebaseExtractor.server.js. It parses HTML, extracts candidates via regex pattern matching, classifies candidate types, maps domains via keyword lookup, and evaluates admissibility via structural compatibility rules. This is a deterministic grammar — not AI, not probabilistic. It compiles evidence into candidate signals.

**Deterministic Grammar Enrichment (NEAR-TERM):**
Extending v0 with additional extraction patterns, evidence source types, and structural compatibility rules. More patterns, same deterministic discipline. This is where the system should invest next.

**Crosswalk Reconciliation Compiler (MID-TERM):**
A compiler that takes HYDRATED semantic output + structural registries and produces a reconciliation report showing which semantic claims have structural correspondence. Deterministic. Auditable. The "compilation" is correspondence discovery, not inference.

**Agentic Domain Compilers (LONG-TERM / RESEARCH):**
LLM-backed semantic interpretation that can resolve ambiguous domain mappings, synthesize across evidence types, and produce reasoned semantic enrichment. This is multi-year research territory. It requires:
- Formal interpretation authorization (75.x stream activation)
- Governance-bounded agent execution
- Deterministic audit trail for every agentic decision
- Human-in-the-loop validation gates

### 5.2 Critical Distinction

The system must maintain a clear boundary between:

| Category | Character | Current State |
|---|---|---|
| Deterministic extraction | Pattern matching, keyword lookup, structural compatibility | EXISTS (v0) |
| Deterministic reconciliation | Registry correspondence, evidence binding | PLANNED |
| Agentic interpretation | LLM-backed semantic reasoning | RESEARCH |

Mixing these categories — treating agentic output as deterministic evidence — is the single most dangerous architectural mistake the system could make.

---

## 6. Productization Reality Check

### 6.1 What Is Achievable Near-Term (0–6 months)

| Capability | Status | Effort |
|---|---|---|
| LENS v2 executive surface for additional clients | Ready — GenericSemanticPayloadResolver + manifest-driven | Low |
| SQO cockpit for additional clients | Ready — manifest + artifact ingestion | Medium |
| Evidence rebase for additional evidence sources | Ready — extend extraction patterns | Low |
| Graduated Q-class model with disclosure | Exists (Q-01 through Q-04) | Done |
| Crosswalk enrichment with additional entity mappings | Ready — extend crosswalk JSON | Low |
| HYDRATED state formalization in governance | Documentation only | Low |

### 6.2 What Requires Sustained Engineering (6–18 months)

| Capability | Dependency | Risk |
|---|---|---|
| Crosswalk reconciliation compiler | CLU/DOM/CAP registry completeness | Medium — registries may be incomplete |
| Graduated grounding model | Vault infrastructure maturity | Medium — vault coverage varies by client |
| Multi-evidence-source extraction | Additional operator evidence types | Low — deterministic extension |
| SQO S3 authority chain | S2 debt remediation complete | Medium — depends on client engagement |
| Runtime corridor multi-client | Corridor abstraction from BlueEdge-specific | Medium |

### 6.3 What Is Multi-Year Research

| Capability | Character | Risk |
|---|---|---|
| Agentic semantic compilers | LLM-backed domain reasoning | HIGH — governance boundary unclear |
| Automated grounding discovery | AI-assisted structural correspondence | HIGH — fabrication risk |
| Self-healing semantic state | Autonomous reconciliation and correction | HIGH — mutation governance |
| Generalized SQO operating substrate | Industry-agnostic qualification engine | HIGH — abstraction premature |

### 6.4 What Must Remain Deterministic

- Q-class resolution
- S-state transitions
- Replay verification
- Admissibility evaluation
- Evidence hash verification
- Source class governance
- Extraction pattern matching
- Authority promotion gates

These are governance-critical operations. Making them probabilistic destroys the trustworthiness the system is designed to provide.

### 6.5 What Could Become Agentic (With Governance)

- Domain label resolution from ambiguous evidence
- Semantic enrichment suggestions (non-authoritative)
- Crosswalk gap identification
- Evidence quality assessment
- Natural language audit narrative generation

These are advisory operations where agentic output is explicitly marked as non-authoritative and requires human confirmation before affecting governed state.

---

## 7. Consolidated Execution Roadmap

### Phase 1 — Reconciliation Stabilization (Current → +3 months)

**Objective:** Formalize what exists. Name the HYDRATED state. Stabilize architectural boundaries.

| Deliverable | Description |
|---|---|
| HYDRATED state governance document | Lock definition, admissible inputs, transition criteria |
| Layer responsibility matrix | Formal mapping of which module owns which concern |
| Extraction/grounding/admissibility boundary clarification | Ensure no duplicate logic across corridors |
| SQO cockpit section rationalization | Assess which 12 sections represent distinct concerns vs. overlapping views |
| Pre-rebase extractor deprecation plan | Mark BlueEdgeSemanticCandidateExtractor and DynamicCEUAdmissibilityEvaluator as superseded |
| Evidence source type registry | Formalize which evidence source types are admissible at each grounding level |

### Phase 2 — Hydrated Semantic Maturity (+3 → +6 months)

**Objective:** Maximize operational value of the HYDRATED state. Multi-client onboarding. Semantic richness expansion.

| Deliverable | Description |
|---|---|
| Multi-client LENS v2 deployment | Additional clients via manifest-driven resolver |
| Multi-client SQO onboarding | FastAPI → S2 progression; new client S1 onboarding |
| Extraction pattern enrichment | Additional HTML patterns, PDF extraction, structured data ingestion |
| Crosswalk entity expansion | Expand semantic_continuity_crosswalk to cover all 17 domain clusters comprehensively |
| HYDRATED → RECONCILED gate implementation | Programmatic check for crosswalk correspondence completeness |
| Governance disclosure maturity | Refine executive-register language for Q-02/Q-03 surfaces |

### Phase 3 — Deterministic Grounding Expansion (+6 → +12 months)

**Objective:** Build the correspondence bridge from HYDRATED through RECONCILED to PARTIAL.

| Deliverable | Description |
|---|---|
| Crosswalk reconciliation compiler | Deterministic correspondence discovery: semantic domains → structural registries |
| Graduated grounding model | Replace binary grounding with five-level model |
| Vault binding automation | Programmatic vault anchor creation for confirmed structural correspondences |
| Q-class model extension | Q-02 sub-classification for different partial grounding levels |
| Evidence chain completeness reporting | Per-domain evidence coverage analysis |

### Phase 4 — Runtime Qualification Maturity (+12 → +18 months)

**Objective:** Mature SQO runtime toward S3 authority capability.

| Deliverable | Description |
|---|---|
| S3 authority chain | Full governance chain from HYDRATED through CERTIFIED |
| Overlay proposal corridor | Governed overlay generation from admissible candidates |
| Authority promotion protocol | Formal gate for CERTIFIED → AUTHORITY transition |
| Multi-client qualification parity | All onboarded clients at S2+ with clear S3 pathway |
| Publication eligibility framework | Define what AUTHORITY means for downstream surfaces |

### Phase 5 — Agentic Semantic Compilers (+18 → +36 months)

**Objective:** Introduce governed agentic capability for semantic operations that benefit from reasoning.

| Deliverable | Description |
|---|---|
| 75.x interpretation stream activation | Formal governance for agentic semantic operations |
| Governed agent execution framework | Deterministic audit trail, human confirmation gates |
| Domain label resolution agent | LLM-backed disambiguation for UNMAPPED_CANDIDATE domains |
| Evidence quality assessment agent | Advisory evidence strength evaluation |
| Crosswalk gap discovery agent | Automated identification of missing semantic-structural correspondences |

### Phase 6 — Generalized SQO Operating Substrate (+36 months →)

**Objective:** Abstract SQO from BlueEdge/fleet-specific semantics toward a generalized qualification operating model.

| Deliverable | Description |
|---|---|
| Industry-agnostic qualification engine | S-state machine parameterized by domain ontology |
| Pluggable evidence source adapters | Formalized evidence ingestion for arbitrary source types |
| Pluggable grounding backends | Vault, graph DB, or external structural authority |
| Pluggable semantic compilers | Domain-specific compilation rules as configuration |
| SQO-as-a-service architecture | Multi-tenant qualification runtime |

---

## 8. Strategic Directive Summary

The system's most commercially valuable asset is its semantic richness — the ability to produce executive-grade operational intelligence from imperfect, partially-grounded evidence. The architecture must protect this asset.

The path forward is NOT:
- "Make everything EXACT before rendering anything"
- "Add more governance gates until the system is trustworthy"
- "Replace semantic reconstruction with structural proof"

The path forward IS:
- Name what exists (HYDRATED) and make it legitimate
- Deliver operational value at every grounding level with honest disclosure
- Build incremental structural correspondence without blocking semantic utility
- Keep deterministic operations deterministic
- Introduce agentic operations only with explicit governance authorization
- Avoid premature abstraction — solve for BlueEdge, then generalize from real patterns
