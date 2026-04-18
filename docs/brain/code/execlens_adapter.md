---
type: code-node
brain: code
path: app/execlens-demo/
---

# execlens_adapter

## Purpose

Adapter layer between prepared L5 payloads and the LENS runtime surface. Transforms activation-layer outputs into data structures consumable by the Next.js runtime. Enforces ZONE-2 projection boundary at the adapter layer.

---

## Key Responsibilities

- Payload transformation from activation format to runtime schema
- ZONE-2 projection enforcement at adapter boundary — strips internal identifiers before runtime consumption
- Claim resolution and confidence band preparation
- Domain summary aggregation for LENS display surface

---

## Streams That Modified This Node

| Stream | Change |
|---|---|
| PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01 | Initial adapter establishment |

---

## Related Canonical Nodes

governed_by: [[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]

---

## Invariants Impacting This Node

- [[../canonical/04_INVARIANTS]] — INV-08 (ZONE-2 — strips SIG-, DOMAIN-, CAP-, COMP- at adapter boundary)
- [[../canonical/04_INVARIANTS]] — INV-05 (consume only; no upstream mutation)

---

## Dependent Outputs

- Transformed payload consumed by [[runtime_surface]]
