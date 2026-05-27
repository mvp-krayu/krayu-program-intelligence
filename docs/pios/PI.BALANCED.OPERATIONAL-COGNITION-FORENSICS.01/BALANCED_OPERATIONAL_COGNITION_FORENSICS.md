# BALANCED Operational Cognition Forensics

Stream: PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01
Classification: FORENSIC / CONSTITUTIONAL / NON-IMPLEMENTATION
Date: 2026-05-24
Specimen observed: BlueEdge `run_blueedge_productized_01_fixed` (current LENS default)
Method: Component-by-component trace from rendered surface through derivation chain to raw artifacts

---

## Forensic Method

Each component is traced from rendered surface → JSX component → data prop → resolver/binding function → raw filesystem artifact. Classification is based on what the code actually does, not what doctrine says it should do.

---

## COMPONENT 1: Operational Posture (DeclarationZone)

### 1. What is this component?
The topmost declaration on the BALANCED surface. Announces the specimen's operational readiness state as a governance-grade stamp: "EXECUTIVE READY — QUALIFIED."

### 2. Where is it rendered?
- Component: `DeclarationZone` (non-boardroom branch)
- File: `zones/DeclarationZone.jsx:57-76`
- Render path: `LensDisclosureShell` → tier0 → `DeclarationZone`
- Section: Top of page, above all intelligence content

### 3. Where is it derived?
- `renderState` enum: computed in `SemanticActorHydrator.deriveRenderState(band, posture, qualifierClass)` → deterministic mapping from band/posture/qualifier
- `STATE_LABELS` map: `constants.js:14-19` — static lookup `EXECUTIVE_READY_WITH_QUALIFIER → "EXECUTIVE READY — QUALIFIED"`
- Scope line ("3 Domains · 47 Clusters · Partial Coverage"): **HARDCODED** in `DeclarationZone.jsx:68-72` — not derived from any data

### 4. What evidence feeds it?
- `decision_validation.json` VF-01 evidence string → regex parse → band, posture
- `QClassResolver` → qualifier_class from topology domain counts + lineage + crosswalk presence
- Scope values: **NO EVIDENCE** — literals in JSX

### 5. Derivation type
- State label: **DETERMINISTIC** — enum resolution from governance evidence
- Scope line: **SYNTHETIC** — hardcoded, not specimen-responsive

### 6. Replay status
- State label: replay-safe (deterministic from artifacts)
- Scope line: **NOT replay-safe** — hardcoded, does not reflect actual specimen domain/cluster counts

### 7. Governance status
- State label: governance-enveloped (derived from decision validation + qualifier resolution)
- Scope line: ungoverned (hardcoded)

### 8. Genesis status
**PARTIAL.** Genesis produces `canonical_topology.json` (cluster counts) and `semantic_topology_model.json` (domain counts) — the data exists to compute a correct scope line. But genesis does NOT produce `decision_validation.json`, so `renderState` falls back to resolver heuristics (S-level based), not to the VF-01 decision surface.

### 9. Canonical status
- State label: canonical (locked enum vocabulary)
- Scope line: **legacy operational cognition** — a real specimen-responsive scope line was never built

### 10. Regression risk
LOW for state label (enum survives migration). HIGH for scope line — but it's already wrong (hardcoded), so migration cannot regress it further.

### 11. Recommended future
- State label: **preserve exactly** — deterministic enum resolution
- Scope line: **recompute deterministically** — derive from `topology_summary.semantic_domain_count`, `topology_summary.cluster_count`, qualifier-driven coverage label

---

## COMPONENT 2: Reconciliation Posture (ReconciliationAwarenessZone)

### 1. What is this component?
Multi-metric reconciliation intelligence zone: posture tier (STRONG/MODERATE/WEAK/INSUFFICIENT), weighted confidence, reconciliation ratio, domain coverage, L5 grounded count, unmapped count. With confidence trajectory and debt drilldown.

### 2. Where is it rendered?
- Component: `ReconciliationAwarenessZone`
- File: `zones/ReconciliationAwarenessZone.jsx:274-354`
- Render path: `LensDisclosureShell` → tier1 → `ReconciliationAwarenessZone`
- Section: Below IntelligenceField in the disclosure sequence

### 3. Where is it derived?
- `awareness` prop built by `LensReconciliationConsumptionLayer.buildReconciliationAwareness()`
- Posture tier: `resolveReconciliationPosture()` — threshold-based: ratio ≥ 0.75 + weighted ≥ 80 = STRONG; ratio ≥ 0.50 + weighted ≥ 60 = MODERATE; weighted ≥ 40 = WEAK; else INSUFFICIENT
- Weighted confidence: verbatim from `reconciliation_summary.weighted_confidence_score`
- Debt posture: from `resolveDebtPosture()` — L1 count + lifecycle unresolved domains
- Lifecycle/trajectory: from `reconciliation_lifecycle.v1.json` via `ReconciliationLifecycleProjection.projectLifecycleForRuntime()`

### 4. What evidence feeds it?
- `reconciliation_summary` (computed inline in resolver via `compileCorrespondence()`)
  - Inputs: `semantic_topology_model.json`, `canonical_topology.json`, `semantic_continuity_crosswalk.json`, `signal_registry.json`, `evidence_trace.json`
- `reconciliation_lifecycle.v1.json` from `artifacts/sqo/` overlay
- Confidence trajectory epoch labels and values: from lifecycle artifact temporal analytics

### 5. Derivation type
- Posture tier: **HEURISTIC** — threshold-based classification
- Weighted confidence: **DETERMINISTIC** — computed by `compileCorrespondence()` from domain-level confidence levels
- Reconciliation ratio: **DETERMINISTIC** — ratio of reconciled to total domains
- Confidence trajectory: **DETERMINISTIC** — epoch snapshots from lifecycle artifact
- Domain movements (L1→L2/L3 deltas): **DETERMINISTIC** — diff between epoch states

### 6. Replay status
- Posture metrics: **replay-safe** — deterministic from correspondence compiler
- Lifecycle trajectory: **replay-safe** — deterministic from SQO overlay artifact
- Debt drilldown (unresolved domains): **replay-safe** — from lifecycle artifact
- BUT: `reconciliation_lifecycle.v1.json` is from `artifacts/sqo/` overlay, which is a separate materialization pipeline — replay requires that pipeline to have run

### 7. Governance status
- **Partially governed** — reconciliation_summary is computed from governed topology artifacts, but posture tier classification is a LENS-local heuristic, not a governance-grade classification

### 8. Genesis status
**NO.** Genesis does NOT produce `reconciliation_lifecycle.v1.json` (no `artifacts/sqo/` directory for genesis). Genesis DOES produce the raw inputs (`semantic_topology_model.json`, `canonical_topology.json`) from which `reconciliation_summary` could be re-computed by `compileCorrespondence()`, but the lifecycle trajectory and temporal analytics are absent. The ReconciliationAwarenessZone would render with static posture metrics but NO trajectory, NO debt drilldown with rationale, NO temporal trend.

### 9. Canonical status
**Emergent but uncodified.** The reconciliation posture tier labels (STRONG/MODERATE/WEAK/INSUFFICIENT) are not locked in any governance contract. The threshold values (0.75/0.50/80/60/40) are LENS-local heuristics.

### 10. Regression risk
**HIGH — loss of confidence cognition.** The confidence trajectory (BASELINE → AI_ENRICHED → current) is the only place where the operator sees temporal evidence evolution. The weighted confidence score integrates per-domain confidence levels into a single comparable metric. The posture tier provides immediate cognitive framing (WEAK = gaps exist). Loss of this zone would eliminate the operator's understanding of how confidence distributes and evolves.

### 11. Recommended future
- Posture tier classification: **constitutionalize upstream** — lock thresholds and tier vocabulary
- Weighted confidence: **preserve exactly** — deterministic computation
- Confidence trajectory: **migrate into governed substrate** — the lifecycle artifact should be genesis-producible
- Debt drilldown: **migrate into governed substrate** — requires SQO overlay pipeline for genesis runs

---

## COMPONENT 3: Weighted Confidence

### 1. What is this component?
The primary metric in ReconciliationAwarenessZone: a single percentage representing the confidence-weighted reconciliation state across all semantic domains.

### 2. Where is it rendered?
- Component: `ReconciliationAwarenessZone` (inline)
- File: `zones/ReconciliationAwarenessZone.jsx:316-317`
- Section: Primary metric position within reconciliation posture

### 3. Where is it derived?
- `posture.weighted_confidence` ← `reconciliation_summary.weighted_confidence_score` ← `compileCorrespondence()` in resolver
- `compileCorrespondence()` is in `lib/lens-v2/generic/CorrespondenceCompiler.js` — computes weighted average of per-domain confidence levels (L1=20, L2=40, L3=60, L4=80, L5=100)

### 4. What evidence feeds it?
- Per-domain confidence levels from semantic_topology_model lineage_status mapping:
  - L5 = EXACT lineage (structurally grounded)
  - L4 = STRONG lineage
  - L3 = enriched/reconciled
  - L2 = semantic correspondence only
  - L1 = unmapped
- Weighted by count: `sum(level_weight * count) / total_domains`

### 5. Derivation type
**DETERMINISTIC** — arithmetic weighted average from governed domain lineage states

### 6. Replay status
**Replay-safe** — same topology model → same weighted confidence

### 7. Governance status
**Governance-derived** — lineage_status is a governed classification from the semantic topology model

### 8. Genesis status
**YES** — genesis produces `semantic_topology_model.json` with domain lineage, from which weighted confidence can be computed. BUT: the `compileCorrespondence()` function also requires `canonical_topology.json` (present in genesis) and `semantic_continuity_crosswalk.json` (NOT present in genesis). Missing crosswalk would degrade correspondence quality.

### 9. Canonical status
**Canonical** — the computation is deterministic from governed artifacts

### 10. Regression risk
**HIGH — loss of confidence cognition.** This is the single number that compresses the entire domain grounding state into a comparable metric. Without it, the operator sees only the binary grounded/not-grounded split.

### 11. Recommended future
**Preserve exactly** — deterministic computation from governed inputs. Ensure genesis path produces crosswalk equivalent or degrades gracefully.

---

## COMPONENT 4: Confidence Trajectory (ReconTrajectoryStrip)

### 1. What is this component?
Temporal visualization of weighted confidence across enrichment epochs: BASELINE → AI_ENRICHED (or other named epochs). Shows per-domain level movements (L1→L2, L1→L3).

### 2. Where is it rendered?
- Component: `ReconTrajectoryStrip`
- File: `zones/ReconciliationAwarenessZone.jsx:17-56`
- Render path: `ReconciliationAwarenessZone` → conditional on `lifecycle.trajectory.epoch_labels.length > 1`
- Section: Within reconciliation zone, below metrics

### 3. Where is it derived?
- `lifecycle.trajectory` ← `ReconciliationLifecycleProjection.projectLifecycleForRuntime()`
- Source artifact: `artifacts/sqo/{client}/{run}/reconciliation_lifecycle.v1.json`
- `lifecycle.latestDelta` — epoch-over-epoch confidence change + domain movements array

### 4. What evidence feeds it?
- `reconciliation_lifecycle.v1.json` — materialized by SQO overlay pipeline
- Contains: epoch_labels array, weighted_confidence per epoch, domain_movements with from_level/to_level deltas

### 5. Derivation type
**DETERMINISTIC** — direct projection from lifecycle artifact epoch snapshots

### 6. Replay status
**Replay-safe** — deterministic from artifact. But **specimen-stable only if SQO overlay pipeline is re-run.**

### 7. Governance status
**Partially governed** — lifecycle artifact is produced by SQO overlay pipeline (governed) but the visualization is LENS-local

### 8. Genesis status
**NO.** Genesis does not produce `reconciliation_lifecycle.v1.json`. The trajectory requires the SQO overlay pipeline which has not been run for genesis_e2e_03. No `artifacts/sqo/blueedge/run_blueedge_genesis_e2e_03/` directory exists.

### 9. Canonical status
**Legacy operational cognition** — the trajectory visualization is operational but the underlying lifecycle artifact pipeline has not been generalized to genesis runs

### 10. Regression risk
**HIGH — loss of temporal understanding.** This is the only component that shows HOW confidence evolved. Without it, the operator sees only the current state with no sense of trajectory or enrichment impact.

### 11. Recommended future
**Migrate into governed substrate** — the SQO overlay pipeline that produces `reconciliation_lifecycle.v1.json` must be extended to genesis runs, or an equivalent temporal artifact must be genesis-producible

---

## COMPONENT 5: Executive Interpretation (left column)

### 1. What is this component?
Left-column interpretive panel: "EXECUTIVE INTERPRETATION" tag with 75.x marker, assessment paragraph, emerged SECONDARY/TERTIARY narrative claims, structural context paragraph.

### 2. Where is it rendered?
- Component: `ExecutiveInterpretation` (BALANCED branch)
- File: `zones/IntelligenceField.jsx:2710-2749`
- Render path: `IntelligenceField` → left column → `ExecutiveInterpretation` (when `densityClass === 'EXECUTIVE_BALANCED'` AND `emergenceState` exists)
- Section: Left panel

### 3. Where is it derived?
- `narrative.executive_summary`: from `narrative_block.executive_summary` in resolver, assembled at `GenericSemanticPayloadResolver.js:800-830` — template strings from `derived.score`, `derived.band`, `derived.posture`, domain counts, zone anchor
- `narrative.structural_summary`: from `narrative_block.structural_summary` in resolver — template string from structural enrichment data
- `emergenceState`: the full narrative derivation results from `BALANCED_INTERPRETIVE_NARRATIVES` (8 functions), bubbled up via `onEmergenceState` callback
- Emerged SECONDARY/TERTIARY claims: filtered from `emergenceState`, showing `subordinateLabel` + first evidence chain claim

### 4. What evidence feeds it?
- `readiness_summary` (score, band, posture from decision_validation VF-01)
- `topology_summary` (domain counts from semantic_topology_model + canonical_topology)
- `signal_interpretations` (from DPSIG signal set + signal registry)
- Zone anchor business label (from VF-05 or semantic_topology_model or DPSIG normalization_basis)
- All evidence underlying the 8 emergence narratives

### 5. Derivation type
- Executive summary prose: **HEURISTIC** — template-assembled from deterministic inputs
- Structural summary prose: **HEURISTIC** — template-assembled
- Emerged narrative claims: **BOUNDED INTERPRETIVE** — 75.x governed narratives with evidence chains

### 6. Replay status
- **Replay-safe** — template assembly from deterministic artifacts. Same inputs → same prose.

### 7. Governance status
- Executive summary: **ungoverned** — resolver-local template assembly, no 75.x declaration
- Emerged narrative claims: **governance-enveloped** — 75.x bounded interpretive authority with evidence chains
- The left column MIXES ungoverned prose (executive_summary) with governed prose (emerged narratives)

### 8. Genesis status
**PARTIAL.** Genesis produces the topology and signal data, but does NOT produce `decision_validation.json` (band/posture source). The executive_summary for genesis would be derived from S-level-based heuristics in the resolver rather than from VF-01 evidence. Emerged governance/enrichment/convergence narratives would be ACTIVE for genesis (those artifacts exist).

### 9. Canonical status
**Emergent but uncodified** — the left-column composition is a LENS-local rendering decision, not a governed contract

### 10. Regression risk
**MEDIUM — loss of executive framing.** The left column provides the "at-a-glance" structural context. Loss would force the operator to read the full center column to form understanding. The emerged narrative claims in the left column are a compact summary of the 75.x system — losing those means the operator must scroll through the full center column.

### 11. Recommended future
- Emerged narrative claims: **preserve exactly** — 75.x governed, evidence-traced
- Executive summary template: **recompute deterministically** — should derive from governed inputs (S-level, qualifier, topology) rather than from legacy decision_validation VF-01

---

## COMPONENT 6: Grounding Posture (BalancedNarrativeSection — groundingIntelligence)

### 1. What is this component?
SECONDARY emergence narrative: detects grounding asymmetry (advisory-bound ratio > 30% or backed < clusters) and produces interpretive prose about the structural gap.

### 2. Where is it rendered?
- Component: `BalancedNarrativeSection`
- File: `zones/IntelligenceField.jsx:3244` (render site), `412-440` (derive function)
- Render path: `BalancedConsequenceField` → after `EvidenceBoundarySection`
- Section: Center column, below evidence boundary

### 3. Where is it derived?
- `BALANCED_INTERPRETIVE_NARRATIVES.deriveGroundingIntelligence.derive(fullReport)`
- Reads: `fullReport.topology_summary.structurally_backed_count`, `.semantic_domain_count`, `.cluster_count`
- Threshold: ratio > 0.3 OR backed < clusters

### 4. What evidence feeds it?
- `semantic_topology_model.json` — domain lineage (backed vs semantic-only count)
- `canonical_topology.json` — cluster count

### 5. Derivation type
**BOUNDED INTERPRETIVE** — 75.x governed. Template prose from structural evidence. Threshold-gated emergence.

### 6. Replay status
**Replay-safe** — deterministic from topology artifacts

### 7. Governance status
**Governance-enveloped** — 75.x authority, evidence chain, structural basis string

### 8. Genesis status
**YES** — genesis produces both `semantic_topology_model.json` and `canonical_topology.json`. This narrative will emerge for genesis runs if the grounding asymmetry threshold is crossed.

### 9. Canonical status
**Emergent but uncodified** — the emergence threshold (0.3) and narrative templates are LENS-local, not locked in governance contract

### 10. Regression risk
**HIGH — loss of grounding cognition.** This is the only narrative that explains WHY the grounding gap matters: "Most operational domains remain advisory-bound rather than structurally grounded, compressing executive confidence across the topology." Without it, the operator sees the binary evidence boundary numbers but not the cognitive meaning.

### 11. Recommended future
**Preserve exactly** — 75.x governed, evidence-traced, structurally sound. Consider constitutionalizing the emergence threshold upstream.

---

## COMPONENT 7: Structural Context (SemanticTrustPostureZone — compact trust strip)

### 1. What is this component?
Compact horizontal strip showing: trust level (HYDRATED/STRONG/etc), S-state (S2), grounding percentage (23.5%), maturity classification (STABLE). The BALANCED version is deliberately simplified — a single-line posture indicator.

### 2. Where is it rendered?
- Component: `SemanticTrustPostureZone` (BALANCED branch)
- File: `zones/SemanticTrustPostureZone.jsx:36-53`
- Render path: `LensDisclosureShell` → tier1 → `SemanticTrustPostureZone`
- Section: Below IntelligenceField in disclosure sequence

### 3. Where is it derived?
- `binding` prop = `substrateBinding` from `LensSQOSubstrateConsumer.buildLensSubstrateBinding()`
- `trustPosture` from `resolveTrustPosture(qualProjection)`:
  - S2 + grounding ≥ 0.75 = STRONG; S2 + grounding ≥ 0.5 = PARTIAL; else HYDRATED
- Source artifact: `artifacts/sqo/{client}/{run}/runtime_qualification_projection.v1.json`

### 4. What evidence feeds it?
- `runtime_qualification_projection.v1.json` — materialized by SQO overlay pipeline
  - `qualification.s_state`, `qualification.q_class`, `qualification.grounding_ratio`, `qualification.maturity_classification`

### 5. Derivation type
- Trust level: **HEURISTIC** — threshold-based classification from S-state + grounding ratio
- S-state/grounding/maturity: **DETERMINISTIC** — verbatim from qualification projection

### 6. Replay status
**Replay-safe** — deterministic from SQO overlay artifact. BUT requires SQO overlay pipeline to have run.

### 7. Governance status
**Governance-derived** — fields from qualification projection which is a governed SQO artifact

### 8. Genesis status
**NO.** Genesis does not produce `runtime_qualification_projection.v1.json` (no SQO overlay artifacts). The trust strip would not render (`binding.available` = false → returns null).

### 9. Canonical status
**Legacy operational cognition** — trust posture tier classification is LENS-local; underlying qualification data is governed

### 10. Regression risk
**MEDIUM — loss of trust framing.** The compact strip gives the operator an immediate trust-level reading. Without it, the operator has no quick indicator of where trust stands.

### 11. Recommended future
**Migrate into governed substrate** — trust posture should be derivable from genesis-available governance artifacts (promotion_state.json has S-level; topology model has grounding). The SQO overlay dependency should be eliminated or made genesis-compatible.

---

## COMPONENT 8: Structural Signals (SignalNarrativeBlock)

### 1. What is this component?
Per-signal interpretation display: "STRUCTURAL SIGNALS" label, count of elevated signals, then per-signal interpretation prose with concentration and severity. Compound narrative when multiple signals activate.

### 2. Where is it rendered?
- Component: `SignalNarrativeBlock`
- File: `zones/IntelligenceField.jsx:2956-2993`
- Render path: `BalancedConsequenceField` → after grounding intelligence narrative
- Section: Center column, mid-page

### 3. Where is it derived?
- `fullReport.signal_interpretations` — assembled by `buildSignalInterpretations()` at `GenericSemanticPayloadResolver.js:243-368`
- Per-signal fields: `severity`, `interpretation`, `concentration`, `compound_narrative`, `confidence_note`
- DPSIG signals: from `dpsig_signal_set.json` via `DPSIGSignalMapper.projectDPSIGSignalSet()`
- PSIG/ISIG signals: from `signal_registry.json` via `DPSIGSignalMapper.projectPSIGSignals()`

### 4. What evidence feeds it?
- `artifacts/dpsig/{client}/{run}/dpsig_signal_set.json` — DPSIG pipeline output (cluster pressure index, fan asymmetry, zone coverage)
- `clients/{client}/psee/runs/{run}/vault/signal_registry.json` — PSIG/ISIG signals (coupling, domain coupling, zone coverage, unanchored ratio)
- `semantic_topology_model.json` — for cluster→domain label resolution
- `decision_validation.json` VF-05 — for zone anchor business label in compound narrative

### 5. Derivation type
- Signal values, severity, activation_state: **DETERMINISTIC** — verbatim from pipeline artifacts
- Interpretation prose: **HEURISTIC** — template strings assembled from signal values with cluster→domain label substitution
- Compound narrative: **HEURISTIC** — assembled narrative when multiple signals activate
- Concentration string: **HEURISTIC** — template from normalization_basis fields

### 6. Replay status
**Replay-safe** — deterministic from signal artifacts (DPSIG + registry). Template assembly is stable.

### 7. Governance status
**Partially governed** — signal values are governed pipeline outputs; interpretation prose and compound narratives are LENS-local heuristic compositions

### 8. Genesis status
**YES** — genesis produces both `dpsig_signal_set.json` (in `artifacts/dpsig/`) and `signal_registry.json` (in vault). Signal interpretations will render for genesis runs. However, `decision_validation.json` (VF-05 for zone anchor) is NOT produced by genesis — compound narrative would fall back to DPSIG normalization_basis for zone label.

### 9. Canonical status
**Emergent but uncodified** — signal interpretation templates and compound narrative assembly are LENS-local patterns, not locked in governance

### 10. Regression risk
**CRITICAL — loss of pressure understanding.** Structural signals are the primary diagnostic instrument. Each signal interpretation explains what the structural measurement means in operational terms. The compound narrative explains how signals interact. Loss would reduce the BALANCED surface to numbers without meaning.

### 11. Recommended future
**Preserve exactly** — the per-signal interpretation + compound narrative is the core BALANCED intelligence contribution. Consider constitutionalizing the interpretation templates upstream so they survive projection migration.

---

## COMPONENT 9: Pressure Concentration (BalancedNarrativeSection — pressureIntelligence)

### 1. What is this component?
SECONDARY emergence narrative: detects pressure concentration when 2+ signals activate, or any critical/high severity, or zone classification is non-NOMINAL. Produces interpretive prose about structural pressure.

### 2. Where is it rendered?
- Component: `BalancedNarrativeSection`
- File: `zones/IntelligenceField.jsx:3247` (render site), `442-468` (derive function)
- Render path: `BalancedConsequenceField` → after signal block

### 3. Where is it derived?
- `BALANCED_INTERPRETIVE_NARRATIVES.derivePressureIntelligence.derive(fullReport)`
- Reads: `fullReport.signal_interpretations` (activated count, critical count), `fullReport.propagation_summary` (zone_classification, primary_zone_business_label)

### 4. What evidence feeds it?
- DPSIG signal set (activated/critical signals)
- Propagation summary (zone anchor from VF-05 or topology model)

### 5. Derivation type
**BOUNDED INTERPRETIVE** — 75.x governed. Template prose from signal evidence. Threshold-gated.

### 6. Replay status
**Replay-safe**

### 7. Governance status
**Governance-enveloped** — 75.x

### 8. Genesis status
**YES** — signal data available in genesis. Zone label would come from DPSIG normalization_basis (VF-05 absent).

### 9. Canonical status
**Emergent but uncodified**

### 10. Regression risk
**HIGH — loss of pressure meaning.** This narrative explains WHAT the pressure concentration means: "exceeds operational thresholds" or "systemic structural stress rather than isolated conditions." Without it, the operator sees signal numbers but not their compound meaning.

### 11. Recommended future
**Preserve exactly**

---

## COMPONENT 10: Pressure Zone Focus (PressureZoneFocusBlock)

### 1. What is this component?
Spatial anchor: names the primary pressure zone, its classification (COMPOUND/SINGLE), and activated signal count. Tells the operator WHERE in the topology pressure concentrates.

### 2. Where is it rendered?
- Component: `PressureZoneFocusBlock`
- File: `zones/IntelligenceField.jsx:3074-3101`
- Render path: `BalancedConsequenceField` → after pressure intelligence narrative

### 3. Where is it derived?
- `fullReport.propagation_summary.primary_zone_business_label` — zone name
- Zone classification: **UI-COMPUTED** at `IntelligenceField.jsx:3085` — `ps.zone_classification || (activated.length > 1 ? 'COMPOUND' : 'SINGLE')`. The resolver does NOT produce `zone_classification`.
- Activated signal count: filtered from `fullReport.signal_interpretations`

### 4. What evidence feeds it?
- `decision_validation.json` VF-05 → zone anchor business label
- `semantic_topology_model.json` → zone_anchor domain
- `dpsig_signal_set.json` → normalization_basis.max_cluster_name (fallback)
- Signal interpretations for activated count

### 5. Derivation type
- Zone name: **DETERMINISTIC** — from evidence artifacts (cascaded resolution)
- Zone classification: **HEURISTIC** — UI-computed from signal count
- Compound narrative: **HEURISTIC** — from first signal's compound_narrative

### 6. Replay status
**Replay-safe** — deterministic inputs, stable heuristic

### 7. Governance status
**Ungoverned** — zone classification is UI-computed, not governance-derived

### 8. Genesis status
**PARTIAL** — zone name available via DPSIG fallback. VF-05 absent. Classification is UI-computed (works).

### 9. Canonical status
**Emergent but uncodified** — zone classification heuristic is LENS-local

### 10. Regression risk
**MEDIUM — loss of spatial anchor.** Tells the operator WHERE to look. Without it, pressure intelligence exists without location.

### 11. Recommended future
**Preserve exactly** — consider formalizing zone classification upstream

---

## COMPONENT 11: Propagation Pattern (BalancedNarrativeSection — propagationIntelligence)

### 1. What is this component?
TERTIARY emergence narrative: detects triadic propagation pattern (ORIGIN → PASS_THROUGH → RECEIVER) when 2+ roles are active. Explains cross-domain structural dependency.

### 2. Where is it rendered?
- Component: `BalancedNarrativeSection`
- File: `zones/IntelligenceField.jsx:3250` (render site), `470-499` (derive function)

### 3. Where is it derived?
- Reads `fullReport.evidence_blocks` — scans for `propagation_role` fields
- Role assignment: resolver `clusterToEvidenceBlock()` — ORIGIN = max DPSIG cluster, PASS_THROUGH = manifest-declared, RECEIVER = first remaining
- Threshold: 2+ roles active with ORIGIN/PASS_THROUGH/RECEIVER

### 4. What evidence feeds it?
- `canonical_topology.json` clusters
- `dpsig_signal_set.json` normalization_basis.max_cluster_id
- Manifest `passthrough_dom` declaration

### 5. Derivation type
- Role assignment: **DETERMINISTIC** (ORIGIN) + **SYNTHETIC** (PASS_THROUGH from manifest declaration, not measured)
- Narrative: **BOUNDED INTERPRETIVE** — 75.x governed

### 6. Replay status
**Replay-safe** — deterministic from artifacts + manifest

### 7. Governance status
**Governance-enveloped** — 75.x

### 8. Genesis status
**PARTIAL** — genesis produces canonical_topology and DPSIG. But `evidence_blocks` are SUPPRESSED at S1 (resolver line 776: `isS1 ? [] : ...`). For S2 genesis runs, evidence blocks would be available. PASS_THROUGH depends on manifest declaration.

### 9. Canonical status
**Emergent but uncodified** — propagation role assignment is LENS-local, not a governance classification

### 10. Regression risk
**MEDIUM — loss of propagation meaning.** Explains structural dependency chains. Without it, the operator sees domains in isolation rather than understanding cross-domain pressure transmission.

### 11. Recommended future
**Preserve exactly** — propagation chain is genuine structural intelligence. Role assignment heuristic (especially PASS_THROUGH from manifest) should be reviewed for governance-grade derivation.

---

## COMPONENT 12: Qualification Compression (BalancedNarrativeSection — qualificationIntelligence)

### 1. What is this component?
TERTIARY emergence narrative: detects when qualification band is not STRONG or advisory-bound ratio > 40%. Explains confidence compression effect.

### 2. Where is it rendered?
- File: `zones/IntelligenceField.jsx:3253` (render site), `501-530` (derive function)

### 3. Where is it derived?
- Reads: `fullReport.readiness_summary.band`, `fullReport.topology_summary` (backed/total ratio)
- Threshold: band ≠ STRONG OR advisoryRatio > 0.4

### 4. What evidence feeds it?
- `decision_validation.json` VF-01 → band
- `semantic_topology_model.json` → domain lineage counts

### 5. Derivation type
**BOUNDED INTERPRETIVE** — 75.x governed

### 6. Replay status
**Replay-safe**

### 7. Governance status
**Governance-enveloped** — 75.x

### 8. Genesis status
**PARTIAL** — genesis has topology (for ratio) but NOT decision_validation (for band). Without band, the narrative would fire based on ratio only — which may always be true for specimens with high advisory-bound ratios. The band check provides a balanced gate. Genesis would need band equivalent from S-level heuristic.

### 9. Canonical status
**Emergent but uncodified**

### 10. Regression risk
**MEDIUM — loss of confidence compression cognition.** Explains the QUANTITATIVE gap between structural proof and advisory-only claims. Without it, "23.5% grounded" is a number without operational meaning.

### 11. Recommended future
**Preserve exactly** — the ratio-based emergence is structurally sound even without band

---

## COMPONENT 13: Intelligence State (SupportRail — BALANCED-only block)

### 1. What is this component?
Right-column intelligence indicator grid showing all 8 emergence narrative states: filled dot (●) = emerged/active, empty dot (○) = nominal/dormant. Per narrative: emergence label or nominal label.

### 2. Where is it rendered?
- Component: `SupportRail` (BALANCED branch)
- File: `zones/IntelligenceField.jsx:670-686`
- Render path: `IntelligenceField` → right column → `SupportRail`
- Section: Right rail, labeled "INTELLIGENCE STATE"

### 3. Where is it derived?
- `emergenceState` prop — the full narrative derivation results from `BALANCED_INTERPRETIVE_NARRATIVES`, bubbled from `BalancedConsequenceField` via `onEmergenceState`
- Each indicator: `narrative !== null` = active, else nominal
- Labels from `BALANCED_INTERPRETIVE_NARRATIVES` registry: `emergenceLabel` (active) / `nominalLabel` (dormant)

### 4. What evidence feeds it?
Same as all 8 emergence narratives — transitive evidence dependency on topology, signals, governance, enrichment, convergence

### 5. Derivation type
**DETERMINISTIC** — binary active/nominal from emergence function return value

### 6. Replay status
**Replay-safe** — deterministic from emergence function results

### 7. Governance status
**Governance-enveloped** — reflects 75.x narrative emergence state

### 8. Genesis status
**PARTIAL** — 5 of 8 narratives have genesis data (executiveSynthesis, groundingIntelligence, pressureIntelligence, propagationIntelligence, qualificationIntelligence). 3 depend on governed lifecycle data (governancePosture requires governance_lifecycle.available, enrichmentPosture requires enrichment_intelligence.available, convergencePosture requires convergence_intelligence.available) — genesis produces ALL of these (promotion_state, enrichment_summary, convergence_observations exist). So for governed genesis runs, all 8 indicators SHOULD activate if thresholds are met.

### 9. Canonical status
**Emergent but uncodified** — the 8-indicator grid is a LENS-local pattern

### 10. Regression risk
**MEDIUM — loss of emergence visibility.** The indicator grid is the operator's dashboard of "what the system is telling me." Without it, the operator must scroll through the full center column to discover which narratives emerged.

### 11. Recommended future
**Preserve exactly** — the 8-indicator grid is a compact intelligence status display. If emergence registry expands, the grid should grow accordingly.

---

## COMPONENT 14: Evidence Boundary (EvidenceBoundarySection)

### 1. What is this component?
Two-column display: "Confirmed" (N structurally backed domains, M clusters) vs "Outside Evidence Scope" (N semantic-only domains, "no structural backing · advisory bound"). Footer: "These are confirmed unknowns — not assumed healthy states."

### 2. Where is it rendered?
- Component: `EvidenceBoundarySection`
- File: `zones/IntelligenceField.jsx:3032-3061`
- Render path: `BalancedConsequenceField` → after qualifier narrative line

### 3. Where is it derived?
- `scope.grounded_domain_count` / `fullReport.topology_summary.structurally_backed_count` (cascaded)
- `scope.domain_count` / `fullReport.topology_summary.semantic_domain_count`
- `topology_summary.cluster_count` / `scope.cluster_count`
- Semantic-only: `max(0, total - grounded)`

### 4. What evidence feeds it?
- `semantic_topology_model.json` — domain lineage (EXACT/STRONG = backed)
- `canonical_topology.json` — cluster count

### 5. Derivation type
**DETERMINISTIC** — counting operations on governed topology artifacts

### 6. Replay status
**Replay-safe**

### 7. Governance status
**Governance-derived** — lineage classification is governed

### 8. Genesis status
**YES** — both topology artifacts present in genesis

### 9. Canonical status
**Canonical** — deterministic computation from governed artifacts. The "confirmed unknowns" framing is LENS-local prose.

### 10. Regression risk
**CRITICAL — loss of evidence honesty.** This is the most distinctive BALANCED construct. It reframes incomplete evidence not as failure but as honest structural transparency. "13 are outside evidence scope — confirmed unknowns, not assumed healthy." This cognitive frame is irreplaceable. Loss would mean the operator cannot distinguish between "we checked and it's fine" and "we haven't checked."

### 11. Recommended future
**Preserve exactly** — constitutionalize the "confirmed unknowns" framing upstream. This is a governance-grade cognitive pattern, not a UI pattern.

---

## COMPONENT 15: Structural Conclusion (StructuralConclusionBlock)

### 1. What is this component?
Single concluding sentence below all signal/pressure/propagation content. Default: "The system is structurally stable. INVESTIGATE is driven by evidence incompleteness, not structural instability."

### 2. Where is it rendered?
- Component: `StructuralConclusionBlock`
- File: `zones/IntelligenceField.jsx:3063-3072`
- Render path: `BalancedConsequenceField` → after propagation narrative

### 3. Where is it derived?
- `fullReport.readiness_summary.conclusion` — with hardcoded fallback string
- The resolver does NOT produce `readiness_summary.conclusion`. The component always renders the fallback.

### 4. What evidence feeds it?
**NO EVIDENCE** — the conclusion string is hardcoded in the component JSX.

### 5. Derivation type
**SYNTHETIC** — static string, not derived from any evidence

### 6. Replay status
**NOT replay-safe** — static regardless of specimen state. A specimen with genuine structural instability would still show "structurally stable."

### 7. Governance status
**Ungoverned** — hardcoded prose with no evidence trace

### 8. Genesis status
**N/A** — hardcoded, not data-dependent

### 9. Canonical status
**Synthetic-only** — not derived from evidence. Cognitively valuable but structurally unsound.

### 10. Regression risk
**LOW** — the text is hardcoded. Cannot regress. But its ABSENCE (if removed) would lose the cognitive closure of the signal section. The operator needs a concluding assessment after signal/pressure detail.

### 11. Recommended future
**Recompute deterministically** — derive from readiness_summary posture + signal severity + grounding ratio. A specimen with ESCALATE posture should NOT conclude "structurally stable." The conclusion should be evidence-derived, not static.

---

## COMPONENT 16: Emergence Narrative System (BALANCED_INTERPRETIVE_NARRATIVES)

### 1. What is this component?
The architectural system governing ALL BALANCED interpretive narratives: 8 derivation functions, threshold-gated emergence, PRIMARY/SECONDARY/TERTIARY classification, three-layer rendering (narrative → structural basis → evidence chain).

### 2. Where is it rendered?
- Registry: `zones/IntelligenceField.jsx:372-615`
- Renderer: `BalancedNarrativeSection` at `3130-3162`
- Render path: `BalancedConsequenceField` invokes all 8 via `useMemo` at `3172-3178`, renders each via `BalancedNarrativeSection`

### 3. Where is it derived?
Each function reads specific `fullReport` fields and applies threshold logic:
- PRIMARY (1): Always emerges when readiness data exists
- SECONDARY (3): Emerges at structural thresholds (grounding asymmetry, pressure concentration, governance lifecycle availability)
- TERTIARY (4): Emerges at deeper thresholds (propagation roles, qualification compression, enrichment events, convergence observations)
- Each returns: `{ narrative, evidenceChain, structuralBasis, authority: 'INTERPRETIVE', emergenceClass }`

### 4. What evidence feeds it?
Transitive: all topology, signal, governance, enrichment, convergence evidence across the fullReport

### 5. Derivation type
**BOUNDED INTERPRETIVE** — 75.x governed. Template prose with evidence chains. Threshold-gated.

### 6. Replay status
**Replay-safe** — deterministic threshold evaluation + template assembly

### 7. Governance status
**Governance-enveloped** — 75.x authority on all narrative outputs, 13 prohibitions enforced

### 8. Genesis status
**PARTIAL** — 5/8 functions have genesis-available inputs (topology + signals). 3/8 require governed lifecycle data (governancePosture, enrichmentPosture, convergencePosture) — genesis produces ALL required artifacts (promotion_state, enrichment_summary, convergence_observations). For governed genesis runs, ALL 8 should be genesis-available.

### 9. Canonical status
**Emergent but uncodified** — the emergence system is a genuine architectural pattern (threshold-gated, evidence-traced, authority-classified) but exists only in LENS component code, not in a governance contract

### 10. Regression risk
**CRITICAL — governance domination.** This is the BALANCED surface's architectural identity. If the emergence system is replaced by a fixed governance-section layout, the surface loses its responsive character. The emergence model ensures that simple specimens show concise surfaces and complex specimens show rich multi-layer narratives. A fixed layout would either show empty sections for simple specimens or insufficient sections for complex ones. THIS IS THE PRIMARY REGRESSION RISK ACROSS THE ENTIRE BALANCED SURFACE.

### 11. Recommended future
**Constitutionalize upstream** — the emergence model (threshold-gated, evidence-traced, authority-classified, three-layer rendering) should be formalized as a governance contract before any migration. The 8 functions should remain the architectural pattern; new governed sections should be added to the registry, not as replacement for it.

---

## COMPONENT 17: Guided Queries (EXECUTIVE_BALANCED expansions)

### 1. What is this component?
4 structural interrogation queries available via escalation: evidence lineage, grounding asymmetry risk, emergence conditions, signal compression. Each derives a summary, evidence list, and structural context from fullReport.

### 2. Where is it rendered?
- Registry: `zones/IntelligenceField.jsx:2145-2239`
- Render path: `ExecutiveInterpretation` → expansion-active panel (when `piRuntimeActive` AND `activeExpansionIndex !== null`)
- Trigger: "STRUCTURAL DEPTH" button in SupportRail → escalation → expansion chips

### 3. Where is it derived?
- Each query has a `derive(fullReport)` function that reads topology_summary, evidence_blocks, signal_interpretations
- Queries are HARDCODED in `GUIDED_QUERY_EXPANSIONS.EXECUTIVE_BALANCED` array
- Escalation availability gated by: `advisoryRatio > 0.3 && activated.length >= 2`

### 4. What evidence feeds it?
- Topology model (domain counts, grounding)
- Evidence blocks (structural backing per domain)
- Signal interpretations (activated count, severity)

### 5. Derivation type
**BOUNDED INTERPRETIVE** — 75.x governed with evidence chains

### 6. Replay status
**Replay-safe** — deterministic derive functions from artifacts

### 7. Governance status
**Governance-enveloped** — 75.x

### 8. Genesis status
**PARTIAL** — topology and signals available. Evidence blocks suppressed at S1 (available at S2+). Escalation threshold may be met depending on specimen state.

### 9. Canonical status
**Emergent but uncodified** — query catalog is LENS-local

### 10. Regression risk
**MEDIUM — loss of interrogative depth.** Guided queries are the BALANCED operator's descent path into structural detail. Without them, BALANCED is a read-only surface with no interactive depth.

### 11. Recommended future
**Preserve exactly** — consider extending query catalog from projection object, but preserve the 4 hardcoded queries as fallback

---

## COMPONENT 18: Governance Envelope (tier-handoff footer)

### 1. What is this component?
Footer declaration of authority model: "Structural derivation primary — bounded interpretive synthesis · evidence-bound · 75.x" (when narratives active) or "This surface presents structurally derived evidence only" (when no interpretation).

### 2. Where is it rendered?
- File: `zones/IntelligenceField.jsx:3259-3266`
- Render path: `BalancedConsequenceField` → final element

### 3. Where is it derived?
- `authorityActive` boolean — `emergedCount > 0` from narrative derivation results
- Text: two hardcoded strings selected by boolean

### 4. What evidence feeds it?
Transitive — whether any narrative emerged (which depends on all narrative evidence inputs)

### 5. Derivation type
**DETERMINISTIC** — boolean selection from emergence state

### 6. Replay status
**Replay-safe**

### 7. Governance status
**Governance declaration** — this IS the governance envelope, declaring what authority model the surface operates under

### 8. Genesis status
**YES** — works regardless of data source

### 9. Canonical status
**Canonical** — 75.x authority declaration

### 10. Regression risk
**HIGH — loss of governance legitimacy.** Without the handoff, the operator cannot distinguish governed interpretive content from raw data display. The authority declaration IS the governance envelope.

### 11. Recommended future
**Preserve exactly**

---

## COMPONENT 19: Report Pack / Evidence Record Affordances (SupportRail)

### 1. What is this component?
Right-column affordances: EVIDENCE RECORD (export button with explored query count) and REPORT PACK (4 artifact links: Decision Surface, Tier-1 Narrative Brief, Tier-1 Evidence Brief, Tier-2 Diagnostic Narrative).

### 2. Where is it rendered?
- Component: `SupportRail`
- File: `zones/IntelligenceField.jsx:855-895`
- Section: Right rail, bottom

### 3. Where is it derived?
- Evidence record export: `InterrogationTrailBuilder` state (explored queries/expansions)
- Report pack artifacts: `reportPackArtifacts` prop — HTML report files from `reports/` directory via `buildNextGenReportBinding()` in `flagshipBinding.js`

### 4. What evidence feeds it?
- Report HTML files: `clients/{client}/psee/runs/{run}/reports/` directory
- Evidence record: runtime interrogation state (session-local)

### 5. Derivation type
- Report pack: **DETERMINISTIC** — file existence check
- Evidence record: **RUNTIME COMPOSITION** — built from operator session

### 6. Replay status
- Report pack: **replay-safe** (files exist or don't)
- Evidence record: **NOT replay-safe** (session-dependent)

### 7. Governance status
**Ungoverned** — file links, not governed projections

### 8. Genesis status
**NO.** Genesis does not produce HTML reports (`reports/` directory empty, report_pack = `{}`). Evidence record export works (session-based).

### 9. Canonical status
**Legacy operational cognition** — report pack is from legacy pipeline

### 10. Regression risk
**LOW** — report pack is a convenience link. Evidence record export is session-level.

### 11. Recommended future
- Report pack: **deprecate** or **migrate** — genesis should produce governed evidence exports, not legacy HTML reports
- Evidence record: **preserve exactly** — session-level export is valuable

---

## COMPONENT 20: RepModeTag / Indicator Strip Semantics

### 1. What is this component?
Mode identifier tag: "Executive lens · CEO · consequence-first read" with zone chips Z1 (Executive Posture), Z4 (Pressure Anchor). The BalancedIndicatorStrip (DP/PA codes) is defined but **NOT RENDERED** — it is dead code.

### 2. Where is it rendered?
- Component: `RepModeTag`
- File: `zones/IntelligenceField.jsx:122-139` (component), `3198-3205` (invocation)
- Section: Top of center column

### 3. Where is it derived?
- All values are **HARDCODED** in the JSX: label, subtitle, zone names

### 4. What evidence feeds it?
**NO EVIDENCE** — hardcoded strings

### 5. Derivation type
**SYNTHETIC** — static strings

### 6. Replay status
**N/A** — static

### 7. Governance status
**Ungoverned** — hardcoded BOARDROOM-inherited framing

### 8. Genesis status
**N/A** — static

### 9. Canonical status
**Deprecated candidate** — the BOARDROOM framing ("CEO · consequence-first read") is incorrect for BALANCED. This is a copy artifact from when both modes shared a render path.

### 10. Regression risk
**NONE** — replacing this would be IMPROVEMENT, not regression

### 11. Recommended future
**Redesign** — replace with BALANCED-specific identity. "Operational intelligence · Investigative read" or equivalent.

---

## ADDITIONAL COMPONENT: SQO Intelligence Zone

### 1. What is this component?
Compact collapsible SQO badge showing S-state (S2), narrative description, blocking condition, progression readiness, resolution path. Expandable to show full SQO cockpit link.

### 2. Where is it rendered?
- Component: `SQOIntelligenceZone`
- File: `zones/SQOIntelligenceZone.jsx:54-130`
- Render path: `LensDisclosureShell` → tier1
- NOT rendered in boardroom mode (`if (boardroomMode) return null`)

### 3. Where is it derived?
- `binding` = `substrateBinding` from `LensSQOSubstrateConsumer.buildLensSubstrateBinding()`
- Reads: `trustPosture.s_state`, `debtVisibility`, `propagationVisibility`
- Narrative functions: `deriveBlockingNarrative()`, `derivePrimaryBlockingCondition()`, `deriveProgressionNarrative()`, `deriveResolutionPath()` — all in `SQOIntelligenceZone.jsx`

### 4. What evidence feeds it?
- `runtime_qualification_projection.v1.json` from SQO overlay

### 5. Derivation type
**HEURISTIC** — template narratives from qualification projection

### 6. Replay status
**Replay-safe** — deterministic from SQO artifact

### 7. Governance status
**Governance-derived** — SQO qualification projection is governed

### 8. Genesis status
**NO** — requires SQO overlay artifacts not produced by genesis

### 9. Canonical status
**Legacy operational cognition** — depends on SQO overlay pipeline

### 10. Regression risk
**MEDIUM** — provides SQO context (blocking conditions, progression path)

### 11. Recommended future
**Migrate into governed substrate** — SQO intelligence should be derivable from genesis-available `promotion_state.json`

---

## ADDITIONAL COMPONENT: Decision Posture Actor (inline in BalancedConsequenceField)

### 1. What is this component?
"DP Decision Posture" actor block with state label (e.g., "Executive Ready — Qualified"), confidence bar (grounded % vs advisory %), and meta line ("4 of 17 grounded · 13 advisory bound").

### 2. Where is it rendered?
- Inline in `BalancedConsequenceField`
- File: `zones/IntelligenceField.jsx:3207-3223`

### 3. Where is it derived?
- `badge.state_label` from `adapted.readinessBadge` — HOWEVER: the adapter produces `readiness_label`, not `state_label`. The component reads `state_label` which falls back to `'—'`. The ACTUAL `state_label` comes from `header_block.readiness_badge.state_label` in the resolver (hardcoded: "Structural Substrate Active" for S1, "Executive Ready — Qualified" for S2+). Field mapping is BROKEN through the adapter pipeline.
- `grounded`/`total` from `scope.grounded_domain_count`/`scope.domain_count`

### 4. What evidence feeds it?
- State label: resolver heuristic from S-level
- Grounding ratio: topology model domain counts

### 5. Derivation type
- State label: **HEURISTIC** — hardcoded string per S-level
- Grounding bar: **DETERMINISTIC** — ratio from domain counts

### 6. Replay status
**Replay-safe** — deterministic inputs

### 7. Governance status
**Partially governed** — grounding from governed topology; state label from resolver heuristic

### 8. Genesis status
**YES** — topology data available. State label derivable from S-level.

### 9. Canonical status
- Grounding bar: **canonical**
- State label: **legacy operational cognition** — hardcoded strings, adapter field mapping broken
- "DP" code: **deprecated candidate** — BOARDROOM actor code, not BALANCED identity

### 10. Regression risk
**MEDIUM** — confidence bar is the operator's visual grounding gauge

### 11. Recommended future
- Confidence bar: **preserve exactly**
- State label: fix adapter field mapping or derive directly from resolver
- "DP" actor code: **redesign** — BALANCED-specific identity

---

## ADDITIONAL COMPONENT: Executive Synthesis (BalancedNarrativeSection — PRIMARY)

### 1. What is this component?
PRIMARY emergence narrative: the lead paragraph. "EXECUTIVE SYNTHESIS · 75.x" marker. Posture-conditioned prose explaining readiness state. Always emerges when readiness data exists.

### 2. Where is it rendered?
- File: `zones/IntelligenceField.jsx:3239` (render site), `373-410` (derive function)

### 3. Where is it derived?
- Reads: `readiness_summary` (score, posture), `topology_summary` (backed/total), `signal_interpretations` (activated count)
- Narrative templates: posture-conditioned (INVESTIGATE/PROCEED/ESCALATE/indeterminate) + grounding gap + signal count

### 4. What evidence feeds it?
- Decision validation VF-01 (posture, band) or S-level heuristic
- Topology model (domain counts)
- Signal data (activated count)

### 5. Derivation type
**BOUNDED INTERPRETIVE** — 75.x governed

### 6. Replay status
**Replay-safe**

### 7. Governance status
**Governance-enveloped** — 75.x

### 8. Genesis status
**PARTIAL** — topology and signals available. Posture from S-level heuristic (no VF-01).

### 9. Canonical status
**Emergent but uncodified** — posture-conditioned narrative templates are LENS-local

### 10. Regression risk
**CRITICAL** — this is the BALANCED surface's lead sentence. Loss eliminates the operator's primary interpretive frame.

### 11. Recommended future
**Preserve exactly** — constitutionalize posture-conditioned narrative templates

---

# BALANCED_COGNITION_MATRIX

| Component | Cognitive Role | Derivation Source | Evidence Inputs | Authority Type | Replay Status | Governance Status | Genesis Available | Canonical Status | Regression Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|
| Operational Posture (state) | Readiness stamp | SemanticActorHydrator.deriveRenderState | decision_validation VF-01, Q-class | deterministic | replay-safe | governance-enveloped | PARTIAL (no VF-01) | canonical | LOW | preserve exactly |
| Operational Posture (scope) | Domain/cluster counts | **HARDCODED** | **NONE** | synthetic | NOT replay-safe | ungoverned | N/A | synthetic-only | LOW (already broken) | recompute deterministically |
| Reconciliation Posture | Confidence classification | LensReconciliationConsumptionLayer | topology model, crosswalk, lifecycle | heuristic thresholds | replay-safe | partially governed | NO (no SQO overlay) | emergent uncodified | HIGH | constitutionalize upstream |
| Weighted Confidence | Single-metric confidence | compileCorrespondence() | topology model domain lineage | deterministic | replay-safe | governance-derived | YES (partial — no crosswalk) | canonical | HIGH | preserve exactly |
| Confidence Trajectory | Temporal evolution | ReconciliationLifecycleProjection | reconciliation_lifecycle.v1.json | deterministic | replay-safe | partially governed | NO (no SQO overlay) | legacy operational | HIGH | migrate into governed substrate |
| Executive Interpretation | At-a-glance framing | resolver template + emergence | readiness, topology, signals, narratives | heuristic + bounded interpretive | replay-safe | mixed (ungoverned template + governed narratives) | PARTIAL | emergent uncodified | MEDIUM | preserve governed parts; recompute template |
| Grounding Posture | Grounding asymmetry meaning | BALANCED_INTERPRETIVE_NARRATIVES | topology model | bounded interpretive | replay-safe | governance-enveloped (75.x) | YES | emergent uncodified | HIGH | preserve exactly |
| Structural Context (trust) | Trust level strip | LensSQOSubstrateConsumer | runtime_qualification_projection.v1.json | heuristic | replay-safe | governance-derived | NO (no SQO overlay) | legacy operational | MEDIUM | migrate into governed substrate |
| Structural Signals | Per-signal interpretation | buildSignalInterpretations() | dpsig_signal_set, signal_registry, topology | deterministic values + heuristic prose | replay-safe | partially governed | YES | emergent uncodified | CRITICAL | preserve exactly |
| Pressure Concentration | Pressure meaning | BALANCED_INTERPRETIVE_NARRATIVES | signals, propagation_summary | bounded interpretive | replay-safe | governance-enveloped (75.x) | YES | emergent uncodified | HIGH | preserve exactly |
| Pressure Zone Focus | Spatial anchor | resolver + UI heuristic | VF-05, DPSIG normalization_basis | deterministic name + heuristic classification | replay-safe | ungoverned (classification) | PARTIAL (no VF-05) | emergent uncodified | MEDIUM | preserve exactly |
| Propagation Pattern | Cross-domain dependency | BALANCED_INTERPRETIVE_NARRATIVES | evidence_blocks, canonical_topology | bounded interpretive | replay-safe | governance-enveloped (75.x) | PARTIAL (S2+ only) | emergent uncodified | MEDIUM | preserve exactly |
| Qualification Compression | Confidence compression meaning | BALANCED_INTERPRETIVE_NARRATIVES | readiness band, topology ratio | bounded interpretive | replay-safe | governance-enveloped (75.x) | PARTIAL (no band) | emergent uncodified | MEDIUM | preserve exactly |
| Intelligence State | Emergence dashboard | BalancedConsequenceField → SupportRail | all emergence inputs | deterministic (binary) | replay-safe | governance-enveloped | PARTIAL (8/8 for governed genesis) | emergent uncodified | MEDIUM | preserve exactly |
| Evidence Boundary | Confirmed vs unknown | EvidenceBoundarySection | topology model, canonical_topology | deterministic | replay-safe | governance-derived | YES | canonical | CRITICAL | preserve exactly; constitutionalize "confirmed unknowns" |
| Structural Conclusion | Closing assessment | **HARDCODED FALLBACK** | **NONE** | synthetic | NOT replay-safe | ungoverned | N/A | synthetic-only | LOW | recompute deterministically |
| Emergence Narrative System | Architectural pattern (all 8 narratives) | BALANCED_INTERPRETIVE_NARRATIVES registry | all fullReport fields | bounded interpretive | replay-safe | governance-enveloped (75.x) | PARTIAL (all 8 for governed genesis) | emergent uncodified | CRITICAL (governance domination) | constitutionalize upstream |
| Guided Queries | Interrogative depth | GUIDED_QUERY_EXPANSIONS | topology, signals, evidence_blocks | bounded interpretive | replay-safe | governance-enveloped (75.x) | PARTIAL | emergent uncodified | MEDIUM | preserve exactly |
| Governance Envelope | Authority declaration | BalancedConsequenceField (boolean) | emergence state | deterministic | replay-safe | governance declaration | YES | canonical | HIGH | preserve exactly |
| Report Pack | Legacy report links | buildNextGenReportBinding() | reports/ HTML files | deterministic (file check) | replay-safe | ungoverned | NO (no reports) | legacy operational | LOW | deprecate or migrate |
| Evidence Record | Session export | InterrogationTrailBuilder | runtime session | runtime composition | NOT replay-safe | ungoverned | YES (session-based) | emergent uncodified | LOW | preserve exactly |
| RepModeTag | Mode identity | **HARDCODED** | **NONE** | synthetic | N/A | ungoverned | N/A | deprecated candidate | NONE | redesign |
| Decision Posture Actor | Readiness gauge | resolver heuristic + topology | S-level, domain counts | heuristic + deterministic | replay-safe | partially governed | YES | mixed (canonical bar + legacy label) | MEDIUM | preserve bar; fix label; redesign actor code |
| Executive Synthesis | Lead narrative | BALANCED_INTERPRETIVE_NARRATIVES | readiness, topology, signals | bounded interpretive | replay-safe | governance-enveloped (75.x) | PARTIAL | emergent uncodified | CRITICAL | preserve exactly |
| SQO Intelligence | SQO context | SQOIntelligenceZone | runtime_qualification_projection.v1.json | heuristic | replay-safe | governance-derived | NO (no SQO overlay) | legacy operational | MEDIUM | migrate into governed substrate |
| Compact Trust Strip | Trust level indicator | resolveTrustPosture() | runtime_qualification_projection.v1.json | heuristic | replay-safe | governance-derived | NO (no SQO overlay) | legacy operational | MEDIUM | migrate into governed substrate |

---

## GENESIS GAP SUMMARY

### Components fully genesis-available (will render with genesis_e2e_03 data):
1. Evidence Boundary
2. Grounding Posture narrative
3. Pressure Concentration narrative
4. Structural Signals
5. Governance Envelope (handoff)
6. Evidence Record (session-based)
7. Weighted Confidence (partial — no crosswalk)
8. Executive Synthesis (partial — no VF-01)
9. Intelligence State (all 8 indicators for governed genesis)

### Components NOT genesis-available (require SQO overlay pipeline):
1. Confidence Trajectory
2. Compact Trust Strip
3. SQO Intelligence Zone
4. Reconciliation Posture (metrics available; lifecycle trajectory NOT)
5. Report Pack

### Components requiring non-genesis artifacts (decision_validation, crosswalk):
1. Operational Posture state (needs VF-01 for band/posture — falls back to S-level heuristic)
2. Qualification Compression (needs band — fires on ratio only)
3. Pressure Zone Focus (needs VF-05 for zone label — falls back to DPSIG)

### Components that are hardcoded/synthetic regardless of data:
1. Operational Posture scope line ("3 Domains · 47 Clusters")
2. Structural Conclusion ("structurally stable")
3. RepModeTag ("CEO · consequence-first read")

---

## CRITICAL FINDINGS

### 1. THE EMERGENCE SYSTEM IS THE ARCHITECTURE
The 8-function threshold-gated emergence model with THREE-TIER classification (PRIMARY/SECONDARY/TERTIARY) and three-layer rendering (narrative/basis/evidence chain) is not a UI pattern. It is a cognitive architecture. It makes the BALANCED surface responsive to evidence state. Simple specimens show concise surfaces; complex specimens show rich multi-layer narratives. Replacing this with a fixed governance-section layout IS the primary regression risk.

### 2. SQO OVERLAY PIPELINE IS THE GENESIS GAP
5 components depend on `artifacts/sqo/` overlay artifacts that do NOT exist for genesis_e2e_03. The entire reconciliation/trust/SQO intelligence layer is absent from governed genesis runs. This is not a rendering bug — it's a pipeline gap. The SQO overlay materializer has not been run against genesis outputs.

### 3. THREE HARDCODED CONSTRUCTS HAVE NO EVIDENCE
Operational Posture scope line, Structural Conclusion, and RepModeTag are hardcoded strings with no derivation from specimen data. Two of these (conclusion and scope) present as evidence-derived when they are not. This is a structural honesty gap.

### 4. EVIDENCE BOUNDARY IS CONSTITUTIONAL
The "Confirmed vs Outside Evidence Scope" framing with "confirmed unknowns — not assumed healthy states" is a governance-grade cognitive pattern. It should be constitutionalized upstream as a core PI principle, not treated as a UI component.

### 5. SIGNAL INTERPRETATION IS IRREPLACEABLE
Per-signal interpretation with compound narrative is the BALANCED surface's most operationally rich construct. Each signal gets meaning-in-context prose. The compound narrative explains inter-signal dynamics. This cannot be reconstructed from projection objects alone — the interpretation templates are the intelligence.

### 6. ADAPTER FIELD MAPPING IS BROKEN
`adapted.readinessBadge.state_label` is read by the component but the adapter produces `readiness_label`. The field falls through to `'—'` fallback or is being read from a different path (`header_block.readiness_badge.state_label`). This is a latent bug — the surface works despite the field name mismatch because the resolver puts `state_label` on the raw payload, which is being consumed directly somewhere in the rendering chain.
