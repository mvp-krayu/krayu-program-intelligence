CONTRACT START

STREAM ID
IG-PSEE-HANDOFF.0

PROGRAM
Krayu — Program Intelligence Discipline

LAYER
INGESTION

ROLE
Claude Code — Execution Engine

MODE
STRICT EXECUTION
COMPRESSED CONTRACT
DELTA ONLY

FAMILY
IG

FAMILY RESOLUTION
KNOWN

ARTIFACT MODE
PRODUCE

VALIDATION COVERAGE
PARTIAL

FALLBACK MODE
PROCEED

PRE-FLIGHT (MANDATORY)
scripts/governance/validate_stream_open.sh <this_contract>
if FAIL → STOP

OBJECTIVE
Define and produce the Runtime Handoff Package (RHP) that bridges governed ingestion outputs into PSEE runtime consumption without using validation/replay artifacts as runtime inputs.

SCOPE
- Define RHP contract for IG → PSEE runtime
- Produce machine-consumable handoff artifacts only
- Establish runtime intake boundary and admissibility traceability
- Exclude replay, projection, and behavioral validation artifacts
- Maintain zero mutation of IG.5–IG.7 and all PSEE artifacts

INPUTS
docs/pios/IG.5/*
docs/pios/IG.6/*
docs/pios/IG.7/*
docs/pios/runs/run_07_source_profiled_ingestion/*

scripts/pios/ig6/ingestion_orchestrator.sh
scripts/pios/ig7/ingestion_batch_runner.sh
scripts/pios/ig7/ingestion_payload_normalizer.sh

scripts/governance/*

TARGET NAMESPACE
docs/pios/IG.RUNTIME/run_01/
docs/pios/IG-PSEE-HANDOFF.0/

OUTPUTS
docs/pios/IG.RUNTIME/run_01/source_manifest.json
docs/pios/IG.RUNTIME/run_01/evidence_boundary.json
docs/pios/IG.RUNTIME/run_01/normalized_intake_structure/
docs/pios/IG.RUNTIME/run_01/admissibility_log.json

docs/pios/IG-PSEE-HANDOFF.0/runtime_handoff_contract.md
docs/pios/IG-PSEE-HANDOFF.0/IG_PSEE_HANDOFF_EXECUTION_LOG.md

DELTA
- Runtime Handoff Package (RHP) is the only allowed runtime input class
- Runtime intake boundary defined under IG lineage
- Replay and projection artifacts explicitly excluded
- No mutation of IG.5–IG.7 or any PSEE artifacts

INVOKE
bash scripts/pios/ig7/ingestion_batch_runner.sh docs/pios/IG.6/run_07_input.json

STREAM-SPECIFIC INSTRUCTIONS
- Produce only structured artifacts in docs/pios/IG.RUNTIME/run_01/
- RHP must contain no markdown, no narrative, no replay artifacts, no derived analysis
- Each element must include original source path and ingestion decision
- No semantic interpretation, no projection, no scoring, no recomputation
- Forbidden runtime inputs:
  docs/pios/PSEE.3/*
  docs/pios/PSEE.3B/*
  docs/pios/PSEE-GAUGE.0/*
  docs/pios/PSEE.UI/*
  *_replay_*
  behavioral_case_analysis.md
- Use:
  scripts/governance/validate_contract.sh --stream-dir docs/pios/IG-PSEE-HANDOFF.0
- Stay strictly within IG lineage
- normalized_intake_structure must be deterministic and machine-consumable

FAIL-SAFE RULE
If RHP is not fully machine-consumable, if replay/projection artifacts are used, or if any element lacks source traceability and ingestion decision linkage → FAIL_SAFE_STOP

PRE-CLOSURE (MANDATORY)
scripts/governance/validate_execution.sh <repo_root> IG-PSEE-HANDOFF.0 docs/pios/IG.RUNTIME/run_01/
if FAIL → STOP

CONTRACT END
