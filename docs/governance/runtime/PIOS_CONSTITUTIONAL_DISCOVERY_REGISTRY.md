# PiOS Constitutional Discovery Registry

**Status:** ACTIVE — discovery lineage for vault propagation  
**Authority:** PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01  
**Governed by:** [PIOS_DISCOVERY_GOVERNANCE_DOCTRINE.md](PIOS_DISCOVERY_GOVERNANCE_DOCTRINE.md)  
**Purpose:** Authoritative staging ground between conversational discovery and permanent constitutional doctrine  
**Propagation:** G1 stream required to move matured discoveries into `docs/pios/vault/constitutional/pios/`  

This registry captures constitutional discoveries governed under the PiOS Discovery Governance Doctrine. Each entry follows the Discovery Record Contract (Doctrine Section 5) and progresses through the Discovery Lifecycle (Doctrine Section 4).

Discoveries at LOCKED status have constitutional force even before vault propagation — they bind implementation. Vault propagation adds permanence and cross-session discoverability.

---

## PCD-001: Topology-First Doctrine

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | StackStorm topology felt immediately correct while SW-INTEL condition panels felt repetitive |
| **Problem** | The mental model assumed: Signals → Conditions → Consequences → Narrative → Topology. Observed behavior was the reverse: Topology → everything else. |
| **Discovery** | Topology is not another visualization. Topology is the constitutional projection substrate. It is the only artifact with a monotonic survival property across all evidence capability states (E-STRUCTURAL through E-GOVERNED). Signals come and go. Conditions come and go. Narratives come and go. Topology persists. |
| **Constitutional Impact** | `canonical_topology` elevated from L0 evidence artifact to constitutional projection substrate. All consumers (LENS, THORR, EIR) must anchor projection on topology. All other intelligence (signals, conditions, consequences, narratives) are annotations on topology. |
| **Affected Components** | LENS (projection anchor), THORR (explanation anchor), EIR (narrative anchor), SoftwareIntelligenceProjectionAdapter, ConsequenceCompiler |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_TOPOLOGY_FIRST_DOCTRINE.md` |
| **Maturity State** | PROPAGATED — vault node: `docs/pios/vault/constitutional/pios/PIOS_TOPOLOGY_FIRST_DOCTRINE.md` |

---

## PCD-002: S / E / P Three-Axis Separation

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | StackStorm S1 projecting "Execution Fragility" and "Operational Concentration" while state machine says "We only know structure" |
| **Problem** | Three concepts were treated as one: Qualification State (SQO S0-S3), Evidence Capability (what intelligence exists), and Projection Authority (what PiOS is allowed to say). Mixing them produced constitutional contradictions. |
| **Discovery** | These are three independent axes: **Qualification State (S-axis)** measures governance maturity through SQO progression. **Evidence Capability (E-axis)** describes what intelligence substrate exists (E-STRUCTURAL → E-RUNTIME → E-SEMANTIC → E-GOVERNED). **Projection Authority (P-axis)** governs what PiOS is constitutionally allowed to project (P0-P4). Each axis is independently measurable. Authority flows: S → gates → E → grants → P. |
| **Constitutional Impact** | Foundational PiOS law. All projection governance derives from this separation. The P-axis — not the S-axis — is the governing authority for what consumers may render. |
| **Affected Components** | ProjectionAuthorityKernel (implements the model), PI_STATE_MACHINE_CONTRACT.md (documents it), all consumers (LENS, THORR, EIR, SW-INTEL) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_AUTHORITY_MODEL.md` |
| **Maturity State** | PROPAGATED — vault node: `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_AUTHORITY_MODEL.md` |

---

## PCD-003: Projection Violation Doctrine

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | Audit revealed StackStorm projecting 20 "operational conditions" at S1 structural qualification |
| **Problem** | PiOS had no concept of constitutionally invalid projection. All intelligence that existed was projected. There was no authority gate between evidence and consumer output. |
| **Discovery** | A projection violation exists whenever PiOS emits intelligence whose authority level exceeds the specimen's proven evidence capability. Projection violations are first-class governance concerns — not UI bugs, not rendering preferences, not error states. They are constitutional breaches of evidence authority. Intelligence may exist in the evidence layer but be legally unprojectable. |
| **Constitutional Impact** | Introduces `violations[]` as first-class output of the authority kernel. Enables "Suppressed Intelligence" as a governance feature: "14 conditions suppressed. Reason: Projection authority exceeded." Evidence is preserved. Only projection is constrained. |
| **Affected Components** | ProjectionAuthorityKernel (violation detection), future LENS rendering (suppression), future THORR (refusal with explanation), future EIR (chapter gating) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_VIOLATION_DOCTRINE.md` |
| **Maturity State** | PROPAGATED — vault node: `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_VIOLATION_DOCTRINE.md` (covers PCD-003 + PCD-004) |

---

## PCD-004: Evidence-Governed Projection (Doctrine B)

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01, Phase 1 review |
| **Trigger** | Challenge: "Should authority be granted by specimen capability alone, or should every condition prove its own authority lineage?" |
| **Problem** | Under Doctrine A (specimen-level authority), P2 specimen capability automatically authorized all P2 condition types regardless of their evidence lineage. A condition derived purely from structural enrichment could make "execution" claims simply because runtime evidence existed elsewhere in the specimen. |
| **Discovery** | Doctrine B: each condition must independently prove its authority from its own evidence lineage. `evidence_mode` maps to proven authority: STRUCTURAL_ENRICHMENT_DERIVED → proves P1, RUNTIME_EVIDENCE → proves P2, SIGNAL_DRIVEN → proves P3. Authorization requires BOTH specimen-level authority AND evidence lineage authority. The strongest formulation: "Even at P4, structural evidence cannot prove P2 execution claims." |
| **Constitutional Impact** | Transforms projection governance from capability-based to evidence-based. Prevents P-level from "magically upgrading" evidence. A weakly proven condition remains weakly proven regardless of specimen maturity. Three independent validation axes: requested authority, proven authority, specimen authority. |
| **Affected Components** | ProjectionAuthorityKernel (Doctrine B implementation), all condition producers (SignalSynthesisEngine rule functions), all consumers |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_EVIDENCE_GOVERNED_PROJECTION.md` |
| **Maturity State** | PROPAGATED — vault node: `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_VIOLATION_DOCTRINE.md` (Doctrine B section, covers PCD-003 + PCD-004) |

---

## PCD-005: Measurement Layer

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01, post-Doctrine B analysis |
| **Trigger** | Doctrine B revealed that EXECUTION_FRAGILITY's evidence lineage (structural enrichment) doesn't support its authority claim (P2 execution). The question arose: what is the constitutional object — the condition or the measurement underneath? |
| **Problem** | Conditions were treated as fundamental discoveries. SW-INTEL often felt repetitive because multiple condition labels (EXECUTION_FRAGILITY, EXECUTION_CONSTRICTION, COUPLING_INERTIA) attached to overlapping structural measurements. The labels are interpretive projections of measurements, not constitutional objects themselves. |
| **Discovery** | Measurements are the constitutional objects. Conditions are projections of measurements at a specific authority level. The same coupling/cohesion measurement can project as P1 "STRUCTURAL_COUPLING_CONCENTRATION" (what the measurement says) or P2 "EXECUTION_FRAGILITY" (what it means operationally). The measurement doesn't change. The projection authority does. Taxonomy: 10 of 18 condition types are measurement-descriptive (label matches measurement). 7 are interpretive projections (label exceeds measurement). 1 is composite. |
| **Constitutional Impact** | The architecture becomes: Evidence → Measurements → Authority Validation → Conditions → Consequences → Consumer Projection. Measurements become the shared constitutional substrate for all future consumers (SW-INTEL, THORR, LENS, EIR, PMO Cognition, marketplace domains). Domain-neutral measurements (concentration, cohesion, dependency density, coordination load) survive across all domain modules. |
| **Affected Components** | SignalSynthesisEngine (measurement extraction), ProjectionAuthorityKernel (authority validation), CognitionContractModel (condition projection), all consumers |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_MEASUREMENT_LAYER.md` |
| **Maturity State** | VALIDATED — taxonomy complete (18 conditions classified). Not yet implemented as separate layer. The 7 interpretive projections are identified as needing either P1 measurement-descriptive names or runtime evidence participation. |

---

## PCD-006: Consumer / Application Separation

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | Multiple consumers (LENS, THORR, EIR) each reaching into different layers independently, producing inconsistent projection behavior |
| **Problem** | Consumers were treated as peers of the cognition engine. Each consumer independently accessed evidence, conditions, and projections without a common authority contract. This produced: persona leakage (DENSE context surviving into BOARDROOM), consumer leakage (LENS state influencing THORR), and authority inconsistency (different consumers projecting at different authority levels for the same specimen). |
| **Discovery** | THORR, LENS, EIR, PMO Cognition are applications running on PiOS — not components of PiOS. They consume the PiOS kernel's authority decisions. They do not make their own authority decisions. The ProjectionAuthorityKernel is PiOS infrastructure. The consumers are application-layer projections of kernel output. |
| **Constitutional Impact** | All consumers must depend on the same authority object. No consumer may bypass the kernel to access evidence directly for projection purposes. Consumer-specific projection (persona depth, audience calibration, interrogation style) happens AFTER authority validation, not instead of it. |
| **Affected Components** | LENS (IntelligenceField, SupportRail, ExecutiveInterpretation), THORR (PIContextAssembler, corridor routing), EIR (ConsequenceNativeEIR, narrative mode), SW-INTEL (SoftwareIntelligenceProjectionAdapter) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_CONSUMER_MODEL.md` |
| **Maturity State** | ARCHITECTURAL — kernel exists, consumer wiring not yet implemented. Phase 3 of migration path. |

---

## PCD-007: PiOS Kernel Emergence

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01, Phase 1 implementation |
| **Trigger** | `computeProjectionAuthority()` was initially conceived as a helper function. During implementation it became clear it is constitutional infrastructure — every consumer depends on it. |
| **Problem** | PiOS had no explicit kernel. Governance was distributed across CLAUDE.md, vault contracts, and ad-hoc code. There was no single computational authority that all consumers depended on. |
| **Discovery** | ProjectionAuthorityKernel is the emergent PiOS kernel. It computes: qualification state, evidence capabilities with reasoning, projection level, authorized condition types, violations as first-class output, runtime-present vs runtime-qualified distinction. It is not a LENS component, not a THORR component, not an EIR component. It is PiOS constitutional infrastructure. Its current location (`lib/lens-v2/`) understates what it is. |
| **Constitutional Impact** | PiOS now has an identifiable computational kernel. Future work: relocate from `lib/lens-v2/` to a PiOS-level location. All consumers become kernel clients. The kernel is the single source of projection authority truth. |
| **Affected Components** | ProjectionAuthorityKernel.js (the kernel itself), all consumers (become clients), future PMO cognition, future marketplace consumers |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_KERNEL.md` |
| **Maturity State** | OPERATIONAL — implemented, tested (32 tests), both specimens validated. Location migration pending. |

---

## PCD-008: Artifact Qualification (AQ-001)

| | |
|---|---|
| **Origin Stream** | THORR interrogation session — Chief Architect VISUALIZE + Board challenge sequence (2026-06-09 → 2026-06-10) |
| **Trigger** | AF-001 (structural/operational divergence) was challenged iteratively through deployment architecture, resilience mapping, failure domain modeling, change impact assessment, and dependency inventory. Each challenge revealed the same structural gap: the artifact presented as universally valid while being conditionally valid. |
| **Problem** | Architectural artifacts derived from PI intelligence carry implicit evidence completeness assumptions. A deployment model built from static analysis presents as THE deployment model — not as "a deployment model qualified by STATIC_IMPORT evidence." A resilience map built without runtime evidence presents resilience conclusions that runtime connectivity would contradict. The artifact does not disclose what it cannot answer. |
| **Discovery** | Artifact validity is question-dependent. The same artifact can be qualified for one question and unqualified for another. A deployment model answering "where does code run?" requires STATIC_IMPORT only. The same model answering "what fails if this node dies?" requires STATIC + RUNTIME. The required evidence layers are determined by the question, not by the artifact. Without explicit qualification, every architectural artifact presents unconditional authority it does not possess. This is distinct from VLC (which qualifies evidence), P-levels (which qualify PI projection), and Doctrine B (which qualifies individual conditions). AQ-001 qualifies composite consumer artifacts — the downstream objects derived FROM PI intelligence. |
| **Validation: Question-Class Taxonomy** | THORR derived the operational mechanism (StackStorm Chief Architect interrogation, 2026-06-10). Five question classes are structurally enumerable: **Class I** (Structural Propagation — "what depends on X?") requires STATIC_IMPORT. **Class II** (Coordination Failure — "what if the event bus fails?") requires EVENT_FLOW. **Class III** (Telemetry Continuity — "where does field data stop?") requires MQTT_TOPIC_FLOW. **Class IV** (External Interface — "what is exposed?") requires API_BOUNDARY. **Class V** (Compound — "does structural gravity align with operational gravity?") requires two or more layers cross-correlated. The full derivation is two-dimensional: `question_class → required_layer(s)` identifies the evidence family; `required_layer(s) × artifact → qualification_state` determines whether the artifact has coverage in that layer. Neither dimension alone is sufficient. Class V is where AQ-001 has the most governance force — compound questions produce unqualified artifacts most frequently because both layers must cover the same artifact. The taxonomy is a pre-qualification filter: apply before interrogation, not after. Route the question to the correct layer, check artifact coverage, then answer. Unqualified conclusions become structurally preventable rather than retrospectively discoverable. |
| **Constitutional Impact** | Introduces a new governance primitive: artifact-level evidence qualification. Every architectural artifact derived from PI intelligence should carry: (1) the evidence layers it was derived from, (2) the set of questions it is qualified to answer, (3) the questions it is NOT qualified to answer given its evidence basis. This applies across all artifact classes: deployment models, resilience maps, failure domain models, change impact models, dependency inventories. The qualification is constitutional — it applies to all specimens, all artifact classes. The severity is specimen-specific — it depends on how much the system's runtime surface exceeds measured evidence layers. |
| **Falsification Record** | Five falsification attempts survived: (1) Not a restatement of AF-001 — AF-001 is measurement observation, AQ-001 is governance primitive. (2) Not VLC — VLC qualifies evidence input, AQ-001 qualifies artifact output. (3) Not P-levels — P-levels gate PI projection, AQ-001 gates consumer derivation. (4) Not existing finding qualification — individual findings are qualified, composite artifacts are not. (5) Not specimen-specific — StackStorm and NetBox exhibit the same structural gap at different severity. |
| **Cross-Artifact Survival** | Deployment Model (static-only misses runtime SPOF), Resilience Map (misses MQTT broker as true SPOF), Failure Domain Model (misses event coordination crossing all domains), Change Impact Model (misses runtime propagation through event bus), Dependency Inventory (misses DI-injected services with no import edge). All five artifact classes affected. |
| **Affected Components** | Visual Spec renderers (should carry evidence qualification), THORR answer generation (should disclose artifact qualification when producing specifications), EIR exports (should carry evidence basis metadata), future marketplace artifacts (must inherit qualification from source evidence) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_ARTIFACT_QUALIFICATION.md` |
| **Maturity State** | VALIDATED — question-class taxonomy derived and cross-specimen verified. Five question classes enumerated with evidence layer mappings. Two-dimensional derivation formula established: `question_class × artifact → qualification_state`. Falsification basis: BlueEdge AF-001 through AF-005. Validation basis: StackStorm Chief Architect interrogation (2026-06-10) independently derived the taxonomy from the principle. **Partial implementation (reconciled 2026-06-12):** AQ-001 is consumed as completion criteria inside the Investigation Runtime (`AnswerObjectRuntime.js`, `InvestigationRuntime.js` reference AQ-001 for proof sufficiency); it is NOT yet implemented as a standalone artifact-qualification governance layer that stamps every consumer artifact with its evidence basis. Taxonomy validated and partially wired; standalone primitive still pending. |

---

## PCD-009: Investigation as PiOS Primitive

| | |
|---|---|
| **Origin Stream** | Navigation Spec implementation session (2026-06-10). Navigation chips proved state continuity across personas but failed cognitive orientation — the operator landed in the right place but had no signal of what they were investigating, what was proven, or what remained. |
| **Trigger** | Three sequential challenges: (1) Navigation drops the operator at the destination's front door without context. (2) A Guide Runtime that tracks persona traversal is projection-centric, not investigation-centric. (3) If investigations are discovered, how can the same finding support multiple simultaneous investigations with different objectives? Each challenge refined the primitive. |
| **Problem** | LENS has findings, continuations, navigation, and persona transitions — but no object that represents "what the operator is trying to resolve." Each persona renders independently. There is no shared state that tracks: what was claimed, what has been examined, what remains unproven, and when the investigation is complete. Navigation Specs solved state continuity (the context carries across personas). They did NOT solve cognitive orientation (the operator knowing where they are in a proof path). |
| **Discovery** | Investigation is a first-class PiOS runtime object with lifecycle, state, completion criteria, and proof paths. It has two layers: **Investigation Archetype** (discovered) — the proof structure implied by a finding's cognition graph. Proof paths from continuations, evidence requirements from AQ-001, reachable surfaces from adjacency, falsification conditions from challenge continuations. The archetype exists whether or not anyone investigates. **Investigation Instance** (constructed) — archetype + operator parameters. Construction parameters: altitude (how to investigate — proof depth, evidence sufficiency), intent (what triggered it — the action label), decisionHorizon (why — from PERSONA_PROJECTIONS, e.g. "governance, risk, exposure" vs "due diligence, integration risk"), scope (single-finding or cross-finding). |
| **Lifecycle** | OPENED (first continuation click) → ACTIVE (traversal in progress) → CONVERGING (evidence paths narrowing) → RESOLVED (operator has sufficient proof) or INCONCLUSIVE (evidence doesn't support conclusion). Investigations are not eagerly created — they materialize when the first navigation occurs. Before that, it's a THORR answer with available continuations. |
| **Proof Path Model** | Progress tracks proof completion, not persona traversal. The operator doesn't care which persona they visited — they care whether the claim is proven. Proof steps complete when evidence is examined, regardless of which persona was used. The Guide Runtime shows: what is proven, what is unresolved, what to do next. No persona labels in progress. No "you are here" — just: what's proven and what isn't. |
| **Guide Runtime** | Right panel override when investigation is active. Replaces Support Rail temporarily. Shows: investigation question, proof status (proven/unresolved), remaining continuations filtered to investigation's proof path, next actions. Returns to Support Rail when investigation resolves or is dismissed. The Guide doesn't describe the surface — it describes what remains unresolved. Investigation-centric, not projection-centric. |
| **Primitive Relationships** | Investigation is the orchestrating object. Cognitive Continuations generate its edges (what CAN be explored). Navigation Specs traverse them (HOW to get there). Investigation Context holds the question (WHAT you're resolving). Guide Runtime tracks progress (WHERE you are in the proof). THORR contributes cognition when paths are exhausted. LENS projects investigation state per persona. AQ-001 defines completion criteria per question class. |
| **Falsification Record** | Three challenges survived: (1) "Is this just navigation with extra state?" — No. Navigation moves. Investigation tracks proof. They compose but are independent. (2) "Are investigations discovered or constructed?" — Both. Archetypes are discovered from the cognition graph. Instances are constructed from archetype + operator parameters. (3) "Is altitude the only construction parameter?" — No. altitude + intent + decisionHorizon + scope. PERSONA_PROJECTIONS.decisionHorizon carries the objective hint. |
| **Affected Components** | lens-v2-flagship.js (investigation state), IntelligenceField (investigation context threading + Guide override), NavigationChips (investigation construction on click), Support Rail (Guide mode), all personas (consume investigation for cognitive orientation) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_INVESTIGATION_PRIMITIVE.md` |
| **Maturity State** | IMPLEMENTED (reconciled 2026-06-12) — archetype/instance model, lifecycle, Guide Runtime, and primitive relationships are implemented in production code. `app/execlens-demo/lib/lens-v2/pios/InvestigationRuntime.js` (385 LOC) carries all five lifecycle states (OPENED, ACTIVE, CONVERGING, RESOLVED, INCONCLUSIVE), a durable embedded `cognition` payload (no external refs), and inline proof-step synthesis. Guide Runtime is live in `IntelligenceField` (Support Rail override). Implementation commits: 174ac1f (Phase 3 foundation), 33eeba3 (Synthesis Panel), 9b76d77/c83d803 (inline proof steps), cb607bb (durable cognition payload), db34cb6 (cognitive anchor). Prior "Not yet implemented" status contradicted code and is corrected. Full lifecycle is operational; vault constitutional page (PIOS_INVESTIGATION_PRIMITIVE.md) still pending. |

---

## PCD-010: Temporal Cognition as Third Cognition Axis

| | |
|---|---|
| **Origin Stream** | PMO Cognition discovery session (2026-06-12). PMO discovery concluded the runtime transfers and the largest gap was temporal evidence. A challenge tested whether temporal was merely a PMO context-builder requirement or a missing platform capability. |
| **Trigger** | Decomposing three PMO answer objects (Commitment Reachability, Capacity Saturation, Trajectory) into evidence atoms revealed a gradient: one is a context problem (Capacity Saturation, answerable statically), one is hybrid (Commitment Reachability splits into static exposure + temporal projection), one is purely temporal (Trajectory, full collapse to AO-006 without time). The gradient proved temporal is a separate axis, not a context variant. A second challenge corrected the framing: temporal is not *only* an evidence dimension — at series depth it generates a new artifact class. |
| **Problem** | Every hard PMO question transformed into a temporal question ("what is the posture" → "is the posture improving"). The pattern was too consistent to be PMO-specific. LENS itself already has latent temporal blindness: the AO-011 falsification verdict checks whether centers differ *now* but cannot say whether they are *trending toward* convergence. PMO does not create the temporal gap — it makes an existing platform gap unavoidable. |
| **Discovery** | Temporal Cognition is the third cognition axis. Three-layer model: **Structural** (what is true) → **Investigation** (why it is true) → **Temporal** (how truth is evolving). Temporal operates in three layers itself: EVIDENCE (Comparable Observation Series) → OBJECT (each observation → Answer Object) → SYNTHESIS (AO(t0) Δ AO(t1) → Temporal Verdict). Temporal *begins* as an evidence dimension but at series depth becomes a synthesis source producing a new first-class artifact. |
| **Temporal Verdict** | A new cognition artifact class, distinct from Answer Objects. AO-011 (Gravity Divergence) is an Answer Object — what is true. TV-001 (Gravity Divergence Trend: widening/stable/converging/oscillating/indeterminate) is a Temporal Verdict — derived from AO-011 across a comparable series, describing evolution. Every measurable Answer Object has a potential Temporal Verdict (AO-003 → TV-003 Execution Blindness Trend, etc.). Persona varies how an answer renders; temporal generates a new answer. |
| **Primitive** | **Comparable Observation Series** — not "run series." Comparability is the binding constraint: two observations are comparable iff same subject under same measurement model. Cross-specimen (BlueEdge vs StackStorm) is benchmarking, not temporal. Same-specimen across runs/checkpoints is temporal. |
| **Temporal Qualification Ladder** | TQ-0 (no observation) → TQ-1 (single — current posture only, trend impossible; this IS AO-006) → TQ-2 (dual — direction, weak rate) → TQ-3 (series — direction, rate, qualified projection) → TQ-4 (stable series — predictive cognition begins). AO-006 Temporal Unavailability is the floor of this ladder; graceful degradation already built. |
| **Falsification Record** | Three challenges survived: (1) "Is temporal just a PMO context builder?" — No. The three-object gradient proves it is a separate axis; you cannot resolve all three with a context builder. (2) "Is temporal purely an evidence dimension like persona?" — No, only at the evidence layer. At series depth it produces Temporal Verdicts, a new synthesized artifact class. Persona never produces new artifacts; temporal does. (3) "Does temporal require PMO to validate?" — No. AO-011 across existing BlueEdge runs proves it with no PMO, Jira, velocity, or delivery metrics. |
| **Affected Components** | New platform runtime beneath LENS/Guide/THORR. AnswerObjectRuntime (verdict derivation), SynthesisContext (temporal series input), AO-006 (becomes TQ-1), all Answer Objects (gain potential Temporal Verdicts), future PMO module (consumes Temporal Verdicts). |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_TEMPORAL_COGNITION.md` |
| **Comparability Doctrine** | `docs/pios/PI.TEMPORAL-COMPARABILITY.01/TEMPORAL_COMPARABILITY_DOCTRINE.md` — Seven Lies, C0–C5 comparability ladder, two-axis gating (verdict authority = min(TQ depth, C validity)), AQ-001 analogy. |
| **Proof Gate** | `docs/pios/PI.TEMPORAL-PROOF-GATE.01/TEMPORAL_PROOF_GATE_DOCTRINE.md` — proof-gate matrix (changed specimen + stable measurement = temporal cognition). **Proof-gate result (2026-06-12):** BlueEdge pair `genesis_e2e_03` / `productized_01_fixed` audited — C2 lineage ACCEPTABLE, C4 measurement-model HARD FAIL (genesis 6/6 runtime layers SYSTEM_CONNECTIVITY vs productized 0/1 CODE_CONNECTIVITY; RSIG-derived execution center present in one, absent in other). Classified MEASUREMENT DRIFT. UNSUITABLE for TV-001. No verdict computed. First valid substrate must be a purpose-built comparable series (same pipeline, changed specimen). |
| **Maturity State** | DISCOVERED / SUBSTRATE-LOCKED / NOT IMPLEMENTED (reconciled 2026-06-12) — three-layer model, Temporal Verdict artifact class, Comparable Observation Series primitive, TQ ladder, comparability ladder, and proof-gate matrix all defined. Proof-gate locked: no authoritative temporal substrate yet exists. Not implemented. Do not compute Temporal Verdicts until a substrate clears both gates. Doctrine: `docs/pios/PI.TEMPORAL-COGNITION.01/TEMPORAL_COGNITION_DOCTRINE.md`. |
| **Related Locked Doctrine** | Two doctrine outputs emerged from the same investigation and share PCD-010's locked status (status only; not separately elevated): (1) **Maturation Runtime** — maturation is ordinal (`maturity = f(position in ordered space)`), NOT temporal; SQO and S/E/P ARE the maturation runtime PI already has. Doctrine: `docs/pios/PI.MATURATION-RUNTIME.01/`. Status: DOCTRINE (locked, not a new runtime to build). (2) **Carrier Classification** — three carrier classes: A Ordinal (maturation), B Snapshot-state (diff), C Native-temporal (commits/PRs/telemetry). Doctrine: PI.TEMPORAL-ONTOLOGY.01 / carrier classification. Status: DOCTRINE (locked). Neither is implemented; both are recorded here to close the registry gap without reopening Temporal. |

---

## Registry Metadata

| | |
|---|---|
| **Discovery Period** | 2026-06-04 through 2026-06-10 |
| **Primary Streams** | PI.LENS-SURFACE-ACTIVATION-CONTRACT.01, PI.LENS-RUNTIME-SURFACES-INLINE.01, PI.LENS-COGNITION-CONTRACT-MODEL.01, PI.LENS-COGNITION-CONTRACT-TESTS.01, PI.SIGNAL-LAYER-BACKFILL.01, PI.PIOS-LAYER-CONSOLIDATION-AUDIT.01, PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Specimens Used** | StackStorm (run_github_st2_20260520_131000), BlueEdge (run_blueedge_genesis_e2e_03) |
| **Key Commits** | 513e593 (surface activation), 569f1be (CognitionContractModel), 86cd02c (signal backfill), 307b648 (PI_STATE_MACHINE_CONTRACT), 6367609 (ProjectionAuthorityKernel), 6cf9cda (Doctrine B) |
| **Propagation Target** | G1 stream: PIOS.CONSTITUTIONAL-KNOWLEDGE-CAPTURE.01 → `docs/pios/vault/constitutional/pios/` |

## Maturity Classification

| State | Meaning | Count | Discoveries |
|---|---|---|---|
| PROPAGATED | In vault, permanent constitutional memory | 4 | PCD-001, PCD-002, PCD-003, PCD-004 |
| VALIDATED | Taxonomy complete, partial implementation (consumed, not standalone) | 2 | PCD-005, PCD-008 |
| ARCHITECTURAL | Design locked, implementation pending | 1 | PCD-006 |
| OPERATIONAL | Running in production code, location/naming may evolve | 2 | PCD-007, PCD-009 |
| DISCOVERED | Hypothesis validated, substrate-locked, not implemented | 1 | PCD-010 |

All discoveries governed under [PIOS_DISCOVERY_GOVERNANCE_DOCTRINE.md](PIOS_DISCOVERY_GOVERNANCE_DOCTRINE.md).

**Reconciliation note (2026-06-12):** PCD-009 moved DISCOVERED → OPERATIONAL (InvestigationRuntime.js implemented; prior status contradicted code). PCD-008 clarified to partial implementation. PCD-010 affirmed DISCOVERED/substrate-locked with Maturation Runtime + Carrier Classification recorded as related locked doctrine. Full reconciliation: `docs/pios/PI.AMOPS-PROPAGATION-DEBT-AUDIT.01/PROPAGATION_DEBT_MANIFEST.md`. Canonical-state and terminology-lock propagation completed same date.
