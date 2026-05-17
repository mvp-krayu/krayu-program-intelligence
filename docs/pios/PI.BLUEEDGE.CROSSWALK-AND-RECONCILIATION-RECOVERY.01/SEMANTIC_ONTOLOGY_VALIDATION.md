# Semantic Ontology Validation

> **Hypothesis A vs Hypothesis B — traced through real artifacts.**

---

## 1. Hypotheses

**HYPOTHESIS A:** Semantic domains were projected first from upstream evidence, then reconciled against structure.

**HYPOTHESIS B:** Semantic domains emerged directly from CEU structural grouping.

---

## 2. Evidence Trace

### Evidence for Hypothesis A

| # | Evidence | Source | Finding |
|---|---|---|---|
| 1 | `build_semantic_layer.py` embeds 17 DOMAIN definitions as static data, with grounding status per domain, derived from `component_model.md`, `relationship_map.md`, `execution_paths.md`, `intent_inference_map.md` | `scripts/pios/41.1/build_semantic_layer.py` lines 39-57 | Domains are defined from upstream evidence artifacts, NOT from structural topology |
| 2 | `semantic_domain_model.md` states: "Domain names derived from evidence in component_model.md and intent_inference_map.md" | `docs/pios/41.1/semantic_domain_model.md` line 16 | Domain names come from evidence interpretation, not structural grouping |
| 3 | `semantic_construction_sequence.md` states: "Developer-authored session comment labels in app.module.ts served as the primary categorical grouping signal" | `docs/psee/BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01/semantic_construction_sequence.md` line 129 | Primary grouping signal is human-authored categorical labels, not file paths |
| 4 | `semantic_method_reconstruction.md` states: the method was "knowledge-guided declarative synthesis that used source code structure as the primary evidence substrate and developer-authored source code labels as the primary categorical signal" | `docs/psee/BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01/semantic_method_reconstruction.md` lines 25-28 | Source code labels (session comments) drive grouping, not structural file paths |
| 5 | 17 semantic domains include DOMAIN-02 "Telemetry Transport" (MQTT, Kafka, Flink) which has ZERO structural presence in the evidence boundary | `semantic_topology_model.json`, `reconciliation_correspondence.v1.json` | A domain exists that has no structural evidence at all — it was projected from architecture HTML |
| 6 | 41.1 grounding status labels 15 of 17 domains as "GROUNDED" — but the reconciliation later finds only 4 have structural crosswalk correspondence | `build_semantic_layer.py` vs `reconciliation_correspondence.v1.json` | The 41.1 grounding is evidence-existence grounding, not structural-topology grounding |
| 7 | The crosswalk was created AFTER both the semantic topology and structural topology existed, as a BRIDGE between them | `semantic_continuity_crosswalk.json` → `contract_id: PI.CLIENT-LANGUAGE-LAYER.DOM-REDERIVATION-WITH-LINEAGE.01` | Crosswalk is a post-hoc bridge, not a generative mechanism |
| 8 | ReconciliationCorrespondenceCompiler reads BOTH semantic topology and structural topology as inputs — neither generates the other | `ReconciliationCorrespondenceCompiler.js` lines 1-18 | Reconciliation explicitly consumes two independent inputs |
| 9 | SemanticActorHydrator determines backed/semantic-only from `lineage_status` on the semantic topology model, which was populated by the crosswalk mapping | `SemanticActorHydrator.js` lines 142-147 | The grounding determination happens AFTER semantic domains exist |
| 10 | Stage 1 (BlueEdge workspace) produced 16 capability domains from architecture-layer analysis BEFORE any CEU or structural scan existed | `grouping_decision_inventory.md` Decision A-5 | Semantic domain precursors pre-date structural analysis |

### Evidence Against Hypothesis B

| # | Evidence | Why it falsifies B |
|---|---|---|
| 1 | 17 semantic domains ≠ 13 structural DOMs | If domains emerged from CEU grouping, there would be 13 domains, not 17 |
| 2 | DOMAIN-02, DOMAIN-03, DOMAIN-04, DOMAIN-05, DOMAIN-06, DOMAIN-07, DOMAIN-08, DOMAIN-09, DOMAIN-12, DOMAIN-13, DOMAIN-15, DOMAIN-17 have ZERO structural DOM correspondence | 12 domains have no structural equivalent at all — CEU grouping could not have produced them |
| 3 | DOM-09 backend_modules (6 CEU nodes) maps to 6+ semantic domains | If domains came from structure, backend_modules would be ONE domain, not 6+ |
| 4 | The 41.1 ratio is 89 COMP → 42 CAP → 17 DOMAIN | The derivation chain goes component → capability → domain, not structural path → domain |
| 5 | Domain names are functional business terms ("Fleet Core Operations", "AI/ML Intelligence Layer", "SaaS Platform Layer") not path-derived terms ("backend_modules", "backend_common", "svg_agents") | CEU structural grouping produces path-derived names; semantic domains use business vocabulary |
| 6 | DOMAIN-01 "Edge Data Acquisition" includes 7 component anchors (COMP-72 through COMP-78) but DOM-13 svg_agents has only 2 structural nodes | The semantic domain is richer than its structural counterpart — structure did not generate the semantic concept |

---

## 3. Verdict

**HYPOTHESIS A: VALIDATED.**

Semantic domains were projected first from upstream evidence (architecture HTML, source code session comments, component model, intent inference map) through the 41.1 semantic construction process. They were then independently reconciled against structural DOM groups via the crosswalk bridge and the ReconciliationCorrespondenceCompiler.

**HYPOTHESIS B: FALSIFIED.**

Semantic domains did NOT emerge from CEU structural grouping. The evidence is unambiguous:
- Different cardinality (17 vs 13)
- Different derivation chain (COMP→CAP→DOMAIN vs CEU→path-prefix→DOM)
- Different vocabulary (business terms vs path-derived terms)
- 12 domains with zero structural correspondence
- DOM-09 maps to 6+ semantic domains (structural grouping is coarser, not the source)

---

## 4. Architectural Consequence

The historical operational ontology is NOT:

```
structure → semantic topology
```

The historical operational ontology IS:

```
upstream evidence ──→ semantic topology (17 DOMAIN, PATH B, 41.1)
upstream evidence ──→ structural topology (13 DOM, PATH A, 40.x + CEU)
                              │                        │
                              └────── crosswalk ───────┘
                                         │
                              reconciliation correspondence
                                         │
                              grounding qualification (Q-class)
                                         │
                              executive projection (LENS)
```

PATH A and PATH B are **independent derivation paths from the same upstream evidence.** They produce different outputs at different granularities using different methods. The crosswalk bridges them. The reconciliation assesses their correspondence. Q-class quantifies the grounding ratio. LENS projects the unified result.

---

## 5. What This Means for A.5

The A.5 investigation's prior assumption — that semantic topology could be reconstructed by structural subdivision (A.5a → A.5b) — is now shown to be incomplete:

- **A.5a** (48 domains from raw path-prefix subdivision) is a PATH A operation. It will never produce the 17 semantic domains because the 17 domains were never derived from path prefixes.
- **A.5b** (35 CEU nodes → 13 DOMs) reconstructs the structural side of the crosswalk. It does NOT reconstruct the semantic side.
- The 17 semantic domains require their own derivation path (41.1) which reads upstream evidence artifacts and uses human-authored categorical signals.

The complete operational chain requires BOTH:
1. Structural topology (PATH A: 40.x → CEU → DOM) — A.5 territory
2. Semantic topology (PATH B: 41.1 → COMP → CAP → DOMAIN) — NOT A.5 territory
3. Crosswalk bridge (DOM → DOMAIN mapping with confidence)
4. Reconciliation (correspondence assessment)
5. Qualification (Q-class from grounding ratio)

A.5 can improve the structural side. It cannot replace the semantic side.
