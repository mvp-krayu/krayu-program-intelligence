# Family: IG — Governed Ingestion Pipeline

**Status:** REGISTERED
**Registered:** 2026-04-04
**Authority:** IG.5 (pipeline complete) + GOV.1 (normalization codified)

---

## PURPOSE

Governed ingestion pipeline that verifies a declared source deterministically produces baseline-equivalent 40.2/40.3/40.4 program intelligence artifacts. IG wraps the 40-family computational engine with source admissibility, adapter binding, bootstrap, orchestration, and source profile layers.

IG does not compute intelligence — it verifies that the 40-family pipeline reproduces it faithfully from a governed source.

---

## LAYER HIERARCHY

```
IG.5  Source Profile Resolver    — outermost entry; admissibility gate
  └─► IG.4  Orchestration Launcher  — externalizes source binding
        └─► IG.3  Bootstrap Launcher    — CREATE-ONLY run namespace
              └─► 40.2 / 40.3 / 40.4   — governed computation (READ-ONLY from IG)
```

No layer may be bypassed. Entry is always through the outermost declared layer.

---

## STANDARD INVARIANTS

- **Zero-delta:** same governed source → same 40.x artifact content (post-normalization); any drift is a violation
- **CREATE-ONLY:** target namespace must not exist before execution; no file overwrite permitted
- **Layer bypass prevention:** delegation chain is fixed; IG.4, IG.3, and 40.x may not be called out of order
- **Admissibility gate:** source must be GOVERNED and admissibility confirmed before delegation begins
- **Provenance-only adapters:** GitHub and Jira adapters are READ-ONLY; no semantic content mutation
- **Baseline anchor protection:** baseline-protected directories are immutable; IG.x writes only to declared namespaces
- **Evidence-first:** source binding must be declared and locked before any output is produced

---

## NORMALIZATION RULES

Applied before any diff-based comparison (zero-delta checks):

| Rule | Field stripped |
|---|---|
| N-01 | `run_id` |
| N-02 | `contract` |
| N-03 | `upstream_contract` |
| N-04 | `date` (YYYY-MM-DD pattern) |
| N-05 | `regeneration_context` |
| N-06 | `adapter_binding` |
| N-07 | `github_*` fields |
| N-08 | `jira_*` fields |
| N-09 | `orchestration_*` fields |
| N-10 | `source_profile_*`, `resolved.*` fields, run path references |

---

## STATE VOCABULARIES

| Object | States |
|---|---|
| admissibility_state | `GOVERNED` \| `UNGOVERNED` |
| resolution_state | `DETERMINISTIC` \| `INDETERMINATE` |
| pipeline_state | `COMPLETE` \| `PARTIAL` \| `BLOCKED` |
| adapter_state | `ENABLED` \| `DISABLED` \| `CAPSULE` |
| run_state | `VERIFIED` \| `UNVERIFIED` \| `DRIFT_DETECTED` |
| drift_scale | `NONE` \| `STRUCTURALLY_EQUIVALENT` \| `DRIFT_MINOR` \| `DRIFT_MAJOR` \| `DRIFT_CRITICAL` |

---

## STANDARD ARTIFACT SLOTS (7-PACK)

| Slot | Function |
|---|---|
| 1 | Pipeline spec or layer contract |
| 2 | Input schema or source binding model |
| 3 | Integrity verdict |
| 4 | Zero-delta comparison report |
| 5 | Adapter binding or source profile |
| 6 | Git hygiene report |
| 7 | Execution log |

---

## VALIDATION PROFILES

| Profile | Purpose |
|---|---|
| `zero_delta` | Normalized diff between run namespaces; PASS if diff = 0 |
| `source_profile_contract` | Admissibility state, resolution state, profile.kind, source.binding |
| `bootstrap_contract` | Pipeline preconditions, CREATE-ONLY enforcement, delegation chain |
| `git_hygiene` | Branch scope, baseline anchor intact, no unintended writes |

---

## HANDOVER EXPECTATIONS

- Pipeline layer reached and verified (which IG.x level)
- Zero-delta status per layer (40.2, 40.3, 40.4)
- Admissibility check result
- Next layer authorization (or BLOCKED with reason)
- Baseline anchor unchanged confirmation

---

## KNOWN EXCLUSIONS

- IG does not modify 40.x artifacts — 40.x is READ-ONLY within IG
- IG does not own validation profiles for 40.x content (those belong to the 40 family)
- No live source writes — adapters are READ-ONLY
- No category or semantic interpretation
- No UI or delivery logic

---

## COMPRESSION ELIGIBILITY

REGISTERED. Compressed contracts permitted.

Compressed IG contracts must declare only:
- which pipeline layer is being added or verified
- source profile and admissibility mode
- target run namespace
- zero-delta reference run
- any deviations from the delegation chain
