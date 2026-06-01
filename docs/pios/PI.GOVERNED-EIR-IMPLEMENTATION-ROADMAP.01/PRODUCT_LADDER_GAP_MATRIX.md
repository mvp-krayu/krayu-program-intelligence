# Product Ladder Gap Matrix — signal-pi.com vs Implementation Reality

> **Context:** The signal-pi.com product ladder was written against earlier LENS versions. LENS v2 has substantially evolved — current capabilities in many areas EXCEED what was originally promised. This matrix distinguishes between genuine capability gaps, promise language that needs updating to reflect stronger current reality, and features that are architecturally present but not surfaced in the expected form.

**Assessment date:** 2026-06-01  
**Assessed against:** BlueEdge genesis_e2e_03, LENS v2 flagship, EIR, SW-INTEL, OPERATOR, Investigation Protocol

---

## Tier 1 — LENS Assessment ("What is true")

**Original positioning:** Structural truth about a program. Executive-grade. No opinions, no AI theater.

| # | Promise | Status | Current Implementation | Evidence | Gap / Evolution Note | Effort |
|---|---------|--------|----------------------|----------|---------------------|--------|
| 1.1 | Executive structural view | **EXCEEDS** | BoardroomProjectionCompiler produces governed 3-panel narrative (posture/topology/intelligence). GoverningNarrativeComposer adds spine-grounded narrative arc. | `BoardroomProjectionCompiler.js:466`, `GoverningNarrativeComposer.js:194` | Original promise imagined a summary view. Current implementation delivers multi-panel governed cognition projection with disclosure sequencing. | 0 — done |
| 1.2 | Structural topology | **EXCEEDS** | StructuralTopologyZone renders interactive SVG topology with domain nodes, cluster grouping, edge relationships, pressure-zone glyphs, hover inspection, and authoritative SVG capture for export. | `StructuralTopologyZone.jsx:233`, commit `3cf76de` (topology capture) | Original promise was "show topology." Current: interactive governed topology with pressure zones, constriction detection, fragility marking, and export capability. | 0 — done |
| 1.3 | Domain-level intelligence | **EXCEEDS** | Multi-layer domain intelligence: semantic_domain_registry (domain grounding), domain_concentration (risk profiling), propagation zones (cross-domain flow), SW-INTEL per-domain cognition surfaces. | `ConsequenceCompiler.js`, `SoftwareIntelligenceProjectionAdapter.js`, `IntelligenceField.jsx` | Far beyond "domain-level" — delivers cross-domain propagation analysis, concentration risk, and SW-INTEL behavioral consequence ontology. | 0 — done |
| 1.4 | Decision-ready narrative | **EXCEEDS** | EIR (ExecutiveIntelligenceSynthesis) produces 9-chapter, ~15-20 named findings with observed/matters/operational_implication/leadership_implication per finding. GoverningNarrativeComposer delivers spine-grounded narrative for BOARDROOM. | `ExecutiveIntelligenceSynthesis.js` (933 lines, 9 chapters), `GoverningNarrativeComposer.js:194` | Original promise: "decision-ready narrative." Current: governed multi-chapter executive intelligence report with structural grounding and disclosure wrapping. Categorically stronger. | 0 — done |
| 1.5 | Structural Score (e.g. "60/100") | **PARTIALLY EXISTS** | `readiness_summary.score` exists as a numeric field passed through from governance substrate. Rendered in INVESTIGATION evidence export as bar at `score/100`. NOT surfaced in BOARDROOM or BALANCED personas. | `InterrogationTrailBuilder.js:487,737`, `structuralPosture.js:63` | The score exists but is not projected to the executive surface. This is a projection gap, not a computation gap — the data is present, the BOARDROOM rendering omits it. | **S — 2h** Add score projection to BOARDROOM posture panel |
| 1.6 | Achievable Ceiling (e.g. "100/100") | **EVOLVED** | `operational_ceiling` materializer produces qualitative ceiling: PRESENT/ABSENT, ceiling_drivers (top-5 consequences by severity), critical_convergence flag. No numeric ceiling score. | `materializers/operationalCeiling.js`, `ExecutiveIntelligenceSynthesis.js` Chapter 7 | The original "100/100" promise assumed a numeric ceiling. Current architecture delivers something richer: a qualitative ceiling assessment with driver attribution. The numeric promise should be UPDATED to reflect governed ceiling posture, not a fake number. | **Decision:** Update product language to match governed ceiling posture, OR add derived numeric ceiling. Recommend: update language. |
| 1.7 | Focus Domain | **EXISTS** | `propagation_summary.primary_zone_business_label` identifies the dominant structural zone. Topology visualization highlights it. | `ConsequenceCompiler.js`, `StructuralTopologyZone.jsx` | Exact match. | 0 — done |
| 1.8 | Status label (e.g. "Structurally Verified") | **EVOLVED** | Governed badge system with 5 labels: "Executive Ready", "Executive Ready — Qualified", "Under Structural Review", "Not Available", "Pending Grounding". | `VisualSemanticMapper.js:22-52` | "Structurally Verified" doesn't exist. Current labels are MORE precise: they encode qualification posture, not a binary verified/not-verified. Product language should align to actual label vocabulary. | **S — 1h** Update signal-pi.com to use actual governed labels |
| 1.9 | Remaining items (e.g. "Runtime validation required") | **EXISTS** | `advancement_blockers` computed from `qualification_blockers`, surfaced in EIR Chapter 7 as "N advancement blockers require resolution." | `materializers/operationalCeiling.js:51-68`, `ExecutiveIntelligenceSynthesis.js:826-834` | Content is data-driven (blocker descriptions from substrate). The exact phrase "Runtime validation required" is not hardcoded — actual remaining items are specific and governed. This is better than the promise. | 0 — done |

### Tier 1 Verdict

**7 of 9 promises EXCEEDED or MET.** Two require minor work:
- Score projection to BOARDROOM (2h implementation)
- Product language alignment for ceiling/status (update signal-pi.com, not code)

**Tier 1 is substantially shippable.** The primary work is aligning the product ladder language to the actual (stronger) implementation, not building missing features.

---

## Tier 2 — Diagnostic Access ("Why it is true")

**Original positioning:** Everything in Tier 1, plus diagnostic depth. Capability-level topology. Evidence chains. Traceable claims.

| # | Promise | Status | Current Implementation | Evidence | Gap / Evolution Note | Effort |
|---|---------|--------|----------------------|----------|---------------------|--------|
| 2.1 | Everything in LENS (tier inheritance) | **PARTIALLY EXISTS** | Additive disclosure tier gating across adapters: EXECUTIVE → ADVISORY → AUDIT. Hash visibility, panel expansion, lineage depth all increase with tier. No formal tier inheritance object. | `DisclosureSequencingContract.js:45-80`, `SurfaceModeResolver.js:26-60`, `TracePanelAdapter.js:51` | Tier inclusion works implicitly through per-adapter conditionals. Not a formal tier-inheritance model, but functionally equivalent. | **S — 4h** Formalize as TierInheritanceContract if product language requires explicit tier stacking |
| 2.2 | Capability-level topology | **LEGACY ONLY** | Domain + Cluster topology in current StructuralTopologyZone. Capability-level exists ONLY in legacy 42.7 TopologyPanel (Domain → Capability → Component, 3 levels). | `StructuralTopologyZone.jsx` (domain/cluster), `TopologyPanel.js:582-732` (domain/capability/component) | Current LENS v2 topology operates at domain/cluster — a deliberate architectural choice (semantic clustering vs file-system hierarchy). Capability-level is a drill-down extension, not a missing foundation. | **M — 1-2 weeks** if capability-level is required. Could port from legacy TopologyPanel. Or: update product language to "semantic cluster topology" which is what current implementation delivers. |
| 2.3 | Evidence chain visibility | **EXISTS** | `OperatorTraceField` renders 4-step hash lineage: evidence_object_hash → derivation_hash → baseline_anchor → run_id. Tier-gated: EXECUTIVE sees no hashes, ADVISORY sees abbreviated (8 chars), AUDIT sees full. | `IntelligenceField.jsx:6205-6229`, `TracePanelAdapter.js:1-80` | Exact match with tier-gated disclosure — actually stronger than promised. | 0 — done |
| 2.4 | Traceable claim validation (L2/L3) | **PARTIALLY EXISTS** | L1/L2/L3 taxonomy defined (raw/structural/operational). Used as derivation classification labels in signal compiler. Displayed as metadata annotation. No per-claim trace depth selector UI. | `SoftwareIntelligenceProjectionAdapter.js:31`, `IntelligenceField.jsx:4131,4191` | Taxonomy exists, rendering exists, selector does NOT. The promise implies interactive drill-down by trace depth. Current implementation classifies but doesn't let users filter by it. | **M — 1 week** Add L2/L3 filter to OPERATOR mode evidence panel |
| 2.5 | Claim+Derived+TraceDepth output format | **DOES NOT EXIST** | No combined structured output format with these three fields. InterrogationTrailBuilder produces question→summary→evidence→boundary (narrative export), not claim-based format. | — | This format was conceived before the current architecture. The InterrogationTrailBuilder governed export is a stronger replacement concept. Product language should describe the actual governed evidence export format. | **Decision:** Retire this promise in favor of "Governed evidence trail export with structural grounding" which is what currently ships. |

### Tier 2 Verdict

**2 of 5 promises MET.** Three need work, but two are better addressed by updating product language to match the stronger current architecture than by building features to match outdated promises:
- Capability-level topology: decide if the domain/cluster model is the product (it may be superior) or if capability drill-down is required
- L2/L3 filter: genuine feature gap (1 week)
- Claim+Derived+TraceDepth: retire in favor of governed evidence trail export

---

## Tier 3 — Enterprise Access ("Interrogate it directly")

**Original positioning:** Full operator surface. Evidence vault. Program intelligence queries. Advanced interrogation.

| # | Promise | Status | Current Implementation | Evidence | Gap / Evolution Note | Effort |
|---|---------|--------|----------------------|----------|---------------------|--------|
| 3.1 | Full operator surface | **EXISTS** | OPERATOR_DENSE mode fully operational: signal intelligence, evidence trace lineage, topology explorer (modal), governance audit, SW-INTEL slot, expanded diagnostic/lineage regions. | `IntelligenceField.jsx:9085-9098`, `SurfaceModeResolver.js:43-50`, `DisclosureSequencingContract.js:59-65` | Complete. | 0 — done |
| 3.2 | Direct evidence vault access | **PARTIALLY EXISTS** | SQO cockpit has governed evidence route (`pages/sqo/.../evidence.js`), EvidenceReplayPanel renders replay verdicts and certification state. Not raw vault file access — governed view. | `pages/sqo/.../evidence.js`, `EvidenceReplayPanel.jsx` | "Direct evidence vault access" implies raw artifact browsing. Current implementation provides governed evidence VIEW, which is architecturally correct (raw vault access would bypass governance). Product language should say "governed evidence inspection" not "vault access." | **S — 2h** Update product language. OR if raw access is desired: link to governed artifact browser. |
| 3.3 | Program-level intelligence queries | **EXCEEDS** | GUIDED_QUERY_ANSWERS (zone-scoped structural queries) + INTERROGATION_EXPANSION_REGISTRY (mode-scoped depth expansions). Fully operational across all personas. Trail export via InterrogationTrailBuilder. | `IntelligenceField.jsx:2143` (queries), `:3121` (expansions), `InterrogationTrailBuilder.js:936` | Original promise: "queries." Current: governed multi-mode interrogation with structural grounding, expansion depth, and governed HTML evidence trail export. Categorically stronger. | 0 — done |
| 3.4 | Advanced interrogation capabilities | **EXISTS** | `piRuntimeActive` escalation: structural escalation conditions → authority change to PI_INTERPRETIVE → expansion registry activation → governed interpretive projection under 75.x. | `IntelligenceField.jsx:9121,9281-9288,9317-9321` | The escalation model (evidence-triggered, operator-authorized, governed) is more sophisticated than "advanced interrogation" suggests. Product language undersells. | 0 — done |
| 3.5 | Golden Query | **DOES NOT EXIST** | No "golden query" feature exists. Closest: GUIDED_QUERY_ANSWERS provides zone-scoped program-level synthesis. Domain-scoped filtering absent. | — | "Golden Query" as a named feature was never implemented. The concept (program-level synthesis with domain scoping) is partially served by the guided query system but without explicit domain filtering. | **M — 1-2 weeks** if this feature is retained. OR: rename/retire in favor of "Guided Structural Interrogation" which describes the actual capability. |

### Tier 3 Verdict

**3 of 5 promises MET or EXCEEDED.** Two need attention:
- Evidence vault access: update language from "direct vault access" to "governed evidence inspection" (product language, not code)
- Golden Query: decide if this is a real feature requirement or an outdated promise to retire

---

## Evolution Summary

### Where LENS v2 EXCEEDS Original Promises

| Area | Original Promise | Current Reality | Evolution Factor |
|------|-----------------|-----------------|------------------|
| Narrative | "Decision-ready narrative" | 9-chapter, 15-20 finding EIR with 4-field evidence grounding | 5-10x |
| Topology | "Structural topology" | Interactive SVG with pressure zones, constriction, fragility, governed export | 3-5x |
| Intelligence | "Domain-level intelligence" | Cross-domain propagation, concentration risk, SW-INTEL behavioral consequence ontology | 5x |
| Interrogation | "Intelligence queries" | Multi-mode governed interrogation with structural escalation, trail export, 75.x authority | 3-5x |
| Evidence | "Evidence chain visibility" | 4-step hash lineage, tier-gated disclosure, governed evidence trail HTML export | 2-3x |

### Genuine Gaps (require code work)

| Gap | Tier | Effort | Priority for Tier 1 Ship |
|-----|------|--------|-------------------------|
| Score projection to BOARDROOM | T1 | 2h | **YES** — visible in product screenshot |
| L2/L3 trace depth filter | T2 | 1 week | No — Tier 2 feature |
| Capability-level topology in LENS v2 | T2 | 1-2 weeks | No — Tier 2 feature |
| Golden Query | T3 | 1-2 weeks | No — Tier 3 feature |

### Product Language Updates (no code — update signal-pi.com)

| Current Promise Language | Recommended Update | Reason |
|--------------------------|-------------------|--------|
| "Achievable Ceiling 100/100" | "Operational ceiling posture with driver attribution" | Governed qualitative ceiling is stronger than a fake number |
| "Status: Structurally Verified" | Use actual governed labels: "Executive Ready" / "Under Structural Review" / etc. | 5-state label vocabulary is more precise |
| "Claim+Derived+TraceDepth" | "Governed evidence trail export with structural grounding" | InterrogationTrailBuilder delivers a stronger concept |
| "Direct evidence vault access" | "Governed evidence inspection" | Raw vault access bypasses governance — current approach is architecturally correct |
| "Golden Query" | "Guided structural interrogation" | Describes the actual capability (GUIDED_QUERY_ANSWERS + INTERROGATION_EXPANSION_REGISTRY) |
| "Capability-level topology" | "Semantic cluster topology with domain drill-down" | Current architecture uses semantic clustering, not file-system hierarchy — this is a design choice, not a gap |

---

## Minimum Work for Tier 1 Ship

### Code Work (4 hours total)

1. **Score projection to BOARDROOM** — 2h
   - Add `readiness_summary.score` to BoardroomProjectionCompiler posture panel
   - Display as governed readiness metric (not a vanity score)
   - Respect existing disclosure tier gating

2. **Verify EIR renders end-to-end** — 2h
   - Confirm EIR projection from PICP → PRE → consumer output path works for BlueEdge genesis_e2e_03
   - If PICP→PRE path not wired (currently uses direct synthesis): this becomes the EIR↔LENS integration model (productization deliverable #1)

### Product Language Work (signal-pi.com update)

- Update ceiling promise to governed posture language
- Update status labels to match actual governed badge vocabulary
- Update "remaining" language to reflect advancement blocker mechanism
- These are website content updates, not engineering

### What Does NOT Need to Change

- Topology — EXCEEDS promise
- Narrative — EXCEEDS promise
- Intelligence — EXCEEDS promise
- Focus domain — MET
- Tier 1 is **substantially shippable today** with 4h of code work and a website content refresh

---

## Cross-Reference: Productization Deliverables Informed by This Matrix

| Deliverable | Matrix Insight |
|-------------|---------------|
| 1. EIR ↔ LENS integration model | EIR exists (9 chapters, 15-20 findings). Gap: currently bypasses PRE, reads PICP directly. Integration = wire through PRE. |
| 2. BOARDROOM CIM implementation | BOARDROOM projection is operational. CIM gap: ~55% of forBoardroom() is leaked domain cognition (per COGNITION_LEAK_AUDIT.md). CIM extracts consumer synthesis from domain computation. |
| 3. BALANCED CIM implementation | Same leak pattern as BOARDROOM (~55%). CIM extracts narrative framing from domain computation. |
| 4. SW-INTEL visible manifestations | SW-INTEL toggle, teaser, full cognition surfaces ALL exist. Gap: consumption through formal PICP objects (currently reads pre-PICP data). |
| 5. End-to-end customer journey | Tier 1 is shippable. Journey: onboard → assess → reveal → interrogate. Persona flow: BOARDROOM → BALANCED → DENSE → OPERATOR. |
| 6. Commercial packaging | Tier 1 product language needs update to match actual capabilities (which are STRONGER). Package as governed structural assessment, not dashboard. |
