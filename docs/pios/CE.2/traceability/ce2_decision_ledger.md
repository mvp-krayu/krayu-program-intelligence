# CE.2 — Decision Trace Ledger

**Stream:** CE.2 — PiOS Core v0.2 Boundary Definition  
**Status:** ACTIVE — authoritative baseline

---

## ENTRIES

### [CE2-DEC-001]

**Definition**  
Condition state must be derived from 40.5 signal outputs only.

**Rationale**  
QA.1 showed signal variation without state change → missing linkage.

**Source**  
- CE.2 stream — WP1.1

**Constraints**  
- Determinism  
- Traceability  
- Replay invariance  

**Implications**  
40.6 cannot assign state independently of signals.

**Change Conditions**  
Only via governed CE override.

**Supersedes**  
None

---

### [CE2-DEC-002]

**Definition**  
Signal equivalence is evaluated only over signals relevant to a condition.

**Rationale**  
Avoid global coupling and preserve explicit dependency.

**Source**  
- CE.2 stream — WP1.3

**Constraints**  
- Determinism  
- Explicit signal scope  

**Implications**  
Each condition must declare its signal set.

**Change Conditions**  
Only via governed CE override.

**Supersedes**  
None

---

### [CE2-DEC-003]

**Definition**  
State must remain invariant under equivalent signal sets.

**Rationale**  
Required for replay invariance.

**Source**  
- CE.2 stream — WP1.3

**Constraints**  
- Determinism  
- Replay invariance  

**Implications**  
Same signals → same state (always).

**Change Conditions**  
Only if replay invariance is redefined (currently not allowed).

**Supersedes**  
None

---

### [CE2-DEC-004]

**Definition**  
State variation is allowed only through governed activation rules.

**Rationale**  
Prevents arbitrary mapping from signals to states.

**Source**  
- CE.2 stream — Primary Boundary  
- CE.2 stream — WP1.2  

**Constraints**  
- Determinism  
- Traceability  
- Explicit rule surface  

**Implications**  
Activation must be a defined system, not code logic.

**Change Conditions**  
Only via governed replacement model.

**Supersedes**  
None

---

### [CE2-DEC-005]

**Definition**  
Each condition must resolve to exactly one state for any valid relevant signal set.

**Rationale**  
State resolution must be deterministic and non-ambiguous.

**Source**  
- CE.2 stream — WP1.4

**Constraints**  
- Determinism  
- Traceability  
- Finite state space  

**Implications**  
No contradictory or multi-state outputs are allowed.

**Change Conditions**  
Only via governed replacement of the condition resolution model.

**Supersedes**  
None

---

### [CE2-DEC-006]

**Definition**  
Condition state resolution is condition-local and may only use declared relevant signals.

**Rationale**  
Avoid hidden coupling and preserve inspectable activation scope.

**Source**  
- CE.2 stream — WP1.4

**Constraints**  
- Explicit signal scope  
- No global override  
- No hidden inputs  

**Implications**  
Cross-condition state contamination is forbidden.

**Change Conditions**  
Only via governed expansion of condition scope rules.

**Supersedes**  
None

---

### [CE2-DEC-007]

**Definition**  
Any ordering or dominance used in state resolution must be explicitly governed, not implied by code order.

**Rationale**  
Prevent hidden precedence and non-inspectable resolution behavior.

**Source**  
- CE.2 stream — WP1.4

**Constraints**  
- Determinism  
- Explicit rule surface  
- Traceability  

**Implications**  
A future precedence or dominance mechanism must be first-class and documented.

**Change Conditions**  
Only via governed replacement with equal or stronger inspectability guarantees.

**Supersedes**  
None


---

### [CE2-DEC-008]

**Definition**  
Condition state resolution must be performed through an explicitly governed ordered precedence model, where signal contributions are evaluated according to a defined precedence structure that deterministically resolves to a single state.

**Rationale**  
Multiple signals may contribute conflicting state indications. A governed precedence model is required to resolve these conflicts deterministically without introducing arbitrary aggregation or hidden logic.

**Source**  
- CE.2 stream — WP1.5

**Constraints**  
- Determinism  
- Explicit precedence structure  
- Traceability  
- No implicit aggregation  
- Finite state hierarchy  

**Implications**  
State resolution must include a first-class precedence system defining how competing signal contributions are resolved.

**Change Conditions**  
Only via governed replacement of the resolution model with equal or stronger guarantees.

**Supersedes**  
None


---

### [CE2-DEC-009]

**Definition**  
Condition state resolution must use a finite, explicitly ordered state tier hierarchy defined as:

S3 — BLOCKED  
S2 — DEGRADED  
S1 — AT_RISK  
S0 — STABLE  

With strict ordering:

BLOCKED > DEGRADED > AT_RISK > STABLE

State resolution across tiers is determined by selecting the highest severity tier present among the evaluated signal contributions.

**Rationale**  
A deterministic and explainable resolution mechanism requires a finite and explicitly governed hierarchy. Selecting the highest severity tier ensures unambiguous resolution while avoiding aggregation, weighting, or hidden escalation logic.

**Source**  
- CE.2 stream — WP1.6

**Constraints**  
- Determinism  
- Explicit precedence hierarchy  
- Traceability  
- No aggregation or scoring  
- Finite state space  

**Implications**  
- Higher severity signals always dominate lower ones  
- No escalation occurs within the same tier  
- Multiple signals in the same tier do not change the outcome  
- Resolution remains simple and auditable  

**Change Conditions**  
Only via governed redefinition of the state hierarchy with equal or stronger guarantees on determinism and traceability.

**Supersedes**  
None


---

### [CE2-DEC-010]

**Definition**  
Each signal relevant to condition activation must bind through an explicit, deterministic, signal-local rule to exactly one governed tier contribution, which is then used by the ordered precedence model to resolve the final condition state.

**Rationale**  
Condition state resolution requires a consistent and governed interpretation of signal outputs. By enforcing a one-to-one binding from signal output to tier contribution, the system avoids ambiguity, hidden aggregation, and implicit interpretation logic.

**Source**  
- CE.2 stream — WP1.7

**Constraints**  
- Determinism  
- Signal-local binding  
- Explicit rule surface  
- Traceability  
- One signal → one tier contribution  

**Implications**  
- Signals do not directly assign condition states  
- Signal interpretation is separated from condition resolution  
- Tier contributions become the only input to precedence resolution  
- No signal may produce multiple or undefined tier outputs  

**Change Conditions**  
Only via governed redefinition of the signal binding model with equal or stronger guarantees on determinism and traceability.

**Supersedes**  
None


---

### [CE2-DEC-011]

**Definition**  
The governed tier vocabulary defined in CE.2 (BLOCKED, DEGRADED, AT_RISK, STABLE) SHALL replace the emitted condition state vocabulary. The emitted `condition_coverage_state` MUST use tier values directly with no intermediate mapping layer.

**Rationale**  
CE.2 introduces a new state activation model. Preserving legacy emitted states would require a lossy or ambiguous mapping from tiers to prior vocabulary, reducing traceability and masking state transitions. Direct emission of tier values ensures full fidelity of condition state across all downstream layers.

**Source**  
- CE.2 stream — Vocabulary Boundary Resolution

**Constraints**  
- Determinism  
- No intermediate transformation layer  
- Full traceability across 40.6 → 40.10  
- Single authoritative state vocabulary  

**Implications**  
- 40.6 emits tier values as condition state  
- 40.7 must extend CONDITION_TO_DIAGNOSIS_STATE to support all tier values  
- 40.9 and 40.10 remain unchanged and operate on new state values transparently  
- v0.1 condition vocabulary is superseded for CE.2 execution  

**Change Conditions**  
Only via governed redefinition of the condition state system with equal or stronger guarantees on traceability and determinism.

**Supersedes**  
v0.1 emitted condition state vocabulary

---

### [CE2-DEC-012]

**Definition**  
The signal-to-tier binding surface SHALL be represented as a governed table with the following minimal schema:

- `condition_id`  
- `signal_id`  
- `signal_field`  
- `binding_rule_id`  
- `tier_contribution`  

The deterministic key for the binding surface is:

- (`condition_id`, `signal_id`, `signal_field`, `binding_rule_id`)

Multiple rows for the same (`condition_id`, `signal_id`, `signal_field`) are permitted ONLY when they are distinguished by different governed `binding_rule_id` values. Row order has no meaning. Determinism must come from governed binding rule evaluation, never from physical row order or first-match behavior.

Each entry defines the deterministic tier contribution produced by a specific signal field for a specific condition under a governed binding rule.

**Rationale**  
A complete and traceable activation model requires explicit identification of:  
(1) the condition context,  
(2) the signal source,  
(3) the evaluated signal field,  
(4) the governed rule determining interpretation,  
(5) the resulting tier.  

Without a binding rule reference, the system cannot explain or audit how signal values resolve into tier contributions. Without an explicit deterministic key, the binding surface becomes ambiguous and can reintroduce non-determinism through row selection.

**Source**  
- CE.2 stream — Binding Surface Definition
- CE.2 stream — Final Validation Pass

**Constraints**  
- Deterministic evaluation  
- Signal-local interpretation  
- Explicit rule reference (no hidden logic)  
- Alignment with DEC-009 tier hierarchy  
- No aggregation or cross-signal coupling  
- No row-order semantics  
- Non-unique (`condition_id`, `signal_id`, `signal_field`) tuples allowed only through governed `binding_rule_id` differentiation  

**Implications**  
- Binding logic becomes a first-class governed artifact  
- The binding table is the operational control surface for condition activation  
- Precedence resolution (DEC-009) operates on outputs of this table only  
- Each signal-to-tier decision is inspectable and traceable  
- Static row lookup without governed rule evaluation is invalid for CE.2  

**Change Conditions**  
Only via governed modification of binding schema with preserved determinism and traceability guarantees.

**Supersedes**  
Implicit or code-embedded signal interpretation logic


---

### [CE2-DEC-013]

**Definition**  
Every `binding_rule_id` referenced by the CE.2 binding surface MUST resolve to a governed binding rule definition that is value-reactive. A binding rule is not a nominal label. It is an explicit rule artifact that evaluates a declared `signal_field` and deterministically produces exactly one tier contribution.

A governed binding rule definition MUST specify at minimum:

- `binding_rule_id`
- `signal_field`
- `evaluation_type`
- `evaluation_logic`
- `output_tier`
- `null_handling`

Static tier assignment without value evaluation is INVALID for CE.2.

**Rationale**  
DEC-012 introduced `binding_rule_id` as a required field in the binding surface, but without a governed rule class the field can be satisfied nominally while preserving v0.1-style invariance. CE.2 requires value-reactive state activation; therefore binding rules must be governed as first-class evaluators of signal values, not as labels attached to fixed tier assignments.

**Source**  
- CE.2 stream — final validation pass
- CE.2 stream — binding surface refinement

**Constraints**  
- Determinism  
- Value-reactive evaluation  
- Explicit rule surface  
- Traceability  
- One rule → one tier output  
- No static assignment compliance  

**Implications**  
- Every populated CE.2 binding table row must reference a governed rule artifact  
- Binding rules must inspect signal values, not merely decorate tier assignments  
- CE.2 cannot be executed until the governed binding rule class exists  

**Change Conditions**  
Only via governed redefinition of the binding rule model with equal or stronger guarantees on determinism, value-reactivity, and traceability.

**Supersedes**  
Implicit or nominal interpretation of `binding_rule_id`

---

### [CE2-DEC-014]

**Definition**  
The CE.2 emitted tier vocabulary SHALL map to diagnosis activation state at 40.7 through the following governed mapping:

- `BLOCKED`  → `BLOCKED`
- `DEGRADED` → `ACTIVE`
- `AT_RISK`  → `ACTIVE`
- `STABLE`   → `INACTIVE`

This mapping is mandatory for CE.2 execution and replaces the v0.1 `CONDITION_TO_DIAGNOSIS_STATE` mapping for CE.2-compatible runs.

**Rationale**  
DEC-011 established that CE.2 tiers replace emitted condition state vocabulary. Without a governed tier→diagnosis mapping, 40.7 remains non-deterministic across implementers and fails at runtime against v0.1 expectations. This decision closes the only downstream vocabulary dependency created by CE.2.

**Source**  
- CE.2 stream — vocabulary boundary resolution
- CE.2 stream — final validation pass

**Constraints**  
- Determinism  
- Single governed downstream mapping  
- No lossy intermediate state layer  
- Full downstream traceability  

**Implications**  
- `activate_diag()` / `CONDITION_TO_DIAGNOSIS_STATE` must be updated for CE.2 execution  
- 40.7 becomes compatible with CE.2 emitted tiers  
- 40.8 / 40.9 / 40.10 / 40.11 remain structurally unchanged  

**Change Conditions**  
Only via governed redefinition of diagnosis activation semantics with equal or stronger guarantees on determinism and traceability.

**Supersedes**  
v0.1 tier-incompatible diagnosis activation mapping for CE.2 runs

