# IG Handoff Authority Contract
# IG.HANDOFF.AUTHORITY.01

## Identity

- Contract: IG.HANDOFF.AUTHORITY.01
- Date: 2026-04-14
- Status: AUTHORITATIVE — LOCKED
- Scope: STAGE 1 OUTPUT → STAGE 2 INPUT ONLY
- Authority level: IG → STRUCTURAL TRUTH HANDOFF AUTHORITY
- Reference: BOOTSTRAP.CHAIN.AUTHORITY.01 (Stage 0 → Stage 1 boundary)
- Reference: IG-PSEE-HANDOFF.0/runtime_handoff_contract.md (prior IG boundary definition)

---

## Purpose

This contract defines the authoritative handoff boundary from Stage 1 (IG Ingestion) to Stage 2 (Structural Truth — 40.2–40.4).

The Runtime Handoff Package (RHP) is the only authorized output of Stage 1 and the only authorized input to Stage 2.

No stage may bypass the RHP.
No stage may consume IG ingestion artifacts directly.
No stage may consume raw source artifacts in place of the RHP.

---

## 1. RHP IDENTITY

### 1.1 Contract Identifier

Each RHP instance is bound to exactly one chain run. Its identity is defined by the combination of:

| field | description | format |
|-------|-------------|--------|
| `contract_id` | Canonical identifier of this handoff contract | `IG.HANDOFF.AUTHORITY.01` (constant) |
| `run_id` | Unique identifier for this RHP instance | `run_<seq>` where `<seq>` is a zero-padded integer (e.g. `run_01`, `run_02`) OR `run_<slug>` where `<slug>` is an alphanumeric descriptor with underscores (e.g. `run_01_authoritative`) |
| `client_uuid` | Canonical client identifier — must match the `client_uuid` in the Stage 0 `intake_record.json` | Same format as BOOTSTRAP.CHAIN.AUTHORITY.01 §1.1 |
| `source_version` | Version of the source consumed — must match the `source_version` in the Stage 0 `intake_record.json` | Same format as BOOTSTRAP.CHAIN.AUTHORITY.01 §1.1 |

### 1.2 Run ID Uniqueness Rule

- `run_id` must be unique within `docs/pios/IG.RUNTIME/`
- Two RHP instances with the same `run_id` must not coexist
- A new ingestion run requires a new `run_id`; it may not overwrite an existing RHP

### 1.3 Bootstrap Linkage

The RHP identity fields `client_uuid` and `source_version` must match the corresponding fields in:

```
clients/<client_uuid>/source/<source_version>/intake_record.json
```

(defined by BOOTSTRAP.CHAIN.AUTHORITY.01)

The RHP does not duplicate `intake_record.json` content. It references the Stage 0 evidence root as its input boundary. Any mismatch between RHP identity fields and `intake_record.json` fields is a rejection condition.

---

## 2. CANONICAL ARTIFACT SET

All 6 artifacts listed below are required. The RHP is not valid if any artifact is absent.

### 2.1 RHP Root Path

```
docs/pios/IG.RUNTIME/run_<run_id>/
```

### 2.2 Artifact Definitions

---

#### 2.2.1 source_manifest.json

**Path:** `docs/pios/IG.RUNTIME/run_<run_id>/source_manifest.json`

**Role:** Source registry. Records all layers processed by IG and their admission status. Links the RHP to the IG pipeline run that produced it.

**Required top-level fields:**

| field | type | constraint |
|-------|------|-----------|
| `schema_version` | string | non-empty |
| `stream` | string | non-empty |
| `run_id` | string | must match RHP run_id |
| `date` | string | ISO 8601 UTC |
| `source_run` | string | identifies the IG source run that produced this manifest |
| `baseline_commit` | string | non-empty; git commit hash or equivalent |
| `source` | object | non-empty; describes the source target |
| `layers` | object or array | non-empty; per-layer admission records |
| `root_artifacts` | array | ≥1 entry |
| `total_admitted_artifacts` | integer | ≥1 |
| `provenance` | object | non-empty |

**Non-empty constraint:** `layers` must contain at least one layer entry. `root_artifacts` must list at least one artifact.

---

#### 2.2.2 evidence_boundary.json

**Path:** `docs/pios/IG.RUNTIME/run_<run_id>/evidence_boundary.json`

**Role:** Admitted vs excluded input class definition. Defines the boundary of what is inside and outside the RHP. Every path consumed by Stage 2 must be within the boundary declared here.

**Required top-level fields:**

| field | type | constraint |
|-------|------|-----------|
| `schema_version` | string | non-empty |
| `stream` | string | non-empty |
| `run_id` | string | must match RHP run_id |
| `date` | string | ISO 8601 UTC |
| `baseline_commit` | string | non-empty |
| `runtime_input_class` | string or object | non-empty; declares what class of artifacts constitutes valid runtime input |
| `rhp_definition` | object | non-empty; enumerates the RHP artifact set |
| `admitted_input_class` | object or array | non-empty; specifies all admitted artifact paths or path patterns |
| `excluded_input_classes` | array | ≥1 entry; explicitly lists excluded artifact classes with reasons |
| `enforcement` | object | non-empty; defines enforcement behavior on boundary violation |
| `boundary_authority` | string | non-empty |
| `fail_safe` | object | non-empty; defines behavior when a non-RHP artifact is consumed |

**Non-empty constraint:** `admitted_input_class` must enumerate at least the evidence root path from Stage 0. `excluded_input_classes` must list at least one excluded class.

---

#### 2.2.3 admissibility_log.json

**Path:** `docs/pios/IG.RUNTIME/run_<run_id>/admissibility_log.json`

**Role:** Per-artifact admission log. Records the admission decision for every artifact considered during IG processing. The complete basis for provenance tracing.

**Required top-level fields:**

| field | type | constraint |
|-------|------|-----------|
| `schema_version` | string | non-empty |
| `stream` | string | non-empty |
| `run_id` | string | must match RHP run_id |
| `date` | string | ISO 8601 UTC |
| `baseline_commit` | string | non-empty |
| `source_run` | string | non-empty; must match `source_manifest.json.source_run` |
| `entries` | array | ≥1 entry; each entry contains at minimum: `artifact_path` (string), `decision` (enum: `ADMITTED` \| `EXCLUDED`), and `reason` (string) |
| `summary` | object | non-empty; must include total admitted count and total excluded count |

**Non-empty constraint:** `entries` must contain at least one entry with `"decision": "ADMITTED"`. A log with zero admitted artifacts is a FAIL condition.

---

#### 2.2.4 normalized_intake_structure/layer_index.json

**Path:** `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/layer_index.json`

**Role:** Normalized layer-artifact index. Maps each IG layer (L40_2, L40_3, L40_4, etc.) to its constituent admitted artifacts. Stage 2 uses this index to locate artifacts by layer.

**Required top-level fields:**

| field | type | constraint |
|-------|------|-----------|
| `schema_version` | string | non-empty |
| `stream` | string | non-empty |
| `run_id` | string | must match RHP run_id |
| `date` | string | ISO 8601 UTC |
| `source_run` | string | non-empty; must match `admissibility_log.json.source_run` |
| `layers` | object | non-empty; each key is a layer identifier; each value is an array of artifact paths |
| `totals` | object | non-empty; must include total artifact count |

**Non-empty constraint:** `layers` must contain at least one layer with at least one artifact path.

---

#### 2.2.5 normalized_intake_structure/source_profile.json

**Path:** `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/source_profile.json`

**Role:** Resolved source profile. Defines the resolved properties of the source target — platform identity, version, technology stack, and profile governance. Required for Stage 2 entity classification.

**Required top-level fields:**

| field | type | constraint |
|-------|------|-----------|
| `schema_version` | string | non-empty |
| `stream` | string | non-empty |
| `run_id` | string | must match RHP run_id |
| `date` | string | ISO 8601 UTC |
| `source_run` | string | non-empty |
| `source_profile` | object | non-empty; must include at minimum: platform/system identity and version information |
| `profile_governance` | object | non-empty; records the authority under which the profile was resolved |

**Non-empty constraint:** `source_profile` must contain at least one identity field. An empty source profile is a FAIL condition.

---

#### 2.2.6 normalized_intake_structure/provenance_chain.json

**Path:** `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/provenance_chain.json`

**Role:** Full IG pipeline execution chain. Records the complete sequence of IG pipeline stages that produced this RHP, with each stage's inputs, outputs, and invariants. This is the definitive lineage record.

**Required top-level fields:**

| field | type | constraint |
|-------|------|-----------|
| `schema_version` | string | non-empty |
| `stream` | string | non-empty |
| `run_id` | string | must match RHP run_id |
| `date` | string | ISO 8601 UTC |
| `source_run` | string | non-empty; must match across all RHP artifacts |
| `chain` | array | ≥1 entry; each entry records a pipeline stage with: `stage` (string), `inputs` (array), `outputs` (array), and `status` (string) |
| `invariants_confirmed` | object or array | non-empty; records which invariants were checked and confirmed |

**Non-empty constraint:** `chain` must record at least the IG orchestration stage. `invariants_confirmed` must not be empty.

---

## 3. LINEAGE AND PROVENANCE GUARANTEES

### 3.1 Source Traceability Rule

Every artifact admitted into the RHP must trace to a source path within the Stage 0 evidence root:

```
clients/<client_uuid>/source/<source_version>/
```

An artifact with a source path that falls outside the Stage 0 evidence root is an orphan. Orphan artifacts must not appear in `admissibility_log.json` with `"decision": "ADMITTED"`.

### 3.2 provenance_chain.json Requirements

`provenance_chain.json` must:

- enumerate every IG pipeline stage that ran to produce this RHP
- for each admitted artifact: record its `source_path` within the evidence root and its admission status
- include a checksum or hash for any artifact where the IG pipeline computed one; if no checksum was computed, the field is explicitly `null` — it must not be absent
- record `invariants_confirmed` covering at minimum: source boundary integrity, admission completeness, and pipeline stage sequencing

### 3.3 No Orphan Artifacts Rule

An artifact is an orphan if:
- it appears in `admissibility_log.json` with `"decision": "ADMITTED"` but has no entry in `provenance_chain.json.chain`
- OR it is referenced in `layer_index.json` but has no corresponding entry in `admissibility_log.json`

Orphan artifacts are a FAIL condition. The RHP is invalid if any orphan exists.

### 3.4 No External References Rule

No admitted artifact path may reference a location outside the Stage 0 evidence root.
External URLs, network paths, or package registry references are not admissible as artifact paths.
If an admitted artifact references an external dependency by URL within its content, that reference is recorded as an observation — it does not constitute an admitted artifact path.

---

## 4. ADMISSIBILITY CONTRACT (RHP → STAGE 2)

### 4.1 PASS Conditions

The RHP is valid for Stage 2 consumption if and only if ALL of the following are true:

| condition | check |
|-----------|-------|
| AC-01 | All 6 canonical artifacts are present at their defined paths |
| AC-02 | All required fields in each artifact are present and non-empty as specified in Section 2.2 |
| AC-03 | All 6 artifacts parse as valid JSON (no syntax errors) |
| AC-04 | `run_id` is consistent across all 6 artifacts |
| AC-05 | `source_run` is consistent across all artifacts that carry it (`admissibility_log.json`, `layer_index.json`, `source_profile.json`, `provenance_chain.json`) |
| AC-06 | `client_uuid` and `source_version` in RHP identity match corresponding fields in Stage 0 `intake_record.json` |
| AC-07 | `admissibility_log.json.entries` contains at least one entry with `"decision": "ADMITTED"` |
| AC-08 | `provenance_chain.json.chain` covers 100% of admitted artifacts (no orphans) |
| AC-09 | `evidence_boundary.json.admitted_input_class` encloses all source paths in `admissibility_log.json` admitted entries |
| AC-10 | No admitted artifact path falls outside the Stage 0 evidence root |
| AC-11 | `invariants_confirmed` in `provenance_chain.json` is non-empty |
| AC-12 | `normalized_intake_structure/` directory exists and contains all 3 sub-artifacts |

**PASS:** AC-01 through AC-12 all satisfied. Stage 2 may begin.

**Any single condition failing produces FAIL. Stage 2 must not begin.**

### 4.2 FAIL Conditions

See Section 7 (Rejection Conditions) for the exhaustive list.

---

## 5. FREEZE AND IMMUTABILITY

### 5.1 Write-Once Rule

The RHP is write-once.

Once all 6 canonical artifacts are written and the admissibility check (Section 4.1) passes, the RHP directory is sealed. No artifact may be added, modified, or deleted after sealing.

### 5.2 RHP Path

```
docs/pios/IG.RUNTIME/run_<run_id>/
```

This path is fixed at the time the run_id is assigned. It may not be renamed or relocated.

### 5.3 No Mutation After PASS

After the RHP passes AC-01 through AC-12:
- No field in any artifact may be updated
- No artifact may be replaced with a corrected version
- No artifact may be deleted

Any required correction requires a new run with a new `run_id`.

### 5.4 New Run Rule

If a correction, re-ingestion, or updated source produces a new RHP, it must:
- use a new `run_id`
- produce all 6 canonical artifacts from scratch
- not copy or reference prior RHP artifacts

### 5.5 Downstream Immutability Obligation

Stage 2 and all downstream stages must treat the RHP as immutable input.
No stage may write into `docs/pios/IG.RUNTIME/run_<run_id>/`.
No stage may instruct the IG layer to modify an existing RHP.

---

## 6. OUTPUT CONTRACT (TO STAGE 2)

### 6.1 Authorized S2 Input Surface

Stage 2 (Structural Truth — 40.2–40.4) may consume ONLY the following:

| authorized input | path |
|-----------------|------|
| source_manifest.json | `docs/pios/IG.RUNTIME/run_<run_id>/source_manifest.json` |
| evidence_boundary.json | `docs/pios/IG.RUNTIME/run_<run_id>/evidence_boundary.json` |
| admissibility_log.json | `docs/pios/IG.RUNTIME/run_<run_id>/admissibility_log.json` |
| layer_index.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/layer_index.json` |
| source_profile.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/source_profile.json` |
| provenance_chain.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/provenance_chain.json` |
| Stage 0 evidence root (read-only, via paths declared in admissibility_log) | `clients/<client_uuid>/source/<source_version>/` |

### 6.2 What Stage 2 Must Not Read

| forbidden input | reason |
|----------------|--------|
| Raw source tree directly (without going through admissibility_log) | Bypasses IG admission decisions |
| Any IG intermediate artifact not in the RHP | Not part of the authorized handoff surface |
| Any prior RHP for a different `run_id` | Cross-run contamination |
| Any PSEE governance or rendering artifact | Wrong layer |
| Any file in `docs/pios/PSEE.*` | PSEE outputs are not IG handoff inputs |
| Any replay artifact (`*_replay_*`) | Debug isolates; not governed runtime inputs |

### 6.3 Canonical Handoff Reference

Stage 2 receives the RHP through a single reference:

```
docs/pios/IG.RUNTIME/run_<run_id>/
```

Stage 2 must locate artifacts by constructing paths from this root directory and the canonical artifact names defined in Section 2.2. It must not hardcode absolute paths.

### 6.4 S2 Pre-Consumption Check

Before Stage 2 begins, it must confirm:

1. RHP directory exists at the declared path
2. All 6 canonical artifacts are present
3. `run_id` is consistent across artifacts
4. `admissibility_log.json` contains at least one ADMITTED entry

If any check fails, Stage 2 must halt with the appropriate rejection code.

---

## 7. REJECTION CONDITIONS

The RHP must be rejected and Stage 2 must not begin on any of the following:

| code | condition |
|------|-----------|
| `RHP_ARTIFACT_MISSING` | One or more of the 6 canonical artifacts is absent from the RHP path |
| `RHP_ARTIFACT_EMPTY` | A canonical artifact exists but contains an empty JSON object `{}` or empty array `[]` where non-empty content is required |
| `RHP_JSON_MALFORMED` | A canonical artifact is not parseable as valid JSON |
| `RHP_RUN_ID_INCONSISTENT` | `run_id` field differs between two or more canonical artifacts |
| `RHP_SOURCE_RUN_INCONSISTENT` | `source_run` field differs between `admissibility_log.json`, `layer_index.json`, `source_profile.json`, and `provenance_chain.json` |
| `RHP_CLIENT_UUID_MISMATCH` | `client_uuid` in RHP identity does not match `client_uuid` in Stage 0 `intake_record.json` |
| `RHP_SOURCE_VERSION_MISMATCH` | `source_version` in RHP identity does not match `source_version` in Stage 0 `intake_record.json` |
| `RHP_ZERO_ADMITTED_ARTIFACTS` | `admissibility_log.json.entries` contains no entry with `"decision": "ADMITTED"` |
| `RHP_ORPHAN_ARTIFACT` | An artifact appears in `admissibility_log.json` as ADMITTED but has no corresponding entry in `provenance_chain.json.chain` |
| `RHP_LAYER_INDEX_ORPHAN` | An artifact path referenced in `layer_index.json` has no corresponding entry in `admissibility_log.json` |
| `RHP_BOUNDARY_LEAKAGE` | An admitted artifact source path falls outside the Stage 0 evidence root declared in `evidence_boundary.json` |
| `RHP_PROVENANCE_INCOMPLETE` | `provenance_chain.json.chain` does not cover all admitted artifacts |
| `RHP_INVARIANTS_EMPTY` | `provenance_chain.json.invariants_confirmed` is absent, null, or empty |
| `RHP_MISSING_REQUIRED_FIELD` | A required field (per Section 2.2) is absent from a canonical artifact |
| `RHP_DUPLICATE_ENTRIES` | `admissibility_log.json.entries` or `layer_index.json` contains duplicate artifact path entries for the same artifact |
| `RHP_HASH_INCONSISTENCY` | A checksum recorded in `provenance_chain.json` does not match the checksum computed on the referenced artifact at consumption time |
| `RHP_MIXED_SOURCE_VERSION` | Admitted artifacts trace to more than one `source_version` within the Stage 0 evidence root |
| `RHP_DIRECTORY_MISSING` | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/` does not exist |
| `RHP_DUPLICATE_RUN_ID` | A prior sealed RHP with the same `run_id` already exists and was not explicitly superseded |
| `RHP_EXTERNAL_REFERENCE` | An admitted artifact path references a location outside the Stage 0 evidence root (URL, network path, or registry reference) |

**On any rejection: Stage 2 must not begin. The rejection code must be logged with the RHP path and the specific failing artifact.**

---

## 8. GOVERNANCE RULES

**G1 — No RHP, No Structural Computation**
Stage 2 (40.2–40.4) requires a valid, sealed RHP as its sole authorized input.
If no RHP exists, or if the RHP fails admissibility, structural computation must not begin.
Raw IG artifacts and raw source files are not a substitute for the RHP.

**G2 — No Provenance, No Admission**
Every artifact consumed by Stage 2 must appear in `admissibility_log.json` with `"decision": "ADMITTED"` and in `provenance_chain.json.chain`.
An artifact without provenance is not admissible regardless of its content or apparent relevance.

**G3 — No Boundary Compliance, No Consumption**
Every admitted artifact path must fall within the boundary declared in `evidence_boundary.json`.
`evidence_boundary.json` defines the outer limit of what IG has authorized for downstream consumption.
Any artifact path outside this boundary is inadmissible.

**G4 — RHP Is Immutable Input**
Once sealed, the RHP is read-only for all downstream stages.
No stage may request a modification to a sealed RHP.
No stage may treat a modified RHP as the same RHP.
Corrections require a new `run_id`.

**G5 — Stage 2 Must Not Bypass RHP**
Stage 2 must not access the Stage 0 evidence root directly without going through the admissibility surface defined by `admissibility_log.json`.
Direct consumption of unadmitted artifacts from the evidence root is a boundary violation equivalent to consuming a non-RHP input.

---

## 9. BOUNDARY WITH ADJACENT STAGES

### Stage 0 → Stage 1 (IG) Handoff

Stage 1 receives from Stage 0:
- `clients/<client_uuid>/source/<source_version>/intake_record.json`
- Read access to `clients/<client_uuid>/source/<source_version>/` (frozen)

This boundary is defined in BOOTSTRAP.CHAIN.AUTHORITY.01. IG.HANDOFF.AUTHORITY.01 does not redefine it.

### Stage 1 (IG) → Stage 2 Handoff

Stage 1 produces: the RHP at `docs/pios/IG.RUNTIME/run_<run_id>/`.
Stage 2 receives: the RHP only.

Stage 1 responsibilities (IG) end at: sealing the RHP and confirming PASS on AC-01 through AC-12.
Stage 2 responsibilities begin at: reading the sealed RHP and beginning structural classification.

Stage 1 does NOT define structural entity models, telemetry dimensions, or semantic layer outputs. Those are Stage 2 and Stage 3 responsibilities respectively.

---

## Validation at Definition Time

| check | status |
|-------|--------|
| C1 — ig_handoff_authority.md exists | PASS |
| C2 — all 6 canonical artifacts defined with fields | PASS — Section 2.2 (6 artifacts, field-level schemas with types and constraints) |
| C3 — lineage/provenance rules explicit | PASS — Section 3 (source traceability, orphan rule, external reference rule, provenance_chain requirements) |
| C4 — admissibility PASS/FAIL explicit | PASS — Section 4 (AC-01 through AC-12 PASS; FAIL references Section 7) |
| C5 — immutability rules defined | PASS — Section 5 (write-once, no mutation, new run rule, downstream obligation) |
| C6 — S2 consumption boundary explicit | PASS — Section 6 (authorized surface, forbidden inputs, handoff reference, pre-consumption check) |
| C7 — ≥12 rejection conditions | PASS — Section 7 (20 named rejection codes) |
| C8 — governance rules present | PASS — Section 8 (G1–G5) |
| C9 — no implementation details | PASS — no script names, no runtime commands |
| C10 — no other file modified | PASS |
