# Semantic Qualification Roadmap

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This roadmap defines the phased delivery plan for Semantic Qualification Operations (SQO) from initial architecture through governed cognitive extension. Each phase specifies objectives, deliverables, runtime implications, governance implications, replay implications, UX implications, certification requirements, risk profile, and required substrate maturity.

No phase may be skipped. No phase may be declared complete without its certification artifact committed.

---

## 2. Phases

### Phase 1: ARCHITECTURE_FOUNDATION

**Objective:** Establish the foundational architecture, governance model, and lane boundaries for SQO.

**Deliverables:**
- SQO Lane Architecture document (lane model, boundary contract, interaction model)
- Qualification State Machine (S0/S1/S2/S3/S4+ definitions, transition rules, detection algorithm)
- Semantic Maturity Model (scoring framework, continuity scoring, gravity estimation)
- Projection Authorization Doctrine (gating rules, boardroom thresholds)
- Qualification Evidence Chain model (provenance rules, certification boundaries)
- Semantic Debt and Remediation model (debt taxonomy, remediation pathways)
- Replay-Safe Enrichment Model (additive persistence, replay compatibility)
- Runtime Qualification UX exploration (15 mandatory areas)
- Strategic Positioning document
- This roadmap

**Runtime implications:** None. No runtime changes. No API changes. No page changes. Architecture documentation only.

**Governance implications:** Establishes SQO as a formally recognized lane alongside Lane A, Lane D, and PATH B. Defines the boundary contract that all future SQO work must honor.

**Replay implications:** None. No replay artifacts produced or modified.

**UX implications:** None. No visual changes.

**Certification:** All architecture documents committed and internally consistent. No implementation required.

**Risk profile:** LOW. Documentation-only. No mutation of any existing artifact.

**Required substrate maturity:** N/A — phase is substrate-independent.

**Exit criteria:**
1. All architecture documents committed
2. Lane boundary contract complete and non-contradictory
3. State machine definitions deterministic and replay-safe
4. No governance contradiction with existing doctrine

---

### Phase 2: STATE_DETECTION_IMPLEMENTATION

**Objective:** Implement deterministic S-state detection for all registered client/run combinations.

**Deliverables:**
- `detectQualificationState()` function (deterministic, pure, replay-safe)
- Qualification state JSON artifact emitter (`artifacts/sqo/<client>/<run_id>/qualification_state.json`)
- Qualification history append-only log
- Integration with existing manifest registry
- E2E certification artifact for state detection

**Runtime implications:** New API endpoint or internal function that returns current S-state for any registered client/run. No modification to existing resolver, loader, or binding logic.

**Governance implications:** State detection must be a pure function of existing artifact evidence. Must not introduce new gating logic — reads existing Q-class resolution. Must comply with SQO boundary contract (READ ONLY from Lane A, Lane D, semantic pipeline).

**Replay implications:** State detection must be deterministic. Same manifest + same artifacts on disk → same S-state. Detection function must carry no hidden state.

**UX implications:** No direct UX changes in this phase. State detection is a backend capability.

**Certification:** E2E certification covering:
- BlueEdge at S2 (all 6 artifacts present, Q-02)
- FastAPI at S1 (3 artifacts missing, resolver REJECTED)
- Determinism check (re-run → identical output)
- Non-regression check (existing resolver behavior unchanged)

**Risk profile:** LOW-MEDIUM. New function reads existing artifacts. Risk: incorrect state classification. Mitigation: deterministic algorithm already defined in QUALIFICATION_STATE_MACHINE.md.

**Required substrate maturity:** At least one client at S1+ and one at S2+ for meaningful certification.

**Exit criteria:**
1. State detection produces correct S-state for all registered clients
2. Determinism verified
3. No mutation of any existing artifact
4. E2E certification committed

---

### Phase 3: SEMANTIC_DEBT_VISIBILITY

**Objective:** Implement semantic debt inventory and maturity scoring for all registered client/run combinations.

**Deliverables:**
- `semantic_debt_inventory.json` emitter (gap enumeration, remediation paths, priority scoring)
- `maturity_score.json` emitter (composite semantic maturity metric)
- `enrichment_recommendations.json` emitter (actionable guidance per client)
- `continuity_assessment.json` emitter (crosswalk gap analysis)
- Integration with state detection (Phase 2)
- E2E certification artifact for debt visibility

**Runtime implications:** New artifacts written to `artifacts/sqo/<client>/<run_id>/`. No modification to existing pipeline, resolver, or binding.

**Governance implications:** All debt assessments must be evidence-linked. No invented gaps. No speculative remediation. Debt inventory must reference specific missing or insufficient artifacts by key and path. Recommendations must be actionable and achievable through documented enrichment pathways.

**Replay implications:** Debt inventory must be deterministic from artifact evidence. Same artifacts → same debt inventory. Maturity score must be a deterministic composite of measurable dimensions.

**UX implications:** No direct UX changes. Debt inventory is a data artifact for future surface consumption.

**Certification:** E2E certification covering:
- BlueEdge debt inventory (unresolved grounding gaps enumerated)
- FastAPI debt inventory (3 missing required artifacts, 0/9 domain grounding)
- Maturity score determinism
- Enrichment recommendation evidence-linkage

**Risk profile:** MEDIUM. New scoring model requires careful calibration. Risk: misleading maturity scores. Mitigation: composite scoring defined in SEMANTIC_MATURITY_MODEL.md with transparent dimension weights.

**Required substrate maturity:** At least one client at each of S1 and S2 for meaningful debt comparison.

**Exit criteria:**
1. Debt inventory correctly enumerates all known gaps per client
2. Maturity scores are deterministic and evidence-linked
3. Enrichment recommendations reference documented pathways
4. No fabricated gaps or synthetic recommendations
5. E2E certification committed

---

### Phase 4: RUNTIME_QUALIFICATION_UX

**Objective:** Surface qualification state, semantic debt, maturity, and enrichment guidance through the executive projection surface.

**Deliverables:**
- S-state overlay on LENS v2 flagship surface
- Semantic maturity indicator (visual scoring)
- Semantic debt panel (gap enumeration with remediation paths)
- Enrichment guidance panel (actionable upload/enrichment recommendations)
- Qualification degradation alerts (backward transition warnings)
- Governance disclosure integration (Q-class + S-state combined disclosure)
- E2E certification artifact for runtime UX

**Runtime implications:** Visual additions to the LENS v2 flagship surface. No modification to existing resolver or binding logic. New UI components consume SQO artifacts (Phase 3 outputs). PATH B decides what to render — SQO advises only.

**Governance implications:** All UX elements must comply with Q02_GOVERNANCE_AMENDMENT.md disclosure obligations. No fabricated improvement projections. No synthetic timelines. Forbidden language rules apply (no "probabilistic", "AI confidence", etc.). Maturity indicators must be governance-classified (L1/L2/L3 layer).

**Replay implications:** UX rendering must be deterministic from SQO artifacts. Same artifacts → same visual state. No session-dependent rendering.

**UX implications:** Major. This phase makes qualification state visible to executives. Design must follow RUNTIME_QUALIFICATION_UX.md exploration areas. Advisory language must use the executive register defined in Q02_GOVERNANCE_AMENDMENT.md.

**Certification:** E2E certification covering:
- BlueEdge S2 surface renders correctly with Q-02 + maturity overlay
- FastAPI S1 surface renders structured rejection with debt panel
- Degradation alert renders on simulated backward transition
- No forbidden language in any rendered text
- Non-regression: existing BlueEdge flagship surface unchanged where SQO overlay is absent

**Risk profile:** HIGH. Executive-visible changes carry high false-positive risk. Mitigation: fail-closed rendering (missing SQO artifacts → no SQO overlay, not broken surface). PATH B retains projection authorization authority.

**Required substrate maturity:** At least one client at S2 for meaningful overlay rendering.

**Exit criteria:**
1. S-state, maturity, debt, and guidance visible on flagship surface
2. Governance disclosure obligations met
3. No forbidden language rendered
4. Fail-closed behavior on missing SQO artifacts
5. Non-regression verified
6. E2E certification committed

---

### Phase 5: PROJECTION_GATING_INTEGRATION

**Objective:** Integrate SQO qualification state into projection authorization decisions.

**Deliverables:**
- S-state-aware projection gating (SQO advises PATH B on projection authorization)
- Downgrade handling (S-state regression → disclosure update + potential projection restriction)
- Governance disclosure for gating decisions (why projection was authorized or restricted)
- `governance_disclosure.json` emitter (what the executive must know)
- Gate amendment contract (if new gating rules required)
- E2E certification artifact for gating integration

**Runtime implications:** SQO becomes an advisor to PATH B projection authorization. PATH B retains final authority. SQO advises on semantic readiness. No new mandatory gates without governance stream authorization.

**Governance implications:** This phase makes SQO operationally significant. Gating decisions must be governance-disclosed. SQO advisory must not silently override existing Q-class resolution. New gating rules require explicit gate amendment contracts per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §8.

**Replay implications:** Gating decisions must be replay-safe. Same S-state + same Q-class → same gating decision. No hidden gating state.

**UX implications:** Potential changes to projection authorization messaging. Executives see why projection was authorized at a given qualification level.

**Certification:** E2E certification covering:
- S2 client projection authorized with Q-02 qualifier
- S1 client projection denied with structured rejection
- S-state downgrade triggers disclosure update
- No silent gating (every decision governance-disclosed)

**Risk profile:** HIGH. Incorrect gating blocks legitimate projection or permits premature projection. Mitigation: SQO advises only — PATH B decides. Existing Q-class gating preserved.

**Required substrate maturity:** At least one client at S1 and one at S2.

**Exit criteria:**
1. SQO advisory integrated with PATH B projection authorization
2. All gating decisions governance-disclosed
3. No silent override of Q-class resolution
4. Downgrade handling tested
5. E2E certification committed

---

### Phase 6: ENRICHMENT_AUTOMATION

**Objective:** Implement governed enrichment automation — assistive tooling that helps clients progress through S-states without fabricating semantics.

**Deliverables:**
- Enrichment workflow engine (guided, not autonomous)
- Source material intake framework (what additional inputs accelerate S-state progression)
- Enrichment impact preview (show expected S-state change before execution)
- Governed re-run coordination (trigger semantic pipeline re-processing with enriched inputs)
- Upload guidance surface (what to provide, what format, what it enables)
- E2E certification artifact for enrichment automation

**Runtime implications:** New enrichment workflow surfaces. Potential integration with semantic pipeline for governed re-runs. No modification to Lane A, Lane D, or existing pipeline execution.

**Governance implications:** Enrichment automation must never fabricate semantic content. All enrichment must be source-material-driven. Re-runs must comply with pipeline_execution_manifest.json. Enrichment previews must be governance-disclosed ("if you provide X, the system expects Y"). No guaranteed outcomes — previews are projections based on enrichment pathway definitions.

**Replay implications:** Enrichment artifacts must be additive-only. Each enrichment cycle produces a new version. Prior versions retained. All enrichment carries provenance linkage to source material.

**UX implications:** New enrichment workflow UX. Upload guidance. Impact preview. Progress tracking.

**Certification:** E2E certification covering:
- Enrichment workflow produces valid SQO artifacts
- Source material intake does not fabricate semantic content
- Impact preview accurately reflects enrichment pathway definitions
- Re-run coordination respects pipeline execution manifest
- No Lane A or Lane D mutation

**Risk profile:** HIGH. Enrichment automation is the boundary between assistive tooling and autonomous AI synthesis. Mitigation: DYNAMIC_CEU_GOVERNANCE_MODEL.md constrains enrichment to evidence-linked assistance. No autonomous semantic generation.

**Required substrate maturity:** At least one client capable of S1→S2 transition (FastAPI is the reference case).

**Exit criteria:**
1. Enrichment workflow operational for at least one client
2. No semantic fabrication
3. Source material intake evidence-linked
4. Pipeline re-run governance-compliant
5. E2E certification committed

---

### Phase 7: GOVERNED_COGNITIVE_EXTENSION (S4+)

**Objective:** Extend SQO to support multi-signal-class cognitive surfaces — EXSIG, ORGSIG, FLOWSIG, RISKSIG.

**Deliverables:**
- Per-signal-class SQO qualification framework
- Multi-signal-class maturity scoring
- Signal-class lifecycle tracking (6-stage per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §3)
- Multi-layer executive surface with per-layer governance disclosure
- Extended S4+ state definitions and transition rules
- E2E certification artifact for cognitive extension

**Runtime implications:** Extended executive surface with multi-signal-class depth. Each signal class independently qualified. Per-layer governance disclosure visible.

**Governance implications:** Each new signal class must complete the full 6-stage extension lifecycle before projection. SQO qualifies each signal class independently. Multi-signal qualification does not override single-signal Q-class resolution.

**Replay implications:** Each signal class maintains independent replay-safe derivation. Cross-signal qualification must be deterministic from per-signal states.

**UX implications:** Multi-layer cognitive surface. Layer classification (L1/L2/L3) visible per signal class. Extended depth without loss of governance transparency.

**Certification:** Full E2E certification per signal class per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §9.

**Risk profile:** HIGH. Multi-signal interaction introduces combinatorial complexity. Mitigation: each signal class independently qualified. No cross-signal inference without explicit grounding.

**Required substrate maturity:** At least one client at S3 (no client has achieved S3 yet).

**Exit criteria:**
1. At least one new signal class qualified through SQO
2. Multi-signal maturity scoring operational
3. Per-layer governance disclosure visible
4. Full 6-stage lifecycle completed per signal class
5. E2E certification committed per signal class

---

## 3. Phase dependencies

```
Phase 1 ─→ Phase 2 ─→ Phase 3 ─→ Phase 4 ─→ Phase 5 ─→ Phase 6 ─→ Phase 7
ARCH        DETECT      DEBT        UX          GATE        ENRICH      S4+
```

Each phase requires the prior phase's exit criteria to be met. No phase may be started without its predecessor's certification artifact committed.

**Parallel opportunities:**
- Phase 3 (debt visibility) and Phase 4 (UX) may be partially parallelized — UX design can begin while debt artifacts are being finalized.
- Phase 5 (gating) and Phase 6 (enrichment) are strictly sequential — gating must be stable before enrichment automation touches projection authorization.

---

## 4. Risk summary

| Phase | Risk | Primary mitigation |
|-------|------|--------------------|
| 1 | LOW — documentation only | Internal consistency review |
| 2 | LOW-MEDIUM — incorrect state classification | Deterministic algorithm, E2E certification |
| 3 | MEDIUM — misleading maturity scores | Transparent dimension weights, evidence-linkage |
| 4 | HIGH — false-positive executive projection | Fail-closed rendering, PATH B authority preserved |
| 5 | HIGH — incorrect gating blocks/permits | SQO advises only, PATH B decides |
| 6 | HIGH — autonomous semantic fabrication | DYNAMIC_CEU_GOVERNANCE_MODEL.md constraints |
| 7 | HIGH — combinatorial signal-class complexity | Independent per-signal qualification |

---

## 5. Current state

Phase 1 is in progress (this document is a Phase 1 deliverable).

No client has achieved S3. BlueEdge is at S2. FastAPI is at S1. No other clients are registered.

Phase 2 implementation requires a separate IMPLEMENTATION stream contract. This roadmap does not authorize implementation.

---

## 6. Governance

This roadmap is an architecture artifact. It defines the phased plan for SQO delivery. It does not authorize any implementation work. Each phase requires an explicit stream contract before work begins.

The roadmap must be updated as phases complete. Completed phases are marked with their certification artifact path and completion date. Incomplete phases may be re-scoped by explicit governance amendment.
