# Semantic Reconstruction vs Structural Grounding

> **Two fundamentally different operations that serve the same client. Stop confusing them.**

---

## 1. The Confusion This Document Resolves

The system has repeatedly conflated two distinct operations:

- **Semantic reconstruction:** Producing operationally useful intelligence from evidence
- **Structural grounding:** Proving that semantic claims have structural backing

These are not the same thing. They are not stages of the same process. They are not competing approaches. They are complementary operations performed by different architectural components on different evidence, producing different outputs.

---

## 2. Semantic Reconstruction (PATH B Activity)

### What It Is
Taking raw or partially structured evidence (HTML documents, audit reports, operational data) and producing a rich semantic model — domain structure, actor relationships, capability mapping, continuity assessment, risk classification.

### How It Works Today
1. **Evidence extraction:** ExplicitEvidenceRebaseExtractor processes source documents
2. **Semantic hydration:** SemanticActorHydrator produces 15-actor domain model
3. **Crosswalk translation:** SemanticCrosswalkMapper maps DOM-XX to business labels
4. **Quality classification:** QClassResolver assigns Q-class based on grounding level
5. **Signal projection:** DPSIGSignalMapper produces executive intelligence signals
6. **Executive rendering:** LENS v2 renders the semantic model with qualification disclosure

### What It Produces
- Operational intelligence that executives can use
- Semantic domain coverage assessment
- Qualification state tracking (via SQO)
- Executive signals (DPSIG family)

### What It Does NOT Prove
- That every semantic claim has structural backing
- That the domain model is structurally verified
- That the grounding ratio meets any particular threshold

---

## 3. Structural Grounding (PATH A Activity)

### What It Is
Verifying that semantic claims have backing in structural evidence — vault anchors, topology reports, verified registries, module inventories.

### How It Works Today
1. **Vault anchor binding:** Semantic domain claims checked against vault anchors
2. **Topology verification:** Observational evidence from topology reports
3. **Registry mapping:** CLU/DOM/CAP registries provide structural entity inventory
4. **Grounding ratio:** Per-domain measurement of structural backing percentage
5. **DPSIG derivation:** Deterministic signals derived from structurally grounded evidence

### What It Proves
- Which semantic claims have structural evidence
- At what confidence level (binary today, graduated future)
- Which domains are fully grounded vs partially grounded vs unmapped

### What It Does NOT Produce
- Semantic interpretation of what the evidence means
- Executive intelligence rendering
- Operational recommendations
- Domain relationship analysis

---

## 4. Why They Must Remain Separate

| If merged | Consequence |
|---|---|
| Reconstruction blocked on grounding | No executive intelligence until full proof — commercial death |
| Grounding weakened to match reconstruction speed | Structural certainty lost — governance failure |
| Single pipeline for both | Coupling creates cascading failures (lesson from two-pipeline confusion) |
| Single team/stream for both | Scope confusion — "are we proving or interpreting?" |

The system tried merging these concerns before the PATH split (2026-05-07). The result was the structural grounding crisis — semantic richness was at risk of being discarded because structural proof was incomplete.

---

## 5. The Reconciliation Bridge Is Neither

The reconciliation bridge (defined in RECONCILIATION_BRIDGE_ARCHITECTURE.md) is a **third operation**:

| Operation | What It Does | Not This |
|---|---|---|
| Semantic reconstruction | Produces intelligence | Not verification |
| Structural grounding | Proves structure | Not interpretation |
| Reconciliation | Maps correspondence between the two | Not reconstruction or grounding |

Reconciliation takes the outputs of both operations and produces a correspondence report. It does not reconstruct. It does not ground. It compiles.

---

## 6. AI-Assisted Semantic Reconstruction

### Positioning

AI-assisted semantic reconstruction is an extension of PATH B — it uses AI capabilities to produce richer semantic output from the same or new evidence. It is formally acceptable as a semantic reconstruction technique.

### What AI-Assisted Reconstruction Can Do
- Extract semantic intent from unstructured documents
- Identify domain relationships that pattern matching misses
- Produce richer actor models with deeper semantic coverage
- Accelerate the hydration process for new clients

### What AI-Assisted Reconstruction Cannot Do
- Produce structural grounding (AI interpretation ≠ structural proof)
- Skip the reconciliation bridge (AI output still needs correspondence verification)
- Bypass Q-class governance (AI-produced semantics are classified like any other)
- Promote itself to authority (governance promotion requires the full trustworthiness progression)

### Where AI-Assisted Output Enters
AI-assisted output enters as PATH B input — it is evidence consumed by the semantic reconstruction pipeline. It does not enter PATH A. It does not bypass reconciliation.

---

## 7. Practical Decision Guide

| You want to... | Use |
|---|---|
| Get executive intelligence now | PATH B (HYDRATED rendering with disclosure) |
| Prove structural grounding for a domain | PATH A (vault anchors, topology verification) |
| Map which semantic claims have structural backing | Reconciliation bridge |
| Extract more meaning from existing evidence | AI-assisted semantic reconstruction (PATH B input) |
| Advance from HYDRATED to RECONCILED | Reconciliation bridge + human approval |
| Get to Q-01 | Progressive grounding (PATH A expansion) + full reconciliation |
| Render without disclosure | Full trustworthiness progression to LENS state |

---

## 8. Cross-References

- [[RECONCILIATION_BRIDGE_ARCHITECTURE]] — the bridge between these two operations
- [[HYDRATED_STATE_FORMALIZATION]] — what reconstruction produces operationally
- [[PATH_A_PATH_B_OPERATIONAL_BOUNDARIES]] — permanent separation of concerns
- [[LENS_V2_RECONCILIATION_INTEGRATION]] — how both operations reach the surface
- [[EXECUTION_PHASES_NEAR_TERM]] — near-term execution path
