# Run Manifest
run_id: run_03_blueedge_repeat
run_type: controlled_reuse
execution_workspace: docs/pios/40.x
snapshot_location: docs/pios/runs/run_03_blueedge_repeat/
status: not_started

source_context:
- BlueEdge evidence boundary
- execution will occur in canonical 40.x workspace
- snapshot will be taken after controlled completion

governance_rule:
- no 42.x folders
- no one-shot end-to-end execution
- execute 40.2 -> 40.10 sequentially in active workspace
- freeze results into runs/run_03_blueedge_repeat after completion
