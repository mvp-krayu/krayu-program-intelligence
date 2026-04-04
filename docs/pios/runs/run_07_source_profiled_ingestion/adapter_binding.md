# Adapter Binding — run_07_source_profiled_ingestion

run_id: run_07_source_profiled_ingestion
stream: IG.3
contract: IG.3-BOOTSTRAP-CONTRACT-v1
date: 2026-04-04
launch_mode: BOOTSTRAP_PIPELINE

---

## GitHub Adapter

adapter_mode: ENABLED
github_evidence_sha: 68fe546ce95f330399c79d07fa2e5ecc3c889c12
github_output_sha: e6948b65b28a9859849c00fd7d33247e967a5d68
github_output_branch: work/ig-foundation

---

## Jira Adapter

adapter_mode: CAPSULE
jira_capsule_version: v1.0
jira_project: KRAYU
jira_epic: KRAYU-E001
jira_story: KRAYU-S010
jira_status: IN_PROGRESS

---

## Bootstrap Binding

source_path: /Users/khorrix/Projects/blueedge-program-intelligence/source-v3.23
source.kind: LOCAL_SNAPSHOT
baseline_anchor: pios-core-v0.4-final
execution.mode: CREATE_ONLY

---

## Orchestration Layer

orchestration_layer: IG.4
orchestration_run_mode: ORCHESTRATED_INGESTION
source.binding: EXTERNAL
bootstrap_delegated_to: bootstrap_launcher.sh
orchestration_schema: ig5_orch_XXXXXX.schema

---

## Source Profile Layer (IG.5)

source_profile_layer: IG.5
profile.kind: LOCAL_SNAPSHOT
profile.admissibility: GOVERNED
profile.resolution: DETERMINISTIC
resolved.kind: LOCAL_SNAPSHOT
resolved.version: blueedge-program-intelligence/source-v3.23
source_profiled_run_mode: SOURCE_PROFILED_INGESTION
