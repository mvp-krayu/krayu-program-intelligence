# Cross-Specimen Automation Matrix — What Is Automatic vs Operator-Manual

**Artifact:** PI.RAW-INGESTION-VALIDATION.NETBOX.01 / CROSS_SPECIMEN_AUTOMATION_MATRIX
**Status:** EVIDENCE MATRIX — supersedes the "cognition not produced / operator-produced" framing in PHASE_0_FACTORY_CERTIFICATION_RESULT.md
**Date:** 2026-06-12
**Control specimen:** StackStorm (S1, no promoted semantics, no manual advancement, full cognition)

## Purpose

Determine, per layer and per specimen, which stage is produced **automatically** vs requires **operator** authorship. Marks: AUTO / MANUAL (artifact-proven operator authorship) / ABSENT / UNKNOWN. Every cell cites an artifact path. "Operator-produced" is used ONLY where an artifact proves manual operator authorship.

## Specimens

| Col | Run |
|---|---|
| BlueEdge | `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03` (S2) |
| StackStorm | `clients/stackstorm/psee/runs/run_github_st2_20260520_131000` (S1 — control) |
| NetBox canonical | `clients/netbox/psee/runs/run_github_netbox_20260520_134600` (S2) |
| NetBox fresh | `clients/netbox/psee/runs/run_netbox_factory_cert_05` (fail-closed @ Phase 8a) |

## Matrix

| Layer | BlueEdge | StackStorm (control) | NetBox canonical | NetBox fresh |
|---|---|---|---|---|
| Source materialization | AUTO `intake/canonical_repo` | AUTO `intake/canonical_repo` | AUTO `intake/canonical_repo` | AUTO `intake/canonical_repo` (LIVE_MATERIALIZED_FROM_RAW_ARCHIVE) |
| Structural graph | AUTO `structure/40.3`,`40.4/canonical_topology.json` | AUTO `structure/40.3`,`40.4` | AUTO `structure/40.3`,`40.4` | AUTO `structure/40.3`,`40.4` (2540 nodes) |
| Semantic enrichment | AUTO `semantic/spe/spe_derivation_report.json` + PROMOTED `semantic/spe/semantic_propositions.json` | AUTO `semantic/spe/spe_derivation_report.json` (+ `proposition_review_queue.json`) — not promoted | AUTO `semantic/spe/spe_derivation_report.json` — not promoted | ABSENT — SPE not invoked (flag `--enable-semantic-derivation`, `run_client_pipeline.py:112`) |
| Domain/capability extraction | AUTO `dom/dom_layer.json` | AUTO `dom/dom_layer.json` | ABSENT at run path (no `dom/`) | AUTO `dom/dom_layer.json` (synthesized from CEUs, `run_client_pipeline.py:586`) |
| Signal generation | AUTO `artifacts/dpsig/blueedge/run_blueedge_genesis_e2e_03/dpsig_signal_set.json` | AUTO (runtime) `lib/lens-v2/SignalSynthesisEngine.js` (no persisted dpsig) | ABSENT persisted; runtime-synthesizable | AUTO `artifacts/dpsig/netbox/run_netbox_factory_cert_05/dpsig_signal_set.json` |
| Consequence generation | AUTO (runtime) `lib/lens-v2/DomainCognitionCompiler.js` | AUTO (runtime) — observed | AUTO (runtime) on bind | ABSENT — not bound |
| Execution blindness / divergence findings | AUTO (runtime) `DomainCognitionCompiler.js` | AUTO (runtime) — CONTROL: produced w/o promoted semantics or S2 | AUTO (runtime) on bind | ABSENT — not bound |
| SQO qualification | AUTO→S1 (`system:governance_projection`); MANUAL→S2 (`operator:khorrix`/`s2_advancement_granted` L5, `sqo/promotion_event_log.jsonl` EVT-012) | AUTO→S1 only (`system:governance_projection`/`structural_onboarding_complete`); `promotion_eligible:false` (`sqo/promotion_state.json`) | AUTO→S1; MANUAL→S2 (`operator:khorrix`, `sqo/promotion_event_log.jsonl` EVT-012) | ABSENT — no `sqo/`; fail-closed @ Phase 8a Vault Construction before SQO |
| AO production | ABSENT (runtime session-scoped; none persisted) | ABSENT (runtime session-scoped) | ABSENT | ABSENT |
| LENS binding | MANUAL `app/execlens-demo/lib/lens-v2/manifests/blueedge.run_blueedge_genesis_e2e_03.json` (git 9cf0c51; no script writes registry) | MANUAL `…/manifests/stackstorm.run_github_st2_20260520_131000.json` (git 153c5d3; all referenced artifacts present) | MANUAL `…/manifests/netbox.run_github_netbox_20260520_134600.json` (git 6ce713c) | ABSENT — no manifest |
| Assessment package | ABSENT | ABSENT | ABSENT | ABSENT |

## Conclusions (StackStorm-anchored)

1. **Cognition is AUTOMATIC and runtime-compiled.** StackStorm = S1, no promoted `semantic_propositions.json`, last transition actor `system:governance_projection` (not an operator), yet full specimen-specific execution-blindness / gravity-divergence findings. Compiled at bind by `DomainCognitionCompiler.js`/`SignalSynthesisEngine.js`. No persisted consequence file in any run; no operator artifact in the cognition path. The prior "cognition not produced / operator-produced" claim is RETRACTED.

2. **BlueEdge is not special for cognition.** Its only extra inputs: the PROMOTED `semantic/spe/semantic_propositions.json` (which StackStorm lacks) and S2 — both gated by the same manual S1→S2 act. Not a cognition-capability difference.

3. **Only two layers are MANUAL, and they are manual for ALL specimens:** S1→S2 promotion (artifact-proven `operator:khorrix`) and LENS-binding registration (hand-authored manifest; no script writes `lib/lens-v2/manifests/`). StackStorm's binding is manual too — "not bound" is not a NetBox-fresh weakness.

4. **NetBox fresh-run does not stop "at cognition."** It auto-produces source, structural graph, dom, and persisted dpsig signals (more persisted signal artifact than StackStorm). It stops for three narrow reasons, none a cognition gap: (a) semantic enrichment not invoked (flag not passed); (b) fail-closed at Phase 8a Vault Construction, which runs before SQO, so it never received the automatic S0→S1 StackStorm got for free; (c) not bound (same manual manifest gate as everyone).

5. **Assessment package is ABSENT for every specimen** — never produced by anything. Platform-wide gap, not NetBox-specific.

## LINEAGE CAVEAT — the "AUTO (runtime)" cells are non-persisted projection products

The consequence / execution-blindness / gravity-divergence / domain-cognition rows marked "AUTO (runtime)" must be read with this boundary: **these findings have no persisted finding-level lineage.** They are computed in memory at bind by `SignalSynthesisEngine.js` → `software-intelligence/ConsequenceCompiler.js` → `DomainCognitionCompiler.js` (the last header: "Pure assembly — does not infer, discover, or synthesize"). None of the three persists output (no `writeFile`). There is zero persisted consequence/blindness/divergence/domain-cognition artifact in any run.

Lineage per finding class:
- **Execution Blindness** — `CognitionContractModel.js:resolveExecutionBlindness`, from `report._synthesisResult.conditions` (runtime, P2+ gated). Not persisted. Not replayable without LENS.
- **Gravity Divergence** — `DomainCognitionCompiler.js`, from `se.boundary_divergence.divergent_modules` (score>5). Centrality root `structure/40.3c/structural_centrality.json` is persisted, but the divergence score/finding is not. Not replayable without LENS.
- **Runtime Consequences** — `ConsequenceCompiler.js`, maps runtime conditions → `CONSEQUENCE_VOCABULARY`. Not persisted. `InvestigationVerifier` "replay" = re-executing the same LENS compiler and diffing counts (recomputation, not persisted replay).
- **Domain Cognition** — `DomainCognitionCompiler.assembleDomainCognition(fullReport)`. Pure assembly. Not persisted.

Persisted SUBSTRATE roots (the inputs): `structure/40.3`,`40.4`, `40.3c` centrality, `dom/dom_layer.json`, `artifacts/dpsig/.../dpsig_signal_set.json`, `75.x/condition_correlation_state.json` + `pressure_zone_state.json`. The findings are recomputed from these on every bind and exist only in the LENS runtime.

**AMOps gap recorded:** this lineage/persistence boundary is NOT in the vault canonical state. It had to be recovered by code archaeology — evidence that the G1 streams that built the cognition compilers did not run §16.4 closure propagation. Canonical state last updated 2026-06-05 (`95c143c`); compilers last touched 2026-06-08; this session's G1 work (Investigation, Answer Objects, Chip State Machine, Cognitive Anchor, Temporal Cognition) committed without propagation.

## Net

The automatic cognition engine is real and specimen-agnostic. The fresh-run shortfall is narrow and specific (one fail-closed vault phase pre-empting automatic S1 + an un-passed semantic flag). The genuinely manual layers — S2 promotion and LENS binding — are manual by design across all specimens.
