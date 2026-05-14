# AI-Assisted Reconstruction Integration Assessment

**Stream:** PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01

---

## 1. Where AI Fits in the Reconciliation Loop

AI-assisted reconstruction is NOT a replacement for the reconciliation compiler. It is a **semantic material producer** that feeds INTO the compiler. The compiler is deterministic. AI is generative. They operate at different stages.

```
EVIDENCE INTAKE → [AI RECONSTRUCTION] → SEMANTIC TOPOLOGY → CORRESPONDENCE COMPILER → OUTPUT
                   ↑                      ↑                    ↑
                   generative             generated             deterministic
                   (AI produces           (AI output is         (no AI here)
                    semantic claims)       domain model data)
```

---

## 2. Current State: Where AI Could Have Helped (But Didn't)

BlueEdge's 12 UNMAPPED domains (L1 confidence) exist because:
- DOMAIN-02 through DOMAIN-09, DOMAIN-12, DOMAIN-13, DOMAIN-15, DOMAIN-17 have `lineage_status: NONE` and `confidence: 0.0`
- They have no `dominant_dom_id` — no structural DOM group was identified as corresponding
- The crosswalk mapper found no `COMP-NN → CAP-NN → DOMAIN-NN` derivation chain for them

These domains are semantically valid (they are legitimate business concepts in BlueEdge's codebase) but structurally ungrounded. They were created through manual semantic analysis, not through derivation from structural evidence.

**AI-assisted reconstruction would have produced candidate correspondences for these 12 domains** by analyzing the evidence material (HTML files, codebase structure) and proposing which structural components might correspond to which semantic domains.

---

## 3. AI Insertion Points

### Insertion Point A: Semantic Topology Construction (Stage 3)

**When:** During initial client onboarding, when the semantic domain model is being constructed.

**AI role:** Analyze the codebase structure and evidence material to propose:
- Business domain names and boundaries
- Domain-to-component correspondence candidates
- Capability groupings
- Cluster assignments

**Input:** Raw evidence + structural topology from PATH A
**Output:** `semantic_topology_model.json` (same schema as manually produced)
**Confidence:** AI-generated domains start at L2 (UPSTREAM_EVIDENCE_BOUND) or L3 (SEMANTICALLY_COHERENT) — never L5 (STRUCTURALLY_GROUNDED) because AI proposals are not structural proof.

**Governance constraint:** AI-generated semantic topology MUST be flagged with a generation source marker. The `lineage_status` field already supports this: AI-generated domains would have `lineage_status: INFERRED` or a new status `AI_RECONSTRUCTED`.

### Insertion Point B: Crosswalk Enhancement (Stage 3)

**When:** After initial crosswalk is built, for the gaps (unmapped DOMs).

**AI role:** Propose candidate business labels and DOMAIN-XX mappings for structural DOMs that the deterministic derivation chain could not resolve.

**Input:** Structural topology + partially-completed crosswalk + evidence material
**Output:** Enhanced `semantic_continuity_crosswalk.json` with new entities marked `match_classification: AI_PROPOSED`
**Confidence:** AI-proposed crosswalk entries get `confidence_score` in the 0.3–0.6 range (semantically plausible but not deterministically derived).

**Governance constraint:** AI-proposed crosswalk entries MUST have `fallback_used: true` and `fallback_reason: 'AI_SEMANTIC_RECONSTRUCTION'`. The compiler will classify these as L2 or L3, never L5.

### Insertion Point C: Progressive Reconciliation (Post-Stage 4)

**When:** After initial correspondence compilation, to improve the reconciliation ratio.

**AI role:** Review UNMAPPED correspondences and propose structural evidence that might bridge the gap. This is the "AI looks at the unmatched list and tries to find connections" operation.

**Input:** `reconciliation_correspondence.v1.json` (the unreconciled entries) + evidence material
**Output:** Candidate correspondence proposals for human review
**Confidence:** Proposals are NOT auto-applied. They enter a human approval corridor before any artifact update.

---

## 4. What AI Must NOT Do

| Forbidden | Why |
|-----------|-----|
| Produce L5 (STRUCTURALLY_GROUNDED) confidence | L5 requires EXACT crosswalk + vault signal binding + trace chain. AI cannot manufacture structural proof. |
| Modify PATH A artifacts | PATH A is frozen, deterministic, certified. AI operates exclusively on PATH B material. |
| Bypass the compiler | All AI output goes through the same `compileCorrespondence()` engine. AI doesn't produce correspondence directly — it produces improved semantic material that the compiler then processes. |
| Replace human approval for state transitions | HYDRATED → RECONCILED transition requires human sign-off. AI proposals inform the human decision, they don't automate it. |
| Fabricate evidence | AI can propose correspondences. It cannot fabricate structural evidence, vault anchors, or signal projections. |

---

## 5. Impact on Confidence Distribution

For a client with AI-assisted reconstruction vs. without:

### Without AI (BlueEdge current state)
```
L5: 4 domains (23.5%)    — deterministically grounded
L4: 0 domains             — strong but no signal binding
L3: 1 domain  (5.9%)      — partial crosswalk
L2: 0 domains             — weak/fallback
L1: 12 domains (70.6%)    — unmapped
```

### With AI (hypothetical BlueEdge after AI reconstruction)
```
L5: 4 domains (23.5%)    — unchanged (AI cannot elevate to L5)
L4: 0–2 domains           — if AI + operator evidence corroborates
L3: 5–8 domains           — AI proposes semantic coherence
L2: 3–5 domains           — AI proposes weak candidates
L1: 2–5 domains           — truly unmappable residue
```

The shift is entirely in the L1→L2/L3 band. AI fills the semantic gap, not the structural gap. Structural grounding (L5) is permanently off-limits for AI-only proposals.

---

## 6. Implementation Approach

AI-assisted reconstruction does NOT require changes to the reconciliation compiler. It requires:

1. **A semantic material generator** that produces `semantic_topology_model.json` and `semantic_continuity_crosswalk.json` from evidence + structural topology
2. **An AI proposal format** — a staging artifact where AI outputs are reviewed before being merged into the canonical semantic artifacts
3. **A human approval corridor** — UI in the SQO cockpit where an operator reviews AI proposals and approves/rejects each correspondence
4. **A re-compilation trigger** — after approval, re-run the compiler with the updated semantic material

The compiler itself remains deterministic and unchanged. AI operates upstream of it. This separation is architecturally critical — it means AI errors are contained to the semantic material layer and cannot pollute structural evidence or correspondence logic.

---

## 7. Scaling Implications

For multi-client operationalization:
- Each new client goes through Stages 1–3 with AI assistance
- AI generates a first-pass semantic topology and crosswalk
- Human operator reviews and approves
- Compiler runs once to produce correspondence
- SQO + LENS + cockpit activate automatically

The **bottleneck** for scaling is not the compiler (it's instant). It's not the runtime visibility (it's automatic). The bottleneck is **Stage 3: Semantic Construction** — specifically the quality of the semantic domain model that AI produces. The compiler honestly surfaces whatever confidence level the semantic material supports. If AI produces poor semantic material, the compiler will honestly show 17 domains at L1 (UNMAPPED). There is no way to game the correspondence — the compiler is deterministic.
