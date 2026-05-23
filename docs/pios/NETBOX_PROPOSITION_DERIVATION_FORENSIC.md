# NetBox Proposition Derivation Forensic

## Which exact scripts produced NetBox's 75/77 propositions?

**Script:** `scripts/pios/semantic_proposition_engine.py` → calls `scripts/pios/spe/derivation_engine.py`

**Execution:** Fully deterministic. The `--enable-semantic-derivation` flag (which enables Claude-assisted INFERRED tier) was NOT passed. All 75 propositions were produced by 6 hard-coded deterministic derivers in `derivation_engine.py:derive_all()`.

**75 vs 77:** The SPE derivation report and lineage both record 75 propositions. The promotion_state.json S2 justification references "77 propositions" and the corpus_snapshot shows AUTHORITY_TOPOLOGY at 12 (not 10). This is a documentation inconsistency — the actual SPE output was 75.

**No manual creation.** No propositions were created by Claude or operator. Governance streams performed review (accept/contest/arbitrate/reject) on existing propositions — they did not create new ones.

---

## What input artifacts did they consume?

8 required artifacts loaded by `scripts/pios/spe/input_loader.py`:

| Artifact | Path | Purpose |
|----------|------|---------|
| reconciliation_state.json | `ceu/` | Confirmed CEU list (gate check: must be COMPLETE) |
| evidence_anchors.json | `ceu/` | Evidence anchor definitions per CEU |
| candidate_registry.json | `ceu/` | Candidate list with `structural_metrics` |
| derivation_lineage.json | `ceu/` | Prior CEU derivation lineage |
| structural_centrality.json | `structure/40.3c/` | Centrality ranking per node |
| code_graph.json | `structure/40.3s/` | Import relationships (3,614 edges) |
| canonical_topology.json | `structure/40.4/` | Topology clusters with node classification |
| spine_objects.json | `spine/` | Hero moments (6), evidence objects |

Optional: `governance/learning_events.jsonl` (5 active learning events, AWARENESS_ONLY influence).

**All inputs are PATH A structural artifacts.** No CSR, no SDC, no HTML evidence, no domain/capability/component model.

---

## What proposition classes were produced?

| Class | Count | Deriver | Structural Input | Threshold |
|-------|-------|---------|-----------------|-----------|
| STRUCTURAL_DOMINANCE | 12 | `derive_structural_dominance()` | Centrality ranking per CEU domain | Top node in-degree ≥ 1.5× active-node median |
| COUPLING_PATTERN | 34 | `derive_coupling_patterns()` | Code graph cross-domain import matrix | ≥ 20 total edges per domain pair |
| AUTHORITY_TOPOLOGY | 10 | `derive_authority_topology()` | candidate_registry `structural_metrics` | One authority axis (imports vs inherits) ≥ 1.5× the other |
| TIER_GROUNDING | 12 | `derive_tier_grounding()` | Confirmed CEUs + reconciliation state | 1 per confirmed CEU (always emitted) |
| HERO_MOMENT_GROUNDING | 6 | `derive_hero_moment_grounding()` | spine hero_moments | 1 per hero moment (always emitted) |
| CLUSTER_ARCHITECTURE | 1 | `derive_cluster_architecture()` | canonical_topology clusters | ≥ 3 classified nodes per cluster |

Confidence range: 0.595 – 0.972 (mean 0.872). Tier: 57 DIRECT_EVIDENCE, 18 DERIVED.

---

## Were domains/capabilities/components involved?

**No.** The derivation engine operates exclusively on:
- Confirmed CEUs (structural partitions, not semantic domains)
- Code graph metrics (import_in_degree, inherits_in_degree, cross-domain counts)
- Centrality ranking (structural_role, centrality_rank)
- Topology clusters (node classification, cluster membership)
- Hero moments (surprise_class)

The CSR semantic registry, SDC compiler output, domain/capability/component model — none of these are imported, referenced, or consumed by `derivation_engine.py`.

**NetBox propositions are structural claims, not semantic claims.** "STRUCTURAL_DOMINANCE" means a node has high in-degree relative to its domain. "COUPLING_PATTERN" means import density between domain pairs. These are code-graph-derived, not domain-model-derived.

---

## Was Claude/manual assistance involved?

**No.** All 75 propositions are deterministic. The INFERRED tier (which uses Claude for semantic derivation) exists in the codebase (`scripts/pios/spe/inferred_proposer.py`) but was not invoked — the `--enable-semantic-derivation` flag was not passed.

Governance streams modified proposition **status** (CANDIDATE → ACCEPTED/REJECTED/CONTESTED/ARBITRATED) but did not modify proposition **content** or create new propositions.

---

## Was there an existing generic SPE materializer?

**The SPE is generic in contract but PATH A in implementation.**

`semantic_proposition_engine.py` is parameterized by `--client` and `--run`. But its 6 derivers in `derivation_engine.py` are structurally bound to PATH A artifacts:
- Code graph relationships (imports, inheritance)
- Centrality ranking (in-degree, structural_role)
- Topology clusters (node classification)
- Hero moments (surprise_class)

**These inputs don't exist for PATH B specimens.** BlueEdge has no code graph authority edges (only structural imports from tar extraction). Its semantic richness comes from HTML evidence documents, not code structure.

The SPE is generic in the sense that it runs on any specimen with PATH A artifacts. It is not generic across PATH A and PATH B.

---

## Can BlueEdge SDC/CSR enter the same path?

**No, and it should not.**

PATH A (NetBox) derives propositions from **code graph structure**: which files import which other files, how tightly coupled are domains, where does authority concentrate. This requires a live codebase with rich structural relationships.

PATH B (BlueEdge) derives propositions from **document evidence structure**: which domains are described in architectural documents, what capabilities are documented, what components are explicitly named. This requires HTML evidence with extractable semantic content.

These are fundamentally different evidence channels. The proposition classes are different because the evidence is different:

| PATH A Classes | PATH B Classes |
|---------------|---------------|
| STRUCTURAL_DOMINANCE (code graph in-degree) | DOMAIN_EVIDENCE_GROUNDING (HTML evidence grounding) |
| COUPLING_PATTERN (cross-domain imports) | CAPABILITY_EVIDENCE (SDC-extracted capabilities) |
| AUTHORITY_TOPOLOGY (import vs inherit axes) | VAULT_CLAIM_STRUCTURAL (governed vault claims) |
| TIER_GROUNDING (CEU structural tier) | CROSS_DOMAIN_EVIDENCE (topology edges + ambiguities) |
| HERO_MOMENT_GROUNDING (structural surprises) | — |
| CLUSTER_ARCHITECTURE (topology clusters) | — |

Forcing BlueEdge through PATH A derivers would produce 2 TIER_GROUNDING propositions (which is exactly what happened in run_03). The other 5 derivers require rich code graph data that BlueEdge's tar-extracted structure doesn't provide.

---

## Is proposition_bridge.py genuinely missing infrastructure, or a BlueEdge-specific workaround?

**It exists and it is the legitimate PATH B equivalent of the PATH A derivation engine.**

`scripts/pios/sdc/proposition_bridge.py` has 4 derivers:

| Deriver | Input | Output Class | Expected Count |
|---------|-------|-------------|----------------|
| `derive_domain_propositions()` | canonical_csr × candidate_csr × derivation_report | DOMAIN_EVIDENCE_GROUNDING | 17 (one per CSR domain) |
| `derive_capability_propositions()` | candidate_csr capabilities | CAPABILITY_EVIDENCE | 24 (one per SDC capability) |
| `derive_vault_claim_propositions()` | vault claims (CLM-* .md files) | VAULT_CLAIM_STRUCTURAL | ~10-15 (FULL traceability + LENS admissible) |
| `derive_cross_domain_propositions()` | topology_model edges + review_queue | CROSS_DOMAIN_EVIDENCE | 12 edges + 8 ambiguities = ~20 |

**Expected total: ~60-75 propositions.** This is dimensionally comparable to NetBox's 75.

**However, the bridge has two problems:**

1. **Hardcoded paths.** `main()` has hardcoded paths to `run_blueedge_sdc_validation_01`, `run_blueedge_productized_01_fixed`, and `clients/blueedge/chronicle/`. It cannot be parameterized for arbitrary runs.

2. **Hardcoded to chronicle context.** Contract reference is `PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-02`. Output path is `clients/blueedge/chronicle/propositions/`. It was built for the chronicle replay, not the pipeline.

**Decision:** The bridge is not a workaround. It IS the PATH B derivation materializer. It needs to be **generalized** (parameterized `--client`, `--run-id`, output to pipeline paths) — not rewritten.

---

## Constitutional Replay Anchor Implications

The current anchor compares BlueEdge against NetBox's PATH A class taxonomy. This is structurally incorrect.

**The anchor should recognize derivation path:**
- PATH A specimens: compare against NetBox PATH A dimensions
- PATH B specimens: compare against expected PATH B dimensions (or compute expected yield from available SDC/CSR artifacts)

The anchor's `class_diversity` check currently fails because BlueEdge has 1 class (TIER_GROUNDING) vs NetBox's 6 (all PATH A classes). But the correct comparison is: does BlueEdge have adequate PATH B class diversity (DOMAIN_EVIDENCE_GROUNDING + CAPABILITY_EVIDENCE + VAULT_CLAIM_STRUCTURAL + CROSS_DOMAIN_EVIDENCE)?

**The anchor is still correct in blocking run_03** — 2 propositions is thin by any standard. But its reference calibration needs path-awareness.

---

## Summary: What Exists, What's Missing, What's Next

| Component | Status |
|-----------|--------|
| PATH A derivation engine (NetBox) | OPERATIONAL — 6 deterministic derivers, 75 propositions |
| PATH B proposition bridge (BlueEdge) | EXISTS but hardcoded — 4 derivers, ~60-75 expected |
| SDC candidate_csr | OPERATIONAL — 19 domains, 24 capabilities, 207 components |
| SDC derivation_report | OPERATIONAL — per-domain confidence, component distribution |
| SDC review_queue | OPERATIONAL — 8 items (1 COMPONENT_OVERLOAD, 7 AMBIGUOUS_GROUPING) |
| Canonical CSR | OPERATIONAL — 17 domains (client_semantic_registry.json) |
| Vault claims | OPERATIONAL — 28 CLM-* files |
| Topology model | OPERATIONAL — 17 domains, 5 clusters, 12 edges |

**What's missing:**
1. Generalize `proposition_bridge.py` — parameterize `--client`, `--run-id`, output to `semantic/spe/` not `chronicle/propositions/`
2. Update constitutional anchor for PATH B class taxonomy
3. Route run_03 through generalized bridge
4. Re-exercise Gates 3-5 on rich corpus

**What is NOT missing:**
- The derivation logic
- The input artifacts
- The proposition classes
- The confidence model

The infrastructure exists. It needs to be connected, not invented.
