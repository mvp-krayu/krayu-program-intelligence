# Layer Model and State Transitions

**Stream:** PI.SQO.STRATEGIC-ROADMAP-AND-LAYER-RECONCILIATION.01
**Status:** STRATEGIC ARTIFACT — NON-EXECUTABLE
**Date:** 2026-05-12

---

## 1. Layer Responsibility Separation

The system conflates several distinct concerns. This section defines precise boundaries.

### Layer 1: Evidence Ingestion

**Responsibility:** Accept external evidence, validate format, compute hashes, classify source type, produce evidence registry.

**What it guarantees:** Evidence is present, parseable, and hash-verified. Source class is classified.

**What it does NOT guarantee:** Evidence is relevant, complete, or structurally binding.

**Existing implementation:**
- BlueEdgeEvidenceIngestionLoader.server.js
- ExplicitEvidenceRebaseExtractor.server.js (ingestion phase)
- evidence_sources.yaml (source configuration)

**Governance boundary:** Read-only ingestion. No semantic interpretation. No grounding claims. Fail-closed on missing or malformed evidence.

---

### Layer 2: Semantic Reconstruction

**Responsibility:** Extract semantic candidate signals from ingested evidence. Produce a non-authoritative semantic domain model with candidate labels, types, and domain mappings.

**What it guarantees:** Candidates are traceable to evidence source spans. Extraction is deterministic and replayable. Domain mappings use keyword-based resolution.

**What it does NOT guarantee:** Candidates are correct, complete, or structurally grounded. Domain mappings may produce UNMAPPED_CANDIDATE.

**Existing implementation:**
- ExplicitEvidenceRebaseExtractor.server.js (extraction phase: extractFromArchitecture, extractFromPMO, extractFromCompetitive)
- BlueEdgeSemanticCandidateExtractor.server.js (pre-rebase, superseded)
- SemanticActorHydrator (LENS v2 15-actor model)

**Governance boundary:** Deterministic extraction only. No fabrication. No probabilistic interpretation. All candidates marked NON_AUTHORITATIVE_SEMANTIC_CANDIDATE.

---

### Layer 3: Semantic Hydration

**Responsibility:** Enrich semantic candidates with business labels, crosswalk mappings, signal projections, and qualification classification. Produce an operationally useful semantic model.

**What it guarantees:** Internal coherence across semantic domains. Business-facing labels. Signal-backed severity assessment. Q-class qualification with governance disclosure.

**What it does NOT guarantee:** Structural grounding for every semantic claim. Authority for downstream publication.

**Existing implementation:**
- SemanticCrosswalkMapper (DOM-XX → business label translation)
- QClassResolver (Q-01 through Q-04 qualification)
- DPSIGSignalMapper (signal stack projection)
- BlueEdgePayloadResolver → GenericSemanticPayloadResolver (payload assembly)

**Governance boundary:** Pure data translation and classification. Q-class is deterministic from grounding ratio. No fabrication of grounding. Mandatory disclosure for partial grounding (Q-02) and semantic-only (Q-03).

**This is the HYDRATED state.** The system's most valuable operational output.

---

### Layer 4: Crosswalk Reconciliation

**Responsibility:** Establish correspondence between semantic domain claims and structural registries. Produce a reconciliation report showing which semantic domains have structural evidence.

**What it guarantees:** Correspondence is documented and auditable. Each semantic domain has a reconciliation status.

**What it does NOT guarantee:** Structural proof. Correspondence does not equal grounding.

**Existing implementation (partial):**
- SemanticCrosswalkMapper provides label-level correspondence
- semantic_continuity_crosswalk.json contains entity mappings
- No programmatic reconciliation compiler yet

**Planned evolution:** Crosswalk reconciliation compiler that maps DOM-XX clusters to CLU/CAP/vault registries and produces per-domain correspondence evidence.

---

### Layer 5: Structural Grounding

**Responsibility:** Verify structural backing for semantic claims. Produce grounding certificates.

**What it guarantees:** Structural evidence exists for claimed semantic domains. Evidence is vault-anchored or topology-verified.

**What it does NOT guarantee:** Semantic interpretation correctness. Grounding proves structure exists, not that the semantic label is the right interpretation.

**Existing implementation (partial):**
- Grounding ratio computation in QClassResolver
- Vault anchors for some domains
- PATH A topology reports

**Key distinction:** Grounding is structural evidence. Hydration is semantic coherence. They are complementary, not sequential prerequisites. The system can deliver value at HYDRATED without blocking on complete grounding.

---

### Layer 6: SQO Qualification

**Responsibility:** Assess operational maturity of a client run across multiple dimensions. Manage S-state transitions. Track semantic debt. Evaluate progression readiness.

**What it guarantees:** Deterministic S-state classification. Auditable debt inventory. Replay-verified qualification state.

**What it does NOT guarantee:** Semantic correctness. SQO qualifies the process maturity, not the truth of semantic claims.

**Existing implementation:**
- SQOCockpitStateResolver (S0→S3 state machine)
- 18 SQO engines (debt, maturity, continuity, progression, gravity, replay, etc.)
- QualificationVisualStateResolver (severity classification)
- Operational attention / workflow / cognitive grouping resolvers

---

### Layer 7: Admissibility Evaluation

**Responsibility:** Evaluate whether semantic candidates may proceed to overlay proposal. Assess structural compatibility, replay safety, and conflict status.

**What it guarantees:** Admissibility is governance-evaluated. Each candidate has ADMISSIBLE, QUARANTINED, or REJECTED status with documented reasoning.

**What it does NOT guarantee:** Admissible candidates are correct. Admissibility is a process gate, not a truth assertion.

**Existing implementation:**
- ExplicitEvidenceRebaseExtractor.server.js (evaluateAdmissibility function)
- DynamicCEUAdmissibilityEvaluator.server.js (pre-rebase, superseded)
- DynamicCEUAdmissibilityViewModel

---

### Layer 8: Authority Promotion

**Responsibility:** Promote certified semantic claims to authoritative status. Grant publication eligibility.

**What it guarantees:** Authority is explicitly granted through governance gate. Audit trail is complete.

**Existing implementation:** NOT YET IMPLEMENTED. This is Phase 4 territory.

---

### Layer 9: Publication / LENS Activation

**Responsibility:** Render authoritative semantic content for downstream consumption. Bind to LENS runtime surfaces.

**What it guarantees:** Published content has passed all governance gates.

**Existing implementation (partial):**
- LENS v2 flagship surface renders HYDRATED content with Q-class disclosure
- No formal authority gate currently enforced (renders at Q-02/Q-03 with disclosure)

**Strategic note:** The current behavior — rendering HYDRATED content with honest qualification — is the correct near-term approach. Blocking rendering until AUTHORITY is achieved would destroy operational value.

---

## 2. Semantic Trustworthiness State Progression

```
NONE
  │
  ▼
HYDRATED ─────────────── Semantic reconstruction complete.
  │                       Internal coherence high.
  │                       No structural proof required.
  │                       Q-03 (semantic-only) or Q-02 (partial grounding).
  │                       Executive surface renderable with disclosure.
  │
  ▼
RECONCILED ──────────── Crosswalk correspondence established.
  │                       Semantic domains mapped to structural registries.
  │                       Correspondence documented, not proven.
  │                       Transition gate: reconciliation compiler report.
  │
  ▼
PARTIAL ─────────────── At least one structural anchor per domain cluster.
  │                       Vault or topology evidence for primary domains.
  │                       Q-02 with reduced disclosure scope.
  │                       Transition gate: per-domain grounding evidence.
  │
  ▼
STRONG ──────────────── Majority of domains structurally grounded.
  │                       Vault-backed evidence for most semantic claims.
  │                       Q-01 achievable for grounded subset.
  │                       Transition gate: grounding coverage threshold.
  │
  ▼
EXACT ───────────────── All domains structurally grounded.
  │                       Replay verification passed for full chain.
  │                       Q-01 system-wide.
  │                       Transition gate: complete replay verification.
  │
  ▼
CERTIFIED ───────────── Governance certification issued.
  │                       Audit trail complete.
  │                       Immutable certification artifact produced.
  │                       Transition gate: governance review.
  │
  ▼
AUTHORITY ───────────── Publication eligibility granted.
  │                       Downstream binding authorized.
  │                       Transition gate: authority promotion protocol.
  │
  ▼
LENS ────────────────── Bound to runtime surfaces.
                          Authoritative rendering.
                          No disclosure required.
```

---

## 3. Existing System Mapping to State Model

### BlueEdge (Current Client)

| Layer | State | Evidence |
|---|---|---|
| Evidence Ingestion | COMPLETE | 3 HTML files ingested, hash-verified |
| Semantic Reconstruction | COMPLETE | 100+ candidate signals extracted |
| Semantic Hydration | HYDRATED | 15-actor model rendered, Q-02 qualified |
| Crosswalk Reconciliation | PARTIAL | SemanticCrosswalkMapper operational, no formal reconciliation |
| Structural Grounding | PARTIAL | Some vault anchors, grounding ratio computed |
| SQO Qualification | S2_QUALIFIED_WITH_DEBT | 15 debt items tracked |
| Admissibility | COMPLETE | Candidates evaluated (ADMISSIBLE/QUARANTINED/REJECTED) |
| Authority Promotion | NOT STARTED | No authority chain implemented |
| Publication / LENS | HYDRATED RENDERING | Renders with Q-02 disclosure |

### FastAPI (Second Client)

| Layer | State | Evidence |
|---|---|---|
| Evidence Ingestion | COMPLETE | 15 SQO v1.json artifacts |
| Semantic Reconstruction | COMPLETE | Via SQO artifact chain |
| Semantic Hydration | PARTIAL | SQO cockpit renders, no LENS v2 surface yet |
| Crosswalk Reconciliation | NOT STARTED | No crosswalk data for FastAPI |
| Structural Grounding | NONE | No vault anchors |
| SQO Qualification | S1_ONBOARDING_REQUIRED | Projection-blocked |
| Admissibility | NOT APPLICABLE | No extraction corridor for FastAPI yet |
| Authority Promotion | NOT STARTED | — |
| Publication / LENS | NOT STARTED | — |

---

## 4. Existing Artifact Reconciliation Matrix

This maps every existing system component to its layer responsibility.

| Component | Layer | Concern | Current Status |
|---|---|---|---|
| evidence_sources.yaml | L1: Ingestion | Evidence source configuration | Operational |
| BlueEdgeEvidenceIngestionLoader | L1: Ingestion | Evidence registry production | Operational |
| ExplicitEvidenceRebaseExtractor (ingestion) | L1: Ingestion | HTML evidence ingestion | Operational |
| ExplicitEvidenceRebaseExtractor (extraction) | L2: Reconstruction | Candidate signal extraction | Operational |
| BlueEdgeSemanticCandidateExtractor | L2: Reconstruction | Pre-rebase extraction (superseded) | Superseded |
| SemanticActorHydrator | L3: Hydration | 15-actor semantic model | Operational |
| SemanticCrosswalkMapper | L3: Hydration + L4: Reconciliation | Label translation | Operational |
| QClassResolver | L3: Hydration | Q-class governance classification | Operational (locked) |
| DPSIGSignalMapper | L3: Hydration | Signal stack projection | Operational |
| GenericSemanticPayloadResolver | L3: Hydration | Payload assembly | Operational |
| SQOCockpitStateResolver | L6: Qualification | S-state machine | Operational |
| SQO engines (18 modules) | L6: Qualification | Debt/maturity/progression | Operational |
| QualificationVisualStateResolver | L6: Qualification | Severity classification | Operational |
| evaluateAdmissibility() | L7: Admissibility | Structural compatibility evaluation | Operational |
| DynamicCEUAdmissibilityEvaluator | L7: Admissibility | Pre-rebase admissibility (superseded) | Superseded |
| BlueEdgeRuntimeCorridorLoader | L6: Qualification | Overlay/replay/rollback | Operational |
| SQO Cockpit UI (51 components) | L9: Publication | Executive rendering | Operational |
| LENS v2 flagship page | L9: Publication | Executive surface | Operational |

---

## 5. Conflation Points Requiring Separation

### 5.1 Extraction vs. Admissibility

Currently coupled in ExplicitEvidenceRebaseExtractor.server.js. The same file ingests evidence, extracts candidates, AND evaluates admissibility. These are three distinct layers (L1, L2, L7).

**Recommendation:** Extraction and admissibility should eventually be separate modules. The current coupling is acceptable for BlueEdge-specific implementation but will not scale to multi-client multi-evidence-source operation.

### 5.2 Hydration vs. Qualification

LENS v2 hydration (SemanticActorHydrator) and SQO qualification (SQOCockpitStateResolver) operate independently. This is correct. But they share no formal interface — the LENS surface doesn't know the SQO state, and the SQO cockpit doesn't know the LENS hydration level.

**Recommendation:** Define a shared semantic maturity indicator that both systems can reference. Not coupling — a shared read-only status.

### 5.3 Crosswalk Translation vs. Crosswalk Reconciliation

SemanticCrosswalkMapper is a display-layer translator. It is NOT a reconciliation engine. But it is the closest thing the system has to reconciliation infrastructure.

**Recommendation:** Keep the mapper as display-layer translation. Build reconciliation as a separate compiler that consumes the same crosswalk data plus structural registries and produces correspondence evidence.

### 5.4 Pre-Rebase vs. Post-Rebase Extractors

Two parallel extraction pipelines exist: the original BlueEdgeSemanticCandidateExtractor.server.js and the rebase-based ExplicitEvidenceRebaseExtractor.server.js. The child routes now use the rebase extractor, but the old extractor remains.

**Recommendation:** Formally deprecate the pre-rebase extractors. Mark them as historical lineage. Do not delete (preserves audit trail). No new routes should reference them.
