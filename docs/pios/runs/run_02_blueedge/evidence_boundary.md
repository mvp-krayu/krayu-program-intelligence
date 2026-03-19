# Evidence Boundary
run_id: run_02_blueedge

execution_workspace:
- ~/Projects/krayu-program-intelligence

evidence_origin_root:
- ~/Projects/blueedge-program-intelligence

primary_evidence_origin_paths:
- ~/Projects/blueedge-program-intelligence/source-v3.23/BlueEdge_Competitive_Dashboard_Feb2026.html
- ~/Projects/blueedge-program-intelligence/source-v3.23/BlueEdge_Unified_Architecture_v3_23_0.html
- ~/Projects/blueedge-program-intelligence/source-v3.23/Blue_Edge_PMO_Dashboard.html
- ~/Projects/blueedge-program-intelligence/source-v3.23/analysis/
- ~/Projects/blueedge-program-intelligence/source-v3.23/extracted/backend/
- ~/Projects/blueedge-program-intelligence/source-v3.23/extracted/frontend/
- ~/Projects/blueedge-program-intelligence/source-v3.23/extracted/platform/

provenance_only_paths:
- ~/Projects/blueedge-program-intelligence/source-v3.23/raw/blueedge-backend-v3_23_0-COMPLETE.tar
- ~/Projects/blueedge-program-intelligence/source-v3.23/raw/blueedge-frontend-v3_23_0-COMPLETE.tar
- ~/Projects/blueedge-program-intelligence/source-v3.23/raw/blueedge-platform-v3_23_0-COMPLETE.tar

explicitly_excluded_paths:
- ~/Projects/blueedge-program-intelligence/docs/reverse_engineering/
- ~/Projects/blueedge-program-intelligence/docs/program-charter/
- ~/Projects/blueedge-program-intelligence/docs/execution-telemetry/
- ~/Projects/blueedge-program-intelligence/docs/signal-layer/
- ~/Projects/blueedge-program-intelligence/docs/case-study/
- ~/Projects/blueedge-program-intelligence/weekly/

source_materials:
- HTML exports
- extracted source trees
- lightweight extraction analysis notes

accepted_evidence_classes:
- documentation
- code
- configuration
- structural artifacts
- interface artifacts
- extraction metadata

explicit_inclusions:
- .html
- .md
- .json
- .yaml
- .yml
- .ts
- .tsx
- .js
- .jsx
- .py
- .sh
- Dockerfile
- package.json
- lockfiles
- extracted source directories

explicit_exclusions:
- prior analytical outputs
- prior reverse engineering outputs
- prior telemetry outputs
- prior signal outputs
- prior case-study outputs
- weekly narrative summaries
- node_modules
- build output
- cache folders
- local IDE artifacts
- .DS_Store
- raw tar archives as direct Claude intake
- inferred missing repositories

intake_assumptions:
- extracted source trees are canonical code evidence for Run 02
- raw tar archives exist for provenance only
- HTML files are accepted as source documentation/interface evidence
- source-v3.23/analysis/ is accepted only as extraction-support evidence
- previously produced BlueEdge docs are excluded because they are derived outputs
- no missing evidence may be inferred

completeness_position:
- completeness unknown until 40.2 intake validation
- overlap between html and extracted code must be assessed
- unknown-space must be preserved

expected_40_2_outputs:
- evidence_surface_inventory.md
- normalized_evidence_map.md
- intake_validation_log.md
