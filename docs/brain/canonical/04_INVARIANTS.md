---
type: invariants
brain: canonical
---

# Invariants

## Purpose

Non-negotiable system-level constraints. Invariants are not adjustable by stream contracts. A stream may not override an invariant without an explicit governance amendment of equal authority.

---

## INV-01 — Evidence First

No output may be produced without traceable, anchored evidence.

Violated by: generating claims without evidence chain.
Impact: output is INVALID.

---

## INV-02 — Layer Ownership is Fixed

Layer ownership is determined by git_structure_contract, not by branch convenience.

L1–L4: feature/pios-core
L5: feature/activation
L6–L7: feature/runtime-demo
L8: feature/governance

Violated by: committing derivation on a non-Core branch.
Impact: CONTRACT BREACH.

---

## INV-03 — 40.4 Handoff Is the Only Valid Ingestion Boundary

PiOS Core may only begin after a validated 40.4 handoff artifact exists.

Violated by: Core execution against un-validated evidence.
Impact: INVALID execution, traceability broken.

---

## INV-04 — Replay from 40.4 is Not Full Reconstructability

Replaying from 40.4 is a debug/isolation mode only.

Full reconstructability requires: raw source → Ledger Selector → 40.2 → 40.3 → 40.4.

Violated by: representing 40.4 replay as proof of system reconstructability.
Impact: false confidence, audit failure.

---

## INV-05 — No Cross-Layer Mutation

Downstream layers consume upstream outputs. They do not mutate them.

Violated by: activation layer rewriting Core semantic truth; runtime layer compensating for missing Core computation.
Impact: structural drift, loss of canonical lineage.

---

## INV-06 — Determinism

Same inputs must produce same outputs. No hidden logic, no stochastic behavior in governed streams.

Violated by: non-deterministic generation, implicit context, inferred intent.
Impact: non-reproducible execution.

---

## INV-07 — Fail-Closed on Ambiguity

Ambiguous inputs stop execution. Execution does not proceed by assumption.

Violated by: inferring intent, proceeding without evidence.
Impact: NON-COMPLIANT EXECUTION.

---

## INV-08 — ZONE-2 Projection Purity

LENS and any client-facing surface must consume ZONE-2 projections only. No internal identifiers (SIG-, DOMAIN-, CAP-, COMP-) in rendered output.

Violated by: exposing internal IDs on the client surface.
Impact: governance contamination of published layer.

---

## INV-09 — CREATE_ONLY Lineage

Evidence produced by a stream is fixed. It is not subsequently edited by the same stream or downstream streams without formal amendment and lineage record.

Violated by: retroactive evidence mutation, in-place overwriting without lineage record.
Impact: lineage integrity broken.

---

## Related Streams

- [[streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]] — INV-03, INV-04
- [[streams/PRODUCTIZE.LENS]] — INV-08
- [[03_EVIDENCE_LINEAGE]] — INV-01, INV-09
