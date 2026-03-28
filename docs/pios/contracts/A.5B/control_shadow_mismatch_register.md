# A.5B — CONTROL Shadow Mismatch Register

Stream: A.5B | Mismatch Classification | Non-Destructive
Authority: A.5, A.5C, A.4, A.3, A.2R, A.2G
Runtime target: index.js HEAD a5691c3 | Branch: feature/51-9-runtime-convergence
Initial execution date: 2026-03-28 | Rerun date: 2026-03-28 (post A.5C remediation)

---

## Post-A.5C Rerun Status

All three mismatches identified in the initial A.5B run have been resolved by A.5C (commit 49e4c32).
Rerun result: 44/44 PASS, 0 unexpected mismatches, 0 documented mismatches.

---

## Historical Record (initial A.5B run)

The following entries document the mismatches found in the original A.5B execution.
They are preserved as evidence of the A.5C remediation baseline.

---

### MM-001 — D1/1 — DEMO_EXIT openPanels reset

| Field | Value |
|-------|-------|
| ID | MM-001 |
| Classification | UNEXPECTED (initial) → RESOLVED (A.5C) |
| Scenario | D1: DEMO_EXIT from active guided mode |
| Event | D1/1 |
| Field | `openPanels` |
| Runtime value | `["situation","narrative"]` |
| CONTROL value (pre-fix) | `["situation"]` |
| CONTROL value (post-fix) | `["situation","narrative"]` — matches runtime |

**Root cause:** CONTROL.js DEMO_EXIT set `openPanels: ['situation']`. Runtime does not reset openPanels on exit.

**Remediation (A.5C):** Removed `openPanels: ['situation']` from DEMO_EXIT handler in both Control.js and inlined script. Field now falls through to `...currentSnapshot`, preserving value.

---

### MM-002 — F1a/1 — PERSONA_SELECT mid-demo traversalHistory (was pre-declared)

| Field | Value |
|-------|-------|
| ID | MM-002 |
| Classification | DOCUMENTED (initial) → RESOLVED (A.5C) |
| Scenario | F1a: PERSONA_SELECT during guided mode |
| Event | F1a/1 |
| Field | `traversalHistory` |
| Runtime value | `["narrative"]` |
| CONTROL value (pre-fix) | `[]` |
| CONTROL value (post-fix) | `["narrative"]` — matches runtime |

**Root cause:** CONTROL cleared traversalHistory on PERSONA_SELECT when demoActive. Runtime persona change effect does not.

**Remediation (A.5C):** Removed `newTraversalHistory = []` / `; newTH = []` from demoActive block in both Control.js and inlined script.

---

### MM-003 — F1b/1 — PERSONA_SELECT mid-demo traversalHistory (unexpected surface)

| Field | Value |
|-------|-------|
| ID | MM-003 |
| Classification | UNEXPECTED (initial) → RESOLVED (A.5C) |
| Scenario | F1b: PERSONA_SELECT mid-demo + AUTO_START |
| Event | F1b/1 |
| Field | `traversalHistory` |
| Runtime value | `["narrative"]` |
| CONTROL value (pre-fix) | `[]` |
| CONTROL value (post-fix) | `["narrative"]` — matches runtime |

**Root cause:** Same as MM-002. F1b/1 lacked expectFail declaration, surfacing it as unexpected.

**Remediation (A.5C):** Same fix as MM-002. Both resolved by single line removal.

---

## Current Status

| ID | Scenario | Initial Classification | Resolution |
|----|----------|----------------------|------------|
| MM-001 | D1/1 DEMO_EXIT | UNEXPECTED | RESOLVED — A.5C commit 49e4c32 |
| MM-002 | F1a/1 PERSONA_SELECT mid-demo | DOCUMENTED | RESOLVED — A.5C commit 49e4c32 |
| MM-003 | F1b/1 PERSONA_SELECT mid-demo | UNEXPECTED | RESOLVED — A.5C commit 49e4c32 |

**A.6 gate status: ELIGIBLE** — Rerun produced PASS with zero mismatches.
