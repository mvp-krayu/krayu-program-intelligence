# Runtime Gap Resolution

**Stream:** GOV-RUNTIME.0
**Date:** 2026-04-05
**Authority:** GOV-RUNTIME.0 stream contract

---

## 1. Gap Inventory

### Gap 1: docs/governance/runtime/git_structure_contract.md — MISSING

**Finding:** File was not present in working tree on branch `work/ig-foundation`.

**Discovery method:** CLAUDE.md pre-flight check; file read returned "does not exist."

**Root cause:** The runtime contracts were created in commit `8313b7b` ("GOV: remove contracts and runtime runs (non-versioned artifacts)") which is on a separate branch lineage from `work/ig-foundation`. Confirmed via:
- `git log --all -- docs/governance/runtime/git_structure_contract.md` → `8313b7b`
- `git merge-base --is-ancestor 8313b7b HEAD` → NOT ancestor

The branch `work/ig-foundation` diverged from the integration baseline BEFORE commit `8313b7b` was made, so it never received the runtime contracts.

**Resolution:** RESTORED from git history (`8313b7b`). Full canonical content recovered via `git show 8313b7b:docs/governance/runtime/git_structure_contract.md` and written verbatim to `docs/governance/runtime/git_structure_contract.md`.

**Restoration method:** Verbatim recovery — no content invention, no paraphrase, no interpretation.

---

### Gap 2: docs/governance/runtime/reference_boundary_contract.md — MISSING

**Finding:** File was not present in working tree on branch `work/ig-foundation`.

**Discovery method:** CLAUDE.md §12.2 pre-flight check; file read returned "does not exist."

**Root cause:** Same as Gap 1 — same commit `8313b7b`, same branch lineage divergence.

**Resolution:** RESTORED from git history (`8313b7b`). Full canonical content recovered via `git show 8313b7b:docs/governance/runtime/reference_boundary_contract.md` and written verbatim.

**Restoration method:** Verbatim recovery — no content invention, no paraphrase, no interpretation.

---

## 2. Pre-Flight Satisfaction

The CLAUDE.md pre-flight requires:

| Requirement | Status |
|---|---|
| docs/governance/runtime/git_structure_contract.md present | SATISFIED — restored |
| docs/governance/runtime/reference_boundary_contract.md present | SATISFIED — restored |
| Contract loaded before execution | SATISFIED — read before PSEE-GAUGE.0 may proceed |

---

## 3. Governance Confirmation

- No content was invented. Both contracts were recovered verbatim from commit `8313b7b`.
- No PSEE artifacts were touched.
- No canonical rules were created or modified.
- These contracts are LOCKED per their own declarations — no amendments made.

---

## 4. Traceability

| Artifact | Source commit | Recovery method |
|---|---|---|
| git_structure_contract.md | 8313b7b | git show verbatim |
| reference_boundary_contract.md | 8313b7b | git show verbatim |
