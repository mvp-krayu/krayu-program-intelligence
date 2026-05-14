# SQO Cockpit Object Model

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Object 1: Qualification Case

**Fields:**
- `client`: client identifier
- `run_id`: run identifier
- `s_state`: current S-state (S0/S1/S2/S3)
- `s_state_label`: canonical label
- `authorization_tier`: NOT_AUTHORIZED / AUTHORIZED_WITH_QUALIFICATION / AUTHORIZED
- `boardroom_readiness`: REPORT_PACK_ONLY / NOT_READY / BOARDROOM_QUALIFIED / BOARDROOM_READY
- `overall_maturity_score`: 0.0-1.0
- `overall_maturity_classification`: LOW / PARTIAL / STABLE / STRONG
- `total_debt_items`: integer
- `blocking_debt_count`: integer
- `progression_target`: next S-state
- `progression_readiness`: 0.0-1.0

**Source artifact mapping:**
- `qualification_state.v1.json` → s_state, authorization, boardroom
- `semantic_maturity_profile.v1.json` → maturity score/classification
- `semantic_debt_inventory.v1.json` → debt counts
- `progression_readiness.v1.json` → target, readiness

**Lifecycle:** Created on first SQO assessment. Updated on each re-assessment. Never deleted.

**Allowed actions:** inspect, export, compare snapshots

**Forbidden actions:** edit, override, fabricate

**Governance status:** Read-only from SQO artifacts.

---

## Object 2: Semantic Debt Item

**Fields:**
- `id`: DEBT-<CATEGORY>-<SEQ>
- `category`: missing_artifact / grounding_gap / continuity_gap / label / validation / reproducibility / rendering_metadata
- `severity`: CRITICAL / HIGH / MEDIUM-HIGH / MEDIUM
- `description`: specific gap description
- `evidence.artifact_key`: source artifact
- `evidence.field_path`: specific field
- `evidence.current_value`: current state
- `evidence.required_value`: required for resolution
- `blocks_s_state`: S2 / S3 / none
- `remediation.action`: specific action
- `remediation.source_material_needed`: what client provides
- `remediation.enrichment_pathway`: R1 / R2 / R3 / R4
- `remediation.expected_impact.maturity_dimensions`: affected D1-D8
- `priority_score`: float
- `priority`: integer rank

**Source artifact mapping:** `semantic_debt_inventory.v1.json` → debt_items[]

**Lifecycle:** Created by debt detection engine. Resolved when enrichment produces passing evidence. Historical items retained.

**Allowed actions:** inspect, filter, sort, export

**Forbidden actions:** edit, delete, suppress, re-prioritize manually

**Governance status:** Deterministic from artifact evidence. Priority from documented model.

---

## Object 3: Continuity Gap

**Fields:**
- `gap_type`: entity_coverage / label_fidelity / lineage / validation
- `description`: specific gap
- `structural_reference`: topology node or domain
- `semantic_reference`: crosswalk entity or domain
- `severity`: CRITICAL / HIGH / MEDIUM
- `remediation_pathway`: R1 / R2 / R3 / R4

**Source artifact mapping:** `continuity_assessment.v1.json` → gaps[]

**Lifecycle:** Created by continuity assessment engine. Resolved when enrichment closes the gap.

**Allowed actions:** inspect, filter

**Forbidden actions:** edit, fabricate, suppress

**Governance status:** Evidence-linked to specific structural/semantic references.

---

## Object 4: Maturity Dimension

**Fields:**
- `id`: D1-D8
- `label`: STRUCTURAL_CONTINUITY / SEMANTIC_GROUNDING / LINEAGE_STRENGTH / REPRODUCIBILITY / GOVERNANCE_COMPLETENESS / PROJECTION_READINESS / SEMANTIC_COHERENCE / ENRICHMENT_READINESS
- `score`: 0.0-1.0
- `classification`: LOW / PARTIAL / STABLE / STRONG
- `formula_inputs`: dimension-specific input values
- `contributing_factors`: what drives this score
- `improvement_pathway`: which enrichment pathway improves this dimension

**Source artifact mapping:**
- `semantic_maturity_profile.v1.json` → dimensions.<id>
- `maturity_dimension_breakdown.v1.json` → per-dimension detail

**Lifecycle:** Computed on each maturity scoring run. Historical values retained if maturation history exists.

**Allowed actions:** inspect, drill-down, compare across runs

**Forbidden actions:** edit scores, override classification

**Governance status:** Deterministic from documented formulas.

---

## Object 5: Remediation Pathway

**Fields:**
- `pathway_id`: R1 / R2 / R3 / R4
- `name`: Source Material Enrichment / Semantic Pipeline Re-Run / Rendering Metadata Emission / Structural Grounding Extension
- `resolves_categories`: which debt categories
- `source_material_needed`: what the client must provide
- `process_steps`: ordered steps
- `governance_constraints`: what rules apply
- `affected_debt_items`: list of debt item IDs resolved by this pathway
- `affected_dimensions`: which D1-D8 improve

**Source artifact mapping:**
- `semantic_debt_inventory.v1.json` → debt_items[].remediation.enrichment_pathway
- Pathway definitions from SEMANTIC_DEBT_AND_REMEDIATION.md

**Lifecycle:** Static pathway definitions. Instantiated per client when debt items reference them.

**Allowed actions:** inspect, prepare checklist

**Forbidden actions:** modify pathway definition, invent pathways

**Governance status:** Pathway definitions are governance-controlled.

---

## Object 6: Source Material Requirement

**Fields:**
- `requirement_id`: auto-generated
- `material_type`: ADR / capability_model / domain_glossary / ownership_documentation
- `description`: what is needed and why
- `linked_debt_items`: which debt items this resolves
- `linked_pathway`: R1 / R2 / R3 / R4
- `status`: IDENTIFIED / REQUESTED / RECEIVED / PROCESSED
- `expected_impact`: which dimensions improve

**Source artifact mapping:**
- Derived from `semantic_debt_inventory.v1.json` → debt_items[].remediation.source_material_needed
- Status tracking is a cockpit-level action artifact (additive-only)

**Lifecycle:** Created when debt analysis identifies source material gaps. Status progresses through intake workflow.

**Allowed actions:** inspect, mark as requested, mark as received

**Forbidden actions:** fabricate material, auto-generate content, modify artifact data

**Governance status:** Advisory tracking. No authority over artifacts.

---

## Object 7: Evidence Chain

**Fields:**
- `chain_id`: auto-generated
- `source_artifact`: artifact key
- `source_field`: field path
- `derived_metric`: what was computed
- `qualification_impact`: how it affects S-state/maturity
- `input_hash`: sha256 of source artifact
- `source_commit`: git commit hash

**Source artifact mapping:**
- Provenance fields across all SQO artifacts
- `maturity_dimension_breakdown.v1.json` → formula inputs

**Lifecycle:** Created on each SQO assessment. Immutable.

**Allowed actions:** inspect, verify input hashes

**Forbidden actions:** modify, fabricate

**Governance status:** Provenance chain must be complete and auditable.

---

## Object 8: Replay Certification

**Fields:**
- `certification_type`: qualification_state / semantic_debt / maturity_scoring
- `checks`: array of { check_name, status: PASS/FAIL, details }
- `overall_verdict`: CERTIFIED / NOT_CERTIFIED
- `timestamp`: ISO-8601
- `input_hashes`: per-artifact hashes at certification time

**Source artifact mapping:**
- `qualification_state_replay_verification.v1.json`
- `debt_replay_verification.v1.json`
- `maturity_replay_verification.v1.json`
- `*_certification.v1.json`

**Lifecycle:** Created on each replay verification run. Historical certifications retained.

**Allowed actions:** inspect, verify

**Forbidden actions:** modify verdicts, suppress failures

**Governance status:** Certification is binary. No partial certification.

---

## Object 9: Progression Step

**Fields:**
- `current_s_state`: S0/S1/S2/S3
- `target_s_state`: next S-state
- `readiness_score`: 0.0-1.0
- `blocking_debt_count`: integer
- `blocking_debts`: array of debt item references
- `required_pathways`: which R-pathways needed
- `success_criteria`: what must be true to reach target

**Source artifact mapping:** `progression_readiness.v1.json`

**Lifecycle:** Updated on each assessment. Previous progression steps in history.

**Allowed actions:** inspect, export, plan

**Forbidden actions:** override readiness, skip steps

**Governance status:** Progression is deterministic from debt resolution.

---

## Object 10: PATH B Handoff Package

**Fields:**
- `client`: client identifier
- `run_id`: run identifier
- `s_state`: current S-state (minimum S2)
- `qualification_evidence`: qualification_state + maturity_profile + certifications
- `replay_verification_status`: all PASS required
- `governance_certification`: all CERTIFIED required
- `handoff_readiness`: READY / BLOCKED
- `blocking_conditions`: array of blockers (if any)
- `audit_trail`: provenance summary

**Source artifact mapping:** Composed from multiple SQO artifacts.

**Lifecycle:** Created when operator initiates handoff preparation. Validated against minimum criteria. Submitted to PATH B.

**Allowed actions:** prepare, validate, export

**Forbidden actions:** force handoff, bypass certification, emit directly to LENS

**Governance status:** Handoff requires all certifications and replay verifications passing. No override.
