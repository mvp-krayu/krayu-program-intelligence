# LENS Chronicle Consumption Map

> PI.LENS.CHRONICLE-BACKED-INTELLIGENCE-CONSUMPTION.01
> Classification: G2 — Architecture-Consuming
> Purpose: Make LENS consume the certified governance nervous system

---

## Current Binding State

LENS currently binds to **run_blueedge_productized_01_fixed** (legacy S2_BRIDGE).
The canonical run is **run_blueedge_genesis_e2e_03** (S2_GOVERNED, REPLAY-CERTIFIED, 62/62 certification).

**Blocker #0:** Genesis e2e run has no manifest, no registry entry, and no pre-compiled runtime projection artifacts. LENS cannot see it.

### Resolution

Create manifest: `app/execlens-demo/lib/lens-v2/manifests/blueedge.run_blueedge_genesis_e2e_03.json`

This manifest binds genesis_e2e_03 artifacts to the LENS payload resolver. The productized manifest remains for backwards reference but genesis_e2e_03 becomes the primary BlueEdge binding.

---

## Payload → Persona Consumption Matrix

### What Each Persona Needs (All Four)

| Data Source | BOARDROOM | BALANCED | DENSE | INVESTIGATION |
|---|---|---|---|---|
| S-level + governance provenance | S2 badge, governed lifecycle sentence | S-level context in narrative | S-level with transition lineage | Full promotion_state traversal |
| Proposition corpus (85 props) | Headline count + acceptance ratio | Class distribution + confidence summary | Per-class breakdown, flagged items | Per-proposition detail, derivation lineage |
| Governance friction (3R/1A) | "System was challenged" sentence | Friction pattern summary | Rejection/arbitration detail | Full event log traversal |
| Enrichment (32 events, 12 corrected) | "Substrate self-corrected" sentence | Enrichment summary with domain correction count | Per-domain correction detail, debt evolution | Enrichment log entries, before/after confidence |
| Revalidation (25/25) | Deterministic confidence statement | Check category summary | Phase-by-phase results | Per-check detail |
| Constitutional anchor (8/8) | "Constitutionally adequate" badge | Dimension summary with distances | Per-dimension ratio/threshold/verdict | Full anchor JSON traversal |
| Convergence (9 observations) | "Governance generalizes" headline | Convergence/divergence summary | Per-observation detail | Full observation with evidence blocks |
| PSIG (4 signals, 4 zones) | Pressure zone headline | Zone-by-zone signal summary | Signal cards with severity/interpretation | Raw signal computation + normalization |
| ISIG (IHP + IFA) | Level 1 intelligence headline | Cross-validated signal summary | Per-specimen comparison | Raw computation + cross-validation detail |
| DPSIG (topology) | CFA correction sentence | Cluster topology summary | DPSIG signal cards (existing) | Full topology with provenance |
| Chronicle certification | "REPLAY-CERTIFIED" badge | Certification summary | Phase/check breakdown | Full 62-check traversal |
| Chronicle descent link | "Explore the governed lifecycle" CTA | Chapter navigation | Chapter Z1-Z3 access | Chapter Z1-Z5 full depth |
| Hero Moments | Featured discovery headline | Discovery summary with candidate count | Per-hero-moment detail | Detection heuristic + structural evidence |
| Learning events | Learning capture count | Event category summary | Per-event lifecycle state | Full learning → capability pipeline |

### What fullReport Currently Has vs What's Missing

#### CURRENTLY IN fullReport (from productized manifest)

| Field | Source Artifact | Consumed By |
|---|---|---|
| `dpsig_signal_summary` | dpsig_signal_set.json | IntelligenceField signal cards |
| `signal_interpretations` | signal_registry.json + dpsig | All zones (severity, interpretation, concentration) |
| `semantic_domain_registry` | semantic_topology_model.json | Topology zone, guided queries |
| `semantic_cluster_registry` | semantic_topology_model.json | Topology zone |
| `semantic_topology_edges` | semantic_topology_model.json | StructuralTopologyZone SVG |
| `topology_summary` | computed | DeclarationZone, interpretations |
| `reconciliation_summary` | reconciliation compiler | ReconciliationAwarenessZone |
| `governed_narrative` | GoverningNarrativeComposer | BOARDROOM narrative (requires spine_objects) |
| `structural_enrichment` | code_graph + centrality | BOARDROOM, guided queries |
| `evidence_blocks` | binding_envelope.json | IntelligenceField, propagation |

#### MISSING FROM fullReport (must add for chronicle consumption)

| Field | Source Artifact (genesis_e2e_03) | Consumption Target |
|---|---|---|
| `governance_lifecycle` | sqo/promotion_state.json | All personas — S-level, transitions, provenance |
| `proposition_corpus` | semantic/spe/semantic_propositions.json | BALANCED/DENSE/INVESTIGATION — class/tier/confidence distribution |
| `proposition_review` | semantic/spe/proposition_review_state.json | DENSE/INVESTIGATION — disposition breakdown |
| `governance_friction` | semantic/spe/proposition_review_event_log.jsonl | BALANCED/DENSE — friction pattern, timeline |
| `enrichment_summary` | semantic/spe/enrichment_summary.json | All personas — correction counts, domain impact |
| `enrichment_log` | semantic/spe/enrichment_log.json | INVESTIGATION — per-event detail |
| `revalidation_result` | sqo/revalidation_result.json | BALANCED/DENSE — phase results, check counts |
| `constitutional_anchor` | sqo/constitutional_replay_anchor.json | All personas — dimensional adequacy |
| `review_obligations` | sqo/review_obligations.json | DENSE/INVESTIGATION — obligation detail |
| `convergence_observations` | convergence/convergence_observations.json | All personas — cross-specimen pattern |
| `chronicle_certification` | chronicle/chronicle_certification.json | All personas — REPLAY-CERTIFIED badge |
| `chronicle_link` | chronicle/REPLAY_CHRONICLE.html | All personas — descent into governed lifecycle |
| `debt_reassessment` | semantic/spe/debt_reassessment.json | DENSE/INVESTIGATION — debt evolution |
| `hero_moments` | spine/spine_objects.json (objects.hero_moments) | BOARDROOM/BALANCED — governed discoveries |
| `learning_events` | governance/learning_activation_manifest.json | INVESTIGATION — learning lifecycle |
| `pressure_zones` | 41.x/pressure_zone_projection.json | BALANCED/DENSE — zone detail |

---

## Per-Persona Consumption Design

### BOARDROOM — Executive Consequence

**Current state:** Narrative composer produces governed prose when spine_objects available. Genesis_e2e_03 HAS spine_objects. Falls back to `{available: false}` for productized run.

**Consumption additions:**
1. **Governed Lifecycle Badge** — S2_GOVERNED via GOVERNED_REPLAY_QUALIFICATION. Single commanding element.
2. **Constitutional Adequacy** — "8/8 constitutional dimensions pass" as posture indicator.
3. **Governance Friction Sentence** — "81 accepted, 3 rejected, 1 arbitrated — governance was exercised, not rubber-stamped."
4. **Convergence Headline** — "Governance patterns generalize across 2 independent specimens."
5. **Chronicle Descent CTA** — "Explore the full governed lifecycle" → opens REPLAY_CHRONICLE.html in new tab.
6. **REPLAY-CERTIFIED Badge** — 62/62 certification as trust signal.
7. **Hero Moment Feature** — Top structural discovery from hero_moments (if available).
8. **Enrichment Correction Statement** — "32 evidence corrections across 12 domains — the system self-corrected."

**Render location:** BOARDROOM posture card + governed narrative paragraphs.

### BALANCED — CEO Consequence Lens

**Current state:** Selective interpretive emergence via `ExecutiveInterpretation` component. 75.x governed narrative synthesis.

**Consumption additions:**
1. **Governance Lifecycle Summary** — S0→S1→S2 transition timeline with actor, mechanism, date.
2. **Proposition Distribution** — 4-class breakdown (DOMAIN_EVIDENCE: 17, CAPABILITY_EVIDENCE: 24, VAULT_CLAIM: 25, CROSS_DOMAIN: 19) as visual composition.
3. **Confidence Envelope** — Mean 0.717, range 0.5–0.9, variance 0.4. Visual band.
4. **Friction Pattern** — Acceptance/rejection/arbitration ratios. "4.7% governance friction rate."
5. **Enrichment Impact** — 12 domains corrected, 32 events. Domain ID mismatch → semantic name matching.
6. **Revalidation Summary** — "25/25 checks across 8 phases PASS" as confidence signal.
7. **Anchor Dimensions** — 8 dimensions in compact grid: proposition_count, class_diversity, etc.
8. **Convergence Summary** — 5 convergences / 3 divergences / 2 mixed. Compact observation cards.
9. **Signal Intelligence** — PSIG zones + ISIG cross-validation as signal composition.
10. **Chronicle Chapter Navigation** — 8 chapters as guided entry points to REPLAY_CHRONICLE.html.

**Render location:** ExecutiveInterpretation component, 75.x governed.

### DENSE — CTO Structural Lens

**Current state:** 6-zone scrollable column with left interpretation + right query chips. 36 guided queries.

**Consumption additions:**
1. **Governance Zone** (new zone or IntelligenceField expansion) — Full governance lifecycle: promotion state, review obligations, anchor dimensions, certification status.
2. **Proposition Review Zone** — Per-class acceptance grid. Flagged items with rationale. Arbitration lineage.
3. **Enrichment Zone** — Domain correction table. Before/after confidence. Debt evolution trajectory.
4. **Convergence Zone** — 9 observations with convergence/divergence classification. Per-observation evidence summary.
5. **Signal Intelligence Enhancement** — Existing signal cards + ISIG Level 1 cards + Level 1 vs Level 2 distinction.
6. **Pressure Zone Detail** — 4 zones with PSIG attribution, domain membership, severity.
7. **Revalidation Detail** — Phase-by-phase results. 8 phases, 25 checks.
8. **Chronicle Proof Links** — Per-chapter Z1-Z3 descent. Governance events → chapter mapping.

**New guided queries (extending 36-query lattice):**
- "What governance friction occurred?" → rejection/arbitration detail
- "How did enrichment change confidence?" → before/after per-domain
- "What converges across specimens?" → convergence observation summary
- "What does the constitutional anchor prove?" → dimensional breakdown
- "What did revalidation verify?" → phase/check detail
- "What was the strongest structural discovery?" → hero moment detail

**Render location:** DENSE_ZONE_INTERPRETATIONS + DENSE_ZONE_PATHS extensions, new zone derive functions.

### INVESTIGATION — Analyst Evidence Trace

**Current state:** Full evidence depth, lineage, structural proof.

**Consumption additions:**
1. **Full Proposition Table** — 85 propositions with id, class, tier, confidence, disposition, evidence anchor. Sortable/filterable.
2. **Governance Event Timeline** — Append-only event log rendered as timeline. 90+ events with operator/action/rationale.
3. **Enrichment Event Log** — 32 events with domain_id correction, before/after confidence, semantic name match detail.
4. **Revalidation Check Matrix** — 25 checks × 8 phases. Per-check name, condition, PASS/FAIL, detail.
5. **Anchor Dimension Table** — 8 dimensions with reference/candidate values, ratio, threshold, verdict, severity.
6. **Convergence Full Detail** — Per-observation: observation text, evidence for both specimens, divergence notes.
7. **Debt Evolution** — 15 items with classification (IRREDUCIBLE/REDUCED_BY_ENRICHMENT/REDUCIBLE_BY_EVIDENCE), pre/post status.
8. **Review Obligations** — 14 flagged propositions with disposition, rationale, derivation class.
9. **Chronicle Z5 Raw Evidence** — Deep links into REPLAY_CHRONICLE.html chapters at Z4-Z5 (structural proof / raw evidence).
10. **Learning Event Lineage** — Learning events with lifecycle state, consumption eligibility.
11. **Promotion State Lineage** — Full transition array with actor, mechanism, timestamp, governance lineage.
12. **Hero Moment Candidates** — Detection heuristic, structural evidence, candidate status.

**Render location:** InvestigationReadingGuide + EvidenceDepthLayer extensions.

---

## Signal Consumption Map

### Currently Consumed

| Signal Family | Level | In fullReport | Component |
|---|---|---|---|
| DPSIG | Topology | `dpsig_signal_summary` | IntelligenceField signal cards |
| PSIG | Level 2 | `signal_interpretations` (merged) | IntelligenceField signal cards |
| ISIG | Level 1 | `signal_interpretations` (merged) | IntelligenceField signal cards |

### Consumption Enhancement

| Enhancement | Source | Target Persona |
|---|---|---|
| Level 1 vs Level 2 visual distinction | Signal family metadata | ALL — distinguish file-level from architectural |
| ISIG cross-specimen comparison | ISIG derivation artifacts | DENSE/INVESTIGATION |
| Pressure zone → signal attribution | 41.x/pressure_zone_projection.json | BALANCED/DENSE |
| Signal severity distribution | signal_interpretations aggregation | BOARDROOM (headline), BALANCED (visual band) |
| CFA correction narrative | DPSIG provenance (BALANCED→ASYMMETRIC) | BOARDROOM/BALANCED |

---

## SQO State Consumption Map

### Currently Consumed

| Field | Source | How |
|---|---|---|
| S-level | runtime_qualification_projection.v1.json | Pre-compiled, LensSQOSubstrateConsumer |
| Q-class | Computed from fullReport | QClassResolver |
| Debt | runtime_semantic_operations_substrate.v1.json | substrateBinding.debtVisibility |
| Propagation readiness | runtime_qualification_projection.v1.json | substrateBinding.propagationVisibility |

### Consumption Enhancement

| Enhancement | Source (genesis_e2e_03) | Why |
|---|---|---|
| Governance provenance | sqo/promotion_state.json | "S2 via GOVERNED_REPLAY_QUALIFICATION" not just "S2" |
| Transition lineage | promotion_state.transitions[] | S0→S1→S2 with actor + mechanism |
| Constitutional distance | sqo/constitutional_replay_anchor.json | 8-dimension adequacy proof |
| Revalidation summary | sqo/revalidation_result.json | 25/25 PASS as structural confidence |
| Certification status | chronicle/chronicle_certification.json | REPLAY-CERTIFIED badge |
| Governance event density | Event log line counts | "101 governance events" as lifecycle depth signal |

---

## Chronicle Proof Descent Map

The chronicle is NOT embedded in LENS. LENS links INTO the chronicle.

### Descent Model

```
LENS persona view
  │
  ├── BOARDROOM: "Explore governed lifecycle" → REPLAY_CHRONICLE.html (chapter 1, Z1)
  ├── BALANCED: Chapter navigation cards → specific chapter (Z1-Z2)
  ├── DENSE: Governance detail links → specific chapter section (Z2-Z3)
  └── INVESTIGATION: Evidence proof links → specific chapter (Z4-Z5)
```

### Link Contract

Each chronicle descent link carries:
- `chapter` (1-8)
- `zoom` (Z1-Z5)
- `anchor` (section within chapter)
- Opens REPLAY_CHRONICLE.html with URL fragment

LENS generates the link. Chronicle resolves the fragment. No coupling beyond URL convention.

### Chapter → LENS Zone Mapping

| Chronicle Chapter | Semantic Phase | LENS Zone Consumption |
|---|---|---|
| Ch1 "The Specimen" | EMERGENCE | Evidence intake, source provenance |
| Ch2 "The Claims" | FORMATION | Proposition corpus, derivation classes |
| Ch3 "The Governance" | TENSION | Review obligations, friction, arbitration |
| Ch4 "The Strengthening" | STRENGTHENING | Enrichment, debt evolution |
| Ch5 "The Proof" | STABILIZATION | Revalidation, replay corridor |
| Ch6 "The Advancement" | QUALIFICATION | Promotion state, S2 transition |
| Ch7 "The Pattern" | CONVERGENCE | Convergence observations |
| Ch8 "The Projection" | PROJECTION | Executive understanding, signals |

---

## Guided Query Evolution

### Existing (36 queries across 6 zones)

The 36-query lattice covers: topology, clusters, absorption, signals, propagation, pressure zones. All derived from fullReport.

### New Queries (chronicle-backed intelligence)

| Zone | Query | Depth | Derive Source |
|---|---|---|---|
| governance | "What governance lifecycle did this specimen traverse?" | STANDARD | promotion_state.transitions |
| governance | "What was challenged and what survived?" | DEEP | review_state + event_log aggregation |
| governance | "How does this specimen compare to the reference?" | DEEP | constitutional_anchor.dimensions |
| enrichment | "What evidence corrections strengthened the substrate?" | STANDARD | enrichment_summary |
| enrichment | "How did debt evolve through the lifecycle?" | DEEP | debt_reassessment |
| convergence | "What governance patterns generalize?" | STANDARD | convergence_observations.convergences |
| convergence | "Where do specimens diverge?" | STANDARD | convergence_observations.divergences |
| certification | "What does REPLAY-CERTIFIED prove?" | STANDARD | chronicle_certification |
| certification | "What does the constitutional anchor measure?" | DEEP | constitutional_anchor.assessment |
| signals | "What does Level 1 intelligence reveal that Level 2 cannot?" | DEEP | ISIG vs PSIG comparison |
| signals | "What structural pressure zones exist and why?" | STANDARD | pressure_zone_projection |
| discovery | "What structural surprises emerged during onboarding?" | STANDARD | hero_moments |

12 new queries → total 48-query lattice.

---

## Implementation Sequence

### Phase 1: Manifest + Payload Loading (prerequisite)

1. Create genesis_e2e_03 manifest JSON
2. Add registry entry
3. Extend GenericSemanticPayloadResolver to load governance artifacts (promotion_state, anchor, revalidation, review_state, enrichment_summary, convergence, certification)
4. Add new fullReport fields for loaded governance data

### Phase 2: BOARDROOM + BALANCED Consumption

5. BOARDROOM: Governed lifecycle badge, REPLAY-CERTIFIED badge, friction sentence, convergence headline, chronicle CTA
6. BALANCED: Governance lifecycle summary, proposition distribution, confidence envelope, friction pattern, enrichment impact, anchor dimensions, convergence summary, chronicle chapter navigation

### Phase 3: DENSE Consumption

7. Extend DENSE_ZONE_INTERPRETATIONS with governance/enrichment/convergence zones
8. Add 12 new guided queries to DENSE_ZONE_PATHS + GUIDED_QUERY_ANSWERS
9. Chronicle proof links per zone

### Phase 4: INVESTIGATION Consumption

10. Full proposition table, governance event timeline, enrichment event log
11. Revalidation check matrix, anchor dimension table, convergence full detail
12. Chronicle Z4-Z5 deep links

### Phase 5: Signal Enhancement

13. Level 1 vs Level 2 visual distinction in signal cards
14. Pressure zone → signal attribution
15. ISIG cross-specimen display

---

## Hard Guardrails

- No new substrate validation scripts
- No new governance gates
- No SQO state machine changes
- No new spine classes
- No chronicle modifications
- No convergence re-analysis
- No revalidation re-runs
- The substrate is certified. LENS consumes it. Period.
