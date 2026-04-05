# PSEE-OPS.0 — Boundary Definition Model

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Authority:** PSEE.1/psee_decision_contract_v1.md §Section 1 PC-02;
               PSEE.2/variance_resolver_spec.md SV-01..SV-05, SV-09

---

## Boundary Document Schema

The boundary definition is the operator's authoritative declaration of execution scope. It is the direct input to PSEE.1 PC-02. Every PSEE decision that depends on scope (DP-2-01, DP-2-02, DP-2-04, DP-3-01, DP-4-02) reads from this document. It cannot be amended during execution; it is a pre-execution declaration.

---

### Full Boundary Document Schema

```json
{
  "schema_version":                   "1.0",
  "system_name":                      "string",     // matches system_identity.system_name
  "system_version":                   "string",     // matches system_identity.version
  "boundary_document_version":        "string",     // for operator versioning practice (CP-09 REFERENCE_ONLY)
  "primary_evidence_origin_paths": [  // REQUIRED — list of top-level source directories to ingest
    {
      "path":       "string",         // absolute or corpus_root-relative path
      "label":      "string"          // human-readable label (informational; not used by engine)
    }
  ],
  "provenance_only_paths": [          // REQUIRED (may be empty) — archives/artifacts NOT to ingest
    "string"
  ],
  "explicitly_excluded_paths": [      // REQUIRED (may be empty list []) — paths to exclude
    "string"
  ],
  "accepted_evidence_classes": [      // REQUIRED — valid evidence type labels
    "string"                          // e.g., "code", "configuration", "documentation", "structural_artifact"
  ],
  "source_materials": {               // OPTIONAL — annotations about Phase A material quality
    "annotations": [
      {
        "path":        "string",      // path (or path prefix) being annotated
        "annotation":  "string"       // e.g., "lightweight extraction analysis notes"
      }
    ]
  },
  "system_identity_reference": {      // OPTIONAL — additional identity confirmation material
    "type":           "string",       // e.g., "version_file", "package_json", "manifest"
    "path":           "string"
  }
}
```

---

### Minimum Viable Boundary

Per PSEE.1 SV-01, the minimum fields required to proceed without STOP-01 or ESC-03:

| Field | Minimum requirement |
|---|---|
| `primary_evidence_origin_paths` | At least 1 entry with accessible `path` |
| `provenance_only_paths` | Present; may be empty array `[]` |
| `explicitly_excluded_paths` | Present; may be empty array `[]` (cannot be absent — ESC-03 fires if absent) |
| `accepted_evidence_classes` | At least one of: `"code"`, `"documentation"`, `"configuration"` |

Fields that are absent or null when required trigger STOP-01 or ESC-03 per the SV dispatch table.

---

## Inclusion and Exclusion Rules

### Inclusion: primary_evidence_origin_paths

- Defines which top-level directories are ingested as Phase A evidence.
- Each path creates exactly one `EvidenceDomain` in Phase 3 (R-GRP-01).
- N paths → N domains. No default count (FB-03 exclusion).
- Paths must be within `corpus_root` (validated at engine entry).

**Disambiguation rule:** If two paths share a prefix (one is a sub-directory of another), both are accepted as separate domains. The engine does not merge them. If this was not the operator's intent, the operator should remove one before submission.

### Provenance-only: provenance_only_paths

- Defines archive or metadata files that are present in the corpus but not Phase A evidence.
- Files matching these paths receive `intake_status = NOT INGESTED` (FX-02).
- No content inspection is performed on these files.
- May be `[]` (nothing is provenance-only).

### Exclusion: explicitly_excluded_paths

- Defines paths the operator explicitly excludes from ingestion.
- Files matching these paths receive `intake_status = EXCLUDED; NOT ACCESSED` (FX-03).
- Compliance records are written per excluded file.
- `[]` is a valid declaration: "nothing is excluded."
- This field MUST be explicitly present. Absence → DP-2-01 GRAY-ZONE → ESC-03.

**Exclusion precedence:** If a path appears in both `provenance_only_paths` and `explicitly_excluded_paths`, `explicitly_excluded_paths` takes precedence. The file is recorded as EXCLUDED.

### Source materials annotations

- Used to trigger the reduced-authority downgrade (R-FLT-02, DP-S-01, DP-2-03).
- If an annotation for a path contains a reduced-authority signal (CT-02 vocabulary: "lightweight", "support only", "metadata only", "context only", "analysis only", "extracted notes", "not primary evidence"), the matching files receive `intake_status = ACCEPTED-SUPPORT-ONLY`.
- If `source_materials` is absent or contains no reduced-authority annotations, no downgrade occurs (SV-09: files remain ACCEPTED).

---

## Inline Boundary Mode

When `boundary_definition.source = "inline"`, the operator supplies the boundary fields directly in the `OperatorInput` without creating a separate document file. The `InvocationLayer` constructs an in-memory boundary object from the inline fields.

Inline boundary must satisfy the same minimum viable boundary requirements as a document-sourced boundary. Validation is identical.

**Intended use:** Inline mode is provided for operators who generate boundary definitions programmatically. It does not reduce the scope requirements.

---

## Ambiguity-Free Definition Rules (Section G Question 2)

The following rules ensure the boundary definition is unambiguous before the engine is invoked:

**Rule 1 — Path exclusivity:** The `primary_evidence_origin_paths`, `provenance_only_paths`, and `explicitly_excluded_paths` sets must not contain contradictory entries for the same path. Overlap is resolved deterministically (exclusion > provenance > primary), but the operator is warned of the overlap in the pre-invocation validation report.

**Rule 2 — No wildcard paths:** Path entries must be literal directory or file paths. Glob patterns are not permitted. Pattern-based exclusion must be enumerated explicitly or delegated to operator pre-processing before submission.

**Rule 3 — No capability labels:** `primary_evidence_origin_paths[].label` is informational only. The engine uses the `path` field exclusively. Capability labels in `label` do not affect domain formation (FB-04 / H-01 BLOCKED).

**Rule 4 — No open scope:** An absent `explicitly_excluded_paths` is not treated as "nothing excluded." It is treated as a GRAY-ZONE requiring operator clarification (ESC-03). The operator must explicitly declare the exclusion scope.

**Rule 5 — Accepted evidence classes must be type labels:** `accepted_evidence_classes` entries must be evidence type labels (`"code"`, `"documentation"`, `"configuration"`, `"structural_artifact"`), not functional capability labels. Capability labels in this field trigger H-03 BLOCKED enforcement.

---

## Boundary Document Versioning (REFERENCE_ONLY)

CP-09 (`REFERENCE_ONLY`) describes an operator practice of versioning boundary documents across iterations of the same corpus. This practice:
- Is not enforced by the engine
- Does not affect any DP outcome
- Is provided as optional guidance for operators who want to track scope changes

Operators who use `boundary_document_version` are recording their own boundary evolution history. The engine uses only the current version of the boundary document; it does not compare versions.

---

## DP Dependency Map

| DP | Reads from boundary | What it reads |
|---|---|---|
| DP-0-02 | Presence check | Is the boundary document present? |
| DP-2-01 | `explicitly_excluded_paths` | Is the field present? |
| DP-2-02 | `provenance_only_paths` | Is file path in the provenance-only set? |
| DP-S-01/DP-2-03 | `source_materials.annotations` | Is there a reduced-authority annotation? |
| DP-2-04 | `explicitly_excluded_paths` | Is file path in the exclusion set? |
| DP-3-01 | `primary_evidence_origin_paths` | Are all listed paths assigned to domains? |
| DP-0-04 | `system_identity_reference` | Does the boundary identity match Phase B? |

---

#### STATUS

| Check | Result |
|---|---|
| Full boundary schema defined | CONFIRMED |
| Minimum viable boundary specified | CONFIRMED |
| Inclusion / exclusion / provenance rules specified | CONFIRMED |
| Ambiguity-free definition rules defined (Section G Q2) | CONFIRMED |
| DP dependency map complete | CONFIRMED |
| Source materials annotation and SV-09 alignment confirmed | CONFIRMED |
| No canonical mutation | CONFIRMED |

**BOUNDARY DEFINITION MODEL: COMPLETE**
