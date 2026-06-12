# Factory → Cognition → Delivery — Forensic Audit

**Artifact:** PI.FACTORY-COGNITION-DELIVERY-CLOSURE.01 / NETBOX_FRESH_RUN_FORENSIC_AUDIT
**Status:** AUDIT — artifact evidence only, no inference, no new doctrine
**Date:** 2026-06-12
**Run audited:** `clients/netbox/psee/runs/run_netbox_factory_cert_05` (latest, deepest NetBox certification run)
**Question:** Can a fresh source snapshot become a qualified observation and client deliverable?

---

## PRIORITY 1 — NetBox Fresh Run Forensics (cert_05)

| # | Question | Answer | Artifact evidence |
|---|---|---|---|
| 1 | Highest persisted object produced? | **`binding_envelope`** | `binding/binding_envelope.json` — `artifact_id: binding_envelope_netbox_orchestrated`, 30 nodes / 17 edges / 10 capability surfaces |
| 2 | Artifacts after structural substrate? | **YES** | `dom/dom_layer.json`; `ceu/grounding_state_v3.json`; `41.x/{signal_projection,pressure_zone_projection,projection_manifest}.json`; `75.x/{condition_correlation_state,pressure_candidate_state,pressure_zone_state}.json`; `binding/binding_envelope.json`; `artifacts/dpsig/netbox/run_netbox_factory_cert_05/dpsig_signal_set.json` |
| 3 | Semantic cognition exists? | **NO** | No `semantic/` dir. Chronicle checkpoints `checkpoint_07_semantic_derivation` and `checkpoint_08_semantic_proposition` are `status: FROZEN` with empty `state_snapshot {}` — skeleton markers, not produced artifacts |
| 4 | Domain cognition exists? | **YES** | `dom/dom_layer.json` (`domain_count`, `dom_groups`, `total_nodes`) |
| 5 | Signal cognition exists? | **YES (persisted)** | `41.x/signal_projection.json` + `75.x/condition_correlation_state.json` + `artifacts/dpsig/netbox/run_netbox_factory_cert_05/dpsig_signal_set.json` |
| 6 | Proposition / governance lineage exists? | **NO** | No `semantic/spe/proposition_review_queue.json`; no `governance/` dir |
| 7 | Vault lineage exists? | **NO** | `vault/` present but **0 files** (no `signal_registry.json`, no `evidence_trace.json`, no `vault_readiness.json`) |
| 8 | Qualification exists? | **NO** | No `sqo/` dir; no `promotion_state.json` |
| 9 | Observation exists? | **NO** | No `convergence/convergence_observations.json` |
| 10 | Client-consumable package exists? | **NO** | No assessment/deliverable artifact in the run (none found anywhere across specimens) |

**Note (evidence):** `75.x/condition_correlation_state.json` contains correlation *statistics* (`entities_with_active_conditions`, `activation_count_distribution`, `max_activation_count_*`) — not persisted condition objects with lineage.

---

## PRIORITY 2 — Specimen Comparison Matrix

Marks: AUTO (produced without operator authorship) · MANUAL (artifact proves operator authorship) · ABSENT · UNKNOWN. StackStorm is treated as a first-class control.

| Layer | BlueEdge `genesis_e2e_03` | StackStorm `st2_20260520` (control) | NetBox Historical `…20260520_134600` | NetBox Fresh `cert_05` |
|---|---|---|---|---|
| Source Materialization | AUTO `intake/canonical_repo` | AUTO `intake/canonical_repo` | AUTO `intake/canonical_repo` | AUTO `intake/canonical_repo` |
| Structural Extraction | AUTO `structure/40.2/structural_node_inventory.json` | AUTO `structure/40.2` | AUTO `structure/40.2` | AUTO `structure/40.2` |
| Structural Cognition | AUTO `structure/40.4/canonical_topology.json` + `40.3c/structural_centrality.json` | AUTO `40.4` + `40.3c` | AUTO `40.4` + `40.3c` | AUTO `40.4` + `40.3c` |
| Semantic Cognition | AUTO `semantic/spe/spe_derivation_report.json` **+ PROMOTED** `semantic_propositions.json` | AUTO `spe_derivation_report.json` (not promoted) | AUTO `spe_derivation_report.json` (not promoted) | **ABSENT** (no `semantic/`; Phase 3b not invoked) |
| Domain Cognition | AUTO `dom/dom_layer.json` | AUTO `dom/dom_layer.json` | **ABSENT** (no `dom/`) | AUTO `dom/dom_layer.json` |
| Signal Cognition | AUTO `41.x/signal_projection.json` + `dpsig_signal_set.json` | AUTO (runtime, `SignalSynthesisEngine.js`; no persisted 41.x/dpsig) | AUTO (runtime; no persisted) | AUTO `41.x/signal_projection.json` + `dpsig_signal_set.json` |
| Runtime Cognition | AUTO (persisted) `75.x/condition_correlation_state.json` | AUTO (runtime only, not persisted) | AUTO (runtime only, not persisted) | AUTO (persisted) `75.x/condition_correlation_state.json` |
| Proposition / Governance Layer | AUTO `semantic/spe/proposition_review_queue.json` + `governance/` | AUTO `proposition_review_queue.json` + `governance/` | AUTO `proposition_review_queue.json` + `governance/` | **ABSENT** |
| Qualification (SQO) | AUTO→S1 + **MANUAL→S2** (`operator:khorrix`, `sqo/promotion_event_log.jsonl`) | **AUTO→S1 only** (`system:governance_projection`, `promotion_eligible:false`) | AUTO→S1 + **MANUAL→S2** | **ABSENT** (no `sqo/`) |
| Observation | AUTO `convergence/convergence_observations.json` | ABSENT | ABSENT | ABSENT |
| Vault Lineage | AUTO `vault/signal_registry.json` + `vault/evidence_trace.json` | ABSENT | ABSENT | **ABSENT** (`vault/` empty) |
| LENS Binding | **MANUAL** `…/manifests/blueedge.run_blueedge_genesis_e2e_03.json` (hand-authored; no script writes registry) | **MANUAL** `…/manifests/stackstorm.run_github_st2_20260520_131000.json` | **MANUAL** `…/manifests/netbox.run_github_netbox_20260520_134600.json` | **ABSENT** (no manifest) |
| Assessment Package | ABSENT | ABSENT | ABSENT | ABSENT |

**Two distinct pipeline lineages (evidence, not theory):** StackStorm/NetBox-Historical ran the **semantic → spine → SQO → governance** route but produced **no** `41.x`/`75.x`/`dpsig` persisted signal projection. NetBox-Fresh (the `run_client_pipeline.py` orchestrator) ran the **dom → signal (41.x/75.x/dpsig) → binding_envelope** route but produced **no** semantic/SQO/vault chain. They are different code paths producing different cognition layers. Only BlueEdge `genesis_e2e_03` produced *both* plus observation + vault lineage.

---

## PRIORITY 3 — Vault Lineage Audit (findings)

Classification: RUNTIME ONLY · PERSISTED · QUALIFIED · PROJECTED.

| Finding | Lineage artifact | Supporting signals | Supporting evidence | Supporting topology/domain | Vault persistence | Classification |
|---|---|---|---|---|---|---|
| **Execution Blindness** | none — computed in `CognitionContractModel.js:resolveExecutionBlindness` | `report._synthesisResult.conditions` (runtime, P2+ gated) | runtime conditions | `dom_layer.json`, `75.x` | none persisted | **RUNTIME ONLY** |
| **Gravity Divergence** | none — `DomainCognitionCompiler.js` (score>5 → "boundary drift") | `se.boundary_divergence.divergent_modules` (runtime) | `40.3c/structural_centrality.json` (root present; score NOT in it) | `40.4`, `40.3c` | none persisted | **RUNTIME ONLY** (substrate root persisted; finding not) |
| **Runtime Consequences** | none — `software-intelligence/ConsequenceCompiler.js` | runtime conditions | runtime | `dom_layer.json`, `75.x` | none persisted | **RUNTIME ONLY** |
| **Domain Cognition** | none — `DomainCognitionCompiler.assembleDomainCognition(fullReport)` ("pure assembly") | runtime | runtime | `dom_layer.json` | none persisted | **RUNTIME ONLY** |

**Confirmation:** `find … -iname "*consequence*"/"*blind*"/"*gravity*"/"*divergence*"/"*domain_cognition*"` across all runs → **zero** persisted finding artifacts. None of the three compilers (`DomainCognitionCompiler`, `SignalSynthesisEngine`, `ConsequenceCompiler`) contains `writeFileSync`/`fs.write`. All four finding classes live **only in the LENS runtime**; none is PERSISTED, QUALIFIED, or PROJECTED into a durable artifact. (Already propagated to canonical state §Finding Persistence Boundary, 2026-06-12.)

---

## PRIORITY 4 — Factory → Cognition → Delivery Map (NetBox Fresh)

```
FACTORY (complete, AUTO)
  source materialization  → structural extraction → structural cognition (40.4 + 40.3c)
  → domain cognition (dom_layer) → signal cognition (41.x / 75.x / dpsig)
  → CEU grounding → BINDING ENVELOPE   ◄── highest persisted object; orchestrator terminates here
        │
        ▼
  ╳ FIRST MISSING TRANSITION:  Substrate → Semantic Cognition
        │   (Phase 3b Semantic Derivation NOT invoked; checkpoints are empty FROZEN markers; no semantic/ dir)
        ▼
COGNITION (governed chain — NONE of this runs in the fresh orchestrator)
  semantic cognition → proposition/governance layer → SQO qualification
        │
        ▼
  observation (convergence) → vault lineage (signal_registry / evidence_trace)
        │
        ▼
DELIVERY
  LENS binding (MANUAL manifest — never pipeline-generated) → assessment package (never produced by anything)
```

**First missing transition: Signal/Binding Substrate → Semantic Cognition.** The fresh orchestrator (`run_client_pipeline.py`) produces structural + signal substrate and terminates at `binding_envelope`. It does **not** invoke Phase 3b semantic derivation, so the `semantic/` layer is never written. Everything downstream is consequently blocked: no proposition layer → SQO has nothing to qualify → no qualification → no observation → no vault lineage → no LENS binding → no assessment package.

**Therefore the answer to the gate question, by evidence:** **NO.** A fresh source snapshot today reaches the FACTORY tier (binding_envelope) and stops at the Substrate→Semantic transition. It does not become a qualified observation, and no deliverable exists.

**Secondary structural finding (for the closure stream, not acted on here):** the fresh orchestrator and the governed pipeline (which BlueEdge/StackStorm/NetBox-Historical ran) are **different code paths**. The fresh orchestrator does not contain the semantic→SQO→vault→observation chain at all. Closing the gate is therefore not "fix one phase" — it is reconciling the fresh orchestrator with the governed cognition chain, starting at the Substrate→Semantic transition. Even past that, SQO S2 and LENS binding are MANUAL for *every* specimen (artifact-proven), so full delivery has manual gates regardless.

---

## Evidence summary (no conclusions beyond evidence)

- Fresh run highest persisted object = `binding_envelope`. FACTORY tier reached.
- COGNITION (semantic/proposition/SQO), OBSERVATION, VAULT LINEAGE, LENS BINDING, ASSESSMENT PACKAGE = all ABSENT for the fresh run.
- Findings (blindness/divergence/consequence/domain) = RUNTIME ONLY for all specimens.
- First missing transition = Substrate → Semantic Cognition (Phase 3b not invoked).
- Gate question answer = NO (fresh run does not become a qualified observation or deliverable).
