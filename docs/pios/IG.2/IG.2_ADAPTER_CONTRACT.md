# IG.2 — Adapter Contract

**Stream:** IG.2
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

This contract defines the adapter layer binding rules for the IG.2 ingestion stream. The adapter layer wraps the governed 40.2→40.4 ingestion pipeline with external system bindings (GitHub, Jira) without modifying any ingestion logic or output content.

The adapter layer is provenance-only. All semantic content (entity IDs, dependencies, topology, telemetry) remains identical to the baseline-equivalent run. Zero-delta is a hard requirement.

---

## 2. ADAPTER MODES

| Adapter | Mode | Basis |
|---|---|---|
| GitHub | **ENABLED** | Real access confirmed: `gh auth status` → `mvp-krayu` logged in |
| Jira | **CAPSULE** | No live Jira connection; deterministic baseline-equivalent capsule used |

---

## 3. GITHUB ADAPTER BINDING

### 3.1 Mode: ENABLED

Real GitHub access is available via `gh` CLI authenticated as `mvp-krayu`.

### 3.2 Bound Repositories

| Role | Repository | Purpose |
|---|---|---|
| Evidence source | `mvp-krayu/krayu-program-intelligence` | BlueEdge source-v3.23 evidence origin |
| Intelligence output | `mvp-krayu/k-pi-core` | Program intelligence artifact repository |

### 3.3 GitHub Adapter Responsibilities

| Responsibility | Scope |
|---|---|
| Evidence provenance anchor | Record commit SHA of source-v3.23 at evidence root |
| Output commit traceability | Record working branch and HEAD commit hash |
| No content mutation | Adapter reads GitHub metadata; does NOT write or push |

### 3.4 GitHub Adapter Constraints

- READ-ONLY adapter role in IG.2
- No GitHub Actions triggered
- No pull requests created
- No issues created or modified
- No pushes

### 3.5 Adapter Metadata Fields (provenance only)

| Field | Value |
|---|---|
| `github_evidence_repo` | `mvp-krayu/krayu-program-intelligence` |
| `github_evidence_branch` | `main` |
| `github_output_repo` | `mvp-krayu/k-pi-core` |
| `github_output_branch` | `work/ig-foundation` |

---

## 4. JIRA ADAPTER BINDING

### 4.1 Mode: CAPSULE

No live Jira system is connected. The Jira adapter uses a deterministic baseline-equivalent capsule defined in `IG.2_JIRA_CAPSULE_SCHEMA.md`.

### 4.2 Capsule Properties

| Property | Value |
|---|---|
| Type | STATIC — no live queries |
| Determinism | YES — same input always produces same capsule |
| Delta to output | ZERO — capsule does not modify 40.2/40.3/40.4 content |
| Source | Governed schema in `IG.2_JIRA_CAPSULE_SCHEMA.md` |

### 4.3 Capsule Role

The Jira capsule provides a simulated project tracking context for the ingestion run. It defines the mapping between program intelligence streams and notional Jira epic/ticket identifiers. These identifiers appear in adapter provenance fields only — not in any 40.x artifact content.

---

## 5. ZERO-DELTA REQUIREMENT

The adapter layer MUST produce zero semantic delta against the reference run.

| Requirement | Rule |
|---|---|
| Entity set | IDENTICAL to run_03_blueedge_repeat |
| Topology | IDENTICAL to run_03_blueedge_repeat |
| Telemetry | IDENTICAL to run_03_blueedge_repeat |
| Permitted differences | Provenance fields only (run_id, contract, date, regeneration_context, adapter_binding) |

If comparison result ≠ NONE → FAIL.

---

## 6. SCOPE CONSTRAINTS

| Constraint | Rule |
|---|---|
| 40.2 logic | NO CHANGE |
| 40.3 logic | NO CHANGE |
| 40.4 logic | NO CHANGE |
| New entity IDs | FORBIDDEN |
| New node references | FORBIDDEN |
| Adapter metadata in 40.x content | FORBIDDEN |

---

## 7. VALIDATOR REQUIREMENTS

| Validator | Path | Purpose |
|---|---|---|
| Adapter contract validator | `scripts/pios/ig2/validate_adapter_contract.sh` | Confirms adapter bindings are correct and mode declarations match |
| Zero-delta comparator | `scripts/pios/ig2/validate_zero_delta.sh` | Confirms run_04 matches run_03 post-normalization |
| Git hygiene validator | `scripts/pios/ig2/validate_git_hygiene.sh` | Confirms no unauthorized branch operations, no dirty state |
