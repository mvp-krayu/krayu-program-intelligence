# Brain Emission Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: PLANNING — no execution performed

---

## Purpose

Define the outputs expected from each brain domain following second-client execution.
These are not pre-defined conclusions — they are the structural categories that must
be populated from evidence after the run completes.

---

## CANONICAL BRAIN

### Confirmed Invariants

Structural facts that the second-client run must confirm hold across clients:

- Score derivation formula produces a valid 0–100 result from any conforming evidence boundary
- Domain classification logic is client-agnostic — no BlueEdge-specific assumptions
- GAUGE S0–S4 execution path is reproducible from raw evidence
- CEU computation is deterministic given the same evidence input
- 40.4 handoff validation logic is client-agnostic
- Evidence chain is traceable from output back to raw source for any client

### Broken Invariants

Any assumption previously held as universal that the second-client run reveals as BlueEdge-specific:

- To be determined post-run
- Categories to watch: hardcoded domain thresholds, hardcoded CEU ranges, path assumptions in scripts
- If found: record explicitly, do not patch silently — emit to CODE brain and escalate

### New Structural Definitions

Structural facts that emerge from the second-client run that were not derivable from a single client:

- Cross-client score distribution characteristics (if observable)
- Evidence volume thresholds at which domain count stabilizes
- Signal coverage variance patterns across different organizational types
- Any new canonical topology shape not present in BlueEdge

---

## CODE BRAIN

### Commands Used

To be populated post-execution. Record:

- Full command sequence for S0–S4
- Parameters passed at each stage
- Any flags or overrides applied
- Environment setup commands

### Scripts Touched

To be populated post-execution. Record:

| Script | Purpose | Modified? | Change summary |
|---|---|---|---|
| (populate after run) | | | |

Constraint: no script may be modified to hardcode second-client values. Parameterization only.

### Environment Assumptions

To be validated before execution and recorded:

- Python version required
- Required environment variables
- Required directory structure under `clients/<client-id>/`
- Required input file formats for S0/S1

### Failure Modes

Known failure modes from BlueEdge execution to watch for:

- Insufficient evidence volume → domain count below derivable threshold
- Evidence format mismatch → ingestion failure at 40.2
- Missing coherence record → S2 gate failure
- Hardcoded client paths → isolation violation
- Score outside 0–100 range → canonical derivation failure

All failures must be recorded in the run's execution log, not silently handled.

---

## PRODUCT BRAIN

### Onboarding Implications

Questions the second-client run must answer for the product:

- What is the minimum evidence volume required to produce a governed assessment?
- What is the minimum intake session length to reach a valid 40.4 handoff?
- What client preparation is required vs. what can be derived from existing documents?
- What is the actual time-to-first-output on a clean environment?

### Client Package Requirements

From the second-client run, define what a repeatable client package requires:

- Intake document types (confirmed minimum set)
- Pre-engagement checklist (what client must provide vs. what we derive)
- Scope containment rules (what triggers a scope increase)
- Delivery format requirements (report, review session, export)

### Time-to-First-Output Evidence

Record actual elapsed time for each stage:

| Stage | Start | End | Duration | Notes |
|---|---|---|---|---|
| S0 — Evidence boundary | | | | |
| S1 — Ingestion | | | | |
| S2 — Core derivation | | | | |
| S3 — Activation | | | | |
| S4 — Report generation | | | | |
| **Total** | | | | |

This populates the product claim: "time-bounded engagement." Evidence required before any
timing claim appears in product materials.

---

## PUBLISH BRAIN

### Safe External Claims

Claims that become supportable after second-client run completes successfully:

| Claim | Condition for activation |
|---|---|
| "The system is client-agnostic" | Zero BlueEdge dependencies confirmed in second-client run |
| "Repeatable across environments" | Second-client run produces governed output from clean evidence |
| "No instrumentation required" | Second-client run completes without system access beyond documents |
| "Time-bounded engagement" | Actual timing evidence recorded for all stages |

No claim may appear in publish surfaces before its condition is met.

### Case-Study Candidates

After second-client run:

- If client grants reference rights: document engagement pattern, trigger condition, decision state produced
- If client is anonymous: publish structural engagement pattern without identifiers
- Case study must be derived from governed output only — no narrative embellishment

### Prohibited Claims

The following must never appear in publish surfaces regardless of second-client outcome:

- Client name, industry, or identifying details without explicit written consent
- Comparative claims against BlueEdge ("our second client also showed...")
- Claims about scale or volume that aren't supported by the specific run evidence
- Any claim implying the second-client evidence is representative of a general population
- Score values or domain counts from either client run
- Any advisory claim about what the client "should do" — output is structural intelligence only
