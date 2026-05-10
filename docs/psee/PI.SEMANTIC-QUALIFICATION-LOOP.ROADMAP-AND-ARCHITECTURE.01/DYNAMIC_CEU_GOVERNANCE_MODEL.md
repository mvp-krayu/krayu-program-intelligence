# Dynamic CEU Governance Model

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document reframes Dynamic CEU (Computable Evidence Unit) as a governed semantic maturation assistance capability — not an AI synthesis layer. Dynamic CEU operates within the SQO qualification lifecycle to help clients improve their semantic maturity through evidence-linked, governance-compliant, replay-safe enrichment.

Dynamic CEU is NOT:
- an AI inference engine
- a probabilistic enrichment system
- a synthetic semantic generator
- an autonomous agent

Dynamic CEU IS:
- a governed assistance framework
- an evidence-linking mechanism
- a guided enrichment coordinator
- a replay-safe maturation catalyst

---

## 2. Core reframing

### From: Computable Enhancement Unit

The original CEU concept measured structural component linkage — how many structural components in the canonical topology have computable evidence connections. CEU grounding ratio (e.g., FastAPI at 0.90) measures Layer 1 structural linkage.

### To: Governed Maturation Assistance

Dynamic CEU extends the CEU concept from static structural measurement to active semantic maturation assistance. The key insight is the **CEU paradox**: a high CEU grounding ratio (structural) does not imply semantic maturity. FastAPI demonstrates this — 0.90 CEU structural grounding with 0/9 semantic domain grounding.

Dynamic CEU bridges this gap by:
1. Identifying which structural evidence connections can be elevated to semantic grounding
2. Recommending source material that would enable this elevation
3. Coordinating governed re-processing when enriched source material is available
4. Tracking the maturation trajectory from structural to semantic grounding

### The boundary

Dynamic CEU assists maturation. It does not fabricate maturation.

The distinction:
- **Assist:** "Your substrate has 9 structural clusters. Providing architecture decision records that map these clusters to business capabilities would enable the semantic pipeline to produce named domains with lineage." → Governed maturation assistance.
- **Fabricate:** "Your substrate has 9 structural clusters. I will generate business-meaningful domain names for these clusters based on their structural patterns." → Semantic fabrication. PROHIBITED.

---

## 3. Allowable behaviors

| Behavior | Description | Governance constraint |
|----------|-------------|----------------------|
| Structural-to-semantic mapping recommendation | Identify structural evidence that could ground semantic domains | Must reference specific topology nodes and their properties |
| Source material gap analysis | Identify what additional source material would enable S-state progression | Must reference documented enrichment pathways |
| Enrichment impact projection | Estimate which maturity dimensions would improve with specific enrichments | Projections must state assumptions; no guaranteed outcomes |
| Re-processing coordination | Trigger semantic pipeline re-run with enriched inputs | Must comply with pipeline_execution_manifest.json |
| Maturation trajectory tracking | Record enrichment history and maturity progression | Additive-only, replay-safe |
| Evidence linkage verification | Verify that semantic claims are grounded in structural evidence | Must use existing Lane A and Lane D artifacts |
| Continuity gap identification | Identify gaps in the semantic continuity crosswalk | Must reference specific crosswalk entities |
| Grounding pathway recommendation | Recommend specific actions to improve domain grounding ratio | Must reference documented grounding mechanisms |

---

## 4. Prohibited behaviors

| Prohibition | Reason | Governance reference |
|-------------|--------|---------------------|
| Generate domain names | Semantic fabrication — violates AXIOM-01 | SQO_LANE_ARCHITECTURE.md §2 |
| Infer business labels from structural patterns | No evidence linkage — violates AXIOM-02 | SQO_LANE_ARCHITECTURE.md §2 |
| Synthesize crosswalk entries | Crosswalk must derive from source material | MINIMUM_SEMANTIC_ENVELOPE_SPECIFICATION.md §E |
| Create decision validation results | Decision validation is a deterministic pipeline artifact | Pipeline execution manifest |
| Generate reproducibility verdicts | Reproducibility is measured, not asserted | Pipeline execution manifest |
| Modify Lane A artifacts | Lane A is frozen and immutable | SQO_LANE_ARCHITECTURE.md §5 |
| Modify Lane D (DPSIG) artifacts | DPSIG derivation is sovereign | SQO_LANE_ARCHITECTURE.md §2 |
| Override Q-class resolution | Q-class is a deterministic pure function | Q02_GOVERNANCE_AMENDMENT.md §4 |
| Bypass projection gating | Projection authorization is governance-disclosed | Q02_GOVERNANCE_AMENDMENT.md §5 |
| Introduce probabilistic scoring | All scores must be deterministic from evidence | SEMANTIC_MATURITY_MODEL.md §9 |
| Claim guaranteed enrichment outcomes | Enrichment outcomes depend on source material quality | This document §3 |
| Execute autonomous enrichment cycles | All enrichment requires explicit authorization | This document §5 |

---

## 5. Evidence requirements

Dynamic CEU enrichment recommendations must be evidence-linked at every step:

### Input evidence

Every Dynamic CEU operation must declare its input evidence:

```json
{
  "operation": "<operation_type>",
  "input_evidence": {
    "lane_a_artifacts": ["<artifact_key>", ...],
    "lane_d_artifacts": ["<artifact_key>", ...],
    "semantic_pipeline_artifacts": ["<artifact_key>", ...],
    "sqo_artifacts": ["<artifact_key>", ...]
  },
  "input_hashes": {
    "<artifact_key>": "<sha256_hash>"
  }
}
```

### Output evidence

Every Dynamic CEU operation must produce auditable output:

```json
{
  "operation": "<operation_type>",
  "output_type": "recommendation | assessment | trajectory",
  "evidence_linkage": {
    "grounded_in": ["<specific_artifact_field_path>", ...],
    "assumptions": ["<stated_assumption>", ...],
    "limitations": ["<stated_limitation>", ...]
  }
}
```

### Provenance chain

The complete chain from input evidence to output recommendation must be traceable:

```
Lane A artifact → field reference → Dynamic CEU analysis → recommendation → evidence linkage
```

No step in this chain may be opaque. Every recommendation must be explainable by pointing to the specific artifact fields that motivated it.

---

## 6. Provenance linkage model

### Level 1: Artifact linkage

Each Dynamic CEU output references the specific artifacts it consumed:

```json
{
  "provenance": {
    "source_artifacts": [
      {
        "artifact": "semantic_topology_model",
        "path": "clients/fastapi/run_02_oss_fastapi_pipeline/semantic_topology_model.json",
        "hash": "<sha256>",
        "fields_consumed": ["domains[*].lineage_status", "domains[*].domain_name"]
      }
    ]
  }
}
```

### Level 2: Field-level linkage

Recommendations reference specific fields within artifacts:

```json
{
  "recommendation": "Provide ADRs mapping CLU-03 to a business capability",
  "field_evidence": {
    "domain": "domains[2]",
    "current_lineage": "NONE",
    "current_label": "CLU-03",
    "structural_backing": "canonical_topology.nodes[CLU-03]",
    "gap": "No business label, no lineage — structural node exists but semantic grounding absent"
  }
}
```

### Level 3: Historical linkage

Maturation trajectory records carry provenance to prior states:

```json
{
  "trajectory": {
    "prior_state": { "s_state": "S1", "maturity_score": 0.10, "timestamp": "<ISO-8601>" },
    "current_state": { "s_state": "S2", "maturity_score": 0.45, "timestamp": "<ISO-8601>" },
    "enrichment_applied": "semantic_pipeline_rerun_with_adrs",
    "source_material_added": ["architecture_decision_records"],
    "provenance": {
      "prior_sqo_artifact": "artifacts/sqo/fastapi/run_02/.../maturity_score_v1.json",
      "current_sqo_artifact": "artifacts/sqo/fastapi/run_02/.../maturity_score_v2.json"
    }
  }
}
```

---

## 7. Replay guarantees

Dynamic CEU operations must be replay-safe:

1. **Deterministic output.** Same input artifacts + same Dynamic CEU operation → same output. No randomized recommendations.
2. **Version-stable.** Dynamic CEU operation versions are tracked. A re-run with the same version and inputs must produce identical output.
3. **Additive persistence.** New Dynamic CEU outputs append to the SQO artifact set. Prior outputs are retained, never overwritten.
4. **Hash-anchored.** Every Dynamic CEU output carries the sha256 hashes of its input artifacts. Replay verification: re-hash inputs and compare.
5. **No hidden state.** Dynamic CEU operations must not depend on session state, user preferences, or runtime configuration beyond the declared inputs.

---

## 8. Enrichment workflow model

### Step 1: Assessment

Dynamic CEU reads current artifacts and produces a maturity assessment:
- Current S-state
- Current maturity score (per SEMANTIC_MATURITY_MODEL.md)
- Semantic debt inventory
- Gravity coefficient

### Step 2: Recommendation

Based on the assessment, Dynamic CEU produces enrichment recommendations:
- Specific source material to provide (ADRs, capability models, ownership docs)
- Expected impact on maturity dimensions
- Expected S-state progression (if prerequisites met)
- Priority ordering (which enrichments have highest impact)

### Step 3: Source material intake

Client provides additional source material. Dynamic CEU does NOT generate this material. The client provides it. Dynamic CEU validates that the material is sufficient for the recommended enrichment.

### Step 4: Governed re-processing

With enriched source material, the semantic pipeline is re-run. This re-run must comply with pipeline_execution_manifest.json. Dynamic CEU coordinates the re-run but does not modify the pipeline.

### Step 5: Re-assessment

After re-processing, Dynamic CEU produces an updated maturity assessment:
- New S-state
- New maturity score
- Delta from prior assessment
- Remaining semantic debt
- Updated trajectory

### Step 6: History append

The enrichment cycle is recorded in the qualification history:
- Before/after maturity comparison
- Source material provided
- Pipeline re-run metadata
- S-state transition (if any)

---

## 9. Relationship to existing CEU

Dynamic CEU does not replace or modify the existing CEU concept:

| Property | Static CEU | Dynamic CEU |
|----------|-----------|-------------|
| Measures | Structural component linkage (L1) | Semantic maturation trajectory (L4) |
| Scope | Lane A grounding ratio | SQO qualification lifecycle |
| Artifact | `ceu_grounding_state.json` | `artifacts/sqo/<client>/<run_id>/` |
| Mutability | Read-only (Lane A sovereign) | Additive-only (SQO namespace) |
| Governance | Part of Lane A frozen baseline | Part of SQO governed lifecycle |

Dynamic CEU reads static CEU as one of its inputs. Dynamic CEU never modifies static CEU artifacts.

---

## 10. Governance constraints

1. Dynamic CEU is assistive, not autonomous. Every enrichment cycle requires explicit authorization.
2. Dynamic CEU never fabricates semantic content. All recommendations are evidence-linked.
3. Dynamic CEU never modifies Lane A, Lane D, or PATH B artifacts. Writes exclusively to `artifacts/sqo/`.
4. Dynamic CEU operations are deterministic and replay-safe. No stochastic components.
5. Dynamic CEU recommendations must state assumptions and limitations. No guaranteed outcomes.
6. Dynamic CEU provenance chains must be complete and auditable. No opaque steps.
7. Dynamic CEU does not introduce AI inference, probabilistic interpolation, or speculative assessment.
8. Dynamic CEU weight parameters and scoring models are governance-controlled. No runtime tuning.
