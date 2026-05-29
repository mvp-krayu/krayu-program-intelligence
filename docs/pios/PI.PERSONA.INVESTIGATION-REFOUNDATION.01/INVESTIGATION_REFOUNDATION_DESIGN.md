# PI.PERSONA.INVESTIGATION-REFOUNDATION.01

## INVESTIGATION Persona Design — Verification / Replay / Qualification

**Stream Classification:** G1 — Architecture-Mutating
**Status:** DESIGN ONLY — no implementation

---

## 1. Constitutional Position

| Persona | Question | Agency Model | What It Does |
|---------|----------|-------------|--------------|
| BOARDROOM | What matters? | LOW — system compresses | Compresses posture for decision-makers |
| BALANCED | Why operationally? | MODERATE — system explains | Explains operational meaning of consequences |
| DENSE | How structurally? | HIGH — operator explores | Proves structural basis through topology |
| OPERATOR | What's the evidence? | HIGH — operator-controlled | Inspects evidence, signals, derivation chains |
| **INVESTIGATION** | **Is it correct?** | **LOW — system-enforced sequence** | **Verifies derivation integrity, replays compilation, qualifies maturity** |

### The Distinction

OPERATOR **shows** the evidence chain. INVESTIGATION **verifies** it.

OPERATOR = "Here is what the system derived."
INVESTIGATION = "Here is proof that the derivation is correct — or where it breaks."

OPERATOR is an open workspace (high agency, free navigation).
INVESTIGATION is a governed verification protocol (low agency, system-enforced sequence).

The operator does not navigate INVESTIGATION freely. The system presents verification steps in order. Each step produces PASS or FAIL. The operator observes the verification, does not drive it.

---

## 2. What INVESTIGATION Verifies

The compilation pipeline has 5 verifiable stages. INVESTIGATION walks each one.

### Full Derivation Pipeline

```
SIGNALS (evidence_blocks)
  ↓ supporting_signal_ids
CONDITIONS (SSE synthesis)
  ↓ §4 mapping rules
ATOMIC CONSEQUENCES (makeAtomic)
  ↓ deduplication + §5.2 combination
COMBINED CONSEQUENCES (makeCombination + escalation §6.1)
  ↓ persona projection
PERSONA OUTPUTS (forBoardroom, forBalanced, forOperator)
```

Each arrow is a verifiable derivation step. INVESTIGATION replays each step and checks that the output matches.

---

## 3. Verification Sequence

### Step 1: Evidence Anchor Verification

**Question:** Do the claimed evidence references actually exist?

**Inputs:**
- `consequence.evidence_refs[]` — array of `{ type, id, condition_type }`
- `consequence.source_signal_ids[]` — array of signal IDs
- `report.evidence_blocks[]` — the actual evidence

**Verification:**
- For each `evidence_ref` of type `'condition'`: does a condition with that `id` exist in `synthesisResult.conditions`?
- For each `source_signal_id`: does a signal with that ID exist in `report.evidence_blocks`?
- For each `evidence_ref` of type `'consequence'` (in combinations): does a consequence with that `id` exist in `consequenceResult.atomic_consequences`?

**PASS:** Every reference resolves to an existing evidence object.
**FAIL:** At least one reference is orphaned (points to nothing).

**Failure classification:**
- `ORPHANED_CONDITION_REF` — condition ID in evidence_refs not found in synthesis
- `ORPHANED_SIGNAL_REF` — signal ID not found in evidence blocks
- `ORPHANED_CONSEQUENCE_REF` — contributing consequence ID not found in atomics

---

### Step 2: Derivation Trace Replay

**Question:** Does following the derivation trace reproduce the consequence?

**Inputs:**
- `consequence.derivation_trace[]` — array of `{ source_id, source_type, rule, target_id, target_type }`
- The actual mapping functions (`mapDPC`, `mapDCkP`, etc.)

**Verification:**
- Walk the derivation trace from first step to last
- At each step, verify:
  - The `source_id` exists as an output of a prior step (or as a root condition)
  - The `rule` reference (§4, §5.2, §6.1) is valid for the source→target transition
  - The `target_id` matches the consequence_type_id that the rule would produce

**PASS:** The trace is a valid, reproducible path from evidence to consequence.
**FAIL:** At least one step in the trace is unreproducible.

**Failure classification:**
- `TRACE_BREAK` — a step's source_id doesn't exist
- `RULE_MISMATCH` — the rule cited doesn't produce the claimed target
- `TRACE_INCOMPLETE` — trace doesn't reach back to a root condition

---

### Step 3: Consequence Rule Verification

**Question:** Does each atomic consequence correctly apply its activation rule?

**Inputs:**
- `consequence.source_condition_types[]` — the condition types that activated this consequence
- `consequence.consequence_type_id` — the consequence type produced
- `consequence.activation_rule` — the rule reference (e.g., "§4 DELIVERY_PRESSURE_CONCENTRATION → COORD_FRAG")

**Verification:**
For each atomic consequence, verify against the §4 mapping table:

| Condition Type | Valid Consequence Types |
|---------------|----------------------|
| DELIVERY_PRESSURE_CONCENTRATION | COORD_FRAG (defining), DEL_EXP (defining), OP_BOTTLENECK (conditional) |
| DEPENDENCY_CHOKE_POINT | DEP_AMP (defining), COORD_FRAG (conditional), OP_BOTTLENECK (conditional) |
| PROPAGATION_ASYMMETRY | PROP_EXP (defining), DEL_EXP (conditional) |
| STRUCTURAL_MASS_CONCENTRATION | RESIL_DEF (defining), STAB_RISK (conditional) |
| CROSS_DOMAIN_COUPLING_PRESSURE | COORD_FRAG (defining), PROP_EXP (conditional) |
| GOVERNANCE_COVERAGE_STATUS | GOV_GAP (severity-gated) |
| COMPOUND_CONVERGENCE | STAB_RISK (defining) |

- Does the `condition_type → consequence_type_id` mapping exist in §4?
- Is the severity correctly inherited from the source condition?
- Is the confidence correctly inherited from the source condition's `governance_boundary`?

**PASS:** Every atomic consequence traces to a valid §4 rule.
**FAIL:** A consequence exists that no rule would produce from its source condition.

**Failure classification:**
- `INVALID_MAPPING` — condition_type + consequence_type_id pair not in §4
- `SEVERITY_MISMATCH` — consequence severity doesn't match source condition
- `CONFIDENCE_MISMATCH` — consequence confidence doesn't match source boundary

---

### Step 4: Combination Pattern Verification

**Question:** Are the combinations legitimate? Do the contributing consequences actually co-occur under the right conditions?

**Inputs:**
- `consequence.combination_pattern` — the pattern ID
- `consequence.contributing_consequences[]` — consequence IDs that were combined (via `decomposition`)
- `consequence.escalation_applied` / `consequence.escalation_reason`
- The actual combination rules in `detectCombinations()`

**Verification against §5.2 combination table:**

| Pattern | Required Contributing Types | Locus Rule | Escalation |
|---------|---------------------------|------------|------------|
| AMPLIFIED_DEP_FRAG | COORD_FRAG (from DPC) + DEP_AMP (from DCkP) | Same locus | No |
| STRUCT_GRAVITY_WELL | DEL_EXP (from DPC) + RESIL_DEF (from SMC) | Same locus | No |
| SYSTEMIC_OP_FRAG | ≥3 atomics from ≥3 distinct condition types | Same locus | Yes (§6.1) |

- Do the contributing consequences have the required types?
- Do they share the same locus (required for combination)?
- Is escalation correctly applied/not applied?
- If escalation applied: does severity = `SEVERITY_ESCALATION[baseSev]`?

**PASS:** Every combination matches a valid §5.2 pattern with correct locus and escalation.
**FAIL:** A combination exists that violates its pattern rules.

**Failure classification:**
- `INVALID_COMBINATION` — contributing types don't match any §5.2 pattern
- `LOCUS_VIOLATION` — contributing consequences from different loci combined
- `ESCALATION_ERROR` — escalation applied incorrectly or missing when required
- `CONTRIBUTING_MISMATCH` — claimed contributing consequences don't exist in atomics

---

### Step 5: Compilation Integrity Verification

**Question:** Does the full compilation produce a self-consistent result?

**Inputs:**
- `consequenceResult.compilation_trace` — the compilation metadata
- `consequenceResult.consequences[]` — the top-level consequence set
- `consequenceResult.atomic_consequences[]` — the full atomic set
- `consequenceResult.combination_consequences[]` — the combination IDs

**Verification:**
- `input_condition_count` = actual count of conditions in synthesis
- `conditions_producing_consequences` = count of non-NOMINAL conditions
- `suppressed_conditions` = input - producing
- `combination_patterns_matched` = actual count of combinations
- `escalations_applied` = actual count of escalated combinations
- Every consequence in `consequences[]` is either an uncombined defining atomic OR a combination
- No combined atomic appears in `consequences[]` (it should be subsumed)
- `consequence_count` = actual length of `consequences[]`
- `systemic_count` = actual count where `consequence_scope === 'SYSTEMIC'`
- `primary_consequence` = ID of first consequence (highest severity)

**PASS:** All compilation metadata matches actual counts. No structural inconsistency.
**FAIL:** Metadata disagrees with actual data.

**Failure classification:**
- `COUNT_MISMATCH` — trace counts don't match actuals
- `SUBSUMPTION_LEAK` — combined atomic appears in top-level (should be subsumed)
- `ORDERING_VIOLATION` — consequences not sorted by severity
- `PRIMARY_MISMATCH` — primary_consequence ID doesn't match first element

---

## 4. PASS/FAIL Model

### Per-Step Verdicts

Each of the 5 verification steps produces one of:

| Verdict | Meaning |
|---------|---------|
| **PASS** | All checks within this step succeed |
| **FAIL** | At least one check produces a structural error |
| **INSUFFICIENT** | Cannot verify — required evidence is missing or malformed |

### Overall Investigation Verdict

| Overall Verdict | Condition |
|----------------|-----------|
| **VERIFIED** | All 5 steps PASS |
| **PARTIALLY_VERIFIED** | No FAIL, but at least one INSUFFICIENT |
| **VERIFICATION_FAILED** | At least one step FAIL |
| **CANNOT_INVESTIGATE** | Input data missing or malformed — investigation cannot begin |

### Failure Severity

Each failure is classified:

| Severity | Meaning |
|----------|---------|
| **STRUCTURAL** | Derivation chain is broken — consequence claims evidence it doesn't have |
| **CONSISTENCY** | Internal metadata disagrees — compilation produced inconsistent bookkeeping |
| **COVERAGE** | Evidence exists but verification cannot reach it — gap in the chain |

---

## 5. Required Evidence Inputs

INVESTIGATION consumes the same data as OPERATOR but with verification intent:

| Input | Source | Used In |
|-------|--------|---------|
| `report.evidence_blocks[]` | Report object | Step 1 (signal anchor) |
| `synthesisResult.conditions[]` | SignalSynthesisEngine | Step 1 (condition anchor), Step 3 (rule verification) |
| `consequenceResult.consequences[]` | ConsequenceCompiler.compile() | Steps 2-5 |
| `consequenceResult.atomic_consequences[]` | ConsequenceCompiler.compile() | Steps 3-5 |
| `consequenceResult.compilation_trace` | ConsequenceCompiler.compile() | Step 5 |
| `CONSEQUENCE_VOCABULARY` | ConsequenceCompiler export | Step 3 (rule table) |

No new data sources required. INVESTIGATION operates on the same compilation output that OPERATOR inspects — it adds verification, not data.

---

## 6. Replay Contract

### Definition

**Replay** = given identical inputs (`synthesisResult`, `fullReport`), `compile()` produces identical `consequenceResult`.

### What Replay Proves

1. **Determinism**: The compiler is a pure function — no hidden state, no randomness, no temporal dependency
2. **Reproducibility**: Any future session with the same evidence produces the same consequences
3. **Auditability**: The derivation can be independently verified by replaying from source

### Replay Verification Protocol

```
1. Capture current consequenceResult (the "claim")
2. Re-execute compile(synthesisResult, fullReport) (the "replay")
3. Deep-compare claim vs replay:
   - Same consequence IDs (order-independent)
   - Same consequence types
   - Same severities
   - Same derivation traces
   - Same compilation trace counts
4. Verdict:
   - REPLAY_MATCH: identical
   - REPLAY_DIVERGENCE: differences detected (list each)
   - REPLAY_ERROR: replay threw an error
```

### Replay Scope — Phased Extension

Compiler-only replay is a **Phase 1 implementation boundary**, not a permanent doctrine. The SSE is equally deterministic (same `evidence_blocks` + same `semantic_domain_registry` → same `conditions[]`), but it lacks the structured lineage fields that Program 1 gave the compiler (`derivation_trace`, `evidence_refs`).

**Phase 1 (this design):** Compiler replay only (conditions → consequences). SSE output is verified by anchor-checking (Step 1), not by replaying. This is sufficient because Program 1 structured the compiler's full evidence chain.

**Phase 2 (future stream):** SSE replay (signals → conditions). Requires equivalent evidence-chain structuring on the SSE side — `derivation_trace` on conditions tracing back to signal blocks, `evidence_refs` on conditions pointing to `evidence_blocks[]` entries. This is the same pattern Program 1 applied to consequences, applied one layer upstream.

Phase 2 closes the full replayable chain:

```
SIGNALS → CONDITIONS → CONSEQUENCES
         ↑ Phase 2      ↑ Phase 1
         (SSE replay)   (compiler replay)
```

Phase 2 is a separate stream with its own §5.5 assessment. It does not block Phase 1 implementation.

### Replay as Qualification Gate

Replay MATCH is a precondition for any SQO qualification advancement that depends on consequence-derived evidence. If the system cannot replay its own derivation, it cannot assert qualification readiness.

Phase 1 replay (compiler) is sufficient for initial qualification gates. Full-chain replay (Phase 2) becomes a requirement when qualification claims depend on signal-level provenance.

---

## 7. Relationship to OPERATOR

### Cognitive Descent Contract

```
OPERATOR ──────→ INVESTIGATION
(inspect)         (verify)
   ↑                  │
   └──── results ─────┘
```

The transition from OPERATOR → INVESTIGATION is NOT a view switch. It is a **verification protocol entry**.

### Entry Conditions

INVESTIGATION activates when the operator:
1. Is in OPERATOR mode (prerequisite)
2. Triggers verification on a specific consequence OR on the full compilation
3. The system has sufficient evidence to begin (not CANNOT_INVESTIGATE)

### What Changes at Transition

| Aspect | OPERATOR | INVESTIGATION |
|--------|----------|---------------|
| Agency | HIGH — operator navigates freely | LOW — system drives the sequence |
| Sequence | None — open workspace | Enforced — Steps 1→2→3→4→5 |
| Output | Inspection views (read-only) | PASS/FAIL verdicts per step |
| Interaction | Select, expand, navigate | Observe, acknowledge failures |
| Exit | Switch persona freely | Complete sequence or abort |

### Return to OPERATOR

When INVESTIGATION completes (all 5 steps), the verification result is carried back to OPERATOR as a verification overlay:

- **VERIFIED**: Consequence displays a verification badge
- **PARTIALLY_VERIFIED**: Consequence displays a coverage gap indicator
- **VERIFICATION_FAILED**: Consequence displays a failure indicator with step reference

This is the first persona transition that produces a **persistent artifact** — the verification result survives the return to OPERATOR.

### Scope: Single Consequence vs Full Compilation

INVESTIGATION supports two scopes:

1. **Targeted verification**: Verify a single consequence (all 5 steps, but scoped to one consequence's chain)
2. **Full verification**: Verify the entire compilation result (all consequences, all combinations)

The operator chooses scope at entry. Full verification runs all targeted verifications plus Step 5 (compilation integrity).

---

## 8. What INVESTIGATION Is NOT

1. **NOT another inspection view.** OPERATOR already does inspection. INVESTIGATION adds VERIFICATION.
2. **NOT a debugging tool.** It does not help fix problems. It PROVES whether problems exist.
3. **NOT freeform.** The operator does not navigate. The system presents steps in order.
4. **NOT interpretive.** Verification is structural. PASS/FAIL, not "probably" or "might be."
5. **NOT a report.** It is a verification protocol with discrete steps and binary verdicts.
6. **NOT optional for qualification.** SQO advancement requires VERIFIED or documented PARTIALLY_VERIFIED exceptions.

---

## 9. Implementation Inputs (for future stream)

When the implementation stream is authorized, it will need:

### New Module: `InvestigationVerifier.js`
- Pure function module (like ConsequenceCompiler)
- Consumes: `consequenceResult`, `synthesisResult`, `report`
- Produces: `InvestigationResult` (verdicts per step, failures, overall verdict)
- No UI dependency, no side effects

### Compiler Export Needed: `forInvestigation()`
- New persona projection (distinct from `forOperator`)
- Projects verification-oriented data (derivation traces foregrounded, evidence refs expanded)
- Not created in Program 1 because INVESTIGATION didn't exist yet

### UI (future, not designed here):
- System-enforced step sequence renderer
- PASS/FAIL verdict display per step
- Failure detail expansion
- Verification result badge (carried back to OPERATOR)

### Governance Guard Extension:
- `INVESTIGATION_ENTRY` — new forbidden interaction type (Phase 2: not yet active)
- Entry gated on OPERATOR mode prerequisite

---

## 10. Verification Model Summary

```
INVESTIGATION = f(consequenceResult, synthesisResult, report)

Step 1: EVIDENCE ANCHOR     — Do references resolve?
Step 2: DERIVATION REPLAY   — Does the trace reproduce?
Step 3: RULE VERIFICATION    — Do mappings follow §4?
Step 4: COMBINATION CHECK    — Do patterns follow §5.2?
Step 5: COMPILATION INTEGRITY — Is the result self-consistent?

Verdict: VERIFIED | PARTIALLY_VERIFIED | VERIFICATION_FAILED | CANNOT_INVESTIGATE

Each failure: { step, check, failure_type, severity, detail }
```

This is a deterministic, evidence-bound, structurally complete verification protocol. Every step traces to existing compiler structures. No new data sources. No AI. No interpretation. Pure structural verification.
