---
type: canonical-reconciliation
brain: canonical
stream: BRAIN.RECONCILE.LENS.TIER2.01
status: RECONCILED
alignment_date: 2026-04-23
supersedes: nothing — reconciles two complementary definitions
---

# tier2_reconciliation — Authoritative Tier-2 Definition

## Purpose

This node resolves the structural ambiguity identified in BRAIN.QUERY.LENS.TIER2.DEFINITION.01:
two canonical nodes defined Tier-2 at different abstraction levels without declaring their
relationship. This node declares that relationship and establishes the unified canonical
statement of Tier-2.

---

## The Two Nodes

| Node | Abstraction level | Status |
|---|---|---|
| `streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01.md` | Capability concept — WHAT Tier-2 exposes | ACTIVE — retained |
| `tier2_workspace_model.md` | Structural model — HOW Tier-2 is structured | ACTIVE — retained |

Neither node is superseded. They are canonical at different levels.

---

## Declared Relationship

```
PRODUCTIZE.DIAGNOSTIC.ACCESS.01
  │
  │  defines: capability concept
  │  — what is exposed (evidence gap layer)
  │  — output schema (INVESTIGATION_TARGET)
  │  — evidence boundary
  │
  ▼
tier2_workspace_model.md
  │
  │  defines: structural implementation model
  │  — how the capability is structured (zone-based workspace)
  │  — interaction modes (WHY / EVIDENCE / TRACE)
  │  — canonical data inputs (topology + signal_registry + gauge_state)
  │
  ▼
tier2_runtime_mvp_surface.md
  │
  │  defines: MVP canonical support
  │  — which canonical artifacts are sufficient for Phase 1
  │  — derivation rules for zones and evidence state
  │
  ▼
diagnostic_zone_construct.md
     defines: zone taxonomy
     — zone_type vocabulary
     — derivation rules at zone level
```

---

## Authoritative Tier-2 Model

**Tier-2 is a zone-based diagnostic workspace that implements the Diagnostic Access
capability concept.**

The zone-based workspace is the product/runtime realization of PRODUCTIZE.DIAGNOSTIC.ACCESS.01.
It exposes the evidence gap layer through zone classification and structured interaction modes
rather than through a direct INVESTIGATION_TARGET schema render.

The two are canonically consistent. The input difference is resolvable:

| PRODUCTIZE.DIAGNOSTIC.ACCESS.01 input | Equivalent in zone-based workspace |
|---|---|
| `evidence_mapping_index.json` (blocking_point) | Derived: signal_registry.json gaps + zone evidence_basis.missing |
| `diagnosis_output_set.md` (dimension labels) | Derived: zone zone_type + domain_name + WHY classification rationale |
| `signal_registry.json` (risk field) | Direct: signal_registry.json |

The zone-based workspace derives the investigation target content from signal_registry + topology
rather than from a separate evidence_mapping_index artifact. The derivation is equivalent for
the current evidence set.

---

## Output Schema Mapping

PRODUCTIZE.DIAGNOSTIC.ACCESS.01 defined the INVESTIGATION_TARGET schema.
The zone-based workspace produces this content through its interaction modes:

| INVESTIGATION_TARGET field | Zone workspace equivalent | Mode |
|---|---|---|
| `dimension_name` | zone domain_name | WHY response: factor → domain |
| `investigative_question` | WHY response: classification_rationale | WHY |
| `scope_gap` | EVIDENCE response: evidence_basis.missing | EVIDENCE |
| `system_area` | WHY response: structural_scope.capability_ids | WHY |
| `consequence_class` | **DEFERRED** — risk field in signal_registry exists; no product surface yet | — |
| `resolution_path` | EVIDENCE response: evidence_basis.missing[].item | EVIDENCE |

`consequence_class` is the only INVESTIGATION_TARGET field not currently surfaced in the
implemented workspace. It is explicitly deferred.

---

## Phase Relationship

**Phase 1 (current — implemented):**
Zone-based diagnostic workspace. WHY and EVIDENCE modes operational. Diagnostic Narrative
HTML export. Zone scope limited to focus domain + WEAKLY GROUNDED domains.

**Phase 2 (deferred):**
TRACE mode full traversal engine. Consequence class surface. Direct INVESTIGATION_TARGET
schema render from evidence_mapping_index. Entitlement gating at workspace access level.

Phase 2 does not invalidate Phase 1. Phase 1 is a fully governed, evidence-bounded Tier-2
surface. Phase 2 extends it.

---

## Invariants Not Changed by This Reconciliation

- `inference_prohibition: ACTIVE` on all outputs — unchanged
- No advisory content in any mode — unchanged
- ZONE-2 purity (INV-08) — unchanged
- All output bounded to canonical data — unchanged
- Evidence first (INV-01) — unchanged

---

## Lineage

| Stream | Date | Change |
|---|---|---|
| BRAIN.RECONCILE.LENS.TIER2.01 | 2026-04-23 | Created — reconciles PRODUCTIZE.DIAGNOSTIC.ACCESS.01 and tier2_workspace_model.md |
