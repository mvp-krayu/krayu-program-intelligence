# SQO Workflow Reality Check

## Context

BlueEdge `run_blueedge_genesis_e2e_03` traversed Gates 1–4 of the PATH B governance lifecycle. Gate 5 was HELD because the traversal proved minimal structural governance gates — NOT NetBox-grade SQO semantic qualification.

This document answers the 10 reality check questions and identifies what is missing before legitimate SQO advancement.

---

## The NetBox Reference: What S2 Actually Required

**NetBox run_github_netbox_20260520_134600** achieved S2 through:

| Dimension | NetBox S2 Evidence |
|-----------|-------------------|
| CEU candidates | 13 (across 3 tiers: OPERATIONAL_DOMAIN, CONSUMER, FOUNDATION) |
| Propositions | 77 (across 6 classes) |
| Proposition classes | COUPLING_PATTERN (34), STRUCTURAL_DOMINANCE (12), TIER_GROUNDING (12), AUTHORITY_TOPOLOGY (10), HERO_MOMENT_GROUNDING (6), CLUSTER_ARCHITECTURE (1) |
| Confidence range | 0.595 – 0.972, mean 0.897 |
| Tier distribution | 57 DIRECT_EVIDENCE, 18 DERIVED |
| Review obligations | 6 class-level reviews |
| Governance friction | 1 class REJECTED (CLUSTER_ARCHITECTURE), 2 classes CONTESTED then ARBITRATED (AUTHORITY_TOPOLOGY, HERO_MOMENT_GROUNDING) |
| Enrichment streams | 3 (Authority Enrichment, Hero Moment Reconciliation, Replay Revalidation) |
| Revalidation | 48/48 PASS |
| Governance events | 12 |
| Governance streams | 10 |

**S2 justification cited:** "Full governance lifecycle validated: structural onboarding, semantic derivation (77 propositions), operator review (5 accepted, 1 rejected), arbitration (2 contested → resolved), substrate enrichment (3 streams), deterministic revalidation (48/48 PASS). Governance friction strengthened weakest classes."

---

## BlueEdge run_03: What Actually Exists

| Dimension | run_03 State |
|-----------|-------------|
| CEU candidates | 2 (both OPERATIONAL_DOMAIN) |
| Propositions | 2 (both TIER_GROUNDING) |
| Proposition classes | TIER_GROUNDING only |
| Confidence | 0.7 flat (no variance) |
| Tier distribution | 2 DIRECT_EVIDENCE |
| Review obligations | 0 (nothing flagged) |
| Governance friction | None (no rejections, no contestation, no arbitration) |
| Enrichment | None |
| Revalidation | 25/25 PASS (thin check suite) |
| Governance events | 5 (confirm ×2, batch-accept, review-complete, revalidation) |
| Semantic domains | 0 in propositions (17 exist in semantic_topology_model but not in SPE corpus) |
| Capabilities | 0 |
| Components | 0 |
| Semantic debt | Not evaluated |
| Maturity scoring | Not present |

---

## 10 Reality Check Answers

### 1. Where are the 17 BlueEdge domains in run_03?

They exist in `semantic/topology/semantic_topology_model.json` (17 domains, 5 clusters, 12 edges) — produced by Phase 7 CSR topology generation. But SPE derived ZERO domain-level propositions from them. SPE only produced 2 TIER_GROUNDING propositions from the 2 CEU candidates.

The 17 domains are **structural topology claims**, not semantic propositions. They have never been through propose/evaluate/consolidate/confirm. 12 of 17 have zero confidence and NONE lineage status.

### 2. Where are capabilities and components derived?

**Not derived in run_03.** The BlueEdge SDC candidate CSR (`run_blueedge_sdc_validation_01`) contains 24 capabilities and 207 components from HTML evidence parsing. But these were never bridged into run_03's SPE pipeline. The current SPE only derives TIER_GROUNDING propositions from confirmed CEUs — it does not consume the CSR capability/component model.

### 3. Which script/materializer produces the CSR semantic model?

`scripts/pios/generate_semantic_topology.py` produces the semantic_topology_model. The SDC pipeline (`scripts/pios/sdc/`) produces the richer candidate_csr with capabilities and components from HTML evidence. Neither feeds into the current SPE proposition derivation for run_03.

### 4. Did Phase 3b regenerate the semantic DNA from evidence, or only produce thin CEU grounding?

**Thin CEU grounding only.** Phase 7 (`generate_semantic_topology.py`) produced the topology model, and Phase 8 (`semantic_proposition_engine.py`) produced 2 TIER_GROUNDING propositions — one per CEU. The rich semantic DNA (17 domains, 24 capabilities, 207 components) from the SDC candidate CSR was not consumed. The SPE has no pathway to ingest PATH B semantic registry content.

### 5. Where is the propose/evaluate/consolidate/confirm lifecycle?

**Not present.** The current flow is:
- CEU candidate derivation (structural) → operator CONFIRM/REJECT
- SPE proposition derivation (2 thin claims) → operator ACCEPT
- Revalidation → promotion

The NetBox workflow included:
- 6 proposition class reviews
- CONTESTED classes requiring evidence strengthening
- ARBITRATED resolutions
- Substrate enrichment streams between contestation and re-evaluation
- Qualification debt model

None of this exists in run_03.

### 6. Where is semantic maturity scoring?

**Not present.** NetBox had confidence scoring across 6 proposition classes with a distribution from 0.595 to 0.972. run_03 has flat 0.7 confidence on 2 propositions. No maturity model, no confidence evolution, no class-level assessment.

### 7. Where is semantic debt evaluation?

**Not evaluated.** BlueEdge's prior run (`run_blueedge_productized_01_fixed`) had 15 qualification blockers (mostly GROUNDING_GAP_DOMAIN_* — unresolved domain grounding gaps). run_03 has no debt model, no qualification blockers artifact, no review obligations artifact.

### 8. Where is semantic reconciliation beyond 2 structural CEUs?

**Not present.** NetBox reconciled 12 CEUs through 46 governance events across 3 tiers (OPERATIONAL_DOMAIN, CONSUMER, FOUNDATION). run_03 reconciled 2 CEUs in 3 events (confirm, confirm, complete). No tier diversity, no merge decisions, no contested candidates.

### 9. Which historical NetBox artifacts/processes implemented the rich SQO workflow?

| Artifact | Purpose |
|----------|---------|
| `sqo/qualification_blockers.json` | Tracked 7 blockers across lanes (semantic, review, crosswalk, reconciliation, debt, promotion) |
| `sqo/review_obligations.json` | 6 class-level review obligations with accept/contest/arbitrate dispositions |
| `sqo/promotion_state.json` | Full promotion lineage with 10 governance streams, rejected classes, L5 authority |
| `semantic/spe/spe_derivation_report.json` | 75 propositions across 6 classes with confidence distribution |
| SPE derivation engine | Multi-class proposition derivation from 13 CEUs: STRUCTURAL_DOMINANCE, COUPLING_PATTERN, AUTHORITY_TOPOLOGY, TIER_GROUNDING, HERO_MOMENT_GROUNDING, CLUSTER_ARCHITECTURE |
| Proposition debt model | Coverage, confidence, tier, review, and reconciliation debt computation |
| Authority enrichment pipeline | Code graph enrichment → confidence uplift on DERIVED propositions |
| Hero moment reconciliation | Evidence grounding for hero moment claims |
| Replay revalidation cycle | 48-check deterministic revalidation across 9 phases |

### 10. Is the current Gate 1–5 lifecycle equivalent to that workflow?

**No.** The current Gate 1–5 lifecycle is a **structural governance gate flow** — it proves that operator authority is required at reconciliation, review, and promotion boundaries. It does NOT prove semantic qualification.

---

## What run_03 Proves vs. What It Does Not Prove

### PROVEN

- **Operational Genesis corridor:** Raw archive → 19-phase pipeline → all signal families → vault → LENS projection
- **Deterministic PATH A substrate:** Code graph (3,332 relationships), centrality (644 entries), canonical topology (10 clusters)
- **Lawful operator gates:** Non-automatable boundaries enforced at reconciliation, review, and promotion
- **Minimal structural governance traversal:** 5 gates exercised, append-only event logs, operator identity tracked

### NOT PROVEN

- **Rich semantic corpus:** Only 2 TIER_GROUNDING propositions from 2 CEUs. No domain, capability, or component propositions.
- **Semantic DNA regeneration:** The 17 domains, 24 capabilities, 207 components from SDC/CSR evidence are not consumed by SPE.
- **Governance friction:** No rejections, no contestation, no arbitration, no enrichment cycle.
- **Qualification debt model:** No blockers, no obligations, no debt resolution.
- **Multi-class proposition lifecycle:** NetBox had 6 classes with distinct review dispositions. run_03 has 1 class.
- **Substrate strengthening:** No enrichment streams, no confidence uplift, no class threshold improvement.
- **NetBox-grade SQO advancement semantics.**

---

## Gap Inventory: What Is Missing Before S1

| Gap | Nature | Blocking S1? |
|-----|--------|-------------|
| GAP-RC-01: PATH B proposition bridge | SPE cannot derive propositions from BlueEdge's 17 domains, 24 capabilities, 207 components. Needs `proposition_bridge.py` to transform SDC candidate_csr into SPE-format propositions. | YES |
| GAP-RC-02: Multi-class proposition derivation | SPE only produces TIER_GROUNDING. Needs DOMAIN_EVIDENCE_GROUNDING, CAPABILITY_EVIDENCE, VAULT_CLAIM_STRUCTURAL, CROSS_DOMAIN_EVIDENCE classes. | YES |
| GAP-RC-03: Review queue with real flagging | 0 items flagged because only 2 trivial propositions derived. With richer corpus, review queue will have genuine review obligations. | YES (implicit) |
| GAP-RC-04: Governance friction | At least 1 rejection, 1 contestation, or 1 arbitration needed to prove governance friction occurs. Cannot be simulated — must emerge from corpus quality. | YES |
| GAP-RC-05: Qualification debt model | `qualification_blockers.json` and `review_obligations.json` not produced. Debt lifecycle not exercised. | RECOMMENDED |
| GAP-RC-06: Confidence distribution | Flat 0.7 is not a confidence distribution. Needs variance reflecting evidence strength per proposition. | RECOMMENDED |
| GAP-RC-07: Enrichment cycle | No substrate strengthening from evidence re-extraction. PATH B enrichment = HTML document re-parsing for confidence uplift on weak propositions. | FOR S2 |

### Minimum Viable S1 Path

S1 = "Governance lifecycle exercised, semantic corpus validated."

Minimum requirements:
1. **Derive propositions from BlueEdge semantic DNA** — bridge SDC candidate_csr (17 domains, 24 capabilities, 207 components) into SPE-format propositions (~40-60 propositions)
2. **Review queue with real obligations** — flagged propositions requiring operator disposition
3. **At least 1 governance friction event** — a contested or rejected proposition proves the workflow isn't rubber-stamping
4. **Revalidation on enriched corpus** — re-run with meaningful check suite

S2 additionally requires enrichment, cross-specimen convergence, and full qualification debt resolution.

---

## Current Promotion State

```
S-level: S0
Provenance: PIPELINE_GENESIS
Hold reason: Minimal structural governance traversed but semantic qualification
             workflow not exercised — 2 CEUs/2 propositions is not NetBox-grade SQO
Promotion eligible: false
```

Gate 5 remains HELD until semantic corpus gap is resolved.
