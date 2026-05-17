# Operational Ontology

> **The complete operational chain. Load this page to understand how the system works WITHOUT rediscovery forensics.**

---

## Scope and Client Binding

This document describes the operational ontology as instantiated for **BlueEdge** — the canonical reference implementation. All specific values (17 domains, 13 DOMs, 4/17 grounding ratio, DOM-09 irresolvability, 945→35→13 compression chain) are BlueEdge operational facts, not substrate-invariant truths.

The operational ontology should not yet be assumed fully substrate-invariant across future clients. Future work MAY evolve toward runtime-instantiated ontology, parameterized operational semantics, or client-specific realization models. This document does NOT attempt that generalization.

**What IS substrate-invariant:** The derivation architecture (dual-path model, crosswalk bridge, reconciliation correspondence, grounding ratio → Q-class, pipeline orchestration, LENS traceback). The architecture is general. The instantiation values are BlueEdge-specific.

---

## 1. Dual-Path Derivation Model

The system derives intelligence through two INDEPENDENT paths from the SAME upstream evidence:

### PATH A — Structural Topology

**What it does:** Reconstructs structural execution topology from archive evidence.

**Derivation chain:**
```
Client archive (HTML/structured evidence)
  → source_intake.py (SHA-256 boundary validation)
  → structural_scanner.py (945 nodes extracted)
  → CEU grounding (ceu_registry.json: 35 nodes matched)
  → path-prefix grouping (dom_layer_generator.py: 13 DOMs)
  → binding_envelope.json (CEU→DOM→nodes/edges)
  → canonical_topology.json
```

**Output:** 13 structural DOMs (DOM-01 through DOM-13) representing grounded structural boundaries.

**Key compression:** 945 → 35 → 13. The 945→35 step is CEU grounding (only nodes matching CEU registry patterns are grounded). The 35→13 step is path-prefix grouping (grounded nodes grouped by directory path into DOMs).

**A.5a raw substrate:** An alternative view: all 945 nodes grouped by path-prefix produce 48 raw structural domains. These are NOT executive domains — they are the complete structural substrate before CEU grounding filters.

### PATH B — Semantic Topology

**What it does:** Constructs semantic domain definitions from upstream evidence classification.

**Derivation chain:**
```
Upstream evidence artifacts
  → 41.1 build_semantic_layer.py (static domain definitions)
  → 89 components (COMP)
  → 42 capabilities (CAP)
  → 17 semantic domains (DOMAIN-01 through DOMAIN-17)
  → semantic_topology_model.json
```

**Output:** 17 semantic DOMAINs representing business-purpose domain classifications.

**Key fact:** The 17 domains are defined as static data in `build_semantic_layer.py`. They are evidence-classified, not structurally derived. PATH B does NOT depend on PATH A.

### Independence

PATH A and PATH B are independent. Neither derives from the other. Both derive from the same upstream client evidence through different construction methods:
- PATH A: file paths → structural grouping → CEU grounding → DOM boundaries
- PATH B: evidence classification → component → capability → domain hierarchy

## 2. Crosswalk Bridge

The crosswalk bridges PATH A and PATH B:

**What:** `semantic_continuity_crosswalk.json` (v2.0) — a translation table mapping structural DOM-XX identifiers to semantic DOMAIN-XX identifiers.

**Runtime:** SemanticCrosswalkMapper.js reads the crosswalk and performs the translation.

**Coverage:**
- 9 of 13 DOMs have direct DOMAIN mappings
- 1 DOM (DOM-09, backend_modules) is IRRESOLVABLE — maps to 6+ semantic domains
- 3 DOMs have no semantic correspondence

**DOM-09 irresolvability:** DOM-09 covers `backend/src/modules/` — a single structural boundary containing 6 CEU nodes that map to 6+ distinct semantic domains. This is permanently irresolvable in a 1:1 crosswalk model. DOM-09 is the root cause of most unreconciled domains.

## 3. Reconciliation Correspondence

Reconciliation assesses HOW WELL the crosswalk bridge holds:

**What:** ReconciliationCorrespondenceCompiler.js — a compiler taking 5 inputs and producing per-domain graduated confidence.

**Inputs:**
1. semantic_continuity_crosswalk.json (bridge table)
2. semantic_topology_model.json (PATH B domains)
3. canonical_topology.json (PATH A topology)
4. signal_registry.json (activation state)
5. reconciliation_correspondence.v1.json (prior state)

**5-Level graduated confidence:**

| Level | Name | Meaning |
|---|---|---|
| 1 | UNMAPPED | No crosswalk entry |
| 2 | MAPPED_UNVERIFIED | Crosswalk entry exists, unverified |
| 3 | OBSERVATIONALLY_CORROBORATED | Evidence suggests correspondence |
| 4 | EVIDENCE_BOUND | Binding envelope confirms |
| 5 | STRUCTURALLY_GROUNDED | Full structural proof |

**Current result (BlueEdge):**
- 4 RECONCILED (Level 4-5)
- 13 UNRECONCILED (Level 1-2)
- Root cause: DOM-09 irresolvability + 3 unmapped DOMs

## 4. Grounding and Q-Class

**Grounding ratio:** Computed by SemanticActorHydrator.js (lines 142-147).

Filters `lineage_status` per domain:
- EXACT or STRONG → **backed** (structural correspondence via crosswalk)
- NONE or WEAK → **semantic-only** (no crosswalk correspondence)

Result: `backed / total` = grounding ratio → Q-class per Q02_GOVERNANCE_AMENDMENT.md.

**BlueEdge:** 4/17 = 0.2353 → Q-02 (Partial Grounding)

**Q-class classification:**
- Q-01: Fully grounded (all domains structurally backed)
- Q-02: Partially grounded (some domains backed, disclosure required)
- Q-03: Semantic only (zero structural backing)
- Q-04: Unavailable (evidence absent)

**Grounding discrepancy:** Two different questions:
- 41.1 evidence-boundary: "Does evidence exist?" → 15/17 GROUNDED
- Reconciliation crosswalk: "Does a structural DOM map here?" → 4/17 RECONCILED

Both are correct. They measure different things.

## 5. Pipeline Orchestration

The canonical execution path is `scripts/pios/run_client_pipeline.py` — a 9-phase orchestrator:

| Phase | What | Scripts | Output |
|---|---|---|---|
| 1 | Source boundary | source_intake.py | SHA-256 validated evidence boundary |
| 2 | Intake | 40.x intake scripts | Structured evidence artifacts |
| 3 | Structural verification | 40.x verification | Verified structural claims |
| 4 | CEU grounding | ceu_registry.json matching | Grounded nodes (35 from 945) |
| 5 | Binding envelope | build_binding_envelope.py | binding_envelope.json (CEU→DOM→nodes/edges) |
| 6-7 | Activation + projection | run_end_to_end.py (75.x + 41.x) | condition_correlation_state, pressure_zone_state, signal_projection, pressure_zone_projection |
| 8a | Vault construction | Build 9 vault artifacts | canonical_topology, signal_registry, etc. |
| 8b | Vault validation | Readiness checks | Vault completeness verified |
| 9 | Selector update | Update projection selectors | LENS projection_runtime.py consumes vault |

**Phase 6-7 detail:** `run_end_to_end.py` invokes:
- 75.x: condition correlation, pressure candidates, pressure zones
- 41.x: signal projection computation (signal_projection.json), pressure zone projection

**Signal computation:** The canonical signal path is: `binding_envelope → 41.x compute_signal_projection → signal_projection.json → signal_registry.json → LENS`

## 6. LENS Traceback

Every LENS executive output traces through 7 layers:

```
Layer 1: LENS executive projection (what is rendered)
Layer 2: Zone derive function (what computes the rendered value)
Layer 3: GenericSemanticPayloadResolver (what loads and normalizes the data)
Layer 4: SemanticActorHydrator (what classifies grounding per domain)
Layer 5: semantic_topology_model + crosswalk + reconciliation (where domain definitions come from)
Layer 6: Binding envelope + canonical topology (structural proof)
Layer 7: Upstream evidence artifacts (what the claim rests on)
```

**Two LENS pathways:**
- **Manifest-driven** (run_blueedge_productized_01_fixed): semantic + reconciliation pipeline. Produces fullReport with all domain data, grounding, reconciliation.
- **Selector-driven** (run_be_orchestrated_fixup_01): structural pipeline. Uses PATH A structural topology directly.

Both converge at LENS via GenericSemanticPayloadResolver.

## 7. SQO and Qualification

**S-state machine:**
- S0: NO_QUALIFICATION
- S1: ONBOARDING_REQUIRED
- S2: QUALIFIED_WITH_DEBT (BlueEdge current — 15 debt items)
- S3: AUTHORITY_READY (not yet implemented)

**Deterministic:** S-state is computed by SQOCockpitStateResolver from data. Not assigned.

**18 qualification engines** assess qualification criteria across structural, semantic, and operational dimensions.

**Reconciliation loop:** Operational lifecycle governing how new evidence enters SQO — intake → enrichment → reconciliation rerun → debt recalculation → qualification reprojection → runtime propagation.

## 8. Signal Families

**CANONICAL_RUNTIME_ACTIVE:**
- 41.x signal projection (signal_projection.json → signal_registry.json → LENS)
- 75.x condition/pressure (condition_correlation, pressure_candidates, pressure_zones)
- DPSIG Class 4 (optional/additive — derive_relational_signals.py)

**IMPLEMENTED_ISOLATED (code exists, NOT invoked by PATH A):**
- ESI (CKR-014): `scripts/pios/40.16/run_esi_derivation.py` — blocked on PES-ESI-01..05
- RAG (CKR-015): `scripts/pios/40.16/run_rag_derivation.py` — blocked on PES, no temporal windows

**SPECIFIED_NOT_IMPLEMENTED:**
- EXSIG (Lane B governance defined, zero code)
- PES-ESI-01..05 (derivation spec exists, zero code)

**FUTURE_DECLARED:**
- FLOWSIG, ORGSIG, RISKSIG, TIMSIG, RUNSIG, OPSIG (lanes declared, zero code)

## 9. Evidence Source Model

**Current allowed source class:** `EXPLICIT_OPERATOR_PROVIDED_UPSTREAM_EVIDENCE`

**Evidence entry:** `source_intake.py` validates SHA-256 boundary integrity. Evidence enters through `evidence_sources.yaml` curation.

**Evidence-first doctrine:** No evidence → no output. All outputs traceable to source evidence. No speculative enrichment.

## 10. LENS Projection Model

**4 personas** (same truth, different depth):

| Persona | Audience | Depth |
|---|---|---|
| BOARDROOM | Board, C-suite | Posture, readiness, risk signal |
| EXECUTIVE_BALANCED | Senior leadership | Balanced across all zones |
| EXECUTIVE_DENSE | Technical leadership | Structural cause, propagation |
| INVESTIGATION_DENSE | Technical analysts | Full evidence depth, lineage |

**3 authority tiers:**
1. DETERMINISTIC — pure rendering, no selection
2. INVESTIGATIVE — topology-derived guided traversal
3. INTERPRETIVE — bounded synthesis under 75.x authorization

**10 zone components** render structural intelligence. 36 deterministic derive functions (GUIDED_QUERY_ANSWERS) power the guided interrogation lattice.

**PI Runtime Layer:** Transversal governed interrogation across all 4 cognitive modes. Second axis (Interaction Authority) orthogonal to Cognitive Runtime. Structural depth escalation, not AI activation.

## 11. Governance Model

| Document | Role |
|---|---|
| CLAUDE.md | Execution constitution |
| git_structure_contract.md | Branch/domain authority (LOCKED) |
| reference_boundary_contract.md | Cross-layer boundary rules (LOCKED) |
| Q02_GOVERNANCE_AMENDMENT.md | Q-class qualification rules (LOCKED) |
| This vault | Architecture operating memory |

**Stream classification:** G1 (architecture-mutating), G2 (architecture-consuming), G3 (architecture-unrelated).

**13 absolute prohibitions** (not overridable): no team behavior inference, no organizational intent, no human motive, no cultural diagnosis, no leadership quality, no management effectiveness, no personnel attribution, no behavioral prediction, no organizational sentiment, no causal attribution to humans, no remediation prioritization, no "you should" language, no ranked next actions.

## 12. Anti-Rediscovery Reference

**What has been rediscovered and should NOT be rediscovered again:**

| Knowledge | Canonical location | Recovery stream |
|---|---|---|
| Dual-path ontology (PATH A/PATH B independence) | This document §1-2 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| Crosswalk structure (v2.0, 9/1/3 mapping) | CROSSWALK_AND_RECONCILIATION.md, this document §2 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| Reconciliation compiler (5-input, 5-level) | CROSSWALK_AND_RECONCILIATION.md, this document §3 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| DOM-09 irresolvability | CROSSWALK_AND_RECONCILIATION.md, this document §2 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| Grounding ratio computation (4/17) | CROSSWALK_AND_RECONCILIATION.md, this document §4 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| Grounding discrepancy (15/17 vs 4/17) | This document §4 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| LENS traceback (7 layers) | This document §6 | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| 945→35→13 compression chain | PATH_A5_PARTICIPATION_ARCHITECTURE.md | PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01 |
| A5a raw substrate (48 domains) | PATH_A5_PARTICIPATION_ARCHITECTURE.md | PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01 |
| CEU registry drift | PATH_A5_PARTICIPATION_ARCHITECTURE.md | PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01 |
| Pipeline orchestration (9 phases) | This document §5 | PI.CANONICALIZATION.END-TO-END-LOCK.01 |

**Rule:** Before investigating any of the above, load the canonical location. If the canonical location is insufficient, fix the canonical location — do not produce a parallel recovery document.

## Cross-References

- [[PIOS_CURRENT_CANONICAL_STATE]] — current system state
- [[../03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION]] — crosswalk and reconciliation detail
- [[../03_PATH_SPLIT_EVOLUTION/PATH_A_EMERGENCE]] — PATH A structural grounding
- [[../03_PATH_SPLIT_EVOLUTION/PATH_A5_PARTICIPATION_ARCHITECTURE]] — A.5 compression chain
- [[../03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE]] — PATH B semantic reconstruction
- [[../04_SQO_AND_QUALIFICATION/SQO_EVOLUTION]] — SQO state machine
- [[../04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION]] — hydration and Q-class

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.VAULT.OPERATIONAL-ONTOLOGY-CANONICALIZATION.01 |
| Creation commit | PENDING (this stream) |
| Derived from | PI.CANONICALIZATION.END-TO-END-LOCK.01 (MASTER_OPERATIONAL_DOCUMENT_ASSESSMENT.md — recommended this document), PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 (ontology recovery), PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01 (compression chain recovery) |
| Authoritative runtime artifacts | run_client_pipeline.py, ReconciliationCorrespondenceCompiler.js, SemanticCrosswalkMapper.js, SemanticActorHydrator.js, build_semantic_layer.py, structural_scanner.py, dom_layer_generator.py |
| Last verified | 2026-05-17 |
