---
type: system-map
brain: canonical
---

# System Map

## Layer Model

| Layer | Name | Canonical Owner | Branch |
|---|---|---|---|
| L0 | External Evidence Source | Not owned by system | — |
| L1 | Ingestion | feature/pios-core | 40.2 → 40.4 |
| L2 | Evidence Navigation | feature/pios-core | 40.5+ |
| L3 | Derivation | feature/pios-core | 41.x |
| L4 | Semantic Shaping | feature/pios-core | 41.x |
| L5 | Presentation Assembly | feature/activation | 43.x, 44.x |
| L6 | Runtime Experience | feature/runtime-demo | 42.x |
| L7 | Demo / Narrative | feature/runtime-demo | 51.x |
| L8 | Governance / Validation | feature/governance | docs/governance |

---

## Scope Slice (v0.1)

This brain covers the following vertical slice:

L0 → L1 (Intake → IG → 40.2 → 40.3 → 40.4)
L4 → L6 (Structural Truth → Runtime Surface → LENS)

---

## Vertical Slice Flow

```
L0: Raw Source (external)
  ↓
L1: Intake → IG formation → 40.2 scan → 40.3 normalize → 40.4 handoff
  ↓
L2–L4: PiOS Core (derivation, semantic shaping) [not in this brain slice]
  ↓
L5: Activation (binding, projection)
  ↓
L6: Runtime Surface (GAUGE/LENS execution)
  ↓
L7: Demo packaging (narrative, guided view)
```

---

## Cross-Brain Pointers

- [[../code/01_CODE_INDEX]] — implementation surface
- [[../product/01_PRODUCT_MAP]] — product translation layer
- [[../publish/01_SITE_MAP]] — external projection layer
