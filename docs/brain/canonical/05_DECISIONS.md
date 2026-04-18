---
type: decisions
brain: canonical
---

# Decisions

## Purpose

Architectural decisions with rationale. Each decision is locked unless explicitly superseded by a governance amendment of equal authority.

---

## DEC-01 — Four-Layer Separation

Decision: System uses fixed L1/L2-L4/L5/L6-L7/L8 layer model with fixed branch ownership.

Rationale: Prevents drift between ingestion truth, core derivation, activation binding, and runtime rendering. Cross-layer contamination was identified as the primary source of structural corruption.

Status: LOCKED
Governed by: git_structure_contract.md

---

## DEC-02 — Evidence-First Output Model

Decision: No stream may produce output without traceable input evidence.

Rationale: Prevents synthesis of claims that cannot be defended under audit. All downstream value must trace to ingested, validated evidence.

Status: LOCKED
Governed by: [[04_INVARIANTS]] — INV-01

---

## DEC-03 — ZONE-2 Projection Layer for Client Surface

Decision: Client-facing runtime (LENS) consumes ZONE-2 projections only. ZONE-2 strips internal identifiers and presents governance-safe language.

Rationale: Internal identifiers (SIG-, DOMAIN-, CAP-, COMP-) carry structural meaning not appropriate for client projection. Client surface must be clean and defensible without internal ontology exposure.

Status: LOCKED
Governed by: [[04_INVARIANTS]] — INV-08

---

## DEC-04 — 40.4 as Ingestion Boundary

Decision: PiOS Core does not begin execution until a validated 40.4 handoff artifact exists. 40.4 is the canonical boundary between ingestion and core.

Rationale: Without a fixed, validated boundary, core derivation cannot be proven to be based on verified evidence. Ad-hoc core execution leads to un-auditable outputs.

Status: LOCKED
Governed by: [[04_INVARIANTS]] — INV-03

---

## DEC-05 — Commercial Gating is UI-Only (v1)

Decision: LENS access gating (useAccessGate, AccessGateModal) is a UI-layer mechanism. No backend validation. Access state stored in localStorage key `lens_access_granted`.

Rationale: Commercial gating at this stage is a positioning and conversion mechanism, not a security boundary. Backend validation introduces infrastructure complexity not justified at this stage.

Status: ACTIVE
Downstream: [[../product/lens_product]]
Governed by: [[streams/PRODUCTIZE.LENS]]

---

## DEC-06 — Report Delivery via Validated API Route

Decision: LENS executive report is served via /api/report-file with strict filename validation (`/^lens_report_\d{8}_\d{6}\.html$/`). Filesystem path is never returned to client.

Rationale: Prior implementation returned raw filesystem path, causing browser open/download failure and exposing filesystem structure. API route validates filename pattern to prevent path traversal while enabling browser access.

Status: LOCKED
Downstream: [[../product/lens_report]]
Governed by: [[streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]
