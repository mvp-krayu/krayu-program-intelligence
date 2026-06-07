# PiOS Constitutional Discovery Registry

**Status:** ACTIVE — discovery lineage for vault propagation  
**Authority:** PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01  
**Purpose:** Authoritative bridge between conversational discovery and permanent constitutional doctrine  
**Propagation:** G1 stream required to move matured discoveries into `docs/pios/vault/constitutional/pios/`  

This registry captures constitutional discoveries — findings that change the operating model of Program Intelligence, not merely its implementation. Each entry preserves the discovery path because the reasoning is as valuable as the outcome.

A constitutional discovery is not a design decision. Design decisions can be reversed. Constitutional discoveries become part of the intellectual property of Program Intelligence.

---

## Discovery 1: Topology-First Doctrine

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | StackStorm topology felt immediately correct while SW-INTEL condition panels felt repetitive |
| **Problem** | The mental model assumed: Signals → Conditions → Consequences → Narrative → Topology. Observed behavior was the reverse: Topology → everything else. |
| **Discovery** | Topology is not another visualization. Topology is the constitutional projection substrate. It is the only artifact with a monotonic survival property across all evidence capability states (E-STRUCTURAL through E-GOVERNED). Signals come and go. Conditions come and go. Narratives come and go. Topology persists. |
| **Constitutional Impact** | `canonical_topology` elevated from L0 evidence artifact to constitutional projection substrate. All consumers (LENS, THORR, EIR) must anchor projection on topology. All other intelligence (signals, conditions, consequences, narratives) are annotations on topology. |
| **Affected Components** | LENS (projection anchor), THORR (explanation anchor), EIR (narrative anchor), SoftwareIntelligenceProjectionAdapter, ConsequenceCompiler |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_TOPOLOGY_FIRST_DOCTRINE.md` |
| **Maturity State** | PROVEN — validated on StackStorm and BlueEdge. Documented in PI_STATE_MACHINE_CONTRACT.md Section 4. |

---

## Discovery 2: S / E / P Three-Axis Separation

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | StackStorm S1 projecting "Execution Fragility" and "Operational Concentration" while state machine says "We only know structure" |
| **Problem** | Three concepts were treated as one: Qualification State (SQO S0-S3), Evidence Capability (what intelligence exists), and Projection Authority (what PiOS is allowed to say). Mixing them produced constitutional contradictions. |
| **Discovery** | These are three independent axes: **Qualification State (S-axis)** measures governance maturity through SQO progression. **Evidence Capability (E-axis)** describes what intelligence substrate exists (E-STRUCTURAL → E-RUNTIME → E-SEMANTIC → E-GOVERNED). **Projection Authority (P-axis)** governs what PiOS is constitutionally allowed to project (P0-P4). Each axis is independently measurable. Authority flows: S → gates → E → grants → P. |
| **Constitutional Impact** | Foundational PiOS law. All projection governance derives from this separation. The P-axis — not the S-axis — is the governing authority for what consumers may render. |
| **Affected Components** | ProjectionAuthorityKernel (implements the model), PI_STATE_MACHINE_CONTRACT.md (documents it), all consumers (LENS, THORR, EIR, SW-INTEL) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_AUTHORITY_MODEL.md` |
| **Maturity State** | PROVEN — implemented in ProjectionAuthorityKernel.js, validated with 32 tests across both specimens. |

---

## Discovery 3: Projection Violation Doctrine

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Trigger** | Audit revealed StackStorm projecting 20 "operational conditions" at S1 structural qualification |
| **Problem** | PiOS had no concept of constitutionally invalid projection. All intelligence that existed was projected. There was no authority gate between evidence and consumer output. |
| **Discovery** | A projection violation exists whenever PiOS emits intelligence whose authority level exceeds the specimen's proven evidence capability. Projection violations are first-class governance concerns — not UI bugs, not rendering preferences, not error states. They are constitutional breaches of evidence authority. Intelligence may exist in the evidence layer but be legally unprojectable. |
| **Constitutional Impact** | Introduces `violations[]` as first-class output of the authority kernel. Enables "Suppressed Intelligence" as a governance feature: "14 conditions suppressed. Reason: Projection authority exceeded." Evidence is preserved. Only projection is constrained. |
| **Affected Components** | ProjectionAuthorityKernel (violation detection), future LENS rendering (suppression), future THORR (refusal with explanation), future EIR (chapter gating) |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_PROJECTION_VIOLATION_DOCTRINE.md` |
| **Maturity State** | PROVEN — kernel detects three violation classes (SPECIMEN_AUTHORITY, EVIDENCE_LINEAGE, BOTH). Validated: StackStorm P1 produces 14 violations, StackStorm P2 produces 14 lineage violations, BlueEdge P4 produces 4 lineage violations. |

---

## Discovery 4: Evidence-Governed Projection (Doctrine B)

| | |
|---|---|
| **Origin Stream** | PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01, Phase 1 review |
| **Trigger** | Challenge: "Should authority be granted by specimen capability alone, or should every condition prove its own authority lineage?" |
| **Problem** | Under Doctrine A (specimen-level authority), P2 specimen capability automatically authorized all P2 condition types regardless of their evidence lineage. A condition derived purely from structural enrichment could make "execution" claims simply because runtime evidence existed elsewhere in the specimen. |
| **Discovery** | Doctrine B: each condition must independently prove its authority from its own evidence lineage. `evidence_mode` maps to proven authority: STRUCTURAL_ENRICHMENT_DERIVED → proves P1, RUNTIME_EVIDENCE → proves P2, SIGNAL_DRIVEN → proves P3. Authorization requires BOTH specimen-level authority AND evidence lineage authority. The strongest formulation: "Even at P4, structural evidence cannot prove P2 execution claims." |
| **Constitutional Impact** | Transforms projection governance from capability-based to evidence-based. Prevents P-level from "magically upgrading" evidence. A weakly proven condition remains weakly proven regardless of specimen maturity. Three independent validation axes: requested authority, proven authority, specimen authority. |
| **Affected Components** | ProjectionAuthorityKernel (Doctrine B implementation), all condition producers (SignalSynthesisEngine rule functions), all consumers |
| **Intended Vault Destination** | `docs/pios/vault/constitutional/pios/PIOS_EVIDENCE_GOVERNED_PROJECTION.md` |
| **Maturity State** | PROVEN — implemented and tested. StackStorm: 12/26 authorized under Doctrine B (vs 26/26 under Doctrine A). BlueEdge: 17/21 authorized. |

---

## Discovery 5: Measurement Layer

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

## Discovery 6: Consumer / Application Separation

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

## Discovery 7: PiOS Kernel Emergence

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

## Registry Metadata

| | |
|---|---|
| **Discovery Period** | 2026-06-04 through 2026-06-07 |
| **Primary Streams** | PI.LENS-SURFACE-ACTIVATION-CONTRACT.01, PI.LENS-RUNTIME-SURFACES-INLINE.01, PI.LENS-COGNITION-CONTRACT-MODEL.01, PI.LENS-COGNITION-CONTRACT-TESTS.01, PI.SIGNAL-LAYER-BACKFILL.01, PI.PIOS-LAYER-CONSOLIDATION-AUDIT.01, PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01 |
| **Specimens Used** | StackStorm (run_github_st2_20260520_131000), BlueEdge (run_blueedge_genesis_e2e_03) |
| **Key Commits** | 513e593 (surface activation), 569f1be (CognitionContractModel), 86cd02c (signal backfill), 307b648 (PI_STATE_MACHINE_CONTRACT), 6367609 (ProjectionAuthorityKernel), 6cf9cda (Doctrine B) |
| **Propagation Target** | G1 stream: PIOS.CONSTITUTIONAL-KNOWLEDGE-CAPTURE.01 → `docs/pios/vault/constitutional/pios/` |

## Maturity Classification

| State | Meaning | Count |
|---|---|---|
| PROVEN | Implemented, tested, validated on both specimens | 4 |
| VALIDATED | Taxonomy complete, not yet implemented as separate layer | 1 |
| ARCHITECTURAL | Design locked, implementation pending | 1 |
| OPERATIONAL | Running in production code, location/naming may evolve | 1 |
