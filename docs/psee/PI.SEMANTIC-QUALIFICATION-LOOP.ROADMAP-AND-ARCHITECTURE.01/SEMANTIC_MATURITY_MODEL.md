# Semantic Maturity Model

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines the framework for measuring and scoring semantic maturity of client substrates within the SQO qualification lifecycle. Semantic maturity is a composite, multi-dimensional metric that quantifies how far a client substrate has progressed from raw structural output (S0) toward full semantic governability (S3+).

Maturity scoring is deterministic, evidence-linked, and replay-safe. It does not introduce probabilistic interpolation, AI inference, or speculative assessment.

---

## 2. Core principles

1. **Maturity is measured, not estimated.** Every score dimension derives from a countable artifact property.
2. **Maturity is not quality.** A low maturity score is a valid state, not a defect. S0 is legitimate.
3. **Maturity is multi-dimensional.** No single number captures semantic maturity. The composite score is a convenience summary; the dimensional breakdown is the ground truth.
4. **Maturity is monotonically improvable.** The model must define clear enrichment pathways for each dimension. Improvement requires source material, not AI synthesis.
5. **Maturity scoring is replay-safe.** Same artifacts → same maturity score. No hidden state.

---

## 3. Maturity dimensions

### D1: Artifact Completeness

**Definition:** The ratio of present required semantic artifacts to total required semantic artifacts.

**Measurement:**
```
artifact_completeness = present_required_count / total_required_count
```

Where `total_required_count` = 6 (semantic_topology_model, decision_validation, reproducibility_verdict, semantic_continuity_crosswalk, canonical_topology_40_4, dpsig_signal_set).

**Scale:** 0.0 to 1.0

**Reference values:**
- BlueEdge: 6/6 = 1.0
- FastAPI: 3/6 = 0.5

**Enrichment pathway:** Produce missing artifacts through semantic pipeline enrichment (see MINIMUM_SEMANTIC_ENVELOPE_SPECIFICATION.md §E).

---

### D2: Domain Grounding Ratio

**Definition:** The ratio of structurally grounded semantic domains to total semantic domains.

**Measurement:**
```
domain_grounding = backed_count / total_count
```

Where `backed_count` = domains with EXACT or STRONG lineage, `total_count` = all declared semantic domains.

**Scale:** 0.0 to 1.0

**Reference values:**
- BlueEdge: 4-5/17 ≈ 0.24-0.29 (Q-02)
- FastAPI: 0/9 = 0.0 (all NONE lineage, inference_prohibition: true)

**Enrichment pathway:** Provide richer source material (ADRs, capability models, ownership documentation) that enables structural grounding of semantic domains during pipeline re-processing.

---

### D3: Semantic Continuity

**Definition:** Whether validated semantic continuity exists between structural topology and semantic domains.

**Measurement:**
```
semantic_continuity = semantic_continuity_crosswalk.validation_status
```

**Scale:** Binary — VALIDATED (1.0) or NOT_VALIDATED (0.0)

**Reference values:**
- BlueEdge: VALIDATED (1.0) — crosswalk with 13 entities, 9 with business labels
- FastAPI: NOT_VALIDATED (0.0) — crosswalk absent

**Enrichment pathway:** Produce semantic_continuity_crosswalk through enriched semantic pipeline run.

---

### D4: Decision Validation

**Definition:** Whether the semantic topology model has been validated against deterministic decision criteria.

**Measurement:**
```
decision_validation = decision_validation.overall_status
```

Where `overall_status` is derived from individual validation function pass/fail results (VF-01 through VF-14).

**Scale:** Ratio of PASS to total checks, or binary overall (PASS/FAIL).

**Reference values:**
- BlueEdge: 14/14 PASS (1.0)
- FastAPI: absent (0.0)

**Enrichment pathway:** Produce decision_validation through enriched semantic pipeline run. All 14 validation functions must PASS.

---

### D5: Reproducibility

**Definition:** Whether the semantic derivation is fully reproducible from source inputs.

**Measurement:**
```
reproducibility = reproducibility_verdict.overall_verdict
```

Where overall verdict requires all reproducibility criteria to PASS.

**Scale:** Binary — FULL_REPRODUCIBILITY (1.0) or not (0.0).

**Reference values:**
- BlueEdge: FULL_REPRODUCIBILITY, 5 criteria PASS (1.0)
- FastAPI: absent (0.0)

**Enrichment pathway:** Produce reproducibility_verdict through enriched semantic pipeline run.

---

### D6: Business Label Coverage

**Definition:** The ratio of semantic domains carrying business-meaningful labels versus structural-only identifiers.

**Measurement:**
```
business_label_coverage = domains_with_business_labels / total_domains
```

A domain has a business label if its `domain_name` is a human-meaningful business term (not a structural ID like `CLU-XX`).

**Scale:** 0.0 to 1.0

**Reference values:**
- BlueEdge: 17/17 = 1.0 (all domains have business-meaningful names)
- FastAPI: 0/9 = 0.0 (all domains carry structural IDs only, STRUCTURAL_LABELS_ONLY)

**Enrichment pathway:** Provide source material with business vocabulary (capability models, domain glossaries, architecture decision records) that enables business label assignment during semantic pipeline re-processing.

---

### D7: Rendering Metadata

**Definition:** Whether a replay-safe rendering metadata artifact exists with enforced integrity protection.

**Measurement:**
```
rendering_metadata = rendering_metadata.integrity_protection_status
```

**Scale:** ENFORCED (1.0), PLACEHOLDER (0.5), ABSENT (0.0)

**Reference values:**
- BlueEdge: ENFORCED with sha256 self-hash (1.0)
- FastAPI: absent (0.0) — emit_rendering_metadata fails with SOURCE_ARTIFACT_MISSING

**Enrichment pathway:** Once decision_validation and crosswalk artifacts are present, rendering_metadata can be emitted by the vault writer.

---

## 4. Composite maturity score

### Formula

```
maturity_score = (
    w1 * D1_artifact_completeness +
    w2 * D2_domain_grounding +
    w3 * D3_semantic_continuity +
    w4 * D4_decision_validation +
    w5 * D5_reproducibility +
    w6 * D6_business_label_coverage +
    w7 * D7_rendering_metadata
)
```

### Default weights

| Dimension | Weight | Rationale |
|-----------|--------|-----------|
| D1 (artifact completeness) | 0.20 | Foundational — without artifacts, nothing else is measurable |
| D2 (domain grounding) | 0.25 | Core differentiator between S2 and S3 |
| D3 (semantic continuity) | 0.15 | Binary gate — either validated or not |
| D4 (decision validation) | 0.10 | Quality assurance dimension |
| D5 (reproducibility) | 0.10 | Governance assurance dimension |
| D6 (business label coverage) | 0.10 | Semantic richness indicator |
| D7 (rendering metadata) | 0.10 | Projection readiness indicator |

Weights sum to 1.0.

### Weight governance

Weights are governance parameters, not tuning knobs. Weight changes require an explicit governance amendment with documented rationale. Weights must never be client-specific — the same weights apply to all substrates.

### Reference composite scores

| Client | D1 | D2 | D3 | D4 | D5 | D6 | D7 | Composite |
|--------|----|----|----|----|----|----|----|----|
| BlueEdge | 1.0 | 0.27 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.82 |
| FastAPI | 0.5 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.10 |

---

## 5. Semantic continuity scoring

Semantic continuity is not a simple binary at the detailed level. While D3 captures the overall validation status, continuity has sub-dimensions:

### C1: Entity Coverage

```
entity_coverage = crosswalk_entities / total_topology_nodes
```

How many structural topology nodes have corresponding crosswalk entries.

### C2: Label Fidelity

```
label_fidelity = entities_with_business_labels / crosswalk_entities
```

How many crosswalk entities carry business-meaningful labels versus structural IDs.

### C3: Lineage Strength

```
lineage_strength = (exact_count * 1.0 + strong_count * 0.75 + weak_count * 0.25) / total_domains
```

Weighted measure of how strongly semantic domains are structurally backed.

### Continuity composite

```
continuity_score = (C1 + C2 + C3) / 3.0
```

The continuity composite provides finer-grained visibility into semantic continuity quality beyond the binary VALIDATED/NOT_VALIDATED gate.

### Reference continuity scores

| Client | C1 | C2 | C3 | Composite |
|--------|----|----|----|----|
| BlueEdge | 13/29 ≈ 0.45 | 9/13 ≈ 0.69 | (4*1.0 + 1*0.75)/17 ≈ 0.28 | 0.47 |
| FastAPI | 0.0 | 0.0 | 0.0 | 0.0 |

---

## 6. Semantic gravity estimation

Semantic gravity describes the self-reinforcing property of semantic richness: richer substrates produce cross-validating artifacts that compound semantic maturity.

### Gravity indicators

| Indicator | Evidence | Gravity effect |
|-----------|----------|----------------|
| Business labels present | domain_name is business-meaningful | Enables crosswalk label fidelity (C2) |
| Structural grounding present | lineage_status is EXACT or STRONG | Enables Q-01/Q-02 resolution |
| Decision validation complete | 14/14 PASS | Enables rendering metadata emission |
| Crosswalk validated | semantic_continuity_status = VALIDATED | Enables full Q-class resolution |
| Reproducibility verified | FULL_REPRODUCIBILITY | Enables governed re-processing |

### Gravity coefficient

```
gravity = active_gravity_indicators / total_gravity_indicators
```

**Scale:** 0.0 to 1.0

A gravity coefficient above 0.6 indicates that the substrate has entered the self-reinforcing zone where each additional enrichment has compound effects on maturity scoring.

### Reference gravity

| Client | Active indicators | Gravity |
|--------|-------------------|---------|
| BlueEdge | 5/5 | 1.0 (full gravity — all indicators active) |
| FastAPI | 0/5 | 0.0 (no gravity — no cross-validation possible) |

### Gravity as onboarding signal

The gravity coefficient serves as an early indicator of onboarding trajectory:
- **0.0:** Cold start. Each enrichment step must be taken independently. No cross-validation benefit.
- **0.2-0.4:** Early traction. Some artifacts present but not yet cross-validating.
- **0.6-0.8:** Compound zone. Each new artifact cross-validates existing ones. Maturity acceleration.
- **1.0:** Full gravity. All cross-validation channels active. Maturity gains are maximally compounded.

---

## 7. Maturity and S-state relationship

The maturity model is an operational tool for tracking progression. S-states are governance classifications. The relationship is informational, not definitional:

| S-state | Typical maturity range | Governing criterion |
|---------|----------------------|---------------------|
| S0 | 0.0 – 0.05 | No semantic topology model |
| S1 | 0.05 – 0.30 | Semantic topology present but required artifacts missing |
| S2 | 0.30 – 0.85 | All required artifacts present, partial grounding |
| S3 | 0.85 – 1.0 | All domains structurally grounded |
| S4+ | > 1.0 (extended) | Multi-signal-class extensions active |

**S-state is determined by the state detection algorithm (QUALIFICATION_STATE_MACHINE.md §3), not by maturity score thresholds.** The maturity score does not override S-state classification. It provides operational visibility into progression within and between S-states.

---

## 8. Artifact specification

The maturity score artifact MUST follow this schema:

```json
{
  "schema_version": "1.0",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "s_state": "S0 | S1 | S2 | S3 | S4+",
  "dimensions": {
    "artifact_completeness": { "score": 0.0, "present": 0, "required": 6 },
    "domain_grounding": { "score": 0.0, "backed": 0, "total": 0 },
    "semantic_continuity": { "score": 0.0, "status": "NOT_VALIDATED" },
    "decision_validation": { "score": 0.0, "passed": 0, "total": 0 },
    "reproducibility": { "score": 0.0, "verdict": "ABSENT" },
    "business_label_coverage": { "score": 0.0, "labeled": 0, "total": 0 },
    "rendering_metadata": { "score": 0.0, "status": "ABSENT" }
  },
  "continuity_detail": {
    "entity_coverage": 0.0,
    "label_fidelity": 0.0,
    "lineage_strength": 0.0,
    "composite": 0.0
  },
  "gravity": {
    "coefficient": 0.0,
    "active_indicators": [],
    "inactive_indicators": []
  },
  "composite_score": 0.0,
  "weights_version": "1.0",
  "provenance": {
    "source_manifest": "<manifest_path>",
    "source_commit": "<commit_hash>",
    "detection_algorithm_version": "1.0"
  }
}
```

**Persistence:** Written to `artifacts/sqo/<client>/<run_id>/maturity_score.json`. Additive-only. Prior versions retained.

---

## 9. Governance constraints

1. Maturity scores must be deterministic from artifact evidence. No stochastic components.
2. Weight changes require governance amendment. No runtime weight tuning.
3. Maturity scores must not be fabricated for clients without artifacts. Missing artifacts → 0.0 for that dimension.
4. The composite score must not be used as a projection authorization gate. S-state and Q-class govern projection. Maturity is operational visibility.
5. Maturity scores must carry provenance linkage to the source manifest and commit hash.
6. No client-specific scoring logic. The same model applies to all substrates.
