---
title: Evidence Method
type: methodology
status: OBSERVED
confidence: HIGH
date: 2026-03-28
---

# Evidence Method

## Crawl Scope

Primary repo: /Users/khorrix/Projects/repos/k-pi

Directories crawled:
- docs/pios/ (40.x through 51.x, contracts/, runs/, baselines/)
- docs/program-intelligence-framework/pios/
- docs/program-intelligence-discipline/
- docs/governance/
- docs/signal-science/ (referenced but not primary crawl target)
- docs/handbook/ (structure confirmed)
- app/execlens-demo/ (demo surface boundary only)
- scripts/pios/ (adapter chain — execution evidence only)

External repo crawled:
- /Users/khorrix/Projects/krayu-knowledge/ (GOV, CAT, SCI, INT, RES domains)

## Evidence Extraction Model Applied

### A. Structural Evidence
- File paths, directory structure, type classification (specification/contract/output/definition/execution)
- Observed: 713 markdown files in docs/pios/; 87 artifacts catalogued

### B. Reference Evidence
- Markdown links, contract references, upstream_contract fields, authority declarations
- All 28 edges in document_edge_registry.json derive from explicit reference anchors

### C. Contract Evidence
- Input/output boundaries from pios_pipeline_specification.md
- Boundary enforcement from diagnosis_boundary_enforcement.md and equivalent per-stream files
- Handover contract from stream_50_handover_capsule.md

### D. Semantic Evidence
- First occurrence tracking for all 18 concepts in concept_registry.json
- Refinement/propagation chains traced across artifact boundaries

### E. Execution Evidence
- Execution manifests (40.5, 40.6, 40.7, 51.7)
- Closure documents (42.21, 42.22, 43.31-43.33, 44.4)
- Validation logs (validation_log.json per stream)
- Run references (run_01_blueedge, run_02_governed, run_03_blueedge_derivation_validation)

### F. Git Evidence
- git log confirms stream execution sequence (commits visible in git log --oneline)
- Git branching: feature branches per stream (feature/42-22-runtime-rendering-exposure, etc.)

## Claim Tagging Protocol

All statements in reconstruction artifacts are tagged:

- **OBSERVED** — directly read from a file in this repo, content confirmed
- **RECONSTRUCTED** — derived from multiple observed facts without invention
- **INFERRED** — derived from observed facts with one or more interpretive steps; marked explicitly
- **AMBIGUOUS** — cannot be determined from available evidence; registered in ambiguity_register
- **REJECTED** — explicitly contradicted by evidence

## Non-Claims

The following were NOT claimed because evidence was insufficient:

1. Full L0-L8 layer model — AMB-001
2. L1, L2, L7, L8 definitions — AMB-001
3. 75.x interpretation layer content — AMB-007
4. Complete 34-construct CKR registry — AMB-005
5. Run_02 continuity artifacts — AMB-006

## Doctrine Compliance

- No claim made without anchor
- Similarity ≠ lineage (ancestry rules followed)
- Demo surface not promoted to architecture without proof
- Uncertainty registered and not forced to conclusion
- Node/edge counts: 32 nodes, 28 edges (reconcilable)
