# Reference Boundary Contract
## Status: LOCKED

---

## 1. Purpose

This document defines the **authoritative architectural boundaries** of the Program Intelligence system.

It governs **what belongs where**, across:

- Ledger / Ingestion
- PiOS Core (40.x)
- Downstream Consumption (41.x / 42.x / WEB / CAT)

This contract is **non-interpretative** and overrides any informal reasoning, assumptions, or chat-derived explanations.

---

## 2. Boundary Model (Authoritative)

### L0 — External / Ledger / Raw Input

**Nature:**
- Unstructured, semi-structured, or loosely structured inputs
- May include Excel, documents, exports, APIs, logs, human input

**Characteristics:**
- Non-deterministic
- Incomplete
- Inconsistent formats
- No enforced schema

**Responsibility:**
- Capture reality as-is
- No transformation into signals
- No interpretation

---

### L1 — Ingestion / Normalization Layer

**Nature:**
- Transforms L0 inputs into structured, machine-readable form

**Characteristics:**
- Mapping
- Cleaning
- Structuring
- Schema alignment (if possible)

**Allowed:**
- Field normalization
- Format standardization
- Structural alignment

**Forbidden:**
- Signal computation
- Metric derivation
- Interpretation
- Assumptions beyond explicit data

---

### L2 — PiOS Core (40.x) — Deterministic Derivation Engine

**Nature:**
- Fully deterministic system
- Evidence-first computation layer

**Input Boundary:**
- ONLY structured artifacts from L1 (or canonical equivalents such as 40.4 telemetry)

**Characteristics:**
- Reproducible
- Traceable
- Evidence-backed
- No randomness

**Allowed:**
- Signal computation (40.5)
- Condition activation (40.6)
- Diagnosis (40.7)
- Intelligence synthesis (40.7)
- Delivery packaging (40.8)
- Feedback registration (40.9)
- Control directives (40.10)
- Loop validation (40.11)

**Forbidden:**
- Guessing missing data
- Filling gaps with assumptions
- Using external context not present in inputs
- Modifying input evidence
- Introducing new signals outside contract

**Rule:**
> No evidence → no output

---

### L3 — Semantic / Narrative / Delivery Layers (41.x / 42.x)

**Nature:**
- Transformation of deterministic outputs into human-consumable formats

**Characteristics:**
- Narrative rendering
- Semantic elevation
- Query systems
- UI / demo layers (ExecLens)

**Allowed:**
- Reformatting
- Aggregation
- Narrative structuring
- Visualization

**Forbidden:**
- Creating new signals
- Altering computed values
- Recomputing logic outside Core
- Introducing non-traceable insights

---

### L4 — Category / Web / External Surfaces (CAT / WEB)

**Nature:**
- External publication layer
- SEO, narrative authority, category positioning

**Characteristics:**
- Simplification
- Abstraction
- Storytelling

**Allowed:**
- Narrative framing
- Educational structuring
- Category positioning

**Forbidden:**
- Claiming capabilities not backed by Core
- Introducing unverified metrics
- Diverging from canonical definitions (CKR)

---

## 3. Core Principles

### 3.1 Evidence First

All outputs must be:
- Traceable to source artifacts
- Backed by explicit data
- Verifiable

---

### 3.2 Determinism

Given the same input:
- The system must produce identical output
- No randomness
- No variability (except explicitly excluded fields like timestamps)

---

### 3.3 No Layer Leakage

- L0/L1 cannot perform Core logic
- L3/L4 cannot alter Core outputs
- Core cannot assume missing upstream data

---

### 3.4 Strict Ownership

Each layer owns:

| Layer | Ownership |
|------|----------|
| L0 | Reality capture |
| L1 | Structure |
| L2 | Truth derivation |
| L3 | Meaning |
| L4 | Communication |

No layer may take ownership of another.

---

### 3.5 No Assumptions

- Missing data remains missing
- Partial states must be explicit
- No inferred values without evidence

---

## 4. Enforcement Rules

### 4.1 Mandatory Compliance

All streams, scripts, and executions MUST:

- Respect layer boundaries
- Use only allowed inputs
- Produce only allowed outputs

---

### 4.2 Violation Handling

If a violation is detected:

- STOP execution immediately
- Declare boundary violation
- Do not attempt silent correction

---

### 4.3 Contract Supremacy

This document overrides:

- Chat instructions
- Informal reasoning
- Assumptions by execution agents

---

## 5. Integration with Execution

This contract must be:

- Loaded before any execution (via CLAUDE.md)
- Referenced in all execution contracts
- Used as validation gate in all streams

---

## 6. Amendment Rule

This document is LOCKED.

Any modification requires:

- Explicit amendment document
- Versioned change
- Justification of impact

Example:

```
docs/governance/runtime/reference_boundary_contract.amendment-01.md
```

No direct edits allowed.

---

## 7. Final Statement

This contract defines the **non-negotiable structural truth** of the Program Intelligence system.

All execution must conform.

No exceptions.
