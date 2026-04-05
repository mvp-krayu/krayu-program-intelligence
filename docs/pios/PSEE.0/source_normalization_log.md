# PSEE.0 — Source Normalization Log

**Stream:** PSEE.0
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document classifies all path duplication and structural ambiguity found in the Phase A corpus before any transformation rules are applied. Failure to normalize duplicate paths before analysis risks treating packaging artifacts as distinct system layers — which would incorrectly inflate the inferred architecture.

**Value:** Prevents architectural over-counting. Ensures downstream rule derivation operates on the actual system structure, not extraction artifacts.

---

#### METHODOLOGY LAYER

1. Detect all path segments that repeat within the same path (e.g., `/backend/backend/`).
2. For each duplication, retrieve direct evidence of its origin: extraction log, diff commands, or archive structure metadata.
3. Classify the duplication as one of: EXTRACTION_ARTIFACT | PACKAGING_BOUNDARY | ARCHITECTURAL_STRUCTURE.
4. Collapse non-architectural duplications by declaring the canonical reference path.
5. Record any positions where classification could not be resolved.

---

#### TECHNICAL LAYER

### Duplication 1 — extracted/backend/backend/

**Observed path:** `source-v3.23/extracted/backend/backend/`

**Pattern:** The directory segment `backend` appears twice in immediate succession.

**Evidence chain:**

| Source | Content |
|---|---|
| analysis/00_extraction_log.md | "Archives were extracted into isolated folders to preserve origin separation. Extraction paths: extracted/backend, extracted/frontend, extracted/platform" |
| analysis/00_extraction_log.md | "canonical repository path after extraction: .../source-v3.23/extracted/platform/blueedge-platform" |
| analysis/01_repository_classification.md | "blueedge-backend-v3_23_0-COMPLETE.tar — Root folder: backend/ — Confidence: High" |
| analysis/03_overlap_validation.md | "diff -qr extracted/backend/backend extracted/platform/blueedge-platform/backend — Result: No differences detected" |

**Classification:** PACKAGING_BOUNDARY

**Explanation:** The outer `extracted/backend/` is the extraction destination directory created by the operator to isolate the backend archive. The inner `backend/` is the root folder inside the archive itself (i.e., the archive's top-level directory is named `backend`). This is a standard extraction artifact: `tar xf blueedge-backend.tar -C extracted/backend/` produces `extracted/backend/backend/` when the archive root is named `backend`.

**Canonical reference:** `source-v3.23/extracted/backend/backend/` is the canonical code root. The outer `extracted/backend/` directory contains only the inner `backend/` subdirectory and has no independent meaning.

**Collapse rule:** In all downstream analysis, reference the inner path `extracted/backend/backend/` directly. Do not treat `extracted/backend/` as a distinct architectural layer.

---

### Duplication 2 — extracted/frontend/frontend/

**Observed path:** `source-v3.23/extracted/frontend/frontend/`

**Pattern:** Same double-nesting as Duplication 1.

**Evidence chain:**

| Source | Content |
|---|---|
| analysis/00_extraction_log.md | "Extraction paths: extracted/backend, extracted/frontend, extracted/platform" |
| analysis/01_repository_classification.md | "blueedge-frontend-v3_23_0-COMPLETE.tar — Root folder: frontend/ — Confidence: High" |
| analysis/03_overlap_validation.md | "diff -qr extracted/frontend/frontend extracted/platform/blueedge-platform/frontend — Result: No differences detected" |

**Classification:** PACKAGING_BOUNDARY

**Explanation:** Identical to Duplication 1. `extracted/frontend/` is the extraction container; `extracted/frontend/frontend/` is the archive root. The inner path is the canonical reference.

**Canonical reference:** `source-v3.23/extracted/frontend/frontend/`

**Collapse rule:** Reference `extracted/frontend/frontend/` directly in all analysis.

---

### Duplication 3 — Standalone vs Platform-Embedded (Structural Overlap)

**Observed positions:**
- `extracted/backend/backend/` ≡ `extracted/platform/blueedge-platform/backend/`
- `extracted/frontend/frontend/` ≡ `extracted/platform/blueedge-platform/frontend/`

**Evidence chain:**

| Source | Content |
|---|---|
| analysis/03_overlap_validation.md | "diff -qr extracted/backend/backend extracted/platform/blueedge-platform/backend — No differences detected. Verdict: Standalone backend archive is an exact duplicate." |
| analysis/03_overlap_validation.md | "diff -qr extracted/frontend/frontend extracted/platform/blueedge-platform/frontend — No differences detected. Verdict: Standalone frontend archive is an exact duplicate." |
| analysis/01_repository_classification.md | "Canonical Repository Verdict: The canonical repository for Source v3.23 is identified as blueedge-platform" |

**Classification:** PACKAGING_BOUNDARY → CANONICAL RESOLVED

**Explanation:** The standalone backend and frontend archives are confirmed bit-for-bit identical copies of the corresponding subdirectories in the integrated blueedge-platform repository. This is not an architectural ambiguity — the platform repository is the canonical source of truth. The standalone archives exist for isolated component validation and do not represent a separate codebase.

**Canonical target:** `source-v3.23/extracted/platform/blueedge-platform/` (integrated repository)

**Collapse rule:** For code evidence, the canonical isolated-component reference is `extracted/backend/backend/` or `extracted/frontend/frontend/` (for module-level analysis). For integrated system context, use `extracted/platform/blueedge-platform/`. The two are interchangeable for file content (verified identical); the difference is only in context (isolated vs. integrated).

---

### Path Normalization Summary

| Duplication ID | Path | Classification | Canonical Reference | Collapsed |
|---|---|---|---|---|
| DUP-01 | extracted/backend/backend/ | PACKAGING_BOUNDARY | extracted/backend/backend/ (inner) | YES — outer dir has no architectural meaning |
| DUP-02 | extracted/frontend/frontend/ | PACKAGING_BOUNDARY | extracted/frontend/frontend/ (inner) | YES — outer dir has no architectural meaning |
| DUP-03 | standalone ≡ platform/backend | PACKAGING_BOUNDARY | platform/blueedge-platform/ (canonical) | YES — standalones = validation copies |
| DUP-04 | standalone ≡ platform/frontend | PACKAGING_BOUNDARY | platform/blueedge-platform/ (canonical) | YES — standalones = validation copies |

**No ARCHITECTURAL_STRUCTURE duplications detected.**

All detected duplications are PACKAGING_BOUNDARY origin and have been collapsed with explicit canonical references.

---

### Unresolved Ambiguities

None. All path duplications have been classified and collapsed using direct diff evidence from analysis/03_overlap_validation.md.

---

#### EVIDENCE LAYER

| Normalization action | Evidence source |
|---|---|
| Outer backend/ = extraction container | analysis/00_extraction_log.md — extraction paths documented |
| Inner backend/ = archive root | analysis/01_repository_classification.md — root folder identified as "backend/" |
| Standalone ≡ platform/backend | analysis/03_overlap_validation.md — diff returned no differences |
| Canonical target = blueedge-platform | analysis/01_repository_classification.md — canonical verdict |

---

#### LIMITATIONS & BOUNDARIES

- Overlap detection used `diff -qr` comparison output from Phase A extraction metadata, not a re-run comparison. File-level diff was confirmed identical at extraction time; any post-extraction mutations would not be detected here.
- Only path-level duplication is addressed here. Sub-file content variation between platform-embedded and standalone components is declared as US-01/US-02 in normalized_evidence_map.md.
- No EXTRACTION_ARTIFACT or ARCHITECTURAL_STRUCTURE duplications were found; the classification set is complete.

---

#### REUSABILITY STATEMENT

To apply this normalization to another repository extraction:
1. Look for repeated path segments (e.g., `repo/repo/`, `backend/backend/`). These are typically extraction container artifacts.
2. Cross-reference with the extraction log if available to confirm the archive root folder name.
3. Run `diff -qr` between standalone extracted components and their counterparts in an integrated repository to confirm canonical equivalence.
4. Declare PACKAGING_BOUNDARY explicitly — do not leave the ambiguity unaddressed in downstream analysis.
5. If diff is not available, declare as unknown-space (do not assume equivalence).

---

#### STATUS

| Check | Result |
|---|---|
| Path duplications detected | 4 (DUP-01 through DUP-04) |
| All classified | COMPLETE |
| Non-architectural duplications collapsed | COMPLETE |
| Unresolved architectural ambiguities | 0 |
| STRICT RULE compliance (no unvalidated duplication treated as distinct layer) | CONFIRMED |

**SOURCE NORMALIZATION: PASS**
