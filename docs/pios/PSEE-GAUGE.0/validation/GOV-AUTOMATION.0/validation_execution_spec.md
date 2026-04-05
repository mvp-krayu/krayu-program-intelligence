# GOV-AUTOMATION.0 — Validation Execution Specification

**Stream:** GOV-AUTOMATION.0
**Family:** GOV
**Date:** 2026-04-05
**Branch:** feature/pios-core
**Output namespace:** docs/pios/PSEE-GAUGE.0/validation/GOV-AUTOMATION.0/
**Authority:** docs/pios/PSEE-GAUGE.0/validation/GOV-VALIDATION.0/psee_gauge_validation_contract.md

---

## Purpose

This document specifies the design and interpretation of each check implemented in `scripts/governance/validate_psee_gauge.sh`. It defines:
- what each check tests
- what artifact(s) it examines
- how its pass/fail criterion maps to GOV-VALIDATION.0 semantic checks
- interpretation decisions made to ensure the script is both accurate and deterministic

---

## Script Identity

```
script:          scripts/governance/validate_psee_gauge.sh
language:        bash
shell directives: set -euo pipefail
dependencies:    none (git, grep, find — standard POSIX tools)
mutations:       NONE — read-only validation
exit codes:      0 = GOV.1 PASS / 1 = GOV.1 FAIL
```

---

## CHECK 1 — Artifact Count

**Test:** `find docs/pios/PSEE-GAUGE.0 -maxdepth 1 -name "*.md" | wc -l`

**PASS:** count = 8

**FAIL:** count ≠ 8

**Notes:** The `-maxdepth 1` flag ensures subdirectory artifacts (including GOV-VALIDATION.0 and GOV-AUTOMATION.0 outputs) are excluded from the count. Only the 8 governed PSEE-GAUGE.0 root artifacts are counted.

**Maps to GOV-VALIDATION.0:** CHECK-001

---

## CHECK 2 — Required Files

**Test:** File presence check for each of the 8 mandated artifact names.

**PASS:** All 8 files exist at expected paths.

**FAIL:** Any file absent.

**Required file list:**
```
gauge_score_model.md
dimension_projection_model.md
confidence_and_variance_model.md
review_surface_linkage.md
projection_logic_spec.md
operator_visibility_contract.md
gauge_rendering_contract.md
execution_manifest.md
```

**Maps to GOV-VALIDATION.0:** CHECK-002

---

## CHECK 3 — Namespace Integrity

**Test:** `git diff --name-only HEAD` inspected for the following upstream paths:
```
docs/pios/PSEE.1
docs/pios/PSEE.2
docs/pios/PSEE-OPS.0
docs/pios/PSEE.X
docs/governance
```

**PASS:** No modified files in any upstream path.

**FAIL:** Any upstream file appears in git diff output.

**Notes:** This check catches namespace violations that would indicate PSEE-GAUGE.0 modified upstream artifacts. It compares against `HEAD` — the last committed state. If the script is run before committing, any staged or unstaged changes to upstream files will be detected.

**Maps to GOV-VALIDATION.0:** CHECK-003..008

---

## CHECK 4 — Traceability Markers

**Test:** Grep for presence of traceability markers in their designated files.

| Marker | Required in | Rationale |
|---|---|---|
| `DP-` | gauge_score_model.md | Score components must cite decision points |
| `NCB-` | review_surface_linkage.md | Non-canonical boundary rules must be present |
| `PR-` | projection_logic_spec.md | Projection rules must be labeled |

**PASS:** Each marker found in its designated file.

**FAIL:** Any marker absent from its designated file.

**Maps to GOV-VALIDATION.0:** CHECK-009..021 (verifies traceability markers exist; full content traceability requires manual CHECK-009..025 per psee_gauge_traceability_checks.md)

---

## CHECK 5 — Forbidden CP-xx Pattern Usage

**Test:** `grep -n "CP-[0-9]"` applied to:
- `gauge_score_model.md`
- `projection_logic_spec.md`

**PASS:** Zero matches in both files.

**FAIL:** Any `CP-[digit]` pattern found.

**Pattern rationale:** `CP-[0-9]` matches actual PSEE.X candidate pattern IDs (CP-01 through CP-09). It does NOT match the literal placeholder text `CP-xx` used in prohibition statements (e.g., "no CP-xx patterns applied"), which does not contain a digit. This distinction ensures prohibition documentation does not trigger the check.

**Scope rationale:** These two files are the primary gauge scoring/projection authority. A CP-xx ID appearing here would indicate direct invocation of a non-canonical pattern in core gauge logic.

**Maps to GOV-VALIDATION.0:** CHECK-026, CHECK-028

---

## CHECK 6 — PSEE.X Boundary

**Test:** `grep -n "CP-[0-9]"` applied to the three formula authority files:
- `gauge_score_model.md`
- `dimension_projection_model.md`
- `projection_logic_spec.md`

**PASS:** Zero matches across all three files.

**FAIL:** Any `CP-[digit]` pattern found.

**Scope rationale:** These three files collectively define gauge computation (score, dimensions, projections). No PSEE.X candidate pattern ID may appear as a computation input in any of them. Files outside this set (confidence_and_variance_model.md, gauge_rendering_contract.md, review_surface_linkage.md) may legitimately reference CP-xx IDs in the following ways:
- `confidence_and_variance_model.md`: explicit prohibition statement ("CP-01..09 are NOT applied")
- `gauge_rendering_contract.md §PANEL-03B`: static review counter constants (CP-03, CP-05, CP-09 as REFERENCE_ONLY display values)
- `review_surface_linkage.md`: designated PSEE.X review surface (expected home for CP-xx references)

**Note on CHECK 5 vs CHECK 6 relationship:** CHECK 5 and CHECK 6 overlap for gauge_score_model.md and projection_logic_spec.md (both check CP-[0-9] in those files). CHECK 6 extends the boundary enforcement to dimension_projection_model.md. The redundancy is intentional — double enforcement of the critical score/projection boundary.

**Maps to GOV-VALIDATION.0:** CHECK-026, CHECK-027, CHECK-028

---

## CHECK 7 — No UI / Commercial Leakage

**Test:** Pattern scan across 7 content artifacts (execution_manifest.md excluded).

**Scope exclusion:** `execution_manifest.md` is a governance record. Its §8 (Downstream Handover) legitimately names downstream technologies (e.g., "React, Vue, or other") in the handover inventory. These are descriptions of what downstream MUST provide, not implementation artifacts. Including the manifest in CHECK 7 would produce false positives that obscure real violations in content artifacts.

**Frontend code patterns detected:**
```
import React
from 'react'
from "react"
React.
useState(
useEffect(
className=
<div>
<span>
<button>
<input
.css"
.scss"
style={
```

**Commercial language patterns detected:**
```
pricing
revenue
monetiz
go-to-market
market-leading
enterprise-grade
ROI\b
```

**PASS:** Zero matches in any of the 7 content files.

**FAIL:** Any match found.

**Interpretation note on "UI" keyword:** The stream contract references "UI" as a forbidden keyword. However, `gauge_rendering_contract.md` legitimately uses "UI" in the following contexts:
- "for later UI implementation" (purpose statement declaring the doc is pre-implementation)
- "(CLAUDE.md §13 UI/DEMO RULES)" (citation of governance rules that prohibit UI code)

These uses document the absence of UI code — not the presence of it. The script implements CHECK 7 with actual frontend code PATTERNS rather than the bare keyword "UI" to avoid false positives while capturing true leakage (actual React/CSS/HTML code constructs).

**Maps to GOV-VALIDATION.0:** CHECK-038, CHECK-039, CHECK-040

---

## Relationship to GOV-VALIDATION.0 Manual Checks

This script automates a subset of GOV-VALIDATION.0 compliance:

| Script check | GOV-VALIDATION.0 checks automated |
|---|---|
| CHECK 1 | CHECK-001 |
| CHECK 2 | CHECK-002 |
| CHECK 3 | CHECK-003..008 |
| CHECK 4 | Presence indicator for CHECK-009..021 (not full content traceability) |
| CHECK 5 | CHECK-026, CHECK-028 (partial) |
| CHECK 6 | CHECK-026, CHECK-027, CHECK-028 |
| CHECK 7 | CHECK-038..040 |

**Checks NOT automated by this script** (require manual execution per psee_gauge_traceability_checks.md and psee_gauge_boundary_checks.md):
- CHECK-009..025: Full traceability (content-level authority citation verification)
- CHECK-029..030: PSEE.X label enforcement and static constant verification
- CHECK-031..034: Operator boundary alignment (schema comparison)
- CHECK-035..037: BlueEdge independence (semantic review)
- CHECK-041: Synthetic data absence
- CHECK-042..043: Validator reusability (meta-checks)

**Full GOV.1 compliance** = `validate_psee_gauge.sh` PASS + manual D3/D4/D5 checks per GOV-VALIDATION.0 protocol.

---

## Rerun Protocol

The script is stateless and deterministic. It may be rerun at any time:

```bash
bash scripts/governance/validate_psee_gauge.sh
```

To validate an alternate gauge directory:

```bash
GAUGE_DIR=docs/pios/PSEE-GAUGE.1 bash scripts/governance/validate_psee_gauge.sh
```

No modification to the script is required for rerun against PSEE-GAUGE.0. Adapting to a future gauge stream requires updating the `REQUIRED_FILES` array and the `TRACE_MAP` if artifact names or traceability marker conventions change.

---

#### STATUS

| Check | Result |
|---|---|
| CHECK 1..7 implementation specified | CONFIRMED |
| Pattern rationale documented | CONFIRMED |
| Scope exclusions justified | CONFIRMED |
| GOV-VALIDATION.0 mapping defined | CONFIRMED |
| Script execution result: GOV.1 PASS, exit 0 | CONFIRMED |
| No canonical mutation | CONFIRMED |

**VALIDATION EXECUTION SPEC: COMPLETE**
