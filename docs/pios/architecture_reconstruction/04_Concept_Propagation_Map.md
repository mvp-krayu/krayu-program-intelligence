---
title: Concept Propagation Map
type: concept-map
status: RECONSTRUCTED
confidence: HIGH
date: 2026-03-28
---

# Concept Propagation Map

## Evidence First

Status: STABLE
First occurrence: governance_master_capsule.md (GC-06)

```
GOV-00 (krayu-knowledge)
  → governance_master_capsule.md [GC-06: Evidence-First Principle]
       → pios_execution_contract.md [Non-Negotiable Rule]
            → 40.2-40.9 boundary_enforcement.md artifacts [enforced at each stage]
                 → 43.1 binding layer [fail-closed on evidence]
                      → 43.3 validation envelope [AMB-001 = invalid, no binding]
                           → 44.1 projection [no substitute overlays when evidence absent]
                                → 42.x consumer [no compensation behavior]
```

Rule propagation: complete chain from governance to runtime consumer.

---

## PiOS

Status: STABLE
First occurrence: docs/program-intelligence-framework/pios/pios_runtime_architecture.md

Propagates through: all 40.x stream contracts, 41.x, 42.x-44.x references.
Core definition: deterministic, evidence-first, governed runtime execution system.

---

## Signals

Status: STABLE
First occurrence: docs/pios/40.5/signal_output_set.md (8 signals: SIG-001..008)
Canonical registry: docs/pios/41.4/signal_registry.json (5 signals post-semantic shaping)

Propagation chain:
```
40.5 Signal Computation → SIG-001..008 outputs
  → 41.4/signal_registry.json (5 admitted signals: SIG-001..SIG-005)
       → 41.5/query_signal_map.json (10 queries bound to signals)
            → 43.1 binding inputs (CKR-admitted only)
                 → 43.3 validated payload (5 projection records)
                      → 44.2/projection_attachment.json
                           → 42.21 runtime intake → 42.22 exposure
                                → ExecLens surface (4 gauge signals: SIG-002..005)
```

Note: SIG-006..008 from 40.5 are not in 41.4 signal_registry.json (run scope difference)

---

## Reconstruction

Status: STABLE
First occurrence: docs/pios/40.3/reconstruction/

Propagation:
```
40.2 evidence snapshot
  → 40.3 reconstruction (PEG, repository map, capability map, dependency topology)
       → 40.4 telemetry inputs
            → [40.3 is not directly accessed from 40.5+] [enforced boundary]
                 → 41.1 semantic elevation (89 components → 17 domains + 42 capabilities)
                      → 41.2 PIE vault (navigation surface)
```

---

## Semantic Elevation

Status: STABLE
First occurrence: docs/pios/41.1/semantic_elevation_report.md

Core transformation: 89 components → 17 domains + 42 capabilities
Ratio: 5.24:1 (component:domain), 2.12:1 (component:capability)
Grounding: 95.5% strongly grounded; 4.5% weakly grounded (explicitly marked)
Conflicts resolved: 1 (SC-01 OtaModule domain membership)

Propagates to: 41.2 PIE vault, 41.4 registry anchors, 42.x topology rendering

---

## Binding

Status: STABLE
First occurrence: docs/pios/43.1/signal_to_structure_binding.md

Key rules:
- Signal must be CKR-admitted (no provisional constructs)
- Node must be from external governed topology
- Association must be evidence-driven
- Association does not infer meaning
- SSZ/SSI explicitly prohibited

Propagates: 43.1 → 43.2 (payload schema) → 43.3 (validation gate) → 43.31-43.33 (execution)

---

## Projection

Status: STABLE
First occurrence: docs/pios/44.1/structural_overlay_projection_definition.md

Key rules:
- Receives only 43.3 validated payload
- Passive with respect to topology and signals
- No aggregation, no semantic overlay states
- No UI-specific fields
- SSZ/SSI prohibited

Propagates: 44.1 → 44.2 (attachment contract) → 44.3 (emphasis attribute) → 44.4 (closure)

---

## Demo Surface

Status: STABLE
First occurrence: docs/pios/40.11/stream_50_handover_capsule.md

Critical boundary: Demo Surface (51.x) ≠ Architecture Layer
Rule: Stream 50/51.x is authorized to USE 40.x outputs as read-only.
Rule: Stream 50/51.x must NOT recompute, reinterpret, or redefine signals, conditions, or diagnosis.
Evidence: 40.11/stream_50_handover_capsule.md Constraints section.

---

## Concept Status Summary

| Concept | Status | Confidence |
|---|---|---|
| PiOS | STABLE | HIGH |
| Evidence First | STABLE | HIGH |
| PiOS Core Engine | STABLE | HIGH |
| Reconstruction | STABLE | HIGH |
| Telemetry | STABLE | HIGH |
| Signals | STABLE | HIGH |
| Conditions | STABLE | HIGH |
| Diagnosis | STABLE | HIGH |
| Intelligence | STABLE | HIGH |
| Semantic Elevation | STABLE | HIGH |
| Binding | STABLE | HIGH |
| Projection | STABLE | HIGH |
| Delivery (40.8) | AMBIGUOUS | MEDIUM |
| Demo Surface | STABLE | HIGH |
| Runtime Consumption | STABLE | HIGH |
| PEG | STABLE | HIGH |
| L-Number Layer Model | AMBIGUOUS | LOW |
| WOW Chain | EVOLVING | MEDIUM |
