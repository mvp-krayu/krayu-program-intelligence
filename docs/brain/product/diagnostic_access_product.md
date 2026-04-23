---
type: product-node
brain: product
---

# diagnostic_access_product

## What Is Being Offered

Diagnostic Access (Tier 2): a governed interrogation surface for the structural evidence state
of a LENS Assessment. Delivered as a Diagnostic Narrative export (static HTML) plus a
live query workspace for WHY and EVIDENCE interrogation of diagnostic zones. Produces
evidence-bounded diagnostic output — not analysis, not advisory guidance, not consulting output.

---

## Canonical Basis

[[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]]
[[../canonical/tier2_workspace_model]]
[[../canonical/tier2_reconciliation]]

---

## System Capability Mapping

| Tier 2 Component | Canonical Basis | Implementation State |
|---|---|---|
| Diagnostic zone identification | [[../canonical/tier2_workspace_model]] | **IMPLEMENTED** |
| WHY mode — zone classification rationale | [[../canonical/tier2_query_engine]] | **IMPLEMENTED** |
| EVIDENCE mode — trace links + missing evidence | [[../canonical/tier2_query_engine]] | **IMPLEMENTED** |
| Diagnostic Narrative export (HTML artifact) | [[../canonical/tier2_workspace_model]] | **IMPLEMENTED** |
| Structural evidence topology graph | [[../canonical/tier2_workspace_model]] | **IMPLEMENTED** |
| Vault node cross-reference | [[../canonical/client_vault_export_binding]] | **IMPLEMENTED** |
| TRACE mode — full traversal engine | [[../canonical/tier2_workspace_model]] | **DEFERRED** |
| Consequence class surface | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | **DEFERRED** |
| Direct INVESTIGATION_TARGET schema render | [[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]] | **DEFERRED** |
| Entitlement gating at workspace access level | [[../canonical/05_DECISIONS]] | **DEFERRED** |

---

## Allowed Outputs

### Currently implemented (Phase 1)

- Diagnostic zone inventory with zone_type, severity, confidence, traceability classifications
- WHY mode response: classification rationale derived from canonical topology + signal registry
- EVIDENCE mode response: available trace links, missing evidence inventory, signal coverage
- Structural evidence topology graph (positional — from workspace runtime positions)
- Diagnostic Narrative HTML export (static snapshot of workspace state)

### Deferred (Phase 2)

- Consequence class per dimension (governed risk statement — conditional framing required: "if degraded")
- Resolution path as direct output (currently surfaced only in EVIDENCE missing items)
- Full TRACE mode traversal with adjacency depth

---

## Forbidden Outputs

These apply to both Phase 1 and Phase 2:

- Internal identifiers of any class (SIG-*, DIAG-*, COND-*, COMP-*)
- Advisory prioritization ("prioritize X", "investigate X first")
- Decision guidance beyond defined states: proceed / investigate / escalate
- Claims of inference-free derivation for consequence class outputs
- Certainty claims about system degradation state
- Open-ended investigation direction
- Root cause claims
- Forward projections

---

## Implementation State

**PARTIALLY IMPLEMENTED**

Phase 1 (zone-based diagnostic workspace) is implemented. Phase 2 (direct INVESTIGATION_TARGET
schema surface, consequence class, TRACE traversal) is deferred.

Phase 1 delivers a fully governed, evidence-bounded Tier-2 surface. It is not a partial product
requiring Phase 2 to be valid — it is a complete Phase 1 product. Phase 2 extends the surface.

See `tier2_reconciliation.md` in brain/canonical for the Phase 1 / Phase 2 scope definition.

---

## Access Model

Current (Phase 1): Diagnostic Narrative delivered as HTML export — accessible via report URL.
Deferred (Phase 2): Entitlement gating at live workspace interaction level.

---

## What Is Measurable

- Diagnostic zone count (derived from canonical data — deterministic)
- WHY mode response: classification factors traceable to canonical fields
- EVIDENCE mode response: trace link count, missing item count per zone
- Export: HTML artifact generated from governed inputs only

---

## Justified by

[[../canonical/streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01]]
[[../canonical/tier2_workspace_model]]
[[../canonical/tier2_reconciliation]]

## Implemented by

[[../code/tier2_diagnostic_narrative]]
[[../code/scripts_pios_py]]

## Expressed as

[[../publish/lens_page]] — Tier 2 section

---

## Lineage

| Stream | Date | Change |
|---|---|---|
| PRODUCTIZE.LENS.COMMERCIAL.PACKAGE.05 | 2026-04-22 | Initial definition — PRODUCT-NOT-IMPLEMENTED |
| BRAIN.RECONCILE.LENS.TIER2.01 | 2026-04-23 | Updated to reflect Phase 1 implementation; PRODUCT-NOT-IMPLEMENTED replaced with PARTIALLY IMPLEMENTED; capability mapping updated; deferred scope explicitly declared |
