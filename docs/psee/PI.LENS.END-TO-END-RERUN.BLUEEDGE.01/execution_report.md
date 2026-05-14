# Execution Report — PI.LENS.END-TO-END-RERUN.BLUEEDGE.01

**Contract:** PI.LENS.END-TO-END-RERUN.BLUEEDGE.01  
**Date:** 2026-04-30  
**Mode:** FULL_PIPELINE_EXECUTION / DETERMINISTIC_REBUILD / SELECTOR_OUTPUT_ENFORCED  
**Executor:** Claude Code (claude-sonnet-4-6)

---

## Pre-Flight

- Git structure contract: LOADED
- Branch: `work/psee-runtime` — flagged; proceeding per session governance pattern
- CONTROL_DOC_ROOT: ABSENT — PASS
- Source vault: CONFIRMED PRESENT
- Generator: CONFIRMED PRESENT (with selector extensions from prior contract)
- Selector root: CONFIRMED PRESENT (current_run=run_blueedge_productized_01_fixed)
- Semantic topology + crosswalk: CONFIRMED PRESENT
- Intake path discrepancy: `intake/` absent; equivalent manifest at `manifests/run_initialization_manifest.json` — PASS_WITH_NOTE
- Pre-flight verdict: PASS

---

## Block A — Pre-Flight

9 checks: 8 PASS, 1 PASS_WITH_NOTE (intake path). No blocking failures. See preflight_check.json.

---

## Block B — Run Initialization

Directory structure created at `clients/blueedge/lens/runs/run_blueedge_rerun_01/`. 7 subdirectories. No attempt folders. No output outside lens/. See run_initialization.json.

---

## Block C — Pipeline Execution

Steps 1-7 confirmed from source artifacts (READ ONLY). Step 8 executed fresh:

```
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_rerun_01 \
  --package-dir clients/blueedge/psee/runs/run_blueedge_productized_01/vault \
  --output-root clients/blueedge/lens/runs/run_blueedge_rerun_01 \
  --crosswalk-path docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-CONTINUITY.01/semantic_continuity_crosswalk.json \
  --semantic-topology-dir docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-TOPOLOGY-REBUILD.01
```

Result: 9 HTML files + graph_state.json + index.json + manifest.json + selector update + current/ update. See pipeline_execution_log.json.

---

## Block D — Report Generation Validation

All 9 reports present. All generator-driven. All in canonical structure. No files outside lens/. MD5s recorded. See report_generation_validation.json.

---

## Block E — Structural Consistency

13/13 checks PASS. All structural values match baseline exactly. See structural_consistency.json.

---

## Block F — Decision Consistency

5/5 checks PASS. Score=60, CONDITIONAL, INVESTIGATE. See decision_consistency.json.

---

## Block G — Navigation Validation

7/7 checks PASS. All hrefs use run_blueedge_rerun_01. 0 stale IDs. See navigation_validation.json.

---

## Block H — Selector Update

selector.json: current_run=run_blueedge_rerun_01. available_runs: 2 entries. current/ updated. See selector_update.json.

---

## Block I — Reproducibility Verdict

FULL_REPRODUCIBILITY. Unified diff: 0 non-runid differences. graph_state.json MD5 identical. See reproducibility_verdict.json.

---

## Block J — Git Hygiene

No new tracked mutations from this contract. All output untracked. See git_hygiene.json.

---

## Block K — Human Summary

See rerun_summary.md. Verdict: BLUEEDGE_RERUN_SUCCESS.

---

## Validation Summary

10/10 VF checks PASS. See validation_log.json.

---

## Artifacts Produced (13 total)

1. preflight_check.json
2. run_initialization.json
3. pipeline_execution_log.json
4. report_generation_validation.json
5. structural_consistency.json
6. decision_consistency.json
7. navigation_validation.json
8. selector_update.json
9. reproducibility_verdict.json
10. git_hygiene.json
11. validation_log.json
12. execution_report.md
13. rerun_summary.md
