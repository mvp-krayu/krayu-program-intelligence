# CE.2 — QA Campaign Map and Naming Convention

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Status:** ACTIVE — authoritative naming convention for CE.2 validation campaign

---

## VERSION RULE

PiOS v0.2 remains the active version across QA.1-v02, QA.2-v02, QA.3-v02, and QA.4-v02.

A new PiOS version is warranted **only** if a later QA event exposes a new architectural
boundary that is not absorbable by CE.2 — i.e., a boundary that requires a new governed
change event to resolve. Successful or failed QA runs within PiOS v0.2 do not themselves
imply a version change.

QA.2-v02 / QA.3-v02 / QA.4-v02 do NOT automatically imply v0.3 / v0.4 / v0.5.

---

## VALIDATION NAMING CONVENTION

| ID | Role | Engine | Outcome |
|---|---|---|---|
| QA.1 | Original boundary-defining fail on v0.1. Confirmed that signal perturbation produces no state change under v0.1 hardcoded activation. | PiOS v0.1 | FAIL (boundary confirmed) |
| QA.1-v02 | Formal rerun of QA.1 against PiOS v0.2. Confirms CE.2 resolves the original invariance boundary. | PiOS v0.2 | PASS |
| QA.2-v02 | Second validation injection against PiOS v0.2. Scope TBD. | PiOS v0.2 | Pending |
| QA.3-v02 | Third validation injection against PiOS v0.2. Scope TBD. | PiOS v0.2 | Pending |
| QA.4-v02 | Fourth validation injection against PiOS v0.2. Scope TBD. | PiOS v0.2 | Pending |

---

## CAMPAIGN INTERPRETATION

**QA.1-v02** confirms CE.2 resolves the original failure mode: signal-reactive condition
state activation is now governed, deterministic, and traceable (DEC-001 through DEC-014).

**QA.2-v02 / QA.3-v02 / QA.4-v02** are validation expansions within PiOS v0.2. Their
purpose is to probe the CE.2 activation model under different scenario conditions. They
do not represent version boundaries unless a new ungovernable architectural gap is found.

**Boundary escalation rule:** A QA event escalates to a new PiOS version boundary (i.e.,
triggers a CE.3 or equivalent) only when its findings cannot be addressed by a governed
change within the CE.2 ledger and the current activation model.

---

## ARTIFACT LOCATION CONVENTION

| QA ID | Artifacts |
|---|---|
| QA.1 (original) | `runs/pios/ce2/qa1_boundary_confirmation_report.md` |
| QA.1-v02 | `runs/pios/ce2/qa1_v02/` |
| QA.2-v02 | `runs/pios/ce2/qa2_v02/` (pending) |
| QA.3-v02 | `runs/pios/ce2/qa3_v02/` (pending) |
| QA.4-v02 | `runs/pios/ce2/qa4_v02/` (pending) |

---

## REFERENCES

- CE.2 decision ledger: `docs/pios/CE.2/traceability/ce2_decision_ledger.md`
- Original QA.1 confirmation: `runs/pios/ce2/qa1_boundary_confirmation_report.md`
- QA.1-v02 rerun result: `runs/pios/ce2/qa1_v02/qa1_v02_rerun_result.md`
- CE.2 proof run: `runs/pios/40.6/CE.2-R01-MIX-v02/` through `runs/pios/40.10/CE.2-R01-MIX-v02/`
- CE.2 validation status: `docs/pios/CE.2/CE.2_VALIDATION_STATUS.md`
