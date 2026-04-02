# CE.2 — Invariant Replay Contract

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Status:** HEADER ONLY — population pending

---

## PURPOSE

Define the contract for replay-based verification of v0.1 invariance preservation.
Ensures that any v0.2 engine changes do not silently alter v0.1 baseline behavior
for inputs and layers outside the declared reactive state activation scope.

---

## INVARIANCE CLAIM

[To be populated]

Topics to address:
- Which v0.1 outputs are declared invariant under v0.2 (layers not in scope of CE.2)
- Which inputs must produce identical outputs in v0.2 vs v0.1 for out-of-scope signals
- Precise definition of "invariant" for this context

---

## REPLAY SCOPE

[To be populated]

Topics to address:
- Which baseline runs to replay against (v0.1 executable runs)
- Which layers are in replay scope vs out of scope
- Acceptance criteria for replay pass

---

## REFERENCES

- v0.1 baseline tag: `pios-core-v0.1`
- Baseline run directories: `runs/pios/40.5/run_03_executable/` through `runs/pios/40.11/run_01_loop_closure/`
- Boundary extraction: `runs/pios/ce2/ce2_boundary_extraction_report.md`
- CE.2 scope: `docs/pios/ce.2/scope/ce2_scope_definition.md`
