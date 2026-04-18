---
type: evidence-lineage
brain: canonical
---

# Evidence Lineage

## Purpose

Traces the evidence chain from raw source intake to runtime surface.

Evidence is immutable once produced. Downstream layers consume. They do not mutate upstream.

---

## Chain

```
RAW SOURCE (L0)
  CREATE: external evidence bundle
  ↓
INTAKE (L1 — PRODUCTIZE.RAW.SOURCE.INTAKE.01)
  CREATE: evidence boundary artifact, source provenance record
  ↓
IG FORMATION (L1 — PRODUCTIZE.IG.FROM.INTAKE.01)
  CREATE: Intelligence Graph (IG) — typed, structured, relationship-bearing
  ↓
40.2 SCAN (L1 — PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01)
  CREATE: classified evidence set — domains, signals, type assignments
  ↓
40.3 NORMALIZE (L1 — PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01)
  CREATE: normalized evidence set — structural validation applied, conflicts resolved
  ↓
40.4 HANDOFF (L1 — PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01)
  CREATE: validated handoff artifact — canonical input boundary for PiOS Core
  ↓
PIOS CORE (L2–L4)
  DERIVE: signals, conditions, ESI/RAG, semantic payloads
  [not in scope of this brain slice]
  ↓
RUNTIME SURFACE (L6 — PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01)
  CONSUME: prepared ZONE-2 payloads
  CREATE: GAUGE execution surface
  ↓
LENS SURFACE (L6 — PRODUCTIZE.LENS)
  CONSUME: ZONE-2 projections
  CREATE: executive intelligence view, HTML report artifact
```

---

## Lineage Rules

- Evidence at each node is CREATE_ONLY from that layer's perspective
- Upstream evidence must not be modified by downstream layers
- Replay from 40.4 is debug mode only — not proof of full reconstructability
- Full lineage requires full path from raw source through Ledger Selector

---

## Governed by

- [[04_INVARIANTS]] — INV-01, INV-05, INV-09
- [[streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]] — handoff boundary
