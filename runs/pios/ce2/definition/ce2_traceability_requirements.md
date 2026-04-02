# CE.2 — Traceability Requirements

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition
**Status:** HEADER ONLY — population pending

---

## PURPOSE

Define what traceability artifacts must be produced by any future CE.2 implementation
work, consistent with the v0.1 traceability model confirmed in the context validation report.

---

## V0.1 TRACEABILITY BASELINE

The v0.1 engine produces the following traceability artifacts per layer (confirmed present):

- Signal layer (40.5): signal_output.json, signal_traceability_map.json, execution_manifest.json
- Condition layer (40.6): condition_output.json, condition_traceability_map.json, execution_manifest.json
- Intelligence layer (40.7): intelligence_output.json, intelligence_traceability_map.json, execution_manifest.json
- Delivery layer (40.8): delivery_packet.json, delivery_validation_report.json, execution_manifest.json
- Feedback layer (40.9): feedback_signal_registry.json, feedback_traceability_manifest.json, execution_manifest.json
- Control layer (40.10): control_directive_registry.json, control_traceability_manifest.json, execution_manifest.json
- Loop closure (40.11): loop_closure_report.json, execution_manifest.json

Any CE.2 (v0.2) implementation must maintain or extend this artifact set.

---

## REQUIRED TRACEABILITY REQUIREMENTS

[To be populated]

Topics to address:
- Minimum artifact requirements per layer for any v0.2 run
- Traceability from signal value → threshold evaluation → state classification
- Cross-run comparison requirements (baseline → v0.2 run)
- Scorecard requirements (v0.2 scorecard must be schema-aligned, not assumed)

---

## TRACEABILITY PROHIBITIONS

[To be populated]

Topics to address:
- What must NOT be discarded from the v0.1 traceability model
- Immutable baseline references that must remain resolvable

---

## REFERENCES

- v0.1 baseline confirmation: `runs/pios/ce2/context_validation_report.md`
- v0.1 artifact inspection basis: `runs/pios/40.5/run_03_executable/` through `runs/pios/40.11/run_01_loop_closure/`
- QA.1 run artifacts: `runs/pios/ce2/CE.2-R01-MIX/`
