# Crosswalk Runtime Analysis

> **How the crosswalk bridge between structural DOM groups and semantic domains actually operates.**

---

## 1. Crosswalk Identity

| Field | Value |
|---|---|
| Primary artifact | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/crosswalk/semantic_continuity_crosswalk.json` |
| Version | 2.0 |
| Source contract | `PI.CLIENT-LANGUAGE-LAYER.DOM-REDERIVATION-WITH-LINEAGE.01` |
| Recovery contract | `PI.CLIENT-LANGUAGE-LAYER.MAPPING-RECOVERY.01` |
| Lineage source | `scripts/pios/41.1/build_semantic_layer.py` — COMP-NN → CAP-NN → DOMAIN-NN derivation chain |
| Supersedes | v1.0 crosswalk (2/13 labels → 9/13 labels) |

---

## 2. What the Crosswalk IS

The crosswalk is a **bridge translation table** that maps structural DOM groups (DOM-01 through DOM-13, produced by PATH A CEU path-prefix grouping) to semantic DOMAIN entities (DOMAIN-01 through DOMAIN-17, produced by PATH B 41.1 semantic construction).

Each crosswalk entity contains:
- `current_entity_id` — the structural DOM group (DOM-XX)
- `technical_label` — the path-derived structural name (e.g., `backend_app_root`)
- `business_label` — the recovered semantic name (e.g., "Platform Infrastructure and Data")
- `semantic_source_id` — the CAP-NN that links this DOM to a DOMAIN-NN
- `historical_entity_ref` — the DOMAIN-NN it maps to
- `lineage_status` — EXACT / STRONG / PARTIAL / WEAK
- `confidence_score` — 0.0 to 1.0
- `comp_evidence` — the COMP → CAP → DOMAIN derivation chain

---

## 3. What the Crosswalk IS NOT

The crosswalk is NOT:
- A reconciliation engine (that is the ReconciliationCorrespondenceCompiler)
- A domain generator (domains exist independently on both sides)
- A structural validator (that is Q-class and grounding)
- A semantic projector (that is LENS)

The vault page `docs/pios/vault/03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION.md` correctly states: "The crosswalk mapper is a display-layer translator. It is NOT a reconciliation engine."

---

## 4. Crosswalk Coverage (v2.0)

| DOM Group | Technical Label | Business Label | DOMAIN Ref | Lineage | Confidence |
|---|---|---|---|---|---|
| DOM-01 | root_configuration | — | — | WEAK | 0.45 |
| DOM-02 | ci_cd_workflows | Operational Engineering | DOMAIN-16 | STRONG | 0.92 |
| DOM-03 | backend_migrations | — | — | WEAK | 0.50 |
| DOM-04 | backend_app_root | Platform Infrastructure and Data | DOMAIN-10 | STRONG | 0.78 |
| DOM-05 | backend_common | — | — | WEAK | 0.45 |
| DOM-06 | backend_config | Platform Infrastructure and Data | DOMAIN-10 | PARTIAL | 0.68 |
| DOM-07 | backend_events | Event-Driven Architecture | DOMAIN-11 | PARTIAL | 0.65 |
| DOM-08 | backend_health | Operational Engineering | DOMAIN-16 | STRONG | 0.88 |
| DOM-09 | backend_modules | — | — | IRRESOLVABLE | — |
| DOM-10 | frontend | Frontend Application | DOMAIN-14 | EXACT | 0.92 |
| DOM-11 | load_tests | Operational Engineering | DOMAIN-16 | STRONG | 0.93 |
| DOM-12 | monitoring | Operational Engineering | DOMAIN-16 | STRONG | 0.85 |
| DOM-13 | svg_agents | Edge Data Acquisition | DOMAIN-01 | STRONG | 0.95 |

**Coverage: 9 of 13 DOMs have business labels. 4 are WEAK/unresolvable.**

**DOM-09 (backend_modules) is IRRESOLVABLE:** This single structural DOM (6 curated CEU nodes covering auth, aftersales, agentic-ai controllers) maps to at least 3 semantic domains (DOMAIN-03 Fleet Core Operations, DOMAIN-04 Fleet Vertical Extensions, DOMAIN-06 AI/ML Intelligence Layer). A 3-domain merge is permanently irresolvable in a 1:1 crosswalk model.

---

## 5. Crosswalk Consumers

| Consumer | File | Consumption Mode |
|---|---|---|
| GenericSemanticPayloadResolver | `app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js` | Loads crosswalk from manifest, builds crosswalk index, resolves display labels |
| SemanticActorHydrator | `app/execlens-demo/lib/lens-v2/SemanticActorHydrator.js` | Uses crosswalk to determine `backedDomains` (EXACT/STRONG lineage) vs `semanticOnlyDomains` (NONE/WEAK lineage) |
| ReconciliationCorrespondenceCompiler | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js` | Uses crosswalk bridge to assess confidence level per semantic domain |
| crosswalk_mapping_validation.json | `docs/psee/PI.LENS.REPORT-RENDERER-LINEAGE-CONTEXT-DISCOVERY.01/` | Validated crosswalk integrity for zone anchor rendering |
| LENS report renderer | Multiple rendering paths | Resolves `_resolve_domain_display_label(domId, technicalLabel)` → business label when crosswalk confidence ≥ 0.60 |

---

## 6. Crosswalk Derivation Chain

```
UPSTREAM EVIDENCE (HTML briefs, architecture docs, source code)
  ↓
Stage 1: Architecture-layer taxonomy (7-layer model, 16-18 CAP domains)
  ↓
Stage 2: Source enumeration (app.module.ts → 89 BM-NNN entities)
  ↓
Stage 3: Derivation bundle (COMP-NN re-enumeration, IIM intent extraction) — ABSENT, reconstructed
  ↓
Stage 4: 41.1 Semantic construction (89 COMP → 42 CAP → 17 DOMAIN)
  ↓
build_semantic_layer.py (embeds the 17 DOMAIN definitions as canonical data)
  ↓
semantic_continuity_crosswalk.json (v2.0: maps DOM-XX → DOMAIN-XX via COMP→CAP→DOMAIN chain)
```

The crosswalk is a BRIDGE artifact. It does not create either the structural DOMs or the semantic DOMAINs. It maps between two independently-derived ontologies.

---

## 7. Crosswalk → Reconciliation → LENS Flow

```
                   PATH A (structural)               PATH B (semantic)
                         │                                  │
                 13 DOM groups                     17 DOMAIN entities
                   (CEU + path)                   (41.1 semantic construction)
                         │                                  │
                         └──────── CROSSWALK ───────────────┘
                                     │
                        maps DOM-XX → DOMAIN-XX
                        with confidence scores
                                     │
                    RECONCILIATION CORRESPONDENCE COMPILER
                                     │
                        per-domain confidence levels
                        (Level 1-5 graduated model)
                                     │
                    SEMANTIC ACTOR HYDRATOR
                                     │
                        backedDomains (EXACT/STRONG) = 4
                        semanticOnlyDomains (NONE/WEAK) = 13
                                     │
                        deriveQualifierClass()
                        grounding_ratio = 4/17 = 0.2353
                        Q-class = Q-02 (partial grounding)
                                     │
                    LENS EXECUTIVE PROJECTION
                        "4 of 17 semantic domains are structurally backed;
                         13 remain semantic-only"
```
