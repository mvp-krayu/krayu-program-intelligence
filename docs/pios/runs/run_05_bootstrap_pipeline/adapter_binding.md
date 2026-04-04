# Adapter Binding — run_05_bootstrap_pipeline

run_id: run_05_bootstrap_pipeline
stream: IG.3
contract: IG.3-BOOTSTRAP-CONTRACT-v1
date: 2026-04-04
launch_mode: BOOTSTRAP_PIPELINE

---

## GitHub Adapter

adapter_mode: ENABLED
github_evidence_sha: 68fe546ce95f330399c79d07fa2e5ecc3c889c12
github_output_sha: 7a19b58940418887f5b747cc87c70bed8190127f
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
