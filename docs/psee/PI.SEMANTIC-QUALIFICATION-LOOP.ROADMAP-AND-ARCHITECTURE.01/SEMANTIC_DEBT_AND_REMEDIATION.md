# Semantic Debt and Remediation

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines the semantic debt model — how the SQO qualification lifecycle identifies, classifies, tracks, and remedies gaps in semantic maturity. Semantic debt is the measurable distance between a client's current semantic state and its achievable semantic potential, given the right source material and enrichment.

Semantic debt is NOT technical debt. It does not describe code quality, architecture deficiency, or implementation shortcuts. It describes the gap between structural truth (Lane A) and semantic maturity (SQO qualification).

---

## 2. Debt taxonomy

### Category 1: Missing Artifact Debt

**Definition:** Required semantic artifacts that are absent from disk.

**Detection:** Artifact loader returns `REQUIRED_ARTIFACT_MISSING` for one or more required artifact keys.

**Impact:** Blocks S-state progression. S1 cannot transition to S2 without all 6 required artifacts.

**Reference case:** FastAPI is missing decision_validation, reproducibility_verdict, and semantic_continuity_crosswalk — 3 units of Missing Artifact Debt.

**Remediation:** Run enriched semantic pipeline to produce missing artifacts.

**Severity:** CRITICAL — blocks projection authorization.

---

### Category 2: Grounding Gap Debt

**Definition:** Semantic domains that lack structural backing (lineage_status = NONE or WEAK).

**Detection:** `backed_count < total_count` in the semantic topology model.

**Impact:** Prevents Q-01 (FULL_GROUNDING). Keeps the client at Q-02 or Q-03.

**Reference case:** BlueEdge has 12-13 ungrounded domains out of 17 total — 12-13 units of Grounding Gap Debt.

**Remediation:** Provide source material that maps structural topology nodes to semantic domains. Re-run semantic pipeline with enriched inputs.

**Severity:** HIGH — affects Q-class but does not block projection (Q-02 permits projection with qualification).

---

### Category 3: Continuity Gap Debt

**Definition:** Missing or incomplete semantic continuity crosswalk entries.

**Detection:** Crosswalk entities < structural topology nodes, or crosswalk entities lack business labels.

**Impact:** Reduces semantic continuity quality. High continuity gap debt may invalidate crosswalk status.

**Reference case:** BlueEdge crosswalk has 13 entities for 29 topology nodes — entity coverage of 0.45. 4 entities lack business labels.

**Remediation:** Provide domain glossaries and capability models that enable richer crosswalk production.

**Severity:** MEDIUM — affects maturity score but may not block S-state if crosswalk is overall VALIDATED.

---

### Category 4: Label Debt

**Definition:** Semantic domains carrying structural identifiers (CLU-XX) instead of business-meaningful labels.

**Detection:** domain_name matches structural ID pattern (e.g., CLU-03) AND `semantic_level` = STRUCTURAL_LABELS_ONLY.

**Impact:** Prevents business-meaningful executive projection. Executives see cluster IDs instead of business concepts.

**Reference case:** FastAPI — all 9 domains carry structural IDs (CLU-01 through CLU-09) with `inference_prohibition: true`.

**Remediation:** Provide business vocabulary documentation (capability models, domain glossaries) that enables business label assignment during pipeline re-processing.

**Severity:** MEDIUM — affects semantic richness and executive comprehension but does not independently block S-state progression.

---

### Category 5: Validation Debt

**Definition:** Decision validation checks that do not pass, or validation artifact absent.

**Detection:** decision_validation absent, or decision_validation.overall_status = FAIL, or individual VF-XX checks = FAIL.

**Impact:** Prevents rendering metadata emission. May affect S-state if decision_validation is a required artifact.

**Reference case:** FastAPI — decision_validation absent entirely.

**Remediation:** Re-run semantic pipeline with enriched inputs to produce passing decision validation.

**Severity:** HIGH — blocks rendering metadata and full qualification.

---

### Category 6: Reproducibility Debt

**Definition:** Reproducibility verdict absent or not FULL_REPRODUCIBILITY.

**Detection:** reproducibility_verdict absent, or overall_verdict != FULL_REPRODUCIBILITY.

**Impact:** Governance assurance gap. Cannot certify that semantic derivation is fully reproducible.

**Reference case:** FastAPI — reproducibility_verdict absent entirely.

**Remediation:** Re-run semantic pipeline. Reproducibility verdict requires all reproducibility criteria to pass.

**Severity:** MEDIUM-HIGH — governance assurance gap that affects certification.

---

### Category 7: Rendering Metadata Debt

**Definition:** Rendering metadata absent or integrity protection not ENFORCED.

**Detection:** rendering_metadata absent from vault, or integrity_protection_status != ENFORCED.

**Impact:** IP status degraded. Projection permitted but without full integrity assurance.

**Reference case:** FastAPI — rendering_metadata absent (emit_rendering_metadata fails with SOURCE_ARTIFACT_MISSING because decision_validation is absent).

**Remediation:** Resolve upstream debt (Missing Artifact Debt for decision_validation) first, then emit rendering_metadata via vault writer.

**Severity:** MEDIUM — affects integrity assurance but not necessarily projection authorization.

---

## 3. Debt inventory artifact

The SQO semantic debt inventory is a structured artifact:

```json
{
  "schema_version": "1.0",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "s_state": "S0 | S1 | S2 | S3",
  "total_debt_items": 0,
  "debt_items": [
    {
      "id": "DEBT-<category>-<sequence>",
      "category": "missing_artifact | grounding_gap | continuity_gap | label | validation | reproducibility | rendering_metadata",
      "severity": "CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM",
      "description": "<specific gap description>",
      "evidence": {
        "artifact_key": "<artifact_key>",
        "field_path": "<specific.field.path>",
        "current_value": "<current state>",
        "required_value": "<required for resolution>"
      },
      "blocks_s_state": "S2 | S3 | none",
      "remediation": {
        "action": "<specific remediation action>",
        "source_material_needed": "<what the client must provide>",
        "enrichment_pathway": "<reference to documented pathway>",
        "expected_impact": {
          "maturity_dimensions": ["D1", "D2"],
          "s_state_progression": "S1→S2 | S2→S3 | none"
        }
      },
      "priority": 1
    }
  ],
  "summary": {
    "critical_count": 0,
    "high_count": 0,
    "medium_high_count": 0,
    "medium_count": 0,
    "s_state_blocking_count": 0
  },
  "provenance": {
    "source_manifest": "<manifest_path>",
    "source_commit": "<commit_hash>"
  }
}
```

**Persistence:** Written to `artifacts/sqo/<client>/<run_id>/semantic_debt_inventory.json`. Additive-only.

---

## 4. Priority model

Debt items are prioritized by a deterministic scoring function:

```
priority_score = severity_weight * impact_multiplier * dependency_modifier

where:
  severity_weight:
    CRITICAL    = 4
    HIGH        = 3
    MEDIUM-HIGH = 2
    MEDIUM      = 1

  impact_multiplier:
    blocks S-state progression = 2.0
    affects Q-class            = 1.5
    affects maturity only      = 1.0

  dependency_modifier:
    no upstream dependencies   = 1.0
    has upstream dependencies  = 0.5 (resolve upstream first)
```

Higher priority_score = higher priority.

The priority model is deterministic. Same debt inventory → same priority ordering.

---

## 5. Remediation pathways

### Pathway R1: Source Material Enrichment

**Resolves:** Label Debt, Grounding Gap Debt, Continuity Gap Debt

**Process:**
1. Client provides additional source material (ADRs, capability models, domain glossaries, ownership documentation)
2. Semantic pipeline re-processes with enriched inputs
3. New semantic artifacts produced with business labels, improved lineage, richer crosswalk
4. SQO re-assesses maturity and debt

**Governance:** Source material must be authentic client documentation. No AI-generated source material accepted. Pipeline re-run must comply with pipeline_execution_manifest.json.

---

### Pathway R2: Semantic Pipeline Re-Run

**Resolves:** Missing Artifact Debt, Validation Debt, Reproducibility Debt

**Process:**
1. Verify source material is sufficient for the target artifacts
2. Re-run semantic bundle producer
3. Produce missing artifacts (decision_validation, reproducibility_verdict, semantic_continuity_crosswalk)
4. Emit rendering_metadata via vault writer
5. SQO re-assesses state and debt

**Governance:** Pipeline re-run must comply with pipeline_execution_manifest.json. No pipeline modifications. No threshold changes.

---

### Pathway R3: Rendering Metadata Emission

**Resolves:** Rendering Metadata Debt

**Process:**
1. Verify upstream dependencies resolved (decision_validation, crosswalk present)
2. Run emit_rendering_metadata vault writer
3. Verify integrity_protection_status = ENFORCED
4. SQO re-assesses rendering readiness

**Governance:** Vault writer must not be modified. Emission is a governed operation. Rendering metadata carries self-hash for integrity verification.

---

### Pathway R4: Structural Grounding Extension

**Resolves:** Grounding Gap Debt (for S2→S3 progression)

**Process:**
1. Identify ungrounded domains and their structural topology correspondences
2. Client provides evidence mapping each domain to structural components
3. Re-run semantic pipeline with evidence-enriched inputs
4. Verify backed_count == total_count for all domains
5. Q-class resolves to Q-01 automatically

**Governance:** Grounding must be evidence-based (EXACT or STRONG lineage). No AI-inferred grounding. No synthetic structural correspondence.

---

## 6. Missing continuity detection

### Detection model

Missing continuity is detected by comparing the semantic topology model against the structural topology:

| Signal | Detection method | Indicates |
|--------|-----------------|-----------|
| Crosswalk absent | semantic_continuity_crosswalk not present on disk | No continuity assessment possible |
| Crosswalk entity gap | crosswalk_entities < topology_nodes | Structural nodes without semantic mapping |
| Label gap | crosswalk entities with structural IDs only | Semantic mapping without business meaning |
| Lineage absence | all domains have lineage_status = NONE | No structural grounding chain |
| Validation absence | decision_validation absent | No quality assurance on semantic derivation |

### Continuity gap artifact

```json
{
  "schema_version": "1.0",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "gaps": [
    {
      "gap_type": "entity_coverage | label_fidelity | lineage | validation",
      "description": "<specific gap>",
      "structural_reference": "<topology node or domain>",
      "semantic_reference": "<crosswalk entity or domain>",
      "severity": "CRITICAL | HIGH | MEDIUM",
      "remediation_pathway": "R1 | R2 | R3 | R4"
    }
  ],
  "coverage_ratio": 0.0,
  "label_fidelity_ratio": 0.0,
  "lineage_strength": 0.0
}
```

**Persistence:** Written to `artifacts/sqo/<client>/<run_id>/continuity_assessment.json`. Additive-only.

---

## 7. Reference debt profiles

### BlueEdge (S2, Q-02)

| Category | Count | Severity | Key items |
|----------|-------|----------|-----------|
| Missing Artifact | 0 | — | All 6 required artifacts present |
| Grounding Gap | 12-13 | HIGH | 12-13 domains with lineage_status != EXACT/STRONG |
| Continuity Gap | 16 | MEDIUM | 29 topology nodes - 13 crosswalk entities = 16 unmapped |
| Label | 0 | — | All 17 domains have business labels |
| Validation | 0 | — | 14/14 PASS |
| Reproducibility | 0 | — | FULL_REPRODUCIBILITY |
| Rendering Metadata | 0 | — | ENFORCED with sha256 |
| **Total** | **28-29** | | **S2→S3 requires resolving Grounding Gap debt** |

### FastAPI (S1, effectively Q-04)

| Category | Count | Severity | Key items |
|----------|-------|----------|-----------|
| Missing Artifact | 3 | CRITICAL | decision_validation, reproducibility_verdict, crosswalk |
| Grounding Gap | 9 | HIGH | 0/9 domains grounded |
| Continuity Gap | N/A | CRITICAL | Crosswalk absent entirely |
| Label | 9 | MEDIUM | All 9 domains carry CLU-XX structural IDs |
| Validation | 1 | HIGH | decision_validation absent |
| Reproducibility | 1 | MEDIUM-HIGH | reproducibility_verdict absent |
| Rendering Metadata | 1 | MEDIUM | Cannot emit (upstream dependency) |
| **Total** | **24** | | **S1→S2 requires resolving Missing Artifact debt first** |

---

## 8. Governance constraints

1. Semantic debt assessments must be deterministic from artifact evidence. No speculative debt items.
2. All debt items must reference specific artifacts and field paths. No "general" or "overall" debt.
3. Remediation pathways must reference documented enrichment pathways. No invented remediation.
4. Priority scoring must use the documented priority model. No ad-hoc prioritization.
5. Debt inventories are additive-only. Prior inventories retained for progression tracking.
6. No debt fabrication to create urgency. Only genuine gaps qualify as debt.
7. No debt suppression to present a favorable view. All gaps must be disclosed.
8. Debt items must carry provenance linkage to the source evidence that revealed the gap.
