# GENESIS to LENS Cognition Enrichment Map

Stream: PI.GENESIS.LENS-COGNITION-ENRICHMENT.01
Classification: FORENSIC / ARCHITECTURAL / NON-IMPLEMENTATION
Date: 2026-05-25
Depends on: PERSONA_COGNITION_TOPOLOGY_MAP.md (Phase 5), genesis_e2e_03 specimen
Canonical specimen: blueedge/run_blueedge_genesis_e2e_03

---

## 1. CURRENT COGNITION TO PRESERVE

### BOARDROOM — Compiled Executive Cognition

| Cognition Dimension | Current Implementation | Preserve |
|---------------------|----------------------|----------|
| Executive gravity | `finding_headline` + `tension_narrative` with module vocabulary | MANDATORY |
| Module hero moment | Opening verdict: "{zone} carries structural weight across {N} dimensions" | MANDATORY |
| Compiled projection | `BoardroomProjectionCompiler` — 9-step deterministic compilation | MANDATORY |
| Declaration authority | Footer + governance section: 75.x, L3, 13 prohibitions | MANDATORY |
| Signal family chips | DPSIG/PSIG/ISIG with executive readings | MANDATORY |
| Propagation chain visual | ORIGIN → PASS_THROUGH → RECEIVER with domain_alias | MANDATORY |
| Coverage ring | X of Y domains structurally grounded | MANDATORY |
| Governance legitimacy | Friction rate, enrichment count, legitimacy sentences | MANDATORY |
| 4 executive queries | Posture conditions, confidence boundary, pressure concentration, band advancement | MANDATORY |
| Compressed maturity | S-level badge + qualification posture as gate | MANDATORY |

### BALANCED — Operational Emergence Cognition

| Cognition Dimension | Current Implementation | Preserve |
|---------------------|----------------------|----------|
| Emergence orchestration | 8 emergence functions with P/S/T classification | MANDATORY |
| Disclosure-wrapped authority | Every interpretive output governance-wrapped | MANDATORY |
| Executive synthesis | Lead paragraph from posture + topology + signals | MANDATORY |
| Evidence boundary reframe | "Confirmed unknowns — not assumed healthy states" | MANDATORY |
| Qualification compression | Band-vs-ratio gap diagnostic | MANDATORY |
| Pressure cognition | Multi-condition sentinel, zone + signal + severity | MANDATORY |
| Propagation consequence | ORIGIN/PASS_THROUGH/RECEIVER narrative | MANDATORY |
| Signal interpretation | Per-signal meaning-in-context prose | MANDATORY |
| 4 emergence queries | Structural evidence, emerged patterns, domain grounding, coverage | MANDATORY |
| Guided traversal | Interrogation trail recording | MANDATORY |
| Module embodiment | Domain aliases, signal family labels, cluster vocabulary | MANDATORY |
| Temporal cognition | Epoch strip, confidence trajectory | MANDATORY |
| Trust posture | Compact trust strip | MANDATORY |
| SQO Intelligence Zone | Blockage detection + resolution advisory | MANDATORY |

### EXECUTIVE_DENSE — Zone-Navigated Decomposition

| Cognition Dimension | Current Implementation | Preserve |
|---------------------|----------------------|----------|
| Zone orchestration | 7 zones (ST/CC/AL/SA/PF/PZ/GL), scroll-tracked | MANDATORY |
| 42 interrogation paths | 8 tones × 5 archetypes × 3 depths per zone | MANDATORY |
| Per-act boundary authority | Each query path carries `boundary` field | MANDATORY |
| Zone interpretations | 7 `derive(fullReport)` → heading/body/structuralNote | MANDATORY |
| Signal decomposition | Per-signal: family, name, severity, value (4 dec), interpretation | MANDATORY |
| Propagation chain (3 zones) | ST topology + AL absorption + PF flow strip | MANDATORY |
| InterrogationTrailBuilder | Governed HTML evidence record export | MANDATORY |
| Structural escalation | `STRUCTURAL_ESCALATION_CONDITIONS.dense` fires on asymmetry | MANDATORY |
| Zone exploration tracking | exploredQueries state, unexamined zone reporting | MANDATORY |
| 4 structural expansions | Dependencies, evidence chain, propagation, evidence gaps | MANDATORY |

### INVESTIGATION — Sequential Evidence Verification

| Cognition Dimension | Current Implementation | Preserve |
|---------------------|----------------------|----------|
| Fixed evidence sequence | ET→SS→SA→IP→GA→topology→TierHandoff | MANDATORY |
| Inference Prohibition zone | 13 prohibitions + qualifier/ALI rules | MANDATORY |
| TierHandoffStatement | Terminal governance closure | MANDATORY |
| TermHint dual-decode | 9 terms with executive + technical decoding | MANDATORY |
| InvestigationReadingGuide | Reading orientation preamble | MANDATORY |
| Signal audit table | Full per-signal table (ID, family, value, severity, interpretation) | MANDATORY |
| Governance audit (full) | Lifecycle, transitions, propositions, anchor, revalidation, enrichment, convergence, chronicle | MANDATORY |
| ReconDomainDrilldownTable | Per-domain L-level with enrichment drilldown | MANDATORY |
| ReconProvenance | deterministic/replay-safe/no-inference governance checks | MANDATORY |
| Structural backing detail | Named unresolved domain disclosure | MANDATORY |
| 4 forensic queries | Evidence gaps, propagation provenance, qualification boundaries, ungrounded claims | MANDATORY |

---

## 2. GENESIS / SPINE OBJECT INVENTORY

### Spine Object Classes (from `spine_objects.json` schema)

| Object Class | Path in Spine | Current Count (e2e_03) | Current Consumer | Missing Projection | Persona Relevance | Enrichment Priority |
|-------------|---------------|----------------------|-----------------|-------------------|-------------------|-------------------|
| `semantic_propositions` | `objects.semantic_propositions` | 85 | `projectPropositionCorpus()` → `proposition_corpus` | Per-proposition confidence evolution not projected; derivation_tier not surfaced in BALANCED | ALL | P1 |
| `evidence_objects` | `objects.evidence_objects` | 0 | `GoverningNarrativeComposer` → `proof_graph.evidence_objects` | Phase + artifact_path + evidence_class + node/edge counts → not materialized yet | BALANCED (narrative anchors), INVESTIGATION (evidence provenance) | P2 |
| `hero_moments` | `objects.hero_moments` | 0 | `GoverningNarrativeComposer` → `deriveNarrativeAnchors()` | No hero moments materialized — narrative falls back to structural enrichment | BOARDROOM (hero moment), BALANCED (emergence punctuation) | P1 |
| `replay_corridors` | `objects.replay_corridors` | 0 | None | No consumer exists | INVESTIGATION (native replay corridor) | P2 |
| `convergence_observations` | `objects.convergence_observations` | 0 (spine) / 9 (file) | `projectConvergenceIntelligence()` (from file, not spine) | Already projected; spine copy empty | INVESTIGATION (convergence audit) | LOW |
| `qualification_transitions` | `objects.qualification_transitions` | 0 | None | No consumer exists — S-state transitions visible in governance_lifecycle but not as spine trajectory | BALANCED (qualification movement), INVESTIGATION (governance audit) | P2 |
| `doctrine_evolution_records` | `objects.doctrine_evolution_records` | 0 | None | No consumer exists | INVESTIGATION (governance evolution proof) | P3 |
| `executive_projection_snapshots` | `objects.executive_projection_snapshots` | 0 | None | No consumer exists — would provide temporal comparison | BOARDROOM (temporal delta), BALANCED (enrichment trajectory) | P2 |

### Run-Level Governance Artifacts (Already Consumed by Resolver)

| Artifact | Path | Resolver Function | Current Consumer (Component) | Enrichment Opportunity |
|----------|------|-------------------|-------|----------------------|
| `promotion_state.json` | `sqo/` | `projectGovernanceLifecycle()` | InvestigationGovernanceAudit (GA section) | Fully consumed — no gap |
| `promotion_event_log.jsonl` | `sqo/` | `projectGovernanceLifecycle()` (transitions) | InvestigationGovernanceAudit (state transitions table) | Fully consumed — no gap |
| `revalidation_result.json` | `sqo/` | `projectRevalidationIntelligence()` | InvestigationGovernanceAudit (revalidation section) | Fully consumed — no gap |
| `constitutional_replay_anchor.json` | `sqo/` | `projectConstitutionalAnchor()` | InvestigationGovernanceAudit (constitutional anchor section) | Fully consumed — no gap |
| `proposition_review_state.json` | `semantic/spe/` | `projectPropositionCorpus()` | InvestigationGovernanceAudit (proposition corpus) | Fully consumed — no gap |
| `enrichment_summary.json` | `semantic/spe/` | `projectEnrichmentIntelligence()` | InvestigationGovernanceAudit (enrichment section) | Fully consumed — no gap |
| `debt_reassessment.json` | `semantic/spe/` | `projectEnrichmentIntelligence()` (debt sub) | InvestigationGovernanceAudit (debt table) | Fully consumed — no gap |
| `convergence_observations.json` | `convergence/` | `projectConvergenceIntelligence()` | InvestigationGovernanceAudit (convergence section) | Fully consumed — no gap |
| `chronicle_certification.json` | `chronicle/` | `projectChronicleCertification()` | InvestigationGovernanceAudit (chronicle section) | Fully consumed — no gap |

### Run-Level Artifacts NOT Yet Consumed by Resolver

| Artifact | Path | Schema Summary | Missing Consumer | Persona Relevance | Priority |
|----------|------|---------------|-----------------|-------------------|----------|
| `chronicle_events.jsonl` | `chronicle/` | Per-event: type, phase, timestamp, detail | No consumer — chronicle event stream not surfaced | INVESTIGATION (audit trail), BALANCED (emergence context) | P2 |
| Checkpoints (×16) | `chronicle/checkpoints/` | Per-checkpoint: phase state snapshot, validation, artifacts | No consumer — checkpoint sequence not surfaced | INVESTIGATION (replay corridor), Chronicle traversal | P3 |
| `reconciliation_event_log.jsonl` | `ceu/` | Per-event: domain, action, confidence delta, timestamp | No consumer — reconciliation events not projected | BALANCED (enrichment trajectory), INVESTIGATION (per-event audit) | P2 |
| `reconciliation_state.json` | `ceu/` | Current reconciliation posture, per-domain correspondence | Partially consumed via `projectReconciliation()` | Already consumed — minimal gap |
| `evidence_anchors.json` | `ceu/` | Evidence anchor → domain mapping | No consumer | INVESTIGATION (evidence provenance depth) | P3 |
| `derivation_lineage.json` | `ceu/` | CEU derivation chain | No consumer | INVESTIGATION (derivation proof) | P3 |
| `proposition_derivation_lineage.json` | `semantic/spe/` | Proposition → evidence derivation chain | No consumer | INVESTIGATION (proposition proof), BALANCED (derivation context) | P2 |
| `proposition_review_event_log.jsonl` | `semantic/spe/` | Per-review events: accept/reject/arbitrate with rationale | No consumer — individual review events not projected | INVESTIGATION (per-event audit), SQO cockpit | P2 |
| `enrichment_log.json` | `semantic/spe/` | Per-enrichment events with domain, before/after | Partially consumed via `enrichment_summary` — detail lost | INVESTIGATION (enrichment provenance), BALANCED (enrichment trajectory) | P2 |
| `enrichment_plan.json` | `semantic/spe/` | Planned enrichment targets with rationale | No consumer | DENSE (enrichment mechanics), INVESTIGATION (enrichment proof) | P3 |
| `enrichment_activity_event.json` | `semantic/spe/` | Enrichment execution events | No consumer | INVESTIGATION (enrichment audit) | P3 |
| `code_graph.json` | `structure/40.3s/` | Code graph with import/inheritance edges | Consumed via structural_enrichment but not as spine continuity | DENSE (structural mechanics) | LOW (already consumed differently) |
| `structural_centrality.json` | `structure/40.3c/` | Node centrality metrics | Consumed via structural_enrichment but not as spine continuity | DENSE (centrality decomposition) | LOW |
| `learning_activation_manifest.json` | `governance/` | Learning event activation record | No consumer | INVESTIGATION (learning proof), BALANCED (learning context) | P2 |
| `review_obligations.json` | `sqo/` | Obligation state (met/unmet) | Consumed via `projectPropositionCorpus()` (obligations_met/total) | Fully consumed — no gap |

---

## 3. PERSONA ENRICHMENT MAP

### BOARDROOM — 4 Microtraces ONLY

BOARDROOM must NOT become heavier. The enrichment is exactly 4 microtraces — one-line projections that restore harmful regression absences (Phase 2 Advisory) and connect to GENESIS continuity.

| Microtrace | Content | Source | Implementation |
|------------|---------|--------|---------------|
| **Trust tier** | Single word: STRONG / MODERATE / WEAK / INSUFFICIENT | `SemanticTrustPostureZone` posture.tier | Badge next to S-level in declaration or cockpit instruments |
| **Evidence boundary sentence** | "Intelligence qualified within explicit evidence boundaries — {N} domains are confirmed unknowns" | `grounding_ratio` from `compileDomainCoverage()` | One sentence in governance confidence narrative |
| **Confidence delta** | "Confidence: {current}% (from {baseline}% at intake)" | `enrichment_intelligence.mean_confidence_post` vs baseline | One metric in governance legitimacy section |
| **Advancement blocker** | "Advancement to {next_level} requires: {primary_blocker_summary}" | `promotion_state.hold_reason` | One sentence in governance confidence narrative |

**Module hero moment:** PRESERVED. `finding_headline` + `tension_narrative` remain the opening verdict. No GENESIS objects intrude on the hero moment surface.

**Chronicle/proof as descent affordance ONLY:** BOARDROOM may display a replay status chip ("CERTIFIED" / "REPLAY PASS") that DESCENDS into the Chronicle or INVESTIGATION audit when clicked. The chip is a traversal affordance, not a new panel.

**No new panels. No new sections. 4 lines of text + 1 word badge + 1 descent chip.**

### BALANCED — Emergence Enrichment via Spine Continuity

Preserve emergence orchestration. Enrich it using Spine continuity objects.

| Enrichment | Source Object | Cognitive Function Enriched | Integration Point |
|------------|-------------|---------------------------|-------------------|
| **Qualification movement** | `qualification_transitions` (spine, when materialized) OR `promotion_event_log.jsonl` | #5 Posture Synthesis, #20 Blockage Detection | SQO Intelligence Zone: show S-state TRAJECTORY not just state. "S0→S1 (intake qualification) → S2 (governed lifecycle)" |
| **Enrichment trajectory** | `enrichment_log.json` + `reconciliation_event_log.jsonl` | #16 Temporal Cognition, #21 Debt Evolution | ReconciliationAwarenessZone / ReconTrajectoryStrip: per-epoch enrichment events showing WHAT changed, not just THAT it changed |
| **Convergence context** | `convergence_observations.json` | #12 Governance Friction Detection | Emergence narrative: when convergence observations exist, governance friction narrative should note "friction pattern observed across N specimens" — enriches governance from single-specimen to cross-specimen |
| **Hero Moment punctuations** | `hero_moments` (spine, when materialized) | #4 Executive Synthesis, #7 Compound Activation | Emergence cascade: hero moments inject SURPRISE-CLASS punctuation into the narrative. "Discovery: topology reveals {surprise}" inserted at appropriate emergence weight |
| **Proposition derivation context** | `proposition_derivation_lineage.json` | #14 Evidence Boundary Qualification | Evidence boundary reframe enriched with derivation tier distribution: "N DIRECT_EVIDENCE, M DERIVED, K INFERRED" — makes the evidence boundary quantitatively richer |
| **Learning activation** | `learning_activation_manifest.json` | #17 Guided Cognition | New emergence query (5th): "What did the system learn from this specimen?" — derived from learning events, governed by the same 75.x authority |

**Operational cognition dominance PRESERVED:** Emergence orchestration remains the dominant cognitive architecture. GENESIS objects ENRICH existing cognitive functions — they do not create new panels, new zones, or new cognitive functions.

### EXECUTIVE_DENSE — Signal and Orchestration Enrichment

Preserve 42-path interrogation topology and zone architecture. Enrich signal and orchestration visibility.

| Enrichment | Source Object | Zone/Function Enriched | Integration Point |
|------------|-------------|----------------------|-------------------|
| **Signal maturation context** | `enrichment_log.json` (signal confidence before/after) | SA (Signal Assessment) zone interpretation | Zone interpretation for SA: add "signal confidence movement since intake" to structuralNote. Shows signals that STRENGTHENED or WEAKENED through enrichment |
| **Enrichment mechanics** | `enrichment_plan.json` + `enrichment_activity_event.json` | GL (Governance Lifecycle) zone | New guided query in GL: "What enrichment was applied and what changed?" — exposes the enrichment PROCESS, not just the outcome |
| **Qualification continuity** | `promotion_event_log.jsonl` | GL zone interpretation | GL zone interpretation enriched with transition history: "S0→S1→S2 through governed lifecycle" as temporal context |
| **Proposition tier distribution** | `semantic_propositions` (spine) | ST (Semantic Topology) zone | ST zone interpretation enriched with proposition tier overlay: per-domain derivation tier shows WHERE evidence is strong vs inferred |
| **Code graph visibility** | `code_graph.json` + `structural_centrality.json` | CC (Cluster Concentration) + AL (Absorption Load) | Already consumed as structural_enrichment. Enhancement: surface centrality-based "structural spine" nodes in CC zone interpretation as named high-centrality entities |
| **Orchestration evolution** | `reconciliation_event_log.jsonl` | New guided query path (43rd) | New query in ST zone: "How did reconciliation evolve this topology?" — traces domain movements through reconciliation epochs |

**42-path interrogation topology PRESERVED.** Enrichment adds 1-2 guided query paths (total: ~44) and deepens existing zone interpretations. No zone removal. No zone restructuring. No new zone creation.

### INVESTIGATION — Chronicle as Native Replay Corridor

INVESTIGATION is the persona where GENESIS enrichment is DEEPEST because INVESTIGATION's dominant stratum IS Governed Replay.

| Enrichment | Source Object | Investigation Component Enriched | Integration Point |
|------------|-------------|--------------------------------|-------------------|
| **Proposition review audit** | `proposition_review_event_log.jsonl` | GA (Governance Audit) → proposition corpus section | Per-review event rows below flagged items: reviewer, action, rationale, timestamp. Full audit trail of every governance decision. |
| **Replay corridor** | `replay_corridors` (spine, when materialized) OR `chronicle/checkpoints/` | New actor: RC (Replay Corridor) between GA and topology | Checkpoint sequence: 16 phases from learning_load → vault_readiness. Each checkpoint shows phase state, validation status, artifact delta. Fixed sequence. |
| **Chronicle event stream** | `chronicle_events.jsonl` | New actor: CE (Chronicle Events) within GA section | Chronological event stream showing WHAT HAPPENED in what order. Not interpretation — raw governed events. |
| **Enrichment lineage** | `enrichment_log.json` + `enrichment_activity_event.json` | GA → enrichment intelligence section | Per-enrichment event: domain, before confidence, after confidence, enrichment type, rationale. Forensic depth beyond the current aggregate. |
| **Proposition derivation proof** | `proposition_derivation_lineage.json` | New actor: DL (Derivation Lineage) between SS and SA | Per-proposition derivation chain: source evidence → derivation tier → confidence anchor. Proves WHERE each proposition came from. |
| **Evidence anchor detail** | `evidence_anchors.json` | ET (Evidence Trace) actor enrichment | Evidence trace expands from hash display to full anchor chain: evidence file → domain → capability → proposition |
| **Learning event proof** | `learning_activation_manifest.json` | GA → new sub-section: Learning Events | Learning events with activation type, target, proposed → reviewed → promoted lifecycle status |
| **Convergence evidence** | `convergence_observations.json` (already consumed) | GA → convergence section (already present) | Already fully consumed — no gap |
| **TermHint coverage expansion** | Vocabulary from across GENESIS artifacts | InvestigationReadingGuide + TermHint | Extend TERM_DECODE_MAP: add ISIG/DPSIG/PSIG, L1-L4, Q-00 through Q-04, ACCEPTED/REJECTED/ARBITRATED/CONTESTED, DIRECT_EVIDENCE/DERIVED/INFERRED |

**Proof-grade continuity PRESERVED.** INVESTIGATION remains the sequential verification surface. GENESIS enrichment adds depth to existing audit sections and materializes the replay corridor that INVESTIGATION was always architecturally designed for but never had as spine data.

---

## 4. SQO CONTINUITY MODEL

SQO is the operational qualification lifecycle. It is architecturally distinct from the Software Intelligence module. GENESIS enriches SQO continuity through deeper lifecycle projection.

### Current SQO Projection

| SQO Dimension | Current Source | Current Consumer | Current Projection |
|---------------|---------------|-----------------|-------------------|
| S-state | `promotion_state.json` → s_level | `governance_lifecycle.s_level` | InvestigationGovernanceAudit key-value, DeclarationZone badge |
| Transitions | `promotion_event_log.jsonl` | `governance_lifecycle.transitions` | InvestigationGovernanceAudit transitions table |
| Qualification provenance | `promotion_state.json` → qualification_provenance | `governance_lifecycle.qualification_provenance` | InvestigationGovernanceAudit key-value |
| Hold reason | `promotion_state.json` → hold_reason | `governance_lifecycle.hold_reason` | InvestigationGovernanceAudit key-value (warn style) |
| Promotion eligible | `promotion_state.json` → promotion_eligible | `governance_lifecycle.promotion_eligible` | InvestigationGovernanceAudit key-value |
| Authority ceiling | `promotion_state.json` → authority_ceiling | `governance_lifecycle.authority_ceiling` | InvestigationGovernanceAudit key-value |
| Revalidation | `revalidation_result.json` | `revalidation_intelligence` | InvestigationGovernanceAudit per-phase checks |
| Constitutional anchor | `constitutional_replay_anchor.json` | `constitutional_anchor` | InvestigationGovernanceAudit dimension table |
| Propositions | `proposition_review_state.json` | `proposition_corpus` | InvestigationGovernanceAudit (corpus, flagged) |
| Blockers | `qualification_blockers.json` (productized) / `hold_reason` (genesis) | SQO Intelligence Zone (BALANCED) | Hidden in BOARDROOM, present in BALANCED/DENSE |

### GENESIS Enrichment of SQO Continuity

| SQO Dimension | GENESIS Enrichment | Source | Persona Target |
|---------------|-------------------|--------|---------------|
| **S-state progression trajectory** | Full S0→S1→S2 history with timestamps and actors | `promotion_event_log.jsonl` | BALANCED (SQO zone enrichment), BOARDROOM (microtrace) |
| **Hydration evolution** | Evidence intake → structural verification → semantic derivation → governance lifecycle | `chronicle/checkpoints/` sequence | INVESTIGATION (replay corridor), DENSE (GL zone) |
| **Grounding movement** | Per-domain grounding change through reconciliation epochs | `reconciliation_event_log.jsonl` | BALANCED (temporal cognition enrichment), INVESTIGATION (per-domain audit) |
| **Reconciliation trajectory** | Epoch-level confidence evolution with per-domain delta | `reconciliation_state.json` + event log | BALANCED (ReconTrajectoryStrip enrichment) |
| **Confidence strengthening** | Pre-enrichment vs post-enrichment confidence with per-domain breakdown | `enrichment_summary.json` + `enrichment_log.json` | ALL (already partially consumed via enrichment_intelligence) |
| **Qualification hardening** | Revalidation pass history, constitutional anchor evolution | `revalidation_result.json` + `constitutional_replay_anchor.json` | Already consumed — minimal gap |
| **Advancement blockers** | Hold reason decomposition, constitutional dimension failures | `promotion_state.hold_reason` + `constitutional_replay_anchor.assessment.dimensions` | BOARDROOM (blocker microtrace), BALANCED (SQO zone) |
| **Maturity continuity** | Specimen maturity from intake through qualification through certification | `chronicle_certification.json` → governed_lifecycle_summary | ALL (maturity strip enrichment) |

### Key Separation: Software Intelligence Module ≠ SQO

| Concern | Software Intelligence Module | SQO Qualification |
|---------|------------------------------|-------------------|
| Nature | Domain module (substitutable) | Governance lifecycle (universal) |
| Vocabulary | "Platform Infrastructure", "cluster", "import dependency" | "S-level", "promotion", "revalidation", "authority ceiling" |
| What it answers | "What is the structural shape?" | "How qualified is the structural understanding?" |
| Substitution | Hospital module has different vocabulary, same PI Core | SQO is identical across ALL specimen types |
| Persona weight | BOARDROOM (executive gravity), DENSE (inspection targets) | ALL personas (governance thread) |
| GENESIS enrichment | Module terms in hero moments, evidence objects, propositions | Transitions, revalidation, constitutional anchor, advancement |

---

## 5. NO-REGRESSION RULES

### PRESERVE (Absolute)

| Cognition Dimension | Why Preservation is Mandatory | Regression Indicator |
|---------------------|------------------------------|---------------------|
| Pressure cognition | Core PI value — "where does structural weight concentrate" | Pressure zone, signal severity, zone concentration disappear or flatten |
| Emergence orchestration | BALANCED's cognitive identity — "the surface discovers what to say" | Fixed panels replace emergence functions, P/S/T classification removed |
| Evidence boundaries | PI Core's most distinctive pattern — "confirmed unknowns" | Boundary reframe disappears, all domains treated as equally grounded |
| Confidence trajectory | Temporal dimension — "the system is improving, not just computing" | Only current state visible, no epoch comparison, no before/after |
| Qualification compression | Diagnostic integrity — "is the classification internally consistent?" | Band-vs-ratio gap undetectable, compression hides behind posture label |
| Guided cognition | DENSE's defining capability — 42 interrogation paths | Paths reduced, tones/archetypes/depths eliminated, free navigation constrained |
| Module embodiment | Executive consequence — "Platform Infrastructure" not "Zone A" | Module vocabulary replaced by generic labels, domain aliases removed |
| Maturity continuity | Lifecycle proof — "the system earned its state" | S-level shown without provenance, transitions invisible, qualification unexplained |
| Authority differentiation | 4 distinct models per persona — not interchangeable | Authority collapsed to single model across personas, per-act boundaries removed |
| Orchestration asymmetry | 4 distinct architectures — "the same functions, different cognitive instruments" | Personas collapsed to zoom levels, orchestration model differences eliminated |
| Traversal continuity | Cross-persona descent/ascent — "the operator moves through cognitive depth" | Descent affordances removed, personas become disconnected views |

### FORBID (Absolute)

| Forbidden Pattern | Why Forbidden | Detection Signal |
|-------------------|--------------|-----------------|
| Governance replacing intelligence | GENESIS governance artifacts become the surface instead of enriching existing cognition | Governance audit tables visible by default in BALANCED, emergence narrative replaced by governance events |
| Chronicle replacing cognition | Chronicle/replay corridor becomes the primary surface | BALANCED shows checkpoint sequences instead of emergence narrative, operator navigates checkpoints not cognitive functions |
| Static reporting replacing emergence | Pre-computed reports replace dynamic emergence orchestration | BALANCED loses P/S/T classification, emergence functions hardcoded instead of activated by structural state |
| BOARDROOM becoming BALANCED-heavy | Executive surface gains emergence-style sections, guided queries, temporal strips | BOARDROOM exceeds 4 microtraces, new panels appear, executive gravity diluted by operational detail |
| BALANCED becoming governance replay | Governance lifecycle dominates narrative, emergence compressed to accommodate governance events | Governance friction detection (#12) becomes dominant instead of one-of-22, governance audit tables render in BALANCED |
| DENSE becoming static diagnostics | Zone orchestration replaced by fixed diagnostic panels, guided queries removed | Zone count decreases, interrogation paths removed, zone interpretations pre-computed instead of dynamic |
| INVESTIGATION becoming narrative interpretation | Investigation surface starts synthesizing meaning instead of verifying evidence | Inference Prohibition zone removed, zone interpretations added to INVESTIGATION, TierHandoffStatement removed |
| Module embodiment flattening | Domain aliases replaced by generic IDs, signal family labels removed, module vocabulary eliminated | Executive reads "Domain 1" not "Platform Infrastructure", signal reads "Signal A" not "Structural Concentration" |

---

## 6. GAP MATRIX

### Cross-Map: Current Cognition × GENESIS Objects × Persona Consumers

| GENESIS Object | BOARDROOM Gap | BALANCED Gap | DENSE Gap | INVESTIGATION Gap | Materializer Status |
|---------------|---------------|--------------|-----------|-------------------|-------------------|
| `hero_moments` | Descent only (hero moment already exists from compiler) | Missing: emergence punctuation | Missing: zone context | Not applicable | NOT MATERIALIZED (0 objects in spine) |
| `evidence_objects` | Not applicable | Missing: narrative anchors (falls back to structural enrichment) | Not applicable | Missing: evidence provenance depth | NOT MATERIALIZED (0 objects in spine) |
| `replay_corridors` | Descent chip only | Not applicable | Not applicable | Missing: native replay corridor | NOT MATERIALIZED (0 objects in spine) |
| `qualification_transitions` | Microtrace (blocker) | Missing: qualification movement | Present (GL zone) | Present (transitions table) | NOT MATERIALIZED (0 objects) — but promotion_event_log partially covers |
| `executive_projection_snapshots` | Missing: temporal delta | Missing: enrichment trajectory | Not applicable | Not applicable | NOT MATERIALIZED (0 objects) |
| `doctrine_evolution_records` | Not applicable | Not applicable | Not applicable | Missing: governance evolution proof | NOT MATERIALIZED (0 objects) |
| `chronicle_events.jsonl` | Not applicable | Missing: emergence context | Not applicable | Missing: audit trail | NOT CONSUMED |
| `proposition_review_event_log.jsonl` | Not applicable | Not applicable | Not applicable | Missing: per-review events | NOT CONSUMED |
| `reconciliation_event_log.jsonl` | Not applicable | Missing: enrichment trajectory | Not applicable | Missing: per-event audit | NOT CONSUMED |
| `proposition_derivation_lineage.json` | Not applicable | Missing: derivation context | Not applicable | Missing: derivation proof | NOT CONSUMED |
| `enrichment_log.json` | Not applicable | Missing: per-event enrichment | Missing: signal maturation | Missing: enrichment provenance | NOT CONSUMED (summary consumed, detail lost) |
| `learning_activation_manifest.json` | Not applicable | Missing: learning context | Not applicable | Missing: learning proof | NOT CONSUMED |
| `evidence_anchors.json` | Not applicable | Not applicable | Not applicable | Missing: evidence provenance depth | NOT CONSUMED |
| TermHint vocabulary | Not applicable | Not applicable | Not applicable | Missing: ISIG/DPSIG/PSIG, L-levels, Q-classes, dispositions | CODE GAP |

### Missing Traversal Routes

| From | To | Trigger | Status |
|------|-----|---------|--------|
| BOARDROOM signal chip | DENSE at that signal family | Click signal chip → descend to SA zone at matching family | NOT IMPLEMENTED |
| BOARDROOM governance legitimacy | INVESTIGATION governance audit | Click governance section → descend to GA actor | NOT IMPLEMENTED |
| BOARDROOM finding verdict | BALANCED pressure emergence | Click finding_headline → descend to pressure cognitive function | NOT IMPLEMENTED |
| BOARDROOM replay chip | Chronicle / INVESTIGATION replay corridor | Click chip → open chronicle or GA replay section | NOT IMPLEMENTED |
| BALANCED emergence pattern | DENSE zone at matching zone key | Emergence identifies zone → operator descends to that zone | NOT IMPLEMENTED |
| BALANCED governance friction | INVESTIGATION proposition audit | Click friction narrative → descend to per-proposition review | NOT IMPLEMENTED |
| DENSE guided query answer | INVESTIGATION evidence verification | Answer raises evidence question → descend to INVESTIGATION | NOT IMPLEMENTED |
| Any persona | Chronicle cognitive replay | None — no operational cross-system descent | NOT IMPLEMENTED |

### Regression Risks

| Risk | Trigger | Mitigation |
|------|---------|-----------|
| Spine object materialization overwhelms narrative | Hero moments, evidence objects, replay corridors all populate → GoverningNarrativeComposer produces governance-heavy narrative | Keep existing narrative anchor logic; hero moments ADD to anchors, not REPLACE structural enrichment anchors |
| INVESTIGATION audit tables expand beyond readable length | All GENESIS event logs consumed → GA section becomes 500+ rows | INVESTIGATION should show AGGREGATE counts with drilldown, not flat enumeration of all events by default |
| Resolver payload grows too large | 7 new source files consumed → resolved payload exceeds memory | Progressive loading: core payload always loaded; governance detail loaded on persona entry or on demand |
| TermHint expansion creates cognitive noise | 30+ terms with dual-decode → surface becomes tooltip-heavy | Only decode terms that appear in INVESTIGATION; other personas don't use TermHint |
| Replay corridor competes with governance audit | RC actor and GA actor both show lifecycle data → redundancy | RC shows CHECKPOINT SEQUENCE (what state at each phase). GA shows GOVERNANCE DECISIONS (what was reviewed/accepted/rejected). Different cognitive questions. |

---

## 7. IMPLEMENTATION SEQUENCING

### P0 — Hard Regressions (BEFORE any enrichment)

| Item | What | Source | LOE |
|------|------|--------|-----|
| P0.1 | BOARDROOM evidence boundary microtrace | `grounding_ratio` from `compileDomainCoverage()` | 1 sentence in governed narrative |
| P0.2 | BOARDROOM temporal delta microtrace | `enrichment_intelligence.mean_confidence_post` vs baseline | 1 metric in governance legitimacy |
| P0.3 | BOARDROOM advancement blocker sentence | `promotion_state.hold_reason` | 1 sentence in governance narrative |
| P0.4 | BOARDROOM trust tier badge | `SemanticTrustPostureZone` posture.tier | 1 word badge |
| P0.5 | Stale lineage: readinessBadge.state_label field mapping | BoardroomProjectionCompiler | Fix broken field |
| P0.6 | Stale lineage: DeclarationZone scope hardcoded | DeclarationZone.jsx | Derive from topology |
| P0.7 | Stale lineage: RepModeTag zone ID mismatch in INVESTIGATION | InvestigationTraceField | Match Z-codes to actor codes |
| P0.8 | Stale lineage: Signal audit conditional suppression | InvestigationSignalAudit | Remove `sigs.length > signalRowCount` gate or revise condition |

### P1 — Missing Cognition Materializers

| Item | What | Source | Persona Target |
|------|------|--------|---------------|
| P1.1 | Hero Moment materializer | Pipeline: structural enrichment + code graph → spine hero_moments | BALANCED (narrative anchors), BOARDROOM (hero moment sharpening) |
| P1.2 | Evidence Object materializer | Pipeline: intake + verification phases → spine evidence_objects | BALANCED (narrative), INVESTIGATION (provenance) |
| P1.3 | Qualification Transition materializer | Pipeline: promotion_event_log → spine qualification_transitions | BALANCED (SQO zone), BOARDROOM (microtrace) |
| P1.4 | Executive Projection Snapshot materializer | Pipeline: per-epoch resolver snapshot → spine executive_projection_snapshots | BOARDROOM (temporal delta), BALANCED (trajectory) |
| P1.5 | Replay Corridor materializer | Pipeline: chronicle checkpoints → spine replay_corridors | INVESTIGATION (native replay) |
| P1.6 | Proposition review event consumer | `proposition_review_event_log.jsonl` → resolver | INVESTIGATION (per-event audit) |
| P1.7 | Reconciliation event consumer | `reconciliation_event_log.jsonl` → resolver | BALANCED (trajectory), INVESTIGATION (audit) |
| P1.8 | Learning activation consumer | `learning_activation_manifest.json` → resolver | INVESTIGATION (learning proof), BALANCED (learning context) |

### P2 — Persona Enrichment

| Item | What | Persona | Integration |
|------|------|---------|-------------|
| P2.1 | BOARDROOM: 4 microtraces + replay descent chip | BOARDROOM | Per §3 BOARDROOM section |
| P2.2 | BALANCED: qualification movement in SQO zone | BALANCED | S-state trajectory from transitions |
| P2.3 | BALANCED: enrichment trajectory in temporal cognition | BALANCED | Per-epoch enrichment events |
| P2.4 | BALANCED: hero moment emergence punctuation | BALANCED | Hero moments into emergence cascade |
| P2.5 | BALANCED: 5th emergence query (learning) | BALANCED | "What did the system learn?" |
| P2.6 | DENSE: signal maturation in SA zone interpretation | EXEC_DENSE | Confidence movement since intake |
| P2.7 | DENSE: enrichment mechanics query in GL zone | EXEC_DENSE | "What enrichment was applied?" |
| P2.8 | INVESTIGATION: TermHint coverage expansion | INVESTIGATION | Extend TERM_DECODE_MAP |
| P2.9 | INVESTIGATION: replay corridor actor (RC) | INVESTIGATION | Checkpoint sequence rendering |
| P2.10 | INVESTIGATION: proposition review per-event audit | INVESTIGATION | Per-review rows in GA corpus |
| P2.11 | INVESTIGATION: enrichment provenance | INVESTIGATION | Per-enrichment events in GA |
| P2.12 | INVESTIGATION: learning event sub-section | INVESTIGATION | Learning events in GA |

### P3 — Traversal Contracts

| Item | What | Route |
|------|------|-------|
| P3.1 | Pressure → BALANCED | BOARDROOM finding_headline → BALANCED pressure emergence |
| P3.2 | Signal → EXEC_DENSE | BOARDROOM signal chip → DENSE SA zone at signal family |
| P3.3 | Governance → INVESTIGATION | BOARDROOM governance legitimacy → INVESTIGATION GA actor |
| P3.4 | Chronicle → replay corridor | BOARDROOM replay chip → INVESTIGATION replay corridor / Chronicle |
| P3.5 | Hero Moment → artifact lineage | BALANCED hero moment punctuation → INVESTIGATION evidence trace |
| P3.6 | Emergence → zone | BALANCED emergence pattern → DENSE zone at matching key |
| P3.7 | Friction → proposition | BALANCED governance friction → INVESTIGATION proposition audit |

### P4 — Constitutionalization

ONLY after P0-P3. Constitutionalize:
1. Unified cognition architecture (22 functions, 5 strata, 11 projection states)
2. 4 orchestration architectures as persona discriminators
3. 4 authority projection models locked per persona
4. Module embodiment as constitutional requirement
5. Descent/ascent traversal contracts
6. Spine continuity as living substrate (not static metadata)
7. SQO / Software Intelligence Module separation

---

## FINAL PRINCIPLE

The mission is NOT "protect the old system."

The mission is: transform the already-correct LENS cognition philosophy into a cleanly architected, modular, governed, living Program Intelligence system whose Spine continuously evolves, strengthens, qualifies, and enriches operational cognition across all personas.

WITHOUT losing the operational gravity and cognition richness that made LENS valuable in the first place.

The Spine is NOT governance metadata. It is Program Intelligence continuity — enrichment history, proposition arbitration, convergence accumulation, evidence hardening, qualification movement, signal maturation, Hero Moments, operational learning, pressure evolution, replay continuity, governed adaptation.

The LENS cognition philosophy was already directionally correct. GENESIS enriches it. GENESIS does not replace it.
