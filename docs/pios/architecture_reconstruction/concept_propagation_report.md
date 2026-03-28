# Concept Propagation Report

Stream: A.1 — PiOS L1-L6 Architecture Reconstruction
Date: 2026-03-28
Total concepts: 18
Total propagation edges: 17

---

## Evidence First — Complete Propagation Chain

Status: STABLE — HIGH confidence
Propagation: Governance → Framework → Runtime → Binding → Projection → Consumer

Evidence First travels through every layer. It is not a local rule — it is the governing doctrine.
Key instantiations:
- Governance: governance_master_capsule.md GC-06
- Runtime: pios_execution_contract.md "Non-Negotiable Rule"
- Binding: 43.1 Section 8 "fail-closed on evidence"
- Projection: 44.1 Section 8 evidence continuity requirements
- Consumer: 42.x "no compensation behavior" prohibition

---

## Signals — Cross-Layer Propagation

Status: STABLE — HIGH confidence
8 signals defined in run_01_blueedge (40.5). 5 admitted to 41.4 signal registry.

Propagation:
```
40.5 computation → SIG-001..008
41.4 registry → SIG-001..005 (5 admitted)
43.1 binding → only CKR-admitted signals (SIG-001..005)
43.3 validated payload → 5 projection records
44.2 attachment → 5 records with emphasis attributes
42.21 intake → 5 records processed
42.22 exposure → 5 records validated for rendering
ExecLens surface → 4 signals displayed (SIG-002..005 as gauge metrics)
```

Note: SIG-001 blocked in runtime context (no live Prometheus scrape).

---

## Reconstruction — Propagates Through Semantic Layer

Status: STABLE — HIGH confidence

40.3 reconstruction outputs (89 components, PEG) feed 41.1 semantic elevation:
- 89 components → 17 domains (5.24:1 ratio)
- 89 components → 42 capabilities (2.12:1 ratio)
- Result is evidence-grounded, conflict-resolved, fully traceable

Semantic layer does not re-access 40.3 beyond its outputs — lineage is through output artifacts only.

---

## Binding + Projection — Refinement Chain

Status: STABLE — HIGH confidence
43.1 → 43.2 → 43.3 → 44.1 → 44.2 → 44.3 → 44.4

Each successor refines or validates the predecessor:
- 43.1: binding rules
- 43.2: payload shape that binding must produce
- 43.3: validation gate that payload must pass
- 44.1: projection from validated payload to structural overlay
- 44.2: tighter attachment contract for projection
- 44.3: emphasis attribute added to projection output
- 44.4: projection layer closure

---

## Demo Surface Concept — Sharp Boundary

Status: STABLE — HIGH confidence

The Demo Surface concept propagates from 40.11 handover to all 51.x streams.
Key assertion: Demo Surface is a consumer, not an architecture layer.
Propagated as explicit boundary in handover capsule and confirmed in DEMO_CONTEXT.md.

---

## L-Number Concept — Limited Propagation

Status: AMBIGUOUS — LOW confidence

L-Number model is referenced in 43.1, 44.1, 44.2, 43.2, 43.3 via "canonical L0-L8 model."
L3 and L4 labels propagate explicitly with HIGH confidence.
L5 and L6 labels propagate as negative assertions (X does not hold L5/L6 authority) — MEDIUM confidence.
L0-L2, L7-L8 do not propagate (no anchors).

Defining source (Stream 00.2) absent — propagation cannot be traced to origin.

---

## Concept Status Summary

| Concept | Status | Propagation Confidence |
|---|---|---|
| Evidence First | STABLE | HIGH — full chain documented |
| Signals | STABLE | HIGH — 5 admitted signals traced end-to-end |
| Reconstruction | STABLE | HIGH — PEG through semantic layer |
| Binding | STABLE | HIGH — 43.1 through 43.3 refinement chain |
| Projection | STABLE | HIGH — 44.1 through 44.4 refinement chain |
| Demo Surface | STABLE | HIGH — sharp exclusion boundary |
| Semantic Elevation | STABLE | HIGH — 89→17/42 transformation confirmed |
| L-Number Model | AMBIGUOUS | LOW — partial fragments only |
