# CEU Grounding Design Specification

Contract: PI.CEU.GROUNDING.01.DESIGN-CONTRACT.01 / PI.CEU.GROUNDING.01.DESIGN-CONTRACT.02
Status: READY_FOR_EXECUTION_CONTRACT
Mode: DESIGN + PERSIST_ARTIFACT

---

## Authoritative Context

- Deterministic pipeline S01–S08: COMPLETE (PASS — CONDITIONAL)
- CEU coverage baseline:
  - total_surfaces: 30
  - grounded_count: 0
  - source_grounding_ratio: 0.0
  - classification: LOW_STRUCTURAL_EXPRESSION
- CF-01: RESOLVED — no contaminated grounding allowed

---

## 1. Grounding Model Summary

The CEU grounding layer is a deterministic evidence-binding stage that resolves structural surfaces — domains, capabilities, and components identified during 40.x extraction — to verified artifacts in the target client's source tree. Its purpose is to establish whether each surface has a traceable, verifiable root in the actual source being analyzed, as opposed to being a structural descriptor inherited from a reference model, template, or prior client.

Grounding sits between 40.x structural topology and 75.x condition activation because 75.x activation is only valid when it operates on surfaces that can be verified against evidence. Without grounding, activation is structurally complete but evidentially empty. The grounding layer does not alter topology — it annotates it with provenance authority, enabling downstream stages to distinguish evidence-backed surfaces from structural placeholders.

---

## 2. Pipeline Position

```
S01 — INTAKE
  intake/source_manifest.json emitted (authoritative source file index)

S02 — LINEAGE
  lineage/raw_input.json emitted (CEU structural declarations)

S03 — STRUCTURE / 40.x TOPOLOGY
  structural topology outputs emitted
  CEU registry emitted (ceu_registry.json)
  binding model produced (binding_model.json, binding_envelope.json)

→ CEU GROUNDING  [designation: S03.5 / S04-G]
  reads: source_manifest.json, raw_input.json, 40.x topology, ceu_registry.json
  produces: binding/provenance/grounding_state.json
  produces: binding/provenance/grounding_coverage_summary.json
  does NOT modify any upstream artifact

→ GROUNDING COVERAGE RECOMPUTATION
  reads: grounding_state.json
  produces: coverage metrics
  appends: docs/psee/binding_provenance_coverage_registry.json

S07 — 75.x DETERMINISTIC ACTIVATION
  reads: binding_envelope.json + grounding_state.json (for evidence gating)

S08 — 41.x PROJECTION
  reads: 75.x outputs
  gated by: grounding_state (NON_EVIDENCE_BACKED if grounding = ZERO)
```

Grounding MUST run before 75.x and 41.x. Any 75.x activation on surfaces with no grounding entry is permitted structurally but must carry `evidence_status = NON_EVIDENCE_BACKED`. Any 41.x projection over ungrounded surfaces must carry the gated classification.

---

## 3. Grounding Classification Rules

### GROUNDED

A surface receives GROUNDED status only when ALL of the following conditions are simultaneously satisfied:

- G-1: At least one source_path resolves to a file or directory that exists inside the declared target source root.
- G-2: The source_path was produced by a deterministic, allowed mapping source (see Section 4).
- G-3: The mapping is reproducible: given the same inputs, the same mapping is always produced.
- G-4: The mapping is traceable: at least one evidence_ref is attached identifying which input artifact declared the mapping.
- G-5: The path is not contaminated: no contamination flag is set (see Section 8).
- G-6: The path is inside the declared source root: no path traversal, no symlink resolution outside root.
- G-7: The mapping did not originate from a demo, template, or prior-client artifact.

Failure of any single condition demotes the surface from GROUNDED.

### NON_GROUNDED

A surface receives NON_GROUNDED status when it exists structurally but no valid grounding candidate survives validation. Triggers:

- NG-1: No candidate paths found after applying allowed mapping sources.
- NG-2: All candidate paths failed existence validation.
- NG-3: All candidate paths rejected due to contamination.
- NG-4: The surface is abstract (no structural file basis claimed in any input).
- NG-5: The only available path references were inferred from display labels, naming conventions, or semantic similarity.
- NG-6: The surface is a structural expression of a domain concept with no corresponding source artifact in the target tree.

NON_GROUNDED is not a failure state. It is the correct and honest classification for surfaces that cannot be verified.

### DERIVED

A surface receives DERIVED status when:

- D-1: It is computed or projected from one or more GROUNDED surfaces.
- D-2: It does not itself directly map to a real source artifact.
- D-3: Its derivation chain is fully explicit: all parent surface IDs listed in derived_from[].
- D-4: All parents in derived_from[] carry GROUNDED status; a chain may not propagate through NON_GROUNDED parents.
- D-5: The derivation rule is explicit and deterministic.

DERIVED is NOT counted as source-grounded in coverage ratios.

### INVALID

A surface receives INVALID status when a grounding claim was attempted but the claim fails internal consistency:

- I-1: A source_path was provided but does not exist in the target source tree.
- I-2: A source_path was provided but is contaminated.
- I-3: A DERIVED surface references a non-GROUNDED parent.
- I-4: Grounding record is internally inconsistent (e.g., grounding_status = GROUNDED but source_paths is empty).
- I-5: A mapping rule was applied that is not on the allowed list.
- I-6: evidence_refs[] is empty on a surface claiming GROUNDED status.

INVALID is a hard fault. Any grounding_state.json containing INVALID records cannot achieve a PASS verdict.

---

## 4. Allowed Mapping Sources

- MS-1: `intake/source_manifest.json` — path entries in source_artifacts[].path. Highest-authority source.
- MS-2: `lineage/raw_input.json` — lineage records with explicit source_path or source_ref fields. Declared fields only; not inferred.
- MS-3: 40.x structural topology outputs — artifacts that explicitly reference source file paths. Explicit references only.
- MS-4: `ceu_registry.json` — entries carrying source_ref or source_path fields pointing to verifiable target artifacts.
- MS-5: `structure_manifest.json` (40.x output) — entries encoding file or directory paths derived from source scanning, not template inheritance.
- MS-6: Parsed component/module relationships — where 40.x topology produces explicit source file references in import graph edges.

All candidates from any allowed source must still pass path validation (Section 7). Allowed source does not waive path validation.

---

## 5. Forbidden Mapping Sources

- FM-1: Non-existent paths — any path that does not exist in the target source tree.
- FM-2: BlueEdge, demo, or template paths — any path containing BlueEdge identifiers or inherited from a reference/template binding model.
- FM-3: Prior client or cross-client paths — paths originating from a different client UUID's source tree or run directory.
- FM-4: Inferred semantic similarity — any mapping derived from a surface label resembling a file or directory name. No fuzzy matching.
- FM-5: AI-generated or heuristic matching — any mapping produced by a language model, embedding similarity, or heuristic inference engine.
- FM-6: Fallback defaults — any path assigned when no valid mapping was found.
- FM-7: Manually injected grounding without evidence — values hardcoded in a contract, assumed without artifact basis, or supplied by a human without a corresponding artifact record.
- FM-8: Documentation paths without source linkage — paths to documentation artifacts used as grounding evidence without a deterministic rule linking them to the surface's structural scope.
- FM-9: Run artifact paths — paths inside any run directory (psee/runs/, output/, staging/) used as grounding evidence.

---

## 6. Mapping Algorithm

All steps are mandatory and must be executed in order. No step may be skipped.

**Step 1 — Load declared source manifest references**
Load `intake/source_manifest.json`. Extract all source_artifacts[]. Build SOURCE_FILE_SET = {entry.path → entry.sha256}. Build SOURCE_PATH_PREFIXES = set of all unique directory prefixes. Record total file count, source root prefix, source_manifest path as evidence_ref.

**Step 2 — Load lineage records**
Load `lineage/raw_input.json`. Extract any explicit source_path or source_ref fields from CEU declarations. Tag each candidate with origin MS-2.

**Step 3 — Load CEU structural surfaces**
Load `binding/binding_envelope.json` (or `ceu_registry.json` if designated primary). Extract all capability_surfaces[]. Build SURFACE_LIST. Each record carries: surface_id, label, parent_context, path_pattern (may be null), provenance.

**Step 4 — Build canonical source path index**
From SOURCE_FILE_SET build:
- EXACT_PATHS: set of all full relative paths
- DIR_PREFIXES: set of all directory prefix strings

Apply source root stripping: all paths relative to declared source root from source_manifest.json admissibility_metadata.source_dir.

**Step 5 — For each CEU surface, collect candidate source paths from allowed deterministic sources only**
For each surface in SURFACE_LIST:
- 5a. Check raw_input.json lineage records for explicit source_path or source_ref fields matching this surface_id or parent CEU.
- 5b. Check 40.x structural topology outputs for any explicit source file references associated with this surface.
- 5c. Check structure_manifest.json for entries linked to this surface.
- 5d. Collect all candidates, each tagged with: origin_source (MS-1 through MS-6), raw_value, evidence_ref.
- 5e. Do NOT use path_pattern from binding_envelope directly — it may be contaminated (CF-01).
- 5f. If no candidates found: record CANDIDATE_SET = empty.

**Step 6 — Validate candidate paths exist in target source tree**
For each candidate:
- 6a. Normalize path (strip leading/trailing slash).
- 6b. Check EXACT_PATHS (exact file match) or DIR_PREFIXES (directory containment).
- 6c. EXISTENCE_VERIFIED if match found; EXISTENCE_FAILED otherwise.

**Step 7 — Reject contaminated or non-target paths**
For each candidate:
- 7a. Apply contamination detection rules (Section 8).
- 7b. If contamination detected: mark CONTAMINATED, record contamination_flag.
- 7c. Remove all CONTAMINATED candidates from valid set.
- 7d. Retain only EXISTENCE_VERIFIED and non-CONTAMINATED candidates.

**Step 8 — Assign grounding_status**
- 8a. VALID_CANDIDATES non-empty → grounding_status = GROUNDED
- 8b. VALID_CANDIDATES empty, no grounding claim → grounding_status = NON_GROUNDED
- 8c. Surface meets DERIVED conditions → grounding_status = DERIVED
- 8d. Grounding claim present but all candidates failed → grounding_status = INVALID
- 8e. Record mapping_rule applied.

**Step 9 — Attach evidence_refs**
For GROUNDED: evidence_refs[] must contain source path confirmed in target, allowed mapping source (MS-N), artifact filename that declared the reference.
For DERIVED: evidence_refs[] must include references to all parent GROUNDED surfaces.
For NON_GROUNDED and INVALID: evidence_refs[] may be empty or contain rejected references.

**Step 10 — Emit grounding_state.json**
Serialize all surface records per schema in Section 9. Write to `binding/provenance/grounding_state.json`. CREATE_ONLY — fail if file exists.

**Step 11 — Recompute coverage from grounding_state.json**
Apply coverage formulas (Section 10). Emit `binding/provenance/grounding_coverage_summary.json`. Append to `docs/psee/binding_provenance_coverage_registry.json`. All values computed from grounding_state.json only. No hardcoding.

---

## 7. Path Validation Rules

A path is VALID for grounding purposes only when all of the following are true:

- PV-1: **Existence** — path exists in target source tree as exact file match or directory prefix with at least one child file confirmed in SOURCE_FILE_SET.
- PV-2: **Inside target source root** — path does not escape the declared source root. No path traversal sequences (../).
- PV-3: **No symlink escape** — path must not resolve through a symlink to a location outside the declared target source root.
- PV-4: **No non-target client identifiers** — path must not contain the client UUID of any other client, the BlueEdge identifier, or any template/demo-client specific string.
- PV-5: **No label-only derivation** — path must not have been generated by converting a surface label string directly into a path pattern without a deterministic artifact basis.
- PV-6: **Deterministic origin** — path must have a recorded evidence_ref identifying which allowed mapping source (MS-1 through MS-6) produced it.

---

## 8. Contamination Rules

Hard-reject conditions. Any candidate matching any rule is immediately rejected and flagged. No override permitted.

| Flag | Condition |
|---|---|
| CONTAMINATED_BLUEEDGE | Path contains "blueedge", "blueedge-platform", or any case variant |
| CONTAMINATED_DEMO_TEMPLATE | Path contains any known demo-client, template-client, or reference-run identifier |
| CONTAMINATED_PRIOR_CLIENT | Path contains the UUID of any client other than the target client UUID |
| CONTAMINATED_RUN_ARTIFACT | Path begins with or resolves inside any run directory (psee/runs/, output/, staging/, reports/) |
| CONTAMINATED_DOC_ONLY | Path points to a documentation artifact without a deterministic rule linking it to the surface's structural scope |
| CONTAMINATED_INHERITED_BINDING | Path originated from a binding model whose client_uuid is not the target client UUID (CF-01 class) |

Resolution:
- Surface with only contaminated candidates → NON_GROUNDED (no claim) or INVALID (claim made)
- Surface with at least one non-contaminated, existence-verified candidate → GROUNDED (if all Section 3 conditions met)
- Contamination flags always recorded in contamination_flags[] regardless of final grounding_status

---

## 9. Artifact Contract — grounding_state.json

Path: `binding/provenance/grounding_state.json`

```json
{
  "schema_version": "1.0",
  "contract": "PI.CEU.GROUNDING.01.EXECUTION-CONTRACT.01",
  "client_id": "<target client UUID>",
  "run_id": "<run identifier>",
  "source_root": "<value of admissibility_metadata.source_dir from source_manifest.json>",
  "generated_at": "<ISO 8601 date>",
  "mode": "CREATE_ONLY",
  "inputs": {
    "source_manifest": "<relative path to intake/source_manifest.json>",
    "raw_input": "<relative path to lineage/raw_input.json>",
    "structural_topology": "<relative path to primary 40.x topology artifact>",
    "ceu_registry": "<relative path to ceu_registry.json>"
  },
  "summary": {
    "total_surfaces": 0,
    "grounded_count": 0,
    "non_grounded_count": 0,
    "derived_count": 0,
    "invalid_count": 0,
    "source_grounding_ratio": 0.0,
    "classification": "<ZERO_GROUNDING | LOW_STRUCTURAL_EXPRESSION | PARTIAL_SOURCE_GROUNDING | SOURCE_TRUTH_BOUND | INVALID_GROUNDING_STATE>"
  },
  "surfaces": [
    {
      "surface_id": "<DOM-XX-Y or equivalent>",
      "surface_type": "<DOMAIN | CAPABILITY | COMPONENT | OTHER>",
      "surface_label": "<human-readable label from source record>",
      "grounding_status": "<GROUNDED | NON_GROUNDED | DERIVED | INVALID>",
      "source_paths": [],
      "evidence_refs": [
        {
          "origin_source": "<MS-1 through MS-6>",
          "artifact": "<artifact filename>",
          "field": "<field path within artifact>",
          "raw_value": "<value as read from artifact>"
        }
      ],
      "mapping_rule": "<step identifier and rule name applied in Step 8>",
      "validation_flag": "<PASS | FAIL>",
      "validation_reasons": [],
      "derived_from": [],
      "contamination_flags": []
    }
  ]
}
```

Schema constraints:
- `schema_version` required, must be "1.0"
- `mode` must be "CREATE_ONLY"
- Summary counts must be internally consistent (Section 10)
- Every surface must have `surface_id` and `grounding_status`
- GROUNDED surfaces must have ≥1 entry in `source_paths` and ≥1 entry in `evidence_refs`
- DERIVED surfaces must have ≥1 entry in `derived_from`; `source_paths` may be empty
- `contamination_flags` must be present (empty array if no contamination)
- `validation_reasons` must be present (empty array if PASS)

---

## 10. Coverage Recomputation Rules

All coverage values computed exclusively from `grounding_state.json surfaces[]`. No hardcoded values permitted.

```
total_surfaces         = count(surfaces[])
grounded_count         = count(surfaces[] where grounding_status == "GROUNDED")
non_grounded_count     = count(surfaces[] where grounding_status == "NON_GROUNDED")
derived_count          = count(surfaces[] where grounding_status == "DERIVED")
invalid_count          = count(surfaces[] where grounding_status == "INVALID")

source_grounding_ratio = grounded_count / total_surfaces
  (if total_surfaces == 0: source_grounding_ratio = 0.0)

consistency check (hard fault if fails):
  grounded_count + non_grounded_count + derived_count + invalid_count == total_surfaces
```

Counting rules:
- DERIVED does NOT count toward source_grounding_ratio
- INVALID does NOT count toward source_grounding_ratio
- NON_GROUNDED does NOT count toward source_grounding_ratio
- Only GROUNDED contributes to source_grounding_ratio

---

## 11. Classification Thresholds

| Classification | Condition |
|---|---|
| ZERO_GROUNDING | source_grounding_ratio == 0.0 |
| LOW_STRUCTURAL_EXPRESSION | 0.0 < ratio ≤ 0.30 |
| PARTIAL_SOURCE_GROUNDING | 0.30 < ratio ≤ 0.70 |
| SOURCE_TRUTH_BOUND | ratio > 0.70 |
| INVALID_GROUNDING_STATE | invalid_count > 0 OR consistency check fails OR contamination present in GROUNDED surfaces |

Precedence (highest to lowest): INVALID_GROUNDING_STATE > SOURCE_TRUTH_BOUND > PARTIAL_SOURCE_GROUNDING > LOW_STRUCTURAL_EXPRESSION > ZERO_GROUNDING

INVALID_GROUNDING_STATE overrides all ratio-based classifications: a single INVALID record triggers it even if ratio >= 0.70.

Expected classification for run_02_oss_fastapi before grounding execution: ZERO_GROUNDING

---

## 12. Validation Rules

| Check | Rule |
|---|---|
| V-01 | JSON schema valid: all required top-level fields present |
| V-02 | Count consistency: grounded + non_grounded + derived + invalid == total_surfaces |
| V-03 | GROUNDED paths non-empty: every GROUNDED surface has source_paths[] with ≥1 entry |
| V-04 | GROUNDED paths exist: every source_paths[] entry confirmed in SOURCE_FILE_SET or SOURCE_PATH_PREFIXES |
| V-05 | Evidence refs present: every GROUNDED surface has ≥1 evidence_ref with origin_source, artifact, field, raw_value |
| V-06 | Derived references valid: every DERIVED surface has ≥1 surface_id in derived_from[], each confirmed GROUNDED |
| V-07 | No INVALID for PASS: invalid_count == 0 required for PASS verdict |
| V-08 | No contamination in GROUNDED: no GROUNDED surface has any contamination_flags[] entry |
| V-09 | No upstream mutation: binding_envelope.json, binding_model.json, source_manifest.json, raw_input.json, 75.x and 41.x artifacts retain identical checksums |
| V-10 | Mode compliance: mode == "CREATE_ONLY"; no overwrite of existing grounding_state.json |
| V-11 | Ratio formula: source_grounding_ratio == grounded_count / total_surfaces (≥4 decimal places) |
| V-12 | Classification matches threshold: classification value matches Section 11 rules |

---

## 13. Pass / Fail Criteria

### PASS requires all of the following

- grounding_state.json schema is valid (V-01)
- All counts reconcile exactly (V-02)
- No contaminated paths in GROUNDED surfaces (V-08)
- All GROUNDED surfaces have verified target-source paths (V-03, V-04)
- All GROUNDED surfaces have evidence_refs (V-05)
- Coverage fully recomputable from surfaces[] without external input (V-02, V-11)
- No upstream artifacts modified (V-09)
- invalid_count == 0 (V-07)
- Classification correctly derived from ratio (V-12)

### FAIL triggers

- Any grounding path does not exist in target source tree
- Any grounding path is contaminated (BlueEdge, demo, template, prior-client)
- Any heuristic or AI mapping was used
- Any count is hardcoded or unreconciled against surfaces[]
- Any DERIVED surface is counted in source_grounding_ratio
- Any INVALID surface is present in surfaces[]
- Any upstream artifact checksum has changed
- source_grounding_ratio was assumed or carried forward rather than computed
- mode is not CREATE_ONLY
- grounding_state.json overwrites an existing artifact

---

## 14. Future Execution Contract Boundary

Designation: PI.CEU.GROUNDING.01.EXECUTION-CONTRACT.01

### Permitted

- Read `intake/source_manifest.json`
- Read `lineage/raw_input.json`
- Read 40.x topology artifacts (`structure_manifest.json`, `ceu_registry.json`)
- Read `binding/binding_envelope.json` (surface list only; no modification)
- Scan target source tree for existence validation using paths from allowed mapping sources only
- Execute the mapping algorithm (Section 6) deterministically
- Create `binding/provenance/grounding_state.json` (CREATE_ONLY; fail if file exists)
- Create `binding/provenance/grounding_coverage_summary.json` (CREATE_ONLY)
- Append to `docs/psee/binding_provenance_coverage_registry.json`

### Prohibited

- Modify any 40.x output artifact
- Modify source files in the target source tree
- Modify or overwrite `binding/binding_envelope.json` or `binding/binding_model.json`
- Modify or overwrite any prior provenance artifact
- Modify or overwrite any 75.x or 41.x artifact
- Patch data to force grounding (fabricating source_paths or evidence_refs)
- Use BlueEdge, demo, or template fallback paths in any candidate resolution step
- Carry forward grounding values from a prior run or prior client
- Accept hardcoded counts or ratios
- Skip any algorithm step
- Produce grounding_state.json without running all Section 12 validation checks

---

## 15. Final Design Verdict

READY_FOR_EXECUTION_CONTRACT

All design sections are complete, internally consistent, and non-contradictory. The grounding model is deterministic, evidence-first, and contamination-resistant. The artifact schema is fully specified. The algorithm is step-ordered with no ambiguous branches. Coverage recomputation formulas are closed-form and verifiable. The execution boundary is explicit.

Preconditions before the execution contract runs:
- Target run directory must contain a completed S01–S08 artifact set
- `intake/source_manifest.json` must be present and parseable
- Target client source tree must be accessible for existence validation
- `binding/provenance/grounding_state.json` must NOT already exist (CREATE_ONLY)
