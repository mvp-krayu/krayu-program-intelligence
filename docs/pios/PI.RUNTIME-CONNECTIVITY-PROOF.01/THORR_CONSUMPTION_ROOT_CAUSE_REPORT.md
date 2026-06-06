# THORR Consumption Root Cause Report

Stream: PI.THORR-CONSUMPTION-ROOT-CAUSE.01
Date: 2026-06-05
Specimen: blueedge / run_blueedge_genesis_e2e_03
Persona tested: Transformation Leader

---

## 1. Pipeline Trace

| Stage | Count | Ordering | Notes |
|---|---|---|---|
| Consequences generated | 7 top-level | severity-sorted | 3 STAB_RISK (runtime loci), 2 SYSTEMIC_OP_FRAG, AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL |
| Runtime consequences generated | 7 atomic (canonical families) | merged into dedup | COORD_FRAG×3, DEP_AMP×1, RESIL_DEF×1, PROP_EXP×1, DEL_EXP×1 |
| Cognition slices generated | 16 total (9 static + 7 runtime) | by condition order | All non-NOMINAL |
| Condensed to THORR | 10 (5 static + 5 runtime) | persona-weighted score | Async Propagation #3, Event Coordination #5, Runtime Dep Choke #6 |
| Prompt payload | ~8,050 tokens | structured JSON sections | Boardroom (1955 tok) + Balanced (956 tok) dominate |
| Final answer | ~3,500 chars | narrative composition | Mentions "Fleet Core Operations" via executive_synthesis reference |

---

## 2. Prompt Authority Audit

| Section | Position | Tokens | % of context | Narrative authority |
|---|---|---|---|---|
| boot_context | 1 | 1,430 | 18% | Background — not narrative anchor |
| visibility_layer_completeness | 2 | 359 | 4% | Metadata — read but rarely cited |
| **boardroom_projection** | **3** | **1,955** | **24%** | **PRIMARY narrative anchor** |
| balanced_projection | 4 | 956 | 12% | Secondary — reinforcement flow |
| specimen_data | 5 | 63 | 1% | Minimal |
| structural_topology | 6 | 1,478 | 18% | Evidence detail — cited for file paths |
| capability_context | 7 | 1,811 | 22% | Background — not narrative anchor |

### Boardroom sub-section breakdown

| Sub-section | Tokens | Content type | LLM treatment |
|---|---|---|---|
| cognition_slices | 700 | JSON array with scores | **DATA — not used as narrative anchor** |
| consequence_themes | 313 | Named canonical themes | **NARRATIVE ANCHOR — drives theme structure** |
| domain_narratives | 301 | Per-domain risk labels | **NARRATIVE ANCHOR — drives domain framing** |
| domain_concentration | 294 | Weight distribution | Supporting detail |
| executive_synthesis | 92 | One sentence | **NARRATIVE ANCHOR — opening framing** |
| combined_synthesis | 30 | One sentence | Closing summary |

---

## 3. Runtime Cognition Object Lineage

| Cognition Object | Generated | Persona scored | Selected | In prompt | In answer | Loss point |
|---|---|---|---|---|---|---|
| Async Propagation Asymmetry | YES | #3 (score 12) | YES | YES (slice) | NO | **domain_narrative = "structural stress is present"** |
| Event Coordination Concentration | YES | #5 (score 10) | YES | YES (slice) | NO | **domain_narrative = "structural stress is present"** |
| Runtime Dependency Choke Point | YES | #6 (score 10) | YES | YES (slice) | NO | **domain_narrative = "structural stress is present"** |
| Broker Dependency Risk | YES | #7 (score 8) | YES | YES (slice) | NO | **domain_narrative = "structural stress is present"** |
| Topic Fanout Pressure | YES | #9 (score 7) | YES | YES (slice) | NO | **domain_narrative = "structural stress is present"** |

**Every runtime cognition object reaches the prompt. None are consistently surfaced in the answer.**

---

## 4. Proven Root Causes

### RC-4: Executive synthesis dominates cognition slices — PROVEN

The executive_synthesis (92 tokens) is narrative text. The cognition_slices (700 tokens) are a JSON array. The LLM uses narrative text as its primary composition anchor, not structured JSON data. The executive_synthesis now mentions runtime domains ("Runtime connectivity analysis reveals additional structural stress in Fleet Core Operations...") — and the Transformation Leader answer DID pick up "Fleet Core Operations" from it. But the slices themselves (which carry persona_relevance=ELEVATED and relevance_score) are not used as narrative anchors.

**Evidence:** Transformation Leader answer mentions Fleet Core Operations (from executive_synthesis) but never mentions "Event Coordination Concentration" or "Runtime Dependency Choke Point" (from cognition_slices).

### RC-5: Consequence themes dominate runtime cognition — PROVEN

The 4 consequence themes (313 tokens) carry canonical names: Amplified Dependency Fragility, Structural Gravity Well, Structural Stability Risk, Systemic Operational Fragility. These are narrative-ready labels. The LLM structures its answer around these 4 themes. Runtime conditions contribute to these themes (via canonical family merger) but the theme names don't reveal runtime evidence origin.

**Evidence:** Every THORR answer organizes around the 4 consequence themes. Runtime contributions are invisible inside theme labels.

### RC-7: Domain narratives for runtime domains are informationally empty — PROVEN (primary root cause)

Platform Infrastructure and Data gets: "flow, concentration, and coupling converging — everything flows through a rigidly locked region" (classes: ABD)

Fleet Core Operations gets: "structural stress is present" (classes: none)

The risk_label and classes are derived from `deriveDomainRiskProfile()` which classifies based on condition ontology classes (A-E). Runtime conditions (EVENT_CONCENTRATION, RUNTIME_DEPENDENCY_CHOKE_POINT, etc.) are not in `CONDITION_ONTOLOGY_CLASS` — they have no ontology class assignment. Therefore `deriveDomainRiskProfile()` produces an empty class set and the generic fallback "structural stress is present."

**This is the primary loss point.** The domain_narrative is the LLM's per-domain narrative anchor. When it says "structural stress is present" with no classes, the LLM has nothing specific to cite. When it says "flow, concentration, and coupling converging," the LLM builds detailed narrative around it.

**Evidence:** `CONDITION_ONTOLOGY_CLASS` in ConsequenceCompiler has entries for all 11 static condition types but zero runtime condition types.

### RC-6: Severity weighting overwhelms persona weighting — PARTIALLY PROVEN

The persona weighting adds 2-3 points of bonus per category match. But the severity base scores are: CRITICAL=10, HIGH=7, ELEVATED=4. A HIGH static condition at score 7 (no bonus) still outranks an ELEVATED runtime condition at score 4+3=7. The bonuses create ties, not overrides. The reranking changes the order within severity tiers but rarely promotes a lower-severity item above a higher-severity one.

**Evidence:** Slice #3 is Async Propagation Asymmetry [ELEVATED] score=12 — tied with Pressure Convergence [HIGH] score=12. Tied, not promoted above.

---

## 5. Recommended Fixes (ranked)

### Fix 1 — Add runtime condition types to CONDITION_ONTOLOGY_CLASS

**Location:** ConsequenceCompiler.js, CONDITION_ONTOLOGY_CLASS constant
**Impact:** Runtime domains get ontology classification → deriveDomainRiskProfile produces real risk labels → domain_narratives carry specific risk_label and classes → LLM has narrative-ready text for runtime domains
**Risk:** LOW — additive, no existing behavior changes
**Token impact:** ~50 more tokens in domain_narratives (richer labels)
**Consumer impact:** THORR, LENS, EIR all benefit — domain narratives are consumed by all

This is the primary fix. It addresses RC-7 directly. When Fleet Core Operations gets "coordination concentration and dependency amplification converging" instead of "structural stress is present," the LLM will cite it.

### Fix 2 — Add runtime evidence source to consequence theme labels

**Location:** ConsequenceCompiler.js, consequence_themes generation in forBoardroom
**Impact:** Themes like "Systemic Operational Fragility" would note "(11 sources: 6 static, 5 runtime)" — making runtime contribution visible in the narrative anchor
**Risk:** LOW — additive label change
**Token impact:** ~20 more tokens
**Consumer impact:** THORR narrative composition would reflect evidence diversity

### Fix 3 — Restructure cognition_slices as narrative-ready text instead of JSON array

**Location:** PIKnowledgeGraphAccess.js condenseBoardroom, or PIContextAssembler formatContextForPrompt
**Impact:** Slices formatted as narrative bullets instead of JSON would become narrative anchors: "3. [ELEVATED] Async Propagation Asymmetry → Real-Time Streaming and Gateway (runtime connectivity, persona-relevant)"
**Risk:** MEDIUM — changes prompt structure, may affect all personas
**Token impact:** Similar or slightly less (narrative is denser than JSON)
**Consumer impact:** THORR only — LENS/EIR don't read the condensed slices

### Fix 4 — Increase persona bonus magnitude

**Location:** PIContextAssembler.js PERSONA_CATEGORY_WEIGHTS
**Impact:** Higher bonuses (5-7 instead of 2-3) would create clear separation between persona-relevant and standard slices
**Risk:** LOW — but may over-promote low-severity runtime items for some personas
**Token impact:** None
**Consumer impact:** THORR only

---

## 6. Recommended Implementation Order

```
1. Fix 1 — CONDITION_ONTOLOGY_CLASS for runtime types     ← addresses primary root cause (RC-7)
2. Fix 2 — evidence source annotation on consequence themes  ← addresses RC-5
3. Fix 3 — narrative-formatted slices                       ← addresses RC-4
4. Fix 4 — persona bonus magnitude                          ← addresses RC-6, only if 1-3 insufficient
```

Fix 1 alone may be sufficient. When domain_narratives carry rich labels for runtime domains, the LLM's narrative composition will naturally cite them — the same way it cites "flow, concentration, and coupling converging" for Platform Infrastructure and Data.
