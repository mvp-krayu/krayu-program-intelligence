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
| **Constitutional Impact** | Introduces a new governance primitive: artifact-level evidence qualification. Every architectural artifact derived from PI intelligence should carry: (1) the evidence layers it was derived from, (2) the set of questions it is qualified to answer, (3) the questions it is NOT qualified to answer given its evidence basis. This applies across all artifact classes: deployment models, resilience maps, failure domain models, change impact models, dependency inventories. The qualification is constitutional — it applies to all specimens, all artifact classes. The severity is specimen-specific — it depends on how much the system's runtime surface exceeds measured evidence layers. |
| **Falsification Record** | Five falsification attempts survived: (1) Not a restatement of AF-001 — AF-001 is measurement observation, AQ-001 is governance primitive. (2) Not VLC — VLC qualifies evidence input, AQ-001 qualifies artifact output. (3) Not P-levels — P-levels gate PI projection, AQ-001 gates consumer derivation. (4) Not existing finding qualification — individual findings are qualified, composite artifacts are not. (5) Not specimen-specific — StackStorm and NetBox exhibit the same structural gap at different severity. |
| **Cross-Artifact Survival** | Deployment Model (static-only misses runtime SPOF), Resilience Map (misses MQTT broker as true SPOF), Failure Domain Model (misses event coordination crossing all domains), Change Impact Model (misses runtime propagation through event bus), Dependency Inventory (misses DI-injected services with no import edge). All five artifact classes affected. |
| **Affected Components** | Visual Spec renderers (should carry evidence qualification), THORR answer generation (should disclose artifact qualification when producing specifications), EIR exports (should carry evidence basis metadata), future marketplace artifacts (must inherit qualification from source evidence) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_ARTIFACT_QUALIFICATION.md` |
| **Maturity State** | DISCOVERED — hypothesis validated through falsification. Not yet implemented as governance primitive. Evidence basis: BlueEdge AF-001 through AF-005, StackStorm cross-validation. |

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
| VALIDATED | Taxonomy complete, not yet implemented as separate layer | 1 | PCD-005 |
| ARCHITECTURAL | Design locked, implementation pending | 1 | PCD-006 |
| OPERATIONAL | Running in production code, location/naming may evolve | 1 | PCD-007 |
| DISCOVERED | Hypothesis validated through falsification, not yet implemented | 1 | PCD-008 |

All discoveries governed under [PIOS_DISCOVERY_GOVERNANCE_DOCTRINE.md](PIOS_DISCOVERY_GOVERNANCE_DOCTRINE.md).
