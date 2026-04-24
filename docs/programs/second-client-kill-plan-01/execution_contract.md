# Execution Contract — Second-Client Kill Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: DRAFT — not yet activated  
Baseline: pios-baseline-v1.0-blueedge-authoritative

---

## Objective

Execute the full S0–S4 PiOS pipeline for a second client environment. Prove that the system
is client-agnostic, reproducible from baseline, and produces governed output without reliance
on any BlueEdge artifact, path, or hardcoded reference.

---

## Execution Model

### S0 — Evidence Boundary

- Client evidence must be sourced independently
- Ledger Selector must produce a conforming evidence boundary
- No BlueEdge source documents may be used or referenced
- Evidence volume and domain coverage to be determined at intake

### S1 — Ingestion (40.2 → 40.4)

- Run against new client evidence only
- Validated 40.4 handoff required before S2 begins
- Intake record must be written to `clients/<client-id>/psee/runs/<run-id>/intake_record.json`
- No carry-forward from BlueEdge intake record

### S2 — PiOS Core (L2 → L4)

- Navigation, derivation, semantic shaping — all derived from new client evidence
- Canonical score produced independently
- Domain count, capability count, component count: client-specific — not constrained to match BlueEdge
- GAUGE execution proceeds to S4 only after S2 outputs are validated

### S3 — Activation (43.x / 44.x)

- Signal-to-structure binding on new client data
- No BlueEdge signal registry reused
- Structural overlay derived from new evidence

### S4 — Runtime / Report

- LENS report generated from new client derivation
- GAUGE score produced from new client evidence
- Decision state (PROCEED / INVESTIGATE / ESCALATE) produced from new canonical score

---

## Isolation Requirements

| Requirement | Rule |
|---|---|
| Client folder | `clients/<new-client-id>/` — new, isolated |
| Run folder | `clients/<new-client-id>/psee/runs/<run-id>/` — new |
| BlueEdge dependency | Zero — enforced at validation |
| Hardcoded paths | Forbidden — all paths parameterized |
| Hardcoded domain counts | Forbidden — derived from evidence only |

---

## Execution Authority

This contract is a planning artifact. Execution may not begin until:

1. Client evidence boundary is defined
2. Client ID is assigned
3. `execution_contract.md` is amended with client-specific parameters
4. Baseline comparison plan is reviewed
5. Validation matrix criteria are confirmed

---

## Amendment Log

| Date | Change | Authority |
|---|---|---|
| 2026-04-24 | Initial draft created | PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01 |
