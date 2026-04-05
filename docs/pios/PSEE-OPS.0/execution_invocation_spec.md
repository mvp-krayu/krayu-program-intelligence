# PSEE-OPS.0 — Execution Invocation Specification

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Engine authority:** PSEE.2/implementation_architecture.md
**Input authority:** PSEE-OPS.0/operator_input_contract.md

---

## Invocation Contract

This document defines how a validated `OperatorInput` is translated into a PSEE.2 engine invocation. The invocation layer is a strict pass-through: it maps operator-supplied fields to `PSEEContextLoader` parameters and starts the engine. It injects no logic of its own.

---

### Invocation Architecture

```
OperatorInput (validated)
        │
        ▼
InvocationLayer
    ├─ pre_invocation_guard()         // final gate: no engine call without valid input
    ├─ build_engine_parameters()      // maps OperatorInput fields to PSEEContextLoader params
    ├─ check_psee_x_exclusion()       // confirms no CP-xx references in input
    └─ invoke_engine(params)          // calls PSEEEntryPoint; does NOT modify engine internals
                │
                ▼
        PSEEEntryPoint (PSEE.2)
        (BLACK BOX — InvocationLayer has no access to internals)
```

The `InvocationLayer` receives a validated `OperatorInput` and a `PSEEEngine` handle. It has no access to `DPHandlerRegistry`, `TransitionRegistry`, `HeuristicGuard`, or `PSEEStateMachine` internals. The engine handle exposes exactly three methods:

```
PSEEEngine {
  method: start_full(params: EngineParameters) → PSEERunHandle
  method: resume(context_path: string, resolution: EscalationResolution) → PSEERunHandle
  method: replay(manifest_path: string) → PSEERunHandle
}
```

No other engine methods are exposed to the invocation layer.

---

### Engine Parameters Schema

Built by `InvocationLayer.build_engine_parameters()` from `OperatorInput`:

```json
{
  "run_id":               "string",       // generated: stream_id + timestamp hash
  "corpus_root":          "string",       // from source_location.corpus_root
  "boundary_source":      "document|inline",
  "boundary_document_path": "string|null",
  "boundary_inline":      "object|null",
  "phase_b_target_path":  "string",
  "phase_b_artifact_names": ["string"],
  "system_identity": {
    "system_name":        "string",
    "version":            "string"
  },
  "operator_contact": {
    "identifier":         "string",
    "escalation_channel": "string"
  },
  "adjudication_queue":   [EscalationResolution],  // from operator_adjudication; may be empty
  "psee_x_excluded_ids":  ["CP-01","CP-02","CP-03","CP-04","CP-05","CP-06","CP-07","CP-08","CP-09"]
}
```

`psee_x_excluded_ids` is always set to the full CP-xx list. The invocation layer cannot override this. It is not an operator-configurable field; it is hardcoded by the invocation layer at every engine call.

---

### FULL Invocation Path

```
1. Receive validated OperatorInput (mode = FULL)
2. pre_invocation_guard():
     - confirm all REQUIRED fields are populated (re-validates; belt-and-suspenders check)
     - confirm corpus_root is still accessible at invocation time
     - confirm boundary document/inline is present
     - confirm phase_b_target_path is accessible
3. build_engine_parameters() → EngineParameters
4. check_psee_x_exclusion():
     - confirm operator_adjudication entries contain no CP-xx references
     - if found: REJECTED — "PSEE_X_IN_ADJUDICATION"
5. engine.start_full(params) → PSEERunHandle
6. Return PSEERunHandle to caller (operator-facing output channel)
```

---

### RESUME Invocation Path

```
1. Receive validated OperatorInput (mode = RESUME)
2. Load PSEEContext from resume_context_path:
     - confirm file exists
     - confirm context.current_state = "S-T2"
     - confirm at least one escalation_log entry with resolution = null
3. Receive EscalationResolution from operator (via escalation_interface_spec.md)
4. Validate EscalationResolution:
     - dp_id matches an open escalation entry in context.escalation_log
     - resolution value is in the valid outcome set for that dp_id
     - resolution_basis is non-empty
5. engine.resume(context_path, resolution) → PSEERunHandle
```

If validation fails at step 4: REJECTED — "INVALID_ESCALATION_RESOLUTION". Engine not invoked. Operator corrects and resubmits.

---

### REPLAY Invocation Path

```
1. Receive validated OperatorInput (mode = REPLAY)
2. Load execution_manifest from replay_manifest_path
3. Extract inputs from manifest:
     - corpus_root_hash, boundary_hash, phase_b_target_hash
     - operator_resolutions (the resolutions from the original run)
4. Verify current corpus files match recorded hashes:
     - if mismatch: REJECTED — "REPLAY_INPUT_MISMATCH: corpus has changed"
     - if match: proceed
5. engine.replay(manifest_path) → PSEERunHandle
```

The replay engine re-executes from S-00 using the original inputs and the recorded operator_resolutions in the original order. See `replay_contract.md` for full replay specification.

---

### PSEERunHandle

The invocation layer returns a `PSEERunHandle` to the caller. This is the operator's interface to the running execution.

```
PSEERunHandle {
  run_id:          string
  current_state:   PSEEState        // read-only; reflects current state
  escalations:     EscalationSurface  // see escalation_interface_spec.md
  us_records:      UnknownSpaceSurface  // see unknown_space_interface.md
  logs:            LogSurface          // see logging_exposure_model.md
  status:          "RUNNING|STOPPED|ESCALATED|PARTIAL|COMPLETE"
}
```

The `PSEERunHandle` is read-only except for the `escalations` channel (which accepts `EscalationResolution` objects from the operator). No other handle field is writable by the operator.

---

## Engine Black-Box Enforcement

The `InvocationLayer` enforces engine isolation at these boundaries:

| Boundary | Enforcement mechanism |
|---|---|
| No direct `DPHandlerRegistry` access | Registry not exposed in `PSEEEngine` public interface |
| No direct `TransitionRegistry` mutation | Registry not exposed; `PSEEEngine.start_full()` is the only entry |
| No `HeuristicGuard` bypass | Guard runs inside engine; invocation layer cannot disable it |
| No `PSEEStateMachine.current_state` write | State is read-only via `PSEERunHandle.current_state` |
| No CP-xx injection | `psee_x_excluded_ids` is hardcoded in `build_engine_parameters()`; not operator-configurable |
| No pre-run `PSEEContext` population | Context is constructed by `PSEEContextLoader` inside the engine; invocation layer does not create context |

---

## Separation Enforcement (Section G Question 7)

The operator is structurally prevented from influencing engine logic by these mechanisms:

1. **Single entry point**: The operator can only call `PSEEEngine.start_full()`, `.resume()`, or `.replay()`. No other engine API exists.

2. **Input schema enforcement**: The `OperatorInput` schema does not contain any field that maps to a DP `condition_value`, a `TransitionRegistry` entry, or an `intake_status` override. Non-schema fields are rejected.

3. **Adjudication queue — not a logic override**: `operator_adjudication` entries are queued as anticipated `EscalationResolution` responses. They are applied only when the matching escalation fires; they are validated against the DP's valid outcome set before application. They do not prevent the DP handler from executing; they only pre-supply the operator's response to an escalation that has already occurred.

4. **Read-only PSEERunHandle**: The operator can observe engine state via `PSEERunHandle` but cannot write to it except via the `escalations` channel (which is itself governed by `escalation_interface_spec.md`).

5. **PSEE.X exclusion hardcoded**: The CP-xx exclusion list is set by the invocation layer, not by the operator. The operator cannot remove or override it.

---

#### STATUS

| Check | Result |
|---|---|
| FULL / RESUME / REPLAY invocation paths defined | CONFIRMED |
| EngineParameters schema defined (complete mapping from OperatorInput) | CONFIRMED |
| PSEERunHandle defined (operator's read-only runtime view) | CONFIRMED |
| Engine black-box enforcement mechanisms named | CONFIRMED |
| Section G Question 7 (operator prevented from influencing logic) answered | CONFIRMED |
| No canonical mutation | CONFIRMED |

**EXECUTION INVOCATION SPEC: COMPLETE**
