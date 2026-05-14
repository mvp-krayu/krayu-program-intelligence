# Execution Contract — Second-Client Kill Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: DRAFT — not yet activated  
Baseline: pios-baseline-v1.0-blueedge-authoritative

---

## Objective

Execute the full PiOS → GAUGE → LENS → sellable projection pipeline for a second client
environment. Prove that the system is client-agnostic, reproducible from baseline, and
produces a governed, sellable LENS artifact without reliance on any BlueEdge artifact,
path, hardcoded reference, label, or semantic assumption.

PiOS S0–S4 execution is necessary but not sufficient. The run must also demonstrate GAUGE
portability, LENS projection portability, and must document RBAC/audit attachment points.

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

### PHASE — GAUGE Portability

Executed as part of S4. Confirms GAUGE state is fully client-derived.

- Generate second-client GAUGE state from S2/S3 outputs
- Confirm GAUGE score is derived exclusively from second-client artifacts
- Confirm no BlueEdge signal registry, domain list, or scoring calibration carried forward
- Confirm GAUGE step sequence (STEP 1–12) runs to completion on new evidence
- Record actual GAUGE output: score, decision state, confidence band

---

### PHASE — LENS Projection Portability

Executed after S4 report generation. Validates the produced LENS artifact is sellable.

- Generate second-client LENS executive report
- Verify no BlueEdge wording, client names, labels, paths, or screenshots present in output
- Verify no BlueEdge-specific report structure is required by the generator
- Verify no hardcoded BlueEdge paths in `lens_report_generator.py` or equivalent
- Verify no BlueEdge semantic labels exposed in client-facing sections
- Confirm the output is executive-readable and could be presented to the second client
- Confirm the output can support future onboarding UI rendering
- Reference: `lens_projection_portability_plan.md`

---

### PHASE — Security/Audit Attachment Points

Executed as documentation task during and after the run. No implementation required.

- Identify where RBAC applies across the pipeline:
  - Onboarding and ledger creation
  - Client/runtime isolation boundaries
  - Evidence access and upload
  - GAUGE access and state read
  - LENS projection access and generation
  - Report view, export, and publish actions
- Identify where audit events must be emitted (minimum event list per `security_audit_architecture_plan.md`)
- Document attachment points found — do not implement
- Reference: `security_audit_architecture_plan.md`

**The run cannot PASS unless:**
1. LENS projection portability is proven (no BlueEdge content in output)
2. RBAC/audit attachment points are documented

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
6. `lens_projection_portability_plan.md` has been reviewed
7. `security_audit_architecture_plan.md` has been reviewed

---

## Amendment Log

| Date | Change | Authority |
|---|---|---|
| 2026-04-24 | Initial draft created | PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01 |
| 2026-04-24 | Final pre-execution governance update: scope expanded to PiOS → GAUGE → LENS → sellable projection; GAUGE Portability, LENS Projection Portability, and Security/Audit Attachment Points phases added; pass condition updated | PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01 |
