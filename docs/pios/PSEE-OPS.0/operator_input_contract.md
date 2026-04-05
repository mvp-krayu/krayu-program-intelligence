# PSEE-OPS.0 — Operator Input Contract

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Contract authority:** PSEE.1/psee_decision_contract_v1.md §Section 1 (Pre-Conditions)
**Engine authority:** PSEE.2/implementation_architecture.md

---

## Operator Input Schema

This document is the authoritative definition of what an operator must provide to initiate a PSEE execution. Every field in this schema maps directly to a PSEE.1 pre-condition (PC-01..PC-05) or PSEE.2 engine input. Operators MUST NOT provide fields outside this schema.

---

### Top-Level Input Schema

```json
{
  "schema_version":       "1.0",
  "stream_id":            "string",       // REQUIRED — identifies the PSEE execution run (e.g., "PSEE.3")
  "source_location": {                    // REQUIRED — maps to PC-01
    "corpus_root":        "string",       // absolute filesystem path to Phase A evidence root
    "access_mode":        "filesystem"    // LOCKED: only "filesystem" in this contract version
  },
  "boundary_definition": {               // REQUIRED — maps to PC-02; see boundary_definition_model.md
    "source":             "document|inline",
    "document_path":      "string|null",  // absolute path to evidence_boundary document
    "inline":             "object|null"   // inline boundary fields (see boundary_definition_model.md)
  },
  "phase_b_target": {                    // REQUIRED — maps to PC-03
    "declaration_path":   "string",       // absolute path to Phase B target declaration file
    "artifact_names":     ["string"]      // list of required Phase B artifact names
  },
  "system_identity": {                   // REQUIRED — maps to PC-04
    "system_name":        "string",       // name of the system being analyzed
    "version":            "string"        // version identifier matching Phase A and Phase B
  },
  "execution_mode": {                    // REQUIRED
    "mode":               "FULL|RESUME|REPLAY",
    "resume_context_path":"string|null",  // required if mode = RESUME: path to prior PSEEContext
    "replay_manifest_path":"string|null"  // required if mode = REPLAY: path to execution manifest
  },
  "operator_contact": {                  // REQUIRED — maps to PC-05
    "identifier":         "string",       // operator name, system ID, or routing handle
    "escalation_channel": "string"        // how escalations reach the operator: "file|api|manual"
  },
  "operator_adjudication": [             // OPTIONAL — pre-supplied EscalationResolution objects
    {
      "dp_id":            "string",
      "affected":         ["string"],
      "resolution":       "string",
      "resolution_basis": "string",
      "resolved_at":      "ISO-8601"
    }
  ]
}
```

---

### Field Definitions

#### source_location

Maps to PSEE.2 `PSEEContextLoader` and PSEE.1 PC-01.

| Field | Type | Validation | PSEE.2 mapping |
|---|---|---|---|
| `corpus_root` | string | Must be an accessible absolute directory path | Passed as `corpus_root` to `PSEEContextLoader`; DP-0-01 check |
| `access_mode` | enum | Must be `"filesystem"` (only mode in this version) | Validated before engine entry |

Failure condition: `corpus_root` not accessible → DP-0-01 FAIL → STOP-01.

---

#### boundary_definition

Maps to PSEE.1 PC-02 and PSEE.2 SV-01/SV-05. Full schema defined in `boundary_definition_model.md`.

| Field | Type | Validation | PSEE.2 mapping |
|---|---|---|---|
| `source` | enum | `"document"` or `"inline"` | Determines how `PSEEContextLoader` locates boundary |
| `document_path` | string\|null | Required if `source = "document"`. Must be accessible. | Loaded as evidence_boundary document |
| `inline` | object\|null | Required if `source = "inline"`. Must contain minimum required fields. | Constructed in memory as boundary document |

Failure conditions:
- `source = "document"` and `document_path` not accessible → STOP-01
- `source = "inline"` and required fields absent → STOP-01
- `source = "document"` and `explicitly_excluded_paths` absent → DP-2-01 → ESC-03

---

#### phase_b_target

Maps to PSEE.1 PC-03.

| Field | Type | Validation | PSEE.2 mapping |
|---|---|---|---|
| `declaration_path` | string | Must be accessible | Loaded as Phase B target definition |
| `artifact_names` | string[] | Must contain ≥1 entry | Used as denominator in DP-5-02 coverage gate |

Failure condition: `declaration_path` not accessible or `artifact_names` empty → DP-0-03 FAIL → STOP-01.

---

#### system_identity

Maps to PSEE.1 PC-04.

| Field | Type | Validation | PSEE.2 mapping |
|---|---|---|---|
| `system_name` | string | Non-empty | Used for DP-0-04 identity confirmation |
| `version` | string | Must match corpus and Phase B target | Used for DP-0-04 version match check |

Failure condition: identity cannot be confirmed → DP-0-04 FAIL → STOP-01.

---

#### execution_mode

Controls which engine entry path is used (see `execution_invocation_spec.md`).

| Mode | When used | Required fields |
|---|---|---|
| `FULL` | New run from S-00 | `corpus_root`, `boundary_definition`, `phase_b_target`, `system_identity` |
| `RESUME` | Resuming a suspended run (S-T2 resolved) | `resume_context_path` (must point to persisted PSEEContext) |
| `REPLAY` | Re-executing a prior run exactly | `replay_manifest_path` (must point to execution manifest) |

---

#### operator_contact

Maps to PSEE.1 PC-05. Defines where ESCALATE and PARTIAL notifications are delivered.

| `escalation_channel` | Behavior |
|---|---|
| `"file"` | Escalation records written to operator-specified output path; operator checks file |
| `"manual"` | Engine halts at S-T2; operator must inspect escalation_log and provide resolution |
| `"api"` | Reserved for future; not implemented in this stream (H: no API server) |

---

#### operator_adjudication (Optional)

Pre-supplied `EscalationResolution` objects. Allows operators to provide likely escalation answers before execution begins (e.g., for known corpora where boundary classifications are pre-known).

Rules:
- Pre-supplied resolutions are validated the same as runtime resolutions (same schema, same outcome set check).
- Pre-supplied resolutions are applied when the matching escalation fires; they do NOT prevent the escalation from being logged.
- An invalid pre-supplied resolution is rejected; the escalation fires as normal and awaits operator input.
- Pre-supplied resolutions DO NOT bypass DP evaluation; they are queued as operator responses to anticipated escalations.

---

## Input Validation Rules

All validation occurs BEFORE the engine is invoked. Invalid input produces a pre-flight rejection, not a PSEE STOP. The pre-flight rejection schema:

```json
{
  "result":       "REJECTED",
  "reason":       "string",
  "field":        "string",       // which input field failed
  "requirement":  "string"        // which PC or DP it maps to
}
```

Validation order:
1. Schema version check (`schema_version` = "1.0")
2. Required field presence check (all REQUIRED fields present)
3. `source_location.corpus_root` accessibility
4. `boundary_definition` consistency (`source` matches populated field)
5. `phase_b_target.declaration_path` accessibility
6. `execution_mode` consistency (`RESUME` has `resume_context_path`; `REPLAY` has `replay_manifest_path`)
7. `operator_contact.identifier` non-empty
8. `operator_adjudication` entries: each must parse against EscalationResolution schema

Any validation failure → REJECTED (engine not invoked). Operator corrects input and resubmits.

---

## Execution Modes

### FULL Mode

Standard new-run execution. All pre-conditions checked. Engine starts at S-00.

Input requirements: all REQUIRED fields populated.

### RESUME Mode

Resumes a suspended run. The persisted `PSEEContext` (from a prior S-T2 suspension) is loaded. The `EscalationResolution` must be provided via the operator response mechanism (see `escalation_interface_spec.md`).

Input requirements: `resume_context_path` must point to a persisted `PSEEContext` JSON file. The context must have `current_state = "S-T2"` and at least one open escalation entry.

### REPLAY Mode

Re-executes a prior run using the recorded `execution_manifest`. The manifest supplies all inputs including `operator_adjudication` from the prior run. The engine executes deterministically from S-00. (See `replay_contract.md`.)

Input requirements: `replay_manifest_path` must point to an `execution_manifest.json` produced by a prior PSEE run.

---

## Operator Authority Boundary

The operator input contract defines exactly what operators can provide. Operators CANNOT:

| Forbidden operator action | Why forbidden | Engine behavior |
|---|---|---|
| Specify `condition_value` for a DP | Operators answer escalations; they do not set DP outcomes | Input rejected (not a valid input field) |
| Override `intake_status` for a file | Status is set by engine per FX-02..04 | Input rejected |
| Set `file_level_parity` on an OVL | Parity requires evidence comparison (FB-01) | Input rejected |
| Provide a pre-resolved US record | US records are never operator-resolved at input time | Input rejected |
| Modify `TransitionRegistry` entries | Engine internals not exposed to operator | Not an input field |

---

#### STATUS

| Check | Result |
|---|---|
| All PC-01..05 pre-conditions have input fields | CONFIRMED |
| All REQUIRED fields have validation rules | CONFIRMED |
| Operator authority boundary defined | CONFIRMED |
| Execution modes (FULL/RESUME/REPLAY) defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**OPERATOR INPUT CONTRACT: COMPLETE**
