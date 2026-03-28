# Derivation Boundary Audit & Enforcement Baseline

Stream: 40.13 — Derivation Boundary Audit & Enforcement Baseline
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 00.2 — Canonical Layer Model Restoration; Stream 40.12 — Derivation Ownership & Placement Correction
Status: GOVERNANCE AUDIT

────────────────────────────────────

## 1. Boundary Audit Purpose

This stream audits derivation boundary compliance across the current Program Intelligence system state.

It exists because Stream 40.12 established derivation ownership correction as a governance position. That position requires an audit baseline to be formally recorded so that future streams can detect, classify, and resolve boundary violations.

This stream does not design derivation. It does not specify how derivation works. It audits whether derivation ownership is currently placed correctly against the boundary baseline established in Stream 40.12 and the canonical layer model established in Stream 00.2.

────────────────────────────────────

## 2. Audit Scope

### Layers Under Review

All layers are audited for derivation boundary compliance:
- L3 — derivation ownership layer (primary subject)
- L4 — semantic shaping layer
- L5 — presentation assembly layer
- L6 — runtime experience layer
- L7 — demonstration layer
- L8 — governance, contract, and validation layer

### What Is Being Audited

- whether derivation ownership is placed at L3
- whether any layer outside L3 holds derivation ownership
- whether any layer outside L3 substitutes for, implies, or performs derivation
- whether tolerated deviations are explicitly named and bounded

### What Is Not Being Audited

- derivation formulas
- derivation thresholds
- derivation computational methods
- signal engineering decisions
- semantic shaping design
- UI or runtime behavior beyond ownership boundary
- demo choreography beyond ownership boundary
- code implementation

────────────────────────────────────

## 3. Boundary Baseline

The following layer baseline is authoritative and is not redefined by this stream.

**L3 — Derivation Ownership**
L3 is the only layer permitted to own derivation. All signal constructs, structural state markers, and derived metrics must be specified, governed, and produced at L3. No other layer may hold derivation ownership.

**L4 — Semantic Shaping Only**
L4 may shape the meaning presentation of L3-derived outputs. L4 may not produce governed signal constructs. L4 may not hold derivation ownership.

**L5 / L6 — Consumer and Presentation Only**
L5 and L6 may consume and present L3-derived outputs. L5 and L6 may not hold derivation ownership.

**L7 — Demonstration Only**
L7 may package and stage governed outputs for demonstration. L7 may not hold derivation ownership or substitute demonstration artifacts for derivation truth.

**L8 — Contractual Constraint Only**
L8 may constrain behavior, audit compliance, and govern execution. L8 may not hold derivation ownership or define how signals are derived.

────────────────────────────────────

## 4. Finding Classification Method

Each finding is classified as exactly one of the following.

**COMPLIANT**
The construct or layer is fully aligned with the boundary baseline. Derivation ownership is placed at L3. No ownership ambiguity is present. No derivation exists outside L3.

**VIOLATION**
Derivation is performed, implied, or substituted outside L3. A runtime, UI, demo, contract, or downstream layer holds or behaves as derivation owner. Ownership ambiguity creates active leakage risk. Violations are not tolerated and must be resolved.

**TOLERATED DEVIATION**
A temporary non-authoritative condition exists. The condition does not alter ownership truth. The condition is explicitly named as temporary. It must not be propagated into future streams. Tolerated deviations require resolution in a future specified stream.

────────────────────────────────────

## 5. Boundary Findings

### Finding 40.13-F1 — SSZ/SSI Derivation Placed at L6

Classification: VIOLATION

SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are signal-like constructs whose derivation ownership is currently placed at L6 (ExecLens runtime). No formal L3 derivation specification exists for either construct. Derivation ownership is absent at L3 and present at L6. This is a layer ownership violation under the boundary baseline.

---

### Finding 40.13-F2 — L6 Consumer Layer Holds Derivation Ownership

Classification: VIOLATION

L6 currently holds derivation ownership for SSZ and SSI in the absence of any L3 specification. A consumer layer holding derivation ownership constitutes a boundary violation regardless of the absence of upstream specification. The boundary violation exists independently of whether an L3 specification is eventually produced.

---

### Finding 40.13-F3 — L7 Carries Downstream Dependency on Unresolved L6 Ownership

Classification: TOLERATED DEVIATION

Stream 51 (L7) references SSZ for demonstration purposes. The SSZ derivation ownership source for that reference is the L6 mis-placement identified in F1. L7's dependency on an unresolved L6 ownership position is a tolerated deviation, not a new violation originating at L7. L7 does not hold derivation ownership. This deviation is temporary and must not be propagated. It is resolved when F1 is resolved.

---

### Finding 40.13-F4 — ESI Derivation Ownership Ungoverned

Classification: TOLERATED DEVIATION

ESI (Execution Signal Index or equivalent) is referenced in current program framing as a signal-like construct. No formal L3 derivation specification exists for ESI. No layer currently holds ESI derivation ownership in a formal sense. The construct exists in documentation as an unanchored reference. This is a tolerated deviation pending formal L3 specification. ESI must not be treated as governed until a formal L3 derivation specification is produced.

---

### Finding 40.13-F5 — L4 Semantic Shaping Without L3 Backing

Classification: TOLERATED DEVIATION

Executive Interpretation template rendering (currently at L6) produces executive-readable structural explanations from SSZ-derived fields. No formal L4 semantic shaping specification exists. The L4 layer is effectively absent for this construct. The current L6 template approach is a tolerated deviation: it is non-speculative and evidence-bound in practice, but it lacks formal L4 governance. This deviation must not be treated as compliant. It requires formal L4 specification to be resolved.

---

### Finding 40.13-F6 — L3 Derivation Specifications Absent

Classification: VIOLATION

No formal L3 derivation specification exists for SSZ, SSI, or ESI. L3 currently holds no formal derivation artifact for any signal-like construct referenced in current streams. Derivation without a formal L3 specification means derivation ownership is ungoverned system-wide. This constitutes a violation of the boundary baseline independent of where derivation physically executes.

---

### Finding 40.13-F7 — Contracts Remain Within L8 Boundary

Classification: COMPLIANT

Reviewed stream contracts (40.x, 42.x, 51) do not define signal derivation methods. Contracts constrain execution scope and confirm compliance. No contract currently holds derivation ownership or specifies how derivation is produced.

---

### Finding 40.13-F8 — Demo Constructs Remain Within L7 Boundary

Classification: COMPLIANT (with noted dependency on F3)

Stream 51 demo artifacts (killer shots, demo sequences, narrative rules) package and stage outputs for demonstration. They do not define derivation, produce governed signals, or substitute demo artifacts for derivation truth. Demo constructs are correctly scoped at L7. The noted dependency on F3 is recorded but does not alter this classification.

────────────────────────────────────

## 6. Enforcement Baseline

### Immediately Enforceable

The following boundaries are enforceable immediately against all current and future streams:

- No stream may place new derivation ownership outside L3
- No stream may introduce a new signal-like construct without a corresponding L3 derivation specification
- No stream may allow a consumer layer (L4–L7) to hold derivation ownership
- No contract (L8) may specify how derivation is produced
- No demo construct (L7) may substitute for derivation truth

### What Constitutes a Violation

A boundary violation is confirmed when any of the following conditions are present:

- A signal-like construct exists in any layer without a formal L3 derivation specification
- A consumer layer (L4–L7) holds derivation ownership
- A governance artifact (L8) defines signal derivation methods
- A demonstration construct (L7) generates or substitutes derivation truth

### What May Remain Temporarily Tolerated

The following tolerated deviations are accepted as temporary:

- F3 — L7 dependency on L6 SSZ ownership (temporary; resolves with F1)
- F4 — ESI ungoverned status (temporary; resolves when L3 ESI specification is produced)
- F5 — L4 semantic shaping absence for Executive Interpretation (temporary; resolves when formal L4 specification is produced)

Tolerated deviations must not be treated as compliant. They must not be extended or replicated in future streams.

### What Future Streams Must Not Reintroduce

- derivation ownership at L6 or any consumer layer
- signal-like constructs without L3 derivation anchors
- demo artifacts that hold derivation truth as a substitute
- contract prose that defines derivation logic
- semantic shaping that produces governed signals in the absence of L3 derivation

────────────────────────────────────

## 7. Downstream Impact

**Streams 40.2–40.12**
Lineage remains valid. No retroactive invalidation is applied. Where prior stream execution implied runtime-owned derivation, that implication is superseded by Stream 40.12 and confirmed by this audit.

**Streams 42.x**
42.x remains consumer-only. ExecLens (L6) holds no derivation ownership under this boundary baseline. The SSZ/SSI placement currently within 42.x-related runtime is a violation under F1 and F2. 42.x does not gain derivation ownership from this audit finding. Correction of that placement belongs to a future specification stream.

**Stream 51**
Stream 51 owns no computation logic. Stream 51 artifacts are correctly classified at L7. The tolerated deviation in F3 is acknowledged but does not alter Stream 51's classification.

**Stream 75.x**
Stream 75.x is not activated by this stream. No derivation specification, signal engineering, or future stream activation is performed here.

**Future L3 Derivation Specification**
Formal L3 derivation specification for SSZ, SSI, and ESI is not performed by this stream. This audit identifies that such specifications are required and that their absence constitutes violations under F1, F2, and F6. Specification work belongs to future governed streams.

────────────────────────────────────

## 8. Open Items

The following items are unresolved at stream close and remain explicitly open:

- F1/F2 — SSZ/SSI derivation ownership correction: requires formal L3 derivation specification; future stream not defined here
- F4 — ESI L3 derivation specification: ungoverned status must be resolved; future stream not defined here
- F5 — Formal L4 semantic shaping specification for Executive Interpretation: absent; future stream not defined here
- F6 — Absence of formal L3 derivation artifacts for any construct: system-wide; resolution requires a future derivation specification stream

Remediation ownership for each open item is not assigned by this stream. Derivation specification remains future work.

────────────────────────────────────

## 9. Final Position

This stream audits and formalizes derivation boundary compliance only.

It does not define derivation mechanics.
