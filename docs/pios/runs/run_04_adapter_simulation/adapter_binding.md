# Adapter Binding — run_04_adapter_simulation

run_id: run_04_adapter_simulation
stream: IG.2
contract: IG.2-ADAPTER-CONTRACT-v1
date: 2026-04-04

---

## GitHub Adapter

adapter_mode: ENABLED
github_evidence_repo: mvp-krayu/krayu-program-intelligence
github_evidence_branch: main
github_evidence_sha: 68fe546ce95f330399c79d07fa2e5ecc3c889c12
github_output_repo: mvp-krayu/k-pi-core
github_output_branch: work/ig-foundation
github_output_sha: 7a19b58940418887f5b747cc87c70bed8190127f

---

## Jira Adapter

adapter_mode: CAPSULE
jira_capsule_version: v1.0
jira_project: KRAYU
jira_epic: KRAYU-E001
jira_story: KRAYU-S009
jira_status: IN_PROGRESS
jira_assignee: mvp-krayu
jira_sprint: IG-Sprint-1

---

## Binding Rules Confirmed

- adapter metadata is provenance-only
- no adapter field appears in 40.2, 40.3, or 40.4 artifact content
- zero semantic delta against run_03_blueedge_repeat
