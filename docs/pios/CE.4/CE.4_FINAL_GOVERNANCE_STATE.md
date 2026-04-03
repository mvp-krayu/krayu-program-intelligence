# CE.4 — Final Governance State

**Authority:** CE.4 — PiOS Signal Emission Contract Definition
**Version:** PiOS v0.3
**Date:** 2026-04-03
**Status:** AUTHORITATIVE — CLOSED

---

## I. GOVERNED LAYER DEFINITION — 40.5

**40.5 (Signal Computation)** is a governed PiOS layer.

Its governing contract is the Signal Emission Contract (CE.4).
Its governing registry is the Signal Ledger (CE.4).
Its upstream boundary is 40.4 (telemetry intake).
Its downstream boundary is 40.6 (condition activation, governed by CE.2).

40.5 owns exactly one function: receiving telemetry variables from 40.4 and emitting
a governed signal output packet to 40.6. No signal may participate in that packet unless
it is registered in the Signal Ledger with `governance_status=GOVERNED`.

---

## II. CANONICAL SIGNAL EMISSION MODEL

A signal is an entity with a unique identity, a semantic intent, a computability class,
and a governed emission state. A signal does not describe what it "tried" to compute.
It declares what it computed, under what state, and why any portion is absent.

Every signal emission MUST conform to the following model:

### Identity (required, all signals)
- `signal_id` — canonical identifier (SIG-NNN)
- `canonical_name` — human-readable name
- `ckr` — Canonical Knowledge Reference
- `state` — one of the four governed emission states (Section III)
- `output` — resolved object or null

### Computability (determined at ledger registration, not at runtime)
Every signal has exactly one computability class (Section IV). This class is fixed — it
does not change between invocations. It is a property of the signal's specification.

### Payload obligations (state-dependent, Section V)
Every emission state carries mandatory payload fields. Emission without mandatory fields
is a contract violation.

---

## III. EMISSION STATE SYSTEM — CLOSED SET

Exactly four emission states are governed. No other state is valid.

```
EC-STATE-001   COMPLETE
EC-STATE-002   PARTIAL
EC-STATE-003   BLOCKED
EC-STATE-004   COMPUTABLE_PENDING   [reserved — not active in PiOS v0.3 engine]
```

### EC-STATE-001 — COMPLETE

All output fields carry resolved non-null values.
All required inputs were available. All formulas executed.
`output` is a non-null object. No field in `output` is null.
`traceability` is present with a formula string per output field.

### EC-STATE-002 — PARTIAL

At least one output field is resolved. At least one output field is null.
`output` is a non-null object containing both resolved and null values.
`partiality_reasons` is present with a structured entry per null field.
Each entry in `partiality_reasons` carries: `failure_class`, cause identification,
and (for derived signals) `upstream_signal`.

Two sub-patterns:

**PARTIAL / primitive:** null fields originate from pending input variables.
`failure_class` = F-1b. `traceability` present for all fields.

**PARTIAL / derived:** null fields originate from upstream BLOCKED or PARTIAL signals.
`failure_class` = F-3 (upstream BLOCKED) or F-4 (upstream PARTIAL field).
No `traceability` field (inputs are upstream signals, not variable formulas).

### EC-STATE-003 — BLOCKED

No output is produced. `output` = null.
`blocking_class` is present (F-1a or F-2).
`blocking_inputs` is present (array of variable IDs or signal IDs).
`blocking_reason` is present (string).
All three blockage fields are mandatory.

### EC-STATE-004 — COMPUTABLE_PENDING

Reserved. Not active. Defined to prevent conflation of F-1b with F-1a at the state level
in future implementations. Signals in static context that are computable with event data
but cannot yet emit COMPLETE are currently emitted as PARTIAL (primitive).

---

## IV. COMPUTABILITY MODEL — FINAL

Computability is a property of signal specification. It is fixed. It does not vary by
invocation or input supply.

```
CC-001   COMPUTABLE_STATIC         All inputs STRUCTURAL; emits COMPLETE always
CC-002   COMPUTABLE_EVENT          Requires EVENT_BASED inputs; emits COMPLETE (live) or PARTIAL (static)
CC-003   COMPUTABLE_TIMESERIES     Requires TIME_SERIES inputs; emits COMPLETE (accumulated) or BLOCKED (static)
CC-004   COMPUTABLE_DERIVED        Inputs are upstream signals; emits COMPLETE, PARTIAL, or BLOCKED per upstream state
CC-005   NON_COMPUTABLE            No formula exists in the non-blocked execution path; emits BLOCKED regardless of input supply
```

**Current signal computability:**

| Signal | Class | Primary state (static context) |
|---|---|---|
| SIG-001 | CC-002 | PARTIAL |
| SIG-002 | CC-001 | COMPLETE |
| SIG-003 | CC-005 | BLOCKED |
| SIG-004 | CC-001 | COMPLETE |
| SIG-005 | CC-002 | PARTIAL |
| SIG-006 | CC-005 | BLOCKED |
| SIG-007 | CC-004 | PARTIAL |
| SIG-008 | CC-004 | PARTIAL |

**CC-005 is not a data gap. It is a specification gap.** A CC-005 signal cannot become
COMPLETE by supplying inputs. It requires formula specification and implementation.

---

## V. PAYLOAD CONTRACT — MANDATORY FIELDS BY STATE

### COMPLETE

```
signal_id         required
canonical_name    required
ckr               required
state             "COMPLETE"
output            { <field>: <non-null value>, ... }     no null values permitted
traceability      { <field>: <formula string>, ... }     one entry per output field
```

### PARTIAL (primitive)

```
signal_id             required
canonical_name        required
ckr                   required
state                 "PARTIAL"
output                { <field>: <value or null>, ... }
traceability          { <field>: <formula string>, ... }
partiality_reasons    { "<null_field>": { "failure_class": "F-1b", "cause": <string> } }
```

### PARTIAL (derived)

```
signal_id             required
canonical_name        required
ckr                   required
state                 "PARTIAL"
output                { <field>: <value or null>, ... }
partiality_reasons    {
                        "<null_field>": {
                          "failure_class": "F-3" | "F-4",
                          "upstream_signal": <signal_id>,
                          ["upstream_field": <field>]      // F-4 only
                          "cause": <string>
                        }
                      }
```

### BLOCKED

```
signal_id         required
canonical_name    required
ckr               required
state             "BLOCKED"
output            null                                    // must be null, not absent
blocking_class    "F-1a" | "F-2"                        required
blocking_inputs   [ <variable_id or signal_id>, ... ]   required
blocking_reason   <string>                               required
```

---

## VI. FAILURE CLASS TAXONOMY — CLOSED SET

Six failure classes are governed. They are not states — they are causes assigned to
null fields or blocked emissions.

| Class | Name | Nature | Affected field or signal |
|---|---|---|---|
| F-1a | INPUT_ABSENCE / STRUCTURAL | TIME_SERIES input required; static context cannot supply it | BLOCKED signal |
| F-1b | INPUT_ABSENCE / CONTEXTUAL | EVENT_BASED input pending in current invocation | Null field in PARTIAL signal |
| F-2 | FORMULA_ABSENCE | No formula in computation function; output cannot be produced regardless of inputs | BLOCKED signal (CC-005) |
| F-3 | UPSTREAM_BLOCKAGE | Upstream signal is BLOCKED; dependent component null | Null field in derived PARTIAL signal |
| F-4 | UPSTREAM_PARTIALITY | Upstream signal is PARTIAL; specific upstream field is null | Null field in derived PARTIAL signal |
| F-5 | METADATA_ABSENCE | Blockage or partiality metadata missing from payload | Payload violation (not a state) |
| F-6 | STRUCTURAL_HETEROGENEITY | Inconsistent payload schema across signals at same state | System-level violation (not per-signal) |

F-5 and F-6 are contract violations. They describe deviations from this document's payload
contract, not governed emission behaviors.

---

## VII. DEPENDENCY PROPAGATION — GOVERNED RULES

Applies to CC-004 (derived) signals only.

| Upstream state | Propagation result | Failure class |
|---|---|---|
| COMPLETE | Component resolves normally | none |
| PARTIAL — affected field null | Corresponding derived component = null | F-4 |
| PARTIAL — unaffected field resolved | Component uses resolved value | none |
| BLOCKED | Corresponding derived component = null | F-3 |
| All upstream BLOCKED | Derived signal emits BLOCKED | F-3 |
| All upstream COMPLETE | Derived signal emits COMPLETE | none |

**Propagation depth:** one level. Derived-of-derived signals require explicit intermediate
state evaluation — transitive propagation without inspection is prohibited.

**40.6 boundary:** propagation rules terminate at 40.5 emission. 40.6 receives the
final payload and applies CE.2 binding rules to null and resolved fields independently.
CE.2 does not receive or interpret `partiality_reasons` or `blocking_class`.

---

## VIII. SIGNAL LEDGER — ROLE AND AUTHORITY

The Signal Ledger is the canonical governance registry for all 40.5 signals.

**Authority:** A signal does not exist in the governed sense until it has a Signal Ledger
entry. A signal with `governance_status=UNGOVERNED` must not participate in production
40.5 computation.

**Required fields per entry (18):**
`signal_id`, `signal_name`, `governing_layer`, `semantic_intent`, `ckr`,
`computability_class`, `formula_presence`, `formula_reference`,
`required_inputs`, `optional_inputs`, `dependency_inputs`, `input_temporal_classes`,
`allowed_emission_states`, `invalid_emission_states`, `primary_emission_state`,
`blockage_rules`, `partiality_rules`, `undefined_rules`,
`traceability_requirements`, `derivation_run`, `specification_document`,
`downstream_consumption_constraints`,
`documentation_status`, `governance_status`, `open_gaps`

**Maintenance rule:** A Signal Ledger entry must be updated whenever a signal's
computability class, formula presence, required inputs, or emission state contract changes.
Ledger changes require an explicit governance decision.

**Current state:** All 8 Signal Ledger entries are populated. All 8 carry
`governance_status=PARTIALLY_GOVERNED` and `documentation_status=ABSENT`. These
reflect pre-CE.4 documentation debt (D-001, D-002) — not structural ledger failures.
Full GOVERNED status requires D-002 resolution (canonical 40.5 run_02_ce_validation docs).

---

## IX. DOWNSTREAM INVARIANTS — WHAT 40.6+ MAY NOW ASSUME

These are guarantees that the 40.5 emission contract provides to all downstream layers.

**INV-001:** Every signal in the 40.6 input packet carries one of the four governed
emission states. No signal carries an ungoverned, unlabeled, or ambiguous state.

**INV-002:** A COMPLETE signal's `output` object contains no null values. Every field
is resolved and traceable.

**INV-003:** A PARTIAL signal's `output` object contains at least one resolved field.
Every null field has a corresponding `partiality_reasons` entry.

**INV-004:** A BLOCKED signal's `output` is null. The null is complete — not partial.
`blocking_class`, `blocking_inputs`, and `blocking_reason` are present.

**INV-005:** A CC-005 (NON_COMPUTABLE) signal always emits BLOCKED. 40.6 does not
need to distinguish it from other BLOCKED causes — CE.2 `BR-NULL-SIGNAL-BLOCKED`
applies uniformly. The distinction is relevant only for repair routing, which is outside 40.6 scope.

**INV-006:** No signal emits a mixed COMPLETE/BLOCKED hybrid (some fields resolved, no
`partiality_reasons`). The PARTIAL state with `partiality_reasons` is the only governed
form of mixed output.

**INV-007:** CE.2 DEC-001 through DEC-014 are unchanged. All binding rules, tier
resolution, activation logic, and downstream propagation through 40.7 → 40.10 remain
as certified under PiOS v0.2.

---

## X. PROHIBITED BEHAVIORS — INVALID IN PiOS v0.3

The following behaviors are no longer permitted. Presence of any of these in a PiOS v0.3
emission is a contract violation.

| Prohibited behavior | Replaces |
|---|---|
| BLOCKED signal without `blocking_class` | SIG-003 CE.2-R01-MIX pattern (no blockage metadata) |
| BLOCKED signal without `blocking_inputs` | Any BLOCKED payload missing input attribution |
| BLOCKED signal without `blocking_reason` | Any BLOCKED payload missing cause string |
| PARTIAL signal with `note` field | SIG-007 and SIG-008 CE.2-R01-MIX `note` field pattern |
| PARTIAL signal with null fields but no `partiality_reasons` | Any mixed output without structured cause |
| COMPLETE signal with any null output field | Any COMPLETE payload with unresolved fields |
| Two signals in the same state carrying different payload schemas | PARTIAL-A vs PARTIAL-B structural heterogeneity |
| Citing `docs/pios/40.5/` run_01_blueedge documents as authoritative for run_02_ce_validation engine behavior | D-001 violation |
| Any signal state string outside {COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING} | Ungoverned runtime artifacts |
| A signal participating in 40.5 computation without a Signal Ledger entry | Ungoverned signal presence |

---

## XI. BEFORE → AFTER SIGNAL SEMANTICS TRANSFORMATION

| Dimension | PiOS v0.1 / v0.2 | PiOS v0.3 |
|---|---|---|
| BLOCKED definition | Incidental runtime artifact; engine-produced; no mandatory payload | Governed contract state EC-STATE-003; mandatory blocking_class, blocking_inputs, blocking_reason |
| PARTIAL definition | State label applied to any signal with mixed null/resolved output; no structured cause | Governed contract state EC-STATE-002; mandatory partiality_reasons per null field; failure_class per cause |
| Null field semantics | Serialized as `null`; cause not machine-readable | Null field accompanied by partiality_reasons entry with failure_class; cause is machine-readable |
| Computability | Implied by runtime behavior; not explicitly classified | Formally governed as CC-001 through CC-005; fixed at specification time; independent of input supply |
| NON_COMPUTABLE | Not distinguished from data-absent BLOCKED | CC-005 — explicitly classified; cannot be resolved by data supply; requires formula specification |
| Formula presence | Implicit; verified only by reading engine source | Governed field in Signal Ledger: formula_presence boolean; formula_reference path |
| Payload consistency | Heterogeneous — SIG-006 carries blockage metadata, SIG-003 does not; SIG-001 has traceability, SIG-007 has note | Uniform per state class — all BLOCKED identical structure; all PARTIAL (primitive) identical; all PARTIAL (derived) identical |
| Signal registry | No registry — signal set implied by engine code | Signal Ledger — canonical governance registry; signal does not exist without entry |
| Documentation authority | `docs/pios/40.5/` (run_01_blueedge context) — misaligned with active engine | Engine source interim authoritative per DA-004; ALIGNED canonical documentation required per DA-003; misaligned docs classified non-authoritative |
| 40.5 governance | Ungoverned layer — no decision ledger, no emission contract | Governed layer — CE.4 emission contract; Signal Ledger; computability model; propagation rules; documentation alignment rules |
| `note` field | Informal explanation on derived PARTIAL signals | Prohibited; replaced by `partiality_reasons` |

---

## XII. PiOS v0.3 BOUNDARY STATEMENT

**PiOS v0.3 is defined by the addition of the CE.4 Signal Emission Contract to the
PiOS governance stack, extending governed coverage from 40.6–40.10 (PiOS v0.2 / CE.2)
to include 40.5 (PiOS v0.3 / CE.4), with CE.2 invariants unchanged.**
