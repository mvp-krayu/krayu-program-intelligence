# tier2_workspace_model — Canonical Tier-2 Workspace Structure

**Authority:** brain/canonical  
**Stream:** TIER2.WORKSPACE.MODEL.01  
**Status:** DEFINITION  
**Depends on:** diagnostic_zone_construct.md, trace_graph_model.md, tier2_runtime_mvp_surface.md  
**Concept layer:** streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01.md  
**Reconciliation:** tier2_reconciliation.md

---

## Canonical Role

This document defines the structural implementation model of Tier-2 Diagnostic Access. It governs what a Tier-2 workspace is, what it can contain, and what invariants apply. The capability concept for which this is the structural model is defined in `streams/PRODUCTIZE.DIAGNOSTIC.ACCESS.01.md`. Product behavior is defined in brain/product. This is the structural ground truth.

---

## Workspace Identity

A Tier-2 Workspace is a bounded investigation surface anchored to a single LENS Assessment run. It is not a general-purpose analysis tool. Its scope is defined entirely by:

- The canonical topology of the assessed environment
- The signal registry bound to that run
- The gauge state derived from that evidence set

A workspace cannot be constructed without all three inputs. A workspace with incomplete inputs must declare its scope as BOUNDED or PARTIAL — it must not silently omit content.

---

## Zone Set Derivation (Canonical)

The zone set is deterministic given the canonical inputs.

**Derivation rules:**
1. Focus domain (designated per run) is always a zone candidate
2. All WEAKLY GROUNDED domains are zone candidates
3. A GROUNDED domain is not a zone candidate unless it is the focus domain
4. Zone_type is assigned deterministically from signal coverage and grounding:
   - Focus domain with signals → pressure_concentration
   - Any domain with no signals → evidence_gap
   - Signals with STRONG + WEAK evidence_confidence in same domain → signal_conflict
   - Otherwise → structural_inconsistency
5. Zone set is static for a given run — zones do not change unless canonical inputs change

**Zone ordering invariant:**
- Focus zone is always first
- Remaining zones sorted by severity: HIGH before MODERATE before LOW

---

## Structural Facts Per Zone

Each zone has the following canonical attributes — these are not configurable:

| Attribute | Source | Derivation |
|---|---|---|
| zone_id | generator | ZONE-{seq} assigned in derivation order |
| domain_id | canonical_topology.json | direct |
| domain_name | canonical_topology.json | direct |
| zone_type | signal_registry + topology | deterministic (see rules above) |
| severity | zone_type + focus status | HIGH if focus domain; MODERATE if evidence_gap; LOW otherwise |
| confidence | signal evidence_confidence | STRONG/PARTIAL/WEAK per signal set |
| traceability | signal trace_links | FULLY_TRACEABLE if all signals have links; PARTIALLY_TRACEABLE if some; NOT_TRACEABLE if none |
| capability_ids | topology domain.capability_ids | direct |
| domain_sigs | signal_registry by domain_id | direct |

---

## Evidence Bounds

The workspace cannot exceed the evidence boundary of its canonical inputs.

**Evidence scope states:**
- FULL: zero weakly grounded domains
- PARTIAL: 1–2 weakly grounded domains
- BOUNDED: 3+ weakly grounded domains

**Coverage status:**
- COMPLETE: zero weakly grounded domains
- INCOMPLETE: any weakly grounded domains present

**Invariant:** Evidence scope and coverage status are derived facts. They must not be manually overridden. Anything the workspace cannot derive from available evidence must be explicitly declared as NOT_DERIVABLE.

---

## Propagation Path Canonical Rules

Propagation paths in the workspace are derived from:
1. Signal domain associations (which domain a signal is bound to)
2. Capability containment (which capabilities belong to which domain)
3. Topology `edges` field (domain_capability, capability_component edge types)
4. Component-level cross-domain evidence (confirmed connections declared as PARTIAL)

**Evidence classification for paths:**
- STRONG: path chain is fully supported by artifact-backed signal evidence
- PARTIAL: path chain is component-confirmed but not topology-edge-confirmed
- INFERRED: no artifact evidence confirms the connection — must be explicitly declared

**Invariant:** A path classified as INFERRED must include a declaration statement. An INFERRED path cannot be used as evidence of propagation. It can only indicate a structural hypothesis.

---

## Inference Prohibition (Canonical)

`inference_prohibition: ACTIVE` is a canonical attribute of every Tier-2 output — not a configurable flag.

It means:
- The workspace does not produce inferences about root causes
- The workspace does not produce inferences about resolution paths
- The workspace does not produce forward projections
- The workspace does not produce advisory content of any kind
- All output is bounded to what the evidence set directly supports

This applies to all three interaction modes (WHY, TRACE, EVIDENCE) and all exports.

---

## Interaction Mode Constraints (Canonical)

### WHY
- Input: zone_id only
- Output: structural derivation rationale — which canonical facts triggered zone_type assignment
- Bounded to: canonical_topology.json + signal_registry.json data for the zone's domain
- Cannot claim: root cause, resolution path, causal attribution

### TRACE
- Input: zone_id + direction + depth (max 2)
- Output: propagation paths derivable from evidence for the zone's anchor domain
- Bounded to: zone scope (anchor domain + depth-2 adjacency only)
- Cannot claim: paths beyond depth 2, certainty for INFERRED paths

### EVIDENCE
- Input: zone_id + scope
- Output: available trace links, missing evidence items, signal coverage summary
- Bounded to: signal trace_links field for domain's signal set
- Cannot claim: evidence availability beyond what trace_links contains; resolution timelines

---

## Workspace / Export Relationship

The canonical workspace state is the primary artifact. Exports are derived projections.

**Diagnostic Narrative export:** static HTML snapshot of workspace state at generation time. Evidence-bounded. Interaction modes not active in export.

**Tier-1 exports:** independent artifacts — they do not expose workspace state. Tier-1 Evidence Brief is the canonical product surface for non-diagnostic access.

**Invariant:** No export may contain claims that exceed the canonical workspace state at generation time. An export that claims more than the workspace supports at that moment is invalid.

---

## Run Anchor Invariant

A workspace is anchored to exactly one run. Cross-run comparison is not within scope of Tier-2 workspace model. Zone derivation, evidence state, and propagation paths are all run-specific.

If canonical inputs change (topology, signals, gauge), the workspace must be regenerated. The workspace does not update incrementally.
