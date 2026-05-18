# Marketplace Impact Assessment

**Stream:** PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01
**Purpose:** Impact of the Client Onboarding Substrate on marketplace commercialization. Precision on "built today" claim. Advisory team positioning.

---

## 1. Irreducible Governance Statement

> **Semantic qualification is not a temporary onboarding inconvenience. It is an architecturally permanent governed layer.**

The advisory team's role in semantic ontology authoring is not a bridge to automation. It is the designed operational model. The irreducible boundary between structural automation (PATH A) and semantic judgment (PATH B) is a feature of the architecture, not a gap to be closed.

Future AI-assisted tooling may reduce the effort of semantic ontology authoring, but it cannot eliminate the human governance gate. The approval of domain boundaries, capability classifications, and component mappings requires business domain expertise that is external to source code structure.

---

## 2. "Built Today" Claim Precision

The marketplace strategy (frozen 2026-05-17) classifies STATIC capability as "Built today." This is accurate for PATH A and requires qualification for PATH B.

### PATH A: Fully Built, Fully General

| Capability | Status | Evidence |
|---|---|---|
| Structural scan (source → nodes → edges → clusters) | OPERATIONAL | structural_scanner.py — any archive |
| CEU grounding (nodes → grounded participation) | OPERATIONAL | ceu_grounding.py — any registry |
| DOM compression (grounded nodes → executive DOMs) | OPERATIONAL | Pipeline Phase 3-4, A5a/A5b |
| Structural signals (DOM-level pressure analysis) | OPERATIONAL | Signal computation (from DOM topology) |
| GAUGE scoring (structural coverage assessment) | OPERATIONAL | Gauge computation (from structural data) |
| Structural LENS projection (topology, signals, zones) | OPERATIONAL | GenericSemanticPayloadResolver (parameterized) |

**Claim: "Structural topology is built and general."** TRUE.

### PATH B: Built for BlueEdge, Requires Per-Client Authoring

| Capability | Status | Qualification |
|---|---|---|
| Semantic topology generation engine | OPERATIONAL | `build_semantic_layer.py` works. But input data is BlueEdge-specific. |
| Crosswalk engine | OPERATIONAL | `SemanticCrosswalkMapper.js` is parameterized. But crosswalk data is per-client. |
| Reconciliation engine | OPERATIONAL | `ReconciliationCorrespondenceCompiler.js` is parameterized. But inputs depend on crosswalk. |
| Semantic LENS projection | OPERATIONAL | Zone components are parameterized. But semantic data must exist. |
| Semantic ontology authoring | NOT BUILT | No CSR schema, no governed process, no tooling. THIS STREAM specifies it. |

**Claim: "Semantic qualification is built and general."** FALSE — semantics are built for BlueEdge; the per-client governed process for semantic ontology authoring is specified but not implemented.

**Corrected claim: "The semantic qualification ENGINE is built and general. Semantic qualification DATA requires per-client advisory authoring through a governed process now specified."**

---

## 3. Tier 1A Output Readiness with CSR Substrate

**Tier 1A = Signäl/PMO: Governance Entry Wedge** (advisory-led, per-program structural assessment)

| Output | PATH A Only (S1) | PATH A + CSR (S2+) | Delta |
|---|---|---|---|
| Structural topology report | YES | YES | No change |
| DOM boundary map | YES | YES | No change |
| Structural signal assessment | YES | YES | No change |
| GAUGE posture score | YES | YES | No change |
| Semantic domain classification | NO | YES | CSR enables |
| Crosswalk correspondence | NO | YES | CSR + crosswalk enable |
| Reconciliation quality (Q-class) | NO | YES | Full chain required |
| Structural Execution Visibility Report | PARTIAL (structural only) | FULL | Semantic sections require CSR |
| Guided interrogation (full lattice) | PARTIAL (~60% of queries) | FULL (all 36 queries) | Semantic queries need data |

**Assessment:** Tier 1A can BEGIN with PATH A only (S1). The Structural Execution Visibility Report has structural value at S1. Full semantic depth requires CSR authoring (S2+). This creates a natural two-stage commercial engagement:

1. **Stage 1 (immediate):** Structural assessment with PATH A. Deliverable: structural topology, signals, GAUGE, DOM map. Value: "you can see your structural reality."
2. **Stage 2 (advisory engagement):** Semantic authoring with CSR. Deliverable: full reconciliation, Q-class, semantic depth. Value: "you can understand your operational domains."

---

## 4. Effort Model

### Current State (No CSR)

| Step | Effort | Who |
|---|---|---|
| Client evidence acquisition | 1-3 days | Advisory + client |
| PATH A execution | Minutes (automated) | System |
| Semantic domain identification | 3-5 days (manual, ad hoc) | Advisory team |
| Crosswalk construction | 1-2 days (manual) | Advisory team |
| Reconciliation | Minutes (automated) | System |
| Total per-client | ~5-10 working days | Advisory team dominates |

### Target State (With CSR Substrate)

| Step | Effort | Who | Improvement |
|---|---|---|---|
| Client evidence acquisition | 1-3 days | Advisory + client | No change |
| PATH A execution | Minutes (automated) | System | No change |
| Semantic ontology authoring (CSR) | 2-4 days (governed process) | Advisory team | Structured, repeatable, versionable |
| Semantic topology generation | Seconds (automated from CSR) | System | NEW — eliminates manual generation |
| Crosswalk auto-proposal | Minutes (automated) | System | NEW — reduces advisory effort by ~50% |
| Crosswalk review | 2-4 hours (human review of proposals) | Advisory team | Proposals reduce search space |
| Reconciliation | Seconds (automated) | System | No change |
| Total per-client | ~3-7 working days | Advisory team still dominates, but process is governed and repeatable |

**Net improvement:** ~30-40% effort reduction per client. The improvement is not from removing human judgment but from structuring it within a governed process with auto-proposal support.

---

## 5. Advisory Team as Architecturally Permanent

The advisory team is NOT a temporary bridge to full automation. The advisory team IS the semantic governance layer.

### Why Advisory is Permanent

1. **Semantic domain identification requires business context.** Code structure reveals structural patterns, not business intent. An analyst examining `VehiclesModule` needs to know whether the client's business treats it as "Fleet Management," "Asset Tracking," or "Logistics."

2. **Capability classification requires strategic judgment.** Whether a module is "CORE" vs "SUPPORTING" depends on the client's business priorities, not code complexity metrics.

3. **Cross-domain relationships require organizational knowledge.** Whether OTA firmware updates belong to "Edge Data Acquisition" or "Device Management" depends on organizational structure.

4. **Confidence thresholds require calibration.** Crosswalk auto-derivation proposals need client-specific confidence threshold tuning based on the client's structural characteristics.

5. **Review gates require domain authority.** CSR approval requires someone with authority over the client's semantic model. This is a governance function, not a technical one.

### Advisory Role Evolution (Not Elimination)

| Phase | Advisory Role | Tooling |
|---|---|---|
| Current | Ad hoc domain identification, manual crosswalk | None — pure expertise |
| With CSR | Governed ontology authoring within CSR schema | CSR schema + validation |
| With auto-derivation | Review proposals instead of creating from scratch | Auto-derivation engine |
| Future (multi-client) | Pattern library from prior engagements, faster authoring | Cross-client pattern recognition |

---

## 6. STATIC Capability Claim Precision for PATH B

**Per marketplace strategy (frozen 2026-05-17):**
> STATIC = topology + propagation + qualification + signal activation. CANONICAL_RUNTIME_ACTIVE. Built today.

**Precision:**
- **PATH A STATIC:** Built and general. Any client can produce structural topology, propagation analysis, and signal activation from source evidence alone. ✓
- **PATH B STATIC:** Built for BlueEdge. Any NEW client requires semantic ontology authoring (CSR) before PATH B STATIC capabilities activate. The engines are built and general; the per-client data input requires advisory engagement. ✓ with qualification.

**The claim "Built today" is accurate for:**
- The structural qualification engine
- The semantic qualification engine
- The reconciliation engine
- The projection engine
- The LENS consumption chain

**The claim "Built today" requires qualification for:**
- Per-client semantic data (requires CSR authoring)
- Per-client crosswalk (requires construction + review)
- Per-client reconciliation (follows from crosswalk)

---

## 7. Phase 0/1A/1B Impact Mapping

| Strategic Phase | Impact of CSR Substrate |
|---|---|
| Phase 0A (GitHub substrate operationalization) | PATH A generalizes directly. S1 achievable for GitHub repos without CSR. Structural assessment fully automated. |
| Phase 0B (Commercial projection refinement) | LENS projection at S1 (structural-only) delivers meaningful commercial value. Demo choreography possible without CSR. |
| Phase 1A (Signäl/PMO entry) | Two-stage engagement: structural assessment (immediate) → semantic authoring (advisory). CSR substrate enables the second stage as a governed, repeatable process. |
| Phase 1B (Signäl/Engineering substrate-native) | Same two-stage model. GitHub evidence → structural → CSR → full semantic depth. Engineering clients benefit from auto-derivation proposals. |

---

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01 |
| Derived from | PIOS_CURRENT_CANONICAL_STATE.md (marketplace status), BLUEEDGE_CERTIFICATION_VERDICT.md §2.4 (marketplace readiness) |
| Verification date | 2026-05-18 |
