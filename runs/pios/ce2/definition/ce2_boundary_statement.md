# CE.2 — Boundary Statement

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Status:** HEADER ONLY — population pending

---

## PURPOSE

State the architectural boundary that CE.2 must address in formal, code-grounded terms.
This is the canonical definition document for the reactive state activation gap identified
in CE.2-R01-MIX and confirmed in the QA.1 boundary confirmation report.

---

## PRIMARY BOUNDARY STATEMENT

[To be populated — must be grounded in `ce2_boundary_extraction_report.md` §6]

Topics to address:
- The exact function(s) in `activate_conditions.py` where the boundary sits
- The field (`condition_coverage_state`) that is currently hardcoded
- The layer transition (40.5 → 40.6) that is the locus of the change
- The cascading consequence path: 40.6 coverage_state → 40.9 synthesis_state → 40.10 directive

---

## SECONDARY BOUNDARY STATEMENT

[To be populated — must be grounded in `ce2_boundary_extraction_report.md` §6, SIG-003 factor]

Topics to address:
- `compute_sig_003` second branch behavior
- Relationship between SIG-003 blockage and COND-005/DIAG-005 activation
- Whether this is a dependent or independent boundary from the primary

---

## WHAT THIS STATEMENT IS NOT

- This is not an implementation specification
- This is not a threshold definition
- This is not a state formula proposal
- This is not a design document

---

## REFERENCES

- Primary source: `runs/pios/ce2/ce2_boundary_extraction_report.md`
- Confirmed finding: `runs/pios/ce2/qa1_boundary_confirmation_report.md`
- Engine files cited: `pios/core/v0.1/engine/activate_conditions.py`, `pios/core/v0.1/engine/compute_signals.py`
