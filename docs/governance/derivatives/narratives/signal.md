# Signal — Narrative Expansion

Stream: I.6 — Hardening Batch 01 (PROVISIONAL ROUTE ELIMINATION — SET A)
Phase: Canonical Gap Closure — Derivative Narrative
Entity: signal
Narrative Depth: standard (level 2)
Authority: nodes/signal_infrastructure.md | category_structure_model.md | construct_positioning_map.md | pios_architecture_whitepaper.md (L3)
Date: 2026-03-31

---

## Signal

### Definition

A governed transformation output produced by Signal Infrastructure from normalized execution evidence. An execution signal is a bounded, derivation-traceable artifact that characterizes an observable dimension of program execution behavior. Signals are the intermediate layer between raw execution telemetry and the analytical constructs that produce program intelligence.

### What It Is

The formal output class of the signal extraction function. Where Signal Infrastructure is the governed pipeline that performs extraction, Signal is the category of what that pipeline produces — a structured, evidence-bound characterization of a specific execution dimension.

An execution signal has three defining properties:

1. **Evidence-bound:** Every signal must be traceable to normalized execution telemetry inputs. A signal that cannot be traced to governed evidence is not a signal — it is an assertion.

2. **Dimension-specific:** Each signal characterizes a single bounded dimension of program execution behavior. Signals do not combine dimensions or produce composite assessments. That function belongs to the analytical constructs (ESI, RAG) that sit above the signal layer.

3. **Derivation-governed:** Signals are produced by formal derivation rules, not by interpretive judgment. The derivation logic is specified at L3 of the canonical layer model (Stream 40.16). Given the same governed inputs and the same governed rules, the same signal must be produced. Signals are deterministic.

Three canonical signal categories are produced by Signal Infrastructure:

- **Structural Pressure** — characterizes the degree to which the program's delivery architecture is operating under accumulated load beyond its stable range. Derives from schedule, flow, and capacity dimensions of execution telemetry.

- **Delivery Divergence** — characterizes the degree to which actual delivery trajectories are separating from expected patterns. Derives from completion rates, throughput, and predictability dimensions of execution telemetry.

- **Risk Propagation** — characterizes the degree to which instability conditions are spreading across program boundaries. Derives from cross-domain risk pattern dimensions of execution telemetry.

These three categories are the canonical signal layer that ESI and RAG consume as their derivation inputs.

### What It Is Not

- Not raw telemetry. Signals are produced from telemetry — they are not the telemetry itself. Raw engineering data (activity counts, commit rates, ticket volumes) are L0 evidence; signals are L3 derivation outputs.
- Not a product. The Signäl product consumes signals at L6 — it does not produce them. The naming overlap between "signal" and "Signäl" is intentional at the product level but must not create confusion about entity ownership. The entity "Signal" belongs to the discipline; the product "Signäl" is a surface that renders what the discipline produces.
- Not an analytical construct. ESI and RAG are constructs built from signals — they are not signals themselves. Constructs aggregate and combine signals to produce composite assessments. Signals are the pre-aggregation layer.
- Not an interpretation. A signal characterizes an observable condition. It does not explain what that condition means for the program. Interpretation belongs to the semantic shaping layer (L4) and above.
- Not independent of Signal Infrastructure. Signals cannot be produced outside the governed Signal Infrastructure pipeline. A signal that bypasses the extraction, normalization, and derivation pipeline is not a governed signal.

### Role in Program Intelligence

Signal is the intermediate analytical layer of Program Intelligence — the output of extraction, the input to analysis. Its role is to make execution telemetry interpretable at the program level without yet making it interpretable at the executive level.

The structural flow:

```
Execution Telemetry (L0–L1)
    ↓ ingested and normalized by
Signal Infrastructure
    ↓ extracts and structures into
Signal Layer (Structural Pressure · Delivery Divergence · Risk Propagation)
    ↓ consumed by
Analytical Constructs (ESI · RAG)
    ↓ produce
Program Intelligence outputs (composite scores · dynamics measurements)
```

Without the signal layer, analytical constructs would have to operate directly on raw telemetry — which would require each construct to perform its own normalization and extraction, violating the separation of concerns that governs the pipeline. The signal layer exists precisely to prevent this collapse.

### Relationship to Signal Infrastructure

Signal Infrastructure is the governed pipeline that produces signals. Signal is the category of artifacts that pipeline produces. The relationship is producer-to-output-class:

- Signal Infrastructure owns the pipeline (evidence_intake → normalization → signal_derivation → analytical_output → intelligence_delivery)
- Signal is the output of the signal_derivation stage of that pipeline
- Signal Infrastructure is a named capability construct; Signal is a named output class
- Signals cannot be defined or produced outside Signal Infrastructure — the constraint stated in construct_positioning_map.md applies: execution signals must not exist outside Signal Infrastructure context

### Relationship to Analytical Constructs (ESI / RAG)

ESI and RAG are the analytical constructs that consume signals as their derivation inputs.

**Execution Stability Index (ESI):**
ESI aggregates the Structural Pressure and Delivery Divergence signal categories (along with additional dimension signals) into a single composite 0–100 stability score. ESI is not a signal — it is a construct built from signals. The signal layer is a necessary precondition for ESI computation. ESI cannot be computed without governed signals as input.

**Risk Acceleration Gradient (RAG):**
RAG measures how signals change across temporal windows — rate of change, acceleration, and the Risk Propagation signal category's cross-boundary dimension. RAG is not a signal — it is a dynamics measurement construct built from signal change patterns. The signal layer is a necessary precondition for RAG computation.

Both constructs are Category Primitives in the construct_positioning_map.md with Signal Infrastructure (and by extension the Signal layer) as their parent context. Neither may be produced or projected outside that context.

### Signal Formation Model

Signals are formed through a governed three-step derivation process:

1. **Telemetry binding** — normalized execution telemetry inputs are bound to the signal's derivation specification. The telemetry requirement classes (TC-01 through TC-08, defined in Stream 40.16) specify which telemetry types are required for each signal category. Missing telemetry activates PARTIAL mode — the signal is produced from the available subset with renormalized weights.

2. **Dimension computation** — each signal dimension is computed from its bound telemetry inputs using the governed derivation rules specified at L3. Computation is deterministic. No interpretive step is introduced at this stage.

3. **Signal output** — the computed dimension value is output as a bounded artifact with derivation lineage preserved. The artifact carries: the dimension category, the computed value, the temporal window, the telemetry inputs used, and the PARTIAL flag if applicable.

Signals are stateless outputs of this process. They do not carry forward interpretations from prior windows. Temporal reasoning (acceleration, trend) belongs to the RAG construct layer, not to the signal formation layer.

### Claim Boundary

Signal claims are bounded to:

- The characterization of observable execution dimensions from governed evidence
- The structural relationship to Signal Infrastructure (pipeline context) and analytical constructs (consumption)
- The three canonical signal categories as the formal output class

Signal claims must not:

- Assert that a signal value predicts program outcomes — signals characterize current observable conditions, not future states
- Assert that the three signal categories represent the complete set of all possible execution signals — they are the canonicalized production set under Phase 1
- Position signals as equivalent to the analytical constructs (ESI, RAG) that consume them
- Claim signal production independent of the Signal Infrastructure pipeline

Mandatory framing: all signal claims must reference the governed derivation origin and the telemetry input class. No signal value may be presented as a standalone metric without its derivation context.

### Canonical Source

Authority container status: established. The signal layer is formally specified in the L3 derivation layer of the canonical layer model (pios_architecture_whitepaper.md §L3): "Signal derivation belongs at L3. All signal constructs, structural state markers, and derived metrics must be specified, governed, and produced here." The three signal categories are defined through the Signal Infrastructure narrative (I.6 GAP-05 closure) and the Stream 40.16 derivation specification.

Sources:
- pios_architecture_whitepaper.md — L3 derivation layer definition; placement rule for signal derivation
- docs/pios/40.16/ — derivation specifications for signal inputs (TC-01..TC-08), ESI primary execution signals (PES-ESI-01..05), RAG components
- category_structure_model.md — signal layer position (Signal Infrastructure → Execution Signals)
- construct_positioning_map.md — parent classification for ESI and RAG; signal context constraint
- nodes/signal_infrastructure.md — pipeline structure and output class definition
- Authority codes: CKR-001 | CKR-005 | CAT-00 | GOV-00
