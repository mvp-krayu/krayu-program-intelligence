# Signal Infrastructure — Narrative Expansion

Stream: I.6 — GAP-05 Closure (RESEARCH-CANONICAL-EXTRACTION-01)
Phase: Canonical Gap Closure — Derivative Narrative
Entity: signal_infrastructure
Narrative Depth: standard (level 2)
Authority: nodes/signal_infrastructure.md | category_structure_model.md | construct_positioning_map.md
Gap Register: GAP-05
Date: 2026-03-31

---

## Signal Infrastructure

### Definition

Governed capability layer through which Program Intelligence converts raw execution evidence from engineering activity into structured analytical signals. Operates between the source telemetry layer and the analytical construct layer. Every signal produced is bounded by verifiable source inputs and defined derivation logic.

### What It Is

The signal extraction and structuring function of Program Intelligence. Operational delivery patterns contain early indicators of program instability. Signal Infrastructure is the layer that identifies, extracts, and structures those indicators into outputs that the analytical construct layer can consume.

It produces three categories of signal:

**Structural Pressure** — indicators that the program's delivery architecture is operating under load beyond its stable range. Reflects accumulated schedule, flow, and capacity constraints across program dimensions.

**Delivery Divergence** — indicators that actual delivery trajectories are separating from expected patterns. Captures deviation in predictability, completion rates, and throughput across delivery domains.

**Risk Propagation** — indicators that instability is spreading across program boundaries. Measures whether risk conditions are contained within their origin domain or are crossing into adjacent program areas.

These three signal categories are not independent metrics. They are the structured output of signal extraction applied to execution telemetry — inputs to the analytical constructs (ESI and RAG) that sit above Signal Infrastructure in the Program Intelligence model.

Operationalized through PiOS. All signal production follows the five-stage pipeline: evidence intake → normalization → signal derivation → analytical output → intelligence delivery. Each stage is governed; outputs at each boundary are traceable to source inputs.

### What It Is Not

- Not a top-level authority node. Signal Infrastructure is a depth-1 entity under Program Intelligence, not a standalone discipline construct.
- Not a product surface. Signal Infrastructure is the governed capability; the product surface through which signals are accessed is signal_platform. These are distinct entities.
- Not a data warehouse or observability tool. Signal Infrastructure does not store raw engineering data or produce operational metrics. It produces structured program-level signals — not engineering-level measurements.
- The normalization stage is an internal pipeline function, not a separate derivative entity.
- The five-stage pipeline stages (evidence_intake, normalization, signal_derivation, analytical_output, intelligence_delivery) are internal operational steps — not separate derivative entities in the Phase 1 inventory.
- Does not define or own the analytical constructs (ESI, RAG). Signal Infrastructure produces the inputs that ESI and RAG consume. The constructs themselves are separate derivative entities under Signal Infrastructure in the category structure.
- Does not resolve execution_blindness directly. Signal Infrastructure produces the signals; the analytical constructs (ESI, RAG) are what make those signals interpretable to leadership.

### Role in Program Intelligence

Signal Infrastructure is the operational bridge between raw engineering telemetry and the analytical constructs that program leadership consumes. Without it, the structural gap described by program_intelligence_gap cannot be closed — raw telemetry cannot be directly consumed by executive decision-making, and no structured signal exists for ESI or RAG to compute.

Its structural role in the category model:

```
Program Intelligence Gap
    ↓ drives need for
Signal Infrastructure
    ↓ produces
Execution Signals (ESI, RAG)
    ↓ expose and resolve
Execution Blindness
```

Signal Infrastructure sits at the point where the interpretive translation happens. It does not produce executive insight directly — it produces the structured signal layer that analytical constructs convert into insight.

The constraint stated in construct_positioning_map.md applies: execution signals must not exist outside Signal Infrastructure context. ESI and RAG are not free-standing metrics. They are Signal Infrastructure outputs.

### Relationship to PiOS

Signal Infrastructure is operationalized through PiOS — the Program Intelligence Operating System. PiOS owns the execution of all five pipeline stages. Signal Infrastructure is the governed capability; PiOS is the operational system through which that capability is realized.

This relationship is not circular: Signal Infrastructure defines what must be produced and the governed rules for producing it; PiOS defines how those rules are executed at the operational layer. The distinction mirrors the doctrine/implementation separation throughout the Program Intelligence model.

### Relationship to Analytical Constructs (ESI / RAG)

Signal Infrastructure is the structural parent of both analytical constructs in the category model. The relationship is directional and non-substitutable:

**Execution Stability Index (ESI):**
Consumes the Signal Infrastructure output layer as its derivation input. ESI converts multi-dimensional signals — including structural pressure and delivery divergence outputs — into a composite 0–100 stability score. ESI cannot be computed without Signal Infrastructure producing its input signals. The relationship is production (Signal Infrastructure →[P] ESI).

**Risk Acceleration Gradient (RAG):**
Consumes the Signal Infrastructure output layer for its dynamics computation. RAG measures how signals change across temporal windows — rate of change, acceleration, and cross-boundary propagation. The risk propagation signal category is the direct RAG input. The relationship is production (Signal Infrastructure →[P] RAG).

Both constructs are Category Primitives under Signal Infrastructure. Neither can exist or be projected outside the Signal Infrastructure context.

### Structural Components

Three canonical signal dimensions produced by Signal Infrastructure:

| Dimension | Description | Primary Consumer |
|---|---|---|
| Structural Pressure | Accumulated delivery load indicators across schedule, flow, and capacity dimensions | ESI (stability composite) |
| Delivery Divergence | Trajectory separation indicators across predictability, completion, and throughput | ESI (predictability dimensions) |
| Risk Propagation | Cross-boundary instability spread indicators | RAG (propagation component) |

These dimensions are the named outputs of the signal extraction function. They are not enumerated as separate derivative entities — they are the structured signal categories that Signal Infrastructure produces and that ESI/RAG consume.

### Claim Boundary

Signal Infrastructure claims are bounded to:

- The signal extraction and structuring function (what is produced and by what governed process)
- The structural relationship to PiOS (operationalization), ESI and RAG (outputs), and execution_blindness (resolution path)
- The three signal dimensions as named outputs

Signal Infrastructure claims must not:

- Assert that signal production predicts program outcomes
- Assert that the three signal dimensions represent complete program state
- Position Signal Infrastructure as a replacement for engineering monitoring or observability
- Claim signal production independent of telemetry input bounds

Mandatory framing: all signal production claims must reference the telemetry input origin (implicit or explicit) and the governed derivation pipeline. No signal output may be presented as standalone.

### Canonical Source

Authority container status: established. Signal Infrastructure is explicitly named in category_structure_model.md as the structural parent of execution signals and in construct_positioning_map.md as the parent classification for ESI and RAG. The derivative node (nodes/signal_infrastructure.md) is complete at maturity level COMPLETE.

Sources:
- category_structure_model.md — structural parent position in the Program Intelligence category model
- construct_positioning_map.md — parent classification for ESI (Execution Signal / Stability Measurement Dimension) and RAG (Execution Signal / Acceleration Measurement Dimension)
- nodes/signal_infrastructure.md — derivative node definition, relationships, and boundaries
- program_intelligence_stack.md — signal extraction role in stack architecture
- Authority codes: CKR-001 | CKR-005 | CAT-00 | GOV-00
