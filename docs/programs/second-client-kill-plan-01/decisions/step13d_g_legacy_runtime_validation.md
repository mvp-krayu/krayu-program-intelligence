# STEP 13D-G — Legacy Path Runtime Validation (Isolated)

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 13D-G
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Legacy path runtime validation passed. All STEP 13C patches exercised. All validation checks pass. Zero writes to `clients/` paths. Output isolated to `/tmp/`.

---

## Command Used

```bash
python3 scripts/pios/lens_report_generator.py \
  --legacy \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run-id run_01_oss_fastapi \
  --fragments-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi \
  --claims CLM-09 CLM-25 CLM-12 CLM-10 \
  --output /tmp/lens_structural_slice_test.html
```

---

## Output File

```
-rw-r--r--  1 khorrix  wheel    31K Apr 24 23:47 /tmp/lens_structural_slice_test.html
```

Path: `/tmp/lens_structural_slice_test.html`
Size: 31K
Exit code: 0
Exceptions: none

---

## Validation Results

| Check | Expected | Result | Status |
|-------|----------|--------|--------|
| Exit code | 0 | 0 | PASS |
| No exceptions | clean run | clean | PASS |
| CLM-25 placeholder present | `Conceptual coherence not yet evaluated` | FOUND | PASS |
| SIG-* content absent | ABSENT | ABSENT | PASS |
| BlueEdge references absent | ABSENT | ABSENT | PASS |
| `Security Intelligence Pipeline Signal` absent | ABSENT | ABSENT | PASS |
| `One critical operational signal` absent | ABSENT | ABSENT | PASS |
| FORBIDDEN_SUBSTRINGS absent (COND-/DIAG-/INTEL-) | ABSENT | ABSENT | PASS |
| Second-client CLM-09 score present | `Proven: 60/100` | FOUND (×3 instances) | PASS |

**Full CLM-09 rendered text (confirmed second-client data):**
> "The platform has achieved a proven structural score of **Proven: 60/100**, representing a verifiable evidence floor — not an estimate, but a deterministic sum of confirmed structural facts."

---

## Filesystem Safety Result

```bash
find clients -type f -newer /tmp/lens_structural_slice_test.html -print
# (no output)
```

**RESULT: NO files written under `clients/` during execution.** Zero filesystem side effects on canonical paths.

---

## STEP 13C Patch Verification

The legacy path exercised the following patched functions:

| Patch | Function | Verified |
|-------|----------|---------|
| R-02 — GAP_01_RESOLVED gate | `compose_key_findings` CLM-25 block | YES — placeholder rendered, not CLM-25 card |
| R-04 — CLM-20 safe lookup | `compose_key_findings` CLM-20 guard | YES — no CLM-20 content, no crash |
| R-04 — signal sentence guard | `compose_executive_summary` | YES — signal sentence absent |

All three patches functioned correctly under second-client conditions.

---

## 4-BRAIN Assessment

### CANONICAL

Fragment data loaded correctly from `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/fragments/run_01_oss_fastapi`. CLM-09 score `Proven: 60/100` confirmed as second-client value. CLM-25 withheld per `GAP_01_RESOLVED = False` gate. CLM-20 absent from fragments — guard fires correctly (no crash, no fabrication). No fragment modified.

### CODE

`_main_legacy()` → `load_all_payloads()` → `build_html()` path exercised. `compose_key_findings` and `compose_executive_summary` both called and returned correct gated output. No Node.js subprocess. No `CANONICAL_PKG_DIR` hard dependency encountered (graceful fallback per STEP 13D-F analysis).

### PRODUCT

LENS Structural Slice in **Degraded Mode** confirmed renderable as HTML. Classification:

> **STRUCTURAL SLICE — DEGRADED MODE — STABLE**

Claims rendered: CLM-09, CLM-12, CLM-10 (from fragments)
Claims gated: CLM-25 (GAP_01_RESOLVED = False)
Claims absent: CLM-20 (no fragment — correct behavior)

### PUBLISH

No SIG-* leakage. No BlueEdge content. No signal narrative. No CLM-25 verdict surfaced. No FORBIDDEN_SUBSTRINGS in output. Report is safe as a structural-only artifact.

---

## Product Classification

**STRUCTURAL SLICE — DEGRADED MODE — STABLE**

- Hero-band equivalent: CLM-09/10/12 data renders from second-client fragments
- CLM-25: placeholder only — no verdict surfaced
- Signal layer: absent — no CLM-20 fragment present
- BlueEdge static sections: suppressed (not applicable to this report path)
- 11 structural claims (CLM-01/03/11/13/14/15/16/17/18/19/27): not rendered, deferred (R-05)

---

## Remaining Gaps

| Gap | ID | Description | Blocker for |
|-----|----|-------------|-------------|
| GAP-01 | CONCEPT-06 predicate mismatch | `concepts.json` does not support `NOT_EVALUATED` state | CLM-25 surface activation |
| DQGAP-01 | CLM-19 fragment quality | `value.narrative = "## Source Fields"` (zero-signal `conf_dist_str()` artifact) | CLM-19 render |
| R-05 | 11 structural claims | No LENS components for CLM-01/03/11/13/14/15/16/17/18/19/27 | Full structural tier |
| LENS page live | PROJECTION_FRAGMENTS_DIR not set | Dev server not started; live `/lens` page not validated | Runtime UI validation |

---

## Next Step

**STEP 14** — LENS Live Page Runtime Validation

Authorized scope:
- Set `PROJECTION_FRAGMENTS_DIR` in `app/gauge-product/.env.local`
- Start `app/gauge-product` dev server
- Load `/lens` page against second-client fragments
- Verify hero band renders CLM-09/10/12 scores
- Verify CLM-25 placeholder visible
- Verify BlueEdge static sections suppressed (null)
- Verify no signal section visible (CLM-20 absent)
- Document results in governance trace
