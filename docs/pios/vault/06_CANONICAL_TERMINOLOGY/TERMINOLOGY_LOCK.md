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

### PSIG

**Definition:** Primary Structural Intelligence Signals. The first signal family — derives from the binding envelope topology (Phase 5 output). Measures architectural coupling pressure (fan_in), export pressure (fan_out), zone coverage concentration (surfaces_per_ceu), and isolation pressure (graph fragmentation). Computed by `run_end_to_end.py` (5 scripts in 75.x and 41.x). Sole structural input: `binding/binding_envelope.json`.

**Signals:** PSIG-001 (coupling_pressure), PSIG-002 (export_pressure), PSIG-004 (zone_coverage_concentration), PSIG-006 (isolation_pressure).

**Derivation level:** Level 2 — Architectural Binding Intelligence. All specimens with a binding envelope produce PSIGs.

**Status:** CANONICAL — active signal infrastructure, OPERATIONAL.

**Source:** [[../05_RUNTIME_AND_CORRIDOR/SIGNAL_FAMILY_TAXONOMY]]

### DPSIG

**Definition:** Derived Program Structural Intelligence Signals. Topology-native, client-agnostic signal family. Derives from `canonical_topology.json` (40.4) only — no binding, no 40.3s, no conformance artifacts. Currently Class 4 only (DPSIG-031 CPI, DPSIG-032 CFA). Classes 1-3, 5-8 reserved.

**Derivation level:** Topology-level (independent of Level 1 and Level 2).

**Status:** CANONICAL — active signal infrastructure, OPERATIONAL (Class 4).

### Signal Derivation Level

**Definition:** The abstraction layer at which a signal measures structural phenomena. Two levels plus one independent tier:

- **Level 1 — File-Topology Structural Intelligence:** Evidence from 40.3s code graph and 40.3c centrality. Population: individual source files (hundreds to thousands). Measures import hub pressure, fan asymmetry, centrality concentration, role distribution. Available for PATH A only. Signal families: ISIG, CSIG. Enters Level 2 through Phase 5 enrichment (IMPORTS_ACROSS edges) but with lossy compression (BlueEdge: 2,138 IMPORTS → 4 IMPORTS_ACROSS edges, 535:1 ratio). Level 1 intelligence is inherently SOFTWARE EXECUTION intelligence — it predicts change propagation risk, PR review complexity, deployment coordination cost.

- **Level 2 — Architectural Binding Intelligence:** Evidence from Phase 5 binding envelope. Population: architectural binding nodes (tens — DOM + CE + CS). Measures coupling pressure, export pressure, surface concentration, isolation. Available for ALL specimens with a binding envelope. Signal families: PSIG, BSIG. Level 2 intelligence is ARCHITECTURAL GOVERNANCE intelligence — it predicts domain coupling, capability distribution, governance gaps.

- **Topology level (independent):** DPSIG derives from 40.4 canonical topology. Independent of both Level 1 and Level 2.

**Level 1 and Level 2 are NOT interchangeable.** They measure different structural phenomena at different populations. Level 2 cannot reproduce Level 1 intelligence (population compression, edge abstraction, surface normalization). Both levels are necessary for complete structural cognition.

**Certified:** BlueEdge intelligence delta (2026-05-23) — generic Level 2 corridor produces MORE truthful cognition than historical Level 1 shortcut, except for one LOST_READ (PSIG-004 file-level hub concentration) which requires ISIG to resolve.

**Canonical doctrine:** [[../05_RUNTIME_AND_CORRIDOR/LEVEL_1_VS_LEVEL_2_SIGNAL_DOCTRINE]]

**Status:** CANONICAL — constitutional doctrine (2026-05-23).

### Signal Family

**Definition:** A named, governed collection of structural intelligence signals that derive from a single primary artifact and measure a specific structural phenomenon. Generic GENESIS families (PSIG, DPSIG, BSIG) are available to all specimens. Software Module families (ISIG, CSIG, ESIG) require code graph evidence (40.3s/40.3c).

**Registry:** [[../05_RUNTIME_AND_CORRIDOR/SIGNAL_FAMILY_TAXONOMY]]

**Status:** CANONICAL — classification model (2026-05-23).

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

**Definition:** The system's mechanism for projecting the same structural truth at different cognitive depths. Five personas (BOARDROOM, EXECUTIVE_BALANCED, EXECUTIVE_DENSE, OPERATOR, INVESTIGATION) represent distinct executive cognition modes, not display variants. Persona gates evidence deterministically — it selects depth, not content. Each persona operates under a locked Persona Mission Contract that defines its constitutional objective, consumed/prohibited cognition, and attention-control model.

**5-persona model (2026-05-29):** OPERATOR was recognized as an explicit persona after assessment revealed that INVESTIGATION_DENSE was functionally an engineering evidence inspection workspace, not a governed evidence verification surface. INVESTIGATION is constitutional but has no certified implementation yet — it will be designed from the compilation model. OPERATOR fills the cognitive gap between DENSE (structural behavior interrogation) and INVESTIGATION (evidence qualification and governed replay).

**Status:** CANONICAL — operational in LENS v2 (2026-05-13). Mission contracts locked (2026-05-29). OPERATOR boundary established (2026-05-29).

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

**Definition:** The governed ecosystem of domain cognition modules attached to the PI Spine. Each module interprets PI cognition primitives through domain-specific operational semantics. Domain cognition modules permeate all strata — they are not plugins, not optional add-ons, not feature extensions. They are the interpretation layer that gives PI Core structural intelligence domain-specific operational meaning. Software Intelligence is the first module — its execution bridge is verified (PR #16). Marketplace outputs (semantic signal packs, industry overlays, governance templates, integration adapters) are produced BY domain modules, not independent marketplace items.

**Status:** CANONICAL — constitutionally defined (2026-05-26). First module (Software Intelligence) operationally verified via SQO execution bridge (PR #16). Module ecosystem architecture defined.

**What it is NOT:** A plugin marketplace. An app store. An extension registry. Marketplace is domain cognition modules — replaceable interpretation layers that transform PI Core intelligence into domain-specific operational cognition.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01/MARKETPLACE_ARCHITECTURE.md`

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

### Governed Cognitive Replay Chronicle

**Definition:** A cognitive traversal instrument — not a report, not a document, not a hyperlinked filesystem. The chronicle is a LENS into governed cognition, rendering how a specimen's semantic lifecycle unfolded through controlled depth traversal (Z1-Z5 zoom levels). Each chapter implements a descent/ascent cycle: narrative orients → proof anchors → evidence grounds → comprehension ascends. The chronicle derives ALL narrative content from actual run artifacts — no fabricated data.

**Status:** CANONICAL — OPERATIONAL (BlueEdge run_blueedge_genesis_e2e_03: 57KB HTML, 8 chapters, Z1-Z5 zoom, REPLAY-CERTIFIED 62/62, 2026-05-23).

**What it is NOT:** A report replacing platform outputs. A generated webpage. Hyperlinked documentation. A filesystem explorer. The chronicle is a cognitive traversal orchestration through which an audience experiences governed cognition unfolding.

### Chronicle Certification

**Definition:** Deterministic verification of a governed cognitive replay lifecycle. 10 phases: artifact existence, governance lifecycle, proposition consistency, revalidation, constitutional anchor, enrichment, convergence, chronicle, promotion, cross-artifact consistency. Each phase contains multiple checks. All checks must PASS for REPLAY-CERTIFIED status.

**Status:** CANONICAL — OPERATIONAL (62/62 checks, chronicle_certification_rc09.py, 2026-05-23).

### Constitutional Replay Anchor

**Definition:** An 8-dimension semantic adequacy comparator that measures a candidate specimen's governance corpus against a reference specimen (currently NetBox). Dimensions: proposition_count, class_diversity, review_obligations, governance_friction, confidence_distribution, tier_diversity, governance_event_density, enrichment_activity. CONSTITUTIONAL_DISTANCE_ACCEPTABLE = all dimensions pass. Used as a gate before S-level advancement.

**Status:** CANONICAL — OPERATIONAL (BlueEdge 8/8 PASS at S2, 2026-05-23).

**What it is NOT:** A universal governance norm. The anchor uses a single reference specimen — conformity to that reference, not to abstract ideals. A third specimen may expose dimensions where the reference is atypical.

### Convergence Observation

**Definition:** A formal descriptive comparison between two specimens' governance patterns. All observations start at DESCRIPTIVE maturity — two specimens produce a comparison, not a pattern. Law-claims require additional specimens and governance review. Classification: convergences (patterns that hold across specimens), divergences (patterns that differ), mixed (convergence in mechanism, divergence in content).

**Status:** CANONICAL — OPERATIONAL (9 observations, 5 convergences, 3 divergences, 2 mixed, all DESCRIPTIVE, 2026-05-23).

**What it is NOT:** A unification claim. Convergence is OBSERVATIONAL — diversity within common governance IS the proof. Never claim generalized laws from two specimens.

### RESOLVED PAYLOAD

**Definition:** The altitude-neutral, validated, specimen-specific data bundle produced by resolution. Contains structural facts (domain registry, signal families, pressure zones, qualification state, governance lifecycle) without executive interpretation or persona-specific prose.

**Status:** PROPOSED — named in PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01. Not yet implemented as a distinct artifact.

**What it is NOT:** The same as `fullReport`. fullReport currently collapses resolved payload with projection objects and legacy compatibility fields.

### GOVERNED PROJECTION OBJECT

**Definition:** An altitude-aware, persona-consumable intelligence object produced by a projection compiler from the resolved payload. Contains semantic language appropriate to its target persona altitude, bounded interpretation under 75.x authority, proof references, and source lineage.

**Status:** PROPOSED — named in PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01. Not yet implemented.

**What it is NOT:** A display template. Projection objects contain governed intelligence, not layout instructions.

### INTERIM_RESOLVER_EMBEDDED_PROJECTION

**Definition:** Classification for projection work currently located inside GenericSemanticPayloadResolver instead of a projection layer. Code so classified works correctly but lives in the wrong architectural layer and will be extracted when the projection layer is built.

**Status:** ACTIVE — applied to boardroom_interpretation, signal caption maps, governance lifecycle projections (3dcf894).

### Software Intelligence

**Definition:** A domain cognition module attached to the PI Spine that provides operational software cognition — the interpretation of PI cognition primitives through software-system semantics. Software Intelligence transforms PI Core outputs from structurally correct but operationally abstract intelligence into domain-specific operational meaning. 10 cognition functions (CF-01 through CF-10) defined. Three proven operationally by PR #16: CF-06 Execution Governance (SQOActionEngine — 12-action authority workflow), CF-10 Engineering Qualification Cognition (OperatorWorkflowResolver — posture, guidance, progression), CF-08 Operational Attention Routing (LensSQOOrchestrationAdapter — guided actions with event-log-derived learning context). Remaining functions constitutionally defined with structural evidence in pipeline output but no consumer path.

**Status:** CANONICAL — constitutionally defined (2026-05-26), **OPERATIONAL** (2026-05-27). SQO execution bridge VERIFIED (PR #16). SignalSynthesisEngine produces 6 condition types from PSIG/DPSIG/ISIG signal families. 4-slice topology cognition language operational with evidence-bound overlays. Commercial module gating active (teaser when OFF, full cognition when ON). Current implementation boundary: GAP-01 through GAP-08 in SQO_GAP_REGISTER.md.

**What it is NOT:** Code metrics. GitHub analytics. Repository visualization. Taxonomy mapping. AI commentary. A separate product. Software Intelligence is a domain cognition module WITHIN Program Intelligence that permeates all strata.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01/CONSTITUTIONAL_DEFINITION.md`

### Domain Cognition Module

**Definition:** A replaceable interpretation layer attached to the PI Spine that provides domain-specific operational meaning to PI Core cognition primitives. The pattern is proven by PR #16: workspace resolver reads PI Core artifacts → orchestration adapter derives governed actions → authority engine executes mutations → learning derivation reads event log → LENS projects results. Domain modules permeate all 5 PI strata (evidence, derivation, projection, persona, governance). They are not attachment points — they are semantic embodiment layers that give structural intelligence operational meaning.

**Status:** CANONICAL — architectural pattern constitutionally defined (2026-05-26). Software Intelligence is the first module instance (SQO execution bridge verified by PR #16).

**What it is NOT:** A plugin. An extension. An optional add-on. A separate product. Domain cognition modules are the interpretation layer that makes PI Core intelligence actionable in a specific operational domain.

**Architectural pattern:** Same PI Core (~90%+) + domain-specific interpretation layer (~9%) + module registration infrastructure (~1%). Swapping the domain module changes operational vocabulary without changing PI Core computation. The execution bridge pattern (LENS → API → engine → persist → event → reload) is proven and reusable.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01/MARKETPLACE_ARCHITECTURE.md`

### Domain Cognition Engine Pattern

**Definition:** The canonical pattern by which Domain Modules provide VOCABULARY and RULES to a shared ENGINE. Discovered from forensic analysis of the SW-Intel cognition triad (CognitionOntology.js, SignalSynthesisEngine.js, ConsequenceCompiler.js). The formula is: DOMAIN MODULE = VOCABULARY × RULES × ENGINE. VOCABULARY (~27%) is authored semantic inventory (condition types, consequence types, combination patterns, ontology classes). RULES (~35%) is deterministic transformation logic (feature extraction, condition synthesis, consequence mapping). ENGINE (~32%) is domain-independent compilation machinery (deduplication, combination detection, compilation pipeline, relationship verb derivation, persona projection shapes).

**Status:** PROPOSED — governance review required for CANONICAL promotion (2026-06-04).

**Minimum Engine Boundary:** ~1060 lines (~32% of 3295-line triad) of domain-independent machinery. Of this, ~300 lines are pure engine (zero domain references). ~25 coupling points identified — all parameterizable, zero mechanism changes required for portability.

**Constitutional constraints (PROPOSED):**
- ENGINE is PI Core governed infrastructure (G1 authority) — modifications affect ALL domain modules
- VOCABULARY/RULES are Domain Module governed (G2 authority) — modifications affect single module only
- If a proposed Domain Module requires modifying the ENGINE to function, either the engine has a gap (G1 resolution) or the proposed module is not a valid Domain Module

**Relationship to Domain Cognition Module:** The Domain Cognition Engine Pattern reveals the internal structure of how Domain Modules operate. Domain Cognition Module defines WHAT a module is (interpretation layer). The Engine Pattern defines HOW modules provide their cognition (VOCABULARY + RULES to shared ENGINE). Extends, does not replace.

**What it is NOT:** A second engine. A refactoring proposal. A module framework. The pattern describes the separation already present in the code — ENGINE extraction is explicitly deferred until a second Domain Module is needed.

**Source:** `docs/pios/PI.DOMAIN-COGNITION-ENGINE-PATTERN.01/ENGINE_PATTERN.md`, `docs/pios/PI.DOMAIN-COGNITION-ENGINE-PATTERN.01/MINIMUM_ENGINE_BOUNDARY.md`

### SignalSynthesisEngine

**Definition:** The deterministic cognition compiler that transforms signal families (PSIG, DPSIG, ISIG) and structural enrichment into operational conditions with topology overlays. Contains 11 primitive rules and 1 composite rule. Each rule maps specific signal severity patterns or structural enrichment to a condition type with operator-facing cognition title, severity, topology overlay, evidence classification, and supporting signal IDs. The engine is deterministic — same inputs produce same conditions. 12 condition types total (11 internal — GOVERNANCE_COVERAGE_STATUS shares internal GCC/GCG).

**Primitive rules:**
- `ruleDeliveryPressureConcentration` → DELIVERY_PRESSURE_CONCENTRATION (from PSIG/pressure_zone_state)
- `ruleDependencyChokePoint` → DEPENDENCY_CHOKE_POINT (from ISIG import graph)
- `rulePropagationAsymmetry` → PROPAGATION_ASYMMETRY (from ISIG fan asymmetry)
- `ruleImportPressureConcentration` → IMPORT_PRESSURE_CONCENTRATION (from ISIG import hub)
- `ruleStructuralMassConcentration` → STRUCTURAL_MASS_CONCENTRATION (from DPSIG cluster metrics)
- `ruleEntrypointStabilityRisk` → ENTRYPOINT_STABILITY_RISK (from ISIG entrypoint centrality)
- `ruleExecutionFragility` → EXECUTION_FRAGILITY (from structuralEnrichment.fragility_surface — real cohesion from raw import edges)
- `ruleExecutionConstriction` → EXECUTION_CONSTRICTION (from structuralEnrichment.constriction_surface — Tarjan articulation points + through-flow scoring)
- `ruleStructuralBoundaryDivergence` → STRUCTURAL_BOUNDARY_DIVERGENCE (from structuralEnrichment.boundary_divergence — cross-boundary import ratio analysis per module)
- `ruleCouplingInertia` → COUPLING_INERTIA (from structuralEnrichment.coupling_inertia — union-find bidirectional cluster detection + density scoring)
- `ruleGovernanceCoverageStatus` → GOVERNANCE_COVERAGE_STATUS (from governed domain coverage analysis)

**Composite rule:**
- `ruleCompoundConvergence` → COMPOUND_CONVERGENCE (fires when ≥3 non-nominal primitives target same domain, escalates severity to CRITICAL)

**Status:** CANONICAL — OPERATIONAL (2026-05-30). 11 primitive rules + 1 composite. 4 ACCEPTED behavioral slices implemented (EF, EC, SBD, CI). Deterministic against GENESIS specimen (run_blueedge_genesis_e2e_03).

**What it is NOT:** An AI model. A recommendation engine. A scoring system. SignalSynthesisEngine is a deterministic compiler — signals in, conditions out, no inference.

**Source:** `app/execlens-demo/lib/lens-v2/SignalSynthesisEngine.js`

### Topology Cognition Language

**Definition:** The 9-slice topology cognition language through which LENS projects operational conditions onto the structural topology. The language has six distinct cognition categories — mixing them is a category violation.

**Cognition categories:**

| Category | Slices | Semantics | Visual Language |
|----------|--------|-----------|-----------------|
| **CORRIDOR COGNITION** | Slice 1 (Dependency Choke Point), Slice 2 (Propagation Asymmetry) | Directional — paths, flows, corridors between domains | Arrows, upstream/downstream, source/target, blast radius |
| **FIELD / STATE COGNITION** | Slice 3 (Pressure Zone), Slice 4 (Structural Mass) | Spatial — zones, mass, gravity, concentration within regions | Boundaries, emphasis, weight, composition, no corridors |
| **FRAGILITY / RESILIENCE COGNITION** | Slice 5 (Execution Fragility) | Bidirectional — localized weakness vs absorptive resilience | Fragmented-ring glyph, #ff6b6b overlay, hotspot emphasis, coupling/cohesion surface |
| **FLOW / CONSTRICTION COGNITION** | Slice 6 (Execution Constriction) | Throughput — narrow passage, bottleneck, articulation point | Hub glyph, #ffd700 overlay, constriction point emphasis, through-flow surface |
| **DRIFT / INSTABILITY COGNITION** | Slice 7 (Structural Boundary Divergence) | Organizational — declared vs actual dependency structure | Spread glyph, #ff9e4a overlay, boundary alignment surface, cross-boundary ratio |
| **COUPLING / INERTIA COGNITION** | Slice 8 (Coupling Inertia) | Accumulation — tightly-coupled clusters resist independent evolution | Coupling glyph, #b794f4 overlay, cluster density surface, bidirectional pair detection |

**Load-bearing distinction:** Corridor cognition answers "what connects to what and how does impact flow?" Field cognition answers "where does structural weight or pressure concentrate?" Fragility cognition answers "where does localized structural weakness amplify operational disruption?" Constriction cognition answers "where is operational flow forced through a narrow structural passage?" Drift cognition answers "where does declared organizational structure diverge from actual dependency structure?" Coupling cognition answers "where do tightly-coupled module clusters resist independent evolution?" Drawing corridors for cluster gravity or zone boundaries for propagation asymmetry is a category violation.

**Status:** CANONICAL — OPERATIONAL (2026-05-30). All 9 slices rendering with evidence-bound overlays (8 topology cognition slices + 1 governance coverage).

**What it is NOT:** Decorative visualization. Dashboard charts. The topology cognition language projects structural conditions onto the topology with evidence classification — every overlay carries proof of its derivation origin.

### Evidence Classification

**Definition:** The taxonomy classifying the evidence origin of each topology cognition overlay. Every overlay rendered in LENS must carry an explicit evidence classification. The classification enables the operator to assess the provenance and reliability of each projection.

**Classifications:**
- **EVIDENCE_DERIVED** — derived from semantic topology edges (e.g., IMPORTS_ACROSS relationships)
- **STRUCTURAL_CENTRALITY_DERIVED** — derived from code graph centrality metrics (40.3c)
- **PRESSURE_ZONE_DERIVED** — derived from `pressure_zone_state` artifact (compound zone analysis)
- **TOPOLOGY_METRIC_DERIVED** — derived from DPSIG topology distribution metrics (cluster node count ratios, fan asymmetry percentages)
- **STRUCTURAL_ENRICHMENT_DERIVED** — derived from structural enrichment computation (fragility_surface, constriction_surface, boundary_divergence, coupling_inertia from raw import edge analysis)
- **MIXED** — composite conditions with contributing primitives from heterogeneous evidence origins

**Status:** CANONICAL — OPERATIONAL (2026-05-30). All 4 ACCEPTED behavioral slices use STRUCTURAL_ENRICHMENT_DERIVED.

**Governance rule:** No visualization without evidence classification. If evidence is insufficient to support a topology behavior, the runtime downgrades or suppresses the projection — never fabricates. This is the evidence-bound cognition doctrine applied to topology projection.

### Three-Layer Architecture (Software Intelligence)

**Definition:** The architectural separation of Software Intelligence into three distinct layers with clear boundaries:

1. **PI Core (~90%+):** Domain-agnostic cognition primitives — topology, centrality, signals, pressure, SQO authority engine, governance lifecycle, replay, enrichment, personas. Truth layer.
2. **Orchestration-Agentic Runtime (~9%):** Guided actions, SQO workflow orchestration, event-log-derived learning, action routing. The layer between truth and domain cognition.
3. **Domain Cognition (~1%):** Domain-specific operational interpretation — SignalSynthesisEngine condition synthesis, topology cognition projection, module-specific legend and rendering. The interpretation layer.

**Status:** CANONICAL — architectural vocabulary (2026-05-27).

**Load-bearing rule:** Guided Actions belong to Orchestration-Agentic Runtime (Layer 2), NOT to Software Intelligence (Layer 3). Domain cognition modules consume PI Core truth and project through LENS — they do not orchestrate workflows or execute mutations.

### Signal Synthesis Rulebook

**Definition:** The governance document defining the deterministic rules by which SignalSynthesisEngine transforms signal families into operational conditions. Contains rule specifications, condition vocabulary, severity escalation rules, topology overlay contracts, and evidence classification requirements. The rulebook is the governance authority for condition synthesis — SignalSynthesisEngine is the implementation.

**Status:** CANONICAL — governance doctrine (2026-05-27).

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01/SIGNAL_SYNTHESIS_RULEBOOK.md`

### Module Gating

**Definition:** The commercial activation pattern for domain cognition modules. When a module is OFF, LENS renders a teaser (condition count, severity preview, top conditions) via `synthesizeTeaser()`. When ON, LENS renders full domain cognition via `synthesize()`. The toggle gates computation, not visibility — the teaser is a genuine preview of what the module would produce, not a placeholder.

**Status:** CANONICAL — OPERATIONAL (2026-05-27). Software Intelligence is the first gated module.

**What it is NOT:** A feature flag. A debug toggle. An A/B test. Module gating is the commercial activation boundary between teaser and full domain cognition.

### Consequence Class

**Definition:** An atomic operational implication dimension produced by the executive consequence compilation layer. Each consequence class represents a distinct operational meaning derived from topology cognition conditions: coordination fragility, dependency amplification, delivery exposure, operational bottleneck, resilience deficit, governance coverage gap, propagation exposure, structural stability risk. Consequence classes are cross-persona semantic objects — all four personas consume them at different compression depths.

**Status:** CANONICAL — constitutionally defined (2026-05-27). **OPERATIONAL** (2026-05-28). ConsequenceCompiler produces 8 primitive consequence types + 3 combination patterns. Cross-persona projection operational: forBoardroom() and forBalanced() produce persona-specific consequence projections. BALANCED governed composition consumes consequence output as SW-INTEL enhancement overlay.

**What it is NOT:** A condition summary. A shorter version of a topology cognition condition. A persona-specific object. Consequence classes are a different semantic class entirely — operational implications derived from structural evidence through deterministic mapping rules.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01/EXECUTIVE_CONSEQUENCE_SEMANTICS.md`, `app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js`

### Consequence Compilation

**Definition:** The deterministic mapping of topology cognition primitives (SignalSynthesisEngine conditions) into operational consequence objects. Consequence compilation pattern-matches over condition structures, evidence classification, and combination state to produce consequence classes with severity, confidence, scope, and three-layer vocabulary. Compilation is distinct from synthesis (which produces conditions from signals), summarization (which compresses existing content), and projection (which renders for personas).

**Status:** CANONICAL — constitutionally defined (2026-05-27). **OPERATIONAL** (2026-05-28). ConsequenceCompiler.js implements compile(), forBoardroom(), forBalanced(). Deterministic against GENESIS specimen (run_blueedge_genesis_e2e_03).

**What it is NOT:** Summarization. Interpretation. AI-generated commentary. 75.x interpretive authority. Consequence compilation operates at deterministic authority level.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01/EXECUTIVE_CONSEQUENCE_SEMANTICS.md`, `app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js`

### Combination Pattern

**Definition:** A named emergent consequence produced when multiple primitive consequence objects share a primary locus. Three patterns defined: AMPLIFIED_DEPENDENCY_FRAGILITY (pressure + choke point co-location), STRUCTURAL_GRAVITY_WELL (mass + pressure co-location), SYSTEMIC_OPERATIONAL_FRAGILITY (3+ independent conditions converging). Combination consequences are emergent — they produce operational meaning that no individual primitive can produce alone.

**Status:** CANONICAL — constitutionally defined (2026-05-27). **OPERATIONAL** (2026-05-28). All three combination patterns fire deterministically in ConsequenceCompiler when locus convergence conditions are met.

**What it is NOT:** A sum of individual consequences. A filtered view. Combination patterns produce NEW consequence objects that require convergence of independent evidence paths as a precondition.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01/EXECUTIVE_CONSEQUENCE_SEMANTICS.md`, `app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js`

### Consequence Scope

**Definition:** The structural extent of a consequence's claim. Three levels: LOCAL (single domain or file-level entity), REGIONAL (cluster or pressure zone), SYSTEMIC (cross-domain, system-level implication). Scope is orthogonal to severity — a LOCAL consequence can be CRITICAL, a SYSTEMIC consequence can be ELEVATED. SYSTEMIC consequences carry `primary_locus` (where evidence concentrates) distinct from `consequence_scope` (what the consequence claims about).

**Status:** CANONICAL — constitutionally defined (2026-05-27). **OPERATIONAL** (2026-05-28). ConsequenceCompiler assigns scope per consequence type definition.

**What it is NOT:** Severity. Importance. Priority. Scope describes how far the structural claim extends, not how operationally consequential it is.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01/EXECUTIVE_CONSEQUENCE_SEMANTICS.md`

### SW-INTEL Consequence Slice

**Definition:** A canonical, evidence-bound, replayable representation of a software-operational behavioral pattern derived from governed structural and/or consequence evidence. SW-INTEL consequence slices are L2 objects (Consequence Cognition) that classify governed behavioral patterns across the existing vocabulary hierarchy (signals → conditions → surfaces → consequence types). Topology cognition slices (the 4 MVP visual overlays) are the projection instances of SW-INTEL consequence slices — one concept projected visually, the other is the governed cognition object.

**Ontology classes:** Five categories — (A) Flow & Propagation, (B) Concentration & Saturation, (C) Fragility & Resilience, (D) Reinforcement & Accumulation, (E) Drift & Instability.

**Maturity classes:** FOUNDATIONAL (deterministic, directly evidence-bound, low interpretive risk) and ADVANCED (composite, multi-evidence, may require temporal comparison, higher governance burden).

**Promotion lifecycle:** CANDIDATE → SPECIMEN → FOUNDATIONAL → COMPOSABLE → CERTIFIED → DEPRECATED. No skip-level promotion.

**Status:** CANONICAL — governance doctrine defined (2026-05-28). Behavioral slice inventory locked (2026-05-30): MVP-9 across all 5 ontology classes. 5 FOUNDATIONAL (existing topology cognition slices + import pressure concentration). 4 ACCEPTED: Execution Fragility [Class C — **IMPLEMENTED**], Execution Constriction [Class A — **IMPLEMENTED**], Coupling Inertia [Class D — **IMPLEMENTED**], Structural Boundary Divergence [Class E — **IMPLEMENTED**]. 4/4 ACCEPTED implemented 2026-05-30. 0 remaining. 1 DEFERRED (Dependency Debt Accumulation — requires temporal evidence). All static-derivable.

**Governing rule (2026-05-30):** "The behavior is the slice. The graph metric is evidence." Every slice is defined by the operational behavior that emerges, not by the graph metric that detects it. A slice whose definition leads with a metric is not a slice — it is a signal.

**Accepted behavioral slices (2026-05-30):**
- **Execution Fragility** (Class C): Localized structural weakness amplifies operational disruption. Bidirectional resilience axis — fragile end (high coupling + low cohesion → disruption amplification) and absorptive end (low interface surface + high cohesion → disruption containment). First primary Class C slice.
- **Execution Constriction** (Class A): Operational flow forced through narrow structural passage, creating throughput ceiling. Path centrality behavior distinct from dependency concentration (betweenness vs in-degree).
- **Coupling Inertia** (Class D): Tightly-coupled module clusters resist independent evolution. Bidirectional coupling prevents independent change — velocity decays in proportion to cluster density. First primary Class D slice.
- **Structural Boundary Divergence** (Class E): Declared organizational structure diverges from actual dependency structure. Names and locations lie about relationships. First static-derivable Class E slice.

**What it is NOT:** A UI card. A prose paragraph. A persona-specific insight. A raw metric. A prompt-generated interpretation. Consequence slices are governed cognition objects, not rendering artifacts.

**Relationship to topology cognition slices:** The existing 4 topology cognition slices are the first 4 SW-INTEL consequence slices projected as topology overlays. This term does not rename them — it identifies the broader governed class they belong to.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01/SLICE_TAXONOMY_AND_GOVERNANCE.md`

### Persona Mission Contract

**Definition:** A constitutional specification that defines why a LENS persona exists, what cognitive gap it fills, what cognition it consumes and prohibits, how attention and agency are controlled, and what the runtime loses if the persona is removed. Persona mission contracts replace the prior tagline model ("What matters?" / "Why operationally?" / "How structurally?" / "Prove it.") with locked, mutually exclusive cognitive objectives. Each contract specifies 16 fields: constitutional objective, primary question, forbidden questions, operator objective, runtime responsibility, cognition consumed, cognition prohibited, attention-control model, operator-agency model, authority-projection model, success condition, failure condition, disappearance consequence, SW-INTEL ontology consumption posture, implementation freshness, and revalidation requirement.

**Five locked persona objectives:**
- **BOARDROOM:** Executive consequence qualification (compiled projection, system-controlled attention, lowest operator agency)
- **BALANCED:** Governed operational cognition briefing (emergence orchestration, co-discovery attention, medium operator agency)
- **DENSE:** Structural behavior interrogation (zone navigation, operator-controlled attention, highest operator agency)
- **OPERATOR:** Engineering evidence inspection and governance audit (evidence sections, operator-controlled attention, high operator agency)
- **INVESTIGATION:** Evidence qualification and governed replay (fixed evidence sequence, system-enforced attention, low operator agency) — constitutional, no certified implementation yet

**Status:** CANONICAL — governance baseline established (2026-05-29). OPERATOR boundary established (2026-05-29). Supersedes tagline model. Mandatory baseline for PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01.

**What it is NOT:** A rendering spec. A UI design. A persona description. A tagline. Mission contracts define cognitive objectives and consumed/prohibited cognition, not visual layout.

**Source:** `docs/pios/PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01/PERSONA_MISSION_CONTRACTS_AND_COGNITIVE_OBJECTIVES.md`

### OPERATOR Persona

**Definition:** The engineering evidence inspection persona within the LENS v2 5-persona cognitive projection system. OPERATOR exists to allow a technical operator to inspect raw evidence at full numeric precision (4-decimal signal values, evidence hash chains), audit governance lifecycle state (S-level, proposition corpus, enrichment, revalidation, certification), view inference prohibitions, and explore the forensic topology. OPERATOR fills the cognitive gap between DENSE (structural behavior interrogation — zone-navigated, 42 queries) and INVESTIGATION (evidence qualification and governed replay — fixed verification sequence, PASS/FAIL assertions).

**Origin:** Prior INVESTIGATION_DENSE implementation was assessed as functionally OPERATOR by PI.SOFTWARE-INTELLIGENCE.INVESTIGATION-PERSONA-ASSESSMENT.01 (Verdict A — Current INVESTIGATION = OPERATOR). The behavioral mismatch was unambiguous: mission contract defined LOW agency / SYSTEM-ENFORCED SEQUENCE, but implementation had HIGH agency / OPERATOR-CONTROLLED exploration. Boundary established by PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01.

**Key distinction from DENSE:** DENSE navigates structural behavior (topology, zones, overlays, propagation patterns). OPERATOR inspects evidence values (hashes, 4-decimal signals, governance tables). Different substrate, both high agency.

**Key distinction from INVESTIGATION:** OPERATOR inspects (shows values). INVESTIGATION verifies (asserts correctness). Different output type: data vs assertions.

**Status:** CANONICAL — officially recognized (2026-05-29). Implementation surfaces operational (transferred from prior INVESTIGATION_DENSE).

**What it is NOT:** INVESTIGATION. DENSE-with-more-detail. A temporary label. OPERATOR is a permanent persona with its own constitutional objective (engineering evidence inspection).

**Source:** `docs/pios/PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01/OPERATOR_AND_INVESTIGATION_BOUNDARY.md`

### Ontology-to-Consequence Compilation Chain

**Definition:** The canonical transformation model that defines how SW-INTEL ontology classes become consequence objects consumed by LENS personas. The chain is: Signals (L1) → Conditions (L2 truth) → Ontology Classification (L2) → Consequence Types (L2 truth) → Combination Patterns (L2 truth composition) → Persona Projections (L3 governed projection) → Rendering (L4). Truth generation stops at L2. L3 may project, sequence, compress, group, frame — but must not create new truth. The ConsequenceCompiler is a cognition transformer (not an intelligence generator): it transforms conditions into consequences into governed projections while preserving enough lineage to remain evidence-bound.

**Key architectural laws:**
- Truth generation stops at L2 (conditions, consequences, combinations)
- L3 persona projections may compress but not create
- BOARDROOM and BALANCED consume ontology exclusively through the compiler
- DENSE and OPERATOR consume substrate directly (INVESTIGATION will verify compilation chain)
- Combinations compile existing truth, they do not create new truth
- Severity escalation is a governed transformation with explicit tracing
- All compiler text comes from CONSEQUENCE_VOCABULARY — no freeform generation

**Status:** CANONICAL — compilation model locked (2026-05-29). Mandatory baseline for PI.INVESTIGATION.CONSEQUENCE-VERIFICATION-REVALIDATION.01.

**What it is NOT:** An implementation spec. A rendering pipeline. A data flow diagram. The compilation chain defines transformation semantics and evidence preservation rules, not module APIs or code structure.

**Source:** `docs/pios/PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01/ONTOLOGY_TO_CONSEQUENCE_COMPILATION_MODEL.md`

### PICP (Program Intelligence Cognition Package)

**Definition:** The canonical L4 runtime artifact — a deterministic, replayable, diffable, projection-independent package of structured cognition. Contains 9 cognition objects: structural_posture, tension_map, constraint_inventory, exposure_assessment, trajectory_assessment, decision_surface, absence_profile, competitive_intelligence, operational_ceiling. Produced by PICR from CIP. Consumed by PRE for audience-specific projection. The PICP exists BEFORE any audience decision — it is L4 cognition, not L5 rendering.

**Status:** CANONICAL — canonicalized (2026-05-31). Renamed from ECP (Executive Cognition Package) because 0/9 objects are executive-specific and 4/8 projection families serve non-executive audiences.

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### PICR (Program Intelligence Cognition Runtime)

**Definition:** The L4 runtime component that produces the PICP from CIP. Contains 9 materializers — pure functions, each producing one cognition object. ZERO interpretive authority. Deterministic: same CIP → same PICP.

**Status:** CANONICAL — canonicalized (2026-05-31). Renamed from ECR (Executive Cognition Runtime) to match PICP rename.

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### PRE (Projection Rendering Engine)

**Definition:** The L5 component that renders audience-specific deliverables from the PICP. Parameterized by ProjectionConfig (projection_type, audience, format, rendering_overrides). The ONLY component in the L4/L5 pipeline with interpretive authority (75.x bounded). Produces surfaces for 8 defined projection families.

**Status:** CANONICAL — canonicalized (2026-05-31). Name retained from prior discovery (accurately describes function).

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### CIP (Compiled Intelligence Package)

**Definition:** The L0-L3 assembly consumed by PICR to produce the PICP. 6 inputs: fullReport, synthesisResult, consequenceResult, cognitionOntology, classRiskLabels, qualificationPackage. Represents the complete evidence base from which structured cognition is derived.

**Status:** CANONICAL — canonicalized (2026-05-31).

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### L4 (Pipeline Cognition Layer)

**Definition:** The pipeline layer that produces structured cognition from compiled intelligence. ZERO interpretive authority. Located between L3 (Consequences) and L5 (Projection) in the cognition pipeline. Different namespace from git_structure_contract L0-L8 (branch governance layers).

**Status:** CANONICAL — canonicalized (2026-05-31). Pipeline layer designation, not branch governance layer.

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### L5 (Pipeline Projection Layer)

**Definition:** The pipeline layer that produces audience-specific deliverables from the PICP. 75.x bounded interpretive authority. Consumes PICP + ProjectionConfig. Different namespace from git_structure_contract L0-L8 (branch governance layers).

**Status:** CANONICAL — canonicalized (2026-05-31). Pipeline layer designation, not branch governance layer.

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### Cognition Object

**Definition:** A deterministic, evidence-bound, audience-independent, projection-free structured artifact that answers a distinct cognitive question about a specimen's structural execution reality. Produced by a single PICR materializer from CIP inputs. Carries ZERO interpretive authority. PICP membership is determined by the Cognition Object Qualification Test (7 gates: Derivation, Evidence Binding, Audience Independence, Projection Freedom, Structural Novelty, Cognitive Question, Zero Authority). Current inventory: structural_posture, tension_map, constraint_inventory, exposure_assessment, trajectory_assessment, decision_surface, absence_profile, detection_boundary, operational_ceiling. Inventory evolves by gate admission, not fixed count.

**Status:** CANONICAL — constitutionally defined (2026-05-31). Constitutional definition supersedes initial canonicalization. competitive_intelligence reconstituted as detection_boundary (Gate 4 failure — projection-contaminated framing).

**Source:** `docs/pios/PI.PICP-CONSTITUTION.01/COGNITION_OBJECT_CONSTITUTION.md`

### Cognition Object Qualification Test

**Definition:** The constitutional gate for PICP membership. 7 gates that every artifact must pass to qualify as a Cognition Object: (1) Derivation — deterministically derivable from CIP, (2) Evidence Binding — every field traces to governed L0-L3 source, (3) Audience Independence — no audience assumptions, (4) Projection Freedom — no rendering vocabulary or commercial framing, (5) Structural Novelty — produces understanding no existing object produces, (6) Cognitive Question — answers one distinct question about specimen structural reality, (7) Zero Authority — requires ZERO interpretive authority. Decision table: all 7 PASS = Cognition Object; Gate 4 fail = Reconstitution Candidate; Gate 5 fail = Derived View; Gate 3 fail = Projection Artifact; 5 or fewer = Not Cognition. Only modifiable by G1 stream.

**Status:** CANONICAL — constitutionally defined (2026-05-31).

**Source:** `docs/pios/PI.PICP-CONSTITUTION.01/COGNITION_OBJECT_QUALIFICATION_TEST.md`

### detection_boundary

**Definition:** Cognition object recording what aspects of a specimen's structural reality were previously unmeasurable and what measurement capability made them visible. Contains measurement frontier per condition type: measurement class, prior art measurement, measurement gap. Reconstituted from competitive_intelligence — same underlying data with projection-free framing. The competitive positioning ("what PI detects that others can't") belongs in PRE (L5), not PICR (L4).

**Status:** CANONICAL — constitutionally defined (2026-05-31). Reconstituted from competitive_intelligence (Gate 4 failure on Projection Freedom).

**Source:** `docs/pios/PI.PICP-CONSTITUTION.01/COGNITION_OBJECT_CONSTITUTION.md`

### Materializer

**Definition:** A pure function within the PICR that produces one cognition object from CIP inputs. 9 materializers defined, one per cognition object. No interpretive authority. Deterministic: same CIP → same cognition object. Some materializers are parallelizable (structural_posture, tension_map, absence_profile have no cross-dependencies).

**Status:** CANONICAL — canonicalized (2026-05-31).

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### Projection Family

**Definition:** A named rendering configuration for the PRE. 8 defined: Report, Boardroom Briefing, Advisory Memo, M&A Assessment, Transformation Review, Portfolio Review, Executive Workshop, Investment Review. Each family parameterizes the PRE to produce a distinct audience-specific deliverable from the same PICP. Projection families are the L5 axis of the marketplace model.

**Status:** CANONICAL — canonicalized (2026-05-31).

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_MARKETPLACE_STRATEGY.md`

### ProjectionConfig

**Definition:** The L5 parameterization schema that configures the PRE for a specific projection family rendering. 4 parameter groups: projection_type, audience, format, rendering_overrides. Determines how PICP cognition objects are selected, sequenced, compressed, and rendered for a specific audience surface.

**Status:** CANONICAL — canonicalized (2026-05-31).

**Source:** `docs/pios/PI.PICP-STRATEGY-AND-CANONICALIZATION.01/PICP_CANONICAL_ARCHITECTURE.md`

### PI Co-Pilot

**Definition:** The universal intelligence interaction surface for Program Intelligence. An operator cognition surface that interrogates the full PI knowledge graph (7 domains: Doctrine, Commercial, Runtime, Vault, Specimen, Verdict, Publishing) from a single surface. Progressively contextual — always useful, increasingly rich as more knowledge becomes available.

**Progressive Context Model:** Level 0 (doctrine+commercial, no specimen required) → Level 1 (+specimen) → Level 2 (+verdict) → Level 3 (+publishing assets). The continuity — same surface from "What is PI?" through "Generate a Board Pack" — IS the product.

**Interaction Hierarchy:** 3 tiers, 9 modes. Understand (Query/Explore/Explain), Curate (Compare/Curate/Challenge), Publish (Visualize/Package/Position).

**Status:** CANONICAL — conceptual model frozen (2026-06-02). Implementation pending.

**What it is NOT:** Customer-facing. A consulting platform. A qualification engine. A pipeline operator. A replacement for LENS. A replacement for Assessment Package. A generic chatbot with PI docs. A copilot in the AI assistant sense.

**Source:** `docs/pios/PI.ADVISORY-WORKBENCH-AND-CUSTOMER-ACCESS.ENABLEMENT.01/PI_COPILOT_CONCEPTUAL_BASELINE.md`

### Consumption Artifact

**Definition:** Audience-specific intelligence output produced by the PI Co-Pilot's Curate tier from governed verdict data. Replaces "audience-specific narrative" because the output includes more than text. Same verdict, different consumption.

**Examples:** Investment Committee Brief, Board Summary, CTO Summary, Acquisition Risk Summary, Executive Summary, Operational Risk Summary, Transformation Summary, board pack, executive one-pager, slide deck, graphic narrative.

**Status:** CANONICAL — terminology frozen (2026-06-02).

**What it is NOT:** A new verdict. A modified finding. A replacement for the Assessment Package. Consumption artifacts are derivative — they transform governed intelligence into audience-adapted format without changing what is said.

### Operator Cognition Surface

**Definition:** An architectural category for the PI Co-Pilot. Distinguishes the Co-Pilot from a "feature" — a feature ships small and iterates; an operator cognition surface needs its role in the ecosystem defined first. The assembled operational context (progressive, pre-loaded, knowledge-graph-backed) is the moat — not retrieval.

**Status:** CANONICAL — architectural concept frozen (2026-06-02).

**What it is NOT:** Feature thinking. A chatbot. An AI assistant. The distinction is categorical: the progressive context continuity IS the product.

### Three-Surface Architecture

**Definition:** The consumption architecture nesting model. Customer ⊂ Operator ⊂ Platform. No surface may access data from a surface that does not contain it. Customer receives LENS (SKU-gated) and Assessment Package. Operator receives full LENS + PI Co-Pilot + pipeline/SQO visibility. Platform contains all intelligence production infrastructure.

**Status:** CANONICAL — architecture frozen (2026-06-02).

**Source:** `docs/pios/PI.CONSUMPTION-AND-ACCESS-ARCHITECTURE.01/CONSUMPTION_ARCHITECTURE_BASELINE.md`

### Consumption Maturity Level

**Definition:** The 4-level model describing how customers access Program Intelligence output. Each level builds on the previous. No level requires the next.

- Level 0 — Export Only: No identity, operator-local, SA
- Level 1 — Guided Access: Workspace token, single hosted instance, SA-DD
- Level 2 — Self-Service: Named users, persistent hosted workspace, SC
- Level 3 — Platform: Role-based identity, dedicated tenant, SE

**Status:** CANONICAL — architecture frozen (2026-06-02).

### PIOperationalContext

**Definition:** The assembled context object that carries PI knowledge graph data at each progressive context level. Named in the PI Co-Pilot conceptual model but not yet schema-defined. Contains doctrine, commercial, runtime, vault (Level 0), plus specimen data (Level 1), plus verdict data (Level 2), plus publishing assets (Level 3).

**Status:** CANONICAL (named) / PENDING (schema). The schema definition is the load-bearing design decision before Co-Pilot implementation.

### Visibility Layer

**Definition:** A distinct class of structural connectivity evidence. Static import analysis (40.3s) measures one visibility layer — file-level import/require/from relationships. Modern architectures operate across multiple visibility layers: EVENT_FLOW (pub/sub, signals, event emitters), MQTT_TOPIC_FLOW (message broker pub/sub), WEBSOCKET_FLOW (real-time streaming channels), API_BOUNDARY (REST/GraphQL controller-to-consumer routes), DI_MODULE_GRAPH (framework dependency injection), RUNTIME_WIRING (infrastructure/deploy configuration). Static import visibility ≠ structural coverage. A domain that appears "dark" in one visibility layer may be fully connected in another.

**Status:** CANONICAL — proven on BlueEdge (Scenario C confirmed, 0/13 domains actually absent), validated on NetBox (same root cause, different shape). Origin: PI.RUNTIME-CONNECTIVITY-PROOF.01.

### Visibility-Layer Completeness Check

**Definition:** A pre-verdict integrity gate that classifies which visibility layers were measured for a specimen and which the specimen's architecture requires. Produces: architecture_profile (detected framework type), layers_measured, layers_required, layers_missing, completeness percentage, verdict_scope (CODE_CONNECTIVITY / PARTIAL_CONNECTIVITY / SYSTEM_CONNECTIVITY), and qualifier_modifier (VISIBILITY_INCOMPLETE when completeness < 100%). Does not change Q-class — Q-class measures reconciliation quality within measured layers. This check measures whether the measured layers are sufficient for the architecture.

**Status:** CANONICAL — implemented in PIKnowledgeGraphAccess.resolveVisibilityLayerCompleteness(). Operational on BlueEdge (100%, SYSTEM_CONNECTIVITY) and NetBox (25%, CODE_CONNECTIVITY, VISIBILITY_INCOMPLETE). Origin: PI.RUNTIME-CONNECTIVITY-PROOF.01.

### Architecture Profile

**Definition:** A classification of a specimen's framework and connectivity architecture used to determine which visibility layers are required for structural completeness. Known profiles: django-monolith (requires STATIC_IMPORT + EVENT_FLOW + API_BOUNDARY + DI_MODULE_GRAPH), nestjs-event-driven (adds WEBSOCKET_FLOW), nestjs-iot (adds MQTT_TOPIC_FLOW), microservices (adds RUNTIME_WIRING), spa-api (STATIC_IMPORT + API_BOUNDARY + WEBSOCKET_FLOW). Detected from specimen intake canonical_repo structure.

**Status:** CANONICAL — implemented. Origin: PI.RUNTIME-CONNECTIVITY-PROOF.01.

### System Connectivity Graph

**Definition:** The merged structural connectivity artifact produced by combining all measured visibility layers into a single edge set. Each edge carries: source_domain, target_domain, edge_type (STATIC_IMPORT / EVENT_FLOW / MQTT_TOPIC_FLOW / WEBSOCKET_FLOW / API_BOUNDARY / DI_INJECTION / RUNTIME_WIRING), evidence_class, confidence, source_file, and evidence_snippet. The system connectivity graph is the structural truth of how the system is actually connected — the code connectivity graph (40.3s static imports) is a subset.

**Status:** PROPOSED — forensic proof produced for BlueEdge (19 runtime edges). Automated extraction not yet implemented. Origin: PI.RUNTIME-CONNECTIVITY-PROOF.01.

### Dual-Axis Qualification

**Definition:** The classification model that separates evidence quality (Q-class) from visibility completeness into two independent axes. Axis 1 (Evidence Quality Class) measures reconciliation quality within measured evidence layers — the existing Q-01 through Q-04 scale. Axis 2 (Visibility Completeness State) measures whether the measured evidence layers are sufficient for the specimen's architecture — values are SYSTEM_CONNECTIVITY_COMPLETE, VISIBILITY_INCOMPLETE, or UNKNOWN. Neither axis invalidates the other. A specimen can be Q-03 (low static reconciliation) and SYSTEM_CONNECTIVITY_COMPLETE (all required visibility layers present) simultaneously. The operational notation is: `Q-03_STATIC_HISTORICAL + SYSTEM_CONNECTIVITY_COMPLETE`.

**Status:** PROPOSED — dual-axis model documented in verdict reclassification. Q-class doctrine not yet formally amended. The visibility-layer completeness check is implemented but does not modify Q-class output. Origin: PI.RUNTIME-CONNECTIVITY-PROOF.01.

### Consumer Authority Consolidation

**Definition:** The constitutional rule that establishes a single cognition authority for Program Intelligence. SignalSynthesisEngine → ConsequenceCompiler is the only path that may generate conditions, consequences, and cognition objects. All consumers (THORR, LENS, EIR) are consequence-native — they project cognition, they do not synthesize it. Projection layers may filter, rank, visualize, summarize, and attach evidence detail. Projection layers may NOT derive conditions, consequences, executive narratives, or cognition from raw evidence. Static and runtime evidence classes enter the same authority chain; runtime findings automatically propagate to all consumers once consequence formation occurs.

**Status:** CANONICAL — implemented and enforced (2026-06-05). 265 LOC of legacy cognition generation deleted. 3 independent paths collapsed to 1. Origin: PI.COGNITION-AUTHORITY-CONSOLIDATION.01.

---

> Terms below added by AMOps reconciliation 2026-06-12 (PI.AMOPS-PROPAGATION-DEBT-AUDIT.01). Reconciliation of already-existing primitives — no new doctrine.

### Investigation (Archetype / Instance)

**Definition:** A first-class PiOS runtime object representing what the operator is trying to resolve. Two layers: **Investigation Archetype** — the proof structure implied by a finding's cognition graph (exists whether or not anyone investigates); **Investigation Instance** — archetype + operator parameters (altitude, intent, decisionHorizon, scope). Lifecycle: OPENED → ACTIVE → CONVERGING → RESOLVED / INCONCLUSIVE. Progress tracks proof completion, not persona traversal.

**Status:** CANONICAL — IMPLEMENTED (`lib/lens-v2/pios/InvestigationRuntime.js`). Reconciles PCD-009. Vault constitutional page PIOS_INVESTIGATION_PRIMITIVE.md pending.

**What it is NOT:** Navigation with extra state. Navigation moves; Investigation tracks proof.

### Answer Object (AO-001..AO-011)

**Definition:** A reusable cognition object with a canonical schema, produced when an investigation question resolves. Eleven are defined (AO-011 = Divergence Pair). Captured via a governed candidate loop (PROPOSED → REVIEWED → PROMOTED); no autonomous promotion.

**Status:** CANONICAL — IMPLEMENTED (`AnswerObjectRuntime.js`, `AnswerObjectSynthesizers.js`).

**What it is NOT:** A persona-specific rendering. Persona varies how an Answer Object renders, not whether it exists.

### Temporal Verdict (TV-xxx)

**Definition:** A cognition artifact class distinct from Answer Objects, derived from a measurable Answer Object across a Comparable Observation Series (e.g. AO-011 → TV-001 Gravity Divergence Trend: widening/stable/converging/oscillating/indeterminate). Describes evolution, not current state.

**Status:** DISCOVERED / SUBSTRATE-LOCKED — defined, not implemented. Do not compute until a substrate clears the proof gate. See PCD-010.

### Comparable Observation Series

**Definition:** The temporal-cognition primitive. Two observations are comparable iff same subject under same measurement model. Same-specimen across runs/checkpoints is temporal; cross-specimen is benchmarking, not temporal.

**Status:** DOCTRINE (locked). No authoritative series yet exists.

### Chip State Machine

**Definition:** The LENS chip interaction model. Three chip intent types — Type 1 SYNTHESIS (stay, synthesize inline), Type 2 INVESTIGATION (descend to evidence), Type 3 PROJECTION_SHIFT (change persona). Six synthesis intents (governance_decision, qualification_review, operational_impact, structural_mechanism, compounding_analysis, evidence_verification). Per-persona. Navigation gravity: Type 2 descends, Type 3 ascends, Type 1 stays.

**Status:** CANONICAL — IMPLEMENTED (`components/lens-v2/zones/NavigationChips.jsx`, `IntentSynthesizer.js`).

### Cognitive Anchor

**Definition:** The deepest available context a chip question resolves against, ordered Specimen(0) → Posture(1) → Finding(2) → Investigation(3). Guarantees no orphaned chips — every question inherits the deepest live anchor.

**Status:** CANONICAL — IMPLEMENTED (`lib/lens-v2/pios/CognitiveAnchor.js`).

### SynthesisContext

**Definition:** The explicit context contract consumed by all synthesis. Invariant: same intent + different persona = same synthesis + different projection. `validateForIntent` returns an explicit "Cannot synthesize: missing X" rather than degraded output.

**Status:** CANONICAL — IMPLEMENTED (`lib/lens-v2/pios/SynthesisContext.js`).

### THORR Invocation Contract

**Definition:** The persona-agnostic synthesis contract (6 intents) governing THORR invocation. THORR is a GATED PREMIUM capability; deterministic synthesis (IntentSynthesizer) is the base product. THORR is the internal codename for the PI Co-Pilot (not product-facing).

**Status:** DOCTRINE — contract defined (`docs/pios/PI.INVESTIGATION-PROJECTION.01/`); not API-integrated.

### Maturation Runtime

**Definition:** The recognition that maturation is ordinal — `maturity = f(position in ordered space)`, not `f(time)` — and that SQO and the S/E/P projection-authority ladders ARE the maturation runtime PI already has. Maturation is not a temporal phenomenon and does not require a new runtime.

**Status:** DOCTRINE (locked). `docs/pios/PI.MATURATION-RUNTIME.01/`. Not a new build target.

### Carrier (Ordinal / Snapshot-State / Native-Temporal)

**Definition:** Classification of PI evidence carriers by how time relates to them. Class A Ordinal (maturation — position in ordered space). Class B Snapshot-state (diff between captured states). Class C Native-temporal (commits/PRs/telemetry — time embedded in the evidence).

**Status:** DOCTRINE (locked). PI.TEMPORAL-ONTOLOGY.01.

### Finding (Runtime Projection vs Vault-Lineage)

**Definition:** A cognition finding (Execution Blindness, Gravity Divergence, Runtime Consequence, Domain Cognition) is a **runtime projection product** — computed in-memory at LENS bind by SignalSynthesisEngine → ConsequenceCompiler → DomainCognitionCompiler, never persisted. A **vault-lineage finding** is a finding persisted with its full evidence lineage as a durable governed artifact. The two are NOT equivalent.

**Status:** CANONICAL — constitutional boundary. Runtime findings are deterministic (re-derivable by recomputation) but not replayable outside the LENS runtime and not governed persisted objects until persisted with lineage.

**What it is NOT:** "Finding appears in LENS" is NOT "finding exists in the vault."

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
