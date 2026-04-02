# CE.2 — Definition Workspace

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Program:** Krayu — Program Intelligence Discipline
**Branch:** feature/ce2-state-activation-boundary
**Status:** INITIALIZED — boundary extraction complete, definition pending

---

## PURPOSE

This workspace contains the formal definition materials for PiOS v0.2 boundary scoping.
It is initialized from the CE.2 boundary extraction phase and is the authoritative
staging area for next-stage definition work.

This workspace does NOT contain implementation logic. It does NOT define thresholds,
state formulas, or activation rules. It provides scope, boundary statements, and
traceability requirements only.

---

## PREREQUISITE REPORTS

The following three reports must be read before any definition work proceeds:

1. `runs/pios/ce2/context_validation_report.md`
   — Confirms all v0.1 baseline artifacts are intact

2. `runs/pios/ce2/qa1_boundary_confirmation_report.md`
   — Confirms QA.1 doctrinal finding from preserved CE.2-R01-MIX artifacts

3. `runs/pios/ce2/ce2_boundary_extraction_report.md`
   — Extracts the exact architectural boundary from actual v0.1 engine code

---

## WORKSPACE FILES

| File | Purpose |
|---|---|
| `ce2_scope_definition.md` | Defines the scope of CE.2 — what is in and out |
| `ce2_boundary_statement.md` | Formal statement of the architectural boundary CE.2 must address |
| `ce2_traceability_requirements.md` | Traceability requirements for future CE.2 implementation |
| `ce2_definition_readme.md` | This file |

---

## CONSTRAINTS

- Do not define state activation formulas here
- Do not define thresholds here
- Do not modify any file in `runs/pios/40.5/` through `runs/pios/40.11/`
- Do not modify any file in `pios/core/v0.1/`
- Do not modify any file in `runs/pios/ce2/CE.2-R01-MIX/`
