---
type: stream-index
brain: canonical
---

# Stream Index

## Governed Streams — Scope Slice v0.1

| Stream ID | Layer | Status | Capsule |
|---|---|---|---|
| PRODUCTIZE.RAW.SOURCE.INTAKE.01 | L0→L1 | COMPLETE | [[streams/PRODUCTIZE.RAW.SOURCE.INTAKE.01]] |
| PRODUCTIZE.IG.FROM.INTAKE.01 | L1 | COMPLETE | [[streams/PRODUCTIZE.IG.FROM.INTAKE.01]] |
| PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01 | L1 | COMPLETE | [[streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01]] |
| PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01 | L1 | COMPLETE | [[streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.3.01]] |
| PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01 | L1 | COMPLETE | [[streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]] |
| PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01 | L6 | COMPLETE | [[streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]] |
| PRODUCTIZE.LENS | L5→L6 | ACTIVE | [[streams/PRODUCTIZE.LENS]] |

---

## Canonical Status Key

- COMPLETE — evidence closed, outputs locked, downstream consuming
- ACTIVE — in-flight, outputs not yet locked
- PENDING — authorized but not started
- DEPRECATED — superseded, evidence preserved

---

## Index Rules

- Each row corresponds to exactly one stream capsule
- Stream ID must not be renamed
- Status reflects current canonical state, not branch state
