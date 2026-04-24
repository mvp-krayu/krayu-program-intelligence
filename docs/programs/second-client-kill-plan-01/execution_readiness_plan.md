# Execution Readiness Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.GAP-ASSESSMENT.01
Branch: feature/second-client-kill-plan-01
Date: 2026-04-24
Status: ASSESSMENT COMPLETE — no execution performed
Derived from: gap_assessment_report.md

---

## 1. Current readiness verdict

**VERDICT: NOT READY FOR SECOND-CLIENT EXECUTION**

8 BLOCKERS prevent execution from starting or completing a valid run.
6 MAJORS will produce silent contamination or incorrect output if not resolved.
The system is executable only for BlueEdge in its current state.

The most critical constraint is architectural: **S3 activation scripts (43.x/44.x) do not exist** (GAP-03). Even if all other blockers are resolved, S3 cannot be executed.

A secondary constraint requires human decision before remediation work can begin: **two parallel pipeline paths exist** (scripts/pios/ numbered streams vs. scripts/psee/run_end_to_end.py) and their relationship is unresolved (GAP-12). The correct execution path must be declared before code remediation targets the right scripts.

---

## 2. Blockers Before Second-Client Run

Listed in dependency order. Blockers that depend on human decisions are marked `[HUMAN DECISION REQUIRED]`.

| Order | Gap ID | Blocker | Decision Required? |
|---|---|---|---|
| 1 | GAP-12 | Pipeline routing ambiguity (psee/ vs pios/) | YES — OQ-01 |
| 2 | GAP-03 | S3 activation scripts (43.x/44.x) missing | YES — OQ-01 |
| 3 | GAP-08 | Client registry has only blueedge | YES — OQ-04 |
| 4 | GAP-01 | S1 ingestion hardcoded to BlueEdge source | No — code fix |
| 5 | GAP-02 | Validation scripts hardcode BlueEdge run IDs | No — code fix (after OQ-01) |
| 6 | GAP-06 | Semantic layer (41.1) embeds BlueEdge domain data | No — code fix |
| 7 | GAP-04 | LENS report generator hardcoded to BlueEdge | No — code fix |
| 8 | GAP-05 | LENS fragment source path hardcoded to BlueEdge | No — code fix |
| 9 | GAP-07 | tier2_data.py has zero parameterization | No — code fix |

---

## 3. Required Remediation Sequence

**Phase 0: Human Decisions (prerequisite for all remediation)**

Resolve all open questions (section 6) before writing any code. The pipeline routing decision (OQ-01) determines which scripts to fix. Without it, code changes may target the wrong layer.

**Phase 1: Client Registration and Scaffolding**

1. Assign second-client UUID and business_client_id (OQ-04)
2. Add client entry to `clients/registry/client_index.json` (GAP-08)
3. Create `clients/<new-client-id>/` directory structure
4. Define tenant mapping if required (GAP-14, OQ-02)
5. Confirm evidence source path and minimum evidence package (GAP-18, OQ-03)

**Phase 2: Pipeline Path Resolution**

6. Confirm whether `scripts/psee/run_end_to_end.py` is the authoritative S0–S2 execution path (OQ-01)
7. If YES: confirm that 40.x scripts are historical/recovery artifacts, not production blockers; GAP-01/02 severity becomes legacy documentation
8. If NO (numbered streams are canonical): fix 40.2 source parameterization (GAP-01), then fix validation script run ID checks (GAP-02)

**Phase 3: S2 Semantic Layer Portability**

9. Refactor `scripts/pios/41.1/build_semantic_layer.py` to derive domain data from evidence artifacts, not embedded constants (GAP-06)
10. Remove `RUN_REFERENCE = "run_03_blueedge_derivation_validation"` hardcode; derive from run identity

**Phase 4: S3 Activation**

11. Determine whether S3 routes through `scripts/psee/run_end_to_end.py` transformation/envelope stages or requires separate 43.x/44.x scripts (OQ-01)
12. If 43.x/44.x must be created: this is a new implementation scope, not a parameterization fix. Requires separate stream contract.
13. If psee runner covers S3: confirm activation outputs are produced and identifiable in the package artifacts

**Phase 5: S4 LENS and Projection Portability**

14. Parameterize `lens_report_generator.py`: add `--client`, `--run-id`, `--fragments-dir`, `--output-dir` arguments (GAP-04)
15. Remove embedded domain counts (17/42/89) and cluster names; read from canonical_topology.json at runtime (GAP-04)
16. Parameterize `tier2_data.py`: add `client_id`, `run_id`, `focus_domain` as parameters (GAP-07)
17. Add `--api-base` argument or env var to `lens_report_generator.py` (GAP-15)
18. Parameterize `export_graph_state.mjs`: add `--client`, `--run-id`, `--output` arguments (GAP-11)

**Phase 6: GAUGE Portability**

19. Remove BlueEdge defaults from `envelope_adapter.py` (GAP-09)
20. Remove BlueEdge default from `projection_runtime.py` `run_id` parameter (GAP-10)

**Phase 7: Pre-Execution Validation**

21. Run `grep -R "blueedge" scripts/pios/lens_report_generator.py scripts/pios/tier2_data.py` — must return zero hits
22. Run `grep -R "run_authoritative_recomputed_01" scripts/pios/ scripts/psee/` — must return zero hits in non-comment code
23. Run `grep -R "Path.home()" scripts/pios/` — must return zero hits
24. Confirm second-client directory scaffold is complete per validation matrix group 2
25. Confirm code tag recorded and matches baseline

---

## 4. What Can Be Deferred

The following are not required before the second-client run can execute and PASS:

- **RBAC implementation** (GAP-21): Architecture documentation is required, not implementation. Attachment points must be documented during the run, not before.
- **Audit log implementation** (GAP-21): Same deferral as RBAC.
- **Onboarding UI** (GAP-13 partial): The PRODUCT brain emission includes future UI requirements, but no UI is required for the run to PASS.
- **Multi-repo source scaling** (GAP-22): Architecture is not blocked; current single-source intake is sufficient for one second-client run.
- **GAUGE scoring formula standalone document** (GAP-17): Useful but not a PASS/FAIL gate in the validation matrix.
- **Tier-2 LENS report portability** (GAP-07, GAP-11): These are required for full T2 LENS projection, but the validation matrix group 7 requires LENS projection portability — the T1 report is the minimum. If T2 is declared out of scope for this run, GAP-07 and GAP-11 can be deferred with explicit scope note.
- **brain_emission_plan.md template enforcement** (GAP-13): A manual fill-in process is acceptable for the first run; automation can be deferred.

---

## 5. Minimum Viable Second-Client Execution Path

This is the narrowest execution path that could satisfy all 7 validation matrix groups.

**Assumptions required:**
- OQ-01 resolves to: `scripts/psee/run_end_to_end.py` IS the authoritative production path
- OQ-01 also resolves S3 activation (psee runner covers transformation/envelope = S3)
- OQ-02 resolves to: `--tenant` = `--client` (no separate tenant infrastructure required)
- Second-client evidence is in hand and staged at a local path

**Minimum path:**

```
Step 0: Register second client in clients/registry/client_index.json
Step 1: Stage second-client source evidence at <source-path>
Step 2: python3 scripts/psee/run_end_to_end.py \
            --client <new-client-uuid> \
            --source <source-path> \
            --run-id <new-run-id> \
            --target gauge
Step 3: python3 scripts/psee/build_evidence_vault.py \
            --client <new-client-uuid> \
            --run <new-run-id> \
            --output-dir clients/<new-client-uuid>/vaults/run_01_authoritative_generated
Step 4: [After GAP-04/05 fixed] \
        python3 scripts/pios/lens_report_generator.py \
            --client <new-client-uuid> \
            --run-id <new-run-id> \
            --fragments-dir clients/<new-client-uuid>/vaults/.../claims/fragments \
            --output-dir clients/<new-client-uuid>/reports/
Step 5: Manually populate brain_emission_plan.md from run artifacts
Step 6: Run validation_matrix.md checks manually
```

**Precondition:** GAP-04, GAP-05 must be fixed before Step 4. If OQ-01 does not resolve as assumed, the minimum path expands significantly to include 40.2 parameterization, validation script fixes, and potentially 43.x/44.x creation.

---

## 6. Open Questions Requiring Human Decision

**OQ-01 — Pipeline Routing (CRITICAL)**
Is `scripts/psee/run_end_to_end.py` the authoritative production execution path for S0–S4, superseding the numbered stream scripts (40.x → 42.x)?

Context: `run_end_to_end.py` is fully parameterized (`--client`, `--source`, `--run-id`). The 40.x scripts are BlueEdge-specific with hardcoded source paths. If run_end_to_end.py covers S1–S3, the BLOCKER count drops from 8 to 4 or fewer. If the numbered streams are still canonical, significant rework is required.

Consequence of getting this wrong: Parameterizing the wrong scripts, or skipping governance validation steps that only the numbered stream validators enforce.

**OQ-02 — Tenant Model**
Does `--tenant` in `pios.py` map to the same concept as `--client`, or is `tenant` a separate organizational grouping above client?

Context: `ig materialize`, `ig integrate-structural-layers`, `structural extract/relate/normalize` all use `--tenant`. No `tenants/` directory exists. If tenant and client are synonymous, pass the same ID to both parameters.

**OQ-03 — Second-Client Evidence Package**
What evidence is the second client providing? What format? What volume?

Context: The execution contract declares "Evidence volume and domain coverage to be determined at intake." Before execution, the intake operator must confirm: source type (local directory / git repository), approximate file count, and whether the evidence set is sufficient to derive at least the minimum domain count for GAUGE to produce a valid score.

**OQ-04 — Client ID Assignment**
What is the second client's business_client_id and UUID?

Context: `client_index.json` requires both. The `business_client_id` should be an anonymized or codename identifier. The UUID should be a newly generated value.

---

## 7. Explicit "Do Not Do Yet" List

The following must NOT be executed, implemented, or decided until the open questions in section 6 are resolved and the remediation sequence in section 3 is completed:

1. Do NOT begin writing 43.x or 44.x activation scripts until OQ-01 resolves and pipeline routing is confirmed
2. Do NOT modify `clients/blueedge/` in any way
3. Do NOT modify `docs/baseline/pios_baseline_v1.0.md`
4. Do NOT run `scripts/pios/40.2/build_evidence_inventory.py` against second-client evidence in its current hardcoded state — it will attempt to read BlueEdge paths
5. Do NOT run `scripts/pios/lens_report_generator.py` for a second client in its current state — it will write BlueEdge content into the report
6. Do NOT implement RBAC or audit logging — architecture documentation is the only requirement for this run
7. Do NOT declare the run authoritative until all 7 validation matrix groups PASS
8. Do NOT publish LENS projection or activate any PUBLISH brain claims until validation matrix group 7 is complete
9. Do NOT create a fake or synthetic second client — all evidence must be real (validation matrix group 4)
10. Do NOT reuse BlueEdge signal registry for the second client (execution contract, S3)
11. Do NOT commit to a brain/* branch from this execution branch — brain emissions follow brain branch governance
