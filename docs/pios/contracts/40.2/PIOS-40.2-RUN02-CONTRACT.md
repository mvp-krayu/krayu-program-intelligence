# PIOS-40.2-RUN02-CONTRACT
Stream 40.2 — PiOS Evidence Connectors Layer
run_id: run_02_blueedge
contract_id: PIOS-40.2-RUN02-CONTRACT-v2
program: BlueEdge Fleet Intelligence Platform
version: v3.23.0
date: 2026-03-19

---

## Contract Purpose

This contract governs the execution of Stream 40.2 — PiOS Evidence Connectors Layer for run_02_blueedge. It defines the evidence intake scope, execution rules, output artifacts, and validation requirements for the BlueEdge v3.23.0 evidence surface.

---

## Program Reference

program_id: blueedge
program_name: BlueEdge Fleet Intelligence Platform
source_version: v3.23.0
execution_workspace: ~/Projects/krayu-program-intelligence
evidence_origin_root: ~/Projects/blueedge-program-intelligence/source-v3.23/
evidence_boundary_file: docs/pios/runs/run_02_blueedge/evidence_boundary.md

---

## Evidence Intake Scope

### Accepted Evidence

| Source | Type | Path |
|--------|------|------|
| Architecture documentation | HTML | source-v3.23/BlueEdge_Unified_Architecture_v3_23_0.html |
| Competitive dashboard | HTML | source-v3.23/BlueEdge_Competitive_Dashboard_Feb2026.html |
| PMO dashboard | HTML | source-v3.23/Blue_Edge_PMO_Dashboard.html |
| Extraction analysis | Markdown | source-v3.23/analysis/ (support evidence only) |
| Backend source tree | TypeScript / SQL / config | source-v3.23/extracted/backend/ |
| Frontend source tree | TypeScript / TSX / config | source-v3.23/extracted/frontend/ |
| Platform source tree | TypeScript / Python / config / YAML | source-v3.23/extracted/platform/ |

### Provenance-Only (Not Ingested)

| Archive | Path |
|---------|------|
| blueedge-backend-v3_23_0-COMPLETE.tar | source-v3.23/raw/ |
| blueedge-frontend-v3_23_0-COMPLETE.tar | source-v3.23/raw/ |
| blueedge-platform-v3_23_0-COMPLETE.tar | source-v3.23/raw/ |

### Explicitly Excluded

- docs/reverse_engineering/
- docs/program-charter/
- docs/execution-telemetry/
- docs/signal-layer/
- docs/case-study/
- weekly/
- All prior analytical outputs, telemetry outputs, signal outputs, case-study outputs
- node_modules, build output, cache folders, local IDE artifacts
- Raw tar archives as direct Claude intake
- Inferred missing repositories

---

## Execution Rules

### Rule 1 — Evidence-First Doctrine

No value is fabricated or inferred. All evidence units are directly grounded in present, accessible files. Missing evidence is preserved as unknown-space, not synthesized.

### Rule 2 — Provenance Separation

Raw tar archives are not ingested as direct evidence. They serve as provenance references confirming the source of the extracted content.

### Rule 3 — Extraction Analysis as Support Only

The source-v3.23/analysis/ directory is accepted as extraction-support evidence only. Its contents inform extraction context but do not constitute primary analytical evidence and do not carry primary evidence authority.

### Rule 4 — Prohibited Path Enforcement

Access to any path in the explicitly_excluded_paths list is prohibited. Any content from those paths must not appear in output artifacts as accepted evidence.

### Rule 5 — Unknown-Space Preservation

Overlap between standalone extracted components and platform-embedded components is noted but not resolved at the intake layer. Unknown-space positions must be explicitly declared and preserved for downstream pipeline stages.

### Rule 6 — No Inference of Missing Evidence

The completeness of the evidence surface is declared at the level of what is present. Missing modules, repositories, or files are not inferred, estimated, or synthesized.

### Rule 7 — Canonical Evidence Priority

Extracted source trees are canonical code evidence per intake_assumptions. HTML files are accepted as source documentation/interface evidence. Extraction analysis is accepted as support-only context.

---

## Output Artifacts

| Artifact | Path | Type |
|----------|------|------|
| evidence_surface_inventory.md | docs/pios/40.2/ | evidence inventory |
| evidence_classification_map.md | docs/pios/40.2/ | evidence classification |
| normalized_evidence_map.md | docs/pios/40.2/ | canonical evidence units |
| intake_validation_log.md | docs/pios/40.2/ | validation log |
| build_evidence_inventory.py | scripts/pios/40.2/ | build script |
| validate_evidence_inventory.py | scripts/pios/40.2/ | validation script |
| PIOS-40.2-RUN02-CONTRACT.md | docs/pios/contracts/40.2/ | this contract |
| PIOS-40.2-RUN02.execution.md | docs/pios/contracts/40.2/ | execution receipt |

Total: 8 artifacts

---

## Validation Requirements

The validate_evidence_inventory.py script must produce 10/10 PASS.

Checks defined:
1. Artifact completeness — all 4 evidence artifacts present and non-empty
2. Boundary terms — run_id, contract_id, evidence_boundary reference in all artifacts
3. Evidence class coverage — all 6 accepted evidence classes represented
4. CEU completeness — all 13 canonical evidence units declared
5. Provenance handling — all 3 raw archives declared NOT INGESTED
6. No inference — no forbidden inference patterns present
7. Unknown-space declared — overlap and unknown-space positions explicitly declared
8. Excluded paths — no excluded paths treated as accepted evidence
9. Validation log PASS — intake_validation_log.md shows 8/8 PASS
10. Immutability declaration — script carries governance immutability declaration

---

## Expected Completeness Position

The evidence surface for run_02_blueedge is expected to be PARTIAL due to:
- Unknown-space: file-level parity between standalone and platform-embedded components is unresolved
- Overlap resolution deferred to downstream pipeline stages (40.4 onward)

Overall intake completeness will be declared in intake_validation_log.md.

---

## Downstream Pipeline

Stream 40.2 outputs feed directly into:

Stream 40.4 — PiOS Execution Telemetry Layer

The normalized evidence map (normalized_evidence_map.md) and evidence surface inventory (evidence_surface_inventory.md) are the authoritative inputs for Stream 40.4.

---

## Status

contract_status: ACTIVE
governed_by: PIOS-40.2-RUN02-CONTRACT-v2
