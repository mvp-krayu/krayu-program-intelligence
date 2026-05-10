# Remediation Pathway Report

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Pathway definitions

### R1 — Source Material Enrichment

**Resolves:** Label Debt, Grounding Gap Debt, Continuity Gap Debt

**Process:** Client provides additional source material (ADRs, capability models, domain glossaries). Semantic pipeline re-processes with enriched inputs. New semantic artifacts produced with business labels, improved lineage, richer crosswalk.

**Governance:** Source material must be authentic client documentation. No AI-generated source material accepted.

### R2 — Semantic Pipeline Re-Run

**Resolves:** Missing Artifact Debt, Validation Debt, Reproducibility Debt

**Process:** Verify source material sufficiency, re-run semantic bundle producer to produce missing or corrected artifacts.

**Governance:** Pipeline re-run must comply with pipeline_execution_manifest.json. No pipeline modifications.

### R3 — Rendering Metadata Emission

**Resolves:** Rendering Metadata Debt

**Process:** Verify upstream dependencies resolved (decision_validation, crosswalk present), run emit_rendering_metadata vault writer. Verify integrity_protection_status = ENFORCED.

**Governance:** Vault writer must not be modified. Rendering metadata carries self-hash for integrity verification.

### R4 — Structural Grounding Extension

**Resolves:** Grounding Gap Debt (for S2→S3 progression)

**Process:** Client provides evidence mapping each domain to structural components. Re-run semantic pipeline with evidence-enriched inputs. Verify backed_count == total_count.

**Governance:** Grounding must be evidence-based (EXACT or STRONG lineage). No AI-inferred grounding.

---

## 2. Category-to-pathway mapping

| Category | Primary pathway | Expected S-state impact |
|----------|----------------|------------------------|
| missing_artifact | R2 | S1→S2 |
| grounding_gap | R4 | S2→S3 |
| continuity_gap | R1 | maturity improvement |
| label | R1 | maturity improvement |
| validation | R2 | S1→S2 (if blocking) |
| reproducibility | R2 | governance assurance |
| rendering_metadata | R3 | IP status improvement |

---

## 3. BlueEdge remediation recommendations

| Priority | Debt | Pathway | Impact |
|----------|------|---------|--------|
| 1 | 13 grounding gap items | R4 | S2→S3 (requires all 13 domains grounded) |
| 2 | 2 continuity gap items | R1 | Maturity improvement (coverage + label fidelity) |

BlueEdge primary path: R4 (Structural Grounding Extension) to achieve Q-01/S3.

---

## 4. FastAPI remediation recommendations

| Priority | Debt | Pathway | Impact |
|----------|------|---------|--------|
| 1 | 3 missing artifacts | R2 | S1→S2 |
| 2 | 9 grounding gaps | R4 | S2→S3 (after S2 achieved) |
| 3 | 1 validation | R2 | Resolved by artifact re-production |
| 4 | 1 reproducibility | R2 | Resolved by artifact re-production |
| 5 | 9 label debts | R1 | Maturity improvement |
| 6 | 1 continuity gap | R2 (produce crosswalk) | Enables continuity assessment |
| 7 | 1 rendering metadata | R3 (after upstream) | IP status improvement |

FastAPI primary path: R2 (Semantic Pipeline Re-Run) to produce missing artifacts and achieve S2.
