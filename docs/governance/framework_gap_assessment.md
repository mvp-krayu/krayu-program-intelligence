# EX.0 — Framework Gap Assessment

**Stream:** EX.0 — Execution Operating Model Hardening
**Date:** 2026-04-04
**Authority:** EX.0
**Assessment target:** First-drop optimization files (pre-commit, untracked)

---

## 1. FILES ASSESSED

| File | Status at Assessment |
|---|---|
| `SKILSS.md` | Untracked — filename typo, content partially complete |
| `docs/governance/CONTRACT_TEMPLATE.md` | Untracked — missing four required fields |
| `docs/governance/STREAM_SCHEMA.md` | Untracked — closed family enumeration, missing new fields |
| `docs/governance/CONTEXT_REGISTRY.md` | Untracked — sufficient content, wrong architecture role |
| `docs/governance/EXECUTION_REPORT_TEMPLATE.md` | Untracked — sufficient, no gaps |
| `docs/governance/HANDOVER_TEMPLATE.md` | Untracked — sufficient, no gaps |
| `scripts/pios/validate_stream.py` | Untracked — unsafe fail behavior, wrong payload paths, hardcoded profiles |

No FAMILY_REGISTRY.md. No docs/governance/families/ directory. No fallback_execution_rules.md.

---

## 2. GAP INVENTORY

### GAP-01 — SKILLS.md filename typo
**File:** `SKILSS.md`
**Risk:** MEDIUM. The file is not referenceable by its correct name from contracts or CLAUDE.md. Any `SKILLS.md` reference in a contract would fail to resolve.
**Fix:** Rename to `SKILLS.md`. Content requires structural fix (skills 15–18 lack section separators and are appended without the line-separator format used by skills 1–14).

---

### GAP-02 — CONTRACT_TEMPLATE.md missing fail-safe fields
**File:** `docs/governance/CONTRACT_TEMPLATE.md`
**Risk:** HIGH. The EX.0 contract itself uses four fields not present in the template:
- `FAMILY RESOLUTION` (KNOWN / UNKNOWN / UNREGISTERED)
- `VALIDATION COVERAGE` (FULL / PARTIAL / NONE)
- `FALLBACK MODE` (REASSESS / PROCEED / BLOCK)
- `FAIL-SAFE RULE`

A contract authored against the current template would be structurally non-compliant with the EX.0 model.
**Fix:** Add these four fields to CONTRACT_TEMPLATE.md. Update STREAM_SCHEMA.md required field list to match.

---

### GAP-03 — STREAM_SCHEMA.md closed family enumeration
**File:** `docs/governance/STREAM_SCHEMA.md`
**Risk:** HIGH. The FAMILY field definition lists a fixed enumeration (`EX, 40, 42, 51, GOV, CAT, WEB`) with no instruction for unknown families. A contract presenting an unregistered family would appear structurally valid but would cause drift.
**Fix:** Replace fixed enumeration with: "Must be a family registered in docs/governance/FAMILY_REGISTRY.md. If unknown, switch to FAMILY_DISCOVERY mode before execution."

---

### GAP-04 — validate_stream.py profile paths do not match real payload shapes
**File:** `scripts/pios/validate_stream.py`
**Risk:** CRITICAL. The EX/debug_trace profile checks paths like `trace.run_id`, `trace.ce4_state` — none of which exist in the actual `?debug=true` payload. The real payload has `debug_run_id`, `signals`, `signal_summary`, `trace_chains`, etc. Running this profile against real output would produce 10 FAILs on correct data.
**Fix:** Rewrite EX profiles to match actual adapter payload shapes verified in EX.2.

---

### GAP-05 — validate_stream.py unknown family is a crash, not a fail-safe
**File:** `scripts/pios/validate_stream.py`
**Risk:** HIGH. When an unknown family/profile pair is requested, the script raises a `ValueError` and exits 1 with a Python exception on stderr. This is:
- Not a governed output (raw Python exception, not a FAIL_SAFE_STOP message)
- Not distinguishable from a real validation failure
- Not informative enough to trigger FAMILY_DISCOVERY mode

**Fix:** Replace `ValueError` with a structured FAIL_SAFE_STOP output. Add `--list-families` and `--list-profiles <family>` modes for VALIDATION_DISCOVERY.

---

### GAP-06 — validate_stream.py profiles are not externally extensible
**File:** `scripts/pios/validate_stream.py`
**Risk:** MEDIUM. All profiles are hardcoded in the PROFILES dict. Adding a new profile for a new family requires editing the script. There is no external profile loading mechanism.
**Fix:** Add external profile loading from `docs/governance/families/<FAMILY>.json`. Hardcoded profiles remain as defaults; external files override or extend. New families can be added without script modification.

---

### GAP-07 — No FAMILY_REGISTRY.md
**Risk:** HIGH. There is no governed registry of families. CONTEXT_REGISTRY.md contains family definitions but is structured as a single-file narrative, not a registration index. This means:
- There is no authoritative list of registered families with registration metadata
- Unknown family detection has no authoritative ground truth to check against
- The RESOLVE_FAMILY skill has nowhere to look

**Fix:** Create `docs/governance/FAMILY_REGISTRY.md` as the canonical family index. Create `docs/governance/families/` with one file per family.

---

### GAP-08 — No governed family registration model
**Risk:** HIGH. CONTEXT_REGISTRY.md does not distinguish between "registered and governed" families and "informal" ones. All families appear with equal status. There is no registration timestamp, no owner, no status.
**Fix:** FAMILY_REGISTRY.md must include: family ID, purpose summary, registration date, status (REGISTERED / CANDIDATE / DEPRECATED), authority owner.

---

### GAP-09 — No fallback_execution_rules.md
**Risk:** HIGH. SKILLS.md defines FAIL_SAFE_STOP as a skill but its behavior is not governed in a document. There is no written rule for what happens when:
- FAMILY RESOLUTION = UNKNOWN
- VALIDATION COVERAGE = NONE
- FALLBACK MODE = REASSESS

**Fix:** Create `docs/governance/fallback_execution_rules.md` with explicit rules per condition.

---

### GAP-10 — No migration boundary defined
**Risk:** MEDIUM. Existing artifacts are in `docs/pios/<stream>/`. New framework targets `docs/governance/`. There is no written boundary specifying:
- What stays in docs/pios/
- What goes to docs/governance/
- Where future EX.x streams store their artifacts

**Fix:** Create `docs/governance/migration_boundary_statement.md`.

---

### GAP-11 — CONTEXT_REGISTRY.md vs family files: dual truth risk
**Risk:** MEDIUM. After EX.0 creates `docs/governance/families/*.md`, CONTEXT_REGISTRY.md becomes a second source of family truth. If they diverge, the registry model breaks.
**Fix:** Deprecate CONTEXT_REGISTRY.md as the authority for family content. Retain as a summary index pointing to family files. Family files become the authority.

---

### GAP-12 — Branch discipline not enforced in framework
**Risk:** LOW. CLAUDE.md §7 requires feature branches. All EX streams (EX.1A, EX.3, EX.2) were committed directly to `pios-governance-baseline-v0.4`. The framework has no explicit rule permitting this, creating a silent violation of CLAUDE.md.
**Fix:** FAMILY_REGISTRY.md and the EX family file should declare the authorized branch scope for EX-family streams. Migration boundary should note this.

---

## 3. SUFFICIENCY VERDICT

| Capability | Sufficient? | Blocking? |
|---|---|---|
| Unknown family detection | NO — GAP-07, GAP-08 | YES |
| Family registration | NO — GAP-07, GAP-08 | YES |
| Validator extensibility | NO — GAP-06 | YES |
| Fail-safe fallback | NO — GAP-05, GAP-09 | YES |
| No-context-loss stream transitions | PARTIAL — HANDOVER_TEMPLATE ok; no registry anchor | PARTIAL |
| Migration boundary | NO — GAP-10 | YES |
| Contract compression guardrails | PARTIAL — template missing fail-safe fields | YES |

**Current framework is NOT execution-ready for the next EX.x stream under compressed execution.**

---

## 4. POST-EX.0 VERDICT

Framework is execution-ready when all 12 gaps are resolved and the validation check in §5 passes.

---

## 5. HARDENING CHECKLIST

| Check | Target File | Status |
|---|---|---|
| SKILLS.md filename corrected | SKILLS.md | → EX.0 |
| Skills 15–18 formatted consistently | SKILLS.md | → EX.0 |
| CONTRACT_TEMPLATE.md adds 4 fail-safe fields | CONTRACT_TEMPLATE.md | → EX.0 |
| STREAM_SCHEMA.md removes closed enumeration | STREAM_SCHEMA.md | → EX.0 |
| FAMILY_REGISTRY.md created | FAMILY_REGISTRY.md | → EX.0 |
| Family files created (7) | families/*.md | → EX.0 |
| Family JSON profiles created (7) | families/*.json | → EX.0 |
| validate_stream.py profile paths corrected | validate_stream.py | → EX.0 |
| validate_stream.py FAIL_SAFE_STOP behavior | validate_stream.py | → EX.0 |
| validate_stream.py external profile loading | validate_stream.py | → EX.0 |
| fallback_execution_rules.md created | fallback_execution_rules.md | → EX.0 |
| migration_boundary_statement.md created | migration_boundary_statement.md | → EX.0 |
| CONTEXT_REGISTRY.md deprecated as authority | CONTEXT_REGISTRY.md | → EX.0 |
