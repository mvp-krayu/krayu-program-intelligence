# Terminology Lock

> **Authoritative definitions of all architectural terms. Use these. Do not reinterpret.**

---

## Locked Terms

### HYDRATED

**Definition:** The state where semantic reconstruction has achieved high internal coherence and operational usefulness, but without complete structural grounding proof for every semantic claim.

**Status:** CANONICAL — named in strategic roadmap, operationalized in LENS v2.

**What it is NOT:** A degraded state. A staging area. A placeholder for "real" grounding.

### PATH A

**Definition:** The structural grounding path — the concern of proving semantic claims have structural backing in vault anchors, topology reports, or verified registries.

**Status:** CANONICAL — active operational terminology.

### PATH B

**Definition:** The semantic reconstruction path — the concern of producing operationally useful intelligence from evidence, even when complete structural proof is unavailable.

**Status:** CANONICAL — active operational terminology.

### SQO

**Definition:** Semantic Qualification Operations — the qualification state machine that assesses operational maturity of client semantic data.

**Status:** CANONICAL — active runtime component.

### S-State (S0, S1, S2, S3)

**Definition:** Qualification states in the SQO state machine.
- S0: NO_QUALIFICATION
- S1: ONBOARDING_REQUIRED
- S2: QUALIFIED_WITH_DEBT
- S3: AUTHORITY_READY (not yet implemented)

**Status:** CANONICAL — deterministic from data.

### Q-Class (Q-01, Q-02, Q-03, Q-04)

**Definition:** Governance qualification classification based on grounding level.
- Q-01: Fully grounded
- Q-02: Partially grounded (disclosure required)
- Q-03: Semantic only (full disclosure)
- Q-04: Unqualified

**Status:** LOCKED (Q02_GOVERNANCE_AMENDMENT.md).

### Vault (Structural Evidence)

**Definition:** In the current system, "vault" means structural evidence backing — vault anchors provide structural proof for semantic claims.

**WARNING:** This is NOT the Obsidian vault navigation concept from the snapshot era. See [[SEMANTIC_COLLISIONS]].

**Status:** CANONICAL — active operational concept.

### Overlay

**Definition:** A governed modification to semantic state — a change to domain labels, grounding status, or qualification claims that goes through an approval corridor.

**Status:** CANONICAL — operational but prototype-stage.

### Corridor

**Definition:** A governed execution pathway. Two types:
- **Evidence corridor:** How evidence enters the system
- **Runtime corridor:** How SQO manages overlay activation/rollback

**Status:** CANONICAL — active operational concept.

### Crosswalk

**Definition:** The translation layer between technical domain identifiers (DOM-XX) and human-readable business labels. Uses semantic_continuity_crosswalk.json.

**Status:** CANONICAL — active operational component (SemanticCrosswalkMapper).

### DOM (DOM-01 through DOM-17)

**Definition:** Semantic domain identifiers. Descended from PIE vault 17-domain model.

**Status:** CANONICAL — active in crosswalk mapper.

### DPSIG

**Definition:** Deterministic signal family for executive intelligence projection.

**Status:** CANONICAL — active signal infrastructure.

### LENS v2

**Definition:** The cognitive operational intelligence surface. An interactive structural intelligence instrument with persona-based projection, topology exploration, evidence traversal, and governed investigation flows. Supersedes ExecLens panel model and the prior static report rendering identity.

**Status:** CANONICAL — active runtime surface, operational cognition transition complete (2026-05-14).

### ExecLens

**Definition:** The original panel-based traversal runtime surface. Superseded by LENS v2 + SQO Cockpit.

**Status:** HISTORICAL — directory name preserved (`app/execlens-demo/`) but runtime superseded.

### PIE Vault

**Definition:** The original 17-domain, 42-capability, 89-component semantic inventory (Stream 41.2).

**Status:** HISTORICAL — ancestor of current DOM model.

### Runtime Semantic Operations Substrate

**Definition:** The unified operational model that consolidates all SQO semantic primitives (qualification, reconciliation, debt, analytics, intake, replay/certification, projection) into one coherent runtime substrate with explicit ownership boundaries, propagation contracts, orchestration phases, and stabilization rules.

**Status:** CANONICAL — operational runtime component.

### Propagation Contract

**Definition:** An explicit declaration of how data flows between SQO ownership domains. Each contract specifies source domain, target domain, artifacts consumed, artifacts produced, and flow direction (DOWNSTREAM or CONVERGENT).

**Status:** CANONICAL — 7 contracts defined in RuntimeSemanticOperationsSubstrate.

### Ownership Boundary

**Definition:** An explicit declaration of which SQO ownership domain controls which artifacts, engines, compilers, and projections. Mutations to artifacts within a domain are authorized only by that domain's mutation authority.

**Status:** CANONICAL — 8 ownership domains defined in RuntimeSemanticOperationsSubstrate.

### Operational Semantic Reconciliation Loop

**Definition:** The explicit operational lifecycle model that governs how newly submitted semantic evidence enters SQO, progresses through intake registration, enrichment eligibility, reconciliation rerun, debt recalculation, qualification reprojection, and runtime propagation. Models semantic improvement as an operational lifecycle with deterministic phase sequencing and replay-safe rerun chains.

**Status:** CANONICAL — operational runtime component.

### Reconciliation Rerun Orchestration

**Definition:** Deterministic sequencing of compilation reruns triggered by new evidence or upstream artifact changes. Defines entry points (FULL_RERUN, FROM_RECONCILIATION, FROM_DEBT, FROM_PROJECTION, PROPAGATION_ONLY) with explicit script ordering and phase coverage.

**Status:** CANONICAL — 5 rerun orchestration modes defined in ReconciliationLoopOrchestrator.

### Semantic Lifecycle Transition

**Definition:** A governed state change within the operational semantic reconciliation loop. Each transition has explicit from/to states, guard conditions, and trigger types (OPERATOR, COMPILATION, ASSESSMENT, AUTOMATIC). Terminal states end the improvement cycle.

**Status:** CANONICAL — 13 transitions defined in ReconciliationLoopOrchestrator.

### Runtime Propagation Chain

**Definition:** The explicit artifact-to-artifact update chain that defines how changes propagate from new evidence through to consumer surfaces. A 7-step chain from evidence_file → semantic_evidence_intake → reconciliation_correspondence → reconciliation_lifecycle → semantic_debt_index → reconciliation_temporal_analytics → runtime_qualification_projection → runtime_semantic_operations_substrate.

**Status:** CANONICAL — 7-step chain defined in ReconciliationLoopOrchestrator.

### Investigative Authority

**Definition:** The governance authority layer between DETERMINISTIC (pure rendering) and INTERPRETIVE (75.x authorized synthesis). Permits topology-derived guided traversal: surfacing connected domains via topology edges, exposing pressure zones via structural adjacency, traversing evidence lineage, presenting temporal deltas between measured epochs. Selection criteria are topology-derived, not inference-derived. Does NOT permit inference, recommendation, prioritization, or prediction.

**Status:** CANONICAL — governance concept introduced by Phase 5 roadmap (2026-05-14).

### Interpretive Authority

**Definition:** The governance authority layer above INVESTIGATIVE that permits bounded evidence-synthesized interpretation under explicit 75.x authorization. Allows executive narrative synthesis, domain grounding explanation, blockage pattern explanation, movement/trend explanation, and pattern-matched bounded query responses. All interpretive outputs must trace to structural evidence and be disclosure-wrapped. Does NOT permit team behavior inference, organizational intent inference, human motive interpretation, cultural diagnosis, leadership quality interpretation, management effectiveness assessment, personnel attribution, behavioral prediction, organizational sentiment, causal attribution to humans, remediation prioritization, or ranked next actions.

**Status:** CANONICAL — governance concept introduced by Phase 5B.0 governance gate (2026-05-15).

### Persona Projection

**Definition:** The system's mechanism for projecting the same structural truth at different cognitive depths. Four personas (BOARDROOM, EXECUTIVE_BALANCED, EXECUTIVE_DENSE, INVESTIGATION_DENSE) represent distinct executive cognition modes, not display variants. Persona gates evidence deterministically — it selects depth, not content.

**Status:** CANONICAL — operational in LENS v2 (2026-05-13).

### Structural Cognition

**Definition:** The user's mode of interaction with LENS v2. The user thinks through the topology — clicking domains, tracing edges, following propagation chains — rather than querying or reading reports. Structural cognition means the interface is a thinking instrument, not an information display.

**Status:** CANONICAL — operational identity term (2026-05-14).

### Topology Interaction

**Definition:** Interactive SVG topology with hover, click-to-highlight, zone anchor selection, and cross-highlighting between graph and domain registry. The topology graph is the primary interaction surface — not a visualization but the structural cognition instrument through which the user navigates evidence.

**Status:** CANONICAL — operational in LENS v2 (2026-05-13).

### Evidence Traversal

**Definition:** The interaction pattern of tracing from any signal or domain backward through the full evidence chain to structural source. Signal → Pressure Zone → Origin Domain → Structural Evidence → Source Path. Every interactive path traces to structural evidence.

**Status:** CANONICAL — operational interaction pattern (2026-05-13).

### Guided Structural Investigation

**Definition:** The Phase 5A capability class. The user investigates by navigating structure: clicking domains, traversing edges, tracing lineage, expanding evidence chains, observing temporal drift. The system surfaces structural connections based on navigation position under investigative authority. The primary interaction model for Program Intelligence — structural exploration, not conversational querying.

**Status:** CANONICAL — planned (Phase 5A roadmap complete, implementation pending).

### PI Runtime Layer

**Definition:** A transversal governed interrogation capability that operates across all four LENS v2 cognitive modes under 75.x bounded interpretive authority. PI Runtime Layer is NOT a fifth mode — it is a second axis (Interaction Authority) orthogonal to the existing Cognitive Runtime axis. It enables structural depth escalation: deeper structural investigation that emerges from evidence-derived conditions, not from user-initiated AI activation.

**Aliases:** PI Runtime, PI Interrogation

**Status:** CANONICAL — active operational concept (2026-05-16).

**What it is NOT:** A copilot. An assistant. A chatbot. An AI feature. A freeform query surface. Always-on. A replacement for the guided deterministic lattice.

### Interaction Authority

**Definition:** The second axis of the LENS v2 cognitive architecture. Three tiers: passive (base rendering), guided (5B.1 deterministic queries), escalated (5B.3 structural depth — PI Runtime Layer). Interaction Authority is orthogonal to Cognitive Runtime (BOARDROOM/BALANCED/DENSE/INVESTIGATION).

**Status:** CANONICAL — active operational concept (2026-05-16).

### Transversal Interrogation

**Definition:** An interrogation capability that spans all cognitive modes rather than being confined to a single mode. The PI Runtime Layer is the first transversal interrogation implementation. "Transversal" means the capability operates across the Cognitive Runtime axis without being mode-specific.

**Status:** CANONICAL — active operational concept (2026-05-16).

### Program Intelligence

**Definition:** The overarching discipline and category name. The practice of applying governed structural intelligence to program execution assessment. Program Intelligence is the category that contains all Krayu products and capabilities — it is not itself a product name.

**Status:** CANONICAL — category identity (2026-05-17).

**What it is NOT:** A product. A brand. A software tool. It is the discipline within which GEIOS, PiOS, LENS, SQO, and Marketplace operate.

### GEIOS

**Definition:** Governed Executive Intelligence Operating System. The operating architecture that unifies all governed structural intelligence capabilities into a cohesive, enterprise-deployable executive intelligence platform. GEIOS is the governing frame around PiOS, LENS, SQO, and Marketplace — it emerged through Path B and ecosystem maturation as the name for an architectural reality that the runtime implementation had already substantially achieved.

**Status:** CANONICAL — operating architecture (2026-05-17).

**What it is NOT:** A runtime. A product surface. A layer the user sees. GEIOS is never directly exposed as a product capability. It is the reason the product works, never the product itself.

**Architectural note:** GEIOS codified an emergent operational reality rather than inventing a disconnected theoretical architecture. The runtime implementation achieved many GEIOS outcomes before the GEIOS framework was formally specified (11 foundation streams + 1 capstone, 183 safety rules, 9-layer stack). PiOS remains historically canonical as the original Program Intelligence Operating System; GEIOS is the broader governing architecture that emerged later.

### Productization Bridge

**Definition:** The formal architectural contract defining what crosses the GEIOS substrate → LENS surface boundary. Establishes that GEIOS owns intelligence production and LENS owns intelligence presentation.

**Status:** CANONICAL (principle) / SUPERSEDED (mechanism) — The bridge *principle* (substrate never exposed directly to executive surface) is permanently in force. The bridge *mechanism* (6 rendering adapters: ReadinessBadge, SignalCard, DomainEvidence, Narrative, Propagation, Explainability) was superseded by the cognitive zone architecture that emerged as the actual implementation path. GenericSemanticPayloadResolver + zone derive functions are the canonical bridge implementation. (2026-05-17)

**Reference:** `docs/psee/PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01/GEIOS_LENS_PRODUCTIZATION_BRIDGE.md`

### PMO Bundle

**Definition:** The first commercial Program Intelligence package. Targets Enterprise PMOs, Transformation Offices, and CTO Organizations. Six functional modules: Topology Intelligence, Execution Qualification, Propagation Intelligence, Executive Cognitive Projection, Governance Integrity, Operational Investigation Workspace.

**Status:** CANONICAL — commercial package definition (2026-05-17).

### Marketplace

**Definition:** The extension ecosystem that enables third-party and first-party capability extension on governed rails. Includes semantic signal packs, industry overlays, governance templates, and integration adapters.

**Status:** CANONICAL — future capability, not yet implemented (2026-05-17).

### Signäl

**Definition:** The market-facing product family brand. All verticalized operational intelligence packages carry the Signäl prefix (Signäl/PMO, Signäl/Engineering, etc.). Signäl packages consume governed structural intelligence from the PiOS substrate and project it through LENS for specific buyer verticals.

**Status:** CANONICAL — frozen product brand (2026-05-17).

**What it is NOT:** The platform. The substrate. The category. Signäl is the product family name, not the discipline (Program Intelligence) or the architecture (GEIOS/PiOS).

**Brand hierarchy:** Program Intelligence (category) → GEIOS (hidden architecture) → Signäl (product family) → LENS (foundational projection shell) → Signäl/PMO, Signäl/Engineering (verticalized packages).

### Execution Blindness

**Definition:** The named market problem. Enterprises operating with incomplete or distorted visibility into actual program execution behavior. Tools show work items. Structure is hidden. The gap between what tools represent and what actually exists is where execution risk compounds.

**Status:** CANONICAL — market problem naming, frozen (2026-05-17).

**Source:** `docs/program-intelligence-framework/program_intelligence_pyramid.md`

### Structural Execution Visibility

**Definition:** The canonical solution wedge — what Program Intelligence provides to counteract Execution Blindness. Reconstructed structural execution topology with governed confidence boundaries. Encompasses topology reconstruction, propagation intelligence, qualification posture, evidence-bound confidence, and multi-persona projection.

**Status:** CANONICAL — frozen wedge identity (2026-05-17).

**What it is NOT:** Prediction. Prescription. Autonomous governance. AI copilot capability. It is a structural mirror with governed confidence boundaries.

### STATIC Capability (Capability Classification)

**Definition:** Structural intelligence capabilities that are CANONICAL_RUNTIME_ACTIVE today: topology reconstruction, propagation intelligence, qualification posture (S-state + Q-class), signal activation, and evidence-bound projection. STATIC capabilities assess current structural state without temporal comparison.

**Status:** CANONICAL — capability classification, frozen (2026-05-17).

### TEMPORAL Capability (Capability Classification)

**Definition:** Structural intelligence capabilities requiring execution signal families not yet implemented: posture drift detection, run-over-run comparison, execution dynamics. TEMPORAL capabilities require EXSIG (SPECIFIED_NOT_IMPLEMENTED) and TIMSIG (FUTURE_DECLARED).

**Status:** CANONICAL — capability classification, frozen (2026-05-17).

**Critical rule:** TEMPORAL capabilities MUST NOT be marketed, claimed, or implied as current capability. STATIC and TEMPORAL are mutually exclusive classification labels.

### Implementation Lane

**Definition:** A governed execution scope for marketplace development work. Three lanes defined: Canonical Execution Lane (PATH A + PATH B frozen, modification prohibited), Marketplace Experimentation Lane (projection-only authority, no substrate mutation), Substrate Evolution Lane (isolated G1 with promotion protocol). Each lane has explicit protected scope, allowed scope, and forbidden scope.

**Status:** CANONICAL — governance concept, frozen (2026-05-17).

**Reference:** `docs/governance/MARKETPLACE_IMPLEMENTATION_LANE_DISCIPLINE.md`

### Client Semantic Registry (CSR)

**Definition:** The canonical per-client semantic authority source that defines a client's DOMAIN model (business domains, capabilities, components). The PATH B equivalent of the CEU registry for PATH A. CSR is the ontology; `semantic_topology_model.json` is a derived artifact generated FROM the CSR.

**Status:** CANONICAL — PARTIAL (2026-05-18). Semantic Derivation Compiler can produce candidate CSR from evidence. Promotion to canonical CSR remains human-governed.

**Critical distinctions:**
- **Semantic Ontology Authoring** (CSR construction) = human/governed process. NOT AI-discoverable.
- **Semantic Topology Generation** (from CSR) = deterministic computation. Automated once CSR exists.
- **Semantic Derivation** (candidate CSR from evidence) = governed AI-assisted process via Semantic Derivation Compiler. Output is CANDIDATE with L3 ceiling.
- CSR is decoupled from any specific generation tool (`build_semantic_layer.py` is one current generator).

**Source:** `docs/pios/PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01/CLIENT_SEMANTIC_REGISTRY_SPECIFICATION.md`

### Semantic Derivation Compiler

**Definition:** The governed AI-assisted compiler that fills SQO Stage 3 (Semantic Construction). Transforms structured evidence documents (HTML) into candidate CSR with confidence scoring (DIRECT_EVIDENCE / DERIVED / INFERRED), evidence tracing, review gating, and SQO authority ceiling (L3). A 7-phase pipeline: evidence gate → parse → extract → group → classify → score → review queue → emit.

**Status:** CANONICAL — operational (2026-05-18).

**Governance invariants:**
- AI proposes, never self-authorizes. Output is always `review_status: "CANDIDATE"`.
- Compiler NEVER writes to canonical CSR path. Output to `clients/{client}/psee/runs/{run}/semantic/compiler/`.
- Qualification ceiling: L3. DIRECT_EVIDENCE derivation confidence does NOT imply L5 authority.
- Explicit opt-in required (`--enable-semantic-derivation` flag).
- Evidence gate rejects insufficient evidence BEFORE any AI invocation.

**Shape independence:** The compiler does NOT target any specific domain/capability/component cardinality. BlueEdge's 17/42/89 is a certified reference outcome, not a universal model, target topology, success constraint, or forced ontology shape. For new clients, all dimensions may differ.

**Source:** `docs/pios/PI.SUBSTRATE.SEMANTIC-DERIVATION-COMPILER.01/`

### Operator Authority Workflow

**Definition:** The governed mutation surface within SQO that enables operator-driven authority progression. 12 discrete actions (review, promotion, insufficiency, crosswalk, reconciliation, arbitration) executed through a single governed POST endpoint with append-only event lineage and mutation safety protocol.

**Status:** CANONICAL — operational (2026-05-19).

**What it is NOT:** An automated promotion pipeline. A chatbot. An AI decision-maker. The operator authority workflow requires explicit human action for every mutation. System actors are rejected at the non-automatable boundary.

### Semantic Disposition

**Definition:** The classification of operational meaning for each authority action event. A governed taxonomy that records the nature of each operator action in the event lineage:

- OPERATIONAL_ACCEPTANCE — bounded operational acceptance for qualification progression (NOT semantic truth)
- OPERATIONAL_REJECTION — bounded operational rejection within authority scope
- CONTESTED — active semantic disagreement between reviewers or between reviewer and evidence
- PARTIAL_ACCEPTANCE — operator accepts part of a semantic grouping but contests other aspects
- ARBITRATION_ESCALATION — escalation to higher authority due to competing reviewer outcomes
- INSUFFICIENCY_DETERMINATION — governed operational determination that evidence does not support further progression
- QUALIFICATION_ADVANCEMENT — approved qualification state transition
- QUALIFICATION_DENIAL — denied qualification state transition
- QUALIFICATION_REQUEST — request for qualification state transition
- STRUCTURAL_ACCEPTANCE — acceptance of structural translation (crosswalk/reconciliation)

**Status:** CANONICAL — operational taxonomy (2026-05-19).

### Operational Acceptance

**Definition:** The bounded determination by an authorized operator that a semantic interpretation is accepted for qualification progression purposes within their authority scope. This is NOT semantic truth validation — it is a governed operational decision within bounded authority.

**Status:** CANONICAL — label discipline term (2026-05-19).

**Forbidden synonyms:** Semantic Truth, Validated Meaning, Confirmed Semantics, Approved Intelligence.

### Non-Automatable Boundary

**Definition:** A governance enforcement rule that prevents system actors (actor_id starting with "system:") from executing authority actions. Seven boundaries defined: no system actor can promote, elevate authority, resolve reviews, accept crosswalks, close reconciliation, advance S-state, or override insufficiency. This ensures human governance authority is never bypassed by automated processes.

**Status:** CANONICAL — governance enforcement (2026-05-19).

### Permanent Insufficiency

**Definition:** A governed operational determination that the current evidence state does not support further qualification progression, and that this determination is permanent rather than temporary. When permanent insufficiency is acknowledged: blockers are NOT deleted, obligations are NOT fake-resolved, the action records a deliberate governance posture, and unresolved semantic limitations are preserved as evidence of the insufficiency.

**Status:** CANONICAL — valid terminal state (2026-05-19).

**What it is NOT:** A failure mode. A bug. A timeout. An error state. Permanent insufficiency is a first-class governance posture — systems may remain at S1 indefinitely by design.

### Contested State

**Definition:** An obligation state representing active semantic disagreement. Five first-class contested/disputed states:
- CONTESTED — active semantic disagreement between reviewers or between reviewer and evidence
- ARBITRATION_REQUIRED — competing reviewer outcomes requiring escalation to higher authority
- PARTIAL_ACCEPT — operator accepts part of a semantic grouping but contests other aspects
- DISPUTED — formal disagreement recorded, resolution pending
- UNRESOLVABLE — semantic interpretation cannot be determined from available evidence

These are first-class obligation states alongside UNRESOLVED, RESOLVED, REJECTED. The workflow is NOT linear/binary.

**Status:** CANONICAL — obligation state model (2026-05-19).

### Qualification Posture

**Definition:** The derived operational posture of a client's qualification state, computed deterministically from promotion state, qualification blockers, and runtime capabilities. Eight states in priority order:

1. PERMANENTLY_UNQUALIFIABLE — permanent insufficiency acknowledged
2. INSUFFICIENT_EVIDENCE — temporary insufficiency (revisitable)
3. QUALIFIED — S2 or S3 qualification achieved
4. RECONCILIATION_ACTIVE — reconciliation in progress
5. CROSSWALK_ACTIVE — semantic intake complete, crosswalk construction required
6. QUALIFICATION_PENDING — review obligations exist, unresolved
7. SEMANTIC_INTAKE — candidate CSR available, structural onboarding complete
8. STRUCTURAL_ONLY — structural topology only, no semantic authority

**Status:** CANONICAL — operational runtime concept (2026-05-19).

**What it is NOT:** An S-state. A Q-class. A user-assigned label. Qualification Posture is derived from operational data by QualificationPostureResolver — it is not stored, configured, or manually set.

### Client-Scoped Resolution

**Definition:** The runtime isolation mechanism that ensures each client receives only its own data. ClientScopedSectionResolver is the single dispatch gate — it checks runtime capabilities, verifies client identity before calling any loader, and returns fail-closed (SECTION_NOT_AVAILABLE) when data does not exist for the requested client/run.

**Status:** CANONICAL — operational runtime enforcement (2026-05-19).

**Critical rule:** Hardcoded BlueEdge loaders are ONLY callable when `client === 'blueedge'`. Non-BlueEdge clients NEVER receive BlueEdge data. There is no fallback dataset, no default client, no shared cache. Violation of this rule is a trust violation.

### Semantic Intake

**Definition:** The operator-facing qualification intake section (previously labeled "Semantic Candidates"). Shows qualification posture, intake summary, qualification blockers, lane status, and next governed actions — NOT raw extraction tables. Layer B rendering for non-BlueEdge clients; Layer A (extraction table) preserved for BlueEdge.

**Status:** CANONICAL — operational section label (2026-05-19).

**What it is NOT:** A raw data dump. A compiler telemetry view. An engineering debug surface. Semantic Intake is the operator projection of qualification intake state.

### resolveOperatorWorkflow

**Definition:** The V2 cockpit's center of gravity. A single server-side resolver that computes the full qualification workflow state from raw promotion data, qualification blockers, review obligations, event lineage, runtime capabilities, and section availability. Returns a deterministic `WorkflowState` object containing currentPosture, primaryGuidance, blockerSummary, obligationSummary, evidenceState, availableActions (12), nextPossibleStates, progressionPath (6 steps), roleProjection (5 roles), availableDrilldowns (tier2+tier3), isTerminal, and terminalReason.

**Status:** CANONICAL — operational resolver (2026-05-19).

**What it is NOT:** A page. A component. A visualization. It is the computation that all V2 rendering is a deterministic projection of.

### V2 Cockpit

**Definition:** The workflow-driven SQO qualification operating system. Replaces the artifact-driven 15-section flat cockpit (V1) with a posture-first, workflow-first operational surface where the primary object is qualification progression state, not pages/artifacts/sections. V2 runs under `/v2/` route prefix — zero V1 collision.

**Status:** CANONICAL — operational runtime surface (2026-05-19).

**Key architectural properties:**
- 3-tier navigation: Tier 1 (Operational Spine: overview + authority, always visible), Tier 2 (Qualification Detail: 5 capability-dependent sections), Tier 3 (Forensic Investigation: 8 sections, collapsed by default)
- Session-level declarative RBAC role: 5 roles (operator/reviewer/domain_authority/promotion_authority/audit_authority) as React state, not URL. SSR with operator (broadest), client-side recomputation via computeWorkflowProjection
- 12-action visibility: all governed actions always visible regardless of role. Unavailable actions show reason + required_role + authority_level. Hidden controls are WRONG.
- Posture dominates: 2-second legibility standard. System determines what matters, not user navigation.

### WorkflowRoleProjection

**Definition:** Client-side role recomputation primitive. Pure function (`computeWorkflowProjection`) that re-filters a WorkflowState for a different RBAC role without server round-trip. Embeds ROLE_ACTION_MAP and ACTION_AUTHORITY as constants. Consumed by OperationalCockpitShell for session role changes.

**Status:** CANONICAL — operational client-side primitive (2026-05-19).

### Primary Guidance

**Definition:** The "What do I do next?" element of the workflow state. A single-line headline with urgency classification (critical/actionable/informational/terminal) derived from qualification posture and obligation state. When unresolved obligations exist AND the current role can act on them, guidance overrides to obligations regardless of posture.

**Status:** CANONICAL — operational workflow concept (2026-05-19).

### Legacy Qualification Bridge

**Definition:** The canonical migration pattern for converting pre-SQO computational qualification systems into SQO-native governed qualification. The bridge creates governance metadata (promotion workflow artifacts) through deterministic projection from valid legacy evidence — it does NOT recompute qualification, mutate evidence, fabricate historical events, or invent operator reviews that never occurred.

**Status:** CANONICAL — operational migration pattern (2026-05-20).

**What it is NOT:** Historical reconstruction. Evidence mutation. Qualification recomputation. The bridge creates governance scaffolding only — the distinction between governance projection and historical reconstruction is formally documented in LEGACY_QUALIFICATION_BRIDGE_DOCTRINE.md.

**Source:** `docs/pios/PI.SQO.LEGACY-QUALIFICATION-BRIDGE.01/LEGACY_QUALIFICATION_BRIDGE_DOCTRINE.md`

### Governance Projection

**Definition:** The migration mechanism used by the Legacy Qualification Bridge. Creates truthful governance scaffolding representing the current operational state from valid legacy evidence. The migration event is a single governance event documenting the bridge — not a series of fabricated reviews, acceptances, or promotions. All projected artifacts carry `migration_provenance` metadata with `type: "GOVERNANCE_PROJECTION"`, `fabricated_history: false`. System actors (`system:governance_projection`) are used — never fabricated human operator IDs.

**Status:** CANONICAL — migration mechanism (2026-05-20).

**Distinction from Historical Reconstruction:**
- Governance Projection: single migration bridge event, `system:governance_projection` actor, migration timestamps, explicit provenance, reversible
- Historical Reconstruction: multiple fabricated events, fabricated operator actors, fabricated dates, hidden fabrication, irreversible — PROHIBITED

### Remediation Workflow

**Definition:** A generic workflow projection computed for any client at S2 (Qualified with Debt) posture with active qualification blockers. Describes the governed remediation path from current S2 state to S3 Authority Ready. Contains remediation stages (e.g., Continuity Restoration, Grounding Expansion, S3 Eligibility), source material requirements, affected domain lists, and S3 eligibility gate checklist. Computed by `resolveRemediationWorkflow` from blocker data — null when posture is not QUALIFIED or blockers are zero.

**Status:** CANONICAL — operational workflow concept (2026-05-20).

**What it is NOT:** A fixed sequence. A BlueEdge-specific construct. A manual plan. Remediation stages are derived from blocker lane classification. Different clients with different blocker profiles produce different stage compositions.

### Portable Onboarding Contract

**Definition:** The canonical 7-step specification for onboarding an arbitrary GitHub repository into governed S1 qualification. Steps: Client Registration (client.yaml) → Source Intake (archive + extraction) → Source Manifest Registration → Pipeline Execution (11-phase orchestrator) → SQO Governance Projection (S0→S1) → LENS Manifest Registration → Verification. The contract ensures any GitHub repository can produce a deterministic structural substrate, governed SQO S1 posture, and stable cockpit representation without BlueEdge-specific dependencies.

**Status:** CANONICAL — operational onboarding specification (2026-05-20).

**What it is NOT:** An automatic process. A self-service API. A single-command tool. Each step is governed and produces auditable artifacts. S2 promotion is explicitly out of scope — requires semantic remediation runtime not yet stabilized.

### Structural Relevance Class (SRC)

**Definition:** A deterministic classification of a structural node's architectural role, based on path-pattern matching. 9 classes: CORE_SOURCE, TESTING, CONFIG, DOCUMENTATION, INFRASTRUCTURE, GENERATED, TOOLING, VENDOR, OTHER.

**Status:** CANONICAL — active operational concept (2026-05-20).

**Significance tiers:**
- **PRIMARY** (CORE_SOURCE only): Enters DOM layer, generates pressure zones, drives signal computation. The ONLY class that produces architectural surfaces.
- **SUPPORT** (TESTING, CONFIG): Retained for CEU/evidence context. Excluded from DOM/pressure derivation.
- **PERIPHERAL** (everything else): Excluded from all downstream structural computation.

**What it is NOT:** Semantic classification. AI-assisted inference. Content-based analysis. SRC is pure path-pattern deterministic classification.

### Filtered Topology (40.2r / 40.3r)

**Definition:** Derived views of 40.2 (node inventory) and 40.3 (topology log) containing only PRIMARY-significant nodes/edges. 40.2r is the input for DOM/pressure derivation when available. 40.2 and 40.3 remain untouched — filtered views are separate artifact classes in separate subdirectories.

**Status:** CANONICAL — active operational artifact class (2026-05-20).

**What it is NOT:** A replacement for 40.2/40.3. The full unfiltered inventory is preserved for CEU grounding and other consumers that need exhaustive structural data.

### Code-Graph Artifact (40.3s)

**Definition:** A generic code-graph structural enrichment artifact that captures resolved import relationships, class/function definitions, and unresolved symbolic inheritance evidence extracted from source code. 40.3s is produced by any code-graph indexer (ast, SCIP, Jedi) through an indexer-neutral schema. It enriches the structural topology (40.3/40.3r) with relationships that path-based scanning cannot produce.

**Status:** CANONICAL — prototype validated, pipeline integration pending (2026-05-20).

**Enrichment stack:**
- 40.3 = full structural topology (CONTAINS + regex IMPORTS)
- 40.3r = filtered structural topology (PRIMARY nodes only)
- 40.3s = code-graph structural enrichment (resolved IMPORTS + structural symbol evidence)

**What it is NOT:** Semantic authority. Semantic derivation. A replacement for 40.3 or 40.3r. An SCIP-specific artifact. 40.3s is structural evidence produced by deterministic code analysis — it occupies the same structural evidence plane as 40.3/40.3r.

### Code-Graph Structural Enrichment

**Definition:** The enrichment layer that 40.3s represents — additive structural evidence from code analysis (import resolution, class/function definitions, symbolic inheritance). Code-graph structural enrichment produces relationships that are invisible from filesystem topology alone (e.g., which files import from which other files). The enrichment is indexer-neutral — any tool that can parse source code and produce the 40.3s schema contributes to this layer.

**Status:** CANONICAL — operational concept (2026-05-20).

**What it is NOT:** Semantic enrichment. AI-assisted classification. Content-based inference. Code-graph structural enrichment is deterministic code analysis producing structural evidence.

### INHERITS_UNRESOLVED

**Definition:** A relationship type in 40.3s representing symbolic inheritance evidence — a class declares a base class by name, but the target file providing that base class is NOT cross-file resolved. This is unresolved symbolic evidence, not resolved inheritance authority. Cross-file resolution would require a richer indexer (e.g., SCIP).

**Status:** CANONICAL — relationship type in code-graph structural enrichment (2026-05-20).

**What it is NOT:** Resolved inheritance. Cross-file authority. Semantic truth. INHERITS_UNRESOLVED records that class X declares base class name Y — it does NOT prove which file provides Y.

### Structural Centrality Artifact (40.3c)

**Definition:** A normalized centrality evidence artifact derived from 40.3s code-graph relationships. Contains per-file centrality metrics (in-degree, out-degree, structural throughput proxy), structural role classification, centrality ranking, and false-positive centrality risk catalog. 40.3c is EVIDENCE-ONLY — it does not influence DOM, pressure, SQO, semantic derivation, or any downstream consumer.

**Status:** CANONICAL — operational artifact class, pipeline Phase 3.7 (2026-05-20).

**What it is NOT:** Projection authority. DOM weighting input. Pressure zone input. Semantic authority. A ranking of "importance." 40.3c records structural centrality evidence; interpretation of that evidence for projection requires a separate governed stream.

### Structural Role Classification

**Definition:** A deterministic first-match-wins classification of each file's structural role within the import graph. Seven roles in priority order: ENTRYPOINT (main entry, zero inbound), RE_EXPORT_HUB (`__init__.py` pass-through), RUNTIME_SPINE (high in-degree, defines classes), UTILITY_HUB (high in-degree, functions or passive data), INTERFACE_BOUNDARY (defines symbols, rarely imported), ISOLATED_LEAF (zero connectivity), VALIDATION_SUPPORT (fallback — moderate connectivity).

**Status:** CANONICAL — operational taxonomy in 40.3c (2026-05-20).

**What it is NOT:** Semantic classification. AI-assisted inference. Content-based analysis. Structural role classification is deterministic from import graph metrics and path patterns.

### Normalized Centrality Score

**Definition:** Degree centrality normalized by `degree / (N - 1)` where N = file count. Standard graph-theoretic normalization producing values in [0.0, 1.0] regardless of project size. Enables within-project comparison of structural centrality without project-size bias. Does NOT enable cross-project comparison (that requires a population reference).

**Status:** CANONICAL — normalization method in 40.3c (2026-05-20).

**What it is NOT:** A percentile rank. A cross-project comparison metric. An importance score. Normalized centrality is a structural metric, not a judgment of value.

### Semantic Proposition Engine (SPE)

**Definition:** The governed semantic derivation engine that produces semantic_proposition spine objects from PATH A structural artifacts (centrality, topology, code graph, CEU reconciliation, hero moments). SPE runs alongside the Semantic Derivation Compiler (SDC) — SPE consumes PATH A structural evidence, SDC consumes HTML documentation. They are parallel, not sequential. SPE output is always CANDIDATE with L3 authority ceiling.

**Status:** CANONICAL — operational (2026-05-21). Pipeline Phase 3c.

**What it is NOT:** A replacement for the SDC. An AI-first pipeline. A CSR producer. SPE produces semantic_propositions (spine objects), not CSR taxonomy entries. It is deterministic-first with an optional AI-gated INFERRED tier.

**Source:** `scripts/pios/spe/` (9 modules) + `scripts/pios/semantic_proposition_engine.py` (orchestrator)

### Semantic Proposition

**Definition:** A governed structural claim derived from PATH A evidence, modeled as a canonical spine object class. Each semantic proposition carries: proposition text, derivation tier (DIRECT_EVIDENCE / DERIVED / INFERRED), confidence score (0.0–1.0), authority ceiling (L3), proposition class, CEU references, structural references, evidence anchors, replay corridor references, derivation rationale, and reconciliation state.

**Status:** CANONICAL — spine object class, OPERATIONAL (NetBox: 75 propositions, 2026-05-21).

**What it is NOT:** Semantic truth. An assertion of fact. A recommendation. Semantic propositions are governed structural claims at CANDIDATE status requiring operator review for any progression.

### Proposition Class

**Definition:** The structural derivation category of a semantic proposition. Six classes:
- **STRUCTURAL_DOMINANCE** — centrality gravitational dominance within a CEU domain (DIRECT_EVIDENCE)
- **COUPLING_PATTERN** — cross-domain import entanglement between CEUs (DIRECT_EVIDENCE)
- **AUTHORITY_TOPOLOGY** — dual structural authority (import vs inheritance) detection (DERIVED)
- **TIER_GROUNDING** — CEU tier grounded to structural evidence and reconciliation state (DIRECT_EVIDENCE or DERIVED)
- **HERO_MOMENT_GROUNDING** — semantic interpretation of structural hero moments (DERIVED)
- **CLUSTER_ARCHITECTURE** — topology cluster CEU distribution analysis (DERIVED)

**Status:** CANONICAL — 6 classes locked (2026-05-21).

### Derivation Lineage Semantic Type

**Definition:** The semantic classification of each derivation lineage event, recorded as `semantic_type` on the lineage event (NOT as a spine class). Four types:
- **GROUNDING** — proposition directly grounded in structural evidence
- **RELATIONSHIP** — proposition captures inter-CEU or inter-cluster structural relationship
- **CONFLICT** — derivation encountered contradictory evidence (recorded, not suppressed)
- **REFINEMENT** — proposition refines or narrows a prior derivation based on additional evidence

**Status:** CANONICAL — lineage field values (2026-05-21).

**What it is NOT:** A spine class. The 8 canonical spine classes are LOCKED. Semantic sub-types are modeled within derivation lineage, not as spine classes. This keeps the spine schema clean while preserving rich semantic classification within the derivation record.

## Term Usage Rules

1. **Use locked definitions exactly.** Do not paraphrase, simplify, or reinterpret.
2. **"Vault" always means structural evidence backing** in current context. Never Obsidian navigation.
3. **HYDRATED is not degraded.** Never describe it as deficient, incomplete, or waiting for real grounding.
4. **Q-class is deterministic.** It is computed from grounding ratio, not assigned by judgment.
5. **PATH A and PATH B are complementary.** Never describe them as competing.

## Cross-References

- [[SEMANTIC_COLLISIONS]] — terms with conflicting meanings
- [[DEPRECATED_TERMS]] — terms that should not be used
- [[VAULT_SEMANTIC_MUTATION]] — how terms evolve
