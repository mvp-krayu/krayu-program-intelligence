# IG.5 — Source Profile Contract

**Stream:** IG.5
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

This contract formalizes the governed source profile layer for the IG ingestion pipeline. The source profile layer classifies admissible source types, resolves source properties, and validates admissibility before delegating to the IG.4 orchestration layer.

The source profile layer is the outermost entrypoint. All pipeline runs from IG.5 onward MUST enter through the source profile resolver.

---

## 2. LAYER HIERARCHY

```
IG.5 Source Profile Resolver
  └─► IG.4 Orchestration Launcher
        └─► IG.3 Bootstrap Launcher
              └─► 40.2 / 40.3 / 40.4 governed execution
```

No layer may be bypassed. No IG.4, IG.3, or IG.2 artifacts may be modified.

---

## 3. SOURCE PROFILE MODES

| Parameter | Allowed Values | Notes |
|---|---|---|
| `profile.kind` | `LOCAL_SNAPSHOT`, `GITHUB_REPOSITORY` | Classifies source type |
| `profile.admissibility` | `GOVERNED` | Only governed sources admitted |
| `profile.resolution` | `DETERMINISTIC` | Same profile input → same resolved properties |
| `source.binding` | `EXTERNAL` | Inherited from IG.4 — paths always externalized |
| `github.mode` | `ENABLED`, `DISABLED` | Required when `profile.kind = GITHUB_REPOSITORY` |
| `jira.mode` | `CAPSULE` | Inherited — no live Jira |
| `run.mode` | `SOURCE_PROFILED_INGESTION` | IG.5-specific run mode |
| `execution.mode` | `CREATE_ONLY` | Inherited — no overwrites |

---

## 4. SOURCE ADMISSIBILITY RULES

| Profile Kind | Admissibility Condition |
|---|---|
| `LOCAL_SNAPSHOT` | Directory exists; contains `extracted/` subdirectory or recognized source structure |
| `GITHUB_REPOSITORY` | GitHub CLI authenticated; repository accessible; branch/SHA resolvable |

If source fails admissibility → RESOLVER_FAIL, do not proceed.

---

## 5. PROFILE RESOLUTION

For each admitted source, the resolver produces a resolved profile record:

| Field | LOCAL_SNAPSHOT | GITHUB_REPOSITORY |
|---|---|---|
| `resolved.kind` | `LOCAL_SNAPSHOT` | `GITHUB_REPOSITORY` |
| `resolved.path` | absolute path as provided | local clone path |
| `resolved.version` | directory name or `unknown` | commit SHA |
| `resolved.anchor` | `pios-core-v0.4-final` (from input) | same |
| `resolved.admissible` | `YES` if exists | `YES` if accessible |

---

## 6. DELEGATION RULE

The source profile resolver MUST:
1. Resolve and validate the source profile
2. Translate the resolved profile into an IG.4 orchestration input schema
3. Delegate to `scripts/pios/ig4/orchestration_launcher.sh`

The resolver MUST NOT invoke the bootstrap or 40.x layers directly.

---

## 7. ZERO-DELTA REQUIREMENT

Source-profile-aware runs MUST produce zero semantic delta against the reference run.

| Requirement | Rule |
|---|---|
| Entity set | IDENTICAL to run_06_orchestrated_ingestion |
| Topology | IDENTICAL to run_06_orchestrated_ingestion |
| Telemetry | IDENTICAL to run_06_orchestrated_ingestion |
| Permitted differences | Provenance fields only |

If comparison result ≠ NONE → FAIL.

---

## 8. INVARIANT CHAIN

| Layer | Invariant | Preserved by |
|---|---|---|
| IG.4 orchestration | Orchestration invariant | delegation — orchestration called unchanged |
| IG.3 bootstrap | Bootstrap invariant | through IG.4 delegation |
| IG.2 adapter | Adapter semantics | through IG.3/IG.4 inheritance |
| Zero-delta | NONE post-normalization | enforced at comparison step |
