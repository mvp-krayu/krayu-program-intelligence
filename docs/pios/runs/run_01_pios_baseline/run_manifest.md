# Run Manifest
run_id: run_01_pios_baseline
run_type: baseline
execution_workspace: docs/pios/40.x
snapshot_location: docs/pios/runs/run_01_pios_baseline/
status: frozen

source_context:
- PiOS internal baseline
- Streams 40.2 -> 40.10 completed
- Stream 40.11 observational review completed

governance_rule:
- 40.x is the active execution workspace
- runs/ contains frozen snapshots only
- scripts under scripts/pios/* are shared execution logic
