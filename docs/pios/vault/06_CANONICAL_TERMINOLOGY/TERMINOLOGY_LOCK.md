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
