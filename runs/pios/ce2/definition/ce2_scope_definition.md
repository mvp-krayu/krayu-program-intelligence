# CE.2 — Scope Definition

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Status:** HEADER ONLY — population pending

---

## PURPOSE

Define the precise scope of CE.2: what architectural change is required, what layers
are in scope, and what is explicitly excluded.

---

## IN SCOPE

[To be populated — must reference `ce2_boundary_extraction_report.md` §6]

Topics to address:
- The specific layer boundary to be redesigned (40.5 → 40.6)
- The specific functions that require a new activation model
- The signals whose output values must become state-determining
- The dependency on SIG-003 / compute_sig_003 second-branch blockage

---

## OUT OF SCOPE

[To be populated]

Topics to address:
- v0.1 baseline (must remain unchanged)
- CE.2-R01-MIX run artifacts (immutable)
- Layers 40.7 through 40.11 (downstream, addressed by consequence once 40.6 is corrected)
- QA.1 rerun (finding already confirmed)

---

## REFERENCES

- Boundary extraction: `runs/pios/ce2/ce2_boundary_extraction_report.md`
- QA.1 confirmation: `runs/pios/ce2/qa1_boundary_confirmation_report.md`
- Context validation: `runs/pios/ce2/context_validation_report.md`
- Closure note: `runs/pios/ce2/CE.2-R01-MIX/closure_note.md`
