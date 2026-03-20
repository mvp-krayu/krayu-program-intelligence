# PIOS-40.3-RUN02-CONTRACT-v3

**Stream:** 40.3 — PiOS Reverse Engineering
**Run ID:** run_02_blueedge
**Contract version:** v3
**Issue date:** 2026-03-19
**Subject:** BlueEdge Fleet Management Platform v3.23.0

---

## Contract Identity

| Field | Value |
|-------|-------|
| contract_id | PIOS-40.3-RUN02-CONTRACT-v3 |
| run_id | run_02_blueedge |
| stream | Stream 40.3 — PiOS Reverse Engineering |
| upstream_contract | PIOS-40.2-RUN02-CONTRACT-v2 |
| execution_date | 2026-03-19 |
| governing_model | PERM (Program Execution Reconstruction Model) |

---

## Input Boundary

Mandatory inputs consumed from Stream 40.2 (PIOS-40.2-RUN02-CONTRACT-v2):

| Input artifact | Path |
|---------------|------|
| evidence_surface_inventory.md | docs/pios/40.2/evidence_surface_inventory.md |
| evidence_classification_map.md | docs/pios/40.2/evidence_classification_map.md |
| normalized_evidence_map.md | docs/pios/40.2/normalized_evidence_map.md |
| intake_validation_log.md | docs/pios/40.2/intake_validation_log.md |
| evidence_boundary.md | docs/pios/runs/run_02_blueedge/evidence_boundary.md |

Evidence read under this contract was drawn exclusively from the CEU (Canonical Evidence Unit) identifiers established in 40.2. Primary reads: CEU-08, CEU-09, CEU-10.

---

## Strict Exclusions

The following paths must not be accessed. Access constitutes a hard fail:

| Excluded path | Reason |
|--------------|--------|
| docs/reverse_engineering/ | Prior analytical outputs — not evidence |
| docs/program-charter/ | Prior analytical outputs — not evidence |
| docs/execution-telemetry/ | Prior analytical outputs — not evidence |
| docs/signal-layer/ | Prior analytical outputs — not evidence |
| docs/case-study/ | Prior analytical outputs — not evidence |
| weekly/ | Prior analytical outputs — not evidence |
| source-v3.23/raw/ | Provenance archive only — existence confirmed in 40.2 |

---

## Carry-Forward Requirements from 40.2

| Declaration | Source | Required in 40.3 |
|-------------|--------|-----------------|
| OVL-01 — backend standalone ↔ platform backend | normalized_evidence_map.md | YES — all canonical outputs |
| OVL-02 — frontend standalone ↔ platform frontend | normalized_evidence_map.md | YES — all canonical outputs |
| US-01 — backend file-level parity unknown | normalized_evidence_map.md | YES — entity_catalog.md |
| US-02 — frontend file-level parity unknown | normalized_evidence_map.md | YES — entity_catalog.md |
| US-03 — platform-only files unknown | normalized_evidence_map.md | YES — entity_catalog.md |

---

## Mandatory Canonical Output Artifacts

| Artifact | Path | Required |
|----------|------|----------|
| entity_catalog.md | docs/pios/40.3/entity_catalog.md | YES |
| dependency_map.md | docs/pios/40.3/dependency_map.md | YES |
| interface_map.md | docs/pios/40.3/interface_map.md | YES |
| program_execution_graph.md | docs/pios/40.3/program_execution_graph.md | YES |
| structural_traceability_map.md | docs/pios/40.3/structural_traceability_map.md | YES |
| reconstruction_validation_log.md | docs/pios/40.3/reconstruction_validation_log.md | YES |

---

## Script Artifacts

| Script | Path | Purpose |
|--------|------|---------|
| extract_perm_entities.py | scripts/pios/40.3/extract_perm_entities.py | Verifies entity catalog completeness |
| validate_reconstruction.py | scripts/pios/40.3/validate_reconstruction.py | Validates all 6 canonical artifacts against contract |

---

## Constraints and Prohibitions

This contract prohibits the following operations within 40.3 execution scope:

- No telemetry extraction — telemetry is a 40.4 concern
- No signal computation — signals are a 40.5+ concern
- No diagnosis or intelligence synthesis — diagnosis is a post-reconstruction concern
- No use of prior BlueEdge reverse engineering outputs as evidence
- No reading of excluded analytical output paths
- No suppression of overlap declarations (OVL-01, OVL-02)
- No suppression of unknown-space positions
- No architecture claims without direct evidence reference
- No replacement of canonical outputs by renamed artifacts
- Canonical PERM artifact structure must be preserved

All prohibited operations declarations listed above are boundary constraints — not evidence of violation.

---

## Output Requirements

| Requirement | Threshold |
|-------------|-----------|
| Entity catalog completeness | All major tiers present (CE, SA, INF, BM, FE, DS) |
| BM entity count | >= 65 |
| Interface coverage | INT-001 through INT-008 |
| PEG execution paths | EP-01 through EP-08 minimum |
| Traceability coverage | 100% of produced structure traceable |
| Unknown-space handling | All gaps explicitly declared, none suppressed |
| Reconstruction completeness | COMPLETE or PARTIAL — not INCOMPLETE |

---

## Completion Criteria

Stream 40.3 is declared complete when:
1. All 6 mandatory canonical output artifacts are produced
2. validate_reconstruction.py produces 12/12 PASS
3. extract_perm_entities.py produces 9/9 PASS
4. reconstruction_completeness declared as COMPLETE or PARTIAL
5. PIOS-40.3-RUN02.execution.md execution receipt produced

---

## Governance Alignment

| Principle | Application |
|-----------|------------|
| GC-06 Evidence-First | No value fabricated or inferred; missing evidence propagates as PARTIAL |
| GC-07 State–Diagnosis Separation | Reconstruction is structural state only — no diagnosis performed |
| GC-08 PERM | Canonical entity/dependency/interface/PEG/traceability structure enforced |
| Validation Immutability Rule | Validators read-only after stream completion; pre-completion amendments permitted |
| Unknown-Space Preservation | Overlaps and unknowns declared explicitly — never filled by inference |
