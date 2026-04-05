# PSEE.2 — Implementation Architecture

**Stream:** PSEE.2
**Family:** PSEE
**Date:** 2026-04-05
**Contract:** PSEE.1/psee_decision_contract_v1.md (v1.0)

---

## Section G — Required Implementation Questions (Answered Here)

This section answers the 8 mandatory implementation questions from Section G of the stream contract in implementation form.

---

### G1 — Where is the state machine encoded?

The state machine is encoded in a dedicated module: `PSEEStateMachine`. It holds the current state (`PSEEState`) and a transition registry (`TransitionRegistry`) — a lookup table keyed by `(current_state, dp_id, condition_value)` → `(next_state, action_id)`. The state machine does not execute DP logic; it only reads the outcome produced by the DP handler and resolves the next state from the registry. State is carried in a single `PSEEContext` object (see decision_state_model.md §Context Object). The state machine is the only entity authorized to mutate `PSEEContext.current_state`.

```
PSEEStateMachine {
  current_state: PSEEState          // enumerated S-00..S-13, S-T1, S-T2, S-T3
  context: PSEEContext               // carried data, populated by phase handlers
  transition_registry: map<(PSEEState, DP_ID, Condition) → (PSEEState, Action)>

  method: transition(dp_id, condition) → void
    entry = registry.lookup(current_state, dp_id, condition)
    if entry is null → STOP: UNDEFINED_TRANSITION
    log_transition(current_state, entry.next_state, dp_id, condition)
    current_state = entry.next_state
    execute_action(entry.action_id)
}
```

Encoding location: `state_transition_table.md` (this stream) is the authoritative specification. Implementation encodes this table at engine initialization; no runtime modification is permitted.

---

### G2 — How are DP handlers separated from phase orchestration?

Phase orchestration and DP handlers are two distinct layers:

- **Phase Orchestrator** (`PSEEPhaseOrchestrator`): sequences phases 0–6 in order. It calls the state machine's current state to determine which phase is active, invokes the phase runner, and passes the phase output to the state machine for transition resolution. It has no decision logic.

- **DP Handler Registry** (`DPHandlerRegistry`): a lookup table keyed by `dp_id` → handler function. Each handler is a pure function: `(PSEEContext, observable_inputs) → DPResult { dp_id, condition_value, affected_entities }`. Handlers read from `PSEEContext` and corpus inputs; they write nothing directly to `PSEEContext`. Their return value is passed to the state machine.

```
DPHandlerRegistry {
  handlers: map<DP_ID → fn(PSEEContext, CorpusInput) → DPResult>

  method: invoke(dp_id, context, corpus_input) → DPResult
    handler = handlers.get(dp_id)
    if handler is null → STOP: UNREGISTERED_DP
    return handler(context, corpus_input)
}

DPResult {
  dp_id:            DP_ID
  condition_value:  string    // e.g., "PASS", "FAIL", "PACKAGING_BOUNDARY", "UNKNOWN"
  affected_entities: string[] // paths, CEU IDs, or file paths relevant to the result
  heuristic_flags:  string[]  // if any ADMISSIBLE_REFERENCE heuristic informed the decision
}
```

Phase orchestrator → DP handler → DPResult → state machine → transition. No shortcutting.

---

### G3 — How is escalation suspended and resumed?

Escalation creates a suspension record in `PSEEContext.escalation_log` and sets `current_state = S-T2`. The affected entity (path, CEU, file) is recorded in the log entry.

Resumption requires an operator-supplied `EscalationResolution` object:
```
EscalationResolution {
  dp_id:          DP_ID
  affected:       string[]
  resolution:     string         // classification value or declaration
  resolution_basis: string       // operator-cited evidence
  resolved_at:    ISO-8601
}
```

On receiving a valid `EscalationResolution`, the engine:
1. Validates the resolution against the DP's expected outcome set (e.g., DP-1-02 accepts only EXTRACTION_ARTIFACT | PACKAGING_BOUNDARY | ARCHITECTURAL_STRUCTURE)
2. Writes `resolved_at` and `resolution` back to the escalation_log entry
3. Re-invokes the DP handler with the resolution as the `condition_value`
4. Calls `state_machine.transition(dp_id, condition_value)` to resume from the suspension state
5. Continues phase execution from the resume state (per escalation_and_fallback_spec.md Part 2)

A STOP (S-T1) does NOT resume. It requires a full restart from S-00.

Multi-path escalations: each suspended path has its own escalation_log entry. Paths not affected by the escalation continue; only the affected path is gated at S-T2.

---

### G4 — How are UNKNOWN-SPACE records created and persisted?

UNKNOWN-SPACE records are created by the `UnknownSpaceRecorder` module:

```
UnknownSpaceRecorder {
  method: record(context, us_condition, affected_entities, downstream_impact) → US_ID
    us_id = "US-" + zero_padded(len(context.us_records) + 1)
    record = UnknownSpace {
      us_id:              us_id
      condition_type:     us_condition       // US-CONDITION-01, 02, or 03
      description:        <generated from condition>
      affected_entities:  affected_entities
      downstream_impact:  downstream_impact
      created_at_state:   context.current_state
      resolution:         null               // never auto-resolved
    }
    context.us_records.append(record)
    return us_id
}
```

US records are appended to `PSEEContext.us_records` and persist for the full stream duration. They are NEVER resolved programmatically. Any code path that would set `resolution` on a US record without operator input is a governance violation (R-NRM-03 / INV-02).

Persistence: at stream completion, all US records are serialized into the `normalized_evidence_map` output (O-02). US records from S-T3 (PARTIAL) are included in the flagged outputs.

---

### G5 — How are blocked heuristics prevented from entering logic?

The `HeuristicGuard` module intercepts any reference to H-01, H-02, H-03, or H-07 at execution time. See `heuristic_guard_spec.md` for full specification.

Architectural enforcement points:

1. **Static exclusion list**: The engine initializes with a compile-time list of BLOCKED heuristic IDs: `{H-01, H-02, H-03, H-07}`. No DP handler may accept these IDs as input or read from a registry keyed by them.

2. **DPResult guard**: If any `DPResult.heuristic_flags` entry contains a BLOCKED ID, the engine does not call `state_machine.transition()`. Instead: STOP with reason "BLOCKED_HEURISTIC_IN_DECISION_PATH".

3. **Context write guard**: Any attempt to write to `PSEEContext` fields (`ceu_index`, `ovl_records`, `us_records`, `classification_map`, `filter_table`) using a BLOCKED heuristic as the derivation basis triggers: STOP with reason "CANONICAL_FIELD_WRITTEN_FROM_BLOCKED_HEURISTIC".

4. **No architecture-first input path**: The engine does not accept domain formation inputs organized by capability or architectural responsibility. `R-GRP-01` domain formation accepts only `primary_evidence_origin_paths` (source directory paths). Any input that specifies domains by function (H-01 / H-03 patterns) is rejected at the boundary with: "DOMAIN_INPUT_REJECTED: capability organization not permitted (FB-04)".

---

### G6 — How is source variance resolved without embedding BlueEdge assumptions?

The `SourceVarianceResolver` handles SV-01..SV-10 paths (see `variance_resolver_spec.md`). BlueEdge assumptions are excluded by these architectural rules:

1. **No hardcoded corpus counts**: The engine does not store or reference the numbers 3 (archives), 63 (modules), 53 (Phase B units), or any other BlueEdge-specific count. All counts are derived from the operator-declared inputs at runtime.

2. **No hardcoded framework detection**: Pattern detection (CT-04, DP-3-03) operates on directory structure comparison, not NestJS-specific detection logic. The pattern detector looks for `≥2 directories with identical internal file extension/role sets` — framework-agnostic.

3. **No hardcoded Phase B artifact set**: The Phase B target is read from the operator-supplied `phase_b_target` declaration (PC-03). The engine does not default to 40.2 artifacts.

4. **No hardcoded exclusion paths**: `explicitly_excluded_paths` is read from the boundary document. The engine has no default exclusion list.

5. **SV-dispatch table**: The `SourceVarianceResolver` contains a dispatch table keyed by `(dp_id, observed_condition)` → `SV_ID`. Each SV handler produces a deterministic outcome (PROCEED, STOP, ESCALATE) from source-agnostic observable facts only.

---

### G7 — How is replayability validated?

Replayability is enforced by the `ExecutionManifest` and validated by `ReplayabilityChecker`:

1. **Deterministic inputs recorded**: At stream start, the engine writes a manifest of all inputs: corpus_root, evidence_boundary hash, phase_b_target hash, system_identity, and all operator-supplied resolutions.

2. **State transition log**: Every `state_machine.transition()` call writes: `{timestamp, from_state, to_state, dp_id, condition_value, affected_entities}` to `PSEEContext.state_transition_log`.

3. **DP handler purity**: DP handlers are pure functions (no side effects, no external state). Same input → same DPResult.

4. **No stochastic elements**: No random number generation, no timestamp-based branching, no environment-dependent paths. All decisions trace to `(PSEEContext, observable_corpus_input)` pairs.

5. **Replayability proof**: Given the recorded manifest, any third party can re-execute the engine against the same inputs and produce an identical state transition log. The `engine_validation_report.md` includes the replay contract.

---

### G8 — How is PSEE.X explicitly excluded from authority?

PSEE.X exclusion is enforced at three levels:

1. **Compile-time exclusion list**: The engine initializes with a list of PSEE.X candidate pattern IDs: `{CP-01, CP-02, CP-03, CP-04, CP-05, CP-06, CP-07, CP-08, CP-09}`. These IDs may not appear as `condition_value`, `action_id`, or `heuristic_flag` in any DPResult or state machine transition.

2. **No FUTURE_REVIEW admission**: No engine decision path references `FUTURE_REVIEW` or `pattern_containment_matrix.md` entries. FUTURE_REVIEW patterns are not loaded into `DPHandlerRegistry` or `TransitionRegistry`.

3. **Authority source check**: Every DP handler cites its authority source as exactly one of: `[rule_catalog_v0.md, psee_v0_execution_spec.md, psee_v0_schema.json]`. PSEE.X documents (`candidate_pattern_registry.md`, `exploration_casebook.md`) are not valid authority sources for any handler. If a handler produces a result citing a PSEE.X document as its authority, the engine produces: STOP with reason "NON_CANONICAL_AUTHORITY_IN_DECISION_PATH".

---

## Section 1 — Engine Module Map

```
PSEE Engine
├── PSEEEntryPoint                  // execution entrypoint; validates pre-conditions
├── PSEEContextLoader               // loads corpus, boundary doc, Phase B target
├── PSEEStateMachine                // state tracking, transition resolution
│   └── TransitionRegistry         // static table: (state, dp_id, condition) → (next_state, action)
├── PSEEPhaseOrchestrator           // sequences phases 0–6; calls DP handlers; drives state machine
│   ├── Phase0Handler               // DP-0-01..04 (source binding)
│   ├── Phase1Handler               // DP-1-01..05 (normalization)
│   ├── Phase2Handler               // DP-2-01..04, DP-S-01 (filtering)
│   ├── Phase3Handler               // DP-3-01..05 (grouping)
│   ├── Phase4Handler               // DP-4-01..03 (abstraction/CEU)
│   ├── Phase5Handler               // DP-5-01..02, DP-S-02 (classification)
│   └── Phase6Handler               // DP-6-01 (reconstruction simulation)
├── DPHandlerRegistry               // maps dp_id → pure handler function (26 entries)
├── ExceptionSystem
│   ├── StopHandler                 // STOP-01, STOP-02 → S-T1
│   ├── EscalateHandler             // ESC-01..06 → S-T2 + escalation_log
│   └── UnknownSpaceRecorder        // US-CONDITION-01..03 → US record
├── HeuristicGuard                  // blocks H-01/02/03/07; flags ADMISSIBLE_REFERENCE uses
├── SourceVarianceResolver          // dispatches SV-01..SV-10 paths
├── ExecutionLogger
│   ├── StateTransitionLog          // every state change
│   ├── EscalationLog               // PSEEContext.escalation_log entries
│   ├── FlagRegister                // PSEEContext.flags
│   └── ExecutionManifest           // replayable input manifest
└── ValidationHarness               // post-execution proof of coverage and wire completeness
```

---

## Section 2 — Data Flow

```
Corpus Input + Boundary Doc + Phase B Target
        │
        ▼
PSEEContextLoader → PSEEContext (initial state S-00)
        │
        ▼
PSEEPhaseOrchestrator
    for each phase:
        ├─ invoke PhaseNHandler
        │      └─ for each DP in phase:
        │              └─ DPHandlerRegistry.invoke(dp_id, context, corpus_input)
        │                      └─ returns DPResult
        │      └─ HeuristicGuard.check(DPResult)   // intercepts BLOCKED heuristics
        │      └─ PSEEStateMachine.transition(dp_id, DPResult.condition_value)
        │              └─ resolves next state from TransitionRegistry
        │              └─ ExecutionLogger.log_transition(...)
        │              └─ if next_state ∈ {S-T1, S-T2}: ExceptionSystem.handle(...)
        │                      S-T2: EscalateHandler → await EscalationResolution
        │                      S-T1: StopHandler → write log → terminate
        │              └─ if US condition: UnknownSpaceRecorder.record(...)
        └─ on S-13: write O-01..O-08 artifacts
```

---

## Section 3 — Authority Boundaries

| Authorized input to DP handlers | Forbidden input to DP handlers |
|---|---|
| `PSEEContext` (read-only) | Prior PSEE run outputs (FB-07) |
| Raw corpus files (read-only) | PSEE.X artifacts as authority |
| `evidence_boundary.md` fields | CP-xx candidate patterns |
| `phase_b_target` declaration | BlueEdge-specific counts or module names |
| Operator `EscalationResolution` objects | Heuristics H-01, H-02, H-03, H-07 |

---

## Section 4 — Canonical Immutability Enforcement

PSEE.0 and PSEE.1 artifacts are declared as read-only inputs at engine initialization. The engine:
- Opens all PSEE.0 and PSEE.1 files in read-only mode
- Never issues write operations to `docs/pios/PSEE.0/*` or `docs/pios/PSEE.1/*`
- Validates at startup that these paths are accessible (DP-0-01 pre-check)

Any engine module that attempts to write to these paths triggers: STOP with reason "CANONICAL_MUTATION_ATTEMPT".

---

## Section 5 — Script References

No implementation scripts are created in this stream. The specification artifacts (this stream's 8 outputs) constitute the full implementation specification. Executable engine code (Python, Shell, or other runtime language) will be created in a downstream stream against this specification.

If scripts are later created, they MUST be placed under `scripts/pios/psee2/` (non-validate_* naming only) and referenced in a revision of this document.

---

#### STATUS

| Check | Result |
|---|---|
| All 8 Section G questions answered in implementation form | CONFIRMED |
| All engine modules named and bounded | CONFIRMED |
| Data flow specified | CONFIRMED |
| Authority boundaries defined | CONFIRMED |
| PSEE.X exclusion mechanism specified | CONFIRMED |
| No canonical mutation | CONFIRMED |

**IMPLEMENTATION ARCHITECTURE: COMPLETE**
